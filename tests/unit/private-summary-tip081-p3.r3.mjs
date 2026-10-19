// R3 SOURCE ONLY: fixed serial205 TOOL runner. No tuple/context authority here.
// Main alone may dispatch this module after complete source/A/emitted/B gates.
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { Buffer } from 'node:buffer';
import { createHash, Hash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { setTimeout as sleep } from 'node:timers/promises';
import { TextDecoder } from 'node:util';
import { loadAdmittedSyntheticSummaryP3, loadAliasFaultSyntheticSummaryP3,
  loadBoundaryKernelP3R3, verifySyntheticSummaryArtifactP3,
  readReviewedContextP3R3 } from '../../scripts/test/admit-private-summary-tip081-p3.r3.mjs';
import { createMetadataBaselineP3R3 } from '../../scripts/test/metadata-baseline-tip081-p3.r3.mjs';
import { createBoundaryExpectationsP3R3 } from '../../scripts/test/boundary-expectations-tip081-p3.r3.mjs';

/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').SyntheticAPI} SyntheticAPI */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').KernelAPI} KernelAPI */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').ReviewedContext} ReviewedContext */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').MetadataBaseline} MetadataBaseline */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').BoundaryExpectations} BoundaryExpectations */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Slot} Slot */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Metadata} Metadata */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Summary} Summary */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Site} Site */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Operation} Operation */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').EvidenceRow} EvidenceRow */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Group} Group */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').UnitResult} UnitResult */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Mode} Mode */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').Handle} Handle */
/** @typedef {import('./private-summary-tip081-p3.r3.d.ts').DynamicCallable} DynamicCallable */
// Nullable roots are truthful. Handler-only narrowing is justified by runSerial's
// completed context/tuple loads before HANDLERS invocation and clearing only in
// its final exit. No foreign object reflection or new runtime guard is introduced.

/** @type {import('./private-summary-tip081-p3.r3.d.ts').AssertCondition} */
const cOk=assert.ok.bind(assert);
/** @type {typeof assert.deepStrictEqual} */
const cDeep=assert.deepStrictEqual.bind(assert);
const cParse=/** @type {(text: string) => unknown} */ (JSON.parse), cStringify=JSON.stringify, cKeys=Object.keys;
const cSetProto=Object.setPrototypeOf, cFreeze=Object.freeze, cIs=Object.is;
const cIsFrozen=Object.isFrozen, cDescriptor=/** @type {(object: object, key: PropertyKey) => import('./private-summary-tip081-p3.r3.d.ts').CheckedDescriptor | undefined} */ (Object.getOwnPropertyDescriptor);
const cPrototype=Object.getPrototypeOf, cSymbols=Object.getOwnPropertySymbols;
const cDefine=Object.defineProperty, cSafe=Number.isSafeInteger;
const cArray=Array, cIsArray=/** @type {(value: unknown) => value is unknown[]} */ (Array.isArray), cApply=Reflect.apply;
/** @type {(text: string, index: number) => number} */
const cChar=Function.call.bind(String.prototype.charCodeAt);
/** @type {(text: string, start?: number, end?: number) => string} */
const cSlice=Function.call.bind(String.prototype.slice);
/** @type {(text: string, search: string, replacement: string) => string} */
const cReplace=Function.call.bind(String.prototype.replace);
/** @type {(text: string, search: string, position?: number) => boolean} */
const cIncludes=Function.call.bind(String.prototype.includes);
/** @type {(text: string, search: string, position?: number) => number} */
const cIndexOf=Function.call.bind(String.prototype.indexOf);
/** @type {(text: string, separator: string, limit?: number) => string[]} */
const cSplit=Function.call.bind(String.prototype.split);
const cRepeat=/** @type {(text: string, count: number) => string} */ (Function.call.bind(String.prototype.repeat)), cRemove=Reflect.deleteProperty;
const cAlloc=Buffer.alloc.bind(Buffer), cFrom=Buffer.from.bind(Buffer);
const cUtf8=Buffer.byteLength.bind(Buffer);
/** @type {(bytes: Buffer, value: number, offset: number) => number} */
const cWriteLE=Function.call.bind(Buffer.prototype.writeUInt16LE);
/** @type {(left: Buffer, right: Uint8Array) => boolean} */
const cEquals=Function.call.bind(Buffer.prototype.equals);
/** @type {(bytes: Buffer, encoding: BufferEncoding) => string} */
const cBase64=Function.call.bind(Buffer.prototype.toString);
const cHash=createHash;
// Main L2 adds these two captured primitives; the46-capture proposal is history.
/** @type {(state: Hash, data: string | Buffer, encoding?: import('node:crypto').Encoding) => Hash} */
const cHashUpdate=Function.call.bind(Hash.prototype.update);
/** @type {(state: Hash, encoding: import('node:crypto').BinaryToTextEncoding) => string} */
const cHashDigest=Function.call.bind(Hash.prototype.digest);
const cNow=performance.now.bind(performance), cSleep=sleep;
const cOpen=fs.openSync, cStat=fs.fstatSync, cRead=fs.readSync;
const cWrite=fs.writeSync, cClose=fs.closeSync;
const cError=Error, cProxy=Proxy, cBoxedObject=Object;
const cTextDecoder=TextDecoder;
const decoder=new cTextDecoder('utf-8',{fatal:true,ignoreBOM:true});
const cDecode=/** @type {(decoder: TextDecoder, bytes: Uint8Array) => string} */ (Function.call.bind(cTextDecoder.prototype.decode)), cProcess=process;
/** @type {(stat: fs.Stats) => boolean} */
const cStatIsFile=Function.call.bind(fs.Stats.prototype.isFile);
const CAP=67108864, TTL=120000, ROOT='/Users/os/hiveos/';
const READ_FLAGS=fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW;
const WRITE_FLAGS=fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_NOFOLLOW;
const RAW_PATH=ROOT+'docs/verification/TIP-081A_P3_R3_UNIT_RAW.jsonl';
const RESULT_PATH=ROOT+'docs/verification/TIP-081A_P3_R3_UNIT_RESULT.json';
const API_KEYS=cFreeze(cSetProto(['createSyntheticSummaryP3','analyzeSyntheticSummaryP3',
  'retireProducerSummaryP3','verifySyntheticSummaryP3','observeSyntheticSummaryP3',
  'retireSyntheticSummaryP3'],null));
const SUM_KEYS=cFreeze(cSetProto(['version','purpose','mode','profile','syntheticUtf16Hash',
  'utf16Units','astOccurrences','grammarAttempts','sites','ledger','summaryHash'],null));
const SITE_KEYS=cFreeze(cSetProto(['kind','start','end','binding','loader','conditional',
  'optional','computed','status'],null));
/** @type {readonly import('./private-summary-tip081-p3.r3.d.ts').LedgerKey[]} */
const LEDGER_KEYS=cFreeze(cSetProto(['baseBytes','producerParseBytes','producerWorkBytes',
  'summaryBytes','replayReservedBytes','replayLiveBytes','scratchBytes',
  'unreclaimedProducerBytes','unreclaimedReplayBytes','totalBytes','peakBytes',
  'producerEntries','producerAttempts','siteCount'],null));
const CONTEXT_KEYS=cFreeze(cSetProto(['version','purpose','scope','status','normal','alias',
  'kernel','fixtureProof','counterProof','composition','tuples'],null));
const REGISTRY=cSetProto([
 ['SEQUENCE'],['FORGED','PROXY','OBJECT','NULL','STRING','NUMBER','FOREIGN_ALIAS_HANDLE'],
 ['RETIRED','EXPIRY'],['CREATE_EXTRA','CREATE_GETTER','CREATE_FUNCTION','ANALYZE_EXTRA','ANALYZE_EMPTY',
 'OBSERVE_EXTRA','OBSERVE_EMPTY','RETIRE_PRODUCER_EXTRA','RETIRE_PRODUCER_EMPTY','RETIRE_EXTRA','RETIRE_EMPTY','VERIFY_EXTRA'],
 ['IMPORT','EXPORT_NAMED','EXPORT_DEFAULT','EXPORT_ALL','DYNAMIC_LITERAL','REQUIRE','MEMBER_CALL','NEW_FUNCTION','EVAL','SHORTHAND'],
 ['DYNAMIC','PARAMETER','VAR','LET','CONST','FUNCTION_BINDING','IMPORT_BINDING','DESTRUCTURING','PARAM_PATTERN',
 'CATCH','IF','LOGICAL','TERNARY','WHILE','CLASS_METHOD','CLASS_FUNCTION','OPTIONAL','COMPUTED'],
 ['EMOJI','LONE_SURROGATE','REPLACEMENT'],['DUPLICATE','EXTRA','WHITESPACE','BOM','KEY_ORDER','UNSAFE_INTEGER',
 'NEGATIVE_ZERO','FRACTION','DEPTH','ESCAPE','WRONG_PURPOSE'],['ADDITIVE','BASELINE_WITNESS'],['PREMATURE'],['ALIAS'],
 ['RETIRE_TRANSFER'],['REPLAY_RETIRE'],['OMITTED'],['DUPLICATE'],['START','END','OUT_OF_SOURCE'],
 ['BINDING','LOADER','CONDITIONAL','OPTIONAL','COMPUTED'],['SOURCE','MODE','LENGTH','OCCURRENCES','ATTEMPTS','GROSS_SEAL'],
 ['A_NORMAL','B_INPUT_16384','B_INPUT_16385','C16384','C16385','C_SOURCE'],
 ['CAP_REFERENCE','CAP_EXACT','CAP_MINUS_ONE','META01','META02','META03','META04','META05','META06','META07','META08',
 'META09','META10','META11','META12','META13','META14','META15','META16','META17','META18','META19','META20','META21',
 'META22','META23','META24','META25','META26','META27','META28','META29','META30','META31','META32','META33_REFUSED'],
 ['A_NORMAL','B.P126','B.P127','B.PNEG','B.P128','B.V126','B.V127','B.VNEG','B.V128','C_P2_LINK','C_P3_CALLS'],
 ['A_MONOTONE','B.E19999_1','B.E20000_1','B.E20000_0','B.E0_MAX','B.EMAX_1','B.ENEGZERO_1',
 'B.E0_NEG','B.E19999_FRACTION','B.EUNSAFE_1','B.E0_INFINITY','C_COUNTER_CALLS'],
 ['TOTAL','PEAK','CATEGORY_SHIFT','RETIREMENT','REPLAY_ESCROW','COUNTERS'],['ORIGINAL_TTL'],['NO_REPLAY_RENEWAL'],
 ['CAPTURED_CLOCK'],['SYNTAX','META_EXHAUSTION','REPLAY_ERROR','FRESH'],
 ['EXACT_TUPLE','CANDIDATE_SUFFIX','LOADER_EXTRA_PROMISE','SIX_EXPORTS'],['REAL_GUARD_REMOVAL','NORMAL_NO_KERNEL_SWITCH'],
 ['INVENTORY_SUFFIX','PROFILE_SUFFIX','PROFILE_FLAGS','CANDIDATE_OBJECT','ARITY_TWO','ARITY_FOUR','GETTER_OBJECT','FUNCTION','BOXED_STRING'],
 ['ALIAS_CANDIDATE_MIXED','P2_CANDIDATE_MIXED','REAL_RECEIPT_PURPOSE','FULL_R3_ALIAS','FULL_R3_KERNEL',
 'KERNEL_CANDIDATE_MIXED','KERNEL_INVENTORY_MIXED','KERNEL_PROFILE_MIXED','FULL_R2_NORMAL','FULL_R2_ALIAS','FULL_P2'],
 ['NORMAL_CAPTURE_FLAGS','NORMAL_FORGED_FLAGS','KERNEL_FORGED_FLAGS','ALIAS_FORGED_FLAGS',
 'KERNEL_OBSERVATION_OBJECT','BODY_HASH_OBJECT','SEED_OBJECT'],['PRIVATE_METADATA'],['OPEN_LABELS'],
 ['UNKNOWN_MODE','REGEXP','BIGINT','NONASCII_ID','SCRIPT_IMPORT'],['NO_SALVAGE']
],null);
const TUPLE_PATHS=cSetProto([
 ['scripts/test/generated/private-summary-tip081-p3.r3.candidate.mjs','scripts/test/generated/private-summary-tip081-p3.r3.inventory.json','scripts/test/generated/private-summary-tip081-p3.r3.profile.json'],
 ['scripts/test/generated/private-summary-tip081-p3.r3.alias-fault.candidate.mjs','scripts/test/generated/private-summary-tip081-p3.r3.alias-fault.inventory.json','scripts/test/generated/private-summary-tip081-p3.r3.alias-fault.profile.json'],
 ['scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.candidate.mjs','scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.inventory.json','scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.profile.json'],
 ['scripts/test/generated/private-summary-tip081-p3.candidate.mjs','scripts/test/generated/private-summary-tip081-p3.inventory.json','scripts/test/generated/private-summary-tip081-p3.profile.json'],
 ['scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs','scripts/test/generated/private-summary-tip081-p3.alias-fault.inventory.json','scripts/test/generated/private-summary-tip081-p3.alias-fault.profile.json'],
 ['scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs','scripts/test/generated/private-grammar-tip081-p2.checked.inventory.json','scripts/test/generated/private-grammar-tip081-p2.checked.profile.json']
],null);
let normal=/** @type {Readonly<SyntheticAPI> | null} */ (null),alias=/** @type {Readonly<SyntheticAPI> | null} */ (null),kernel=/** @type {Readonly<KernelAPI> | null} */ (null),reviewed=/** @type {ReviewedContext | null} */ (null),baseline=/** @type {Readonly<MetadataBaseline> | null} */ (null),core=/** @type {Readonly<BoundaryExpectations> | null} */ (null);
/** @type {Slot[]} */
const slots=cSetProto([{__proto__:null,handle:null,registered:false,lastMetadata:null,witnessValue:null},
 {__proto__:null,handle:null,registered:false,lastMetadata:null,witnessValue:null}],null);
