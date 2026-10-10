import { createHash } from "node:crypto";

/** Additive offline fixed-domain evidence. No supplied-speed/runtime authority. */
export const LRC_FIVE_EXCEPTION_VERSION = "LRC_FIVE_EXCEPTION_PAIR_V1" as const;
export const LRC_FIVE_EXCEPTION_LIMITS = Object.freeze({ bytes: 32768, milliseconds: 5000, operations: 2000000, componentBits: 256 });
export type FiveExceptionFraction = [string, string];
export interface FiveExceptionBudget { remainingMs: number; remainingOperations: number }
export interface FiveExceptionCell { kind: "BOUNDARY" | "OPEN"; left: FiveExceptionFraction; right: FiveExceptionFraction; representative: FiveExceptionFraction; distances: FiveExceptionFraction[][]; badShiftIndicesByCoordinate: number[][]; pairBadUnionIndices: number[]; pairGoodShiftIndices: number[] }
export interface FiveExceptionFixture {
  kind: "SCALED" | "ARBITRARY_EXTRAS"; movingRunners: 14; totalRunners: 15; q: number; extraSpeeds: number[]; exceptionSpeeds: number[]; divisibleSpeeds: number[]; speeds: number[];
  tau: FiveExceptionFraction; baseTime: FiveExceptionFraction; normalizedPhase: FiveExceptionFraction; carry: number; qInverse: number; physicalShift: number; normalizedShift: number; time: FiveExceptionFraction;
  exceptionDistancesByShift: FiveExceptionFraction[][]; coordinateDistances: FiveExceptionFraction[]; minimumDistance: FiveExceptionFraction; gamma: FiveExceptionFraction; lowerMargin: FiveExceptionFraction;
  lowerLrcAssumption: "LRC(9)"; lowerWitnessVerified: true; selectionRule: "LOWEST_PHYSICAL_GOOD_SHIFT";
}
export interface FiveExceptionLift {
  baseTime: FiveExceptionFraction; exceptionSpeeds: number[]; exceptionDistancesByShift: FiveExceptionFraction[][]; divisibleReducedSpeeds: number[]; divisibleSpeeds: number[]; speeds: number[];
  tau: FiveExceptionFraction; lowerCoordinateDistances: FiveExceptionFraction[]; lowerMinimum: FiveExceptionFraction; lowerMargin: FiveExceptionFraction; lowerLrcAssumption: "LRC(9)";
  fullDistancesByShift: FiveExceptionFraction[][]; fullMinimumByShift: FiveExceptionFraction[]; maximumFullMinimum: FiveExceptionFraction;
}
export interface FiveExceptionCarryFailure { fixtureIndex: number; carry: number; qInverse: number; normalizedShift: number; correctPhysicalShift: number; wrongPhysicalShift: number; wrongTime: FiveExceptionFraction; wrongExceptionDistances: FiveExceptionFraction[]; wrongMinimum: FiveExceptionFraction; requiredThreshold: FiveExceptionFraction }
export interface FiveExceptionRoute { d: number; e: number; independentMargin: FiveExceptionFraction; independentStatus: "POSITIVE" | "NO_POSITIVE_GUARANTEE"; pairMargin: FiveExceptionFraction; selected: "INDEPENDENT" | "PAIR"; pairRequiresExactRelation: true; pairRequiresUnitExceptions: true; interpretation: "EXCEPTION_MARGIN_ONLY" }
export interface FiveExceptionReport {
  version: typeof LRC_FIVE_EXCEPTION_VERSION; divisor: 5; pairMultiplier: 2; threshold: FiveExceptionFraction;
  partition: { boundaries: FiveExceptionFraction[]; cells: FiveExceptionCell[] };
  sharpness: FiveExceptionLift & { exceptionMinimumByShift: FiveExceptionFraction[]; maximumExceptionMinimum: FiveExceptionFraction };
  independentObstruction: { unitResidues: number[]; phases: FiveExceptionFraction[]; distances: FiveExceptionFraction[][]; minima: FiveExceptionFraction[]; maximumMinimumDistance: FiveExceptionFraction };
  positiveFixtures: FiveExceptionFixture[]; carryFailure: FiveExceptionCarryFailure;
  residueAlias: FiveExceptionLift & { residuePattern: number[]; requiredPairPresent: false; doesNotDisproveGlobalLrc: true };
  failedThirdUpgrade: { exceptionSpeeds: number[]; baseTime: FiveExceptionFraction; distances: FiveExceptionFraction[][]; minimumByShift: FiveExceptionFraction[]; maximumMinimumDistance: FiveExceptionFraction; invalidUpgradeMargin: FiveExceptionFraction; doesNotDisproveGlobalLrc: true };
  routes: FiveExceptionRoute[];
  scope: { mathematicalClaim: "FIVE_EXCEPTION_PAIR_SHIFT_CRITERION"; phaseDomain: "ALL_REAL_WRITTEN_PROOF_REQUIRED"; family: "EXACT_Q_2Q_PLUS_THREE_UNIT_EXTRAS_MOD5"; movingRunnerConvention: "14_MOVING_15_TOTAL";
    conditionalLowerWitnessRequired: true; strictSlackGuaranteed: false; target14TotalMet: false; target15TotalMet: true; tupleOptimum: "NOT_ESTABLISHED"; globalLrc: "NOT_ESTABLISHED";
    formal: "NOT_ESTABLISHED"; external: "NOT_ESTABLISHED"; novelty: "NOT_ESTABLISHED"; agentLoop: "NOT_RUN"; executionAuthority: false; residueOnlySufficient: false; genericSpeedSolver: false;
    runtimeRoutingChanged: false; sourceAttestation: "LOCAL_CONSISTENCY_NOT_SIGNED" };
}
export interface FiveExceptionEvidence { report: FiveExceptionReport; reportDigest: string }
export interface FiveExceptionResult { status: "ACCEPTED" | "REPORT_REFUSED" | "RESOURCE_REFUSED"; evidence: FiveExceptionEvidence | null; elapsedMs: number; chargedOperations: number }
class Fault extends Error { constructor(readonly status: "REPORT_REFUSED" | "RESOURCE_REFUSED") { super(status); } }
function refuse(): never { throw new Fault("REPORT_REFUSED"); }
function exhaust(): never { throw new Fault("RESOURCE_REFUSED"); }
class Work {
  operations = 0; readonly ms: number; readonly max: number;
  constructor(raw: FiveExceptionBudget, readonly start: number) {
    if (!raw || Object.getPrototypeOf(raw) !== Object.prototype || Reflect.ownKeys(raw).length !== 2) exhaust();
    const fields = Object.getOwnPropertyDescriptors(raw);
    if (Object.keys(fields).sort().join(",") !== "remainingMs,remainingOperations" || !("value" in fields.remainingMs) || !("value" in fields.remainingOperations) || !fields.remainingMs.enumerable || !fields.remainingOperations.enumerable) exhaust();
    const ms = fields.remainingMs.value, max = fields.remainingOperations.value;
    if (typeof ms !== "number" || typeof max !== "number" || !Number.isInteger(ms) || !Number.isInteger(max) || ms <= 0 || ms > 5000 || max <= 0 || max > 2000000) exhaust();
    this.ms = ms; this.max = max;
  }
  tick(): void { if (this.operations >= this.max || performance.now() - this.start > this.ms) exhaust(); this.operations++; }
}
function canonical(raw: unknown, w: Work): string {
  if (Object.getOwnPropertyDescriptor(Object.prototype, "toJSON") || Object.getOwnPropertyDescriptor(Array.prototype, "toJSON")) refuse();
  const parents = new Set<object>(); let nodes = 0, textBytes = 0;
  const max = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
  function visit(value: unknown, depth: number): unknown {
    w.tick(); if (++nodes > 16000 || depth > 32) exhaust();
    if (value === null || typeof value === "boolean") return value;
    if (typeof value === "number") { if (!Number.isSafeInteger(value) || Object.is(value, -0)) refuse(); return value; }
    if (typeof value === "string") {
      textBytes += Buffer.byteLength(value); if (textBytes > 32768) exhaust();
      const component = value.startsWith("-") ? value.slice(1) : value;
      if (/^(0|[1-9][0-9]*)$/.test(component) && (component.length > max.length || component.length === max.length && component > max)) exhaust(); return value;
    }
    if (!value || typeof value !== "object" || parents.has(value)) refuse();
    const array = Array.isArray(value);
    if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype) || Object.getOwnPropertySymbols(value).length) refuse();
    const keys = Reflect.ownKeys(value); if (keys.length > 16000) exhaust();
    const fields = Object.getOwnPropertyDescriptors(value);
    for (const key of keys) { w.tick(); const field = fields[key as string]; if (!("value" in field) || !field.enumerable && key !== "length") refuse(); if (!array) textBytes += Buffer.byteLength(String(key)); if (textBytes > 32768) exhaust(); }
    parents.add(value); let output: unknown;
    if (array) {
      const length = fields.length.value;
      if (!Number.isSafeInteger(length) || length < 0 || length > 16000 || keys.length !== length + 1) refuse();
      const values: unknown[] = [];
      for (let i = 0; i < length; i++) { if (!fields[String(i)]) refuse(); values.push(visit(fields[String(i)].value, depth + 1)); } output = values;
    } else {
      const values: Record<string, unknown> = {};
      for (const key of (keys as string[]).sort()) Object.defineProperty(values, key, { value: visit(fields[key].value, depth + 1), enumerable: true }); output = values;
    }
    parents.delete(value); return output;
  }
  const text = JSON.stringify(visit(raw, 0)); w.tick(); if (Buffer.byteLength(text) > 32768) exhaust(); return text;
}
interface Rat { n: number; d: number }
function rat(n: number, d: number, w: Work): Rat {
  w.tick(); if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d <= 0) exhaust();
  let a = Math.abs(n), b = d; while (b) { w.tick(); [a, b] = [b, a % b]; } return { n: n / a, d: d / a };
}
function add(a: Rat, b: Rat, w: Work): Rat { return rat(a.n * b.d + b.n * a.d, a.d * b.d, w); }
function multiply(a: Rat, integer: number, w: Work): Rat { return rat(a.n * integer, a.d, w); }
function compare(a: Rat, b: Rat, w: Work): number { w.tick(); return Math.sign(a.n * b.d - b.n * a.d); }
function mod(n: number, d: number, w: Work): number { w.tick(); return (n % d + d) % d; }
function floor(a: Rat, w: Work): number { return (a.n - mod(a.n, a.d, w)) / a.d; }
function dist(a: Rat, w: Work): Rat { const rem = mod(a.n, a.d, w); return rat(Math.min(rem, a.d - rem), a.d, w); }
function wire(a: Rat, w: Work): FiveExceptionFraction { w.tick(); return [String(a.n), String(a.d)]; }
function minimum(values: Rat[], w: Work): Rat { return values.reduce((a, b) => compare(a, b, w) <= 0 ? a : b); }
function maximum(values: Rat[], w: Work): Rat { return values.reduce((a, b) => compare(a, b, w) >= 0 ? a : b); }
function matrix(phase: Rat, speeds: number[], w: Work): Rat[][] { return Array.from({ length: 5 }, (_, j) => speeds.map(speed => dist(multiply(add(phase, rat(j, 5, w), w), speed, w), w))); }
function matrixWire(rows: Rat[][], w: Work): FiveExceptionFraction[][] { return rows.map(row => row.map(value => wire(value, w))); }
function partition(w: Work): FiveExceptionReport["partition"] {
  const roots = new Map<string, Rat>(), zero = rat(0, 1, w), end = rat(1, 5, w), eta = rat(1, 15, w);
  roots.set("0/1", zero); roots.set("1/5", end);
  for (const c of [1, 2]) for (let j = 0; j < 5; j++) for (let n = 0; n <= c; n++) for (const sign of [-1, 1]) {
    w.tick(); const x = add(rat(15 * n + sign, 15 * c, w), rat(-j, 5, w), w);
    if (compare(x, zero, w) >= 0 && compare(x, end, w) <= 0) roots.set(`${x.n}/${x.d}`, x);
  }
  const points = [...roots.values()].sort((a, b) => compare(a, b, w)), cells: FiveExceptionCell[] = []; if (points.length !== 6) refuse();
  for (let i = 0; i < points.length; i++) for (const open of [false, true]) {
    if (open && i === points.length - 1) continue;
    const left = points[i], right = open ? points[i + 1] : left, sum = add(left, right, w), representative = open ? rat(sum.n, 2 * sum.d, w) : left, rows = matrix(representative, [1, 2], w);
    const bad = [0, 1].map(c => rows.flatMap((row, j) => compare(row[c], eta, w) < 0 ? [j] : [])), union = [...new Set(bad.flat())].sort((a, b) => { w.tick(); return a - b; });
    if (union.length > 1 || bad.some(indices => indices.length > 1)) refuse();
    cells.push({ kind: open ? "OPEN" : "BOUNDARY", left: wire(left, w), right: wire(right, w), representative: wire(representative, w), distances: matrixWire(rows, w),
      badShiftIndicesByCoordinate: bad, pairBadUnionIndices: union, pairGoodShiftIndices: Array.from({ length: 5 }, (_, j) => j).filter(j => !union.includes(j)) });
  }
  return { boundaries: points.map(point => wire(point, w)), cells };
}
function inverse(q: number, w: Work): number { for (let value = 1; value < 5; value++) { w.tick(); if (q * value % 5 === 1) return value; } return refuse(); }
function fixture(q: number, extras: number[], scaled: boolean, w: Work): { report: FiveExceptionFixture; wrongRow: Rat[]; wrongJ: number; wrongTime: Rat } {
  const exceptions = [q, 2 * q, ...extras], divisibles = Array.from({ length: 9 }, (_, i) => 5 * (i + 1)), speeds = [...divisibles, ...exceptions], t0 = rat(1, 50, w), lower = rat(1, 10, w), eta = rat(1, 15, w);
  if (exceptions.some(speed => speed <= 0 || speed % 5 === 0) || new Set(speeds).size !== 14) refuse();
  const rows = matrix(t0, exceptions, w), j = rows.findIndex(row => compare(minimum(row, w), eta, w) >= 0); if (j < 0) refuse();
  const qPhase = multiply(t0, q, w), carry = floor(multiply(qPhase, 5, w), w), x = add(qPhase, rat(-carry, 5, w), w), inv = inverse(q, w), h = mod(carry + q * j, 5, w);
  if (mod(inv * (h - carry), 5, w) !== j || compare(x, rat(0, 1, w), w) < 0 || compare(x, rat(1, 5, w), w) >= 0) refuse();
  const time = add(t0, rat(j, 5, w), w), coordinates = speeds.map(speed => dist(multiply(time, speed, w), w));
  if (compare(minimum(coordinates, w), eta, w) < 0 || divisibles.some(speed => compare(dist(multiply(t0, speed, w), w), lower, w) < 0)) refuse();
  const wrongJ = mod(inv * h, 5, w), wrongTime = add(t0, rat(wrongJ, 5, w), w);
  return { report: { kind: scaled ? "SCALED" : "ARBITRARY_EXTRAS", movingRunners: 14, totalRunners: 15, q, extraSpeeds: extras, exceptionSpeeds: exceptions, divisibleSpeeds: divisibles, speeds,
    tau: wire(rat(1, 10, w), w), baseTime: wire(t0, w), normalizedPhase: wire(x, w), carry, qInverse: inv, physicalShift: j, normalizedShift: h, time: wire(time, w),
    exceptionDistancesByShift: matrixWire(rows, w), coordinateDistances: coordinates.map(value => wire(value, w)), minimumDistance: wire(minimum(coordinates, w), w), gamma: wire(eta, w), lowerMargin: wire(lower, w),
    lowerLrcAssumption: "LRC(9)", lowerWitnessVerified: true, selectionRule: "LOWEST_PHYSICAL_GOOD_SHIFT" }, wrongRow: rows[wrongJ], wrongJ, wrongTime };
}
function lift(exceptions: number[], reduced: number[], t0: Rat, w: Work): { report: FiveExceptionLift; exceptionMinima: Rat[] } {
  const divisibles = reduced.map(value => value * 5), speeds = [...divisibles, ...exceptions], tau = multiply(t0, 5, w), lower = rat(1, 10, w), lowerDistances = reduced.map(value => dist(multiply(tau, value, w), w));
  if (new Set(speeds).size !== 14 || lowerDistances.some(value => compare(value, lower, w) < 0)) refuse();
  const exceptionRows = matrix(t0, exceptions, w), fullRows = matrix(t0, speeds, w), minima = fullRows.map(row => minimum(row, w));
  return { report: { baseTime: wire(t0, w), exceptionSpeeds: exceptions, exceptionDistancesByShift: matrixWire(exceptionRows, w), divisibleReducedSpeeds: reduced, divisibleSpeeds: divisibles, speeds,
    tau: wire(tau, w), lowerCoordinateDistances: lowerDistances.map(value => wire(value, w)), lowerMinimum: wire(minimum(lowerDistances, w), w), lowerMargin: wire(lower, w), lowerLrcAssumption: "LRC(9)",
    fullDistancesByShift: matrixWire(fullRows, w), fullMinimumByShift: minima.map(value => wire(value, w)), maximumFullMinimum: wire(maximum(minima, w), w) }, exceptionMinima: exceptionRows.map(row => minimum(row, w)) };
}
function routes(w: Work): FiveExceptionRoute[] {
  return [[3, 2], [3, 3], [5, 2], [5, 3], [5, 4], [5, 5]].map(([d, e]) => {
    const positive = e < d, r = positive ? ((d - 1) - (d - 1) % e) / e : 0, independent = rat(r, 2 * d, w), paired = rat(1, 3 * d, w);
    return { d, e, independentMargin: wire(independent, w), independentStatus: positive ? "POSITIVE" : "NO_POSITIVE_GUARANTEE", pairMargin: wire(paired, w), selected: compare(independent, paired, w) >= 0 ? "INDEPENDENT" : "PAIR", pairRequiresExactRelation: true, pairRequiresUnitExceptions: true, interpretation: "EXCEPTION_MARGIN_ONLY" };
  });
}
function rebuild(w: Work): FiveExceptionEvidence {
  const eta = rat(1, 15, w), positive: ReturnType<typeof fixture>[] = [];
  for (const q of [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14]) positive.push(fixture(q, [3 * q, 4 * q, 7 * q], true, w));
  for (const [q, ...extras] of [[1, 3, 7, 11], [2, 1, 7, 11], [3, 1, 2, 7], [4, 1, 3, 7], [11, 2, 3, 7], [14, 1, 3, 11]]) positive.push(fixture(q, extras, false, w));
  const failedIndex = positive.findIndex(value => compare(minimum(value.wrongRow, w), eta, w) < 0); if (failedIndex < 0) refuse();
  const failure = positive[failedIndex], correct = failure.report;
  const sharp = lift([1, 2, 3, 4, 7], [1, 2, 4, 5, 7, 8, 10, 11, 13], eta, w), alias = lift([6, 17, 11, 23, 29], [1, 2, 3, 4, 5, 7, 8, 9, 10], rat(1, 6, w), w);
  if (compare(maximum(sharp.exceptionMinima, w), eta, w) !== 0 || compare(maximum(alias.exceptionMinima, w), rat(1, 30, w), w) !== 0) refuse();
  const units = [1, 2, 3, 4, 2], phases = [rat(0, 1, w), rat(3, 5, w), rat(4, 5, w), rat(3, 5, w), rat(2, 5, w)];
  const obstruction = Array.from({ length: 5 }, (_, j) => units.map((unit, i) => dist(add(phases[i], rat(unit * j, 5, w), w), w))), obstructionMinima = obstruction.map(row => minimum(row, w));
  if (compare(maximum(obstructionMinima, w), rat(0, 1, w), w) !== 0) refuse();
  const thirdRows = matrix(rat(1, 10, w), [1, 2, 7], w), thirdMinima = thirdRows.map(row => minimum(row, w)); if (compare(maximum(thirdMinima, w), rat(1, 10, w), w) !== 0) refuse();
  const report: FiveExceptionReport = { version: LRC_FIVE_EXCEPTION_VERSION, divisor: 5, pairMultiplier: 2, threshold: wire(eta, w), partition: partition(w),
    sharpness: { ...sharp.report, exceptionMinimumByShift: sharp.exceptionMinima.map(value => wire(value, w)), maximumExceptionMinimum: wire(maximum(sharp.exceptionMinima, w), w) },
    independentObstruction: { unitResidues: units, phases: phases.map(value => wire(value, w)), distances: matrixWire(obstruction, w), minima: obstructionMinima.map(value => wire(value, w)), maximumMinimumDistance: wire(maximum(obstructionMinima, w), w) },
    positiveFixtures: positive.map(value => value.report), carryFailure: { fixtureIndex: failedIndex, carry: correct.carry, qInverse: correct.qInverse, normalizedShift: correct.normalizedShift, correctPhysicalShift: correct.physicalShift,
      wrongPhysicalShift: failure.wrongJ, wrongTime: wire(failure.wrongTime, w), wrongExceptionDistances: failure.wrongRow.map(value => wire(value, w)), wrongMinimum: wire(minimum(failure.wrongRow, w), w), requiredThreshold: wire(eta, w) },
    residueAlias: { ...alias.report, residuePattern: [1, 2, 1, 3, 4], requiredPairPresent: false, doesNotDisproveGlobalLrc: true },
    failedThirdUpgrade: { exceptionSpeeds: [1, 2, 7], baseTime: wire(rat(1, 10, w), w), distances: matrixWire(thirdRows, w), minimumByShift: thirdMinima.map(value => wire(value, w)), maximumMinimumDistance: wire(maximum(thirdMinima, w), w), invalidUpgradeMargin: wire(rat(1, 5, w), w), doesNotDisproveGlobalLrc: true },
    routes: routes(w), scope: { mathematicalClaim: "FIVE_EXCEPTION_PAIR_SHIFT_CRITERION", phaseDomain: "ALL_REAL_WRITTEN_PROOF_REQUIRED", family: "EXACT_Q_2Q_PLUS_THREE_UNIT_EXTRAS_MOD5", movingRunnerConvention: "14_MOVING_15_TOTAL",
      conditionalLowerWitnessRequired: true, strictSlackGuaranteed: false, target14TotalMet: false, target15TotalMet: true, tupleOptimum: "NOT_ESTABLISHED", globalLrc: "NOT_ESTABLISHED", formal: "NOT_ESTABLISHED", external: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED", agentLoop: "NOT_RUN",
      executionAuthority: false, residueOnlySufficient: false, genericSpeedSolver: false, runtimeRoutingChanged: false, sourceAttestation: "LOCAL_CONSISTENCY_NOT_SIGNED" } };
  w.tick(); const reportDigest = createHash("sha256").update(canonical(report, w)).digest("hex"), evidence = { report, reportDigest }; canonical(evidence, w);
  function freeze(value: unknown): void { w.tick(); if (value && typeof value === "object") { for (const item of Object.values(value)) freeze(item); Object.freeze(value); } }
  freeze(evidence); return evidence;
}
function operation(raw: unknown, budget: FiveExceptionBudget, validate: boolean): FiveExceptionResult {
  const start = performance.now(); let w: Work | undefined;
  try { w = new Work(budget, start); const supplied = validate ? canonical(raw, w) : null, evidence = rebuild(w); if (supplied !== null && supplied !== canonical(evidence, w)) refuse(); w.tick(); return { status: "ACCEPTED", evidence, elapsedMs: performance.now() - start, chargedOperations: w.operations }; }
  catch (error) { return { status: error instanceof Fault ? error.status : "REPORT_REFUSED", evidence: null, elapsedMs: performance.now() - start, chargedOperations: w?.operations ?? 0 }; }
}
export function buildLrcFiveExceptionReport(budget: FiveExceptionBudget): FiveExceptionResult { return operation(null, budget, false); }
/** Complete bounded passive reconstruction, never proof/authority from hash alone. */
export function validateLrcFiveExceptionReport(raw: unknown, budget: FiveExceptionBudget): FiveExceptionResult { return operation(raw, budget, true); }
