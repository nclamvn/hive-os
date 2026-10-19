import { performance } from "node:perf_hooks";
import { mkdir, mkdtemp, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";

// The outer collector deadline includes module loading, all six reviewed local
// replays, retained validation and file preparation. No foreign archive code.
const started = performance.now();
async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--write")) throw new Error("Usage: allikvere-modular-audit.ts [--write]");
  if (!["development", "test"].includes(process.env.NODE_ENV ?? "") ||
    (process.env.DEPLOYMENT_ENV && !["development", "test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Local development/test only");
  const { ALLIKVERE_REPORT_LIMITS: limits, ALLIKVERE_GLOBAL_GAPS: gaps, ALLIKVERE_SOURCE_DIGEST: sourceManifestDigest,
    allikvereImportedScopes, allikvereReportDigest, sameAllikvereResidueSets, validateRetainedAllikvereReport } =
    await import("../../src/modules/research-sandbox/math-lrc-allikvere-report");
  const { runLrcModularEvidence } = await import("../../src/modules/research-sandbox/math-lrc-modular-replay");
  const check = () => { if (performance.now() - started >= limits.milliseconds) throw new Error("Aggregate 60-second collector deadline exceeded"); };
  const rows = [];
  for (const descriptor of allikvereImportedScopes()) {
    check();
    const evidence = await runLrcModularEvidence(descriptor.scope, descriptor.rootContractDigest);
    check();
    const matched = descriptor.kind === "BINARY_FIBER" ? sameAllikvereResidueSets(
      evidence.primary.survivors.map((row) => row.residues), descriptor.authorSurvivors) : null;
    if (matched === false) throw new Error(`Independent survivor list disagrees: ${descriptor.id}`);
    rows.push({ ...descriptor, evidence, authorSurvivorListMatched: matched });
  }
  const body = { version: 1 as const, method: "ALLIKVERE_IMPORTED_MODULAR_FIBERS_V1" as const, status: "COMPLETE" as const,
    generatedAt: new Date().toISOString(), sourceManifestDigest, archiveWholeVerified: false as const,
    globalVerdict: "NOT_ESTABLISHED" as const, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const,
    uncoveredObligations: [...gaps], rows };
  const report = { ...body, reportDigest: allikvereReportDigest(body) };
  if (!validateRetainedAllikvereReport(report)) throw new Error("Six-scope retained report failed pure admission");
  const bytes = `${JSON.stringify(report)}\n`;
  if (Buffer.byteLength(bytes, "utf8") > limits.bytes) throw new Error("Retained report exceeds 64 MiB");
  check();
  if (args[0] === "--write") {
    const directory = join(process.cwd(), "docs/research/lrc-allikvere-p199");
    await mkdir(directory, { recursive: true });
    const temporaryDirectory = await mkdtemp(join(directory, ".report-"));
    try {
      const temporary = join(temporaryDirectory, "retained-report.json");
      await writeFile(temporary, bytes, { encoding: "utf8", mode: 0o600, flag: "wx" });
      check(); // Never replace the prior retained report with partial evidence.
      await rename(temporary, join(directory, "retained-report.json"));
    } finally { await rm(temporaryDirectory, { recursive: true, force: true }); }
  }
  check();
  const output = JSON.stringify({ status: "COMPLETE", globalVerdict: "NOT_ESTABLISHED", reportDigest: report.reportDigest,
    bytes: Buffer.byteLength(bytes), elapsedMs: Math.ceil(performance.now() - started), retained: args[0] === "--write",
    rows: rows.map(({ id, evidence }) => ({ id, total: evidence.primary.totalTuples, grid: evidence.primary.witnessTuples,
      conditionalGcd: evidence.primary.gcdTuples, survivors: evidence.primary.survivorTuples })) });
  check();
  process.stdout.write(`${output}\n`);
}
main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Local modular audit failed closed"}\n`);
  process.exitCode = 1;
});
