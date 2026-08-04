import Link from "next/link";

import { DossierExportControl } from "@/components/exports/dossier-export-control";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getReportsProjection } from "@/server/reports";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const projection = await getReportsProjection(data.ctx);

  return (
    <WorkspaceShell
      data={data}
      title="Reports"
      subtitle="Retained Verify Reports and governed release bundles."
    >
      <div className="grid grid-cols-1 gap-5 min-[1100px]:grid-cols-2">
        <Panel className="overflow-hidden min-[1100px]:col-span-2">
          <div className="border-line border-b p-5">
            <SectionHeader
              title="Pilot dossiers"
              action={
                <StatusBadge tone="neutral">
                  {projection.missions.length}
                </StatusBadge>
              }
            />
            <p className="text-meta text-ink-muted mt-1">
              Complete governed record and ledger-derived pilot measurement for
              each mission.
            </p>
          </div>
          {projection.missions.length === 0 ? (
            <EmptyState
              title="No mission dossiers"
              hint="Create a Mission to begin the pilot record."
            />
          ) : (
            <ul>
              {projection.missions.map((mission) => (
                <li
                  key={mission.id}
                  className="border-line flex flex-wrap items-center justify-between gap-4 border-b p-5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/w/${workspaceSlug}/missions/${mission.id}`}
                      className="text-body text-ink-strong block truncate font-semibold hover:underline"
                    >
                      {mission.title}
                    </Link>
                    <p className="text-meta text-ink-muted tabular mt-1">
                      {mission.referenceCode} ·{" "}
                      {mission.assuranceProfile.toLowerCase()} ·{" "}
                      {mission.status.toLowerCase()}
                    </p>
                  </div>
                  <span className="flex flex-wrap gap-2">
                    <Link
                      href={`/w/${workspaceSlug}/reports/pilot/${mission.id}`}
                      className="text-meta text-ink-strong hover:text-navy-700 inline-flex px-2.5 py-1.5 font-medium"
                    >
                      View pilot report
                    </Link>
                    <DossierExportControl
                      compact
                      endpoint={`/api/w/${workspaceSlug}/exports/mission/${mission.id}`}
                    />
                    <a
                      href={`/api/w/${workspaceSlug}/exports/pilot/${mission.id}`}
                      download
                      className="text-meta text-navy-700 border-line hover:border-line-strong inline-flex rounded-md border px-2.5 py-1.5 font-medium"
                    >
                      Pilot measurement
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-line border-b p-5">
            <SectionHeader
              title="Verify Reports"
              action={
                <StatusBadge tone="neutral">
                  {projection.reports.length}
                </StatusBadge>
              }
            />
          </div>
          {projection.reports.length === 0 ? (
            <EmptyState
              title="No Verify Reports"
              hint="Completed governed verification appears here."
            />
          ) : (
            <ul>
              {projection.reports.map((report) => (
                <li
                  key={report.id}
                  className="border-line border-b p-5 last:border-b-0"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/w/${workspaceSlug}/missions/${report.mission.id}?view=verify`}
                      className="text-body text-ink-strong font-semibold hover:underline"
                    >
                      {report.mission.title}
                    </Link>
                    <StatusBadge
                      tone={
                        report.overallStatus === "READY"
                          ? "success"
                          : report.overallStatus === "NOT_READY"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {report.overallStatus.toLowerCase().replaceAll("_", " ")}
                    </StatusBadge>
                  </span>
                  <p className="text-meta text-ink-muted tabular mt-2">
                    {report.mission.referenceCode} ·{" "}
                    {report.verificationRun.independenceStatus
                      .toLowerCase()
                      .replaceAll("_", " ")}{" "}
                    · {report.contentHash.slice(0, 16)}
                  </p>
                  <a
                    href={`/api/w/${workspaceSlug}/exports/verification/${report.id}`}
                    download
                    className="text-meta text-navy-700 border-line hover:border-line-strong mt-3 inline-flex rounded-md border px-2.5 py-1.5 font-medium"
                  >
                    Download Verify Report
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-line border-b p-5">
            <SectionHeader
              title="Release bundles"
              action={
                <StatusBadge tone="neutral">
                  {projection.releases.length}
                </StatusBadge>
              }
            />
          </div>
          {projection.releases.length === 0 ? (
            <EmptyState
              title="No release bundles"
              hint="Approved immutable manifests appear here."
            />
          ) : (
            <ul>
              {projection.releases.map((release) => (
                <li
                  key={release.id}
                  className="border-line border-b p-5 last:border-b-0"
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/w/${workspaceSlug}/missions/${release.mission.id}?view=release`}
                      className="text-body text-ink-strong font-semibold hover:underline"
                    >
                      {release.mission.title}
                    </Link>
                    <StatusBadge tone="success">
                      {release.visibility.toLowerCase()}
                    </StatusBadge>
                  </span>
                  <p className="text-meta text-ink-muted tabular mt-2 break-all">
                    {release.manifest?.contentHash || "Manifest unavailable"}
                  </p>
                  <p className="text-meta text-ink-muted mt-2">
                    {release.manifest?.methods.length ?? 0} methods ·{" "}
                    {release.manifest?.limitations.length ?? 0} limitations ·{" "}
                    {release.manifest?.approverMembershipIds.length ?? 0} approvers
                  </p>
                  {release.manifest ? (
                    <a
                      href={`/api/w/${workspaceSlug}/exports/release/${release.id}`}
                      download
                      className="text-meta text-navy-700 border-line hover:border-line-strong mt-3 inline-flex rounded-md border px-2.5 py-1.5 font-medium"
                    >
                      Download release manifest
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </WorkspaceShell>
  );
}
