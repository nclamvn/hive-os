import {afterEach,describe,expect,it,vi} from "vitest";
import {chmodSync,mkdtempSync,mkdirSync,readFileSync,rmSync,writeFileSync} from "node:fs";
import path from "node:path";
import {acquireInventory,INVENTORY_SEEDS,readInventorySnapshotChunk} from "../../scripts/test/acquire-tip081-inventory.mjs";
import {preflightInventoryGraph} from "../../scripts/test/consume-tip081-inventory-graph.mjs";
import {manifestDigest,canonicalManifest} from "../../scripts/test/runtime-tip081-manifest.mjs";

type Fixture={root:string;options:{mode:"SYNTHETIC";projectRoot:string;dependencyRoot:string}};
type FileRow={path:string;size:number;digest:string;kind:string;entry:boolean;role:string|null;execution:boolean};
type SourceRow={path:string;size:number;digest:string;utf16Units:number;decodedBytes:number;sourceOnlyBytes:number;conservativeBytes:number};
const roots:string[]=[];
function put(root:string,file:string,body:string|Buffer){const target=path.join(root,file);mkdirSync(path.dirname(target),{recursive:true,mode:0o700});writeFileSync(target,body,{mode:0o600});}
function fixture():Fixture{
  const root=mkdtempSync("/private/tmp/hiveos-tip081-inventory-");roots.push(root);chmodSync(root,0o700);
  const projectRoot=path.join(root,"project"),dependencyRoot=path.join(root,"dependencies");mkdirSync(projectRoot,{mode:0o700});mkdirSync(dependencyRoot,{mode:0o700});
  const files:Record<string,string>={
    "package.json":'{"type":"commonjs"}',".next-tip080/package.json":'{"type":"commonjs"}',
    ".next-tip080/server/app/studio.js":"throw Error('NEVER_GRAPH_TARGET');",
    ".next-tip080/server/app/studio.js.nft.json":'{"version":1,"files":["../../../public/data.bin"]}',
    ".next-tip080/next-server.js.nft.json":'{"version":1,"files":["../node_modules"]}',
    ".next-tip080/server/pages-manifest.json":'{"/":"app/studio.js"}',".next-tip080/server/app-paths-manifest.json":'{"/page":"app/studio.js"}',
    ".next-tip080/server/middleware-manifest.json":'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":[]}',
    ".next-tip080/server/functions-config-manifest.json":'{}',".next-tip080/routes-manifest.json":'{}',".next-tip080/app-path-routes-manifest.json":'{}',
    ".next-tip080/static/chunk.js":"static evidence only", "public/data.bin":"data evidence only",
    ".next-tip080/required-server-files.json":JSON.stringify({version:1,appDir:projectRoot,relativeAppDir:"",config:{distDir:".next-tip080"},files:[".next-tip080/package.json"],ignore:[]}),
  };
  for(const [file,body]of Object.entries(files))put(projectRoot,file,body);
  for(const seed of INVENTORY_SEEDS)put(dependencyRoot,seed,seed.endsWith("package.json")?'{"type":"commonjs","version":"16.2.11"}':"throw Error('NEVER_DEPENDENCY_TARGET');");
  return {root,options:{mode:"SYNTHETIC",projectRoot,dependencyRoot}};
}
afterEach(()=>{vi.restoreAllMocks();for(const root of roots.splice(0)){if(!/^\/private\/tmp\/hiveos-tip081-inventory-[A-Za-z0-9]+$/.test(root))throw Error("owned graph fixture cleanup refused");rmSync(root,{recursive:true,force:true});}});

