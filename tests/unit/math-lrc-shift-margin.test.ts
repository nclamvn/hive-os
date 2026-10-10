import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildLrcSharpShiftMarginReport, validateLrcSharpShiftMarginReport, LRC_SHARP_SHIFT_MARGIN_LIMITS,
  type ShiftMarginEvidence, type ShiftMarginFraction } from "@/modules/research-sandbox/math-lrc-shift-margin";

const budget = () => ({ remainingMs: 5000, remainingOperations: 2000000 });
const built = buildLrcSharpShiftMarginReport(budget());
const evidence = () => structuredClone(built.evidence!) as ShiftMarginEvidence;
const rational = (v: ShiftMarginFraction) => Number(v[0]) / Number(v[1]);
function sorted(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => [k, sorted(v)]));
  return value;
}
function rehash(value: ShiftMarginEvidence): ShiftMarginEvidence {
  value.reportDigest = createHash("sha256").update(JSON.stringify(sorted(value.report))).digest("hex"); return value;
}
function refuse(value: unknown, status = "REPORT_REFUSED"): void {
  const result = validateLrcSharpShiftMarginReport(value, budget()); expect(result.status).toBe(status); expect(result.evidence).toBeNull();
}

describe("TIP072M sharp shift margin pure core (not agent execution)", () => {
  it("builds one bounded immutable deterministic semantic report", () => {
    expect(built.status).toBe("ACCEPTED"); expect(built.evidence).not.toBeNull();
    expect(Buffer.byteLength(JSON.stringify(built.evidence))).toBeLessThanOrEqual(32768);
    expect(built.chargedOperations).toBeGreaterThan(1753); expect(built.chargedOperations).toBeLessThan(2000000);
    expect(built.elapsedMs).toBeLessThan(5000);
    expect(Object.isFrozen(built.evidence)).toBe(true); expect(Object.isFrozen(built.evidence!.report.classes[0].partitions[0].cells)).toBe(true);
    expect(buildLrcSharpShiftMarginReport(budget()).evidence).toEqual(built.evidence);
    expect(built.evidence!.reportDigest).toBe(rehash(evidence()).reportDigest);
  });
  it("validates by complete reconstruction rather than supplied hash/verdict", () => {
    expect(validateLrcSharpShiftMarginReport(evidence(), budget()).status).toBe("ACCEPTED");
    const input = evidence(), report = input.report; input.report = Object.fromEntries(Object.entries(report).reverse()) as typeof report;
    expect(validateLrcSharpShiftMarginReport(input, budget()).status).toBe("ACCEPTED");
  });
  it.each([[0, 3, 2, 1, 4, 16, 1, 13], [1, 5, 2, 2, 15, 225, 1, 13], [2, 5, 3, 1, 6, 216, 2, 12], [3, 5, 4, 1, 6, 1296, 1, 11]])(
    "enumerates every attainable-family tuple for class %s", (index, d, e, r, family, count, survivors, denominator) => {
      const item = built.evidence!.report.classes[index];
      expect([item.d, item.e, item.r]).toEqual([d, e, r]); expect(rational(item.delta)).toBe(r / (2 * d));
      expect(item.attainableMasks).toHaveLength(family); expect(item.tupleCount).toBe(count);
      expect(item.minimumGoodShifts).toBe(survivors); expect(item.guaranteedGoodShifts).toBe(d - e * r);
      expect(item.conditional.lowerMovingRunners).toBe(14 - e); expect(item.conditional.lowerLrcAssumption).toBe(`LRC(${14 - e})`);
      expect(item.conditional.guaranteedMargin).toEqual(["1", String(denominator)]);
    });
  it("covers 1753 tuples without a redundant unit/cell cross product", () => expect(built.evidence!.report.classes.reduce((sum, item) => sum + item.tupleCount, 0)).toBe(1753));
  it("deduplicates coincident roots; exhausts boundary/open/wrap cells and all unit residues", () => {
    for (const item of built.evidence!.report.classes) {
      expect(item.partitions.map(p => p.unitResidue)).toEqual(Array.from({ length: item.d - 1 }, (_, i) => i + 1));
      for (const partition of item.partitions) {
        const roots = partition.boundaries.map(rational); expect(new Set(roots).size).toBe(item.d); expect(roots).toEqual([...roots].sort((a, b) => a - b));
        expect(partition.cells).toHaveLength(2 * item.d);
        partition.cells.forEach((cell, index) => {
          const point = index % 2 === 0; expect(cell.kind).toBe(point ? "BOUNDARY" : "OPEN");
          expect(cell.badShiftIndices).toHaveLength(point ? item.r - 1 : item.r);
          expect(rational(cell.left)).toBe(roots[Math.floor(index / 2)]);
          const phase = rational(cell.representative);
          expect(phase).toBeGreaterThanOrEqual(0); expect(phase).toBeLessThan(1);
          const expected: number[] = [];
          for (let j = 0; j < item.d; j++) {
            const den = Number(cell.representative[1]), num = Number(cell.representative[0]), lattice = den * item.d;
            const residue = (num * item.d + partition.unitResidue * j * den) % lattice;
            if (Math.min(residue, lattice - residue) * Number(item.delta[1]) < Number(item.delta[0]) * lattice) expected.push(j);
          }
          expect(cell.badShiftIndices).toEqual(expected);
        });
        expect(rational(partition.cells.at(-1)!.right)).toBe(roots[0] + 1);
      }
    }
  });
  it("counts strict bad endpoints correctly: equality remains good", () => {
    const [first, second] = built.evidence!.report.classes;
    expect(first.attainableMasks).toEqual([[], [0], [1], [2]]);
    expect(second.attainableMasks.every(mask => mask.length === 1 || mask.length === 2)).toBe(true);
    for (const item of built.evidence!.report.classes) for (const partition of item.partitions) for (const cell of partition.cells.filter(c => c.kind === "BOUNDARY")) {
      expect(cell.badShiftIndices.length).toBe(item.r - 1);
    }
  });
  it("sharp cyclic witness has maximum minimum-distance exactly delta in every class", () => {
    for (const item of built.evidence!.report.classes) {
      expect(item.sharpness.unitResidues).toEqual(Array<number>(item.e).fill(1));
      item.sharpness.offsets.forEach((phase, i) => {
        const mod = 2 * item.d, expected = ((-(2 * i * (item.r + 1) + item.r) % mod) + mod) % mod;
        expect(rational(phase)).toBe(expected / mod);
        item.sharpness.distances[i].forEach((distance, j) => {
          const residue = (expected + 2 * j) % mod;
          expect(rational(distance)).toBe(Math.min(residue, mod - residue) / mod);
        });
      });
      const minima = Array.from({ length: item.d }, (_, j) => Math.min(...item.sharpness.distances.map(row => rational(row[j]))));
      expect(item.sharpness.minimumDistanceByShift.map(rational)).toEqual(minima);
      expect(Math.max(...minima)).toBe(rational(item.delta)); expect(item.sharpness.maximumMinimumDistance).toEqual(item.delta);
      expect(minima.every(value => value <= rational(item.delta))).toBe(true);
    }
  });
  it("does not conflate sharp distance witness with sharp survivor-count witness", () => {
    const item = built.evidence!.report.classes[1];
    expect(item.minimumGoodShifts).toBe(1);
    expect(item.sharpness.minimumDistanceByShift.filter(v => rational(v) >= rational(item.delta))).toHaveLength(3);
  });
  it("keeps assumptions and global/formal/novelty/agent/authority gates closed", () => {
    const scope = built.evidence!.report.scope;
    expect(scope.lowerLrcAssumptionsRequired && scope.lowerWitnessAssumed && scope.analyticAlignmentAssumed).toBe(true);
    for (const key of ["globalLrc", "speedTupleSharpness", "formal", "external", "novelty"] as const) expect(scope[key]).toBe("NOT_ESTABLISHED");
    expect(scope.agentLoop).toBe("NOT_RUN"); expect(scope.executionAuthority).toBe(false);
  });
  it.each(["tupleCount", "minimumGoodShifts", "guaranteedGoodShifts", "d", "e", "r"])("refuses coherently rehashed changed %s", key => {
    const input = evidence(); (input.report.classes[0] as unknown as Record<string, number>)[key]++; refuse(rehash(input));
  });
  it.each(["globalLrc", "formal", "external", "novelty", "agentLoop", "mathematicalClaim", "phaseDomain", "diagnosticScope"])("refuses promoted scope %s", key => {
    const input = evidence(); (input.report.scope as unknown as Record<string, unknown>)[key] = "PROVED"; refuse(rehash(input));
  });
  it.each(["lowerLrcAssumptionsRequired", "lowerWitnessAssumed", "analyticAlignmentAssumed", "executionAuthority"])("refuses changed scope flag %s", key => {
    const input = evidence(), scope = input.report.scope as unknown as Record<string, unknown>; scope[key] = !scope[key]; refuse(rehash(input));
  });
  it.each(["root", "extra", "unit", "cell", "wrap", "mask", "offset", "distance", "minimum", "margin", "assumption", "fraction", "classorder", "partitionorder", "cellorder", "maskorder"])("refuses coherent reconstruction tamper %s", mode => {
    const input = evidence(), item = input.report.classes[0], partition = item.partitions[0];
    if (mode === "root") partition.boundaries[0][0] = "99";
    if (mode === "extra") Object.assign(item, { proved: true });
    if (mode === "unit") partition.unitResidue = 0;
    if (mode === "cell") partition.cells.pop();
    if (mode === "wrap") partition.cells.at(-1)!.right = ["0", "1"];
    if (mode === "mask") partition.cells[0].badShiftIndices.push(0);
    if (mode === "offset") item.sharpness.offsets[0][0] = "0";
    if (mode === "distance") item.sharpness.distances[0][0][0] = "0";
    if (mode === "minimum") item.sharpness.maximumMinimumDistance[0] = "0";
    if (mode === "margin") item.conditional.guaranteedMargin[1] = "15";
    if (mode === "assumption") Object.assign(item.conditional, { lowerWitnessAssumed: false });
    if (mode === "fraction") item.delta = ["2", "12"];
    if (mode === "classorder") input.report.classes.reverse();
    if (mode === "partitionorder") item.partitions.reverse();
    if (mode === "cellorder") partition.cells.reverse();
    if (mode === "maskorder") item.attainableMasks.reverse();
    refuse(rehash(input));
  });
  it("refuses wrong digest, extra envelope fields and metrics inside content", () => {
    const input = evidence(); input.reportDigest = "0".repeat(64); refuse(input);
    refuse({ ...evidence(), elapsedMs: 1 }); const next = evidence(); Object.assign(next.report, { chargedOperations: 1 }); refuse(rehash(next));
  });
  it("does not invoke getters in budget or evidence", () => {
    let count = 0; const raw = evidence(); Object.defineProperty(raw, "report", { enumerable: true, get: () => { count++; throw Error("secret"); } }); refuse(raw);
    const b = budget(); Object.defineProperty(b, "remainingMs", { enumerable: true, get: () => { count++; return 5000; } }); expect(buildLrcSharpShiftMarginReport(b).status).toBe("RESOURCE_REFUSED"); expect(count).toBe(0);
  });
  it.each([Object.prototype, Array.prototype])("does not invoke inherited serialization hooks", prototype => {
    let calls = 0; Object.defineProperty(prototype, "toJSON", { configurable: true, get: () => { calls++; return () => "secret"; } });
    let result; try { result = buildLrcSharpShiftMarginReport(budget()); } finally { delete (prototype as { toJSON?: unknown }).toJSON; }
    expect(result!.status).toBe("REPORT_REFUSED"); expect(calls).toBe(0);
  });
  it.each([null, undefined, true, 1, new Date(), new Map(), Object.create({ hidden: true })])("refuses nonplain evidence %s", raw => refuse(raw));
  it("refuses cycle, sparse arrays, symbols and hidden fields", () => {
    const cycle: Record<string, unknown> = {}; cycle.self = cycle; refuse(cycle);
    refuse(new Array(2)); const symbol = evidence(); Object.assign(symbol, { [Symbol("credential")]: true }); refuse(symbol);
    const hidden = evidence(); Object.defineProperty(hidden, "secret", { value: "hidden" }); refuse(hidden);
  });
  it("does not execute accessor array indices", () => {
    let calls = 0; const raw = evidence(); Object.defineProperty(raw.report.classes, "0", { enumerable: true, get: () => { calls++; return null; } });
    refuse(raw); expect(calls).toBe(0);
  });
  it.each([NaN, Infinity, -0, 0.5, Number.MAX_SAFE_INTEGER + 1])("refuses noncanonical numeric passive input %s", raw => refuse(raw));
  it.each([null, undefined, [], Object.create({ remainingMs: 5000 }), { remainingMs: 5000 }, { ...budget(), extra: true }])("refuses non-exact resource descriptor %s", raw => {
    expect(buildLrcSharpShiftMarginReport(raw as ReturnType<typeof budget>).status).toBe("RESOURCE_REFUSED");
  });
  it("refuses oversized passive inputs before hashing", () => {
    refuse({ huge: "x".repeat(32769) }, "RESOURCE_REFUSED");
    const big = evidence(); big.report.classes[0].delta[0] = (BigInt(1) << BigInt(256)).toString(); refuse(big, "RESOURCE_REFUSED");
    const deep: Record<string, unknown> = {}; let level = deep; for (let i = 0; i < 34; i++) { level.deep = {}; level = level.deep as Record<string, unknown>; } refuse(deep, "RESOURCE_REFUSED");
  });
  it.each([0, -1, 0.5, 5001, NaN, Infinity])("refuses invalid time budget %s", remainingMs => expect(buildLrcSharpShiftMarginReport({ ...budget(), remainingMs }).status).toBe("RESOURCE_REFUSED"));
  it.each([0, -1, 0.5, 2000001, NaN, Infinity])("refuses invalid operation budget %s", remainingOperations => expect(buildLrcSharpShiftMarginReport({ ...budget(), remainingOperations }).status).toBe("RESOURCE_REFUSED"));
  it("honors finite remaining budget without resetting it", () => {
    expect(buildLrcSharpShiftMarginReport({ remainingMs: 5000, remainingOperations: 1 }).status).toBe("RESOURCE_REFUSED");
    expect(validateLrcSharpShiftMarginReport(evidence(), { remainingMs: 5000, remainingOperations: built.chargedOperations }).status).toBe("RESOURCE_REFUSED");
    expect(LRC_SHARP_SHIFT_MARGIN_LIMITS).toEqual({ bytes: 32768, milliseconds: 5000, operations: 2000000, componentBits: 256 });
  });
});
