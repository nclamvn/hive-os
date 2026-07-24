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
import {
  getWorkspacePolicy,
  hasCapability,
  listMembers,
} from "@/modules/identity-workspace";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getDb } from "@/server/db";

export const dynamic = "force-dynamic";

function humanize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
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
      label: "Identity",
      value: `${activeMembers.length} active · ${humanize(role)}`,
      status: "enforced",
    },
    {
      icon: KeyRound,
      label: "Provider",
      value:
        policy.providerPolicyMode === "OPEN_MANUAL"
          ? "Open manual bridge"
          : `${policy.allowedProviders.length} allowlisted`,
      status: "kernel gate",
    },
    {
      icon: Database,
      label: "Storage",
      value: "Workspace database",
      status: "local",
    },
    {
      icon: SlidersHorizontal,
      label: "Assurance",
      value: humanize(policy.defaultAssuranceProfile),
      status: "draft default",
    },
    {
      icon: Archive,
      label: "Retention",
      value: `${Math.min(
        policy.artifactRetentionDays,
        policy.evidenceRetentionDays,
        policy.auditRetentionDays,
      )}+ days`,
      status: "minimum",
    },
    {
      icon: ShieldCheck,
      label: "Release",
      value: humanize(policy.publicReleasePolicy),
      status: "kernel gate",
    },
  ];

  return (
    <WorkspaceShell
      data={data}
      title="Settings"
      subtitle="Workspace authority, operating guardrails and retained accountability."
    >
      <SettingsNav
        slug={workspaceSlug}
        active="policy"
        showAudit={hasCapability(role, "audit.read")}
      />

      <div className="space-y-5">
        <Panel className="overflow-hidden">
          <div className="p-[var(--shell-card-padding)]">
            <p className="text-eyebrow text-navy-700">
              Workspace control plane
            </p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="text-page-title text-ink-strong">
                  Define what this workspace may do before work begins.
                </h2>
                <p className="text-body text-ink-muted mt-2">
                  Defaults accelerate drafting. Provider and release ceilings
                  remain enforced by deterministic kernels, and every policy
                  change is attributed in the audit ledger.
                </p>
              </div>
              <StatusBadge tone="info">version {policy.version}</StatusBadge>
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
                Effective operating policy
              </h2>
              <p className="text-meta text-ink-muted mt-1">
                Storage is fixed to the local workspace database. External
                credentials remain outside HIVE OS policy records.
              </p>
            </div>
            <PolicyForm
              slug={workspaceSlug}
              canUpdate={hasCapability(role, "workspace.update")}
              policy={policy}
            />
          </Panel>

          <aside className="space-y-4" aria-label="Settings accountability">
            <Panel className="p-5">
              <p className="text-eyebrow text-navy-700">Authority</p>
              <p className="text-section-title text-ink-strong mt-2">
                {humanize(role)}
              </p>
              <p className="text-meta text-ink-muted mt-2">
                Owners and Admins may update operating policy. Release and
                membership restrictions remain capability-specific.
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-eyebrow text-navy-700">Audit continuity</p>
              <p className="text-page-title text-ink-strong mt-2 tabular">
                {auditCount}
              </p>
              <p className="text-meta text-ink-muted mt-1">
                append-only workspace events retained
              </p>
            </Panel>
            <Panel className="p-5">
              <p className="text-eyebrow text-navy-700">Secret boundary</p>
              <p className="text-body text-ink-strong mt-2 font-semibold">
                Identifiers, never credentials
              </p>
              <p className="text-meta text-ink-muted mt-2">
                Provider policy accepts names and model identifiers only. API
                keys and tokens do not belong in settings, prompts or artifacts.
              </p>
            </Panel>
          </aside>
        </div>
      </div>
    </WorkspaceShell>
  );
}
