import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// This synthetic page seam covers the selected LRC family. Unrelated async RSC
// regions have their own awaited-region suites and cannot use legacy sync SSR.
vi.mock("@/components/research/research-campaign-region", () => ({ ResearchCampaignRegion: () => null }));
vi.mock("@/components/research/poly19-showcase-region", () => ({ Poly19ShowcaseRegion: () => null }));
import { beforeEach, describe, expect, it, vi } from "vitest";
import MathPilotPage from "@/app/w/[workspaceSlug]/research/math-pilot/page";
import { MATH_LRC_CAMPAIGN_CONTRACT } from "@/modules/research-sandbox/math-pilot";

const reads = vi.hoisted(() => ({ load: vi.fn(), targets: vi.fn(), cases: vi.fn(), summaries: vi.fn(),
  cycles: vi.fn(() => { throw new Error("No new-family cycle read"); }), active: vi.fn(), calibration: vi.fn(),
  poll: vi.fn(() => { throw new Error("No new-family polling"); }), write: vi.fn(() => { throw new Error("No UI dispatch"); }),
  locale: "en", allow: true, queue: true }));
vi.mock("next/link", () => ({ default: ({ href, children, className }: { href: string; children: ReactNode; className: string }) => createElement("a", { href, className }, children) }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); } }));
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/server/operations/math-lrc-loop-readiness", () => ({ loadLrcLoopReadiness: async () => null }));
vi.mock("@/app/actions/research-sandbox", () => ({ assessMathPilotCaseAction: reads.write, requestMathResearchCycleAction: reads.write,
  requestMathPilotAgentReviewAction: reads.write, requestMathExactNumericVerificationAction: reads.write,
  requestMathPilotFormalAttemptAction: reads.write, requestMathPilotFormalReplayAction: reads.write,
  attestMathPilotFormalAlignmentAction: reads.write, reviewMathPilotResearchAction: reads.write, requestMathPilotCaseAction: reads.write }));
vi.mock("@/modules/research-sandbox/kernel", () => ({ listMathPilotCases: reads.cases, listMathPilotCaseSummaries: reads.summaries,
  listMathPilotCalibrationActivity: reads.active, listResearchTargets: reads.targets }));
