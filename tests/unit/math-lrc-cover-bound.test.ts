import { describe, expect, it, vi } from "vitest";

import { buildLrcCoverCertificate, lrcCoverCertificateDigest, lrcCoverScopeDigest,
  lrcCoverScopeSchema, lrcCoverSummarySchema, verifyLrcCoverCertificate,
  type LrcCoverCertificate, type LrcCoverNode, type LrcCoverScope } from "@/modules/research-sandbox/math-lrc-cover-bound";

const rootDigest = "a".repeat(64);
const base: LrcCoverScope = { version: 1, method: "LRC_MODULAR_BOUND_TREE_V1", totalRunners: 14,
  prime: 17, parentLevel: 1, targetLevel: 2, parentResidues: Array.from({ length: 13 }, (_, i) => i + 1),
  digitAxes: Array.from({ length: 13 }, () => [0]), sourceDigest: "b".repeat(64), lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" };
const equality: LrcCoverScope = { ...base, targetLevel: 14, parentResidues: Array(13).fill(1) };
const small: LrcCoverScope = { ...base, digitAxes: base.digitAxes.map((axis, a) => a < 3 ? [0, 1] : axis) };
type Leaf = LrcCoverNode extends infer Node ? Node extends LrcCoverNode ? Omit<Node, "id" | "prefix"> : never : never;
function seal(certificate: LrcCoverCertificate): LrcCoverCertificate { return { ...certificate, certificateDigest: lrcCoverCertificateDigest(certificate) }; }
function leaf(scope: LrcCoverScope, prefix: number[], node: Leaf): LrcCoverCertificate {
  if (prefix.length) throw new Error("Use graft for non-root leaf");
  return seal({ version: 1, method: "LRC_MODULAR_BOUND_TREE_V1", rootContractDigest: rootDigest, scopeDigest: lrcCoverScopeDigest(scope),
    rootNodeId: "n0", nodes: [{ ...node, id: "n0", prefix } as LrcCoverNode], certificateDigest: "0".repeat(64) });
}
function graft(scope: LrcCoverScope, prefix: number[], node: Leaf): LrcCoverCertificate {
  // Single legal prefix path only: remaining axes may still be nonsingleton.
  const nodes: LrcCoverNode[] = prefix.map((_, depth) => ({ id: `n${depth}`, prefix: prefix.slice(0, depth), kind: "SPLIT", children: [`n${depth + 1}`] }));
  nodes.push({ ...node, id: `n${prefix.length}`, prefix } as LrcCoverNode);
  return seal({ version: 1, method: "LRC_MODULAR_BOUND_TREE_V1", rootContractDigest: rootDigest, scopeDigest: lrcCoverScopeDigest(scope), rootNodeId: "n0", nodes, certificateDigest: "0".repeat(64) });
}
function bound(scope: LrcCoverScope, prefix: number[]) {
  const M = scope.targetLevel * scope.prime, parentM = scope.parentLevel * scope.prime;
  const times = Array.from({ length: Math.floor(M / 2) }, (_, i) => i + 1).filter((j) => prefix.every((d, a) => {
    const r = j * ((scope.parentResidues[a] + parentM * d) % M) % M; return 14 * Math.min(r, M - r) >= M;
  }));
  const maxima: number[] = [], minima: number[] = [];
  for (let a = prefix.length; a < 13; a++) {
    const sizes = scope.digitAxes[a].map((d) => times.filter((j) => {
      const r = j * ((scope.parentResidues[a] + parentM * d) % M) % M; return 14 * Math.min(r, M - r) < M;
    }).length);
    maxima.push(Math.max(...sizes)); minima.push(Math.min(...sizes));
  }
  return { uncoveredCount: times.length, maxBad: maxima, minBad: minima };
}
function flat(scope: LrcCoverScope) {
  const M = scope.targetLevel * scope.prime, parentM = scope.parentLevel * scope.prime;
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  let witnesses = 0, gcds = 0, survivors = 0;
  function visit(digits: number[]) {
    if (digits.length < 13) { for (const d of scope.digitAxes[digits.length]) visit([...digits, d]); return; }
    const speeds = digits.map((d, a) => (scope.parentResidues[a] + parentM * d) % M);
    for (let j = 0; j < M; j++) if (speeds.every((u) => { const r = j * u % M; return 14 * Math.min(r, M - r) >= M; })) { witnesses++; return; }
    for (let omitted = 0; omitted < 13; omitted++) if (speeds.reduce((g, u, a) => a === omitted ? g : gcd(g, u), scope.targetLevel) > 1) { gcds++; return; }
    survivors++;
  }
  visit([]); return { witnessTuples: String(witnesses), gcdTuples: String(gcds), survivorTuples: String(survivors) };
}
const parents = [[200, 2, 202, 203, 204, 205, 206, 8, 208, 10, 210, 12, 212],
  [200, 2, 202, 203, 204, 205, 206, 207, 208, 10, 210, 12, 212],
  Array.from({ length: 13 }, (_, i) => i + 1), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 24]];
