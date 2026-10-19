import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";

export const PRIME_CRITERION_LIMITS=Object.freeze({bytes:262144,pythonBytes:30000,replayMs:5000,collectorMs:10000});
export const PRIME_CRITERION_RETAINED_PATH="docs/research/lrc-allikvere-v2/retained-prime-criterion-audit.json";
export const PRIME_CRITERION_PYTHON_SHA256="9718c95b226ccca0c49958b9fda2a7c028384851c34124a6654d9809d166307d";
export const PRIME_CRITERION_RETAINED_SHA256="3387eca4befe5d67845278c3120e65b098764a742af26f6e615b6da2512bf693";
export const PRIME_CRITERION_DEPENDENCIES=Object.freeze([
  {path:"docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json",sha256:"e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6"},
  {path:"docs/research/lrc-allikvere-v2/retained-shape-geometry-audit.json",sha256:"b29cd15b4520e74943e12c194765155a1238857ae39c2ab473119e9309c808fd"},
]);
export const PRIME_CRITERION_SOURCES=Object.freeze([
  {id:"arXiv:2604.23906v2",url:"https://arxiv.org/html/2604.23906v2",revisionDate:"2026-09-01"},
  {id:"arXiv:2609.02604v2",url:"https://arxiv.org/html/2609.02604v2",revisionDate:"2026-09-24"},
]);
export type PrimeCriterionRational={numerator:string;denominator:string};
type Q={n:bigint;d:bigint};const z=BigInt(0),o=BigInt(1);
function bgcd(a:bigint,b:bigint):bigint {while(b)[a,b]=[b,a%b];return a<z?-a:a;}
function q(n:bigint,d=o):Q {if(d<=z)throw new Error("Invalid denominator");const g=bgcd(n,d);return {n:n/g,d:d/g};}
function add(a:Q,b:Q):Q{return q(a.n*b.d+b.n*a.d,a.d*b.d);}
function cmp(a:Q,b:Q):bigint{return a.n*b.d-b.n*a.d;}
function mod1(a:Q):Q{return q((a.n%a.d+a.d)%a.d,a.d);}
function wire(a:Q):PrimeCriterionRational{return {numerator:a.n.toString(),denominator:a.d.toString()};}
function distance(a:Q):Q {const r=mod1(a);return r.n<=r.d-r.n?r:q(r.d-r.n,r.d);}
function gcd(a:number,b:number):number{while(b)[a,b]=[b,a%b];return Math.abs(a);}
function isPrime(p:number):boolean {for(let d=2;d*d<=p;d++)if(p%d===0)return false;return Number.isSafeInteger(p)&&p>=2;}
function triples(values:number[]):number[][]{const rows:number[][]=[];for(const a of values)for(const b of values)for(const c of values)rows.push([a,b,c]);return rows;}
function phaseGood(phase:Q,k:number,h:number):number[]{const good:number[]=[];for(let j=0;j<h;j++)if(cmp(distance(add(phase,q(BigInt(j),BigInt(h)))),q(o,BigInt(k+1)))>=z)good.push(j);return good;}
export type PrimeShiftAudit={movingSpeeds:number;effectiveOrbit:number;boundaries:number;cells:number;minimumGoodShifts:number;allHaveGoodShift:true;streamSha256:string};
function reconstructShiftAudit(k:number,h:number):PrimeShiftAudit {
  const points=new Map<string,Q>();
  for(let j=0;j<h;j++)for(const sign of [-1,1]){const p=mod1(q(BigInt(sign*h-(k+1)*j),BigInt((k+1)*h)));points.set(canonicalJson(wire(p)),p);}
  const sorted=[...points.values()].sort((a,b)=>cmp(a,b)<z?-1:cmp(a,b)>z?1:0),stream:string[]=[];let minimum=h;
  for(let i=0;i<sorted.length;i++){
    const left=sorted[i],right=i+1<sorted.length?sorted[i+1]:add(sorted[0],q(o));
    const midpoint=mod1(q(left.n*right.d+right.n*left.d,BigInt(2)*left.d*right.d));
    for(const [kind,phase] of [["BOUNDARY",left],["OPEN",midpoint]] as const){
      const good=phaseGood(phase,k,h);if(!good.length)throw new Error("Single-exception control failure");minimum=Math.min(minimum,good.length);
      stream.push(`${canonicalJson({kind,left:wire(left),right:wire(kind==="BOUNDARY"?left:right),phase:wire(phase),goodShiftIndices:good,firstGoodShift:good[0]})}\n`);
    }
  }
  return {movingSpeeds:k,effectiveOrbit:h,boundaries:sorted.length,cells:sorted.length*2,minimumGoodShifts:minimum,allHaveGoodShift:true,streamSha256:sha256(stream.join(""))};
}
function gridWitness(v:number[],M:number,k:number):number|null {for(let j=0;j<M;j++)if(v.every(x=>(k+1)*Math.min((j*x)%M,M-(j*x)%M)>=M))return j;return null;}
function omittedGcd(v:number[],level:number):{index:number;divisor:number}|null {for(let i=0;i<v.length;i++){const g=v.filter((_,j)=>j!==i).reduce(gcd,level);if(g>1)return {index:i,divisor:g};}return null;}
export type PrimeToyDomain={movingSpeeds:3;prime:number;level:4;modulus:number;bases:number;liftsPerBase:64;rows:number;gridGood:number;gcdOnly:number;improper:number;preservesRepeatedCoordinates:true;coverage:"COMPLETE_TOY_DOMAIN_ONLY"|"INCOMPLETE";streamSha256:string};
function reconstructToyDomain(p:number):PrimeToyDomain {
  const l=4,M=p*l,baseRows=triples(Array.from({length:p-1},(_,i)=>i+1)),digitRows=triples([0,1,2,3]),stream:string[]=[];let gridGood=0,gcdOnly=0,improper=0;
  for(const base of baseRows)for(const digits of digitRows){const residues=base.map((r,i)=>r+p*digits[i]),j=gridWitness(residues,M,3),g=omittedGcd(residues,l),classification=j!==null?"GRID_GOOD":g?"GCD_ONLY":"IMPROPER";
    if(classification==="GRID_GOOD")gridGood++;else if(classification==="GCD_ONLY")gcdOnly++;else improper++;
    stream.push(`${canonicalJson({base,digits,residues,firstGridWitness:j,omittedIndex:g?.index??null,gcdDivisor:g?.divisor??null,classification})}\n`);
  }
  if(gridGood+gcdOnly+improper!==baseRows.length*64)throw new Error("Toy domain completeness");
  return {movingSpeeds:3,prime:p,level:4,modulus:M,bases:baseRows.length,liftsPerBase:64,rows:stream.length,gridGood,gcdOnly,improper,preservesRepeatedCoordinates:true,coverage:improper===0?"COMPLETE_TOY_DOMAIN_ONLY":"INCOMPLETE",streamSha256:sha256(stream.join(""))};
}
export type PrimeTransferControl={kind:"GRID_WITNESS"|"GCD_MONOTONICITY";prime:5;parentLevel:2;childLevel:4;parentResidues:number[];rows:8;parentGridWitness:number|null;childGridNumerator:number|null;gcdDivisor:number|null;streamSha256:string};
function reconstructTransfers():PrimeTransferControl[]{
  return ([["GRID_WITNESS",[1,3,7]],["GCD_MONOTONICITY",[2,4,1]]] as const).map(([kind,parent])=>{
    const j=gridWitness([...parent],10,3),g=omittedGcd([...parent],2),stream:string[]=[];
    for(const digits of triples([0,1])){const residues=parent.map((v,i)=>v+10*digits[i]);
      if(kind==="GRID_WITNESS") {if(j!==5||!residues.every(v=>4*Math.min((10*v)%20,20-(10*v)%20)>=20))throw new Error("Grid lift transfer failure");}
      else if(j!==null||!g||g.divisor!==2||!omittedGcd(residues,4))throw new Error("Gcd lift monotonicity failure");
      stream.push(`${canonicalJson({digits,residues,childGridWitness:kind==="GRID_WITNESS"?10:null,childOmittedGcd:omittedGcd(residues,4)})}\n`);
    }
    return {kind,prime:5,parentLevel:2,childLevel:4,parentResidues:[...parent],rows:8,parentGridWitness:j,childGridNumerator:kind==="GRID_WITNESS"?10:null,gcdDivisor:g?.divisor??null,streamSha256:sha256(stream.join(""))};
  });
}
function inverseMod(a:number,M:number):number {for(let b=1;b<M;b++)if(a*b%M===1)return b;throw new Error("Not a unit");}
function crtRepair(p:number,l:number,a:number){let m=l,pPower=1;while(m%p===0){m/=p;pPower*=p;}const M=p*l,inv=inverseMod(a,p);let b=1;while(b<M&&(b%p!==inv||b%m!==1%m))b++;if(b===M||gcd(b,M)!==1)throw new Error("General unit repair failed");
  for(let x=0;x<M;x++)if(gcd(l,(b*x)%M)!==gcd(l,x))throw new Error("Unit gcd preservation control");
  return {prime:p,level:l,baseUnit:a,pPower,coprimePart:m,modulus:M,scalingUnit:b,isUnit:true as const};}
