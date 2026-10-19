import { LRC_CAMPAIGN_MANIFEST_DIGEST } from "@/modules/research-sandbox/math-lrc-campaign";
import { LRC_PROOF_UNIT_PACKET } from "@/modules/research-sandbox/math-lrc-proof-unit";
import { createLrcProofUnitLiveEvidence, prepareLrcProofUnitSolverInput } from "@/modules/research-sandbox/math-lrc-proof-unit-live";
import { digestMathPilotContract, resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";

export const proofRequest={caseType:"LRC_PROOF_UNIT",preset:"ALLIKVERE_P83_PROOF_UNIT_V1"} as const;
export const proofContract=resolveMathPilotContract(proofRequest);
export const proofBinding={contractDigest:digestMathPilotContract(proofContract),caseId:"proof-case",runId:"proof-run",requestedModelName:"gpt-6-sol"};
export const identityAdmission={mode:"RETAINED_IDENTITY_ONLY_NOT_FRESH",method:"FIXED_42_FILE_IDENTITY_IMPORT",
  checkedAt:"2026-10-04T01:00:00.000Z",filesVerified:42,bytesVerified:53211840,manifestDigest:LRC_CAMPAIGN_MANIFEST_DIGEST,
  semanticReplayExecuted:false,externalAttestation:false} as const;
export const proofFeedback={version:1,auditStatus:"INCONCLUSIVE",summary:"Conditional premises remain unsigned and source-conditional.",
  premiseFindings:LRC_PROOF_UNIT_PACKET.premises.map(row=>({id:row.id,status:"OPEN" as const,reason:"Retained conditional premise, not fresh theorem evidence."})),
  stepFindings:LRC_PROOF_UNIT_PACKET.steps.map(row=>({id:row.id,status:"CONDITIONAL" as const,reason:"Local symbolic implication is conditional on its stated premises."}))} as const;
export const proofMathematics={attemptType:"PARTIAL" as const,argument:"The common-level bridge remains conditional on exact-fiber closure and the retained terminal/cascade premises. No fresh forest or global lower theorem is established.",
  candidateCounterexample:null,selfChecks:["Gcd and CRT transports retain the stated witness direction."],limitations:["Unsigned retained premise admission only."],lrcProofUnitFeedback:proofFeedback};
export function proofAttempt(){return {...proofMathematics,providerName:"codex-local" as const,modelName:"gpt-6-sol",threadId:"solver-context",
  usage:{inputTokens:100,cachedInputTokens:10,outputTokens:50,reasoningOutputTokens:20},
  lrcProofUnitEvidence:createLrcProofUnitLiveEvidence({identityAdmission,solverInput:prepareLrcProofUnitSolverInput(proofBinding)})};}
export function proofReport(role:"CRITIC"|"ADVERSARY"){return {role,verdict:"INCONCLUSIVE" as const,candidateConclusion:"INCONCLUSIVE" as const,
  exactQuote:"The common-level bridge remains conditional",reasoning:"The conditional premise chain needs explicit source admission; no mathematical global theorem follows from this local bridge.",
  checks:["Retain each fixed dependency and the strict-open boundary."],unresolvedGap:"The premise authenticity and global lower claim remain open.",lrcProofUnitFeedback:proofFeedback};}
export function codexEvents(output:unknown,threadId="actual-context",usage:unknown={input_tokens:100,cached_input_tokens:10,output_tokens:50,reasoning_output_tokens:20}){
  return [{type:"thread.started",thread_id:threadId},{type:"item.completed",item:{type:"agent_message",text:JSON.stringify(output)}},{type:"turn.completed",usage}].map(row=>JSON.stringify(row)).join("\n");}
