import { AlertTriangle, FileCheck2, FileInput, Route, Waypoints } from "lucide-react";

import {
  DeviationResolutionForm,
  ExecutionOperationsForms,
} from "@/components/execution/execution-forms";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getExecutionOperationsProjection } from "@/server/execution-operations";

export const dynamic = "force-dynamic";

function humanize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

function statusTone(status: string) {
  if (["DONE", "READY"].includes(status)) return "success" as const;
  if (["BLOCKED", "BLOCKED_DEVIATION", "NOT_READY"].includes(status)) {
    return "danger" as const;
  }
  if (["PARTIAL", "AWAITING_REPORT"].includes(status)) return "warning" as const;
  if (["IN_PROGRESS", "READY_WITH_DEFERRED"].includes(status)) {
    return "info" as const;
  }
  return "neutral" as const;
}

export default async function ExecutionOperationsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const execution = await getExecutionOperationsProjection(data.ctx);

  const missionOption = (mission: (typeof execution.missions)[number]) => ({
    id: mission.id,
    label: `${mission.referenceCode} · ${mission.title} · ${humanize(mission.assuranceProfile)}`,
  });
  const approvedMissions = execution.missions
    .filter((mission) => mission.status === "APPROVED")
    .map(missionOption);
  const operatingMissions = execution.missions
    .filter((mission) => ["EXPLORING", "BUILDING"].includes(mission.status))
    .map(missionOption);
  const exploringMissions = execution.missions
    .filter((mission) => mission.status === "EXPLORING")
    .map(missionOption);
  const skills = execution.skills.map((skill) => ({
    id: skill.activeVersion.id,
    label: `${skill.displayName} v${skill.activeVersion.semanticVersion} · ${skill.activeVersion.assuranceCompatibility.join(", ")}`,
  }));
  const tips = execution.tips.map((tip) => ({
    id: tip.id,
    label: `${tip.mission.referenceCode} · ${tip.code} · ${tip.title}`,
  }));
  const unissuedTips = execution.tips
    .filter(
      (tip) =>
        tip.status === "READY" &&
        (tip.skillRuns[0]?.agentRuns.length ?? 0) === 0,
    )
    .map((tip) => ({
      id: tip.id,
      label: `${tip.mission.referenceCode} · ${tip.code} · ${tip.title}`,
    }));
  const runs = execution.tips.flatMap((tip) =>
    tip.skillRuns.flatMap((skillRun) =>
      skillRun.agentRuns.map((run) => ({ run, tip })),
    ),
  );
  const awaitingRuns = runs
    .filter(({ run }) => run.status === "AWAITING_REPORT")
    .map(({ run, tip }) => ({
      id: run.id,
      label: `${tip.code} · attempt ${run.attemptNumber} · ${run.providerName}/${run.modelName}`,
    }));
  const retryRuns = execution.tips.flatMap((tip) => {
    const latest = tip.skillRuns[0]?.agentRuns[0];
    if (!latest || latest.status === "AWAITING_REPORT") return [];
    return [
      {
        id: latest.id,
        label: `${tip.code} · attempt ${latest.attemptNumber} · ${humanize(latest.status)}`,
      },
    ];
  });

  return (
    <WorkspaceShell
      data={data}
      title="Execution Operations"
      subtitle="Provider-independent work packages and immutable Manual Bridge artifacts."
    >
      <div className="space-y-5">
        <Panel className="overflow-hidden">
          <div className="p-[var(--shell-card-padding)]">
            <p className="text-eyebrow text-navy-700">Execution authority</p>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-3xl">
                <h2 className="text-page-title text-ink-strong">
                  Move work across the human boundary without losing truth.
                </h2>
                <p className="text-body text-ink-muted mt-2">
                  {execution.disclaimer}
                </p>
              </div>
              <StatusBadge tone="info">manual bridge</StatusBadge>
            </div>
          </div>
          <ol
            aria-label="Manual Bridge operating sequence"
            className="border-line grid border-t min-[760px]:grid-cols-5"
          >
            {[
              ["01", "Package", "Bind scope and skill"],
              ["02", "Instruction", "Freeze exact content"],
              ["03", "Exchange", "Operate externally"],
              ["04", "Report", "Import strict evidence"],
              ["05", "Readiness", "Enter building by gate"],
            ].map(([number, title, note]) => (
              <li
                key={number}
                className="border-line flex min-w-0 gap-3 border-b p-4 last:border-b-0 min-[760px]:border-r min-[760px]:border-b-0 min-[760px]:last:border-r-0"
              >
                <span className="text-meta text-navy-700 font-mono">{number}</span>
                <span className="min-w-0">
                  <span className="text-body text-ink-strong block font-semibold">
                    {title}
                  </span>
                  <span className="text-meta text-ink-muted block">{note}</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>

        <dl className="grid grid-cols-2 gap-3 min-[760px]:grid-cols-5">
          {[
            ["Packages", execution.counts.tips],
            ["Awaiting", execution.counts.awaitingReports],
            ["Reports", execution.counts.reports],
            ["Artifacts", execution.counts.artifacts],
            ["Open deviations", execution.counts.openDeviations],
          ].map(([label, value]) => (
            <Panel key={label} className="p-4">
              <dt className="text-meta text-ink-muted">{label}</dt>
              <dd className="text-page-title text-ink-strong mt-1 tabular">
                {value}
              </dd>
            </Panel>
          ))}
        </dl>

        {execution.permissions.canOperate ? (
          <ExecutionOperationsForms
            slug={workspaceSlug}
            approvedMissions={approvedMissions}
            operatingMissions={operatingMissions}
            exploringMissions={exploringMissions}
            skills={skills}
            tips={tips}
            unissuedTips={unissuedTips}
            awaitingRuns={awaitingRuns}
            retryRuns={retryRuns}
          />
        ) : (
          <p className="text-body text-ink-muted border-line rounded-md border p-4">
            Your role can inspect execution evidence but cannot operate runs.
          </p>
        )}

        {execution.deviations.length ? (
          <section aria-labelledby="open-deviations-title">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle aria-hidden="true" className="text-danger-600 size-4" />
              <h2
                id="open-deviations-title"
                className="text-section-title text-ink-strong"
              >
                Open execution deviations
              </h2>
            </div>
            <div className="space-y-3">
              {execution.deviations.map((deviation) => (
                <Panel key={deviation.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-meta text-ink-muted">
                        {deviation.tip.code} · {deviation.code}
                      </p>
                      <h3 className="text-section-title text-ink-strong mt-1">
                        {deviation.title}
                      </h3>
                      <p className="text-body text-ink-muted mt-2">
                        {deviation.description}
                      </p>
                      <p className="text-meta text-ink-muted mt-3">
                        Proposed: {deviation.proposedResolution}
                      </p>
                    </div>
                    <StatusBadge
                      tone={deviation.materiality === "MATERIAL" ? "danger" : "warning"}
                    >
                      {deviation.materiality.toLowerCase()}
                    </StatusBadge>
                  </div>
                  {execution.permissions.canReview ? (
                    <div className="border-line mt-4 border-t pt-4">
                      <DeviationResolutionForm
                        slug={workspaceSlug}
                        deviationId={deviation.id}
                        version={deviation.version}
                        code={deviation.code}
                      />
                    </div>
                  ) : null}
                </Panel>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-labelledby="execution-ledger-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Waypoints aria-hidden="true" className="text-navy-700 size-4" />
              <h2
                id="execution-ledger-title"
                className="text-section-title text-ink-strong"
              >
                Immutable execution ledger
              </h2>
            </div>
            <span className="text-meta text-ink-muted">Newest package first</span>
          </div>

          {execution.tips.length ? (
            <div className="space-y-4">
              {execution.tips.map((tip) => (
                <Panel key={tip.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-meta text-ink-muted">
                          {tip.mission.referenceCode} · {tip.code}
                        </p>
                        <h3 className="text-section-title text-ink-strong mt-1">
                          {tip.title}
                        </h3>
                        <p className="text-body text-ink-muted mt-2 max-w-3xl">
                          {tip.description}
                        </p>
                      </div>
                      <StatusBadge tone={statusTone(tip.status)}>
                        {humanize(tip.status)}
                      </StatusBadge>
                    </div>

                    <div className="border-line mt-4 grid gap-3 border-t pt-4 min-[760px]:grid-cols-3">
                      <p className="text-meta text-ink-muted">
                        Skill{" "}
                        <span className="text-ink">
                          {tip.skillVersion.skill.displayName} v
                          {tip.skillVersion.semanticVersion}
                        </span>
                      </p>
                      <p className="text-meta text-ink-muted">
                        Mission{" "}
                        <span className="text-ink">{tip.mission.title}</span>
                      </p>
                      <p className="text-meta text-ink-muted">
                        Predecessors{" "}
                        <span className="text-ink">
                          {tip.predecessorEdges.length
                            ? tip.predecessorEdges
                                .map((edge) => `${edge.predecessor.code} (${humanize(edge.predecessor.status)})`)
                                .join(", ")
                            : "None"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {tip.skillRuns[0]?.agentRuns.length ? (
                    <ol className="border-line bg-surface-subtle border-t">
                      {tip.skillRuns[0].agentRuns.map((attempt) => {
                        const coverage = attempt.completionReport
                          ?.requirementCoverage as
                          | { implemented?: number; total?: number }
                          | undefined;
                        return (
                          <li
                            key={attempt.id}
                            className="border-line relative border-b p-5 last:border-b-0"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="flex min-w-0 items-start gap-3">
                                <span className="bg-navy-800 text-meta flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-white">
                                  {attempt.attemptNumber}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-body text-ink-strong font-semibold">
                                    {humanize(attempt.executionRole)} · {attempt.providerName}
                                  </p>
                                  <p className="text-meta text-ink-muted">
                                    {attempt.modelName} · {attempt.providerMode.toLowerCase().replace("_", " ")}
                                  </p>
                                </div>
                              </div>
                              <StatusBadge tone={statusTone(attempt.status)}>
                                {humanize(attempt.status)}
                              </StatusBadge>
                            </div>

                            <div className="mt-4 grid gap-3 min-[900px]:grid-cols-2">
                              <details className="border-line bg-surface rounded-md border p-4">
                                <summary className="text-body text-ink-strong flex cursor-pointer items-center gap-2 font-semibold">
                                  <FileInput aria-hidden="true" className="size-4" />
                                  Instruction artifact
                                </summary>
                                <p className="text-meta text-ink-muted mt-3 break-all font-mono">
                                  SHA-256 {attempt.inputArtifact.contentHash}
                                </p>
                                <pre className="border-line text-meta text-ink mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-surface-subtle p-3">
                                  {attempt.inputArtifact.content}
                                </pre>
                              </details>

                              {attempt.completionReport && attempt.outputArtifact ? (
                                <details className="border-line bg-surface rounded-md border p-4">
                                  <summary className="text-body text-ink-strong flex cursor-pointer items-center gap-2 font-semibold">
                                    <FileCheck2 aria-hidden="true" className="size-4" />
                                    Completion Report
                                  </summary>
                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <StatusBadge tone={statusTone(attempt.completionReport.result)}>
                                      {humanize(attempt.completionReport.result)}
                                    </StatusBadge>
                                    <StatusBadge tone={statusTone(attempt.completionReport.overallStatus)}>
                                      {humanize(attempt.completionReport.overallStatus)}
                                    </StatusBadge>
                                  </div>
                                  <p className="text-body text-ink mt-3">
                                    {attempt.completionReport.summary}
                                  </p>
                                  <p className="text-meta text-ink-muted mt-2">
                                    Coverage {coverage?.implemented ?? 0}/{coverage?.total ?? 0}
                                  </p>
                                  <p className="text-meta text-ink-muted mt-2 break-all font-mono">
                                    SHA-256 {attempt.outputArtifact.contentHash}
                                  </p>
                                  {attempt.completionReport.resourceUsageRecords.length ? (
                                    <ul className="text-meta text-ink-muted mt-3">
                                      {attempt.completionReport.resourceUsageRecords.map((usage) => (
                                        <li key={usage.id}>
                                          {usage.metric}: {usage.quantity} {usage.unit}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </details>
                              ) : (
                                <div className="border-line bg-surface rounded-md border p-4">
                                  <p className="text-body text-ink-strong font-semibold">
                                    Awaiting external report
                                  </p>
                                  <p className="text-meta text-ink-muted mt-1">
                                    Use the exact instruction artifact, then import
                                    the strict Completion Report above.
                                  </p>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <div className="border-line bg-surface-subtle border-t p-5 text-center">
                      <p className="text-body text-ink-strong">Instruction not issued</p>
                      <p className="text-meta text-ink-muted mt-1">
                        This work package has no provider attempt.
                      </p>
                    </div>
                  )}
                </Panel>
              ))}
            </div>
          ) : (
            <Panel className="p-8 text-center">
              <Route aria-hidden="true" className="text-ink-faint mx-auto size-6" />
              <p className="text-section-title text-ink-strong mt-3">
                No execution work packages
              </p>
              <p className="text-body text-ink-muted mt-1">
                Open an approved Mission for exploration, then define its first
                bounded package.
              </p>
            </Panel>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}