const rows=/** @type {EvidenceRow[]} */ (cSetProto(new cArray(205),null)), groups=/** @type {Group[]} */ (cSetProto(new cArray(36),null));
let currentOperation=/** @type {Operation | null} */ (null),touchCount=0,kernelChecked=false,kernelFirst=0,kernelLast=0;
let kernelArityDenied=false,journalFD=/** @type {number | null} */ (null),journalSequence=0,journalBytes=0;
let activeGroup=-1,activeRow=-1,rawFirstPresent=false,rawFirst=/** @type {unknown} */ (null);
let startupIndex=0,startupRow=0,startupItem=0;
for(startupIndex=0;startupIndex<36;startupIndex++){
 cSetProto(REGISTRY[startupIndex],null); cFreeze(REGISTRY[startupIndex]);
 groups[startupIndex]={__proto__:null,id:'P'+(301+startupIndex),status:'UNRUN',firstRow:startupRow,rowCount:REGISTRY[startupIndex].length};
 for(startupItem=0;startupItem<REGISTRY[startupIndex].length;startupItem++){
  rows[startupRow++]={__proto__:null,id:/** @type {import('./private-summary-tip081-p3.r3.d.ts').EvidenceId} */ ('P'+(301+startupIndex)+'.'+REGISTRY[startupIndex][startupItem]),
   lane:(startupIndex===18&&startupItem===5)||(startupIndex===20&&startupItem>=9)||(startupIndex===21&&startupItem===11)?'COMPOSITION_SOURCE':
    (startupIndex===18&&startupItem>=3)||(startupIndex===20&&startupItem>=1&&startupItem<=8)||(startupIndex===21&&startupItem>=1&&startupItem<=10)?'BOUNDARY_COMPONENT':'NORMAL_INTEGRATION',
   status:'UNRUN',group:'P'+(301+startupIndex),dependency:1|
    (((startupIndex===18&&(startupItem===3||startupItem===4))||(startupIndex===20&&startupItem>=1&&startupItem<=8)||(startupIndex===21&&startupItem>=1&&startupItem<=10))?2:0)|
    (((startupIndex===18&&startupItem===5)||(startupIndex===20&&startupItem>=9)||(startupIndex===21&&startupItem===11))?4:0)|
    (startupIndex===28&&startupItem===1?8:0)|((startupIndex===2||startupIndex===23||startupIndex===24||startupIndex===25)?16:0)};
 }
}
cOk(startupRow===205,'fixed registry must have205 rows'); cFreeze(REGISTRY);
for(startupIndex=0;startupIndex<6;startupIndex++){cSetProto(TUPLE_PATHS[startupIndex],null);cFreeze(TUPLE_PATHS[startupIndex]);}cFreeze(TUPLE_PATHS);
startupIndex=0;startupRow=0;startupItem=0;

