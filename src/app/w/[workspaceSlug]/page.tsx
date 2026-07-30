import type { MissionStatus } from "@prisma/client";

import { MissionCommandSurface } from "@/components/enterprise/mission-command-surface";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { getTranslator } from "@/i18n/server";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import {
  getMissionCommandProjection,
  type MissionCommandView,
} from "@/server/mission-command";

export const dynamic = "force-dynamic";

const VALID_STATUSES = new Set<MissionStatus>([
  "DRAFT",
  "INTAKE",
  "SCOPED",
  "CONTRACT_REVIEW",
  "APPROVED",
  "EXPLORING",
  "BUILDING",
  "VERIFYING",
  "REVIEW",
  "RELEASED",
  "PARTIAL",
  "BLOCKED",
  "REFUTED",
  "CANCELLED",
  "ARCHIVED",
]);

export default async function WorkspaceHome({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceSlug } = await params;
  const query = await searchParams;
  const data = await loadWorkspacePage(workspaceSlug);
  const { t } = await getTranslator();
  const basePath = `/w/${workspaceSlug}`;
  const value = (key: string) => {
    const candidate = query[key];
    return typeof candidate === "string" ? candidate : undefined;
  };

  const viewValue = value("view");
  const view: MissionCommandView =
    viewValue === "attention" || viewValue === "my-work" ? viewValue : "all";
  const statusValue = value("status");
  const status = VALID_STATUSES.has(statusValue as MissionStatus)
    ? (statusValue as MissionStatus)
    : undefined;
  const sort =
    value("sort") === "CREATED_DESC" ? "CREATED_DESC" : "UPDATED_DESC";
  const modeValue = value("mode");
  const mode =
    modeValue === "grid" || modeValue === "chronology" ? modeValue : "graph";

  const projection = await getMissionCommandProjection(data.ctx, {
    view,
    statuses: status ? [status] : undefined,
    sort,
    after: value("after"),
  });

  return (
    <WorkspaceShell
      data={data}
      title={t("command.title")}
      subtitle={`${projection.scope.organization.name} · ${projection.scope.workspace.name}`}
      enterpriseScope={{
        organization: projection.scope.organization.name,
        unit: projection.scope.unit.name,
        portfolio: projection.scope.portfolio?.name ?? null,
        workspace: projection.scope.workspace.name,
      }}
    >
      <MissionCommandSurface
        projection={projection}
        basePath={basePath}
        initialMode={mode}
        initialStatus={status ?? ""}
        initialSort={sort}
      />
    </WorkspaceShell>
  );
}
