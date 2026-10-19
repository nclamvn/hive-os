import { Prisma, type ResearchCampaign } from "@prisma/client";
import { canonicalJson, sha256 } from "@/modules/execution-fabric/contracts";
import type { TenantTransaction } from "@/server/tenant-context";
import { prepareProblemContract } from "../research-core-v3";
import type { ExactClosure, HostVerifierReceipt } from "../research-core-v3/types";
import { CampaignRefusal, campaignEnvelopeSchema, zeroResources,
  type CampaignEnvelope, type CampaignEventView, type CampaignStage, type CampaignState, type CampaignView, type Resources } from "./contracts";

export const campaignDigest = (value: unknown) => sha256(canonicalJson(value));
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export function initialCampaignState(envelope: CampaignEnvelope): CampaignState {
  return { status: "QUEUED", nextAction: "DISPATCH", stopReason: null, spent: zeroResources(),
    diagnosticSpent: { incidents: 0, readBytes: 0, milliseconds: 0 }, rounds: 0, noInformation: 0,
    replacements: 0, verifierReplays: 0, retiredCandidateDigests: [],retiredPredicateDigests:[], stage: null,
    requestedModel: envelope.requestedModel, attestedModel: null,attestedModelVersion:null, observedTokens: 0,
    accountingComplete: true,observedKnownTokens:0,unknownUsageActions:0,queueLatencyMilliseconds:null, routinePrompts: 0, consequentialPrompts: 0,
    closure: null, failure: null,executionFailure:null,postgradeSpent:zeroResources(),postgradeActions:0,postgradePending:null };
}
export function reserveResources(state: CampaignState, envelope: CampaignEnvelope, amount: Resources) {
  for (const key of Object.keys(state.spent) as (keyof Resources)[]) {
    if (!Number.isSafeInteger(amount[key]) || amount[key] < 0 || state.spent[key] + amount[key] > envelope.total[key]) throw new CampaignRefusal("RESOURCE", "Campaign TOTAL exhausted");
    state.spent[key] += amount[key];
  }
}
function requireStage(state: CampaignState) {
  if (!state.stage) throw new CampaignRefusal("INTEGRITY", "Campaign stage missing");
  return state.stage;
}
/** Deterministic reducer used both on write and full bounded history replay. */
export function reduceCampaignEvent(previous: CampaignState, envelope: CampaignEnvelope, kind: string, detail: Record<string, unknown>): CampaignState {
  const state = copy(previous);
  const postgradeKinds=["EVALUATION_RESERVED","EVALUATION_STARTED","EVALUATION_RETAINED","DOSSIER_RESERVED","DOSSIER_STARTED","DOSSIER_EXPORTED","FEEDBACK_RESERVED","FEEDBACK_STARTED","FEEDBACK_RETAINED"];
  if (["RESOURCE_STOP", "FAILED", "COMPLETED"].includes(state.status) && !["DIAGNOSTIC_RESERVED", "DIAGNOSTIC", "REVOKED", "HUMAN_PROMPT","REUSE_RESERVED","ROUND_ENDED","EXECUTION_REFUSED",...postgradeKinds].includes(kind)) throw new CampaignRefusal("INTEGRITY", "Terminal campaign cannot advance");
  if (kind === "APPROVED") { reserveResources(state,envelope,detail.resources as Resources); return state; }
  if (kind === "RESERVED") {
    if (state.stage && state.stage.fence !== "VERIFIED") throw new CampaignRefusal("INTEGRITY", "Prior stage is unresolved");
    const stage = detail.stage as CampaignStage;
    if (stage.round !== state.rounds + 1 || stage.round > envelope.stop.maxRounds || !envelope.methods.includes(stage.methodId) || stage.fence !== "NOT_CROSSED" || stage.delivery !== 1) throw new CampaignRefusal("INTEGRITY", "Stage envelope mismatch");
    reserveResources(state,envelope,detail.resources as Resources);
    state.stage = copy(stage); state.rounds = stage.round; state.status = "RUNNING"; state.nextAction = "START";
  } else if (kind === "DELIVERY_REPLACED") {
    const stage = requireStage(state);
    if (stage.fence !== "NOT_CROSSED" || stage.delivery !== 1 || state.replacements >= envelope.recovery.replacementDeliveries) throw new CampaignRefusal("AUTHORITY", "No proven pre-effect replacement allowed");
    reserveResources(state,envelope,detail.resources as Resources);
    stage.delivery = 2; state.replacements++; state.nextAction = "START";
  } else if (kind === "STARTED") {
    const stage = requireStage(state);
    if (stage.fence !== "NOT_CROSSED" || detail.actionId !== stage.actionId || detail.delivery !== stage.delivery) throw new CampaignRefusal("INTEGRITY", "Invocation fence mismatch");
    stage.fence = "STARTED"; stage.startedAt = String(detail.startedAt); state.nextAction = "AWAIT_RESULT";
    if (!/^[a-f0-9]{64}$/.test(String(detail.runtimeSourceDigest)) || !/^[a-f0-9]{64}$/.test(String(detail.checkerSourceDigest))) throw new CampaignRefusal("INTEGRITY","Missing actual reviewed source pins");
    stage.runtimeSourceDigest=String(detail.runtimeSourceDigest);stage.checkerSourceDigest=String(detail.checkerSourceDigest);
    state.unknownUsageActions++;state.observedTokens=null;state.accountingComplete=false;
    const queue=detail.queueLatencyMilliseconds as number|null;
    if(queue!==null && (!Number.isSafeInteger(queue) || queue<0)) throw new CampaignRefusal("INTEGRITY","Invalid durable queue latency");
    if(state.queueLatencyMilliseconds===null)state.queueLatencyMilliseconds=queue;
  } else if (kind === "RESULT_RETAINED") {
    const stage = requireStage(state);
    if (stage.fence !== "STARTED" || detail.actionId !== stage.actionId) throw new CampaignRefusal("INTEGRITY", "Result is outside active invocation");
    stage.fence = "RESULT_RETAINED"; stage.candidateKey = String(detail.candidateKey); stage.candidateDigest = String(detail.candidateDigest);
    stage.candidateBytes = Number(detail.candidateBytes); stage.returnedAt = String(detail.returnedAt);
    if (!/^[a-f0-9]{64}$/.test(stage.candidateDigest) || !Number.isSafeInteger(stage.candidateBytes) || stage.candidateBytes < 1) throw new CampaignRefusal("INTEGRITY", "Invalid retained seal");
    const tokens = detail.observedTokens as number | null;
    if(tokens!==null) {if(!Number.isSafeInteger(tokens) || tokens<0) throw new CampaignRefusal("INTEGRITY","Invalid observed token usage");state.observedKnownTokens+=tokens;state.unknownUsageActions--;}
    state.accountingComplete=state.unknownUsageActions===0;
    state.observedTokens=state.accountingComplete?state.observedKnownTokens:null;
    state.attestedModel = detail.attestedModel as string | null; state.status = "VERIFYING"; state.nextAction = "VERIFY";
    state.attestedModelVersion=(detail.attestedModelVersion ?? null) as string|null;
  } else if (kind === "CHECK_RESERVED") {
    const stage = requireStage(state);
    if (stage.fence !== "RESULT_RETAINED" || stage.checkerReservations >= 1 + envelope.recovery.verifierReplays) throw new CampaignRefusal("AUTHORITY", "Checker recovery allowance exhausted");
    if (stage.checkerReservations > 0) state.verifierReplays++;
    reserveResources(state,envelope,detail.resources as Resources); stage.checkerReservations++;
  } else if (kind === "VERIFIED") {
    const stage = requireStage(state);
    const receipt = detail.receipt as HostVerifierReceipt;
    const closure = detail.closure as ExactClosure;
    if (stage.fence !== "RESULT_RETAINED" || stage.checkerReservations < 1 || receipt.contractDigest!==stage.contractDigest || receipt.rootId!==stage.rootId || receipt.obligationId!==stage.obligationId ||
      receipt.adapterId!==stage.adapterId || receipt.adapterVersion!==stage.adapterVersion || receipt.candidateDigest !== stage.candidateDigest || receipt.inputDigest !== stage.inputDigest || receipt.attemptId !== stage.attemptId ||
      receipt.predicateDigest !== stage.predicateDigest || receipt.authorityEpoch !== stage.authorityEpoch || receipt.sourceBundleDigest !== stage.sourceBundleDigest || receipt.runtimeSourceDigest !== stage.runtimeSourceDigest ||
      receipt.checkerSourceDigest !== stage.checkerSourceDigest || closure.receiptDigest !== receipt.receiptDigest) throw new CampaignRefusal("INTEGRITY", "Verifier receipt binding mismatch");
    const { receiptDigest, ...body } = receipt;
    if (campaignDigest(body) !== receiptDigest || closure.status === "CLOSED_EXACT_SCOPE" && receipt.result !== "VERIFIED") throw new CampaignRefusal("INTEGRITY", "Verifier record seal mismatch");
    stage.receipt = copy(receipt); stage.closure = copy(closure); stage.fence = "VERIFIED"; state.closure = copy(closure);
    if (closure.status === "CLOSED_EXACT_SCOPE") { state.status = "COMPLETED"; state.nextAction = "NONE"; }
    else {
      state.noInformation++;
      if (receipt.result === "REJECTED") { state.retiredCandidateDigests.push(receipt.candidateDigest); state.failure = "SCIENTIFIC"; }
      state.status = "QUEUED"; state.nextAction = "NEXT_ADMITTED_METHOD";
      if (state.noInformation >= envelope.stop.maxNoInformation || state.rounds >= envelope.stop.maxRounds || state.rounds >= envelope.methods.length) { state.status = "RESOURCE_STOP"; state.stopReason = "NO_INFORMATION_OR_ROUND_LIMIT"; state.nextAction = "HUMAN_ROUTING"; }
      if(receipt.scientificDisposition==="REFUTED_EXACT_PREDICATE") {
        if(!receipt.refutation || campaignDigest(receipt.refutation.predicate)!==stage.predicateDigest) throw new CampaignRefusal("INTEGRITY","Exact predicate refutation scope changed");
        state.retiredPredicateDigests.push(stage.predicateDigest);state.status="FAILED";state.failure="SCIENTIFIC";
        state.stopReason="EXACT_COMMITTED_PREDICATE_REFUTED";state.nextAction="HUMAN_TARGET_REVIEW";
      }
    }
  } else if (kind === "CANDIDATE_REJECTED") {
    const stage = requireStage(state);
    if (stage.fence !== "RESULT_RETAINED") throw new CampaignRefusal("INTEGRITY", "Candidate failure has no retained output");
    stage.fence = "VERIFIED"; state.noInformation++; state.failure = "SCHEMA";
    state.retiredCandidateDigests.push(stage.candidateDigest!);
    state.status = "QUEUED"; state.nextAction = "NEXT_ADMITTED_METHOD";
    if (state.noInformation >= envelope.stop.maxNoInformation || state.rounds >= envelope.stop.maxRounds || state.rounds >= envelope.methods.length) {
      state.status = "RESOURCE_STOP"; state.stopReason = "NO_INFORMATION_OR_ROUND_LIMIT"; state.nextAction = "HUMAN_ROUTING";
    }
  } else if (kind === "ROUND_ENDED") {
    if (requireStage(state).fence !== "VERIFIED") throw new CampaignRefusal("INTEGRITY", "Cannot end unresolved round");
  } else if(kind === "REUSE_RESERVED") {
    if(requireStage(state).fence!=="VERIFIED") throw new CampaignRefusal("INTEGRITY","No completed stage to reuse");
    reserveResources(state,envelope,detail.resources as Resources);
  } else if(kind === "EXECUTION_REFUSED") {
    state.executionFailure=detail.failure as CampaignState["failure"];
    state.nextAction="HUMAN_EXECUTION_INTEGRITY_REVIEW";
  } else if (kind === "DIAGNOSTIC_RESERVED") {
    const requested = detail.resources as Resources;
    const readBytes = Number(detail.readBytes), milliseconds = Number(detail.milliseconds);
    if (readBytes > 1048576 || milliseconds > 10000 || readBytes < 0 || milliseconds < 1 ||
      state.diagnosticSpent.incidents >= envelope.recovery.diagnosticIncidents || state.diagnosticSpent.readBytes + readBytes > envelope.recovery.diagnosticReadBytes ||
      state.diagnosticSpent.milliseconds + milliseconds > envelope.recovery.diagnosticMilliseconds) throw new CampaignRefusal("RESOURCE", "Campaign diagnostic allowance exhausted");
    reserveResources(state,envelope,requested); state.diagnosticSpent.incidents++; state.diagnosticSpent.readBytes += readBytes; state.diagnosticSpent.milliseconds += milliseconds;
  } else if (kind === "DIAGNOSTIC") {
    if (!state.diagnosticSpent.incidents || !["STARTED", "RESULT_RETAINED", "NOT_CROSSED", "VERIFIED"].includes(String(detail.fence))) throw new CampaignRefusal("INTEGRITY", "Diagnostic has no admitted known stage");
  } else if (kind === "PAUSED") {
    state.status = "PAUSED_FOR_DECISION"; state.nextAction = "HUMAN_EFFECT_RECONCILIATION"; state.failure = detail.failure as CampaignState["failure"]; state.stopReason = String(detail.reason);
  } else if (kind === "RESOURCE_STOP") {
    state.status = "RESOURCE_STOP"; state.nextAction = "HUMAN_ROUTING"; state.stopReason = String(detail.reason); state.failure = "RESOURCE";
  } else if (kind === "FAILED") {
    state.status = "FAILED"; state.nextAction = "HUMAN_INTEGRITY_REVIEW"; state.stopReason = String(detail.reason); state.failure = detail.failure as CampaignState["failure"];
  } else if (kind === "HUMAN_PROMPT") {
    if (detail.taxonomy === "ROUTINE_CONTINUATION") state.routinePrompts++;
    else state.consequentialPrompts++;
  } else if (kind === "REVOKED") {
    if (!["COMPLETED", "FAILED", "RESOURCE_STOP"].includes(state.status)) state.status = "PAUSED_FOR_DECISION";
    state.nextAction = "REVOKED_NO_DISPATCH"; state.stopReason = "AUTHORITY_REVOKED"; state.failure = "AUTHORITY";
  } else if (postgradeKinds.includes(kind)) {
    const actionId=String(detail.actionId),cutDigest=String(detail.cutDigest);
    if(!/^[a-f0-9]{64}$/.test(cutDigest) || !/^[A-Za-z0-9:._-]{1,200}$/.test(actionId)) throw new CampaignRefusal("INTEGRITY","Postgrade exact cut/action binding required");
    if(kind.endsWith("_RESERVED")) {
      if(!envelope.postgrade || state.postgradePending || state.postgradeActions>=envelope.postgrade.actions) throw new CampaignRefusal("RESOURCE","Postgrade allowance unavailable");
      const amount=detail.resources as Resources;
      for(const key of Object.keys(state.postgradeSpent) as (keyof Resources)[]) {
        if(!Number.isSafeInteger(amount[key]) || amount[key]<0 || state.postgradeSpent[key]+amount[key]>envelope.postgrade.total[key]) throw new CampaignRefusal("RESOURCE","Separate postgrade TOTAL exhausted");
        state.postgradeSpent[key]+=amount[key];
      }
      state.postgradeActions++;state.postgradePending={actionId,kind:kind.split("_")[0],cutDigest,started:false};
    } else {
      const pending=state.postgradePending;
      if(!pending || pending.actionId!==actionId || pending.cutDigest!==cutDigest || pending.kind!==kind.split("_")[0]) throw new CampaignRefusal("INTEGRITY","Postgrade result without matching reservation");
      if(kind.endsWith("_STARTED")) {if(pending.started)throw new CampaignRefusal("AUTHORITY","Postgrade effect already STARTED");pending.started=true;}
      else {if(!pending.started)throw new CampaignRefusal("AUTHORITY","Postgrade retained result has no START");state.postgradePending=null;}
    }
  } else throw new CampaignRefusal("INTEGRITY", "Unsupported retained event type");
  return state;
}
export async function lockCampaign(tx: TenantTransaction, organizationId: string, id: string) {
  await tx.$queryRaw`SELECT id FROM research_campaign WHERE organization_id=${organizationId} AND id=${id} FOR UPDATE`;
  return tx.researchCampaign.findFirstOrThrow({ where: { id,organizationId } });
}
export async function loadCampaignView(tx: TenantTransaction, row: ResearchCampaign): Promise<CampaignView> {
  const contract = prepareProblemContract(row.contract);
  const envelope = campaignEnvelopeSchema.parse(row.envelope);
  if (contract.contractDigest !== row.contractDigest || campaignDigest(envelope) !== row.envelopeDigest) throw new CampaignRefusal("INTEGRITY", "Campaign immutable envelope changed");
  const rows = await tx.researchCampaignEvent.findMany({ where: { campaignId: row.id,organizationId: row.organizationId,workspaceId: row.workspaceId }, orderBy: { sequence: "asc" },take: 257 });
  if (!rows.length || rows.length > 256 || rows.length !== row.sequence) throw new CampaignRefusal("INTEGRITY", "Incomplete campaign event chain");
  let state = initialCampaignState(envelope), tail: string | null = null;
  const events: CampaignEventView[] = [];
  for (const [index,event] of rows.entries()) {
    const payload = event.payload as unknown as CampaignEventView["payload"];
    const body = { campaignId: row.id, organizationId: row.organizationId,workspaceId: row.workspaceId, sequence: event.sequence,
      eventType: event.eventType,actionKey:event.actionKey,payload,previousDigest:event.previousDigest,jobId:event.jobId,createdAt:event.createdAt.toISOString() };
    if (event.sequence !== index + 1 || event.previousDigest !== tail || campaignDigest(body) !== event.digest || index === 0 && event.eventType !== "APPROVED") throw new CampaignRefusal("INTEGRITY", "Campaign history chain mismatch");
    state = reduceCampaignEvent(state,envelope,event.eventType,payload.detail);
    if(state.stage && (state.stage.contractDigest!==row.contractDigest || state.stage.rootId!==contract.contract.rootId ||
      state.stage.obligationId!==contract.contract.obligations[0].id || state.stage.adapterId!==contract.contract.domain.adapterId ||
      state.stage.adapterVersion!==contract.contract.domain.adapterVersion || state.stage.sourceBundleDigest!==row.sourceBundleDigest ||
      state.stage.authorityEpoch!==row.authorityEpoch || state.stage.inputDigest!==contract.inputDigest ||
      state.stage.predicateDigest!==campaignDigest(contract.contract.obligations[0].predicate))) throw new CampaignRefusal("INTEGRITY","Stage target/input/source identity drift");
    if (campaignDigest(state) !== campaignDigest(payload.state)) throw new CampaignRefusal("INTEGRITY", "Campaign event reducer mismatch");
    tail = event.digest; events.push({ id: event.id,campaignId:row.id,sequence:event.sequence,eventType:event.eventType,actionKey:event.actionKey,payload,previousDigest:event.previousDigest,digest:event.digest,jobId:event.jobId,createdAt:event.createdAt.toISOString() });
  }
  if (row.tailDigest !== tail || row.stateDigest !== campaignDigest(state) || campaignDigest(row.state) !== row.stateDigest || row.status !== state.status) throw new CampaignRefusal("INTEGRITY", "Campaign projection drift");
  return { id:row.id,organizationId:row.organizationId,workspaceId:row.workspaceId,missionId:row.missionId,version:row.version,contract:contract.contract,contractDigest:row.contractDigest,
    envelope,envelopeDigest:row.envelopeDigest,sourceBundleDigest:row.sourceBundleDigest,authorityEpoch:row.authorityEpoch,status:state.status,state,events,
    complete:true,eventCut:{sequence:row.sequence,digest:tail!},revokedAt:row.revokedAt?.toISOString() ?? null };
}
export async function appendCampaignEvent(tx: TenantTransaction, row: ResearchCampaign, kind: string, actionKey: string, detail: Record<string, unknown>, jobId: string | null = null, revokedAt?: Date) {
  const current = row.sequence ? (await loadCampaignView(tx,row)).state : initialCampaignState(campaignEnvelopeSchema.parse(row.envelope));
  const next = reduceCampaignEvent(current,campaignEnvelopeSchema.parse(row.envelope),kind,detail);
  const payload = { state:next,detail };
  if (Buffer.byteLength(canonicalJson(payload)) > 524288) throw new CampaignRefusal("RESOURCE", "Campaign event material bound");
  const createdAt = new Date();
  const body = { campaignId:row.id,organizationId:row.organizationId,workspaceId:row.workspaceId,sequence:row.sequence+1,eventType:kind,actionKey,payload,previousDigest:row.tailDigest,jobId,createdAt:createdAt.toISOString() };
  const digest = campaignDigest(body);
  await tx.researchCampaignEvent.create({ data:{ ...body,createdAt,payload:payload as unknown as Prisma.InputJsonObject,digest } });
  return tx.researchCampaign.update({ where:{id:row.id},data:{ state:next as unknown as Prisma.InputJsonObject,stateDigest:campaignDigest(next),status:next.status,
    sequence:row.sequence+1,tailDigest:digest,version:{increment:1},...(revokedAt?{revokedAt}:{}) } });
}
