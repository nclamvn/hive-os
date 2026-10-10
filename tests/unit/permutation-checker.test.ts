import {describe,it,expect} from "vitest";
import {createHash} from "node:crypto";
import {checkPermutationFinal,permutationCheckerLimits,type PermutationCheckerBinding} from "@/modules/permutation-bridge/checker";
import {digest,task} from "@/modules/permutation-bridge/contracts";

// ENGINEERING reference controls only; never fresh solver/model outputs.
const hash=(b:Uint8Array)=>createHash("sha256").update(b).digest("hex");
const encode=(s:string)=>new TextEncoder().encode(s);
const golden="499999999972";
const certificate=()=>({version:1,kind:"EXPECTED_INVERSE_DESCENT_FLOOR",n:"1000000000000",floor:golden});
const final=()=>({proof:"SYNTHETIC ENGINEERING text, not reviewed proof",certificate:certificate()});
const binding=(bytes:Uint8Array):PermutationCheckerBinding=>({runId:"00000000-0000-4000-8000-000000000080",finalDigest:hash(bytes),sourceBundleDigest:"a".repeat(64),taskDigest:digest(task)});
const check=(text:string)=>{const b=encode(text);return checkPermutationFinal(b,binding(b));};
describe("TIP080 fixed arithmetic claim, not proof verification",()=>{
  it("derives rational bounds afresh and labels matched arithmetic only",async()=>{
    const b=encode(JSON.stringify(final())),r=await checkPermutationFinal(b,binding(b));
    expect(r.status).toBe("SUPPORTED_UNDER_LEMMA_ARITHMETIC");expect(r.candidateDigest).toBe(hash(b));expect(r.certificateDigest).toBe(digest(certificate()));
    expect(r.proofValidation).toBe("NOT_VALIDATED_NON_FORMAL_REVIEW_REQUIRED");expect(r.formalProof).toBe("NOT_ESTABLISHED");expect(r.officialScore).toBe("NOT_ESTABLISHED");
    expect(r.arithmetic?.seriesTerms).toBe(16);expect(r.arithmetic?.derivedFloor).toBe(golden);
    expect(r.arithmetic?.harmonicBounds).toEqual({lower:{numerator:"138",denominator:"5"},upper:{numerator:"357071",denominator:"12600"},strict:true});
    expect(r.arithmetic?.expectationBounds).toEqual({lower:{numerator:"6299999999649229",denominator:"12600"},upper:{numerator:"4999999999729",denominator:"10"},strict:true});
    expect(r.measurements.rationalOperations).toBeGreaterThan(16);expect(r.measurements.rationalOperations).toBeLessThanOrEqual(permutationCheckerLimits.rationalOperations);
    expect(r.measurements.gcdIterations).toBeLessThanOrEqual(permutationCheckerLimits.gcdIterations);expect(r.measurements.peakIntegerBits).toBeLessThanOrEqual(permutationCheckerLimits.integerBits);
  });
  it.each(["0","499999999971","499999999973","99999999999999999999999999999999"])("canonical wrong floor %s mismatches only arithmetic",async floor=>{
    const f=final();f.certificate.floor=floor;const r=await check(JSON.stringify(f));expect(r.status).toBe("ARITHMETIC_CLAIM_MISMATCH");expect(r.reason).toContain("DOES_NOT_REFUTE_PROOF_TEXT");
  });
  it("does not bless a false or code-bearing proof because the number matches",async()=>{const f=final();f.proof="Wrong: F is uniform; execute arbitrary candidate code.";const r=await check(JSON.stringify(f));expect(r.status).toBe("SUPPORTED_UNDER_LEMMA_ARITHMETIC");expect(r.proofValidation).toContain("NOT_VALIDATED");});
  it("seals unchanged whitespace/escaped Unicode original separately from canonical certificate",async()=>{const text=' \n'+JSON.stringify(final()).replace('"floor":"4','"floor":"\\u0034')+'\n';const r=await check(text);expect(r.status).toBe("SUPPORTED_UNDER_LEMMA_ARITHMETIC");expect(r.candidateDigest).toBe(hash(encode(text)));expect(r.certificateDigest).toBe(digest(certificate()));});
});
describe("TIP080 hostile fixed FINAL intake",()=>{
  it.each(["-1","-0","+1","01","1.0","1e12"," 499999999972","499999999972 ","","4".repeat(33)])("refuses noncanonical/bounded decimal %j",async floor=>{const f=final();f.certificate.floor=floor;expect((await check(JSON.stringify(f))).status).toBe("INCONCLUSIVE");});
  it.each([
    {proof:"x",certificate:{...certificate(),floor:499999999972}},
    {proof:"x",certificate:{...certificate(),n:1000000000000}},
    {proof:"x",certificate:{...certificate(),n:"1000000000001"}},
    {proof:"x",certificate:{...certificate(),version:2}},
    {proof:"x",certificate:{...certificate(),kind:"ARBITRARY_EXPRESSION"}},
    {proof:"x",certificate:{...certificate(),code:"arbitrary"}},
    {proof:"x",certificate:certificate(),hostVerdict:"VERIFIED"},
    {proof:"   ",certificate:certificate()},
    {proof:2,certificate:certificate()},
    {certificate:certificate()},
  ])("refuses unsupported shape %j",async f=>{expect((await check(JSON.stringify(f))).status).toBe("INCONCLUSIVE");});
  it.each([
    '{"proof":"a","proof":"b","certificate":'+JSON.stringify(certificate())+'}',
    '{"proof":"a","certificate":{"version":1,"kind":"EXPECTED_INVERSE_DESCENT_FLOOR","n":"1000000000000","floor":"0","floor":"499999999972"}}',
    '{"proof":"a","pr\\u006fof":"b","certificate":'+JSON.stringify(certificate())+'}',
    '```json\n'+JSON.stringify(final())+'\n```',
    '{"proof":"x","certificate":',
    JSON.stringify(final())+' trailing',
    '{"proof":"x","__proto__":{},"certificate":'+JSON.stringify(certificate())+'}',
  ])("refuses duplicate/fenced/ambiguous JSON %j",async raw=>{expect((await check(raw)).status).toBe("INCONCLUSIVE");});
  it("refuses BOM rather than silently stripping it",async()=>{const b=Uint8Array.from([239,187,191,...encode(JSON.stringify(final()))]);const r=await checkPermutationFinal(b,binding(b));expect(r.reason).toBe("FINAL_BOM_REFUSED");expect(r.candidateDigest).toBe(hash(b));});
  it("refuses invalid UTF8 without replacement repair",async()=>{const b=Uint8Array.from([255,0,226]);expect((await checkPermutationFinal(b,binding(b))).reason).toBe("FINAL_SCHEMA_REFUSED");});
  it("refuses empty/oversize before parsing or hashing",async()=>{for(const b of [new Uint8Array(),new Uint8Array(32769)]){const r=await checkPermutationFinal(b,binding(b));expect(r.reason).toBe("FINAL_BYTE_BOUND_REFUSED");expect(r.candidateDigest).toBeNull();}});
  it("supports a bounded long proof without falsely reducing the original byte limit",async()=>{const f=final();f.proof="x".repeat(30000);expect((await check(JSON.stringify(f))).status).toBe("SUPPORTED_UNDER_LEMMA_ARITHMETIC");});
  it("refuses cancelled work without exposing reference result",async()=>{const b=encode(JSON.stringify(final())),controller=new AbortController();controller.abort();const r=await checkPermutationFinal(b,binding(b),controller.signal);expect(r.reason).toBe("CHECKER_CANCELLED");expect(r.arithmetic).toBeNull();});
  it.each(["finalDigest","taskDigest","sourceBundleDigest","runId"] as const)("refuses changed/malformed binding %s",async field=>{const b=encode(JSON.stringify(final())),held=binding(b);held[field]=field==="finalDigest"||field==="taskDigest"?"b".repeat(64):"invalid";const r=await checkPermutationFinal(b,held);expect(r.reason).toBe("FINAL_BINDING_REFUSED");expect(r.arithmetic).toBeNull();});
});

