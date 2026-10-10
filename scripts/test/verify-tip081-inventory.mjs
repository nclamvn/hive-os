// Independent declared-universe reconstruction; no producer collector or target evaluation.
import {createHash} from "node:crypto";
import {isDeepStrictEqual,types} from "node:util";
import path from "node:path";
import {canonicalManifest,manifestDigest} from "./runtime-tip081-manifest.mjs";
import {INVENTORY_PURPOSE,INVENTORY_LIMITS,INVENTORY_TREES,INVENTORY_METADATA,INVENTORY_SEEDS,
  inventoryPath,inventoryJson,createInventoryAccess,statInventoryPath,listInventoryDirectory,
  readInventoryFile,hashInventoryFile,inventoryAccounting,readAcquiredInventory,readInventorySnapshotChunk} from "./acquire-tip081-inventory.mjs";

const order=(a,b)=>a<b?-1:a>b?1:0;
const digest=bytes=>createHash("sha256").update(bytes).digest("hex");
function freeze(value){if(value&&typeof value==="object"){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
function object(value){return !!value&&typeof value==="object"&&!Array.isArray(value)&&!types.isProxy(value)&&Object.getPrototypeOf(value)===Object.prototype;}
function exact(value,names){return object(value)&&Reflect.ownKeys(value).length===names.length&&names.every(name=>{const descriptor=Object.getOwnPropertyDescriptor(value,name);return descriptor&&Object.hasOwn(descriptor,"value");});}
/** @returns {never} All paths throw; verification never returns an undefined refusal. */
function refuse(code,stage,account={},detail={}){const error=new Error(code);error.code=code;error.details={stage,...account,...detail};throw error;}
function integer(value){return Number.isSafeInteger(value)&&value>=0;}
const chunkBytes=65536,chunkTransientBytes=2*chunkBytes;
function independentKind(file){
  const extension=path.posix.extname(file);
  if([".js",".cjs",".mjs"].includes(extension))return "javascript";
  if(extension===".json")return "json";
  if([".node",".dylib",".dll"].includes(extension)||/\.so(?:\.[0-9]+)*$/.test(file))return "native";
  if([".ts",".tsx",".jsx",".py",".sh",".exe"].includes(extension))return "unsupported";
  return "asset";
}

// Independently transcribed from the reviewed P1 binding, never producer policy.
export const VERIFIER_PROJECT_INPUTS=freeze([
  {path:"docs/research/lrc-allikvere-p199/author-kill-logs.json",size:2160,digest:"70a19806e1baa7b32dad0ada99a7d122ecd494f1a8c58352e0a2498d8b70f5b2",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-p199/author-root-readme.json",size:9549,digest:"a0157df9b2701b3537d5d5c56b7407a2d81caa950347bb8bcb2e11fec2413fe6",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-p199/provenance.json",size:1928,digest:"f72aa3f932e7baee063e35bee7a4ece0f849bd084590107713ca2da95a2694f5",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-p199/retained-cover-report.json",size:6869891,digest:"40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-p199/retained-frontier-report.json",size:5847016,digest:"a609fcf1fdd6c7d225568d1d830b6a09d069a8657fec7f5bc422f4d588865268",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-p199/retained-report.json",size:135832,digest:"82092f2b32be89999bc834d426be71aea5fa408f9865a53a795b765b3e2deb20",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-p199/retained-unit-report.json",size:16493,digest:"78519d5c7113a63bf79ed6ab8352adcf221937a6b13bfa0647251ce5478d99d4",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-cascade.json",size:4169,digest:"0872e1bd95533fea3cfbdd2eab2834607283739c5796ef4c82e5636a57affbb1",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-covering-number.json",size:90365,digest:"540adb5504a3c3b1ed9e277c304ccc20027711a0bbd29dd3d8f765c91cdd9d06",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-generation.json",size:3812,digest:"72d26052dd11ddc2c46ca5d08676975cefe398f701580a00e6499076ca2a08ef",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-p83-terminal.json",size:6974,digest:"f5e85bcad566519149f4a5267672b08bbb0f0064882a4585215d2280f4ab3230",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json",size:60648,digest:"e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-prime-criterion-audit.json",size:24624,digest:"3387eca4befe5d67845278c3120e65b098764a742af26f6e615b6da2512bf693",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json",size:6147,digest:"8f0d79ea33d484bcbd9e966096e91b0af4f7081fe46b4e3fb554f38bd2108962",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-properness-bridge.json",size:15480,digest:"caabe317e7bd8692e00a39e57f349255557701d568489613ade4f25a4b7f5d02",role:"REVIEWED_JSON_DATA"},
  {path:"docs/research/lrc-allikvere-v2/retained-shape-geometry-audit.json",size:22791,digest:"b29cd15b4520e74943e12c194765155a1238857ae39c2ab473119e9309c808fd",role:"REVIEWED_JSON_DATA"},
  {path:"scripts/operations/higherpower-core-check.ts",size:8521,digest:"fb2f8cc44564f86c4bb8982ee28efbdcb914505ec8ccb77e8a22354b122945cd",role:"SOURCE_BYTES_NO_EXECUTION"},
  {path:"scripts/operations/higherpower-core-replay.ts",size:2276,digest:"6c9b2c41bcdf3016f6271385d1a3689a9ff759ed14beb2d6c2f63ea1e14ac7e7",role:"SOURCE_BYTES_NO_EXECUTION"},
  {path:"scripts/operations/install-permutation-bridge-source.ts",size:1664,digest:"527ca3a2686d2de098349a6dfc5b23740a52264944d828f0e1ddc729924776e9",role:"SOURCE_BYTES_NO_EXECUTION"},
  {path:"src/server/research/mixed-core-power-evidence.ts",size:2594,digest:"bc9162fb646464dc6872f0f56177e656ececccd5b486e7a241f8b98f4b0db2c9",role:"SOURCE_BYTES_NO_EXECUTION"},
].map(row=>({...row,execution:false,entry:false})));
const projectInput=file=>VERIFIER_PROJECT_INPUTS.find(row=>row.path===file);

/** Pure byte binding; no filesystem access, imports, source evaluation or caller policy. */
export function checkVerifierProjectInput(file,bytes){
  inventoryPath(file);const policy=projectInput(file);
  if(!policy)refuse("TIP081_INVENTORY_VERIFIER_PROJECT_PATH_REFUSED","VERIFIER_EXACT_PROJECT_INPUTS");
  if(types.isProxy(bytes)||!Buffer.isBuffer(bytes)||Object.getPrototypeOf(bytes)!==Buffer.prototype||["length","byteLength","buffer","byteOffset","valueOf","toString",Symbol.toPrimitive].some(key=>Object.hasOwn(bytes,key)))refuse("TIP081_INVENTORY_VERIFIER_PROJECT_BYTES_REFUSED","VERIFIER_EXACT_PROJECT_INPUTS");
  if(bytes.length!==policy.size||digest(bytes)!==policy.digest)refuse("TIP081_INVENTORY_VERIFIER_PROJECT_PIN_REFUSED","VERIFIER_EXACT_PROJECT_INPUTS",{},{path:file});return policy;
}

/** Reconstruct the fixed seed/raw union from filesystem observations, not producer traversal. */
export function verifyInventory(acquired,...candidateRecords){
  const started=performance.now();let stage="VERIFIER_ADMISSION",access=null,declarationReadAttempts=0,declarationReadBytes=0;
  const counts=()=>({...access?inventoryAccounting(access):{readAttempts:0,readBytes:0,metadataAttempts:0,maxBufferBytes:0},declarationReadAttempts,declarationReadBytes});
  const fail=(code,detail={})=>refuse(code,stage,counts(),detail);
  try{
    // Canonical data admission checks descriptors/prototypes before untrusted getters.
    canonicalManifest(acquired);
    if(!exact(acquired,["record","snapshot"]))fail("TIP081_INVENTORY_VERIFIER_INPUT_REFUSED");
    const owned=readAcquiredInventory(acquired),snapshot=owned.snapshot,record=candidateRecords.length?candidateRecords[0]:owned.record;canonicalManifest(record);
    if(candidateRecords.length>1||!exact(record,["version","purpose","mode","roots","profile","epoch","files","directories","entries","rawInventories","obligations","projectInputPolicy","accounting","snapshotDigest","status","graphStatus","fullRuntimeClosure","execution","materialization","digest"])||record.version!==1||record.purpose!==INVENTORY_PURPOSE||record.status!=="ACQUIRED_UNIVERSE_OPEN"||record.graphStatus!=="ACQUIRED_GRAPH_UNRUN"||record.fullRuntimeClosure!=="NOT_ACCEPTED"||record.execution!==false||record.materialization!==false||!exact(record.roots,["projectRoot","dependencyRoot"])||!Array.isArray(record.files)||!Array.isArray(record.entries)||!Array.isArray(record.directories)||!Array.isArray(record.rawInventories)||!Array.isArray(record.obligations))fail("TIP081_INVENTORY_VERIFIER_SCHEMA_REFUSED");
    const policyDigest=manifestDigest(VERIFIER_PROJECT_INPUTS);
    if(!exact(record.projectInputPolicy,["purpose","digest","records"])||record.projectInputPolicy.purpose!=="TIP081_EXACT20_DATA_ONLY_ADMISSION"||record.projectInputPolicy.digest!==policyDigest||!Array.isArray(record.projectInputPolicy.records))fail("TIP081_INVENTORY_VERIFIER_PROJECT_POLICY_REFUSED");
    if(record.mode!==owned.record.mode||!isDeepStrictEqual(record.roots,owned.record.roots))fail("TIP081_INVENTORY_VERIFIER_ROOT_REFUSED");
    const {digest:claimedDigest,...body}=record;
    if(manifestDigest(body)!==claimedDigest)fail("TIP081_INVENTORY_VERIFIER_DIGEST_REFUSED");
    const limit=record.mode==="SYNTHETIC"?INVENTORY_LIMITS.tinyBytes:INVENTORY_LIMITS.bytes,entryLimit=record.mode==="SYNTHETIC"?INVENTORY_LIMITS.tinyEntries:INVENTORY_LIMITS.entries;
    if(!exact(snapshot,["version","purpose","ownership","retainedBodyCopies","profile","epoch","entries","files","digest"])||snapshot.version!==1||snapshot.purpose!=="TIP081_INVENTORY_ONLY_METADATA_SNAPSHOT"||snapshot.ownership!=="PRIVATE_ACQUISITION_SINGLE_OWNER"||snapshot.retainedBodyCopies!==1||!Array.isArray(snapshot.files)||snapshot.files.some(row=>!exact(row,["path","size","digest","kind"])||!integer(row.size)))fail("TIP081_INVENTORY_VERIFIER_SNAPSHOT_REFUSED");
    const {digest:snapshotDigest,...snapshotFields}=snapshot;
    if(manifestDigest(snapshotFields)!==snapshotDigest||snapshotDigest!==record.snapshotDigest||!isDeepStrictEqual(snapshot.profile,record.profile)||!isDeepStrictEqual(snapshot.epoch,record.epoch)||!isDeepStrictEqual(snapshot.entries,record.entries))fail("TIP081_INVENTORY_VERIFIER_SNAPSHOT_REFUSED");
    const snapshotBody=snapshot.files.reduce((sum,row)=>sum+row.size,0),retainedMetadata=2*Buffer.byteLength(canonicalManifest(record))+2*Buffer.byteLength(canonicalManifest(snapshot));
    if(!integer(snapshotBody)||snapshot.files.length+record.directories.length>entryLimit||snapshotBody+retainedMetadata+chunkTransientBytes+INVENTORY_LIMITS.streamBuffer>limit)fail("TIP081_INVENTORY_VERIFIER_PEAK_REFUSED",{bodyBytes:snapshotBody,reservedBytes:snapshotBody+retainedMetadata+chunkTransientBytes+INVENTORY_LIMITS.streamBuffer,limit});
    access=createInventoryAccess({mode:record.mode,...record.roots});
    const catalogue=new Map(),directories=[],entries=new Set(),rawInventories=[],obligations=[],obligationIds=new Set(),metadata=new Map(),admittedInputs=new Map();let visited=0,metadataRetained=0,metadataGrowth=0;
    const chargeMetadata=(bytes)=>{if(!integer(bytes)||snapshotBody+retainedMetadata+chunkTransientBytes+3*metadataRetained+metadataGrowth+bytes+Math.max(INVENTORY_LIMITS.streamBuffer,counts().maxBufferBytes)>limit)fail("TIP081_INVENTORY_VERIFIER_PEAK_REFUSED");metadataGrowth+=bytes;};
    chargeMetadata(4*Buffer.byteLength(canonicalManifest(VERIFIER_PROJECT_INPUTS)));
    const bound=extra=>{if(performance.now()-started>INVENTORY_LIMITS.milliseconds)fail("TIP081_INVENTORY_VERIFIER_TIME_REFUSED");if(catalogue.size+directories.length+extra>entryLimit)fail("TIP081_INVENTORY_VERIFIER_ENTRY_REFUSED");};
    // A controlled consumer retains at most the current copy, with two chunks reserved
    // conservatively. No full-body Map or returned chunk history is retained here.
    const storedHash=(file,size)=>{
      const hash=createHash("sha256");
      for(let offset=0;offset<size;offset+=chunkBytes){bound(0);const length=Math.min(chunkBytes,size-offset),chunk=readInventorySnapshotChunk(acquired,file,offset,length);if(chunk.length!==length)fail("TIP081_INVENTORY_VERIFIER_SNAPSHOT_REFUSED",{path:file});hash.update(chunk);}
      if(size===0&&readInventorySnapshotChunk(acquired,file,0,0).length!==0)fail("TIP081_INVENTORY_VERIFIER_SNAPSHOT_REFUSED",{path:file});
      return hash.digest("hex");
    };
    const compareStored=(file,bytes)=>{
      for(let offset=0;offset<bytes.length;offset+=chunkBytes){bound(0);const length=Math.min(chunkBytes,bytes.length-offset),chunk=readInventorySnapshotChunk(acquired,file,offset,length);if(chunk.length!==length||!chunk.equals(bytes.subarray(offset,offset+length)))fail("TIP081_INVENTORY_VERIFIER_SOURCE_CHANGED",{path:file});}
      if(bytes.length===0&&readInventorySnapshotChunk(acquired,file,0,0).length!==0)fail("TIP081_INVENTORY_VERIFIER_SOURCE_CHANGED",{path:file});
    };
    const open=(code,file,detail)=>{inventoryPath(file||"universe");if(typeof detail!=="string"||detail.length>2048)fail("TIP081_INVENTORY_VERIFIER_SCHEMA_REFUSED");const id=`${code}:${file}:${detail}`;if(obligationIds.has(id))return;chargeMetadata(256+4*Buffer.byteLength(code+file+detail));obligationIds.add(id);obligations.push({id,code,path:file,detail});};
    const include=(source,sourcePath,provenance,entry=false)=>{
      inventoryPath(sourcePath);const virtual=source==="dependency"?`node_modules/${sourcePath}`:sourcePath;inventoryPath(virtual);
      const policy=source==="project"?projectInput(sourcePath):undefined;
      if(source==="project"&&!policy&&sourcePath!=="package.json"&&!sourcePath.startsWith(".next-tip080/")&&!sourcePath.startsWith("public/"))fail("TIP081_INVENTORY_VERIFIER_PROJECT_PATH_REFUSED",{path:sourcePath});
      if(policy&&entry)fail("TIP081_INVENTORY_VERIFIER_PROJECT_EXECUTION_REFUSED",{path:sourcePath});
      let row=catalogue.get(virtual);
      if(!row){bound(1);chargeMetadata(1024+4*Buffer.byteLength(virtual+sourcePath+source));const stat=statInventoryPath(access,source,sourcePath);if(stat.type!=="file")fail("TIP081_INVENTORY_VERIFIER_NONFILE_REFUSED",{path:virtual});if(policy&&stat.size!==policy.size)fail("TIP081_INVENTORY_VERIFIER_PROJECT_PIN_REFUSED",{path:sourcePath});row={path:virtual,source,sourcePath,stat,provenance:new Set()};catalogue.set(virtual,row);}
      if(policy){if(!admittedInputs.has(sourcePath)){chargeMetadata(256+4*Buffer.byteLength(canonicalManifest(policy)));admittedInputs.set(sourcePath,policy);}if(!row.provenance.has("EXACT_PROJECT_INPUT")){chargeMetadata(128+4*Buffer.byteLength("EXACT_PROJECT_INPUT"));row.provenance.add("EXACT_PROJECT_INPUT");}}
      if(!row.provenance.has(provenance)){chargeMetadata(128+4*Buffer.byteLength(provenance));row.provenance.add(provenance);}if(entry&&!entries.has(virtual)){chargeMetadata(128+4*Buffer.byteLength(virtual));entries.add(virtual);}
    };
    stage="VERIFIER_TREE_ENUMERATION";
    for(const origin of INVENTORY_TREES){
      const pending=[origin];while(pending.length){bound(0);if(++visited>entryLimit)fail("TIP081_INVENTORY_VERIFIER_ENTRY_REFUSED");const file=pending.pop(),stat=statInventoryPath(access,"project",file);
        if(stat.type==="directory"){bound(1);chargeMetadata(1024+4*Buffer.byteLength(file));const members=listInventoryDirectory(access,"project",file);for(const name of members)chargeMetadata(128+4*Buffer.byteLength(name));directories.push({source:"project",path:file,...stat,members});for(let i=members.length-1;i>=0;i--){chargeMetadata(64+4*Buffer.byteLength(file+members[i]));pending.push(`${file}/${members[i]}`);}}
        else include("project",file,`TREE:${origin}`,origin===".next-tip080/server"&&/\.(?:js|cjs|mjs)$/.test(file));
      }
    }
    for(const file of INVENTORY_METADATA)include("project",file,"FIXED_METADATA");
    stage="VERIFIER_DECLARATION_METADATA";
    const json=file=>{
      if(!metadata.has(file)){const row=catalogue.get(file);if(!row)fail("TIP081_INVENTORY_VERIFIER_DECLARATION_REFUSED");
        if(metadataRetained+row.stat.size>INVENTORY_LIMITS.metadataBytes||snapshotBody+retainedMetadata+chunkTransientBytes+3*(metadataRetained+row.stat.size)+metadataGrowth+INVENTORY_LIMITS.streamBuffer>limit)fail("TIP081_INVENTORY_VERIFIER_PEAK_REFUSED",{path:file});
        declarationReadAttempts++;const bytes=readInventoryFile(access,"project",file);declarationReadBytes+=bytes.length;compareStored(file,bytes);metadataRetained+=bytes.length;metadata.set(file,bytes);
      }return inventoryJson(metadata.get(file));
    };
    for(const file of ["package.json",".next-tip080/package.json"]){const value=json(file);if(!object(value)||value.type!==undefined&&!["commonjs","module"].includes(value.type)||file===".next-tip080/package.json"&&value.type!=="commonjs")fail("TIP081_INVENTORY_VERIFIER_PACKAGE_REFUSED");}
    const requiredPath=".next-tip080/required-server-files.json",required=json(requiredPath);
    if(!object(required)||required.version!==1||required.appDir!==record.roots.projectRoot||!Array.isArray(required.files)||!object(required.config)||required.config.distDir!==".next-tip080")fail("TIP081_INVENTORY_VERIFIER_REQUIRED_REFUSED");
    for(const key of Object.keys(required))if(!["version","config","appDir","relativeAppDir","files","ignore"].includes(key))open("UNKNOWN_DECLARATION_OPEN",requiredPath,key);
    for(const file of required.files){if(typeof file!=="string"||!file.startsWith(".next-tip080/"))fail("TIP081_INVENTORY_VERIFIER_REQUIRED_REFUSED");include("project",file,"REQUIRED_FILE",/\.(?:js|cjs|mjs)$/.test(file));}
    for(const [file,label]of [[".next-tip080/server/pages-manifest.json","PAGE_ROUTE"],[".next-tip080/server/app-paths-manifest.json","APP_ROUTE"]]){
      const routes=json(file);if(!object(routes))fail("TIP081_INVENTORY_VERIFIER_ROUTES_REFUSED");
      for(const route of Object.keys(routes)){
        const target=routes[route];if(typeof target!=="string"||route.length>2048)fail("TIP081_INVENTORY_VERIFIER_ROUTES_REFUSED");
        inventoryPath(target);const javascript=target.endsWith(".js"),staticPage=label==="PAGE_ROUTE"&&target.startsWith("pages/")&&target.endsWith(".html");
        if(!javascript&&!staticPage)fail("TIP081_INVENTORY_VERIFIER_ROUTES_REFUSED");
        include("project",`.next-tip080/server/${target}`,`${label}:${route}`,javascript);
      }
    }
    const middlewarePath=".next-tip080/server/middleware-manifest.json",middleware=json(middlewarePath);
    if(!object(middleware)||middleware.version!==3||!object(middleware.middleware)||!object(middleware.functions)||!Array.isArray(middleware.sortedMiddleware))fail("TIP081_INVENTORY_VERIFIER_MIDDLEWARE_REFUSED");
    const middlewareEntry=(name,value)=>{
      if(!object(value)||!Array.isArray(value.files))fail("TIP081_INVENTORY_VERIFIER_MIDDLEWARE_REFUSED");
      for(const file of value.files)include("project",`.next-tip080/${inventoryPath(file)}`,`MIDDLEWARE_FILE:${name}`,/\.(?:js|cjs|mjs)$/.test(file));
      for(const [field,label]of [["wasm","MIDDLEWARE_WASM"],["assets","MIDDLEWARE_ASSET"]])if(value[field]!==undefined){if(!Array.isArray(value[field]))fail("TIP081_INVENTORY_VERIFIER_MIDDLEWARE_REFUSED");for(const item of value[field]){if(!object(item)||typeof item.filePath!=="string")fail("TIP081_INVENTORY_VERIFIER_MIDDLEWARE_REFUSED");include("project",`.next-tip080/${inventoryPath(item.filePath)}`,`${label}:${name}`);}}
      for(const field of Object.keys(value))if(!["files","wasm","assets","name","page","matchers","env","regions"].includes(field))open("UNKNOWN_DECLARATION_OPEN",middlewarePath,field);
    };
    for(const name of Object.keys(middleware.middleware))middlewareEntry(name,middleware.middleware[name]);
    for(const name of Object.keys(middleware.functions))middlewareEntry(name,middleware.functions[name]);
    if(middleware.instrumentation!==undefined){const value=middleware.instrumentation;if(!object(value)||!Array.isArray(value.files))fail("TIP081_INVENTORY_VERIFIER_MIDDLEWARE_REFUSED");for(const file of value.files)include("project",`.next-tip080/${inventoryPath(file)}`,"INSTRUMENTATION_FILE",true);}
    for(const field of Object.keys(middleware))if(!["version","middleware","functions","sortedMiddleware","instrumentation"].includes(field))open("UNKNOWN_DECLARATION_OPEN",middlewarePath,field);
    for(const file of [".next-tip080/server/functions-config-manifest.json",".next-tip080/routes-manifest.json",".next-tip080/app-path-routes-manifest.json"]){if(!object(json(file)))fail("TIP081_INVENTORY_VERIFIER_ROUTES_REFUSED");open("UNKNOWN_DECLARATION_OPEN",file,"SEMANTIC_ROUTE_METADATA_UNCERTIFIED");}
    stage="VERIFIER_RAW_REFERENCES";
    const traces=[...catalogue.keys()].filter(file=>file.endsWith(".nft.json")).sort(order);
    if(traces.length!==(record.mode==="SYNTHETIC"?2:57))fail("TIP081_INVENTORY_VERIFIER_RAW_COUNT_REFUSED",{count:traces.length});
    for(const file of traces){
      const raw=json(file);if(!object(raw)||raw.version!==1||!Array.isArray(raw.files)||raw.files.length>8192||Object.keys(raw).some(key=>!["version","files"].includes(key))||new Set(raw.files).size!==raw.files.length)fail("TIP081_INVENTORY_VERIFIER_RAW_REFUSED");
      const originals=[];
      for(const ref of raw.files){
        if(typeof ref!=="string"||!ref||ref.length>2048||path.posix.isAbsolute(ref)||/[\\:\u0000-\u001f\u007f]/.test(ref)||/(?:\.env|\.git|artifacts|p139|attempt[-_ ]?5|grant)/i.test(ref))fail("TIP081_INVENTORY_VERIFIER_RAW_PATH_REFUSED");
        const normalized=path.posix.normalize(path.posix.join(path.posix.dirname(file),ref));inventoryPath(normalized);chargeMetadata(128+4*Buffer.byteLength(ref));originals.push(ref);
        if(normalized==="node_modules")open("RAW_DIRECTORY_REFERENCE_OPEN",file,"node_modules");
        else if(normalized.startsWith("node_modules/"))include("dependency",normalized.slice(13),`RAW_REFERENCE:${file}`);
        else include("project",normalized,`RAW_REFERENCE:${file}`);
      }chargeMetadata(512+4*Buffer.byteLength(file));rawInventories.push({path:file,digest:digest(metadata.get(file)),version:1,files:originals.sort(order)});
    }
    for(const file of INVENTORY_SEEDS)include("dependency",file,"SEED",/\.(?:js|cjs|mjs)$/.test(file));
    if(record.mode==="FAILED_BUILD4_FEASIBILITY")for(const policy of VERIFIER_PROJECT_INPUTS)include("project",policy.path,"EXACT_PROJECT_INPUT");
    const projectInputPolicy={purpose:"TIP081_EXACT20_DATA_ONLY_ADMISSION",digest:policyDigest,records:[...admittedInputs.values()].sort((a,b)=>order(a.path,b.path))};
    chargeMetadata(4*Buffer.byteLength(canonicalManifest(projectInputPolicy)));
    if(!isDeepStrictEqual(projectInputPolicy,record.projectInputPolicy)||projectInputPolicy.records.some(row=>entries.has(row.path)))fail("TIP081_INVENTORY_VERIFIER_PROJECT_POLICY_REFUSED");
    open("UNIVERSE_OPEN","","EXACT_SEED_RAW_UNION_NO_TRANSITIVE_EXPANSION");open("INSTRUMENTATION_COVERAGE_OPEN",requiredPath,"FIXED_FAILED_EPOCH_DECLARATIONS_ONLY");open("OPEN_GRAPH_ACCOUNTING_INTEGRATION","","COMBINED_PRE_GROWTH_GRAPH_LEDGER_UNESTABLISHED");
    const sortedCatalogue=[...catalogue.values()].sort((a,b)=>order(a.path,b.path));
    const expectedMetadata=sortedCatalogue.map(row=>({path:row.path,source:row.source,sourcePath:row.sourcePath,size:row.stat.size,device:row.stat.device,inode:row.stat.inode,mode:row.stat.mode,nlink:row.stat.nlink,uid:row.stat.uid,mtimeMs:row.stat.mtimeMs,ctimeMs:row.stat.ctimeMs,provenance:[...row.provenance].sort(order)}));
    const claimedMetadata=record.files.map(row=>{const {digest:sourceDigest,...fields}=row;void sourceDigest;return fields;});
    if(!isDeepStrictEqual(expectedMetadata,claimedMetadata)||!isDeepStrictEqual([...entries].sort(order),record.entries))fail("TIP081_INVENTORY_VERIFIER_UNIVERSE_MISMATCH");
    stage="VERIFIER_STREAM_REVALIDATION";const files=[];
    for(const row of sortedCatalogue){
      bound(0);const current=hashInventoryFile(access,row.source,row.sourcePath),privateDigest=storedHash(row.path,row.stat.size);
      if(row.source==="project"&&projectInput(row.sourcePath)){const policy=projectInput(row.sourcePath);if(current.size!==policy.size||current.digest!==policy.digest||privateDigest!==policy.digest)fail("TIP081_INVENTORY_VERIFIER_PROJECT_PIN_REFUSED",{path:row.sourcePath});}
      if(current.size!==row.stat.size||current.digest!==privateDigest||current.stat.device!==row.stat.device||current.stat.inode!==row.stat.inode||current.stat.mode!==row.stat.mode||current.stat.nlink!==row.stat.nlink||current.stat.size!==row.stat.size||current.stat.mtimeMs!==row.stat.mtimeMs||current.stat.ctimeMs!==row.stat.ctimeMs)fail("TIP081_INVENTORY_VERIFIER_SOURCE_CHANGED",{path:row.path});
      files.push({path:row.path,source:row.source,sourcePath:row.sourcePath,size:current.size,digest:current.digest,device:current.stat.device,inode:current.stat.inode,mode:current.stat.mode,nlink:current.stat.nlink,uid:current.stat.uid,mtimeMs:current.stat.mtimeMs,ctimeMs:current.stat.ctimeMs,provenance:[...row.provenance].sort(order)});
    }
    directories.sort((a,b)=>order(a.path,b.path));
    for(const row of directories){const current=statInventoryPath(access,row.source,row.path),members=listInventoryDirectory(access,row.source,row.path);if(["device","inode","mode","nlink","size","uid","mtimeMs","ctimeMs","type"].some(key=>current[key]!==row[key])||!isDeepStrictEqual(members,row.members))fail("TIP081_INVENTORY_VERIFIER_DIRECTORY_CHANGED",{path:row.path});}
    const exactEntries=[...entries].sort(order),exactObligations=obligations.sort((a,b)=>order(a.id,b.id));
    if(!exactEntries.length||!isDeepStrictEqual(files,record.files)||!isDeepStrictEqual(directories,record.directories)||!isDeepStrictEqual(exactEntries,record.entries)||!isDeepStrictEqual(rawInventories,record.rawInventories)||!isDeepStrictEqual(exactObligations,record.obligations))fail("TIP081_INVENTORY_VERIFIER_UNIVERSE_MISMATCH");
    const epoch={kind:record.mode,id:record.mode==="SYNTHETIC"?path.basename(path.dirname(record.roots.projectRoot)):"QGsthQ",digest:manifestDigest({files:files.map(({path,size,digest})=>({path,size,digest})),entries:exactEntries,rawInventories})};
    if(!isDeepStrictEqual(epoch,record.epoch)||!isDeepStrictEqual(record.profile,{runtime:"node",mode:"production",nodeVersion:process.version,platform:process.platform,arch:process.arch,distDir:".next-tip080"}))fail("TIP081_INVENTORY_VERIFIER_EPOCH_REFUSED");
    chargeMetadata(4*Buffer.byteLength(canonicalManifest(snapshot)));
    const ownSnapshotBody={version:1,purpose:"TIP081_INVENTORY_ONLY_METADATA_SNAPSHOT",ownership:"PRIVATE_ACQUISITION_SINGLE_OWNER",retainedBodyCopies:1,profile:record.profile,epoch,entries:exactEntries,files:files.map(({path,size,digest})=>({path,size,digest,kind:independentKind(path)}))};
    if(!isDeepStrictEqual({...ownSnapshotBody,digest:manifestDigest(ownSnapshotBody)},snapshot))fail("TIP081_INVENTORY_VERIFIER_SNAPSHOT_REFUSED");
    const bodyBytes=files.reduce((sum,row)=>sum+row.size,0);
    const provisional={files:files.map(row=>{const {digest:sourceDigest,...metadataRow}=row;void sourceDigest;return metadataRow;}),directories,entries:exactEntries,rawInventories,obligations:exactObligations,projectInputPolicy};
    const maxStreamBuffer=Math.max(0,...files.map(row=>Math.min(row.size,INVENTORY_LIMITS.streamBuffer))),expectedMetadataBytes=4*Buffer.byteLength(canonicalManifest(provisional))+files.length*320+16384+3*metadataRetained+4*Buffer.byteLength(canonicalManifest(VERIFIER_PROJECT_INPUTS));
    const expectedReservedBytes=bodyBytes+maxStreamBuffer+chunkTransientBytes+expectedMetadataBytes;
    if(bodyBytes!==snapshotBody||!exact(record.accounting,["bodyBytes","maxBufferBytes","observedMaxBufferBytes","retainedBodyCopies","chunkTransientBytes","metadataBytes","reservedBytes","readAttempts","readBytes","metadataAttempts"])||Object.values(record.accounting).some(value=>!integer(value))||record.accounting.retainedBodyCopies!==1||record.accounting.chunkTransientBytes!==chunkTransientBytes||record.accounting.bodyBytes!==bodyBytes||record.accounting.maxBufferBytes!==maxStreamBuffer||record.accounting.observedMaxBufferBytes!==Math.max(0,...files.map(row=>row.size))||record.accounting.metadataBytes!==expectedMetadataBytes||record.accounting.reservedBytes!==expectedReservedBytes||expectedReservedBytes>limit||record.accounting.readBytes<bodyBytes)fail("TIP081_INVENTORY_VERIFIER_ACCOUNTING_REFUSED");
    if(record.mode==="FAILED_BUILD4_FEASIBILITY"){
      const next=files.find(row=>row.path==="node_modules/next/package.json");if(!next||next.size>INVENTORY_LIMITS.metadataBytes)fail("TIP081_INVENTORY_VERIFIER_NEXT_VERSION_REFUSED");
      chargeMetadata(3*next.size);const bytes=readInventoryFile(access,"dependency","next/package.json");compareStored(next.path,bytes);
      if(inventoryJson(bytes).version!=="16.2.11")fail("TIP081_INVENTORY_VERIFIER_NEXT_VERSION_REFUSED");
    }
    const account=counts();
    chargeMetadata(16384+4*Buffer.byteLength(canonicalManifest({epoch,projectInputPolicy,openObligations:exactObligations})));
    const receiptBody={version:1,purpose:"TIP081_INDEPENDENT_INVENTORY_VERIFICATION",status:"VERIFIED_DECLARED_UNIVERSE_OPEN",mode:record.mode,epoch,profile:{runtime:"node",mode:"production",nodeVersion:process.version,platform:process.platform,arch:process.arch,distDir:".next-tip080"},inventoryDigest:record.digest,snapshotDigest:record.snapshotDigest,verifiedFiles:files.length,verifiedDirectories:directories.length,verifiedEntries:exactEntries.length,rawInventories:rawInventories.length,openObligations:exactObligations,projectInputPolicy,graphStatus:"ACQUIRED_GRAPH_UNRUN",graphAccounting:"OPEN_GRAPH_ACCOUNTING_INTEGRATION",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false,producerCounterStatus:"OBSERVATIONAL_NOT_INDEPENDENTLY_CERTIFIED",accounting:{bodyBytes,retainedBodyCopies:1,chunkTransientBytes,retainedMetadataBytes:retainedMetadata+3*metadataRetained,...account},sharedAssumptions:["Strict JSON/schema/path grammar", "No-follow descriptor reader and fixed root admission", "Authenticated private single-owner bytes and copied bounded chunk reader"],independentChecks:["Own filesystem enumeration", "Own declaration/reference/entry/provenance reconstruction", "Independent streaming identity/hash and directory membership revalidation", "Every privately stored payload independently hashed in copied chunks", "Own inventory-only snapshot kind/schema/profile/epoch/digest reconstruction", "Own exact20 path/size/hash/data-role policy; all entries and execution false", "Exact independently reconstructed byte/metadata/stream reservation claims"],limitations:["Fixed seed/raw union only; unacquired dependencies are not filesystem absence", "Frozen graph helpers have no integrated caller pre-growth accounting ledger", "Controlled streaming consumer envelope only; arbitrary caller chunk retention and RSS are not certified", "Inventory-only metadata snapshot conveys no historical graph authority or graph compatibility", "Check/recheck paths do not establish openat-style same-UID race resistance"]};
    const receipt={...receiptBody,digest:manifestDigest(receiptBody)},receiptBytes=Buffer.byteLength(canonicalManifest(receipt));
    if(bodyBytes+chunkTransientBytes+retainedMetadata+3*metadataRetained+metadataGrowth+account.maxBufferBytes+receiptBytes>limit)fail("TIP081_INVENTORY_VERIFIER_PEAK_REFUSED");
    metadata.clear();freeze(receipt);bound(0);return receipt;
  }catch(error){
    if(error&&typeof error==="object"&&typeof error.code==="string"&&error.code.startsWith("TIP081_")){error.details={...counts(),...error.details,stage};throw error;}
    refuse("TIP081_INVENTORY_VERIFIER_REFUSED",stage,counts());
  }
}

export function safeInventoryVerificationError(error){
  const ownValue=(value,key)=>value&&typeof value==="object"&&!types.isProxy(value)?Object.getOwnPropertyDescriptor(value,key)?.value:undefined;
  const details=ownValue(error,"details"),code=ownValue(error,"code"),result={status:"INDEPENDENT_INVENTORY_REFUSED",graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false,code:typeof code==="string"&&/^TIP081_[A-Z0-9_]{1,96}$/.test(code)?code:"TIP081_INVENTORY_VERIFIER_REFUSED"};
  const safe={};if(object(details)){const stage=ownValue(details,"stage");if(typeof stage==="string"&&/^VERIFIER_[A-Z_]{1,80}$/.test(stage))safe.stage=stage;const file=ownValue(details,"path");if(typeof file==="string")try{inventoryPath(file);safe.path=file;}catch{/* Unsafe diagnostics are omitted. */}for(const key of ["readAttempts","readBytes","declarationReadAttempts","declarationReadBytes","metadataAttempts","maxBufferBytes","bodyBytes","reservedBytes","limit","count"]){const value=ownValue(details,key);if(integer(value))safe[key]=value;}}return freeze({...result,details:safe});
}
