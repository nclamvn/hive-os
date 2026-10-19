import { createHash } from "node:crypto";
import { verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";
import { CERTIFIED_TWO_CORE_ARTIFACT_SHA256, loadCertifiedTwoCoreArtifact, verifyCertifiedTwoCoreArtifact } from "./certified-two-core-check";

type Factors = Array<[string, number]>;
type VerifiedArtifact = { targets: Array<{ p: string; maxA: number;
  criterionFactors: Array<{ j: number; factors: Factors }>;
  candidateEllFactors: Array<{ value: string; factors: Factors }> }> };
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export const AGGREGATE_ODD_CORE_SCOPE = "Four fixed targets, m=2^a*q with odd q>=3 PRIME OR COMPOSITE; ratios ONLY 2^f*q^g, -a<=f<=a and g=-1,0,1 (whole q block, never its partial prime divisors). Exact image -2^t with |t|<=2a+2 and written cutoff3*2^a-1<=p; all allowed a/all s certified in this restricted block family. One canonical (A,U)-ordered strict representative per eligible (a,q,s); tuple counts refer to those representatives, not all solutions. Not all normalized composite-core divisors, formal/novelty, root coverage, agent evidence or denominator optimum.";
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
function modpow(a: bigint, e: number, s: bigint) {
  let v = BigInt(1);
  for (let j = 0; j < e; j++) v = v * a % s;
  return v;
}
function inverse(a: bigint, s: bigint) {
  let r = a, old = s, t = BigInt(1), previous = BigInt(0);
  while (r) {
    const q = old / r;
    [old, r] = [r, old - q * r]; [previous, t] = [t, previous - q * t];
  }
  if (old !== BigInt(1)) throw new Error("Nonunit aggregate block");
  return (previous % s + s) % s;
}
function wholeBlockPairs(exponent: number, q: bigint) {
  const pairs = [];
  for (let f = -exponent; f <= exponent; f++) for (let g = -1; g <= 1; g++) pairs.push({
    a: (BigInt(1) << BigInt(Math.max(-f, 0))) * q ** BigInt(Math.max(-g, 0)),
    u: (BigInt(1) << BigInt(Math.max(f, 0))) * q ** BigInt(Math.max(g, 0)),
  });
  return pairs.sort((x, y) => x.a < y.a ? -1 : x.a > y.a ? 1 : x.u < y.u ? -1 : x.u > y.u ? 1 : 0);
}
function divisors(fs: Factors) {
  let out = [BigInt(1)];
  for (const [q, e] of fs) out = out.flatMap((v) => Array.from({ length: e + 1 }, (_, j) => v * BigInt(q) ** BigInt(j)));
  if (out.length > 100000) throw new Error("Divisor resource limit");
  return out;
}

/** Separately bounded finite set regression; no historical application cap changes. */
export function aggregateOddCoreAtlas(a: number, q: number) {
  if (!Number.isSafeInteger(a) || a < 1 || a > 8 || !Number.isSafeInteger(q) || q < 3 || q > 999 || q % 2 === 0) throw new RangeError("Finite aggregate atlas requires a1..8, odd q3..999");
  const Q = BigInt(q), m = (BigInt(1) << BigInt(a)) * Q, s = BigInt(4) * m - BigInt(1), pairs = wholeBlockPairs(a, Q);
  const residues = [...new Set(pairs.map(({ a: A, u: U }) => String((s - U * inverse(A, s) % s) % s)))].map(BigInt).sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
  const interval = [...new Set(Array.from({ length: 4 * a + 5 }, (_, i) => {
    const t = i - 2 * a - 2;
    return String((s - modpow(t >= 0 ? BigInt(2) : inverse(BigInt(2), s), Math.abs(t), s)) % s);
  }))].map(BigInt).sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
  if (residues.join() !== interval.join() || residues[0] < BigInt(3) * (BigInt(1) << BigInt(a)) - BigInt(1)) throw new Error("Aggregate image/cutoff invariant");
  return { a, q, m: String(m), s: String(s), pairs: pairs.map((p) => ({ a: String(p.a), u: String(p.u) })),
    residues: residues.map(String), residuesDigest: hash(residues.map(String)) };
}

/** Additive output only: verifies D's fixed complete certificate but never modifies D. */
export function verifyAggregateOddCore(raw: unknown) {
  const primeBaseline = verifyCertifiedTwoCoreArtifact(raw);
  const artifact = raw as VerifiedArtifact;
  const targets = artifact.targets.map((target, i) => {
    const p = BigInt(target.p), qTable = new Map(target.candidateEllFactors.map((entry) => [entry.value, entry.factors]));
    const used = new Set<string>(), manifest: Array<[number, Array<[string, string, "PRIME" | "COMPOSITE"]>]> = [], coreWitnesses = [];
    for (let exponent = 1; exponent <= target.maxA; exponent++) {
      const C = BigInt(1) << BigInt(exponent + 2), hits = new Map<string, string>();
      for (const entry of target.criterionFactors) {
        if (entry.j > 2 * exponent + 2) continue;
        for (const s of divisors(entry.factors)) {
          if ((s + BigInt(1)) % C) continue;
          const q = (s + BigInt(1)) / C;
          if (q < BigInt(3) || q % BigInt(2) === BigInt(0)) continue;
          if (!qTable.has(String(q))) throw new Error("Missing certified aggregate block decision");
          used.add(String(q)); hits.set(String(s), String(q));
        }
      }
      const row = [...hits].sort((x, y) => BigInt(x[0]) < BigInt(y[0]) ? -1 : 1).map(([s, q]) => {
        const fs = qTable.get(q)!;
        const classification = fs.length === 1 && fs[0][0] === q && fs[0][1] === 1 ? "PRIME" as const : "COMPOSITE" as const;
        return [s, q, classification] as [string, string, "PRIME" | "COMPOSITE"];
      });
      manifest.push([exponent, row]);
      for (const [sText, qText, classification] of row) {
        const s = BigInt(sText), q = BigInt(qText), m = (BigInt(1) << BigInt(exponent)) * q;
        const pair = wholeBlockPairs(exponent, q).find(({ a, u }) => (a * p + u) % s === BigInt(0));
        if (!pair) throw new Error("Aggregate criterion lacks whole-block witness");
        const { a, u } = pair, v = (a * p + u) / s, k = m / (a * u);
        if (gcd(a, u) !== BigInt(1) || m % (a * u)) throw new Error("Aggregate coprimality/product failure");
        const ds = [u * v * k, a * p * u * k, a * p * v * k].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        const witness = { n: target.p, x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) }, strict = verifyErdos242StrictWitness(witness);
        if (!strict.valid || ds.filter((d) => d % p === BigInt(0)).length !== 2) throw new Error("Aggregate strict Type II identity failure");
        coreWitnesses.push({ exponent, q: qText, qClassification: classification, qFactors: qTable.get(qText)!,
          construction: { a: String(a), u: String(u), s: sText, v: String(v), k: String(k) }, witness, strictDigest: strict.benchmarkDigest });
      }
    }
    if (used.size !== qTable.size) throw new Error("Unexpected unused aggregate decision");
    const primeRows = manifest.map(([a, row]) => [a, row.filter((r) => r[2] === "PRIME").map(([s, q]) => [s, q])]);
    if (JSON.stringify(primeRows) !== JSON.stringify(primeBaseline.targets[i].manifest)) throw new Error("Prime-subclass compatibility failure");
    const tuples = new Set(coreWitnesses.map((w) => JSON.stringify(w.witness)));
    const baselineTuples = new Set(primeBaseline.targets[i].witnesses.map((w) => JSON.stringify(w.witness)));
    return { p: target.p, status: "COMPLETE_FOR_AGGREGATE_ODD_BLOCK_SUBFAMILY" as const, maxA: target.maxA,
      tailFromA: target.maxA + 1, tailMinimumResidue: primeBaseline.targets[i].tailMinimumResidue,
      manifest, manifestDigest: hash(manifest), coreWitnessCount: coreWitnesses.length,
      compositeCoreWitnessCount: coreWitnesses.filter((w) => w.qClassification === "COMPOSITE").length,
      distinctTupleCount: tuples.size, primeBaselineWitnessCount: primeBaseline.targets[i].witnesses.length,
      primeBaselineDistinctTupleCount: baselineTuples.size,
      additionalDistinctTupleCount: [...tuples].filter((t) => !baselineTuples.has(t)).length,
      coreWitnesses };
  });
  const all = targets.flatMap((t) => t.coreWitnesses);
  const allBaselineTuples = new Set(primeBaseline.targets.flatMap((t) => t.witnesses).map((w) => JSON.stringify(w.witness)));
  const allTuples = new Set(all.map((w) => JSON.stringify(w.witness)));
  return { method: "ERDOS_STRAUS_AGGREGATE_ODD_BLOCK_DECISION_V1" as const,
    sourceArtifactDigest: null as string | null, expectedSourceArtifactDigest: CERTIFIED_TWO_CORE_ARTIFACT_SHA256,
    primeCertificatesChecked: primeBaseline.primeCertificatesChecked,
    coreWitnessCount: all.length, compositeCoreWitnessCount: all.filter((w) => w.qClassification === "COMPOSITE").length,
    distinctTupleCount: allTuples.size, primeBaselineDistinctTupleCount: allBaselineTuples.size,
    additionalDistinctTupleCount: [...allTuples].filter((t) => !allBaselineTuples.has(t)).length, targets, scope: AGGREGATE_ODD_CORE_SCOPE };
}

export function aggregateOddCoreDecision() {
  // Only this fixed byte-hash-checked loader can assert actual source provenance.
  return { ...verifyAggregateOddCore(loadCertifiedTwoCoreArtifact()), sourceArtifactDigest: CERTIFIED_TWO_CORE_ARTIFACT_SHA256 };
}
