import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

export const ALLIKVERE_PROOF_SOURCE = Object.freeze({ id: "arXiv:2609.02604v2", url: "https://arxiv.org/html/2609.02604v2", version: 2, date: "2026-09-24" });
export const ALLIKVERE_PROOF_LIMITS = Object.freeze({ reportBytes: 524288, stdoutBytes: 262144, pythonBytes: 16384, replayMs: 10000, collectorMs: 20000, seriesTerms: 24 });
export const ALLIKVERE_PROOF_PYTHON_SHA256 = "c7a28efd319ffd670b5f8b229aba40be6e933386e29f0edebdabb6cafb0a3d78";
export const ALLIKVERE_PROOF_RETAINED_PATH = "docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json";
type Dependency = { id: string; status: "OPEN"; sourceSection: string; sourceUrl: string; dependsOn: string[] };
const dependency = (id: string, section: string, dependsOn: string[] = []): Dependency => ({ id, status: "OPEN", sourceSection: section, sourceUrl: `${ALLIKVERE_PROOF_SOURCE.url}#${section}`, dependsOn });

/** A published source claim is not our theorem verdict. Local archived partial
 * fibers are deliberately absent from this dependency graph. */
export function buildAllikvereProofPlan() {
  return {
    version: 1 as const, source: ALLIKVERE_PROOF_SOURCE, publishedClaim: "FOURTEEN_AND_FIFTEEN_RUNNERS" as const,
    reproductionStatus: "NOT_ESTABLISHED" as const, noveltyStatus: "PAUSED" as const,
    lowerCaseConvention: { movingSpeeds: 12, totalRunners: 13 },
    targets: [
      { totalRunners: 14 as const, movingSpeeds: 13 as const, status: "NOT_ESTABLISHED" as const, dependencies: [
        dependency("LOWER_LRC_THROUGH_12", "S6"),
        dependency("PRIMITIVE_DISTINCT_REDUCTION_13", "S5", ["LOWER_LRC_THROUGH_12"]),
        dependency("ELLIPSOID_COVOLUME_13", "S3.SS1"),
        dependency("SEPARATED_POINTS_PREFIX_13", "S3.SS3", ["LOWER_LRC_THROUGH_12"]),
        dependency("KZ_PRODUCT_MINIMIZATION_13", "S3.SS4", ["SEPARATED_POINTS_PREFIX_13"]),
        dependency("LATTICE_FLAG_BOUND_13", "S3.SS6", ["ELLIPSOID_COVOLUME_13", "KZ_PRODUCT_MINIMIZATION_13", "SHAPE_INEQUALITY_13"]),
        dependency("SHAPE_INEQUALITY_13", "S3.SS5"),
        dependency("PRIME_DIVISIBILITY_CRITERION_13", "S2", ["LOWER_LRC_THROUGH_12"]),
        dependency("LEVEL_ONE_COMPLETENESS_61_PRIMES", "S4.SS1"),
        dependency("BINARY_LIFT_COMPLETENESS_61_PRIMES", "S4.SS2", ["LEVEL_ONE_COMPLETENESS_61_PRIMES"]),
        dependency("TERMINAL_PROPERNESS_61_PRIMES", "S4.SS3", ["BINARY_LIFT_COMPLETENESS_61_PRIMES", "PRIME_DIVISIBILITY_CRITERION_13"]),
      ] },
      { totalRunners: 15 as const, movingSpeeds: 14 as const, status: "NOT_ESTABLISHED" as const, dependencies: [
        dependency("ESTABLISHED_LRC_13", "S5", ["PRIMITIVE_DISTINCT_REDUCTION_13", "LATTICE_FLAG_BOUND_13", "TERMINAL_PROPERNESS_61_PRIMES"]),
        dependency("PRIMITIVE_DISTINCT_REDUCTION_14", "S3.SS7", ["ESTABLISHED_LRC_13"]),
        dependency("ELLIPSOID_COVOLUME_14", "S3.SS1"),
        dependency("SEPARATED_POINTS_PREFIX_14", "S3.SS3", ["ESTABLISHED_LRC_13"]),
        dependency("KZ_PRODUCT_MINIMIZATION_14", "S3.SS4", ["SEPARATED_POINTS_PREFIX_14"]),
        dependency("LATTICE_FLAG_BOUND_14", "S3.SS6", ["ELLIPSOID_COVOLUME_14", "KZ_PRODUCT_MINIMIZATION_14", "SHAPE_INEQUALITY_14"]),
        dependency("SHAPE_INEQUALITY_14", "S3.SS5"),
        dependency("FORCED_DIVISOR_LEMMA_14", "S3.SS7"),
        dependency("PRIME_DIVISIBILITY_CRITERION_14", "S2", ["ESTABLISHED_LRC_13"]),
        dependency("LEVEL_ONE_COMPLETENESS_71_PRIMES", "S4.SS1"),
        dependency("BINARY_LIFT_COMPLETENESS_71_PRIMES", "S4.SS2", ["LEVEL_ONE_COMPLETENESS_71_PRIMES"]),
        dependency("CRT_SHIFT_TERMINAL_PROPERNESS_71_PRIMES", "S4.SS4", ["BINARY_LIFT_COMPLETENESS_71_PRIMES", "PRIME_DIVISIBILITY_CRITERION_14", "LOWER_LRC_THROUGH_12"]),
      ] },
    ],
    nextObligation: { id: "ANALYTIC_REDUCTION_PROPERNESS_AUDIT" as const, status: "SELECTED_PENDING_FULL_REVIEW" as const,
      scope: ["AUDIT_PRIMITIVE_NORMALIZATION_PRIME_DIVISIBILITY_GCD_AND_FEW_EXCEPTION_SHIFT", "AUDIT_LATTICE_PREFIX_KZ_PRODUCT_AND_SHAPE_ARGUMENTS", "TRACE_LOWER_CASE_DEPENDENCIES_AND_FULL_MODULAR_COMPLETENESS"],
      stopRule: "A further computation must name a global obligation and explain why its output can close that obligation. Stop when it only increases partial local coverage; novelty remains paused until the reproduction boundary is explicit." },
  };
}
export type AllikvereProofPlan = ReturnType<typeof buildAllikvereProofPlan>;

