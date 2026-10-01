import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { splitSupportPacket } from "./split-support-check";

export const SPLIT_SUPPORT_REPLAY_SHA256 = "877cbe16fd4a3f58eeae83e9344122151b2d1f15553883c49cc7aa0cce8e6c8b";
export const SPLIT_SUPPORT_REPLAY_LIMITS = { timeout: 30000, maxBuffer: 256 * 1024 } as const;
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
export function compareSplitSupportReplay(primary: ReturnType<typeof splitSupportPacket>, raw: unknown) {
  return primary.status === "COMPLETE_FOR_35_FIXED_RAYS" && isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}
/** Fixed isolated checker; no supplied code, executable path, arguments or environment secrets. */
export function replaySplitSupport(primary: ReturnType<typeof splitSupportPacket>) {
  const primaryDigest = hash(JSON.stringify(primary));
  try {
    if (primary.status !== "COMPLETE_FOR_35_FIXED_RAYS" || !isDeepStrictEqual(primary, splitSupportPacket())) throw new Error("Primary incomplete or drift");
    const script = resolve("scripts/operations/split-support-replay.py");
    if (hash(readFileSync(script)) !== SPLIT_SUPPORT_REPLAY_SHA256) throw new Error("Source drift");
    const result = spawnSync("python3", ["-I", "-S", "-B", script], {
      encoding: "utf8", ...SPLIT_SUPPORT_REPLAY_LIMITS,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    if (result.error || result.status !== 0) throw new Error("Replay unavailable");
    let raw: unknown;
    try { raw = JSON.parse(result.stdout); }
    catch { return { status: "MISMATCH" as const, scriptDigest: SPLIT_SUPPORT_REPLAY_SHA256, primaryDigest, outputDigest: hash(result.stdout.trim()) }; }
    return { status: compareSplitSupportReplay(primary, raw), scriptDigest: SPLIT_SUPPORT_REPLAY_SHA256, primaryDigest,
      outputDigest: hash(result.stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: null, expectedScriptDigest: SPLIT_SUPPORT_REPLAY_SHA256,
      primaryDigest, outputDigest: null };
  }
}
