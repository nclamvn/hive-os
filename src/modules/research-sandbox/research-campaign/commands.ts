import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { organizationIdForWorkspace, requireWorkspaceAuthorization } from "@/modules/authorization";
import { executeDurableCommand, CommandEffectError } from "@/modules/command-runtime";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { withOrganizationTenant } from "@/server/tenant-context";
import { prepareProblemContract,applicableDomainMethods } from "../research-core-v3";
import { boundedJson } from "../research-core-v3/bounded-json";
import { campaignEnvelopeSchema, campaignJobType, CampaignRefusal, zeroResources } from "./contracts";
import { appendCampaignEvent, campaignDigest, initialCampaignState, loadCampaignView, lockCampaign, reserveResources } from "./ledger";
import { assertControlledCampaignEnvironment, campaignSourceScanReservation, loadInstalledCampaignBundle } from "./source-bundle";

const requestSchema = z.object({ idempotencyKey:z.string().min(1).max(200),missionId:z.string().min(1).max(200),
  contract:z.unknown(),envelope:campaignEnvelopeSchema }).strict();
/** One authenticated engineering campaign approval, not a blueprint/live-model grant. */
export async function requestResearchCampaign(ctx: WorkspaceContext, raw: unknown) {
  assertControlledCampaignEnvironment();
  const input = requestSchema.parse(boundedJson(raw,262144,256));
  await requireWorkspaceAuthorization(ctx,"research.request",input.missionId);
  const prepared = prepareProblemContract(input.contract);
  if (prepared.contract.obligations.length !== 1 || input.envelope.methods.length < input.envelope.stop.maxRounds || new Date(input.envelope.stop.deadlineAt).getTime() <= Date.now()) throw new CampaignRefusal("AUTHORITY","Campaign requires one exact obligation and complete bounded method envelope");
  const applicable=applicableDomainMethods(prepared,prepared.contract.obligations[0].id);
  if(new Set(input.envelope.methods).size!==input.envelope.methods.length || input.envelope.methods.some(id=>!applicable.some(card=>card.id===id))) throw new CampaignRefusal("AUTHORITY","Campaign method cards must apply to the exact admitted obligation");
  // Bounded intake bootstrap occurs before a campaign exists. Successful
  // admission permanently charges the full conservative scan reservation;
  // refusal before admission has no campaign ledger debit and is disclosed as
  // outside-ledger preflight cost, never asserted zero/free.
  const bundle = await loadInstalledCampaignBundle();
  if (!bundle.checkerSourceDigests[prepared.contract.domain.adapterId]) throw new CampaignRefusal("INTEGRITY","Campaign checker is not independently reviewed");
  const envelopeDigest = campaignDigest(input.envelope);
  const admission = { ...zeroResources(),...campaignSourceScanReservation,writeBytes:65536 };
  reserveResources(initialCampaignState(input.envelope),input.envelope,admission);
  return executeDurableCommand(ctx,{ commandType:"research.campaign.v3.approve",idempotencyKey:input.idempotencyKey,
    requiredCapability:"research.request",missionId:input.missionId,
    // The shared command boundary rejects secret-bearing key names such as
    // "tokens". Canonical digests bind the full retained typed envelope without
    // weakening that legacy boundary or embedding resource objects in payloads.
    payload:{missionId:input.missionId,contractDigest:prepared.contractDigest,envelopeDigest,sourceBundleDigest:bundle.sourceBundleDigest} },async (tx,command) => {
    const mission = await tx.mission.findFirst({where:{id:input.missionId,workspaceId:command.workspaceId}});
    if (!mission) throw new CommandEffectError("NOT_FOUND","Campaign mission not found");
    const id=randomUUID(),authorityEpoch=randomUUID();
    const state=initialCampaignState(input.envelope);
    let row=await tx.researchCampaign.create({data:{id,organizationId:command.organizationId,workspaceId:command.workspaceId,
      missionId:input.missionId,commandId:command.commandId,contract:prepared.contract as unknown as Prisma.InputJsonObject,
      contractDigest:prepared.contractDigest,envelope:input.envelope as unknown as Prisma.InputJsonObject,envelopeDigest,
      sourceBundleDigest:bundle.sourceBundleDigest,authorityEpoch,state:state as unknown as Prisma.InputJsonObject,stateDigest:campaignDigest(state)}});
    row=await appendCampaignEvent(tx,row,"APPROVED",`${id}:approved`,{resources:admission,contractDigest:prepared.contractDigest,
      envelopeDigest,sourceBundleDigest:bundle.sourceBundleDigest,authorityEpoch,evaluation:input.envelope.evaluation ?? null,
      sourcePreflight:bundle.sourcePreflight,
      actorUserId:command.actorUserId,actorMembershipId:command.actorOrganizationMembershipId,purpose:"LOCAL_ENGINEERING_ONLY"});
    return {outcome:{campaignId:id,version:row.version},outbox:[{topic:campaignJobType,aggregateType:"ResearchCampaign",aggregateId:id,
      payload:{campaignId:id,round:1,authorityEpoch}}]};
  });
}
export async function getResearchCampaign(ctx: WorkspaceContext, id: string) {
  await requireWorkspaceAuthorization(ctx,"research.read");
  const organizationId=await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId,ctx.user.id,async tx => {
    const row=await tx.researchCampaign.findFirst({where:{id,organizationId,workspaceId:ctx.workspace.id}});
    if (!row) throw new CampaignRefusal("AUTHORITY","Campaign not found in workspace");
    return loadCampaignView(tx,row);
  });
}
export async function listResearchCampaigns(ctx: WorkspaceContext) {
  await requireWorkspaceAuthorization(ctx,"research.read");
  const organizationId=await organizationIdForWorkspace(ctx.workspace.id);
  return withOrganizationTenant(organizationId,ctx.user.id,async tx => {
    const rows=await tx.researchCampaign.findMany({where:{organizationId,workspaceId:ctx.workspace.id},orderBy:[{createdAt:"desc"},{id:"desc"}],take:20});
    return Promise.all(rows.map(row=>loadCampaignView(tx,row)));
  });
}
export async function revokeResearchCampaign(ctx: WorkspaceContext, input:{id:string;idempotencyKey:string;expectedVersion:number}) {
  await requireWorkspaceAuthorization(ctx,"research.review");
  return executeDurableCommand(ctx,{commandType:"research.campaign.v3.revoke",idempotencyKey:input.idempotencyKey,
    requiredCapability:"research.review",expectedVersion:input.expectedVersion,payload:{campaignId:input.id,expectedVersion:input.expectedVersion}},async(tx,command)=>{
    const row=await lockCampaign(tx,command.organizationId,input.id);
    if(row.workspaceId!==command.workspaceId || row.version!==input.expectedVersion || row.revokedAt) throw new CommandEffectError("STALE_VERSION","Campaign revocation changed");
    const updated=await appendCampaignEvent(tx,row,"REVOKED",`${row.id}:revoked`,{actorUserId:command.actorUserId,taxonomy:"AUTHORITY_REVOCATION"},null,new Date());
    return {outcome:{campaignId:row.id,version:updated.version},outbox:[{topic:"research.campaign.v3.revoked",aggregateType:"ResearchCampaign",aggregateId:row.id,payload:{campaignId:row.id}}]};
  });
}
