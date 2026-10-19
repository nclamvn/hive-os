import { MathDiagnosticError,diagnosticDigest,type DiagnosticBinding } from "@/modules/research-sandbox/math-transport-diagnostics";
import {assertRegisteredMathParser,type PinnedAdmissionParser} from "@/modules/research-sandbox/math-transport-admission";
import type { DiagnosticGrant } from "./math-diagnostic-auth";
import type { MathDiagnosticCaptureStore } from "./math-diagnostic-capture";

/** Captured code is DATA; parser comes only from the host pinned registry. No research writes. */
export async function replayMathDiagnosticCapture(input:{store:MathDiagnosticCaptureStore;grant:DiagnosticGrant;binding:DiagnosticBinding;captureId:string;
  parser:PinnedAdmissionParser;expectedManifestDigest:string;expectedPins:Record<string,string>;counterfactual?:boolean}) {
  assertRegisteredMathParser(input.parser);
  const {manifest,stdout}=await input.store.readCapture(input.grant,input.binding,input.captureId);
  assertRegisteredMathParser(input.parser,manifest.binding.role);
  if(diagnosticDigest(JSON.stringify(manifest))!==input.expectedManifestDigest)throw new MathDiagnosticError("CAPTURE_INTEGRITY_REFUSED");
  if(manifest.completeness!=="COMPLETE")throw new MathDiagnosticError("CAPTURE_INCOMPLETE");
  if(!input.counterfactual && (manifest.parserVersion!==input.parser.version||manifest.sourcePins.parser!==input.parser.sourceDigest))throw new MathDiagnosticError("PARSER_VERSION_UNAVAILABLE");
  if(Object.keys(manifest.sourcePins).length!==Object.keys(input.expectedPins).length||Object.entries(input.expectedPins).some(([k,v])=>manifest.sourcePins[k]!==v))throw new MathDiagnosticError("SOURCE_PIN_DRIFT");
  try{const result=input.parser.parse(stdout);return {authority:"NO_RESEARCH_RETENTION" as const,mode:input.counterfactual?"COUNTERFACTUAL":"PINNED_ORIGINAL",boundary:"PARSER_ACCEPTED" as const,
    transportAccounting:{status:"TRANSPORT_OBSERVED_UNACCEPTED",threadId:result.threadId,usage:result.usage}};}
  catch(e){return {authority:"NO_RESEARCH_RETENTION" as const,mode:input.counterfactual?"COUNTERFACTUAL":"PINNED_ORIGINAL",boundary:"PARSER_REFUSED" as const,
    reason:e instanceof MathDiagnosticError?e.code:"MATH_SCHEMA_INVALID",transportAccounting:manifest.accounting};}
}
