import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { sha256 } from "./integrity";
import {
  digestMathPilotContract,
  MATH_PILOT_BENCHMARK,
  MATH_PILOT_CALIBRATIONS,
  mathPilotContractSchema,
  MATH_LRC_PROOF_UNIT_CONTRACT,
  MATH_LRC_METHOD_UNIT_CONTRACT,
  type MathPilotContract,
} from "./math-pilot";
import { mathModelAttemptSchema } from "./contracts";
import { MATH_EXACT_BENCHMARK_REFERENCE } from "./math-benchmark-reference";
import { exactReplaySchema, validExactReplay, type ExactReplay } from "./math-exact-replay";
import { exactIntervalSchema, validExactInterval, type ExactInterval } from "./math-exact-interval";
import { MATH_PILOT_EXACT_BENCHMARK } from "./math-pilot";
import { validateRetainedLrcEvidence } from "./math-lrc-replay";
import { validateRetainedLrcCampaignEvidence } from "./math-lrc-campaign";
import { assertLrcCampaignBinding, lrcCampaignLedgerReference } from "./math-lrc-campaign-integration";
import { lrcProofUnitFeedbackSchema, preparedLrcProofUnitLiveInputSchema, lrcProofUnitLedgerReferenceSchema, lrcProofUnitAuditSummarySchema, assertLrcProofUnitAttemptBinding, validatePreparedLrcProofUnitLiveInput, validateLrcProofUnitReviewOutput, validLrcProofUnitUsage, proofUnitFeedbackOutcome, lrcProofUnitLedgerReference, createLrcProofUnitAuditSummary } from "./math-lrc-proof-unit-live";
import { lrcMethodUnitFeedbackSchema,preparedLrcMethodUnitInputSchema } from "./math-lrc-method-unit-live";
import { lrcMethodUnitLedgerSchema,evaluateLrcMethodUnitReview,validateRecordedLrcMethodUnitReview,lrcMethodUnitAuditSummarySchema } from "./math-lrc-method-unit-review";
import type { LrcMethodUnitSourcePins } from "./math-lrc-method-unit";

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
  lrcProofUnitFeedback: lrcProofUnitFeedbackSchema.optional(),
  lrcProofUnitInput: preparedLrcProofUnitLiveInputSchema.optional(),
  lrcMethodUnitFeedback:lrcMethodUnitFeedbackSchema.optional(),
  lrcMethodUnitInput:preparedLrcMethodUnitInputSchema.optional(),
}).strict();

export const reviewerModelSchema = z.object({
  role: mathAgentRoleSchema,
  providerName: z.literal("codex-local"),
  identityEvidence: z.literal("REQUESTED_CLI_MODEL"),
  requestedModelName: z.string().trim().min(1).max(160),
  threadId: z.string().trim().min(1).max(160),
}).strict();

