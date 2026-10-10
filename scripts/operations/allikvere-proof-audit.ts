import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";
import { canonicalJson, sha256 } from "../../src/modules/execution-fabric/contracts";
import { ALLIKVERE_PROOF_LIMITS as limits, ALLIKVERE_PROOF_PYTHON_SHA256, ALLIKVERE_PROOF_RETAINED_PATH,
  buildAllikvereProofPlan, reconstructProofArithmetic, proofArithmeticReportDigest, validateRetainedProofArithmetic,
  type ProofArithmeticReport } from "../../src/modules/research-sandbox/math-lrc-proof-plan";

/** Only the CLI seam can launch the pinned local interpreter. No report GET
 * imports this file, and no input may select code, paths, flags or Python env. */
export async function runFreshProofReplay(): Promise<ProofArithmeticReport["receipt"]> {
  const source = await readFile(join(process.cwd(),"scripts/operations/replay-lrc-proof-arithmetic.py"),"utf8");
  if (Buffer.byteLength(source) > limits.pythonBytes || sha256(source) !== ALLIKVERE_PROOF_PYTHON_SHA256) throw new Error("Trusted replay source pin mismatch");
  const expectedOutput = `${canonicalJson(reconstructProofArithmetic())}\n`;
  const started = performance.now();
  const stdout = await new Promise<string>((resolve,reject) => {
    const child = spawn("python3",["-I","-S","-B","-c",source], {
      shell: false, env: { PATH: "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin", LANG: "C.UTF-8", TMPDIR: "/private/tmp", NODE_ENV: "test" }, stdio: ["ignore","pipe","pipe"] });
    const chunks: Buffer[] = []; let bytes = 0, stderrBytes = 0, settled = false;
    const timer = setTimeout(() => fail(new Error("Replay deadline exceeded")),limits.replayMs);
    function fail(error: Error) { if (settled) return; settled = true; clearTimeout(timer); child.kill("SIGKILL"); reject(error); }
    child.stdout.on("data",(chunk: Buffer) => { bytes += chunk.length; if (bytes > limits.stdoutBytes) fail(new Error("Replay output cap exceeded")); else chunks.push(chunk); });
    child.stderr.on("data",(chunk: Buffer) => { stderrBytes += chunk.length; if (stderrBytes > 4096) fail(new Error("Replay diagnostic cap exceeded")); });
    child.on("error",fail);
    child.on("close",(code) => {
      if (settled) return; settled = true; clearTimeout(timer);
      if (code !== 0 || stderrBytes !== 0) reject(new Error("Replay failed closed"));
      else resolve(Buffer.concat(chunks).toString("utf8"));
    });
  });
  const elapsedMs = Math.ceil(performance.now()-started);
  if (elapsedMs > limits.replayMs || stdout !== expectedOutput) throw new Error("Independent replay arithmetic/output mismatch");
  return { method: "LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY", sourceSha256: ALLIKVERE_PROOF_PYTHON_SHA256,
    stdoutSha256: sha256(stdout), stdoutBytes: Buffer.byteLength(stdout), elapsedMs,
    interpreter: "python3", flags: ["-I","-S","-B","-c"], externalAttestation: false };
}

async function main() {
  const args = process.argv.slice(2), started = performance.now();
  if (args.length > 1 || (args.length === 1 && args[0] !== "--write")) throw new Error("Usage: allikvere-proof-audit.ts [--write]");
  if (!["development","test"].includes(process.env.NODE_ENV ?? "") || (process.env.DEPLOYMENT_ENV && !["development","test"].includes(process.env.DEPLOYMENT_ENV))) throw new Error("Local development/test only");
  const body = { ...reconstructProofArithmetic(), generatedAt: new Date().toISOString(),
    planDigest: sha256(canonicalJson(buildAllikvereProofPlan())), receipt: await runFreshProofReplay() };
  const report: ProofArithmeticReport = { ...body, reportDigest: proofArithmeticReportDigest(body) };
  if (!validateRetainedProofArithmetic(report)) throw new Error("Fresh report fails pure arithmetic admission");
  const bytes = `${canonicalJson(report)}\n`;
  if (Buffer.byteLength(bytes) > limits.reportBytes || performance.now()-started > limits.collectorMs) throw new Error("Collector limit exceeded");
  if (args[0] === "--write") {
    await mkdir(join(process.cwd(),"docs/research/lrc-allikvere-v2"),{recursive:true});
    // Creation only: never silently replace existing retained evidence.
    await writeFile(join(process.cwd(),ALLIKVERE_PROOF_RETAINED_PATH),bytes,{encoding:"utf8",mode:0o600,flag:"wx"});
  }
  process.stdout.write(`${JSON.stringify({status:report.status,globalVerdict:report.globalVerdict,receipt:report.receipt,
    reportDigest:report.reportDigest,bytes:Buffer.byteLength(bytes),elapsedMs:Math.ceil(performance.now()-started),retained:args[0]==="--write",
    targets:report.targets.map((t)=>({movingSpeeds:t.movingSpeeds,totalRunners:t.totalRunners,primes:t.primes.length,display:t.display}))})}\n`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((error:unknown)=>{
  process.stderr.write(`${error instanceof Error ? error.message : "Proof collector failed closed"}\n`); process.exitCode=1;
});
