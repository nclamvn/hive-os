import { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { codexEvents, proofAttempt, proofBinding, proofContract, proofMathematics, proofReport, proofRequest } from "../fixtures/lrc-proof-unit-live";
import { digestResearchResult } from "@/modules/research-sandbox/integrity";
import { mathPilotScope,resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { prepareLrcProofUnitReviewInput, prepareLrcProofUnitSolverInput } from "@/modules/research-sandbox/math-lrc-proof-unit-live";
import { mathModelAttemptSchema } from "@/modules/research-sandbox/contracts";

const mocks=vi.hoisted(()=>({spawn:vi.fn(),writeFile:vi.fn(),rm:vi.fn(),getEnv:vi.fn()}));
vi.mock("node:child_process",async importOriginal=>({...await importOriginal<typeof import("node:child_process")>(),spawn:mocks.spawn}));
vi.mock("node:fs/promises",async importOriginal=>({...await importOriginal<typeof import("node:fs/promises")>(),mkdtemp:vi.fn(async()=>"/private/tmp/offline-proof-unit"),writeFile:mocks.writeFile,rm:mocks.rm}));
vi.mock("@/server/env",()=>({getEnv:mocks.getEnv}));
import { CodexLocalMathProvider, parseCodexEvents, parseCodexProofUnitEvents } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";

let final:unknown=proofMathematics;
let sent:Array<{args:string[];stdin:string;env:Record<string,string>}>;
beforeEach(()=>{
  vi.stubEnv("NODE_ENV","test");mocks.getEnv.mockReturnValue({LRC_CAMPAIGN_LOCAL_ENABLED:true});sent=[];final=proofMathematics;
  mocks.spawn.mockImplementation((_cli:string,args:string[],options:{env:Record<string,string>})=>{
    const child=new EventEmitter() as EventEmitter & {stdout:EventEmitter & {setEncoding:()=>void};stderr:EventEmitter;stdin:{end:(input:string)=>void};kill:ReturnType<typeof vi.fn>};
    child.stdout=Object.assign(new EventEmitter(),{setEncoding:()=>{}});child.stderr=new EventEmitter();child.kill=vi.fn();
    child.stdin={end:(stdin:string)=>{sent.push({args,stdin,env:options.env});queueMicrotask(()=>{
      child.stdout.emit("data",args[0]==="login" ? "Logged in using ChatGPT" : codexEvents(final,`context-${sent.length}`));child.emit("close",0);
    });}};return child;
  });
});
afterEach(()=>{vi.clearAllMocks();vi.unstubAllEnvs();});
function solverInput(){return {missionId:"mission",documentId:null,question:proofContract.statement,scope:mathPilotScope(proofContract),
  providerName:"codex-local",modelName:"gpt-6-sol",sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:1},queryPlan:{queries:[proofContract.statement],languages:["en" as const]},
  mathPilot:proofRequest,lrcProofUnitInput:prepareLrcProofUnitSolverInput(proofBinding)};}
describe("TIP-064 actual adapters with spawn injected",()=>{
  it("transports exact solver stdin/schema and captures actual context/usage, never host evidence",async()=>{
    const input=solverInput();const result=await new CodexLocalMathProvider().execute(input);
    expect(sent).toHaveLength(2);expect(sent[1].stdin).toBe(input.lrcProofUnitInput.stdin);
    expect(mocks.writeFile).toHaveBeenCalledWith(expect.any(String),input.lrcProofUnitInput.schemaText,{mode:0o600});
    expect(sent[1].args).toEqual(expect.arrayContaining(["--ephemeral","--ignore-user-config","read-only","gpt-6-sol"]));
    expect(sent[1].env.DATABASE_URL).toBeUndefined();expect(result.mathAttempt).toMatchObject({threadId:"context-2",usage:{inputTokens:100,outputTokens:50}});
    expect(result.mathAttempt).not.toHaveProperty("lrcProofUnitEvidence");expect(mocks.rm).toHaveBeenCalledOnce();
  });
  it.each(["CRITIC","ADVERSARY"] as const)("transports exact %s payload without re-rendering/host input output",async role=>{
    const attempt=proofAttempt();const prepared=prepareLrcProofUnitReviewInput({...proofBinding,role,solverAttempt:attempt,solverAttemptDigest:digestResearchResult(attempt)});
    final=proofReport(role);const report=await new CodexLocalMathReviewer().reviewProofUnitRole(prepared,attempt);
    expect(sent[1].stdin).toBe(prepared.stdin);expect(mocks.writeFile).toHaveBeenCalledWith(expect.any(String),prepared.schemaText,{mode:0o600});
    expect(report).toMatchObject({role,threadId:"context-2",usage:{outputTokens:50}});expect(report).not.toHaveProperty("lrcProofUnitInput");
  });
  it.each(["packetDigest","inputDigest","schemaText","promptBytes"])("drifted %s refuses before any child",async key=>{
    const input=solverInput();input.lrcProofUnitInput={...input.lrcProofUnitInput,[key]:key==="promptBytes"?1:"drift"};
    await expect(new CodexLocalMathProvider().execute(input)).rejects.toThrow();expect(mocks.spawn).not.toHaveBeenCalled();
  });
  it("proof data cannot fall through a generic/legacy OPEN solver",async()=>{
    const input=solverInput();await expect(new CodexLocalMathProvider().execute({...input,mathPilot:{caseType:"CALIBRATION_PROOF"}})).rejects.toThrow();expect(mocks.spawn).not.toHaveBeenCalled();
  });
  it("budget abort refuses before model spawn",async()=>{
    const controller=new AbortController();controller.abort();await expect(new CodexLocalMathProvider("codex",controller.signal).execute(solverInput())).rejects.toThrow();expect(mocks.spawn).not.toHaveBeenCalled();
  });
  it.each(["lrcProofUnitFeedback","lrcProofUnitInput"])("legacy reviewer cannot smuggle new %s fields",async key=>{
    const contract=resolveMathPilotContract({caseType:"CALIBRATION_PROOF"});const attempt=mathModelAttemptSchema.parse(Object.fromEntries(Object.entries(proofAttempt()).filter(([key])=>!["lrcProofUnitEvidence","lrcProofUnitFeedback"].includes(key))));
    const {lrcProofUnitFeedback:feedback,...report}=proofReport("CRITIC");final={...report,[key]:key==="lrcProofUnitFeedback"?feedback:prepareLrcProofUnitSolverInput(proofBinding)};
    await expect(new CodexLocalMathReviewer().reviewRole("CRITIC",contract,attempt,null,null,null,null)).rejects.toThrow();
    expect(sent).toHaveLength(2);expect(mocks.rm).toHaveBeenCalledOnce();
  });
});
describe("TIP-064 strict JSONL accounting and lane separation",()=>{
  it.each(["lrcProofUnitEvidence","lrcProofUnitInput","packetDigest","providerName","threadId","usage","lrcCampaignEvidence"])("provider host echo %s refuses even correct-looking data",key=>{
    expect(()=>parseCodexProofUnitEvents(codexEvents({...proofMathematics,[key]:proofAttempt().lrcProofUnitEvidence}),"SOLVER")).toThrow();
  });
  it.each([undefined,null,{input_tokens:0,cached_input_tokens:0,output_tokens:1,reasoning_output_tokens:0},{input_tokens:10,cached_input_tokens:11,output_tokens:1,reasoning_output_tokens:0}])("unavailable/invalid usage refuses",usage=>{
    // undefined intentionally represented as explicit missing usage, not fixture default.
    const text=usage===undefined?codexEvents(proofMathematics).split("\n").slice(0,2).join("\n"):codexEvents(proofMathematics,"context",usage);
    expect(()=>parseCodexProofUnitEvents(text,"SOLVER")).toThrow();
  });
  it.each(["thread.started","turn.completed"])("duplicate %s refuses",type=>{
    const text=codexEvents(proofMathematics)+"\n"+JSON.stringify({type,thread_id:"second",usage:{input_tokens:1,cached_input_tokens:0,output_tokens:1,reasoning_output_tokens:0}});
    expect(()=>parseCodexProofUnitEvents(text,"SOLVER")).toThrow();
  });
  it("oversized math output is rejected, never truncated",()=>{
    expect(()=>parseCodexProofUnitEvents(codexEvents({...proofMathematics,argument:"界".repeat(7000)}),"SOLVER")).toThrow();
  });
  it.each(["command_execution","web_search","mcp_tool_call","file_change","unknown"])("observed %s tool/unknown activity is refused",type=>{
    const text=JSON.stringify({type:"item.completed",item:{type}})+"\n"+codexEvents(proofMathematics);
    expect(()=>parseCodexProofUnitEvents(text,"SOLVER")).toThrow();
  });
  it.each(["lrcProofUnitFeedback","lrcProofUnitEvidence"])("legacy parser cannot smuggle new %s",key=>{
    const {lrcProofUnitFeedback:feedback,...old}=proofMathematics;
    expect(()=>parseCodexEvents(codexEvents({...old,[key]:key==="lrcProofUnitFeedback"?feedback:proofAttempt().lrcProofUnitEvidence}))).toThrow();
  });
});