type Q = { n: bigint; d: bigint };
export type RationalString = { numerator: string; denominator: string };
export type RationalInterval = { lower: RationalString; upper: RationalString };
const gcd = (a: bigint, b: bigint): bigint => { a = a < BigInt("0") ? -a : a; while (b) [a, b] = [b, a % b]; return a; };
const q = (n: bigint, d = BigInt("1")): Q => { if (!d) throw new Error("Zero denominator"); if (d < BigInt("0")) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
const add = (a: Q, b: Q) => q(a.n * b.d + b.n * a.d, a.d * b.d);
const neg = (a: Q) => q(-a.n, a.d);
const sub = (a: Q, b: Q) => add(a, neg(b));
const mul = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
const div = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);
const cmp = (a: Q, b: Q) => a.n * b.d - b.n * a.d;
const out = (a: Q): RationalString => ({ numerator: a.n.toString(), denominator: a.d.toString() });
type Interval = { lo: Q; hi: Q };
const iadd = (a: Interval, b: Interval): Interval => ({ lo: add(a.lo, b.lo), hi: add(a.hi, b.hi) });
const scale = (a: Interval, b: Q): Interval => b.n < BigInt("0") ? { lo: mul(a.hi, b), hi: mul(a.lo, b) } : { lo: mul(a.lo, b), hi: mul(a.hi, b) };
const isub = (a: Interval, b: Interval) => iadd(a, scale(b, q(-BigInt("1"))));
// Wire values remain exact rational enclosures but are rounded outward to
// 10^-12, avoiding thousands of irrelevant denominator digits in the UI.
const io = (a: Interval): RationalInterval => {
  const precision = BigInt("1000000000000");
  return { lower: out(q(floorQ(mul(a.lo,q(precision))),precision)),
    upper: out(q(-floorQ(neg(mul(a.hi,q(precision)))),precision)) };
};

