import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { DockerSandboxExecutor } from "@/modules/research-sandbox/adapters/docker-sandbox";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { runExactBenchmarkReplay } from "@/modules/research-sandbox/math-exact-replay-runner";
import { runExactInterval101Gon } from "@/modules/research-sandbox/math-exact-interval-runner";
import { validExactInterval } from "@/modules/research-sandbox/math-exact-interval";
import { FORMAL_CLAIMS } from "@/modules/research-sandbox/math-formal-claim";
import { PILOT_LEAN_IMAGE, runFormalLeanCheck } from "@/modules/research-sandbox/math-formal-check-runner";
import { runFormalLeanReplay } from "@/modules/research-sandbox/math-formal-replay-runner";
import { LocalObjectStorage } from "@/server/storage/local";

const run = process.env.RUN_DOCKER_SANDBOX_TESTS === "1";
const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe.runIf(run)("TIP-024C Docker isolation certification", () => {
  it("checks a trusted calibration statement in isolated Lean without promoting semantic alignment", async () => {
    const check = await runFormalLeanCheck({
      target: FORMAL_CLAIMS.EVEN_SQUARE_V1, image: PILOT_LEAN_IMAGE,
      tactics: "obtain ⟨k, hk⟩ := h\nrefine ⟨2 * k * k, ?_⟩\nrw [hk]\nsimp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]",
    });
    expect(check).toMatchObject({ status: "KERNEL_ACCEPTED_ALIGNMENT_PENDING", reason: "ALLOWED_AXIOMS",
      axioms: ["propext"] });
    expect(check.sourceDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(await runFormalLeanCheck({ target: FORMAL_CLAIMS.EVEN_SQUARE_V1,
      image: PILOT_LEAN_IMAGE, tactics: "exact False.elim (by contradiction)" }))
      .toMatchObject({ status: "REJECTED", reason: "COMPILER_ERROR" });
    expect(await runFormalLeanCheck({ target: FORMAL_CLAIMS.EVEN_SQUARE_V1,
      image: "lean:latest", tactics: "exact False.elim" })).toMatchObject({ status: "UNAVAILABLE" });
  });

  it.runIf(Boolean(process.env.MATH_FORMAL_REPLAY_IMAGE))("replays an accepted olean in a fresh checker environment", async () => {
    const tactics = "obtain ⟨k, hk⟩ := h\nrefine ⟨2 * k * k, ?_⟩\nrw [hk]\nsimp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]";
    const primaryCheck = await runFormalLeanCheck({ target: FORMAL_CLAIMS.EVEN_SQUARE_V1,
      tactics, image: PILOT_LEAN_IMAGE });
    const replay = await runFormalLeanReplay({ target: FORMAL_CLAIMS.EVEN_SQUARE_V1,
      tactics, primaryCheck, imageId: process.env.MATH_FORMAL_REPLAY_IMAGE });
    expect(replay).toMatchObject({ status: "REPLAY_ACCEPTED", reason: "FRESH_REPLAY_OK",
      targetDigest: primaryCheck.targetDigest, sourceDigest: primaryCheck.sourceDigest });
    expect(replay.outputDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(await runFormalLeanReplay({ target: FORMAL_CLAIMS.EVEN_SQUARE_V1,
      tactics, primaryCheck, imageId: "sha256:" + "0".repeat(64) })).toMatchObject({ status: "UNAVAILABLE" });
  }, 300_000);

  it("certifies the public 101-gon floor with fixed outward-rounded integer intervals", async () => {
    const image = "python@sha256:6d43704baacd1bfbe7c295d7f13079d5d8104ed33568873133f8fc69980419df";
    const certificate = await runExactInterval101Gon({ image });
    expect(certificate).toMatchObject({ status: "CERTIFIED", reason: "UNIQUE_FLOOR",
      floor: "4771880153", eventCount: 80_850 });
    expect(validExactInterval(certificate, "4771880153")).toBe(true);
    expect(validExactInterval(certificate, "4771880152")).toBe(false);
    expect(validExactInterval({ ...certificate, lowerScaled: "1" }, "4771880153")).toBe(false);
  });

  it("keeps an unclaimed numeric computation separate from a passing benchmark answer", async () => {
    const image = "python@sha256:6d43704baacd1bfbe7c295d7f13079d5d8104ed33568873133f8fc69980419df";
    const code = "def answer():\n    return 7 * 11\n";
    await expect(runExactBenchmarkReplay({ code, claimedAnswer: null, image })).resolves.toMatchObject({
      status: "COMPUTED", reason: "UNCLAIMED_ANSWER", observedAnswer: "77", codeDigest: sha256(code),
    });
    await expect(runExactBenchmarkReplay({ code, claimedAnswer: "77", image })).resolves.toMatchObject({
      status: "PASS", reason: "MATCH", observedAnswer: "77", claimedAnswer: "77",
    });
  });

  it("runs CAS with no network, a read-only root, no capabilities and a digest-bound output", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "hiveos-container-test-"));
    roots.push(root);
    const storage = new LocalObjectStorage(root);
    const source = Buffer.from([
      "import json, socket",
      "network_blocked = False",
      "try:",
      "    s = socket.create_connection(('1.1.1.1', 443), timeout=0.2)",
      "    s.close()",
      "except OSError:",
      "    network_blocked = True",
      "root_read_only = False",
      "try:",
      "    open('/forbidden-write', 'w').write('x')",
      "except OSError:",
      "    root_read_only = True",
      "print(json.dumps({'network_blocked': network_blocked, 'root_read_only': root_read_only}))",
    ].join("\n"));
    await storage.put("inputs/isolation.py", source, { contentType: "text/x-python" });
    const executor = new DockerSandboxExecutor({
      runtime: { runtimeId: "sympy", runtimeVersion: "test-3.12", kind: "CAS", image: "python:3.12-slim" },
      storage,
      allowUnpinnedImageForTests: true,
    });
    const result = await executor.execute({
      missionId: "mission-container-test",
      documentId: null,
      researchRunId: null,
      kind: "CAS",
      runtimeId: "sympy",
      runtimeVersion: "test-3.12",
      entrypoint: "isolation.py",
      networkPolicy: "DENY_ALL",
      networkAllowlist: [],
      resourceLimits: { maxCpuMillis: 5_000, maxWallSeconds: 10, maxMemoryMb: 128, maxOutputBytes: 4_096 },
      inputReference: "artifact://inputs/isolation.py",
      inputDigest: sha256(source),
    });
    expect(JSON.parse(result.outputBody.toString("utf8"))).toEqual({ network_blocked: true, root_read_only: true });
    expect(result.outputDigest).toBe(sha256(result.outputBody));
    expect(result.isolationAttestation).toMatchObject({ networkMode: "none", readOnlyRootfs: true, capDropAll: true, noNewPrivileges: true });
    expect(await storage.get(result.outputReference.slice("artifact://".length))).not.toBeNull();
  });

  it("rejects path traversal before starting a container", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "hiveos-container-test-"));
    roots.push(root);
    const storage = new LocalObjectStorage(root);
    const source = Buffer.from("print('unsafe')");
    await storage.put("inputs/unsafe.py", source);
    const executor = new DockerSandboxExecutor({
      runtime: { runtimeId: "sympy", runtimeVersion: "test-3.12", kind: "CAS", image: "python:3.12-slim" },
      storage,
      allowUnpinnedImageForTests: true,
    });
    await expect(executor.execute({
      missionId: "mission-container-test",
      documentId: null,
      researchRunId: null,
      kind: "CAS",
      runtimeId: "sympy",
      runtimeVersion: "test-3.12",
      entrypoint: "../unsafe.py",
      networkPolicy: "DENY_ALL",
      networkAllowlist: [],
      resourceLimits: { maxCpuMillis: 5_000, maxWallSeconds: 10, maxMemoryMb: 128, maxOutputBytes: 4_096 },
      inputReference: "artifact://inputs/unsafe.py",
      inputDigest: sha256(source),
    })).rejects.toThrow(/single safe filename/i);
  });
});
