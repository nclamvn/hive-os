import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Inert import. No provider, prior producer, experiment or truth oracle. */
export const DUAL_TARGET_INPUTS = Object.freeze({ controls: Object.freeze([
  { id: "C0", p: "13", h: "7" }, { id: "C1", p: "61", h: "7" },
  { id: "C2", p: "157", h: "7" }, { id: "C3", p: "401", h: "31" },
  { id: "C4", p: "2521", h: "31" }, { id: "C5", p: "113", h: "31" },
].map((v) => Object.freeze(v))) });
export const DUAL_TARGET_LIMITS = Object.freeze({ seconds: 30, maxRows: 6, maxStateInsertions: 100_000, maxWork: 5_000_000, maxOutputBytes: 1_048_576 });
export const DUAL_TARGET_METHOD = "ERDOS_STRAUS_DUAL_TARGET_DIVISOR_REALIZATION_V1";
export const DUAL_TARGET_POLICY = "POSITIVE_NORM_DIRECTION_FIRST_AND_POSITIVE_RATIO_GREEDY_WITH_ACTUAL_POINT_CORRECTION";
export const DUAL_TARGET_SCOPE = "Six exposed proof controls only; paired structural assertions concern this Type I norm branch and coprime-divisor Type II shift. UNKNOWN is not MISS; generated split subgroup is not paid coverage. Point corrections spend actual disjoint valuations. No all-shift or root impossibility, universal existence, novelty, benchmark or agent/UI authority.";
export type DualFactors = Array<[string, string]>;
export type NormRep = { residue: string; m: string; exponents: string[] };
export type RatioRep = { residue: string; u: string; v: string; exponents: string[] };
export type NormWitness = { normExponents: string[]; signedExponents: string[]; alpha: string[]; delta: string[]; m: string; a: string; d: string; c: string; v: string; b: string; x: string; y: string; z: string };
export type RatioWitness = { rawExponents: string[]; exponents: string[]; orientation: "UNCHANGED" | "WHOLE_INVERTED"; u: string; v: string; k: string; A: string; x: string; y: string; z: string };
export type DualVerdict = "HIT" | "LOCAL_MISS" | "UNKNOWN";
type BranchBase = { target: string; verdict: DualVerdict; reason: "NO_INERT" | "INCOHERENT" | "FOUR_OUTSIDE" | "PROJECTION_MISS" | "POINT_CORRECTION" | "UNPAID_CORRECTION"; projected: boolean | null; selectedExponent: string | null; inertExponents: string[] | null; inertResidue: string | null };
export type NormBranch = BranchBase & { inverseTarget: string; fourCoset: string; beta: string | null; ell: string | null; correction: { coordinate: "UNSIGNED_NORM"; residue: string; representation: NormRep | null } | null; witness: NormWitness | null };
export type RatioBranch = BranchBase & { correction: { coordinate: "SIGNED_RATIO"; residue: string; representation: RatioRep | null } | null; witness: RatioWitness | null };
type GroupData = { L: string[]; splitNormImage: NormRep[]; splitRatioImage: RatioRep[]; normPaid: boolean; ratioPaid: boolean; anchor: { prime: string; residue: string; coset: string } | null; d: string | null; ambientIndex: string; Eplus: string; Eminus: string; coherent: boolean; directions: Array<{ prime: string; direction: "+1" | "-1" | null }>; typeI: NormBranch; typeII: RatioBranch };
export type DualRow = GroupData & { id: string; p: string; h: string; T: string; factors: DualFactors; characters: Array<{ prime: string; shiftCharacter: "+1" | "-1"; rootCharacter: "+1" | "-1"; kind: "SPLIT" | "INERT" }>; rowDigest: string };
type StopReason = "TIME_LIMIT" | "ROW_LIMIT" | "STATE_LIMIT" | "WORK_LIMIT" | "OUTPUT_LIMIT";
type Pending = { phase: "ROW"; index: string; p: string; h: string } | { phase: "FINALIZE" } | null;
export type DualOptions = Partial<Record<keyof typeof DUAL_TARGET_LIMITS, number>> & { now?: () => number; origin?: number };
export type DualPacket = { method: typeof DUAL_TARGET_METHOD; policy: typeof DUAL_TARGET_POLICY; inputs: typeof DUAL_TARGET_INPUTS; scope: string; status: "COMPLETE" | "PARTIAL"; reason: StopReason | null; pending: Pending; limits: { seconds: number; maxRows: number; maxStateInsertions: number; maxWork: number; maxOutputBytes: number }; rows: DualRow[]; summary: { total: string; typeI: Record<DualVerdict, string>; typeII: Record<DualVerdict, string> }; rowsDigest: string; contentDigest: string; runtime: { elapsedMs: number; stateInsertions: string; work: string; outputBytes: string } };
const B = BigInt, ONE = B(1), ZERO = B(0);
export function dualCanonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(dualCanonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${JSON.stringify(k)}:${dualCanonicalJson(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const dualDigest = (value: unknown) => createHash("sha256").update(dualCanonicalJson(value)).digest("hex");
class Stop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
function budget(options: DualOptions = {}) {
  if (Object.keys(options).some((k) => ![...Object.keys(DUAL_TARGET_LIMITS), "now", "origin"].includes(k))) throw new RangeError("Unknown resource option");
  const { now = () => performance.now(), origin, ...lowered } = options, limits = { ...DUAL_TARGET_LIMITS, ...lowered };
  for (const k of Object.keys(DUAL_TARGET_LIMITS) as Array<keyof typeof DUAL_TARGET_LIMITS>) if (!Number.isFinite(limits[k]) || limits[k] <= 0 || limits[k] > DUAL_TARGET_LIMITS[k] || (k !== "seconds" && !Number.isSafeInteger(limits[k]))) throw new RangeError("Only tighter finite resources allowed");
  if (limits.maxOutputBytes < 4096) throw new RangeError("Minimum diagnostic output4096 bytes");
  const observed = now(), start = origin ?? observed;
  if (!Number.isFinite(observed) || !Number.isFinite(start) || start > observed) throw new RangeError("Finite nonfuture origin required");
  let work = 0, states = 0, lastObserved = observed;
  const elapsed = () => { const t = now(); if (!Number.isFinite(t) || t < start || t < lastObserved) throw new RangeError("Invalid local monotonic clock"); lastObserved = t; return t - start; };
  const tick = () => { if (elapsed() >= limits.seconds * 1000) throw new Stop("TIME_LIMIT"); };
  const pay = () => { tick(); if (work >= limits.maxWork) throw new Stop("WORK_LIMIT"); work++; };
  const insert = () => { tick(); if (states >= limits.maxStateInsertions) throw new Stop("STATE_LIMIT"); states++; };
  return { limits, tick, pay, insert, elapsed, work: () => String(work), states: () => String(states) };
}
type Run = ReturnType<typeof budget>;
function isPrime(n: number, run: Run) {
  if (!Number.isSafeInteger(n) || n < 2 || n > 201_000_000) return false;
  run.pay(); if (n % 2 === 0) return n === 2;
  for (let q = 3; q * q <= n; q += 2) { run.pay(); if (n % q === 0) return false; } return true;
}
function mul(a: number, b: number, h: number, run: Run) { run.pay(); return Number(B(a) * B(b) % B(h)); }
function pow(a: number, e: number, h: number, run: Run) {
  let r = 1; a %= h;
  for (; e > 0; e = Math.floor(e / 2)) { run.pay(); if (e % 2) r = mul(r, a, h, run); a = mul(a, a, h, run); } return r;
}
function inv(a: number, h: number, run: Run) { return pow(a, h - 2, h, run); }
function character(q: number, h: number, run: Run): "+1" | "-1" { const x = pow(q, (h - 1) / 2, h, run); if (x !== 1 && x !== h - 1) throw new Error("Nonunit character"); return x === 1 ? "+1" : "-1"; }
function factor(n: number, run: Run): DualFactors {
  const out: DualFactors = []; let left = n;
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) { run.pay(); if (left % q) continue; let e = 0; while (left % q === 0) { run.pay(); left /= q; e++; } out.push([String(q), String(e)]); }
  if (left > 1) out.push([String(left), "1"]); return out;
}
function closure(h: number, residues: number[], run: Run) {
  const s = new Set([1]); run.insert(); const queue = [1];
  for (let at = 0; at < queue.length; at++) for (const r of residues) { const next = mul(queue[at], r, h, run); if (!s.has(next)) { run.insert(); s.add(next); queue.push(next); } }
  return [...s].sort((a, b) => a - b);
}
type NRep = { m: bigint; exponents: number[] };
type RRep = { u: bigint; v: bigint; exponents: number[] };
function normImage(h: number, f: DualFactors, split: number[], run: Run) {
  let values = new Map<number, NRep>([[1, { m: ONE, exponents: f.map(() => 0) }]]); run.insert();
  for (const i of split) {
    const q = Number(f[i][0]), e = Number(f[i][1]), next = new Map<number, NRep>();
    for (let j = 0; j <= 2 * e; j++) {
      const r = pow(q, j, h, run), power = B(q) ** B(j);
      for (const [a, rep] of values) { const residue = mul(a, r, h, run), exponents = [...rep.exponents]; exponents[i] = j; const candidate = { m: rep.m * power, exponents }, old = next.get(residue); if (!old || candidate.m < old.m) { if (!old) run.insert(); next.set(residue, candidate); } }
    }
    values = next;
  }
  return values;
}
function ratioImage(h: number, f: DualFactors, split: number[], run: Run) {
  let values = new Map<number, RRep>([[1, { u: ONE, v: ONE, exponents: f.map(() => 0) }]]); run.insert();
  for (const i of split) {
    const q = Number(f[i][0]), e = Number(f[i][1]), qi = inv(q % h, h, run), next = new Map<number, RRep>();
    for (let z = -e; z <= e; z++) {
      const r = pow(z < 0 ? qi : q, Math.abs(z), h, run), power = B(q) ** B(Math.abs(z));
      for (const [a, rep] of values) { const residue = mul(a, r, h, run), exponents = [...rep.exponents]; exponents[i] = z; const candidate = { u: rep.u * (z > 0 ? power : ONE), v: rep.v * (z < 0 ? power : ONE), exponents }, old = next.get(residue); if (!old || candidate.u < old.u || (candidate.u === old.u && candidate.v < old.v)) { if (!old) run.insert(); next.set(residue, candidate); } }
    }
    values = next;
  }
  return values;
}
function coordinates(h: number, f: DualFactors, z: number[], signed: boolean, run: Run) {
  let r = 1;
  for (let i = 0; i < f.length; i++) { const q = Number(f[i][0]); r = mul(r, pow(signed && z[i] < 0 ? inv(q % h, h, run) : q, Math.abs(z[i]), h, run), h, run); } return r;
}
function group(h: number, f: DualFactors, run: Run): GroupData {
  const split: number[] = [], inert: number[] = [];
  f.forEach(([q], i) => (character(Number(q), h, run) === "+1" ? split : inert).push(i));
  const L = closure(h, split.map((i) => Number(f[i][0]) % h), run), ls = new Set(L), ni = normImage(h, f, split, run), ri = ratioImage(h, f, split, run);
  const coset = (r: number) => Math.min(...L.map((v) => mul(r, v, h, run)));
  const normWire = (r: number, rep: NRep): NormRep => ({ residue: String(r), m: String(rep.m), exponents: rep.exponents.map(String) });
  const ratioWire = (r: number, rep: RRep): RatioRep => ({ residue: String(r), u: String(rep.u), v: String(rep.v), exponents: rep.exponents.map(String) });
  const splitNormImage = [...ni].sort(([a], [b]) => a - b).map(([r, rep]) => normWire(r, rep)), splitRatioImage = [...ri].sort(([a], [b]) => a - b).map(([r, rep]) => ratioWire(r, rep));
  const zeroVector = () => f.map(() => 0);
  const Tmod = coordinates(h, f, f.map(([, e]) => Number(e)), false, run), pmod = mul(4, Tmod, h, run), targetI = h - inv(pmod, h, run);
  const base = { projected: null, selectedExponent: null, inertExponents: null, inertResidue: null };
  const typeI: NormBranch = { ...base, target: String(targetI), inverseTarget: String(h - pmod), fourCoset: String(coset(4 % h)), beta: null, ell: null, verdict: "UNKNOWN", reason: "INCOHERENT", correction: null, witness: null };
  const typeII: RatioBranch = { ...base, target: String(h - 1), verdict: "UNKNOWN", reason: "INCOHERENT", correction: null, witness: null };
  let anchor: GroupData["anchor"] = null, d: number | null = null, coherent = true;
  const directions: GroupData["directions"] = []; let plus = 0, minus = 0;
  if (!inert.length) { typeI.verdict = typeII.verdict = "LOCAL_MISS"; typeI.reason = typeII.reason = "NO_INERT"; }
  else {
    const r = Number(f[inert[0]][0]) % h, a = coset(r), ai = coset(inv(r, h, run)); anchor = { prime: f[inert[0]][0], residue: String(r), coset: String(a) };
    d = 1; let value = r; while (!ls.has(value)) { value = mul(value, r, h, run); d++; }
    if (d % 4 !== 2 || L.length % 2 !== 1) throw new Error("Character quotient invariant");
    for (const i of inert) { const c = coset(Number(f[i][0]) % h), direction = c === a ? "+1" as const : c === ai ? "-1" as const : null; directions.push({ prime: f[i][0], direction }); if (direction === "+1") plus += Number(f[i][1]); else if (direction === "-1") minus += Number(f[i][1]); else coherent = false; }
    if (coherent) {
      let beta: number | null = null, t = 1;
      for (let b = 0; b < d; b++) { if (coset(t) === Number(typeI.fourCoset)) { beta = b; break; } t = mul(t, r, h, run); }
      typeI.beta = beta === null ? null : String(beta);
      if (beta === null) { typeI.verdict = "LOCAL_MISS"; typeI.reason = "FOUR_OUTSIDE"; typeI.projected = false; }
      else {
        const ell = (d / 2 - beta + d) % d; if (ell === 0 || ell % 2 !== 1) throw new Error("Odd norm target invariant"); typeI.ell = String(ell);
        const projection = 2 * plus >= ell || 2 * minus >= d - ell; typeI.projected = projection;
        if (!projection) { typeI.verdict = "LOCAL_MISS"; typeI.reason = "PROJECTION_MISS"; }
        else {
          const selected = 2 * plus >= ell ? ell : ell - d; typeI.selectedExponent = String(selected); let remaining = Math.abs(selected); const z = zeroVector();
          for (let j = 0; j < inert.length; j++) { if (directions[j].direction !== (selected > 0 ? "+1" : "-1")) continue; const i = inert[j], used = Math.min(2 * Number(f[i][1]), remaining); z[i] = used; remaining -= used; }
          if (remaining) throw new Error("Norm directional allocation invariant");
          const product = coordinates(h, f, z, false, run), required = mul(inv(4 % h, h, run), h - inv(product, h, run), h, run), rep = ni.get(required);
          typeI.inertExponents = z.map(String); typeI.inertResidue = String(product); typeI.correction = { coordinate: "UNSIGNED_NORM", residue: String(required), representation: rep ? normWire(required, rep) : null };
          typeI.verdict = rep ? "HIT" : "UNKNOWN"; typeI.reason = rep ? "POINT_CORRECTION" : "UNPAID_CORRECTION";
          if (!rep && ni.size === L.length) throw new Error("Paid norm invariant");
        }
      }
      typeII.projected = plus + minus >= d / 2;
      if (!typeII.projected) { typeII.verdict = "LOCAL_MISS"; typeII.reason = "PROJECTION_MISS"; }
      else {
        typeII.selectedExponent = String(d / 2); let remaining = d / 2; const z = zeroVector();
        for (let j = 0; j < inert.length; j++) { const i = inert[j], used = Math.min(Number(f[i][1]), remaining); z[i] = directions[j].direction === "+1" ? used : -used; remaining -= used; }
        if (remaining) throw new Error("Ratio directional allocation invariant");
        const product = coordinates(h, f, z, true, run), required = mul(h - 1, inv(product, h, run), h, run), rep = ri.get(required);
        typeII.inertExponents = z.map(String); typeII.inertResidue = String(product); typeII.correction = { coordinate: "SIGNED_RATIO", residue: String(required), representation: rep ? ratioWire(required, rep) : null };
        typeII.verdict = rep ? "HIT" : "UNKNOWN"; typeII.reason = rep ? "POINT_CORRECTION" : "UNPAID_CORRECTION";
        if (!rep && ri.size === L.length) throw new Error("Paid ratio invariant");
      }
    }
  }
  return { L: L.map(String), splitNormImage, splitRatioImage, normPaid: ni.size === L.length, ratioPaid: ri.size === L.length, anchor, d: d === null ? null : String(d), ambientIndex: String((h - 1) / L.length), Eplus: String(plus), Eminus: String(minus), coherent, directions, typeI, typeII };
}
function product(f: DualFactors, z: number[]) { return f.reduce((v, [q], i) => v * B(q) ** B(z[i]), ONE); }
function legal(f: DualFactors, z: number[], norm: boolean) { return z.length === f.length && z.every((v, i) => Number.isSafeInteger(v) && (norm ? v >= 0 && v <= 2 * Number(f[i][1]) : Math.abs(v) <= Number(f[i][1]))); }
function exactTuple(p: bigint, ds: bigint[], count: number) { const [x, y, z] = ds; return x > ZERO && x < y && y < z && ds.filter((v) => v % p === ZERO).length === count && B(4) * x * y * z === p * (x * y + x * z + y * z); }
export function validateNormWitness(p: string, h: string, T: string, f: DualFactors, w: NormWitness): boolean {
  try {
    const j = w.normExponents.map(Number), z = w.signedExponents.map(Number), alpha = j.map((v) => Math.floor(v / 2)), delta = j.map((v) => v % 2);
    if (!legal(f, j, true) || !legal(f, z, false) || z.some((v, i) => v !== j[i] - Number(f[i][1])) || w.alpha.join() !== alpha.map(String).join() || w.delta.join() !== delta.map(String).join()) return false;
    const pp = B(p), hh = B(h), tt = B(T), a = product(f, alpha), dd = product(f, delta), m = product(f, j);
    if (tt !== product(f, f.map(([, e]) => Number(e))) || tt % (a * dd) || (B(4) * m + ONE) % hh) return false;
    const c = tt / (a * dd), v = (B(4) * m + ONE) / hh, b = c * v - a, ds = [tt, b * c * dd, a * b * dd * pp];
    return exactTuple(pp, ds, 1) && [m, a, dd, c, v, b, ...ds].map(String).every((s, i) => s === [w.m, w.a, w.d, w.c, w.v, w.b, w.x, w.y, w.z][i]);
  } catch { return false; }
}
export function validateRatioWitness(p: string, h: string, T: string, f: DualFactors, w: RatioWitness): boolean {
  try {
    const raw = w.rawExponents.map(Number), z = w.exponents.map(Number); if (!legal(f, raw, false) || !legal(f, z, false)) return false;
    const pair = (v: number[]) => ({ u: product(f, v.map((x) => Math.max(x, 0))), v: product(f, v.map((x) => Math.max(-x, 0))) }), original = pair(raw), flipped = original.u > original.v;
    if (w.orientation !== (flipped ? "WHOLE_INVERTED" : "UNCHANGED") || z.some((v, i) => v !== (flipped ? -raw[i] : raw[i]))) return false;
    const { u, v } = pair(z), pp = B(p), hh = B(h), tt = B(T);
    if (tt !== product(f, f.map(([, e]) => Number(e))) || tt % (u * v) || (u + v) % hh) return false;
    const k = tt / (u * v), A = (u + v) / hh, ds = [tt, A * pp * u * k, A * pp * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    return u <= v && exactTuple(pp, ds, 2) && [u, v, k, A, ...ds].map(String).every((s, i) => s === [w.u, w.v, w.k, w.A, w.x, w.y, w.z][i]);
  } catch { return false; }
}
function produce(p: number, h: number, id: string, run: Run): DualRow {
  if (!isPrime(p, run) || p % 4 !== 1 || !isPrime(h, run) || h % 4 !== 3 || h > 127 || h >= p) throw new RangeError("Prime root/shift domain");
  const T = (p + h) / 4, factors = factor(T, run);
  const characters = factors.map(([q]) => { const qq = Number(q), shiftCharacter = character(qq, h, run), rootCharacter = qq === 2 ? (p % 8 === 1 || p % 8 === 7 ? "+1" as const : "-1" as const) : character(p, qq, run); if (rootCharacter !== shiftCharacter) throw new Error("Reciprocity coupling invariant"); return { prime: q, shiftCharacter, rootCharacter, kind: shiftCharacter === "+1" ? "SPLIT" as const : "INERT" as const }; });
  const data = group(h, factors, run);
  if (data.typeI.verdict === "HIT") {
    const j = data.typeI.inertExponents!.map(Number), rep = data.typeI.correction!.representation!;
    for (let i = 0; i < j.length; i++) j[i] += Number(rep.exponents[i]);
    const alpha = j.map((v) => Math.floor(v / 2)), delta = j.map((v) => v % 2), a = product(factors, alpha), dd = product(factors, delta), c = B(T) / (a * dd), v = (B(4) * a * a * dd + ONE) / B(h), b = c * v - a;
    const w: NormWitness = { normExponents: j.map(String), signedExponents: j.map((v, i) => String(v - Number(factors[i][1]))), alpha: alpha.map(String), delta: delta.map(String), m: String(a * a * dd), a: String(a), d: String(dd), c: String(c), v: String(v), b: String(b), x: String(T), y: String(b * c * dd), z: String(a * b * dd * B(p)) };
    run.pay(); if (!validateNormWitness(String(p), String(h), String(T), factors, w)) throw new Error("Norm witness invariant"); data.typeI.witness = w;
  }
  if (data.typeII.verdict === "HIT") {
    const raw = data.typeII.inertExponents!.map(Number), rep = data.typeII.correction!.representation!; for (let i = 0; i < raw.length; i++) raw[i] += Number(rep.exponents[i]);
    const rawU = product(factors, raw.map((v) => Math.max(v, 0))), rawV = product(factors, raw.map((v) => Math.max(-v, 0))), flipped = rawU > rawV, z = raw.map((v) => flipped ? -v : v), u = product(factors, z.map((v) => Math.max(v, 0))), v = product(factors, z.map((v) => Math.max(-v, 0))), k = B(T) / (u * v), A = (u + v) / B(h), ds = [B(T), A * B(p) * u * k, A * B(p) * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    const w: RatioWitness = { rawExponents: raw.map(String), exponents: z.map(String), orientation: flipped ? "WHOLE_INVERTED" : "UNCHANGED", u: String(u), v: String(v), k: String(k), A: String(A), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
    run.pay(); if (!validateRatioWitness(String(p), String(h), String(T), factors, w)) throw new Error("Ratio witness invariant"); data.typeII.witness = w;
  }
  const row = { id, p: String(p), h: String(h), T: String(T), factors, characters, ...data };
  run.pay(); const rowDigest = dualDigest(row); run.tick(); return { ...row, rowDigest };
}
export function dualTargetRow(p: number, h: number, options: DualOptions = {}) { return produce(p, h, `EXPLORATORY_${p}_${h}`, budget(options)); }
/** Bounded, labeled-residue proof seam; no prime root or strict tuple claim. */
export function dualTargetAbstract(h: number, atoms: Array<[number, number]>, options: DualOptions = {}) {
  const run = budget(options);
  if (!isPrime(h, run) || h > 127 || h % 4 !== 3 || atoms.length < 1 || atoms.length > 16 || atoms.some(([q, e]) => !Number.isInteger(q) || q < 1 || q >= h || !Number.isInteger(e) || e < 1 || e > 32)) throw new RangeError("Bounded abstract character domain");
  return group(h, atoms.map(([q, e]) => [String(q), String(e)]), run);
}
export function sealDualPacket(packet: DualPacket): DualPacket {
  // Finite reserved diagnostic finalization remains possible after arithmetic cap exhaustion.
  // Production bounds (six rows /1MiB), byte checks and observed deadline bound this phase;
  // the logical arithmetic counter is not a count of every hash byte or CPU instruction.
  const count = (branch: "typeI" | "typeII") => Object.fromEntries((["HIT", "LOCAL_MISS", "UNKNOWN"] as DualVerdict[]).map((v) => [v, String(packet.rows.filter((r) => r[branch].verdict === v).length)])) as Record<DualVerdict, string>;
  packet.summary = { total: String(packet.rows.length), typeI: count("typeI"), typeII: count("typeII") }; packet.rowsDigest = dualDigest(packet.rows);
  packet.contentDigest = dualDigest({ method: packet.method, inputs: packet.inputs, policy: packet.policy, scope: packet.scope, rows: packet.rows, summary: packet.summary });
  for (let i = 0; i < 8; i++) { const bytes = String(Buffer.byteLength(JSON.stringify(packet))); if (packet.runtime.outputBytes === bytes) break; packet.runtime.outputBytes = bytes; } return packet;
}
export function dualTargetPacket(options: DualOptions = {}): DualPacket {
  const run = budget(options), rows: DualRow[] = []; let reason: StopReason | null = null, pending: Pending = null;
  const pendingRow = (i: number): Pending => ({ phase: "ROW", index: String(i), p: DUAL_TARGET_INPUTS.controls[i].p, h: DUAL_TARGET_INPUTS.controls[i].h });
  try {
    for (let i = 0; i < DUAL_TARGET_INPUTS.controls.length; i++) { pending = pendingRow(i); run.tick(); if (rows.length >= run.limits.maxRows) throw new Stop("ROW_LIMIT"); const c = DUAL_TARGET_INPUTS.controls[i], row = produce(Number(c.p), Number(c.h), c.id, run); run.tick(); rows.push(row); }
    pending = { phase: "FINALIZE" }; run.tick(); pending = null;
  } catch (error) { if (!(error instanceof Stop)) throw error; reason = error.reason; }
  const packet: DualPacket = { method: DUAL_TARGET_METHOD, policy: DUAL_TARGET_POLICY, inputs: DUAL_TARGET_INPUTS, scope: DUAL_TARGET_SCOPE, status: reason ? "PARTIAL" : "COMPLETE", reason, pending, limits: run.limits, rows, summary: { total: "0", typeI: {} as Record<DualVerdict, string>, typeII: {} as Record<DualVerdict, string> }, rowsDigest: "", contentDigest: "", runtime: { elapsedMs: run.elapsed(), stateInsertions: run.states(), work: run.work(), outputBytes: "0" } };
  sealDualPacket(packet);
  while (Number(packet.runtime.outputBytes) > run.limits.maxOutputBytes && rows.length) { rows.pop(); packet.status = "PARTIAL"; packet.reason = "OUTPUT_LIMIT"; packet.pending = pendingRow(rows.length); sealDualPacket(packet); }
  packet.runtime.elapsedMs = run.elapsed(); sealDualPacket(packet);
  try { run.tick(); } catch (error) { if (!(error instanceof Stop)) throw error; if (packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = error.reason; packet.pending = { phase: "FINALIZE" }; } }
  packet.runtime.elapsedMs = run.elapsed(); sealDualPacket(packet);
  // Final hashing/serialization is observed too; a synchronous call is not hard preemption.
  const observed = run.elapsed(); packet.runtime.elapsedMs = observed;
  if (observed >= run.limits.seconds * 1000 && packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; }
  sealDualPacket(packet);
  const finalObserved = run.elapsed();
  if (finalObserved >= run.limits.seconds * 1000 && packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; packet.runtime.elapsedMs = finalObserved; sealDualPacket(packet); }
  if (Number(packet.runtime.outputBytes) > run.limits.maxOutputBytes) throw new RangeError("Diagnostic exceeds output cap");
  return packet;
}
/** Primary-producer receipt validation, not foreign counter/CPU attestation.
 * Recompute the bounded structural science and primary logical prefix cost,
 * never unrestricted target truth. Independent Python receipts use their own collector.
 */
export function verifyDualPacket(raw: unknown): boolean {
  try {
    const p = raw as DualPacket; if (!p || !Array.isArray(p.rows) || p.rows.length > 6 || p.method !== DUAL_TARGET_METHOD || p.policy !== DUAL_TARGET_POLICY || p.scope !== DUAL_TARGET_SCOPE || dualCanonicalJson(p.inputs) !== dualCanonicalJson(DUAL_TARGET_INPUTS)) return false;
    const exactKeys = (value: unknown, keys: string[]) => value !== null && typeof value === "object" && Object.keys(value).sort().join() === keys.sort().join();
    if (!exactKeys(p, ["method", "policy", "inputs", "scope", "status", "reason", "pending", "limits", "rows", "summary", "rowsDigest", "contentDigest", "runtime"]) || !exactKeys(p.limits, Object.keys(DUAL_TARGET_LIMITS)) || !exactKeys(p.runtime, ["elapsedMs", "stateInsertions", "work", "outputBytes"])) return false;
    const run = budget(p.limits); if (p.status !== "COMPLETE" && p.status !== "PARTIAL") return false;
    if (p.rows.length > run.limits.maxRows) return false;
    if (p.status === "COMPLETE" ? p.reason !== null || p.pending !== null || p.rows.length !== 6 : !["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "WORK_LIMIT", "OUTPUT_LIMIT"].includes(p.reason!)) return false;
    if (p.status === "PARTIAL") { if (p.pending?.phase === "ROW") { const i = p.rows.length, c = DUAL_TARGET_INPUTS.controls[i]; if (!c || p.pending.index !== String(i) || p.pending.p !== c.p || p.pending.h !== c.h) return false; } else if (p.pending?.phase !== "FINALIZE" || p.rows.length !== 6 || p.reason !== "TIME_LIMIT") return false; }
    const receiptRun = budget({ ...p.limits, now: () => 0 });
    for (let i = 0; i < p.rows.length; i++) { const c = DUAL_TARGET_INPUTS.controls[i], expected = produce(Number(c.p), Number(c.h), c.id, receiptRun); if (dualCanonicalJson(p.rows[i]) !== dualCanonicalJson(expected)) return false; }
    if (!Number.isFinite(p.runtime.elapsedMs) || p.runtime.elapsedMs < 0 || Number(p.runtime.work) > run.limits.maxWork || Number(p.runtime.stateInsertions) > run.limits.maxStateInsertions || !/^\d+$/.test(p.runtime.work) || !/^\d+$/.test(p.runtime.stateInsertions)) return false;
    if (p.rows.length && (Number(p.runtime.work) === 0 || Number(p.runtime.stateInsertions) === 0)) return false;
    if (Number(p.runtime.work) < Number(receiptRun.work()) || Number(p.runtime.stateInsertions) < Number(receiptRun.states())) return false;
    if (p.reason === "ROW_LIMIT" && p.rows.length !== run.limits.maxRows || p.reason === "WORK_LIMIT" && Number(p.runtime.work) !== run.limits.maxWork || p.reason === "STATE_LIMIT" && Number(p.runtime.stateInsertions) !== run.limits.maxStateInsertions || p.reason === "TIME_LIMIT" && p.runtime.elapsedMs < run.limits.seconds * 1000) return false;
    if (p.status === "COMPLETE" && p.runtime.elapsedMs >= run.limits.seconds * 1000) return false;
    const cloned = structuredClone(p); sealDualPacket(cloned);
    return p.rowsDigest === cloned.rowsDigest && p.contentDigest === cloned.contentDigest && dualCanonicalJson(p.summary) === dualCanonicalJson(cloned.summary) && p.runtime.outputBytes === String(Buffer.byteLength(JSON.stringify(p))) && Number(p.runtime.outputBytes) <= run.limits.maxOutputBytes;
  } catch { return false; }
}
