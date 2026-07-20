import { ActiveMissions } from "@/components/dashboard/active-missions";
import { ContextRail } from "@/components/dashboard/context-rail";
import { MetricProjection } from "@/components/dashboard/metric-projection";
import { MissionComposer } from "@/components/dashboard/mission-composer";
import { WorkflowProjection } from "@/components/dashboard/workflow-projection";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function WorkspaceHome({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);

  return (
    <WorkspaceShell
      data={data}
      title="Dashboard"
      subtitle="No missions yet — create a mission to begin."
      rail={<ContextRail />}
      footer={<MetricProjection />}
    >
      <MissionComposer />
      <ActiveMissions />
      <WorkflowProjection />
    </WorkspaceShell>
  );
}
