import { z } from "zod";

import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

/** Ordered finite fibers, not global Allikvere coverage or an admitted induction premise. */
export const LRC_MODULAR_LIMITS = Object.freeze({ prime: 257, level: 14, tuples: 20000, nodes: 40000,
  bytes: 8388608, work: 20000000, milliseconds: 10000 });
export const LRC_MODULAR_LOWER_DEPENDENCY = "LOWER_LRC_12_DECLARED_NOT_REPLAYED" as const;
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const identifier = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const index = z.number().int().min(0).max(13);
function prime(n: number): boolean { for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return n >= 2; }
function gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a; }

export const lrcModularScopeSchema = z.object({
  version: z.literal(1), totalRunners: z.literal(14), prime: z.number().int().min(17).max(257),
  parentLevel: z.number().int().min(1).max(14), targetLevel: z.number().int().min(2).max(14),
  parentResidues: z.array(z.number().int().min(1).max(3597)).length(13),
  digitAxes: z.array(z.array(index).min(1).max(14)).length(13), sourceDigest: hex,
  lowerDependency: z.literal(LRC_MODULAR_LOWER_DEPENDENCY),
}).strict().superRefine((scope, ctx) => {
  if (!prime(scope.prime)) ctx.addIssue({ code: "custom", message: "Exact prime required" });
  const factor = scope.targetLevel / scope.parentLevel;
  if (!Number.isInteger(factor) || factor < 2) ctx.addIssue({ code: "custom", message: "Proper integral lift factor required" });
  if (scope.parentResidues.some((r) => r >= scope.parentLevel * scope.prime || r % scope.prime === 0)) ctx.addIssue({ code: "custom", message: "Parent residue outside nonzero-p domain" });
  let tuples = 1;
  for (const axis of scope.digitAxes) {
    tuples *= axis.length;
    if (axis.some((d, i) => d >= factor || (i > 0 && d <= axis[i - 1]))) ctx.addIssue({ code: "custom", message: "Sorted distinct legal lift digits required" });
  }
  if (tuples > LRC_MODULAR_LIMITS.tuples) ctx.addIssue({ code: "custom", message: "Fiber exceeds tuple limit" });
});
export type LrcModularScope = z.infer<typeof lrcModularScopeSchema>;
const boxSchema = z.object({ lower: z.array(index).length(13), upper: z.array(index).length(13) }).strict();
type Box = z.infer<typeof boxSchema>;
const base = { id: identifier, box: boxSchema };
export const lrcModularNodeSchema = z.discriminatedUnion("kind", [
  z.object({ ...base, kind: z.literal("SPLIT"), axis: z.number().int().min(0).max(12), children: z.array(identifier).min(2).max(14) }).strict(),
  z.object({ ...base, kind: z.literal("GRID"), gridIndex: z.number().int().min(1).max(3597) }).strict(),
  z.object({ ...base, kind: z.literal("OMIT_GCD"), omittedIndex: z.number().int().min(0).max(12), divisor: z.number().int().min(2).max(3598) }).strict(),
  z.object({ ...base, kind: z.literal("SURVIVOR") }).strict(),
  z.object({ ...base, kind: z.literal("UNRESOLVED"), reason: z.enum(["WORK_LIMIT", "TIME_LIMIT", "NODE_LIMIT", "OUTPUT_LIMIT"]) }).strict(),
]);
export type LrcModularNode = z.infer<typeof lrcModularNodeSchema>;
export const lrcModularCertificateSchema = z.object({ version: z.literal(1), rootContractDigest: hex,
  scopeDigest: hex, rootNodeId: identifier, nodes: z.array(lrcModularNodeSchema).min(1).max(40000), certificateDigest: hex }).strict();
