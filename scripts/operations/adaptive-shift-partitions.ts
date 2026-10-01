import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";

/** Standalone frozen research experiment. Importing this module does no work. */
export const ADAPTIVE_SHIFT_INPUTS = Object.freeze({
  interval: Object.freeze({ lowerExclusive: "200000000", upperInclusive: "201000000", residue: "1", modulus: "840" }),
  warmups: Object.freeze(["131433121", "159727681", "351121", "171348241"]),
  shifts: Object.freeze(["7", "11", "23", "47", "59", "83", "107"]), separateControl: "19",
});
export const ADAPTIVE_SHIFT_LIMITS = Object.freeze({ seconds: 60, maxRows: 10_000,
  maxStateInsertions: 2_000_000, maxOutputBytes: 2_097_152 });
export const ADAPTIVE_SHIFT_SCOPE = "Frozen public development interval and four exposed warmups; seven fixed safe-prime shifts, Type II only. Complete images and canonical coprime partitions are finite arithmetic evidence, not an exhaustive shift menu, a root proof, held-out benchmark or novelty certificate. p19 is a separate wrong-domain and historical h1 control. No agent-cycle authority.";
const B = BigInt, one = B(1), four = B(4);
type Pair = { u: bigint; v: bigint };
export type ShiftFactors = Array<[string, string]>;
export type ShiftCanonical = { u: string; v: string; k: string; A: string; x: string; y: string; z: string };
export type ShiftCandidate = { ell: string; weight: string; nonresidue: boolean; minusOneFactor: boolean;
  thresholdApplicable: boolean; boundaryApplicable: boolean; inversePairPrimitive: boolean | null; predictedHit: boolean | null };
export type AdaptiveShiftRow = { p: string; h: string; T: string; factors: ShiftFactors; image: string[];
  count: string; hit: boolean; canonical: ShiftCanonical | null; candidate: ShiftCandidate;
  imageDigest: string; witnessDigest: string | null; rowDigest: string };
