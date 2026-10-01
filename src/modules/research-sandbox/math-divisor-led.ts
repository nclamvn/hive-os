import { createHash } from "node:crypto";

import { isPrimeInSurvey, MAX_RESIDUAL_SURVEY_N, verifyErdos242StrictWitness, type ErdosStrausWitness } from "./math-certificates";
import type { ModulatorConstruction } from "./math-adaptive-corridor";

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function seal<T extends object>(payload: T): T & { digest: string } {
  return { ...payload, digest: createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex") };
}

function checkN(n: number) {
  if (!Number.isSafeInteger(n) || n < 841 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("Require a residual prime within 841..200000000");
  }
}

function smallDivisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d * d <= n; d++) if (n % d === 0) {
    out.push(d);
    if (d * d !== n) out.push(n / d);
  }
  return out.sort((a, b) => a - b);
}

export type DivisorMode = "ALL" | "PRIME_ONLY_DIAGNOSTIC";
export interface DivisorLedEvidence {
  method: "ERDOS_STRAUS_DIVISOR_LED_V1";
  n: number;
  maxS: number;
  mode: DivisorMode;
  status: "WITNESS" | "NOT_FOUND_IN_S_INTERVAL";
  candidatesChecked: number;
  aDivisorsChecked: number;
  firstS: number | null;
  construction: ModulatorConstruction | null;
  witness: ErdosStrausWitness | null;
  strictDigest: string | null;
  digest: string;
}

