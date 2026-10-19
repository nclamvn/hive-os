import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import { executeDurableCommand } from "@/modules/command-runtime";
import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { getEnv } from "@/server/env";
import { requireLrcCampaignCapability } from "./math-lrc-campaign-integration";
import {frozenMethodUnitFiniteSourcePins} from "./math-method-unit-source-registry";

import {
  requestComputationRunSchema,
  requestResearchRunSchema,
  mathModelAttemptSchema,
  researchProviderUsageSchema,
  reviewComputationRunSchema,
  reviewResearchRunSchema,
  sourcePolicySchema,
} from "./contracts";
import { isResearchSteeringConfigured, prepareResearchSteering } from "./research-steering";
import { ResearchSandboxError } from "./errors";
import { dossierIdSchema, encodeDossierCursor, olderThanCursor, calibrationCandidateFilter, MATH_CASE_SUMMARY_LIMIT,
  MATH_CALIBRATION_SCAN_LIMIT,
  type DossierCursor } from "./math-dossier-pagination";
import { validateRecordedMathAgentReview } from "./agent-review";
import { digestResearchResult, researchDossierDigest } from "./integrity";
import {
  calibratedCaseTypes,
  digestMathPilotContract,
  digestMathReviewChecklist,
  mathPilotAssessmentSchema,
  mathPilotContractSchema,
  mathReviewChecklistSchema,
  mathPilotScope,
  resolveMathPilotContract,
} from "./math-pilot";

function invalid(message: string): never {
  throw new ResearchSandboxError("INVALID_INPUT", message);
}

export async function isResearchSteeringAvailable(ctx: WorkspaceContext) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return isResearchSteeringConfigured(getEnv(), organizationId);
}

export async function listResearchRuns(ctx: WorkspaceContext) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const runs = await tx.researchRun.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id },
      include: {
        mission: { select: { referenceCode: true, title: true } },
        document: { select: { id: true, documentKey: true, title: true } },
        findings: { include: { decision: true }, orderBy: { findingKey: "asc" } },
        sources: {
          select: { id: true, title: true, canonicalUri: true, publisher: true, provenance: true, contentDigest: true },
          orderBy: [{ capturedAt: "desc" }, { id: "asc" }],
        },
        computations: { orderBy: [{ createdAt: "desc" }, { id: "desc" }] },
        mathPilotCase: { select: { id: true, assessment: { select: { id: true, conclusion: true } } } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
    });
    const jobIds = runs.flatMap((run) => (run.jobId ? [run.jobId] : []));
    const jobs = jobIds.length
      ? await tx.durableJob.findMany({
          where: { organizationId, id: { in: jobIds } },
          take: jobIds.length,
          select: {
            id: true,
            status: true,
            leaseExpiresAt: true,
          },
        })
      : [];
    const jobById = new Map(jobs.map((job) => [job.id, job]));
    return runs.map((run) => ({
      ...run,
      job: run.jobId ? (jobById.get(run.jobId) ?? null) : null,
    }));
  });
}

export async function listResearchTargets(ctx: WorkspaceContext) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const [missions, documents] = await Promise.all([
      tx.mission.findMany({
        where: { workspaceId: ctx.workspace.id },
        select: { id: true, referenceCode: true, title: true },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: 100,
      }),
      tx.authoringDocument.findMany({
        where: { organizationId, workspaceId: ctx.workspace.id },
        select: { id: true, missionId: true, documentKey: true, title: true },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: 100,
      }),
    ]);
    return { missions, documents };
  });
}

export async function listComputationRuns(ctx: WorkspaceContext) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
    tx.computationRun.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id },
      include: {
        mission: { select: { referenceCode: true, title: true } },
        document: { select: { documentKey: true, title: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
    }),
  );
}

