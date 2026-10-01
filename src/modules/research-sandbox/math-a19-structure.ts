import { createHash } from "node:crypto";

import { isPrimeInSurvey, MAX_RESIDUAL_SURVEY_N, verifyErdos242StrictWitness, type ErdosStrausWitness } from "./math-certificates";

export interface A19Factor { prime: number; exponent: number; residue: number }
/** Inverse-paired logarithm valuations in C18, using primitive root 2. */
export type A19Weights = [number, number, number, number, number, number, number, number, number];
export const A19_CAPS: Readonly<A19Weights> = [9, 4, 3, 4, 9, 1, 9, 4, 1];
/** Maximal closed capped boxes under the forced weight w2>=1. IDs are one-based. */
export const A19_CLOSED_MAXIMA: readonly Readonly<A19Weights>[] = [
  [0, 1, 0, 0, 2, 0, 0, 1, 0],
  [0, 1, 0, 0, 4, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 4, 0, 4, 0, 1, 0, 4, 0],
  [1, 1, 0, 0, 1, 0, 0, 0, 0],
  [1, 2, 1, 0, 0, 0, 0, 0, 0],
  [2, 1, 0, 1, 0, 0, 0, 0, 0],
  [2, 3, 0, 0, 0, 0, 0, 0, 0],
  [3, 1, 1, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [6, 1, 0, 0, 0, 0, 0, 0, 0],
];
const LOGS = [0, 0, 1, 13, 2, 16, 14, 6, 3, 8, 17, 12, 15, 5, 7, 11, 4, 10, 9] as const;

export interface A19Profile {
  method: "ERDOS_STRAUS_A19_STRUCTURE_V1";
  n: number;
  x: number;
  factors: A19Factor[];
  weights: A19Weights;
  status: "WITNESS" | "OBSTRUCTED";
  typeIIStatus: "WITNESS" | "OBSTRUCTED";
  obstructionBoxes: number[];
  nonIdentityValuation: number;
  divisor: string | null;
  witness: ErdosStrausWitness | null;
  profileDigest: string;
}

function factors(value: number): A19Factor[] {
  const result: A19Factor[] = [];
  let rest = value;
  for (let q = 2; q * q <= rest; q += q === 2 ? 1 : 2) {
    if (rest % q) continue;
    let exponent = 0;
    do { rest /= q; exponent++; } while (rest % q === 0);
    result.push({ prime: q, exponent, residue: q % 19 });
  }
  if (rest > 1) result.push({ prime: rest, exponent: 1, residue: rest % 19 });
  return result;
}

export function a19WeightsFromFactors(values: A19Factor[]): A19Weights {
  const weights: A19Weights = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const { residue, exponent } of values) {
    if (!Number.isSafeInteger(residue) || residue < 1 || residue > 18 ||
      !Number.isSafeInteger(exponent) || exponent < 1) throw new RangeError("Invalid A=19 unit factor");
    const log = LOGS[residue];
    const category = Math.min(log, 18 - log);
    if (category) weights[category - 1] += exponent;
  }
  return weights;
}

export function a19ObstructionBoxes(weights: A19Weights): number[] {
  if (weights.length !== 9 || weights.some((w) => !Number.isSafeInteger(w) || w < 0) || weights[1] < 1) {
    throw new RangeError("A=19 classification requires nine nonnegative weights and forced w2>=1");
  }
  const capped = weights.map((w, i) => Math.min(w, A19_CAPS[i]!));
  return A19_CLOSED_MAXIMA.flatMap((box, i) => capped.every((w, j) => w <= box[j]!) ? [i + 1] : []);
}

/** Constructive path is independent of the antichain predicate. */
function signedPath(values: A19Factor[]): number[] | null {
  let paths = new Map<number, number[]>([[0, []]]);
  for (const { residue, exponent } of values) {
    const next = new Map<number, number[]>();
    for (const [sum, path] of paths) for (let t = -exponent; t <= exponent; t++) {
      const r = ((sum + LOGS[residue] * t) % 18 + 18) % 18;
      if (!next.has(r)) next.set(r, [...path, t]);
    }
    paths = next;
  }
  return paths.get(9) ?? null;
}

/** Exact fixed gate, not a universal assertion that the A=11 survivors are rescued. */
export function analyzeA19ResidualPrime(n: number): A19Profile {
  if (!Number.isSafeInteger(n) || n < 841 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("A=19 profile requires a prime p ≡ 1 (mod 840), p ≤ 200,000,000");
  }
  const x = (n + 19) / 4;
  const xFactors = factors(x);
  const all = [...xFactors, { prime: n, exponent: 1, residue: n % 19 }];
  const weights = a19WeightsFromFactors(all);
  const obstructionBoxes = a19ObstructionBoxes(weights);
  const nonIdentityValuation = weights.reduce((total, weight) => total + weight, 0);
  if (obstructionBoxes.length && !obstructionBoxes.includes(5) && nonIdentityValuation > 7) {
    throw new Error("A=19 mixed obstruction exceeds the proven packet bound");
  }
  const path = signedPath(all);
  if ((obstructionBoxes.length > 0) !== (path === null)) throw new Error("A=19 antichain and residue path disagree");
  let divisor: string | null = null;
  let witness: ErdosStrausWitness | null = null;
  if (path) {
    const b = BigInt(n) * BigInt(x);
    let d = BigInt(1);
    all.forEach(({ prime, exponent }, i) => { d *= BigInt(prime) ** BigInt(exponent + path[i]!); });
    if (d > b) d = b * b / d;
    const other = b * b / d;
    if ((b + d) % BigInt(19) || (b + other) % BigInt(19)) throw new Error("A=19 residue path fails divisibility");
    divisor = String(d);
    witness = { n: String(n), x: String(x), y: String((b + d) / BigInt(19)), z: String((b + other) / BigInt(19)) };
    if (!verifyErdos242StrictWitness(witness).valid) throw new Error("A=19 strict identity failed");
  }
  const payload = { method: "ERDOS_STRAUS_A19_STRUCTURE_V1" as const, n, x, factors: xFactors, weights,
    status: path ? "WITNESS" as const : "OBSTRUCTED" as const,
    typeIIStatus: signedPath(xFactors) ? "WITNESS" as const : "OBSTRUCTED" as const,
    obstructionBoxes, nonIdentityValuation, divisor, witness };
  return { ...payload, profileDigest: createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex") };
}

export function validateA19Profile(value: A19Profile): boolean {
  try { return JSON.stringify(value) === JSON.stringify(analyzeA19ResidualPrime(value.n)); }
  catch { return false; }
}
