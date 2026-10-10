import { beforeEach, describe, expect, it, vi } from "vitest";
import { phaseAuthFixture } from "./math-lrc-phase-auth-fixture";
import { authorizeLrcPhaseRead, validateLrcPhaseRead } from "@/server/operations/math-lrc-phase-auth";
import type { LrcPhaseReadRequest, LrcReadPhase } from "@/modules/research-sandbox/math-lrc-phase-binding";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

const f = vi.hoisted(() => ({ session: vi.fn(), sessionRow: vi.fn(), user: vi.fn(), workspace: vi.fn(), membership: vi.fn(), org: vi.fn(),
  mission: vi.fn(), capability: vi.fn(), run: vi.fn(), command: vi.fn(), job: vi.fn(), review: vi.fn(), tenant: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: { api: { getSession: f.session } } }));
vi.mock("@/server/db", () => ({ getDb: () => ({ session: { findUnique: f.sessionRow }, user: { findUnique: f.user }, workspace: { findFirst: f.workspace }, membership: { findUnique: f.membership } }) }));
vi.mock("@/modules/authorization", () => ({ authorize: f.capability }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: f.tenant }));
let rows: Record<string, Record<string, unknown>>, request: LrcPhaseReadRequest;
let fixtureSerial = 0;
function setup(phase: LrcReadPhase = "PROSPECTIVE") {
  const fixture = phaseAuthFixture(phase, Date.now() + fixtureSerial++);
  rows = fixture.rows; request = fixture.request;
  const copy = (key: string) => structuredClone(rows[key] ?? null);
  f.session.mockImplementation(async () => ({ session: copy("session"), user: copy("user") }));
  for (const [fn, key] of [[f.sessionRow, "session"], [f.user, "user"], [f.workspace, "workspace"], [f.membership, "membership"], [f.org, "organizationMembership"], [f.mission, "mission"], [f.run, "run"], [f.command, "command"], [f.review, "review"]] as const) fn.mockImplementation(async () => copy(key));
  f.job.mockImplementation(async (query: { where: { id: string } }) => query.where.id === rows.solver?.id ? copy("solver") : copy("reviewJob"));
  f.capability.mockResolvedValue({ allowed: true });
  f.tenant.mockImplementation(async (_org: string, _actor: string, operation: (tx: unknown) => Promise<unknown>) => operation({
    organizationMembership: { findUnique: f.org }, mission: { findFirst: f.mission }, researchRun: { findFirst: f.run }, commandRecord: { findFirst: f.command },
    durableJob: { findFirst: f.job }, mathPilotAgentReview: { findFirst: f.review },
  }));
}
beforeEach(() => { vi.clearAllMocks(); setup(); });
const mint = () => authorizeLrcPhaseRead(new Headers({ cookie: "fixture-secret-cookie" }), request);
const nested = (key: string, field: string) => rows[key][field] as Record<string, unknown>;

