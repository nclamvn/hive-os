import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildLrcFiveExceptionReport, validateLrcFiveExceptionReport, LRC_FIVE_EXCEPTION_LIMITS,
  type FiveExceptionEvidence, type FiveExceptionFraction as F } from "@/modules/research-sandbox/math-lrc-five-exception";

const budget = () => ({ remainingMs: 5000, remainingOperations: 2000000 });
const built = buildLrcFiveExceptionReport(budget());
const fresh = () => structuredClone(built.evidence!) as FiveExceptionEvidence;
function f(n: bigint, d: bigint): F { let a = n < BigInt(0) ? -n : n, b = d; while (b) [a, b] = [b, a % b]; return [(n / a).toString(), (d / a).toString()]; }
function add(a: F, b: F): F { return f(BigInt(a[0]) * BigInt(b[1]) + BigInt(b[0]) * BigInt(a[1]), BigInt(a[1]) * BigInt(b[1])); }
function times(a: F, k: number): F { return f(BigInt(a[0]) * BigInt(k), BigInt(a[1])); }
function cmp(a: F, b: F): number { const n = BigInt(a[0]) * BigInt(b[1]) - BigInt(b[0]) * BigInt(a[1]); return n === BigInt(0) ? 0 : n < BigInt(0) ? -1 : 1; }
function dist(a: F): F { const d = BigInt(a[1]), n = (BigInt(a[0]) % d + d) % d; return f(n < d - n ? n : d - n, d); }
function min(values: F[]): F { return values.reduce((a, b) => cmp(a, b) <= 0 ? a : b); }
function max(values: F[]): F { return values.reduce((a, b) => cmp(a, b) >= 0 ? a : b); }
function matrix(t: F, speeds: number[]): F[][] { return Array.from({ length: 5 }, (_, j) => speeds.map(speed => dist(times(add(t, [String(j), "5"]), speed)))); }
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => [k, canonical(v)]));
  return value;
}
function rehash(input: FiveExceptionEvidence): FiveExceptionEvidence { input.reportDigest = createHash("sha256").update(JSON.stringify(canonical(input.report))).digest("hex"); return input; }
function refused(value: unknown, status = "REPORT_REFUSED"): void { const result = validateLrcFiveExceptionReport(value, budget()); expect(result.status).toBe(status); expect(result.evidence).toBeNull(); }

