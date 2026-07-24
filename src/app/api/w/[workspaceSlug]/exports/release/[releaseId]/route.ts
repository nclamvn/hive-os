import { headers } from "next/headers";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse, jsonDownload } from "@/server/export-response";
import { exportReleaseManifest } from "@/server/governed-exports";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceSlug: string; releaseId: string }>;
  },
) {
  const { workspaceSlug, releaseId } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const manifest = await exportReleaseManifest(ctx, releaseId);
    return jsonDownload(
      manifest,
      `${workspaceSlug}-release-manifest-${releaseId}.json`,
    );
  } catch (error) {
    return exportErrorResponse(error);
  }
}
