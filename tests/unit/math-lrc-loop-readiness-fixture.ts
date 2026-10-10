import { fixture } from "./math-lrc-research-loop-fixture";
import { mathPilotScope, MATH_LRC_METHOD_UNIT_CONTRACT } from "@/modules/research-sandbox/math-pilot";
import { digestResearchResult, researchDossierDigest } from "@/modules/research-sandbox/integrity";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";
import { createLrcMethodUnitLiveEvidence, prepareLrcMethodUnitSolverInput, prepareLrcMethodUnitReviewInput } from "@/modules/research-sandbox/math-lrc-method-unit-live";
import { buildLrcMethodUnitFiniteEvidence } from "@/modules/research-sandbox/math-lrc-method-unit";
import { lrcMethodUnitLedgerSchema, lrcMethodUnitLedgerReference, evaluateLrcMethodUnitReview } from "@/modules/research-sandbox/math-lrc-method-unit-review";
import { digestMathAgentLedger } from "@/modules/research-sandbox/agent-review";

/** SYNTHETIC authoritative-row control only; never persisted or scientific/browser evidence. */
export function syntheticReadinessRows(index = 1) {
  const base = fixture(index), caseId = `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
  const binding = { caseId, runId: base.runId, contractDigest: base.contractDigest, requestedModelName: "gpt-6-sol" as const };
  const attempt = mathModelAttemptSchema.parse({ ...base.attempt, lrcMethodUnitEvidence: createLrcMethodUnitLiveEvidence({ solverInput: prepareLrcMethodUnitSolverInput(binding) }) }), attemptDigest = digestResearchResult(attempt);
  const oldLedger = lrcMethodUnitLedgerSchema.parse(base.review.ledger);
  const adversary = { ...oldLedger.reports[0], lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...binding, role: "ADVERSARY", solverAttempt: attempt, solverAttemptDigest: attemptDigest }) };
  const finite = buildLrcMethodUnitFiniteEvidence({ seed: attempt.lrcMethodUnitFiniteSeed, pins: base.finiteSourcePins!, binding: { caseId, runId: binding.runId, contractDigest: binding.contractDigest, reviewJobId: base.reviewJobId, solverAttemptDigest: attemptDigest, adversaryReportDigest: digestResearchResult(adversary) } });
  const critic = { ...oldLedger.reports[1], lrcMethodUnitInput: prepareLrcMethodUnitReviewInput({ ...binding, role: "CRITIC", solverAttempt: attempt, solverAttemptDigest: attemptDigest, finiteEvidence: finite, finiteSourcePins: base.finiteSourcePins! }) };
  const reports = [adversary, critic] as const;
  const outcome = evaluateLrcMethodUnitReview({ ...binding, attempt, reports, finiteEvidence: finite, finiteSourcePins: base.finiteSourcePins!, reviewJobId: base.reviewJobId });
  const ledger = lrcMethodUnitLedgerSchema.parse({ ...oldLedger, ...outcome, reports, lrcMethodUnitEvidence: lrcMethodUnitLedgerReference(attempt.lrcMethodUnitEvidence), lrcMethodUnitFiniteEvidence: finite });
  const f = { ...base, caseId, attempt, attemptDigest, review: { ...base.review, ...outcome, attemptDigest, ledger, ledgerDigest: digestMathAgentLedger(ledger) } };
  const tenant = { organizationId: "fixture-org", workspaceId: "fixture-workspace", missionId: "00000000-0000-4000-8000-000000000100" };
  const findings = [{ findingKey: "no-external-source", kind: "HONEST_NULL", claim: "Conditional method feedback only; no independently captured external source span.", sourceId: null, exactExcerpt: "", startOffset: null, endOffset: null, confidence: 0, decision: null }];
  const run = { ...tenant, id: f.runId, jobId: f.solverJobId, commandId: `fixture-command-${index}`, requestedByMembershipId: "fixture-requester-membership", requestedBy: { id: "fixture-requester-membership", userId: "fixture-original-actor", workspaceId: tenant.workspaceId }, status: "AWAITING_REVIEW", providerName: "codex-local", modelName: "gpt-6-sol", question: MATH_LRC_METHOD_UNIT_CONTRACT.statement, scope: mathPilotScope(MATH_LRC_METHOD_UNIT_CONTRACT), mathModelAttempt: f.attempt, mathModelAttemptDigest: f.attemptDigest, sources: [], findings };
  const researchDigest = researchDossierDigest(run);
  const resultDigest = digestResearchResult({ provider: run.providerName, model: run.modelName, sources: [], findings: findings.map(v => ({ key: v.findingKey, kind: v.kind, claim: v.claim, sourceKey: null, exactExcerpt: v.exactExcerpt, startOffset: v.startOffset, endOffset: v.endOffset, confidence: v.confidence })) });
  const row = { ...tenant, id: f.caseId, researchRunId: run.id, caseType: "OPEN", contract: f.contract, contractDigest: f.contractDigest, researchRun: run, agentReview: { ...tenant, disposition: f.review.disposition, conclusion: f.review.conclusion, contractDigest: f.review.contractDigest, attemptDigest: f.review.attemptDigest, ledger: f.review.ledger, ledgerDigest: f.review.ledgerDigest, researchDigest, caseId: f.caseId, jobId: f.reviewJobId } };
  const command = { id: run.commandId, organizationId: tenant.organizationId, workspaceId: tenant.workspaceId, commandType: "research.run.request", actorUserId: run.requestedBy.userId, status: "SUCCEEDED", outcome: { runId: run.id } };
  const job = (solver: boolean) => {
    const jobType = solver ? "math-pilot.codex-local.execute" : "math-pilot.codex-local.review", aggregateId = solver ? run.id : row.id, payload = solver ? { runId: run.id } : { caseId: row.id };
    const outboxId = `fixture-outbox-${index}-${solver ? "solver" : "review"}`;
    return { id: solver ? run.jobId : row.agentReview.jobId, organizationId: tenant.organizationId, workspaceId: tenant.workspaceId, jobType, payload, status: "SUCCEEDED", attempts: 1, maxAttempts: 1, outboxEventId: outboxId, result: solver ? { runId: run.id, resultDigest, mathModelAttemptDigest: f.attemptDigest } : { caseId: row.id, ledgerDigest: f.review.ledgerDigest, disposition: f.review.disposition }, outboxEvent: { id: outboxId, organizationId: tenant.organizationId, workspaceId: tenant.workspaceId, commandId: run.commandId, topic: jobType, aggregateType: solver ? "ResearchRun" : "MathPilotCase", aggregateId, payload: structuredClone(payload), status: "DISPATCHED", command: structuredClone(command) } };
  };
  return { row, jobs: [job(true), job(false)], pins: { sourcePins: {}, finiteSourcePins: f.finiteSourcePins! }, ctx: { user: { id: "fixture-viewer" }, workspace: { id: tenant.workspaceId, slug: "fixture-workspace", status: "ACTIVE" }, membership: { id: "fixture-viewer-membership", status: "ACTIVE" } } };
}
