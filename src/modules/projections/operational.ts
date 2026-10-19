import { Prisma } from "@prisma/client";

import {
  organizationIdForWorkspace,
  requireWorkspaceAuthorization,
} from "@/modules/authorization";
import {
  AuditEventType,
  type WorkspaceContext,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import {
  type TenantTransaction,
  withOrganizationTenant,
} from "@/server/tenant-context";

export const OPERATIONAL_METRICS = [
  "missions",
  "approvedMissions",
  "exploringMissions",
  "obligations",
  "decisionsRequired",
  "evidenceSources",
  "snapshots",
  "evidenceSpans",
  "claims",
  "disputes",
  "honestNulls",
  "provenanceEdges",
  "skills",
  "activeSkills",
  "skillVersions",
  "runtimeGates",
  "passedGates",
  "executionTips",
  "activeExecutionTips",
  "awaitingReports",
  "completionReports",
  "executionArtifacts",
  "openExecutionDeviations",
  "verificationScenarios",
  "activeVerificationRuns",
  "verificationReports",
  "notReadyVerificationReports",
  "governanceSignoffs",
  "evidenceCeilingAssessments",
  "governedReleases",
  "releaseManifests",
  "openEscalations",
] as const;

export type OperationalMetric = (typeof OPERATIONAL_METRICS)[number];
export type OperationalCounts = Record<OperationalMetric, number>;

function normalizedCounts(value: Prisma.JsonValue): OperationalCounts {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Prisma.JsonObject)
      : {};
  return Object.fromEntries(
    OPERATIONAL_METRICS.map((metric) => {
      const candidate = source[metric];
      return [
        metric,
        typeof candidate === "number" &&
        Number.isSafeInteger(candidate) &&
        candidate >= 0
          ? candidate
          : 0,
      ];
    }),
  ) as OperationalCounts;
}

export async function getWorkspaceOperationalProjection(
  ctx: WorkspaceContext,
  now = new Date(),
) {
  await requireWorkspaceAuthorization(ctx, "projections.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const projection = await tx.workspaceOperationalProjection.findUnique({
      where: {
        organizationId_workspaceId: {
          organizationId,
          workspaceId: ctx.workspace.id,
        },
      },
    });
    if (!projection) {
      throw new Error("Workspace operational projection is unavailable");
    }
    return {
      ...projection,
      counts: normalizedCounts(projection.counts),
      freshness: {
        sourceWatermarkAt:
          projection.sourceWatermarkAt?.toISOString() ?? null,
        refreshedAt: projection.refreshedAt?.toISOString() ?? null,
        ageMs: projection.refreshedAt
          ? Math.max(0, now.getTime() - projection.refreshedAt.getTime())
          : null,
        status: projection.status,
      },
    };
  });
}

export async function getPortfolioOperationalProjection(
  ctx: WorkspaceContext,
  portfolioId: string,
  now = new Date(),
) {
  await requireWorkspaceAuthorization(ctx, "projections.read");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const projection = await tx.portfolioOperationalProjection.findUnique({
      where: {
        organizationId_portfolioId: { organizationId, portfolioId },
      },
    });
    if (!projection) {
      throw new Error("Portfolio operational projection is unavailable");
    }
    return {
      ...projection,
      counts: normalizedCounts(projection.counts),
      freshness: {
        sourceWatermarkAt:
          projection.sourceWatermarkAt?.toISOString() ?? null,
        refreshedAt: projection.refreshedAt?.toISOString() ?? null,
        ageMs: projection.refreshedAt
          ? Math.max(0, now.getTime() - projection.refreshedAt.getTime())
          : null,
        status: projection.status,
      },
    };
  });
}

async function authoritativeCounts(
  tx: TenantTransaction,
  workspaceId: string,
): Promise<OperationalCounts> {
  const counts = {} as OperationalCounts;
  counts.missions = await tx.mission.count({ where: { workspaceId } });
  counts.approvedMissions = await tx.mission.count({
    where: { workspaceId, status: "APPROVED" },
  });
  counts.exploringMissions = await tx.mission.count({
    where: { workspaceId, status: "EXPLORING" },
  });
  counts.obligations = await tx.runtimeObligation.count({
    where: { workspaceId },
  });
  counts.decisionsRequired = await tx.decision.count({
    where: { workspaceId, status: "REQUIRED" },
  });
  counts.evidenceSources = await tx.evidenceSource.count({
    where: { workspaceId },
  });
  counts.snapshots = await tx.snapshot.count({ where: { workspaceId } });
  counts.evidenceSpans = await tx.evidenceSpan.count({
    where: { workspaceId },
  });
  counts.claims = await tx.claim.count({ where: { workspaceId } });
  counts.disputes = await tx.dispute.count({ where: { workspaceId } });
  counts.honestNulls = await tx.honestNullRecord.count({
    where: { workspaceId },
  });
  counts.provenanceEdges = await tx.provenanceEdge.count({
    where: { workspaceId },
  });
  counts.skills = await tx.skill.count({ where: { workspaceId } });
  counts.activeSkills = await tx.skill.count({
    where: { workspaceId, status: "ACTIVE" },
  });
  counts.skillVersions = await tx.skillVersion.count({
    where: { workspaceId },
  });
  counts.runtimeGates = await tx.runtimeGate.count({
    where: { workspaceId },
  });
  counts.passedGates = await tx.runtimeGate.count({
    where: { workspaceId, status: "PASSED" },
  });
  counts.executionTips = await tx.executionTip.count({
    where: { workspaceId },
  });
  counts.activeExecutionTips = await tx.executionTip.count({
    where: {
      workspaceId,
      status: {
        in: ["IN_PROGRESS", "BLOCKED", "BLOCKED_DEVIATION", "PARTIAL"],
      },
    },
  });
  counts.awaitingReports = await tx.agentRun.count({
    where: { workspaceId, status: "AWAITING_REPORT" },
  });
  counts.completionReports = await tx.completionReport.count({
    where: { workspaceId },
  });
  counts.executionArtifacts = await tx.executionArtifact.count({
    where: { workspaceId },
  });
  counts.openExecutionDeviations = await tx.executionDeviation.count({
    where: { workspaceId, status: "OPEN" },
  });
  counts.verificationScenarios = await tx.verificationScenario.count({
    where: { workspaceId },
  });
  counts.activeVerificationRuns = await tx.verificationRun.count({
    where: { workspaceId, status: "IN_PROGRESS" },
  });
  counts.verificationReports = await tx.verificationReport.count({
    where: { workspaceId },
  });
  counts.notReadyVerificationReports = await tx.verificationReport.count({
    where: { workspaceId, overallStatus: "NOT_READY" },
  });
  counts.governanceSignoffs = await tx.governanceSignoff.count({
    where: { workspaceId },
  });
  counts.evidenceCeilingAssessments =
    await tx.evidenceCeilingAssessment.count({ where: { workspaceId } });
  counts.governedReleases = await tx.governedRelease.count({
    where: { workspaceId },
  });
  counts.releaseManifests = await tx.releaseManifest.count({
    where: { workspaceId },
  });
  counts.openEscalations = await tx.escalation.count({
    where: { workspaceId, status: { not: "RESOLVED" } },
  });
  return counts;
}