// For 1<=x<=2, z=(x-1)/(x+1) is in [0,1/3]. Positive
// atanh terms give a lower bound; replacing every remaining denominator by
// 2N+1 gives tail <=2*z^(2N+1)/((2N+1)*(1-z²)).
function reducedLog(x: Q): Interval {
  const z = div(sub(x, q(BigInt("1"))), add(x, q(BigInt("1")))), z2 = mul(z, z);
  let sum = q(BigInt("0")), power = z;
  for (let j = 0; j < ALLIKVERE_PROOF_LIMITS.seriesTerms; j++) {
    sum = add(sum, div(power, q(BigInt(2 * j + 1)))); power = mul(power, z2);
  }
  const lo = mul(q(BigInt("2")), sum);
  return { lo, hi: add(lo, div(mul(q(BigInt("2")), power), mul(q(BigInt(2 * ALLIKVERE_PROOF_LIMITS.seriesTerms + 1)), sub(q(BigInt("1")), z2)))) };
}
function log(x: Q): Interval {
  if (x.n <= BigInt("0") || x.n.toString().length + x.d.toString().length > 2000) throw new Error("Bounded positive rational required");
  let reduced = x, exponent = 0;
  while (cmp(reduced, q(BigInt("2"))) >= BigInt("0")) { reduced = div(reduced, q(BigInt("2"))); exponent++; }
  while (cmp(reduced, q(BigInt("1"))) < BigInt("0")) { reduced = mul(reduced, q(BigInt("2"))); exponent--; }
  // Exact dyadic enclosure before the series keeps work bounded even when x
  // is a 180-digit prime product. Log is increasing; both endpoints are safe.
  const dyadic = BigInt("1") << BigInt("64"), digit = reduced.n * dyadic / reduced.d;
  const low = q(digit,dyadic), high = q(digit * reduced.d === reduced.n * dyadic ? digit : digit+BigInt("1"),dyadic);
  const enclosure = { lo: reducedLog(low).lo, hi: reducedLog(high).hi };
  return iadd(enclosure, scale(reducedLog(q(BigInt("2"))), q(BigInt(exponent))));
}
export function exactLogInterval(numerator: bigint, denominator = BigInt("1")): RationalInterval { return io(log(q(numerator, denominator))); }
const floorQ = (a: Q): bigint => { const quotient = a.n / a.d; return a.n < BigInt("0") && a.n % a.d ? quotient - BigInt("1") : quotient; };
function decimal(a: Q, upper: boolean): string {
  const scaled = mul(a, q(BigInt("1000000"))); const value = upper ? -floorQ(neg(scaled)) : floorQ(scaled);
  const abs = value < BigInt("0") ? -value : value;
  return `${value < BigInt("0") ? "-" : ""}${abs / BigInt("1000000")}.${(abs % BigInt("1000000")).toString().padStart(6, "0")}`;
}
const display = (a: Interval) => `[${decimal(a.lo, false)}, ${decimal(a.hi, true)}]`;
export function isProofPrime(n: number): boolean { if (!Number.isSafeInteger(n) || n < 2 || n > 569) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
const primeRange = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, j) => j + a).filter(isProofPrime);
export function allikvereProofPrimes(n: 13 | 14): number[] {
  return n === 13 ? [83,139,167,181,191, ...primeRange(199,479),487,491,499,503,509,521,523,541,547]
    : [89,131,149,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,241,...primeRange(239,569).filter((p) => p !== 241)].sort((a,b) => a-b);
}
export function reconstructProofArithmetic() {
  const targets = ([13, 14] as const).map((n) => {
    const r = n === 13 ? q(BigInt("101"),BigInt("200")) : q(BigInt("1"),BigInt("2"));
    let previous = q(BigInt("0")), K = q(BigInt("1")); const ci: Q[] = [];
    for (let i = 1; i < n; i++) {
      const b = q(BigInt(2*i),BigInt((n+1)*(n+1-i))); const B = mul(b,b), c = sub(B, previous);
      ci.push(c); K = mul(K,c); previous = B;
    }
    const ratios = ci.slice(1).map((c,i) => div(c,ci[i]));
    if (ratios.some((a) => cmp(a,q(BigInt("4"),BigInt("3"))) <= BigInt("0"))) throw new Error("Ratio hypothesis failed");
    const primes = allikvereProofPrimes(n);
    if (primes.length !== (n === 13 ? 61 : 71) || new Set(primes).size !== primes.length || !primes.every(isProofPrime)) throw new Error("Prime list invalid");
    const primeProduct = primes.reduce((product,p) => product*BigInt(p),BigInt("1"));
    let lcm = BigInt("1"); for (let i = 2; i <= 15; i++) lcm = lcm * BigInt(i) / gcd(lcm,BigInt(i));
    if (lcm !== BigInt("360360") || gcd(lcm,primeProduct) !== BigInt("1")) throw new Error("Forced divisor is not coprime");
    const forcedDivisor = n === 14 ? lcm : BigInt("1");
    const logBound = iadd(scale(log(div(r,q(BigInt(n)))),q(BigInt(n))),scale(log(K),q(-BigInt(n),BigInt("2"))));
    const logPrimeProduct = log(q(primeProduct)), logForcedDivisor = log(q(forcedDivisor));
    const logRequiredProduct = iadd(logPrimeProduct,logForcedDivisor), margin = isub(logRequiredProduct,logBound);
    const publishedUpperBound = n === 13 ? q(BigInt("341032"),BigInt("1000")) : q(BigInt("4147794"),BigInt("10000"));
    if (cmp(logBound.hi,publishedUpperBound) >= BigInt("0") || margin.lo.n <= BigInt("0")) throw new Error("Strict contradiction margin failed");
    return { totalRunners: (n+1) as 14|15, movingSpeeds: n, status: "CONDITIONAL_ARITHMETIC_ONLY" as const,
      ci: ci.map(out), ratios: ratios.map(out), K: out(K), shapeConstant: out(r), primes, primeProduct: primeProduct.toString(),
      forcedDivisor: forcedDivisor.toString(), lcm2Through15: lcm.toString(), coprime: true as const,
      publishedUpperBound: out(publishedUpperBound), logBound: io(logBound), logPrimeProduct: io(logPrimeProduct),
      logForcedDivisor: io(logForcedDivisor), logRequiredProduct: io(logRequiredProduct), margin: io(margin),
      display: { logBound: display(logBound), logRequiredProduct: display(logRequiredProduct), margin: display(margin) } };
  });
  return { version: 1 as const, source: ALLIKVERE_PROOF_SOURCE, method: "RATIONAL_ATANH_RANGE_REDUCTION_24_DYADIC64_WIRE12" as const,
    status: "CONDITIONAL_ARITHMETIC_REPRODUCED" as const, globalVerdict: "NOT_ESTABLISHED" as const,
    assumptionsDischarged: false as const, targets };
}
export type ProofArithmetic = ReturnType<typeof reconstructProofArithmetic>;
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const receiptSchema = z.object({ method: z.literal("LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY"), sourceSha256: hex,
  stdoutSha256: hex, stdoutBytes: z.number().int().positive().max(ALLIKVERE_PROOF_LIMITS.stdoutBytes),
  elapsedMs: z.number().int().nonnegative().max(ALLIKVERE_PROOF_LIMITS.replayMs),
  interpreter: z.literal("python3"), flags: z.tuple([z.literal("-I"),z.literal("-S"),z.literal("-B"),z.literal("-c")]),
  externalAttestation: z.literal(false) }).strict();
