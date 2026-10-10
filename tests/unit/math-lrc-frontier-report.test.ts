import { execFile, execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { MathLrcFrontierPanel } from "@/components/research/math-lrc-frontier-panel";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST } from "@/modules/research-sandbox/math-lrc-allikvere-report";
import { LRC_FRONTIER_BASE, LRC_FRONTIER_METHOD, selectResumePlan, lrcFrontierPacketDigest } from "@/modules/research-sandbox/math-lrc-frontier";
import { runLrcCoverEvidence } from "@/modules/research-sandbox/math-lrc-cover-replay";
import { runLrcFrontierEvidence } from "@/modules/research-sandbox/math-lrc-frontier-replay";
import { ALLIKVERE_FRONTIER_REPORT_METHOD, ALLIKVERE_FRONTIER_CONTRACT_DIGEST,
  allikvereFrontierReportDigest, validateRetainedAllikvereFrontierReport,
  type AllikvereFrontierReport } from "@/modules/research-sandbox/math-lrc-frontier-report";

vi.mock("node:child_process", async (original) => {
  const actual = await original<typeof import("node:child_process")>();
  return { ...actual, execFile: vi.fn(actual.execFile) };
});

const baseBytes = readFileSync(LRC_FRONTIER_BASE.path, "utf8");
const base: unknown = JSON.parse(baseBytes);
let fixture: AllikvereFrontierReport;
const reseal = (report: AllikvereFrontierReport) => ({ ...report, reportDigest: allikvereFrontierReportDigest(report) });
beforeAll(async () => {
  const plan = selectResumePlan(base);
  const children = [];
  // Tight actual-tool fixtures only; never the default collector campaign.
  for (const job of plan.jobs) children.push({ jobDigest: job.jobDigest,
    evidence: await runLrcCoverEvidence(job.childScope, job.childRootContractDigest, { maxNodes: 1 }) });
  const packetBody = { version: 1 as const, method: LRC_FRONTIER_METHOD,
    contractDigest: ALLIKVERE_FRONTIER_CONTRACT_DIGEST, baseReportDigest: LRC_FRONTIER_BASE.reportDigest, plan, children };
  const packet = { ...packetBody, packetDigest: lrcFrontierPacketDigest(packetBody) };
  const evidence = await runLrcFrontierEvidence(base, packet);
  const body = { version: 1 as const, method: ALLIKVERE_FRONTIER_REPORT_METHOD,
    status: evidence.primary.status, generatedAt: "2026-10-03T00:00:00.000Z",
    contractDigest: ALLIKVERE_FRONTIER_CONTRACT_DIGEST, baseReportRawSha256: LRC_FRONTIER_BASE.rawSha256,
    baseReportDigest: LRC_FRONTIER_BASE.reportDigest, sourceManifestDigest: ALLIKVERE_SOURCE_DIGEST,
    loopKind: "LOCAL_COMPUTATIONAL_TOOL_AGENT_LOOP" as const,
    phases: ["CHOOSE", "EXECUTE", "INDEPENDENT_REPLAY", "COMPOSE", "STOP"] as ["CHOOSE", "EXECUTE", "INDEPENDENT_REPLAY", "COMPOSE", "STOP"],
    archiveWholeVerified: false as const, globalVerdict: "NOT_ESTABLISHED" as const,
    lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const, uncoveredObligations: [...ALLIKVERE_GLOBAL_GAPS], evidence };
  fixture = { ...body, reportDigest: allikvereFrontierReportDigest(body) };
}, 40000);

