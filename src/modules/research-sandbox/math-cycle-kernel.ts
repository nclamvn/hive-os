import { randomUUID } from "node:crypto";

import type { MathResearchCycle, Prisma } from "@prisma/client";

import { organizationIdForWorkspace, requireWorkspaceAuthorization } from "@/modules/authorization";
import { executeDurableCommand } from "@/modules/command-runtime";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { withOrganizationTenant, type TenantTransaction } from "@/server/tenant-context";
import { getEnv } from "@/server/env";

import { evaluateMathAgentReview, validateRecordedMathAgentReview, type MathAgentReport } from "./agent-review";
import { mathModelAttemptSchema } from "./contracts";
import { surveyResidualInterval, verifyErdosStrausWitness, type ResidualSurveyEvidence } from "./math-certificates";
import { ResearchSandboxError } from "./errors";
import { researchDossierDigest } from "./integrity";
import {
  cycleResourceStopReason, mathCycleEventDigest, mathCycleEventPayloadSchema, mathCycleLimitsSchema, mathCycleProposalSchema,
  mathCycleVerificationSchema, observedTokens, taskContract, verifyMathCycleProposal,
  type MathCycleEventPayload, type MathCycleProposal, type MathCycleUsage, type MathCycleVerification,
} from "./math-cycle";
import { digestMathPilotContract, mathPilotContractSchema, type MathPilotContract } from "./math-pilot";
import { mathAgentReportSchema } from "./agent-review";
import { knownScopeForTask, mathPriorArtFor, type MathPriorArtFact } from "./math-prior-art";
import { frontierAssessmentSchema, frontierGate, verifyFrontierDossier,
  type FrontierAssessment, type FrontierDossier } from "./math-frontier";

type CycleStopReason = "ROUND_LIMIT" | "TOKEN_LIMIT" | "TIME_LIMIT" | "NO_GAP" | "VERIFICATION_REJECTED" | "FRONTIER_HOLD" | "KNOWN_SCOPE" | "MODEL_FAILURE" | "INTEGRITY_FAILURE";

export interface MathCycleAgents {
  modelName: string;
  propose(root: MathPilotContract, availableGaps: string[], previousTasks: string[], priorArt: readonly MathPriorArtFact[]): Promise<{
    output: MathCycleProposal; threadId: string; usage: MathCycleUsage;
  }>;
  verify(root: MathPilotContract, availableGaps: string[], previousTasks: string[], proposal: MathCycleProposal,
    priorArt: readonly MathPriorArtFact[]): Promise<{
    output: MathCycleVerification; threadId: string; usage: MathCycleUsage;
  }>;
  buildFrontierDossier(root: MathPilotContract): Promise<FrontierDossier>;
  assessFrontier(role: "SOURCE_ANALYST" | "SOURCE_CHALLENGER", root: MathPilotContract,
    proposal: MathCycleProposal, dossier: FrontierDossier): Promise<{
    output: FrontierAssessment; threadId: string; usage: MathCycleUsage;
  }>;
  solve(contract: MathPilotContract, evidence: ResidualSurveyEvidence | null): Promise<ReturnType<typeof mathModelAttemptSchema.parse>>;
  reviewRole(role: MathAgentReport["role"], contract: MathPilotContract,
    attempt: ReturnType<typeof mathModelAttemptSchema.parse>, evidence: ResidualSurveyEvidence | null): Promise<MathAgentReport>;
}

