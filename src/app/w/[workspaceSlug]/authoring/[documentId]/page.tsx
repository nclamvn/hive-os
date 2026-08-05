import { notFound } from "next/navigation";

import { AuthoringWorkspace } from "@/components/authoring/authoring-workspace";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { getAuthoringCopy } from "@/i18n/authoring-copy";
import { getLocale } from "@/i18n/server";
import {
  AuthoringError,
  getAuthoringDocument,
  type AuthoringDocumentType,
} from "@/modules/authoring";
import { hasCapability } from "@/modules/identity-workspace";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function AuthoringDocumentPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; documentId: string }>;
}) {
  const { workspaceSlug, documentId } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = getAuthoringCopy(locale);
  if (!hasCapability(data.ctx.membership.role, "authoring.read")) notFound();

  let document;
  try {
    document = await getAuthoringDocument(data.ctx, documentId);
  } catch (error) {
    if (error instanceof AuthoringError && error.code === "AUTHORING_NOT_FOUND") {
      notFound();
    }
    throw error;
  }
  if (!document.current) notFound();

  const canWrite = hasCapability(data.ctx.membership.role, "authoring.write");
  const canExport = hasCapability(data.ctx.membership.role, "authoring.export");
  const current = document.current;

  return (
    <WorkspaceShell
      data={data}
      title={current.content.title}
      subtitle={`${document.mission.referenceCode} · ${document.mission.title}`}
    >
      <AuthoringWorkspace
        key={current.revisionNumber}
        slug={workspaceSlug}
        documentId={document.id}
        documentType={document.documentType as AuthoringDocumentType}
        documentKey={document.documentKey}
        status={document.status}
        revisionNumber={current.revisionNumber}
        content={current.content}
        revisions={document.revisions.map((revision) => ({
          id: revision.id,
          revisionNumber: revision.revisionNumber,
          changeSummary: revision.changeSummary,
          createdAt: revision.createdAt.toISOString(),
          quality: revision.quality,
        }))}
        evidenceSources={document.evidenceSources.map((source) => ({
          ...source,
          snapshots: source.snapshots.map((snapshot) => ({
            contentHash: snapshot.contentHash,
            capturedAt: snapshot.capturedAt.toISOString(),
          })),
        }))}
        diffSections={document.diff?.sections ?? []}
        changedSectionCount={
          document.diff?.sections.filter((section) => section.status !== "UNCHANGED")
            .length ?? 0
        }
        copy={copy}
        locale={locale}
        canWrite={canWrite}
        canExport={canExport}
      />
    </WorkspaceShell>
  );
}
