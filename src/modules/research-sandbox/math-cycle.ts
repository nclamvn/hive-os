import { z } from "zod";

import { canonicalJson } from "@/modules/execution-fabric/contracts";

import { mathAgentReportSchema } from "./agent-review";
import { erdosStrausWitnessSchema, mathModelAttemptSchema } from "./contracts";
import { hasErdosStrausEquation, MAX_RESIDUAL_SURVEY_N, validateResidualSurveyPlan, type ResidualSurveyEvidence } from "./math-certificates";
import { sha256 } from "./integrity";
import { digestMathPilotContract, mathPilotContractSchema, type MathPilotContract } from "./math-pilot";
import { knownScopeForTask } from "./math-prior-art";
import { frontierAssessmentSchema, frontierDossierSchema } from "./math-frontier";
import { independentReplayReportSchema, validateIndependentReplayReport } from "./math-independent-replay";
import { erdosStrausPolynomialFamilySchema, parametricCertificateSchema } from "./math-parametric";
import { structuralCounterexampleCandidateSchema, structuralCounterexampleReportSchema,
  validateStructuralCounterexampleReport } from "./math-structural-counterexample";
import { structuralGateDossierSchema } from "./math-gate-dossier";
import { structuralProbePlanSchema, structuralProbeReportSchema } from "./math-structural-probe";
import { validateStructuralProbeReport } from "./math-structural-probe";
import { repeatedMathClaim } from "./math-proof-obligations";

const text = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum);
export const mathCycleLimitsSchema = z.object({
  maxRounds: z.number().int().min(1).max(2),
  maxObservedTokens: z.number().int().min(10_000).max(200_000),
}).strict();

export const mathCycleSteeringChoiceSchema = z.object({
  focus: z.enum(["STRUCTURAL_LEMMA", "FINITE_FALSIFICATION"]),
  targetA: z.number().int().min(11).max(47).refine((value) => value % 4 === 3),
  note: z.string().trim().max(500),
  replayCandidate: structuralCounterexampleCandidateSchema.optional(),
}).strict();

