import { createHash } from "node:crypto";

import { isPrimeInSurvey, MAX_RESIDUAL_SURVEY_N, verifyErdos242StrictWitness, type ErdosStrausWitness } from "./math-certificates";

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function divisors(value: number): number[] {
  let remainder = value;
  let ds = [1];
  for (let q = 2; q * q <= remainder; q += q === 2 ? 1 : 2) {
    let exponent = 0;
    while (remainder % q === 0) { remainder /= q; exponent++; }
    if (!exponent) continue;
    const previous = ds;
    ds = [];
    let power = 1;
    for (let e = 0; e <= exponent; e++, power *= q) for (const d of previous) ds.push(d * power);
  }
  if (remainder > 1) ds = [...ds, ...ds.map((d) => d * remainder)];
  return ds.sort((a, b) => a - b);
}

function seal<T extends object>(payload: T): T & { digest: string } {
  return { ...payload, digest: createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex") };
}

/** Algebraic family only. Admissibility is NOT evidence of simultaneous primes. */
export function neutralCorridorFamily(shifts: readonly number[]) {
  if (!shifts.length || shifts.length > 16 || shifts.some((a, i) =>
    !Number.isSafeInteger(a) || a < 3 || a > 63 || a % 4 !== 3 || (i > 0 && a <= shifts[i - 1]!))) {
    throw new RangeError("Use distinct increasing shifts 3,7,...,63");
  }
  let spacing = BigInt(840);
  for (const a of shifts) {
    const term = BigInt(a * (a + 1));
    let x = spacing, y = term;
    while (y !== BigInt(0)) [x, y] = [y, x % y];
    spacing = spacing / x * term;
  }
  return seal({ method: "ERDOS_STRAUS_NEUTRAL_FAMILY_V1" as const, shifts: [...shifts],
    spacing: spacing.toString(), primeSlope: spacing.toString(),
    cofactorSlopes: shifts.map((a) => ({ a, slope: (spacing / BigInt(a + 1)).toString(), core: (a + 1) / 4 })),
    constantTerm: 1, admissibilityWitness: "t=0 mod every prime",
    infinitePrimeStatus: "CONDITIONAL_ON_DICKSON_NOT_PROVED" as const });
}

/** Replay only a bounded prime tuple. No assertion about other t or other gates. */
export function analyzeNeutralCorridor(shifts: readonly number[], t: number) {
  const family = neutralCorridorFamily(shifts);
  if (!Number.isSafeInteger(t) || t < 1 || t > 100_000) throw new RangeError("t must be within 1..100000");
  const candidate = BigInt(family.spacing) * BigInt(t) + BigInt(1);
  if (candidate > BigInt(MAX_RESIDUAL_SURVEY_N)) throw new RangeError("Neutral tuple exceeds the 200-million replay domain");
  const n = Number(candidate);
  if (!isPrimeInSurvey(n)) return null;
  const rows = [];
  for (const { a, slope, core } of family.cofactorSlopes) {
    const cofactor = Number(BigInt(slope) * BigInt(t) + BigInt(1));
    if (!isPrimeInSurvey(cofactor)) return null;
    if (n % a !== 1 || cofactor % a !== 1) throw new Error("Neutral progression mismatch");
    // All variable prime factors are neutral, so only core^2 divisor residues remain.
    const residues = [...new Set(divisors(core * core).map((d) => d % a))].sort((a, b) => a - b);
    if (residues.includes(a - core)) throw new Error("Impossible core obstruction");
    rows.push({ a, x: core * cofactor, core, cofactor, divisorResidues: residues, forbiddenResidue: a - core });
  }
  return seal({ method: "ERDOS_STRAUS_NEUTRAL_TUPLE_V1" as const, familyDigest: family.digest,
    n, t, rows, status: "DECLARED_FIXED_GATES_CLOSED" as const });
}

export type ModulatorMode = "FULL" | "UNIT_MODULATOR";

/** Conditional barrier for any fixed parameter box, not a prime generator. */
export function neutralModulatorFamily(bound: number) {
  if (!Number.isSafeInteger(bound) || bound < 1 || bound > 8) throw new RangeError("Parameter family bound is 1..8");
  const pairs = [];
  let spacing = BigInt(840);
  for (let a = 1; a <= bound; a++) for (let u = 1; u <= bound; u++) {
    if (gcd(a, u) !== 1) continue;
    pairs.push({ a, u, core: a + u, modulus: 4 * a * u });
    const term = BigInt(4 * u * (a + u));
    let x = spacing, y = term;
    while (y !== BigInt(0)) [x, y] = [y, x % y];
    spacing = spacing / x * term;
  }
  return seal({ method: "ERDOS_STRAUS_NEUTRAL_MODULATOR_FAMILY_V1" as const, bound,
    spacing: spacing.toString(), primeSlope: spacing.toString(),
    cofactorSlopes: pairs.map(({ a, u, core, modulus }) => ({ a, u, core, modulus,
      slope: (BigInt(a) * spacing / BigInt(core)).toString() })),
    constantTerm: 1, admissibilityWitness: "t=0 mod every prime",
    infinitePrimeStatus: "CONDITIONAL_ON_DICKSON_NOT_PROVED" as const });
}

export interface ModulatorConstruction { a: number; u: number; s: number; v: number; k: number; shift: number }
export interface ModulatorEvidence {
  method: "ERDOS_STRAUS_MODULATOR_BOX_V1";
  n: number;
  bound: number;
  mode: ModulatorMode;
  status: "WITNESS" | "NOT_FOUND_IN_BOX";
  minimumDepth: number | null;
  pairsChecked: number;
  construction: ModulatorConstruction | null;
  witness: ErdosStrausWitness | null;
  strictDigest: string | null;
  digest: string;
}

/** Known Type-II sufficient identity. A missed bounded box is never a root refutation. */
export function searchModulatorBox(n: number, bound: number, mode: ModulatorMode = "FULL"): ModulatorEvidence {
  if (!Number.isSafeInteger(n) || n < 841 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("Require a residual prime within 841..200000000");
  }
  if (!Number.isSafeInteger(bound) || bound < 1 || bound > 8 || !["FULL", "UNIT_MODULATOR"].includes(mode)) {
    throw new RangeError("Require a supported mode and parameter bound 1..8");
  }
  let pairsChecked = 0;
  for (let depth = 1; depth <= bound; depth++) {
    for (let a = 1; a <= depth; a++) for (let u = 1; u <= depth; u++) {
      if (Math.max(a, u) !== depth || gcd(a, u) !== 1 || (mode === "UNIT_MODULATOR" && a !== 1)) continue;
      pairsChecked++;
      const value = a * n + u;
      for (const s of divisors(value)) {
        if ((s + 1) % (4 * u * a) !== 0) continue;
        const v = value / s, k = (s + 1) / (4 * u * a), shift = (u + v) / a;
        if (!Number.isSafeInteger(shift) || shift % 4 !== 3) throw new Error("Modulator reconstruction failed");
        const np = BigInt(n), ap = BigInt(a), up = BigInt(u), vp = BigInt(v), kp = BigInt(k);
        const denominators = [up * vp * kp, ap * np * up * kp, ap * np * vp * kp]
          .sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        const witness = { n: String(n), x: String(denominators[0]), y: String(denominators[1]), z: String(denominators[2]) };
        const strict = verifyErdos242StrictWitness(witness);
        if (!strict.valid) continue; // Repeated denominators do not meet Erdős 242.
        if (denominators.filter((d) => d % np === BigInt(0)).length !== 2) throw new Error("Type II attribution failed");
        return seal({ method: "ERDOS_STRAUS_MODULATOR_BOX_V1" as const, n, bound, mode,
          status: "WITNESS" as const, minimumDepth: depth, pairsChecked,
          construction: { a, u, s, v, k, shift }, witness, strictDigest: strict.benchmarkDigest });
      }
    }
  }
  return seal({ method: "ERDOS_STRAUS_MODULATOR_BOX_V1" as const, n, bound, mode,
    status: "NOT_FOUND_IN_BOX" as const, minimumDepth: null, pairsChecked,
    construction: null, witness: null, strictDigest: null });
}

export function validateModulatorEvidence(evidence: ModulatorEvidence): boolean {
  try { return JSON.stringify(searchModulatorBox(evidence.n, evidence.bound, evidence.mode)) === JSON.stringify(evidence); }
  catch { return false; }
}
