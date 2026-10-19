import {
  Archive,
  Database,
  KeyRound,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { PolicyForm } from "@/components/settings/policy-form";
import { SettingsNav } from "@/components/settings/settings-nav";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { settingsCopy, settingsValueLabel } from "@/i18n/settings-copy";
import { getLocale } from "@/i18n/server";
import {
  getWorkspacePolicy,
  hasCapability,
  listMembers,
} from "@/modules/identity-workspace";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getDb } from "@/server/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = settingsCopy[locale];
  const role = data.ctx.membership.role;
  const [policy, members, auditCount] = await Promise.all([
    getWorkspacePolicy(data.ctx),
    listMembers(data.ctx),
    getDb().auditEvent.count({ where: { workspaceId: data.ctx.workspace.id } }),
  ]);
  const activeMembers = members.filter((member) => member.status === "ACTIVE");

  const policyCells = [
    {
      icon: Users,
      label: copy.policy.cells.identity,
      value: `${activeMembers.length} ${copy.policy.cells.active} · ${settingsValueLabel(locale, role)}`,
      status: copy.policy.cells.enforced,
    },
    {
      icon: KeyRound,
      label: copy.policy.cells.provider,
      value:
        policy.providerPolicyMode === "OPEN_MANUAL"
          ? copy.policy.cells.openManual
          : `${policy.allowedProviders.length} ${copy.policy.cells.allowlisted}`,
      status: copy.policy.cells.kernelGate,
    },
    {
      icon: Database,
      label: copy.policy.cells.storage,
      value: copy.policy.cells.workspaceDatabase,
      status: copy.policy.cells.local,
    },
    {
      icon: SlidersHorizontal,
      label: copy.policy.cells.assurance,
      value: settingsValueLabel(locale, policy.defaultAssuranceProfile),
      status: copy.policy.cells.draftDefault,
    },
    {
      icon: Archive,
      label: copy.policy.cells.retention,
      value: `${Math.min(
        policy.artifactRetentionDays,
        policy.evidenceRetentionDays,
        policy.auditRetentionDays,
      )}+ ${copy.policy.cells.days}`,
      status: copy.policy.cells.minimum,
    },
    {
      icon: ShieldCheck,
      label: copy.policy.cells.release,
      value: settingsValueLabel(locale, policy.publicReleasePolicy),
      status: copy.policy.cells.kernelGate,
    },
  ];

  return (
    <WorkspaceShell
      data={data}
      title={copy.policy.pageTitle}
      subtitle={copy.policy.pageSubtitle}
    >
      <SettingsNav
        slug={workspaceSlug}
        active="policy"
        showAudit={hasCapability(role, "audit.read")}
        copy={copy.nav}
      />

      <div className="space-y-5">
        <Panel className="overflow-hidden">
          <div className="p-[var(--shell-card-padding)]">
            <p className="text-eyebrow text-navy-700">{copy.policy.eyebrow}</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="text-page-title text-ink-strong">
                  {copy.policy.title}
                </h2>
                <p className="text-body text-ink-muted mt-2">
                  {copy.policy.description}
                </p>
              </div>
              <StatusBadge tone="info">
                {copy.policy.version} {policy.version}
              </StatusBadge>
            </div>
          </div>
          <dl className="border-line grid border-t min-[760px]:grid-cols-3 min-[1180px]:grid-cols-6">
            {policyCells.map((cell) => (
              <div
                key={cell.label}
                className="border-line min-w-0 border-b p-4 min-[760px]:border-r min-[1180px]:border-b-0"
              >
                <dt className="text-meta text-ink-muted flex items-center gap-2">
                  <cell.icon aria-hidden="true" className="size-4" />
                  {cell.label}
                </dt>
                <dd className="text-body text-ink-strong mt-2 truncate font-semibold">
                  {cell.value}
                </dd>
                <dd className="text-meta text-ink-muted mt-1">{cell.status}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <div className="grid gap-5 min-[1080px]:grid-cols-[minmax(0,1fr)_300px]">
          <Panel className="p-[var(--shell-card-padding)]">
            <div className="mb-5">
              <h2 className="text-section-title text-ink-strong">
                {copy.policy.effectiveTitle}
              </h2>
              <p className="text-meta text-ink-muted mt-1">
                {copy.policy.effectiveDescription}
              </p>
            </div>
            <PolicyForm
              slug={workspaceSlug}
              canUpdate={hasCapability(role, "workspace.update")}
              policy={policy}
              locale={locale}
              copy={copy.policy.form}
            />
          </Panel>

          <aside
            className="space-y-4"
            aria-label={copy.policy.accountabilityLabel}
          >
            <Panel className="p-5">
              <p className="text-eyebrow text-navy-700">
                {copy.policy.authority}
              </p>
              <p className="text-section-title text-ink-strong mt-2">
                {settingsValueLabel(locale, role)}
              </p>
              <p className="text-meta text-ink-muted mt-2">
                {copy.policy.authorityDescription}
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-eyebrow text-navy-700">
                {copy.policy.auditContinuity}
              </p>
              <p className="text-page-title text-ink-strong mt-2 tabular">
                {auditCount}
              </p>
              <p className="text-meta text-ink-muted mt-1">
                {copy.policy.auditRetained}
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-eyebrow text-navy-700">
                {copy.policy.secretBoundary}
              </p>
              <p className="text-body text-ink-strong mt-2 font-semibold">
                {copy.policy.identifiersOnly}
              </p>
              <p className="text-meta text-ink-muted mt-2">
                {copy.policy.secretDescription}
              </p>
            </Panel>
          </aside>
        </div>
      </div>
    </WorkspaceShell>
  );
}
