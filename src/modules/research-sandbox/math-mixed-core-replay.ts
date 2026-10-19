import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isDeepStrictEqual, promisify } from "node:util";
import { mixedCoreReplayProjection, mixedCoreResearchPacket } from "./math-mixed-core";

const execute = promisify(execFile);
export const MIXED_CORE_REPLAY_SHA256 = "9da0dfd3774d9ea2162d5a31fd18c3d82d398ecf918ccae19acfbfffa64297a5";

export function compareMixedCoreReplay(primary: ReturnType<typeof mixedCoreResearchPacket>, raw: unknown) {
  return isDeepStrictEqual(mixedCoreReplayProjection(primary), raw) ? "PASS" as const : "MISMATCH" as const;
}

/** Fixed reviewed script only: no user arguments, imports, LLM code, or host writes. */
export async function replayMixedCorePacket(primary: ReturnType<typeof mixedCoreResearchPacket>) {
  const path = join(process.cwd(), "scripts/operations/replay-mixed-core.py");
  try {
    const script = await readFile(path);
    const scriptDigest = createHash("sha256").update(script).digest("hex");
    if (scriptDigest !== MIXED_CORE_REPLAY_SHA256) throw new Error("Unreviewed script");
    const { stdout } = await execute("python3", ["-I", "-S", "-B", path], {
      timeout: 10000, maxBuffer: 256000, cwd: process.cwd(),
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    const status = compareMixedCoreReplay(primary, JSON.parse(stdout));
    return { status, scriptDigest, primaryDigest: primary.digest,
      outputDigest: createHash("sha256").update(stdout.trim(), "utf8").digest("hex") };
  } catch {
    // Never surface process environments, credentials, stdout or arbitrary errors.
    return { status: "UNAVAILABLE" as const, scriptDigest: MIXED_CORE_REPLAY_SHA256,
      primaryDigest: primary.digest, outputDigest: null };
  }
}
