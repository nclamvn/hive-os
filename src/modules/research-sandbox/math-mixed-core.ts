import { createHash } from "node:crypto";
import { isPrimeInSurvey, verifyErdos242StrictWitness } from "./math-certificates";
import { auditAllPrimePowerCoreEligibility } from "./math-divisor-occupancy";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
const seal = <T extends object>(body: T) => ({ ...body, digest: hash(body) });

function factor(n: number) {
  const core: Array<{ prime: number; exponent: number }> = [];
  for (let q = 2; q * q <= n; q++) {
    let exponent = 0;
    while (n % q === 0) { n /= q; exponent++; }
    if (exponent) core.push({ prime: q, exponent });
  }
  if (n > 1) core.push({ prime: n, exponent: 1 });
  return core;
}

function signedPairs(core: ReturnType<typeof factor>) {
  let pairs = [{ a: 1, u: 1 }];
  for (const { prime, exponent } of core) pairs = pairs.flatMap(({ a, u }) =>
    Array.from({ length: 2 * exponent + 1 }, (_, i) => {
      const f = i - exponent;
      return { a: a * prime ** Math.max(-f, 0), u: u * prime ** Math.max(f, 0) };
    }));
  return pairs.sort((x, y) => x.a - y.a || x.u - y.u);
}

function inverse(a: number, s: number) {
  let r = a, oldR = s, t = 1, oldT = 0;
  while (r) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldT, t] = [t, oldT - q * t];
  }
  if (oldR !== 1) throw new Error("Nonunit normalized factor");
  return (oldT % s + s) % s;
}

/** Separate bounded diagnostic; does NOT widen any historical atlas's 4095 cap. */
export function mixedCoreCollisionAtlas(m: number) {
  if (!Number.isSafeInteger(m) || m < 1 || m > 4096) throw new RangeError("Require m within 1..4096");
  const s = 4 * m - 1, core = factor(m), pairs = signedPairs(core);
  const residues = [...new Set(pairs.map(({ a, u }) => (s - u * inverse(a, s) % s) % s))].sort((a, b) => a - b);
  const a = core.find((f) => f.prime === 2)?.exponent ?? 0;
  const knownEdges = a >= 2 ? (a - 1) * core.filter((f) => f.prime !== 2).reduce((v, f) => v * (f.exponent + 1), 1) : 0;
  const knownRelationBound = pairs.length - knownEdges;
  if (residues.length > knownRelationBound) throw new Error("Known collision upper bound violated");
  return seal({ method: "ERDOS_STRAUS_MIXED_COLLISION_V1" as const, m, s, core,
    pairCount: pairs.length, knownEdges, knownRelationBound, residueCount: residues.length,
    extraCollisions: knownRelationBound - residues.length, residuesDigest: hash(residues),
    scope: "Exact bounded modular class count; the known-relation formula is an UPPER bound, not an equality or witness lower bound" });
}

/** Two distinct prime factors of m only; a miss says nothing about larger s. */
export function searchTwoCoreDivisor(p: number, maxS: number) {
  if (!Number.isSafeInteger(p) || p < 841 || p > 200000000 || p % 840 !== 1 || !isPrimeInSurvey(p) ||
    !Number.isSafeInteger(maxS) || maxS < 3 || maxS > 4095) throw new RangeError("Require residual prime and maxS within 3..4095");
  let coresChecked = 0;
  for (let s = 3; s <= maxS; s += 4) {
    const m = (s + 1) / 4, core = factor(m);
    if (core.length !== 2) continue;
    coresChecked++;
    for (const { a, u } of signedPairs(core)) {
      if ((BigInt(a) * BigInt(p) + BigInt(u)) % BigInt(s)) continue;
      const v = (a * p + u) / s, k = m / (a * u);
      const n = BigInt(p), A = BigInt(a), U = BigInt(u), V = BigInt(v), K = BigInt(k);
      const ds = [U * V * K, A * n * U * K, A * n * V * K].sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
      const witness = { n: String(p), x: String(ds[0]), y: String(ds[1]), z: String(ds[2]) };
      const strict = verifyErdos242StrictWitness(witness);
      if (!strict.valid || ds.filter((d) => d % n === BigInt(0)).length !== 2) throw new Error("Two-core strict identity failed");
      return seal({ method: "ERDOS_STRAUS_TWO_CORE_SEARCH_V1" as const, p, maxS, coresChecked,
        status: "WITNESS" as const, firstS: s, core, construction: { a, u, s, v, k }, witness, strictDigest: strict.benchmarkDigest });
    }
  }
  return seal({ method: "ERDOS_STRAUS_TWO_CORE_SEARCH_V1" as const, p, maxS, coresChecked,
    status: "NOT_FOUND_IN_TWO_CORE_S_INTERVAL" as const, firstS: null, core: null, construction: null, witness: null, strictDigest: null });
}

