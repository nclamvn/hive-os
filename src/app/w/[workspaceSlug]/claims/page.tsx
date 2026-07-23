import { ClaimForms } from "@/components/truth/truth-forms";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
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
    label: `${claim.claimKey} · ${claim.versions[0]?.statement ?? "No assertion"}`,
  }));

  return (
    <WorkspaceShell
      data={data}
      title="Claims & Insights"
      subtitle="Versioned assertions, retained conflict and human review."
    >
      <section className="border-line bg-surface rounded-panel border p-5">
        <p className="text-eyebrow text-navy-700">Assertion ledger</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-page-title text-ink-strong">
              Every conclusion carries its evidence ceiling.
            </h2>
            <p className="text-body text-ink-muted mt-1 max-w-3xl">
              New assertions append versions. Contradictions stay visible and
              never silently choose a winner.
            </p>
          </div>
          <p className="text-meta text-ink-muted">
            {truth.claims.length} claims · {truth.provenanceCount} provenance edges
          </p>
        </div>
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
            Approve a Mission before creating claims.
          </p>
        )
      ) : (
        <p className="text-body text-ink-muted border-line rounded-md border p-4">
          Your role has read-only access to governed claims.
        </p>
      )}

      <section className="border-line bg-surface rounded-panel overflow-hidden border">
        <div className="border-line flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-section-title text-ink-strong">Claim ledger</h2>
          <span className="text-meta text-ink-muted">Latest assertion first</span>
        </div>
        {truth.claims.length ? (
          <ul className="divide-line divide-y">
            {truth.claims.map((claim) => (
              <li key={claim.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-eyebrow text-ink-muted">{claim.claimKey}</p>
                    <h3 className="text-body text-ink-strong mt-1 font-medium">
                      {claim.versions[0]?.statement}
                    </h3>
                    <p className="text-meta text-ink-muted mt-1">
                      {claim.mission.referenceCode} · {claim.versions.length} version
                      {claim.versions.length === 1 ? "" : "s"} · {claim.accessLevel.toLowerCase()}
                    </p>
                  </div>
                  <span
                    className={`text-meta rounded border px-2 py-1 font-medium ${
                      claim.state === "DISPUTED"
                        ? "border-warning-600/30 bg-warning-50 text-warning-600"
                        : "border-line bg-surface-subtle text-ink"
                    }`}
                  >
                    {claim.state.toLowerCase().replaceAll("_", " ")}
                  </span>
                </div>
                {claim.versions[0]?.evidence.map((link) => (
                  <blockquote
                    key={link.id}
                    className="text-meta text-ink mt-3 border-l-2 border-navy-700 pl-3"
                  >
                    {link.relation.toLowerCase()} · “{link.evidenceSpan.exactText}”
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
                    Dispute retained: {dispute.reason}
                  </p>
                ))}
                {claim.honestNulls.map((record) => (
                  <p
                    key={record.id}
                    className="text-meta text-ink-muted mt-3 border-l-2 border-line-strong pl-3"
                  >
                    Honest null · {record.searchCompleteness}: {record.rationale}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-section-title text-ink-strong">No governed claims</p>
            <p className="text-body text-ink-muted mt-1">
              Create an assertion from retained evidence or an explicit hypothesis.
            </p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
