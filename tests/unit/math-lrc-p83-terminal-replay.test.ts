import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import * as core from "@/modules/research-sandbox/math-lrc-p83-terminal";
import { runFreshP83TerminalReport } from "@/modules/research-sandbox/math-lrc-p83-terminal-replay";
vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
vi.mock("@/modules/research-sandbox/math-lrc-p83-terminal",async(original)=>{const actual=await original<typeof import("@/modules/research-sandbox/math-lrc-p83-terminal")>();return {...actual,reconstructP83TerminalEvidence:vi.fn(actual.reconstructP83TerminalEvidence),validateP83TerminalEvidence:vi.fn(actual.validateP83TerminalEvidence)};});
const report=JSON.parse(readFileSync(core.P83_TERMINAL_RETAINED_PATH,"utf8")) as core.P83TerminalReport;
const metadata={roots:report.roots,counts:report.counts,boundary:report.boundary,bridge:report.bridge,finiteConclusion:report.finiteConclusion,encoding:report.encoding},evidence={tree:readFileSync(core.P83_TERMINAL_TREE_PATH),metadata};
const source=readFileSync("scripts/operations/replay-lrc-p83-terminal.py","utf8");
const stdout=`${canonicalJson({metadata,tree:{bytes:report.datasets.tree.bytes,sha256:report.datasets.tree.sha256},comparedEveryTreeByte:true,checkedEveryNodeMass:true,checkedOriginalGcdRegions:true})}\n`;
function childOutput(output=stdout,stderr=""){vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{queueMicrotask(()=>(callback as(error:null,stdout:string,stderr:string)=>void)(null,output,stderr));return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;});}
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);vi.mocked(core.reconstructP83TerminalEvidence).mockReset().mockReturnValue(evidence);vi.mocked(core.validateP83TerminalEvidence).mockReset().mockReturnValue(metadata);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("whole terminal collector boundary mocks (actual FULL replay recorded separately)",()=>{
  it("binds whole2rootforest/localmass/rawgcd/bridge output with isolated allowlistedPython",async()=>{
    expect(sha256(source)).toBe(core.P83_TERMINAL_PYTHON_SHA256);childOutput();const {report:r}=await runFreshP83TerminalReport();expect(r.counts).toEqual({roots:2,nodes:607854,forces:668179});expect(r.receipt.stdoutSha256).toBe(sha256(stdout));expect(r.roots.map(x=>x.gcdRegionGridWitnessOverlap)).toEqual([4,5]);expect(core.reconstructP83TerminalEvidence).toHaveBeenCalledOnce();expect(core.validateP83TerminalEvidence).toHaveBeenCalledOnce();
    const call=vi.mocked(children.execFile).mock.calls[0];expect(call[1]).toEqual(["-I","-S","-B","-c",source]);expect(call[2]).toMatchObject({shell:false,maxBuffer:262144,killSignal:"SIGKILL"});expect(Object.keys((call[2] as{env:Record<string,string>}).env).sort()).toEqual(["NODE_ENV","PATH","LANG","PYTHONDONTWRITEBYTECODE"].sort());
  });
  it("real isolated Python rejects changedtypes/domain/equality/levels/dependency/duplicatekeys before enumeration",()=>{
    const request={version:1,prime:83,movingSpeeds:13,totalRunners:14,terminalLevel:14,commonLevel:224,boundary:"STRICT_OPEN_BAD",cascadeSummarySha256:core.P83_TERMINAL_DEPENDENCY.sha256,ancestors:"",final32:"",tree:""};
    for(const input of [canonicalJson({...request,version:true}),canonicalJson({...request,prime:17}),canonicalJson({...request,movingSpeeds:14}),canonicalJson({...request,boundary:"CLOSED_BAD"}),canonicalJson({...request,commonLevel:32}),canonicalJson({...request,cascadeSummarySha256:"a".repeat(64)}),canonicalJson({...request,globalTheorem:"PROVED"}),canonicalJson({...request,ancestors:"notbase64"}),canonicalJson(request).replace('"version":1','"version":1,"version":1')," ".repeat(core.P83_TERMINAL_LIMITS.requestBytes+1)])expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input,encoding:"utf8",timeout:5000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("refuses production/deployedruntime and invalid/exhausteddeadline before child",async()=>{
    for(const env of ["production","staging"]){vi.stubEnv("NODE_ENV",env);await expect(runFreshP83TerminalReport()).rejects.toThrow("local");}vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshP83TerminalReport()).rejects.toThrow("local");vi.stubEnv("DEPLOYMENT_ENV","test");for(const ms of [0,-1,0.5,Infinity,1])await expect(runFreshP83TerminalReport(ms)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("failsclosed on cascade/wholeinput/source or semantic drift before child",async()=>{
    const dep=readFileSync(core.P83_TERMINAL_DEPENDENCY.path,"utf8"),a=readFileSync(core.P83_TERMINAL_DEPENDENCY.ancestorPath),f=readFileSync(core.P83_TERMINAL_DEPENDENCY.final32Path);
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshP83TerminalReport()).rejects.toThrow("dependency drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(dep).mockResolvedValueOnce(Buffer.from("drift")).mockResolvedValueOnce(f);await expect(runFreshP83TerminalReport()).rejects.toThrow("input drift");
    vi.mocked(files.readFile).mockResolvedValueOnce(dep).mockResolvedValueOnce(a).mockResolvedValueOnce(f).mockResolvedValueOnce("drift");await expect(runFreshP83TerminalReport()).rejects.toThrow("source drift");
    vi.mocked(core.validateP83TerminalEvidence).mockReturnValueOnce(null);await expect(runFreshP83TerminalReport()).rejects.toThrow("semantic admission");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("failsclosed on unavailable/timeout/overflow/stderr/countonly/mismatch/missingstdin and kills stdinerrors",async()=>{
    for(const reason of ["ENOENT","TIMEOUT","MAXBUFFER"]){vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshP83TerminalReport()).rejects.toThrow();}
    for(const [out,stderr]of [["{}\n",""],["x".repeat(262145),""],[stdout,"warning"],[`${canonicalJson({counts:report.counts})}\n`,""]]){childOutput(out,stderr);await expect(runFreshP83TerminalReport()).rejects.toThrow();}
    vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:null,kill:()=>true}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshP83TerminalReport()).rejects.toThrow("stdin unavailable");
    const kill=vi.fn(()=>true);vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:{on:(_event:string,callback:()=>void)=>{queueMicrotask(callback);},end:()=>undefined},kill}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshP83TerminalReport()).rejects.toThrow("stdin unavailable");expect(kill).toHaveBeenCalledWith("SIGKILL");
  });
  it("preserves original180s collector/90schildremaining and strict boundedoutput",async()=>{
    childOutput();await runFreshP83TerminalReport(999999);const timeout=(vi.mocked(children.execFile).mock.calls[0][2] as{timeout:number}).timeout;expect(timeout).toBeGreaterThan(0);expect(timeout).toBeLessThanOrEqual(90000);const helper=readFileSync("src/modules/research-sandbox/math-lrc-p83-terminal-replay.ts","utf8");expect(helper).toContain("budget-(performance.now()-started)");expect(helper).toContain("Math.min(P83_TERMINAL_LIMITS.replayMs,remaining())");expect(core.P83_TERMINAL_LIMITS.requestBytes).toBe(16777216);
  });
  it("preflights BOTH createonlypaths before expensivework and writes summaryLAST",()=>{
    const paths=[core.P83_TERMINAL_TREE_PATH,core.P83_TERMINAL_RETAINED_PATH],before=paths.map(p=>core.p83TerminalBinarySha256(readFileSync(p)));expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-p83-terminal-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);expect(paths.map(p=>core.p83TerminalBinarySha256(readFileSync(p)))).toEqual(before);const cli=readFileSync("scripts/operations/allikvere-p83-terminal-audit.ts","utf8");expect(cli).toContain('flag:"wx"');expect(cli.indexOf("await writeFile(join(process.cwd(),P83_TERMINAL_TREE_PATH)")).toBeLessThan(cli.indexOf("await writeFile(join(process.cwd(),P83_TERMINAL_RETAINED_PATH)"));
  });
});
