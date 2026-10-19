import { createHash } from "node:crypto";

import {
  isPrimeInSurvey,
  MAX_RESIDUAL_SURVEY_N,
  type ErdosStrausWitness,
  verifyErdosStrausWitness,
} from "./math-certificates";

export interface TwoGateFactor { prime: number; exponent: number }

export interface TwoGateResult {
  a: 3 | 7;
  x: number;
  factors: TwoGateFactor[];
  status: "WITNESS" | "OBSTRUCTED";
  divisor: number | null;
  witness: ErdosStrausWitness | null;
}

export interface TwoGateProfile {
  method: "ERDOS_STRAUS_TWO_GATE_STRUCTURE_V1";
  n: number;
  gates: [TwoGateResult, TwoGateResult];
  bothObstructed: boolean;
  profileDigest: string;
}

function factorize(value: number): TwoGateFactor[] {
  const factors: TwoGateFactor[] = [];
  let remainder = value;
  for (let divisor = 2; divisor * divisor <= remainder; divisor += divisor === 2 ? 1 : 2) {
    if (remainder % divisor !== 0) continue;
    let exponent = 0;
    do { remainder /= divisor; exponent += 1; } while (remainder % divisor === 0);
    factors.push({ prime: divisor, exponent });
  }
  if (remainder > 1) factors.push({ prime: remainder, exponent: 1 });
  return factors;
}

function witnessFromDivisor(n: number, a: 3 | 7, x: number, divisor: number): ErdosStrausWitness {
  const b = BigInt(n) * BigInt(x);
  const d = BigInt(divisor);
  const square = b * b;
  const modulus = BigInt(a);
  if (BigInt(x) * BigInt(x) % d !== BigInt(0) || square % d !== BigInt(0) ||
    (b + d) % modulus !== BigInt(0) || (b + square / d) % modulus !== BigInt(0)) {
    throw new Error("Two-gate divisor violates the exact factor-pair criterion");
  }
  const witness = {
    n: String(n), x: String(x),
    y: String((b + d) / modulus),
    z: String((b + square / d) / modulus),
  };
  if (!verifyErdosStrausWitness(witness).valid) throw new Error("Two-gate witness fails the exact identity");
  return witness;
}

function classifyGate(n: number, a: 3 | 7): TwoGateResult {
  const x = (n + a) / 4;
  const factors = factorize(x);
  // Here n ≡ 1 (mod 840). Thus x_3 ≡ 1 (mod 3), while x_7 is even and ≡ 2 (mod 7).
  // The multipliers 4, 1, 2 send a prime in residue 3, 5, 6 respectively to 5 (mod 7).
  const selected = a === 3
    ? factors.find(({ prime }) => prime % 3 === 2)
    : factors.find(({ prime }) => [3, 5, 6].includes(prime % 7));
  if (!selected) return { a, x, factors, status: "OBSTRUCTED", divisor: null, witness: null };
  const multiplier = a === 3 ? 1 : ({ 3: 4, 5: 1, 6: 2 } as Record<number, number>)[selected.prime % 7]!;
  const divisor = multiplier * selected.prime;
  return { a, x, factors, status: "WITNESS", divisor, witness: witnessFromDivisor(n, a, x, divisor) };
}

/** Bounded exact classifier for a universally proved two-gate lemma; not a solver for the root conjecture. */
export function analyzeTwoGateResidualPrime(n: number): TwoGateProfile {
  if (!Number.isSafeInteger(n) || n < 841 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("Two-gate profile requires a prime p ≡ 1 (mod 840), p ≤ 200,000,000");
  }
  const gates: [TwoGateResult, TwoGateResult] = [classifyGate(n, 3), classifyGate(n, 7)];
  const payload = {
    method: "ERDOS_STRAUS_TWO_GATE_STRUCTURE_V1" as const,
    n,
    gates,
    bothObstructed: gates.every(({ status }) => status === "OBSTRUCTED"),
  };
  return { ...payload, profileDigest: createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex") };
}

/** Replay data from the declared prime, rejecting altered factors, labels, witnesses, or digest. */
export function validateTwoGateProfile(value: TwoGateProfile): boolean {
  try { return JSON.stringify(value) === JSON.stringify(analyzeTwoGateResidualPrime(value.n)); }
  catch { return false; }
}