export type LrcModularCertificate = z.infer<typeof lrcModularCertificateSchema>;
const count = z.number().int().min(0).max(20000);
export const lrcModularSummarySchema = z.object({ status: z.enum(["COMPLETE", "PARTIAL", "INVALID"]), scopeDigest: z.string(), certificateDigest: z.string(),
  totalTuples: count, classifiedTuples: count, witnessTuples: count, gcdTuples: count, survivorTuples: count, unresolvedTuples: count,
  nodeCount: z.number().int().min(0).max(40000), leafCount: z.number().int().min(0).max(40000),
  gridLeaves: count, gcdLeaves: count, survivorLeaves: count, unresolvedLeaves: count,
  survivors: z.array(z.object({ digits: z.array(index).length(13), residues: z.array(z.number().int().min(1).max(3597)).length(13) }).strict()).max(20000),
  lowerDependency: z.literal(LRC_MODULAR_LOWER_DEPENDENCY), errors: z.array(z.string().max(128)).max(1),
}).strict();
export type LrcModularSummary = z.infer<typeof lrcModularSummarySchema>;
export function lrcModularScopeDigest(scope: LrcModularScope): string { return sha256(canonicalJson(lrcModularScopeSchema.parse(scope))); }
export function lrcModularCertificateDigest(certificate: Omit<LrcModularCertificate, "certificateDigest"> | LrcModularCertificate): string {
  const { certificateDigest: _digest, ...unsigned } = certificate as LrcModularCertificate; void _digest;
  return sha256(canonicalJson(unsigned));
}
function rootBox(scope: LrcModularScope): Box { return { lower: scope.digitAxes.map(() => 0), upper: scope.digitAxes.map((a) => a.length - 1) }; }
function cardinality(box: Box): number { return box.lower.reduce((n, lo, i) => n * (box.upper[i] - lo + 1), 1); }
type Reason = "WORK_LIMIT" | "TIME_LIMIT" | "NODE_LIMIT" | "OUTPUT_LIMIT";

/** Bounded producer. Uniform GRID/GCD leaves prove all choices in a box; no orbit reduction. */
export function buildLrcModularCertificate(rawScope: LrcModularScope, rootContractDigest: string,
  options: { maxNodes?: number; maxWork?: number; timeoutMs?: number; maxBytes?: number } = {}): LrcModularCertificate {
  const scope = lrcModularScopeSchema.parse(rawScope); hex.parse(rootContractDigest);
  const limits = z.object({ maxNodes: z.number().int().min(1).max(40000), maxWork: z.number().int().min(0).max(20000000),
    timeoutMs: z.number().int().min(0).max(10000), maxBytes: z.number().int().min(1024).max(8388608) }).strict()
    .parse({ maxNodes: 40000, maxWork: 20000000, timeoutMs: 10000, maxBytes: 8388608, ...options });
  const deadline = performance.now() + limits.timeoutMs; let work = 0;
  const M = scope.targetLevel * scope.prime, parentM = scope.parentLevel * scope.prime;
  const values = scope.digitAxes.map((axis, a) => axis.map((d) => (scope.parentResidues[a] + parentM * d) % M));
  const nodes: LrcModularNode[] = [];
  const charge = (): Reason | null => performance.now() >= deadline ? "TIME_LIMIT" : ++work > limits.maxWork ? "WORK_LIMIT" : null;
  function classify(box: Box): { kind: "GRID"; gridIndex: number } | { kind: "OMIT_GCD"; omittedIndex: number; divisor: number } | { kind: "SURVIVOR" } | { kind: "UNRESOLVED"; reason: Reason } | null {
    for (let j = 1; j <= Math.floor(M / 2); j++) {
      let good = true;
      for (let a = 0; a < 13 && good; a++) for (let i = box.lower[a]; i <= box.upper[a]; i++) {
        const reason = charge(); if (reason) return { kind: "UNRESOLVED", reason };
        const r = j * values[a][i] % M;
        if (14 * Math.min(r, M - r) < M) { good = false; break; }
      }
      if (good) return { kind: "GRID", gridIndex: j };
    }
    // Missing one COMMON grid witness is not absence of witnesses for every tuple.
    // Split first to preserve GRID-first per-tuple counts; GCD pruning is singleton here.
    if (cardinality(box) !== 1) return null;
    for (let omittedIndex = 0; omittedIndex < 13; omittedIndex++) {
      let divisor = scope.targetLevel;
      for (let a = 0; a < 13 && divisor > 1; a++) if (a !== omittedIndex) for (let i = box.lower[a]; i <= box.upper[a] && divisor > 1; i++) {
        const reason = charge(); if (reason) return { kind: "UNRESOLVED", reason };
        divisor = gcd(divisor, values[a][i]);
      }
      if (divisor > 1) return { kind: "OMIT_GCD", omittedIndex, divisor };
    }
    return { kind: "SURVIVOR" };
  }
  function visit(box: Box, reserved: number): string {
    const id = `n${nodes.length}`, offset = nodes.length;
    nodes.push({ id, box, kind: "UNRESOLVED", reason: "NODE_LIMIT" });
    const leaf = classify(box);
    if (leaf) nodes[offset] = { id, box, ...leaf };
    else if (nodes.length + reserved + 2 <= limits.maxNodes) {
      let axis = 0; for (let a = 1; a < 13; a++) if (box.upper[a] - box.lower[a] > box.upper[axis] - box.lower[axis]) axis = a;
      const middle = Math.floor((box.lower[axis] + box.upper[axis]) / 2), left = structuredClone(box), right = structuredClone(box);
      left.upper[axis] = middle; right.lower[axis] = middle + 1;
      const children = [visit(left, reserved + 1), visit(right, reserved)];
      nodes[offset] = { id, box, kind: "SPLIT", axis, children };
    }
    return id;
  }
  let unsigned: Omit<LrcModularCertificate, "certificateDigest"> = { version: 1, rootContractDigest, scopeDigest: lrcModularScopeDigest(scope), rootNodeId: visit(rootBox(scope), 0), nodes };
  const collapse = (reason: Reason) => { unsigned = { ...unsigned, rootNodeId: "n0", nodes: [{ id: "n0", box: rootBox(scope), kind: "UNRESOLVED", reason }] }; };
  let sealed = { ...unsigned, certificateDigest: lrcModularCertificateDigest(unsigned) };
  if (Buffer.byteLength(canonicalJson(sealed), "utf8") > limits.maxBytes) { collapse("OUTPUT_LIMIT"); sealed = { ...unsigned, certificateDigest: lrcModularCertificateDigest(unsigned) }; }
  // Final observed serialization/hash time is charged; diagnostic sealing cannot restore COMPLETE.
  if (performance.now() >= deadline) { collapse("TIME_LIMIT"); sealed = { ...unsigned, certificateDigest: lrcModularCertificateDigest(unsigned) }; }
  return sealed;
}

