import { beforeAll, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import * as primary from "../../scripts/operations/composite-shift-partitions";
import { COMPOSITE_SHIFT_INPUTS, COMPOSITE_SHIFT_LIMITS, compositeShiftPacket, compositeDigest,
  compositeSignedImage, compositeGroupDefect, validateCompositeFactors, classifyCompositeImage,
  reconstructCompositeWitness, finalizeCompositeForOutput, assertCompositeCandidate,
  CompositeCandidateContradictionError, type CompositeShiftPacket } from "../../scripts/operations/composite-shift-partitions";
const B=BigInt;
let packet:CompositeShiftPacket,clockCalls=0;
beforeAll(()=>{packet=compositeShiftPacket({now:()=>{clockCalls++;return 0;}});});
function gcd(a:number,b:number):number{return b?gcd(b,a%b):a;}
function inverse(a:bigint,m:bigint){let [r,s,t,u]=[a,m,B(1),B(0)];while(s){const q=r/s;[r,s]=[s,r-q*s];[t,u]=[u,t-q*u];}if(r!==B(1))throw new Error("nonunit");return (t%m+m)%m;}
function reference(T:number,c:number){
  const ds:number[]=[];for(let d=1;d*d<=T;d++)if(T%d===0){ds.push(d);if(d*d!==T)ds.push(T/d);}ds.sort((a,b)=>a-b);
  const image=new Set<number>(),q=c/3,local3:number[][]=[],localQ:number[][]=[],joint:number[][]=[];
  for(const u of ds)for(const v of ds){if(u*v>T||T%(u*v)||gcd(u,v)!==1)continue;
    image.add(Number(B(u)*inverse(B(v),B(c))%B(c)));
    if(u<=v){if((u+v)%3===0)local3.push([u,v]);if((u+v)%q===0)localQ.push([u,v]);if((u+v)%c===0)joint.push([u,v]);}}
  const first=(pairs:number[][])=>{pairs.sort(([a,b],[x,y])=>a-x||b-y);return pairs[0]?{u:String(pairs[0][0]),v:String(pairs[0][1]),k:String(T/(pairs[0][0]*pairs[0][1]))}:null;};
  return {image:[...image].sort((a,b)=>a-b).map(String),local3:first(local3),localQ:first(localQ),joint:first(joint)};
}
describe("fixed composite shifted CRT partitions",()=>{
  it("retains exactly eleven original blockers and c=3q without fallback",()=>{
    expect(packet.status).toBe("COMPLETE");expect(packet.inputs).toEqual(COMPOSITE_SHIFT_INPUTS);expect(packet.limits).toEqual(COMPOSITE_SHIFT_LIMITS);
    expect(packet.rows.map(r=>r.id)).toEqual(["r0","r1","r2","r3","r4","r5","r6","r7","r10","r11","r13"]);
    expect(packet.contentDigest).toBe("ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e");
    for(const r of packet.rows){expect(Number(r.c)).toBe(3*Number(r.q));expect(Number(r.c)).toBeLessThan(Number(r.p));expect(Number(r.T)*4).toBe(Number(r.p)+Number(r.c));
      expect(r.provenance.parentFactors.find(([q])=>q===r.q)?.[1]).toBe(r.provenance.valuation);expect(r.jacobi).toBe("-1");}
  });
  it("independently matches every full image and both local numeric-lex partitions",()=>{
    for(const r of packet.rows){const ref=reference(Number(r.T),Number(r.c));expect(r.image).toEqual(ref.image);
      expect(r.crt.mod3.canonicalPair).toEqual(ref.local3);expect(r.crt.modQ.canonicalPair).toEqual(ref.localQ);expect(r.canonical).toBe(ref.joint);
      const projected=(m:number)=>[...new Set(ref.image.map(x=>Number(x)%m))].sort((a,b)=>a-b).map(String);
      expect(r.crt.mod3.image).toEqual(projected(3));expect(r.crt.modQ.image).toEqual(projected(Number(r.q)));}
  });
  it("refutes C4 with first exact row but does not refute any selected root",()=>{
    expect(packet.summary.classificationCounts).toEqual({HIT:"0",LOCAL_3_OBSTRUCTION:"0",LOCAL_Q_OBSTRUCTION:"9",LOCAL_BOTH_OBSTRUCTION:"2",CRT_SYNCHRONIZATION_OBSTRUCTION:"0"});
    expect(packet.rows.filter(r=>r.classification==="LOCAL_BOTH_OBSTRUCTION").map(r=>r.id)).toEqual(["r5","r11"]);
    expect(packet.summary.C4).toEqual({status:"REFUTED",firstRefutation:{rowId:"r0",classification:"LOCAL_Q_OBSTRUCTION",rowDigest:packet.rows[0].rowDigest}});
    expect(packet.rows.every(r=>!r.crt.modQ.hit&&r.canonical===null)).toBe(true);
    expect(packet.scope).toContain("NO_ROOT_OR_UNIVERSAL_EXCLUSION");
  });
  it("uses exact stabilizers, quotient orders and all four involutions",()=>{
    for(const r of packet.rows){const c=B(r.c),S=new Set(r.image),H=r.image.filter(a=>r.image.every(b=>S.has(String(B(a)*B(b)%c))));
      expect(r.defect!.stabilizer).toEqual(H);expect(H).toEqual(["1"]);expect(Object.values(r.defect!.conditions).every(Boolean)).toBe(true);
      expect(r.involutions).toHaveLength(4);for(const i of r.involutions){expect(B(i.residue)**B(2)%c).toBe(B(1));expect(Number(i.residue)%3).toBe(Number(i.mod3));expect(Number(i.residue)%Number(r.q)).toBe(Number(i.modQ));}
      for(const f of r.defect!.visibleFactors){let v=B(1),order=0;do{v=v*B(f.residue)%c;order++;}while(!H.includes(String(v))&&order<Number(f.quotientOrder));
        expect(String(order)).toBe(f.quotientOrder);expect(H.includes(String(v))).toBe(true);}
    }
  });
  it("rejects prime-only H parity, index 2mod4 and QNR visibility assumptions",()=>{
    // Abstract c15 group control, not an extra p or registered branch.
    const terms=[{residue:7,exponent:2}],image=compositeSignedImage(15,terms),d=compositeGroupDefect(15,terms);
    expect(image).toEqual([1,4,7,13]);expect(d).toMatchObject({stabilizer:["1","4","7","13"],size:"4",index:"2",visibleMass:"0",visibleFactors:[]});
    expect(d!.conditions).toEqual({targetCosetOrderTwo:true,indexEven:true,visibleMassBound:true,ordersBeyondIntervals:true});
    expect(Number(d!.index)%4).toBe(2); // index2 itself, not required >=6
    expect(Number(d!.size)%2).toBe(0); // even H, unlike prime shift
    const indexFour=compositeGroupDefect(15,[{residue:4,exponent:1}]);
    expect(indexFour).toMatchObject({stabilizer:["1","4"],index:"4",visibleMass:"0"});
    expect(Number(indexFour!.index)%4).toBe(0); // not universally 2 mod4
    // 7 has negative Jacobi mod15, yet belongs to H.
    expect((7%3===1?1:-1)*([1,4].includes(7%5)?1:-1)).toBe(-1);
  });
  it("retains correlated CRT projections whose local witnesses are incompatible",()=>{
    const image=compositeSignedImage(15,[{residue:2,exponent:2}]);expect(image).toEqual([1,2,4,8]);expect(image).not.toContain(14);
    const mod3=[...new Set(image.map(r=>r%3))],mod5=[...new Set(image.map(r=>r%5))];
    expect(mod3).toContain(2);expect(mod5).toContain(4);expect(mod3.length*mod5.length).toBe(8);expect(image.length).toBe(4);
    expect(reference(4,15)).toMatchObject({local3:{u:"1",v:"2",k:"2"},localQ:{u:"1",v:"4",k:"1"},joint:null});
    expect(classifyCompositeImage(false,true,true)).toBe("CRT_SYNCHRONIZATION_OBSTRUCTION");
  });
  it("does not reject a positive-character abstract hit",()=>{
    const image=compositeSignedImage(15,[{residue:14,exponent:2}]);expect(image).toEqual([1,14]);
    expect(compositeGroupDefect(15,[{residue:14,exponent:2}])).toBeNull();
    // T29^2 has Jacobi +1, but a signed valuation one reaches -1.
    expect(((-1)*1)**2).toBe(1);expect(packet.rows.some(r=>r.T==="841")).toBe(false);
  });
  it("negative Jacobi and both full local projections still do not guarantee synchronization",()=>{
    // Abstract U39 control, not a registered p/T pair or an added experiment row.
    const terms=[{residue:5,exponent:2},{residue:28,exponent:1}],image=compositeSignedImage(39,terms);
    expect(image).toHaveLength(12);expect(image).not.toContain(38);
    expect(new Set(image.map(r=>r%3)).size).toBe(2);expect(new Set(image.map(r=>r%13)).size).toBe(12);
    expect(compositeGroupDefect(39,terms)).toMatchObject({stabilizer:["1","5","8","25"],index:"6",visibleMass:"1"});
    // 5 is QNR modulo3 and13 (Jacobi+1);28 is + modulo3, - modulo13.
    expect(((-1)*(-1))**2*(1*(-1))).toBe(-1);
  });
  it("retains repeated valuations and unused mass rather than requiring uv=T",()=>{
    expect(compositeSignedImage(15,[{residue:2,exponent:2}])).toContain(2); // exponent1 with one unused unit
    const repeated=packet.rows.find(r=>r.factors.some(([,e])=>Number(e)>1));expect(repeated).toBeDefined();
    expect(reference(4,15).local3).toEqual({u:"1",v:"2",k:"2"});
  });
  it("local3 hits exactly when a positive-valuation prime factor is 2mod3",()=>{
    for(const r of packet.rows){const qnr=r.factors.filter(([q,e])=>Number(q)%3===2&&Number(e)>0);
      expect(r.crt.mod3.hit).toBe(qnr.length>0);
      expect(r.crt.mod3.canonicalPair).toEqual(qnr.length?{u:"1",v:qnr[0][0],k:String(Number(r.T)/Number(qnr[0][0]))}:null);}
  });
  it("uses exact BigInt modular multiplication above safe Number products",()=>{
    const c=150000051,r=c-2,C=B(c),inv=inverse(B(r),C),set=new Set<number>();
    for(let z=-2;z<=2;z++)set.add(Number((z<0?inv:B(r))**B(Math.abs(z))%C));
    expect(B(r)*B(r)>B(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(compositeSignedImage(c,[{residue:r,exponent:2}])).toEqual([...set].sort((a,b)=>a-b));
  });
  it("rejects malformed units, factors, nonregistered witnesses and resource expansion",()=>{
    expect(()=>compositeSignedImage(15,[{residue:3,exponent:1}])).toThrow();expect(()=>compositeSignedImage(21,[{residue:2,exponent:1}])).toThrow();
    expect(()=>compositeGroupDefect(15,[{residue:2,exponent:2}],[1,2])).toThrow();
    expect(()=>validateCompositeFactors([["4","2"]],B(16))).toThrow();expect(()=>validateCompositeFactors([["2","1"]],B(4))).toThrow();
    expect(()=>reconstructCompositeWitness(B(200023321),B(1595931),B(50404813),B(1),B(1))).toThrow();
    expect(()=>compositeShiftPacket({maxRows:12})).toThrow();expect(()=>compositeShiftPacket({seconds:61})).toThrow();expect(()=>compositeShiftPacket({maxOutputBytes:1})).toThrow();
    expect(()=>classifyCompositeImage(true,false,true)).toThrow();
  });
  it("retains atomic row prefixes for row/state/work/output stops",()=>{
    const row=compositeShiftPacket({maxRows:1});expect(row).toMatchObject({status:"PARTIAL",reason:"ROW_LIMIT",pending:{phase:"ROW",recordId:"r1"}});expect(row.rows).toHaveLength(1);
    for(const [options,reason] of [[{maxStateInsertions:1},"STATE_LIMIT"],[{maxWorkSteps:1},"WORK_LIMIT"]] as const){const p=compositeShiftPacket(options);expect(p).toMatchObject({status:"PARTIAL",reason,pending:{phase:"ROW",recordId:"r0"}});expect(p.rows).toEqual([]);}
    const o=compositeShiftPacket({maxOutputBytes:10000});expect(o.status).toBe("PARTIAL");expect(o.reason).toBe("OUTPUT_LIMIT");expect(Number(o.runtime.outputBytes)).toBeLessThanOrEqual(10000);
  });
  it("counts finalization and output checkpoints without overwriting previous partial reason",()=>{
    let calls=0;const late=compositeShiftPacket({now:()=>++calls>=clockCalls-1?60000:0});
    expect(late).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(late.rows).toHaveLength(11);expect(late.summary.complete).toBe(false);
    const p=finalizeCompositeForOutput(packet,60000);expect(p.status).toBe("PARTIAL");expect(p.summary.complete).toBe(false);
    const {packetDigest,...body}=p;expect(packetDigest).toBe(compositeDigest(body));expect(Number(p.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(p)));
    const prior=finalizeCompositeForOutput(compositeShiftPacket({maxRows:1}),60000);expect(prior.reason).toBe("ROW_LIMIT");expect(prior.pending).toEqual({phase:"ROW",recordId:"r1"});
  });
  it("retains bounded injected candidate contradictions without normal packet authority",()=>{
    const changed={...packet.rows[0],defect:{...packet.rows[0].defect!,conditions:{...packet.rows[0].defect!.conditions,indexEven:false}}};
    try{assertCompositeCandidate(changed);throw new Error("must reject");}catch(error){expect(error).toBeInstanceOf(CompositeCandidateContradictionError);
      if(!(error instanceof CompositeCandidateContradictionError))throw error;expect(error.row).toEqual(changed);expect(error.row).not.toBe(changed);}
  });
  it("keeps fixed imports inert and rejects arbitrary CLI inputs before discovery",()=>{
    const bad=spawnSync(process.execPath,["--import","tsx","scripts/operations/composite-shift-audit.ts","--multiplier=7"],{encoding:"utf8",timeout:5000});expect(bad.status).toBe(2);expect(bad.stdout).toBe("");
    const inert=spawnSync(process.execPath,["--import","tsx","--input-type=module","-e","await import('./scripts/operations/composite-shift-partitions.ts');console.log('INERT');"],{encoding:"utf8",timeout:5000});expect(inert.stdout.trim()).toBe("INERT");
  });
  it("actual fixed CLI emits PARTIAL at a late serialization checkpoint",async()=>{
    const argv=process.argv,exit=process.exitCode;let reads=0;vi.doMock("node:perf_hooks",()=>({performance:{now:()=>reads++?60000:0}}));
    vi.doMock("../../scripts/operations/composite-shift-partitions",()=>({...primary,compositeShiftPacket:()=>packet}));
    const log=vi.spyOn(console,"log").mockImplementation(()=>{});process.argv=["node","composite-shift-audit"];
    try{await import("../../scripts/operations/composite-shift-audit");await vi.waitFor(()=>expect(log).toHaveBeenCalled(),{timeout:2000});
      expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(process.exitCode).toBe(1);
    }finally{process.argv=argv;process.exitCode=exit;log.mockRestore();vi.doUnmock("node:perf_hooks");vi.doUnmock("../../scripts/operations/composite-shift-partitions");}
  });
});
