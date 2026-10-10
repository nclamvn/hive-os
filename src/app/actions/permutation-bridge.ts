"use server";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {resolveWorkspaceContext} from "@/modules/identity-workspace";
import {available,createDraft,getBridgeView,startBridge,reserveBridgeRole,importBridgeRole,checkBridgeFinal,revokeBridge} from "@/modules/permutation-bridge";
import type {Role} from "@/modules/permutation-bridge/contracts";
import {assertNoCredentialMaterial} from "@/modules/execution-fabric/contracts";

function field(form:FormData,name:string) {const v=form.get(name);if(typeof v!=="string"||!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(v))throw new Error("BRIDGE_INPUT_REFUSED");return v;}
function cut(form:FormData) {const runId=field(form,"runId"),expectedSequence=Number(form.get("expectedSequence")),expectedDigest=field(form,"expectedDigest");if(!/^[a-f0-9-]{36}$/.test(runId)||!Number.isSafeInteger(expectedSequence)||expectedSequence<1||!/^[a-f0-9]{64}$/.test(expectedDigest))throw new Error("BRIDGE_CUT_REFUSED");return {runId,expectedSequence,expectedDigest};}
function role(form:FormData):Role {const v=field(form,"role");if(!["ATTEMPT","CRITIC","FINAL","POSTREVIEW"].includes(v))throw new Error("BRIDGE_ROLE_REFUSED");return v as Role;}
function declared(form:FormData,name:string,max:number) {const v=form.get(name);if(v===null||v==="")return null;if(typeof v!=="string"||v.length>max||/[\u0000-\u001f\u007f]/.test(v))throw new Error("BRIDGE_DECLARATION_REFUSED");assertNoCredentialMaterial(v);return v;}
function finish(slug:string,missionId:string,runId:string|null,refused:boolean) {const base=`/w/${slug}/research/permutations`,q=new URLSearchParams({missionId});if(runId)q.set("runId",runId);if(refused)q.set("action","refused");revalidatePath(base);redirect(`${base}?${q}#permutation-bridge`);}
async function context(slug:string) {if(!available())throw new Error("BRIDGE_UNAVAILABLE");return resolveWorkspaceContext(await headers(),slug);}
export async function createPermutationDraftAction(form:FormData) {const slug=field(form,"slug"),missionId=field(form,"missionId");let runId:string|null=null,refused=false;try{const result=await createDraft(await context(slug),{missionId,idempotencyKey:field(form,"idempotencyKey")});runId=result.runId;}catch{refused=true;}finish(slug,missionId,runId,refused);}
async function mutate(form:FormData,operation:"start"|"reserve"|"import"|"check"|"revoke") {
  const slug=field(form,"slug"),missionId=field(form,"missionId");let runId:string|null=null,refused=false;
  try {
    const bound=cut(form);runId=bound.runId;const ctx=await context(slug),view=await getBridgeView(ctx,runId);
    if(view.binding.missionId!==missionId)throw new Error("BRIDGE_MISSION_REFUSED");
    if(operation==="start") {if(!view.liveReady)throw new Error("BRIDGE_NOT_READY");await startBridge(ctx,bound);}
    else if(operation==="reserve") await reserveBridgeRole(ctx,{...bound,role:role(form)});
    else if(operation==="check") await checkBridgeFinal(ctx,bound);
    else if(operation==="revoke") await revokeBridge(ctx,bound);
    else {
      const file=form.get("original");
      if(!(file instanceof File)||!file.name.toLowerCase().endsWith(".txt")||file.size<1||file.size>32768||form.get("freshContextAttested")!=="yes")throw new Error("BRIDGE_IMPORT_REFUSED");
      const bytes=new Uint8Array(await file.arrayBuffer());if(bytes.byteLength!==file.size||bytes.byteLength>32768)throw new Error("BRIDGE_IMPORT_REFUSED");
      await importBridgeRole(ctx,{...bound,role:role(form),bytes,freshContextAttested:true,model:declared(form,"model",160),thread:declared(form,"thread",200)});
    }
  }catch{refused=true;}
  finish(slug,missionId,runId,refused);
}
export async function startPermutationBridgeAction(form:FormData){await mutate(form,"start");}
export async function reservePermutationRoleAction(form:FormData){await mutate(form,"reserve");}
export async function importPermutationRoleAction(form:FormData){await mutate(form,"import");}
export async function checkPermutationFinalAction(form:FormData){await mutate(form,"check");}
export async function revokePermutationBridgeAction(form:FormData){await mutate(form,"revoke");}
