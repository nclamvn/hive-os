import Link from "next/link";

import { ArrowRight, ClipboardCheck } from "lucide-react";

import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Panel } from "@/components/ui/panel";
import { MISSION_TEMPLATES } from "@/modules/mission-templates";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);

  return (
    <WorkspaceShell
      data={data}
      title="Templates"
      subtitle="Governed starting points for Mission contracts."
    >
      <div className="space-y-5">
        <Panel className="p-[var(--shell-card-padding)]">
          <p className="text-eyebrow text-navy-700 font-semibold uppercase tracking-[0.12em]">
            Contract catalog
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-page-title text-ink-strong font-semibold tracking-[-0.035em]">
                Start governed. Stay editable.
              </h2>
              <p className="text-body text-ink-muted mt-2 max-w-2xl">
                Templates provide deterministic draft language and assurance
                defaults. They never approve a contract or bypass review.
              </p>
            </div>
            <p className="text-meta text-ink-muted">
              {MISSION_TEMPLATES.length} built-in templates · catalog v1
            </p>
          </div>
        </Panel>

        <section aria-labelledby="template-catalog-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="template-catalog-title" className="text-section text-ink font-semibold">
              Mission contract templates
            </h2>
            <span className="text-meta text-ink-muted">Application-versioned</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {MISSION_TEMPLATES.map((template) => (
              <Panel key={template.key} className="flex min-w-0 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="border-line bg-surface-subtle text-navy-700 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border">
                      <ClipboardCheck aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-eyebrow text-ink-muted font-semibold uppercase tracking-[0.1em]">
                        {template.domain}
                      </p>
                      <h3 className="text-section text-ink mt-1 font-semibold">
                        {template.name}
                      </h3>
                    </div>
                  </div>
                  <span className="border-line text-meta text-ink-muted shrink-0 rounded-md border px-2 py-1">
                    {template.assuranceProfile}
                  </span>
                </div>
                <p className="text-body text-ink-muted mt-4 flex-1">
                  {template.description}
                </p>
                <div className="border-line mt-5 border-t pt-4">
                  <p className="text-meta text-ink-muted">
                    v{template.version} · 1 requirement · 1 weighted obligation
                  </p>
                  <Link
                    href={`/w/${workspaceSlug}/missions/new?template=${template.key}`}
                    aria-label={`Use ${template.name} template`}
                    className="text-body text-navy-700 mt-3 inline-flex min-h-11 items-center gap-2 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    Use this template
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
