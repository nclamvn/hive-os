import { createHash } from "node:crypto";
import { z } from "zod";
import type { LrcShiftFiniteResult } from "./math-lrc-method-unit";

export const LRC_SHIFT_REPLAY_VERSION = "LRC_SHIFT_INDEPENDENT_REPLAY_V1" as const;
const PREDICATE = "SHIFT_PHASE_PARTITION_AND_COMMON_SHIFT_FINITE_V1";
const MAX_BYTES = 32768;
const MAX_NODES = 12000;
const MAX_BITS = 256;
const MAX_OPERATIONS = 2000000;
const MAX_MS = 5000;

export type LrcShiftReplayBudget = {
  remainingMs: number;
  remainingOperations: number;
};
export type LrcShiftReplay = {
  version: typeof LRC_SHIFT_REPLAY_VERSION;
  status: "ACCEPTED" | "CERTIFICATE_REFUSED" | "UNSUPPORTED" | "RESOURCE_REFUSED";
  result: LrcShiftFiniteResult | null;
  resultDigest: string | null;
  elapsedMs: number;
  chargedOperations: number;
  globalProof: false;
  realTimeProof: false;
  novelty: false;
  executionAuthority: false;
};

class ReplayFault extends Error {
  constructor(readonly kind: "CERTIFICATE_REFUSED" | "RESOURCE_REFUSED") {
    super(kind);
  }
}
function malformed(): never { throw new ReplayFault("CERTIFICATE_REFUSED"); }
function exhausted(): never { throw new ReplayFault("RESOURCE_REFUSED"); }

class Work {
  operations = 0;
  readonly limits: LrcShiftReplayBudget;
  constructor(raw: LrcShiftReplayBudget, readonly started: number) {
    if (!raw || Object.getPrototypeOf(raw) !== Object.prototype || Object.getOwnPropertySymbols(raw).length) exhausted();
    const descriptors = Object.getOwnPropertyDescriptors(raw);
    if (Object.keys(descriptors).sort().join(",") !== "remainingMs,remainingOperations" ||
      !("value" in descriptors.remainingMs) || !("value" in descriptors.remainingOperations)) exhausted();
    const remainingMs = descriptors.remainingMs.value, remainingOperations = descriptors.remainingOperations.value;
    if (typeof remainingMs !== "number" || !Number.isFinite(remainingMs) || remainingMs <= 0 || remainingMs > MAX_MS ||
      typeof remainingOperations !== "number" || !Number.isInteger(remainingOperations) || remainingOperations < 1 || remainingOperations > MAX_OPERATIONS) exhausted();
    this.limits = { remainingMs, remainingOperations };
  }
  tick(count = 1): void {
    if (this.operations + count > this.limits.remainingOperations ||
      performance.now() - this.started > this.limits.remainingMs) exhausted();
    this.operations += count;
  }
  bounded(value: bigint): bigint {
    this.tick();
    if ((value < BigInt(0) ? -value : value).toString(2).length > MAX_BITS) exhausted();
    return value;
  }
  plus(a: bigint, b: bigint): bigint { return this.bounded(a + b); }
  minus(a: bigint, b: bigint): bigint { return this.bounded(a - b); }
  times(a: bigint, b: bigint): bigint { return this.bounded(a * b); }
  remainder(a: bigint, b: bigint): bigint { return this.bounded(a % b); }
  divide(a: bigint, b: bigint): bigint { return this.bounded(a / b); }
}

