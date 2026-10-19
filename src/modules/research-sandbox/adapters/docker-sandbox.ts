import { randomUUID } from "node:crypto";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

import type { ComputationRequest, SandboxExecutor, SandboxExecutorResult } from "../contracts";
import { ResearchSandboxError } from "../errors";
import { sha256 } from "../integrity";
import type { ObjectStorage } from "@/server/storage";

export interface DockerRuntimeDefinition {
  runtimeId: string;
  runtimeVersion: string;
  kind: "LATEX_BUILD" | "CAS" | "JUPYTER";
  /** Digest-pinned OCI reference is mandatory unless explicitly relaxed in tests. */
  image: string;
}

export interface DockerSandboxExecutorOptions {
  runtime: DockerRuntimeDefinition;
  storage: ObjectStorage;
  dockerBinary?: string;
  allowUnpinnedImageForTests?: boolean;
}

/** Docker-outside-of-Docker executor with a fixed, shell-free command map. */
export class DockerSandboxExecutor implements SandboxExecutor {
  readonly runtimeId: string;
  readonly runtimeVersion: string;
  private readonly runtime: DockerRuntimeDefinition;
  private readonly storage: ObjectStorage;
  private readonly dockerBinary: string;
  private readonly allowUnpinnedImageForTests: boolean;

  constructor(options: DockerSandboxExecutorOptions) {
    this.runtime = options.runtime;
    this.runtimeId = options.runtime.runtimeId;
    this.runtimeVersion = options.runtime.runtimeVersion;
    this.storage = options.storage;
    this.dockerBinary = options.dockerBinary ?? "docker";
    this.allowUnpinnedImageForTests = options.allowUnpinnedImageForTests ?? false;
    if (!this.allowUnpinnedImageForTests && !/@sha256:[a-f0-9]{64}$/.test(this.runtime.image)) {
      throw new ResearchSandboxError("INVALID_INPUT", "Sandbox runtime image must be pinned by digest");
    }
  }

