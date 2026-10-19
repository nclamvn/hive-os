import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ObservationBudget, observeLrcOnce } from "@/server/operations/lrc-controlled-observation";

const fixtures = vi.hoisted(() => ({
  db: { user: { findUnique: vi.fn() }, workspace: { findMany: vi.fn() }, membership: { findUnique: vi.fn() } },
  tx: { organizationMembership: { findUnique: vi.fn() }, mathPilotCase: { findMany: vi.fn(), findFirst: vi.fn() }, durableJob: { findFirst: vi.fn() } },
  authorize: vi.fn(), calibration: vi.fn(), getEnv: vi.fn(), request: vi.fn(),
}));
vi.mock("@/server/db", () => ({ getDb: () => fixtures.db }));
vi.mock("@/server/env", () => ({ getEnv: fixtures.getEnv }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: (_organization: string, _actor: string,
  work: (tx: typeof fixtures.tx) => unknown) => work(fixtures.tx) }));
vi.mock("@/modules/authorization", () => ({ authorize: fixtures.authorize }));
vi.mock("@/modules/command-runtime/jobs", () => ({ claimJobs: vi.fn(), failJob: vi.fn() }));
vi.mock("@/modules/command-runtime/kernel", () => ({ dispatchOutboxBatch: vi.fn() }));
vi.mock("@/modules/research-sandbox/kernel", () => ({ requestResearchRun: fixtures.request, listMathPilotCases: vi.fn() }));
vi.mock("@/modules/research-sandbox/math-dossier-loader", () => ({ loadMathCalibrationReadiness: fixtures.calibration }));
vi.mock("@/modules/research-sandbox/worker", () => ({ executeResearchJob: vi.fn() }));
vi.mock("@/modules/research-sandbox/agent-review-kernel", () => ({ executeMathPilotAgentReviewJob: vi.fn() }));

