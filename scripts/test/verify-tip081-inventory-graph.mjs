// Independent source-assembly preflight. No parser or target-code evaluation.
import {createHash} from 'node:crypto';
import {types,isDeepStrictEqual} from 'node:util';
import {canonicalManifest,manifestDigest} from './runtime-tip081-manifest.mjs';
import {readAcquiredInventory,readInventorySnapshotChunk,inventoryPath} from './acquire-tip081-inventory.mjs';

const CAP=67108864,ENTRY_CAP=20000,TIME_CAP=120000,CHUNK=65536;
const limits=mode=>mode==='SYNTHETIC'?{bytes:1048576,entries:128}:{bytes:CAP,entries:ENTRY_CAP};
const integer=n=>Number.isSafeInteger(n)&&n>=0&&!Object.is(n,-0);
const byteSize=value=>Buffer.byteLength(canonicalManifest(value));
// Count immutable metadata JSON without retaining a whole encoded document.
function metadataSize(value){
 if(value===null)return 4;if(typeof value==='boolean')return value?4:5;
 if(typeof value==='number')return Buffer.byteLength(JSON.stringify(value));
 if(typeof value==='string')return Buffer.byteLength(JSON.stringify(value));
 if(Array.isArray(value))return 2+Math.max(0,value.length-1)+value.reduce((n,item)=>n+metadataSize(item),0);
 const keys=Object.keys(value);return 2+Math.max(0,keys.length-1)+keys.reduce((n,key)=>n+Buffer.byteLength(JSON.stringify(key))+1+metadataSize(value[key]),0);
}
function freeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
function fail(code,detail={}){const error=new Error(code);error.code=code;error.details={graphStatus:'ACQUIRED_GRAPH_UNRUN',fullRuntimeClosure:'NOT_ACCEPTED',execution:false,materialization:false,...detail};throw error;}
function exact(value,keys){if(!value||types.isProxy(value)||Object.getPrototypeOf(value)!==Object.prototype)return false;const descriptors=Object.getOwnPropertyDescriptors(value);return Reflect.ownKeys(descriptors).length===keys.length&&keys.every(key=>Object.hasOwn(descriptors,key)&&Object.hasOwn(descriptors[key],'value'));}
function clock(started){const now=performance.now();if(!Number.isFinite(now)||now-started>TIME_CAP)fail('TIP081_GRAPH_VERIFIER_TIME_REFUSED');}
function authority(acquired){if(types.isProxy(acquired))fail('TIP081_GRAPH_VERIFIER_AUTHORITY_REFUSED');try{return readAcquiredInventory(acquired);}catch{fail('TIP081_GRAPH_VERIFIER_AUTHORITY_REFUSED');}}
function kind(file){if(/\.(?:js|cjs|mjs)$/.test(file))return 'javascript';if(file.endsWith('.json'))return 'json';if(/\.(?:node|dylib|dll|so(?:\.[0-9]+)*)$/.test(file))return 'native';if(/\.(?:ts|tsx|jsx|py|sh|exe)$/.test(file))return 'unsupported';return 'asset';}

