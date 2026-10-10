import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { lrcModularCertificateDigest, lrcModularScopeDigest,
  type LrcModularCertificate, type LrcModularScope } from "@/modules/research-sandbox/math-lrc-modular-certificates";
import { LRC_MODULAR_REPLAY_SCRIPT_SHA256, runLrcModularEvidence,
  validateRetainedLrcModularEvidence } from "@/modules/research-sandbox/math-lrc-modular-replay";
import * as files from "node:fs/promises";
import * as children from "node:child_process";

vi.mock("node:child_process", async (original) => {
  const actual = await original<typeof import("node:child_process")>();
  return { ...actual, execFile: vi.fn(actual.execFile) };
});
vi.mock("node:fs/promises", async (original) => {
  const actual = await original<typeof import("node:fs/promises")>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});
const root = "a".repeat(64), sourceDigest = "b".repeat(64);
const script = join(process.cwd(), "scripts/operations/replay-lrc-modular-certificates.py");
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const zero = () => Array.from({ length: 13 }, () => 0);
const box = { lower: zero(), upper: zero() };
const scope: LrcModularScope = { version: 1, totalRunners: 14, prime: 17, parentLevel: 1, targetLevel: 2,
  parentResidues: Array.from({ length: 13 }, (_, i) => i + 1), digitAxes: Array.from({ length: 13 }, () => [0]),
  sourceDigest, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" };
type Node = Record<string, unknown>;
function cert(nodes: Node[], expectedScope = scope) {
  const body = { version: 1 as const, rootContractDigest: root, scopeDigest: lrcModularScopeDigest(expectedScope), rootNodeId: "r", nodes };
  return { ...body, certificateDigest: lrcModularCertificateDigest(body as Omit<LrcModularCertificate, "certificateDigest">) };
}
function python(certificate: unknown, expectedScope = scope, expectedRoot = root) {
  return JSON.parse(execFileSync("python3", ["-I", "-S", "-B", script], {
    input: JSON.stringify({ scope: expectedScope, rootContractDigest: expectedRoot, certificate }),
    timeout: 10_000, maxBuffer: 262_144, encoding: "utf8",
    env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
  })) as { summary: { status: string; classifiedTuples: number; witnessTuples: number; gcdTuples: number;
    survivorTuples: number; survivors: { digits: number[]; residues: number[] }[]; lowerDependency: string } };
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
beforeEach(async () => {
  const processModule = await vi.importActual<typeof import("node:child_process")>("node:child_process");
  const fileModule = await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");
  vi.mocked(children.execFile).mockReset().mockImplementation(processModule.execFile);
  vi.mocked(files.readFile).mockReset().mockImplementation(fileModule.readFile);
});

describe("independent ordered modular fiber replay", () => {
  it("checks actual pinned bytes and equality while preserving repeated coordinate labels", () => {
    expect(sha(readFileSync(script, "utf8"))).toBe(LRC_MODULAR_REPLAY_SCRIPT_SHA256);
    const repeated: LrcModularScope = { ...scope, targetLevel: 14, parentResidues: Array(13).fill(1) };
    expect(python(cert([{ id: "r", box, kind: "GRID", gridIndex: 17 }], repeated), repeated).summary)
      .toMatchObject({ status: "COMPLETE", witnessTuples: 1, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    expect(() => python(cert([{ id: "r", box, kind: "GRID", gridIndex: 16 }], repeated), repeated)).toThrow();
  });
  it("recomputes exact uniform omit-one gcd, not a freely chosen divisor", () => {
    const even: LrcModularScope = { ...scope, parentResidues: Array(13).fill(2) };
    expect(python(cert([{ id: "r", box, kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }], even), even).summary)
      .toMatchObject({ status: "COMPLETE", gcdTuples: 1, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    for (const node of [
      { id: "r", box, kind: "OMIT_GCD", omittedIndex: 0, divisor: 17 },
      { id: "r", box, kind: "OMIT_GCD", omittedIndex: 13, divisor: 2 },
      { id: "r", box, kind: "OMIT_GCD", omittedIndex: 0, divisor: 1 },
    ]) expect(() => python(cert([node], even), even)).toThrow();
    expect(() => python(cert([{ id: "r", box, kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }]))).toThrow();
    const branching = { ...even, digitAxes: even.digitAxes.map((axis, i) => i === 1 ? [0, 1] : axis) };
    const branchBox = { lower: zero(), upper: zero().map((d, i) => i === 1 ? 1 : d) };
    // 2 and 19 in the same nonomitted coordinate destroy uniform gcd=2.
    expect(() => python(cert([{ id: "r", box: branchBox, kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }], branching), branching)).toThrow();
  });
  it("retains a fully exhausted singleton survivor and refuses false survivor claims", () => {
    const result = python(cert([{ id: "r", box, kind: "SURVIVOR" }]));
    expect(result.summary).toMatchObject({ status: "COMPLETE", survivorTuples: 1, classifiedTuples: 1,
      survivors: [{ digits: zero(), residues: scope.parentResidues }], lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    const allOne = { ...scope, parentResidues: Array(13).fill(1) };
    expect(() => python(cert([{ id: "r", box, kind: "SURVIVOR" }], allOne), allOne)).toThrow();
    expect(python(cert([{ id: "r", box, kind: "UNRESOLVED", reason: "WORK_LIMIT" }])).summary.status).toBe("PARTIAL");
  });
  it("verifies exhaustive ordered partitions and rejects rehashed coverage defects", () => {
    const splitScope: LrcModularScope = { ...scope, parentResidues: Array(13).fill(1),
      digitAxes: scope.digitAxes.map((axis, i) => i === 0 ? [0, 1] : axis) };
    const right = { lower: zero().map((d, i) => i === 0 ? 1 : d), upper: zero().map((d, i) => i === 0 ? 1 : d) };
    const whole = { lower: zero(), upper: right.upper };
    const nodes = [{ id: "r", box: whole, kind: "SPLIT", axis: 0, children: ["a", "b"] },
      { id: "a", box, kind: "GRID", gridIndex: 3 }, { id: "b", box: right, kind: "GRID", gridIndex: 3 }];
    expect(python(cert(nodes, splitScope), splitScope).summary.classifiedTuples).toBe(2);
    const mutations = [nodes.slice(0, 2), [...nodes, { ...nodes[1] }], [...nodes, { ...nodes[1], id: "unused" }],
      [{ ...nodes[0], children: ["a", "a"] }, ...nodes.slice(1)],
      [{ ...nodes[0], children: ["r", "b"] }, ...nodes.slice(1)],
      [nodes[0], nodes[1], { ...nodes[2], box }], [{ ...nodes[0], box }, ...nodes.slice(1)],
      [{ ...nodes[0], children: ["b", "a"] }, ...nodes.slice(1)]];
    for (const mutation of mutations) expect(() => python(cert(mutation, splitScope), splitScope)).toThrow();
    expect(() => python(cert(nodes, splitScope), scope)).toThrow();
  });
  it("rejects prime, level, source, root and undeclared lower-dependency drift", () => {
    const certificate = cert([{ id: "r", box, kind: "SURVIVOR" }]);
    for (const changed of [{ ...scope, prime: 19 }, { ...scope, targetLevel: 4 },
      { ...scope, sourceDigest: "c".repeat(64) }, { ...scope, lowerDependency: "VERIFIED" }]) {
      expect(() => python(certificate, changed as LrcModularScope)).toThrow();
    }
    expect(() => python(certificate, scope, "c".repeat(64))).toThrow();
    expect(() => python({ ...certificate, certificateDigest: "c".repeat(64) })).toThrow();
    expect(() => python(cert([{ id: "r", box, kind: "SURVIVOR", extra: true }]))).toThrow();
    expect(() => execFileSync("python3", ["-I", "-S", "-B", script], {
      input: '{"scope":{},"scope":{}}', timeout: 10_000, encoding: "utf8" })).toThrow();
  });
  it("runs a fresh retained survivor and pure integrity rejects fully rehashed forgeries", async () => {
    const evidence = await runLrcModularEvidence(scope, root);
    expect(evidence.primary).toMatchObject({ status: "COMPLETE", survivorTuples: 1,
      lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    expect(validateRetainedLrcModularEvidence(evidence, scope, root)).toBe(true);
    const rehash = (copy: typeof evidence) => {
      const { evidenceDigest: old, ...body } = copy; void old;
      return { ...body, evidenceDigest: sha(canonicalJson(body)) };
    };
    for (const mutate of [
      (x: typeof evidence) => { x.primary.survivorTuples = 0; },
      (x: typeof evidence) => { x.primary.survivors = []; },
      (x: typeof evidence) => { x.independent.summary.classifiedTuples = 0; },
      (x: typeof evidence) => { x.independent.summary.survivors[0].residues[0] = 2; },
      (x: typeof evidence) => { x.independent.scriptDigest = "c".repeat(64); },
      (x: typeof evidence) => { x.independent.outputDigest = "c".repeat(64); },
      (x: typeof evidence) => { x.primary.status = "PARTIAL"; },
    ]) { const copy = structuredClone(evidence); mutate(copy); expect(validateRetainedLrcModularEvidence(rehash(copy), scope, root)).toBe(false); }
    expect(validateRetainedLrcModularEvidence(evidence, scope, "c".repeat(64))).toBe(false);
    expect(validateRetainedLrcModularEvidence(null, scope, root)).toBe(false);
    const spy = vi.spyOn(children, "execFile").mockImplementation(() => { throw new Error("GET must not spawn"); });
    spy.mockClear();
    expect(validateRetainedLrcModularEvidence(evidence, scope, root)).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
  it("fails closed on source drift, timeout, overflow, missing process and malformed output", async () => {
    vi.spyOn(files, "readFile").mockResolvedValueOnce("source drift");
    await expect(runLrcModularEvidence(scope, root)).rejects.toThrow("source drift");
    const spy = vi.spyOn(children, "execFile");
    for (const failure of ["TIMEOUT", "MAXBUFFER", "ENOENT"]) {
      spy.mockImplementationOnce(() => { throw new Error(failure); });
      await expect(runLrcModularEvidence(scope, root)).rejects.toThrow();
    }
    spy.mockImplementationOnce((_file, _args, _options, callback) => {
      queueMicrotask(() => (callback as (e: Error | null, out: string, err: string) => void)(null,
        '{"method":"LRC_MODULAR_PYTHON_TREE_REPLAY_V1","summary":{}}', ""));
      return { stdin: { on: () => undefined, end: () => undefined } } as unknown as ReturnType<typeof children.execFile>;
    });
    await expect(runLrcModularEvidence(scope, root)).rejects.toThrow();
  });
  it("denies production/staging before tool execution", async () => {
    const spy = vi.spyOn(children, "execFile"); spy.mockClear();
    vi.stubEnv("NODE_ENV", "production");
    await expect(runLrcModularEvidence(scope, root)).rejects.toThrow("development/test");
    vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("DEPLOYMENT_ENV", "staging");
    await expect(runLrcModularEvidence(scope, root)).rejects.toThrow("development/test");
    expect(spy).not.toHaveBeenCalled();
  });
});
