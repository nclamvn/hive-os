// Verified metadata lifetime, then one private source working set. No target execution.
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import {types} from "node:util";
import {manifestDigest} from "./runtime-tip081-manifest.mjs";
import {acquireInventory,readAcquiredInventory,createInventoryAccess,statInventoryPath,inventoryPath} from "./acquire-tip081-inventory.mjs";
import {verifyInventory} from "./verify-tip081-inventory.mjs";

const stores=new WeakMap(),leases=new WeakMap(),chunkLimit=65536;
const allocateChunk=Buffer.alloc.bind(Buffer),copyChunk=Function.prototype.call.bind(Buffer.prototype.copy);
let activeStore=null,activeLease=null;
const integer=value=>Number.isSafeInteger(value)&&value>=0&&!Object.is(value,-0);
const identityKeys=["device","inode","mode","nlink","size","uid","mtimeMs","ctimeMs","type"];
function freeze(value){if(value&&typeof value==="object"){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
/** @returns {never} */
function fail(code,details={}){const error=new Error(code);error.code=code;error.details={graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false,...details};throw error;}
function clock(started){const now=performance.now();if(!Number.isFinite(started)||!Number.isFinite(now)||now<started||now-started>120000)fail("TIP081_SOURCE_STORE_TIME_REFUSED");}
function ownerState(owner,timed=true){if(!owner||typeof owner!=="object"||types.isProxy(owner)||activeStore!==owner)fail("TIP081_SOURCE_STORE_AUTHORITY_REFUSED");const state=stores.get(owner);if(!state)fail("TIP081_SOURCE_STORE_AUTHORITY_REFUSED");if(timed)clock(state.started);return state;}
function leaseState(owner,lease,timed=true){const state=ownerState(owner,timed);if(!lease||typeof lease!=="object"||types.isProxy(lease)||activeLease!==lease)fail("TIP081_SOURCE_LEASE_AUTHORITY_REFUSED");const held=leases.get(lease);if(!held||held.owner!==owner)fail("TIP081_SOURCE_LEASE_AUTHORITY_REFUSED");return {state,held};}
function encodedStringBytes(value){let size=2;for(let i=0;i<value.length;i++){const c=value.charCodeAt(i);if(c===34||c===92||[8,9,10,12,13].includes(c))size+=2;else if(c<32)size+=6;else if(c<128)size++;else if(c<2048)size+=2;else if(c>=55296&&c<=56319){const next=value.charCodeAt(i+1);if(next>=56320&&next<=57343){size+=4;i++;}else size+=6;}else if(c>=56320&&c<=57343)size+=6;else size+=3;}return size;}
function metadataBytes(value,started,limit){
  let nodes=0;
  function visit(item,depth){
    clock(started);if(++nodes>1000000||depth>128)fail("TIP081_SOURCE_STORE_METADATA_REFUSED");
    if(item===null)return 4;if(typeof item==="boolean")return item?4:5;
    if(typeof item==="string"){if(item.length>8192)fail("TIP081_SOURCE_STORE_METADATA_REFUSED");return encodedStringBytes(item);}
    if(typeof item==="number"){if(!Number.isFinite(item)||Object.is(item,-0))fail("TIP081_SOURCE_STORE_METADATA_REFUSED");return Buffer.byteLength(JSON.stringify(item));}
    if(!item||typeof item!=="object"||types.isProxy(item))fail("TIP081_SOURCE_STORE_METADATA_REFUSED");
    const array=Array.isArray(item);if(Object.getPrototypeOf(item)!==(array?Array.prototype:Object.prototype))fail("TIP081_SOURCE_STORE_METADATA_REFUSED");let size=2,count=0;
    if(array){const length=Object.getOwnPropertyDescriptor(item,"length")?.value;if(!integer(length)||length>20000)fail("TIP081_SOURCE_STORE_METADATA_REFUSED");for(let i=0;i<length;i++){const descriptor=Object.getOwnPropertyDescriptor(item,String(i));if(!descriptor||!Object.hasOwn(descriptor,"value"))fail("TIP081_SOURCE_STORE_METADATA_REFUSED");size+=(count++?1:0)+visit(descriptor.value,depth+1);if(size>limit)fail("TIP081_SOURCE_STORE_CAP_REFUSED");}}
    else for(const key of Object.keys(item)){const descriptor=Object.getOwnPropertyDescriptor(item,key);if(!descriptor||!Object.hasOwn(descriptor,"value")||["__proto__","constructor","prototype"].includes(key))fail("TIP081_SOURCE_STORE_METADATA_REFUSED");size+=(count++?1:0)+encodedStringBytes(key)+1+visit(descriptor.value,depth+1);if(size>limit)fail("TIP081_SOURCE_STORE_CAP_REFUSED");}
    return size;
  }return visit(value,0);
}

// This lexical stage is the only holder of the acquisition key. Its return has
// metadata only; no body Map, Buffer, callback or closure can retain that key.
function creationStage(options){
  const transient=acquireInventory(options),creationReceipt=verifyInventory(transient);
  const {record:creationRecord,snapshot:creationSnapshot}=readAcquiredInventory(transient);
  return {creationRecord,creationSnapshot,creationReceipt};
}

export function createInventorySourceStore(options){
  if(arguments.length!==1)fail("TIP081_SOURCE_STORE_OPTIONS_REFUSED");
  if(activeStore!==null||activeLease!==null)fail("TIP081_SOURCE_STORE_BUSY");
  const started=performance.now();activeStore=Object.freeze({phase:"CREATING_METADATA"});
  try{
    const metadata=creationStage(options);clock(started);
    const {creationRecord,creationSnapshot,creationReceipt}=metadata,mode=creationRecord.mode,limit=mode==="SYNTHETIC"?1048576:67108864,entryLimit=mode==="SYNTHETIC"?128:20000;
    if(creationRecord.files.length+creationRecord.directories.length>entryLimit)fail("TIP081_SOURCE_STORE_ENTRY_REFUSED");
    const M=metadataBytes(creationRecord,started,limit)+metadataBytes(creationSnapshot,started,limit)+metadataBytes(creationReceipt,started,limit);
    const accounting={metadataBytes:M,canonicalScratchBytes:3*M,controlBytes:8*M+4096*(creationRecord.files.length+creationRecord.directories.length)+65536+16384,chunkTransientBytes:131072,decoderTransientBytes:132096,baseBytes:0,limit,entryLimit};
    accounting.baseBytes=M+accounting.canonicalScratchBytes+accounting.controlBytes+accounting.chunkTransientBytes+accounting.decoderTransientBytes;
    if(!integer(accounting.baseBytes)||accounting.baseBytes>limit)fail("TIP081_SOURCE_STORE_CAP_REFUSED",{baseBytes:accounting.baseBytes,limit});
    const body={version:1,purpose:"TIP081_VERIFIED_METADATA_SOURCE_STORE",ownership:"PRIVATE_METADATA_ONLY",mode,profile:creationRecord.profile,epoch:creationRecord.epoch,inventoryDigest:creationRecord.digest,snapshotDigest:creationSnapshot.digest,creationReceiptDigest:creationReceipt.digest,fileCount:creationRecord.files.length,directoryCount:creationRecord.directories.length,entryCount:creationRecord.entries.length,retainedPayloadBytes:0,accounting,graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false};
    if(metadataBytes(body,started,limit)+96>16384)fail("TIP081_SOURCE_STORE_SEAL_REFUSED");
    const view=freeze({...body,digest:manifestDigest(body)}),owner=Object.freeze({version:1,purpose:"TIP081_OPAQUE_METADATA_OWNER",storeDigest:view.digest});
    // The control convention's 4096-per-file/directory slots cover this metadata
    // index and independent catalogue/state reconstruction; there is no body index.
    const index=new Map();for(const row of creationRecord.files){clock(started);index.set(row.path,row);}
    stores.set(owner,{...metadata,view,index,started});activeStore=owner;return owner;
  }catch(error){activeStore=null;throw error;}
}

export function readInventorySourceStore(owner){if(arguments.length!==1)fail("TIP081_SOURCE_STORE_AUTHORITY_REFUSED");const state=ownerState(owner);return Object.freeze({view:state.view,creationRecord:state.creationRecord,creationSnapshot:state.creationSnapshot,creationReceipt:state.creationReceipt});}

function stat(stat){return {device:stat.dev,inode:stat.ino,mode:stat.mode,nlink:stat.nlink,size:stat.size,uid:stat.uid,mtimeMs:stat.mtimeMs,ctimeMs:stat.ctimeMs,type:stat.isFile()?"file":stat.isDirectory()?"directory":"other"};}
function same(left,right){return identityKeys.every(key=>left[key]===right[key]);}
function expectedIdentity(row){return {device:row.device,inode:row.inode,mode:row.mode,nlink:row.nlink,size:row.size,uid:row.uid,mtimeMs:row.mtimeMs,ctimeMs:row.ctimeMs,type:"file"};}
function parentProof(file,started){const proof=[];let current=path.parse(file).root;for(const part of file.split(path.sep).filter(Boolean).slice(0,-1)){clock(started);current=path.join(current,part);const raw=fs.lstatSync(current),identity=stat(raw);if(raw.isSymbolicLink()||identity.type!=="directory")fail("TIP081_SOURCE_LEASE_PARENT_REFUSED");proof.push({path:current,identity});}return proof;}
function parentsStable(proof,started){for(const row of proof){clock(started);const raw=fs.lstatSync(row.path);if(raw.isSymbolicLink()||!same(stat(raw),row.identity))fail("TIP081_SOURCE_LEASE_PARENT_CHANGED");}}
function readExpectedSource(state,row){
  const access=createInventoryAccess({mode:state.creationRecord.mode,...state.creationRecord.roots}),expected=expectedIdentity(row),before=statInventoryPath(access,row.source,row.sourcePath);
  if(!same(before,expected)||before.nlink!==1)fail("TIP081_SOURCE_LEASE_IDENTITY_REFUSED",{path:row.path});
  const root=row.source==="project"?state.creationRecord.roots.projectRoot:state.creationRecord.roots.dependencyRoot,file=path.join(root,row.sourcePath),proof=parentProof(file,state.started);
  let fd;
  try{
    fd=fs.openSync(file,fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW|fs.constants.O_NONBLOCK);
    const opened=stat(fs.fstatSync(fd));if(!same(opened,expected)||opened.nlink!==1)fail("TIP081_SOURCE_LEASE_FD_IDENTITY_REFUSED",{path:row.path});
    // Expected descriptor identity is checked BEFORE this exact-size allocation.
    clock(state.started);const bytes=Buffer.alloc(row.size);let offset=0;
    while(offset<row.size){clock(state.started);const count=fs.readSync(fd,bytes,offset,Math.min(chunkLimit,row.size-offset),offset);if(!integer(count)||count===0)fail("TIP081_SOURCE_LEASE_READ_REFUSED",{path:row.path});offset+=count;}
    if(fs.readSync(fd,Buffer.alloc(1),0,1,offset)!==0||!same(stat(fs.fstatSync(fd)),expected))fail("TIP081_SOURCE_LEASE_FD_CHANGED",{path:row.path});
    if(!same(statInventoryPath(access,row.source,row.sourcePath),expected))fail("TIP081_SOURCE_LEASE_IDENTITY_REFUSED",{path:row.path});parentsStable(proof,state.started);
    const digest=createHash("sha256").update(bytes).digest("hex");if(digest!==row.digest)fail("TIP081_SOURCE_LEASE_HASH_REFUSED",{path:row.path});return bytes;
  }finally{if(fd!==undefined)fs.closeSync(fd);}
}
function measurePrivate(bytes,started,file){const decoder=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true});let units=0;for(let offset=0;offset<bytes.length;offset+=chunkLimit){clock(started);try{units+=decoder.decode(bytes.subarray(offset,Math.min(bytes.length,offset+chunkLimit)),{stream:true}).length;}catch{fail("TIP081_SOURCE_LEASE_UTF8_REFUSED",{path:file});}}try{units+=decoder.decode().length;}catch{fail("TIP081_SOURCE_LEASE_UTF8_REFUSED",{path:file});}return units;}

