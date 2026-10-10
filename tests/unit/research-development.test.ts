import {describe,it,expect,vi} from "vitest";
import {runResearchChecks} from "../../scripts/research/check.mjs";
import {knownPublicFloor,replayEngineeringCandidate} from "../../scripts/research/replay.mts";

type Run=NonNullable<NonNullable<Parameters<typeof runResearchChecks>[0]>["run"]>;

describe("lean developer orchestration",()=>{
  it("executes syntax, actual typecheck, focused tests, then both real replay CLIs in order",()=>{
    const run=vi.fn<Run>(()=>({status:0,stdout:JSON.stringify({label:"SYNTHETIC_KNOWN_PUBLIC_ENGINEERING_REPLAY",status:"SUPPORTED_UNDER_LEMMA_ARITHMETIC",derivedFloor:"499999999972"},null,2)+"\nresearch:replay COMPLETE SYNTHETIC floor=499999999972 arithmetic-only\n\"label\": \"SYNTHETIC_LEAN_EXECUTION_REPLAY\"\nresearch:lean COMPLETE SYNTHETIC 5 scenarios primary-first"}));
    expect(runResearchChecks({run,clock:()=>0,report:()=>{}})).toBe(0);
    expect(run.mock.calls).toHaveLength(5);
    expect(run.mock.calls.map(call=>call[1])).toEqual([
      ["--check","scripts/research/check.mjs"],
      ["node_modules/typescript/bin/tsc","--project","tsconfig.research.json","--pretty","false"],
      ["node_modules/vitest/vitest.mjs","run","--config","vitest.research.config.ts"],
      ["--import","tsx","scripts/research/replay.mts"],
      ["--import","tsx","scripts/research/lean.mts"],
    ]);
  });
  it.each([0,1,2,3,4])("stops at failing stage %s without later stages or completion",failed=>{
    let calls=0;
    const run=vi.fn(()=>({status:calls++===failed?2:0,stdout:'"label": "SYNTHETIC_KNOWN_PUBLIC_ENGINEERING_REPLAY", "status": "SUPPORTED_UNDER_LEMMA_ARITHMETIC", "derivedFloor": "499999999972"\nresearch:replay COMPLETE SYNTHETIC floor=499999999972 arithmetic-only'}));
    expect(runResearchChecks({run,clock:()=>0,report:()=>{}})).toBe(2);
    expect(run).toHaveBeenCalledTimes(failed+1);
  });
  it("stops on a simulated native timeout without a failed subprocess",()=>{
    const run=vi.fn(()=>({status:null,error:new Error("ETIMEDOUT")}));
    expect(runResearchChecks({run,clock:()=>0,report:()=>{}})).toBe(1);
    expect(run).toHaveBeenCalledOnce();
  });
  it("refuses a signalled subprocess even when its status claims success",()=>{
    const run=vi.fn(()=>({status:0,signal:"SIGKILL"}));
    expect(runResearchChecks({run,clock:()=>0,report:()=>{}})).toBe(1);
    expect(run).toHaveBeenCalledOnce();
  });
  it("refuses an empty successful replay CLI instead of accepting an unexecuted entrypoint",()=>{
    const run=vi.fn(()=>({status:0,stdout:""}));
    expect(runResearchChecks({run,clock:()=>0,report:()=>{}})).toBe(1);
    expect(run).toHaveBeenCalledTimes(4);
  });
  it("uses the remaining overall deadline rather than renewing each command",()=>{
    let now=0;
    const timeouts:number[]=[];
    const run:NonNullable<Parameters<typeof runResearchChecks>[0]>["run"]=(file,args,options)=>{
      void file;void args;timeouts.push(options.timeout!);now+=60000;return {status:0};
    };
    expect(runResearchChecks({run,clock:()=>now,report:()=>{}})).toBe(1);
    expect(timeouts).toEqual([120000,60000]);
  });
});

describe("known public synthetic arithmetic replay",()=>{
  it("recomputes strict bounds without claiming proof, novelty or authority",async()=>{
    const observation=await replayEngineeringCandidate();
    expect(observation).toMatchObject({freshSolverResult:false,noveltyEstablished:false,authorityGranted:false});
    expect(observation.result.status).toBe("SUPPORTED_UNDER_LEMMA_ARITHMETIC");
    expect(observation.result.arithmetic?.derivedFloor).toBe(knownPublicFloor);
    expect(observation.result.arithmetic?.expectationBounds.strict).toBe(true);
    expect(observation.result.proofValidation).toBe("NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED");
    expect(observation.result.formalProof).toBe("NOT_ESTABLISHED");
    expect(observation.result.officialScore).toBe("NOT_ESTABLISHED");
  });
  it("does not support a tampered answer",async()=>{
    const observation=await replayEngineeringCandidate("499999999973");
    expect(observation.result.status).toBe("ARITHMETIC_CLAIM_MISMATCH");
  });
});
