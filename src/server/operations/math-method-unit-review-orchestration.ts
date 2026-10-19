import {randomUUID} from "node:crypto";
import {canonicalJson,sha256} from "@/modules/execution-fabric/contracts";
import {mathAgentReportSchema,type MathAgentReport} from "@/modules/research-sandbox/agent-review";
import {assertLrcMethodUnitAttemptBinding,prepareLrcMethodUnitReviewInput,lrcMethodUnitSolverMathematics,validateLrcMethodUnitReviewOutput,validatePreparedLrcMethodUnitInput,validLrcMethodUnitUsage,type LrcMethodUnitLiveBinding,type PreparedLrcMethodUnitLiveInput} from "@/modules/research-sandbox/math-lrc-method-unit-live";
import {buildLrcMethodUnitFiniteEvidence,validateLrcMethodUnitFiniteEvidence} from "@/modules/research-sandbox/math-lrc-method-unit";
import {MathDiagnosticError,type DiagnosticBinding} from "@/modules/research-sandbox/math-transport-diagnostics";
import {beginMethodUnitStage,requireMethodUnitExecutionAuthority,type MethodUnitJobRuntime} from "./math-method-unit-authority";
import {MethodUnitTransportCapture} from "./math-method-unit-transport";

/** Existing review job's v4 branch. No executor, retry, database access or live authority mint. */
export async function runMethodUnitOrderedReview(input:{runtime:MethodUnitJobRuntime;binding:LrcMethodUnitLiveBinding;
  diagnosticBinding:Omit<DiagnosticBinding,"dispatchId"|"role">;attempt:unknown;attemptDigest:string;signal?:AbortSignal;
  fence:()=>Promise<void>;review:(prepared:PreparedLrcMethodUnitLiveInput,capture:MethodUnitTransportCapture)=>Promise<MathAgentReport>}) {
  const {runtime,binding}=input;
  const check=()=>{requireMethodUnitExecutionAuthority(runtime.authority,binding);if(input.signal?.aborted)throw new MathDiagnosticError("CANCELLED");assertLrcMethodUnitAttemptBinding(input.attempt,binding);if(sha256(canonicalJson(input.attempt))!==input.attemptDigest)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");};
  const seed=lrcMethodUnitSolverMathematics(input.attempt).lrcMethodUnitFiniteSeed;
  check();
  beginMethodUnitStage(runtime.authority,binding,"ADVERSARY");
  const adversaryInput=prepareLrcMethodUnitReviewInput({...binding,role:"ADVERSARY",solverAttempt:input.attempt,solverAttemptDigest:input.attemptDigest});
  const adversaryCapture=await MethodUnitTransportCapture.reserve(runtime,{...input.diagnosticBinding,role:"ADVERSARY",dispatchId:randomUUID()});
  await adversaryCapture.prepared(adversaryInput);
  await input.fence();check();
  const perform=async(prepared:PreparedLrcMethodUnitLiveInput,capture:MethodUnitTransportCapture,finiteEvidence?:ReturnType<typeof buildLrcMethodUnitFiniteEvidence>)=>{
    check();await input.fence();check();const before=canonicalJson(prepared),report=await input.review(prepared,capture);await input.fence();check();capture.requireReturned(report);
    if(before!==canonicalJson(prepared)||!validatePreparedLrcMethodUnitInput(prepared,{...binding,role:prepared.role,solverAttempt:input.attempt,solverAttemptDigest:input.attemptDigest,...(finiteEvidence?{finiteEvidence,finiteSourcePins:runtime.finiteSourcePins}:{})})||
      ["lrcMethodUnitInput","lrcMethodUnitEvidence","lrcMethodUnitFiniteEvidence","lrcProofUnitInput","lrcProofUnitFeedback"].some(k=>k in report)||report.role!==prepared.role||!validLrcMethodUnitUsage(report.usage)||report.threadId===(input.attempt as {threadId?:string}).threadId)throw new MathDiagnosticError("OUTPUT_BINDING_MISMATCH");
    validateLrcMethodUnitReviewOutput(Object.fromEntries(["role","verdict","candidateConclusion","exactQuote","reasoning","checks","unresolvedGap","lrcMethodUnitFeedback"].map(k=>[k,(report as Record<string,unknown>)[k]])),prepared.role as "ADVERSARY"|"CRITIC");
    return mathAgentReportSchema.parse({...report,lrcMethodUnitInput:prepared});
  };
  const adversary=await perform(adversaryInput,adversaryCapture);
  // The critic's worst-case slot is mandatory BEFORE invoking producer/consumer.
  const criticCapture=await MethodUnitTransportCapture.reserve(runtime,{...input.diagnosticBinding,role:"CRITIC",dispatchId:randomUUID()});
  check();await input.fence();check();beginMethodUnitStage(runtime.authority,binding,"HOST_FINITE_CHECK");
  const finiteBinding={caseId:binding.caseId,runId:binding.runId,contractDigest:binding.contractDigest,reviewJobId:input.diagnosticBinding.jobId,solverAttemptDigest:input.attemptDigest,adversaryReportDigest:sha256(canonicalJson(adversary))};
  let finiteEvidence:ReturnType<typeof buildLrcMethodUnitFiniteEvidence>;
  try{finiteEvidence=buildLrcMethodUnitFiniteEvidence({binding:finiteBinding,seed,pins:runtime.finiteSourcePins});
    if(!validateLrcMethodUnitFiniteEvidence(finiteEvidence,{binding:finiteBinding,pins:runtime.finiteSourcePins,seed}))throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    await criticCapture.finite(finiteEvidence);
    await runtime.journal({event:"HOST_FINITE_CHECK_RETURNED",captureId:criticCapture.handle.captureId,status:finiteEvidence.status,recordDigest:finiteEvidence.recordDigest});
  }catch(e){await criticCapture.finish(e instanceof MathDiagnosticError?e.code:"MATH_SCHEMA_INVALID");throw e;}
  if(finiteEvidence.status==="RESOURCE_REFUSED"){await criticCapture.finish("OPERATION_DEADLINE");throw new MathDiagnosticError("OPERATION_DEADLINE");}
  check();
  const criticInput=prepareLrcMethodUnitReviewInput({...binding,role:"CRITIC",solverAttempt:input.attempt,solverAttemptDigest:input.attemptDigest,finiteEvidence,finiteSourcePins:runtime.finiteSourcePins});
  await criticCapture.prepared(criticInput);beginMethodUnitStage(runtime.authority,binding,"CRITIC");
  const critic=await perform(criticInput,criticCapture,finiteEvidence);
  if(critic.threadId===adversary.threadId)throw new MathDiagnosticError("OUTPUT_BINDING_MISMATCH");
  return {reports:[adversary,critic] as [MathAgentReport,MathAgentReport],finiteEvidence};
}
