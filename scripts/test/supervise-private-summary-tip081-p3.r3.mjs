// Trusted serial R3 controller. Definitions only: importing starts no process/effect.
import {spawn} from 'node:child_process';
import {Buffer} from 'node:buffer';
import {performance} from 'node:perf_hooks';
import {NODE,ROOT,CLEAN_ENV,CAPTURE_ARGV,LINT_ARGV,TYPE_ARGV,UNIT_ARGV,LINT_INPUTS,OUTPUTS} from './private-summary-tool-manifest-tip081-p3.r3.mjs';
import {beginPhaseP3R3,stageP3R3,touchP3R3,budgetSnapshotP3R3,openOutputP3R3,finishOutputP3R3,writeDataP3R3,writeChunkP3R3,writeFileDataP3R3,faultDataP3R3,base64ChunkP3R3,decodeFixedP3R3,parseDataP3R3,exactRecordP3R3,ownRecordP3R3,failP3R3} from './capture-private-summary-tip081-p3.r3.mjs';
import {precheckP3R3,syntaxP3R3,postcheckP3R3} from './check-private-summary-tip081-p3.r3.mjs';
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Writer} Writer */
/** @typedef {import('./capture-private-summary-tip081-p3.r3.mjs').Pin} Pin */
/** @typedef {{name:string,pid:number|null,started:number,ended:number|null,exitCode:number|null,signal:string|null,stdoutBytes:number,stderrBytes:number,observedStdoutBytes:number,observedStderrBytes:number,journaledStdoutBytes:number,journaledStderrBytes:number,retainedStdoutBytes:number,rawTruncation:boolean,rawScope:string,killed:boolean,settled:boolean,firstFaultPresent:boolean,firstFault:Record<string,unknown>|null,cleanupFault:Record<string,unknown>|null,output:string|null}} ChildResult */
const cSpawn=spawn,cNow=performance.now.bind(performance),cKill=process.kill.bind(process);
const cSetTimeout=setTimeout,cClearTimeout=clearTimeout,cIsBuffer=Buffer.isBuffer,cAlloc=Buffer.alloc.bind(Buffer);
/** @type {(source:Buffer,target:Buffer,targetStart?:number,sourceStart?:number,sourceEnd?:number)=>number} */ const cCopy=Function.call.bind(Buffer.prototype.copy);
const cSafe=Number.isSafeInteger,cFinite=Number.isFinite,cArray=Array.isArray,cMin=Math.min;
/** @type {boolean} */ let used=false;
/** Native spawn gets a finite ordinary array, not a null-prototype iterator. @param {readonly string[]} input @returns {string[]} */
function argvCopy(input){if(input.length>64)failP3R3('TOOL_ARGV_CAP');const output=[];for(let i=0;i<input.length;i++){const value=input[i];if(typeof value!=='string'||value.length>512)failP3R3('TOOL_ARGV_LITERAL');output.push(value);}return output;}
/** @param {Writer} journal @param {unknown} value @returns {void} */
function journalRecord(journal,value){writeDataP3R3(journal,value);writeChunkP3R3(journal,'\n');}
/** A single fixed child, bounded streams, actual clocks, group kill once, bounded settlement.
 * @param {'capture'|'lint'|'type'|'unit'} name @param {readonly string[]} argv @param {number} limit @param {number} settle @param {Writer} journal @returns {Promise<ChildResult>} */
