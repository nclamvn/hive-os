import Link from "next/link";
import { notFound } from "next/navigation";

import { DossierExportControl } from "@/components/exports/dossier-export-control";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { NotFoundError } from "@/modules/identity-workspace";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getPilotMeasurementReport } from "@/server/pilot-measurement";

export const dynamic = "force-dynamic";

function durationLabel(metric: {
  status: string;
  value: number | null;
  reason: string | null;
}) {
  if (metric.status !== "AVAILABLE" || metric.value === null) {
    return metric.reason || "Unavailable";
  }
  const hours = metric.value / 3_600_000;
  return hours < 1
    ? `${Math.round(metric.value / 60_000)} min`
    : `${Math.round(hours * 10) / 10} h`;
}

export default async function PilotReportPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; missionId: string }>;
}) {
  const { workspaceSlug, missionId } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  let report: Awaited<ReturnType<typeof getPilotMeasurementReport>>;
  try {
    report = await getPilotMeasurementReport(data.ctx, missionId);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const phases = [
    ["Creation → approval", report.phaseDurations.creationToContractApproval],
    ["Approval → building", report.phaseDurations.approvalToBuilding],
    ["Building → verification", report.phaseDurations.buildingToVerification],
    ["Verification → release", report.phaseDurations.verificationToRelease],
  ] as const;

  return (
    <WorkspaceShell
      data={data}
      title="Pilot measurement"
      subtitle={`${report.mission.referenceCode} · ${report.mission.title}`}
    >
      <div className="space-y-5">
        <Panel className="p-5">
          <SectionHeader
            title="Governed throughput eligibility"
            action={
              <StatusBadge
                tone={
                  report.governedThroughputEligibility.eligible
                    ? "success"
                    : "warning"
                }
              >
                {report.governedThroughputEligibility.eligible
                  ? "eligible"
                  : "not yet eligible"}
              </StatusBadge>
            }
          />
          <p className="text-body text-ink-muted mt-2">
            {report.governedThroughputEligibility.rule}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/api/w/${workspaceSlug}/exports/pilot/${missionId}`}
              download
              className="text-meta bg-navy-800 hover:bg-navy-900 inline-flex rounded-md px-3 py-2 font-medium text-white"
            >
              Download measurement JSON
            </a>
            <DossierExportControl
              endpoint={`/api/w/${workspaceSlug}/exports/mission/${missionId}`}
            />
            <Link
              href={`/w/${workspaceSlug}/missions/${missionId}`}
              className="text-meta text-ink-strong inline-flex px-3 py-2 font-medium"
            >
              Open mission
            </Link>
          </div>
        </Panel>

        <div className="grid gap-5 min-[900px]:grid-cols-2">
          <Panel className="overflow-hidden">
            <div className="border-line border-b p-5">
              <SectionHeader title="Phase durations" />
            </div>
            <dl>
              {phases.map(([label, metric]) => (
                <div
                  key={label}
                  className="border-line flex items-start justify-between gap-4 border-b p-4 last:border-b-0"
                >
                  <dt className="text-body text-ink">{label}</dt>
                  <dd className="text-meta text-ink-muted max-w-[55%] text-right tabular">
                    {durationLabel(metric)}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-line border-b p-5">
              <SectionHeader title="Coverage and accountability" />
            </div>
            <dl className="grid grid-cols-2">
              <div className="border-line border-r border-b p-4">
                <dt className="text-meta text-ink-muted">
                  Requirements evidenced
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.requirements.withEvidence}/
                  {report.coverage.requirements.total}
                </dd>
              </div>
              <div className="border-line border-b p-4">
                <dt className="text-meta text-ink-muted">
                  Requirements passed
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.requirements.passedVerification}/
                  {report.coverage.requirements.total}
                </dd>
              </div>
              <div className="border-line border-r p-4">
                <dt className="text-meta text-ink-muted">
                  Accountable decisions
                </dt>
                <dd className="text-section-title text-ink-strong tabular mt-1">
                  {report.coverage.materialDecisionAccountability.accountable}/
                  {report.coverage.materialDecisionAccountability.total}
                </dd>
              </div>
              <div className="p-4">
                <dt className="text-meta text-ink-muted">
                  Traceable release claims
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
            <SectionHeader title="Retained rework signals" />
            <dl className="text-body text-ink mt-4 grid grid-cols-2 gap-3">
              {Object.entries(report.reworkSignals).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-meta text-ink-muted">
                    {label.replaceAll(/([A-Z])/g, " $1").toLowerCase()}
                  </dt>
                  <dd className="tabular font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel className="p-5">
            <SectionHeader
              title="Unavailable measurements"
              action={
                <StatusBadge tone="neutral">
                  {report.unavailableMeasurements.length}
                </StatusBadge>
              }
            />
            <ul className="mt-4 space-y-3">
              {report.unavailableMeasurements.map((item) => (
                <li key={item.metric}>
                  <p className="text-body text-ink font-medium">
                    {item.metric}
                  </p>
                  <p className="text-meta text-ink-muted">{item.reason}</p>
                </li>
              ))}
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
