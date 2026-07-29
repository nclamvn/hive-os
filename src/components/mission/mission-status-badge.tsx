"use client";

import { usePreferences } from "@/components/preferences/preferences-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { enumLabel } from "@/i18n/format";

// Map mission status to a semantic tone. Text label always present so state is
// never communicated by color alone.
const TONE: Record<
  string,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  DRAFT: "neutral",
  INTAKE: "neutral",
  SCOPED: "neutral",
  CONTRACT_REVIEW: "info",
  APPROVED: "success",
  EXPLORING: "info",
  BUILDING: "info",
  VERIFYING: "info",
  REVIEW: "info",
  RELEASED: "success",
  PARTIAL: "warning",
  BLOCKED: "warning",
  REFUTED: "danger",
  CANCELLED: "danger",
  ARCHIVED: "neutral",
};

export function MissionStatusBadge({ status }: { status: string }) {
  const { locale } = usePreferences();
  return (
    <StatusBadge tone={TONE[status] ?? "neutral"}>
      {enumLabel(locale, status)}
    </StatusBadge>
  );
}
