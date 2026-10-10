"use server";
import {headers} from "next/headers";
import {hasCapability,resolveWorkspaceContext} from "@/modules/identity-workspace";
import {authorize,organizationIdForWorkspace} from "@/modules/authorization";
import {getEnv} from "@/server/env";
import {runLeanManualBridge,type LeanManualObservation} from "@/modules/research-sandbox/lean-manual-bridge";

export type LeanActionReply={ok:true;observation:LeanManualObservation}|{ok:false;code:"UNAVAILABLE"|"INVALID_INPUT"};
/** Every POST resolves current tenant/auth; this action does no DB mutation. */
export async function evaluateLeanResearchAction(slug:unknown,input:unknown):Promise<LeanActionReply>{
  try{
    const env=getEnv();
    if(!["development","test"].includes(env.NODE_ENV)||(env.DEPLOYMENT_ENV&&!["development","test"].includes(env.DEPLOYMENT_ENV))||typeof slug!=="string"||!/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug))return {ok:false,code:"UNAVAILABLE"};
    const ctx=await resolveWorkspaceContext(await headers(),slug);
    if(!hasCapability(ctx.membership.role,"research.read")||!hasCapability(ctx.membership.role,"research.request"))return {ok:false,code:"UNAVAILABLE"};
    const organizationId=await organizationIdForWorkspace(ctx.workspace.id);
    for(const capability of ["research.read","research.request"] as const)if(!(await authorize(ctx.user.id,capability,{organizationId,workspaceId:ctx.workspace.id})).allowed)return {ok:false,code:"UNAVAILABLE"};
  }catch{return {ok:false,code:"UNAVAILABLE"};}
  try{return {ok:true,observation:await runLeanManualBridge(input)};}
  catch{return {ok:false,code:"INVALID_INPUT"};}
}
