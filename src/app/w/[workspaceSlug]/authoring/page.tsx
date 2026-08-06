import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FilePenLine, ShieldCheck } from "lucide-react";

import { createAuthoringDocumentAction } from "@/app/actions/authoring";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { getAuthoringCopy } from "@/i18n/authoring-copy";
import { getTranslator } from "@/i18n/server";
import {
  AUTHORING_DOCUMENT_TYPES,
  listAuthoringDocuments,
  listAuthoringMissions,
} from "@/modules/authoring";
import { hasCapability } from "@/modules/identity-workspace";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

function qualityTone(status: "PASS" | "REVIEW" | "FAIL") {
  if (status === "PASS") return "text-emerald-700 dark:text-emerald-300";
  if (status === "FAIL") return "text-red-700 dark:text-red-300";
  return "text-amber-700 dark:text-amber-300";
}
export default async function AuthoringPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ missionId?: string }>;
}) {
  const [{ workspaceSlug }, query] = await Promise.all([params, searchParams]);
  const data = await loadWorkspacePage(workspaceSlug);
  const { locale } = await getTranslator();
  const copy = getAuthoringCopy(locale);
  if (!hasCapability(data.ctx.membership.role, "authoring.read")) notFound();
  const [documents, missions] = await Promise.all([
    listAuthoringDocuments(data.ctx),
    listAuthoringMissions(data.ctx),
  ]);
  const canWrite = hasCapability(data.ctx.membership.role, "authoring.write");
  const selectedMissionId = missions.some(
    (mission) => mission.id === query.missionId,
  )
    ? query.missionId
    : undefined;

  return (
    <WorkspaceShell data={data} title={copy.title} subtitle={copy.subtitle}>
      <Panel className="overflow-hidden">
        <div className="grid gap-6 p-5 min-[960px]:grid-cols-[minmax(0,1fr)_360px] min-[960px]:p-7">
          <div className="min-w-0">
            <p className="text-eyebrow text-ink-muted">{copy.eyebrow}</p>
            <h1 className="text-thesis text-ink-strong mt-3 max-w-4xl">
              {copy.thesis}
            </h1>
            <p className="text-body text-ink-muted mt-4 max-w-3xl">
              {copy.hint}
            </p>
            <div className="border-line mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4">
              <span className="text-meta text-ink-muted inline-flex items-center gap-2">
                <FilePenLine className="size-4" aria-hidden="true" />
                {documents.length} {copy.library.toLowerCase()}
              </span>
              <span className="text-meta text-ink-muted inline-flex items-center gap-2">
                <ShieldCheck className="size-4" aria-hidden="true" />
                {locale === "vi" ? "Revision bất biến" : "Immutable revisions"}
              </span>
            </div>
          </div>

          {canWrite ? (
            <form
              action={createAuthoringDocumentAction}
              className="border-line bg-surface-subtle rounded-lg border p-4"
            >
              <input type="hidden" name="slug" value={workspaceSlug} />
              <input type="hidden" name="locale" value={locale} />
              <SectionHeader title={copy.newDocument} />
              {missions.length ? (
                <>
                  <label className="text-meta text-ink mt-4 block font-medium" htmlFor="authoring-title">
                    {copy.documentTitle}
                  </label>
                  <input
                    id="authoring-title"
                    name="title"
                    required
                    maxLength={300}
                    className="text-body text-ink border-line mt-1 h-10 w-full rounded-md border bg-surface px-3 outline-none focus:border-line-strong"
                  />
                  <label className="text-meta text-ink mt-3 block font-medium" htmlFor="authoring-mission">
                    {copy.mission}
                  </label>
                  <select
                    id="authoring-mission"
                    name="missionId"
                    defaultValue={selectedMissionId}
                    className="text-body text-ink border-line mt-1 h-10 w-full rounded-md border bg-surface px-3"
                  >
                    {missions.map((mission) => (
                      <option key={mission.id} value={mission.id}>
                        {mission.referenceCode} · {mission.title}
                      </option>
                    ))}
                  </select>
                  <label className="text-meta text-ink mt-3 block font-medium" htmlFor="authoring-type">
                    {copy.documentType}
                  </label>
                  <select
                    id="authoring-type"
                    name="documentType"
                    className="text-body text-ink border-line mt-1 h-10 w-full rounded-md border bg-surface px-3"
                  >
                    {AUTHORING_DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {copy.types[type]}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="primary" className="mt-4 w-full">
                    {copy.create}
                  </Button>
                </>
              ) : (
                <p className="text-body text-ink-muted mt-3">{copy.noMission}</p>
              )}
            </form>
          ) : null}
        </div>
      </Panel>

      <section aria-labelledby="authoring-library">
        <SectionHeader id="authoring-library" title={copy.library} />
        {documents.length ? (
          <div className="mt-3 grid gap-3 min-[860px]:grid-cols-2 min-[1440px]:grid-cols-3">
            {documents.map((document) => (
              <Link
                key={document.id}
                href={`/w/${workspaceSlug}/authoring/${document.id}`}
                className="group border-line hover:border-line-strong bg-surface flex min-h-48 flex-col rounded-lg border p-5 transition-[border-color,transform] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-eyebrow text-ink-muted">
                    {copy.types[document.documentType]}
                  </p>
                  <span className="text-meta text-ink-muted tabular">
                    v{document.currentRevisionNumber}
                  </span>
                </div>
                <h2 className="text-section-title text-ink-strong mt-3">
                  {document.title}
                </h2>
                <p className="text-meta text-ink-muted mt-2">
                  {document.mission.referenceCode} · {document.mission.title}
                </p>
                <div className="border-line mt-auto flex items-end justify-between gap-3 border-t pt-4">
                  <span className={`text-meta font-medium ${document.quality ? qualityTone(document.quality.status) : "text-ink-muted"}`}>
                    {document.quality
                      ? `${document.quality.score}/100 · ${document.quality.blockerCount} ${copy.blockers}`
                      : copy.quality}
                  </span>
                  <ArrowRight className="text-ink-muted size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Panel className="mt-3 flex min-h-56 items-center justify-center p-6 text-center">
            <div>
              <p className="text-section-title text-ink">{copy.empty}</p>
              <p className="text-body text-ink-muted mt-2">{copy.emptyHint}</p>
            </div>
          </Panel>
        )}
      </section>
    </WorkspaceShell>
  );
}
