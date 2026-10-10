import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS } from "./math-lrc-allikvere-report";
import { lrcCoverScopeSchema, lrcCoverScopeDigest, type LrcCoverScope, type LrcCoverNode } from "./math-lrc-cover-bound";
import { lrcCoverEvidenceSchema, validateRetainedLrcCoverEvidence } from "./math-lrc-cover-replay";
import { validateRetainedAllikvereCoverReport, type AllikvereCoverReport } from "./math-lrc-cover-report";

export const LRC_FRONTIER_METHOD = "LRC_FRONTIER_COMPOSITION_V1" as const;
export const LRC_FRONTIER_CONTRACT_DIGEST = "04e2cb6a61cb254341e9bea42567f560018d51d39c9147c332f5795033e34def";
export const LRC_FRONTIER_BASE = Object.freeze({ path: "docs/research/lrc-allikvere-p199/retained-cover-report.json",
  rawSha256: "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1",
  reportDigest: "97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac",
  contractDigest: "4712dc80fed2331ad8bc87627840205d0a31eaa97fa42f95f7d0bbde2f39ad2b" });
export const LRC_FRONTIER_LIMITS = Object.freeze({ jobs: 8, compositionBytes: 67108864,
  retainedReportBytes: 134217728, pureCompositionMs: 30000, independentWrapperMs: 40000,
  independentStdoutBytes: 1048576, collectorMs: 120000 });
const hex = z.string().regex(/^[a-f0-9]{64}$/);
const identifier = z.string().regex(/^[A-Za-z0-9_-]{1,80}$/);
const prefix = z.array(z.number().int().min(0).max(6)).max(13);
const decimal = z.string().regex(/^(0|[1-9][0-9]{0,10})$/).refine((n) => BigInt(n) <= BigInt("96889010407"));
const dependency = z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED");
const role = z.enum(["closure-control", "strategic-mass"]);
export const lrcResumeJobSchema = z.object({ parentId: identifier, role, nodeId: identifier, prefix,
  totalTuples: decimal, parentRootContractDigest: hex, parentScopeDigest: hex, parentCertificateDigest: hex,
  parentEvidenceDigest: hex, targetNodeDigest: hex, childScope: lrcCoverScopeSchema,
  childRootContractDigest: hex, jobDigest: hex }).strict();
export type LrcResumeJob = z.infer<typeof lrcResumeJobSchema>;
export const lrcResumePlanSchema = z.object({ version: z.literal(1), method: z.literal("LRC_FRONTIER_PLAN_V1"),
  contractDigest: hex, baseReportDigest: hex, baseRawSha256: hex, sourceManifestDigest: hex,
  jobs: z.array(lrcResumeJobSchema).length(8), planDigest: hex }).strict();
export type LrcResumePlan = z.infer<typeof lrcResumePlanSchema>;
export const lrcFrontierPacketSchema = z.object({ version: z.literal(1), method: z.literal(LRC_FRONTIER_METHOD),
  contractDigest: hex, baseReportDigest: hex, plan: lrcResumePlanSchema,
  children: z.array(z.object({ jobDigest: hex, evidence: lrcCoverEvidenceSchema }).strict()).length(8), packetDigest: hex }).strict();
export type LrcFrontierPacket = z.infer<typeof lrcFrontierPacketSchema>;
const countsSchema = z.object({ witnessTuples: decimal, gcdTuples: decimal, survivorTuples: decimal, unresolvedTuples: decimal }).strict();
export const lrcResumeFrontierSchema = z.object({ origin: z.enum(["BASE", "CHILD"]), jobDigest: hex.nullable(),
  certificateDigest: hex, nodeId: identifier, prefix, totalTuples: decimal }).strict();
export type LrcResumeFrontier = z.infer<typeof lrcResumeFrontierSchema>;
export const lrcFrontierRowSummarySchema = z.object({ parentId: identifier, status: z.enum(["COMPLETE", "PARTIAL"]),
  totalTuples: decimal, previous: countsSchema, current: countsSchema,
  delta: z.object({ witnessTuples: decimal, gcdTuples: decimal, survivorTuples: decimal, classifiedTuples: decimal }).strict(),
  remainingFrontier: z.array(lrcResumeFrontierSchema).max(40000) }).strict();
