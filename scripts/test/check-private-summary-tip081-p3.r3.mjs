// Fixed B precheck, four-span issuance reconstruction and syntax-only work.
// No loader/target import, worker or child is created by importing definitions.
import {SourceTextModule} from 'node:vm';
import {BASE_INPUTS,ARTIFACTS,ADMISSION,RECEIPT,OUTPUTS,SYNTAX_INPUTS} from './private-summary-tool-manifest-tip081-p3.r3.mjs';
import {readFixedP3R3,decodeFixedP3R3,parseDataP3R3,exactRecordP3R3,integerP3R3,hexP3R3,failP3R3,touchP3R3,utf8SizeP3R3} from './capture-private-summary-tip081-p3.r3.mjs';
import {readBaselineP3R3,validatePinP3R3,compareBeforeBP3R3,compareAfterBP3R3} from './preserve-private-summary-tip081-p3.r3.mjs';
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Schema} Schema */
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Pin} Pin */
/** @typedef {import('./preserve-private-summary-tip081-p3.r3.mjs').Accepted} Accepted */
const cArray=Array.isArray;
/** @type {(value:string|number)=>string} */ const cStringify=JSON.stringify;
/** @type {(text:string,start:number,end?:number)=>string} */ const cSlice=Function.call.bind(String.prototype.slice);
/** @type {(text:string,search:string,start?:number)=>number} */ const cIndex=Function.call.bind(String.prototype.indexOf);
const cKeys=Object.keys;
/** @type {(object:object,key:PropertyKey)=>(Omit<PropertyDescriptor,'value'> & {value?:unknown})|undefined} */ const cDescriptor=Object.getOwnPropertyDescriptor;
/** @type {<T>(value:T,prototype:object|null)=>T} */ const cProto=Object.setPrototypeOf;
const cFreeze=Object.freeze,cString=String;
/** @param {number} maximum @returns {Schema} */
function str(maximum){return{__proto__:null,kind:'string',maximum};}
/** @param {number} maximum @returns {Schema} */
function num(maximum=Number.MAX_SAFE_INTEGER){return{__proto__:null,kind:'number',maximum};}
/** @param {readonly string[]} keys @param {readonly Schema[]} children @returns {Schema} */
function rec(keys,children){if(keys.length!==children.length)failP3R3('TOOL_RECEIPT_SCHEMA_CODE');return{__proto__:null,kind:'object',keys,children};}
/** @param {readonly Schema[]} children @returns {Schema} */
function arr(children){return{__proto__:null,kind:'array',children};}
const PIN_SCHEMA=rec(['path','bytes','sha256'],[str(256),num(16777216),str(64)]);
const DOMAIN_SCHEMA=rec(['toolBytes','sourceCensusHash'],[num(66797576),str(64)]);
const SIX_PIN_SCHEMA=rec(['candidateBytes','candidateHash','inventoryBytes','inventoryHash','profileBytes','profileHash'],[num(2228288),str(64),num(16777216),str(64),num(65536),str(64)]);
const FIXTURE_SCHEMA=rec(['fixtureId','sourceUnits','Qp','Pp','nodeSchema','arrayBacking','derivedString','callFrame','bookkeeping','privateCallDepth','maxToolBytes','proofHash'],[str(64),num(),num(),num(),num(),num(),num(),num(),num(),num(),num(),str(64)]);
const COUNTER_SCHEMA=rec(['fixtureId','producerGrammarEntries','replayGrammarEntries','producerConstant','finalConstant','proofHash'],[str(64),num(),num(),num(),num(),str(64)]);
const COMPOSITION_SCHEMA=rec(['caseId','handSourceHash','emittedSourceHash','status'],[str(64),str(64),str(64),str(64)]);
const CONTEXT_SCHEMA=rec(['version','purpose','scope','status','normal','alias','kernel','fixtureProof','counterProof','composition','tuples'],[num(1),str(64),str(64),str(64),DOMAIN_SCHEMA,DOMAIN_SCHEMA,DOMAIN_SCHEMA,FIXTURE_SCHEMA,COUNTER_SCHEMA,arr([COMPOSITION_SCHEMA,COMPOSITION_SCHEMA,COMPOSITION_SCHEMA,COMPOSITION_SCHEMA]),rec(['normal','alias','kernel'],[SIX_PIN_SCHEMA,SIX_PIN_SCHEMA,SIX_PIN_SCHEMA])]);
const SPAN_SCHEMA=rec(['binding','startAnchor','endAnchor'],[str(64),str(64),str(64)]);
const RECEIPT_SCHEMA=rec(['version','purpose','revision','scope','oldAdmissionPin','reviewedContext','artifactPins','allowedSpans','changeTypes','expectedIssuedLoaderText'],[num(1),str(64),str(64),str(64),PIN_SCHEMA,CONTEXT_SCHEMA,arr([PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA,PIN_SCHEMA]),arr([SPAN_SCHEMA,SPAN_SCHEMA,SPAN_SCHEMA,SPAN_SCHEMA]),arr([str(64),str(64)]),str(65536)]);
const BINDINGS=cFreeze(['NORMAL','ALIAS','KERNEL','ISSUED_CONTEXT']);
const DOMAINS=cFreeze(['TIP081_P3_SYNTHETIC_ONLY','TIP081_P3_ALIAS_FAULT_TEST_ONLY','TIP081_P3_BOUNDARY_KERNEL_UNIT_ONLY']);
const COMPOSITION_IDS=cFreeze(['P319.C_SOURCE','P321.C_P2_LINK','P321.C_P3_CALLS','P322.C_COUNTER_CALLS']);
/** Closed source renderer: guard before every growing concatenation.
 * @param {string} output @param {string} part @returns {string} */
