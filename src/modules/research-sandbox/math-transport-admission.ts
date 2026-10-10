/** Deterministic admission only: no provider, environment, database or executable captured code. */
import { MathDiagnosticError, diagnosticDigest, MATH_DIAGNOSTIC_LIMITS } from "./math-transport-diagnostics";
import {validateLrcMethodUnitSolverOutput,validateLrcMethodUnitReviewOutput} from "./math-lrc-method-unit-live";
import {MATH_METHOD_UNIT_FROZEN_SOURCES,MATH_METHOD_UNIT_INSTALLED_PARSER_VERSION} from "./math-method-unit-source-registry";

const lifecycle = new Set(["thread.started","turn.started","item.started","item.updated","item.completed","turn.completed","turn.failed","error"]);
const hostFields = new Set(["providerName","modelName","threadId","usage","lrcEvidence","lrcCampaignEvidence","lrcProofUnitEvidence","lrcProofUnitInput",
  "lrcMethodUnitEvidence","lrcMethodUnitInput","lrcMethodUnitFiniteEvidence","checker","producer","receipt","dispatchId"]);
export interface AdmittedMathTransport { threadId:string; output:unknown; usage:{inputTokens:number;cachedInputTokens:number;outputTokens:number;reasoningOutputTokens:number} }
/** Independent accounting observation does not admit protocol/tool/mathematical output. */
export function observeMathTransportAccounting(bytes:Uint8Array) {
  const missing={status:"UNAVAILABLE" as const,threadId:null,usage:null};
  try {
    if(bytes.byteLength>MATH_DIAGNOSTIC_LIMITS.stdoutBytes)return missing;
    const text=new TextDecoder("utf-8",{fatal:true}).decode(bytes);let threads=0,turns=0,thread:unknown,usage:Record<string,unknown>|undefined;
    for(const line of text.split(/\r?\n/)){if(!line.trim())continue;const e=JSON.parse(line);if(!e||typeof e!=="object"||Array.isArray(e))return missing;
      if(e.type==="thread.started"){threads++;thread=e.thread_id;}if(e.type==="turn.completed"){turns++;usage=e.usage;}if(e.type==="turn.failed"||e.type==="error")return missing;}
    if(threads!==1||turns!==1||typeof thread!=="string"||!/^[A-Za-z0-9:_-]{1,200}$/.test(thread)||!usage)return missing;
    const names=["input_tokens","cached_input_tokens","output_tokens","reasoning_output_tokens"];
    if(names.some(k=>!Number.isSafeInteger(usage![k])||Number(usage![k])<(["input_tokens","output_tokens"].includes(k)?1:0))||Number(usage.cached_input_tokens)>Number(usage.input_tokens)||Number(usage.reasoning_output_tokens)>Number(usage.output_tokens))return missing;
    return {status:"TRANSPORT_OBSERVED_UNACCEPTED" as const,threadId:thread,usage:{inputTokens:Number(usage.input_tokens),cachedInputTokens:Number(usage.cached_input_tokens),outputTokens:Number(usage.output_tokens),reasoningOutputTokens:Number(usage.reasoning_output_tokens)}};
  }catch{return missing;}
}
export function parseMathTransportAdmission(bytes:Uint8Array, validateMath:(raw:unknown)=>unknown):AdmittedMathTransport {
  if(bytes.byteLength>MATH_DIAGNOSTIC_LIMITS.stdoutBytes) throw new MathDiagnosticError("STDOUT_LIMIT");
  let text:string;
  try{text=new TextDecoder("utf-8",{fatal:true}).decode(bytes);}catch{throw new MathDiagnosticError("UTF8_INVALID");}
  let thread:unknown,final:unknown,usage:Record<string,unknown>|undefined,threads=0,turns=0,finals=0;
  for(const line of text.split(/\r?\n/)) {
    if(!line.trim())continue;
    let e:Record<string,unknown>;
    try{e=JSON.parse(line);}catch{throw new MathDiagnosticError("JSONL_INVALID");}
    if(!e || typeof e!=="object" || Array.isArray(e) || !lifecycle.has(String(e.type))) throw new MathDiagnosticError("PROTOCOL_UNSUPPORTED");
    const item=e.item as Record<string,unknown>|undefined;
    if(String(e.type).startsWith("item.")&&(!item||typeof item!=="object"||Array.isArray(item)))throw new MathDiagnosticError("PROTOCOL_UNSUPPORTED");
    if(item && (!item || typeof item!=="object" || Array.isArray(item) || !["agent_message","reasoning"].includes(String(item.type)))) throw new MathDiagnosticError("TOOL_ACTIVITY_OBSERVED");
    if(e.type==="error" || e.type==="turn.failed")throw new MathDiagnosticError("TURN_FAILED");
    if(e.type==="thread.started"){threads++;thread=e.thread_id;}
    if(e.type==="item.completed" && item?.type==="agent_message"){finals++;final=item.text;}
    if(e.type==="turn.completed"){turns++;usage=e.usage as Record<string,unknown>;}
  }
  if(threads!==1 || turns!==1 || finals!==1 || typeof thread!=="string" || !/^[A-Za-z0-9:_-]{1,200}$/.test(thread) || typeof final!=="string" || !final)throw new MathDiagnosticError("CONTEXT_INVALID");
  const names=["input_tokens","cached_input_tokens","output_tokens","reasoning_output_tokens"];
  if(!usage || names.some(k=>!Number.isSafeInteger(usage![k]) || Number(usage![k])<(["input_tokens","output_tokens"].includes(k)?1:0)) ||
    Number(usage.cached_input_tokens)>Number(usage.input_tokens) || Number(usage.reasoning_output_tokens)>Number(usage.output_tokens))throw new MathDiagnosticError("USAGE_INVALID");
  if(Buffer.byteLength(final)>16384)throw new MathDiagnosticError("OUTPUT_SIZE_LIMIT");
  let raw:unknown;try{raw=JSON.parse(final);}catch{throw new MathDiagnosticError("FINAL_JSON_INVALID");}
  if(raw && typeof raw==="object" && Object.keys(raw).some(k=>hostFields.has(k)))throw new MathDiagnosticError("HOST_FIELD_FORBIDDEN");
  let output:unknown;
  try{output=validateMath(raw);}catch(e){if(e instanceof MathDiagnosticError)throw e;throw new MathDiagnosticError("MATH_SCHEMA_INVALID");}
  return {threadId:thread,output,usage:{inputTokens:Number(usage.input_tokens),cachedInputTokens:Number(usage.cached_input_tokens),outputTokens:Number(usage.output_tokens),reasoningOutputTokens:Number(usage.reasoning_output_tokens)}};
}
export interface PinnedAdmissionParser {version:string;sourceDigest:string;role:"SOLVER"|"ADVERSARY"|"CRITIC";parse:(bytes:Uint8Array)=>AdmittedMathTransport}
const registeredParsers=new WeakSet<PinnedAdmissionParser>();
function register(version:string,sourceDigest:string,parse:(bytes:Uint8Array)=>AdmittedMathTransport,role:PinnedAdmissionParser["role"]):PinnedAdmissionParser {
  const parser=Object.freeze({version,sourceDigest,parse,role});registeredParsers.add(parser);return parser;
}
/** Arbitrary callback registration is restricted to explicit offline fixtures. */
export function pinnedParser(version:string,sourceBytes:Uint8Array,parse:(bytes:Uint8Array)=>AdmittedMathTransport,role:PinnedAdmissionParser["role"]="SOLVER"):PinnedAdmissionParser {
  if(process.env.NODE_ENV!=="test"||!process.env.VITEST)throw new MathDiagnosticError("PARSER_VERSION_UNAVAILABLE");
  return register(version,diagnosticDigest(sourceBytes),parse,role);
}
export function assertRegisteredMathParser(parser:PinnedAdmissionParser,role?:PinnedAdmissionParser["role"]) {
  if(!registeredParsers.has(parser)||role!==undefined&&parser.role!==role)throw new MathDiagnosticError("PARSER_VERSION_UNAVAILABLE");
}
const installed=new Map<string,PinnedAdmissionParser>();
export function installedMathMethodParser(role:"SOLVER"|"ADVERSARY"|"CRITIC",version=MATH_METHOD_UNIT_INSTALLED_PARSER_VERSION):PinnedAdmissionParser {
  const sourceDigest=MATH_METHOD_UNIT_FROZEN_SOURCES["src/modules/research-sandbox/math-transport-admission.ts"];
  if(version!==MATH_METHOD_UNIT_INSTALLED_PARSER_VERSION||!sourceDigest)throw new MathDiagnosticError("PARSER_VERSION_UNAVAILABLE");
  const key=`${version}:${role}`;let parser=installed.get(key);
  if(!parser){parser=register(version,sourceDigest,bytes=>parseMathTransportAdmission(bytes,raw=>role==="SOLVER"?validateLrcMethodUnitSolverOutput(raw):validateLrcMethodUnitReviewOutput(raw,role)),role);installed.set(key,parser);}
  return parser;
}
