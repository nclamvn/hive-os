import { randomUUID } from "node:crypto";

import type { MathResearchCycle, Prisma } from "@prisma/client";

import { organizationIdForWorkspace, requireWorkspaceAuthorization } from "@/modules/authorization";
import { executeDurableCommand } from "@/modules/command-runtime";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { withOrganizationTenant, type TenantTransaction } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { evaluateMathAgentReview, validateRecordedMathAgentReview, type MathAgentReport } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { hasErdosStrausEquation, surveyResidualInterval, verifyErdosStrausWitness, type ResidualSurveyEvidence } from "./math-certificates";
import { ResearchSandboxError } from "./errors";
import { researchDossierDigest } from "./integrity";
import {
  cycleResourceStopReason, mathCycleEventDigest, mathCycleEventPayloadSchema, mathCycleLimitsSchema, mathCycleProposalSchema,
  mathCycleSteeringChoiceSchema, mathCycleSteeringDigest, mathCycleSteeringSchema,
  mathCycleVerificationSchema, observedTokens, priorFiniteFindingFromTrace, compatibleResidualPrimeRoots,
  taskContract,
  verifyMathCycleProposal, type MathCycleEventPayload, type MathCycleProposal, type MathCycleSteering,
  type MathCycleUsage, type MathCycleVerification, type PriorFiniteFinding,
} from "./math-cycle";
import { digestMathPilotContract, mathPilotContractSchema, type MathPilotContract } from "./math-pilot";
import { mathAgentReportSchema } from "./agent-review";
import { knownScopeForTask, mathPriorArtFor, type MathPriorArtFact } from "./math-prior-art";
import { frontierAssessmentSchema, frontierGate, verifyFrontierDossier,
  type FrontierAssessment, type FrontierDossier } from "./math-frontier";
import { runIndependentResidualReplay, validateIndependentReplayRecord, validateIndependentReplayReport,
  type IndependentReplayReport } from "./math-independent-replay";
import { verifyErdosStrausPolynomialFamily } from "./math-parametric";
import { runStructuralCounterexampleReplay, validateStructuralCounterexampleReport,
  type StructuralCounterexampleReport } from "./math-structural-counterexample";
import { runStructuralGateDossier, validateStructuralGateDossier,
  type StructuralGateDossier } from "./math-gate-dossier";
import { runStructuralProbe, validateStructuralProbeReport, type StructuralProbeReport } from "./math-structural-probe";
import { projectMathProofObligations, repeatedMathClaim, type MathProofObligation } from "./math-proof-obligations";
import { branchResourceStopReason, sealMathPortfolio, selectMathPortfolioBranch,
  summarizeMathPortfolio, validMathPortfolio, type MathPortfolio } from "./math-portfolio";
import { mixedCoreRefutation, runMixedCoreAgentEvidence, validateMixedCoreAgentEvidence,
  type MixedCoreAgentEvidence } from "./math-mixed-core-agent";

type CycleStopReason = "ROUND_LIMIT" | "TOKEN_LIMIT" | "TIME_LIMIT" | "BRANCH_TOKEN_LIMIT" | "BRANCH_TIME_LIMIT" | "NO_GAP" | "DUPLICATE_CLAIM" | "VERIFICATION_REJECTED" | "COUNTEREXAMPLE_REJECTED" | "STRUCTURAL_PROBE_HOLD" | "STRUCTURAL_REFUTED" | "FRONTIER_HOLD" | "KNOWN_SCOPE" | "MODEL_FAILURE" | "INTEGRITY_FAILURE";

export interface MathCycleAgents {
  modelName: string;
  reviewRoleModels?: { CRITIC: string; ADVERSARY: string };
  proposePortfolio?(root: MathPilotContract, availableGaps: string[], previousTasks: string[],
    priorArt: readonly MathPriorArtFact[], priorFindings: readonly PriorFiniteFinding[],
    gateDossier: StructuralGateDossier | null, priorObligations: readonly MathProofObligation[],
    mixedCoreEvidence?: MixedCoreAgentEvidence | null): Promise<{
    output: unknown; threadId: string; usage: MathCycleUsage;
  }>;
  propose(root: MathPilotContract, availableGaps: string[], previousTasks: string[], priorArt: readonly MathPriorArtFact[],
    steering?: MathCycleSteering | null, priorFindings?: readonly PriorFiniteFinding[],
    gateDossier?: StructuralGateDossier | null, priorObligations?: readonly MathProofObligation[],
    mixedCoreEvidence?: MixedCoreAgentEvidence | null): Promise<{
    output: MathCycleProposal; threadId: string; usage: MathCycleUsage;
  }>;
  verify(root: MathPilotContract, availableGaps: string[], previousTasks: string[], proposal: MathCycleProposal,
    priorArt: readonly MathPriorArtFact[], steering?: MathCycleSteering | null,
    priorFindings?: readonly PriorFiniteFinding[], frontierAssessments?: readonly FrontierAssessment[],
    gateDossier?: StructuralGateDossier | null, structuralProbe?: StructuralProbeReport | null,
    priorObligations?: readonly MathProofObligation[], mixedCoreEvidence?: MixedCoreAgentEvidence | null): Promise<{
    output: MathCycleVerification; threadId: string; usage: MathCycleUsage;
  }>;
  buildFrontierDossier(root: MathPilotContract): Promise<FrontierDossier>;
  assessFrontier(role: "SOURCE_ANALYST" | "SOURCE_CHALLENGER", root: MathPilotContract,
    proposal: MathCycleProposal, dossier: FrontierDossier): Promise<{
    output: FrontierAssessment; threadId: string; usage: MathCycleUsage;
  }>;
  solve(contract: MathPilotContract, evidence: ResidualSurveyEvidence | null,
    replay?: IndependentReplayReport | null,
    gateDossier?: StructuralGateDossier | null,
    mixedCoreEvidence?: MixedCoreAgentEvidence | null): Promise<ReturnType<typeof mathModelAttemptSchema.parse>>;
  reviewRole(role: MathAgentReport["role"], contract: MathPilotContract,
    attempt: ReturnType<typeof mathModelAttemptSchema.parse>, evidence: ResidualSurveyEvidence | null,
    replay?: IndependentReplayReport | null,
    counterexampleReplay?: StructuralCounterexampleReport | null,
    gateDossier?: StructuralGateDossier | null, mixedCoreEvidence?: MixedCoreAgentEvidence | null): Promise<MathAgentReport>;
}

