import {
  listAuditEvents,
  NotFoundError,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

function envelope(ctx: WorkspaceContext, exportType: string) {
  return {
    schema: "hive-os.governed-export.v1",
    exportType,
    workspace: {
      id: ctx.workspace.id,
      slug: ctx.workspace.slug,
      name: ctx.workspace.name,
    },
  };
}

export async function exportAuditLedger(ctx: WorkspaceContext) {
  const events = await listAuditEvents(ctx, 200);
  return {
    ...envelope(ctx, "audit-ledger"),
    exportedAt: new Date().toISOString(),
    events: events.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
    })),
  };
}

export async function exportVerificationReport(
  ctx: WorkspaceContext,
  reportId: string,
) {
  requireVerificationCapability(ctx, "verification.read");
  const report = await getDb().verificationReport.findFirst({
    where: { id: reportId, workspaceId: ctx.workspace.id },
    select: {
      id: true,
      requirementCoverage: true,
      scenarioResults: true,
      technicalHealth: true,
      overallStatus: true,
      deferredItems: true,
      contentHash: true,
      createdAt: true,
      mission: {
        select: {
          id: true,
          referenceCode: true,
          title: true,
          status: true,
          assuranceProfile: true,
        },
      },
      verificationRun: {
        select: {
          id: true,
          status: true,
          independenceStatus: true,
          corruptionRuns: {
            select: {
              id: true,
              code: true,
              title: true,
              method: true,
              result: true,
              severity: true,
              detail: true,
              evidenceArtifactIds: true,
              createdAt: true,
            },
          },
        },
      },
      artifact: {
        select: {
          id: true,
          kind: true,
          mediaType: true,
          contentHash: true,
          sizeBytes: true,
        },
      },
      signoffs: {
        select: {
          id: true,
          signoffType: true,
          decision: true,
          rationale: true,
          signedByMembershipId: true,
          createdAt: true,
        },
      },
      evidenceCeilingAssessments: {
        select: {
          id: true,
          claimVersionId: true,
          ceiling: true,
          eligiblePublic: true,
          reasons: true,
          createdAt: true,
        },
      },
    },
  });
  if (!report) throw new NotFoundError();

  return {
    ...envelope(ctx, "verification-report"),
    report: {
      ...report,
      createdAt: report.createdAt.toISOString(),
      verificationRun: {
        ...report.verificationRun,
        corruptionRuns: report.verificationRun.corruptionRuns.map((run) => ({
          ...run,
          createdAt: run.createdAt.toISOString(),
        })),
      },
      signoffs: report.signoffs.map((signoff) => ({
        ...signoff,
        createdAt: signoff.createdAt.toISOString(),
      })),
      evidenceCeilingAssessments: report.evidenceCeilingAssessments.map(
        (assessment) => ({
          ...assessment,
          createdAt: assessment.createdAt.toISOString(),
        }),
      ),
    },
  };
}

export async function exportReleaseManifest(
  ctx: WorkspaceContext,
  releaseId: string,
) {
  requireVerificationCapability(ctx, "verification.read");
  const release = await getDb().governedRelease.findFirst({
    where: { id: releaseId, workspaceId: ctx.workspace.id },
    select: {
      id: true,
      status: true,
      visibility: true,
      approvedByMembershipId: true,
      approvedAt: true,
      mission: {
        select: {
          id: true,
          referenceCode: true,
          title: true,
          status: true,
          assuranceProfile: true,
        },
      },
      verificationReport: {
        select: {
          id: true,
          overallStatus: true,
          contentHash: true,
        },
      },
      manifest: {
        select: {
          id: true,
          claimVersions: true,
          artifacts: true,
          methods: true,
          limitations: true,
          approverMembershipIds: true,
          contentHash: true,
          createdAt: true,
        },
      },
    },
  });
  if (!release?.manifest) throw new NotFoundError();

  return {
    ...envelope(ctx, "release-manifest"),
    release: {
      ...release,
      approvedAt: release.approvedAt.toISOString(),
      manifest: {
        ...release.manifest,
        createdAt: release.manifest.createdAt.toISOString(),
      },
    },
  };
}
