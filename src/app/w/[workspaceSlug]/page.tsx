import { ActiveMissions, type MissionRow } from "@/components/dashboard/active-missions";
import { ContextRail } from "@/components/dashboard/context-rail";
import { MetricProjection } from "@/components/dashboard/metric-projection";
import { MissionComposer } from "@/components/dashboard/mission-composer";
import { WorkflowProjection } from "@/components/dashboard/workflow-projection";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getDashboardProjection } from "@/server/dashboard";

export const dynamic = "force-dynamic";

export default async function WorkspaceHome({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const basePath = `/w/${workspaceSlug}`;

  const projection = await getDashboardProjection(data.ctx);
  const rows: MissionRow[] = projection.missions;

  return (
    <WorkspaceShell
      data={data}
      title="Dashboard"
      subtitle={
        rows.length === 0
          ? "No missions yet. Create a mission to begin."
          : `${rows.length} mission${rows.length === 1 ? "" : "s"} in this workspace.`
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
