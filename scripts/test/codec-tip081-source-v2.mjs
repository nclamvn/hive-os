// Bounded JSON-text codec. All returned objects are inert data, never authority.
import {createHash} from "node:crypto";

export const V2_CODEC_LIMITS=Object.freeze({bytes:16384,depth:128,fields:64,values:4096,scratchBytes:524288});
export const V2_SYNTHETIC_PIN_LABELS=Object.freeze({adapter:"TIP081_V2_SYNTHETIC_ONLY_DISABLED_ADAPTER_V1",allocationAudit:"TIP081_V2_SYNTHETIC_ONLY_CODEC_INVENTORY_V1"});
const digest=text=>createHash("sha256").update(text,"utf8").digest("hex");
export const V2_SYNTHETIC_PINS=Object.freeze({grammarHash:"3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d",grammarPackageHash:"aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca",adapterHash:digest(V2_SYNTHETIC_PIN_LABELS.adapter),allocationAuditHash:digest(V2_SYNTHETIC_PIN_LABELS.allocationAudit)});
const H=/^[a-f0-9]{64}$/;
const whitespacePattern=/[ \t\r\n]/,hexPattern=/[0-9a-fA-F]/,firstDigitPattern=/[1-9]/,digitPattern=/[0-9]/;
const pathCharactersPattern=/[\\:\u0000-\u001f\u007f]/;
const forbiddenPathPattern=/(^|\/)(?:\.env(?:[./]|$)|\.git(?:\/|$)|artifacts(?:\/|$))|p139|attempt[-_ ]?5|LIVE_APPROVAL|(?:^|\/)grant(?:[.-]|\/|$)/i;
const jsonLiterals=Object.freeze(["true","false","null"]);
const U=v=>Number.isSafeInteger(v)&&v>=0&&!Object.is(v,-0);
const stages=["ADMISSION","SOURCE","PARSER","PRODUCER_SUMMARY","REPLAY","CLEANUP"];
const codes=["AUTHORITY_REFUSED","BUSY_REFUSED","SCHEMA_REFUSED","HASH_REFUSED","PIN_REFUSED","MODE_OPEN","ALLOCATION_COVERAGE_OPEN","CAP_REFUSED","DEPTH_REFUSED","NODE_REFUSED","ENTRY_REFUSED","TIME_REFUSED","UNSUPPORTED_BOUNDED_SYNTAX","VERIFY_RESOURCE_REFUSED","REPLAY_MISMATCH","CLEANUP_REFUSED"];
const categories=["baseBytes","sourceBufferBytes","decodedBytes","toolBytes","parserBytes","astBytes","listBytes","derivedStringBytes","traversalBytes","outputBytes","replayBytes","scratchBytes","unreclaimedProducerBytes"];
export function sourceV2Error(code){if(arguments.length!==1||!codes.includes(code))code="SCHEMA_REFUSED";const error=new Error(`TIP081_V2_${code}`);error.code=code;return error;}
/** @returns {never} */
function fail(code="SCHEMA_REFUSED"){throw sourceV2Error(code);}
// Per-call monotone logical scratch. Costs include scanner garbage until return.
function charge(budget,bytes){if(!U(bytes)||bytes>524288-budget.used)fail("CAP_REFUSED");budget.used+=bytes;}
function sizeString(s){let n=2;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if(c===34||c===92||c===8||c===9||c===10||c===12||c===13)n+=2;else if(c<32)n+=6;else if(c<128)n++;else if(c<2048)n+=2;else if(c>=55296&&c<=56319){const d=s.charCodeAt(i+1);if(d>=56320&&d<=57343){n+=4;i++;}else n+=6;}else if(c>=56320&&c<=57343)n+=6;else n+=3;}return n;}
function encodedBytes(s){let n=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);if(c<128)n++;else if(c<2048)n+=2;else if(c>=55296&&c<=56319&&s.charCodeAt(i+1)>=56320&&s.charCodeAt(i+1)<=57343){n+=4;i++;}else n+=3;if(n>16384)fail("CAP_REFUSED");}return n;}

