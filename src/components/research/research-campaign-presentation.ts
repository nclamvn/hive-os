import type { CampaignView } from "@/modules/research-sandbox/research-campaign/contracts";
import type { Postgrade } from "@/modules/research-sandbox/research-evaluation-v3/evaluator";

/** Observation projection only, never restores host receipt authority from JSON. */
export function projectResearchCampaign(view: CampaignView, grade: Postgrade | null) {
  const receipt = view.state.stage?.receipt ?? null;
  const closedId = view.state.closure?.status === "CLOSED_EXACT_SCOPE" ? view.state.closure.obligationId : null;
  return {
    id: view.id, version: view.version, target: view.contract.target, status: view.status,
    nextAction: view.state.nextAction, uncertainEffect: view.state.stage?.fence === "STARTED",
    obligations: view.contract.obligations.map(o => ({ id: o.id,closed: o.id === closedId,acceptanceType: o.acceptanceType })),
    checkedScope: receipt?.checkedScope ?? null, receipt, grade,
    reserved: view.state.spent, allowance: view.envelope.total, observedTokens: view.state.observedTokens,
    observedModel: view.state.attestedModel, accountingComplete: view.state.accountingComplete,
    recovery: { stopReason: view.state.stopReason,failure: view.state.failure,executionFailure: view.state.executionFailure,replacements: view.state.replacements,verifierReplays: view.state.verifierReplays,diagnostics: view.state.diagnosticSpent },
    failures: view.events.filter(e=>["PAUSED","EXECUTION_REFUSED","CANDIDATE_REJECTED","TRANSPORT_PRE_EFFECT","UNKNOWN_EXTERNAL_EFFECT","SCHEMA_REFUSED","CHECKER_REFUSED","RESOURCE_STOP","FAILED"].includes(e.eventType)).map(e=>({ sequence:e.sequence,type:e.eventType,failure: safeCode(e.payload?.detail.failure),stopReason:safeCode(e.payload?.state.stopReason) })),
    retainedCandidateCount: view.events.filter(e=>e.eventType==="RESULT_RETAINED").length,
    postgradeReserved: view.state.postgradeSpent,postgradeAllowance: view.envelope.postgrade?.total??null,
    definitions: view.contract.definitions,quantifiers: view.contract.quantifiers,assumptions: view.contract.assumptions,
    rootId: view.contract.rootId,sourceBundleDigest: view.sourceBundleDigest,contractDigest: view.contractDigest,
    eventCut: view.eventCut,revoked: view.revokedAt !== null,
    canRevoke: view.revokedAt === null && !["COMPLETED","FAILED","RESOURCE_STOP"].includes(view.status),
    widerResearchStatus: "NOT_ESTABLISHED" as const,
  };
}
function safeCode(value:unknown):string|null {return typeof value==="string" && /^[A-Z][A-Z0-9_:-]{0,119}$/.test(value)?value:null;}
