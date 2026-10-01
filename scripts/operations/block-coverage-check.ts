import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";

const targets = ["200023321", "200602081", "200656681", "131433121"], shifts = [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107];
const newTargets = ["199000201", "199002721", "199003561", "199006921", "199014481", "199031281", "199035481", "199039681"];
const composites = [["r0", "200023321", "1595931"], ["r1", "200023321", "183"], ["r2", "200023321", "3000351"], ["r3", "200602081", "25075263"],
  ["r4", "200602081", "2550027"], ["r5", "200602081", "4227"], ["r6", "200602081", "247047"], ["r7", "200656681", "68127"],
  ["r10", "131433121", "7179"], ["r11", "131433121", "19714971"], ["r13", "200656681", "206439"]];
export const BLOCK_COVERAGE_INPUTS = { rows: [
  ...targets.flatMap((p, i) => shifts.map(m => ({ id: `P${i}_h${m}`, p, m: String(m), source: "TIP037", sourceRowId: `${p}:${m}`, cohort: "EXPOSED_71" }))),
  ...composites.map(([rid, p, m]) => ({ id: `C_${rid}`, p, m, source: "TIP039", sourceRowId: rid, cohort: "EXPOSED_71" })),
  ...newTargets.flatMap((p, i) => shifts.map(m => ({ id: `N${i}_h${m}`, p, m: String(m), source: "TIP041", sourceRowId: `${p}:${m}`, cohort: "PRIMALITY_ONLY_120" }))),
], newCohort: { roots: newTargets, shifts: shifts.map(String), selection: "FIRST_8_ASCENDING_PRIMES_P1MOD840_IN_199000000_TO_199100000_PRIMALITY_ONLY",
  identity: "0dce735540a95a5087c5d624b8f85faab6e20a009b3071bfdc4ba4b126f9806a" }, sourceContentDigests: { TIP037: "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",
  TIP039: "ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e", TIP040: "48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72" }, policy: "ASCENDING_INDIVIDUAL_THEN_CARDINALITY_MASK_BLOCK_THEN_ENERGY_V1" };
export const BLOCK_COVERAGE_LIMITS = { seconds: 60, maxRows: 191, maxStateInsertions: 2000000, maxWorkSteps: 50000000, maxOutputBytes: 8388608, maxSmallGroupElements: 53, maxSubgroupsPerAttempt: 4096 };
export const BLOCK_COVERAGE_SCOPE = "FIXED_191_ROWS_ALL_SUBGROUP_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM";
export const blockCoverageHash = (v: unknown) => createHash("sha256").update(canonicalJson(v)).digest("hex");
const dec = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), pos = z.string().regex(/^[1-9][0-9]{0,29}$/), signed = z.string().regex(/^(0|-?[1-9][0-9]{0,2})$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^([PN][0-7]_h[1-9][0-9]{0,2}|C_r(0|[1-9][0-9]{0,2}))$/), vectorSchema = z.array(signed).max(16), factorsSchema = z.array(z.tuple([pos, pos])).max(16);
const entrySchema = z.object({ residue: pos, exponents: vectorSchema }).strict();
const individualStage = z.object({ kind: z.literal("INDIVIDUAL"), factorIndex: dec, prime: pos, exponent: pos, relativeOrder: pos, previousCoveredDigest: hash,
  covered: z.array(entrySchema).min(1).max(2000000), stageDigest: hash }).strict();
const blockStage = z.object({ kind: z.literal("BLOCK"), attemptIndex: dec, previousCoveredDigest: hash,
  covered: z.array(entrySchema).min(1).max(2000000), stageDigest: hash }).strict();
const stageSchema = z.discriminatedUnion("kind", [individualStage, blockStage]);
const halfSchema = z.object({ factorIndices: z.array(dec).min(1).max(16), N: pos, E: pos, L: pos,
  frequencies: z.array(z.object({ coset: pos, mu: pos, u: pos, v: pos, residue: pos, exponents: vectorSchema }).strict()).min(1).max(2000000) }).strict();
