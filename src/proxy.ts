import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { resolveCorrelationId } from "@/server/observability/correlation";

const HEALTH_PREFIX = "/api/health";

export function proxy(request: NextRequest) {
  const correlationId = resolveCorrelationId(
    request.headers.get("x-correlation-id"),
  );

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !request.nextUrl.pathname.startsWith(HEALTH_PREFIX)
  ) {
    const response = NextResponse.json(
      {
        status: "maintenance",
        message: "HIVE OS is temporarily unavailable for maintenance.",
      },
      { status: 503 },
    );
    response.headers.set("retry-after", "300");
    response.headers.set("x-correlation-id", correlationId);
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-correlation-id", correlationId);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("x-correlation-id", correlationId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)"],
};
