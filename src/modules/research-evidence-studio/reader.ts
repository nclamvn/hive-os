import "server-only";
import {available,BridgeRefusal,exportBridge,getBridgeView} from "@/modules/permutation-bridge";
import type {WorkspaceContext} from "@/modules/identity-workspace";
import {digest} from "@/modules/permutation-bridge/contracts";
import {projectStudio,type StudioQuery,type StudioResult} from "./presentation";

/** Both existing readers retain current-source, actor, mission, tenant and QA-environment guards. */
export async function loadStudio(ctx:WorkspaceContext,query:StudioQuery):Promise<StudioResult> {
  if(query.status!=="selected")return {status:query.status};
  if(!available())return {status:"unavailable"};
  try {
    const current=await getBridgeView(ctx,query.runId);
    if(current.binding.workspaceId!==ctx.workspace.id||current.binding.actorUserId!==ctx.user.id||current.binding.missionId!==query.missionId)return {status:"out-of-scope"};
    const body=await exportBridge(ctx,query.runId),model=projectStudio(body,query.missionId);
    if(current.events.at(-1)?.eventDigest!==model.events.at(-1)?.digest||digest(current.checker)!==digest(model.checker))return {status:"corrupt"};
    return {status:"ready",model};
  } catch(error) {
    if(error instanceof BridgeRefusal&&(error.code==="AUTHORITY"||error.code==="INPUT"))return {status:"out-of-scope"};
    if(error instanceof BridgeRefusal&&error.code==="SOURCE")return {status:"unavailable"};
    // Unknown refusals expose neither record existence nor private error details.
    return {status:"corrupt"};
  }
}
