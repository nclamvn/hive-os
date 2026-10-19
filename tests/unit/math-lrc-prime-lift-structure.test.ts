import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe,expect,it } from "vitest";
import { canonicalJson } from "@/modules/execution-fabric/contracts";
import { PRIME_LIFT_DEPENDENCY,PRIME_LIFT_LIMITS,constructPrimeLiftStructure,validatePrimeLiftStructure,validatePrimeLiftAncestors,primeLiftBoundary,primeLiftRequest,primeLiftDistance,type PrimeLiftEvidence } from "@/modules/research-sandbox/math-lrc-prime-lift-structure";
const parents=validatePrimeLiftAncestors(readFileSync(PRIME_LIFT_DEPENDENCY.ancestorPath))!;
const actual=parents.map(parent=>constructPrimeLiftStructure({n:13,M:166,q:7,parent,boundary:"STRICT_OPEN_BAD"}));
const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v));
const source=readFileSync("scripts/operations/replay-lrc-prime-lift-structure.py","utf8");
const replay=(raw:string)=>execFileSync("python3",["-I","-S","-B","-c",source],{input:raw,encoding:"utf8",timeout:15000,maxBuffer:262144,stdio:["pipe","pipe","pipe"]});
describe("conditional prime lift structure; full subset, not full q^n domain",()=>{
  it("admits BOTH actual ancestors, all158 labelled tuples and156 constructive witnesses",()=>{
    expect(parents).toHaveLength(2);expect(actual.map(r=>r.counts)).toEqual(Array(2).fill({subset:79,grid:78,noGrid:1,gcdProper:79}));
    expect(actual.map(r=>r.deletionWitnesses)).toEqual([[6,78,52,40,32,29,23,20,18,17,15,14,12],[6,78,52,40,32,27,23,20,18,17,15,12,14]]);
    for(const r of actual){expect(validatePrimeLiftStructure(r,r.input)).toEqual(r);expect(r.gcdModulus).toBe(14);expect(r.fullGcdSubset).toBe(true);expect(new Set(r.rows.map(x=>canonicalJson(x.tuple))).size).toBe(79);for(const row of r.rows){expect(row.gcdProper).toBe(true);if(row.witness){expect(row.witness.distances.every(d=>14*d>=1162)).toBe(true);for(let i=0;i<13;i++)expect(row.witness.distances[i]).toBe(primeLiftDistance(row.witness.j,row.tuple[i],1162));}}}
  });
  for(const [n,M,parent,qs] of [[3,7,[1,2,3],[2,3,5]],[14,29,Array.from({length:14},(_,i)=>i+1),[2,3,5]],[3,8,[1,3,4],[3,5]]] as const)for(const q of qs)it(`raw conditional calibration n${n} M${M} q${q}`,()=>{
    const r=constructPrimeLiftStructure({n,M,q,parent:[...parent],boundary:"STRICT_OPEN_BAD"});expect(r.counts).toEqual({subset:1+n*(q-1),grid:n*(q-1),noGrid:1,gcdProper:1+n*(q-1)});expect(r.gcdModulus).toBe(q);expect(r.fullGcdSubset).toBe(false);expect(JSON.parse(replay(canonicalJson(primeLiftRequest([r],primeLiftBoundary())))).roots).toEqual([r]);
  });
  it("keeps actual and generic equality endpoints GOOD",()=>{expect(primeLiftBoundary()).toMatchObject({strictBad:0,closedBad:2});expect(primeLiftBoundary().distances.slice(0,2)).toEqual([83,83]);const r=constructPrimeLiftStructure({n:3,M:8,q:3,parent:[1,3,4],boundary:"STRICT_OPEN_BAD"});expect(r.deletionWitnesses).toEqual([1,3,2]);expect(r.rows.some(x=>x.witness?.distances.some(d=>4*d===24))).toBe(true);});
  for(const patch of [{n:true},{n:2},{n:15},{M:1},{M:4097},{q:4},{q:7},{q:37},{M:4096,q:31},{parent:[1,2]},{parent:[1,2,7]},{parent:[1,2,-1]},{parent:[1,2,0.5]},{boundary:"CLOSED_BAD"},{extra:true},{parent:[0,2,3]},{parent:[1,1,3]},{parent:[1,1,1]}])it(`refuses malformed/false premise ${JSON.stringify(patch)}`,()=>{expect(()=>constructPrimeLiftStructure({n:3,M:7,q:2,parent:[1,2,3],boundary:"STRICT_OPEN_BAD",...patch})).toThrow();});
  it("recomputes deletion witnesses at SAME threshold and rejects supplied false times",()=>{const bad=clone(actual[0]);bad.deletionWitnesses[0]=1;expect(validatePrimeLiftStructure(bad,actual[0].input)).toBeNull();});
  it("enforces original remaining deadline/resource before and after semantic comparison",()=>{for(const ms of [0,-1,0.5,Infinity])expect(()=>constructPrimeLiftStructure(actual[0].input,ms)).toThrow("deadline");expect(validatePrimeLiftStructure(actual[0],actual[0].input,0)).toBeNull();expect(validatePrimeLiftStructure({padding:"x".repeat(PRIME_LIFT_LIMITS.requestBytes)},actual[0].input)).toBeNull();});
  it("rejects changed/omitted/duplicate/extra/coherent witnesses WITHOUT report pin filtering",()=>{
    const mutate:((r:PrimeLiftEvidence)=>void)[]=[r=>r.rows.pop(),r=>r.rows.push(clone(r.rows[0])),r=>r.rows.reverse(),r=>r.rows[0].tuple[0]++,r=>r.rows[0].digits[0]++,r=>r.rows[0].classification="NO_GRID",r=>r.rows[0].gcdProper=false,r=>r.rows[0].exception=null,r=>r.qInverse++,r=>r.Q++,r=>r.gcdModulus=1162,r=>r.fullGcdSubset=false,r=>r.counts.grid--,r=>r.deletionWitnesses[0]++,r=>{const w=r.rows.find(x=>x.witness)!.witness!;w.j++;},r=>{const w=r.rows.find(x=>x.witness)!.witness!;w.h++;w.j+=166;},r=>{r.rows.find(x=>x.witness)!.witness!.distances[0]++;},r=>{r.rows.find(x=>x.witness)!.witness!.preservedParentDistances[0]++;}];
    for(const change of mutate){const altered=clone(actual[0]);change(altered);expect(validatePrimeLiftStructure(altered,actual[0].input)).toBeNull();expect(()=>replay(canonicalJson(primeLiftRequest([altered],primeLiftBoundary())))).toThrow();}
  });
  it("Python checks every actual row with own union enumeration and FULL original grid",()=>{const out=JSON.parse(replay(canonicalJson(primeLiftRequest(actual,primeLiftBoundary()))));expect(out).toEqual({roots:actual,control:primeLiftBoundary(),checkedEveryTupleAndWitness:true,enumeration:"UNION_OMITTED_DIVISIBLE_CONSTRAINTS_FULL_RAW_GRID"});});
  it("strict Python rejects boolversion/duplicatekeys/nonfinite/policy/type/cap/falsepremise",()=>{
    const request=primeLiftRequest(actual,primeLiftBoundary());for(const text of [canonicalJson({...request,version:true}),canonicalJson({...request,boundary:"CLOSED_BAD"}),canonicalJson({...request,extra:1}),canonicalJson(request).replace('"version":1','"version":1,"version":1'),canonicalJson(request).replace('"n":13','"n":true'),canonicalJson(request).replace('"n":13','"n":NaN'),"x".repeat(262145),canonicalJson({...request,roots:[]}),canonicalJson({...request,control:{...request.control,strictBad:2}})])expect(()=>replay(text)).toThrow();
    for(const parent of [Array(13).fill(1),[0,...actual[0].input.parent.slice(1)]]){const r=clone(actual[0]);r.input.parent=parent;expect(()=>replay(canonicalJson(primeLiftRequest([r],primeLiftBoundary())))).toThrow();}
  });
  it("refuses altered/truncated/extra ancestor bytes",()=>{const raw=readFileSync(PRIME_LIFT_DEPENDENCY.ancestorPath),bad=Buffer.from(raw);bad[0]++;expect(validatePrimeLiftAncestors(bad)).toBeNull();expect(validatePrimeLiftAncestors(raw.subarray(0,26))).toBeNull();expect(validatePrimeLiftAncestors(Buffer.concat([raw,raw]))).toBeNull();});
});
