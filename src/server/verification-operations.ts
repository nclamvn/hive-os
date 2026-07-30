import {
  hasCapability,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { requireVerificationCapability } from "@/modules/verification-governance";
import { getDb } from "@/server/db";

export async function getVerificationOperationsProjection(
  ctx: WorkspaceContext,
) {
  requireVerificationCapability(ctx, "verification.read");
  const workspaceId = ctx.workspace.id;

  const [
    missions,
    scenarios,
    runs,
    reports,
    verifierAttempts,
    artifacts,
    claims,
  ] = await Promise.all([
    getDb().mission.findMany({
      where: {
        workspaceId,
        status: { in: ["BUILDING", "VERIFYING", "REVIEW", "RELEASED"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
      select: {
        id: true,
        referenceCode: true,
        title: true,
        status: true,
        assuranceProfile: true,
        approvedContractId: true,
        governedReleases: {
          orderBy: { approvedAt: "desc" },
          take: 1,
          select: {
            id: true,
            visibility: true,
            approvedAt: true,
            manifest: {
              select: { id: true, contentHash: true, limitations: true },
            },
          },
        },
      },
    }),
    getDb().verificationScenario.findMany({
      where: { workspaceId },
      orderBy: [{ missionId: "asc" }, { code: "asc" }],
      take: 100,
      include: {
        mission: { select: { referenceCode: true, title: true, status: true } },
        requirement: { select: { id: true, code: true, title: true } },
      },
    }),
    getDb().verificationRun.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        mission: {
          select: {
            referenceCode: true,
            title: true,
            status: true,
            approvedContractId: true,
          },
        },
        verifierAgentRun: {
          select: {
            providerName: true,
            modelName: true,
            outputArtifactId: true,
          },
        },
        report: { select: { id: true, overallStatus: true } },
      },
    }),
    getDb().verificationReport.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
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
            independenceStatus: true,
            requirementCoverage: { select: { result: true }, take: 100 },
            scenarioResults: { select: { result: true }, take: 100 },
            corruptionRuns: { select: { result: true }, take: 100 },
          },
        },
        signoffs: { orderBy: { createdAt: "asc" }, take: 100 },
        evidenceCeilingAssessments: {
          select: { eligiblePublic: true, ceiling: true, reasons: true },
          take: 100,
        },
        release: {
          select: {
            id: true,
            visibility: true,
            approvedAt: true,
            manifest: { select: { id: true, contentHash: true } },
          },
        },
      },
    }),
    getDb().agentRun.findMany({
      where: {
        workspaceId,
        executionRole: "VERIFIER",
        status: "DONE",
        verifierFor: null,
        mission: { status: "BUILDING" },
      },
      orderBy: { completedAt: "desc" },
      take: 100,
      select: {
        id: true,
        providerName: true,
        modelName: true,
        attemptNumber: true,
        outputArtifactId: true,
        mission: {
          select: { id: true, referenceCode: true, title: true },
        },
      },
    }),
    getDb().executionArtifact.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        missionId: true,
        kind: true,
        contentHash: true,
        createdAt: true,
      },
    }),
    getDb().claim.findMany({
      where: { workspaceId },
      orderBy: [{ missionId: "asc" }, { claimKey: "asc" }],
      take: 100,
      select: {
        id: true,
        missionId: true,
        claimKey: true,
        state: true,
        accessLevel: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          select: {
            id: true,
            versionNumber: true,
            statement: true,
            accessLevel: true,
          },
        },
      },
    }),
  ]);

  const contractIds = missions
    .map((mission) => mission.approvedContractId)
    .filter((id): id is string => Boolean(id));
  const requirements = contractIds.length
    ? await getDb().requirement.findMany({
        where: { workspaceId, contractId: { in: contractIds } },
        orderBy: [{ contractId: "asc" }, { code: "asc" }],
        take: 100,
        select: {
          id: true,
          contractId: true,
          code: true,
          title: true,
          required: true,
        },
      })
    : [];

  return {
    missions,
    requirements,
    scenarios,
    runs,
    reports,
    verifierAttempts,
    artifacts,
    claims,
    counts: {
      scenarios: scenarios.length,
      activeRuns: runs.filter((run) => run.status === "IN_PROGRESS").length,
      reports: reports.length,
      notReady: reports.filter((report) => report.overallStatus === "NOT_READY")
        .length,
      signoffs: reports.reduce(
        (sum, report) => sum + report.signoffs.length,
        0,
      ),
      releases: reports.filter((report) => report.release).length,
    },
    permissions: {
      canOperate: hasCapability(ctx.membership.role, "verification.operate"),
      canReview: hasCapability(ctx.membership.role, "verification.review"),
      canRelease: hasCapability(ctx.membership.role, "release.approve"),
    },
  };
}
