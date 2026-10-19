import { createHash } from "node:crypto";

import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { lrcFiniteScopeSchema } from "./math-lrc-certificates";
import { lrcCampaignScopeSchema, LRC_CAMPAIGN_SCOPE } from "./math-lrc-campaign";
import { lrcProofUnitScopeSchema, LRC_PROOF_UNIT_LIVE_SCOPE } from "./math-lrc-proof-unit-live";
import { lrcMethodUnitScopeSchema, LRC_METHOD_UNIT_SCOPE } from "./math-lrc-method-unit-live";



const boundedText = (max: number) => z.string().trim().min(1).max(max);

export const mathPilotRequestSchema = z.discriminatedUnion("caseType", [
  z.object({ caseType: z.literal("CALIBRATION_PROOF") }).strict(),
  z.object({ caseType: z.literal("CALIBRATION_COUNTEREXAMPLE") }).strict(),
  z.object({ caseType: z.literal("BENCHMARK_PROOF") }).strict(),
  z.object({ caseType: z.literal("BENCHMARK_EXACT") }).strict(),
  z.object({ caseType: z.literal("LRC_FINITE"), preset: z.enum(["LIFTS_6_42", "GRID_6_14", "SINGLETON_14_28", "SINGLETON_15_30"]) }).strict(),
  z.object({ caseType: z.literal("LRC_CAMPAIGN"), preset: z.literal("ALLIKVERE_P83_14_V1") }).strict(),
  z.object({ caseType: z.literal("LRC_PROOF_UNIT"), preset: z.literal("ALLIKVERE_P83_PROOF_UNIT_V1") }).strict(),
  z.object({ caseType: z.literal("LRC_METHOD_UNIT"), preset: z.literal("FEW_EXCEPTION_SHIFT_14_V1") }).strict(),
  z.object({
    caseType: z.literal("OPEN"),
    statement: boundedText(4_000),
    definitions: boundedText(1_000),
    assumptions: boundedText(1_000),
    falsificationCriterion: boundedText(1_000),
    successCriterion: boundedText(1_000),
    exclusions: boundedText(1_000),
    lrcFiniteScope: lrcFiniteScopeSchema.optional(),
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

const mathPilotContractFields = {
  statement: boundedText(4_000),
  definitions: boundedText(1_000),
  assumptions: boundedText(1_000),
  falsificationCriterion: boundedText(1_000),
  successCriterion: boundedText(1_000),
  exclusions: boundedText(1_000),
};
const legacyMathPilotContractSchema = z.object({ ...mathPilotContractFields,
  version: z.literal(1),
  caseType: z.enum(["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE", "BENCHMARK_PROOF", "BENCHMARK_EXACT", "OPEN"]),
  lrcFiniteScope: lrcFiniteScopeSchema.optional(), lrcCampaignScope: z.never().optional(), lrcProofUnitScope: z.never().optional(), lrcMethodUnitScope: z.never().optional(),
}).strict().superRefine((value, ctx) => {
  if (value.lrcFiniteScope && value.caseType !== "OPEN") ctx.addIssue({ code: "custom", message: "Finite LRC is an OPEN research contract" });
  if ("lrcCampaignScope" in value) ctx.addIssue({ code: "custom", message: "Historical contract cannot carry campaign fields" });
  if ("lrcProofUnitScope" in value) ctx.addIssue({ code: "custom", message: "Historical contract cannot carry proof-unit fields" });
  if ("lrcMethodUnitScope" in value) ctx.addIssue({ code: "custom", message: "Historical contract cannot carry method-unit fields" });
});
const campaignMathPilotContractSchema = z.object({ ...mathPilotContractFields, version: z.literal(2),
  caseType: z.literal("OPEN"), lrcCampaignScope: lrcCampaignScopeSchema, lrcFiniteScope: z.never().optional(), lrcProofUnitScope: z.never().optional(), lrcMethodUnitScope: z.never().optional(),
}).strict().superRefine((value, ctx) => {
  if ("lrcFiniteScope" in value) ctx.addIssue({ code: "custom", message: "Campaign and finite lanes cannot mix" });
  if ("lrcProofUnitScope" in value) ctx.addIssue({ code: "custom", message: "Campaign and proof-unit lanes cannot mix" });
  if ("lrcMethodUnitScope" in value) ctx.addIssue({ code: "custom", message: "Campaign and method-unit lanes cannot mix" });
});
const proofUnitMathPilotContractSchema = z.object({ ...mathPilotContractFields, version: z.literal(3), caseType: z.literal("OPEN"),
  lrcProofUnitScope: lrcProofUnitScopeSchema, lrcCampaignScope: z.never().optional(), lrcFiniteScope: z.never().optional(), lrcMethodUnitScope: z.never().optional(),
}).strict().superRefine((value, ctx) => {
  if ("lrcCampaignScope" in value || "lrcFiniteScope" in value || "lrcMethodUnitScope" in value) ctx.addIssue({ code: "custom", message: "Proof-unit and other oracle lanes cannot mix" });
});
const methodUnitMathPilotContractSchema=z.object({...mathPilotContractFields,version:z.literal(4),caseType:z.literal("OPEN"),lrcMethodUnitScope:lrcMethodUnitScopeSchema,lrcFiniteScope:z.never().optional(),lrcCampaignScope:z.never().optional(),lrcProofUnitScope:z.never().optional()}).strict().superRefine((v,c)=>{if(["lrcFiniteScope","lrcCampaignScope","lrcProofUnitScope"].some(k=>k in v))c.addIssue({code:"custom",message:"Method unit cannot mix historical lanes"});});
export const mathPilotContractSchema = z.union([legacyMathPilotContractSchema, campaignMathPilotContractSchema, proofUnitMathPilotContractSchema,methodUnitMathPilotContractSchema]);

export type MathPilotContract = z.infer<typeof mathPilotContractSchema>;
export type MathPilotRequest = z.infer<typeof mathPilotRequestSchema>;

export const MATH_LRC_PRESETS = {
  LIFTS_6_42: { version: 1 as const, totalRunners: 6, modulus: 42, axes: Array.from({ length: 5 }, (_, i) => Array.from({ length: 6 }, (_, j) => i + 1 + 7 * j)) },
  GRID_6_14: { version: 1 as const, totalRunners: 6, modulus: 14, axes: [[1], [2], [3], [4], [5]] },
  SINGLETON_14_28: { version: 1 as const, totalRunners: 14, modulus: 28, axes: Array.from({ length: 13 }, (_, i) => [i + 1]) },
  SINGLETON_15_30: { version: 1 as const, totalRunners: 15, modulus: 30, axes: Array.from({ length: 14 }, (_, i) => [i + 1]) },
};

export const MATH_LRC_CAMPAIGN_CONTRACT = campaignMathPilotContractSchema.parse({ version: 2, caseType: "OPEN",
  lrcCampaignScope: LRC_CAMPAIGN_SCOPE,
  statement: "Map the retained complete Allikvere p83 campaign facts and precise remaining proof obligations. The finite conclusions I(13,83,224)=empty and J(13,83)=empty are separate from global LRC for14/15 runners.",
  definitions: "13 labelled nonzero relative velocities,14 total runners; strict bad14*distance<M, equalityGOOD, coordinate multiplicity retained. Preset ALLIKVERE_P83_14_V1 selects the fixed recorded lineage.",
  assumptions: "Host-admitted retained056–059 evidence and separate conditional060 supplement; recorded local unsigned source/code/runtime/storage trust. No fresh full replay, no independent lower-LRC source proof or formal/external certification.",
  falsificationCriterion: "Scope drift, invalid lineage, missing coverage, false bridge premise or forged host admission defeats this attempt. Grid misses are not continuous-time LRC counterexamples.",
  successCriterion: "Separate finite facts, conditional lemmas and explicit missing obligations. Root conclusion remains PARTIAL or INCONCLUSIVE; supportive models cannot establish unrestricted LRC.",
  exclusions: "No otherprime campaign, shards, arbitrary code/files, fresh claim, novelty, globalLRC14/15 proof or gate promotion. Other60P13, lowerindependent, all23APPLICATION and formal/external gates remain OPEN. No Erdős controlled-cycle route.",
});
Object.freeze(MATH_LRC_CAMPAIGN_CONTRACT.lrcCampaignScope);
Object.freeze(MATH_LRC_CAMPAIGN_CONTRACT);

export const MATH_LRC_PROOF_UNIT_CONTRACT = Object.freeze(proofUnitMathPilotContractSchema.parse({ version: 3, caseType: "OPEN", lrcProofUnitScope: LRC_PROOF_UNIT_LIVE_SCOPE,
  statement: "Audit the complete fixed p83 proof unit: conditional common14/32-to224 bridge and I(13,83,224)=empty implies J(13,83)=empty under named retained premises. Address every premise and step without claiming global LRC.",
  definitions: "Use the exact frozen TIP-063 packet: labelled13-tuples nonzero modulo83 with repetitions, omitted-LEVEL gcd OR one SAME grid time, strictBAD/equalityGOOD, full symmetry-closure fibres and exact eventual/J quantifiers.",
  assumptions: "Full fixed packet and bounded retained42-file identity admission are host inputs, NOT fresh semantic replay. Generation/cascade/ancestor/terminal remain retained unsigned conditional premises. Frozen UNEXECUTED language is publication-time, actual inputs are separately retained.",
  falsificationCriterion: "Missing/altered definition, quantifier, complete-fibre premise, source identity, role/input binding or honest criticism defeats acceptance. A grid miss is not a continuous-time LRC counterexample.",
  successCriterion: "All three roles address every6 named premises and8 steps. Retain their exact input/schema bindings, actual contexts/accounting and criticism. Root only PARTIAL/INCONCLUSIVE; audit state CONDITIONAL_REVIEWED/INCONCLUSIVE/REJECTED is not proof truth.",
  exclusions: "No otherprime, freshforest, global14/15 LRC, formal proof, novelty, external/human acceptance or automatic retry. Lower independent reproduction/other60primes/23applications/15-dimensional transfer stay OPEN. No Erdős cycle, finite-grid or exact-answer lane.",
}));
Object.freeze(MATH_LRC_PROOF_UNIT_CONTRACT.lrcProofUnitScope);

export const MATH_LRC_METHOD_UNIT_CONTRACT=Object.freeze(methodUnitMathPilotContractSchema.parse({version:4,caseType:"OPEN",lrcMethodUnitScope:LRC_METHOD_UNIT_SCOPE,
 statement:"Reproduce the source conditional few-exception shift lemma for fourteen positive integer moving speeds. Separate exact d3/e2 and d5/e2..4 phase controls from the real-time argument and lower LRC1..12 assumptions.",
 definitions:"15 total runners; LRC(m) means m moving speeds/m+1 total. Prime d, e nondivisible speeds, m_d=ceil(2d/15), e>=2 and e*m_d<d. Strict bad distance<1/15; equality GOOD.",
 assumptions:"Exact pinned Allikvere v2 Lemma4.6 statement and explicit source-adopted LRC1..12. Finite consumer checks all unit phase cells only for supported d/e; lower witness and real-time symbolic alignment remain conditional.",
 falsificationCriterion:"Incorrect statement, quantifier, unit, strict boundary, incomplete partition or host/seed/input lineage defeats admission. A certificate refusal is not an LRC counterexample.",
 successCriterion:"All three roles cover every6premises/7steps; retain exact inputs/accounting and actual host finite result. Root PARTIAL/INCONCLUSIVE; conditional review never global theorem truth.",
 exclusions:"No old ES cycle, old proof-unit reinterpretation, fresh forest, other primes, formal/global14/15 proof, novelty, external acceptance, automatic retry or scope widening."}));

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

// The solver receives only this sealed problem statement and boundary. The
// known answer and review rubric live in math-benchmark-reference.ts.
export const MATH_PILOT_BENCHMARK = mathPilotContractSchema.parse({
  version: 1,
  caseType: "BENCHMARK_PROOF",
  statement: "Let a and b be positive integers such that ab + 1 divides a^2 + b^2. Prove that (a^2 + b^2)/(ab + 1) is the square of an integer.",
  definitions: "a and b are positive integers; divisibility and quotient are in the integers.",
  assumptions: "Use ordinary integer arithmetic. No solution, named method, or reference proof is supplied to the solver.",
  falsificationCriterion: "An admissible positive-integer pair with a nonsquare quotient would refute the claim; a gap in the proof would defeat this attempt's acceptance.",
  successCriterion: "Give a general argument covering every admissible pair, with all arithmetic, positivity, and boundary steps justified.",
  exclusions: "Finite enumeration, citing a source, or assuming the quotient is already a square is not a proof. State uncertainty if the general argument is incomplete.",
});

// Public Epoch AI sample. The published answer is deliberately kept in the
// review-only module, never in this solver-facing sealed contract.
export const MATH_PILOT_EXACT_BENCHMARK = mathPilotContractSchema.parse({
  version: 1,
  caseType: "BENCHMARK_EXACT",
  statement: "Let P be a regular 101-gon of circumradius 1. Draw each diagonal of P independently with probability 0.001. The diagonals split P into closed regions. Let E be the expected perimeter of the region containing the center of P. Compute floor(10^9 E).",
  definitions: "A diagonal joins two nonadjacent vertices. Perimeter is Euclidean length. The center-containing region is selected after every diagonal is independently drawn.",
  assumptions: "Use the exact regular 101-gon geometry and independent Bernoulli draws. Give a decimal integer as the final answer and a Python 3 stdlib-only answer() computation that returns that integer.",
  falsificationCriterion: "A different integer on independent execution, an incorrect perimeter/probability model, or numerical uncertainty crossing an integer boundary defeats acceptance.",
  successCriterion: "Derive a finite expectation formula, compute the requested floor, and include enough numerical precision or a defensible error bound to fix the floor unambiguously.",
  exclusions: "Do not search for a published answer or cite a solution. A matching integer alone does not verify the derivation, numerical error control, or an uncontaminated benchmark result.",
});

export const MATH_PILOT_EXPECTED = {
  CALIBRATION_PROOF: "SUPPORTED_ARGUMENT",
  CALIBRATION_COUNTEREXAMPLE: "VALID_COUNTEREXAMPLE",
} as const;

export function resolveMathPilotContract(raw: MathPilotRequest): MathPilotContract {
  const request = mathPilotRequestSchema.parse(raw);
  if (request.caseType === "LRC_CAMPAIGN") return campaignMathPilotContractSchema.parse(MATH_LRC_CAMPAIGN_CONTRACT);
  if (request.caseType === "LRC_PROOF_UNIT") return proofUnitMathPilotContractSchema.parse(MATH_LRC_PROOF_UNIT_CONTRACT);
  if (request.caseType === "LRC_METHOD_UNIT") return methodUnitMathPilotContractSchema.parse(MATH_LRC_METHOD_UNIT_CONTRACT);
  if (request.caseType === "LRC_FINITE") {
    const scope = lrcFiniteScopeSchema.parse(MATH_LRC_PRESETS[request.preset]);
    return mathPilotContractSchema.parse({ version: 1, caseType: "OPEN", lrcFiniteScope: scope,
      statement: `Audit the finite Lonely Runner grid: N=${scope.totalRunners}, M=${scope.modulus}. For every speed tuple in the sealed Cartesian axes, find j in 0..M-1 with N*min(j*u mod M,M-j*u mod M)>=M for every speed, or certify absence on this grid only.`,
      definitions: "N counts the stationary runner and N-1 positive distinct speeds; t=j/M. Axes specify the entire finite Cartesian domain.",
      assumptions: "Use exact integer arithmetic. Equality at distance 1/N is a valid witness. The scope and axes cannot be narrowed.",
      falsificationCriterion: "An incorrect witness or missing, overlapping or unresolved branch defeats this finite certificate. Grid exclusion is NOT a continuous-time counterexample.",
      successCriterion: "Explain retained independently checked finite witness/exclusion coverage and its limits. Report partial research or uncertainty, never an unrestricted LRC theorem.",
      exclusions: "No induction hypothesis, all-prime coverage, novelty, continuous-time impossibility or automatic human acceptance. Do not use Erdős–Straus cycles or portfolio.",
    });
  }
  if (request.caseType === "BENCHMARK_PROOF") return MATH_PILOT_BENCHMARK;
  if (request.caseType === "BENCHMARK_EXACT") return MATH_PILOT_EXACT_BENCHMARK;
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
    ...(contract.lrcFiniteScope ? [`Sealed finite LRC scope: ${canonicalJson(contract.lrcFiniteScope)}`] : []),
    ...(contract.lrcCampaignScope ? [`Sealed retained LRC campaign scope: ${canonicalJson(contract.lrcCampaignScope)}`] : []),
    ...(contract.lrcProofUnitScope ? [`Sealed prospective LRC proof-unit scope: ${canonicalJson(contract.lrcProofUnitScope)}`] : []),
    ...(contract.lrcMethodUnitScope ? [`Sealed prospective LRC method-unit scope: ${canonicalJson(contract.lrcMethodUnitScope)}`] : []),
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
