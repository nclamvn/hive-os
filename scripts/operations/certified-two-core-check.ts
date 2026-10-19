import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

export const CERTIFIED_TWO_CORE_ARTIFACT_SHA256 = "ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040";
const targets = ["131433121", "159727681", "351121", "171348241"];
const decimal = z.string().regex(/^[1-9][0-9]{0,29}$/);
const fsSchema = z.array(z.tuple([decimal, z.number().int().min(1).max(128)])).max(64);
const artifactSchema = z.object({
  method: z.literal("ERDOS_STRAUS_CERTIFIED_TWO_CORE_TAIL_V1"),
  discoveryLimits: z.object({ secondsPerTarget: z.literal(120), rhoSeeds: z.literal(32), rhoIterationsPerSeed: z.literal(2000000), lucasBases: z.literal(4096) }).strict(),
  targets: z.array(z.object({ p: decimal, maxA: z.number().int().min(1).max(25), maxJ: z.number().int().min(1).max(52),
    status: z.enum(["COMPLETE", "PARTIAL"]),
    criterionFactors: z.array(z.object({ kind: z.enum(["PLUS_POWER", "TIMES_POWER"]), j: z.number().int().min(0).max(52), value: decimal, factors: fsSchema }).strict()).max(106),
    candidateEllFactors: z.array(z.object({ value: decimal, factors: fsSchema }).strict()).max(10000),
    unresolved: z.array(z.object({ value: decimal, purpose: z.string().max(64), reason: z.string().max(128) }).strict()).max(10000),
  }).strict()).length(4),
  primes: z.array(z.object({ n: decimal, minusOneFactors: fsSchema,
    witnesses: z.array(z.tuple([decimal, decimal])).max(64) }).strict()).min(1).max(10000),
}).strict();
type Factors = z.infer<typeof fsSchema>;
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a < BigInt(0) ? -a : a; }
function modpow(a: bigint, e: bigint, n: bigint) {
  let result = BigInt(1);
  while (e) { if (e % BigInt(2)) result = result * a % n; a = a * a % n; e /= BigInt(2); }
  return result;
}
function divisors(fs: Factors) {
  let values = [BigInt(1)];
  for (const [q, e] of fs) values = values.flatMap((v) => Array.from({ length: e + 1 }, (_, j) => v * BigInt(q) ** BigInt(j)));
  if (values.length > 100000) throw new Error("Divisor resource bound exceeded");
  return values;
}

