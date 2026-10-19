import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import retained from "../../docs/research/lrc-allikvere-p199/retained-report.json";
import rootReadme from "../../docs/research/lrc-allikvere-p199/author-root-readme.json";
import { MathAllikvereReportPanel } from "@/components/research/math-lrc-allikvere-panel";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST, allikvereImportedScopes, allikvereReportDigest,
  importedAllikvereLogs, sameAllikvereResidueSets, validateRetainedAllikvereReport } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

const reseal = (raw: unknown) => {
  const value = raw as Record<string, unknown>;
  value.reportDigest = allikvereReportDigest(value as never); return value;
};
describe("inert Allikvere author import and retained report", () => {
  it("binds exact CRLF author bytes and archived prime-layout attribution, never global archive verification", () => {
    const logs = importedAllikvereLogs();
    expect(logs.map((l) => l.rows.length)).toEqual([1, 3]);
    expect(logs[0].sourceDigest).toBe("9a441e4a96750c519a53c8708292e816cb302eb1201f499882ba17e7cf6e9297");
    expect(logs[1].sourceDigest).toBe("946ba9d5cb77db00bf52aa7831beef3fc12acb7136095601550b074687b24a18");
    const readme = Buffer.from(rootReadme.bytesBase64, "base64");
    expect(sha256(readme.toString("utf8"))).toBe(rootReadme.sha256);
    expect(readme.toString("utf8")).toContain("For p = 199");
    expect(rootReadme.primeBinding).toBe("ARCHIVED_AUTHOR_LAYOUT_ASSERTION_ONLY");
    expect(retained.archiveWholeVerified).toBe(false);
  });
  it("retains two complete binary domains and four 49-point shards, not author aggregate closure", () => {
    const scopes = allikvereImportedScopes();
    expect(scopes).toHaveLength(6);
    expect(scopes.map((r) => r.scope.digitAxes.reduce((n, a) => n * a.length, 1))).toEqual([8192, 8192, 49, 49, 49, 49]);
    expect(scopes.slice(2).every((r) => r.scope.digitAxes.slice(0, 11).every((a) => a.length === 1))).toBe(true);
    expect(scopes[0].scope.parentResidues).toEqual(Array.from({ length: 13 }, (_, i) => i + 1));
    expect(scopes[1].scope.parentResidues).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 24]);
    expect(scopes.every((s) => s.scope.lowerDependency === "LOWER_LRC_12_DECLARED_NOT_REPLAYED")).toBe(true);
  });
  it("purely consumes all six retained certificates and preserves the author survivor sets", () => {
    const value = validateRetainedAllikvereReport(retained);
    expect(value).not.toBeNull();
    expect(value!.sourceManifestDigest).toBe(ALLIKVERE_SOURCE_DIGEST);
    expect(value!.rows.map((r) => r.evidence.primary.survivorTuples)).toEqual([3, 1, 0, 0, 0, 0]);
    for (const row of value!.rows) {
      const p = row.evidence.primary;
      expect(p.classifiedTuples).toBe(p.totalTuples);
      expect(p.witnessTuples + p.gcdTuples + p.survivorTuples).toBe(p.totalTuples);
      expect(p.unresolvedTuples).toBe(0);
      if (row.kind === "BINARY_FIBER") expect(sameAllikvereResidueSets(p.survivors.map((s) => s.residues), row.authorSurvivors)).toBe(true);
    }
  });
  it("independently exhausts every archived terminal point and all omit-one gcd clauses", () => {
    const gcd = (a: number, b: number): number => { while (b) [a, b] = [b, a % b]; return a; };
    for (const row of allikvereImportedScopes().slice(2)) {
      const M = row.scope.targetLevel * row.scope.prime;
      const point = row.scope.parentResidues.map((r, axis) => (r + row.scope.parentLevel * row.scope.prime * row.authorTerminalPrefix![axis]) % M);
      let witnesses = 0;
      for (let j = 0; j < M; j++) if (point.every((v) => {
        const r = v * j % M; return Math.min(r, M - r) * 14 >= M;
      })) witnesses++;
      expect(witnesses).toBe(0);
      for (let omit = 0; omit < 13; omit++) expect(point.filter((_, axis) => axis !== omit).reduce(gcd, 14)).toBe(7);
    }
  });
  it.each([
    ["global theorem", (r: typeof retained) => { (r as unknown as { globalVerdict: string }).globalVerdict = "PROVED"; }],
    ["whole archive trust", (r: typeof retained) => { (r as unknown as { archiveWholeVerified: boolean }).archiveWholeVerified = true; }],
    ["missing obligations", (r: typeof retained) => { r.uncoveredObligations.pop(); }],
    ["wrong ordered scope", (r: typeof retained) => { r.rows[0].scope.parentResidues.reverse(); }],
    ["cross-root", (r: typeof retained) => { r.rows[0].rootContractDigest = "a".repeat(64); }],
    ["wrong imported source", (r: typeof retained) => { r.sourceManifestDigest = "a".repeat(64); }],
    ["author survivor narrowing", (r: typeof retained) => { r.rows[0].authorSurvivors.pop(); }],
    ["duplicate row", (r: typeof retained) => { r.rows[5] = structuredClone(r.rows[4]); }],
    ["full terminal expansion", (r: typeof retained) => { r.rows[2].scope.digitAxes[0] = [0, 1, 2, 3, 4, 5, 6]; }],
    ["false author matching", (r: typeof retained) => { r.rows[0].authorSurvivorListMatched = false; }],
    ["Python drift", (r: typeof retained) => { r.rows[0].evidence.independent.scriptDigest = "a".repeat(64); }],
    ["missing classification", (r: typeof retained) => { r.rows[0].evidence.primary.unresolvedTuples = 1; }],
  ] as const)("rejects fully report-rehashed %s corruption", (_name, mutate) => {
    const value = structuredClone(retained); mutate(value);
    expect(validateRetainedAllikvereReport(reseal(value))).toBeNull();
  });
  it("refuses JSONB-style narrowing and keeps exact list rather than sorting coordinate labels", () => {
    expect(sameAllikvereResidueSets([[1, 2]], [[2, 1]])).toBe(false);
    expect(sameAllikvereResidueSets([[1, 2], [3, 4]], [[3, 4], [1, 2]])).toBe(true);
    const raw = structuredClone(retained); raw.rows.pop();
    expect(validateRetainedAllikvereReport(reseal(raw))).toBeNull();
    expect(validateRetainedAllikvereReport({ ...retained, foreignProofComplete: true })).toBeNull();
    expect(retained.uncoveredObligations).toEqual([...ALLIKVERE_GLOBAL_GAPS]);
  });
  it("renders VI and EN retained-only warnings and provenance without any replay dispatch", () => {
    for (const locale of ["vi", "en"]) {
      const html = renderToStaticMarkup(createElement(MathAllikvereReportPanel, { raw: retained, locale }));
      expect(html).toContain(retained.reportDigest);
      expect(html).toContain("49"); expect(html).toContain("p = 199");
      expect(html).toContain(locale === "vi" ? "chưa thiết lập" : "NOT ESTABLISHED");
      expect(html).toContain(locale === "vi" ? "chưa phát lại" : "not replayed");
      expect(html).toContain(locale === "vi" ? "không truy nguồn nghiên cứu bên ngoài" : "external research fetches");
      expect(html).toContain(locale === "vi" ? "xác thực và tải workspace bình thường" : "Normal workspace authentication and page loading");
      expect(html).not.toContain("no subprocess, network");
      expect(html).not.toContain("không network");
      expect(html).toContain("scroll-mt-24");
      expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    }
    const invalid = renderToStaticMarkup(createElement(MathAllikvereReportPanel, { raw: {}, locale: "en" }));
    expect(invalid).toContain("unavailable or invalid");
    expect(invalid).toContain("scroll-mt-24");
  });
  it("keeps the explicit retained page path outside legacy arithmetic and Python dispatch", () => {
    const source = readFileSync("src/app/w/[workspaceSlug]/research/math-tools/page.tsx", "utf8");
    expect(source).toContain('const oldRetainedView = query.view === "allikvere"');
    expect(source).toContain('const unitRetainedView = query.view === "allikvere-unit"');
    expect(source).toContain("const retainedOnly = oldRetainedView || unitRetainedView");
    expect(source).toContain("if (!retainedOnly) try { scope = parseDivisorLabQuery(query)");
    expect(source).toContain("const replay = primary ? await replayDivisorLab(primary) : null");
    expect(source).toContain("const structuralReplay = structural ? await replayMixedCorePacket(structural) : null");
    expect(source).toContain("{!retainedOnly && <section>");
    const pilot = readFileSync("src/app/w/[workspaceSlug]/research/math-pilot/page.tsx", "utf8");
    expect(pilot).toContain("math-tools?view=allikvere#allikvere");
  });
  it("actually runs the fixed six-scope CLI independently without writing, and fails closed before replacement", () => {
    const path = "docs/research/lrc-allikvere-p199/retained-report.json";
    const before = sha256(readFileSync(path, "utf8"));
    const run = (args: string[], nodeEnv: "test" | "development" | "production" = "test") => execFileSync(process.execPath,
      ["--import", "tsx", "scripts/operations/allikvere-modular-audit.ts", ...args],
      { env: { ...process.env, NODE_ENV: nodeEnv }, encoding: "utf8", timeout: 60000, maxBuffer: 65536 });
    const output = JSON.parse(run([]));
    expect(output.status).toBe("COMPLETE"); expect(output.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(output.retained).toBe(false); expect(output.rows.map((r: { total: number }) => r.total)).toEqual([8192, 8192, 49, 49, 49, 49]);
    expect(() => run(["--write", "--accept-author-proof"])).toThrow();
    expect(() => run(["--write"], "production")).toThrow();
    expect(sha256(readFileSync(path, "utf8"))).toBe(before);
  }, 60000);
  it("does not treat canonical content hashing as external execution attestation", () => {
    const { reportDigest, ...body } = retained;
    expect(sha256(canonicalJson(body))).toBe(reportDigest);
    expect(vi.isMockFunction(validateRetainedAllikvereReport)).toBe(false);
  });
});