/** @param {unknown} value @returns {value is number} */
function driverInteger(value){return typeof value==='number'&&cSafe(value)&&value>=0&&!cIs(value,-0);}
/** @param {unknown} handle @param {Readonly<SyntheticAPI> | null} domain @returns {Slot | null} */
function slotFor(handle,domain){return slots[domain===normal?0:domain===alias?1:-1]?.handle===handle?slots[domain===normal?0:1]:null;}
/** @param {DynamicCallable | null} fn @param {unknown[] | null} args @returns {unknown} */
function invoke(fn,args){return cApply(/** @type {DynamicCallable} */ (fn),undefined,/** @type {unknown[]} */ (args));}
/** @param {unknown} handle @param {Readonly<SyntheticAPI> | null} domain @returns {void} */
function stale(handle,domain){return refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (domain).observeSyntheticSummaryP3,[handle]),'AUTHORITY_REFUSED');}
/** @param {import('./private-summary-tip081-p3.r3.d.ts').SiteKind} kind @param {number} start @param {number} end @param {import('./private-summary-tip081-p3.r3.d.ts').BindingKind} [binding] @param {import('./private-summary-tip081-p3.r3.d.ts').LoaderKind} [loader] @param {import('./private-summary-tip081-p3.r3.d.ts').ConditionKind} [conditional] @param {boolean} [optional] @param {boolean} [computed] @returns {Readonly<Site>} */
function site(kind,start,end,binding='NONE',loader='NONE',conditional='CERTAIN',optional=false,computed=false){
 return cFreeze({__proto__:null,kind,start,end,binding,loader,conditional,optional,computed,status:'OPEN'});
}
/** @param {unknown} a @param {unknown} b @param {unknown} c @returns {boolean} */
function checkArtifact(a,b,c){return verifySyntheticSummaryArtifactP3(a,b,c);}
/** @param {number} ms @returns {Promise<void>} */
function delay(ms){return cSleep(ms);}
/** @param {DynamicCallable} fn @param {unknown[]} args @returns {Operation} */
function operation(fn,args){cOk(currentOperation===null,'one trusted operation at a time');cOk(args.length<=6,'fixed operation arity bound');return currentOperation={__proto__:null,fn,args:cSetProto(args,null)};}
/** @param {string} text @param {Mode} [mode] @param {number} [cap] @param {number} [ttl] @param {Readonly<SyntheticAPI> | null} [domain] @returns {unknown} */
function makeUnobserved(text,mode='SCRIPT',cap=CAP,ttl=TTL,domain=normal){
 const slot=slots[domain===normal?0:1];cOk(slot.handle===null,'one registered owner per domain');
 const handle=/** @type {Readonly<SyntheticAPI>} */ (domain).createSyntheticSummaryP3(text,mode,cap,ttl);slot.handle=handle;
 /** @type {Readonly<MetadataBaseline>} */ (baseline).register(handle,domain,text.length,mode,cap,ttl);slot.registered=true;return handle;
}
/** @param {string} text @param {Mode} [mode] @param {number} [cap] @param {number} [ttl] @param {Readonly<SyntheticAPI> | null} [domain] @returns {unknown} */
function make(text,mode='SCRIPT',cap=CAP,ttl=TTL,domain=normal){
 const handle=makeUnobserved(text,mode,cap,ttl,domain),slot=/** @type {Slot} */ (slotFor(handle,domain));
 metadata(handle,domain,/** @type {Readonly<SyntheticAPI>} */ (domain).observeSyntheticSummaryP3(handle));
 cOk(slot.witnessValue!==null,'make must bind initial metadata');return handle;
}
/** @returns {unknown} */
function foreignAlias(){cOk(slots[1].handle===null,'foreign alias slot free');const handle=/** @type {Readonly<SyntheticAPI>} */ (alias).createSyntheticSummaryP3('','SCRIPT',CAP,TTL);slots[1].handle=handle;return handle;}
/** @param {unknown} error @param {string} code @returns {boolean} */
function exactRefusal(error,code){
 let keys=/** @type {string[] | null} */ (null),codeDescriptor=/** @type {import('./private-summary-tip081-p3.r3.d.ts').CheckedDescriptor | null | undefined} */ (null),flagDescriptor=/** @type {import('./private-summary-tip081-p3.r3.d.ts').CheckedDescriptor | null | undefined} */ (null),valid=false;
 try{
  if(error!==null&&typeof error==='object'){
   keys=cSetProto(cKeys(error),null);codeDescriptor=cDescriptor(error,'code');flagDescriptor=cDescriptor(error,'realParserDisabled');
   if(codeDescriptor)cSetProto(codeDescriptor,null);if(flagDescriptor)cSetProto(flagDescriptor,null);
   valid=keys.length===2&&keys[0]==='code'&&keys[1]==='realParserDisabled'&&cSymbols(error).length===0&&
    codeDescriptor!==undefined&&flagDescriptor!==undefined&&codeDescriptor.value===code&&flagDescriptor.value===true&&
    codeDescriptor.get===undefined&&flagDescriptor.get===undefined&&cIsFrozen(error)&&
    cPrototype(error)===(currentOperation!==null&&currentOperation.fn===loadAdmittedSyntheticSummaryP3?null:cBoxedObject.prototype);
  }
 }catch(reflectionCaught){void reflectionCaught;valid=false;}
 return valid;
}
/** @returns {void} */
function drop(){
 let index=0,slot=/** @type {Slot | null} */ (null),failed=false,first;
 for(index=0;index<2;index++){
  slot=slots[index];
  if(slot.handle!==null){
   try{/** @type {Readonly<SyntheticAPI>} */ ((index===0?normal:alias)).retireSyntheticSummaryP3(slot.handle);}
   catch(retireCaught){if(!exactRefusal(retireCaught,'AUTHORITY_REFUSED')){if(!failed){failed=true;first=retireCaught;}}}
   finally{
    try{if(slot.registered)/** @type {Readonly<MetadataBaseline>} */ (baseline).forget(slot.handle,index===0?normal:alias);}
    catch(forgetCaught){if(!failed){failed=true;first=forgetCaught;}}
    finally{slot.handle=null;slot.registered=false;slot.lastMetadata=null;slot.witnessValue=null;}
   }
  }
 }
 if(failed){if(!rawFirstPresent){rawFirstPresent=true;rawFirst=first;}throw rawFirst;}
}
/** @param {Operation} work @param {string} code @returns {void} */
function refusal(work,code){
 let failed=false,first,actualCode=/** @type {string | null} */ (null);
 try{invoke(work.fn,work.args);}catch(caught){failed=true;first=caught;actualCode=exactRefusal(caught,code)?/** @type {string} */ (/** @type {import('./private-summary-tip081-p3.r3.d.ts').CheckedDescriptor} */ (cDescriptor(/** @type {object} */ (caught),'code')).value):null;}
 finally{work.args=null;work.fn=null;currentOperation=null;}
 if(failed&&actualCode!==code)throw first;cOk(failed&&actualCode===code,'exact named product refusal');
 emit('REFUSAL',activeRow,{__proto__:null,expectedCode:code,actualCode});
}
/** @param {Operation} work @param {string} code @returns {Promise<void>} */
async function asyncRefusal(work,code){
 let failed=false,first,actualCode=/** @type {string | null} */ (null);
 try{await invoke(work.fn,work.args);}catch(caught){failed=true;first=caught;actualCode=exactRefusal(caught,code)?/** @type {string} */ (/** @type {import('./private-summary-tip081-p3.r3.d.ts').CheckedDescriptor} */ (cDescriptor(/** @type {object} */ (caught),'code')).value):null;}
 finally{work.args=null;work.fn=null;currentOperation=null;}
 if(failed&&actualCode!==code)throw first;cOk(failed&&actualCode===code,'promise must reject exact named product refusal');
 emit('PROMISE_REFUSAL',activeRow,{__proto__:null,expectedCode:code,actualCode});
}
/** @param {Operation} work @returns {void} */
function toolReject(work){
 let failed=false,first,actualCode=false;
 try{invoke(work.fn,work.args);}catch(caught){failed=true;first=caught;
  actualCode=caught!==null&&typeof caught==='object'&&cDescriptor(caught,'code')?.value==='ERR_ASSERTION';}
 finally{work.args=null;work.fn=null;currentOperation=null;}
 if(failed&&!actualCode)throw first;cOk(failed&&actualCode,'exact TEST-TOOL assertion rejection');emit('TOOL_REJECT',activeRow,{__proto__:null,code:'ERR_ASSERTION'});
}
/** @param {unknown} handle @param {Readonly<SyntheticAPI> | null} domain @param {unknown} text @returns {Readonly<Metadata>} */
function metadata(handle,domain,text){
 const slot=slotFor(handle,domain);cOk(slot!==null&&slot.registered,'metadata requires current registered owner');
 const record=/** @type {Readonly<MetadataBaseline>} */ (baseline).read(handle,domain,text),previous=slot.lastMetadata,witnessValue=/** @type {Readonly<MetadataBaseline>} */ (baseline).witness(handle,domain);
 let reconciliation=null;
 if(previous!==null){cOk(record.totalBytes>=previous.totalBytes&&record.peakBytes>=previous.peakBytes,'total/peak never decrease or refund');
  cOk(record.attemptedNodes>=previous.attemptedNodes&&record.internalEntries>=previous.internalEntries,'attempt/entry counters monotone');}
 if(slot.witnessValue===null){slot.witnessValue=witnessValue;reconciliation=/** @type {Readonly<MetadataBaseline>} */ (baseline).reconcile(handle,domain,(domain===normal?/** @type {ReviewedContext} */ (reviewed).normal:/** @type {ReviewedContext} */ (reviewed).alias).toolBytes);
  cOk(reconciliation!==null&&witnessValue.initialBase===(domain===normal?/** @type {ReviewedContext} */ (reviewed).normal:/** @type {ReviewedContext} */ (reviewed).alias).toolBytes+1536+4*witnessValue.sourceUnits,'independent reviewed census comparison');
 }else cOk(slot.witnessValue===witnessValue,'immutable first witness identity');
 slot.lastMetadata=record;emit('METADATA',activeRow,record);return record;
}
/** @param {object} record @param {readonly string[]} expected @returns {void} */
function exactKeys(record,expected){const keys=cSetProto(cKeys(record),null);let index; cOk(keys.length===expected.length,'exact own-key cardinality');for(index=0;index<keys.length;index++)cOk(keys[index]===expected[index],'exact own-key order');}
/** @param {string} text @returns {string} */
function utf16Hash(text){
 let bytes=/** @type {Buffer | null} */ (null),index=0,hash=/** @type {Hash | null} */ (null),digest;
 cOk(typeof text==='string'&&text.length<=64,'fixed literal source hash bound');
 try{bytes=cAlloc(text.length*2);for(index=0;index<text.length;index++)cWriteLE(bytes,cChar(text,index),index*2);hash=cHash('sha256');cHashUpdate(hash,bytes);digest=cHashDigest(hash,'hex');return digest;}
 finally{bytes=null;hash=null;}
}
/** @param {Summary} s @returns {Summary} */
function seal(s){
 let ledger=/** @type {Partial<import('./private-summary-tip081-p3.r3.d.ts').Ledger> | null} */ ({__proto__:null}),sites=/** @type {import('./private-summary-tip081-p3.r3.d.ts').ScalarSite[] | null} */ (cSetProto(new cArray(s.sites.length),null)),row=/** @type {import('./private-summary-tip081-p3.r3.d.ts').ScalarSite | null} */ (null),index=0,body=/** @type {import('./private-summary-tip081-p3.r3.d.ts').SummaryBody | null} */ (null),bodyText=/** @type {string | null} */ (null),hash=/** @type {Hash | null} */ (null),digest=/** @type {string | null} */ (null),sealed=/** @type {Summary | null} */ (null);
 cOk(s.sites.length<=512,'bounded summary sites');
 try{
  for(index=0;index<14;index++)ledger[LEDGER_KEYS[index]]=s.ledger[LEDGER_KEYS[index]];
  for(index=0;index<s.sites.length;index++){row=s.sites[index];sites[index]={__proto__:null,kind:row.kind,start:row.start,end:row.end,binding:row.binding,
   loader:row.loader,conditional:row.conditional,optional:row.optional,computed:row.computed,status:row.status};}
  body=/** @type {import('./private-summary-tip081-p3.r3.d.ts').SummaryBody} */ ({__proto__:null,version:s.version,purpose:s.purpose,mode:s.mode,profile:s.profile,syntheticUtf16Hash:s.syntheticUtf16Hash,
   utf16Units:s.utf16Units,astOccurrences:s.astOccurrences,grammarAttempts:s.grammarAttempts,sites,ledger});
  bodyText=cStringify(body);cOk(bodyText.length<=16384,'normal scalar seal body bound');hash=cHash('sha256');cHashUpdate(hash,bodyText,'ascii');digest=cHashDigest(hash,'hex');
  sealed=/** @type {Summary} */ ({__proto__:null,version:body.version,purpose:body.purpose,mode:body.mode,profile:body.profile,syntheticUtf16Hash:body.syntheticUtf16Hash,
   utf16Units:body.utf16Units,astOccurrences:body.astOccurrences,grammarAttempts:body.grammarAttempts,sites,ledger,summaryHash:digest});return sealed;
 }finally{body=null;bodyText=null;hash=null;row=null;ledger=null;sites=null;}
}
/** @param {unknown} wire @returns {Summary} */
function readSummary(wire){
 cOk(typeof wire==='string'&&wire.length>0&&wire.length<=16384&&cUtf8(wire,'utf8')<=16384,'bounded primitive summary wire');
 let decoded=/** @type {unknown} */ (null),row=/** @type {unknown} */ (null),index=0,value=/** @type {unknown} */ (null),expectedSeal=/** @type {Summary | null} */ (null);
 for(index=0;index<wire.length;index++)cOk(cChar(wire,index)<=127,'summary wire ASCII');
 decoded=cParse(wire);cOk(decoded!==null&&typeof decoded==='object'&&!cIsArray(decoded),'summary root record');exactKeys(decoded,SUM_KEYS);
 cOk(/** @type {Record<string, unknown>} */ (decoded).ledger!==null&&typeof /** @type {Record<string, unknown>} */ (decoded).ledger==='object'&&!cIsArray(/** @type {Record<string, unknown>} */ (decoded).ledger),'ledger record');exactKeys(/** @type {object} */ (/** @type {Record<string, unknown>} */ (decoded).ledger),LEDGER_KEYS);
 cOk(cIsArray(/** @type {Record<string, unknown>} */ (decoded).sites)&&/** @type {unknown[]} */ (/** @type {Record<string, unknown>} */ (decoded).sites).length<=512,'bounded sites');
 for(index=0;index<14;index++){value=/** @type {Record<string, unknown>} */ (/** @type {Record<string, unknown>} */ (decoded).ledger)[LEDGER_KEYS[index]];cOk(driverInteger(value),'ledger numeric scalar');}
 for(index=0;index</** @type {unknown[]} */ (/** @type {Record<string, unknown>} */ (decoded).sites).length;index++){
  row=/** @type {unknown[]} */ (/** @type {Record<string, unknown>} */ (decoded).sites)[index];cOk(row!==null&&typeof row==='object'&&!cIsArray(row),'site record');exactKeys(row,SITE_KEYS);
  cOk(typeof /** @type {Record<string, unknown>} */ (row).kind==='string'&&driverInteger(/** @type {Record<string, unknown>} */ (row).start)&&driverInteger(/** @type {Record<string, unknown>} */ (row).end)&&typeof /** @type {Record<string, unknown>} */ (row).binding==='string'&&typeof /** @type {Record<string, unknown>} */ (row).loader==='string'&&
   typeof /** @type {Record<string, unknown>} */ (row).conditional==='string'&&typeof /** @type {Record<string, unknown>} */ (row).optional==='boolean'&&typeof /** @type {Record<string, unknown>} */ (row).computed==='boolean'&&/** @type {Record<string, unknown>} */ (row).status==='OPEN','site scalar schema');cSetProto(row,null);
 }
 cOk(/** @type {Record<string, unknown>} */ (decoded).version===1&&/** @type {Record<string, unknown>} */ (decoded).purpose==='TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY'&&
  (/** @type {Record<string, unknown>} */ (decoded).mode==='SCRIPT'||/** @type {Record<string, unknown>} */ (decoded).mode==='MODULE')&&/** @type {Record<string, unknown>} */ (decoded).profile==='P3_ECMA15_FIXED19_COMMON_GRAMMAR','summary fixed domain');
 cOk(typeof /** @type {Record<string, unknown>} */ (decoded).syntheticUtf16Hash==='string'&&/** @type {string} */ (/** @type {Record<string, unknown>} */ (decoded).syntheticUtf16Hash).length===64&&typeof /** @type {Record<string, unknown>} */ (decoded).summaryHash==='string'&&/** @type {string} */ (/** @type {Record<string, unknown>} */ (decoded).summaryHash).length===64,'digest scalars');
 cOk(driverInteger(/** @type {Record<string, unknown>} */ (decoded).utf16Units)&&driverInteger(/** @type {Record<string, unknown>} */ (decoded).astOccurrences)&&driverInteger(/** @type {Record<string, unknown>} */ (decoded).grammarAttempts),'summary counts');
 cSetProto(/** @type {object} */ (/** @type {Record<string, unknown>} */ (decoded).sites),null);cSetProto(/** @type {object} */ (/** @type {Record<string, unknown>} */ (decoded).ledger),null);cSetProto(decoded,null);
 cOk(cStringify(decoded)===wire,'summary exactly canonical after sanitization');cOk(/** @type {Record<string, unknown>} */ (/** @type {Record<string, unknown>} */ (decoded).ledger).siteCount===/** @type {unknown[]} */ (/** @type {Record<string, unknown>} */ (decoded).sites).length,'site count exact');
 expectedSeal=seal(/** @type {Summary} */ (decoded));cOk(/** @type {Record<string, unknown>} */ (decoded).summaryHash===expectedSeal.summaryHash,'independent ASCII body seal');expectedSeal=null;row=null;value=null;return /** @type {Summary} */ (decoded);
}
/** @param {string} text @param {Mode} mode @param {Readonly<Site>[]} expected @param {number} [occurrences] @returns {Summary} */
function positive(text,mode,expected,occurrences){
 let handle=/** @type {unknown} */ (null),wire=/** @type {string | null} */ (null),summary=/** @type {Summary | null} */ (null),metadataValue=/** @type {Readonly<Metadata> | null} */ (null),failed=false;
 try{handle=make(text,mode);wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);summary=readSummary(wire);cSetProto(expected,null);cFreeze(expected);
  cDeep(summary.sites,expected,'literal site vectors');cOk(summary.syntheticUtf16Hash===utf16Hash(text),'independent exact UTF16 identity');cOk(summary.utf16Units===text.length,'source length');
  if(occurrences!==undefined)cOk(summary.astOccurrences===occurrences,'literal reachable occurrences');
  /** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);metadataValue=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));
  cOk(metadataValue.phase==='VERIFIED'&&metadataValue.grammarPasses===2,'complete positive replay');
 }catch(first){failed=true;if(!rawFirstPresent){rawFirstPresent=true;rawFirst=first;}throw rawFirst;}
 finally{try{drop();}catch(cleanupCaught){if(!failed)throw cleanupCaught;}finally{wire=null;metadataValue=null;handle=null;}}
 return summary;
}
/** @param {Summary} s @param {string} label @returns {void} */
function mutateSummary(s,label){
 let row=/** @type {import('./private-summary-tip081-p3.r3.d.ts').ScalarSite | null} */ (null);
 if(label==='OMITTED'){s.sites=cSetProto([],null);s.ledger.siteCount=0;s.ledger.producerEntries-=2;}
 else if(label==='DUPLICATE'){row=s.sites[0];s.sites[s.sites.length]={__proto__:null,kind:row.kind,start:row.start,end:row.end,binding:row.binding,loader:row.loader,
  conditional:row.conditional,optional:row.optional,computed:row.computed,status:row.status};s.ledger.siteCount++;s.ledger.producerEntries+=2;}
 else if(label==='START')s.sites[0].start=1;else if(label==='END')s.sites[0].end=2;else if(label==='OUT_OF_SOURCE')s.sites[0].end=5;
 else if(label==='BINDING')s.sites[0].binding='AMBIGUOUS';else if(label==='LOADER')s.sites[0].loader='BARE_REQUIRE';
 else if(label==='CONDITIONAL')s.sites[0].conditional='CONTROL_OR_DEFERRED';else if(label==='OPTIONAL')s.sites[0].optional=true;else if(label==='COMPUTED')s.sites[0].computed=true;
 else if(label==='SOURCE')s.syntheticUtf16Hash=utf16Hash('g();');else if(label==='MODE')s.mode='MODULE';else if(label==='LENGTH')s.utf16Units++;
 else if(label==='OCCURRENCES')s.astOccurrences++;else if(label==='ATTEMPTS'){s.grammarAttempts++;s.ledger.producerAttempts++;}
 else if(label==='GROSS_SEAL')s.summaryHash=cRepeat('0',64);
 else if(label==='WRONG_PURPOSE'||label==='REAL_RECEIPT')s.purpose='TIP081_BOUNDED_SOURCE_CONSUMER_RECEIPT';
 else if(label==='TOTAL')s.ledger.totalBytes--;else if(label==='PEAK')s.ledger.peakBytes--;
 else if(label==='CATEGORY_SHIFT'){s.ledger.producerParseBytes--;s.ledger.producerWorkBytes++;}
 else if(label==='RETIREMENT'){s.ledger.unreclaimedProducerBytes++;s.ledger.producerParseBytes--;}
 else if(label==='REPLAY_ESCROW'){s.ledger.replayReservedBytes--;s.ledger.replayLiveBytes++;}
 else if(label==='COUNTERS')s.ledger.producerEntries--;else if(label==='REPLAY_ERROR')s.sites[0].loader='EVAL';
 else cOk(false,'closed summary mutation label');row=null;
}
/** @param {string} label @param {string} [code] @param {Readonly<SyntheticAPI> | null} [domain] @returns {void} */
function changed(label,code='REPLAY_MISMATCH',domain=normal){
 let handle=/** @type {unknown} */ (null),summary=/** @type {Summary | null} */ (null),wire=/** @type {string | null} */ (null),failed=false;
 try{handle=make('f();','SCRIPT',CAP,TTL,domain);summary=readSummary(/** @type {Readonly<SyntheticAPI>} */ (domain).analyzeSyntheticSummaryP3(handle));mutateSummary(summary,label);
  wire=cStringify(label==='GROSS_SEAL'?summary:seal(summary));/** @type {Readonly<SyntheticAPI>} */ (domain).retireProducerSummaryP3(handle);
  refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (domain).verifySyntheticSummaryP3,[handle,wire]),code);stale(handle,domain);emit('MUTATION',activeRow,{__proto__:null,label,incomingBytes:cUtf8(wire,'utf8')});
 }catch(first){failed=true;if(!rawFirstPresent){rawFirstPresent=true;rawFirst=first;}throw rawFirst;}
 finally{try{drop();}catch(cleanupCaught){if(!failed)throw cleanupCaught;}finally{handle=null;summary=null;wire=null;}}
}
/** @param {string} wire @param {string} label @returns {string} */
function mutateWire(wire,label){
 let result=wire;
 if(label==='DUPLICATE')result=cReplace(wire,'{"version":1,','{"version":1,"version":1,');
 else if(label==='EXTRA')result=cReplace(wire,'{"version":1,','{"version":1,"extra":0,');
 else if(label==='WHITESPACE')result=' '+wire;else if(label==='BOM')result='\ufeff'+wire;
 else if(label==='KEY_ORDER')result=cReplace(wire,'"version":1,"purpose":"TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY"','"purpose":"TIP081_P3_SYNTHETIC_SYNTAX_SUMMARY","version":1');
 else if(label==='UNSAFE_INTEGER')result=cReplace(wire,'"utf16Units":4','"utf16Units":9007199254740992');
 else if(label==='NEGATIVE_ZERO')result=cReplace(wire,'"start":0','"start":-0');else if(label==='FRACTION')result=cReplace(wire,'"start":0','"start":0.5');
 else if(label==='DEPTH')result='[[[[[[[[['+wire+']]]]]]]]]';else if(label==='ESCAPE')result=cReplace(wire,'"SCRIPT"','"SCRI\\u0050T"');
 else if(label==='PROFILE_FLAGS'){result=cReplace(wire,'"authority":"NOT_ISSUED"','"authority":"APPROVED"');result=cReplace(result,'"fullP3Accepted":false','"fullP3Accepted":true');result=cReplace(result,'"realParserDisabled":true','"realParserDisabled":false');}
 else if(label==='FORGED_FLAGS'){result=cReplace(wire,'"checks":"UNRUN"','"checks":"PASS"');result=cReplace(result,'"authority":"NOT_ISSUED"','"authority":"SOURCE_REVIEWED_SYNTHETIC_ONLY"');}
 else cOk(false,'closed wire mutation label');
 cOk(result!==wire,'literal mutation must change actual text');return result;
}
/** @param {string} path @returns {string} */
function readFixedText(path){
 let fd=/** @type {number | null} */ (null),stats=/** @type {fs.Stats | null} */ (null),bytes=/** @type {Buffer | null} */ (null),offset=0,count=0,text=/** @type {string | null} */ (null),failed=false,first;
 try{fd=cOpen(ROOT+path,READ_FLAGS);stats=cStat(fd);cOk(cStatIsFile(stats)&&driverInteger(stats.size)&&stats.size<=16777216,'bounded regular fixed file');
  bytes=cAlloc(stats.size);while(offset<stats.size){count=cRead(fd,bytes,offset,stats.size-offset,offset);cOk(driverInteger(count)&&count>0&&count<=stats.size-offset,'positive bounded read');offset+=count;}
  cOk(cStat(fd).size===stats.size,'fixed FD length stable');text=cDecode(decoder,bytes);cOk(cUtf8(text,'utf8')===stats.size,'strict UTF8 byte preservation');return text;
 }catch(readCaught){failed=true;first=readCaught;throw first;}
 finally{try{if(fd!==null)cClose(fd);}catch(closeCaught){if(!failed)throw closeCaught;}finally{bytes=null;stats=null;fd=null;}}
}
/** @param {number} selector @returns {string[]} */
function readTuple(selector){let paths=/** @type {readonly string[] | null} */ (null),index=0,tuple=/** @type {string[] | null} */ (null);cOk(driverInteger(selector)&&selector<6,'closed tuple selector');paths=TUPLE_PATHS[selector];tuple=cSetProto(new cArray(3),null);for(index=0;index<3;index++)tuple[index]=readFixedText(paths[index]);return tuple;}
/** @param {string} phase @param {number} rowIndex @param {unknown} data @returns {void} */
function emit(phase,rowIndex,data){
 let record={__proto__:null,sequence:journalSequence+1,phase,rowIndex,data},text=cStringify(record)+'\n',bytes=null,offset=0,count=0;
 cOk(journalFD!==null&&journalSequence<1024&&text.length<=4096,'bounded live journal');bytes=cFrom(text,'utf8');cOk(bytes.length<=4096&&bytes.length<=1048576-journalBytes,'raw journal envelope');
 while(offset<bytes.length){count=cWrite(journalFD,bytes,offset,bytes.length-offset,null);cOk(driverInteger(count)&&count>0&&count<=bytes.length-offset,'positive journal write');offset+=count;}
 journalSequence++;journalBytes+=bytes.length;record=null;text=null;bytes=null;
}
/** @param {string} suffix @returns {void} */
function beginRow(suffix){let index=groups[activeGroup].firstRow,row=/** @type {EvidenceRow | null} */ (null);for(;index<groups[activeGroup].firstRow+groups[activeGroup].rowCount;index++)if(rows[index].id===groups[activeGroup].id+'.'+suffix){row=rows[index];break;}cOk(row!==null&&row.status==='UNRUN','fixed row exactly once');row.status='RUNNING';activeRow=index;}
/** @param {number} groupIndex @returns {void} */
function endGroup(groupIndex){let index=groups[groupIndex].firstRow,row=/** @type {EvidenceRow | null} */ (null);for(;index<groups[groupIndex].firstRow+groups[groupIndex].rowCount;index++){row=rows[index];cOk(row.status==='RUNNING','all group rows traversed');}
 emit('GROUP_COMPLETE',-1,{__proto__:null,group:groups[groupIndex].id,rowCount:groups[groupIndex].rowCount});
 for(index=groups[groupIndex].firstRow;index<groups[groupIndex].firstRow+groups[groupIndex].rowCount;index++){row=rows[index];row.status=row.lane==='COMPOSITION_SOURCE'?'SOURCE_REVIEWED':'PASS';}groups[groupIndex].status='COMPLETE';activeRow=-1;}
