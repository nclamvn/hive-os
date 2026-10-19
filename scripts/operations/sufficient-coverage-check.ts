import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";

const targets = ["200023321", "200602081", "200656681", "131433121"], shifts = [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107];
const composites = [["r0", "200023321", "1595931"], ["r1", "200023321", "183"], ["r2", "200023321", "3000351"], ["r3", "200602081", "25075263"],
  ["r4", "200602081", "2550027"], ["r5", "200602081", "4227"], ["r6", "200602081", "247047"], ["r7", "200656681", "68127"],
  ["r10", "131433121", "7179"], ["r11", "131433121", "19714971"], ["r13", "200656681", "206439"]];
export const SUFFICIENT_COVERAGE_INPUTS = { rows: [
  ...targets.flatMap((p, i) => shifts.map(m => ({ id: `P${i}_h${m}`, p, m: String(m), source: "TIP037", sourceRowId: `${p}:${m}` }))),
  ...composites.map(([rid, p, m]) => ({ id: `C_${rid}`, p, m, source: "TIP039", sourceRowId: rid })),
], sourceContentDigests: { TIP037: "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",
  TIP039: "ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e" }, policy: "ASCENDING_SINGLE_FACTOR_CHAIN_THEN_UNORDERED_SUPPORT_ENERGY_V1" };
export const SUFFICIENT_COVERAGE_LIMITS = { seconds: 60, maxRows: 71, maxStateInsertions: 2000000, maxWorkSteps: 50000000, maxOutputBytes: 2097152 };
export const SUFFICIENT_COVERAGE_SCOPE = "FIXED_71_EXPOSED_ROWS_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM";
export const sufficientCoverageHash = (v: unknown) => createHash("sha256").update(canonicalJson(v)).digest("hex");
const dec = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), pos = z.string().regex(/^[1-9][0-9]{0,29}$/), signed = z.string().regex(/^(0|-?[1-9][0-9]{0,2})$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^(P[0-3]_h[1-9][0-9]{0,2}|C_r(0|[1-9][0-9]{0,2}))$/), vectorSchema = z.array(signed).max(16), factorsSchema = z.array(z.tuple([pos, pos])).max(16);
const entrySchema = z.object({ residue: pos, exponents: vectorSchema }).strict();
const stageSchema = z.object({ factorIndex: dec, prime: pos, exponent: pos, relativeOrder: pos, previousCoveredDigest: hash,
  covered: z.array(entrySchema).min(1).max(2000000), stageDigest: hash }).strict();
const halfSchema = z.object({ factorIndices: z.array(dec).min(1).max(16), N: pos, E: pos, L: pos,
  frequencies: z.array(z.object({ coset: pos, mu: pos, u: pos, v: pos, residue: pos, exponents: vectorSchema }).strict()).min(1).max(2000000) }).strict();
const attemptSchema = z.object({ mask: pos, A: halfSchema, B: halfSchema, quotientOrder: pos, sufficient: z.boolean(), attemptDigest: hash }).strict();
const witnessSchema = z.object({ u: pos, v: pos, k: pos, A: pos, x: pos, y: pos, z: pos }).strict();
const certCommon = { exponents: vectorSchema, orientation: z.enum(["AS_CONSTRUCTED", "INVERTED"]), witness: witnessSchema };
const certSchema = z.discriminatedUnion("kind", [z.object({ kind: z.literal("CHAIN"), ...certCommon }).strict(), z.object({ kind: z.literal("ENERGY"), partitionMask: pos,
  match: z.object({ cosetA: pos, cosetB: pos, exponentsA: vectorSchema, exponentsB: vectorSchema, liftResidue: pos, liftExponents: vectorSchema }).strict(), ...certCommon }).strict()]);
const statusSchema = z.enum(["CHAIN_CERTIFIED", "ENERGY_CERTIFIED", "NOT_CERTIFIED"]);
const rowSchema = z.object({ id, p: pos, m: pos, T: pos, groupOrder: pos, factors: factorsSchema,
  chain: z.object({ stages: z.array(stageSchema).max(16), consumed: z.array(dec).max(16), unused: z.array(dec).max(16), covered: z.array(entrySchema).min(1).max(2000000) }).strict(),
  attempts: z.array(attemptSchema).max(32767), allocation: z.object({ totalPartitions: dec, evaluatedPartitions: dec, notEvaluatedPartitions: dec }).strict(),
  status: statusSchema, certificate: certSchema.nullable(), rowDigest: hash }).strict();