export type ProofArithmeticReport = ProofArithmetic & { generatedAt: string; planDigest: string; receipt: z.infer<typeof receiptSchema>; reportDigest: string };
export function proofArithmeticReportDigest(report: Omit<ProofArithmeticReport,"reportDigest"> | ProofArithmeticReport): string {
  const { reportDigest: _digest, ...body } = report as ProofArithmeticReport; void _digest; return sha256(canonicalJson(body));
}
/** Bounded pure admission: no old evidence, process, file read, model or fetch.
 * Receipt is a local unsigned assertion; source and exact output pins cannot
 * establish that an untrusted party really executed the interpreter. */
export function validateRetainedProofArithmetic(raw: unknown): ProofArithmeticReport | null {
  try {
    if (Buffer.byteLength(JSON.stringify(raw),"utf8") > ALLIKVERE_PROOF_LIMITS.reportBytes || !raw || typeof raw !== "object") return null;
    const parsed = z.object({ generatedAt: z.string().datetime(), planDigest: hex, receipt: receiptSchema, reportDigest: hex }).passthrough().parse(raw);
    const arithmetic = reconstructProofArithmetic();
    const { generatedAt, planDigest, receipt, reportDigest, ...candidate } = parsed;
    const expectedOutput = `${canonicalJson(arithmetic)}\n`;
    if (canonicalJson(candidate) !== canonicalJson(arithmetic) || planDigest !== sha256(canonicalJson(buildAllikvereProofPlan())) ||
      receipt.sourceSha256 !== ALLIKVERE_PROOF_PYTHON_SHA256 || receipt.stdoutSha256 !== sha256(expectedOutput) ||
      receipt.stdoutBytes !== Buffer.byteLength(expectedOutput) || reportDigest !== proofArithmeticReportDigest(raw as ProofArithmeticReport)) return null;
    return { ...arithmetic, generatedAt, planDigest, receipt, reportDigest };
  } catch { return null; }
}
