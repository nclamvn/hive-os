import {createHash} from "node:crypto";
import {z} from "zod";
import {boundedJson} from "@/modules/research-sandbox/research-core-v3/bounded-json";
import {digest,task} from "./contracts";

/** Server-side engineering reference. Never put its golden result/lemma in
 * solving prompts or DRAFT results. This module grants no execution authority. */
export const permutationCheckerLimits=Object.freeze({originalBytes:32768,floorDigits:32,
  rationalOperations:4096,gcdIterations:4096,integerBits:4096,wallMilliseconds:1000});
export const permutationFinalSchema=z.object({proof:z.string().min(1).max(32768).refine(p=>p.trim().length>0),
  certificate:z.object({version:z.literal(1),kind:z.literal("EXPECTED_INVERSE_DESCENT_FLOOR"),
    n:z.literal("1000000000000"),floor:z.string().max(32).regex(/^(0|[1-9][0-9]*)$/)}).strict()}).strict();
const bindingSchema=z.object({runId:z.string().uuid(),finalDigest:z.string().regex(/^[a-f0-9]{64}$/),
  sourceBundleDigest:z.string().regex(/^[a-f0-9]{64}$/),taskDigest:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
export type PermutationCheckerBinding=z.infer<typeof bindingSchema>;
export interface RationalObservation {numerator:string;denominator:string}
export interface PermutationArithmetic {
  n:"1000000000000";seriesTerms:16;derivedFloor:string;
  log10:{partial:RationalObservation;remainderUpper:RationalObservation;lower:RationalObservation;upper:RationalObservation};
  harmonicBounds:{lower:RationalObservation;upper:RationalObservation;strict:true};
  expectationBounds:{lower:RationalObservation;upper:RationalObservation;strict:true};
}
export interface PermutationCheckerResult {
  status:"SUPPORTED_UNDER_LEMMA_ARITHMETIC"|"ARITHMETIC_CLAIM_MISMATCH"|"INCONCLUSIVE";
  reason:string;binding:PermutationCheckerBinding|null;
  /** candidateDigest seals exact received FINAL bytes, not repaired JSON. */
  candidateDigest:string|null;certificateDigest:string|null;claimedFloor:string|null;
  arithmetic:PermutationArithmetic|null;assumptions:string[];
  proofValidation:"NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED";
  formalProof:"NOT_ESTABLISHED";officialScore:"NOT_ESTABLISHED";
  measurements:{elapsedMilliseconds:number;rationalOperations:number;gcdIterations:number;peakIntegerBits:number};
}
const assumptions=[
  "Written maximum-root/postorder interval lemma: an inverse adjacent-value descent survives exactly when a larger label separates the reversed pair.",
  "Uniform S_n relative-order symmetry, oriented adjacent-block counting and linearity of expectation give X=(n+1)/2-H_n.",
  "Written integral comparison and finite geometric-series logarithm remainder justify the rational bounds; not machine-formalized foundations.",
  "Only the arithmetic certificate is assessed; proof text requires separate NON-FORMAL argument review. No official score, novelty or model-ability acceptance.",
];
class CheckerStop extends Error {}
type Q={n:bigint;d:bigint};
const abs=(x:bigint)=>x<BigInt("0")?-x:x;

/** Fixed 16-term computation only; candidate data never controls a loop or code. */
function reference(started:number,signal:AbortSignal|undefined,measurement:PermutationCheckerResult["measurements"]):PermutationArithmetic {
  const checkpoint=()=>{if(signal?.aborted)throw new CheckerStop("CHECKER_CANCELLED");
    if(performance.now()-started>permutationCheckerLimits.wallMilliseconds)throw new CheckerStop("CHECKER_RESOURCE_STOP");};
  const integer=(x:bigint)=>{const bits=abs(x).toString(2).length;measurement.peakIntegerBits=Math.max(measurement.peakIntegerBits,bits);
    if(bits>permutationCheckerLimits.integerBits)throw new CheckerStop("CHECKER_RESOURCE_STOP");return x;};
  const charge=()=>{checkpoint();if(++measurement.rationalOperations>permutationCheckerLimits.rationalOperations)throw new CheckerStop("CHECKER_RESOURCE_STOP");};
  const gcd=(a:bigint,b:bigint)=>{a=abs(a);b=abs(b);while(b){checkpoint();
    if(++measurement.gcdIterations>permutationCheckerLimits.gcdIterations)throw new CheckerStop("CHECKER_RESOURCE_STOP");
    [a,b]=[b,a%b];}return a;};
  const q=(n:bigint,d=BigInt("1")):Q=>{integer(n);integer(d);if(d<=BigInt("0"))throw new CheckerStop("REFERENCE_INTEGRITY_REFUSED");const g=gcd(n,d);return {n:n/g,d:d/g};};
  const add=(a:Q,b:Q)=>{charge();return q(integer(a.n*b.d+b.n*a.d),integer(a.d*b.d));};
  const sub=(a:Q,b:Q)=>add(a,{n:-b.n,d:b.d});
  const mul=(a:Q,b:Q)=>{charge();return q(integer(a.n*b.n),integer(a.d*b.d));};
  const div=(a:Q,b:Q)=>{charge();if(b.n<=BigInt("0"))throw new CheckerStop("REFERENCE_INTEGRITY_REFUSED");return q(integer(a.n*b.d),integer(a.d*b.n));};
  const less=(a:Q,b:Q)=>{charge();return integer(a.n*b.d)<integer(b.n*a.d);};
  const observe=(a:Q):RationalObservation=>({numerator:a.n.toString(),denominator:a.d.toString()});
  checkpoint();const r=q(BigInt("9"),BigInt("11")),r2=mul(r,r);let power=r,sum=q(BigInt("0"));
  for(let j=0;j<16;j++){sum=add(sum,div(power,q(BigInt(2*j+1))));power=mul(power,r2);}
  const partial=mul(q(BigInt("2")),sum),remainder=div(mul(q(BigInt("2")),power),mul(q(BigInt("33")),sub(q(BigInt("1")),r2)));
  const logLower=q(BigInt("23"),BigInt("10")),logUpper=q(BigInt("231"),BigInt("100"));
  if(!less(logLower,partial)||!less(add(partial,remainder),logUpper))throw new CheckerStop("REFERENCE_INTEGRITY_REFUSED");
  let h10=q(BigInt("0"));for(let k=1;k<=10;k++)h10=add(h10,q(BigInt("1"),BigInt(k)));
  const hLower=mul(q(BigInt("12")),logLower),hUpper=add(h10,mul(q(BigInt("11")),logUpper));
  const center=q(BigInt("1000000000001"),BigInt("2")),lower=sub(center,hUpper),upper=sub(center,hLower);
  charge();const floor=integer(lower.n/lower.d);charge();const upperFloor=integer(upper.n/upper.d);
  if(floor!==upperFloor||!less(q(floor),lower)||!less(upper,q(floor+BigInt("1"))))throw new CheckerStop("REFERENCE_INTEGRITY_REFUSED");
  checkpoint();return {n:"1000000000000",seriesTerms:16,derivedFloor:floor.toString(),
    log10:{partial:observe(partial),remainderUpper:observe(remainder),lower:observe(logLower),upper:observe(logUpper)},
    harmonicBounds:{lower:observe(hLower),upper:observe(hUpper),strict:true},
    expectationBounds:{lower:observe(lower),upper:observe(upper),strict:true}};
}

/** Caller must retain exact originals, authenticate current authority and admit
 * reviewed source before calling/adopting. A syntactically valid binding alone
 * is not proof of those facts or of upstream Codex provenance. No IO here. */
export async function checkPermutationFinal(originalBytes:Uint8Array,binding:PermutationCheckerBinding,signal?:AbortSignal):Promise<PermutationCheckerResult> {
  const started=performance.now();
  const measurements={elapsedMilliseconds:0,rationalOperations:0,gcdIterations:0,peakIntegerBits:0};
  const base={binding:null as PermutationCheckerBinding|null,candidateDigest:null as string|null,certificateDigest:null as string|null,
    claimedFloor:null as string|null,arithmetic:null as PermutationArithmetic|null,assumptions:[...assumptions],
    proofValidation:"NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED" as const,formalProof:"NOT_ESTABLISHED" as const,officialScore:"NOT_ESTABLISHED" as const,measurements};
  const result=(status:PermutationCheckerResult["status"],reason:string):PermutationCheckerResult=>{
    measurements.elapsedMilliseconds=performance.now()-started;return {...base,status,reason};};
  if(signal?.aborted)return result("INCONCLUSIVE","CHECKER_CANCELLED");
  if(!(originalBytes instanceof Uint8Array)||!originalBytes.byteLength||originalBytes.byteLength>permutationCheckerLimits.originalBytes)return result("INCONCLUSIVE","FINAL_BYTE_BOUND_REFUSED");
  // Bounded snapshot before hashing/parsing; never alter or canonicalize original.
  const bytes=Uint8Array.from(originalBytes);base.candidateDigest=createHash("sha256").update(bytes).digest("hex");
  const held=bindingSchema.safeParse(binding);
  if(!held.success||held.data.finalDigest!==base.candidateDigest||held.data.taskDigest!==digest(task))return result("INCONCLUSIVE","FINAL_BINDING_REFUSED");
  base.binding=held.data;
  if(bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf)return result("INCONCLUSIVE","FINAL_BOM_REFUSED");
  let parsed:z.infer<typeof permutationFinalSchema>;
  try {
    const text=new TextDecoder("utf-8",{fatal:true,ignoreBOM:true}).decode(bytes);
    // Existing parser's conservative 6x string accounting is separate from the
    // actual 32KiB original bound above; no larger original is admitted.
    parsed=permutationFinalSchema.parse(boundedJson(text,6*permutationCheckerLimits.originalBytes,16));
  }catch{return result("INCONCLUSIVE","FINAL_SCHEMA_REFUSED");}
  base.certificateDigest=digest(parsed.certificate);base.claimedFloor=parsed.certificate.floor;
  try {base.arithmetic=reference(started,signal,measurements);}
  catch(error){return result("INCONCLUSIVE",error instanceof CheckerStop?error.message:"REFERENCE_INTEGRITY_REFUSED");}
  if(signal?.aborted)return result("INCONCLUSIVE","CHECKER_CANCELLED");
  return base.claimedFloor===base.arithmetic.derivedFloor
    ?result("SUPPORTED_UNDER_LEMMA_ARITHMETIC","ARITHMETIC_ONLY_MATCH_PROOF_REVIEW_REQUIRED")
    :result("ARITHMETIC_CLAIM_MISMATCH","ARITHMETIC_CLAIM_MISMATCH_DOES_NOT_REFUTE_PROOF_TEXT");
}
