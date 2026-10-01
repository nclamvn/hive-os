import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import {
  digestMathPilotContract,
  MATH_PILOT_BENCHMARK,
  MATH_PILOT_CALIBRATIONS,
  mathPilotContractSchema,
  type MathPilotContract,
} from "./math-pilot";
import { mathModelAttemptSchema } from "./contracts";
import { MATH_EXACT_BENCHMARK_REFERENCE } from "./math-benchmark-reference";
import { exactReplaySchema, validExactReplay, type ExactReplay } from "./math-exact-replay";
import { exactIntervalSchema, validExactInterval, type ExactInterval } from "./math-exact-interval";
import { MATH_PILOT_EXACT_BENCHMARK } from "./math-pilot";

export const mathAgentRoleSchema = z.enum(["CRITIC", "ADVERSARY"]);

export const mathAgentReportSchema = z.object({
  role: mathAgentRoleSchema,
  verdict: z.enum(["SUPPORTS", "CHALLENGES", "INCONCLUSIVE"]),
  candidateConclusion: z.enum(["SUPPORTED_ARGUMENT", "VALID_COUNTEREXAMPLE", "PARTIAL", "INCONCLUSIVE"]),
  exactQuote: z.string().trim().min(8).max(1_000),
  reasoning: z.string().trim().min(40).max(4_000),
  checks: z.array(z.string().trim().min(12).max(1_000)).min(1).max(8),
  unresolvedGap: z.string().trim().min(12).max(2_000).nullable(),
  threadId: z.string().trim().min(1).max(160),
  usage: mathModelAttemptSchema.shape.usage,
}).strict();

export const reviewerModelSchema = z.object({
  role: mathAgentRoleSchema,
  providerName: z.literal("codex-local"),
  identityEvidence: z.literal("REQUESTED_CLI_MODEL"),
  requestedModelName: z.string().trim().min(1).max(160),
  threadId: z.string().trim().min(1).max(160),
}).strict();

export const mathAgentLedgerSchema = z.object({
  version: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  reviewerModelName: z.string().trim().min(1).max(160).optional(),
  reviewerModels: z.tuple([reviewerModelSchema, reviewerModelSchema]).optional(),
  reports: z.tuple([mathAgentReportSchema, mathAgentReportSchema]),
  disposition: z.enum(["AI_REVIEWED", "INCONCLUSIVE"]),
  conclusion: z.enum(["SUPPORTED_ARGUMENT", "VALID_COUNTEREXAMPLE", "PARTIAL", "INCONCLUSIVE"]),
  exactReplay: exactReplaySchema.optional(),
  exactInterval: exactIntervalSchema.optional(),
  oracle: z.object({
    contractValid: z.boolean(),
    attemptValid: z.boolean(),
    groundedQuotes: z.boolean(),
    calibrationWitnessValid: z.boolean().nullable(),
    benchmarkReferenceValid: z.boolean().optional(),
    exactAnswerMatch: z.boolean().optional(),
    exactReplayValid: z.boolean().optional(),
    exactIntervalValid: z.boolean().optional(),
    note: z.string().trim().min(12).max(1_000),
  }).strict(),
}).strict().superRefine((value, ctx) => {
  if (value.reports[0].role !== "CRITIC" || value.reports[1].role !== "ADVERSARY") {
    ctx.addIssue({ code: "custom", message: "The two distinct review roles are required in order" });
  }
  if (value.reports[0].threadId === value.reports[1].threadId) {
    ctx.addIssue({ code: "custom", message: "Review roles must use distinct Codex contexts" });
  }
  if ((value.version === 1 && (value.exactInterval || value.oracle.exactIntervalValid !== undefined)) ||
    (value.version === 2 && (!value.exactInterval || value.oracle.exactIntervalValid === undefined)) ||
    (value.version === 3 && Boolean(value.exactInterval) !== (value.oracle.exactIntervalValid !== undefined))) {
    ctx.addIssue({ code: "custom", message: "Interval evidence must match the review ledger version" });
  }
  if (value.version === 3) {
    if (value.reviewerModelName || !value.reviewerModels || value.reviewerModels.some((model, index) =>
      model.role !== value.reports[index].role || model.threadId !== value.reports[index].threadId)) {
      ctx.addIssue({ code: "custom", message: "Each review role needs matching per-model provenance" });
    }
  } else if (!value.reviewerModelName || value.reviewerModels) {
    ctx.addIssue({ code: "custom", message: "Legacy review provenance must remain unchanged" });
  }
});