  async execute(input: Omit<ComputationRequest, "idempotencyKey">): Promise<SandboxExecutorResult> {
    if (input.runtimeId !== this.runtimeId || input.runtimeVersion !== this.runtimeVersion || input.kind !== this.runtime.kind) {
      throw new ResearchSandboxError("PROVIDER_MISMATCH", "Docker runtime does not match the governed request");
    }
    if (input.networkPolicy !== "DENY_ALL" || input.networkAllowlist.length) {
      throw new ResearchSandboxError("INVALID_INPUT", "Docker sandbox supports DENY_ALL only; allowlisted egress requires a governed network proxy");
    }
    const entrypoint = validateEntrypoint(input.entrypoint, input.kind);
    const inputKey = artifactKey(input.inputReference);
    const inputBody = await this.storage.get(inputKey);
    if (!inputBody) throw new ResearchSandboxError("NOT_FOUND", "Sandbox input artifact was not found");
    const inputBuffer = Buffer.from(inputBody);
    if (sha256(inputBuffer) !== input.inputDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sandbox input artifact digest does not match the governed request");
    }

    const root = await mkdtemp(path.join(tmpdir(), "hiveos-sandbox-"));
    const inputDir = path.join(root, "input");
    const outputDir = path.join(root, "output");
    const containerName = `hiveos-sandbox-${randomUUID()}`;
    try {
      await mkdir(inputDir, { mode: 0o755 });
      await mkdir(outputDir, { mode: 0o777 });
      await chmod(outputDir, 0o777);
      await writeFile(path.join(inputDir, entrypoint), inputBuffer, { mode: 0o444 });
      const imageDigest = await inspectImageDigest(this.dockerBinary, this.runtime.image, this.allowUnpinnedImageForTests);
      const wallStarted = performance.now();
      const cpus = Math.max(0.1, Math.min(1, input.resourceLimits.maxCpuMillis / (input.resourceLimits.maxWallSeconds * 1_000)));
      const command = runtimeCommand(input.kind, entrypoint);
      const run = await runProcess(
        this.dockerBinary,
        [
          "run",
          "--rm",
          "--name", containerName,
          "--network", "none",
          "--read-only",
          "--cap-drop", "ALL",
          "--security-opt", "no-new-privileges:true",
          "--pids-limit", "128",
          "--memory", `${input.resourceLimits.maxMemoryMb}m`,
          "--memory-swap", `${input.resourceLimits.maxMemoryMb}m`,
          "--cpus", cpus.toFixed(3),
          "--user", "65532:65532",
          "--tmpfs", "/tmp:rw,noexec,nosuid,nodev,size=64m,mode=1777",
          "--mount", `type=bind,src=${inputDir},dst=/workspace/input,readonly`,
          "--mount", `type=bind,src=${outputDir},dst=/workspace/output`,
          "--workdir", "/workspace",
          this.runtime.image,
          ...command,
        ],
        input.resourceLimits.maxWallSeconds * 1_000,
        input.resourceLimits.maxOutputBytes,
        async () => {
          await runProcess(this.dockerBinary, ["kill", containerName], 5_000, 16_384).catch(() => undefined);
        },
      );
      const wallMillis = Math.ceil(performance.now() - wallStarted);
      if (run.exitCode !== 0) {
        throw new ResearchSandboxError("INVALID_INPUT", `Sandbox process exited with code ${run.exitCode}`);
      }
      const outputBody = await collectOutput(input.kind, entrypoint, outputDir, run.stdout);
      if (outputBody.byteLength > input.resourceLimits.maxOutputBytes) {
        throw new ResearchSandboxError("SANDBOX_LIMIT_EXCEEDED", "Sandbox output exceeded the governed byte ceiling");
      }
      const outputDigest = sha256(outputBody);
      const extension = outputExtension(input.kind);
      const outputKey = `research-sandbox/outputs/${input.missionId}/${randomUUID()}/result.${extension}`;
      const outputMediaType = outputMediaTypeFor(input.kind);
      await this.storage.put(outputKey, outputBody, { contentType: outputMediaType });
      return {
        runtimeId: this.runtimeId,
        runtimeVersion: this.runtimeVersion,
        outputReference: `artifact://${outputKey}`,
        outputDigest,
        outputMediaType,
        outputBody,
        outputBytes: outputBody.byteLength,
        // Docker enforces these ceilings. The manifest intentionally records
        // conservative upper bounds instead of inventing sampled telemetry.
        cpuMillis: Math.min(input.resourceLimits.maxCpuMillis, Math.ceil(wallMillis * cpus)),
        wallSeconds: Math.min(input.resourceLimits.maxWallSeconds, Math.ceil(wallMillis / 1_000)),
        peakMemoryMb: input.resourceLimits.maxMemoryMb,
        observedNetworkHosts: [],
        isolationAttestation: {
          engine: "docker",
          imageReference: this.runtime.image,
          imageDigest,
          networkMode: "none",
          readOnlyRootfs: true,
          noNewPrivileges: true,
          capDropAll: true,
          pidsLimit: 128,
          metricBasis: "ENFORCED_CEILING",
        },
      };
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }
}

function artifactKey(reference: string) {
  if (!reference.startsWith("artifact://")) {
    throw new ResearchSandboxError("INVALID_INPUT", "Sandbox input must use an artifact:// object-storage reference");
  }
  const key = reference.slice("artifact://".length);
  if (!key || key.startsWith("/") || key.includes("..") || key.includes("\\") || key.includes("\0")) {
    throw new ResearchSandboxError("INVALID_INPUT", "Sandbox artifact reference is invalid");
  }
  return key;
}

function validateEntrypoint(value: string, kind: ComputationRequest["kind"]) {
  if (path.basename(value) !== value || value === "." || value === ".." || /[\0\r\n]/.test(value)) {
    throw new ResearchSandboxError("INVALID_INPUT", "Sandbox entrypoint must be a single safe filename");
  }
  const expected = kind === "JUPYTER" ? ".ipynb" : kind === "LATEX_BUILD" ? ".tex" : ".py";
  if (path.extname(value).toLowerCase() !== expected) {
    throw new ResearchSandboxError("INVALID_INPUT", `Sandbox entrypoint must use ${expected}`);
  }
  return value;
}

function runtimeCommand(kind: ComputationRequest["kind"], entrypoint: string): string[] {
  const input = `/workspace/input/${entrypoint}`;
  if (kind === "CAS") return ["python", "-I", input];
  if (kind === "JUPYTER") {
    return ["python", "-I", "-m", "jupyter", "nbconvert", "--execute", "--to", "notebook", "--output", "result.ipynb", "--output-dir", "/workspace/output", input];
  }
  return ["latexmk", "-pdf", "-interaction=nonstopmode", "-halt-on-error", "-no-shell-escape", "-outdir=/workspace/output", input];
}

async function collectOutput(kind: ComputationRequest["kind"], entrypoint: string, outputDir: string, stdout: Buffer) {
  if (kind === "CAS") return stdout;
  const filename = kind === "JUPYTER" ? "result.ipynb" : `${path.parse(entrypoint).name}.pdf`;
  try {
    return await readFile(path.join(outputDir, filename));
  } catch {
    throw new ResearchSandboxError("INVALID_INPUT", "Sandbox completed without its declared output artifact");
  }
}

function outputExtension(kind: ComputationRequest["kind"]) {
  return kind === "JUPYTER" ? "ipynb" : kind === "LATEX_BUILD" ? "pdf" : "txt";
}

function outputMediaTypeFor(kind: ComputationRequest["kind"]) {
  return kind === "JUPYTER" ? "application/x-ipynb+json" : kind === "LATEX_BUILD" ? "application/pdf" : "text/plain";
}

async function inspectImageDigest(binary: string, image: string, allowUnpinned: boolean) {
  if (/@sha256:[a-f0-9]{64}$/.test(image)) return `sha256:${image.split("@sha256:")[1]}`;
  const inspected = await runProcess(binary, ["image", "inspect", "--format", "{{.Id}}", image], 10_000, 4_096);
  if (inspected.exitCode !== 0) throw new ResearchSandboxError("NOT_FOUND", "Sandbox runtime image is unavailable");
  const digest = inspected.stdout.toString("utf8").trim();
  if (!allowUnpinned || !/^sha256:[a-f0-9]{64}$/.test(digest)) {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Sandbox runtime image digest could not be attested");
  }
  return digest;
}

async function runProcess(
  command: string,
  args: string[],
  timeoutMs: number,
  outputLimit: number,
  onTimeout?: () => Promise<void>,
): Promise<{ exitCode: number; stdout: Buffer; stderr: Buffer }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: false, stdio: ["ignore", "pipe", "pipe"] });
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let bytes = 0;
    let settled = false;
    const append = (target: Buffer[], chunk: Buffer) => {
      bytes += chunk.byteLength;
      if (bytes > outputLimit) {
        child.kill("SIGKILL");
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          reject(new ResearchSandboxError("SANDBOX_LIMIT_EXCEEDED", "Sandbox process output exceeded the capture ceiling"));
        }
      } else target.push(chunk);
    };
    child.stdout.on("data", (chunk: Buffer) => append(stdout, chunk));
    child.stderr.on("data", (chunk: Buffer) => append(stderr, chunk));
    child.on("error", (error) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new ResearchSandboxError("INVALID_INPUT", `Sandbox engine could not start: ${error.name}`));
      }
    });
    child.on("close", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve({ exitCode: code ?? -1, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) });
      }
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      void onTimeout?.().finally(() => {
        if (!settled) {
          settled = true;
          reject(new ResearchSandboxError("SANDBOX_LIMIT_EXCEEDED", "Sandbox exceeded the wall-time ceiling"));
        }
      });
    }, timeoutMs);
  });
}
