import { EventEmitter } from "node:events";
import { spawn } from "node:child_process";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CodexLocalMathProvider } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { MATH_LRC_CAMPAIGN_CONTRACT, digestMathPilotContract, mathPilotScope } from "@/modules/research-sandbox/math-pilot";
import { runLrcCampaignReference } from "@/modules/research-sandbox/math-lrc-campaign-reference";
import { lrcCampaignFactsPrompt, type LrcCampaignEvidence } from "@/modules/research-sandbox/math-lrc-campaign";
import { resetEnvCache } from "@/server/env";

// Every CLI process is an EventEmitter stub. No login, model or paid API runs.
vi.mock("node:child_process",async original=>({...await original<typeof import("node:child_process")>(),spawn:vi.fn()}));
const contract=MATH_LRC_CAMPAIGN_CONTRACT;
let evidence:LrcCampaignEvidence;
const output={attemptType:"PARTIAL",argument:"The retained one-prime p83 result is scoped and unsigned; this is not fresh replay or global LRC.",
  candidateCounterexample:null,selfChecks:["Checked the scope."],limitations:["All global premises remain OPEN."]};
function events(value:unknown,thread:string) {return [{type:"thread.started",thread_id:thread},
  {type:"item.completed",item:{type:"agent_message",text:JSON.stringify(value)}},
  {type:"turn.completed",usage:{input_tokens:100,cached_input_tokens:0,output_tokens:50,reasoning_output_tokens:0}}].map(v=>JSON.stringify(v)).join("\n");}
function transport(prompts:string[],inject=false) {
  vi.mocked(spawn).mockImplementation(((_path:string,args:string[])=>{
    const child=new EventEmitter(),stdout=Object.assign(new EventEmitter(),{setEncoding:()=>{}}),stderr=new EventEmitter();
    Object.assign(child,{stdout,stderr,kill:()=>true,stdin:{end(prompt:string){queueMicrotask(()=>{
      if(args[0]==="login") stdout.emit("data","Logged in using ChatGPT");
      else {
        prompts.push(prompt);
        const role=prompt.includes("Set role to ADVERSARY")?"ADVERSARY":prompt.includes("Set role to CRITIC")?"CRITIC":null;
        const value=role?{role,verdict:"SUPPORTS",candidateConclusion:"PARTIAL",exactQuote:"retained one-prime p83 result",
          reasoning:"This is a scoped retained unsigned result, and the stated global limitations have not been discharged.",
          checks:["Checked the actual prime and unproved universal premises."],unresolvedGap:null}
          :{...output,...(inject?{lrcCampaignEvidence:evidence}:{})};
        stdout.emit("data",events(value,role?`${role}-fresh`:"solver-fresh"));
      }
      child.emit("close",0);
    });}}});return child;
  }) as typeof spawn);
}
function request(modelName:string) {return {missionId:"mission",documentId:null,question:contract.statement,scope:mathPilotScope(contract),
  providerName:"codex-local",modelName,sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:5},
  queryPlan:{queries:[contract.statement],languages:["en" as const]},
  mathPilot:{caseType:"LRC_CAMPAIGN" as const,preset:"ALLIKVERE_P83_14_V1" as const},lrcCampaignEvidence:evidence};}
beforeAll(async()=>{evidence=await runLrcCampaignReference(contract.lrcCampaignScope,digestMathPilotContract(contract),{permission:true});});
beforeEach(()=>{
  vi.stubEnv("DATABASE_URL","postgresql://dummy:dummy@localhost/test");vi.stubEnv("BETTER_AUTH_SECRET","test-secret-at-least-16-chars");
  vi.stubEnv("LRC_CAMPAIGN_LOCAL_ENABLED","true");resetEnvCache();
});
afterEach(()=>{vi.mocked(spawn).mockReset();vi.unstubAllEnvs();resetEnvCache();});
describe("TIP061 actual adapter wiring with transport stubs only",()=>{
  it("sends exactly identical facts to solver and both separately dispatched reviewers without irrelevant mandates",async()=>{
    const prompts:string[]=[];transport(prompts);
    const provider=new CodexLocalMathProvider("never-executed");
    const result=await provider.execute(request(provider.modelName));
    expect(result.mathAttempt).not.toHaveProperty("lrcCampaignEvidence");
    const attempt={...result.mathAttempt!,lrcCampaignEvidence:evidence};
    const reviewer=new CodexLocalMathReviewer("never-executed","requested-critic","requested-adversary");
    const reports=[];
    for(const role of ["CRITIC","ADVERSARY"] as const) reports.push(await reviewer.reviewRole(role,contract,attempt,null,null,null,null,undefined,undefined,null,null,undefined,evidence));
    const expected=lrcCampaignFactsPrompt(evidence);
    expect(prompts).toHaveLength(3);
    expect(prompts.map(prompt=>prompt.slice(prompt.indexOf("HOST_LRC_CAMPAIGN_FACTS_V1")).split("\n\n")[0])).toEqual([expected,expected,expected]);
    expect(prompts.every(prompt=>!prompt.includes("For an Erdős–Straus task")&&!prompt.includes("parametricChecks")&&!prompt.includes("If structuralCounterexampleReplay"))).toBe(true);
    expect(new Set([attempt.threadId,...reports.map(report=>report.threadId)]).size).toBe(3);
    const models=vi.mocked(spawn).mock.calls.filter(call=>(call[1] as string[])[0]==="exec").map(call=>{
      const args=call[1] as string[];return args[args.indexOf("--model")+1];
    });
    expect(models).toEqual([provider.modelName,"requested-critic","requested-adversary"]);
  });
  it("refuses coherent provider evidence before returning an attempt",async()=>{
    transport([],true);const provider=new CodexLocalMathProvider("never-executed");
    await expect(provider.execute(request(provider.modelName))).rejects.toThrow(/validation/);
  });
  it.each(["off","production","missing"])("%s cannot spawn any solver transport",async(mode)=>{
    if(mode==="off") vi.stubEnv("LRC_CAMPAIGN_LOCAL_ENABLED","false");
    if(mode==="production") vi.stubEnv("DEPLOYMENT_ENV","production");
    resetEnvCache();const provider=new CodexLocalMathProvider("never-executed"),input=request(provider.modelName);
    if(mode==="missing") delete (input as {lrcCampaignEvidence?:unknown}).lrcCampaignEvidence;
    await expect(provider.execute(input)).rejects.toThrow();expect(spawn).not.toHaveBeenCalled();
  });
  it("reviewer refuses absent evidence and mixed domains before login/model",async()=>{
    const reviewer=new CodexLocalMathReviewer("never-executed"),attempt={providerName:"codex-local" as const,modelName:"requested",threadId:"solver",
      ...output,attemptType:"PARTIAL" as const,lrcCampaignEvidence:evidence,usage:{inputTokens:100,cachedInputTokens:0,outputTokens:50,reasoningOutputTokens:0}};
    await expect(reviewer.reviewRole("CRITIC",contract,attempt)).rejects.toThrow();
    await expect(reviewer.reviewRole("CRITIC",contract,attempt,null,null,null,null,{} as never,undefined,null,null,undefined,evidence)).rejects.toThrow(/mix other/);
    expect(spawn).not.toHaveBeenCalled();
  });
});
