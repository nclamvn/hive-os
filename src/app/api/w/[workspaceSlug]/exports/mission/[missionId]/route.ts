import { headers } from "next/headers";

import {
  DossierExportError,
  getLatestMissionDossierExport,
  getMissionDossierExport,
  readMissionDossierManifest,
  requestMissionDossierExport,
} from "@/modules/dossier-export";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse } from "@/server/export-response";

function dossierError(error: unknown) {
  if (error instanceof DossierExportError) {
    const status = error.code === "NOT_FOUND" ? 404 : error.code === "INVALID_INPUT" ? 400 : 409;
    return Response.json({ error: error.code }, { status });
  }
  return exportErrorResponse(error);
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ workspaceSlug: string; missionId: string }>;
  },
) {
  const { workspaceSlug, missionId } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const exportId = new URL(request.url).searchParams.get("exportId");
    const record = exportId
      ? await getMissionDossierExport(ctx, exportId)
      : await getLatestMissionDossierExport(ctx, missionId);
    if (record.missionId !== missionId) {
      throw new DossierExportError("NOT_FOUND", "Export not found");
    }
    if (record.status !== "SUCCEEDED") {
      return Response.json(
        { exportId: record.id, status: record.status, manifestAvailable: false },
        { status: 202, headers: { "Cache-Control": "private, no-store" } },
      );
    }
    const body = await readMissionDossierManifest(ctx, record.id);
    return new Response(Buffer.from(body).toString("utf8"), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${workspaceSlug}-mission-dossier-${missionId}-manifest.json"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return dossierError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceSlug: string; missionId: string }> },
) {
  const { workspaceSlug, missionId } = await params;
  try {
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const idempotencyKey = request.headers.get("idempotency-key");
    if (!idempotencyKey) {
      throw new DossierExportError("INVALID_INPUT", "Idempotency-Key is required");
    }
    const outcome = await requestMissionDossierExport(ctx, { missionId, idempotencyKey });
    return Response.json(outcome, {
      status: 202,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return dossierError(error);
  }
}
