import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
// This synthetic page seam covers the selected LRC family. Unrelated async RSC
// regions have their own awaited-region suites and cannot use legacy sync SSR.
vi.mock("@/components/research/research-campaign-region", () => ({ ResearchCampaignRegion: () => null }));
vi.mock("@/components/research/poly19-showcase-region", () => ({ Poly19ShowcaseRegion: () => null }));
import { beforeEach, describe, expect, it, vi } from "vitest";
import MathPilotPage from "@/app/w/[workspaceSlug]/research/math-pilot/page";
import { MATH_LRC_PROOF_UNIT_CONTRACT } from "@/modules/research-sandbox/math-pilot";

const reads = vi.hoisted(() => ({ load: vi.fn(), targets: vi.fn(), cases: vi.fn(), summaries: vi.fn(),
  cycles: vi.fn(() => { throw new Error("NO_NEW_FAMILY_CYCLES"); }), active: vi.fn(), calibration: vi.fn(),
  poll: vi.fn(() => { throw new Error("NO_NEW_FAMILY_POLL"); }), write: vi.fn(() => { throw new Error("NO_GET_WRITE"); }), locale: "en", allowed: true }));
const tools = vi.hoisted(() => ({ producer: vi.fn(() => { throw new Error("NO_GET_PRODUCER"); }), checker: vi.fn(() => { throw new Error("NO_GET_CHECKER"); }),
  prepare: vi.fn(() => { throw new Error("NO_GET_PREPARATION"); }) }));
