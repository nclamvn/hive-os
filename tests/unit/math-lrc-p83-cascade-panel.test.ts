import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedCascade from "../../docs/research/lrc-allikvere-v2/retained-p83-cascade.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcP83CascadePanel } from "@/components/research/math-lrc-p83-cascade-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedP83CascadeReport } from "@/modules/research-sandbox/math-lrc-p83-cascade";

const render = (locale: string, raw: unknown = retainedCascade) => renderToStaticMarkup(createElement(MathLrcP83CascadePanel, { raw, locale }));
const rehash = (raw: Record<string, unknown>) => { const { reportDigest: _digest, ...body } = raw; void _digest; return { ...body, reportDigest: sha256(canonicalJson(body)) }; };

describe("compact complete p83 binary cascade checkpoint", () => {
  it.each(["vi", "en"])("separates complete cascade from frozen historical, terminal and global scope in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "hoàn tất cascade nhị phân" : "binary cascade complete");
    expect(html).toContain(locale === "vi" ? "mốc lịch sử đã đóng băng" : "frozen historical snapshot");
    expect(html).toContain(locale === "vi" ? "Terminal vẫn MỞ" : "Terminal remains OPEN");
    expect(html).toContain(locale === "vi" ? "tất cả 23 nghĩa vụ áp dụng toàn cục giữ MỞ" : "all 23 global application obligations remain OPEN");
    expect(html).toContain("NOT_ESTABLISHED / NOT_ESTABLISHED");
    expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
    expect(html).toContain(locale === "vi" ? "không phải phần trăm chứng minh" : "not a proof-completion percentage");
  });
  it("projects every admitted stage, the full forest, all datasets and both derived ancestors", () => {
    const report = validateRetainedP83CascadeReport(retainedCascade)!;
    expect(report).not.toBeNull(); const html = render("en");
    expect(report.stages).toHaveLength(5);
    expect(report.stages.map((stage) => stage.survivors)).toEqual([461780, 4990, 56, 32, 32]);
    expect(report.stages[0].parentCount).toBe(115903);
    expect(report.counts.roots).toBe(582761); expect(report.counts.nodes).toBe(2330389);
    for (const stage of report.stages) expect(html).toContain(`${stage.fromLevel} → ${stage.toLevel}: ${stage.parentCount} parents; ${stage.nodes} nodes, ${stage.forces} force, ${stage.splits} split, ${stage.conflicts} conflict, ${stage.satCubes} SAT cube; ${stage.satAssignments} SAT, ${stage.gcdProper} gcd-proper, ${stage.improperRaw} improper before deduplication, ${stage.survivors} retained representatives`);
    expect(report.ancestors.rows).toEqual([[1,2,3,4,5,6,7,8,9,10,11,12,13], [1,2,3,4,5,6,7,8,9,10,11,13,24]]);
    for (const row of report.ancestors.rows) expect(html).toContain(`(${row.join(", ")})`);
    for (const dataset of Object.values(report.datasets)) { expect(html).toContain(dataset.path); expect(html).toContain(dataset.sha256); expect(html).toContain(`${dataset.bytes} bytes`); }
    expect(html).toContain(report.reportDigest); expect(html).toContain(report.receipt.sourceSha256);
    expect(html).toContain(report.receipt.inputSha256); expect(html).toContain(report.receipt.stdoutSha256);
  });
  it.each(["vi", "en"])("explains exhaustive branching, predicate boundaries and restricted canonicalization in %s", (locale) => {
    const html = render(locale);
    for (const pair of [
      ["đủ 8192 lựa chọn nâng có nhãn cho mỗi parent", "all 8192 labelled lift choices per parent"],
      ["hai nhánh của mỗi split", "both split branches"],
      ["mọi phép gán tự do tại lá SAT", "every free assignment at SAT leaves"],
      ["Không tái dùng loại nhánh bằng tính tối thiểu", "No minimality or private-time pruning is reused"],
      ["đẳng thức là GOOD", "equality is GOOD"],
      ["gcd bỏ từng tọa độ cho mọi phép gán SAT", "every omitted-coordinate gcd for every SAT assignment"],
      ["không phải phản ví dụ LRC liên tục", "not a continuous-time LRC counterexample"],
      ["không chuẩn hóa theo đơn vị tại level hữu hạn", "no finite-level unit canonicalization"],
      ["số đếm/hash riêng không chứng minh tính đầy đủ", "Counts or hashes alone do not prove completeness"],
    ]) expect(html.toLowerCase()).toContain(pair[locale === "vi" ? 0 : 1].toLowerCase());
    expect(html).not.toContain("katex-error"); expect(html).not.toContain("Invalid or unsupported TeX");
  });
  it.each(["vi", "en"])("labels retained-summary trust and the next whole terminal/non-comparable-level obligation in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY");
    expect(html).toContain("EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_ROW");
    expect(html).toContain(locale === "vi" ? "GET chỉ đối chiếu summary local đã pin, không phải phát lại toán mới" : "GET checks only the pinned local summary, not a fresh mathematical replay");
    expect(html).toContain(locale === "vi" ? "không là xác nhận bên ngoài, chứng minh hình thức hay phát lại mới tầng057" : "not external attestation, formal proof or a fresh stage057 replay");
    expect(html).toContain(locale === "vi" ? "toàn bộ fiber level14 của cả hai tổ tiên" : "whole level14 fibers of both ancestors");
    expect(html).toContain(locale === "vi" ? "Level14 không chia level32" : "Level14 does not divide level32");
    expect(html).toContain(locale === "vi" ? "chưa tái lập độc lập" : "not independently reproduced");
    expect(html).not.toContain("18.829");
  });
  it.each(["vi", "en"])("fails closed for absent, corrupt and rehashed promoted summaries in %s", (locale) => {
    const wrongCounts = rehash({ ...retainedCascade, counts: { ...retainedCascade.counts, roots: 582760 } });
    const promoted = rehash({ ...retainedCascade, remaining: { ...retainedCascade.remaining, fullPrime: "ESTABLISHED" } });
    for (const raw of [null, undefined, {}, { ...retainedCascade, receipt: null }, wrongCounts, promoted]) {
      const html = renderToStaticMarkup(createElement(MathLrcP83CascadePanel, { raw, locale }));
      expect(html).toContain('role="alert"');
      expect(html).not.toContain("461780"); expect(html).not.toContain("2330389"); expect(html).not.toContain(retainedCascade.reportDigest);
      expect(html).not.toContain(locale === "vi" ? "hoàn tất cascade nhị phân" : "binary cascade complete");
      expect(html).not.toContain("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY");
    }
  });
  it("uses only two native disclosures and restrained responsive server-rendered tokens", () => {
    const source = readFileSync("src/components/research/math-lrc-p83-cascade-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "flex-wrap", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect((html.match(/<details/g) ?? [])).toHaveLength(2); expect(html).not.toContain("<form"); expect(html).not.toContain("<button"); expect(html).not.toContain("<h4");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML"); expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(html).toContain("math-tex-inline"); expect(html).not.toContain("katex-error");
  });
  it("neither fetches nor imports forests, datasets, reconstruction or replay on passive render", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("binary cascade complete"); expect(fetch).not.toHaveBeenCalled(); } finally { fetch.mockRestore(); }
    const source = readFileSync("src/components/research/math-lrc-p83-cascade-panel.tsx", "utf8"), parent = readFileSync("src/components/research/math-lrc-proof-panel.tsx", "utf8");
    expect(parent).toContain('import retainedP83Cascade from "../../../docs/research/lrc-allikvere-v2/retained-p83-cascade.json"');
    expect(source + parent).not.toMatch(/\b(?:from|import)\s*[^\n]*\.bin["']/);
    for (const token of ["node:fs", "node:child_process", "cascade-replay", "reconstructP83", "validateRetainedP83GenerationReport"]) expect(source).not.toContain(token);
    expect(source).not.toMatch(/\bfetch\s*\(/);
  });
  it("bounds passive summary validation to its immutable identity without semantic forest work", () => {
    const source = readFileSync("src/modules/research-sandbox/math-lrc-p83-cascade.ts", "utf8");
    const validator = source.slice(source.indexOf("export function validateRetainedP83CascadeReport"));
    expect(validator).toContain("P83_CASCADE_RETAINED_SHA256"); expect(validator).toContain("P83_CASCADE_LIMITS.summaryBytes");
    for (const token of ["reconstructP83CascadeEvidence", "inspectP83CascadeEvidence", "validateP83CascadeEvidence", "P83_CASCADE_PATHS", "node:fs", "node:child_process"]) expect(validator).not.toContain(token);
  });
  it.each(["vi", "en"])("follows immutable057 immediately and preserves all23 OPEN application obligations in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const plan = buildAllikvereProofPlan();
    expect(plan.targets.reduce((sum, target) => sum + target.dependencies.length, 0)).toBe(23);
    expect(plan.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(html.indexOf('id="allikvere-p83-cascade"')).toBeGreaterThan(html.indexOf('id="allikvere-p83-generation"'));
    expect(html.indexOf('id="allikvere-p83-cascade"')).toBeLessThan(html.indexOf('id="allikvere-properness"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
