import { z } from "zod";

import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

/** Known union bound (Allikvere Lemma4.3), not a novel lemma or global theorem gate. */
export const LRC_COVER_BOUND_LIMITS = Object.freeze({ nodes: 20000, work: 20000000, milliseconds: 10000,
  bytes: 16777216, cardinality: "96889010407" });
const method = z.literal("LRC_MODULAR_BOUND_TREE_V1");
const dependency = z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED");
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const identifier = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const digit = z.number().int().min(0).max(13);
const decimal = z.string().regex(/^(0|[1-9][0-9]{0,10})$/).refine((n) => BigInt(n) <= BigInt(LRC_COVER_BOUND_LIMITS.cardinality));
function prime(n: number): boolean { for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return n >= 17; }
export const lrcCoverScopeSchema = z.object({ version: z.literal(1), method, totalRunners: z.literal(14),
  prime: z.number().int().min(17).max(257), parentLevel: z.number().int().min(1).max(14), targetLevel: z.number().int().min(2).max(14),
  parentResidues: z.array(z.number().int().min(1).max(3597)).length(13),
  digitAxes: z.array(z.array(digit).min(1).max(7)).length(13), sourceDigest: hex, lowerDependency: dependency,
}).strict().superRefine((scope, ctx) => {
  if (!prime(scope.prime)) ctx.addIssue({ code: "custom", message: "Exact prime required" });
  const factor = scope.targetLevel / scope.parentLevel;
  if (!Number.isInteger(factor) || factor < 2) ctx.addIssue({ code: "custom", message: "Proper integral lift factor required" });
  if (scope.parentResidues.some((r) => r >= scope.parentLevel * scope.prime || r % scope.prime === 0)) ctx.addIssue({ code: "custom", message: "Nonzero-p parent residue domain" });
  if (scope.digitAxes.some((axis) => axis.some((d, i) => d >= factor || (i > 0 && d <= axis[i - 1])))) ctx.addIssue({ code: "custom", message: "Sorted distinct legal digit choices required" });
});
export type LrcCoverScope = z.infer<typeof lrcCoverScopeSchema>;
const base = { id: identifier, prefix: z.array(digit).max(13) };
const boundCount = z.number().int().min(0).max(1799);
export const lrcCoverNodeSchema = z.discriminatedUnion("kind", [
  z.object({ ...base, kind: z.literal("SPLIT"), children: z.array(identifier).min(1).max(7) }).strict(),
  z.object({ ...base, kind: z.literal("COVER_BOUND"), uncoveredCount: boundCount, maxBad: z.array(boundCount).max(13) }).strict(),
  z.object({ ...base, kind: z.literal("OMIT_GCD"), omittedIndex: z.number().int().min(0).max(12), divisor: z.number().int().min(2).max(14) }).strict(),
  z.object({ ...base, kind: z.literal("SURVIVOR") }).strict(),
  z.object({ ...base, kind: z.literal("UNRESOLVED"), reason: z.enum(["WORK_LIMIT", "TIME_LIMIT", "NODE_LIMIT", "OUTPUT_LIMIT"]) }).strict(),
]);
export type LrcCoverNode = z.infer<typeof lrcCoverNodeSchema>;
export const lrcCoverCertificateSchema = z.object({ version: z.literal(1), method, rootContractDigest: hex, scopeDigest: hex,
  rootNodeId: identifier, nodes: z.array(lrcCoverNodeSchema).min(1).max(20000), certificateDigest: hex }).strict();