const legacyMathAgentLedgerSchema = z.object({
  version: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  reviewerModelName: z.string().trim().min(1).max(160).optional(),
  reviewerModels: z.tuple([reviewerModelSchema, reviewerModelSchema]).optional(),
  reports: z.tuple([mathAgentReportSchema, mathAgentReportSchema]),
  disposition: z.enum(["AI_REVIEWED", "INCONCLUSIVE"]),
  conclusion: z.enum(["SUPPORTED_ARGUMENT", "VALID_COUNTEREXAMPLE", "PARTIAL", "INCONCLUSIVE"]),
  exactReplay: exactReplaySchema.optional(),
  exactInterval: exactIntervalSchema.optional(),
  lrcEvidence: z.object({ scopeDigest: z.string().regex(/^[a-f0-9]{64}$/),
    certificateDigest: z.string().regex(/^[a-f0-9]{64}$/), evidenceDigest: z.string().regex(/^[a-f0-9]{64}$/) }).strict().optional(),
  lrcCampaignEvidence: z.object({scopeDigest: z.string().regex(/^[a-f0-9]{64}$/),
    evidenceDigest: z.string().regex(/^[a-f0-9]{64}$/), factsDigest: z.string().regex(/^[a-f0-9]{64}$/),
    claimId: z.literal("FINITE_I13_P83_224_EMPTY_AND_J13_P83_EMPTY")}).strict().optional(),
  oracle: z.object({
    contractValid: z.boolean(),
    attemptValid: z.boolean(),
    groundedQuotes: z.boolean(),
    calibrationWitnessValid: z.boolean().nullable(),
    benchmarkReferenceValid: z.boolean().optional(),
    exactAnswerMatch: z.boolean().optional(),
    exactReplayValid: z.boolean().optional(),
    exactIntervalValid: z.boolean().optional(),
    lrcEvidenceValid: z.boolean().optional(),
    lrcCampaignEvidenceValid: z.boolean().optional(),
    note: z.string().trim().min(12).max(1_000),
  }).strict(),
}).strict().superRefine((value, ctx) => {
  if(value.reports.some(report=>"lrcMethodUnitFeedback" in report||"lrcMethodUnitInput" in report))ctx.addIssue({code:"custom",message:"Historical ledgers cannot carry method-unit fields"});
  if (value.reports.some(report => "lrcProofUnitFeedback" in report || "lrcProofUnitInput" in report)) ctx.addIssue({ code: "custom", message: "Historical ledgers cannot carry proof-unit role fields" });
  if (value.reports[0].role !== "CRITIC" || value.reports[1].role !== "ADVERSARY") {
    ctx.addIssue({ code: "custom", message: "The two distinct review roles are required in order" });
  }
  if (value.reports[0].threadId === value.reports[1].threadId) {
    ctx.addIssue({ code: "custom", message: "Review roles must use distinct Codex contexts" });
  }
  if ((value.version === 1 && (value.exactInterval || value.oracle.exactIntervalValid !== undefined)) ||
    (value.version === 2 && (!value.exactInterval || value.oracle.exactIntervalValid === undefined)) ||
    (value.version >= 3 && Boolean(value.exactInterval) !== (value.oracle.exactIntervalValid !== undefined))) {
    ctx.addIssue({ code: "custom", message: "Interval evidence must match the review ledger version" });
  }
  if (value.version >= 3) {
    if (value.reviewerModelName || !value.reviewerModels || value.reviewerModels.some((model, index) =>
      model.role !== value.reports[index].role || model.threadId !== value.reports[index].threadId)) {
      ctx.addIssue({ code: "custom", message: "Each review role needs matching per-model provenance" });
    }
  } else if (!value.reviewerModelName || value.reviewerModels) {
    ctx.addIssue({ code: "custom", message: "Legacy review provenance must remain unchanged" });
  }
  if (value.version === 4 ? !value.lrcEvidence || value.oracle.lrcEvidenceValid !== true || value.exactReplay || value.exactInterval
    : value.lrcEvidence !== undefined || value.oracle.lrcEvidenceValid !== undefined) {
    ctx.addIssue({ code: "custom", message: "Prospective LRC ledger evidence cannot be omitted or downgraded" });
  }
  if (value.version === 5 ? !value.lrcCampaignEvidence || value.oracle.lrcCampaignEvidenceValid !== true ||
    "exactReplay" in value || "exactInterval" in value || "lrcEvidence" in value ||
    ["benchmarkReferenceValid", "exactAnswerMatch", "exactReplayValid", "exactIntervalValid", "lrcEvidenceValid"].some(key => key in value.oracle) ||
    "reviewerModelName" in value || !["PARTIAL", "INCONCLUSIVE"].includes(value.conclusion)
    : "lrcCampaignEvidence" in value || "lrcCampaignEvidenceValid" in value.oracle) {
    ctx.addIssue({code:"custom",message:"Campaign ledger 5 requires exact campaign-only evidence and bounded conclusion"});
  }
});