const summarySchema = z.object({ complete: z.boolean(), counts: z.object({ CHAIN_CERTIFIED: dec, ENERGY_CERTIFIED: dec, NOT_CERTIFIED: dec }).strict() }).strict();
export const sufficientCoveragePacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_SUFFICIENT_COVERAGE_V1"), status: z.enum(["COMPLETE", "PARTIAL"]), inputs: z.unknown(),
  limits: z.object({ seconds: z.number().positive().max(60), maxRows: z.number().int().positive().max(71), maxStateInsertions: z.number().int().positive().max(2000000),
    maxWorkSteps: z.number().int().positive().max(50000000), maxOutputBytes: z.number().int().min(8192).max(2097152) }).strict(),
  rows: z.array(rowSchema).max(71), rowsDigest: hash, summary: summarySchema, contentDigest: hash,
  pending: z.object({ phase: z.enum(["ROW", "FINALIZE"]), id: id.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "WORK_LIMIT", "OUTPUT_LIMIT", "REPLAY_TIME_LIMIT", "REPLAY_PAIR_LIMIT"]).nullable(), scope: z.literal(SUFFICIENT_COVERAGE_SCOPE),
  runtime: z.object({ stateInsertions: dec, workSteps: dec, elapsedMs: dec, outputBytes: dec, pairChecks: dec.optional() }).strict(), packetDigest: hash }).strict();
