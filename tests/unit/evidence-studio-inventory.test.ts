import {afterEach,describe,expect,it,vi} from "vitest";
import {chmodSync,linkSync,mkdtempSync,mkdirSync,readFileSync,renameSync,rmSync,symlinkSync,writeFileSync} from "node:fs";
import path from "node:path";
import {acquireInventory,createInventoryAccess,hashInventoryFile,inventoryAccounting,inventoryJson,inventoryPath,INVENTORY_METADATA,INVENTORY_SEEDS,INVENTORY_PROJECT_INPUTS,INVENTORY_SNAPSHOT_PURPOSE,listInventoryDirectory,readAcquiredInventory,readInventorySnapshotChunk,readInventoryFile,statInventoryPath} from "../../scripts/test/acquire-tip081-inventory.mjs";

const created:string[]=[];
type Fixture={root:string;projectRoot:string;dependencyRoot:string;mode:"SYNTHETIC"};
type FileView={path:string;provenance:readonly string[]};
type SnapshotFileView={path:string;size:number;digest:string;kind:string};
type ObligationView={code:string;detail:string};
const put=(root:string,file:string,body:string|Buffer)=>{mkdirSync(path.dirname(path.join(root,file)),{recursive:true,mode:0o700});writeFileSync(path.join(root,file),body,{mode:0o600});};
function fixture():Fixture {
 const root=mkdtempSync("/private/tmp/hiveos-tip081-inventory-");created.push(root);chmodSync(root,0o700);
 const projectRoot=path.join(root,"project"),dependencyRoot=path.join(root,"dependencies");mkdirSync(projectRoot,{mode:0o700});mkdirSync(dependencyRoot,{mode:0o700});
 mkdirSync(path.join(projectRoot,".next-tip080/static"),{recursive:true,mode:0o700});mkdirSync(path.join(projectRoot,"public"),{mode:0o700});
 put(projectRoot,"package.json",'{"name":"tip081-fixture","type":"commonjs"}');put(projectRoot,".next-tip080/package.json",'{"type":"commonjs"}');
 put(projectRoot,".next-tip080/server/app/page.js","module.exports={};\n");put(projectRoot,".next-tip080/server/pages/index.js","module.exports={};\n");
 put(projectRoot,".next-tip080/server/app/page.js.nft.json",'{"version":1,"files":["../../../node_modules/next/package.json"]}');
 put(projectRoot,".next-tip080/next-server.js.nft.json",'{"version":1,"files":["../node_modules"]}');
 put(projectRoot,".next-tip080/server/pages-manifest.json",'{"/":"pages/index.js"}');put(projectRoot,".next-tip080/server/app-paths-manifest.json",'{"/page":"app/page.js"}');
 put(projectRoot,".next-tip080/server/middleware-manifest.json",'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":[]}');
 for(const file of [".next-tip080/server/functions-config-manifest.json",".next-tip080/routes-manifest.json",".next-tip080/app-path-routes-manifest.json"])put(projectRoot,file,'{}');
 put(projectRoot,".next-tip080/required-server-files.json",JSON.stringify({version:1,appDir:projectRoot,relativeAppDir:"",config:{distDir:".next-tip080",output:"standalone"},files:[".next-tip080/package.json"],ignore:[]}));
 for(const file of INVENTORY_SEEDS)put(dependencyRoot,file,file.endsWith("package.json")?'{}':file.endsWith(".js")?'module.exports={};\n':'fixed fixture asset\n');
 return {root,projectRoot,dependencyRoot,mode:"SYNTHETIC"};
}
const options=(f:Fixture)=>({mode:f.mode,projectRoot:f.projectRoot,dependencyRoot:f.dependencyRoot});
const sourceInput="src/server/research/mixed-core-power-evidence.ts";
const inputBinding=()=>JSON.parse(readFileSync("/Users/os/hiveos/docs/verification/TIP-081A_EXACT_INPUTS_BINDING.json","utf8"));
const reviewedSourceBytes=()=>Buffer.from(inputBinding().unboundSourceReview.source,"utf8");
function includeSourceInput(f:Fixture){put(f.projectRoot,sourceInput,reviewedSourceBytes());put(f.projectRoot,".next-tip080/server/app/page.js.nft.json",JSON.stringify({version:1,files:["../../../"+sourceInput]}));}
afterEach(()=>{vi.restoreAllMocks();for(const root of created.splice(0))rmSync(root,{recursive:true,force:true});});

