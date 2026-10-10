import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedPrimeCriterion from "../../docs/research/lrc-allikvere-v2/retained-prime-criterion-audit.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcPrimeCriterionPanel } from "@/components/research/math-lrc-prime-criterion-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedPrimeCriterionReport } from "@/modules/research-sandbox/math-lrc-prime-criterion";

const render = (locale: string, raw: unknown = retainedPrimeCriterion) => renderToStaticMarkup(createElement(MathLrcPrimeCriterionPanel, { raw, locale }));

describe("retained lower premise and conditional prime criterion presentation", () => {
  it.each(["vi", "en"])("separates reviewed source premises from independently replayed controls in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "bản tiền ấn phẩm" : "preprint premise");
    expect(html).toContain(locale === "vi" ? "chưa tái lập độc lập" : "not independently reproduced");
    expect(html).toContain(locale === "vi" ? "không phải suy diễn phổ quát từ lấy mẫu pha" : "not a universal inference from phase sampling");
    expect(html).toContain(locale === "vi" ? "không là kiểm đếm độc lập" : "not HIVE&#x27;s independent counts");
    expect(html).toContain(locale === "vi" ? "không tự chuyển sang tổng 14/15 hợp số" : "not an automatic transfer to composite totals 14/15");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
  });
  it("shows actual admitted source revisions, explicit ranges and scope hashes", () => {
    const report = validateRetainedPrimeCriterionReport(retainedPrimeCriterion);
    expect(report).not.toBeNull();
    const html = render("en");
    for (const entry of report!.sourceLedger) {
      const source = report!.sources.find((item) => item.id === entry.sourceId)!;
      expect(html).toContain(source.id); expect(html).toContain(source.revisionDate); expect(html).toContain(source.url);
      expect(html).toContain(entry.status); expect(html).toContain(`k = ${entry.movingSpeedRange.join("…")}`);
    }
    expect(html).toContain(report!.reportDigest); expect(html).toContain(report!.receipt.sourceSha256); expect(html).toContain(report!.receipt.stdoutSha256);
  });
  it.each(["vi", "en"])("keeps complete fibers, third-branch domain, primitivity and shift applicability explicit in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "phủ đủ cᵏ lớp con" : "cover all cᵏ subclasses");
    expect(html).toContain(locale === "vi" ? "mọi tuple nguyên dương phân biệt trong cả lớp" : "every positive distinct integer tuple in the entire class");
    expect(html).toContain(locale === "vi" ? "Đối xứng cho nhánh này cần chứng minh riêng" : "Its symmetry needs a separate proof");
    expect(html).toContain("gcd(g,e)=1");
    expect(html).toContain(locale === "vi" ? "không làm lá GCD modular bị từ chối" : "does not reject a modular GCD leaf");
    expect(html).toContain(locale === "vi" ? "không phải áp dụng cho vận tốc nguyên thủy" : "not a primitive-speed application");
    expect(html).toContain(locale === "vi" ? "vẫn tốt" : "still good");
    expect(html).not.toContain("katex-error"); expect(html).not.toContain("Invalid or unsupported TeX");
  });
  it("shows the complete toy domains without dropping improper or repeated residue rows", () => {
    const report = validateRetainedPrimeCriterionReport(retainedPrimeCriterion)!;
    const html = render("en");
    expect(report.shiftAudits.length).toBe(93); expect(report.shiftCellCount).toBe(5550);
    expect(html).toContain("93 phase partitions, 5550 complete phase cells");
    for (const domain of report.toyDomains) {
      expect(html).toContain(`${domain.bases} bases × ${domain.liftsPerBase} lifts per base = ${domain.rows} complete rows`);
      expect(html).toContain(`grid = ${domain.gridGood}, GCD = ${domain.gcdOnly}, improper = ${domain.improper}`);
      expect(html).toContain(domain.coverage); expect(html).toContain(domain.streamSha256);
    }
    expect(html).toContain("Repeated residues are preserved");
    expect(html).toContain("improper rows are not deleted or promoted to proper");
    expect(html).toContain("not continuous-time LRC counterexamples");
    for (const control of report.transferControls) expect(html).toContain(`${control.kind}: 8 checked lifts`);
    expect(html).toContain("that same time is not assigned to every lift");
  });
  it.each(["vi", "en"])("explains correct witness transport and localized CRT repair without refuting a source theorem in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain("M=28, b=5, b⁻¹=17, v=(1,2,4), j=2");
    expect(html).toContain(locale === "vi" ? "chuyển đúng j=10 là tốt" : "correct transfer j=10 is good");
    expect(html).toContain(locale === "vi" ? "j=6 bị thất bại" : "failing j=6");
    expect(html).toContain("gcd(level,p)=1"); expect(html).toContain("level=pᵉm");
    expect(html).toContain(locale === "vi" ? "không phủ định định lý" : "not a refutation or rerun of the source theorem");
    expect(html).toContain(locale === "vi" ? "Không dùng chứng chỉ chỉ đúng cho tuple primitive" : "primitive-only tuple certificate cannot admit");
  });
  it.each(["vi", "en"])("preserves noncircular lower-case requirements, frozen aliases and all global gates in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain("SOURCE_LOCATED_NOT_REPRODUCED"); expect(html).toContain("PRIOR_FULL_LRC13_NOT_ESTABLISHED");
    expect(html).toContain(locale === "vi" ? "cần chứng minh đầy đủ trường hợp 13" : "requires establishing the full 13-speed");
    expect(html).toContain(locale === "vi" ? "Tất cả 23 nghĩa vụ áp dụng toàn cục vẫn mở" : "All 23 global application obligations remain open");
    expect(html).toContain(locale === "vi" ? "S trong bài nguồn là tổng vận tốc" : "S in the source is the sum of speeds");
    expect(html).toContain(locale === "vi" ? "không thay đổi chứng cứ" : "without changing evidence");
    expect(html).toContain("math-tex-inline"); expect(html).not.toContain("katex-error");
    expect(html).toContain(locale === "vi" ? "không là chứng nhận thực thi bên ngoài" : "not external execution attestation");
  });
  it.each(["vi", "en"])("fails closed without exposing counts, receipts or successes in %s", (locale) => {
    for (const raw of [null, undefined, {}, { ...retainedPrimeCriterion, globalVerdict: "ESTABLISHED" }, { ...retainedPrimeCriterion, formalProof: true }, { ...retainedPrimeCriterion, receipt: null }]) {
      const html = renderToStaticMarkup(createElement(MathLrcPrimeCriterionPanel, { raw, locale }));
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Báo cáo tiền đề/prime chưa có hoặc không hợp lệ" : "Lower-premise/prime report unavailable or invalid");
      expect(html).not.toContain("5550"); expect(html).not.toContain("4096"); expect(html).not.toContain(retainedPrimeCriterion.reportDigest);
      expect(html).not.toContain("SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED");
    }
  });
  it("uses safe server composition, native disclosures and narrow-screen design tokens", () => {
    const source = readFileSync("src/components/research/math-lrc-prime-criterion-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "focus-visible:outline", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect(html).toContain("<details"); expect(html).toContain("<summary");
    expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(source).not.toContain("prime-criterion-replay"); expect(source).not.toContain("node:child_process");
  });
  it("GET has no fetch, replay process or old report validator", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("Lower LRC and prime criterion"); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
    const source = readFileSync("src/modules/research-sandbox/math-lrc-prime-criterion.ts", "utf8");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("node:fs"); expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source).not.toContain("validateRetainedPrefixKzReport"); expect(source).not.toContain("validateRetainedShapeGeometryReport");
  });
  it.each(["vi", "en"])("follows geometry while retaining all 23 old application obligations in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const plan = buildAllikvereProofPlan();
    expect(plan.targets.reduce((sum, target) => sum + target.dependencies.length, 0)).toBe(23);
    expect(plan.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(html.indexOf('id="allikvere-prime-criterion"')).toBeGreaterThan(html.indexOf('id="allikvere-shape-geometry"'));
    expect(html.indexOf('id="allikvere-prime-criterion"')).toBeLessThan(html.indexOf('id="allikvere-proof-dependencies"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
