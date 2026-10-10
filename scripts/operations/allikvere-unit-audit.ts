import { performance } from "node:perf_hooks";
import { readFile, mkdir, mkdtemp, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";

// One collector observation includes imports, reads and the final output/write.
const started = performance.now();
async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--write")) throw new Error("Usage: allikvere-unit-audit.ts [--write]");
  if (!["development", "test"].includes(process.env.NODE_ENV ?? "") ||
    (process.env.DEPLOYMENT_ENV && !["development", "test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Local development/test only");
  const { canonicalJson, sha256 } = await import("../../src/modules/execution-fabric/contracts");
  const { deriveLrcUnitActionPlan } = await import("../../src/modules/research-sandbox/math-lrc-unit-action");
  const { runLrcUnitActionEvidence } = await import("../../src/modules/research-sandbox/math-lrc-unit-replay");
  const { ALLIKVERE_GLOBAL_GAPS: gaps, ALLIKVERE_SOURCE_DIGEST: sourceManifestDigest } = await import("../../src/modules/research-sandbox/math-lrc-allikvere-report");
  const { ALLIKVERE_UNIT_REPORT_METHOD: method, ALLIKVERE_UNIT_CONTRACT_DIGEST: contractDigest,
    ALLIKVERE_UNIT_REPORT_LIMITS: limits, ALLIKVERE_UNIT_SOURCES: sources,
    allikvereUnitReportDigest, validateRetainedAllikvereUnitReport } = await import("../../src/modules/research-sandbox/math-lrc-unit-report");
  const remaining = () => Math.floor(limits.collectorMs - (performance.now() - started));
  const check = () => { if (remaining() <= 0) throw new Error("Aggregate unit-action collector deadline exceeded"); };
  check();
  const baseBytes = await readFile(join(process.cwd(), sources.basePath), "utf8");
  const frontierBytes = await readFile(join(process.cwd(), sources.frontierPath), "utf8");
  if (Buffer.byteLength(baseBytes) + Buffer.byteLength(frontierBytes) > limits.inputBytes ||
    sha256(baseBytes) !== sources.baseRawSha256 || sha256(frontierBytes) !== sources.frontierRawSha256) throw new Error("Immutable TIP048/049 source bytes drifted or exceed80MiB");
  const base: unknown = JSON.parse(baseBytes), frontier: unknown = JSON.parse(frontierBytes);
  check();
  // DERIVE/TRANSPORT: all eligible proved nodes, fixed six actions; no new search.
  const plan = deriveLrcUnitActionPlan(base, frontier);
  check();
  // INDEPENDENT_REPLAY/UNION: fixed verified Python rederives sources and uses
  // its own endpoint sweep. No caller-selected leaf list or external code.
  const evidence = await runLrcUnitActionEvidence(base, frontier, plan, { timeoutMs: Math.min(90000, remaining()) });
  check();
  const body = { version: 1 as const, method, status: evidence.primary.status,
    researchClassification: "PARTIAL" as const, generatedAt: new Date().toISOString(), contractDigest,
    baseReportRawSha256: sources.baseRawSha256, baseReportDigest: sources.baseReportDigest,
    frontierReportRawSha256: sources.frontierRawSha256, frontierReportDigest: sources.frontierReportDigest,
    sourceManifestDigest, loopKind: "LOCAL_COMPUTATIONAL_PROOF_REUSE" as const,
    phases: ["DERIVE", "TRANSPORT", "INDEPENDENT_REPLAY", "UNION", "STOP"] as ["DERIVE", "TRANSPORT", "INDEPENDENT_REPLAY", "UNION", "STOP"],
    archiveWholeVerified: false as const, globalVerdict: "NOT_ESTABLISHED" as const,
    lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const, uncoveredObligations: [...gaps], evidence };
  const report = { ...body, reportDigest: allikvereUnitReportDigest(body) };
  if (!validateRetainedAllikvereUnitReport(report, base, frontier, { timeoutMs: Math.min(60000, remaining()) })) throw new Error("Unit-action report fails full pure retained admission");
  const bytes = `${canonicalJson(report)}\n`;
  if (Buffer.byteLength(bytes, "utf8") > limits.reportBytes) throw new Error("Unit report exceeds1MiB");
  check();
  if (args[0] === "--write") {
    const directory = join(process.cwd(), "docs/research/lrc-allikvere-p199");
    await mkdir(directory, { recursive: true });
    const temporaryDirectory = await mkdtemp(join(directory, ".unit-report-"));
    try {
      const temporary = join(temporaryDirectory, "retained-unit-report.json");
      await writeFile(temporary, bytes, { encoding: "utf8", mode: 0o600, flag: "wx" });
      check(); await rename(temporary, join(directory, "retained-unit-report.json"));
    } finally { await rm(temporaryDirectory, { recursive: true, force: true }); }
  }
  check();
  const output = JSON.stringify({ status: report.status, researchClassification: report.researchClassification,
    terminalPhase: "STOP", globalVerdict: report.globalVerdict, reportDigest: report.reportDigest,
    bytes: Buffer.byteLength(bytes), elapsedMs: Math.ceil(performance.now() - started), retained: args[0] === "--write",
    rows: evidence.primary.rows.map((row) => ({ parentId: row.parentId, original: row.originalWitnessTuples,
      union: row.unionWitnessTuples, delta: row.deltaWitnessTuples, remaining: row.remainingTuples,
      overlap: row.overlapTuples, unionDigest: row.unionDigest, complementDigest: row.complementDigest })) });
  check(); process.stdout.write(`${output}\n`);
}
main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Unit-action collector failed closed"}\n`); process.exitCode = 1;
});
