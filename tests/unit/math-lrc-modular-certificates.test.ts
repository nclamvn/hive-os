import { describe, expect, it, vi } from "vitest";

import { buildLrcModularCertificate, lrcModularCertificateDigest, lrcModularScopeDigest,
  lrcModularScopeSchema, verifyLrcModularCertificate, type LrcModularCertificate,
  type LrcModularNode, type LrcModularScope } from "@/modules/research-sandbox/math-lrc-modular-certificates";

const contract = "a".repeat(64);
const base: LrcModularScope = { version: 1, totalRunners: 14, prime: 17, parentLevel: 1, targetLevel: 2,
  parentResidues: Array.from({ length: 13 }, (_, i) => i + 1), digitAxes: Array.from({ length: 13 }, () => [0]),
  sourceDigest: "b".repeat(64), lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" };
const fiber: LrcModularScope = { ...base, digitAxes: base.digitAxes.map((axis, i) => i < 4 ? [0, 1] : axis) };
const equal: LrcModularScope = { ...base, targetLevel: 14, parentResidues: Array(13).fill(1) };
const gcdScope: LrcModularScope = { ...base, parentLevel: 2, targetLevel: 14, parentResidues: [1, ...Array(12).fill(2)] };
type Leaf = LrcModularNode extends infer Node ? Node extends LrcModularNode ? Omit<Node, "id" | "box"> : never : never;
function seal(certificate: LrcModularCertificate): LrcModularCertificate { return { ...certificate, certificateDigest: lrcModularCertificateDigest(certificate) }; }
function leaf(scope: LrcModularScope, node: Leaf): LrcModularCertificate {
  return seal({ version: 1, rootContractDigest: contract, scopeDigest: lrcModularScopeDigest(scope), rootNodeId: "root", certificateDigest: "0".repeat(64),
    nodes: [{ ...node, id: "root", box: { lower: Array(13).fill(0), upper: scope.digitAxes.map((axis) => axis.length - 1) } } as LrcModularNode] });
}
function flat(scope: LrcModularScope) {
  const M = scope.targetLevel * scope.prime, parentM = scope.parentLevel * scope.prime;
  let witnessTuples = 0, gcdTuples = 0;
  const survivors: Array<{ digits: number[]; residues: number[] }> = [];
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  function visit(digits: number[]) {
    if (digits.length < 13) { for (const d of scope.digitAxes[digits.length]) visit([...digits, d]); return; }
    const residues = digits.map((d, a) => (scope.parentResidues[a] + parentM * d) % M);
    // Full j=0..M-1 enumeration is intentionally distinct from half-grid tree checking.
    for (let j = 0; j < M; j++) if (residues.every((u) => { const r = j * u % M; return 14 * Math.min(r, M - r) >= M; })) { witnessTuples++; return; }
    for (let omit = 0; omit < 13; omit++) if (residues.reduce((g, u, i) => i === omit ? g : gcd(g, u), scope.targetLevel) > 1) { gcdTuples++; return; }
    survivors.push({ digits, residues });
  }
  visit([]); return { witnessTuples, gcdTuples, survivorTuples: survivors.length, survivors };
}

describe("ordered Allikvere modular fiber certificate arithmetic", () => {
  it("preserves labels/repeats and rejects invalid prime, levels, residue or digit domains", () => {
    expect(lrcModularScopeSchema.safeParse(equal).success).toBe(true);
    expect(lrcModularScopeSchema.safeParse({ ...base, digitAxes: Array.from({ length: 13 }, () => [0, 1]) }).success).toBe(true);
    for (const bad of [{ ...base, prime: 13 }, { ...base, prime: 21 }, { ...base, prime: 263 },
      { ...base, parentLevel: 2, targetLevel: 3 }, { ...base, parentLevel: 2, targetLevel: 2 }, { ...base, targetLevel: 16 },
      { ...base, parentResidues: [0, ...base.parentResidues.slice(1)] }, { ...base, parentResidues: [17, ...base.parentResidues.slice(1)] },
      { ...base, parentResidues: base.parentResidues.slice(1) }, { ...base, digitAxes: [[1, 0], ...base.digitAxes.slice(1)] },
      { ...base, digitAxes: [[0, 0], ...base.digitAxes.slice(1)] }, { ...base, digitAxes: [[2], ...base.digitAxes.slice(1)] },
      { ...base, lowerDependency: "PROVED" }, { ...base, sourceDigest: "missing" }, { ...base, orbitFactor: 26 }]) {
      expect(lrcModularScopeSchema.safeParse(bad).success).toBe(false);
    }
    expect(lrcModularScopeSchema.safeParse({ ...base, targetLevel: 3, digitAxes: Array.from({ length: 13 }, () => [0, 1, 2]) }).success).toBe(false);
  });
  it("accepts exact equality with repeated residues and rejects an off-boundary witness", () => {
    expect(verifyLrcModularCertificate(leaf(equal, { kind: "GRID", gridIndex: 17 }), equal, contract)).toMatchObject({ status: "COMPLETE", witnessTuples: 1 });
    expect(verifyLrcModularCertificate(leaf(equal, { kind: "GRID", gridIndex: 16 }), equal, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(leaf(equal, { kind: "GRID", gridIndex: 238 }), equal, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(leaf(equal, { kind: "GRID", gridIndex: 221 }), equal, contract).status).toBe("COMPLETE");
  });
  it("requires exact omit-coordinate gcd of the LEVEL, including repeated coordinates", () => {
    expect(verifyLrcModularCertificate(leaf(gcdScope, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }), gcdScope, contract)).toMatchObject({ status: "COMPLETE", gcdTuples: 1, witnessTuples: 0, lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    for (const node of [{ kind: "OMIT_GCD", omittedIndex: 1, divisor: 2 }, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 7 }]) {
      expect(verifyLrcModularCertificate(leaf(gcdScope, node as Leaf), gcdScope, contract).status).toBe("INVALID");
    }
    const all14 = { ...gcdScope, parentResidues: Array(13).fill(14) };
    expect(verifyLrcModularCertificate(leaf(all14, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }), all14, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(leaf(all14, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 14 }), all14, contract).status).toBe("COMPLETE");
  });
  it("accepts uniform GCD boxes only when the exact divisor holds for every choice", () => {
    const scope = { ...gcdScope, digitAxes: gcdScope.digitAxes.map((a, i) => i === 1 ? [0, 1] : a) };
    expect(verifyLrcModularCertificate(leaf(scope, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }), scope, contract)).toMatchObject({ status: "COMPLETE", gcdTuples: 2 });
    const bad = { ...scope, parentResidues: [1, 3, ...Array(11).fill(2)] };
    expect(verifyLrcModularCertificate(leaf(bad, { kind: "OMIT_GCD", omittedIndex: 0, divisor: 2 }), bad, contract).status).toBe("INVALID");
  });
  it("exhausts all symmetric grid times AND gcd tests for a singleton SURVIVOR", () => {
    const checked = verifyLrcModularCertificate(leaf(base, { kind: "SURVIVOR" }), base, contract);
    expect(checked).toMatchObject({ status: "COMPLETE", survivorTuples: 1, classifiedTuples: 1, witnessTuples: 0, gcdTuples: 0 });
    expect(checked.survivors).toEqual([{ digits: Array(13).fill(0), residues: base.parentResidues }]);
    expect(verifyLrcModularCertificate(leaf(equal, { kind: "SURVIVOR" }), equal, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(leaf(gcdScope, { kind: "SURVIVOR" }), gcdScope, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(leaf(fiber, { kind: "SURVIVOR" }), fiber, contract).status).toBe("INVALID");
  });
  it("independently agrees with full-grid flat ordered enumeration, not orbit counts", () => {
    const expected = flat(fiber), certificate = buildLrcModularCertificate(fiber, contract);
    expect(certificate.nodes.some((n) => n.kind === "SPLIT")).toBe(true);
    expect(verifyLrcModularCertificate(certificate, fiber, contract)).toMatchObject({ status: "COMPLETE", totalTuples: 16, classifiedTuples: 16, unresolvedTuples: 0, ...expected });
  });
  it("recovers exactly the pinned author's two complete p199 binary survivor sets", () => {
    const tight: LrcModularScope = { ...base, prime: 199, sourceDigest: "946ba9d5cb77db00bf52aa7831beef3fc12acb7136095601550b074687b24a18",
      digitAxes: Array.from({ length: 13 }, () => [0, 1]) };
    const tightChecked = verifyLrcModularCertificate(buildLrcModularCertificate(tight, contract), tight, contract);
    expect(tightChecked).toMatchObject({ status: "COMPLETE", totalTuples: 8192, classifiedTuples: 8192, witnessTuples: 8187, gcdTuples: 2, survivorTuples: 3, unresolvedTuples: 0 });
    expect(tightChecked.survivors.map((s) => s.residues)).toEqual([
      Array.from({ length: 13 }, (_, i) => i + 1),
      [200, 2, 202, 203, 204, 205, 206, 8, 208, 10, 210, 12, 212],
      [200, 2, 202, 203, 204, 205, 206, 207, 208, 10, 210, 12, 212],
    ]);
    const gw: LrcModularScope = { ...tight, parentResidues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 24],
      sourceDigest: "9a441e4a96750c519a53c8708292e816cb302eb1201f499882ba17e7cf6e9297" };
    const gwChecked = verifyLrcModularCertificate(buildLrcModularCertificate(gw, contract), gw, contract);
    expect(gwChecked).toMatchObject({ status: "COMPLETE", totalTuples: 8192, classifiedTuples: 8192, witnessTuples: 8190, gcdTuples: 1, survivorTuples: 1, unresolvedTuples: 0 });
    expect(gwChecked.survivors).toEqual([{ digits: Array(13).fill(0), residues: gw.parentResidues }]);
  }, 20000);
  it("checks all49 terminal lifts in each actual restricted shard and the archived grid-free prefix", () => {
    const roots = [
      [200, 2, 202, 203, 204, 205, 206, 8, 208, 10, 210, 12, 212],
      [200, 2, 202, 203, 204, 205, 206, 207, 208, 10, 210, 12, 212],
      Array.from({ length: 13 }, (_, i) => i + 1),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 24],
    ];
    const prefixes = [[4, 2, 6, 0, 1, 2, 3, 1, 5, 3, 0, 5, 2], [4, 2, 6, 0, 1, 2, 3, 4, 5, 3, 0, 5, 2],
      [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 6, 3]];
    for (let row = 0; row < 4; row++) {
      const scope: LrcModularScope = { ...base, prime: 199, parentLevel: 2, targetLevel: 14, parentResidues: roots[row],
        digitAxes: prefixes[row].map((d, a) => a < 11 ? [d] : [0, 1, 2, 3, 4, 5, 6]),
        sourceDigest: row === 3 ? "9a441e4a96750c519a53c8708292e816cb302eb1201f499882ba17e7cf6e9297" : "946ba9d5cb77db00bf52aa7831beef3fc12acb7136095601550b074687b24a18" };
      expect(verifyLrcModularCertificate(buildLrcModularCertificate(scope, contract), scope, contract)).toMatchObject({ status: "COMPLETE", totalTuples: 49, classifiedTuples: 49, unresolvedTuples: 0, ...flat(scope) });
      const archivedSingleton: LrcModularScope = { ...scope, digitAxes: prefixes[row].map((d) => [d]) };
      expect(verifyLrcModularCertificate(buildLrcModularCertificate(archivedSingleton, contract), archivedSingleton, contract))
        .toMatchObject({ status: "COMPLETE", totalTuples: 1, witnessTuples: 0, gcdTuples: 1, survivorTuples: 0, unresolvedTuples: 0 });
    }
  }, 20000);
  it("rejects fully rehashed missing, overlap, gap, duplicate, unreachable, reused and cyclic branches", () => {
    const original = buildLrcModularCertificate(fiber, contract);
    const mutants: Array<(c: LrcModularCertificate) => void> = [
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") c.nodes = c.nodes.filter((m) => m.id !== n.children[0]); },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") c.nodes.find((m) => m.id === n.children[1])!.box.lower[n.axis]--; },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") n.children.reverse(); },
      (c) => { c.nodes.push(structuredClone(c.nodes[0])); },
      (c) => { c.nodes.push({ ...structuredClone(c.nodes[0]), id: "unreachable" }); },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") n.children[1] = n.children[0]; },
      (c) => { const n = c.nodes.find((n) => n.kind === "SPLIT")!; if (n.kind === "SPLIT") n.children[0] = n.id; },
      (c) => { c.nodes[0].box.upper[0]--; },
    ];
    for (const mutate of mutants) { const c = structuredClone(original); mutate(c); expect(verifyLrcModularCertificate(seal(c), fiber, contract).status).toBe("INVALID"); }
  });
  it("rejects scope/source/parent-label/root drift even after full coherent certificate rehash", () => {
    const certificate = buildLrcModularCertificate(fiber, contract);
    for (const scope of [{ ...fiber, sourceDigest: "c".repeat(64) }, { ...fiber, parentResidues: [...fiber.parentResidues].reverse() },
      { ...fiber, digitAxes: fiber.digitAxes.map((a, i) => i === 0 ? [0] : a) }, { ...fiber, prime: 19 }]) {
      expect(verifyLrcModularCertificate(buildLrcModularCertificate(scope, contract), fiber, contract).status).toBe("INVALID");
    }
    expect(verifyLrcModularCertificate(certificate, fiber, "d".repeat(64)).status).toBe("INVALID");
    expect(verifyLrcModularCertificate({ ...certificate, certificateDigest: "e".repeat(64) }, fiber, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate({ ...certificate, theorem: true }, fiber, contract).status).toBe("INVALID");
    const bad = structuredClone(certificate); Object.assign(bad.nodes[0], { witnessTuples: 16 });
    expect(verifyLrcModularCertificate(seal(bad), fiber, contract).status).toBe("INVALID");
  });
  it("fails closed on work, time, node, output limits without dropping the sealed domain", () => {
    for (const options of [{ maxWork: 0 }, { timeoutMs: 0 }, { maxNodes: 1 }, { maxBytes: 1024 }]) {
      const certificate = buildLrcModularCertificate(fiber, contract, options);
      const summary = verifyLrcModularCertificate(certificate, fiber, contract);
      expect(summary.status).toBe("PARTIAL"); expect(summary.unresolvedTuples).toBeGreaterThan(0);
      expect(summary.classifiedTuples + summary.unresolvedTuples).toBe(16);
    }
    expect(() => buildLrcModularCertificate(base, contract, { maxWork: 20000001 })).toThrow();
    expect(() => buildLrcModularCertificate(base, contract, { maxNodes: 40001 })).toThrow();
    expect(() => buildLrcModularCertificate(base, contract, { timeoutMs: 10001 })).toThrow();
    expect(() => buildLrcModularCertificate(base, contract, { maxBytes: 8388609 })).toThrow();
  });
  it("charges final producer sealing and consumer serialization checkpoints", () => {
    const spy = vi.spyOn(performance, "now").mockReturnValue(0);
    try {
      buildLrcModularCertificate(equal, contract, { timeoutMs: 1 });
      const producerCalls = spy.mock.calls.length; spy.mockClear(); let calls = 0;
      spy.mockImplementation(() => ++calls >= producerCalls ? 2 : 0);
      const partial = buildLrcModularCertificate(equal, contract, { timeoutMs: 1 });
      spy.mockReturnValue(0);
      expect(verifyLrcModularCertificate(partial, equal, contract).status).toBe("PARTIAL");
      spy.mockClear(); const certificate = leaf(equal, { kind: "GRID", gridIndex: 17 });
      verifyLrcModularCertificate(certificate, equal, contract);
      const consumerCalls = spy.mock.calls.length; spy.mockClear(); calls = 0;
      spy.mockImplementation(() => ++calls >= consumerCalls ? 10001 : 0);
      expect(verifyLrcModularCertificate(certificate, equal, contract)).toMatchObject({ status: "INVALID", errors: ["VERIFICATION_TIME_LIMIT"] });
    } finally { spy.mockRestore(); }
  });
  it("rejects byte overflow, cyclic/non-JSON input and unknown leaf types", () => {
    expect(verifyLrcModularCertificate({ text: "x".repeat(8388609) }, base, contract).status).toBe("INVALID");
    const cyclic: Record<string, unknown> = {}; cyclic.self = cyclic;
    expect(verifyLrcModularCertificate(cyclic, base, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(undefined, base, contract).status).toBe("INVALID");
    expect(verifyLrcModularCertificate(null, base, "bad").status).toBe("INVALID");
    const bad = leaf(base, { kind: "SURVIVOR" }); Object.assign(bad.nodes[0], { kind: "LRC_PROVED" });
    expect(verifyLrcModularCertificate(seal(bad), base, contract).status).toBe("INVALID");
  });
});