import { createObservationRuntime } from "@/server/operations/lrc-controlled-observation-runtime";
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("DATABASE_URL", "postgresql://offline@127.0.0.1/hiveos_dev?schema=public");
  vi.stubEnv("DEPLOYMENT_ENV", "development");
  for (const key of ["RESEARCH_WORKER_ENABLED", "RESEARCH_OPENAI_ENABLED", "SANDBOX_DOCKER_ENABLED"]) vi.stubEnv(key, "false");
  vi.stubEnv("MATH_REVIEW_ADVERSARY_MODEL", "gpt-6-sol");
  fixtures.db.user.findUnique.mockResolvedValue({ id: "explicit", name: "Explicit actor", email: "explicit@test.invalid" });
  fixtures.db.workspace.findMany.mockResolvedValue([{ id: "workspace", organizationId: "org", slug: "mathematics-pilot-lab-156de0", status: "ACTIVE", name: "Math" }]);
  fixtures.db.membership.findUnique.mockResolvedValue({ id: "membership", status: "ACTIVE", role: "OWNER" });
  fixtures.tx.organizationMembership.findUnique.mockResolvedValue({ status: "ACTIVE" });
  fixtures.authorize.mockResolvedValue({ allowed: true });
  fixtures.calibration.mockResolvedValue({ passed: new Set(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"]), complete: true, inspected: 2 });
  fixtures.getEnv.mockReturnValue({ RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: false, LRC_CAMPAIGN_LOCAL_ENABLED: false, RESEARCH_WORKER_ENABLED: false });
  fixtures.tx.durableJob.findFirst.mockResolvedValue({ id: "old-terminal-review" });
  fixtures.tx.mathPilotCase.findFirst.mockResolvedValue({ id: "created-case" });
  fixtures.request.mockResolvedValue({ commandId: "created-command", status: "SUCCEEDED", outcome: { runId: "created-run" }, outboxEventIds: ["created-outbox"] });
});
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
function preflight(activeCycles: Array<{ id: string }>, status = "AWAITING_REVIEW") {
  fixtures.tx.mathPilotCase.findMany.mockResolvedValue([{ id: "old-case", researchRun: { status }, agentReview: null, researchCycles: activeCycles }]);
  return createObservationRuntime({ actor: { userId: "explicit" }, mode: "preflight",
    receipt: { append: async () => {} }, budget: new ObservationBudget(performance.now()) }).preflight();
}
describe("TIP-062 runtime preflight mocked DB only", () => {
  it.each(["QUEUED", "RUNNING"])("terminal old review cannot exempt an active %s cycle", async status => {
    const ready = await preflight([{ id: `active-${status}` }]);
    expect(ready.conflictingActiveCase).toBe(true); expect(fixtures.tx.durableJob.findFirst).not.toHaveBeenCalled();
    expect(fixtures.tx.mathPilotCase.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ organizationId: "org", workspaceId: "workspace" }),
      select: expect.objectContaining({ researchCycles: { where: { status: { in: ["QUEUED", "RUNNING"] } }, select: { id: true }, take: 1 } }),
    }));
  });
  it("preserves DEAD_LETTER exception only without any active cycle", async () => {
    const ready = await preflight([]); expect(ready.conflictingActiveCase).toBe(false);
    expect(fixtures.tx.durableJob.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({
      organizationId: "org", workspaceId: "workspace", status: "DEAD_LETTER", payload: { path: ["caseId"], equals: "old-case" },
    }) }));
  });
  it("missing terminal review remains an active conflict", async () => {
    fixtures.tx.durableJob.findFirst.mockResolvedValue(null); expect((await preflight([])).conflictingActiveCase).toBe(true);
  });
  it("running root cannot receive the awaiting-review exception", async () => {
    expect((await preflight([], "RUNNING")).conflictingActiveCase).toBe(true); expect(fixtures.tx.durableJob.findFirst).not.toHaveBeenCalled();
  });
  it("actor is resolved by operator's exact ID, never arbitrary first administrator", async () => {
    await preflight([]); expect(fixtures.db.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "explicit" } }));
  });
  it("successful actual create binding returns IDs before any success receipt append", async () => {
    const append = vi.fn(async (record: Record<string, unknown>) => { if (record.event === "COMMAND_OUTCOME") throw new Error("journal fault"); });
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);
    const runtime = createObservationRuntime({ actor: { userId: "explicit" }, mode: "preflight",
      receipt: { append }, budget: new ObservationBudget(performance.now()) });
    const ready = await runtime.preflight();
    expect(await runtime.create(ready.identity)).toEqual({ caseId: "created-case", runId: "created-run", commandId: "created-command", outboxId: "created-outbox" });
    expect(append).not.toHaveBeenCalledWith(expect.objectContaining({ event: "COMMAND_OUTCOME" }));
  });
  it.each(["CREATED_RECEIPT", "CASE_LOOKUP"])("actual runtime path preserves known IDs after %s failure", async failure => {
    fixtures.getEnv.mockReturnValue({ RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: true, LRC_CAMPAIGN_LOCAL_ENABLED: true, RESEARCH_WORKER_ENABLED: false });
    fixtures.tx.mathPilotCase.findMany.mockResolvedValue([]);
    if (failure === "CASE_LOOKUP") fixtures.tx.mathPilotCase.findFirst.mockRejectedValue(new Error("lookup fault"));
    const records: Record<string, unknown>[] = [];
    const receipt = { append: async (record: Record<string, unknown>) => {
      if (failure === "CREATED_RECEIPT" && record.event === "CREATED") throw new Error("receipt fault"); records.push(record);
    } };
    const budget = new ObservationBudget(performance.now());
    const runtime = createObservationRuntime({ actor: { userId: "explicit" }, mode: "run", receipt, budget });
    runtime.login = async () => {}; // Explicit offline seam: never start Codex/login.
    expect((await observeLrcOnce({ mode: "run", runtime, receipt, budget })).status).toBe("PARTIAL_OR_FAILED");
    expect(records.at(-1)).toMatchObject({ runId: "created-run", commandId: "created-command", outboxId: "created-outbox" });
    if (failure === "CREATED_RECEIPT") expect(records.at(-1)).toMatchObject({ caseId: "created-case" });
    expect(fixtures.request).toHaveBeenCalledOnce();
  });
});
