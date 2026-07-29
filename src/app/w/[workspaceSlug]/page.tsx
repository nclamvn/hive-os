import {
  ActiveMissions,
  type MissionRow,
} from "@/components/dashboard/active-missions";
import { ContextRail } from "@/components/dashboard/context-rail";
import { MetricProjection } from "@/components/dashboard/metric-projection";
import { MissionComposer } from "@/components/dashboard/mission-composer";
import { WorkflowProjection } from "@/components/dashboard/workflow-projection";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getDashboardProjection } from "@/server/dashboard";
import { getTranslator } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function WorkspaceHome({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const { t } = await getTranslator();
  const basePath = `/w/${workspaceSlug}`;

  const projection = await getDashboardProjection(data.ctx);
  const rows: MissionRow[] = projection.missions;

  return (
    <WorkspaceShell
      data={data}
      title={t("dashboard.title")}
      subtitle={
        rows.length === 0
          ? t("dashboard.emptySubtitle")
          : t("dashboard.countSubtitle", { count: rows.length })
      }
      rail={<ContextRail projection={projection} basePath={basePath} />}
      footer={<MetricProjection metrics={projection.metrics} />}
    >
      <MissionComposer basePath={basePath} />
      <ActiveMissions missions={rows} basePath={basePath} />
      <WorkflowProjection />
    </WorkspaceShell>
  );
}
