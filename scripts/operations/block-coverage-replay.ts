import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { blockCoverageHash, compareBlockCoverageReplay, verifyBlockCoveragePacket } from "./block-coverage-check";

export const BLOCK_COVERAGE_REPLAY_SHA256 = "5dbe06e076f0a8b010b03c248305d2601a4688b9bbd4711f849a437bc32dd0d0";
export const BLOCK_COVERAGE_REPLAY_LIMITS = { timeout: 60000, maxBuffer: 8388608, maxPairChecks: 50000000, maxWorkSteps: 50000000, maxStateInsertions: 2000000 } as const;
const hash = (s: Buffer | string) => createHash("sha256").update(s).digest("hex");

/** Verified fixed bytes only. Collector-trusted receipt, not externally signed execution attestation. */
export function replayBlockCoverage(primary: unknown) {
  const start = performance.now();
  let observedScriptDigest: string | null = null, verifiedScriptDigest: string | null = null;
  let primaryDigest: string | null = null, outputDigest: string | null = null, outputBytes = 0;
  const result = (status: "PASS" | "MISMATCH" | "PARTIAL" | "UNAVAILABLE", reason: string, replay: unknown = null) => {
    const elapsedMs = Math.round(performance.now() - start);
    if (status === "PASS" && elapsedMs >= BLOCK_COVERAGE_REPLAY_LIMITS.timeout) { status = "UNAVAILABLE"; reason = "WRAPPER_TIME_LIMIT"; }
    return { method: "FIXED_PYTHON_BLOCK_COVERAGE_REPLAY_V1", status, reason,
      expectedScriptDigest: BLOCK_COVERAGE_REPLAY_SHA256, observedScriptDigest, verifiedScriptDigest, primaryDigest,
      outputDigest, outputBytes, elapsedMs, limits: BLOCK_COVERAGE_REPLAY_LIMITS, replay,
      scope: "FIXED_191_SUFFICIENT_CERTIFICATES_NOT_ROOT_OR_MINIMUM_OR_NOVELTY" };
  };
  if (!verifyBlockCoveragePacket(primary)) return result("MISMATCH", "PRIMARY_INVARIANT_INVALID");
  primaryDigest = primary.packetDigest;
  if (primary.status !== "COMPLETE") return result("PARTIAL", "PRIMARY_PARTIAL");
  try {
    const source = readFileSync(resolve("scripts/operations/block-coverage-replay.py"));
    observedScriptDigest = hash(source);
    if (observedScriptDigest !== BLOCK_COVERAGE_REPLAY_SHA256) return result("UNAVAILABLE", "SOURCE_PIN_MISMATCH");
    verifiedScriptDigest = observedScriptDigest;
    const remaining = BLOCK_COVERAGE_REPLAY_LIMITS.timeout - (performance.now() - start);
    if (remaining <= 0) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    const child = spawnSync("python3", ["-I", "-S", "-B", "-c", source.toString("utf8")], { encoding: "utf8",
      timeout: Math.max(1, Math.floor(remaining)), maxBuffer: BLOCK_COVERAGE_REPLAY_LIMITS.maxBuffer,
      env: { PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1", NODE_ENV: "test" } });
    outputBytes = Buffer.byteLength(child.stdout ?? ""); outputDigest = outputBytes ? hash(child.stdout) : null;
    if (child.error || child.status !== 0) return result("UNAVAILABLE", "REPLAY_PROCESS_FAILED_OR_LIMITED");
    if (outputBytes > BLOCK_COVERAGE_REPLAY_LIMITS.maxBuffer) return result("UNAVAILABLE", "REPLAY_OUTPUT_LIMIT");
    let raw: unknown;
    try { raw = JSON.parse(child.stdout); } catch { return result("MISMATCH", "REPLAY_JSON_INVALID"); }
    if (!verifyBlockCoveragePacket(raw)) return result("MISMATCH", "REPLAY_INVARIANT_INVALID");
    const status = compareBlockCoverageReplay(primary, raw);
    if (performance.now() - start >= BLOCK_COVERAGE_REPLAY_LIMITS.timeout) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    return result(status, status === "PASS" ? "EXACT_FULL_COVERAGE_INVARIANTS_AGREE" : status === "PARTIAL" ? "REPLAY_PARTIAL" : "FULL_INVARIANT_MISMATCH", raw);
  } catch { return result("UNAVAILABLE", "REPLAY_IO_UNAVAILABLE"); }
}
export function blockCoverageReplayReceiptDigest(value: ReturnType<typeof replayBlockCoverage>) { return blockCoverageHash(value); }