const prefixes = [[4, 2, 6, 0, 1, 2, 3, 1, 5, 3, 0, 5, 2], [4, 2, 6, 0, 1, 2, 3, 4, 5, 3, 0, 5, 2],
  [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 6, 3]];
function actual(row: number, fixed: number): LrcCoverScope {
  return { ...base, prime: 199, parentLevel: 2, targetLevel: 14, parentResidues: parents[row],
    digitAxes: prefixes[row].map((d, a) => a < fixed ? [d] : [0, 1, 2, 3, 4, 5, 6]),
    sourceDigest: row === 3 ? "9a441e4a96750c519a53c8708292e816cb302eb1201f499882ba17e7cf6e9297" : "946ba9d5cb77db00bf52aa7831beef3fc12acb7136095601550b074687b24a18" };
}

describe("compact symbolic Allikvere bad-time cover bounds", () => {
  it("seals ordered repeated coordinates and large symbolic domains without widening finite v1", () => {
    expect(lrcCoverScopeSchema.safeParse(actual(0, 0)).success).toBe(true);
    expect(lrcCoverScopeSchema.safeParse(equality).success).toBe(true);
    for (const bad of [{ ...base, method: "OLD_FINITE" }, { ...base, prime: 13 }, { ...base, prime: 21 },
      { ...base, parentLevel: 2, targetLevel: 3 }, { ...base, parentResidues: [17, ...base.parentResidues.slice(1)] },
      { ...base, digitAxes: [[1, 0], ...base.digitAxes.slice(1)] }, { ...base, digitAxes: [[0, 0], ...base.digitAxes.slice(1)] },
      { ...base, digitAxes: [[2], ...base.digitAxes.slice(1)] }, { ...base, lowerDependency: "PROVED" }, { ...base, sourceDigest: "invalid" },
      { ...actual(0, 0), targetLevel: 14, parentLevel: 1, digitAxes: [[0, 1, 2, 3, 4, 5, 6, 7], ...base.digitAxes.slice(1)] }]) expect(lrcCoverScopeSchema.safeParse(bad).success).toBe(false);
    const summary = verifyLrcCoverCertificate(buildLrcCoverCertificate(actual(0, 0), rootDigest, { maxWork: 0 }), actual(0, 0), rootDigest);
    expect(summary).toMatchObject({ status: "PARTIAL", totalTuples: "96889010407", unresolvedTuples: "96889010407", classifiedTuples: "0" });
    expect(lrcCoverSummarySchema.safeParse({ ...summary, totalTuples: "096889010407" }).success).toBe(false);
    expect(lrcCoverSummarySchema.safeParse({ ...summary, totalTuples: "96889010408" }).success).toBe(false);
  });
  it("accepts exact grid equality and a fully assigned positive U as a COVER_BOUND", () => {
    const prefix = Array(13).fill(0), proof = bound(equality, prefix);
    expect(proof.uncoveredCount).toBe(103);
    expect(verifyLrcCoverCertificate(graft(equality, prefix, { kind: "COVER_BOUND", uncoveredCount: proof.uncoveredCount, maxBad: [] }), equality, rootDigest))
      .toMatchObject({ status: "COMPLETE", witnessTuples: "1", unresolvedTuples: "0" });
  });
  it("matches full-grid flat exact classification on a small domain including survivors", () => {
    expect(verifyLrcCoverCertificate(buildLrcCoverCertificate(small, rootDigest), small, rootDigest))
      .toMatchObject({ status: "COMPLETE", totalTuples: "8", classifiedTuples: "8", unresolvedTuples: "0", ...flat(small) });
  });
  it("certifies forall-completion existence without fabricating one COMMON witness", () => {
    const scope = actual(0, 10), certificate = buildLrcCoverCertificate(scope, rootDigest);
    const cover = certificate.nodes.find((n) => n.kind === "COVER_BOUND" && n.prefix.length < 13)!;
    expect(cover).toBeDefined();
    const M = 2786;
    let common = 0;
    for (let j = 0; j < M; j++) if (scope.digitAxes.every((axis, a) => {
      const choices = a < cover.prefix.length ? [cover.prefix[a]] : axis;
      return choices.every((d) => { const r = j * ((scope.parentResidues[a] + 398 * d) % M) % M; return 14 * Math.min(r, M - r) >= M; });
    })) common++;
    expect(common).toBe(0);
    expect(verifyLrcCoverCertificate(certificate, scope, rootDigest).status).toBe("COMPLETE");
  });
  it("rejects strict-bound equality instead of promoting equality to universal existence", () => {
    const scope = actual(0, 12), prefix = prefixes[0].slice(0, 12), proof = bound(scope, prefix);
    expect(proof.uncoveredCount).toBe(proof.maxBad.reduce((n, b) => n + b, 0));
    expect(verifyLrcCoverCertificate(graft(scope, prefix, { kind: "COVER_BOUND", uncoveredCount: proof.uncoveredCount, maxBad: proof.maxBad }), scope, rootDigest))
      .toMatchObject({ status: "INVALID", errors: ["BOUND_NOT_STRICT"] });
  });
  it("rejects existential-per-axis optimistic minima and rehashed false bad-time counts", () => {
    const scope = actual(0, 10), prefix = prefixes[0].slice(0, 10), proof = bound(scope, prefix);
    expect(proof.uncoveredCount).toBeGreaterThan(proof.minBad.reduce((n, b) => n + b, 0));
    expect(proof.uncoveredCount).toBeLessThanOrEqual(proof.maxBad.reduce((n, b) => n + b, 0));
    expect(verifyLrcCoverCertificate(graft(scope, prefix, { kind: "COVER_BOUND", uncoveredCount: proof.uncoveredCount, maxBad: proof.minBad }), scope, rootDigest))
      .toMatchObject({ status: "INVALID", errors: ["FALSE_BOUND_COUNTS"] });
    const certified = buildLrcCoverCertificate(equality, rootDigest), mutant = structuredClone(certified);
    const cover = mutant.nodes.find((n) => n.kind === "COVER_BOUND")!;
    if (cover.kind === "COVER_BOUND") cover.uncoveredCount--;
    expect(verifyLrcCoverCertificate(seal(mutant), equality, rootDigest).status).toBe("INVALID");
  });
  it("retains conditional exact GCD only for fully assigned grid-free tuples", () => {
    const scope = actual(0, 13), prefix = prefixes[0];
    expect(verifyLrcCoverCertificate(graft(scope, prefix, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 7 }), scope, rootDigest))
      .toMatchObject({ status: "COMPLETE", gcdTuples: "1", witnessTuples: "0", lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    expect(verifyLrcCoverCertificate(graft(scope, prefix, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }), scope, rootDigest).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(graft(scope, prefix, { kind: "SURVIVOR" }), scope, rootDigest).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(leaf(scope, [], { kind: "OMIT_GCD", omittedIndex: 0, divisor: 7 }), scope, rootDigest).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(graft(equality, Array(13).fill(0), { kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }), equality, rootDigest).status).toBe("INVALID");
  });
  it("rejects fully rehashed missing, reordered, reused, cyclic and drifting prefix partitions", () => {
    const original = buildLrcCoverCertificate(small, rootDigest);
    const mutations: Array<(c: LrcCoverCertificate) => void> = [
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") c.nodes = c.nodes.filter((m) => m.id !== n.children[0]); },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT" && n.children.length > 1)!; if (n.kind === "SPLIT") n.children.pop(); },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT" && n.children.length > 1)!; if (n.kind === "SPLIT") n.children.reverse(); },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") n.children[0] = n.id; },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT" && n.children.length > 1)!; if (n.kind === "SPLIT") n.children[1] = n.children[0]; },
      (c) => { c.nodes.push(structuredClone(c.nodes[0])); },
      (c) => { c.nodes.push({ ...structuredClone(c.nodes[0]), id: "unreachable" }); },
      (c) => { c.nodes[1].prefix.push(0); },
      (c) => { c.nodes[0].prefix = [0]; },
    ];
    for (const mutate of mutations) { const c = structuredClone(original); mutate(c); expect(verifyLrcCoverCertificate(seal(c), small, rootDigest).status).toBe("INVALID"); }
  });
  it("rejects source/scope/root drift, forged cardinalities, unknown schemas and invalid limits", () => {
    const certificate = buildLrcCoverCertificate(small, rootDigest);
    for (const scope of [{ ...small, sourceDigest: "c".repeat(64) }, { ...small, prime: 19 },
      { ...small, parentResidues: [...small.parentResidues].reverse() }, { ...small, digitAxes: small.digitAxes.map((a, i) => i === 0 ? [0] : a) }]) {
      expect(verifyLrcCoverCertificate(buildLrcCoverCertificate(scope, rootDigest), small, rootDigest).status).toBe("INVALID");
    }
    expect(verifyLrcCoverCertificate(certificate, small, "d".repeat(64)).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate({ ...certificate, classifiedTuples: "8" }, small, rootDigest).status).toBe("INVALID");
    const bad = structuredClone(certificate); Object.assign(bad.nodes[0], { kind: "PROOF_COMPLETE" });
    expect(verifyLrcCoverCertificate(seal(bad), small, rootDigest).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(certificate, small, rootDigest, { timeoutMs: 10001 }).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(certificate, small, rootDigest, { maxWork: 20000001 }).status).toBe("INVALID");
    expect(() => buildLrcCoverCertificate(small, rootDigest, { maxNodes: 20001 })).toThrow();
  });
  it("preserves exact subtree cardinalities and all reserved siblings after any resource latch", () => {
    const scope = actual(0, 0);
    for (const options of [{ maxNodes: 8 }, { maxWork: 0 }, { maxWork: 126770 }, { timeoutMs: 0 }, { maxBytes: 1024 }]) {
      const certificate = buildLrcCoverCertificate(scope, rootDigest, options);
      expect(certificate.nodes.length).toBeLessThanOrEqual(options.maxNodes ?? 20000);
      const summary = verifyLrcCoverCertificate(certificate, scope, rootDigest);
      expect(summary.status).toBe("PARTIAL");
      expect(BigInt(summary.classifiedTuples) + BigInt(summary.unresolvedTuples)).toBe(BigInt("96889010407"));
      expect(BigInt(summary.unresolvedTuples)).toBeGreaterThan(BigInt(0));
    }
    const certificate = buildLrcCoverCertificate(small, rootDigest);
    expect(verifyLrcCoverCertificate(certificate, small, rootDigest, { maxWork: 0 })).toMatchObject({ status: "INVALID", errors: ["VERIFICATION_WORK_LIMIT"] });
    expect(verifyLrcCoverCertificate(certificate, small, rootDigest, { timeoutMs: 0 })).toMatchObject({ status: "INVALID", errors: ["VERIFICATION_TIME_LIMIT"] });
  }, 20000);
  it("checks observed producer final hashing and consumer final serialization deadlines", () => {
    const spy = vi.spyOn(performance, "now").mockReturnValue(0);
    try {
      buildLrcCoverCertificate(equality, rootDigest, { timeoutMs: 1 });
      const producerCalls = spy.mock.calls.length; spy.mockClear(); let calls = 0;
      spy.mockImplementation(() => ++calls >= producerCalls ? 2 : 0);
      const partial = buildLrcCoverCertificate(equality, rootDigest, { timeoutMs: 1 });
      spy.mockReturnValue(0);
      expect(verifyLrcCoverCertificate(partial, equality, rootDigest).status).toBe("PARTIAL");
      const certificate = buildLrcCoverCertificate(equality, rootDigest); spy.mockClear();
      verifyLrcCoverCertificate(certificate, equality, rootDigest);
      const consumerCalls = spy.mock.calls.length; spy.mockClear(); calls = 0;
      spy.mockImplementation(() => ++calls >= consumerCalls ? 10001 : 0);
      expect(verifyLrcCoverCertificate(certificate, equality, rootDigest)).toMatchObject({ status: "INVALID", errors: ["VERIFICATION_TIME_LIMIT"] });
    } finally { spy.mockRestore(); }
  });
  it("independently verifies full widened anchored7^8 domains without Cartesian enumeration", () => {
    for (let row = 0; row < 4; row++) {
      const scope = actual(row, 5);
      const summary = verifyLrcCoverCertificate(buildLrcCoverCertificate(scope, rootDigest), scope, rootDigest);
      expect(summary).toMatchObject({ status: "COMPLETE", totalTuples: "5764801", classifiedTuples: "5764801", witnessTuples: "5764800", gcdTuples: "1", survivorTuples: "0", unresolvedTuples: "0" });
    }
  }, 20000);
  it("independently admits all four unchanged capped full7^13 roots as honest partial trees", () => {
    for (let row = 0; row < 4; row++) {
      const scope = actual(row, 0), certificate = buildLrcCoverCertificate(scope, rootDigest);
      const summary = verifyLrcCoverCertificate(certificate, scope, rootDigest);
      expect(summary.status).toBe("PARTIAL"); expect(summary.errors).toEqual([]);
      expect(summary.totalTuples).toBe("96889010407");
      expect(BigInt(summary.classifiedTuples) + BigInt(summary.unresolvedTuples)).toBe(BigInt(summary.totalTuples));
      expect(BigInt(summary.classifiedTuples)).toBeGreaterThan(BigInt(0));
      expect(BigInt(summary.unresolvedTuples)).toBeGreaterThan(BigInt(0));
      expect(certificate.nodes.length).toBeLessThanOrEqual(20000);
    }
  }, 20000);
  it("agrees with an independent all-grid oracle on each genuine343-point terminal control", () => {
    for (let row = 0; row < 4; row++) {
      const scope = actual(row, 10);
      expect(verifyLrcCoverCertificate(buildLrcCoverCertificate(scope, rootDigest), scope, rootDigest))
        .toMatchObject({ status: "COMPLETE", totalTuples: "343", classifiedTuples: "343", unresolvedTuples: "0", ...flat(scope) });
    }
  }, 20000);
  it("rejects excessive bytes and non-JSON input without manufacturing partial proof", () => {
    expect(verifyLrcCoverCertificate({ text: "x".repeat(16777217) }, base, rootDigest).status).toBe("INVALID");
    const cycle: Record<string, unknown> = {}; cycle.self = cycle;
    expect(verifyLrcCoverCertificate(cycle, base, rootDigest).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(undefined, base, rootDigest).status).toBe("INVALID");
    expect(verifyLrcCoverCertificate(null, base, "bad").status).toBe("INVALID");
  });
});
