import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// This synthetic page seam covers the selected LRC family. Unrelated async RSC
// regions have their own awaited-region suites and cannot use legacy sync SSR.
vi.mock("@/components/research/research-campaign-region", () => ({ ResearchCampaignRegion: () => null }));
vi.mock("@/components/research/poly19-showcase-region", () => ({ Poly19ShowcaseRegion: () => null }));
import { beforeEach, describe, expect, it, vi } from "vitest";

import MathPilotPage from "@/app/w/[workspaceSlug]/research/math-pilot/page";
import { MATH_LRC_CAMPAIGN_CONTRACT, MATH_LRC_PROOF_UNIT_CONTRACT } from "@/modules/research-sandbox/math-pilot";
import { readinessUiCaseId as caseId, readinessUiFixture } from "./math-lrc-loop-readiness-ui-fixture";

const reads = vi.hoisted(() => ({ load: vi.fn(), targets: vi.fn(), cases: vi.fn(), summaries: vi.fn(), readiness: vi.fn(), headers: vi.fn(),
  cycles: vi.fn(() => { throw new Error("NO_NEW_FAMILY_CYCLES"); }), active: vi.fn(), calibration: vi.fn(),
  poll: vi.fn<(props: { active: boolean }) => null>(() => null), write: vi.fn(() => { throw new Error("NO_GET_WRITE"); }),
  locale: "en", allowed: true }));
vi.mock("next/link", () => ({ default: ({ href, children, className }: { href: string; children: ReactNode; className: string }) => createElement("a", { href, className }, children) }));
vi.mock("next/headers", () => ({ headers: reads.headers }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); } }));
vi.mock("@/server/operations/math-lrc-loop-readiness", () => ({ loadLrcLoopReadiness: reads.readiness }));
vi.mock("@/app/actions/research-sandbox", () => ({ assessMathPilotCaseAction: reads.write, requestMathResearchCycleAction: reads.write,
  requestMathPilotAgentReviewAction: reads.write, requestMathExactNumericVerificationAction: reads.write,
  requestMathPilotFormalAttemptAction: reads.write, requestMathPilotFormalReplayAction: reads.write,
  attestMathPilotFormalAlignmentAction: reads.write, reviewMathPilotResearchAction: reads.write, requestMathPilotCaseAction: reads.write }));
vi.mock("@/modules/research-sandbox/kernel", () => ({ listMathPilotCases: reads.cases, listMathPilotCaseSummaries: reads.summaries,
  listMathPilotCalibrationActivity: reads.active, listResearchTargets: reads.targets }));
