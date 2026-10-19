import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestResearchStepAction } from "@/app/actions/research-sandbox";
import { ResearchSandboxError } from "@/modules/research-sandbox/errors";

const ports = vi.hoisted(() => ({ resolve: vi.fn(), request: vi.fn(), revalidate: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/cache", () => ({ revalidatePath: ports.revalidate }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/modules/identity-workspace", () => ({ resolveWorkspaceContext: ports.resolve }));
vi.mock("@/modules/research-sandbox", () => ({ requestResearchRun: ports.request }));
vi.mock("@/modules/authoring", () => ({ importApprovedResearchBundle: vi.fn() }));
vi.mock("@/server/env", () => ({ getEnv: vi.fn() }));
const ctx = { workspace: { id: "session-workspace" }, user: { id: "session-actor" } };
function form() {
  const input = new FormData();
  for (const [key, value] of Object.entries({ slug: "workspace", missionId: "mission", intent: "Goal", language: "vi", steeringMode: "HUMAN", guidance: "Compare original sources", parentRunId: "parent", idempotencyKey: "key", allowedDomains: "one.org, two.org", queries: "query one\nquery two", maxSources: "12" })) input.set(key, value);
  return input;
}
beforeEach(() => {
  vi.resetAllMocks(); ports.resolve.mockResolvedValue(ctx);
  ports.request.mockResolvedValue({ status: "SUCCEEDED", outcome: { runId: "run", status: "QUEUED" }, outboxEventIds: ["event"] });
});
describe("research step action authenticates and reports state without claiming live execution", () => {
  it("uses session workspace and actual fixed provider, forwards bounded intent not prepared context", async () => {
    expect(await requestResearchStepAction({ status: "IDLE" }, form())).toEqual({ status: "QUEUED" });
    expect(ports.resolve).toHaveBeenCalledWith(expect.any(Headers), "workspace");
    expect(ports.request).toHaveBeenCalledWith(ctx, expect.objectContaining({ providerName: "openai", modelName: "gpt-5.6-sol",
      steering: { mode: "HUMAN", guidance: "Compare original sources", parentRunId: "parent" },
      sourcePolicy: { allowedDomains: ["one.org", "two.org"], primaryDomains: [], requirePrimary: false, maxSources: 12 },
      queryPlan: { queries: ["query one", "query two"], languages: ["vi", "en"] } }));
    expect(ports.revalidate).toHaveBeenCalledWith("/w/workspace/research");
  });
  it("does not trust client provider, model, workspace or prepared snapshot", async () => {
    const input = form(); input.set("providerName", "codex-local"); input.set("modelName", "fake"); input.set("workspaceId", "other"); input.set("steeringContextData", "forged");
    await requestResearchStepAction({ status: "IDLE" }, input);
    const raw = ports.request.mock.calls[0][1]; expect(raw.providerName).toBe("openai"); expect(raw.modelName).toBe("gpt-5.6-sol");
    expect(raw.queryPlan).not.toHaveProperty("steering"); expect(raw).not.toHaveProperty("workspaceId");
  });
  it("never says running when transport refuses dispatch", async () => {
    ports.request.mockRejectedValue(new ResearchSandboxError("INVALID_TRANSITION", "private config details"));
    expect(await requestResearchStepAction({ status: "IDLE" }, form())).toEqual({ status: "UNAVAILABLE" });
    expect(ports.revalidate).not.toHaveBeenCalled();
  });
  it.each([new Error("secret auth diagnostics"), new ResearchSandboxError("NOT_FOUND", "other tenant secret")])("auth and missing/cross-tenant parent failures reveal no details", async (error) => {
    ports.resolve.mockRejectedValue(error);
    expect(await requestResearchStepAction({ status: "IDLE" }, form())).toEqual({ status: "REJECTED" });
    expect(ports.request).not.toHaveBeenCalled();
  });
  it("failed durable outcome never reports queued or launches an automatic retry", async () => {
    ports.request.mockResolvedValue({ status: "FAILED", outcome: {}, errorCode: "NOT_FOUND", outboxEventIds: [] });
    expect(await requestResearchStepAction({ status: "IDLE" }, form())).toEqual({ status: "REJECTED" });
    expect(ports.request).toHaveBeenCalledTimes(1); expect(ports.revalidate).not.toHaveBeenCalled();
  });
  it("unexpected dispatch failure is UNKNOWN, not a false claim of rejection", async () => {
    ports.request.mockRejectedValue(new Error("response lost after possible commit"));
    expect(await requestResearchStepAction({ status: "IDLE" }, form())).toEqual({ status: "UNKNOWN" });
    expect(ports.request).toHaveBeenCalledTimes(1); expect(ports.revalidate).not.toHaveBeenCalled();
  });
});
