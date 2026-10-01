import { beforeAll, describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import * as primary from "../../scripts/operations/factor-transfer-partitions";
import { FACTOR_TRANSFER_INPUTS, FACTOR_TRANSFER_LIMITS, factorTransferPacket, transferDigest, deriveTransferGraph,
  factorTransferCandidates, transferSignedImage, transferGroupDefect, validateTransferFactors, reconstructTransferWitness,
  finalizeTransferForOutput, assertTransferCandidate, TransferCandidateContradictionError, type FactorTransferPacket,
  type TransferEdge } from "../../scripts/operations/factor-transfer-partitions";

const B=BigInt;
let packet:FactorTransferPacket,clockCalls=0;
beforeAll(()=>{packet=factorTransferPacket({now:()=>{clockCalls++;return 0;}});});
function reference(T:number,h:number){const ds:number[]=[];for(let d=1;d*d<=T;d++)if(T%d===0){ds.push(d);if(d*d!==T)ds.push(T/d);}ds.sort((a,b)=>a-b);
  const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
  const modPow=(a:bigint,e:bigint):bigint=>{let r=B(1);for(;e;e/=B(2),a=a*a%B(h))if(e%B(2))r=r*a%B(h);return r;};
  const image=new Set<number>(),hits:number[][]=[];
  for(const u of ds)for(const v of ds){if(u*v>T||T%(u*v)||gcd(u,v)!==1)continue;
    image.add(Number(B(u)*modPow(B(v),B(h-2))%B(h)));if(u<=v&&(u+v)%h===0)hits.push([u,v]);}
  hits.sort(([a,b],[c,d])=>a-c||b-d);return {image:[...image].sort((a,b)=>a-b).map(String),pair:hits[0]?.map(String)??null};
}
function graphEdge(from:string,to:string,id:string,disposition:"DISCOVERED"|"REVISIT"|"DEPTH_LIMIT"="REVISIT",computed=true):TransferEdge{
  const body={id,kind:"EDGE" as const,from,to,q:to.split(":")[1],exponent:"1",requestedDepth:"1",disposition,targetComputed:computed,toDepth:computed?"0":null};
  return {...body,recordDigest:transferDigest(body)};
}
describe("fixed factor-directed transfers",()=>{
  it("computes exactly the frozen seeds and first-discovery depth2 graph",()=>{
    expect(packet.status).toBe("COMPLETE");expect(packet.inputs).toEqual(FACTOR_TRANSFER_INPUTS);expect(packet.limits).toEqual(FACTOR_TRANSFER_LIMITS);
    expect(packet.nodes).toHaveLength(17);expect(packet.records).toHaveLength(15);
    expect(packet.nodes.slice(0,13).map(n=>({p:n.p,h:n.h}))).toEqual(FACTOR_TRANSFER_INPUTS.seeds);
    expect(packet.nodes.map(n=>n.depth)).toEqual([...Array(13).fill("0"),"1","1","1","2"]);
    expect(packet.nodes.filter(n=>n.hit).map(n=>n.id)).toEqual(["200656681:239","131433121:103"]);
    expect(packet.records.filter(r=>r.kind==="EDGE")).toHaveLength(4);expect(packet.records.filter(r=>r.kind==="BLOCKER")).toHaveLength(11);
    expect(packet.frontier).toEqual([]);expect(packet.cycles).toEqual([]);
    expect(packet.contentDigest).toBe("952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4");
  });
  it("matches complete signed images and ordered numeric-lex strict partitions independently",()=>{
    for(const n of packet.nodes){const ref=reference(Number(n.T),Number(n.h));expect(n.image).toEqual(ref.image);
      expect(n.canonical?[n.canonical.u,n.canonical.v]:null).toEqual(ref.pair);
      if(n.canonical){const c=n.canonical;expect(reconstructTransferWitness(B(n.p),B(n.h),B(n.T),B(c.u),B(c.v))).toEqual(c);}
      expect(n.qnrFactors).toEqual(factorTransferCandidates(Number(n.p),Number(n.h),n.factors));
    }
  });
  it("retains exact large-shift stabilizers, quotient orders and repeated valuations without scanning h",()=>{
    const n=packet.nodes.find(n=>n.id==="131433121:2053643")!;expect(n.count).toBe("27");
    expect(n.defect).toMatchObject({stabilizer:["1"],size:"1",index:"2053642",visibleMass:"3"});
    const repeated=packet.nodes.find(n=>n.id==="200656681:2027")!;expect(repeated.factors).toEqual([["3","6"],["68813","1"]]);
    expect(repeated.defect).toMatchObject({size:"1",index:"2026",visibleMass:"7"});
    for(const n of packet.nodes)if(n.defect){const h=B(n.h),S=new Set(n.image),H=n.image.filter(r=>n.image.every(s=>S.has(String(B(r)*B(s)%h))));
      expect(n.defect.stabilizer).toEqual(H);expect(Object.values(n.defect.conditions).every(Boolean)).toBe(true);}
  });
  it("refutes only the declared C1 and never promotes finite C2/C3 survival to proof",()=>{
    expect(packet.progress.C1).toMatchObject({status:"REFUTED",firstRefutation:{recordId:"r9",from:"200656681:103",to:"200656681:2027"}});
    expect(packet.progress.C2).toEqual({status:"NO_REFUTATION_IN_COMPUTED_EDGES",firstRefutation:null});
    expect(packet.progress.C3).toEqual({status:"NO_REFUTATION_IN_COMPUTED_EDGES",firstRefutation:null});
    const a=packet.nodes.find(n=>n.id==="200656681:103")!,b=packet.nodes.find(n=>n.id==="200656681:2027")!;
    expect(Number(b.defect!.visibleMass)).toBeGreaterThan(Number(a.defect!.visibleMass));
    expect(B(b.count)*B(Number(a.h)-1)).toBeLessThan(B(a.count)*B(Number(b.h)-1));
  });
  it("retains blockers rather than inventing nonintegral fallback shifts",()=>{
    for(const r of packet.records)if(r.kind==="BLOCKER"){expect(Number(r.q)%4).toBe(1);expect((Number(packet.nodes.find(n=>n.id===r.from)!.p)+Number(r.q))%4).toBe(2);}
    const seed=packet.nodes[0];expect(seed.qnrFactors).toEqual([{q:"531977",exponent:"1",residue:"17",legendre:"-1",eligible:false,blocker:"NONINTEGRAL_SHIFT"}]);
    expect(packet.nodes.some(n=>n.h==="1595931")).toBe(false); // no unapproved c=3q fallback
  });
  it("preserves the non-strict q<=T boundary and rejects any inferred shift descent",()=>{
    // Independent arithmetic boundary control, not a new frozen graph node.
    const p=17,h=11,q=7,T=(p+h)/4;
    const character=(n:number,r:number)=>{let value=1;for(let e=0;e<(r-1)/2;e++)value=value*(n%r)%r;return value===r-1?-1:1;};
    expect(q).toBe(T);expect(q<T).toBe(false);expect(character(q,h)).toBe(-1);expect(character(p,q)).toBe(-1);
    expect(packet.nodes.some(n=>n.p==="17")).toBe(false);
    const grows=packet.records.find(r=>r.kind==="EDGE"&&r.from==="200656681:71")!;
    expect(Number(grows.q)).toBeGreaterThan(71); // legitimate transfer increases h
  });
  it("retains exact first C2/C3 countercontrols in graph projection without certifying synthetic arithmetic",()=>{
    const a=packet.nodes[0],b={...packet.nodes[1],defect:{...packet.nodes[1].defect!,size:"3",visibleMass:"1"}},r=graphEdge(a.id,b.id,"synthetic");
    const g=deriveTransferGraph([a,b],[r],false);
    expect(g.progress.C2).toMatchObject({status:"REFUTED",firstRefutation:{recordId:"synthetic"}});
    expect(g.progress.C3).toMatchObject({status:"REFUTED",firstRefutation:{recordId:"synthetic"}});
    expect(g.reachability.every(x=>!x.complete)).toBe(true); // projection fixture, not a replay-admitted certificate
  });
  it("keeps first-hit seed paths bounded by actual transfers, not reset at merged seed depths",()=>{
    expect(packet.reachability.filter(r=>r.status==="HIT_REACHABLE").map(r=>r.firstHitPath)).toEqual([
      ["200656681:71","200656681:239"],["131433121:31","131433121:2053643","131433121:103"]]);
    const [a,b,c]=packet.nodes,hit={...packet.nodes[13],id:"synthetic-hit"};
    const edges=[graphEdge(a.id,b.id,"s0"),graphEdge(b.id,c.id,"s1"),graphEdge(c.id,hit.id,"s2")];
    const graph=deriveTransferGraph([a,b,c,hit],edges,true);
    expect(graph.reachability[0].reachableHitIds).toEqual([]);expect(graph.reachability[1].firstHitPath).toEqual([b.id,c.id,hit.id]);
  });
  it("distinguishes revisits from directed cycles and retains uncomputed boundary frontier",()=>{
    const [a,b,c]=packet.nodes;
    const revisit=deriveTransferGraph([a,b,c],[graphEdge(a.id,b.id,"s0"),graphEdge(a.id,c.id,"s1"),graphEdge(b.id,c.id,"s2")],true);
    expect(revisit.cycles).toEqual([]);
    const edges=[graphEdge(a.id,b.id,"s0"),graphEdge(b.id,c.id,"s1"),graphEdge(c.id,a.id,"s2"),graphEdge(c.id,"uncomputed","s3","DEPTH_LIMIT",false)];
    const graph=deriveTransferGraph([a,b,c],edges,true);expect(graph.cycles).toMatchObject([{nodeIds:[a.id,b.id,c.id,a.id],recordIds:["s0","s1","s2"]}]);
    expect(graph.reachability[0].frontierRecordIds).toEqual(["s3"]);expect(graph.reachability[0].reachableHitIds).toEqual([]);
  });
  it("uses exact BigInt modular arithmetic above the Number product ceiling without adding a graph row",()=>{
    const h=100000007,r=h-2,H=B(h),pow=(a:bigint,e:bigint)=>{let v=B(1);for(;e;e/=B(2),a=a*a%H)if(e%B(2))v=v*a%H;return v;};
    const expected=new Set([1]);for(let z=-2;z<=2;z++)expected.add(Number(pow(z<0?pow(B(r),H-B(2)):B(r),B(Math.abs(z)))));
    expect(transferSignedImage(h,[{residue:r,exponent:2}])).toEqual([...expected].sort((a,b)=>a-b));
    expect(packet.nodes.some(n=>Number(n.h)===h)).toBe(false);
  });
  it("rejects malformed factors/groups/reconstruction and resource expansion",()=>{
    expect(()=>validateTransferFactors([["4","3"]],B(64))).toThrow();expect(()=>validateTransferFactors([["2","27"]],B(100500000))).toThrow();
    expect(()=>transferSignedImage(15,[{residue:2,exponent:1}])).toThrow();expect(()=>transferGroupDefect(31,[{residue:2,exponent:2}],[1,2])).toThrow();
    expect(()=>factorTransferCandidates(19,7,[["2","1"]])).toThrow();
    expect(()=>reconstructTransferWitness(B(200656681),B(239),B(50164231),B(3),B(5255))).toThrow();
    expect(()=>factorTransferPacket({maxNodes:257})).toThrow();expect(()=>factorTransferPacket({maxWorkSteps:50000001})).toThrow();
  });
  it("retains atomic node/factor prefix for every resource stop",()=>{
    const n=factorTransferPacket({maxNodes:1});expect(n).toMatchObject({status:"PARTIAL",reason:"NODE_LIMIT",pending:{phase:"NODE",id:"200023321:71"}});expect(n.nodes).toHaveLength(1);expect(n.records).toHaveLength(1);
    const r=factorTransferPacket({maxRecords:1});expect(r).toMatchObject({status:"PARTIAL",reason:"RECORD_LIMIT",pending:{phase:"FACTOR",id:"200023321:71",q:"61"}});expect(r.nodes).toHaveLength(2);expect(r.records).toHaveLength(1);
    expect(factorTransferPacket({maxStateInsertions:1})).toMatchObject({status:"PARTIAL",reason:"STATE_LIMIT",pending:{phase:"NODE",id:"200023321:31"}});
    expect(factorTransferPacket({maxWorkSteps:1})).toMatchObject({status:"PARTIAL",reason:"WORK_LIMIT",pending:{phase:"NODE",id:"200023321:31"}});
    const o=factorTransferPacket({maxOutputBytes:35000});expect(o.status).toBe("PARTIAL");expect(o.reason).toBe("OUTPUT_LIMIT");expect(Number(o.runtime.outputBytes)).toBeLessThanOrEqual(35000);
  });
  it("counts finalization and CLI serialization checkpoints and preserves earlier partial reasons",()=>{
    let calls=0;const late=factorTransferPacket({now:()=>++calls>=clockCalls-1?60000:0});expect(late).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(late.nodes).toHaveLength(17);
    expect(late.reachability.every(r=>!r.complete)).toBe(true);
    const output=finalizeTransferForOutput(packet,60000);expect(output.status).toBe("PARTIAL");expect(output.pending).toEqual({phase:"FINALIZE"});
    const {packetDigest,...body}=output;expect(packetDigest).toBe(transferDigest(body));expect(Number(output.runtime.outputBytes)).toBe(Buffer.byteLength(JSON.stringify(output)));
    const prior=finalizeTransferForOutput(factorTransferPacket({maxNodes:1}),60000);expect(prior.reason).toBe("NODE_LIMIT");
  });
  it("retains bounded injected candidate contradictions without COMPLETE authority",()=>{
    const changed={...packet.nodes[0],character:{legendre:"+1" as const,preferred:false}};
    try{assertTransferCandidate(changed);throw new Error("must reject");}catch(error){expect(error).toBeInstanceOf(TransferCandidateContradictionError);if(!(error instanceof TransferCandidateContradictionError))throw error;expect(error.node).toEqual(changed);expect(error.node).not.toBe(changed);}
  });
  it("rejects CLI expansion and keeps imports inert",()=>{
    const bad=spawnSync(process.execPath,["--import","tsx","scripts/operations/factor-transfer-audit.ts","--depth=3"],{encoding:"utf8",timeout:5000});expect(bad.status).toBe(2);expect(bad.stdout).toBe("");
    const inert=spawnSync(process.execPath,["--import","tsx","--input-type=module","-e","await import('./scripts/operations/factor-transfer-partitions.ts');console.log('INERT');"],{encoding:"utf8",timeout:5000});expect(inert.stdout.trim()).toBe("INERT");
  });
  it("actual fixed CLI branch emits PARTIAL when serialization observation reaches its deadline",async()=>{
    const argv=process.argv,exit=process.exitCode;let reads=0;
    vi.doMock("node:perf_hooks",()=>({performance:{now:()=>reads++?60000:0}}));
    vi.doMock("../../scripts/operations/factor-transfer-partitions",()=>({...primary,factorTransferPacket:()=>packet}));
    const log=vi.spyOn(console,"log").mockImplementation(()=>{});process.argv=["node","factor-transfer-audit"];
    try{await import("../../scripts/operations/factor-transfer-audit");await vi.waitFor(()=>expect(log).toHaveBeenCalled(),{timeout:2000});
      const emitted=JSON.parse(log.mock.calls[0][0] as string);expect(emitted).toMatchObject({status:"PARTIAL",reason:"TIME_LIMIT",pending:{phase:"FINALIZE"}});expect(process.exitCode).toBe(1);
    }finally{process.argv=argv;process.exitCode=exit;log.mockRestore();vi.doUnmock("node:perf_hooks");vi.doUnmock("../../scripts/operations/factor-transfer-partitions");}
  });
});