/** Exhaustive for normalized sufficient constructions with 3<=s<=maxS, not all Type I/II. */
export function searchDivisorLed(n: number, maxS: number, mode: DivisorMode = "ALL"): DivisorLedEvidence {
  checkN(n);
  if (!Number.isSafeInteger(maxS) || maxS < 3 || maxS > 100_000 || !["ALL", "PRIME_ONLY_DIAGNOSTIC"].includes(mode)) {
    throw new RangeError("Require maxS within 3..100000 and a supported divisor mode");
  }
  let candidatesChecked = 0, aDivisorsChecked = 0;
  for (let s = 3; s <= maxS; s += 4) {
    if (mode === "PRIME_ONLY_DIAGNOSTIC" && !isPrimeInSurvey(s)) continue;
    candidatesChecked++;
    const m = (s + 1) / 4;
    for (const a of smallDivisors(m)) {
      aDivisorsChecked++;
      // Since au|m and m<s, any positive u is <s. Its residue determines it uniquely.
      const u = (s - (a * n) % s) % s;
      if (u === 0 || a * u > m || m % (a * u) !== 0 || gcd(a, u) !== 1) continue;
      const v = (a * n + u) / s, k = m / (a * u), shift = (u + v) / a;
      if (!Number.isSafeInteger(v) || !Number.isSafeInteger(shift) || shift % 4 !== 3) throw new Error("Inverse construction failed");
      const ap = BigInt(a) * BigInt(n), up = BigInt(u), vp = BigInt(v), kp = BigInt(k);
      const ds = [up * vp * kp, ap * up * kp, ap * vp * kp].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
      const witness = { n: String(n), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
      const strict = verifyErdos242StrictWitness(witness);
      if (!strict.valid) continue;
      if (ds.filter((d) => d % BigInt(n) === BigInt(0)).length !== 2) throw new Error("Type II attribution failed");
      return seal({ method: "ERDOS_STRAUS_DIVISOR_LED_V1" as const, n, maxS, mode, status: "WITNESS" as const,
        candidatesChecked, aDivisorsChecked, firstS: s, construction: { a, u, s, v, k, shift },
        witness, strictDigest: strict.benchmarkDigest });
    }
  }
  return seal({ method: "ERDOS_STRAUS_DIVISOR_LED_V1" as const, n, maxS, mode, status: "NOT_FOUND_IN_S_INTERVAL" as const,
    candidatesChecked, aDivisorsChecked, firstS: null, construction: null, witness: null, strictDigest: null });
}

export function validateDivisorLedEvidence(evidence: DivisorLedEvidence): boolean {
  try { return JSON.stringify(searchDivisorLed(evidence.n, evidence.maxS, evidence.mode)) === JSON.stringify(evidence); }
  catch { return false; }
}

/** Dirichlet supplies infinitely many primes in this progression, not an escape. */
export function fixedDivisorProgressionBarrier(maxS: number) {
  if (!Number.isSafeInteger(maxS) || maxS < 3 || maxS > 63) throw new RangeError("Family builder bound is 3..63");
  let spacing = BigInt(840);
  const divisors = [];
  for (let s = 3; s <= maxS; s += 4) {
    let x = spacing, y = BigInt(s);
    while (y !== BigInt(0)) [x, y] = [y, x % y];
    spacing = spacing / x * BigInt(s);
    divisors.push(s);
  }
  return seal({ method: "ERDOS_STRAUS_FIXED_DIVISOR_BARRIER_V1" as const, maxS, divisors,
    spacing: spacing.toString(), primeResidue: 1,
    infinitudeBasis: "DIRICHLET_KNOWN_THEOREM" as const,
    excluded: "Normalized modulator constructions using these s only",
    scope: "No Type I exclusion, no root refutation; elementary application not a novelty claim" });
}

/** Exact prime residue atlas. Nonresiduosity alone is not a sufficient hit. */
export function primeDivisorResidueAtlas(q: number) {
  if (!Number.isSafeInteger(q) || q < 3 || q > 10000 || q % 4 !== 3 || !isPrimeInSurvey(q)) {
    throw new RangeError("Atlas requires a prime q=3 mod4 within 3..10000");
  }
  const m = (q + 1) / 4, pairs = [];
  const residues = new Set<number>();
  for (const a of smallDivisors(m)) for (const u of smallDivisors(m / a)) {
    if (gcd(a, u) !== 1) continue;
    // Tiny, independently checkable inverse; neither floating division nor a field assumption on composite s.
    let inverse = 1;
    while (a * inverse % q !== 1) inverse++;
    const residue = (q - u * inverse % q) % q;
    pairs.push({ a, u, residue });
    residues.add(residue);
  }
  const squares = new Set<number>();
  for (let r = 1; r < q; r++) squares.add(r * r % q);
  if ([...residues].some((r) => r === 0 || squares.has(r))) throw new Error("Prime witness quadratic constraint failed");
  const nonresidues = Array.from({ length: q - 1 }, (_, i) => i + 1).filter((r) => !squares.has(r));
  return seal({ method: "ERDOS_STRAUS_PRIME_DIVISOR_ATLAS_V1" as const, q, m, pairs,
    usableResidues: [...residues].sort((a, b) => a - b),
    nonresiduesWithoutThisWitness: nonresidues.filter((r) => !residues.has(r)),
    duplicatePairResidues: pairs.length - residues.size,
    scope: "Modular construction eligibility only; not a strict identity for every representative" });
}

/** Written determinant lemma replay: bound only concerns pairs sharing THIS divisor. */
export function auditSharedDivisorSeparation(n: number, s: number, seedA: number, seedU: number, bound: number) {
  checkN(n);
  if (![s, seedA, seedU, bound].every(Number.isSafeInteger) || s < 3 || s > 100_000 ||
    seedA < 1 || seedU < 1 || seedA > 25_000 || seedU > 25_000 || bound < 1 || bound > 25_000 ||
    gcd(seedA, seedU) !== 1 || (seedA * n + seedU) % s !== 0) {
    throw new RangeError("Require a normalized dividing seed and bounded positive inputs");
  }
  const determinantBound = bound * Math.max(seedA, seedU);
  const separated = s > determinantBound;
  const seedInsideBox = Math.max(seedA, seedU) <= bound;
  return seal({ method: "ERDOS_STRAUS_SHARED_DIVISOR_SEPARATION_V1" as const, n, s, seedA, seedU, bound,
    determinantBound, seedInsideBox,
    conclusion: !separated ? "NO_SEPARATION_GUARANTEE" as const : seedInsideBox
      ? "ONLY_SEED_PAIR_CAN_SHARE_S_IN_BOX" as const : "NO_PAIR_IN_BOX_CAN_SHARE_S" as const,
    scope: "Same-divisor divisibility only; no exclusion of other s, parameters, or root solutions" });
}