export type PrimeCriterionBody={version:1;status:"CHECKED_CONDITIONAL_PRIME_BRIDGE";globalVerdict:"NOT_ESTABLISHED";formalProof:false;sources:typeof PRIME_CRITERION_SOURCES;dependencies:typeof PRIME_CRITERION_DEPENDENCIES;
  sourceLedger:{sourceId:string;theorem:string;movingSpeedRange:number[];totalRunnerRange:number[];status:"SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED";sections:string[]}[];
  lowerReplaySource:{residualTuples:1092;primes:91;status:"AUTHOR_REPORTED_ONLY";snapshotLinksRetrieved:false;localReplay:false};
  terminalConditions:{sourceId:string;proposition:"4.4";requiresRunnerCountOddPrime:true;requiresPrimeAboveKTimesKPlusOne:true;cases:{movingSpeeds:number;totalRunners:number;testPrime:number;eligibleConditionsOnly:boolean;automaticAcceptance:false}[]};
  criterionReview:{status:"REVIEWED_WRITTEN_CONDITIONAL_ARGUMENT";formalProof:false;allBaseClassesRequired:true;fullLiftFiberRequired:true;thirdBranchDomain:"EVERY_POSITIVE_DISTINCT_INTEGER_LIFT_NOT_PRIMITIVE_ONLY";primitiveOmittedGcdImpliesUnit:true;generalizedEffectiveOrbit:string;openBadArcBoundaryGood:true;monotonicity:string;uniformLevel:string;genericThirdBranchSymmetry:"SEPARATE_PROOF_REQUIRED"};
  applications:{movingSpeeds:number;totalRunners:number;lowerThrough:number;lowerStatus:"SOURCE_LOCATED_NOT_REPRODUCED"|"PRIOR_FULL_LRC13_NOT_ESTABLISHED";primeCriterion:"CONDITIONAL_REVIEWED";authorCoverage:"NOT_ESTABLISHED";divisibilityAccepted:false}[];
  shiftAudits:PrimeShiftAudit[];shiftCellCount:number;negativeShiftControls:{movingSpeeds:number;effectiveOrbit:number;phase:PrimeCriterionRational;goodShifts:number[]}[];
  boundaryControl:{movingSpeeds:3;effectiveOrbit:2;phase:PrimeCriterionRational;goodShifts:number[];equalityGood:true};
  generalizedNonunitControl:{movingSpeeds:3;divisor:6;exceptionSpeed:2;effectiveOrbit:3;phases:PrimeCriterionRational[];firstGoodShift:number;primitiveApplication:false};
  transferControls:PrimeTransferControl[];offGridControl:{parentResidues:number[];parentGridWitness:null;initialTime:PrimeCriterionRational;initialDistances:PrimeCriterionRational[];selectedShift:number;finalTime:PrimeCriterionRational;finalDistances:PrimeCriterionRational[];sameOffGridTimeClaimedForLifts:false};
  toyDomains:PrimeToyDomain[];
  unitTransport:{modulus:28;scalingUnit:5;inverseUnit:17;originalResidues:number[];scaledResidues:number[];witnessNumerator:2;correctNumerator:10;wrongInverseNumerator:6;correctDistances:PrimeCriterionRational[];wrongDistances:PrimeCriterionRational[];correctGood:true;wrongGood:false;scaledIntegerGcd:5;primitivePreserved:false};
  crtReview:{status:"LOCALIZED_EXPOSITION_REPAIR_NOT_THEOREM_REFUTATION";restrictedNegative:{prime:3;level:3;baseUnit:2;solution:null};generalizedControls:ReturnType<typeof crtRepair>[];gcdPredicatesPreservedByUnit:true;thirdBranchPrimitiveOnlyUnsafe:true};
};
export type PrimeCriterionReport=PrimeCriterionBody&{generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string};
export function primeCriterionRequest(){return {version:1,sources:PRIME_CRITERION_SOURCES,dependencies:PRIME_CRITERION_DEPENDENCIES,shiftMovingSpeeds:[3,13,14],orbitRange:[2,32],toyPrimes:[3,5],toyLevel:4};}
/** Fixed bounded controls only. Written prime criterion requires complete
 * author target domains; neither the phase controls nor toys establish that. */
