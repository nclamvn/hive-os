import { createHash } from "node:crypto";
import { isPrimeInSurvey, verifyErdos242StrictWitness } from "./math-certificates";

const seal = <T extends object>(body: T) => ({ ...body,
  digest: createHash("sha256").update(JSON.stringify(body), "utf8").digest("hex") });

function factors(n: number): Array<{ prime: number; exponent: number }> {
  const out = [];
  for (let d = 2; d * d <= n; d++) if (n % d === 0) {
    let exponent = 0;
    while (n % d === 0) { n /= d; exponent++; }
    out.push({ prime: d, exponent });
  }
  if (n > 1) out.push({ prime: n, exponent: 1 });
  return out;
}

/** Exact binary Jacobi algorithm; does not interpret +1 as a square. */
export function jacobiSymbol(a: number, n: number): -1 | 0 | 1 {
  if (!Number.isSafeInteger(a) || a < 0 || !Number.isSafeInteger(n) || n < 3 || n % 2 === 0) {
    throw new RangeError("Nonnegative safe numerator and odd denominator >=3 required");
  }
  a %= n;
  let sign = 1;
  while (a) {
    while (a % 2 === 0) {
      a /= 2;
      if (n % 8 === 3 || n % 8 === 5) sign = -sign;
    }
    [a, n] = [n, a];
    if (a % 4 === 3 && n % 4 === 3) sign = -sign;
    a %= n;
  }
  return (n === 1 ? sign : 0) as -1 | 0 | 1;
}

function inverse(a: number, s: number) {
  let oldR = s, r = a, oldT = 0, t = 1;
  while (r) { const q = Math.floor(oldR / r); [oldR, r] = [r, oldR - q * r]; [oldT, t] = [t, oldT - q * t]; }
  if (oldR !== 1) throw new Error("Nonunit divisor");
  return (oldT % s + s) % s;
}

/** Signed valuations of m, instead of the primary search's inverse-residue loop. */
export function divisorCharacterAtlas(s: number) {
  if (!Number.isSafeInteger(s) || s < 3 || s > 4095 || s % 4 !== 3) throw new RangeError("s=3 mod4, 3..4095 required");
  const m = (s + 1) / 4, core = factors(m);
  let pairs = [{ a: 1, u: 1 }];
  for (const { prime, exponent } of core) {
    pairs = pairs.flatMap(({ a, u }) => Array.from({ length: 2 * exponent + 1 }, (_, i) => {
      const e = i - exponent;
      return { a: a * prime ** Math.max(-e, 0), u: u * prime ** Math.max(e, 0) };
    }));
  }
  const usableResidues = [...new Set(pairs.map(({ a, u }) => (s - u * inverse(a, s) % s) % s))].sort((a, b) => a - b);
  const negativeCharacterResidues = Array.from({ length: s - 1 }, (_, i) => i + 1).filter((r) => jacobiSymbol(r, s) === -1);
  if (core.some(({ prime }) => jacobiSymbol(prime, s) !== 1) || usableResidues.some((r) => jacobiSymbol(r, s) !== -1)) {
    throw new Error("Character necessity failed");
  }
  const usable = new Set(usableResidues);
  return seal({ method: "ERDOS_STRAUS_COMPOSITE_CHARACTER_ATLAS_V1" as const, s, m, core,
    pairCount: pairs.length, pairs, usableResidues, negativeCharacterResidues,
    negativeCharacterMisses: negativeCharacterResidues.filter((r) => !usable.has(r)),
    scope: "Exact normalized eligibility; character -1 is necessary, not sufficient; not all Type I/II" });
}

/** Exact character-blind class count, not a count of all misses or prime frequency. */
export function divisorMenuCharacterBarrier(maxS: number) {
  if (!Number.isSafeInteger(maxS) || maxS < 3 || maxS > 4095) throw new RangeError("maxS within 3..4095 required");
  const external = new Set<number>();
  for (let s = 3; s <= maxS; s += 4) for (const { prime, exponent } of factors(s)) {
    if (exponent % 2 && ![3, 5, 7].includes(prime)) external.add(prime);
  }
  const primes = [...external].sort((a, b) => a - b);
  // Direct rows q, or 3q with the known character (3/p)=1, generate every coordinate.
  const generators = primes.map((q) => ({ q, s: q % 4 === 3 ? q : 3 * q }));
  if (generators.some(({ s }) => s > maxS)) throw new Error("Character generator outside menu");
  return seal({ method: "ERDOS_STRAUS_MENU_CHARACTER_BARRIER_V1" as const,
    maxS, externalPrimes: primes, generators, rank: primes.length,
    blindClassNumerator: "1", blindClassDenominator: (BigInt(1) << BigInt(primes.length)).toString(),
    scope: "Character-blind reduced residue classes conditional on p=1 mod840 and coprimality with the menu; not all misses, finite-prime frequency or universal failure" });
}

