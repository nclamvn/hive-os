import Link from "next/link";

import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { listApprovedReleaseProjections } from "@/modules/verification-governance";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function ObservatoryPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const releases = await listApprovedReleaseProjections(data.ctx);

  return (
    <WorkspaceShell
      data={data}
      title="Observatory"
      subtitle="Governed public records from immutable approved release manifests."
    >
      <Panel className="p-5">
        <p className="text-eyebrow text-navy-700">Publication boundary</p>
        <h2 className="text-page-title text-ink-strong mt-1">
          Public truth begins at the release manifest.
        </h2>
        <p className="text-body text-ink-muted mt-2 max-w-3xl">
          This surface reads only public approved releases whose Mission is
          already released. Internal Truth records are never queried here.
        </p>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="border-line border-b p-5">
          <SectionHeader
            title="Released records"
            action={<StatusBadge tone="neutral">{releases.length} public</StatusBadge>}
          />
        </div>
        {releases.length === 0 ? (
          <EmptyState
            title="No public releases"
            hint="A record appears only after governed public approval and Mission release."
          />
        ) : (
          <ul>
            {releases.map((release) => (
              <li
                key={release.id}
                className="border-line grid grid-cols-1 gap-4 border-b p-5 last:border-b-0 min-[900px]:grid-cols-[minmax(0,1fr)_360px]"
              >
                <span className="min-w-0">
                  <Link
                    href={`/w/${workspaceSlug}/missions/${release.mission.id}?view=release`}
                    className="text-section-title text-ink-strong hover:underline"
                  >
                    {release.mission.title}
                  </Link>
                  <p className="text-meta text-ink-muted tabular mt-1">
                    {release.mission.referenceCode} · approved{" "}
                    {release.approvedAt.toISOString().slice(0, 10)}
                  </p>
                  <p className="text-meta text-ink-muted tabular mt-3 break-all">
                    Manifest {release.manifest?.contentHash}
                  </p>
                </span>
                <dl className="border-line divide-y border-y">
                  <ManifestRow
                    label="Claims"
                    value={arrayLength(release.manifest?.claimVersions)}
                  />
                  <ManifestRow
                    label="Artifacts"
                    value={arrayLength(release.manifest?.artifacts)}
                  />
                  <ManifestRow
                    label="Methods"
                    value={release.manifest?.methods.length ?? 0}
                  />
                  <ManifestRow
                    label="Limitations"
                    value={release.manifest?.limitations.length ?? 0}
                  />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </WorkspaceShell>
  );
}

function ManifestRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="text-meta text-ink-muted">{label}</dt>
      <dd className="text-body text-ink-strong tabular font-semibold">{value}</dd>
    </div>
  );
}

function arrayLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}
