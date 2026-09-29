import { createHash } from "node:crypto";

import { z } from "zod";

const coefficient = z.string().regex(/^(0|[1-9][0-9]{0,39})$/);
const polynomial = z.array(coefficient).min(1).max(5);

export const erdosStrausPolynomialFamilySchema = z.object({
  method: z.literal("ERDOS_STRAUS_POLYNOMIAL_FAMILY_V1"),
  parameter: z.literal("t>=0"),
  n: z.tuple([coefficient, coefficient]),
  x: polynomial,
  y: polynomial,
  z: polynomial,
}).strict();

export type ErdosStrausPolynomialFamily = z.infer<typeof erdosStrausPolynomialFamilySchema>;

export const parametricCertificateSchema = z.object({
  method: z.literal("ERDOS_STRAUS_POLYNOMIAL_IDENTITY_V1"),
  valid: z.boolean(),
  classification: z.enum(["PROGRESSION_IDENTITY", "INVALID"]),
  reason: z.string().min(1).max(500),
  firstDenominatorOffset: z.string().regex(/^[1-9][0-9]*$/).nullable(),
  identityDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(),
}).strict();

export type ParametricCertificate = z.infer<typeof parametricCertificateSchema>;

function add(left: bigint[], right: bigint[]): bigint[] {
  return Array.from({ length: Math.max(left.length, right.length) }, (_, index) =>
    (left[index] ?? BigInt(0)) + (right[index] ?? BigInt(0)));
}

function multiply(left: bigint[], right: bigint[]): bigint[] {
  const result = Array<bigint>(left.length + right.length - 1).fill(BigInt(0));
  for (const [i, a] of left.entries()) for (const [j, b] of right.entries()) result[i + j] += a * b;
  return result;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== BigInt(0)) [a, b] = [b, a % b];
  return a;
}

/** Checks an exact polynomial identity for every integer t>=0, not an arbitrary natural-language proof. */
export function verifyErdosStrausPolynomialFamily(raw: ErdosStrausPolynomialFamily): ParametricCertificate {
  const parsed = erdosStrausPolynomialFamilySchema.safeParse(raw);
  const invalid = (reason: string): ParametricCertificate => ({
    method: "ERDOS_STRAUS_POLYNOMIAL_IDENTITY_V1", valid: false,
    classification: "INVALID", reason, firstDenominatorOffset: null, identityDigest: null,
  });
  if (!parsed.success) return invalid("The polynomial family schema is invalid.");
  const family = parsed.data;
  const [n0, step] = family.n.map(BigInt);
  if (n0 < BigInt(2) || step === BigInt(0) || n0 % BigInt(840) !== BigInt(1) ||
    step % BigInt(840) !== BigInt(0) || gcd(n0, step) !== BigInt(1)) {
    return invalid("n(t) must be a primitive increasing progression congruent to 1 modulo 840.");
  }
  if ([family.x, family.y, family.z].some((value) => BigInt(value[0]!) === BigInt(0))) {
    return invalid("Each denominator must be positive at t=0; nonnegative coefficients then give positivity for all t>=0.");
  }
  const n = family.n.map(BigInt);
  const x = family.x.map(BigInt);
  const y = family.y.map(BigInt);
  const z = family.z.map(BigInt);
  const lhs = multiply([BigInt(4)], multiply(x, multiply(y, z)));
  const rhs = multiply(n, add(add(multiply(x, y), multiply(x, z)), multiply(y, z)));
  if (Array.from({ length: Math.max(lhs.length, rhs.length) }, (_, index) =>
    (lhs[index] ?? BigInt(0)) !== (rhs[index] ?? BigInt(0))).some(Boolean)) {
    return invalid("The exact coefficient identity 4xyz=n(xy+xz+yz) fails.");
  }
  const identityDigest = createHash("sha256")
    .update(JSON.stringify({ method: "ERDOS_STRAUS_POLYNOMIAL_IDENTITY_V1", family }), "utf8").digest("hex");
  const offsetCoefficients = add(multiply([BigInt(4)], x), n.map((value) => -value));
  const firstDenominatorOffset = offsetCoefficients[0]! > BigInt(0) &&
    offsetCoefficients.slice(1).every((value) => value === BigInt(0))
    ? String(offsetCoefficients[0]) : null;
  return { method: "ERDOS_STRAUS_POLYNOMIAL_IDENTITY_V1", valid: true,
    classification: "PROGRESSION_IDENTITY",
    reason: "Exact polynomial identity and positivity hold for every integer t>=0; n(t) is primitive and 1 mod 840. This covers one progression only; any root-specific first-denominator/A bound, primality of a particular term, and novelty need separate checks.",
    firstDenominatorOffset, identityDigest };
}