export const lrcFrontierSummarySchema = z.object({ version: z.literal(1), method: z.literal(LRC_FRONTIER_METHOD),
  status: z.enum(["COMPLETE", "PARTIAL"]), baseReportDigest: hex, planDigest: hex, packetDigest: hex,
  globalVerdict: z.literal("NOT_ESTABLISHED"), lowerDependency: dependency,
  uncoveredObligations: z.array(z.enum(ALLIKVERE_GLOBAL_GAPS)).length(5), rows: z.array(lrcFrontierRowSummarySchema).length(4) }).strict();
export type LrcFrontierSummary = z.infer<typeof lrcFrontierSummarySchema>;

function unsignedDigest(raw: unknown, field: string): string {
  const body = { ...(raw as Record<string, unknown>) }; delete body[field]; return sha256(canonicalJson(body));
}
export const lrcResumeJobDigest = (raw: LrcResumeJob | Omit<LrcResumeJob, "jobDigest">) => unsignedDigest(raw, "jobDigest");
export const lrcResumePlanDigest = (raw: LrcResumePlan | Omit<LrcResumePlan, "planDigest">) => unsignedDigest(raw, "planDigest");
export const lrcFrontierPacketDigest = (raw: LrcFrontierPacket | Omit<LrcFrontierPacket, "packetDigest">) => unsignedDigest(raw, "packetDigest");
export const lrcFrontierOutputBytes = (summary: LrcFrontierSummary): string =>
  `${canonicalJson({ method: "LRC_FRONTIER_PYTHON_COMPOSITION_V1", summary: lrcFrontierSummarySchema.parse(summary) })}\n`;

function cardinality(scope: LrcCoverScope, depth = 0): bigint {
  return scope.digitAxes.slice(depth).reduce((n, axis) => n * BigInt(axis.length), BigInt(1));
}
function lexical(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
}
/** Original coordinate labels are immutable: fixed prefix axes become singleton
 * axes, not a shortened or reordered child problem. */
export function deriveResumeChildScope(rawScope: LrcCoverScope, rawPrefix: number[]): LrcCoverScope {
  const scope = lrcCoverScopeSchema.parse(rawScope), assigned = prefix.parse(rawPrefix);
  if (assigned.some((digit, axis) => !scope.digitAxes[axis].includes(digit))) throw new Error("Illegal resume prefix");
  return lrcCoverScopeSchema.parse({ ...scope,
    digitAxes: scope.digitAxes.map((axis, index) => index < assigned.length ? [assigned[index]] : [...axis]) });
}
/** Root commits to the whole selected parent, canonical leaf, role, premise and
 * exact child domain. The base raw-byte pin is verified by the file collector;
 * pure admission separately requires the immutable canonical report digest. */
