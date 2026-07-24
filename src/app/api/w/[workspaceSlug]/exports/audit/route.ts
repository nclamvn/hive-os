import { headers } from "next/headers";

import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse, jsonDownload } from "@/server/export-response";
import { exportAuditLedger } from "@/server/governed-exports";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceSlug: string }> },
) {
  const { workspaceSlug } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const ledger = await exportAuditLedger(ctx);
    return jsonDownload(ledger, `${workspaceSlug}-audit-ledger.json`);
  } catch (error) {
    return exportErrorResponse(error);
  }
}
