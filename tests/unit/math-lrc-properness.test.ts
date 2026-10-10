import { describe,expect,it } from "vitest";
import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";
import { lrcScopeDigest,type LrcFiniteScope } from "@/modules/research-sandbox/math-lrc-certificates";
import { buildPhaseCertificate,phaseCertificateDigest,verifyPhaseCertificate,classifyCongruenceClass,retainedPropernessCases,
  validateRetainedPropernessReport,propernessReportDigest,propernessReplayBytes,buildHostPropernessBody,hostPropernessCases,
  type CongruenceClass,type PropernessReport,type PropernessMechanismBody } from "@/modules/research-sandbox/math-lrc-properness";
import rawReport from "../../docs/research/lrc-allikvere-v2/retained-properness-bridge.json";

function rehash(report:PropernessReport):PropernessReport {
  const {generatedAt:_,receipt:__,reportDigest:___,...body}=report;void _;void __;void ___;
  const stdout=propernessReplayBytes(body);
  const revised={...report,receipt:{...report.receipt,stdoutSha256:sha256(stdout),stdoutBytes:Buffer.byteLength(stdout)}};
  return {...revised,reportDigest:propernessReportDigest(revised)};
}
describe("properness exact phase partition",()=>{
  it("covers every critical boundary and intervening circle component including wrap",()=>{
    for(const [N,d] of [[4,2],[14,7],[15,3],[15,5],[15,15],[3,4],[2,32],[15,32]]) {
      const c=buildPhaseCertificate(N,d);expect(verifyPhaseCertificate(c)).toEqual(c);
      expect(c.cells).toHaveLength(c.boundaries.length*2);
      const last=c.cells.at(-1)!;expect(last.kind).toBe("OPEN");
      const right=BigInt(last.right.numerator)*BigInt(c.boundaries[0].denominator),first=BigInt(c.boundaries[0].numerator)*BigInt(last.right.denominator);
      expect(right-first).toBe(BigInt(last.right.denominator)*BigInt(c.boundaries[0].denominator));
    }
  });
  it("keeps the exact bad arc OPEN: N4/d2 equality is GOOD and every open cell has one bad point",()=>{
    const c=buildPhaseCertificate(4,2);expect(c.boundaries).toEqual([{numerator:"1",denominator:"4"},{numerator:"3",denominator:"4"}]);
    expect(c.cells.filter(x=>x.kind==="BOUNDARY").every(x=>x.badShiftIndices.length===0)).toBe(true);
    expect(c.cells.filter(x=>x.kind==="OPEN").every(x=>x.badShiftIndices.length===1)).toBe(true);
    expect(c.maximumBadShifts).toBe(1);
  });
  it("rejects incomplete, duplicated, overlapping, shifted, unreachable and mask-forged cells after rehash",()=>{
    const valid=buildPhaseCertificate(15,5);
    const mutations=[
      (c:typeof valid)=>{c.boundaries.pop();},(c:typeof valid)=>{c.cells.pop();},
      (c:typeof valid)=>{c.cells.push(structuredClone(c.cells[0]));},(c:typeof valid)=>{c.cells[1].left=c.cells[1].right;},
      (c:typeof valid)=>{c.cells[1].representative=c.cells[1].left;},(c:typeof valid)=>{c.cells[0].badShiftIndices=[4];},
      (c:typeof valid)=>{c.cells.at(-1)!.right=c.boundaries[0];},(c:typeof valid)=>{c.cells.reverse();},
      (c:typeof valid)=>{c.maximumBadShifts=0;},(c:typeof valid)=>{c.ceilBound=5;},
      (c:typeof valid)=>{c.boundaries[0]={numerator:"2",denominator:"30"};},
    ];
    for(const mutation of mutations) {const c=structuredClone(valid);mutation(c);c.certificateDigest=phaseCertificateDigest(c);expect(verifyPhaseCertificate(c)).toBeNull();}
  });
  it("rejects unbounded and noncanonical/cyclic inputs without coercion",()=>{
    expect(()=>buildPhaseCertificate(16,5)).toThrow();expect(()=>buildPhaseCertificate(15,33)).toThrow();
    expect(verifyPhaseCertificate({...buildPhaseCertificate(15,5),shiftModulus:true})).toBeNull();
    const c:Record<string,unknown>={};c.self=c;expect(verifyPhaseCertificate(c)).toBeNull();
    expect(verifyPhaseCertificate({text:"a".repeat(262145)})).toBeNull();
  });
});
describe("uniform whole-class applicability and conditional boundary",()=>{
  it("excludes only four pinned all-divisible integer classes, not their parent fibers",()=>{
    const classes=retainedPropernessCases().slice(0,4);
    for(const c of classes) {
      const a=classifyCongruenceClass(c);expect(a.status).toBe("NONPRIMITIVE_CLASS_EXCLUDED");expect(a.premises).toContain("ONLY_THIS_INTEGER_CLASS");
      expect(c.modulus%7).toBe(0);expect(c.residues.every(v=>v%7===0)).toBe(true);
      expect(classifyCongruenceClass({...c,modulus:c.modulus+1}).status).toBe("NOT_APPLICABLE");
      const residues=[...c.residues];residues[0]++;expect(classifyCongruenceClass({...c,residues}).status).toBe("NOT_APPLICABLE");
    }
  });
  it("retains lower witness/primitivity/distinctness/positivity on all synthetic controls",()=>{
    for(const c of retainedPropernessCases().slice(4)) {
      const a=classifyCongruenceClass(c,buildPhaseCertificate(c.totalRunners,c.divisor));
      expect(a.status).toBe("CONDITIONAL_LOWER_WITNESS");expect(a.lowerPremise).toBe("NOT_ESTABLISHED");
      expect(a.premises).toContain("POSITIVE_DISTINCT_PRIMITIVE_INTEGER_SPEEDS");expect(a.premises).toContain("LOWER_CASE_CONTINUOUS_WITNESS_REQUIRED");
      expect(classifyCongruenceClass(c).reason).toBe("PHASE_CERTIFICATE_MISSING_OR_MISMATCHED");
    }
  });
  it("requires STRICT joint shift capacity and units, never mere nondivisibility",()=>{
    const c=retainedPropernessCases()[4];const equal:CongruenceClass={...c,exceptionIndices:[0,1,2],residues:[1,4,7,...Array.from({length:11},(_,i)=>3*(i+1))]};
    expect(classifyCongruenceClass(equal,buildPhaseCertificate(15,3)).reason).toBe("STRICT_COMMON_SHIFT_BOUND_FAILED");
    // At phases 0,1/3,2/3 the three exceptions can forbid every q separately.
    const occupied=[0,1,2].map(j=>[0,1,2].find(q=>(j+q)%3===0));expect(new Set(occupied).size).toBe(3);
    const omit=retainedPropernessCases().at(-1)!;
    const composite={...omit,divisor:4,modulus:400,residues:[2,...Array.from({length:12},(_,i)=>4*(i+1))]};
    expect(classifyCongruenceClass(composite,buildPhaseCertificate(14,4)).reason).toBe("EXCEPTION_NOT_UNIT");
    expect(classifyCongruenceClass({...c,divisor:4,modulus:400,residues:[1,5,...Array.from({length:12},(_,i)=>4*(i+1))]},buildPhaseCertificate(15,4)).reason).toBe("FEW_EXCEPTION_DOMAIN");
    expect(()=>classifyCongruenceClass({...c,lowerPremise:"ESTABLISHED"} as unknown as CongruenceClass)).toThrow();
  });
  it("does not admit an unaccepted lower premise or an actual witness/global result field",()=>{
    const c=retainedPropernessCases()[4];expect(()=>classifyCongruenceClass({...c,actualWitness:"1/3"} as unknown as CongruenceClass)).toThrow();
    expect(classifyCongruenceClass({...c,exceptionIndices:[1,0]},buildPhaseCertificate(15,3)).reason).toBe("CLASS_SHAPE");
  });
  it("derives uniform residue superclasses from every axis value, without enumerating tuples",()=>{
    const scope:LrcFiniteScope={version:1,totalRunners:4,modulus:14,axes:[[1,8],[7],[2,9]]};
    expect(hostPropernessCases(scope).every(c=>c.divisor===7)).toBe(true);
    const s:LrcFiniteScope={version:1,totalRunners:4,modulus:16,axes:[[1,9],[4,12],[8]]};
    const c=hostPropernessCases(s).find(c=>c.divisor===4)!;expect(c.modulus).toBe(4);expect(c.residues).toEqual([1,0,0]);
    const body=buildHostPropernessBody(s,"a".repeat(64));expect(body.scopeBinding.sourceScopeDigest).toBe(lrcScopeDigest(s));
    expect(body.applications.find(x=>x.divisor===4)?.status).toBe("CONDITIONAL_LOWER_WITNESS");
  });
});
describe("retained pure properness admission",()=>{
  it("accepts real compact retained report and keeps global reproduction unestablished",()=>{
    const r=validateRetainedPropernessReport(rawReport)!;expect(r).not.toBeNull();expect(r.globalVerdict).toBe("NOT_ESTABLISHED");
    expect(r.applications.filter(a=>a.status==="NONPRIMITIVE_CLASS_EXCLUDED")).toHaveLength(4);
    expect(r.applications.filter(a=>a.status==="CONDITIONAL_LOWER_WITNESS")).toHaveLength(5);
    expect(r.phaseCertificates.reduce((n,c)=>n+c.cells.length,0)).toBe(46);
    expect(r.receipt.externalAttestation).toBe(false);
  });
  it("rejects coherent outer rehashes of geometry, scope, conclusions and source pins",()=>{
    const valid=rawReport as PropernessReport;
    const mutations=[
      (r:PropernessReport)=>{r.phaseCertificates[0].cells.pop();r.phaseCertificates[0].certificateDigest=phaseCertificateDigest(r.phaseCertificates[0]);},
      (r:PropernessReport)=>{r.applications[0].residues[0]+=7;},
      (r:PropernessReport)=>{r.applications[4].premises=[];},
      (r:PropernessReport)=>{r.applications[4].status="NONPRIMITIVE_CLASS_EXCLUDED";},
      (r:PropernessReport)=>{r.scopeBinding.sourceScopeDigest="b".repeat(64);},
      (r:PropernessReport)=>{r.receipt.sourceSha256="b".repeat(64);},
      (r:PropernessReport)=>{(r as unknown as {globalVerdict:string}).globalVerdict="PROVED";},
      (r:PropernessReport)=>{r.phaseCertificates[1].maximumBadShifts=0;},
    ];
    for(const mutate of mutations) {const r=structuredClone(valid);mutate(r);expect(validateRetainedPropernessReport(rehash(r))).toBeNull();}
  });
  it("fails closed on missing, corrupt, extra and wrong host projections",()=>{
    expect(validateRetainedPropernessReport(null)).toBeNull();expect(validateRetainedPropernessReport({...rawReport,claim:"global"})).toBeNull();
    expect(validateRetainedPropernessReport(rawReport,{scope:{version:1,totalRunners:3,modulus:6,axes:[[1],[2]]},rootContractDigest:"a".repeat(64)})).toBeNull();
    const {generatedAt:_,receipt:__,reportDigest:___,...body}=rawReport;void _;void __;void ___;
    expect(Buffer.byteLength(canonicalJson(body as PropernessMechanismBody))).toBeLessThan(20000);
  });
});