export function validateMathCycleTrace(events: Array<{ sequence: number; round: number; phase: string;
  payload: unknown; previousDigest: string | null; digest: string }>, expectedRootDigest?: string): MathCycleEventPayload[] | null {
  let previous: string | null = null;
  const payloads: MathCycleEventPayload[] = [];
  const frontierDigestByRound = new Map<number, string>();
  const attemptsByRound = new Map<number, ReturnType<typeof mathModelAttemptSchema.parse>>();
  const proposalsByRound = new Map<number, MathCycleProposal>();
  const acceptedRounds = new Set<number>();
  const computedRounds = new Set<number>();
  const evidenceByRound = new Map<number, ResidualSurveyEvidence>();
  const replayedRounds = new Set<number>();
  const replayEvents = new Set<number>();
  const parametricCheckedRounds = new Set<number>();
  const counterexampleReplayedRounds = new Set<number>();
  const counterexampleEvents = new Set<number>();
  const structuralProbeRounds = new Set<number>();
  const structuralRefutedRounds = new Set<number>();
  let portfolio: MathPortfolio | null = null;
  const selectedBranches = new Map<number, string>();
  const closedBranches = new Set<string>();
  let portfolioExhausted = false;
  let priorCounterexampleReplay = false;
  let priorCounterexamplePassed = false;
  let priorGateDossier = false;
  let humanSteering: MathCycleSteering | null = null;
  const priorFindingRounds = new Set<number>();
  let mixedCoreMethod = false;
  let mixedCoreEvidence: MixedCoreAgentEvidence | null = null;
  const mixedCoreRefutedRounds = new Set<number>();
  for (const [index, event] of events.entries()) {
    const parsed = mathCycleEventPayloadSchema.safeParse(event.payload);
    if (!parsed.success || event.sequence !== index + 1 || event.round !== parsed.data.round ||
      event.phase !== parsed.data.phase || event.previousDigest !== previous ||
      event.digest !== mathCycleEventDigest(previous, parsed.data)) return null;
    if (portfolioExhausted && parsed.data.phase !== "STOPPED") return null;
    if (mixedCoreEvidence?.replay.status !== undefined && mixedCoreEvidence.replay.status !== "PASS" &&
      (parsed.data.phase !== "STOPPED" || parsed.data.reason !== "INTEGRITY_FAILURE")) return null;
    if (parsed.data.phase === "PRIOR_ART" && parsed.data.researchMethod) {
      if (mixedCoreMethod || parsed.data.round !== 1 || payloads.some((p) => p.phase === "CALL_STARTED")) return null;
      mixedCoreMethod = true;
    }
    if (parsed.data.phase === "MIXED_CORE_EVIDENCE") {
      if (!mixedCoreMethod || mixedCoreEvidence || payloads.some((p) =>
        ["CALL_STARTED", "PROPOSED", "PORTFOLIO_PLANNED"].includes(p.phase)) ||
        !validateMixedCoreAgentEvidence(parsed.data.evidence, expectedRootDigest ?? humanSteering?.rootContractDigest)) return null;
      mixedCoreEvidence = parsed.data.evidence;
    }
    if (mixedCoreMethod && ["CALL_STARTED", "PORTFOLIO_PLANNED", "PROPOSED", "VERIFIED", "ATTEMPTED", "REVIEWED"].includes(parsed.data.phase) &&
      mixedCoreEvidence?.replay.status !== "PASS") return null;
    if (mixedCoreEvidence && proposalsByRound.get(parsed.data.round)?.mixedCoreClaim &&
      ["CALL_STARTED", "FRONTIER_DOSSIER", "VERIFIED", "ATTEMPTED", "REVIEWED"].includes(parsed.data.phase)) return null;
    if (parsed.data.phase === "MIXED_CORE_CLAIM_REFUTED") {
      if (!mixedCoreEvidence || mixedCoreRefutedRounds.has(parsed.data.round) || frontierDigestByRound.has(parsed.data.round) ||
        proposalsByRound.get(parsed.data.round)?.mixedCoreClaim !== parsed.data.claim ||
        parsed.data.evidenceDigest !== mixedCoreEvidence.evidenceDigest ||
        !mixedCoreRefutation(parsed.data.claim, mixedCoreEvidence)) return null;
      mixedCoreRefutedRounds.add(parsed.data.round);
    }
    if (structuralRefutedRounds.has(parsed.data.round) &&
      !(portfolio && ["ROUND_CLOSED", "BRANCH_CLOSED", "PORTFOLIO_EXHAUSTED", "STOPPED"].includes(parsed.data.phase)) &&
      parsed.data.phase !== "STOPPED") return null;
    if (parsed.data.phase === "MIXED_CORE_CLAIM_REFUTED") structuralRefutedRounds.add(parsed.data.round);
    if (parsed.data.phase === "PORTFOLIO_PLANNED") {
      if (portfolio || proposalsByRound.size || !validMathPortfolio(parsed.data.portfolio)) return null;
      portfolio = parsed.data.portfolio;
    }
    if (parsed.data.phase === "BRANCH_SELECTED") {
      const branchId = parsed.data.branchId;
      if (!portfolio || parsed.data.portfolioDigest !== portfolio.portfolioDigest ||
        !portfolio.branches.some((branch) => branch.branchId === branchId) ||
        selectedBranches.has(parsed.data.round) || [...selectedBranches.values()].includes(branchId) ||
        proposalsByRound.has(parsed.data.round)) return null;
      selectedBranches.set(parsed.data.round, branchId);
    }
    if (parsed.data.phase === "BRANCH_CLOSED") {
      if (!portfolio || parsed.data.portfolioDigest !== portfolio.portfolioDigest ||
        selectedBranches.get(parsed.data.round) !== parsed.data.branchId ||
        closedBranches.has(parsed.data.branchId)) return null;
      closedBranches.add(parsed.data.branchId);
    }
    if (parsed.data.phase === "PORTFOLIO_EXHAUSTED") {
      if (!portfolio || portfolioExhausted || parsed.data.portfolioDigest !== portfolio.portfolioDigest ||
        canonicalJson(parsed.data.branches) !== canonicalJson(summarizeMathPortfolio(portfolio, payloads))) return null;
      portfolioExhausted = true;
    }
    if (parsed.data.phase === "HUMAN_STEERED") {
      if (index !== 0 || humanSteering || parsed.data.steeringDigest !== mathCycleSteeringDigest(parsed.data.steering) ||
        (expectedRootDigest !== undefined && parsed.data.steering.rootContractDigest !== expectedRootDigest)) return null;
      humanSteering = parsed.data.steering;
    }
    if (parsed.data.phase === "PRIOR_FINDINGS") {
      if (priorFindingRounds.has(parsed.data.round) || proposalsByRound.has(parsed.data.round)) return null;
      priorFindingRounds.add(parsed.data.round);
    }
    if (parsed.data.phase === "PRIOR_COUNTEREXAMPLE_REPLAY") {
      if (!humanSteering?.replayCandidate || priorCounterexampleReplay || proposalsByRound.has(1) ||
        canonicalJson(humanSteering.replayCandidate) !== canonicalJson(parsed.data.candidate) ||
        !validateStructuralCounterexampleReport(parsed.data.candidate, parsed.data.report)) return null;
      priorCounterexampleReplay = true;
      priorCounterexamplePassed = parsed.data.report.status === "PASS";
    }
    if (parsed.data.phase === "PRIOR_GATE_DOSSIER") {
      if (!humanSteering?.replayCandidate || !priorCounterexamplePassed || priorGateDossier ||
        proposalsByRound.has(1) || parsed.data.dossier.targetA !== humanSteering.targetA ||
        canonicalJson(parsed.data.dossier.candidate) !== canonicalJson(humanSteering.replayCandidate) ||
        !validateStructuralGateDossier(parsed.data.dossier)) return null;
      priorGateDossier = true;
    }
    if (parsed.data.phase === "FRONTIER_DOSSIER") {
      if (mixedCoreEvidence && proposalsByRound.get(parsed.data.round)?.mixedCoreClaim) return null;
      if (proposalsByRound.get(parsed.data.round)?.structuralProbePlan &&
        !structuralProbeRounds.has(parsed.data.round)) return null;
      if (!verifyFrontierDossier(parsed.data.dossier) || frontierDigestByRound.has(parsed.data.round)) return null;
      frontierDigestByRound.set(parsed.data.round, parsed.data.dossier.dossierDigest);
    }
    if (parsed.data.phase === "FRONTIER_REVIEWED" &&
      frontierDigestByRound.get(parsed.data.round) !== parsed.data.dossierDigest) return null;
    if (parsed.data.phase === "FRONTIER_GATE" &&
      (frontierDigestByRound.get(parsed.data.round) ?? null) !== parsed.data.dossierDigest) return null;
    if (parsed.data.phase === "PROPOSED") {
      if (mixedCoreMethod && proposalsByRound.has(parsed.data.round)) return null;
      // A sealed proposal must stay readable when future admission rules become
      // stricter. Recheck the immutable target binding, not today's policy.
      if (humanSteering && (parsed.data.round !== 1 ||
        (humanSteering.replayCandidate && !priorCounterexamplePassed) ||
        !new RegExp(`\\bA\\s*=\\s*${humanSteering.targetA}\\b`).test(parsed.data.proposal.taskStatement))) return null;
      if (portfolio) {
        const selectedId = selectedBranches.get(parsed.data.round);
        if (!selectedId || canonicalJson(portfolio.branches.find((branch) =>
          branch.branchId === selectedId)?.proposal ?? null) !== canonicalJson(parsed.data.proposal)) return null;
      }
      proposalsByRound.set(parsed.data.round, parsed.data.proposal);
    }
    if (parsed.data.phase === "STRUCTURAL_PROBED") {
      const plan = proposalsByRound.get(parsed.data.round)?.structuralProbePlan;
      if (!plan || structuralProbeRounds.has(parsed.data.round) || frontierDigestByRound.has(parsed.data.round) ||
        !validateStructuralProbeReport(plan, parsed.data.report)) return null;
      structuralProbeRounds.add(parsed.data.round);
      if (parsed.data.report.status === "REFUTED") structuralRefutedRounds.add(parsed.data.round);
    }
    if (parsed.data.phase === "VERIFIED" &&
      (proposalsByRound.get(parsed.data.round)?.structuralProbePlan && !structuralProbeRounds.has(parsed.data.round) ||
        structuralRefutedRounds.has(parsed.data.round))) return null;
    if (parsed.data.phase === "VERIFIED" && parsed.data.accepted) acceptedRounds.add(parsed.data.round);
    if (parsed.data.phase === "COMPUTED") {
      const plan = proposalsByRound.get(parsed.data.round)?.exactSurveyPlan;
      if (!plan || !acceptedRounds.has(parsed.data.round) || computedRounds.has(parsed.data.round)) return null;
      try {
        const expected = surveyResidualInterval(plan, parsed.data.evidence.method);
        // Old append-only V2 events predate the optional audit; never rewrite them.
        if (parsed.data.evidence.method === "ERDOS_STRAUS_RESIDUAL_SURVEY_V2" &&
          !parsed.data.evidence.firstFailureAudit) delete expected.firstFailureAudit;
        if (JSON.stringify(expected) !== JSON.stringify(parsed.data.evidence)) return null;
      } catch { return null; }
      computedRounds.add(parsed.data.round);
      evidenceByRound.set(parsed.data.round, parsed.data.evidence);
    }
    if (parsed.data.phase === "INDEPENDENT_REPLAY") {
      const evidence = evidenceByRound.get(parsed.data.round);
      if (!evidence || replayEvents.has(parsed.data.round) ||
        !validateIndependentReplayRecord(evidence, parsed.data.report)) return null;
      replayEvents.add(parsed.data.round);
      if (validateIndependentReplayReport(evidence, parsed.data.report)) replayedRounds.add(parsed.data.round);
    }
    if (parsed.data.phase === "ATTEMPTED") {
      if (structuralRefutedRounds.has(parsed.data.round)) return null;
      if (proposalsByRound.get(parsed.data.round)?.exactSurveyPlan && !computedRounds.has(parsed.data.round)) return null;
      if (evidenceByRound.get(parsed.data.round)?.method === "ERDOS_STRAUS_RESIDUAL_SURVEY_V3" &&
        !replayedRounds.has(parsed.data.round)) return null;
      attemptsByRound.set(parsed.data.round, parsed.data.attempt);
    }
    if (parsed.data.phase === "CERTIFICATE_CHECKED") {
      const attempt = attemptsByRound.get(parsed.data.round);
      const witnesses = attempt?.erdosStrausWitnesses ?? [];
      if (!attempt || witnesses.length !== parsed.data.checks.length) return null;
      for (const [position, check] of parsed.data.checks.entries()) {
        const witness = witnesses[position];
        if (!witness || JSON.stringify(witness) !== JSON.stringify(check.witness)) return null;
        const actual = verifyErdosStrausWitness(witness);
        if (actual.valid !== check.valid || actual.identityDigest !== check.identityDigest) return null;
      }
    }
    if (parsed.data.phase === "PARAMETRIC_CHECKED") {
      const families = attemptsByRound.get(parsed.data.round)?.erdosStrausPolynomialFamilies;
      if (parametricCheckedRounds.has(parsed.data.round) || !families?.length ||
        families.length !== parsed.data.checks.length) return null;
      for (const [index, check] of parsed.data.checks.entries()) {
        if (JSON.stringify(families[index]) !== JSON.stringify(check.family) ||
          JSON.stringify(verifyErdosStrausPolynomialFamily(check.family)) !== JSON.stringify(check.certificate)) return null;
      }
      parametricCheckedRounds.add(parsed.data.round);
    }
    if (parsed.data.phase === "COUNTEREXAMPLE_REPLAY") {
      const candidate = attemptsByRound.get(parsed.data.round)?.erdosStrausGateCounterexample;
      if (!candidate || counterexampleEvents.has(parsed.data.round) ||
        !validateStructuralCounterexampleReport(candidate, parsed.data.report) ||
        canonicalJson(candidate) !== canonicalJson(parsed.data.candidate)) return null;
      counterexampleEvents.add(parsed.data.round);
      if (parsed.data.report.status === "PASS") counterexampleReplayedRounds.add(parsed.data.round);
    }
    if (parsed.data.phase === "REVIEWED" &&
      (attemptsByRound.get(parsed.data.round)?.erdosStrausPolynomialFamilies?.length ?? 0) > 0 &&
      !parametricCheckedRounds.has(parsed.data.round)) return null;
    if (parsed.data.phase === "REVIEWED" &&
      attemptsByRound.get(parsed.data.round)?.erdosStrausGateCounterexample &&
      !counterexampleReplayedRounds.has(parsed.data.round)) return null;
    if (parsed.data.phase === "REVIEWED" && parsed.data.reviewerModel &&
      (parsed.data.reviewerModel.role !== parsed.data.role ||
        parsed.data.reviewerModel.threadId !== parsed.data.report.threadId)) return null;
    if (parsed.data.phase === "STOPPED" && parsed.data.reason === "STRUCTURAL_REFUTED" &&
      !structuralRefutedRounds.has(parsed.data.round)) return null;
    payloads.push(parsed.data);
    previous = event.digest;
  }
  if (portfolio && payloads.some((event) => event.phase === "STOPPED" &&
    event.reason !== "INTEGRITY_FAILURE") && !portfolioExhausted) return null;
  return payloads;
}

