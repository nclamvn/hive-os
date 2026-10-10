import {afterEach,describe,expect,it,vi} from "vitest";
import fs from "node:fs";
import path from "node:path";
import {INVENTORY_SEEDS,readAcquiredInventory,readInventorySnapshotChunk} from "../../scripts/test/acquire-tip081-inventory.mjs";
import {readManifestSnapshot,canonicalManifest,manifestDigest} from "../../scripts/test/runtime-tip081-manifest.mjs";
import {createInventorySourceStore,readInventorySourceStore,retireInventorySourceStore,openInventorySourceLease,readInventorySourceLease,readInventorySourceLeaseChunk,closeInventorySourceLease} from "../../scripts/test/store-tip081-inventory-source.mjs";

type Owner=ReturnType<typeof createInventorySourceStore>;
type Fixture={root:string;options:{mode:"SYNTHETIC";projectRoot:string;dependencyRoot:string}};
type Row={path:string;size:number;digest:string};
const roots:string[]=[],owners:Owner[]=[],sourcePath=".next-tip080/server/app/page.js";
function put(root:string,file:string,body:string|Buffer){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});fs.writeFileSync(target,body,{mode:0o600});}
function fixture(source:string|Buffer="throw Error('NEVER_LEASE_TARGET');"):Fixture{
  const root=fs.mkdtempSync("/private/tmp/hiveos-tip081-inventory-");roots.push(root);fs.chmodSync(root,0o700);const projectRoot=path.join(root,"project"),dependencyRoot=path.join(root,"dependencies");fs.mkdirSync(projectRoot,{mode:0o700});fs.mkdirSync(dependencyRoot,{mode:0o700});
  fs.mkdirSync(path.join(projectRoot,".next-tip080/static"),{recursive:true,mode:0o700});fs.mkdirSync(path.join(projectRoot,"public"),{mode:0o700});
  const rows:Record<string,string>={"package.json":'{"type":"commonjs"}',".next-tip080/package.json":'{"type":"commonjs"}',".next-tip080/server/pages-manifest.json":'{"/":"app/page.js"}',".next-tip080/server/app-paths-manifest.json":'{"/page":"app/page.js"}',".next-tip080/server/middleware-manifest.json":'{"version":3,"middleware":{},"functions":{},"sortedMiddleware":[]}',".next-tip080/server/functions-config-manifest.json":'{}',".next-tip080/routes-manifest.json":'{}',".next-tip080/app-path-routes-manifest.json":'{}',".next-tip080/server/app/page.js.nft.json":'{"version":1,"files":[]}',".next-tip080/next-server.js.nft.json":'{"version":1,"files":["../node_modules"]}',".next-tip080/required-server-files.json":JSON.stringify({version:1,appDir:projectRoot,relativeAppDir:"",config:{distDir:".next-tip080"},files:[".next-tip080/package.json"],ignore:[]})};
  for(const [file,body]of Object.entries(rows))put(projectRoot,file,body);put(projectRoot,sourcePath,source);
  for(const file of INVENTORY_SEEDS)put(dependencyRoot,file,file.endsWith(".json")?'{"type":"commonjs","version":"16.2.11"}':file.endsWith(".js")?"throw Error('NEVER_DEPENDENCY_LEASE');":"inert-font-data");
  return {root,options:{mode:"SYNTHETIC",projectRoot,dependencyRoot}};
}
function create(f:Fixture){const owner=createInventorySourceStore(f.options);owners.push(owner);return owner;}
afterEach(()=>{vi.restoreAllMocks();for(const owner of owners.splice(0)){try{retireInventorySourceStore(owner);}catch{/* Already-retired handles are intentionally invalid. */}}for(const root of roots.splice(0)){if(!/^\/private\/tmp\/hiveos-tip081-inventory-[A-Za-z0-9]+$/.test(root))throw Error("source-store cleanup scope refused");fs.rmSync(root,{recursive:true,force:true});}});

