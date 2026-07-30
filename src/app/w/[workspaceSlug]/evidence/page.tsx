import { EvidenceForms } from "@/components/truth/truth-forms";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { ProvenanceRail } from "@/components/ui/provenance-rail";
import { getLocale } from "@/i18n/server";
import { enumLabel, formatNumber } from "@/i18n/format";
import { truthCopy } from "@/i18n/truth-copy";
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
  const locale = await getLocale();
  const copy = truthCopy[locale];
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
      title={copy.evidence.pageTitle}
      subtitle={copy.evidence.pageSubtitle}
    >
      <section className="instrument-panel overflow-hidden">
        <div className="p-5 min-[760px]:p-7">
          <p className="text-eyebrow text-blue-600">
            {copy.evidence.authority}
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-sans text-ink-strong mt-2 text-[clamp(1.7rem,3vw,3rem)] leading-[1.05] tracking-[-0.035em]">
                {copy.evidence.thesis}
              </h2>
              <p className="text-body text-ink-muted mt-1 max-w-3xl">
                {copy.evidence.thesisHint}
              </p>
            </div>
            <dl className="text-meta text-ink-muted flex gap-5">
              <div>
                <dt>{copy.evidence.sources}</dt>
                <dd className="text-section-title text-ink-strong tabular">
                  {formatNumber(locale, truth.sources.length)}
                </dd>
              </div>
              <div>
                <dt>{copy.evidence.snapshots}</dt>
                <dd className="text-section-title text-ink-strong tabular">
                  {formatNumber(locale, snapshots.length)}
                </dd>
              </div>
              <div>
                <dt>{copy.evidence.spans}</dt>
                <dd className="text-section-title text-ink-strong tabular">
                  {formatNumber(
                    locale,
                    truth.sources.reduce(
                      (total, source) =>
                        total +
                        source.snapshots.reduce(
                          (count, snapshot) => count + snapshot.spans.length,
                          0,
                        ),
                      0,
                    ),
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <ProvenanceRail active={1} />
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
          <section className="instrument-panel p-6 text-center">
            <h2 className="text-section-title text-ink-strong">
              {copy.evidence.missionRequired}
            </h2>
            <p className="text-body text-ink-muted mt-1">
              {copy.evidence.missionRequiredHint}
            </p>
          </section>
        )
      ) : (
        <p className="text-body text-ink-muted border-line rounded-md border p-4">
          {copy.evidence.readOnly}
        </p>
      )}

      <section className="instrument-panel overflow-hidden">
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-section-title text-ink-strong">
            {copy.evidence.ledger}
          </h2>
          <span className="text-meta text-ink-muted">
            {copy.evidence.newest}
          </span>
        </div>
        {truth.sources.length ? (
          <ul className="divide-line divide-y">
            {truth.sources.map((source) => (
              <li key={source.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body text-ink-strong font-medium">
                      {source.title}
                    </p>
                    <p className="text-meta text-ink-muted break-all">
                      {source.canonicalUri}
                    </p>
                    <p className="text-meta text-ink-muted mt-1">
                      {source.mission.referenceCode} ·{" "}
                      {copy.evidence.independence} {source.independenceKey}
                    </p>
                  </div>
                  <span className="text-meta border-line rounded border px-2 py-1">
                    {enumLabel(locale, source.accessLevel)}
                  </span>
                </div>
                {source.snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="border-line mt-3 border-l pl-4"
                  >
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
            <p className="text-section-title text-ink-strong">
              {copy.evidence.empty}
            </p>
            <p className="text-body text-ink-muted mt-1">
              {copy.evidence.emptyHint}
            </p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
