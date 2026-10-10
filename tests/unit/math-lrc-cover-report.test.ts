import { execFileSync } from "node:child_process";
import childProcess from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { MathLrcCoverPanel } from "@/components/research/math-lrc-cover-panel";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST, allikvereImportedScopes } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { ALLIKVERE_COVER_METHOD, ALLIKVERE_COVER_CONTRACT_DIGEST, allikvereCoverScopes,
  allikvereCoverReportDigest, validateRetainedAllikvereCoverReport, type AllikvereCoverReport } from "@/modules/research-sandbox/math-lrc-cover-report";
import { runLrcCoverEvidence } from "@/modules/research-sandbox/math-lrc-cover-replay";

let partial: AllikvereCoverReport;
const reseal = (value: AllikvereCoverReport) => ({ ...value, reportDigest: allikvereCoverReportDigest(value) });
beforeAll(async () => {
  const rows = [];
  // Genuine Python-replayed unresolved partitions, not fabricated envelopes.
  // This tight fixture does not execute the eight default producer campaigns.
  for (const descriptor of allikvereCoverScopes()) rows.push({ ...descriptor,
    evidence: await runLrcCoverEvidence(descriptor.scope, descriptor.rootContractDigest, { maxNodes: 1 }) });
  const body = { version: 1 as const, method: ALLIKVERE_COVER_METHOD, status: "PARTIAL" as const,
    generatedAt: "2026-10-03T00:00:00.000Z", contractDigest: ALLIKVERE_COVER_CONTRACT_DIGEST,
    sourceManifestDigest: ALLIKVERE_SOURCE_DIGEST, archiveWholeVerified: false as const,
    globalVerdict: "NOT_ESTABLISHED" as const, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const,
    uncoveredObligations: [...ALLIKVERE_GLOBAL_GAPS], rows };
  partial = { ...body, reportDigest: allikvereCoverReportDigest(body) };
}, 30000);

