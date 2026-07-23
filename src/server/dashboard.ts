import type { WorkspaceContext } from "@/modules/identity-workspace";
import {
  computeProgress,
  requireMissionCapability,
} from "@/modules/mission-kernel";
import { getDb } from "@/server/db";

const TERMINAL = ["RELEASED", "PARTIAL", "REFUTED", "CANCELLED", "ARCHIVED"] as const;

export async function getDashboardProjection(ctx: WorkspaceContext) {
  requireMissionCapability(ctx, "missions.read");
  const workspaceId = ctx.workspace.id;
  const [missions, counts, decisions, usage] = await Promise.all([
    getDb().mission.findMany({
      where: { workspaceId, status: { notIn: [...TERMINAL] } },
      orderBy: { updatedAt: "desc" },
      take: 12,
      include: {
        obligations: { include: { contractObligation: true } },
        gates: {
          where: { status: { not: "PASSED" } },
          orderBy: { contractGate: { code: "asc" } },
          include: { contractGate: true },
        },
      },
    }),
    Promise.all([
      getDb().mission.count({ where: { workspaceId } }),
      getDb().evidenceSource.count({ where: { workspaceId } }),
      getDb().claim.count({ where: { workspaceId } }),
      getDb().verificationReport.count({ where: { workspaceId } }),
      getDb().governedRelease.count({ where: { workspaceId } }),
    ]),
    getDb().decision.findMany({
      where: { workspaceId, status: "REQUIRED" },
      orderBy: { createdAt: "asc" },
      take: 8,
      select: {
        id: true,
        decisionType: true,
        question: true,
        mission: {
          select: { id: true, referenceCode: true, title: true },
        },
      },
    }),
    getDb().resourceUsageRecord.groupBy({
      by: ["metric", "unit"],
      where: { workspaceId },
      _sum: { quantity: true },
      orderBy: [{ metric: "asc" }, { unit: "asc" }],
    }),
  ]);

  return {
    missions: missions.map((mission) => {
      const progress = mission.approvedContractId
        ? computeProgress(
            mission.obligations.map((obligation) => ({
              status: obligation.status,
              weight: obligation.contractObligation.weight,
            })),
          )
        : null;
      return {
        id: mission.id,
        referenceCode: mission.referenceCode,
        title: mission.title,
        status: mission.status,
        assuranceProfile: mission.assuranceProfile,
        progressBasisPoints: progress?.basisPoints ?? null,
        nextGate: mission.gates[0]?.contractGate.title ?? null,
        updatedAt: mission.updatedAt.toISOString(),
      };
    }),
    currentMission: missions[0]
      ? {
          id: missions[0].id,
          referenceCode: missions[0].referenceCode,
          title: missions[0].title,
          status: missions[0].status,
          assuranceProfile: missions[0].assuranceProfile,
        }
      : null,
    decisions,
    usage: usage.map((item) => ({
      metric: item.metric,
      unit: item.unit,
      quantity: item._sum.quantity ?? 0,
    })),
    metrics: {
      missions: counts[0],
      evidenceSources: counts[1],
      claims: counts[2],
      verifications: counts[3],
      releases: counts[4],
    },
  };
}
