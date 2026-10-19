import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { sufficientCoverageHash, compareSufficientCoverageReplay, verifySufficientCoveragePacket } from "./sufficient-coverage-check";

export const SUFFICIENT_COVERAGE_REPLAY_SHA256 = "57874e09b3c501919c64c611b25d475d2f83419aabc35024fcd06af518983b96";
export const SUFFICIENT_COVERAGE_REPLAY_LIMITS = { timeout: 60000, maxBuffer: 2097152, maxPairChecks: 50000000, maxWorkSteps: 50000000, maxStateInsertions: 2000000 } as const;
const hash = (s: Buffer | string) => createHash("sha256").update(s).digest("hex");

/** Verified fixed bytes only. Collector-trusted receipt, not externally signed execution attestation. */
export function replaySufficientCoverage(primary: unknown) {
  const start = performance.now();
  let observedScriptDigest: string | null = null, verifiedScriptDigest: string | null = null;
  let primaryDigest: string | null = null, outputDigest: string | null = null, outputBytes = 0;
  const result = (status: "PASS" | "MISMATCH" | "PARTIAL" | "UNAVAILABLE", reason: string, replay: unknown = null) => {
    const elapsedMs = Math.round(performance.now() - start);
    if (status === "PASS" && elapsedMs >= SUFFICIENT_COVERAGE_REPLAY_LIMITS.timeout) { status = "UNAVAILABLE"; reason = "WRAPPER_TIME_LIMIT"; }
    return { method: "FIXED_PYTHON_SUFFICIENT_COVERAGE_REPLAY_V1", status, reason,
      expectedScriptDigest: SUFFICIENT_COVERAGE_REPLAY_SHA256, observedScriptDigest, verifiedScriptDigest, primaryDigest,
      outputDigest, outputBytes, elapsedMs, limits: SUFFICIENT_COVERAGE_REPLAY_LIMITS, replay,
      scope: "FINITE_EXPOSED_SUFFICIENT_CERTIFICATES_NOT_ROOT_OR_MINIMUM_OR_NOVELTY" };
  };
  if (!verifySufficientCoveragePacket(primary)) return result("MISMATCH", "PRIMARY_INVARIANT_INVALID");
  primaryDigest = primary.packetDigest;
  if (primary.status !== "COMPLETE") return result("PARTIAL", "PRIMARY_PARTIAL");
  try {
    const source = readFileSync(resolve("scripts/operations/sufficient-coverage-replay.py"));
    observedScriptDigest = hash(source);
    if (observedScriptDigest !== SUFFICIENT_COVERAGE_REPLAY_SHA256) return result("UNAVAILABLE", "SOURCE_PIN_MISMATCH");
    verifiedScriptDigest = observedScriptDigest;
    const remaining = SUFFICIENT_COVERAGE_REPLAY_LIMITS.timeout - (performance.now() - start);
    if (remaining <= 0) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    const child = spawnSync("python3", ["-I", "-S", "-B", "-c", source.toString("utf8")], { encoding: "utf8",
      timeout: Math.max(1, Math.floor(remaining)), maxBuffer: SUFFICIENT_COVERAGE_REPLAY_LIMITS.maxBuffer,
      env: { PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1", NODE_ENV: "test" } });
    outputBytes = Buffer.byteLength(child.stdout ?? ""); outputDigest = outputBytes ? hash(child.stdout) : null;
    if (child.error || child.status !== 0) return result("UNAVAILABLE", "REPLAY_PROCESS_FAILED_OR_LIMITED");
    if (outputBytes > SUFFICIENT_COVERAGE_REPLAY_LIMITS.maxBuffer) return result("UNAVAILABLE", "REPLAY_OUTPUT_LIMIT");
    let raw: unknown;
    try { raw = JSON.parse(child.stdout); } catch { return result("MISMATCH", "REPLAY_JSON_INVALID"); }
    if (!verifySufficientCoveragePacket(raw)) return result("MISMATCH", "REPLAY_INVARIANT_INVALID");
    const status = compareSufficientCoverageReplay(primary, raw);
    if (performance.now() - start >= SUFFICIENT_COVERAGE_REPLAY_LIMITS.timeout) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    return result(status, status === "PASS" ? "EXACT_FULL_COVERAGE_INVARIANTS_AGREE" : status === "PARTIAL" ? "REPLAY_PARTIAL" : "FULL_INVARIANT_MISMATCH", raw);
  } catch { return result("UNAVAILABLE", "REPLAY_IO_UNAVAILABLE"); }
}
export function sufficientCoverageReplayReceiptDigest(value: ReturnType<typeof replaySufficientCoverage>) { return sufficientCoverageHash(value); }