describe("TIP081 metadata-only source store and private single-source leases",()=>{
  it("SS01 authentic constructor preserves the entire creation proof without payload or graph authority",()=>{
    const f=fixture(),owner=create(f),held=readInventorySourceStore(owner);expect(Object.keys(held).sort()).toEqual(["creationReceipt","creationRecord","creationSnapshot","view"]);
    expect(held.view.retainedPayloadBytes).toBe(0);expect(held.view.ownership).toBe("PRIVATE_METADATA_ONLY");expect(held.view.fileCount).toBe(held.creationRecord.files.length);expect(held.view.entryCount).toBe(held.creationRecord.entries.length);expect(held.creationReceipt.verifiedFiles).toBe(held.view.fileCount);expect(held.creationSnapshot.retainedBodyCopies).toBe(1);
    expect(held.view.graphStatus).toBe("ACQUIRED_GRAPH_UNRUN");expect(held.view.fullRuntimeClosure).toBe("NOT_ACCEPTED");expect(held.view.execution).toBe(false);expect(()=>readAcquiredInventory(owner)).toThrow();expect(()=>readManifestSnapshot(owner)).toThrow();expect(()=>readInventorySnapshotChunk(owner,sourcePath,0,1)).toThrow();
    const {digest,...body}=held.view;expect(digest).toBe(manifestDigest(body));expect(Object.isFrozen(held.creationRecord.files)).toBe(true);
  });
  it("SS02 constructor refuses external adoption, getters, proxies and option extensions",()=>{
    const f=fixture();let touched=false;const bad={get mode(){touched=true;throw Error("never mode getter");},projectRoot:f.options.projectRoot,dependencyRoot:f.options.dependencyRoot};
    for(const input of [bad,new Proxy(f.options,{get(){touched=true;throw Error("never option proxy");}}),new Map(),{...f.options,record:{}},{...f.options,receipt:{}}])expect(()=>createInventorySourceStore(input)).toThrow();expect(touched).toBe(false);expect(()=>Reflect.apply(createInventorySourceStore,null,[f.options,{}])).toThrow("OPTIONS_REFUSED");expect(readInventorySourceStore(create(f)).view.retainedPayloadBytes).toBe(0);
  });
  it("SS03 one process-global owner and lease prevent concurrent working sets",()=>{
    const f=fixture(),owner=create(f);expect(()=>createInventorySourceStore(fixture().options)).toThrow("STORE_BUSY");const lease=openInventorySourceLease(owner,sourcePath);expect(()=>openInventorySourceLease(owner,sourcePath)).toThrow("LEASE_BUSY");expect(()=>createInventorySourceStore(fixture().options)).toThrow("STORE_BUSY");
    closeInventorySourceLease(owner,lease);const second=openInventorySourceLease(owner,sourcePath);expect(readInventorySourceLease(owner,second).size).toBe(Buffer.byteLength("throw Error('NEVER_LEASE_TARGET');"));closeInventorySourceLease(owner,second);
  });
  it("SS04 opaque domains reject cloned owners/leases, wrong owners, non-JS and unknown paths",()=>{
    const owner=create(fixture()),lease=openInventorySourceLease(owner,sourcePath);
    expect(()=>readInventorySourceStore({...owner})).toThrow("AUTHORITY_REFUSED");expect(()=>readInventorySourceLease(owner,{...lease})).toThrow("AUTHORITY_REFUSED");expect(()=>readInventorySourceLease({...owner},lease)).toThrow("AUTHORITY_REFUSED");closeInventorySourceLease(owner,lease);
    for(const file of ["package.json","public/not-acquired.js","../outside.js"])expect(()=>openInventorySourceLease(owner,file)).toThrow();expect(()=>Reflect.apply(openInventorySourceLease,null,[owner,sourcePath,{}])).toThrow("AUTHORITY_REFUSED");
  });
  it("SS05 lease descriptors bind full pinned identity, buffer hash and private decoded length",()=>{
    const owner=create(fixture()),held=readInventorySourceStore(owner),lease=openInventorySourceLease(owner,sourcePath),descriptor=readInventorySourceLease(owner,lease),row:Row|undefined=held.creationRecord.files.find((item:Row)=>item.path===sourcePath);
    expect(descriptor.digest).toBe(row?.digest);expect(descriptor.size).toBe(row?.size);expect(descriptor.identity.type).toBe("file");expect(descriptor.identity.nlink).toBe(1);expect(descriptor.textCodeUnits).toBe(descriptor.utf16Units);expect(descriptor.decodedBytes).toBe(2*descriptor.utf16Units);expect(Object.keys(lease)).not.toContain("bytes");expect(Object.keys(lease)).not.toContain("text");
    const {descriptorDigest,...body}=descriptor;expect(descriptorDigest).toBe(manifestDigest(body));expect(descriptor.scope).toBe("CURRENT_SELECTED_SOURCE_ONLY");
  });
  it("SS06 BOM, astral and64KiB split sequences survive fatal private decoding exactly",()=>{
    const text="\uFEFF"+"a".repeat(65532)+"😀é汉",owner=create(fixture(text)),lease=openInventorySourceLease(owner,sourcePath),descriptor=readInventorySourceLease(owner,lease);
    expect(descriptor.utf16Units).toBe(text.length);expect(descriptor.textCodeUnits).toBe(text.length);expect(descriptor.decodedBytes).toBe(2*text.length);expect(descriptor.size).toBe(Buffer.byteLength(text));expect(descriptor.utf16Units).not.toBe(descriptor.size);
  });
  it("SS07 invalid UTF8 retires the staged lease and never exposes replacement text",()=>{
    for(const vector of [[0xc0,0xaf],[0xed,0xa0,0x80],[0xf4,0x90,0x80,0x80],[0xe2,0x82]]){const owner=create(fixture(Buffer.from(vector)));expect(()=>openInventorySourceLease(owner,sourcePath)).toThrow("UTF8_REFUSED");expect(()=>openInventorySourceLease(owner,sourcePath)).toThrow("UTF8_REFUSED");retireInventorySourceStore(owner);}
  });
  it("SS08 descriptor drift after outer stat refuses BEFORE changed-size buffer allocation and closes FD",()=>{
    const owner=create(fixture()),actual=fs.fstatSync,close=vi.spyOn(fs,"closeSync"),allocation=vi.spyOn(Buffer,"alloc");
    vi.spyOn(fs,"fstatSync").mockImplementation(fd=>{const value=actual(fd);Object.defineProperty(value,"size",{value:Number(value.size)+1});return value;});
    expect(()=>openInventorySourceLease(owner,sourcePath)).toThrow("FD_IDENTITY_REFUSED");expect(allocation).not.toHaveBeenCalled();expect(close).toHaveBeenCalledTimes(1);vi.restoreAllMocks();expect(readInventorySourceLease(owner,openInventorySourceLease(owner,sourcePath)).size).toBeGreaterThan(0);
  });
  it("SS09 exact chunk copies and ArrayBuffer mutation cannot corrupt private source or text",()=>{
    const text="private source data",owner=create(fixture(text)),lease=openInventorySourceLease(owner,sourcePath),chunk=readInventorySourceLeaseChunk(owner,lease,0,Buffer.byteLength(text));expect(chunk).toEqual(Buffer.from(text));expect(chunk.buffer.byteLength).toBe(chunk.length);
    chunk.fill(0);new Uint8Array(chunk.buffer).fill(255);expect(readInventorySourceLeaseChunk(owner,lease,0,Buffer.byteLength(text))).toEqual(Buffer.from(text));expect(readInventorySourceLease(owner,lease).textCodeUnits).toBe(text.length);
    let touched=false;vi.spyOn(Buffer.prototype,"copy").mockImplementation(()=>{touched=true;return 0;});expect(readInventorySourceLeaseChunk(owner,lease,0,Buffer.byteLength(text))).toEqual(Buffer.from(text));expect(touched).toBe(false);
  });
  it("SS10 chunk APIs reject unsafe integers, overflow, negative zero, proxies and wrong argument counts",()=>{
    const owner=create(fixture()),lease=openInventorySourceLease(owner,sourcePath),size=readInventorySourceLease(owner,lease).size;expect(readInventorySourceLeaseChunk(owner,lease,size,0).length).toBe(0);
    for(const [offset,length]of [[-0,1],[0,-0],[-1,1],[0,-1],[0,65537],[0,0.5],[NaN,1],[Infinity,1],[size,1],[size+1,0]])expect(()=>readInventorySourceLeaseChunk(owner,lease,offset,length)).toThrow("RANGE_REFUSED");
    let touched=false;expect(()=>readInventorySourceLeaseChunk(owner,new Proxy(lease,{get(){touched=true;throw Error("never lease proxy");}}),0,1)).toThrow("AUTHORITY_REFUSED");expect(()=>Reflect.apply(readInventorySourceLeaseChunk,null,[owner,lease,0])).toThrow("AUTHORITY_REFUSED");expect(touched).toBe(false);
  });
  it("SS11 scalar ledger includes receipt metadata and all simultaneous source/text/transient charges",()=>{
    const owner=create(fixture("é😀")),held=readInventorySourceStore(owner),lease=openInventorySourceLease(owner,sourcePath),descriptor=readInventorySourceLease(owner,lease),a=held.view.accounting,M=[held.creationRecord,held.creationSnapshot,held.creationReceipt].reduce((sum,row)=>sum+Buffer.byteLength(canonicalManifest(row)),0);
    expect(a.metadataBytes).toBe(M);expect(a.canonicalScratchBytes).toBe(3*M);expect(a.controlBytes).toBe(8*M+4096*(held.creationRecord.files.length+held.creationRecord.directories.length)+65536+16384);expect(a.chunkTransientBytes).toBe(131072);expect(a.decoderTransientBytes).toBe(132096);expect(a.baseBytes).toBe(M+3*M+a.controlBytes+131072+132096);
    expect(descriptor.accounting.reservedBytes).toBe(a.baseBytes+3*descriptor.size);expect(descriptor.accounting.exactReservedBytes).toBe(a.baseBytes+descriptor.size+2*descriptor.utf16Units);expect(descriptor.accounting.exactReservedBytes).toBeLessThanOrEqual(a.limit);
  });
  it("SS12 phased tiny working set succeeds without retaining the full declared body beside text",()=>{
    const f=fixture("a".repeat(60000));put(f.options.projectRoot,"public/retained-data.bin",Buffer.alloc(1,0x62));const seed=create(f),initial=readInventorySourceStore(seed),initialBody=initial.creationRecord.files.reduce((sum:number,row:Row)=>sum+row.size,0);
    // Size genuine fixture data from an observed metadata phase, not a fabricated
    // receipt or a changed cap. A small margin absorbs scalar stat/size encoding.
    const padding=initial.view.accounting.limit-initial.view.accounting.baseBytes-120000-initialBody+32768;
    if(!Number.isSafeInteger(padding)||padding<=1||padding>1048576)throw Error("fixture padding not admissible");retireInventorySourceStore(seed);put(f.options.projectRoot,"public/retained-data.bin",Buffer.alloc(padding,0x62));
    const owner=create(f),held=readInventorySourceStore(owner),lease=openInventorySourceLease(owner,sourcePath),descriptor=readInventorySourceLease(owner,lease),body=held.creationRecord.files.reduce((sum:number,row:Row)=>sum+row.size,0);
    expect(held.creationRecord.files.some((row:Row)=>row.path==="public/retained-data.bin")).toBe(true);expect(held.view.retainedPayloadBytes).toBe(0);expect(descriptor.accounting.exactReservedBytes).toBeLessThanOrEqual(1048576);expect(held.view.accounting.baseBytes+body+descriptor.decodedBytes).toBeGreaterThan(1048576);
  });
  it("SS13 a genuine oversized single-source lease refuses before opening or allocating",()=>{
    const owner=create(fixture("a".repeat(250000))),open=vi.spyOn(fs,"openSync"),allocation=vi.spyOn(Buffer,"alloc");expect(()=>openInventorySourceLease(owner,sourcePath)).toThrow("CAP_REFUSED");expect(open).not.toHaveBeenCalled();expect(allocation).not.toHaveBeenCalled();
  });
  it("SS14 current bytes, mode, hardlink and symlink drift cannot inherit creation freshness",()=>{
    for(const change of ["bytes","mode","hardlink","symlink"]){const f=fixture(),owner=create(f),file=path.join(f.options.projectRoot,sourcePath);if(change==="bytes")fs.writeFileSync(file,"changed source bytes");else if(change==="mode")fs.chmodSync(file,0o644);else if(change==="hardlink")fs.linkSync(file,file+".linked");else{fs.renameSync(file,file+".original");fs.symlinkSync(file+".original",file);}expect(()=>openInventorySourceLease(owner,sourcePath)).toThrow(/TIP081_/);retireInventorySourceStore(owner);}
  });
  it("SS15 close and retirement invalidate handles yet permit the next controlled owner",()=>{
    const owner=create(fixture()),lease=openInventorySourceLease(owner,sourcePath);retireInventorySourceStore(owner);expect(()=>readInventorySourceLease(owner,lease)).toThrow("AUTHORITY_REFUSED");expect(()=>readInventorySourceStore(owner)).toThrow("AUTHORITY_REFUSED");const next=create(fixture()),held=openInventorySourceLease(next,sourcePath);closeInventorySourceLease(next,held);expect(()=>readInventorySourceLease(next,held)).toThrow("AUTHORITY_REFUSED");expect(()=>closeInventorySourceLease(next,held)).toThrow("AUTHORITY_REFUSED");
  });
  it("SS16 deadline failures still permit authenticated cleanup, never deadline renewal",()=>{
    const owner=create(fixture()),lease=openInventorySourceLease(owner,sourcePath);vi.spyOn(performance,"now").mockReturnValue(Infinity);expect(()=>readInventorySourceLease(owner,lease)).toThrow("TIME_REFUSED");expect(closeInventorySourceLease(owner,lease).status).toBe("SOURCE_LEASE_CLOSED");expect(retireInventorySourceStore(owner).status).toBe("SOURCE_STORE_RETIRED");
    vi.restoreAllMocks();expect(readInventorySourceStore(create(fixture())).view.retainedPayloadBytes).toBe(0);
  });
  it("SS17 retained source boundaries contain metadata only and no whole-read/parser/target callbacks",()=>{
    const source=fs.readFileSync(new URL("../../scripts/test/store-tip081-inventory-source.mjs",import.meta.url),"utf8");expect(source).not.toMatch(/\b(?:readInventoryFile|readManifestSnapshot|createManifestSnapshot|loadManifestParser|nodeFileTrace|writeFileSync|eval|createRequire)\b/);expect(source).not.toMatch(/(?:Buffer\.concat|pieces\.push)/);
    // Path construction uses path.join; source decoding must not assemble pieces with array joins.
    const decodeStart=source.indexOf("function measurePrivate("),decodeEnd=source.indexOf("export function readInventorySourceLease(");expect(decodeStart).toBeGreaterThanOrEqual(0);expect(decodeEnd).toBeGreaterThan(decodeStart);expect(source.slice(decodeStart,decodeEnd)).not.toMatch(/\.join\(/);
    expect(source).toContain("stores.set(owner,{...metadata,view,index,started})");expect(source).toContain("leases.set(lease,{owner,descriptor,bytes,text})");expect(source).toContain("Buffer.alloc(row.size)");expect(source.indexOf("same(opened,expected)")).toBeLessThan(source.indexOf("Buffer.alloc(row.size)"));
    const held=readInventorySourceStore(create(fixture()));expect(canonicalManifest(held)).not.toContain("NEVER_LEASE_TARGET");expect(canonicalManifest(held)).not.toContain("NEVER_DEPENDENCY_LEASE");
  });
});