async function rebuildPortfolio(
  tx: TenantTransaction,
  organizationId: string,
  portfolioId: string,
  watermark: Date,
  jobId: string,
) {
  await tx.$queryRaw`
    SELECT portfolio_id FROM portfolio_operational_projection
    WHERE organization_id = ${organizationId}
      AND portfolio_id = ${portfolioId}
    FOR UPDATE
  `;
  const rows = await tx.$queryRaw<Array<{ counts: Prisma.JsonValue }>>`
    SELECT COALESCE(
      jsonb_object_agg(metric, total),
      '{}'::jsonb
    ) AS counts
    FROM (
      SELECT entry.key AS metric, SUM((entry.value #>> '{}')::INTEGER) AS total
      FROM workspace_operational_projection projection,
           LATERAL jsonb_each(projection.counts) entry
      WHERE projection.organization_id = ${organizationId}
        AND projection.portfolio_id = ${portfolioId}
      GROUP BY entry.key
    ) aggregated
  `;
  await tx.portfolioOperationalProjection.upsert({
    where: {
      organizationId_portfolioId: { organizationId, portfolioId },
    },
    create: {
      organizationId,
      portfolioId,
      counts: (rows[0]?.counts ?? {}) as Prisma.InputJsonObject,
      sourceWatermarkAt: watermark,
      refreshedAt: new Date(),
      lastJobId: jobId,
    },
    update: {
      counts: (rows[0]?.counts ?? {}) as Prisma.InputJsonObject,
      status: "READY",
      sourceWatermarkAt: watermark,
      refreshedAt: new Date(),
      lastJobId: jobId,
      version: { increment: 1 },
    },
  });
}

export async function rebuildWorkspaceProjectionInTransaction(
  tx: TenantTransaction,
  input: {
    organizationId: string;
    workspaceId: string;
    jobId: string;
    watermark?: Date;
  },
) {
  await tx.$queryRaw`
    SELECT workspace_id FROM workspace_operational_projection
    WHERE organization_id = ${input.organizationId}
      AND workspace_id = ${input.workspaceId}
    FOR UPDATE
  `;
  const workspace = await tx.workspace.findFirst({
    where: {
      id: input.workspaceId,
      organizationId: input.organizationId,
    },
    select: { portfolioId: true },
  });
  if (!workspace) throw new Error("Workspace not found");
  await tx.workspaceOperationalProjection.update({
    where: {
      organizationId_workspaceId: {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
    },
    data: { status: "REBUILDING", version: { increment: 1 } },
  });
  const counts = await authoritativeCounts(tx, input.workspaceId);
  const watermark = input.watermark ?? new Date();
  const projection = await tx.workspaceOperationalProjection.update({
    where: {
      organizationId_workspaceId: {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
    },
    data: {
      counts,
      status: "READY",
      sourceWatermarkAt: watermark,
      refreshedAt: new Date(),
      lastJobId: input.jobId,
      version: { increment: 1 },
    },
  });
  if (workspace.portfolioId) {
    await rebuildPortfolio(
      tx,
      input.organizationId,
      workspace.portfolioId,
      watermark,
      input.jobId,
    );
  }
  return { ...projection, counts };
}

export async function rebuildWorkspaceOperationalProjection(
  ctx: WorkspaceContext,
  input: { jobId: string },
) {
  await requireWorkspaceAuthorization(ctx, "projections.manage");
  const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId, ctx.user.id, async (tx) => {
    const result = await rebuildWorkspaceProjectionInTransaction(tx, {
      organizationId,
      workspaceId: ctx.workspace.id,
      jobId: input.jobId,
    });
    await writeAuditEvent(tx, {
      workspaceId: ctx.workspace.id,
      actorUserId: ctx.user.id,
      actorMembershipId: ctx.membership.id,
      eventType: AuditEventType.ProjectionRebuilt,
      entityType: "WorkspaceOperationalProjection",
      entityId: ctx.workspace.id,
      correlationId: ctx.correlationId,
      payload: {
        projectionKey: "workspace-operational",
        jobId: input.jobId,
        sourceWatermarkAt: result.sourceWatermarkAt!.toISOString(),
      },
    });
    return result;
  });
}
