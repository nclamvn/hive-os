import {MathDiagnosticError,type DiagnosticBinding} from "@/modules/research-sandbox/math-transport-diagnostics";
import type {DiagnosticGrant} from "./math-diagnostic-auth";
import type {MathDiagnosticCaptureStore} from "./math-diagnostic-capture";
import type {PinnedAdmissionParser} from "@/modules/research-sandbox/math-transport-admission";
import type {LrcMethodUnitSourcePins} from "@/modules/research-sandbox/math-lrc-method-unit";

export interface MethodUnitExecutionAuthority {readonly methodUnit:true}
const authorities=new WeakMap<MethodUnitExecutionAuthority,{caseId:string;runId:string;expiresAt:number;next:"SOLVER"|"ADVERSARY"|"HOST_FINITE_CHECK"|"CRITIC"|"DONE"}>();
/** G1 release has NO production mint. Queue flags/session IDs cannot create G2 authority. */
export function requireMethodUnitExecutionAuthority(authority:MethodUnitExecutionAuthority|undefined,target:{caseId:string;runId:string}) {
  const a=authority&&authorities.get(authority);
  if(!a||a.caseId!==target.caseId||a.runId!==target.runId||Date.now()>=a.expiresAt)throw new MathDiagnosticError("AUTH_GRANT_INVALID");
}
export function createMethodUnitFixtureExecutionAuthority(target:{caseId:string;runId:string},expiresAt=Date.now()+1800000) {
  if(process.env.NODE_ENV!=="test"||!process.env.VITEST)throw new MathDiagnosticError("AUTHENTICATION_REQUIRED");
  const a=Object.freeze({methodUnit:true as const});authorities.set(a,{...target,expiresAt,next:"SOLVER"});return a;
}
export function beginMethodUnitStage(authority:MethodUnitExecutionAuthority,target:{caseId:string;runId:string},stage:"SOLVER"|"ADVERSARY"|"HOST_FINITE_CHECK"|"CRITIC") {
  requireMethodUnitExecutionAuthority(authority,target);const a=authorities.get(authority)!;
  const reserve=stage==="SOLVER"?1510000:stage==="ADVERSARY"?990000:stage==="HOST_FINITE_CHECK"?495000:490000;
  if(a.next!==stage||a.expiresAt-Date.now()<reserve)throw new MathDiagnosticError("OPERATION_DEADLINE");
  a.next=stage==="SOLVER"?"ADVERSARY":stage==="ADVERSARY"?"HOST_FINITE_CHECK":stage==="HOST_FINITE_CHECK"?"CRITIC":"DONE";
}
export function authorizeProspectiveMethodUnitG2():never {
  // No approved G2 manifest exists. A future separately approved ingress must
  // replace this refusal, not infer authority from process flags or CLI IDs.
  throw new MathDiagnosticError("AUTHENTICATION_REQUIRED");
}
export interface MethodUnitJobRuntime {
  authority:MethodUnitExecutionAuthority;
  target:{caseId:string;runId:string};
  store:MathDiagnosticCaptureStore;
  grant:(binding:DiagnosticBinding)=>Promise<DiagnosticGrant>;
  parser:(role:DiagnosticBinding["role"])=>PinnedAdmissionParser;
  sourcePins:Record<string,string>;
  finiteSourcePins:LrcMethodUnitSourcePins;
  journal:(safe:Record<string,unknown>)=>Promise<void>;
}
