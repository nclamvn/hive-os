import { describe, expect, it, vi } from "vitest";

import { buildLrcCertificate, lrcCertificateDigest, lrcFiniteScopeSchema, lrcScopeDigest, verifyLrcCertificate, type LrcCertificate, type LrcFiniteScope, type LrcNode } from "@/modules/research-sandbox/math-lrc-certificates";

const contract = "a".repeat(64);
const equality: LrcFiniteScope = { version: 1, totalRunners: 3, modulus: 6, axes: [[1], [2]] };
const lifted: LrcFiniteScope = { version: 1, totalRunners: 6, modulus: 42, axes: Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, j) => r + 1 + 7 * j)) };
function seal(certificate: LrcCertificate): LrcCertificate { return { ...certificate, certificateDigest: lrcCertificateDigest(certificate) }; }
type LeafInput = LrcNode extends infer Node ? Node extends LrcNode ? Omit<Node, "id" | "box"> : never : never;
function leaf(node: LeafInput): LrcCertificate {
  return seal({ version: 1, rootContractDigest: contract, scopeDigest: lrcScopeDigest(equality), rootNodeId: "root", nodes: [{ ...node, id: "root", box: { lower: [0, 0], upper: [0, 0] } } as LrcNode], certificateDigest: "0".repeat(64) });
}

