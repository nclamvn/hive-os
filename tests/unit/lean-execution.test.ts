import {describe,it,expect,vi} from "vitest";
import {spawnSync} from "node:child_process";
import {executeLeanResearch,unknownLeanUsage,type LeanProvider,type LeanProblem,type LeanRole,type LeanLimits} from "@/modules/research-sandbox/lean-execution";
import {createDomainProblemContract,listDomainAdapters} from "@/modules/research-sandbox/research-core-v3";
import {replayLeanExecution,replayRetainedLeanExecution} from "../../scripts/research/lean.mts";

const statement="Exact problem statement for this synthetic developer control";
const limits={overallMilliseconds:1000,perCallMilliseconds:200,maxOutputBytes:65536,optionalCalls:2 as const};
const gap={id:"step1",kind:"MISSING_LEMMA",claimStep:"The implication for every positive integer in step one",issue:"This universal implication has no supporting proof yet"};
const draft=(certificate:string|null=null,gaps:unknown[]=[])=>JSON.stringify({argument:"Original retained synthetic draft, not a verified theorem.",certificate,gaps});
const good=JSON.stringify({kind:"INTEGER_WITNESS",values:["2","1"]});
const bad=JSON.stringify({kind:"INTEGER_WITNESS",values:["1","1"]});
const critique=(ids=["step1"])=>JSON.stringify({action:"REPAIR",gapIds:ids,objections:"The retained claim has an explicit unsupported implication.",repairInstruction:"Prove the named implication or retain the unresolved step."});
function exact(kind="LINEAR_WITNESS"):LeanProblem {
  const prepared=createDomainProblemContract({id:"test-lean",rootId:"test-root",target:statement,mode:"ENGINEERING",adapterId:"INTEGER_WITNESS",input:{kind,coefficients:["2","3"],rhs:"7",...(kind==="FINITE_LINEAR_REFUTATION"?{maxValue:3}:{})},obligationId:"exact"});
  return {statement,exact:{prepared,obligationId:"exact",host:{runtimeSourceDigest:"a".repeat(64),sourceBundleDigest:"b".repeat(64),authorityEpoch:"synthetic",checkerSourceDigests:Object.fromEntries(listDomainAdapters().map(a=>[a.id,"c".repeat(64)])),reserveCheck:()=>{}}}};
}
async function run(outputs:Partial<Record<LeanRole,string|Error>>,problem:LeanProblem={statement},overrides:Partial<LeanLimits>={}){
  const invoke=vi.fn<LeanProvider["invoke"]>(async request=>{const response=outputs[request.role];if(response instanceof Error)throw response;if(typeof response!=="string")throw new Error("unexpected role");return {originalBytes:response,usage:unknownLeanUsage};});
  const retain=vi.fn();
  const result=await executeLeanResearch({problem,provider:{invoke},limits:{...limits,...overrides},retain});
  return {result,invoke,retain};
}
describe("primary-first research developer execution",()=>{
  it("uses exactly one primary call without a concrete gap and keeps immutable source",async()=>{
    const {result,invoke,retain}=await run({SOLVER:draft()});
    expect(invoke).toHaveBeenCalledOnce();expect(retain).toHaveBeenCalledOnce();expect(result.calls[0].originalBytes).toBe(draft());expect(Object.isFrozen(result.primary?.draft)).toBe(true);expect(result.status).toBe("UNVERIFIED_ARGUMENT");
  });
  it("does not ask critic for votes on an exact checked certificate",async()=>{
    const {result,invoke}=await run({SOLVER:draft(good,[gap])},exact());expect(invoke).toHaveBeenCalledOnce();expect(result.status).toBe("EXACT_SCOPE_VERIFIED");expect(result.checks).toBe(1);expect(result.wholeProblemSolved).toBe(false);
  });
  it("repairs a wrong candidate after the named checker objection with at most3 calls/2 checks",async()=>{
    const {result,invoke}=await run({SOLVER:draft(bad),CRITIC:critique(["host-check"]),REPAIR:draft(good)},exact());
    expect(result.status).toBe("EXACT_SCOPE_VERIFIED");expect(result.checks).toBe(2);expect(result.calls.map(c=>c.role)).toEqual(["SOLVER","CRITIC","REPAIR"]);expect(invoke.mock.calls[1][0].prompt).toContain("Equation does not hold");expect(result.primary?.receipt?.scientificDisposition).toBe("INVALID_CANDIDATE");expect(result.revisions).toHaveLength(1);
  });
  it("returns refuted exact predicate terminally rather than trying to save a false predicate",async()=>{
    const {result,invoke}=await run({SOLVER:draft(JSON.stringify({kind:"FINITE_EXHAUSTION",checkedAssignments:9}))},exact("FINITE_LINEAR_REFUTATION"));expect(result.status).toBe("EXACT_PREDICATE_REFUTED");expect(invoke).toHaveBeenCalledOnce();expect(result.primary?.receipt?.refutation).not.toBeNull();
  });
  it.each(["CRITIC","REPAIR"] as const)("retains primary on optional %s failure with unknown usage",async role=>{
    const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:new Error("failed"),[role]:new Error("failed")});expect(result.selected).toBe(result.primary);expect(result.status).toBe("UNRESOLVED");expect(result.calls.at(-1)?.usage.inputTokens).toBeNull();
  });
  it("supports budget disabling both optional calls",async()=>{const {result}=await run({SOLVER:draft(null,[gap])},{statement},{optionalCalls:0});expect(result.calls).toHaveLength(1);expect(result.remainingGaps).toHaveLength(1);});
  it("critic-only budget never silently launches a repair",async()=>{const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique()},{statement},{optionalCalls:1});expect(result.calls).toHaveLength(2);expect(result.selected).toBe(result.primary);});
  it("retains malformed optional original before refusing adoption",async()=>{const {result,retain}=await run({SOLVER:draft(null,[gap]),CRITIC:"not JSON"});expect(result.selected).toBe(result.primary);expect(retain.mock.calls[1][0].originalBytes).toBe("not JSON");});
  it("rejects critique referencing a nonexistent gap without a repair",async()=>{const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(["invented"])});expect(result.calls).toHaveLength(2);expect(result.failures.join()).toContain("UNKNOWN_GAP");});
  it("ignores decorative confidence without discarding a usable primary draft",async()=>{const {result}=await run({SOLVER:draft(null,[{...gap,issue:"confidence is low, please review everything"}])});expect(result.status).toBe("UNVERIFIED_ARGUMENT");expect(result.calls).toHaveLength(1);expect(result.primary).not.toBeNull();expect(result.failures).toContain("NON_SPECIFIC_GAP_IGNORED:step1");});
  it("decorative metadata does not gate a valid checked certificate",async()=>{const {result}=await run({SOLVER:draft(good,[{...gap,issue:"please review everything for confidence and style"}])},exact());expect(result.status).toBe("EXACT_SCOPE_VERIFIED");expect(result.calls).toHaveLength(1);});
  it("does not rewrite an unchanged draft or recheck its certificate",async()=>{const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:draft(null,[gap])});expect(result.selected).toBe(result.primary);expect(result.failures).toContain("REPAIR:UNCHANGED_PROPOSAL");expect(result.revisions).toHaveLength(0);});
  it("keeps earlier primary when a changed repair certificate is rejected",async()=>{const changed=JSON.stringify({argument:"Changed synthetic draft still proposes the wrong tuple.",certificate:bad,gaps:[]});const {result}=await run({SOLVER:draft(bad),CRITIC:critique(["host-check"]),REPAIR:changed},exact());expect(result.selected).toBe(result.primary);expect(result.revisions).toHaveLength(1);expect(result.failures).toContain("REPAIR:NOT_ADOPTED");});
  it("does not mint receipt or dispatch criticism for an unsupported tool scope",async()=>{const {result}=await run({SOLVER:draft(good)},{statement});expect(result.status).toBe("UNVERIFIED_ARGUMENT");expect(result.calls).toHaveLength(1);expect(result.primary?.receipt).toBeNull();expect(result.checks).toBe(0);expect(result.authorityGranted).toBe(false);});
  it("does not repair on a generic critic approval",async()=>{const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:JSON.stringify({action:"REPAIR",gapIds:["step1"],objections:"Everything looks good and the model seems confident.",repairInstruction:"Rewrite the draft in a more polished and elegant style."})});expect(result.calls).toHaveLength(2);expect(result.failures.join()).toContain("NO_CONCRETE_OBJECTION");});
  it("NO_CHANGE critic action never forces a rewrite or accepts a proof",async()=>{const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:JSON.stringify({action:"NO_CHANGE",gapIds:["step1"],objections:"This issue is not resolved by the supplied draft or material.",repairInstruction:"Keep the unresolved lemma and do not rewrite the argument."})});expect(result.calls).toHaveLength(2);expect(result.status).toBe("UNRESOLVED");});
  it("accepts empty NO_CHANGE IDs without rewriting, erasing gaps or certifying prose",async()=>{
    const original=JSON.stringify({action:"NO_CHANGE",gapIds:[],objections:"No substantive failure identified under the supplied assumptions.",repairInstruction:"No rewrite requested; this bounded review is not a certificate."});
    const {result,invoke}=await run({SOLVER:draft(null,[gap]),CRITIC:original});
    expect(result.calls).toHaveLength(2);expect(result.calls[1].originalBytes).toBe(original);
    expect(result.failures).toEqual([]);expect(result.selected).toBe(result.primary);expect(result.revisions).toHaveLength(0);
    expect(result.remainingGaps).toEqual([gap]);expect(result.status).toBe("UNRESOLVED");expect(result.checks).toBe(0);
    expect(result.wholeProblemSolved).toBe(false);expect(result.authorityGranted).toBe(false);
    expect(invoke.mock.calls[1][0].prompt).toContain("REPAIR must name at least one supplied gap ID");
    expect(invoke.mock.calls[1][0].prompt).toContain("NO_CHANGE may use gapIds=[]");
  });
  it("still refuses a REPAIR with no concrete gap IDs",async()=>{
    const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique([])});
    expect(result.calls).toHaveLength(2);expect(result.failures.join()).toContain("REPAIR must name a concrete gap");
    expect(result.selected).toBe(result.primary);expect(result.remainingGaps).toEqual([gap]);expect(result.revisions).toHaveLength(0);
  });
  it("still refuses unknown and duplicate NO_CHANGE IDs",async()=>{
    for(const gapIds of [["invented"],["step1","step1"]]){
      const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:JSON.stringify({action:"NO_CHANGE",gapIds,objections:"No substantive defect identified in the supplied argument.",repairInstruction:"No rewrite requested and no mathematical proof is certified."})});
      expect(result.failures.join()).toContain("UNKNOWN_GAP");expect(result.calls).toHaveLength(2);expect(result.selected).toBe(result.primary);
    }
  });
  it("reports missing exact certificate rather than treating the exact target as gapless",async()=>{const {result}=await run({SOLVER:draft()},exact(),{optionalCalls:0});expect(result.status).toBe("UNRESOLVED");expect(result.remainingGaps[0].issue).toContain("MISSING_EXACT_CERTIFICATE");});
  it("does not erase untouched primary gaps because a repair omitted them",async()=>{const changed=JSON.stringify({argument:"Rewritten argument that still has not supplied the missing lemma.",certificate:null,gaps:[]});const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:changed});expect(result.selected?.draft.gaps.map(g=>g.id)).toContain("step1");expect(result.status).toBe("UNRESOLVED");});
  it("metadata-only addressed IDs cannot wash pending gaps",async()=>{const metadata=JSON.stringify({...JSON.parse(draft(null,[gap])),gaps:[],addressedGapIds:["step1"]});const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:metadata});expect(result.selected).toBe(result.primary);expect(result.failures).toContain("REPAIR:UNCHANGED_PROPOSAL");expect(result.remainingGaps.map(g=>g.id)).toContain("step1");});
  it("changed unverified argument still retains every original gap claimed addressed",async()=>{const changed=JSON.stringify({argument:"Changed prose claims a repair but has no compatible exact proof receipt.",certificate:null,gaps:[],addressedGapIds:["step1"]});const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:changed});expect(result.selected?.draft.addressedGapIds).toEqual(["step1"]);expect(result.remainingGaps.map(g=>g.id)).toContain("step1");expect(result.status).toBe("UNRESOLVED");});
  it("a repaired same-ID gap cannot retarget the original pending obligation",async()=>{const changed=JSON.stringify({argument:"Changed argument attempts to redefine an unresolved obligation.",certificate:null,gaps:[{...gap,claimStep:"An unrelated claim with entirely different quantifiers",issue:"The rewritten claim is easier but unrelated to the original"}]});const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:changed});expect(result.remainingGaps.find(g=>g.id==="step1")).toEqual(gap);expect(result.status).toBe("UNRESOLVED");});
  it("retains3 original plus3 new gaps instead of silently truncating obligations",async()=>{const originals=[gap,{...gap,id:"step2"},{...gap,id:"step3"}],fresh=[{...gap,id:"new1"},{...gap,id:"new2"},{...gap,id:"new3"}];const changed=JSON.stringify({argument:"Changed retained draft proposes three additional unresolved steps.",certificate:null,gaps:fresh});const {result}=await run({SOLVER:draft(null,originals),CRITIC:critique(),REPAIR:changed});expect(result.remainingGaps.map(g=>g.id).sort()).toEqual(["new1","new2","new3","step1","step2","step3"]);});
  it("adding a host-check gap never drops the third original obligation",async()=>{const {result}=await run({SOLVER:draft(bad,[gap,{...gap,id:"step2"},{...gap,id:"step3"}])},exact(),{optionalCalls:0});expect(result.remainingGaps).toHaveLength(4);expect(result.remainingGaps.map(g=>g.id)).toContain("step3");});
  it("refuses repair claims about an obligation not selected by the critic",async()=>{const changed=JSON.stringify({argument:"Attempted rewritten argument with an invented resolution claim.",certificate:null,gaps:[],addressedGapIds:["invented"]});const {result}=await run({SOLVER:draft(null,[gap]),CRITIC:critique(),REPAIR:changed});expect(result.selected).toBe(result.primary);expect(result.failures.join()).toContain("UNSUPPORTED_GAP_RESOLUTION");});
  it("stops on host authority failure instead of asking critic to bypass it",async()=>{const problem=exact();problem.exact!.host.reserveCheck=()=>{throw new Error("ordinary storage failure");};const prepared=problem.exact!.prepared;problem.exact!.host.checkerSourceDigests={};const {result}=await run({SOLVER:draft(good)},problem);expect(result.calls).toHaveLength(1);expect(result.failures.join()).toContain("HOST_BOUNDARY:AUTHORITY_REFUSED");expect(result.selected?.receipt).toBeNull();expect(prepared.contract.target).toBe(statement);});
  it("a generic host reservation/storage exception is not a mathematical repair gap",async()=>{const problem=exact();problem.exact!.host.reserveCheck=()=>{throw new Error("storage refused");};const {result}=await run({SOLVER:draft(good)},problem);expect(result.calls).toHaveLength(1);expect(result.failures).toContain("HOST_BOUNDARY:CHECKER_FAILURE");});
  it("aborts the optional port at deadline and keeps the original draft",async()=>{
    let aborted=false;const provider:LeanProvider={invoke:request=>request.role==="SOLVER"?Promise.resolve({originalBytes:draft(null,[gap]),usage:unknownLeanUsage}):new Promise((_,reject)=>request.signal.addEventListener("abort",()=>{aborted=true;reject(new Error("aborted"));}))};
    const result=await executeLeanResearch({problem:{statement},provider,limits:{...limits,overallMilliseconds:60,perCallMilliseconds:25},retain:()=>{}});expect(aborted).toBe(true);expect(result.selected).toBe(result.primary);expect(result.calls).toHaveLength(2);expect(result.failures.join()).toMatch(/TIMEOUT|aborted/);
  });
  it("enforces one cumulative output cap, not renewed per-role caps",async()=>{
    const first=draft(null,[gap]);const {result,invoke}=await run({SOLVER:first,CRITIC:critique()},{statement},{maxOutputBytes:Buffer.byteLength(first)+10});expect(invoke.mock.calls[1][0].maxResponseBytes).toBe(10);expect(result.calls[1].failure).toBe("OUTPUT_LIMIT");expect(result.selected).toBe(result.primary);
  });
  it("refuses malformed usage and preserves unknown instead of converting it to zero",async()=>{
    const result=await executeLeanResearch({problem:{statement},provider:{invoke:async()=>({originalBytes:draft(),usage:{...unknownLeanUsage,inputTokens:-1}})},limits,retain:()=>{}});expect(result.status).toBe("PRIMARY_FAILED");expect(result.calls[0].originalBytes).toBe(draft());expect(result.calls[0].usage.inputTokens).toBeNull();
  });
  it("a retention failure stops all later calls and candidate adoption",async()=>{
    const invoke=vi.fn(async()=>({originalBytes:draft(null,[gap]),usage:unknownLeanUsage}));await expect(executeLeanResearch({problem:{statement},provider:{invoke},limits,retain:()=>{throw new Error("storage failed");}})).rejects.toThrow("storage failed");expect(invoke).toHaveBeenCalledOnce();
  });
  it("bounds even a never-resolving retention port by the overall deadline",async()=>{await expect(executeLeanResearch({problem:{statement},provider:{invoke:async()=>({originalBytes:draft(),usage:unknownLeanUsage})},limits:{...limits,overallMilliseconds:30,perCallMilliseconds:20},retain:()=>new Promise(()=>{})})).rejects.toThrow("RETENTION_TIMEOUT");});
  it("detects synchronous provider overrun even before its timer can fire",async()=>{const result=await executeLeanResearch({problem:{statement},provider:{invoke:async()=>{const start=performance.now();while(performance.now()-start<8){}return {originalBytes:draft(),usage:unknownLeanUsage};}},limits:{...limits,perCallMilliseconds:2},retain:()=>{}});expect(result.status).toBe("PRIMARY_FAILED");expect(result.calls[0].failure).toBe("TIMEOUT");});
  it("accepts retained draft data without mistaking replay for fresh model inference",async()=>{const replay=await replayRetainedLeanExecution({statement,outputs:{SOLVER:draft()},optionalCalls:0});expect(replay.label).toBe("RETAINED_OUTPUT_REPLAY");expect(replay.result.status).toBe("UNVERIFIED_ARGUMENT");expect(replay.result.calls[0].usage.calls).toBeNull();expect(replay.liveTransportInvoked).toBe(false);});
  it("retained replay cannot inject a host receipt/source grant",async()=>{await expect(replayRetainedLeanExecution({statement,outputs:{SOLVER:draft()},host:{authorityEpoch:"forged"}})).rejects.toThrow();});
  it("launches the actual retained-file CLI using bounded synthetic fixture data",()=>{const child=spawnSync(process.execPath,["--import","tsx","scripts/research/lean.mts","--replay-file","tests/fixtures/lean-retained-replay.json"],{encoding:"utf8",timeout:2000,maxBuffer:65536});expect(child.error).toBeUndefined();expect(child.status).toBe(0);const observation=JSON.parse(child.stdout);expect(observation.label).toBe("RETAINED_OUTPUT_REPLAY");expect(observation.result.status).toBe("EXACT_SCOPE_VERIFIED");expect(observation.liveTransportInvoked).toBe(false);});
  it("executes five labelled replay scenarios without claiming a live model",async()=>{const replay=await replayLeanExecution();expect(replay.label).toBe("SYNTHETIC_LEAN_EXECUTION_REPLAY");expect(replay.liveTransportInvoked).toBe(false);expect(replay.observations.map(o=>o.result.calls.length)).toEqual([1,1,3,2,1]);});
});
