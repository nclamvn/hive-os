import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { DockerSandboxExecutor } from "@/modules/research-sandbox/adapters/docker-sandbox";
import { sha256 } from "@/modules/research-sandbox/integrity";
import { LocalObjectStorage } from "@/server/storage/local";

const run = process.env.RUN_DOCKER_SANDBOX_TESTS === "1";
const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe.runIf(run)("TIP-024C Docker isolation certification", () => {
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
