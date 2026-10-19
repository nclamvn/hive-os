import { readFileSync } from "node:fs";
import { execFile, spawn } from "node:child_process";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import MathToolsPage from "@/app/w/[workspaceSlug]/research/math-tools/page";
import { ALLIKVERE_PROOF_RETAINED_PATH, buildAllikvereProofPlan, validateRetainedProofArithmetic } from "@/modules/research-sandbox/math-lrc-proof-plan";

const route = vi.hoisted(() => {
  const forbidden = () => vi.fn(() => { throw new Error("Forbidden proof-view dispatch"); });
  return { locale: "en", allowed: true, env: "test", load: vi.fn(), notFound: vi.fn(() => { throw new Error("404"); }),
    parse: forbidden(), search: forbidden(), replay: forbidden(), mixed: forbidden(), mixedReplay: forbidden(),
    imported: forbidden(), cover: forbidden(), frontier: forbidden(), unit: forbidden() };
});
vi.mock("node:child_process", async (original) => ({ ...await original<typeof import("node:child_process")>(), execFile: vi.fn(), spawn: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: route.notFound }));
vi.mock("next/link", () => ({ default: ({ href, children, className }: { href: string; children: ReactNode; className: string }) => createElement("a", { href, className }, children) }));
vi.mock("@/server/auth/workspace-page", () => ({ loadWorkspacePage: route.load }));
vi.mock("@/modules/identity-workspace", () => ({ hasCapability: () => route.allowed }));
vi.mock("@/server/env", () => ({ getEnv: () => ({ NODE_ENV: route.env, DEPLOYMENT_ENV: route.env }) }));
vi.mock("@/i18n/server", () => ({ getTranslator: async () => ({ locale: route.locale }) }));
vi.mock("@/components/shell/workspace-shell", () => ({ WorkspaceShell: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/modules/research-sandbox/math-divisor-led", () => ({ searchDivisorLed: route.search }));
vi.mock("@/modules/research-sandbox/math-divisor-replay", () => ({ parseDivisorLabQuery: route.parse, replayDivisorLab: route.replay }));
vi.mock("@/modules/research-sandbox/math-mixed-core", () => ({ mixedCoreResearchPacket: route.mixed }));
vi.mock("@/modules/research-sandbox/math-mixed-core-replay", () => ({ replayMixedCorePacket: route.mixedReplay }));
vi.mock("@/components/research/math-lrc-allikvere-panel", () => ({ MathAllikvereReportPanel: route.imported }));
vi.mock("@/components/research/math-lrc-cover-panel", () => ({ MathLrcCoverPanel: route.cover }));
vi.mock("@/components/research/math-lrc-frontier-panel", () => ({ MathLrcFrontierPanel: route.frontier }));
vi.mock("@/components/research/math-lrc-unit-panel", () => ({ MathLrcUnitPanel: route.unit }));

const raw: unknown = JSON.parse(readFileSync(ALLIKVERE_PROOF_RETAINED_PATH, "utf8"));
const base = "/w/mathematics-pilot-lab-156de0/research/math-tools";
const render = (locale: string, data = raw) => renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: data, base, locale }));
const forbiddenCalls = () => [route.parse, route.search, route.replay, route.mixed, route.mixedReplay, route.imported, route.cover, route.frontier, route.unit, execFile, spawn];
beforeEach(() => {
  vi.clearAllMocks(); route.locale = "en"; route.env = "test"; route.allowed = true;
  route.load.mockResolvedValue({ ctx: { membership: { role: "OWNER" } } });
});

