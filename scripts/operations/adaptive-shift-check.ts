import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";

export const ADAPTIVE_SHIFT_INPUTS = { interval: { lowerExclusive: "200000000", upperInclusive: "201000000", residue: "1", modulus: "840" },
  warmups: ["131433121", "159727681", "351121", "171348241"], shifts: ["7", "11", "23", "47", "59", "83", "107"], separateControl: "19" };
export const ADAPTIVE_SHIFT_LIMITS = { seconds: 60, maxRows: 10000, maxStateInsertions: 2000000, maxOutputBytes: 2097152 };
export const ADAPTIVE_SHIFT_SCOPE = "Frozen public development interval and four exposed warmups; seven fixed safe-prime shifts, Type II only. Complete images and canonical coprime partitions are finite arithmetic evidence, not an exhaustive shift menu, a root proof, held-out benchmark or novelty certificate. p19 is a separate wrong-domain and historical h1 control. No agent-cycle authority.";
export const ADAPTIVE_SHIFT_P19_CONTROL = { p: "19", menuDomain: "NONINTEGER_T", menuRejected: true,
  oldH1Witness: { h: "1", T: "5", u: "1", v: "5", k: "1", A: "6", x: "5", y: "114", z: "570" }, scope: "OUTSIDE_RESIDUAL_DOMAIN" };
const decimal = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), positive = z.string().regex(/^[1-9][0-9]{0,29}$/);
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/);
const candidateSchema = z.object({ ell: positive, weight: decimal, nonresidue: z.boolean(), minusOneFactor: z.boolean(),
  thresholdApplicable: z.boolean(), boundaryApplicable: z.boolean(), inversePairPrimitive: z.boolean().nullable(), predictedHit: z.boolean().nullable() }).strict();
const canonicalSchema = z.object({ u: positive, v: positive, k: positive, A: positive, x: positive, y: positive, z: positive }).strict();
const rowSchema = z.object({ p: positive, h: positive, T: positive, factors: z.array(z.tuple([positive, positive])).max(20),
  image: z.array(positive).min(1).max(106), count: positive, hit: z.boolean(), canonical: canonicalSchema.nullable(),
  candidate: candidateSchema, imageDigest: hashSchema, witnessDigest: hashSchema.nullable(), rowDigest: hashSchema }).strict();
const groupSchema = z.object({ h: positive, weight: decimal, profiles: decimal, applicableProfiles: decimal,
  misses: decimal, classificationMismatches: decimal, profilesDigest: hashSchema }).strict();
export const adaptiveShiftReplayPacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_ADAPTIVE_SHIFT_PARTITIONS_V1"),
  status: z.enum(["COMPLETE", "PARTIAL"]), inputs: z.unknown(), limits: z.object({ seconds: z.number().positive().max(60),
    maxRows: z.number().int().positive().max(10000), maxStateInsertions: z.number().int().positive().max(2000000),
    maxOutputBytes: z.number().int().min(4096).max(2097152) }).strict(), primes: z.array(positive).max(1200),
  primeManifestDigest: hashSchema, rows: z.array(rowSchema).max(10000), rowsDigest: hashSchema,
  separateControl: z.unknown(), groupControls: z.array(groupSchema).max(2), contentDigest: hashSchema,
  pending: z.object({ phase: z.enum(["PRIME_SCAN", "GROUP_CONTROLS", "ROW", "FINALIZE"]), p: positive.optional(), h: positive.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "OUTPUT_LIMIT", "REPLAY_TIME_LIMIT", "REPLAY_PAIR_LIMIT"]).nullable(),
  scope: z.literal(ADAPTIVE_SHIFT_SCOPE),
  scannedThrough: positive, runtime: z.union([
    z.object({ stateInsertions: decimal, elapsedMs: decimal, outputBytes: decimal }).strict(),
    z.object({ pairChecks: decimal, elapsedMs: decimal, outputBytes: decimal }).strict(),
  ]), packetDigest: hashSchema }).strict();