/** @returns {void} */
function ensureKernel(){
 let text=/** @type {string | null} */ (null),index=0,firstSequence=0,lastSequence=0;
 cOk(!kernelChecked&&!kernelArityDenied,'one kernel sequence');exactKeys(/** @type {Readonly<KernelAPI>} */ (kernel),cSetProto(['runFixedBoundaryCasesP3'],null));cOk(/** @type {Readonly<KernelAPI>} */ (kernel).runFixedBoundaryCasesP3.length===0,'sole zeroarity kernel');
 refusal(operation(/** @type {Readonly<KernelAPI>} */ (kernel).runFixedBoundaryCasesP3,[1]),'ALLOCATION_COVERAGE_OPEN');kernelArityDenied=true;
 try{text=/** @type {Readonly<KernelAPI>} */ (kernel).runFixedBoundaryCasesP3();cOk(typeof text==='string'&&text.length>0&&text.length<=16384&&cUtf8(text,'utf8')<=16384,'kernel bounded primitive');
  for(index=0;index<text.length;index++)cOk(cChar(text,index)<=127,'kernel ASCII');firstSequence=journalSequence+1;
  for(index=0;index<text.length;index+=512)emit('KERNEL_RAW',activeRow,{__proto__:null,runId:'R3_FIXED20',offset:index,length:text.length,payload:cBase64(cFrom(cSlice(text,index,index+512),'ascii'),'base64')});
  lastSequence=journalSequence;cOk(/** @type {Readonly<BoundaryExpectations>} */ (core).check(text)===true,'independent full kernel observation check');kernelFirst=firstSequence;kernelLast=lastSequence;kernelChecked=true;
 }finally{text=null;}
}
/** @param {UnitResult} report @returns {void} */
function writeResult(report){
 let text=/** @type {string | null} */ (null),bytes=/** @type {Buffer | null} */ (null),offset=0,count=0;
 try{text=cStringify(report);cOk(text.length<=131072,'terminal JSON bound');bytes=cFrom(text,'utf8');cOk(bytes.length<=131072&&bytes.length<=1048576-journalBytes,'combined journal/result envelope');
  cOk(journalFD===null,'raw journal closed before result');journalFD=cOpen(RESULT_PATH,WRITE_FLAGS,0o600);
  while(offset<bytes.length){count=cWrite(journalFD,bytes,offset,bytes.length-offset,null);cOk(driverInteger(count)&&count>0&&count<=bytes.length-offset,'positive terminal write');offset+=count;}journalBytes+=bytes.length;
 }catch(outputCaught){if(!rawFirstPresent){rawFirstPresent=true;rawFirst=outputCaught;}throw rawFirst;}
 finally{text=null;bytes=null;}
}
/** @returns {void} */
function closeJournal(){let failed=false,first;try{if(journalFD!==null)cClose(journalFD);}catch(caught){failed=true;first=caught;}finally{journalFD=null;}if(failed){if(!rawFirstPresent){rawFirstPresent=true;rawFirst=first;}throw rawFirst;}}

