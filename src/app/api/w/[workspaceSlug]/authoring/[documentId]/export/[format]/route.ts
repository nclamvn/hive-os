import { headers } from "next/headers";

import {
  AuthoringError,
  getAuthoringDocument,
  recordAuthoringExport,
  renderAuthoringDocx,
  renderAuthoringPdf,
} from "@/modules/authoring";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { exportErrorResponse } from "@/server/export-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function safeFilename(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return normalized || "hiveos-document";
}

function authoringErrorResponse(error: unknown) {
  if (error instanceof AuthoringError) {
    const status =
      error.code === "AUTHORING_NOT_FOUND"
        ? 404
        : error.code === "INVALID_AUTHORING_INPUT"
          ? 400
          : 409;
    return Response.json(
      { error: error.code },
      { status, headers: { "Cache-Control": "private, no-store" } },
    );
  }
  return exportErrorResponse(error);
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      workspaceSlug: string;
      documentId: string;
      format: string;
    }>;
  },
) {
  const { workspaceSlug, documentId, format } = await params;
  try {
    if (format !== "docx" && format !== "pdf") {
      return Response.json({ error: "NOT_FOUND" }, { status: 404 });
    }
    const ctx = await resolveWorkspaceContext(await headers(), workspaceSlug);
    const document = await getAuthoringDocument(ctx, documentId);
    if (!document.current) {
      throw new AuthoringError("AUTHORING_NOT_FOUND", "Document has no revision");
    }
    const revision = document.current;
    const body =
      format === "docx"
        ? await renderAuthoringDocx(revision.content, revision.quality)
        : await renderAuthoringPdf(revision.content, revision.quality);

    await recordAuthoringExport(
      ctx,
      document.id,
      revision.revisionNumber,
      format === "docx" ? "DOCX" : "PDF",
      revision.contentHash,
    );

    const filename = `${safeFilename(revision.content.title)}-v${revision.revisionNumber}.${format}`;
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type":
          format === "docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return authoringErrorResponse(error);
  }
}
