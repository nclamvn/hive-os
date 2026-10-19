import { createHash } from "node:crypto";
import { divisorCharacterAtlas, jacobiSymbol } from "./math-divisor-character";
import { isPrimeInSurvey, verifyErdos242StrictWitness } from "./math-certificates";

const seal = <T extends object>(body: T) => ({ ...body,
  digest: createHash("sha256").update(JSON.stringify(body), "utf8").digest("hex") });

function power(a: number, e: number, s: number) {
  let v = 1;
  while (e) {
    if (e % 2) v = v * a % s;
    a = a * a % s;
    e = Math.floor(e / 2);
  }
  return v;
}

/** Full generator closure is an outer envelope, never a witness certificate. */
export function divisorOccupancyAtlas(s: number) {
  const atlas = divisorCharacterAtlas(s); // Reviewed bounded domain and exact R_s.
  const generated = new Set([1]), queue = [1];
  for (let i = 0; i < queue.length; i++) for (const { prime } of atlas.core) {
    const next = queue[i] * prime % s;
    if (!generated.has(next)) { generated.add(next); queue.push(next); }
  }
  // Positive-power closure contains inverses because this is a finite group.
  const subgroup = [...generated].sort((a, b) => a - b);
  const negativeCoset = subgroup.map((h) => s - h).sort((a, b) => a - b);
  const coset = new Set(negativeCoset), usable = new Set(atlas.usableResidues);
  if (subgroup.some((h) => jacobiSymbol(h, s) !== 1) || generated.has(s - 1) ||
    atlas.usableResidues.some((r) => !coset.has(r))) throw new Error("Subgroup envelope invariant failed");
  const subgroupObstructions = atlas.negativeCharacterResidues.filter((r) => !coset.has(r));
  const exponentWindowObstructions = negativeCoset.filter((r) => !usable.has(r));
  if (subgroupObstructions.length + exponentWindowObstructions.length !== atlas.negativeCharacterMisses.length) {
    throw new Error("Obstruction partition failed");
  }
  const primeModulus = isPrimeInSurvey(s);
  if (primeModulus) for (let r = 1; r < s; r++) {
    if ((power(s - r, subgroup.length, s) === 1) !== coset.has(r)) throw new Error("Prime cyclic-group test failed");
  }
  let primePowerCore: { prime: number; exponent: number; order: number; predictedResidues: number; saturated: boolean } | null = null;
  if (atlas.core.length === 1) {
    const { prime, exponent } = atlas.core[0], order = subgroup.length;
    const predictedResidues = Math.min(order, 2 * exponent + 1);
    if (atlas.usableResidues.length !== predictedResidues ||
      (prime === 2 ? order !== exponent + 2 : order <= 2 * exponent + 1)) {
      throw new Error("Prime-power occupancy theorem failed");
    }
    primePowerCore = { prime, exponent, order, predictedResidues, saturated: predictedResidues === order };
  }
  return seal({ method: "ERDOS_STRAUS_SUBGROUP_OCCUPANCY_V1" as const, s, m: atlas.m,
    core: atlas.core, primeModulus, subgroup, negativeCoset, usableResidues: atlas.usableResidues,
    negativeCharacterCount: atlas.negativeCharacterResidues.length, subgroupObstructions, exponentWindowObstructions,
    saturated: atlas.usableResidues.length === subgroup.length, primePowerCore,
    scope: "Exact normalized modular eligibility; subgroup obstruction survives exponent relaxation at this s; no other-s, Type I, root or novelty conclusion" });
}

export function classifyDivisorOccupancy(p: number, s: number) {
  if (!Number.isSafeInteger(p) || p < 0 || p > 200000000) throw new RangeError("Numerator must be a safe integer within 0..200000000");
  const atlas = divisorOccupancyAtlas(s), residue = p % s, character = jacobiSymbol(residue, s);
  const classification = character !== -1 ? "CHARACTER_OBSTRUCTION" as const
    : !atlas.negativeCoset.includes(residue) ? "SUBGROUP_OBSTRUCTION" as const
      : !atlas.usableResidues.includes(residue) ? "EXPONENT_WINDOW_OBSTRUCTION" as const : "ELIGIBLE" as const;
  return seal({ method: "ERDOS_STRAUS_OCCUPANCY_CLASSIFICATION_V1" as const, p, s, residue, character,
    classification, subgroupOrder: atlas.subgroup.length, eligibleCount: atlas.usableResidues.length,
    primePowerCore: atlas.primePowerCore, atlasDigest: atlas.digest,
    // For composite s this equation is not a sufficient subgroup-membership test.
    primePowerTest: atlas.primeModulus ? power((s - residue) % s, atlas.subgroup.length, s) : null,
    scope: "Modular eligibility only; arbitrary bounded numerator, not a prime/strict identity certificate" });
}

