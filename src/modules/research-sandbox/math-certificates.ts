import { createHash } from "node:crypto";

import type { MathPilotContract } from "./math-pilot";

export interface ErdosStrausWitness { n: string; x: string; y: string; z: string }

export interface ErdosStrausCertificate {
  valid: boolean;
  classification: "EXACT_IDENTITY" | "INVALID";
  reason: string;
  identityDigest: string | null;
}

const positiveDecimal = /^[1-9][0-9]{0,39}$/;
export const MAX_RESIDUAL_SURVEY_N = 100_000_000;

export function hasErdosStrausEquation(contract: MathPilotContract): boolean {
  return contract.caseType === "OPEN" &&
    /4\/n=1\/x\+1\/y\+1\/z/.test(contract.statement.replace(/\s+/g, "")) &&
    /x,y,z/.test(contract.definitions.replace(/\s+/g, "")) &&
    /positive/i.test(contract.definitions);
}

/** Checks one finite identity, never a universal claim or the provenance of a model argument. */
export function verifyErdosStrausWitness(witness: ErdosStrausWitness): ErdosStrausCertificate {
  const values = [witness.n, witness.x, witness.y, witness.z];
  if (!values.every((value) => positiveDecimal.test(value))) {
    return { valid: false, classification: "INVALID", reason: "All four values must be canonical positive decimal integers of at most 40 digits.", identityDigest: null };
  }
  const [n, x, y, z] = values.map((value) => BigInt(value));
  if (n < BigInt(2)) return { valid: false, classification: "INVALID", reason: "n must be at least 2.", identityDigest: null };
  const valid = BigInt(4) * x * y * z === n * (x * y + x * z + y * z);
  return {
    valid, classification: valid ? "EXACT_IDENTITY" : "INVALID",
    reason: valid ? "Exact integer identity verified; this certifies only the stated n." : "The exact integer identity fails.",
    identityDigest: valid ? createHash("sha256").update(`ERDOS_STRAUS_EXACT_IDENTITY_V1:${values.join(":")}`, "utf8").digest("hex") : null,
  };
}

/** Deterministic primality for the bounded survey only; no claim beyond maxN. */
export function isPrimeInSurvey(n: number): boolean {
  if (!Number.isSafeInteger(n) || n < 2 || n > MAX_RESIDUAL_SURVEY_N) throw new RangeError("Survey primality domain is 2..100,000,000");
  if (n % 2 === 0) return n === 2;
  for (let divisor = 3; divisor * divisor <= n; divisor += 2) if (n % divisor === 0) return false;
  return true;
}

function factor(value: number): Map<number, number> {
  const factors = new Map<number, number>();
  let remainder = value;
  for (let divisor = 2; divisor * divisor <= remainder; divisor += divisor === 2 ? 1 : 2) {
    while (remainder % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      remainder /= divisor;
    }
  }
  if (remainder > 1) factors.set(remainder, (factors.get(remainder) ?? 0) + 1);
  return factors;
}

function divisorsOfSquare(n: number, x: number): bigint[] {
  const factors = factor(n);
  for (const [prime, exponent] of factor(x)) factors.set(prime, (factors.get(prime) ?? 0) + exponent);
  let divisors = [BigInt(1)];
  for (const [prime, exponent] of factors) {
    const previous = divisors;
    divisors = [];
    let power = BigInt(1);
    for (let index = 0; index <= 2 * exponent; index += 1) {
      for (const divisor of previous) divisors.push(divisor * power);
      power *= BigInt(prime);
    }
  }
  return divisors.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
}

export interface BoundedSearchResult { n: number; maxA: number; firstA: number | null; witness: ErdosStrausWitness | null }

export interface ResidualSurveyPlan {
  kind: "ERDOS_STRAUS_RESIDUAL_A";
  lowerExclusive: number;
  upperInclusive: number;
  maxA: number;
}

export interface ResidualSurveyEvidence {
  method: "ERDOS_STRAUS_RESIDUAL_SURVEY_V2";
  plan: ResidualSurveyPlan;
  primeCount: number;
  failureCount: number;
  firstFailure: BoundedSearchResult | null;
  firstFailureRescue: BoundedSearchResult | null;
  manifestDigest: string;
}

/** A deliberately small, auditable exact-computation tool; never accepts model-supplied code. */
export function validateResidualSurveyPlan(plan: ResidualSurveyPlan): void {
  const { lowerExclusive, upperInclusive, maxA } = plan;
  if (!Number.isSafeInteger(lowerExclusive) || !Number.isSafeInteger(upperInclusive) ||
    lowerExclusive < 840 || upperInclusive > MAX_RESIDUAL_SURVEY_N ||
    upperInclusive <= lowerExclusive || upperInclusive - lowerExclusive > 20_000_000 ||
    !Number.isSafeInteger(maxA) || maxA < 3 || maxA > 107 || maxA % 4 !== 3) {
    throw new RangeError("Residual survey requires an interval of at most 20,000,000 within 841..100,000,000 and maxA=3 mod 4, at most 107");
  }
}

export function surveyResidualInterval(plan: ResidualSurveyPlan): ResidualSurveyEvidence {
  validateResidualSurveyPlan(plan);
  const { lowerExclusive, upperInclusive, maxA } = plan;
  const method = "ERDOS_STRAUS_RESIDUAL_SURVEY_V2" as const;
  const digest = createHash("sha256").update(JSON.stringify({ method, plan }), "utf8");
  let primeCount = 0;
  let failureCount = 0;
  let firstFailure: BoundedSearchResult | null = null;
  for (let n = Math.floor((lowerExclusive - 1) / 840) * 840 + 841; n <= upperInclusive; n += 840) {
    if (!isPrimeInSurvey(n)) continue;
    const result = searchResidualPrime(n, maxA);
    primeCount += 1;
    if (result.firstA === null) {
      failureCount += 1;
      firstFailure ??= result;
    }
    digest.update(JSON.stringify(result), "utf8");
  }
  return {
    method, plan, primeCount, failureCount, firstFailure,
    firstFailureRescue: firstFailure && maxA < 107 ? searchResidualPrime(firstFailure.n, 107) : null,
    manifestDigest: digest.digest("hex"),
  };
}

/** Exhausts first denominators x=(n+A)/4 for A=3,7,...,maxA and all factor pairs of (nx)^2. */
export function searchResidualPrime(n: number, maxA = 107): BoundedSearchResult {
  if (!Number.isSafeInteger(n) || n < 2 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("n must be a prime congruent to 1 modulo 840, at most 100,000,000");
  }
  if (!Number.isSafeInteger(maxA) || maxA < 3 || maxA > 107 || maxA % 4 !== 3) {
    throw new RangeError("maxA must be 3 modulo 4 and between 3 and 107");
  }
  for (let a = 3; a <= maxA; a += 4) {
    const x = (n + a) / 4;
    const b = BigInt(n) * BigInt(x);
    const square = b * b;
    for (const d of divisorsOfSquare(n, x)) {
      if (d > b) break;
      const paired = square / d;
      if ((b + d) % BigInt(a) !== BigInt(0) || (b + paired) % BigInt(a) !== BigInt(0)) continue;
      const witness = { n: String(n), x: String(x), y: String((b + d) / BigInt(a)), z: String((b + paired) / BigInt(a)) };
      if (!verifyErdosStrausWitness(witness).valid) throw new Error("Internal factor-pair construction failed exact verification");
      return { n, maxA, firstA: a, witness };
    }
  }
  return { n, maxA, firstA: null, witness: null };
}