export async function requestResearchRun(ctx: WorkspaceContext, raw: unknown) {
  const parsed = requestResearchRunSchema.safeParse(raw);
  if (!parsed.success) invalid("Research request violates its bounded contract");
  const input = parsed.data;
  // Only the authenticated kernel may create inherited context. A caller may
  // submit intent, never an apparently trusted snapshot in the persisted plan.
  if (input.queryPlan.steering) invalid("Caller-supplied prepared steering is not accepted");
  if (input.steering && (input.mathPilot || input.providerName !== "openai")) {
    invalid("Strategic steering is a generic one-step research request only");
  }
  if (input.steering) {
    await requireWorkspaceAuthorization(ctx, "research.request");
    const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
    if (!isResearchSteeringConfigured(getEnv(), organizationId)) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "Research transport is not configured for this organization");
    }
  }
  const mathContract = input.mathPilot ? resolveMathPilotContract(input.mathPilot) : null;
  if(mathContract?.lrcMethodUnitScope) {
    // G1 authorizes offline implementation only. Existing queue flags, a POST,
    // or caller-created WorkspaceContext must not create prospective live work.
    throw new ResearchSandboxError("INVALID_TRANSITION","Method-unit dispatch requires a separately approved authenticated G2 ingress");
  }
  if (mathContract?.lrcProofUnitScope) {
    requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
    if (input.providerName !== "codex-local" || input.modelName !== "gpt-6-sol") invalid("Proof-unit audits require the fixed local Codex lane");
  }
  if (mathContract?.lrcCampaignScope) {
    requireLrcCampaignCapability(getEnv().LRC_CAMPAIGN_LOCAL_ENABLED);
    if(input.providerName !== "codex-local") invalid("Campaign references require the local Codex lane");
  }
  if (mathContract?.lrcFiniteScope && (input.providerName !== "codex-local" ||
    !["development", "test"].includes(process.env.NODE_ENV ?? ""))) {
    invalid("Finite LRC certificates are local Codex development/test cases only");
  }
  if (input.providerName === "codex-local" && (!mathContract || !getEnv().RESEARCH_CODEX_LOCAL_ENABLED)) {
    invalid("Local Codex may only run for an explicitly enabled sealed mathematics pilot");
  }
  if (mathContract && (
    input.question !== mathContract.statement ||
    input.scope !== mathPilotScope(mathContract) ||
    input.queryPlan.queries[0] !== mathContract.statement
  )) {
    invalid("Math pilot brief must match the sealed problem contract");
  }
  const runId = randomUUID();
  const outcome = await executeDurableCommand(
    ctx,
    {
      commandId: randomUUID(),
      commandType: "research.run.request",
      idempotencyKey: input.idempotencyKey,
      requiredCapability: "research.request",
      missionId: input.missionId,
      payload: {
        ...(input.steering ? {
          question: input.question, scope: input.scope, steering: input.steering,
          sourcePolicy: input.sourcePolicy, queryPlan: input.queryPlan,
        } : { runId }),
        missionId: input.missionId,
        documentId: input.documentId,
        providerName: input.providerName,
        modelName: input.modelName,
      },
    },
    async (tx, command) => {
      if (input.steering && !isResearchSteeringConfigured(getEnv(), command.organizationId)) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Research transport is not configured for this organization");
      }
      if (mathContract && !getEnv().MATH_PILOT_QUEUE_ENABLED) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Math pilot dispatch requires explicit local operator activation");
      }
      const mission = await tx.mission.findFirst({
        where: { id: input.missionId, workspaceId: ctx.workspace.id },
        select: { id: true },
      });
      if (!mission) throw new ResearchSandboxError("NOT_FOUND", "Mission not found");
      let queryPlan = input.queryPlan;
      let scope = input.scope;
      let sourcePolicy = input.sourcePolicy;
      if (input.steering) {
        const parent = input.steering.parentRunId ? await tx.researchRun.findFirst({
          where: { id: input.steering.parentRunId, organizationId: command.organizationId,
            workspaceId: ctx.workspace.id, missionId: mission.id },
          include: { mathPilotCase: { select: { id: true } },
            findings: { include: { decision: true }, orderBy: { id: "asc" } },
            sources: { select: { id: true, title: true, canonicalUri: true, contentDigest: true }, orderBy: { id: "asc" } } },
        }) : null;
        if (input.steering.parentRunId && !parent) throw new ResearchSandboxError("NOT_FOUND", "Research parent is unavailable");
        if (parent && (parent.mathPilotCase || ["QUEUED", "RUNNING"].includes(parent.status))) {
          throw new ResearchSandboxError("INVALID_TRANSITION", "Parent is not a completed generic research step");
        }
        if (parent && (parent.question !== input.question || parent.documentId !== input.documentId ||
          parent.providerName !== input.providerName || parent.modelName !== input.modelName)) {
          invalid("The goal, document and provider identity must match the parent exactly");
        }
        if (parent) {
          scope = parent.scope;
          sourcePolicy = sourcePolicySchema.parse(parent.sourcePolicy);
        }
        queryPlan = { ...input.queryPlan, steering: prepareResearchSteering(input.steering, runId, parent ?? undefined) };
      }
      if (input.documentId) {
        const document = await tx.authoringDocument.findFirst({
          where: { id: input.documentId, workspaceId: ctx.workspace.id, missionId: mission.id },
          select: { id: true },
        });
        if (!document) throw new ResearchSandboxError("NOT_FOUND", "Authoring document is outside the Mission boundary");
      }
      if (mathContract) {
        await tx.$queryRaw<Array<{ locked: number }>>`
          SELECT 1::INTEGER AS locked
          FROM pg_advisory_xact_lock(hashtextextended(${`${command.organizationId}:math-pilot-dispatch:${input.missionId}`}, 0))
        `;
        const activeCandidates = await tx.mathPilotCase.findMany({
          where: {
            organizationId: command.organizationId,
            workspaceId: command.workspaceId,
            missionId: input.missionId,
            caseType: mathContract.caseType,
            AND: [
              { researchRun: { providerName: input.providerName, modelName: input.modelName } },
              { OR: mathContract.caseType === "OPEN" || mathContract.caseType === "BENCHMARK_PROOF" || mathContract.caseType === "BENCHMARK_EXACT" ? [
                { researchRun: { status: { in: ["QUEUED", "RUNNING"] } } },
                { researchRun: { status: "AWAITING_REVIEW" }, agentReview: { is: null } },
                ...(mathContract.lrcProofUnitScope ? [{researchCycles:{some:{status:{in:["QUEUED","RUNNING"] as Array<"QUEUED"|"RUNNING">}}}}] :
                  [{ researchRun: { status: { in: ["AWAITING_REVIEW", "APPROVED"] as Array<"AWAITING_REVIEW"|"APPROVED"> } },
                    researchCycles: { some: { status: { in: ["QUEUED", "RUNNING"] as Array<"QUEUED"|"RUNNING"> } } } }]),
              ] : [{ researchRun: { status: { in: ["QUEUED", "RUNNING", "AWAITING_REVIEW"] } } }] },
            ],
          },
          select: { id: true, researchRun: { select: { status: true } }, agentReview: { select: { id: true } },
            ...(mathContract.lrcProofUnitScope ? {researchCycles:{where:{status:{in:["QUEUED","RUNNING"] as Array<"QUEUED"|"RUNNING">}},select:{id:true},take:1}} : {}) },
          take: 500,
        });
        if (activeCandidates.length === 500) {
          throw new ResearchSandboxError("INVALID_TRANSITION", "Too many active math cases to safely authorize another run");
        }
        for (const active of activeCandidates) {
          if(mathContract.lrcProofUnitScope && (active.researchCycles as Array<{id:string}> | undefined)?.length)
            throw new ResearchSandboxError("INVALID_TRANSITION","An active controlled cycle blocks proof-unit dispatch");
          if (active.researchRun.status === "AWAITING_REVIEW" && !active.agentReview &&
            ["OPEN", "BENCHMARK_PROOF", "BENCHMARK_EXACT"].includes(mathContract.caseType)) {
            const terminalReview = await tx.durableJob.findFirst({
              where: { organizationId: command.organizationId, jobType: "math-pilot.codex-local.review",
                status: "DEAD_LETTER", payload: { path: ["caseId"], equals: active.id } },
              select: { id: true },
            });
            if (terminalReview) continue;
          }
          throw new ResearchSandboxError("INVALID_TRANSITION", "An active math case for this Mission and model already exists");
        }
      }
      if (mathContract?.caseType === "OPEN" || mathContract?.caseType === "BENCHMARK_PROOF" || mathContract?.caseType === "BENCHMARK_EXACT") {
        const passed = new Set<"CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE">();
        let calibrationCursor: DossierCursor | null = null;
        let calibrationScanComplete = false;
        for (let inspected = 0; inspected < MATH_CALIBRATION_SCAN_LIMIT; inspected += 20) {
          const calibrations = await tx.mathPilotCase.findMany({
            where: {
              organizationId: command.organizationId,
              workspaceId: command.workspaceId,
              missionId: input.missionId,
              ...calibrationCandidateFilter(input.providerName, input.modelName, calibrationCursor),
            },
            include: {
              researchRun: {
                include: {
                  sources: { select: { canonicalUri: true, contentDigest: true, provenance: true } },
                  findings: { include: { decision: true } },
                },
              },
              assessment: { select: { conclusion: true, researchDigest: true, reviewChecklist: true, reviewChecklistDigest: true } },
              agentReview: true,
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 20,
          });
          const batchPassed = calibratedCaseTypes(calibrations.map((item) => ({
            ...item,
            approvedIntegrityValid: Boolean(item.researchRun.approvedDigest && reviewedDigest(item.researchRun) === item.researchRun.approvedDigest),
            agentReviewValid: Boolean(validateRecordedMathAgentReview({
              contract: item.contract, contractDigest: item.contractDigest,
              attempt: item.researchRun.mathModelAttempt, attemptDigest: item.researchRun.mathModelAttemptDigest,
              researchDigest: reviewedDigest(item.researchRun), review: item.agentReview,
            })),
          })), input.providerName, input.modelName);
          for (const type of batchPassed) passed.add(type);
          if (passed.size === 2 || calibrations.length < 20) { calibrationScanComplete = true; break; }
          const last: { id: string; createdAt: Date } = calibrations.at(-1)!;
          calibrationCursor = { version: 1, missionId: input.missionId, scopeId: "calibration",
            id: last.id, createdAt: last.createdAt.toISOString() };
        }
        if (!calibrationScanComplete || passed.size !== 2) {
          throw new ResearchSandboxError("INVALID_TRANSITION", "Both sealed math calibrations need a valid AI or human review for this Mission and model");
        }
      }
      await tx.researchRun.create({
        data: {
          id: runId,
          organizationId: command.organizationId,
          workspaceId: command.workspaceId,
          missionId: input.missionId,
          documentId: input.documentId,
          question: input.question,
          scope,
          sourcePolicy: sourcePolicy as Prisma.InputJsonValue,
          queryPlan: queryPlan as Prisma.InputJsonValue,
          providerName: input.providerName,
          modelName: input.modelName,
          commandId: command.commandId,
          requestedByMembershipId: ctx.membership.id,
        },
      });
      if (mathContract) {
        const pilotCase = await tx.mathPilotCase.create({
          data: {
            organizationId: command.organizationId,
            workspaceId: command.workspaceId,
            missionId: input.missionId,
            researchRunId: runId,
            caseType: mathContract.caseType,
            contract: mathContract as Prisma.InputJsonValue,
            contractDigest: digestMathPilotContract(mathContract),
          },
        });
        await writeAuditEvent(tx, {
          workspaceId: ctx.workspace.id,
          actorUserId: ctx.user.id,
          actorMembershipId: ctx.membership.id,
          eventType: AuditEventType.MathPilotCaseCreated,
          entityType: "MathPilotCase",
          entityId: pilotCase.id,
          correlationId: command.correlationId,
          payload: { runId, missionId: input.missionId, caseType: mathContract.caseType, contractDigest: digestMathPilotContract(mathContract) },
        });
      }
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.ResearchRequested,
        entityType: "ResearchRun",
        entityId: runId,
        correlationId: command.correlationId,
        payload: { runId, missionId: input.missionId, provider: input.providerName, model: input.modelName },
      });
      return {
        outcome: { runId, status: "QUEUED" },
        outbox: [{
          topic: mathContract && input.providerName === "codex-local"
            ? "math-pilot.codex-local.execute"
            : "research.run.execute",
          aggregateType: "ResearchRun",
          aggregateId: runId,
          payload: { runId },
        }],
      };
    },
  );
  return outcome;
}

