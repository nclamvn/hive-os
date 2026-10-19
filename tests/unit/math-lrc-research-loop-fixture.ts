import { LRC_LOOP_FIXED_REPRODUCTION_PREDICATE } from "@/modules/research-sandbox/math-lrc-research-loop";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { cockpitFixture } from "./math-lrc-research-cockpit-fixture";
import { createLrcMethodUnitLiveEvidence, prepareLrcMethodUnitSolverInput, prepareLrcMethodUnitReviewInput } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { buildLrcMethodUnitFiniteEvidence } from "@/modules/research-sandbox/math-lrc-method-unit";
import { evaluateLrcMethodUnitReview, lrcMethodUnitLedgerReference, lrcMethodUnitLedgerSchema } from "@/modules/research-sandbox/math-lrc-method-unit-review";
import { digestMathAgentLedger } from "@/modules/research-sandbox/agent-review";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";

const H = (s: string) => sha256(s), clone = <T>(v: T): T => structuredClone(v);
export const predicateA = structuredClone(LRC_LOOP_FIXED_REPRODUCTION_PREDICATE);
export const predicateB = { ...predicateA, statement: "Under explicit overlap assumption, two distinct good shifts exist", assumptions: [...predicateA.assumptions, "EXPLICIT_OVERLAP"] };
export const invocation = { roleWallMs: 2000, inputBytes: 49152, streamBytes: 1048576, finiteBytes: 32768, integerBits: 256, checkerMs: 5000, checkerOperations: 2000000, primes: [3] };
export const usage = { roleCalls: 3, inputTokens: 3702, outputTokens: 2367, wallMs: 10000, toolCalls: 1, checkerCalls: 1, primeChecks: 1, invocation };
export const candidateA = { id: "a", predicate: predicateA, targetedObligationId: "FEW_EXCEPTION_SHIFT_14", mode: "REPRODUCTION", eligible: true, requiredUsage: usage, discovery: null };
export const candidateB = { id: "b", predicate: predicateB, targetedObligationId: "FEW_EXCEPTION_SHIFT_14", mode: "DISCOVERY", eligible: true, requiredUsage: usage, discovery: { differenceFromSource: "Additional exact overlap assumption", falsification: "Find allowed tuple with fewer than two good shifts", expectedGain: "Resolve a new structural overlap condition", strongestObjection: "The overlap premise may already imply conclusion", novelty: "PENDING" } };