function measure(acquired,row,started){
 const hash=createHash('sha256');let remaining=0,scalar=0,minimum=0,utf16Units=0,scannedBytes=0;
 for(let offset=0;offset<row.size;offset+=CHUNK){
  clock(started);const length=Math.min(CHUNK,row.size-offset),chunk=readInventorySnapshotChunk(acquired,row.path,offset,length);if(chunk.length!==length)fail('TIP081_GRAPH_VERIFIER_CHUNK_REFUSED',{path:row.path});hash.update(chunk);
  for(let i=0;i<chunk.length;i++){
   const b=chunk[i];
   if(remaining){if(b<128||b>191)fail('TIP081_GRAPH_VERIFIER_UTF8_REFUSED',{path:row.path,offset:offset+i});scalar=scalar*64+b-128;if(--remaining===0){if(scalar<minimum||scalar>1114111||scalar>=55296&&scalar<=57343)fail('TIP081_GRAPH_VERIFIER_UTF8_REFUSED',{path:row.path,offset:offset+i});utf16Units+=scalar>65535?2:1;}}
   else if(b<128)utf16Units++;
   else if(b>=194&&b<=223){remaining=1;scalar=b-192;minimum=128;}
   else if(b>=224&&b<=239){remaining=2;scalar=b-224;minimum=2048;}
   else if(b>=240&&b<=244){remaining=3;scalar=b-240;minimum=65536;}
   else fail('TIP081_GRAPH_VERIFIER_UTF8_REFUSED',{path:row.path,offset:offset+i});
  }
  scannedBytes+=length;
 }
 if(remaining)fail('TIP081_GRAPH_VERIFIER_UTF8_REFUSED',{path:row.path,offset:row.size});
 if(row.size===0)readInventorySnapshotChunk(acquired,row.path,0,0);
 const digest=hash.digest('hex');if(digest!==row.digest||scannedBytes!==row.size||!integer(utf16Units))fail('TIP081_GRAPH_VERIFIER_SOURCE_HASH_REFUSED',{path:row.path});clock(started);
 return {path:row.path,size:row.size,digest,utf16Units,decodedBytes:2*utf16Units};
}

/** Authenticated, data-only DFA counter for focused source-domain controls. */
export function measureInventoryUtf8(acquired,file){
 if(arguments.length!==2)fail('TIP081_GRAPH_VERIFIER_AUTHORITY_REFUSED');const started=performance.now(),held=authority(acquired);inventoryPath(file);
 const row=held.snapshot.files.find(candidate=>candidate.path===file);if(!row||kind(row.path)!=='javascript'||row.kind!=='javascript')fail('TIP081_GRAPH_VERIFIER_SOURCE_REFUSED');
 const bodyBytes=held.snapshot.files.reduce((n,r)=>n+r.size,0);if(!integer(bodyBytes)||bodyBytes+2*metadataSize(held.record)+2*metadataSize(held.snapshot)+4*CHUNK>limits(held.record.mode).bytes)fail('TIP081_GRAPH_VERIFIER_PEAK_REFUSED');return freeze(measure(acquired,row,started));
}

