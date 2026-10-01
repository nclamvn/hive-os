import { createHash } from "node:crypto";

import type { MathPilotContract } from "./math-pilot";

export interface ErdosStrausWitness { n: string; x: string; y: string; z: string }

export interface ErdosStrausCertificate {
  valid: boolean;
  classification: "EXACT_IDENTITY" | "INVALID";
  reason: string;
  identityDigest: string | null;
}

/** The public Erdős 242 / FrontierMath contract is stricter than the older local identity check. */
export interface Erdos242StrictCertificate {
  valid: boolean;
  classification: "STRICT_EXACT_IDENTITY" | "INVALID";
  reason: string;
  benchmarkDigest: string | null;
}

const positiveDecimal = /^[1-9][0-9]{0,39}$/;
export const MAX_RESIDUAL_SURVEY_N = 200_000_000;

export function hasErdosStrausEquation(contract: MathPilotContract): boolean {
  const statement = contract.statement.replace(/\s+/g, "");
  const definitions = contract.definitions.replace(/\s+/g, "").toLowerCase();
  return contract.caseType === "OPEN" &&
    /(?:^|[^0-9])4\/[np]=1\/x\+1\/y\+1\/z/i.test(statement) &&
    /x,y,z(?:are)?(?:strictly)?positiveintegers/.test(definitions);
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

/** Checks one ordered, distinct witness for n>2. This never certifies the universal conjecture. */
export function verifyErdos242StrictWitness(witness: ErdosStrausWitness): Erdos242StrictCertificate {
  const identity = verifyErdosStrausWitness(witness);
  if (!identity.valid) return {
    valid: false, classification: "INVALID", reason: identity.reason, benchmarkDigest: null,
  };
  const [n, x, y, z] = [witness.n, witness.x, witness.y, witness.z].map(BigInt);
  if (n <= BigInt(2) || !(x < y && y < z)) return {
    valid: false, classification: "INVALID",
    reason: "Erdős 242 requires n>2 and strictly ordered, distinct denominators x<y<z.",
    benchmarkDigest: null,
  };
  return {
    valid: true, classification: "STRICT_EXACT_IDENTITY",
    reason: "One exact Erdős 242 witness checked; no universal proof is implied.",
    benchmarkDigest: createHash("sha256")
      .update(`ERDOS242_STRICT_EXACT_IDENTITY_V1:${witness.n}:${witness.x}:${witness.y}:${witness.z}`, "utf8")
      .digest("hex"),
  };
}

/** Deterministic primality for the bounded survey only; no claim beyond maxN. */
export function isPrimeInSurvey(n: number): boolean {
  if (!Number.isSafeInteger(n) || n < 2 || n > MAX_RESIDUAL_SURVEY_N) throw new RangeError("Survey primality domain is 2..200,000,000");
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
  method: "ERDOS_STRAUS_RESIDUAL_SURVEY_V2" | "ERDOS_STRAUS_RESIDUAL_SURVEY_V3";
  plan: ResidualSurveyPlan;
  primeCount: number;
  failureCount: number;
  firstFailure: BoundedSearchResult | null;
  firstFailureRescue: BoundedSearchResult | null;
  manifestDigest: string;
  /** Present only for new events; historical V2 surveys remain immutable. */
  firstFailureAudit?: ResidualFailureAudit;
}

export interface ResidualFailureAudit {
  method: "ERDOS_STRAUS_EXCLUSION_AUDIT_V1";
  n: number;
  maxA: number;
  primeTrialLimit: number;
  rows: Array<{
    a: number;
    x: number;
    xFactors: Array<{ prime: number; exponent: number }>;
    factorPairsChecked: number;
    admissiblePairs: number;
  }>;
  auditDigest: string;
}

/** A second, deliberately separate factor enumeration for a single proposed failure. */
export function auditResidualFailure(n: number, maxA: number): ResidualFailureAudit {
  if (!Number.isSafeInteger(n) || n < 841 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 ||
    !Number.isSafeInteger(maxA) || maxA < 3 || maxA > 107 || maxA % 4 !== 3) {
    throw new RangeError("Exclusion audit is outside the bounded residual-prime domain");
  }
  const primeTrialLimit = Math.floor(Math.sqrt(n));
  if (n % 2 === 0 || n % 3 === 0) throw new RangeError("Exclusion audit requires a prime");
  for (let divisor = 5; divisor <= primeTrialLimit; divisor += 6) {
    if (n % divisor === 0 || n % (divisor + 2) === 0) throw new RangeError("Exclusion audit requires a prime");
  }
  const rows: ResidualFailureAudit["rows"] = [];
  for (let a = 3; a <= maxA; a += 4) {
    const x = (n + a) / 4;
    let remainder = x;
    const xFactors: ResidualFailureAudit["rows"][number]["xFactors"] = [];
    for (let divisor = 2; divisor * divisor <= remainder; divisor += divisor === 2 ? 1 : 2) {
      if (remainder % divisor !== 0) continue;
      let exponent = 0;
      do { remainder /= divisor; exponent += 1; } while (remainder % divisor === 0);
      xFactors.push({ prime: divisor, exponent });
    }
    if (remainder > 1) xFactors.push({ prime: remainder, exponent: 1 });
    const factors = [{ prime: n, exponent: 1 }, ...xFactors];
    const b = BigInt(n) * BigInt(x);
    const square = b * b;
    const modulus = BigInt(a);
    let factorPairsChecked = 0;
    let admissiblePairs = 0;
    const inspect = (position: number, divisor: bigint) => {
      if (position < factors.length) {
        const { prime, exponent } = factors[position]!;
        let power = BigInt(1);
        for (let count = 0; count <= 2 * exponent; count += 1) {
          inspect(position + 1, divisor * power);
          power *= BigInt(prime);
        }
        return;
      }
      if (divisor > b) return;
      factorPairsChecked += 1;
      const paired = square / divisor;
      if ((b + divisor) % modulus === BigInt(0) && (b + paired) % modulus === BigInt(0)) admissiblePairs += 1;
    };
    inspect(0, BigInt(1));
    if (admissiblePairs !== 0) throw new Error("Independent exclusion audit disagrees with the survey failure");
    rows.push({ a, x, xFactors, factorPairsChecked, admissiblePairs });
  }
  const payload = { method: "ERDOS_STRAUS_EXCLUSION_AUDIT_V1" as const, n, maxA, primeTrialLimit, rows };
  return { ...payload, auditDigest: createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex") };
}

/** A deliberately small, auditable exact-computation tool; never accepts model-supplied code. */
export function validateResidualSurveyPlan(plan: ResidualSurveyPlan): void {
  const { lowerExclusive, upperInclusive, maxA } = plan;
  if (!Number.isSafeInteger(lowerExclusive) || !Number.isSafeInteger(upperInclusive) ||
    lowerExclusive < 840 || upperInclusive > MAX_RESIDUAL_SURVEY_N ||
    upperInclusive <= lowerExclusive || upperInclusive - lowerExclusive > 20_000_000 ||
    !Number.isSafeInteger(maxA) || maxA < 3 || maxA > 107 || maxA % 4 !== 3) {
    throw new RangeError("Residual survey requires an interval of at most 20,000,000 within 841..200,000,000 and maxA=3 mod 4, at most 107");
  }
}

export function surveyResidualInterval(plan: ResidualSurveyPlan,
  method: ResidualSurveyEvidence["method"] = "ERDOS_STRAUS_RESIDUAL_SURVEY_V3"): ResidualSurveyEvidence {
  validateResidualSurveyPlan(plan);
  const { lowerExclusive, upperInclusive, maxA } = plan;
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
    ...(firstFailure ? { firstFailureAudit: auditResidualFailure(firstFailure.n, maxA) } : {}),
  };
}

/** Exhausts first denominators x=(n+A)/4 for A=3,7,...,maxA and all factor pairs of (nx)^2. */
export function searchResidualPrime(n: number, maxA = 107): BoundedSearchResult {
  if (!Number.isSafeInteger(n) || n < 2 || n > MAX_RESIDUAL_SURVEY_N || n % 840 !== 1 || !isPrimeInSurvey(n)) {
    throw new RangeError("n must be a prime congruent to 1 modulo 840, at most 200,000,000");
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
      // Here n is prime and n>a>=3 is odd, so the fixed-A algebra also forces x<y<z.
      if (!verifyErdos242StrictWitness(witness).valid) throw new Error("Internal factor-pair construction failed the strict Erdős 242 contract");
      return { n, maxA, firstA: a, witness };
    }
  }
  return { n, maxA, firstA: null, witness: null };
}
