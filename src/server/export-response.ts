import {
  ForbiddenError,
  NotFoundError,
  UnauthenticatedError,
} from "@/modules/identity-workspace";

export function jsonDownload(value: unknown, filename: string) {
  return new Response(`${JSON.stringify(value, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function exportErrorResponse(error: unknown) {
  if (error instanceof UnauthenticatedError) {
    return Response.json({ error: error.code }, { status: 401 });
  }
  if (error instanceof ForbiddenError) {
    return Response.json({ error: error.code }, { status: 403 });
  }
  if (error instanceof NotFoundError) {
    return Response.json({ error: error.code }, { status: 404 });
  }
  throw error;
}