export function validateMathCycleTrace(events: Array<{ sequence: number; round: number; phase: string;
  payload: unknown; previousDigest: string | null; digest: string }>): MathCycleEventPayload[] | null {
  let previous: string | null = null;
  const payloads: MathCycleEventPayload[] = [];
  const frontierDigestByRound = new Map<number, string>();
  const attemptsByRound = new Map<number, ReturnType<typeof mathModelAttemptSchema.parse>>();
  const proposalsByRound = new Map<number, MathCycleProposal>();
  const acceptedRounds = new Set<number>();
  const computedRounds = new Set<number>();
  for (const [index, event] of events.entries()) {
    const parsed = mathCycleEventPayloadSchema.safeParse(event.payload);
    if (!parsed.success || event.sequence !== index + 1 || event.round !== parsed.data.round ||
      event.phase !== parsed.data.phase || event.previousDigest !== previous ||
      event.digest !== mathCycleEventDigest(previous, parsed.data)) return null;
    if (parsed.data.phase === "FRONTIER_DOSSIER") {
      if (!verifyFrontierDossier(parsed.data.dossier) || frontierDigestByRound.has(parsed.data.round)) return null;
      frontierDigestByRound.set(parsed.data.round, parsed.data.dossier.dossierDigest);
    }
    if (parsed.data.phase === "FRONTIER_REVIEWED" &&
      frontierDigestByRound.get(parsed.data.round) !== parsed.data.dossierDigest) return null;
    if (parsed.data.phase === "FRONTIER_GATE" &&
      (frontierDigestByRound.get(parsed.data.round) ?? null) !== parsed.data.dossierDigest) return null;
    if (parsed.data.phase === "PROPOSED") proposalsByRound.set(parsed.data.round, parsed.data.proposal);
    if (parsed.data.phase === "VERIFIED" && parsed.data.accepted) acceptedRounds.add(parsed.data.round);
    if (parsed.data.phase === "COMPUTED") {
      const plan = proposalsByRound.get(parsed.data.round)?.exactSurveyPlan;
      if (!plan || !acceptedRounds.has(parsed.data.round) || computedRounds.has(parsed.data.round)) return null;
      try {
        if (JSON.stringify(surveyResidualInterval(plan)) !== JSON.stringify(parsed.data.evidence)) return null;
      } catch { return null; }
      computedRounds.add(parsed.data.round);
    }
    if (parsed.data.phase === "ATTEMPTED") {
      if (proposalsByRound.get(parsed.data.round)?.exactSurveyPlan && !computedRounds.has(parsed.data.round)) return null;
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
    payloads.push(parsed.data);
    previous = event.digest;
  }
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
}) {
  await requireWorkspaceAuthorization(ctx, "research.request");
  if (!getEnv().RESEARCH_CODEX_LOCAL_ENABLED || !getEnv().MATH_PILOT_QUEUE_ENABLED) {
    throw new ResearchSandboxError("INVALID_TRANSITION", "Local Codex mathematics dispatch is disabled");
  }
  const limits = mathCycleLimitsSchema.parse({ maxRounds: raw.maxRounds, maxObservedTokens: raw.maxObservedTokens });
  if (!raw.caseId || raw.caseId.length > 160) throw new ResearchSandboxError("INVALID_INPUT", "Invalid root case identity");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  const cycleId = randomUUID();
  const commandId = randomUUID();
  return executeDurableCommand(ctx, {
    commandId, commandType: "math-pilot.cycle.request", idempotencyKey: `math-cycle:${raw.caseId}`,
    requiredCapability: "research.request", payload: { caseId: raw.caseId,
      maxRounds: limits.maxRounds, maxUsageUnits: limits.maxObservedTokens },
  }, async (tx) => {
    const { item, ledger } = await rootCase(tx, organizationId, ctx.workspace.id, raw.caseId);
    if (!rootGaps(ledger).length) throw new ResearchSandboxError("INVALID_TRANSITION", "Review contains no explicit unresolved gap");
    const prior = await tx.mathResearchCycle.findFirst({ where: { rootCaseId: item.id, organizationId } });
    if (prior) throw new ResearchSandboxError("INVALID_TRANSITION", "A cycle already exists for this OPEN case");
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
      payload: { cycleId, round: 1 },
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
    return cycles.map((cycle) => ({ ...cycle, trace: validateMathCycleTrace(cycle.events) }));
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
    if (verdict) await appendEvent(tx, cycle, job.id, { phase: "ROUND_CLOSED", round, ...verdict, nextGap });
    const completedRounds = cycle.completedRounds + (verdict ? 1 : 0);
    const stop = reason ?? (completedRounds >= cycle.maxRounds ? "ROUND_LIMIT"
      : !nextGap ? "NO_GAP"
      : cycle.observedTokens >= cycle.maxObservedTokens ? "TOKEN_LIMIT"
      : Date.now() >= cycle.deadlineAt.getTime() ? "TIME_LIMIT" : null);
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
    const events = await tx.mathResearchCycleEvent.findMany({ where: { cycleId: cycle.id }, orderBy: { sequence: "asc" }, take: 32 });
    const trace = validateMathCycleTrace(events);
    if (!trace) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Cycle event chain is invalid");
    const priorTasks = trace.filter((event): event is Extract<MathCycleEventPayload, { phase: "PROPOSED" }> => event.phase === "PROPOSED")
      .map((event) => event.proposal.taskStatement);
    const priorReview = trace.filter((event): event is Extract<MathCycleEventPayload, { phase: "REVIEWED" }> => event.phase === "REVIEWED");
    const gaps = round === 1 ? rootGaps(root.ledger)
      : [...new Set(priorReview.filter((event) => event.round === round - 1)
        .map((event) => event.report.unresolvedGap).filter((gap): gap is string => Boolean(gap)))];
    const priorArt = mathPriorArtFor(root.contract);
    await appendEvent(tx, cycle, job.id, { phase: "PRIOR_ART", round, facts: [...priorArt], coverage: "CURATED_PARTIAL" });
    await tx.durableJob.update({ where: { id: job.id }, data: { maxAttempts: 1 } });
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: { status: "RUNNING" } });
    return { cycleId: cycle.id, round, rootContract: root.contract, gaps, priorTasks, priorArt };
  });
  const { cycleId, round, rootContract, gaps, priorTasks, priorArt } = loaded;
  if (!gaps.length) return finishJob(input, cycleId, round, "NO_GAP");

  const reserve = async (role: Extract<MathCycleEventPayload, { phase: "CALL_STARTED" }>["role"]) => {
    const reason = await reserveCall(input, cycleId, round, role);
    if (reason) { await finishJob(input, cycleId, round, reason); return false; }
    return true;
  };
  if (!await reserve("PLANNER")) return;
  const plan = await input.agents.propose(rootContract, gaps, priorTasks, priorArt);
  const proposal = mathCycleProposalSchema.parse(plan.output);
  await retainResult(input, cycleId, { phase: "PROPOSED", round, proposal,
    context: { threadId: plan.threadId, usage: plan.usage } }, plan.usage);

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
    hypothesis: proposal.hypothesis, dossier });
  const frontierThreads: string[] = [];
  const needsSourceReview = sourceGate.decision === "HOLD" && dossier.discovery.status === "COMPLETE" &&
    dossier.sources.length > 0 && !knownScopeForTask(rootContract, proposal.taskStatement) &&
    !knownScopeForTask(rootContract, proposal.hypothesis);
  if (needsSourceReview) {
    const assessments: FrontierAssessment[] = [];
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
      hypothesis: proposal.hypothesis, dossier,
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
  const check = await input.agents.verify(rootContract, gaps, priorTasks, proposal, priorArt);
  const verification = mathCycleVerificationSchema.parse(check.output);
  if (frontierThreads.includes(check.threadId)) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Task verifier reused a frontier context");
  const deterministic = verifyMathCycleProposal({ rootContract, availableGaps: gaps, priorTasks,
    proposal, verification, plannerThreadId: plan.threadId, verifierThreadId: check.threadId });
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
  if (!await reserve("SOLVER")) return;
  const attempt = mathModelAttemptSchema.parse(await input.agents.solve(contract, computation));
  if (attempt.threadId === plan.threadId || attempt.threadId === check.threadId || frontierThreads.includes(attempt.threadId) ||
    attempt.modelName !== input.agents.modelName || attempt.providerName !== "codex-local") {
    throw new ResearchSandboxError("INTEGRITY_FAILURE", "Solver context or model identity is not independent");
  }
  await retainResult(input, cycleId, { phase: "ATTEMPTED", round, contract, attempt }, attempt.usage);
  await withOrganizationTenant(input.organizationId, input.actorUserId, async (tx) => {
    const cycle = await lockedCycle(tx, input.organizationId, cycleId);
    if (cycle.status !== "RUNNING") throw new ResearchSandboxError("JOB_CONFLICT", "Cycle moved before exact certificate check");
    await appendEvent(tx, cycle, input.jobId, { phase: "CERTIFICATE_CHECKED", round, method: "ERDOS_STRAUS_EXACT_IDENTITY_V1",
      checks: (attempt.erdosStrausWitnesses ?? []).map((witness) => {
        const certificate = verifyErdosStrausWitness(witness);
        return { witness, valid: certificate.valid, identityDigest: certificate.identityDigest };
      }) });
  });

  const reports: MathAgentReport[] = [];
  for (const role of ["CRITIC", "ADVERSARY"] as const) {
    if (!await reserve(role)) return;
    const report = mathAgentReportSchema.parse(await input.agents.reviewRole(role, contract, attempt, computation));
    if (report.role !== role || [plan.threadId, ...frontierThreads, check.threadId, attempt.threadId,
      ...reports.map((item) => item.threadId)].includes(report.threadId)) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Review context or role is not independent");
    }
    await retainResult(input, cycleId, { phase: "REVIEWED", round, role, report }, report.usage);
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
    await appendEvent(tx, cycle, job.id, { phase: "STOPPED", round: payload.round, reason });
    await tx.mathResearchCycle.update({ where: { id: cycle.id }, data: { status: "FAILED", stopReason: reason } });
  });
}