async function runChild(name,argv,limit,settle,journal){
 const started=touchP3R3(),endAt=started+limit;
 /** @type {Buffer|null} */ let collected=name==='capture'?cAlloc(65536):name==='lint'?cAlloc(1048576):null;
 /** @type {import('node:child_process').ChildProcess|null} */ let child=null;
 /** @type {ReturnType<typeof setTimeout>|null} */ let deadlineTimer=null,settleTimer=null;
 /** @type {unknown} */ let first;
 const result={__proto__:null,name,pid:/** @type {number|null} */(null),started,ended:/** @type {number|null} */(null),exitCode:/** @type {number|null} */(null),signal:/** @type {string|null} */(null),stdoutBytes:0,stderrBytes:0,observedStdoutBytes:0,observedStderrBytes:0,journaledStdoutBytes:0,journaledStderrBytes:0,retainedStdoutBytes:0,rawTruncation:false,rawScope:'DELIVERED_CHUNKS_UNTIL_LISTENER_RELEASE_JOURNALED_COMPLETE_RECORDS_ONLY',killed:false,settled:false,firstFaultPresent:false,firstFault:/** @type {Record<string,unknown>|null} */(null),cleanupFault:/** @type {Record<string,unknown>|null} */(null),output:/** @type {string|null} */(null)};
 let finished=false,sequence=0,last=started;
 /** @type {(()=>void)|null} */ let complete=null;
 /** @param {unknown} caught @returns {void} */
 function latch(caught){if(!result.firstFaultPresent){result.firstFaultPresent=true;first=caught;result.firstFault=faultDataP3R3(caught);}}
 /** @returns {number} */
 function clock(){const now=cNow();if(!cFinite(now)||now<last)failP3R3('TOOL_CHILD_CLOCK');last=now;return now;}
 /** @returns {void} */
 function killKnown(){if(result.killed||result.pid===null)return;result.killed=true;try{if(!cSafe(result.pid)||result.pid<=0)failP3R3('TOOL_CHILD_PID');cKill(-result.pid,'SIGKILL');}catch(caught){result.cleanupFault=faultDataP3R3(caught);}}
 /** @returns {void} */
 function finish(){if(finished)return;finished=true;if(deadlineTimer!==null)cClearTimeout(deadlineTimer);if(settleTimer!==null)cClearTimeout(settleTimer);deadlineTimer=null;settleTimer=null;try{result.ended=clock();}catch(caught){latch(caught);}if(complete!==null)complete();}
 /** @returns {void} */
 function abortChild(){result.rawTruncation=true;killKnown();if(settleTimer===null&&!finished)settleTimer=cSetTimeout(()=>{if(child!==null){try{child.stdout?.destroy();child.stderr?.destroy();}catch(caught){result.cleanupFault=faultDataP3R3(caught);}}finish();},settle);}
 /** @param {'stdout'|'stderr'} stream @param {unknown} data @returns {void} */
 function receive(stream,data){if(finished)return;try{if(!cIsBuffer(data))failP3R3('TOOL_CHILD_DATA');const bytes=/** @type {Buffer} */(data),prior=stream==='stdout'?result.stdoutBytes:result.stderrBytes,observed=result.observedStdoutBytes+result.observedStderrBytes;if(!cSafe(observed+bytes.length)){result.rawScope='DELIVERED_PREFIX_ONLY_OBSERVED_COUNTER_REFUSED';failP3R3('TOOL_CHILD_OBSERVED_COUNTER');}if(stream==='stdout')result.observedStdoutBytes+=bytes.length;else result.observedStderrBytes+=bytes.length;const now=clock();if(result.firstFaultPresent){result.rawTruncation=true;return;}if(now>=endAt)failP3R3('TOOL_CHILD_DEADLINE');touchP3R3();if(bytes.length>1048576-result.stdoutBytes-result.stderrBytes)failP3R3('TOOL_CHILD_STREAM_CAP');if(stream==='stdout'&&collected!==null){if(bytes.length>collected.length-prior)failP3R3('TOOL_CHILD_RESULT_CAP');cCopy(bytes,collected,prior);result.retainedStdoutBytes+=bytes.length;}
   if(stream==='stdout')result.stdoutBytes+=bytes.length;else result.stderrBytes+=bytes.length;
   for(let offset=0;offset<bytes.length;offset+=32768){const end=cMin(bytes.length,offset+32768);if(++sequence>128)failP3R3('TOOL_CHILD_EVENT_CAP');journalRecord(journal,{__proto__:null,event:'CHUNK',child:name,sequence,stream,clock:now,offset:prior+offset,bytes:end-offset,observedByteCount:result.observedStdoutBytes+result.observedStderrBytes,deliveredChunkBytes:bytes.length,truncation:false,scope:'COMPLETE_PAYLOAD_FRAGMENT_OF_DELIVERED_CHUNK',encoding:'base64',data:base64ChunkP3R3(bytes,offset,end)});if(stream==='stdout')result.journaledStdoutBytes+=end-offset;else result.journaledStderrBytes+=end-offset;}
  }catch(caught){latch(caught);abortChild();}}
 try{
  await /** @type {Promise<void>} */(new Promise((resolve)=>{complete=resolve;try{child=cSpawn(NODE,argvCopy(argv),{cwd:ROOT,env:CLEAN_ENV,shell:false,detached:true,stdio:['ignore','pipe','pipe']});
   child.once('spawn',()=>{try{if(child===null||typeof child.pid!=='number'||!cSafe(child.pid)||child.pid<=0)failP3R3('TOOL_CHILD_PID');result.pid=child.pid;journalRecord(journal,{__proto__:null,event:'SPAWN',child:name,pid:result.pid,clock:clock(),executable:NODE,argv:argvCopy(argv)});if(result.firstFaultPresent)abortChild();}catch(caught){latch(caught);abortChild();}});
   child.stdout?.on('data',(data)=>receive('stdout',data));child.stderr?.on('data',(data)=>receive('stderr',data));
   child.once('error',(caught)=>{latch(caught);abortChild();});
   child.once('close',(code,signal)=>{try{result.exitCode=code;result.signal=signal;result.settled=true;const now=clock();if(now>=endAt)latch('TOOL_CHILD_DEADLINE');if(code!==0||signal!==null)latch('TOOL_CHILD_NONZERO');journalRecord(journal,{__proto__:null,event:'CLOSE',child:name,clock:now,exitCode:code,signal,observedByteCount:result.observedStdoutBytes+result.observedStderrBytes,observedStdoutBytes:result.observedStdoutBytes,observedStderrBytes:result.observedStderrBytes,journaledStdoutBytes:result.journaledStdoutBytes,journaledStderrBytes:result.journaledStderrBytes,retainedStdoutBytes:result.retainedStdoutBytes,truncation:result.rawTruncation,scope:result.rawScope,firstFaultPresent:result.firstFaultPresent,firstFault:result.firstFault});}catch(caught){latch(caught);}finally{finish();}});
   const remaining=endAt-clock();if(remaining<=0){latch('TOOL_CHILD_DEADLINE');abortChild();}else deadlineTimer=cSetTimeout(()=>{latch('TOOL_CHILD_DEADLINE');abortChild();},remaining);
  }catch(caught){latch(caught);abortChild();if(child===null)finish();}}));
  if(!result.firstFaultPresent&&collected!==null){try{const length=result.stdoutBytes;if(length<1)latch('TOOL_CHILD_EMPTY_RESULT');else{const exact=cAlloc(length);cCopy(collected,exact,0,0,length);result.output=decodeFixedP3R3(exact);}}catch(caught){latch(caught);}}
  if(result.firstFaultPresent)result.output=null;
  return result;
 }finally{if(deadlineTimer!==null)cClearTimeout(deadlineTimer);if(settleTimer!==null)cClearTimeout(settleTimer);if(child!==null){child.removeAllListeners();child.stdout?.removeAllListeners();child.stderr?.removeAllListeners();}complete=null;child=null;collected=null;first=undefined;}
}
/** Meaningful ESLint JSON result checks: exact14 filepaths, no ignored/warn/error rows.
 * @param {string|null} text @returns {void} */
