// Mandatory source-assembly admission only. No parser, target evaluation or FS expansion.
import {createHash} from "node:crypto";
import {types,isDeepStrictEqual} from "node:util";
import {manifestDigest} from "./runtime-tip081-manifest.mjs";
import {readAcquiredInventory,readInventorySnapshotChunk,inventoryPath} from "./acquire-tip081-inventory.mjs";

const chunkLimit=65536,streamTemporaryBytes=4*chunkLimit+1024;
const declarationPaths=new Set(["package.json",".next-tip080/package.json",".next-tip080/required-server-files.json",".next-tip080/server/pages-manifest.json",".next-tip080/server/app-paths-manifest.json",".next-tip080/server/middleware-manifest.json",".next-tip080/server/functions-config-manifest.json",".next-tip080/routes-manifest.json",".next-tip080/app-path-routes-manifest.json"]);
const compare=(a,b)=>a<b?-1:a>b?1:0;
const integer=value=>Number.isSafeInteger(value)&&value>=0&&!Object.is(value,-0);
function freeze(value){if(value&&typeof value==="object"){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
/** @returns {never} */
function deny(code,details={}){const error=new Error(code);error.code=code;error.details={graphStatus:"ACQUIRED_GRAPH_UNRUN",execution:false,materialization:false,...details};throw error;}

// Count canonical JSON bytes without assembling its whole string or object clone.
// Only bounded scalar encodings coexist; inputs are authenticated frozen metadata.
function stringBytes(value){
  let bytes=2;
  for(let at=0;at<value.length;at++){
    const unit=value.charCodeAt(at);
    if(unit===34||unit===92||[8,9,10,12,13].includes(unit))bytes+=2;
    else if(unit<32)bytes+=6;
    else if(unit<128)bytes++;
    else if(unit<2048)bytes+=2;
    else if(unit>=55296&&unit<=56319){const next=value.charCodeAt(at+1);if(next>=56320&&next<=57343){bytes+=4;at++;}else bytes+=6;}
    else if(unit>=56320&&unit<=57343)bytes+=6;
    else bytes+=3;
  }return bytes;
}
function jsonBytes(value,limit,started){
  let nodes=0;
  function visit(item,depth){
    const now=performance.now();if(!Number.isFinite(started)||!Number.isFinite(now)||now<started||now-started>120000)deny("TIP081_GRAPH_PREFLIGHT_TIME_REFUSED");
    if(++nodes>1000000||depth>128)deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
    if(item===null)return 4;if(typeof item==="boolean")return item?4:5;
    if(typeof item==="number"){if(!Number.isFinite(item)||Object.is(item,-0))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");return Buffer.byteLength(JSON.stringify(item));}
    if(typeof item==="string"){if(item.length>8192)deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");return stringBytes(item);}
    if(!item||typeof item!=="object"||types.isProxy(item))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
    const array=Array.isArray(item);if(Object.getPrototypeOf(item)!==(array?Array.prototype:Object.prototype))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
    let size=2,count=0;
    if(array){
      const length=Object.getOwnPropertyDescriptor(item,"length")?.value;
      if(!integer(length)||length>20000)deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
      for(let index=0;index<length;index++){const descriptor=Object.getOwnPropertyDescriptor(item,String(index));if(!descriptor||!Object.hasOwn(descriptor,"value"))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");size+=(count++?1:0)+visit(descriptor.value,depth+1);if(size>limit)deny("TIP081_GRAPH_PREFLIGHT_CONTROL_CAP");}
    }else{
      for(const name of Object.keys(item)){const descriptor=Object.getOwnPropertyDescriptor(item,name);if(!descriptor||!Object.hasOwn(descriptor,"value")||["__proto__","constructor","prototype"].includes(name))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");size+=(count++?1:0)+stringBytes(name)+1+visit(descriptor.value,depth+1);if(size>limit)deny("TIP081_GRAPH_PREFLIGHT_CONTROL_CAP");}
    }return size;
  }return visit(value,0);
}

/** Exactly one authenticated acquisition. Conservative logical controls, not RSS. */
export function preflightInventoryGraph(acquired){
  const started=performance.now();
  if(arguments.length!==1||!acquired||typeof acquired!=="object"||types.isProxy(acquired))deny("TIP081_GRAPH_PREFLIGHT_AUTHORITY_REFUSED");
  let held;try{held=readAcquiredInventory(acquired);}catch{deny("TIP081_GRAPH_PREFLIGHT_AUTHORITY_REFUSED");}
  const {record,snapshot}=held,mode=record.mode;
  if(!["SYNTHETIC","FAILED_BUILD4_FEASIBILITY"].includes(mode)||snapshot.purpose!=="TIP081_INVENTORY_ONLY_METADATA_SNAPSHOT"||snapshot.ownership!=="PRIVATE_ACQUISITION_SINGLE_OWNER"||snapshot.retainedBodyCopies!==1)deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
  const limit=mode==="SYNTHETIC"?1048576:67108864,entryLimit=mode==="SYNTHETIC"?128:20000;
  const bodyBytes=snapshot.files.reduce((sum,row)=>sum+row.size,0);
  if(!integer(bodyBytes)||snapshot.files.length+record.directories.length>entryLimit||!isDeepStrictEqual(record.entries,snapshot.entries)||record.snapshotDigest!==snapshot.digest)deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
  const timing=()=>{const now=performance.now();if(!Number.isFinite(started)||!Number.isFinite(now)||now<started||now-started>120000)deny("TIP081_GRAPH_PREFLIGHT_TIME_REFUSED");};
  /** @param {number} bytes @param {string} stage @param {string|null} path */
  const cap=(bytes,stage,path=null)=>{timing();if(!integer(bytes)||bytes>limit)deny("TIP081_GRAPH_PREFLIGHT_CONTROL_CAP",{stage,bodyBytes,baseBytes:bytes,limit,...path?{path}:{}});};
  cap(bodyBytes+streamTemporaryBytes,"METADATA_SIZING");
  const inputMetadataBytes=jsonBytes(record,limit,started)+jsonBytes(snapshot,limit,started),canonicalScratchBytes=3*inputMetadataBytes;
  const declarationBytes=snapshot.files.reduce((sum,row)=>sum+(declarationPaths.has(row.path)||row.path.endsWith(".nft.json")?row.size:0),0);
  // This allowance represents conservative controls and retained prior-stage FS
  // receipt data. It is NOT a promise enclosing a concurrently invoked FS helper.
  const verificationAllowanceBytes=8*inputMetadataBytes+4096*(snapshot.files.length+record.directories.length)+3*declarationBytes+65536+16384;
  const upperProjectionBytes=inputMetadataBytes+256*snapshot.files.length+2048;
  const upperPlanAllowance=4*upperProjectionBytes+512*snapshot.files.length+16384;
  cap(bodyBytes+inputMetadataBytes+canonicalScratchBytes+upperPlanAllowance+verificationAllowanceBytes+streamTemporaryBytes,"BEFORE_PLAN_ROWS");
  const entrySet=new Set(snapshot.entries),policies=new Map(record.projectInputPolicy.records.map(row=>[row.path,row])),files=[];
  for(const row of snapshot.files){
    timing();inventoryPath(row.path);
    if(!integer(row.size)||typeof row.digest!=="string"||!/^[a-f0-9]{64}$/.test(row.digest)||!["javascript","json","native","asset","unsupported"].includes(row.kind))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
    files.push({path:row.path,size:row.size,digest:row.digest,kind:row.kind,entry:entrySet.has(row.path),role:policies.get(row.path)?.role??null,execution:false});
  }
  let previousPath=null;for(const row of files){if(previousPath!==null&&compare(previousPath,row.path)>=0)deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");previousPath=row.path;}
  const projection={profile:snapshot.profile,epoch:snapshot.epoch,entries:snapshot.entries,files,projectInputPolicy:record.projectInputPolicy};
  const sourceCount=files.reduce((sum,row)=>sum+(row.kind==="javascript"?1:0),0),planAllowanceBytes=4*jsonBytes(projection,limit,started)+512*sourceCount+16384;
  const baseBytes=bodyBytes+inputMetadataBytes+canonicalScratchBytes+planAllowanceBytes+verificationAllowanceBytes+streamTemporaryBytes;
  cap(baseBytes,"BEFORE_SOURCE_STREAM");
  const sources=[];let maxDecodedBytes=0,maxSourceOnlyBytes=bodyBytes,maxConservativeBytes=baseBytes,maximumPath=null;
  for(const file of files){
    if(file.kind!=="javascript")continue;
    if(files.length+sources.length+1>entryLimit)deny("TIP081_GRAPH_PREFLIGHT_ENTRY_CAP");
    const decoder=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}),hash=createHash("sha256");let utf16Units=0;
    for(let offset=0;offset<file.size;offset+=chunkLimit){
      cap(baseBytes,"SOURCE_STREAM",file.path);
      const length=Math.min(chunkLimit,file.size-offset),chunk=readInventorySnapshotChunk(acquired,file.path,offset,length);
      if(chunk.length!==length)deny("TIP081_GRAPH_PREFLIGHT_CHUNK_REFUSED",{path:file.path});
      hash.update(chunk);
      // Count and discard each decoded chunk. No whole source Buffer/string/list.
      try{utf16Units+=decoder.decode(chunk,{stream:true}).length;}catch{deny("TIP081_GRAPH_PREFLIGHT_UTF8_REFUSED",{path:file.path});}
    }
    if(file.size===0)readInventorySnapshotChunk(acquired,file.path,0,0);
    try{utf16Units+=decoder.decode().length;}catch{deny("TIP081_GRAPH_PREFLIGHT_UTF8_REFUSED",{path:file.path});}
    const digest=hash.digest("hex");if(digest!==file.digest)deny("TIP081_GRAPH_PREFLIGHT_HASH_REFUSED",{path:file.path});
    const decodedBytes=2*utf16Units;if(!integer(decodedBytes))deny("TIP081_GRAPH_PREFLIGHT_METADATA_REFUSED");
    if(maximumPath===null||decodedBytes>maxDecodedBytes){maxDecodedBytes=decodedBytes;maximumPath=file.path;}
    const sourceOnlyBytes=bodyBytes+decodedBytes,conservativeBytes=baseBytes+decodedBytes;
    maxSourceOnlyBytes=Math.max(maxSourceOnlyBytes,sourceOnlyBytes);maxConservativeBytes=Math.max(maxConservativeBytes,conservativeBytes);
    cap(baseBytes,"BEFORE_SOURCE_ROW",file.path);sources.push({path:file.path,size:file.size,digest,utf16Units,decodedBytes,sourceOnlyBytes,conservativeBytes});
  }
  const reason=maxSourceOnlyBytes>limit?"SOURCE_ONLY_BOUND":maxConservativeBytes>limit?"CONSERVATIVE_ADMISSION":null;
  const decision={status:reason?"PREFLIGHT_REFUSED":"PREFLIGHT_ADMITTED",stage:"BEFORE_SOURCE_ASSEMBLY",reason,path:reason?maximumPath:null};
  const accounting={bodyBytes,inputMetadataBytes,canonicalScratchBytes,planAllowanceBytes,verificationAllowanceBytes,streamTemporaryBytes,baseBytes,maxDecodedBytes,maxSourceOnlyBytes,maxConservativeBytes,limit};
  const body={version:1,purpose:"TIP081_INVENTORY_GRAPH_PREFLIGHT",mode,inventoryDigest:record.digest,snapshotDigest:snapshot.digest,...projection,sources,accounting,decision,graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false};
  // P reserves the plan plus canonical/digest/output and verifier comparison
  // scratch; validate its exact output size before any whole serialization.
  if(jsonBytes(body,limit,started)+96>planAllowanceBytes)deny("TIP081_GRAPH_PREFLIGHT_PLAN_ALLOWANCE_REFUSED");
  cap(baseBytes,"BEFORE_PLAN_SEAL");const result={...body,digest:manifestDigest(body)};freeze(result);timing();return result;
}