export type AdaptiveShiftReplayPacket = z.infer<typeof adaptiveShiftReplayPacketSchema>;
export const adaptiveShiftHash = (value: unknown) => createHash("sha256").update(canonicalJson(value)).digest("hex");
const B = BigInt, zero = B(0), one = B(1), four = B(4);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
function prime(n: number) {
  if (!Number.isSafeInteger(n) || n < 2 || n > 201000000) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}
function pow(base: number, exponent: number, modulus: number) {
  let result = 1;
  while (exponent) { if (exponent % 2) result = result * base % modulus; base = base * base % modulus; exponent = Math.floor(exponent / 2); }
  return result;
}
function candidateFor(factors: [string, string][], h: number) {
  const ell = (h - 1) / 2, fs = factors.map(([q, e]) => [Number(q) % h, Number(e)]);
  const rs = fs.filter(([r]) => r !== 1).map(([r]) => r), weight = fs.reduce((n, [r, e]) => n + (r === 1 ? 0 : e), 0);
  const nonresidue = rs.some(r => pow(r, ell, h) === h - 1), minusOneFactor = rs.includes(h - 1);
  const thresholdApplicable = nonresidue && weight >= ell, boundaryApplicable = nonresidue && weight === ell - 1;
  const first = rs[0], inverse = first === undefined ? 0 : pow(first, h - 2, h);
  const inversePairPrimitive = boundaryApplicable ? rs.every(r => r !== h - 1 && pow(r, ell, h) === h - 1 && (r === first || r === inverse)) : null;
  const predictedHit = minusOneFactor || thresholdApplicable ? true : !nonresidue ? false : boundaryApplicable ? !inversePairPrimitive : null;
  return { ell: String(ell), weight: String(weight), nonresidue, minusOneFactor, thresholdApplicable, boundaryApplicable, inversePairPrimitive, predictedHit };
}

