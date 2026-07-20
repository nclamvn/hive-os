import { StatusBadge } from "@/components/ui/status-badge";

// Map mission status to a semantic tone. Text label always present so state is
// never communicated by color alone.
const TONE: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
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

function label(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function MissionStatusBadge({ status }: { status: string }) {
  return <StatusBadge tone={TONE[status] ?? "neutral"}>{label(status)}</StatusBadge>;
}