export function minimumCoreSupportCertificate(p: number, maxS: number) {
  const two = searchTwoCoreDivisor(p, maxS), single = auditAllPrimePowerCoreEligibility(p);
  // m=1 gives s=3 and R={2}, incompatible with p=1 mod840. This excludes support zero.
  const minimumSupport = single.hits.length ? 1 : two.witness ? 2 : null;
  return seal({ method: "ERDOS_STRAUS_MINIMUM_CORE_SUPPORT_V1" as const, p, maxS,
    minimumSupport, status: minimumSupport === null ? "UNRESOLVED" as const : "EXACT_FOR_THIS_NORMALIZED_FAMILY" as const,
    singleCore: { candidatesChecked: single.candidatesChecked, tailFromS: single.tailFromS,
      hitS: single.hits.map((h) => h.s), rowsDigest: hash(single.rows) },
    twoCore: two,
    scope: "Minimum distinct primes dividing m across ALL s in this normalized family only; finite positive witness plus complete single-core exclusion; not minimum denominator, all Type I/II, root theorem, novelty or formal certification" });
}

export function mixedCoreResearchPacket() {
  const certificates = [131433121, 159727681, 351121, 171348241].map((p) => minimumCoreSupportCertificate(p, 4095));
  const collisionRows = Array.from({ length: 1024 }, (_, i) => {
    const a = mixedCoreCollisionAtlas(i + 1);
    return [a.m, a.pairCount, a.knownEdges, a.knownRelationBound, a.residueCount, a.residuesDigest];
  });
  const pell = mixedCoreCollisionAtlas(1224);
  // (72-2*17)^2-5*17^2=-1; reversed coprime pairs yield the same ratio class.
  const X = 72, Y = 17, r1 = (pell.s - Y * inverse(X, pell.s) % pell.s) % pell.s,
    r2 = (pell.s - X * inverse(Y, pell.s) % pell.s) % pell.s;
  if ((X - 2 * Y) ** 2 - 5 * Y ** 2 !== -1 || r1 !== r2 || pell.extraCollisions < 1) throw new Error("Pell collision replay failed");
  return seal({ method: "ERDOS_STRAUS_MIXED_CORE_PACKET_V1" as const, certificates,
    finiteCollisionAudit: { maxM: 1024, rows: collisionRows.length,
      extraCollisionRows: collisionRows.filter((r) => r[3] !== r[4]).length, rowsDigest: hash(collisionRows) },
    pellCounterexample: { X, Y, residue: r1, atlas: pell },
    scope: "Read-only structural diagnostics, no agent-ledger write, no root-coverage or novelty promotion" });
}

export function mixedCoreReplayProjection(packet: ReturnType<typeof mixedCoreResearchPacket>) {
  return { method: packet.method, certificates: packet.certificates.map((c) => ({ p: c.p,
    maxS: c.maxS, minimumSupport: c.minimumSupport, status: c.status, singleCore: c.singleCore,
    twoCore: { p: c.twoCore.p, maxS: c.twoCore.maxS, coresChecked: c.twoCore.coresChecked,
      status: c.twoCore.status, firstS: c.twoCore.firstS, core: c.twoCore.core,
      construction: c.twoCore.construction, witness: c.twoCore.witness, strictDigest: c.twoCore.strictDigest } })),
  finiteCollisionAudit: packet.finiteCollisionAudit,
  pellCounterexample: { X: packet.pellCounterexample.X, Y: packet.pellCounterexample.Y,
    residue: packet.pellCounterexample.residue,
    atlas: { m: packet.pellCounterexample.atlas.m, s: packet.pellCounterexample.atlas.s,
      core: packet.pellCounterexample.atlas.core, pairCount: packet.pellCounterexample.atlas.pairCount,
      knownEdges: packet.pellCounterexample.atlas.knownEdges, knownRelationBound: packet.pellCounterexample.atlas.knownRelationBound,
      residueCount: packet.pellCounterexample.atlas.residueCount, extraCollisions: packet.pellCounterexample.atlas.extraCollisions,
      residuesDigest: packet.pellCounterexample.atlas.residuesDigest } } };
}
