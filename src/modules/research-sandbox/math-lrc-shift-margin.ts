import { createHash } from "node:crypto";

/** Additive fixed-class diagnostic. It neither changes the old 1/15 predicate
 * nor creates execution/admission authority or a novel/global LRC proof. */
export const LRC_SHARP_SHIFT_MARGIN_VERSION = "LRC_SHARP_SHIFT_MARGIN_V1" as const;
export const LRC_SHARP_SHIFT_MARGIN_LIMITS = Object.freeze({ bytes: 32768, milliseconds: 5000, operations: 2000000, componentBits: 256 });
/** Compact exact reduced [numerator, positive denominator] decimal wire. */
export type ShiftMarginFraction = [string, string];
export interface ShiftMarginCell { kind: "BOUNDARY" | "OPEN"; left: ShiftMarginFraction; right: ShiftMarginFraction; representative: ShiftMarginFraction; badShiftIndices: number[] }
export interface ShiftMarginPartition { unitResidue: number; boundaries: ShiftMarginFraction[]; cells: ShiftMarginCell[]; maskFamily: number[][] }
export interface ShiftMarginClassReport {
  d: number; e: number; r: number; delta: ShiftMarginFraction; partitions: ShiftMarginPartition[];
  attainableMasks: number[][]; tupleCount: number; minimumGoodShifts: number; guaranteedGoodShifts: number;
  sharpness: { unitResidues: number[]; offsets: ShiftMarginFraction[]; distances: ShiftMarginFraction[][]; minimumDistanceByShift: ShiftMarginFraction[]; maximumMinimumDistance: ShiftMarginFraction };
  conditional: { lowerMovingRunners: number; lowerLrcAssumption: string; lowerMargin: ShiftMarginFraction; guaranteedMargin: ShiftMarginFraction; lowerWitnessAssumed: true; analyticAlignmentAssumed: true };
}
export interface ShiftMarginReportBody {
  version: typeof LRC_SHARP_SHIFT_MARGIN_VERSION;
  classes: ShiftMarginClassReport[];
  scope: { mathematicalClaim: "SHARP_UNIFORM_EXCEPTION_SHIFT_MARGIN"; phaseDomain: "ALL_REAL_PHASES_WRITTEN_PROOF_REQUIRED"; diagnosticScope: "FOUR_FIXED_CLASSES";
    lowerLrcAssumptionsRequired: true; lowerWitnessAssumed: true; analyticAlignmentAssumed: true;
    globalLrc: "NOT_ESTABLISHED"; speedTupleSharpness: "NOT_ESTABLISHED"; formal: "NOT_ESTABLISHED"; external: "NOT_ESTABLISHED";
    novelty: "NOT_ESTABLISHED"; agentLoop: "NOT_RUN"; executionAuthority: false };
}
export interface ShiftMarginEvidence { report: ShiftMarginReportBody; reportDigest: string }
export interface ShiftMarginBudget { remainingMs: number; remainingOperations: number }
export interface ShiftMarginResult { status: "ACCEPTED" | "REPORT_REFUSED" | "RESOURCE_REFUSED"; evidence: ShiftMarginEvidence | null; elapsedMs: number; chargedOperations: number }
class MarginFault extends Error { constructor(readonly status: "REPORT_REFUSED" | "RESOURCE_REFUSED") { super(status); } }
const refused = (): never => { throw new MarginFault("REPORT_REFUSED"); };
const exhausted = (): never => { throw new MarginFault("RESOURCE_REFUSED"); };
class Work {
  operations = 0;
  readonly milliseconds: number;
  readonly maximum: number;
  constructor(raw: ShiftMarginBudget, readonly started: number) {
    if (!raw || Object.getPrototypeOf(raw) !== Object.prototype || Object.getOwnPropertySymbols(raw).length) exhausted();
    if (Reflect.ownKeys(raw).length !== 2) exhausted();
    const values = Object.getOwnPropertyDescriptors(raw);
    if (Object.keys(values).sort().join(",") !== "remainingMs,remainingOperations" || !("value" in values.remainingMs) || !("value" in values.remainingOperations)) exhausted();
    const ms = values.remainingMs.value, steps = values.remainingOperations.value;
    if (typeof ms !== "number" || typeof steps !== "number" || !Number.isInteger(ms) || ms <= 0 || ms > 5000 || !Number.isInteger(steps) || steps <= 0 || steps > 2000000) throw new MarginFault("RESOURCE_REFUSED");
    this.milliseconds = ms; this.maximum = steps;
  }
  tick(steps = 1): void {
    if (this.operations + steps > this.maximum || performance.now() - this.started > this.milliseconds) exhausted();
    this.operations += steps;
  }
}