export type SufficientCoveragePacket = z.infer<typeof sufficientCoveragePacketSchema>;
type Row = SufficientCoveragePacket["rows"][number]; type Entry = Row["chain"]["covered"][number]; type Half = Row["attempts"][number]["A"];
const B = BigInt, zero = B(0), one = B(1), two = B(2);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
function prime(n: number) { if (!Number.isSafeInteger(n) || n < 2 || n > 201000000) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function primeFactors(n: number) { const ds: number[] = []; for (let d = 2; d * d <= n; d++) if (n % d === 0) { ds.push(d); while (n % d === 0) n /= d; } if (n > 1) ds.push(n); return ds; }
export function sufficientCoveragePow(r: number, e: number, m: number, tick: () => void = () => {}) { let v = one, base = B(r), exp = B(e); const modulus = B(m);
  while (exp > zero) { tick(); if (exp % two) v = v * base % modulus; base = base * base % modulus; exp /= two; } return Number(v); }
function validFactors(fs: Row["factors"], T: bigint) { let product = one, previous = 1;
  for (const [q, e] of fs) { if (!prime(Number(q)) || Number(q) <= previous || Number(e) > 26) return false; product *= B(q) ** B(e); previous = Number(q); }
  return product === T; }
function modmul(a: number, b: number, m: number, tick: () => void) { tick(); return Number(B(a) * B(b) % B(m)); }
function coset(residue: number, K: Entry[], m: number, tick: () => void) { return K.reduce((least, k) => Math.min(least, modmul(residue, Number(k.residue), m, tick)), m); }
function relOrder(r: number, K: Set<number>, m: number, M: number, ds: number[], tick: () => void) { let order = M;
  for (const d of ds) while (order % d === 0 && K.has(sufficientCoveragePow(r, order / d, m, tick))) order /= d; return order; }
function pairOfVector(vector: string[], fs: Row["factors"], allowed?: number[]) {
  if (vector.length !== fs.length) return null; let u = one, v = one;
  for (let i = 0; i < vector.length; i++) { const t = Number(vector[i]); if (Math.abs(t) > Number(fs[i][1]) || allowed && !allowed.includes(i) && t !== 0) return null;
    if (t >= 0) u *= B(fs[i][0]) ** B(t); else v *= B(fs[i][0]) ** B(-t); }
  return { u, v };
}
function vectorResidue(vector: string[], fs: Row["factors"], m: number, M: number, tick: () => void) { const pair = pairOfVector(vector, fs); if (!pair) throw new Error("INVALID_VECTOR");
  return modmul(Number(pair.u % B(m)), sufficientCoveragePow(Number(pair.v % B(m)), M - 1, m, tick), m, tick); }
function verifiedChain(row: Row, m: number, M: number, tick: () => void) {
  let K: Entry[] = [{ residue: "1", exponents: row.factors.map(() => "0") }];
  const unused = row.factors.map((_, i) => i), consumed: number[] = [], ds = primeFactors(M);
  for (const stage of row.chain.stages) {
    if (K.some(k => k.residue === String(m - 1))) return null;
    const set = new Set(K.map(k => Number(k.residue)));
    let choice: { i: number; r: number; e: number; d: number } | null = null;
    for (const i of unused) { const [r, e] = row.factors[i].map(Number), d = relOrder(r % m, set, m, M, ds, tick); if (d <= 2 * e + 1) { choice = { i, r, e, d }; break; } }
    if (!choice || stage.factorIndex !== String(choice.i) || stage.prime !== String(choice.r) || stage.exponent !== String(choice.e) || stage.relativeOrder !== String(choice.d) || stage.previousCoveredDigest !== sufficientCoverageHash(K)) return null;
    const { stageDigest, ...body } = stage; if (stageDigest !== sufficientCoverageHash(body)) return null;
    const next = new Map<number, string[]>();
    for (let t = -choice.e; t < -choice.e + choice.d; t++) { const inverse = sufficientCoveragePow(choice.r % m, M - 1, m, tick), r = sufficientCoveragePow(t < 0 ? inverse : choice.r % m, Math.abs(t), m, tick);
      for (const k of K) { const residue = modmul(r, Number(k.residue), m, tick); if (next.has(residue)) return null; const vector = [...k.exponents]; vector[choice.i] = String(t); next.set(residue, vector); } }
    if (next.size !== choice.d * K.length) return null;
    K = [...next].sort(([a], [b]) => a - b).map(([residue, exponents]) => ({ residue: String(residue), exponents }));
    if (!isDeepStrictEqual(K, stage.covered)) return null;
    consumed.push(choice.i); unused.splice(unused.indexOf(choice.i), 1);
  }
  if (!isDeepStrictEqual(row.chain.covered, K) || !isDeepStrictEqual(row.chain.consumed, consumed.map(String)) || !isDeepStrictEqual(row.chain.unused, unused.map(String))) return null;
  const target = K.find(k => k.residue === String(m - 1));
  if (!target && unused.some(i => relOrder(Number(row.factors[i][0]) % m, new Set(K.map(k => Number(k.residue))), m, M, ds, tick) <= 2 * Number(row.factors[i][1]) + 1)) return null;
  return { K, unused, target };
}
function verifiedHalf(half: Half, expectedIndices: number[], row: Row, K: Entry[], m: number, M: number, tick: () => void) {
  if (!isDeepStrictEqual(half.factorIndices, expectedIndices.map(String)) || !expectedIndices.length) return false;
  const N = expectedIndices.reduce((prod, i) => prod * B(2 * Number(row.factors[i][1]) + 1), one);
  let mass = zero, E = zero, previous = 0;
  for (const f of half.frequencies) {
    const pair = pairOfVector(f.exponents, row.factors, expectedIndices), residue = Number(f.residue), canonicalCoset = Number(f.coset);
    if (!pair || B(f.u) !== pair.u || B(f.v) !== pair.v || residue !== vectorResidue(f.exponents, row.factors, m, M, tick) ||
      canonicalCoset <= previous || canonicalCoset >= m || coset(residue, K, m, tick) !== canonicalCoset) return false;
    previous = canonicalCoset; mass += B(f.mu); E += B(f.mu) ** two;
  }
  return mass === N && B(half.N) === N && B(half.E) === E && B(half.L) === (N * N + E - one) / E;
}
function normalizedCertificate(cert: NonNullable<Row["certificate"]>, raw: string[], row: Row, m: number, verifyWitness = true) {
  const pair = pairOfVector(raw, row.factors); if (!pair) return false; const inverted = pair.u > pair.v;
  const expected = inverted ? raw.map(t => String(-Number(t))) : raw;
  if (cert.orientation !== (inverted ? "INVERTED" : "AS_CONSTRUCTED") || !isDeepStrictEqual(cert.exponents, expected)) return false;
  if (!verifyWitness) return true;
  const normalized = pairOfVector(cert.exponents, row.factors)!;
  const w = cert.witness, u = B(w.u), v = B(w.v), k = B(w.k), A = B(w.A), x = B(w.x), y = B(w.y), z = B(w.z), p = B(row.p), T = B(row.T);
  if (u !== normalized.u || v !== normalized.v || !(u < v) || gcd(u, v) !== one || u * v * k !== T || u + v !== B(m) * A) return false;
  const ds = [T, A * p * u * k, A * p * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  return isDeepStrictEqual(ds, [x, y, z]) && x < y && y < z && B(4) * x * y * z === p * (x * y + x * z + y * z) && ds.filter(d => d % p === zero).length === 2;
}
export function sufficientCoverageSummary(rows: Row[], complete: boolean): SufficientCoveragePacket["summary"] { return { complete, counts: {
  CHAIN_CERTIFIED: String(rows.filter(r => r.status === "CHAIN_CERTIFIED").length), ENERGY_CERTIFIED: String(rows.filter(r => r.status === "ENERGY_CERTIFIED").length),
  NOT_CERTIFIED: String(rows.filter(r => r.status === "NOT_CERTIFIED").length) } }; }

function verifiedAllocation(row: Row, m: number, M: number, tick: () => void, verifyWitness = true) {
  const chain = verifiedChain(row, m, M, tick); if (!chain) return false;
  const { K, unused, target } = chain, total = unused.length >= 2 ? 2 ** (unused.length - 1) - 1 : 0;
  if (!isDeepStrictEqual(row.allocation, { totalPartitions: String(total), evaluatedPartitions: String(row.attempts.length), notEvaluatedPartitions: String(total - row.attempts.length) })) return false;
  if (target) {
    if (row.status !== "CHAIN_CERTIFIED" || row.attempts.length || row.certificate?.kind !== "CHAIN" || !normalizedCertificate(row.certificate, target.exponents, row, m, verifyWitness)) return false;
    return true;
  }
  const masks: number[] = []; if (unused.length >= 2) for (let mask = 1; mask < 2 ** unused.length - 1; mask += 2) masks.push(mask);
  let firstSuccess: Row["attempts"][number] | null = null;
  for (let i = 0; i < row.attempts.length; i++) {
    const attempt = row.attempts[i], mask = masks[i]; if (mask === undefined || attempt.mask !== String(mask) || firstSuccess) return false;
    const ia = unused.filter((_, j) => mask & (1 << j)), ib = unused.filter((_, j) => !(mask & (1 << j)));
    if (!verifiedHalf(attempt.A, ia, row, K, m, M, tick) || !verifiedHalf(attempt.B, ib, row, K, m, M, tick) ||
      attempt.quotientOrder !== String(M / K.length) || attempt.sufficient !== (B(attempt.A.L) + B(attempt.B.L) > B(attempt.quotientOrder))) return false;
    const { attemptDigest, ...abody } = attempt; if (attemptDigest !== sufficientCoverageHash(abody)) return false;
    if (attempt.sufficient) firstSuccess = attempt;
  }
  if (!firstSuccess) { if (row.status !== "NOT_CERTIFIED" || row.certificate !== null || row.attempts.length !== masks.length) return false; return true; }
  if (row.status !== "ENERGY_CERTIFIED" || row.certificate?.kind !== "ENERGY" || row.certificate.partitionMask !== firstSuccess.mask) return false;
  const cert = row.certificate, lookup = new Map(firstSuccess.B.frequencies.map(f => [f.coset, f]));
  let matched = false;
  for (const a of firstSuccess.A.frequencies) {
    const cb = String(coset(modmul(m - 1, sufficientCoveragePow(Number(a.coset), M - 1, m, tick), m, tick), K, m, tick));
    const other = lookup.get(cb); if (!other) continue;
    const actual = modmul(Number(a.residue), Number(other.residue), m, tick), lift = modmul(m - 1, sufficientCoveragePow(actual, M - 1, m, tick), m, tick), k = K.find(e => e.residue === String(lift));
    if (!k || !isDeepStrictEqual(cert.match, { cosetA: a.coset, cosetB: cb, exponentsA: a.exponents, exponentsB: other.exponents, liftResidue: String(lift), liftExponents: k.exponents })) return false;
    const vector = a.exponents.map((t, i) => String(Number(t) + Number(other.exponents[i]) + Number(k.exponents[i])));
    if (!normalizedCertificate(cert, vector, row, m, verifyWitness)) return false;
    matched = true; break;
  }
  if (!matched) return false;
  return true;
}

/** Abstract group-allocation regression seam ONLY. It deliberately does not validate root witness fields or admit campaign inputs. */
export function verifySufficientCoverageAbstractAllocation(raw: unknown) {
  try {
    const parsed = rowSchema.safeParse(raw); if (!parsed.success) return false; const row = parsed.data;
    if (Buffer.byteLength(canonicalJson(row)) > 2097152 || B(row.T) > B(100500000) || !validFactors(row.factors, B(row.T))) return false;
    const m = Number(row.m), M = Number(row.groupOrder);
    if (!Number.isSafeInteger(m) || m < 3 || m > 201000000 || gcd(B(row.T), B(m)) !== one ||
      !(prime(m) && m % 4 === 3 && M === m - 1 || m % 3 === 0 && prime(m / 3) && m / 3 % 4 === 1 && M === 2 * (m / 3 - 1))) return false;
    const { rowDigest, ...body } = row; if (rowDigest !== sufficientCoverageHash(body)) return false;
    let work = 0; const tick = () => { if (++work > 50000000) throw new Error("ABSTRACT_WORK_LIMIT"); };
    return verifiedAllocation(row, m, M, tick, false);
  } catch { return false; }
}

/** Scoped proof consistency and identities. Fresh independent replay remains completeness/canonicality authority. */
export function verifySufficientCoveragePacket(raw: unknown): raw is SufficientCoveragePacket {
  try {
    const parsed = sufficientCoveragePacketSchema.safeParse(raw); if (!parsed.success) return false; const p = parsed.data;
    if (!isDeepStrictEqual(p.inputs, SUFFICIENT_COVERAGE_INPUTS) || p.status === "COMPLETE" && !isDeepStrictEqual(p.limits, SUFFICIENT_COVERAGE_LIMITS)) return false;
    const { packetDigest, ...body } = p;
    if (packetDigest !== sufficientCoverageHash(body) || Number(p.runtime.outputBytes) !== Buffer.byteLength(canonicalJson(p)) || Number(p.runtime.outputBytes) > p.limits.maxOutputBytes ||
      p.rows.length > p.limits.maxRows || Number(p.runtime.workSteps) > p.limits.maxWorkSteps || Number(p.runtime.stateInsertions) > p.limits.maxStateInsertions ||
      p.runtime.pairChecks !== undefined && Number(p.runtime.pairChecks) > 50000000 || p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds * 1000) return false;
    const next = p.rows.length < 71 ? { phase: "ROW", id: SUFFICIENT_COVERAGE_INPUTS.rows[p.rows.length].id } : { phase: "FINALIZE" };
    if (p.status === "COMPLETE" ? p.rows.length !== 71 || p.pending !== null || p.reason !== null : !p.reason || !isDeepStrictEqual(p.pending, next)) return false;
    let work = 0; const tick = () => { if (++work > 50000000) throw new Error("SCOPED_WORK_LIMIT"); };
    for (let ri = 0; ri < p.rows.length; ri++) {
      const row = p.rows[ri], input = SUFFICIENT_COVERAGE_INPUTS.rows[ri], P = Number(row.p), m = Number(row.m), M = Number(row.groupOrder);
      if (row.id !== input.id || row.p !== input.p || row.m !== input.m || !prime(P) || P % 840 !== 1 || m >= P || (P + m) % 4 ||
        B(row.T) !== B((P + m) / 4) || gcd(B(row.T), B(m)) !== one || !validFactors(row.factors, B(row.T))) return false;
      if (input.source === "TIP037" ? !prime(m) || m % 4 !== 3 || M !== m - 1 : m % 3 || !prime(m / 3) || m / 3 % 4 !== 1 || M !== 2 * (m / 3 - 1)) return false;
      const { rowDigest, ...rowBody } = row; if (rowDigest !== sufficientCoverageHash(rowBody)) return false;
      if (!verifiedAllocation(row, m, M, tick)) return false;
    }
    return p.rowsDigest === sufficientCoverageHash(p.rows) && isDeepStrictEqual(p.summary, sufficientCoverageSummary(p.rows, p.status === "COMPLETE")) &&
      p.contentDigest === sufficientCoverageHash({ inputs: p.inputs, rows: p.rows, rowsDigest: p.rowsDigest, summary: p.summary });
  } catch { return false; }
}
export function compareSufficientCoverageReplay(primary: unknown, replay: unknown) {
  if (!verifySufficientCoveragePacket(primary) || !verifySufficientCoveragePacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.rows, replay.rows) && isDeepStrictEqual(primary.summary, replay.summary) ? "PASS" as const : "MISMATCH" as const;
}
