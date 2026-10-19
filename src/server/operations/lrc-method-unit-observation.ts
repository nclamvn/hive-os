/** Prospective G2 protocol on existing exact jobs; G1 has no production ingress. */
import {ObservationBudget,ObservationStop,type ObservationCreated,type ObservationJob,type ObservationReceipt} from "./lrc-controlled-observation";
import {requireMethodUnitExecutionAuthority,type MethodUnitExecutionAuthority} from "./math-method-unit-authority";
import {MathDiagnosticError} from "@/modules/research-sandbox/math-transport-diagnostics";
export interface MethodUnitObservationRuntime {
  preflight:()=>Promise<{authenticated:boolean;calibrated:boolean;conflictFree:boolean;sourcePinsValid:boolean}>;
  create:()=>Promise<ObservationCreated>;
  dispatch:(outboxId:string)=>Promise<ObservationJob>;
  claim:(job:ObservationJob)=>Promise<ObservationJob>;
  solver:(created:ObservationCreated,job:ObservationJob,signal:AbortSignal)=>Promise<void>;
  automaticReview:(created:ObservationCreated)=>Promise<string>;
  review:(created:ObservationCreated,job:ObservationJob,signal:AbortSignal)=>Promise<void>;
  inspect:(created:ObservationCreated)=>Promise<{version:7;caseId:string;runId:string;reviewJobId:string;reviewIntegrityValid:boolean;roles:readonly ["SOLVER","ADVERSARY","CRITIC"];jobs:Array<{id:string;status:string;attempts:number}>;finiteStatus:string;conclusion:string}>;
  failOwned:(job:ObservationJob)=>Promise<void>;
}
export async function observeLrcMethodUnitOnce(input:{mode:"preflight"|"run";runtime:MethodUnitObservationRuntime;receipt:ObservationReceipt;budget:ObservationBudget;authority?:MethodUnitExecutionAuthority;target:{caseId:string;runId:string}}){
  const {budget,runtime,receipt}=input;let created:ObservationCreated|undefined,owned:ObservationJob|undefined,creationAttempted=false;
  const stage=async<T>(name:string,reserve:number,work:()=>Promise<T>)=>{budget.require(reserve);await receipt.append({event:"STAGE_STARTED",name});const result=await work();await receipt.append({event:"STAGE_FINISHED",name});budget.require(1);return result;};
  const timer=setTimeout(()=>budget.controller.abort(),Math.max(1,budget.remaining()));
  try{await receipt.append({event:"BEGIN",version:"LRC_METHOD_UNIT_OBSERVATION_V1",mode:input.mode,noRetry:true,liveAuthority:"G2_REQUIRED"});
    const readiness=await stage("read-only-preflight",30000,()=>runtime.preflight());
    if(!Object.values(readiness).every(Boolean))throw new ObservationStop("METHOD_UNIT_NOT_READY");
    if(input.mode==="preflight"){await receipt.append({event:"FINAL",status:"ENGINEERING_READY_G2_NOT_AUTHORIZED",modelCalls:0});budget.require(1);return {status:"ENGINEERING_READY_G2_NOT_AUTHORIZED" as const};}
    requireMethodUnitExecutionAuthority(input.authority,input.target);budget.require(1510000);
    creationAttempted=true;await stage("authorized-create",30000,async()=>{created=await runtime.create();return created;});
    if(created!.caseId!==input.target.caseId||created!.runId!==input.target.runId)throw new ObservationStop("METHOD_TARGET_INVALID");
    await receipt.append({event:"CREATED",...created});
    const solverJob=await stage("exact-solver-dispatch",30000,()=>runtime.dispatch(created!.outboxId));
    owned=await stage("exact-solver-claim",30000,async()=>{const candidate=await runtime.claim(solverJob);if(candidate.id!==solverJob.id||candidate.outboxId!==created!.outboxId||candidate.attempts!==1)throw new ObservationStop("METHOD_SOLVER_CLAIM_INVALID");owned=candidate;return candidate;});
    if(!owned||owned.id!==solverJob.id||owned.outboxId!==created!.outboxId||owned.attempts!==1)throw new ObservationStop("METHOD_SOLVER_CLAIM_INVALID");
    await receipt.append({event:"SOLVER_JOB",...owned});await stage("solver-once",1000000,()=>runtime.solver(created!,owned!,budget.controller.signal));owned=undefined;
    const outbox=await stage("automatic-review-only",30000,()=>runtime.automaticReview(created!));if(outbox===created!.outboxId)throw new ObservationStop("METHOD_OUTBOX_COLLISION");
    const reviewJob=await stage("exact-review-dispatch",30000,()=>runtime.dispatch(outbox));
    owned=await stage("exact-review-claim",30000,async()=>{const candidate=await runtime.claim(reviewJob);if(candidate.id!==reviewJob.id||candidate.id===solverJob.id||candidate.outboxId!==outbox||candidate.attempts!==1)throw new ObservationStop("METHOD_REVIEW_CLAIM_INVALID");owned=candidate;return candidate;});
    if(!owned||owned.id!==reviewJob.id||owned.id===solverJob.id||owned.outboxId!==outbox||owned.attempts!==1)throw new ObservationStop("METHOD_REVIEW_CLAIM_INVALID");
    await receipt.append({event:"REVIEW_JOB",...owned});await stage("adversary-host-check-critic",990000,()=>runtime.review(created!,owned!,budget.controller.signal));owned=undefined;
    const result=await stage("retained-ledger7-inspect",30000,()=>runtime.inspect(created!));
    if(result.version!==7||!result.reviewIntegrityValid||result.caseId!==created!.caseId||result.runId!==created!.runId||result.reviewJobId!==reviewJob.id||JSON.stringify(result.roles)!==JSON.stringify(["SOLVER","ADVERSARY","CRITIC"])||!(["PARTIAL","INCONCLUSIVE"].includes(result.conclusion))||!["CHECKED_FINITE","MISSING","UNSUPPORTED","CERTIFICATE_REFUSED"].includes(result.finiteStatus)||result.jobs.length!==2||![solverJob,reviewJob].every(job=>result.jobs.some(j=>j.id===job.id&&j.status==="SUCCEEDED"&&j.attempts===1)))throw new ObservationStop("RETAINED_LEDGER7_MISSING_OR_UNSAFE");
    budget.require(1);await receipt.append({event:"FINAL",status:"COMPLETED_METHOD_UNIT_OBSERVATION",...result});budget.require(1);return {status:"COMPLETED_METHOD_UNIT_OBSERVATION" as const,created,result};
  }catch(e){budget.controller.abort();let cleanup="NOT_OWNED";if(owned){try{await runtime.failOwned(owned);cleanup="FAILED_OWNED";}catch{cleanup="CLEANUP_UNKNOWN";}}
    const code=e instanceof ObservationStop||e instanceof MathDiagnosticError?e.code:"BOUNDED_METHOD_OPERATION_FAILED";
    await receipt.append({event:"FINAL",status:creationAttempted?"PARTIAL_OR_FAILED":"NOT_RUN",code,...created,ownedJob:owned??null,cleanup,usage:null});return {status:creationAttempted?"PARTIAL_OR_FAILED" as const:"NOT_RUN" as const,code};
  }finally{clearTimeout(timer);}
}