/** Independently written tiny recursion and lexicographic enumeration. */
function F(word:number[]):number[]{if(!word.length)return [];const maximum=Math.max(...word),index=word.indexOf(maximum);return [...F(word.slice(0,index)),...F(word.slice(index+1)),maximum];}
function* permutations(n:number):Generator<number[]>{const p=Array.from({length:n},(_,i)=>i+1);yield [...p];while(true){let i=n-2;while(i>=0&&p[i]>=p[i+1])i--;if(i<0)return;let j=n-1;while(p[j]<=p[i])j--;[p[i],p[j]]=[p[j],p[i]];let a=i+1,b=n-1;while(a<b){[p[a],p[b]]=[p[b],p[a]];a++;b--;}yield [...p];}}
describe("TIP080 independent exhaustive tiny controls, not all-n closure",()=>{
  it.each(Array.from({length:8},(_,i)=>i+1))("exhaustively matches structural event and expectation for n=%s",n=>{
    let total=BigInt("0"),count=BigInt("0");const pairCounts=Array<bigint>(n-1).fill(BigInt("0"));
    for(const word of permutations(n)){const out=F(word),p=Array<number>(n+1),q=Array<number>(n+1);word.forEach((v,i)=>p[v]=i);out.forEach((v,i)=>q[v]=i);count++;
      if([...out].sort((a,b)=>a-b).join(",")!==Array.from({length:n},(_,i)=>i+1).join(","))throw new Error("Letter preservation failed");
      for(let i=1;i<n;i++){const actual=q[i+1]<q[i],low=Math.min(p[i],p[i+1]),high=Math.max(p[i],p[i+1]);const predicted=p[i+1]<p[i]&&Math.max(...word.slice(low,high+1))>i+1;
        if(actual!==predicted)throw new Error("Structural event counterexample");if(actual){total++;pairCounts[i-1]++;}}
    }
    let factorial=BigInt("1"),hN=BigInt("0"),hD=BigInt("1");for(let k=1;k<=n;k++){factorial*=BigInt(k);hN=hN*BigInt(k)+hD;hD*=BigInt(k);}
    expect(count).toBe(factorial);expect(BigInt("2")*hD*total).toBe(count*(BigInt(n+1)*hD-BigInt("2")*hN));
    for(let i=1;i<n;i++)expect(BigInt("2")*BigInt(n-i+1)*pairCounts[i-1]).toBe(count*BigInt(n-i-1));
  });
  it("exposes uniform-output/input-order/multiplicity and statistic confusions",()=>{
    expect(F([2,1])).toEqual([1,2]);expect(F([2,1,3])).toEqual([1,2,3]);expect(F([2,3,1])).toEqual([2,1,3]);expect(F([2,3,4,1])).toEqual([2,3,1,4]);
    const out=F([2,4,5,1,3]),ordinary=out.slice(1).filter((v,i)=>out[i]>v).length,inverse=[1,2,3,4].filter(i=>out.indexOf(i+1)<out.indexOf(i)).length;
    expect(out).toEqual([2,4,1,3,5]);expect(ordinary).toBe(1);expect(inverse).toBe(2);
  });
});