export const mathCycleSteeringSchema = mathCycleSteeringChoiceSchema.extend({
  method: z.literal("HUMAN_STEERED_TWO_GATE_V1"),
  approvedByUserId: text(1, 160),
  approvedAt: z.iso.datetime(),
  rootContractDigest: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
export type MathCycleSteering = z.infer<typeof mathCycleSteeringSchema>;

const digest = z.string().regex(/^[a-f0-9]{64}$/);
export const priorFiniteFindingSchema = z.object({
  sourceCycleId: z.uuid(), sourceLedgerDigest: digest, replayDigest: digest,
  prime: z.number().int().positive(), failedThroughA: z.number().int().min(3).max(107),
  firstSuccessA: z.number().int().min(3).max(107).nullable(),
  structuralFacts: z.object({ a3Square: z.boolean().nullable(),
    a3NoPrime2Mod3: z.boolean().nullable(), a7NoDivisor5Mod7: z.boolean().nullable() }).strict().optional(),
}).strict();
export type PriorFiniteFinding = z.infer<typeof priorFiniteFindingSchema>;

/** A replayed finite prime fact can cross case boundaries only inside the
 * same prime-residual Erdős–Straus mission; it never transfers a root claim. */
export function compatibleResidualPrimeRoots(target: MathPilotContract, source: MathPilotContract): boolean {
  const residualPrime = (contract: MathPilotContract) => hasErdosStrausEquation(contract) &&
    /\bprime\b/i.test(contract.statement) && /\b840\b/.test(contract.statement);
  return residualPrime(target) && residualPrime(source);
}

export function mathCycleSteeringDigest(steering: MathCycleSteering): string {
  return sha256(canonicalJson(mathCycleSteeringSchema.parse(steering)));
}

export function steeringProposalIssue(steering: MathCycleSteering, proposal: MathCycleProposal,
  priorFindings: readonly PriorFiniteFinding[] = []): string | null {
  const task = `${proposal.hypothesis}\n${proposal.taskStatement}`;
  if (!new RegExp(`\\bA\\s*=\\s*${steering.targetA}\\b`).test(proposal.taskStatement) ||
    !/prime/i.test(proposal.taskStatement) || !/840/.test(proposal.taskStatement)) {
    return "Task does not explicitly bind the human-approved target and prime domain";
  }
  if (steering.focus === "STRUCTURAL_LEMMA" &&
    (proposal.exactSurveyPlan || !/A\s*=\s*3\b/.test(task) || !/A\s*=\s*7\b/.test(task))) {
    return "Structural task must use the two-gate survivor class and cannot be only a finite survey";
  }
  if (steering.focus === "STRUCTURAL_LEMMA" && steering.replayCandidate) {
    const missing = [];
    for (let a = steering.replayCandidate.failedThroughA; a < steering.targetA; a += 4) {
      if (!new RegExp(`\\bA\\s*=\\s*${a}\\b`).test(task)) missing.push(a);
    }
    if (missing.length) {
      return `New structural task must explicitly address every intervening survivor gate: A=${missing.join(", A=")}`;
    }
  }
  if (steering.focus === "STRUCTURAL_LEMMA") {
    const hypothesis = proposal.hypothesis.replace(/\s+/g, "");
    const success = proposal.successEvidence.replace(/\s+/g, "");
    const targetVariable = new RegExp(`([a-z])=\\([np]\\+${steering.targetA}\\)\\/4`, "i").exec(hypothesis)?.[1];
    const claimedVariable = /4\/[np]=1\/([a-z])\+1\//i.exec(success)?.[1];
    if (targetVariable && claimedVariable && targetVariable.toLowerCase() !== claimedVariable.toLowerCase()) {
      return "Success identity uses a different first denominator than the human-approved target gate";
    }
  }
  if (steering.focus === "STRUCTURAL_LEMMA" && priorFindings.some((finding) =>
    finding.failedThroughA >= steering.targetA &&
    new RegExp(`^For every prime p[^,]{0,50}840[^,]{0,20}, if no .+ at A=3 and none(?: .+)? at A=7, then .+ at A=${steering.targetA}\\.?$`, "i")
      .test(proposal.hypothesis))) {
    return "Proposed universal two-gate implication conflicts with an independently replayed prior failure";
  }
  if (steering.focus === "FINITE_FALSIFICATION" &&
    (!proposal.exactSurveyPlan || proposal.exactSurveyPlan.maxA !== steering.targetA)) {
    return "Finite task must bind its exact A-bound to the human-approved target";
  }
  return null;
}

export const mathCycleProposalSchema = z.object({
  sourceGap: text(12, 2_000),
  hypothesis: text(20, 2_000),
  taskStatement: text(30, 4_000),
  falsificationPlan: text(20, 1_000),
  successEvidence: text(20, 1_000),
  rationale: text(30, 2_000),
  // Optional for immutable pre-tool proposals. New Codex output always supplies a value or null.
  exactSurveyPlan: z.object({
    kind: z.literal("ERDOS_STRAUS_RESIDUAL_A"),
    lowerExclusive: z.number().int().min(840).max(MAX_RESIDUAL_SURVEY_N),
    upperInclusive: z.number().int().min(841).max(MAX_RESIDUAL_SURVEY_N),
    maxA: z.number().int().min(3).max(107),
  }).strict().nullable().optional(),
  // Optional only for historical proposals. New Codex responses always supply a plan or null.
  structuralProbePlan: structuralProbePlanSchema.nullable().optional(),
}).strict();

export const residualSurveyEvidenceSchema: z.ZodType<ResidualSurveyEvidence> = z.object({
  method: z.enum(["ERDOS_STRAUS_RESIDUAL_SURVEY_V2", "ERDOS_STRAUS_RESIDUAL_SURVEY_V3"]),
  plan: mathCycleProposalSchema.shape.exactSurveyPlan.unwrap().unwrap(),
  primeCount: z.number().int().nonnegative(),
  failureCount: z.number().int().nonnegative(),
  firstFailure: z.object({ n: z.number().int(), maxA: z.number().int(), firstA: z.number().int().nullable(),
    witness: erdosStrausWitnessSchema.nullable() }).strict().nullable(),
  firstFailureRescue: z.object({ n: z.number().int(), maxA: z.number().int(), firstA: z.number().int().nullable(),
    witness: erdosStrausWitnessSchema.nullable() }).strict().nullable(),
  manifestDigest: z.string().regex(/^[a-f0-9]{64}$/),
  firstFailureAudit: z.object({
    method: z.literal("ERDOS_STRAUS_EXCLUSION_AUDIT_V1"),
    n: z.number().int(), maxA: z.number().int(), primeTrialLimit: z.number().int(),
    rows: z.array(z.object({
      a: z.number().int(), x: z.number().int(),
      xFactors: z.array(z.object({ prime: z.number().int(), exponent: z.number().int().positive() }).strict()),
      factorPairsChecked: z.number().int().nonnegative(), admissiblePairs: z.number().int().nonnegative(),
    }).strict()).max(27),
    auditDigest: z.string().regex(/^[a-f0-9]{64}$/),
  }).strict().optional(),
}).strict().superRefine((evidence, ctx) => {
  if (evidence.method === "ERDOS_STRAUS_RESIDUAL_SURVEY_V3" && evidence.firstFailure && !evidence.firstFailureAudit) {
    ctx.addIssue({ code: "custom", path: ["firstFailureAudit"], message: "V3 failure requires a replayable per-A audit" });
  }
});

export const mathCycleVerificationSchema = z.object({
  decision: z.enum(["ACCEPT", "REJECT"]),
  sourceGap: text(12, 2_000),
  scopeCheck: text(20, 1_000),
  noveltyCheck: text(20, 1_000),
  falsifiabilityCheck: text(20, 1_000),
  unresolvedRisk: text(20, 1_000),
}).strict();

export const mathCycleUsageSchema = mathModelAttemptSchema.shape.usage;
export const mathCycleModelResultSchema = z.object({
  threadId: text(1, 160),
  usage: mathCycleUsageSchema,
}).strict();

const priorArtFactSchema = z.object({
  id: text(4, 160), claim: text(20, 1_000), sourceUrl: z.url(), sourceTitle: text(8, 300),
  modulus: z.number().int().positive().nullable(), residue: z.number().int().nonnegative().nullable(),
  condition: z.enum(["FIRST_GATE_DIVISOR_MOD_3", "SECOND_GATE_DIVISOR_MOD_7", "GENERAL_DIVISOR_RESIDUE_GATE"]).optional(),
  // Optional only to keep pre-TIP-032 immutable PRIOR_ART events readable.
  sourceScope: z.enum(["ALL_INTEGERS", "ODD_PRIMES"]).optional(), scopeLift: text(20, 1_000).optional(),
}).strict();

export const mathCycleEventPayloadSchema = z.discriminatedUnion("phase", [
  z.object({ phase: z.literal("HUMAN_STEERED"), round: z.literal(1), steering: mathCycleSteeringSchema,
    steeringDigest: z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
  z.object({ phase: z.literal("PRIOR_FINDINGS"), round: z.number().int().positive(),
    findings: z.array(priorFiniteFindingSchema).min(1).max(8) }).strict(),
  z.object({ phase: z.literal("PRIOR_COUNTEREXAMPLE_REPLAY"), round: z.literal(1),
    candidate: structuralCounterexampleCandidateSchema, report: structuralCounterexampleReportSchema }).strict(),
  z.object({ phase: z.literal("PRIOR_GATE_DOSSIER"), round: z.literal(1),
    dossier: structuralGateDossierSchema }).strict(),
  z.object({ phase: z.literal("PRIOR_ART"), round: z.number().int().positive(), facts: z.array(priorArtFactSchema).max(32),
    coverage: z.literal("CURATED_PARTIAL") }).strict(),
  z.object({ phase: z.literal("FRONTIER_DOSSIER"), round: z.number().int().positive(), dossier: frontierDossierSchema }).strict(),
  z.object({ phase: z.literal("FRONTIER_REVIEWED"), round: z.number().int().positive(), role: z.enum(["SOURCE_ANALYST", "SOURCE_CHALLENGER"]),
    dossierDigest: z.string().regex(/^[a-f0-9]{64}$/), assessment: frontierAssessmentSchema, context: mathCycleModelResultSchema }).strict(),
  z.object({ phase: z.literal("FRONTIER_GATE"), round: z.number().int().positive(), decision: z.enum(["KNOWN", "RESEARCH_ONLY", "HOLD"]),
    dossierDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable(), reason: text(12, 1_000) }).strict(),
  z.object({ phase: z.literal("CALL_STARTED"), role: z.enum(["PLANNER", "SOURCE_ANALYST", "SOURCE_CHALLENGER", "VERIFIER", "SOLVER", "CRITIC", "ADVERSARY"]), round: z.number().int().positive() }).strict(),
  z.object({ phase: z.literal("PROPOSED"), round: z.number().int().positive(), proposal: mathCycleProposalSchema, context: mathCycleModelResultSchema }).strict(),
  z.object({ phase: z.literal("STRUCTURAL_PROBED"), round: z.number().int().positive(), report: structuralProbeReportSchema }).strict(),
  z.object({ phase: z.literal("VERIFIED"), round: z.number().int().positive(), verification: mathCycleVerificationSchema, context: mathCycleModelResultSchema, accepted: z.boolean(), reason: text(12, 1_000) }).strict(),
  z.object({ phase: z.literal("COMPUTED"), round: z.number().int().positive(), evidence: residualSurveyEvidenceSchema }).strict(),
  z.object({ phase: z.literal("INDEPENDENT_REPLAY"), round: z.number().int().positive(),
    report: independentReplayReportSchema }).strict(),
  z.object({ phase: z.literal("ATTEMPTED"), round: z.number().int().positive(), contract: mathPilotContractSchema, attempt: mathModelAttemptSchema }).strict(),
  z.object({ phase: z.literal("CERTIFICATE_CHECKED"), round: z.number().int().positive(), method: z.literal("ERDOS_STRAUS_EXACT_IDENTITY_V1"),
    checks: z.array(z.object({ witness: erdosStrausWitnessSchema, valid: z.boolean(),
      identityDigest: z.string().regex(/^[a-f0-9]{64}$/).nullable() }).strict()).max(4) }).strict(),
  z.object({ phase: z.literal("PARAMETRIC_CHECKED"), round: z.number().int().positive(),
    checks: z.array(z.object({ family: erdosStrausPolynomialFamilySchema,
      certificate: parametricCertificateSchema }).strict()).max(2) }).strict(),
  z.object({ phase: z.literal("COUNTEREXAMPLE_REPLAY"), round: z.number().int().positive(),
    candidate: structuralCounterexampleCandidateSchema, report: structuralCounterexampleReportSchema }).strict(),
  z.object({ phase: z.literal("REVIEWED"), round: z.number().int().positive(), role: z.enum(["CRITIC", "ADVERSARY"]), report: mathAgentReportSchema }).strict(),
  z.object({ phase: z.literal("ROUND_CLOSED"), round: z.number().int().positive(), disposition: z.enum(["AI_REVIEWED", "INCONCLUSIVE"]), conclusion: z.enum(["PARTIAL", "INCONCLUSIVE"]), nextGap: text(12, 2_000).nullable() }).strict(),
  z.object({ phase: z.literal("STOPPED"), round: z.number().int().nonnegative(), reason: z.enum(["ROUND_LIMIT", "TOKEN_LIMIT", "TIME_LIMIT", "NO_GAP", "DUPLICATE_CLAIM", "VERIFICATION_REJECTED", "COUNTEREXAMPLE_REJECTED", "STRUCTURAL_PROBE_HOLD", "STRUCTURAL_REFUTED", "FRONTIER_HOLD", "KNOWN_SCOPE", "MODEL_FAILURE", "INTEGRITY_FAILURE"]) }).strict(),
]);

export type MathCycleProposal = z.infer<typeof mathCycleProposalSchema>;
export type MathCycleVerification = z.infer<typeof mathCycleVerificationSchema>;
export type MathCycleEventPayload = z.infer<typeof mathCycleEventPayloadSchema>;
export type MathCycleUsage = z.infer<typeof mathCycleUsageSchema>;

/** Promote only a fully replayed finite exclusion, never an LLM conclusion, to planning memory. */
export function priorFiniteFindingFromTrace(input: {
  cycleId: string; sourceLedgerDigest: string; trace: MathCycleEventPayload[];
}): PriorFiniteFinding | null {
  for (const event of input.trace) {
    if (event.phase !== "COMPUTED") continue;
    const evidence = event.evidence;
    const audit = evidence.firstFailureAudit;
    const failure = evidence.firstFailure;
    if (!audit || !failure) continue;
    const replay = input.trace.find((candidate) => candidate.phase === "INDEPENDENT_REPLAY" &&
      candidate.round === event.round);
    if (replay?.phase !== "INDEPENDENT_REPLAY" || !validateIndependentReplayReport(evidence, replay.report)) continue;
    const expectedA = Array.from({ length: (evidence.plan.maxA - 3) / 4 + 1 }, (_, i) => 3 + 4 * i);
    if (audit.n !== failure.n || audit.maxA !== evidence.plan.maxA ||
      audit.rows.length !== expectedA.length ||
      audit.rows.some((row, index) => row.a !== expectedA[index] || row.admissiblePairs !== 0)) continue;
    const rescue = evidence.firstFailureRescue;
    if (rescue && rescue.n !== failure.n) continue;
    return priorFiniteFindingSchema.parse({ sourceCycleId: input.cycleId,
      sourceLedgerDigest: input.sourceLedgerDigest, replayDigest: replay.report.reportDigest,
      prime: failure.n, failedThroughA: evidence.plan.maxA,
      firstSuccessA: rescue?.firstA ?? null });
  }
  for (const event of input.trace) {
    if (event.phase !== "STRUCTURAL_PROBED" || event.report.status !== "REFUTED" ||
      !event.report.candidate || !event.report.independentReplay ||
      !validateStructuralProbeReport(event.report.plan, event.report)) continue;
    return priorFiniteFindingSchema.parse({ sourceCycleId: input.cycleId,
      sourceLedgerDigest: input.sourceLedgerDigest,
      replayDigest: event.report.independentReplay.reportDigest,
      prime: event.report.candidate.prime, failedThroughA: event.report.plan.targetA,
      firstSuccessA: null });
  }
  for (const event of input.trace) {
    if ((event.phase !== "COUNTEREXAMPLE_REPLAY" && event.phase !== "PRIOR_COUNTEREXAMPLE_REPLAY") ||
      event.report.status !== "PASS" ||
      !validateStructuralCounterexampleReport(event.candidate, event.report)) continue;
    return priorFiniteFindingSchema.parse({ sourceCycleId: input.cycleId,
      sourceLedgerDigest: input.sourceLedgerDigest, replayDigest: event.report.reportDigest,
      prime: event.candidate.prime, failedThroughA: event.candidate.failedThroughA,
      firstSuccessA: null,
      structuralFacts: { a3Square: event.report.a3Square,
        a3NoPrime2Mod3: event.report.a3NoPrime2Mod3,
        a7NoDivisor5Mod7: event.report.a7NoDivisor5Mod7 } });
  }
  return null;
}

export function mathCycleEventDigest(previousDigest: string | null, payload: MathCycleEventPayload): string {
  return sha256(canonicalJson({ previousDigest, payload: mathCycleEventPayloadSchema.parse(payload) }));
}

export function verifyMathCycleProposal(input: {
  rootContract: MathPilotContract;
  availableGaps: string[];
  priorTasks: string[];
  proposal: MathCycleProposal;
  verification: MathCycleVerification;
  plannerThreadId: string;
  verifierThreadId: string;
  steering?: MathCycleSteering | null;
  priorFindings?: readonly PriorFiniteFinding[];
  priorClaims?: readonly string[];
}): { accepted: boolean; reason: string } {
  const { rootContract, proposal, verification } = input;
  if (input.plannerThreadId === input.verifierThreadId) return { accepted: false, reason: "Planner and verifier did not use independent contexts" };
  if (!input.availableGaps.includes(proposal.sourceGap)) return { accepted: false, reason: "Proposed gap is not an exact retained review gap" };
  if (verification.sourceGap !== proposal.sourceGap) return { accepted: false, reason: "Verifier did not bind to the same review gap" };
  if (proposal.taskStatement === rootContract.statement || input.priorTasks.includes(proposal.taskStatement)) {
    return { accepted: false, reason: "Task duplicates the root statement or an earlier task" };
  }
  if (repeatedMathClaim(proposal, input.priorClaims ?? [])) {
    return { accepted: false, reason: "Hypothesis repeats a retained prior claim after normalization" };
  }
  if (input.steering) {
    const steering = mathCycleSteeringSchema.parse(input.steering);
    if (!hasErdosStrausEquation(rootContract) ||
      steering.rootContractDigest !== digestMathPilotContract(rootContract)) {
      return { accepted: false, reason: "Human directive does not bind to this Erdős–Straus root" };
    }
    const issue = steeringProposalIssue(steering, proposal, input.priorFindings);
    if (issue) return { accepted: false, reason: issue };
  }
  if (subtaskStatement(proposal).length > 4_000) {
    return { accepted: false, reason: "Hypothesis and task cannot fit together in the sealed subtask contract" };
  }
  if (proposal.exactSurveyPlan) {
    if (!hasErdosStrausEquation(rootContract)) return { accepted: false, reason: "Exact residual survey is unsupported for this root contract" };
    try { validateResidualSurveyPlan(proposal.exactSurveyPlan); }
    catch { return { accepted: false, reason: "Exact residual survey plan is outside the bounded computation domain" }; }
    if (![proposal.exactSurveyPlan.lowerExclusive, proposal.exactSurveyPlan.upperInclusive,
      proposal.exactSurveyPlan.maxA].every((value) => new RegExp(`(?:^|\\D)${value}(?=\\D|$)`).test(proposal.taskStatement)) ||
      !/prime/i.test(proposal.taskStatement) || !/840/.test(proposal.taskStatement)) {
      return { accepted: false, reason: "Exact survey bounds are not explicitly bound to the proposed task" };
    }
  }
  if (proposal.structuralProbePlan && (!hasErdosStrausEquation(rootContract) ||
    (input.steering?.focus === "STRUCTURAL_LEMMA" && proposal.structuralProbePlan.targetA !== input.steering.targetA))) {
    return { accepted: false, reason: "Structural probe does not bind the approved root and target A" };
  }
  const priorArt = knownScopeForTask(rootContract, `${proposal.hypothesis}\n${proposal.taskStatement}`) ??
    knownScopeForTask(rootContract, proposal.taskStatement) ??
    knownScopeForTask(rootContract, proposal.hypothesis);
  if (priorArt) return { accepted: false, reason: `Task targets a sourced known construction (${priorArt.id}): ${priorArt.sourceUrl}` };
  if (verification.decision !== "ACCEPT") return { accepted: false, reason: "Independent verifier rejected the task" };
  return { accepted: true, reason: "Exact-gap and distinct-context checks passed; literature novelty remains unverified beyond the curated prior-art screen" };
}

export function taskContract(root: MathPilotContract, proposal: MathCycleProposal): MathPilotContract {
  return mathPilotContractSchema.parse({
    ...root,
    statement: subtaskStatement(proposal),
    falsificationCriterion: proposal.falsificationPlan,
    successCriterion: proposal.successEvidence,
    exclusions: root.exclusions,
  });
}

function subtaskStatement(proposal: MathCycleProposal): string {
  const plan = proposal.exactSurveyPlan;
  return `Hypothesis: ${proposal.hypothesis}\nTask: ${proposal.taskStatement}` +
    (plan ? `\nExact computation scope: prime p congruent to 1 modulo 840, ${plan.lowerExclusive} < p <= ${plan.upperInclusive}; x=(p+A)/4, A=3,7,...,${plan.maxA}. This finite scan does not prove a universal statement.` : "");
}

export function observedTokens(usage: MathCycleUsage): number {
  return usage.inputTokens + usage.outputTokens;
}

/** Evaluated before every call; token usage is only known after a call. */
export function cycleResourceStopReason(input: {
  callsStarted: number; maxCalls: number; observedTokens: number; maxObservedTokens: number;
  deadlineAt: Date; now: Date;
}): "ROUND_LIMIT" | "TOKEN_LIMIT" | "TIME_LIMIT" | null {
  if (input.callsStarted >= input.maxCalls) return "ROUND_LIMIT";
  if (input.observedTokens >= input.maxObservedTokens) return "TOKEN_LIMIT";
  if (input.now >= input.deadlineAt) return "TIME_LIMIT";
  return null;
}