// Inspect descriptors before any schema/hash/BigInt operation. No getters are read.
// Only plain JSON is accepted; all traversal and canonicalization are bounded.
function safeCanonical(raw: unknown, work: Work): string {
  let nodes = 0, bytes = 0;
  const ancestors = new Set<object>();
  function fragment(text: string): string {
    bytes += Buffer.byteLength(text, "utf8");
    work.tick();
    if (bytes > MAX_BYTES) exhausted();
    return text;
  }
  function visit(value: unknown, depth: number): string {
    work.tick();
    if (++nodes > MAX_NODES || depth > 32) exhausted();
    if (value === null) return fragment("null");
    if (typeof value === "string") {
      if (value.length > MAX_BYTES || Buffer.byteLength(value, "utf8") > MAX_BYTES) exhausted();
      return fragment(JSON.stringify(value));
    }
    if (typeof value === "boolean") return fragment(value ? "true" : "false");
    if (typeof value === "number") {
      if (!Number.isFinite(value) || Object.is(value, -0)) malformed();
      return fragment(JSON.stringify(value));
    }
    if (typeof value !== "object" || !value) malformed();
    const object = value as object;
    if (ancestors.has(object)) malformed();
    const prototype = Object.getPrototypeOf(object);
    const isArray = Array.isArray(object);
    if (prototype !== (isArray ? Array.prototype : Object.prototype)) malformed();
    if (Object.getOwnPropertySymbols(object).length) malformed();
    const keys = Reflect.ownKeys(object);
    if (keys.length > MAX_NODES) exhausted();
    const descriptors = Object.getOwnPropertyDescriptors(object);
    for (const key of keys) {
      work.tick();
      const descriptor = descriptors[key as string];
      if (!descriptor || !("value" in descriptor) || (!descriptor.enumerable && key !== "length")) malformed();
    }
    // Decimal lexicographic comparison enforces the bit ceiling without parsing
    // oversized attacker integers. Applies to EVERY rational field, not just seed.
    for (const key of ["numerator", "denominator"]) {
      const component = descriptors[key]?.value;
      if (typeof component === "string" && component.length > MAX_BYTES) exhausted();
      if (typeof component === "string" && /^(0|[1-9][0-9]*)$/.test(component)) {
        const max = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
        if (component.length > max.length || component.length === max.length && component > max) exhausted();
      }
    }
    ancestors.add(object);
    let text: string;
    if (isArray) {
      const length = descriptors.length?.value;
      if (!Number.isSafeInteger(length) || length < 0 || length > MAX_NODES) exhausted();
      if (keys.length !== length + 1) malformed();
      const values: string[] = [];
      for (let i = 0; i < length; i++) {
        const item = descriptors[String(i)];
        if (!item) malformed();
        values.push(visit(item.value, depth + 1));
      }
      text = fragment("[") + values.join(",") + fragment("]");
      bytes += Math.max(0, length - 1);
    } else {
      const values: string[] = [];
      for (const key of (keys as string[]).sort()) {
        if (key.length > MAX_BYTES) exhausted();
        values.push(fragment(JSON.stringify(key)) + fragment(":") + visit(descriptors[key].value, depth + 1));
      }
      text = fragment("{") + values.join(",") + fragment("}");
      bytes += Math.max(0, values.length - 1);
    }
    ancestors.delete(object);
    if (bytes > MAX_BYTES) exhausted();
    return text;
  }
  const text = visit(raw, 0);
  if (Buffer.byteLength(text, "utf8") > MAX_BYTES) exhausted();
  work.tick();
  return text;
}

