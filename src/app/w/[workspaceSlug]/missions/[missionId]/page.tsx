import { notFound } from "next/navigation";

import { EmptyState } from "@/components/ui/empty-state";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { MissionStatusBadge } from "@/components/mission/mission-status-badge";
import { MissionActions } from "@/components/mission/mission-actions";
import { ObligationControls } from "@/components/mission/obligation-controls";
import { DecisionControls } from "@/components/mission/decision-controls";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { hasCapability } from "@/modules/identity-workspace";
import { getMissionDetail, getMissionProgress, MissionError } from "@/modules/mission-kernel";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; missionId: string }>;
}) {
  const { workspaceSlug, missionId } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const slug = workspaceSlug;
  const role = data.ctx.membership.role;

  let detail: Awaited<ReturnType<typeof getMissionDetail>>;
  try {
    detail = await getMissionDetail(data.ctx, missionId);
  } catch (error) {
    if (error instanceof MissionError && error.code === "MISSION_NOT_FOUND") notFound();
    throw error;
  }
  const progress = await getMissionProgress(data.ctx, missionId);
  const { mission, contract, obligations, gates, decisions, escalations } = detail;
  const canApprove = hasCapability(role, "missions.approve_contract");
  const canResolve = hasCapability(role, "decisions.resolve");
  const decisionsRequired = decisions.filter((d) => d.status === "REQUIRED");

  return (
    <WorkspaceShell data={data} title={mission.title} subtitle={`${mission.referenceCode} · ${data.ctx.workspace.name}`}>
      {/* Identity + state */}
      <Panel className="p-[var(--shell-card-padding)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-meta text-ink-muted tabular">{mission.referenceCode}</span>
              <MissionStatusBadge status={mission.status} />
              <StatusBadge tone="neutral">{mission.assuranceProfile.toLowerCase()}</StatusBadge>
            </div>
            <h2 className="text-section-title text-ink-strong mt-1">{mission.title}</h2>
          </div>
          <MissionActions slug={slug} missionId={mission.id} status={mission.status} canApprove={canApprove} />
        </div>
      </Panel>

      {/* Progress */}
      <Panel className="p-[var(--shell-card-padding)]">
        <SectionHeader title="Progress" />
        {progress ? (
          <p className="text-body text-ink mt-2 tabular">
            {(progress.basisPoints / 100).toFixed(2)}% — {progress.closedWeight} / {progress.totalWeight} weighted obligations closed
          </p>
        ) : (
          <p className="text-meta text-ink-muted mt-2">
            Progress is unavailable until the contract is approved.
          </p>
        )}
      </Panel>

      {/* Contract */}
      <Panel className="p-[var(--shell-card-padding)]">
        <SectionHeader title="Current contract" action={contract ? <StatusBadge tone="neutral">{`v${contract.versionNumber} · ${contract.status.toLowerCase()}`}</StatusBadge> : undefined} />
        {contract ? (
          <dl className="mt-3 space-y-2">
            <Field label="Objective" value={contract.objective} />
            <Field label="Scope" value={contract.scope} />
            <Field label="Success definition" value={contract.successDefinition} />
          </dl>
        ) : (
          <EmptyState title="No contract captured" />
        )}
      </Panel>

      {/* Requirements */}
      {contract ? (
        <Panel>
          <div className="p-[var(--shell-card-padding)] pb-3"><SectionHeader title="Requirements" /></div>
          {contract.requirements.length === 0 ? (
            <div className="border-t border-line"><EmptyState title="No requirements" /></div>
          ) : (
            <ul className="border-t border-line">
              {contract.requirements.map((r) => (
                <li key={r.id} className="border-line border-b px-5 py-3 last:border-b-0">
                  <span className="text-body text-ink font-medium">{r.code} · {r.title}</span>
                  <span className="text-meta text-ink-muted block">{r.acceptanceCriteria}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {/* Obligations + runtime */}
      <Panel>
        <div className="p-[var(--shell-card-padding)] pb-3"><SectionHeader title="Obligations" /></div>
        {obligations.length === 0 ? (
          <div className="border-t border-line">
            <EmptyState title="Obligations appear after approval" hint="Runtime obligations are created from the approved contract." />
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t border-line">
                {["Code", "Obligation", "Weight", "Status", ""].map((c, i) => (
                  <th key={c || `a${i}`} scope="col" className="text-meta text-ink-muted bg-surface-subtle px-5 py-2 text-left font-medium last:text-right">
                    {c || <span className="sr-only">Actions</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {obligations.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="text-meta text-ink-muted tabular px-5 py-3">{o.contractObligation.code}</td>
                  <td className="text-body text-ink px-5 py-3">{o.contractObligation.title}</td>
                  <td className="text-meta text-ink-muted tabular px-5 py-3">{o.contractObligation.weight}</td>
                  <td className="px-5 py-3"><StatusBadge tone={o.status === "SATISFIED" ? "success" : o.status === "BLOCKED" ? "warning" : "neutral"}>{o.status.toLowerCase()}</StatusBadge></td>
                  <td className="px-5 py-3 text-right">
                    {hasCapability(role, "obligations.update") ? (
                      <ObligationControls slug={slug} obligationId={o.id} status={o.status} />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {/* Gates */}
      <Panel>
        <div className="p-[var(--shell-card-padding)] pb-3"><SectionHeader title="Gates" /></div>
        {gates.length === 0 ? (
          <div className="border-t border-line"><EmptyState title="No gates" hint="Gates are created from the approved contract." /></div>
        ) : (
          <ul className="border-t border-line">
            {gates.map((g) => (
              <li key={g.id} className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0">
                <span className="text-body text-ink">{g.contractGate.code} · {g.contractGate.title}</span>
                <StatusBadge tone={g.status === "PASSED" ? "success" : g.status === "FAILED" ? "danger" : "neutral"}>{g.status.toLowerCase()}</StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Decisions required */}
      <Panel>
        <div className="p-[var(--shell-card-padding)] pb-3"><SectionHeader title="Decisions required" /></div>
        {decisionsRequired.length === 0 ? (
          <div className="border-t border-line"><EmptyState title="No decisions required" /></div>
        ) : (
          <ul className="border-t border-line">
            {decisionsRequired.map((d) => (
              <li key={d.id} className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0">
                <span className="min-w-0">
                  <span className="text-body text-ink block font-medium">{d.decisionType.replace(/_/g, " ").toLowerCase()}</span>
                  <span className="text-meta text-ink-muted block">{d.question}</span>
                </span>
                {canResolve ? <DecisionControls slug={slug} decisionId={d.id} /> : <StatusBadge tone="warning">required</StatusBadge>}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Escalations */}
      <Panel>
        <div className="p-[var(--shell-card-padding)] pb-3"><SectionHeader title="Escalations" /></div>
        {escalations.length === 0 ? (
          <div className="border-t border-line"><EmptyState title="No escalations" /></div>
        ) : (
          <ul className="border-t border-line">
            {escalations.map((e) => (
              <li key={e.id} className="border-line flex items-center justify-between gap-3 border-b px-5 py-3 last:border-b-0">
                <span className="min-w-0">
                  <span className="text-body text-ink block">{e.reason}</span>
                  <span className="text-meta text-ink-muted">{e.sourceType.toLowerCase()}</span>
                </span>
                <StatusBadge tone={e.status === "RESOLVED" ? "success" : "warning"}>{`${e.severity} · ${e.status.toLowerCase()}`}</StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </WorkspaceShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-body text-ink whitespace-pre-wrap">{value || "—"}</dd>
    </div>
  );
}