export function reconstructPrimeCriterionBody():PrimeCriterionBody {
  const shiftAudits:PrimeShiftAudit[]=[];for(const k of [3,13,14])for(let h=2;h<=32;h++)shiftAudits.push(reconstructShiftAudit(k,h));
  const shiftCellCount=shiftAudits.reduce((s,c)=>s+c.cells,0);if(shiftCellCount!==5550)throw new Error("Phase control completeness");
  const negativeShiftControls=[{movingSpeeds:2,effectiveOrbit:2,phase:wire(q(o,BigInt(4))),goodShifts:phaseGood(q(o,BigInt(4)),2,2)},
    {movingSpeeds:3,effectiveOrbit:1,phase:wire(q(z)),goodShifts:phaseGood(q(z),3,1)}];if(negativeShiftControls.some(c=>c.goodShifts.length))throw new Error("Negative shift control");
  const boundaryControl={movingSpeeds:3 as const,effectiveOrbit:2 as const,phase:wire(q(o,BigInt(4))),goodShifts:phaseGood(q(o,BigInt(4)),3,2),equalityGood:true as const};if(boundaryControl.goodShifts.length!==2)throw new Error("Boundary equality control");
  const phases=Array.from({length:6},(_,j)=>mod1(q(BigInt(2*j),BigInt(6)))),firstGoodShift=phases.findIndex(p=>cmp(distance(p),q(o,BigInt(4)))>=z);
  if(firstGoodShift!==1||6/gcd(6,2)!==3)throw new Error("General effective orbit control");
  const v=[2,4,1],initial=q(o,BigInt(6)),final=add(initial,q(o,BigInt(2))),initialDistances=v.map(x=>distance(q(BigInt(x)*initial.n,initial.d))),finalDistances=v.map(x=>distance(q(BigInt(x)*final.n,final.d)));
  if(gridWitness(v,10,3)!==null||finalDistances.some(p=>cmp(p,q(o,BigInt(3)))!==z))throw new Error("Gcd-only off-grid control");
  const toyDomains=[reconstructToyDomain(3),reconstructToyDomain(5)];if(canonicalJson(toyDomains.map(c=>[c.rows,c.gridGood,c.gcdOnly,c.improper]))!=="[[512,512,0,0],[4096,3472,432,192]]")throw new Error("Fixed toy domain counts");
  const original=[1,2,4],scaled=original.map(x=>5*x%28),correctDistances=original.map(x=>distance(q(BigInt(10*x),BigInt(28)))),wrongDistances=original.map(x=>distance(q(BigInt(6*x),BigInt(28))));
  if(inverseMod(5,28)!==17||gridWitness(scaled,28,3)===null||scaled.reduce(gcd,0)!==5||scaled.some(x=>4*Math.min((2*x)%28,28-(2*x)%28)<28)||correctDistances.some(x=>cmp(x,q(o,BigInt(4)))<z)||wrongDistances.every(x=>cmp(x,q(o,BigInt(4)))>=z))throw new Error("Unit witness direction control");
  if(Array.from({length:9},(_,i)=>i).some(b=>b%3===2&&b%3===1))throw new Error("Restricted CRT negative");
  return {version:1,status:"CHECKED_CONDITIONAL_PRIME_BRIDGE",globalVerdict:"NOT_ESTABLISHED",formalProof:false,sources:PRIME_CRITERION_SOURCES,dependencies:PRIME_CRITERION_DEPENDENCIES,
    sourceLedger:[{sourceId:"arXiv:2604.23906v2",theorem:"1.3",movingSpeedRange:[1,12],totalRunnerRange:[2,13],status:"SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED",sections:["S2","S4","S5","S6"]},{sourceId:"arXiv:2609.02604v2",theorem:"1.1",movingSpeedRange:[13,14],totalRunnerRange:[14,15],status:"SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED",sections:["S2","S5","S6"]}],
    lowerReplaySource:{residualTuples:1092,primes:91,status:"AUTHOR_REPORTED_ONLY",snapshotLinksRetrieved:false,localReplay:false},
    terminalConditions:{sourceId:"arXiv:2604.23906v2",proposition:"4.4",requiresRunnerCountOddPrime:true,requiresPrimeAboveKTimesKPlusOne:true,cases:[12,13,14].map(k=>({movingSpeeds:k,totalRunners:k+1,testPrime:199,eligibleConditionsOnly:isPrime(k+1)&&k+1!==2&&isPrime(199)&&199>k*(k+1),automaticAcceptance:false}))},
    criterionReview:{status:"REVIEWED_WRITTEN_CONDITIONAL_ARGUMENT",formalProof:false,allBaseClassesRequired:true,fullLiftFiberRequired:true,thirdBranchDomain:"EVERY_POSITIVE_DISTINCT_INTEGER_LIFT_NOT_PRIMITIVE_ONLY",primitiveOmittedGcdImpliesUnit:true,generalizedEffectiveOrbit:"g/gcd(g,exception)>=2",openBadArcBoundaryGood:true,monotonicity:"GRID_WITNESS_AND_LEVEL_GCD_PERSIST_AT_INTEGER_MULTIPLES",uniformLevel:"LCM_OF_FINITE_PER_BASE_TERMINAL_LEVELS",genericThirdBranchSymmetry:"SEPARATE_PROOF_REQUIRED"},
    applications:[{movingSpeeds:13,totalRunners:14,lowerThrough:12,lowerStatus:"SOURCE_LOCATED_NOT_REPRODUCED",primeCriterion:"CONDITIONAL_REVIEWED",authorCoverage:"NOT_ESTABLISHED",divisibilityAccepted:false},{movingSpeeds:14,totalRunners:15,lowerThrough:13,lowerStatus:"PRIOR_FULL_LRC13_NOT_ESTABLISHED",primeCriterion:"CONDITIONAL_REVIEWED",authorCoverage:"NOT_ESTABLISHED",divisibilityAccepted:false}],
    shiftAudits,shiftCellCount,negativeShiftControls,boundaryControl,generalizedNonunitControl:{movingSpeeds:3,divisor:6,exceptionSpeed:2,effectiveOrbit:3,phases:phases.map(wire),firstGoodShift,primitiveApplication:false},transferControls:reconstructTransfers(),
    offGridControl:{parentResidues:v,parentGridWitness:null,initialTime:wire(initial),initialDistances:initialDistances.map(wire),selectedShift:1,finalTime:wire(final),finalDistances:finalDistances.map(wire),sameOffGridTimeClaimedForLifts:false},toyDomains,
    unitTransport:{modulus:28,scalingUnit:5,inverseUnit:17,originalResidues:original,scaledResidues:scaled,witnessNumerator:2,correctNumerator:10,wrongInverseNumerator:6,correctDistances:correctDistances.map(wire),wrongDistances:wrongDistances.map(wire),correctGood:true,wrongGood:false,scaledIntegerGcd:5,primitivePreserved:false},
    crtReview:{status:"LOCALIZED_EXPOSITION_REPAIR_NOT_THEOREM_REFUTATION",restrictedNegative:{prime:3,level:3,baseUnit:2,solution:null},generalizedControls:[crtRepair(3,3,2),crtRepair(3,6,2),crtRepair(5,4,2)],gcdPredicatesPreservedByUnit:true,thirdBranchPrimitiveOnlyUnsafe:true},
  };
}
export function primeCriterionReplayBytes(body:PrimeCriterionBody):string{return `${canonicalJson(body)}\n`;}
export function primeCriterionReportDigest(raw:Omit<PrimeCriterionReport,"reportDigest">|PrimeCriterionReport):string{const {reportDigest:_,...body}=raw as PrimeCriterionReport;void _;return sha256(canonicalJson(body));}
export function validateRetainedPrimeCriterionReport(raw:unknown):PrimeCriterionReport|null {
  try {if(!raw||typeof raw!=="object"||Buffer.byteLength(JSON.stringify(raw))>PRIME_CRITERION_LIMITS.bytes)return null;const r=raw as PrimeCriterionReport,{generatedAt,receipt,reportDigest,...body}=r;
    if(typeof generatedAt!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(generatedAt)||!Number.isFinite(Date.parse(generatedAt))||!receipt)return null;
    if(Object.keys(receipt).sort().join(",")!=="elapsedMs,externalAttestation,method,sourceSha256,stdoutBytes,stdoutSha256"||receipt.method!=="LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY"||receipt.sourceSha256!==PRIME_CRITERION_PYTHON_SHA256||receipt.externalAttestation!==false||!Number.isSafeInteger(receipt.elapsedMs)||receipt.elapsedMs<1||receipt.elapsedMs>5000)return null;
    if(canonicalJson(body)!==canonicalJson(reconstructPrimeCriterionBody()))return null;const output=primeCriterionReplayBytes(body);
    return receipt.stdoutSha256===sha256(output)&&receipt.stdoutBytes===Buffer.byteLength(output)&&reportDigest===primeCriterionReportDigest(r)?r:null;
  }catch{return null;}
}
