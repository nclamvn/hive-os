import type { Capability, WorkspaceContext } from "@/modules/identity-workspace";
import { hasCapability } from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { TruthError, TruthErrorCode } from "./errors";

export function requireTruthCapability(
  ctx: WorkspaceContext,
  capability: Capability,
): void {
  if (!hasCapability(ctx.membership.role, capability)) {
    throw new TruthError(
      TruthErrorCode.Forbidden,
      `Missing capability: ${capability}`,
    );
  }
}

export async function loadTruthMission(
  ctx: WorkspaceContext,
  missionId: string,
) {
  const mission = await getDb().mission.findFirst({
    where: { id: missionId, workspaceId: ctx.workspace.id },
  });
  if (!mission) throw new TruthError(TruthErrorCode.NotFound, "Mission not found");
  if (!["APPROVED", "EXPLORING"].includes(mission.status)) {
    throw new TruthError(
      TruthErrorCode.Invariant,
      "Truth records require an approved or exploring mission",
    );
  }
  return mission;
}
