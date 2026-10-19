import {MathDiagnosticError,diagnosticDigest,safeDiagnosticSummary,type DiagnosticBinding,type DiagnosticReason} from "@/modules/research-sandbox/math-transport-diagnostics";
import {assertRegisteredMathParser,type AdmittedMathTransport} from "@/modules/research-sandbox/math-transport-admission";
import type {PreparedLrcMethodUnitLiveInput} from "@/modules/research-sandbox/math-lrc-method-unit-live";
import {requireMethodUnitExecutionAuthority,type MethodUnitJobRuntime} from "./math-method-unit-authority";
import type {DiagnosticCaptureHandle} from "./math-diagnostic-capture";

export interface CodexRawTransportObserver {
  beforeDispatch:()=>Promise<void>;
  stdout:(bytes:Buffer)=>Promise<void>;
  closed:(outcome:{complete:boolean;reason:DiagnosticReason|null;observedStdoutBytes?:number})=>Promise<void>;
}
const captures=new WeakSet<MethodUnitTransportCapture>();
const knownCaptures=new WeakMap<MethodUnitJobRuntime,Array<{captureId:string;role:DiagnosticBinding["role"];jobId:string;dispatchId:string}>>();
export function knownMethodUnitCaptures(runtime:MethodUnitJobRuntime){return (knownCaptures.get(runtime)??[]).map(v=>Object.freeze({...v}));}
export class MethodUnitTransportCapture {
  private retained:Buffer|undefined;
  private complete=false;
  private closed=false;
  private inputDigest:string|undefined;
  private admitted:AdmittedMathTransport|undefined;
  private constructor(readonly runtime:MethodUnitJobRuntime,readonly binding:DiagnosticBinding,readonly handle:DiagnosticCaptureHandle){}
  static async reserve(runtime:MethodUnitJobRuntime,binding:DiagnosticBinding) {
    requireMethodUnitExecutionAuthority(runtime.authority,binding);
    if(runtime.target.caseId!==binding.caseId||runtime.target.runId!==binding.runId)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    const previous=knownCaptures.get(runtime)??[];
    if(previous.length>=3||previous.some(c=>c.role===binding.role))throw new MathDiagnosticError("CAPTURE_ALREADY_EXISTS");
    const parser=runtime.parser(binding.role);assertRegisteredMathParser(parser,binding.role);
    if(runtime.sourcePins.parser!==parser.sourceDigest)throw new MathDiagnosticError("SOURCE_PIN_DRIFT");
    const grant=await runtime.grant(binding);
    const h=await runtime.store.reserve(grant,binding,{parserVersion:parser.version,sourcePins:runtime.sourcePins});
    const known=knownCaptures.get(runtime)??[];known.push({captureId:h.captureId,role:binding.role,jobId:binding.jobId,dispatchId:binding.dispatchId});knownCaptures.set(runtime,known);
    await runtime.journal({event:"DIAGNOSTIC_RESERVED",captureId:h.captureId,binding});
    const capture=new MethodUnitTransportCapture(runtime,binding,h);captures.add(capture);return capture;
  }
  async prepared(input:PreparedLrcMethodUnitLiveInput) {
    requireMethodUnitExecutionAuthority(this.runtime.authority,this.binding);
    if(input.caseId!==this.binding.caseId||input.runId!==this.binding.runId||input.role!==this.binding.role)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    await this.runtime.store.prepared(this.handle,input);
    this.inputDigest=diagnosticDigest(JSON.stringify(input));
  }
  requireInput(input:PreparedLrcMethodUnitLiveInput){
    if(!captures.has(this)||this.inputDigest!==diagnosticDigest(JSON.stringify(input))||input.caseId!==this.binding.caseId||input.runId!==this.binding.runId||input.role!==this.binding.role)throw new MathDiagnosticError("INPUT_BINDING_MISMATCH");
    requireMethodUnitExecutionAuthority(this.runtime.authority,this.binding);
  }
  async finite(actual:unknown){await this.runtime.store.finite(this.handle,actual);}
  observer():CodexRawTransportObserver{return {
    beforeDispatch:async()=>{requireMethodUnitExecutionAuthority(this.runtime.authority,this.binding);await this.runtime.store.dispatched(this.handle);},
    stdout:bytes=>this.runtime.store.chunk(this.handle,bytes),
    closed:async outcome=>{this.retained=await this.runtime.store.retainTransport(this.handle,outcome);this.complete=outcome.complete;if(!outcome.complete)await this.finish(outcome.reason??"NONZERO_EXIT");},
  };}
  async admit():Promise<AdmittedMathTransport> {
    requireMethodUnitExecutionAuthority(this.runtime.authority,this.binding);
    if(!this.retained||!this.complete||this.closed)throw new MathDiagnosticError("CAPTURE_INCOMPLETE");
    const parser=this.runtime.parser(this.binding.role);assertRegisteredMathParser(parser,this.binding.role);
    try{const result=parser.parse(this.retained);await this.finish(null,true);this.admitted=result;
      await this.runtime.journal({event:"ROLE_RETURNED",role:this.binding.role,caseId:this.binding.caseId,runId:this.binding.runId,jobId:this.binding.jobId,captureId:this.handle.captureId,threadId:result.threadId,usage:result.usage,sourcePins:this.runtime.sourcePins});return result;}
    catch(e){if(!this.closed)await this.finish(e instanceof MathDiagnosticError?e.code:"MATH_SCHEMA_INVALID");throw e instanceof MathDiagnosticError?e:new MathDiagnosticError("MATH_SCHEMA_INVALID");}
  }
  requireReturned(raw:unknown){
    if(!this.admitted||!raw||typeof raw!=="object")throw new MathDiagnosticError("CAPTURE_INCOMPLETE");
    const value=raw as Record<string,unknown>,math=this.admitted.output as Record<string,unknown>;
    const returned=Object.fromEntries(Object.keys(math).map(k=>[k,value[k]]));
    if(diagnosticDigest(JSON.stringify(returned))!==diagnosticDigest(JSON.stringify(math))||value.threadId!==this.admitted.threadId||JSON.stringify(value.usage)!==JSON.stringify(this.admitted.usage))throw new MathDiagnosticError("OUTPUT_BINDING_MISMATCH");
  }
  async finish(reason:DiagnosticReason|null,admitted=false) {
    if(this.closed)throw new MathDiagnosticError("CAPTURE_ALREADY_EXISTS");this.closed=true;
    const manifest=await this.runtime.store.close(this.handle,{complete:this.complete,reason,admitted});
    await this.runtime.journal({event:"DIAGNOSTIC_FINAL",manifestDigest:diagnosticDigest(JSON.stringify(manifest)),summary:safeDiagnosticSummary(manifest)});
    return manifest;
  }
  async rejectBeforeAdmission(reason:DiagnosticReason){if(!this.closed)await this.finish(reason);}
}
