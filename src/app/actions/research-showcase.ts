"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { isShowcaseAvailable,requestPoly19Showcase,revokePoly19Showcase } from "@/modules/research-showcase";

function field(form:FormData,name:string) {
  const value=form.get(name);
  if(typeof value!=="string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,199}$/.test(value)) throw new Error("SHOWCASE_INPUT_REFUSED");
  return value;
}
function finish(slug:string,missionId:string,runId:string|null,refused:boolean) {
  const base=`/w/${slug}/research/poly19`,query=new URLSearchParams({missionId});
  if(runId) query.set("runId",runId);
  if(refused) query.set("action","refused");
  revalidatePath(base);revalidatePath(`/w/${slug}/research/math-pilot`);revalidatePath(`/w/${slug}/research`);
  redirect(`${base}?${query}#poly19-showcase`);
}
export async function requestNativePoly19Action(form:FormData) {
  const slug=field(form,"slug"),missionId=field(form,"missionId");
  // This release has no established complete no-tools boundary. Never enqueue
  // even a forged/direct POST; render-time disabled controls are not authority.
  try { await resolveWorkspaceContext(await headers(),slug); } catch { /* safe refusal */ }
  finish(slug,missionId,null,true);
}
export async function requestEngineeringPoly19Action(form:FormData) {
  const slug=field(form,"slug"),missionId=field(form,"missionId"),idempotencyKey=field(form,"idempotencyKey");
  let runId:string|null=null,refused=false;
  try {
    if(!isShowcaseAvailable() || form.get("confirmed")!=="yes") throw new Error("SHOWCASE_ENVIRONMENT_OR_CONFIRMATION_REFUSED");
    const ctx=await resolveWorkspaceContext(await headers(),slug);
    const outcome=await requestPoly19Showcase(ctx,{missionId,idempotencyKey,confirmed:true,provenance:"ENGINEERING_ONLY"});
    if(outcome.status!=="SUCCEEDED" || typeof outcome.runId!=="string") throw new Error("SHOWCASE_COMMAND_REFUSED");
    runId=outcome.runId;
  } catch {refused=true;}
  finish(slug,missionId,runId,refused);
}
export async function revokePoly19Action(form:FormData) {
  const slug=field(form,"slug"),missionId=field(form,"missionId"),runId=field(form,"runId"),idempotencyKey=field(form,"idempotencyKey");
  let refused=false;
  try {
    if(!isShowcaseAvailable()) throw new Error("SHOWCASE_ENVIRONMENT_REFUSED");
    const version=Number(form.get("expectedVersion"));
    if(!Number.isSafeInteger(version)||version<1) throw new Error("SHOWCASE_VERSION_REFUSED");
    const ctx=await resolveWorkspaceContext(await headers(),slug);
    const outcome=await revokePoly19Showcase(ctx,{runId,expectedVersion:version,idempotencyKey});
    if(outcome.status!=="SUCCEEDED" || outcome.outcome.runId!==runId) throw new Error("SHOWCASE_COMMAND_REFUSED");
  } catch {refused=true;}
  finish(slug,missionId,runId,refused);
}
