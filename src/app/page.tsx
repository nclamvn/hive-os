import { AppShell } from "@/components/shell/app-shell";
import { MissionComposer } from "@/components/dashboard/mission-composer";
import { ActiveMissions } from "@/components/dashboard/active-missions";
import { WorkflowProjection } from "@/components/dashboard/workflow-projection";
import { ContextRail } from "@/components/dashboard/context-rail";
import { MetricProjection } from "@/components/dashboard/metric-projection";

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="No missions yet — create a mission to begin."
      rail={<ContextRail />}
      footer={<MetricProjection />}
    >
      <MissionComposer />
      <ActiveMissions />
      <WorkflowProjection />
    </AppShell>
  );
}
