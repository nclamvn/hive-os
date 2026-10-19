import {
  hasCapability,
  listInvitations,
  listMembers,
} from "@/modules/identity-workspace";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { InviteForm } from "@/components/settings/invite-form";
import { MemberRowActions } from "@/components/settings/member-row-actions";
import { SettingsNav } from "@/components/settings/settings-nav";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { settingsCopy, settingsValueLabel } from "@/i18n/settings-copy";
import { getLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function MembersSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = settingsCopy[locale];
  const role = data.ctx.membership.role;

  const members = await listMembers(data.ctx);
  const canInvite = hasCapability(role, "members.invite");
  const canManageOwner = hasCapability(role, "members.manage_owner");
  const canManageOrdinary = hasCapability(role, "members.change_role");
  const invitations = canInvite ? await listInvitations(data.ctx) : [];

  return (
    <WorkspaceShell
      data={data}
      title={copy.members.pageTitle}
      subtitle={data.ctx.workspace.name}
    >
      <SettingsNav
        slug={workspaceSlug}
        active="members"
        showAudit={hasCapability(role, "audit.read")}
        copy={copy.nav}
      />

      {canInvite ? (
        <Panel className="p-[var(--shell-card-padding)]">
          <SectionHeader title={copy.members.inviteTitle} />
          <p className="text-meta text-ink-muted mt-1">
            {copy.members.inviteHint}
          </p>
          <div className="mt-4">
            <InviteForm
              slug={workspaceSlug}
              canInviteOwner={canManageOwner}
              locale={locale}
              copy={copy.members}
            />
          </div>
        </Panel>
      ) : null}

      <Panel>
        <div className="p-[var(--shell-card-padding)] pb-3">
          <SectionHeader title={copy.members.tableTitle} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-t border-line">
                {[
                  copy.members.name,
                  copy.members.email,
                  copy.members.role,
                  copy.members.status,
                  "",
                ].map((c, i) => (
                  <th
                    key={c || `actions-${i}`}
                    scope="col"
                    className="text-meta text-ink-muted bg-surface-subtle px-5 py-2 text-left font-medium last:text-right"
                  >
                    {c || (
                      <span className="sr-only">{copy.members.actions}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.membershipId} className="border-t border-line">
                  <td className="text-body text-ink px-5 py-3 font-medium">
                    {m.name}
                    {m.isSelf ? (
                      <span className="text-meta text-ink-muted ml-2">
                        ({copy.members.you})
                      </span>
                    ) : null}
                  </td>
                  <td className="text-body text-ink-muted px-5 py-3">
                    {m.email}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={m.role === "OWNER" ? "info" : "neutral"}>
                      {settingsValueLabel(locale, m.role)}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      tone={m.status === "ACTIVE" ? "success" : "warning"}
                    >
                      {settingsValueLabel(locale, m.status)}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <MemberRowActions
                      slug={workspaceSlug}
                      membershipId={m.membershipId}
                      role={m.role}
                      status={m.status}
                      isSelf={m.isSelf}
                      canManageOwner={canManageOwner}
                      canManageOrdinary={canManageOrdinary}
                      locale={locale}
                      copy={copy.members}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {canInvite ? (
        <Panel>
          <div className="p-[var(--shell-card-padding)] pb-3">
            <SectionHeader title={copy.members.pendingTitle} />
          </div>
          {invitations.length === 0 ? (
            <div className="border-t border-line">
              <EmptyState title={copy.members.noPending} />
            </div>
          ) : (
            <ul className="border-t border-line">
              {invitations.map((inv) => (
                <li
                  key={inv.id}
                  className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0"
                >
                  <span className="min-w-0">
                    <span className="text-body text-ink block truncate">
                      {inv.emailNormalized}
                    </span>
                    <span className="text-meta text-ink-muted">
                      {settingsValueLabel(locale, inv.role)} ·{" "}
                      {copy.members.expires}{" "}
                      {inv.expiresAt.toISOString().slice(0, 10)}
                    </span>
                  </span>
                  <StatusBadge tone="neutral">
                    {copy.members.pending}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}
    </WorkspaceShell>
  );
}