/** @returns {never} */
function foreignPhaseGetter(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function foreignValueOf(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function proxyGet(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function proxyOwnKeys(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function parserGetter(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function foreignToString(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function foreignFunction(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function candidateGetter(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function candidateToString(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {never} */
function candidateFunction(){touchCount++;throw new cError('FOREIGN_CALLED');}
/** @returns {number} */
function zeroNow(){return 0;}

/** @returns {void} */
function runP301(){
 beginRow('SEQUENCE');const handle=make('f();');cOk(cIsFrozen(handle),'opaque frozen handle');cDeep(cSetProto(cSymbols(handle),null),cSetProto([],null));
 cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).phase==='SOURCE_READY');
 const wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);cDeep(readSummary(wire).sites,cSetProto([site('CALL',0,3,'NO_LOCAL_BINDING','OTHER')],null));
 cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).phase==='PRODUCER_SUMMARY');
 cOk(typeof /** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle)==='string');cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).phase==='PRODUCER_AST_RETIRED');
 cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire)).phase==='VERIFIED');/** @type {Readonly<SyntheticAPI>} */ (normal).retireSyntheticSummaryP3(handle);stale(handle,normal);
}
/** @returns {void} */
function runP302(){
 const handle=make('f();');let other=null;touchCount=0;
 const expected=/** @type {[{valueOf: () => never}, object, object, null, string, number]} */ (cSetProto([{valueOf:foreignValueOf},new cProxy({},{get:proxyGet,ownKeys:proxyOwnKeys}),{},null,'handle',1],null));
 // Accessor bodies are the prepriced callbacks, installed without anonymous wrappers.
 cDefine(expected[0],'phase',{get:foreignPhaseGetter,enumerable:true,configurable:true});
 for(let index=0;index<6;index++){beginRow(REGISTRY[1][index]);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3,[expected[index]]),'AUTHORITY_REFUSED');}
 cOk(touchCount===0,'foreign callbacks untouched');cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).phase==='SOURCE_READY');
 beginRow('FOREIGN_ALIAS_HANDLE');other=foreignAlias();refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,[other]),'AUTHORITY_REFUSED');/** @type {Readonly<SyntheticAPI>} */ (alias).retireSyntheticSummaryP3(other);
}
/** @returns {Promise<void>} */
async function runP303(){
 beginRow('RETIRED');let handle=make('');/** @type {Readonly<SyntheticAPI>} */ (normal).retireSyntheticSummaryP3(handle);stale(handle,normal);drop();
 beginRow('EXPIRY');handle=make('','SCRIPT',CAP,25);const start=cNow();await delay(40);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,[handle]),'TIME_REFUSED');stale(handle,normal);
 emit('TIMING',activeRow,{__proto__:null,elapsed:cNow()-start,ttl:25});
}
/** @returns {void} */
function runP304(){
 touchCount=0;const expected={__proto__:null,toString:foreignToString};cDefine(expected,'parser',{get:parserGetter,enumerable:true});
 beginRow('CREATE_EXTRA');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).createSyntheticSummaryP3,['','SCRIPT',CAP,TTL,expected]),'AUTHORITY_REFUSED');
 beginRow('CREATE_GETTER');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).createSyntheticSummaryP3,[expected,'SCRIPT',CAP,TTL]),'SCHEMA_REFUSED');
 beginRow('CREATE_FUNCTION');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).createSyntheticSummaryP3,[foreignFunction,'SCRIPT',CAP,TTL]),'SCHEMA_REFUSED');
 const handle=make('f();'),actual=cSetProto([/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3,/** @type {Readonly<SyntheticAPI>} */ (normal).retireSyntheticSummaryP3],null);
 for(let index=0;index<4;index++){beginRow(REGISTRY[3][3+index*2]);refusal(operation(actual[index],[handle,expected]),'AUTHORITY_REFUSED');beginRow(REGISTRY[3][4+index*2]);refusal(operation(actual[index],[]),'AUTHORITY_REFUSED');}
 beginRow('VERIFY_EXTRA');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,'',expected]),'AUTHORITY_REFUSED');cOk(touchCount===0);cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).phase==='SOURCE_READY');
}
/** @returns {void} */
function runP305(){
 beginRow('IMPORT');positive('import x from "m";','MODULE',[site('IMPORT',0,17,'NONE','STATIC_LITERAL')]);
 beginRow('EXPORT_NAMED');positive('const x=1;export {x};','MODULE',[site('EXPORT',10,21)],9);
 beginRow('EXPORT_DEFAULT');positive('export default 1;','MODULE',[site('EXPORT',0,17)],3);
 beginRow('EXPORT_ALL');positive('export * from "m";','MODULE',[site('EXPORT',0,18,'NONE','STATIC_LITERAL')]);
 beginRow('DYNAMIC_LITERAL');positive('import("m");','SCRIPT',[site('DYNAMIC_IMPORT',0,11,'NONE','STATIC_LITERAL')]);
 beginRow('REQUIRE');positive('require("x");','SCRIPT',[site('CALL',0,12,'NO_LOCAL_BINDING','BARE_REQUIRE')],5);
 beginRow('MEMBER_CALL');positive('obj.run();','SCRIPT',[site('MEMBER',0,7,'NO_LOCAL_BINDING','OTHER'),site('CALL',0,9,'NONE','OTHER')],6);
 beginRow('NEW_FUNCTION');positive('new Function("x");','SCRIPT',[site('NEW',0,17,'NO_LOCAL_BINDING','FUNCTION')]);
 beginRow('EVAL');positive('eval("x");','SCRIPT',[site('CALL',0,9,'NO_LOCAL_BINDING','EVAL')]);
 beginRow('SHORTHAND');positive('const o={x};','SCRIPT',[],8);
}
/** @returns {void} */
function runP306(){
 beginRow('DYNAMIC');positive('import(x);','SCRIPT',[site('DYNAMIC_IMPORT',0,9,'NONE','DYNAMIC')]);
 beginRow('PARAMETER');positive('function f(require){require("x");}require("x");','SCRIPT',[site('CALL',20,32,'AMBIGUOUS','BARE_REQUIRE','CONTROL_OR_DEFERRED'),site('CALL',34,46,'AMBIGUOUS','BARE_REQUIRE')]);
 beginRow('VAR');positive('var require;require("x");','SCRIPT',[site('CALL',12,24,'AMBIGUOUS','BARE_REQUIRE')]);
 beginRow('LET');positive('let require;require("x");','SCRIPT',[site('CALL',12,24,'AMBIGUOUS','BARE_REQUIRE')]);
 beginRow('CONST');positive('const require=x;require("x");','SCRIPT',[site('CALL',16,28,'AMBIGUOUS','BARE_REQUIRE')]);
 beginRow('FUNCTION_BINDING');positive('function require(){}require("x");','SCRIPT',[site('CALL',20,32,'AMBIGUOUS','BARE_REQUIRE')]);
 beginRow('IMPORT_BINDING');positive('import require from "m";require("x");','MODULE',[site('IMPORT',0,24,'NONE','STATIC_LITERAL'),site('CALL',24,36,'AMBIGUOUS','BARE_REQUIRE')]);
 beginRow('DESTRUCTURING');positive('const {require:r}=x;r();','SCRIPT',[site('CALL',20,23,'AMBIGUOUS','OTHER')]);
 beginRow('PARAM_PATTERN');positive('function f({r}){r();}','SCRIPT',[site('CALL',16,19,'AMBIGUOUS','OTHER','CONTROL_OR_DEFERRED')]);
 beginRow('CATCH');positive('try{f();}catch(e){e();}','SCRIPT',[site('CALL',4,7,'NO_LOCAL_BINDING','OTHER','CONTROL_OR_DEFERRED'),site('CALL',18,21,'AMBIGUOUS','OTHER','CONTROL_OR_DEFERRED')]);
 beginRow('IF');positive('if(x){require("m");}','SCRIPT',[site('CALL',6,18,'NO_LOCAL_BINDING','BARE_REQUIRE','CONTROL_OR_DEFERRED')]);
 beginRow('LOGICAL');positive('x&&require("m");','SCRIPT',[site('CALL',3,15,'NO_LOCAL_BINDING','BARE_REQUIRE','CONTROL_OR_DEFERRED')]);
 beginRow('TERNARY');positive('x?require("m"):f();','SCRIPT',[site('CALL',2,14,'NO_LOCAL_BINDING','BARE_REQUIRE','CONTROL_OR_DEFERRED'),site('CALL',15,18,'NO_LOCAL_BINDING','OTHER','CONTROL_OR_DEFERRED')]);
 beginRow('WHILE');positive('while(x){f();}','SCRIPT',[site('CALL',9,12,'NO_LOCAL_BINDING','OTHER','CONTROL_OR_DEFERRED')]);
 beginRow('CLASS_METHOD');positive('class C{m(){f();}}','SCRIPT',[site('CALL',12,15,'NO_LOCAL_BINDING','OTHER','CONTROL_OR_DEFERRED')]);
 beginRow('CLASS_FUNCTION');positive('class Function{};new Function("x");','SCRIPT',[site('NEW',17,34,'AMBIGUOUS','FUNCTION')]);
 beginRow('OPTIONAL');positive('obj?.run?.();','SCRIPT',[site('MEMBER',0,8,'NO_LOCAL_BINDING','OTHER','OPTIONAL',true),site('CALL',0,12,'NONE','OTHER','OPTIONAL',true)]);
 beginRow('COMPUTED');positive('obj["x"]();','SCRIPT',[site('MEMBER',0,8,'NO_LOCAL_BINDING','COMPUTED','CERTAIN',false,true),site('CALL',0,10,'NONE','COMPUTED','CERTAIN',false,true)]);
}
/** @returns {void} */
function runP307(){
 beginRow('EMOJI');const record=positive('"😀";','SCRIPT',[],3);cOk(record.utf16Units===5);
 const source='"\ud800";',expected='"\ufffd";';cOk(cEquals(cFrom(source),cFrom(expected)),'UTF8 replacement collision retained');
 beginRow('LONE_SURROGATE');const before=positive(source,'SCRIPT',[],3);beginRow('REPLACEMENT');const after=positive(expected,'SCRIPT',[],3);
 cOk(before.syntheticUtf16Hash!==after.syntheticUtf16Hash);cOk(before.syntheticUtf16Hash===utf16Hash(source)&&after.syntheticUtf16Hash===utf16Hash(expected));
}
/** @returns {void} */
function runP308(){
 let handle=/** @type {unknown} */ (null),wire=/** @type {string | null} */ (null),index=0;
 for(index=0;index<10;index++){beginRow(REGISTRY[7][index]);handle=make('f();');wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);
  refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,mutateWire(wire,REGISTRY[7][index])]),'SUMMARY_REFUSED');stale(handle,normal);drop();wire=null;handle=null;}
 beginRow('WRONG_PURPOSE');changed('WRONG_PURPOSE','SUMMARY_REFUSED');
}
/** @returns {void} */
function runP309(){
 beginRow('ADDITIVE');let handle=make('f();'),before=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);
 let summary=readSummary(wire),after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));cOk(before.grammarPasses===0&&after.grammarPasses===1);
 /** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);let record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));cOk(record.totalBytes===after.totalBytes);
 after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));cOk(after.grammarPasses===2&&after.totalBytes===record.totalBytes&&after.unreclaimedProducerBytes>0&&after.unreclaimedReplayBytes>0&&after.replayLiveBytes===0);drop();
 beginRow('BASELINE_WITNESS');handle=make('f();');let witnessValue=/** @type {Readonly<MetadataBaseline>} */ (baseline).witness(handle,normal);before=/** @type {Readonly<Metadata>} */ (slots[0].lastMetadata);
 cOk(cIsFrozen(witnessValue)&&witnessValue.initialBase===/** @type {ReviewedContext} */ (reviewed).normal.toolBytes+1552&&witnessValue.provenance==='COMMON_MODE_INITIAL_OBSERVATION_NOT_INDEPENDENT_T');
 toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).register,[handle,normal,4,'SCRIPT',CAP,TTL]));toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).read,[handle,alias,cStringify(before)]));toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).witness,[handle,alias]));toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).read,[handle,normal,cStringify(before)]));
 wire=/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle);
 for(let index=0;index<8;index++){
  let expected=cSetProto(/** @type {Record<string, unknown>} */ (cParse(wire)),null),actual=/** @type {string | null} */ (null);
  if(index===0)cRemove(expected,'summaryBytes');else if(index===1)expected.extra=0;
  else if(index===3)expected.summaryBytes='25728';else if(index===5)expected.metadataEmissions=9007199254740992;
  else if(index===6)expected.mode='MODULE';else if(index===7){cOk(/** @type {number} */ (expected.totalBytes)<CAP,'sum mutation remains inside all cap/schema bounds');/** @type {number} */ (expected.totalBytes)++;/** @type {number} */ (expected.peakBytes)++;}
  actual=index===2?cReplace(wire,'{"version":1,','{"version":1,"version":1,'):index===4?cReplace(wire,'"producerParseBytes":0','"producerParseBytes":-0'):cStringify(expected);
  toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).read,[handle,normal,actual]));cOk(/** @type {Readonly<MetadataBaseline>} */ (baseline).witness(handle,normal)===witnessValue,'failed-M2 atomic witness');expected=null;actual=null;
 }
 record=metadata(handle,normal,wire);cOk(record.summaryBytes===25728&&record.scratchBytes===6732568&&/** @type {Readonly<MetadataBaseline>} */ (baseline).witness(handle,normal)===witnessValue);
 wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);summary=readSummary(wire);cDeep(summary.sites,cSetProto([site('CALL',0,3,'NO_LOCAL_BINDING','OTHER')],null));cOk(summary.astOccurrences===4&&summary.ledger.summaryBytes===116384&&summary.ledger.scratchBytes===6641912);
 after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));
 cOk(record.unreclaimedProducerBytes===summary.ledger.producerParseBytes+summary.ledger.producerWorkBytes&&record.totalBytes===after.totalBytes);
 after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));cOk(after.phase==='VERIFIED'&&after.grammarPasses===2&&after.replayLiveBytes===0&&after.unreclaimedReplayBytes>0&&/** @type {Readonly<MetadataBaseline>} */ (baseline).witness(handle,normal)===witnessValue);
 cOk(after.totalBytes===witnessValue.initialBase+after.producerParseBytes+after.producerWorkBytes+after.summaryBytes+after.replayReservedBytes+after.replayLiveBytes+after.scratchBytes+after.unreclaimedProducerBytes+after.unreclaimedReplayBytes&&after.peakBytes===after.totalBytes);toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).forget,[handle,alias]));/** @type {Readonly<SyntheticAPI>} */ (normal).retireSyntheticSummaryP3(handle);stale(handle,normal);
 cOk(/** @type {Readonly<MetadataBaseline>} */ (baseline).forget(handle,normal)===true);slots[0].registered=false;cOk(/** @type {Readonly<MetadataBaseline>} */ (baseline).forget(handle,normal)===false);
 toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).register,[handle,normal,4,'SCRIPT',CAP,TTL]));toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).witness,[handle,normal]));
 toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).read,[handle,normal,cStringify(after)]));toolReject(operation(/** @type {Readonly<MetadataBaseline>} */ (baseline).reconcile,[handle,normal,/** @type {ReviewedContext} */ (reviewed).normal.toolBytes]));
}
/** @returns {void} */
function runP310(){beginRow('PREMATURE');let handle=make('f();');const wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).grammarPasses===1);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,wire]),'PHASE_REFUSED');stale(handle,normal);drop();handle=make('');cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).grammarPasses===0);}
/** @returns {void} */
function runP311(){beginRow('ALIAS');const handle=make('f();','SCRIPT',CAP,TTL,alias),wire=/** @type {Readonly<SyntheticAPI>} */ (alias).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (alias).retireProducerSummaryP3(handle);const record=metadata(handle,alias,/** @type {Readonly<SyntheticAPI>} */ (alias).observeSyntheticSummaryP3(handle));cOk(record.phase==='PRODUCER_AST_RETIRED'&&record.grammarPasses===1);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (alias).verifySyntheticSummaryP3,[handle,wire]),'ALIAS_REFUSED');stale(handle,alias);}
/** @returns {void} */
function runP312(){beginRow('RETIRE_TRANSFER');const handle=make('f();'),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle),summary=readSummary(wire),before=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);const after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));cOk(after.totalBytes===before.totalBytes&&after.peakBytes===before.peakBytes&&after.unreclaimedProducerBytes===summary.ledger.producerParseBytes+summary.ledger.producerWorkBytes&&after.producerParseBytes===0&&after.producerWorkBytes===0&&after.attemptedNodes===before.attemptedNodes&&after.internalEntries===before.internalEntries);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3,[handle]),'PHASE_REFUSED');stale(handle,normal);}
/** @returns {void} */
function runP313(){beginRow('REPLAY_RETIRE');const handle=make('f();'),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);const record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));cOk(record.replayLiveBytes===0&&record.unreclaimedReplayBytes>0);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,wire]),'PHASE_REFUSED');stale(handle,normal);}
/** @returns {void} */
function runP314(){beginRow('OMITTED');changed('OMITTED');}
/** @returns {void} */
function runP315(){beginRow('DUPLICATE');changed('DUPLICATE');}
/** @returns {void} */
function runP316(){for(let index=0;index<3;index++){beginRow(REGISTRY[15][index]);changed(REGISTRY[15][index]);}}
/** @returns {void} */
function runP317(){for(let index=0;index<5;index++){beginRow(REGISTRY[16][index]);changed(REGISTRY[16][index]);}}
/** @returns {void} */
function runP318(){for(let index=0;index<6;index++){beginRow(REGISTRY[17][index]);changed(REGISTRY[17][index]);}}
/** @returns {void} */
function runP319(){
 beginRow('A_NORMAL');positive('f();','SCRIPT',[site('CALL',0,3,'NO_LOCAL_BINDING','OTHER')],4);
 for(let index=0;index<2;index++){beginRow(REGISTRY[18][index+1]);const handle=make('f();'),wire=/** @type {Readonly<BoundaryExpectations>} */ (core).wire(index);cOk(wire.length===16384+index);/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,wire]),index===0?'REPLAY_MISMATCH':'SUMMARY_REFUSED');stale(handle,normal);drop();}
 beginRow('C16384');ensureKernel();emit('COMPONENT_LINK',activeRow,{__proto__:null,caseIndex:0,firstSequence:kernelFirst,lastSequence:kernelLast});
 beginRow('C16385');emit('COMPONENT_LINK',activeRow,{__proto__:null,caseIndex:1,firstSequence:kernelFirst,lastSequence:kernelLast});
 beginRow('C_SOURCE');cOk(/** @type {ReviewedContext} */ (reviewed).composition[0].caseId==='P319.C_SOURCE'&&/** @type {ReviewedContext} */ (reviewed).composition[0].status==='SOURCE_REVIEWED');emit('SOURCE_RECEIPT',activeRow,/** @type {ReviewedContext} */ (reviewed).composition[0]);
}
/** @returns {void} */
function runP320(){
 beginRow('CAP_REFERENCE');let handle=make('f();'),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);let record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));const cap=record.totalBytes;drop();
 beginRow('CAP_EXACT');handle=make('f();','SCRIPT',cap);wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire)).totalBytes===cap);drop();
 beginRow('CAP_MINUS_ONE');handle=make('f();','SCRIPT',cap-1);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3,[handle]),'CAP_REFUSED');stale(handle,normal);drop();
 handle=makeUnobserved('');for(let index=0;index<32;index++){beginRow(REGISTRY[19][index+3]);record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));cOk(record.metadataEmissions===index+1&&record.summaryBytes===12864*(index+1)&&record.scratchBytes===6758296-12864*(index+1));}
 beginRow('META33_REFUSED');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,[handle]),'VERIFY_RESOURCE_REFUSED');stale(handle,normal);emit('CAP_BOUNDARY',activeRow,{__proto__:null,exact:cap,minusOne:cap-1});
}
/** @returns {void} */
function runP321(){
 beginRow('A_NORMAL');const summary=positive('!!!f()()()()()()()();','SCRIPT',[
 site('CALL',3,6,'NO_LOCAL_BINDING','OTHER'),site('CALL',3,8,'NONE','OTHER'),site('CALL',3,10,'NONE','OTHER'),site('CALL',3,12,'NONE','OTHER'),
 site('CALL',3,14,'NONE','OTHER'),site('CALL',3,16,'NONE','OTHER'),site('CALL',3,18,'NONE','OTHER'),site('CALL',3,20,'NONE','OTHER')],14);
 cOk(summary.grammarAttempts===14&&summary.utf16Units===21);cOk(kernelChecked,'shared kernel must already be checked');
 for(let index=1;index<=8;index++){beginRow(REGISTRY[20][index]);emit('COMPONENT_LINK',activeRow,{__proto__:null,caseIndex:index+1,firstSequence:kernelFirst,lastSequence:kernelLast});}
 for(let index=9;index<11;index++){beginRow(REGISTRY[20][index]);cOk(/** @type {ReviewedContext} */ (reviewed).composition[index-8].caseId==='P321.'+REGISTRY[20][index]&&/** @type {ReviewedContext} */ (reviewed).composition[index-8].status==='SOURCE_REVIEWED');emit('SOURCE_RECEIPT',activeRow,/** @type {ReviewedContext} */ (reviewed).composition[index-8]);}
}
/** @returns {void} */
function runP322(){
 beginRow('A_MONOTONE');const handle=make('f();'),before=/** @type {Readonly<Metadata>} */ (slots[0].lastMetadata),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle),summary=readSummary(wire);
 let after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));cOk(before.internalEntries===257&&before.attemptedNodes===0&&before.grammarPasses===0);
 cOk(summary.astOccurrences===4&&summary.grammarAttempts===4&&summary.ledger.producerAttempts===4&&summary.ledger.siteCount===1&&summary.ledger.producerEntries===1240&&after.internalEntries===1240&&after.attemptedNodes===4&&after.grammarPasses===1);
 /** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);const record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));cOk(record.internalEntries===after.internalEntries&&record.attemptedNodes===after.attemptedNodes&&record.grammarPasses===1);
 after=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));cOk(after.internalEntries===2521&&after.attemptedNodes===8&&after.grammarPasses===2&&after.internalEntries>summary.ledger.producerEntries);drop();
 cOk(kernelChecked);for(let index=1;index<=10;index++){beginRow(REGISTRY[21][index]);emit('COMPONENT_LINK',activeRow,{__proto__:null,caseIndex:index+9,firstSequence:kernelFirst,lastSequence:kernelLast});}
 beginRow('C_COUNTER_CALLS');cOk(/** @type {ReviewedContext} */ (reviewed).composition[3].caseId==='P322.C_COUNTER_CALLS'&&/** @type {ReviewedContext} */ (reviewed).composition[3].status==='SOURCE_REVIEWED');emit('SOURCE_RECEIPT',activeRow,/** @type {ReviewedContext} */ (reviewed).composition[3]);
}
/** @returns {void} */
function runP323(){for(let index=0;index<6;index++){beginRow(REGISTRY[22][index]);changed(REGISTRY[22][index]);}}
/** @returns {Promise<void>} */
async function runP324(){beginRow('ORIGINAL_TTL');const handle=make('','SCRIPT',CAP,1000),start=cNow();await delay(600);const before=cNow()-start;cOk(before<1000);metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));await delay(600);const last=cNow()-start;cOk(last>=1000);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,[handle]),'TIME_REFUSED');const post=cNow()-start;cOk(post>=last);emit('TIMING',activeRow,{__proto__:null,first:before,last,post,ttl:1000});stale(handle,normal);}
/** @returns {Promise<void>} */
async function runP325(){beginRow('NO_REPLAY_RENEWAL');const handle=make('f();','SCRIPT',CAP,1000),start=cNow(),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);await delay(1100);const before=cNow()-start;cOk(before>=1000);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,wire]),'TIME_REFUSED');const post=cNow()-start;cOk(post>=before);emit('TIMING',activeRow,{__proto__:null,before,post,ttl:1000});stale(handle,normal);}
/** @returns {Promise<void>} */
async function runP326(){beginRow('CAPTURED_CLOCK');const descriptor=cDescriptor(performance,'now'),handle=make('','SCRIPT',CAP,25),start=cNow();
 try{cDefine(performance,'now',{configurable:true,value:zeroNow});await delay(40);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,[handle]),'TIME_REFUSED');stale(handle,normal);emit('TIMING',activeRow,{__proto__:null,elapsed:cNow()-start,ttl:25});}
 catch(caught){if(!rawFirstPresent){rawFirstPresent=true;rawFirst=caught;}throw rawFirst;}
 finally{try{if(descriptor)cDefine(performance,'now',descriptor);else cRemove(performance,'now');}catch(caught){if(!rawFirstPresent){rawFirstPresent=true;rawFirst=caught;}throw rawFirst;}}
}
/** @returns {void} */
function runP327(){beginRow('SYNTAX');let handle=make('let =');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3,[handle]),'SYNTAX_REFUSED');stale(handle,normal);drop();beginRow('META_EXHAUSTION');handle=makeUnobserved('');for(let index=0;index<32;index++)metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle));refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3,[handle]),'VERIFY_RESOURCE_REFUSED');stale(handle,normal);drop();beginRow('REPLAY_ERROR');changed('REPLAY_ERROR');beginRow('FRESH');handle=make('');cOk(metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).observeSyntheticSummaryP3(handle)).phase==='SOURCE_READY');}
/** @returns {Promise<void>} */
async function runP328(){const tuple=readTuple(0);beginRow('EXACT_TUPLE');cOk(checkArtifact(/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===true);beginRow('CANDIDATE_SUFFIX');cOk(checkArtifact(/** @type {string[]} */ (tuple)[0]+' ',/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);beginRow('LOADER_EXTRA_PROMISE');await asyncRefusal(operation(loadAdmittedSyntheticSummaryP3,['file:///tmp/caller-parser.mjs']),'ALLOCATION_COVERAGE_OPEN');beginRow('SIX_EXPORTS');exactKeys(/** @type {Readonly<SyntheticAPI>} */ (normal),API_KEYS);}
/** @returns {void} */
function runP329(){
 beginRow('REAL_GUARD_REMOVAL');const tuple=readTuple(0),source='__HIVE_P2_reserveArray(2, -1);',index=cIndexOf(/** @type {string[]} */ (tuple)[0],source);cOk(index>=0&&cIndexOf(/** @type {string[]} */ (tuple)[0],source,index+source.length)===-1,'one actual fixed guard');const expected=cReplace(/** @type {string[]} */ (tuple)[0],source,'/* P3 actual fixed guard removed */');cOk(expected!==/** @type {string[]} */ (tuple)[0]&&checkArtifact(expected,/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);emit('GUARD_REMOVAL',activeRow,{__proto__:null,removed:source,modifiedSourceImported:false});
 beginRow('NORMAL_NO_KERNEL_SWITCH');cOk(cDescriptor(/** @type {Readonly<SyntheticAPI>} */ (normal),'runFixedBoundaryCasesP3')===undefined&&cDescriptor(/** @type {Readonly<SyntheticAPI>} */ (normal),'factory')===undefined&&cDescriptor(/** @type {Readonly<SyntheticAPI>} */ (normal),'seed')===undefined&&cDescriptor(/** @type {Readonly<SyntheticAPI>} */ (normal),'fault')===undefined);
 cOk(kernelChecked&&kernelArityDenied);exactKeys(/** @type {Readonly<KernelAPI>} */ (kernel),cSetProto(['runFixedBoundaryCasesP3'],null));cOk(/** @type {Readonly<KernelAPI>} */ (kernel).runFixedBoundaryCasesP3.length===0);refusal(operation(/** @type {Readonly<KernelAPI>} */ (kernel).runFixedBoundaryCasesP3,[]),'ALLOCATION_COVERAGE_OPEN');
}
/** @returns {void} */
function runP330(){
 const tuple=readTuple(0);touchCount=0;beginRow('INVENTORY_SUFFIX');cOk(checkArtifact(/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1]+' ',/** @type {string[]} */ (tuple)[2])===false);beginRow('PROFILE_SUFFIX');cOk(checkArtifact(/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2]+' ')===false);
 beginRow('PROFILE_FLAGS');cOk(checkArtifact(/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1],mutateWire(/** @type {string[]} */ (tuple)[2],'PROFILE_FLAGS'))===false);
 beginRow('CANDIDATE_OBJECT');cOk(checkArtifact({__proto__:null,candidateHash:'approved'},/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);
 beginRow('ARITY_TWO');cOk(invoke(verifySyntheticSummaryArtifactP3,cSetProto([/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1]],null))===false);
 beginRow('ARITY_FOUR');cOk(invoke(verifySyntheticSummaryArtifactP3,cSetProto([/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2],'APPROVED'],null))===false);
 const expected={__proto__:null,toString:candidateToString};cDefine(expected,'candidate',{get:candidateGetter,enumerable:true});
 beginRow('GETTER_OBJECT');cOk(checkArtifact(expected,/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);beginRow('FUNCTION');cOk(checkArtifact(candidateFunction,/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);
 beginRow('BOXED_STRING');cOk(checkArtifact(cBoxedObject(/** @type {string[]} */ (tuple)[0]),/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);cOk(touchCount===0,'candidate getter/coercion untouched');
}
/** @returns {void} */
function runP331(){
 let tuple=/** @type {string[] | null} */ (readTuple(0)),other=/** @type {string | string[] | null} */ (readFixedText(TUPLE_PATHS[1][0]));beginRow('ALIAS_CANDIDATE_MIXED');cOk(checkArtifact(other,/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);other=null;
 other=readFixedText(TUPLE_PATHS[5][0]);beginRow('P2_CANDIDATE_MIXED');cOk(checkArtifact(other,/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);other=null;tuple=null;
 beginRow('REAL_RECEIPT_PURPOSE');changed('REAL_RECEIPT','SUMMARY_REFUSED');
 other=readTuple(1);beginRow('FULL_R3_ALIAS');cOk(checkArtifact(/** @type {string[]} */ (other)[0],/** @type {string[]} */ (other)[1],/** @type {string[]} */ (other)[2])===false);other=null;
 other=readTuple(2);beginRow('FULL_R3_KERNEL');cOk(checkArtifact(/** @type {string[]} */ (other)[0],/** @type {string[]} */ (other)[1],/** @type {string[]} */ (other)[2])===false);other=null;
 tuple=readTuple(0);
 for(let index=0;index<3;index++){other=readFixedText(TUPLE_PATHS[2][index]);beginRow(REGISTRY[30][index+5]);cOk(checkArtifact(index===0?other:/** @type {string[]} */ (tuple)[0],index===1?other:/** @type {string[]} */ (tuple)[1],index===2?other:/** @type {string[]} */ (tuple)[2])===false);other=null;}tuple=null;
 for(let index=3;index<=5;index++){other=readTuple(index);beginRow(REGISTRY[30][index+5]);cOk(checkArtifact(/** @type {string[]} */ (other)[0],/** @type {string[]} */ (other)[1],/** @type {string[]} */ (other)[2])===false);other=null;}
}
/** @returns {void} */
function runP332(){
 let tuple=/** @type {string[] | null} */ (readTuple(0));beginRow('NORMAL_CAPTURE_FLAGS');cOk(cIncludes(/** @type {string[]} */ (tuple)[2],'"checks":"UNRUN"')&&cIncludes(/** @type {string[]} */ (tuple)[2],'"authority":"NOT_ISSUED"')&&checkArtifact(/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===true);
 beginRow('NORMAL_FORGED_FLAGS');cOk(checkArtifact(/** @type {string[]} */ (tuple)[0],/** @type {string[]} */ (tuple)[1],mutateWire(/** @type {string[]} */ (tuple)[2],'FORGED_FLAGS'))===false);tuple=null;
 let other=/** @type {string[] | null} */ (readTuple(2));beginRow('KERNEL_FORGED_FLAGS');cOk(checkArtifact(/** @type {string[]} */ (other)[0],/** @type {string[]} */ (other)[1],mutateWire(/** @type {string[]} */ (other)[2],'FORGED_FLAGS'))===false);other=null;
 other=readTuple(1);beginRow('ALIAS_FORGED_FLAGS');cOk(checkArtifact(/** @type {string[]} */ (other)[0],/** @type {string[]} */ (other)[1],mutateWire(/** @type {string[]} */ (other)[2],'FORGED_FLAGS'))===false);other=null;tuple=readTuple(0);
 beginRow('KERNEL_OBSERVATION_OBJECT');cOk(checkArtifact({__proto__:null,kernelObservation:'PASS'},/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);
 beginRow('BODY_HASH_OBJECT');cOk(checkArtifact({__proto__:null,bodyHash:cRepeat('0',64)},/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);
 beginRow('SEED_OBJECT');cOk(checkArtifact({__proto__:null,seed:{__proto__:null,approved:true}},/** @type {string[]} */ (tuple)[1],/** @type {string[]} */ (tuple)[2])===false);
}
/** @returns {void} */
function runP333(){beginRow('PRIVATE_METADATA');const source='const __p3_private_name="__p3_private_specifier";f();',handle=make(source),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);readSummary(wire);cOk(!cIncludes(wire,'__p3_private_name')&&!cIncludes(wire,'__p3_private_specifier'));/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);const expected=/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire),record=metadata(handle,normal,expected);cOk(!cIncludes(expected,source)&&cDescriptor(record,'ast')===undefined&&cDescriptor(record,'source')===undefined);}
/** @returns {void} */
function runP334(){beginRow('OPEN_LABELS');const handle=make('f();'),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);const record=metadata(handle,normal,/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3(handle,wire));cOk(record.semanticCoverage==='OPEN_COMMON_GRAMMAR_RISK'&&record.allocatorCoverage==='COMMON_MODE'&&record.graphStatus==='OPEN'&&record.predecessorOpen===62&&record.fullRuntimeClosure==='NOT_ACCEPTED'&&record.execution===false&&record.materialization===false&&record.realParserDisabled===true);}
/** @returns {void} */
function runP335(){beginRow('UNKNOWN_MODE');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).createSyntheticSummaryP3,['','UNKNOWN',CAP,TTL]),'MODE_OPEN');let handle=null;const source=cSetProto(['/x/;','1n;','let π=1;',"import x from 'm';"],null);for(let index=0;index<4;index++){beginRow(REGISTRY[34][index+1]);handle=make(source[index]);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3,[handle]),index<3?'UNSUPPORTED_BOUNDED_SYNTAX':'SYNTAX_REFUSED');stale(handle,normal);drop();}}
/** @returns {void} */
function runP336(){beginRow('NO_SALVAGE');const handle=make('f();'),wire=/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3(handle);/** @type {Readonly<SyntheticAPI>} */ (normal).retireProducerSummaryP3(handle);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,wire+cRepeat(' ',16385)]),'SUMMARY_REFUSED');stale(handle,normal);refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).verifySyntheticSummaryP3,[handle,wire]),'AUTHORITY_REFUSED');refusal(operation(/** @type {Readonly<SyntheticAPI>} */ (normal).analyzeSyntheticSummaryP3,[handle]),'AUTHORITY_REFUSED');cOk(cDescriptor(/** @type {Readonly<SyntheticAPI>} */ (normal),'retry')===undefined&&cDescriptor(/** @type {Readonly<SyntheticAPI>} */ (normal),'reset')===undefined);}

