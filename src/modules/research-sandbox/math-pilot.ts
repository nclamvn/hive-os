import { createHash } from "node:crypto";

import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";



const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const mathPilotRequestSchema = z.discriminatedUnion("caseType", [
  z.object({ caseType: z.literal("CALIBRATION_PROOF") }).strict(),
  z.object({ caseType: z.literal("CALIBRATION_COUNTEREXAMPLE") }).strict(),
  z.object({
    caseType: z.literal("OPEN"),
    statement: boundedText(4_000),
    definitions: boundedText(1_000),
    assumptions: boundedText(1_000),
    falsificationCriterion: boundedText(1_000),
    successCriterion: boundedText(1_000),
    exclusions: boundedText(1_000),
  }).strict(),
]);

export const mathPilotConclusionSchema = z.enum([
  "SUPPORTED_ARGUMENT",
  "VALID_COUNTEREXAMPLE",
  "PARTIAL",
  "INCONCLUSIVE",
]);

export const MATH_REVIEW_CRITERIA = [
  "STATEMENT_FIDELITY",
  "DEFINITIONS_AND_DOMAIN",
  "ARGUMENT_OR_WITNESS",
  "ADVERSARIAL_CHECK",
  "EVIDENCE_BOUNDARY",
] as const;

const mathReviewCheckSchema = z.object({
  criterion: z.enum(MATH_REVIEW_CRITERIA),
  verdict: z.enum(["VERIFIED", "ISSUE_FOUND", "NOT_CHECKED"]),
  note: z.string().trim().min(12).max(1_000),
}).strict();

export const mathReviewChecklistSchema = z.object({
  version: z.literal(1),
  independentVerification: z.literal(true),
  checks: z.array(mathReviewCheckSchema).length(MATH_REVIEW_CRITERIA.length),
}).strict().superRefine((value, context) => {
  for (const criterion of MATH_REVIEW_CRITERIA) {
    if (value.checks.filter((check) => check.criterion === criterion).length !== 1) {
      context.addIssue({ code: "custom", message: `Exactly one check is required for ${criterion}` });
    }
  }
});

export type MathReviewChecklist = z.infer<typeof mathReviewChecklistSchema>;

export function digestMathReviewChecklist(checklist: MathReviewChecklist): string {
  return createHash("sha256").update(canonicalJson(mathReviewChecklistSchema.parse(checklist))).digest("hex");
}

export const mathPilotAssessmentSchema = z.object({
  caseId: z.string().trim().min(1).max(160),
  conclusion: mathPilotConclusionSchema,
  rationale: boundedText(4_000),
  verificationNotes: boundedText(8_000),
  reviewChecklist: mathReviewChecklistSchema,
}).strict().superRefine((value, context) => {
  if (
    (value.conclusion === "SUPPORTED_ARGUMENT" || value.conclusion === "VALID_COUNTEREXAMPLE") &&
    value.reviewChecklist.checks.some((check) => check.verdict !== "VERIFIED")
  ) {
    context.addIssue({ code: "custom", message: "A positive conclusion requires all five checks to be verified" });
  }
});

