import { performance } from "node:perf_hooks";
import { z } from "zod";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import { ALLIKVERE_GLOBAL_GAPS, ALLIKVERE_SOURCE_DIGEST } from "./math-lrc-allikvere-report";
import { lrcUnitActionEvidenceSchema, validateRetainedLrcUnitActionEvidence } from "./math-lrc-unit-replay";

export const ALLIKVERE_UNIT_REPORT_METHOD = "ALLIKVERE_UNIT_ACTION_REPORT_V1" as const;
export const ALLIKVERE_UNIT_CONTRACT_DIGEST = "93acc34e6cd0ca009fc9e6a7ab65df0ec801b0cf956874c355ee861967a255e9";
export const ALLIKVERE_UNIT_SOURCES = Object.freeze({
  basePath: "docs/research/lrc-allikvere-p199/retained-cover-report.json",
  baseRawSha256: "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1",
  baseReportDigest: "97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac",
  frontierPath: "docs/research/lrc-allikvere-p199/retained-frontier-report.json",
  frontierRawSha256: "a609fcf1fdd6c7d225568d1d830b6a09d069a8657fec7f5bc422f4d588865268",
  frontierReportDigest: "e1f1825b817e21b1672e64e025a1c4790d4e1518b94a9e1ab866cb757604f420",
});
export const ALLIKVERE_UNIT_REPORT_LIMITS = Object.freeze({ collectorMs: 120000, readMs: 60000,
  reportBytes: 1048576, inputBytes: 83886080 });
const hex = z.string().regex(/^[a-f0-9]{64}$/);
export const allikvereUnitReportSchema = z.object({
  version: z.literal(1), method: z.literal(ALLIKVERE_UNIT_REPORT_METHOD),
  status: z.enum(["COMPLETE", "PARTIAL"]), researchClassification: z.literal("PARTIAL"),
  generatedAt: z.string().datetime(), contractDigest: hex,
  baseReportRawSha256: hex, baseReportDigest: hex, frontierReportRawSha256: hex, frontierReportDigest: hex,
  sourceManifestDigest: hex, loopKind: z.literal("LOCAL_COMPUTATIONAL_PROOF_REUSE"),
  phases: z.tuple([z.literal("DERIVE"), z.literal("TRANSPORT"), z.literal("INDEPENDENT_REPLAY"), z.literal("UNION"), z.literal("STOP")]),
  archiveWholeVerified: z.literal(false), globalVerdict: z.literal("NOT_ESTABLISHED"),
  lowerDependency: z.literal("LOWER_LRC_12_DECLARED_NOT_REPLAYED"),
  uncoveredObligations: z.array(z.enum(ALLIKVERE_GLOBAL_GAPS)).length(5),
  evidence: lrcUnitActionEvidenceSchema, reportDigest: hex,
}).strict();
export type AllikvereUnitReport = z.infer<typeof allikvereUnitReportSchema>;
export function allikvereUnitReportDigest(raw: Omit<AllikvereUnitReport, "reportDigest"> | AllikvereUnitReport): string {
  const { reportDigest: _digest, ...body } = raw as AllikvereUnitReport; void _digest;
  return sha256(canonicalJson(body));
}

/** Reconstruct retained arithmetic only. No producer, subprocess, research fetch,
 * model, filesystem read or cross-request admission cache is used on this path. */
export function validateRetainedAllikvereUnitReport(raw: unknown, base: unknown, frontier: unknown,
  options: { timeoutMs?: number } = {}): AllikvereUnitReport | null {
  const started = performance.now();
  const budget = options.timeoutMs ?? ALLIKVERE_UNIT_REPORT_LIMITS.readMs;
  if (!Number.isFinite(budget) || budget < 0 || budget > ALLIKVERE_UNIT_REPORT_LIMITS.readMs) return null;
  const remaining = () => Math.floor(budget - (performance.now() - started));
  try {
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > ALLIKVERE_UNIT_REPORT_LIMITS.reportBytes || remaining() <= 0) return null;
    const report = allikvereUnitReportSchema.parse(raw);
    if (report.contractDigest !== ALLIKVERE_UNIT_CONTRACT_DIGEST ||
      report.baseReportRawSha256 !== ALLIKVERE_UNIT_SOURCES.baseRawSha256 ||
      report.baseReportDigest !== ALLIKVERE_UNIT_SOURCES.baseReportDigest ||
      report.frontierReportRawSha256 !== ALLIKVERE_UNIT_SOURCES.frontierRawSha256 ||
      report.frontierReportDigest !== ALLIKVERE_UNIT_SOURCES.frontierReportDigest ||
      report.sourceManifestDigest !== ALLIKVERE_SOURCE_DIGEST ||
      report.status !== report.evidence.primary.status ||
      report.reportDigest !== allikvereUnitReportDigest(report) ||
      canonicalJson(report.uncoveredObligations) !== canonicalJson(ALLIKVERE_GLOBAL_GAPS) || remaining() <= 0) return null;
    if (!validateRetainedLrcUnitActionEvidence(report.evidence, base, frontier, { timeoutMs: remaining() }) || remaining() <= 0) return null;
    return report;
  } catch { return null; }
}
