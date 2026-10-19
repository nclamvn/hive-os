import { performance } from "node:perf_hooks";
import { mkdir, mkdtemp, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";

const started = performance.now();
async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--write")) throw new Error("Usage: allikvere-cover-audit.ts [--write]");
  if (!["development", "test"].includes(process.env.NODE_ENV ?? "") ||
    (process.env.DEPLOYMENT_ENV && !["development", "test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Local development/test only");
  const { ALLIKVERE_COVER_METHOD: method, ALLIKVERE_COVER_CONTRACT_DIGEST: contractDigest,
    ALLIKVERE_COVER_REPORT_LIMITS: limits, allikvereCoverScopes, allikvereCoverReportDigest, validateRetainedAllikvereCoverReport } =
    await import("../../src/modules/research-sandbox/math-lrc-cover-report");
  const { ALLIKVERE_GLOBAL_GAPS: gaps, ALLIKVERE_SOURCE_DIGEST: sourceManifestDigest } =
    await import("../../src/modules/research-sandbox/math-lrc-allikvere-report");
  const { runLrcCoverEvidence } = await import("../../src/modules/research-sandbox/math-lrc-cover-replay");
  const check = () => { if (performance.now() - started >= limits.collectorMilliseconds) throw new Error("Aggregate 120-second cover collector deadline exceeded"); };
  const rows = [];
  for (const descriptor of allikvereCoverScopes()) {
    check();
    const evidence = await runLrcCoverEvidence(descriptor.scope, descriptor.rootContractDigest);
    check(); rows.push({ ...descriptor, evidence });
  }
  const body = { version: 1 as const, method, status: rows.every((row) => row.evidence.primary.status === "COMPLETE")
    ? "COMPLETE" as const : "PARTIAL" as const, generatedAt: new Date().toISOString(), contractDigest,
    sourceManifestDigest, archiveWholeVerified: false as const, globalVerdict: "NOT_ESTABLISHED" as const,
    lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const, uncoveredObligations: [...gaps], rows };
  const report = { ...body, reportDigest: allikvereCoverReportDigest(body) };
  if (!validateRetainedAllikvereCoverReport(report)) throw new Error("Cover report fails pure retained admission");
  const bytes = `${JSON.stringify(report)}\n`;
  if (Buffer.byteLength(bytes, "utf8") > limits.bytes) throw new Error("Cover report exceeds 128 MiB");
  check();
  if (args[0] === "--write") {
    const directory = join(process.cwd(), "docs/research/lrc-allikvere-p199");
    await mkdir(directory, { recursive: true });
    const temporaryDirectory = await mkdtemp(join(directory, ".cover-report-"));
    try {
      const temporary = join(temporaryDirectory, "retained-cover-report.json");
      await writeFile(temporary, bytes, { encoding: "utf8", mode: 0o600, flag: "wx" });
      check(); await rename(temporary, join(directory, "retained-cover-report.json"));
    } finally { await rm(temporaryDirectory, { recursive: true, force: true }); }
  }
  check();
  const output = JSON.stringify({ status: report.status, globalVerdict: "NOT_ESTABLISHED", reportDigest: report.reportDigest,
    bytes: Buffer.byteLength(bytes), elapsedMs: Math.ceil(performance.now() - started), retained: args[0] === "--write",
    rows: rows.map(({ id, kind, evidence }) => ({ id, kind, status: evidence.primary.status,
      total: evidence.primary.totalTuples, classified: evidence.primary.classifiedTuples, unresolved: evidence.primary.unresolvedTuples })) });
  check(); process.stdout.write(`${output}\n`);
}
main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Cover collector failed closed"}\n`); process.exitCode = 1;
});
