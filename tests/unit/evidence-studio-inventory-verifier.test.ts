import {afterEach,describe,expect,it} from "vitest";
import {chmodSync,linkSync,mkdtempSync,mkdirSync,readFileSync,renameSync,rmSync,symlinkSync,writeFileSync} from "node:fs";
import path from "node:path";
import {acquireInventory,INVENTORY_SEEDS,readAcquiredInventory,readInventorySnapshotChunk} from "../../scripts/test/acquire-tip081-inventory.mjs";
import {manifestDigest,readManifestSnapshot} from "../../scripts/test/runtime-tip081-manifest.mjs";
import {verifyInventory,safeInventoryVerificationError,VERIFIER_PROJECT_INPUTS,checkVerifierProjectInput} from "../../scripts/test/verify-tip081-inventory.mjs";

type FileRow={path:string;source:string;sourcePath:string;size:number;digest:string;device:number;inode:number;mode:number;nlink:number;uid:number;mtimeMs:number;ctimeMs:number;provenance:string[]};
type SnapshotFileRow={path:string;size:number;digest:string;kind:string};
type DirectoryRow={source:string;path:string;device:number;inode:number;mode:number;nlink:number;size:number;uid:number;mtimeMs:number;ctimeMs:number;type:string;members:string[]};
type ProjectInput={path:string;size:number;digest:string;role:string;entry:boolean;execution:boolean};
type InventoryRecord={version:number;purpose:string;mode:string;roots:{projectRoot:string;dependencyRoot:string};profile:{runtime:string;mode:string;nodeVersion:string;platform:string;arch:string;distDir:string};epoch:{kind:string;id:string;digest:string};files:FileRow[];directories:DirectoryRow[];entries:string[];rawInventories:{path:string;digest:string;version:number;files:string[]}[];obligations:{id:string;code:string;path:string;detail:string}[];projectInputPolicy:{purpose:string;digest:string;records:ProjectInput[]};accounting:{bodyBytes:number;maxBufferBytes:number;observedMaxBufferBytes:number;retainedBodyCopies:number;chunkTransientBytes:number;metadataBytes:number;reservedBytes:number;readAttempts:number;readBytes:number;metadataAttempts:number};snapshotDigest:string;status:string;graphStatus:string;fullRuntimeClosure:string;execution:boolean;materialization:boolean;digest:string};
type Acquired={record:InventoryRecord;snapshot:ReturnType<typeof acquireInventory>["snapshot"]};
type Fixture={root:string;options:{mode:"SYNTHETIC";projectRoot:string;dependencyRoot:string}};
const created:string[]=[];
function binding(){const data:{records:Array<ProjectInput&{priorPin:string|null}>;unboundSourceReview:{source:string}}=JSON.parse(readFileSync(new URL("../../docs/verification/TIP-081A_EXACT_INPUTS_BINDING.json",import.meta.url),"utf8"));if(typeof data.unboundSourceReview.source!=="string")throw Error("reviewed fixture text unavailable");return data;}
const reviewedSourcePath="src/server/research/mixed-core-power-evidence.ts";
function selectedFixture(){const f=fixture();put(f.options.projectRoot,reviewedSourcePath,Buffer.from(binding().unboundSourceReview.source));const trace=".next-tip080/server/app/studio.js.nft.json",raw:{version:number;files:string[]}=JSON.parse(readFileSync(path.join(f.options.projectRoot,trace),"utf8"));raw.files.push("../../../"+reviewedSourcePath);put(f.options.projectRoot,trace,JSON.stringify(raw));return f;}
function put(root:string,file:string,bytes:string|Buffer){const target=path.join(root,file);mkdirSync(path.dirname(target),{recursive:true,mode:0o700});writeFileSync(target,bytes,{mode:0o600});}
function fixture():Fixture{
  const root=mkdtempSync("/private/tmp/hiveos-tip081-inventory-");created.push(root);chmodSync(root,0o700);
  const projectRoot=path.join(root,"project"),dependencyRoot=path.join(root,"dependencies");mkdirSync(projectRoot,{mode:0o700});mkdirSync(dependencyRoot,{mode:0o700});
  const rows:Record<string,string>={
    "package.json":'{"name":"independent-inventory-fixture","type":"commonjs"}', ".next-tip080/package.json":'{"type":"commonjs"}',
    ".next-tip080/server/app/studio.js":"throw Error('NEVER_TARGET_EVALUATE');", ".next-tip080/server/auxiliary.cjs":"throw Error('NEVER_AUXILIARY_EVALUATE');",
    ".next-tip080/server/middleware.js":"throw Error('NEVER_MIDDLEWARE_EVALUATE');", ".next-tip080/server/instrumentation.js":"throw Error('NEVER_INSTRUMENTATION_EVALUATE');",
    ".next-tip080/server/edge.wasm":"inert-wasm-fixture", ".next-tip080/server/edge.asset":"inert-asset-fixture",
    ".next-tip080/static/chunk.js":"static-data-only", "public/raw.txt":"public-data-only",
    ".next-tip080/server/app/studio.js.nft.json":'{"version":1,"files":["../../../node_modules/@owned/asset.bin","../edge.wasm","../../../public/raw.txt"]}',
    ".next-tip080/next-server.js.nft.json":'{"version":1,"files":["../node_modules"]}',
    ".next-tip080/server/pages-manifest.json":'{"/studio":"app/studio.js"}', ".next-tip080/server/app-paths-manifest.json":'{"/studio/page":"app/studio.js"}',
    ".next-tip080/server/middleware-manifest.json":JSON.stringify({version:3,middleware:{"/":{files:["server/middleware.js"],wasm:[{name:"edge",filePath:"server/edge.wasm"}],assets:[{name:"edge",filePath:"server/edge.asset"}]}},functions:{},sortedMiddleware:["/"],instrumentation:{files:["server/instrumentation.js"]}}),
    ".next-tip080/server/functions-config-manifest.json":'{}', ".next-tip080/routes-manifest.json":'{}', ".next-tip080/app-path-routes-manifest.json":'{}',
    ".next-tip080/required-server-files.json":JSON.stringify({version:1,appDir:projectRoot,relativeAppDir:"",config:{distDir:".next-tip080",output:"standalone"},files:[".next-tip080/package.json",".next-tip080/server/app/studio.js"],ignore:[]}),
  };
  for(const [file,body]of Object.entries(rows))put(projectRoot,file,body);
  for(const file of INVENTORY_SEEDS)put(dependencyRoot,file,file.endsWith("package.json")?'{"type":"commonjs","version":"16.2.11"}':"throw Error('NEVER_DEPENDENCY_EVALUATE');");
  put(dependencyRoot,"@owned/asset.bin","inert-native-data");return {root,options:{mode:"SYNTHETIC",projectRoot,dependencyRoot}};
}
function acquired(f:Fixture):Acquired{return acquireInventory(f.options);}
function rehash(record:InventoryRecord):InventoryRecord{const {digest:old,...body}=record;expect(old).toMatch(/^[a-f0-9]{64}$/);return {...body,digest:manifestDigest(body)};}
function changed(original:Acquired,edit:(record:InventoryRecord)=>void){const candidate=structuredClone(original.record);edit(candidate);return rehash(candidate);}
afterEach(()=>{for(const root of created.splice(0)){if(!/^\/private\/tmp\/hiveos-tip081-inventory-[A-Za-z0-9]+$/.test(root))throw Error("fixture cleanup scope refused");rmSync(root,{recursive:true,force:true});}});

