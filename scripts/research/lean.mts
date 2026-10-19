import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {open} from "node:fs/promises";
import {constants} from "node:fs";
import {z} from "zod";
import {executeLeanResearch,unknownLeanUsage,type LeanGap,type LeanProvider,type LeanProblem,type LeanRole} from "../../src/modules/research-sandbox/lean-execution";
import {createDomainProblemContract,listDomainAdapters} from "../../src/modules/research-sandbox/research-core-v3";
import {boundedJson} from "../../src/modules/research-sandbox/research-core-v3/bounded-json";

const replaySchema=z.object({statement:z.string().min(12).max(16384),exact:z.object({adapterId:z.string().max(120),input:z.unknown()}).strict().optional(),
  outputs:z.object({SOLVER:z.string().max(32768),CRITIC:z.string().max(16384).optional(),REPAIR:z.string().max(32768).optional()}).strict(),optionalCalls:z.union([z.literal(0),z.literal(1),z.literal(2)]).default(2)}).strict();
/** Data replay only. Input cannot provide receipts/source authority/provider config. */
export async function replayRetainedLeanExecution(raw:unknown){
  const data=replaySchema.parse(boundedJson(raw,524288,32));
  const problem:LeanProblem={statement:data.statement};
  if(data.exact){
    const prepared=createDomainProblemContract({id:"retained-developer-replay",rootId:"LEAN_PRIMARY_RESEARCH_EXECUTION_089",target:data.statement,mode:"ENGINEERING",adapterId:data.exact.adapterId,input:data.exact.input,obligationId:"exact"});
    const pin=createHash("sha256").update("DEVELOPER_REPLAY_BINDING_NOT_SOURCE_AUTHORITY").digest("hex");
    problem.exact={prepared,obligationId:"exact",host:{runtimeSourceDigest:pin,sourceBundleDigest:pin,authorityEpoch:"developer-retained-replay",checkerSourceDigests:Object.fromEntries(listDomainAdapters().map(a=>[a.id,pin])),reserveCheck:()=>{}}};
  }
  const retained:LeanRole[]=[];
  const provider:LeanProvider={invoke:async request=>{const originalBytes=data.outputs[request.role];if(originalBytes===undefined)throw new Error("REPLAY_OUTPUT_NOT_SUPPLIED");return {originalBytes,usage:unknownLeanUsage};}};
  const result=await executeLeanResearch({problem,provider,limits:{overallMilliseconds:10000,perCallMilliseconds:1000,maxOutputBytes:65536,optionalCalls:data.optionalCalls},retain:call=>{retained.push(call.role);}});
  return {label:"RETAINED_OUTPUT_REPLAY",freshSolverResult:false,authorityGranted:false,liveTransportInvoked:false,sourceAuthority:"NOT_ESTABLISHED_DEVELOPER_ONLY",result,retained};
}