export function deriveResumeChildRoot(job: Omit<LrcResumeJob, "jobDigest" | "childRootContractDigest">): string {
  return sha256(canonicalJson({ method: "LRC_FRONTIER_CHILD_ROOT_V1", contractDigest: LRC_FRONTIER_CONTRACT_DIGEST,
    baseReportDigest: LRC_FRONTIER_BASE.reportDigest, baseRawSha256: LRC_FRONTIER_BASE.rawSha256, ...job }));
}
function validatedBase(raw: unknown): AllikvereCoverReport {
  const base = validateRetainedAllikvereCoverReport(raw);
  if (!base || base.reportDigest !== LRC_FRONTIER_BASE.reportDigest || base.contractDigest !== LRC_FRONTIER_BASE.contractDigest) {
    throw new Error("Invalid or stale immutable frontier base");
  }
  return base;
}
function planFromValidatedBase(base: AllikvereCoverReport): LrcResumePlan {
  const jobs: LrcResumeJob[] = [];
  for (const row of base.rows.filter((row) => row.kind === "FULL")) {
    const leaves = row.evidence.certificate.nodes.filter((node) => node.kind === "UNRESOLVED");
    if (leaves.length < 2) throw new Error("Two distinct resume targets required");
    const closure = [...leaves].sort((a, b) => b.prefix.length - a.prefix.length || lexical(a.prefix, b.prefix))[0];
    const mass = leaves.filter((leaf) => leaf.id !== closure.id).sort((a, b) => {
      const difference = cardinality(row.scope, b.prefix.length) - cardinality(row.scope, a.prefix.length);
      return difference > BigInt(0) ? 1 : difference < BigInt(0) ? -1 : lexical(a.prefix, b.prefix);
    })[0];
    for (const [role, target] of [["closure-control", closure], ["strategic-mass", mass]] as const) {
      const binding = { parentId: row.id, role, nodeId: target.id, prefix: [...target.prefix],
        totalTuples: cardinality(row.scope, target.prefix.length).toString(), parentRootContractDigest: row.rootContractDigest,
        parentScopeDigest: lrcCoverScopeDigest(row.scope), parentCertificateDigest: row.evidence.certificate.certificateDigest,
        parentEvidenceDigest: row.evidence.evidenceDigest, targetNodeDigest: sha256(canonicalJson(target)),
        childScope: deriveResumeChildScope(row.scope, target.prefix) };
      const body = { ...binding, childRootContractDigest: deriveResumeChildRoot(binding) };
      jobs.push({ ...body, jobDigest: lrcResumeJobDigest(body) });
    }
  }
  const body = { version: 1 as const, method: "LRC_FRONTIER_PLAN_V1" as const, contractDigest: LRC_FRONTIER_CONTRACT_DIGEST,
    baseReportDigest: base.reportDigest, baseRawSha256: LRC_FRONTIER_BASE.rawSha256, sourceManifestDigest: base.sourceManifestDigest, jobs };
  return lrcResumePlanSchema.parse({ ...body, planDigest: lrcResumePlanDigest(body) });
}
/** Sealed selection is independent of any child outcome. No producer or replay
 * process is invoked here; only retained bounded admission. */
export function selectResumePlan(base: unknown): LrcResumePlan { return planFromValidatedBase(validatedBase(base)); }

/** A child prefix already names original axes. For early unresolved child
 * leaves, the domain still fixes the entire target prefix via singleton axes. */
export function mapResumeChildPrefix(target: number[], child: number[]): number[] {
  prefix.parse(target); prefix.parse(child);
  if (child.slice(0, Math.min(child.length, target.length)).some((digit, i) => digit !== target[i])) {
    throw new Error("Child prefix escaped parent target");
  }
  return [...(child.length < target.length ? target : child)];
}
function frontier(node: LrcCoverNode, scope: LrcCoverScope, certificateDigest: string,
  job: LrcResumeJob | null): LrcResumeFrontier {
  const mapped = job ? mapResumeChildPrefix(job.prefix, node.prefix) : [...node.prefix];
  return { origin: job ? "CHILD" : "BASE", jobDigest: job?.jobDigest ?? null, certificateDigest,
    nodeId: node.id, prefix: mapped, totalTuples: cardinality(scope, node.prefix.length).toString() };
}
/** Composition proves a disjoint replacement of validated unknown leaves, not
 * a global theorem. All original established leaves remain authoritative. */
