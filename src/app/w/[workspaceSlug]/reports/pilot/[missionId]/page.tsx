import Link from "next/link";
import { notFound } from "next/navigation";

import { DossierExportControl } from "@/components/exports/dossier-export-control";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  durationUnavailableReason,
  pilotMetricCopy,
  reportsCopy,
  reworkLabel,
} from "@/i18n/reports-copy";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/i18n/config";
import { NotFoundError } from "@/modules/identity-workspace";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getPilotMeasurementReport } from "@/server/pilot-measurement";

export const dynamic = "force-dynamic";

function durationLabel(
  metric: {
    status: string;
    value: number | null;
    reason: string | null;
  },
  locale: Locale,
  copy: (typeof reportsCopy)[Locale]["pilot"],
) {
  if (metric.status !== "AVAILABLE" || metric.value === null) {
    return durationUnavailableReason(locale, metric.reason, copy.unavailable);
  }
  const hours = metric.value / 3_600_000;
  return hours < 1
    ? `${Math.round(metric.value / 60_000)} ${copy.minute}`
    : `${Math.round(hours * 10) / 10} ${copy.hour}`;
}

export default async function PilotReportPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; missionId: string }>;
}) {
  const { workspaceSlug, missionId } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = reportsCopy[locale];
  let report: Awaited<ReturnType<typeof getPilotMeasurementReport>>;
  try {
    report = await getPilotMeasurementReport(data.ctx, missionId);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const phases = [
    [
      copy.pilot.creationToApproval,
      report.phaseDurations.creationToContractApproval,
    ],
    [copy.pilot.approvalToBuilding, report.phaseDurations.approvalToBuilding],
    [
      copy.pilot.buildingToVerification,
      report.phaseDurations.buildingToVerification,
    ],
    [
      copy.pilot.verificationToRelease,
      report.phaseDurations.verificationToRelease,
    ],
  ] as const;

  return (
    <WorkspaceShell
      data={data}
      title={copy.pilot.title}
      subtitle={`${report.mission.referenceCode} · ${report.mission.title}`}
    >
      <div className="space-y-5">
        <Panel className="p-5">
          <SectionHeader
            title={copy.pilot.eligibility}
            action={
              <StatusBadge
                tone={
                  report.governedThroughputEligibility.eligible
                    ? "success"
                    : "warning"
                }
              >
                {report.governedThroughputEligibility.eligible
                  ? copy.pilot.eligible
                  : copy.pilot.notEligible}
              </StatusBadge>
            }
          />
          <p className="text-body text-ink-muted mt-2">{copy.pilot.rule}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/api/w/${workspaceSlug}/exports/pilot/${missionId}`}
              download
              className="text-meta bg-navy-800 hover:bg-navy-900 inline-flex rounded-md px-3 py-2 font-medium text-white"
            >
              {copy.pilot.download}
            </a>
            <DossierExportControl
              endpoint={`/api/w/${workspaceSlug}/exports/mission/${missionId}`}
              copy={copy.export}
            />
            <Link
              href={`/w/${workspaceSlug}/missions/${missionId}`}
              className="text-meta text-ink-strong inline-flex px-3 py-2 font-medium"
            >
              {copy.pilot.openMission}
            </Link>
          </div>
        </Panel>

        <div className="grid gap-5 min-[900px]:grid-cols-2">
          <Panel className="overflow-hidden">
            <div className="border-line border-b p-5">
              <SectionHeader title={copy.pilot.durations} />
            </div>
            <dl>
              {phases.map(([label, metric]) => (
                <div
                  key={label}
                  className="border-line flex items-start justify-between gap-4 border-b p-4 last:border-b-0"
                >
                  <dt className="text-body text-ink">{label}</dt>
                  <dd className="text-meta text-ink-muted max-w-[55%] text-right tabular">
                    {durationLabel(metric, locale, copy.pilot)}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-line border-b p-5">
              <SectionHeader title={copy.pilot.coverage} />
            </div>
            <dl className="grid grid-cols-2">
              <div className="border-line border-r border-b p-4">
                <dt className="text-meta text-ink-muted">
                  {copy.pilot.requirementsEvidenced}
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.requirements.withEvidence}/
                  {report.coverage.requirements.total}
                </dd>
              </div>
              <div className="border-line border-b p-4">
                <dt className="text-meta text-ink-muted">
                  {copy.pilot.requirementsPassed}
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.requirements.passedVerification}/
                  {report.coverage.requirements.total}
                </dd>
              </div>
              <div className="border-line border-r p-4">
                <dt className="text-meta text-ink-muted">
                  {copy.pilot.accountableDecisions}
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.materialDecisionAccountability.accountable}/
                  {report.coverage.materialDecisionAccountability.total}
                </dd>
              </div>
              <div className="p-4">
                <dt className="text-meta text-ink-muted">
                  {copy.pilot.traceableClaims}
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.releaseClaimProvenance.traceable}/
                  {report.coverage.releaseClaimProvenance.total}
                </dd>
              </div>
            </dl>
          </Panel>
        </div>

        <div className="grid gap-5 min-[900px]:grid-cols-2">
          <Panel className="p-5">
            <SectionHeader title={copy.pilot.rework} />
            <dl className="text-body text-ink mt-4 grid grid-cols-2 gap-3">
              {Object.entries(report.reworkSignals).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-meta text-ink-muted">
                    {reworkLabel(locale, label)}
                  </dt>
                  <dd className="tabular font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel className="p-5">
            <SectionHeader
              title={copy.pilot.unavailableMeasurements}
              action={
                <StatusBadge tone="neutral">
                  {report.unavailableMeasurements.length}
                </StatusBadge>
              }
            />
            <ul className="mt-4 space-y-3">
              {report.unavailableMeasurements.map((item) => {
                const localized = pilotMetricCopy(
                  locale,
                  item.metric,
                  item.reason,
                );
                return (
                  <li key={item.metric}>
                    <p className="text-body text-ink font-medium">
                      {localized.name}
                    </p>
                    <p className="text-meta text-ink-muted">
                      {localized.reason}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <p className="text-meta text-ink-muted break-all">
          SHA-256 {report.integrity.contentHash}
        </p>
      </div>
    </WorkspaceShell>
  );
}
