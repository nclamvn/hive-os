import { randomUUID } from "node:crypto";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { organizationIdForWorkspace, requireWorkspaceAuthorization } from "@/modules/authorization";
import type { WorkspaceContext } from "@/modules/identity-workspace";
import { dispatchOutboxBatch } from "@/modules/command-runtime/kernel";
import { requestResearchCampaign, getResearchCampaign } from "@/modules/research-sandbox/research-campaign";
import { assertControlledCampaignEnvironment } from "@/modules/research-sandbox/research-campaign/source-bundle";
import { campaignEnvelopeSchema } from "@/modules/research-sandbox/research-campaign/contracts";
import { boundedJson } from "@/modules/research-sandbox/research-core-v3/bounded-json";
import { resolveDomainAdapter } from "@/modules/research-sandbox/research-core-v3";
import { controlledCampaignProfile } from "@/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog";
import { evaluateRetainedPair } from "@/modules/research-sandbox/research-evaluation-v3/kernel";
import { runResearchCampaignWorkerCycle } from "@/server/workers/research-campaign-cycle";
import { withOrganizationTenant } from "@/server/tenant-context";

/** No table access outside the exact existing isolated-QA boundary. */
export function isCampaignUiQaAvailable(): boolean {
  try { assertControlledCampaignEnvironment(); return true; } catch { return false; }
}
/** Explicit bounded engineering action. The profile is reviewed domain-owned
 * data; transport and driver do not inspect/switch on scientific domain fields.
 */
export async function runControlledUiCampaign(ctx: WorkspaceContext, input: { missionId: string; profileId: string; idempotencyKey: string }) {
  assertControlledCampaignEnvironment();
  await requireWorkspaceAuthorization(ctx,"research.request",input.missionId);
  await requireWorkspaceAuthorization(ctx,"research.review",input.missionId);
  const profile = controlledCampaignProfile(input.profileId);
  const adapter = resolveDomainAdapter(profile.contract.domain.adapterId,profile.contract.domain.adapterVersion);
  const organizationId=await organizationIdForWorkspace(ctx.workspace.id);
  const envelope=campaignEnvelopeSchema.parse({version:3,provider:"CONTROLLED_LOCAL",requestedModel:"CONTROLLED_FIXED_RESPONSE_V3",
      methods:profile.envelopeMethods.slice(0,1),total:{calls:2,tokens:2000,checkerOperations:2*adapter.limits.maxOperations,computeMilliseconds:150000,readBytes:16777216,writeBytes:4194304},
      perCall:{tokens:1000,milliseconds:5000},stop:{maxRounds:1,maxNoInformation:1,deadlineAt:new Date(Date.now()+60000).toISOString()},
      recovery:{replacementDeliveries:1,verifierReplays:1,diagnosticIncidents:2,diagnosticReadBytes:2097152,diagnosticMilliseconds:20000},
      postgrade:{actions:2,total:{calls:0,tokens:0,checkerOperations:2*adapter.limits.maxOperations,computeMilliseconds:120000,readBytes:16777216,writeBytes:4194304}}});
  // Check durable exact owner identity BEFORE constructing a fresh approval.
  // Repeated UI posts become observation only, even after the original deadline;
  // they neither reset it nor re-dispatch an unfinished external effect.
  const prior=await withOrganizationTenant(organizationId,ctx.user.id,tx=>tx.commandRecord.findUnique({where:{organizationId_idempotencyKey:{organizationId,idempotencyKey:input.idempotencyKey}}}));
  if(prior) {
    if(prior.commandType!=="research.campaign.v3.approve" || prior.workspaceId!==ctx.workspace.id || prior.actorUserId!==ctx.user.id || prior.status!=="SUCCEEDED" || sha256(canonicalJson(prior.payload))!==prior.payloadHash) throw new Error("CONTROL_EXISTING_IDENTITY_REFUSED");
    const payload=boundedJson(prior.payload,262144,256) as unknown as {missionId:string;contractDigest:string;envelopeDigest:string;sourceBundleDigest:string};
    const outcome=boundedJson(prior.outcome,65536,256) as unknown as {campaignId:string};
    const retained=await getResearchCampaign(ctx,outcome.campaignId);
    if(payload.missionId!==input.missionId || retained.missionId!==input.missionId || payload.contractDigest!==retained.contractDigest || payload.envelopeDigest!==retained.envelopeDigest || payload.sourceBundleDigest!==retained.sourceBundleDigest || canonicalJson(retained.contract)!==canonicalJson(profile.contract) || canonicalJson({...retained.envelope,stop:{...retained.envelope.stop,deadlineAt:envelope.stop.deadlineAt}})!==canonicalJson(envelope)) throw new Error("CONTROL_EXISTING_BINDING_REFUSED");
    return {campaignId:retained.id};
  }
  const approval = await requestResearchCampaign(ctx,{
    missionId:input.missionId,idempotencyKey:input.idempotencyKey,contract:profile.contract,envelope,
  });
  if(approval.status!=="SUCCEEDED" || typeof approval.outcome.campaignId!=="string") throw new Error("CONTROL_APPROVAL_REFUSED");
  const campaignId=approval.outcome.campaignId;
  const before=await getResearchCampaign(ctx,campaignId);
  // Repeated command identity may read a completed action, but never dispatch
  // another provider effect or repeat its independent observation action.
  if(before.status==="COMPLETED") return {campaignId};
  if(before.status!=="QUEUED" || before.state.stage) throw new Error("CONTROL_NOT_FRESH_QUEUED");
  const workerId=`ui-control:${randomUUID()}`;
  const dispatched=await dispatchOutboxBatch({organizationId,actorUserId:ctx.user.id,workerId:`${workerId}:dispatch`,outboxIds:approval.outboxEventIds});
  if(dispatched.jobIds.length!==1) throw new Error("CONTROL_EXACT_JOB_UNAVAILABLE");
  await runResearchCampaignWorkerCycle({organizationId,actorUserId:ctx.user.id,workerId,correlationId:randomUUID(),claimFirst:1,
    campaign:{jobIds:dispatched.jobIds,outboxIds:[],leaseSeconds:30,
      provider:{kind:"CONTROLLED_LOCAL",requestedModel:"CONTROLLED_FIXED_RESPONSE_V3",execute:async call=>{
        if(call.signal.aborted) throw new Error("CONTROL_ABORTED");
        return {originalBytes:profile.candidateBytes,attestedModel:null,usage:{tokens:100,provenance:"CONTROLLED_PROVIDER_LOG"}};
      }}}});
  const retained=await getResearchCampaign(ctx,campaignId);
  if(["COMPLETED","FAILED","RESOURCE_STOP"].includes(retained.status) && retained.state.stage?.candidateKey) {
    await evaluateRetainedPair(ctx,{campaignId,idempotencyKey:`${input.idempotencyKey}:postgrade`});
  }
  return {campaignId};
}
