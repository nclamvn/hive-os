import { describe, expect, it, vi } from "vitest";
import { LRC_OBSERVATION_TARGET, ObservationBudget, ObservationStop, observeLrcOnce,
  assertObservationLocalEnvironment,
  type ObservationRuntime, type ObservationPrerequisites } from "@/server/operations/lrc-controlled-observation";

function fixture() {
  let now = 0;
  const budget = new ObservationBudget(0, () => now);
  const records: Record<string, unknown>[] = [];
  const identity = { organizationId: "org", workspaceId: "workspace", actorUserId: "explicit-actor", membershipId: "member" };
  const prerequisites: ObservationPrerequisites = { identity, authorized: true, capabilities: true,
    calibrationProof: true, calibrationCounterexample: true, conflictingActiveCase: false };
  const created = { commandId: "command", runId: "run", caseId: "case", outboxId: "solver-outbox" };
  const runtime: ObservationRuntime = {
    preflight: vi.fn(async () => prerequisites), login: vi.fn(async () => {}),
    create: vi.fn(async () => created),
    dispatch: vi.fn(async (_identity, outboxId) => ({ id: `${outboxId}-job`, version: 1, attempts: 0, outboxId })),
    claim: vi.fn(async (_identity, job) => ({ ...job, version: 2, attempts: 1 })),
    solver: vi.fn(async () => {}), automaticReview: vi.fn(async () => "auto-review-outbox"),
    review: vi.fn(async (_identity, _created, _job, _signal, before) => { before("CRITIC"); before("ADVERSARY"); }),
    inspect: vi.fn(async () => ({ reviewIntegrityValid: true, reviewId: "review", reviewConclusion: "PARTIAL", usage: null,
      reviewVersion: 5, attemptedRoles: 3, caseId: "case", runId: "run", contractBindingValid: true,
      jobs: [{ id: "solver-outbox-job", jobType: "math-pilot.codex-local.execute", status: "SUCCEEDED", attempts: 1 },
        { id: "auto-review-outbox-job", jobType: "math-pilot.codex-local.review", status: "SUCCEEDED", attempts: 1 }] })),
    failOwned: vi.fn(async () => {}),
  };
  const receipt = { append: vi.fn(async (record: Record<string, unknown>) => { records.push(record); }) };
  return { budget, records, identity, prerequisites, created, runtime, receipt, setNow: (value: number) => { now = value; },
    run: (mode: "run" | "preflight" = "run") => observeLrcOnce({ mode, runtime, receipt, budget }) };
}
describe("TIP-062 injected offline one-shot", () => {
  it("R2 dispatches exactly solver and its automatic review once with exact IDs", async () => {
    const f = fixture(); expect((await f.run()).status).toBe("COMPLETED_LOCAL_OBSERVATION");
    expect(f.runtime.create).toHaveBeenCalledOnce(); expect(f.runtime.solver).toHaveBeenCalledOnce(); expect(f.runtime.review).toHaveBeenCalledOnce();
    expect(f.runtime.dispatch).toHaveBeenNthCalledWith(1, f.identity, "solver-outbox");
    expect(f.runtime.dispatch).toHaveBeenNthCalledWith(2, f.identity, "auto-review-outbox");
    expect(f.runtime.claim).toHaveBeenCalledTimes(2);
  });
  it("R3 preflight performs no creation, job mutation or model dispatch", async () => {
    const f = fixture(); expect((await f.run("preflight")).status).toBe("READY_READ_ONLY");
    for (const fn of [f.runtime.create, f.runtime.dispatch, f.runtime.claim, f.runtime.solver, f.runtime.review, f.runtime.failOwned]) expect(fn).not.toHaveBeenCalled();
  });
  it.each(["authorized", "capabilities", "calibrationProof", "calibrationCounterexample"] as const)("R3 missing %s refuses before login and creation", async key => {
    const f = fixture(); f.prerequisites[key] = false;
    expect((await f.run()).status).toBe("NOT_RUN"); expect(f.runtime.login).not.toHaveBeenCalled(); expect(f.runtime.create).not.toHaveBeenCalled();
  });
  it("R3 active conflict refuses without backfill", async () => {
    const f = fixture(); f.prerequisites.conflictingActiveCase = true;
    expect(await f.run()).toMatchObject({ status: "NOT_RUN", code: "CONFLICTING_ACTIVE_CASE" }); expect(f.runtime.create).not.toHaveBeenCalled();
  });
  it("R3 identity lookup exception is sanitized and not retried", async () => {
    const f = fixture(); vi.mocked(f.runtime.preflight).mockRejectedValue(new Error("postgresql://secret"));
    expect((await f.run()).status).toBe("NOT_RUN"); expect(JSON.stringify(f.records)).not.toContain("postgresql"); expect(f.runtime.preflight).toHaveBeenCalledOnce();
  });
  it("R2 uncertain creation is partial, never labeled NOT_RUN or retried", async () => {
    const f = fixture(); vi.mocked(f.runtime.create).mockRejectedValue(new Error("uncertain transaction"));
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(f.runtime.create).toHaveBeenCalledOnce(); expect(f.runtime.dispatch).not.toHaveBeenCalled();
  });
  it("R2 failed solver has no review and no second attempt", async () => {
    const f = fixture(); vi.mocked(f.runtime.solver).mockRejectedValue(new Error("ambiguous"));
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(f.runtime.solver).toHaveBeenCalledOnce();
    expect(f.runtime.automaticReview).not.toHaveBeenCalled(); expect(f.runtime.failOwned).toHaveBeenCalledOnce();
  });
  it("R2 absent automatic review refuses, never enqueues another", async () => {
    const f = fixture(); vi.mocked(f.runtime.automaticReview).mockRejectedValue(new ObservationStop("NO_AUTOMATIC_REVIEW"));
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(f.runtime.dispatch).toHaveBeenCalledOnce(); expect(f.runtime.review).not.toHaveBeenCalled();
  });
  it("R2 mismatched claimed identity refuses execution", async () => {
    const f = fixture(); vi.mocked(f.runtime.claim).mockImplementation(async (_identity, job) => ({ ...job, attempts: 1, id: "foreign" }));
    expect(await f.run()).toMatchObject({ code: "SOLVER_JOB_IDENTITY_OR_ATTEMPT_MISMATCH" }); expect(f.runtime.solver).not.toHaveBeenCalled();
  });
  it("R4 exhausted original budget refuses before preflight", async () => {
    const f = fixture(); f.setNow(1_800_000); expect(await f.run()).toMatchObject({ status: "NOT_RUN", code: "ORIGINAL_BUDGET_INSUFFICIENT" });
    expect(f.runtime.preflight).not.toHaveBeenCalled();
  });
  it("R4 preflight elapsed time reduces creation reserve, no timer reset", async () => {
    const f = fixture(); vi.mocked(f.runtime.login).mockImplementation(async () => { f.setNow(300_000); });
    expect(await f.run()).toMatchObject({ status: "NOT_RUN", code: "ORIGINAL_BUDGET_INSUFFICIENT" }); expect(f.runtime.create).not.toHaveBeenCalled();
  });
  it("R4 no adversary begins after critic exhausts budget; partial critic stays visible", async () => {
    const f = fixture(); vi.mocked(f.runtime.review).mockImplementation(async (_identity, _created, _job, _signal, before) => {
      before("CRITIC"); await f.receipt.append({ event: "ROLE_RETURNED", role: "CRITIC", threadId: "critic", usage: { inputTokens: 5 } });
      f.setNow(1_800_000); before("ADVERSARY");
    });
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(f.records).toContainEqual(expect.objectContaining({ role: "CRITIC", usage: { inputTokens: 5 } }));
    expect(f.budget.controller.signal.aborted).toBe(true); expect(f.runtime.failOwned).toHaveBeenCalledOnce();
  });
  it("R4 original limits remain fixed", () => { expect(LRC_OBSERVATION_TARGET).toMatchObject({ outerBudgetMs: 1_800_000, childBudgetMs: 240_000, streamBytes: 1_048_576, importBudgetMs: 10_000, leaseSeconds: 1_800 }); });
  it.each(["INDEPENDENT_THEOREM", null, "PROOF_SUPPORTED"])("R5 unsafe conclusion %s cannot complete", async reviewConclusion => {
    const f = fixture(); vi.mocked(f.runtime.inspect).mockResolvedValue({ reviewIntegrityValid: true, reviewId: "review", reviewConclusion });
    expect(await f.run()).toMatchObject({ status: "PARTIAL_OR_FAILED", code: "RETAINED_V5_REVIEW_MISSING_OR_UNSAFE" });
  });
  it("R5 invalid/missing review cannot complete", async () => {
    const f = fixture(); vi.mocked(f.runtime.inspect).mockResolvedValue({ reviewIntegrityValid: false, usage: null });
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(JSON.stringify(f.records)).not.toContain('"usage":0');
  });
  it("R5 duplicate role invocation is refused", async () => {
    const f = fixture(); vi.mocked(f.runtime.review).mockImplementation(async (_i, _c, _j, _s, before) => { before("CRITIC"); before("CRITIC"); });
    expect(await f.run()).toMatchObject({ code: "ROLE_ORDER_OR_COUNT_INVALID" });
  });
  it("R4 already-aborted scope cannot begin any stage", async () => {
    const f = fixture(); f.budget.controller.abort(); expect((await f.run()).status).toBe("NOT_RUN"); expect(f.runtime.preflight).not.toHaveBeenCalled();
  });
  it.each(["created", "claimed"])("R4 expiry immediately after %s side-effect retains identity and cleanup", async phase => {
    const f = fixture();
    if (phase === "created") vi.mocked(f.runtime.create).mockImplementation(async () => { f.setNow(1_800_000); return f.created; });
    else vi.mocked(f.runtime.claim).mockImplementation(async (_i, job) => { f.setNow(1_800_000); return { ...job, attempts: 1 }; });
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED");
    expect(f.records.at(-1)).toMatchObject({ caseId: "case", runId: "run" });
    if (phase === "claimed") { expect(f.runtime.failOwned).toHaveBeenCalledOnce(); expect(f.records.at(-1)).toMatchObject({ ownedJob: { id: "solver-outbox-job" } }); }
  });
  it.each(["authorized-create", "solver-exact-claim"])("R4 receipt failure after %s does not lose side-effect IDs", async name => {
    const f = fixture();
    vi.mocked(f.receipt.append).mockImplementation(async record => {
      if (record.event === "STAGE_FINISHED" && record.name === name) throw new Error("journal fault");
      f.records.push(record);
    });
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(f.records.at(-1)).toMatchObject({ caseId: "case" });
    if (name === "solver-exact-claim") expect(f.runtime.failOwned).toHaveBeenCalledOnce();
  });
  it.each(["reviewVersion", "attemptedRoles", "caseId", "contractBindingValid", "jobs"])("R5 missing host outcome %s refuses completed classification", async field => {
    const f = fixture(); const valid = await f.runtime.inspect(f.identity, f.created); delete valid[field]; vi.mocked(f.runtime.inspect).mockResolvedValue(valid);
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED");
  });
  it.each(["production", "staging"])("R3 pure guard rejects %s before loading runtime", deployment => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development", DEPLOYMENT_ENV: deployment, DATABASE_URL: "postgresql://x@localhost/hiveos_dev" })).toThrow();
  });
  it.each(["postgresql://x@remote/hiveos_dev", "postgresql://x@localhost/other", "invalid"])("R3 pure guard rejects unsafe DB without printing %s", database => {
    expect(() => assertObservationLocalEnvironment({ NODE_ENV: "development", DATABASE_URL: database })).toThrow("LOCAL_DATABASE_REQUIRED");
  });
  it("R4 final receipt-sync expiry cannot return a completed observation", async () => {
    const f = fixture(); vi.mocked(f.receipt.append).mockImplementation(async record => {
      f.records.push(record); if (record.status === "COMPLETED_LOCAL_OBSERVATION") f.setNow(1_800_000);
    });
    expect((await f.run()).status).toBe("PARTIAL_OR_FAILED"); expect(f.records.at(-1)).toMatchObject({ status: "PARTIAL_OR_FAILED", code: "ORIGINAL_BUDGET_INSUFFICIENT" });
  });
});
