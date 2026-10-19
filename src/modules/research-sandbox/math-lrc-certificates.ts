import { z } from "zod";

import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";

/** Finite fixed-grid evidence only. NO_GRID is never a continuous-time LRC refutation. */
export const LRC_LIMITS = Object.freeze({ totalRunners: 15, modulus: 128, tuples: 10000, nodes: 20000, bytes: 2097152, work: 5000000, milliseconds: 5000 });
const integer = z.number().int().min(0).max(128);
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const identifier = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

export const lrcFiniteScopeSchema = z.object({
  version: z.literal(1),
  totalRunners: z.number().int().min(2).max(LRC_LIMITS.totalRunners),
  modulus: z.number().int().min(2).max(LRC_LIMITS.modulus),
  axes: z.array(z.array(z.number().int().min(1).max(127)).min(1).max(127)).min(1).max(14),
}).strict().superRefine((scope, ctx) => {
  if (scope.axes.length !== scope.totalRunners - 1) ctx.addIssue({ code: "custom", message: "Exactly N-1 axes required" });
  const seen = new Set<number>();
  let tuples = 1;
  for (const axis of scope.axes) {
    tuples *= axis.length;
    for (let i = 0; i < axis.length; i++) {
      if (axis[i] >= scope.modulus || (i > 0 && axis[i] <= axis[i - 1]) || seen.has(axis[i])) ctx.addIssue({ code: "custom", message: "Axes must be sorted, disjoint positive residues" });
      seen.add(axis[i]);
    }
  }
  if (tuples > LRC_LIMITS.tuples) ctx.addIssue({ code: "custom", message: "Cartesian scope exceeds limit" });
});
export type LrcFiniteScope = z.infer<typeof lrcFiniteScopeSchema>;

const boxSchema = z.object({ lower: z.array(integer).min(1).max(14), upper: z.array(integer).min(1).max(14) }).strict();
const base = { id: identifier, box: boxSchema };
const rational = { baseNumerator: integer, baseDenominator: z.number().int().min(1).max(128), shiftModulus: z.number().int().min(1).max(128) };
export const lrcNodeSchema = z.discriminatedUnion("kind", [
  z.object({ ...base, kind: z.literal("SPLIT"), axis: z.number().int().min(0).max(13), children: z.array(identifier).min(2).max(127) }).strict(),
  z.object({ ...base, kind: z.literal("GRID"), gridIndex: integer }).strict(),
  z.object({ ...base, ...rational, kind: z.literal("SHIFT"), shiftIndex: integer }).strict(),
  z.object({ ...base, ...rational, kind: z.literal("CRT"), factors: z.array(z.object({ modulus: z.number().int().min(2).max(128), residue: integer }).strict()).min(2).max(7) }).strict(),
  z.object({ ...base, kind: z.literal("NO_GRID") }).strict(),
  z.object({ ...base, kind: z.literal("UNRESOLVED"), reason: z.enum(["WORK_LIMIT", "TIME_LIMIT", "NODE_LIMIT", "OUTPUT_LIMIT"]) }).strict(),
]);
export type LrcNode = z.infer<typeof lrcNodeSchema>;
export const lrcCertificateSchema = z.object({
  version: z.literal(1), rootContractDigest: digest, scopeDigest: digest,
  rootNodeId: identifier, nodes: z.array(lrcNodeSchema).min(1).max(LRC_LIMITS.nodes), certificateDigest: digest,
}).strict();
export type LrcCertificate = z.infer<typeof lrcCertificateSchema>;
export type LrcBox = z.infer<typeof boxSchema>;

export const lrcVerificationSummarySchema = z.object({
  status: z.enum(["PASS", "PARTIAL", "INVALID"]), scopeDigest: z.string(), certificateDigest: z.string(),
  totalTuples: z.number().int().min(0).max(10000), coveredTuples: z.number().int().min(0).max(10000),
  witnessTuples: z.number().int().min(0).max(10000), gridExcludedTuples: z.number().int().min(0).max(10000), unresolvedTuples: z.number().int().min(0).max(10000),
  nodeCount: z.number().int().min(0).max(20000), leafCount: z.number().int().min(0).max(20000),
  gridLeaves: z.number().int().min(0).max(20000), shiftLeaves: z.number().int().min(0).max(20000), crtLeaves: z.number().int().min(0).max(20000),
  noGridLeaves: z.number().int().min(0).max(20000), unresolvedLeaves: z.number().int().min(0).max(20000), errors: z.array(z.string().max(128)).max(1),
}).strict();
export type LrcVerificationSummary = z.infer<typeof lrcVerificationSummarySchema>;