function dataBound(value,limit,started){
 let charge=0,nodes=0,keyReferences=0;const active=new Set();
 const visit=(value,depth)=>{
  clock(started);if(depth>128||++nodes>ENTRY_CAP*32)fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
  if(value===null||typeof value==='boolean'){charge+=8;}
  else if(typeof value==='string'){charge+=Buffer.byteLength(value)+8;}
  else if(typeof value==='number'){if(!Number.isFinite(value))fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');charge+=32;}
  else if(value&&typeof value==='object'&&!types.isProxy(value)){
   const array=Array.isArray(value);if(Object.getPrototypeOf(value)!==(array?Array.prototype:Object.prototype)||active.has(value))fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
   const length=array?Object.getOwnPropertyDescriptor(value,'length')?.value:null;
   if(array&&(!integer(length)||length>ENTRY_CAP))fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
   // ADMITTED-candidate convention: all visited key lists together contain at
   // most 20000 key references (including array length), charged at 8 logical
   // bytes each within T. Reflect.ownKeys cannot pre-count hostile inputs:
   // its initial enumeration is not arbitrary-input preallocation/RSS safety.
   const keys=Reflect.ownKeys(value);keyReferences+=keys.length;
   if(keyReferences>ENTRY_CAP||keys.some(key=>typeof key!=='string'))fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
   if(array&&(keys.length!==length+1||keys.some(key=>key!=='length'&&!/^(?:0|[1-9][0-9]*)$/.test(key))))fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
   active.add(value);charge+=32;for(const key of keys){if(array&&key==='length')continue;const descriptor=Object.getOwnPropertyDescriptor(value,key);if(!descriptor||!Object.hasOwn(descriptor,'value'))fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');charge+=Buffer.byteLength(key)+8;if(charge>limit)fail('TIP081_GRAPH_VERIFIER_PLAN_CAP_REFUSED');visit(descriptor.value,depth+1);}active.delete(value);
  }else fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
  if(charge>limit)fail('TIP081_GRAPH_VERIFIER_PLAN_CAP_REFUSED');
 };visit(value,0);
}

function preliminary(held){
 const {record,snapshot}=held;
 const cap=limits(record.mode);
 if(snapshot.purpose!=='TIP081_INVENTORY_ONLY_METADATA_SNAPSHOT'||snapshot.ownership!=='PRIVATE_ACQUISITION_SINGLE_OWNER'||snapshot.retainedBodyCopies!==1||record.snapshotDigest!==snapshot.digest||record.graphStatus!=='ACQUIRED_GRAPH_UNRUN'||record.fullRuntimeClosure!=='NOT_ACCEPTED')fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
 if(!isDeepStrictEqual(snapshot.profile,record.profile)||!isDeepStrictEqual(snapshot.epoch,record.epoch)||!isDeepStrictEqual(snapshot.entries,record.entries)||record.profile.nodeVersion!==process.version||record.profile.platform!==process.platform||record.profile.arch!==process.arch)fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
 if(snapshot.files.length!==record.files.length||record.files.length+record.directories.length>cap.entries)fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
 const bodyBytes=record.files.reduce((sum,row)=>sum+row.size,0),inputMetadataBytes=metadataSize(record)+metadataSize(snapshot),canonicalScratchBytes=3*inputMetadataBytes;
 const declarations=new Set(['package.json','.next-tip080/package.json','.next-tip080/required-server-files.json','.next-tip080/server/pages-manifest.json','.next-tip080/server/app-paths-manifest.json','.next-tip080/server/middleware-manifest.json','.next-tip080/server/functions-config-manifest.json','.next-tip080/routes-manifest.json','.next-tip080/app-path-routes-manifest.json']);
 const declarationBytes=record.files.reduce((sum,row)=>sum+(declarations.has(row.path)||row.path.endsWith('.nft.json')?row.size:0),0);
 const verificationAllowanceBytes=8*inputMetadataBytes+4096*(record.files.length+record.directories.length)+3*declarationBytes+CHUNK+16384,streamTemporaryBytes=4*CHUNK+1024;
 const preliminaryPlanAllowance=4*(inputMetadataBytes+256*record.files.length+2048)+512*record.files.length+16384;
 const preliminaryBase=bodyBytes+4*inputMetadataBytes+preliminaryPlanAllowance+verificationAllowanceBytes+streamTemporaryBytes;
 if(!integer(bodyBytes)||!integer(preliminaryBase)||preliminaryBase>cap.bytes)fail('TIP081_GRAPH_VERIFIER_BASE_CAP_REFUSED',{stage:'BEFORE_METADATA_PROJECTION',baseBytes:preliminaryBase,limit:cap.bytes});
 return {cap,bodyBytes,inputMetadataBytes,canonicalScratchBytes,verificationAllowanceBytes,streamTemporaryBytes,preliminaryPlanAllowance};
}

function reconstruct(held,started,admitted){
 const {record,snapshot}=held,{cap,bodyBytes,inputMetadataBytes,canonicalScratchBytes,verificationAllowanceBytes,streamTemporaryBytes}=admitted;
 const {digest:snapshotHash,...snapshotBody}=snapshot,{digest:recordHash,...recordBody}=record;
 if(manifestDigest(snapshotBody)!==snapshotHash||manifestDigest(recordBody)!==recordHash)fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
 const entrySet=new Set(record.entries),roles=new Map(record.projectInputPolicy.records.map(row=>[row.path,row.role]));let measuredBody=0,jsCount=0,previous='';
 const files=[];
 for(let i=0;i<record.files.length;i++){
  clock(started);const source=record.files[i],row=snapshot.files[i];inventoryPath(source.path);
  if(source.path<=previous||!integer(source.size)||source.digest!==row.digest||source.size!==row.size||source.path!==row.path||row.kind!==kind(source.path))fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
  previous=source.path;measuredBody+=source.size;if(!integer(measuredBody))fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');if(row.kind==='javascript')jsCount++;
  files.push({path:source.path,size:source.size,digest:source.digest,kind:row.kind,entry:entrySet.has(source.path),role:roles.get(source.path)??null,execution:false});
 }
 if(entrySet.size!==record.entries.length||record.entries.some(file=>!files.some(row=>row.path===file)))fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
 if(measuredBody!==bodyBytes)fail('TIP081_GRAPH_VERIFIER_METADATA_REFUSED');
 const universeBytes=byteSize({profile:record.profile,epoch:record.epoch,entries:record.entries,files,projectInputPolicy:record.projectInputPolicy});
 const planAllowanceBytes=4*universeBytes+512*jsCount+16384;
 // Fixed conservative graph-control/retained-prior-receipt convention.
 // This is NOT an enclosure of an arbitrary-drift filesystem verifier call.
 const baseBytes=bodyBytes+inputMetadataBytes+canonicalScratchBytes+planAllowanceBytes+verificationAllowanceBytes+streamTemporaryBytes;
 if(!integer(baseBytes)||baseBytes>cap.bytes)fail('TIP081_GRAPH_VERIFIER_BASE_CAP_REFUSED',{stage:'BEFORE_SOURCE_MEASUREMENT',baseBytes,limit:cap.bytes});
 return {files,accounting:{bodyBytes,inputMetadataBytes,canonicalScratchBytes,planAllowanceBytes,verificationAllowanceBytes,streamTemporaryBytes,baseBytes,maxDecodedBytes:0,maxSourceOnlyBytes:0,maxConservativeBytes:0,limit:cap.bytes}};
}

/** Independent UTF8/union/reservation proof; prior filesystem verification is Main's stage. */
export function verifyInventoryGraphPreflight(acquired,plan){
 if(arguments.length!==2)fail('TIP081_GRAPH_VERIFIER_AUTHORITY_REFUSED');const started=performance.now(),held=authority(acquired),{record,snapshot}=held;
 const admitted=preliminary(held);
 dataBound(plan,admitted.preliminaryPlanAllowance,started);
 const planKeys=['version','purpose','mode','inventoryDigest','snapshotDigest','profile','epoch','entries','files','projectInputPolicy','sources','accounting','decision','graphStatus','fullRuntimeClosure','execution','materialization','digest'];
 if(!exact(plan,planKeys)||plan.version!==1||plan.purpose!=='TIP081_INVENTORY_GRAPH_PREFLIGHT')fail('TIP081_GRAPH_VERIFIER_PLAN_REFUSED');
 const reconstructed=reconstruct(held,started,admitted),{files,accounting}=reconstructed;
 dataBound(plan,accounting.planAllowanceBytes,started);
 const {digest:claimed,...planBody}=plan;if(manifestDigest(planBody)!==claimed)fail('TIP081_GRAPH_VERIFIER_PLAN_DIGEST_REFUSED');
 const sources=[];let maxPath=null;accounting.maxSourceOnlyBytes=accounting.bodyBytes;accounting.maxConservativeBytes=accounting.baseBytes;
 for(const file of files){if(file.kind!=='javascript')continue;if(files.length+sources.length+1>limits(record.mode).entries)fail('TIP081_GRAPH_VERIFIER_ENTRY_CAP_REFUSED');
  const counted=measure(acquired,file,started),sourceOnlyBytes=accounting.bodyBytes+counted.decodedBytes,conservativeBytes=accounting.baseBytes+counted.decodedBytes;
  if(counted.decodedBytes>accounting.maxDecodedBytes||maxPath===null){accounting.maxDecodedBytes=counted.decodedBytes;maxPath=file.path;}
  accounting.maxSourceOnlyBytes=Math.max(accounting.maxSourceOnlyBytes,sourceOnlyBytes);accounting.maxConservativeBytes=Math.max(accounting.maxConservativeBytes,conservativeBytes);
  sources.push({...counted,sourceOnlyBytes,conservativeBytes});
 }
 const decision={status:'PREFLIGHT_ADMITTED',stage:'BEFORE_SOURCE_ASSEMBLY',reason:null,path:null};
 if(accounting.maxSourceOnlyBytes>accounting.limit){decision.status='PREFLIGHT_REFUSED';decision.reason='SOURCE_ONLY_BOUND';decision.path=maxPath;}
 else if(accounting.maxConservativeBytes>accounting.limit){decision.status='PREFLIGHT_REFUSED';decision.reason='CONSERVATIVE_ADMISSION';decision.path=maxPath;}
 const expected={version:1,purpose:'TIP081_INVENTORY_GRAPH_PREFLIGHT',mode:record.mode,inventoryDigest:record.digest,snapshotDigest:snapshot.digest,profile:record.profile,epoch:record.epoch,entries:record.entries,files,projectInputPolicy:record.projectInputPolicy,sources,accounting,decision,graphStatus:'ACQUIRED_GRAPH_UNRUN',fullRuntimeClosure:'NOT_ACCEPTED',execution:false,materialization:false};
 if(metadataSize(expected)+96>accounting.planAllowanceBytes)fail('TIP081_GRAPH_VERIFIER_PLAN_CAP_REFUSED');
 if(!isDeepStrictEqual({...expected,digest:manifestDigest(expected)},plan))fail('TIP081_GRAPH_VERIFIER_PLAN_MISMATCH');
 // Main runs unchanged verifyInventory BEFORE constructing/retaining a plan.
 // There is no public receipt input that could manufacture fresh FS authority.
 clock(started);
 const receiptAllowance=16384;
 if(accounting.baseBytes+receiptAllowance>accounting.limit)fail('TIP081_GRAPH_VERIFIER_RECEIPT_CAP_REFUSED');
 const receiptBody={version:1,purpose:'TIP081_INDEPENDENT_GRAPH_PREFLIGHT_VERIFICATION',status:'VERIFIED_GRAPH_PREFLIGHT',scope:'SOURCE_ADMISSION_ONLY',preflightStatus:decision.status,decision,inventoryDigest:record.digest,snapshotDigest:snapshot.digest,planDigest:plan.digest,verifiedFiles:files.length,verifiedSources:sources.length,accounting,inventoryFreshness:'PRIOR_MAIN_STAGE_NOT_REEXECUTED_OR_AUTHENTICATED_HERE',graphStatus:'ACQUIRED_GRAPH_UNRUN',fullRuntimeClosure:'NOT_ACCEPTED',execution:false,materialization:false,sharedAssumptions:['Authenticated single-owner metadata and copied chunk reader','Strict canonical grammar and SHA256','Main executes independent inventory filesystem verification before graph planning'],limitations:['Source preflight only; AST/graph ledger and runtime remain open','UTF16 byte convention is logical, not measured RSS','Unacquired dependencies are unknown, never filesystem absence','Fixed V is a conservative control and retained-prior-receipt convention, not arbitrary callee integration','Own-key enumeration is an admitted-candidate logical convention, not hostile initial-enumeration/RSS protection']};
 if(metadataSize(receiptBody)+96>receiptAllowance)fail('TIP081_GRAPH_VERIFIER_RECEIPT_CAP_REFUSED');
 const receipt={...receiptBody,digest:manifestDigest(receiptBody)};
 if(accounting.baseBytes+byteSize(receipt)>accounting.limit)fail('TIP081_GRAPH_VERIFIER_RECEIPT_CAP_REFUSED');clock(started);
 return freeze(receipt);
}

export function safeInventoryGraphVerificationError(error){
 const value=(object,key)=>object&&typeof object==='object'&&!types.isProxy(object)?Object.getOwnPropertyDescriptor(object,key)?.value:undefined;
 const code=value(error,'code'),detail=value(error,'details'),safe={};
 for(const key of ['baseBytes','limit','offset']){const n=value(detail,key);if(integer(n))safe[key]=n;}
 const file=value(detail,'path');if(typeof file==='string')try{inventoryPath(file);safe.path=file;}catch{/* Unsafe paths are omitted. */}
 return freeze({status:'GRAPH_PREFLIGHT_VERIFICATION_REFUSED',code:typeof code==='string'&&/^TIP081_[A-Z0-9_]{1,96}$/.test(code)?code:'TIP081_GRAPH_VERIFIER_REFUSED',details:safe,graphStatus:'ACQUIRED_GRAPH_UNRUN',fullRuntimeClosure:'NOT_ACCEPTED',execution:false,materialization:false});
}
