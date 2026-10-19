import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Inert import: no experiment, network, prior producer or truth oracle. */
export const INERT_DIRECTION_INPUTS = Object.freeze({
  roots: Object.freeze(["200023321", "200602081", "200656681", "131433121", "199000201", "199002721", "199003561", "199006921", "199014481", "199031281", "199035481", "199039681"]),
  shifts: Object.freeze(["3", "7", "11", "19", "23", "31", "43", "47", "59", "67", "71", "79", "83", "103", "107"]),
});
export const INERT_DIRECTION_LIMITS = Object.freeze({ seconds: 60, maxRows: 180, maxStateInsertions: 2_000_000, maxWork: 50_000_000, maxOutputBytes: 8_388_608 });
export const INERT_DIRECTION_SCOPE = "Exposed development roots and prime shifts only; inverse-direction diagnostics concern this coprime-divisor Type II shift, not Erdős–Straus impossibility, Type I, all shifts, novelty or agent authority. UNDETERMINED is not MISS; generated split subgroup is not paid coverage. Asymptotic inert supply has no finite cutoff or hit guarantee.";
export const INERT_DIRECTION_METHOD = "ERDOS_STRAUS_ROOT_COUPLED_INERT_DIRECTION_V1";
export const INERT_DIRECTION_POLICY = "ASCENDING_INERT_GREEDY_WITH_PAID_SPLIT_CORRECTION";
export const INERT_DECISIONS = ["NO_INERT_LOCAL_MISS", "COHERENT_SHORT_LOCAL_MISS", "COHERENT_PAID_SPLIT_HIT", "COHERENT_UNPAID_UNDETERMINED", "INCOHERENT_UNDETERMINED"] as const;
export type InertDecision = typeof INERT_DECISIONS[number];
export type InertFactors = Array<[string, string]>;
export type InertRepresentation = { residue: string; u: string; v: string; exponents: string[] };
export type InertWitness = { rawExponents: string[]; exponents: string[]; orientation: "UNCHANGED" | "WHOLE_INVERTED"; correction: string; u: string; v: string; k: string; A: string; x: string; y: string; z: string };
export type InertDirectionRow = {
  id: string; p: string; h: string; T: string; factors: InertFactors;
  characters: Array<{ prime: string; shiftCharacter: "+1" | "-1"; rootCharacter: "+1" | "-1"; kind: "SPLIT" | "INERT" }>;
  L: string[]; splitImage: InertRepresentation[]; anchor: { prime: string; residue: string; coset: string } | null;
  d: string | null; E: string; ambientIndex: string; coherent: boolean;
  directions: Array<{ prime: string; direction: "+1" | "-1" | null }>;
  splitPaid: boolean; decision: InertDecision; witness: InertWitness | null; rowDigest: string;
};
type StopReason = "TIME_LIMIT" | "ROW_LIMIT" | "STATE_LIMIT" | "WORK_LIMIT" | "OUTPUT_LIMIT";
type Pending = { phase: "ROW"; index: string; p: string; h: string } | { phase: "FINALIZE" } | null;
export type InertOptions = Partial<Record<keyof typeof INERT_DIRECTION_LIMITS, number>> & { now?: () => number; origin?: number };
export type InertDirectionPacket = {
  method: typeof INERT_DIRECTION_METHOD; inputs: typeof INERT_DIRECTION_INPUTS; policy: typeof INERT_DIRECTION_POLICY; scope: string;
  status: "COMPLETE" | "PARTIAL"; reason: StopReason | null; pending: Pending;
  limits: { seconds: number; maxRows: number; maxStateInsertions: number; maxWork: number; maxOutputBytes: number };
  rows: InertDirectionRow[]; summary: { total: string; counts: Record<InertDecision, string> };
  rowsDigest: string; contentDigest: string; runtime: { elapsedMs: number; stateInsertions: string; work: string; outputBytes: string };
};
const B = BigInt, one = B(1), zero = B(0);
export function inertCanonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(inertCanonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, entry]) => `${JSON.stringify(key)}:${inertCanonicalJson(entry)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const inertDigest = (value: unknown) => createHash("sha256").update(inertCanonicalJson(value)).digest("hex");
class RunStop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
function runBudget(options: InertOptions = {}) {
  if (Object.keys(options).some((key) => ![...Object.keys(INERT_DIRECTION_LIMITS), "now", "origin"].includes(key))) throw new RangeError("Unknown resource option");
  const { now = () => performance.now(), origin, ...lowered } = options;
  const limits = { ...INERT_DIRECTION_LIMITS, ...lowered };
  for (const key of Object.keys(INERT_DIRECTION_LIMITS) as Array<keyof typeof INERT_DIRECTION_LIMITS>) {
    if (!Number.isFinite(limits[key]) || limits[key] <= 0 || limits[key] > INERT_DIRECTION_LIMITS[key] || (key !== "seconds" && !Number.isSafeInteger(limits[key]))) throw new RangeError("Only tighter finite frozen resources allowed");
  }
  if (limits.maxOutputBytes < 4096) throw new RangeError("Diagnostic output needs at least4096 bytes");
  const observed = now(), start = origin ?? observed; if (!Number.isFinite(observed) || !Number.isFinite(start) || start > observed) throw new RangeError("Finite nonfuture clock origin required");
  let states = 0, work = 0;
  const tick = () => { if (now() - start >= limits.seconds * 1000) throw new RunStop("TIME_LIMIT"); };
  const pay = () => { tick(); if (work >= limits.maxWork) throw new RunStop("WORK_LIMIT"); work++; };
  const insert = () => { tick(); if (states >= limits.maxStateInsertions) throw new RunStop("STATE_LIMIT"); states++; };
  return { limits, tick, pay, insert, elapsed: () => Math.max(0, Math.round(now() - start)), states: () => String(states), work: () => String(work) };
}
type Run = ReturnType<typeof runBudget>;
function prime(n: number, run: Run) {
  if (!Number.isSafeInteger(n) || n < 2 || n > 201_000_000) return false;
  run.pay(); if (n % 2 === 0) return n === 2;
  for (let q = 3; q * q <= n; q += 2) { run.pay(); if (n % q === 0) return false; } return true;
}
function modPow(a: bigint, e: bigint, m: bigint, run: Run) {
  let r = one; a %= m;
  for (; e > zero; e /= B(2)) { run.pay(); if (e % B(2)) r = r * a % m; a = a * a % m; } return r;
}
function mul(a: number, b: number, h: number, run: Run) { run.pay(); return Number(B(a) * B(b) % B(h)); }
function inverse(a: number, h: number, run: Run) { return Number(modPow(B(a), B(h - 2), B(h), run)); }
function factor(n: number, run: Run): InertFactors {
  let left = n; const factors: InertFactors = [];
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) {
    run.pay(); if (left % q) continue; let e = 0;
    while (left % q === 0) { run.pay(); left /= q; e++; } factors.push([String(q), String(e)]);
  }
  if (left > 1) factors.push([String(left), "1"]); return factors;
}
function subgroup(h: number, residues: number[], run: Run) {
  let members = new Set([1]); run.insert();
  for (const r of residues) {
    const generated = [1]; let x = r;
    while (x !== 1) { run.pay(); generated.push(x); x = mul(x, r, h, run); }
    const next = new Set<number>();
    for (const a of members) for (const b of generated) { const v = mul(a, b, h, run); if (!next.has(v)) { run.insert(); next.add(v); } }
    members = next;
  }
  return [...members].sort((a, b) => a - b);
}
type Rep = { u: bigint; v: bigint; exponents: number[] };
function lesser(a: Rep, b: Rep) { return a.u < b.u || (a.u === b.u && a.v < b.v); }
function splitImage(h: number, factors: InertFactors, indices: number[], run: Run) {
  let image = new Map<number, Rep>([[1, { u: one, v: one, exponents: factors.map(() => 0) }]]); run.insert();
  for (const i of indices) {
    const [q, e] = factors[i].map(Number), r = q % h, ri = inverse(r, h, run), next = new Map<number, Rep>();
    for (let z = -e; z <= e; z++) {
      const residue = Number(modPow(B(z < 0 ? ri : r), B(Math.abs(z)), B(h), run)), power = B(q) ** B(Math.abs(z));
      for (const [s, rep] of image) {
        const value = mul(s, residue, h, run), exponents = [...rep.exponents]; exponents[i] = z;
        const candidate = { u: rep.u * (z > 0 ? power : one), v: rep.v * (z < 0 ? power : one), exponents };
        const old = next.get(value); if (!old || lesser(candidate, old)) { if (!old) run.insert(); next.set(value, candidate); }
      }
    }
    image = next;
  }
  return image;
}
function gcd(a: bigint, b: bigint): bigint { while (b !== zero) [a, b] = [b, a % b]; return a; }
function pair(factors: InertFactors, exponents: number[]) {
  let u = one, v = one;
  for (let i = 0; i < factors.length; i++) { const z = exponents[i], e = Number(factors[i][1]); if (!Number.isSafeInteger(z) || Math.abs(z) > e) throw new Error("Illegal valuation reuse"); const q = B(factors[i][0]); if (z > 0) u *= q ** B(z); else v *= q ** B(-z); }
  return { u, v };
}
export function validateInertWitness(p: string, h: string, T: string, factors: InertFactors, witness: InertWitness): boolean {
  try {
    if (witness.rawExponents.length !== factors.length || witness.exponents.length !== factors.length) return false;
    const raw = witness.rawExponents.map(Number), z = witness.exponents.map(Number), rawPair = pair(factors, raw);
    const flip = rawPair.u > rawPair.v;
    if (witness.orientation !== (flip ? "WHOLE_INVERTED" : "UNCHANGED") || z.some((v, i) => v !== (flip ? -raw[i] : raw[i]))) return false;
    const { u, v } = pair(factors, z), pp = B(p), hh = B(h), tt = B(T), k = tt / (u * v), A = (u + v) / hh;
    if (u > v || gcd(u, v) !== one || tt % (u * v) !== zero || (u + v) % hh !== zero || A <= zero || k <= zero) return false;
    const ds = [tt, A * pp * u * k, A * pp * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    if (ds.some((v) => v <= zero) || ds[0] >= ds[1] || ds[1] >= ds[2] || ds.filter((v) => v % pp === zero).length !== 2) return false;
    const [x, y, zz] = ds;
    return B(4) * x * y * zz === pp * (x * y + x * zz + y * zz) && [u, v, k, A, x, y, zz].map(String).every((value, i) => value === [witness.u, witness.v, witness.k, witness.A, witness.x, witness.y, witness.z][i]);
  } catch { return false; }
}
function witnessFor(p: number, h: number, T: number, factors: InertFactors, raw: number[], correction: number): InertWitness {
  const original = pair(factors, raw), flip = original.u > original.v, exponents = raw.map((z) => flip ? -z : z), { u, v } = pair(factors, exponents), k = B(T) / (u * v), A = (u + v) / B(h);
  const ds = [B(T), A * B(p) * u * k, A * B(p) * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  const witness: InertWitness = { rawExponents: raw.map(String), exponents: exponents.map(String), orientation: flip ? "WHOLE_INVERTED" : "UNCHANGED", correction: String(correction), u: String(u), v: String(v), k: String(k), A: String(A), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
  if (!validateInertWitness(String(p), String(h), String(T), factors, witness)) throw new Error("Strict witness invariant failure"); return witness;
}
function directionData(h: number, factors: InertFactors, split: number[], inert: number[], L: number[], run: Run) {
  const coset = (r: number) => Math.min(...L.map((l) => mul(r, l, h, run)));
  const E = inert.reduce((s, i) => s + Number(factors[i][1]), 0);
  if (!inert.length) return { anchor: null, d: null, E, coherent: true, directions: [] as InertDirectionRow["directions"] };
  const i = inert[0], r = Number(factors[i][0]) % h, anchor = { prime: factors[i][0], residue: String(r), coset: String(coset(r)) }, a = Number(anchor.coset), ai = coset(inverse(r, h, run));
  let d = 1, value = r; const group = new Set(L);
  while (!group.has(value)) { value = mul(value, r, h, run); d++; if (d > h - 1) throw new Error("Quotient order invariant"); }
  if (d % 4 !== 2 || L.length % 2 !== 1 || split.length > factors.length) throw new Error("Character quotient invariant");
  const directions = inert.map((j) => { const c = coset(Number(factors[j][0]) % h); return { prime: factors[j][0], direction: c === a ? "+1" as const : c === ai ? "-1" as const : null }; });
  return { anchor, d, E, coherent: directions.every((v) => v.direction !== null), directions };
}
function produceRow(p: number, h: number, id: string, run: Run): InertDirectionRow {
  if (!prime(p, run) || p % 840 !== 1 || !prime(h, run) || h % 4 !== 3 || h >= p || h > 107) throw new RangeError("Frozen residual prime/prime shift domain");
  const T = (p + h) / 4, factors = factor(T, run), split: number[] = [], inert: number[] = [];
  const characters = factors.map(([q], i) => {
    const qq = Number(q), shift = modPow(B(qq), B((h - 1) / 2), B(h), run), root = qq === 2 ? (p % 8 === 1 || p % 8 === 7 ? one : B(p - 1)) : modPow(B(p), B((qq - 1) / 2), B(qq), run);
    const shiftCharacter = shift === one ? "+1" as const : "-1" as const, rootCharacter = root === one ? "+1" as const : "-1" as const;
    if (shift !== one && shift !== B(h - 1)) throw new Error("Shift character zero");
    if (qq !== 2 && root !== one && root !== B(qq - 1)) throw new Error("Root character zero");
    if (shiftCharacter !== rootCharacter) throw new Error("Root coupling failure");
    (shiftCharacter === "+1" ? split : inert).push(i);
    return { prime: q, shiftCharacter, rootCharacter, kind: shiftCharacter === "+1" ? "SPLIT" as const : "INERT" as const };
  });
  const L = subgroup(h, split.map((i) => Number(factors[i][0]) % h), run), image = splitImage(h, factors, split, run), splitPaid = image.size === L.length;
  const data = directionData(h, factors, split, inert, L, run);
  let decision: InertDecision, witness: InertWitness | null = null;
  if (!inert.length) decision = "NO_INERT_LOCAL_MISS";
  else if (!data.coherent) decision = "INCOHERENT_UNDETERMINED";
  else if (data.E < data.d! / 2) decision = "COHERENT_SHORT_LOCAL_MISS";
  else if (!splitPaid) decision = "COHERENT_UNPAID_UNDETERMINED";
  else {
    decision = "COHERENT_PAID_SPLIT_HIT"; let remaining = data.d! / 2, product = 1; const raw = factors.map(() => 0);
    for (let j = 0; j < inert.length; j++) {
      const i = inert[j], e = Number(factors[i][1]), x = Math.max(-e, Math.min(e, remaining)), z = data.directions[j].direction === "+1" ? x : -x;
      raw[i] = z; remaining -= x; const r = Number(factors[i][0]) % h;
      product = mul(product, Number(modPow(B(z < 0 ? inverse(r, h, run) : r), B(Math.abs(z)), B(h), run)), h, run);
    }
    if (remaining !== 0) throw new Error("Greedy allocation invariant");
    const correction = mul(h - 1, inverse(product, h, run), h, run), rep = image.get(correction);
    if (!rep) throw new Error("Unpaid split correction");
    for (const i of split) raw[i] = rep.exponents[i]; witness = witnessFor(p, h, T, factors, raw, correction);
  }
  const row = { id, p: String(p), h: String(h), T: String(T), factors, characters, L: L.map(String), splitImage: [...image].sort(([a], [b]) => a - b).map(([r, v]) => ({ residue: String(r), u: String(v.u), v: String(v.v), exponents: v.exponents.map(String) })), anchor: data.anchor, d: data.d === null ? null : String(data.d), E: String(data.E), ambientIndex: String((h - 1) / L.length), coherent: data.coherent, directions: data.directions, splitPaid, decision, witness };
  return { ...row, rowDigest: inertDigest(row) };
}
export function inertDirectionRow(p: number, h: number, options: InertOptions = {}) { return produceRow(p, h, `EXPLORATORY_${p}_${h}`, runBudget(options)); }
export function sealInertPacket(packet: InertDirectionPacket): InertDirectionPacket {
  const counts = Object.fromEntries(INERT_DECISIONS.map((key) => [key, String(packet.rows.filter((r) => r.decision === key).length)])) as Record<InertDecision, string>;
  packet.summary = { total: String(packet.rows.length), counts }; packet.rowsDigest = inertDigest(packet.rows);
  packet.contentDigest = inertDigest({ method: packet.method, inputs: packet.inputs, policy: packet.policy, scope: packet.scope, rows: packet.rows, summary: packet.summary });
  for (let i = 0; i < 8; i++) { const bytes = String(Buffer.byteLength(JSON.stringify(packet), "utf8")); if (bytes === packet.runtime.outputBytes) break; packet.runtime.outputBytes = bytes; } return packet;
}
export function inertDirectionPacket(options: InertOptions = {}): InertDirectionPacket {
  const run = runBudget(options), rows: InertDirectionRow[] = []; let reason: StopReason | null = null, pending: Pending = null;
  try {
    for (let i = 0; i < 180; i++) {
      const p = INERT_DIRECTION_INPUTS.roots[Math.floor(i / 15)], h = INERT_DIRECTION_INPUTS.shifts[i % 15]; pending = { phase: "ROW", index: String(i), p, h };
      run.tick(); if (rows.length >= run.limits.maxRows) throw new RunStop("ROW_LIMIT");
      const row = produceRow(Number(p), Number(h), `P${Math.floor(i / 15)}_h${h}`, run); run.tick(); rows.push(row);
    }
    pending = { phase: "FINALIZE" }; run.tick(); pending = null;
  } catch (error) { if (!(error instanceof RunStop)) throw error; reason = error.reason; }
  const packet: InertDirectionPacket = { method: INERT_DIRECTION_METHOD, inputs: INERT_DIRECTION_INPUTS, policy: INERT_DIRECTION_POLICY, scope: INERT_DIRECTION_SCOPE, status: reason ? "PARTIAL" : "COMPLETE", reason, pending, limits: run.limits, rows, summary: { total: "0", counts: {} as Record<InertDecision, string> }, rowsDigest: "", contentDigest: "", runtime: { elapsedMs: run.elapsed(), stateInsertions: run.states(), work: run.work(), outputBytes: "0" } };
  sealInertPacket(packet);
  while (Number(packet.runtime.outputBytes) > run.limits.maxOutputBytes && rows.length) {
    rows.pop(); const i = rows.length; packet.status = "PARTIAL"; packet.reason = "OUTPUT_LIMIT"; packet.pending = { phase: "ROW", index: String(i), p: INERT_DIRECTION_INPUTS.roots[Math.floor(i / 15)], h: INERT_DIRECTION_INPUTS.shifts[i % 15] }; sealInertPacket(packet);
  }
  packet.runtime.elapsedMs = run.elapsed(); sealInertPacket(packet);
  try { run.tick(); } catch (error) { if (!(error instanceof RunStop)) throw error; if (packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = error.reason; packet.pending = { phase: "FINALIZE" }; } }
  packet.runtime.elapsedMs = run.elapsed(); sealInertPacket(packet);
  if (Number(packet.runtime.outputBytes) > run.limits.maxOutputBytes) throw new RangeError("Output cap cannot fit diagnostic envelope");
  // A last synchronous seal is not hard preemption; observe and fail closed.
  if (run.elapsed() >= run.limits.seconds * 1000 && packet.status === "COMPLETE") { packet.status = "PARTIAL"; packet.reason = "TIME_LIMIT"; packet.pending = { phase: "FINALIZE" }; packet.runtime.elapsedMs = run.elapsed(); sealInertPacket(packet); }
  return packet;
}

/** Proof-only additive cyclic control. Never used to select campaign rows. */
export function abstractInertDirection(order: number, split: Array<[number, number]>, inert: Array<[number, number]>) {
  if (!Number.isSafeInteger(order) || order < 2 || order > 200 || order % 4 !== 2 || split.length + inert.length > 16 || [...split, ...inert].some(([r, e]) => !Number.isInteger(r) || r < 0 || r >= order || !Number.isInteger(e) || e < 1 || e > 32) || split.some(([r]) => r % 2 !== 0) || inert.some(([r]) => r % 2 !== 1)) throw new RangeError("Abstract cyclic character domain");
  const mod = (x: number) => (x % order + order) % order;
  const closure = new Set([0]); for (const [r] of split) { const old = [...closure]; for (const v of old) for (let j = 0; j < order; j++) closure.add(mod(v + j * r)); }
  let image = new Set([0]); for (const [r, e] of split) { const next = new Set<number>(); for (const v of image) for (let z = -e; z <= e; z++) next.add(mod(v + z * r)); image = next; }
  if (!inert.length) return { L: [...closure].sort((a, b) => a - b), splitPaid: image.size === closure.size, d: null, ambientIndex: order / closure.size, E: 0, coherent: true, directions: [], decision: "NO_INERT_LOCAL_MISS" as InertDecision };
  const a = inert[0][0], coset = (r: number) => Math.min(...[...closure].map((v) => mod(v + r))), ap = coset(a), am = coset(-a);
  let d = 1; while (!closure.has(mod(d * a))) d++;
  const directions = inert.map(([r]) => coset(r) === ap ? 1 : coset(r) === am ? -1 : 0), coherent = directions.every(Boolean), E = inert.reduce((s, [, e]) => s + e, 0), splitPaid = image.size === closure.size;
  const decision: InertDecision = !coherent ? "INCOHERENT_UNDETERMINED" : E < d / 2 ? "COHERENT_SHORT_LOCAL_MISS" : !splitPaid ? "COHERENT_UNPAID_UNDETERMINED" : "COHERENT_PAID_SPLIT_HIT";
  return { L: [...closure].sort((a, b) => a - b), splitPaid, d, ambientIndex: order / closure.size, E, coherent, directions, decision };
}