/** A character threshold, deliberately NOT a witness-existence threshold. */
export function firstCharacterDivisor(p: number, maxS: number) {
  if (!Number.isSafeInteger(p) || p < 841 || p > 200000000 || p % 840 !== 1 || !isPrimeInSurvey(p) ||
    !Number.isSafeInteger(maxS) || maxS < 3 || maxS > 4095) throw new RangeError("Require residual prime and bounded s interval");
  let firstS: number | null = null, negativeCount = 0;
  for (let s = 3; s <= maxS; s += 4) if (jacobiSymbol(p, s) === -1) { firstS ??= s; negativeCount++; }
  const nrPrimes = Array.from({ length: Math.max(0, maxS - 2) }, (_, i) => i + 3)
    .filter((q) => q % 2 === 1 && isPrimeInSurvey(q) && jacobiSymbol(p, q) === -1);
  const q3 = nrPrimes.find((q) => q % 4 === 3) ?? null;
  const q1 = nrPrimes.find((q) => q % 4 === 1 && 3 * q <= maxS) ?? null;
  const formula = Math.min(q3 ?? Infinity, q1 === null ? Infinity : 3 * q1);
  if (firstS !== (Number.isFinite(formula) ? formula : null)) throw new Error("Least character divisor formula failed");
  return seal({ method: "ERDOS_STRAUS_LEAST_CHARACTER_DIVISOR_V1" as const,
    p, maxS, firstS, q3, q1, negativeCount,
    scope: "Necessary character condition only; no positive identity, optimum denominator, or root theorem" });
}

/** Lossless character pruning inside the same declared normalized family. */
export function searchCharacterFiltered(p: number, maxS: number) {
  const threshold = firstCharacterDivisor(p, maxS); // Domain check precedes any search.
  let checkedS = 0, skippedS = 0;
  for (let s = 3; s <= maxS; s += 4) {
    if (jacobiSymbol(p, s) !== -1) { skippedS++; continue; }
    checkedS++;
    const atlas = divisorCharacterAtlas(s);
    if (!atlas.usableResidues.includes(p % s)) continue;
    for (const { a, u } of [...atlas.pairs].sort((x, y) => x.a - y.a || x.u - y.u)) {
      if ((a * p + u) % s) continue;
      const v = (a * p + u) / s, k = atlas.m / (a * u), shift = (u + v) / a;
      if (!Number.isSafeInteger(shift) || shift % 4 !== 3) throw new Error("Normalized construction invariant failed");
      const denoms = [BigInt(u) * BigInt(v) * BigInt(k), BigInt(a) * BigInt(p) * BigInt(u) * BigInt(k),
        BigInt(a) * BigInt(p) * BigInt(v) * BigInt(k)].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
      const witness = { n: String(p), x: String(denoms[0]), y: String(denoms[1]), z: String(denoms[2]) };
      const strict = verifyErdos242StrictWitness(witness);
      if (!strict.valid) continue;
      if (denoms.filter((d) => d % BigInt(p) === BigInt(0)).length !== 2) throw new Error("Type II invariant failed");
      return seal({ method: "ERDOS_STRAUS_CHARACTER_FILTERED_V1" as const, p, maxS, checkedS, skippedS,
        firstCharacterS: threshold.firstS, status: "WITNESS" as const, firstS: s,
        construction: { a, u, s, v, k, shift }, witness, strictDigest: strict.benchmarkDigest });
    }
  }
  return seal({ method: "ERDOS_STRAUS_CHARACTER_FILTERED_V1" as const, p, maxS, checkedS, skippedS,
    firstCharacterS: threshold.firstS, status: "NOT_FOUND_IN_S_INTERVAL" as const, firstS: null,
    construction: null, witness: null, strictDigest: null });
}
