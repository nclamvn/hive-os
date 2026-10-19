import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";

export const CHARACTER_SHIFT_INPUTS = { targets: ["200023321", "200602081", "200656681", "131433121"],
  shifts: ["3", "7", "11", "19", "23", "31", "43", "47", "59", "67", "71", "79", "83", "103", "107"], preference: "LEGENDRE_P_OVER_H_NEGATIVE" };
export const CHARACTER_SHIFT_LIMITS = { seconds: 60, maxRows: 1000, maxStateInsertions: 2000000, maxOutputBytes: 2097152 };
export const CHARACTER_SHIFT_SCOPE = "Four selected exposed development targets; every prime h=3 mod4 up to107, Type II only. Character preference is routing, never QR impossibility. Complete signed images, canonical partitions and miss defects are finite arithmetic evidence, not a universal shift bound, held-out benchmark, root proof or novelty certificate. No agent-cycle authority.";
export const characterShiftHash = (v: unknown) => createHash("sha256").update(canonicalJson(v)).digest("hex");
const decimal = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), positive = z.string().regex(/^[1-9][0-9]{0,29}$/);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const witness = z.object({ u: positive, v: positive, k: positive, A: positive, x: positive, y: positive, z: positive }).strict();
const defect = z.object({ stabilizer: z.array(positive).min(1).max(106), size: positive, index: positive,
  visibleMass: decimal, nonresidue: z.boolean(), visibleFactors: z.array(z.object({ prime: positive, exponent: positive,
    residue: positive, quotientOrder: positive }).strict()).max(20), conditions: z.object({ indexEven: z.boolean(),
    indexTwoModFour: z.boolean(), nonresidueIndexAtLeastSix: z.boolean(), visibleMassBound: z.boolean(), ordersBeyondIntervals: z.boolean() }).strict() }).strict();
const row = z.object({ p: positive, h: positive, T: positive, factors: z.array(z.tuple([positive, positive])).max(20),
  image: z.array(positive).min(1).max(106), count: positive, hit: z.boolean(), canonical: witness.nullable(),
  character: z.object({ legendre: z.enum(["-1", "+1"]), preferred: z.boolean() }).strict(), defect: defect.nullable(),
  imageDigest: hash, witnessDigest: hash.nullable(), defectDigest: hash.nullable(), rowDigest: hash }).strict();
const routing = z.object({ p: positive, complete: z.boolean(), preferredShifts: z.array(positive).max(15),
  smallestSuccessfulFull: positive.nullable(), smallestSuccessfulPreferred: positive.nullable(), hitRows: decimal, preferredHitRows: decimal }).strict();
export const characterShiftPacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_CHARACTER_SHIFT_DEFECTS_V1"),
  status: z.enum(["COMPLETE", "PARTIAL"]), inputs: z.unknown(), limits: z.object({ seconds: z.number().positive().max(60),
    maxRows: z.number().int().positive().max(1000), maxStateInsertions: z.number().int().positive().max(2000000),
    maxOutputBytes: z.number().int().min(4096).max(2097152) }).strict(), shiftManifestDigest: hash,
  rows: z.array(row).max(60), rowsDigest: hash, routing: z.array(routing).length(4), routingDigest: hash,
  contentDigest: hash, pending: z.object({ phase: z.enum(["ROW", "FINALIZE"]), p: positive.optional(), h: positive.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "OUTPUT_LIMIT", "REPLAY_TIME_LIMIT", "REPLAY_PAIR_LIMIT"]).nullable(),
  scope: z.literal(CHARACTER_SHIFT_SCOPE), runtime: z.union([
    z.object({ stateInsertions: decimal, elapsedMs: decimal, outputBytes: decimal }).strict(),
    z.object({ pairChecks: decimal, elapsedMs: decimal, outputBytes: decimal }).strict(),
  ]), packetDigest: hash }).strict();