vi.mock("@/modules/research-sandbox/math-cycle-kernel", () => ({ listMathResearchCycles: reads.cycles, listMathResearchCyclePage: reads.cycles }));
vi.mock("@/modules/research-sandbox/math-dossier-loader", () => ({ loadMathCalibrationReadiness: reads.calibration }));
vi.mock("@/server/auth/workspace-page", () => ({ loadWorkspacePage: reads.load }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ NODE_ENV: "test", DEPLOYMENT_ENV: "test", RESEARCH_CODEX_LOCAL_ENABLED: false, MATH_PILOT_QUEUE_ENABLED: false }) }));
vi.mock("@/modules/identity-workspace", () => ({ hasCapability: () => reads.allowed }));
vi.mock("@/i18n/server", () => ({ getTranslator: async () => ({ locale: reads.locale }) }));
vi.mock("@/components/shell/workspace-shell", () => ({ WorkspaceShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/research/research-live-refresh", () => ({ ResearchLiveRefresh: reads.poll }));

const missionId = "00000000-0000-4000-8000-000000000001";
function row(contract: unknown = { version: 4 }, attempt: unknown = null, ledger: unknown = null) {
  return { id: caseId, caseType: "OPEN", contract, contractDigest: "0".repeat(64), createdAt: new Date("2026-10-04T00:00:00Z"),
    researchIntegrityDigest: "0".repeat(64), assessment: null, agentReview: ledger ? { ledger } : null, approvedIntegrityValid: false,
    agentReviewJobStatus: "SUCCEEDED", formalAttempts: [],
    researchRun: { id: "00000000-0000-4000-8000-000000000003", question: "Synthetic selected family", status: "AWAITING_REVIEW",
      requestedByMembershipId: "different", providerName: "codex-local", modelName: "gpt-6-sol", providerUsage: null,
      mathModelAttempt: attempt, mathModelAttemptDigest: null, sources: [], query: "Synthetic" } };
}
const render = async (query: { missionId?: string | string[]; caseId?: string | string[] } = { missionId, caseId }) => renderToStaticMarkup(await MathPilotPage({
  params: Promise.resolve({ workspaceSlug: "synthetic-lab" }), searchParams: Promise.resolve(query),
}));
beforeEach(() => {
  vi.clearAllMocks(); reads.allowed = true; reads.locale = "en";
  reads.load.mockResolvedValue({ ctx: { membership: { id: "viewer", role: "OWNER" } } });
  reads.targets.mockResolvedValue({ missions: [{ id: missionId, referenceCode: "M1", title: "Research" }] });
  reads.summaries.mockResolvedValue({ items: [], total: 0, nextCursor: null }); reads.cases.mockResolvedValue([row()]);
  reads.active.mockResolvedValue(new Set()); reads.calibration.mockResolvedValue({ passed: new Set(), complete: true });
  reads.headers.mockResolvedValue(new Headers({ "x-synthetic-header": "request" }));
  reads.readiness.mockResolvedValue(readinessUiFixture());
});

describe("TIP070 additive selected-family page seam (synthetic dependencies)", () => {
  it.each(["vi", "en"])("%s passes only current request headers and selected mission/case to independent DAL", async locale => {
    reads.locale = locale; const html = await render();
    expect(reads.readiness).toHaveBeenCalledExactlyOnceWith({ headers: expect.any(Headers), workspaceSlug: "synthetic-lab", missionId, caseIds: [caseId] });
    expect(reads.headers).toHaveBeenCalledTimes(1);
    const request = reads.readiness.mock.calls[0][0]; expect(Object.keys(request).sort()).toEqual(["caseIds", "headers", "missionId", "workspaceSlug"]);
    expect(request.headers.get("x-synthetic-header")).toBe("request");
    expect(html).toContain('id="math-lrc-loop-readiness"'); expect(html).toContain("PLANNING_ONLY / G2_NOT_AUTHORIZED");
    expect(html).not.toMatch(/name="caseType"|name="idempotencyKey"|<textarea/);
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it.each([{ version: 3 }, { version: "4" }, { lrcMethodUnitScope: null }, { lrcProofUnitScope: null }])("malformed family $version retains passive readiness and no action fallback", async contract => {
    reads.cases.mockResolvedValue([row(contract)]); const html = await render();
    expect(reads.readiness).toHaveBeenCalledTimes(1); expect(html).toContain('id="math-lrc-loop-readiness"');
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it("legacy064 displays refusal before untouched UNKNOWN historical output", async () => {
    const historical = row(MATH_LRC_PROOF_UNIT_CONTRACT); historical.id = "b396580a-7bc7-4a8d-a966-0ad3eaa3e246";
    historical.researchRun.status = "FAILED"; historical.agentReviewJobStatus = "DEAD_LETTER";
    reads.cases.mockResolvedValue([historical]);
    reads.readiness.mockResolvedValue(readinessUiFixture({ cases: [{ caseId: historical.id, status: "LEGACY_NOT_ADMISSIBLE", reason: "LEGACY_NOT_ADMISSIBLE", retainedJobs: "NOT_ADMITTED" }] }));
    const html = await render({ missionId, caseId: historical.id });
    expect(reads.readiness.mock.calls[0][0].caseIds).toEqual([historical.id]);
    expect(html.indexOf('id="math-lrc-loop-readiness"')).toBeLessThan(html.indexOf("Unchanged 064 record"));
    expect(html).toContain("precise cause remains UNKNOWN"); expect(html).toContain("LEGACY_NOT_ADMISSIBLE");
    expect(html).toContain("Do not retry the 064 record"); expect(reads.write).not.toHaveBeenCalled();
  });
  it("existing campaignv2 is outside the selected proof/method readiness seam", async () => {
    reads.cases.mockResolvedValue([row(MATH_LRC_CAMPAIGN_CONTRACT)]); const html = await render();
    expect(reads.readiness).not.toHaveBeenCalled(); expect(reads.headers).not.toHaveBeenCalled();
    expect(html).not.toContain('id="math-lrc-loop-readiness"'); expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled();
  });
  it("unavailable selected case discloses no readiness or synthesized method record", async () => {
    reads.cases.mockResolvedValue([]); const html = await render();
    expect(reads.readiness).not.toHaveBeenCalled(); expect(reads.headers).not.toHaveBeenCalled();
    expect(html).not.toContain('id="math-lrc-loop-readiness"'); expect(html).not.toContain("admitted method-unit records");
    expect(reads.poll.mock.calls[0][0].active).toBe(false);
  });
  it.each([{ missionId: [missionId, missionId], caseId }, { missionId, caseId: [caseId, caseId] }])("invalid repeated selector $missionId $caseId cannot reach readiness", async query => {
    await render(query); expect(reads.readiness).not.toHaveBeenCalled(); expect(reads.headers).not.toHaveBeenCalled(); expect(reads.cases).not.toHaveBeenCalled();
    expect(reads.poll.mock.calls[0][0].active).toBe(false);
  });
  it("page membership failure stops before readiness while independent DAL remains authoritative", async () => {
    reads.allowed = false; await expect(render()).rejects.toThrow("404");
    expect(reads.readiness).not.toHaveBeenCalled(); expect(reads.headers).not.toHaveBeenCalled();
  });
  it("DAL refusal is rendered without page context or prior success overriding it", async () => {
    reads.readiness.mockResolvedValue(readinessUiFixture({ status: "UNAVAILABLE", session: "UNAVAILABLE", sources: "NOT_VERIFIED", cases: [], admittedCount: 0, tasks: [], blockers: ["ACCESS_UNAVAILABLE", "G2_NOT_AUTHORIZED"] }));
    const html = await render(); expect(html).toContain("UNAVAILABLE / UNAVAILABLE");
    expect(html).toContain("0 admitted method-unit records"); expect(reads.readiness).toHaveBeenCalledTimes(1);
    expect(reads.write).not.toHaveBeenCalled();
  });
});
