import { assertShowcaseEnvironment } from "./source";
import { requireShowcaseTransportPermit } from "./authority";
import { ShowcaseRefusal, showcaseLimits, type ShowcaseTransport, type ShowcaseTransportRequest, type ShowcaseTransportResult } from "./contracts";

export type EngineeringQaFault="UNKNOWN"|"MALFORMED"|"OVERSIZE"|"OVERSIZE_UTF8"|"FAILED";
export function assertEngineeringQaFault(fault:EngineeringQaFault) {
  assertShowcaseEnvironment();
  if(process.env.VITEST!=="true" || !["UNKNOWN","MALFORMED","OVERSIZE","OVERSIZE_UTF8","FAILED"].includes(fault))throw new ShowcaseRefusal("AUTHORITY","Host-only isolated VITEST fixture required");
}
/** Fixed negative controls only. Not a transport selector and never reachable
 * from request/actions/HTTP/launcher arguments; native authority is unchanged. */
export async function executeEngineeringShowcaseQa(input:ShowcaseTransportRequest,fault:EngineeringQaFault):Promise<ShowcaseTransportResult> {
  assertEngineeringQaFault(fault);
  const result=await engineeringShowcaseTransport.execute(input);
  if(input.role!=="ATTEMPT")return result;
  if(fault==="UNKNOWN")return {...result,remoteEffect:"UNKNOWN",invocationStarted:true};
  if(fault==="MALFORMED")return {...result,rawOriginal:'{"proof":'};
  if(fault==="OVERSIZE")return {...result,rawOriginal:JSON.stringify({proof:"X".repeat(showcaseLimits.originalBytes+1)})};
  if(fault==="OVERSIZE_UTF8")return {...result,rawOriginal:JSON.stringify({proof:"X".repeat(showcaseLimits.originalBytes-11)+"€"+"XXXX"})};
  return {...result,outcome:"FAILED",reason:"FIXED_ENGINEERING_FAILURE_CONTROL"};
}

/** Deterministic public engineering fixture; NEVER actual model output. No
 * archived TIP078 bytes are loaded or admitted as a fresh native response. */
export const engineeringShowcaseTransport: ShowcaseTransport = Object.freeze({
  provenance: "ENGINEERING_ONLY" as const,
  async readiness() { return { status: "BLOCKED_UNESTABLISHED" as const, reason: "NO_MODEL_EFFECT_ENGINEERING_FIXTURE_ONLY", evidenceDigest: null }; },
  async execute(input:ShowcaseTransportRequest) {
    assertShowcaseEnvironment(); requireShowcaseTransportPermit(input.permit, input);
    if (input.signal.aborted) throw new Error("ENGINEERING_ABORTED");
    let a = [BigInt(2)], b = [BigInt(0), BigInt(1)];
    for (let degree = 2; degree <= 19; degree++) { const c = Array<bigint>(degree + 1).fill(BigInt(0)); for (let i = 0; i < b.length; i++) c[i + 1] += b[i]; for (let i = 0; i < a.length; i++) c[i] -= a[i]; a = b; b = c; }
    let value = BigInt(0); for (const c of b.toReversed()) value = value * BigInt(19) + c;
    const certificateJson = `{"coefficients":[${b.join(",")}],"claimed_value":${value}}`;
    const proof = "ENGINEERING_ONLY deterministic control, not an AI proof attempt. Exact construction replay is reported under the separately reviewed written cyclotomic irreducibility/projective-closure lemma; no formal or official acceptance.";
    const output = input.role === "FINAL" ? { proof, certificateJson } : input.role === "CRITIC" ? { critique: "ENGINEERING_ONLY controlled criticism; written lemma assumptions remain explicit." }
      : input.role === "POSTREVIEW" ? { status: "INCONCLUSIVE", reasoning: "ENGINEERING_ONLY synthetic review, excluded from actual mathematical reviewer acceptance." } : { proof };
    const rawOriginal = JSON.stringify(output);
    return { outcome: "COMPLETED" as const, rawOriginal, rawTrace: new TextEncoder().encode(JSON.stringify({ provenance: "ENGINEERING_ONLY", role: input.role })),
      threadId: `engineering:${input.runId}:${input.role}`, usage: null, actualModelVersion: null, elapsedMilliseconds: 0,
      invocationStarted: false, remoteEffect: "NONE" as const, reason: "FIXED_ENGINEERING_NO_MODEL_CALL" };
  },
});
