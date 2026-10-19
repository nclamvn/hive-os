// SYNTHETIC_ONLY coordinator. No v1 authority, FS, parser, callback or AST seam.
import {createHash} from "node:crypto";
import {types} from "node:util";
import {performance as trustedPerformance} from "node:perf_hooks";
import {decodeSourceV2,sealSourceV2,sourceV2Error,V2_CODEC_LIMITS} from "./codec-tip081-source-v2.mjs";

const owners=new WeakMap(),leases=new WeakMap();let activeOwner=null,activeLease=null;
const trustedNow=trustedPerformance.now.bind(trustedPerformance);
const typedPrototype=Object.getPrototypeOf(Uint8Array.prototype);
const byteLength=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(typedPrototype,"byteLength").get);
const arrayBuffer=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(typedPrototype,"buffer").get);
const backingLength=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get);
const copyBytes=Function.prototype.call.bind(Uint8Array.prototype.set);
const categories=["baseBytes","sourceBufferBytes","decodedBytes","toolBytes","parserBytes","astBytes","listBytes","derivedStringBytes","traversalBytes","outputBytes","replayBytes","scratchBytes","unreclaimedProducerBytes"];
const reservable=["parserBytes","astBytes","listBytes","derivedStringBytes","traversalBytes","outputBytes","replayBytes","scratchBytes"];
const producer=["parserBytes","astBytes","listBytes","derivedStringBytes","traversalBytes"];
const U=v=>Number.isSafeInteger(v)&&v>=0&&!Object.is(v,-0);
/** @returns {never} */
function fail(code){throw sourceV2Error(code);}
function opaque(v){return !!v&&typeof v==="object"&&!types.isProxy(v);}
function timed(s){const now=trustedNow();if(!Number.isFinite(s.started)||!Number.isFinite(s.lastNow)||!Number.isFinite(now)||now<s.started||now<s.lastNow||now-s.started>s.deadlineLifetimeMs)fail("TIME_REFUSED");s.lastNow=now;}
function ownerState(owner,time=true){if(!opaque(owner)||owner!==activeOwner)fail("AUTHORITY_REFUSED");const s=owners.get(owner);if(!s)fail("AUTHORITY_REFUSED");if(time)timed(s);return s;}
function leaseState(owner,lease,time=true){const s=ownerState(owner,time);if(!opaque(lease)||lease!==activeLease||leases.get(lease)!==owner)fail("AUTHORITY_REFUSED");return s;}
function total(q){let n=0;for(const k of categories){if(!U(q[k])||q[k]>q.limit-n)fail("CAP_REFUSED");n+=q[k];}return n;}
function reserve(s,category,bytes){if(!U(bytes))fail("SCHEMA_REFUSED");const live=total(s.q);if(bytes>s.q.limit-live)fail("CAP_REFUSED");s.q[category]+=bytes;s.q.peakBytes=Math.max(s.q.peakBytes,live+bytes);}
function utf16(bytes,s){let units=0,nextCheck=0;for(let i=0;i<bytes.length;){if(i>=nextCheck){timed(s);nextCheck=i+1024;}const a=bytes[i++];let count,min,code;if(a<128){units++;continue;}if(a>=194&&a<=223){count=1;min=128;code=a&31;}else if(a>=224&&a<=239){count=2;min=2048;code=a&15;}else if(a>=240&&a<=244){count=3;min=65536;code=a&7;}else fail("SCHEMA_REFUSED");if(count>bytes.length-i)fail("SCHEMA_REFUSED");for(let j=0;j<count;j++){const b=bytes[i++];if(b<128||b>191)fail("SCHEMA_REFUSED");code=code*64+(b&63);}if(code<min||code>1114111||(code>=55296&&code<=57343))fail("SCHEMA_REFUSED");units+=code>65535?2:1;}return units;}

