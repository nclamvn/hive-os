import { headers } from "next/headers";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse, jsonDownload } from "@/server/export-response";
import { getPilotMeasurementReport } from "@/server/pilot-measurement";

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
    const report = await getPilotMeasurementReport(ctx, missionId);
    return jsonDownload(
      report,
      `${workspaceSlug}-pilot-measurement-${missionId}.json`,
    );
  } catch (error) {
    return exportErrorResponse(error);
  }
}