export type CharacterShiftPacket = z.infer<typeof characterShiftPacketSchema>;
function prime(n: number) { if (!Number.isSafeInteger(n) || n < 2 || n > 201000000) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function pow(b: number, e: number, m: number) { let r = 1; while (e) { if (e % 2) r = r * b % m; b = b * b % m; e = Math.floor(e / 2); } return r; }
const B = BigInt, one = B(1), zero = B(0);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }

/** Direct stabilizer of the supplied set, not a claim that that set is complete. */
export function characterShiftDefect(factors: [string, string][], image: string[], h: number) {
  const S = new Set(image.map(Number)), H: number[] = [];
  for (let r = 1; r < h; r++) if ([...S].every(s => S.has(r * s % h))) H.push(r);
  const n = (h - 1) / H.length;
  const visibleFactors = factors.filter(([q]) => !H.includes(Number(q) % h)).map(([prime, exponent]) => {
    const residue = Number(prime) % h;
    let order = 1; while (order < h && !H.includes(pow(residue, order, h))) order++;
    return { prime, exponent, residue: String(residue), quotientOrder: String(order) };
  });
  const V = visibleFactors.reduce((s, f) => s + Number(f.exponent), 0);
  const nonresidue = factors.some(([q]) => pow(Number(q) % h, (h - 1) / 2, h) === h - 1);
  return { stabilizer: H.map(String), size: String(H.length), index: String(n), visibleMass: String(V), nonresidue, visibleFactors,
    conditions: { indexEven: n % 2 === 0, indexTwoModFour: n % 4 === 2, nonresidueIndexAtLeastSix: !nonresidue || n >= 6,
      visibleMassBound: 2 * V <= n - 2, ordersBeyondIntervals: visibleFactors.every(f => Number(f.quotientOrder) > 2 * Number(f.exponent) + 1) } };
}
export function characterShiftRouting(rows: CharacterShiftPacket["rows"]) {
  return CHARACTER_SHIFT_INPUTS.targets.map(p => {
    const rs = rows.filter(r => r.p === p), hits = rs.filter(r => r.hit), preferred = rs.filter(r => r.character.preferred), ph = hits.filter(r => r.character.preferred);
    return { p, complete: rs.length === 15, preferredShifts: preferred.map(r => r.h), smallestSuccessfulFull: hits[0]?.h ?? null,
      smallestSuccessfulPreferred: ph[0]?.h ?? null, hitRows: String(hits.length), preferredHitRows: String(ph.length) };
  });
}

