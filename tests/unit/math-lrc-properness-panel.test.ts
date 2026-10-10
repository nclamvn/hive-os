import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedProperness from "../../docs/research/lrc-allikvere-v2/retained-properness-bridge.json";
import { MathLrcPropernessPanel } from "@/components/research/math-lrc-properness-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { validateRetainedPropernessReport } from "@/modules/research-sandbox/math-lrc-properness";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";

const render = (locale: string, raw: unknown = retainedProperness) => renderToStaticMarkup(createElement(MathLrcPropernessPanel, { raw, locale }));

describe("properness bridge retained presentation", () => {
  it.each(["vi", "en"])("shows complete continuous-phase partitions without global promotion in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "toàn bộ pha, không chỉ lấy mẫu" : "every phase, not just samples");
    expect(html).toContain(locale === "vi" ? "đúng bằng 1/N là tốt" : "equality at 1/N is good");
    expect(html).toContain(locale === "vi" ? "gồm cả khoảng nối qua 1" : "including the wrap through 1");
    expect(html).toContain(locale === "vi" ? "không phải chứng minh hình thức Lean" : "not a Lean formal proof");
    expect(html).toContain("NOT_ESTABLISHED");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
    expect(html).not.toContain("katex-error"); expect(html).toContain("math-tex-inline");
  });
  it("derives all displayed counts and certificate scopes from admitted evidence", () => {
    const report = validateRetainedPropernessReport(retainedProperness);
    expect(report).not.toBeNull();
    const html = render("en");
    for (const certificate of report!.phaseCertificates) {
      expect(html).toContain(`N = ${certificate.totalRunners}, d = ${certificate.shiftModulus}: ${certificate.boundaries.length} boundaries, ${certificate.cells.length} complete phase cells`);
      expect(html).toContain(`maximum bad shifts ${certificate.maximumBadShifts} ≤ ${certificate.ceilBound}`);
    }
    for (const application of report!.applications) {
      expect(html).toContain(application.id); expect(html).toContain(application.status);
      expect(html).toContain(application.residues.join(", "));
    }
    expect(html).toContain(report!.reportDigest);
    expect(html).toContain(report!.receipt.sourceSha256); expect(html).toContain(report!.receipt.stdoutSha256);
    expect(html).toContain(report!.scopeBinding.sourceReportSha256); expect(html).toContain(report!.scopeBinding.sourceScopeDigest);
  });
  it.each(["vi", "en"])("separates actual fixed classes, synthetic controls and missing lower witnesses in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Lớp cố định thực" : "Actual fixed class");
    expect(html).toContain(locale === "vi" ? "Đối chứng cơ chế tổng hợp" : "Synthetic mechanism control");
    expect(html).toContain(locale === "vi" ? "không phải toàn bộ fiber cha" : "not its whole parent fiber");
    expect(html).toContain(locale === "vi" ? "không phải terminal của tác giả" : "not an author terminal");
    expect(html).toContain(locale === "vi" ? "Chưa có nhân chứng của trường hợp dưới" : "No lower-case witness has been established");
    expect(html).toContain(locale === "vi" ? "mọi ngoại lệ phải là đơn vị" : "every exception must be a unit");
    expect(html).toContain(locale === "vi" ? "Bất đẳng thức nghiêm ngặt" : "The strict inequality");
  });
  it.each(["vi", "en"])("keeps method checks distinct from research campaign and full proof in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Chưa ràng buộc cơ chế này với mọi terminal" : "not bound to every terminal");
    expect(html).toContain(locale === "vi" ? "Không nâng NO_GRID" : "NO_GRID is not promoted");
    expect(html).toContain(locale === "vi" ? "chưa có chiến dịch LLM mới" : "no new LLM campaign");
    expect(html).toContain(locale === "vi" ? "Trong đường chuẩn bị host mới" : "In new host preparation");
    expect(html).toContain(locale === "vi" ? "không được gán receipt phát lại mới" : "not assigned a new replay receipt");
    expect(html).toContain(locale === "vi" ? "không là chữ ký thực thi bên ngoài" : "not external execution signatures");
  });
  it.each(["vi", "en"])("fails closed without evidence numbers, masks or success claims in %s", (locale) => {
    for (const raw of [undefined, null, {}, { ...retainedProperness, globalVerdict: "ESTABLISHED" }, { ...retainedProperness, receipt: null }]) {
      const html = renderToStaticMarkup(createElement(MathLrcPropernessPanel, { raw, locale }));
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Báo cáo cầu nối chưa có hoặc không hợp lệ" : "Properness report unavailable or invalid");
      expect(html).not.toContain("maximum bad shifts"); expect(html).not.toContain("cực đại shift xấu");
      expect(html).not.toContain(retainedProperness.reportDigest);
      expect(html).not.toContain("NONPRIMITIVE_CLASS_EXCLUDED");
    }
  });
  it("uses server-only composition, restrained tokens and narrow-screen wrapping", () => {
    const source = readFileSync("src/components/research/math-lrc-properness-panel.tsx", "utf8"), html = render("en");
    for (const value of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "focus-visible:outline", "text-ink-muted", "border-line"]) expect(html).toContain(value);
    expect(html).toContain("<details"); expect(html).toContain("<summary");
    expect(html).not.toContain("<button"); expect(html).not.toContain("<form");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("properness-replay");
  });
  it("renders only pure retained admission, without external fetch or process launch", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("Properness bridge"); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
    const source = readFileSync("src/modules/research-sandbox/math-lrc-properness.ts", "utf8");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("node:fs");
    expect(source).not.toMatch(/\bfetch\s*\(/);
  });
  it("adds the bridge before the unchanged twenty-three open global obligations", () => {
    const arithmetic = JSON.parse(readFileSync("docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json", "utf8"));
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: arithmetic, base: "/w/lab/research/math-tools", locale: "en" }));
    expect(html.indexOf('id="allikvere-properness"')).toBeGreaterThan(html.indexOf("Selected next obligation"));
    expect(html.indexOf('id="allikvere-properness"')).toBeLessThan(html.indexOf("Proof dependencies"));
    const count = buildAllikvereProofPlan().targets.reduce((sum, target) => sum + target.dependencies.length, 0);
    expect(count).toBe(23); expect((html.match(/>OPEN</g) ?? []).length).toBe(count);
    expect(html).toContain("NOT ESTABLISHED"); expect(html).toContain("No novelty claim");
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