function rootGaps(ledger: NonNullable<ReturnType<typeof validateRecordedMathAgentReview>>): string[] {
  return [...new Set(ledger.reports.map((report) => report.unresolvedGap).filter((gap): gap is string => Boolean(gap)))];
}

async function rootCase(tx: TenantTransaction, organizationId: string, workspaceId: string, caseId: string) {
  const item = await tx.mathPilotCase.findFirst({
    where: { id: caseId, organizationId, workspaceId, caseType: "OPEN" },
    include: { agentReview: true, researchRun: { include: {
      sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
      findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
    } } },
  });
  if (!item || !item.agentReview) throw new ResearchSandboxError("INVALID_TRANSITION", "A retained OPEN AI review is required");
  const contract = mathPilotContractSchema.safeParse(item.contract);
  const attempt = mathModelAttemptSchema.safeParse(item.researchRun.mathModelAttempt);
  const researchDigest = researchDossierDigest(item.researchRun);
  const ledger = validateRecordedMathAgentReview({
    contract: item.contract, contractDigest: item.contractDigest,
    attempt: item.researchRun.mathModelAttempt, attemptDigest: item.researchRun.mathModelAttemptDigest,
    researchDigest, review: item.agentReview,
  });
  if (!contract.success || !attempt.success || !ledger || !item.researchRun.mathModelAttemptDigest ||
    item.researchRun.providerName !== "codex-local" || item.researchRun.modelName !== "gpt-6-sol" ||
    item.researchRun.status !== "AWAITING_REVIEW" && item.researchRun.status !== "APPROVED") {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Root research or AI review is not valid");
  }
  return { item, contract: contract.data, attempt: attempt.data, ledger };
}

