import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST } from "./math-lrc-allikvere-report";
import { lrcFrontierEvidenceSchema, validateRetainedLrcFrontierEvidence } from "./math-lrc-frontier-replay";

export const ALLIKVERE_FRONTIER_REPORT_METHOD = "ALLIKVERE_FRONTIER_CHECKPOINT_REPORT_V1" as const;
export const ALLIKVERE_FRONTIER_CONTRACT_DIGEST = "04e2cb6a61cb254341e9bea42567f560018d51d39c9147c332f5795033e34def";
export const ALLIKVERE_FRONTIER_BASE_RAW_SHA256 = "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1";
export const ALLIKVERE_FRONTIER_BASE_REPORT_DIGEST = "97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac";
export const ALLIKVERE_FRONTIER_REPORT_LIMITS = Object.freeze({ collectorMs: 120000, readMs: 30000,
  reportBytes: 128 * 1024 * 1024, packetBytes: 64 * 1024 * 1024, jobs: 8 });
const hex = z.string().regex(/^[a-f0-9]{64}$/);
export const allikvereFrontierReportSchema = z.object({
  version: z.literal(1), method: z.literal(ALLIKVERE_FRONTIER_REPORT_METHOD),
  status: z.enum(["COMPLETE", "PARTIAL"]), generatedAt: z.string().datetime(), contractDigest: hex,
  baseReportRawSha256: hex, baseReportDigest: hex, sourceManifestDigest: hex,
  loopKind: z.literal("LOCAL_COMPUTATIONAL_TOOL_AGENT_LOOP"),
  phases: z.tuple([z.literal("CHOOSE"), z.literal("EXECUTE"), z.literal("INDEPENDENT_REPLAY"), z.literal("COMPOSE"), z.literal("STOP")]),
  archiveWholeVerified: z.literal(false), globalVerdict: z.literal("NOT_ESTABLISHED"),
  lowerDependency: z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED"),
  uncoveredObligations: z.array(z.enum(ALLIKVERE_GLOBAL_GAPS)).length(5),
  evidence: lrcFrontierEvidenceSchema, reportDigest: hex,
}).strict();
export type AllikvereFrontierReport = z.infer<typeof allikvereFrontierReportSchema>;
export function allikvereFrontierReportDigest(raw: Omit<AllikvereFrontierReport, "reportDigest"> | AllikvereFrontierReport): string {
  const { reportDigest: _digest, ...body } = raw as AllikvereFrontierReport; void _digest;
  return sha256(canonicalJson(body));
}

/** Retained arithmetic admission only. No coordinator, producer, subprocess,
 * external source fetch or model is dispatched by this read path. */
export function validateRetainedAllikvereFrontierReport(raw: unknown, immutableBase: unknown): AllikvereFrontierReport | null {
  const started = performance.now();
  const remaining = () => Math.floor(ALLIKVERE_FRONTIER_REPORT_LIMITS.readMs - (performance.now() - started));
  try {
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > ALLIKVERE_FRONTIER_REPORT_LIMITS.reportBytes || remaining() <= 0) return null;
    const report = allikvereFrontierReportSchema.parse(raw);
    if (report.contractDigest !== ALLIKVERE_FRONTIER_CONTRACT_DIGEST ||
      report.baseReportRawSha256 !== ALLIKVERE_FRONTIER_BASE_RAW_SHA256 ||
      report.baseReportDigest !== ALLIKVERE_FRONTIER_BASE_REPORT_DIGEST ||
      report.sourceManifestDigest !== ALLIKVERE_SOURCE_DIGEST ||
      report.reportDigest !== allikvereFrontierReportDigest(report) ||
      canonicalJson(report.uncoveredObligations) !== canonicalJson(ALLIKVERE_GLOBAL_GAPS) || remaining() <= 0) return null;
    if (!validateRetainedLrcFrontierEvidence(report.evidence, immutableBase, { timeoutMs: remaining() }) ||
      report.status !== report.evidence.primary.status || remaining() <= 0) return null;
    return report;
  } catch { return null; }
}