export function openInventorySourceLease(owner,file){
  if(arguments.length!==2)fail("TIP081_SOURCE_LEASE_AUTHORITY_REFUSED");const state=ownerState(owner);
  if(activeLease!==null)fail("TIP081_SOURCE_LEASE_BUSY");if(typeof file!=="string")fail("TIP081_SOURCE_LEASE_PATH_REFUSED");inventoryPath(file);
  const row=state.index.get(file),metadata=state.creationSnapshot.files.find(item=>item.path===file);
  if(!row||!metadata||metadata.kind!=="javascript"||row.digest!==metadata.digest||row.size!==metadata.size)fail("TIP081_SOURCE_LEASE_DOMAIN_REFUSED");
  const sourceBufferBytes=row.size,worstDecodedBytes=2*row.size,reservedBytes=state.view.accounting.baseBytes+sourceBufferBytes+worstDecodedBytes;
  if(!integer(reservedBytes)||reservedBytes>state.view.accounting.limit)fail("TIP081_SOURCE_LEASE_CAP_REFUSED",{path:file,reservedBytes,limit:state.view.accounting.limit});
  activeLease=Object.freeze({phase:"OPENING_SOURCE"});
  let issued=null;
  try{
    const bytes=readExpectedSource(state,row),utf16Units=measurePrivate(bytes,state.started,file),decodedBytes=2*utf16Units,exactReservedBytes=state.view.accounting.baseBytes+bytes.length+decodedBytes;
    if(!integer(exactReservedBytes)||exactReservedBytes>state.view.accounting.limit)fail("TIP081_SOURCE_LEASE_CAP_REFUSED",{path:file,reservedBytes:exactReservedBytes,limit:state.view.accounting.limit});
    clock(state.started);let text;try{text=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}).decode(bytes);}catch{fail("TIP081_SOURCE_LEASE_UTF8_REFUSED",{path:file});}
    if(text.length!==utf16Units)fail("TIP081_SOURCE_LEASE_TEXT_REFUSED");
    const accounting={...state.view.accounting,sourceBufferBytes,worstDecodedBytes,decodedBytes,reservedBytes,exactReservedBytes};
    const body={version:1,purpose:"TIP081_PRIVATE_SOURCE_LEASE",storeDigest:state.view.digest,inventoryDigest:state.creationRecord.digest,snapshotDigest:state.creationSnapshot.digest,creationReceiptDigest:state.creationReceipt.digest,path:file,source:row.source,sourcePath:row.sourcePath,size:row.size,digest:row.digest,identity:expectedIdentity(row),utf16Units,decodedBytes,textCodeUnits:text.length,accounting,scope:"CURRENT_SELECTED_SOURCE_ONLY",graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false};
    if(metadataBytes(body,state.started,state.view.accounting.limit)+96>16384)fail("TIP081_SOURCE_LEASE_SEAL_REFUSED");
    const descriptor=freeze({...body,descriptorDigest:manifestDigest(body)}),lease=Object.freeze({version:1,purpose:"TIP081_OPAQUE_SOURCE_LEASE",storeDigest:state.view.digest,descriptorDigest:descriptor.descriptorDigest});
    leases.set(lease,{owner,descriptor,bytes,text});issued=lease;activeLease=lease;clock(state.started);return lease;
  }catch(error){if(issued!==null)clearLease(issued);else activeLease=null;if(error&&typeof error==="object"&&typeof error.code==="string"&&error.code.startsWith("TIP081_"))throw error;fail("TIP081_SOURCE_LEASE_FILESYSTEM_REFUSED",{path:file});}
}