const reviewedDigest = researchDossierDigest;

export async function reviewResearchRun(ctx: WorkspaceContext, raw: unknown) {
  await requireWorkspaceAuthorization(ctx, "research.review");
  const parsed = reviewResearchRunSchema.safeParse(raw);
  if (!parsed.success) invalid("Research review violates its bounded contract");
  const input = parsed.data;
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`SELECT id FROM research_run WHERE organization_id = ${organizationId} AND id = ${input.runId} FOR UPDATE`;
    const run = await tx.researchRun.findFirst({
      where: { id: input.runId, organizationId, workspaceId: ctx.workspace.id },
      include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      },
    });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Research run not found");
    if (run.status !== "AWAITING_REVIEW") throw new ResearchSandboxError("INVALID_TRANSITION", "Research run is not awaiting review");
    if (run.requestedByMembershipId === ctx.membership.id) {
      throw new ResearchSandboxError("SEPARATION_OF_DUTIES", "The requester cannot review their own research run");
    }
    const findingIds = new Set(run.findings.map((finding) => finding.id));
    const submittedIds = input.findings.map((finding) => finding.findingId);
    if (new Set(submittedIds).size !== submittedIds.length || submittedIds.some((id) => !findingIds.has(id)) || submittedIds.length !== findingIds.size) {
      invalid("Every retained finding must receive exactly one review decision");
    }
    if (input.decision === "APPROVED") {
      if (!input.findings.some((finding) => finding.decision === "ACCEPTED") || input.findings.some((finding) => finding.decision === "FLAGGED")) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "Approval requires at least one accepted finding and no unresolved flags");
      }
    }
    for (const finding of input.findings) {
      await tx.researchFindingDecision.create({
        data: {
          organizationId,
          workspaceId: ctx.workspace.id,
          missionId: run.missionId,
          researchRunId: run.id,
          findingId: finding.findingId,
          decision: finding.decision,
          rationale: finding.rationale,
          reviewedByMembershipId: ctx.membership.id,
        },
      });
    }
    const withDecisions = await tx.researchRun.findUniqueOrThrow({
      where: { id: run.id },
      include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      },
    });
    const resultDigest = reviewedDigest(withDecisions);
    const counts = input.findings.reduce(
      (acc, item) => ({ ...acc, [item.decision]: acc[item.decision] + 1 }),
      { ACCEPTED: 0, REJECTED: 0, FLAGGED: 0 },
    );
    const status = input.decision === "APPROVED" ? "APPROVED" : "REJECTED";
    const updated = await tx.researchRun.update({
      where: { id: run.id },
      data: {
        status,
        reviewedByMembershipId: ctx.membership.id,
        reviewRationale: input.rationale,
        approvedDigest: status === "APPROVED" ? resultDigest : null,
        reviewedAt: new Date(),
        version: { increment: 1 },
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ResearchReviewed,
      entityType: "ResearchRun",
      entityId: run.id,
      correlationId: ctx.correlationId,
      payload: {
        runId: run.id,
        decision: status,
        acceptedCount: counts.ACCEPTED,
        rejectedCount: counts.REJECTED,
        flaggedCount: counts.FLAGGED,
        resultDigest,
      },
    });
    return updated;
  });
}

