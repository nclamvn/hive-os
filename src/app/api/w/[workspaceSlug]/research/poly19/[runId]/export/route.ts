import { headers } from "next/headers";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { getPoly19Showcase,getPoly19ShowcaseDossier,isShowcaseAvailable } from "@/modules/research-showcase";
import { poly19Export } from "@/components/research/poly19-showcase-presentation";
import { showcaseErrorResponse,showcaseRunId } from "@/server/research-showcase-response";

export async function GET(request:Request,{params}:{params:Promise<{workspaceSlug:string;runId:string}>}) {
  try {
    const {workspaceSlug,runId:raw}=await params,runId=showcaseRunId(raw);
    const ctx=await resolveWorkspaceContext(await headers(),workspaceSlug);
    if(!isShowcaseAvailable()) return Response.json({available:false},{status:503,headers:{"Cache-Control":"private, no-store"}});
    const format=new URL(request.url).searchParams.get("format")??"json";
    if(format!=="json" && format!=="text") return Response.json({error:"SHOWCASE_FORMAT_REFUSED"},{status:400,headers:{"Cache-Control":"private, no-store"}});
    const dossier=format==="json"?await getPoly19ShowcaseDossier(ctx,runId):null;
    const view=dossier?.view??await getPoly19Showcase(ctx,runId);
    const exported=poly19Export(view,format,dossier??undefined);
    return new Response(exported.body,{headers:{"Content-Type":exported.type,"Content-Disposition":`attachment; filename="poly19-${view.provenance}-${runId}.${exported.extension}"`,"X-Hive-Provenance":view.provenance,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
  } catch(error) {return showcaseErrorResponse(error);}
}