/** Verify every recursive Lucas dependency and product, never discovery/MR output. */
export function verifyCertifiedTwoCoreArtifact(raw: unknown) {
  const artifact = artifactSchema.parse(raw), certified = new Set<string>();
  const verifyFactors = (n: bigint, fs: Factors) => {
    let previous = BigInt(1), product = BigInt(1);
    for (const [q, e] of fs) {
      if (BigInt(q) <= previous || !certified.has(q)) throw new Error("Uncertified or unordered factor");
      previous = BigInt(q); product *= BigInt(q) ** BigInt(e);
    }
    if (product !== n) throw new Error("Factor product mismatch");
  };
  let previousPrime = BigInt(1);
  for (const cert of artifact.primes) {
    const n = BigInt(cert.n);
    if (n <= previousPrime) throw new Error("Prime node ordering/uniqueness failure");
    previousPrime = n;
    if (n === BigInt(2)) {
      if (cert.minusOneFactors.length || cert.witnesses.length) throw new Error("Invalid base certificate");
    } else {
      if (n % BigInt(2) === BigInt(0)) throw new Error("Even Lucas node");
      verifyFactors(n - BigInt(1), cert.minusOneFactors);
      if (!cert.minusOneFactors.length || cert.witnesses.length !== cert.minusOneFactors.length) throw new Error("Incomplete Lucas witnesses");
      for (let i = 0; i < cert.witnesses.length; i++) {
        const [q, base] = cert.witnesses[i], a = BigInt(base);
        if (q !== cert.minusOneFactors[i][0] || a <= BigInt(1) || a >= n ||
          modpow(a, n - BigInt(1), n) !== BigInt(1) ||
          gcd(modpow(a, (n - BigInt(1)) / BigInt(q), n) - BigInt(1), n) !== BigInt(1)) throw new Error("Lucas order witness failure");
      }
    }
    certified.add(cert.n);
  }
  const reports = artifact.targets.map((target, index) => {
    const p = BigInt(target.p);
    if (target.p !== targets[index] || !certified.has(target.p)) throw new Error("Target scope/primality failure");
    let maxA = 0;
    while (BigInt(3) * (BigInt(1) << BigInt(maxA + 1)) - BigInt(1) <= p) maxA++;
    if (target.maxA !== maxA || target.maxJ !== 2 * maxA + 2) throw new Error("Exponent/tail drift");
    if (target.status !== "COMPLETE" || target.unresolved.length) throw new Error("Incomplete certified artifact; unresolved inputs remain");
    const expectedCount = 2 * (target.maxJ + 1);
    if (target.criterionFactors.length !== expectedCount) throw new Error("Missing criterion entry");
    for (let i = 0; i < expectedCount; i++) {
      const entry = target.criterionFactors[i], j = Math.floor(i / 2), kind = i % 2 ? "TIMES_POWER" : "PLUS_POWER";
      const value = kind === "PLUS_POWER" ? p + (BigInt(1) << BigInt(j)) : (BigInt(1) << BigInt(j)) * p + BigInt(1);
      if (entry.kind !== kind || entry.j !== j || BigInt(entry.value) !== value) throw new Error("Criterion input scope drift");
      verifyFactors(value, entry.factors);
    }
    const ellTable = new Map<string, Factors>();
    let previousEll = BigInt(1);
    for (const entry of target.candidateEllFactors) {
      if (BigInt(entry.value) <= previousEll) throw new Error("Candidate ell ordering/uniqueness failure");
      previousEll = BigInt(entry.value); verifyFactors(previousEll, entry.factors); ellTable.set(entry.value, entry.factors);
    }
    const used = new Set<string>(), manifest: Array<[number, Array<[string, string]>]> = [], witnesses = [];
    for (let exponent = 1; exponent <= maxA; exponent++) {
      const C = BigInt(1) << BigInt(exponent + 2), eligible = new Map<string, string>();
      for (const entry of target.criterionFactors) {
        if (entry.j > 2 * exponent + 2) continue;
        for (const s of divisors(entry.factors)) {
          if ((s + BigInt(1)) % C) continue;
          const ell = (s + BigInt(1)) / C;
          if (ell < BigInt(3) || ell % BigInt(2) === BigInt(0)) continue;
          const fs = ellTable.get(String(ell));
          if (!fs) throw new Error("Missing candidate ell decision");
          used.add(String(ell));
          if (fs.length === 1 && fs[0][0] === String(ell) && fs[0][1] === 1) eligible.set(String(s), String(ell));
        }
      }
      const hits = [...eligible].sort((x, y) => BigInt(x[0]) < BigInt(y[0]) ? -1 : 1);
      manifest.push([exponent, hits]);
      for (const [sText, ellText] of hits) {
        const s = BigInt(sText), ell = BigInt(ellText), m = (BigInt(1) << BigInt(exponent)) * ell;
        const pairs = [];
        for (let f = -exponent; f <= exponent; f++) for (let g = -1; g <= 1; g++) pairs.push({
          a: (BigInt(1) << BigInt(Math.max(-f, 0))) * ell ** BigInt(Math.max(-g, 0)),
          u: (BigInt(1) << BigInt(Math.max(f, 0))) * ell ** BigInt(Math.max(g, 0)),
        });
        pairs.sort((x, y) => x.a < y.a ? -1 : x.a > y.a ? 1 : x.u < y.u ? -1 : x.u > y.u ? 1 : 0);
        const pair = pairs.find(({ a, u }) => (a * p + u) % s === BigInt(0));
        if (!pair) throw new Error("Certified divisor lacks normalized witness");
        const { a, u } = pair, v = (a * p + u) / s, k = m / (a * u);
        if (gcd(a, u) !== BigInt(1) || m % (a * u)) throw new Error("Normalized witness failure");
        const ds = [u * v * k, a * p * u * k, a * p * v * k].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        const witness = { n: target.p, x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
        const strict = verifyErdos242StrictWitness(witness);
        if (!strict.valid || ds.filter((d) => d % p === BigInt(0)).length !== 2) throw new Error("Certified strict Type II identity failure");
        witnesses.push({ exponent, ell: ellText, construction: { a: String(a), u: String(u), s: sText, v: String(v), k: String(k) }, witness, strictDigest: strict.benchmarkDigest });
      }
    }
    if (used.size !== ellTable.size) throw new Error("Extra ell decision outside fixed scope");
    return { p: target.p, status: "COMPLETE_FOR_NORMALIZED_TWO_CORE_SUBCLASS" as const, maxA,
      tailFromA: maxA + 1, tailMinimumResidue: String(BigInt(3) * (BigInt(1) << BigInt(maxA + 1)) - BigInt(1)),
      criterionEntries: expectedCount, candidateEllEntries: ellTable.size, manifest, manifestDigest: hash(manifest), witnesses };
  });
  return { method: "ERDOS_STRAUS_CERTIFIED_TWO_CORE_DECISION_V1" as const,
    primeCertificatesChecked: certified.size, targets: reports,
    scope: "Four fixed targets ONLY; all a permitted by the written tail and all s for m=2^a*ell, odd prime ell exponent ONE. Recursive Lucas/product verification, not Lean/formal, novelty, all-prime coverage, root theorem, agent event or new denominator optimum." };
}

export function loadCertifiedTwoCoreArtifact() {
  const bytes = readFileSync(resolve("scripts/operations/certified-two-core-artifact.json"));
  if (bytes.length > 1024 * 1024 || createHash("sha256").update(bytes).digest("hex") !== CERTIFIED_TWO_CORE_ARTIFACT_SHA256) throw new Error("Artifact drift or size bound");
  return JSON.parse(bytes.toString("utf8")) as unknown;
}
