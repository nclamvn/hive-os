import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { sha256 } from "@/modules/execution-fabric/contracts";
import { PRIME_CRITERION_RETAINED_PATH,PRIME_CRITERION_RETAINED_SHA256,reconstructPrimeCriterionBody,validateRetainedPrimeCriterionReport,primeCriterionReportDigest,primeCriterionReplayBytes,type PrimeCriterionReport } from "@/modules/research-sandbox/math-lrc-prime-criterion";
const bytes=readFileSync(PRIME_CRITERION_RETAINED_PATH,"utf8"),retained=JSON.parse(bytes) as PrimeCriterionReport;
function rehash(r:PrimeCriterionReport){const {generatedAt:_,receipt:__,reportDigest:___,...body}=r;void _;void __;void ___;const out=primeCriterionReplayBytes(body);r.receipt.stdoutSha256=sha256(out);r.receipt.stdoutBytes=Buffer.byteLength(out);r.reportDigest=primeCriterionReportDigest(r);return r;}
function gcd(a:number,b:number){while(b)[a,b]=[b,a%b];return a;}
describe("source-located lower premises and conditional universal prime criterion",()=>{
  it("admits pinned complete controls without reproducing author sources or accepting target divisibility",()=>{
    expect(sha256(bytes)).toBe(PRIME_CRITERION_RETAINED_SHA256);expect(validateRetainedPrimeCriterionReport(retained)).toEqual(retained);expect(retained.globalVerdict).toBe("NOT_ESTABLISHED");expect(retained.formalProof).toBe(false);
    expect(retained.sourceLedger[0]).toMatchObject({sourceId:"arXiv:2604.23906v2",theorem:"1.3",movingSpeedRange:[1,12],totalRunnerRange:[2,13],status:"SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED"});
    expect(retained.lowerReplaySource).toEqual({residualTuples:1092,primes:91,status:"AUTHOR_REPORTED_ONLY",snapshotLinksRetrieved:false,localReplay:false});
    expect(retained.applications).toEqual([{movingSpeeds:13,totalRunners:14,lowerThrough:12,lowerStatus:"SOURCE_LOCATED_NOT_REPRODUCED",primeCriterion:"CONDITIONAL_REVIEWED",authorCoverage:"NOT_ESTABLISHED",divisibilityAccepted:false},{movingSpeeds:14,totalRunners:15,lowerThrough:13,lowerStatus:"PRIOR_FULL_LRC13_NOT_ESTABLISHED",primeCriterion:"CONDITIONAL_REVIEWED",authorCoverage:"NOT_ESTABLISHED",divisibilityAccepted:false}]);
  });
  it("requires ALL base classes, full lift fibers and full integer-class alternatives",()=>{
    expect(retained.criterionReview).toMatchObject({allBaseClassesRequired:true,fullLiftFiberRequired:true,thirdBranchDomain:"EVERY_POSITIVE_DISTINCT_INTEGER_LIFT_NOT_PRIMITIVE_ONLY",primitiveOmittedGcdImpliesUnit:true,openBadArcBoundaryGood:true,uniformLevel:"LCM_OF_FINITE_PER_BASE_TERMINAL_LEVELS",genericThirdBranchSymmetry:"SEPARATE_PROOF_REQUIRED"});
    expect(retained.terminalConditions.cases.map(c=>[c.movingSpeeds,c.totalRunners,c.eligibleConditionsOnly,c.automaticAcceptance])).toEqual([[12,13,true,false],[13,14,false,false],[14,15,false,false]]);
  });
  it("derives all93 control phase partitions and all5550 boundary/open cells",()=>{
    const body=reconstructPrimeCriterionBody();expect(body.shiftAudits).toHaveLength(93);let sum=0;
    for(const k of [3,13,14])for(let h=2;h<=32;h++){
      const row=body.shiftAudits.find(c=>c.movingSpeeds===k&&c.effectiveOrbit===h)!;
      const boundaryCount=(2*h)%(k+1)===0?h:2*h;expect(row.boundaries).toBe(boundaryCount);expect(row.cells).toBe(2*boundaryCount);expect(row.allHaveGoodShift).toBe(true);expect(row.minimumGoodShifts).toBeGreaterThanOrEqual(1);sum+=row.cells;
    }expect(sum).toBe(5550);expect(body.shiftCellCount).toBe(sum);
  });
  it("keeps open-arc equality good and generalized nonunit controls apart from primitive application",()=>{
    expect(retained.boundaryControl).toMatchObject({movingSpeeds:3,effectiveOrbit:2,phase:{numerator:"1",denominator:"4"},goodShifts:[0,1],equalityGood:true});
    expect(retained.negativeShiftControls.map(c=>c.goodShifts)).toEqual([[],[]]);
    expect(retained.generalizedNonunitControl).toMatchObject({divisor:6,exceptionSpeed:2,effectiveOrbit:3,firstGoodShift:1,primitiveApplication:false});
    expect(retained.generalizedNonunitControl.phases).toEqual([{numerator:"0",denominator:"1"},{numerator:"1",denominator:"3"},{numerator:"2",denominator:"3"},{numerator:"0",denominator:"1"},{numerator:"1",denominator:"3"},{numerator:"2",denominator:"3"}]);
  });
  it("checks all8 lifts for both transfers without claiming the off-grid time for every lift",()=>{
    expect(retained.transferControls).toHaveLength(2);expect(retained.transferControls[0]).toMatchObject({kind:"GRID_WITNESS",rows:8,parentGridWitness:5,childGridNumerator:10});expect(retained.transferControls[1]).toMatchObject({kind:"GCD_MONOTONICITY",rows:8,parentGridWitness:null,gcdDivisor:2});
    expect(retained.offGridControl).toMatchObject({parentResidues:[2,4,1],parentGridWitness:null,initialTime:{numerator:"1",denominator:"6"},finalTime:{numerator:"2",denominator:"3"},finalDistances:Array(3).fill({numerator:"1",denominator:"3"}),sameOffGridTimeClaimedForLifts:false});
  });
  it("independently counts the full512/4096 toy domains including repeated and nonprimitive residue rows",()=>{
    for(const p of [3,5]){
      const M=4*p,values=Array.from({length:M-1},(_,i)=>i+1).filter(x=>x%p!==0);let rows=0,grid=0,only=0,bad=0;
      for(const a of values)for(const b of values)for(const c of values){const v=[a,b,c];rows++;const j=Array.from({length:M},(_,j)=>j).find(j=>v.every(x=>4*Math.min((j*x)%M,M-(j*x)%M)>=M));
        const omitted=v.some((_,i)=>v.filter((_,j)=>j!==i).reduce(gcd,4)>1);if(j!==undefined)grid++;else if(omitted)only++;else bad++;
      }const domain=retained.toyDomains.find(c=>c.prime===p)!;expect([rows,grid,only,bad]).toEqual([domain.rows,domain.gridGood,domain.gcdOnly,domain.improper]);expect(domain.preservesRepeatedCoordinates).toBe(true);
    }
    expect(retained.toyDomains.map(c=>[c.rows,c.gridGood,c.gcdOnly,c.improper,c.coverage])).toEqual([[512,512,0,0,"COMPLETE_TOY_DOMAIN_ONLY"],[4096,3472,432,192,"INCOMPLETE"]]);
    // Definition2.1 gcd-proper includes all coordinates divisible by g.
    // Requiring an exceptional unit here would incorrectly drop proper leaves.
    expect([2,4,6].filter((_,i)=>i!==2).reduce(gcd,4)).toBe(2);
  });
  it("transports the witness by b rather than b inverse and exposes lost integer primitivity",()=>{
    expect(retained.unitTransport).toMatchObject({modulus:28,scalingUnit:5,inverseUnit:17,witnessNumerator:2,correctNumerator:10,wrongInverseNumerator:6,correctGood:true,wrongGood:false,scaledIntegerGcd:5,primitivePreserved:false});
    expect(retained.unitTransport.correctDistances.every(r=>BigInt(4)*BigInt(r.numerator)>=BigInt(r.denominator))).toBe(true);expect(retained.unitTransport.wrongDistances.some(r=>BigInt(4)*BigInt(r.numerator)<BigInt(r.denominator))).toBe(true);
    expect(retained.crtReview.thirdBranchPrimitiveOnlyUnsafe).toBe(true);
  });
  it("separates incompatible restricted CRT from valid p-primary-free repair and exact gcd preservation",()=>{
    expect(retained.crtReview.restrictedNegative).toEqual({prime:3,level:3,baseUnit:2,solution:null});expect(retained.crtReview.status).toBe("LOCALIZED_EXPOSITION_REPAIR_NOT_THEOREM_REFUTATION");
    expect(retained.crtReview.generalizedControls.map(c=>[c.prime,c.level,c.coprimePart,c.scalingUnit,c.modulus])).toEqual([[3,3,1,2,9],[3,6,2,5,18],[5,4,4,13,20]]);
    let rows=0;for(const c of retained.crtReview.generalizedControls){expect(gcd(c.scalingUnit,c.modulus)).toBe(1);for(let x=0;x<c.modulus;x++){rows++;expect(gcd(c.level,(c.scalingUnit*x)%c.modulus)).toBe(gcd(c.level,x));}}expect(rows).toBe(47);
  });
});
const attacks:[string,(r:PrimeCriterionReport)=>void][]=[
  ["source revision",r=>{r.sources[0].revisionDate="2026-04-29";}],
  ["wrong source theorem",r=>{r.sourceLedger[0].theorem="1.4";}],
  ["lower range extended",r=>{r.sourceLedger[0].movingSpeedRange[1]=13;}],
  ["author statistics as local replay",r=>{(r.lowerReplaySource as unknown as {localReplay:boolean}).localReplay=true;}],
  ["circular LRC13 premise",r=>{r.applications[1].lowerThrough=12;}],
  ["source as established",r=>{(r.sourceLedger[0] as unknown as {status:string}).status="INDEPENDENTLY_REPRODUCED";}],
  ["partial base coverage",r=>{(r.criterionReview as unknown as {allBaseClassesRequired:boolean}).allBaseClassesRequired=false;}],
  ["primitive-only third branch",r=>{(r.criterionReview as unknown as {thirdBranchDomain:string}).thirdBranchDomain="PRIMITIVE_ONLY";}],
  ["missing phase control",r=>{r.shiftAudits.pop();}],
  ["forged control count",r=>{r.shiftCellCount--;}],
  ["missing phase cell",r=>{r.shiftAudits[0].cells--;}],
  ["forged phase stream",r=>{r.shiftAudits[0].streamSha256="a".repeat(64);}],
  ["equality becomes bad",r=>{r.boundaryControl.goodShifts=[];}],
  ["general nonunit as primitive",r=>{(r.generalizedNonunitControl as unknown as {primitiveApplication:boolean}).primitiveApplication=true;}],
  ["incomplete lift domain",r=>{(r.transferControls[0] as unknown as {rows:number}).rows=7;}],
  ["incorrect child grid time",r=>{r.transferControls[0].childGridNumerator=5;}],
  ["off-grid witness generalized to all lifts",r=>{(r.offGridControl as unknown as {sameOffGridTimeClaimedForLifts:boolean}).sameOffGridTimeClaimedForLifts=true;}],
  ["nonempty toy claimed closed",r=>{r.toyDomains[1].coverage="COMPLETE_TOY_DOMAIN_ONLY";r.toyDomains[1].improper=0;}],
  ["toy counts changed coherently",r=>{r.toyDomains[1].gridGood++;r.toyDomains[1].gcdOnly--;}],
  ["toy stream forged",r=>{r.toyDomains[0].streamSha256="a".repeat(64);}],
  ["repeated residues filtered",r=>{(r.toyDomains[0] as unknown as {preservesRepeatedCoordinates:boolean}).preservesRepeatedCoordinates=false;}],
  ["wrong inverse witness transport",r=>{(r.unitTransport as unknown as {correctNumerator:number}).correctNumerator=6;}],
  ["unit primitivity assumed",r=>{(r.unitTransport as unknown as {primitivePreserved:boolean}).primitivePreserved=true;}],
  ["restricted CRT forged",r=>{(r.crtReview.restrictedNegative as unknown as {solution:number|null}).solution=2;}],
  ["general CRT forged",r=>{r.crtReview.generalizedControls[0].scalingUnit=1;}],
  ["terminal theorem transferred automatically",r=>{r.terminalConditions.cases[1].eligibleConditionsOnly=true;}],
  ["divisibility promoted",r=>{(r.applications[0] as unknown as {divisibilityAccepted:boolean}).divisibilityAccepted=true;}],
  ["global theorem promoted",r=>{(r as unknown as {globalVerdict:string}).globalVerdict="PROVED";}],
  ["formal proof promoted",r=>{(r as unknown as {formalProof:boolean}).formalProof=true;}],
  ["new unsupported claim",r=>{Object.assign(r,{novelty:"PROVED"});}],
];
describe("consumer independently regenerates every phase and complete toy row",()=>{
  it.each(attacks)("rejects coherently rehashed %s",(_name,mutate)=>{const r=structuredClone(retained);mutate(r);expect(validateRetainedPrimeCriterionReport(rehash(r))).toBeNull();});
  it("rejects malformed/oversized/cyclic inputs and forged replay receipts",()=>{
    const cyclic:{self?:unknown}={};cyclic.self=cyclic;for(const r of [null,{},cyclic,{payload:"x".repeat(262145)}])expect(validateRetainedPrimeCriterionReport(r)).toBeNull();
    for(const mutate of [(r:PrimeCriterionReport)=>{r.generatedAt="invalid";},(r:PrimeCriterionReport)=>{r.receipt.elapsedMs=0;},(r:PrimeCriterionReport)=>{r.receipt.elapsedMs=5001;},(r:PrimeCriterionReport)=>{r.receipt.sourceSha256="b".repeat(64);},(r:PrimeCriterionReport)=>{r.receipt.stdoutBytes++;},(r:PrimeCriterionReport)=>{(r.receipt as unknown as {externalAttestation:boolean}).externalAttestation=true;}]){const r=structuredClone(retained);mutate(r);r.reportDigest=primeCriterionReportDigest(r);expect(validateRetainedPrimeCriterionReport(r)).toBeNull();}
  });
});
