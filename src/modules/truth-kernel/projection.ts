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
    where: { workspaceId: ctx.workspace.id, missionId },
    include: { versions: { orderBy: { versionNumber: "asc" } } },
    orderBy: { createdAt: "asc" },
  });

  return claims
    .filter((claim) => accessVisible(claim.accessLevel, target))
    .map((claim) => ({
      id: claim.id,
      claimKey: claim.claimKey,
      state: claim.state,
      accessLevel: claim.accessLevel,
      reviewCadenceDays: target === "INTERNAL" ? claim.reviewCadenceDays : undefined,
      nextReviewAt: target === "INTERNAL" ? claim.nextReviewAt : undefined,
      versions: claim.versions
        .filter((version) => accessVisible(version.accessLevel, target))
        .map((version) => ({
          versionNumber: version.versionNumber,
          statement: version.statement,
          normalizedValue: version.normalizedValue,
          falsificationCriterion:
            target === "INTERNAL" ? version.falsificationCriterion : undefined,
        })),
    }));
}
