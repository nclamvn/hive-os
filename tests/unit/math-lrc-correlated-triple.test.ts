import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildLrcCorrelatedTripleReport, validateLrcCorrelatedTripleReport, LRC_CORRELATED_TRIPLE_LIMITS,
  type CorrelatedTripleEvidence, type CorrelatedTripleFraction as F } from "@/modules/research-sandbox/math-lrc-correlated-triple";

const budget = () => ({ remainingMs: 5000, remainingOperations: 2000000 });
const built = buildLrcCorrelatedTripleReport(budget());
const fresh = () => structuredClone(built.evidence!) as CorrelatedTripleEvidence;
function f(n: bigint, d: bigint): F {
  let a = n < BigInt(0) ? -n : n, b = d;
  while (b) [a, b] = [b, a % b]; return [(n / a).toString(), (d / a).toString()];
}
function add(a: F, b: F): F { return f(BigInt(a[0]) * BigInt(b[1]) + BigInt(b[0]) * BigInt(a[1]), BigInt(a[1]) * BigInt(b[1])); }
function multiply(a: F, k: number): F { return f(BigInt(a[0]) * BigInt(k), BigInt(a[1])); }
function cmp(a: F, b: F): number { const difference = BigInt(a[0]) * BigInt(b[1]) - BigInt(b[0]) * BigInt(a[1]); return difference === BigInt(0) ? 0 : difference < BigInt(0) ? -1 : 1; }
function distance(a: F): F { const d = BigInt(a[1]), rem = (BigInt(a[0]) % d + d) % d; return f(rem < d - rem ? rem : d - rem, d); }
function min(values: F[]): F { return values.reduce((a, b) => cmp(a, b) <= 0 ? a : b); }
function max(values: F[]): F { return values.reduce((a, b) => cmp(a, b) >= 0 ? a : b); }
function matrix(time: F, speeds: number[], d: number): F[][] { return Array.from({ length: d }, (_, j) => speeds.map(speed => distance(multiply(add(time, [String(j), String(d)]), speed)))); }
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => [k, canonical(v)]));
  return value;
}
function rehash(input: CorrelatedTripleEvidence): CorrelatedTripleEvidence { input.reportDigest = createHash("sha256").update(JSON.stringify(canonical(input.report))).digest("hex"); return input; }
function refused(raw: unknown, status = "REPORT_REFUSED"): void { const result = validateLrcCorrelatedTripleReport(raw, budget()); expect(result.status).toBe(status); expect(result.evidence).toBeNull(); }