export async function requestMathResearchCycle(ctx: WorkspaceContext, raw: {
  caseId: string; maxRounds: number; maxObservedTokens: number;
  steering?: { focus: "STRUCTURAL_LEMMA" | "FINITE_FALSIFICATION"; targetA: number; note: string; confirmed: boolean;
    replayCandidate?: { prime: number; failedThroughA: number } };
}) {
  await requireWorkspaceAuthorization(ctx, "research.request");
  if (!getEnv().RESEARCH_CODEX_LOCAL_ENABLED || !getEnv().MATH_PILOT_QUEUE_ENABLED) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "Local Codex mathematics dispatch is disabled");
  }
  const limits = mathCycleLimitsSchema.parse({ maxRounds: raw.maxRounds, maxObservedTokens: raw.maxObservedTokens });
  const choice = raw.steering ? mathCycleSteeringChoiceSchema.parse({
    focus: raw.steering.focus, targetA: raw.steering.targetA, note: raw.steering.note,
    ...(raw.steering.replayCandidate ? { replayCandidate: raw.steering.replayCandidate } : {}),
  }) : null;
  if (choice?.replayCandidate && (choice.focus !== "STRUCTURAL_LEMMA" ||
    choice.replayCandidate.failedThroughA >= choice.targetA)) {
    throw new ResearchSandboxError("INVALID_INPUT", "A prior replay seed must precede a later structural A target");
  }
  if (raw.steering && (!raw.steering.confirmed || limits.maxRounds !== 1)) {
    throw new ResearchSandboxError("INVALID_INPUT", "A human-steered campaign requires explicit confirmation and one round");
  }
  if (!raw.caseId || raw.caseId.length > 160) throw new ResearchSandboxError("INVALID_INPUT", "Invalid root case identity");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const cycleId = randomUUID();
  const commandId = randomUUID();
  return executeDurableCommand(ctx, {
    commandId, commandType: "math-pilot.cycle.request", idempotencyKey: `math-cycle:${choice ? cycleId : raw.caseId}`,
    requiredCapability: "research.request", payload: { caseId: raw.caseId,
      maxRounds: limits.maxRounds, maxUsageUnits: limits.maxObservedTokens,
      steeringChoice: choice },
  }, async (tx) => {
    const { item, ledger, contract } = await rootCase(tx, organizationId, ctx.workspace.id, raw.caseId);
    if (!rootGaps(ledger).length) throw new ResearchSandboxError("INVALID_TRANSITION", "Review contains no explicit unresolved gap");
    if (choice && !hasErdosStrausEquation(contract)) {
      throw new ResearchSandboxError("INVALID_INPUT", "Two-gate human steering requires an Erdős–Straus root");
    }
    await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${organizationId}:math-cycle-root:${item.id}`}, 0))`;
    const prior = await tx.mathResearchCycle.findFirst({ where: { rootCaseId: item.id, organizationId,
      ...(choice ? { status: { in: ["QUEUED", "RUNNING", "FAILED"] } } : {}) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }] });
    if (prior) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "An active, failed or unsteered prior cycle blocks this request");
    }
    const steering = choice ? mathCycleSteeringSchema.parse({ ...choice, method: "HUMAN_STEERED_TWO_GATE_V1",
      approvedByUserId: ctx.user.id, approvedAt: new Date().toISOString(), rootContractDigest: item.contractDigest }) : null;
    await tx.mathResearchCycle.create({ data: {
      id: cycleId, organizationId, workspaceId: item.workspaceId, missionId: item.missionId,
      rootCaseId: item.id, rootContractDigest: item.contractDigest,
      rootAttemptDigest: item.researchRun.mathModelAttemptDigest!, rootReviewDigest: item.agentReview!.ledgerDigest,
      commandId, maxRounds: limits.maxRounds, maxCalls: 7 * limits.maxRounds,
      maxObservedTokens: limits.maxObservedTokens,
      deadlineAt: new Date(Date.now() + 50 * 60_000),
    } });
    return { outcome: { cycleId, status: "QUEUED" }, outbox: [{
      topic: "math-pilot.cycle.round", aggregateType: "MathResearchCycle", aggregateId: cycleId,
      payload: { cycleId, round: 1, ...(steering ? { steering, steeringDigest: mathCycleSteeringDigest(steering) } : {}) },
    }] };
  });
}

export async function listMathResearchCycles(ctx: WorkspaceContext, missionId: string) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const cycles = await tx.mathResearchCycle.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, missionId },
      include: { events: { orderBy: { sequence: "asc" } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 20,
    });
    return cycles.map((cycle) => ({ ...cycle, trace: validateMathCycleTrace(cycle.events, cycle.rootContractDigest) }));
  });
}

async function appendEvent(tx: TenantTransaction, cycle: MathResearchCycle, jobId: string,
  payload: MathCycleEventPayload) {
  const last = await tx.mathResearchCycleEvent.findFirst({ where: { cycleId: cycle.id }, orderBy: { sequence: "desc" } });
  const previousDigest = last?.digest ?? null;
  return tx.mathResearchCycleEvent.create({ data: {
    organizationId: cycle.organizationId, workspaceId: cycle.workspaceId, cycleId: cycle.id,
    sequence: (last?.sequence ?? 0) + 1, round: payload.round, phase: payload.phase,
    payload: mathCycleEventPayloadSchema.parse(payload) as Prisma.InputJsonValue,
    previousDigest, digest: mathCycleEventDigest(previousDigest, payload), jobId,
  } });
}

async function lockedCycle(tx: TenantTransaction, organizationId: string, cycleId: string) {
  await tx.$queryRaw`SELECT 1::INTEGER AS locked FROM pg_advisory_xact_lock(hashtextextended(${`${organizationId}:math-cycle:${cycleId}`}, 0))`;
  return tx.mathResearchCycle.findFirstOrThrow({ where: { id: cycleId, organizationId } });
}

async function reserveCall(input: CycleJobInput, cycleId: string, round: number,
  role: Extract<MathCycleEventPayload, { phase: "CALL_STARTED" }>["role"]): Promise<CycleStopReason | null> {
  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING" || cycle.completedRounds + 1 !== round) throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before call reservation");
    const reason = cycleResourceStopReason({ callsStarted: cycle.callsStarted, maxCalls: cycle.maxCalls,
      observedTokens: cycle.observedTokens, maxObservedTokens: cycle.maxObservedTokens,
      deadlineAt: cycle.deadlineAt, now: new Date() });
    if (reason) return reason;
    const selected = await tx.mathResearchCycleEvent.findFirst({ where: { cycleId, round,
      phase: "BRANCH_SELECTED" }, orderBy: { sequence: "desc" } });
    if (selected) {
      const event = mathCycleEventPayloadSchema.parse(selected.payload);
      const planned = await tx.mathResearchCycleEvent.findFirst({ where: { cycleId,
        phase: "PORTFOLIO_PLANNED" }, orderBy: { sequence: "desc" } });
      const plan = planned ? mathCycleEventPayloadSchema.parse(planned.payload) : null;
      if (event.phase !== "BRANCH_SELECTED" || plan?.phase !== "PORTFOLIO_PLANNED" ||
        event.portfolioDigest !== plan.portfolio.portfolioDigest) {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "Branch resource provenance is invalid");
      }
      const branch = plan.portfolio.branches.find((item) => item.branchId === event.branchId);
      if (!branch || event.baselineObservedTokens > cycle.observedTokens) {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "Selected branch is outside the sealed portfolio");
      }
      const branchReason = branchResourceStopReason({ branch,
        baselineObservedTokens: event.baselineObservedTokens,
        currentObservedTokens: cycle.observedTokens,
        selectedAt: event.selectedAt, now: new Date() });
      if (branchReason) return branchReason;
    }
    await appendEvent(tx, cycle, input.jobId, { phase: "CALL_STARTED", role, round });
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: { callsStarted: { increment: 1 } } });
    return null;
  });
}

async function retainResult(input: CycleJobInput, cycleId: string, payload: MathCycleEventPayload,
  usage: MathCycleUsage) {
  await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle is no longer running");
    await appendEvent(tx, cycle, input.jobId, payload);
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: { observedTokens: { increment: observedTokens(usage) } } });
  });
}