export async function getApprovedResearchBundle(ctx: WorkspaceContext, runId: string) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const run = await tx.researchRun.findFirst({
      where: { id: runId, organizationId, workspaceId: ctx.workspace.id },
      include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
        mathPilotCase: { include: { assessment: true, agentReview: true } },
      },
    });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Research bundle not found");
    const dossierDigest = reviewedDigest(run);
    const humanApproved = run.status === "APPROVED" && Boolean(run.approvedDigest) && dossierDigest === run.approvedDigest;
    let aiLedger = null;
    if (run.mathPilotCase) {
      const contract = mathPilotContractSchema.safeParse(run.mathPilotCase.contract);
      if (!contract.success || digestMathPilotContract(contract.data) !== run.mathPilotCase.contractDigest) {
        throw new ResearchSandboxError("INTEGRITY_FAILURE", "Math pilot contract digest is invalid");
      }
      if (run.mathPilotCase.assessment && humanApproved) {
        if (run.mathPilotCase.assessment.researchDigest !== run.approvedDigest) {
          throw new ResearchSandboxError("INTEGRITY_FAILURE", "Human assessment refers to a different dossier");
        }
        const ledger = mathReviewChecklistSchema.safeParse(run.mathPilotCase.assessment.reviewChecklist);
        if (!ledger.success || digestMathReviewChecklist(ledger.data) !== run.mathPilotCase.assessment.reviewChecklistDigest) {
          throw new ResearchSandboxError("INTEGRITY_FAILURE", "Math pilot review ledger is missing or corrupted");
        }
      } else {
        aiLedger = validateRecordedMathAgentReview({
          caseId:run.mathPilotCase.id,runId:run.id,
          contract: run.mathPilotCase.contract, contractDigest: run.mathPilotCase.contractDigest,
          attempt: run.mathModelAttempt, attemptDigest: run.mathModelAttemptDigest,
          researchDigest: dossierDigest, review: run.mathPilotCase.agentReview,
          ...(contract.data.lrcMethodUnitScope?{finiteSourcePins:frozenMethodUnitFiniteSourcePins(),reviewJobId:run.mathPilotCase.agentReview?.jobId??undefined}:{}),
        });
        if (!["AWAITING_REVIEW", "APPROVED"].includes(run.status) || aiLedger?.disposition !== "AI_REVIEWED") {
          throw new ResearchSandboxError("INVALID_TRANSITION", "Math pilot needs a valid AI or human assessment before authoring import");
        }
      }
    } else if (!humanApproved) {
      throw new ResearchSandboxError("NOT_FOUND", "Approved research bundle not found");
    }
    return {
      runId: run.id,
      missionId: run.missionId,
      documentId: run.documentId,
      question: run.question,
      digest: humanApproved ? run.approvedDigest! : dossierDigest,
      mathAssessment: run.mathPilotCase?.assessment && humanApproved ? {
        reviewMethod: "HUMAN" as const,
        conclusion: run.mathPilotCase.assessment.conclusion,
        rationale: run.mathPilotCase.assessment.rationale,
        verificationNotes: run.mathPilotCase.assessment.verificationNotes,
        reviewChecklistDigest: run.mathPilotCase.assessment.reviewChecklistDigest!,
      } : aiLedger && run.mathPilotCase?.agentReview ? {
        reviewMethod: "AI" as const,
        conclusion: aiLedger.conclusion,
        rationale: aiLedger.reports.map((report) => `${report.role}: ${report.reasoning}`).join("\n"),
        verificationNotes: aiLedger.oracle.note,
        reviewChecklistDigest: run.mathPilotCase.agentReview.ledgerDigest,
      } : null,
      sources: run.sources.map((source) => ({
        id: source.id,
        canonicalUri: source.canonicalUri,
        title: source.title,
        publisher: source.publisher,
        mediaType: source.mediaType,
        contentDigest: source.contentDigest,
        provenance: source.provenance,
        capturedAt: source.capturedAt,
      })),
      findings: run.findings.filter((finding) => finding.decision?.decision === "ACCEPTED"),
    };
  });
}

