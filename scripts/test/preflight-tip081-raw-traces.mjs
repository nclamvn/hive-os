// Declaration-only batch diagnosis; never dereference a declared reference.
import path from 'node:path';
import {createHash} from 'node:crypto';
import {opendirSync} from 'node:fs';
import {
 createInventoryAccess,statInventoryPath,readInventoryFile,
 hashInventoryFile,inventoryJson,inventoryPath,inventoryAccounting,INVENTORY_ROOTS
} from './acquire-tip081-inventory.mjs';
import {canonicalManifest,manifestDigest} from './runtime-tip081-manifest.mjs';

const LIMITS=Object.freeze({bytes:67108864,entries:20000,sourceBytes:4194304,milliseconds:120000});
const ROOT_TRACE='.next-tip080/next-server.js.nft.json',SERVER='.next-tip080/server';
const CLASSES=Object.freeze(['PROJECT_ALLOWED','DEPENDENCY_ALLOWED','DIRECTORY_REFERENCE_OPEN','CATEGORY_CONFLICT','PATH_REFUSED_SUPPRESSED','MALFORMED_REF_SUPPRESSED']);
const order=(a,b)=>a<b?-1:a>b?1:0;
const sha=b=>createHash('sha256').update(b).digest('hex');
function frozen(v){if(v&&typeof v==='object'){for(const x of Object.values(v))frozen(x);Object.freeze(v);}return v;}
function dataObject(v){return v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype;}
function classification(ref){
 // Same raw-string and normalized virtual-path grammar as the frozen producer.
 // No original rejected string, OS error message or target bytes are returned.
 if(typeof ref!=='string'||!ref||ref.length>2048)return {kind:'MALFORMED_REF_SUPPRESSED'};
 if(path.posix.isAbsolute(ref)||/[\\:\u0000-\u001f\u007f]/.test(ref)||/(?:\.env|\.git|artifacts|p139|attempt[-_ ]?5|grant)/i.test(ref))return {kind:'PATH_REFUSED_SUPPRESSED'};
 return {kind:null,ref};
}
function normalizedClass(trace,ref){
 const initial=classification(ref);if(initial.kind)return initial;
 const virtual=path.posix.normalize(path.posix.join(path.posix.dirname(trace),initial.ref));
 try{inventoryPath(virtual);}catch{return {kind:'PATH_REFUSED_SUPPRESSED'};}
 if(virtual==='node_modules')return {kind:'DIRECTORY_REFERENCE_OPEN',path:virtual};
 if(virtual.startsWith('node_modules/')){const relative=virtual.slice(13);return relative==='.next-tip080/standalone'||relative.startsWith('.next-tip080/standalone/')?{kind:'CATEGORY_CONFLICT',path:virtual}:{kind:'DEPENDENCY_ALLOWED'};}
 const allowed=virtual==='package.json'||virtual.startsWith('.next-tip080/')||virtual==='public'||virtual.startsWith('public/');
 const failedOutput=virtual==='.next-tip080/standalone'||virtual.startsWith('.next-tip080/standalone/');
 return allowed&&!failedOutput?{kind:'PROJECT_ALLOWED'}:{kind:'CATEGORY_CONFLICT',path:virtual};
}