async function finishJob(input: CycleJobInput, cycleId: string, round: number,
  reason: CycleStopReason | null, nextGap: string | null = null,
  verdict?: { disposition: "AI_REVIEWED" | "INCONCLUSIVE"; conclusion: "PARTIAL" | "INCONCLUSIVE" }) {
  return withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    const job = await tx.durableJob.findFirst({ where: { id: input.jobId, organizationId: input.organizationId,
      status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion,
      leaseExpiresAt: { gt: new Date() } } });
    if (!job || cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle job lease expired");
    const events = await tx.mathResearchCycleEvent.findMany({ where: { cycleId },
      orderBy: { sequence: "asc" }, take: 64 });
    const trace = validateMathCycleTrace(events, cycle.rootContractDigest);
    if (!trace) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Cycle trace changed before closure");
    const planned = trace.find((event) => event.phase === "PORTFOLIO_PLANNED");
    const portfolio = planned?.phase === "PORTFOLIO_PLANNED" ? planned.portfolio : null;
    const selected = trace.find((event) => event.phase === "BRANCH_SELECTED" && event.round === round);
    const pending = portfolio ? selectMathPortfolioBranch({ portfolio,
      selectedBranchIds: trace.filter((event) => event.phase === "BRANCH_SELECTED").map((event) => event.branchId),
      priorClaims: trace.filter((event) => event.phase === "PROPOSED").map((event) => event.proposal.hypothesis) }) : null;
    const branchLocal = reason !== null && ["DUPLICATE_CLAIM", "VERIFICATION_REJECTED",
      "COUNTEREXAMPLE_REJECTED", "STRUCTURAL_PROBE_HOLD", "STRUCTURAL_REFUTED", "KNOWN_SCOPE",
      "BRANCH_TOKEN_LIMIT", "BRANCH_TIME_LIMIT"].includes(reason);
    const roundVerdict = verdict ?? (portfolio && selected && branchLocal
      ? { disposition: "INCONCLUSIVE" as const, conclusion: "INCONCLUSIVE" as const } : undefined);
    if (roundVerdict) await appendEvent(tx, cycle, job.id, { phase: "ROUND_CLOSED", round,
      ...roundVerdict, nextGap });
    if (portfolio && selected?.phase === "BRANCH_SELECTED") {
      const outcome = reason === "BRANCH_TOKEN_LIMIT" || reason === "BRANCH_TIME_LIMIT" ||
        reason === "TOKEN_LIMIT" || reason === "TIME_LIMIT" ? "RESOURCE_STOP" as const
        : reason && branchLocal ? "PRUNED" as const
        : reason ? "FAILED" as const
        : verdict?.disposition === "AI_REVIEWED" ? "AI_REVIEWED" as const : "INCONCLUSIVE" as const;
      await appendEvent(tx, cycle, job.id, { phase: "BRANCH_CLOSED", round,
        portfolioDigest: portfolio.portfolioDigest, branchId: selected.branchId,
        outcome, reason: reason ?? "ROUND_COMPLETE" });
    }
    const completedRounds = cycle.completedRounds + (roundVerdict ? 1 : 0);
    const canSwitch = Boolean(portfolio && pending && completedRounds < cycle.maxRounds &&
      cycle.observedTokens < cycle.maxObservedTokens && Date.now() < cycle.deadlineAt.getTime() &&
      cycle.callsStarted < cycle.maxCalls);
    let stop: CycleStopReason | null = branchLocal && canSwitch ? null : reason;
    if (!stop) stop = completedRounds >= cycle.maxRounds ? "ROUND_LIMIT"
      : cycle.observedTokens >= cycle.maxObservedTokens ? "TOKEN_LIMIT"
      : Date.now() >= cycle.deadlineAt.getTime() ? "TIME_LIMIT"
      : portfolio ? pending ? null : "NO_GAP"
      : !nextGap ? "NO_GAP" : null;
    if (stop && portfolio) {
      const current = await tx.mathResearchCycleEvent.findMany({ where: { cycleId },
        orderBy: { sequence: "asc" }, take: 64 });
      const currentTrace = validateMathCycleTrace(current, cycle.rootContractDigest);
      if (!currentTrace) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Portfolio closure trace is invalid");
      await appendEvent(tx, cycle, job.id, { phase: "PORTFOLIO_EXHAUSTED", round,
        portfolioDigest: portfolio.portfolioDigest,
        branches: summarizeMathPortfolio(portfolio, currentTrace) });
    }
    if (stop) await appendEvent(tx, cycle, job.id, { phase: "STOPPED", round, reason: stop });
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: {
      completedRounds, status: stop ? "STOPPED" : "QUEUED", stopReason: stop,
    } });
    if (!stop) await tx.outboxEvent.create({ data: {
      organizationId: cycle.organizationId, workspaceId: cycle.workspaceId, commandId: cycle.commandId,
      topic: "math-pilot.cycle.round", aggregateType: "MathResearchCycle", aggregateId: cycle.id,
      payload: { cycleId: cycle.id, round: round + 1 },
    } });
    await tx.durableJob.update({ where: { id: job.id }, data: {
      status: "SUCCEEDED", result: { cycleId: cycle.id, round, stopReason: stop },
      lockedBy: null, leaseExpiresAt: null, completedAt: new Date(), version: { increment: 1 },
    } });
    await tx.durableJobEvent.create({ data: { organizationId: input.organizationId, workspaceId: cycle.workspaceId,
      jobId: job.id, eventType: "SUCCEEDED", attemptNumber: job.attempts, workerId: input.workerId } });
    return { stopReason: stop };
  });
}

export interface CycleJobInput {
  organizationId: string; actorUserId: string; workerId: string; jobId: string;
  expectedVersion: number; agents: MathCycleAgents;
}

