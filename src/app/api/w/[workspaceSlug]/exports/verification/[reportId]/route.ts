import { headers } from "next/headers";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse, jsonDownload } from "@/server/export-response";
import { exportVerificationReport } from "@/server/governed-exports";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceSlug: string; reportId: string }>;
  },
) {
  const { workspaceSlug, reportId } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const report = await exportVerificationReport(ctx, reportId);
    return jsonDownload(
      report,
      `${workspaceSlug}-verify-report-${reportId}.json`,
    );
  } catch (error) {
    return exportErrorResponse(error);
  }
}
