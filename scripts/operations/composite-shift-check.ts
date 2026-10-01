import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";

export const COMPOSITE_SHIFT_INPUTS = { blockers: [
  ["r0", "200023321", "31", "531977", "1"], ["r1", "200023321", "71", "61", "1"],
  ["r2", "200023321", "79", "1000117", "1"], ["r3", "200602081", "23", "8358421", "1"],
  ["r4", "200602081", "43", "850009", "1"], ["r5", "200602081", "67", "1409", "1"],
  ["r6", "200602081", "83", "82349", "1"], ["r7", "200656681", "43", "22709", "1"],
  ["r10", "131433121", "11", "2393", "1"], ["r11", "131433121", "19", "6571657", "1"],
  ["r13", "200656681", "2027", "68813", "1"],
].map(([recordId, p, parentH, q, valuation]) => ({ recordId, p, parentH, q, valuation })),
  sourceContentDigest: "952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4", multiplier: "3" };
export const COMPOSITE_SHIFT_LIMITS = { seconds: 60, maxRows: 11, maxStateInsertions: 2000000, maxWorkSteps: 50000000, maxOutputBytes: 2097152 };
// Fixed scope literal is coordinated with the primary; no imports of primary outcomes.
export const COMPOSITE_SHIFT_SCOPE = "FIXED_ELEVEN_TIP038_BLOCKERS_C_EQ_3Q_ONLY_NO_ROOT_OR_UNIVERSAL_EXCLUSION";
export const compositeShiftHash = (v: unknown) => createHash("sha256").update(canonicalJson(v)).digest("hex");
const dec = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), pos = z.string().regex(/^[1-9][0-9]{0,29}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const rid = z.string().regex(/^r(0|[1-9][0-9]{0,3})$/), factorsSchema = z.array(z.tuple([pos, pos])).max(20);
export const compositeShiftClassifications = ["HIT", "LOCAL_3_OBSTRUCTION", "LOCAL_Q_OBSTRUCTION", "LOCAL_BOTH_OBSTRUCTION", "CRT_SYNCHRONIZATION_OBSTRUCTION"] as const;
const classificationSchema = z.enum(compositeShiftClassifications);
const pairSchema = z.object({ u: pos, v: pos, k: pos }).strict();
const canonicalSchema = z.object({ u: pos, v: pos, k: pos, A: pos, x: pos, y: pos, z: pos }).strict();
const projectionSchema = z.object({ modulus: pos, image: z.array(pos).min(1).max(2000000), count: pos, hit: z.boolean(), canonicalPair: pairSchema.nullable() }).strict();
const defectSchema = z.object({ groupOrder: pos, stabilizer: z.array(pos).min(1).max(2000000), size: pos, index: pos, visibleMass: dec,
  visibleFactors: z.array(z.object({ prime: pos, exponent: pos, residue: pos, quotientOrder: pos }).strict()).max(20),
  involutionIntersection: z.array(pos).min(1).max(4), conditions: z.object({ targetCosetOrderTwo: z.boolean(), indexEven: z.boolean(), visibleMassBound: z.boolean(), ordersBeyondIntervals: z.boolean() }).strict() }).strict();
const rowSchema = z.object({ id: rid, provenance: z.object({ recordId: rid, p: pos, parentH: pos, q: pos, valuation: pos,
  parentT: pos, parentFactors: factorsSchema, sourceResidue: pos, legendre: z.literal("-1") }).strict(),
  p: pos, q: pos, c: pos, T: pos, factors: factorsSchema, image: z.array(pos).min(1).max(2000000), count: pos, jacobi: z.literal("-1"),
  hit: z.boolean(), canonical: canonicalSchema.nullable(), crt: z.object({ mod3: projectionSchema, modQ: projectionSchema, productCount: pos }).strict(),
  classification: classificationSchema, involutions: z.array(z.object({ residue: pos, mod3: pos, modQ: pos }).strict()).length(4), defect: defectSchema.nullable(),
  imageDigest: hash, crtDigest: hash, defectDigest: hash.nullable(), witnessDigest: hash.nullable(), rowDigest: hash }).strict();
const summarySchema = z.object({ complete: z.boolean(), classificationCounts: z.object({ HIT: dec, LOCAL_3_OBSTRUCTION: dec, LOCAL_Q_OBSTRUCTION: dec,
  LOCAL_BOTH_OBSTRUCTION: dec, CRT_SYNCHRONIZATION_OBSTRUCTION: dec }).strict(),
  C4: z.object({ status: z.enum(["REFUTED", "NO_REFUTATION_IN_COMPUTED_ROWS"]), firstRefutation: z.object({ rowId: rid, classification: classificationSchema, rowDigest: hash }).strict().nullable() }).strict() }).strict();
export const compositeShiftPacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_COMPOSITE_SHIFT_CRT_V1"), status: z.enum(["COMPLETE", "PARTIAL"]),
  inputs: z.unknown(), limits: z.object({ seconds: z.number().positive().max(60), maxRows: z.number().int().positive().max(11),
    maxStateInsertions: z.number().int().positive().max(2000000), maxWorkSteps: z.number().int().positive().max(50000000), maxOutputBytes: z.number().int().min(4096).max(2097152) }).strict(),
  rows: z.array(rowSchema).max(11), rowsDigest: hash, summary: summarySchema, contentDigest: hash,
  pending: z.object({ phase: z.enum(["ROW", "FINALIZE"]), recordId: rid.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "WORK_LIMIT", "OUTPUT_LIMIT", "REPLAY_TIME_LIMIT", "REPLAY_PAIR_LIMIT", "MODULAR_LIMIT"]).nullable(),
  scope: z.literal(COMPOSITE_SHIFT_SCOPE), runtime: z.union([
    z.object({ stateInsertions: dec, workSteps: dec, elapsedMs: dec, outputBytes: dec }).strict(),
    z.object({ pairChecks: dec, workSteps: dec, elapsedMs: dec, outputBytes: dec }).strict(),
  ]), packetDigest: hash }).strict();
