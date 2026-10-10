import { readFileSync } from "node:fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MathLrcProofUnitPanel } from "@/components/research/math-lrc-proof-unit-panel";
import { MathLrcCampaignPanel } from "@/components/research/math-lrc-campaign-panel";
import MathToolsPage from "@/app/w/[workspaceSlug]/research/math-tools/page";
import { LRC_PROOF_UNIT_PACKET, digestLrcProofUnitPacket } from "@/modules/research-sandbox/math-lrc-proof-unit";
import { MATH_LRC_CAMPAIGN_CONTRACT, digestMathPilotContract } from "@/modules/research-sandbox/math-pilot";

const route = vi.hoisted(() => {
  const forbidden = () => vi.fn(() => { throw new Error("Forbidden proof-unit GET work"); });
  return { locale: "en", allowed: true, environment: "test", deployment: "test", load: vi.fn(),
    notFound: vi.fn(() => { throw new Error("404"); }),
    parse: forbidden(), search: forbidden(), replay: forbidden(), mixed: forbidden(), mixedReplay: forbidden(),
    oldProof: forbidden(), imported: forbidden(), cover: forbidden(), frontier: forbidden(), unit: forbidden(),
    checker: forbidden(), prompt: forbidden() };
});
vi.mock("@/modules/research-sandbox/math-lrc-proof-unit", async original => ({
  ...await original<typeof import("@/modules/research-sandbox/math-lrc-proof-unit")>(),
  runLrcProofUnitScalarChecks: route.checker, lrcProofUnitPrompt: route.prompt,
}));
vi.mock("next/navigation", () => ({ notFound: route.notFound }));
vi.mock("next/link", () => ({ default: ({ href, children, className }: { href: string; children: ReactNode; className: string }) => createElement("a", { href, className }, children) }));
vi.mock("@/server/auth/workspace-page", () => ({ loadWorkspacePage: route.load }));
vi.mock("@/modules/identity-workspace", () => ({ hasCapability: () => route.allowed }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ NODE_ENV: route.environment, DEPLOYMENT_ENV: route.deployment }) }));
vi.mock("@/i18n/server", () => ({ getTranslator: async () => ({ locale: route.locale }) }));
vi.mock("@/components/shell/workspace-shell", () => ({ WorkspaceShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/modules/research-sandbox/math-divisor-led", () => ({ searchDivisorLed: route.search }));
vi.mock("@/modules/research-sandbox/math-divisor-replay", () => ({ parseDivisorLabQuery: route.parse, replayDivisorLab: route.replay }));
vi.mock("@/modules/research-sandbox/math-mixed-core", () => ({ mixedCoreResearchPacket: route.mixed }));
vi.mock("@/modules/research-sandbox/math-mixed-core-replay", () => ({ replayMixedCorePacket: route.mixedReplay }));
vi.mock("@/components/research/math-lrc-proof-panel", () => ({ MathLrcProofPanel: route.oldProof }));
vi.mock("@/components/research/math-lrc-allikvere-panel", () => ({ MathAllikvereReportPanel: route.imported }));
vi.mock("@/components/research/math-lrc-cover-panel", () => ({ MathLrcCoverPanel: route.cover }));
vi.mock("@/components/research/math-lrc-frontier-panel", () => ({ MathLrcFrontierPanel: route.frontier }));
vi.mock("@/components/research/math-lrc-unit-panel", () => ({ MathLrcUnitPanel: route.unit }));

const render = (locale = "en", raw: unknown = LRC_PROOF_UNIT_PACKET) => renderToStaticMarkup(createElement(MathLrcProofUnitPanel, { raw, locale }));
const passiveGet = (view: string | string[], extra: Record<string, string> = {}) => MathToolsPage({
  params: Promise.resolve({ workspaceSlug: "another-lab" }), searchParams: Promise.resolve({ view, ...extra }),
});
const noWork = () => {
  for (const call of [route.parse, route.search, route.replay, route.mixed, route.mixedReplay, route.oldProof,
    route.imported, route.cover, route.frontier, route.unit, route.checker, route.prompt]) expect(call).not.toHaveBeenCalled();
};
beforeEach(() => {
  vi.clearAllMocks(); route.locale = "en"; route.allowed = true; route.environment = "test"; route.deployment = "test";
  route.load.mockResolvedValue({ ctx: { membership: { role: "OWNER" } } });
});

describe("TIP-063 passive fixed proof unit", () => {
  it.each(["vi", "en"])("R6 %s exposes canonical definitions/proof, not a fabricated audit", locale => {
    const html = render(locale);
    expect(html).toContain("NOT_USED_IN_HISTORICAL_062_CASE"); expect(html).toContain("NOT_RUN_ON_GET"); expect(html).toContain("UNEXECUTED");
    expect(html).toContain(locale === "vi" ? "nguyên văn packet tiếng Anh" : "original digest-bound English packet");
    expect(html).toContain("RETAINED_UNSIGNED_NOT_FRESH"); expect(html).toContain("SOURCE_CONDITIONAL");
    for (const key of Object.keys(LRC_PROOF_UNIT_PACKET.definitions)) expect(html).toContain(key);
    for (const premise of LRC_PROOF_UNIT_PACKET.premises) expect(html).toContain(premise.id);
    for (const step of LRC_PROOF_UNIT_PACKET.steps) expect(html).toContain(step.id);
    for (const ref of LRC_PROOF_UNIT_PACKET.references) expect(html).toContain(ref.sha256);
    expect(html).toContain(LRC_PROOF_UNIT_PACKET.packetDigest);
    expect(html).toContain("23"); expect(html).toContain("60"); expect(html).toContain("OPEN");
    expect(html).not.toMatch(/<form|<button|<input|<script|progressbar/); noWork();
  });
  it("renders properness, complement, J quantifiers and proof transport as genuine safe TeX", () => {
    const html = render();
    for (const tex of [String.raw`P_\ell(v)\iff`, String.raw`\gcd(\ell,(v_i)_{i\ne j})`, String.raw`\forall\ell\ge1`,
      String.raw`I(13,83,\ell)`, String.raw`m\mid L`, String.raw`b^{-1}t`, String.raw`\operatorname{lcm}(14,32)=224`,
      String.raw`32\mid224,\quad14\mid224`]) expect(html).toContain(tex);
    expect(html).toContain('encoding="application/x-tex"'); expect(html).toContain("∅");
    expect((html.match(/class="katex"/g) ?? []).length).toBe(20);
    expect(html).toContain(String.raw`encoding="application/x-tex">32\mid224`);
    expect(html).not.toMatch(/katex-error|Invalid or unsupported TeX|[\u000b\u000c]/);
  });
  it("preserves every canonical prose field literally instead of heuristic math/date conversion", () => {
    const html = render();
    const canonical = [LRC_PROOF_UNIT_PACKET.scope.statement, ...Object.values(LRC_PROOF_UNIT_PACKET.definitions),
      ...LRC_PROOF_UNIT_PACKET.premises.map(p => p.statement), ...LRC_PROOF_UNIT_PACKET.steps.flatMap(s => [s.statement, s.proof]),
      ...LRC_PROOF_UNIT_PACKET.references.map(r => r.note), ...LRC_PROOF_UNIT_PACKET.debts, LRC_PROOF_UNIT_PACKET.limitations.statement];
    for (const text of canonical) {
      const escaped = renderToStaticMarkup(createElement("span", null, text)).slice(6, -7);
      expect(html).toContain(escaped);
    }
    expect(html).not.toMatch(/encoding="application\/x-tex">(?:2026-10-04|1\*t|s2026)/);
  });
  it("preserves strict equality GOOD, repetitions and finite-vs-global premise separation", () => {
    const text = render().replace(/<[^>]*>/g, "");
    expect(text).toContain("coordinate repetitions are allowed"); expect(text).toContain("Neither primitive");
    expect(text).toContain("LRC(12) is NOT needed"); expect(text).toContain("It IS a separate source-conditional hypothesis");
    expect(text).toContain("every labelled vector"); expect(text).toContain("EVERY one of its7^13 labelled lifts");
    expect(text).toContain("equality"); expect(text).toContain("GOOD"); expect(text).toContain("SAME grid time");
    expect(text).toContain("224 bridge is a local derivation"); expect(text).toContain("archived111-prime");
  });
  it.each([null, {}, { version: 1 }, { ...LRC_PROOF_UNIT_PACKET, packetDigest: "0".repeat(64) }])("fails closed for absent/invalid packet %j", raw => {
    const html = render("en", raw);
    expect(html).toContain('role="alert"'); expect(html).toContain("unavailable or invalid");
    expect(html).not.toContain("GRID_TRANSPORT"); expect(html).not.toContain('encoding="application/x-tex"'); noWork();
  });
  it("a caller-rehashed false global statement cannot become accepted UI", () => {
    const raw = structuredClone(LRC_PROOF_UNIT_PACKET); raw.scope.statement = "GLOBAL LRC PROVED for15 runners";
    const body = { ...raw }; Reflect.deleteProperty(body, "packetDigest"); raw.packetDigest = digestLrcProofUnitPacket(body);
    const html = render("en", raw); expect(html).toContain('role="alert"'); expect(html).not.toContain("GLOBAL LRC PROVED"); noWork();
  });
  it.each([320, 390, 768, 1366])("%spx SSR retains semantic disclosures and wrapping (not geometric proof)", width => {
    const html = renderToStaticMarkup(createElement("div", { style: { width } }, createElement(MathLrcProofUnitPanel, { raw: LRC_PROOF_UNIT_PACKET, locale: "vi" })));
    expect(html).toContain(`width:${width}px`);
    for (const token of ["min-w-0", "break-all", "break-words", "flex-wrap", "max-w-[76ch]", "focus-visible:outline"]) expect(html).toContain(token);
    expect((html.match(/<details/g) ?? []).length).toBe(5); expect(html).toContain('aria-labelledby="lrc-proof-unit-title"');
    noWork();
  });
  it.each(["vi", "en"])("R6 %s retained-only route ignores ES parameters and performs no tool/checker work", async locale => {
    route.locale = locale;
    const html = renderToStaticMarkup(await passiveGet("allikvere-proof-unit", { n: "159727681", maxS: "791", mode: "ALL" }));
    expect(route.load).toHaveBeenCalledWith("another-lab"); expect(html).toContain('id="allikvere-proof-unit"');
    expect(html).toContain("NOT_USED_IN_HISTORICAL_062_CASE"); expect(html).not.toContain("<form"); noWork();
  });
  it.each([{ view: ["allikvere-proof-unit", "allikvere-proof-unit"] }, { view: ["allikvere-proof-unit", "allikvere-proof"] }, { view: "unknown" }])("malformed view $view performs no work", async ({ view }) => {
    const html = renderToStaticMarkup(await passiveGet(view)); expect(html).toContain('role="alert"');
    expect(html).not.toContain('id="allikvere-proof-unit"'); noWork();
  });
  it("authentication failure stops before panel rendering or arithmetic", async () => {
    route.load.mockRejectedValue(new Error("Unauthorized")); await expect(passiveGet("allikvere-proof-unit")).rejects.toThrow("Unauthorized"); noWork();
  });
  it.each(["capability", "production", "deployment"])("%s guard refuses proof-unit view before work", async mode => {
    if (mode === "capability") route.allowed = false;
    if (mode === "production") route.environment = "production";
    if (mode === "deployment") route.deployment = "production";
    await expect(passiveGet("allikvere-proof-unit")).rejects.toThrow("404"); noWork();
  });
  it("passive campaign link uses its supplied workspace base, never a fixed tenant", () => {
    const record = { contract: MATH_LRC_CAMPAIGN_CONTRACT, contractDigest: digestMathPilotContract(MATH_LRC_CAMPAIGN_CONTRACT),
      attempt: null, attemptDigest: null, researchDigest: "0".repeat(64), review: null };
    const html = renderToStaticMarkup(createElement(MathLrcCampaignPanel, { record, locale: "en", toolsBase: "/w/another-lab/research/math-tools" }));
    expect(html).toContain('href="/w/another-lab/research/math-tools?view=allikvere-proof-unit#allikvere-proof-unit"');
    expect(html).not.toContain("mathematics-pilot-lab"); expect(html).toContain("not used in this historical case");
    for (const toolsBase of [undefined, "javascript:alert(1)", "https://remote.invalid", "/w/a/research/math-tools?view=other"]) {
      const refused = renderToStaticMarkup(createElement(MathLrcCampaignPanel, { record, locale: "en", toolsBase }));
      expect(refused).not.toContain("Read the new proof unit");
    }
    const page = readFileSync("src/app/w/[workspaceSlug]/research/math-pilot/page.tsx", "utf8");
    expect(page).toContain("toolsBase={`/w/${workspaceSlug}/research/math-tools`}");
  });
  it("new panel route seams import no filesystem/checker/prepare/worker/provider runner", () => {
    const source = readFileSync("src/components/research/math-lrc-proof-unit-panel.tsx", "utf8");
    expect(source).not.toMatch(/use client|node:fs|runLrcProofUnitScalarChecks|proof-unit-audit|campaign-reference|worker|fetch\(|useEffect|setInterval|dangerouslySetInnerHTML/);
    const page = readFileSync("src/app/w/[workspaceSlug]/research/math-tools/page.tsx", "utf8");
    expect(page).toContain("strategyView || proofUnitView || invalidView");
    expect(page.indexOf("loadWorkspacePage(workspaceSlug)")).toBeLessThan(page.indexOf("const proofUnitView"));
    expect(page).not.toContain("runLrcProofUnitScalarChecks"); expect(page).not.toContain("proof-unit-audit"); noWork();
  });
});
