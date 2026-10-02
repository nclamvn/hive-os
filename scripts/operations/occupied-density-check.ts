import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { BLOCK_COVERAGE_INPUTS, blockCoverageHash, blockCoveragePacketSchema, verifyBlockCoveragePacket } from "./block-coverage-check";
import type { BlockCoveragePacket } from "./block-coverage-check";

export const OCCUPIED_DENSITY_PINS = { primary: "1ac9f30c699e52e7d3e2784ce20535758323f76cbbb206431ab585a222c1338d", checker: "8b60055f1146212894e954e103723db4bc57e15fc55a7ed09ca544e55f80ff1a", replay: "5dbe06e076f0a8b010b03c248305d2601a4688b9bbd4711f849a437bc32dd0d0" };
export const OCCUPIED_DENSITY_BASE_CONTENT = "4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347";
export const OCCUPIED_DENSITY_BASE_ROWS = "e51794b81610642e49920bd9016835891f046d909de7a00ecdd0da61e52c5bee";
export const OCCUPIED_DENSITY_INPUTS = { baselineInputs: BLOCK_COVERAGE_INPUTS, policy: "INHERIT_TIP041_THEN_ASCENDING_ORIGINAL_OCCUPIED_HALF_DENSITY_V1", exposure: "ALL_191_EXPOSED_DEVELOPMENT" };
export const OCCUPIED_DENSITY_SCOPE = "FIXED_191_EXPOSED_ROWS_OCCUPIED_HALF_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM";
export const OCCUPIED_DENSITY_LIMITS = { seconds: 60, maxRows: 191, maxStateInsertions: 2000000, maxWorkSteps: 50000000, maxPairChecks: 50000000, maxOutputBytes: 8388608, checkerWorkCeiling: 50000000 };
export const occupiedDensityHash = blockCoverageHash;
const dec = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), pos = z.string().regex(/^[1-9][0-9]{0,29}$/), signed = z.string().regex(/^(0|-?[1-9][0-9]{0,2})$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^([PN][0-7]_h[1-9][0-9]{0,2}|C_r(0|[1-9][0-9]{0,2}))$/), vector = z.array(signed).max(16);
const match = z.object({ cosetA: pos, cosetB: pos, exponentsA: vector, exponentsB: vector, liftResidue: pos, liftExponents: vector }).strict();
const witness = z.object({ u: pos, v: pos, k: pos, A: pos, x: pos, y: pos, z: pos }).strict();
const certificate = z.object({ kind: z.literal("OCCUPIED_DENSITY"), attemptIndex: dec, partitionMask: pos, match, exponents: vector, orientation: z.enum(["AS_CONSTRUCTED", "INVERTED"]), witness }).strict();
const decision = z.object({ attemptIndex: dec, baselineAttemptDigest: hash, halfADigest: hash, halfBDigest: hash, mask: pos, occupiedA: pos, occupiedB: pos, quotientOrder: pos, sufficient: z.boolean() }).strict();
const status = z.enum(["INHERITED_CERTIFIED", "DENSITY_CERTIFIED", "NOT_CERTIFIED"]);
const rowSchema = z.object({ id, baselineRowDigest: hash, baselineStatus: z.enum(["SINGLE_CHAIN_CERTIFIED", "BLOCK_CHAIN_CERTIFIED", "ENERGY_CERTIFIED", "NOT_CERTIFIED"]), status,
  decisions: z.array(decision).max(32767), allocation: z.object({ totalPartitions: dec, evaluatedPartitions: dec, notEvaluatedPartitions: dec }).strict(), certificate: certificate.nullable(), rowDigest: hash }).strict();
