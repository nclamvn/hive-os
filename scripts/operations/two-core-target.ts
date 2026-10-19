import { createHash } from "node:crypto";
import { isPrimeInSurvey, verifyErdos242StrictWitness } from "../../src/modules/research-sandbox/math-certificates";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
export const TWO_CORE_TARGETS = [131433121, 159727681, 351121, 171348241] as const;
export const TWO_CORE_TARGET_SCOPE = "Normalized m=2^a*ell with odd prime ell of exponent ONE only; exact set and tail are written theorems, not formal/novelty or root certificates. Finite target audit covers ONLY a=1..4 with no s ceiling; larger a remain uncomputed. Read-only diagnostic, not agent-cycle evidence.";

function prime(n: number) {
  if (!Number.isSafeInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let q = 3; q * q <= n; q += 2) if (n % q === 0) return false;
  return true;
}
function inverse(n: number, s: number) {
  let r = n, old = s, t = 1, previous = 0;
  while (r) {
    const q = Math.floor(old / r);
    [old, r] = [r, old - q * r];
    [previous, t] = [t, previous - q * t];
  }
  if (old !== 1) throw new Error("Nonunit core generator");
  return (previous % s + s) % s;
}
function power(n: number, e: number, s: number) {
  let r = 1;
  for (let j = 0; j < e; j++) r = r * n % s;
  return r;
}
function pairs(a: number, ell: number) {
  const out = [];
  for (let f = -a; f <= a; f++) for (let g = -1; g <= 1; g++) out.push({
    a: 2 ** Math.max(-f, 0) * ell ** Math.max(-g, 0),
    u: 2 ** Math.max(f, 0) * ell ** Math.max(g, 0),
  });
  return out.sort((x, y) => x.a - y.a || x.u - y.u);
}

/** This separate finite atlas does not change any historical application cap. */
export function twoCoreTargetAtlas(a: number, ell: number) {
  if (!Number.isSafeInteger(a) || a < 1 || a > 8 || !Number.isSafeInteger(ell) ||
    ell < 3 || ell > 997 || ell % 2 === 0 || !prime(ell)) throw new RangeError("Require a=1..8 and odd prime ell<=997");
  const m = 2 ** a * ell, s = 4 * m - 1;
  const residues = [...new Set(pairs(a, ell).map((p) => (s - p.u * inverse(p.a, s) % s) % s))].sort((x, y) => x - y);
  const interval = [...new Set(Array.from({ length: 4 * a + 5 }, (_, j) => {
    const t = j - 2 * a - 2;
    return (s - power(t >= 0 ? 2 : inverse(2, s), Math.abs(t), s)) % s;
  }))].sort((x, y) => x - y);
  if (JSON.stringify(residues) !== JSON.stringify(interval) || residues[0] < 3 * 2 ** a - 1) throw new Error("Two-core set/cutoff invariant failed");
  return [a, ell, m, s, residues.length, residues[0], hash(residues)] as const;
}

// Trial division exhausts the fixed criterion integers (largest <176 billion).
// No arbitrary target/exponent or external factorization is accepted.
function divisors(value: number) {
  if (!Number.isSafeInteger(value) || value < 1 || value > 176_000_000_000) throw new RangeError("Fixed factorization domain exceeded");
  let n = value, values = [1];
  for (let q = 2; q * q <= n; q += q === 2 ? 1 : 2) if (n % q === 0) {
    let e = 0;
    while (n % q === 0) { n /= q; e++; }
    values = values.flatMap((v) => Array.from({ length: e + 1 }, (_, j) => v * q ** j));
  }
  if (n > 1) values = values.flatMap((v) => [v, v * n]);
  return values;
}

export function twoCoreTargetAudit(p: number) {
  if (!TWO_CORE_TARGETS.some((n) => n === p) || !isPrimeInSurvey(p)) throw new RangeError("Fixed four residual-prime controls only");
  const manifest: Array<[number, Array<[number, number]>]> = [], witnesses = [];
  for (let a = 1; a <= 4; a++) {
    const C = 2 ** (a + 2), candidates = new Map<number, number>();
    for (let j = 0; j <= 2 * a + 2; j++) for (const value of [p + 2 ** j, 2 ** j * p + 1]) {
      for (const s of divisors(value)) {
        if ((s + 1) % C) continue;
        const ell = (s + 1) / C;
        if (ell >= 3 && ell % 2 && prime(ell)) candidates.set(s, ell);
      }
    }
    const hits = [...candidates].sort((x, y) => x[0] - y[0]);
    manifest.push([a, hits]);
    for (const [s, ell] of hits) {
      const n = BigInt(p), S = BigInt(s), m = BigInt(2 ** a * ell);
      const pair = pairs(a, ell).find(({ a: A, u: U }) => (BigInt(A) * n + BigInt(U)) % S === BigInt(0));
      if (!pair) throw new Error("Divisor criterion lacks normalized pair");
      const A = BigInt(pair.a), U = BigInt(pair.u), V = (A * n + U) / S, K = m / (A * U);
      if (m % (A * U) !== BigInt(0)) throw new Error("Nonintegral modulator");
      const ds = [U * V * K, A * n * U * K, A * n * V * K].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
      const witness = { n: String(p), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
      const strict = verifyErdos242StrictWitness(witness);
      if (!strict.valid || ds.filter((d) => d % n === BigInt(0)).length !== 2) throw new Error("Strict Type II witness failed");
      witnesses.push({ exponent: a, ell, construction: { a: pair.a, u: pair.u, s, v: String(V), k: String(K) }, witness, strictDigest: strict.benchmarkDigest });
    }
  }
  return { p, auditedExponents: [1, 2, 3, 4], sCeiling: null, manifest, manifestDigest: hash(manifest), witnesses };
}

export function twoCoreTargetPacket() {
  const rows = [];
  for (let a = 1; a <= 8; a++) for (let ell = 3; ell <= 997; ell += 2) if (prime(ell)) rows.push(twoCoreTargetAtlas(a, ell));
  return { method: "ERDOS_STRAUS_TWO_CORE_TARGET_PACKET_V1" as const,
    finiteAtlas: { minA: 1, maxA: 8, maxOddPrime: 997, rowCount: rows.length, rowsDigest: hash(rows) },
    targetAudits: TWO_CORE_TARGETS.map(twoCoreTargetAudit), scope: TWO_CORE_TARGET_SCOPE };
}
