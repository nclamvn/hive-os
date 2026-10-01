import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { loadCertifiedTwoCoreArtifact, verifyCertifiedTwoCoreArtifact } from "./certified-two-core-check";

export const CERTIFIED_TWO_CORE_REPLAY_SHA256 = "6c78cc56b61e9497f3610219cfb51ff6583f831c81c07ce3bdd2c8b8ba612c7b";
export const CERTIFIED_TWO_CORE_REPLAY_LIMITS = { timeout: 30000, maxBuffer: 256 * 1024 } as const;
const hash = (text: string | Buffer) => createHash("sha256").update(text).digest("hex");
export function compareCertifiedTwoCoreReplay(primary: ReturnType<typeof verifyCertifiedTwoCoreArtifact>, raw: unknown) {
  return isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}
/** Both fixed sources/artifact are pinned; never takes a script path or CLI input. */
export function replayCertifiedTwoCore(primary: ReturnType<typeof verifyCertifiedTwoCoreArtifact>) {
  const primaryDigest = hash(JSON.stringify(primary));
  try {
    // Recheck fixed artifact and complete local certificate before dispatch.
    if (!isDeepStrictEqual(primary, verifyCertifiedTwoCoreArtifact(loadCertifiedTwoCoreArtifact()))) throw new Error("Primary certificate drift");
    const path = resolve("scripts/operations/certified-two-core-replay.py");
    if (hash(readFileSync(path)) !== CERTIFIED_TWO_CORE_REPLAY_SHA256) throw new Error("Replay source drift");
    const result = spawnSync("python3", ["-I", "-S", "-B", path], {
      encoding: "utf8", ...CERTIFIED_TWO_CORE_REPLAY_LIMITS,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    if (result.error || result.status !== 0) throw new Error("Replay unavailable");
    let raw: unknown;
    try { raw = JSON.parse(result.stdout); }
    catch { return { status: "MISMATCH" as const, scriptDigest: CERTIFIED_TWO_CORE_REPLAY_SHA256, primaryDigest, outputDigest: hash(result.stdout.trim()) }; }
    return { status: compareCertifiedTwoCoreReplay(primary, raw), scriptDigest: CERTIFIED_TWO_CORE_REPLAY_SHA256,
      primaryDigest, outputDigest: hash(result.stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: CERTIFIED_TWO_CORE_REPLAY_SHA256, primaryDigest, outputDigest: null };
  }
}