describe("TIP072A actual first-party read DAL through offline mocked boundaries", () => {
  it.each(["PROSPECTIVE", "SOLVER_ACTIVE", "REVIEW_ACTIVE", "TERMINAL"] as const)("%s verifies native rows and returns only read DTO", async phase => {
    setup(phase); const handle = await mint(); const dto = await validateLrcPhaseRead(handle, phase);
    expect(dto).toEqual(expect.objectContaining({ phase, readBinding: "OBSERVED_MATCH", observationConsistency: "COOPERATIVE_NON_ATOMIC", historicalClaims: "NOT_AUTHENTICATED", sourceClosure: "UNSEALED", durableReplay: "NOT_INSPECTED", admission: "NOT_GRANTED",
      executionGate: "G2_NOT_AUTHORIZED", dispatchAllowed: false, proofClosure: false, novelty: "NOT_ESTABLISHED" }));
    expect(Object.isFrozen(dto)).toBe(true);
    expect(f.session).toHaveBeenCalledWith(expect.objectContaining({ query: { disableCookieCache: true, disableRefresh: true } }));
    expect(f.capability).toHaveBeenCalledWith("fixture-actor", "research.read", { organizationId: "fixture-org", workspaceId: "fixture-workspace", missionId: "fixture-mission" });
    expect(dto.solverResultDigest).toBe(phase === "REVIEW_ACTIVE" || phase === "TERMINAL" ? sha256(canonicalJson(rows.solver.result)) : null);
    expect(dto.reviewResultDigest).toBe(phase === "TERMINAL" ? sha256(canonicalJson(rows.reviewJob.result)) : null);
  });
  it("solver active does not query or invent a review job", async () => {
    setup("SOLVER_ACTIVE"); await mint(); expect(f.review).not.toHaveBeenCalled();
    expect(f.job.mock.calls.every(call => call[0].where.id === rows.solver.id)).toBe(true);
  });
  it("review only owns current review; completed solver has cleared lease", async () => {
    setup("REVIEW_ACTIVE"); expect(rows.solver.lockedBy).toBeNull(); expect(rows.solver.leaseExpiresAt).toBeNull();
    await expect(mint()).resolves.toBeDefined();
  });
  it.each(["null-session", "actor", "session-user", "session-row-user", "session-row-id", "session-expiry", "service", "workspace", "slug", "workspace-org", "membership-user", "membership-workspace", "inactive-workspace", "inactive-member", "org-user", "org-tenant", "org-inactive", "mission-id", "mission-workspace", "mission-org", "capability"])("prospective %s refuses safely", async kind => {
    if (kind === "null-session") f.session.mockResolvedValue(null);
    if (kind === "actor") rows.user.id = "foreign";
    if (kind === "session-user") rows.session.userId = "foreign";
    if (kind === "session-row-user") f.sessionRow.mockImplementation(async () => ({ ...rows.session, userId: "foreign" }));
    if (kind === "session-row-id") f.sessionRow.mockImplementation(async () => ({ ...rows.session, id: "foreign" }));
    if (kind === "session-expiry") rows.session.expiresAt = new Date(0);
    if (kind === "service") rows.user.principalType = "SERVICE";
    if (kind === "workspace") rows.workspace.id = "foreign";
    if (kind === "slug") rows.workspace.slug = "foreign";
    if (kind === "workspace-org") rows.workspace.organizationId = "foreign";
    if (kind === "membership-user") rows.membership.userId = "foreign";
    if (kind === "membership-workspace") rows.membership.workspaceId = "foreign";
    if (kind === "inactive-workspace") rows.workspace.status = "ARCHIVED";
    if (kind === "inactive-member") rows.membership.status = "SUSPENDED";
    if (kind === "org-user") rows.organizationMembership.userId = "foreign";
    if (kind === "org-tenant") rows.organizationMembership.organizationId = "foreign";
    if (kind === "org-inactive") rows.organizationMembership.status = "SUSPENDED";
    if (kind === "mission-id") rows.mission.id = "foreign";
    if (kind === "mission-workspace") rows.mission.workspaceId = "foreign";
    if (kind === "mission-org") nested("mission", "workspace").organizationId = "foreign";
    if (kind === "capability") f.capability.mockResolvedValue({ allowed: false });
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
    if (kind.startsWith("mission-")) expect(f.capability).not.toHaveBeenCalled();
  });
  it.each(["run-tenant", "requester", "membership", "question", "scope", "model", "run-command", "case-id", "contract", "command-actor", "command-status", "command-outcome", "command-payload", "job-worker", "job-version", "job-lease", "job-attempt", "job-max-attempt", "job-payload", "job-type", "job-outbox", "event-command", "event-status", "event-payload", "event-aggregate", "event-tenant", "early-attempt"])("active solver %s substitution refuses", async kind => {
    setup("SOLVER_ACTIVE");
    if (kind === "run-tenant") rows.run.organizationId = "foreign";
    if (kind === "requester") nested("run", "requestedBy").userId = "foreign";
    if (kind === "membership") rows.run.requestedByMembershipId = "foreign";
    if (kind === "question") rows.run.question = "foreign";
    if (kind === "scope") rows.run.scope = "foreign";
    if (kind === "model") rows.run.modelName = "other";
    if (kind === "run-command") rows.run.commandId = "foreign";
    if (kind === "case-id") nested("run", "mathPilotCase").id = "foreign";
    if (kind === "contract") nested("run", "mathPilotCase").contract = { version: 3 };
    if (kind === "command-actor") rows.command.actorUserId = "foreign";
    if (kind === "command-status") rows.command.status = "PROCESSING";
    if (kind === "command-outcome") rows.command.outcome = { runId: "foreign", status: "QUEUED" };
    if (kind === "command-payload") nested("command", "payload").missionId = "foreign";
    if (kind === "job-worker") rows.solver.lockedBy = "foreign";
    if (kind === "job-version") rows.solver.version = 4;
    if (kind === "job-lease") rows.solver.leaseExpiresAt = new Date(Date.now() + 90000);
    if (kind === "job-attempt") rows.solver.attempts = 2;
    if (kind === "job-max-attempt") rows.solver.maxAttempts = 5;
    if (kind === "job-payload") rows.solver.payload = { runId: "foreign" };
    if (kind === "job-type") rows.solver.jobType = "research.run.execute";
    if (kind === "job-outbox") rows.solver.outboxEventId = "foreign";
    if (kind === "event-command") nested("solver", "outboxEvent").commandId = "foreign";
    if (kind === "event-status") nested("solver", "outboxEvent").status = "PENDING";
    if (kind === "event-payload") nested("solver", "outboxEvent").payload = { runId: "foreign" };
    if (kind === "event-aggregate") nested("solver", "outboxEvent").aggregateType = "MathPilotCase";
    if (kind === "event-tenant") nested("solver", "outboxEvent").organizationId = "foreign";
    if (kind === "early-attempt") rows.run.mathModelAttempt = { forged: true };
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each(["solver-running", "solver-version", "solver-lock", "solver-lease", "attempt-digest", "native-solver-result", "expanded-fixture-result", "review-worker", "review-version", "review-lease", "review-payload", "already-reviewed"])("review %s refuses", async kind => {
    setup("REVIEW_ACTIVE");
    if (kind === "solver-running") rows.solver.status = "RUNNING";
    if (kind === "solver-version") rows.solver.version = 7;
    if (kind === "solver-lock") rows.solver.lockedBy = "foreign";
    if (kind === "solver-lease") rows.solver.leaseExpiresAt = new Date(Date.now() + 1000);
    if (kind === "attempt-digest") rows.run.mathModelAttempt = { changed: true };
    if (kind === "native-solver-result") nested("solver", "result").mathModelAttemptDigest = "f".repeat(64);
    if (kind === "expanded-fixture-result") nested("solver", "result").dossierDigest = "f".repeat(64);
    if (kind === "review-worker") rows.reviewJob.lockedBy = "foreign";
    if (kind === "review-version") rows.reviewJob.version = 7;
    if (kind === "review-lease") rows.reviewJob.leaseExpiresAt = new Date(Date.now() + 90000);
    if (kind === "review-payload") rows.reviewJob.payload = { caseId: "foreign" };
    if (kind === "already-reviewed") rows.review = { forged: true };
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each(["review-running", "review-version", "review-lock", "review-lease", "native-review-result", "expanded-review-result", "ledger", "ledger-version", "review-digest", "review-job", "review-tenant", "disposition", "conclusion"])("terminal %s mismatch refuses", async kind => {
    setup("TERMINAL");
    if (kind === "review-running") rows.reviewJob.status = "RUNNING";
    if (kind === "review-version") rows.reviewJob.version = 7;
    if (kind === "review-lock") rows.reviewJob.lockedBy = "foreign";
    if (kind === "review-lease") rows.reviewJob.leaseExpiresAt = new Date(Date.now() + 1000);
    if (kind === "native-review-result") nested("reviewJob", "result").ledgerDigest = "f".repeat(64);
    if (kind === "expanded-review-result") nested("reviewJob", "result").dossierDigest = "f".repeat(64);
    if (kind === "ledger") nested("review", "ledger").extra = "changed";
    if (kind === "ledger-version") nested("review", "ledger").version = 6;
    if (kind === "review-digest") rows.review.ledgerDigest = "f".repeat(64);
    if (kind === "review-job") rows.review.jobId = "foreign";
    if (kind === "review-tenant") rows.review.organizationId = "foreign";
    if (kind === "disposition") rows.review.disposition = "other";
    if (kind === "conclusion") rows.review.conclusion = "PROVED";
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it("original actor/session/membership identity cannot drift after handle creation", async () => {
    const handle = await mint(); rows.session.id = "fresh-other-session";
    await expect(validateLrcPhaseRead(handle, "PROSPECTIVE")).rejects.toThrow("PHASE_READ_REFUSED");
    // Failed refresh quarantines this handle even if original authorization returns.
    setup(); await expect(validateLrcPhaseRead(handle, "PROSPECTIVE")).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each(["membership", "org-membership"])("%s identity is immutable within handle", async kind => {
    const handle = await mint(); rows[kind === "membership" ? "membership" : "organizationMembership"].id = "replacement";
    await expect(validateLrcPhaseRead(handle, "PROSPECTIVE")).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it("caller Headers/request mutation cannot redirect a minted read handle", async () => {
    const headers = new Headers({ cookie: "original-secret" }); const handle = await authorizeLrcPhaseRead(headers, request);
    headers.set("cookie", "mutated-secret"); request.descriptor.context.missionId = "foreign";
    await expect(validateLrcPhaseRead(handle, "PROSPECTIVE")).resolves.toBeDefined();
    expect((f.session.mock.calls.at(-1)![0].headers as Headers).get("cookie")).toBe("original-secret");
  });
  it("copied/foreign-phase handles do not authorize reads", async () => {
    const handle = await mint(); await expect(validateLrcPhaseRead({ ...handle }, "PROSPECTIVE")).rejects.toThrow("PHASE_HANDLE_REFUSED");
    await expect(validateLrcPhaseRead(handle, "TERMINAL")).rejects.toThrow("PHASE_HANDLE_REFUSED");
  });
  it("session housekeeping cannot extend observed read lifetime", async () => {
    const handle = await mint(), before = await validateLrcPhaseRead(handle, "PROSPECTIVE");
    rows.session.expiresAt = new Date(Date.now() + 120000);
    const after = await validateLrcPhaseRead(handle, "PROSPECTIVE"); expect(after.effectiveExpiresAt).toBe(before.effectiveExpiresAt);
    const remint = await mint(); expect((await validateLrcPhaseRead(remint, "PROSPECTIVE")).effectiveExpiresAt).toBe(before.effectiveExpiresAt);
  });
  it("shortened session lifetime refuses existing handle", async () => {
    const handle = await mint(); rows.session.expiresAt = new Date(Date.now() + 1000);
    await expect(validateLrcPhaseRead(handle, "PROSPECTIVE")).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each(["session", "member", "mission", "capability"])("post-IO %s drift refuses before native evidence use", async kind => {
    setup("SOLVER_ACTIVE"); f.run.mockImplementationOnce(async () => {
      const answer = structuredClone(rows.run);
      if (kind === "session") f.sessionRow.mockResolvedValue(null);
      if (kind === "member") rows.membership.status = "SUSPENDED";
      if (kind === "mission") rows.mission.workspaceId = "foreign";
      if (kind === "capability") f.capability.mockResolvedValue({ allowed: false });
      return answer;
    });
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED"); expect(f.command).not.toHaveBeenCalled();
  });
  it("post-lookup owned claim mutation is caught by fresh snapshot", async () => {
    setup("SOLVER_ACTIVE"); f.job.mockImplementationOnce(async () => { const answer = structuredClone(rows.solver); rows.solver.lockedBy = "foreign"; return answer; });
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it("still-valid shorter session during final owned-claim lookup cannot return old envelope", async () => {
    setup("SOLVER_ACTIVE"); const handle = await mint();
    f.job.mockImplementationOnce(async () => {
      const answer = structuredClone(rows.solver); rows.session.expiresAt = new Date(Date.now() + 1000); return answer;
    });
    await expect(validateLrcPhaseRead(handle, "SOLVER_ACTIVE")).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it("coherently changed native result after first snapshot is not reused", async () => {
    setup("TERMINAL"); f.review.mockImplementationOnce(async () => {
      const answer = structuredClone(rows.review); nested("solver", "result").sourceCount = 1; return answer;
    });
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each(["SOLVER_ACTIVE", "REVIEW_ACTIVE", "TERMINAL"] as const)("%s final async boundary is observed-only, never current execution authority", async phase => {
    setup(phase); const handle = await mint();
    const before = f.job.mock.calls.length;
    await validateLrcPhaseRead(handle, phase);
    const finalLookup = f.job.mock.calls.length - before;
    expect(finalLookup).toBeGreaterThan(0);
    let lookup = 0;
    f.job.mockImplementation(async (query: { where: { id: string } }) => {
      const key = query.where.id === rows.solver.id ? "solver" : "reviewJob";
      const observed = structuredClone(rows[key]);
      // The exact final row was observed, but its ownership changes while the
      // subsequent async principal read completes. No atomicity is claimed.
      if (++lookup === finalLookup) rows[key].lockedBy = "foreign-after-last-observation";
      return observed;
    });
    const dto = await validateLrcPhaseRead(handle, phase);
    expect(dto.readBinding).toBe("OBSERVED_MATCH");
    expect(dto.observationConsistency).toBe("COOPERATIVE_NON_ATOMIC");
    expect(dto.admission).toBe("NOT_GRANTED"); expect(dto.dispatchAllowed).toBe(false);
    // A subsequent refresh sees the changed row and refuses. The earlier DTO
    // must never substitute for a critical operation's transaction/CAS fence.
    await expect(validateLrcPhaseRead(handle, phase)).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each([null, [], "not-an-attempt", 0])("coherent %j attempt hash is not a retained mathematical object", async value => {
    setup("REVIEW_ACTIVE"); rows.run.mathModelAttempt = value;
    const forgedDigest = sha256(canonicalJson(value)); rows.run.mathModelAttemptDigest = forgedDigest;
    nested("solver", "result").mathModelAttemptDigest = forgedDigest;
    if (request.phase === "REVIEW_ACTIVE") request.solverAttemptDigest = forgedDigest;
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it.each(["missing-field", "bad-result-digest", "negative-count", "fractional-count", "oversized-count", "array-usage", "status-not-native"])("native solver result %s refuses", async kind => {
    setup("REVIEW_ACTIVE"); const result = nested("solver", "result");
    if (kind === "missing-field") delete result.providerUsage;
    if (kind === "bad-result-digest") result.resultDigest = "not-a-digest";
    if (kind === "negative-count") result.sourceCount = -1;
    if (kind === "fractional-count") result.findingCount = 1.5;
    if (kind === "oversized-count") result.sourceCount = 10001;
    if (kind === "array-usage") result.providerUsage = [];
    if (kind === "status-not-native") result.status = "AWAITING_REVIEW";
    await expect(mint()).rejects.toThrow("PHASE_READ_REFUSED");
  });
  it("malformed input is refused before auth/DB and arbitrary failure messages never leak", async () => {
    await expect(authorizeLrcPhaseRead(new Headers(), { phase: "PROSPECTIVE", secret: "do-not-leak" })).rejects.toThrow("PHASE_READ_REFUSED");
    expect(f.session).not.toHaveBeenCalled(); f.session.mockRejectedValue(new Error("private-db-root-cookie"));
    await expect(mint()).rejects.toThrow(/^PHASE_READ_REFUSED$/);
  });
  it("DTO has no raw rows, handles, credentials, root or mathematics", async () => {
    setup("TERMINAL"); const dto = await validateLrcPhaseRead(await mint(), "TERMINAL");
    const text = JSON.stringify(dto); for (const secret of ["fixture-secret-cookie", rows.session.id, "fixture-actor", "fixture-org", "Fixture-only", "semanticAcceptance", "ResearchDiagnostics"]) expect(text).not.toContain(secret);
    expect(Object.keys(dto)).toHaveLength(17);
  });
});