/** Scoped identity/hash validation. Image completeness and lex minimality require the independent fresh replay. */
export function verifyAdaptiveShiftPacket(raw: unknown): raw is AdaptiveShiftReplayPacket {
  const parsed = adaptiveShiftReplayPacketSchema.safeParse(raw);
  if (!parsed.success) return false;
  const p = parsed.data;
  if (!isDeepStrictEqual(p.inputs, ADAPTIVE_SHIFT_INPUTS) ||
    p.status === "COMPLETE" && !isDeepStrictEqual(p.limits, ADAPTIVE_SHIFT_LIMITS) ||
    !isDeepStrictEqual(p.separateControl, ADAPTIVE_SHIFT_P19_CONTROL) ||
    p.primeManifestDigest !== adaptiveShiftHash(p.primes) || p.rowsDigest !== adaptiveShiftHash(p.rows)) return false;
  const { packetDigest, ...body } = p;
  if (packetDigest !== adaptiveShiftHash(body) || Number(p.runtime.outputBytes) !== Buffer.byteLength(canonicalJson(p))) return false;
  if (Number(p.runtime.outputBytes) > p.limits.maxOutputBytes || p.rows.length > p.limits.maxRows ||
    p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds * 1000 ||
    "pairChecks" in p.runtime && Number(p.runtime.pairChecks) > 50000000 ||
    "stateInsertions" in p.runtime && Number(p.runtime.stateInsertions) > p.limits.maxStateInsertions) return false;
  const expectedPrimes: string[] = [];
  const scanned = Number(p.scannedThrough);
  if (scanned < 200000000 || scanned > 200999401 || scanned !== 200000000 && (scanned - 1) % 840 !== 0) return false;
  for (let n = 200000641; n <= scanned; n += 840) if (prime(n)) expectedPrimes.push(String(n));
  if (!isDeepStrictEqual(expectedPrimes, p.primes)) return false;
  if (p.status === "COMPLETE" && (p.pending !== null || p.reason !== null || scanned !== 200999401 ||
      p.groupControls.length !== 2 || p.rows.length !== (p.primes.length + 4) * 7)) return false;
  if (p.status === "PARTIAL" && (!p.pending || !p.reason)) return false;
  const targets = [...ADAPTIVE_SHIFT_INPUTS.warmups, ...p.primes];
  if (p.status === "PARTIAL" && p.pending) {
    if (p.pending.phase === "ROW" && (p.pending.p !== targets[Math.floor(p.rows.length / 7)] ||
      p.pending.h !== ADAPTIVE_SHIFT_INPUTS.shifts[p.rows.length % 7])) return false;
    if (p.pending.phase === "PRIME_SCAN" && (p.rows.length !== 0 || p.pending.p !==
      String(scanned === 200000000 ? 200000641 : scanned + 840))) return false;
    if (p.pending.phase === "GROUP_CONTROLS" && (p.rows.length !== 0 || p.pending.h !== undefined &&
      p.pending.h !== ["7", "11"][p.groupControls.length])) return false;
    if (p.pending.phase === "FINALIZE" && (scanned !== 200999401 || p.groupControls.length !== 2 ||
      p.rows.length !== targets.length * 7)) return false;
  }
  for (let i = 0; i < p.rows.length; i++) {
    const r = p.rows[i], n = Number(r.p), h = Number(r.h), T = B(r.T);
    if (r.p !== targets[Math.floor(i / 7)] || r.h !== ADAPTIVE_SHIFT_INPUTS.shifts[i % 7] ||
      !prime(n) || !prime(h) || !prime((h - 1) / 2) || (n + h) % 4 || n % h === 0 || T !== B((n + h) / 4)) return false;
    let product = one, last = 1;
    for (const [q, e] of r.factors) {
      if (!prime(Number(q)) || Number(q) <= last || Number(e) > 30) return false;
      product *= B(q) ** B(e); last = Number(q);
    }
    if (product !== T || !isDeepStrictEqual(r.candidate, candidateFor(r.factors, h)) ||
      r.imageDigest !== adaptiveShiftHash(r.image) || r.count !== String(r.image.length) ||
      r.hit !== r.image.includes(String(h - 1)) || r.hit !== Boolean(r.canonical) ||
      r.candidate.predictedHit !== null && r.candidate.predictedHit !== r.hit ||
      r.image[0] !== "1" || r.image.some((v, j) => Number(v) >= h || (j > 0 && Number(v) <= Number(r.image[j - 1])))) return false;
    const { rowDigest, ...row } = r;
    if (rowDigest !== adaptiveShiftHash(row)) return false;
    if (r.canonical) {
      const c = r.canonical, u = B(c.u), v = B(c.v), k = B(c.k), A = B(c.A), P = B(r.p);
      const ds = [u * v * k, A * P * u * k, A * P * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      const [x, y, z] = [c.x, c.y, c.z].map(B);
      if (u > v || gcd(u, v) !== one || u * v * k !== T || (u + v) !== B(h) * A ||
        !(x < y && y < z) || !isDeepStrictEqual(ds, [x, y, z]) ||
        four * x * y * z !== P * (x * y + x * z + y * z) || ds.filter(d => d % P === zero).length !== 2 ||
        r.witnessDigest !== adaptiveShiftHash(c)) return false;
    } else if (r.witnessDigest !== null) return false;
  }
  for (let i = 0; i < p.groupControls.length; i++) {
    const g = p.groupControls[i];
    if (g.h !== ["7", "11"][i] || g.weight !== ["2", "4"][i] ||
      g.profiles !== ["15", "495"][i] || Number(g.applicableProfiles) > Number(g.profiles) ||
      Number(g.misses) > Number(g.profiles) || Number(g.classificationMismatches) > Number(g.profiles)) return false;
  }
  const content = { inputs: p.inputs, primes: p.primes, primeManifestDigest: p.primeManifestDigest, rows: p.rows,
    rowsDigest: p.rowsDigest, separateControl: p.separateControl, groupControls: p.groupControls };
  return p.contentDigest === adaptiveShiftHash(content);
}

/** Invariant comparison only, not an authenticated independent-run certificate. */
export function compareAdaptiveShiftReplay(primary: unknown, replay: unknown) {
  if (!verifyAdaptiveShiftPacket(primary) || !verifyAdaptiveShiftPacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.rows, replay.rows) &&
    isDeepStrictEqual(primary.groupControls, replay.groupControls) && isDeepStrictEqual(primary.primes, replay.primes)
    ? "PASS" as const : "MISMATCH" as const;
}
