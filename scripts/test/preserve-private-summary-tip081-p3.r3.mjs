// Fixed four-state R3 preservation. Definitions only; no auto-effect on import.
import {BASE_INPUTS,ARTIFACTS,PROBES,ADMISSION,RECEIPT,OUTPUTS,MANIFEST} from './private-summary-tool-manifest-tip081-p3.r3.mjs';
import {readFixedP3R3,decodeFixedP3R3,probeFixedP3R3,startCutP3R3,writeCutRecordP3R3,endCutP3R3,finishOutputP3R3,writeFileDataP3R3,parseDataP3R3,exactRecordP3R3,integerP3R3,hexP3R3,failP3R3,touchP3R3} from './capture-private-summary-tip081-p3.r3.mjs';
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Pin} Pin */
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Probe} Probe */
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Writer} Writer */
/** @typedef {{rows:Pin[],probes:Probe[],firstCut:Pin}} Baseline */
/** @typedef {{rows:Pin[],probes:Probe[],receipt:Pin,admission:Pin}} Accepted */
/** @typedef {{rows:Pin[],probes:Probe[]}} Comparison */
/** @typedef {{rows:Pin[],probes:Probe[],receipt:Pin|null,admission:Pin}} ScanResult */
const cArray=Array.isArray,cFinite=Number.isFinite,cIs=Object.is,cMin=Math.min;
/** @param {unknown} value @param {number} length @returns {unknown[]} */
function array(value,length){if(!cArray(value)||value.length!==length)failP3R3('TOOL_BASELINE_ARRAY');return /** @type {unknown[]} */(value);}
/** @param {unknown} value @returns {Pin} */
export function validatePinP3R3(value){const o=exactRecordP3R3(value,['id','path','bytes','sha256','prefix']);const id=integerP3R3(o.id,MANIFEST.length-1),row=MANIFEST[id];if(o.path!==row.path||o.prefix!==(row.role==='PREFIX'))failP3R3('TOOL_PIN_PATH');const bytes=integerP3R3(o.bytes,row.maxBytes);if(bytes<1)failP3R3('TOOL_PIN_SIZE');return{__proto__:null,id,path:row.path,bytes,sha256:hexP3R3(o.sha256),prefix:row.role==='PREFIX'};}
/** @param {unknown} value @param {number} index @returns {Probe} */
function validateProbe(value,index){const o=exactRecordP3R3(value,['path','present','dev','ino','size','mtimeMs','ctimeMs','symlink']);const row=PROBES[index];if(o.path!==row.path||typeof o.present!=='boolean'||typeof o.symlink!=='boolean'||row.role==='ABSENT'&&o.present)failP3R3('TOOL_PROBE_SCHEMA');for(const key of ['dev','ino','size','mtimeMs','ctimeMs'])if(typeof o[key]!=='number'||!cFinite(o[key])||/** @type {number} */(o[key])<0||cIs(o[key],-0))failP3R3('TOOL_PROBE_NUMBER');return /** @type {Probe} */(o);}
/** @returns {Baseline} */
export function readBaselineP3R3(){let read=null,text=null,value=null;try{read=readFixedP3R3(OUTPUTS.baseline);if(read.bytes===null)failP3R3('TOOL_READ_CLEARED');text=decodeFixedP3R3(read.bytes);read.bytes=null;value=parseDataP3R3(text);text=null;const o=exactRecordP3R3(value,['version','purpose','rows','probes','firstCut']);if(o.version!==1||o.purpose!=='TIP081_P3_R3_BASELINE_PINS')failP3R3('TOOL_BASELINE_PURPOSE');const rawRows=array(o.rows,BASE_INPUTS.length),rawProbes=array(o.probes,PROBES.length),rows=[],probes=[];for(let i=0;i<rawRows.length;i++){const pin=validatePinP3R3(rawRows[i]);if(pin.id!==BASE_INPUTS[i].id)failP3R3('TOOL_BASELINE_ORDER');rows.push(pin);}for(let i=0;i<rawProbes.length;i++)probes.push(validateProbe(rawProbes[i],i));const firstCut=validatePinP3R3(o.firstCut);if(firstCut.id!==OUTPUTS.firstCut.id)failP3R3('TOOL_BASELINE_CUT');return{__proto__:null,rows,probes,firstCut};}finally{read=null;text=null;value=null;}}
/** @param {Pin} actual @param {Pin} expected @returns {void} */
function comparePin(actual,expected){if(actual.id!==expected.id||actual.path!==expected.path||actual.bytes!==expected.bytes||actual.sha256!==expected.sha256||actual.prefix!==expected.prefix)failP3R3('TOOL_PRESERVATION_PIN');}
/** @param {Probe} actual @param {Probe} expected @returns {void} */
function compareProbe(actual,expected){if(actual.path!==expected.path||actual.present!==expected.present||actual.dev!==expected.dev||actual.ino!==expected.ino||actual.size!==expected.size||actual.mtimeMs!==expected.mtimeMs||actual.ctimeMs!==expected.ctimeMs||actual.symlink!==expected.symlink)failP3R3('TOOL_PRESERVATION_PROBE');}
/** @param {Writer|null} cut @param {boolean} first @param {Comparison|null} baseline @param {Pin[]|null} artifacts @param {string|null} issuedText @param {Pin|null} receiptPin @returns {ScanResult} */
function scan(cut,first,baseline,artifacts,issuedText,receiptPin){
 const rows=[],probes=[];let read=null,text=null,admission=null,receipt=null,historyBytes=0;
 try{const total=BASE_INPUTS.length+(artifacts===null?0:ARTIFACTS.length)+(receiptPin===null?0:1);
  for(let i=0;i<total;i++){touchP3R3();const row=i<BASE_INPUTS.length?BASE_INPUTS[i]:i<BASE_INPUTS.length+ARTIFACTS.length?ARTIFACTS[i-BASE_INPUTS.length]:RECEIPT;
   if(row===RECEIPT&&receiptPin!==null){receipt=receiptPin;rows.push(receiptPin);if(cut!==null)writeCutRecordP3R3(cut,receiptPin,null,i!==0);continue;}
   const expected=i<BASE_INPUTS.length?(baseline===null?null:baseline.rows[i]):artifacts===null?null:artifacts[i-BASE_INPUTS.length];
   read=readFixedP3R3(row,expected!==null&&row.role==='PREFIX'?expected.bytes:undefined,row.role==='HISTORY'?cMin(16777216,67108864-historyBytes):16777216);if(row.role==='HISTORY')historyBytes+=read.pin.bytes;
   if(row===ADMISSION&&issuedText!==null){if(read.bytes===null)failP3R3('TOOL_READ_CLEARED');text=decodeFixedP3R3(read.bytes);if(text!==issuedText)failP3R3('TOOL_ISSUED_SOURCE_MISMATCH');admission=read.pin;}
   else if(expected!==null)comparePin(read.pin,expected);
   if(row===ADMISSION)admission=read.pin;rows.push(read.pin);
   if(cut!==null){const full=first&&(row.role==='HAND'||row.role==='PROOF'||row.role==='PREFIX')||!first&&row===ADMISSION;if(full&&text===null){if(read.bytes===null)failP3R3('TOOL_READ_CLEARED');text=decodeFixedP3R3(read.bytes);}writeCutRecordP3R3(cut,read.pin,full?text:null,i!==0);}
   read.bytes=null;read=null;text=null;
  }
  for(let i=0;i<PROBES.length;i++){const probe=probeFixedP3R3(PROBES[i]);if(baseline!==null)compareProbe(probe,baseline.probes[i]);probes.push(probe);}
  if(admission===null)failP3R3('TOOL_ADMISSION_PIN_MISSING');return{__proto__:null,rows,probes,admission,receipt};
 }finally{if(read!==null)read.bytes=null;read=null;text=null;}
}
/** A first scan streams each same-FD hand/proof/prefix payload before TS import. @returns {Baseline} */
export function captureBaselineP3R3(){if(arguments.length!==0)failP3R3('TOOL_BASELINE_ARITY');let cut=null,first,failed=false;try{cut=startCutP3R3(OUTPUTS.firstCut,'A');const result=scan(cut,true,null,null,null,null);const firstCut=endCutP3R3(cut);cut=null;const baseline={__proto__:null,rows:result.rows,probes:result.probes,firstCut};writeFileDataP3R3(OUTPUTS.baseline,{__proto__:null,version:1,purpose:'TIP081_P3_R3_BASELINE_PINS',rows:baseline.rows,probes:baseline.probes,firstCut});return baseline;}catch(caught){first=caught;failed=true;throw caught;}finally{try{if(cut!==null)finishOutputP3R3(cut,false);}catch(cleanup){if(failed)throw first;throw cleanup;}finally{cut=null;}}}
/** @param {Baseline} baseline @param {Pin[]} artifacts @returns {Pin} */
export function compareAfterAP3R3(baseline,artifacts){if(artifacts.length!==9)failP3R3('TOOL_ARTIFACT_COUNT');const result=scan(null,false,baseline,artifacts,null,null);return writeFileDataP3R3(OUTPUTS.afterA,{__proto__:null,version:1,purpose:'TIP081_P3_R3_A_AFTER_PINS',status:'MATCH',rows:result.rows,probes:result.probes});}
/** @param {Baseline} baseline @param {Pin[]} artifacts @param {string} issuedText @param {Pin} receiptPin @returns {Accepted} */
export function compareBeforeBP3R3(baseline,artifacts,issuedText,receiptPin){let cut=null,first,failed=false;try{cut=startCutP3R3(OUTPUTS.precheckCut,'B');const result=scan(cut,false,baseline,artifacts,issuedText,receiptPin);endCutP3R3(cut);cut=null;writeFileDataP3R3(OUTPUTS.beforeB,{__proto__:null,version:1,purpose:'TIP081_P3_R3_B_BEFORE_PINS',status:'MATCH_EXCEPT_AUTHORIZED_ISSUED_SOURCE',rows:result.rows,probes:result.probes,authorizedAdmission:result.admission});if(result.receipt===null)failP3R3('TOOL_RECEIPT_MISSING');return{__proto__:null,rows:result.rows,probes:result.probes,admission:result.admission,receipt:result.receipt};}catch(caught){first=caught;failed=true;throw caught;}finally{try{if(cut!==null)finishOutputP3R3(cut,false);}catch(cleanup){if(failed)throw first;throw cleanup;}finally{cut=null;}}}
/** @param {Accepted} accepted @returns {Pin} */
export function compareAfterBP3R3(accepted){const rows=[],artifacts=[];for(let i=0;i<BASE_INPUTS.length;i++)rows.push(accepted.rows[i]);for(let i=0;i<9;i++)artifacts.push(accepted.rows[BASE_INPUTS.length+i]);const baseline={__proto__:null,rows,probes:accepted.probes};let read=null;try{read=readFixedP3R3(RECEIPT);comparePin(read.pin,accepted.receipt);read.bytes=null;const result=scan(null,false,baseline,artifacts,null,read.pin);return writeFileDataP3R3(OUTPUTS.afterB,{__proto__:null,version:1,purpose:'TIP081_P3_R3_B_AFTER_PINS',status:'MATCH_B_ACCEPTED_SOURCE',rows:result.rows,probes:result.probes});}finally{read=null;}}
