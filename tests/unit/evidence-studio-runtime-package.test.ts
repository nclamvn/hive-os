import {afterEach,describe,expect,it,vi} from "vitest";
import {chmodSync,linkSync,lstatSync,mkdtempSync,mkdirSync,readFileSync,readdirSync,rmdirSync,rmSync,symlinkSync,unlinkSync,writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";

// Source-only authoring. Fixtures are created only when Main executes this suite.
// No installed NFT, retained runtime search, application module or server is invoked.
// Runtime 8MiB/file is the current provisional conservative policy, not proof of
// an Owner contract violation: the inherited 8MiB clause scoped source/static/public.
import * as r from "../../scripts/test/runtime-tip081-package.mjs";
const ownedRoots=new Set<string>();
const hash=(bytes:string|Buffer)=>createHash("sha256").update(bytes).digest("hex");
function privateRoot():string {const root=mkdtempSync("/private/tmp/hiveos-tip081-runtime-");ownedRoots.add(root);return root;}
function fixture(){const f=r.prepareRuntimeTiny();ownedRoots.add(f.root);ownedRoots.add(f.outputRoot);return f;}
function tinyPlan(){const f=fixture();return {...f,plan:r.planRuntimeTiny(f.root)};}
function materialized(){const f=tinyPlan();return {...f,result:r.materializeRuntime(f.plan,f.outputRoot)};}
function configFixture(){const f=r.prepareConfigProof();ownedRoots.add(f.root);return f;}
function row(change:Record<string,unknown>={}){return {path:"entry.cjs",sourceRoot:"/private/tmp/hiveos-tip081-runtime-FIXTURE/tiny-project",sourceFile:"entry.cjs",size:1,digest:"a".repeat(64),kind:"generated",device:1,inode:1,...change};}
function cap(rows:unknown[],options:Record<string,unknown>={}){return r.cappedPlan(rows,{tiny:true,sourceDigest:"a".repeat(64),...options});}
function originalConfig(root:string){const bytes=readFileSync("next.config.ts");writeFileSync(path.join(root,"next.config.ts"),bytes,{flag:"wx",mode:0o600});return bytes;}
function rewriteJson(file:string,change:(value:Record<string,unknown>)=>void){const value=JSON.parse(readFileSync(file,"utf8"));change(value);writeFileSync(file,JSON.stringify(value),{mode:0o600});}
afterEach(()=>{for(const root of ownedRoots){if(!/^\/private\/tmp\/hiveos-tip081-runtime-[A-Za-z0-9]+$/.test(root))throw new Error("TEST_OWNED_ROOT_REFUSED");rmSync(root,{recursive:true,force:true});}ownedRoots.clear();});

describe("TIP081 two-stage T1 source-bound overlay, engineering-only",()=>{
  it("T1-01 successor source declares only the accepted loader correction and output undefined",()=>{
    const source=r.twoStageOverlaySource().toString("utf8"),p=r.twoStageOverlayProvenance();
    expect(source).toContain("output:undefined");expect(source).toContain("symlinks:false");expect(source).toContain(r.OVERLAY_RECORD);expect(source).toContain(p.sourceDigest);
    expect(p).toMatchObject({version:1,purpose:r.RUNTIME_PURPOSE,file:"next.config.mjs",delta:"webpack.resolveLoader.symlinks=false;output=undefined",applicationBuildAllowed:false});expect(p.digest).toBe(hash(source));
  });
  it("T1-02 create-only overlay preserves original config bytes and verifies its exact receipt",()=>{
    const root=privateRoot(),original=originalConfig(root),record=r.writeTwoStageOverlay(root);
    expect(r.assertTwoStageOverlay(root)).toBe(true);expect(readFileSync(path.join(root,"next.config.ts"))).toEqual(original);
    expect(JSON.parse(readFileSync(path.join(root,r.OVERLAY_RECORD),"utf8"))).toEqual(record);expect(()=>r.writeTwoStageOverlay(root)).toThrow();
  });
  it("T1-03 collision and modified original config refuse before successor writes",()=>{
    const root=privateRoot();originalConfig(root);writeFileSync(path.join(root,"next.config.cjs"),"module.exports={}");expect(()=>r.writeTwoStageOverlay(root)).toThrow();expect(readdirSync(root)).not.toContain("next.config.mjs");
    unlinkSync(path.join(root,"next.config.cjs"));writeFileSync(path.join(root,"next.config.ts"),"changed");expect(()=>r.writeTwoStageOverlay(root)).toThrow();expect(readdirSync(root)).not.toContain(r.OVERLAY_RECORD);
  });
  it("T1-04 overlay bytes and lineage tampering are not automatically repaired",()=>{
    const root=privateRoot();originalConfig(root);r.writeTwoStageOverlay(root);writeFileSync(path.join(root,"next.config.mjs"),"export default {}\n");expect(()=>r.assertTwoStageOverlay(root)).toThrow();
    writeFileSync(path.join(root,"next.config.mjs"),r.twoStageOverlaySource());rewriteJson(path.join(root,r.OVERLAY_RECORD),p=>{p.sourceDigest="b".repeat(64);});expect(()=>r.assertTwoStageOverlay(root)).toThrow();
  });
  it("T1-05 normalized semantic options permit only output removal and equal loader functions",()=>{
    const root="/private/tmp/hiveos-tip081-runtime-FIXTURE",webpack=(config:unknown)=>config;
    const previous={output:"standalone",outputFileTracingRoot:root,turbopack:{root},distDir:".next-tip080",webpack,configOrigin:"original"};
    const next={...previous,output:undefined,configOrigin:"successor"};expect(r.assertTwoStageOptions(next,previous,root)).toBe(true);
    for(const bad of [{...next,output:"standalone"},{...next,distDir:".next"},{...next,outputFileTracingRoot:"/"},{...next,turbopack:{root:"/"}},{...next,webpack:(config:unknown)=>({config})}])expect(()=>r.assertTwoStageOptions(bad,previous,root)).toThrow();
  });
});

describe("TIP081 two-stage T2 lexical/read guards, never actual NFT",()=>{
  it("T2-01 relative paths reject traversal, separators, forbidden namespaces and absolute roots",()=>{
    expect(r.runtimeRelative("node_modules/@tip081/root/index.cjs")).toBe("node_modules/@tip081/root/index.cjs");
    for(const file of ["","/absolute","../up","a/../up","a/./b","a//b","a\\b",".env","x/.git/config","artifacts/fixture","p139-fixture","grant.json","x/LIVE_APPROVAL.json"])expect(()=>r.runtimeRelative(file)).toThrow();
  });
  it("T2-02 provisional runtime file policy rejects invalid, fractional and oversized sizes",()=>{
    expect(r.fileCap("file.js",r.MAX_FILE_BYTES)).toBe(true);expect(r.MAX_FILE_BYTES).toBe(8388608);expect(r.MAX_BYTES).toBe(67108864);expect(r.MAX_ENTRIES).toBe(20000);
    for(const size of [-1,0.1,NaN,Infinity,r.MAX_FILE_BYTES+1,13448165])expect(()=>r.fileCap("file.js",size)).toThrow();
  });
  it("T2-03 private roots must be exact owned UID0700 regular directories",()=>{
    const root=privateRoot();expect(r.ownedRuntimeRoot(root)).toBe(root);expect(lstatSync(root).uid).toBe(process.getuid?.());
    chmodSync(root,0o755);expect(()=>r.ownedRuntimeRoot(root)).toThrow();chmodSync(root,0o700);
    for(const invalid of ["/private/tmp","/Users/os/hiveos","/private/tmp/hiveos-tip081-runtime-FIXTURE/sub"])expect(()=>r.ownedRuntimeRoot(invalid)).toThrow();
    const symlink=privateRoot();rmSync(symlink,{recursive:true});symlinkSync(root,symlink,"dir");expect(()=>r.ownedRuntimeRoot(symlink)).toThrow();
  });
  it("T2-04 fixed virtual reader maps only the controlled dependency link with bounded counters",()=>{
    const f=fixture(),base=path.join(f.root,"tiny-project"),nodeRoot=path.join(f.root,"tiny-installed"),reader=r.createVirtualReader({base,nodeRoot,projectFiles:new Set(["entry.cjs","package.json"]),tiny:true});
    const entry=reader.readFile(path.join(base,"entry.cjs")),manifest=reader.stat(path.join(base,"node_modules/@tip081/root/package.json"));
    if(entry===null||manifest===null)throw new Error("TEST_EXPECTED_TINY_INPUT_MISSING");
    expect(entry.toString()).toBe("module.exports=require('@tip081/root');\n");expect(manifest.isFile()).toBe(true);expect(reader.readlink(path.join(base,"node_modules"))).toBeNull();expect(reader.counter.maxBytes).toBe(1048576);expect(reader.counter.maxEntries).toBe(128);expect(reader.counter.operations).toBeGreaterThan(0);
  });
  it("T2-05 lexical callback escapes and unknown dynamic patterns fail without target reads",()=>{
    const f=fixture(),base=path.join(f.root,"tiny-project"),reader=r.createVirtualReader({base,nodeRoot:path.join(f.root,"tiny-installed"),projectFiles:new Set(["entry.cjs","package.json"]),tiny:true});
    for(const p of ["relative.js",base+"/../escape",f.outputRoot+"/not-a-file",base+"/artifacts/fixture"])expect(()=>reader.stat(p)).toThrow();
    expect(()=>reader.ignore("dynamic/*.json")).toThrow();expect(reader.stat(path.join(f.root,"node_modules/missing/package.json"))).toBeNull();
  });
  it("T2-06 existing undeclared assets and nested symlinks are refused",()=>{
    const f=fixture(),base=path.join(f.root,"tiny-project"),reader=r.createVirtualReader({base,nodeRoot:path.join(f.root,"tiny-installed"),projectFiles:new Set(["entry.cjs","package.json"]),tiny:true});
    writeFileSync(path.join(base,"unlisted.json"),"{}");expect(()=>reader.readFile(path.join(base,"unlisted.json"))).toThrow();
    symlinkSync(path.join(base,"entry.cjs"),path.join(base,"node_modules/@tip081/root/linked.cjs"));expect(()=>reader.stat(path.join(base,"node_modules/@tip081/root/linked.cjs"))).toThrow();
  });
  it("T2-07 alternate virtual roots/link targets and missing inventories are refused",()=>{
    const f=fixture(),base=path.join(f.root,"tiny-project"),nodeRoot=path.join(f.root,"tiny-installed");
    expect(()=>r.createVirtualReader({base,nodeRoot:f.outputRoot,projectFiles:new Set(),tiny:true})).toThrow();expect(()=>r.createVirtualReader({base,nodeRoot,projectFiles:[],tiny:true})).toThrow();
    unlinkSync(path.join(base,"node_modules"));symlinkSync(f.outputRoot,path.join(base,"node_modules"),"dir");expect(()=>r.createVirtualReader({base,nodeRoot,projectFiles:new Set(),tiny:true})).toThrow();
  });
  it("T2-08 callback read/time counters are private, bounded and cannot be widened by callers",()=>{
    const f=fixture(),base=path.join(f.root,"tiny-project"),nodeRoot=path.join(f.root,"tiny-installed"),inventory=new Set(["entry.cjs","bounded.bin"]);writeFileSync(path.join(base,"bounded.bin"),Buffer.alloc(65536));
    const reader=r.createVirtualReader({base,nodeRoot,projectFiles:inventory,tiny:true});expect(Object.isFrozen(reader)).toBe(true);expect(Object.isFrozen(reader.counter)).toBe(true);expect(()=>Object.assign(reader,{tiny:false})).toThrow();expect(()=>Object.assign(reader.counter,{maxBytes:Infinity})).toThrow();
    for(let i=0;i<16;i++)reader.readFile(path.join(base,"bounded.bin"));expect(()=>reader.readFile(path.join(base,"bounded.bin"))).toThrow();
    const timed=r.createVirtualReader({base,nodeRoot,projectFiles:inventory,tiny:true}),future=performance.now()+r.MAX_MS+1,clock=vi.spyOn(performance,"now").mockReturnValue(future);try{expect(()=>timed.stat(path.join(base,"entry.cjs"))).toThrow();}finally{clock.mockRestore();}
  });
  it("T2-09 forged reader authority and invalid entry selections refuse before any NFT load",async()=>{
    await expect(r.guardedNft({tiny:false},[])).rejects.toThrow("TIP081_RUNTIME_READER_AUTHORITY_REFUSED");await expect(r.guardedNft({tiny:true,counter:{maxEntries:128}},[])).rejects.toThrow("TIP081_RUNTIME_READER_AUTHORITY_REFUSED");
    const f=fixture(),base=path.join(f.root,"tiny-project"),reader=r.createVirtualReader({base,nodeRoot:path.join(f.root,"tiny-installed"),projectFiles:new Set(["entry.cjs"]),tiny:true});await expect(r.guardedNft({...reader},[])).rejects.toThrow("TIP081_RUNTIME_READER_AUTHORITY_REFUSED");await expect(r.guardedNft(reader,[])).rejects.toThrow("TIP081_RUNTIME_TRACE_INPUT_REFUSED");await expect(r.guardedNft(reader,Array(129).fill(path.join(base,"entry.cjs")))).rejects.toThrow("TIP081_RUNTIME_TRACE_INPUT_REFUSED");
  });
  it("T2-10 bounded refusal diagnostics retain evidence without promoting predecessor",()=>{
    const e=Object.assign(new Error("failed\n"+"x".repeat(2000)),{code:"TIP081_RUNTIME_FILE_CAP",phase:"GENERATED_PREFLIGHT",details:{path:"file.js",bytes:13448165,limit:8388608,unlisted:"private"}}),safe=r.safeRuntimeError(e);
    expect(safe).toMatchObject({status:"OFFLINE_RUNTIME_REFUSED",phase:"GENERATED_PREFLIGHT",nftInvoked:false,outputsCreated:0,applicationBuilds:0,fullRuntimeClosure:"NOT_ACCEPTED"});expect(safe.message.length).toBeLessThanOrEqual(1000);expect(safe.message).not.toContain("\n");expect(safe.details).not.toHaveProperty("unlisted");
  });
});

describe("TIP081 two-stage T3 complete plan admission and accounting",()=>{
  it("T3-01 root/kind/output/source mappings are exact, not caller-selected alternate roots",()=>{
    expect(r.assertPlanRow(row(),true)).toBe(true);expect(r.assertPlanRow(row({path:"node_modules/a.cjs",sourceFile:"a.cjs",sourceRoot:"/private/tmp/hiveos-tip081-runtime-FIXTURE/tiny-installed",kind:"dependency"}),true)).toBe(true);
    for(const bad of [row({kind:"unknown"}),row({sourceRoot:"/"}),row({kind:"dependency"}),row({sourceFile:"other.cjs"}),row({digest:"invalid"}),row({device:-1}),row({inode:0.5}),row({sourceRoot:r.INSTALLED_ROOT})])expect(()=>r.assertPlanRow(bad,true)).toThrow();
  });
  it("T3-02 plan rejects duplicate paths, reserved metadata paths and filesystem prefix collisions",()=>{
    expect(()=>cap([row(),row()])).toThrow();for(const name of [r.PLAN_FILE,r.RECEIPT_FILE]){expect(()=>cap([row({path:name,sourceFile:name})])).toThrow();expect(()=>cap([row({path:`${name}/child`,sourceFile:`${name}/child`})])).toThrow();}
    expect(()=>cap([row({path:"tree",sourceFile:"tree"}),row({path:"tree/child",sourceFile:"tree/child"})])).toThrow();
  });
  it("T3-03 snapshot costs, plan bytes, directories and receipt count toward unchanged tiny caps",()=>{
    const p=cap([row()],{snapshotBytes:10,snapshotEntries:4});expect(p.totalBytes).toBeGreaterThan(10+1+p.planBytes.length);expect(p.totalEntries).toBeGreaterThan(4+p.files.length);expect(p.limits).toEqual({maxBytes:1048576,maxFile:1048576,maxEntries:128});
    expect(()=>cap([row()],{snapshotBytes:1048576})).toThrow();expect(()=>cap([row()],{snapshotEntries:128})).toThrow();expect(()=>cap([row({size:1048576})])).toThrow();
  });
  it("T3-04 impossible/forged aggregate counters or source digests are refused",()=>{
    for(const options of [{snapshotBytes:-1},{snapshotEntries:0.5},{sourceDigest:"bad"},{tiny:false,snapshotBytes:0,snapshotEntries:0}])expect(()=>cap([row()],options)).toThrow();
    const many=Array.from({length:129},(_,i)=>row({path:`file${i}.cjs`,sourceFile:`file${i}.cjs`}));expect(()=>cap(many)).toThrow();
  });
  it("T3-05 accepted tiny plans are frozen, sorted and explicitly not app-build authority",()=>{
    const f=tinyPlan();expect(Object.isFrozen(f.plan)).toBe(true);expect(Object.isFrozen(f.plan.files)).toBe(true);expect(f.plan.files.every((v:object)=>Object.isFrozen(v))).toBe(true);expect(f.plan.planDigest).toBe(hash(f.plan.planBytes));
    expect(f.plan).toMatchObject({purpose:r.RUNTIME_PURPOSE,tiny:true,appBuildStatus:"FAILED_PREDECESSOR_NOT_PROMOTED",applicationBuildAllowed:false,dynamicNativeCoverage:"FIXED_REVIEWED_TINY_ONLY"});expect(f.plan.totalBytes).toBeLessThanOrEqual(1048576);expect(f.plan.totalEntries).toBeLessThanOrEqual(128);
  });
});

describe("TIP081 two-stage T4 private all-regular exact materialization, no execution",()=>{
  it("T4-01 exact complete tiny plan produces independent regular files and zero-build receipt",()=>{
    const f=materialized(),verified=r.verifyRuntimeOutput(f.outputRoot,f.plan);expect(verified.files).toBe(f.plan.files.length);expect(f.result).toMatchObject({status:"OFFLINE_MATERIALIZED_APP_NOT_EXECUTED",applicationBuilds:0,buildAuthority:"NONE",appExecuted:false});
    for(const file of f.plan.files){const st=lstatSync(path.join(f.outputRoot,file.path));expect(st.isFile()).toBe(true);expect(st.isSymbolicLink()).toBe(false);expect(st.nlink).toBe(1);expect(st.dev===file.device&&st.ino===file.inode).toBe(false);expect(st.mode&0o777).toBe(0o600);}expect(r.verifyLoadedTiny(f.outputRoot).receipt.appExecuted).toBe(false);
  });
  it("T4-02 destination is preallocated exact empty private root, not a caller alternative",()=>{
    const f=tinyPlan(),other=privateRoot();expect(()=>r.materializeRuntime(f.plan,other)).toThrow();expect(readdirSync(other)).toEqual([]);writeFileSync(path.join(f.outputRoot,"occupied"),"x");expect(()=>r.materializeRuntime(f.plan,f.outputRoot)).toThrow();expect(readdirSync(f.outputRoot)).toEqual(["occupied"]);
  });
  it("T4-03 forged plan clones and altered plan bytes refuse before output writes",()=>{
    const f=tinyPlan();expect(()=>r.materializeRuntime({...f.plan},f.outputRoot)).toThrow();expect(readdirSync(f.outputRoot)).toEqual([]);f.plan.planBytes[0]^=1;expect(()=>r.materializeRuntime(f.plan,f.outputRoot)).toThrow();expect(readdirSync(f.outputRoot)).toEqual([]);
  });
  it("T4-04 source digest, input bytes and complete input inventory are revalidated before copy",()=>{
    const f=tinyPlan(),bad=cap([...f.plan.files],{snapshotBytes:f.plan.snapshotBytes,snapshotEntries:f.plan.snapshotEntries,sourceDigest:"b".repeat(64),destinationRoot:f.outputRoot});expect(()=>r.materializeRuntime(bad,f.outputRoot)).toThrow();expect(readdirSync(f.outputRoot)).toEqual([]);
    const subset=cap(f.plan.files.slice(0,1),{snapshotBytes:f.plan.snapshotBytes,snapshotEntries:f.plan.snapshotEntries,sourceDigest:f.plan.sourceDigest,destinationRoot:f.outputRoot});expect(()=>r.materializeRuntime(subset,f.outputRoot)).toThrow("TIP081_RUNTIME_PLAN_AUTHORITY_REFUSED");expect(readdirSync(f.outputRoot)).toEqual([]);
    writeFileSync(path.join(f.root,"tiny-project/entry.cjs"),"changed");expect(()=>r.materializeRuntime(f.plan,f.outputRoot)).toThrow();expect(readdirSync(f.outputRoot)).toEqual([]);
  });
  it("T4-05 missing and unexpected synthetic input files refuse rather than silently narrow closure",()=>{
    const f=fixture();writeFileSync(path.join(f.root,"tiny-project/extra.cjs"),"extra");expect(()=>r.inspectTinyInputs(f.root)).toThrow();unlinkSync(path.join(f.root,"tiny-project/extra.cjs"));unlinkSync(path.join(f.root,"tiny-project/entry.cjs"));expect(()=>r.inspectTinyInputs(f.root)).toThrow();
    const alias=fixture();linkSync(path.join(alias.root,"tiny-project/entry.cjs"),path.join(alias.outputRoot,"input-alias.cjs"));expect(()=>r.inspectTinyInputs(alias.root)).toThrow();
  });
  it("T4-06 changed, extra and missing output files are refused by both verifiers",()=>{
    const f=materialized(),file=path.join(f.outputRoot,"entry.cjs"),bytes=readFileSync(file);writeFileSync(file,"changed");expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();
    writeFileSync(file,bytes);writeFileSync(path.join(f.outputRoot,"extra.cjs"),"extra");expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();unlinkSync(path.join(f.outputRoot,"extra.cjs"));unlinkSync(file);expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();
  });
  it("T4-07 output symlinks and hardlinks cannot impersonate independent regular copies",()=>{
    const f=materialized(),file=path.join(f.outputRoot,"entry.cjs"),source=path.join(f.root,"tiny-project/entry.cjs");unlinkSync(file);symlinkSync(source,file);expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();
    unlinkSync(file);linkSync(source,file);expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();
  });
  it("T4-08 strict receipts forbid extra fields, forged success and altered lineage/version",()=>{
    const f=materialized(),receiptFile=path.join(f.outputRoot,r.RECEIPT_FILE),receipt=readFileSync(receiptFile);for(const mutate of [(p:Record<string,unknown>)=>{p.applicationBuilds=1;},(p:Record<string,unknown>)=>{p.extra="ignored?";},(p:Record<string,unknown>)=>{p.version=2;},(p:Record<string,unknown>)=>{p.sourceDigest="b".repeat(64);}]){writeFileSync(receiptFile,receipt);rewriteJson(receiptFile,mutate);expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();}
  });
  it("T4-09 metadata byte changes, missing receipt and loose private root refuse before load",()=>{
    const f=materialized(),planFile=path.join(f.outputRoot,r.PLAN_FILE),bytes=readFileSync(planFile);writeFileSync(planFile,Buffer.concat([bytes,Buffer.from(" ")]));expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();writeFileSync(planFile,bytes);unlinkSync(path.join(f.outputRoot,r.RECEIPT_FILE));expect(()=>r.verifyRuntimeOutput(f.outputRoot,f.plan)).toThrow();expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();chmodSync(f.outputRoot,0o755);expect(()=>r.verifyLoadedTiny(f.outputRoot)).toThrow();
  });
  it("T4-10 rewritten tiny-input record cannot relax fixed provenance or output binding",()=>{
    const f=fixture(),recordFile=path.join(f.root,"tip081-runtime-tiny.json"),bytes=readFileSync(recordFile);for(const mutate of [(p:Record<string,unknown>)=>{p.version=2;},(p:Record<string,unknown>)=>{p.extra=true;},(p:Record<string,unknown>)=>{p.sourceDigest="b".repeat(64);},(p:Record<string,unknown>)=>{p.outputRoot=f.root;}]){writeFileSync(recordFile,bytes);rewriteJson(recordFile,mutate);expect(()=>r.inspectTinyInputs(f.root)).toThrow();}
  });
});

describe("TIP081 config-proof C2 normalized option guards, synthetic functions only",()=>{
  function options(){
    const root="/private/tmp/hiveos-tip081-runtime-FIXTURE",webpack=(config:unknown)=>config;
    const predecessor={output:"standalone",outputFileTracingRoot:root,turbopack:{root},distDir:".next-tip080",webpack,configOrigin:"predecessor",configFile:"original-config",configFileName:"next.config.mjs"};
    const successor={...predecessor,output:undefined,configOrigin:"successor",configFile:"successor-config"};return {root,predecessor,successor};
  }
  it("C2-01 only established config metadata differences are omitted from option comparison",()=>{
    const f=options();expect(r.assertTwoStageOptions(f.successor,f.predecessor,f.root)).toBe(true);
    for(const extra of [{unknownField:true},{webpackLoaderPolicy:"bypass"},{sourceDigest:"unmatched"},{configFilePath:"another-field"}])expect(()=>r.assertTwoStageOptions({...f.successor,...extra},f.predecessor,f.root)).toThrow("TIP081_TWO_STAGE_OPTIONS_REFUSED");
  });
  it("C2-02 declared output removal cannot conceal normalized root, nested option or predecessor drift",()=>{
    const f=options();for(const change of [{output:"standalone"},{turbopack:{root:f.root,unknown:true}},{outputFileTracingRoot:"/private/tmp"},{distDir:".next-other"},{experimental:{unreviewed:true}}])expect(()=>r.assertTwoStageOptions({...f.successor,...change},f.predecessor,f.root)).toThrow();
    expect(()=>r.assertTwoStageOptions(f.successor,{...f.predecessor,output:undefined},f.root)).toThrow();expect(()=>r.assertTwoStageOptions(f.successor,{...f.predecessor,distDir:".next-other"},f.root)).toThrow();
  });
});

describe("TIP081 config-proof C1 and C4 exact prepared inputs, no config evaluation",()=>{
  it("C1-01 preparation records bounded source-bound inputs and zero probe/build effects",()=>{
    const f=configFixture(),checked=r.inspectConfigProof(f.root);
    expect(f).toMatchObject({purpose:r.CONFIG_PROOF_PURPOSE,applicationBuilds:0,probesRun:0});expect(f.TMPDIR).toBe(path.join(f.root,"tmp"));expect(f.inputBytes).toBe(checked.bytes);expect(f.inputEntries).toBe(checked.entries);expect(checked.bytes).toBeLessThanOrEqual(1048576);expect(checked.entries).toBeLessThanOrEqual(128);
    expect(checked.record).toMatchObject({version:1,purpose:r.CONFIG_PROOF_PURPOSE,root:f.root,profile:"TIP080_QA",phase:"phase-production-build",nativeTs:false,applicationBuildAllowed:false});
    const record=readFileSync(path.join(f.root,r.CONFIG_PROOF_RECORD));expect(r.inspectConfigProof(f.root)).toEqual(checked);expect(readFileSync(path.join(f.root,r.CONFIG_PROOF_RECORD))).toEqual(record);expect(readdirSync(path.join(f.root,"tmp"))).toEqual([]);
  });
  it("C1-02 all original, baseline and predecessor config copies retain exact pinned original bytes",()=>{
    const f=configFixture(),original=readFileSync("next.config.ts");for(const file of ["next.config.ts","baseline/next.config.ts","predecessor/next.config.ts"])expect(readFileSync(path.join(f.root,file))).toEqual(original);
    expect(readFileSync(path.join(f.root,"next.config.mjs"))).toEqual(r.twoStageOverlaySource());expect(r.inspectConfigProof(f.root).record.originalDigest).toBe(hash(original));
  });
  it("C1-03 roots, collision files, extra directories and missing inputs refuse before evaluation",()=>{
    for(const root of ["/Users/os/hiveos","/private/tmp"])expect(()=>r.inspectConfigProof(root)).toThrow();
    const f=configFixture(),extra=path.join(f.root,"next.config.cjs");writeFileSync(extra,"module.exports={}");expect(()=>r.inspectConfigProof(f.root)).toThrow();unlinkSync(extra);
    writeFileSync(path.join(f.root,"extra.json"),"{}");expect(()=>r.inspectConfigProof(f.root)).toThrow();unlinkSync(path.join(f.root,"extra.json"));mkdirSync(path.join(f.root,"unexpected"),{mode:0o700});expect(()=>r.inspectConfigProof(f.root)).toThrow();rmdirSync(path.join(f.root,"unexpected"));unlinkSync(path.join(f.root,"baseline/tsconfig.json"));expect(()=>r.inspectConfigProof(f.root)).toThrow();
  });
  it("C1-04 trusted dependency links cannot be replaced with alternate owned roots or nested links",()=>{
    const f=configFixture(),alternate=privateRoot(),link=path.join(f.root,"predecessor/node_modules");unlinkSync(link);symlinkSync(alternate,link,"dir");expect(()=>r.inspectConfigProof(f.root)).toThrow();
    unlinkSync(link);symlinkSync(r.INSTALLED_ROOT,link,"dir");const original=path.join(f.root,"baseline/next.config.ts");unlinkSync(original);symlinkSync(path.join(f.root,"next.config.ts"),original);expect(()=>r.inspectConfigProof(f.root)).toThrow();
  });
  it("C1-05 preparation input and child directory ownership modes cannot be relaxed",()=>{
    const f=configFixture();chmodSync(path.join(f.root,"baseline"),0o755);expect(()=>r.inspectConfigProof(f.root)).toThrow();chmodSync(path.join(f.root,"baseline"),0o700);linkSync(path.join(f.root,"package.json"),path.join(f.root,"tmp/package-alias.json"));expect(()=>r.inspectConfigProof(f.root)).toThrow();
  });
  it("C1-06 missing execution profile refuses before Next loading with every prepared byte unchanged",async()=>{
    const f=configFixture(),before=r.inspectConfigProof(f.root),profile=process.env.HIVE_BUILD_PROFILE;
    try{delete process.env.HIVE_BUILD_PROFILE;await expect(r.probeConfigProof(f.root)).rejects.toThrow("TIP081_CONFIG_PROOF_PROFILE_REFUSED");}finally{if(profile===undefined)delete process.env.HIVE_BUILD_PROFILE;else process.env.HIVE_BUILD_PROFILE=profile;}
    expect(r.inspectConfigProof(f.root)).toEqual(before);expect(readdirSync(f.TMPDIR)).toEqual([]);
  });
  it("C4-01 revalidation rejects independent original, predecessor and successor byte changes",()=>{
    const f=configFixture();for(const file of ["next.config.ts","baseline/next.config.ts","predecessor/next.config.mjs","predecessor/tip081-compiler-overlay.json","next.config.mjs",r.OVERLAY_RECORD]){const target=path.join(f.root,file),before=readFileSync(target);writeFileSync(target,Buffer.concat([before,Buffer.from(" ")]));expect(()=>r.inspectConfigProof(f.root)).toThrow();writeFileSync(target,before);expect(()=>r.inspectConfigProof(f.root)).not.toThrow();}
  });
  it("C4-02 create-only preparation records reject unknown fields and source/profile/root lineage changes",()=>{
    const f=configFixture(),file=path.join(f.root,r.CONFIG_PROOF_RECORD),before=readFileSync(file);
    for(const mutate of [(p:Record<string,unknown>)=>{p.extra="unexpected";},(p:Record<string,unknown>)=>{p.sourcePins={};},(p:Record<string,unknown>)=>{p.installedPins={};},(p:Record<string,unknown>)=>{p.inputPins={};},(p:Record<string,unknown>)=>{p.profile="production";},(p:Record<string,unknown>)=>{p.root="/private/tmp";},(p:Record<string,unknown>)=>{p.applicationBuildAllowed=true;}]){writeFileSync(file,before);rewriteJson(file,mutate);expect(()=>r.inspectConfigProof(f.root)).toThrow();}
  });
  it("C4-03 bounded config-loader diagnostics preserve explicit zero-app-effect and no-closure scope",()=>{
    const error=Object.assign(new Error("config failure\n"+"x".repeat(2000)),{code:"TIP081_CONFIG_PROOF_INPUT_CHANGED",__NEXT_ERROR_CODE:"E147",stack:"Error: config\n"+Array.from({length:12},()=>" at owned-"+"x".repeat(400)).join("\n"),details:{path:"next.config.ts",unapproved:"do not serialize"}}),safe=r.safeConfigProofError(error);
    expect(safe).toMatchObject({purpose:r.CONFIG_PROOF_PURPOSE,status:"OFFLINE_RUNTIME_REFUSED",__NEXT_ERROR_CODE:"E147",separateTransformCalls:0,applicationBuilds:0,fullRuntimeClosure:"NOT_ACCEPTED"});expect(safe.message.length).toBeLessThanOrEqual(1000);expect(safe.stackFrames).toHaveLength(8);expect(safe.stackFrames.every((frame:string)=>frame.length<=300)).toBe(true);expect(safe.details).not.toHaveProperty("unapproved");expect(safe.nftInvoked).toBeNull();expect(r.safeConfigProofError({__NEXT_ERROR_CODE:"untrusted-code"}).__NEXT_ERROR_CODE).toBeNull();
  });
});

describe("TIP081 config-proof C2 and C3 independent baseline and effective hook guards",()=>{
  type HookInput={resolveLoader:Record<string,unknown>;[key:string]:unknown};
  const acceptedHook=(config:HookInput)=>({...config,resolveLoader:{...config.resolveLoader,symlinks:false}});
  function options(){
    const root="/private/tmp/hiveos-tip081-runtime-FIXTURE",baseline={output:"standalone",outputFileTracingRoot:root,turbopack:{root},distDir:".next-tip080",configOrigin:"baseline",configFileName:"next.config.ts"};
    const predecessor={...baseline,webpack:acceptedHook,configOrigin:"predecessor",configFileName:"next.config.mjs"},successor={...predecessor,output:undefined,configOrigin:"successor"};return {root,baseline,predecessor,successor};
  }
  it("C2-03 actual-option guard independently anchors both overlays to the original baseline",()=>{
    const f=options();expect(r.assertConfigProofOptions(f.successor,f.predecessor,f.baseline,f.root)).toBe(true);
    expect(r.assertConfigProofOptions(f.successor,f.predecessor,{...f.baseline,webpack:null},f.root)).toBe(true);
    for(const change of [{distDir:".next-other"},{output:undefined},{webpack:acceptedHook},{webpack:"not-a-hook"},{webpack:{}},{webpack:false},{webpack:0},{outputFileTracingRoot:"/private/tmp"},{turbopack:{root:"/private/tmp"}}])expect(()=>r.assertConfigProofOptions(f.successor,f.predecessor,{...f.baseline,...change},f.root)).toThrow();
  });
  it("C2-04 matching predecessor and successor drift cannot wash out the independent baseline",()=>{
    const f=options();expect(()=>r.assertConfigProofOptions({...f.successor,distDir:".next-other"},{...f.predecessor,distDir:".next-other"},f.baseline,f.root)).toThrow();expect(()=>r.assertConfigProofOptions({...f.successor,unapproved:true},{...f.predecessor,unapproved:true},f.baseline,f.root)).toThrow();
    expect(()=>r.assertConfigProofOptions(f.successor,f.predecessor,f.baseline,"/private/tmp")).toThrow();
  });
  it("C3-01 effective sentinel hooks preserve the entire input and only disable loader symlink resolution",()=>{
    expect(r.assertConfigProofHooks({webpack:acceptedHook},{webpack:acceptedHook})).toBe(true);
  });
  it("C3-02 identical function text is insufficient when hooks mutate input or unrelated sentinel fields",()=>{
    const mutate=(config:HookInput)=>{config.resolveLoader.symlinks=false;return config;};
    const strip=(config:HookInput)=>({resolveLoader:{...config.resolveLoader,symlinks:false}});
    const widen=(config:HookInput)=>({...config,resolveLoader:{...config.resolveLoader,symlinks:false},output:{filename:"changed.js"}});
    for(const webpack of [mutate,strip,widen])expect(()=>r.assertConfigProofHooks({webpack},{webpack})).toThrow("TIP081_CONFIG_PROOF_HOOK_DELTA_REFUSED");
  });
  it("C3-03 hooks must agree and enforce the same delta for node, edge and client contexts",()=>{
    const nodeOnly=(config:HookInput,context:{isServer:boolean;nextRuntime?:string})=>({...config,resolveLoader:{...config.resolveLoader,symlinks:context.nextRuntime==="nodejs"?false:true}});
    expect(()=>r.assertConfigProofHooks({webpack:nodeOnly},{webpack:nodeOnly})).toThrow();expect(()=>r.assertConfigProofHooks({webpack:acceptedHook},{webpack:nodeOnly})).toThrow();expect(()=>r.assertConfigProofHooks({},{webpack:acceptedHook})).toThrow();
  });
});

describe("TIP081 config-proof optional Darwin intrinsic validation and discard, synthetic values withheld",()=>{
  const cfKey="__CF_USER_TEXT_ENCODING";
  function uid():number {const value=process.getuid?.();if(value===undefined||!Number.isSafeInteger(value)||value<0)throw new Error("TEST_SAFE_UID_REQUIRED");return value;}
  function ordinary():Record<string,unknown>{return {PATH:"/usr/local/bin:/usr/bin:/bin",LANG:"C",NODE_ENV:"production",HIVE_BUILD_PROFILE:"TIP080_QA",NEXT_DISABLE_SWC_WASM:"1",NEXT_IGNORE_INCORRECT_LOCKFILE:"1",NEXT_TELEMETRY_DISABLED:"1",TMPDIR:"/private/tmp/hiveos-tip081-runtime-FIXTURE/tmp"};}
  function withIntrinsic():Record<string,unknown>{return {...ordinary(),[cfKey]:`0x${uid().toString(16)}:0x0:0x0`};}
  // Compare booleans only: an assertion failure must never print an intrinsic or environment value.
  const snapshot=(input:Record<string,unknown>)=>JSON.stringify({keys:Object.keys(input).sort(),values:input});
  function refusedUnchanged(input:Record<string,unknown>,platform="darwin",currentUid=uid()){
    const before=snapshot(input);expect(()=>r.cleanupConfigProofEnvironment(input,platform,currentUid)).toThrow();expect(snapshot(input)===before).toBe(true);
  }
  it("CF-01 absent optional intrinsic passes without changing any ordinary field",()=>{
    const input=ordinary(),before=snapshot(input),result=r.cleanupConfigProofEnvironment(input,"darwin",uid());expect(snapshot(input)===before).toBe(true);expect(result).toEqual({discardedDarwinEncoding:false,discardedEnvironmentKey:null});
  });
  it("CF-02 valid current-UID Darwin encoding deletes only the intrinsic and returns scrubbed metadata",()=>{
    const input=withIntrinsic(),remaining=ordinary(),result=r.cleanupConfigProofEnvironment(input,"darwin",uid());expect(Object.hasOwn(input,cfKey)).toBe(false);expect(snapshot(input)===snapshot(remaining)).toBe(true);expect(result).toEqual({discardedDarwinEncoding:true,discardedEnvironmentKey:cfKey});
  });
  it("CF-03 every other unknown key refuses before valid intrinsic deletion",()=>{
    for(const key of ["NODE_OPTIONS","OPENAI_API_KEY","ANTHROPIC_API_KEY","UNKNOWN_ENVIRONMENT_KEY"]){const input={...withIntrinsic(),[key]:"owned-negative-control"};refusedUnchanged(input);}
  });
  it("CF-04 ordinary profile or optional-field type mismatch refuses before mutation",()=>{
    for(const change of [{NODE_ENV:"test"},{HIVE_BUILD_PROFILE:"UNAPPROVED"},{NEXT_DISABLE_SWC_WASM:"0"},{NEXT_IGNORE_INCORRECT_LOCKFILE:"0"},{NEXT_TELEMETRY_DISABLED:"0"},{TMPDIR:"/private/tmp"},{PATH:null},{LANG:1}])refusedUnchanged({...withIntrinsic(),...change});
    const missing=withIntrinsic();delete missing.HIVE_BUILD_PROFILE;refusedUnchanged(missing);
  });
  it("CF-05 foreign UID, malformed, empty, non-string and overlong encodings remain untouched",()=>{
    const current=uid().toString(16);
    for(const value of [`0x${(uid()+1).toString(16)}:0x0:0x0`,`${current}:0:0`,`${uid()}:0:0`,`0x${current}:0:0x0`,`0x${current}:0x0:0`,"","not-a-triplet","0x1:0x2","0x1:0x2:0x3:0x4",`0x${current}:0x0:0x0\n`,`0x${current}:0x0:0xGG`,`0x${"0".repeat(81)}${current}:0x0:0x0`,null,undefined,1])refusedUnchanged({...ordinary(),[cfKey]:value});
  });
  it("CF-06 non-Darwin platforms refuse the present intrinsic without using or deleting it",()=>{
    for(const platform of ["linux","win32","unknown"])refusedUnchanged(withIntrinsic(),platform);
  });
  it("CF-07 unsafe UID inputs cannot reach BigInt validation or mutate the input",()=>{
    for(const value of [-1,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])refusedUnchanged(withIntrinsic(),"darwin",value);
  });
  it("CF-08 exact execution argv remains required before environment cleanup and any Next load",async()=>{
    const f=configFixture(),before=r.inspectConfigProof(f.root),argv=[...process.execArgv];
    try{for(const invalid of [[],["--preserve-symlinks"],["--preserve-symlinks-main","--preserve-symlinks"],["--preserve-symlinks","--preserve-symlinks-main","--unapproved"]]){process.execArgv.splice(0,process.execArgv.length,...invalid);await expect(r.probeConfigProof(f.root)).rejects.toThrow("TIP081_CONFIG_PROOF_PROFILE_REFUSED");}}
    finally{process.execArgv.splice(0,process.execArgv.length,...argv);}
    expect(r.inspectConfigProof(f.root)).toEqual(before);expect(readdirSync(f.TMPDIR)).toEqual([]);
  });
});
