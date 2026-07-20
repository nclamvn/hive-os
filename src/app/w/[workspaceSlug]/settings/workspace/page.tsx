import { hasCapability } from "@/modules/identity-workspace";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { SettingsNav } from "@/components/settings/settings-nav";
import { WorkspaceForm } from "@/components/settings/workspace-form";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const role = data.ctx.membership.role;

  return (
    <WorkspaceShell data={data} title="Workspace settings" subtitle={data.ctx.workspace.name}>
      <SettingsNav
        slug={workspaceSlug}
        active="workspace"
        showAudit={hasCapability(role, "audit.read")}
      />
      <Panel className="p-[var(--shell-card-padding)]">
        <SectionHeader title="Workspace profile" />
        <div className="mt-4">
          <WorkspaceForm
            slug={workspaceSlug}
            currentName={data.ctx.workspace.name}
            canUpdate={hasCapability(role, "workspace.update")}
          />
        </div>
      </Panel>
    </WorkspaceShell>
  );
}
