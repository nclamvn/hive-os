import type { Mission } from "@prisma/client";

import {
  type Capability,
  hasCapability,
  type WorkspaceContext,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import { MissionError, MissionErrorCode } from "./errors";

export function requireMissionCapability(
  ctx: WorkspaceContext,
  capability: Capability,
): void {
  if (!hasCapability(ctx.membership.role, capability)) {
    throw new MissionError(
      MissionErrorCode.Forbidden,
      `Missing capability: ${capability}`,
    );
  }
}

/**
 * Load a mission scoped to the authorized workspace. A mission in another
 * workspace (or a non-existent one) surfaces as NotFound — no existence leak.
 */
export async function loadMission(
  ctx: WorkspaceContext,
  missionId: string,
): Promise<Mission> {
  const mission = await getDb().mission.findFirst({
    where: { id: missionId, workspaceId: ctx.workspace.id },
  });
  if (!mission) throw new MissionError(MissionErrorCode.NotFound, "Mission not found");
  return mission;
}
