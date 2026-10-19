import Link from "next/link";

import {
  ActiveMissions,
  type MissionRow,
} from "@/components/dashboard/active-missions";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { hasCapability } from "@/modules/identity-workspace";
import { listMissions } from "@/modules/mission-kernel";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getTranslator } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const data = await loadWorkspacePage(workspaceSlug);
  const { t } = await getTranslator();
  const basePath = `/w/${workspaceSlug}`;

  const missions = await listMissions(data.ctx);
  const rows: MissionRow[] = missions.map((m) => ({
    id: m.id,
    referenceCode: m.referenceCode,
    title: m.title,
    status: m.status,
    assuranceProfile: m.assuranceProfile,
    updatedAt: m.updatedAt.toISOString(),
  }));
  const canCreate = hasCapability(data.ctx.membership.role, "missions.create");

  return (
    <WorkspaceShell
      data={data}
      title={t("mission.list.title")}
      subtitle={data.ctx.workspace.name}
    >
      {canCreate ? (
        <div className="flex justify-end">
          <Link
            href={`${basePath}/missions/new`}
            className="text-body bg-navy-800 hover:bg-navy-900 inline-flex h-10 items-center rounded-md px-4 font-medium text-white"
          >
            {t("mission.new.title")}
          </Link>
        </div>
      ) : null}
      <ActiveMissions missions={rows} basePath={basePath} />
    </WorkspaceShell>
  );
}