/** Reuse the old fixture read-only, generating a second NEW synthetic lineage. */
export function fixture(index: number) {
  const base = cockpitFixture(), binding = { contractDigest: base.contractDigest, caseId: `loop-fixture-case-${index}`, runId: `loop-fixture-run-${index}`, requestedModelName: "gpt-6-sol" as const };
  const baseAttempt = mathModelAttemptSchema.parse(base.attempt);
  const baseReview = z.object({ disposition: z.string(), conclusion: z.string(), contractDigest: z.string(), attemptDigest: z.string(), researchDigest: z.string(), ledger: z.unknown(), ledgerDigest: z.string() }).strict().parse(base.review);
  const attempt = mathModelAttemptSchema.parse({ ...baseAttempt, threadId: `loop-solver-${index}`, lrcMethodUnitEvidence: createLrcMethodUnitLiveEvidence({ solverInput: prepareLrcMethodUnitSolverInput(binding) }) });
  const attemptDigest = H(canonicalJson(attempt));
  const prior = lrcMethodUnitLedgerSchema.parse(baseReview.ledger);
  const adversary = { ...prior.reports[0], threadId: `loop-adversary-${index}`, lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...binding, role: "ADVERSARY", solverAttempt: attempt, solverAttemptDigest: attemptDigest }) };
  const reviewJobId = `loop-review-job-${index}`;
  const finite = buildLrcMethodUnitFiniteEvidence({ seed: attempt.lrcMethodUnitFiniteSeed, pins: base.finiteSourcePins!, binding: { caseId: binding.caseId, runId: binding.runId, contractDigest: binding.contractDigest, reviewJobId, solverAttemptDigest: attemptDigest, adversaryReportDigest: H(canonicalJson(adversary)) } });
  const critic = { ...prior.reports[1], threadId: `loop-critic-${index}`, lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...binding, role: "CRITIC", solverAttempt: attempt, solverAttemptDigest: attemptDigest, finiteEvidence: finite, finiteSourcePins: base.finiteSourcePins! }) };
  const reports = [adversary, critic] as const;
  const outcome = evaluateLrcMethodUnitReview({ ...binding, attempt, reports, finiteEvidence: finite, finiteSourcePins: base.finiteSourcePins!, reviewJobId });
  const ledger = lrcMethodUnitLedgerSchema.parse({ ...prior, ...outcome, reports, reviewerModels: reports.map(r => ({ role: r.role, providerName: "codex-local", requestedModelName: "gpt-6-sol", identityEvidence: "REQUESTED_CLI_MODEL", threadId: r.threadId })), lrcMethodUnitEvidence: lrcMethodUnitLedgerReference(attempt.lrcMethodUnitEvidence), lrcMethodUnitFiniteEvidence: finite });
  return { ...base, ...binding, solverJobId: `loop-solver-job-${index}`, attemptNumber: 1 as const, reviewJobId, attempt, attemptDigest, review: { ...baseReview, disposition: outcome.disposition, conclusion: outcome.conclusion, contractDigest: binding.contractDigest, attemptDigest, ledger, ledgerDigest: digestMathAgentLedger(ledger) } };
}
export type Fixture = ReturnType<typeof fixture>;
export function binding(f: Fixture, id: string) { return { id, caseId: f.caseId, runId: f.runId, solverJobId: f.solverJobId, reviewJobId: f.reviewJobId, attemptNumber: 1, contractDigest: f.contractDigest, attemptDigest: f.attemptDigest, researchDigest: f.researchDigest, ledgerDigest: f.review.ledgerDigest, finiteSourcePins: f.finiteSourcePins, runStatus: f.runStatus, reviewJobStatus: f.reviewJobStatus }; }
export function policy(f1: Fixture, f2: Fixture) {
  const criterion = { id: "criterion", obligationId: "FEW_EXCEPTION_SHIFT_14", uncertainty: { id: "overlap-width", baseline: 10, minimumDelta: 2 }, baselineEvidenceDigests: [H("KNOWN")] };
  return { version: 1, bindings: [binding(f1, "r1"), binding(f2, "r2")], associations: [] as unknown[], information: [] as unknown[], relations: [] as unknown[], batch: { id: "batch1", sealed: true, currentCandidateId: "a", cap: { experiments: 3, roleCalls: 9, inputTokens: 11106, outputTokens: 7101, wallMs: 30000, toolCalls: 3, checkerCalls: 3, primeChecks: 3 }, candidates: [clone(candidateA), clone(candidateB)], experiments: [ { id: "e1", candidateId: "a", recordBindingId: "r1", state: "COMPLETED", usage: clone(usage), criterion: clone(criterion) }, { id: "e2", candidateId: "a", recordBindingId: "r2", state: "COMPLETED", usage: clone(usage), criterion: clone(criterion) } ] } };
}
export function info(f1: Fixture, f2: Fixture, kind = "NEW_ALIGNED_OBLIGATION", experimentId = "e2") {
  return { id: "info-" + experimentId, batchId: "batch1", experimentId, criterionId: "criterion", recordLedgerDigest: experimentId === "e1" ? f1.review.ledgerDigest : f2.review.ledgerDigest, predicate: clone(predicateA), targetedObligationId: "FEW_EXCEPTION_SHIFT_14", kind, evidenceDigest: H("independent-" + experimentId), independentReviewerId: "independent-host-verifier", admission: "INDEPENDENT_HOST_ADMISSION", previousStatus: "OPEN", resultStatus: "REVIEWED_CONDITIONAL", relationId: null, uncertainty: null };
}
export function refutation(pred = predicateA) { return { id: "refutation", kind: "EXACT_REFUTATION", predicate: clone(pred), evidenceDigest: H("exact-counterexample"), admission: "INDEPENDENT_HOST_ADMISSION" }; }
export function equivalence(right = predicateB) { return { id: "equivalence", kind: "BIDIRECTIONAL_EQUIVALENCE", left: clone(predicateA), right: clone(right), directionEvidenceDigests: [H("forward-proof"), H("backward-proof")], admission: "INDEPENDENT_HOST_ADMISSION" }; }
