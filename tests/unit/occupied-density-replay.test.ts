import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { occupiedDensityPacket } from "../../scripts/operations/occupied-density";
import { occupiedDensityHash as hash, occupiedDensityPacketSchema, compareOccupiedDensityReplay, verifyOccupiedDensityPacket, occupiedDensityAbstractPredicate, type OccupiedDensityPacket } from "../../scripts/operations/occupied-density-check";
import { OCCUPIED_DENSITY_REPLAY_SHA256, replayOccupiedDensity } from "../../scripts/operations/occupied-density-replay";
import { blockCoverageHash, verifyBlockCoveragePacket, type BlockCoveragePacket } from "../../scripts/operations/block-coverage-check";
vi.mock("node:child_process", { spy: true }); vi.mock("node:fs", { spy: true });
vi.mock("node:perf_hooks", async importOriginal => { const actual = await importOriginal<typeof import("node:perf_hooks")>(); return {...actual,performance:{now:vi.fn(()=>actual.performance.now())}}; });
let primary: OccupiedDensityPacket, replay: OccupiedDensityPacket;
function summary(p: OccupiedDensityPacket) {
  const counts = () => ({INHERITED_CERTIFIED:"0",DENSITY_CERTIFIED:"0",NOT_CERTIFIED:"0"}), out = {complete:p.status === "COMPLETE",counts:counts(),cohorts:{EXPOSED_71:counts(),PRIMALITY_ONLY_120:counts()}};
  const inputs = p.inputs as {baselineInputs:{rows:{cohort:"EXPOSED_71"|"PRIMALITY_ONLY_120"}[]}};
  p.rows.forEach((r,i) => {out.counts[r.status] = String(Number(out.counts[r.status])+1); const c = out.cohorts[inputs.baselineInputs.rows[i].cohort]; c[r.status] = String(Number(c[r.status])+1);}); return out;
}
function sealBase(p: BlockCoveragePacket) {
  for (const r of p.rows) { for (const a of r.attempts) { const {attemptDigest,...body} = a; void attemptDigest; a.attemptDigest = hash(body); } const {rowDigest,...body} = r; void rowDigest; r.rowDigest = hash(body); }
  p.rowsDigest = hash(p.rows); p.contentDigest = hash({inputs:p.inputs,rows:p.rows,rowsDigest:p.rowsDigest,summary:p.summary});
  for(let i=0;i<16;i++){const{packetDigest,...body}=p;void packetDigest;p.packetDigest=hash(body);const bytes=String(Buffer.byteLength(JSON.stringify(p)));if(bytes===p.runtime.outputBytes)return;p.runtime.outputBytes=bytes;}
}
function seal(p: OccupiedDensityPacket, derive = true) {
  for (const r of p.rows) {const{rowDigest,...body}=r;void rowDigest;r.rowDigest=hash(body);}
  p.rowsDigest=hash(p.rows);if(derive)p.summary=summary(p);
  p.contentDigest=hash({inputs:p.inputs,baselineContentDigest:p.baselineContentDigest,baselineRowsDigest:p.baselineRowsDigest,rows:p.rows,rowsDigest:p.rowsDigest,summary:p.summary});
  for(let i=0;i<16;i++){const{packetDigest,...body}=p;void packetDigest;p.packetDigest=hash(body);const bytes=String(Buffer.byteLength(JSON.stringify(p)));if(bytes===p.runtime.outputBytes)return p;p.runtime.outputBytes=bytes;}throw new Error("FIXED_POINT");
}
function gain(p: OccupiedDensityPacket) { return p.rows.find(r=>r.status === "DENSITY_CERTIFIED")!; }
function python(code: string) { return spawnSync("python3",["-I","-S","-B","-c",`import runpy,json,math\ng=runpy.run_path('scripts/operations/occupied-density-replay.py')\nn=g['packet'].__globals__\n${code}`],{encoding:"utf8",timeout:60000,maxBuffer:8388608,env:{PATH:process.env.PATH??"/usr/bin:/bin",NODE_ENV:"test"}}); }
function pyPacket(code: string) {const r=python(code);expect(r.status,r.stderr).toBe(0);return JSON.parse(r.stdout) as OccupiedDensityPacket;}

