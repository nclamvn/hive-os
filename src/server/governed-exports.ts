import {
  listAuditEvents,
  NotFoundError,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { canonicalJson, sha256 } from "@/modules/execution-fabric";
import { requireExecutionCapability } from "@/modules/execution-fabric";
import { requireMissionCapability } from "@/modules/mission-kernel";
import { requireTruthCapability } from "@/modules/truth-kernel";
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

function jsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function exportMissionDossier(
  ctx: WorkspaceContext,
  missionId: string,
) {
  requireMissionCapability(ctx, "missions.read");
  requireTruthCapability(ctx, "truth.read");
  requireExecutionCapability(ctx, "execution.read");
  requireVerificationCapability(ctx, "verification.read");

  const workspaceId = ctx.workspace.id;
  const mission = await getDb().mission.findFirst({
    where: { id: missionId, workspaceId },
    select: {
      id: true,
      referenceCode: true,
      title: true,
      status: true,
      assuranceProfile: true,
      currentContractId: true,
      approvedContractId: true,
      blockedFromStatus: true,
      createdByMembershipId: true,
      createdAt: true,
      updatedAt: true,
      version: true,
      contracts: {
        orderBy: { versionNumber: "asc" },
        include: {
          requirements: { orderBy: { code: "asc" } },
          assumptions: { orderBy: { id: "asc" } },
          constraints: { orderBy: { id: "asc" } },
          inputs: { orderBy: { id: "asc" } },
          obligationDefs: { orderBy: { code: "asc" } },
          gateDefs: { orderBy: { code: "asc" } },
        },
      },
      obligations: {
        orderBy: { id: "asc" },
        include: {
          contractObligation: {
            select: { code: true, title: true, closureRule: true },
          },
        },
      },
      gates: {
        orderBy: { id: "asc" },
        include: {
          contractGate: {
            select: {
              code: true,
              title: true,
              requiredBeforeStatus: true,
              evaluationMode: true,
            },
          },
          runs: { orderBy: { createdAt: "asc" } },
        },
      },
      decisions: { orderBy: { createdAt: "asc" } },
      escalations: { orderBy: { createdAt: "asc" } },
      evidenceSources: {
        orderBy: { createdAt: "asc" },
        include: {
          snapshots: {
            orderBy: { createdAt: "asc" },
            include: {
              spans: { orderBy: [{ startOffset: "asc" }, { id: "asc" }] },
            },
          },
        },
      },
      claims: {
        orderBy: { createdAt: "asc" },
        include: {
          versions: {
            orderBy: { versionNumber: "asc" },
            include: {
              evidence: {
                orderBy: { createdAt: "asc" },
                include: {
                  evidenceSpan: {
                    select: {
                      id: true,
                      snapshotId: true,
                      startOffset: true,
                      endOffset: true,
                      exactText: true,
                    },
                  },
                },
              },
            },
          },
          disputes: { orderBy: { createdAt: "asc" } },
          honestNulls: { orderBy: { createdAt: "asc" } },
        },
      },
      executionTips: {
        orderBy: [{ createdAt: "asc" }, { code: "asc" }],
        include: {
          skillVersion: {
            select: {
              id: true,
              semanticVersion: true,
              contentHash: true,
              skill: { select: { skillKey: true, displayName: true } },
            },
          },
          predecessorEdges: {
            orderBy: { createdAt: "asc" },
            select: {
              predecessorTipId: true,
              dependentTipId: true,
              createdAt: true,
            },
          },
        },
      },
      executionArtifacts: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          tipId: true,
          kind: true,
          mediaType: true,
          contentHash: true,
          sizeBytes: true,
          createdByMembershipId: true,
          createdAt: true,
        },
      },
      skillRuns: {
        orderBy: { createdAt: "asc" },
        include: {
          agentRuns: {
            orderBy: { attemptNumber: "asc" },
            select: {
              id: true,
              attemptNumber: true,
              executionRole: true,
              providerName: true,
              modelName: true,
              providerMode: true,
              status: true,
              inputArtifactId: true,
              outputArtifactId: true,
              previousRunId: true,
              createdByMembershipId: true,
              startedAt: true,
              completedAt: true,
              version: true,
            },
          },
        },
      },
      completionReports: {
        orderBy: { createdAt: "asc" },
        include: {
          deviations: { orderBy: { createdAt: "asc" } },
          resourceUsageRecords: {
            orderBy: [{ metric: "asc" }, { unit: "asc" }],
          },
        },
      },
      executionDeviations: { orderBy: { createdAt: "asc" } },
      resourceUsageRecords: {
        orderBy: [{ createdAt: "asc" }, { metric: "asc" }],
      },
      verificationScenarios: {
        orderBy: [{ createdAt: "asc" }, { code: "asc" }],
      },
      verificationRuns: {
        orderBy: { createdAt: "asc" },
        include: {
          requirementCoverage: { orderBy: { requirementId: "asc" } },
          scenarioResults: { orderBy: { scenarioId: "asc" } },
          technicalHealth: true,
          corruptionRuns: {
            orderBy: [{ createdAt: "asc" }, { code: "asc" }],
          },
        },
      },
      verificationReports: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          verificationRunId: true,
          artifactId: true,
          requirementCoverage: true,
          scenarioResults: true,
          technicalHealth: true,
          overallStatus: true,
          deferredItems: true,
          contentHash: true,
          createdByMembershipId: true,
          createdAt: true,
        },
      },
      governanceSignoffs: { orderBy: { createdAt: "asc" } },
      evidenceCeilingAssessments: {
        orderBy: [{ createdAt: "asc" }, { claimVersionId: "asc" }],
      },
      governedReleases: {
        orderBy: { approvedAt: "asc" },
        include: { manifest: true },
      },
    },
  });
  if (!mission) throw new NotFoundError();

  const provenance = await getDb().provenanceEdge.findMany({
    where: { workspaceId, missionId },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  const entityIds = new Set<string>([mission.id]);
  const collectIds = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(collectIds);
      return;
    }
    const record = value as Record<string, unknown>;
    if (typeof record.id === "string") entityIds.add(record.id);
    Object.values(record).forEach(collectIds);
  };
  collectIds(mission);
  collectIds(provenance);

  const auditEvents = await getDb().auditEvent.findMany({
    where: { workspaceId, entityId: { in: [...entityIds] } },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      actorUserId: true,
      actorMembershipId: true,
      eventType: true,
      entityType: true,
      entityId: true,
      correlationId: true,
      payload: true,
      createdAt: true,
    },
  });

  const dossier = jsonSafe({
    mission,
    provenance,
    auditEvents,
  });
  const canonical = canonicalJson(dossier);
  return {
    schema: "hive-os.mission-dossier.v1",
    exportedAt: new Date().toISOString(),
    workspace: {
      id: ctx.workspace.id,
      slug: ctx.workspace.slug,
      name: ctx.workspace.name,
    },
    dossier,
    integrity: {
      algorithm: "sha256",
      canonicalization: "recursive-key-sort.v1",
      contentHash: sha256(canonical),
      contentBytes: Buffer.byteLength(canonical, "utf8"),
    },
  };
}