vi.mock("@/modules/research-sandbox/math-lrc-method-unit", async importOriginal => ({
  ...await importOriginal<typeof import("@/modules/research-sandbox/math-lrc-method-unit")>(),
  buildLrcShiftPhaseCertificate: tools.producer, verifyLrcShiftFiniteCertificate: tools.checker, buildLrcMethodUnitFiniteEvidence: tools.producer,
}));
vi.mock("@/modules/research-sandbox/math-lrc-method-unit-live", async importOriginal => ({
  ...await importOriginal<typeof import("@/modules/research-sandbox/math-lrc-method-unit-live")>(),
  prepareLrcMethodUnitSolverInput: tools.prepare, prepareLrcMethodUnitReviewInput: tools.prepare,
}));
vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: ReactNode }) => createElement("a", { href }, children) }));
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
vi.mock("@/server/env", () => ({ getEnv: () => ({ NODE_ENV: "test", DEPLOYMENT_ENV: "test", RESEARCH_CODEX_LOCAL_ENABLED: true, MATH_PILOT_QUEUE_ENABLED: true }) }));
vi.mock("@/modules/identity-workspace", () => ({ hasCapability: () => reads.allowed }));
vi.mock("@/i18n/server", () => ({ getTranslator: async () => ({ locale: reads.locale }) }));
vi.mock("@/components/shell/workspace-shell", () => ({ WorkspaceShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/research/research-live-refresh", () => ({ ResearchLiveRefresh: reads.poll }));
const missionId = "00000000-0000-4000-8000-000000000001", caseId = "00000000-0000-4000-8000-000000000002";
function row(contract: unknown = { version: 4 }, attempt: unknown = null, ledger: unknown = null) {
  return { id: caseId, caseType: "OPEN", contract, contractDigest: "0".repeat(64), createdAt: new Date("2026-10-04T00:00:00Z"),
    researchIntegrityDigest: "0".repeat(64), assessment: null, agentReview: ledger ? { ledger } : null, approvedIntegrityValid: false,
    agentReviewJobStatus: "SUCCEEDED", formalAttempts: [],
    researchRun: { id: "00000000-0000-4000-8000-000000000003", question: "Malformed method-unit", status: "AWAITING_REVIEW",
      requestedByMembershipId: "other", providerName: "codex-local", modelName: "gpt-6-sol", providerUsage: null,
      mathModelAttempt: attempt, mathModelAttemptDigest: null, sources: [], query: "Test" } };
}
const render = async () => renderToStaticMarkup(await MathPilotPage({ params: Promise.resolve({ workspaceSlug: "different-tenant" }),
  searchParams: Promise.resolve({ missionId, caseId, request: "cycle-failed" }) }));
beforeEach(() => {
  vi.clearAllMocks(); reads.allowed = true; reads.locale = "en";
  reads.load.mockResolvedValue({ ctx: { membership: { id: "viewer", role: "OWNER" } } });
  reads.targets.mockResolvedValue({ missions: [{ id: missionId, referenceCode: "M1", title: "Research" }] });
  reads.summaries.mockResolvedValue({ items: [], total: 0, nextCursor: null }); reads.cases.mockResolvedValue([row()]);
  reads.active.mockResolvedValue(new Set()); reads.calibration.mockResolvedValue({ passed: new Set(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"]), complete: true });
});
describe("v4/ledger7 selected route refuses legacy actions before admission", () => {
  it.each(["vi", "en"])("%s malformed v4 remains passive with cockpit instead of old workflow", async locale => {
    reads.locale = locale; const html = await render(); expect(html).toContain('id="math-lrc-research-cockpit"');
    expect(html).not.toMatch(/name="caseType"|name="idempotencyKey"|<textarea/);
    expect(html).not.toContain("For a fresh portfolio"); expect(html).not.toContain('id="math-calibration-title"');
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
    expect(tools.producer).not.toHaveBeenCalled(); expect(tools.checker).not.toHaveBeenCalled(); expect(tools.prepare).not.toHaveBeenCalled();
  });
  it.each(["lrcMethodUnitScope", "lrcMethodUnitEvidence", "lrcMethodUnitFeedback", "lrcMethodUnitInput", "lrcMethodUnitAuditSummary",
    "lrcMethodUnitFiniteSeed", "lrcMethodUnitFiniteEvidence", "methodInputBindingsValid", "finiteEvidenceValid"])("null %s on each surface never regains forms", async key => {
    for (const value of [row({ [key]: null }), row({}, { [key]: null }), row({}, null, { [key]: null }), row({}, null, { reports: [{ [key]: null }] })]) {
      reads.cases.mockResolvedValue([value]); const html = await render(); expect(html).not.toMatch(/name="caseType"|name="idempotencyKey"|<textarea/);
      expect(html).toContain('id="math-lrc-research-cockpit"');
    }
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it.each(["methodInputBindingsValid", "finiteEvidenceValid"])("oracle-only null %s remains guarded", async key => {
    reads.cases.mockResolvedValue([row({}, null, { oracle: { [key]: null } })]);
    const html = await render(); expect(html).not.toMatch(/name="caseType"|name="idempotencyKey"|<textarea/);
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled();
  });
  it("ledger7 alone blocks workflow; exact actor/tenant read scope is retained", async () => {
    reads.cases.mockResolvedValue([row({}, null, { version: "7" })]); await render();
    expect(reads.load).toHaveBeenCalledWith("different-tenant");
    expect(reads.cases).toHaveBeenCalledWith(expect.anything(), missionId, { ids: [caseId] });
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled();
  });
  it("authorization failure stops before record reads or cockpit exposure", async () => {
    reads.allowed = false; await expect(render()).rejects.toThrow("404"); expect(reads.cases).not.toHaveBeenCalled();
    reads.allowed = true; reads.load.mockRejectedValueOnce(new Error("Unauthorized")); await expect(render()).rejects.toThrow("Unauthorized");
    expect(reads.cases).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
  it("exact historical064 shows unified goal and unchanged history disclosure, with UNKNOWN cause", async () => {
    const historical = row(MATH_LRC_PROOF_UNIT_CONTRACT); historical.id = "b396580a-7bc7-4a8d-a966-0ad3eaa3e246";
    historical.researchRun.status = "FAILED"; historical.agentReviewJobStatus = "DEAD_LETTER";
    reads.cases.mockResolvedValue([historical]);
    const html = await render(); expect(html).toContain("Unchanged 064 record · historical run");
    expect(html).toContain("precise cause remains UNKNOWN"); expect(html).toContain("usage is unavailable");
    expect(html).toContain('id="math-lrc-research-cockpit"'); expect(html).not.toMatch(/name="caseType"|name="idempotencyKey"|<textarea/);
    expect(reads.cycles).not.toHaveBeenCalled(); expect(reads.poll).not.toHaveBeenCalled(); expect(reads.write).not.toHaveBeenCalled();
  });
});
