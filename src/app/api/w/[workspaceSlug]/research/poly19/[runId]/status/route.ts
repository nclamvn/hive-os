import { headers } from "next/headers";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { getPoly19Showcase,isShowcaseAvailable } from "@/modules/research-showcase";
import { projectPoly19Showcase } from "@/components/research/poly19-showcase-presentation";
import { showcaseErrorResponse,showcaseRunId } from "@/server/research-showcase-response";

export async function GET(_request:Request,{params}:{params:Promise<{workspaceSlug:string;runId:string}>}) {
  try {
    const {workspaceSlug,runId}=await params;
    const ctx=await resolveWorkspaceContext(await headers(),workspaceSlug);
    if(!isShowcaseAvailable()) return Response.json({available:false,nativeBlockedReason:"CONTAINMENT_UNESTABLISHED"},{status:503,headers:{"Cache-Control":"private, no-store"}});
    const v=projectPoly19Showcase(await getPoly19Showcase(ctx,showcaseRunId(runId)));
    return Response.json({available:true,nativeBlockedReason:"CONTAINMENT_UNESTABLISHED",runId:v.runId,missionId:v.missionId,provenance:v.provenance,status:v.status,version:v.version,stages:v.stages,eventCut:v.eventCut,reservedRequests:v.reservedRequests,exact:v.exact,informalStatus:v.informalStatus,fault:v.fault,nextAction:v.nextAction},{headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
  } catch(error) {return showcaseErrorResponse(error);}
}