describe("theorem-first proof dossier", () => {
  it.each(["vi", "en"])("separates preprint claims, local reproduction and novelty in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Bản tiền ấn phẩm tuyên bố 14 và 15" : "Preprint claims 14 and 15");
    expect(html).toContain(locale === "vi" ? "Không có tuyên bố tính mới" : "No novelty claim");
    expect(html).toContain(locale === "vi" ? "Số học có điều kiện đã tái lập" : "Conditional arithmetic reproduced");
    expect(html).toContain(locale === "vi" ? "định lý toàn cục vẫn chưa thiết lập" : "global theorem remains NOT ESTABLISHED");
    expect(html).toContain(locale === "vi" ? "Thêm số đếm cục bộ không phải thước đo" : "More local counts are not a proof-progress metric");
    expect(html).toContain(locale === "vi" ? "không phải agent đã chạy" : "not an executed agent campaign");
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
    expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    expect(html).not.toContain("progressbar"); expect(html).not.toContain("katex-error");
  });
  it("keeps separate open dependency ladders and versioned source anchors", () => {
    const plan = buildAllikvereProofPlan(), html = render("en"), viHtml = render("vi");
    expect(html).toContain("arXiv:2609.02604v2"); expect(html).toContain("2026-09-24");
    expect(html).toContain("14 runners"); expect(html).toContain("k = 13");
    expect(html).toContain("15 runners"); expect(html).toContain("k = 14");
    expect(html).toContain("depends on an established 14-runner result, not a local 14-runner control");
    for (const target of plan.targets) for (const dependency of target.dependencies) {
      expect(dependency.status).toBe("OPEN"); expect(html).toContain('href="' + dependency.sourceUrl + '"');
      expect(viHtml).not.toContain(dependency.id.replaceAll("_", " "));
    }
    expect((html.match(/>OPEN</g) ?? []).length).toBe(plan.targets.reduce((count, target) => count + target.dependencies.length, 0));
  });
  it.each([{ view: ["allikvere-proof", "allikvere-proof"] }, { view: ["allikvere-proof", "allikvere-unit"] }, { view: ["allikvere"] }, { view: [] }, { view: "unknown" }, { view: "" }])("rejects malformed selector %j without any legacy or ES dispatch", async ({ view }) => {
    const result = await MathToolsPage({ params: Promise.resolve({ workspaceSlug: "private" }), searchParams: Promise.resolve({ view }) });
    const html = renderToStaticMarkup(result);
    expect(html).toContain('role="alert"'); expect(html).toContain("Unknown or repeated view selector");
    expect(html).not.toContain('id="allikvere-proof"'); expect(html).not.toContain("<form");
    for (const forbidden of forbiddenCalls()) expect(forbidden).not.toHaveBeenCalled();
  });
  it("puts the selected properness bridge before conditional arithmetic and archives", () => {
    const html = render("en");
    expect(html).toContain("First audit the primitive-speed, GCD and few-exception shift bridge; then audit the shape");
    expect(html).toContain("old NO_GRID labels are not continuous-time LRC failures");
    expect(html.indexOf("Selected next obligation")).toBeLessThan(html.indexOf("Proof dependencies"));
    expect(html.indexOf("Proof dependencies")).toBeLessThan(html.indexOf("Conditional arithmetic, not a theorem proof"));
    for (const hash of ["allikvere", "allikvere-cover", "allikvere-frontier", "allikvere-unit"]) expect(html).toContain("#" + hash);
    expect(html).toContain("Existing PARTIAL evidence retains its checked local value");
  });
  it("shows only re-admitted compact intervals and exact source prime lists", () => {
    const report = validateRetainedProofArithmetic(raw), html = render("en");
    expect(report).not.toBeNull();
    for (const target of report!.targets) {
      expect(html).toContain(target.display.logBound); expect(html).toContain(target.display.margin);
      expect(html).toContain(target.display.logRequiredProduct); expect(html).toContain(target.primes.join(", "));
      expect(html).not.toContain(target.K.denominator);
    }
    expect(html).toContain("61 primes"); expect(html).toContain("71 primes"); expect(html).toContain("111-prime archive");
    expect(html).toContain("lcm(2,…,15)=360360"); expect(html).toContain("external assumptions not independently proved");
    expect(html).toContain("Unsigned receipts/hashes provide local trust only"); expect(html).toContain("katex");
    expect(html).toContain(report!.reportDigest); expect(html).toContain(report!.receipt.sourceSha256);
    expect(html).toContain(report!.receipt.stdoutSha256); expect(html).toContain(report!.planDigest);
    const source = readFileSync("src/components/research/math-lrc-proof-panel.tsx", "utf8");
    expect(source).toContain("\\\\prod_{i=1}^{n-1}c_i"); expect(source).not.toContain("\\\\prod_{i=1}^{n}c_i");
  });
  it.each(["vi", "en"])("fails closed on absent or tampered report in %s while preserving the plan", (locale) => {
    for (const invalid of [null, {}, { ...(raw as object), status: "THEOREM_PROVED" }]) {
      const html = render(locale, invalid);
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Báo cáo số học chưa có hoặc không hợp lệ" : "Arithmetic report unavailable or invalid");
      expect(html).toContain("ANALYTIC_REDUCTION_PROPERNESS_AUDIT"); expect(html).toContain("arXiv:2609.02604v2");
      expect(html).not.toContain("[341."); expect(html).not.toContain("[414.");
    }
  });
  it("uses safe responsive wrapping, native details and existing semantic tokens", () => {
    const html = render("en"), source = readFileSync("src/components/research/math-lrc-proof-panel.tsx", "utf8");
    for (const value of ["min-w-0", "scroll-mt-24", "sm:grid-cols-3", "flex-wrap", "break-all", "[overflow-wrap:anywhere]", "focus-visible:outline", "max-w-[76ch]"]) expect(html).toContain(value);
    expect(html).toContain("<details"); expect(html).toContain("math-tex-inline");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
  });
  it("pure panel admission launches no subprocess, external fetch or old proof path", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try {
      expect(render("en")).toContain("Conditional arithmetic reproduced");
      for (const forbidden of forbiddenCalls()) expect(forbidden).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    } finally { fetch.mockRestore(); }
  });
  it.each(["vi", "en"])("proof route authenticates then renders without old/ES/model dispatch in %s", async (locale) => {
    route.locale = locale;
    const fetch = vi.spyOn(globalThis, "fetch");
    try {
      const result = await MathToolsPage({ params: Promise.resolve({ workspaceSlug: "mathematics-pilot-lab-156de0" }), searchParams: Promise.resolve({ view: "allikvere-proof", n: "131433121", maxS: "143", mode: "ALL" }) });
      const html = renderToStaticMarkup(result);
      expect(route.load).toHaveBeenCalledWith("mathematics-pilot-lab-156de0");
      expect(html).toContain('id="allikvere-proof"'); expect(html).not.toContain("<form");
      expect(html.indexOf("?view=allikvere-proof#allikvere-proof")).toBeLessThan(html.indexOf("?view=allikvere#allikvere"));
      for (const forbidden of forbiddenCalls()) expect(forbidden).not.toHaveBeenCalled();
      expect(fetch).not.toHaveBeenCalled();
    } finally { fetch.mockRestore(); }
  });
  it("preserves capability and development gates before proof admission", async () => {
    const params = { params: Promise.resolve({ workspaceSlug: "private" }), searchParams: Promise.resolve({ view: "allikvere-proof" }) };
    route.allowed = false; await expect(MathToolsPage(params)).rejects.toThrow("404");
    route.allowed = true; route.env = "production"; await expect(MathToolsPage(params)).rejects.toThrow("404");
    expect(route.notFound).toHaveBeenCalledTimes(2);
    for (const forbidden of forbiddenCalls()) expect(forbidden).not.toHaveBeenCalled();
  });
});