describe("TIP072O fixed five-exception pair evidence; no agent authority", () => {
  it("builds one complete deterministic bounded deeply immutable report", () => {
    expect(built.status).toBe("ACCEPTED"); expect(Buffer.byteLength(JSON.stringify(built.evidence))).toBe(29162);
    expect(built.chargedOperations).toBeGreaterThan(1000); expect(built.chargedOperations).toBeLessThan(2000000); expect(built.elapsedMs).toBeLessThan(5000);
    expect(Object.isFrozen(built.evidence!.report.sharpness.fullDistancesByShift[0][0])).toBe(true);
    expect(buildLrcFiveExceptionReport(budget()).evidence).toEqual(built.evidence); expect(built.evidence!.reportDigest).toBe(rehash(fresh()).reportDigest);
    expect(validateLrcFiveExceptionReport(fresh(), budget()).status).toBe("ACCEPTED");
  });
  it("retains all six roots and eleven cells including both closed endpoints", () => {
    const partition = built.evidence!.report.partition;
    expect(partition.boundaries).toEqual([["0", "1"], ["1", "30"], ["1", "15"], ["2", "15"], ["1", "6"], ["1", "5"]]);
    expect(partition.cells).toHaveLength(11); expect(partition.cells.filter(c => c.kind === "BOUNDARY")).toHaveLength(6); expect(partition.cells.filter(c => c.kind === "OPEN")).toHaveLength(5);
    expect(partition.cells[0].representative).toEqual(["0", "1"]); expect(partition.cells.at(-1)!.representative).toEqual(["1", "5"]);
  });
  it.each(Array.from({ length: 11 }, (_, i) => i))("independently reconstructs pair cell %s complete distances/bad/good unions", index => {
    const cell = built.evidence!.report.partition.cells[index], rows = matrix(cell.representative, [1, 2]);
    expect(cell.distances).toEqual(rows);
    const bad = [0, 1].map(i => rows.flatMap((row, j) => cmp(row[i], ["1", "15"]) < 0 ? [j] : [])), union = [...new Set(bad.flat())].sort((a, b) => a - b);
    expect(cell.badShiftIndicesByCoordinate).toEqual(bad); expect(cell.pairBadUnionIndices).toEqual(union); expect(union.length).toBeLessThanOrEqual(1);
    expect(cell.pairGoodShiftIndices).toEqual(Array.from({ length: 5 }, (_, j) => j).filter(j => !union.includes(j)));
    expect(cell.pairGoodShiftIndices.length).toBeGreaterThanOrEqual(4);
    if (cell.kind === "BOUNDARY") expect(cell.left).toEqual(cell.right);
    else {
      const sum = add(cell.left, cell.right); expect(cell.representative).toEqual(f(BigInt(sum[0]), BigInt(sum[1]) * BigInt(2)));
      for (const weight of [1, 3]) {
        const total = add(times(cell.left, 4 - weight), times(cell.right, weight)), point = f(BigInt(total[0]), BigInt(total[1]) * BigInt(4)), inner = matrix(point, [1, 2]);
        expect([0, 1].map(i => inner.flatMap((row, j) => cmp(row[i], ["1", "15"]) < 0 ? [j] : []))).toEqual(bad);
      }
    }
  });
  it("uses strict BAD, so both transition boundaries have five good shifts", () => {
    for (const phase of [["1", "15"], ["2", "15"]]) {
      const cell = built.evidence!.report.partition.cells.find(c => c.kind === "BOUNDARY" && c.representative[0] === phase[0] && c.representative[1] === phase[1])!;
      expect(cell.pairBadUnionIndices).toEqual([]); expect(cell.pairGoodShiftIndices).toEqual([0, 1, 2, 3, 4]);
    }
  });
  it("checks the full sharp five-exception and fourteen-speed witness independently", () => {
    const sharp = built.evidence!.report.sharpness;
    expect(sharp.exceptionSpeeds).toEqual([1, 2, 3, 4, 7]); expect(sharp.baseTime).toEqual(["1", "15"]);
    expect(sharp.exceptionDistancesByShift).toEqual(matrix(sharp.baseTime, sharp.exceptionSpeeds));
    expect(sharp.exceptionMinimumByShift).toEqual([["1", "15"], ["1", "15"], ["1", "15"], ["0", "1"], ["1", "15"]]);
    expect(sharp.maximumExceptionMinimum).toEqual(["1", "15"]);
    expect(sharp.speeds).toHaveLength(14); expect(sharp.divisibleSpeeds).toEqual(sharp.divisibleReducedSpeeds.map(v => 5 * v));
    expect(sharp.tau).toEqual(["1", "3"]); expect(sharp.lowerCoordinateDistances).toEqual(sharp.divisibleReducedSpeeds.map(v => dist(times(sharp.tau, v))));
    expect(sharp.lowerMinimum).toEqual(["1", "3"]); expect(cmp(sharp.lowerMinimum, sharp.lowerMargin)).toBeGreaterThanOrEqual(0);
    const rows = matrix(sharp.baseTime, sharp.speeds); expect(sharp.fullDistancesByShift).toEqual(rows); expect(sharp.fullMinimumByShift).toEqual(rows.map(min)); expect(sharp.maximumFullMinimum).toEqual(max(rows.map(min))); expect(sharp.maximumFullMinimum).toEqual(["1", "15"]);
  });
  it("independent-phase zero obstruction does not satisfy the exact doubled relation", () => {
    const obstruction = built.evidence!.report.independentObstruction;
    expect(obstruction.unitResidues).toEqual([1, 2, 3, 4, 2]); expect(obstruction.phases).toEqual([["0", "1"], ["3", "5"], ["4", "5"], ["3", "5"], ["2", "5"]]);
    const rows = Array.from({ length: 5 }, (_, j) => obstruction.unitResidues.map((unit, i) => dist(add(obstruction.phases[i], [String(unit * j), "5"]))));
    expect(obstruction.distances).toEqual(rows); expect(obstruction.minima).toEqual(rows.map(min)); expect(obstruction.maximumMinimumDistance).toEqual(["0", "1"]);
    expect(obstruction.phases[1]).not.toEqual(times(obstruction.phases[0], 2));
  });
  it.each(Array.from({ length: 18 }, (_, i) => i))("replays complete positive fixture %s all fourteen coordinates/carry/lowest-shift", index => {
    const fixture = built.evidence!.report.positiveFixtures[index];
    expect([fixture.movingRunners, fixture.totalRunners]).toEqual([14, 15]); expect(fixture.speeds).toHaveLength(14); expect(new Set(fixture.speeds).size).toBe(14);
    expect(fixture.divisibleSpeeds).toEqual([5, 10, 15, 20, 25, 30, 35, 40, 45]); expect(fixture.exceptionSpeeds).toEqual([fixture.q, 2 * fixture.q, ...fixture.extraSpeeds]);
    expect(fixture.exceptionSpeeds.every(speed => speed > 0 && speed % 5 !== 0)).toBe(true); expect(fixture.speeds).toEqual([...fixture.divisibleSpeeds, ...fixture.exceptionSpeeds]);
    expect(fixture.tau).toEqual(["1", "10"]); expect(fixture.baseTime).toEqual(["1", "50"]); expect(fixture.lowerMargin).toEqual(["1", "10"]); expect(fixture.lowerLrcAssumption).toBe("LRC(9)");
    const rows = matrix(fixture.baseTime, fixture.exceptionSpeeds); expect(fixture.exceptionDistancesByShift).toEqual(rows);
    const lowest = rows.findIndex(row => cmp(min(row), ["1", "15"]) >= 0); expect(fixture.physicalShift).toBe(lowest); expect(fixture.selectionRule).toBe("LOWEST_PHYSICAL_GOOD_SHIFT");
    expect(fixture.normalizedPhase).toEqual(add(times(fixture.baseTime, fixture.q), [String(-fixture.carry), "5"]));
    expect(cmp(fixture.normalizedPhase, ["0", "1"])).toBeGreaterThanOrEqual(0); expect(cmp(fixture.normalizedPhase, ["1", "5"])).toBeLessThan(0);
    expect((fixture.q * fixture.qInverse) % 5).toBe(1); expect(fixture.normalizedShift).toBe((fixture.carry + fixture.q * fixture.physicalShift) % 5);
    expect(fixture.physicalShift).toBe(((fixture.qInverse * (fixture.normalizedShift - fixture.carry)) % 5 + 5) % 5);
    expect(fixture.time).toEqual(add(fixture.baseTime, [String(fixture.physicalShift), "5"]));
    const coordinates = fixture.speeds.map(speed => dist(times(fixture.time, speed))); expect(fixture.coordinateDistances).toEqual(coordinates); expect(fixture.minimumDistance).toEqual(min(coordinates));
    expect(fixture.gamma).toEqual(["1", "15"]); expect(cmp(fixture.minimumDistance, fixture.gamma)).toBeGreaterThanOrEqual(0); expect(fixture.lowerWitnessVerified).toBe(true);
    expect(fixture.divisibleSpeeds.every(speed => cmp(dist(times(fixture.baseTime, speed)), fixture.lowerMargin) >= 0)).toBe(true);
    if (fixture.kind === "SCALED") expect(fixture.extraSpeeds).toEqual([3 * fixture.q, 4 * fixture.q, 7 * fixture.q]);
  });
  it("retains eighteen fixtures and252 coordinates without forcing minima to equal guarantee", () => {
    const fixtures = built.evidence!.report.positiveFixtures;
    expect(fixtures).toHaveLength(18); expect(fixtures.reduce((n, fixture) => n + fixture.coordinateDistances.length, 0)).toBe(252);
    expect(fixtures.slice(0, 12).map(f => f.q)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14]);
    expect(fixtures.slice(12).map(f => [f.q, ...f.extraSpeeds])).toEqual([[1, 3, 7, 11], [2, 1, 7, 11], [3, 1, 2, 7], [4, 1, 3, 7], [11, 2, 3, 7], [14, 1, 3, 11]]);
    expect(fixtures.filter(f => cmp(f.minimumDistance, ["1", "10"]) === 0)).toHaveLength(10); expect(fixtures.filter(f => cmp(f.minimumDistance, ["2", "25"]) === 0)).toHaveLength(8);
  });
  it("retains a consequential carry-omission failure actually within fixed fixture index8", () => {
    const failure = built.evidence!.report.carryFailure, fixture = built.evidence!.report.positiveFixtures[failure.fixtureIndex];
    expect(failure.fixtureIndex).toBe(8); expect(fixture.q).toBe(11); expect([failure.carry, failure.qInverse, failure.normalizedShift, failure.correctPhysicalShift, failure.wrongPhysicalShift]).toEqual([1, 1, 1, 0, 1]);
    expect(failure.wrongTime).toEqual(["11", "50"]); expect(failure.wrongExceptionDistances).toEqual(fixture.exceptionSpeeds.map(speed => dist(times(failure.wrongTime, speed))));
    expect(failure.wrongMinimum).toEqual(["3", "50"]); expect(failure.wrongExceptionDistances[4]).toEqual(["3", "50"]); expect(cmp(failure.wrongMinimum, failure.requiredThreshold)).toBeLessThan(0);
  });
  it("residue alias has validlower witness but cannot be promoted to an exact pair gate", () => {
    const alias = built.evidence!.report.residueAlias;
    expect(alias.exceptionSpeeds).toEqual([6, 17, 11, 23, 29]); expect(alias.residuePattern).toEqual(alias.exceptionSpeeds.map(v => v % 5));
    expect(alias.exceptionSpeeds.some(speed => alias.exceptionSpeeds.includes(2 * speed))).toBe(false); expect(alias.requiredPairPresent).toBe(false); expect(alias.doesNotDisproveGlobalLrc).toBe(true);
    expect(alias.tau).toEqual(["5", "6"]); expect(alias.lowerCoordinateDistances).toEqual(alias.divisibleReducedSpeeds.map(v => dist(times(alias.tau, v)))); expect(alias.lowerMinimum).toEqual(["1", "6"]);
    expect(cmp(alias.lowerMinimum, alias.lowerMargin)).toBeGreaterThanOrEqual(0); expect(alias.fullDistancesByShift).toEqual(matrix(alias.baseTime, alias.speeds));
    expect(alias.fullMinimumByShift).toEqual([["0", "1"], ["1", "30"], ["1", "30"], ["1", "30"], ["1", "30"]]); expect(alias.maximumFullMinimum).toEqual(["1", "30"]);
  });
  it("rejects the tempting arbitrarythird three-exception1/5 upgrade", () => {
    const failed = built.evidence!.report.failedThirdUpgrade;
    expect(failed.exceptionSpeeds).toEqual([1, 2, 7]); expect(failed.distances).toEqual(matrix(failed.baseTime, failed.exceptionSpeeds));
    expect(failed.minimumByShift).toEqual([["1", "10"], ["1", "10"], ["0", "1"], ["1", "10"], ["1", "10"]]); expect(failed.maximumMinimumDistance).toEqual(["1", "10"]);
    expect(cmp(failed.maximumMinimumDistance, failed.invalidUpgradeMargin)).toBeLessThan(0); expect(failed.doesNotDisproveGlobalLrc).toBe(true);
  });
  it.each([[0, 3, 2, "1", "6", "1", "9", "INDEPENDENT"], [1, 3, 3, "0", "1", "1", "9", "PAIR"], [2, 5, 2, "1", "5", "1", "15", "INDEPENDENT"], [3, 5, 3, "1", "10", "1", "15", "INDEPENDENT"], [4, 5, 4, "1", "10", "1", "15", "INDEPENDENT"], [5, 5, 5, "0", "1", "1", "15", "PAIR"]])("keeps conservative route%s margin-selection and premises", (index, d, e, n, den, pn, pd, selected) => {
    const route = built.evidence!.report.routes[index as number]; expect([route.d, route.e]).toEqual([d, e]); expect(route.independentMargin).toEqual([n, den]); expect(route.pairMargin).toEqual([pn, pd]); expect(route.selected).toBe(selected);
    expect(route.independentStatus).toBe(Number(e) < Number(d) ? "POSITIVE" : "NO_POSITIVE_GUARANTEE"); expect(route.pairRequiresExactRelation && route.pairRequiresUnitExceptions).toBe(true); expect(route.interpretation).toBe("EXCEPTION_MARGIN_ONLY");
  });
  it("does not claim thirteen-moving target, strictslack, tupleoptimum or runtime changes", () => {
    const scope = built.evidence!.report.scope;
    expect(scope.conditionalLowerWitnessRequired).toBe(true); expect(scope.target15TotalMet).toBe(true); expect(scope.target14TotalMet || scope.strictSlackGuaranteed || scope.runtimeRoutingChanged).toBe(false);
    for (const field of ["tupleOptimum", "globalLrc", "formal", "external", "novelty"] as const) expect(scope[field]).toBe("NOT_ESTABLISHED");
    expect(scope.agentLoop).toBe("NOT_RUN"); expect(scope.executionAuthority || scope.residueOnlySufficient || scope.genericSpeedSolver).toBe(false); expect(scope.sourceAttestation).toBe("LOCAL_CONSISTENCY_NOT_SIGNED");
  });
  it.each(["root", "missingcell", "cellorder", "distance", "badset", "union", "goodset", "sharp", "sharpfull", "obstruction", "fixture", "extraunit", "carry", "inverse", "physical", "time", "coordinate", "minimum", "assumption", "count", "failure", "alias", "third", "route", "premise", "extra"])("refuses coherently rehashed mathematical mutation%s", mode => {
    const input = fresh(), report = input.report, cell = report.partition.cells[0], fixture = report.positiveFixtures[0];
    if (mode === "root") report.partition.boundaries[0] = ["1", "100"];
    if (mode === "missingcell") report.partition.cells.pop();
    if (mode === "cellorder") report.partition.cells.reverse();
    if (mode === "distance") cell.distances[0][0] = ["1", "15"];
    if (mode === "badset") cell.badShiftIndicesByCoordinate[0] = [];
    if (mode === "union") cell.pairBadUnionIndices = [0, 1];
    if (mode === "goodset") cell.pairGoodShiftIndices = [];
    if (mode === "sharp") report.sharpness.maximumExceptionMinimum = ["1", "5"];
    if (mode === "sharpfull") report.sharpness.fullDistancesByShift[0][0] = ["0", "1"];
    if (mode === "obstruction") report.independentObstruction.maximumMinimumDistance = ["1", "15"];
    if (mode === "fixture") report.positiveFixtures.pop();
    if (mode === "extraunit") fixture.extraSpeeds[0] = 5;
    if (mode === "carry") report.positiveFixtures[8].carry = 0;
    if (mode === "inverse") fixture.qInverse = 2;
    if (mode === "physical") fixture.physicalShift = 0;
    if (mode === "time") fixture.time = ["0", "1"];
    if (mode === "coordinate") fixture.coordinateDistances[0] = ["0", "1"];
    if (mode === "minimum") fixture.minimumDistance = fixture.gamma;
    if (mode === "assumption") Object.assign(fixture, { lowerLrcAssumption: "NOT_REQUIRED" });
    if (mode === "count") fixture.totalRunners = 14 as 15;
    if (mode === "failure") report.carryFailure.wrongMinimum = ["1", "15"];
    if (mode === "alias") Object.assign(report.residueAlias, { requiredPairPresent: true });
    if (mode === "third") report.failedThirdUpgrade.maximumMinimumDistance = ["1", "5"];
    if (mode === "route") report.routes[0].selected = "PAIR";
    if (mode === "premise") Object.assign(report.routes[0], { pairRequiresExactRelation: false });
    if (mode === "extra") Object.assign(report, { admitted: true });
    refused(rehash(input));
  });
  it.each(["mathematicalClaim", "phaseDomain", "family", "movingRunnerConvention", "tupleOptimum", "globalLrc", "formal", "external", "novelty", "agentLoop", "sourceAttestation"])("refuses scope promotion%s", field => {
    const input = fresh(); (input.report.scope as unknown as Record<string, unknown>)[field] = "PROVED"; refused(rehash(input));
  });
  it.each(["conditionalLowerWitnessRequired", "strictSlackGuaranteed", "target14TotalMet", "target15TotalMet", "executionAuthority", "residueOnlySufficient", "genericSpeedSolver", "runtimeRoutingChanged"])("refuses changed scope flag%s", field => {
    const input = fresh(), scope = input.report.scope as unknown as Record<string, unknown>; scope[field] = !scope[field]; refused(rehash(input));
  });
  it("compares whole content, rejects wronghash/extra metrics, detaches input and tolerates object key order", () => {
    const bad = fresh(); bad.reportDigest = "0".repeat(64); refused(bad); refused({ ...fresh(), verdict: "ACCEPTED" });
    const metrics = fresh(); Object.assign(metrics.report, { chargedOperations: 1 }); refused(rehash(metrics));
    const reordered = fresh(); reordered.report = Object.fromEntries(Object.entries(reordered.report).reverse()) as typeof reordered.report;
    const accepted = validateLrcFiveExceptionReport(reordered, budget()); expect(accepted.status).toBe("ACCEPTED"); reordered.report.positiveFixtures.pop(); expect(accepted.evidence!.report.positiveFixtures).toHaveLength(18);
  });
  it.each([["2", "30"], ["-0", "15"], ["1", "0"], ["01", "15"], ["1", "-15"]])("refuses noncanonical fraction%s/%s even with coherent hash", (n, d) => {
    const raw = fresh(); raw.report.threshold = [n, d]; refused(rehash(raw));
  });
  it("does not invoke resource/report/array accessors", () => {
    let calls = 0; const raw = fresh(); Object.defineProperty(raw, "report", { enumerable: true, get: () => { calls++; throw Error("secret"); } }); refused(raw);
    const array = fresh(); Object.defineProperty(array.report.positiveFixtures, "0", { enumerable: true, get: () => { calls++; return null; } }); refused(array);
    const b = budget(); Object.defineProperty(b, "remainingMs", { enumerable: true, get: () => { calls++; return 5000; } }); expect(buildLrcFiveExceptionReport(b).status).toBe("RESOURCE_REFUSED"); expect(calls).toBe(0);
  });
  it.each([Object.prototype, Array.prototype])("refuses inherited serialization hooks with zero invocation", prototype => {
    let calls = 0; Object.defineProperty(prototype, "toJSON", { configurable: true, get: () => { calls++; return () => "secret"; } });
    let result; try { result = buildLrcFiveExceptionReport(budget()); } finally { delete (prototype as { toJSON?: unknown }).toJSON; }
    expect(result!.status).toBe("REPORT_REFUSED"); expect(calls).toBe(0);
  });
  it.each([null, undefined, 1, true, new Date(), new Map(), Object.create({ inherited: "secret" }), NaN, Infinity, -0, 0.5])("refuses nonplain/noncanonical evidence%s", value => refused(value));
  it("refuses cyclic/hidden/symbol/extraarray/sparse passive objects", () => {
    const cycle: Record<string, unknown> = {}; cycle.self = cycle; refused(cycle);
    const hidden = fresh(); Object.defineProperty(hidden, "secret", { value: true }); refused(hidden);
    const symbol = fresh(); Object.assign(symbol, { [Symbol("extra")]: true }); refused(symbol);
    const extra = fresh(); Object.assign(extra.report.positiveFixtures, { secret: true }); refused(extra);
    const sparse = fresh(); delete sparse.report.positiveFixtures[0]; refused(sparse);
  });
  it("refuses oversize/deep and positive or negative257-bit fractions before arithmetic", () => {
    refused({ huge: "x".repeat(32769) }, "RESOURCE_REFUSED");
    for (const sign of ["", "-"]) { const raw = fresh(); raw.report.threshold[0] = sign + (BigInt(1) << BigInt(256)).toString(); refused(raw, "RESOURCE_REFUSED"); }
    const raw: Record<string, unknown> = {}; let level = raw; for (let i = 0; i < 34; i++) { level.child = {}; level = level.child as Record<string, unknown>; } refused(raw, "RESOURCE_REFUSED");
  });
  it.each([0, -1, 0.5, 5001, NaN, Infinity])("refuses badtime budget%s", remainingMs => expect(buildLrcFiveExceptionReport({ ...budget(), remainingMs }).status).toBe("RESOURCE_REFUSED"));
  it.each([0, -1, 0.5, 2000001, NaN, Infinity])("refuses badoperation budget%s", remainingOperations => expect(buildLrcFiveExceptionReport({ ...budget(), remainingOperations }).status).toBe("RESOURCE_REFUSED"));
  it.each([null, undefined, [], Object.create({ remainingMs: 5000 }), { remainingMs: 5000 }, { ...budget(), extra: true }])("refuses nonexact resource descriptor%s", raw => expect(buildLrcFiveExceptionReport(raw as ReturnType<typeof budget>).status).toBe("RESOURCE_REFUSED"));
  it("refuses hidden/symbolbudget data and exhausted allowance without partialevidence", () => {
    const hidden = budget(); Object.defineProperty(hidden, "remainingMs", { enumerable: false }); expect(buildLrcFiveExceptionReport(hidden).status).toBe("RESOURCE_REFUSED");
    const symbol = budget(); Object.assign(symbol, { [Symbol("extra")]: true }); expect(buildLrcFiveExceptionReport(symbol).status).toBe("RESOURCE_REFUSED");
    const exhausted = buildLrcFiveExceptionReport({ remainingMs: 5000, remainingOperations: 1 }); expect(exhausted.status).toBe("RESOURCE_REFUSED"); expect(exhausted.evidence).toBeNull();
    expect(validateLrcFiveExceptionReport(fresh(), { remainingMs: 5000, remainingOperations: built.chargedOperations }).status).toBe("RESOURCE_REFUSED");
    expect(LRC_FIVE_EXCEPTION_LIMITS).toEqual({ bytes: 32768, milliseconds: 5000, operations: 2000000, componentBits: 256 });
  });
});