describe("TIP081 authenticated source-assembly pre-growth producer",()=>{
  it("GP01 retains the exact whole union and seals only a scoped preflight admission",()=>{
    const f=fixture(),a=acquireInventory(f.options),plan=preflightInventoryGraph(a);
    expect(plan.files.map((row:FileRow)=>row.path)).toEqual(a.snapshot.files.map((row:{path:string})=>row.path));expect(plan.files).toHaveLength(a.record.files.length);
    expect(plan.entries).toEqual(a.record.entries);expect(plan.projectInputPolicy).toEqual(a.record.projectInputPolicy);
    expect(plan.decision).toEqual({status:"PREFLIGHT_ADMITTED",stage:"BEFORE_SOURCE_ASSEMBLY",reason:null,path:null});expect(plan.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(plan.fullRuntimeClosure).toBe("NOT_ACCEPTED");expect(plan.execution).toBe(false);expect(plan.materialization).toBe(false);
    const {digest,...body}=plan;expect(digest).toBe(manifestDigest(body));expect(plan.accounting.limit).toBe(1048576);
  });
  it("GP02 authentic private ownership rejects clones, forged metadata and caller budgets",()=>{
    const f=fixture(),a=acquireInventory(f.options);expect(()=>preflightInventoryGraph({...a})).toThrow("AUTHORITY_REFUSED");
    expect(()=>preflightInventoryGraph(structuredClone(a))).toThrow("AUTHORITY_REFUSED");expect(()=>preflightInventoryGraph(new Map())).toThrow("AUTHORITY_REFUSED");
    expect(()=>Reflect.apply(preflightInventoryGraph,undefined,[a,{limit:Infinity}])).toThrow("AUTHORITY_REFUSED");expect(()=>Reflect.apply(preflightInventoryGraph,undefined,[])).toThrow("AUTHORITY_REFUSED");
  });
  it("GP03 getters, proxies and coercion callbacks never run during input admission",()=>{
    const f=fixture(),a=acquireInventory(f.options);let touched=false;
    const poison={get record(){touched=true;throw Error("never metadata getter");},get snapshot(){touched=true;throw Error("never metadata getter");}};
    expect(()=>preflightInventoryGraph(poison)).toThrow("AUTHORITY_REFUSED");expect(()=>preflightInventoryGraph(new Proxy(a,{get(){touched=true;throw Error("never proxy");}}))).toThrow("AUTHORITY_REFUSED");expect(touched).toBe(false);
  });
  it("GP04 BOM, multibyte and astral sources count exact UTF16 units without ASCII approximation",()=>{
    const f=fixture(),file=".next-tip080/server/app/studio.js",text="\uFEFFé汉😀\r\n";put(f.options.projectRoot,file,text);
    const a=acquireInventory(f.options),plan=preflightInventoryGraph(a),row:SourceRow|undefined=plan.sources.find((source:SourceRow)=>source.path===file);
    expect(row?.utf16Units).toBe(text.length);expect(row?.decodedBytes).toBe(2*text.length);expect(row?.size).toBe(Buffer.byteLength(text));expect(row?.utf16Units).not.toBe(row?.size);expect(row?.digest).toBe(a.record.files.find((source:{path:string;digest:string})=>source.path===file)?.digest);
  });
  it("GP05 UTF8 sequences split across the64KiB chunk boundary remain exact and hash-bound",()=>{
    const f=fixture(),file=".next-tip080/server/app/studio.js",text="a".repeat(65535)+"😀é汉";put(f.options.projectRoot,file,text);
    const a=acquireInventory(f.options),plan=preflightInventoryGraph(a),row:SourceRow|undefined=plan.sources.find((source:SourceRow)=>source.path===file);
    expect(row?.utf16Units).toBe(65539);expect(row?.decodedBytes).toBe(131078);expect(row?.size).toBe(Buffer.byteLength(text));expect(row?.digest).toBe(a.record.files.find((source:{path:string;digest:string})=>source.path===file)?.digest);
  });
  it("GP06 invalid UTF8 refuses rather than reporting replacement-character source counts",()=>{
    const vectors=[[0xc0,0xaf],[0xed,0xa0,0x80],[0xf4,0x90,0x80,0x80],[0xe2,0x82],[0x80]];
    for(const vector of vectors){const f=fixture();put(f.options.projectRoot,".next-tip080/server/app/studio.js",Buffer.from(vector));const a=acquireInventory(f.options);expect(()=>preflightInventoryGraph(a)).toThrow("UTF8_REFUSED");}
  });
  it("GP07 byte-control formulas are independently reconstructed and decoded-source minima stay separate",()=>{
    const f=fixture(),a=acquireInventory(f.options),plan=preflightInventoryGraph(a),account=plan.accounting;
    const body=a.snapshot.files.reduce((sum:number,row:{size:number})=>sum+row.size,0),metadata=Buffer.byteLength(canonicalManifest(a.record))+Buffer.byteLength(canonicalManifest(a.snapshot));
    expect(account.bodyBytes).toBe(body);expect(account.inputMetadataBytes).toBe(metadata);expect(account.canonicalScratchBytes).toBe(3*metadata);expect(account.streamTemporaryBytes).toBe(263168);
    const projection={profile:plan.profile,epoch:plan.epoch,entries:plan.entries,files:plan.files,projectInputPolicy:plan.projectInputPolicy};expect(account.planAllowanceBytes).toBe(4*Buffer.byteLength(canonicalManifest(projection))+512*plan.sources.length+16384);
    expect(account.baseBytes).toBe(body+metadata+3*metadata+account.planAllowanceBytes+account.verificationAllowanceBytes+263168);
    expect(plan.files.length+plan.sources.length).toBeLessThanOrEqual(128);
    for(const source of plan.sources){expect(source.sourceOnlyBytes).toBe(body+2*source.utf16Units);expect(source.conservativeBytes).toBe(account.baseBytes+2*source.utf16Units);expect(source.conservativeBytes).toBeGreaterThan(source.sourceOnlyBytes);}
  });
  it("GP08 conservative admission refusal does not claim the source-only minimum exceeded the cap",()=>{
    const f=fixture(),file=".next-tip080/server/app/studio.js";put(f.options.projectRoot,file,"a".repeat(120000));const a=acquireInventory(f.options),plan=preflightInventoryGraph(a);
    expect(plan.decision.status).toBe("PREFLIGHT_REFUSED");expect(plan.decision.reason).toBe("CONSERVATIVE_ADMISSION");expect(plan.decision.path).toBe(file);expect(plan.accounting.maxSourceOnlyBytes).toBeLessThanOrEqual(plan.accounting.limit);expect(plan.accounting.maxConservativeBytes).toBeGreaterThan(plan.accounting.limit);expect(plan.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
  });
  it("GP09 genuine large tiny-mode demand refuses before any whole-source assembly",()=>{
    const f=fixture();put(f.options.projectRoot,".next-tip080/server/app/studio.js","a".repeat(450000));const a=acquireInventory(f.options);
    expect(()=>preflightInventoryGraph(a)).toThrow("CONTROL_CAP");expect(a.snapshot.files.some((row:{size:number})=>row.size===450000)).toBe(true);
  });
  it("GP10 non-JS data remains in the union without becoming a parser or executable source",()=>{
    const f=fixture();put(f.options.projectRoot,"public/evidence.json",'{"data":"never execute"}');put(f.options.projectRoot,"public/evidence.ts","throw Error('NEVER_TS_TARGET');");const a=acquireInventory(f.options),plan=preflightInventoryGraph(a);
    expect(plan.files.find((row:FileRow)=>row.path==="public/evidence.json")?.kind).toBe("json");expect(plan.files.find((row:FileRow)=>row.path==="public/evidence.ts")?.kind).toBe("unsupported");expect(plan.sources.some((row:SourceRow)=>row.path.startsWith("public/evidence"))).toBe(false);expect(plan.files.every((row:FileRow)=>row.execution===false)).toBe(true);
    const reviewedPath="src/server/research/mixed-core-power-evidence.ts",review:{unboundSourceReview:{source:string}}=JSON.parse(readFileSync(new URL("../../docs/verification/TIP-081A_EXACT_INPUTS_BINDING.json",import.meta.url),"utf8")),g=fixture();
    put(g.options.projectRoot,reviewedPath,review.unboundSourceReview.source);put(g.options.projectRoot,".next-tip080/server/app/studio.js.nft.json",JSON.stringify({version:1,files:["../../../"+reviewedPath]}));
    const selected=preflightInventoryGraph(acquireInventory(g.options)),row:FileRow|undefined=selected.files.find((file:FileRow)=>file.path===reviewedPath);
    expect(row?.role).toBe("SOURCE_BYTES_NO_EXECUTION");expect(row?.kind).toBe("unsupported");expect(row?.entry).toBe(false);expect(row?.execution).toBe(false);expect(selected.sources.some((source:SourceRow)=>source.path===reviewedPath)).toBe(false);expect(selected.projectInputPolicy.records).toHaveLength(1);
  });
  it("GP11 copied chunk mutation cannot alter source measurement or sealed metadata",()=>{
    const f=fixture(),a=acquireInventory(f.options),file=".next-tip080/server/app/studio.js",first=preflightInventoryGraph(a),copy=readInventorySnapshotChunk(a,file,0,10);copy.fill(0);new Uint8Array(copy.buffer).fill(255);
    expect(preflightInventoryGraph(a)).toEqual(first);expect(Object.isFrozen(first.sources)).toBe(true);expect(()=>first.files.pop()).toThrow();expect(()=>Object.assign(first.accounting,{limit:Infinity})).toThrow();
  });
  it("GP12 source boundary excludes target assembly, parser/graph calls, filesystem expansion and writes",()=>{
    const source=readFileSync(new URL("../../scripts/test/consume-tip081-inventory-graph.mjs",import.meta.url),"utf8");
    expect(source).not.toMatch(/\b(?:createManifestSnapshot|readManifestSnapshot|loadManifestParser|buildManifestCandidate|analyzeManifestSource|verifyInventory|nodeFileTrace|readFileSync|writeFileSync|eval|createRequire)\b/);
    expect(source).not.toMatch(/(?:Buffer\.concat|\.join\(|source\s*\+=|chunks\.push)/);expect(source).toContain('fatal:true,ignoreBOM:true');expect(source).toContain('readInventorySnapshotChunk');expect(source).toContain('SOURCE_ONLY_BOUND');
    expect(source).toContain("files.length+sources.length+1>entryLimit");
  });
  it("GP13 nonfinite and exceeded clocks cannot bypass the bounded streaming deadline",()=>{
    const f=fixture(),a=acquireInventory(f.options);
    for(const value of [NaN,Infinity,-Infinity]){vi.spyOn(performance,"now").mockReturnValue(value);expect(()=>preflightInventoryGraph(a)).toThrow("TIME_REFUSED");vi.restoreAllMocks();}
    let calls=0;vi.spyOn(performance,"now").mockImplementation(()=>calls++?120001:0);expect(()=>preflightInventoryGraph(a)).toThrow("TIME_REFUSED");
  });
});