const attemptSchema = z.object({ mask: pos, A: halfSchema, B: halfSchema, quotientOrder: pos, sufficient: z.boolean(), attemptDigest: hash }).strict();
const blockAttemptSchema = z.object({ previousCoveredDigest: hash, unused: z.array(dec).max(16), support: z.array(dec).min(2).max(16), mask: pos, W: pos, bound: pos,
  exactAtomOrders: z.array(z.object({ factorIndex: dec, order: pos }).strict()).max(16),
  closure: z.object({ status: z.enum(["EXACT", "LOWER_BOUND_ONLY", "NOT_BUILT"]), elements: z.array(pos).max(54), lowerBound: pos.nullable() }).strict(),
  subgroups: z.array(z.object({ members: z.array(pos).min(1).max(53), index: pos, orders: z.array(pos).max(16), atomSizes: z.array(pos).max(16),
    lowerBound: pos, passed: z.boolean() }).strict()).max(4096),
  decision: z.enum(["ATOM_ORDER_TOO_LARGE", "GROUP_TOO_LARGE", "INEQUALITY_FAILED", "PASS"]), construction: halfSchema.nullable(), attemptDigest: hash }).strict();
const witnessSchema = z.object({ u: pos, v: pos, k: pos, A: pos, x: pos, y: pos, z: pos }).strict();
const certCommon = { exponents: vectorSchema, orientation: z.enum(["AS_CONSTRUCTED", "INVERTED"]), witness: witnessSchema };
const certSchema = z.discriminatedUnion("kind", [z.object({ kind: z.literal("CHAIN"), ...certCommon }).strict(), z.object({ kind: z.literal("ENERGY"), partitionMask: pos,
  match: z.object({ cosetA: pos, cosetB: pos, exponentsA: vectorSchema, exponentsB: vectorSchema, liftResidue: pos, liftExponents: vectorSchema }).strict(), ...certCommon }).strict()]);
const statusSchema = z.enum(["SINGLE_CHAIN_CERTIFIED", "BLOCK_CHAIN_CERTIFIED", "ENERGY_CERTIFIED", "NOT_CERTIFIED"]);
const rowSchema = z.object({ id, p: pos, m: pos, T: pos, groupOrder: pos, factors: factorsSchema,
  chain: z.object({ stages: z.array(stageSchema).max(16), blockAttempts: z.array(blockAttemptSchema).max(4096), hasBlock: z.boolean(), consumed: z.array(dec).max(16), unused: z.array(dec).max(16), covered: z.array(entrySchema).min(1).max(2000000) }).strict(),
  attempts: z.array(attemptSchema).max(32767), allocation: z.object({ totalPartitions: dec, evaluatedPartitions: dec, notEvaluatedPartitions: dec }).strict(),
  status: statusSchema, certificate: certSchema.nullable(), rowDigest: hash }).strict();
const countsSchema = z.object({ SINGLE_CHAIN_CERTIFIED: dec, BLOCK_CHAIN_CERTIFIED: dec, ENERGY_CERTIFIED: dec, NOT_CERTIFIED: dec }).strict();
const summarySchema = z.object({ complete: z.boolean(), counts: countsSchema, cohorts: z.object({ EXPOSED_71: countsSchema, PRIMALITY_ONLY_120: countsSchema }).strict() }).strict();
export const blockCoveragePacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_BLOCK_COVERAGE_V1"), status: z.enum(["COMPLETE", "PARTIAL"]), inputs: z.unknown(),
  limits: z.object({ seconds: z.number().positive().max(60), maxRows: z.number().int().positive().max(191), maxStateInsertions: z.number().int().positive().max(2000000),
    maxWorkSteps: z.number().int().positive().max(50000000), maxOutputBytes: z.number().int().min(32768).max(8388608), maxSmallGroupElements: z.number().int().positive().max(53), maxSubgroupsPerAttempt: z.number().int().positive().max(4096) }).strict(),
  rows: z.array(rowSchema).max(191), rowsDigest: hash, summary: summarySchema, contentDigest: hash,
  pending: z.object({ phase: z.enum(["ROW", "FINALIZE"]), id: id.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "WORK_LIMIT", "OUTPUT_LIMIT", "REPLAY_TIME_LIMIT", "REPLAY_PAIR_LIMIT", "SUBGROUP_LIMIT", "SMALL_GROUP_LIMIT"]).nullable(), scope: z.literal(BLOCK_COVERAGE_SCOPE),
  runtime: z.object({ stateInsertions: dec, workSteps: dec, elapsedMs: dec, outputBytes: dec, pairChecks: dec.optional() }).strict(), packetDigest: hash }).strict();
