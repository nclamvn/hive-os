import { notFound } from "next/navigation";

import {
  MissionWorkspace,
} from "@/components/mission/mission-workspace";
import { normalizeMissionView } from "@/components/mission/workspace-views";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { hasCapability } from "@/modules/identity-workspace";
import {
  getMissionDetail,
  getMissionProgress,
  MissionError,
} from "@/modules/mission-kernel";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getMissionWorkspaceProjection } from "@/server/mission-workspace";

export const dynamic = "force-dynamic";

export default async function MissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string; missionId: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const [{ workspaceSlug, missionId }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  const data = await loadWorkspacePage(workspaceSlug);
  const view = normalizeMissionView(query.view);

  let detail: Awaited<ReturnType<typeof getMissionDetail>>;
  try {
    detail = await getMissionDetail(data.ctx, missionId);
  } catch (error) {
    if (error instanceof MissionError && error.code === "MISSION_NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  const [progress, projection] = await Promise.all([
    getMissionProgress(data.ctx, missionId),
    getMissionWorkspaceProjection(data.ctx, missionId),
  ]);
  if (!projection) notFound();

  return (
    <WorkspaceShell
      data={data}
      title={detail.mission.title}
      subtitle={`${detail.mission.referenceCode} · ${data.ctx.workspace.name}`}
    >
      <MissionWorkspace
        detail={detail}
        progress={progress}
        projection={projection}
        view={view}
        basePath={`/w/${workspaceSlug}/missions/${missionId}`}
        canApprove={hasCapability(
          data.ctx.membership.role,
          "missions.approve_contract",
        )}
        canResolve={hasCapability(
          data.ctx.membership.role,
          "decisions.resolve",
        )}
        canUpdateObligations={hasCapability(
          data.ctx.membership.role,
          "obligations.update",
        )}
      />
    </WorkspaceShell>
  );
}
