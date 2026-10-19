import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import * as core from "@/modules/research-sandbox/math-lrc-p83-cascade";
import { runFreshP83CascadeReport } from "@/modules/research-sandbox/math-lrc-p83-cascade-replay";
vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
vi.mock("@/modules/research-sandbox/math-lrc-p83-cascade",async(original)=>{const actual=await original<typeof import("@/modules/research-sandbox/math-lrc-p83-cascade")>();return {...actual,reconstructP83CascadeEvidence:vi.fn(actual.reconstructP83CascadeEvidence),validateP83CascadeEvidence:vi.fn(actual.validateP83CascadeEvidence)};});
const report=JSON.parse(readFileSync(core.P83_CASCADE_RETAINED_PATH,"utf8")) as core.P83CascadeReport;
const evidence={...Object.fromEntries(core.P83_CASCADE_KEYS.map(k=>[k,readFileSync(core.P83_CASCADE_PATHS[k])])),metadata:{encoding:report.encoding,stages:report.stages,counts:report.counts,ancestors:report.ancestors}} as core.P83CascadeEvidence;
const source=readFileSync("scripts/operations/replay-lrc-p83-cascade.py","utf8");
const datasets=Object.fromEntries(core.P83_CASCADE_KEYS.map(k=>[k,{bytes:report.datasets[k].bytes,sha256:report.datasets[k].sha256}]));
const stdout=`${canonicalJson({metadata:evidence.metadata,datasets,comparedEveryTreeByte:true,comparedEveryRow:true,checkedEverySatOriginalGridAndGcd:true})}\n`;
function childOutput(output=stdout,stderr=""){vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{queueMicrotask(()=>(callback as(error:null,stdout:string,stderr:string)=>void)(null,output,stderr));return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;});}
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);vi.mocked(core.reconstructP83CascadeEvidence).mockReset().mockReturnValue(evidence);vi.mocked(core.validateP83CascadeEvidence).mockReset().mockReturnValue(evidence.metadata);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("explicit whole cascade offline collector boundaries (FULL live execution recorded separately)",()=>{
  it("binds exact predecessor/fullblobs/TS semantics and isolated full independent output",async()=>{
    expect(sha256(source)).toBe(core.P83_CASCADE_PYTHON_SHA256);childOutput();const {report:r}=await runFreshP83CascadeReport();expect(r.counts.roots).toBe(582761);expect(r.receipt.stdoutSha256).toBe(sha256(stdout));expect(core.reconstructP83CascadeEvidence).toHaveBeenCalledOnce();expect(core.validateP83CascadeEvidence).toHaveBeenCalledOnce();expect(r.ancestors.count).toBe(2);
    const call=vi.mocked(children.execFile).mock.calls[0];expect(call[1]).toEqual(["-I","-S","-B","-c",source]);expect(call[2]).toMatchObject({shell:false,maxBuffer:1048576,killSignal:"SIGKILL"});const env=(call[2] as{env:Record<string,string>}).env;expect(Object.keys(env).sort()).toEqual(["NODE_ENV","PATH","LANG","PYTHONDONTWRITEBYTECODE"].sort());
  });
  it("real isolated Python rejects bool/domain/boundary/duplicatekeys/unbounded/badinput before regeneration",()=>{
    const request={version:1,prime:83,movingSpeeds:13,totalRunners:14,boundary:"STRICT_OPEN_BAD",predecessor:"",blobs:Object.fromEntries(core.P83_CASCADE_KEYS.map(k=>[k,""]))};
    const cases=[canonicalJson({...request,version:true}),canonicalJson({...request,prime:17}),canonicalJson({...request,movingSpeeds:14}),canonicalJson({...request,boundary:"CLOSED_BAD"}),canonicalJson({...request,globalVerdict:"PROVED"}),canonicalJson({...request,predecessor:"notbase64"}),canonicalJson(request).replace('"version":1','"version":1,"version":1')," ".repeat(core.P83_CASCADE_LIMITS.requestBytes+1)];
    for(const input of cases)expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input,encoding:"utf8",timeout:5000,maxBuffer:1048576,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("rejects nonlocal runtimes and invalid/exhausted deadlines before child dispatch",async()=>{
    for(const env of ["production","staging"]){vi.stubEnv("NODE_ENV",env);await expect(runFreshP83CascadeReport()).rejects.toThrow("local");}vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","production");await expect(runFreshP83CascadeReport()).rejects.toThrow("local");vi.stubEnv("DEPLOYMENT_ENV","test");for(const budget of [0,-1,0.5,Infinity,1])await expect(runFreshP83CascadeReport(budget)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("rejects immutable summary/predecessor/source/semantic mismatch before dispatch",async()=>{
    const dep=readFileSync(core.P83_CASCADE_DEPENDENCY.path,"utf8"),pred=readFileSync(core.P83_CASCADE_DEPENDENCY.datasetPath);
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshP83CascadeReport()).rejects.toThrow("dependency drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(dep).mockResolvedValueOnce(Buffer.from("drift"));await expect(runFreshP83CascadeReport()).rejects.toThrow("predecessor drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(dep).mockResolvedValueOnce(pred).mockResolvedValueOnce("drift");await expect(runFreshP83CascadeReport()).rejects.toThrow("source drift");
    vi.mocked(core.validateP83CascadeEvidence).mockReturnValueOnce(null);await expect(runFreshP83CascadeReport()).rejects.toThrow("semantic admission");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("fails closed on missing interpreter/timeout/overflow/stderr/mismatch/missingstdin",async()=>{
    for(const reason of ["ENOENT","TIMEOUT","MAXBUFFER"]){vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshP83CascadeReport()).rejects.toThrow();}
    for(const [out,stderr]of [["{}\n",""],["x".repeat(1048577),""],[stdout,"warning"],[`${canonicalJson({counts:report.counts})}\n`,""]]){childOutput(out,stderr);await expect(runFreshP83CascadeReport()).rejects.toThrow();}
    vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:null,kill:()=>true}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshP83CascadeReport()).rejects.toThrow("stdin unavailable");
  });
  it("charges original240s collector budget; child<=120s remaining and bounded1MiB stdout",async()=>{
    childOutput();await runFreshP83CascadeReport(999999);const timeout=(vi.mocked(children.execFile).mock.calls[0][2] as{timeout:number}).timeout;expect(timeout).toBeGreaterThan(0);expect(timeout).toBeLessThanOrEqual(120000);const helper=readFileSync("src/modules/research-sandbox/math-lrc-p83-cascade-replay.ts","utf8");expect(helper).toContain("budget-(performance.now()-started)");expect(helper).toContain("Math.min(P83_CASCADE_LIMITS.replayMs,remaining())");expect(core.P83_CASCADE_LIMITS.requestBytes).toBe(67108864);
  });
  it("createonly preflights ALL8 before work; EEXIST leaves unchanged and summary is LAST",()=>{
    const paths=[core.P83_CASCADE_RETAINED_PATH,...Object.values(core.P83_CASCADE_PATHS)],before=paths.map(p=>core.p83CascadeBinarySha256(readFileSync(p)));
    expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-p83-cascade-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);expect(paths.map(p=>core.p83CascadeBinarySha256(readFileSync(p)))).toEqual(before);
    const cli=readFileSync("scripts/operations/allikvere-p83-cascade-audit.ts","utf8");expect(cli).toContain('flag:"wx"');expect(cli.indexOf("for(const key of P83_CASCADE_KEYS)")).toBeLessThan(cli.indexOf("await writeFile(join(process.cwd(),P83_CASCADE_RETAINED_PATH)"));
  });
});