export async function listMathPilotCalibrationActivity(ctx: WorkspaceContext, missionId: string, providerName: string, modelName: string) {
  await requireWorkspaceAuthorization(ctx, "research.read", missionId);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const active = new Set<"CALIBRATION_PROOF" | "CALIBRATION_COUNTEREXAMPLE">();
    for (const caseType of ["CALIBRATION_PROOF", "CALIBRATION_COUNTEREXAMPLE"] as const) {
      const item = await tx.mathPilotCase.findFirst({ where: { organizationId, workspaceId: ctx.workspace.id, missionId,
        caseType, researchRun: { providerName, modelName, status: { in: ["QUEUED", "RUNNING", "AWAITING_REVIEW"] } } },
        select: { id: true } });
      if (item) active.add(caseType);
    }
    return active;
  });
}

export async function listMathPilotCaseSummaries(ctx: WorkspaceContext, missionId: string, cursor: DossierCursor | null = null) {
  if (cursor && (cursor.missionId !== missionId || cursor.scopeId !== "")) invalid("Invalid dossier query");
  await requireWorkspaceAuthorization(ctx, "research.read", missionId);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const mission = await tx.mission.findFirst({ where: { id: missionId, workspaceId: ctx.workspace.id }, select: { id: true } });
    if (!mission) throw new ResearchSandboxError("NOT_FOUND", "Mission not found");
    const where = { organizationId, workspaceId: ctx.workspace.id, missionId };
    const total = await tx.mathPilotCase.count({ where });
    const rows = await tx.mathPilotCase.findMany({ where: { ...where, ...olderThanCursor(cursor) },
      select: { id: true, caseType: true, createdAt: true, researchRun: { select: { question: true, status: true } } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: MATH_CASE_SUMMARY_LIMIT + 1 });
    const items = rows.slice(0, MATH_CASE_SUMMARY_LIMIT);
    const last = items.at(-1);
    return { items, total, nextCursor: rows.length > MATH_CASE_SUMMARY_LIMIT && last
      ? encodeDossierCursor({ missionId, scopeId: "", createdAt: last.createdAt.toISOString(), id: last.id }) : null };
  });
}

