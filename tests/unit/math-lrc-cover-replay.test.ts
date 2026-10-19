import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as files from "node:fs/promises";
import * as children from "node:child_process";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { buildLrcCoverCertificate, verifyLrcCoverCertificate, lrcCoverCertificateDigest, lrcCoverScopeDigest,
  type LrcCoverCertificate, type LrcCoverScope, type LrcCoverSummary } from "@/modules/research-sandbox/math-lrc-cover-bound";
import { LRC_COVER_REPLAY_SCRIPT_SHA256, runLrcCoverEvidence,
  validateRetainedLrcCoverEvidence } from "@/modules/research-sandbox/math-lrc-cover-replay";

vi.mock("node:child_process", async (original) => {
  const actual = await original<typeof import("node:child_process")>();
  return { ...actual, execFile: vi.fn(actual.execFile) };
});
vi.mock("node:fs/promises", async (original) => {
  const actual = await original<typeof import("node:fs/promises")>();
  return { ...actual, readFile: vi.fn(actual.readFile) };
});
const root = "a".repeat(64), sourceDigest = "b".repeat(64);
const script = join(process.cwd(), "scripts/operations/replay-lrc-cover-bound.py");
const sha = (text: string) => createHash("sha256").update(text).digest("hex");
const scope: LrcCoverScope = { version: 1, method: "LRC_MODULAR_BOUND_TREE_V1", totalRunners: 14,
  prime: 17, parentLevel: 1, targetLevel: 2, parentResidues: Array.from({ length: 13 }, (_, i) => i + 1),
  digitAxes: Array.from({ length: 13 }, () => [0]), sourceDigest,
  lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" };
type Node = Record<string, unknown>;
function seal(nodes: Node[], expectedScope = scope): LrcCoverCertificate {
  const body = { version: 1 as const, method: "LRC_MODULAR_BOUND_TREE_V1" as const,
    rootContractDigest: root, scopeDigest: lrcCoverScopeDigest(expectedScope), rootNodeId: "r", nodes };
  return { ...body, certificateDigest: lrcCoverCertificateDigest(body as Omit<LrcCoverCertificate, "certificateDigest">) } as LrcCoverCertificate;
}
function chain(leaf: Node, expectedScope = scope) {
  const prefix = expectedScope.digitAxes.map((axis) => axis[0]);
  return seal([...Array.from({ length: 13 }, (_, i) => ({ id: i === 0 ? "r" : `n${i}`,
    prefix: prefix.slice(0, i), kind: "SPLIT", children: [`n${i + 1}`] })),
  { id: "n13", prefix, ...leaf }], expectedScope);
}
function python(certificate: unknown, expectedScope = scope, expectedRoot = root): { summary: LrcCoverSummary } {
  return JSON.parse(execFileSync("python3", ["-I", "-S", "-B", script], {
    input: JSON.stringify({ scope: expectedScope, rootContractDigest: expectedRoot, certificate }),
    timeout: 10000, maxBuffer: 262144, encoding: "utf8",
    env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
  }));
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
beforeEach(async () => {
  const actualProcesses = await vi.importActual<typeof import("node:child_process")>("node:child_process");
  const actualFiles = await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");
  vi.mocked(children.execFile).mockReset().mockImplementation(actualProcesses.execFile);
  vi.mocked(files.readFile).mockReset().mockImplementation(actualFiles.readFile);
});

describe("independent symbolic cover-bound replay", () => {
  it("checks pinned bytes and accepts equality in the witness inequality but not the prune inequality", () => {
    expect(sha(readFileSync(script, "utf8"))).toBe(LRC_COVER_REPLAY_SCRIPT_SHA256);
    const repeated = { ...scope, targetLevel: 14, parentResidues: Array(13).fill(1) };
    // Folded j=17..119, including exact14*j=M equality at17:103 good times.
    const cert = chain({ kind: "COVER_BOUND", uncoveredCount: 103, maxBad: [] }, repeated);
    expect(python(cert, repeated).summary).toMatchObject({ status: "COMPLETE", witnessTuples: "1" });
    const wrongEquality = chain({ kind: "COVER_BOUND", uncoveredCount: 102, maxBad: [] }, repeated);
    expect(() => python(wrongEquality, repeated)).toThrow();
    expect(verifyLrcCoverCertificate(wrongEquality, repeated, root).status).toBe("INVALID");
    // Actual witness-free singleton: |U|=sum maxBad=0 must NOT prune.
    const falseStrict = chain({ kind: "COVER_BOUND", uncoveredCount: 0, maxBad: [] });
    expect(() => python(falseStrict)).toThrow();
    expect(verifyLrcCoverCertificate(falseStrict, scope, root).status).toBe("INVALID");
  });
  it("fully replays tiny split domains and rejects rehashed tree/prefix defects", () => {
    const tiny = { ...scope, digitAxes: scope.digitAxes.map((axis, i) => i === 12 ? [0, 1] : axis) };
    const certificate = buildLrcCoverCertificate(tiny, root);
    const actual = python(certificate, tiny).summary;
    expect(actual).toMatchObject({ status: "COMPLETE", totalTuples: "2", classifiedTuples: "2" });
    // Independent flat oracle is deliberately confined to TWO tuples.
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    let witnesses = 0, conditional = 0, survivors = 0;
    for (const d of tiny.digitAxes[12]) {
      const v = tiny.parentResidues.map((r, a) => r + (a === 12 ? 17 * d : 0));
      let good = false;
      for (let j = 0; j < 34; j++) if (v.every((r) => 14 * Math.min(j * r % 34, 34 - j * r % 34) >= 34)) good = true;
      if (good) witnesses++;
      else if (v.some((_, omitted) => v.reduce((g, r, a) => a === omitted ? g : gcd(g, r), 2) > 1)) conditional++;
      else survivors++;
    }
    expect(actual).toMatchObject({ witnessTuples: String(witnesses), gcdTuples: String(conditional), survivorTuples: String(survivors) });
    const branchIndex = certificate.nodes.findIndex((node) => node.kind === "SPLIT" && node.children.length > 1);
    expect(branchIndex).toBeGreaterThanOrEqual(0);
    const mutations: ((x: LrcCoverCertificate) => void)[] = [
      (x) => { x.nodes.pop(); },
      (x) => { x.nodes.push(structuredClone(x.nodes[0])); },
      (x) => { x.nodes.push({ ...structuredClone(x.nodes.at(-1)!), id: "unused" }); },
      (x) => { const n = x.nodes[branchIndex]; if (n.kind === "SPLIT") n.children.reverse(); },
      (x) => { const n = x.nodes[branchIndex]; if (n.kind === "SPLIT") n.children[1] = n.children[0]; },
      (x) => { const n = x.nodes[branchIndex]; if (n.kind === "SPLIT") n.children[0] = x.rootNodeId; },
      (x) => { x.nodes[0].prefix = [0]; },
      (x) => { x.nodes.at(-1)!.prefix[0] = 1; },
    ];
    for (const mutate of mutations) {
      const copy = structuredClone(certificate); mutate(copy); copy.certificateDigest = lrcCoverCertificateDigest(copy);
      expect(() => python(copy, tiny)).toThrow();
      expect(verifyLrcCoverCertificate(copy, tiny, root).status).toBe("INVALID");
    }
  });
  it("rejects false bound maxima and preserves symbolic full-root unresolved coverage", () => {
    const positive = { ...scope, parentResidues: Array(13).fill(1),
      digitAxes: scope.digitAxes.map((axis, i) => i === 12 ? [0, 1] : axis) };
    const certificate = buildLrcCoverCertificate(positive, root);
    expect(python(certificate, positive).summary.status).toBe("COMPLETE");
    const leaf = certificate.nodes.find((node) => node.kind === "COVER_BOUND" && node.maxBad.length > 0);
    expect(leaf).toBeDefined();
    const copy = structuredClone(certificate), altered = copy.nodes.find((node) => node.id === leaf!.id);
    if (altered?.kind === "COVER_BOUND") altered.maxBad[0]++;
    copy.certificateDigest = lrcCoverCertificateDigest(copy);
    expect(() => python(copy, positive)).toThrow();
    expect(verifyLrcCoverCertificate(copy, positive, root).status).toBe("INVALID");
    const full = { ...scope, parentLevel: 2, targetLevel: 14,
      digitAxes: Array.from({ length: 13 }, () => [0, 1, 2, 3, 4, 5, 6]) };
    const partial = seal([{ id: "r", prefix: [], kind: "UNRESOLVED", reason: "NODE_LIMIT" }], full);
    expect(python(partial, full).summary).toMatchObject({ status: "PARTIAL", totalTuples: "96889010407",
      classifiedTuples: "0", unresolvedTuples: "96889010407" });
    expect(() => python({ ...partial, certificateDigest: "c".repeat(64) }, full)).toThrow();
  });
  it("independently exhausts survivor grid/gcd and conditional singleton gcd", () => {
    expect(python(chain({ kind: "SURVIVOR" })).summary).toMatchObject({ status: "COMPLETE", survivorTuples: "1",
      survivors: [{ digits: Array(13).fill(0), residues: scope.parentResidues }] });
    const repeated = { ...scope, parentResidues: Array(13).fill(1) };
    expect(() => python(chain({ kind: "SURVIVOR" }, repeated), repeated)).toThrow();
    const archive = JSON.parse(readFileSync(join(process.cwd(), "docs/research/lrc-allikvere-p199/retained-report.json"), "utf8"));
    const descriptor = archive.rows[2];
    const actual: LrcCoverScope = { ...descriptor.scope, method: "LRC_MODULAR_BOUND_TREE_V1",
      digitAxes: descriptor.authorTerminalPrefix.map((d: number) => [d]) };
    expect(python(chain({ kind: "OMIT_GCD", omittedIndex: 0, divisor: 7 }, actual), actual).summary)
      .toMatchObject({ status: "COMPLETE", gcdTuples: "1", lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    expect(() => python(chain({ kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }, actual), actual)).toThrow();
    expect(() => python(chain({ kind: "SURVIVOR" }, actual), actual)).toThrow();
    const hasWitness = { ...scope, targetLevel: 14, parentResidues: Array(13).fill(2) };
    expect(() => python(chain({ kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }, hasWitness), hasWitness)).toThrow();
  });
  it("binds source/root/prime/dependency and rejects unknown/duplicate fields", () => {
    const certificate = chain({ kind: "SURVIVOR" });
    for (const changed of [{ ...scope, prime: 19 }, { ...scope, targetLevel: 4 },
      { ...scope, sourceDigest: "c".repeat(64) }, { ...scope, lowerDependency: "VERIFIED" }]) {
      expect(() => python(certificate, changed as LrcCoverScope)).toThrow();
    }
    expect(() => python(certificate, scope, "c".repeat(64))).toThrow();
    expect(() => python(chain({ kind: "SURVIVOR", hiddenAuthority: true }))).toThrow();
    expect(() => execFileSync("python3", ["-I", "-S", "-B", script], {
      input: '{"scope":{},"scope":{}}', timeout: 10000, encoding: "utf8" })).toThrow();
  });
  it("fresh execution retains PARTIAL honestly and pure validation cannot promote it", async () => {
    const evidence = await runLrcCoverEvidence(scope, root, { maxNodes: 1 });
    expect(evidence.primary).toMatchObject({ status: "PARTIAL", unresolvedTuples: "1" });
    expect(evidence.independent.status).toBe("PARTIAL");
    expect(validateRetainedLrcCoverEvidence(evidence, scope, root)).toBe(true);
    const rehash = (copy: typeof evidence) => {
      const { evidenceDigest: old, ...body } = copy; void old;
      return { ...body, evidenceDigest: sha(canonicalJson(body)) };
    };
    for (const mutate of [
      (x: typeof evidence) => { x.primary.status = "COMPLETE"; },
      (x: typeof evidence) => { x.primary.unresolvedTuples = "0"; },
      (x: typeof evidence) => { x.primary.totalTuples = "01"; },
      (x: typeof evidence) => { x.independent.status = "COMPLETE"; },
      (x: typeof evidence) => { x.independent.scriptDigest = "c".repeat(64); },
      (x: typeof evidence) => { x.independent.outputDigest = "c".repeat(64); },
    ]) { const copy = structuredClone(evidence); mutate(copy); expect(validateRetainedLrcCoverEvidence(rehash(copy), scope, root)).toBe(false); }
    expect(validateRetainedLrcCoverEvidence(evidence, scope, root, { timeoutMs: 0 })).toBe(false);
    expect(validateRetainedLrcCoverEvidence(evidence, scope, root, { timeoutMs: 10001 })).toBe(false);
    expect(validateRetainedLrcCoverEvidence(evidence, scope, "c".repeat(64))).toBe(false);
    const spy = vi.spyOn(children, "execFile").mockImplementation(() => { throw Error("Read must not spawn"); }); spy.mockClear();
    expect(validateRetainedLrcCoverEvidence(evidence, scope, root)).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
  it("runs COMPLETE control with verified exact source bytes and isolated process bounds", async () => {
    const evidence = await runLrcCoverEvidence(scope, root);
    expect(evidence.primary.status).toBe("COMPLETE");
    expect(validateRetainedLrcCoverEvidence(evidence, scope, root)).toBe(true);
    const args = vi.mocked(children.execFile).mock.calls.at(-1)!;
    expect(args[0]).toBe("python3");
    expect(args[1]).toEqual(["-I", "-S", "-B", "-c", readFileSync(script, "utf8")]);
    expect(args[2]).toMatchObject({ shell: false, maxBuffer: 262144, killSignal: "SIGKILL" });
  });
  it("keeps resource prefixes unresolved and refuses cap increases", async () => {
    for (const options of [{ maxWork: 0 }, { timeoutMs: 0 }, { maxBytes: 1024 }]) {
      const evidence = await runLrcCoverEvidence(scope, root, options);
      expect(evidence.primary).toMatchObject({ status: "PARTIAL", classifiedTuples: "0", unresolvedTuples: "1" });
      expect(validateRetainedLrcCoverEvidence(evidence, scope, root)).toBe(true);
    }
    const spy = vi.spyOn(children, "execFile"); spy.mockClear();
    for (const options of [{ maxNodes: 20001 }, { maxWork: 20000001 }, { timeoutMs: 10001 }, { maxBytes: 16777217 }]) {
      await expect(runLrcCoverEvidence(scope, root, options)).rejects.toThrow();
    }
    expect(spy).not.toHaveBeenCalled();
  });
  it("fails closed on source drift, process faults, malformed output and production", async () => {
    vi.spyOn(files, "readFile").mockResolvedValueOnce("source drift");
    await expect(runLrcCoverEvidence(scope, root)).rejects.toThrow("source drift");
    const spy = vi.spyOn(children, "execFile");
    for (const failure of ["TIMEOUT", "MAXBUFFER", "ENOENT"]) {
      spy.mockImplementationOnce(() => { throw Error(failure); });
      await expect(runLrcCoverEvidence(scope, root)).rejects.toThrow();
    }
    spy.mockImplementationOnce((_file, _args, _options, callback) => {
      queueMicrotask(() => (callback as (e: Error | null, out: string, err: string) => void)(null,
        '{"method":"LRC_COVER_PYTHON_TREE_REPLAY_V1","summary":{}}', ""));
      return { stdin: { on: () => undefined, end: () => undefined } } as unknown as ReturnType<typeof children.execFile>;
    });
    await expect(runLrcCoverEvidence(scope, root)).rejects.toThrow();
    spy.mockClear(); vi.stubEnv("NODE_ENV", "production");
    await expect(runLrcCoverEvidence(scope, root)).rejects.toThrow("development/test");
    vi.stubEnv("NODE_ENV", "test"); vi.stubEnv("DEPLOYMENT_ENV", "staging");
    await expect(runLrcCoverEvidence(scope, root)).rejects.toThrow("development/test");
    expect(spy).not.toHaveBeenCalled();
  });
});