function appendLiteral(output,part){if(output.length>65536||part.length>65536-output.length)failP3R3('TOOL_RENDER_CAP');return output+part;}
/** @type {boolean} */ let usedB=false;
/** @param {unknown} value @param {number} length @returns {unknown[]} */
function exactArray(value,length){if(!cArray(value)||value.length!==length)failP3R3('TOOL_RECEIPT_ARRAY');return /** @type {unknown[]} */(value);}
/** @param {unknown} value @param {string} expected @returns {void} */
function eq(value,expected){if(value!==expected)failP3R3('TOOL_RECEIPT_LITERAL');}
/** @param {unknown} value @param {number} expected @returns {void} */
function eqNum(value,expected){if(integerP3R3(value)!==expected)failP3R3('TOOL_RECEIPT_NUMBER');}
/** @param {unknown} value @param {Pin} expected @returns {void} */
function sourcePin(value,expected){const o=exactRecordP3R3(value,['path','bytes','sha256']);eq(o.path,expected.path);eqNum(o.bytes,expected.bytes);if(hexP3R3(o.sha256)!==expected.sha256)failP3R3('TOOL_RECEIPT_PIN');}
/** @param {readonly Pin[]} rows @param {number} id @returns {Pin} */
function pinById(rows,id){for(let i=0;i<rows.length;i++)if(rows[i].id===id)return rows[i];failP3R3('TOOL_PIN_MISSING');}
/** @param {unknown} value @param {Pin[]} artifacts @returns {Record<string,unknown>} */
function validateContext(value,artifacts){
 const o=exactRecordP3R3(value,['version','purpose','scope','status','normal','alias','kernel','fixtureProof','counterProof','composition','tuples']);eqNum(o.version,1);eq(o.purpose,'TIP081_P3_R3_REVIEWED_TOOL_CONTEXT');eq(o.scope,'TOOL_DATA_ONLY');eq(o.status,'REVIEWED_CONTEXT_BOUND');
 const tuples=exactRecordP3R3(o.tuples,['normal','alias','kernel']);
 for(let i=0;i<3;i++){const name=i===0?'normal':i===1?'alias':'kernel',domain=exactRecordP3R3(o[name],['toolBytes','sourceCensusHash']),pins=exactRecordP3R3(tuples[name],['candidateBytes','candidateHash','inventoryBytes','inventoryHash','profileBytes','profileHash']);integerP3R3(domain.toolBytes,i===2?66797576:33262238);if(hexP3R3(domain.sourceCensusHash)!==artifacts[i*3+1].sha256)failP3R3('TOOL_CONTEXT_CENSUS');eqNum(pins.candidateBytes,artifacts[i*3].bytes);eqNum(pins.inventoryBytes,artifacts[i*3+1].bytes);eqNum(pins.profileBytes,artifacts[i*3+2].bytes);if(hexP3R3(pins.candidateHash)!==artifacts[i*3].sha256||hexP3R3(pins.inventoryHash)!==artifacts[i*3+1].sha256||hexP3R3(pins.profileHash)!==artifacts[i*3+2].sha256)failP3R3('TOOL_CONTEXT_TUPLES');}
 const f=exactRecordP3R3(o.fixtureProof,['fixtureId','sourceUnits','Qp','Pp','nodeSchema','arrayBacking','derivedString','callFrame','bookkeeping','privateCallDepth','maxToolBytes','proofHash']);eq(f.fixtureId,'P321.A_NORMAL');eqNum(f.sourceUnits,21);eqNum(f.Qp,1387262);eqNum(f.Pp,2165);eqNum(f.nodeSchema,27680);eqNum(f.arrayBacking,75344);eqNum(f.derivedString,185070);eqNum(f.callFrame,172592);eqNum(f.bookkeeping,926576);eqNum(f.privateCallDepth,25);eqNum(f.maxToolBytes,33262238);hexP3R3(f.proofHash);
 const p=exactRecordP3R3(o.counterProof,['fixtureId','producerGrammarEntries','replayGrammarEntries','producerConstant','finalConstant','proofHash']);eq(p.fixtureId,'P322.A_MONOTONE');eqNum(p.producerGrammarEntries,715);eqNum(p.replayGrammarEntries,715);eqNum(p.producerConstant,525);eqNum(p.finalConstant,1091);hexP3R3(p.proofHash);
 const composition=exactArray(o.composition,4);for(let i=0;i<4;i++){const r=exactRecordP3R3(composition[i],['caseId','handSourceHash','emittedSourceHash','status']);eq(r.caseId,COMPOSITION_IDS[i]);eq(r.status,'SOURCE_REVIEWED');hexP3R3(r.handSourceHash);hexP3R3(r.emittedSourceHash);}return o;
}
/** @param {unknown} value @param {number} depth @returns {string} */
function renderContextLiteral(value,depth=0){if(depth>6)failP3R3('TOOL_RENDER_DEPTH');if(typeof value==='string'){if(value.length>256)failP3R3('TOOL_RENDER_STRING');return cStringify(value);}if(typeof value==='number'){integerP3R3(value);return cStringify(value);}if(value===null||typeof value!=='object')failP3R3('TOOL_RENDER_TYPE');let output='';if(cArray(value)){if(value.length!==4)failP3R3('TOOL_RENDER_ARRAY');output='cFreeze(cSetProto([';for(let i=0;i<value.length;i++){const d=cDescriptor(value,cString(i));if(!d)failP3R3('TOOL_RENDER_DESCRIPTOR');cProto(d,null);if(d.get||d.set)failP3R3('TOOL_RENDER_DESCRIPTOR');if(i)output=appendLiteral(output,',');output=appendLiteral(output,renderContextLiteral(d.value,depth+1));}return appendLiteral(output,'],null))');}const keys=cKeys(value);if(keys.length>12)failP3R3('TOOL_RENDER_FIELDS');output='cFreeze({__proto__:null';for(let i=0;i<keys.length;i++){const d=cDescriptor(value,keys[i]);if(!d)failP3R3('TOOL_RENDER_DESCRIPTOR');cProto(d,null);if(d.get||d.set)failP3R3('TOOL_RENDER_DESCRIPTOR');output=appendLiteral(output,',');output=appendLiteral(output,keys[i]);output=appendLiteral(output,':');output=appendLiteral(output,renderContextLiteral(d.value,depth+1));}return appendLiteral(output,'})');}
/** @param {number} index @param {Pin[]} artifacts @returns {string} */
function renderTupleBlock(index,artifacts){let output='const '+BINDINGS[index]+' = cFreeze({__proto__:null,status:"SOURCE_REVIEWED_SYNTHETIC_ONLY",domain:';output=appendLiteral(output,cStringify(DOMAINS[index]));for(let i=0;i<3;i++){const pin=artifacts[index*3+i],key=i===0?'candidate':i===1?'inventory':'profile';output=appendLiteral(output,','+key+':cFreeze({__proto__:null,path:');output=appendLiteral(output,cStringify(ARTIFACTS[index*3+i].path));output=appendLiteral(output,',bytes:');output=appendLiteral(output,cStringify(pin.bytes));output=appendLiteral(output,',sha256:');output=appendLiteral(output,cStringify(pin.sha256));output=appendLiteral(output,'})');}return appendLiteral(output,'});');}
/** @param {string} source @param {string} anchor @returns {number} */
function uniqueAnchor(source,anchor){const at=cIndex(source,anchor);if(at<0||cIndex(source,anchor,at+anchor.length)>=0)failP3R3('TOOL_ISSUANCE_ANCHOR');return at;}
/** @param {string} original @param {Record<string,unknown>} receipt @param {Pin[]} artifacts @param {Record<string,unknown>} context @returns {string} */
function reconstructIssuedSource(original,receipt,artifacts,context){if(original.length>65536)failP3R3('TOOL_LOADER_TEXT_CAP');const spans=exactArray(receipt.allowedSpans,4),changes=exactArray(receipt.changeTypes,2);eq(changes[0],'PIN_STATUS');eq(changes[1],'REVIEWED_CONTEXT');let result='',previous=0;for(let i=0;i<4;i++){const start=i===3?'const ISSUED_CONTEXT = null;':'const '+BINDINGS[i]+' = cFreeze({',end=i===3?'':'\n});',r=exactRecordP3R3(spans[i],['binding','startAnchor','endAnchor']);eq(r.binding,BINDINGS[i]);eq(r.startAnchor,start);eq(r.endAnchor,end);const at=uniqueAnchor(original,start);let stop=at+start.length;if(i!==3){const endAt=cIndex(original,end,stop);if(endAt<0)failP3R3('TOOL_ISSUANCE_END');stop=endAt+end.length;}if(at<previous||stop<=at)failP3R3('TOOL_ISSUANCE_SPAN');result=appendLiteral(result,cSlice(original,previous,at));if(i===3){result=appendLiteral(result,'const ISSUED_CONTEXT = ');result=appendLiteral(result,renderContextLiteral(context));result=appendLiteral(result,';');}else result=appendLiteral(result,renderTupleBlock(i,artifacts));previous=stop;}result=appendLiteral(result,cSlice(original,previous));if(receipt.expectedIssuedLoaderText!==result)failP3R3('TOOL_MAIN_EXPECTED_SOURCE');utf8SizeP3R3(result,ADMISSION.maxBytes);return result;}
/** @param {import('./private-summary-tool-manifest-tip081-p3.r3.mjs').ManifestRow} row @param {Pin|null} expected @returns {unknown} */
function readData(row,expected=null){let read=null,text=null;try{read=readFixedP3R3(row);if(expected!==null&&(read.pin.id!==expected.id||read.pin.bytes!==expected.bytes||read.pin.sha256!==expected.sha256))failP3R3('TOOL_DATA_PIN');if(read.bytes===null)failP3R3('TOOL_READ_CLEARED');text=decodeFixedP3R3(read.bytes);read.bytes=null;return parseDataP3R3(text,row.maxBytes);}finally{read=null;text=null;}}
/** B precheck has no loader/target import. @returns {Accepted} */
export function precheckP3R3(){if(arguments.length!==0||usedB)failP3R3('TOOL_B_ARITY_OR_ONESHOT');usedB=true;let firstCut=null,emittedCut=null,receiptValue=null,receiptRead=null,receiptText=null,original=null,issued=null;
 try{const baseline=readBaselineP3R3();firstCut=readData(OUTPUTS.firstCut,baseline.firstCut);const first=exactRecordP3R3(firstCut,['version','purpose','phase','cuts']);eqNum(first.version,1);eq(first.purpose,'TIP081_P3_R3_FIRST_SOURCE_CUT');eq(first.phase,'A');const cuts=exactArray(first.cuts,BASE_INPUTS.length);for(let i=0;i<cuts.length;i++){const r=exactRecordP3R3(cuts[i],BASE_INPUTS[i].role==='HAND'||BASE_INPUTS[i].role==='PROOF'||BASE_INPUTS[i].role==='PREFIX'?['pin','sourceText']:['pin']);const pin=validatePinP3R3(r.pin);if(pin.id!==baseline.rows[i].id||pin.bytes!==baseline.rows[i].bytes||pin.sha256!==baseline.rows[i].sha256)failP3R3('TOOL_FIRST_CUT_BASELINE');if(pin.id===ADMISSION.id){if(typeof r.sourceText!=='string'||r.sourceText.length>65536)failP3R3('TOOL_OLD_ADMISSION_SOURCE');original=r.sourceText;}}if(original===null)failP3R3('TOOL_OLD_ADMISSION_MISSING');firstCut=null;
  emittedCut=readData(OUTPUTS.emittedCut);const emitted=exactRecordP3R3(emittedCut,['version','purpose','phase','cuts']);eqNum(emitted.version,1);eq(emitted.purpose,'TIP081_P3_R3_FIRST_EMITTED_SOURCE_CUT');eq(emitted.phase,'A');const artifacts=[],rawArtifacts=exactArray(emitted.cuts,9);for(let i=0;i<9;i++){const r=exactRecordP3R3(rawArtifacts[i],['pin','sourceText']),pin=validatePinP3R3(r.pin);if(pin.id!==ARTIFACTS[i].id||typeof r.sourceText!=='string')failP3R3('TOOL_EMITTED_CUT');artifacts.push(pin);}emittedCut=null;
  receiptRead=readFixedP3R3(RECEIPT);if(receiptRead.bytes===null)failP3R3('TOOL_READ_CLEARED');receiptText=decodeFixedP3R3(receiptRead.bytes);receiptRead.bytes=null;receiptValue=parseDataP3R3(receiptText,1048576,RECEIPT_SCHEMA);receiptText=null;const receipt=exactRecordP3R3(receiptValue,['version','purpose','revision','scope','oldAdmissionPin','reviewedContext','artifactPins','allowedSpans','changeTypes','expectedIssuedLoaderText']);eqNum(receipt.version,1);eq(receipt.purpose,'TIP081_P3_R3_MAIN_ISSUED_SOURCE_RECEIPT');eq(receipt.revision,'R3');eq(receipt.scope,'MAIN_STOPPED_EDIT_DATA');sourcePin(receipt.oldAdmissionPin,pinById(baseline.rows,ADMISSION.id));const pins=exactArray(receipt.artifactPins,9);for(let i=0;i<9;i++)sourcePin(pins[i],artifacts[i]);const context=validateContext(receipt.reviewedContext,artifacts);issued=reconstructIssuedSource(original,receipt,artifacts,context);
  return compareBeforeBP3R3(baseline,artifacts,issued,receiptRead.pin);
 }finally{firstCut=null;emittedCut=null;receiptValue=null;receiptRead=null;receiptText=null;original=null;issued=null;}
}
/** In-process native syntax construction; NO link/evaluate/import of candidates. @param {Accepted} accepted @returns {number} */
export function syntaxP3R3(accepted){let read=null,text=null,syntaxModule=null;try{for(let i=0;i<SYNTAX_INPUTS.length;i++){touchP3R3();const row=SYNTAX_INPUTS[i],pin=pinById(accepted.rows,row.id);read=readFixedP3R3(row);if(read.pin.bytes!==pin.bytes||read.pin.sha256!==pin.sha256)failP3R3('TOOL_SYNTAX_DRIFT');if(read.bytes===null)failP3R3('TOOL_READ_CLEARED');text=decodeFixedP3R3(read.bytes);read.bytes=null;syntaxModule=new SourceTextModule(text,{identifier:row.path});syntaxModule=null;text=null;read=null;}return SYNTAX_INPUTS.length;}finally{read=null;text=null;syntaxModule=null;}}
/** @param {Accepted} accepted @returns {Pin} */
export function postcheckP3R3(accepted){return compareAfterBP3R3(accepted);}
