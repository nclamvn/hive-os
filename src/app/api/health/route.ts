import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getHealthReport } from "@/server/health";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const report = await getHealthReport(
    request.headers.get("x-correlation-id") ?? undefined,
  );
  return NextResponse.json(report, {
    status: report.status === "ok" ? 200 : 503,
  });
}