function lintResult(text){if(text===null)failP3R3('TOOL_LINT_OUTPUT');const value=parseDataP3R3(text,1048576);if(!cArray(value)||value.length!==LINT_INPUTS.length)failP3R3('TOOL_LINT_FILES');for(let i=0;i<LINT_INPUTS.length;i++){let matches=0;for(let j=0;j<value.length;j++){const row=ownRecordP3R3(value[j]);if(row.filePath!==LINT_INPUTS[i].path)continue;matches++;if(row.errorCount!==0||row.warningCount!==0||row.fatalErrorCount!==0||!cArray(row.messages)||row.messages.length!==0||row.suppressedMessages!==undefined&&(!cArray(row.suppressedMessages)||row.suppressedMessages.length!==0))failP3R3('TOOL_LINT_RESULT');}if(matches!==1)failP3R3('TOOL_LINT_FILE_SET');}}
/** @param {string|null} text @returns {unknown} */
function captureResult(text){if(text===null)failP3R3('TOOL_A_RESULT');const value=parseDataP3R3(text,65536),o=exactRecordP3R3(value,['version','purpose','status','targetEvaluation','artifacts','emittedCut','after','review','budget']);if(o.version!==1||o.purpose!=='TIP081_P3_R3_A_CHILD_RESULT'||o.status!=='COMPLETE'||o.targetEvaluation!==false||!cArray(o.artifacts)||o.artifacts.length!==9)failP3R3('TOOL_A_RESULT_SCHEMA');return value;}
/** @param {'A'|'B'} phase @param {Writer|null} writer @param {boolean} success @returns {Pin|null} */
function closeJournal(phase,writer,success){if(phase!=='A'&&phase!=='B')failP3R3('TOOL_JOURNAL_PHASE');if(writer===null)return null;return finishOutputP3R3(writer,success);}
/** @returns {Promise<void>} */
export async function superviseCaptureP3R3(){if(arguments.length!==0||used)failP3R3('TOOL_SUPERVISOR_ONESHOT');used=true;beginPhaseP3R3('A');let journal=null,first,failed=false,result=null,childResult=null,resultAttempted=false,ledgerAttempted=false;
 try{journal=openOutputP3R3(OUTPUTS.rawA);journalRecord(journal,{__proto__:null,event:'BEGIN',phase:'A',rawLimit:2500,childLimit:2000,settleLimit:500,allowance:3000,clock:touchP3R3()});
  stageP3R3('A_CAPTURE',2000);childResult=await runChild('capture',CAPTURE_ARGV,2000,500,journal);stageP3R3('A_SETTLE',500);if(childResult.firstFaultPresent)failP3R3('TOOL_A_CHILD_FAILED');result=captureResult(childResult.output);childResult.output=null;const rawPin=closeJournal('A',journal,true);journal=null;resultAttempted=true;writeFileDataP3R3(OUTPUTS.resultA,{__proto__:null,version:1,purpose:'TIP081_P3_R3_A_RESULT',status:'COMPLETE',child:childResult,result,rawPin,budget:budgetSnapshotP3R3()});
  const snapshot=budgetSnapshotP3R3();ledgerAttempted=true;writeFileDataP3R3(OUTPUTS.ledger,{__proto__:null,version:1,purpose:'TIP081_P3_R3_EXECUTION_LEDGER',phase:'A',status:'COMPLETE',rawLimit:2500,allowance:3000,machineReservationAuthority:false,actual:snapshot,bMachineAppend:false});
 }catch(caught){first=caught;failed=true;try{stageP3R3('A_FAILURE_SETTLE',500);if(!resultAttempted){resultAttempted=true;writeFileDataP3R3(OUTPUTS.resultA,{__proto__:null,version:1,purpose:'TIP081_P3_R3_A_RESULT',status:'FAILED',firstFault:faultDataP3R3(caught),child:childResult,rawComplete:false,budget:budgetSnapshotP3R3()});}}catch(cleanup){/* No repair of partial/existing result. */}try{if(!ledgerAttempted){ledgerAttempted=true;writeFileDataP3R3(OUTPUTS.ledger,{__proto__:null,version:1,purpose:'TIP081_P3_R3_EXECUTION_LEDGER',phase:'A',status:'FAILED',rawLimit:2500,allowance:3000,machineReservationAuthority:false,firstFault:faultDataP3R3(caught),actual:budgetSnapshotP3R3(),bMachineAppend:false});}}catch(cleanup){/* A late/partial ledger is incomplete, not an alternative first fault. */}throw caught;
 }finally{try{closeJournal('A',journal,false);}catch(cleanup){if(failed)throw first;throw cleanup;}finally{journal=null;result=null;childResult=null;}}
}
/** @returns {Promise<void>} */
export async function superviseCheckP3R3(){if(arguments.length!==0||used)failP3R3('TOOL_SUPERVISOR_ONESHOT');used=true;beginPhaseP3R3('B');let journal=null,accepted=null,first,failed=false,resultAttempted=false;const records=[];
 try{journal=openOutputP3R3(OUTPUTS.rawB);journalRecord(journal,{__proto__:null,event:'BEGIN',phase:'B',rawLimit:10000,partitions:[500,350,750,1200,6500,500,200],allowance:5000,clock:touchP3R3()});
  stageP3R3('B_PRECHECK',500);accepted=precheckP3R3();records.push({__proto__:null,stage:'PRECHECK',status:'COMPLETE',clock:touchP3R3()});
  stageP3R3('B_SYNTAX',350);const syntaxCount=syntaxP3R3(accepted);records.push({__proto__:null,stage:'SYNTAX',constructed:syntaxCount,linked:0,evaluated:0,clock:touchP3R3()});
  stageP3R3('B_LINT',750);const lint=await runChild('lint',LINT_ARGV,750,200,journal);records.push(lint);if(lint.firstFaultPresent)failP3R3('TOOL_LINT_CHILD_FAILED');lintResult(lint.output);lint.output=null;
  stageP3R3('B_TYPE',1200);const type=await runChild('type',TYPE_ARGV,1200,200,journal);records.push(type);if(type.firstFaultPresent)failP3R3('TOOL_TYPE_CHILD_FAILED');
  stageP3R3('B_UNIT',6500);const unit=await runChild('unit',UNIT_ARGV,6500,200,journal);records.push(unit);if(unit.firstFaultPresent)failP3R3('TOOL_UNIT_CHILD_FAILED');
  stageP3R3('B_POSTCHECK',500);const after=postcheckP3R3(accepted);records.push({__proto__:null,stage:'POSTCHECK',status:'COMPLETE',after,clock:touchP3R3()});
  stageP3R3('B_SETTLE',200);const rawPin=closeJournal('B',journal,true);journal=null;resultAttempted=true;writeFileDataP3R3(OUTPUTS.resultB,{__proto__:null,version:1,purpose:'TIP081_P3_R3_B_RESULT',status:'COMPLETE',records,rawPin,unitResultPath:OUTPUTS.unitResult.path,unitClaim:'EXIT_ZERO_FROM_REVIEWED_205_ASSERTION_RUNNER',runtimeClosureAccepted:false,budget:budgetSnapshotP3R3()});
 }catch(caught){first=caught;failed=true;try{stageP3R3('B_FAILURE_SETTLE',200);if(!resultAttempted){resultAttempted=true;writeFileDataP3R3(OUTPUTS.resultB,{__proto__:null,version:1,purpose:'TIP081_P3_R3_B_RESULT',status:'FAILED',firstFault:faultDataP3R3(caught),records,rawComplete:false,budget:budgetSnapshotP3R3()});}}catch(cleanup){/* No retry/overwrite of an existing or partial result; first fault wins. */}throw caught;
 }finally{try{closeJournal('B',journal,false);}catch(cleanup){if(failed)throw first;throw cleanup;}finally{journal=null;accepted=null;records.length=0;}}
}
