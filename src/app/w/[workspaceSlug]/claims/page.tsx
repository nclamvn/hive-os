import { ClaimForms } from "@/components/truth/truth-forms";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { ProvenanceRail } from "@/components/ui/provenance-rail";
import { enumLabel, formatNumber } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { truthCopy } from "@/i18n/truth-copy";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getTruthOperationsProjection } from "@/server/truth-operations";

export const dynamic = "force-dynamic";

export default async function ClaimsPage({
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
  const spans = truth.sources.flatMap((source) =>
    source.snapshots.flatMap((snapshot) =>
      snapshot.spans.map((span) => ({
        id: span.id,
        label: `${source.title} · ${span.exactText.slice(0, 72)}`,
      })),
    ),
  );
  const claims = truth.claims.map((claim) => ({
    id: claim.id,
    label: `${claim.claimKey} · ${claim.versions[0]?.statement ?? copy.claims.noAssertion}`,
  }));

  return (
    <WorkspaceShell
      data={data}
      title={copy.claims.pageTitle}
      subtitle={copy.claims.pageSubtitle}
    >
      <section className="instrument-panel overflow-hidden">
        <div className="p-5 min-[760px]:p-7">
          <p className="text-eyebrow text-blue-600">{copy.claims.authority}</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-ink-strong mt-2 text-[clamp(1.7rem,3vw,3rem)] leading-[1.05] tracking-[-0.035em]">
                {copy.claims.thesis}
              </h2>
              <p className="text-body text-ink-muted mt-1 max-w-3xl">
                {copy.claims.thesisHint}
              </p>
            </div>
            <p className="text-meta text-ink-muted">
              {formatNumber(locale, truth.claims.length)}{" "}
              {copy.claims.countClaims} ·{" "}
              {formatNumber(locale, truth.provenanceCount)}{" "}
              {copy.claims.provenanceEdges}
            </p>
          </div>
        </div>
        <ProvenanceRail active={1} />
      </section>

      {truth.permissions.canWrite ? (
        missions.length ? (
          <ClaimForms
            slug={workspaceSlug}
            missions={missions}
            spans={spans}
            claims={claims}
            canReview={truth.permissions.canReview}
          />
        ) : (
          <p className="text-body text-ink-muted border-line rounded-md border p-4">
            {copy.claims.missionRequired}
          </p>
        )
      ) : (
        <p className="text-body text-ink-muted border-line rounded-md border p-4">
          {copy.claims.readOnly}
        </p>
      )}

      <section className="instrument-panel overflow-hidden">
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-section-title text-ink-strong">
            {copy.claims.ledger}
          </h2>
          <span className="text-meta text-ink-muted">{copy.claims.latest}</span>
        </div>
        {truth.claims.length ? (
          <ul className="divide-line divide-y">
            {truth.claims.map((claim) => (
              <li key={claim.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-eyebrow text-ink-muted">
                      {claim.claimKey}
                    </p>
                    <h3 className="text-body text-ink-strong mt-1 font-medium">
                      {claim.versions[0]?.statement}
                    </h3>
                    <p className="text-meta text-ink-muted mt-1">
                      {claim.mission.referenceCode} ·{" "}
                      {formatNumber(locale, claim.versions.length)}{" "}
                      {claim.versions.length === 1
                        ? copy.claims.version
                        : copy.claims.versions}{" "}
                      · {enumLabel(locale, claim.accessLevel)}
                    </p>
                  </div>
                  <span
                    className={`text-meta rounded border px-2 py-1 font-medium ${
                      claim.state === "DISPUTED"
                        ? "border-warning-600/30 bg-warning-50 text-warning-600"
                        : "border-line bg-surface-subtle text-ink"
                    }`}
                  >
                    {enumLabel(locale, claim.state)}
                  </span>
                </div>
                {claim.versions[0]?.evidence.map((link) => (
                  <blockquote
                    key={link.id}
                    className="text-meta text-ink mt-3 border-l-2 border-navy-700 pl-3"
                  >
                    {enumLabel(locale, link.relation)} · “
                    {link.evidenceSpan.exactText}”
                    <span className="text-ink-muted mt-1 block">
                      {link.evidenceSpan.snapshot.evidenceSource.title}
                    </span>
                  </blockquote>
                ))}
                {claim.disputes.map((dispute) => (
                  <p
                    key={dispute.id}
                    className="text-meta text-warning-600 bg-warning-50 mt-3 rounded-md px-3 py-2"
                  >
                    {copy.claims.dispute}: {dispute.reason}
                  </p>
                ))}
                {claim.honestNulls.map((record) => (
                  <p
                    key={record.id}
                    className="text-meta text-ink-muted mt-3 border-l-2 border-line-strong pl-3"
                  >
                    {copy.claims.honestNull} ·{" "}
                    {enumLabel(locale, record.searchCompleteness)}:{" "}
                    {record.rationale}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-section-title text-ink-strong">
              {copy.claims.empty}
            </p>
            <p className="text-body text-ink-muted mt-1">
              {copy.claims.emptyHint}
            </p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