const counts = z.object({ INHERITED_CERTIFIED: dec, DENSITY_CERTIFIED: dec, NOT_CERTIFIED: dec }).strict();
const sourcePins = z.object({ primary: hash, checker: hash, replay: hash }).strict();
const observedPins = z.object({ primary: hash.nullable(), checker: hash.nullable(), replay: hash.nullable() }).strict();
export const occupiedDensityPacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_OCCUPIED_HALF_DENSITY_V1"), status: z.enum(["COMPLETE", "PARTIAL"]), inputs: z.unknown(),
  baseline: z.object({ packet: blockCoveragePacketSchema.nullable(), expectedSourcePins: sourcePins, observedSourcePins: observedPins, omitted: z.boolean() }).strict(),
  baselineContentDigest: hash.nullable(), baselineRowsDigest: hash.nullable(), rows: z.array(rowSchema).max(191), rowsDigest: hash,
  summary: z.object({ complete: z.boolean(), counts, cohorts: z.object({ EXPOSED_71: counts, PRIMALITY_ONLY_120: counts }).strict() }).strict(),
  limits: z.object({ seconds: z.number().positive().max(60), maxRows: z.number().int().positive().max(191), maxStateInsertions: z.number().int().positive().max(2000000), maxWorkSteps: z.number().int().positive().max(50000000),
    maxPairChecks: z.number().int().positive().max(50000000), maxOutputBytes: z.number().int().min(32768).max(8388608), checkerWorkCeiling: z.literal(50000000) }).strict(),
  pending: z.object({ phase: z.enum(["BASELINE", "ROW", "FINALIZE"]), id: id.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "ROW_LIMIT", "STATE_LIMIT", "WORK_LIMIT", "PAIR_LIMIT", "OUTPUT_LIMIT", "BASELINE_PARTIAL", "DEPENDENCY_UNAVAILABLE", "DEPENDENCY_DRIFT", "BASELINE_INVALID"]).nullable(), scope: z.literal(OCCUPIED_DENSITY_SCOPE), contentDigest: hash,
  runtime: z.object({ baseStates: dec, baseWork: dec, basePairs: dec, additionalStates: dec, additionalWork: dec, additionalPairs: dec, stateInsertions: dec, workSteps: dec, pairChecks: dec, elapsedMs: dec, outputBytes: dec }).strict(), packetDigest: hash }).strict();
export type OccupiedDensityPacket = z.infer<typeof occupiedDensityPacketSchema>;
type BaseRow = BlockCoveragePacket["rows"][number];
type DensityRow = OccupiedDensityPacket["rows"][number];
const B = BigInt, one = B(1), zero = B(0);
function gcd(a: bigint, b: bigint) { while (b) [a, b] = [b, a % b]; return a; }
function pow(r: bigint, e: bigint, m: bigint, tick: () => void) { let v = one; for (; e > zero; e /= B(2), r = r*r % m) { tick(); if (e % B(2)) v = v*r % m; } return v; }
function pair(fs: BaseRow["factors"], z: string[]) { if (z.length !== fs.length) throw new Error("VECTOR_LENGTH"); let u = one, v = one;
  for (let i = 0; i < z.length; i++) { if (Math.abs(Number(z[i])) > Number(fs[i][1])) throw new Error("VALUATION_BOUND"); if (Number(z[i]) > 0) u *= B(fs[i][0]) ** B(z[i]); if (Number(z[i]) < 0) v *= B(fs[i][0]) ** B(-Number(z[i])); } return { u, v }; }
