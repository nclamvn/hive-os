import { Boxes, ShieldCheck } from "lucide-react";

import { WorkspaceShell } from "@/components/shell/workspace-shell";
import {
  RegisterSkillForm,
  SkillGovernanceForms,
} from "@/components/skills/skill-forms";
import { Panel } from "@/components/ui/panel";
import { skillsCopy, skillValueLabel } from "@/i18n/skills-copy";
import { getLocale } from "@/i18n/server";
import { hasCapability } from "@/modules/identity-workspace";
import { listSkills } from "@/modules/skill-runtime";
import { loadWorkspacePage } from "@/server/auth/workspace-page";

export const dynamic = "force-dynamic";

export default async function SkillLibraryPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const locale = await getLocale();
  const copy = skillsCopy[locale];
  const skills = await listSkills(data.ctx);
  const canManage = hasCapability(data.ctx.membership.role, "skills.manage");
  const active = skills.filter((skill) => skill.status === "ACTIVE").length;

  return (
    <WorkspaceShell
      data={data}
      title={copy.page.title}
      subtitle={copy.page.subtitle}
    >
      <div className="space-y-5">
        <Panel className="p-[var(--shell-card-padding)]">
          <p className="text-eyebrow text-navy-700">{copy.page.eyebrow}</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h2 className="text-page-title text-ink-strong">
                {copy.page.heading}
              </h2>
              <p className="text-body text-ink-muted mt-2">
                {copy.page.description}
              </p>
            </div>
            <dl className="text-meta text-ink-muted flex gap-5">
              <div>
                <dt>{copy.page.registered}</dt>
                <dd className="text-section-title text-ink-strong tabular">
                  {skills.length}
                </dd>
              </div>
              <div>
                <dt>{copy.page.active}</dt>
                <dd className="text-section-title text-ink-strong tabular">
                  {active}
                </dd>
              </div>
            </dl>
          </div>
        </Panel>

        {canManage ? (
          <details className="border-line bg-surface rounded-panel border p-5">
            <summary className="text-section-title text-ink-strong cursor-pointer font-semibold">
              {copy.page.registerTitle}
            </summary>
            <p className="text-body text-ink-muted mt-2 mb-5 max-w-3xl">
              {copy.page.registerHint}
            </p>
            <RegisterSkillForm
              slug={workspaceSlug}
              locale={locale}
              copy={copy.form}
            />
          </details>
        ) : (
          <p className="text-body text-ink-muted border-line rounded-md border p-4">
            {copy.page.readOnlyNotice}
          </p>
        )}

        <section aria-labelledby="registry-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2
              id="registry-title"
              className="text-section-title text-ink-strong"
            >
              {copy.page.registry}
            </h2>
            <span className="text-meta text-ink-muted">
              {copy.page.stableOrder}
            </span>
          </div>

          {skills.length ? (
            <div className="space-y-4">
              {skills.map((skill) => {
                const version = skill.activeVersion;
                const estimate = version.resourceEstimate as {
                  maxDurationSeconds?: number;
                  maxMemoryMb?: number;
                };
                const verifier = version.verifierBinding as {
                  kind?: string;
                  verifierKey?: string;
                };
                return (
                  <Panel key={skill.id} className="overflow-hidden">
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="border-line bg-surface-subtle text-navy-700 flex size-10 shrink-0 items-center justify-center rounded-md border">
                            <Boxes aria-hidden="true" className="size-5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-meta text-ink-muted font-mono">
                              {skill.skillKey}
                            </p>
                            <h3 className="text-section-title text-ink-strong font-semibold">
                              {skill.displayName}
                            </h3>
                            <p className="text-body text-ink-muted mt-1 max-w-3xl">
                              {skill.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="border-line text-meta rounded-md border px-2 py-1">
                            {skillValueLabel(locale, skill.status)}
                          </span>
                          <span className="bg-success-50 text-success-700 text-meta rounded-md px-2 py-1 font-medium">
                            {copy.page.activeVersion}
                            {version.semanticVersion}
                          </span>
                        </div>
                      </div>

                      <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <dt className="text-meta text-ink-muted">
                            {copy.page.capabilities}
                          </dt>
                          <dd className="text-body text-ink mt-1 break-words">
                            {version.capabilities.join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-meta text-ink-muted">
                            {copy.page.assurance}
                          </dt>
                          <dd className="text-body text-ink mt-1">
                            {version.assuranceCompatibility
                              .map((profile) =>
                                skillValueLabel(locale, profile),
                              )
                              .join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-meta text-ink-muted">
                            {copy.page.verifier}
                          </dt>
                          <dd className="text-body text-ink mt-1">
                            {verifier.kind
                              ? skillValueLabel(locale, verifier.kind)
                              : null}{" "}
                            · {verifier.verifierKey}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-meta text-ink-muted">
                            {copy.page.resourceCeiling}
                          </dt>
                          <dd className="text-body text-ink mt-1">
                            {estimate.maxDurationSeconds}s ·{" "}
                            {estimate.maxMemoryMb} MB
                          </dd>
                        </div>
                      </dl>

                      <div className="border-line mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                        <p className="text-meta text-ink-muted font-mono break-all">
                          SHA-256 {version.contentHash}
                        </p>
                        <p className="text-meta text-ink-muted">
                          {skill._count.versions}{" "}
                          {skill._count.versions === 1
                            ? copy.page.immutableVersion
                            : copy.page.immutableVersions}
                        </p>
                      </div>
                    </div>

                    {canManage ? (
                      <details className="border-line bg-surface-subtle border-t px-5 py-4">
                        <summary className="text-body text-ink-strong cursor-pointer font-semibold">
                          {copy.page.governance}
                        </summary>
                        <div className="mt-5">
                          <SkillGovernanceForms
                            slug={workspaceSlug}
                            skillId={skill.id}
                            skillKey={skill.skillKey}
                            version={skill.version}
                            status={skill.status}
                            activeVersionId={skill.activeVersionId}
                            versions={skill.versions ?? [skill.activeVersion]}
                            locale={locale}
                            copy={copy.form}
                          />
                        </div>
                      </details>
                    ) : (
                      <div className="border-line text-meta text-ink-muted flex items-center gap-2 border-t px-5 py-4">
                        <ShieldCheck aria-hidden="true" className="size-4" />
                        {copy.page.governedReadOnly}
                      </div>
                    )}
                  </Panel>
                );
              })}
            </div>
          ) : (
            <Panel className="p-8 text-center">
              <p className="text-section-title text-ink-strong">
                {copy.page.empty}
              </p>
              <p className="text-body text-ink-muted mt-1">
                {canManage ? copy.page.emptyManager : copy.page.emptyViewer}
              </p>
            </Panel>
          )}
        </section>
      </div>
    </WorkspaceShell>
  );
}
