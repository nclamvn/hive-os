import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import { formalCheckSchema, PILOT_LEAN_IMAGE, type FormalCheck } from "./math-formal-check";
import { assembleFormalSource, formalClaimDigest, type FormalClaim } from "./math-formal-claim";
import { formalReplaySchema, type FormalReplay } from "./math-formal-replay";

const CHECKER_COMMIT = "0c3323271991c2dfe75f8be7d21bf93886419736" as const;
const DEADLINE_MS = 240_000;
const MAX_OUTPUT = 16_384;
const SUCCESS_MARKER = "HIVEOS_FRESH_REPLAY_OK";

function boundedDocker(input: { docker: string; args: string[]; deadlineMs: number; containerName?: string }) {
  return new Promise<{ exit: number | null; raw: string }>((resolve) => {
    const child = spawn(input.docker, input.args, { shell: false, stdio: ["ignore", "pipe", "pipe"],
      env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH } });
    let raw = "";
    let bytes = 0;
    let settled = false;
    const finish = (exit: number | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ exit, raw });
    };
    const stop = () => {
      if (input.containerName) spawn(input.docker, ["kill", input.containerName], { stdio: "ignore",
        env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH } }).unref();
      child.kill("SIGKILL");
    };
    const timer = setTimeout(() => { stop(); finish(null); }, input.deadlineMs);
    const capture = (chunk: Buffer) => {
      bytes += chunk.byteLength;
      if (bytes > MAX_OUTPUT) { stop(); finish(null); }
      else raw += chunk.toString("utf8");
    };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    child.on("error", () => finish(null));
    child.on("close", (exit) => finish(exit));
  });
}

/** Replay a bound source in a second, commit-pinned checker executable. */
export async function runFormalLeanReplay(input: {
  target: FormalClaim; tactics: string; primaryCheck: FormalCheck; imageId?: string; dockerBinary?: string;
}): Promise<FormalReplay> {
  const source = assembleFormalSource(input.target, input.tactics);
  const sourceDigest = sha256(source);
  const targetDigest = formalClaimDigest(input.target);
  const primaryCheck = formalCheckSchema.parse(input.primaryCheck);
  if (primaryCheck.status !== "KERNEL_ACCEPTED_ALIGNMENT_PENDING" ||
    primaryCheck.reason !== "ALLOWED_AXIOMS" || primaryCheck.image !== PILOT_LEAN_IMAGE ||
    primaryCheck.targetDigest !== targetDigest || primaryCheck.sourceDigest !== sourceDigest) {
    throw new Error("Fresh replay requires a bound, kernel-accepted primary check");
  }
  const base = {
    version: 1 as const, method: "LEAN4CHECKER_FRESH_V1" as const,
    targetDigest, sourceDigest, primaryCheckDigest: sha256(canonicalJson(primaryCheck)),
    imageId: input.imageId ?? null, checkerCommit: CHECKER_COMMIT,
    toolchain: "Lean 4.10.0 / Std / lean4checker --fresh" as const,
    outputDigest: null as string | null, diagnostic: "",
  };
  if (!input.imageId || !/^sha256:[a-f0-9]{64}$/.test(input.imageId)) return formalReplaySchema.parse({
    ...base, imageId: null, status: "UNAVAILABLE", reason: "RUNTIME_UNAVAILABLE",
    diagnostic: "A locally built immutable checker image is not configured",
  });
  const docker = input.dockerBinary ?? "docker";
  const inspect = await boundedDocker({ docker, deadlineMs: 10_000, args: ["image", "inspect", "--format",
    '{{index .Config.Labels "org.hiveos.leanchecker.commit"}}|{{index .Config.Labels "org.hiveos.lean.version"}}|{{index .Config.Labels "org.hiveos.replay.base"}}',
    input.imageId] });
  if (inspect.exit !== 0 || inspect.raw.trim() !== `${CHECKER_COMMIT}|4.10.0|${PILOT_LEAN_IMAGE.split("@")[1]}`) {
    return formalReplaySchema.parse({ ...base, status: "UNAVAILABLE", reason: "RUNTIME_UNAVAILABLE",
      diagnostic: "Checker image identity or build provenance could not be verified" });
  }
  const directory = await mkdtemp(join(tmpdir(), "hiveos-formal-replay-"));
  try {
    await chmod(directory, 0o755);
    await writeFile(join(directory, "Proof.lean"), source, { mode: 0o444 });
    const containerName = `hiveos-replay-${randomUUID()}`;
    const script = [
      "set -eu", "cp /certificate/Proof.lean /work/Proof.lean", "cd /work",
      "lean -o Proof.olean Proof.lean",
      "LEAN_PATH=/work /usr/local/bin/lean4checker --fresh Proof",
      `printf '${SUCCESS_MARKER}\\n'`,
    ].join("\n");
    const result = await boundedDocker({ docker, deadlineMs: DEADLINE_MS, containerName, args: [
      "run", "--rm", "--pull", "never", "--platform", "linux/amd64", "--name", containerName,
      "--network", "none", "--read-only", "--cap-drop", "ALL", "--security-opt", "no-new-privileges:true",
      "--pids-limit", "64", "--memory", "1g", "--memory-swap", "1g", "--cpus", "1",
      "--user", "1000:1000", "--tmpfs", "/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777",
      "--tmpfs", "/work:rw,nosuid,nodev,size=64m,mode=1777",
      "--mount", `type=bind,src=${directory},dst=/certificate,readonly`,
      "--entrypoint", "sh", input.imageId, "-lc", script,
    ] });
    const raw = result.raw.trim();
    const outputDigest = raw ? sha256(raw) : null;
    if (result.exit === null) return formalReplaySchema.parse({ ...base, status: "UNAVAILABLE", reason: "RUNTIME_UNAVAILABLE",
      outputDigest, diagnostic: "Fresh kernel replay exceeded its bounded runtime or output ceiling" });
    if (result.exit !== 0) return formalReplaySchema.parse({ ...base, status: "REJECTED", reason: "CHECKER_ERROR",
      outputDigest, diagnostic: "The fresh Lean checker rejected the compiled candidate" });
    if (raw.split(/\r?\n/).filter((line) => line === SUCCESS_MARKER).length !== 1 ||
      /\berror:|\bwarning:/i.test(raw)) return formalReplaySchema.parse({
      ...base, status: "REJECTED", reason: "OUTPUT_INVALID", outputDigest,
      diagnostic: "Fresh checker output was ambiguous",
    });
    return formalReplaySchema.parse({ ...base, status: "REPLAY_ACCEPTED", reason: "FRESH_REPLAY_OK",
      outputDigest, diagnostic: "The compiled olean was replayed through a fresh Lean kernel environment" });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