export function readInventorySourceLease(owner,lease){if(arguments.length!==2)fail("TIP081_SOURCE_LEASE_AUTHORITY_REFUSED");return leaseState(owner,lease).held.descriptor;}
export function readInventorySourceLeaseChunk(owner,lease,offset,length){
  if(arguments.length!==4)fail("TIP081_SOURCE_LEASE_AUTHORITY_REFUSED");const {held}=leaseState(owner,lease);
  if(!integer(offset)||!integer(length)||length>chunkLimit||offset>held.bytes.length||length>held.bytes.length-offset)fail("TIP081_SOURCE_LEASE_RANGE_REFUSED");
  const copy=allocateChunk(length);copyChunk(held.bytes,copy,0,offset,offset+length);return copy;
}
function clearLease(lease){const held=leases.get(lease);if(held){held.bytes=null;held.text=null;leases.delete(lease);}activeLease=null;}
// Authenticated cleanup remains possible after expiry; it never renews a deadline.
export function closeInventorySourceLease(owner,lease){if(arguments.length!==2)fail("TIP081_SOURCE_LEASE_AUTHORITY_REFUSED");leaseState(owner,lease,false);clearLease(lease);return Object.freeze({status:"SOURCE_LEASE_CLOSED"});}
export function retireInventorySourceStore(owner){if(arguments.length!==1)fail("TIP081_SOURCE_STORE_AUTHORITY_REFUSED");const state=ownerState(owner,false);if(activeLease!==null)clearLease(activeLease);state.index.clear();stores.delete(owner);activeStore=null;return Object.freeze({status:"SOURCE_STORE_RETIRED"});}
