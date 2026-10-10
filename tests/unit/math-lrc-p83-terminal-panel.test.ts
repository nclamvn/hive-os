import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retainedTerminal from "../../docs/research/lrc-allikvere-v2/retained-p83-terminal.json";
import retainedArithmetic from "../../docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
import { MathLrcP83TerminalPanel } from "@/components/research/math-lrc-p83-terminal-panel";
import { MathLrcProofPanel } from "@/components/research/math-lrc-proof-panel";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { buildAllikvereProofPlan } from "@/modules/research-sandbox/math-lrc-proof-plan";
import { validateRetainedP83TerminalReport } from "@/modules/research-sandbox/math-lrc-p83-terminal";

const render = (locale: string, raw: unknown = retainedTerminal) => renderToStaticMarkup(createElement(MathLrcP83TerminalPanel, { raw, locale }));
const rehash = (raw: Record<string, unknown>) => { const { reportDigest: _digest, ...body } = raw; void _digest; return { ...body, reportDigest: sha256(canonicalJson(body)) }; };

describe("compact whole p83 terminal and224 checkpoint", () => {
  it.each(["vi", "en"])("shows finite one-prime completion without promoting historical/global/lower gates in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "hoàn tất terminal và cầu nối level224" : "terminal and level224 bridge complete");
    expect(html).toContain(locale === "vi" ? "một prime thực tế" : "One actual prime");
    expect(html).toContain(locale === "vi" ? "mốc lịch sử đã đóng băng" : "frozen historical snapshots");
    expect(html).toContain(locale === "vi" ? "60 prime P13 còn lại" : "other 60 P13 primes");
    expect(html).toContain(locale === "vi" ? "23 nghĩa vụ áp dụng vẫn MỞ" : "23 application obligations remain OPEN");
    expect(html).toContain(locale === "vi" ? "chưa tái lập độc lập" : "not independently reproduced");
    expect(html).toContain("NOT_ESTABLISHED"); expect(html).not.toContain("THEOREM_PROVED"); expect(html).not.toContain("progressbar");
    expect(html).toContain("I(13,83,224)=\\varnothing"); expect(html).toContain("J(13,83)=\\varnothing");
  });
  it("projects both whole roots, exact weighted masses, all82 CRT controls and the retained receipt", () => {
    const report = validateRetainedP83TerminalReport(retainedTerminal)!;
    expect(report).not.toBeNull(); const html = render("en");
    expect(report.roots).toHaveLength(2); expect(report.bridge.crtUnits).toHaveLength(82);
    expect(report.boundary.choices).toHaveLength(7); expect(report.boundary.choices.every((choice) => !choice.bad)).toBe(true);
    expect(report.boundary.closedBadDigits).toEqual([0, 1]); expect(report.bridge.nonComparable).toBe(true);
    expect(report.bridge.crtUnits.map((unit) => unit.baseUnit)).toEqual(Array.from({ length: 82 }, (_, index) => index + 1));
    expect(report.bridge.level1WitnessBranchesIncluded).toBe(true);
    expect(report.roots.map((root) => root.ancestor)).toEqual([[1,2,3,4,5,6,7,8,9,10,11,12,13], [1,2,3,4,5,6,7,8,9,10,11,13,24]]);
    for (const root of report.roots) {
      expect(root.domainMass).toBe(96889010407); expect(root.totalMass).toBe(root.domainMass);
      expect(html).toContain(`(${root.ancestor.join(", ")}): ${root.nodes} nodes, ${root.forces} force, ${root.splits} split, ${root.conflicts} conflict, ${root.gainPrunes} gain, ${root.gcdLeaves} gcd leaves; ${root.noneRegions} NONE`);
      expect(html).toContain(`${root.gridCertifiedMass} grid-certified + ${root.gcdCertifiedMass} gcd-certified = ${root.totalMass} / ${root.domainMass}`);
      expect(html).toContain(`${root.gcdRegionGridWitnessOverlap} assignments in gcd regions also have a grid witness`);
    }
    expect(html).toContain("82 base units modulo83 are checked by exact CRT");
    expect(html).toContain(report.datasets.tree.path); expect(html).toContain(report.datasets.tree.sha256); expect(html).toContain(`${report.datasets.tree.bytes} bytes`);
    for (const pin of [report.reportDigest, report.receipt.sourceSha256, report.receipt.inputSha256, report.receipt.stdoutSha256]) expect(html).toContain(pin);
    for (const pin of [report.dependency.sha256, report.dependency.ancestorSha256, report.dependency.final32Sha256, report.dependency.generationSummarySha256, report.dependency.generationDatasetSha256]) expect(html).toContain(pin);
    expect(html).not.toContain("18.829");
  });
  it.each(["vi", "en"])("explains complete labelled domains, disjoint certificate reasons and real GOOD equality in %s", (locale) => {
    const html = render(locale);
    for (const pair of [
      ["mỗi root có 7^13=96889010407 phép gán", "each root has 7^13=96889010407 assignments"],
      ["mọi nhánh con không rỗng là bắt buộc", "Every nonempty child is mandatory"],
      ["kiểm toàn khối NONE cuối", "account for the final NONE region"],
      ["không dùng loại bằng thời gian riêng hay tính tối thiểu", "no private-time or minimality pruning is used"],
      ["không nói hai điều kiện lưới/gcd luôn loại trừ nhau", "not globally exclusive grid/gcd predicates"],
      ["số đếm/hash riêng không chứng minh tính đầy đủ", "counts or hashes alone do not prove completeness"],
      ["đều GOOD", "both GOOD"],
      ["kiểm đủ bảy digit", "All seven digits are checked"],
      ["đổi &lt; thành ≤", "replacing &lt; by ≤"],
    ]) expect(html.toLowerCase()).toContain(pair[locale === "vi" ? 0 : 1].toLowerCase());
    expect(html).not.toContain("katex-error"); expect(html).not.toContain("Invalid or unsupported TeX");
  });
  it.each(["vi", "en"])("separates whole224 inference, all baseunit images and passive unsigned trust in %s", (locale) => {
    const html = render(locale);
    expect(html).toContain(locale === "vi" ? "Level14 không chia level32 và ngược lại" : "Neither level14 nor level32 divides the other");
    expect(html).toContain(locale === "vi" ? "Bao gồm cả nhánh có nhân chứng level1" : "Level-one witness branches");
    expect(html).toContain(locale === "vi" ? "mọi ảnh đơn vị/dấu/hoán vị" : "every unit/sign/permutation image");
    expect(html).toContain(locale === "vi" ? "không phải chứng chỉ proof assistant" : "not a proof-assistant certificate");
    expect(html).toContain("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY"); expect(html).toContain("EXPLICIT_OFFLINE_FULL_TREE_AND_EVERY_MASS");
    expect(html).toContain(locale === "vi" ? "GET chỉ đối chiếu summary local đã pin, không phải phát lại toán mới" : "GET checks only the pinned local summary, not a fresh mathematical replay");
    expect(html).toContain(locale === "vi" ? "không là xác nhận bên ngoài, chứng minh hình thức hoặc phát lại mới057/058" : "not external attestation, formal proof or a fresh057/058 replay");
  });
  it.each(["vi", "en"])("fails closed for absent, corrupt, rehashed mass changes and global promotions in %s", (locale) => {
    const wrongMass = rehash({ ...retainedTerminal, roots: retainedTerminal.roots.map((root, index) => index ? root : { ...root, totalMass: 96889010406 }) });
    const promoted = rehash({ ...retainedTerminal, remaining: { ...retainedTerminal.remaining, global: "ESTABLISHED" } });
    for (const raw of [null, undefined, {}, { ...retainedTerminal, receipt: null }, wrongMass, promoted]) {
      const html = renderToStaticMarkup(createElement(MathLrcP83TerminalPanel, { raw, locale }));
      expect(html).toContain('role="alert"'); expect(html).not.toContain("96889010407"); expect(html).not.toContain(retainedTerminal.reportDigest);
      expect(html).not.toContain("I(13,83,224)"); expect(html).not.toContain("J(13,83)");
      expect(html).not.toContain(locale === "vi" ? "hoàn tất terminal" : "terminal and level224 bridge complete");
      expect(html).not.toContain("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY");
    }
  });
  it("uses two native disclosures and bounded safe math with responsive server tokens", () => {
    const source = readFileSync("src/components/research/math-lrc-p83-terminal-panel.tsx", "utf8"), html = render("en");
    for (const token of ["min-w-0", "max-w-[76ch]", "[overflow-wrap:anywhere]", "min-h-10", "border-line", "text-ink-muted"]) expect(html).toContain(token);
    expect((html.match(/<details/g) ?? [])).toHaveLength(2); expect(html).not.toContain("<form"); expect(html).not.toContain("<button"); expect(html).not.toContain("<h4");
    expect(source).not.toContain('"use client"'); expect(source).not.toContain("dangerouslySetInnerHTML"); expect(source).not.toMatch(/#[0-9a-f]{6}/i); expect(source).not.toContain("—");
    expect(html).toContain("math-tex-inline"); expect(html).not.toContain("katex-error");
    expect(html).toContain("∅"); expect(html).not.toContain("katex-newline");
    expect(html).toContain('<annotation encoding="application/x-tex">\\operatorname{lcm}(14,32)=224</annotation>');
  });
  it("does not fetch, import binary evidence or dispatch semantic old/replay code on GET", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(render("en")).toContain("terminal and level224 bridge complete"); expect(fetch).not.toHaveBeenCalled(); } finally { fetch.mockRestore(); }
    const source = readFileSync("src/components/research/math-lrc-p83-terminal-panel.tsx", "utf8"), parent = readFileSync("src/components/research/math-lrc-proof-panel.tsx", "utf8");
    expect(parent).toContain('import retainedP83Terminal from "../../../docs/research/lrc-allikvere-v2/retained-p83-terminal.json"');
    expect(source + parent).not.toMatch(/\b(?:from|import)\s*[^\n]*\.bin["']/);
    for (const token of ["node:fs", "node:child_process", "terminal-replay", "reconstructP83", "validateRetainedP83CascadeReport", "validateRetainedP83GenerationReport"]) expect(source).not.toContain(token);
    expect(source).not.toMatch(/\bfetch\s*\(/);
  });
  it("passive summary validation is bounded pin identity, not a full terminal mathematical walk", () => {
    const source = readFileSync("src/modules/research-sandbox/math-lrc-p83-terminal.ts", "utf8");
    const validator = source.slice(source.indexOf("export function validateRetainedP83TerminalReport"));
    expect(validator).toContain("P83_TERMINAL_RETAINED_SHA256"); expect(validator).toContain("P83_TERMINAL_LIMITS.summaryBytes");
    for (const token of ["reconstructP83TerminalEvidence", "inspectP83TerminalEvidence", "validateP83TerminalEvidence", "P83_TERMINAL_PATHS", "node:fs", "node:child_process"]) expect(validator).not.toContain(token);
  });
  it.each(["vi", "en"])("follows immutable058 and preserves all23 OPEN obligations in %s", (locale) => {
    const html = renderToStaticMarkup(createElement(MathLrcProofPanel, { raw: retainedArithmetic, base: "/w/lab/research/math-tools", locale }));
    const plan = buildAllikvereProofPlan();
    expect(plan.targets.reduce((sum, target) => sum + target.dependencies.length, 0)).toBe(23);
    expect(plan.targets.every((target) => target.dependencies.every((dependency) => dependency.status === "OPEN"))).toBe(true);
    expect((html.match(locale === "vi" ? />Mở</g : />OPEN</g) ?? []).length).toBe(23);
    expect(html.indexOf('id="allikvere-p83-terminal"')).toBeGreaterThan(html.indexOf('id="allikvere-p83-cascade"'));
    expect(html.indexOf('id="allikvere-p83-terminal"')).toBeLessThan(html.indexOf('id="allikvere-properness"'));
    expect(html).toContain("SELECTED_PENDING_FULL_REVIEW");
  });
});