describe("sealed frontier checkpoint product boundary", () => {
  it("keeps immutable048bytes and exact eight selector jobs rather than a new model plan", () => {
    expect(vi.mocked(execFile)).toHaveBeenCalledTimes(9); // eight tools + one composition replay
    expect(sha256(baseBytes)).toBe(LRC_FRONTIER_BASE.rawSha256);
    const jobs = fixture.evidence.packet.plan.jobs;
    expect(jobs).toHaveLength(8);
    expect(jobs.map((job) => job.role)).toEqual(Array.from({ length: 4 }, () => ["closure-control", "strategic-mass"]).flat());
    expect(jobs.map((job) => job.nodeId)).toEqual(["n12437", "n12462", "n12012", "n12035", "n13929", "n13960", "n13466", "n13491"]);
    expect(jobs.map((job) => job.totalTuples)).toEqual(["117649", "13841287201", "16807", "13841287201", "16807", "13841287201", "16807", "13841287201"]);
    expect(new Set(jobs.map((job) => job.jobDigest)).size).toBe(8);
  });
  it("admits actual independently replayed PARTIAL composition and all unchanged global gaps", () => {
    const report = validateRetainedAllikvereFrontierReport(fixture, base);
    expect(report?.status).toBe("PARTIAL");
    expect(report?.uncoveredObligations).toEqual([...ALLIKVERE_GLOBAL_GAPS]);
    expect(report?.evidence.primary.rows.every((row) => BigInt(row.current.unresolvedTuples) > BigInt(0))).toBe(true);
    expect(report?.phases.at(-1)).toBe("STOP");
    expect(report?.loopKind).toBe("LOCAL_COMPUTATIONAL_TOOL_AGENT_LOOP");
  }, 10000);
  it.each([
    ["global theorem", (r: AllikvereFrontierReport) => { (r as unknown as { globalVerdict: string }).globalVerdict = "PROVED"; }],
    ["whole archive trust", (r: AllikvereFrontierReport) => { (r as unknown as { archiveWholeVerified: boolean }).archiveWholeVerified = true; }],
    ["missing global obligation", (r: AllikvereFrontierReport) => { r.uncoveredObligations.pop(); }],
    ["stale base bytes", (r: AllikvereFrontierReport) => { r.baseReportRawSha256 = "a".repeat(64); }],
    ["cross-base report", (r: AllikvereFrontierReport) => { r.baseReportDigest = "a".repeat(64); }],
    ["wrong contract", (r: AllikvereFrontierReport) => { r.contractDigest = "a".repeat(64); }],
    ["source drift", (r: AllikvereFrontierReport) => { r.sourceManifestDigest = "a".repeat(64); }],
    ["unreplayed lower premise promotion", (r: AllikvereFrontierReport) => { (r as unknown as { lowerDependency: string }).lowerDependency = "PROVED"; }],
    ["LLM campaign label", (r: AllikvereFrontierReport) => { (r as unknown as { loopKind: string }).loopKind = "LLM_CAMPAIGN"; }],
    ["missing STOP", (r: AllikvereFrontierReport) => { (r.phases as string[]).pop(); }],
  ] as const)("rejects report-rehashed %s", (_label, mutate) => {
    const raw = structuredClone(fixture); mutate(raw);
    expect(validateRetainedAllikvereFrontierReport(reseal(raw), base)).toBeNull();
  });
  it("does not promote PARTIAL by resealing the outer report as COMPLETE", () => {
    const raw = structuredClone(fixture); raw.status = "COMPLETE";
    expect(validateRetainedAllikvereFrontierReport(reseal(raw), base)).toBeNull();
  }, 10000);
  it("retained GET never dispatches a child process or external research fetch", () => {
    const execute = vi.mocked(execFile); execute.mockClear();
    const fetch = vi.spyOn(globalThis, "fetch");
    try { expect(validateRetainedAllikvereFrontierReport(fixture, base)).not.toBeNull(); expect(execute).not.toHaveBeenCalled(); expect(fetch).not.toHaveBeenCalled(); }
    finally { fetch.mockRestore(); }
  }, 10000);
  it("fails closed when the shared pure-read observation deadline expires", () => {
    let reads = 0;
    const clock = vi.spyOn(performance, "now").mockImplementation(() => reads++ === 0 ? 0 : 30001);
    try { expect(validateRetainedAllikvereFrontierReport(fixture, base)).toBeNull(); } finally { clock.mockRestore(); }
  });
  it("renders scope-honest bilingual stopped-loop copy without dispatch controls", () => {
    for (const locale of ["vi", "en"]) {
      const html = renderToStaticMarkup(createElement(MathLrcFrontierPanel, { raw: fixture, base, locale }));
      expect(html).toContain("PARTIAL"); expect(html).toContain("scroll-mt-24"); expect(html).toContain(fixture.reportDigest);
      expect(html).toContain(locale === "vi" ? "không phải chiến dịch LLM" : "not an LLM campaign");
      expect(html).toContain(locale === "vi" ? "Tăng thêm đã kiểm chứng" : "Verified classified delta");
      expect(html).toContain(locale === "vi" ? "không phải benchmark mù" : "not a blind benchmark");
      expect(html).not.toContain("<form"); expect(html).not.toContain("<button");
    }
    const invalid = renderToStaticMarkup(createElement(MathLrcFrontierPanel, { raw: {}, base, locale: "en" }));
    expect(invalid).toContain("unavailable or invalid"); expect(invalid).toContain("scroll-mt-24");
  }, 20000);
  it("rejects unapproved CLI options and production before any generation/replacement", () => {
    const run = (args: string[], nodeEnv: "test" | "production") => execFileSync(process.execPath,
      ["--import", "tsx", "scripts/operations/allikvere-frontier-audit.ts", ...args],
      { env: { ...process.env, NODE_ENV: nodeEnv }, encoding: "utf8", timeout: 5000, maxBuffer: 65536 });
    expect(() => run(["--write", "--extend-jobs"], "test")).toThrow();
    expect(() => run(["--write"], "production")).toThrow();
    expect(sha256(readFileSync(LRC_FRONTIER_BASE.path, "utf8"))).toBe(LRC_FRONTIER_BASE.rawSha256);
  });
  it("keeps report fingerprint distinct from execution attestation", () => {
    const { reportDigest, ...body } = fixture;
    expect(sha256(canonicalJson(body))).toBe(reportDigest);
    expect(vi.isMockFunction(validateRetainedAllikvereFrontierReport)).toBe(false);
  });
  it("admits the actual retained checkpoint while preserving old report/panel paths", () => {
    const raw = JSON.parse(readFileSync("docs/research/lrc-allikvere-p199/retained-frontier-report.json", "utf8"));
    const retained = validateRetainedAllikvereFrontierReport(raw, base);
    expect(retained?.status).toBe("PARTIAL");
    expect(retained?.evidence.packet.children.filter((child) => child.evidence.primary.status === "COMPLETE")).toHaveLength(4);
    expect(retained?.evidence.primary.rows.every((row) => row.status === "PARTIAL" && BigInt(row.delta.classifiedTuples) >= BigInt(0))).toBe(true);
    expect(sha256(readFileSync(LRC_FRONTIER_BASE.path, "utf8"))).toBe(LRC_FRONTIER_BASE.rawSha256);
    const source = readFileSync("src/app/w/[workspaceSlug]/research/math-tools/page.tsx", "utf8");
    expect(source).toContain("{oldRetainedView && <MathLrcFrontierPanel raw={allikvereFrontierReport} base={allikvereCoverReport} locale={locale} />}");
    expect(source).toContain("?view=allikvere#allikvere-frontier");
    expect(source).toContain("{oldRetainedView && <MathLrcCoverPanel raw={allikvereCoverReport} locale={locale} />}");
    expect(source).toContain("{oldRetainedView && <MathAllikvereReportPanel raw={allikvereReport} locale={locale} />}");
    expect(source).toContain('if (!retainedOnly) try { scope = parseDivisorLabQuery(query)');
  }, 15000);
});
