import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { MATH_LRC_METHOD_UNIT_CONTRACT, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { digestMathAgentLedger } from "@/modules/research-sandbox/agent-review";
import { LRC_FEW_EXCEPTION_SHIFT_UNIT, buildLrcMethodUnitFiniteEvidence } from "@/modules/research-sandbox/math-lrc-method-unit";
import { createLrcMethodUnitLiveEvidence, prepareLrcMethodUnitSolverInput, prepareLrcMethodUnitReviewInput, type LrcMethodUnitFeedback } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { lrcMethodUnitLedgerReference, lrcMethodUnitLedgerSchema, evaluateLrcMethodUnitReview } from "@/modules/research-sandbox/math-lrc-method-unit-review";
import type { LrcResearchCockpitRecord } from "@/components/research/math-lrc-research-cockpit-presentation";

/** Synthetic role outputs, real NEW bounded finite fixture; no provider, DB or historical replay. */
export function cockpitFixture(options: { missingSeed?: boolean; ungroundedQuote?: boolean; literal?: string } = {}): LrcResearchCockpitRecord {
  const contract = MATH_LRC_METHOD_UNIT_CONTRACT, contractDigest = digestMathPilotContract(contract);
  const binding = { contractDigest, caseId: "fixture-new-case", runId: "fixture-new-run", requestedModelName: "gpt-6-sol" };
  const pins = { producerSourceSha256: sha256("OFFLINE_SOURCE_REGISTRY_FIXTURE"), checkerSourceSha256: sha256("OFFLINE_SOURCE_REGISTRY_FIXTURE") };
  const feedback: LrcMethodUnitFeedback = { version: 1, auditStatus: "REVIEWED_CONDITIONAL", summary: "Known conditional lemma; real/lower debts remain.",
    premiseFindings: LRC_FEW_EXCEPTION_SHIFT_UNIT.premiseIds.map(id => ({ id, status: "CONDITIONAL", reason: "Conditional premise retained, not independently established." })),
    stepFindings: LRC_FEW_EXCEPTION_SHIFT_UNIT.stepIds.map(id => ({ id, status: "CONDITIONAL", reason: "Statement-aligned conditional reasoning, not truth by vote." })) };
  const usage = { inputTokens: 1234, cachedInputTokens: 123, outputTokens: 789, reasoningOutputTokens: 456 };
  const attempt = mathModelAttemptSchema.parse({ providerName: "codex-local", modelName: "gpt-6-sol", threadId: "solver-context",
    attemptType: "PARTIAL", argument: "Conditional union bound leaves a common good shift; lower witnesses remain assumptions. b^-1*t date2026-10-04",
    candidateCounterexample: null, selfChecks: [options.literal ?? "Model-stated check, not independent proof"], limitations: ["Real-time and lower LRC premises remain conditional."], usage,
    lrcMethodUnitFeedback: feedback, lrcMethodUnitFiniteSeed: options.missingSeed ? null : { d: 3, e: 2, unitResidues: [1, 1],
      offsets: [{ numerator: "1", denominator: "30" }, { numerator: "1", denominator: "3" }] },
    lrcMethodUnitEvidence: createLrcMethodUnitLiveEvidence({ solverInput: prepareLrcMethodUnitSolverInput(binding) }) });
  const attemptDigest = sha256(canonicalJson(attempt));
  const roleOutput = (role: "ADVERSARY" | "CRITIC") => ({ role, verdict: "SUPPORTS" as const, candidateConclusion: "PARTIAL" as const,
    exactQuote: options.ungroundedQuote && role === "CRITIC" ? "UNMATCHED_CRITIC_QUOTE" : "Conditional union bound leaves a common good shift",
    reasoning: "The conditional source argument does not establish the real-time witness or a global LRC theorem.",
    checks: [options.literal ?? "Model-stated review check"], unresolvedGap: null, threadId: `${role}-context`, usage,
    lrcMethodUnitFeedback: feedback });
  const adversary = { ...roleOutput("ADVERSARY"), lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...binding, role: "ADVERSARY", solverAttempt: attempt, solverAttemptDigest: attemptDigest }) };
  const reviewJobId = "fixture-review-job";
  const finite = buildLrcMethodUnitFiniteEvidence({ seed: attempt.lrcMethodUnitFiniteSeed, pins, binding: {
    caseId: binding.caseId, runId: binding.runId, contractDigest, reviewJobId, solverAttemptDigest: attemptDigest,
    adversaryReportDigest: sha256(canonicalJson(adversary)) } });
  const critic = { ...roleOutput("CRITIC"), lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...binding, role: "CRITIC", solverAttempt: attempt,
    solverAttemptDigest: attemptDigest, finiteEvidence: finite, finiteSourcePins: pins }) };
  const reports: [typeof adversary, typeof critic] = [adversary, critic];
  const outcome = evaluateLrcMethodUnitReview({ ...binding, attempt, reports, finiteEvidence: finite, finiteSourcePins: pins, reviewJobId });
  const ledger = lrcMethodUnitLedgerSchema.parse({ version: 7, ...outcome, reports,
    reviewerModels: reports.map(report => ({ role: report.role, providerName: "codex-local", requestedModelName: "gpt-6-sol", identityEvidence: "REQUESTED_CLI_MODEL", threadId: report.threadId })),
    lrcMethodUnitEvidence: lrcMethodUnitLedgerReference(attempt.lrcMethodUnitEvidence), lrcMethodUnitFiniteEvidence: finite });
  const researchDigest = sha256("OFFLINE_RESEARCH_RECORD_FIXTURE");
  return structuredClone({ ...binding, contract, contractDigest, attempt, attemptDigest, researchDigest,
    finiteSourcePins: pins, reviewJobId, runStatus: "AWAITING_REVIEW", reviewJobStatus: "SUCCEEDED",
    review: { disposition: ledger.disposition, conclusion: ledger.conclusion, contractDigest, attemptDigest, researchDigest,
      ledger, ledgerDigest: digestMathAgentLedger(ledger) } });
}
