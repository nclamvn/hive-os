import { headers } from "next/headers";

import { DossierExportError, readMissionDossierPart } from "@/modules/dossier-export";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse } from "@/server/export-response";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceSlug: string; exportId: string; sequence: string }>;
  },
) {
  const { workspaceSlug, exportId, sequence } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const result = await readMissionDossierPart(ctx, exportId, Number(sequence));
    return new Response(Buffer.from(result.body).toString("utf8"), {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Content-Disposition": `attachment; filename="dossier-${exportId}-part-${sequence}.jsonl.part"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Content-SHA256": result.part.contentHash,
      },
    });
  } catch (error) {
    if (error instanceof DossierExportError) {
      return Response.json(
        { error: error.code },
        { status: error.code === "NOT_FOUND" ? 404 : error.code === "INVALID_INPUT" ? 400 : 409 },
      );
    }
    return exportErrorResponse(error);
  }
}