export type LrcCoverCertificate = z.infer<typeof lrcCoverCertificateSchema>;
const leafCount = z.number().int().min(0).max(20000);
export const lrcCoverSummarySchema = z.object({ status: z.enum(["COMPLETE", "PARTIAL", "INVALID"]), scopeDigest: z.string(), certificateDigest: z.string(),
  totalTuples: decimal, classifiedTuples: decimal, witnessTuples: decimal, gcdTuples: decimal, survivorTuples: decimal, unresolvedTuples: decimal,
  nodeCount: leafCount, leafCount, coverLeaves: leafCount, gcdLeaves: leafCount, survivorLeaves: leafCount, unresolvedLeaves: leafCount,
  survivors: z.array(z.object({ digits: z.array(digit).length(13), residues: z.array(z.number().int().min(1).max(3597)).length(13) }).strict()).max(20000),
  lowerDependency: dependency, errors: z.array(z.string().max(128)).max(1),
}).strict();
export type LrcCoverSummary = z.infer<typeof lrcCoverSummarySchema>;
export function lrcCoverScopeDigest(scope: LrcCoverScope): string { return sha256(canonicalJson(lrcCoverScopeSchema.parse(scope))); }
export function lrcCoverCertificateDigest(certificate: Omit<LrcCoverCertificate, "certificateDigest"> | LrcCoverCertificate): string {
  const { certificateDigest: _digest, ...body } = certificate as LrcCoverCertificate; void _digest; return sha256(canonicalJson(body));
}
function cardinality(scope: LrcCoverScope, depth: number): bigint { return scope.digitAxes.slice(depth).reduce((n, axis) => n * BigInt(axis.length), BigInt(1)); }
function popcount(word: number): number {
  word -= (word >>> 1) & 0x55555555;
  word = (word & 0x33333333) + ((word >>> 2) & 0x33333333);
  return (((word + (word >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
}
function initialMask(size: number): Uint32Array {
  const mask = new Uint32Array(Math.ceil(size / 32)); mask.fill(0xffffffff);
  if (size % 32) mask[mask.length - 1] = 2 ** (size % 32) - 1;
  return mask;
}
type Reason = "WORK_LIMIT" | "TIME_LIMIT" | "NODE_LIMIT" | "OUTPUT_LIMIT";
const generationLimits = z.object({ maxNodes: z.number().int().min(1).max(20000), maxWork: z.number().int().min(0).max(20000000),
  timeoutMs: z.number().int().min(0).max(10000), maxBytes: z.number().int().min(1024).max(16777216) }).strict();
const verificationLimits = z.object({ maxWork: z.number().int().min(0).max(20000000), timeoutMs: z.number().int().min(0).max(10000) }).strict();

/** Symbolic producer: visits prefix regions, never their Cartesian tuples. */
export function buildLrcCoverCertificate(rawScope: LrcCoverScope, rootContractDigest: string,
  options: { maxNodes?: number; maxWork?: number; timeoutMs?: number; maxBytes?: number } = {}): LrcCoverCertificate {
  const started = performance.now();
  const limits = generationLimits.parse({ maxNodes: 20000, maxWork: 20000000, timeoutMs: 10000, maxBytes: 16777216, ...options });
  const scope = lrcCoverScopeSchema.parse(rawScope); hex.parse(rootContractDigest);
  const deadline = started + limits.timeoutMs; let work = 0, latched: Reason | null = null;
  function charge(cost = 1): boolean {
    if (latched) return false;
    if (performance.now() >= deadline) { latched = "TIME_LIMIT"; return false; }
    if (work + cost > limits.maxWork) { latched = "WORK_LIMIT"; return false; }
    work += cost; return true;
  }
  const M = scope.targetLevel * scope.prime, H = Math.floor(M / 2), parentM = scope.parentLevel * scope.prime;
  const masks = scope.digitAxes.map((axis, a) => axis.map((d) => {
    const mask = new Uint32Array(Math.ceil(H / 32));
    if (!charge()) return mask;
    const speed = (scope.parentResidues[a] + parentM * d) % M;
    for (let j = 1; j <= H; j++) {
      if (!charge()) break;
      const r = j * speed % M;
      if (14 * Math.min(r, M - r) >= M) mask[(j - 1) >>> 5] |= 1 << ((j - 1) & 31);
    }
    return mask;
  }));
  function size(mask: Uint32Array): number | null { let n = 0; for (const word of mask) { if (!charge()) return null; n += popcount(word); } return n; }
  function bound(prefix: number[], U: Uint32Array): { uncoveredCount: number; maxBad: number[] } | null {
    const uncoveredCount = size(U); if (uncoveredCount === null) return null;
    const maxBad: number[] = [];
    for (let a = prefix.length; a < 13; a++) {
      let maximum = 0;
      for (const good of masks[a]) {
        let bad = 0;
        for (let w = 0; w < U.length; w++) { if (!charge()) return null; bad += popcount(U[w] & ~good[w]); }
        maximum = Math.max(maximum, bad);
      }
      maxBad.push(maximum);
    }
    return { uncoveredCount, maxBad };
  }
  function nextMask(U: Uint32Array, axis: number, digitValue: number): Uint32Array | null {
    const good = masks[axis][scope.digitAxes[axis].indexOf(digitValue)], next = new Uint32Array(U.length);
    for (let w = 0; w < U.length; w++) { if (!charge()) return null; next[w] = U[w] & good[w]; }
    return next;
  }
  function omission(prefix: number[]): { omittedIndex: number; divisor: number } | null {
    const speeds = prefix.map((d, a) => (scope.parentResidues[a] + parentM * d) % M);
    for (let omittedIndex = 0; omittedIndex < 13; omittedIndex++) {
      let divisor = scope.targetLevel;
      for (let a = 0; a < 13; a++) if (a !== omittedIndex) {
        let b = speeds[a];
        while (b) { if (!charge()) return null; [divisor, b] = [b, divisor % b]; }
      }
      if (divisor > 1) return { omittedIndex, divisor };
    }
    return null;
  }
  const nodes: LrcCoverNode[] = [];
  function visit(prefix: number[], U: Uint32Array | null, reserved: number): string {
    const id = `n${nodes.length}`, offset = nodes.length;
    nodes.push({ id, prefix, kind: "UNRESOLVED", reason: latched ?? "NODE_LIMIT" });
    if (!U || !charge()) { nodes[offset] = { id, prefix, kind: "UNRESOLVED", reason: latched ?? "WORK_LIMIT" }; return id; }
    const proof = bound(prefix, U);
    if (!proof) { nodes[offset] = { id, prefix, kind: "UNRESOLVED", reason: latched ?? "WORK_LIMIT" }; return id; }
    if (proof.uncoveredCount > proof.maxBad.reduce((n, b) => n + b, 0)) nodes[offset] = { id, prefix, kind: "COVER_BOUND", ...proof };
    else if (prefix.length === 13) {
      const gcd = omission(prefix);
      nodes[offset] = latched ? { id, prefix, kind: "UNRESOLVED", reason: latched } : gcd ? { id, prefix, kind: "OMIT_GCD", ...gcd } : { id, prefix, kind: "SURVIVOR" };
    } else {
      const choices = scope.digitAxes[prefix.length];
      if (nodes.length + reserved + choices.length <= limits.maxNodes) {
        const children = choices.map((d, i) => visit([...prefix, d], latched ? null : nextMask(U, prefix.length, d), reserved + choices.length - i - 1));
        nodes[offset] = { id, prefix, kind: "SPLIT", children };
      } else latched = "NODE_LIMIT";
    }
    return id;
  }
  const rootNodeId = visit([], latched ? null : initialMask(H), 0);
  let unsigned: Omit<LrcCoverCertificate, "certificateDigest"> = { version: 1, method: "LRC_MODULAR_BOUND_TREE_V1", rootContractDigest,
    scopeDigest: lrcCoverScopeDigest(scope), rootNodeId, nodes };
  const collapse = (reason: Reason) => { unsigned = { ...unsigned, rootNodeId: "n0", nodes: [{ id: "n0", prefix: [], kind: "UNRESOLVED", reason }] }; };
  let result = { ...unsigned, certificateDigest: lrcCoverCertificateDigest(unsigned) };
  if (Buffer.byteLength(canonicalJson(result), "utf8") > limits.maxBytes) { collapse("OUTPUT_LIMIT"); result = { ...unsigned, certificateDigest: lrcCoverCertificateDigest(unsigned) }; }
  if (performance.now() >= deadline) { collapse("TIME_LIMIT"); result = { ...unsigned, certificateDigest: lrcCoverCertificateDigest(unsigned) }; }
  return result;
}

/** Independent arithmetic consumer, including bounded pure retained validation.
 * A full partition with UNRESOLVED leaves is PARTIAL, never an agent/theorem gate. */
export function verifyLrcCoverCertificate(raw: unknown, expectedScope: unknown, rootContractDigest: string,
  options: { maxWork?: number; timeoutMs?: number } = {}): LrcCoverSummary {
  const started = performance.now();
  const empty: LrcCoverSummary = { status: "INVALID", scopeDigest: "", certificateDigest: "", totalTuples: "0", classifiedTuples: "0",
    witnessTuples: "0", gcdTuples: "0", survivorTuples: "0", unresolvedTuples: "0", nodeCount: 0, leafCount: 0,
    coverLeaves: 0, gcdLeaves: 0, survivorLeaves: 0, unresolvedLeaves: 0, survivors: [], lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED", errors: [] };
  const invalid = (error: string): LrcCoverSummary => ({ ...empty, errors: [error] });
  const parsedLimits = verificationLimits.safeParse({ maxWork: 20000000, timeoutMs: 10000, ...options });
  if (!parsedLimits.success) return invalid("INVALID_VERIFY_LIMITS");
  const limits = parsedLimits.data, deadline = started + limits.timeoutMs; let work = 0;
  function charge(cost = 1) {
    if (performance.now() >= deadline) throw new Error("VERIFICATION_TIME_LIMIT");
    if (work + cost > limits.maxWork) throw new Error("VERIFICATION_WORK_LIMIT"); work += cost;
  }
  try {
    charge(0);
    const parsedScope = lrcCoverScopeSchema.safeParse(expectedScope);
    if (!parsedScope.success || !hex.safeParse(rootContractDigest).success) return invalid("INVALID_EXPECTED_SCOPE");
    const scope = parsedScope.data; empty.scopeDigest = lrcCoverScopeDigest(scope); empty.totalTuples = cardinality(scope, 0).toString();
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > LRC_COVER_BOUND_LIMITS.bytes) return invalid("CERTIFICATE_BYTES_LIMIT");
    charge(0);
    const parsed = lrcCoverCertificateSchema.safeParse(raw); if (!parsed.success) return invalid("INVALID_CERTIFICATE_SCHEMA");
    const certificate = parsed.data; empty.certificateDigest = certificate.certificateDigest;
    if (certificate.rootContractDigest !== rootContractDigest || certificate.scopeDigest !== empty.scopeDigest) return invalid("ROOT_SCOPE_BINDING");
    if (lrcCoverCertificateDigest(certificate) !== certificate.certificateDigest) return invalid("CERTIFICATE_DIGEST");
    charge(0);
    const byId = new Map<string, LrcCoverNode>();
    for (const node of certificate.nodes) {
      charge(); if (byId.has(node.id)) return invalid("DUPLICATE_NODE"); byId.set(node.id, node);
      if (node.prefix.some((d, a) => !scope.digitAxes[a].includes(d))) return invalid("INVALID_PREFIX");
    }
    const root = byId.get(certificate.rootNodeId); if (!root || root.prefix.length !== 0) return invalid("ROOT_PREFIX");
    const M = BigInt(scope.targetLevel) * BigInt(scope.prime), parentM = BigInt(scope.parentLevel) * BigInt(scope.prime), H = Number(M / BigInt(2));
    // Independent BigInt residue construction; consumer never calls producer helpers.
    const goodMasks = scope.digitAxes.map((axis, a) => axis.map((d) => {
      charge();
      const result = new Uint32Array(Math.ceil(H / 32)); const speed = (BigInt(scope.parentResidues[a]) + parentM * BigInt(d)) % M;
      for (let j = 1; j <= H; j++) {
        charge(); const r = BigInt(j) * speed % M;
        if (BigInt(14) * (r < M - r ? r : M - r) >= M) result[(j - 1) >>> 5] |= 1 << ((j - 1) & 31);
      }
      return result;
    }));
    function size(U: Uint32Array): number { let n = 0; for (const word of U) { charge(); n += popcount(word); } return n; }
    function exactGcd(prefix: number[], omit: number): bigint {
      let g = BigInt(scope.targetLevel);
      for (let a = 0; a < 13; a++) if (a !== omit) {
        let b = (BigInt(scope.parentResidues[a]) + parentM * BigInt(prefix[a])) % M;
        while (b !== BigInt(0)) { charge(); [g, b] = [b, g % b]; }
      }
      return g;
    }
    const summary: LrcCoverSummary = { ...empty, status: "COMPLETE", survivors: [], errors: [] };
    let witnesses = BigInt(0), gcds = BigInt(0), survivors = BigInt(0), unresolved = BigInt(0);
    // Induction invariant: each independently derived U is exactly the folded
    // grid surviving all assigned coordinates in this verified prefix path.
    const visited = new Set<string>(), pending = [{ node: root, U: initialMask(H) }];
    while (pending.length) {
      charge(); const { node, U } = pending.pop()!;
      if (visited.has(node.id)) return invalid("REUSED_OR_CYCLIC_NODE"); visited.add(node.id); summary.nodeCount++;
      const depth = node.prefix.length;
      if (node.kind === "SPLIT") {
        if (depth >= 13) return invalid("SPLIT_AT_SINGLETON");
        const choices = scope.digitAxes[depth]; if (node.children.length !== choices.length) return invalid("INCOMPLETE_PARTITION");
        for (let i = 0; i < choices.length; i++) {
          const child = byId.get(node.children[i]); if (!child) return invalid("MISSING_CHILD");
          if (child.prefix.length !== depth + 1 || child.prefix[depth] !== choices[i] || node.prefix.some((d, a) => d !== child.prefix[a])) return invalid("CHILD_PARTITION");
          const good = goodMasks[depth][i], childU = new Uint32Array(U.length);
          for (let w = 0; w < U.length; w++) { charge(); childU[w] = U[w] & good[w]; }
          pending.push({ node: child, U: childU });
        }
        continue;
      }
      summary.leafCount++; const tuples = cardinality(scope, depth);
      if (node.kind === "UNRESOLVED") { summary.unresolvedLeaves++; unresolved += tuples; continue; }
      const uc = size(U);
      if (node.kind === "COVER_BOUND") {
        if (node.uncoveredCount !== uc || node.maxBad.length !== 13 - depth) return invalid("FALSE_BOUND_COUNTS");
        let sum = 0;
        for (let a = depth; a < 13; a++) {
          let maximum = 0;
          for (const good of goodMasks[a]) {
            let bad = 0; for (let w = 0; w < U.length; w++) { charge(); bad += popcount(U[w] & ~good[w]); }
            maximum = Math.max(maximum, bad);
          }
          if (node.maxBad[a - depth] !== maximum) return invalid("FALSE_BOUND_COUNTS"); sum += maximum;
        }
        if (uc <= sum) return invalid("BOUND_NOT_STRICT");
        summary.coverLeaves++; witnesses += tuples;
      } else {
        if (depth !== 13) return invalid("SINGLETON_REQUIRED");
        if (uc !== 0) return invalid("SINGLETON_HAS_GRID_WITNESS");
        if (node.kind === "OMIT_GCD") {
          if (exactGcd(node.prefix, node.omittedIndex) !== BigInt(node.divisor)) return invalid("FALSE_OMIT_GCD");
          summary.gcdLeaves++; gcds += tuples;
        } else {
          for (let omitted = 0; omitted < 13; omitted++) if (exactGcd(node.prefix, omitted) > BigInt(1)) return invalid("FALSE_SURVIVOR_GCD");
          summary.survivorLeaves++; survivors += tuples;
          summary.survivors.push({ digits: node.prefix, residues: node.prefix.map((d, a) => Number((BigInt(scope.parentResidues[a]) + parentM * BigInt(d)) % M)) });
        }
      }
    }
    if (visited.size !== byId.size) return invalid("UNREACHABLE_NODE");
    if (witnesses + gcds + survivors + unresolved !== BigInt(empty.totalTuples)) return invalid("COVERAGE_CARDINALITY");
    summary.classifiedTuples = (witnesses + gcds + survivors).toString(); summary.witnessTuples = witnesses.toString();
    summary.gcdTuples = gcds.toString(); summary.survivorTuples = survivors.toString(); summary.unresolvedTuples = unresolved.toString();
    summary.survivors.sort((a, b) => { for (let i = 0; i < 13; i++) if (a.digits[i] !== b.digits[i]) return a.digits[i] - b.digits[i]; return 0; });
    if (unresolved > BigInt(0)) summary.status = "PARTIAL";
    canonicalJson(summary); charge(0);
    return summary;
  } catch (error) { return invalid(error instanceof Error ? error.message : "VERIFICATION_FAILURE"); }
}
