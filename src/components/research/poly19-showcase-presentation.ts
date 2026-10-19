import { createHash } from "node:crypto";
import { assertNoCredentialMaterial } from "@/modules/execution-fabric/contracts";
import type { Poly19ShowcaseDossier,Poly19ShowcaseView } from "@/modules/research-showcase/contracts";
import type { Poly19ProofPresentation, Poly19StageKey } from "./poly19-proof-panel";

const hash=(text:string)=>createHash("sha256").update(text,"utf8").digest("hex");
/** Observation and bounded export only; never mints execution/checker authority. */
export function projectPoly19Showcase(view:Poly19ShowcaseView):Poly19ProofPresentation {
  if(view.complete!==true || !["LIVE_NATIVE","ENGINEERING_ONLY"].includes(view.provenance)) throw new Error("SHOWCASE_OBSERVATION_REFUSED");
  const roles=view.roles.map(r=>{
    if(r.originalText!==null && (!r.originalComplete || !r.original || Buffer.byteLength(r.originalText,"utf8")>32768 || hash(r.originalText)!==r.original.digest || Buffer.byteLength(r.originalText,"utf8")!==r.original.bytes)) throw new Error("SHOWCASE_ORIGINAL_REFUSED");
    if(r.originalText!==null) {
      assertNoCredentialMaterial(r.originalText);
      let decoded:unknown;
      try {decoded=JSON.parse(r.originalText);} catch { /* retain malformed originals as data */ }
      assertNoSecretFields(decoded);
    }
    return {role:r.role,status:r.outcome??r.fence,original:r.originalText,digest:r.original?.digest??null,requestedModel:view.provenance==="ENGINEERING_ONLY"?"NOT_INVOKED_ENGINEERING_ONLY":view.requestedModel,servedModel:r.actualModelVersion,threadId:r.threadId,inputTokens:r.usage?.inputTokens??null,outputTokens:r.usage?.outputTokens??null,elapsedSeconds:r.elapsedMilliseconds===null?null:r.elapsedMilliseconds/1000};
  });
  const order:Poly19StageKey[]=["ATTEMPT","CRITIC","FINAL","EXACT_REPLAY","POSTREVIEW"];
  return {runId:view.runId,missionId:view.missionId,version:view.version,provenance:view.provenance,status:view.status,
    sourceDigest:view.sourceBundleDigest,eventCut:`${view.eventCut.sequence}:${view.eventCut.digest}`,
    canRevoke:view.revokedAt===null && !["COMPLETED","FAILED","RESOURCE_STOP","REVOKED"].includes(view.status),roles,
    stages:order.map(key=>({key,status:key==="EXACT_REPLAY" ? view.exactResult?.status??view.state.replayFence : roles.find(r=>r.role===key)?.status??"NOT_STARTED"})),
    exact:view.exactResult?{status:view.exactResult.status,assumptions:view.exactResult.assumptions,operations:view.exactResult.measurements.exactArithmeticOperations,elapsedSeconds:view.exactResult.measurements.elapsedSeconds}:null,
    fault:view.faultResult?{status:view.faultResult.status,originalDigest:view.state.certificate?.digest??"UNKNOWN",changedDigest:view.state.faultCertificate?.digest??"UNKNOWN"}:null,
    reservedRequests:view.state.spent.requests,nextAction:view.state.reason??view.state.nextAction,
    proofText:view.proof,informalStatus:view.postreview?.status??null,certificateJson:view.certificateJson};
}

