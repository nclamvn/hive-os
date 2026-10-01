import { beforeAll, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import * as primary from "../../scripts/operations/block-coverage";
import { blockCoveragePacket, BLOCK_COVERAGE_INPUTS, BLOCK_COVERAGE_LIMITS, analyzeBlockCoverageAbstract,
  analyzeBlockCriterionAbstract, reconstructBlockCoverageWitness, finalizeBlockCoverageForOutput, blockCoverageDigest,
  validateBlockCoverageFactors, type BlockCoverageFactors, type BlockCoverageHalf, type BlockCoverageEntry, type BlockCoveragePacket } from "../../scripts/operations/block-coverage";
const B=BigInt;
let packet:BlockCoveragePacket,clockCalls=0;
beforeAll(()=>{packet=blockCoveragePacket({now:()=>{clockCalls++;return 0;}});});
function gcd(a:bigint,b:bigint){while(b)[a,b]=[b,a%b];return a;}
function inverse(a:bigint,m:bigint){let [r,s,t,u]=[a,m,B(1),B(0)];while(s){const q=r/s;[r,s]=[s,r-q*s];[t,u]=[u,t-q*u];}if(r!==B(1))throw new Error("nonunit");return (t%m+m)%m;}
function pair(factors:BlockCoverageFactors,z:readonly string[]){let u=B(1),v=B(1);factors.forEach(([q],i)=>{if(Number(z[i])>0)u*=B(q)**B(z[i]);if(Number(z[i])<0)v*=B(q)**B(-Number(z[i]));});return {u,v};}
function referenceHalf(factors:BlockCoverageFactors,half:BlockCoverageHalf,m:number,K:readonly BlockCoverageEntry[]){
  const indices=half.factorIndices.map(Number),T=indices.reduce((p,i)=>p*B(factors[i][0])**B(factors[i][1]),B(1)),ds:bigint[]=[];
  for(let d=B(1);d*d<=T;d++)if(T%d===B(0)){ds.push(d);if(d*d!==T)ds.push(T/d);}ds.sort((a,b)=>a<b?-1:a>b?1:0);
  const map=new Map<number,{mu:bigint;u:bigint;v:bigint;residue:number;exponents:string[]}>();
  for(const u of ds)for(const v of ds){if(u*v>T||T%(u*v)||gcd(u,v)!==B(1))continue;
    const residue=Number(u*inverse(v,B(m))%B(m)),coset=Math.min(...K.map(k=>Number(B(k.residue)*B(residue)%B(m)))),old=map.get(coset);
    const exponents=factors.map((_,i)=>{if(!indices.includes(i))return "0";let a=u,b=v,z=0;const q=B(factors[i][0]);while(a%q===B(0)){a/=q;z++;}while(b%q===B(0)){b/=q;z--;}return String(z);});
    if(!old)map.set(coset,{mu:B(1),u,v,residue,exponents});
    else{old.mu++;if(u<old.u||u===old.u&&v<old.v)Object.assign(old,{u,v,residue,exponents});}}
  const N=[...map.values()].reduce((s,v)=>s+v.mu,B(0)),E=[...map.values()].reduce((s,v)=>s+v.mu*v.mu,B(0));
  return {factorIndices:half.factorIndices,N:String(N),E:String(E),L:String((N*N+E-B(1))/E),frequencies:[...map.entries()].sort(([a],[b])=>a-b).map(([coset,e])=>({coset:String(coset),mu:String(e.mu),u:String(e.u),v:String(e.v),residue:String(e.residue),exponents:e.exponents}))};
}
function subgroupReference(D:readonly string[],m:number){
  const multiply=(a:number,b:number)=>Number(B(a)*B(b)%B(m)),cyclic=D.map(Number).map(g=>{const S=new Set([1]);let x=g;while(!S.has(x)){S.add(x);x=multiply(x,g);}return [...S];});
  const groups=new Map<string,number[]>([["1",[1]]]),queue:number[][]=[[1]];
  for(const H of queue)for(const C of cyclic){const joined=[...new Set(H.flatMap(a=>C.map(b=>multiply(a,b))))].sort((a,b)=>a-b),key=joined.join(",");if(!groups.has(key)){groups.set(key,joined);queue.push(joined);}}
  return [...groups.values()].filter(H=>H.length<D.length).sort((a,b)=>{if(a.length!==b.length)return a.length-b.length;for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;}).map(H=>H.map(String));
}
describe("all-subgroup allocated block coverage",()=>{
  it("retains exact191 frozen ordered rows and separated cohorts",()=>{
    expect(packet.status).toBe("COMPLETE");expect(packet.inputs).toEqual(BLOCK_COVERAGE_INPUTS);expect(packet.limits).toEqual(BLOCK_COVERAGE_LIMITS);expect(packet.rows).toHaveLength(191);
    expect(packet.rows.slice(71).map(r=>r.id)).toEqual(BLOCK_COVERAGE_INPUTS.rows.slice(71).map(r=>r.id));
    expect(packet.summary.counts).toEqual({SINGLE_CHAIN_CERTIFIED:"25",BLOCK_CHAIN_CERTIFIED:"8",ENERGY_CERTIFIED:"2",NOT_CERTIFIED:"156"});
    expect(packet.summary.cohorts.EXPOSED_71).toEqual({SINGLE_CHAIN_CERTIFIED:"4",BLOCK_CHAIN_CERTIFIED:"0",ENERGY_CERTIFIED:"0",NOT_CERTIFIED:"67"});
    expect(packet.summary.cohorts.PRIMALITY_ONLY_120).toEqual({SINGLE_CHAIN_CERTIFIED:"21",BLOCK_CHAIN_CERTIFIED:"8",ENERGY_CERTIFIED:"2",NOT_CERTIFIED:"89"});
    expect(packet.contentDigest).toBe("4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347");
    expect(Object.isFrozen(BLOCK_COVERAGE_INPUTS.newCohort.roots)).toBe(true);expect(Object.isFrozen(BLOCK_COVERAGE_INPUTS.rows[190])).toBe(true);
  });
  it("keeps identity, nonmaximal and noncyclic subgroups even after failure",()=>{
    const r=analyzeBlockCriterionAbstract(15,[{residue:2,exponent:1},...Array.from({length:5},()=>({residue:11,exponent:1}))]);
    expect(r.decision).toBe("INEQUALITY_FAILED");expect(r.closure).toMatchObject({status:"EXACT",elements:["1","2","4","7","8","11","13","14"]});
    expect(r.subgroups).toHaveLength(7);expect(r.subgroups.map(H=>H.members)).toEqual(subgroupReference(r.closure.elements,15));
    expect(r.subgroups[0]).toMatchObject({members:["1"],index:"8",passed:true});expect(r.subgroups.filter(H=>!H.passed)).toEqual([{members:["1","11"],index:"4",orders:["4","1","1","1","1","1"],atomSizes:["3","1","1","1","1","1"],lowerBound:"3",passed:false}]);
  });
  it("rejects cyclic-only criterion through retained noncyclic U40 subgroup",()=>{
    const atoms=[17,...Array(7).fill(11),...Array(7).fill(21)].map(residue=>({residue,exponent:1})),r=analyzeBlockCriterionAbstract(40,atoms);
    expect(r.subgroups).toHaveLength(26);expect(r.subgroups.map(H=>H.members)).toEqual(subgroupReference(r.closure.elements,40));
    expect(r.subgroups.filter(H=>!H.passed)).toMatchObject([{members:["1","11","21","31"],index:"4",lowerBound:"3"}]);expect(r.decision).toBe("INEQUALITY_FAILED");
  });
  it("certifies jointly saturated cyclic and noncyclic blocks",()=>{
    const r=analyzeBlockCoverageAbstract(7,[["3","1"],["17","1"],["31","1"]]);expect(r.status).toBe("BLOCK_CHAIN_CERTIFIED");expect(r.chain.hasBlock).toBe(true);expect(r.chain.stages).toHaveLength(1);
    expect(r.chain.blockAttempts.at(-1)).toMatchObject({decision:"PASS",closure:{status:"EXACT",elements:["1","2","3","4","5","6"]}});
    const noncyclic=analyzeBlockCoverageAbstract(15,[["2","1"],["7","1"],["17","1"],["37","1"]]);expect(noncyclic.status).toBe("BLOCK_CHAIN_CERTIFIED");expect(noncyclic.chain.covered).toHaveLength(8);
  });
  it("target outside covered D remains NOT_CERTIFIED",()=>{
    const r=analyzeBlockCoverageAbstract(15,[["2","2"]]);expect(r.chain.covered.map(k=>k.residue)).toEqual(["1","2","4","8"]);expect(r.status).toBe("NOT_CERTIFIED");expect(r.certificate).toBeNull();
  });
  it("exact atom-order rejection never fabricates D cardinality",()=>{
    const a=packet.rows.find(r=>r.id==="N0_h11")!.chain.blockAttempts[0];expect(a).toMatchObject({decision:"ATOM_ORDER_TOO_LARGE",closure:{status:"NOT_BUILT",elements:[],lowerBound:null},subgroups:[],construction:null});
    expect(Number(a.exactAtomOrders.at(-1)!.order)).toBeGreaterThan(Number(a.bound));
  });
  it("truncated closure is one-past-bound lower bound, not exact group or MISS",()=>{
    const a=packet.rows.find(r=>r.id==="N6_h19")!.chain.blockAttempts[0];expect(a.decision).toBe("GROUP_TOO_LARGE");expect(a.closure.status).toBe("LOWER_BOUND_ONLY");expect(a.closure.elements).toHaveLength(Number(a.bound)+1);
    expect(a.closure.lowerBound).toBe(String(Number(a.bound)+1));expect(a.closure.elements).toEqual(["1","5","12","6","3","15","17","11","18","9"]);expect(a.subgroups).toEqual([]);
  });
  it("a full image may fail the sufficient size cap",()=>{
    const r=analyzeBlockCriterionAbstract(7,[{residue:3,exponent:1},{residue:2,exponent:1}]);expect(r.decision).toBe("ATOM_ORDER_TOO_LARGE");
    const image=new Set<number>();for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)image.add(Number((a<0?inverse(B(3),B(7)):B(3))**B(Math.abs(a))*(b<0?inverse(B(2),B(7)):B(2))**B(Math.abs(b))%B(7)));
    expect(image.size).toBe(6); // not a registered root, no MISS inference
  });
  it("constructs every PASS block only after all subgroup checks and retains numeric pair minima",()=>{
    for(const r of packet.rows){let covered:BlockCoverageEntry[]=[{residue:"1",exponents:r.factors.map(()=>"0")}];
      for(const stage of r.chain.stages){if(stage.kind==="BLOCK"){const a=r.chain.blockAttempts[Number(stage.attemptIndex)];expect(a.decision).toBe("PASS");expect(a.subgroups.every(H=>H.passed)).toBe(true);
        expect(a.previousCoveredDigest).toBe(blockCoverageDigest(covered));expect(a.construction).toEqual(referenceHalf(r.factors,a.construction!,Number(r.m),covered));
        expect(a.construction!.frequencies.map(f=>f.coset)).toEqual(a.closure.elements);expect(stage.covered).toHaveLength(covered.length*a.closure.elements.length);}
        covered=stage.covered;}}
  });
  it("restarts individuals after first passing block and includes order1",()=>{
    const r=packet.rows.find(r=>r.id==="N2_h23")!;expect(r.chain.stages.map(s=>s.kind==="INDIVIDUAL"?[s.kind,s.factorIndex,s.relativeOrder]:[s.kind,s.attemptIndex])).toEqual([["BLOCK","0"],["INDIVIDUAL","2","1"],["INDIVIDUAL","3","2"]]);
    expect(packet.rows.find(r=>r.id==="N0_h31")!.chain.stages.map(s=>s.kind)).toEqual(["INDIVIDUAL","BLOCK","INDIVIDUAL"]);
  });
  it("binds each block to current K/unused support and fixed cardinality-mask routing",()=>{
    for(const r of packet.rows)for(const a of r.chain.blockAttempts){expect(new Set(a.support).size).toBe(a.support.length);expect(a.support.every(i=>a.unused.includes(i))).toBe(true);
      const mask=Number(a.mask);expect(a.support).toEqual(a.unused.filter((_,i)=>mask&(1<<i)));expect(Number(a.bound)).toBe(2*Number(a.W)+1);}
    expect(packet.rows.find(r=>r.id==="N3_h23")!.chain.blockAttempts.map(a=>a.mask)).toEqual(["3","5","6","9","10","12","7","11"]);
  });
  it("retains legal allocated vectors, exact covered identities and first-target stopping",()=>{
    for(const r of packet.rows){let old:BlockCoverageEntry[]=[{residue:"1",exponents:r.factors.map(()=>"0")}];
      for(let i=0;i<r.chain.stages.length;i++){const stage=r.chain.stages[i];expect(stage.previousCoveredDigest).toBe(blockCoverageDigest(old));
        for(const entry of stage.covered){const {u,v}=pair(r.factors,entry.exponents);expect(String(u*inverse(v,B(r.m))%B(r.m))).toBe(entry.residue);r.factors.forEach(([,e],j)=>expect(Math.abs(Number(entry.exponents[j]))).toBeLessThanOrEqual(Number(e)));}
        if(stage.covered.some(e=>e.residue===String(Number(r.m)-1)))expect(i).toBe(r.chain.stages.length-1);old=stage.covered;}
      expect(old).toEqual(r.chain.covered);expect([...r.chain.consumed,...r.chain.unused].map(Number).sort((a,b)=>a-b)).toEqual(r.factors.map((_,i)=>i));}
  });
  it("checks every strict root tuple and whole-vector inversion",()=>{
    for(const r of packet.rows)if(r.certificate){const w=r.certificate.witness;expect(reconstructBlockCoverageWitness(B(r.p),B(r.m),B(r.T),r.factors,r.certificate.exponents)).toEqual(w);
      expect(B(4)*B(w.x)*B(w.y)*B(w.z)).toBe(B(r.p)*(B(w.x)*B(w.y)+B(w.x)*B(w.z)+B(w.y)*B(w.z)));expect([w.x,w.y,w.z].filter(x=>B(x)%B(r.p)===B(0))).toHaveLength(2);}
    const control=analyzeBlockCoverageAbstract(7,[["3","1"],["17","1"],["31","1"]]);expect(control.certificate).toMatchObject({kind:"CHAIN",orientation:"AS_CONSTRUCTED"});
  });
  it("retains exact energy fallback and explicit unevaluated partitions",()=>{
    for(const id of ["N0_h11","N5_h19"]){const r=packet.rows.find(r=>r.id===id)!;expect(r.status).toBe("ENERGY_CERTIFIED");expect(r.chain.blockAttempts.every(a=>a.decision!=="PASS")).toBe(true);
      for(const a of r.attempts){expect(a.A).toEqual(referenceHalf(r.factors,a.A,Number(r.m),r.chain.covered));expect(a.B).toEqual(referenceHalf(r.factors,a.B,Number(r.m),r.chain.covered));expect(a.sufficient).toBe(B(a.A.L)+B(a.B.L)>B(a.quotientOrder));}}
    expect(packet.rows.find(r=>r.id==="N0_h11")!.allocation).toEqual({totalPartitions:"3",evaluatedPartitions:"1",notEvaluatedPartitions:"2"});
  });
  it("energy equality remains insufficient while block bound equality is permitted",()=>{
    const r=analyzeBlockCoverageAbstract(7,[["3","1"],["5","1"]]);expect(r.status).toBe("NOT_CERTIFIED");expect(r.attempts[0]).toMatchObject({sufficient:false,A:{L:"3"},B:{L:"3"},quotientOrder:"6"});
    expect(analyzeBlockCriterionAbstract(3,[{residue:2,exponent:1}]).decision).toBe("PASS");
  });
  it("does not relabel old exposed known hits as MISS or manufacture gains",()=>{
    expect(packet.rows.find(r=>r.id==="P3_h103")!.status).toBe("NOT_CERTIFIED");expect(packet.rows.slice(0,71).filter(r=>r.certificate).map(r=>r.id)).toEqual(["P0_h3","P1_h3","P1_h31","P2_h3"]);
    expect(packet.rows.some(r=>String(r.status)==="MISS")).toBe(false);
  });
  it("keeps abstract proof controls outside fixed root witness admission",()=>{
    const control=analyzeBlockCoverageAbstract(15,[["2","1"],["7","1"],["17","1"],["37","1"]]);expect(control.status).toBe("BLOCK_CHAIN_CERTIFIED");
    expect(()=>reconstructBlockCoverageWitness(B(71),B(15),B(8806),[["2","1"],["7","1"],["17","1"],["37","1"]],control.certificate!.exponents)).toThrow();
    expect(()=>analyzeBlockCoverageAbstract(40,[["11","15"]])).toThrow();expect(()=>analyzeBlockCriterionAbstract(15,[{residue:3,exponent:1}])).toThrow();
  });
  it("rejects factor/root/cap expansions before unsafe exponentiation",()=>{
    expect(()=>analyzeBlockCoverageAbstract(5,[["2","99999999"]])).toThrow();expect(()=>validateBlockCoverageFactors([["4","2"]],B(16))).toThrow();
    expect(()=>blockCoveragePacket({maxRows:192})).toThrow();expect(()=>blockCoveragePacket({maxOutputBytes:32767})).toThrow();expect(()=>blockCoveragePacket({maxSubgroupsPerAttempt:4097})).toThrow();
    expect(()=>blockCoveragePacket({maxSmallGroupElements:54})).toThrow();
  });
  it("uses exact high-modulus BigInt arithmetic in generic proof seams",()=>{
    expect(B(100000007)**B(2)>B(Number.MAX_SAFE_INTEGER)).toBe(true);expect(analyzeBlockCoverageAbstract(150000051,[["100000007","1"]]).status).toBe("NOT_CERTIFIED");
    expect(packet.rows.some(r=>r.m==="150000051")).toBe(false);
  });
  it("retains atomic ROW prefix for all resource exhaustion paths",()=>{
    for(const [options,reason] of [[{maxRows:1},"ROW_LIMIT"],[{maxStateInsertions:1},"STATE_LIMIT"],[{maxWorkSteps:1},"WORK_LIMIT"],[{maxSubgroupsPerAttempt:1},"SUBGROUP_LIMIT"],[{maxSmallGroupElements:1},"SMALL_GROUP_LIMIT"]] as const){
      const p=blockCoveragePacket(options);expect(p.status).toBe("PARTIAL");expect(p.reason).toBe(reason);expect(p.pending).toEqual({phase:"ROW",id:BLOCK_COVERAGE_INPUTS.rows[p.rows.length].id});expect(p.summary.complete).toBe(false);}
    const p=blockCoveragePacket({maxOutputBytes:40000});expect(p.reason).toBe("OUTPUT_LIMIT");expect(Number(p.runtime.outputBytes)).toBeLessThanOrEqual(40000);
  });
  it("never accepts late final hashing/serialization and preserves prior partial reason",()=>{
    let calls=0;const late=blockCoveragePacket({now:()=>++calls>=clockCalls-1?60000:0});expect(late).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(late.rows).toHaveLength(191);
    const finalized=finalizeBlockCoverageForOutput(packet,60000),{packetDigest,...body}=finalized;expect(finalized.status).toBe("PARTIAL");expect(packetDigest).toBe(blockCoverageDigest(body));expect(Number(finalized.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(finalized)));
    expect(finalizeBlockCoverageForOutput(blockCoveragePacket({maxRows:1}),60000)).toMatchObject({reason:"ROW_LIMIT",pending:{phase:"ROW",id:"P0_h7"}});
  });
  it("keeps imports inert and CLI fixed without arbitrary parameters",()=>{
    const bad=spawnSync(process.execPath,["--import","tsx","scripts/operations/block-coverage-audit.ts","--group=40"],{encoding:"utf8",timeout:5000});expect(bad.status).toBe(2);expect(bad.stdout).toBe("");
    const inert=spawnSync(process.execPath,["--import","tsx","--input-type=module","-e","await import('./scripts/operations/block-coverage.ts');console.log('INERT');"],{encoding:"utf8",timeout:5000});expect(inert.stdout.trim()).toBe("INERT");
  });
  it("actual CLI downgrades a late output checkpoint",async()=>{
    const argv=process.argv,exit=process.exitCode;let reads=0;vi.doMock("node:perf_hooks",()=>({performance:{now:()=>reads++?60000:0}}));vi.doMock("../../scripts/operations/block-coverage",()=>({...primary,blockCoveragePacket:()=>packet}));
    const log=vi.spyOn(console,"log").mockImplementation(()=>{});process.argv=["node","block-coverage-audit"];
    try{await import("../../scripts/operations/block-coverage-audit");await vi.waitFor(()=>expect(log).toHaveBeenCalled(),{timeout:2000});expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(process.exitCode).toBe(1);}
    finally{process.argv=argv;process.exitCode=exit;log.mockRestore();vi.doUnmock("node:perf_hooks");vi.doUnmock("../../scripts/operations/block-coverage");}
  });
});
