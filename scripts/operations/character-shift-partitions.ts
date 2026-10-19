import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Frozen standalone development slice. Importing performs no experiment. */
export const CHARACTER_SHIFT_INPUTS = Object.freeze({
  targets: Object.freeze(["200023321", "200602081", "200656681", "131433121"]),
  shifts: Object.freeze(["3", "7", "11", "19", "23", "31", "43", "47", "59", "67", "71", "79", "83", "103", "107"]),
  preference: "LEGENDRE_P_OVER_H_NEGATIVE" as const,
});
export const CHARACTER_SHIFT_LIMITS = Object.freeze({ seconds: 60, maxRows: 1000,
  maxStateInsertions: 2_000_000, maxOutputBytes: 2_097_152 });
export const CHARACTER_SHIFT_SCOPE = "Four selected exposed development targets; every prime h=3 mod4 up to107, Type II only. Character preference is routing, never QR impossibility. Complete signed images, canonical partitions and miss defects are finite arithmetic evidence, not a universal shift bound, held-out benchmark, root proof or novelty certificate. No agent-cycle authority.";
const B = BigInt, one = B(1), four = B(4);
export type CharacterFactors = Array<[string, string]>;
export type CharacterCanonical = { u: string; v: string; k: string; A: string; x: string; y: string; z: string };
export type CharacterTerm = { residue: number; exponent: number };
export type CharacterDefect = { stabilizer: string[]; size: string; index: string; visibleMass: string; nonresidue: boolean;
  visibleFactors: Array<{ prime: string; exponent: string; residue: string; quotientOrder: string }>;
  conditions: { indexEven: boolean; indexTwoModFour: boolean; nonresidueIndexAtLeastSix: boolean;
    visibleMassBound: boolean; ordersBeyondIntervals: boolean } };
export type CharacterShiftRow = { p: string; h: string; T: string; factors: CharacterFactors; image: string[];
  count: string; hit: boolean; canonical: CharacterCanonical | null; character: { legendre: "-1" | "+1"; preferred: boolean };
  defect: CharacterDefect | null; imageDigest: string; witnessDigest: string | null; defectDigest: string | null; rowDigest: string };