export function lrcScopeDigest(scope: LrcFiniteScope): string { return sha256(canonicalJson(lrcFiniteScopeSchema.parse(scope))); }
export function lrcCertificateDigest(certificate: Omit<LrcCertificate, "certificateDigest"> | LrcCertificate): string {
  const { certificateDigest: _digest, ...unsigned } = certificate as LrcCertificate;
  void _digest;
  return sha256(canonicalJson(unsigned));
}
function cardinality(box: LrcBox): number { return box.lower.reduce((n, lo, i) => n * (box.upper[i] - lo + 1), 1); }
function rootBox(scope: LrcFiniteScope): LrcBox { return { lower: scope.axes.map(() => 0), upper: scope.axes.map((a) => a.length - 1) }; }
function sameBox(a: LrcBox, b: LrcBox): boolean { return canonicalJson(a) === canonicalJson(b); }
function gcd(a: number, b: number): number { while (b) [a, b] = [b, a % b]; return a; }
function zeroSummary(): LrcVerificationSummary {
  return { status: "INVALID", scopeDigest: "", certificateDigest: "", totalTuples: 0, coveredTuples: 0, witnessTuples: 0, gridExcludedTuples: 0, unresolvedTuples: 0, nodeCount: 0, leafCount: 0, gridLeaves: 0, shiftLeaves: 0, crtLeaves: 0, noGridLeaves: 0, unresolvedLeaves: 0, errors: [] };
}

/** Producer uses ordinary bounded integer residues; checker below derives leaf arithmetic independently. */
export function buildLrcCertificate(rawScope: LrcFiniteScope, rootContractDigest: string, options: { maxNodes?: number; maxWork?: number; timeoutMs?: number } = {}): LrcCertificate {
  const scope = lrcFiniteScopeSchema.parse(rawScope);
  digest.parse(rootContractDigest);
  const limits = z.object({ maxNodes: z.number().int().min(1).max(LRC_LIMITS.nodes), maxWork: z.number().int().min(0).max(LRC_LIMITS.work), timeoutMs: z.number().int().min(0).max(LRC_LIMITS.milliseconds) }).strict().parse({ maxNodes: 20000, maxWork: 5000000, timeoutMs: 5000, ...options });
  const deadline = performance.now() + limits.timeoutMs;
  let work = 0;
  const nodes: LrcNode[] = [];
  function common(box: LrcBox): number | "WORK_LIMIT" | "TIME_LIMIT" | null {
    for (let j = 0; j < scope.modulus; j++) {
      let good = true;
      for (let axis = 0; axis < scope.axes.length && good; axis++) for (let i = box.lower[axis]; i <= box.upper[axis]; i++) {
        if (performance.now() >= deadline) return "TIME_LIMIT";
        if (++work > limits.maxWork) return "WORK_LIMIT";
        const r = j * scope.axes[axis][i] % scope.modulus;
        if (scope.totalRunners * Math.min(r, scope.modulus - r) < scope.modulus) { good = false; break; }
      }
      if (good) return j;
    }
    return null;
  }
  function visit(box: LrcBox, reserved: number): string {
    const id = `n${nodes.length}`;
    const offset = nodes.length;
    nodes.push({ id, box, kind: "UNRESOLVED", reason: "NODE_LIMIT" });
    const witness = common(box);
    if (typeof witness === "number") nodes[offset] = { id, box, kind: "GRID", gridIndex: witness };
    else if (witness !== null) nodes[offset] = { id, box, kind: "UNRESOLVED", reason: witness };
    else if (cardinality(box) === 1) nodes[offset] = { id, box, kind: "NO_GRID" };
    else if (nodes.length + reserved + 2 <= limits.maxNodes) {
      let axis = 0;
      for (let a = 1; a < box.lower.length; a++) if (box.upper[a] - box.lower[a] > box.upper[axis] - box.lower[axis]) axis = a;
      const middle = Math.floor((box.lower[axis] + box.upper[axis]) / 2);
      const left = structuredClone(box), right = structuredClone(box);
      left.upper[axis] = middle; right.lower[axis] = middle + 1;
      const children = [visit(left, reserved + 1), visit(right, reserved)];
      nodes[offset] = { id, box, kind: "SPLIT", axis, children };
    }
    return id;
  }
  const rootNodeId = visit(rootBox(scope), 0);
  let unsigned: Omit<LrcCertificate, "certificateDigest"> = { version: 1, rootContractDigest, scopeDigest: lrcScopeDigest(scope), rootNodeId, nodes };
  if (Buffer.byteLength(canonicalJson(unsigned), "utf8") + 88 > LRC_LIMITS.bytes) unsigned = { ...unsigned, rootNodeId: "n0", nodes: [{ id: "n0", box: rootBox(scope), kind: "UNRESOLVED", reason: "OUTPUT_LIMIT" }] };
  let sealed = { ...unsigned, certificateDigest: lrcCertificateDigest(unsigned) };
  if (Buffer.byteLength(canonicalJson(sealed), "utf8") > LRC_LIMITS.bytes) {
    unsigned = { ...unsigned, rootNodeId: "n0", nodes: [{ id: "n0", box: rootBox(scope), kind: "UNRESOLVED", reason: "OUTPUT_LIMIT" }] };
    sealed = { ...unsigned, certificateDigest: lrcCertificateDigest(unsigned) };
  }
  // Includes observed hashing/serialization cost. Diagnostic sealing after expiry cannot authorize PASS.
  if (performance.now() >= deadline) {
    unsigned = { ...unsigned, rootNodeId: "n0", nodes: [{ id: "n0", box: rootBox(scope), kind: "UNRESOLVED", reason: "TIME_LIMIT" }] };
    sealed = { ...unsigned, certificateDigest: lrcCertificateDigest(unsigned) };
  }
  return sealed;
}