describe("TIP081 independent acquired filesystem-universe verification",()=>{
  it("IV01 verifies the exact synthetic declared universe without promotion or graph execution",()=>{
    const f=fixture(),a=acquired(f),receipt=verifyInventory(a);
    expect(receipt.status).toBe("VERIFIED_DECLARED_UNIVERSE_OPEN");expect(receipt.mode).toBe("SYNTHETIC");expect(receipt.fullRuntimeClosure).toBe("NOT_ACCEPTED");expect(receipt.execution).toBe(false);expect(receipt.materialization).toBe(false);
    expect(receipt.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(receipt.graphAccounting).toBe("OPEN_GRAPH_ACCOUNTING_INTEGRATION");expect(receipt.verifiedFiles).toBe(a.record.files.length);expect(receipt.verifiedEntries).toBe(a.record.entries.length);
    expect(receipt.producerCounterStatus).toBe("OBSERVATIONAL_NOT_INDEPENDENTLY_CERTIFIED");
  });
  it("IV02 rejects a cloned acquisition despite unchanged public hashes",()=>{const f=fixture(),a=acquired(f);expect(()=>verifyInventory({...a})).toThrow("ACQUISITION_REFUSED");});
  it("IV03 rejects rehashed removed and extra file rows through independent reconstruction",()=>{
    const f=fixture(),a=acquired(f);expect(verifyInventory(a).status).toBe("VERIFIED_DECLARED_UNIVERSE_OPEN");
    expect(()=>verifyInventory(a,changed(a,r=>{r.files.pop();}))).toThrow("UNIVERSE_MISMATCH");
    expect(()=>verifyInventory(a,changed(a,r=>{const row=r.files[0];if(!row)throw Error("fixture row missing");r.files.push({...row,path:"public/forged.txt"});}))).toThrow("UNIVERSE_MISMATCH");
  });
  it("IV04 rejects rehashed reordered file and raw-inventory arrays",()=>{const f=fixture(),a=acquired(f);expect(()=>verifyInventory(a,changed(a,r=>r.files.reverse()))).toThrow("UNIVERSE_MISMATCH");expect(()=>verifyInventory(a,changed(a,r=>r.rawInventories.reverse()))).toThrow("UNIVERSE_MISMATCH");});
  it("IV05 rejects rehashed identity and root-kind/source-path alterations",()=>{
    const f=fixture(),a=acquired(f);for(const field of ["inode","uid","mtimeMs","source","sourcePath"]){expect(()=>verifyInventory(a,changed(a,r=>{const row=r.files.find(x=>x.path==="public/raw.txt");if(!row)throw Error("fixture file missing");if(field==="inode")row.inode++;else if(field==="uid")row.uid++;else if(field==="mtimeMs")row.mtimeMs++;else if(field==="source")row.source="dependency";else row.sourcePath="unacquired.txt";}))).toThrow("UNIVERSE_MISMATCH");}
  });
  it("IV06 rejects rehashed source digests and removed provenance",()=>{const f=fixture(),a=acquired(f);expect(()=>verifyInventory(a,changed(a,r=>{const row=r.files[0];if(!row)throw Error("fixture file missing");row.digest="0".repeat(64);}))).toThrow("UNIVERSE_MISMATCH");expect(()=>verifyInventory(a,changed(a,r=>{const row=r.files.find(x=>x.path==="public/raw.txt");if(!row)throw Error("fixture file missing");row.provenance=[];}))).toThrow("UNIVERSE_MISMATCH");});
  it("IV07 rejects rehashed entry removal and invented route entry",()=>{const f=fixture(),a=acquired(f);expect(()=>verifyInventory(a,changed(a,r=>r.entries.pop()))).toThrow();expect(()=>verifyInventory(a,changed(a,r=>r.entries.push("public/raw.txt")))).toThrow();});
  it("IV08 refuses forged epoch, successful-mode and foreign roots before own reads",()=>{
    const f=fixture(),a=acquired(f);for(const edit of [(r:InventoryRecord)=>{r.epoch.kind="SUCCESSFUL_BUILD";},(r:InventoryRecord)=>{r.mode="FAILED_BUILD4_FEASIBILITY";},(r:InventoryRecord)=>{r.roots.projectRoot=f.root+"/foreign";}])expect(()=>verifyInventory(a,changed(a,edit))).toThrow();
  });
  it("IV09 cleared OPEN obligations cannot be accepted after coherent rehash",()=>{const f=fixture(),a=acquired(f);expect(()=>verifyInventory(a,changed(a,r=>{r.obligations=[];}))).toThrow("UNIVERSE_MISMATCH");});
  it("IV10 independently rejects fabricated byte and metadata reservation claims",()=>{
    const f=fixture(),a=acquired(f),fields:Array<keyof InventoryRecord["accounting"]>=["bodyBytes","maxBufferBytes","observedMaxBufferBytes","metadataBytes","reservedBytes","retainedBodyCopies","chunkTransientBytes"];
    for(const field of fields){expect(()=>verifyInventory(a,changed(a,r=>{r.accounting[field]=r.accounting[field]+1;}))).toThrow("ACCOUNTING_REFUSED");}
  });
  it("IV11 refuses input/candidate accessors and proxies without invoking callbacks",()=>{
    const f=fixture(),a=acquired(f);let touched=false;const poison=structuredClone(a.record);Object.defineProperty(poison,"status",{get(){touched=true;throw Error("never getter");}});
    expect(()=>verifyInventory(a,poison)).toThrow();expect(()=>verifyInventory(new Proxy(a,{get(){touched=true;throw Error("never proxy");}}))).toThrow();expect(touched).toBe(false);
  });
  it("IV12 post-acquisition bytes, permission and same-size replacement drift refuse",()=>{
    for(const alteration of ["bytes","mode","replacement"]){const f=fixture(),a=acquired(f),file=path.join(f.options.projectRoot,"public/raw.txt");if(alteration==="bytes")writeFileSync(file,"changed-data");else if(alteration==="mode")chmodSync(file,0o644);else{renameSync(file,file+".old");writeFileSync(file,"public-data-only",{mode:0o600});}expect(()=>verifyInventory(a)).toThrow(/TIP081_/);}
  });
  it("IV13 missing declared data is refusal, not an absent-target green receipt",()=>{const f=fixture(),a=acquired(f);rmSync(path.join(f.options.dependencyRoot,"@owned/asset.bin"));expect(()=>verifyInventory(a)).toThrow("METADATA_REFUSED");});
  it("IV14 public and static tree membership changes cannot disappear from the universe",()=>{for(const tree of ["public",".next-tip080/static"]){const f=fixture(),a=acquired(f);put(f.options.projectRoot,`${tree}/extra.txt`,"newly-present");expect(()=>verifyInventory(a)).toThrow("UNIVERSE_MISMATCH");}});
  it("IV15 post-acquisition symlinks and hardlinks are refused without following aliases",()=>{
    const f=fixture(),a=acquired(f);symlinkSync(f.options.dependencyRoot,path.join(f.options.projectRoot,"public/alias"));expect(()=>verifyInventory(a)).toThrow("NONREGULAR_REFUSED");
    const g=fixture(),b=acquired(g);linkSync(path.join(g.options.projectRoot,"public/raw.txt"),path.join(g.options.projectRoot,"public/linked.txt"));expect(()=>verifyInventory(b)).toThrow("HARDLINK_REFUSED");
  });
  it("IV16 independently binds raw wasm/assets and route/instrumentation provenance",()=>{
    const f=fixture(),a=acquired(f),receipt=verifyInventory(a);expect(receipt.verifiedFiles).toBe(a.record.files.length);
    expect(a.record.files.find(r=>r.path===".next-tip080/server/edge.wasm")?.provenance).toEqual(expect.arrayContaining(["MIDDLEWARE_WASM:/","RAW_REFERENCE:.next-tip080/server/app/studio.js.nft.json"]));
    expect(a.record.files.find(r=>r.path==="node_modules/@owned/asset.bin")?.provenance).toContain("RAW_REFERENCE:.next-tip080/server/app/studio.js.nft.json");expect(a.record.entries).toContain(".next-tip080/server/instrumentation.js");
    expect(()=>verifyInventory(a,changed(a,r=>{const raw=r.rawInventories.find(x=>x.path.includes("studio.js"));if(!raw)throw Error("fixture raw trace missing");raw.files.pop();}))).toThrow("UNIVERSE_MISMATCH");
  });
  it("IV17 raw node_modules directory references remain OPEN without following a root link",()=>{
    const f=fixture();symlinkSync(f.options.dependencyRoot,path.join(f.options.projectRoot,"node_modules"));const a=acquired(f),receipt=verifyInventory(a);
    expect(receipt.openObligations.some(o=>o.code==="RAW_DIRECTORY_REFERENCE_OPEN")).toBe(true);expect(a.record.files.some(r=>r.path==="node_modules")).toBe(false);
  });
  it("IV18 unacquired transitive dependencies remain unknown, not filesystem absent",()=>{
    const f=fixture();put(f.options.dependencyRoot,"unreferenced/extra.cjs","throw Error('NEVER_UNREFERENCED');");const a=acquired(f),receipt=verifyInventory(a);
    expect(a.record.files.some(r=>r.path.includes("unreferenced"))).toBe(false);expect(receipt.openObligations.some(o=>o.code==="UNIVERSE_OPEN")).toBe(true);expect(receipt.limitations).toContain("Fixed seed/raw union only; unacquired dependencies are not filesystem absence");
  });
  it("IV19 unknown declaration classes remain OPEN and historical config is not successor authority",()=>{
    const f=fixture();const file=".next-tip080/server/middleware-manifest.json",value=JSON.parse(readFileSync(path.join(f.options.projectRoot,file),"utf8"));value.futureClass={};put(f.options.projectRoot,file,JSON.stringify(value));
    const a=acquired(f),receipt=verifyInventory(a);expect(receipt.openObligations.some(o=>o.code==="UNKNOWN_DECLARATION_OPEN"&&o.detail==="futureClass")).toBe(true);expect(receipt.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(a.record.epoch.kind).toBe("SYNTHETIC");
    const g=fixture(),duplicate=JSON.parse(readFileSync(path.join(g.options.projectRoot,file),"utf8"));
    duplicate.middleware["/"].repeatedUnknown={};duplicate.middleware["/second"]={files:["server/middleware.js"],repeatedUnknown:{}};put(g.options.projectRoot,file,JSON.stringify(duplicate));
    const repeated=verifyInventory(acquired(g));expect(repeated.openObligations.filter(o=>o.code==="UNKNOWN_DECLARATION_OPEN"&&o.path===file&&o.detail==="repeatedUnknown")).toHaveLength(1);
  });
  it("IV20 own reread counters and immutable receipts retain failure/coverage boundaries",()=>{
    const f=fixture(),a=acquired(f),receipt=verifyInventory(a);expect(receipt.accounting.readAttempts).toBeGreaterThan(0);expect(receipt.accounting.declarationReadBytes).toBeGreaterThan(0);expect(Object.isFrozen(receipt.openObligations)).toBe(true);expect(()=>receipt.openObligations.pop()).toThrow();
    expect(()=>Object.assign(receipt,{graphStatus:"STATIC_GRAPH_VERIFIED"})).toThrow();expect(receipt.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
  });
  it("IV21 safe refusal diagnostics omit source/config bytes and reject getter/proxy serialization",()=>{
    let touched=false;const poison={get details(){touched=true;throw Error("never diagnostic getter");},get code(){touched=true;throw Error("never diagnostic getter");}};
    expect(safeInventoryVerificationError(poison).graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(safeInventoryVerificationError(new Proxy({}, {get(){touched=true;throw Error("never diagnostic proxy");}})).execution).toBe(false);expect(touched).toBe(false);
    const safe=safeInventoryVerificationError({code:"TIP081_INVENTORY_VERIFIER_REFUSED",details:{stage:"VERIFIER_DECLARATION_METADATA",readAttempts:3,declarationReadBytes:81,sourceBytes:"DO_NOT_EMIT",config:{secret:"DO_NOT_EMIT"}}});expect(JSON.stringify(safe)).not.toContain("DO_NOT_EMIT");expect(safe.details).toHaveProperty("declarationReadBytes",81);
  });
  it("IV22 verifier has no producer collector, graph builder, target import or write dependency",()=>{
    const source=readFileSync(new URL("../../scripts/test/verify-tip081-inventory.mjs",import.meta.url),"utf8");expect(source).not.toMatch(/\b(?:acquireInventory|buildManifestCandidate|analyzeManifestSource|writeFileSync|nodeFileTrace|readManifestSnapshot|createManifestSnapshot|supplied|detached)\b/);expect(source).toContain("hashInventoryFile");expect(source).toContain("readAcquiredInventory");expect(source).toContain("readInventorySnapshotChunk");
  });
  it("IV23 independently verifies real static /500 HTML as acquired route evidence, never an execution entry",()=>{
    const f=fixture(),html=".next-tip080/server/pages/500.html";
    put(f.options.projectRoot,html,"<!doctype html><title>500</title>");put(f.options.projectRoot,".next-tip080/server/pages-manifest.json",'{"/500":"pages/500.html"}');
    const a=acquired(f),receipt=verifyInventory(a),row=a.record.files.find(file=>file.path===html);
    expect(row?.provenance).toContain("PAGE_ROUTE:/500");expect(a.record.entries).not.toContain(html);expect(a.record.entries).toContain(".next-tip080/server/app/studio.js");
    expect(receipt.verifiedFiles).toBe(a.record.files.length);expect(receipt.verifiedEntries).toBe(a.record.entries.length);expect(receipt.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
    expect(()=>verifyInventory(a,changed(a,r=>{const candidate=r.files.find(file=>file.path===html);if(!candidate)throw Error("static page fixture missing");candidate.provenance=candidate.provenance.filter(value=>value!=="PAGE_ROUTE:/500");}))).toThrow("UNIVERSE_MISMATCH");
    expect(()=>verifyInventory(a,changed(a,r=>{r.entries.push(html);r.entries.sort();}))).toThrow();
    const unsupported:Array<[string,string]>=[[".next-tip080/server/app-paths-manifest.json","pages/500.html"],[".next-tip080/server/pages-manifest.json","app/500.html"],[".next-tip080/server/pages-manifest.json","pages/500.htm"]];
    for(const [manifest,target]of unsupported){
      const invalid=fixture();put(invalid.options.projectRoot,manifest,JSON.stringify({"/500":target}));expect(()=>acquired(invalid)).toThrow("ROUTES_REFUSED");
    }
  });
  it("IV24 independently pins all20 reviewed input records and immutable nonexecution roles",()=>{
    const policy:readonly ProjectInput[]=VERIFIER_PROJECT_INPUTS,expected=binding().records.map(row=>({path:row.path,size:row.size,digest:row.digest,role:row.role,execution:row.execution,entry:row.entry}));
    expect(policy).toEqual(expected);expect(policy).toHaveLength(20);expect(policy.reduce((sum,row)=>sum+row.size,0)).toBe(13132934);expect(policy.every(row=>row.execution===false&&row.entry===false)).toBe(true);
    expect(policy.filter(row=>row.role==="REVIEWED_JSON_DATA")).toHaveLength(16);expect(policy.filter(row=>row.role==="SOURCE_BYTES_NO_EXECUTION")).toHaveLength(4);
    expect(()=>Object.assign(policy[0]??{}, {role:"EXECUTABLE"})).toThrow();expect(Object.isFrozen(policy)).toBe(true);
  });
  it("IV25 pure pinned-source admission validates bytes without evaluating the reviewed routine or getters",()=>{
    const bytes=Buffer.from(binding().unboundSourceReview.source),row=checkVerifierProjectInput(reviewedSourcePath,bytes);expect(row.size).toBe(2594);expect(row.digest).toBe("bc9162fb646464dc6872f0f56177e656ececccd5b486e7a241f8b98f4b0db2c9");expect(row.execution).toBe(false);expect(row.entry).toBe(false);
    const altered=Buffer.from(bytes);altered.writeUInt8(altered.readUInt8(0)^1,0);expect(()=>checkVerifierProjectInput(reviewedSourcePath,altered)).toThrow("PROJECT_PIN_REFUSED");expect(()=>checkVerifierProjectInput(reviewedSourcePath,bytes.subarray(1))).toThrow("PROJECT_PIN_REFUSED");
    let touched=false;const poison=Buffer.from(bytes);Object.defineProperty(poison,"length",{get(){touched=true;throw Error("never pinned byte getter");}});expect(()=>checkVerifierProjectInput(reviewedSourcePath,poison)).toThrow("PROJECT_BYTES_REFUSED");expect(touched).toBe(false);
  });
  it("IV26 independently reconstructs raw-selected exact input policy and refuses forged roles, pins, entries or provenance",()=>{
    const f=selectedFixture(),a=acquired(f),receipt=verifyInventory(a);expect(a.record.projectInputPolicy.records).toHaveLength(1);expect(receipt.projectInputPolicy).toEqual(a.record.projectInputPolicy);expect(a.record.entries).not.toContain(reviewedSourcePath);
    expect(a.record.files.find(row=>row.path===reviewedSourcePath)?.provenance).toContain("EXACT_PROJECT_INPUT");expect(receipt.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
    for(const field of ["missing","extra","size","digest","role","entry","execution"]){expect(()=>verifyInventory(a,changed(a,r=>{const row=r.projectInputPolicy.records[0];if(!row)throw Error("selected policy fixture missing");if(field==="missing")r.projectInputPolicy.records=[];else if(field==="extra")r.projectInputPolicy.records.push({...row,path:"docs/unreviewed.json"});else if(field==="size")row.size++;else if(field==="digest")row.digest="0".repeat(64);else if(field==="role")row.role="EXECUTABLE";else if(field==="entry")row.entry=true;else row.execution=true;}))).toThrow("PROJECT_POLICY_REFUSED");}
    expect(()=>verifyInventory(a,changed(a,r=>{const row=r.files.find(file=>file.path===reviewedSourcePath);if(!row)throw Error("selected file fixture missing");row.provenance=row.provenance.filter(value=>value!=="EXACT_PROJECT_INPUT");}))).toThrow("UNIVERSE_MISMATCH");
    expect(()=>verifyInventory(a,changed(a,r=>{r.entries.push(reviewedSourcePath);r.entries.sort();}))).toThrow();
  });
  it("IV27 synthetic acquisition is not an automatic20-copy grant or a generic project-prefix policy",()=>{
    const f=fixture(),a=acquired(f),receipt=verifyInventory(a);expect(a.record.projectInputPolicy.records).toEqual([]);expect(receipt.projectInputPolicy.records).toEqual([]);expect(a.record.files.some(row=>row.provenance.includes("EXACT_PROJECT_INPUT"))).toBe(false);
    for(const file of ["docs/unreviewed.json","scripts/operations/unreviewed.ts","src/server/research/mixed-core-power-evidence-copy.ts"]){expect(()=>checkVerifierProjectInput(file,Buffer.from("{}"))).toThrow("PROJECT_PATH_REFUSED");const g=fixture();put(g.options.projectRoot,file,"{}");put(g.options.projectRoot,".next-tip080/next-server.js.nft.json",JSON.stringify({version:1,files:["../"+file]}));expect(()=>acquired(g)).toThrow(/TIP081_INVENTORY_(?:CATEGORY|RAW|PROJECT)/);}
    expect(()=>acquireInventory({...f.options,projectInputs:[{path:reviewedSourcePath,digest:"0".repeat(64)}]})).toThrow("OPTIONS_REFUSED");
  });
  it("IV28 independently verifies a whole520k payload within the single-owner controlled-consumer envelope",()=>{
    const f=fixture(),file="public/large.bin";put(f.options.projectRoot,file,Buffer.alloc(520000,0x61));const a=acquired(f),receipt=verifyInventory(a);
    expect(a.record.files.find(row=>row.path===file)?.size).toBe(520000);expect(receipt.verifiedFiles).toBe(a.record.files.length);
    expect(a.record.accounting.retainedBodyCopies).toBe(1);expect(a.record.accounting.chunkTransientBytes).toBe(131072);
    expect(a.record.accounting.reservedBytes).toBe(a.record.accounting.bodyBytes+a.record.accounting.maxBufferBytes+131072+a.record.accounting.metadataBytes);
    expect(a.record.accounting.reservedBytes).toBeLessThanOrEqual(1048576);expect(2*a.record.accounting.bodyBytes+a.record.accounting.maxBufferBytes+131072+a.record.accounting.metadataBytes).toBeGreaterThan(1048576);
    expect(receipt.accounting.retainedBodyCopies).toBe(1);expect(receipt.accounting.chunkTransientBytes).toBe(131072);expect(receipt.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");
    expect(receipt.limitations).toContain("Controlled streaming consumer envelope only; arbitrary caller chunk retention and RSS are not certified");
  });
  it("IV29 copied chunk and backing-ArrayBuffer mutations never change privately retained bytes",()=>{
    const f=fixture(),a=acquired(f),file="public/raw.txt",expected=Buffer.from("public-data-only"),chunk=readInventorySnapshotChunk(a,file,0,expected.length);
    expect(chunk).toEqual(expected);expect(chunk.buffer.byteLength).toBe(expected.length);chunk.fill(0);new Uint8Array(chunk.buffer).fill(255);
    expect(readInventorySnapshotChunk(a,file,0,expected.length)).toEqual(expected);expect(verifyInventory(a).verifiedFiles).toBe(a.record.files.length);
    const declaration=readInventorySnapshotChunk(a,".next-tip080/server/pages-manifest.json",0,1);declaration.fill(0);
    expect(verifyInventory(a).status).toBe("VERIFIED_DECLARED_UNIVERSE_OPEN");
  });
  it("IV30 authenticated chunk boundaries reject clones, proxies, coercion and unsafe ranges before callbacks",()=>{
    const f=fixture(),a=acquired(f),file="public/raw.txt",size=Buffer.byteLength("public-data-only");
    expect(readInventorySnapshotChunk(a,file,size,0).length).toBe(0);expect(readInventorySnapshotChunk(a,file,size-1,1)).toEqual(Buffer.from("y"));
    const ranges:Array<[number,number]>=[[-1,1],[-0,1],[0,-0],[0,-1],[0,65537],[0,1.5],[1.5,1],[NaN,1],[Infinity,0],[size+1,0],[size,1],[Number.MAX_SAFE_INTEGER+1,0]];
    for(const [offset,length]of ranges)expect(()=>readInventorySnapshotChunk(a,file,offset,length)).toThrow("CHUNK_RANGE_REFUSED");
    expect(()=>readInventorySnapshotChunk({...a},file,0,1)).toThrow("CHUNK_AUTHORITY_REFUSED");expect(()=>readInventorySnapshotChunk(a,"public/not-acquired.txt",0,0)).toThrow("CHUNK_PATH_REFUSED");
    expect(()=>Reflect.apply(readInventorySnapshotChunk,undefined,[a,file,0])).toThrow("CHUNK_AUTHORITY_REFUSED");expect(()=>Reflect.apply(readInventorySnapshotChunk,undefined,[a,file,0,1,"extra"])).toThrow("CHUNK_AUTHORITY_REFUSED");
    let touched=false;const poison={toString(){touched=true;throw Error("never path coercion");}};
    expect(()=>Reflect.apply(readInventorySnapshotChunk,undefined,[a,poison,0,1])).toThrow();expect(()=>readInventorySnapshotChunk(new Proxy(a,{get(){touched=true;throw Error("never chunk proxy");}}),file,0,1)).toThrow("CHUNK_AUTHORITY_REFUSED");expect(touched).toBe(false);
  });
  it("IV31 inventory-only metadata seals exact scope and kinds without historical graph byte authority",()=>{
    const f=fixture();put(f.options.projectRoot,"public/native.so.1","native-data-only");put(f.options.projectRoot,"public/source.ts","throw Error('NEVER_SOURCE_EVALUATE');");const a=acquired(f),held=readAcquiredInventory(a),snapshot=held.snapshot;
    expect(Object.keys(held).sort()).toEqual(["record","snapshot"]);expect(Object.keys(snapshot).sort()).toEqual(["digest","entries","epoch","files","ownership","profile","purpose","retainedBodyCopies","version"]);
    expect(snapshot.purpose).toBe("TIP081_INVENTORY_ONLY_METADATA_SNAPSHOT");expect(snapshot.ownership).toBe("PRIVATE_ACQUISITION_SINGLE_OWNER");expect(snapshot.retainedBodyCopies).toBe(1);
    expect(snapshot.files.find((row:SnapshotFileRow)=>row.path==="public/native.so.1")?.kind).toBe("native");expect(snapshot.files.find((row:SnapshotFileRow)=>row.path==="public/source.ts")?.kind).toBe("unsupported");
    expect(snapshot.files.find((row:SnapshotFileRow)=>row.path===".next-tip080/server/app/studio.js")?.kind).toBe("javascript");expect(snapshot.files.find((row:SnapshotFileRow)=>row.path===".next-tip080/package.json")?.kind).toBe("json");expect(snapshot.files.find((row:SnapshotFileRow)=>row.path==="public/raw.txt")?.kind).toBe("asset");
    expect(()=>readManifestSnapshot(snapshot)).toThrow();expect(()=>Object.assign(snapshot,{ownership:"BORROWED_MAP"})).toThrow();expect(()=>snapshot.files.pop()).toThrow();
    expect(verifyInventory(a).limitations).toContain("Inventory-only metadata snapshot conveys no historical graph authority or graph compatibility");
    expect(()=>verifyInventory(a,changed(a,r=>{r.snapshotDigest="0".repeat(64);}))).toThrow("SNAPSHOT_REFUSED");
    const forged=structuredClone(snapshot);Object.assign(forged,{retainedBodyCopies:0,purpose:"TIP081_DATA_ONLY_MANIFEST"});expect(()=>verifyInventory({record:a.record,snapshot:forged})).toThrow("ACQUISITION_REFUSED");
  });
  it("IV32 a whole950k universe still refuses without a placeholder or silently omitted payload",()=>{
    const f=fixture();put(f.options.projectRoot,"public/too-large.bin",Buffer.alloc(950000,0x62));
    let failure:unknown;try{acquired(f);}catch(error){failure=error;}expect(failure).toBeDefined();const safe=safeInventoryVerificationError(failure);
    expect(safe.fullRuntimeClosure).toBe("NOT_ACCEPTED");expect(safe.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(safe.execution).toBe(false);expect(safe.materialization).toBe(false);
    expect(safe.code).toBe("TIP081_INVENTORY_PEAK_CAP");expect(safe.details).toHaveProperty("bodyBytes",expect.any(Number));expect(safe.details).toHaveProperty("reservedBytes",expect.any(Number));
  });
});
