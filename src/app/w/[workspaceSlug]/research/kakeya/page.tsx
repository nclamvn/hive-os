import {notFound} from "next/navigation";
import {WorkspaceShell} from "@/components/shell/workspace-shell";
import {KakeyaDossier} from "@/components/research/kakeya-dossier";
import {getTranslator} from "@/i18n/server";
import {hasCapability} from "@/modules/identity-workspace";
import {authorize,organizationIdForWorkspace} from "@/modules/authorization";
import {loadWorkspacePage} from "@/server/auth/workspace-page";
import {getEnv} from "@/server/env";
import {loadKakeyaPackage} from "@/server/kakeya-dossier";

export const dynamic="force-dynamic";
export default async function KakeyaPage({params}:{params:Promise<{workspaceSlug:string}>}) {
  const {workspaceSlug}=await params,data=await loadWorkspacePage(workspaceSlug),env=getEnv();
  if(!["development","test"].includes(env.NODE_ENV)||(env.DEPLOYMENT_ENV&&! ["development","test"].includes(env.DEPLOYMENT_ENV))||!hasCapability(data.ctx.membership.role,"research.read"))notFound();
  const organizationId=await organizationIdForWorkspace(data.ctx.workspace.id);
  if(!(await authorize(data.ctx.user.id,"research.read",{organizationId,workspaceId:data.ctx.workspace.id})).allowed)notFound();
  const {locale}=await getTranslator();
  return <WorkspaceShell data={data} title={locale==="vi"?"Hồ sơ Kakeya · năm tam giác":"Kakeya dossier · five triangles"} subtitle={locale==="vi"?"Kết quả lưu trữ · chứng minh có hỗ trợ máy tính":"Retained result · computer-assisted proof"}>
    <KakeyaDossier workspaceSlug={workspaceSlug} evidence={await loadKakeyaPackage()}/>
  </WorkspaceShell>;
}
