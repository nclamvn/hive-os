import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";

export const FORMAL_ALIGNMENT_CHECKS = [
  "DOMAIN_AND_QUANTIFIERS",
  "ASSUMPTIONS_AND_DEFINITIONS",
  "CONCLUSION_EQUIVALENCE",
  "BOUNDARY_AND_NOTATION",
] as const;

const alignmentChecksSchema = z.array(z.object({
  criterion: z.enum(FORMAL_ALIGNMENT_CHECKS),
  verdict: z.enum(["ALIGNED", "ISSUE", "UNRESOLVED"]),
  note: z.string().trim().min(20).max(1_000),
}).strict()).length(FORMAL_ALIGNMENT_CHECKS.length);

export const formalAlignmentInputSchema = z.object({
  formalAttemptId: z.string().uuid(),
  checks: alignmentChecksSchema,
  rationale: z.string().trim().min(40).max(4_000),
  confirmed: z.boolean(),
}).strict().superRefine((value, ctx) => {
  for (const criterion of FORMAL_ALIGNMENT_CHECKS) {
    if (value.checks.filter((check) => check.criterion === criterion).length !== 1) {
      ctx.addIssue({ code: "custom", message: `Exactly one alignment check is required for ${criterion}` });
    }
  }
});

export type FormalAlignmentInput = z.infer<typeof formalAlignmentInputSchema>;

export const formalAlignmentReportSchema = z.object({
  version: z.literal(1),
  source: z.literal("AUTHENTICATED_OPERATOR"),
  status: z.enum(["OPERATOR_ALIGNED", "ISSUE_FOUND", "UNRESOLVED"]),
  checks: alignmentChecksSchema,
  rationale: z.string().trim().min(40).max(4_000),
  confirmed: z.boolean(),
  evidenceCeiling: z.literal("LOCAL_SEMANTIC_ATTESTATION_NOT_PUBLICATION_CERTIFICATE"),
}).strict().superRefine((value, ctx) => {
  for (const criterion of FORMAL_ALIGNMENT_CHECKS) {
    if (value.checks.filter((check) => check.criterion === criterion).length !== 1) {
      ctx.addIssue({ code: "custom", message: `Exactly one alignment check is required for ${criterion}` });
    }
  }
  const expected = value.checks.some((check) => check.verdict === "ISSUE") ? "ISSUE_FOUND"
    : value.checks.every((check) => check.verdict === "ALIGNED") && value.confirmed ? "OPERATOR_ALIGNED" : "UNRESOLVED";
  if (value.status !== expected) ctx.addIssue({ code: "custom", message: "Alignment status must follow the checklist" });
});

export function deriveFormalAlignmentReport(input: FormalAlignmentInput) {
  const checked = formalAlignmentInputSchema.parse(input);
  const status = checked.checks.some((check) => check.verdict === "ISSUE") ? "ISSUE_FOUND"
    : checked.checks.every((check) => check.verdict === "ALIGNED") && checked.confirmed
      ? "OPERATOR_ALIGNED" : "UNRESOLVED";
  return formalAlignmentReportSchema.parse({ version: 1, source: "AUTHENTICATED_OPERATOR", status,
    checks: checked.checks, rationale: checked.rationale, confirmed: checked.confirmed,
    evidenceCeiling: "LOCAL_SEMANTIC_ATTESTATION_NOT_PUBLICATION_CERTIFICATE" });
}

export function digestFormalAlignmentRecord(input: {
  formalAttemptId: string; contractDigest: string; targetDigest: string; sourceDigest: string;
  replayDigest: string; reviewerMembershipId: string; report: z.infer<typeof formalAlignmentReportSchema>;
}) {
  return sha256(canonicalJson(input));
}

/** This validates provenance, not the truth of the human review. */
export function validateRecordedFormalAlignment(input: {
  record: { formalAttemptId: string; contractDigest: string; targetDigest: string;
    sourceDigest: string; replayDigest: string; reviewerMembershipId: string;
    report: unknown; reportDigest: string } | null;
  formalAttempt: { id: string; contractDigest: string; targetDigest: string; proofSourceDigest: string;
    replay?: { resultDigest: string } | null };
}) {
  const row = input.record;
  if (!row || row.formalAttemptId !== input.formalAttempt.id ||
    row.contractDigest !== input.formalAttempt.contractDigest ||
    row.targetDigest !== input.formalAttempt.targetDigest ||
    row.sourceDigest !== input.formalAttempt.proofSourceDigest ||
    row.replayDigest !== input.formalAttempt.replay?.resultDigest) return null;
  const report = formalAlignmentReportSchema.safeParse(row.report);
  if (!report.success || digestFormalAlignmentRecord({
    formalAttemptId: row.formalAttemptId, contractDigest: row.contractDigest,
    targetDigest: row.targetDigest, sourceDigest: row.sourceDigest,
    replayDigest: row.replayDigest, reviewerMembershipId: row.reviewerMembershipId,
    report: report.data,
  }) !== row.reportDigest) return null;
  return report.data;
}
