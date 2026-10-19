import {headers} from "next/headers";
import {resolveWorkspaceContext,hasCapability,UnauthenticatedError,NotFoundError} from "@/modules/identity-workspace";
import {authorize,organizationIdForWorkspace} from "@/modules/authorization";
import {getEnv} from "@/server/env";
import {readKakeyaFile} from "@/server/kakeya-dossier";

export const runtime="nodejs";
export async function GET(_request:Request,{params}:{params:Promise<{workspaceSlug:string;fileId:string}>}) {
  const headersOut={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
  try {
    const {workspaceSlug,fileId}=await params;
    const ctx=await resolveWorkspaceContext(await headers(),workspaceSlug),env=getEnv();
    if(!["development","test"].includes(env.NODE_ENV)||(env.DEPLOYMENT_ENV&&! ["development","test"].includes(env.DEPLOYMENT_ENV)))return Response.json({error:"NOT_FOUND"},{status:404,headers:headersOut});
    const organizationId=await organizationIdForWorkspace(ctx.workspace.id);
    if(!hasCapability(ctx.membership.role,"research.read")||!(await authorize(ctx.user.id,"research.read",{organizationId,workspaceId:ctx.workspace.id})).allowed)return Response.json({error:"NOT_FOUND"},{status:404,headers:headersOut});
    const {file,bytes}=await readKakeyaFile(fileId),name=file.path.split("/").pop()!;
    return new Response(new Uint8Array(bytes),{headers:{...headersOut,"Content-Type":name.endsWith(".json")?"application/json; charset=utf-8":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="${name}"`,"X-Hive-Provenance":"RETAINED_OFFLINE_K5","X-Hive-SHA256":file.sha}});
  } catch(error) {
    const status=error instanceof UnauthenticatedError?401:error instanceof NotFoundError?404:error instanceof Error&&error.message==="K5_FILE_UNAVAILABLE"?404:503;
    return Response.json({error:"K5_FILE_UNAVAILABLE"},{status,headers:headersOut});
  }
}
