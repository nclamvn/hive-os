import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { P83_COVERING_PYTHON_SHA256,P83_COVERING_RETAINED_PATH,P83_COVERING_DEPENDENCY,p83CoveringRequest,p83CoveringReplayBytes,reconstructP83CoveringNumberBody,validateRetainedP83CoveringNumberReport } from "@/modules/research-sandbox/math-lrc-p83-covering-number";
import { runFreshP83CoveringNumberReport } from "@/modules/research-sandbox/math-lrc-p83-covering-number-replay";
vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
const source=readFileSync("scripts/operations/replay-lrc-p83-covering-number.py","utf8");
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("real independent set-based p83 replay",()=>{
  it("replays all7172certificate nodes with isolated allowlisted process and frozen055 reference",async()=>{
    expect(sha256(source)).toBe(P83_COVERING_PYTHON_SHA256);const r=await runFreshP83CoveringNumberReport();expect(validateRetainedP83CoveringNumberReport(r)).toEqual(r);expect(r.receipt.stdoutBytes).toBe(88355);expect(r.receipt.elapsedMs).toBeLessThanOrEqual(5000);
    expect(children.execFile).toHaveBeenCalledTimes(1);expect(vi.mocked(children.execFile).mock.calls[0][1]).toEqual(["-I","-S","-B","-c",source]);expect(vi.mocked(children.execFile).mock.calls[0][2]).toMatchObject({shell:false,maxBuffer:262144,killSignal:"SIGKILL"});expect(sha256(readFileSync(P83_COVERING_DEPENDENCY.path,"utf8"))).toBe(P83_COVERING_DEPENDENCY.sha256);
  });
  it("Python fails closed on changed prime/domain/witness/extra claim/oversize",()=>{
    const req=p83CoveringRequest();for(const raw of [canonicalJson({...req,prime:17}),canonicalJson({...req,targetCover:12}),canonicalJson({...req,witness:[]}),canonicalJson({...req,globalVerdict:"PROVED"})," ".repeat(262145)])expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input:raw,encoding:"utf8",timeout:5000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("rejects nonlocal runtimes and budgets before dispatch",async()=>{
    for(const env of ["production","staging"]){vi.stubEnv("NODE_ENV",env);await expect(runFreshP83CoveringNumberReport()).rejects.toThrow("local");}vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshP83CoveringNumberReport()).rejects.toThrow("local");vi.stubEnv("DEPLOYMENT_ENV","test");
    for(const budget of [0,-1,0.5,Infinity,1])await expect(runFreshP83CoveringNumberReport(budget)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("rejects script/reference drift before dispatch",async()=>{
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshP83CoveringNumberReport()).rejects.toThrow("dependency drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(readFileSync(P83_COVERING_DEPENDENCY.path,"utf8")).mockResolvedValueOnce("drift");await expect(runFreshP83CoveringNumberReport()).rejects.toThrow("source drift");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("fails on timeout/unavailable/overflow/stderr/mismatch and missing stdin",async()=>{
    for(const reason of ["TIMEOUT","ENOENT","MAXBUFFER"]){vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshP83CoveringNumberReport()).rejects.toThrow();}
    for(const [stdout,stderr]of [["{}\n",""],["x".repeat(262145),""],[p83CoveringReplayBytes(reconstructP83CoveringNumberBody()),"warning"]]){vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{queueMicrotask(()=>(callback as(error:null,stdout:string,stderr:string)=>void)(null,stdout,stderr));return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;});await expect(runFreshP83CoveringNumberReport()).rejects.toThrow();}
    vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:null,kill:()=>true}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshP83CoveringNumberReport()).rejects.toThrow("input unavailable");
  });
  it("caps child5s within original10s and creates evidence only with wx",async()=>{
    await runFreshP83CoveringNumberReport(50000);const options=vi.mocked(children.execFile).mock.calls[0][2] as{timeout:number};expect(options.timeout).toBeLessThanOrEqual(5000);expect(options.timeout).toBeGreaterThan(0);
    const before=readFileSync(P83_COVERING_RETAINED_PATH,"utf8");expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-p83-covering-number-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);expect(readFileSync(P83_COVERING_RETAINED_PATH,"utf8")).toBe(before);
  });
});
