import { beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { requestResearchRun } from "@/modules/research-sandbox/kernel";
import { prepareResearchSteering } from "@/modules/research-sandbox/research-steering";

const ports = vi.hoisted(() => ({ command: vi.fn(), authorize: vi.fn(), organization: vi.fn(), env: vi.fn(), audit: vi.fn() }));
vi.mock("@/modules/command-runtime", () => ({ executeDurableCommand: ports.command }));
vi.mock("@/modules/authorization", () => ({ requireWorkspaceAuthorization: ports.authorize, organizationIdForWorkspace: ports.organization }));
vi.mock("@/modules/identity-workspace", () => ({ AuditEventType: { ResearchRequested: "ResearchRequested" }, writeAuditEvent: ports.audit }));
vi.mock("@/server/env", () => ({ getEnv: ports.env }));
vi.mock("@/server/tenant-context", () => ({ withOrganizationTenant: vi.fn() }));

const ctx = { user: { id: "actor" }, workspace: { id: "workspace" }, membership: { id: "member" } } as WorkspaceContext;
const config = { RESEARCH_WORKER_ENABLED: true, RESEARCH_OPENAI_ENABLED: true, OPENAI_API_KEY: "test", RESEARCH_WORKER_ORGANIZATION_ID: "org", RESEARCH_WORKER_ACTOR_USER_ID: "actor" };
const policy = { allowedDomains: ["original.example"], primaryDomains: ["original.example"], requirePrimary: true, maxSources: 3 };
const request = () => ({ missionId: "mission", documentId: null, question: "Exact original goal", scope: "new caller scope", providerName: "openai", modelName: "gpt-5.6-sol",
  sourcePolicy: { allowedDomains: [], primaryDomains: [], requirePrimary: false, maxSources: 50 }, queryPlan: { queries: ["query"], languages: ["en"] },
  steering: { mode: "HUMAN", guidance: "Investigate a different assumption", parentRunId: "parent" }, idempotencyKey: "test-key" });
const parent = () => ({ id: "parent", question: "Exact original goal", documentId: null, scope: "Original bounded scope", sourcePolicy: policy,
  providerName: "openai", modelName: "gpt-5.6-sol", status: "AWAITING_REVIEW", mathPilotCase: null,
  queryPlan: { queries: ["query"], languages: ["en"] }, findings: [], sources: [] });
let tx: { mission: { findFirst: ReturnType<typeof vi.fn> }; researchRun: { findFirst: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> } };
let effects: { outcome: unknown; outbox: Array<{ topic: string }> };
beforeEach(() => {
  vi.resetAllMocks(); ports.organization.mockResolvedValue("org"); ports.env.mockReturnValue(config);
  tx = { mission: { findFirst: vi.fn().mockResolvedValue({ id: "mission" }) }, researchRun: { findFirst: vi.fn().mockResolvedValue(parent()), create: vi.fn(), update: vi.fn() } };
  ports.command.mockImplementation(async (_ctx: unknown, _envelope: unknown, handler: (tx: unknown, command: unknown) => Promise<typeof effects>) => {
    const result = await handler(tx, { organizationId: "org", workspaceId: "workspace", commandId: "cmd", correlationId: "c" });
    effects = result;
    return { status: "SUCCEEDED", outcome: result.outcome, outboxEventIds: ["outbox"] };
  });
});
describe("authenticated one-step steering, no real DB or provider", () => {
  it("checks disabled transport before recording a command or creating a run", async () => {
    ports.env.mockReturnValue({ ...config, RESEARCH_WORKER_ENABLED: false });
    await expect(requestResearchRun(ctx, request())).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
    expect(ports.authorize).toHaveBeenCalledWith(ctx, "research.request");
    expect(ports.command).not.toHaveBeenCalled(); expect(tx.researchRun.create).not.toHaveBeenCalled();
  });
  it("does not reveal readiness before request authorization", async () => {
    ports.authorize.mockRejectedValue(new Error("not authorized"));
    await expect(requestResearchRun(ctx, request())).rejects.toThrow("not authorized");
    expect(ports.env).not.toHaveBeenCalled(); expect(ports.command).not.toHaveBeenCalled();
  });
  it("scopes parent lookup to tenant, workspace and mission and retains immutable history", async () => {
    const original = parent(); tx.researchRun.findFirst.mockResolvedValue(original);
    const result = await requestResearchRun(ctx, request());
    expect(tx.researchRun.findFirst.mock.calls[0][0].where).toEqual({ id: "parent", organizationId: "org", workspaceId: "workspace", missionId: "mission" });
    expect(tx.researchRun.create).toHaveBeenCalledTimes(1);
    expect(tx.researchRun.create.mock.calls[0][0].data).toMatchObject({ question: original.question, scope: original.scope, sourcePolicy: policy,
      queryPlan: { steering: { mode: "HUMAN", parentRunId: "parent", rootRunId: "parent", prior: { status: "AWAITING_REVIEW" } } } });
    expect(tx.researchRun.update).not.toHaveBeenCalled(); expect(result.status).toBe("SUCCEEDED");
    expect(effects.outbox).toHaveLength(1); expect(effects.outbox[0].topic).toBe("research.run.execute");
  });
  it("refuses unknown or cross-tenant parent before any research record", async () => {
    tx.researchRun.findFirst.mockResolvedValue(null);
    await expect(requestResearchRun(ctx, request())).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(tx.researchRun.create).not.toHaveBeenCalled();
  });
  it.each([{ question: "Changed goal" }, { documentId: "other-document" }, { providerName: "other" }, { modelName: "other-model" }])("refuses implicit parent contract change %j", async (change) => {
    tx.researchRun.findFirst.mockResolvedValue({ ...parent(), ...change });
    await expect(requestResearchRun(ctx, request())).rejects.toMatchObject({ code: "INVALID_INPUT" });
    expect(tx.researchRun.create).not.toHaveBeenCalled();
  });
  it.each([{ status: "RUNNING" }, { status: "QUEUED" }, { mathPilotCase: { id: "paused-math" } }])("does not continue running or sealed math parent %j", async (change) => {
    tx.researchRun.findFirst.mockResolvedValue({ ...parent(), ...change });
    await expect(requestResearchRun(ctx, request())).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
    expect(tx.researchRun.create).not.toHaveBeenCalled();
  });
  it("rejects caller-forged inherited context even when schema-valid", async () => {
    const raw = request(); const steering = prepareResearchSteering({ mode: "AUTO", guidance: "", parentRunId: null }, "forged-root");
    await expect(requestResearchRun(ctx, { ...raw, queryPlan: { ...raw.queryPlan, steering } })).rejects.toMatchObject({ code: "INVALID_INPUT" });
    expect(ports.command).not.toHaveBeenCalled();
  });
  it("new AUTO goal emits one job and no implicit critic/retry", async () => {
    const raw = request(); await requestResearchRun(ctx, { ...raw, steering: { mode: "AUTO" } });
    expect(tx.researchRun.findFirst).not.toHaveBeenCalled(); expect(effects.outbox).toHaveLength(1);
    expect(tx.researchRun.create.mock.calls[0][0].data.queryPlan.steering).toMatchObject({ mode: "AUTO", parentRunId: null, prior: null });
  });
  it("leaves historical non-steering request behavior unchanged", async () => {
    ports.env.mockReturnValue({}); const raw = request(); const { steering: _unused, ...legacy } = raw;
    expect(_unused.mode).toBe("HUMAN");
    await expect(requestResearchRun(ctx, legacy)).resolves.toMatchObject({ status: "SUCCEEDED" });
    expect(ports.authorize).not.toHaveBeenCalled(); expect(ports.env).not.toHaveBeenCalled();
    expect(tx.researchRun.create.mock.calls[0][0].data.queryPlan).toEqual(raw.queryPlan);
  });
  it("binds stable steering intent to idempotency, not a new random run id on every retry", async () => {
    await requestResearchRun(ctx, request()); await requestResearchRun(ctx, request());
    const first = ports.command.mock.calls[0][1]; const second = ports.command.mock.calls[1][1];
    expect(first.payload).toEqual(second.payload); expect(first.payload).not.toHaveProperty("runId");
    expect(first.payload).toMatchObject({ question: "Exact original goal", steering: { mode: "HUMAN", guidance: "Investigate a different assumption" } });
    await requestResearchRun(ctx, { ...request(), steering: { ...request().steering, guidance: "Try another route" } });
    expect(ports.command.mock.calls[2][1].payload).not.toEqual(first.payload);
  });
});
