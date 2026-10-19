import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { isPrimeInSurvey, verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

export const SPLIT_SUPPORT_TARGETS = [19, 131433121, 159727681, 351121, 171348241] as const;
export const SPLIT_SUPPORT_PAIRS = [[6, 5], [3, 11], [4, 9], [2, 25], [3, 1], [162, 1], [1, 1]] as const;
export const SPLIT_SUPPORT_LIMITS = { secondsPerRun: 30, maxCoreRows: 100000, maxSqrtDivisorIterationsPerRay: 166608 } as const;
export const SPLIT_SUPPORT_SCOPE = "ALL k>=1 only on seven fixed coprime (A,U) rays at five fixed primes including p19 controls; exact divisor criteria, no arbitrary k ceiling. Fixing A,U preserves the ratio partition but varying k can add prime support. Not all mixed cores, root coverage, formal proof or novelty; no historical agent evidence. D/E/F/G unchanged.";
const B = BigInt, zero = B(0), one = B(1), four = B(4);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const cmp = (a: bigint, b: bigint) => a < b ? -1 : a > b ? 1 : 0;

/** Exact formula, not a generic claim about a whole odd-q minimum. */
export function splitSupportCanonicalResidue(A: bigint, U: bigint, k: bigint) {
  if (A < one || U < one || k < one || [A, U, k].some((n) => String(n).length > 24) || gcd(A, U) !== one) throw new RangeError("Positive bounded coprime partition");
  const Q0 = (A - U % A) % A || A, h0 = (U + Q0) / A, m = A * U * k, s = four * m - one;
  const p0 = four * U * k * Q0 - h0;
  if (p0 <= zero || p0 >= s || A * p0 + U !== s * Q0) throw new Error("Canonical quotient identity failure");
  return { A: String(A), U: String(U), k: String(k), Q0: String(Q0), h0: String(h0), m: String(m), s: String(s), residue: String(p0) };
}
export function splitSupportRayBound(p: bigint, A: bigint, U: bigint) {
  if (p < one || String(p).length > 24) throw new RangeError("Bounded positive target");
  const canonical = splitSupportCanonicalResidue(A, U, one);
  return (p + B(canonical.h0)) / (four * U * B(canonical.Q0));
}

class RunDeadline extends Error {}
type Pending = { phase: string; p?: string; A?: number; U?: number; value?: string; a?: number; u?: number; k?: number };
function factorDivisors(n: number, checkpoint: () => void) {
  if (!Number.isSafeInteger(n) || n <= 0 || Math.floor(Math.sqrt(n)) > SPLIT_SUPPORT_LIMITS.maxSqrtDivisorIterationsPerRay) throw new RangeError("Fixed ray factor resource bound");
  let remaining = n; const fs: Array<[number, number]> = [];
  for (let d = 2; d * d <= remaining; d++) {
    if (d % 1024 === 0) checkpoint();
    if (remaining % d === 0) { let e = 0; while (remaining % d === 0) { remaining /= d; e++; } fs.push([d, e]); }
  }
  if (remaining > 1) fs.push([remaining, 1]);
  if (fs.reduce((p, [q, e]) => p * B(q) ** B(e), one) !== B(n)) throw new Error("Exact ray factor product");
  let ds = [one];
  for (const [q, e] of fs) ds = ds.flatMap((d) => Array.from({ length: e + 1 }, (_, j) => d * B(q) ** B(j)));
  return { factors: fs.map(([q, e]) => [String(q), e] as const), divisors: ds.sort(cmp) };
}

export function splitSupportPacket() {
  const deadline = performance.now() + SPLIT_SUPPORT_LIMITS.secondsPerRun * 1000;
  const rays = [], controls = [], controlDigest = createHash("sha256");
  let pending: Pending = { phase: "CONTROLS" }, checkedDivisorRows = 0;
  const checkpoint = () => { if (performance.now() >= deadline) throw new RunDeadline(); };
  try {
    for (let a = 1; a <= 16; a++) for (let u = 1; u <= 16; u++) if (gcd(B(a), B(u)) === one) for (let k = 1; k <= 16; k++) {
      pending = { phase: "CONTROLS", a, u, k }; checkpoint();
      const row = splitSupportCanonicalResidue(B(a), B(u), B(k));
      const values = [a, u, k, row.Q0, row.h0, row.residue, row.s];
      controls.push(values); controlDigest.update(JSON.stringify(values) + "\n");
    }
    for (const p of SPLIT_SUPPORT_TARGETS) for (const [A, U] of SPLIT_SUPPORT_PAIRS) {
      const n = B(p), a = B(A), u = B(U), N = A * p + U, modulus = four * a * u;
      pending = { phase: "FACTOR_RAY", p: String(p), A, U, value: String(N) }; checkpoint();
      if (!isPrimeInSurvey(p)) throw new Error("Fixed target prime drift");
      const { factors, divisors } = factorDivisors(N, checkpoint);
      const rows = [], hits = [], digest = createHash("sha256"), kMax = splitSupportRayBound(n, a, u);
      pending = { phase: "DIVISOR_RAY", p: String(p), A, U, value: String(N) };
      for (const s of divisors) {
        checkpoint();
        if (++checkedDivisorRows > SPLIT_SUPPORT_LIMITS.maxCoreRows) throw new Error("Fixed divisor row cap");
        const hit = (s + one) % modulus === zero, k = hit ? (s + one) / modulus : null, Q = hit ? B(N) / s : null;
        const row = [String(s), hit, k === null ? null : String(k), Q === null ? null : String(Q)];
        rows.push(row); digest.update(JSON.stringify(row) + "\n");
        if (k !== null && Q !== null) {
          const canonical = splitSupportCanonicalResidue(a, u, k);
          if (k > kMax || n % s !== B(canonical.residue) || a * n + u !== s * Q) throw new Error("Original ray criterion failure");
          const ds = [u * Q * k, a * n * u * k, a * n * Q * k].sort(cmp);
          const witness = { n: String(p), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) }, strict = verifyErdos242StrictWitness(witness);
          if (four * ds[0] * ds[1] * ds[2] !== n * (ds[0] * ds[1] + ds[1] * ds[2] + ds[2] * ds[0])) throw new Error("Exact rational identity failure");
          const typeII = ds.filter((d) => d % n === zero).length === 2;
          hits.push({ k: String(k), m: String(a * u * k), s: String(s), Q: String(Q),
            canonicalResidue: canonical.residue, canonicalQuotient: canonical.Q0,
            wrapCount: String((Q - B(canonical.Q0)) / a),
            classification: strict.valid && typeII ? "STRICT_TYPE_II" as const : "EXACT_IDENTITY_NOT_STRICT_TYPE_II" as const,
            witness, strictDigest: strict.valid && typeII ? strict.benchmarkDigest : null });
        }
      }
      rays.push({ p: String(p), A, U, numerator: String(N), numeratorFactors: factors,
        kMax: String(kMax), divisorRows: rows.length, rowsDigest: digest.digest("hex"), hits });
    }
    pending = { phase: "FINALIZE" }; checkpoint();
    return { method: "ERDOS_STRAUS_SPLIT_SUPPORT_RAYS_V1" as const, status: "COMPLETE_FOR_35_FIXED_RAYS" as const,
      limits: SPLIT_SUPPORT_LIMITS, targets: SPLIT_SUPPORT_TARGETS, pairs: SPLIT_SUPPORT_PAIRS,
      controls: { maxA: 16, maxU: 16, maxK: 16, rows: controls.length, rowsDigest: controlDigest.digest("hex") },
      checkedRays: rays.length, checkedDivisorRows, hitRows: rays.reduce((n, r) => n + r.hits.length, 0),
      rays, rayManifestDigest: hash(rays), scope: SPLIT_SUPPORT_SCOPE };
  } catch (error) {
    if (!(error instanceof RunDeadline)) throw error;
    return { method: "ERDOS_STRAUS_SPLIT_SUPPORT_RAYS_V1" as const, status: "PARTIAL" as const,
      reason: "RUN_30_SECOND_LIMIT", limits: SPLIT_SUPPORT_LIMITS, checkedControlRows: controls.length,
      controlPrefixDigest: controlDigest.digest("hex"), checkedRays: rays.length, checkedDivisorRows,
      pending, completedRays: rays, scope: SPLIT_SUPPORT_SCOPE };
  }
}
