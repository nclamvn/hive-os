/** Exact arithmetic for the written normalized-family bound, not a complete
 * search or a theorem/novelty certification. */
export function normalizedCoreFiniteBound(p: bigint) {
  if (p < BigInt(2)) throw new RangeError("Target must be at least two");
  const t0 = p / BigInt(4) + BigInt(1);
  const denominator = BigInt(4) * t0 - p;
  return { t0, denominator, maxCore: t0 * (t0 + BigInt(1)) / denominator };
}
