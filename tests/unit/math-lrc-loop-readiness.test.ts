import { beforeEach, describe, expect, it, vi } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { syntheticReadinessRows } from "./math-lrc-loop-readiness-fixture";
const mocks = vi.hoisted(() => ({ context: vi.fn(), authorize: vi.fn(), workspace: vi.fn(), tenant: vi.fn(), mission: vi.fn(), rows: vi.fn(), jobs: vi.fn(), pins: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/modules/identity-workspace/context", () => ({ resolveWorkspaceContext: mocks.context }));
vi.mock("@/modules/authorization", () => ({ authorize: mocks.authorize }));
vi.mock("@/server/db", () => ({ getDb: () => ({ workspace: { findFirst: mocks.workspace } }) }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: mocks.tenant }));
vi.mock("@/server/operations/math-method-unit-source-loader", () => ({ verifyInstalledMethodUnitSources: mocks.pins }));
import { loadLrcLoopReadiness } from "@/server/operations/math-lrc-loop-readiness";
let fixture: ReturnType<typeof syntheticReadinessRows>;
beforeEach(() => {
  vi.clearAllMocks(); fixture = syntheticReadinessRows();
  mocks.context.mockResolvedValue(fixture.ctx); mocks.authorize.mockResolvedValue({ allowed: true }); mocks.workspace.mockResolvedValue({ organizationId: "fixture-org" }); mocks.mission.mockResolvedValue({ id: fixture.row.missionId }); mocks.rows.mockImplementation(async () => [fixture.row]); mocks.jobs.mockImplementation(async (q: { where: { id: { in: string[] } } }) => fixture.jobs.filter(j => q.where.id.in.includes(j.id))); mocks.pins.mockImplementation(async () => fixture.pins);
  mocks.tenant.mockImplementation((_o: string, _a: string, work: (tx: unknown) => unknown) => work({ mission: { findFirst: mocks.mission }, mathPilotCase: { findMany: mocks.rows }, durableJob: { findMany: mocks.jobs } }));
});
const request = () => ({ headers: new Headers({ "x-fixture": "original" }), workspaceSlug: "fixture-workspace", missionId: fixture.row.missionId, caseIds: [fixture.row.id] });
describe("TIP070 SYNTHETIC session-scoped retained readiness, no scientific writes", () => {
  it("admits full ledger7 through exact external rows, not caller assertions", async () => {
    const dto = await loadLrcLoopReadiness(request());
    expect(dto.status).toBe("AUTHENTICATED_READ_ONLY"); expect(dto.admittedCount).toBe(1); expect(dto.tasks).toHaveLength(13);
    expect(dto.tasks.flatMap(t => t.sources)).toHaveLength(39); expect(dto.tasks.every(t => t.route === "UNROUTABLE" && t.proofClosure === false)).toBe(true);
    expect(dto.session).toBe("AUTHORIZED"); expect(dto.sources).toBe("VERIFIED_FIXED_37"); expect(dto.cases[0].retainedJobs).toBe("VERIFIED");
    expect(dto.decision).toBe("PLANNING_ONLY"); expect(dto.freshFiniteReplay).toBe("NOT_RUN"); expect(dto.independentInformation).toBe("NOT_BOUND"); expect(dto.batch).toBe("NOT_BOUND"); expect(dto.dispatchAllowed).toBe(false); expect(dto.proofClosure).toBe(false); expect(dto.globalLrc).toBe("NOT_ESTABLISHED");
    expect(Object.isFrozen(dto)).toBe(true); expect(Object.isFrozen(dto.tasks[0].sources)).toBe(true);
    expect(canonicalJson(dto)).not.toMatch(/fixture-viewer|fixture-original-actor|fixture-command|fixture-outbox|mathModelAttempt|solver-context|outputSchema|opaque/);
    expect(mocks.context).toHaveBeenCalledTimes(2); expect(mocks.authorize).toHaveBeenCalledTimes(2);
    expect(mocks.rows).toHaveBeenCalledWith(expect.objectContaining({ where: { organizationId: "fixture-org", workspaceId: "fixture-workspace", missionId: fixture.row.missionId, id: { in: [fixture.row.id] } }, take: 16 }));
    expect(mocks.jobs).toHaveBeenCalledWith(expect.objectContaining({ where: { organizationId: "fixture-org", workspaceId: "fixture-workspace", id: { in: fixture.jobs.map(j => j.id) } }, take: 32 }));
    expect(mocks.tenant).toHaveBeenCalledWith("fixture-org", "fixture-viewer", expect.any(Function));
    expect(mocks.mission).toHaveBeenCalledWith({ where: { id: fixture.row.missionId, workspaceId: "fixture-workspace", workspace: { organizationId: "fixture-org" } }, select: { id: true } });
  });
  it.each(["actor", "workspace", "membership", "organization", "capability", "session"])("refresh refuses %s drift without leaking admitted tasks", async kind => {
    if (kind === "actor") mocks.context.mockResolvedValueOnce(fixture.ctx).mockResolvedValueOnce({ ...fixture.ctx, user: { id: "foreign" } });
    if (kind === "workspace") mocks.context.mockResolvedValueOnce(fixture.ctx).mockResolvedValueOnce({ ...fixture.ctx, workspace: { ...fixture.ctx.workspace, id: "foreign" } });
    if (kind === "membership") mocks.context.mockResolvedValueOnce(fixture.ctx).mockResolvedValueOnce({ ...fixture.ctx, membership: { ...fixture.ctx.membership, status: "SUSPENDED" } });
    if (kind === "organization") mocks.workspace.mockResolvedValueOnce({ organizationId: "fixture-org" }).mockResolvedValueOnce({ organizationId: "foreign" });
    if (kind === "capability") mocks.authorize.mockResolvedValueOnce({ allowed: true }).mockResolvedValueOnce({ allowed: false });
    if (kind === "session") mocks.context.mockResolvedValueOnce(fixture.ctx).mockRejectedValueOnce(new Error("private-session-token"));
    const dto = await loadLrcLoopReadiness(request()); expect(dto.status).toBe("UNAVAILABLE"); expect(dto.cases).toEqual([]); expect(dto.tasks).toEqual([]); expect(dto.admittedCount).toBe(0); expect(canonicalJson(dto)).not.toMatch(/foreign|private-session-token/);
  });
  it.each(["unauthenticated", "denied", "inactive"])("initial %s stops before retained/source access", async kind => {
    if (kind === "unauthenticated") mocks.context.mockRejectedValue(new Error("raw auth secret"));
    if (kind === "denied") mocks.authorize.mockResolvedValue({ allowed: false });
    if (kind === "inactive") fixture.ctx.membership.status = "SUSPENDED";
    const dto = await loadLrcLoopReadiness(request()); expect(dto.status).toBe("UNAVAILABLE"); expect(mocks.rows).not.toHaveBeenCalled(); expect(mocks.pins).not.toHaveBeenCalled();
  });
  it("caller Headers mutation cannot change the revalidated request", async () => {
    const r = request(); mocks.rows.mockImplementation(async () => { r.headers.set("x-fixture", "redirected"); return [fixture.row]; });
    expect((await loadLrcLoopReadiness(r)).admittedCount).toBe(1);
    expect((mocks.context.mock.calls[1][0] as Headers).get("x-fixture")).toBe("original");
  });
  it.each(["extra-context", "duplicate", "over-cap", "bad-id", "empty"])("rejects %s input before authentication", async kind => {
    const r = request() as ReturnType<typeof request> & { ctx?: unknown };
    if (kind === "extra-context") r.ctx = fixture.ctx;
    if (kind === "duplicate") r.caseIds = [fixture.row.id, fixture.row.id];
    if (kind === "over-cap") r.caseIds = Array.from({ length: 17 }, (_, i) => `case-${i}`);
    if (kind === "bad-id") r.caseIds = ["../foreign"];
    if (kind === "empty") r.caseIds = [];
    expect((await loadLrcLoopReadiness(r)).status).toBe("INVALID_INPUT"); expect(mocks.context).not.toHaveBeenCalled();
  });
  it.each(["job-id", "type", "attempts", "maxAttempts", "job-tenant", "payload", "payload-extra", "outbox", "outbox-tenant", "command", "command-actor", "command-outcome", "aggregate", "topic", "outbox-payload", "status", "outbox-status", "solver-result", "research-result", "review-result", "disposition"])("exact %s fence refuses, never latest job by case", async fault => {
    const solver = fixture.jobs[0], review = fixture.jobs[1];
    if (fault === "job-id") fixture.row.researchRun.jobId = "different-job";
    if (fault === "type") solver.jobType = "research.run.execute";
    if (fault === "attempts") solver.attempts = 2;
    if (fault === "maxAttempts") review.maxAttempts = 2;
    if (fault === "job-tenant") solver.organizationId = "foreign";
    if (fault === "payload") solver.payload = { runId: "sibling" };
    if (fault === "payload-extra") solver.payload = { runId: fixture.row.researchRun.id, extra: true } as typeof solver.payload;
    if (fault === "outbox") solver.outboxEventId = "different";
    if (fault === "outbox-tenant") review.outboxEvent.workspaceId = "foreign";
    if (fault === "command") review.outboxEvent.commandId = "manual-review-command";
    if (fault === "command-actor") review.outboxEvent.command.actorUserId = "different";
    if (fault === "command-outcome") review.outboxEvent.command.outcome.runId = "sibling";
    if (fault === "aggregate") review.outboxEvent.aggregateType = "ResearchRun";
    if (fault === "topic") review.outboxEvent.topic = "research.run.execute";
    if (fault === "outbox-payload") review.outboxEvent.payload = { caseId: "sibling" };
    if (fault === "status") review.status = "RUNNING";
    if (fault === "outbox-status") solver.outboxEvent.status = "PENDING";
    if (fault === "solver-result") solver.result.mathModelAttemptDigest = "e".repeat(64);
    if (fault === "research-result") solver.result.resultDigest = "e".repeat(64);
    if (fault === "review-result") review.result.ledgerDigest = "e".repeat(64);
    if (fault === "disposition") review.result.disposition = "invented" as typeof review.result.disposition;
    const dto = await loadLrcLoopReadiness(request()); expect(dto.admittedCount).toBe(0); expect(dto.tasks).toEqual([]); expect(dto.cases.every(c => c.status === "REFUSED")).toBe(true);
  });
  it.each(["case-tenant", "run-tenant", "review-tenant", "requester", "case-link", "question", "scope", "provider", "contract", "attempt", "ledger", "review-dossier", "sources", "finding"])("%s substitution cannot pass retained admission", async fault => {
    if (fault === "case-tenant") fixture.row.workspaceId = "foreign";
    if (fault === "run-tenant") fixture.row.researchRun.missionId = "foreign";
    if (fault === "review-tenant") fixture.row.agentReview.organizationId = "foreign";
    if (fault === "requester") fixture.row.researchRun.requestedByMembershipId = "sibling";
    if (fault === "case-link") fixture.row.researchRunId = "sibling";
    if (fault === "question") fixture.row.researchRun.question = "Another conjecture";
    if (fault === "scope") fixture.row.researchRun.scope = "Another scope";
    if (fault === "provider") fixture.row.researchRun.providerName = "openai";
    if (fault === "contract") fixture.row.contractDigest = "e".repeat(64);
    if (fault === "attempt") fixture.row.researchRun.mathModelAttempt.argument += " changed";
    if (fault === "ledger") fixture.row.agentReview.ledgerDigest = "e".repeat(64);
    if (fault === "review-dossier") fixture.row.agentReview.researchDigest = "e".repeat(64);
    if (fault === "sources") fixture.row.researchRun.sources = [{ canonicalUri: "https://example.invalid", contentDigest: "e".repeat(64), provenance: "CLAIM" }] as never[];
    if (fault === "finding") fixture.row.researchRun.findings[0].claim = "invented new result";
    const dto = await loadLrcLoopReadiness(request()); expect(dto.admittedCount).toBe(0); expect(dto.tasks).toEqual([]);
  });
  it("legacy064 stays LEGACY_NOT_ADMISSIBLE, not repaired or backfilled", async () => {
    fixture.row.contract = { version: 3 } as typeof fixture.row.contract;
    const before = structuredClone(fixture.row); const dto = await loadLrcLoopReadiness(request());
    expect(dto.cases[0].status).toBe("LEGACY_NOT_ADMISSIBLE"); expect(dto.tasks).toEqual([]); expect(fixture.row).toEqual(before);
  });
  it("missing exact requested case is non-disclosing unavailable", async () => {
    mocks.rows.mockResolvedValue([]); const dto = await loadLrcLoopReadiness(request()); expect(dto.cases[0].reason).toBe("CASE_UNAVAILABLE"); expect(dto.admittedCount).toBe(0); expect(mocks.jobs).not.toHaveBeenCalled();
  });
  it("returned foreign case equals missing state and never resolves its jobs", async () => {
    fixture.row.organizationId = "foreign-private-org";
    const dto = await loadLrcLoopReadiness(request()); expect(dto.cases[0]).toEqual({ caseId: fixture.row.id, status: "UNAVAILABLE", reason: "CASE_UNAVAILABLE", retainedJobs: "NOT_ADMITTED" });
    expect(mocks.jobs).not.toHaveBeenCalled(); expect(canonicalJson(dto)).not.toContain("foreign-private-org");
  });
  it("wrong-tenant review is unavailable before any foreign job identity is read", async () => {
    fixture.row.agentReview.organizationId = "foreign-private-org";
    fixture.row.agentReview.jobId = "foreign-private-job";
    const dto = await loadLrcLoopReadiness(request()); expect(dto.cases[0].reason).toBe("CASE_UNAVAILABLE"); expect(dto.cases[0].status).toBe("UNAVAILABLE"); expect(mocks.jobs).not.toHaveBeenCalled(); expect(canonicalJson(dto)).not.toMatch(/foreign-private|INPUT_BINDING_REFUSED/);
  });
  it("missing review is MISSING, never a checker/model fallback", async () => {
    fixture.row.agentReview = null as never;
    const dto = await loadLrcLoopReadiness(request()); expect(dto.cases[0].status).toBe("MISSING"); expect(dto.admittedCount).toBe(0); expect(dto.freshFiniteReplay).toBe("NOT_RUN");
  });
  it("unavailable host finite pins cannot be self-admitted from ledger", async () => {
    fixture.pins.finiteSourcePins.checkerSourceSha256 = "e".repeat(64);
    const dto = await loadLrcLoopReadiness(request()); expect(dto.tasks).toEqual([]); expect(dto.admittedCount).toBe(0); expect(dto.cases[0].reason).toBe("RETAINED_EVIDENCE_REFUSED");
  });
  it.each(["source", "db"])("%s operational error is sanitized and still refreshes access", async fault => {
    const error = new Error("postgres://credential@private-root/raw-model"); if (fault === "source") mocks.pins.mockRejectedValue(error); else mocks.rows.mockRejectedValue(error);
    const dto = await loadLrcLoopReadiness(request()); expect(dto.status).toBe(fault === "source" ? "SOURCE_REFUSED" : "OPERATIONAL_REFUSED"); expect(dto.tasks).toEqual([]); expect(canonicalJson(dto)).not.toMatch(/postgres|private-root|credential|raw-model/); expect(mocks.context).toHaveBeenCalledTimes(2);
  });
  it.each(["cycle", "depth", "getter", "bytes"])("bounded JSON refuses %s before hashing/admission", async fault => {
    const value: Record<string, unknown> = {};
    if (fault === "cycle") value.self = value;
    if (fault === "depth") { let cursor = value; for (let i = 0; i < 40; i++) { cursor.next = {}; cursor = cursor.next as Record<string, unknown>; } }
    if (fault === "getter") Object.defineProperty(value, "secret", { enumerable: true, get: () => { throw new Error("getter executed"); } });
    if (fault === "bytes") value.text = "x".repeat(2097153);
    fixture.row.contract = value; const dto = await loadLrcLoopReadiness(request()); expect(dto.admittedCount).toBe(0); expect(dto.tasks).toEqual([]); expect(dto.blockers).toContain("INPUT_REFUSED");
  });
  it("deterministic sorted multi-case projection preserves 78 exact source findings", async () => {
    const other = syntheticReadinessRows(2); mocks.rows.mockResolvedValue([other.row, fixture.row]); mocks.jobs.mockResolvedValue([...other.jobs, ...fixture.jobs]);
    const r = request(); r.caseIds.push(other.row.id); const a = await loadLrcLoopReadiness(r); r.caseIds.reverse(); const b = await loadLrcLoopReadiness(r);
    expect(canonicalJson(a)).toBe(canonicalJson(b)); expect(a.admittedCount).toBe(2); expect(a.tasks.flatMap(t => t.sources)).toHaveLength(78);
  });
  it("mixed missing/valid cohort never emits partially trusted tasks", async () => {
    const r = request(); r.caseIds.push("00000000-0000-4000-8000-000000000099"); const dto = await loadLrcLoopReadiness(r); expect(dto.admittedCount).toBe(0); expect(dto.tasks).toEqual([]); expect(dto.cases.find(c => c.caseId === fixture.row.id)?.reason).toBe("COHORT_REFUSED");
  });
});
