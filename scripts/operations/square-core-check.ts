import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { normalizedCoreFiniteBound } from "../../src/modules/research-sandbox/math-normalized-core-bound";
import { verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

export const SQUARE_CORE_ARTIFACT_SHA256 = "c20ab868ceceee139a7319c5d8ec3b11c953fc6136677565ef9b5184b537cff2";
export const SQUARE_CORE_TARGETS = ["131433121", "159727681", "351121", "171348241"];
const decimal = z.string().regex(/^[1-9][0-9]{0,29}$/);
const factorsSchema = z.array(z.tuple([decimal, z.number().int().min(1).max(128)])).max(64);
const artifactSchema = z.object({
  method: z.literal("ERDOS_STRAUS_CERTIFIED_SQUARE_CORE_SLICE_V1"),
  scope: z.object({ b: z.literal(2), minA: z.literal(1), maxA: z.literal(4), ellOrModulusCeiling: z.null(), higherAorB: z.literal("UNCOMPUTED") }).strict(),
  discoveryLimits: z.object({ secondsPerTarget: z.literal(120), rhoSeeds: z.literal(32), rhoIterationsPerSeed: z.literal(2000000), lucasBases: z.literal(4096) }).strict(),
  targets: z.array(z.object({ p: decimal, maxCore: decimal, status: z.enum(["COMPLETE", "PARTIAL"]),
    criterionFactors: z.array(z.object({ kind: z.enum(["PURE_PLUS", "PURE_TIMES", "TRANSLATED"]), a: z.number().int().min(0).max(4), t: z.number().int().min(-4).max(10), value: decimal, factors: factorsSchema }).strict()).max(64),
    candidateEllFactors: z.array(z.object({ value: decimal, factors: factorsSchema }).strict()).max(10000),
    unresolved: z.array(z.object({ value: decimal, purpose: z.string().min(1).max(64), reason: z.string().min(1).max(128) }).strict()).max(10000),
  }).strict()).length(4),
  primes: z.array(z.object({ n: decimal, minusOneFactors: factorsSchema, witnesses: z.array(z.tuple([decimal, decimal])).max(64) }).strict()).min(1).max(10000),
}).strict();
type Factors = z.infer<typeof factorsSchema>;
const B = BigInt;
const power = (n: number) => B(1) << B(n);
const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a < B(0) ? -a : a; }
function modpow(a: bigint, e: bigint, n: bigint) {
  let result = B(1);
  while (e) { if (e % B(2)) result = result * a % n; a = a * a % n; e /= B(2); }
  return result;
}
function isqrt(n: bigint) {
  if (n < B(2)) return n;
  let x = n, y = (x + B(1)) / B(2);
  while (y < x) { x = y; y = (x + n / x) / B(2); }
  return x;
}
function divisors(fs: Factors) {
  let values = [B(1)];
  for (const [q, e] of fs) {
    if (values.length * (e + 1) > 100000) throw new Error("Divisor resource bound");
    values = values.flatMap((v) => Array.from({ length: e + 1 }, (_, j) => v * B(q) ** B(j)));
  }
  return values;
}
export function squareCoreRequiredInputs(p: bigint) {
  const inputs: Array<{ kind: "PURE_PLUS" | "PURE_TIMES" | "TRANSLATED"; a: number; t: number; value: string }> = [];
  for (let t = 0; t <= 10; t++) {
    inputs.push({ kind: "PURE_PLUS", a: 0, t, value: String(p + power(t)) },
      { kind: "PURE_TIMES", a: 0, t, value: String(power(t) * p + B(1)) });
  }
  for (let a = 1; a <= 4; a++) for (let t = -a; t <= 2 * a + 2; t++) {
    inputs.push({ kind: "TRANSLATED", a, t, value: String(t < 0
      ? power(a + 2) * (power(-t) * p) ** B(2) - B(1)
      : power(a + 2) * p ** B(2) - power(2 * t)) });
  }
  return inputs;
}
/** Signed exponent boxes: exact ORIGINAL congruence, not its raised relaxation. */
export function squareCoreOriginalPairs(p: bigint, exponent: number, ell: bigint) {
  const m = power(exponent) * ell ** B(2), s = B(4) * m - B(1), pairs = [];
  for (let f = -exponent; f <= exponent; f++) for (let g = -2; g <= 2; g++) {
    const a = power(Math.max(-f, 0)) * ell ** B(Math.max(-g, 0));
    const u = power(Math.max(f, 0)) * ell ** B(Math.max(g, 0));
    if (gcd(a, u) !== B(1) || m % (a * u)) throw new Error("Normalized pair failure");
    if ((a * p + u) % s === B(0)) pairs.push({ a, u });
  }
  return pairs.sort((x, y) => x.a < y.a ? -1 : x.a > y.a ? 1 : x.u < y.u ? -1 : x.u > y.u ? 1 : 0);
}