/** Optional exact IDs are scoped again by trusted workspace AND mission before any body is read. */
export async function listMathPilotCases(ctx: WorkspaceContext, missionId: string, options: {
  ids?: string[]; calibration?: { providerName: string; modelName: string; cursor: DossierCursor | null };
  take?: number; includeJobs?: boolean;
} = {}) {
  if (!Number.isInteger(options.take ?? 100) || (options.take ?? 100) < 1 || (options.take ?? 100) > 100) invalid("Invalid dossier query");
  if (options.calibration?.cursor && (options.calibration.cursor.missionId !== missionId || options.calibration.cursor.scopeId !== "calibration")) invalid("Invalid dossier query");
  if (options.ids && (options.ids.length > 20 || new Set(options.ids).size !== options.ids.length ||
    options.ids.some((id) => !dossierIdSchema.safeParse(id).success))) invalid("Invalid dossier query");
  await requireWorkspaceAuthorization(ctx, "research.read", missionId);
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const mission = await tx.mission.findFirst({
      where: { id: missionId, workspaceId: ctx.workspace.id },
      select: { id: true },
    });
    if (!mission) throw new ResearchSandboxError("NOT_FOUND", "Mission not found");
    const cases = await tx.mathPilotCase.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, missionId,
        ...(options.ids ? { id: { in: options.ids } } : {}),
        ...(options.calibration ? calibrationCandidateFilter(options.calibration.providerName,
          options.calibration.modelName, options.calibration.cursor) : {}) },
      include: {
        researchRun: {
          select: {
            id: true, status: true, question: true, scope: true, providerName: true, modelName: true,
            approvedDigest: true, requestedByMembershipId: true, reviewRationale: true,
            providerUsage: true, mathModelAttempt: true, mathModelAttemptDigest: true,
            sources: { select: { canonicalUri: true, contentDigest: true, provenance: true } },
            findings: { include: { decision: true } },
          },
        },
        assessment: true,
        agentReview: true,
        numericVerification: true,
        formalAttempts: { include: { replay: true, alignment: true }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: options.take ?? (options.ids ? Math.max(1, options.ids.length) : 100),
    });
    const displayedIds = cases.map((item) => item.id);
    const attemptIds = cases.flatMap((item) => item.formalAttempts.map((attempt) => attempt.id));
    const caseJobScope = { outboxEvent: { aggregateType: "MathPilotCase", aggregateId: { in: displayedIds } } };
    const reviewJobs = options.includeJobs === false ? [] : await tx.durableJob.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, jobType: "math-pilot.codex-local.review", ...caseJobScope },
      select: { id: true, status: true, payload: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 200,
    });
    const reviewJobByCase = new Map<string, (typeof reviewJobs)[number]>();
    for (const job of reviewJobs) {
      const payload = job.payload as Record<string, unknown>;
      if (typeof payload.caseId === "string" && !reviewJobByCase.has(payload.caseId)) reviewJobByCase.set(payload.caseId, job);
    }
    const reviewOutboxes = options.includeJobs === false ? [] : await tx.outboxEvent.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.codex-local.review", aggregateType: "MathPilotCase", aggregateId: { in: displayedIds } },
      select: { aggregateId: true }, take: 200,
    });
    const reviewOutboxCases = new Set(reviewOutboxes.map((event) => event.aggregateId));
    const numericJobs = options.includeJobs === false ? [] : await tx.durableJob.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, jobType: "math-pilot.exact-interval.verify", ...caseJobScope },
      select: { status: true, payload: true }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 200,
    });
    const numericJobByCase = new Map<string, (typeof numericJobs)[number]>();
    for (const job of numericJobs) {
      const payload = job.payload as Record<string, unknown>;
      if (typeof payload.caseId === "string" && !numericJobByCase.has(payload.caseId)) numericJobByCase.set(payload.caseId, job);
    }
    const numericOutboxes = options.includeJobs === false ? [] : await tx.outboxEvent.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.exact-interval.verify", aggregateType: "MathPilotCase", aggregateId: { in: displayedIds } },
      select: { aggregateId: true }, take: 200,
    });
    const numericOutboxCases = new Set(numericOutboxes.map((event) => event.aggregateId));
    const formalJobs = options.includeJobs === false ? [] : await tx.durableJob.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, jobType: "math-pilot.formalize.check", ...caseJobScope },
      select: { status: true, payload: true }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 200,
    });
    const formalJobByCase = new Map<string, (typeof formalJobs)[number]>();
    for (const job of formalJobs) {
      const payload = job.payload as Record<string, unknown>;
      if (typeof payload.caseId === "string" && !formalJobByCase.has(payload.caseId)) formalJobByCase.set(payload.caseId, job);
    }
    const formalOutboxes = options.includeJobs === false ? [] : await tx.outboxEvent.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.formalize.check", aggregateType: "MathPilotCase", aggregateId: { in: displayedIds } },
      select: { aggregateId: true }, take: 200,
    });
    const formalOutboxCases = new Set(formalOutboxes.map((event) => event.aggregateId));
    const formalDispatchCount = new Map<string, number>();
    for (const event of formalOutboxes) formalDispatchCount.set(event.aggregateId,
      (formalDispatchCount.get(event.aggregateId) ?? 0) + 1);
    const replayJobs = options.includeJobs === false ? [] : await tx.durableJob.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, jobType: "math-pilot.formal-replay.check",
        outboxEvent: { aggregateType: "MathPilotFormalAttempt", aggregateId: { in: attemptIds } } },
      select: { status: true, payload: true }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 200,
    });
    const replayJobByAttempt = new Map<string, (typeof replayJobs)[number]>();
    for (const job of replayJobs) {
      const payload = job.payload as Record<string, unknown>;
      if (typeof payload.formalAttemptId === "string" && !replayJobByAttempt.has(payload.formalAttemptId)) {
        replayJobByAttempt.set(payload.formalAttemptId, job);
      }
    }
    const replayOutboxes = options.includeJobs === false ? [] : await tx.outboxEvent.findMany({
      where: { organizationId, workspaceId: ctx.workspace.id, topic: "math-pilot.formal-replay.check",
        aggregateType: "MathPilotFormalAttempt", aggregateId: { in: attemptIds } }, select: { aggregateId: true }, take: 200,
    });
    const replayDispatchCount = new Map<string, number>();
    for (const event of replayOutboxes) replayDispatchCount.set(event.aggregateId,
      (replayDispatchCount.get(event.aggregateId) ?? 0) + 1);
    return cases.map((item) => ({
      ...item,
      approvedIntegrityValid: Boolean(item.researchRun.approvedDigest && reviewedDigest(item.researchRun) === item.researchRun.approvedDigest),
      researchIntegrityDigest: reviewedDigest(item.researchRun),
      agentReviewJobStatus: reviewJobByCase.get(item.id)?.status ?? (reviewOutboxCases.has(item.id) ? "PENDING" : null),
      numericVerificationJobStatus: numericJobByCase.get(item.id)?.status ?? (numericOutboxCases.has(item.id) ? "PENDING" : null),
      formalAttemptJobStatus: formalJobByCase.get(item.id)?.status ?? (formalOutboxCases.has(item.id) ? "PENDING" : null),
      formalAttemptDispatchCount: formalDispatchCount.get(item.id) ?? 0,
      formalReplayJobStatus: replayJobByAttempt.get(item.formalAttempts[0]?.id ?? "")?.status ??
        (replayDispatchCount.has(item.formalAttempts[0]?.id ?? "") ? "PENDING" : null),
      formalReplayDispatchCount: replayDispatchCount.get(item.formalAttempts[0]?.id ?? "") ?? 0,
    }));
  });
}

