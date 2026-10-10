import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import * as files from "node:fs/promises";
import * as children from "node:child_process";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { CodexLocalMathProvider,parseCodexEvents } from "@/modules/research-sandbox/adapters/codex-local-math";
import { CodexLocalMathReviewer } from "@/modules/research-sandbox/adapters/codex-local-review";
import { digestMathPilotContract,mathPilotScope,resolveMathPilotContract } from "@/modules/research-sandbox/math-pilot";
import { evaluateMathAgentReview,type MathAgentReport } from "@/modules/research-sandbox/agent-review";
import { runLrcCertificateEvidence,validateRetainedLrcEvidence,lrcEvidencePrompt } from "@/modules/research-sandbox/math-lrc-replay";
import { runFreshPropernessReport } from "@/modules/research-sandbox/math-lrc-properness-replay";
import { PROPERNESS_PYTHON_SHA256,buildRetainedPropernessBody,propernessRequest,validateRetainedPropernessReport,propernessReportDigest,propernessReplayBytes,compactPropernessFacts,type PropernessReport } from "@/modules/research-sandbox/math-lrc-properness";

vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,spawn:vi.fn(),execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
const request={caseType:"LRC_FINITE" as const,preset:"GRID_6_14" as const},contract=resolveMathPilotContract(request),root=digestMathPilotContract(contract);
const script="scripts/operations/replay-lrc-properness.py",source=readFileSync(script,"utf8");
const output={attemptType:"PARTIAL" as const,argument:"The finite grid and conditional mechanism do not prove LRC.",candidateCounterexample:null,selfChecks:["Separate lower witness premise."],limitations:["Global domain unestablished."]};
const usage={inputTokens:100,cachedInputTokens:0,outputTokens:40,reasoningOutputTokens:0};
function reports():[MathAgentReport,MathAgentReport] {return (["CRITIC","ADVERSARY"] as const).map(role=>({role,verdict:"SUPPORTS" as const,candidateConclusion:"SUPPORTED_ARGUMENT" as const,exactQuote:"conditional mechanism",reasoning:"Explicit lower premises are not proved by occupancy arithmetic.",checks:["Continuous and fixed-grid scopes separated."],unresolvedGap:null,threadId:`${role}-fresh`,usage})) as [MathAgentReport,MathAgentReport];}
function events(value:unknown,thread:string) {return [{type:"thread.started",thread_id:thread},{type:"item.completed",item:{type:"agent_message",text:JSON.stringify(value)}},{type:"turn.completed",usage:{input_tokens:100,cached_input_tokens:0,output_tokens:40,reasoning_output_tokens:0}}].map(x=>JSON.stringify(x)).join("\n");}
function transport(prompts:string[]) {
  vi.mocked(children.spawn).mockImplementation(((_path:string,args:string[])=>{
    const child=new EventEmitter(),stdout=Object.assign(new EventEmitter(),{setEncoding:()=>undefined}),stderr=new EventEmitter();
    Object.assign(child,{stdout,stderr,kill:()=>true,stdin:{end(prompt:string){queueMicrotask(()=>{
      if(args[0]==="login") stdout.emit("data","Logged in using ChatGPT");
      else {prompts.push(prompt);const role=prompt.includes("Set role to ADVERSARY")?"ADVERSARY":prompt.includes("Set role to CRITIC")?"CRITIC":null;
        const value=role?{...reports().find(r=>r.role===role),threadId:undefined,usage:undefined}:output;
        stdout.emit("data",events(value,role?`${role}-fresh`:"author"));}
      child.emit("close",0);
    });}}});return child;
  }) as typeof children.spawn);
}
const providerInput={missionId:"mission",documentId:null,question:contract.statement,scope:mathPilotScope(contract),providerName:"codex-local" as const,modelName:"gpt-6-sol",sourcePolicy:{allowedDomains:[],primaryDomains:[],requirePrimary:false,maxSources:5},queryPlan:{queries:[contract.statement],languages:["en" as const]},mathPilot:request};
beforeEach(async()=>{
  const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");
  vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(children.spawn).mockReset();vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);
});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});

