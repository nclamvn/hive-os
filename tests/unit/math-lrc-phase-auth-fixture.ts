import { makeLrcPhaseReadFixture } from "./math-lrc-phase-binding-fixture";
import { digestMathPilotContract, mathPilotScope, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { parseLrcPhaseReadRequest, type LrcReadPhase } from "@/modules/research-sandbox/math-lrc-phase-binding";

/** Mocked native row assertions, not scientific evidence or G2 authorization. */
export function phaseAuthFixture(phase: LrcReadPhase, now = Date.now()) {
  const request = makeLrcPhaseReadFixture(phase, now - 1000);
  const contract = resolveMathPilotContract({ caseType: "LRC_METHOD_UNIT", preset: "FEW_EXCEPTION_SHIFT_14_V1" });
  request.descriptor.contractDigest = digestMathPilotContract(contract);
  const ctx = request.descriptor.context;
  const session = { id: `session-${phase}-${now}`, userId: ctx.actorUserId, expiresAt: new Date(now + 30000) };
  const user = { id: ctx.actorUserId, principalType: "HUMAN" };
  const workspace = { id: ctx.workspaceId, organizationId: ctx.organizationId, slug: request.workspaceSlug, status: "ACTIVE" };
  const membership = { id: "fixture-workspace-membership", workspaceId: ctx.workspaceId, userId: ctx.actorUserId, status: "ACTIVE" };
  const organizationMembership = { id: "fixture-org-membership", organizationId: ctx.organizationId, userId: ctx.actorUserId, status: "ACTIVE" };
  const mission = { id: ctx.missionId, workspaceId: ctx.workspaceId, workspace: { organizationId: ctx.organizationId } };
  const attempt = { argument: "Fixture-only uninterpreted mathematical text", usage: null };
  const attemptDigest = sha256(canonicalJson(attempt));
  const ledger = { version: 7, disposition: "RESEARCH_ONLY", conclusion: "PARTIAL", semanticAcceptance: "NOT_TESTED" };
  const ledgerDigest = sha256(canonicalJson(ledger));
  if (request.phase === "REVIEW_ACTIVE" || request.phase === "TERMINAL") request.solverAttemptDigest = attemptDigest;
  if (request.phase === "TERMINAL") request.ledgerDigest = ledgerDigest;
  const rows: Record<string, Record<string, unknown>> = { session, user, workspace, membership, organizationMembership, mission };
  if (request.phase !== "PROSPECTIVE") {
    const { created, solverClaim } = request;
    const terminalSolver = request.phase !== "SOLVER_ACTIVE";
    rows.run = { id: created.runId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, missionId: ctx.missionId,
      commandId: created.commandId, requestedByMembershipId: membership.id, requestedBy: { userId: ctx.actorUserId },
      providerName: "codex-local", modelName: "gpt-6-sol", question: contract.statement, scope: mathPilotScope(contract),
      status: terminalSolver ? "AWAITING_REVIEW" : "RUNNING", jobId: solverClaim.jobId,
      mathModelAttempt: terminalSolver ? attempt : null, mathModelAttemptDigest: terminalSolver ? attemptDigest : null,
      mathPilotCase: { id: created.caseId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, missionId: ctx.missionId, contract, contractDigest: request.descriptor.contractDigest } };
    rows.command = { id: created.commandId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, actorUserId: ctx.actorUserId,
      actorOrganizationMembershipId: organizationMembership.id, commandType: "research.run.request", status: "SUCCEEDED",
      outcome: { runId: created.runId, status: "QUEUED" }, payload: { runId: created.runId, missionId: ctx.missionId, documentId: null, providerName: "codex-local", modelName: "gpt-6-sol" } };
    rows.solver = { id: solverClaim.jobId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, outboxEventId: solverClaim.outboxId,
      jobType: "math-pilot.codex-local.execute", payload: { runId: created.runId }, status: terminalSolver ? "SUCCEEDED" : "RUNNING", attempts: 1, maxAttempts: 1,
      version: solverClaim.claimedVersion + (terminalSolver ? 1 : 0), lockedBy: terminalSolver ? null : solverClaim.workerId,
      leaseExpiresAt: terminalSolver ? null : new Date(solverClaim.leaseExpiresAt),
      result: terminalSolver ? { runId: created.runId, resultDigest: "b".repeat(64), sourceCount: 0, findingCount: 0, providerUsage: null, mathModelAttemptDigest: attemptDigest } : null,
      outboxEvent: { id: solverClaim.outboxId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, commandId: created.commandId,
        topic: "math-pilot.codex-local.execute", aggregateType: "ResearchRun", aggregateId: created.runId, payload: { runId: created.runId }, status: "DISPATCHED" } };
    if (request.phase !== "SOLVER_ACTIVE") {
      const claim = request.reviewClaim, terminal = request.phase === "TERMINAL";
      rows.reviewJob = { id: claim.jobId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, outboxEventId: claim.outboxId,
        jobType: "math-pilot.codex-local.review", payload: { caseId: created.caseId }, status: terminal ? "SUCCEEDED" : "RUNNING", attempts: 1, maxAttempts: 1,
        version: claim.claimedVersion + (terminal ? 1 : 0), lockedBy: terminal ? null : claim.workerId, leaseExpiresAt: terminal ? null : new Date(claim.leaseExpiresAt),
        result: terminal ? { caseId: created.caseId, disposition: ledger.disposition, ledgerDigest } : null,
        outboxEvent: { id: claim.outboxId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, commandId: created.commandId,
          topic: "math-pilot.codex-local.review", aggregateType: "MathPilotCase", aggregateId: created.caseId, payload: { caseId: created.caseId }, status: "DISPATCHED" } };
      if (terminal) rows.review = { id: "fixture-native-review", organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, missionId: ctx.missionId,
        caseId: created.caseId, jobId: claim.jobId, contractDigest: request.descriptor.contractDigest, attemptDigest, ledger, ledgerDigest,
        disposition: ledger.disposition, conclusion: ledger.conclusion };
    }
  }
  return { request: structuredClone(parseLrcPhaseReadRequest(request)), rows };
}