// String and total UTF8 caps precede slices, sets, JSON.parse and canonical copies.
// This scanner rejects duplicate decoded names, including escaped spellings.
function parse(text){
  if(typeof text!=="string")fail();if(text.length>16384)fail("CAP_REFUSED");encodedBytes(text);
  const budget={used:0};charge(budget,65536+8*text.length);
  let at=0,values=0;
  const ws=()=>{while(at<text.length&&whitespacePattern.test(text[at]))at++;};
  function string(){const start=at++;while(at<text.length){const c=text.charCodeAt(at++);if(c===34){charge(budget,32);const s=JSON.parse(text.slice(start,at));if(s.length>8192)fail("CAP_REFUSED");return s;}if(c<32)fail();if(c===92){const esc=text[at++];if(esc==="u"){for(let k=0;k<4;k++)if(!hexPattern.test(text[at++]??""))fail();}else if(!'"\\/bfnrt'.includes(esc??"!"))fail();}}fail();}
  function value(depth){if(depth>128)fail("DEPTH_REFUSED");if(++values>4096)fail("NODE_REFUSED");charge(budget,64);ws();const c=text[at];
    if(c==='"'){string();return;}
    if(c==="{"||c==="["){const object=c==="{",end=object?"}":"]";at++;ws();if(object)charge(budget,64);const names=object?new Set():null;let count=0;if(text[at]===end){at++;return;}
      for(;;){if(++count>(object?64:4096))fail("ENTRY_REFUSED");ws();if(object){if(text[at]!=='"')fail();charge(budget,96);const key=string();if(key.length>2048||names.has(key))fail();names.add(key);ws();if(text[at++]!==":")fail();}value(depth+1);ws();if(text[at]===end){at++;return;}if(text[at++]!==",")fail();}
    }
    for(let l=0;l<jsonLiterals.length;l++){const literal=jsonLiterals[l];if(text.startsWith(literal,at)){at+=literal.length;return;}}
    const start=at;if(text[at]==="-")at++;if(text[at]==="0")at++;else{if(!firstDigitPattern.test(text[at]??""))fail();while(digitPattern.test(text[at]??""))at++;}
    if(text[at]==="."||text[at]==="e"||text[at]==="E")fail();const number=Number(text.slice(start,at));if(!U(number))fail();
  }
  try{value(0);ws();if(at!==text.length)fail();return {value:JSON.parse(text),budget};}catch(error){if(error?.code&&codes.includes(error.code))throw error;fail();}
}
function exact(v,keys){if(!v||typeof v!=="object"||Array.isArray(v)||Object.getPrototypeOf(v)!==Object.prototype)fail();const own=Object.keys(v);if(own.length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))fail();}
function str(v,max){if(typeof v!=="string"||v.length>max)fail();}
function hash(v){if(typeof v!=="string"||!H.test(v))fail();}
function uint(v){if(!U(v))fail();}
function eq(v,w){if(v!==w)fail();}
function path(v){str(v,2048);if(!v||v.startsWith("/")||pathCharactersPattern.test(v)||forbiddenPathPattern.test(v))fail();let start=0;for(let i=0;i<=v.length;i++){if(i===v.length||v.charCodeAt(i)===47){const length=i-start;if(length===0||(length===1&&v.charCodeAt(start)===46)||(length===2&&v.charCodeAt(start)===46&&v.charCodeAt(start+1)===46))fail();start=i+1;}}}
function timestamp(v){str(v,32);const n=Number(v);if(!v||!Number.isFinite(n)||n<0||Object.is(n,-0)||String(n)!==v)fail();}
function binding(b){exact(b,["storeHash","inventoryHash","snapshotHash","creationReceiptHash","epoch","profile","mode","path","source","sourcePath","identity","sourceBytes","utf16Units","decodedBytes","sourceHash"]);for(const k of ["storeHash","inventoryHash","snapshotHash","creationReceiptHash","sourceHash"])hash(b[k]);
  exact(b.epoch,["kind","id","hash"]);str(b.epoch.kind,64);str(b.epoch.id,128);hash(b.epoch.hash);
  exact(b.profile,["runtime","mode","nodeVersion","platform","arch","distDir"]);eq(b.profile.runtime,"node");eq(b.profile.mode,"production");for(const k of ["nodeVersion","platform","arch"])str(b.profile[k],32);path(b.profile.distDir);
  if(!["SYNTHETIC","FAILED_BUILD4_FEASIBILITY"].includes(b.mode)||!["project","dependency"].includes(b.source))fail();path(b.path);path(b.sourcePath);
  const i=b.identity;exact(i,["device","inode","mode","nlink","size","uid","mtimeMs","ctimeMs","type"]);for(const k of ["device","inode","mode","nlink","size","uid"])uint(i[k]);eq(i.nlink,1);eq(i.type,"file");timestamp(i.mtimeMs);timestamp(i.ctimeMs);
  for(const k of ["sourceBytes","utf16Units","decodedBytes"])uint(b[k]);eq(i.size,b.sourceBytes);if(b.utf16Units>Math.floor(Number.MAX_SAFE_INTEGER/2))fail();eq(b.decodedBytes,2*b.utf16Units);
}
function profile(p,mode){exact(p,["grammarVersion","grammarHash","grammarPackageHash","adapterHash","allocationAuditHash","conventionVersion","sourceType","locations","ranges","callbacks","callerProgram","plugins","nativeRegex","nativeBigInt","depthLimit","nodeLimit","entryLimit","byteLimit","milliseconds"]);eq(p.grammarVersion,"8.14.0");for(const k of Object.keys(V2_SYNTHETIC_PINS)){hash(p[k]);if(p[k]!==V2_SYNTHETIC_PINS[k])fail("PIN_REFUSED");}if(mode!=="SYNTHETIC")fail("ALLOCATION_COVERAGE_OPEN");eq(p.conventionVersion,1);if(!["script","module"].includes(p.sourceType))fail();for(const k of ["locations","ranges","callbacks","callerProgram","plugins","nativeRegex","nativeBigInt"])eq(p[k],false);eq(p.depthLimit,128);eq(p.nodeLimit,200000);eq(p.entryLimit,128);eq(p.byteLimit,1048576);eq(p.milliseconds,120000);}
function ledger(q,b,p){exact(q,[...categories,"peakBytes","limit","nodeCount","siteCount","maxDepth"]);for(const k of Object.keys(q))uint(q[k]);eq(q.limit,p.byteLimit);eq(q.decodedBytes,b.decodedBytes);if(q.sourceBufferBytes<b.sourceBytes)fail();let sum=0;for(const k of categories){if(q[k]>q.limit-sum)fail("CAP_REFUSED");sum+=q[k];}if(q.peakBytes<sum||q.peakBytes>q.limit)fail("CAP_REFUSED");if(q.nodeCount>p.nodeLimit)fail("NODE_REFUSED");if(q.siteCount>p.entryLimit)fail("ENTRY_REFUSED");if(q.maxDepth>p.depthLimit)fail("DEPTH_REFUSED");}
function statuses(v){eq(v.graphStatus,"ACQUIRED_GRAPH_UNRUN");eq(v.fullRuntimeClosure,"NOT_ACCEPTED");eq(v.execution,false);eq(v.materialization,false);}
function schema(v,budget){
  if(!v||v.version!==2)fail();let seal;
  if(v.purpose==="TIP081_BOUNDED_SOURCE_DESCRIPTOR"){exact(v,["version","purpose","binding","ownership","descriptorHash"]);binding(v.binding);eq(v.ownership,"PRIVATE_SINGLE_SOURCE");seal="descriptorHash";}
  else if(v.purpose==="TIP081_BOUNDED_SOURCE_CONSUMER_RECEIPT"){exact(v,["version","purpose","binding","descriptorHash","parserProfile","profileHash","ledger","analysisHash","scope","verification","semanticCoverage","graphStatus","fullRuntimeClosure","execution","materialization","receiptHash"]);binding(v.binding);profile(v.parserProfile,v.binding.mode);hash(v.descriptorHash);hash(v.profileHash);hash(v.analysisHash);ledger(v.ledger,v.binding,v.parserProfile);eq(v.scope,"ONE_AUTHENTIC_SOURCE_BOUNDED_SYNTAX_ANALYSIS");eq(v.verification,"INDEPENDENT_SOURCE_AND_SYNTAX_REPLAY");eq(v.semanticCoverage,"OPEN_COMMON_GRAMMAR_RISK");statuses(v);seal="receiptHash";
    if(v.profileHash!==digest(canonical(v.parserProfile,"",budget)))fail("HASH_REFUSED");const d={version:2,purpose:"TIP081_BOUNDED_SOURCE_DESCRIPTOR",binding:v.binding,ownership:"PRIVATE_SINGLE_SOURCE"};if(v.descriptorHash!==digest(canonical(d,"",budget)))fail("HASH_REFUSED");
  }else if(v.purpose==="TIP081_BOUNDED_SOURCE_CONSUMER_REFUSAL"){exact(v,["version","purpose","stage","code","bindingHash","profileHash","limit","requestedBytes","graphStatus","fullRuntimeClosure","execution","materialization","refusalHash"]);if(!stages.includes(v.stage)||!codes.includes(v.code))fail();for(const k of ["bindingHash","profileHash"])if(v[k]!==null)hash(v[k]);uint(v.limit);if(v.requestedBytes!==null)uint(v.requestedBytes);statuses(v);seal="refusalHash";}else fail();hash(v[seal]);return seal;
}
function measure(v){if(v===null)return 4;if(typeof v==="string")return sizeString(v);if(typeof v!=="object")return String(v).length;let n=2;for(const k of Object.keys(v)){n+=sizeString(k)+1+measure(v[k])+1;}return n-(Object.keys(v).length?1:0);}
function canonical(v,omit="",budget={used:65536}){const bytes=measure(v);if(bytes>16384)fail("CAP_REFUSED");let tokens=0;function count(x){if(x===null||typeof x!=="object"){tokens++;return;}tokens+=2;let n=0;for(const k of Object.keys(x)){if(x===v&&k===omit)continue;tokens+=2+(n++?1:0);count(x[k]);}}count(v);charge(budget,4096+6*bytes+40*tokens);const pieces=new Array(tokens);let index=0;function emit(token){pieces[index++]=token;}function write(x){if(x===null||typeof x!=="object"){emit(JSON.stringify(x));return;}emit("{");let n=0;for(const k of Object.keys(x).filter(k=>k!==omit||x!==v).sort()){if(n++)emit(",");emit(JSON.stringify(k));emit(":");write(x[k]);}emit("}");}write(v);return pieces.join("");}
function freeze(v){if(v&&typeof v==="object"){for(const k of Object.keys(v))freeze(v[k]);Object.freeze(v);}return v;}