export type MathAgentReport = z.infer<typeof mathAgentReportSchema>;
export type MathAgentLedger = z.infer<typeof mathAgentLedgerSchema>;

export function digestMathAgentLedger(ledger: MathAgentLedger): string {
  return sha256(canonicalJson(mathAgentLedgerSchema.parse(ledger)));
}

function normalizedAlgebra(value: string): string {
  return value.toLowerCase().replaceAll("²", "^2").replaceAll("·", "*").replace(/\s+/g, "");
}

function evenSquareWitness(argument: string): boolean {
  const text = normalizedAlgebra(argument);
  return /n=2\*?k/.test(text) && /n\^2/.test(text) &&
    /4\*?k\^2/.test(text) && /2\*?\(?2\*?k\^2\)?/.test(text);
}

/** A narrow known-answer oracle, never a general theorem prover. */
export function evaluateMathAgentReview(input: {
  contract: MathPilotContract;
  contractDigest: string;
  attempt: z.infer<typeof mathModelAttemptSchema>;
  reports: [MathAgentReport, MathAgentReport];
  exactReplay?: ExactReplay;
  exactInterval?: ExactInterval;
  legacyExactReview?: boolean;
}): Pick<MathAgentLedger, "disposition" | "conclusion" | "oracle"> {
  const contract = mathPilotContractSchema.safeParse(input.contract);
  const contractValid = contract.success && digestMathPilotContract(contract.data) === input.contractDigest;
  const attemptValid = mathModelAttemptSchema.safeParse(input.attempt).success;
  const groundedQuotes = input.reports.every((report) => input.attempt.argument.includes(report.exactQuote));
  const independentContexts = input.reports[0].threadId !== input.reports[1].threadId &&
    input.reports.every((report) => report.threadId !== input.attempt.threadId);
  const aligned = input.reports[0].role === "CRITIC" && input.reports[1].role === "ADVERSARY" &&
    independentContexts && input.reports.every((report) => report.verdict === "SUPPORTS" && report.unresolvedGap === null) &&
    input.reports[0].candidateConclusion === input.reports[1].candidateConclusion;
  let calibrationWitnessValid: boolean | null = null;
  if (contractValid && input.contract.caseType === "CALIBRATION_PROOF") {
    calibrationWitnessValid = canonicalJson(input.contract) === canonicalJson(MATH_PILOT_CALIBRATIONS.CALIBRATION_PROOF) &&
      input.attempt.attemptType === "PROOF_ATTEMPT" && evenSquareWitness(input.attempt.argument);
  }
  if (contractValid && input.contract.caseType === "CALIBRATION_COUNTEREXAMPLE") {
    calibrationWitnessValid = canonicalJson(input.contract) === canonicalJson(MATH_PILOT_CALIBRATIONS.CALIBRATION_COUNTEREXAMPLE) &&
      input.attempt.attemptType === "COUNTEREXAMPLE_ATTEMPT" && input.attempt.candidateCounterexample?.trim() === "2";
  }
  const benchmarkReferenceValid = input.contract.caseType === "BENCHMARK_PROOF" && Boolean(contractValid) &&
    canonicalJson(input.contract) === canonicalJson(MATH_PILOT_BENCHMARK) &&
    input.attempt.attemptType === "PROOF_ATTEMPT";
  const exactContractValid = input.contract.caseType === "BENCHMARK_EXACT" && Boolean(contractValid) &&
    canonicalJson(input.contract) === canonicalJson(MATH_PILOT_EXACT_BENCHMARK);
  const exactAnswerMatch = exactContractValid && input.attempt.exactAnswer === MATH_EXACT_BENCHMARK_REFERENCE.expectedAnswer;
  const exactReplayValid = exactContractValid && validExactReplay(input.exactReplay,
    input.attempt.computationPython, input.attempt.exactAnswer);
  const exactIntervalValid = exactContractValid && validExactInterval(input.exactInterval, input.attempt.exactAnswer);
  const expected = input.contract.caseType === "CALIBRATION_PROOF" ? "SUPPORTED_ARGUMENT"
    : input.contract.caseType === "CALIBRATION_COUNTEREXAMPLE" ? "VALID_COUNTEREXAMPLE"
    : input.contract.caseType === "BENCHMARK_PROOF" || input.contract.caseType === "BENCHMARK_EXACT" ? "SUPPORTED_ARGUMENT" : null;
  const supported = Boolean(contractValid && attemptValid && groundedQuotes && aligned &&
    (expected === null || ((calibrationWitnessValid || benchmarkReferenceValid ||
      (exactAnswerMatch && exactReplayValid && (input.legacyExactReview || exactIntervalValid) &&
        input.attempt.attemptType === "PROOF_ATTEMPT")) &&
      input.reports[0].candidateConclusion === expected)));
  const disposition = supported ? "AI_REVIEWED" : "INCONCLUSIVE";
  const conclusion = !supported ? "INCONCLUSIVE" : expected ?? "PARTIAL";
  return {
    disposition,
    conclusion,
    oracle: {
      contractValid: Boolean(contractValid), attemptValid, groundedQuotes, calibrationWitnessValid,
      ...(input.contract.caseType === "BENCHMARK_PROOF" ? { benchmarkReferenceValid } : {}),
      ...(input.contract.caseType === "BENCHMARK_EXACT" ? { exactAnswerMatch, exactReplayValid } : {}),
      ...(input.contract.caseType === "BENCHMARK_EXACT" && !input.legacyExactReview ? { exactIntervalValid } : {}),
      note: input.contract.caseType === "BENCHMARK_EXACT"
        ? input.legacyExactReview
          ? "This public sample requires a matching held-out integer, a digest-bound isolated code replay, and two supportive AI reviews. These do not establish a blind score, a formally verified derivation, or numerical error bounds."
          : "This public sample requires a matching held-out integer, a digest-bound isolated code replay, a fixed independent interval enclosure, and two supportive AI reviews. This is not a blind score, a formal proof of the geometric reduction, or human mathematical sign-off."
        : input.contract.caseType === "BENCHMARK_PROOF"
        ? benchmarkReferenceValid
          ? "The sealed known-answer benchmark matches its reference and two AI roles support this attempt; the reference proves only that the theorem is true, not that this generated proof is formally valid."
          : "The benchmark contract or proof-attempt type did not match the sealed known-answer reference."
        : expected === null
        ? "Open mathematics has no known-answer oracle; AI review can continue research but cannot certify a theorem."
        : calibrationWitnessValid
          ? "The fixed calibration witness matches the sealed known-answer case; this is not a general proof checker."
          : "The fixed calibration witness did not pass deterministic checks.",
    },
  };
}