describe("TIP081 exact seed/raw read-only inventory",()=>{
 it("I1-01 admits only distinct owned synthetic roots and fixed failed-product mode",()=>{
  const f=fixture();expect(Object.isFrozen(createInventoryAccess(options(f)))).toBe(true);
  for(const bad of [{...options(f),mode:"SUCCESSFUL_BUILD"},{...options(f),mode:"FAILED_BUILD4_FEASIBILITY"},{...options(f),dependencyRoot:f.projectRoot},{...options(f),extra:true}])expect(()=>createInventoryAccess(bad)).toThrow(/TIP081_INVENTORY_/);
 });
 it("I1-02 rejects option accessors and proxies without executing getters",()=>{
  const f=fixture();let touched=false;const poison={...options(f)};Object.defineProperty(poison,"mode",{get(){touched=true;return "SYNTHETIC";}});
  expect(()=>createInventoryAccess(poison)).toThrow();expect(touched).toBe(false);expect(()=>createInventoryAccess(new Proxy(options(f),{get(){touched=true;throw Error("getter");}}))).toThrow();expect(touched).toBe(false);
 });
 it("I1-03 rejects wrong owner namespace permissions before body reads",()=>{const f=fixture();chmodSync(f.projectRoot,0o755);expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_OWNER_REFUSED");});
 it("I2-01 acquires exact whole trees, boundary metadata, raw union and seeds",()=>{
  const f=fixture();put(f.projectRoot,"public/marker.txt","public");put(f.projectRoot,".next-tip080/static/chunk.js","static");const a=acquireInventory(options(f));
  expect(a.record.status).toBe("ACQUIRED_UNIVERSE_OPEN");expect(a.record.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(a.record.execution).toBe(false);expect(a.record.materialization).toBe(false);
  expect(a.record.files.map((r:FileView)=>r.path)).toContain(".next-tip080/package.json");expect(a.record.files.map((r:FileView)=>r.path)).toContain("public/marker.txt");expect(a.record.rawInventories).toHaveLength(2);
  expect(INVENTORY_METADATA.every(file=>a.record.files.some((r:FileView)=>r.path===file))).toBe(true);expect(INVENTORY_SEEDS.every(file=>a.record.files.some((r:FileView)=>r.path==="node_modules/"+file))).toBe(true);
 });
 it("I2-02 keeps unknown generated server modules as conservative entries",()=>{const f=fixture();put(f.projectRoot,".next-tip080/server/auxiliary.cjs","module.exports=81;");const a=acquireInventory(options(f));expect(a.record.entries).toContain(".next-tip080/server/auxiliary.cjs");expect(a.record.entries).not.toContain(".next-tip080/static/chunk.js");});
 it("I2-03 includes required instrumentation and middleware assets with provenance",()=>{
  const f=fixture();put(f.projectRoot,".next-tip080/server/instrumentation.js","module.exports={};");put(f.projectRoot,".next-tip080/server/edge.js","edge");put(f.projectRoot,".next-tip080/server/edge.wasm","wasm");put(f.projectRoot,".next-tip080/server/data.txt","asset");
  put(f.projectRoot,".next-tip080/server/middleware-manifest.json",JSON.stringify({version:3,middleware:{"/":{files:["server/edge.js"],wasm:[{name:"w",filePath:"server/edge.wasm"}],assets:[{name:"a",filePath:"server/data.txt"}]}},functions:{},sortedMiddleware:["/"],instrumentation:{files:["server/instrumentation.js"]}}));
  const a=acquireInventory(options(f));expect(a.record.entries).toContain(".next-tip080/server/instrumentation.js");expect(a.record.files.find((r:FileView)=>r.path.endsWith("edge.wasm"))?.provenance).toContain("MIDDLEWARE_WASM:/");expect(a.record.files.find((r:FileView)=>r.path.endsWith("data.txt"))?.provenance).toContain("MIDDLEWARE_ASSET:/");
 });
 it("I2-04 missing declared inputs refuse instead of assuming filesystem absence",()=>{const f=fixture();put(f.projectRoot,".next-tip080/server/app-paths-manifest.json",'{"/missing":"app/missing.js"}');let error:unknown;try{acquireInventory(options(f));}catch(e){error=e;}expect(error).toHaveProperty("code","TIP081_INVENTORY_METADATA_REFUSED");expect(error).toHaveProperty("details.path",".next-tip080/server/app/missing.js");});
 it("I2-05 duplicate/prototype/invalid UTF8 JSON is never admitted",()=>{for(const input of [Buffer.from('{"files":[],"files":[]}'),Buffer.from('{"__proto__":{}}'),Buffer.from([0xff]),Buffer.from('[] trailing')])expect(()=>inventoryJson(input)).toThrow("TIP081_INVENTORY_JSON_REFUSED");});
 it("I2-06 refuses malformed declarations and preserves unknown-class OPEN records",()=>{const f=fixture();put(f.projectRoot,".next-tip080/server/middleware-manifest.json",'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":[],"futureClass":{}}');expect(acquireInventory(options(f)).record.obligations.some((o:ObligationView)=>o.detail==="futureClass")).toBe(true);put(f.projectRoot,".next-tip080/server/middleware-manifest.json",'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":{},"futureClass":{}}');expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_MIDDLEWARE_REFUSED");});
 it("I2-07 Pages static HTML is acquired data, never an execution entry; unsupported classes refuse",()=>{
  const f=fixture(),pages=".next-tip080/server/pages-manifest.json",app=".next-tip080/server/app-paths-manifest.json",html=".next-tip080/server/pages/500.html";
  put(f.projectRoot,html,"<!doctype html><title>500</title>");put(f.projectRoot,pages,JSON.stringify({"/500":"pages/500.html","/":"pages/index.js"}));
  const a=acquireInventory(options(f));expect(a.record.files.find((r:FileView)=>r.path===html)?.provenance).toContain("PAGE_ROUTE:/500");expect(a.record.entries).not.toContain(html);expect(a.record.entries).toContain(".next-tip080/server/pages/index.js");
  expect(readAcquiredInventory(a).snapshot.files.find((r:{path:string;kind:string})=>r.path===html)?.kind).toBe("asset");
  put(f.projectRoot,pages,'{"/missing":"pages/missing.html"}');let missing:unknown;try{acquireInventory(options(f));}catch(e){missing=e;}expect(missing).toHaveProperty("code","TIP081_INVENTORY_METADATA_REFUSED");expect(missing).toHaveProperty("details.path",".next-tip080/server/pages/missing.html");
  put(f.projectRoot,pages,'{"/500":"pages/500.html"}');put(f.projectRoot,app,'{"/page":"app/page.html"}');expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_ROUTES_REFUSED");put(f.projectRoot,app,'{"/page":"app/page.js"}');
  for(const target of ["app/500.html","pages/500.json","pages/../500.html","/pages/500.html"]){put(f.projectRoot,pages,JSON.stringify({"/500":target}));expect(()=>acquireInventory(options(f))).toThrow(/TIP081_(?:INVENTORY_ROUTES|MANIFEST_PATH)_REFUSED/);}
 });
 it("I3-01 raw dependency directory references remain OPEN without following project rootlink",()=>{const f=fixture();symlinkSync(f.dependencyRoot,path.join(f.projectRoot,"node_modules"));const a=acquireInventory(options(f));expect(a.record.obligations.some((o:ObligationView)=>o.code==="RAW_DIRECTORY_REFERENCE_OPEN")).toBe(true);expect(a.record.files.some((r:FileView)=>r.path==="node_modules")).toBe(false);});
 it("I3-02 sparse dependency acquisition ignores unreferenced installed files",()=>{const f=fixture();put(f.dependencyRoot,"unreferenced/private.txt","not acquired");const a=acquireInventory(options(f));expect(a.record.files.some((r:FileView)=>r.path.includes("unreferenced"))).toBe(false);expect(a.record.obligations.some((o:ObligationView)=>o.code==="UNIVERSE_OPEN")).toBe(true);expect(a.record.obligations.some((o:ObligationView)=>o.code==="OPEN_GRAPH_ACCOUNTING_INTEGRATION")).toBe(true);});
 it("I3-03 raw escapes and forbidden history are refused before target metadata",()=>{const f=fixture();for(const ref of ["../../outside","../artifacts/research/p139-secret","../.env","/absolute","../node_modules/../artifacts/private"]){put(f.projectRoot,".next-tip080/next-server.js.nft.json",JSON.stringify({version:1,files:[ref]}));expect(()=>acquireInventory(options(f))).toThrow(/TIP081_(?:INVENTORY|MANIFEST)_/);}});
 it("I3-04 duplicate raw refs and missing raw inventory refuse whole-scope admission",()=>{const f=fixture();put(f.projectRoot,".next-tip080/next-server.js.nft.json",'{"version":1,"files":["../node_modules","../node_modules"]}');expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_RAW_REFUSED");put(f.projectRoot,".next-tip080/next-server.js.nft.json",'{"version":1,"files":[]}');rmSync(path.join(f.projectRoot,".next-tip080/server/app/page.js.nft.json"));expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_RAW_COUNT_REFUSED");});
 it("I4-01 low-level forbidden/category refusals perform no further metadata access",()=>{const f=fixture(),a=createInventoryAccess(options(f)),before=inventoryAccounting(a).metadataAttempts;for(const p of ["../outside","artifacts/hidden",".env",".next-tip080/standalone/server.js"])expect(()=>statInventoryPath(a,"project",p)).toThrow();expect(inventoryAccounting(a).metadataAttempts).toBe(before);expect(()=>inventoryPath("attempt5")).toThrow();});
 it("I4-02 rejects symlink ancestors and hardlinked input files",()=>{const f=fixture();rmSync(path.join(f.dependencyRoot,"styled-jsx/style.js"));symlinkSync("index.js",path.join(f.dependencyRoot,"styled-jsx/style.js"));expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_NONREGULAR_REFUSED");rmSync(path.join(f.dependencyRoot,"styled-jsx/style.js"));linkSync(path.join(f.dependencyRoot,"styled-jsx/index.js"),path.join(f.dependencyRoot,"styled-jsx/style.js"));expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_HARDLINK_REFUSED");rmSync(path.join(f.dependencyRoot,"styled-jsx/style.js"));renameSync(path.join(f.dependencyRoot,"styled-jsx"),path.join(f.dependencyRoot,"own-alias"));symlinkSync("own-alias",path.join(f.dependencyRoot,"styled-jsx"));expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_NONREGULAR_REFUSED");});
 it("I4-03 never recursively enumerates installed root or failed standalone",()=>{const f=fixture(),a=createInventoryAccess(options(f)),before=inventoryAccounting(a).metadataAttempts;expect(()=>listInventoryDirectory(a,"dependency","next")).toThrow("TIP081_INVENTORY_ENUMERATION_REFUSED");expect(()=>listInventoryDirectory(a,"project",".next-tip080/standalone")).toThrow("TIP081_INVENTORY_CATEGORY_REFUSED");expect(inventoryAccounting(a).metadataAttempts).toBe(before);});
 it("I4-04 data acquisition does not evaluate hostile JavaScript",()=>{const f=fixture(),key="tip081InventoryExecuted";put(f.projectRoot,".next-tip080/server/hostile.js",`globalThis.${key}=true;throw Error('target');`);const a=acquireInventory(options(f));expect(Reflect.has(globalThis,key)).toBe(false);expect(a.record.entries).toContain(".next-tip080/server/hostile.js");});
 it("I4-05 streaming verification uses bounded buffers and retains exact source bytes",()=>{const f=fixture(),a=createInventoryAccess(options(f));put(f.projectRoot,"public/data.txt",Buffer.alloc(150000,81));const before=readFileSync(path.join(f.projectRoot,"public/data.txt")),h=hashInventoryFile(a,"project","public/data.txt");expect(h.size).toBe(150000);expect(inventoryAccounting(a).maxBufferBytes).toBe(65536);expect(readInventoryFile(a,"project","public/data.txt").equals(before)).toBe(true);expect(readFileSync(path.join(f.projectRoot,"public/data.txt")).equals(before)).toBe(true);});
 it("I5-01 snapshot owns copied bytes and public clones cannot mint acquisition authority",()=>{const f=fixture(),a=acquireInventory(options(f));readInventorySnapshotChunk(a,"package.json",0,1).fill(0);expect(readInventorySnapshotChunk(a,"package.json",0,1)[0]).toBe(123);expect(Object.isFrozen(a.record.files)).toBe(true);expect(()=>readAcquiredInventory({...a})).toThrow("TIP081_INVENTORY_ACQUISITION_REFUSED");});
 it("I5-02 canonical rows, provenance, entries and retained config are deterministic data",()=>{const f=fixture(),a=acquireInventory(options(f)),b=acquireInventory(options(f));expect(a.record.epoch.digest).toBe(b.record.epoch.digest);expect(a.snapshot.digest).toBe(b.snapshot.digest);expect(a.record.files.map((r:FileView)=>r.path)).toEqual(a.record.files.map((r:FileView)=>r.path).sort());const file=".next-tip080/required-server-files.json",size=a.snapshot.files.find((r:{path:string;size:number})=>r.path===file)?.size;expect(inventoryJson(readInventorySnapshotChunk(a,file,0,size)).config.output).toBe("standalone");expect(a.record.fullRuntimeClosure).toBe("NOT_ACCEPTED");});
 it("I6-01 tiny peak refusal occurs after declaration reads and before payload acquisition",()=>{const f=fixture();put(f.projectRoot,".next-tip080/server/large.js",Buffer.alloc(950000,32));let error:unknown;try{acquireInventory(options(f));}catch(e){error=e;}expect(error).toHaveProperty("code","TIP081_INVENTORY_PEAK_CAP");expect(error).toHaveProperty("details.stage","BEFORE_PAYLOAD_ACQUISITION");expect(error).toHaveProperty("details.graphStatus","ACQUIRED_GRAPH_UNRUN");expect((error as {details:{declarationReadBytes:number}}).details.declarationReadBytes).toBeGreaterThan(0);});
 it("I6-02 raw metadata growth and deadline are bounded without product effects",()=>{const f=fixture();put(f.projectRoot,".next-tip080/next-server.js.nft.json",JSON.stringify({version:1,files:Array(8193).fill("../node_modules")}));expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_RAW_REFUSED");const g=fixture(),access=createInventoryAccess(options(g));vi.spyOn(performance,"now").mockReturnValue(Number.MAX_SAFE_INTEGER);expect(()=>statInventoryPath(access,"project","package.json")).toThrow("TIP081_INVENTORY_TIME_REFUSED");});
 it("I6-03 JSON input accessors/proxies are refused without invoking coercion",()=>{let touched=false;const input=Buffer.from('{}');Object.defineProperty(input,"buffer",{get(){touched=true;throw Error("getter");}});expect(()=>inventoryJson(input)).toThrow();expect(touched).toBe(false);expect(()=>inventoryJson(new Proxy(Buffer.from('{}'),{get(){touched=true;throw Error("getter");}}))).toThrow();expect(touched).toBe(false);});
 it("P2-01 exact20 immutable policy matches reviewed path/size/digest/roles without caller authority",()=>{
  const expected=inputBinding().records.map((r:{path:string;size:number;digest:string;role:string})=>({path:r.path,size:r.size,digest:r.digest,role:r.role,execution:false,entry:false}));
  expect(INVENTORY_PROJECT_INPUTS).toEqual(expected);expect(INVENTORY_PROJECT_INPUTS).toHaveLength(20);expect(Object.isFrozen(INVENTORY_PROJECT_INPUTS)).toBe(true);expect(INVENTORY_PROJECT_INPUTS.every(r=>Object.isFrozen(r)&&r.execution===false&&r.entry===false)).toBe(true);
  const f=fixture();expect(()=>createInventoryAccess({...options(f),projectInputs:expected})).toThrow("TIP081_INVENTORY_OPTIONS_REFUSED");
 });
 it("P2-02 pinned source input is acquired only as unsupported, nonentry bytes with explicit policy provenance",()=>{
  const f=fixture();includeSourceInput(f);const a=acquireInventory(options(f)),pin=INVENTORY_PROJECT_INPUTS.find(r=>r.path===sourceInput);
  expect(a.record.projectInputPolicy.purpose).toBe("TIP081_EXACT20_DATA_ONLY_ADMISSION");expect(a.record.projectInputPolicy.records).toEqual([pin]);expect(a.record.files.find((r:FileView)=>r.path===sourceInput)?.provenance).toContain("EXACT_PROJECT_INPUT");
  expect(a.record.entries).not.toContain(sourceInput);expect(a.record.execution).toBe(false);expect(a.record.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
  expect(readInventorySnapshotChunk(a,sourceInput,0,2594).equals(reviewedSourceBytes())).toBe(true);expect(a.snapshot.files.find((r:{path:string;kind:string})=>r.path===sourceInput)?.kind).toBe("unsupported");
  expect(acquireInventory(options(fixture())).record.projectInputPolicy.records).toEqual([]);
 });
 it("P2-03 wrong pinned size refuses before payload and same-size digest drift refuses before acceptance",()=>{
  const f=fixture(),access=createInventoryAccess(options(f)),body=reviewedSourceBytes();put(f.projectRoot,sourceInput,body.subarray(1));const reads=inventoryAccounting(access).readAttempts;
  expect(()=>statInventoryPath(access,"project",sourceInput)).toThrow("TIP081_INVENTORY_PROJECT_INPUT_SIZE_REFUSED");expect(()=>readInventoryFile(access,"project",sourceInput)).toThrow("TIP081_INVENTORY_PROJECT_INPUT_SIZE_REFUSED");expect(inventoryAccounting(access).readAttempts).toBe(reads);
  const drift=Buffer.from(body);drift[0]^=1;put(f.projectRoot,sourceInput,drift);expect(()=>readInventoryFile(access,"project",sourceInput)).toThrow("TIP081_INVENTORY_PROJECT_INPUT_DIGEST_REFUSED");expect(()=>hashInventoryFile(access,"project",sourceInput)).toThrow("TIP081_INVENTORY_PROJECT_INPUT_DIGEST_REFUSED");
  includeSourceInput(f);put(f.projectRoot,sourceInput,drift);expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_PROJECT_INPUT_DIGEST_REFUSED");
 });
 it("P2-04 neighboring source and generic prefixes cannot gain authority from a raw trace or matching body",()=>{
  const f=fixture(),neighbor=sourceInput.replace(".ts","-neighbor.ts");put(f.projectRoot,neighbor,reviewedSourceBytes());const access=createInventoryAccess(options(f)),before=inventoryAccounting(access).metadataAttempts;
  for(const target of [neighbor,"src/server/research/other.ts","scripts/operations/other.ts","docs/research/other.json"])expect(()=>statInventoryPath(access,"project",target)).toThrow("TIP081_INVENTORY_CATEGORY_REFUSED");expect(inventoryAccounting(access).metadataAttempts).toBe(before);
  put(f.projectRoot,".next-tip080/server/app/page.js.nft.json",JSON.stringify({version:1,files:["../../../"+neighbor]}));expect(()=>acquireInventory(options(f))).toThrow("TIP081_INVENTORY_CATEGORY_REFUSED");
 });
 it("S2-01 metadata snapshot has a distinct single-owner brand and no body container escape",()=>{
  const a=acquireInventory(options(fixture()));expect(a.snapshot.purpose).toBe(INVENTORY_SNAPSHOT_PURPOSE);expect(a.snapshot.ownership).toBe("PRIVATE_ACQUISITION_SINGLE_OWNER");expect(a.snapshot.retainedBodyCopies).toBe(1);expect(a.record.accounting.retainedBodyCopies).toBe(1);expect(a.record.accounting.chunkTransientBytes).toBe(131072);
  expect(Object.keys(a).sort()).toEqual(["record","snapshot"]);expect(Object.hasOwn(a.snapshot,"baseBundleDigest")).toBe(false);expect(Object.hasOwn(a.snapshot,"bytes")).toBe(false);expect(Object.isFrozen(a.snapshot)).toBe(true);expect(a.snapshot.files.every((r:SnapshotFileView)=>Object.isFrozen(r))).toBe(true);
 });
 it("S3-01 bounded chunks have dedicated buffers and mutations cannot reach private backing bytes",()=>{
  const a=acquireInventory(options(fixture())),chunk=readInventorySnapshotChunk(a,"package.json",0,1);expect(chunk.byteOffset).toBe(0);expect(chunk.buffer.byteLength).toBe(1);new Uint8Array(chunk.buffer).fill(0);expect(readInventorySnapshotChunk(a,"package.json",0,1)[0]).toBe(123);
  const second=readInventorySnapshotChunk(a,"package.json",0,1);expect(second.buffer).not.toBe(chunk.buffer);second.subarray(0,1).fill(0);expect(readInventorySnapshotChunk(a,"package.json",0,1)[0]).toBe(123);
 });
 it("S3-02 clones, proxies and getter holders cannot mint bounded byte authority",()=>{
  const a=acquireInventory(options(fixture()));let touched=false;const getter={get record(){touched=true;return a.record;},get snapshot(){touched=true;return a.snapshot;}};
  for(const forged of [{...a},getter,new Proxy(a,{get(){touched=true;throw Error("trap");}}),a.snapshot])expect(()=>readInventorySnapshotChunk(forged,"package.json",0,1)).toThrow("TIP081_INVENTORY_CHUNK_AUTHORITY_REFUSED");expect(touched).toBe(false);
 });
 it("S3-03 chunk primitives, bounds, absent paths and overflow reject without borrowed values",()=>{
  const a=acquireInventory(options(fixture())),size=a.snapshot.files.find((r:{path:string;size:number})=>r.path==="package.json")?.size;
  for(const [offset,length]of [[-1,1],[0,-1],[0,65537],[Number.MAX_SAFE_INTEGER,1],[0,Number.MAX_SAFE_INTEGER],[NaN,1],[0,Infinity],[-0,1],[0,-0]])expect(()=>readInventorySnapshotChunk(a,"package.json",offset,length)).toThrow("TIP081_INVENTORY_CHUNK_RANGE_REFUSED");
  let touched=false;const boxed={valueOf(){touched=true;return 0;}};expect(()=>readInventorySnapshotChunk(a,"package.json",boxed,1)).toThrow("TIP081_INVENTORY_CHUNK_RANGE_REFUSED");expect(touched).toBe(false);expect(()=>readInventorySnapshotChunk(a,"public/absent",0,1)).toThrow("TIP081_INVENTORY_CHUNK_PATH_REFUSED");expect(()=>readInventorySnapshotChunk(a,"../outside",0,1)).toThrow("TIP081_MANIFEST_PATH_REFUSED");expect(()=>Reflect.apply(readInventorySnapshotChunk,null,[a,"package.json",0,1,"extra"])).toThrow("TIP081_INVENTORY_CHUNK_AUTHORITY_REFUSED");expect(readInventorySnapshotChunk(a,"package.json",size,0)).toHaveLength(0);
 });
 it("S5-01 payload above the old two-copy threshold fits one owned body and bounded copies",()=>{
  const f=fixture(),file=".next-tip080/server/large.js";put(f.projectRoot,file,Buffer.alloc(520000,81));const a=acquireInventory(options(f)),ledger=a.record.accounting;
  expect(ledger.bodyBytes).toBeGreaterThan(520000);expect(ledger.reservedBytes).toBe(ledger.bodyBytes+ledger.maxBufferBytes+ledger.chunkTransientBytes+ledger.metadataBytes);expect(ledger.reservedBytes).toBeLessThan(1048576);expect(ledger.retainedBodyCopies).toBe(1);expect(readInventorySnapshotChunk(a,file,0,65536).every(byte=>byte===81)).toBe(true);expect(readInventorySnapshotChunk(a,file,519999,1)[0]).toBe(81);expect(a.record.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
 });
});
