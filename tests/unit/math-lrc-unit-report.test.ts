import { execFile, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { MathLrcUnitPanel } from "@/components/research/math-lrc-unit-panel";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { deriveLrcUnitActionPlan } from "@/modules/research-sandbox/math-lrc-unit-action";
import { runLrcUnitActionEvidence } from "@/modules/research-sandbox/math-lrc-unit-replay";
import { ALLIKVERE_UNIT_REPORT_METHOD, ALLIKVERE_UNIT_CONTRACT_DIGEST, ALLIKVERE_UNIT_SOURCES,
  allikvereUnitReportDigest, validateRetainedAllikvereUnitReport, type AllikvereUnitReport } from "@/modules/research-sandbox/math-lrc-unit-report";

vi.mock("node:child_process", async (original) => {
  const actual = await original<typeof import("node:child_process")>();
  return { ...actual, execFile: vi.fn(actual.execFile) };
});
const baseBytes = readFileSync(ALLIKVERE_UNIT_SOURCES.basePath, "utf8");
const frontierBytes = readFileSync(ALLIKVERE_UNIT_SOURCES.frontierPath, "utf8");
const base: unknown = JSON.parse(baseBytes), frontier: unknown = JSON.parse(frontierBytes);
let fixture: AllikvereUnitReport;
const reseal = (raw: AllikvereUnitReport) => ({ ...raw, reportDigest: allikvereUnitReportDigest(raw) });
beforeAll(async () => {
  // One genuine fixed-source replay fixture, no collector/write or new search.
  const plan = deriveLrcUnitActionPlan(base, frontier);
  const evidence = await runLrcUnitActionEvidence(base, frontier, plan);
  const body = { version: 1 as const, method: ALLIKVERE_UNIT_REPORT_METHOD, status: evidence.primary.status,
    researchClassification: "PARTIAL" as const, generatedAt: "2026-10-03T00:00:00.000Z",
    contractDigest: ALLIKVERE_UNIT_CONTRACT_DIGEST, baseReportRawSha256: ALLIKVERE_UNIT_SOURCES.baseRawSha256,
    baseReportDigest: ALLIKVERE_UNIT_SOURCES.baseReportDigest, frontierReportRawSha256: ALLIKVERE_UNIT_SOURCES.frontierRawSha256,
    frontierReportDigest: ALLIKVERE_UNIT_SOURCES.frontierReportDigest, sourceManifestDigest: ALLIKVERE_SOURCE_DIGEST,
    loopKind: "LOCAL_COMPUTATIONAL_PROOF_REUSE" as const,
    phases: ["DERIVE", "TRANSPORT", "INDEPENDENT_REPLAY", "UNION", "STOP"] as ["DERIVE", "TRANSPORT", "INDEPENDENT_REPLAY", "UNION", "STOP"],
    archiveWholeVerified: false as const, globalVerdict: "NOT_ESTABLISHED" as const,
    lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const, uncoveredObligations: [...ALLIKVERE_GLOBAL_GAPS], evidence };
  fixture = { ...body, reportDigest: allikvereUnitReportDigest(body) };
}, 120000);

describe("unit-action union product authority", () => {
  it("actually replayed once and pins both old sources, fixed four parents and six actions", () => {
    expect(vi.mocked(execFile)).toHaveBeenCalledTimes(1);
    expect(sha256(baseBytes)).toBe(ALLIKVERE_UNIT_SOURCES.baseRawSha256);
    expect(sha256(frontierBytes)).toBe(ALLIKVERE_UNIT_SOURCES.frontierRawSha256);
    expect(fixture.evidence.plan.units).toEqual([{ t: 0, s: 1 }, { t: 2, s: 797 }, { t: 3, s: 1195 },
      { t: 4, s: 1593 }, { t: 5, s: 1991 }, { t: 6, s: 2389 }]);
    expect(fixture.evidence.plan.rows.map((r) => r.parentId)).toEqual(["p199-tight-terminal-0-full", "p199-tight-terminal-1-full", "p199-tight-terminal-2-full", "p199-gw-terminal-0-full"]);
    expect(fixture.evidence.primary.rows.reduce((sum, r) => sum + r.candidateIntervals, 0)).toBe(528246);
  });
  it("admits genuine retained arithmetic while keeping research/global gates separate", () => {
    const retained = validateRetainedAllikvereUnitReport(fixture, base, frontier);
    expect(retained?.status).toBe("PARTIAL"); expect(retained?.researchClassification).toBe("PARTIAL");
    expect(retained?.uncoveredObligations).toEqual([...ALLIKVERE_GLOBAL_GAPS]);
    for (const row of retained!.evidence.primary.rows) {
      expect(BigInt(row.unionWitnessTuples) + BigInt(row.remainingTuples)).toBe(BigInt(row.totalTuples));
      expect(BigInt(row.unionWitnessTuples)).toBeGreaterThanOrEqual(BigInt(row.originalWitnessTuples));
      expect(BigInt(row.overlapTuples)).toBe(BigInt(row.rawTransportTuples) - BigInt(row.unionWitnessTuples));
    }
  }, 60000);
  it.each([
    ["global theorem", (r: AllikvereUnitReport) => { (r as unknown as { globalVerdict: string }).globalVerdict = "PROVED"; }],
    ["research promotion", (r: AllikvereUnitReport) => { (r as unknown as { researchClassification: string }).researchClassification = "COMPLETE"; }],
    ["partial outer status promotion", (r: AllikvereUnitReport) => { r.status = "COMPLETE"; }],
    ["whole archive", (r: AllikvereUnitReport) => { (r as unknown as { archiveWholeVerified: boolean }).archiveWholeVerified = true; }],
    ["missing obligation", (r: AllikvereUnitReport) => { r.uncoveredObligations.pop(); }],
    ["base raw drift", (r: AllikvereUnitReport) => { r.baseReportRawSha256 = "a".repeat(64); }],
    ["frontier raw drift", (r: AllikvereUnitReport) => { r.frontierReportRawSha256 = "a".repeat(64); }],
    ["cross-source report", (r: AllikvereUnitReport) => { r.frontierReportDigest = "a".repeat(64); }],
    ["contract drift", (r: AllikvereUnitReport) => { r.contractDigest = "a".repeat(64); }],
    ["author drift", (r: AllikvereUnitReport) => { r.sourceManifestDigest = "a".repeat(64); }],
    ["lower premise promotion", (r: AllikvereUnitReport) => { (r as unknown as { lowerDependency: string }).lowerDependency = "PROVED"; }],
    ["LLM campaign", (r: AllikvereUnitReport) => { (r as unknown as { loopKind: string }).loopKind = "LLM_CAMPAIGN"; }],
    ["missing stop", (r: AllikvereUnitReport) => { (r.phases as string[]).pop(); }],
  ] as const)("rejects fully outer-rehashed %s", (_label, mutate) => {
    const raw = structuredClone(fixture); mutate(raw);
    expect(validateRetainedAllikvereUnitReport(reseal(raw), base, frontier)).toBeNull();
  });
  it("retained admission executes no process or external research fetch", () => {
    const execute = vi.mocked(execFile); execute.mockClear(); const fetch = vi.spyOn(globalThis, "fetch");
    try {
      expect(validateRetainedAllikvereUnitReport(fixture, base, frontier)).not.toBeNull();
      expect(execute).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled();
    } finally { fetch.mockRestore(); }
  }, 60000);
  it("rejects expired/tighter invalid budgets before accepting any stored count", () => {
    expect(validateRetainedAllikvereUnitReport(fixture, base, frontier, { timeoutMs: 0 })).toBeNull();
    for (const timeoutMs of [NaN, Infinity, -1, 60001]) expect(validateRetainedAllikvereUnitReport(fixture, base, frontier, { timeoutMs })).toBeNull();
    let calls = 0; const clock = vi.spyOn(performance, "now").mockImplementation(() => calls++ === 0 ? 0 : 60001);
    try { expect(validateRetainedAllikvereUnitReport(fixture, base, frontier)).toBeNull(); } finally { clock.mockRestore(); }
  });
  it("renders bilingual proof reuse, exact interval semantics and no dispatch controls", () => {
    for (const locale of ["vi", "en"]) {
      const html = renderToStaticMarkup(createElement(MathLrcUnitPanel, { raw: fixture, base, frontier, locale }));
      expect(html).toContain("PARTIAL"); expect(html).toContain("scroll-mt-24"); expect(html).toContain(fixture.reportDigest);
      expect(html).toContain(locale === "vi" ? "không nhân số đếm với 6" : "not counted by multiplying by 6");
      expect(html).toContain(locale === "vi" ? "không phải chiến dịch LLM" : "not an LLM campaign");
      expect(html).toContain(locale === "vi" ? "không thay cho toàn bộ phần bù" : "do not replace the complete complement");
      expect(html).toContain("katex"); expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    }
    const invalid = renderToStaticMarkup(createElement(MathLrcUnitPanel, { raw: {}, base, frontier, locale: "en" }));
    expect(invalid).toContain("unavailable or invalid"); expect(invalid).toContain("scroll-mt-24");
  }, 120000);
  it("rejects production and extra collector switches before replacing reports", () => {
    const run = (args: string[], nodeEnv: "test" | "production") => execFileSync(process.execPath,
      ["--import", "tsx", "scripts/operations/allikvere-unit-audit.ts", ...args],
      { env: { ...process.env, NODE_ENV: nodeEnv }, encoding: "utf8", timeout: 5000, maxBuffer: 65536 });
    expect(() => run(["--write", "--expand"], "test")).toThrow(); expect(() => run(["--write"], "production")).toThrow();
    expect(sha256(readFileSync(ALLIKVERE_UNIT_SOURCES.basePath, "utf8"))).toBe(ALLIKVERE_UNIT_SOURCES.baseRawSha256);
    expect(sha256(readFileSync(ALLIKVERE_UNIT_SOURCES.frontierPath, "utf8"))).toBe(ALLIKVERE_UNIT_SOURCES.frontierRawSha256);
  });
  it("keeps canonical report hashing distinct from execution attestation", () => {
    const { reportDigest, ...body } = fixture; expect(sha256(canonicalJson(body))).toBe(reportDigest);
    expect(vi.isMockFunction(validateRetainedAllikvereUnitReport)).toBe(false);
  });
  it("admits the actual Main-retained artifact and isolates unit view from old/ES execution", () => {
    const raw = JSON.parse(readFileSync("docs/research/lrc-allikvere-p199/retained-unit-report.json", "utf8"));
    const report = validateRetainedAllikvereUnitReport(raw, base, frontier);
    expect(report?.status).toBe("PARTIAL"); expect(report?.reportDigest).toBe("b155a25e6a6579ff2c5c74ed2d08285c60b0e7cad6142cd3cc25e36cc7cc0357");
    expect(report?.evidence.primary.rows.every((row) => row.status === "PARTIAL")).toBe(true);
    const source = readFileSync("src/app/w/[workspaceSlug]/research/math-tools/page.tsx", "utf8");
    expect(source).toContain('const oldRetainedView = query.view === "allikvere"');
    expect(source).toContain('const unitRetainedView = query.view === "allikvere-unit"');
    expect(source).toContain("const retainedOnly = oldRetainedView || unitRetainedView");
    expect(source).toContain('if (!retainedOnly) try { scope = parseDivisorLabQuery(query)');
    expect(source).toContain("{unitRetainedView && <MathLrcUnitPanel raw={allikvereUnitReport} base={allikvereCoverReport} frontier={allikvereFrontierReport} locale={locale} />}");
    expect(source).toContain("{oldRetainedView && <MathLrcFrontierPanel");
    expect(source).toContain("{oldRetainedView && <MathLrcCoverPanel");
    expect(source).toContain("{oldRetainedView && <MathAllikvereReportPanel");
    expect(source).toContain("?view=allikvere-unit#allikvere-unit");
  }, 60000);
});