export function sealSourceV2(text){if(arguments.length!==1)fail();const {value:v,budget}=parse(text),seal=schema(v,budget);v[seal]=digest(canonical(v,seal,budget));return canonical(v,"",budget);}
export function canonicalSourceV2(text){if(arguments.length!==1)fail();const {value:v,budget}=parse(text),seal=schema(v,budget);if(v[seal]!==digest(canonical(v,seal,budget)))fail("HASH_REFUSED");return canonical(v,"",budget);}
export function decodeSourceV2(text){if(arguments.length!==1)fail();const {value:v,budget}=parse(text),seal=schema(v,budget);if(v[seal]!==digest(canonical(v,seal,budget)))fail("HASH_REFUSED");canonical(v,"",budget);return freeze(v);}
export function syntheticParserProfileV2(sourceType){if(arguments.length!==1||!["script","module"].includes(sourceType))fail();return Object.freeze({grammarVersion:"8.14.0",...V2_SYNTHETIC_PINS,conventionVersion:1,sourceType,locations:false,ranges:false,callbacks:false,callerProgram:false,plugins:false,nativeRegex:false,nativeBigInt:false,depthLimit:128,nodeLimit:200000,entryLimit:128,byteLimit:1048576,milliseconds:120000});}
export function syntheticProfileHashV2(sourceType){if(arguments.length!==1)fail();return digest(canonical(syntheticParserProfileV2(sourceType)));}