export const mathPilotContractSchema = z.object({
  version: z.literal(1),
  caseType: z.enum(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE", "OPEN"]),
  statement: boundedText(4_000),
  definitions: boundedText(1_000),
  assumptions: boundedText(1_000),
  falsificationCriterion: boundedText(1_000),
  successCriterion: boundedText(1_000),
  exclusions: boundedText(1_000),
}).strict();

export type MathPilotContract = z.infer<typeof mathPilotContractSchema>;
export type MathPilotRequest = z.infer<typeof mathPilotRequestSchema>;

const calibrationProof = mathPilotContractSchema.parse({
  version: 1,
  caseType: "CALIBRATION_PROOF",
  statement: "For every integer n, if n is even, then n squared is even.",
  definitions: "An integer is even exactly when it equals 2k for some integer k.",
  assumptions: "n ranges over all integers; ordinary integer arithmetic applies.",
  falsificationCriterion: "A single even integer whose square is odd would refute the statement.",
  successCriterion: "Either give a general proof or a checked counterexample; otherwise report uncertainty.",
  exclusions: "Do not present a finite sample, a source quotation, or CAS output alone as a general proof.",
});

const calibrationCounterexample = mathPilotContractSchema.parse({
  version: 1,
  caseType: "CALIBRATION_COUNTEREXAMPLE",
  statement: "Every prime number is odd.",
  definitions: "A prime is an integer greater than 1 with exactly two positive divisors.",
  assumptions: "The natural numbers use the standard definition of primality.",
  falsificationCriterion: "One prime that is not odd would refute the statement.",
  successCriterion: "Either give a general proof or a checked counterexample; otherwise report uncertainty.",
  exclusions: "Do not silently change the domain to odd primes or primes greater than 2.",
});

export const MATH_PILOT_CALIBRATIONS = {
  CALIBRATION_PROOF: calibrationProof,
  CALIBRATION_COUNTEREXAMPLE: calibrationCounterexample,
} as const;

export const MATH_PILOT_EXPECTED = {
  CALIBRATION_PROOF: "SUPPORTED_ARGUMENT",
  CALIBRATION_COUNTEREXAMPLE: "VALID_COUNTEREXAMPLE",
} as const;

export function resolveMathPilotContract(raw: MathPilotRequest): MathPilotContract {
  const request = mathPilotRequestSchema.parse(raw);
  if (request.caseType !== "OPEN") return MATH_PILOT_CALIBRATIONS[request.caseType];
  return mathPilotContractSchema.parse({ version: 1, ...request });
}

export function digestMathPilotContract(contract: MathPilotContract): string {
  return createHash("sha256").update(canonicalJson(mathPilotContractSchema.parse(contract))).digest("hex");
}

export function mathPilotScope(contract: MathPilotContract): string {
  return [
    `Definitions: ${contract.definitions}`,
    `Assumptions: ${contract.assumptions}`,
    `Falsification criterion: ${contract.falsificationCriterion}`,
    `Success criterion: ${contract.successCriterion}`,
    `Exclusions: ${contract.exclusions}`,
    "Report a proof attempt, a checked counterexample, partial progress, or uncertainty explicitly. A cited source or finite computation is not by itself a general proof.",
  ].join("\n");
}

export function calibratedCaseTypes(cases: Array<{
  caseType: string;
  contract: unknown;
  contractDigest: string;
  approvedIntegrityValid: boolean;
  agentReviewValid?: boolean;
  researchRun: { status: string; approvedDigest: string | null; providerName: string; modelName: string; question: string; scope: string;
    mathModelAttempt?: unknown; mathModelAttemptDigest?: string | null };
  assessment: { conclusion: string; researchDigest: string; reviewChecklist?: unknown; reviewChecklistDigest?: string | null } | null;
  agentReview?: { disposition: string; conclusion: string; contractDigest: string; attemptDigest: string;
    researchDigest: string; ledger: unknown; ledgerDigest: string } | null;
}>, providerName: string, modelName: string): Set<keyof typeof MATH_PILOT_EXPECTED> {
  const passed = new Set<keyof typeof MATH_PILOT_EXPECTED>();
  for (const item of cases) {
    if (item.caseType !== "CALIBRATION_PROOF" && item.caseType !== "CALIBRATION_COUNTEREXAMPLE") continue;
    const parsed = mathPilotContractSchema.safeParse(item.contract);
    if (!parsed.success || digestMathPilotContract(parsed.data) !== item.contractDigest) continue;
    if (canonicalJson(parsed.data) !== canonicalJson(MATH_PILOT_CALIBRATIONS[item.caseType])) continue;
    if (item.researchRun.question !== parsed.data.statement || item.researchRun.scope !== mathPilotScope(parsed.data)) continue;
    if (item.researchRun.providerName !== providerName || item.researchRun.modelName !== modelName) continue;
    if (item.agentReviewValid && item.agentReview?.disposition === "AI_REVIEWED" &&
      item.agentReview.conclusion === MATH_PILOT_EXPECTED[item.caseType] &&
      ["AWAITING_REVIEW", "APPROVED"].includes(item.researchRun.status)) {
      passed.add(item.caseType);
      continue;
    }
    if (item.researchRun.status !== "APPROVED" || !item.researchRun.approvedDigest || !item.approvedIntegrityValid) continue;
    if (item.assessment?.researchDigest !== item.researchRun.approvedDigest) continue;
    if (item.assessment?.conclusion !== MATH_PILOT_EXPECTED[item.caseType]) continue;
    const ledger = mathReviewChecklistSchema.safeParse(item.assessment.reviewChecklist);
    if (!ledger.success || digestMathReviewChecklist(ledger.data) !== item.assessment.reviewChecklistDigest) continue;
    if (ledger.data.checks.some((check) => check.verdict !== "VERIFIED")) continue;
    passed.add(item.caseType);
  }
  return passed;
}
