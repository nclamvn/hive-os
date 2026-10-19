import {
  type AuditView,
  ForbiddenError,
  hasCapability,
  listAuditEvents,
} from "@/modules/identity-workspace";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { SettingsNav } from "@/components/settings/settings-nav";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { settingsCopy } from "@/i18n/settings-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function AuditSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = settingsCopy[locale];
  const role = data.ctx.membership.role;

  let events: AuditView[] = [];
  let denied = false;
  try {
    events = await listAuditEvents(data.ctx);
  } catch (error) {
    if (error instanceof ForbiddenError) denied = true;
    else throw error;
  }

  return (
    <WorkspaceShell
      data={data}
      title={copy.audit.pageTitle}
      subtitle={data.ctx.workspace.name}
    >
      <SettingsNav
        slug={workspaceSlug}
        active="audit"
        showAudit={hasCapability(role, "audit.read")}
        copy={copy.nav}
      />
      <Panel>
        <div className="p-[var(--shell-card-padding)] pb-3">
          <SectionHeader
            title={copy.audit.events}
            action={
              hasCapability(role, "audit.read") ? (
                <a
                  href={`/api/w/${workspaceSlug}/exports/audit`}
                  download
                  className="text-meta text-navy-700 border-line hover:border-line-strong inline-flex rounded-md border px-2.5 py-1.5 font-medium"
                >
                  {copy.audit.download}
                </a>
              ) : null
            }
          />
        </div>
        {denied ? (
          <div className="border-t border-line">
            <EmptyState
              title={copy.audit.denied}
              hint={copy.audit.deniedHint}
            />
          </div>
        ) : events.length === 0 ? (
          <div className="border-t border-line">
            <EmptyState title={copy.audit.empty} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="border-t border-line">
                  {[
                    copy.audit.time,
                    copy.audit.event,
                    copy.audit.entity,
                    copy.audit.actor,
                  ].map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="text-meta text-ink-muted bg-surface-subtle px-5 py-2 text-left font-medium"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-line align-top">
                    <td className="text-meta text-ink-muted tabular px-5 py-3 whitespace-nowrap">
                      {e.createdAt.toISOString().replace("T", " ").slice(0, 19)}
                    </td>
                    <td className="text-body text-ink px-5 py-3 font-medium">
                      {e.eventType}
                    </td>
                    <td className="text-meta text-ink-muted px-5 py-3">
                      {e.entityType}
                    </td>
                    <td className="text-meta text-ink-muted tabular px-5 py-3">
                      {e.actorUserId
                        ? e.actorUserId.slice(0, 8)
                        : copy.audit.system}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </WorkspaceShell>
  );
}