describe("actual independently pinned properness replay",()=>{
  it("pins reviewed bytes and freshly matches all complete phase partitions",async()=>{
    expect(sha256(source)).toBe(PROPERNESS_PYTHON_SHA256);
    const r=await runFreshPropernessReport();expect(validateRetainedPropernessReport(r)).toEqual(r);expect(r.receipt.stdoutBytes).toBe(15072);
    expect(r.receipt.elapsedMs).toBeLessThanOrEqual(5000);expect(r.receipt.externalAttestation).toBe(false);
    const call=vi.mocked(children.execFile).mock.calls[0];expect(call[0]).toBe("python3");expect(call[1]).toEqual(["-I","-S","-B","-c",source]);
    expect(call[2]).toMatchObject({shell:false,maxBuffer:262144,killSignal:"SIGKILL"});
  });
  it("Python independently rejects changed scope/classes, duplicate keys and unbounded input",()=>{
    const c=children.execFileSync;
    const input=propernessRequest(buildRetainedPropernessBody());
    const changed=structuredClone(input);changed.classes[0].residues[0]+=7;
    const wrong=structuredClone(input);wrong.scopeBinding.sourceScopeDigest="b".repeat(64);
    const extra={...input,certificate:{globalVerdict:"PROVED"}};
    for(const value of [canonicalJson(changed),canonicalJson(wrong),canonicalJson(extra),'{"version":1,"version":1}'," ".repeat(262145)]) {
      expect(()=>c("python3",["-I","-S","-B","-c",source],{input:value,encoding:"utf8",timeout:5000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]})).toThrow();
    }
  });
  it("denies nonlocal runtimes and source drift before tool dispatch",async()=>{
    for(const env of ["production","staging"]) {vi.stubEnv("NODE_ENV",env);await expect(runFreshPropernessReport()).rejects.toThrow("local");}
    vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshPropernessReport()).rejects.toThrow("local");expect(children.execFile).not.toHaveBeenCalled();
    vi.stubEnv("DEPLOYMENT_ENV","test");vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshPropernessReport()).rejects.toThrow("source drift");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("blocks timeout, process unavailable, overflow, stderr and mismatched replay",async()=>{
    for(const reason of ["TIMEOUT","ENOENT","MAXBUFFER"]) {vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshPropernessReport()).rejects.toThrow();}
    for(const [stdout,stderr] of [["{}\n",""],["x".repeat(262145),""],[propernessReplayBytes(buildRetainedPropernessBody()),"warning"]]) {
      vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{
        queueMicrotask(()=>(callback as (error:null,stdout:string,stderr:string)=>void)(null,stdout,stderr));
        return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;
      });await expect(runFreshPropernessReport()).rejects.toThrow();
    }
  });
  it("never resets the enclosing tool budget and rejects zero or invalid remaining time",async()=>{
    for(const budget of [0,-1,Infinity,0.5]) await expect(runFreshPropernessReport(undefined,budget)).rejects.toThrow("deadline");
    expect(children.execFile).not.toHaveBeenCalled();
    await runFreshPropernessReport(undefined,50000);
    const options=vi.mocked(children.execFile).mock.calls[0][2] as {timeout:number};
    expect(options.timeout).toBeGreaterThan(0);expect(options.timeout).toBeLessThanOrEqual(5000);
    const seam=readFileSync("src/modules/research-sandbox/math-lrc-replay.ts","utf8");expect(seam).toContain("Math.floor(10_000-(performance.now()-started))");
  });
});
describe("fresh pre-solver supplemental host evidence",()=>{
  it("preserves old absent-field byte digests and retained semantics",async()=>{
    const e=await runLrcCertificateEvidence(contract.lrcFiniteScope!,root);expect(e.properness).toBeDefined();
    const {properness:_,evidenceDigest:__,...body}=e;void _;void __;
    const historical={...body,evidenceDigest:sha256(canonicalJson(body))};const bytes=canonicalJson(historical);
    expect(validateRetainedLrcEvidence(historical,contract.lrcFiniteScope!,root)).toBe(true);
    expect(canonicalJson(historical)).toBe(bytes);expect(lrcEvidencePrompt(historical)).not.toContain('"properness"');
    const count=vi.mocked(children.execFile).mock.calls.length;
    expect(validateRetainedLrcEvidence(e,contract.lrcFiniteScope!,root)).toBe(true);expect(vi.mocked(children.execFile).mock.calls).toHaveLength(count);
  });
  it("rejects coherent supplemental scope, phase, premise and global-promotion hashes before a provider call",async()=>{
    const e=await runLrcCertificateEvidence(contract.lrcFiniteScope!,root);
    for(const mutate of [
      (r:PropernessReport)=>{r.scopeBinding.rootContractDigest="b".repeat(64);},
      (r:PropernessReport)=>{r.phaseCertificates[0].cells.pop();},
      (r:PropernessReport)=>{r.applications[0].premises=["LOWER_LRC_ACCEPTED"];},
      (r:PropernessReport)=>{(r as unknown as {globalVerdict:string}).globalVerdict="PROVED";},
    ]) {
      const copy=structuredClone(e);mutate(copy.properness!);const r=copy.properness!;
      const {generatedAt:_,receipt:__,reportDigest:___,...body}=r;void _;void __;void ___;
      const stdout=propernessReplayBytes(body);r.receipt.stdoutSha256=sha256(stdout);r.receipt.stdoutBytes=Buffer.byteLength(stdout);r.reportDigest=propernessReportDigest(r);
      const {evidenceDigest:____,...outer}=copy;void ____;copy.evidenceDigest=sha256(canonicalJson(outer));
      expect(validateRetainedLrcEvidence(copy,contract.lrcFiniteScope!,root)).toBe(false);
      await expect(new CodexLocalMathProvider("mock-codex").execute({...providerInput,lrcEvidence:copy})).rejects.toThrow(/LRC/);expect(children.spawn).not.toHaveBeenCalled();
    }
  });
  it("replay disagreement at new preparation prevents any mocked Codex transport",async()=>{
    const actual=await vi.importActual<typeof import("node:child_process")>("node:child_process");
    vi.mocked(children.execFile).mockImplementation(((file,args,options,callback)=>{
      if((args as string[]).at(-1)?.includes("Independent exact phase-partition")) throw new Error("Independent checker unavailable");
      return Reflect.apply(actual.execFile,undefined,[file,args,options,callback]) as ReturnType<typeof children.execFile>;
    }) as typeof children.execFile);
    const prepareThenDispatch=async()=>{const evidence=await runLrcCertificateEvidence(contract.lrcFiniteScope!,root);return new CodexLocalMathProvider("mock-codex").execute({...providerInput,lrcEvidence:evidence});};
    await expect(prepareThenDispatch()).rejects.toThrow("checker unavailable");expect(children.spawn).not.toHaveBeenCalled();
    const worker=readFileSync("src/modules/research-sandbox/worker.ts","utf8");expect(worker).toContain("await runLrcCertificateEvidence(lrcScope");
  });
  it("delivers exactly identical compact conditional facts to solver, critic and adversary",async()=>{
    const evidence=await runLrcCertificateEvidence(contract.lrcFiniteScope!,root),prompts:string[]=[];transport(prompts);
    const result=await new CodexLocalMathProvider("mock-codex").execute({...providerInput,lrcEvidence:evidence});
    const attempt={...result.mathAttempt!,lrcEvidence:evidence};
    const reviews=await new CodexLocalMathReviewer("mock-codex","gpt-6-sol","gpt-6-astra").review(contract,attempt,undefined,undefined,evidence);
    expect(prompts).toHaveLength(3);const compact=canonicalJson(compactPropernessFacts(evidence.properness!));
    for(const prompt of prompts) {expect(prompt).toContain(compact);expect(prompt).not.toContain('"cells"');expect(prompt).not.toContain('"nodes"');expect(prompt).toContain("NOT_ESTABLISHED");}
    expect(result.mathAttempt).not.toHaveProperty("lrcEvidence");
    const verdict=evaluateMathAgentReview({contract,contractDigest:root,attempt,reports:reviews});expect(verdict.conclusion).toBe("PARTIAL");
    expect(()=>parseCodexEvents(events({...output,properness:evidence.properness},"author"))).toThrow();
  });
});
