import { beforeAll, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import * as primary from "../../scripts/operations/sufficient-coverage";
import { sufficientCoveragePacket, SUFFICIENT_COVERAGE_INPUTS, SUFFICIENT_COVERAGE_LIMITS, analyzeCoverageAbstract,
  reconstructCoverageWitness, finalizeCoverageForOutput, coverageDigest, validateCoverageFactors,
  type CoverageFactors,type CoverageHalf,type CoverageEntry,type SufficientCoveragePacket } from "../../scripts/operations/sufficient-coverage";
const B=BigInt;
let packet:SufficientCoveragePacket,clockCalls=0;
beforeAll(()=>{packet=sufficientCoveragePacket({now:()=>{clockCalls++;return 0;}});});
function gcd(a:bigint,b:bigint){while(b)[a,b]=[b,a%b];return a;}
function inverse(a:bigint,m:bigint){let [r,s,t,u]=[a,m,B(1),B(0)];while(s){const q=r/s;[r,s]=[s,r-q*s];[t,u]=[u,t-q*u];}if(r!==B(1))throw new Error("nonunit");return (t%m+m)%m;}
function pair(factors:CoverageFactors,z:readonly string[]){let u=B(1),v=B(1);factors.forEach(([q],i)=>{if(Number(z[i])>0)u*=B(q)**B(z[i]);if(Number(z[i])<0)v*=B(q)**B(-Number(z[i]));});return {u,v};}
function referenceHalf(factors:CoverageFactors,half:CoverageHalf,m:number,K:readonly CoverageEntry[]){
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
describe("constructive sufficient coverage with no full-image routing",()=>{
  it("retains exactly71 frozen inputs and honest4CHAIN/0ENERGY/67uncertified",()=>{
    expect(packet.status).toBe("COMPLETE");expect(packet.inputs).toEqual(SUFFICIENT_COVERAGE_INPUTS);expect(packet.limits).toEqual(SUFFICIENT_COVERAGE_LIMITS);expect(packet.rows).toHaveLength(71);
    expect(Object.isFrozen(SUFFICIENT_COVERAGE_INPUTS.sourceContentDigests)).toBe(true);
    expect(packet.summary.counts).toEqual({CHAIN_CERTIFIED:"4",ENERGY_CERTIFIED:"0",NOT_CERTIFIED:"67"});
    expect(packet.rows.filter(r=>r.certificate).map(r=>r.id)).toEqual(["P0_h3","P1_h3","P1_h31","P2_h3"]);
    expect(packet.contentDigest).toBe("48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72");
    expect(packet.rows.slice(60).map(r=>r.id)).toEqual(["C_r0","C_r1","C_r2","C_r3","C_r4","C_r5","C_r6","C_r7","C_r10","C_r11","C_r13"]);
  });
  it("independently verifies every attempted half quotient frequency and ordered pair minimum",()=>{
    for(const r of packet.rows)for(const a of r.attempts){expect(a.A).toEqual(referenceHalf(r.factors,a.A,Number(r.m),r.chain.covered));expect(a.B).toEqual(referenceHalf(r.factors,a.B,Number(r.m),r.chain.covered));
      expect(a.sufficient).toBe(B(a.A.L)+B(a.B.L)>B(a.quotientOrder));}
  });
  it("retains exact covered subgroups and legal consecutive-digit representations, not free stabilizers",()=>{
    for(const r of packet.rows){let old:CoverageEntry[]=[{residue:"1",exponents:r.factors.map(()=>"0")}];
      for(const stage of r.chain.stages){expect(stage.previousCoveredDigest).toBe(coverageDigest(old));const i=Number(stage.factorIndex),d=Number(stage.relativeOrder),m=B(r.m),S=new Set(old.map(k=>k.residue));
        const modPower=(e:number)=>B(stage.prime)**B(e)%m;expect(S.has(String(modPower(d)))).toBe(true);
        for(let k=1;k<d;k++)expect(S.has(String(modPower(k)))).toBe(false);
        expect(stage.covered).toHaveLength(old.length*d);expect(d).toBeLessThanOrEqual(2*Number(stage.exponent)+1);
        for(const entry of stage.covered){const {u,v}=pair(r.factors,entry.exponents);expect(String(u*inverse(v,m)%m)).toBe(entry.residue);
          expect(Number(entry.exponents[i])).toBeGreaterThanOrEqual(-Number(stage.exponent));expect(Number(entry.exponents[i])).toBeLessThan(-Number(stage.exponent)+d);}
        old=stage.covered;}
      expect(old).toEqual(r.chain.covered);expect(new Set(r.chain.covered.map(k=>k.residue)).size).toBe(r.chain.covered.length);
      expect([...r.chain.consumed,...r.chain.unused].map(Number).sort((a,b)=>a-b)).toEqual(r.factors.map((_,i)=>i));}
  });
  it("checks all certified root identities and labels witnesses constructive not minimal",()=>{
    for(const r of packet.rows)if(r.certificate){const w=r.certificate.witness;expect(reconstructCoverageWitness(B(r.p),B(r.m),B(r.T),r.factors,r.certificate.exponents)).toEqual(w);
      const x=B(w.x),y=B(w.y),z=B(w.z),p=B(r.p);expect(x<y&&y<z).toBe(true);expect(B(4)*x*y*z).toBe(p*(x*y+x*z+y*z));expect([x,y,z].filter(t=>t%p===B(0))).toHaveLength(2);}
    expect(packet.rows.find(r=>r.id==="P1_h31")!.certificate!.witness.v).toBe("50150528");
    expect(packet.scope).toContain("OR_MINIMUM");
  });
  it("reconsiders ascending skipped factors and includes relative order1 factors",()=>{
    const reconsider=analyzeCoverageAbstract(11,[["2","1"],["3","2"]]);expect(reconsider.chain.stages.map(s=>[s.prime,s.relativeOrder])).toEqual([["3","5"],["2","2"]]);
    const invisible=analyzeCoverageAbstract(7,[["2","1"],["11","1"],["17","1"]]);expect(invisible.chain.stages.map(s=>[s.prime,s.relativeOrder])).toEqual([["2","3"],["11","1"],["17","2"]]);
    expect(invisible.status).toBe("CHAIN_CERTIFIED");
  });
  it("certifies positive ENERGY without introducing an extra root row",()=>{
    const r=analyzeCoverageAbstract(7,[["3","2"],["5","1"]]);expect(r.chain.stages).toEqual([]);expect(r.status).toBe("ENERGY_CERTIFIED");
    expect(r.attempts[0]).toMatchObject({mask:"1",quotientOrder:"6",sufficient:true,A:{N:"5",E:"5",L:"5"},B:{N:"3",E:"3",L:"3"}});
    expect(r.certificate).toMatchObject({kind:"ENERGY",exponents:["-2","1"],orientation:"INVERTED"});
    const {u,v}=pair([["3","2"],["5","1"]],r.certificate!.exponents);expect([u,v]).toEqual([B(5),B(9)]);
    expect(packet.rows.some(r=>r.p==="173")).toBe(false); // toy p173/T45 is not campaign
  });
  it("constructively lifts a nontrivial covered subgroup discrepancy with disjoint support",()=>{
    const r=analyzeCoverageAbstract(31,[["2","2"],["3","1"],["13","2"]]);expect(r.status).toBe("ENERGY_CERTIFIED");
    expect(r.certificate).toMatchObject({kind:"ENERGY",match:{liftResidue:"16",liftExponents:["-1","0","0"]},exponents:["-1","1","-2"]});
    const {u,v}=pair([["2","2"],["3","1"],["13","2"]],r.certificate!.exponents);expect(u*inverse(v,B(31))%B(31)).toBe(B(30));
    expect(r.chain.consumed).toEqual(["0"]);expect(r.attempts[0].A.factorIndices).toEqual(["1"]);expect(r.attempts[0].B.factorIndices).toEqual(["2"]);
  });
  it("stops at the first energy certificate and explicitly retains unevaluated allocations",()=>{
    const r=analyzeCoverageAbstract(19,[["2","1"],["7","1"],["59","1"],["97","1"]]);expect(r.status).toBe("ENERGY_CERTIFIED");
    expect(r.certificate).toMatchObject({kind:"ENERGY",match:{liftResidue:"7"},exponents:["-1","-1","-1","-1"]});
    expect(r.allocation).toEqual({totalPartitions:"3",evaluatedPartitions:"1",notEvaluatedPartitions:"2"});
  });
  it("does not confuse generated membership/even subgroup with saturation of the distinguished target",()=>{
    expect(analyzeCoverageAbstract(5,[["2","1"]])).toMatchObject({status:"NOT_CERTIFIED",chain:{stages:[]},certificate:null}); // generated U5 contains4, box does not
    const k=analyzeCoverageAbstract(15,[["2","2"]]);expect(k.chain.covered.map(x=>x.residue)).toEqual(["1","2","4","8"]);expect(k.status).toBe("NOT_CERTIFIED");expect(k.chain.covered).toHaveLength(4);
  });
  it("strict equality and overlapping/reused support cannot force coverage",()=>{
    const r=analyzeCoverageAbstract(7,[["3","1"],["5","1"]]);expect(r.attempts[0]).toMatchObject({A:{L:"3"},B:{L:"3"},quotientOrder:"6",sufficient:false});expect(r.status).toBe("NOT_CERTIFIED");
    // Reusing residue2 valuation1 twice would spuriously cover U5; actual support is consumed once.
    const reuse=analyzeCoverageAbstract(5,[["2","1"]]);expect(reuse.status).toBe("NOT_CERTIFIED");
    for(const row of packet.rows)for(const a of row.attempts){const all=[...a.A.factorIndices,...a.B.factorIndices];expect(new Set(all).size).toBe(all.length);expect(all.slice().sort()).toEqual(row.chain.unused.slice().sort());expect(all.some(i=>row.chain.consumed.includes(i))).toBe(false);}
  });
  it("includes the diagonal in energy and uses exact ceil division",()=>{
    for(const r of packet.rows)for(const a of r.attempts)for(const h of [a.A,a.B]){expect(B(h.E)).toBeGreaterThanOrEqual(B(h.N));expect(B(h.L)).toBe((B(h.N)**B(2)+B(h.E)-B(1))/B(h.E));}
  });
  it("does not turn a known hit into MISS when sufficient conditions fail",async()=>{
    // Ground truth queried only AFTER independent sufficient generation, never inside producer.
    const {characterShiftPacket}=await import("../../scripts/operations/character-shift-partitions");const truth=characterShiftPacket();
    const hits=truth.rows.filter(r=>r.hit),certified=packet.rows.filter(r=>r.certificate);expect(hits).toHaveLength(11);expect(certified).toHaveLength(4);
    const old=packet.rows.find(r=>r.id==="P3_h103")!;expect(truth.rows.find(r=>r.p===old.p&&r.h===old.m)!.hit).toBe(true);expect(old.status).toBe("NOT_CERTIFIED");expect(old.certificate).toBeNull();
    expect(packet.rows.some(r=>String(r.status)==="MISS")).toBe(false);
  });
  it("rejects malformed factor/support/valuation/root and resource expansion before unsafe exponentiation",()=>{
    expect(()=>analyzeCoverageAbstract(5,[["2","99999999"]])).toThrow();expect(()=>analyzeCoverageAbstract(5,[["2","1"],["2","1"]])).toThrow();
    expect(()=>analyzeCoverageAbstract(9,[["2","1"]])).toThrow();expect(()=>analyzeCoverageAbstract(15,[["3","1"]])).toThrow();
    expect(()=>validateCoverageFactors([["4","2"]],B(16))).toThrow();
    const r=packet.rows[0];expect(()=>reconstructCoverageWitness(B(r.p),B(r.m),B(r.T),r.factors,["-2","0"])).toThrow();
    expect(()=>sufficientCoveragePacket({maxRows:72})).toThrow();expect(()=>sufficientCoveragePacket({maxOutputBytes:8192})).toThrow();expect(()=>sufficientCoveragePacket({maxStateInsertions:2000001})).toThrow();
  });
  it("uses exact BigInt products for high composite modulus without adding campaign inputs",()=>{
    const m=150000051,r=analyzeCoverageAbstract(m,[["100000007","1"]]);expect(r.status).toBe("NOT_CERTIFIED");
    expect(B(100000007)**B(2)>B(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(packet.rows.some(row=>row.m===String(m))).toBe(false);
  });
  it("retains atomic row prefixes for every resource stop",()=>{
    const r=sufficientCoveragePacket({maxRows:1});expect(r).toMatchObject({status:"PARTIAL",reason:"ROW_LIMIT",pending:{phase:"ROW",id:"P0_h7"}});expect(r.rows).toHaveLength(1);
    for(const [options,reason] of [[{maxStateInsertions:1},"STATE_LIMIT"],[{maxWorkSteps:1},"WORK_LIMIT"]] as const){const p=sufficientCoveragePacket(options);expect(p).toMatchObject({status:"PARTIAL",reason,pending:{phase:"ROW",id:"P0_h3"}});expect(p.rows).toEqual([]);}
    const o=sufficientCoveragePacket({maxOutputBytes:20000});expect(o.status).toBe("PARTIAL");expect(o.reason).toBe("OUTPUT_LIMIT");expect(Number(o.runtime.outputBytes)).toBeLessThanOrEqual(20000);
  });
  it("accounts for finalization and output timing without overwriting previous prefix reason",()=>{
    let calls=0;const late=sufficientCoveragePacket({now:()=>++calls>=clockCalls-1?60000:0});expect(late).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(late.rows).toHaveLength(71);expect(late.summary.complete).toBe(false);
    const p=finalizeCoverageForOutput(packet,60000),{packetDigest,...body}=p;expect(p.status).toBe("PARTIAL");expect(packetDigest).toBe(coverageDigest(body));expect(Number(p.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(p)));
    const prior=finalizeCoverageForOutput(sufficientCoveragePacket({maxRows:1}),60000);expect(prior.reason).toBe("ROW_LIMIT");expect(prior.pending).toEqual({phase:"ROW",id:"P0_h7"});
  });
  it("keeps imports inert and rejects arbitrary CLI allocations",()=>{
    const bad=spawnSync(process.execPath,["--import","tsx","scripts/operations/sufficient-coverage-audit.ts","--allocation=all"],{encoding:"utf8",timeout:5000});expect(bad.status).toBe(2);expect(bad.stdout).toBe("");
    const inert=spawnSync(process.execPath,["--import","tsx","--input-type=module","-e","await import('./scripts/operations/sufficient-coverage.ts');console.log('INERT');"],{encoding:"utf8",timeout:5000});expect(inert.stdout.trim()).toBe("INERT");
  });
  it("actual fixed CLI emits PARTIAL at late serialization, not a false COMPLETE",async()=>{
    const argv=process.argv,exit=process.exitCode;let reads=0;vi.doMock("node:perf_hooks",()=>({performance:{now:()=>reads++?60000:0}}));
    vi.doMock("../../scripts/operations/sufficient-coverage",()=>({...primary,sufficientCoveragePacket:()=>packet}));
    const log=vi.spyOn(console,"log").mockImplementation(()=>{});process.argv=["node","sufficient-coverage-audit"];
    try{await import("../../scripts/operations/sufficient-coverage-audit");await vi.waitFor(()=>expect(log).toHaveBeenCalled(),{timeout:2000});
      expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(process.exitCode).toBe(1);
    }finally{process.argv=argv;process.exitCode=exit;log.mockRestore();vi.doUnmock("node:perf_hooks");vi.doUnmock("../../scripts/operations/sufficient-coverage");}
  });
});