/** JSON text and an exact nonshared Uint8Array only. Public metadata is not authority. */
export function createSyntheticSourceV2(descriptorText,bytes,deadlineLifetimeMs=120000){
  try{
  if((arguments.length!==2&&arguments.length!==3)||typeof descriptorText!=="string"||(arguments.length===3&&typeof arguments[2]!=="number")||!U(deadlineLifetimeMs)||deadlineLifetimeMs<1||deadlineLifetimeMs>120000)fail("SCHEMA_REFUSED");
  if(activeOwner!==null||activeLease!==null)fail("BUSY_REFUSED");
  if(!opaque(bytes)||!types.isUint8Array(bytes)||Object.getPrototypeOf(bytes)!==Uint8Array.prototype)fail("SCHEMA_REFUSED");
  const buffer=arrayBuffer(bytes);if(types.isSharedArrayBuffer(buffer))fail("SCHEMA_REFUSED");
  const length=byteLength(bytes);if(!U(length)||length>1048576)fail("CAP_REFUSED");
  // Reserve codec native/logical scratch and metadata/control before decode/copy.
  const q={baseBytes:65536,sourceBufferBytes:0,decodedBytes:0,toolBytes:65536,parserBytes:0,astBytes:0,listBytes:0,derivedStringBytes:0,traversalBytes:0,outputBytes:0,replayBytes:0,scratchBytes:V2_CODEC_LIMITS.scratchBytes,unreclaimedProducerBytes:0,peakBytes:655360,limit:1048576,nodeCount:0,siteCount:0,maxDepth:0};
  const started=trustedNow(),s={started,lastNow:started,deadlineLifetimeMs,q,descriptor:null,bytes:null,phase:"CREATING"};timed(s);
  const descriptor=decodeSourceV2(descriptorText);if(descriptor.purpose!=="TIP081_BOUNDED_SOURCE_DESCRIPTOR")fail("SCHEMA_REFUSED");
  if(descriptor.binding.mode!=="SYNTHETIC")fail("MODE_OPEN");const b=descriptor.binding;
  if(b.sourceBytes!==length)fail("SCHEMA_REFUSED");
  // Count caller-owned alias AND private copy; no retained parent/interning claim.
  reserve(s,"sourceBufferBytes",backingLength(buffer)+length);reserve(s,"decodedBytes",b.decodedBytes);
  const owned=new Uint8Array(length);copyBytes(owned,bytes);s.bytes=owned;s.descriptor=descriptor;
  if(createHash("sha256").update(owned).digest("hex")!==b.sourceHash)fail("HASH_REFUSED");
  if(utf16(owned,s)!==b.utf16Units)fail("SCHEMA_REFUSED");timed(s);
  const owner=Object.freeze({version:2,purpose:"TIP081_SYNTHETIC_OPAQUE_OWNER"});s.phase="METADATA";owners.set(owner,s);activeOwner=owner;return owner;
  }catch(error){if(error?.code&&typeof error.code==="string")throw error;fail("SCHEMA_REFUSED");}
}
export function openSyntheticSourceV2(owner){if(arguments.length!==1)fail("AUTHORITY_REFUSED");const s=ownerState(owner);if(activeLease!==null)fail("BUSY_REFUSED");if(s.phase!=="METADATA"&&s.phase!=="SOURCE_CLOSED")fail("AUTHORITY_REFUSED");reserve(s,"baseBytes",512);const lease=Object.freeze({version:2,purpose:"TIP081_SYNTHETIC_OPAQUE_LEASE"});leases.set(lease,owner);activeLease=lease;s.phase="SOURCE";return lease;}
export function readSyntheticSourceV2(owner,lease){if(arguments.length!==2)fail("AUTHORITY_REFUSED");const s=leaseState(owner,lease);reserve(s,"outputBytes",4096);return Object.freeze({mode:"SYNTHETIC_ONLY",phase:s.phase,descriptor:s.descriptor,ledger:Object.freeze({...s.q}),parser:"NOT_IMPLEMENTED/UNRUN",allocationCoverage:"ALLOCATION_COVERAGE_OPEN",crossVersionExclusion:"UNKNOWN_NOT_AUTHORITY",graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false});}

