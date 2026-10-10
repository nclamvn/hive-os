import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedShapeGeometry from "../../docs/research/lrc-allikvere-v2/retained-shape-geometry-audit.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcShapeGeometryPanel } from "@/components/research/math-lrc-shape-geometry-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedShapeGeometryReport } from "@/modules/research-sandbox/math-lrc-shape-geometry";

const render = (locale: string, raw: unknown = retainedShapeGeometry) => renderToStaticMarkup(createElement(MathLrcShapeGeometryPanel, { raw, locale }));
const fraction = (q: { numerator: string; denominator: string }) => q.denominator === "1" ? q.numerator : `${q.numerator}/${q.denominator}`;

describe("retained universal shape and conditional flag presentation", () => {
  it.each(["vi", "en"])("distinguishes universal sublemma progress from historical/global application status in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Các phần cũ giữ dấu mốc" : "Earlier sections retain their review snapshots");
    expect(html).toContain(locale === "vi" ? "Hình dạng phổ quát" : "Universal shape bound");
    expect(html).toContain(locale === "vi" ? "không tự đóng các gate áp dụng" : "does not automatically close whole-LRC application gates");
    expect(html).toContain(locale === "vi" ? "không chỉ một grid số" : "not just a numerical grid");
    expect(html).toContain("CHECKED_UNIVERSAL_SHAPE_GEOMETRY_SUBSTEPS");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
    expect(html).not.toContain("katex-error"); expect(html).not.toContain("Invalid or unsupported TeX");
    expect(html).toContain("math-tex-inline");
  });
  it("shows every admitted k branch, root bracket, polynomial and control", () => {
    const report = validateRetainedShapeGeometryReport(retainedShapeGeometry);
    expect(report).not.toBeNull();
    const html = render("en");
    expect(report!.targets.reduce((sum, target) => sum + target.shape.kBranches.length, 0)).toBe(25);
    expect(report!.targets.reduce((sum, target) => sum + target.geometryControls.length, 0)).toBe(4);
    for (const target of report!.targets) {
      expect(html).toContain(`n = ${target.movingSpeeds}`);
      expect(html).toContain(`L = ${fraction(target.shape.criticalBracket.lower)}, U = ${fraction(target.shape.criticalBracket.upper)}`);
      expect(html).toContain(`${fraction(target.shape.alphaBracket.lower)} &lt; α &lt; ${fraction(target.shape.alphaBracket.upper)}`);
      expect(html).toContain(`${target.shape.kBranches.length} k≥2 branches checked completely`);
      expect(html).toContain(target.shape.D.join(", "));
      expect(html).toContain(target.shape.P.join(", "));
      expect(html).toContain(target.shape.cubic.join(", "));
      for (const branch of target.shape.kBranches) expect(html).toContain(`k = ${branch.k}: ${fraction(branch.lowerBound)} &gt; ${fraction(branch.target)}`);
      for (const control of target.geometryControls) { expect(html).toContain(control.id); expect(html).toContain(control.speeds.join(", ")); }
      expect(html).not.toContain(target.flag.K.denominator);
      expect(html).not.toContain(target.shape.k1Comparison.left.denominator);
    }
    expect(html).toContain(report!.reportDigest); expect(html).toContain(report!.dependency.reportSha256);
    expect(html).toContain(report!.receipt.sourceSha256); expect(html).toContain(report!.receipt.stdoutSha256);
  });
  it.each(["vi", "en"])("shows the all-case universal reduction and exact powered strict comparisons in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "cực tiểu tồn tại" : "minimum exists");
    expect(html).toContain(locale === "vi" ? "mọi tọa độ nội" : "every interior coordinate");
    expect(html).toContain(locale === "vi" ? "Tách theo k" : "Split by k");
    expect(html).toContain(locale === "vi" ? "còn k=1 quy về đúng một nghiệm cubic" : "k=1 reduces to one cubic root");
    expect(html).toContain(locale === "vi" ? "Biên của so sánh hữu tỉ là dương nghiêm ngặt" : "The rational comparison margin is strictly positive");
    expect(html).toContain(locale === "vi" ? "không dùng log hoặc số thực dấu phẩy động" : "does not use logarithms or floating-point arithmetic");
    expect(html).toContain(locale === "vi" ? "không phải chứng minh hình thức Lean" : "not a Lean formal proof");
  });
  it.each(["vi", "en"])("keeps written geometry, finite matrix controls and primitive necessity separate in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "đầy đủ các đỉnh của tiết diện" : "every crosspolytope-section vertex");
    expect(html).toContain(locale === "vi" ? "không chỉ tại các vector đối chứng" : "not merely at control vectors");
    expect(html).toContain(locale === "vi" ? "chỉ là đối chứng công thức ma trận" : "matrix-formula controls only");
    expect(html).toContain(locale === "vi" ? "không là nhân chứng LRC" : "not a universal proof, an LRC witness");
    expect(html).toContain(locale === "vi" ? "gcd=2 bị từ chối" : "gcd=2 and is rejected");
    expect(html).toContain(locale === "vi" ? "Phép chiếu không đổi" : "Its projection is unchanged");
    expect(html).toContain(locale === "vi" ? "không được diễn giải thành một bài LRC admissible mới" : "not interpreted as a new admissible LRC problem");
  });
  it.each(["vi", "en"])("preserves lower-case provenance, retained-only dependency and all global limits in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "LRC dưới vẫn là tiền đề" : "lower LRC remains a premise");
    expect(html).toContain(locale === "vi" ? "không phải phát lại TIP-053" : "not a fresh TIP-053 replay");
    expect(html).toContain(locale === "vi" ? "cần LRC dưới tới 12" : "requires lower LRC through 12");
    expect(html).toContain(locale === "vi" ? "cần LRC dưới tới 13" : "requires lower LRC through 13");
    expect(html).toContain("CONDITIONAL_ONLY"); expect(html).toContain("NOT_ESTABLISHED");
    expect(html).toContain("IMMUTABLE_RETAINED_REFERENCE_NOT_FRESH_053_REPLAY");
    expect(html).toContain(locale === "vi" ? "Tất cả 23 nghĩa vụ áp dụng toàn cục" : "All 23 global application obligations");
    expect(html).toContain(locale === "vi" ? "không chỉ thay chỉ số" : "not just an index substitution");
    expect(html).toContain(locale === "vi" ? "Chưa có chiến dịch agent HIVE mới" : "No new HIVE agent campaign");
    expect(html).toContain(locale === "vi" ? "không là chứng nhận thực thi bên ngoài" : "not external execution attestation");
  });
  it.each(["vi", "en"])("fails closed without bounds, branch counts or evidence receipts in %s", (locale) => {
    for (const invalid of [null, undefined, {}, { ...retainedShapeGeometry, globalVerdict: "ESTABLISHED" }, { ...retainedShapeGeometry, formalProof: true }, { ...retainedShapeGeometry, receipt: null }]) {
      const html = renderToStaticMarkup(createElement(MathLrcShapeGeometryPanel, { raw: invalid, locale }));
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Báo cáo hình dạng/hình học chưa có hoặc không hợp lệ" : "Shape/geometry report unavailable or invalid");
      expect(html).not.toContain("k≥2 branches checked completely"); expect(html).not.toContain("nhánh k≥2 đã kiểm đầy đủ");
      expect(html).not.toContain(retainedShapeGeometry.reportDigest);
      expect(html).not.toContain("CHECKED_UNIVERSAL_SHAPE_GEOMETRY_SUBSTEPS");
    }
  });
  it("uses safe server composition, native details and existing narrow-screen tokens", () => {
    const source = readFileSync("src/components/research/math-lrc-shape-geometry-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "focus-visible:outline", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect(html).toContain("<details"); expect(html).toContain("<summary");
    expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("shape-geometry-replay");
  });
  it("GET presentation has no external fetch, process runner or old algebra validator", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("Universal shape bound"); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
    const source = readFileSync("src/modules/research-sandbox/math-lrc-shape-geometry.ts", "utf8");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("node:fs");
    expect(source).not.toMatch(/\bfetch\s*\(/); expect(source).not.toContain("validateRetainedPrefixKzReport");
  });
  it.each(["vi", "en"])("appears after KZ without changing any frozen application obligation in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const plan = buildAllikvereProofPlan();
    expect(plan.targets.reduce((sum, target) => sum + target.dependencies.length, 0)).toBe(23);
    expect(plan.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(html.indexOf('id="allikvere-shape-geometry"')).toBeGreaterThan(html.indexOf('id="allikvere-prefix-kz"'));
    expect(html.indexOf('id="allikvere-shape-geometry"')).toBeLessThan(html.indexOf('id="allikvere-proof-dependencies"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