export function inspectRawDeclarations(){
 if(arguments.length)throw new Error('TIP081_RAW_PREFLIGHT_ARGUMENT_REFUSED');
 const started=performance.now();let access=null,entries=0,sourceBytes=0,metadataBytes=0,referenceCount=0,directoryOpens=0,directoryEntryReads=0;
 const traces=[],directories=[],conflicts=new Map(),totals=Object.fromEntries(CLASSES.map(k=>[k,0]));
 const stats=()=>access?inventoryAccounting(access):{readAttempts:0,readBytes:0,metadataAttempts:0,maxBufferBytes:0};
 function stop(code,extra={}){const e=new Error(code);e.code=code;e.details={stage:'RAW_DECLARATION_PREFLIGHT',traceCount:traces.length,entries,sourceBytes,referenceCount,...stats(),declaredReferenceTargets:'NOT_ACCESSED',runtimeStatus:'RUNTIME_OPEN',...extra};throw e;}
 function check(){const elapsed=performance.now()-started;if(!Number.isFinite(elapsed)||elapsed<0||elapsed>LIMITS.milliseconds)stop('TIP081_RAW_PREFLIGHT_TIME_REFUSED');}
 function reserve(bytes,count=0){check();if(!Number.isSafeInteger(bytes)||bytes<0||entries+count>LIMITS.entries||metadataBytes+bytes+5*sourceBytes>LIMITS.bytes)stop('TIP081_RAW_PREFLIGHT_RESOURCE_REFUSED');entries+=count;metadataBytes+=bytes;}
 function sourceOperation(file,operation){try{return operation();}catch(e){if(typeof e?.code==='string'&&/^TIP081_[A-Z0-9_]+$/.test(e.code))stop(e.code,{trace:file});stop('TIP081_RAW_PREFLIGHT_SOURCE_REFUSED',{trace:file});}}
 function readDirectory(file){
  inventoryPath(file);if(file!==SERVER&&!file.startsWith(SERVER+'/'))stop('TIP081_RAW_PREFLIGHT_DIRECTORY_SCOPE_REFUSED');
  const before=sourceOperation(file,()=>statInventoryPath(access,'project',file));
  if(before.type!=='directory'||before.uid!==process.getuid?.())stop('TIP081_RAW_PREFLIGHT_DIRECTORY_OWNER_REFUSED',{trace:file});
  const members=[];let directory;
  try{
   directory=sourceOperation(file,()=>opendirSync(path.join(INVENTORY_ROOTS.projectRoot,file)));directoryOpens++;
   for(;;){check();const item=sourceOperation(file,()=>directory.readSync());directoryEntryReads++;if(item===null)break;
    inventoryPath(item.name);reserve(4*Buffer.byteLength(item.name)+64,1);members.push(item.name);
   }
  }finally{if(directory)sourceOperation(file,()=>directory.closeSync());}
  const after=sourceOperation(file,()=>statInventoryPath(access,'project',file));
  if(canonicalManifest(before)!==canonicalManifest(after))stop('TIP081_RAW_PREFLIGHT_MEMBERSHIP_CHANGED',{trace:file});
  return members.sort(order);
 }
 const discovery=[];
 function walk(file){
  inventoryPath(file);reserve(4*Buffer.byteLength(file)+256,1);
  const st=sourceOperation(file,()=>statInventoryPath(access,'project',file));
  if(st.type==='directory'){
   const members=readDirectory(file);
   reserve(320,1);
   directories.push({path:file,stat:st,members});for(const name of members)walk(file+'/'+name);
  }else if(file.endsWith('.nft.json')){reserve(4*Buffer.byteLength(file)+320,1);discovery.push({path:file,stat:st});}
 }
 access=createInventoryAccess({mode:'FAILED_BUILD4_FEASIBILITY',...INVENTORY_ROOTS});
 walk(SERVER);reserve(4*Buffer.byteLength(ROOT_TRACE)+320,1);
 const rootStat=sourceOperation(ROOT_TRACE,()=>statInventoryPath(access,'project',ROOT_TRACE));
 if(rootStat.type!=='file')stop('TIP081_RAW_PREFLIGHT_ROOT_TRACE_REFUSED');reserve(320,1);discovery.push({path:ROOT_TRACE,stat:rootStat});
 discovery.sort((a,b)=>order(a.path,b.path));
 if(discovery.length!==57)stop('TIP081_RAW_PREFLIGHT_TRACE_COUNT_REFUSED',{discovered:discovery.length});
 let invalidSchemas=0,unclassifiedTraces=0,declaredReferences=0;
 for(const item of discovery){
  check();if(sourceBytes+item.stat.size>LIMITS.sourceBytes||metadataBytes+5*(sourceBytes+item.stat.size)>LIMITS.bytes)stop('TIP081_RAW_PREFLIGHT_SOURCE_CAP',{trace:item.path});
  // Reserve source + decoding/JSON-copy transient representations before reading.
  sourceBytes+=item.stat.size;
  const bytes=sourceOperation(item.path,()=>readInventoryFile(access,'project',item.path));
  const digest=sha(bytes);let data=null,schema='VALID',refCount=null;
  try{data=inventoryJson(bytes);}catch{schema='INVALID_JSON';}
  const local=Object.fromEntries(CLASSES.map(k=>[k,0]));
  if(!dataObject(data)||!Array.isArray(data.files)){if(schema==='VALID')schema='INVALID_SCHEMA';unclassifiedTraces++;}
  else {
   refCount=data.files.length;declaredReferences+=refCount;
   if(data.version!==1||Object.keys(data).some(k=>!['version','files'].includes(k)))schema='INVALID_SCHEMA';
   if(refCount>8192)stop('TIP081_RAW_PREFLIGHT_REFERENCE_CAP',{trace:item.path});
   const seen=new Set();
   for(const ref of data.files){
    // Count all reference occurrences, including duplicates; never retain raw values.
    reserve(256,1);referenceCount++;
    if(typeof ref==='string'){
     reserve(4*Buffer.byteLength(ref)+32,seen.has(ref)?0:1);
     if(seen.has(ref))schema='INVALID_DUPLICATE_REFERENCE';else seen.add(ref);
    }
    const result=normalizedClass(item.path,ref);if(result.kind==='MALFORMED_REF_SUPPRESSED')schema='INVALID_REFERENCE_SHAPE';local[result.kind]++;totals[result.kind]++;
    if(result.kind==='CATEGORY_CONFLICT'||result.kind==='DIRECTORY_REFERENCE_OPEN'){
     let row=conflicts.get(result.path);
     if(!row){reserve(4*Buffer.byteLength(result.path)+320,1);row={path:result.path,classification:result.kind,origins:new Set()};conflicts.set(result.path,row);}
     if(!row.origins.has(item.path)){reserve(4*Buffer.byteLength(item.path)+32,1);row.origins.add(item.path);}
    }
   }
  }
  if(schema!=='VALID')invalidSchemas++;
  const audit=sourceOperation(item.path,()=>hashInventoryFile(access,'project',item.path));
  const now=sourceOperation(item.path,()=>statInventoryPath(access,'project',item.path));
  if(audit.digest!==digest||canonicalManifest(now)!==canonicalManifest(item.stat))stop('TIP081_RAW_PREFLIGHT_SOURCE_CHANGED',{trace:item.path});
  reserve(1024+4*Buffer.byteLength(item.path),1);
  traces.push({path:item.path,size:bytes.length,digest,schema,refCount,classes:local});
 }
 for(const directory of directories){
  const now=sourceOperation(directory.path,()=>statInventoryPath(access,'project',directory.path));
  const members=readDirectory(directory.path);
  if(canonicalManifest(now)!==canonicalManifest(directory.stat)||canonicalManifest(members)!==canonicalManifest(directory.members))stop('TIP081_RAW_PREFLIGHT_MEMBERSHIP_CHANGED',{trace:directory.path});
 }
 for(const trace of traces){
  const item=discovery.find(row=>row.path===trace.path);
  const audit=sourceOperation(trace.path,()=>hashInventoryFile(access,'project',trace.path));
  const now=sourceOperation(trace.path,()=>statInventoryPath(access,'project',trace.path));
  if(audit.digest!==trace.digest||canonicalManifest(now)!==canonicalManifest(item.stat))stop('TIP081_RAW_PREFLIGHT_SOURCE_CHANGED',{trace:trace.path});
 }
 check();
 let outputEntries=conflicts.size;for(const row of conflicts.values())outputEntries+=row.origins.size;reserve(320*conflicts.size,outputEntries);
 const targets=[...conflicts.values()].map(r=>({path:r.path,classification:r.classification,origins:[...r.origins].sort(order)})).sort((a,b)=>order(a.path,b.path));
 const body={version:1,purpose:'TIP081_BATCH_RAW_DECLARATION_PREFLIGHT',epoch:'FAILED_BUILD4_FEASIBILITY',root:INVENTORY_ROOTS.projectRoot,status:invalidSchemas?'DECLARATION_SCHEMA_OPEN':'DECLARATIONS_CLASSIFIED_RUNTIME_OPEN',scope:'EXACT_57_RAW_DECLARATIONS_ONLY',classificationSemantics:'SYNTAX_ONLY_INVALID_SCHEMA_ROWS_UNADMITTED_NO_FS_PRESENCE_CLAIM',traceCount:traces.length,declaredReferences,classifiedReferences:referenceCount,invalidSchemas,unclassifiedTraces,classes:totals,conflicts:targets,traces,accounting:{entries,sourceBytes,retainedMetadataReservation:metadataBytes,directoryOpens,directoryEntryReads,...stats()},sourceRaceModel:'NOFOLLOW_CHECKS_AND_SAME_UID_STABILITY_NOT_ATOMIC_DIRFD_SECURITY',declaredReferenceTargets:'NOT_ACCESSED',installedTree:'NOT_TRAVERSED',runtimeStatus:'RUNTIME_OPEN',graphStatus:'ACQUIRED_GRAPH_UNRUN',fullRuntimeClosure:'NOT_ACCEPTED',execution:false,materialization:false};
 const result={...body,digest:manifestDigest(body)};
 reserve(Buffer.byteLength(canonicalManifest(result)));check();return frozen(result);
}