export async function executeMathResearchCycleRound(input: CycleJobInput) {
  const loaded = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({ where: { id: input.jobId, organizationId: input.organizationId,
      jobType: "math-pilot.cycle.round", status: "RUNNING", lockedBy: input.workerId,
      version: input.expectedVersion, leaseExpiresAt: { gt: new Date() } } });
    if (!job || job.attempts !== 1 || !job.workspaceId) throw new ResearchSandboxError("JOB_CONFLICT", "Cycle requires first-claim active lease");
    const payload = job.payload as Record<string, unknown>;
    if (typeof payload.cycleId !== "string" || typeof payload.round !== "number") throw new ResearchSandboxError("INVALID_INPUT", "Cycle job payload is invalid");
    const cycle = await lockedCycle(tx, input.organizationId, payload.cycleId);
    const round = payload.round as number;
    if (cycle.workspaceId !== job.workspaceId || cycle.completedRounds + 1 !== round || cycle.status !== "QUEUED") {
      throw new ResearchSandboxError("JOB_CONFLICT", "Cycle round is not queued exactly once");
    }
    const root = await rootCase(tx, input.organizationId, job.workspaceId, cycle.rootCaseId);
    if (root.item.contractDigest !== cycle.rootContractDigest ||
      root.item.researchRun.mathModelAttemptDigest !== cycle.rootAttemptDigest ||
      root.item.agentReview!.ledgerDigest !== cycle.rootReviewDigest || input.agents.modelName !== root.item.researchRun.modelName) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Cycle root binding changed");
    }
    const events = await tx.mathResearchCycleEvent.findMany({ where: { cycleId: cycle.id }, orderBy: { sequence: "asc" }, take: 64 });
    const trace = validateMathCycleTrace(events, cycle.rootContractDigest);
    if (!trace) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Cycle event chain is invalid");
    const payloadSteering = payload.steering === undefined ? null : mathCycleSteeringSchema.parse(payload.steering);
    if (payloadSteering && (round !== 1 || payload.steeringDigest !== mathCycleSteeringDigest(payloadSteering) ||
      payloadSteering.rootContractDigest !== cycle.rootContractDigest)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Human steering payload is not bound to the sealed root");
    }
    const steering = payloadSteering ?? trace.find((event) => event.phase === "HUMAN_STEERED")?.steering ?? null;
    if (round === 1 && Boolean(steering) !== Boolean(payloadSteering)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Human steering is missing from the first round");
    }
    const priorCycles = await tx.mathResearchCycle.findMany({ where: { rootCaseId: cycle.rootCaseId,
      organizationId: input.organizationId, id: { not: cycle.id }, status: "STOPPED" },
    include: { events: { orderBy: { sequence: "asc" } } }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 8 });
    const checkedPriorCycles = priorCycles.map((priorCycle) => {
      const checked = validateMathCycleTrace(priorCycle.events, priorCycle.rootContractDigest);
      if (!checked) throw new ResearchSandboxError("INTEGRITY_FAILURE", "A prior cycle trace is invalid");
      return { cycle: priorCycle, trace: checked };
    });
    const priorObligations = [...projectMathProofObligations({ cycleId: cycle.id,
      ledgerDigest: events.at(-1)?.digest ?? "", trace }), ...checkedPriorCycles.flatMap(({ cycle: previous, trace: checked }) =>
      projectMathProofObligations({ cycleId: previous.id,
        ledgerDigest: previous.events.at(-1)?.digest ?? "", trace: checked }))].slice(0, 80);
    const crossCaseCycles = /\bprime\b/i.test(root.contract.statement) && /\b840\b/.test(root.contract.statement)
      ? await tx.mathResearchCycle.findMany({ where: { organizationId: input.organizationId,
        workspaceId: cycle.workspaceId, missionId: cycle.missionId,
        rootCaseId: { not: cycle.rootCaseId }, status: "STOPPED",
        events: { some: { phase: "INDEPENDENT_REPLAY" } } },
      include: { rootCase: { select: { contract: true, contractDigest: true } },
        events: { orderBy: { sequence: "asc" } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 24 }) : [];
    const historicalTasks = checkedPriorCycles.flatMap(({ trace: checked }) => checked
      .filter((event): event is Extract<MathCycleEventPayload, { phase: "PROPOSED" }> => event.phase === "PROPOSED")
      .map((event) => event.proposal.taskStatement));
    const sameCaseFindings = checkedPriorCycles.flatMap(({ cycle: previous, trace: checked }) => {
      const finding = priorFiniteFindingFromTrace({ cycleId: previous.id,
        sourceLedgerDigest: previous.events.at(-1)?.digest ?? "", trace: checked });
      return finding ? [finding] : [];
    });
    const crossCaseFindings = crossCaseCycles.flatMap((previous) => {
      const sourceContract = mathPilotContractSchema.safeParse(previous.rootCase.contract);
      if (!sourceContract.success || previous.rootCase.contractDigest !== previous.rootContractDigest ||
        digestMathPilotContract(sourceContract.data) !== previous.rootContractDigest ||
        !compatibleResidualPrimeRoots(root.contract, sourceContract.data)) return [];
      const checked = validateMathCycleTrace(previous.events, previous.rootContractDigest);
      if (!checked) throw new ResearchSandboxError("INTEGRITY_FAILURE", "A cross-case evidence trace is invalid");
      const finding = priorFiniteFindingFromTrace({ cycleId: previous.id,
        sourceLedgerDigest: previous.events.at(-1)?.digest ?? "", trace: checked });
      return finding ? [finding] : [];
    });
    const seenFindings = new Set<string>();
    const priorFindings = [...sameCaseFindings, ...crossCaseFindings].filter((finding) => {
      const key = `${finding.prime}:${finding.failedThroughA}:${finding.firstSuccessA}`;
      if (seenFindings.has(key)) return false;
      seenFindings.add(key);
      return true;
    }).slice(0, 8);
    const latestCycleGaps = checkedPriorCycles.flatMap(({ trace: checked }) => checked
      .filter((event): event is Extract<MathCycleEventPayload, { phase: "ROUND_CLOSED" }> => event.phase === "ROUND_CLOSED")
      .map((event) => event.nextGap).filter((gap): gap is string => Boolean(gap))).slice(0, 1);
    const priorTasks = [...historicalTasks, ...trace.filter((event): event is Extract<MathCycleEventPayload, { phase: "PROPOSED" }> => event.phase === "PROPOSED")
      .map((event) => event.proposal.taskStatement)];
    const priorReview = trace.filter((event): event is Extract<MathCycleEventPayload, { phase: "REVIEWED" }> => event.phase === "REVIEWED");
    const gaps = round === 1 ? (latestCycleGaps.length ? latestCycleGaps : rootGaps(root.ledger))
      : [...new Set(priorReview.filter((event) => event.round === round - 1)
        .map((event) => event.report.unresolvedGap).filter((gap): gap is string => Boolean(gap)))];
    const priorArt = mathPriorArtFor(root.contract);
    if (payloadSteering) await appendEvent(tx, cycle, job.id, { phase: "HUMAN_STEERED", round: 1,
      steering: payloadSteering, steeringDigest: mathCycleSteeringDigest(payloadSteering) });
    if (priorFindings.length) await appendEvent(tx, cycle, job.id, { phase: "PRIOR_FINDINGS", round,
      findings: priorFindings });
    await appendEvent(tx, cycle, job.id, { phase: "PRIOR_ART", round, facts: [...priorArt], coverage: "CURATED_PARTIAL",
      ...(round === 1 && hasErdosStrausEquation(root.contract) ? { researchMethod: "MIXED_CORE_REPLAY_V1" as const } : {}) });
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: { status: "RUNNING" } });
    return { cycleId: cycle.id, round, rootContract: root.contract, gaps, priorTasks, priorArt,
      steering, priorFindings, priorObligations, trace, rootReviewDigest: cycle.rootReviewDigest,
      maxRounds: cycle.maxRounds, maxObservedTokens: cycle.maxObservedTokens };
  });
  const { cycleId, round, rootContract, gaps, priorTasks, priorArt, steering, priorFindings,
    priorObligations, trace, rootReviewDigest, maxRounds, maxObservedTokens } = loaded;
  const priorPortfolioEvent = trace.find((event) => event.phase === "PORTFOLIO_PLANNED");
  const priorPortfolio = priorPortfolioEvent?.phase === "PORTFOLIO_PLANNED" ? priorPortfolioEvent.portfolio : null;
  if (priorPortfolio && priorPortfolio.rootReviewDigest !== rootReviewDigest) {
    return finishJob(input, cycleId, round, "INTEGRITY_FAILURE");
  }
  if (!gaps.length && !priorPortfolio) return finishJob(input, cycleId, round, "NO_GAP");
  let mixedCoreEvidence = trace.find((event) => event.phase === "MIXED_CORE_EVIDENCE")?.evidence ?? null;
  if (round === 1 && hasErdosStrausEquation(rootContract)) {
    mixedCoreEvidence = await runMixedCoreAgentEvidence(digestMathPilotContract(rootContract));
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before mixed-core replay");
      await appendEvent(tx, cycle, input.jobId, { phase: "MIXED_CORE_EVIDENCE", round: 1, evidence: mixedCoreEvidence! });
    });
  }
  if (mixedCoreEvidence && (!validateMixedCoreAgentEvidence(mixedCoreEvidence, digestMathPilotContract(rootContract)) ||
    mixedCoreEvidence.replay.status !== "PASS")) return finishJob(input, cycleId, round, "INTEGRITY_FAILURE");
  let effectivePriorFindings = priorFindings;
  let gateDossier: StructuralGateDossier | null = null;
  if (steering?.replayCandidate) {
    const candidate = steering.replayCandidate;
    const report = await runStructuralCounterexampleReplay(candidate);
    const event: MathCycleEventPayload = { phase: "PRIOR_COUNTEREXAMPLE_REPLAY", round: 1, candidate, report };
    const appended = await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before prior counterexample replay");
      return appendEvent(tx, cycle, input.jobId, event);
    });
    if (report.status !== "PASS" || !validateStructuralCounterexampleReport(candidate, report)) {
      return finishJob(input, cycleId, round, "COUNTEREXAMPLE_REJECTED");
    }
    const finding = priorFiniteFindingFromTrace({ cycleId, sourceLedgerDigest: appended.digest, trace: [event] });
    if (!finding) return finishJob(input, cycleId, round, "INTEGRITY_FAILURE");
    effectivePriorFindings = [finding, ...priorFindings].slice(0, 8);
    gateDossier = await runStructuralGateDossier(candidate, steering.targetA);
    if (gateDossier) {
      const dossierEvent: MathCycleEventPayload = { phase: "PRIOR_GATE_DOSSIER", round: 1, dossier: gateDossier };
      await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
        const cycle = await lockedCycle(tx, input.organizationId, cycleId);
        if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before gate dossier");
        await appendEvent(tx, cycle, input.jobId, dossierEvent);
      });
    }
  }

  const reserve = async (role: Extract<MathCycleEventPayload, { phase: "CALL_STARTED" }>["role"]) => {
    const reason = await reserveCall(input, cycleId, round, role);
    if (reason) { await finishJob(input, cycleId, round, reason); return false; }
    return true;
  };
  let plan: { output: MathCycleProposal; threadId: string; usage: MathCycleUsage };
  let availableGaps = gaps;
  if (!steering && (priorPortfolio || round === 1 && input.agents.proposePortfolio)) {
    let portfolio = priorPortfolio;
    if (!portfolio) {
      if (!input.agents.proposePortfolio) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Portfolio planner is unavailable");
      if (!await reserve("PLANNER")) return;
      const planned = await input.agents.proposePortfolio(rootContract, gaps, priorTasks, priorArt,
        effectivePriorFindings, gateDossier, priorObligations, mixedCoreEvidence);
      portfolio = sealMathPortfolio({ draft: planned.output, rootReviewDigest, availableGaps: gaps,
        priorObligations, maxObservedTokens, maxRounds });
      await retainResult(input, cycleId, { phase: "PORTFOLIO_PLANNED", round: 1, portfolio,
        context: { threadId: planned.threadId, usage: planned.usage } }, planned.usage);
    }
    const selected = selectMathPortfolioBranch({ portfolio,
      selectedBranchIds: trace.filter((event) => event.phase === "BRANCH_SELECTED").map((event) => event.branchId),
      priorClaims: [...priorObligations.filter((item) => item.kind === "CLAIM").map((item) => item.statement),
        ...trace.filter((event) => event.phase === "PROPOSED").map((event) => event.proposal.hypothesis)] });
    if (!selected) return finishJob(input, cycleId, round, "NO_GAP");
    const plannerThreadId = priorPortfolioEvent?.phase === "PORTFOLIO_PLANNED"
      ? priorPortfolioEvent.context.threadId : (await withOrganizationTenant(input.organizationId, input.actorUserId,
        async (tx) => {
          const event = await tx.mathResearchCycleEvent.findFirst({ where: { cycleId,
            phase: "PORTFOLIO_PLANNED" }, orderBy: { sequence: "desc" } });
          const payload = event ? mathCycleEventPayloadSchema.parse(event.payload) : null;
          if (payload?.phase !== "PORTFOLIO_PLANNED") throw new ResearchSandboxError("INTEGRITY_FAILURE", "Portfolio plan missing");
          return payload.context.threadId;
        }));
    const zeroUsage: MathCycleUsage = { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0,
      reasoningOutputTokens: 0 };
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING" || cycle.completedRounds + 1 !== round) {
        throw new ResearchSandboxError("JOB_CONFLICT", "Portfolio branch selection moved");
      }
      await appendEvent(tx, cycle, input.jobId, { phase: "BRANCH_SELECTED", round,
        portfolioDigest: portfolio.portfolioDigest, branchId: selected.branchId,
        baselineObservedTokens: cycle.observedTokens, selectedAt: new Date().toISOString() });
      await appendEvent(tx, cycle, input.jobId, { phase: "PROPOSED", round, proposal: selected.proposal,
        context: { threadId: plannerThreadId, usage: zeroUsage } });
    });
    plan = { output: selected.proposal, threadId: plannerThreadId, usage: zeroUsage };
    availableGaps = [...new Set([...gaps, selected.proposal.sourceGap])];
  } else {
    if (!await reserve("PLANNER")) return;
    plan = await input.agents.propose(rootContract, gaps, priorTasks, priorArt, steering,
      effectivePriorFindings, gateDossier, priorObligations, mixedCoreEvidence);
    const proposed = mathCycleProposalSchema.parse(plan.output);
    await retainResult(input, cycleId, { phase: "PROPOSED", round, proposal: proposed,
      context: { threadId: plan.threadId, usage: plan.usage } }, plan.usage);
  }
  const proposal = mathCycleProposalSchema.parse(plan.output);
  if (mixedCoreEvidence && proposal.mixedCoreClaim && mixedCoreRefutation(proposal.mixedCoreClaim, mixedCoreEvidence)) {
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before mixed-core claim check");
      await appendEvent(tx, cycle, input.jobId, { phase: "MIXED_CORE_CLAIM_REFUTED", round,
        claim: proposal.mixedCoreClaim!, evidenceDigest: mixedCoreEvidence.evidenceDigest });
    });
    return finishJob(input, cycleId, round, "STRUCTURAL_REFUTED");
  }
  if (repeatedMathClaim(proposal, priorObligations.filter((item) => item.kind === "CLAIM")
    .map((item) => item.statement))) return finishJob(input, cycleId, round, "DUPLICATE_CLAIM");

  // This is a bounded attempt to falsify the *typed* conditional, never a proof
  // when no counterexample is found. Run before spending source/verifier/solver calls.
  let structuralProbe: StructuralProbeReport | null = null;
  if (proposal.structuralProbePlan) {
    if (!hasErdosStrausEquation(rootContract) ||
      (steering?.focus === "STRUCTURAL_LEMMA" && proposal.structuralProbePlan.targetA !== steering.targetA)) {
      return finishJob(input, cycleId, round, "STRUCTURAL_PROBE_HOLD");
    }
    const report = await runStructuralProbe(proposal.structuralProbePlan);
    structuralProbe = report;
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before structural probe");
      await appendEvent(tx, cycle, input.jobId, { phase: "STRUCTURAL_PROBED", round, report });
    });
    if (!validateStructuralProbeReport(proposal.structuralProbePlan, report)) {
      return finishJob(input, cycleId, round, "INTEGRITY_FAILURE");
    }
    if (report.status === "REFUTED") return finishJob(input, cycleId, round, "STRUCTURAL_REFUTED");
  } else if (steering?.focus === "STRUCTURAL_LEMMA" && proposal.structuralProbePlan === null) {
    // New production responses explicitly return null; old immutable/test
    // proposals may omit the field, so their historical semantics stay intact.
    return finishJob(input, cycleId, round, "STRUCTURAL_PROBE_HOLD");
  }

  const dossier = await input.agents.buildFrontierDossier(rootContract);
  if (!verifyFrontierDossier(dossier)) {
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      await appendEvent(tx, cycle, input.jobId, { phase: "FRONTIER_GATE", round,
        decision: "HOLD", dossierDigest: null, reason: "Source dossier integrity failed" });
    });
    return finishJob(input, cycleId, round, "FRONTIER_HOLD");
  }
  await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before frontier intake");
    await appendEvent(tx, cycle, input.jobId, { phase: "FRONTIER_DOSSIER", round, dossier });
  });
  let sourceGate = frontierGate({ root: rootContract, task: proposal.taskStatement,
    hypothesis: proposal.hypothesis, dossier, boundedExperiment: Boolean(proposal.exactSurveyPlan) });
  const frontierThreads: string[] = [];
  const assessments: FrontierAssessment[] = [];
  const needsSourceReview = sourceGate.decision === "HOLD" &&
    (dossier.discovery.status === "COMPLETE" || Boolean(proposal.exactSurveyPlan)) &&
    dossier.sources.length > 0 && !knownScopeForTask(rootContract, proposal.taskStatement) &&
    !knownScopeForTask(rootContract, proposal.hypothesis);
  if (needsSourceReview) {
    const threads: string[] = [plan.threadId];
    for (const role of ["SOURCE_ANALYST", "SOURCE_CHALLENGER"] as const) {
      if (!await reserve(role)) return;
      const result = await input.agents.assessFrontier(role, rootContract, proposal, dossier);
      const assessment = frontierAssessmentSchema.parse(result.output);
      if (threads.includes(result.threadId)) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Frontier agents reused a context");
      threads.push(result.threadId);
      frontierThreads.push(result.threadId);
      await retainResult(input, cycleId, { phase: "FRONTIER_REVIEWED", round, role,
        dossierDigest: dossier.dossierDigest, assessment,
        context: { threadId: result.threadId, usage: result.usage } }, result.usage);
      assessments.push(assessment);
    }
    sourceGate = frontierGate({ root: rootContract, task: proposal.taskStatement,
      hypothesis: proposal.hypothesis, dossier, boundedExperiment: Boolean(proposal.exactSurveyPlan),
      analyst: assessments[0], challenger: assessments[1] });
  }
  await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before frontier decision");
    await appendEvent(tx, cycle, input.jobId, { phase: "FRONTIER_GATE", round,
      dossierDigest: dossier.dossierDigest, ...sourceGate });
  });
  if (sourceGate.decision !== "RESEARCH_ONLY") return finishJob(input, cycleId, round,
    sourceGate.decision === "KNOWN" ? "KNOWN_SCOPE" : "FRONTIER_HOLD");

  if (!await reserve("VERIFIER")) return;
  const check = await input.agents.verify(rootContract, availableGaps, priorTasks, proposal, priorArt, steering,
    effectivePriorFindings, assessments, gateDossier, structuralProbe, priorObligations, mixedCoreEvidence);
  const verification = mathCycleVerificationSchema.parse(check.output);
  if (frontierThreads.includes(check.threadId)) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Task verifier reused a frontier context");
  const deterministic = verifyMathCycleProposal({ rootContract, availableGaps, priorTasks,
    proposal, verification, plannerThreadId: plan.threadId, verifierThreadId: check.threadId,
    steering, priorFindings: effectivePriorFindings,
    priorClaims: priorObligations.filter((obligation) => obligation.kind === "CLAIM")
      .map((obligation) => obligation.statement) });
  await retainResult(input, cycleId, { phase: "VERIFIED", round, verification,
    context: { threadId: check.threadId, usage: check.usage }, ...deterministic }, check.usage);
  if (!deterministic.accepted) return finishJob(input, cycleId, round, "VERIFICATION_REJECTED");

  const contract = taskContract(rootContract, proposal);
  const computation = proposal.exactSurveyPlan ? surveyResidualInterval(proposal.exactSurveyPlan) : null;
  if (computation) await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before exact computation");
    await appendEvent(tx, cycle, input.jobId, { phase: "COMPUTED", round, evidence: computation });
  });
  const replay = computation ? await runIndependentResidualReplay(computation) : null;
  if (replay) {
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before independent replay");
      await appendEvent(tx, cycle, input.jobId, { phase: "INDEPENDENT_REPLAY", round, report: replay });
    });
    if (replay.status !== "PASS" || !validateIndependentReplayReport(computation!, replay)) {
      return finishJob(input, cycleId, round, "INTEGRITY_FAILURE");
    }
  }
  if (!await reserve("SOLVER")) return;
  const attempt = mathModelAttemptSchema.parse(await input.agents.solve(contract, computation, replay, gateDossier, mixedCoreEvidence));
  if (attempt.threadId === plan.threadId || attempt.threadId === check.threadId || frontierThreads.includes(attempt.threadId) ||
    attempt.modelName !== input.agents.modelName || attempt.providerName !== "codex-local") {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Solver context or model identity is not independent");
  }
  await retainResult(input, cycleId, { phase: "ATTEMPTED", round, contract, attempt }, attempt.usage);
  const candidate = attempt.erdosStrausGateCounterexample;
  if (candidate && !hasErdosStrausEquation(rootContract)) {
    return finishJob(input, cycleId, round, "COUNTEREXAMPLE_REJECTED");
  }
  if (steering?.focus === "STRUCTURAL_LEMMA" && hasErdosStrausEquation(rootContract) &&
    attempt.attemptType === "COUNTEREXAMPLE_ATTEMPT" && !candidate) {
    return finishJob(input, cycleId, round, "COUNTEREXAMPLE_REJECTED");
  }
  if (candidate && steering?.focus === "STRUCTURAL_LEMMA" && candidate.failedThroughA !== steering.targetA) {
    return finishJob(input, cycleId, round, "COUNTEREXAMPLE_REJECTED");
  }
  const counterexampleReplay = candidate ? await runStructuralCounterexampleReplay(candidate) : null;
  if (candidate && counterexampleReplay) {
    const sealedCandidate = candidate;
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before counterexample replay");
      await appendEvent(tx, cycle, input.jobId, { phase: "COUNTEREXAMPLE_REPLAY", round,
        candidate: sealedCandidate, report: counterexampleReplay });
    });
    if (counterexampleReplay.status !== "PASS" ||
      !validateStructuralCounterexampleReport(sealedCandidate, counterexampleReplay)) {
      return finishJob(input, cycleId, round, "COUNTEREXAMPLE_REJECTED");
    }
  }
  await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before exact certificate check");
    await appendEvent(tx, cycle, input.jobId, { phase: "CERTIFICATE_CHECKED", round, method: "ERDOS_STRAUS_EXACT_IDENTITY_V1",
      checks: (attempt.erdosStrausWitnesses ?? []).map((witness) => {
        const certificate = verifyErdosStrausWitness(witness);
        return { witness, valid: certificate.valid, identityDigest: certificate.identityDigest };
      }) });
  });
  if (attempt.erdosStrausPolynomialFamilies?.length) {
    await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
      const cycle = await lockedCycle(tx, input.organizationId, cycleId);
      if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before parametric check");
      await appendEvent(tx, cycle, input.jobId, { phase: "PARAMETRIC_CHECKED", round,
        checks: attempt.erdosStrausPolynomialFamilies!.map((family) => ({ family,
          certificate: verifyErdosStrausPolynomialFamily(family) })) });
    });
  }

  const reports: MathAgentReport[] = [];
  for (const role of ["CRITIC", "ADVERSARY"] as const) {
    if (!await reserve(role)) return;
    const report = mathAgentReportSchema.parse(await input.agents.reviewRole(role, contract, attempt, computation, replay,
      counterexampleReplay, gateDossier, mixedCoreEvidence));
    if (report.role !== role || [plan.threadId, ...frontierThreads, check.threadId, attempt.threadId,
      ...reports.map((item) => item.threadId)].includes(report.threadId)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Review context or role is not independent");
    }
    await retainResult(input, cycleId, { phase: "REVIEWED", round, role, report,
      reviewerModel: { role, providerName: "codex-local", identityEvidence: "REQUESTED_CLI_MODEL",
        requestedModelName: input.agents.reviewRoleModels?.[role] ?? input.agents.modelName,
        threadId: report.threadId } }, report.usage);
    reports.push(report);
  }
  const verdict = evaluateMathAgentReview({ contract, contractDigest: digestMathPilotContract(contract),
    attempt, reports: [reports[0]!, reports[1]!] });
  const nextGap = reports.map((report) => report.unresolvedGap).find((gap): gap is string => Boolean(gap)) ?? null;
  return finishJob(input, cycleId, round, null, nextGap,
    { disposition: verdict.disposition, conclusion: verdict.conclusion as "PARTIAL" | "INCONCLUSIVE" });
}

