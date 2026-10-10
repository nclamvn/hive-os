import { createHash } from "node:crypto";

/** Fixed offline diagnostic; not a supplied-speed solver or execution authority. */
export const LRC_CORRELATED_TRIPLE_VERSION = "LRC_CORRELATED_TRIPLE_V1" as const;
export const LRC_CORRELATED_TRIPLE_LIMITS = Object.freeze({ bytes: 32768, milliseconds: 5000, operations: 2000000, componentBits: 256 });
export type CorrelatedTripleFraction = [string, string];
export interface CorrelatedTripleBudget { remainingMs: number; remainingOperations: number }
export interface CorrelatedTripleSegment { left: CorrelatedTripleFraction; right: CorrelatedTripleFraction; normalizedShift: number; coordinates: { multiplier: number; slope: number; intercept: CorrelatedTripleFraction; floor: number; fractionalRange: CorrelatedTripleFraction[] }[] }
export interface CorrelatedTripleCell { kind: "BOUNDARY" | "OPEN"; left: CorrelatedTripleFraction; right: CorrelatedTripleFraction; representative: CorrelatedTripleFraction; distances: CorrelatedTripleFraction[][]; goodShiftIndices: number[]; pairBadUnionIndices: number[]; normalizedShift: number }
export interface CorrelatedTripleFixture {
  kind: 0 | 1; movingRunners: number; totalRunners: number; q: number; v: number;
  divisibleSpeeds: number[]; exceptionSpeeds: number[]; speeds: number[]; tau: CorrelatedTripleFraction; baseTime: CorrelatedTripleFraction;
  normalizedPhase: CorrelatedTripleFraction; carry: number; qInverse: number; normalizedShift: number; physicalShift: number; time: CorrelatedTripleFraction;
  selectionRule: 0 | 1; exceptionDistancesByShift: CorrelatedTripleFraction[][];
  coordinateDistances: CorrelatedTripleFraction[]; minimumDistance: CorrelatedTripleFraction; gamma: CorrelatedTripleFraction; lowerMargin: CorrelatedTripleFraction;
  lowerLrcAssumption: 0 | 1; lowerWitnessVerified: true;
}
export interface CorrelatedTripleOldNegative {
  d: number; e: number; divisibleSpeeds: number[]; exceptionSpeeds: number[]; speeds: number[]; baseTime: CorrelatedTripleFraction; reducedLowerTime: CorrelatedTripleFraction;
  lowerCoordinateDistances: CorrelatedTripleFraction[]; exceptionDistancesByShift: CorrelatedTripleFraction[][]; fullMinimumByShift: CorrelatedTripleFraction[];
  maximumExceptionMinimum: CorrelatedTripleFraction; maximumFullMinimum: CorrelatedTripleFraction; oldDelta: CorrelatedTripleFraction; lowerWitnessVerified: true;
}
export interface CorrelatedTripleAlias {
  movingRunners: 14; totalRunners: 15; divisibleSpeeds: number[]; exceptionSpeeds: number[]; speeds: number[]; reducedLowerTime: CorrelatedTripleFraction; baseTime: CorrelatedTripleFraction;
  lowerCoordinateDistances: CorrelatedTripleFraction[]; lowerMinimum: CorrelatedTripleFraction; exceptionDistancesByShift: CorrelatedTripleFraction[][];
  fullMinimumByShift: CorrelatedTripleFraction[]; maximumFullMinimum: CorrelatedTripleFraction; requiredPairPresent: false; residuePattern: number[]; doesNotDisproveGlobalLrc: true;
}
export interface CorrelatedTripleReport {
  version: typeof LRC_CORRELATED_TRIPLE_VERSION; divisor: 3; threshold: CorrelatedTripleFraction; kernelMultipliers: number[];
  legend: { fixtureKinds: ["HARMONIC", "ARBITRARY_THIRD"]; selectionRules: ["HARMONIC_SEGMENT_WITH_CARRY", "LOWEST_PHYSICAL_GOOD_SHIFT"]; lowerLrcAssumptions: ["LRC(10)", "LRC(11)"] };
  proofSegments: CorrelatedTripleSegment[]; partition: { boundaries: CorrelatedTripleFraction[]; cells: CorrelatedTripleCell[] };
  sharpness: { phase: CorrelatedTripleFraction; distances: CorrelatedTripleFraction[][]; minimumDistanceByShift: CorrelatedTripleFraction[]; maximumMinimumDistance: CorrelatedTripleFraction };
  independentObstruction: { unitResidues: number[]; phases: CorrelatedTripleFraction[]; distances: CorrelatedTripleFraction[][]; minima: CorrelatedTripleFraction[]; maximumMinimumDistance: CorrelatedTripleFraction };
  positiveFixtures: CorrelatedTripleFixture[]; oldClassNegatives: CorrelatedTripleOldNegative[]; residueAlias: CorrelatedTripleAlias;
  scope: { mathematicalClaim: "SHARP_DOUBLED_PAIR_THIRD_SHIFT_MARGIN"; phaseDomain: "ALL_REAL_COMMON_TIME_WRITTEN_PROOF_REQUIRED"; family: "EXACT_Q_2Q_V_WITH_3_NOT_DIVIDING_QV";
    diagnosticKernel: "FIXED_MULTIPLIERS_1_2_4"; conditionalLowerWitnessRequired: true; movingRunnerConvention: "K_MOVING_K_PLUS_ONE_TOTAL";
    globalLrc: "NOT_ESTABLISHED"; formal: "NOT_ESTABLISHED"; external: "NOT_ESTABLISHED"; novelty: "NOT_ESTABLISHED"; agentLoop: "NOT_RUN";
    executionAuthority: false; residueOnlySufficient: false; genericSpeedSolver: false };
}
export interface CorrelatedTripleEvidence { report: CorrelatedTripleReport; reportDigest: string }
export interface CorrelatedTripleResult { status: "ACCEPTED" | "REPORT_REFUSED" | "RESOURCE_REFUSED"; evidence: CorrelatedTripleEvidence | null; elapsedMs: number; chargedOperations: number }
class Refusal extends Error { constructor(readonly status: "REPORT_REFUSED" | "RESOURCE_REFUSED") { super(status); } }
function refuse(): never { throw new Refusal("REPORT_REFUSED"); }
function exhaust(): never { throw new Refusal("RESOURCE_REFUSED"); }
class Work {
  operations = 0; readonly ms: number; readonly max: number;
  constructor(raw: CorrelatedTripleBudget, readonly start: number) {
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
      if (/^(0|[1-9][0-9]*)$/.test(component) && (component.length > max.length || component.length === max.length && component > max)) exhaust();
      return value;
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
      for (let i = 0; i < length; i++) { if (!fields[String(i)]) refuse(); values.push(visit(fields[String(i)].value, depth + 1)); }
      output = values;
    } else {
      const values: Record<string, unknown> = {};
      for (const key of (keys as string[]).sort()) Object.defineProperty(values, key, { value: visit(fields[key].value, depth + 1), enumerable: true });
      output = values;
    }
    parents.delete(value); return output;
  }
  const text = JSON.stringify(visit(raw, 0)); w.tick(); if (Buffer.byteLength(text) > 32768) exhaust(); return text;
}
interface Rat { n: number; d: number }
function rat(n: number, d: number, w: Work): Rat {
  w.tick(); if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d <= 0) exhaust();
  let a = Math.abs(n), b = d; while (b) { w.tick(); [a, b] = [b, a % b]; }
  return { n: n / a, d: d / a };
}
function add(a: Rat, b: Rat, w: Work): Rat { return rat(a.n * b.d + b.n * a.d, a.d * b.d, w); }
function multiply(a: Rat, integer: number, w: Work): Rat { return rat(a.n * integer, a.d, w); }
function compare(a: Rat, b: Rat, w: Work): number { w.tick(); return Math.sign(a.n * b.d - b.n * a.d); }
function modulo(n: number, d: number, w: Work): number { w.tick(); return (n % d + d) % d; }
function floor(a: Rat, w: Work): number { return (a.n - modulo(a.n, a.d, w)) / a.d; }
function dist(a: Rat, w: Work): Rat { const rem = modulo(a.n, a.d, w); return rat(Math.min(rem, a.d - rem), a.d, w); }
function wire(a: Rat, w: Work): CorrelatedTripleFraction { w.tick(); return [String(a.n), String(a.d)]; }
function minimum(values: Rat[], w: Work): Rat { return values.reduce((a, b) => compare(a, b, w) <= 0 ? a : b); }
function maximum(values: Rat[], w: Work): Rat { return values.reduce((a, b) => compare(a, b, w) >= 0 ? a : b); }
function matrix(phase: Rat, speeds: number[], d: number, w: Work): Rat[][] {
  return Array.from({ length: d }, (_, j) => speeds.map(speed => dist(multiply(add(phase, rat(j, d, w), w), speed, w), w)));
}
function matrixWire(rows: Rat[][], w: Work): CorrelatedTripleFraction[][] { return rows.map(row => row.map(value => wire(value, w))); }
function selected(x: Rat, w: Work): number { return compare(x, rat(1, 9, w), w) >= 0 && compare(x, rat(2, 9, w), w) <= 0 ? 2 : 1; }
function proofSegments(w: Work): CorrelatedTripleSegment[] {
  return [[0, 1, 1], [1, 2, 2], [2, 3, 1]].map(([l, r, shift]) => {
    const left = rat(l, 9, w), right = rat(r, 9, w);
    const coordinates = [1, 2, 4].map(multiplier => {
      const a = multiply(add(left, rat(shift, 3, w), w), multiplier, w), b = multiply(add(right, rat(shift, 3, w), w), multiplier, w), integer = floor(a, w);
      if (floor(b, w) !== integer) refuse();
      const start = add(a, rat(-integer, 1, w), w), end = add(b, rat(-integer, 1, w), w);
      if (compare(start, rat(1, 9, w), w) < 0 || compare(end, rat(8, 9, w), w) > 0) refuse();
      // Raw phase is slope*x+intercept; subtract the separate floor to obtain
      // the certified fractional-part range on this entire closed segment.
      return { multiplier, slope: multiplier, intercept: wire(rat(multiplier * shift, 3, w), w), floor: integer, fractionalRange: [wire(start, w), wire(end, w)] };
    });
    return { left: wire(left, w), right: wire(right, w), normalizedShift: shift, coordinates };
  });
}
function partition(w: Work): CorrelatedTripleReport["partition"] {
  const roots = new Map<string, Rat>(); const zero = rat(0, 1, w), end = rat(1, 3, w), eta = rat(1, 9, w);
  roots.set("0/1", zero); roots.set("1/3", end);
  for (const c of [1, 2, 4]) for (let j = 0; j < 3; j++) for (let z = 0; z <= c; z++) for (const sign of [-1, 1]) {
    w.tick(); const x = add(rat(9 * z + sign, 9 * c, w), rat(-j, 3, w), w);
    if (compare(x, zero, w) >= 0 && compare(x, end, w) <= 0) roots.set(`${x.n}/${x.d}`, x);
  }
  const points = [...roots.values()].sort((a, b) => compare(a, b, w)), cells: CorrelatedTripleCell[] = [];
  if (points.length !== 10) refuse();
  for (let i = 0; i < points.length; i++) for (const open of [false, true]) {
    if (open && i === points.length - 1) continue;
    const left = points[i], right = open ? points[i + 1] : left, sum = add(left, right, w), representative = open ? rat(sum.n, 2 * sum.d, w) : left;
    const rows = matrix(representative, [1, 2, 4], 3, w), good: number[] = [], pairBad: number[] = [];
    rows.forEach((row, j) => { if (compare(minimum(row, w), eta, w) >= 0) good.push(j); if (row.slice(0, 2).some(value => compare(value, eta, w) < 0)) pairBad.push(j); });
    const shift = selected(representative, w); if (!good.includes(shift) || pairBad.length > 1) refuse();
    cells.push({ kind: open ? "OPEN" : "BOUNDARY", left: wire(left, w), right: wire(right, w), representative: wire(representative, w), distances: matrixWire(rows, w), goodShiftIndices: good, pairBadUnionIndices: pairBad, normalizedShift: shift });
  }
  return { boundaries: points.map(point => wire(point, w)), cells };
}
function positive(k: number, q: number, v: number, harmonic: boolean, w: Work): CorrelatedTripleFixture {
  const divisibleSpeeds = Array.from({ length: k - 3 }, (_, i) => 3 * (i + 1)), exceptionSpeeds = [q, 2 * q, v], speeds = [...divisibleSpeeds, ...exceptionSpeeds];
  const tau = rat(1, k - 2, w), t0 = rat(1, 3 * (k - 2), w), qPhase = multiply(t0, q, w), carry = floor(multiply(qPhase, 3, w), w), x = add(qPhase, rat(-carry, 3, w), w);
  const inverse = q % 3 === 1 ? 1 : 2, rows = matrix(t0, exceptionSpeeds, 3, w), eta = rat(1, 9, w);
  const h = harmonic ? selected(x, w) : null;
  const j = h !== null ? modulo(inverse * (h - carry), 3, w) : rows.findIndex(row => compare(minimum(row, w), eta, w) >= 0);
  if (j < 0 || compare(minimum(rows[j], w), eta, w) < 0) refuse();
  const time = add(t0, rat(j, 3, w), w), coordinates = speeds.map(speed => dist(multiply(time, speed, w), w)), lower = rat(1, k - 2, w), gamma = minimum([lower, eta], w);
  const lowerValid = divisibleSpeeds.every(speed => compare(dist(multiply(t0, speed, w), w), lower, w) >= 0);
  if (!lowerValid || compare(minimum(coordinates, w), gamma, w) < 0 || new Set(speeds).size !== k) refuse();
  return { kind: harmonic ? 0 : 1, movingRunners: k, totalRunners: k + 1, q, v, divisibleSpeeds, exceptionSpeeds, speeds,
    tau: wire(tau, w), baseTime: wire(t0, w), normalizedPhase: wire(x, w), carry, qInverse: inverse, normalizedShift: h ?? modulo(q * j + carry, 3, w), physicalShift: j, time: wire(time, w),
    selectionRule: harmonic ? 0 : 1, exceptionDistancesByShift: matrixWire(rows, w), coordinateDistances: coordinates.map(value => wire(value, w)),
    minimumDistance: wire(minimum(coordinates, w), w), gamma: wire(gamma, w), lowerMargin: wire(lower, w), lowerLrcAssumption: k === 13 ? 0 : 1, lowerWitnessVerified: true };
}
function oldNegative(d: number, e: number, exceptions: number[], w: Work): CorrelatedTripleOldNegative {
  const divisibleSpeeds = Array.from({ length: 14 - e }, (_, i) => d * (2 * i + 1)), speeds = [...divisibleSpeeds, ...exceptions], t0 = rat(1, 2, w);
  const lowerDistances = divisibleSpeeds.map(speed => dist(multiply(t0, speed, w), w)), exceptionRows = matrix(t0, exceptions, d, w), fullRows = matrix(t0, speeds, d, w);
  const r = ((d - 1) - (d - 1) % e) / e;
  const oldDelta = rat(r, 2 * d, w), exceptionMaximum = maximum(exceptionRows.map(row => minimum(row, w)), w), fullMinima = fullRows.map(row => minimum(row, w)), fullMaximum = maximum(fullMinima, w);
  if (lowerDistances.some(value => compare(value, rat(1, 2, w), w) !== 0) || compare(exceptionMaximum, oldDelta, w) !== 0 || compare(fullMaximum, oldDelta, w) !== 0) refuse();
  return { d, e, divisibleSpeeds, exceptionSpeeds: exceptions, speeds, baseTime: wire(t0, w), reducedLowerTime: wire(rat(d, 2, w), w), lowerCoordinateDistances: lowerDistances.map(value => wire(value, w)),
    exceptionDistancesByShift: matrixWire(exceptionRows, w), fullMinimumByShift: fullMinima.map(value => wire(value, w)), maximumExceptionMinimum: wire(exceptionMaximum, w), maximumFullMinimum: wire(fullMaximum, w), oldDelta: wire(oldDelta, w), lowerWitnessVerified: true };
}
function alias(w: Work): CorrelatedTripleAlias {
  const divisibleSpeeds = [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13].map(v => 3 * v), exceptionSpeeds = [1, 5, 4], speeds = [...divisibleSpeeds, ...exceptionSpeeds], t0 = rat(1, 15, w);
  const lowerDistances = divisibleSpeeds.map(speed => dist(multiply(t0, speed, w), w)), minima = matrix(t0, speeds, 3, w).map(row => minimum(row, w));
  if (compare(minimum(lowerDistances, w), rat(1, 5, w), w) !== 0 || compare(maximum(minima, w), rat(1, 15, w), w) !== 0) refuse();
  return { movingRunners: 14, totalRunners: 15, divisibleSpeeds, exceptionSpeeds, speeds, reducedLowerTime: wire(rat(1, 5, w), w), baseTime: wire(t0, w),
    lowerCoordinateDistances: lowerDistances.map(value => wire(value, w)), lowerMinimum: wire(minimum(lowerDistances, w), w), exceptionDistancesByShift: matrixWire(matrix(t0, exceptionSpeeds, 3, w), w),
    fullMinimumByShift: minima.map(value => wire(value, w)), maximumFullMinimum: wire(maximum(minima, w), w), requiredPairPresent: false, residuePattern: [1, 2, 1], doesNotDisproveGlobalLrc: true };
}
function rebuild(w: Work): CorrelatedTripleEvidence {
  const eta = rat(1, 9, w), sharpRows = matrix(eta, [1, 2, 4], 3, w), sharpMinima = sharpRows.map(row => minimum(row, w));
  if (compare(maximum(sharpMinima, w), eta, w) !== 0) refuse();
  const units = [1, 2, 1], phases = [rat(0, 1, w), rat(1, 3, w), rat(1, 3, w)];
  const obstructionRows = Array.from({ length: 3 }, (_, j) => units.map((unit, i) => dist(add(phases[i], rat(unit * j, 3, w), w), w))), obstructionMinima = obstructionRows.map(row => minimum(row, w));
  if (compare(maximum(obstructionMinima, w), rat(0, 1, w), w) !== 0) refuse();
  const fixtures: CorrelatedTripleFixture[] = [];
  for (const k of [13, 14]) for (const q of [1, 2, 4, 5, 7, 8, 10, 11, 13, 14]) fixtures.push(positive(k, q, 4 * q, true, w));
  for (const k of [13, 14]) for (const [q, v] of [[1, 5], [2, 7], [13, 17]]) fixtures.push(positive(k, q, v, false, w));
  const report: CorrelatedTripleReport = { version: LRC_CORRELATED_TRIPLE_VERSION, divisor: 3, threshold: wire(eta, w), kernelMultipliers: [1, 2, 4], proofSegments: proofSegments(w), partition: partition(w),
    legend: { fixtureKinds: ["HARMONIC", "ARBITRARY_THIRD"], selectionRules: ["HARMONIC_SEGMENT_WITH_CARRY", "LOWEST_PHYSICAL_GOOD_SHIFT"], lowerLrcAssumptions: ["LRC(10)", "LRC(11)"] },
    sharpness: { phase: wire(eta, w), distances: matrixWire(sharpRows, w), minimumDistanceByShift: sharpMinima.map(value => wire(value, w)), maximumMinimumDistance: wire(maximum(sharpMinima, w), w) },
    independentObstruction: { unitResidues: units, phases: phases.map(value => wire(value, w)), distances: matrixWire(obstructionRows, w), minima: obstructionMinima.map(value => wire(value, w)), maximumMinimumDistance: wire(maximum(obstructionMinima, w), w) },
    positiveFixtures: fixtures, oldClassNegatives: [oldNegative(3, 2, [1, 2], w), oldNegative(5, 2, [1, 4], w), oldNegative(5, 3, [1, 2, 3], w), oldNegative(5, 4, [1, 2, 3, 4], w)], residueAlias: alias(w),
    scope: { mathematicalClaim: "SHARP_DOUBLED_PAIR_THIRD_SHIFT_MARGIN", phaseDomain: "ALL_REAL_COMMON_TIME_WRITTEN_PROOF_REQUIRED", family: "EXACT_Q_2Q_V_WITH_3_NOT_DIVIDING_QV", diagnosticKernel: "FIXED_MULTIPLIERS_1_2_4",
      conditionalLowerWitnessRequired: true, movingRunnerConvention: "K_MOVING_K_PLUS_ONE_TOTAL", globalLrc: "NOT_ESTABLISHED", formal: "NOT_ESTABLISHED", external: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED", agentLoop: "NOT_RUN", executionAuthority: false, residueOnlySufficient: false, genericSpeedSolver: false } };
  w.tick(); const reportDigest = createHash("sha256").update(canonical(report, w)).digest("hex"), evidence = { report, reportDigest }; canonical(evidence, w);
  function freeze(value: unknown): void { w.tick(); if (value && typeof value === "object") { for (const item of Object.values(value)) freeze(item); Object.freeze(value); } }
  freeze(evidence); return evidence;
}
function operation(raw: unknown, budget: CorrelatedTripleBudget, validate: boolean): CorrelatedTripleResult {
  const start = performance.now(); let w: Work | undefined;
  try { w = new Work(budget, start); const supplied = validate ? canonical(raw, w) : null, evidence = rebuild(w); if (supplied !== null && supplied !== canonical(evidence, w)) refuse(); w.tick(); return { status: "ACCEPTED", evidence, elapsedMs: performance.now() - start, chargedOperations: w.operations }; }
  catch (error) { return { status: error instanceof Refusal ? error.status : "REPORT_REFUSED", evidence: null, elapsedMs: performance.now() - start, chargedOperations: w?.operations ?? 0 }; }
}
export function buildLrcCorrelatedTripleReport(budget: CorrelatedTripleBudget): CorrelatedTripleResult { return operation(null, budget, false); }
/** Full passive reconstruction; hashes are local consistency, not attestation. */
export function validateLrcCorrelatedTripleReport(raw: unknown, budget: CorrelatedTripleBudget): CorrelatedTripleResult { return operation(raw, budget, true); }
