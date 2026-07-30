import type { AccessLevel } from "@prisma/client";

import type { WorkspaceContext } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { requireTruthCapability } from "./context";

export type ProjectionTarget = "INTERNAL" | "EXPORT" | "PUBLIC";

export function accessVisible(
  accessLevel: AccessLevel,
  target: ProjectionTarget,
): boolean {
  if (target === "INTERNAL") return true;
  if (target === "EXPORT") return accessLevel !== "RESTRICTED";
  return accessLevel === "PUBLIC";
}

/** Server-side safe projection; forbidden versions are omitted, not redacted late. */
export async function listClaimProjection(
  ctx: WorkspaceContext,
  missionId: string,
  target: ProjectionTarget,
) {
  requireTruthCapability(
    ctx,
    target === "INTERNAL" ? "truth.read" : "truth.export",
  );
  const claims = await getDb().claim.findMany({
    where: {
      workspaceId: ctx.workspace.id,
      missionId,
      ...(target === "EXPORT"
        ? { accessLevel: { not: "RESTRICTED" as const } }
        : target === "PUBLIC"
          ? { accessLevel: "PUBLIC" as const }
          : {}),
    },
    include: {
      versions: {
        where:
          target === "EXPORT"
            ? { accessLevel: { not: "RESTRICTED" as const } }
            : target === "PUBLIC"
              ? { accessLevel: "PUBLIC" as const }
              : {},
        orderBy: { versionNumber: "asc" },
        take: 100,
      },
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    take: 100,
  });

  return claims.map((claim) => ({
    id: claim.id,
    claimKey: claim.claimKey,
    state: claim.state,
    accessLevel: claim.accessLevel,
    reviewCadenceDays:
      target === "INTERNAL" ? claim.reviewCadenceDays : undefined,
    nextReviewAt: target === "INTERNAL" ? claim.nextReviewAt : undefined,
    versions: claim.versions.map((version) => ({
      versionNumber: version.versionNumber,
      statement: version.statement,
      normalizedValue: version.normalizedValue,
      falsificationCriterion:
        target === "INTERNAL" ? version.falsificationCriterion : undefined,
    })),
  }));
}
