import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ authorize: vi.fn(), cases: vi.fn(), active: vi.fn(), count: vi.fn(), jobs: vi.fn(), outboxes: vi.fn(), cycles: vi.fn(), cycleCount: vi.fn() }));
vi.mock("@/modules/identity-workspace", () => ({ AuditEventType: {}, writeAuditEvent: vi.fn() }));
vi.mock("@/modules/command-runtime", () => ({ executeDurableCommand: vi.fn() }));
vi.mock("@/modules/authorization", () => ({ requireWorkspaceAuthorization: mocks.authorize,
  organizationIdForWorkspace: async () => "organization" }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: async (_org: string, _actor: string, callback: (tx: unknown) => unknown) => callback({
  mission: { findFirst: async () => ({ id: missionId }) },
  mathPilotCase: { findMany: mocks.cases, findFirst: mocks.active, count: mocks.count }, durableJob: { findMany: mocks.jobs },
  outboxEvent: { findMany: mocks.outboxes }, mathResearchCycle: { findMany: mocks.cycles, count: mocks.cycleCount },
}) }));
import { listMathPilotCases, listMathPilotCaseSummaries, listMathPilotCalibrationActivity } from "@/modules/research-sandbox/kernel";
import { listMathResearchCyclePage } from "@/modules/research-sandbox/math-cycle-kernel";
import { calibrationCandidateFilter } from "@/modules/research-sandbox/math-dossier-pagination";
const missionId = "00000000-0000-4000-8000-000000000001";
const caseId = "00000000-0000-4000-8000-000000000002";
const ctx = { workspace: { id: "workspace" }, user: { id: "actor" } } as never;
beforeEach(() => { vi.clearAllMocks(); mocks.cases.mockResolvedValue([]); mocks.count.mockResolvedValue(80);
  mocks.active.mockResolvedValue(null);
  mocks.jobs.mockResolvedValue([]); mocks.outboxes.mockResolvedValue([]); mocks.cycles.mockResolvedValue([]); mocks.cycleCount.mockResolvedValue(9); });
describe("bounded authorized dossier database reads", () => {
  it("checks both active calibration types separately using only IDs and exact actor/provider/model/mission scope", async () => {
    mocks.active.mockResolvedValueOnce({ id: caseId }).mockResolvedValueOnce(null);
    expect([...await listMathPilotCalibrationActivity(ctx, missionId, "provider", "model")]).toEqual(["CALIBRATION_PROOF"]);
    expect(mocks.active).toHaveBeenCalledTimes(2);
    for (const [query] of mocks.active.mock.calls) {
      expect(query.select).toEqual({ id: true });
      expect(query.where).toMatchObject({ organizationId: "organization", workspaceId: "workspace", missionId,
        researchRun: { providerName: "provider", modelName: "model", status: { in: ["QUEUED", "RUNNING", "AWAITING_REVIEW"] } } });
    }
    expect(mocks.cases).not.toHaveBeenCalled(); expect(mocks.jobs).not.toHaveBeenCalled();
    expect(mocks.authorize).toHaveBeenCalledWith(ctx, "research.read", missionId);
  });
  it("loads 21 light summary records only, never full run/source/review/formal bodies", async () => {
    await listMathPilotCaseSummaries(ctx, missionId);
    const query = mocks.cases.mock.calls[0]?.[0];
    expect(query.where).toEqual({ organizationId: "organization", workspaceId: "workspace", missionId });
    expect(query.take).toBe(21); expect(query.include).toBeUndefined();
    expect(query.select.researchRun.select).toEqual({ question: true, status: true });
    expect(mocks.jobs).not.toHaveBeenCalled(); expect(mocks.outboxes).not.toHaveBeenCalled();
    expect(mocks.authorize).toHaveBeenCalledWith(ctx, "research.read", missionId);
  });
  it("retrieves an off-summary selected ID under exact mission AND workspace scope", async () => {
    await listMathPilotCases(ctx, missionId, { ids: [caseId] });
    expect(mocks.cases.mock.calls[0]?.[0]).toMatchObject({ where: { missionId, workspaceId: "workspace", organizationId: "organization", id: { in: [caseId] } }, take: 1 });
    for (const [query] of mocks.jobs.mock.calls) expect(query.where.outboxEvent).toEqual({ aggregateType: expect.any(String), aggregateId: { in: [] } });
    for (const [query] of mocks.outboxes.mock.calls) expect(query.where.aggregateId).toEqual({ in: [] });
  });
  it("does not look up jobs/outboxes when scanning calibration records", async () => {
    await listMathPilotCases(ctx, missionId, { calibration: { providerName: "provider", modelName: "model", cursor: null }, take: 20, includeJobs: false });
    expect(mocks.cases.mock.calls[0]?.[0].where).toMatchObject(calibrationCandidateFilter("provider", "model", null));
    expect(mocks.jobs).not.toHaveBeenCalled(); expect(mocks.outboxes).not.toHaveBeenCalled();
  });
  it("rejects malformed or duplicate case IDs before any retrieval", async () => {
    await expect(listMathPilotCases(ctx, missionId, { ids: [caseId, caseId] })).rejects.toThrow();
    await expect(listMathPilotCases(ctx, missionId, { ids: ["another"] })).rejects.toThrow();
    expect(mocks.cases).not.toHaveBeenCalled();
  });
  it("loads four cycle ID metadata records then exactly three full untruncated event chains", async () => {
    const ids = Array.from({ length: 4 }, (_, i) => ({ id: `00000000-0000-4000-8000-${String(i + 10).padStart(12, "0")}`, createdAt: new Date(2026, 0, 1) }));
    mocks.cycles.mockResolvedValueOnce(ids).mockResolvedValueOnce([]);
    const page = await listMathResearchCyclePage(ctx, missionId, caseId);
    expect(page.total).toBe(9); expect(page.hasMore).toBe(true);
    const light = mocks.cycles.mock.calls[0]?.[0], full = mocks.cycles.mock.calls[1]?.[0];
    expect(light.select).toEqual({ id: true, createdAt: true }); expect(light.take).toBe(4);
    expect(full.where).toMatchObject({ missionId, workspaceId: "workspace", rootCaseId: { in: [caseId] }, id: { in: ids.slice(0, 3).map((row) => row.id) } });
    expect(full.include.events).toEqual({ orderBy: { sequence: "asc" } }); expect(full.take).toBe(3);
  });
  it("a historical cycle ID remains bound to exact authorized case/mission/workspace", async () => {
    const id = "00000000-0000-4000-8000-000000000011";
    const result = await listMathResearchCyclePage(ctx, missionId, caseId, null, id);
    expect(result.items).toEqual([]);
    expect(mocks.cycles.mock.calls[0]?.[0].where).toMatchObject({ organizationId: "organization", workspaceId: "workspace", missionId, rootCaseId: caseId, id });
  });
  it("does not convert authorization failures to an empty successful dossier", async () => {
    mocks.authorize.mockRejectedValueOnce(new Error("denied"));
    await expect(listMathPilotCaseSummaries(ctx, missionId)).rejects.toThrow("denied");
    expect(mocks.cases).not.toHaveBeenCalled();
  });
});
