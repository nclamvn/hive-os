import {
  AuditEventType,
  writeAuditEvent,
} from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";

import { rebuildWorkspaceProjectionInTransaction } from "./operational";

function workerId(value: string) {
  const normalized = value.trim();
  if (!normalized || normalized.length > 120) {
    throw new Error("Worker id must contain 1–120 characters");
  }
  return normalized;
}

export async function executeProjectionRebuildJob(input: {
  organizationId: string;
  actorUserId: string;
  workerId: string;
  jobId: string;
  expectedVersion: number;
  now?: Date;
}) {
  const lockedBy = workerId(input.workerId);
  const now = input.now ?? new Date();
  return withOrganizationTenant(
    input.organizationId,
    input.actorUserId,
    async (tx) => {
      await tx.$queryRaw`
        SELECT id FROM durable_job
        WHERE organization_id = ${input.organizationId}
          AND id = ${input.jobId}
        FOR UPDATE
      `;
      const job = await tx.durableJob.findFirst({
        where: {
          id: input.jobId,
          organizationId: input.organizationId,
          jobType: "projection.workspace.rebuild",
          status: "RUNNING",
          lockedBy,
          version: input.expectedVersion,
          leaseExpiresAt: { gt: now },
        },
      });
      if (!job) {
        throw new Error("Projection job lease or version is no longer valid");
      }
      const payload =
        job.payload &&
        typeof job.payload === "object" &&
        !Array.isArray(job.payload)
          ? job.payload
          : {};
      const workspaceId = payload.workspaceId;
      if (typeof workspaceId !== "string" || workspaceId !== job.workspaceId) {
        throw new Error("Projection job payload has an invalid Workspace");
      }
      const projection = await rebuildWorkspaceProjectionInTransaction(tx, {
        organizationId: input.organizationId,
        workspaceId,
        jobId: job.id,
        watermark: now,
      });
      const updated = await tx.durableJob.update({
        where: { id: job.id },
        data: {
          status: "SUCCEEDED",
          result: {
            workspaceId,
            sourceWatermarkAt: projection.sourceWatermarkAt!.toISOString(),
            projectionVersion: projection.version,
          },
          lockedBy: null,
          leaseExpiresAt: null,
          completedAt: now,
          version: { increment: 1 },
        },
      });
      await tx.durableJobEvent.create({
        data: {
          organizationId: input.organizationId,
          workspaceId,
          jobId: job.id,
          eventType: "SUCCEEDED",
          attemptNumber: job.attempts,
          workerId: lockedBy,
          detail: { projectionVersion: projection.version },
        },
      });
      const membership = await tx.membership.findFirst({
        where: { workspaceId, userId: input.actorUserId, status: "ACTIVE" },
        select: { id: true },
      });
      await writeAuditEvent(tx, {
        workspaceId,
        actorUserId: input.actorUserId,
        actorMembershipId: membership?.id ?? null,
        eventType: AuditEventType.ProjectionRebuilt,
        entityType: "WorkspaceOperationalProjection",
        entityId: workspaceId,
        correlationId: `projection-job:${job.id}`,
        payload: {
          projectionKey: "workspace-operational",
          jobId: job.id,
          sourceWatermarkAt: projection.sourceWatermarkAt!.toISOString(),
        },
      });
      return updated;
    },
  );
}