export function verifySquareCoreArtifact(raw: unknown) {
  const artifact = artifactSchema.parse(raw), certified = new Set<string>();
  function verifyFactors(n: bigint, fs: Factors) {
    let previous = B(1), product = B(1);
    for (const [q, e] of fs) {
      if (B(q) <= previous || !certified.has(q)) throw new Error("Uncertified/unordered factor");
      previous = B(q); product *= B(q) ** B(e);
    }
    if (product !== n) throw new Error("Factor product mismatch");
  }
  let previous = B(1);
  for (const cert of artifact.primes) {
    const n = B(cert.n);
    if (n <= previous) throw new Error("Prime order/uniqueness failure");
    previous = n;
    if (n === B(2)) {
      if (cert.minusOneFactors.length || cert.witnesses.length) throw new Error("Invalid base certificate");
    } else {
      if (n % B(2) === B(0)) throw new Error("Even Lucas node");
      verifyFactors(n - B(1), cert.minusOneFactors);
      if (!cert.minusOneFactors.length || cert.witnesses.length !== cert.minusOneFactors.length) throw new Error("Incomplete Lucas witnesses");
      for (let i = 0; i < cert.witnesses.length; i++) {
        const [q, base] = cert.witnesses[i], a = B(base);
        if (q !== cert.minusOneFactors[i][0] || a <= B(1) || a >= n || modpow(a, n - B(1), n) !== B(1) ||
          gcd(modpow(a, (n - B(1)) / B(q), n) - B(1), n) !== B(1)) throw new Error("Lucas order witness failure");
      }
    }
    certified.add(cert.n);
  }
  const reports = artifact.targets.map((target, index) => {
    const p = B(target.p), maxCore = normalizedCoreFiniteBound(p).maxCore;
    if (target.p !== SQUARE_CORE_TARGETS[index] || !certified.has(target.p)) throw new Error("Target scope/primality failure");
    if (B(target.maxCore) !== maxCore) throw new Error("Finite bound drift");
    const required = squareCoreRequiredInputs(p);
    for (let i = 0; i < target.criterionFactors.length; i++) {
      const entry = target.criterionFactors[i], expected = required[i];
      if (entry.kind !== expected.kind || entry.a !== expected.a || entry.t !== expected.t || entry.value !== expected.value) throw new Error("Criterion scope drift");
      verifyFactors(B(entry.value), entry.factors);
    }
    const ellTable = new Map<string, Factors>();
    let previousEll = B(1);
    for (const entry of target.candidateEllFactors) {
      if (B(entry.value) <= previousEll) throw new Error("Candidate order/uniqueness failure");
      previousEll = B(entry.value); verifyFactors(previousEll, entry.factors); ellTable.set(entry.value, entry.factors);
    }
    const base = { p: target.p, maxCore: target.maxCore, criterionEntries: target.criterionFactors.length, candidateEllEntries: ellTable.size };
    if (target.status === "PARTIAL") {
      if (!target.unresolved.length) throw new Error("PARTIAL requires unresolved phase/input");
      return { ...base, status: "PARTIAL" as const, unresolved: target.unresolved, manifest: [], manifestDigest: hash([]), witnesses: [] };
    }
    if (target.unresolved.length || target.criterionFactors.length !== required.length) throw new Error("Missing criterion/incomplete discovery");
    const used = new Set<string>(), manifest = [], witnesses = [];
    for (let exponent = 1; exponent <= 4; exponent++) {
      const C = power(exponent + 2), candidates = new Map<string, string>();
      for (const entry of target.criterionFactors) {
        if (entry.kind === "TRANSLATED" ? entry.a !== exponent : entry.t > 2 * exponent + 2) continue;
        for (const s of divisors(entry.factors)) {
          if ((s + B(1)) % C) continue;
          const square = (s + B(1)) / C, ell = isqrt(square);
          if (ell < B(3) || ell % B(2) === B(0) || ell * ell !== square) continue;
          if (!ellTable.has(String(ell))) throw new Error("Missing candidate ell decision");
          used.add(String(ell)); candidates.set(String(s), String(ell));
        }
      }
      const decisions = [];
      for (const [sText, ellText] of [...candidates].sort((x, y) => B(x[0]) < B(y[0]) ? -1 : 1)) {
        const s = B(sText), ell = B(ellText), m = power(exponent) * ell ** B(2), fs = ellTable.get(ellText)!;
        const prime = fs.length === 1 && fs[0][0] === ellText && fs[0][1] === 1;
        const pairs = squareCoreOriginalPairs(p, exponent, ell);
        const reason = !prime ? "COMPOSITE_ELL" : m > maxCore ? "OUTSIDE_FINITE_BOUND" : !pairs.length ? "ORIGINAL_CONGRUENCE_MISS" : "HIT";
        decisions.push({ s: sText, ell: ellText, reason });
        if (reason !== "HIT") continue;
        const { a, u } = pairs[0], v = (a * p + u) / s, k = m / (a * u);
        const ds = [u * v * k, a * p * u * k, a * p * v * k].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        const witness = { n: target.p, x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
        const strict = verifyErdos242StrictWitness(witness);
        if (!strict.valid || ds.filter((d) => d % p === B(0)).length !== 2) throw new Error("Strict Type II witness failure");
        witnesses.push({ exponent, ell: ellText, construction: { a: String(a), u: String(u), s: sText, v: String(v), k: String(k) }, witness, strictDigest: strict.benchmarkDigest });
      }
      manifest.push([exponent, decisions]);
    }
    if (used.size !== ellTable.size) throw new Error("Extra ell decision outside scope");
    return { ...base, status: "COMPLETE_FOR_B2_A1_TO_A4_ONLY" as const, unresolved: [], manifest, manifestDigest: hash(manifest), witnesses };
  });
  return { method: "ERDOS_STRAUS_CERTIFIED_SQUARE_CORE_DECISION_V1" as const, primeCertificatesChecked: certified.size,
    targets: reports, higherAorB: "UNCOMPUTED" as const,
    scope: "Four fixed targets ONLY; b=2, a1..4, all divisor candidates without ell/s ceiling; original normalized congruence and finite bound checked. Higher a/b UNCOMPUTED; not whole b2/all-core exclusion, formal proof, novelty, root theorem or agent evidence." };
}

export function loadSquareCoreArtifact() {
  const bytes = readFileSync(resolve("scripts/operations/square-core-artifact.json"));
  if (bytes.length > 1024 * 1024 || createHash("sha256").update(bytes).digest("hex") !== SQUARE_CORE_ARTIFACT_SHA256) throw new Error("Artifact drift/size bound");
  return JSON.parse(bytes.toString("utf8")) as unknown;
}
