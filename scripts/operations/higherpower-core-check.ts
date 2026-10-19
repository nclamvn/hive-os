import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { isPrimeInSurvey, verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

export const HIGHERPOWER_TARGETS = [131433121, 159727681, 351121, 171348241] as const;
const controlPrimes = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
export const HIGHERPOWER_SCOPE = "Four fixed residual-prime targets, full normalized m=2^a*ell^b with a>=1,b>=2,ell odd PRIME; all a,b,ell through written min-residue bounds, all s. Signed-box versus separate integer-pair replay. One canonical (A,U)-ordered strict representative per hit core; not all solutions, other core supports, root proof, formal/novelty or agent evidence. D/E/F remain unchanged.";
export const HIGHERPOWER_LIMITS = { secondsPerTarget: 30, maxCoresPerTarget: 100000 } as const;
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const one = BigInt(1), two = BigInt(2);
const compare = (x: bigint, y: bigint) => x < y ? -1 : x > y ? 1 : 0;
function inverse(a: bigint, s: bigint) {
  let r = a, old = s, t = one, previous = BigInt(0);
  while (r) { const q = old / r; [old, r] = [r, old - q * r]; [previous, t] = [t, previous - q * t]; }
  if (old !== one) throw new Error("Nonunit core factor");
  return (previous % s + s) % s;
}
function powmod(a: bigint, e: number, s: bigint) { let out = one; for (let j = 0; j < e; j++) out = out * a % s; return out; }
function signedPairs(a: number, b: number, ell: number) {
  const powers2 = Array.from({ length: a + 1 }, (_, j) => one << BigInt(j));
  const powersEll = Array.from({ length: b + 1 }, (_, j) => BigInt(ell) ** BigInt(j));
  const out = [];
  for (let f = -a; f <= a; f++) for (let g = -b; g <= b; g++) out.push({
    A: powers2[Math.max(-f, 0)] * powersEll[Math.max(-g, 0)],
    U: powers2[Math.max(f, 0)] * powersEll[Math.max(g, 0)], aggregate: g === -b || g === 0 || g === b,
  });
  return out;
}

export function higherpowerResidueLowerBound(a: number, b: number, ell: number) {
  if (!Number.isSafeInteger(a) || a < 1 || a > 25 || !Number.isSafeInteger(b) || b < 1 || b > 16 ||
    !Number.isSafeInteger(ell) || ell < 3 || ell > 8015 || ell % 2 === 0 || !isPrimeInSurvey(ell)) throw new RangeError("Bounded power-core arithmetic domain");
  const B = one << BigInt(a), q = BigInt(ell) ** BigInt(b), first = BigInt(3) * B - one,
    second = (BigInt(4) * B * q + B) / (B + one) - one;
  return { dyadicLowerBound: String(first), oddPowerLowerBound: String(second),
    lowerBound: String(first > second ? first : second) };
}

function finiteControl(a: number, b: number, ell: number) {
  const B = one << BigInt(a), q = BigInt(ell) ** BigInt(b), m = B * q, s = BigInt(4) * m - one;
  const residues = [...new Set(signedPairs(a, b, ell).map(({ A, U }) => String((s - U * inverse(A, s) % s) % s)))].map(BigInt).sort(compare);
  const image = new Set<string>();
  for (let t = -2 * a - 2; t <= 2 * a + 2; t++) image.add(String((s - powmod(t < 0 ? inverse(two, s) : two, Math.abs(t), s)) % s));
  for (let r = 1; r < b; r++) for (let t = -a; t <= 2 * a + 2; t++) image.add(String((s - (BigInt(ell) ** BigInt(r)) * powmod(t < 0 ? inverse(two, s) : two, Math.abs(t), s) % s) % s));
  const normalized = [...image].map(BigInt).sort(compare), bound = higherpowerResidueLowerBound(a, b, ell);
  if (residues.join() !== normalized.join() || residues[0] < BigInt(bound.lowerBound)) throw new Error("Power-core image/bound failure");
  return [a, b, ell, String(m), String(s), residues.length, String(residues[0]), bound.lowerBound, hash(residues.map(String))];
}

function exactOddPrimes(limit: number) {
  if (!Number.isSafeInteger(limit) || limit > 8015) throw new RangeError("Prime-base scope drift");
  const composite = new Uint8Array(limit + 1), primes = [];
  for (let n = 2; n <= limit; n++) if (!composite[n]) {
    for (let j = n * n; j <= limit; j += n) composite[j] = 1;
    if (n > 2) primes.push(n);
  }
  return primes;
}
function corePlan(p: number) {
  if (!HIGHERPOWER_TARGETS.some((n) => n === p) || !isPrimeInSurvey(p)) throw new RangeError("Fixed four target scope");
  const n = BigInt(p); let maxA = 0;
  while (BigInt(3) * (one << BigInt(maxA + 1)) - one <= n) maxA++;
  const globalQ = BigInt(3) * (n + one) / BigInt(8);
  // Exact small prime-base limit: these four fixed q bounds are <2^26.
  let primeLimit = 0; while (BigInt(primeLimit + 1) ** two <= globalQ) primeLimit++;
  const primes = exactOddPrimes(primeLimit), cores = [];
  for (let a = 1; a <= maxA; a++) {
    const B = one << BigInt(a), maxQ = (n + one) * (B + one) / (BigInt(4) * B);
    for (const ell of primes) for (let b = 2, q = BigInt(ell) ** two; q <= maxQ; b++, q *= BigInt(ell)) cores.push({ a, b, ell, q, m: B * q });
  }
  if (cores.length > HIGHERPOWER_LIMITS.maxCoresPerTarget) throw new Error("Predeclared core limit");
  return { maxA, globalQ, primeLimit, primeBases: primes.length, cores };
}

export function higherpowerTargetAudit(p: number) {
  const deadline = performance.now() + HIGHERPOWER_LIMITS.secondsPerTarget * 1000;
  const plan = corePlan(p), n = BigInt(p);
  const digest = createHash("sha256"), coreWitnesses = [];
  let checked = 0, slots = 0;
  for (const core of plan.cores) {
    if (performance.now() >= deadline) return { p: String(p), status: "PARTIAL" as const,
      plannedCores: plan.cores.length, checkedCores: checked, pendingFirstCore: { a: core.a, b: core.b, ell: core.ell },
      reason: "TARGET_30_SECOND_LIMIT", prefixRowsDigest: digest.digest("hex") };
    const s = BigInt(4) * core.m - one;
    let chosen: { A: bigint; U: bigint } | null = null, aggregateHit = false;
    const pairs = signedPairs(core.a, core.b, core.ell);
    slots += pairs.length;
    for (const pair of pairs) if ((pair.A * n + pair.U) % s === BigInt(0)) {
      aggregateHit ||= pair.aggregate;
      if (!chosen || pair.A < chosen.A || pair.A === chosen.A && pair.U < chosen.U) chosen = pair;
    }
    digest.update(JSON.stringify([String(p), core.a, core.b, core.ell, String(core.m), String(s), chosen !== null, aggregateHit, chosen ? String(chosen.A) : null, chosen ? String(chosen.U) : null]) + "\n");
    checked++;
    if (chosen) {
      const { A, U } = chosen, v = (A * n + U) / s, k = core.m / (A * U);
      const ds = [U * v * k, A * n * U * k, A * n * v * k].sort(compare);
      const witness = { n: String(p), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) }, strict = verifyErdos242StrictWitness(witness);
      if (!strict.valid || ds.filter((d) => d % n === BigInt(0)).length !== 2 || core.m % (A * U)) throw new Error("Strict full-power identity failure");
      coreWitnesses.push({ a: core.a, b: core.b, ell: core.ell, q: String(core.q), m: String(core.m), s: String(s),
        translatedOnly: !aggregateHit, construction: { A: String(A), U: String(U), v: String(v), k: String(k) }, witness, strictDigest: strict.benchmarkDigest });
    }
  }
  if (performance.now() >= deadline) return { p: String(p), status: "PARTIAL" as const,
    plannedCores: plan.cores.length, checkedCores: checked, pendingFirstCore: null,
    reason: "TARGET_30_SECOND_LIMIT_FINALIZE", prefixRowsDigest: digest.digest("hex") };
  return { p: String(p), status: "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE" as const,
    maxA: plan.maxA, globalOddPowerBound: String(plan.globalQ), primeBaseLimit: plan.primeLimit, primeBases: plan.primeBases,
    plannedCores: plan.cores.length, checkedCores: checked, signedPairSlots: slots, rowsDigest: digest.digest("hex"),
    coreWitnessCount: coreWitnesses.length, translatedOnlyCoreCount: coreWitnesses.filter((w) => w.translatedOnly).length,
    distinctTupleCount: new Set(coreWitnesses.map((w) => JSON.stringify(w.witness))).size, coreWitnesses };
}

export function higherpowerCorePacket() {
  const rows = [];
  for (let a = 1; a <= 8; a++) for (let b = 1; b <= 6; b++) for (const ell of controlPrimes) rows.push(finiteControl(a, b, ell));
  const targets = HIGHERPOWER_TARGETS.map(higherpowerTargetAudit);
  return { method: "ERDOS_STRAUS_HIGHERPOWER_CORE_V1" as const, limits: HIGHERPOWER_LIMITS,
    finiteBoundControls: { maxA: 8, maxB: 6, primeBases: controlPrimes, rows: rows.length, rowsDigest: hash(rows) },
    rowManifestFormat: "SHA256_COMPACT_JSON_ROWS_WITH_LF_IN_A_ELL_B_ORDER" as const,
    status: targets.every((t) => t.status === "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE") ? "COMPLETE" as const : "PARTIAL" as const,
    targets, scope: HIGHERPOWER_SCOPE };
}
