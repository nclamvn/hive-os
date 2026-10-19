import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { z } from "zod";

import { EXACT_INTERVAL_101GON_PROGRAM_DIGEST, exactIntervalOutputDigest,
  exactIntervalSchema, type ExactInterval } from "./math-exact-interval";
import { sha256 } from "./integrity";

const MAX_OUTPUT = 4_096;
const DEADLINE_MS = 30_000;
const programOutputSchema = z.object({
  method: z.literal("INTERVAL_101GON_V1"),
  scaleDigits: z.literal(80),
  lowerScaled: z.string().regex(/^(0|[1-9][0-9]{0,119})$/),
  upperScaled: z.string().regex(/^(0|[1-9][0-9]{0,119})$/),
  floor: z.string().regex(/^(0|[1-9][0-9]{0,19})$/).nullable(),
  eventCount: z.literal(80_850),
  crossingWidthScaled: z.string().regex(/^(0|[1-9][0-9]{0,119})$/),
}).strict();

/** Run fixed, digest-pinned code, never the model's answer() source. */
export async function runExactInterval101Gon(input: { image: string | undefined; dockerBinary?: string }): Promise<ExactInterval> {
  const program = await readFile(new URL("../../../scripts/math/interval_101gon.py", import.meta.url), "utf8");
  if (sha256(program) !== EXACT_INTERVAL_101GON_PROGRAM_DIGEST) throw new Error("The fixed interval program changed without a version bump");
  const base = { method: "INTERVAL_101GON_V1" as const, programDigest: EXACT_INTERVAL_101GON_PROGRAM_DIGEST,
    image: input.image ?? null, outputDigest: null, scaleDigits: null, lowerScaled: null, upperScaled: null,
    floor: null, eventCount: null, crossingWidthScaled: null };
  if (!input.image) return exactIntervalSchema.parse({ ...base, status: "UNAVAILABLE", reason: "IMAGE_NOT_CONFIGURED" });
  if (!/^.+@sha256:[a-f0-9]{64}$/.test(input.image)) throw new Error("Interval image must be digest-pinned");

  const directory = await mkdtemp(join(tmpdir(), "hiveos-exact-interval-"));
  try {
    await chmod(directory, 0o755);
    await writeFile(join(directory, "interval.py"), program, { mode: 0o444 });
    const raw = await new Promise<string | null>((resolve) => {
      const containerName = `hiveos-interval-${randomUUID()}`;
      const stop = () => {
        spawn(input.dockerBinary ?? "docker", ["kill", containerName], {
          stdio: "ignore", env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH },
        }).unref();
      };
      const child = spawn(input.dockerBinary ?? "docker", [
        "run", "--rm", "--name", containerName, "--network", "none", "--read-only", "--cap-drop", "ALL",
        "--security-opt", "no-new-privileges:true", "--pids-limit", "64", "--memory", "256m",
        "--memory-swap", "256m", "--cpus", "0.75", "--user", "65532:65532",
        "--tmpfs", "/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777",
        "--mount", `type=bind,src=${directory},dst=/certificate,readonly`,
        input.image!, "python", "-I", "-S", "-B", "/certificate/interval.py",
      ], { shell: false, stdio: ["pipe", "pipe", "pipe"], env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH } });
      child.stdin.end();
      let stdout = "";
      let bytes = 0;
      let settled = false;
      const finish = (value: string | null) => { if (!settled) { settled = true; clearTimeout(timer); resolve(value); } };
      const timer = setTimeout(() => { stop(); child.kill("SIGKILL"); finish(null); }, DEADLINE_MS);
      child.stdout.on("data", (chunk: Buffer) => {
        bytes += chunk.byteLength;
        if (bytes > MAX_OUTPUT) { stop(); child.kill("SIGKILL"); finish(null); }
        else stdout += chunk.toString("utf8");
      });
      child.stderr.on("data", (chunk: Buffer) => {
        bytes += chunk.byteLength;
        if (bytes > MAX_OUTPUT) { stop(); child.kill("SIGKILL"); finish(null); }
      });
      child.on("error", () => finish(null));
      child.on("close", (exit) => finish(exit === 0 ? stdout.trim() : null));
    });
    if (!raw) return exactIntervalSchema.parse({ ...base, status: "FAIL", reason: "EXECUTION_FAILED" });
    let decoded: unknown;
    try { decoded = JSON.parse(raw); } catch { decoded = null; }
    const parsed = programOutputSchema.safeParse(decoded);
    if (!parsed.success) return exactIntervalSchema.parse({ ...base, status: "FAIL", reason: "OUTPUT_INVALID" });
    const value = parsed.data;
    const scale = BigInt(10) ** BigInt(80);
    const lower = BigInt(value.lowerScaled);
    const upper = BigInt(value.upperScaled);
    const uniqueFloor = lower <= upper && lower / scale === upper / scale ? String(lower / scale) : null;
    if (uniqueFloor !== value.floor) return exactIntervalSchema.parse({ ...base, status: "FAIL", reason: "OUTPUT_INVALID" });
    return exactIntervalSchema.parse({
      ...base, status: uniqueFloor ? "CERTIFIED" : "INCONCLUSIVE",
      reason: uniqueFloor ? "UNIQUE_FLOOR" : "STRADDLES_BOUNDARY",
      outputDigest: exactIntervalOutputDigest(raw), scaleDigits: value.scaleDigits,
      lowerScaled: value.lowerScaled, upperScaled: value.upperScaled,
      floor: value.floor, eventCount: value.eventCount, crossingWidthScaled: value.crossingWidthScaled,
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
