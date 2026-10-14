import { notFound } from "next/navigation";

import { MissionIntakeForm } from "@/components/mission/mission-intake-form";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import {
  getWorkspacePolicy,
  hasCapability,
} from "@/modules/identity-workspace";
import { createMissionAction } from "@/app/actions/missions";
import { getMissionTemplate } from "@/modules/mission-templates";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getTranslator } from "@/i18n/server";
import { localizeMissionTemplate } from "@/i18n/template-copy";

export const dynamic = "force-dynamic";

export default async function NewMissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { workspaceSlug } = await params;
  const { template: templateKey } = await searchParams;
  const catalogTemplate = getMissionTemplate(templateKey);
  const data = await loadWorkspacePage(workspaceSlug);
  const { locale, t } = await getTranslator();
  const template = catalogTemplate
    ? localizeMissionTemplate(catalogTemplate, locale)
    : undefined;
  if (!hasCapability(data.ctx.membership.role, "missions.create")) notFound();
  const policy = await getWorkspacePolicy(data.ctx);

  return (
    <WorkspaceShell
      data={data}
      title={t("mission.new.title")}
      subtitle={data.ctx.workspace.name}
    >
      <Panel
        data-testid="bounded-page-panel"
        className="mx-auto w-full max-w-5xl p-[var(--shell-card-padding)]"
      >
        <SectionHeader title={t("mission.new.define")} />
        <p className="text-meta text-ink-muted mt-1">
          {template
            ? t("mission.new.templatePrefill", {
                template: template.name,
                version: template.version,
              })
            : locale === "vi" ? "Bắt đầu bằng đề bài, phạm vi và kết quả bạn cần. Chi tiết tổ chức được điền thành bản nháp có thể chỉnh sửa bên dưới." : "Start with your question, scope, and desired result. Supporting details become an editable draft below."}
        </p>
        <MissionIntakeForm workspaceSlug={workspaceSlug} locale={locale} template={template} defaultProfile={policy.defaultAssuranceProfile} action={createMissionAction} />
      </Panel>
    </WorkspaceShell>
  );
}
