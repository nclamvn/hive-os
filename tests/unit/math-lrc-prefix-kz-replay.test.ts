import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { PREFIX_KZ_PYTHON_SHA256,PREFIX_KZ_RETAINED_PATH,prefixKzRequest,reconstructPrefixKzBody,prefixKzReplayBytes,validateRetainedPrefixKzReport } from "@/modules/research-sandbox/math-lrc-prefix-kz";
import { runFreshPrefixKzReport } from "@/modules/research-sandbox/math-lrc-prefix-kz-replay";

vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
const source=readFileSync("scripts/operations/replay-lrc-prefix-kz.py","utf8");
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("real isolated independently pinned prefix/KZ replay",()=>{
  it("replays every vertex and exactly matches the independently derived JS stream",async()=>{
    expect(sha256(source)).toBe(PREFIX_KZ_PYTHON_SHA256);const r=await runFreshPrefixKzReport();expect(validateRetainedPrefixKzReport(r)).toEqual(r);
    expect(r.receipt.stdoutBytes).toBe(60239);expect(r.receipt.elapsedMs).toBeLessThanOrEqual(5000);expect(r.receipt.externalAttestation).toBe(false);
    expect(vi.mocked(children.execFile).mock.calls[0][0]).toBe("python3");expect(vi.mocked(children.execFile).mock.calls[0][1]).toEqual(["-I","-S","-B","-c",source]);
    expect(vi.mocked(children.execFile).mock.calls[0][2]).toMatchObject({shell:false,maxBuffer:262144,killSignal:"SIGKILL"});
  });
  it("Python rejects duplicate keys, changed fixed specification and unbounded requests",()=>{
    for(const raw of [canonicalJson({...prefixKzRequest(),movingSpeeds:[13,15]}),canonicalJson({...prefixKzRequest(),rho:{numerator:"6",denominator:"8"}}),canonicalJson({...prefixKzRequest(),reportedMinimum:"PROVED"}),'{"version":1,"version":1}'," ".repeat(262145)])
      expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input:raw,encoding:"utf8",timeout:5000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("denies nonlocal runtimes, exhausted deadlines and drift before child dispatch",async()=>{
    for(const env of ["production","staging"]) {vi.stubEnv("NODE_ENV",env);await expect(runFreshPrefixKzReport()).rejects.toThrow("local");}
    vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshPrefixKzReport()).rejects.toThrow("local");
    vi.stubEnv("DEPLOYMENT_ENV","test");for(const budget of [0,-1,0.5,Infinity]) await expect(runFreshPrefixKzReport(budget)).rejects.toThrow("deadline");
    await expect(runFreshPrefixKzReport(1)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshPrefixKzReport()).rejects.toThrow("source drift");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("rejects tool timeout/unavailability, overflow, stderr and mismatched bytes",async()=>{
    for(const reason of ["TIMEOUT","ENOENT","MAXBUFFER"]) {vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshPrefixKzReport()).rejects.toThrow();}
    for(const [stdout,stderr] of [["{}\n",""],["x".repeat(262145),""],[prefixKzReplayBytes(reconstructPrefixKzBody()),"warning"]]) {
      vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{
        queueMicrotask(()=>(callback as (error:null,stdout:string,stderr:string)=>void)(null,stdout,stderr));
        return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;
      });await expect(runFreshPrefixKzReport()).rejects.toThrow();
    }
  });
  it("never gives replay another5s beyond remaining enclosing10s",async()=>{
    await runFreshPrefixKzReport(50000);const options=vi.mocked(children.execFile).mock.calls[0][2] as {timeout:number};expect(options.timeout).toBeGreaterThan(0);expect(options.timeout).toBeLessThanOrEqual(5000);
    const helper=readFileSync("src/modules/research-sandbox/math-lrc-prefix-kz-replay.ts","utf8");expect(helper).toContain("budget-(performance.now()-started)");
  });
  it("collector is create-only and leaves retained bytes unchanged on repeat --write",()=>{
    const before=readFileSync(PREFIX_KZ_RETAINED_PATH,"utf8");
    expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-prefix-kz-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);
    expect(readFileSync(PREFIX_KZ_RETAINED_PATH,"utf8")).toBe(before);
  });
});
