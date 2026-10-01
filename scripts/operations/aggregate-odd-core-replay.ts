import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { aggregateOddCoreDecision } from "./aggregate-odd-core-check";

export const AGGREGATE_ODD_CORE_REPLAY_SHA256 = "92e916acd4981c82cc676508ac76a261d7a41a1f8f30a0ed98cd52f222d40a92";
export const AGGREGATE_ODD_CORE_REPLAY_LIMITS = { timeout: 30000, maxBuffer: 256 * 1024 } as const;
const hash = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
export function compareAggregateOddCoreReplay(primary: ReturnType<typeof aggregateOddCoreDecision>, raw: unknown) {
  return isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}
/** Fixed source/artifact/dependency pins, no arbitrary process args or model code. */
export function replayAggregateOddCore(primary: ReturnType<typeof aggregateOddCoreDecision>) {
  const primaryDigest = hash(JSON.stringify(primary));
  try {
    if (!isDeepStrictEqual(primary, aggregateOddCoreDecision())) throw new Error("Aggregate scope/output drift");
    const script = resolve("scripts/operations/aggregate-odd-core-replay.py");
    if (hash(readFileSync(script)) !== AGGREGATE_ODD_CORE_REPLAY_SHA256) throw new Error("Replay source drift");
    const result = spawnSync("python3", ["-I", "-S", "-B", script], {
      encoding: "utf8", ...AGGREGATE_ODD_CORE_REPLAY_LIMITS,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    if (result.error || result.status !== 0) throw new Error("Independent replay unavailable");
    let raw: unknown;
    try { raw = JSON.parse(result.stdout); }
    catch { return { status: "MISMATCH" as const, scriptDigest: AGGREGATE_ODD_CORE_REPLAY_SHA256, primaryDigest, outputDigest: hash(result.stdout.trim()) }; }
    return { status: compareAggregateOddCoreReplay(primary, raw), scriptDigest: AGGREGATE_ODD_CORE_REPLAY_SHA256,
      primaryDigest, outputDigest: hash(result.stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: AGGREGATE_ODD_CORE_REPLAY_SHA256, primaryDigest, outputDigest: null };
  }
}
