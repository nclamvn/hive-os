import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { compositeShiftHash, compareCompositeShiftReplay, verifyCompositeShiftPacket } from "./composite-shift-check";

export const COMPOSITE_SHIFT_REPLAY_SHA256 = "d2eb19e4c199e29744f5a6410b4bd35991777c3bb53da8d5ba939ac38f52425f";
export const COMPOSITE_SHIFT_REPLAY_LIMITS = { timeout: 60000, maxBuffer: 2097152, maxPairChecks: 50000000, maxWorkSteps: 50000000 } as const;
const hash = (s: Buffer | string) => createHash("sha256").update(s).digest("hex");

/** Fixed verified source bytes; collector-trusted execution receipt, not an externally signed attestation. */
export function replayCompositeShift(primary: unknown) {
  const start = performance.now();
  let observedScriptDigest: string | null = null, verifiedScriptDigest: string | null = null;
  let primaryDigest: string | null = null, outputDigest: string | null = null, outputBytes = 0;
  const result = (status: "PASS" | "MISMATCH" | "PARTIAL" | "UNAVAILABLE", reason: string, replay: unknown = null) => {
    const elapsedMs = Math.round(performance.now() - start);
    if (status === "PASS" && elapsedMs >= COMPOSITE_SHIFT_REPLAY_LIMITS.timeout) { status = "UNAVAILABLE"; reason = "WRAPPER_TIME_LIMIT"; }
    return { method: "FIXED_PYTHON_COMPOSITE_SHIFT_REPLAY_V1", status, reason,
      expectedScriptDigest: COMPOSITE_SHIFT_REPLAY_SHA256, observedScriptDigest, verifiedScriptDigest, primaryDigest,
      outputDigest, outputBytes, elapsedMs, limits: COMPOSITE_SHIFT_REPLAY_LIMITS, replay,
      scope: "FINITE_SELECTED_COMPOSITE_BRANCHES_NOT_ROOT_OR_NOVELTY" };
  };
  if (!verifyCompositeShiftPacket(primary)) return result("MISMATCH", "PRIMARY_INVARIANT_INVALID");
  primaryDigest = primary.packetDigest;
  if (primary.status !== "COMPLETE") return result("PARTIAL", "PRIMARY_PARTIAL");
  try {
    const source = readFileSync(resolve("scripts/operations/composite-shift-replay.py"));
    observedScriptDigest = hash(source);
    if (observedScriptDigest !== COMPOSITE_SHIFT_REPLAY_SHA256) return result("UNAVAILABLE", "SOURCE_PIN_MISMATCH");
    verifiedScriptDigest = observedScriptDigest;
    const remaining = COMPOSITE_SHIFT_REPLAY_LIMITS.timeout - (performance.now() - start);
    if (remaining <= 0) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    const child = spawnSync("python3", ["-I", "-S", "-B", "-c", source.toString("utf8")], { encoding: "utf8",
      timeout: Math.max(1, Math.floor(remaining)), maxBuffer: COMPOSITE_SHIFT_REPLAY_LIMITS.maxBuffer,
      env: { PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1", NODE_ENV: "test" } });
    outputBytes = Buffer.byteLength(child.stdout ?? ""); outputDigest = outputBytes ? hash(child.stdout) : null;
    if (child.error || child.status !== 0) return result("UNAVAILABLE", "REPLAY_PROCESS_FAILED_OR_LIMITED");
    if (outputBytes > COMPOSITE_SHIFT_REPLAY_LIMITS.maxBuffer) return result("UNAVAILABLE", "REPLAY_OUTPUT_LIMIT");
    let raw: unknown;
    try { raw = JSON.parse(child.stdout); } catch { return result("MISMATCH", "REPLAY_JSON_INVALID"); }
    if (!verifyCompositeShiftPacket(raw)) return result("MISMATCH", "REPLAY_INVARIANT_INVALID");
    const status = compareCompositeShiftReplay(primary, raw);
    if (performance.now() - start >= COMPOSITE_SHIFT_REPLAY_LIMITS.timeout) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    return result(status, status === "PASS" ? "EXACT_FULL_CRT_INVARIANTS_AGREE" : status === "PARTIAL" ? "REPLAY_PARTIAL" : "FULL_INVARIANT_MISMATCH", raw);
  } catch { return result("UNAVAILABLE", "REPLAY_IO_UNAVAILABLE"); }
}
export function compositeShiftReplayReceiptDigest(value: ReturnType<typeof replayCompositeShift>) { return compositeShiftHash(value); }