// Pure scalar reservations model proposed growth; they never allocate parser data.
export function reserveSyntheticSourceV2(owner,lease,category,requestText){
  if(arguments.length!==4||typeof category!=="string"||!reservable.includes(category)||typeof requestText!=="string"||requestText.length>256)fail("SCHEMA_REFUSED");
  const s=leaseState(owner,lease);
  // A fixed scalar request format, not a second general JSON parser. Duplicate
  // keys and escaped names are forbidden by this exact ordered lexical grammar.
  if(!/^\{"bytes":(?:0|[1-9][0-9]*),"nodeCount":(?:0|[1-9][0-9]*),"siteCount":(?:0|[1-9][0-9]*),"maxDepth":(?:0|[1-9][0-9]*)\}$/.test(requestText))fail("SCHEMA_REFUSED");
  let r;try{r=JSON.parse(requestText);}catch{fail("SCHEMA_REFUSED");}
  for(const k of ["bytes","nodeCount","siteCount","maxDepth"])if(!U(r[k]))fail("SCHEMA_REFUSED");
  if(r.nodeCount>200000-s.q.nodeCount)fail("NODE_REFUSED");if(r.siteCount>128-s.q.siteCount)fail("ENTRY_REFUSED");if(r.maxDepth>128)fail("DEPTH_REFUSED");
  reserve(s,category,r.bytes);s.q.nodeCount+=r.nodeCount;s.q.siteCount+=r.siteCount;s.q.maxDepth=Math.max(s.q.maxDepth,r.maxDepth);return true;
}
export function retireSyntheticProducerChargeV2(owner,lease,category){if(arguments.length!==3||typeof category!=="string"||!producer.includes(category))fail("SCHEMA_REFUSED");const s=leaseState(owner,lease);const bytes=s.q[category];s.q[category]=0;s.q.unreclaimedProducerBytes+=bytes;return true;}
function close(owner,lease){const s=leaseState(owner,lease,false);leases.delete(lease);activeLease=null;s.phase="SOURCE_CLOSED";}
function retire(owner){const s=ownerState(owner,false);if(activeLease!==null)close(owner,activeLease);s.bytes=null;s.descriptor=null;s.phase="RETIRED";owners.delete(owner);activeOwner=null;}
export function closeSyntheticSourceV2(owner,lease){if(arguments.length!==2)fail("AUTHORITY_REFUSED");close(owner,lease);return "SYNTHETIC_SOURCE_CLOSED";}
export function retireSyntheticSourceV2(owner){if(arguments.length!==1)fail("AUTHORITY_REFUSED");retire(owner);return "SYNTHETIC_OWNER_RETIRED";}
function refusal(code,stage="ADMISSION"){return sealSourceV2(JSON.stringify({version:2,purpose:"TIP081_BOUNDED_SOURCE_CONSUMER_REFUSAL",stage,code,bindingHash:null,profileHash:null,limit:1048576,requestedBytes:null,graphStatus:"ACQUIRED_GRAPH_UNRUN",fullRuntimeClosure:"NOT_ACCEPTED",execution:false,materialization:false,refusalHash:"0".repeat(64)}));}
// No receipt issuance is exported. Even genuine synthetic ownership cannot parse.
export function analyzeSyntheticSourceV2(owner,lease){if(arguments.length!==2)fail("AUTHORITY_REFUSED");leaseState(owner,lease,false);try{const s=ownerState(owner);reserve(s,"outputBytes",65536);return refusal("ALLOCATION_COVERAGE_OPEN","PARSER");}finally{retire(owner);}}
export function runtimeSourceV2(){if(arguments.length!==0)fail("AUTHORITY_REFUSED");return refusal("ALLOCATION_COVERAGE_OPEN");}