function coset(r: bigint, row: BaseRow, tick: () => void) { const m = B(row.m); let least = m; for (const k of row.chain.covered) { tick(); const value = r*B(k.residue) % m; if (value < least) least = value; } return String(least); }
function expectedCertificate(row: BaseRow, index: number, tick: () => void): z.infer<typeof certificate> {
  const a = row.attempts[index], m = B(row.m), M = B(row.groupOrder), lookup = new Map(a.B.frequencies.map(f => [f.coset, f]));
  for (const f of a.A.frequencies) {
    const cb = coset((m-one)*pow(B(f.coset), M-one, m, tick) % m, row, tick), g = lookup.get(cb); if (!g) continue;
    const liftResidue = String((m-one)*pow(B(f.residue)*B(g.residue) % m, M-one, m, tick) % m), lift = row.chain.covered.find(k => k.residue === liftResidue);
    if (!lift) throw new Error("UNPAID_LIFT");
    const raw = row.factors.map((_, i) => String(Number(f.exponents[i])+Number(g.exponents[i])+Number(lift.exponents[i]))), initial = pair(row.factors, raw);
    const invert = initial.u > initial.v, exponents = invert ? raw.map(t => String(-Number(t))) : raw, {u, v} = pair(row.factors, exponents), T = B(row.T), p = B(row.p);
    if (u >= v || gcd(u,v) !== one || T % (u*v) || (u+v) % m) throw new Error("PAIR_IDENTITY");
    const k = T/(u*v), A = (u+v)/m, ds = [T, A*p*u*k, A*p*v*k].sort((a,b) => a < b ? -1 : a > b ? 1 : 0); tick();
    if (ds[0] >= ds[1] || ds[1] >= ds[2] || ds.filter(d => d % p === zero).length !== 2 || B(4)*ds[0]*ds[1]*ds[2] !== p*(ds[0]*ds[1]+ds[0]*ds[2]+ds[1]*ds[2])) throw new Error("STRICT_IDENTITY");
    return {kind: "OCCUPIED_DENSITY", attemptIndex: String(index), partitionMask: a.mask, match: {cosetA:f.coset,cosetB:g.coset,exponentsA:f.exponents,exponentsB:g.exponents,liftResidue,liftExponents:lift.exponents}, exponents, orientation:invert?"INVERTED":"AS_CONSTRUCTED", witness:{u:String(u),v:String(v),k:String(k),A:String(A),x:String(ds[0]),y:String(ds[1]),z:String(ds[2])}};
  }
  throw new Error("SUFFICIENT_WITHOUT_MATCH");
}
function summary(rows: DensityRow[], complete: boolean) {
  const empty = () => ({ INHERITED_CERTIFIED: "0", DENSITY_CERTIFIED: "0", NOT_CERTIFIED: "0" }), result = {complete,counts:empty(),cohorts:{EXPOSED_71:empty(),PRIMALITY_ONLY_120:empty()}};
  rows.forEach((r,i) => { result.counts[r.status] = String(Number(result.counts[r.status])+1); const c = result.cohorts[BLOCK_COVERAGE_INPUTS.rows[i].cohort as "EXPOSED_71"|"PRIMALITY_ONLY_120"]; c[r.status] = String(Number(c[r.status])+1); }); return result;
}

/** Frozen known-content admission, not a default-limit rewrite of execution evidence.
 * Complete rows/frequencies are authenticated by the approved finite fingerprints.
 * Partial baseline validation uses immutable TIP-041's independently bounded checker.
 * Claimed counters remain collector evidence, not externally signed CPU attestation. */
export function verifyOccupiedDensityBaseline(base: BlockCoveragePacket, limits: OccupiedDensityPacket["limits"]): boolean {
  const {packetDigest,...body} = base;
  if (!isDeepStrictEqual(base.inputs, BLOCK_COVERAGE_INPUTS) || packetDigest !== occupiedDensityHash(body) || base.rowsDigest !== occupiedDensityHash(base.rows) ||
    base.contentDigest !== occupiedDensityHash({inputs:base.inputs,rows:base.rows,rowsDigest:base.rowsDigest,summary:base.summary}) ||
    Number(base.runtime.outputBytes) !== Buffer.byteLength(JSON.stringify(base)) || Number(base.runtime.outputBytes) > base.limits.maxOutputBytes ||
    Number(base.runtime.workSteps) > base.limits.maxWorkSteps || Number(base.runtime.stateInsertions) > base.limits.maxStateInsertions || Number(base.runtime.pairChecks ?? 0) > limits.maxPairChecks) return false;
  const expected = {seconds:limits.seconds,maxRows:191,maxStateInsertions:limits.maxStateInsertions,maxWorkSteps:limits.maxWorkSteps,maxOutputBytes:limits.maxOutputBytes,maxSmallGroupElements:53,maxSubgroupsPerAttempt:4096};
  if (!isDeepStrictEqual(base.limits, expected)) return false;
  if (base.status === "PARTIAL") return verifyBlockCoveragePacket(base);
  return base.rows.length === 191 && base.pending === null && base.reason === null && base.summary.complete && Number(base.runtime.elapsedMs) < limits.seconds*1000 && base.contentDigest === OCCUPIED_DENSITY_BASE_CONTENT && base.rowsDigest === OCCUPIED_DENSITY_BASE_ROWS;
}

