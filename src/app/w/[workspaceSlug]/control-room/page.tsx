import { ControlRoom } from "@/components/control-room/control-room";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getControlRoomProjection } from "@/server/control-room";
import { getTranslator } from "@/i18n/server";

export const dynamic = "force-dynamic";

export default async function ControlRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceSlug: string }>;
  searchParams: Promise<{ find?: string }>;
}) {
  const { workspaceSlug } = await params;
  const { find } = await searchParams;
  const data = await loadWorkspacePage(workspaceSlug);
  const { t } = await getTranslator();
  const projection = await getControlRoomProjection(data.ctx);

  return (
    <WorkspaceShell
      data={data}
      title={t("control.title")}
      subtitle={t("control.subtitle")}
    >
      <ControlRoom
        projection={projection}
        basePath={`/w/${workspaceSlug}`}
        initialCommandOpen={find === "1"}
      />
    </WorkspaceShell>
  );
}
