import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedP83 from "../../docs/research/lrc-allikvere-v2/retained-p83-covering-number.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcP83CoveringNumberPanel } from "@/components/research/math-lrc-p83-covering-number-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedP83CoveringNumberReport } from "@/modules/research-sandbox/math-lrc-p83-covering-number";

const render = (locale: string, raw: unknown = retainedP83) => renderToStaticMarkup(createElement(MathLrcP83CoveringNumberPanel, { raw, locale }));

describe("complete actual-p83 covering-number checkpoint", () => {
  it.each(["vi", "en"])("shows the complete tau stage without whole-prime or LRC promotion in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "hoàn tất tầng covering-number" : "covering-number stage complete");
    expect(html).toContain("COMPLETE_COVERING_NUMBER_STAGE");
    expect(html).toContain(locale === "vi" ? "toàn prime 83, cả tập 61 prime hay LRC 14/15" : "full prime83, all 61 primes and LRC14/15");
    expect(html).toContain(locale === "vi" ? "Sinh mọi lớp, cascade và terminal vẫn MỞ" : "Full generation, cascade and terminal remain OPEN");
    expect(html).toContain(locale === "vi" ? "tất cả 23 nghĩa vụ áp dụng toàn cục giữ MỞ" : "all 23 global application obligations remain OPEN");
    expect(html).toContain("NOT_ESTABLISHED / NOT_ESTABLISHED");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
  });
  it("projects the admitted exact cover and every reconstructed root rather than trusting totals alone", () => {
    const report = validateRetainedP83CoveringNumberReport(retainedP83);
    expect(report).not.toBeNull(); const html = render("en");
    expect(report!.result.tau).toBe(12); expect(report!.result.cover12).toHaveLength(12);
    expect(html).toContain(`(${report!.result.cover12.join(", ")})`);
    expect(report!.certificate.maskTable).toHaveLength(41);
    expect(html).toContain("Covers all 41 folded time classes");
    expect(report!.certificate.roots).toHaveLength(10); expect(report!.certificate.totalNodes).toBe(7172);
    expect(html).toContain("10 complete roots; 7172 independently reconstructed nodes");
    for (const root of report!.certificate.roots) {
      expect(html).toContain(`(${root.triple.join(", ")}): ${root.nodeCount} nodes`); expect(html).toContain(root.traceSha256);
    }
    expect(html).toContain("counts or hashes alone do not admit completeness");
  });
  it.each(["vi", "en"])("explains private-time normalization and limits zero-gain pruning to decision trees in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain("82−5s");
    expect(html).toContain(locale === "vi" ? "Mọi bộ ba được xét" : "Every triple is considered");
    expect(html).toContain(locale === "vi" ? "không dùng lại làm phép liệt kê mọi hỗ trợ 13 lớp" : "not enumeration of every 13-class support");
    expect(html).toContain(locale === "vi" ? "không phải nhân chứng thời điểm LRC" : "not an LRC-time witness");
    expect(html).toContain(locale === "vi" ? "độc lập với LRC dưới và bộ sinh của tác giả" : "independent of lower LRC and the author&#x27;s generator");
    expect(html).toContain(locale === "vi" ? "không tuyên bố tính mới" : "no novelty is claimed");
    expect(html).not.toContain("katex-error"); expect(html).not.toContain("Invalid or unsupported TeX");
  });
  it.each(["vi", "en"])("keeps actual P13 membership, author counts and source identity separate from proof admission in %s", (locale) => {
    const report = validateRetainedP83CoveringNumberReport(retainedP83)!; const html = render(locale);
    expect(html).toContain("p = 83 ∈ P13, 61"); expect(html).toContain("k = 13");
    expect(html).toContain(report.source.primary.url); expect(html).toContain(report.source.archive.sha256);
    expect(html).toContain("CHECKSUM_IDENTITY_NOT_PROOF");
    expect(html).toContain(locale === "vi" ? "63.986 node trong TAU_MANIFEST là tác giả báo cáo" : "TAU_MANIFEST&#x27;s 63,986 nodes are author-reported");
    expect(html).toContain(locale === "vi" ? "Metadata lưu trữ cũ không bị sửa hay nâng trạng thái" : "Earlier archive metadata is not changed or promoted");
    expect(html).toContain(report.reportDigest); expect(html).toContain(report.receipt.sourceSha256); expect(html).toContain(report.receipt.stdoutSha256);
    expect(html).toContain(locale === "vi" ? "không là xác nhận bên ngoài hay chứng minh hình thức" : "not external attestation or formal proof");
  });
  it.each(["vi", "en"])("fails closed without complete-stage verdict, counts or receipts in %s", (locale) => {
    for (const raw of [null, undefined, {}, { ...retainedP83, globalVerdict: "ESTABLISHED" }, { ...retainedP83, fullPrimeVerdict: "ESTABLISHED" }, { ...retainedP83, formalProof: true }, { ...retainedP83, receipt: null }]) {
      const html = renderToStaticMarkup(createElement(MathLrcP83CoveringNumberPanel, { raw, locale }));
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Báo cáo phủ p83 chưa có hoặc không hợp lệ" : "p83 covering report is unavailable or invalid");
      expect(html).not.toContain("COMPLETE_COVERING_NUMBER_STAGE"); expect(html).not.toContain("7172"); expect(html).not.toContain(retainedP83.reportDigest);
      expect(html).not.toContain(locale === "vi" ? "hoàn tất tầng covering-number" : "covering-number stage complete");
    }
  });
  it("uses a compact server-only checkpoint, two native disclosures and narrow-screen tokens", () => {
    const source = readFileSync("src/components/research/math-lrc-p83-covering-number-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "focus-visible:outline", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect((html.match(/<details/g) ?? [])).toHaveLength(2);
    expect(html).not.toContain("<form"); expect(html).not.toContain("<button"); expect(html).not.toContain("<h4");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(source).not.toContain("covering-number-replay"); expect(source).not.toContain("node:child_process");
    expect(html).toContain("math-tex-inline"); expect(html).not.toContain("katex-error");
  });
  it("GET performs no fetch, subprocess or old report validation", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("covering-number stage complete"); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
    const source = readFileSync("src/modules/research-sandbox/math-lrc-p83-covering-number.ts", "utf8");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("node:fs"); expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source).not.toContain("validateRetainedPrimeCriterionReport");
  });
  it.each(["vi", "en"])("appears by the selected obligation without growing the audit stack or changing 23 OPEN gates in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const plan = buildAllikvereProofPlan();
    expect(plan.targets.reduce((sum, target) => sum + target.dependencies.length, 0)).toBe(23);
    expect(plan.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(html.indexOf('id="allikvere-p83-covering-number"')).toBeGreaterThan(html.indexOf('aria-labelledby="allikvere-next-obligation"'));
    expect(html.indexOf('id="allikvere-p83-covering-number"')).toBeLessThan(html.indexOf('id="allikvere-properness"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