/** Separate consumer derives all arithmetic, counts and survivors anew; never invokes the producer. */
export function verifyLrcModularCertificate(raw: unknown, expectedScope: unknown, rootContractDigest: string): LrcModularSummary {
  const empty: LrcModularSummary = { status: "INVALID", scopeDigest: "", certificateDigest: "", totalTuples: 0, classifiedTuples: 0,
    witnessTuples: 0, gcdTuples: 0, survivorTuples: 0, unresolvedTuples: 0, nodeCount: 0, leafCount: 0,
    gridLeaves: 0, gcdLeaves: 0, survivorLeaves: 0, unresolvedLeaves: 0, survivors: [], lowerDependency: LRC_MODULAR_LOWER_DEPENDENCY, errors: [] };
  const invalid = (error: string): LrcModularSummary => ({ ...empty, errors: [error] });
  const parsedScope = lrcModularScopeSchema.safeParse(expectedScope);
  if (!parsedScope.success || !hex.safeParse(rootContractDigest).success) return invalid("INVALID_EXPECTED_SCOPE");
  const scope = parsedScope.data; empty.scopeDigest = lrcModularScopeDigest(scope); empty.totalTuples = cardinality(rootBox(scope));
  const deadline = performance.now() + LRC_MODULAR_LIMITS.milliseconds; let work = 0;
  try { if (Buffer.byteLength(JSON.stringify(raw), "utf8") > LRC_MODULAR_LIMITS.bytes) return invalid("CERTIFICATE_BYTES_LIMIT"); } catch { return invalid("INVALID_SERIALIZATION"); }
  const parsed = lrcModularCertificateSchema.safeParse(raw); if (!parsed.success) return invalid("INVALID_CERTIFICATE_SCHEMA");
  const certificate = parsed.data; empty.certificateDigest = certificate.certificateDigest;
  if (certificate.rootContractDigest !== rootContractDigest || certificate.scopeDigest !== empty.scopeDigest) return invalid("ROOT_SCOPE_BINDING");
  if (lrcModularCertificateDigest(certificate) !== certificate.certificateDigest) return invalid("CERTIFICATE_DIGEST");
  const byId = new Map<string, LrcModularNode>();
  for (const node of certificate.nodes) {
    if (byId.has(node.id)) return invalid("DUPLICATE_NODE"); byId.set(node.id, node);
    if (node.box.lower.some((lo, a) => lo > node.box.upper[a] || node.box.upper[a] >= scope.digitAxes[a].length)) return invalid("INVALID_BOX");
  }
  const root = byId.get(certificate.rootNodeId);
  if (!root || canonicalJson(root.box) !== canonicalJson(rootBox(scope))) return invalid("ROOT_BOX");
  const summary: LrcModularSummary = { ...empty, status: "COMPLETE", survivors: [], errors: [] };
  const M = BigInt(scope.targetLevel) * BigInt(scope.prime), parentM = BigInt(scope.parentLevel) * BigInt(scope.prime);
  const residues = scope.digitAxes.map((axis, a) => axis.map((d) => (BigInt(scope.parentResidues[a]) + parentM * BigInt(d)) % M));
  const charge = () => { if (++work > LRC_MODULAR_LIMITS.work) throw new Error("VERIFICATION_WORK_LIMIT"); if (performance.now() >= deadline) throw new Error("VERIFICATION_TIME_LIMIT"); };
  function witness(box: Box, j: number): boolean {
    if (j < 1 || BigInt(j) >= M) return false;
    for (let a = 0; a < 13; a++) for (let i = box.lower[a]; i <= box.upper[a]; i++) {
      charge(); const r = BigInt(j) * residues[a][i] % M;
      if (BigInt(14) * (r < M - r ? r : M - r) < M) return false;
    }
    return true;
  }
  function commonGcd(box: Box, omittedIndex: number): bigint {
    let g = BigInt(scope.targetLevel);
    for (let a = 0; a < 13; a++) if (a !== omittedIndex) for (let i = box.lower[a]; i <= box.upper[a]; i++) {
      charge(); let b = residues[a][i]; while (b !== BigInt(0)) { charge(); [g, b] = [b, g % b]; }
    }
    return g;
  }
  const visited = new Set<string>(), pending = [root];
  try {
    while (pending.length) {
      charge(); const node = pending.pop()!;
      if (visited.has(node.id)) return invalid("REUSED_OR_CYCLIC_NODE"); visited.add(node.id); summary.nodeCount++;
      if (node.kind === "SPLIT") {
        let next = node.box.lower[node.axis];
        for (const id of node.children) {
          const child = byId.get(id); if (!child) return invalid("MISSING_CHILD");
          if (child.box.lower[node.axis] !== next || child.box.upper[node.axis] > node.box.upper[node.axis] ||
            child.box.lower.some((lo, a) => a !== node.axis && (lo !== node.box.lower[a] || child.box.upper[a] !== node.box.upper[a]))) return invalid("CHILD_PARTITION");
          next = child.box.upper[node.axis] + 1; pending.push(child);
        }
        if (next !== node.box.upper[node.axis] + 1) return invalid("INCOMPLETE_PARTITION");
        continue;
      }
      summary.leafCount++; const tuples = cardinality(node.box);
      if (node.kind === "UNRESOLVED") { summary.unresolvedLeaves++; summary.unresolvedTuples += tuples; continue; }
      if (node.kind === "GRID") {
        if (!witness(node.box, node.gridIndex)) return invalid("FALSE_GRID"); summary.gridLeaves++; summary.witnessTuples += tuples;
      } else if (node.kind === "OMIT_GCD") {
        if (commonGcd(node.box, node.omittedIndex) !== BigInt(node.divisor)) return invalid("FALSE_OMIT_GCD");
        summary.gcdLeaves++; summary.gcdTuples += tuples;
      } else {
        if (tuples !== 1) return invalid("SURVIVOR_NOT_SINGLETON");
        for (let j = 1; j <= Number(M / BigInt(2)); j++) if (witness(node.box, j)) return invalid("FALSE_SURVIVOR_GRID");
        for (let omitted = 0; omitted < 13; omitted++) if (commonGcd(node.box, omitted) > BigInt(1)) return invalid("FALSE_SURVIVOR_GCD");
        summary.survivorLeaves++; summary.survivorTuples++;
        summary.survivors.push({ digits: node.box.lower.map((i, a) => scope.digitAxes[a][i]), residues: node.box.lower.map((i, a) => Number(residues[a][i])) });
      }
    }
    if (visited.size !== byId.size) return invalid("UNREACHABLE_NODE");
    summary.classifiedTuples = summary.witnessTuples + summary.gcdTuples + summary.survivorTuples;
    if (summary.classifiedTuples + summary.unresolvedTuples !== summary.totalTuples) return invalid("COVERAGE_CARDINALITY");
    summary.survivors.sort((a, b) => { for (let i = 0; i < 13; i++) if (a.digits[i] !== b.digits[i]) return a.digits[i] - b.digits[i]; return 0; });
    if (summary.unresolvedTuples > 0) summary.status = "PARTIAL";
    // Includes observed final summary canonicalization; no unchecked COMPLETE escapes after expiry.
    canonicalJson(summary); charge();
    return summary;
  } catch (error) { return invalid(error instanceof Error ? error.message : "VERIFICATION_FAILURE"); }
}