describe("TIP072N correlated doubled-pair diagnostic; not live research execution", () => {
  it("constructs a full bounded deeply immutable deterministic report", () => {
    expect(built.status).toBe("ACCEPTED"); expect(Buffer.byteLength(JSON.stringify(built.evidence))).toBe(31491);
    expect(built.chargedOperations).toBeGreaterThan(1000); expect(built.chargedOperations).toBeLessThan(2000000); expect(built.elapsedMs).toBeLessThan(5000);
    expect(Object.isFrozen(built.evidence!.report.positiveFixtures[0].coordinateDistances[0])).toBe(true);
    expect(buildLrcCorrelatedTripleReport(budget()).evidence).toEqual(built.evidence);
    expect(built.evidence!.reportDigest).toBe(rehash(fresh()).reportDigest);
    expect(validateLrcCorrelatedTripleReport(fresh(), budget()).status).toBe("ACCEPTED");
  });
  it("retains exact legends losslessly instead of omitting fields/fixtures to fit limits", () => {
    expect(built.evidence!.report.legend).toEqual({ fixtureKinds: ["HARMONIC", "ARBITRARY_THIRD"], selectionRules: ["HARMONIC_SEGMENT_WITH_CARRY", "LOWEST_PHYSICAL_GOOD_SHIFT"], lowerLrcAssumptions: ["LRC(10)", "LRC(11)"] });
    expect(built.evidence!.report.positiveFixtures).toHaveLength(26);
  });
  it("closed proof segments have exact floor and complete affine fractional ranges", () => {
    const report = built.evidence!.report;
    expect(report.proofSegments.map(segment => [segment.left, segment.right, segment.normalizedShift])).toEqual([
      [["0", "1"], ["1", "9"], 1], [["1", "9"], ["2", "9"], 2], [["2", "9"], ["1", "3"], 1],
    ]);
    for (const segment of report.proofSegments) for (const coordinate of segment.coordinates) {
      expect(coordinate.slope).toBe(coordinate.multiplier);
      const left = multiply(add(segment.left, [String(segment.normalizedShift), "3"]), coordinate.multiplier);
      const right = multiply(add(segment.right, [String(segment.normalizedShift), "3"]), coordinate.multiplier);
      expect(Number(BigInt(left[0]) / BigInt(left[1]))).toBe(coordinate.floor); expect(Number(BigInt(right[0]) / BigInt(right[1]))).toBe(coordinate.floor);
      const lo = add(left, [String(-coordinate.floor), "1"]), hi = add(right, [String(-coordinate.floor), "1"]);
      expect(coordinate.fractionalRange).toEqual([lo, hi]); expect(cmp(lo, ["1", "9"])).toBeGreaterThanOrEqual(0); expect(cmp(hi, ["8", "9"])).toBeLessThanOrEqual(0);
      expect(add(add(multiply(segment.left, coordinate.slope), coordinate.intercept), [String(-coordinate.floor), "1"])).toEqual(lo);
      expect(add(add(multiply(segment.right, coordinate.slope), coordinate.intercept), [String(-coordinate.floor), "1"])).toEqual(hi);
    }
  });
  it("retains all critical boundaries and nineteen cells including both endpoints", () => {
    const partition = built.evidence!.report.partition;
    expect(partition.boundaries).toEqual([["0", "1"], ["1", "36"], ["1", "18"], ["1", "9"], ["5", "36"], ["7", "36"], ["2", "9"], ["5", "18"], ["11", "36"], ["1", "3"]]);
    expect(partition.cells).toHaveLength(19); expect(partition.cells.filter(cell => cell.kind === "BOUNDARY")).toHaveLength(10);
    expect(partition.cells.filter(cell => cell.kind === "OPEN")).toHaveLength(9);
    expect(partition.cells[0].representative).toEqual(["0", "1"]); expect(partition.cells.at(-1)!.representative).toEqual(["1", "3"]);
  });
  it.each(Array.from({ length: 19 }, (_, i) => i))("independently checks cell %s distances, strict-bad pair union and selector", index => {
    const cell = built.evidence!.report.partition.cells[index], expected = matrix(cell.representative, [1, 2, 4], 3);
    expect(cell.distances).toEqual(expected);
    expect(cell.goodShiftIndices).toEqual(expected.flatMap((row, j) => cmp(min(row), ["1", "9"]) >= 0 ? [j] : []));
    expect(cell.pairBadUnionIndices).toEqual(expected.flatMap((row, j) => row.slice(0, 2).some(value => cmp(value, ["1", "9"]) < 0) ? [j] : []));
    expect(cell.pairBadUnionIndices.length).toBeLessThanOrEqual(1); expect(cell.goodShiftIndices).toContain(cell.normalizedShift);
    if (cell.kind === "BOUNDARY") expect(cell.left).toEqual(cell.right);
    else {
      const sum = add(cell.left, cell.right); expect(cell.representative).toEqual(f(BigInt(sum[0]), BigInt(sum[1]) * BigInt(2)));
      for (const weight of [1, 3]) {
        const interiorSum = add(multiply(cell.left, 4 - weight), multiply(cell.right, weight));
        const x = f(BigInt(interiorSum[0]), BigInt(interiorSum[1]) * BigInt(4)), rows = matrix(x, [1, 2, 4], 3);
        expect(rows.flatMap((row, j) => cmp(min(row), ["1", "9"]) >= 0 ? [j] : [])).toEqual(cell.goodShiftIndices);
      }
    }
  });
  it("sharpness exactly refutes every larger uniform exception threshold", () => {
    const sharp = built.evidence!.report.sharpness;
    expect(sharp.phase).toEqual(["1", "9"]); expect(sharp.distances).toEqual(matrix(sharp.phase, [1, 2, 4], 3));
    expect(sharp.minimumDistanceByShift).toEqual([["1", "9"], ["1", "9"], ["1", "9"]]); expect(sharp.maximumMinimumDistance).toEqual(["1", "9"]);
    expect(built.evidence!.report.threshold).toEqual(["1", "9"]);
  });
  it("independent-phase zero obstruction is distinct from common-time positivity", () => {
    const obstruction = built.evidence!.report.independentObstruction;
    expect(obstruction.unitResidues).toEqual([1, 2, 1]); expect(obstruction.phases).toEqual([["0", "1"], ["1", "3"], ["1", "3"]]);
    const expected = Array.from({ length: 3 }, (_, j) => obstruction.unitResidues.map((unit, i) => distance(add(obstruction.phases[i], [String(unit * j), "3"]))));
    expect(obstruction.distances).toEqual(expected); expect(obstruction.minima).toEqual(expected.map(min)); expect(obstruction.maximumMinimumDistance).toEqual(["0", "1"]);
  });
  it.each(Array.from({ length: 26 }, (_, i) => i))("replays positive fixture %s all coordinates and counting conventions independently", index => {
    const report = built.evidence!.report, fixture = report.positiveFixtures[index], k = fixture.movingRunners;
    expect(fixture.totalRunners).toBe(k + 1); expect(fixture.speeds).toHaveLength(k); expect(new Set(fixture.speeds).size).toBe(k);
    expect(fixture.divisibleSpeeds).toEqual(Array.from({ length: k - 3 }, (_, i) => 3 * (i + 1)));
    expect(fixture.exceptionSpeeds).toEqual([fixture.q, 2 * fixture.q, fixture.v]); expect(fixture.speeds).toEqual([...fixture.divisibleSpeeds, ...fixture.exceptionSpeeds]);
    expect(report.legend.lowerLrcAssumptions[fixture.lowerLrcAssumption]).toBe(`LRC(${k - 3})`);
    expect(fixture.gamma).toEqual(["1", String(k - 2)]); expect(fixture.lowerMargin).toEqual(fixture.gamma); expect(fixture.tau).toEqual(fixture.gamma); expect(fixture.baseTime).toEqual(["1", String(3 * (k - 2))]);
    expect(fixture.exceptionDistancesByShift).toEqual(matrix(fixture.baseTime, fixture.exceptionSpeeds, 3));
    expect((fixture.q * fixture.qInverse) % 3).toBe(1);
    expect(fixture.normalizedPhase).toEqual(add(multiply(fixture.baseTime, fixture.q), [String(-fixture.carry), "3"]));
    expect(cmp(fixture.normalizedPhase, ["0", "1"])).toBeGreaterThanOrEqual(0); expect(cmp(fixture.normalizedPhase, ["1", "3"])).toBeLessThan(0);
    expect(fixture.time).toEqual(add(fixture.baseTime, [String(fixture.physicalShift), "3"]));
    const distances = fixture.speeds.map(speed => distance(multiply(fixture.time, speed)));
    expect(fixture.coordinateDistances).toEqual(distances); expect(fixture.minimumDistance).toEqual(min(distances)); expect(fixture.minimumDistance).toEqual(fixture.gamma);
    expect(fixture.lowerWitnessVerified).toBe(true);
    if (fixture.kind === 0) {
      expect(fixture.v).toBe(4 * fixture.q); expect(fixture.selectionRule).toBe(0);
      expect(fixture.physicalShift).toBe(((fixture.qInverse * (fixture.normalizedShift - fixture.carry)) % 3 + 3) % 3);
    } else {
      expect(fixture.v).not.toBe(4 * fixture.q); expect(fixture.selectionRule).toBe(1);
      const good = fixture.exceptionDistancesByShift.findIndex(row => cmp(min(row), ["1", "9"]) >= 0); expect(fixture.physicalShift).toBe(good);
    }
  });
  it("retains exactly 351 full coordinate distances and six nonharmonic-third fixtures", () => {
    expect(built.evidence!.report.positiveFixtures.reduce((total, fixture) => total + fixture.coordinateDistances.length, 0)).toBe(351);
    expect(built.evidence!.report.positiveFixtures.filter(fixture => fixture.kind === 1).map(fixture => [fixture.movingRunners, fixture.q, fixture.v])).toEqual([[13, 1, 5], [13, 2, 7], [13, 13, 17], [14, 1, 5], [14, 2, 7], [14, 13, 17]]);
  });
  it("retains actual carry at k13/q14: omission produces a failing third coordinate", () => {
    const fixture = built.evidence!.report.positiveFixtures.find(f => f.kind === 0 && f.movingRunners === 13 && f.q === 14)!;
    expect([fixture.carry, fixture.qInverse, fixture.normalizedShift, fixture.physicalShift]).toEqual([1, 2, 1, 0]);
    const wrongJ = fixture.qInverse * fixture.normalizedShift % 3, wrongTime = add(fixture.baseTime, [String(wrongJ), "3"]);
    expect(wrongJ).toBe(2); expect(wrongTime).toEqual(["23", "33"]); expect(distance(multiply(wrongTime, 56))).toEqual(["1", "33"]);
    expect(cmp(distance(multiply(wrongTime, 56)), ["1", "9"])).toBeLessThan(0);
  });
  it.each([0, 1, 2, 3])("checks old-class no-automatic-improvement control %s", index => {
    const fixture = built.evidence!.report.oldClassNegatives[index];
    expect(fixture.lowerCoordinateDistances.every(v => cmp(v, ["1", "2"]) === 0)).toBe(true);
    expect(fixture.exceptionDistancesByShift).toEqual(matrix(fixture.baseTime, fixture.exceptionSpeeds, fixture.d));
    const full = matrix(fixture.baseTime, fixture.speeds, fixture.d).map(min); expect(fixture.fullMinimumByShift).toEqual(full);
    expect(max(full)).toEqual(fixture.oldDelta); expect(fixture.maximumFullMinimum).toEqual(fixture.oldDelta); expect(fixture.maximumExceptionMinimum).toEqual(fixture.oldDelta);
    expect(fixture.lowerWitnessVerified).toBe(true);
  });
  it("residue alias is not an exact doubled pair or a global counterexample", () => {
    const fixture = built.evidence!.report.residueAlias;
    expect(fixture.exceptionSpeeds).toEqual([1, 5, 4]); expect(fixture.residuePattern).toEqual([1, 2, 1]);
    expect(fixture.exceptionSpeeds.some(v => fixture.exceptionSpeeds.includes(2 * v))).toBe(false);
    expect(fixture.lowerMinimum).toEqual(["1", "5"]); expect(fixture.lowerCoordinateDistances).toEqual(fixture.divisibleSpeeds.map(v => distance(multiply(fixture.baseTime, v))));
    expect(fixture.fullMinimumByShift).toEqual(matrix(fixture.baseTime, fixture.speeds, 3).map(min)); expect(fixture.maximumFullMinimum).toEqual(["1", "15"]);
    expect(fixture.requiredPairPresent).toBe(false); expect(fixture.doesNotDisproveGlobalLrc).toBe(true);
  });
  it("keeps conditional, counting and authority boundaries explicit", () => {
    const scope = built.evidence!.report.scope;
    expect(scope.family).toBe("EXACT_Q_2Q_V_WITH_3_NOT_DIVIDING_QV"); expect(scope.movingRunnerConvention).toBe("K_MOVING_K_PLUS_ONE_TOTAL"); expect(scope.conditionalLowerWitnessRequired).toBe(true);
    for (const field of ["globalLrc", "formal", "external", "novelty"] as const) expect(scope[field]).toBe("NOT_ESTABLISHED");
    expect(scope.agentLoop).toBe("NOT_RUN"); expect(scope.executionAuthority || scope.residueOnlySufficient || scope.genericSpeedSolver).toBe(false);
  });
  it.each(["segment", "range", "floor", "intercept", "endpoint", "missingcell", "cellorder", "union", "good", "selector", "sharp", "obstruction", "carry", "inverse", "physical", "time", "coordinate", "gamma", "count", "general", "oldnegative", "alias", "legend", "assumption"])("refuses coherently rehashed semantic mutation %s", mode => {
    const input = fresh(), report = input.report, cell = report.partition.cells[0], fixture = report.positiveFixtures[0];
    if (mode === "segment") report.proofSegments[0].normalizedShift = 0;
    if (mode === "range") report.proofSegments[0].coordinates[0].fractionalRange[0] = ["0", "1"];
    if (mode === "floor") report.proofSegments[0].coordinates[0].floor++;
    if (mode === "intercept") report.proofSegments[1].coordinates[2].intercept = ["0", "1"];
    if (mode === "endpoint") report.partition.boundaries[0] = ["1", "100"];
    if (mode === "missingcell") report.partition.cells.pop();
    if (mode === "cellorder") report.partition.cells.reverse();
    if (mode === "union") cell.pairBadUnionIndices = [0, 1];
    if (mode === "good") cell.goodShiftIndices = [];
    if (mode === "selector") cell.normalizedShift = 0;
    if (mode === "sharp") report.sharpness.distances[0][0] = ["0", "1"];
    if (mode === "obstruction") report.independentObstruction.maximumMinimumDistance = ["1", "9"];
    if (mode === "carry") report.positiveFixtures.find(f => f.movingRunners === 13 && f.q === 14)!.carry = 0;
    if (mode === "inverse") fixture.qInverse = 2;
    if (mode === "physical") fixture.physicalShift = 0;
    if (mode === "time") fixture.time = ["0", "1"];
    if (mode === "coordinate") fixture.coordinateDistances[0] = ["0", "1"];
    if (mode === "gamma") fixture.gamma = ["1", "9"];
    if (mode === "count") fixture.totalRunners = fixture.movingRunners;
    if (mode === "general") report.positiveFixtures[20].selectionRule = 0;
    if (mode === "oldnegative") report.oldClassNegatives[0].maximumFullMinimum = ["1", "3"];
    if (mode === "alias") Object.assign(report.residueAlias, { requiredPairPresent: true });
    if (mode === "legend") report.legend.fixtureKinds.reverse();
    if (mode === "assumption") fixture.lowerLrcAssumption = 1;
    refused(rehash(input));
  });
  it.each(["globalLrc", "formal", "external", "novelty", "agentLoop", "family", "phaseDomain", "diagnosticKernel", "mathematicalClaim", "movingRunnerConvention"])("refuses promoted scope %s", field => {
    const input = fresh(); (input.report.scope as unknown as Record<string, unknown>)[field] = "PROVED"; refused(rehash(input));
  });
  it.each(["conditionalLowerWitnessRequired", "executionAuthority", "residueOnlySufficient", "genericSpeedSolver"])("refuses changed scope flag %s", field => {
    const input = fresh(), scope = input.report.scope as unknown as Record<string, unknown>; scope[field] = !scope[field]; refused(rehash(input));
  });
  it("refuses unknown fields, wrong digest and metrics within semantic evidence", () => {
    const wrong = fresh(); wrong.reportDigest = "0".repeat(64); refused(wrong);
    refused({ ...fresh(), verdict: "ACCEPTED" }); const withMetrics = fresh(); Object.assign(withMetrics.report, { elapsedMs: 1 }); refused(rehash(withMetrics));
  });
  it("property insertion order is harmless; returned evidence is detached", () => {
    const raw = fresh(); raw.report = Object.fromEntries(Object.entries(raw.report).reverse()) as typeof raw.report;
    const result = validateLrcCorrelatedTripleReport(raw, budget()); expect(result.status).toBe("ACCEPTED"); raw.report.partition.cells.pop(); expect(result.evidence!.report.partition.cells).toHaveLength(19);
  });
  it("does not invoke budget, report or array getters", () => {
    let calls = 0; const raw = fresh(); Object.defineProperty(raw, "report", { enumerable: true, get: () => { calls++; throw Error("secret"); } }); refused(raw);
    const array = fresh(); Object.defineProperty(array.report.partition.cells, "0", { enumerable: true, get: () => { calls++; return null; } }); refused(array);
    const b = budget(); Object.defineProperty(b, "remainingMs", { enumerable: true, get: () => { calls++; return 5000; } }); expect(buildLrcCorrelatedTripleReport(b).status).toBe("RESOURCE_REFUSED"); expect(calls).toBe(0);
  });
  it.each([Object.prototype, Array.prototype])("refuses inherited serialization hooks with zero invocation", prototype => {
    let calls = 0; Object.defineProperty(prototype, "toJSON", { configurable: true, get: () => { calls++; return () => "secret"; } });
    let result; try { result = buildLrcCorrelatedTripleReport(budget()); } finally { delete (prototype as { toJSON?: unknown }).toJSON; }
    expect(result!.status).toBe("REPORT_REFUSED"); expect(calls).toBe(0);
  });
  it.each([null, undefined, 1, true, new Date(), new Map(), Object.create({ inherited: "secret" }), NaN, Infinity, -0, 0.5])("refuses nonplain or noncanonical value %s", raw => refused(raw));
  it("refuses cycle, hidden/symbol/array extras and sparse arrays", () => {
    const cycle: Record<string, unknown> = {}; cycle.self = cycle; refused(cycle);
    const hidden = fresh(); Object.defineProperty(hidden, "secret", { value: 1 }); refused(hidden);
    const symbol = fresh(); Object.assign(symbol, { [Symbol("secret")]: true }); refused(symbol);
    const sparse = fresh(); delete sparse.report.partition.cells[0]; refused(sparse);
    const extra = fresh(); Object.assign(extra.report.partition.cells, { extra: true }); refused(extra);
  });
  it("refuses oversize, excessive depth and positive/negative 257-bit components", () => {
    refused({ huge: "x".repeat(32769) }, "RESOURCE_REFUSED");
    for (const sign of ["", "-"]) { const raw = fresh(); raw.report.threshold[0] = sign + (BigInt(1) << BigInt(256)).toString(); refused(raw, "RESOURCE_REFUSED"); }
    const raw: Record<string, unknown> = {}; let level = raw; for (let i = 0; i < 34; i++) { level.child = {}; level = level.child as Record<string, unknown>; } refused(raw, "RESOURCE_REFUSED");
  });
  it.each([0, -1, 0.5, 5001, NaN, Infinity])("refuses invalid time remaining %s", remainingMs => expect(buildLrcCorrelatedTripleReport({ ...budget(), remainingMs }).status).toBe("RESOURCE_REFUSED"));
  it.each([0, -1, 0.5, 2000001, NaN, Infinity])("refuses invalid work remaining %s", remainingOperations => expect(buildLrcCorrelatedTripleReport({ ...budget(), remainingOperations }).status).toBe("RESOURCE_REFUSED"));
  it.each([null, undefined, [], Object.create({ remainingMs: 5000 }), { remainingMs: 5000 }, { ...budget(), extra: true }])("refuses nonexact budget %s", raw => expect(buildLrcCorrelatedTripleReport(raw as ReturnType<typeof budget>).status).toBe("RESOURCE_REFUSED"));
  it("refuses hidden or symbol resource fields", () => {
    const hidden = budget(); Object.defineProperty(hidden, "remainingMs", { enumerable: false }); expect(buildLrcCorrelatedTripleReport(hidden).status).toBe("RESOURCE_REFUSED");
    const symbol = budget(); Object.assign(symbol, { [Symbol("extra")]: true }); expect(buildLrcCorrelatedTripleReport(symbol).status).toBe("RESOURCE_REFUSED");
  });
  it("never resets exhausted allowance or returns partial positive evidence", () => {
    const one = buildLrcCorrelatedTripleReport({ remainingMs: 5000, remainingOperations: 1 }); expect(one.status).toBe("RESOURCE_REFUSED"); expect(one.evidence).toBeNull();
    expect(validateLrcCorrelatedTripleReport(fresh(), { remainingMs: 5000, remainingOperations: built.chargedOperations }).status).toBe("RESOURCE_REFUSED");
    expect(LRC_CORRELATED_TRIPLE_LIMITS).toEqual({ bytes: 32768, milliseconds: 5000, operations: 2000000, componentBits: 256 });
  });
});