const HANDLERS=cFreeze(cSetProto([runP301,runP302,runP303,runP304,runP305,runP306,
 runP307,runP308,runP309,runP310,runP311,runP312,runP313,runP314,runP315,runP316,
 runP317,runP318,runP319,runP320,runP321,runP322,runP323,runP324,runP325,runP326,
 runP327,runP328,runP329,runP330,runP331,runP332,runP333,runP334,runP335,runP336],null));

/** @returns {Promise<void>} */
async function runSerial(){
 let context=/** @type {import('./private-summary-tip081-p3.r3.d.ts').ContextScratch} */ (null),index=0,failed=false,first,report=/** @type {UnitResult | null} */ (null);
 // Mandatory authority gate before journal/file work or any target loader call.
 context=readReviewedContextP3R3();exactKeys(context,CONTEXT_KEYS);
 cOk(cIsFrozen(context)&&context.version===1&&context.purpose==='TIP081_P3_R3_REVIEWED_TOOL_CONTEXT'&&
  context.scope==='TOOL_DATA_ONLY'&&context.status==='REVIEWED_CONTEXT_BOUND','issued reviewed TOOL context required');
 reviewed=context;
 for(index=0;index<3;index++){
  context=index===0?/** @type {ReviewedContext} */ (reviewed).normal:index===1?/** @type {ReviewedContext} */ (reviewed).alias:/** @type {ReviewedContext} */ (reviewed).kernel;
  exactKeys(context,cSetProto(['toolBytes','sourceCensusHash'],null));cOk(cIsFrozen(context)&&driverInteger(context.toolBytes)&&context.toolBytes<=(index===2?66797576:33262238),'independent domain census bound');
  cOk(typeof context.sourceCensusHash==='string'&&context.sourceCensusHash.length===64,'source census pin');
 }
 exactKeys(/** @type {ReviewedContext} */ (reviewed).fixtureProof,cSetProto(['fixtureId','sourceUnits','Qp','Pp','nodeSchema','arrayBacking','derivedString','callFrame','bookkeeping','privateCallDepth','maxToolBytes','proofHash'],null));
 cOk(/** @type {ReviewedContext} */ (reviewed).fixtureProof.fixtureId==='P321.A_NORMAL'&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.sourceUnits===21&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.Qp===1387262&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.Pp===2165&&
  /** @type {ReviewedContext} */ (reviewed).fixtureProof.nodeSchema===27680&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.arrayBacking===75344&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.derivedString===185070&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.callFrame===172592&&
  /** @type {ReviewedContext} */ (reviewed).fixtureProof.bookkeeping===926576&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.privateCallDepth===25&&/** @type {ReviewedContext} */ (reviewed).fixtureProof.maxToolBytes===33262238,'fixed SOURCE upper, not observed Pp');
 exactKeys(/** @type {ReviewedContext} */ (reviewed).counterProof,cSetProto(['fixtureId','producerGrammarEntries','replayGrammarEntries','producerConstant','finalConstant','proofHash'],null));
 cOk(/** @type {ReviewedContext} */ (reviewed).counterProof.fixtureId==='P322.A_MONOTONE'&&/** @type {ReviewedContext} */ (reviewed).counterProof.producerGrammarEntries===715&&/** @type {ReviewedContext} */ (reviewed).counterProof.replayGrammarEntries===715&&/** @type {ReviewedContext} */ (reviewed).counterProof.producerConstant===525&&/** @type {ReviewedContext} */ (reviewed).counterProof.finalConstant===1091,'exact f4 source counter proof');
 exactKeys(/** @type {ReviewedContext} */ (reviewed).tuples,cSetProto(['normal','alias','kernel'],null));
 for(index=0;index<3;index++){
  context=index===0?/** @type {ReviewedContext} */ (reviewed).tuples.normal:index===1?/** @type {ReviewedContext} */ (reviewed).tuples.alias:/** @type {ReviewedContext} */ (reviewed).tuples.kernel;
  exactKeys(context,cSetProto(['candidateBytes','candidateHash','inventoryBytes','inventoryHash','profileBytes','profileHash'],null));
  cOk(cIsFrozen(context)&&driverInteger(context.candidateBytes)&&context.candidateBytes<=16777216&&driverInteger(context.inventoryBytes)&&context.inventoryBytes<=16777216&&
   driverInteger(context.profileBytes)&&context.profileBytes<=16777216,'fixed reviewed tuple sizes');
 }
 cOk(cIsArray(/** @type {ReviewedContext} */ (reviewed).composition)&&/** @type {ReviewedContext} */ (reviewed).composition.length===4&&cIsFrozen(/** @type {ReviewedContext} */ (reviewed).composition),'four fixed source receipts');
 for(index=0;index<4;index++){context=/** @type {ReviewedContext} */ (reviewed).composition[index];exactKeys(context,cSetProto(['caseId','handSourceHash','emittedSourceHash','status'],null));
  cOk(cIsFrozen(context)&&context.status==='SOURCE_REVIEWED'&&context.caseId===(index===0?'P319.C_SOURCE':index===1?'P321.C_P2_LINK':index===2?'P321.C_P3_CALLS':'P322.C_COUNTER_CALLS'),'fixed composition receipt');}
 context=cSetProto([/** @type {ReviewedContext} */ (reviewed).normal.sourceCensusHash,/** @type {ReviewedContext} */ (reviewed).alias.sourceCensusHash,/** @type {ReviewedContext} */ (reviewed).kernel.sourceCensusHash,
  /** @type {ReviewedContext} */ (reviewed).fixtureProof.proofHash,/** @type {ReviewedContext} */ (reviewed).counterProof.proofHash,
  /** @type {ReviewedContext} */ (reviewed).tuples.normal.candidateHash,/** @type {ReviewedContext} */ (reviewed).tuples.normal.inventoryHash,/** @type {ReviewedContext} */ (reviewed).tuples.normal.profileHash,
  /** @type {ReviewedContext} */ (reviewed).tuples.alias.candidateHash,/** @type {ReviewedContext} */ (reviewed).tuples.alias.inventoryHash,/** @type {ReviewedContext} */ (reviewed).tuples.alias.profileHash,
  /** @type {ReviewedContext} */ (reviewed).tuples.kernel.candidateHash,/** @type {ReviewedContext} */ (reviewed).tuples.kernel.inventoryHash,/** @type {ReviewedContext} */ (reviewed).tuples.kernel.profileHash,
  /** @type {ReviewedContext} */ (reviewed).composition[0].handSourceHash,/** @type {ReviewedContext} */ (reviewed).composition[0].emittedSourceHash,
  /** @type {ReviewedContext} */ (reviewed).composition[1].handSourceHash,/** @type {ReviewedContext} */ (reviewed).composition[1].emittedSourceHash,
  /** @type {ReviewedContext} */ (reviewed).composition[2].handSourceHash,/** @type {ReviewedContext} */ (reviewed).composition[2].emittedSourceHash,
  /** @type {ReviewedContext} */ (reviewed).composition[3].handSourceHash,/** @type {ReviewedContext} */ (reviewed).composition[3].emittedSourceHash],null);
 for(index=0;index<22*64;index++)cOk(typeof context[(index-index%64)/64]==='string'&&context[(index-index%64)/64].length===64&&
  ((cChar(context[(index-index%64)/64],index%64)>=48&&cChar(context[(index-index%64)/64],index%64)<=57)||
   (cChar(context[(index-index%64)/64],index%64)>=97&&cChar(context[(index-index%64)/64],index%64)<=102)),'canonical lowercase pin');context=null;
 try{
  normal=await loadAdmittedSyntheticSummaryP3();alias=await loadAliasFaultSyntheticSummaryP3();kernel=await loadBoundaryKernelP3R3();
  exactKeys(/** @type {Readonly<SyntheticAPI>} */ (normal),API_KEYS);exactKeys(/** @type {Readonly<SyntheticAPI>} */ (alias),API_KEYS);cOk(normal!==alias,'distinct admitted domains');
  baseline=createMetadataBaselineP3R3(normal,alias);core=createBoundaryExpectationsP3R3(/** @type {ReviewedContext} */ (reviewed).kernel.toolBytes);
  journalFD=cOpen(RAW_PATH,WRITE_FLAGS,0o600);
  for(index=0;index<36;index++){
   activeGroup=index;groups[index].status='RUNNING';await invoke(HANDLERS[index],cSetProto([],null));drop();endGroup(index);
  }
 }catch(caught){failed=true;first=caught;if(!rawFirstPresent){rawFirstPresent=true;rawFirst=first;}
  if(activeRow>=0)rows[activeRow].status='FAILED';if(activeGroup>=0)groups[activeGroup].status='INCOMPLETE';
 }finally{
  try{try{drop();}finally{closeJournal();}}
  catch(cleanupCaught){failed=true;if(!rawFirstPresent){rawFirstPresent=true;rawFirst=cleanupCaught;}}
  finally{if(currentOperation!==null){currentOperation.args=null;currentOperation.fn=null;currentOperation=null;}}
 }
 report={__proto__:null,version:1,purpose:'TIP081_P3_R3_UNIT_RESULT',status:failed?'INCOMPLETE':'COMPLETE',requirementIds:36,
  requiredRows:205,normalRequired:181,componentRequired:20,compositionRequired:4,completedRows:0,unitPassedRows:0,sourceReviewedRows:0,failedRows:0,unfinishedRows:0,groups,rows};
 for(index=0;index<205;index++){
  if(rows[index].status==='PASS'){report.unitPassedRows++;report.completedRows++;}
  else if(rows[index].status==='SOURCE_REVIEWED'){report.sourceReviewedRows++;report.completedRows++;}
  else if(rows[index].status==='FAILED'){report.failedRows++;report.completedRows++;}
  else{if(rows[index].status==='RUNNING')rows[index].status='UNFINISHED';report.unfinishedRows++;}
 }
 if(!failed)cOk(report.unitPassedRows===201&&report.sourceReviewedRows===4&&report.completedRows===205&&report.failedRows===0&&report.unfinishedRows===0,'all205 vectors and cleanup completed');
 try{writeResult(report);}finally{try{closeJournal();}finally{report=null;context=null;normal=null;alias=null;kernel=null;baseline=null;core=null;reviewed=null;}}
 if(rawFirstPresent)throw rawFirst;cProcess.exitCode=0;
}

// This dispatch is inert SOURCE text now. The named companion's NOT_ISSUED
// accessor refuses before fs/target loading; no fallback context or fake T.
await runSerial();