/** All dyadic-core moduli for ONE p, using an elementary monotone tail bound. */
export function auditAllDyadicEligibility(p: number) {
  if (!Number.isSafeInteger(p) || p < 841 || p > 200000000 || p % 840 !== 1 || !isPrimeInSurvey(p)) {
    throw new RangeError("Require residual prime within 841..200000000");
  }
  const n = BigInt(p), rows = [];
  let t = 2;
  for (; (BigInt(1) << BigInt(t - 1)) - BigInt(1) <= n; t++) {
    const s = (BigInt(1) << BigInt(t)) - BigInt(1), r = n % s;
    // t=2 is the trivial m=1 endpoint: R_3={-1}, NOT -<2>.
    const exponents = t === 2 ? [0] : Array.from({ length: t }, (_, j) => j);
    const j = exponents.find((j) => r === s - (BigInt(1) << BigInt(j))) ?? null;
    rows.push({ t, s: String(s), residue: String(r), matchingPower: j });
  }
  const hits = rows.filter((r) => r.matchingPower !== null), firstT = hits[0]?.t ?? null;
  if (firstT !== null && (firstT < 5 || !isPrimeInSurvey(firstT))) throw new Error("Dyadic ancestry invariant failed");
  for (const hit of hits) for (let d = 3; d < hit.t; d++) if (hit.t % d === 0 &&
    rows.find((r) => r.t === d)?.matchingPower === null) throw new Error("Dyadic projection failed");
  return seal({ method: "ERDOS_STRAUS_ALL_DYADIC_ELIGIBILITY_V1" as const, p, firstT, hits, rows,
    cutoffT: t, tailMinimumResidue: String((BigInt(1) << BigInt(t - 1)) - BigInt(1)),
    status: hits.length ? "DYADIC_ELIGIBILITY_EXISTS" as const : "NO_DYADIC_ELIGIBILITY_FOR_THIS_P" as const,
    coverage: "ALL_EXPONENTS_BY_FINITE_CHECK_PLUS_MONOTONE_CUTOFF" as const,
    scope: "All m=2^e, e>=0, for this p in the normalized family only; eligibility is not a strict witness certificate; other cores and root are not excluded" });
}

function completeDivisors(n: number) {
  let values = [1];
  for (let q = 2; q * q <= n; q++) if (n % q === 0) {
    let e = 0;
    while (n % q === 0) { n /= q; e++; }
    values = values.flatMap((v) => Array.from({ length: e + 1 }, (_, j) => v * q ** j));
  }
  if (n > 1) values = values.flatMap((v) => [v, v * n]);
  return values;
}

/** Complete single-prime-core eligibility for ONE p, not all Type II constructions. */
export function auditAllPrimePowerCoreEligibility(p: number) {
  auditAllDyadicEligibility(p); // Same independently checkable residual-prime domain.
  const maxM = Math.floor((p + 1) / 2), candidates = new Map<number, { prime: number; exponent: number }>();
  // e=1 has residues -1,-ell,-4; the middle congruence is s|(4p+1).
  for (const value of [p + 1, p + 4, 4 * p + 1]) for (const s of completeDivisors(value)) {
    if (s < 7 || s % 4 !== 3 || s > 2 * p + 1) continue;
    const prime = (s + 1) / 4;
    if (isPrimeInSurvey(prime)) candidates.set(s, { prime, exponent: 1 });
  }
  // For e>=2 the monotone residue bound limits the base to sqrt(maxM).
  const maxPrime = Math.floor(Math.sqrt(maxM)), sieve = new Uint8Array(maxPrime + 1);
  for (let q = 2; q <= maxPrime; q++) if (!sieve[q]) {
    for (let j = q * q; j <= maxPrime; j += q) sieve[j] = 1;
    for (let m = q * q, e = 2; m <= maxM; m *= q, e++) candidates.set(4 * m - 1, { prime: q, exponent: e });
  }
  const rows = [], hits = [];
  for (const [s, { prime, exponent }] of [...candidates].sort((a, b) => a[0] - b[0])) {
    const pairs = [{ a: 1, u: 1 }];
    for (let j = 1; j <= exponent; j++) pairs.push({ a: 1, u: prime ** j }, { a: prime ** j, u: 1 });
    pairs.sort((x, y) => x.a - y.a || x.u - y.u);
    const pair = pairs.find(({ a, u }) => (BigInt(a) * BigInt(p) + BigInt(u)) % BigInt(s) === BigInt(0));
    rows.push([s, prime, exponent, p % s, Boolean(pair)]);
    if (pair) {
      const a = BigInt(pair.a), u = BigInt(pair.u), n = BigInt(p),
        v = (a * n + u) / BigInt(s), k = BigInt((s + 1) / 4) / (a * u);
      const ds = [u * v * k, a * n * u * k, a * n * v * k].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
      const witness = { n: String(p), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
      const strict = verifyErdos242StrictWitness(witness);
      if (!strict.valid || ds.filter((d) => d % n === BigInt(0)).length !== 2) throw new Error("Prime-power witness replay failed");
      hits.push({ s, prime, exponent, witness, strictDigest: strict.benchmarkDigest });
    }
  }
  return seal({ method: "ERDOS_STRAUS_ALL_PRIME_POWER_CORE_V1" as const, p, maxM,
    tailFromS: 2 * p + 2, candidatesChecked: rows.length, rows, hits,
    status: hits.length ? "PRIME_POWER_CORE_WITNESS_EXISTS" as const : "NO_PRIME_POWER_CORE_ELIGIBILITY_FOR_THIS_P" as const,
    coverage: "ALL_PRIME_BASES_AND_EXPONENTS_BY_DIVISOR_CRITERION_AND_MONOTONE_CUTOFF" as const,
    scope: "All m=ell^e with prime ell and e>=1, plus the m=1 residual miss; for this p only in the normalized family; mixed cores, other constructions and root not excluded" });
}
