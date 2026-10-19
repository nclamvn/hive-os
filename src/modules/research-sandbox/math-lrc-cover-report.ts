import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST, allikvereImportedScopes } from "./math-lrc-allikvere-report";
import { lrcCoverScopeSchema, type LrcCoverScope } from "./math-lrc-cover-bound";
import { lrcCoverEvidenceSchema, validateRetainedLrcCoverEvidence } from "./math-lrc-cover-replay";

export const ALLIKVERE_COVER_METHOD = "ALLIKVERE_COMPACT_COVER_REPORT_V1" as const;
export const ALLIKVERE_COVER_CONTRACT_DIGEST = "4712dc80fed2331ad8bc87627840205d0a31eaa97fa42f95f7d0bbde2f39ad2b";
export const ALLIKVERE_COVER_REPORT_LIMITS = Object.freeze({ rows: 8, bytes: 128 * 1024 * 1024,
  collectorMilliseconds: 120000, readMilliseconds: 10000 });
const hex = z.string().regex(/^[a-f0-9]{64}$/);
export type AllikvereCoverDescriptor = {
  id: string; kind: "ANCHORED" | "FULL"; authorMember: string; authorTerminalDigits: number[];
  sourceShardRootDigest: string; scope: LrcCoverScope; rootContractDigest: string;
};

/** Frozen before results: first five archived digits fixed in four ANCHORED
 * domains, then four FULL domains. No normalized/permuted coordinate labels. */
export function allikvereCoverScopes(): AllikvereCoverDescriptor[] {
  const parents = allikvereImportedScopes().filter((row) => row.kind === "TERMINAL_SHARD");
  if (parents.length !== 4) throw new Error("Expected four exact archived level-2 parents");
  const result: AllikvereCoverDescriptor[] = [];
  for (const kind of ["ANCHORED", "FULL"] as const) for (const parent of parents) {
    if (!parent.authorTerminalPrefix) throw new Error("Missing archived terminal digits");
    const scope = lrcCoverScopeSchema.parse({ version: 1, method: "LRC_MODULAR_BOUND_TREE_V1", totalRunners: 14,
      prime: 199, parentLevel: 2, targetLevel: 14, parentResidues: parent.scope.parentResidues,
      digitAxes: parent.authorTerminalPrefix.map((digit, axis) => kind === "ANCHORED" && axis < 5
        ? [digit] : [0, 1, 2, 3, 4, 5, 6]), sourceDigest: parent.scope.sourceDigest,
      lowerDependency: "LOWER_LRC_12_DECLARED_NOT_REPLAYED" });
    const descriptor = { id: `${parent.id}-${kind.toLowerCase()}`, kind, authorMember: parent.authorMember,
      authorTerminalDigits: [...parent.authorTerminalPrefix], sourceShardRootDigest: parent.rootContractDigest, scope };
    result.push({ ...descriptor, rootContractDigest: sha256(canonicalJson({ method: ALLIKVERE_COVER_METHOD,
      contractDigest: ALLIKVERE_COVER_CONTRACT_DIGEST, sourceManifestDigest: ALLIKVERE_SOURCE_DIGEST, ...descriptor })) });
  }
  return result;
}
const descriptorSchema = z.object({ id: z.string().min(1).max(80), kind: z.enum(["ANCHORED", "FULL"]),
  authorMember: z.string().max(128), authorTerminalDigits: z.array(z.number().int().min(0).max(6)).length(13),
  sourceShardRootDigest: hex, scope: lrcCoverScopeSchema, rootContractDigest: hex }).strict();
const rowSchema = descriptorSchema.extend({ evidence: lrcCoverEvidenceSchema }).strict();
export const allikvereCoverReportSchema = z.object({ version: z.literal(1), method: z.literal(ALLIKVERE_COVER_METHOD),
  status: z.enum(["COMPLETE", "PARTIAL"]), generatedAt: z.string().datetime(), contractDigest: hex,
  sourceManifestDigest: hex, archiveWholeVerified: z.literal(false), globalVerdict: z.literal("NOT_ESTABLISHED"),
  lowerDependency: z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED"),
  uncoveredObligations: z.array(z.enum(ALLIKVERE_GLOBAL_GAPS)).length(5), rows: z.array(rowSchema).length(8), reportDigest: hex }).strict();
export type AllikvereCoverReport = z.infer<typeof allikvereCoverReportSchema>;
export function allikvereCoverReportDigest(raw: Omit<AllikvereCoverReport, "reportDigest"> | AllikvereCoverReport): string {
  const { reportDigest: _digest, ...body } = raw as AllikvereCoverReport; void _digest;
  return sha256(canonicalJson(body));
}
/** Bounded pure retained admission. Never invokes a producer, Python, source
 * fetch or model. Normal page authentication is outside this arithmetic seam. */
export function validateRetainedAllikvereCoverReport(raw: unknown): AllikvereCoverReport | null {
  const started = performance.now();
  const remaining = () => Math.floor(ALLIKVERE_COVER_REPORT_LIMITS.readMilliseconds - (performance.now() - started));
  try {
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > ALLIKVERE_COVER_REPORT_LIMITS.bytes || remaining() <= 0) return null;
    const report = allikvereCoverReportSchema.parse(raw);
    if (report.contractDigest !== ALLIKVERE_COVER_CONTRACT_DIGEST || report.sourceManifestDigest !== ALLIKVERE_SOURCE_DIGEST ||
      report.reportDigest !== allikvereCoverReportDigest(report) ||
      canonicalJson(report.uncoveredObligations) !== canonicalJson(ALLIKVERE_GLOBAL_GAPS) || remaining() <= 0) return null;
    const expected = allikvereCoverScopes();
    let complete = true;
    for (let index = 0; index < 8; index++) {
      const { evidence, ...descriptor } = report.rows[index];
      if (remaining() <= 0 || canonicalJson(descriptor) !== canonicalJson(expected[index]) ||
        !validateRetainedLrcCoverEvidence(evidence, descriptor.scope, descriptor.rootContractDigest, { timeoutMs: remaining() })) return null;
      if (evidence.primary.totalTuples !== (descriptor.kind === "ANCHORED" ? "5764801" : "96889010407")) return null;
      if (evidence.primary.status !== "COMPLETE") complete = false;
    }
    if (remaining() <= 0 || report.status !== (complete ? "COMPLETE" : "PARTIAL")) return null;
    return report;
  } catch { return null; }
}
