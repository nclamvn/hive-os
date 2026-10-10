"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { resolveWorkspaceContext } from "@/modules/identity-workspace";
import { revokeResearchCampaign } from "@/modules/research-sandbox/research-campaign";
import { assertControlledCampaignEnvironment } from "@/modules/research-sandbox/research-campaign/source-bundle";
import { runControlledUiCampaign } from "@/server/operations/research-campaign-ui-control";

function field(form:FormData,name:string,max=200) {
  const raw=form.get(name);
  if(typeof raw!=="string" || raw.length<1 || raw.length>max || !/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(raw)) throw new Error("CONTROL_INPUT_REFUSED");
  return raw;
}
export async function runControlledResearchCampaignAction(form:FormData) {
  const slug=field(form,"slug"),missionId=field(form,"missionId"),profileId=field(form,"profileId"),idempotencyKey=field(form,"idempotencyKey");
  const base=`/w/${slug}/research/math-pilot`,query=new URLSearchParams({missionId});
  let campaignId:string|null=null;
  try {
    assertControlledCampaignEnvironment();
    const ctx=await resolveWorkspaceContext(await headers(),slug);
    campaignId=(await runControlledUiCampaign(ctx,{missionId,profileId,idempotencyKey})).campaignId;
  } catch { query.set("campaignAction","refused"); }
  if(campaignId) query.set("campaignId",campaignId);
  revalidatePath(base);revalidatePath(`/w/${slug}/research`);
  redirect(`${base}?${query}#research-campaign-v3`);
}
export async function revokeResearchCampaignAction(form:FormData) {
  const slug=field(form,"slug"),id=field(form,"campaignId"),idempotencyKey=field(form,"idempotencyKey"),missionId=field(form,"missionId");
  const version=Number(form.get("expectedVersion")),base=`/w/${slug}/research/math-pilot`;
  const query=new URLSearchParams({missionId,campaignId:id});
  try {
    assertControlledCampaignEnvironment();
    if(!Number.isSafeInteger(version) || version<1) throw new Error("CONTROL_VERSION_REFUSED");
    const ctx=await resolveWorkspaceContext(await headers(),slug);
    await revokeResearchCampaign(ctx,{id,expectedVersion:version,idempotencyKey});
  } catch { query.set("campaignAction","refused"); }
  revalidatePath(base);revalidatePath(`/w/${slug}/research`);
  redirect(`${base}?${query}#research-campaign-v3`);
}
