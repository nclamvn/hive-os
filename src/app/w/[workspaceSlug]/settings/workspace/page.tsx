import { hasCapability } from "@/modules/identity-workspace";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { SettingsNav } from "@/components/settings/settings-nav";
import { WorkspaceForm } from "@/components/settings/workspace-form";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { settingsCopy } from "@/i18n/settings-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = settingsCopy[locale];
  const role = data.ctx.membership.role;

  return (
    <WorkspaceShell
      data={data}
      title={copy.workspace.pageTitle}
      subtitle={data.ctx.workspace.name}
    >
      <SettingsNav
        slug={workspaceSlug}
        active="workspace"
        showAudit={hasCapability(role, "audit.read")}
        copy={copy.nav}
      />
      <Panel className="p-[var(--shell-card-padding)]">
        <SectionHeader title={copy.workspace.sectionTitle} />
        <div className="mt-4">
          <WorkspaceForm
            slug={workspaceSlug}
            currentName={data.ctx.workspace.name}
            canUpdate={hasCapability(role, "workspace.update")}
            locale={locale}
            copy={copy.workspace}
          />
        </div>
      </Panel>
    </WorkspaceShell>
  );
}