vi.mock("@/modules/research-sandbox/math-cycle-kernel", () => ({ listMathResearchCycles: reads.cycles, listMathResearchCyclePage: reads.cycles }));
vi.mock("@/modules/research-sandbox/math-dossier-loader", () => ({ loadMathCalibrationReadiness: reads.calibration }));
vi.mock("@/server/auth/workspace-page", () => ({ loadWorkspacePage: reads.load }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ NODE_ENV: "test", DEPLOYMENT_ENV: "test", RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: reads.queue }) }));
vi.mock("@/modules/identity-workspace", () => ({ hasCapability: () => reads.allow }));
vi.mock("@/i18n/server", () => ({ getTranslator: async () => ({ locale: reads.locale }) }));
vi.mock("@/components/shell/workspace-shell", () => ({ WorkspaceShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/research/research-live-refresh", () => ({ ResearchLiveRefresh: reads.poll }));

const missionId = "00000000-0000-4000-8000-000000000001";
const caseId = "00000000-0000-4000-8000-000000000002";
const runId = "00000000-0000-4000-8000-000000000003";
function row(contract: unknown = { version: 3 }, attempt: unknown = null, ledger: unknown = null) {
  return { id: caseId, caseType: "OPEN", contract, contractDigest: "0".repeat(64), createdAt: new Date("2026-10-04T00:00:00Z"),
    researchIntegrityDigest: "0".repeat(64), assessment: null, agentReview: ledger ? { ledger } : null, approvedIntegrityValid: false,
    agentReviewJobStatus: "SUCCEEDED", formalAttempts: [],
    researchRun: { id: runId, question: "Conditional bridge, not global proof", status: "AWAITING_REVIEW",
      requestedByMembershipId: "someone-else", providerName: "codex-local", modelName: "gpt-6-sol", providerUsage: null,
      mathModelAttempt: attempt, mathModelAttemptDigest: null, sources: [], query: "Conditional bridge" } };
}
const render = async (extra: Record<string, string> = {}) => renderToStaticMarkup(await MathPilotPage({
  params: Promise.resolve({ workspaceSlug: "another-lab" }), searchParams: Promise.resolve({ missionId, caseId, ...extra }),
}));
beforeEach(() => {
  vi.clearAllMocks(); reads.locale = "en"; reads.allow = true; reads.queue = true;
  reads.load.mockResolvedValue({ ctx: { membership: { id: "viewer", role: "OWNER" } } });
  reads.targets.mockResolvedValue({ missions: [{ id: missionId, referenceCode: "M1", title: "Research" }] });
  reads.summaries.mockResolvedValue({ items: [], total: 0, nextCursor: null });
  reads.cases.mockResolvedValue([row()]); reads.active.mockResolvedValue(new Set());
  reads.calibration.mockResolvedValue({ passed: new Set(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"]), complete: true });
});
describe("TIP064 selected new-family passive page guards", () => {
  it.each(["vi", "en"])("%s malformed v3 suppresses every legacy POST form, cycle and poll", async locale => {
    reads.locale = locale; const html = await render();
    expect(reads.load).toHaveBeenCalledWith("another-lab");
    expect(html).toContain(locale === "vi" ? "Các biểu mẫu giao bài" : "Ordinary intake");
    expect(html).not.toMatch(/<form[^>]+method="POST"|name="caseType"|name="idempotencyKey"|<textarea/);
    expect(html).not.toContain('id="math-calibration-title"'); expect(html).not.toContain('id="math-open-title"');
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it.each([
    { contract: { lrcProofUnitScope: null } }, { attempt: { lrcProofUnitEvidence: null } }, { attempt: { lrcProofUnitFeedback: null } },
    { ledger: { version: 6 } }, { ledger: { reports: [{ lrcProofUnitInput: null }] } },
  ])("damaged family marker $contract $attempt $ledger cannot fall back to legacy actions", async marker => {
    reads.cases.mockResolvedValue([row("contract" in marker ? marker.contract : {}, "attempt" in marker ? marker.attempt : null,
      "ledger" in marker ? marker.ledger : null)]);
    const html = await render(); expect(html).not.toMatch(/name="caseType"|name="idempotencyKey"|<textarea/);
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it("new-family observation does not display generic retry or fresh-portfolio hints", async () => {
    const html = await render({ request: "cycle-failed" }); expect(html).not.toContain("For a fresh portfolio"); expect(reads.write).not.toHaveBeenCalled();
  });
  it("historical v2 selected page keeps ordinary intake sections, still no selected cycle or poll", async () => {
    reads.cases.mockResolvedValue([row(MATH_LRC_CAMPAIGN_CONTRACT)]); const html = await render();
    expect(html).toContain('id="math-calibration-title"'); expect(html).toContain('id="math-open-title"'); expect(html).toContain('name="idempotencyKey"');
    expect(html).not.toContain("Ordinary intake, verification and cycle forms do not apply here");
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it("new-family question prose stays literal without date/ASCII math conversion", async () => {
    const selected = row(); selected.researchRun.question = "Original date2026-10-04 b^-1*t <script>not instruction</script>";
    reads.cases.mockResolvedValue([selected]); const html = await render();
    expect(html).toContain("Original date2026-10-04 b^-1*t &lt;script&gt;not instruction&lt;/script&gt;");
    expect(html).not.toContain('encoding="application/x-tex"');
  });
  it("auth failure or absent read capability stops before selected case retrieval", async () => {
    reads.load.mockRejectedValueOnce(new Error("Unauthorized")); await expect(render()).rejects.toThrow("Unauthorized");
    expect(reads.cases).not.toHaveBeenCalled();
    reads.allow = false; await expect(render()).rejects.toThrow("404"); expect(reads.cases).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
});
