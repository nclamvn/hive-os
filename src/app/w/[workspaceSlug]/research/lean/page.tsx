import {notFound,redirect} from "next/navigation";
import {WorkspaceShell} from "@/components/shell/workspace-shell";
import {LeanResearchWorkbench} from "@/components/research/lean-research-workbench";
import {getTranslator} from "@/i18n/server";
import {hasCapability} from "@/modules/identity-workspace";
import {authorize,organizationIdForWorkspace} from "@/modules/authorization";
import {loadWorkspacePage} from "@/server/auth/workspace-page";
import {getEnv} from "@/server/env";
import {listDomainAdapters} from "@/modules/research-sandbox/research-core-v3";

export const dynamic="force-dynamic";
export default async function LeanResearchPage({params,searchParams}:{params:Promise<{workspaceSlug:string}>;searchParams:Promise<{advanced?:string}>}){
  const {workspaceSlug}=await params,data=await loadWorkspacePage(workspaceSlug),env=getEnv();
  if(!["development","test"].includes(env.NODE_ENV)||(env.DEPLOYMENT_ENV&&!["development","test"].includes(env.DEPLOYMENT_ENV))||!hasCapability(data.ctx.membership.role,"research.read")||!hasCapability(data.ctx.membership.role,"research.request"))notFound();
  const organizationId=await organizationIdForWorkspace(data.ctx.workspace.id);
  for(const capability of ["research.read","research.request"] as const)if(!(await authorize(data.ctx.user.id,capability,{organizationId,workspaceId:data.ctx.workspace.id})).allowed)notFound();
  if((await searchParams).advanced!=="1")redirect(`/w/${workspaceSlug}/research`);
  const {locale}=await getTranslator(),vi=locale==="vi";
  return <WorkspaceShell data={data} title={vi?"Bàn tiếp nhận đầu ra AI thủ công":"Manual AI-output workbench"} subtitle={vi?"Nhập đầu ra mô hình và kiểm tra theo phạm vi, không phải trình chứng minh Lean":"Import model output for scoped checks, not the Lean proof assistant"}>
    <LeanResearchWorkbench key={`${data.ctx.user.id}:${data.ctx.workspace.id}`} workspaceSlug={workspaceSlug} draftScope={{userId:data.ctx.user.id,workspaceId:data.ctx.workspace.id}} locale={locale} adapters={listDomainAdapters().map(a=>({id:a.id,inputSchema:a.inputSchema,candidateSchema:a.candidateSchema}))}/>
  </WorkspaceShell>;
}