export class ShiftCandidateContradictionError extends Error {
  readonly row: AdaptiveShiftRow;
  constructor(row: AdaptiveShiftRow) {
    super("Structural candidate disagrees with the exact shifted-factor image");
    if (Buffer.byteLength(JSON.stringify(row), "utf8") > 65536) throw new RangeError("Contradiction diagnostic row exceeds bounded output");
    this.row = structuredClone(row);
  }
}
/** Contradiction is retained as a diagnostic, never a normal COMPLETE packet. */
export function assertShiftCandidate(row: AdaptiveShiftRow): void {
  if (row.candidate.predictedHit !== null && row.candidate.predictedHit !== row.hit) throw new ShiftCandidateContradictionError(row);
}
export type ShiftPending = { phase: "PRIME_SCAN" | "GROUP_CONTROLS" | "ROW" | "FINALIZE"; p?: string; h?: string };
export function shiftCanonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(shiftCanonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([key, entry]) => `${JSON.stringify(key)}:${shiftCanonicalJson(entry)}`).join(",")}}`;
  return JSON.stringify(value);
}
export const shiftDigest = (value: unknown) => createHash("sha256").update(shiftCanonicalJson(value)).digest("hex");
const gcd = (a: bigint, b: bigint): bigint => { while (b) [a, b] = [b, a % b]; return a; };
const cmp = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;
function boundedInteger(n: unknown, max: number): n is number { return typeof n === "number" && Number.isSafeInteger(n) && n >= 1 && n <= max; }
function prime(n: number, tick: () => void = () => {}) {
  if (!boundedInteger(n, 201_000_000) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) { if (d % 255 === 0) tick(); if (n % d === 0) return false; }
  return true;
}
function safePrime(h: number) {
  if (!boundedInteger(h, 107) || !prime(h) || (h - 1) % 4 !== 2 || !prime((h - 1) / 2)) throw new RangeError("Requires safe prime h=2ell+1 with odd prime ell, h<=107");
  return (h - 1) / 2;
}
function pow(a: number, e: number, h: number) { let r = 1; for (; e; e = Math.floor(e / 2), a = a * a % h) if (e % 2) r = r * a % h; return r; }
type StopReason = "TIME_LIMIT" | "ROW_LIMIT" | "STATE_LIMIT" | "OUTPUT_LIMIT";
class RunStop extends Error { constructor(readonly reason: StopReason) { super(reason); } }
export type ShiftRunOptions = { now?: () => number; seconds?: number; maxRows?: number; maxStateInsertions?: number; maxOutputBytes?: number };
function budget(options: ShiftRunOptions = {}) {
  const { now = () => performance.now(), ...lowered } = options;
  const limits = { ...ADAPTIVE_SHIFT_LIMITS, ...lowered };
  for (const key of Object.keys(ADAPTIVE_SHIFT_LIMITS) as Array<keyof typeof ADAPTIVE_SHIFT_LIMITS>) {
    if (!Number.isFinite(limits[key]) || limits[key] <= 0 || limits[key] > ADAPTIVE_SHIFT_LIMITS[key] ||
      (key !== "seconds" && !Number.isSafeInteger(limits[key]))) throw new RangeError("Only tighter finite frozen resources are allowed");
  }
  if (limits.maxOutputBytes < 4096) throw new RangeError("Output budget must fit bounded partial provenance");
  const start = now(); let stateInsertions = 0;
  const tick = () => { if (now() - start >= limits.seconds * 1000) throw new RunStop("TIME_LIMIT"); };
  const insert = () => { tick(); if (stateInsertions >= limits.maxStateInsertions) throw new RunStop("STATE_LIMIT"); stateInsertions++; };
  return { tick, insert, limits, stateCount: () => stateInsertions, elapsed: () => Math.max(0, Math.round(now() - start)) };
}
type Budget = ReturnType<typeof budget>;
function factor(n: number, run: Budget): ShiftFactors {
  if (!boundedInteger(n, 50_250_027)) throw new RangeError("Frozen factor domain");
  let left = n; const factors: ShiftFactors = [];
  for (let q = 2; q * q <= left; q += q === 2 ? 1 : 2) {
    run.tick(); if (left % q) continue;
    let e = 0; while (left % q === 0) { left /= q; e++; }
    factors.push([String(q), String(e)]);
  }
  if (left > 1) factors.push([String(left), "1"]);
  validateFactors(factors, B(n)); return factors;
}
export function validateFactors(raw: unknown, expected: bigint): asserts raw is ShiftFactors {
  if (!Array.isArray(raw) || raw.length > 16 || typeof expected !== "bigint" || expected < one || expected > B(50_250_027)) throw new RangeError("Bounded exact factor packet");
  let product = one, previous = 1;
  for (const entry of raw) {
    if (!Array.isArray(entry) || entry.length !== 2 || !entry.every((v) => typeof v === "string" && /^[1-9][0-9]{0,8}$/.test(v))) throw new RangeError("Decimal factor records");
    const [q, e] = entry.map(Number);
    if (!prime(q) || q <= previous || !boundedInteger(e, 25)) throw new RangeError("Distinct sorted primes and exact bounded exponents");
    previous = q; product *= B(q) ** B(e);
    if (product > expected) throw new RangeError("Factor reconstruction exceeds target");
  }
  if (product !== expected) throw new RangeError("Factor reconstruction mismatch");
}
type ResidueTerm = { residue: number; exponent: number };
function validateTerms(h: number, terms: readonly ResidueTerm[]) {
  safePrime(h);
  if (!Array.isArray(terms) || terms.length > 32 || terms.some((t) => !boundedInteger(t.residue, h - 1) || !boundedInteger(t.exponent, 64))) throw new RangeError("Bounded nonzero residue/valuation terms");
}
function imageTerms(h: number, terms: readonly ResidueTerm[], run: Budget) {
  validateTerms(h, terms); let states = new Set([1]); run.insert();
  for (const { residue: r, exponent: e } of terms) {
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => pow(i < e ? pow(r, h - 2, h) : r, Math.abs(i - e), h));
    const next = new Set<number>();
    for (const current of states) for (const choice of choices) { run.tick(); const value = current * choice % h;
      if (!next.has(value)) { run.insert(); next.add(value); } }
    states = next;
  }
  return [...states].sort((a, b) => a - b);
}
export function signedResidueImage(h: number, terms: readonly ResidueTerm[]) { return imageTerms(h, terms, budget()); }
function inversePair(h: number, terms: readonly ResidueTerm[]) {
  const nonidentity = terms.filter((t) => t.residue !== 1), ell = safePrime(h);
  if (!nonidentity.length || nonidentity.some((t) => t.residue === h - 1 || pow(t.residue, ell, h) !== h - 1)) return false;
  const r = nonidentity[0].residue, inverse = pow(r, h - 2, h);
  return nonidentity.every((t) => t.residue === r || t.residue === inverse);
}
export function shiftedFactorCandidate(h: number, terms: readonly ResidueTerm[]): ShiftCandidate {
  validateTerms(h, terms); const ell = safePrime(h);
  const weight = terms.reduce((sum, t) => sum + (t.residue === 1 ? 0 : t.exponent), 0);
  const nonresidue = terms.some((t) => pow(t.residue, ell, h) === h - 1), minusOneFactor = terms.some((t) => t.residue === h - 1);
  const thresholdApplicable = nonresidue && weight >= ell, boundaryApplicable = nonresidue && weight === ell - 1;
  const inversePairPrimitive = boundaryApplicable ? inversePair(h, terms) : null;
  const predictedHit = minusOneFactor ? true : !nonresidue ? false : thresholdApplicable ? true : boundaryApplicable ? !inversePairPrimitive : null;
  return { ell: String(ell), weight: String(weight), nonresidue, minusOneFactor, thresholdApplicable, boundaryApplicable, inversePairPrimitive, predictedHit };
}
/** Keep the smallest ORDERED pair per residue. Multiplication by each later
 * positive factor preserves lexicographic order. Never sort intermediate pairs:
 * that inverts the residue and breaks the dominance invariant. */
function factorImage(h: number, factors: ShiftFactors, run: Budget) {
  let states = new Map<number, Pair>([[1, { u: one, v: one }]]); run.insert();
  for (const [qText, eText] of factors) {
    const q = B(qText), r = Number(q % B(h)), e = Number(eText), next = new Map<number, Pair>();
    if (!r) throw new RangeError("Shift must be coprime to the factored integer");
    const choices = Array.from({ length: 2 * e + 1 }, (_, i) => { const z = i - e, power = q ** B(Math.abs(z));
      return { residue: pow(z < 0 ? pow(r, h - 2, h) : r, Math.abs(z), h), u: z > 0 ? power : one, v: z < 0 ? power : one }; });
    for (const [residue, pair] of states) for (const choice of choices) {
      run.tick(); const target = residue * choice.residue % h, candidate = { u: pair.u * choice.u, v: pair.v * choice.v }, previous = next.get(target);
      if (!previous) { run.insert(); next.set(target, candidate); }
      else if (candidate.u < previous.u || candidate.u === previous.u && candidate.v < previous.v) next.set(target, candidate);
    }
    states = next;
  }
  return { image: [...states.keys()].sort((a, b) => a - b).map(String), pair: states.get(h - 1) ?? null };
}
export function reconstructShiftWitness(p: bigint, h: bigint, T: bigint, u: bigint, v: bigint): ShiftCanonical {
  if (![p, h, T, u, v].every((n) => typeof n === "bigint" && n > B(0) && n.toString().length <= 10) ||
    p > B(201_000_000) || !prime(Number(p)) || p % B(840) !== one || p <= h ||
    !ADAPTIVE_SHIFT_INPUTS.shifts.includes(String(h)) || (p + h) % four || four * T !== p + h ||
    gcd(T, h) !== one || u > v || gcd(u, v) !== one || T % (u * v) || (u + v) % h) throw new RangeError("Exact residual shifted Type-II witness domain/binding");
  const A = (u + v) / h, k = T / (u * v), ds = [T, A * p * u * k, A * p * v * k].sort(cmp);
  if (!(ds[0] < ds[1] && ds[1] < ds[2]) || ds.filter((d) => d % p === B(0)).length !== 2 ||
    four * ds[0] * ds[1] * ds[2] !== p * (ds[0] * ds[1] + ds[1] * ds[2] + ds[2] * ds[0])) throw new Error("Strict Type-II exact identity failure");
  return { u: String(u), v: String(v), k: String(k), A: String(A), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
}
function row(p: number, h: number, run: Budget): AdaptiveShiftRow {
  if (!boundedInteger(p, 201_000_000) || p % 840 !== 1 || !prime(p, run.tick) ||
    !ADAPTIVE_SHIFT_INPUTS.shifts.includes(String(h)) || p <= h || (p + h) % 4) throw new RangeError("Frozen prime-residual shifted domain");
  const T = (p + h) / 4, factors = factor(T, run), result = factorImage(h, factors, run);
  const candidate = shiftedFactorCandidate(h, factors.map(([q, e]) => ({ residue: Number(B(q) % B(h)), exponent: Number(e) })));
  const canonical = result.pair ? reconstructShiftWitness(B(p), B(h), B(T), result.pair.u, result.pair.v) : null;
  const hit = canonical !== null;
  const body = { p: String(p), h: String(h), T: String(T), factors, image: result.image, count: String(result.image.length), hit,
    canonical, candidate, imageDigest: shiftDigest(result.image), witnessDigest: canonical ? shiftDigest(canonical) : null };
  const resultRow = { ...body, rowDigest: shiftDigest(body) }; assertShiftCandidate(resultRow); return resultRow;
}
export function adaptiveShiftRow(p: number, h: number): AdaptiveShiftRow { return row(p, h, budget()); }
type GroupControl = { h: string; weight: string; profiles: string; applicableProfiles: string; misses: string; classificationMismatches: string; profilesDigest: string };
function controls(run: Budget, completed: GroupControl[] = [], entering: (h: number) => void = () => {}): GroupControl[] {
  for (const h of [7, 11]) {
    entering(h);
    const weight = safePrime(h) - 1, records: Array<{ profile: string[]; image: string[]; nonresidue: boolean; inversePairPrimitive: boolean; predictedHit: boolean; hit: boolean }> = [];
    const visit = (profile: number[], remaining: number) => {
      run.tick(); if (profile.length < h - 3) { for (let count = 0; count <= remaining; count++) visit([...profile, count], remaining - count); return; }
      profile = [...profile, remaining];
      const terms = profile.flatMap((e, i) => e ? [{ residue: i + 2, exponent: e }] : []), image = imageTerms(h, terms, run).map(String);
      const candidate = shiftedFactorCandidate(h, terms), pair = inversePair(h, terms), hit = image.includes(String(h - 1)), predictedHit = candidate.nonresidue && !pair;
      records.push({ profile: profile.map(String), image, nonresidue: candidate.nonresidue, inversePairPrimitive: pair, predictedHit, hit });
    };
    visit([], weight);
    completed.push({ h: String(h), weight: String(weight), profiles: String(records.length), applicableProfiles: String(records.filter((r) => r.nonresidue).length),
      misses: String(records.filter((r) => !r.hit).length), classificationMismatches: String(records.filter((r) => r.hit !== r.predictedHit).length), profilesDigest: shiftDigest(records) });
  }
  return completed;
}
export function adaptiveShiftGroupControls() { return controls(budget()); }
export const ADAPTIVE_SHIFT_SEPARATE_CONTROL = Object.freeze({ p: "19", menuDomain: "NONINTEGER_T", menuRejected: true,
  oldH1Witness: Object.freeze({ h: "1", T: "5", u: "1", v: "5", k: "1", A: "6", x: "5", y: "114", z: "570" }), scope: "OUTSIDE_RESIDUAL_DOMAIN" });
export function adaptiveShiftPacket(options: ShiftRunOptions = {}) {
  const run = budget(options), primes: string[] = [], rows: AdaptiveShiftRow[] = [];
  const groupControls: GroupControl[] = [];
  let scannedThrough = "200000000", pending: ShiftPending | null = { phase: "PRIME_SCAN" }, reason: StopReason | null = null;
  const first = 200_000_000 + ((1 - 200_000_000 % 840 + 840) % 840 || 840);
  let rowBytes = 2;
  try {
    for (let p = first; p <= 201_000_000; p += 840) {
      pending = { phase: "PRIME_SCAN", p: String(p) }; run.tick();
      if (prime(p, run.tick)) primes.push(String(p)); scannedThrough = String(p);
    }
    controls(run, groupControls, (h) => { pending = { phase: "GROUP_CONTROLS", h: String(h) }; });
    const headBytes = Buffer.byteLength(shiftCanonicalJson({ primes, inputs: ADAPTIVE_SHIFT_INPUTS, limits: run.limits,
      separateControl: ADAPTIVE_SHIFT_SEPARATE_CONTROL, groupControls, scope: ADAPTIVE_SHIFT_SCOPE }), "utf8") + 2048;
    for (const p of [...ADAPTIVE_SHIFT_INPUTS.warmups, ...primes]) for (const h of ADAPTIVE_SHIFT_INPUTS.shifts) {
      pending = { phase: "ROW", p, h }; run.tick();
      if (rows.length >= run.limits.maxRows) throw new RunStop("ROW_LIMIT");
      const next = row(Number(p), Number(h), run), nextBytes = Buffer.byteLength(shiftCanonicalJson(next), "utf8") + 1;
      if (rowBytes + nextBytes + headBytes > run.limits.maxOutputBytes) throw new RunStop("OUTPUT_LIMIT");
      rows.push(next); rowBytes += nextBytes;
    }
    pending = { phase: "FINALIZE" }; run.tick(); pending = null;
  } catch (error) { if (!(error instanceof RunStop)) throw error; reason = error.reason; }
  const primeManifestDigest = shiftDigest(primes), rowsDigest = shiftDigest(rows);
  const invariant = { inputs: ADAPTIVE_SHIFT_INPUTS, primes, primeManifestDigest, rows, rowsDigest,
    separateControl: ADAPTIVE_SHIFT_SEPARATE_CONTROL, groupControls };
  const body = { method: "ERDOS_STRAUS_ADAPTIVE_SHIFT_PARTITIONS_V1" as const, status: reason ? "PARTIAL" as const : "COMPLETE" as const,
    ...invariant, limits: run.limits, pending, reason, scannedThrough, scope: ADAPTIVE_SHIFT_SCOPE,
    contentDigest: shiftDigest(invariant), runtime: { stateInsertions: String(run.stateCount()), elapsedMs: String(run.elapsed()), outputBytes: "0" } };
  const seal = () => {
    let packet = { ...body, packetDigest: shiftDigest(body) };
    for (let i = 0; i < 8; i++) { const bytes = String(Buffer.byteLength(JSON.stringify(packet), "utf8")); if (bytes === packet.runtime.outputBytes) break;
      body.runtime.outputBytes = bytes; packet = { ...body, packetDigest: shiftDigest(body) }; }
    return packet;
  };
  let packet = seal();
  body.runtime.elapsedMs = String(run.elapsed()); packet = seal();
  // Digesting and output-byte sealing are part of the run, not work exempt
  // from its deadline. Late finalization retains the completed rows but never
  // labels them a COMPLETE run. Partial diagnostic serialization is not a pass.
  try { if (body.status === "COMPLETE") run.tick(); }
  catch (error) {
    if (!(error instanceof RunStop)) throw error;
    body.status = "PARTIAL"; body.reason = error.reason; body.pending = { phase: "FINALIZE" };
    body.runtime.elapsedMs = String(run.elapsed()); packet = seal();
  }
  if (Number(packet.runtime.outputBytes) > run.limits.maxOutputBytes) throw new Error("Partial provenance exceeds output cap; no oversized retained packet emitted");
  return packet;
}
export type AdaptiveShiftPacket = ReturnType<typeof adaptiveShiftPacket>;