/** Consumer never trusts producer counts, traversal, scope or arithmetic. No generator call occurs here. */
export function verifyLrcCertificate(raw: unknown, expectedScope: unknown, rootContractDigest: string): LrcVerificationSummary {
  const empty = zeroSummary();
  const invalid = (error: string): LrcVerificationSummary => ({ ...empty, errors: [error] });
  const parsedScope = lrcFiniteScopeSchema.safeParse(expectedScope);
  if (!parsedScope.success || !digest.safeParse(rootContractDigest).success) return invalid("INVALID_EXPECTED_SCOPE");
  const scope = parsedScope.data;
  empty.scopeDigest = lrcScopeDigest(scope); empty.totalTuples = cardinality(rootBox(scope));
  try { if (Buffer.byteLength(JSON.stringify(raw), "utf8") > LRC_LIMITS.bytes) return invalid("CERTIFICATE_BYTES_LIMIT"); } catch { return invalid("INVALID_SERIALIZATION"); }
  const parsed = lrcCertificateSchema.safeParse(raw);
  if (!parsed.success) return invalid("INVALID_CERTIFICATE_SCHEMA");
  const certificate = parsed.data;
  empty.certificateDigest = certificate.certificateDigest;
  if (certificate.rootContractDigest !== rootContractDigest || certificate.scopeDigest !== empty.scopeDigest) return invalid("ROOT_SCOPE_BINDING");
  if (lrcCertificateDigest(certificate) !== certificate.certificateDigest) return invalid("CERTIFICATE_DIGEST");
  const byId = new Map<string, LrcNode>();
  for (const node of certificate.nodes) {
    if (byId.has(node.id)) return invalid("DUPLICATE_NODE");
    byId.set(node.id, node);
    if (node.box.lower.length !== scope.axes.length || node.box.upper.length !== scope.axes.length || node.box.lower.some((lo, i) => lo > node.box.upper[i] || node.box.upper[i] >= scope.axes[i].length)) return invalid("INVALID_BOX");
  }
  const root = byId.get(certificate.rootNodeId);
  if (!root || !sameBox(root.box, rootBox(scope))) return invalid("ROOT_BOX");
  const summary = { ...empty, status: "PASS" as LrcVerificationSummary["status"], errors: [] };
  const visited = new Set<string>();
  const pending = [root];
  const M = BigInt(scope.modulus), N = BigInt(scope.totalRunners);
  function good(box: LrcBox, j: number): boolean {
    if (j < 0 || j >= scope.modulus) return false;
    for (let a = 0; a < scope.axes.length; a++) for (let i = box.lower[a]; i <= box.upper[a]; i++) {
      const r = (BigInt(j) * BigInt(scope.axes[a][i])) % M;
      if (N * (r < M - r ? r : M - r) < M) return false;
    }
    return true;
  }
  while (pending.length) {
    const node = pending.pop()!;
    if (visited.has(node.id)) return invalid("REUSED_OR_CYCLIC_NODE");
    visited.add(node.id); summary.nodeCount++;
    if (node.kind === "SPLIT") {
      if (node.axis >= scope.axes.length) return invalid("SPLIT_AXIS");
      let next = node.box.lower[node.axis];
      for (const id of node.children) {
        const child = byId.get(id);
        if (!child) return invalid("MISSING_CHILD");
        if (child.box.lower[node.axis] !== next || child.box.upper[node.axis] > node.box.upper[node.axis] || child.box.lower.some((lo, i) => i !== node.axis && (lo !== node.box.lower[i] || child.box.upper[i] !== node.box.upper[i]))) return invalid("CHILD_PARTITION");
        next = child.box.upper[node.axis] + 1;
        pending.push(child);
      }
      if (next !== node.box.upper[node.axis] + 1) return invalid("INCOMPLETE_PARTITION");
      continue;
    }
    summary.leafCount++;
    const count = cardinality(node.box);
    if (node.kind === "UNRESOLVED") { summary.unresolvedLeaves++; summary.unresolvedTuples += count; continue; }
    if (node.kind === "NO_GRID") {
      if (count !== 1) return invalid("NO_GRID_NOT_SINGLETON");
      for (let j = 0; j < scope.modulus; j++) if (good(node.box, j)) return invalid("FALSE_NO_GRID");
      summary.noGridLeaves++; summary.gridExcludedTuples++; continue;
    }
    let j: number;
    if (node.kind === "GRID") { j = node.gridIndex; summary.gridLeaves++; }
    else {
      if (node.baseDenominator !== scope.modulus || node.baseNumerator >= scope.modulus || scope.modulus % node.shiftModulus !== 0) return invalid("OFF_GRID_SHIFT");
      let q: number;
      if (node.kind === "SHIFT") { q = node.shiftIndex; summary.shiftLeaves++; if (q >= node.shiftModulus) return invalid("SHIFT_INDEX"); }
      else {
        summary.crtLeaves++;
        let product = 1;
        for (let i = 0; i < node.factors.length; i++) {
          const factor = node.factors[i]; product *= factor.modulus;
          if (factor.residue >= factor.modulus || (i > 0 && factor.modulus <= node.factors[i - 1].modulus) || node.factors.slice(0, i).some((f) => gcd(f.modulus, factor.modulus) !== 1)) return invalid("CRT_FACTORS");
        }
        if (product !== node.shiftModulus) return invalid("CRT_PRODUCT");
        q = -1;
        for (let candidate = 0; candidate < product; candidate++) if (node.factors.every((f) => candidate % f.modulus === f.residue)) { q = candidate; break; }
        if (q < 0) return invalid("CRT_NO_SOLUTION");
      }
      const numerator = BigInt(node.baseNumerator) * BigInt(node.shiftModulus) + BigInt(q) * M;
      if (numerator % BigInt(node.shiftModulus) !== BigInt(0)) return invalid("OFF_GRID_SHIFT");
      j = Number(numerator / BigInt(node.shiftModulus) % M);
    }
    if (!good(node.box, j)) return invalid("INVALID_GRID_WITNESS");
    summary.witnessTuples += count;
  }
  if (visited.size !== byId.size) return invalid("UNREACHABLE_NODE");
  summary.coveredTuples = summary.witnessTuples + summary.gridExcludedTuples;
  if (summary.coveredTuples + summary.unresolvedTuples !== summary.totalTuples) return invalid("COVERAGE_CARDINALITY");
  if (summary.unresolvedTuples) summary.status = "PARTIAL";
  return summary;
}
