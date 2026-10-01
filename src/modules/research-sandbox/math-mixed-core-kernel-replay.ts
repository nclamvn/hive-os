import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { isDeepStrictEqual, promisify } from "node:util";
import { mixedCoreKernelPacket } from "./math-mixed-core-kernel";

const execute = promisify(execFile);
export const MIXED_CORE_KERNEL_REPLAY_SHA256 = "92414bdfe8bf351e19e07a4a6a7e6a4db322b279e2d34172643d52af54c30ec0";
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
export function compareMixedCoreKernelReplay(primary: ReturnType<typeof mixedCoreKernelPacket>, raw: unknown) {
  return isDeepStrictEqual(primary, raw) ? "PASS" as const : "MISMATCH" as const;
}

/** Fixed reviewed script, no arguments, model code, network or writes. */
export async function replayMixedCoreKernelPacket(primary: ReturnType<typeof mixedCoreKernelPacket>) {
  const path = join(process.cwd(), "scripts/operations/replay-mixed-core-kernel.py");
  const primaryDigest = hash(JSON.stringify(primary));
  try {
    const scriptDigest = hash(await readFile(path));
    if (scriptDigest !== MIXED_CORE_KERNEL_REPLAY_SHA256) throw new Error("Unreviewed script");
    const { stdout } = await execute("python3", ["-I", "-S", "-B", path], {
      timeout: 10000, maxBuffer: 256000, cwd: process.cwd(),
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
    });
    return { status: compareMixedCoreKernelReplay(primary, JSON.parse(stdout)), scriptDigest,
      primaryDigest, outputDigest: hash(stdout.trim()) };
  } catch {
    return { status: "UNAVAILABLE" as const, scriptDigest: MIXED_CORE_KERNEL_REPLAY_SHA256,
      primaryDigest, outputDigest: null };
  }
}
