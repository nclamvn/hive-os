import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { loadSquareCoreArtifact, verifySquareCoreArtifact } from "./square-core-check";

export const SQUARE_CORE_REPLAY_SHA256 = "ca888f9de3a179d34c086113c1bae3b17fda3c21789ac22e9f842c8b83e20eae";
export const SQUARE_CORE_REPLAY_LIMITS = { timeout: 30000, maxBuffer: 256 * 1024 } as const;
const hash = (text: string | Buffer) => createHash("sha256").update(text).digest("hex");
export function compareSquareCoreReplay(primary: ReturnType<typeof verifySquareCoreArtifact>, raw: unknown) {
  return isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}
/** Fixed paths, source/data pins, no user-input execution or environment secrets. */
export function replaySquareCore(primary: ReturnType<typeof verifySquareCoreArtifact>) {
  const primaryDigest = hash(JSON.stringify(primary));
  try {
    if (!isDeepStrictEqual(primary, verifySquareCoreArtifact(loadSquareCoreArtifact()))) throw new Error("Primary drift");
    const path = resolve("scripts/operations/square-core-replay.py");
    if (hash(readFileSync(path)) !== SQUARE_CORE_REPLAY_SHA256) throw new Error("Replay source drift");
    const result = spawnSync("python3", ["-I", "-S", "-B", path], {
      encoding: "utf8", ...SQUARE_CORE_REPLAY_LIMITS,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    if (result.error || result.status !== 0) throw new Error("Replay unavailable");
    let raw: unknown;
    try { raw = JSON.parse(result.stdout); }
    catch { return { status: "MISMATCH" as const, scriptDigest: SQUARE_CORE_REPLAY_SHA256, primaryDigest, outputDigest: hash(result.stdout.trim()) }; }
    return { status: compareSquareCoreReplay(primary, raw), scriptDigest: SQUARE_CORE_REPLAY_SHA256, primaryDigest, outputDigest: hash(result.stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: SQUARE_CORE_REPLAY_SHA256, primaryDigest, outputDigest: null };
  }
}