function assertNoSecretFields(value:unknown) {
  if(typeof value==="string") {assertNoCredentialMaterial(value);return;}
  if(Array.isArray(value)) {value.forEach(assertNoSecretFields);return;}
  if(value&&typeof value==="object") for(const [key,entry] of Object.entries(value)) {
    if(/^(api[_-]?key|password|database_url|authorization|cookies?|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token)$/i.test(key)) throw new Error("SHOWCASE_CREDENTIAL_EXPORT_REFUSED");
    assertNoSecretFields(entry);
  }
}
/** Privacy-only shadow of a bounded incomplete prefix; never returned as proof. */
function assertPrivatePrefix(bytes:Buffer) {
  const raw=bytes.toString("utf8"); // Replacement decoding only for defensive scan.
  assertNoCredentialMaterial(raw);
  let shadow="";
  const escapes:Record<string,string>={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"};
  for(let i=0;i<raw.length;i++) {
    if(raw[i]!=="\\") {shadow+=raw[i];continue;}
    const escaped=raw[++i];
    if(escaped==="u") {
      const hex=raw.slice(i+1,i+5);
      if(!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Error("SHOWCASE_CREDENTIAL_PREFIX_REFUSED");
      shadow+=String.fromCharCode(parseInt(hex,16));i+=4;
    } else if(escaped!==undefined && Object.hasOwn(escapes,escaped)) shadow+=escapes[escaped];
    else throw new Error("SHOWCASE_CREDENTIAL_PREFIX_REFUSED");
  }
  assertNoCredentialMaterial(shadow);
  if(/"(?:api[_-]?key|password|database_url|authorization|cookies?|set-cookie|access[_-]?token|refresh[_-]?token|id[_-]?token)"\s*:/i.test(shadow)) throw new Error("SHOWCASE_CREDENTIAL_PREFIX_REFUSED");
  // A residual escape could conceal another encoded string. Refuse conservatively,
  // including ambiguous truncation, rather than repairing/recursively interpreting it.
  if(shadow.includes("\\")) throw new Error("SHOWCASE_CREDENTIAL_PREFIX_REFUSED");
}
export function poly19Export(view:Poly19ShowcaseView,format:"json"|"text",portable?:Poly19ShowcaseDossier) {
  projectPoly19Showcase(view); // Bound originals and verify their exact seals.
  if(format==="text") {
    const final=view.roles.find(r=>r.role==="FINAL");
    if(!final?.originalText || !final.originalComplete || !final.original || view.originalFinal!==final.originalText) throw new Error("SHOWCASE_FINAL_NOT_RETAINED");
    return {body:final.originalText,type:"text/plain; charset=utf-8",extension:"txt"};
  }
  if(!portable || portable.view.runId!==view.runId || portable.view.eventCut.digest!==view.eventCut.digest) throw new Error("SHOWCASE_PORTABLE_DOSSIER_REQUIRED");
  if(!Array.isArray(portable.incompleteOriginals) || portable.incompleteOriginals.length>4) throw new Error("SHOWCASE_PREFIX_EXPORT_REFUSED");
  const incompleteRoles=new Set<string>();
  for(const prefix of portable.incompleteOriginals) {
    const role=view.roles.find(r=>r.role===prefix.role);
    if(incompleteRoles.has(prefix.role) || view.roles.filter(r=>r.role===prefix.role).length!==1 || prefix.complete!==false || !role?.original || role.originalComplete || role.originalText!==null || prefix.digest!==role.original.digest || prefix.bytes!==role.original.bytes || !Number.isSafeInteger(prefix.bytes) || prefix.bytes<0 || prefix.bytes>32768 || prefix.base64.length>43692 || !/^[A-Za-z0-9+/]*={0,2}$/.test(prefix.base64)) throw new Error("SHOWCASE_PREFIX_EXPORT_REFUSED");
    const bytes=Buffer.from(prefix.base64,"base64");
    if(bytes.length!==prefix.bytes || bytes.toString("base64")!==prefix.base64 || createHash("sha256").update(bytes).digest("hex")!==prefix.digest) throw new Error("SHOWCASE_PREFIX_EXPORT_REFUSED");
    assertPrivatePrefix(bytes);incompleteRoles.add(prefix.role);
  }
  if(view.roles.some(r=>r.original&&!r.originalComplete&&!incompleteRoles.has(r.role))) throw new Error("SHOWCASE_PREFIX_EXPORT_REFUSED");
  for(const trace of portable.traces) {
    if(trace.bytes>524288 || trace.base64.length>699052 || !/^[A-Za-z0-9+/]*={0,2}$/.test(trace.base64)) throw new Error("SHOWCASE_TRACE_EXPORT_REFUSED");
    const bytes=Buffer.from(trace.base64,"base64"),digest=createHash("sha256").update(bytes).digest("hex");
    if(bytes.length!==trace.bytes || bytes.toString("base64")!==trace.base64 || digest!==trace.digest) throw new Error("SHOWCASE_TRACE_EXPORT_REFUSED");
    if(!trace.complete) assertPrivatePrefix(bytes);
    assertNoCredentialMaterial(bytes.toString("utf8"));
    for(const line of bytes.toString("utf8").split("\n")) {let value:unknown;try {value=JSON.parse(line);} catch {continue;} assertNoSecretFields(value);}
  }
  if(view.faultCertificateJson!==null && (Buffer.byteLength(view.faultCertificateJson)>16384 || hash(view.faultCertificateJson)!==view.state.faultCertificate?.digest)) throw new Error("SHOWCASE_FAULT_EXPORT_REFUSED");
  const dossier={schema:"hive-os.poly19-showcase-export.v1",runId:view.runId,organizationId:view.organizationId,workspaceId:view.workspaceId,actorUserId:view.actorUserId,commandId:view.commandId,missionId:view.missionId,provenance:view.provenance,status:view.status,
    task:view.task,taskDigest:view.taskDigest,sourceBundleDigest:view.sourceBundleDigest,authorityEpoch:view.authorityEpoch,eventCut:view.eventCut,
    configuredNativeModel:view.requestedModel,modelInvocation:view.provenance==="ENGINEERING_ONLY"?"NOT_INVOKED_ENGINEERING_ONLY":"INSPECT_RETAINED_ROLE_EFFECTS",
    roles:view.roles.map(r=>({role:r.role,actionId:r.actionId,fence:r.fence,promptDigest:r.promptDigest,originalDigest:r.original?.digest??null,
      originalBytes:r.original?.bytes??null,originalText:r.originalText,originalComplete:r.originalComplete,traceComplete:r.traceComplete,validated:r.validated,threadId:r.threadId,usage:r.usage,actualModelVersion:r.actualModelVersion,
      startedAt:r.startedAt,returnedAt:r.returnedAt,elapsedMilliseconds:r.elapsedMilliseconds,outcome:r.outcome,remoteEffect:r.remoteEffect})),
    proof:view.proof,originalFinal:view.originalFinal,certificateJson:view.certificateJson,certificateDigest:view.certificateDigest,
    exactResult:view.exactResult,postreview:view.postreview,faultResult:view.faultResult,faultCertificateJson:view.faultCertificateJson,
    faultProvenance:"ENGINEERING_ONLY",faultCertificateDigest:view.state.faultCertificate?.digest??null,
    limits:view.limits,reservations:view.state.spent,events:view.events,eventPayloads:portable.eventPayloads,sourceBundle:portable.sourceBundle,traces:portable.traces,incompleteOriginals:portable.incompleteOriginals,
    unknown:{currency:"UNKNOWN",hiddenCalls:"UNKNOWN",servedBackendVersion:"UNKNOWN"},
    ceiling:"Written trusted lemma, not formal proof, official Epoch score, novelty or benchmark superiority"};
  const body=JSON.stringify(dossier,null,2)+"\n";
  assertNoSecretFields(dossier);
  assertNoCredentialMaterial(body);
  if(Buffer.byteLength(body,"utf8")>4194304) throw new Error("SHOWCASE_EXPORT_BYTE_LIMIT");
  return {body,type:"application/json; charset=utf-8",extension:"json"};
}
