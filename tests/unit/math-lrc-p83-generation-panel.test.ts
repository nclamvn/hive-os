import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedGeneration from "../../docs/research/lrc-allikvere-v2/retained-p83-generation.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcP83GenerationPanel } from "@/components/research/math-lrc-p83-generation-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedP83GenerationReport } from "@/modules/research-sandbox/math-lrc-p83-generation";

const render = (locale: string, raw: unknown = retainedGeneration) => renderToStaticMarkup(createElement(MathLrcP83GenerationPanel, { raw, locale }));
const rehash = (raw: Record<string, unknown>) => { const { reportDigest: _digest, ...body } = raw; void _digest; return { ...body, reportDigest: sha256(canonicalJson(body)) }; };

describe("compact full p83 generation checkpoint", () => {
  it.each(["vi", "en"])("shows stage completion while preserving downstream/global and historical scope in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "hoàn tất sinh miền level 1" : "level-one generation complete");
    expect(html).toContain("COMPLETE_LEVEL_ONE_GENERATION_STAGE");
    expect(html).toContain(locale === "vi" ? "giữ mốc trước khi sinh miền" : "retains its pre-generation snapshot");
    expect(html).toContain(locale === "vi" ? "Cascade và terminal vẫn MỞ" : "Cascade and terminal remain OPEN");
    expect(html).toContain(locale === "vi" ? "tất cả 23 nghĩa vụ áp dụng toàn cục giữ MỞ" : "all 23 global application obligations remain OPEN");
    expect(html).toContain("NOT_ESTABLISHED / NOT_ESTABLISHED");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
  });
  it("shows separate12 seeds and the admitted complete disjoint13 union with every root summary", () => {
    const report = validateRetainedP83GenerationReport(retainedGeneration)!;
    expect(report).not.toBeNull(); const html = render("en");
    expect(report.counts.canonical12).toBe(2042); expect(report.counts.irredundant13).toBe(41552);
    expect(report.counts.reducible13).toBe(74351); expect(report.counts.canonical13).toBe(115903);
    expect(html).toContain("115903 canonical 13-entry representatives: 41552 irredundant13 covers and 74351 reducible13 extensions");
    expect(html).toContain("2042 12-cover seeds form a separate family");
    expect(report.roots).toHaveLength(20); expect(report.counts.totalNodes).toBe(1939746);
    expect(html).toContain("20 complete roots; 1939746 nodes checked offline");
    for (const root of report.roots) expect(html).toContain(`s = ${root.targetSize}, (${root.pair.join(", ")}): ${root.nodes} nodes, ${root.leafOccurrences} leaf occurrences; ${root.traceBytes} tree bytes`);
    expect(html).toContain(`${report.counts.repeated13} 13-entry representatives with repeats retained`);
    for (const dataset of Object.values(report.datasets)) { expect(html).toContain(dataset.path); expect(html).toContain(dataset.sha256); expect(html).toContain(`${dataset.bytes} bytes`); }
    expect(html).toContain(report.reportDigest); expect(html).toContain(report.receipt.inputSha256);
    expect(html).toContain(report.receipt.sourceSha256); expect(html).toContain(report.receipt.stdoutSha256);
  });
  it.each(["vi", "en"])("preserves repeated coordinates and proves minimal enumeration separately from unrestricted extensions in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "mọi multiset 13 phần tử" : "every 13-entry multiset");
    expect(html).toContain(locale === "vi" ? "mọi 41 đơn vị gấp" : "all 41 folded units");
    expect(html).toContain(locale === "vi" ? "mask xấu phủ mọi lớp thời gian" : "whose bad masks cover all time classes");
    expect(html).toContain(locale === "vi" ? "không phải phản ví dụ LRC liên tục" : "not a continuous-time LRC counterexample");
    expect(html).toContain(locale === "vi" ? "kể cả lớp đã có và lớp không tăng độ phủ" : "including existing and zero-gain classes");
    expect(html).toContain(locale === "vi" ? "không tái dùng phép loại chỉ đúng cho quyết định ≤11" : "not reuse of decision-only ≤11 pruning");
    expect(html).toContain(locale === "vi" ? "so từng byte/dòng của dataset" : "every dataset byte/row compared");
    expect(html).toContain(locale === "vi" ? "số đếm/hash riêng không chứng minh tính đầy đủ" : "counts or hashes alone do not prove completeness");
    expect(html).not.toContain("katex-error"); expect(html).not.toContain("Invalid or unsupported TeX");
  });
  it.each(["vi", "en"])("labels passive pinned-summary admission as not a fresh mathematical replay in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY");
    expect(html).toContain("EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_ROW");
    expect(html).toContain(locale === "vi" ? "GET chỉ đối chiếu summary local đã pin, không phải phát lại toán mới" : "GET checks only the pinned local summary, not a fresh mathematical replay");
    expect(html).toContain(locale === "vi" ? "không chạy khi mở trang" : "not when this page opens");
    expect(html).toContain(locale === "vi" ? "không là xác nhận bên ngoài, chứng minh hình thức hoặc phát lại mới TIP-056" : "not external attestation, formal proof or a fresh TIP-056 replay");
    expect(html).toContain(locale === "vi" ? "không thay bằng một lát cắt hay số tổng" : "not a shard or aggregate count");
    expect(html).toContain(locale === "vi" ? "không tuyên bố tính mới" : "no novelty is claimed");
  });
  it.each(["vi", "en"])("fails closed for corrupt and coherently rehashed summaries without admitting counts in %s", (locale) => {
    const wrongCounts = rehash({ ...retainedGeneration, counts: { ...retainedGeneration.counts, canonical13: 115902 } });
    const promoted = rehash({ ...retainedGeneration, remaining: { ...retainedGeneration.remaining, fullPrime: "ESTABLISHED" } });
    for (const raw of [null, undefined, {}, { ...retainedGeneration, receipt: null }, wrongCounts, promoted]) {
      const html = renderToStaticMarkup(createElement(MathLrcP83GenerationPanel, { raw, locale }));
      expect(html).toContain('role="alert"');
      expect(html).toContain(locale === "vi" ? "Summary sinh miền p83 chưa có hoặc không khớp pin" : "p83 generation summary is unavailable or does not match its pin");
      expect(html).not.toContain("115903"); expect(html).not.toContain("1939746"); expect(html).not.toContain(retainedGeneration.reportDigest);
      expect(html).not.toContain("COMPLETE_LEVEL_ONE_GENERATION_STAGE");
      expect(html).not.toContain(locale === "vi" ? "hoàn tất sinh miền level 1" : "level-one generation complete");
    }
  });
  it("uses compact server rendering and only the small JSON artifact, never binary imports", () => {
    const source = readFileSync("src/components/research/math-lrc-p83-generation-panel.tsx", "utf8"), parent = readFileSync("src/components/research/math-lrc-proof-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "focus-visible:outline", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect((html.match(/<details/g) ?? [])).toHaveLength(2); expect(html).not.toContain("<form"); expect(html).not.toContain("<button"); expect(html).not.toContain("<h4");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML"); expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(parent).toContain('import retainedP83Generation from "../../../docs/research/lrc-allikvere-v2/retained-p83-generation.json"');
    expect(source + parent).not.toMatch(/\b(?:from|import)\s*[^\n]*\.bin["']/);
    expect(source).not.toContain("generation-replay"); expect(source).not.toContain("reconstructP83");
    expect(html).toContain("math-tex-inline"); expect(html).not.toContain("katex-error");
  });
  it("passive summary rendering never fetches or dispatches full-tree replay", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("level-one generation complete"); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
    const source = readFileSync("src/components/research/math-lrc-p83-generation-panel.tsx", "utf8");
    expect(source).not.toContain("node:child_process"); expect(source).not.toContain("node:fs"); expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source).not.toContain("validateRetainedP83CoveringNumberReport");
  });
  it("the retained-summary validator performs bounded pin checking, not full semantic reconstruction", () => {
    const source = readFileSync("src/modules/research-sandbox/math-lrc-p83-generation.ts", "utf8");
    const validator = source.slice(source.indexOf("export function validateRetainedP83GenerationReport"));
    expect(validator).toContain("P83_GENERATION_RETAINED_SHA256");
    expect(validator).toContain("P83_GENERATION_LIMITS.summaryBytes");
    expect(validator).not.toContain("reconstructP83GenerationEvidence"); expect(validator).not.toContain("validateP83GenerationEvidence");
    expect(validator).not.toContain("inspectP83GenerationEvidence"); expect(validator).not.toContain("P83_GENERATION_PATHS");
    expect(validator).not.toContain("node:fs"); expect(validator).not.toContain("node:child_process");
  });
  it.each(["vi", "en"])("follows immutable056 immediately and preserves the frozen23 OPEN obligations in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const plan = buildAllikvereProofPlan();
    expect(plan.targets.reduce((sum, target) => sum + target.dependencies.length, 0)).toBe(23);
    expect(plan.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(html.indexOf('id="allikvere-p83-generation"')).toBeGreaterThan(html.indexOf('id="allikvere-p83-covering-number"'));
    expect(html.indexOf('id="allikvere-p83-generation"')).toBeLessThan(html.indexOf('id="allikvere-properness"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