export function validateRecordedMathAgentReview(input: {
  contract: unknown;
  contractDigest: string;
  attempt: unknown;
  attemptDigest: string | null;
  researchDigest: string;
  review: {
    disposition: string;
    conclusion: string;
    contractDigest: string;
    attemptDigest: string;
    researchDigest: string;
    ledger: unknown;
    ledgerDigest: string;
  } | null;
}): MathAgentLedger | null {
  const contract = mathPilotContractSchema.safeParse(input.contract);
  const attempt = mathModelAttemptSchema.safeParse(input.attempt);
  const ledger = mathAgentLedgerSchema.safeParse(input.review?.ledger);
  if (!contract.success || !attempt.success || !ledger.success || !input.review ||
    !input.attemptDigest || digestMathPilotContract(contract.data) !== input.contractDigest ||
    sha256(canonicalJson(attempt.data)) !== input.attemptDigest ||
    input.review.contractDigest !== input.contractDigest ||
    input.review.attemptDigest !== input.attemptDigest ||
    input.review.researchDigest !== input.researchDigest ||
    input.review.ledgerDigest !== digestMathAgentLedger(ledger.data) ||
    (ledger.data.version !== 3 && ledger.data.reviewerModelName !== attempt.data.modelName) ||
    ledger.data.disposition !== input.review.disposition ||
    ledger.data.conclusion !== input.review.conclusion) return null;
  if (ledger.data.version === 2 && contract.data.caseType !== "BENCHMARK_EXACT") return null;
  if (ledger.data.version === 3 && ledger.data.reviewerModels?.some((model) => model.threadId === attempt.data.threadId)) return null;
  const recomputed = evaluateMathAgentReview({
    contract: contract.data, contractDigest: input.contractDigest,
    attempt: attempt.data, reports: ledger.data.reports, exactReplay: ledger.data.exactReplay,
    exactInterval: ledger.data.exactInterval, legacyExactReview: ledger.data.version === 1,
  });
  if (canonicalJson(recomputed) !== canonicalJson({ disposition: ledger.data.disposition, conclusion: ledger.data.conclusion, oracle: ledger.data.oracle })) return null;
  return ledger.data;
}