export async function markMathResearchCycleFailed(input: Omit<CycleJobInput, "agents">,
  reason: "MODEL_FAILURE" | "INTEGRITY_FAILURE" = "MODEL_FAILURE") {
  await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const job = await tx.durableJob.findFirst({ where: { id: input.jobId, organizationId: input.organizationId,
      jobType: "math-pilot.cycle.round", status: "RUNNING", lockedBy: input.workerId, version: input.expectedVersion } });
    const payload = job?.payload as Record<string, unknown> | undefined;
    if (!job || typeof payload?.cycleId !== "string" || typeof payload.round !== "number") return;
    const cycle = await lockedCycle(tx, input.organizationId, payload.cycleId);
    if (cycle.status !== "RUNNING" && cycle.status !== "QUEUED") return;
    const events = await tx.mathResearchCycleEvent.findMany({ where: { cycleId: cycle.id },
      orderBy: { sequence: "asc" }, take: 64 });
    const trace = validateMathCycleTrace(events, cycle.rootContractDigest);
    const plan = trace?.find((event) => event.phase === "PORTFOLIO_PLANNED");
    let finalReason = trace ? reason : "INTEGRITY_FAILURE";
    if (plan?.phase === "PORTFOLIO_PLANNED" &&
      plan.portfolio.rootReviewDigest !== cycle.rootReviewDigest) finalReason = "INTEGRITY_FAILURE";
    // Preserve a failure map whenever the existing chain and root binding are
    // still trustworthy. A corrupt chain remains fail-closed without synthesis.
    if (plan?.phase === "PORTFOLIO_PLANNED" && trace &&
      plan.portfolio.rootReviewDigest === cycle.rootReviewDigest) {
      const selected = trace?.find((event) => event.phase === "BRANCH_SELECTED" && event.round === payload.round);
      if (selected?.phase === "BRANCH_SELECTED" && !trace?.some((event) =>
        event.phase === "BRANCH_CLOSED" && event.branchId === selected.branchId)) {
        await appendEvent(tx, cycle, job.id, { phase: "BRANCH_CLOSED", round: payload.round,
          portfolioDigest: plan.portfolio.portfolioDigest, branchId: selected.branchId,
          outcome: "FAILED", reason: finalReason });
      }
      const current = await tx.mathResearchCycleEvent.findMany({ where: { cycleId: cycle.id },
        orderBy: { sequence: "asc" }, take: 64 });
      const checked = validateMathCycleTrace(current, cycle.rootContractDigest);
      if (!checked) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Failure closure trace is invalid");
      if (!checked.some((event) => event.phase === "PORTFOLIO_EXHAUSTED")) {
        await appendEvent(tx, cycle, job.id, { phase: "PORTFOLIO_EXHAUSTED", round: payload.round,
          portfolioDigest: plan.portfolio.portfolioDigest,
          branches: summarizeMathPortfolio(plan.portfolio, checked) });
      }
    }
    await appendEvent(tx, cycle, job.id, { phase: "STOPPED", round: payload.round, reason: finalReason });
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: { status: "FAILED", stopReason: finalReason } });
  });
}
