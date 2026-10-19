import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { MATH_LRC_PROOF_UNIT_CONTRACT, digestMathPilotContract, mathPilotContractSchema } from "@/modules/research-sandbox/math-pilot";
import { validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";
import { assertLrcProofUnitAttemptBinding } from "@/modules/research-sandbox/math-lrc-proof-unit-live";

const object = (value: unknown): Record<string, unknown> | null => value && typeof value === "object" && !Array.isArray(value)
  ? value as Record<string, unknown> : null;
const marker = (value: unknown) => {
  const record = object(value);
  return !!record && ["lrcProofUnitScope", "lrcProofUnitEvidence", "lrcProofUnitFeedback", "lrcProofUnitFindings", "lrcProofUnitInput",
    "proofUnitScope", "proofUnitEvidence", "proofUnitAuditStatus", "proofUnitAuditSummary", "proofUnitSummary", "proofUnitBindings", "proofUnitEvidenceValid"].some(key => key in record);
};

/** Classification is deliberately wider than admission: broken new records must not regain old actions. */
export function isLrcProofUnitRunRecord(contract: unknown, attempt?: unknown, ledger?: unknown): boolean {
  const c = object(contract), l = object(ledger);
  return !!(c?.version === 3 || c?.version === "3" || l?.version === 6 || l?.version === "6" ||
    marker(contract) || marker(attempt) || marker(ledger) || marker(l?.reports) || marker(l?.oracle) ||
    Array.isArray(l?.reports) && l.reports.some(marker));
}

type ReadInput = Parameters<typeof validateRecordedMathAgentReview>[0];
export type LrcProofUnitRunPresentationInput = ReadInput & { caseId: string; runId: string; runStatus?: string | null; reviewJobStatus?: string | null };
const usageValid = (usage: {inputTokens:number;cachedInputTokens:number;outputTokens:number;reasoningOutputTokens:number}) =>
  usage.cachedInputTokens <= usage.inputTokens && usage.reasoningOutputTokens <= usage.outputTokens;
const status = (raw: unknown, values: readonly string[]) => typeof raw === "string" && values.includes(raw) ? raw : null;

/** Retained binding checks only. No importer, scalar check, preparation dispatch or provider call. */
export function projectLrcProofUnitRunPresentation(input: LrcProofUnitRunPresentationInput) {
  if (!isLrcProofUnitRunRecord(input.contract, input.attempt, input.review?.ledger)) return null;
  const contract = mathPilotContractSchema.safeParse(input.contract);
  const contractValid = contract.success && contract.data.version === 3 &&
    digestMathPilotContract(contract.data) === input.contractDigest && canonicalJson(contract.data) === canonicalJson(MATH_LRC_PROOF_UNIT_CONTRACT);
  const attempt = mathModelAttemptSchema.safeParse(input.attempt);
  let admitted = false;
  if (contractValid && attempt.success && input.attemptDigest && digestResearchResult(attempt.data) === input.attemptDigest && usageValid(attempt.data.usage)) {
    try {
      assertLrcProofUnitAttemptBinding(attempt.data, { contractDigest: input.contractDigest,
        caseId: input.caseId, runId: input.runId, requestedModelName: attempt.data.modelName });
      admitted = attempt.data.providerName === "codex-local";
    } catch { /* Refuse mismatched external IDs, source, prepared input, usage or complete findings. */ }
  }
  const candidate = (() => { try { return admitted ? validateRecordedMathAgentReview(input) : null; } catch { return null; } })();
  const ledger = candidate?.version === 6 && candidate.reports.every(report => usageValid(report.usage)) ? candidate : null;
  const state = !contractValid || input.attempt != null && !admitted ? "INVALID" as const
    : admitted ? "ADMITTED" as const : "MISSING" as const;
  const reviewState = ledger ? "VALID" as const : input.review ? "INVALID" as const : "MISSING" as const;
  const evidence = admitted && attempt.success ? attempt.data.lrcProofUnitEvidence! : null;
  const roles = admitted && attempt.success ? [{ role: "SOLVER" as const, input: evidence!.solverInput,
    requestedModel: attempt.data.modelName, threadId: attempt.data.threadId, usage: attempt.data.usage,
    result: attempt.data.attemptType, text: attempt.data.argument, gap: attempt.data.limitations.join("\n"), checks: attempt.data.selfChecks,
    feedback: attempt.data.lrcProofUnitFeedback!, quote: null as string | null, quoteMatches: null as boolean | null }, ...(ledger ? ledger.reports.map(report => ({
      role: report.role, input: report.lrcProofUnitInput!, requestedModel: ledger.reviewerModels!.find(model => model.role === report.role)!.requestedModelName,
      threadId: report.threadId, usage: report.usage, result: report.verdict, text: report.reasoning,
      gap: report.unresolvedGap, checks: report.checks, feedback: report.lrcProofUnitFeedback!, quote: report.exactQuote,
      quoteMatches: attempt.data.argument.includes(report.exactQuote),
    })) : [])] : [];
  return { state, reviewState, evidence, ledger, roles,
    runStatus: status(input.runStatus, ["QUEUED", "RUNNING", "AWAITING_REVIEW", "APPROVED", "REJECTED", "FAILED"]),
    jobStatus: status(input.reviewJobStatus, ["PENDING", "READY", "RUNNING", "SUCCEEDED", "DEAD_LETTER", "FAILED"]),
    caseId: input.caseId, runId: input.runId,
    digests: contractValid ? { contract: input.contractDigest, packet: evidence?.packetDigest,
      source: evidence?.sourceDataDigest, evidence: evidence?.evidenceDigest, attempt: admitted ? input.attemptDigest : null,
      research: ledger ? input.researchDigest : null, ledger: ledger ? input.review?.ledgerDigest : null } : null };
}
