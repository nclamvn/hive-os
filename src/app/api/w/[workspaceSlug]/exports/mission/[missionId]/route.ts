import { headers } from "next/headers";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse, jsonDownload } from "@/server/export-response";
import { exportMissionDossier } from "@/server/governed-exports";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceSlug: string; missionId: string }>;
  },
) {
  const { workspaceSlug, missionId } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const dossier = await exportMissionDossier(ctx, missionId);
    return jsonDownload(
      dossier,
      `${workspaceSlug}-mission-dossier-${missionId}.json`,
    );
  } catch (error) {
    return exportErrorResponse(error);
  }
}
