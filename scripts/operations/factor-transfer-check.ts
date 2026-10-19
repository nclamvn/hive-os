import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { canonicalJson } from "../../src/modules/execution-fabric/contracts";

export const FACTOR_TRANSFER_INPUTS = { seeds: [["200023321", "31"], ["200023321", "71"], ["200023321", "79"],
  ["200602081", "23"], ["200602081", "43"], ["200602081", "67"], ["200602081", "83"],
  ["200656681", "43"], ["200656681", "71"], ["200656681", "103"], ["131433121", "11"], ["131433121", "19"], ["131433121", "31"]]
  .map(([p, h]) => ({ p, h })), maxDepth: "2", seedContentDigest: "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c" };
export const FACTOR_TRANSFER_LIMITS = { seconds: 60, maxNodes: 256, maxRecords: 1000, maxStateInsertions: 2000000, maxWorkSteps: 50000000, maxOutputBytes: 2097152 };
export const FACTOR_TRANSFER_SCOPE = "Thirteen selected exposed negative-character miss seeds; all QNR factors, canonical first-discovery BFS through depth2. Exact finite node images, transfers, blockers, revisits, frontier and progress refutations are development evidence, not an unbounded termination proof, held-out benchmark, root solution or novelty certificate. No agent-cycle authority.";
export const factorTransferHash = (v: unknown) => createHash("sha256").update(canonicalJson(v)).digest("hex");
const dec = z.string().regex(/^(0|[1-9][0-9]{0,29})$/), pos = z.string().regex(/^[1-9][0-9]{0,29}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const id = z.string().regex(/^[1-9][0-9]{0,8}:[1-9][0-9]{0,8}$/), rid = z.string().regex(/^r(0|[1-9][0-9]{0,3})$/);
const qnr = z.object({ q: pos, exponent: pos, residue: pos, legendre: z.literal("-1"), eligible: z.boolean(), blocker: z.literal("NONINTEGRAL_SHIFT").nullable() }).strict();
const defect = z.object({ stabilizer: z.array(pos).min(1).max(2000000), size: pos, index: pos, visibleMass: dec, nonresidue: z.boolean(),
  visibleFactors: z.array(z.object({ prime: pos, exponent: pos, residue: pos, quotientOrder: pos }).strict()).max(20),
  conditions: z.object({ indexEven: z.boolean(), indexTwoModFour: z.boolean(), nonresidueIndexAtLeastSix: z.boolean(), visibleMassBound: z.boolean(), ordersBeyondIntervals: z.boolean() }).strict() }).strict();
const canonical = z.object({ u: pos, v: pos, k: pos, A: pos, x: pos, y: pos, z: pos }).strict();
const node = z.object({ id, depth: dec, p: pos, h: pos, T: pos, factors: z.array(z.tuple([pos, pos])).max(20), image: z.array(pos).min(1).max(2000000),
  count: pos, hit: z.boolean(), canonical: canonical.nullable(), character: z.object({ legendre: z.enum(["-1", "+1"]), preferred: z.boolean() }).strict(),
  defect: defect.nullable(), qnrFactors: z.array(qnr).max(20), imageDigest: hash, witnessDigest: hash.nullable(), defectDigest: hash.nullable(), nodeDigest: hash }).strict();
const edge = z.object({ id: rid, kind: z.literal("EDGE"), from: id, to: id, q: pos, exponent: pos, requestedDepth: pos,
  disposition: z.enum(["DISCOVERED", "REVISIT", "DEPTH_LIMIT"]), targetComputed: z.boolean(), toDepth: dec.nullable(), recordDigest: hash }).strict();
const blocker = z.object({ id: rid, kind: z.literal("BLOCKER"), from: id, q: pos, exponent: pos, residue: pos, reason: z.literal("NONINTEGRAL_SHIFT"), recordDigest: hash }).strict();
const refutation = z.object({ recordId: rid, from: id, to: id, parentNodeDigest: hash, childNodeDigest: hash }).strict();
const progress = z.object({ status: z.enum(["REFUTED", "NO_REFUTATION_IN_COMPUTED_EDGES"]), firstRefutation: refutation.nullable() }).strict();
export const factorTransferPacketSchema = z.object({ method: z.literal("ERDOS_STRAUS_FACTOR_DIRECTED_TRANSFER_V1"), status: z.enum(["COMPLETE", "PARTIAL"]), inputs: z.unknown(),
  limits: z.object({ seconds: z.number().positive().max(60), maxNodes: z.number().int().positive().max(256), maxRecords: z.number().int().positive().max(1000),
    maxStateInsertions: z.number().int().positive().max(2000000), maxWorkSteps: z.number().int().positive().max(50000000), maxOutputBytes: z.number().int().min(4096).max(2097152) }).strict(),
  nodes: z.array(node).max(256), records: z.array(z.discriminatedUnion("kind", [edge, blocker])).max(1000),
  frontier: z.array(z.object({ recordId: rid, from: id, to: id, reason: z.literal("DEPTH_LIMIT") }).strict()).max(1000),
  reachability: z.array(z.object({ seed: id, complete: z.boolean(), reachableHitIds: z.array(id).max(256), firstHitPath: z.array(id).max(3).nullable(),
    frontierRecordIds: z.array(rid).max(1000), status: z.enum(["HIT_REACHABLE", "NO_HIT_IN_COMPUTED_GRAPH"]) }).strict()).length(13),
  cycles: z.array(z.object({ nodeIds: z.array(id).min(2).max(257), recordIds: z.array(rid).min(1).max(256), cycleDigest: hash }).strict()).max(1000),
  progress: z.object({ C1: progress, C2: progress, C3: progress }).strict(), graphDigest: hash, contentDigest: hash,
  pending: z.object({ phase: z.enum(["NODE", "FACTOR", "FINALIZE"]), id: id.optional(), q: pos.optional() }).strict().nullable(),
  reason: z.enum(["TIME_LIMIT", "NODE_LIMIT", "RECORD_LIMIT", "STATE_LIMIT", "WORK_LIMIT", "OUTPUT_LIMIT", "REPLAY_TIME_LIMIT", "REPLAY_PAIR_LIMIT", "MODULAR_LIMIT"]).nullable(),
  scope: z.literal(FACTOR_TRANSFER_SCOPE), runtime: z.union([
    z.object({ stateInsertions: dec, workSteps: dec, elapsedMs: dec, outputBytes: dec }).strict(),
    z.object({ pairChecks: dec, workSteps: dec, elapsedMs: dec, outputBytes: dec }).strict(),
  ]), packetDigest: hash }).strict();
export type FactorTransferPacket = z.infer<typeof factorTransferPacketSchema>;
type Node = FactorTransferPacket["nodes"][number]; type Record = FactorTransferPacket["records"][number];
type Pending = NonNullable<FactorTransferPacket["pending"]>;
const B = BigInt, one = B(1), zero = B(0);
function gcd(a: bigint, b: bigint): bigint { while (b) [a, b] = [b, a % b]; return a; }
function prime(n: number) { if (!Number.isSafeInteger(n) || n < 2 || n > 201000000) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
export function factorTransferPow(r: number, e: number, h: number, tick: () => void = () => {}) {
  let value = one, base = B(r), exp = B(e); const modulus = B(h);
  while (exp > zero) { tick(); if (exp % B(2)) value = value * base % modulus; base = base * base % modulus; exp /= B(2); }
  return Number(value);
}
function factors(n: number) { const result: number[] = []; for (let d = 2; d * d <= n; d++) if (n % d === 0) {
  result.push(d); while (n % d === 0) n /= d; } if (n > 1) result.push(n); return result; }
function missDefect(n: Node, tick: () => void) {
  const h = Number(n.h), values = n.image.map(Number), S = new Set(values), H: number[] = [];
  for (const r of values) if (values.every(s => { tick(); return S.has(Number(B(r) * B(s) % B(h))); })) H.push(r);
  const index = (h - 1) / H.length, divisors = factors(h - 1), visibleFactors = n.factors.filter(([q]) => !H.includes(Number(q) % h)).map(([prime, exponent]) => {
    const residue = Number(prime) % h; let order = h - 1;
    for (const d of divisors) while (order % d === 0 && H.includes(factorTransferPow(residue, order / d, h, tick))) order /= d;
    return { prime, exponent, residue: String(residue), quotientOrder: String(order) };
  });
  const V = visibleFactors.reduce((s, f) => s + Number(f.exponent), 0), nr = n.factors.some(([q]) => factorTransferPow(Number(q) % h, (h - 1) / 2, h, tick) === h - 1);
  return { stabilizer: H.map(String), size: String(H.length), index: String(index), visibleMass: String(V), nonresidue: nr, visibleFactors,
    conditions: { indexEven: index % 2 === 0, indexTwoModFour: index % 4 === 2, nonresidueIndexAtLeastSix: !nr || index >= 6,
      visibleMassBound: 2 * V <= index - 2, ordersBeyondIntervals: visibleFactors.every(f => Number(f.quotientOrder) > 2 * Number(f.exponent) + 1) } };
}

/** Reconstruct bounded graph summaries from actual computed nodes/records, with distance never reset at another seed. */
export function factorTransferGraphSummary(nodes: Node[], records: Record[], complete: boolean) {
  const lookup = new Map(nodes.map(n => [n.id, n])), adjacency = new Map(nodes.map(n => [n.id, records.filter((r): r is Extract<Record, { kind: "EDGE" }> => r.kind === "EDGE" && r.from === n.id && r.targetComputed)]));
  const frontier = records.filter((r): r is Extract<Record, { kind: "EDGE" }> => r.kind === "EDGE" && r.disposition === "DEPTH_LIMIT")
    .map(r => ({ recordId: r.id, from: r.from, to: r.to, reason: "DEPTH_LIMIT" as const }));
  const reachability = FACTOR_TRANSFER_INPUTS.seeds.map(({ p, h }) => {
    const seed = `${p}:${h}`, seen = new Set([seed]), queue = lookup.has(seed) ? [{ id: seed, path: [seed] }] : [];
    const hits: string[] = []; let first: string[] | null = null;
    for (const current of queue) {
      if (lookup.get(current.id)!.hit) { hits.push(current.id); first ??= current.path; }
      if (current.path.length >= 3) continue;
      for (const r of adjacency.get(current.id) ?? []) if (!seen.has(r.to)) { seen.add(r.to); queue.push({ id: r.to, path: [...current.path, r.to] }); }
    }
    return { seed, complete, reachableHitIds: hits, firstHitPath: first, frontierRecordIds: frontier.filter(r => seen.has(r.from)).map(r => r.recordId),
      status: hits.length ? "HIT_REACHABLE" as const : "NO_HIT_IN_COMPUTED_GRAPH" as const };
  });
  const colors = new Map<string, number>(), path: string[] = [], edgePath: string[] = [], cycles: FactorTransferPacket["cycles"] = [];
  function visit(id: string) { colors.set(id, 1); path.push(id);
    for (const r of adjacency.get(id) ?? []) {
      if (colors.get(r.to) === 1) { const index = path.indexOf(r.to), cycle = { nodeIds: [...path.slice(index), r.to], recordIds: [...edgePath.slice(index), r.id] };
        cycles.push({ ...cycle, cycleDigest: factorTransferHash(cycle) });
      } else if (!colors.get(r.to)) { edgePath.push(r.id); visit(r.to); edgePath.pop(); }
    } path.pop(); colors.set(id, 2);
  }
  for (const n of nodes) if (!colors.get(n.id)) visit(n.id);
  const fresh = () => ({ status: "NO_REFUTATION_IN_COMPUTED_EDGES" as "REFUTED" | "NO_REFUTATION_IN_COMPUTED_EDGES", firstRefutation: null as FactorTransferPacket["progress"]["C1"]["firstRefutation"] });
  const progress = { C1: fresh(), C2: fresh(), C3: fresh() };
  for (const r of records) if (r.kind === "EDGE" && r.targetComputed) {
    const parent = lookup.get(r.from)!, child = lookup.get(r.to)!; if (child.hit) continue;
    const failed = { C1: true, C2: Number(child.defect!.visibleMass) <= Number(parent.defect!.visibleMass), C3: Number(child.defect!.size) > 1 };
    for (const c of ["C1", "C2", "C3"] as const) if (failed[c] && progress[c].firstRefutation === null) progress[c] = { status: "REFUTED",
      firstRefutation: { recordId: r.id, from: r.from, to: r.to, parentNodeDigest: parent.nodeDigest, childNodeDigest: child.nodeDigest } };
  }
  return { frontier, reachability, cycles, progress };
}

/** Atomic traversal-prefix validator: neither queued descriptors nor frontiers count as computed certificates. */
function graphPrefix(p: FactorTransferPacket) {
  const queue = FACTOR_TRANSFER_INPUTS.seeds.map(s => ({ id: `${s.p}:${s.h}`, depth: "0" })), known = new Map(queue.map(n => [n.id, n.depth])), lookup = new Map(p.nodes.map(n => [n.id, n]));
  let ri = 0; let pending: Pending = { phase: "FINALIZE" };
  for (let i = 0; i < queue.length; i++) {
    const descriptor = queue[i], n = p.nodes[i];
    if (!n) { pending = { phase: "NODE", id: descriptor.id }; return { pending, done: false, consumedNodes: i, consumedRecords: ri }; }
    if (n.id !== descriptor.id || n.depth !== descriptor.depth) return null;
    for (const f of n.hit ? [] : n.qnrFactors) {
      const got = p.records[ri];
      if (!got) return { pending: { phase: "FACTOR", id: n.id, q: f.q } as Pending, done: false, consumedNodes: i + 1, consumedRecords: ri };
      const base = { id: `r${ri}`, from: n.id, q: f.q, exponent: f.exponent };
      let wanted: object;
      if (!f.eligible) wanted = { ...base, kind: "BLOCKER", residue: f.residue, reason: "NONINTEGRAL_SHIFT" };
      else {
        const childId = `${n.p}:${f.q}`, depth = String(Number(n.depth) + 1);
        const disposition = known.has(childId) ? "REVISIT" : n.depth === "2" ? "DEPTH_LIMIT" : "DISCOVERED";
        if (disposition === "DISCOVERED") { known.set(childId, depth); queue.push({ id: childId, depth }); }
        const child = lookup.get(childId);
        wanted = { ...base, kind: "EDGE", to: childId, requestedDepth: depth, disposition, targetComputed: Boolean(child), toDepth: child?.depth ?? null };
      }
      const { recordDigest, ...body } = got;
      if (recordDigest !== factorTransferHash(body) || !isDeepStrictEqual(wanted, body)) return null;
      ri++;
    }
  }
  return { pending, done: true, consumedNodes: queue.length, consumedRecords: ri };
}

/** Scoped exact identities/certificates, graph and hash validation; fresh replay establishes full images/canonical minima. */
export function verifyFactorTransferPacket(raw: unknown): raw is FactorTransferPacket {
  try {
    const parsed = factorTransferPacketSchema.safeParse(raw); if (!parsed.success) return false; const p = parsed.data;
    if (!isDeepStrictEqual(p.inputs, FACTOR_TRANSFER_INPUTS) || p.status === "COMPLETE" && !isDeepStrictEqual(p.limits, FACTOR_TRANSFER_LIMITS)) return false;
    const { packetDigest, ...body } = p;
    if (packetDigest !== factorTransferHash(body) || Number(p.runtime.outputBytes) !== Buffer.byteLength(canonicalJson(p)) || Number(p.runtime.outputBytes) > p.limits.maxOutputBytes ||
      p.nodes.length > p.limits.maxNodes || p.records.length > p.limits.maxRecords || Number(p.runtime.workSteps) > p.limits.maxWorkSteps ||
      "pairChecks" in p.runtime && Number(p.runtime.pairChecks) > 50000000 || "stateInsertions" in p.runtime && Number(p.runtime.stateInsertions) > p.limits.maxStateInsertions ||
      p.status === "COMPLETE" && Number(p.runtime.elapsedMs) >= p.limits.seconds * 1000) return false;
    const prefix = graphPrefix(p); if (!prefix || prefix.consumedNodes !== p.nodes.length || prefix.consumedRecords !== p.records.length) return false;
    if (p.status === "COMPLETE" && (!prefix.done || p.pending !== null || p.reason !== null)) return false;
    if (p.status === "PARTIAL" && (!p.reason || !isDeepStrictEqual(p.pending, prefix.pending))) return false;
    let work = 0; const tick = () => { if (++work > 50000000) throw new Error("SCOPED_VALIDATION_WORK_LIMIT"); };
    for (let i = 0; i < p.nodes.length; i++) {
      const n = p.nodes[i], P = Number(n.p), h = Number(n.h), T = B(n.T);
      if (!prime(P) || !FACTOR_TRANSFER_INPUTS.seeds.some(s => s.p === n.p) || !prime(h) || h < 3 || h >= P || h % 4 !== 3 ||
        (P + h) % 4 || T !== B((P + h) / 4) || n.id !== `${n.p}:${n.h}` || Number(n.depth) > 2) return false;
      let product = one, last = 1;
      for (const [q, e] of n.factors) { if (!prime(Number(q)) || Number(q) <= last || Number(e) > 30) return false; product *= B(q) ** B(e); last = Number(q); }
      const chi = factorTransferPow(P % h, (h - 1) / 2, h, tick) === h - 1 ? "-1" : "+1";
      const qnrs = n.factors.filter(([q]) => factorTransferPow(Number(q) % h, (h - 1) / 2, h, tick) === h - 1).map(([q, exponent]) => ({ q, exponent,
        residue: String(Number(q) % h), legendre: "-1", eligible: Number(q) % 4 === 3, blocker: Number(q) % 4 === 3 ? null : "NONINTEGRAL_SHIFT" }));
      if (product !== T || chi !== "-1" || !isDeepStrictEqual(n.character, { legendre: chi, preferred: true }) || !isDeepStrictEqual(n.qnrFactors, qnrs) ||
        n.image[0] !== "1" || n.count !== String(n.image.length) || n.image.some((r, j) => Number(r) >= h || j > 0 && Number(r) <= Number(n.image[j - 1])) ||
        n.imageDigest !== factorTransferHash(n.image) || n.hit !== n.image.includes(String(h - 1)) || n.hit !== Boolean(n.canonical) || i < 13 && n.hit) return false;
      for (const f of qnrs) if (f.eligible && (B(f.q) > T || Number(f.q) === h || factorTransferPow(P % Number(f.q), (Number(f.q) - 1) / 2, Number(f.q), tick) !== Number(f.q) - 1)) return false;
      const { nodeDigest, ...nodeBody } = n; if (nodeDigest !== factorTransferHash(nodeBody)) return false;
      if (n.canonical) {
        const c = n.canonical, [u, v, k, A, x, y, z] = [c.u, c.v, c.k, c.A, c.x, c.y, c.z].map(B), primeP = B(P);
        const ds = [u * v * k, A * primeP * u * k, A * primeP * v * k].sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        if (u > v || gcd(u, v) !== one || u * v * k !== T || u + v !== B(h) * A || !(x < y && y < z) || !isDeepStrictEqual(ds, [x, y, z]) ||
          B(4) * x * y * z !== primeP * (x * y + x * z + y * z) || ds.filter(d => d % primeP === zero).length !== 2 ||
          n.witnessDigest !== factorTransferHash(c) || n.defect !== null || n.defectDigest !== null) return false;
      } else { const d = missDefect(n, tick); if (!isDeepStrictEqual(n.defect, d) || !Object.values(d.conditions).every(Boolean) || n.defectDigest !== factorTransferHash(d) || n.witnessDigest !== null) return false; }
    }
    const summary = factorTransferGraphSummary(p.nodes, p.records, p.status === "COMPLETE");
    if (!isDeepStrictEqual(summary, { frontier: p.frontier, reachability: p.reachability, cycles: p.cycles, progress: p.progress })) return false;
    const graph = { nodes: p.nodes, records: p.records, ...summary };
    return p.graphDigest === factorTransferHash(graph) && p.contentDigest === factorTransferHash({ inputs: p.inputs, ...graph, graphDigest: p.graphDigest });
  } catch { return false; }
}
export function compareFactorTransferReplay(primary: unknown, replay: unknown) {
  if (!verifyFactorTransferPacket(primary) || !verifyFactorTransferPacket(replay)) return "MISMATCH" as const;
  if (primary.status !== "COMPLETE" || replay.status !== "COMPLETE") return "PARTIAL" as const;
  return primary.contentDigest === replay.contentDigest && isDeepStrictEqual(primary.nodes, replay.nodes) && isDeepStrictEqual(primary.records, replay.records) &&
    isDeepStrictEqual(primary.frontier, replay.frontier) && isDeepStrictEqual(primary.reachability, replay.reachability) && isDeepStrictEqual(primary.cycles, replay.cycles) && isDeepStrictEqual(primary.progress, replay.progress)
    ? "PASS" as const : "MISMATCH" as const;
}
