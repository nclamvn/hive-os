"use server";
import {headers} from "next/headers";
import {hasCapability,resolveWorkspaceContext} from "@/modules/identity-workspace";
import {authorize,organizationIdForWorkspace} from "@/modules/authorization";
import {getEnv} from "@/server/env";
import {runLeanManualBridge,type LeanManualObservation} from "@/modules/research-sandbox/lean-manual-bridge";
import {replayDirectedResearchSimulation,type DirectedSimulationObservation} from "@/modules/research-sandbox/directed-research";

export type LeanActionReply={ok:true;observation:LeanManualObservation}|{ok:false;code:"UNAVAILABLE"|"INVALID_INPUT"};
export type DirectedSimulationReply={ok:true;observation:DirectedSimulationObservation}|{ok:false;code:"UNAVAILABLE"|"INVALID_INPUT"};
/** Every POST resolves current tenant/auth; this action does no DB mutation. */
export async function evaluateLeanResearchAction(slug:unknown,input:unknown):Promise<LeanActionReply>{
  if(!await localWorkbenchAuthorized(slug))return {ok:false,code:"UNAVAILABLE"};
  try{return {ok:true,observation:await runLeanManualBridge(input)};}
  catch{return {ok:false,code:"INVALID_INPUT"};}
}

/** Replays scripted outputs, not a model or durable research run. */
export async function simulateDirectedResearchAction(slug:unknown,input:unknown):Promise<DirectedSimulationReply>{
  if(!await localWorkbenchAuthorized(slug))return {ok:false,code:"UNAVAILABLE"};
  try{return {ok:true,observation:await replayDirectedResearchSimulation(input)};}
  catch{return {ok:false,code:"INVALID_INPUT"};}
}

async function localWorkbenchAuthorized(slug:unknown){
  try{
    const env=getEnv();
    if(!["development","test"].includes(env.NODE_ENV)||(env.DEPLOYMENT_ENV&&!["development","test"].includes(env.DEPLOYMENT_ENV))||typeof slug!=="string"||!/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug))return false;
    const ctx=await resolveWorkspaceContext(await headers(),slug);
    if(!hasCapability(ctx.membership.role,"research.read")||!hasCapability(ctx.membership.role,"research.request"))return false;
    const organizationId=await organizationIdForWorkspace(ctx.workspace.id);
    for(const capability of ["research.read","research.request"] as const)if(!(await authorize(ctx.user.id,capability,{organizationId,workspaceId:ctx.workspace.id})).allowed)return false;
    return true;
  }catch{return false;}
}