/** Scoped fixed-corpus integrity, actual declared limits and deterministic paid lift.
 * It cannot independently authenticate producer counters or replace fresh replay. */
export function verifyOccupiedDensityPacket(raw: unknown): raw is OccupiedDensityPacket {
  try {
    const parsed = occupiedDensityPacketSchema.safeParse(raw); if (!parsed.success) return false; const p = parsed.data, {packetDigest,...body} = p;
    if (!isDeepStrictEqual(p.inputs,OCCUPIED_DENSITY_INPUTS) || !isDeepStrictEqual(p.baseline.expectedSourcePins,OCCUPIED_DENSITY_PINS) || packetDigest !== occupiedDensityHash(body) ||
      Number(p.runtime.outputBytes) !== Buffer.byteLength(JSON.stringify(p)) || Number(p.runtime.outputBytes) > p.limits.maxOutputBytes || p.rows.length > p.limits.maxRows ||
      B(p.runtime.stateInsertions) !== B(p.runtime.baseStates)+B(p.runtime.additionalStates) || B(p.runtime.workSteps) !== B(p.runtime.baseWork)+B(p.runtime.additionalWork) || B(p.runtime.pairChecks) !== B(p.runtime.basePairs)+B(p.runtime.additionalPairs) ||
      B(p.runtime.stateInsertions)>B(p.limits.maxStateInsertions) || B(p.runtime.workSteps)>B(p.limits.maxWorkSteps) || B(p.runtime.pairChecks)>B(p.limits.maxPairChecks) ||
      p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds*1000) return false;
    const base = p.baseline.packet;
    if (!base) {
      if (p.status !== "PARTIAL" || !p.baseline.omitted || p.rows.length || p.baselineContentDigest !== null || p.baselineRowsDigest !== null || !isDeepStrictEqual(p.pending,{phase:"BASELINE"}) || !["TIME_LIMIT","OUTPUT_LIMIT","DEPENDENCY_UNAVAILABLE","DEPENDENCY_DRIFT","BASELINE_INVALID"].includes(p.reason ?? "")) return false;
    } else {
      if (p.baseline.omitted || !isDeepStrictEqual(p.baseline.observedSourcePins,OCCUPIED_DENSITY_PINS) || !verifyOccupiedDensityBaseline(base,p.limits) ||
        p.baselineContentDigest !== base.contentDigest || p.baselineRowsDigest !== base.rowsDigest || p.runtime.baseStates !== base.runtime.stateInsertions || p.runtime.baseWork !== base.runtime.workSteps || p.runtime.basePairs !== (base.runtime.pairChecks ?? "0")) return false;
      if (base.status !== "COMPLETE") {
        if (p.status !== "PARTIAL" || p.reason !== "BASELINE_PARTIAL" || p.rows.length || !isDeepStrictEqual(p.pending,{phase:"BASELINE"}) || B(p.runtime.additionalStates)+B(p.runtime.additionalWork)+B(p.runtime.additionalPairs) !== zero) return false;
      } else {
        const next = p.rows.length < 191 ? {phase:"ROW",id:BLOCK_COVERAGE_INPUTS.rows[p.rows.length].id} : {phase:"FINALIZE"};
        if (p.status === "COMPLETE" ? p.rows.length !== 191 || p.pending !== null || p.reason !== null : !p.reason || !isDeepStrictEqual(p.pending,next) || ["BASELINE_PARTIAL","DEPENDENCY_DRIFT","DEPENDENCY_UNAVAILABLE","BASELINE_INVALID"].includes(p.reason)) return false;
        let work = 0; const tick = () => { if (++work > p.limits.checkerWorkCeiling) throw new Error("CHECKER_WORK_LIMIT"); };
        for (let ri = 0; ri < p.rows.length; ri++) {
          const row = p.rows[ri], original = base.rows[ri], {rowDigest,...rowBody} = row;
          if (row.id !== original.id || row.baselineRowDigest !== original.rowDigest || row.baselineStatus !== original.status || rowDigest !== occupiedDensityHash(rowBody)) return false;
          const inherited = original.status !== "NOT_CERTIFIED", total = inherited ? 0 : original.attempts.length;
          if (!isDeepStrictEqual(row.allocation,{totalPartitions:String(total),evaluatedPartitions:String(row.decisions.length),notEvaluatedPartitions:String(total-row.decisions.length)})) return false;
          if (inherited) { if (row.status !== "INHERITED_CERTIFIED" || row.decisions.length || row.certificate !== null) return false; continue; }
          const first = original.attempts.findIndex(a => a.A.frequencies.length+a.B.frequencies.length > Number(a.quotientOrder));
          const length = first < 0 ? total : first+1;
          if (row.decisions.length !== length || row.status !== (first < 0 ? "NOT_CERTIFIED" : "DENSITY_CERTIFIED")) return false;
          for (let i = 0; i < length; i++) { tick(); const a = original.attempts[i];
            if (!isDeepStrictEqual(row.decisions[i],{attemptIndex:String(i),baselineAttemptDigest:a.attemptDigest,halfADigest:occupiedDensityHash(a.A),halfBDigest:occupiedDensityHash(a.B),mask:a.mask,occupiedA:String(a.A.frequencies.length),occupiedB:String(a.B.frequencies.length),quotientOrder:a.quotientOrder,sufficient:a.A.frequencies.length+a.B.frequencies.length>Number(a.quotientOrder)})) return false;
          }
          if (first < 0 ? row.certificate !== null : !isDeepStrictEqual(row.certificate,expectedCertificate(original,first,tick))) return false;
        }
      }
    }
    return p.rowsDigest === occupiedDensityHash(p.rows) && isDeepStrictEqual(p.summary,summary(p.rows,p.status === "COMPLETE")) && p.contentDigest === occupiedDensityHash({inputs:p.inputs,baselineContentDigest:p.baselineContentDigest,baselineRowsDigest:p.baselineRowsDigest,rows:p.rows,rowsDigest:p.rowsDigest,summary:p.summary});
  } catch { return false; }
}
export function compareOccupiedDensityReplay(primary: unknown, replay: unknown) {
  if (!verifyOccupiedDensityPacket(primary) || !verifyOccupiedDensityPacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.rows,replay.rows) && isDeepStrictEqual(primary.summary,replay.summary) &&
    isDeepStrictEqual(primary.baseline.packet?.rows,replay.baseline.packet?.rows) ? "PASS" as const : "MISMATCH" as const;
}

/** Abstract finite-group pigeonhole control only, never campaign/root admission. */
export function occupiedDensityAbstractPredicate(order: number, A: readonly number[], C: readonly number[]) {
  if (!Number.isSafeInteger(order) || order < 1 || order > 201000000 || ![A,C].every(S => Array.isArray(S) && new Set(S).size === S.length && S.every(n => Number.isSafeInteger(n) && n >= 0 && n < order))) throw new RangeError("Distinct canonical cosets required");
  return {occupiedA:String(A.length),occupiedB:String(C.length),quotientOrder:String(order),sufficient:A.length+C.length>order};
}
