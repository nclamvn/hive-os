import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import * as core from "@/modules/research-sandbox/math-lrc-p83-generation";
import { runFreshP83GenerationReport } from "@/modules/research-sandbox/math-lrc-p83-generation-replay";
vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
vi.mock("@/modules/research-sandbox/math-lrc-p83-generation",async(original)=>{const actual=await original<typeof import("@/modules/research-sandbox/math-lrc-p83-generation")>();return {...actual,reconstructP83GenerationEvidence:vi.fn(actual.reconstructP83GenerationEvidence),validateP83GenerationEvidence:vi.fn(actual.validateP83GenerationEvidence)};});
const report=JSON.parse(readFileSync(core.P83_GENERATION_RETAINED_PATH,"utf8")) as core.P83GenerationReport;
const evidence={tree:readFileSync(core.P83_GENERATION_PATHS.tree),cover12:readFileSync(core.P83_GENERATION_PATHS.cover12),cover13:readFileSync(core.P83_GENERATION_PATHS.cover13),metadata:{encoding:report.encoding,roots:report.roots,counts:report.counts}};
const source=readFileSync("scripts/operations/replay-lrc-p83-generation.py","utf8");
const datasets=Object.fromEntries(["tree","cover12","cover13"].map(key=>{const d=report.datasets[key as keyof typeof report.datasets];return [key,{bytes:d.bytes,sha256:d.sha256}];}));
const stdout=`${canonicalJson({metadata:evidence.metadata,datasets,comparedEveryTreeByte:true,comparedEveryRow:true})}\n`;
function childOutput(output=stdout,stderr=""){vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{queueMicrotask(()=>(callback as(error:null,stdout:string,stderr:string)=>void)(null,output,stderr));return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;});}
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);vi.mocked(core.reconstructP83GenerationEvidence).mockReset().mockReturnValue(evidence);vi.mocked(core.validateP83GenerationEvidence).mockReset().mockReturnValue(evidence.metadata);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("explicit offline p83 generation collector boundaries (long full execution separately recorded)",()=>{
  it("binds wholeproducer blobs, TS semantic result and isolated independently replayed output",async()=>{
    expect(sha256(source)).toBe(core.P83_GENERATION_PYTHON_SHA256);childOutput();const {report:r}=await runFreshP83GenerationReport();expect(r.counts.canonical13).toBe(115903);expect(r.receipt.stdoutSha256).toBe(sha256(stdout));expect(r.receipt.inputSha256).toBe(sha256(canonicalJson(core.p83GenerationRequest(evidence))));expect(r.trust.get).toBe("PASSIVE_PINNED_SUMMARY_NOT_FRESH_REPLAY");expect(core.reconstructP83GenerationEvidence).toHaveBeenCalledOnce();expect(core.validateP83GenerationEvidence).toHaveBeenCalledOnce();
    expect(vi.mocked(children.execFile).mock.calls[0][1]).toEqual(["-I","-S","-B","-c",source]);expect(vi.mocked(children.execFile).mock.calls[0][2]).toMatchObject({shell:false,maxBuffer:16777216,killSignal:"SIGKILL"});
    const env=(vi.mocked(children.execFile).mock.calls[0][2] as{env:Record<string,string>}).env;expect(Object.keys(env).sort()).toEqual(["NODE_ENV","PATH","LANG","PYTHONDONTWRITEBYTECODE"].sort());
  });
  it("real Python rejects changed type/domain/claim/duplicatekeys/badblob/oversize before long enumeration",()=>{
    const request=core.p83GenerationRequest(evidence);const cases=[canonicalJson({...request,version:true}),canonicalJson({...request,prime:17}),canonicalJson({...request,movingSpeeds:14}),canonicalJson({...request,globalVerdict:"PROVED"}),canonicalJson({...request,tree:"notbase64"}),canonicalJson(request).replace('"version":1','"version":1,"version":1')," ".repeat(16777217)];
    for(const input of cases)expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input,encoding:"utf8",timeout:5000,maxBuffer:16777216,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("rejects nonlocal runtimes, invalid/exhausted budgets without child dispatch",async()=>{
    for(const env of ["production","staging"]){vi.stubEnv("NODE_ENV",env);await expect(runFreshP83GenerationReport()).rejects.toThrow("local");}vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshP83GenerationReport()).rejects.toThrow("local");vi.stubEnv("DEPLOYMENT_ENV","test");for(const budget of [0,-1,0.5,Infinity,1])await expect(runFreshP83GenerationReport(budget)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("fails on source/dependency/semantic drift before independent dispatch",async()=>{
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshP83GenerationReport()).rejects.toThrow("dependency drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(readFileSync(core.P83_GENERATION_DEPENDENCY.path,"utf8")).mockResolvedValueOnce("drift");await expect(runFreshP83GenerationReport()).rejects.toThrow("source drift");
    vi.mocked(core.validateP83GenerationEvidence).mockReturnValueOnce(null);await expect(runFreshP83GenerationReport()).rejects.toThrow("semantic admission");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("fails closed on timeout/unavailable/overflow/stderr/count-only mismatch/missing stdin",async()=>{
    for(const reason of ["TIMEOUT","ENOENT","MAXBUFFER"]){vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshP83GenerationReport()).rejects.toThrow();}
    for(const [out,stderr]of [["{}\n",""],["x".repeat(16777217),""],[stdout,"warning"],[`${canonicalJson({counts:report.counts})}\n`,""]]){childOutput(out,stderr);await expect(runFreshP83GenerationReport()).rejects.toThrow();}
    vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:null,kill:()=>true}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshP83GenerationReport()).rejects.toThrow("stdin unavailable");
  });
  it("never renews original120s budget or gives child more than60s remaining",async()=>{
    childOutput();await runFreshP83GenerationReport(999999);const timeout=(vi.mocked(children.execFile).mock.calls[0][2] as{timeout:number}).timeout;expect(timeout).toBeGreaterThan(0);expect(timeout).toBeLessThanOrEqual(60000);
    const helper=readFileSync("src/modules/research-sandbox/math-lrc-p83-generation-replay.ts","utf8");expect(helper).toContain("budget-(performance.now()-started)");expect(helper).toContain("Math.min(P83_GENERATION_LIMITS.replayMs,remaining())");
  });
  it("create-only writer rejects EEXIST before expensive replay and leaves all4 files intact",()=>{
    const paths=[core.P83_GENERATION_RETAINED_PATH,...Object.values(core.P83_GENERATION_PATHS)],before=paths.map(p=>sha256(readFileSync(p).toString("base64")));
    expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-p83-generation-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);
    expect(paths.map(p=>sha256(readFileSync(p).toString("base64")))).toEqual(before);const cli=readFileSync("scripts/operations/allikvere-p83-generation-audit.ts","utf8");expect(cli).toContain('flag:"wx"');expect(cli.indexOf('for(const key of ["tree","cover12","cover13"]')).toBeLessThan(cli.indexOf('await writeFile(join(process.cwd(),P83_GENERATION_RETAINED_PATH)'));
  });
});
