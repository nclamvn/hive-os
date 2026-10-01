import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { factorTransferHash, compareFactorTransferReplay, verifyFactorTransferPacket } from "./factor-transfer-check";

export const FACTOR_TRANSFER_REPLAY_SHA256 = "19fd4294c0b5ace65936a918858a62418eb519559392347237d7e6bc186d64f7";
export const FACTOR_TRANSFER_REPLAY_LIMITS = { timeout: 60000, maxBuffer: 2097152, maxPairChecks: 50000000, maxWorkSteps: 50000000 } as const;
const hash = (s: Buffer | string) => createHash("sha256").update(s).digest("hex");

/** Fixed verified bytes only. The receipt relies on the trusted local collector, not external execution attestation. */
export function replayFactorTransfer(primary: unknown) {
  const start = performance.now();
  let observedScriptDigest: string | null = null, verifiedScriptDigest: string | null = null;
  let primaryDigest: string | null = null, outputDigest: string | null = null, outputBytes = 0;
  const result = (status: "PASS" | "MISMATCH" | "PARTIAL" | "UNAVAILABLE", reason: string, replay: unknown = null) => {
    const elapsedMs = Math.round(performance.now() - start);
    if (status === "PASS" && elapsedMs >= FACTOR_TRANSFER_REPLAY_LIMITS.timeout) { status = "UNAVAILABLE"; reason = "WRAPPER_TIME_LIMIT"; }
    return { method: "FIXED_PYTHON_FACTOR_TRANSFER_REPLAY_V1", status, reason,
      expectedScriptDigest: FACTOR_TRANSFER_REPLAY_SHA256, observedScriptDigest, verifiedScriptDigest, primaryDigest,
      outputDigest, outputBytes, elapsedMs, limits: FACTOR_TRANSFER_REPLAY_LIMITS, replay,
      scope: "FINITE_SELECTED_TWO_HOP_GRAPH_NOT_ROOT_OR_TERMINATION_OR_NOVELTY" };
  };
  if (!verifyFactorTransferPacket(primary)) return result("MISMATCH", "PRIMARY_INVARIANT_INVALID");
  primaryDigest = primary.packetDigest;
  if (primary.status !== "COMPLETE") return result("PARTIAL", "PRIMARY_PARTIAL");
  try {
    const source = readFileSync(resolve("scripts/operations/factor-transfer-replay.py"));
    observedScriptDigest = hash(source);
    if (observedScriptDigest !== FACTOR_TRANSFER_REPLAY_SHA256) return result("UNAVAILABLE", "SOURCE_PIN_MISMATCH");
    verifiedScriptDigest = observedScriptDigest;
    const remaining = FACTOR_TRANSFER_REPLAY_LIMITS.timeout - (performance.now() - start);
    if (remaining <= 0) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    const child = spawnSync("python3", ["-I", "-S", "-B", "-c", source.toString("utf8")], { encoding: "utf8",
      timeout: Math.max(1, Math.floor(remaining)), maxBuffer: FACTOR_TRANSFER_REPLAY_LIMITS.maxBuffer,
      env: { PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1", NODE_ENV: "test" } });
    outputBytes = Buffer.byteLength(child.stdout ?? ""); outputDigest = outputBytes ? hash(child.stdout) : null;
    if (child.error || child.status !== 0) return result("UNAVAILABLE", "REPLAY_PROCESS_FAILED_OR_LIMITED");
    if (outputBytes > FACTOR_TRANSFER_REPLAY_LIMITS.maxBuffer) return result("UNAVAILABLE", "REPLAY_OUTPUT_LIMIT");
    let raw: unknown;
    try { raw = JSON.parse(child.stdout); } catch { return result("MISMATCH", "REPLAY_JSON_INVALID"); }
    if (!verifyFactorTransferPacket(raw)) return result("MISMATCH", "REPLAY_INVARIANT_INVALID");
    const status = compareFactorTransferReplay(primary, raw);
    if (performance.now() - start >= FACTOR_TRANSFER_REPLAY_LIMITS.timeout) return result("UNAVAILABLE", "WRAPPER_TIME_LIMIT");
    return result(status, status === "PASS" ? "EXACT_FULL_GRAPH_INVARIANTS_AGREE" : status === "PARTIAL" ? "REPLAY_PARTIAL" : "FULL_INVARIANT_MISMATCH", raw);
  } catch { return result("UNAVAILABLE", "REPLAY_IO_UNAVAILABLE"); }
}
export function factorTransferReplayReceiptDigest(value: ReturnType<typeof replayFactorTransfer>) { return factorTransferHash(value); }