export type CompositeShiftPacket = z.infer<typeof compositeShiftPacketSchema>;
type Row = CompositeShiftPacket["rows"][number];
const B = BigInt, zero = B(0), one = B(1), two = B(2);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
function prime(n: number) { if (!Number.isSafeInteger(n) || n < 2 || n > 201000000) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function factor(n: number) { const ds: number[] = []; for (let d = 2; d * d <= n; d++) if (n % d === 0) {
  ds.push(d); while (n % d === 0) n /= d; } if (n > 1) ds.push(n); return ds; }
export function compositeShiftPow(r: number, e: number, c: number, tick: () => void = () => {}) {
  let v = one, base = B(r), exp = B(e); const modulus = B(c);
  while (exp > zero) { tick(); if (exp % two) v = v * base % modulus; base = base * base % modulus; exp /= two; } return Number(v);
}
function legendre(r: number, h: number, tick: () => void) { const v = compositeShiftPow(r % h, (h - 1) / 2, h, tick);
  if (v !== 1 && v !== h - 1) throw new Error("NONUNIT_CHARACTER"); return v === 1 ? 1 : -1; }
function validFactors(fs: Row["factors"], T: bigint) { let product = one, last = 1;
  for (const [q, e] of fs) { if (!prime(Number(q)) || Number(q) <= last || Number(e) > 30) return false; last = Number(q); product *= B(q) ** B(e); }
  return product === T; }
function sortedUnits(values: string[], modulus: number) { let last = zero; for (const v of values) { const n = B(v);
  if (n <= last || n >= B(modulus) || gcd(n, B(modulus)) !== one) return false; last = n; } return values[0] === "1"; }
export function compositeShiftInvolutions(q: number) { const inverse3 = compositeShiftPow(3, q - 2, q), values: number[] = [];
  for (const r of [1, 2]) for (const t of [1, q - 1]) values.push(r + 3 * Number(((B(t) - B(r) + B(q)) * B(inverse3)) % B(q)));
  return values.sort((a, b) => a - b).map(r => ({ residue: String(r), mod3: String(r % 3), modQ: String(r % q) })); }

/** Generic abelian miss certificate; deliberately no prime-shift H parity or index2mod4 clauses. */
export function compositeShiftDefect(fs: Row["factors"], image: string[], c: number, q: number, tick: () => void = () => {}): NonNullable<Row["defect"]> {
  const values = image.map(Number), S = new Set(values), H: number[] = [], phi = 2 * (q - 1);
  for (const r of values) if (values.every(s => { tick(); return S.has(Number(B(r) * B(s) % B(c))); })) H.push(r);
  if (!H.length || phi % H.length) throw new Error("STABILIZER_SIZE");
  const HS = new Set(H), index = phi / H.length, divisors = factor(phi);
  const visibleFactors = fs.filter(([r]) => !HS.has(Number(r) % c)).map(([prime, exponent]) => {
    const residue = Number(prime) % c; let order = phi;
    for (const d of divisors) while (order % d === 0 && HS.has(compositeShiftPow(residue, order / d, c, tick))) order /= d;
    return { prime, exponent, residue: String(residue), quotientOrder: String(order) };
  });
  const V = visibleFactors.reduce((sum, f) => sum + Number(f.exponent), 0);
  return { groupOrder: String(phi), stabilizer: H.map(String), size: String(H.length), index: String(index), visibleMass: String(V), visibleFactors,
    involutionIntersection: compositeShiftInvolutions(q).map(r => r.residue).filter(r => HS.has(Number(r))),
    conditions: { targetCosetOrderTwo: !HS.has(c - 1) && HS.has(compositeShiftPow(c - 1, 2, c, tick)), indexEven: index % 2 === 0,
      visibleMassBound: 2 * V <= index - 2, ordersBeyondIntervals: visibleFactors.every(f => Number(f.quotientOrder) > 2 * Number(f.exponent) + 1) } };
}
export function compositeShiftSummary(rows: Row[], complete: boolean): CompositeShiftPacket["summary"] {
  const counts = Object.fromEntries(compositeShiftClassifications.map(c => [c, String(rows.filter(r => r.classification === c).length)])) as CompositeShiftPacket["summary"]["classificationCounts"];
  const first = rows.find(r => !r.hit);
  return { complete, classificationCounts: counts, C4: { status: first ? "REFUTED" : "NO_REFUTATION_IN_COMPUTED_ROWS",
    firstRefutation: first ? { rowId: first.id, classification: first.classification, rowDigest: first.rowDigest } : null } };
}
function validPair(pair: z.infer<typeof pairSchema> | null, hit: boolean, T: bigint, modulus: number) {
  if (!pair) return !hit; if (!hit) return false;
  const u = B(pair.u), v = B(pair.v), k = B(pair.k);
  return u <= v && gcd(u, v) === one && u * v * k === T && (u + v) % B(modulus) === zero;
}

/** Scoped consistency, identities and certificates; only fresh replay establishes full image/minimum provenance. */
export function verifyCompositeShiftPacket(raw: unknown): raw is CompositeShiftPacket {
  try {
    const parsed = compositeShiftPacketSchema.safeParse(raw); if (!parsed.success) return false; const p = parsed.data;
    if (!isDeepStrictEqual(p.inputs, COMPOSITE_SHIFT_INPUTS) || p.status === "COMPLETE" && !isDeepStrictEqual(p.limits, COMPOSITE_SHIFT_LIMITS)) return false;
    const { packetDigest, ...body } = p;
    if (packetDigest !== compositeShiftHash(body) || Number(p.runtime.outputBytes) !== Buffer.byteLength(canonicalJson(p)) || Number(p.runtime.outputBytes) > p.limits.maxOutputBytes ||
      p.rows.length > p.limits.maxRows || Number(p.runtime.workSteps) > p.limits.maxWorkSteps || "pairChecks" in p.runtime && Number(p.runtime.pairChecks) > 50000000 ||
      "stateInsertions" in p.runtime && Number(p.runtime.stateInsertions) > p.limits.maxStateInsertions || p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds * 1000) return false;
    const expectedPending = p.rows.length < 11 ? { phase: "ROW", recordId: COMPOSITE_SHIFT_INPUTS.blockers[p.rows.length].recordId } : { phase: "FINALIZE" };
    if (p.status === "COMPLETE" ? p.rows.length !== 11 || p.pending !== null || p.reason !== null : !p.reason || !isDeepStrictEqual(p.pending, expectedPending)) return false;
    let work = 0; const tick = () => { if (++work > 50000000) throw new Error("SCOPED_VALIDATION_WORK_LIMIT"); };
    for (let i = 0; i < p.rows.length; i++) {
      const row = p.rows[i], branch = COMPOSITE_SHIFT_INPUTS.blockers[i], provenance = row.provenance;
      if (row.id !== branch.recordId || row.p !== branch.p || row.q !== branch.q || !Object.entries(branch).every(([k, v]) => provenance[k as keyof typeof provenance] === v)) return false;
      const P = Number(row.p), q = Number(row.q), c = Number(row.c), T = B(row.T), parentH = Number(provenance.parentH), parentT = B(provenance.parentT);
      if (!prime(P) || P % 840 !== 1 || !prime(q) || q % 4 !== 1 || !prime(parentH) || parentH % 4 !== 3 || parentH >= P ||
        c !== 3 * q || c >= P || (P + c) % 4 || T !== B((P + c) / 4) || gcd(T, B(c)) !== one ||
        parentT !== B((P + parentH) / 4) || !validFactors(provenance.parentFactors, parentT) ||
        !provenance.parentFactors.some(([r, e]) => r === branch.q && e === branch.valuation) || provenance.sourceResidue !== String(q % parentH) ||
        legendre(q, parentH, tick) !== -1 || legendre(P, 3, tick) * legendre(P, q, tick) !== -1 || !validFactors(row.factors, T) ||
        !sortedUnits(row.image, c) || row.count !== String(row.image.length) || row.imageDigest !== compositeShiftHash(row.image) ||
        !isDeepStrictEqual(row.involutions, compositeShiftInvolutions(q))) return false;
      const { rowDigest, ...rowBody } = row; if (rowDigest !== compositeShiftHash(rowBody)) return false;
      for (const projection of [row.crt.mod3, row.crt.modQ]) {
        const modulus = projection === row.crt.mod3 ? 3 : q, actual = [...new Set(row.image.map(r => Number(r) % modulus))].sort((a, b) => a - b).map(String);
        if (projection.modulus !== String(modulus) || !isDeepStrictEqual(projection.image, actual) || projection.count !== String(actual.length) ||
          projection.hit !== actual.includes(String(modulus - 1)) || !validPair(projection.canonicalPair, projection.hit, T, modulus)) return false;
      }
      const h3 = row.crt.mod3.hit, hq = row.crt.modQ.hit, hit = row.image.includes(String(c - 1));
      const classification = hit ? "HIT" : h3 && hq ? "CRT_SYNCHRONIZATION_OBSTRUCTION" : h3 ? "LOCAL_Q_OBSTRUCTION" : hq ? "LOCAL_3_OBSTRUCTION" : "LOCAL_BOTH_OBSTRUCTION";
      if (row.hit !== hit || row.classification !== classification || row.crt.productCount !== String(row.crt.mod3.image.length * row.crt.modQ.image.length) ||
        row.crtDigest !== compositeShiftHash(row.crt) || !validPair(row.canonical, hit, T, c)) return false;
      if (hit) {
        const r = row.canonical!, u = B(r.u), v = B(r.v), k = B(r.k), A = B(r.A), x = B(r.x), y = B(r.y), z = B(r.z), primeP = B(row.p);
        const ds = [T, A * primeP * u * k, A * primeP * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        if (u + v !== B(c) * A || !(x < y && y < z) || !isDeepStrictEqual(ds, [x, y, z]) ||
          B(4) * x * y * z !== primeP * (x * y + x * z + y * z) || ds.filter(d => d % primeP === zero).length !== 2 ||
          row.witnessDigest !== compositeShiftHash(r) || row.defect !== null || row.defectDigest !== null) return false;
      } else {
        const d = compositeShiftDefect(row.factors, row.image, c, q, tick);
        if (!isDeepStrictEqual(d, row.defect) || !Object.values(d.conditions).every(Boolean) || row.defectDigest !== compositeShiftHash(d) || row.witnessDigest !== null) return false;
      }
    }
    return p.rowsDigest === compositeShiftHash(p.rows) && isDeepStrictEqual(p.summary, compositeShiftSummary(p.rows, p.status === "COMPLETE")) &&
      p.contentDigest === compositeShiftHash({ inputs: p.inputs, rows: p.rows, rowsDigest: p.rowsDigest, summary: p.summary });
  } catch { return false; }
}
export function compareCompositeShiftReplay(primary: unknown, replay: unknown) {
  if (!verifyCompositeShiftPacket(primary) || !verifyCompositeShiftPacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.rows, replay.rows) && isDeepStrictEqual(primary.summary, replay.summary) ? "PASS" as const : "MISMATCH" as const;
}