/** Fixed domain and arithmetic/hash invariants; fresh independent comparison certifies full finite images/canonical minima. */
export function verifyCharacterShiftPacket(raw: unknown): raw is CharacterShiftPacket {
  const parsed = characterShiftPacketSchema.safeParse(raw); if (!parsed.success) return false;
  const p = parsed.data;
  if (!isDeepStrictEqual(p.inputs, CHARACTER_SHIFT_INPUTS) || p.status === "COMPLETE" && !isDeepStrictEqual(p.limits, CHARACTER_SHIFT_LIMITS) ||
    p.shiftManifestDigest !== characterShiftHash(CHARACTER_SHIFT_INPUTS.shifts) || p.rowsDigest !== characterShiftHash(p.rows) ||
    p.routingDigest !== characterShiftHash(p.routing) || !isDeepStrictEqual(p.routing, characterShiftRouting(p.rows))) return false;
  const { packetDigest, ...body } = p;
  if (packetDigest !== characterShiftHash(body) || Number(p.runtime.outputBytes) !== Buffer.byteLength(canonicalJson(p)) ||
    Number(p.runtime.outputBytes) > p.limits.maxOutputBytes || p.rows.length > p.limits.maxRows ||
    p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds * 1000 ||
    "pairChecks" in p.runtime && Number(p.runtime.pairChecks) > 50000000 ||
    "stateInsertions" in p.runtime && Number(p.runtime.stateInsertions) > p.limits.maxStateInsertions) return false;
  if (p.status === "COMPLETE" && (p.rows.length !== 60 || p.pending !== null || p.reason !== null)) return false;
  if (p.status === "PARTIAL") {
    if (!p.pending || !p.reason) return false;
    if (p.pending.phase === "ROW" && (p.rows.length >= 60 || p.pending.p !== CHARACTER_SHIFT_INPUTS.targets[Math.floor(p.rows.length / 15)] ||
      p.pending.h !== CHARACTER_SHIFT_INPUTS.shifts[p.rows.length % 15])) return false;
    if (p.pending.phase === "FINALIZE" && (p.rows.length !== 60 || p.pending.p !== undefined || p.pending.h !== undefined)) return false;
  }
  for (let i = 0; i < p.rows.length; i++) {
    const r = p.rows[i], P = B(r.p), h = Number(r.h), n = Number(r.p), T = B(r.T);
    if (r.p !== CHARACTER_SHIFT_INPUTS.targets[Math.floor(i / 15)] || r.h !== CHARACTER_SHIFT_INPUTS.shifts[i % 15] ||
      !prime(n) || n % 840 !== 1 || !prime(h) || h % 4 !== 3 || n % h === 0 || (n + h) % 4 !== 0 || T !== B((n + h) / 4)) return false;
    let product = one, last = 1;
    for (const [q, e] of r.factors) {
      if (!prime(Number(q)) || Number(q) <= last || Number(e) > 30) return false;
      product *= B(q) ** B(e); last = Number(q);
    }
    const legendre = pow(n % h, (h - 1) / 2, h) === h - 1 ? "-1" : "+1";
    if (product !== T || !isDeepStrictEqual(r.character, { legendre, preferred: legendre === "-1" }) ||
      r.count !== String(r.image.length) || r.imageDigest !== characterShiftHash(r.image) ||
      r.image[0] !== "1" || r.image.some((v, j) => Number(v) >= h || j > 0 && Number(v) <= Number(r.image[j - 1])) ||
      r.hit !== r.image.includes(String(h - 1)) || r.hit !== Boolean(r.canonical)) return false;
    const { rowDigest, ...rowBody } = r; if (rowDigest !== characterShiftHash(rowBody)) return false;
    if (r.canonical) {
      const c = r.canonical, [u, v, k, A, x, y, z] = [c.u, c.v, c.k, c.A, c.x, c.y, c.z].map(B);
      const ds = [u * v * k, A * P * u * k, A * P * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      if (u > v || gcd(u, v) !== one || u * v * k !== T || u + v !== B(h) * A || !(x < y && y < z) ||
        !isDeepStrictEqual(ds, [x, y, z]) || B(4) * x * y * z !== P * (x * y + x * z + y * z) ||
        ds.filter(d => d % P === zero).length !== 2 || r.witnessDigest !== characterShiftHash(c) || r.defect !== null || r.defectDigest !== null) return false;
    } else {
      const d = characterShiftDefect(r.factors, r.image, h);
      if (r.witnessDigest !== null || !isDeepStrictEqual(r.defect, d) || !Object.values(d.conditions).every(Boolean) || r.defectDigest !== characterShiftHash(d)) return false;
    }
  }
  return p.contentDigest === characterShiftHash({ inputs: p.inputs, shiftManifestDigest: p.shiftManifestDigest, rows: p.rows,
    rowsDigest: p.rowsDigest, routing: p.routing, routingDigest: p.routingDigest });
}

/** Supplied JSON equality is not authenticated execution provenance. */
export function compareCharacterShiftReplay(primary: unknown, replay: unknown) {
  if (!verifyCharacterShiftPacket(primary) || !verifyCharacterShiftPacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.rows, replay.rows) && isDeepStrictEqual(primary.routing, replay.routing)
    ? "PASS" as const : "MISMATCH" as const;
}
