import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { PRIME_CRITERION_PYTHON_SHA256,PRIME_CRITERION_RETAINED_PATH,PRIME_CRITERION_DEPENDENCIES,reconstructPrimeCriterionBody,primeCriterionRequest,primeCriterionReplayBytes,validateRetainedPrimeCriterionReport } from "@/modules/research-sandbox/math-lrc-prime-criterion";
import { runFreshPrimeCriterionReport } from "@/modules/research-sandbox/math-lrc-prime-criterion-replay";
vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
const source=readFileSync("scripts/operations/replay-lrc-prime-criterion.py","utf8");
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("isolated real independent prime criterion control replay",()=>{
  it("matches all5550 phase cells and4608 toy rows with frozen retained053/054 references",async()=>{
    expect(sha256(source)).toBe(PRIME_CRITERION_PYTHON_SHA256);const r=await runFreshPrimeCriterionReport();expect(validateRetainedPrimeCriterionReport(r)).toEqual(r);expect(r.receipt.stdoutBytes).toBe(24215);expect(r.receipt.elapsedMs).toBeLessThanOrEqual(5000);expect(r.receipt.externalAttestation).toBe(false);
    expect(vi.mocked(children.execFile).mock.calls).toHaveLength(1);expect(vi.mocked(children.execFile).mock.calls[0][1]).toEqual(["-I","-S","-B","-c",source]);expect(vi.mocked(children.execFile).mock.calls[0][2]).toMatchObject({shell:false,maxBuffer:262144,killSignal:"SIGKILL"});
    for(const d of PRIME_CRITERION_DEPENDENCIES)expect(sha256(readFileSync(d.path,"utf8"))).toBe(d.sha256);
  });
  it("Python rejects changed fixed domains, duplicate keys, source promotion and oversized requests",()=>{
    const request=primeCriterionRequest();for(const raw of [canonicalJson({...request,toyPrimes:[3,7]}),canonicalJson({...request,orbitRange:[2,1000]}),canonicalJson({...request,sources:[]}),canonicalJson({...request,globalVerdict:"PROVED"}),'{"version":1,"version":1}'," ".repeat(262145)])expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input:raw,encoding:"utf8",timeout:5000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("rejects nonlocal runtimes, exhausted budgets and drift before child dispatch",async()=>{
    for(const env of ["production","staging"]){vi.stubEnv("NODE_ENV",env);await expect(runFreshPrimeCriterionReport()).rejects.toThrow("local");}vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshPrimeCriterionReport()).rejects.toThrow("local");vi.stubEnv("DEPLOYMENT_ENV","test");
    for(const budget of [0,-1,0.5,Infinity])await expect(runFreshPrimeCriterionReport(budget)).rejects.toThrow("deadline");await expect(runFreshPrimeCriterionReport(1)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshPrimeCriterionReport()).rejects.toThrow("dependency drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(readFileSync(PRIME_CRITERION_DEPENDENCIES[0].path,"utf8")).mockResolvedValueOnce(readFileSync(PRIME_CRITERION_DEPENDENCIES[1].path,"utf8")).mockResolvedValueOnce("drift");await expect(runFreshPrimeCriterionReport()).rejects.toThrow("source drift");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("fails closed on timeout/unavailable/overflow/stderr/disagreement or unavailable stdin",async()=>{
    for(const reason of ["TIMEOUT","ENOENT","MAXBUFFER"]){vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshPrimeCriterionReport()).rejects.toThrow();}
    for(const [stdout,stderr] of [["{}\n",""],["x".repeat(262145),""],[primeCriterionReplayBytes(reconstructPrimeCriterionBody()),"warning"]]){
      vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{queueMicrotask(()=>(callback as (error:null,stdout:string,stderr:string)=>void)(null,stdout,stderr));return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;});await expect(runFreshPrimeCriterionReport()).rejects.toThrow();
    }
    vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:null,kill:()=>true}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshPrimeCriterionReport()).rejects.toThrow("input unavailable");
  });
  it("never gives Python more than remaining collector10s or hard5s cap",async()=>{
    await runFreshPrimeCriterionReport(50000);const options=vi.mocked(children.execFile).mock.calls[0][2] as {timeout:number};expect(options.timeout).toBeGreaterThan(0);expect(options.timeout).toBeLessThanOrEqual(5000);expect(readFileSync("src/modules/research-sandbox/math-lrc-prime-criterion-replay.ts","utf8")).toContain("budget-(performance.now()-started)");
  });
  it("create-only collector refuses EEXIST and does not reseal evidence",()=>{
    const before=readFileSync(PRIME_CRITERION_RETAINED_PATH,"utf8");expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-prime-criterion-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);expect(readFileSync(PRIME_CRITERION_RETAINED_PATH,"utf8")).toBe(before);
  });
});
