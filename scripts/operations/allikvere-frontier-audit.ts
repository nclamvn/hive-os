import { performance } from "node:perf_hooks";
import { readFile, mkdir, mkdtemp, writeFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";

// Shared observation begins before imports/reads, not once per tool invocation.
const started = performance.now();
async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--write")) throw new Error("Usage: allikvere-frontier-audit.ts [--write]");
  if (!["development", "test"].includes(process.env.NODE_ENV ?? "") ||
    (process.env.DEPLOYMENT_ENV && !["development", "test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Local development/test only");
  const { canonicalJson, sha256 } = await import("../../src/modules/execution-fabric/contracts");
  const { selectResumePlan, LRC_FRONTIER_BASE, LRC_FRONTIER_METHOD } = await import("../../src/modules/research-sandbox/math-lrc-frontier");
  const { runLrcCoverEvidence } = await import("../../src/modules/research-sandbox/math-lrc-cover-replay");
  const { runLrcFrontierEvidence } = await import("../../src/modules/research-sandbox/math-lrc-frontier-replay");
  const { ALLIKVERE_GLOBAL_GAPS: gaps, ALLIKVERE_SOURCE_DIGEST: sourceManifestDigest } = await import("../../src/modules/research-sandbox/math-lrc-allikvere-report");
  const { ALLIKVERE_FRONTIER_REPORT_METHOD: method, ALLIKVERE_FRONTIER_CONTRACT_DIGEST: contractDigest,
    ALLIKVERE_FRONTIER_REPORT_LIMITS: limits, allikvereFrontierReportDigest, validateRetainedAllikvereFrontierReport } =
    await import("../../src/modules/research-sandbox/math-lrc-frontier-report");
  const remaining = () => Math.floor(limits.collectorMs - (performance.now() - started));
  const check = () => { if (remaining() <= 0) throw new Error("Aggregate frontier collector deadline exceeded"); };
  check();
  const baseBytes = await readFile(join(process.cwd(), LRC_FRONTIER_BASE.path), "utf8");
  if (sha256(baseBytes) !== LRC_FRONTIER_BASE.rawSha256) throw new Error("Immutable TIP048 base bytes drifted");
  const base = JSON.parse(baseBytes);
  check();
  // CHOOSE: immutable base and preregistered selectors, never model/tool output.
  const plan = selectResumePlan(base);
  if (plan.jobs.length !== limits.jobs) throw new Error("Expected exactly eight frozen jobs");
  check();
  // EXECUTE: trusted existing bounded tool; each generation receives a tighter
  // remaining deadline, while the unchanged wrapper retains its own30s bound.
  const children = [];
  for (const job of plan.jobs) {
    check();
    const evidence = await runLrcCoverEvidence(job.childScope, job.childRootContractDigest,
      { timeoutMs: Math.min(10000, remaining()) });
    check(); children.push({ jobDigest: job.jobDigest, evidence });
  }
  const packetBody = { version: 1 as const, method: LRC_FRONTIER_METHOD, contractDigest,
    baseReportDigest: LRC_FRONTIER_BASE.reportDigest, plan, children };
  const packet = { ...packetBody, packetDigest: sha256(canonicalJson(packetBody)) };
  if (Buffer.byteLength(JSON.stringify(packet), "utf8") > limits.packetBytes) throw new Error("Frontier composition packet exceeds64MiB");
  check();
  // INDEPENDENT_REPLAY + COMPOSE: pinned Python recomputes exact parent/child
  // replacement; pure admission derives remaining work. STOP follows this batch.
  const evidence = await runLrcFrontierEvidence(base, packet, { timeoutMs: Math.min(40000, remaining()) });
  check();
  const body = { version: 1 as const, method, status: evidence.primary.status, generatedAt: new Date().toISOString(),
    contractDigest, baseReportRawSha256: LRC_FRONTIER_BASE.rawSha256, baseReportDigest: LRC_FRONTIER_BASE.reportDigest,
    sourceManifestDigest, loopKind: "LOCAL_COMPUTATIONAL_TOOL_AGENT_LOOP" as const,
    phases: ["CHOOSE", "EXECUTE", "INDEPENDENT_REPLAY", "COMPOSE", "STOP"] as ["CHOOSE", "EXECUTE", "INDEPENDENT_REPLAY", "COMPOSE", "STOP"],
    archiveWholeVerified: false as const, globalVerdict: "NOT_ESTABLISHED" as const,
    lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const, uncoveredObligations: [...gaps], evidence };
  const report = { ...body, reportDigest: allikvereFrontierReportDigest(body) };
  if (!validateRetainedAllikvereFrontierReport(report, base)) throw new Error("Frontier report fails pure retained admission");
  const bytes = `${JSON.stringify(report)}\n`;
  if (Buffer.byteLength(bytes, "utf8") > limits.reportBytes) throw new Error("Frontier report exceeds128MiB");
  check();
  if (args[0] === "--write") {
    const directory = join(process.cwd(), "docs/research/lrc-allikvere-p199");
    await mkdir(directory, { recursive: true });
    const temporaryDirectory = await mkdtemp(join(directory, ".frontier-report-"));
    try {
      const temporary = join(temporaryDirectory, "retained-frontier-report.json");
      await writeFile(temporary, bytes, { encoding: "utf8", mode: 0o600, flag: "wx" });
      check(); await rename(temporary, join(directory, "retained-frontier-report.json"));
    } finally { await rm(temporaryDirectory, { recursive: true, force: true }); }
  }
  check();
  const output = JSON.stringify({ status: report.status, loopKind: report.loopKind, terminalPhase: "STOP",
    globalVerdict: report.globalVerdict, reportDigest: report.reportDigest, planDigest: plan.planDigest,
    bytes: Buffer.byteLength(bytes), elapsedMs: Math.ceil(performance.now() - started), retained: args[0] === "--write",
    rows: evidence.primary.rows.map((row) => ({ parentId: row.parentId, previous: row.previous,
      current: row.current, delta: row.delta, remainingDomains: row.remainingFrontier.length })) });
  check(); process.stdout.write(`${output}\n`);
}
main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Frontier collector failed closed"}\n`); process.exitCode = 1;
});
