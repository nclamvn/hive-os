import { EvidenceForms } from "@/components/truth/truth-forms";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getTruthOperationsProjection } from "@/server/truth-operations";

export const dynamic = "force-dynamic";

export default async function EvidencePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const truth = await getTruthOperationsProjection(data.ctx);

  const missions = truth.missions.map((mission) => ({
    id: mission.id,
    label: `${mission.referenceCode} · ${mission.title}`,
  }));
  const sources = truth.sources.map((source) => ({
    id: source.id,
    label: `${source.mission.referenceCode} · ${source.title}`,
  }));
  const snapshots = truth.sources.flatMap((source) =>
    source.snapshots.map((snapshot) => ({
      id: snapshot.id,
      label: `${source.title} · ${snapshot.contentHash.slice(0, 10)}`,
    })),
  );

  return (
    <WorkspaceShell
      data={data}
      title="Evidence Hub"
      subtitle="Immutable sources, snapshots and exact retained spans."
    >
      <section className="border-line bg-surface rounded-panel border p-5">
        <p className="text-eyebrow text-navy-700">Evidence authority</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-page-title text-ink-strong">
              Preserve before interpreting.
            </h2>
            <p className="text-body text-ink-muted mt-1 max-w-3xl">
              Every quote is anchored to immutable captured content and an
              explicit source-independence identity.
            </p>
          </div>
          <dl className="text-meta text-ink-muted flex gap-5">
            <div>
              <dt>Sources</dt>
              <dd className="text-section-title text-ink-strong tabular">
                {truth.sources.length}
              </dd>
            </div>
            <div>
              <dt>Snapshots</dt>
              <dd className="text-section-title text-ink-strong tabular">
                {snapshots.length}
              </dd>
            </div>
            <div>
              <dt>Spans</dt>
              <dd className="text-section-title text-ink-strong tabular">
                {truth.sources.reduce(
                  (total, source) =>
                    total +
                    source.snapshots.reduce(
                      (count, snapshot) => count + snapshot.spans.length,
                      0,
                    ),
                  0,
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {truth.permissions.canWrite ? (
        missions.length ? (
          <EvidenceForms
            slug={workspaceSlug}
            missions={missions}
            sources={sources}
            snapshots={snapshots}
          />
        ) : (
          <section className="border-line bg-surface rounded-panel border p-6 text-center">
            <h2 className="text-section-title text-ink-strong">
              Approve a Mission before retaining evidence
            </h2>
            <p className="text-body text-ink-muted mt-1">
              Truth records require a Mission in APPROVED or EXPLORING.
            </p>
          </section>
        )
      ) : (
        <p className="text-body text-ink-muted border-line rounded-md border p-4">
          Your role has read-only access to governed evidence.
        </p>
      )}

      <section className="border-line bg-surface rounded-panel overflow-hidden border">
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-section-title text-ink-strong">Retained evidence ledger</h2>
          <span className="text-meta text-ink-muted">Newest source first</span>
        </div>
        {truth.sources.length ? (
          <ul className="divide-line divide-y">
            {truth.sources.map((source) => (
              <li key={source.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body text-ink-strong font-medium">{source.title}</p>
                    <p className="text-meta text-ink-muted break-all">{source.canonicalUri}</p>
                    <p className="text-meta text-ink-muted mt-1">
                      {source.mission.referenceCode} · independence {source.independenceKey}
                    </p>
                  </div>
                  <span className="text-meta border-line rounded border px-2 py-1">
                    {source.accessLevel.toLowerCase()}
                  </span>
                </div>
                {source.snapshots.map((snapshot) => (
                  <div key={snapshot.id} className="border-line mt-3 border-l pl-4">
                    <p className="text-meta text-ink-muted tabular">
                      SHA-256 {snapshot.contentHash}
                    </p>
                    {snapshot.spans.map((span) => (
                      <blockquote
                        key={span.id}
                        className="text-body text-ink mt-2 border-l-2 border-navy-700 pl-3"
                      >
                        “{span.exactText}”
                      </blockquote>
                    ))}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-section-title text-ink-strong">No retained evidence</p>
            <p className="text-body text-ink-muted mt-1">
              Register a source to begin the immutable evidence chain.
            </p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
