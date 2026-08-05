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

import {
  requestComputationRunSchema,
  requestResearchRunSchema,
  reviewComputationRunSchema,
  reviewResearchRunSchema,
} from "./contracts";
import { ResearchSandboxError } from "./errors";
import { digestResearchResult } from "./integrity";

function invalid(message: string): never {
  throw new ResearchSandboxError("INVALID_INPUT", message);
}

export async function listResearchRuns(ctx: WorkspaceContext) {
  await requireWorkspaceAuthorization(ctx, "research.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, (tx) =>
    tx.researchRun.findMany({
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
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 100,
    }),
  );
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
        runId,
        missionId: input.missionId,
        documentId: input.documentId,
        providerName: input.providerName,
        modelName: input.modelName,
      },
    },
    async (tx, command) => {
      const mission = await tx.mission.findFirst({
        where: { id: input.missionId, workspaceId: ctx.workspace.id },
        select: { id: true },
      });
      if (!mission) throw new ResearchSandboxError("NOT_FOUND", "Mission not found");
      if (input.documentId) {
        const document = await tx.authoringDocument.findFirst({
          where: { id: input.documentId, workspaceId: ctx.workspace.id, missionId: mission.id },
          select: { id: true },
        });
        if (!document) throw new ResearchSandboxError("NOT_FOUND", "Authoring document is outside the Mission boundary");
      }
      await tx.researchRun.create({
        data: {
          id: runId,
          organizationId: command.organizationId,
          workspaceId: command.workspaceId,
          missionId: input.missionId,
          documentId: input.documentId,
          question: input.question,
          scope: input.scope,
          sourcePolicy: input.sourcePolicy as Prisma.InputJsonValue,
          queryPlan: input.queryPlan as Prisma.InputJsonValue,
          providerName: input.providerName,
          modelName: input.modelName,
          commandId: command.commandId,
          requestedByMembershipId: ctx.membership.id,
        },
      });
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
          topic: "research.run.execute",
          aggregateType: "ResearchRun",
          aggregateId: runId,
          payload: { runId },
        }],
      };
    },
  );
  return outcome;
}

function reviewedDigest(run: {
  sources: Array<{ canonicalUri: string; contentDigest: string; provenance: string }>;
  findings: Array<{ findingKey: string; kind: string; claim: string; sourceId: string | null; exactExcerpt: string; startOffset: number | null; endOffset: number | null; decision: { decision: string; rationale: string } | null }>;
}) {
  return digestResearchResult({
    sources: run.sources.map((source) => ({ uri: source.canonicalUri, digest: source.contentDigest, provenance: source.provenance })),
    findings: run.findings.map((finding) => ({
      key: finding.findingKey,
      kind: finding.kind,
      claim: finding.claim,
      sourceId: finding.sourceId,
      excerpt: finding.exactExcerpt,
      start: finding.startOffset,
      end: finding.endOffset,
      decision: finding.decision,
    })),
  });
}

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
      where: { id: runId, organizationId, workspaceId: ctx.workspace.id, status: "APPROVED" },
      include: {
        sources: { orderBy: [{ canonicalUri: "asc" }, { id: "asc" }] },
        findings: { include: { decision: true }, orderBy: [{ findingKey: "asc" }, { id: "asc" }] },
      },
    });
    if (!run || !run.approvedDigest) throw new ResearchSandboxError("NOT_FOUND", "Approved research bundle not found");
    if (reviewedDigest(run) !== run.approvedDigest) throw new ResearchSandboxError("INTEGRITY_FAILURE", "Research publish digest is stale or corrupted");
    return {
      runId: run.id,
      digest: run.approvedDigest,
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
