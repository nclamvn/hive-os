import { createHash } from "node:crypto";

import { isPrimeInSurvey, MAX_RESIDUAL_SURVEY_N, verifyErdos242StrictWitness, type ErdosStrausWitness } from "./math-certificates";

export interface A11Factor { prime: number; exponent: number; residue: number }
/** Weights of log classes ±1, ±2, ±3, ±4, 5 in the cyclic group of order ten. */
export type A11Weights = [number, number, number, number, number];
export type A11Obstruction = "QR_ONLY" | "THIN_PRIMITIVE" | null;
export interface A11Profile {
  method: "ERDOS_STRAUS_A11_STRUCTURE_V1";
  n: number;
  x: number;
  factors: A11Factor[];
  weights: A11Weights;
  status: "WITNESS" | "OBSTRUCTED";
  typeIIStatus: "WITNESS" | "OBSTRUCTED";
  obstruction: A11Obstruction;
  divisor: string | null;
  witness: ErdosStrausWitness | null;
  profileDigest: string;
}

const LOGS = [0, 0, 1, 8, 2, 4, 9, 7, 3, 6, 5] as const;

function factors(value: number): A11Factor[] {
  const result: A11Factor[] = [];
  let remainder = value;
  for (let q = 2; q * q <= remainder; q += q === 2 ? 1 : 2) {
    if (remainder % q !== 0) continue;
    let exponent = 0;
    do { remainder /= q; exponent += 1; } while (remainder % q === 0);
    result.push({ prime: q, exponent, residue: q % 11 });
  }
  if (remainder > 1) result.push({ prime: remainder, exponent: 1, residue: remainder % 11 });
  return result;
}

export function a11WeightsFromFactors(values: A11Factor[]): A11Weights {
  const weights: A11Weights = [0, 0, 0, 0, 0];
  for (const { residue, exponent } of values) {
    if (!Number.isSafeInteger(residue) || residue < 1 || residue > 10 ||
      !Number.isSafeInteger(exponent) || exponent < 1) throw new RangeError("Invalid A=11 unit factor");
    const log = LOGS[residue];
    const category = Math.min(log, 10 - log);
    if (category) weights[category - 1] += exponent;
  }
  return weights;
}

/** Complete finite-group classification; not an assertion that another A gate must open. */
export function a11SignedBoxIsClosed(weights: A11Weights): boolean {
  if (weights.some((weight) => !Number.isSafeInteger(weight) || weight < 0)) throw new RangeError("Invalid A=11 valuation weights");
  const [a, b, c, d, e] = weights;
  if (e > 0) return false;
  if (a === 0 && c === 0) return true;
  if (b + d === 0) return (c === 0 && a <= 4) || (a === 0 && c <= 4) || (a === 1 && c === 1);
  if (b + d === 1) return (b === 1 && c === 0 && a <= 2) || (d === 1 && a === 0 && c <= 2);
  return false;
}

/** A separate constructive residue DP retains the actual factor exponents, including p. */
function signedPath(values: A11Factor[]): number[] | null {
  let paths = new Map<number, number[]>([[0, []]]);
  for (const { residue, exponent } of values) {
    const next = new Map<number, number[]>();
    const log = LOGS[residue];
    for (const [sum, path] of paths) {
      for (let t = -exponent; t <= exponent; t += 1) {
        const target = ((sum + log * t) % 10 + 10) % 10;
        if (!next.has(target)) next.set(target, [...path, t]);
      }
    }
    paths = next;
  }
  return paths.get(5) ?? null;
}

/** Unbounded written lemma, bounded implementation. Keeps Type I and Type II distinct. */
export function analyzeA11ResidualPrime(n: number): A11Profile {
  if (!Number.isSafeInteger(n) || n < 841 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("A=11 profile requires a prime p ≡ 1 (mod 840), p ≤ 200,000,000");
  }
  const x = (n + 11) / 4;
  const xFactors = factors(x);
  const allFactors = [...xFactors, { prime: n, exponent: 1, residue: n % 11 }];
  const weights = a11WeightsFromFactors(allFactors);
  const closed = a11SignedBoxIsClosed(weights);
  const path = signedPath(allFactors);
  if (closed !== (path === null)) throw new Error("A=11 obstruction theorem and constructive residue DP disagree");
  // 3|x, so nontrivial QR mass is at least one, and every remaining closed
  // profile is either pure quadratic splitting or the ±1 thin packet.
  const obstruction: A11Obstruction = !closed ? null : weights[0] === 0 && weights[2] === 0 && weights[4] === 0
    ? "QR_ONLY" : "THIN_PRIMITIVE";
  let divisor: string | null = null;
  let witness: ErdosStrausWitness | null = null;
  if (path) {
    const b = BigInt(n) * BigInt(x);
    let d = BigInt(1);
    allFactors.forEach(({ prime, exponent }, index) => { d *= BigInt(prime) ** BigInt(exponent + path[index]!); });
    if (d > b) d = b * b / d;
    const paired = b * b / d;
    if ((b + d) % BigInt(11) !== BigInt(0) || (b + paired) % BigInt(11) !== BigInt(0)) {
      throw new Error("A=11 balanced residue path fails divisibility");
    }
    divisor = String(d);
    witness = { n: String(n), x: String(x), y: String((b + d) / BigInt(11)), z: String((b + paired) / BigInt(11)) };
    if (!verifyErdos242StrictWitness(witness).valid) throw new Error("A=11 construction fails the strict identity");
  }
  const payload = {
    method: "ERDOS_STRAUS_A11_STRUCTURE_V1" as const, n, x, factors: xFactors,
    weights, status: closed ? "OBSTRUCTED" as const : "WITNESS" as const,
    typeIIStatus: signedPath(xFactors) === null ? "OBSTRUCTED" as const : "WITNESS" as const,
    obstruction, divisor, witness,
  };
  return { ...payload, profileDigest: createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex") };
}

export function validateA11Profile(profile: A11Profile): boolean {
  try { return JSON.stringify(profile) === JSON.stringify(analyzeA11ResidualPrime(profile.n)); }
  catch { return false; }
}