const proofUnitMathAgentLedgerSchema = z.object({ version: z.literal(6), reviewerModelName: z.never().optional(), reviewerModels: z.tuple([reviewerModelSchema, reviewerModelSchema]),
  reports: z.tuple([mathAgentReportSchema, mathAgentReportSchema]), disposition: z.enum(["AI_REVIEWED", "INCONCLUSIVE"]), conclusion: z.enum(["PARTIAL", "INCONCLUSIVE"]),
  exactReplay: z.never().optional(), exactInterval: z.never().optional(), lrcEvidence: z.never().optional(), lrcCampaignEvidence: z.never().optional(),
  lrcProofUnitEvidence: lrcProofUnitLedgerReferenceSchema, proofUnitAuditStatus: z.enum(["CONDITIONAL_REVIEWED", "INCONCLUSIVE", "REJECTED"]), proofUnitAuditSummary: lrcProofUnitAuditSummarySchema,
  oracle: z.object({ contractValid: z.boolean(), attemptValid: z.boolean(), groundedQuotes: z.boolean(), calibrationWitnessValid: z.null(),
    proofUnitEvidenceValid: z.boolean(), inputBindingsValid: z.boolean(), findingsComplete: z.boolean(),
    benchmarkReferenceValid: z.never().optional(), exactAnswerMatch: z.never().optional(), exactReplayValid: z.never().optional(), exactIntervalValid: z.never().optional(), lrcEvidenceValid: z.never().optional(), lrcCampaignEvidenceValid: z.never().optional(), note: textForLedgerNote() }).strict(),
}).strict().superRefine((value, ctx) => {
  if(value.reports.some(report=>"lrcMethodUnitFeedback" in report||"lrcMethodUnitInput" in report))ctx.addIssue({code:"custom",message:"Ledger6 cannot carry method-unit fields"});
  const forbidden = ["reviewerModelName", "exactReplay", "exactInterval", "lrcEvidence", "lrcCampaignEvidence"];
  if (forbidden.some(key => key in value) || !value.oracle.contractValid || !value.oracle.attemptValid || !value.oracle.proofUnitEvidenceValid || !value.oracle.inputBindingsValid || !value.oracle.findingsComplete ||
    ["benchmarkReferenceValid", "exactAnswerMatch", "exactReplayValid", "exactIntervalValid", "lrcEvidenceValid", "lrcCampaignEvidenceValid"].some(key => key in value.oracle) ||
    value.proofUnitAuditSummary.status !== value.proofUnitAuditStatus || value.reports.some((report, index) => report.role !== (index === 0 ? "CRITIC" : "ADVERSARY") || !["PARTIAL", "INCONCLUSIVE"].includes(report.candidateConclusion) || !report.lrcProofUnitFeedback || !report.lrcProofUnitInput || report.lrcProofUnitInput.role !== report.role || !validLrcProofUnitUsage(report.usage) || value.reviewerModels[index].role !== report.role || value.reviewerModels[index].threadId !== report.threadId || value.reviewerModels[index].requestedModelName !== report.lrcProofUnitInput.requestedModelName) || value.reports[0].threadId === value.reports[1].threadId) ctx.addIssue({ code: "custom", message: "Ledger6 requires exact live proof-unit-only role evidence/accounting" });
});
function textForLedgerNote() { return z.string().trim().min(12).max(1000); }
export const mathAgentLedgerSchema = z.union([legacyMathAgentLedgerSchema, proofUnitMathAgentLedgerSchema,lrcMethodUnitLedgerSchema]);

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
  caseId?: string;
  runId?: string;
  finiteEvidence?:unknown;
  finiteSourcePins?:LrcMethodUnitSourcePins;
  reviewJobId?:string;
}): Pick<MathAgentLedger, "disposition" | "conclusion" | "oracle"> & { proofUnitAuditStatus?: "CONDITIONAL_REVIEWED" | "INCONCLUSIVE" | "REJECTED"; proofUnitAuditSummary?: z.infer<typeof lrcProofUnitAuditSummarySchema>;lrcMethodUnitAuditSummary?:z.infer<typeof lrcMethodUnitAuditSummarySchema> } {
  if(input.contract.version===4){if(!input.caseId||!input.runId||!input.finiteSourcePins||!input.reviewJobId||canonicalJson(input.contract)!==canonicalJson(MATH_LRC_METHOD_UNIT_CONTRACT)||digestMathPilotContract(input.contract)!==input.contractDigest)throw new Error("Fixed method contract/external rows/job/pins required");return evaluateLrcMethodUnitReview({contractDigest:input.contractDigest,caseId:input.caseId,runId:input.runId,requestedModelName:"gpt-6-sol",attempt:input.attempt,reports:input.reports,finiteEvidence:input.finiteEvidence,finiteSourcePins:input.finiteSourcePins,reviewJobId:input.reviewJobId});}
  if(["lrcMethodUnitEvidence","lrcMethodUnitFeedback","lrcMethodUnitFiniteSeed"].some(k=>k in input.attempt)||input.reports.some(r=>"lrcMethodUnitInput" in r||"lrcMethodUnitFeedback" in r))throw new Error("Method unit fields cannot enter old review lanes");
  if (input.contract.version === 3) {
    if (!input.caseId || !input.runId || canonicalJson(input.contract) !== canonicalJson(MATH_LRC_PROOF_UNIT_CONTRACT) || digestMathPilotContract(input.contract) !== input.contractDigest) throw new Error("Fixed proof-unit contract and external case/run identities required");
    const expected = { contractDigest: input.contractDigest, caseId: input.caseId, runId: input.runId, requestedModelName: "gpt-6-sol" };
    mathModelAttemptSchema.parse(input.attempt); assertLrcProofUnitAttemptBinding(input.attempt, expected);
    const evidence = input.attempt.lrcProofUnitEvidence!;
    const attemptDigest = sha256(canonicalJson(input.attempt));
    for (const [index, report] of input.reports.entries()) {
      mathAgentReportSchema.parse(report);
      validateLrcProofUnitReviewOutput(Object.fromEntries(["role", "verdict", "candidateConclusion", "exactQuote", "reasoning", "checks", "unresolvedGap", "lrcProofUnitFeedback"].map(key => [key, report[key as keyof typeof report]])), report.role);
      if (report.role !== (index === 0 ? "CRITIC" : "ADVERSARY") || !report.lrcProofUnitFeedback || !report.lrcProofUnitInput || !validLrcProofUnitUsage(report.usage) || !validatePreparedLrcProofUnitLiveInput(report.lrcProofUnitInput, { ...expected, role: report.role, solverAttempt: input.attempt, solverAttemptDigest: attemptDigest })) throw new Error("Proof-unit reviewer bindings/findings/accounting differ");
    }
    if (input.reports.some(report => report.threadId === input.attempt.threadId) || input.reports[0].threadId === input.reports[1].threadId) throw new Error("Proof-unit contexts must all be distinct");
    const feedback = [input.attempt.lrcProofUnitFeedback!, input.reports[0].lrcProofUnitFeedback!, input.reports[1].lrcProofUnitFeedback!];
    const status = proofUnitFeedbackOutcome(feedback);
    const groundedQuotes = input.reports.every(report => input.attempt.argument.includes(report.exactQuote));
    const aligned = groundedQuotes && input.attempt.attemptType !== "INCONCLUSIVE" && status === "CONDITIONAL_REVIEWED" && input.reports.every(report => report.verdict === "SUPPORTS" && report.unresolvedGap === null && report.candidateConclusion === "PARTIAL");
    const auditStatus = status === "REJECTED" ? status : aligned ? status : "INCONCLUSIVE";
    return { disposition: aligned ? "AI_REVIEWED" : "INCONCLUSIVE", conclusion: aligned ? "PARTIAL" : "INCONCLUSIVE", proofUnitAuditStatus: auditStatus,
      proofUnitAuditSummary: createLrcProofUnitAuditSummary(auditStatus, [evidence.solverInput, input.reports[0].lrcProofUnitInput!, input.reports[1].lrcProofUnitInput!]),
      oracle: { contractValid: true, attemptValid: true, groundedQuotes, calibrationWitnessValid: null, proofUnitEvidenceValid: true, inputBindingsValid: true, findingsComplete: true,
        note: "Fixed p83 proof-unit input integrity and complete conditional findings only, not theorem truth. Four unsigned NOT_FRESH completeness premises remain conditional. GLOBAL_LOWER is OPEN and unused by the finite bridge; other60 primes/23applications/global14/15/formal/external/novelty remain OPEN." } };
  }
  if ("lrcProofUnitEvidence" in input.attempt || "lrcProofUnitFeedback" in input.attempt || input.reports.some(report => "lrcProofUnitInput" in report || "lrcProofUnitFeedback" in report)) throw new Error("Proof-unit fields cannot enter historical review lanes");
  const contract = mathPilotContractSchema.safeParse(input.contract);
  const contractValid = contract.success && digestMathPilotContract(contract.data) === input.contractDigest;
  const lrcEvidenceValid = input.contract.lrcFiniteScope
    ? validateRetainedLrcEvidence(input.attempt.lrcEvidence, input.contract.lrcFiniteScope, input.contractDigest)
    : input.attempt.lrcEvidence === undefined;
  const lrcCampaignEvidenceValid = input.contract.lrcCampaignScope
    ? (() => {try {assertLrcCampaignBinding(input.contract,input.attempt.lrcCampaignEvidence,input.attempt);return true;} catch {return false;}})()
    : input.attempt.lrcCampaignEvidence === undefined;
  const attemptValid = mathModelAttemptSchema.safeParse(input.attempt).success && lrcEvidenceValid && lrcCampaignEvidenceValid;
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
      ...(input.contract.lrcFiniteScope ? { lrcEvidenceValid } : {}),
      ...(input.contract.lrcCampaignScope ? {lrcCampaignEvidenceValid} : {}),
      note: input.contract.lrcCampaignScope
        ? "Recorded unsigned p83 campaign reference only: finite I(13,83,224) and J(13,83) are scoped to one actual prime. This is not a fresh semantic replay; other 60 primes, all 23 application obligations, global LRC, lower-case independent reproduction and formal/external acceptance remain OPEN. Root review is PARTIAL/INCONCLUSIVE."
        : input.contract.lrcFiniteScope
        ? "The retained root-bound certificate covers only the sealed finite Cartesian speed domain and fixed modulus grid. GRID exclusions do not exclude continuous-time witnesses or refute LRC. AI review remains PARTIAL/INCONCLUSIVE; no unrestricted theorem or human acceptance follows."
        : input.contract.caseType === "BENCHMARK_EXACT"
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
  caseId?: string;
  runId?: string;
  finiteSourcePins?:LrcMethodUnitSourcePins;
  reviewJobId?:string;
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
    (ledger.data.version < 3 && ledger.data.reviewerModelName !== attempt.data.modelName) ||
    ledger.data.disposition !== input.review.disposition ||
    ledger.data.conclusion !== input.review.conclusion) return null;
  if (ledger.data.version === 2 && contract.data.caseType !== "BENCHMARK_EXACT") return null;
  if (ledger.data.version >= 3 && ledger.data.reviewerModels?.some((model) => model.threadId === attempt.data.threadId)) return null;
  if(contract.data.version===4||ledger.data.version===7){if(contract.data.version!==4||ledger.data.version!==7||!input.caseId||!input.runId||!input.finiteSourcePins||!input.reviewJobId||canonicalJson(contract.data)!==canonicalJson(MATH_LRC_METHOD_UNIT_CONTRACT))return null;return validateRecordedLrcMethodUnitReview({contractDigest:input.contractDigest,caseId:input.caseId,runId:input.runId,requestedModelName:"gpt-6-sol",attempt:attempt.data,ledger:ledger.data,finiteSourcePins:input.finiteSourcePins,reviewJobId:input.reviewJobId});}
  if(["lrcMethodUnitEvidence","lrcMethodUnitFeedback","lrcMethodUnitFiniteSeed"].some(k=>k in attempt.data)||ledger.data.reports.some(r=>"lrcMethodUnitInput" in r||"lrcMethodUnitFeedback" in r))return null;
  if (contract.data.version === 3 || ledger.data.version === 6) {
    if (contract.data.version !== 3 || ledger.data.version !== 6 || !input.caseId || !input.runId) return null;
    try {
      const recomputed = evaluateMathAgentReview({ contract: contract.data, contractDigest: input.contractDigest, attempt: attempt.data, reports: ledger.data.reports, caseId: input.caseId, runId: input.runId });
      const evidence = attempt.data.lrcProofUnitEvidence!;
      if (canonicalJson(ledger.data.lrcProofUnitEvidence) !== canonicalJson(lrcProofUnitLedgerReference(evidence)) || canonicalJson(recomputed) !== canonicalJson({ disposition: ledger.data.disposition, conclusion: ledger.data.conclusion, oracle: ledger.data.oracle, proofUnitAuditStatus: ledger.data.proofUnitAuditStatus, proofUnitAuditSummary: ledger.data.proofUnitAuditSummary })) return null;
      return ledger.data;
    } catch { return null; }
  }
  if ("lrcProofUnitEvidence" in attempt.data || "lrcProofUnitFeedback" in attempt.data || ledger.data.reports.some(report => "lrcProofUnitInput" in report || "lrcProofUnitFeedback" in report)) return null;
  if (contract.data.lrcFiniteScope) {
    const evidence = attempt.data.lrcEvidence;
    if (ledger.data.version !== 4 || !evidence || !validateRetainedLrcEvidence(evidence, contract.data.lrcFiniteScope, input.contractDigest) ||
      canonicalJson(ledger.data.lrcEvidence) !== canonicalJson({ scopeDigest: evidence.scopeDigest,
        certificateDigest: evidence.certificate.certificateDigest, evidenceDigest: evidence.evidenceDigest })) return null;
  } else if (ledger.data.version === 4 || attempt.data.lrcEvidence !== undefined) return null;
  if (contract.data.lrcCampaignScope) {
    const evidence=attempt.data.lrcCampaignEvidence;
    if(ledger.data.version!==5 || !evidence || !validateRetainedLrcCampaignEvidence(evidence,contract.data.lrcCampaignScope,input.contractDigest) ||
      canonicalJson(ledger.data.lrcCampaignEvidence)!==canonicalJson(lrcCampaignLedgerReference(evidence))) return null;
    try {assertLrcCampaignBinding(contract.data,evidence,attempt.data);} catch {return null;}
  } else if(ledger.data.version===5 || attempt.data.lrcCampaignEvidence!==undefined) return null;
  const recomputed = evaluateMathAgentReview({
    contract: contract.data, contractDigest: input.contractDigest,
    attempt: attempt.data, reports: ledger.data.reports, exactReplay: ledger.data.exactReplay,
    exactInterval: ledger.data.exactInterval, legacyExactReview: ledger.data.version === 1,
  });
  if (canonicalJson(recomputed) !== canonicalJson({ disposition: ledger.data.disposition, conclusion: ledger.data.conclusion, oracle: ledger.data.oracle })) return null;
  return ledger.data;
}
