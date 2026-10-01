import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { twoCoreTargetPacket } from "./two-core-target";

export const TWO_CORE_TARGET_REPLAY_SHA256 = "3d6236f96239076cba5640ce4cfd1e111aeadfc3a621e87c125f6cd99958c68f";
export const TWO_CORE_TARGET_REPLAY_LIMITS = { timeout: 10000, maxBuffer: 256 * 1024 } as const;
const digest = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

export function compareTwoCoreTargetReplay(primary: ReturnType<typeof twoCoreTargetPacket>, raw: unknown) {
  return isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}

/** Fixed digest-pinned tool; accepts no process arguments, model code or file path. */
export function replayTwoCoreTargetPacket(primary: ReturnType<typeof twoCoreTargetPacket>) {
  const primaryDigest = digest(JSON.stringify(primary));
  try {
    const path = resolve("scripts/operations/two-core-target-replay.py");
    if (digest(readFileSync(path)) !== TWO_CORE_TARGET_REPLAY_SHA256) throw new Error("Unreviewed replay source");
    const result = spawnSync("python3", ["-I", "-S", "-B", path], {
      encoding: "utf8", ...TWO_CORE_TARGET_REPLAY_LIMITS,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    if (result.error || result.status !== 0) throw new Error("Replay unavailable");
    let raw: unknown;
    try { raw = JSON.parse(result.stdout); }
    catch { return { status: "MISMATCH" as const, scriptDigest: TWO_CORE_TARGET_REPLAY_SHA256, primaryDigest, outputDigest: digest(result.stdout.trim()) }; }
    return { status: compareTwoCoreTargetReplay(primary, raw), scriptDigest: TWO_CORE_TARGET_REPLAY_SHA256,
      primaryDigest, outputDigest: digest(result.stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: TWO_CORE_TARGET_REPLAY_SHA256, primaryDigest, outputDigest: null };
  }
}
