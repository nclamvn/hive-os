import "server-only";
import type { DurableJob, OutboxEvent } from "@prisma/client";
import { auth } from "@/server/auth";
import { getDb } from "@/server/db";
import { withOrganizationTenant } from "@/server/tenant-context";
import { authorize } from "@/modules/authorization";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { durableJson } from "@/modules/research-sandbox/math-lrc-durable-replay";
import { digestMathPilotContract, mathPilotScope, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { effectiveLrcPhaseReadExpiry, parseLrcPhaseReadRequest, type LrcPhaseReadRequest } from "@/modules/research-sandbox/math-lrc-phase-binding";

/** Read validation only. Neither the handle nor its DTO authorizes execution,
 * source attestation, filesystem access, mathematical replay or admission.
 * Descriptor/source/grant expiries are caller assertions which only LOWER this
 * read lifetime; they are not authenticated G2 or durable capture lifetimes.
 * A new read handle is not a durable once-only admission or restart permit.
 * Async DAL observations are COOPERATIVE_NON_ATOMIC: ownership may change after
 * the final row was observed while subsequent auth reads finish. Never consume
 * this READ handle/DTO as TIP072B execution or admission authority. An actual
 * critical operation needs its own current transaction/CAS ownership fence. */
export interface LrcPhaseReadHandle { readonly version: "LRC_PHASE_READ_HANDLE_V1" }
export class LrcPhaseReadError extends Error {
  constructor(readonly code: "PHASE_READ_REFUSED" | "PHASE_HANDLE_REFUSED") { super(code); this.name = "LrcPhaseReadError"; }
}
export interface LrcPhaseReadDTO {
  readonly phase: LrcPhaseReadRequest["phase"];
  readonly readBinding: "OBSERVED_MATCH";
  readonly observationConsistency: "COOPERATIVE_NON_ATOMIC";
  readonly historicalClaims: "NOT_AUTHENTICATED";
  readonly solverResultDigest: string | null;
  readonly reviewResultDigest: string | null;
  readonly effectiveExpiresAt: number;
  readonly sourceClosure: "UNSEALED";
  readonly durableReplay: "NOT_INSPECTED";
  readonly admission: "NOT_GRANTED";
  readonly executionGate: "G2_NOT_AUTHORIZED";
  readonly dispatchAllowed: false;
  readonly proofClosure: false;
  readonly globalLrc: "NOT_ESTABLISHED";
  readonly formal: "NOT_ESTABLISHED";
  readonly external: "NOT_ESTABLISHED";
  readonly novelty: "NOT_ESTABLISHED";
}
type Principal = { sessionId: string; actorUserId: string; membershipId: string; organizationMembershipId: string; sessionExpiresAt: number };
type State = { headers: Headers; request: LrcPhaseReadRequest; principal: Principal; expiresAt: number; refused: boolean };
type Claim = { jobId: string; outboxId: string; workerId: string; claimedVersion: number; leaseExpiresAt: number };
const jobSelection = { id: true, organizationId: true, workspaceId: true, outboxEventId: true, jobType: true, payload: true, status: true, attempts: true, maxAttempts: true,
  lockedBy: true, version: true, leaseExpiresAt: true, result: true,
  outboxEvent: { select: { id: true, organizationId: true, workspaceId: true, commandId: true, topic: true, aggregateType: true, aggregateId: true, payload: true, status: true } },
} as const;
type JobRow = Pick<DurableJob, "id" | "organizationId" | "workspaceId" | "outboxEventId" | "jobType" | "payload" | "status" | "attempts" | "maxAttempts" | "lockedBy" | "version" | "leaseExpiresAt" | "result"> & {
  outboxEvent: Pick<OutboxEvent, "id" | "organizationId" | "workspaceId" | "commandId" | "topic" | "aggregateType" | "aggregateId" | "payload" | "status"> | null };
const handles = new WeakMap<LrcPhaseReadHandle, State>();
// Session housekeeping may extend its database expiry; it never extends an
// already observed session's read envelope in this process.
const sessionCeilings = new Map<string, number>();
const contract = resolveMathPilotContract({ caseType: "LRC_METHOD_UNIT", preset: "FEW_EXCEPTION_SHIFT_14_V1" });
const contractDigest = digestMathPilotContract(contract);
const refuse = (): never => { throw new LrcPhaseReadError("PHASE_READ_REFUSED"); };
function requireValue(condition: unknown): asserts condition { if (!condition) refuse(); }
function date(value: unknown): number { requireValue(value instanceof Date); const n = value.getTime(); requireValue(Number.isSafeInteger(n)); return n; }
function digest(value: unknown, cap = 65536): string { durableJson(value, cap); return sha256(canonicalJson(value)); }
function exactObject(value: unknown, expected: Record<string, unknown>): boolean {
  try { durableJson(value, 32768); return canonicalJson(value) === canonicalJson(expected); } catch { return false; }
}
function alive(request: LrcPhaseReadRequest, expiry: number): void {
  const now = Date.now(); requireValue(now >= request.descriptor.createdAt && now < expiry);
}
function samePrincipal(actual: Principal, original: Principal): void {
  requireValue(actual.sessionId === original.sessionId && actual.actorUserId === original.actorUserId &&
    actual.membershipId === original.membershipId && actual.organizationMembershipId === original.organizationMembershipId);
}

/** Fresh first-party auth and DAL boundaries only: no caller context/fence or
 * fixture authority factory can be substituted by this module's production API. */
async function principal(headers: Headers, request: LrcPhaseReadRequest, original?: Principal): Promise<Principal> {
  const ctx = request.descriptor.context;
  requireValue(request.descriptor.contractDigest === contractDigest);
  const current = await auth.api.getSession({ headers: new Headers(headers), query: { disableCookieCache: true, disableRefresh: true } });
  requireValue(current?.session && current.user && current.user.id === ctx.actorUserId && current.session.userId === ctx.actorUserId);
  requireValue(typeof current.session.id === "string" && current.session.id.length > 0);
  const currentExpiry = date(current.session.expiresAt);
  requireValue(currentExpiry > Date.now());
  if (original) requireValue(current.session.id === original.sessionId);
  const db = getDb();
  const retainedSession = await db.session.findUnique({ where: { id: current.session.id }, select: { id: true, userId: true, expiresAt: true } });
  requireValue(retainedSession && retainedSession.id === current.session.id && retainedSession.userId === ctx.actorUserId && date(retainedSession.expiresAt) === currentExpiry);
  const user = await db.user.findUnique({ where: { id: ctx.actorUserId }, select: { id: true, principalType: true } });
  requireValue(user?.id === ctx.actorUserId && user.principalType === "HUMAN");
  const workspace = await db.workspace.findFirst({ where: { id: ctx.workspaceId, slug: request.workspaceSlug, organizationId: ctx.organizationId, status: "ACTIVE" }, select: { id: true, slug: true, organizationId: true, status: true } });
  requireValue(workspace?.id === ctx.workspaceId && workspace.slug === request.workspaceSlug && workspace.organizationId === ctx.organizationId && workspace.status === "ACTIVE");
  const membership = await db.membership.findUnique({ where: { workspaceId_userId: { workspaceId: ctx.workspaceId, userId: ctx.actorUserId } }, select: { id: true, userId: true, workspaceId: true, status: true } });
  requireValue(membership?.userId === ctx.actorUserId && membership.workspaceId === ctx.workspaceId && membership.status === "ACTIVE");
  const organizationMembership = await withOrganizationTenant(ctx.organizationId, ctx.actorUserId, tx => tx.organizationMembership.findUnique({ where: { organizationId_userId: { organizationId: ctx.organizationId, userId: ctx.actorUserId } }, select: { id: true, userId: true, organizationId: true, status: true } }));
  requireValue(organizationMembership?.userId === ctx.actorUserId && organizationMembership.organizationId === ctx.organizationId && organizationMembership.status === "ACTIVE");
  // authorize() resolves a mission's workspace. Explicitly bind it BEFORE
  // capability evaluation, rather than allow that resolution to redirect scope.
  const mission = await withOrganizationTenant(ctx.organizationId, ctx.actorUserId, tx => tx.mission.findFirst({ where: { id: ctx.missionId, workspaceId: ctx.workspaceId }, select: { id: true, workspaceId: true, workspace: { select: { organizationId: true } } } }));
  requireValue(mission?.id === ctx.missionId && mission.workspaceId === ctx.workspaceId && mission.workspace.organizationId === ctx.organizationId);
  for (const capability of ["research.read", "research.request", "jobs.manage"] as const) {
    requireValue((await authorize(ctx.actorUserId, capability, { organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, missionId: ctx.missionId })).allowed);
  }
  const observed = sessionCeilings.get(current.session.id);
  const sessionExpiresAt = Math.min(currentExpiry, observed ?? currentExpiry, original?.sessionExpiresAt ?? currentExpiry);
  if (!sessionCeilings.has(current.session.id)) requireValue(sessionCeilings.size < 1024);
  sessionCeilings.set(current.session.id, sessionExpiresAt);
  const result = { sessionId: current.session.id, actorUserId: ctx.actorUserId, membershipId: membership.id,
    organizationMembershipId: organizationMembership.id, sessionExpiresAt };
  if (original) samePrincipal(result, original);
  alive(request, effectiveLrcPhaseReadExpiry(request, sessionExpiresAt));
  return result;
}
async function fence(state: State): Promise<void> {
  requireValue(!state.refused); alive(state.request, state.expiresAt);
  const refreshed = await principal(state.headers, state.request, state.principal);
  requireValue(effectiveLrcPhaseReadExpiry(state.request, refreshed.sessionExpiresAt) >= state.expiresAt);
  if (state.request.phase !== "PROSPECTIVE") {
    const request = state.request, ctx = request.descriptor.context;
    const claims: Array<[Claim, boolean, boolean]> = [[request.solverClaim, true, request.phase !== "SOLVER_ACTIVE"]];
    if (request.phase === "REVIEW_ACTIVE" || request.phase === "TERMINAL") claims.push([request.reviewClaim, false, request.phase === "TERMINAL"]);
    for (const [claim, solver, terminal] of claims) {
      alive(request, state.expiresAt);
      const row = await withOrganizationTenant(ctx.organizationId, ctx.actorUserId, tx => tx.durableJob.findFirst({ where: {
        id: claim.jobId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, outboxEventId: claim.outboxId }, select: jobSelection }));
      // Auth revocation during the owned-claim lookup refuses before using it.
      const postClaimPrincipal = await principal(state.headers, request, state.principal);
      requireValue(effectiveLrcPhaseReadExpiry(request, postClaimPrincipal.sessionExpiresAt) >= state.expiresAt);
      assertJob(row, request, claim, solver, terminal);
    }
  }
  alive(state.request, state.expiresAt);
}
async function read<T>(state: State, lookup: () => Promise<T>): Promise<T> {
  await fence(state); const result = await lookup(); await fence(state); return result;
}
function assertJob(row: JobRow | null, request: Exclude<LrcPhaseReadRequest, { phase: "PROSPECTIVE" }>, claim: Claim, solver: boolean, terminal: boolean): asserts row is JobRow {
  const ctx = request.descriptor.context, created = request.created;
  const expectedType = solver ? "math-pilot.codex-local.execute" : "math-pilot.codex-local.review";
  const aggregateId = solver ? created.runId : created.caseId;
  const event = row?.outboxEvent, payload = solver ? { runId: aggregateId } : { caseId: aggregateId };
  requireValue(row?.id === claim.jobId && row.organizationId === ctx.organizationId && row.workspaceId === ctx.workspaceId && row.outboxEventId === claim.outboxId && row.jobType === expectedType && row.attempts === 1 && row.maxAttempts === 1 && exactObject(row.payload, payload));
  requireValue(event?.id === claim.outboxId && event.organizationId === ctx.organizationId && event.workspaceId === ctx.workspaceId && event.commandId === created.commandId && event.topic === expectedType &&
    event.aggregateType === (solver ? "ResearchRun" : "MathPilotCase") && event.aggregateId === aggregateId && event.status === "DISPATCHED" && exactObject(event.payload, payload));
  if (terminal) requireValue(row.status === "SUCCEEDED" && row.version === claim.claimedVersion + 1 && row.lockedBy === null && row.leaseExpiresAt === null);
  else requireValue(row.status === "RUNNING" && row.version === claim.claimedVersion && row.lockedBy === claim.workerId && date(row.leaseExpiresAt) === claim.leaseExpiresAt && claim.leaseExpiresAt > Date.now() && row.result === null);
}

async function snapshot(state: State): Promise<{ anchorDigest: string; solverResultDigest: string | null; reviewResultDigest: string | null }> {
  const request = state.request, ctx = request.descriptor.context;
  if (request.phase === "PROSPECTIVE") { await fence(state); return { anchorDigest: digest(request), solverResultDigest: null, reviewResultDigest: null }; }
  const activeRequest: Exclude<LrcPhaseReadRequest, { phase: "PROSPECTIVE" }> = request;
  const created = request.created;
  const tenant = <T>(lookup: Parameters<typeof withOrganizationTenant<T>>[2]) => read(state, () => withOrganizationTenant(ctx.organizationId, ctx.actorUserId, lookup));
  const run = await tenant(tx => tx.researchRun.findFirst({ where: { id: created.runId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, missionId: ctx.missionId }, select: {
    id: true, organizationId: true, workspaceId: true, missionId: true, commandId: true, requestedByMembershipId: true,
    providerName: true, modelName: true, question: true, scope: true, status: true, jobId: true,
    mathModelAttempt: true, mathModelAttemptDigest: true, requestedBy: { select: { userId: true } },
    mathPilotCase: { select: { id: true, organizationId: true, workspaceId: true, missionId: true, contract: true, contractDigest: true } },
  } }));
  const pilot = run?.mathPilotCase;
  requireValue(run?.id === created.runId && run.organizationId === ctx.organizationId && run.workspaceId === ctx.workspaceId && run.missionId === ctx.missionId &&
    run.commandId === created.commandId && run.requestedByMembershipId === state.principal.membershipId && run.requestedBy.userId === ctx.actorUserId &&
    run.providerName === "codex-local" && run.modelName === "gpt-6-sol" && run.question === contract.statement && run.scope === mathPilotScope(contract) &&
    pilot?.id === created.caseId && pilot.organizationId === ctx.organizationId && pilot.workspaceId === ctx.workspaceId && pilot.missionId === ctx.missionId &&
    pilot.contractDigest === contractDigest && exactObject(pilot.contract, contract as unknown as Record<string, unknown>));
  const command = await tenant(tx => tx.commandRecord.findFirst({ where: { id: created.commandId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId }, select: {
    id: true, organizationId: true, workspaceId: true, actorUserId: true, actorOrganizationMembershipId: true, commandType: true, status: true, payload: true, outcome: true,
  } }));
  requireValue(command?.id === created.commandId && command.organizationId === ctx.organizationId && command.workspaceId === ctx.workspaceId &&
    command.actorUserId === ctx.actorUserId && command.actorOrganizationMembershipId === state.principal.organizationMembershipId && command.commandType === "research.run.request" && command.status === "SUCCEEDED" &&
    exactObject(command.outcome, { runId: created.runId, status: "QUEUED" }) && exactObject(command.payload, { runId: created.runId, missionId: ctx.missionId, documentId: null, providerName: "codex-local", modelName: "gpt-6-sol" }));
  async function job(claim: Claim, solver: boolean, terminal: boolean) {
    const row = await tenant(tx => tx.durableJob.findFirst({ where: { id: claim.jobId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, outboxEventId: claim.outboxId }, select: jobSelection }));
    assertJob(row, activeRequest, claim, solver, terminal);
    return row;
  }
  requireValue(request.solverClaim.outboxId === created.solverOutboxId && run.jobId === request.solverClaim.jobId);
  const solver = await job(request.solverClaim, true, request.phase !== "SOLVER_ACTIVE");
  let solverResultDigest: string | null = null, reviewResultDigest: string | null = null;
  let attemptDigest: string | null = null, reviewAnchor: unknown = null, reviewJobAnchor: unknown = null;
  if (request.phase === "SOLVER_ACTIVE") {
    requireValue(run.status === "RUNNING" && run.mathModelAttempt === null && run.mathModelAttemptDigest === null);
  } else {
    requireValue(["AWAITING_REVIEW", "APPROVED"].includes(run.status) && run.mathModelAttemptDigest === request.solverAttemptDigest);
    requireValue(run.mathModelAttempt !== null && typeof run.mathModelAttempt === "object" && !Array.isArray(run.mathModelAttempt));
    attemptDigest = digest(run.mathModelAttempt, 98304); requireValue(attemptDigest === request.solverAttemptDigest);
    durableJson(solver.result, 65536);
    const result = solver.result as Record<string, unknown> | null;
    const nativeKeys = ["runId", "resultDigest", "sourceCount", "findingCount", "providerUsage", "mathModelAttemptDigest"];
    requireValue(result && result.runId === created.runId && result.mathModelAttemptDigest === attemptDigest &&
      Object.keys(result).length === nativeKeys.length && nativeKeys.every(key => Object.hasOwn(result, key)) &&
      typeof result.resultDigest === "string" && /^[a-f0-9]{64}$/.test(result.resultDigest) &&
      typeof result.sourceCount === "number" && Number.isSafeInteger(result.sourceCount) && result.sourceCount >= 0 && result.sourceCount <= 10000 &&
      typeof result.findingCount === "number" && Number.isSafeInteger(result.findingCount) && result.findingCount >= 0 && result.findingCount <= 10000 &&
      (result.providerUsage === null || typeof result.providerUsage === "object" && !Array.isArray(result.providerUsage)));
    solverResultDigest = digest(result);
    const reviewJob = await job(request.reviewClaim, false, request.phase === "TERMINAL");
    reviewJobAnchor = { id: reviewJob.id, version: reviewJob.version, status: reviewJob.status, lockedBy: reviewJob.lockedBy, leaseExpiresAt: reviewJob.leaseExpiresAt?.getTime() ?? null };
    const review = await tenant(tx => tx.mathPilotAgentReview.findFirst({ where: { caseId: created.caseId, organizationId: ctx.organizationId, workspaceId: ctx.workspaceId, missionId: ctx.missionId }, select: {
      id: true, organizationId: true, workspaceId: true, missionId: true, caseId: true, jobId: true, contractDigest: true, attemptDigest: true,
      ledger: true, ledgerDigest: true, disposition: true, conclusion: true,
    } }));
    if (request.phase === "REVIEW_ACTIVE") requireValue(review === null);
    else {
      requireValue(review?.organizationId === ctx.organizationId && review.workspaceId === ctx.workspaceId && review.missionId === ctx.missionId && review.caseId === created.caseId &&
        review.jobId === request.reviewClaim.jobId && review.contractDigest === contractDigest && review.attemptDigest === attemptDigest && review.ledgerDigest === request.ledgerDigest && digest(review.ledger, 262144) === request.ledgerDigest);
      const ledger = review.ledger as Record<string, unknown>;
      requireValue(ledger.version === 7 && ledger.disposition === review.disposition && ledger.conclusion === review.conclusion);
      requireValue(exactObject(reviewJob.result, { caseId: created.caseId, disposition: review.disposition, ledgerDigest: request.ledgerDigest }));
      reviewResultDigest = digest(reviewJob.result);
      reviewAnchor = { id: review.id, jobId: review.jobId, ledgerDigest: review.ledgerDigest, disposition: review.disposition, conclusion: review.conclusion };
    }
  }
  return { solverResultDigest, reviewResultDigest, anchorDigest: digest({ request, runStatus: run.status, attemptDigest,
    solver: { id: solver.id, version: solver.version, status: solver.status, lockedBy: solver.lockedBy, leaseExpiresAt: solver.leaseExpiresAt?.getTime() ?? null },
    solverResultDigest, reviewResultDigest, reviewJobAnchor, reviewAnchor }, 32768) };
}

async function validate(state: State): Promise<LrcPhaseReadDTO> {
  const first = await snapshot(state); await fence(state);
  const second = await snapshot(state); await fence(state);
  requireValue(first.anchorDigest === second.anchorDigest);
  return Object.freeze({ phase: state.request.phase, readBinding: "OBSERVED_MATCH", observationConsistency: "COOPERATIVE_NON_ATOMIC", historicalClaims: "NOT_AUTHENTICATED", solverResultDigest: second.solverResultDigest,
    reviewResultDigest: second.reviewResultDigest, effectiveExpiresAt: state.expiresAt, sourceClosure: "UNSEALED", durableReplay: "NOT_INSPECTED",
    admission: "NOT_GRANTED", executionGate: "G2_NOT_AUTHORIZED", dispatchAllowed: false, proofClosure: false,
    globalLrc: "NOT_ESTABLISHED", formal: "NOT_ESTABLISHED", external: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED" });
}
export async function authorizeLrcPhaseRead(headers: Headers, raw: unknown): Promise<LrcPhaseReadHandle> {
  try {
    const request = parseLrcPhaseReadRequest(raw), copiedHeaders = new Headers(headers);
    const original = await principal(copiedHeaders, request);
    const state: State = { headers: copiedHeaders, request, principal: original, expiresAt: effectiveLrcPhaseReadExpiry(request, original.sessionExpiresAt), refused: false };
    await validate(state);
    const handle = Object.freeze({ version: "LRC_PHASE_READ_HANDLE_V1" as const }); handles.set(handle, state); return handle;
  } catch { throw new LrcPhaseReadError("PHASE_READ_REFUSED"); }
}
export async function validateLrcPhaseRead(handle: LrcPhaseReadHandle, expectedPhase: LrcPhaseReadRequest["phase"]): Promise<LrcPhaseReadDTO> {
  const state = handles.get(handle);
  if (!state || state.request.phase !== expectedPhase) throw new LrcPhaseReadError("PHASE_HANDLE_REFUSED");
  try { return await validate(state); } catch { state.refused = true; throw new LrcPhaseReadError("PHASE_READ_REFUSED"); }
}
