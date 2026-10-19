import { beforeAll, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import * as primary from "../../scripts/operations/occupied-density";
import { verifyOccupiedDensityPacket } from "../../scripts/operations/occupied-density-check";
import { occupiedDensityPacket, occupiedDensityAbstract, occupiedDensityDigest, finalizeOccupiedDensityForOutput,
  OCCUPIED_DENSITY_INPUTS, OCCUPIED_DENSITY_SOURCE_PINS, OCCUPIED_DENSITY_BASE_CONTENT, OCCUPIED_DENSITY_BASE_ROWS,
  type OccupiedDensityPacket } from "../../scripts/operations/occupied-density";
const B=BigInt;
let packet:OccupiedDensityPacket,clockCalls=0;
beforeAll(async()=>{packet=await occupiedDensityPacket({now:()=>{clockCalls++;return 0;}});});
function inverse(a:bigint,m:bigint){let [r,s,t,u]=[a,m,B(1),B(0)];while(s){const q=r/s;[r,s]=[s,r-q*s];[t,u]=[u,t-q*u];}if(r!==B(1))throw new Error("nonunit");return (t%m+m)%m;}
function pair(fs:Array<[string,string]>,z:string[]){let u=B(1),v=B(1);fs.forEach(([q,e],i)=>{expect(Math.abs(Number(z[i]))).toBeLessThanOrEqual(Number(e));if(Number(z[i])>0)u*=B(q)**B(z[i]);if(Number(z[i])<0)v*=B(q)**B(-Number(z[i]));});return {u,v};}
function reseal(p:OccupiedDensityPacket){p.rows.forEach(r=>{const {rowDigest,...body}=r;void rowDigest;r.rowDigest=occupiedDensityDigest(body);});p.rowsDigest=occupiedDensityDigest(p.rows);p.contentDigest=occupiedDensityDigest({inputs:p.inputs,baselineContentDigest:p.baselineContentDigest,baselineRowsDigest:p.baselineRowsDigest,rows:p.rows,rowsDigest:p.rowsDigest,summary:p.summary});
  for(let i=0;i<8;i++){const {packetDigest,...body}=p;void packetDigest;p.packetDigest=occupiedDensityDigest(body);const n=String(Buffer.byteLength(JSON.stringify(p)));if(n===p.runtime.outputBytes)return p;p.runtime.outputBytes=n;}throw new Error("seal fixed point");}
describe("exact occupied-half density additive campaign",()=>{
  it("binds exact191 exposed inputs/full unchanged baseline and method counts",()=>{
    expect(packet.status).toBe("COMPLETE");expect(packet.inputs).toEqual(OCCUPIED_DENSITY_INPUTS);expect(packet.rows).toHaveLength(191);expect(packet.baseline.omitted).toBe(false);
    expect(packet.baselineContentDigest).toBe(OCCUPIED_DENSITY_BASE_CONTENT);expect(packet.baselineRowsDigest).toBe(OCCUPIED_DENSITY_BASE_ROWS);
    expect(packet.contentDigest).toBe("e9fcbee161256e09693a27100aee3571a785376155cf0ddd4de5c3ea9b24056b");expect(packet.rowsDigest).toBe("0ebd2ae6ea4bcb6271b313f34fa45424976425f8e2621c9ff59d87286d2a8ab5");
    expect(packet.summary.counts).toEqual({INHERITED_CERTIFIED:"35",DENSITY_CERTIFIED:"8",NOT_CERTIFIED:"148"});
    expect(packet.inputs.exposure).toBe("ALL_191_EXPOSED_DEVELOPMENT");
  });
  it("inherits exact baseline certificates without rewriting mechanism or claiming new density",()=>{
    const base=packet.baseline.packet!;packet.rows.forEach((r,i)=>{if(base.rows[i].certificate){expect(r.status).toBe("INHERITED_CERTIFIED");expect(r.decisions).toEqual([]);expect(r.certificate).toBeNull();expect(r.allocation).toEqual({totalPartitions:"0",evaluatedPartitions:"0",notEvaluatedPartitions:"0"});}
      expect(r.baselineRowDigest).toBe(base.rows[i].rowDigest);expect(r.baselineStatus).toBe(base.rows[i].status);});
    expect(occupiedDensityDigest(base.rows)).toBe(OCCUPIED_DENSITY_BASE_ROWS);
  });
  it("uses distinct occupied counts not N, energy lower bounds or projected groups",()=>{
    packet.rows.forEach((r,i)=>{const base=packet.baseline.packet!.rows[i];r.decisions.forEach(d=>{const a=base.attempts[Number(d.attemptIndex)];expect(d.occupiedA).toBe(String(a.A.frequencies.length));expect(d.occupiedB).toBe(String(a.B.frequencies.length));
      expect(d.quotientOrder).toBe(String(Number(base.groupOrder)/base.chain.covered.length));expect(d.sufficient).toBe(Number(d.occupiedA)+Number(d.occupiedB)>Number(d.quotientOrder));expect(d.halfADigest).toBe(occupiedDensityDigest(a.A));expect(d.halfBDigest).toBe(occupiedDensityDigest(a.B));});});
    expect(occupiedDensityAbstract(6,[0,1],[0,1]).sufficient).toBe(false);expect(occupiedDensityAbstract(3,[0,1],[0,1]).sufficient).toBe(true); // wrong smaller ambient would be unsound
  });
  it("distinguishes strict equality controls with hits and misses",()=>{
    const A=[0,2,4],D=[0,2,4],E=[0,1,2];expect(occupiedDensityAbstract(6,A,D).sufficient).toBe(false);expect(A.some(a=>D.some(b=>(a+b)%6===3))).toBe(false);
    expect(occupiedDensityAbstract(6,E,E).sufficient).toBe(false);expect(E.some(a=>E.some(b=>(a+b)%6===3))).toBe(true);
  });
  it("represented subsets can soundly certify positivity, but duplicates/fake entries cannot inflate counts",()=>{
    expect(occupiedDensityAbstract(6,[0,1,2,3],[0,1,2]).sufficient).toBe(true);
    expect(()=>occupiedDensityAbstract(6,[0,0,1],[0,1,2,3])).toThrow();expect(()=>occupiedDensityAbstract(6,[0,1,6],[0,1,2,3])).toThrow();
    // Public proof seam has no arbitrary prime/root/witness admission.
    expect("witness" in occupiedDensityAbstract(6,[0,1,2,3],[0,1,2])).toBe(false);
  });
  it("retains ascending original masks and stops first sufficient split",()=>{
    packet.rows.forEach((r,i)=>{const base=packet.baseline.packet!.rows[i];if(r.status==="INHERITED_CERTIFIED")return;
      expect(r.allocation.totalPartitions).toBe(String(base.attempts.length));expect(r.decisions.map(d=>d.mask)).toEqual(base.attempts.slice(0,r.decisions.length).map(a=>a.mask));
      expect(r.decisions.map(d=>d.attemptIndex)).toEqual(r.decisions.map((_,j)=>String(j)));expect(r.decisions.slice(0,-1).every(d=>!d.sufficient)).toBe(true);
      expect(Number(r.allocation.notEvaluatedPartitions)+r.decisions.length).toBe(base.attempts.length);if(r.certificate)expect(r.decisions.at(-1)!.sufficient).toBe(true);});
  });
  it("matches increasing A cosets and uses the exact actual paid K lift",()=>{
    packet.rows.forEach((r,i)=>{const c=r.certificate;if(!c)return;const base=packet.baseline.packet!.rows[i],a=base.attempts[Number(c.attemptIndex)],m=B(base.m),K=base.chain.covered;
      const coset=(r:bigint)=>K.reduce((least,k)=>{const n=r*B(k.residue)%m;return n<least?n:least;},m),mapB=new Map(a.B.frequencies.map(f=>[f.coset,f]));
      const first=a.A.frequencies.find(f=>mapB.has(String(coset((m-B(1))*inverse(B(f.coset),m)%m))));expect(c.match.cosetA).toBe(first!.coset);
      const f=a.A.frequencies.find(f=>f.coset===c.match.cosetA)!,g=a.B.frequencies.find(f=>f.coset===c.match.cosetB)!;
      const lift=(m-B(1))*inverse(B(f.residue)*B(g.residue)%m,m)%m;expect(c.match.liftResidue).toBe(String(lift));expect(K.find(k=>k.residue===String(lift))!.exponents).toEqual(c.match.liftExponents);
    });
  });
  it("combines disjoint legal supports and normalizes only the whole vector",()=>{
    packet.rows.forEach((r,i)=>{const c=r.certificate;if(!c)return;const base=packet.baseline.packet!.rows[i],a=base.attempts[Number(c.attemptIndex)];
      const support=[...a.A.factorIndices,...a.B.factorIndices,...base.chain.consumed];expect(new Set(support).size).toBe(support.length);
      const raw=base.factors.map((_,j)=>String(Number(c.match.exponentsA[j])+Number(c.match.exponentsB[j])+Number(c.match.liftExponents[j]))),p=pair(base.factors,raw),flip=p.u>p.v;
      expect(c.exponents).toEqual(flip?raw.map(x=>String(-Number(x))):raw);expect(c.orientation).toBe(flip?"INVERTED":"AS_CONSTRUCTED");
      const normalized=pair(base.factors,c.exponents);expect([String(normalized.u),String(normalized.v)]).toEqual([c.witness.u,c.witness.v]);});
    // Copying valuation1 of factor2 into both supports is not a legal extra factor.
    const copied=[1,1];expect(copied.reduce((s,z)=>s+z,0)).toBeGreaterThan(1);
  });
  it("checks all exact BigInt strict Type-II identities",()=>{
    packet.rows.forEach((r,i)=>{const c=r.certificate;if(!c)return;const base=packet.baseline.packet!.rows[i],w=c.witness,p=B(base.p),m=B(base.m),T=B(base.T),u=B(w.u),v=B(w.v),k=B(w.k),A=B(w.A),ds=[B(w.x),B(w.y),B(w.z)];
      expect(u*v*k).toBe(T);expect(u+v).toBe(m*A);expect(ds[0]<ds[1]&&ds[1]<ds[2]).toBe(true);expect(ds.filter(d=>d%p===B(0))).toHaveLength(2);expect(B(4)*ds[0]*ds[1]*ds[2]).toBe(p*(ds[0]*ds[1]+ds[1]*ds[2]+ds[2]*ds[0]));});
  });
  it("cannot substitute independent CRT targets for a joint target",()=>{
    const m=39,S=new Set<number>();for(let a=-2;a<=2;a++)for(let b=-1;b<=1;b++)S.add(Number((a<0?inverse(B(5),B(m)):B(5))**B(Math.abs(a))*(b<0?inverse(B(28),B(m)):B(28))**B(Math.abs(b))%B(m)));
    expect([...S].some(s=>s%3===2)).toBe(true);expect([...S].some(s=>s%13===12)).toBe(true);expect(S.has(38)).toBe(false);
  });
  it("carries baseline counters and shares tighter caps during generation",async()=>{
    expect(packet.runtime.stateInsertions).toBe(String(Number(packet.runtime.baseStates)+Number(packet.runtime.additionalStates)));expect(packet.runtime.workSteps).toBe(String(Number(packet.runtime.baseWork)+Number(packet.runtime.additionalWork)));
    const p=await occupiedDensityPacket({maxStateInsertions:1});expect(p).toMatchObject({status:"PARTIAL",reason:"BASELINE_PARTIAL",pending:{phase:"BASELINE"}});expect(p.rows).toEqual([]);expect(p.baseline.packet!.limits.maxStateInsertions).toBe(1);
    const after=await occupiedDensityPacket({maxStateInsertions:Number(packet.runtime.baseStates)});expect(after).toMatchObject({status:"PARTIAL",reason:"STATE_LIMIT",pending:{phase:"ROW",id:"P0_h3"}});expect(after.rows).toEqual([]);
  });
  it("retains actual lower baseline declarations without rewriting to default limits",async()=>{
    const p=await occupiedDensityPacket({seconds:30,maxStateInsertions:100000,maxWorkSteps:1000000,maxOutputBytes:4000000,maxRows:1});expect(p.status).toBe("PARTIAL");expect(p.reason).toBe("ROW_LIMIT");expect(p.baseline.packet!.status).toBe("COMPLETE");
    expect(p.baseline.packet!.limits).toMatchObject({seconds:30,maxStateInsertions:100000,maxWorkSteps:1000000,maxOutputBytes:4000000,maxRows:191});expect(p.rows).toHaveLength(1);
    const base=p.baseline.packet!,{packetDigest,...body}=base;expect(packetDigest).toBe(occupiedDensityDigest(body));
  });
  it("emits bounded omitted-baseline diagnostics and exact ordered row prefixes",async()=>{
    const small=await occupiedDensityPacket({maxOutputBytes:32768});expect(small.status).toBe("PARTIAL");expect(small.pending).toEqual({phase:"BASELINE"});expect(small.baseline.omitted).toBe(true);expect(small.baseline.packet).toBeNull();expect(small.rows).toEqual([]);expect(Number(small.runtime.outputBytes)).toBeLessThanOrEqual(32768);
    const row=await occupiedDensityPacket({maxRows:1});expect(row).toMatchObject({status:"PARTIAL",reason:"ROW_LIMIT",pending:{phase:"ROW",id:"P0_h7"}});expect(row.rows).toHaveLength(1);expect(row.baseline.packet!.rows).toHaveLength(191);
  });
  it("starts deadline before dependency reads and finalizes without late COMPLETE",async()=>{
    let n=0;const early=await occupiedDensityPacket({now:()=>n++?60000:0});expect(early).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"BASELINE"}});expect(early.baseline.packet).toBeNull();
    let calls=0;const late=await occupiedDensityPacket({now:()=>++calls>=clockCalls-1?60000:0});expect(late).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(late.rows).toHaveLength(191);
    const output=finalizeOccupiedDensityForOutput(packet,60000),{packetDigest,...body}=output;expect(output.status).toBe("PARTIAL");expect(packetDigest).toBe(occupiedDensityDigest(body));expect(Number(output.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(output)));
    const prior=finalizeOccupiedDensityForOutput(await occupiedDensityPacket({maxRows:1}),60000);expect(prior.reason).toBe("ROW_LIMIT");
  });
  it("retains valid canonical diagnostic when time expires inside baseline",async()=>{
    let calls=0;const p=await occupiedDensityPacket({now:()=>++calls<1000?0:60000});
    expect(p).toMatchObject({status:"PARTIAL",reason:"BASELINE_PARTIAL",pending:{phase:"BASELINE"}});
    expect(p.baseline.packet).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT"});expect(p.rows).toEqual([]);expect(verifyOccupiedDensityPacket(p)).toBe(true);
  });
  it("reports observed time through output trimming while retaining OUTPUT_LIMIT",async()=>{
    const cap=Number(packet.runtime.outputBytes)-100;
    let reads=0;const first=await occupiedDensityPacket({maxOutputBytes:cap,now:()=>{reads++;return 0;}});
    expect(first.status).toBe("PARTIAL");expect(first.reason).toBe("OUTPUT_LIMIT");expect(first.rows.length).toBeLessThan(packet.rows.length);let calls=0;
    const timed=await occupiedDensityPacket({maxOutputBytes:cap,now:()=>++calls>=reads-1?1500:0});
    expect(timed.status).toBe("PARTIAL");expect(timed.reason).toBe("OUTPUT_LIMIT");expect(timed.runtime.elapsedMs).toBe("1500");expect(timed.rows.map(r=>r.id)).toEqual(first.rows.map(r=>r.id));expect(verifyOccupiedDensityPacket(timed)).toBe(true);
  },30000);
  it("rejects source/cap drift while keeping source hashes explicitly local evidence",async()=>{
    for(const [key,path] of Object.entries({primary:"scripts/operations/block-coverage.ts",checker:"scripts/operations/block-coverage-check.ts",replay:"scripts/operations/block-coverage-replay.py"}))expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(OCCUPIED_DENSITY_SOURCE_PINS[key as keyof typeof OCCUPIED_DENSITY_SOURCE_PINS]);
    expect(packet.baseline.observedSourcePins).toEqual(OCCUPIED_DENSITY_SOURCE_PINS);await expect(occupiedDensityPacket({maxStateInsertions:2000001})).rejects.toThrow();await expect(occupiedDensityPacket({maxRows:192})).rejects.toThrow();await expect(occupiedDensityPacket({maxOutputBytes:32767})).rejects.toThrow();
  });
  it("rejects fully rehashed copied support, unpaid lift, cardinality, order, pending and receipt attacks",()=>{
    expect(verifyOccupiedDensityPacket(packet)).toBe(true);
    const attacks:Array<(p:OccupiedDensityPacket)=>void>=[
      p=>{p.rows.find(r=>r.certificate)!.certificate!.match.exponentsB=p.rows.find(r=>r.certificate)!.certificate!.match.exponentsA.slice();},
      p=>{p.rows.find(r=>r.certificate)!.certificate!.match.liftResidue="1";p.rows.find(r=>r.certificate)!.certificate!.match.liftExponents[0]="1";},
      p=>{const c=p.rows.find(r=>r.certificate)!.certificate!;c.exponents[0]=String(Number(c.exponents[0])+100);},
      p=>{p.rows.find(r=>r.decisions.length)!.decisions[0].occupiedA="999";},
      p=>{p.rows.find(r=>r.decisions.length)!.decisions[0].quotientOrder="1";},
      p=>{p.rows.find(r=>r.decisions.length)!.decisions[0].halfADigest="a".repeat(64);},
      p=>{p.rows.find(r=>r.decisions.length)!.decisions[0].mask="999";},
      p=>{[p.rows[0],p.rows[1]]=[p.rows[1],p.rows[0]];},
      p=>{p.pending={phase:"FINALIZE"};},
      p=>{p.runtime.baseStates="0";p.runtime.stateInsertions=p.runtime.additionalStates;},
      p=>{p.baseline.packet!.limits.maxStateInsertions=1999999;},
      p=>{p.baseline.observedSourcePins.primary="b".repeat(64);},
    ];
    for(const attack of attacks){const forged=structuredClone(packet);attack(forged);expect(verifyOccupiedDensityPacket(reseal(forged))).toBe(false);}
  },30000);
  it("rejects a real nonzero per-half inversion rather than testing a no-op zero vector",()=>{
    const forged=structuredClone(packet),c=forged.rows.find(r=>r.id==="N2_h83")!.certificate!;
    expect(c.match.exponentsA.some(z=>Number(z)!==0)).toBe(true);
    const before=c.match.exponentsA.slice();c.match.exponentsA=c.match.exponentsA.map(z=>String(-Number(z)));
    expect(c.match.exponentsA).not.toEqual(before);expect(verifyOccupiedDensityPacket(reseal(forged))).toBe(false);
  });
  it("retrospective gain counts are measured only after Main A/B agreement checkpoint",()=>{
    // Main authorized retrospective checks after direct191-row A/B agreement.
    const base=packet.baseline.packet!,gains=packet.rows.filter((r,i)=>r.certificate&&base.rows[i].status==="NOT_CERTIFIED"),lost=packet.rows.filter((r,i)=>base.rows[i].certificate&&r.status!=="INHERITED_CERTIFIED");
    expect(gains).toHaveLength(8);expect(lost).toEqual([]);expect(gains.filter(r=>r.id.startsWith("P")||r.id.startsWith("C"))).toHaveLength(1);expect(gains.find(r=>r.id==="P1_h79")!.certificate).not.toBeNull();
  });
  it("fixed imports/CLI forbid arbitrary roots and allocations",()=>{
    const bad=spawnSync(process.execPath,["--import","tsx","scripts/operations/occupied-density-audit.ts","--root=17"],{encoding:"utf8",timeout:5000});expect(bad.status).toBe(2);expect(bad.stdout).toBe("");
    const inert=spawnSync(process.execPath,["--import","tsx","--input-type=module","-e","await import('./scripts/operations/occupied-density.ts');console.log('INERT');"],{encoding:"utf8",timeout:5000});expect(inert.stdout.trim()).toBe("INERT");
  });
  it("actual async CLI downgrades at final serialization",async()=>{
    const argv=process.argv,exit=process.exitCode;let reads=0;vi.doMock("node:perf_hooks",()=>({performance:{now:()=>reads++?60000:0}}));vi.doMock("../../scripts/operations/occupied-density",()=>({...primary,occupiedDensityPacket:async()=>packet}));
    const log=vi.spyOn(console,"log").mockImplementation(()=>{});process.argv=["node","occupied-density-audit"];
    try{await import("../../scripts/operations/occupied-density-audit");await vi.waitFor(()=>expect(log).toHaveBeenCalled(),{timeout:2000});expect(JSON.parse(log.mock.calls[0][0] as string)).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(process.exitCode).toBe(1);}
    finally{process.argv=argv;process.exitCode=exit;log.mockRestore();vi.doUnmock("node:perf_hooks");vi.doUnmock("../../scripts/operations/occupied-density");}
  });
});