export function verifyResumeComposition(rawPacket: unknown, rawBase: unknown,
  options: { timeoutMs?: number } = {}): LrcFrontierSummary | null {
  const started = performance.now();
  try {
    const timeoutMs = z.object({ timeoutMs: z.number().int().min(0).max(30000) }).strict()
      .parse({ timeoutMs: 30000, ...options }).timeoutMs;
    const remaining = () => Math.floor(timeoutMs - (performance.now() - started));
    if (remaining() <= 0 || Buffer.byteLength(JSON.stringify(rawPacket), "utf8") > LRC_FRONTIER_LIMITS.compositionBytes || remaining() <= 0) return null;
    const packet = lrcFrontierPacketSchema.parse(rawPacket);
    if (remaining() <= 0) return null;
    const base = validatedBase(rawBase); // once per admission, never once per job
    if (remaining() <= 0) return null;
    const expected = planFromValidatedBase(base);
    if (packet.contractDigest !== LRC_FRONTIER_CONTRACT_DIGEST || packet.baseReportDigest !== base.reportDigest ||
      packet.packetDigest !== lrcFrontierPacketDigest(packet) || canonicalJson(packet.plan) !== canonicalJson(expected)) return null;
    const rows: LrcFrontierSummary["rows"] = [];
    const full = base.rows.filter((row) => row.kind === "FULL");
    for (let rowIndex = 0; rowIndex < full.length; rowIndex++) {
      const parent = full[rowIndex], original = parent.evidence.primary;
      const previous = { witnessTuples: original.witnessTuples, gcdTuples: original.gcdTuples,
        survivorTuples: original.survivorTuples, unresolvedTuples: original.unresolvedTuples };
      let witness = BigInt(previous.witnessTuples), gcd = BigInt(previous.gcdTuples),
        survivor = BigInt(previous.survivorTuples), unresolved = BigInt(previous.unresolvedTuples);
      const selected = expected.jobs.slice(rowIndex * 2, rowIndex * 2 + 2);
      const targets = new Set(selected.map((job) => job.nodeId));
      const remainingFrontier = parent.evidence.certificate.nodes.filter((node) => node.kind === "UNRESOLVED" && !targets.has(node.id))
        .map((node) => frontier(node, parent.scope, parent.evidence.certificate.certificateDigest, null));
      for (let offset = 0; offset < 2; offset++) {
        const job = selected[offset], child = packet.children[rowIndex * 2 + offset];
        if (remaining() <= 0 || child.jobDigest !== job.jobDigest ||
          !validateRetainedLrcCoverEvidence(child.evidence, job.childScope, job.childRootContractDigest,
            { timeoutMs: Math.min(10000, remaining()) })) return null;
        const summary = child.evidence.primary;
        if (summary.totalTuples !== job.totalTuples || cardinality(job.childScope).toString() !== job.totalTuples) return null;
        witness += BigInt(summary.witnessTuples); gcd += BigInt(summary.gcdTuples); survivor += BigInt(summary.survivorTuples);
        unresolved += BigInt(summary.unresolvedTuples) - BigInt(job.totalTuples);
        for (const node of child.evidence.certificate.nodes) if (node.kind === "UNRESOLVED") {
          const leaf = frontier(node, job.childScope, child.evidence.certificate.certificateDigest, job);
          if (cardinality(parent.scope, leaf.prefix.length).toString() !== leaf.totalTuples) return null;
          remainingFrontier.push(leaf);
        }
      }
      remainingFrontier.sort((a, b) => lexical(a.prefix, b.prefix) || (a.nodeId < b.nodeId ? -1 : a.nodeId > b.nodeId ? 1 : 0));
      // Consecutive sorted prefixes suffice to check the entire antichain:
      // every descendant of a prefix forms one contiguous lexical interval.
      for (let index = 1; index < remainingFrontier.length; index++) {
        const before = remainingFrontier[index - 1].prefix, after = remainingFrontier[index].prefix;
        if (before.length <= after.length && before.every((digit, axis) => after[axis] === digit)) return null;
      }
      if (unresolved < BigInt(0) || witness + gcd + survivor + unresolved !== BigInt(original.totalTuples) ||
        remainingFrontier.reduce((sum, leaf) => sum + BigInt(leaf.totalTuples), BigInt(0)) !== unresolved) return null;
      const current = { witnessTuples: witness.toString(), gcdTuples: gcd.toString(), survivorTuples: survivor.toString(), unresolvedTuples: unresolved.toString() };
      const dw = witness - BigInt(previous.witnessTuples), dg = gcd - BigInt(previous.gcdTuples), ds = survivor - BigInt(previous.survivorTuples);
      rows.push({ parentId: parent.id, status: unresolved === BigInt(0) ? "COMPLETE" : "PARTIAL", totalTuples: original.totalTuples,
        previous, current, delta: { witnessTuples: dw.toString(), gcdTuples: dg.toString(), survivorTuples: ds.toString(), classifiedTuples: (dw + dg + ds).toString() }, remainingFrontier });
      if (remaining() <= 0) return null;
    }
    const result = lrcFrontierSummarySchema.parse({ version: 1, method: LRC_FRONTIER_METHOD,
      status: rows.every((row) => row.status === "COMPLETE") ? "COMPLETE" : "PARTIAL", baseReportDigest: base.reportDigest,
      planDigest: expected.planDigest, packetDigest: packet.packetDigest, globalVerdict: "NOT_ESTABLISHED",
      lowerDependency: base.lowerDependency, uncoveredObligations: [...ALLIKVERE_GLOBAL_GAPS], rows });
    lrcFrontierOutputBytes(result); // final serialization included in observed clock
    return remaining() > 0 ? result : null;
  } catch { return null; }
}
