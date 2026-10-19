import { buildLrcResearchProgramProjection, LRC_RESEARCH_SOURCE } from "@/modules/research-sandbox/math-lrc-research-program";
import { isLrcResearchProgramRecord } from "@/components/research/math-lrc-research-cockpit-family";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { mathPilotContractSchema, digestMathPilotContract, MATH_LRC_METHOD_UNIT_CONTRACT } from "@/modules/research-sandbox/math-pilot";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { assertLrcMethodUnitAttemptBinding } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { validateRecordedMathAgentReview } from "@/modules/research-sandbox/agent-review";
import type { LrcMethodUnitSourcePins } from "@/modules/research-sandbox/math-lrc-method-unit";

export type LrcResearchCockpitRecord = {
  caseId: string; runId: string; runStatus?: string | null; reviewJobStatus?: string | null;
  contract: unknown; contractDigest: string; attempt: unknown; attemptDigest: string | null;
  researchDigest: string; review: unknown;
  finiteSourcePins?: LrcMethodUnitSourcePins; reviewJobId?: string;
};

/** Pure baseline projection. Retained run admission is attached separately; no tool or IO fallback. */
export function projectLrcResearchCockpitPresentation(record?: LrcResearchCockpitRecord | null) {
  const isMethod = !!record && isLrcResearchProgramRecord(record.contract, record.attempt,
    record.review && typeof record.review === "object" ? (record.review as { ledger?: unknown }).ledger : null);
  const contract = mathPilotContractSchema.safeParse(record?.contract);
  const contractValid = !!record && contract.success && contract.data.version === 4 &&
    digestMathPilotContract(contract.data) === record.contractDigest && canonicalJson(contract.data) === canonicalJson(MATH_LRC_METHOD_UNIT_CONTRACT);
  const strategy = contractValid && contract.success ? contract.data.lrcMethodUnitScope! : null;
  const program = buildLrcResearchProgramProjection({ ...(strategy ? { mode: strategy.mode, trustPolicy: strategy.trustPolicy } : {}) });
  const attempt = mathModelAttemptSchema.safeParse(record?.attempt);
  let admitted = false;
  if (contractValid && record && attempt.success && record.attemptDigest && digestResearchResult(attempt.data) === record.attemptDigest) {
    try { assertLrcMethodUnitAttemptBinding(attempt.data, { contractDigest: record.contractDigest, caseId: record.caseId, runId: record.runId, requestedModelName: "gpt-6-sol" }); admitted = true; } catch { /* independent passive binding refusal */ }
  }
  const candidate = (() => {
    try { return admitted && record?.reviewJobId && record.finiteSourcePins ? validateRecordedMathAgentReview({ ...record, review: record.review as Parameters<typeof validateRecordedMathAgentReview>[0]["review"] }) : null; }
    catch { return null; }
  })();
  const ledger = candidate?.version === 7 ? candidate : null;
  const evidence = admitted && attempt.success ? attempt.data.lrcMethodUnitEvidence! : null;
  const roles = admitted && attempt.success ? [{ role: "SOLVER" as const, input: evidence!.solverInput,
    requestedModel: attempt.data.modelName, context: attempt.data.threadId, usage: attempt.data.usage,
    text: attempt.data.argument, result: attempt.data.attemptType, gap: attempt.data.limitations.join("\n"),
    checks: attempt.data.selfChecks, feedback: attempt.data.lrcMethodUnitFeedback!, quote: null as string | null,
    quoteMatches: null as boolean | null }, ...(ledger ? ledger.reports.map(report => ({ role: report.role,
      input: report.lrcMethodUnitInput, requestedModel: report.lrcMethodUnitInput.requestedModelName,
      context: report.threadId, usage: report.usage, text: report.reasoning, result: report.verdict,
      gap: report.unresolvedGap, checks: report.checks, feedback: report.lrcMethodUnitFeedback,
      quote: report.exactQuote, quoteMatches: attempt.data.argument.includes(report.exactQuote) })) : [])] : [];
  const recordState = !isMethod ? "NOT_RECORDED" as const : !contractValid || record?.attempt != null && !admitted ? "INVALID" as const
    : admitted ? "ADMITTED" as const : "MISSING" as const;
  return { program, source: LRC_RESEARCH_SOURCE, isMethod, recordState, strategy, finiteEvidence: ledger?.lrcMethodUnitFiniteEvidence ?? null, roles,
    ledger, reviewState: ledger ? "VALID" as const : record?.review ? "INVALID" as const : "MISSING" as const,
    digests: contractValid && record ? { contract: record.contractDigest, unit: strategy!.unitDigest,
      source: evidence?.sourceDataDigest ?? null, evidence: evidence?.evidenceDigest ?? null,
      attempt: admitted ? record.attemptDigest : null, finite: ledger?.lrcMethodUnitFiniteEvidence.recordDigest ?? null,
      ledger: ledger ? (record.review as { ledgerDigest: string }).ledgerDigest : null } : null,
    runStatus: typeof record?.runStatus === "string" && ["QUEUED", "RUNNING", "AWAITING_REVIEW", "APPROVED", "REJECTED", "FAILED"].includes(record.runStatus) ? record.runStatus : "UNAVAILABLE",
    reviewJobStatus: typeof record?.reviewJobStatus === "string" && ["PENDING", "READY", "RUNNING", "SUCCEEDED", "DEAD_LETTER", "FAILED"].includes(record.reviewJobStatus) ? record.reviewJobStatus : "UNAVAILABLE",
    operationalCause: "UNKNOWN" as const,
    historical064: record?.caseId === "b396580a-7bc7-4a8d-a966-0ad3eaa3e246",
    caseId: record?.caseId ?? null, runId: record?.runId ?? null };
}
export type LrcResearchCockpitPresentation = ReturnType<typeof projectLrcResearchCockpitPresentation>;