describe("TIP042 independently replayed occupied-half density",()=>{
  beforeAll(async()=>{primary=occupiedDensityPacketSchema.parse(await occupiedDensityPacket());expect(verifyOccupiedDensityPacket(primary)).toBe(true);const r=replayOccupiedDensity(primary);expect(r.status,r.reason).toBe("PASS");replay=occupiedDensityPacketSchema.parse(r.replay);},60000);
  it("fresh exact verified source and baseline bytes agree across all191 rows and strict lifted tuples",()=>{
    expect(compareOccupiedDensityReplay(primary,replay)).toBe("PASS");expect(primary.contentDigest).toBe("e9fcbee161256e09693a27100aee3571a785376155cf0ddd4de5c3ea9b24056b");
    expect(primary.rows).toHaveLength(191);expect(replay.baseline.packet!.rows).toEqual(primary.baseline.packet!.rows);
    expect(replay.runtime.basePairs).toBe("95791");expect(BigInt(replay.runtime.workSteps)).toBe(BigInt(replay.runtime.baseWork)+BigInt(replay.runtime.additionalWork));
    expect(primary.rows.filter(r=>r.status==="INHERITED_CERTIFIED").every(r=>r.certificate===null&&!r.decisions.length&&r.allocation.totalPartitions==="0")).toBe(true);
    for(const row of primary.rows.filter(r=>r.certificate)){const w=row.certificate!.witness,base=primary.baseline.packet!.rows.find(r=>r.id===row.id)!;const[x,y,z,p]=[w.x,w.y,w.z,base.p].map(BigInt);expect(BigInt(4)*x*y*z).toBe(p*(x*y+x*z+y*z));expect(row.decisions.at(-1)!.sufficient).toBe(true);}
  });
  it("fully rehashed source/scope/domain/order/occupancy/mass/threshold/first-success/allocation/lift/valuation/BigInt attacks reject",()=>{
    const mutations:((p:OccupiedDensityPacket)=>void)[]=[
      p=>{(p.inputs as {policy:string}).policy="smaller-generated-group";},p=>{p.scope="fake" as never;},p=>{p.baseline.expectedSourcePins.replay="0".repeat(64);},p=>{p.baseline.observedSourcePins.replay=null;},
      p=>{p.rows.reverse();},p=>{gain(p).decisions[0].occupiedA="999";},p=>{gain(p).decisions[0].quotientOrder="1";},p=>{gain(p).decisions[0].halfADigest="0".repeat(64);},
      p=>{gain(p).decisions[0].baselineAttemptDigest="0".repeat(64);},p=>{gain(p).decisions[0].attemptIndex="1";},p=>{gain(p).decisions[0].mask="2";},p=>{gain(p).decisions[0].sufficient=false;},
      p=>{gain(p).decisions.pop();},p=>{gain(p).allocation.notEvaluatedPartitions="99";},p=>{p.rows[0].allocation.totalPartitions="1";},p=>{p.rows[0].status="DENSITY_CERTIFIED";},
      p=>{gain(p).certificate!.match.liftResidue=gain(p).certificate!.match.liftResidue==="1"?"78":"1";},p=>{gain(p).certificate!.match.exponentsA[0]="99";},p=>{gain(p).certificate!.match.cosetA="999";},
      p=>{gain(p).certificate!.match.exponentsB= gain(p).certificate!.match.exponentsA;},p=>{gain(p).certificate!.orientation=gain(p).certificate!.orientation==="INVERTED"?"AS_CONSTRUCTED":"INVERTED";},
      p=>{gain(p).certificate!.exponents[0]="99";},p=>{gain(p).certificate!.witness.y="1";},p=>{gain(p).certificate!.witness.k=String(BigInt(gain(p).certificate!.witness.k)+BigInt(1));},p=>{gain(p).certificate!.witness.u="999";},
      p=>{p.rows[0].baselineStatus="NOT_CERTIFIED";},p=>{p.rows[0].baselineRowDigest="0".repeat(64);},p=>{p.baselineRowsDigest="0".repeat(64);},
    ];
    for(const [index,mutate] of mutations.entries()){const p=structuredClone(primary);mutate(p);expect(hash(p),`mutation ${index} must change data`).not.toBe(hash(primary));seal(p);expect(verifyOccupiedDensityPacket(p),`mutation ${index}`).toBe(false);}
  },30000);
  it("known frozen baseline protects coherent redistributed multiplicities, missing/duplicate/fake cosets and overlapping supports",()=>{
    const mutations:((p:OccupiedDensityPacket)=>void)[]=[
      p=>{const h=p.baseline.packet!.rows.find(r=>r.id==="P0_h59")!.attempts[0].B,twos=h.frequencies.filter(f=>f.mu==="2");twos[0].mu="1";twos[1].mu="3";const E=h.frequencies.reduce((a,f)=>a+BigInt(f.mu)**BigInt(2),BigInt(0)),N=BigInt(h.N);h.E=String(E);h.L=String((N*N+E-BigInt(1))/E);},
      p=>{p.baseline.packet!.rows.find(r=>r.attempts.length)!.attempts[0].A.frequencies.pop();},
      p=>{const h=p.baseline.packet!.rows.find(r=>r.attempts.length)!.attempts[0].A;h.frequencies.push(h.frequencies[0]);},
      p=>{p.baseline.packet!.rows.find(r=>r.attempts.length)!.attempts[0].A.frequencies[0].coset="2";},
      p=>{const a=p.baseline.packet!.rows.find(r=>r.attempts.length)!.attempts[0];a.B.factorIndices=a.A.factorIndices;},
      p=>{p.baseline.packet!.rows[0].factors[0][1]="2";},p=>{p.baseline.packet!.rows[0].p="19";},
    ];
    for(const mutate of mutations){const p=structuredClone(primary);mutate(p);sealBase(p.baseline.packet!);p.baselineContentDigest=p.baseline.packet!.contentDigest;p.baselineRowsDigest=p.baseline.packet!.rowsDigest;seal(p);expect(verifyOccupiedDensityPacket(p)).toBe(false);expect(replayOccupiedDensity(p).status).toBe("MISMATCH");}
    // Unlike older generic half consistency, protected COMPLETE corpus is not weakened
    // to manufacture a plausible local-pass/fresh-fail fixture.
  },30000);
  it("abstract strict density has equality hit and miss, subset sufficiency but no complete-image authority",()=>{
    const sums=new Set([0,1,2].flatMap(a=>[0,1,2].map(b=>(a+b)%6)));
    expect(sums.has(3)).toBe(true);expect(sums.has(5)).toBe(false);
    expect(occupiedDensityAbstractPredicate(6,[0,1,2],[0,1,2]).sufficient).toBe(false); // equality hit3/miss5
    expect(occupiedDensityAbstractPredicate(6,[0,1,2,3],[0,1,2]).sufficient).toBe(true);
    expect(()=>occupiedDensityAbstractPredicate(6,[0,0,1,2],[0,1,2])).toThrow();expect(()=>occupiedDensityAbstractPredicate(6,[6],[0])).toThrow();
    // Full quotient is8; replacing it by generated subgroup4 would falsely pass.
    expect(occupiedDensityAbstractPredicate(8,[0,1,2],[0,1,2]).sufficient).toBe(false);
    const out=python("S={pow(2,t,15) for t in range(-2,3)}\nprint(json.dumps({'singlePrimeValuationCannotBeSplit':math.gcd(2,2)!=1,'local3':2 in {r%3 for r in S},'local5':4 in {r%5 for r in S},'joint':14 in S}))");expect(out.status).toBe(0);expect(JSON.parse(out.stdout)).toEqual({singlePrimeValuationCannotBeSplit:true,local3:true,local5:true,joint:false});
  });
  it("proof-only nonidentity paid-K lift preserves ordered half representatives and whole-vector orientation",()=>{
    const out=python("ns=g['dependency']({})\nb=ns['Budget']()\nfs=[(2,1),(3,1),(5,1)]\nK={1:[0,0,0],2:[1,0,0],4:[-1,0,0]}\na=ns['half_histogram'](fs,[1],K,7,b)\nc=ns['half_histogram'](fs,[2],K,7,b)\nattempt={'mask':'1','A':a,'B':c,'quotientOrder':'2','sufficient':False}\nattempt['attemptDigest']=g['digest'](attempt)\nrow={'id':'ABSTRACT_ONLY','p':'113','m':'7','T':'30','groupOrder':'6','factors':[['2','1'],['3','1'],['5','1']],'chain':{'covered':ns['entries'](K)},'attempts':[attempt],'allocation':{'totalPartitions':'1'},'status':'NOT_CERTIFIED','rowDigest':'0'*64}\nresult=g['density_row'](row,b)\nprint(g['compact'](result),end='')");
    expect(out.status,out.stderr).toBe(0);const row=JSON.parse(out.stdout);expect(row.certificate).toMatchObject({match:{exponentsA:["0","0","0"],exponentsB:["0","0","-1"],liftResidue:"2",liftExponents:["1","0","0"]},exponents:["1","0","-1"],orientation:"AS_CONSTRUCTED",witness:{u:"2",v:"5",x:"30",y:"678",z:"1695"}});
    const p=structuredClone(primary);p.rows[0]=row;seal(p);expect(verifyOccupiedDensityPacket(p)).toBe(false); // no arbitrary root/campaign authority
  });
  it("actual tighter COMPLETE baseline declarations remain execution evidence, not default-limit relabeling",async()=>{
    const p=occupiedDensityPacketSchema.parse(await occupiedDensityPacket({maxStateInsertions:100000,maxWorkSteps:5000000,maxOutputBytes:4000000}));expect(verifyOccupiedDensityPacket(p)).toBe(true);
    expect(p.baseline.packet!.limits).toMatchObject({maxStateInsertions:100000,maxWorkSteps:5000000,maxOutputBytes:4000000,maxRows:191});expect(verifyBlockCoveragePacket(p.baseline.packet)).toBe(false);
    const r=replayOccupiedDensity(p);expect(r.status,r.reason).toBe("PASS");expect((r.replay as OccupiedDensityPacket).baseline.packet!.limits).toEqual(p.baseline.packet!.limits);
    const wrong=structuredClone(p);wrong.baseline.packet!.limits.maxWorkSteps=1;sealBase(wrong.baseline.packet!);seal(wrong);expect(verifyOccupiedDensityPacket(wrong)).toBe(false);
  },30000);
  it("baseline and additive state/work/pair/row caps are cumulative with precise atomic prefixes",async()=>{
    for(const options of [{maxRows:1},{maxStateInsertions:1},{maxWorkSteps:1}]){const p=occupiedDensityPacketSchema.parse(await occupiedDensityPacket(options));expect(verifyOccupiedDensityPacket(p)).toBe(true);expect(replayOccupiedDensity(p).status).toBe("PARTIAL");expect(p.status).toBe("PARTIAL");}
    for(const args of ["maxPairChecks=1","maxWorkSteps=1","maxStateInsertions=1","maxRows=1","maxStateInsertions=20913"]){const p=pyPacket(`p=g['packet'](${args})\nprint(g['compact'](p),end='')`);expect(verifyOccupiedDensityPacket(p)).toBe(true);expect(p.status).toBe("PARTIAL");expect(compareOccupiedDensityReplay(primary,p)).toBe("PARTIAL");}
    const p=pyPacket("p=g['packet'](maxRows=1)\nprint(g['compact'](p),end='')");expect(p.baseline.packet!.rows).toHaveLength(191);expect(p.pending).toEqual({phase:"ROW",id:"P0_h7"});
  },30000);
  it("first/mid/last density row and FINALIZE expiry retain exact prefix; baseline loading and constructor are timed",()=>{
    for(const [phase,id,count] of [["ROW","P0_h3",0],["ROW","N0_h3",71],["ROW","N7_h107",190],["FINALIZE","",191]] as const){
      const p=pyPacket(`original=n['dependency']\ndef load(observed):\n    ns=original(observed)\n    check=ns['Budget'].check\n    def guarded(self):\n        if getattr(self,'phase',None)=='${phase}' and (${JSON.stringify(id)}=='' or self.pending.get('id')==${JSON.stringify(id)}): raise ns['Stop']('REPLAY_TIME_LIMIT')\n        check(self)\n    ns['Budget'].check=guarded\n    return ns\nn['dependency']=load\np=g['packet']()\nprint(g['compact'](p),end='')`);
      expect(verifyOccupiedDensityPacket(p)).toBe(true);expect(p.rows).toHaveLength(count);expect(p.status).toBe("PARTIAL");expect(p.pending?.phase).toBe(phase);
    }
    const early=pyPacket("original=n['dependency']\ndef load(observed):\n    ns=original(observed)\n    ticks[0]=60\n    return ns\nn['dependency']=load\nticks=[0]\np=g['packet'](clock=lambda:ticks[0])\nprint(g['compact'](p),end='')");expect(early.pending).toEqual({phase:"BASELINE"});expect(early.status).toBe("PARTIAL");expect(verifyOccupiedDensityPacket(early)).toBe(true);
  },30000);
  it("post-serialization deadline and resource/summary/pending forgery cannot COMPLETE or PASS",()=>{
    const late=pyPacket("original=n['seal']\nticks=[0]\ndef seal(p):\n    original(p)\n    if len(p['rows'])==191: ticks[0]=60\nn['seal']=seal\np=g['packet'](clock=lambda:ticks[0])\nprint(g['compact'](p),end='')");expect(late.status).toBe("PARTIAL");expect(late.pending).toEqual({phase:"FINALIZE"});expect(verifyOccupiedDensityPacket(late)).toBe(true);
    for(const mutate of [(p:OccupiedDensityPacket)=>{p.runtime.elapsedMs="60000";},(p:OccupiedDensityPacket)=>{p.runtime.workSteps="50000001";},(p:OccupiedDensityPacket)=>{p.runtime.basePairs="50000001";},(p:OccupiedDensityPacket)=>{p.summary.counts.NOT_CERTIFIED="0";},(p:OccupiedDensityPacket)=>{p.status="PARTIAL";p.reason="ROW_LIMIT";p.pending={phase:"ROW",id:"P0_h3"};}]){const p=structuredClone(primary);mutate(p);seal(p,false);expect(verifyOccupiedDensityPacket(p)).toBe(false);}
  },30000);
  it("bounded output retains prefix or explicitly omits baseline, never oversized or admitting",async()=>{
    const p=pyPacket("p=g['packet'](maxOutputBytes=32768)\nprint(g['compact'](p),end='')");expect(p.status).toBe("PARTIAL");expect(Number(p.runtime.outputBytes)).toBeLessThanOrEqual(32768);expect(verifyOccupiedDensityPacket(p)).toBe(true);expect(p.rows).toHaveLength(0);expect(p.pending).toEqual({phase:"BASELINE"});
    const a=occupiedDensityPacketSchema.parse(await occupiedDensityPacket({maxOutputBytes:32768}));expect(verifyOccupiedDensityPacket(a)).toBe(true);expect(Number(a.runtime.outputBytes)).toBeLessThanOrEqual(32768);
  },30000);
  it("standalone final stdout applies the actual tightened seconds and output cap",()=>{
    const r=python("import io\np=g['packet'](seconds=30)\noriginal=n['compact']\nticks=[0]\ndef compact(value):\n    payload=original(value)\n    if value is p: ticks[0]=31\n    return payload\nn['compact']=compact\nn['packet']=lambda **kwargs:p\nn['time'].monotonic=lambda:ticks[0]\nn['sys'].stdin=io.StringIO('{\"seconds\":30}')\nn['sys'].argv=['fixed']\ng['main']()");
    expect(r.status,r.stderr).toBe(0);const p=JSON.parse(r.stdout) as OccupiedDensityPacket;expect(p.status).toBe("PARTIAL");expect(p.pending).toEqual({phase:"FINALIZE"});expect(p.limits.seconds).toBe(30);expect(p.runtime.elapsedMs).toBe("31000");expect(verifyOccupiedDensityPacket(p)).toBe(true);
    const output=python("import io\np=g['packet']()\np['limits']['maxOutputBytes']=32768\nn['packet']=lambda **kwargs:p\nn['sys'].stdin=io.StringIO('{}')\nn['sys'].argv=['fixed']\ng['main']()");expect(output.status).not.toBe(0);expect(output.stdout).toBe("");expect(output.stderr).toContain("OUTPUT_STDOUT_LIMIT");
    const diagnostic=python("import io\ndef fail(**kwargs): raise g['Investigation']({'synthetic':'x'*40000})\nn['packet']=fail\nn['sys'].stdin=io.StringIO('{\"maxOutputBytes\":32768}')\nn['sys'].argv=['fixed']\ng['main']()");expect(diagnostic.status).toBe(1);expect(diagnostic.stdout).toBe("");
    const invalid=python("g['packet'](seconds=float('nan'))");expect(invalid.status).not.toBe(0);expect(invalid.stderr).toContain("LIMIT_DOMAIN");
  },30000);
  it("fixed dependency and process faults are unavailable with actual/expected provenance separated",()=>{
    const source=readFileSync("scripts/operations/occupied-density-replay.py");vi.mocked(readFileSync).mockReturnValueOnce(Buffer.from("drift") as never);const bad=replayOccupiedDensity(primary);expect(bad.status).toBe("UNAVAILABLE");expect(bad.verifiedScriptDigest).toBeNull();expect(bad.observedScriptDigest).not.toBe(OCCUPIED_DENSITY_REPLAY_SHA256);
    vi.mocked(readFileSync).mockReturnValueOnce(source as never).mockReturnValueOnce(Buffer.from("dependency drift") as never);const dep=replayOccupiedDensity(primary);expect(dep.status).toBe("UNAVAILABLE");expect(dep.verifiedDependencyDigests.primary).toBeNull();
    const failures=[{error:new Error("ENOENT"),status:null,stdout:""},{error:new Error("timeout"),status:null,stdout:""},{status:1,stdout:'{"status":"INVESTIGATION"}'},{status:0,stdout:"invalid"},{status:0,stdout:" ".repeat(8388609)}];
    for(const result of failures){vi.mocked(spawnSync).mockReturnValueOnce(result as never);expect(replayOccupiedDensity(primary).status).not.toBe("PASS");}
  },30000);
  it("verified bytes are executed with restricted process authority and final receipt checkpoint includes retained work",()=>{
    const source=readFileSync("scripts/operations/occupied-density-replay.py","utf8");expect(blockCoverageHash(source)).not.toBe(OCCUPIED_DENSITY_REPLAY_SHA256); // textJSON hash is not raw source fingerprint
    replayOccupiedDensity(primary);const call=vi.mocked(spawnSync).mock.calls.at(-1)!;expect(call[1]).toEqual(["-I","-S","-B","-c",source]);expect(call[2]).toMatchObject({input:JSON.stringify(Object.fromEntries(Object.entries(primary.limits).filter(([k])=>k!=="checkerWorkCeiling")))});expect(Object.keys(call[2]!.env!)).toEqual(["PATH","PYTHONDONTWRITEBYTECODE","NODE_ENV"]);
    const clock=vi.mocked(performance.now);clock.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(59999).mockReturnValueOnce(60000);const r=replayOccupiedDensity(primary);expect(r.status).toBe("UNAVAILABLE");expect(r.reason).toBe("WRAPPER_TIME_LIMIT");expect(r.elapsedMs).toBe(60000);clock.mockReset();clock.mockImplementation(()=>Number(process.hrtime.bigint()/BigInt(1000000)));
  },30000);
});
