import {describe,it,expect} from "vitest";
import {parseMathTransportAdmission,observeMathTransportAccounting} from "@/modules/research-sandbox/math-transport-admission";
import {safeDiagnosticSummary} from "@/modules/research-sandbox/math-transport-diagnostics";
const accounting={input_tokens:10,cached_input_tokens:1,output_tokens:5,reasoning_output_tokens:2};
const events=(output:unknown={argument:"known scoped math"})=>[
 {type:"thread.started",thread_id:"actual-thread"},{type:"item.completed",item:{type:"agent_message",text:JSON.stringify(output)}},{type:"turn.completed",usage:accounting}];
const bytes=(e:unknown[]=events())=>Buffer.from(e.map(v=>JSON.stringify(v)).join("\n"));
const validate=(raw:unknown)=>{if(!raw||typeof raw!=="object"||!("argument" in raw))throw new Error("secret validation value");return raw;};
describe("TIP065 deterministic raw transport admission",()=>{
 it("accepts exact metadata without retaining science",()=>{expect(parseMathTransportAdmission(bytes(),validate)).toMatchObject({threadId:"actual-thread",usage:{inputTokens:10}});});
 it.each([
  [Buffer.from([0xff]),"UTF8_INVALID"],[Buffer.from("{bad"),"JSONL_INVALID"],
  [bytes([{type:"unknown"} as never]),"PROTOCOL_UNSUPPORTED"],
  [bytes([{type:"item.completed",item:{type:"command_execution"}} as never]),"TOOL_ACTIVITY_OBSERVED"],
  [bytes([{type:"turn.failed"} as never]),"TURN_FAILED"],
  [bytes([]),"CONTEXT_INVALID"],
  [bytes(events().map(e=>e.type==="turn.completed"?{...e,usage:{...accounting,input_tokens:0}}:e)),"USAGE_INVALID"],
  [bytes(events().map(e=>e.type==="item.completed"?{...e,item:{type:"agent_message",text:"bad-json"}}:e)),"FINAL_JSON_INVALID"],
  [bytes(events({lrcMethodUnitFiniteEvidence:{checker:true},argument:"x"})),"HOST_FIELD_FORBIDDEN"],
  [bytes(events({argument:"x".repeat(17000)})),"OUTPUT_SIZE_LIMIT"],
  [bytes(events({wrong:"secret"})),"MATH_SCHEMA_INVALID"],
 ])("precise bounded refusal %s -> %s",(input,code)=>{expect(()=>parseMathTransportAdmission(input as Buffer,validate)).toThrow(String(code));});
 it.each(["thread.started","turn.completed"])("duplicate %s cannot fabricate coherent accounting",type=>{const e=events();e.push(e.find(x=>x.type===type)!);expect(observeMathTransportAccounting(bytes(e))).toMatchObject({status:"UNAVAILABLE",usage:null});expect(()=>parseMathTransportAdmission(bytes(e),validate)).toThrow("CONTEXT_INVALID");});
 it("recovers actual unique accounting despite mathematical refusal",()=>{expect(()=>parseMathTransportAdmission(bytes(events({wrong:true})),validate)).toThrow();expect(observeMathTransportAccounting(bytes(events({wrong:true})))).toMatchObject({status:"TRANSPORT_OBSERVED_UNACCEPTED",threadId:"actual-thread",usage:{outputTokens:5}});});
 it.each([Buffer.from([0xff]),Buffer.from("notjson")])("malformed bytes have unavailable not zero usage",input=>{expect(observeMathTransportAccounting(input)).toEqual({status:"UNAVAILABLE",threadId:null,usage:null});});
 it("no arbitrary raw field can be rendered as safe summary",()=>{expect(()=>safeDiagnosticSummary({raw:"password://secret"})).toThrow();});
});
