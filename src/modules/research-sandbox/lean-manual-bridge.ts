import {createHash} from "node:crypto";
import {z} from "zod";
import {assertNoCredentialMaterial} from "@/modules/execution-fabric/contracts";
import {executeLeanResearch,unknownLeanUsage,type LeanProblem,type LeanRole} from "./lean-execution";
import {createDomainProblemContract,listDomainAdapters} from "./research-core-v3";
import {boundedJson,frozen} from "./research-core-v3/bounded-json";

const schema=z.object({statement:z.string().trim().min(12).max(12000),adapterId:z.enum(["NONE","INTEGER_WITNESS","FINITE_GRAPH","POLYNOMIAL_IDENTITY","RATIONAL_INTERVAL_FLOOR"]),domainInput:z.string().max(8192),
  solver:z.string().max(32768),critic:z.string().max(8192),repair:z.string().max(32768)}).strict();
export type LeanManualInput=z.infer<typeof schema>;
export function parseLeanManualInput(raw:unknown):LeanManualInput {
  const input=schema.parse(boundedJson(raw,524288,32));
  if([input.statement,input.domainInput,input.solver,input.critic,input.repair].reduce((n,s)=>n+Buffer.byteLength(s,"utf8"),0)>65536)throw new Error("MANUAL_INPUT_LIMIT");
  for(const value of Object.values(input))assertNoCredentialMaterial(value);
  if(input.adapterId==="NONE"?Boolean(input.domainInput.trim()):!input.domainInput.trim())throw new Error("EXACT_INPUT_MISMATCH");
  return frozen(input);
}
/** Authenticated host must own this local-only operation; no provider dispatch.
 * Input supplies data only, never host configuration, usage, receipts or grants. */
export async function runLeanManualBridge(raw:unknown){
  const input=parseLeanManualInput(raw),problem:LeanProblem={statement:input.statement};
  let checkedProblem:unknown=null;
  if(input.adapterId!=="NONE"){
    const prepared=createDomainProblemContract({id:"manual-workbench",rootId:"LEAN_AUTHENTICATED_WORKBENCH_090",target:input.statement,mode:"ENGINEERING",adapterId:input.adapterId,
      input:boundedJson(input.domainInput,65536,256),obligationId:"exact"});
    const pin=createHash("sha256").update("LOCAL_MANUAL_CHECK_BINDING_NOT_REVIEWED_SOURCE_AUTHORITY").digest("hex");
    problem.exact={prepared,obligationId:"exact",host:{runtimeSourceDigest:pin,sourceBundleDigest:pin,authorityEpoch:"local-manual-input-only",checkerSourceDigests:Object.fromEntries(listDomainAdapters().map(a=>[a.id,pin])),reserveCheck:()=>{}}};
    checkedProblem={adapterId:prepared.contract.domain.adapterId,input:prepared.contract.domain.input,inputDigest:prepared.inputDigest,predicate:prepared.contract.obligations[0].predicate,quantifiers:prepared.contract.quantifiers,acceptanceType:prepared.contract.obligations[0].acceptanceType,
      proseAlignment:"NOT_ESTABLISHED",sourceAuthority:"NOT_ESTABLISHED_LOCAL_ENGINEERING_ONLY"};
  }
  const outputs={SOLVER:input.solver,CRITIC:input.critic,REPAIR:input.repair},prompts:{role:LeanRole;text:string}[]=[];
  let awaiting:{role:LeanRole;prompt:string}|null=null;
  const retained:string[]=[];
  const result=await executeLeanResearch({problem,limits:{overallMilliseconds:10000,perCallMilliseconds:1000,maxOutputBytes:65536,optionalCalls:2},retain:call=>{if(call.originalBytes!==null)retained.push(call.role);},
    provider:{invoke:async request=>{
      prompts.push({role:request.role,text:request.prompt});
      const originalBytes=outputs[request.role];
      if(!originalBytes.trim()){awaiting={role:request.role,prompt:request.prompt};throw new Error("AWAITING_MANUAL_INPUT");}
      return {originalBytes,usage:unknownLeanUsage};
    }}});
  return frozen({origin:"OPERATOR_SUPPLIED_MODEL_OUTPUTS" as const,upstreamIdentity:"OPERATOR_IMPORT_NOT_CRYPTOGRAPHICALLY_AUTHENTICATED" as const,liveTransportInvoked:false as const,freshSolverResult:false as const,sourceAuthority:"NOT_ESTABLISHED_LOCAL_ENGINEERING_ONLY" as const,durableDatabaseJob:false as const,
    input,result,prompts,awaiting:awaiting as {role:LeanRole;prompt:string}|null,checkedProblem,importedRoles:retained,liveModelRequests:0 as const,observedUsage:"UNKNOWN" as const,
    failures:result.failures.filter(reason=>!reason.endsWith(":AWAITING_MANUAL_INPUT"))});
}
export type LeanManualObservation=Awaited<ReturnType<typeof runLeanManualBridge>>;
