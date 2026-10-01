import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { adaptiveShiftHash, compareAdaptiveShiftReplay, verifyAdaptiveShiftPacket } from "./adaptive-shift-check";

export const ADAPTIVE_SHIFT_REPLAY_SHA256 = "18dcf20e88d1fd70a5d5cee8e5db429f426f8e3a1e2ac1540f986766cb80fed9";
export const ADAPTIVE_SHIFT_REPLAY_LIMITS = { timeout: 60000, maxBuffer: 2097152, maxPairChecks: 50000000 } as const;
const hash = (data: Buffer | string) => createHash("sha256").update(data).digest("hex");

/** One fixed code path; no supplied executable, arguments, factorization or model/provider credentials. */
export function replayAdaptiveShiftPartitions(primary: unknown) {
  const start = performance.now();
  let observedScriptDigest: string | null = null, verifiedScriptDigest: string | null = null, outputDigest: string | null = null;
  let outputBytes = 0;
  let primaryDigest: string | null = null;
  const result = (status: "PASS" | "MISMATCH" | "PARTIAL" | "UNAVAILABLE", reason: string, replay: unknown = null) => {
    // Final observed checkpoint includes validation/comparison work; synchronous JS is not preempted.
    const elapsedMs = Math.round(performance.now() - start);
    if (status === "PASS" && elapsedMs >= ADAPTIVE_SHIFT_REPLAY_LIMITS.timeout) {
      status = "UNAVAILABLE"; reason = "WRAPPER_TIME_LIMIT";
    }
    return {
    method: "FIXED_PYTHON_DIVISOR_PAIR_REPLAY_V1", status, reason,
    expectedScriptDigest: ADAPTIVE_SHIFT_REPLAY_SHA256, observedScriptDigest, verifiedScriptDigest,
    primaryDigest, outputDigest, outputBytes,
    elapsedMs, limits: ADAPTIVE_SHIFT_REPLAY_LIMITS, replay,
    scope: "FINITE_DECLARED_INTERVAL_AND_SEPARATE_WARMUPS_NOT_ROOT_OR_NOVELTY" };
  };
  if (!verifyAdaptiveShiftPacket(primary)) return result("MISMATCH", "PRIMARY_INVARIANT_INVALID");
  primaryDigest = primary.packetDigest;
  if (primary.status !== "COMPLETE") return result("PARTIAL", "PRIMARY_PARTIAL");
  try {
    const script = resolve("scripts/operations/adaptive-shift-replay.py"), source = readFileSync(script);
    observedScriptDigest = hash(source);
    if (observedScriptDigest !== ADAPTIVE_SHIFT_REPLAY_SHA256) return result("UNAVAILABLE", "SOURCE_PIN_MISMATCH");
    verifiedScriptDigest = observedScriptDigest;
    const remainingMs = ADAPTIVE_SHIFT_REPLAY_LIMITS.timeout - (performance.now() - start);
    if (remainingMs <= 0) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    const child = spawnSync("python3", ["-I", "-S", "-B", "-c", source.toString("utf8")], { encoding: "utf8",
      timeout: Math.max(1, Math.floor(remainingMs)), maxBuffer: ADAPTIVE_SHIFT_REPLAY_LIMITS.maxBuffer,
      env: { PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1", NODE_ENV: "test" } });
    outputBytes = Buffer.byteLength(child.stdout ?? "");
    outputDigest = outputBytes ? hash(child.stdout) : null;
    if (child.error || child.status !== 0) return result("UNAVAILABLE", "REPLAY_PROCESS_FAILED_OR_LIMITED");
    if (outputBytes > ADAPTIVE_SHIFT_REPLAY_LIMITS.maxBuffer) return result("UNAVAILABLE", "REPLAY_OUTPUT_LIMIT");
    let raw: unknown;
    try { raw = JSON.parse(child.stdout); } catch { return result("MISMATCH", "REPLAY_JSON_INVALID"); }
    if (!verifyAdaptiveShiftPacket(raw)) return result("MISMATCH", "REPLAY_INVARIANT_INVALID");
    const status = compareAdaptiveShiftReplay(primary, raw);
    if (performance.now() - start >= ADAPTIVE_SHIFT_REPLAY_LIMITS.timeout) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    if (status === "PASS" && primary.contentDigest !== raw.contentDigest) return result("MISMATCH", "CONTENT_BINDING_INVALID");
    return result(status, status === "PASS" ? "EXACT_FULL_INVARIANTS_AGREE" : status === "PARTIAL" ? "REPLAY_PARTIAL" : "FULL_INVARIANT_MISMATCH", raw);
  } catch { return result("UNAVAILABLE", "REPLAY_IO_UNAVAILABLE"); }
}

export function adaptiveShiftReplayReceiptDigest(value: ReturnType<typeof replayAdaptiveShiftPartitions>) { return adaptiveShiftHash(value); }