/** Explicit fixture port: no model, network, auth, filesystem or mathematical campaign. */
export async function replayLeanExecution() {
  const pin=createHash("sha256").update("SYNTHETIC_DEVELOPER_BINDING_NOT_RELEASE_AUTHORITY").digest("hex");
  const prepared=createDomainProblemContract({id:"lean-demo",rootId:"LEAN_PRIMARY_RESEARCH_EXECUTION_089",target:"Synthetic positive integer witness for 2x+3y=7",mode:"ENGINEERING",adapterId:"INTEGER_WITNESS",input:{kind:"LINEAR_WITNESS",coefficients:["2","3"],rhs:"7"},obligationId:"exact"});
  const exact={prepared,obligationId:"exact",host:{runtimeSourceDigest:pin,sourceBundleDigest:pin,authorityEpoch:"synthetic-developer-only",checkerSourceDigests:Object.fromEntries(listDomainAdapters().map(a=>[a.id,pin])),reserveCheck:()=>{}}};
  const good=JSON.stringify({argument:"Synthetic fixture proposes x=2, y=1; only substitution is checked.",certificate:JSON.stringify({kind:"INTEGER_WITNESS",values:["2","1"]}),gaps:[]});
  const bad=JSON.stringify({argument:"Synthetic deliberately wrong witness x=1, y=1.",certificate:JSON.stringify({kind:"INTEGER_WITNESS",values:["1","1"]}),gaps:[]});
  const gap:LeanGap={id:"lemma",kind:"MISSING_LEMMA",claimStep:"The claimed implication for all positive integers",issue:"A proof of this universal implication is still missing"};
  const prose=JSON.stringify({argument:"Synthetic retained draft only, not a mathematical proof.",certificate:null,gaps:[]});
  const missing=JSON.stringify({argument:"Synthetic draft retains an unresolved lemma, not a proof.",certificate:null,gaps:[gap]});
  const cases:[string,LeanProblem,Partial<Record<LeanRole,string|Error>>][]=[
    ["no-gap-fast-path",{statement:"Inspect this synthetic argument without pretending it is verified."},{SOLVER:prose}],
    ["exact-check",{statement:prepared.contract.target,exact},{SOLVER:good}],
    ["targeted-repair",{statement:prepared.contract.target,exact},{SOLVER:bad,CRITIC:JSON.stringify({action:"REPAIR",gapIds:["host-check"],objections:"The retained tuple gives 2+3=5 instead of the sealed rhs 7.",repairInstruction:"Replace that tuple by one satisfying the exact sealed equation."}),REPAIR:good}],
    ["optional-failure",{statement:"Retain an incomplete synthetic argument when optional critique fails."},{SOLVER:missing,CRITIC:new Error("SYNTHETIC_OPTIONAL_FAILURE")}],
    ["unsupported-argument",{statement:"Prove a universal statement outside the installed exact adapters."},{SOLVER:prose}],
  ];
  const observations=[];
  for(const [name,problem,outputs] of cases){
    const retained:LeanRole[]=[];
    const provider:LeanProvider={invoke:async request=>{const output=outputs[request.role];if(output instanceof Error)throw output;if(typeof output!=="string")throw new Error("Unexpected fixture call");return {originalBytes:output,usage:unknownLeanUsage};}};
    const result=await executeLeanResearch({problem,provider,limits:{overallMilliseconds:10000,perCallMilliseconds:1000,maxOutputBytes:65536,optionalCalls:2},retain:call=>{retained.push(call.role);}});
    observations.push({name,result,retained});
  }
  return {label:"SYNTHETIC_LEAN_EXECUTION_REPLAY",freshSolverResult:false,authorityGranted:false,liveTransportInvoked:false,observations};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  if(process.argv.length===4&&process.argv[2]==="--replay-file"){
    const file=await open(resolve(process.argv[3]),constants.O_RDONLY|constants.O_NOFOLLOW);
    try{const stat=await file.stat();if(!stat.isFile()||stat.size>65536)throw new Error("Replay file must be regular JSON <=65536 bytes");const bytes=Buffer.alloc(stat.size);let offset=0;while(offset<bytes.length){const read=await file.read(bytes,offset,bytes.length-offset,offset);if(!read.bytesRead)throw new Error("Replay file changed");offset+=read.bytesRead;}if((await file.stat()).size!==stat.size)throw new Error("Replay file changed");console.log(JSON.stringify(await replayRetainedLeanExecution(bytes.toString("utf8")),null,2));}
    finally{await file.close();}
  }else if(process.argv.length===2){
    const replay=await replayLeanExecution();console.log(JSON.stringify(replay,null,2));
    const expected=["UNVERIFIED_ARGUMENT","EXACT_SCOPE_VERIFIED","EXACT_SCOPE_VERIFIED","UNRESOLVED","UNVERIFIED_ARGUMENT"];
    if(replay.observations.some((o,i)=>o.result.status!==expected[i])||replay.observations[2].result.calls.length!==3)process.exitCode=1;
    else console.log("research:lean COMPLETE SYNTHETIC 5 scenarios primary-first");
  }else{throw new Error("Usage: npm run research:lean [-- --replay-file <bounded-json-file>]");}
}