const decimal = z.string().regex(/^(0|[1-9][0-9]*)$/).max(78);
const fraction = z.object({ numerator: decimal, denominator: decimal }).strict();
const mask = z.array(z.number().int().min(0).max(4)).max(5);
const cell = z.object({
  kind: z.enum(["BOUNDARY", "OPEN"]), left: fraction, right: fraction,
  representative: fraction, badShiftIndices: mask,
}).strict();
const partition = z.object({
  unitResidue: z.number().int().min(1).max(4),
  boundaries: z.array(fraction).min(6).max(10), cells: z.array(cell).min(12).max(20),
}).strict();
const certificate = z.object({
  version: z.literal(1), totalRunners: z.literal(15), d: z.union([z.literal(3), z.literal(5)]),
  partitions: z.array(partition).min(2).max(4), maximumBadPerException: z.number().int().min(0).max(5),
  m_d: z.literal(1), tupleBadMasks: z.array(mask).min(2).max(4), goodShiftIndices: mask,
  certificateDigest: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
const input = z.object({
  version: z.literal(1), predicateId: z.literal(PREDICATE),
  d: z.number().int().min(2).max(1000000), e: z.number().int().min(2).max(14),
  unitResidues: z.array(z.number().int().min(1).max(999999)).min(2).max(14),
  offsets: z.array(fraction).min(2).max(14), certificate,
}).strict();
type Fraction = z.infer<typeof fraction>;

function gcd(a: bigint, b: bigint, work: Work): bigint {
  while (b !== BigInt(0)) { work.tick(); const next = work.remainder(a, b); a = b; b = next; }
  return a;
}
function rational(value: Fraction, work: Work): { n: bigint; d: bigint } {
  work.tick(2);
  const n = work.bounded(BigInt(value.numerator)), d = work.bounded(BigInt(value.denominator));
  if (d <= BigInt(0) || gcd(n, d, work) !== BigInt(1)) malformed();
  return { n, d };
}
function latticeWire(n: bigint, d: bigint, work: Work): Fraction {
  const common = gcd(n, d, work);
  return { numerator: work.divide(n, common).toString(), denominator: work.divide(d, common).toString() };
}
function equals(a: unknown, b: unknown, work: Work): boolean {
  return safeCanonical(a, work) === safeCanonical(b, work);
}
function digest(value: unknown, work: Work): string {
  const text = safeCanonical(value, work);
  work.tick();
  return createHash("sha256").update(text, "utf8").digest("hex");
}
function negativeSafeMod(n: bigint, d: bigint, work: Work): bigint {
  const residue = work.remainder(n, d);
  return residue < BigInt(0) ? work.plus(residue, d) : residue;
}

// Separate integer-lattice derivation. Critical points live in denominator15*d;
// open-cell midpoints live in30*d. No old rational geometry is executed.
function reconstruct(value: z.infer<typeof input>, work: Work): LrcShiftFiniteResult {
  const d = value.d, c = value.certificate;
  if (c.d !== d || c.partitions.length !== d - 1) malformed();
  let cellCount = 0, maximum = 0;
  const lattice = work.times(BigInt(15), BigInt(d));
  for (let unit = 1; unit < d; unit++) {
    const roots = new Set<number>();
    for (let j = 0; j < d; j++) {
      const center = work.times(BigInt(15), work.times(BigInt(unit), BigInt(j)));
      for (const boundarySign of [BigInt(-1), BigInt(1)]) {
        const root = negativeSafeMod(work.minus(work.times(boundarySign, BigInt(d)), center), lattice, work);
        roots.add(Number(root));
      }
    }
    const ordered = [...roots].sort((a, b) => { work.tick(); return a - b; });
    const p = c.partitions[unit - 1];
    const expectedBoundaries = ordered.map(n => latticeWire(BigInt(n), lattice, work));
    if (p.unitResidue !== unit || !equals(p.boundaries, expectedBoundaries, work) || p.cells.length !== ordered.length * 2) malformed();
    for (let index = 0; index < ordered.length; index++) {
      const left = BigInt(ordered[index]);
      const right = BigInt(index + 1 < ordered.length ? ordered[index + 1] : ordered[0] + Number(lattice));
      for (const open of [false, true]) {
        work.tick();
        const den = open ? work.times(BigInt(2), lattice) : lattice;
        const point = open ? negativeSafeMod(work.plus(left, right), den, work) : left;
        const bad: number[] = [];
        for (let j = 0; j < d; j++) {
          work.tick();
          const shifted = negativeSafeMod(work.plus(point, work.times(work.times(BigInt(unit), BigInt(j)), work.divide(den, BigInt(d)))), den, work);
          const complementary = work.minus(den, shifted);
          const distance = shifted < complementary ? shifted : complementary;
          if (work.times(BigInt(15), distance) < den) bad.push(j);
        }
        const expectedCell = {
          kind: open ? "OPEN" : "BOUNDARY",
          left: latticeWire(left, lattice, work),
          right: latticeWire(open ? right : left, lattice, work),
          representative: latticeWire(point, den, work), badShiftIndices: bad,
        };
        if (!equals(p.cells[2 * index + Number(open)], expectedCell, work)) malformed();
        maximum = Math.max(maximum, bad.length); cellCount++;
      }
    }
  }
  const tupleBadMasks = value.offsets.map((offset, i) => {
    const phase = rational(offset, work), bad: number[] = [];
    const denominator = work.times(phase.d, BigInt(d));
    for (let j = 0; j < d; j++) {
      const unwrapped = work.plus(work.times(phase.n, BigInt(d)), work.times(work.times(BigInt(value.unitResidues[i]), BigInt(j)), phase.d));
      const point = negativeSafeMod(unwrapped, denominator, work);
      const complement = work.minus(denominator, point);
      if (work.times(BigInt(15), point < complement ? point : complement) < denominator) bad.push(j);
    }
    return bad;
  });
  const goodShiftIndices: number[] = [];
  for (let j = 0; j < d; j++) {
    work.tick(value.e);
    if (tupleBadMasks.every(row => !row.includes(j))) goodShiftIndices.push(j);
  }
  if (maximum !== 1 || c.maximumBadPerException !== maximum || c.m_d !== 1 ||
    !equals(tupleBadMasks, c.tupleBadMasks, work) || !equals(goodShiftIndices, c.goodShiftIndices, work) ||
    goodShiftIndices.length < d - value.e) malformed();
  const { certificateDigest, ...body } = c;
  if (certificateDigest !== digest(body, work)) malformed();
  return {
    tupleBadMasks, goodShiftIndices, maximumBadPerException: maximum, m_d: 1,
    partitions: d - 1, cells: cellCount, globalLrc: "NOT_ESTABLISHED", realTimeProof: "NOT_ESTABLISHED",
  };
}

export function replayLrcShiftFiniteCertificate(raw: unknown, budget: LrcShiftReplayBudget): LrcShiftReplay {
  const started = performance.now();
  let work: Work | undefined, status: LrcShiftReplay["status"] = "CERTIFICATE_REFUSED";
  let result: LrcShiftFiniteResult | null = null, resultDigest: string | null = null;
  try {
    work = new Work(budget, started);
    const text = safeCanonical(raw, work);
    // Isolate from mutations of caller objects after descriptor validation.
    const parsed = input.safeParse(JSON.parse(text));
    work.tick();
    if (!parsed.success) malformed();
    const value = parsed.data;
    if (value.unitResidues.length !== value.e || value.offsets.length !== value.e || value.unitResidues.some(a => a >= value.d)) malformed();
    for (const offset of value.offsets) {
      const phase = rational(offset, work);
      if (phase.n >= phase.d) malformed();
    }
    const supported = value.d === 3 && value.e === 2 || value.d === 5 && value.e >= 2 && value.e <= 4;
    if (!supported) status = "UNSUPPORTED";
    else {
      result = reconstruct(value, work);
      resultDigest = digest(result, work);
      work.tick(); status = "ACCEPTED";
    }
  } catch (error) {
    status = error instanceof ReplayFault ? error.kind : "CERTIFICATE_REFUSED";
    result = null; resultDigest = null;
  }
  const elapsedMs = performance.now() - started;
  if (status === "ACCEPTED" && work && elapsedMs > work.limits.remainingMs) {
    status = "RESOURCE_REFUSED"; result = null; resultDigest = null;
  }
  return {
    version: LRC_SHIFT_REPLAY_VERSION, status, result, resultDigest,
    elapsedMs, chargedOperations: work?.operations ?? 0,
    globalProof: false, realTimeProof: false, novelty: false, executionAuthority: false,
  };
}