export type BlockCoveragePacket = z.infer<typeof blockCoveragePacketSchema>;
type Row = BlockCoveragePacket["rows"][number]; type Entry = Row["chain"]["covered"][number]; type Half = Row["attempts"][number]["A"];
const B = BigInt, zero = B(0), one = B(1), two = B(2);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
function prime(n: number) { if (!Number.isSafeInteger(n) || n < 2 || n > 201000000) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function primeFactors(n: number) { const ds: number[] = []; for (let d = 2; d * d <= n; d++) if (n % d === 0) { ds.push(d); while (n % d === 0) n /= d; } if (n > 1) ds.push(n); return ds; }
export function blockCoveragePow(r: number, e: number, m: number, tick: () => void = () => {}) { let v = one, base = B(r), exp = B(e); const modulus = B(m);
  while (exp > zero) { tick(); if (exp % two) v = v * base % modulus; base = base * base % modulus; exp /= two; } return Number(v); }
function validFactors(fs: Row["factors"], T: bigint) { let product = one, previous = 1;
  for (const [q, e] of fs) { if (!prime(Number(q)) || Number(q) <= previous || Number(e) > 26) return false; product *= B(q) ** B(e); previous = Number(q); }
  return product === T; }
function modmul(a: number, b: number, m: number, tick: () => void) { tick(); return Number(B(a) * B(b) % B(m)); }
function coset(residue: number, K: Entry[], m: number, tick: () => void) { return K.reduce((least, k) => Math.min(least, modmul(residue, Number(k.residue), m, tick)), m); }
function relOrder(r: number, K: Set<number>, m: number, M: number, ds: number[], tick: () => void) { let order = M;
  for (const d of ds) while (order % d === 0 && K.has(blockCoveragePow(r, order / d, m, tick))) order /= d; return order; }
function pairOfVector(vector: string[], fs: Row["factors"], allowed?: number[]) {
  if (vector.length !== fs.length) return null; let u = one, v = one;
  for (let i = 0; i < vector.length; i++) { const t = Number(vector[i]); if (Math.abs(t) > Number(fs[i][1]) || allowed && !allowed.includes(i) && t !== 0) return null;
    if (t >= 0) u *= B(fs[i][0]) ** B(t); else v *= B(fs[i][0]) ** B(-t); }
  return { u, v };
}
function vectorResidue(vector: string[], fs: Row["factors"], m: number, M: number, tick: () => void) { const pair = pairOfVector(vector, fs); if (!pair) throw new Error("INVALID_VECTOR");
  return modmul(Number(pair.u % B(m)), blockCoveragePow(Number(pair.v % B(m)), M - 1, m, tick), m, tick); }
function numericListCompare(a: number[], b: number[]) { for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i]; return a.length - b.length; }
function generatedD(generators: number[], K: Entry[], m: number, bound: number, tick: () => void) {
  const discovered = [1], seen = new Set([1]), frontier = new Set([1]);
  while (frontier.size) { const current = Math.min(...frontier); frontier.delete(current);
    for (const r of generators) { const v = coset(modmul(current, r, m, tick), K, m, tick); if (seen.has(v)) continue;
      seen.add(v); discovered.push(v); frontier.add(v);
      if (seen.size > bound) return { status: "LOWER_BOUND_ONLY" as const, elements: discovered.map(String), lowerBound: String(seen.size) };
    }
  }
  return { status: "EXACT" as const, elements: [...seen].sort((a, b) => a - b).map(String), lowerBound: null };
}
function properSubgroups(D: number[], K: Entry[], m: number, tick: () => void) {
  const multiply = (a: number, b: number) => coset(modmul(a, b, m, tick), K, m, tick);
  const lattice: number[][] = [[1]], keys = new Set(["1"]);
  for (const H of lattice) for (const g of D) {
    if (H.includes(g)) continue;
    const generated = new Set(H), frontier = [...H];
    for (const h of frontier) { const v = multiply(h, g); if (!generated.has(v)) { generated.add(v); frontier.push(v); } }
    const members = [...generated].sort((a, b) => a - b), key = members.join(",");
    if (!keys.has(key)) { if (lattice.length >= 4096) throw new Error("SCOPED_SUBGROUP_LIMIT"); keys.add(key); lattice.push(members); }
  }
  return lattice.filter(H => H.length !== D.length).sort((a, b) => a.length - b.length || numericListCompare(a, b));
}
function checkedBlock(attempt: Row["chain"]["blockAttempts"][number], support: number[], mask: number, unused: number[], row: Row, K: Entry[], m: number, M: number, ds: number[], tick: () => void, criterionOnly = false) {
  const W = support.reduce((sum, i) => sum + Number(row.factors[i][1]), 0), bound = 2 * W + 1;
  if (attempt.previousCoveredDigest !== blockCoverageHash(K) || !isDeepStrictEqual(attempt.unused, unused.map(String)) ||
    !isDeepStrictEqual(attempt.support, support.map(String)) || attempt.mask !== String(mask) || attempt.W !== String(W) || attempt.bound !== String(bound)) return false;
  const { attemptDigest, ...body } = attempt; if (attemptDigest !== blockCoverageHash(body)) return false;
  const exactAtomOrders: {factorIndex: string; order: string}[] = [], set = new Set(K.map(k => Number(k.residue)));
  for (const i of support) { const d = relOrder(Number(row.factors[i][0]) % m, set, m, M, ds, tick); exactAtomOrders.push({ factorIndex: String(i), order: String(d) });
    if (d > bound) return isDeepStrictEqual(attempt.exactAtomOrders, exactAtomOrders) && attempt.decision === "ATOM_ORDER_TOO_LARGE" &&
      isDeepStrictEqual(attempt.closure, {status: "NOT_BUILT", elements: [], lowerBound: null}) && !attempt.subgroups.length && attempt.construction === null;
  }
  if (!isDeepStrictEqual(attempt.exactAtomOrders, exactAtomOrders)) return false;
  const closure = generatedD(support.map(i => Number(row.factors[i][0]) % m), K, m, bound, tick);
  if (!isDeepStrictEqual(attempt.closure, closure)) return false;
  if (closure.status === "LOWER_BOUND_ONLY") return attempt.decision === "GROUP_TOO_LARGE" && !attempt.subgroups.length && attempt.construction === null;
  const D = closure.elements.map(Number), expected = properSubgroups(D, K, m, tick).map(H => {
    const orders = support.map(i => { let value = 1; for (let d = 1; d <= D.length; d++) { value = coset(modmul(value, Number(row.factors[i][0]) % m, m, tick), K, m, tick); if (H.includes(value)) return d; } throw new Error("SUBGROUP_ORDER"); });
    const sizes = orders.map((d, j) => Math.min(d, 2 * Number(row.factors[support[j]][1]) + 1)), lower = 1 + sizes.reduce((sum, x) => sum + x - 1, 0), index = D.length / H.length;
    return { members: H.map(String), index: String(index), orders: orders.map(String), atomSizes: sizes.map(String), lowerBound: String(lower), passed: lower >= index };
  });
  if (!isDeepStrictEqual(attempt.subgroups, expected)) return false;
  const pass = expected.every(H => H.passed);
  if (!pass) return attempt.decision === "INEQUALITY_FAILED" && attempt.construction === null;
  if (criterionOnly) return attempt.decision === "PASS" && attempt.construction === null;
  return attempt.decision === "PASS" && attempt.construction !== null && verifiedHalf(attempt.construction, support, row, K, m, M, tick) &&
    isDeepStrictEqual(attempt.construction.frequencies.map(f => f.coset), closure.elements);
}
function verifiedChain(row: Row, m: number, M: number, tick: () => void) {
  let K: Entry[] = [{ residue: "1", exponents: row.factors.map(() => "0") }];
  let stageIndex = 0, attemptIndex = 0;
  const unused = row.factors.map((_, i) => i), consumed: number[] = [], ds = primeFactors(M);
  while (!K.some(k => k.residue === String(m - 1))) {
    const set = new Set(K.map(k => Number(k.residue)));
    let choice: { i: number; r: number; e: number; d: number } | null = null;
    for (const i of unused) { const [r, e] = row.factors[i].map(Number), d = relOrder(r % m, set, m, M, ds, tick); if (d <= 2 * e + 1) { choice = { i, r, e, d }; break; } }
    const next = new Map<number, string[]>();
    const stage = row.chain.stages[stageIndex];
    if (choice) {
      if (!stage || stage.kind !== "INDIVIDUAL" || stage.factorIndex !== String(choice.i) || stage.prime !== String(choice.r) || stage.exponent !== String(choice.e) || stage.relativeOrder !== String(choice.d)) return null;
      for (let t = -choice.e; t < -choice.e + choice.d; t++) { const inverse = blockCoveragePow(choice.r % m, M - 1, m, tick), r = blockCoveragePow(t < 0 ? inverse : choice.r % m, Math.abs(t), m, tick);
        for (const k of K) { const residue = modmul(r, Number(k.residue), m, tick); if (next.has(residue)) return null; const vector = [...k.exponents]; vector[choice.i] = String(t); next.set(residue, vector); }
      }
      consumed.push(choice.i); unused.splice(unused.indexOf(choice.i), 1);
    } else {
      let selected: Row["chain"]["blockAttempts"][number] | null = null, selectedSupport: number[] = [];
      for (let cardinality = 2; cardinality <= unused.length && !selected; cardinality++) for (let mask = 1; mask < 2 ** unused.length && !selected; mask++) {
        const support = unused.filter((_, j) => mask & (1 << j)); if (support.length !== cardinality) continue;
        const attempt = row.chain.blockAttempts[attemptIndex]; if (!attempt || !checkedBlock(attempt, support, mask, unused, row, K, m, M, ds, tick)) return null;
        attemptIndex++;
        if (attempt.decision === "PASS") { selected = attempt; selectedSupport = support; }
      }
      if (!selected) break;
      if (!stage || stage.kind !== "BLOCK" || stage.attemptIndex !== String(attemptIndex - 1) || !selected.construction) return null;
      for (const f of selected.construction.frequencies) for (const k of K) {
        const residue = modmul(Number(f.residue), Number(k.residue), m, tick); if (next.has(residue)) return null;
        const vector = f.exponents.map((t, i) => String(Number(t) + Number(k.exponents[i])));
        if (!pairOfVector(vector, row.factors)) return null;
        next.set(residue, vector);
      }
      if (next.size !== K.length * selected.closure.elements.length) return null;
      consumed.push(...selectedSupport); for (const i of selectedSupport) unused.splice(unused.indexOf(i), 1);
    }
    if (!stage || stage.previousCoveredDigest !== blockCoverageHash(K)) return null;
    const {stageDigest, ...body} = stage; if (stageDigest !== blockCoverageHash(body)) return null;
    K = [...next].sort(([a], [b]) => a - b).map(([residue, exponents]) => ({residue: String(residue), exponents}));
    if (!isDeepStrictEqual(stage.covered, K)) return null;
    stageIndex++;
  }
  if (stageIndex !== row.chain.stages.length || attemptIndex !== row.chain.blockAttempts.length || row.chain.hasBlock !== row.chain.stages.some(s => s.kind === "BLOCK") ||
    !isDeepStrictEqual(row.chain.covered, K) || !isDeepStrictEqual(row.chain.consumed, consumed.map(String)) || !isDeepStrictEqual(row.chain.unused, unused.map(String))) return null;
  return {K, unused, target: K.find(k => k.residue === String(m - 1))};
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
export function blockCoverageSummary(rows: Row[], complete: boolean): BlockCoveragePacket["summary"] {
  const counts = (rs: Row[]) => ({ SINGLE_CHAIN_CERTIFIED: String(rs.filter(r => r.status === "SINGLE_CHAIN_CERTIFIED").length),
    BLOCK_CHAIN_CERTIFIED: String(rs.filter(r => r.status === "BLOCK_CHAIN_CERTIFIED").length),
    ENERGY_CERTIFIED: String(rs.filter(r => r.status === "ENERGY_CERTIFIED").length), NOT_CERTIFIED: String(rs.filter(r => r.status === "NOT_CERTIFIED").length) });
  return {complete, counts: counts(rows), cohorts: { EXPOSED_71: counts(rows.filter(r => BLOCK_COVERAGE_INPUTS.rows.find(i => i.id === r.id)?.cohort === "EXPOSED_71")),
    PRIMALITY_ONLY_120: counts(rows.filter(r => BLOCK_COVERAGE_INPUTS.rows.find(i => i.id === r.id)?.cohort === "PRIMALITY_ONLY_120")) }};
}

function verifiedAllocation(row: Row, m: number, M: number, tick: () => void, verifyWitness = true) {
  const chain = verifiedChain(row, m, M, tick); if (!chain) return false;
  const { K, unused, target } = chain, total = unused.length >= 2 ? 2 ** (unused.length - 1) - 1 : 0;
  if (!isDeepStrictEqual(row.allocation, { totalPartitions: String(total), evaluatedPartitions: String(row.attempts.length), notEvaluatedPartitions: String(total - row.attempts.length) })) return false;
  if (target) {
    if (row.status !== (row.chain.hasBlock ? "BLOCK_CHAIN_CERTIFIED" : "SINGLE_CHAIN_CERTIFIED") || row.attempts.length || row.certificate?.kind !== "CHAIN" || !normalizedCertificate(row.certificate, target.exponents, row, m, verifyWitness)) return false;
    return true;
  }
  const masks: number[] = []; if (unused.length >= 2) for (let mask = 1; mask < 2 ** unused.length - 1; mask += 2) masks.push(mask);
  let firstSuccess: Row["attempts"][number] | null = null;
  for (let i = 0; i < row.attempts.length; i++) {
    const attempt = row.attempts[i], mask = masks[i]; if (mask === undefined || attempt.mask !== String(mask) || firstSuccess) return false;
    const ia = unused.filter((_, j) => mask & (1 << j)), ib = unused.filter((_, j) => !(mask & (1 << j)));
    if (!verifiedHalf(attempt.A, ia, row, K, m, M, tick) || !verifiedHalf(attempt.B, ib, row, K, m, M, tick) ||
      attempt.quotientOrder !== String(M / K.length) || attempt.sufficient !== (B(attempt.A.L) + B(attempt.B.L) > B(attempt.quotientOrder))) return false;
    const { attemptDigest, ...abody } = attempt; if (attemptDigest !== blockCoverageHash(abody)) return false;
    if (attempt.sufficient) firstSuccess = attempt;
  }
  if (!firstSuccess) { if (row.status !== "NOT_CERTIFIED" || row.certificate !== null || row.attempts.length !== masks.length) return false; return true; }
  if (row.status !== "ENERGY_CERTIFIED" || row.certificate?.kind !== "ENERGY" || row.certificate.partitionMask !== firstSuccess.mask) return false;
  const cert = row.certificate, lookup = new Map(firstSuccess.B.frequencies.map(f => [f.coset, f]));
  let matched = false;
  for (const a of firstSuccess.A.frequencies) {
    const cb = String(coset(modmul(m - 1, blockCoveragePow(Number(a.coset), M - 1, m, tick), m, tick), K, m, tick));
    const other = lookup.get(cb); if (!other) continue;
    const actual = modmul(Number(a.residue), Number(other.residue), m, tick), lift = modmul(m - 1, blockCoveragePow(actual, M - 1, m, tick), m, tick), k = K.find(e => e.residue === String(lift));
    if (!k || !isDeepStrictEqual(cert.match, { cosetA: a.coset, cosetB: cb, exponentsA: a.exponents, exponentsB: other.exponents, liftResidue: String(lift), liftExponents: k.exponents })) return false;
    const vector = a.exponents.map((t, i) => String(Number(t) + Number(other.exponents[i]) + Number(k.exponents[i])));
    if (!normalizedCertificate(cert, vector, row, m, verifyWitness)) return false;
    matched = true; break;
  }
  if (!matched) return false;
  return true;
}

/** Abstract group-allocation regression seam ONLY. It deliberately does not validate root witness fields or admit campaign inputs. */
export function verifyBlockCoverageAbstractAllocation(raw: unknown) {
  try {
    const parsed = rowSchema.safeParse(raw); if (!parsed.success) return false; const row = parsed.data;
    if (Buffer.byteLength(canonicalJson(row)) > 8388608 || B(row.T) > B(100500000) || !validFactors(row.factors, B(row.T))) return false;
    const m = Number(row.m), M = Number(row.groupOrder);
    if (!Number.isSafeInteger(m) || m < 3 || m > 201000000 || gcd(B(row.T), B(m)) !== one ||
      !(prime(m) && m % 4 === 3 && M === m - 1 || m % 3 === 0 && prime(m / 3) && m / 3 % 4 === 1 && M === 2 * (m / 3 - 1))) return false;
    const { rowDigest, ...body } = row; if (rowDigest !== blockCoverageHash(body)) return false;
    let work = 0; const tick = () => { if (++work > 50000000) throw new Error("ABSTRACT_WORK_LIMIT"); };
    return verifiedAllocation(row, m, M, tick, false);
  } catch { return false; }
}

/** Bounded abstract all-subgroup proof regression ONLY; no factor-product, fixed-root or witness admission. */
export function verifyBlockCoverageAbstractCriterion(m: number, atoms: {residue: number; exponent: number}[], raw: unknown) {
  try {
    if (!Number.isSafeInteger(m) || m < 3 || m > 201000000 || !Array.isArray(atoms) || atoms.length < 2 || atoms.length > 16 ||
      atoms.some(a => !Number.isSafeInteger(a.residue) || a.residue < 1 || a.residue >= m || gcd(B(a.residue), B(m)) !== one ||
        !Number.isSafeInteger(a.exponent) || a.exponent < 1 || a.exponent > 26) || atoms.reduce((n, a) => n + a.exponent, 0) > 26) return false;
    const schema = blockAttemptSchema.pick({exactAtomOrders: true, closure: true, subgroups: true, decision: true}).strict();
    const parsed = schema.safeParse(raw); if (!parsed.success) return false;
    const ds = primeFactors(m), M = ds.reduce((order, q) => order / q * (q - 1), m), indices = atoms.map((_, i) => i);
    const K: Entry[] = [{residue: "1", exponents: atoms.map(() => "0")}];
    const W = atoms.reduce((n, a) => n + a.exponent, 0), mask = 2 ** atoms.length - 1;
    const body = {previousCoveredDigest: blockCoverageHash(K), unused: indices.map(String), support: indices.map(String), mask: String(mask),
      W: String(W), bound: String(2 * W + 1), ...parsed.data, construction: null};
    const attempt = {...body, attemptDigest: blockCoverageHash(body)};
    const row = {factors: atoms.map(a => [String(a.residue), String(a.exponent)])} as Row;
    let work = 0; const tick = () => {if (++work > 50000000) throw new Error("ABSTRACT_WORK_LIMIT");};
    return checkedBlock(attempt, indices, mask, indices, row, K, m, M, primeFactors(M), tick, true);
  } catch {return false;}
}

/** Scoped proof consistency and identities. Fresh independent replay remains completeness/canonicality authority. */
export function verifyBlockCoveragePacket(raw: unknown): raw is BlockCoveragePacket {
  try {
    const parsed = blockCoveragePacketSchema.safeParse(raw); if (!parsed.success) return false; const p = parsed.data;
    if (!isDeepStrictEqual(p.inputs, BLOCK_COVERAGE_INPUTS) || p.status === "COMPLETE" && !isDeepStrictEqual(p.limits, BLOCK_COVERAGE_LIMITS)) return false;
    const { packetDigest, ...body } = p;
    if (packetDigest !== blockCoverageHash(body) || Number(p.runtime.outputBytes) !== Buffer.byteLength(canonicalJson(p)) || Number(p.runtime.outputBytes) > p.limits.maxOutputBytes ||
      p.rows.length > p.limits.maxRows || Number(p.runtime.workSteps) > p.limits.maxWorkSteps || Number(p.runtime.stateInsertions) > p.limits.maxStateInsertions ||
      p.runtime.pairChecks !== undefined && Number(p.runtime.pairChecks) > 50000000 || p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds * 1000) return false;
    const next = p.rows.length < 191 ? { phase: "ROW", id: BLOCK_COVERAGE_INPUTS.rows[p.rows.length].id } : { phase: "FINALIZE" };
    if (p.status === "COMPLETE" ? p.rows.length !== 191 || p.pending !== null || p.reason !== null : !p.reason || !isDeepStrictEqual(p.pending, next)) return false;
    let work = 0; const tick = () => { if (++work > 50000000) throw new Error("SCOPED_WORK_LIMIT"); };
    for (let ri = 0; ri < p.rows.length; ri++) {
      const row = p.rows[ri], input = BLOCK_COVERAGE_INPUTS.rows[ri], P = Number(row.p), m = Number(row.m), M = Number(row.groupOrder);
      if (row.id !== input.id || row.p !== input.p || row.m !== input.m || !prime(P) || P % 840 !== 1 || m >= P || (P + m) % 4 ||
        B(row.T) !== B((P + m) / 4) || gcd(B(row.T), B(m)) !== one || !validFactors(row.factors, B(row.T))) return false;
      if (input.source !== "TIP039" ? !prime(m) || m % 4 !== 3 || M !== m - 1 : m % 3 || !prime(m / 3) || m / 3 % 4 !== 1 || M !== 2 * (m / 3 - 1)) return false;
      const { rowDigest, ...rowBody } = row; if (rowDigest !== blockCoverageHash(rowBody)) return false;
      for (const attempt of row.chain.blockAttempts) {
        if (attempt.closure.status === "EXACT" && (attempt.closure.elements.length > p.limits.maxSmallGroupElements ||
          attempt.subgroups.length + 1 > p.limits.maxSubgroupsPerAttempt)) return false;
        // The producer checks the theorem's one-past-bound stop BEFORE the resource cap.
        // Every earlier discovery must nevertheless fit the declared cap.
        if (attempt.closure.status === "LOWER_BOUND_ONLY" && attempt.closure.elements.length - 1 > p.limits.maxSmallGroupElements) return false;
      }
      if (!verifiedAllocation(row, m, M, tick)) return false;
    }
    return p.rowsDigest === blockCoverageHash(p.rows) && isDeepStrictEqual(p.summary, blockCoverageSummary(p.rows, p.status === "COMPLETE")) &&
      p.contentDigest === blockCoverageHash({ inputs: p.inputs, rows: p.rows, rowsDigest: p.rowsDigest, summary: p.summary });
  } catch { return false; }
}
export function compareBlockCoverageReplay(primary: unknown, replay: unknown) {
  if (!verifyBlockCoveragePacket(primary) || !verifyBlockCoveragePacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.rows, replay.rows) && isDeepStrictEqual(primary.summary, replay.summary) ? "PASS" as const : "MISMATCH" as const;
}
