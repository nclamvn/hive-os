import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { sep } from "node:path";

import { exactReplaySchema, type ExactReplay } from "./math-exact-replay";
import { sha256 } from "./integrity";

const MAX_OUTPUT = 4_096;
const DEADLINE_MS = 30_000;
const answerPattern = /^(0|[1-9][0-9]{0,19})$/;

/** Replay model-authored code with no network or host secrets. This checks
 * execution and answer consistency, not the mathematical derivation. */
export async function runExactBenchmarkReplay(input: {
  code: string | null | undefined;
  claimedAnswer: string | null | undefined;
  image: string | undefined;
  dockerBinary?: string;
}): Promise<ExactReplay> {
  const code = input.code ?? "";
  const claimedAnswer = input.claimedAnswer && answerPattern.test(input.claimedAnswer) ? input.claimedAnswer : null;
  const base = { method: "DOCKER_PYTHON_ANSWER_REPLAY_V1" as const, codeDigest: sha256(code),
    image: input.image ?? null, claimedAnswer };
  if (!code) return exactReplaySchema.parse({ ...base, status: "FAIL", observedAnswer: null, reason: "NO_CODE_OR_ANSWER" });
  if (!input.image) return exactReplaySchema.parse({ ...base, status: "UNAVAILABLE", observedAnswer: null, reason: "IMAGE_NOT_CONFIGURED" });
  if (!/^.+@sha256:[a-f0-9]{64}$/.test(input.image)) throw new Error("Exact replay image must be digest-pinned");

  const directory = await mkdtemp(`${tmpdir()}${sep}hiveos-exact-replay-`);
  try {
    await chmod(directory, 0o755);
    await writeFile(`${directory}${sep}candidate.py`, code, { mode: 0o444 });
    const wrapper = "import runpy; f=runpy.run_path('/candidate/candidate.py').get('answer'); assert callable(f); value=f(); assert type(value) is int and 0 <= value < 10**20; print(value)";
    const output = await new Promise<string | null>((resolve) => {
      const containerName = `hiveos-exact-${randomUUID()}`;
      const stop = () => {
        spawn(input.dockerBinary ?? "docker", ["kill", containerName], { stdio: "ignore", env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH } }).unref();
      };
      const child = spawn(input.dockerBinary ?? "docker", [
        "run", "--rm", "--name", containerName, "--network", "none", "--read-only", "--cap-drop", "ALL",
        "--security-opt", "no-new-privileges:true", "--pids-limit", "64", "--memory", "256m",
        "--memory-swap", "256m", "--cpus", "0.75", "--user", "65532:65532",
        "--tmpfs", "/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777",
        "--mount", `type=bind,src=${directory},dst=/candidate,readonly`,
        input.image!, "python", "-I", "-S", "-B", "-c", wrapper,
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
    const observedAnswer = output && answerPattern.test(output) ? output : null;
    if (!observedAnswer) return exactReplaySchema.parse({ ...base, status: "FAIL", observedAnswer: null, reason: "EXECUTION_FAILED" });
    if (!claimedAnswer) return exactReplaySchema.parse({ ...base, status: "COMPUTED", observedAnswer,
      reason: "UNCLAIMED_ANSWER" });
    return exactReplaySchema.parse({ ...base, status: observedAnswer === claimedAnswer ? "PASS" : "FAIL",
      observedAnswer, reason: observedAnswer === claimedAnswer ? "MATCH" : "OUTPUT_MISMATCH" });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
