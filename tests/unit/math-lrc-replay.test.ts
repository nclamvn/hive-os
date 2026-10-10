import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { lrcCertificateDigest, lrcScopeDigest, type LrcFiniteScope as LrcScope, type LrcCertificate } from "@/modules/research-sandbox/math-lrc-certificates";
import { LRC_REPLAY_SCRIPT_SHA256, runLrcCertificateEvidence, validateRetainedLrcEvidence } from "@/modules/research-sandbox/math-lrc-replay";
import * as files from "node:fs/promises";
import * as children from "node:child_process";

vi.mock("node:child_process", async (importOriginal) => {
  const original = await importOriginal<typeof import("node:child_process")>();
  return { ...original, execFile: vi.fn(original.execFile) };
});
vi.mock("node:fs/promises", async (importOriginal) => {
  const original = await importOriginal<typeof import("node:fs/promises")>();
  return { ...original, readFile: vi.fn(original.readFile) };
});

const root = "a".repeat(64);
const script = join(process.cwd(), "scripts/operations/replay-lrc-certificates.py");
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const scope: LrcScope = { version: 1, totalRunners: 3, modulus: 6, axes: [[1], [2]] };
const box = { lower: [0, 0], upper: [0, 0] };
type TestNode = Record<string, unknown>;
function certificate(nodes: TestNode[], expectedScope = scope) {
  const body = { version: 1 as const, rootContractDigest: root, scopeDigest: lrcScopeDigest(expectedScope), rootNodeId: "r", nodes };
  return { ...body, certificateDigest: lrcCertificateDigest(body as Omit<LrcCertificate, "certificateDigest">) };
}
function python(cert: unknown, expectedScope = scope, rootContractDigest = root) {
  return JSON.parse(execFileSync("python3", ["-I", "-S", "-B", script], {
    input: JSON.stringify({ scope: expectedScope, rootContractDigest, certificate: cert }),
    timeout: 10_000, maxBuffer: 262_144, encoding: "utf8",
    env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
  })) as { summary: { status: string; coveredTuples: number; gridExcludedTuples: number; witnessTuples: number } };
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
beforeEach(async () => {
  const originalChildren = await vi.importActual<typeof import("node:child_process")>("node:child_process");
  const originalFiles = await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");
  vi.mocked(children.execFile).mockReset().mockImplementation(originalChildren.execFile);
  vi.mocked(files.readFile).mockReset().mockImplementation(originalFiles.readFile);
});

describe("independent LRC finite-tree replay", () => {
  it("pins actual source bytes and accepts equality at the exact boundary", () => {
    expect(sha(readFileSync(script, "utf8"))).toBe(LRC_REPLAY_SCRIPT_SHA256);
    expect(python(certificate([{ id: "r", kind: "GRID", box, gridIndex: 2 }])).summary)
      .toMatchObject({ status: "PASS", coveredTuples: 1, witnessTuples: 1 });
    expect(() => python(certificate([{ id: "r", kind: "GRID", box, gridIndex: 1 }]))).toThrow();
  });
  it("independently reconstructs SHIFT and inverse-based CRT on the declared grid", () => {
    const base = { id: "r", box, baseNumerator: 0, baseDenominator: 6, shiftModulus: 3 };
    expect(python(certificate([{ ...base, kind: "SHIFT", shiftIndex: 1 }])).summary.status).toBe("PASS");
    expect(python(certificate([{ ...base, kind: "CRT", shiftModulus: 6,
      factors: [{ modulus: 2, residue: 0 }, { modulus: 3, residue: 1 }] }])).summary.status).toBe("PASS");
    for (const node of [
      { ...base, kind: "SHIFT", shiftIndex: 0 },
      { ...base, kind: "SHIFT", baseDenominator: 5, shiftIndex: 1 },
      { ...base, kind: "SHIFT", shiftModulus: 4, shiftIndex: 1 },
      { ...base, kind: "CRT", shiftModulus: 6, factors: [{ modulus: 2, residue: 1 }, { modulus: 3, residue: 1 }] },
      { ...base, kind: "CRT", shiftModulus: 4, factors: [{ modulus: 2, residue: 0 }, { modulus: 2, residue: 0 }] },
      { ...base, kind: "CRT", shiftModulus: 6, factors: [{ modulus: 3, residue: 1 }, { modulus: 2, residue: 0 }] },
    ]) expect(() => python(certificate([node]))).toThrow();
  });
  it("checks complete disjoint partitions, not leaf count alone", () => {
    const splitScope: LrcScope = { ...scope, axes: [[1, 5], [2]] };
    const nodes = [
      { id: "r", box: { lower: [0, 0], upper: [1, 0] }, kind: "SPLIT", axis: 0, children: ["a", "b"] },
      { id: "a", box, kind: "GRID", gridIndex: 2 },
      { id: "b", box: { lower: [1, 0], upper: [1, 0] }, kind: "GRID", gridIndex: 2 },
    ];
    expect(python(certificate(nodes, splitScope), splitScope).summary.coveredTuples).toBe(2);
    const mutations: TestNode[][] = [
      nodes.slice(0, 2), [...nodes, { ...nodes[1] }], [...nodes, { ...nodes[1], id: "unreachable" }],
      [{ ...nodes[0], children: ["a", "a"] }, ...nodes.slice(1)],
      [{ ...nodes[0], children: ["r", "b"] }, ...nodes.slice(1)],
      [nodes[0], nodes[1], { ...nodes[2], box }],
      [{ ...nodes[0], box }, ...nodes.slice(1)],
      [{ ...nodes[0], children: ["b", "a"] }, ...nodes.slice(1)],
    ];
    for (const mutation of mutations) expect(() => python(certificate(mutation, splitScope), splitScope)).toThrow();
    expect(() => python(certificate(nodes, splitScope), scope)).toThrow();
  });
  it("exhausts NO_GRID only for singleton scopes and keeps partial non-PASS", () => {
    const exclusion: LrcScope = { version: 1, totalRunners: 6, modulus: 14, axes: [[1], [2], [3], [4], [5]] };
    const singleBox = { lower: [0, 0, 0, 0, 0], upper: [0, 0, 0, 0, 0] };
    expect(python(certificate([{ id: "r", box: singleBox, kind: "NO_GRID" }], exclusion), exclusion).summary)
      .toMatchObject({ status: "PASS", gridExcludedTuples: 1 });
    expect(() => python(certificate([{ id: "r", box, kind: "NO_GRID" }]))).toThrow();
    expect(python(certificate([{ id: "r", box, kind: "UNRESOLVED", reason: "WORK_LIMIT" }])).summary.status).toBe("PARTIAL");
  });
  it("rejects root, digest, unknown fields, scalar coercion and duplicate JSON keys", () => {
    const cert = certificate([{ id: "r", box, kind: "GRID", gridIndex: 2 }]);
    expect(() => python(cert, scope, "b".repeat(64))).toThrow();
    expect(() => python({ ...cert, certificateDigest: "b".repeat(64) })).toThrow();
    expect(() => python(certificate([{ id: "r", box, kind: "GRID", gridIndex: 2, extra: 1 }]))).toThrow();
    expect(() => python(certificate([{ id: "r", box, kind: "GRID", gridIndex: true }]))).toThrow();
    expect(() => execFileSync("python3", ["-I", "-S", "-B", script], {
      input: '{"scope":{},"scope":{}}', timeout: 10_000, encoding: "utf8" })).toThrow();
  });
  it("runs a fresh small retained envelope and rejects fully rehashed forgeries purely", async () => {
    const evidence = await runLrcCertificateEvidence(scope, root);
    expect(validateRetainedLrcEvidence(evidence, scope, root)).toBe(true);
    expect(evidence.independent.status).toBe("PASS");
    const rehash = (raw: typeof evidence) => {
      const { evidenceDigest: _, ...body } = raw;
      void _;
      return { ...body, evidenceDigest: sha(canonicalJson(body)) };
    };
    for (const mutate of [
      (x: typeof evidence) => { x.primary.witnessTuples = 0; },
      (x: typeof evidence) => { x.independent.summary.coveredTuples = 0; },
      (x: typeof evidence) => { x.independent.scriptDigest = "b".repeat(64); },
      (x: typeof evidence) => { x.independent.outputDigest = "b".repeat(64); },
      (x: typeof evidence) => { x.certificate.nodes[0] = { id: "r", box, kind: "NO_GRID" }; },
    ]) {
      const copy = structuredClone(evidence); mutate(copy);
      expect(validateRetainedLrcEvidence(rehash(copy), scope, root)).toBe(false);
    }
    expect(validateRetainedLrcEvidence(evidence, scope, "b".repeat(64))).toBe(false);
    expect(validateRetainedLrcEvidence({ ...evidence, unexpected: 1 }, scope, root)).toBe(false);
    expect(validateRetainedLrcEvidence(null, scope, root)).toBe(false);
    const execSpy = vi.spyOn(children, "execFile").mockImplementation(() => { throw new Error("GET must not spawn"); });
    execSpy.mockClear();
    expect(validateRetainedLrcEvidence(evidence, scope, root)).toBe(true);
    expect(execSpy).not.toHaveBeenCalled();
  });
  it("freshly covers all 7776 lifted tuples, agreeing with a separate flat enumeration", async () => {
    const large: LrcScope = { version: 1, totalRunners: 6, modulus: 42,
      axes: Array.from({ length: 5 }, (_, i) => Array.from({ length: 6 }, (_, j) => i + 1 + 7 * j)) };
    const evidence = await runLrcCertificateEvidence(large, root);
    let hits = 0, misses = 0;
    function enumerate(speeds: number[]) {
      if (speeds.length < large.axes.length) {
        for (const speed of large.axes[speeds.length]) enumerate([...speeds, speed]);
        return;
      }
      const hit = Array.from({ length: 42 }, (_, j) => j).some((j) => speeds.every((speed) => {
        const r = j * speed % 42;
        return 6 * Math.min(r, 42 - r) >= 42;
      }));
      if (hit) hits++; else misses++;
    }
    enumerate([]);
    expect(evidence.primary).toMatchObject({ status: "PASS", totalTuples: 7776, coveredTuples: 7776,
      witnessTuples: hits, gridExcludedTuples: misses, unresolvedTuples: 0 });
    expect(validateRetainedLrcEvidence(evidence, large, root)).toBe(true);
  });
  it("fails closed on source drift and denies nonlocal runtimes before spawning", async () => {
    vi.spyOn(files, "readFile").mockResolvedValue("changed reviewed source");
    await expect(runLrcCertificateEvidence(scope, root)).rejects.toThrow("source drift");
    vi.stubEnv("NODE_ENV", "production");
    await expect(runLrcCertificateEvidence(scope, root)).rejects.toThrow("development/test");
    vi.stubEnv("NODE_ENV", "staging");
    await expect(runLrcCertificateEvidence(scope, root)).rejects.toThrow("development/test");
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("DEPLOYMENT_ENV", "staging");
    await expect(runLrcCertificateEvidence(scope, root)).rejects.toThrow("development/test");
  });
  it("fails closed on timeout, overflow, unavailable process and output disagreement", async () => {
    const execSpy = vi.spyOn(children, "execFile");
    for (const failure of ["TIMEOUT", "MAXBUFFER", "ENOENT"]) {
      execSpy.mockImplementationOnce(() => { throw new Error(failure); });
      await expect(runLrcCertificateEvidence(scope, root)).rejects.toThrow();
    }
    execSpy.mockImplementationOnce((_file, _args, _options, callback) => {
      const cb = callback as (error: Error | null, stdout: string, stderr: string) => void;
      queueMicrotask(() => cb(null, '{"method":"LRC_PYTHON_TREE_REPLAY_V1","summary":{}}', ""));
      return { stdin: { on: () => undefined, end: () => undefined } } as unknown as ReturnType<typeof children.execFile>;
    });
    await expect(runLrcCertificateEvidence(scope, root)).rejects.toThrow();
  });
});
