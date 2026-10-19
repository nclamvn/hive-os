import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sha256 } from "./integrity";
import { assembleFormalSource, formalClaimDigest, type FormalClaim } from "./math-formal-claim";
import { formalCheckSchema, PILOT_LEAN_IMAGE, type FormalCheck } from "./math-formal-check";

export { PILOT_LEAN_IMAGE } from "./math-formal-check";

const DEADLINE_MS = 60_000;
const MAX_OUTPUT = 16_384;
const ALLOWED_AXIOMS = new Set(["propext", "Classical.choice", "Quot.sound"]);

function auditedAxioms(output: string, theoremName: string): string[] | null {
  const statements = output.split(/\r?\n/).filter((line) => line.includes(`'${theoremName}'`));
  if (statements.length !== 1) return null;
  const line = statements[0].trim();
  if (line === `'${theoremName}' does not depend on any axioms`) return [];
  const match = line.match(new RegExp(`^'${theoremName}' depends on axioms: \\[([^\\]]*)\\]$`));
  if (!match) return null;
  return match[1].trim() ? match[1].split(",").map((item) => item.trim()) : [];
}

/** Compilation is exploratory evidence only: semantic alignment is a separate gate. */
export async function runFormalLeanCheck(input: {
  target: FormalClaim; tactics: string; image?: string; dockerBinary?: string;
}): Promise<FormalCheck> {
  const source = assembleFormalSource(input.target, input.tactics);
  const base = {
    version: 1 as const, method: "PINNED_LEAN_AXIOM_AUDIT_V1" as const,
    targetDigest: formalClaimDigest(input.target), sourceDigest: sha256(source),
    image: input.image ?? null, toolchain: "Lean 4.10.0 / no mathlib import" as const,
    axioms: [] as string[], outputDigest: null as string | null, diagnostic: "",
    compilerFeedback: null as string | null,
  };
  if (!input.image || input.image !== PILOT_LEAN_IMAGE) return formalCheckSchema.parse({
    ...base, status: "UNAVAILABLE", reason: "RUNTIME_UNAVAILABLE", diagnostic: "Configured Lean runtime is absent or not the pilot digest",
  });
  const directory = await mkdtemp(join(tmpdir(), "hiveos-formal-check-"));
  try {
    await chmod(directory, 0o755);
    await writeFile(join(directory, "Proof.lean"), source, { mode: 0o444 });
    const output = await new Promise<{ exit: number | null; raw: string }>((resolve) => {
      const docker = input.dockerBinary ?? "docker";
      const containerName = `hiveos-formal-${randomUUID()}`;
      const child = spawn(docker, [
        "run", "--rm", "--pull", "never", "--platform", "linux/amd64", "--name", containerName,
        "--network", "none", "--read-only", "--cap-drop", "ALL", "--security-opt", "no-new-privileges:true",
        "--pids-limit", "64", "--memory", "1g", "--memory-swap", "1g", "--cpus", "1",
        "--user", "1000:1000", "--tmpfs", "/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777",
        "--mount", `type=bind,src=${directory},dst=/certificate,readonly`,
        "--entrypoint", "lean", input.image!, "/certificate/Proof.lean",
      ], { shell: false, stdio: ["pipe", "pipe", "pipe"], env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH } });
      child.stdin.end();
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
        spawn(docker, ["kill", containerName], { stdio: "ignore", env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH } }).unref();
        child.kill("SIGKILL");
      };
      const timer = setTimeout(() => { stop(); finish(null); }, DEADLINE_MS);
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
    const raw = output.raw.trim();
    const digest = raw ? sha256(raw) : null;
    if (output.exit === null) return formalCheckSchema.parse({ ...base, status: "UNAVAILABLE", reason: "RUNTIME_UNAVAILABLE",
      outputDigest: digest, diagnostic: "Lean checker did not finish within the bounded runtime" });
    const axioms = auditedAxioms(raw, input.target.theoremName);
    if (output.exit !== 0) return formalCheckSchema.parse({ ...base, status: "REJECTED", reason: "COMPILER_ERROR",
      outputDigest: digest, diagnostic: "Lean returned a compilation error",
      compilerFeedback: raw.replace(/\x1b\[[0-9;]*m/g, "").replaceAll("/certificate/Proof.lean", "Proof.lean")
        .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").slice(0, 2_000) });
    if (!axioms || /\bwarning:|\berror:/i.test(raw)) return formalCheckSchema.parse({ ...base, status: "REJECTED", reason: "OUTPUT_INVALID",
      outputDigest: digest, diagnostic: "Lean diagnostics or theorem audit are ambiguous" });
    if (axioms.some((axiom) => !ALLOWED_AXIOMS.has(axiom))) return formalCheckSchema.parse({
      ...base, status: "REJECTED", reason: "UNSAFE_AXIOM", axioms, outputDigest: digest,
      diagnostic: "The theorem transitively depends on a disallowed axiom",
    });
    return formalCheckSchema.parse({ ...base, status: "KERNEL_ACCEPTED_ALIGNMENT_PENDING", reason: "ALLOWED_AXIOMS",
      axioms, outputDigest: digest, diagnostic: "Lean accepted the fixed statement; semantic alignment is not yet attested" });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