export function characterCanonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(characterCanonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([key, entry]) => `${JSON.stringify(key)}:${characterCanonicalJson(entry)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const characterDigest = (value: unknown) => createHash("sha256").update(characterCanonicalJson(value)).digest("hex");
const gcd = (a: bigint, b: bigint): bigint => { while (b) [a, b] = [b, a % b]; return a; };
const cmp = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;
function bounded(n: unknown, max: number): n is number { return typeof n === "number" && Number.isSafeInteger(n) && n >= 1 && n <= max; }
function prime(n: number, tick: () => void = () => {}) {
  if (!bounded(n, 201_000_000) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) { if (d % 255 === 0) tick(); if (n % d === 0) return false; }
  return true;
}
function groupPrime(h: number) { if (!bounded(h, 107) || !prime(h) || h % 4 !== 3) throw new RangeError("Requires prime h=3 mod4, h<=107"); }
function pow(a: number, e: number, h: number) { let r = 1; for (; e; e = Math.floor(e / 2), a = a * a % h) if (e % 2) r = r * a % h; return r; }
type StopReason = "TIME_LIMIT" | "ROW_LIMIT" | "STATE_LIMIT" | "OUTPUT_LIMIT";
class RunStop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
export type CharacterRunOptions = { now?: () => number; seconds?: number; maxRows?: number; maxStateInsertions?: number; maxOutputBytes?: number };
function budget(options: CharacterRunOptions = {}) {
  const { now = () => performance.now(), ...lowered } = options, limits = { ...CHARACTER_SHIFT_LIMITS, ...lowered };
  for (const key of Object.keys(CHARACTER_SHIFT_LIMITS) as Array<keyof typeof CHARACTER_SHIFT_LIMITS>) {
    if (!Number.isFinite(limits[key]) || limits[key] <= 0 || limits[key] > CHARACTER_SHIFT_LIMITS[key] ||
      (key !== "seconds" && !Number.isSafeInteger(limits[key]))) throw new RangeError("Only tighter finite frozen resources are allowed");
  }
  if (limits.maxOutputBytes < 4096) throw new RangeError("Output budget must fit bounded partial provenance");
  const start = now(); let states = 0;
  const tick = () => { if (now() - start >= limits.seconds * 1000) throw new RunStop("TIME_LIMIT"); };
  const insert = () => { tick(); if (states >= limits.maxStateInsertions) throw new RunStop("STATE_LIMIT"); states++; };
  return { limits, tick, insert, stateCount: () => states, elapsed: () => Math.max(0, Math.round(now() - start)) };
}
type Budget = ReturnType<typeof budget>;
export function validateCharacterFactors(raw: unknown, expected: bigint): asserts raw is CharacterFactors {
  if (!Array.isArray(raw) || raw.length > 16 || typeof expected !== "bigint" || expected < one || expected > B(50_250_027)) throw new RangeError("Bounded exact factor packet");
  let product = one, previous = 1;
  for (const entry of raw) {
    if (!Array.isArray(entry) || entry.length !== 2 || !entry.every((v) => typeof v === "string" && /^[1-9][0-9]{0,8}$/.test(v))) throw new RangeError("Decimal factor records");
    const [q, e] = entry.map(Number);
    if (!prime(q) || q <= previous || !bounded(e, 25)) throw new RangeError("Distinct sorted primes and bounded valuations");
    previous = q; product *= B(q) ** B(e); if (product > expected) throw new RangeError("Factor product exceeds target");
  }
  if (product !== expected) throw new RangeError("Factor product mismatch");
}
function factor(n: number, run: Budget): CharacterFactors {
  if (!bounded(n, 50_250_027)) throw new RangeError("Frozen factor domain");
  let left = n; const factors: CharacterFactors = [];
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) {
    run.tick(); if (left % q) continue;
    let e = 0; while (left % q === 0) { left /= q; e++; } factors.push([String(q), String(e)]);
  }
  if (left > 1) factors.push([String(left), "1"]); validateCharacterFactors(factors, B(n)); return factors;
}
function validateTerms(h: number, terms: readonly CharacterTerm[]) {
  groupPrime(h);
  if (!Array.isArray(terms) || terms.length > 32 || terms.some((t) => !bounded(t.residue, h - 1) || !bounded(t.exponent, 64))) throw new RangeError("Bounded nonzero residue/valuation terms");
}
function imageTerms(h: number, terms: readonly CharacterTerm[], run: Budget) {
  validateTerms(h, terms); let states = new Set([1]); run.insert();
  for (const { residue: r, exponent: e } of terms) {
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => pow(i < e ? pow(r, h - 2, h) : r, Math.abs(i - e), h)), next = new Set<number>();
    for (const s of states) for (const c of choices) { run.tick(); const value = s * c % h; if (!next.has(value)) { run.insert(); next.add(value); } }
    states = next;
  }
  return [...states].sort((a, b) => a - b);
}
export function characterSignedImage(h: number, terms: readonly CharacterTerm[]) { return imageTerms(h, terms, budget()); }
function defect(h: number, terms: readonly CharacterTerm[], image: readonly number[], primes: readonly string[], run: Budget): CharacterDefect | null {
  if (image.includes(h - 1)) return null;
  const set = new Set(image), H: number[] = [];
  for (let r = 1; r < h; r++) { run.tick(); if (image.every((s) => set.has(s * r % h))) H.push(r); }
  const index = (h - 1) / H.length, subgroup = new Set(H);
  const visibleFactors = terms.flatMap(({ residue, exponent }, i) => {
    if (subgroup.has(residue)) return [];
    let quotientOrder = 1, value = residue;
    while (!subgroup.has(value)) { run.tick(); value = value * residue % h; quotientOrder++; if (quotientOrder > h - 1) throw new Error("Finite quotient order failure"); }
    return [{ prime: primes[i], exponent: String(exponent), residue: String(residue), quotientOrder: String(quotientOrder) }];
  });
  const V = visibleFactors.reduce((sum, f) => sum + Number(f.exponent), 0), nonresidue = terms.some((t) => pow(t.residue, (h - 1) / 2, h) === h - 1);
  return { stabilizer: H.map(String), size: String(H.length), index: String(index), visibleMass: String(V), nonresidue, visibleFactors,
    conditions: { indexEven: index % 2 === 0, indexTwoModFour: index % 4 === 2,
      nonresidueIndexAtLeastSix: !nonresidue || index >= 6, visibleMassBound: 2 * V <= index - 2,
      ordersBeyondIntervals: visibleFactors.every((f) => Number(f.quotientOrder) > 2 * Number(f.exponent) + 1) } };
}
/** Abstract group helper: validates the supplied complete image, not just a subgroup. */
export function generalPrimeDefect(h: number, terms: readonly CharacterTerm[], image?: readonly number[]) {
  const run = budget(), expected = imageTerms(h, terms, run);
  if (image && (!Array.isArray(image) || image.length > h - 1 || characterCanonicalJson(image) !== characterCanonicalJson(expected))) throw new RangeError("Exact complete signed image binding");
  return defect(h, terms, expected, terms.map((t) => String(t.residue)), run);
}
/** Ordered numeric-lex DP: never sort an intermediate pair and invert its ratio. */
function factorImage(h: number, factors: CharacterFactors, run: Budget) {
  let states = new Map<number, { u: bigint; v: bigint }>([[1, { u: one, v: one }]]); run.insert();
  for (const [qText, eText] of factors) {
    const q = B(qText), r = Number(q % B(h)), e = Number(eText), next = new Map<number, { u: bigint; v: bigint }>();
    if (!r) throw new RangeError("Factored integer not coprime to shift");
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => { const z = i - e, power = q ** B(Math.abs(z));
      return { residue: pow(z < 0 ? pow(r, h - 2, h) : r, Math.abs(z), h), u: z > 0 ? power : one, v: z < 0 ? power : one }; });
    for (const [residue, pair] of states) for (const choice of choices) {
      run.tick(); const target = residue * choice.residue % h, candidate = { u: pair.u * choice.u, v: pair.v * choice.v }, previous = next.get(target);
      if (!previous) { run.insert(); next.set(target, candidate); }
      else if (candidate.u < previous.u || candidate.u === previous.u && candidate.v < previous.v) next.set(target, candidate);
    }
    states = next;
  }
  return { image: [...states.keys()].sort((a, b) => a - b), pair: states.get(h - 1) ?? null };
}
export function reconstructCharacterWitness(p: bigint, h: bigint, T: bigint, u: bigint, v: bigint): CharacterCanonical {
  if (![p, h, T, u, v].every((n) => typeof n === "bigint" && n > B(0) && n.toString().length <= 10) || p > B(201_000_000) ||
    !prime(Number(p)) || p % B(840) !== one || p <= h || !CHARACTER_SHIFT_INPUTS.shifts.includes(String(h)) ||
    (p + h) % four || four * T !== p + h || gcd(T, h) !== one || u > v || gcd(u, v) !== one || T % (u * v) || (u + v) % h) throw new RangeError("Exact residual shifted Type-II witness binding");
  const A = (u + v) / h, k = T / (u * v), ds = [T, A * p * u * k, A * p * v * k].sort(cmp);
  if (!(ds[0] < ds[1] && ds[1] < ds[2]) || ds.filter((d) => d % p === B(0)).length !== 2 ||
    four * ds[0] * ds[1] * ds[2] !== p * (ds[0] * ds[1] + ds[1] * ds[2] + ds[2] * ds[0])) throw new Error("Strict Type-II identity failure");
  return { u: String(u), v: String(v), k: String(k), A: String(A), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
}
export class CharacterCandidateContradictionError extends Error {
  readonly row: CharacterShiftRow;
  constructor(row: CharacterShiftRow) { super("General-prime defect candidate contradicts exact image");
    if (Buffer.byteLength(JSON.stringify(row), "utf8") > 65536) throw new RangeError("Bounded contradiction diagnostic"); this.row = structuredClone(row); }
}
export function assertCharacterCandidate(row: CharacterShiftRow) {
  if (!row.hit && (!row.defect || Object.values(row.defect.conditions).some((v) => !v)) ||
    row.hit && row.defect !== null || row.character.preferred && !row.hit && !row.defect?.nonresidue) throw new CharacterCandidateContradictionError(row);
}
function row(p: number, h: number, run: Budget): CharacterShiftRow {
  if (!bounded(p, 201_000_000) || p % 840 !== 1 || !prime(p, run.tick) || !CHARACTER_SHIFT_INPUTS.shifts.includes(String(h)) || p <= h || (p + h) % 4) throw new RangeError("Frozen prime-residual shifted domain");
  const T = (p + h) / 4, factors = factor(T, run), result = factorImage(h, factors, run), terms = factors.map(([q, e]) => ({ residue: Number(B(q) % B(h)), exponent: Number(e) }));
  const canonical = result.pair ? reconstructCharacterWitness(B(p), B(h), B(T), result.pair.u, result.pair.v) : null;
  const certificate = defect(h, terms, result.image, factors.map(([q]) => q), run), preferred = pow(p % h, (h - 1) / 2, h) === h - 1;
  const body = { p: String(p), h: String(h), T: String(T), factors, image: result.image.map(String), count: String(result.image.length), hit: canonical !== null,
    canonical, character: { legendre: preferred ? "-1" as const : "+1" as const, preferred }, defect: certificate,
    imageDigest: characterDigest(result.image.map(String)), witnessDigest: canonical ? characterDigest(canonical) : null, defectDigest: certificate ? characterDigest(certificate) : null };
  const resultRow = { ...body, rowDigest: characterDigest(body) }; assertCharacterCandidate(resultRow); return resultRow;
}
export function characterShiftRow(p: number, h: number) { return row(p, h, budget()); }
export function characterRouting(rows: readonly CharacterShiftRow[]) {
  return CHARACTER_SHIFT_INPUTS.targets.map((p) => { const selected = rows.filter((r) => r.p === p), preferred = selected.filter((r) => r.character.preferred), hits = selected.filter((r) => r.hit);
    return { p, complete: selected.length === CHARACTER_SHIFT_INPUTS.shifts.length, preferredShifts: preferred.map((r) => r.h),
      smallestSuccessfulFull: hits[0]?.h ?? null, smallestSuccessfulPreferred: hits.find((r) => r.character.preferred)?.h ?? null,
      hitRows: String(hits.length), preferredHitRows: String(hits.filter((r) => r.character.preferred).length) }; });
}
export type CharacterPending = { phase: "ROW" | "FINALIZE"; p?: string; h?: string };
export function characterShiftPacket(options: CharacterRunOptions = {}) {
  const run = budget(options), rows: CharacterShiftRow[] = []; let pending: CharacterPending | null = { phase: "ROW", p: CHARACTER_SHIFT_INPUTS.targets[0], h: CHARACTER_SHIFT_INPUTS.shifts[0] }, reason: StopReason | null = null;
  let rowBytes = 2;
  try {
    for (const p of CHARACTER_SHIFT_INPUTS.targets) for (const h of CHARACTER_SHIFT_INPUTS.shifts) {
      pending = { phase: "ROW", p, h }; run.tick(); if (rows.length >= run.limits.maxRows) throw new RunStop("ROW_LIMIT");
      const next = row(Number(p), Number(h), run), bytes = Buffer.byteLength(characterCanonicalJson(next), "utf8") + 1;
      if (rowBytes + bytes + 4096 > run.limits.maxOutputBytes) throw new RunStop("OUTPUT_LIMIT"); rows.push(next); rowBytes += bytes;
    }
    pending = { phase: "FINALIZE" }; run.tick(); pending = null;
  } catch (error) { if (!(error instanceof RunStop)) throw error; reason = error.reason; }
  const routing = characterRouting(rows), invariant = { inputs: CHARACTER_SHIFT_INPUTS, shiftManifestDigest: characterDigest(CHARACTER_SHIFT_INPUTS.shifts), rows,
    rowsDigest: characterDigest(rows), routing, routingDigest: characterDigest(routing) };
  const body = { method: "ERDOS_STRAUS_CHARACTER_SHIFT_DEFECTS_V1" as const, status: reason ? "PARTIAL" as const : "COMPLETE" as const,
    ...invariant, limits: run.limits, pending, reason, scope: CHARACTER_SHIFT_SCOPE, contentDigest: characterDigest(invariant),
    runtime: { stateInsertions: String(run.stateCount()), elapsedMs: String(run.elapsed()), outputBytes: "0" } };
  const seal = () => { let packet = { ...body, packetDigest: characterDigest(body) };
    for (let i = 0; i < 8; i++) { const bytes = String(Buffer.byteLength(JSON.stringify(packet), "utf8")); if (bytes === packet.runtime.outputBytes) break;
      body.runtime.outputBytes = bytes; packet = { ...body, packetDigest: characterDigest(body) }; } return packet; };
  let packet = seal(); body.runtime.elapsedMs = String(run.elapsed()); packet = seal();
  try { if (body.status === "COMPLETE") run.tick(); }
  catch (error) { if (!(error instanceof RunStop)) throw error; body.status = "PARTIAL"; body.reason = error.reason; body.pending = { phase: "FINALIZE" }; body.runtime.elapsedMs = String(run.elapsed()); packet = seal(); }
  if (Number(packet.runtime.outputBytes) > run.limits.maxOutputBytes) throw new Error("No oversized partial provenance emitted"); return packet;
}
export type CharacterShiftPacket = ReturnType<typeof characterShiftPacket>;