describe("separate compact-cover retained product boundary", () => {
  it("binds eight exact ordered domains to author/source/new contract, without modifying old shards", () => {
    const old = allikvereImportedScopes().filter((row) => row.kind === "TERMINAL_SHARD");
    const rows = allikvereCoverScopes();
    expect(rows.map((r) => r.kind)).toEqual(["ANCHORED", "ANCHORED", "ANCHORED", "ANCHORED", "FULL", "FULL", "FULL", "FULL"]);
    for (const [index, row] of rows.entries()) {
      const parent = old[index % 4];
      expect(row.scope.parentResidues).toEqual(parent.scope.parentResidues);
      expect(row.scope.sourceDigest).toBe(parent.scope.sourceDigest);
      expect(row.sourceShardRootDigest).toBe(parent.rootContractDigest);
      expect(row.rootContractDigest).not.toBe(parent.rootContractDigest);
      expect(row.scope.digitAxes.reduce((n, axis) => n * BigInt(axis.length), BigInt(1)).toString())
        .toBe(index < 4 ? "5764801" : "96889010407");
      expect(row.scope.digitAxes.slice(0, 5)).toEqual(index < 4
        ? parent.authorTerminalPrefix!.slice(0, 5).map((d) => [d]) : Array.from({ length: 5 }, () => [0, 1, 2, 3, 4, 5, 6]));
    }
    expect(old.every((r) => r.scope.digitAxes.slice(0, 11).every((a) => a.length === 1))).toBe(true);
  });
  it("accepts valid PARTIAL partitions with exact decimal cardinalities, never closure or agent authority", () => {
    const report = validateRetainedAllikvereCoverReport(partial);
    expect(report?.status).toBe("PARTIAL");
    expect(report?.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(report?.uncoveredObligations).toEqual([...ALLIKVERE_GLOBAL_GAPS]);
    expect(report?.rows.every((row) => row.evidence.primary.unresolvedTuples === row.evidence.primary.totalTuples)).toBe(true);
  });
  it.each([
    ["global theorem", (r: AllikvereCoverReport) => { (r as unknown as { globalVerdict: string }).globalVerdict = "PROVED"; }],
    ["whole ZIP trust", (r: AllikvereCoverReport) => { (r as unknown as { archiveWholeVerified: boolean }).archiveWholeVerified = true; }],
    ["missing global gap", (r: AllikvereCoverReport) => { r.uncoveredObligations.pop(); }],
    ["partial promoted", (r: AllikvereCoverReport) => { r.status = "COMPLETE"; }],
    ["old contract substitution", (r: AllikvereCoverReport) => { r.contractDigest = r.rows[0].sourceShardRootDigest; }],
    ["source substitution", (r: AllikvereCoverReport) => { r.sourceManifestDigest = "a".repeat(64); }],
    ["prefix narrowing", (r: AllikvereCoverReport) => { r.rows[0].scope.digitAxes[5] = [0]; }],
    ["full domain narrowing", (r: AllikvereCoverReport) => { r.rows[4].scope.digitAxes[0] = [0]; }],
    ["coordinate permutation", (r: AllikvereCoverReport) => { r.rows[0].scope.parentResidues.reverse(); }],
    ["author prefix drift", (r: AllikvereCoverReport) => { r.rows[0].authorTerminalDigits[0] = (r.rows[0].authorTerminalDigits[0] + 1) % 7; }],
    ["row duplication", (r: AllikvereCoverReport) => { r.rows[7] = structuredClone(r.rows[6]); }],
    ["missing eighth domain", (r: AllikvereCoverReport) => { r.rows.pop(); }],
    ["Python source drift", (r: AllikvereCoverReport) => { r.rows[0].evidence.independent.scriptDigest = "a".repeat(64); }],
    ["count narrowing", (r: AllikvereCoverReport) => { r.rows[0].evidence.primary.totalTuples = "49"; }],
  ] as const)("rejects report-rehashed %s", (_name, mutate) => {
    const value = structuredClone(partial); mutate(value);
    expect(validateRetainedAllikvereCoverReport(reseal(value))).toBeNull();
  });
  it("pure GET admission never calls child execution, producer or a research fetch", () => {
    const execute = vi.spyOn(childProcess, "execFile");
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(validateRetainedAllikvereCoverReport(partial)).not.toBeNull(); expect(execute).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled(); }
    finally { execute.mockRestore(); fetch.mockRestore(); }
  });
  it("fails closed when the aggregate retained observation budget expires", () => {
    let reads = 0;
    const clock = vi.spyOn(performance, "now").mockImplementation(() => reads++ === 0 ? 0 : 10001);
    try { expect(validateRetainedAllikvereCoverReport(partial)).toBeNull(); } finally { clock.mockRestore(); }
  });
  it("renders bilingual conditional PARTIAL scope and eight domains without dispatch controls", () => {
    for (const locale of ["vi", "en"]) {
      const html = renderToStaticMarkup(createElement(MathLrcCoverPanel, { raw: partial, locale }));
      expect(html).toContain("PARTIAL"); expect(html).toContain("scroll-mt-24");
      expect(html).toContain(partial.reportDigest); expect(html).toContain(locale === "vi" ? "96.889.010.407" : "96,889,010,407");
      expect(html).toContain(locale === "vi" ? "không cộng hai nhóm" : "do not add the two groups");
      expect(html).toContain(locale === "vi" ? "có điều kiện" : "Conditional gcd");
      expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    }
    const invalid = renderToStaticMarkup(createElement(MathLrcCoverPanel, { raw: {}, locale: "en" }));
    expect(invalid).toContain("unavailable or invalid"); expect(invalid).toContain("scroll-mt-24");
  });
  it("rejects unapproved CLI switches and production before generating or writing", () => {
    const run = (args: string[], nodeEnv: "test" | "production") => execFileSync(process.execPath,
      ["--import", "tsx", "scripts/operations/allikvere-cover-audit.ts", ...args],
      { env: { ...process.env, NODE_ENV: nodeEnv }, encoding: "utf8", timeout: 5000, maxBuffer: 65536 });
    expect(() => run(["--write", "--raise-budget"], "test")).toThrow();
    expect(() => run(["--write"], "production")).toThrow();
  });
  it("purely admits the actual eight-domain retained artifact without promoting full PARTIAL roots", () => {
    const raw = JSON.parse(readFileSync("docs/research/lrc-allikvere-p199/retained-cover-report.json", "utf8"));
    const report = validateRetainedAllikvereCoverReport(raw);
    expect(report?.status).toBe("PARTIAL");
    expect(report?.rows.slice(0, 4).every((r) => r.evidence.primary.status === "COMPLETE")).toBe(true);
    expect(report?.rows.slice(4).every((r) => r.evidence.primary.status === "PARTIAL" && BigInt(r.evidence.primary.unresolvedTuples) > BigInt(0))).toBe(true);
    expect(report?.globalVerdict).toBe("NOT_ESTABLISHED");
    const source = readFileSync("src/app/w/[workspaceSlug]/research/math-tools/page.tsx", "utf8");
    expect(source).toContain("{oldRetainedView && <MathLrcCoverPanel raw={allikvereCoverReport} locale={locale} />}");
    expect(source).toContain("?view=allikvere#allikvere-cover");
    expect(source).toContain("{oldRetainedView && <MathAllikvereReportPanel raw={allikvereReport} locale={locale} />}");
    expect(source).toContain('if (!retainedOnly) try { scope = parseDivisorLabQuery(query)');
  }, 15000);
});
