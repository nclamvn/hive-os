import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { higherpowerCorePacket } from "./higherpower-core-check";

export const HIGHERPOWER_REPLAY_SHA256 = "4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad";
export const HIGHERPOWER_REPLAY_LIMITS = { timeout: 30000, maxBuffer: 256 * 1024 } as const;
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
export function compareHigherpowerReplay(primary: ReturnType<typeof higherpowerCorePacket>, raw: unknown) {
  return primary.status === "COMPLETE" && isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}
/** Fixed code path and source pin. No supplied code, arbitrary arguments or environment secrets. */
export function replayHigherpowerCore(primary: ReturnType<typeof higherpowerCorePacket>) {
  const primaryDigest = hash(JSON.stringify(primary));
  try {
    if (primary.status !== "COMPLETE" || !isDeepStrictEqual(primary, higherpowerCorePacket())) throw new Error("Incomplete/drifted primary");
    const script = resolve("scripts/operations/higherpower-core-replay.py");
    if (hash(readFileSync(script)) !== HIGHERPOWER_REPLAY_SHA256) throw new Error("Replay source drift");
    const result = spawnSync("python3", ["-I", "-S", "-B", script], {
      encoding: "utf8", ...HIGHERPOWER_REPLAY_LIMITS,
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    if (result.error || result.status !== 0) throw new Error("Replay unavailable");
    let raw: unknown;
    try { raw = JSON.parse(result.stdout); }
    catch { return { status: "MISMATCH" as const, scriptDigest: HIGHERPOWER_REPLAY_SHA256, primaryDigest, outputDigest: hash(result.stdout.trim()) }; }
    return { status: compareHigherpowerReplay(primary, raw), scriptDigest: HIGHERPOWER_REPLAY_SHA256,
      primaryDigest, outputDigest: hash(result.stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: null,
      expectedScriptDigest: HIGHERPOWER_REPLAY_SHA256, primaryDigest, outputDigest: null };
  }
}
