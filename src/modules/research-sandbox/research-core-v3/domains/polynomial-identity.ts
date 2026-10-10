import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { exactInteger, frozen, parseSchema, refuse } from "../bounded-json";
import type { CheckBudget, DomainAdapter, DomainMethodCard, Json } from "../types";

const rationalSchema = z.object({ numerator: z.string().max(22), denominator: z.string().max(22) }).strict();
const polynomialSchema = z.array(rationalSchema).min(1).max(17);
const sideSchema = z.object({ factors: z.array(polynomialSchema).min(1).max(4) }).strict();
const inputSchema = z.object({ kind: z.literal("RATIONAL_IDENTITY"), left: sideSchema, right: sideSchema }).strict();
const candidateSchema = z.object({ kind: z.literal("IDENTITY_CERTIFICATE"), leftCoefficients: z.array(rationalSchema).min(1).max(33), rightCoefficients: z.array(rationalSchema).min(1).max(33) }).strict();
type Rational = { n: bigint; d: bigint };
type Input = z.infer<typeof inputSchema>;
type EncodedRational = z.infer<typeof rationalSchema>;
const card = (id: string, experiment: string, material: string): DomainMethodCard => ({ id,acceptanceTypes: ["EXACT_IDENTITY"],discriminatingExperiment: experiment,material });
const methodCards = frozen([
  card("COEFFICIENT_CONVOLUTION","Expand both sealed sides by exact rational convolution and compare every coefficient.","Numerical samples never establish identity."),
  card("COEFFICIENT_DIFFERENCE","Inspect the exact coefficient difference after expanding both sides independently.","Any independent nonzero coefficient refutes only the sealed identity; do not change its field or factors."),
  card("COEFFICIENT_FACTORIZATION","Use factor structure to propose expansions, then independently check exact coefficients.","Factor suggestions must be reduced to both full coefficient vectors; no invented missing derivation."),
]);
function rational(v: EncodedRational): Rational {
  const n = exactInteger(v.numerator, 64), d = exactInteger(v.denominator, 64);
  if (d <= BigInt(0)) refuse("SCHEMA_REFUSED", "Rational denominator must be positive and nonzero");
  return { n, d };
}
function reduced(n: bigint, d: bigint, budget: CheckBudget): Rational {
  budget.integer(n); budget.integer(d);
  let a = n < BigInt(0) ? -n : n, b = d;
  while (b !== BigInt(0)) { budget.tick(); const r = a % b; a = b; b = r; }
  return { n: n / a, d: d / a };
}
const bitLength = (v: bigint) => (v < BigInt(0) ? -v : v).toString(2).length;
function product(a: bigint,b: bigint,budget: CheckBudget): bigint {
  budget.tick();
  // Conservative bit-sum admission BEFORE multiplication allocation. All
  // operands already satisfy the same declared intermediate bound.
  if (a !== BigInt(0) && b !== BigInt(0) && bitLength(a) + bitLength(b) > polynomialIdentityAdapter.limits.maxIntermediateBits) refuse("RESOURCE_REFUSED", "Polynomial intermediate product preallocation limit");
  return budget.integer(a*b);
}
function sum(a: bigint,b: bigint,budget: CheckBudget): bigint {
  budget.tick();
  if (Math.max(bitLength(a),bitLength(b))+1 > polynomialIdentityAdapter.limits.maxIntermediateBits) refuse("RESOURCE_REFUSED", "Polynomial intermediate sum preallocation limit");
  return budget.integer(a+b);
}
function multiply(a: Rational, b: Rational, budget: CheckBudget) { return reduced(product(a.n,b.n,budget), product(a.d,b.d,budget), budget); }
function add(a: Rational, b: Rational, budget: CheckBudget) { return reduced(sum(product(a.n,b.d,budget),product(b.n,a.d,budget),budget),product(a.d,b.d,budget),budget); }
function expand(side: Input["left"], budget: CheckBudget): Rational[] {
  let result = [{ n: BigInt(1), d: BigInt(1) }];
  for (const encoded of side.factors) {
    const factor = encoded.map(rational);
    const next = Array.from({ length: result.length + factor.length - 1 }, () => ({ n: BigInt(0), d: BigInt(1) }));
    for (let i = 0; i < result.length; i++) for (let j = 0; j < factor.length; j++) next[i+j] = add(next[i+j], multiply(result[i], factor[j], budget), budget);
    result = next;
  }
  return result;
}
function equal(a: Rational[], b: Rational[], budget: CheckBudget): boolean {
  let valid = true;
  for (let i = 0; i < Math.max(a.length,b.length); i++) {
    const x = a[i] ?? { n: BigInt(0), d: BigInt(1) }, y = b[i] ?? { n: BigInt(0), d: BigInt(1) };
    if (product(x.n,y.d,budget) !== product(y.n,x.d,budget)) valid = false;
  }
  return valid;
}
export const polynomialIdentityAdapter: DomainAdapter = frozen<DomainAdapter>({
  id: "POLYNOMIAL_IDENTITY", version: 1, checkerSourceDigest: sha256("RESEARCH_CORE_V3:RATIONAL_COEFFICIENT_CONVOLUTION:1"),
  limits: { maxInputBytes: 65536, maxCandidateBytes: 32768, maxArrayLength: 128, maxIntegerBits: 64, maxIntermediateBits: 512, maxOperations: 200000, maxCheckMilliseconds: 1000, maxDimensions: { factorsPerSide: 4, coefficientsPerFactor: 17, totalDegreePerSide: 32, coefficientsPerSide: 64, expandedCoefficients: 33 } },
  capabilities: ["EXACT_IDENTITY"],
  methodCards,
  applicableMethods() { return methodCards; },
  methodMaterial: "Return expanded rational coefficient vectors for BOTH sides. The independent checker expands sealed factors with exact rational arithmetic. Numerical samples cannot establish identity. No variable denominators or analytic extension is supported.",
  inputSchema: { type: "object", additionalProperties: false, required: ["kind", "left", "right"], properties: { kind: { const: "RATIONAL_IDENTITY" }, left: { type: "object", additionalProperties: false, required: ["factors"], properties: { factors: { type: "array", minItems: 1, maxItems: 4, items: { type: "array", minItems: 1, maxItems: 17, items: { type: "object", additionalProperties: false, required: ["numerator", "denominator"], properties: { numerator: { type: "string", maxLength: 22 }, denominator: { type: "string", maxLength: 22 } } } } } } }, right: { type: "object", additionalProperties: false, required: ["factors"], properties: { factors: { type: "array", minItems: 1, maxItems: 4, items: { type: "array", minItems: 1, maxItems: 17, items: { type: "object", additionalProperties: false, required: ["numerator", "denominator"], properties: { numerator: { type: "string", maxLength: 22 }, denominator: { type: "string", maxLength: 22 } } } } } } } } },
  candidateSchema: { type: "object", additionalProperties: false, required: ["kind", "leftCoefficients", "rightCoefficients"], properties: { kind: { const: "IDENTITY_CERTIFICATE" }, leftCoefficients: { type: "array", minItems: 1, maxItems: 33, items: { type: "object", additionalProperties: false, required: ["numerator", "denominator"], properties: { numerator: { type: "string", maxLength: 22 }, denominator: { type: "string", maxLength: 22 } } } }, rightCoefficients: { type: "array", minItems: 1, maxItems: 33, items: { type: "object", additionalProperties: false, required: ["numerator", "denominator"], properties: { numerator: { type: "string", maxLength: 22 }, denominator: { type: "string", maxLength: 22 } } } } } },
  parseInput(raw) {
    const input = parseSchema(inputSchema, raw);
    for (const side of [input.left,input.right]) {
      if (side.factors.reduce((n,p) => n+p.length-1,0) > 32 || side.factors.reduce((n,p) => n+p.length,0) > 64) refuse("RESOURCE_REFUSED", "Polynomial degree/coefficient ceiling");
      side.factors.flat().forEach(rational);
    }
    return input as Json;
  },
  alignment(raw) {
    const input = raw as unknown as Input;
    return {
      definitions: [{ id: "rational-polynomial", statement: `Coefficient index is monomial degree; multiply all factors independently; sealed input=${canonicalJson(input)}` }],
      quantifiers: [{ kind: "FOR_ALL", variable: "x", domain: "Q" }],
      assumptions: [{ id: "coefficient-field", statement: "Coefficients are exact rationals with positive nonzero constant denominators, verified at intake; no variable denominators.", status: "ESTABLISHED" }],
      predicate: { kind: "EXACT_RATIONAL_POLYNOMIAL_IDENTITY", input }, acceptanceType: "EXACT_IDENTITY",
    };
  },
  parseCandidate(raw) { const candidate = parseSchema(candidateSchema, raw); candidate.leftCoefficients.forEach(rational); candidate.rightCoefficients.forEach(rational); return candidate as Json; },
  check(raw, candidate, budget) {
    const input = raw as unknown as Input, claim = candidate as unknown as z.infer<typeof candidateSchema>;
    const left = expand(input.left,budget), right = expand(input.right,budget);
    const suppliedLeft = claim.leftCoefficients.map(rational), suppliedRight = claim.rightCoefficients.map(rational);
    // Evaluate all three equalities; never accept samples or normalize a missing expansion.
    const leftMatches = equal(left,suppliedLeft,budget), rightMatches = equal(right,suppliedRight,budget), identity = equal(left,right,budget);
    const valid = leftMatches && rightMatches && identity;
    const checkedScope: Json = { predicate: polynomialIdentityAdapter.alignment(raw).predicate, coefficientField: "Q", variableDomain: "Q" };
    return { result: valid ? "VERIFIED" : "REJECTED", scientificDisposition: valid ? "VERIFIED_EXACT_SCOPE" : identity ? "INVALID_CANDIDATE" : "REFUTED_EXACT_PREDICATE", refutation: identity ? null : { predicate: polynomialIdentityAdapter.alignment(raw).predicate,checkedScope }, reason: valid ? "Independent exact coefficient identity" : "Sealed coefficient expansion or identity mismatch", checkedScope, coverage: { leftCoefficients: left.length, rightCoefficients: right.length, checkedDegrees: Math.max(left.length,right.length), sampledPoints: 0 } };
  },
});