export async function assessMathPilotCase(ctx: WorkspaceContext, raw: unknown) {
  await requireWorkspaceAuthorization(ctx, "research.review");
  const parsed = mathPilotAssessmentSchema.safeParse(raw);
  if (!parsed.success) invalid("Math pilot assessment violates its bounded contract");
  const input = parsed.data;
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw<Array<{ locked: number }>>`
      SELECT 1::INTEGER AS locked
      FROM pg_advisory_xact_lock(hashtextextended(${`${organizationId}:math-pilot:${input.caseId}`}, 0))
    `;
    const pilotCase = await tx.mathPilotCase.findFirst({
      where: { id: input.caseId, organizationId, workspaceId: ctx.workspace.id },
      include: {
        assessment: true,
        agentReview: true,
        researchRun: {
          include: {
            sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
            findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
          },
        },
      },
    });
    if (!pilotCase) throw new ResearchSandboxError("NOT_FOUND", "Math pilot case not found");
    if (pilotCase.assessment) throw new ResearchSandboxError("INVALID_TRANSITION", "Math pilot case has already been assessed");
    const contract = mathPilotContractSchema.safeParse(pilotCase.contract);
    if (!contract.success || digestMathPilotContract(contract.data) !== pilotCase.contractDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Math pilot contract digest is invalid");
    }
    const run = pilotCase.researchRun;
    if (run.requestedByMembershipId === ctx.membership.id) {
      throw new ResearchSandboxError("SEPARATION_OF_DUTIES", "Requester cannot assess their own math case");
    }
    if (run.status !== "APPROVED" || !run.approvedDigest) {
      throw new ResearchSandboxError("INVALID_TRANSITION", "Only an independently approved research dossier may be assessed");
    }
    if (reviewedDigest(run) !== run.approvedDigest) {
      throw new ResearchSandboxError("INTEGRITY_FAILURE", "Approved research digest is stale or corrupted");
    }
    if (contract.data.caseType === "BENCHMARK_EXACT" && input.conclusion === "SUPPORTED_ARGUMENT") {
      const ledger = validateRecordedMathAgentReview({
        contract: pilotCase.contract,
        contractDigest: pilotCase.contractDigest,
        attempt: run.mathModelAttempt,
        attemptDigest: run.mathModelAttemptDigest,
        researchDigest: run.approvedDigest,
        review: pilotCase.agentReview,
      });
      if (ledger?.disposition !== "AI_REVIEWED" || ledger.conclusion !== "SUPPORTED_ARGUMENT" ||
        !ledger.oracle.exactAnswerMatch || !ledger.oracle.exactReplayValid) {
        throw new ResearchSandboxError("INVALID_TRANSITION", "A favorable exact-answer assessment requires a valid sealed answer, isolated replay, and independently recorded AI review");
      }
    }
    if (run.providerName === "openai") {
      const usage = researchProviderUsageSchema.safeParse(run.providerUsage);
      const job = run.jobId ? await tx.durableJob.findFirst({
        where: { id: run.jobId, organizationId, jobType: "research.run.execute" },
        select: { status: true, result: true },
      }) : null;
      const result = job?.result && typeof job.result === "object" && !Array.isArray(job.result)
        ? job.result as Record<string, unknown>
        : null;
      const retainedUsage = researchProviderUsageSchema.safeParse(result?.providerUsage);
      if (
        job?.status !== "SUCCEEDED" || !usage.success || !retainedUsage.success ||
        usage.data.modelName !== run.modelName ||
        JSON.stringify(usage.data) !== JSON.stringify(retainedUsage.data)
      ) {
        throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "Math assessment requires a completed job with matching retained provider usage");
      }
    }
    if (run.providerName === "codex-local") {
      const attempt = mathModelAttemptSchema.safeParse(run.mathModelAttempt);
      const job = run.jobId ? await tx.durableJob.findFirst({
        where: { id: run.jobId, organizationId, jobType: "math-pilot.codex-local.execute" },
        select: { status: true, result: true },
      }) : null;
      const result = job?.result && typeof job.result === "object" && !Array.isArray(job.result)
        ? job.result as Record<string, unknown>
        : null;
      if (
        job?.status !== "SUCCEEDED" || !attempt.success ||
        attempt.data.modelName !== run.modelName ||
        digestResearchResult(attempt.data) !== run.mathModelAttemptDigest ||
        result?.mathModelAttemptDigest !== run.mathModelAttemptDigest
      ) {
        throw new ResearchSandboxError("PROVIDER_ACCOUNTING_UNVERIFIED", "Local Codex assessment requires a completed, digest-bound mathematical attempt");
      }
    }
    const assessment = await tx.mathPilotAssessment.create({
      data: {
        organizationId,
        workspaceId: ctx.workspace.id,
        missionId: pilotCase.missionId,
        caseId: pilotCase.id,
        conclusion: input.conclusion,
        rationale: input.rationale,
        verificationNotes: input.verificationNotes,
        reviewChecklist: input.reviewChecklist,
        reviewChecklistDigest: digestMathReviewChecklist(input.reviewChecklist),
        researchDigest: run.approvedDigest,
        reviewerMembershipId: ctx.membership.id,
      },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.MathPilotAssessed,
      entityType: "MathPilotCase",
      entityId: pilotCase.id,
      correlationId: ctx.correlationId,
      payload: {
        caseId: pilotCase.id,
        runId: run.id,
        conclusion: input.conclusion,
        researchDigest: run.approvedDigest,
        contractDigest: pilotCase.contractDigest,
        reviewChecklistDigest: assessment.reviewChecklistDigest,
      },
    });
    return assessment;
  });
}