describe("small independent finite-grid LRC certificate kernel", () => {
  it("seals only sorted disjoint positive distinct residue axes and exact runner dimension", () => {
    for (const bad of [{ ...equality, axes: [[1], [1]] }, { ...equality, axes: [[0], [2]] }, { ...equality, axes: [[1], [6]] }, { ...equality, axes: [[2, 1], [3]] }, { ...equality, axes: [[1]] }, { ...equality, modulus: 129 }, { ...equality, totalRunners: 16 }, { ...equality, extra: true }]) expect(lrcFiniteScopeSchema.safeParse(bad).success).toBe(false);
    const oversized = { version: 1, totalRunners: 6, modulus: 128, axes: Array.from({ length: 5 }, (_, a) => Array.from({ length: 7 }, (_, j) => a + 1 + 5 * j)) };
    expect(lrcFiniteScopeSchema.safeParse(oversized).success).toBe(false);
    expect(lrcFiniteScopeSchema.safeParse(lifted).success).toBe(true);
  });
  it("accepts equality exactly, rejects an off-boundary witness", () => {
    expect(verifyLrcCertificate(leaf({ kind: "GRID", gridIndex: 2 }), equality, contract)).toMatchObject({ status: "PASS", totalTuples: 1, witnessTuples: 1, coveredTuples: 1 });
    expect(verifyLrcCertificate(leaf({ kind: "GRID", gridIndex: 1 }), equality, contract).status).toBe("INVALID");
    expect(verifyLrcCertificate(leaf({ kind: "GRID", gridIndex: 6 }), equality, contract).status).toBe("INVALID");
  });
  it("derives exact on-grid SHIFT witness without admitting an induction premise", () => {
    const shift = leaf({ kind: "SHIFT", baseNumerator: 0, baseDenominator: 6, shiftModulus: 3, shiftIndex: 1 });
    expect(verifyLrcCertificate(shift, equality, contract)).toMatchObject({ status: "PASS", shiftLeaves: 1, witnessTuples: 1 });
    for (const fields of [{ shiftIndex: 3 }, { baseDenominator: 5 }, { shiftModulus: 4 }, { baseNumerator: 6 }, { shiftIndex: 0 }]) {
      const bad = structuredClone(shift); Object.assign(bad.nodes[0], fields);
      expect(verifyLrcCertificate(seal(bad), equality, contract).status).toBe("INVALID");
    }
  });
  it("reconstructs CRT in the joint modulus and rejects wrong/noncoprime/projected-only data", () => {
    const crt = leaf({ kind: "CRT", baseNumerator: 0, baseDenominator: 6, shiftModulus: 6, factors: [{ modulus: 2, residue: 0 }, { modulus: 3, residue: 1 }] });
    expect(verifyLrcCertificate(crt, equality, contract)).toMatchObject({ status: "PASS", crtLeaves: 1 });
    for (const factors of [[{ modulus: 2, residue: 1 }, { modulus: 3, residue: 1 }], [{ modulus: 2, residue: 0 }, { modulus: 4, residue: 0 }], [{ modulus: 3, residue: 1 }, { modulus: 2, residue: 0 }], [{ modulus: 2, residue: 2 }, { modulus: 3, residue: 1 }], [{ modulus: 3, residue: 1 }]]) {
      const bad = structuredClone(crt); Object.assign(bad.nodes[0], { factors });
      expect(verifyLrcCertificate(seal(bad), equality, contract).status).toBe("INVALID");
    }
  });
  it("exhausts only the fixed grid for NO_GRID, never a continuous-time counterexample", () => {
    const scope: LrcFiniteScope = { version: 1, totalRunners: 6, modulus: 14, axes: [[1], [2], [3], [4], [5]] };
    const certificate = buildLrcCertificate(scope, contract);
    expect(verifyLrcCertificate(certificate, scope, contract)).toMatchObject({ status: "PASS", witnessTuples: 0, gridExcludedTuples: 1, noGridLeaves: 1 });
    expect(verifyLrcCertificate(leaf({ kind: "NO_GRID" }), equality, contract).status).toBe("INVALID");
  });
  it("independently verifies the full 7776 Cartesian domain and exact witness/exclusion counts", () => {
    const certificate = buildLrcCertificate(lifted, contract);
    expect(verifyLrcCertificate(certificate, lifted, contract)).toMatchObject({ status: "PASS", totalTuples: 7776, coveredTuples: 7776, witnessTuples: 7407, gridExcludedTuples: 369, unresolvedTuples: 0, errors: [] });
    expect(certificate.nodes.some((n) => n.kind === "SPLIT")).toBe(true);
  });
  it("rejects missing, overlapping, duplicate, unreachable and cyclic fully rehashed tree mutants", () => {
    const original = buildLrcCertificate(lifted, contract);
    const mutations: Array<(c: LrcCertificate) => void> = [
      (c) => { const split = c.nodes.find((n) => n.kind === "SPLIT")!; if (split.kind === "SPLIT") c.nodes = c.nodes.filter((n) => n.id !== split.children[0]); },
      (c) => { const split = c.nodes.find((n) => n.kind === "SPLIT")!; if (split.kind === "SPLIT") { const child = c.nodes.find((n) => n.id === split.children[1])!; child.box.lower[split.axis]--; } },
      (c) => { c.nodes.push(structuredClone(c.nodes[0])); },
      (c) => { c.nodes.push({ ...structuredClone(c.nodes[0]), id: "unreachable" }); },
      (c) => { const split = c.nodes.find((n) => n.kind === "SPLIT")!; if (split.kind === "SPLIT") split.children[0] = split.id; },
      (c) => { const split = c.nodes.find((n) => n.kind === "SPLIT")!; if (split.kind === "SPLIT") split.children.reverse(); },
      (c) => { c.nodes[0].box.upper[0]--; },
      (c) => { const node = c.nodes.find((n) => n.kind === "NO_GRID")!; node.box.upper[0] = Math.min(5, node.box.lower[0] + 1); },
    ];
    for (const mutate of mutations) { const c = structuredClone(original); mutate(c); expect(verifyLrcCertificate(seal(c), lifted, contract).status).toBe("INVALID"); }
  });
  it("rejects narrowed scope, wrong root, invalid digests, forged counts and unknown leaves", () => {
    const original = buildLrcCertificate(lifted, contract);
    const narrow = { ...lifted, axes: lifted.axes.map((a) => a.slice(0, 5)) };
    expect(verifyLrcCertificate(buildLrcCertificate(narrow, contract), lifted, contract).status).toBe("INVALID");
    expect(verifyLrcCertificate(original, lifted, "b".repeat(64)).status).toBe("INVALID");
    expect(verifyLrcCertificate({ ...original, certificateDigest: "c".repeat(64) }, lifted, contract).status).toBe("INVALID");
    expect(verifyLrcCertificate({ ...original, witnessTuples: 7776 }, lifted, contract).status).toBe("INVALID");
    const bad = structuredClone(original); Object.assign(bad.nodes[0], { kind: "THEOREM" });
    expect(verifyLrcCertificate(seal(bad), lifted, contract).status).toBe("INVALID");
  });
  it("records honest unresolved coverage and never authorizes resource-limited generation", () => {
    for (const options of [{ maxNodes: 1 }, { maxWork: 0 }, { timeoutMs: 0 }]) {
      const summary = verifyLrcCertificate(buildLrcCertificate(lifted, contract, options), lifted, contract);
      expect(summary.status).toBe("PARTIAL"); expect(summary.unresolvedTuples).toBeGreaterThan(0);
      expect(summary.coveredTuples + summary.unresolvedTuples).toBe(7776);
    }
    expect(() => buildLrcCertificate(equality, contract, { maxNodes: 20001 })).toThrow();
    expect(() => buildLrcCertificate(equality, contract, { timeoutMs: 5001 })).toThrow();
  });
  it("checks the observed deadline after final hashing/serialization", () => {
    const spy = vi.spyOn(performance, "now").mockReturnValue(0);
    try {
      buildLrcCertificate(equality, contract, { timeoutMs: 1 });
      const calls = spy.mock.calls.length; spy.mockClear(); let seen = 0;
      spy.mockImplementation(() => ++seen >= calls ? 2 : 0);
      const summary = verifyLrcCertificate(buildLrcCertificate(equality, contract, { timeoutMs: 1 }), equality, contract);
      expect(summary).toMatchObject({ status: "PARTIAL", witnessTuples: 0, unresolvedTuples: 1 });
    } finally { spy.mockRestore(); }
  });
  it("admits 14/15 singleton fixed-grid controls without pretending full Allikvere coverage", () => {
    for (const totalRunners of [14, 15]) {
      const scope: LrcFiniteScope = { version: 1, totalRunners, modulus: 2 * totalRunners, axes: Array.from({ length: totalRunners - 1 }, (_, i) => [i + 1]) };
      expect(verifyLrcCertificate(buildLrcCertificate(scope, contract), scope, contract)).toMatchObject({ status: "PASS", witnessTuples: 1, totalTuples: 1 });
    }
  });
  it("fails closed on excessive bytes, non-JSON inputs and invalid expected contracts", () => {
    expect(verifyLrcCertificate({ text: "x".repeat(2097153) }, equality, contract).status).toBe("INVALID");
    const cycle: Record<string, unknown> = {}; cycle.self = cycle;
    expect(verifyLrcCertificate(cycle, equality, contract).status).toBe("INVALID");
    expect(verifyLrcCertificate(undefined, equality, contract).status).toBe("INVALID");
    expect(verifyLrcCertificate(null, equality, "wrong").status).toBe("INVALID");
  });
});
