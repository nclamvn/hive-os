import { createHash } from "node:crypto";

// Separate research diagnostic. Historical app caps and pinned packets are unchanged.
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

function factor(m: number) {
  const core: Array<{ prime: number; exponent: number }> = [];
  for (let q = 2; q * q <= m; q++) {
    let exponent = 0;
    while (m % q === 0) { m /= q; exponent++; }
    if (exponent) core.push({ prime: q, exponent });
  }
  if (m > 1) core.push({ prime: m, exponent: 1 });
  return core;
}

function vectors(core: ReturnType<typeof factor>, scale: number) {
  let box: number[][] = [[]];
  for (const { exponent } of core) box = box.flatMap((f) =>
    Array.from({ length: 2 * scale * exponent + 1 }, (_, i) => [...f, i - scale * exponent]));
  return box;
}

function split(core: ReturnType<typeof factor>, h: number[]) {
  let A = BigInt(1), U = BigInt(1);
  core.forEach(({ prime }, i) => {
    if (h[i] > 0) A *= BigInt(prime) ** BigInt(h[i]);
    if (h[i] < 0) U *= BigInt(prime) ** BigInt(-h[i]);
  });
  return { A, U };
}

function inverse(a: bigint, s: bigint) {
  let r = a, oldR = s, t = BigInt(1), oldT = BigInt(0);
  while (r) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldT, t] = [t, oldT - q * t];
  }
  if (oldR !== BigInt(1)) throw new Error("Nonunit core");
  return (oldT % s + s) % s;
}

function prime(n: number) {
  for (let q = 2; q * q <= n; q++) if (n % q === 0) return false;
  return n >= 2;
}

/** Exact kernel, energy and occupancy. Not a target-hitting theorem. */
export function mixedCoreKernelAtlas(m: number) {
  if (!Number.isSafeInteger(m) || m < 1 || m > 1000000) throw new RangeError("Require m within 1..1000000");
  const s = 4 * m - 1, S = BigInt(s), core = factor(m), box = vectors(core, 1);
  const fibers = new Map<number, number>();
  for (const f of box) {
    const { A, U } = split(core, f);
    const residue = Number((S - A % S * inverse(U, S) % S) % S);
    fibers.set(residue, (fibers.get(residue) ?? 0) + 1);
  }
  const positiveKernel: Array<{ h: number[]; A: string; U: string; k: string; weight: number }> = [];
  for (const h of vectors(core, 2)) {
    const { A, U } = split(core, h);
    if (A <= U || (A - U) % S) continue;
    const weight = core.reduce((w, { exponent }, i) => w * (2 * exponent + 1 - Math.abs(h[i])), 1);
    positiveKernel.push({ h, A: String(A), U: String(U), k: String((A - U) / S), weight });
  }
  positiveKernel.sort((a, b) => Number(BigInt(a.A) - BigInt(b.A)) || Number(BigInt(a.U) - BigInt(b.U)));
  const collisionPairs = positiveKernel.reduce((n, h) => n + h.weight, 0);
  const P = box.length, energy = P + 2 * collisionPairs;
  const directEnergy = [...fibers.values()].reduce((n, size) => n + size * size, 0);
  if (!Number.isSafeInteger(energy) || energy !== directEnergy) throw new Error("Kernel/fiber energy mismatch");
  const a = core.find((q) => q.prime === 2)?.exponent ?? 0;
  const knownEdges = a >= 2 ? (a - 1) * core.filter((q) => q.prime !== 2).reduce((w, q) => w * (q.exponent + 1), 1) : 0;
  const lowerBound = Math.max(1, P - collisionPairs, Math.ceil(P * P / energy));
  const upperBound = P - knownEdges, R = fibers.size;
  const maxFiber = Math.max(...fibers.values());
  if (R < lowerBound || R > upperBound || (maxFiber <= 2 && R !== P - collisionPairs)) throw new Error("Occupancy bound violated");
  return { m, s, sIsPrime: prime(s), core, pairCount: P, knownEdges, knownRelationBound: upperBound,
    positiveKernel, collisionPairs, energy, lowerBound, residueCount: R, maxFiber,
    extraCollisions: upperBound - R,
    residuesDigest: hash([...fibers.keys()].sort((a, b) => a - b)) };
}

export function mixedCoreKernelPacket() {
  return { method: "ERDOS_STRAUS_COLLISION_KERNEL_V1",
    rows: [1, 4, 36, 1224, 132840, 360696].map(mixedCoreKernelAtlas),
    polynomialFamily: Array.from({ length: 9 }, (_, i) => {
      const d = i + 1, D = BigInt(d), X = BigInt(8) * (BigInt(8) * D + BigInt(1)), Y = BigInt(16) * D + BigInt(1);
      const m = D * X * Y, s = BigInt(4) * m - BigInt(1), A = D * X * X, U = Y * Y;
      if (A - U !== s || m * m % (A * U)) throw new Error("Polynomial collision failed");
      const extraMatchingEdges = factor(d).reduce((n, f) => n * (f.exponent + 1), 1);
      return { d, X: String(X), Y: String(Y), m: String(m), s: String(s),
        A: String(A), U: String(U), extraMatchingEdges };
    }),
    scope: "Exact fixed-core collision/energy certificates only; no uniform target hitting, root proof, formal verification or novelty certification; not retained in an agent cycle" };
}
