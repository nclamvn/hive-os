import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedPrefixKz from "../../docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcPrefixKzPanel } from "@/components/research/math-lrc-prefix-kz-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedPrefixKzReport } from "@/modules/research-sandbox/math-lrc-prefix-kz";

const render = (locale: string, raw: unknown = retainedPrefixKz) => renderToStaticMarkup(createElement(MathLrcPrefixKzPanel, { raw, locale }));

describe("retained prefix/KZ analytic audit presentation", () => {
  it.each(["vi", "en"])("distinguishes the abstract real-variable minimum from conditional LRC application in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Kết quả trừu tượng" : "Abstract result");
    expect(html).toContain(locale === "vi" ? "Áp dụng vào LRC: vẫn có điều kiện" : "Application to LRC: still conditional");
    expect(html).toContain(locale === "vi" ? "không phải độ phủ LRC" : "not LRC coverage");
    expect(html).toContain(locale === "vi" ? "không phải phép liệt kê mọi vận tốc" : "not enumeration of every speed");
    expect(html).toContain("CHECKED_ABSTRACT_KZ_MINIMUM");
    expect(html).toContain("NOT_ESTABLISHED");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
    expect(html).toContain("math-tex-inline"); expect(html).not.toContain("katex-error");
    expect(html).not.toContain("Invalid or unsupported TeX");
  });
  it("shows only fully admitted block, vertex and prefix counts and stream receipts", () => {
    const report = validateRetainedPrefixKzReport(retainedPrefixKz);
    expect(report).not.toBeNull();
    const html = render("en");
    expect(report!.targets.reduce((sum, target) => sum + target.prefixes.length, 0)).toBe(25);
    expect(report!.targets.reduce((sum, target) => sum + target.vertexAudit.maskCount, 0)).toBe(6144);
    for (const target of report!.targets) {
      expect(html).toContain(`n = ${target.movingSpeeds}, d = ${target.dimension}`);
      expect(html).toContain(`${target.blocks.length} contiguous blocks`);
      expect(html).toContain(`${target.vertexAudit.maskCount} complete vertices`);
      expect(html).toContain(`${target.vertexAudit.firstMask}…${target.vertexAudit.lastMask}`);
      expect(html).toContain(target.vertexAudit.streamSha256);
      expect(html).not.toContain(target.vertexAudit.minimum.denominator);
      for (const prefix of target.prefixes) {
        expect(html).toContain(`r = ${prefix.r}: Bᵣ = ${prefix.B.numerator}/${prefix.B.denominator}`);
        expect(html).toContain(`lower LRC through ${prefix.lowerLrcMax}.`);
      }
    }
    expect(html).toContain(report!.reportDigest);
    expect(html).toContain(report!.receipt.sourceSha256);
    expect(html).toContain(report!.receipt.stdoutSha256);
  });
  it.each(["vi", "en"])("explains continuous-to-finite completeness, not just finite enumeration in %s", (locale) => {
    const html = render(locale);
    for (const [viCopy, enCopy] of [
      ["mọi cuối khối đạt bằng", "every block end to be active"],
      ["không bỏ sót đỉnh", "leaving no vertex omitted"],
      ["hướng recession không âm", "nonnegative recession direction"],
      ["vừa lõm vừa tăng", "concave and coordinate-increasing"],
      ["không phải chứng minh hình thức Lean", "not a Lean formal proof"],
      ["Kiểm đỉnh đơn thuần không thay thế", "Vertex checking alone does not replace"],
    ]) expect(html).toContain(locale === "vi" ? viCopy : enCopy);
    expect(html).toContain("Minkowski–Weyl");
  });
  it.each(["vi", "en"])("retains equality witness strictness and missing lower/geometric premises in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "đúng bằng ngưỡng vẫn tạo nhân chứng" : "Equality at the error threshold still yields a witness");
    expect(html).toContain(locale === "vi" ? "không tạo nhân chứng LRC dưới" : "does not create a lower-LRC witness");
    expect(html).toContain(locale === "vi" ? "cơ sở KZ của một lattice cụ thể" : "KZ basis for a particular lattice");
    expect(html).toContain(locale === "vi" ? "đầy đủ terminal của tác giả vẫn mở" : "complete author terminals remain open");
    expect(html).toContain(locale === "vi" ? "Tất cả 23 nghĩa vụ toàn cục" : "All 23 global obligations");
    expect(html).toContain(locale === "vi" ? "Chưa chạy chiến dịch mô hình HIVE mới" : "No new HIVE model campaign has run");
    expect(html).toContain(locale === "vi" ? "chưa được thiết lập bởi bảng này" : "not established by this table");
  });
  it.each(["vi", "en"])("fails closed without counts or evidence digests in %s", (locale) => {
    for (const invalid of [null, undefined, {}, { ...retainedPrefixKz, globalVerdict: "ESTABLISHED" }, { ...retainedPrefixKz, receipt: null }]) {
      const html = renderToStaticMarkup(createElement(MathLrcPrefixKzPanel, { raw: invalid, locale }));
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Báo cáo prefix/KZ chưa có hoặc không hợp lệ" : "Prefix/KZ report unavailable or invalid");
      expect(html).not.toContain("complete vertices"); expect(html).not.toContain("đỉnh đầy đủ");
      expect(html).not.toContain(retainedPrefixKz.reportDigest);
      expect(html).not.toContain("CHECKED_ABSTRACT_KZ_MINIMUM");
    }
  });
  it("uses server composition, native details and existing narrow-screen tokens", () => {
    const source = readFileSync("src/components/research/math-lrc-prefix-kz-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "focus-visible:outline", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect(html).toContain("<details"); expect(html).toContain("<summary");
    expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("prefix-kz-replay");
  });
  it("GET presentation has no subprocess, fetch or model runner", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("Abstract result"); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
    const source = readFileSync("src/modules/research-sandbox/math-lrc-prefix-kz.ts", "utf8");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("node:fs");
    expect(source).not.toMatch(/\bfetch\s*\(/);
  });
  it.each(["vi", "en"])("adds the audit without closing any of the existing global dependencies in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const proof = buildAllikvereProofPlan(), count = proof.targets.reduce((sum, target) => sum + target.dependencies.length, 0);
    expect(count).toBe(23);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(proof.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect(html.indexOf('id="allikvere-prefix-kz"')).toBeGreaterThan(html.indexOf('id="allikvere-properness"'));
    expect(html.indexOf('id="allikvere-prefix-kz"')).toBeLessThan(html.indexOf('id="allikvere-proof-dependencies"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