export async function requestComputationRun(ctx: WorkspaceContext, raw: unknown) {
  const parsed = requestComputationRunSchema.safeParse(raw);
  if (!parsed.success) invalid("Computation request violates its bounded contract");
  const input = parsed.data;
  if (input.networkPolicy === "ALLOWLIST") {
    await requireWorkspaceAuthorization(ctx, "sandbox.review", input.missionId);
  }
  const runId = randomUUID();
  return executeDurableCommand(
    ctx,
    {
      commandId: randomUUID(),
      commandType: "sandbox.run.request",
      idempotencyKey: input.idempotencyKey,
      requiredCapability: "sandbox.request",
      missionId: input.missionId,
      payload: { runId, missionId: input.missionId, kind: input.kind, runtimeId: input.runtimeId, runtimeVersion: input.runtimeVersion },
    },
    async (tx, command) => {
      const mission = await tx.mission.findFirst({ where: { id: input.missionId, workspaceId: ctx.workspace.id }, select: { id: true } });
      if (!mission) throw new ResearchSandboxError("NOT_FOUND", "Mission not found");
      if (input.documentId) {
        const document = await tx.authoringDocument.findFirst({ where: { id: input.documentId, workspaceId: ctx.workspace.id, missionId: mission.id }, select: { id: true } });
        if (!document) throw new ResearchSandboxError("NOT_FOUND", "Authoring document is outside the Mission boundary");
      }
      if (input.researchRunId) {
        const research = await tx.researchRun.findFirst({ where: { id: input.researchRunId, workspaceId: ctx.workspace.id, missionId: mission.id }, select: { id: true } });
        if (!research) throw new ResearchSandboxError("NOT_FOUND", "Research run is outside the Mission boundary");
      }
      await tx.computationRun.create({
        data: {
          id: runId,
          organizationId: command.organizationId,
          workspaceId: command.workspaceId,
          missionId: input.missionId,
          documentId: input.documentId,
          researchRunId: input.researchRunId,
          kind: input.kind,
          runtimeId: input.runtimeId,
          runtimeVersion: input.runtimeVersion,
          entrypoint: input.entrypoint,
          networkPolicy: input.networkPolicy,
          networkAllowlist: input.networkAllowlist,
          resourceLimits: input.resourceLimits,
          inputReference: input.inputReference,
          inputDigest: input.inputDigest,
          commandId: command.commandId,
          requestedByMembershipId: ctx.membership.id,
        },
      });
      await writeAuditEvent(tx, {
        workspaceId: ctx.workspace.id,
        actorUserId: ctx.user.id,
        actorMembershipId: ctx.membership.id,
        eventType: AuditEventType.SandboxRequested,
        entityType: "ComputationRun",
        entityId: runId,
        correlationId: command.correlationId,
        payload: { runId, missionId: input.missionId, kind: input.kind, runtimeId: input.runtimeId, networkPolicy: input.networkPolicy },
      });
      return {
        outcome: { runId, status: "QUEUED" },
        outbox: [{ topic: "sandbox.run.execute", aggregateType: "ComputationRun", aggregateId: runId, payload: { runId } }],
      };
    },
  );
}

export async function reviewComputationRun(ctx: WorkspaceContext, raw: unknown) {
  await requireWorkspaceAuthorization(ctx, "sandbox.review");
  const parsed = reviewComputationRunSchema.safeParse(raw);
  if (!parsed.success) invalid("Computation review violates its bounded contract");
  const input = parsed.data;
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    await tx.$queryRaw`SELECT id FROM computation_run WHERE organization_id = ${organizationId} AND id = ${input.runId} FOR UPDATE`;
    const run = await tx.computationRun.findFirst({ where: { id: input.runId, organizationId, workspaceId: ctx.workspace.id } });
    if (!run) throw new ResearchSandboxError("NOT_FOUND", "Computation run not found");
    if (run.status !== "AWAITING_REVIEW" || !run.outputDigest) throw new ResearchSandboxError("INVALID_TRANSITION", "Computation run is not awaiting review");
    if (run.requestedByMembershipId === ctx.membership.id) throw new ResearchSandboxError("SEPARATION_OF_DUTIES", "The requester cannot review their own computation run");
    const status = input.decision === "APPROVED" ? "APPROVED" : "REJECTED";
    const updated = await tx.computationRun.update({
      where: { id: run.id },
      data: { status, reviewedByMembershipId: ctx.membership.id, reviewRationale: input.rationale, reviewedAt: new Date(), version: { increment: 1 } },
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.SandboxReviewed,
      entityType: "ComputationRun",
      entityId: run.id,
      correlationId: ctx.correlationId,
      payload: { runId: run.id, decision: status, outputDigest: run.outputDigest },
    });
    return updated;
  });
}