/** Strict bounded plain JSON before reading properties, parsing/hash work. */
function canonical(raw: unknown, work: Work): string {
  // JSON serialization must not execute inherited host hooks. This is a
  // passive-input fence, not an attestation of an untrusted JS runtime.
  if (Object.getOwnPropertyDescriptor(Object.prototype, "toJSON") || Object.getOwnPropertyDescriptor(Array.prototype, "toJSON")) refused();
  const ancestors = new Set<object>(); let nodes = 0, stringBytes = 0;
  const maxComponent = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
  function visit(value: unknown, depth: number): unknown {
    work.tick(); if (++nodes > 12000 || depth > 32) exhausted();
    if (value === null || typeof value === "boolean") return value;
    if (typeof value === "number") { if (!Number.isSafeInteger(value) || Object.is(value, -0)) refused(); return value; }
    if (typeof value === "string") {
      stringBytes += Buffer.byteLength(value); if (stringBytes > 32768) exhausted();
      if (/^(0|[1-9][0-9]*)$/.test(value) && (value.length > maxComponent.length || value.length === maxComponent.length && value > maxComponent)) exhausted();
      return value;
    }
    if (!value || typeof value !== "object" || ancestors.has(value)) return refused();
    const array = Array.isArray(value);
    if (Object.getPrototypeOf(value) !== (array ? Array.prototype : Object.prototype) || Object.getOwnPropertySymbols(value).length) refused();
    const keys = Reflect.ownKeys(value);
    if (keys.length > 12000) exhausted();
    const descriptors = Object.getOwnPropertyDescriptors(value);
    for (const key of keys) {
      work.tick(); const item = descriptors[key as string];
      if (!item || !("value" in item) || (!item.enumerable && key !== "length")) refused();
      if (!array) stringBytes += Buffer.byteLength(String(key)); if (stringBytes > 32768) exhausted();
    }
    ancestors.add(value); let result: unknown;
    if (array) {
      const length = descriptors.length?.value;
      if (!Number.isSafeInteger(length) || length < 0 || length > 12000 || keys.length !== length + 1) refused();
      const output: unknown[] = [];
      for (let i = 0; i < length; i++) { if (!descriptors[String(i)]) refused(); output.push(visit(descriptors[String(i)].value, depth + 1)); }
      result = output;
    } else {
      const output: Record<string, unknown> = {};
      for (const key of (keys as string[]).sort()) Object.defineProperty(output, key, { value: visit(descriptors[key].value, depth + 1), enumerable: true });
      result = output;
    }
    ancestors.delete(value); return result;
  }
  const text = JSON.stringify(visit(raw, 0)); work.tick();
  if (Buffer.byteLength(text) > 32768) exhausted(); return text;
}
function hash(text: string, work: Work): string { work.tick(); return createHash("sha256").update(text).digest("hex"); }
function gcd(a: number, b: number, work: Work): number { while (b) { work.tick(); [a, b] = [b, a % b]; } return a; }
function wire(numerator: number, denominator: number, work: Work): ShiftMarginFraction {
  work.tick(); if (!Number.isSafeInteger(numerator) || numerator < 0 || !Number.isSafeInteger(denominator) || denominator <= 0) exhausted();
  const factor = gcd(numerator, denominator, work);
  return [String(numerator / factor), String(denominator / factor)];
}
function mod(n: number, denominator: number, work: Work): number { work.tick(); return ((n % denominator) + denominator) % denominator; }
function maskBits(mask: readonly number[], work: Work): number { let bits = 0; for (const j of mask) { work.tick(); bits |= 1 << j; } return bits; }
function maskWire(bits: number, d: number, work: Work): number[] { const result: number[] = []; for (let j = 0; j < d; j++) { work.tick(); if (bits & (1 << j)) result.push(j); } return result; }
function family(bits: Set<number>, d: number, work: Work): number[][] { return [...bits].sort((a, b) => { work.tick(); return a - b; }).map(value => maskWire(value, d, work)); }
function distance(point: number, denominator: number, work: Work): number { const wrapped = mod(point, denominator, work); return Math.min(wrapped, denominator - wrapped); }
function badMask(point: number, denominator: number, unit: number, d: number, r: number, work: Work): number[] {
  const result: number[] = [];
  for (let j = 0; j < d; j++) { work.tick(); const dist = distance(point + unit * j * (denominator / d), denominator, work); if (dist * 2 * d < r * denominator) result.push(j); }
  return result;
}
function buildClass(d: number, e: number, work: Work): ShiftMarginClassReport {
  work.tick(); const r = Math.floor((d - 1) / e), lattice = 2 * d, partitions: ShiftMarginPartition[] = [], attainable = new Set<number>();
  for (let unit = 1; unit < d; unit++) {
    work.tick(); if (gcd(unit, d, work) !== 1) continue;
    const roots = new Set<number>();
    for (let j = 0; j < d; j++) for (const sign of [-1, 1]) { work.tick(); roots.add(mod(sign * r - 2 * unit * j, lattice, work)); }
    const boundaries = [...roots].sort((a, b) => { work.tick(); return a - b; }), cells: ShiftMarginCell[] = [], localFamily = new Set<number>();
    if (boundaries.length !== d) refused();
    for (let i = 0; i < boundaries.length; i++) {
      const left = boundaries[i], right = i + 1 < boundaries.length ? boundaries[i + 1] : boundaries[0] + lattice;
      for (const open of [false, true]) {
        work.tick(); const denominator = open ? 2 * lattice : lattice;
        const representative = open ? mod(left + right, denominator, work) : left;
        const badShiftIndices = badMask(representative, denominator, unit, d, r, work), bits = maskBits(badShiftIndices, work);
        if (badShiftIndices.length !== (open ? r : r - 1)) refused();
        localFamily.add(bits); attainable.add(bits);
        cells.push({ kind: open ? "OPEN" : "BOUNDARY", left: wire(left, lattice, work), right: wire(open ? right : left, lattice, work),
          representative: wire(representative, denominator, work), badShiftIndices });
      }
    }
    partitions.push({ unitResidue: unit, boundaries: boundaries.map(point => wire(point, lattice, work)), cells, maskFamily: family(localFamily, d, work) });
  }
  // Enumerate deduplicated attainable families, not the redundant unit/cell product.
  const possible = [...attainable].sort((a, b) => { work.tick(); return a - b; }); let tupleCount = 0, minimumGoodShifts = d;
  function enumerate(depth: number, covered: number): void {
    work.tick(); if (depth < e) { for (const bits of possible) enumerate(depth + 1, covered | bits); return; }
    tupleCount++; let good = 0;
    for (let j = 0; j < d; j++) { work.tick(); if (!(covered & (1 << j))) good++; }
    minimumGoodShifts = Math.min(minimumGoodShifts, good);
  }
  enumerate(0, 0);
  const offsets: ShiftMarginFraction[] = [], distances: ShiftMarginFraction[][] = [], minima = Array<number>(d).fill(lattice);
  for (let i = 0; i < e; i++) {
    work.tick(); const phase = mod(-(2 * i * (r + 1) + r), lattice, work); offsets.push(wire(phase, lattice, work));
    const row: ShiftMarginFraction[] = [];
    for (let j = 0; j < d; j++) { work.tick(); const value = distance(phase + 2 * j, lattice, work); row.push(wire(value, lattice, work)); minima[j] = Math.min(minima[j], value); }
    distances.push(row);
  }
  const lowerDenominator = 15 - e;
  if (minimumGoodShifts < d - e * r || Math.max(...minima) !== r) refused();
  return { d, e, r, delta: wire(r, lattice, work), partitions, attainableMasks: family(attainable, d, work), tupleCount, minimumGoodShifts,
    guaranteedGoodShifts: d - e * r,
    sharpness: { unitResidues: Array<number>(e).fill(1), offsets, distances, minimumDistanceByShift: minima.map(point => wire(point, lattice, work)), maximumMinimumDistance: wire(Math.max(...minima), lattice, work) },
    conditional: { lowerMovingRunners: 14 - e, lowerLrcAssumption: `LRC(${14 - e})`, lowerMargin: wire(1, lowerDenominator, work),
      guaranteedMargin: r * lowerDenominator >= lattice ? wire(1, lowerDenominator, work) : wire(r, lattice, work), lowerWitnessAssumed: true, analyticAlignmentAssumed: true } };
}
function rebuild(work: Work): ShiftMarginEvidence {
  const report: ShiftMarginReportBody = { version: LRC_SHARP_SHIFT_MARGIN_VERSION, classes: [[3, 2], [5, 2], [5, 3], [5, 4]].map(([d, e]) => buildClass(d, e, work)),
    scope: { mathematicalClaim: "SHARP_UNIFORM_EXCEPTION_SHIFT_MARGIN", phaseDomain: "ALL_REAL_PHASES_WRITTEN_PROOF_REQUIRED", diagnosticScope: "FOUR_FIXED_CLASSES",
      lowerLrcAssumptionsRequired: true, lowerWitnessAssumed: true, analyticAlignmentAssumed: true, globalLrc: "NOT_ESTABLISHED", speedTupleSharpness: "NOT_ESTABLISHED",
      formal: "NOT_ESTABLISHED", external: "NOT_ESTABLISHED", novelty: "NOT_ESTABLISHED", agentLoop: "NOT_RUN", executionAuthority: false } };
  const reportDigest = hash(canonical(report, work), work), result = { report, reportDigest };
  canonical(result, work);
  function freeze(value: unknown): void {
    work.tick(); if (value && typeof value === "object") {
      for (const item of Object.values(value)) freeze(item);
      Object.freeze(value);
    }
  }
  freeze(result); return result;
}
function operation(raw: unknown, budget: ShiftMarginBudget, validate: boolean): ShiftMarginResult {
  const started = performance.now(); let work: Work | undefined;
  try {
    work = new Work(budget, started);
    const supplied = validate ? canonical(raw, work) : null;
    const evidence = rebuild(work);
    if (supplied !== null && supplied !== canonical(evidence, work)) refused();
    work.tick(); return { status: "ACCEPTED", evidence, elapsedMs: performance.now() - started, chargedOperations: work.operations };
  } catch (error) {
    return { status: error instanceof MarginFault ? error.status : "REPORT_REFUSED", evidence: null, elapsedMs: performance.now() - started, chargedOperations: work?.operations ?? 0 };
  }
}
export function buildLrcSharpShiftMarginReport(budget: ShiftMarginBudget): ShiftMarginResult { return operation(null, budget, false); }
/** Full deterministic reconstruction, not supplied verdict/hash admission. */
export function validateLrcSharpShiftMarginReport(raw: unknown, budget: ShiftMarginBudget): ShiftMarginResult { return operation(raw, budget, true); }
