import { readFileSync } from "node:fs";
import * as children from "node:child_process";
import * as files from "node:fs/promises";
import { afterEach,beforeEach,describe,expect,it,vi } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { SHAPE_GEOMETRY_PYTHON_SHA256,SHAPE_GEOMETRY_RETAINED_PATH,SHAPE_GEOMETRY_PREFIX_DEPENDENCY,reconstructShapeGeometryBody,shapeGeometryRequest,shapeGeometryReplayBytes,validateRetainedShapeGeometryReport } from "@/modules/research-sandbox/math-lrc-shape-geometry";
import { runFreshShapeGeometryReport } from "@/modules/research-sandbox/math-lrc-shape-geometry-replay";
vi.mock("node:child_process",async(original)=>{const actual=await original<typeof import("node:child_process")>();return {...actual,execFile:vi.fn(actual.execFile)};});
vi.mock("node:fs/promises",async(original)=>{const actual=await original<typeof import("node:fs/promises")>();return {...actual,readFile:vi.fn(actual.readFile)};});
const source=readFileSync("scripts/operations/replay-lrc-shape-geometry.py","utf8");
beforeEach(async()=>{const c=await vi.importActual<typeof import("node:child_process")>("node:child_process"),f=await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");vi.mocked(children.execFile).mockReset().mockImplementation(c.execFile);vi.mocked(files.readFile).mockReset().mockImplementation(f.readFile);});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
describe("independently pinned isolated real shape/geometry replay",()=>{
  it("matches exact identities/allbranches/determinants and references immutable053 only",async()=>{
    expect(sha256(source)).toBe(SHAPE_GEOMETRY_PYTHON_SHA256);const r=await runFreshShapeGeometryReport();expect(validateRetainedShapeGeometryReport(r)).toEqual(r);
    expect(r.receipt.stdoutBytes).toBe(22383);expect(r.receipt.elapsedMs).toBeLessThanOrEqual(5000);expect(r.receipt.externalAttestation).toBe(false);expect(r.dependency.receiptKind).toContain("NOT_FRESH_053");
    expect(vi.mocked(children.execFile).mock.calls).toHaveLength(1);expect(vi.mocked(children.execFile).mock.calls[0][1]).toEqual(["-I","-S","-B","-c",source]);expect(vi.mocked(children.execFile).mock.calls[0][2]).toMatchObject({shell:false,maxBuffer:262144,killSignal:"SIGKILL"});
    expect(sha256(readFileSync(SHAPE_GEOMETRY_PREFIX_DEPENDENCY.reportPath,"utf8"))).toBe(SHAPE_GEOMETRY_PREFIX_DEPENDENCY.reportSha256);
  });
  it("Python refuses caller polynomial/vector/dimension or source changes, duplicate keys and oversized input",()=>{
    const request=shapeGeometryRequest();for(const raw of [canonicalJson({...request,movingSpeeds:[12,14]}),canonicalJson({...request,polynomial:[1,2]}),canonicalJson({...request,source:{...request.source,id:"changed"}}),canonicalJson({...request,dependency:{...request.dependency,reportSha256:"a".repeat(64)}}),'{"version":1,"version":1}'," ".repeat(262145)])expect(()=>children.execFileSync("python3",["-I","-S","-B","-c",source],{input:raw,encoding:"utf8",timeout:5000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]})).toThrow();
  });
  it("refuses nonlocal runtime, exhausted budgets, source and frozen dependency drift before dispatch",async()=>{
    for(const env of ["production","staging"]){vi.stubEnv("NODE_ENV",env);await expect(runFreshShapeGeometryReport()).rejects.toThrow("local");}vi.stubEnv("NODE_ENV","test");vi.stubEnv("DEPLOYMENT_ENV","staging");await expect(runFreshShapeGeometryReport()).rejects.toThrow("local");vi.stubEnv("DEPLOYMENT_ENV","test");
    for(const budget of [0,-1,0.5,Infinity])await expect(runFreshShapeGeometryReport(budget)).rejects.toThrow("deadline");await expect(runFreshShapeGeometryReport(1)).rejects.toThrow("deadline");expect(children.execFile).not.toHaveBeenCalled();
    vi.mocked(files.readFile).mockResolvedValueOnce("drift");await expect(runFreshShapeGeometryReport()).rejects.toThrow("dependency drift");
    const old=readFileSync(SHAPE_GEOMETRY_PREFIX_DEPENDENCY.reportPath,"utf8");vi.mocked(files.readFile).mockResolvedValueOnce(old).mockResolvedValueOnce("drift");await expect(runFreshShapeGeometryReport()).rejects.toThrow("source drift");expect(children.execFile).not.toHaveBeenCalled();
  });
  it("fails closed on timeout/unavailable/overflow/stderr/disagreement and missing stdin",async()=>{
    for(const reason of ["TIMEOUT","ENOENT","MAXBUFFER"]){vi.mocked(children.execFile).mockImplementationOnce(()=>{throw new Error(reason);});await expect(runFreshShapeGeometryReport()).rejects.toThrow();}
    for(const [stdout,stderr] of [["{}\n",""],["x".repeat(262145),""],[shapeGeometryReplayBytes(reconstructShapeGeometryBody()),"warning"]]){
      vi.mocked(children.execFile).mockImplementationOnce((_file,_args,_options,callback)=>{queueMicrotask(()=>(callback as (error:null,stdout:string,stderr:string)=>void)(null,stdout,stderr));return {stdin:{on:()=>undefined,end:()=>undefined},kill:()=>true} as unknown as ReturnType<typeof children.execFile>;});await expect(runFreshShapeGeometryReport()).rejects.toThrow();
    }
    vi.mocked(children.execFile).mockImplementationOnce(()=>({stdin:null,kill:()=>true}) as unknown as ReturnType<typeof children.execFile>);await expect(runFreshShapeGeometryReport()).rejects.toThrow("input unavailable");
  });
  it("caps Python by remaining collector budget and5s instead of granting another budget",async()=>{
    await runFreshShapeGeometryReport(50000);const options=vi.mocked(children.execFile).mock.calls[0][2] as {timeout:number};expect(options.timeout).toBeGreaterThan(0);expect(options.timeout).toBeLessThanOrEqual(5000);const helper=readFileSync("src/modules/research-sandbox/math-lrc-shape-geometry-replay.ts","utf8");expect(helper).toContain("budget-(performance.now()-started)");
  });
  it("collector refuses repeated write and preserves exact retained bytes",()=>{
    const before=readFileSync(SHAPE_GEOMETRY_RETAINED_PATH,"utf8");expect(()=>children.execFileSync(process.execPath,["--import","tsx","scripts/operations/allikvere-shape-geometry-audit.ts","--write"],{encoding:"utf8",timeout:10000,maxBuffer:262144,env:{...process.env,NODE_ENV:"test",DEPLOYMENT_ENV:"test"},stdio:["pipe","pipe","pipe"]})).toThrow(/EEXIST/);expect(readFileSync(SHAPE_GEOMETRY_RETAINED_PATH,"utf8")).toBe(before);
  });
});
