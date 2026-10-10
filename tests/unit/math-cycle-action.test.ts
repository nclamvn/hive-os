import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestMathResearchCycleAction } from "@/app/actions/research-sandbox";
import { requestMathResearchCycle } from "@/modules/research-sandbox";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { CommandRuntimeError } from "@/modules/command-runtime/errors";
import { ResearchSandboxError } from "@/modules/research-sandbox/errors";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { commitmentChoice } from "../fixtures/math-research-commitment";

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn((path: string) => { throw new Error(`NEXT_REDIRECT:${path}`); }) }));
vi.mock("@/modules/research-sandbox", () => ({ requestMathResearchCycle: vi.fn() }));
vi.mock("@/modules/identity-workspace", () => ({ resolveWorkspaceContext: vi.fn(async () => ({ workspace: { slug: "trusted-lab" } })) }));

const form = () => {
  const data = new FormData();
  data.set("slug", "trusted-lab"); data.set("caseId", "retained-root"); data.set("missionId", "test-mission");
  data.set("maxRounds", "2"); data.set("maxObservedTokens", "60000");
  data.set("researchCommitment", JSON.stringify(commitmentChoice())); data.set("confirmResearchCommitment", "on");
  return data;
};

describe("controlled-cycle action graceful failure", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it("handles an immutable idempotency conflict without changing the key or retrying", async () => {
    vi.mocked(requestMathResearchCycle).mockRejectedValueOnce(new CommandRuntimeError("IDEMPOTENCY_CONFLICT", "retained identity conflict"));
    await expect(requestMathResearchCycleAction(form())).rejects.toThrow("NEXT_REDIRECT:/w/trusted-lab/research/math-pilot?request=cycle-conflict&missionId=test-mission");
    expect(requestMathResearchCycle).toHaveBeenCalledTimes(1);
    expect(requestMathResearchCycle).toHaveBeenCalledWith(expect.anything(), {
      caseId: "retained-root", maxRounds: 2, maxObservedTokens: 60000, commitment: { choice: commitmentChoice(), confirmed: true } });
    expect(revalidatePath).toHaveBeenCalledWith("/w/trusted-lab/research/math-pilot");
  });
  it("does not silently treat a stable FAILED command outcome as a queued cycle", async () => {
    vi.mocked(requestMathResearchCycle).mockResolvedValueOnce({ status: "FAILED", commandId: "retained-command",
      errorCode: "COMMAND_FAILED", errorMessage: "Command effect failed", outboxEventIds: [] });
    await expect(requestMathResearchCycleAction(form())).rejects.toThrow("request=cycle-failed&missionId=test-mission");
    expect(requestMathResearchCycle).toHaveBeenCalledTimes(1);
  });
  it("handles expected research-domain rejection without swallowing redirect control flow", async () => {
    vi.mocked(requestMathResearchCycle).mockRejectedValueOnce(new ResearchSandboxError("INVALID_TRANSITION", "prior cycle blocks request"));
    await expect(requestMathResearchCycleAction(form())).rejects.toThrow("NEXT_REDIRECT:");
    expect(redirect).toHaveBeenCalledTimes(1);
  });
  it("does not swallow unknown runtime failures", async () => {
    const error = new Error("unexpected diagnostic failure");
    vi.mocked(requestMathResearchCycle).mockRejectedValueOnce(error);
    await expect(requestMathResearchCycleAction(form())).rejects.toBe(error);
    expect(redirect).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
  it("does not convert workspace authorization errors into launch feedback", async () => {
    const error = new Error("authentication boundary");
    vi.mocked(resolveWorkspaceContext).mockRejectedValueOnce(error);
    await expect(requestMathResearchCycleAction(form())).rejects.toBe(error);
    expect(requestMathResearchCycle).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
  it("revalidates normally on success", async () => {
    vi.mocked(requestMathResearchCycle).mockResolvedValueOnce({ status: "SUCCEEDED", commandId: "new-command",
      outcome: { cycleId: "new-cycle", status: "QUEUED" }, outboxEventIds: ["outbox"] });
    await requestMathResearchCycleAction(form());
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(redirect).not.toHaveBeenCalled();
  });
  it.each(["missing", "unconfirmed", "oversized", "malformed"])("refuses %s commitment before calling the request kernel", async fault => {
    const data = form();
    if (fault === "missing") data.delete("researchCommitment");
    if (fault === "unconfirmed") data.delete("confirmResearchCommitment");
    if (fault === "oversized") data.set("researchCommitment", "x".repeat(131073));
    if (fault === "malformed") data.set("researchCommitment", "{");
    await expect(requestMathResearchCycleAction(data)).rejects.toThrow("request=cycle-failed");
    expect(requestMathResearchCycle).not.toHaveBeenCalled();
  });
});
