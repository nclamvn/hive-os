import { canonicalJson,sha256 } from "@/modules/execution-fabric/contracts";

export const SHAPE_GEOMETRY_LIMITS=Object.freeze({bytes:262144,pythonBytes:30000,replayMs:5000,collectorMs:10000});
export const SHAPE_GEOMETRY_RETAINED_PATH="docs/research/lrc-allikvere-v2/retained-shape-geometry-audit.json";
export const SHAPE_GEOMETRY_PYTHON_SHA256="980b3a4fde31f2af71692f506e32ba4ceeec6324ea87662b19d8173d0cbf614a";
export const SHAPE_GEOMETRY_RETAINED_SHA256="b29cd15b4520e74943e12c194765155a1238857ae39c2ab473119e9309c808fd";
export const SHAPE_GEOMETRY_PREFIX_DEPENDENCY=Object.freeze({reportPath:"docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json",reportSha256:"e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6",receiptKind:"IMMUTABLE_RETAINED_REFERENCE_NOT_FRESH_053_REPLAY"});
export const SHAPE_GEOMETRY_SOURCE=Object.freeze({id:"arXiv:2609.02604v2",url:"https://arxiv.org/html/2609.02604v2",sections:["S3.SS1","S3.SS5","S3.SS6"]});
export type ShapeGeometryRational={numerator:string;denominator:string};
type Q={n:bigint;d:bigint};const z=BigInt(0),o=BigInt(1);
function gcd(a:bigint,b:bigint):bigint {while(b) [a,b]=[b,a%b];return a<z?-a:a;}
function q(n:bigint,d=o):Q {if(d===z) throw new Error("Zero denominator");if(d<z){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};}
function add(a:Q,b:Q):Q{return q(a.n*b.d+b.n*a.d,a.d*b.d);}
function sub(a:Q,b:Q):Q{return q(a.n*b.d-b.n*a.d,a.d*b.d);}
function mul(a:Q,b:Q):Q{return q(a.n*b.n,a.d*b.d);}
function div(a:Q,b:Q):Q{return q(a.n*b.d,a.d*b.n);}
function power(a:Q,n:number):Q{return q(a.n**BigInt(n),a.d**BigInt(n));}
function cmp(a:Q,b:Q):bigint{return a.n*b.d-b.n*a.d;}
function wire(a:Q):ShapeGeometryRational{return {numerator:a.n.toString(),denominator:a.d.toString()};}
function sum(values:Q[]):Q{return values.reduce(add,q(z));}
function prod(values:Q[]):Q{return values.reduce(mul,q(o));}
function readQ(raw:ShapeGeometryRational):Q {if(!raw||!/^-?\d{1,64}$/.test(raw.numerator)||!/^\d{1,64}$/.test(raw.denominator)) throw new Error("Invalid rational");const value=q(BigInt(raw.numerator),BigInt(raw.denominator));if(canonicalJson(wire(value))!==canonicalJson(raw)) throw new Error("Noncanonical rational");return value;}
function polyTrim(a:number[]):number[]{while(a.length>1&&a.at(-1)===0)a.pop();return a;}
function polyAdd(a:number[],b:number[],factor=1):number[]{return polyTrim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]??0)+factor*(b[i]??0)));}
function polyMul(a:number[],b:number[]):number[]{const r=Array(a.length+b.length-1).fill(0) as number[];a.forEach((v,i)=>b.forEach((w,j)=>{r[i+j]+=v*w;}));return polyTrim(r);}
function derivative(a:number[]):number[]{return a.slice(1).map((v,i)=>v*(i+1));}
function scale(a:number[],v:number):number[]{return a.map(c=>c*v);}
function evaluate(a:number[],x:Q):Q {return a.reduceRight((r,c)=>add(mul(r,x),q(BigInt(c))),q(z));}
function positive(a:Q):Q {if(a.n<=z)throw new Error("Strict positive comparison failed");return a;}
function det(matrix:Q[][]):Q {
  const a=matrix.map(row=>row.map(v=>({...v})));let result=q(o);
  for(let k=0;k<a.length;k++) {let pivot=k;while(pivot<a.length&&a[pivot][k].n===z)pivot++;if(pivot===a.length)return q(z);
    if(pivot!==k){[a[k],a[pivot]]=[a[pivot],a[k]];result=mul(result,q(-o));}
    const p=a[k][k];result=mul(result,p);
    for(let i=k+1;i<a.length;i++) {const ratio=div(a[i][k],p);for(let j=k;j<a.length;j++) a[i][j]=sub(a[i][j],mul(ratio,a[k][j]));}
  }return result;
}
export type ShapeGeometryControl={id:string;primitive:true;speeds:number[];detG:ShapeGeometryRational;expectedDetG:ShapeGeometryRational;detC:ShapeGeometryRational;expectedDetC:ShapeGeometryRational;covolumeSquared:ShapeGeometryRational};
/** Bounded exact matrix CONTROL, never a universal-speed proof or LRC witness. */
export function buildShapeGeometryControl(speeds:number[],id="CONTROL"):ShapeGeometryControl|null {
  try {
    const n=speeds.length;if(![13,14].includes(n)||speeds.some(v=>!Number.isSafeInteger(v)||v<1||v>128))return null;
    if(speeds.reduce((g,v)=>Number(gcd(BigInt(g),BigInt(v))),0)!==1)return null;
    const maximum=Math.max(...speeds),v=speeds.map(value=>q(BigInt(value))),u=v.map(value=>div(value,q(BigInt(maximum))));
    const qq=u.map(value=>evaluate([1,2,-1],value)),vn2=power(v[n-1],2);
    const G=Array.from({length:n-1},(_,i)=>Array.from({length:n-1},(_,j)=>add(q(BigInt(i===j?1:0)),div(mul(v[i],v[j]),vn2))));
    const C=Array.from({length:n-1},(_,i)=>Array.from({length:n-1},(_,j)=>add(i===j?qq[i]:q(z),div(mul(qq[n-1],mul(v[i],v[j])),vn2))));
    const gg=det(G),cc=det(C),norm2=sum(v.map(value=>power(value,2))),weighted=sum(v.map((value,i)=>div(power(value,2),qq[i]))),pq=prod(qq);
    const eg=div(norm2,vn2),ec=div(mul(pq,weighted),vn2);
    if(cmp(gg,eg)!==z||cmp(cc,ec)!==z)throw new Error("Geometry determinant mismatch");
    return {id,primitive:true,speeds:[...speeds],detG:wire(gg),expectedDetG:wire(eg),detC:wire(cc),expectedDetC:wire(ec),covolumeSquared:wire(div(q(o),mul(pq,weighted)))};
  }catch{return null;}
}
export function checkNormalizedSupportPair(a:ShapeGeometryRational,b:ShapeGeometryRational):boolean {
  try {const u=readQ(a),v=readQ(b);if(u.n<z||v.n<z||cmp(u,q(o))>z||cmp(v,q(o))>z)return false;
    const left=sub(sub(power(add(u,v),2),mul(evaluate([1,2,-1],u),power(v,2))),mul(evaluate([1,2,-1],v),power(u,2)));
    const right=mul(q(BigInt(2)),mul(mul(u,v),mul(sub(q(o),u),sub(q(o),v))));return cmp(left,right)===z&&right.n>=z;
  }catch{return false;}
}
export type ShapeGeometryTarget={movingSpeeds:number;totalRunners:number;shape:{status:"ACCEPTED_WITH_WRITTEN_UNIVERSAL_BRIDGE";D:number[];P:number[];cubic:number[];identities:{interiorDerivative:number[];fDerivativeNumerator:number[];factoredFDerivative:number[];k1DerivativeNumerator:number[];factoredK1Derivative:number[]};betaControls:{C:ShapeGeometryRational;coefficients:ShapeGeometryRational[];atOne:ShapeGeometryRational}[];alphaBracket:{lower:ShapeGeometryRational;upper:ShapeGeometryRational;lowerValue:ShapeGeometryRational;upperValue:ShapeGeometryRational};pPositiveMargin:ShapeGeometryRational;aBound:{lower:ShapeGeometryRational;poweredLeft:ShapeGeometryRational;poweredRight:ShapeGeometryRational;margin:ShapeGeometryRational;endpointValue:ShapeGeometryRational};kBranches:{k:number;lowerBound:ShapeGeometryRational;target:ShapeGeometryRational;margin:ShapeGeometryRational}[];criticalBracket:{lower:ShapeGeometryRational;upper:ShapeGeometryRational;lowerValue:ShapeGeometryRational;upperValue:ShapeGeometryRational};rootBelowAlpha:true;k1Comparison:{power:number;left:ShapeGeometryRational;right:ShapeGeometryRational;margin:ShapeGeometryRational};rBound:ShapeGeometryRational};geometryControls:ShapeGeometryControl[];flag:{status:"CONDITIONAL_ONLY";lowerPremise:"NOT_ESTABLISHED";kzPremise:"WRITTEN_BASIS_EXISTENCE";K:ShapeGeometryRational;squaredProductBound:ShapeGeometryRational;lowerLrcThrough:number}};
export type ShapeGeometryBody={version:1;status:"CHECKED_UNIVERSAL_SHAPE_GEOMETRY_SUBSTEPS";globalVerdict:"NOT_ESTABLISHED";formalProof:false;source:typeof SHAPE_GEOMETRY_SOURCE;dependency:typeof SHAPE_GEOMETRY_PREFIX_DEPENDENCY;shapeReview:{status:"REVIEWED_WRITTEN_UNIVERSAL_ARGUMENT";formalProof:false;minimizerCases:"ALL_K_1_THROUGH_N";gridSampling:false;rootClassificationCases:string[];existenceArgument:string;injectivityArgument:string};geometryReview:{status:"REVIEWED_WRITTEN_UNIVERSAL_ARGUMENT";formalProof:false;controlsAreUniversalProof:false;sectionVerticesComplete:string;supportIdentity:{exponents:number[];coefficient:number}[];covolumeArgument:string};targets:ShapeGeometryTarget[];negativeControls:{movingSpeeds:number;kind:"NONPRIMITIVE_SCALED_CONTROL";speeds:number[];gcd:2;primitiveApplication:"REJECTED";projectionUnchanged:true;wrongSourceScale:ShapeGeometryRational}[]};
export type ShapeGeometryReport=ShapeGeometryBody&{generatedAt:string;receipt:{method:"LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY";sourceSha256:string;stdoutSha256:string;stdoutBytes:number;elapsedMs:number;externalAttestation:false};reportDigest:string};
export function shapeGeometryRequest(){return {version:1,source:SHAPE_GEOMETRY_SOURCE,movingSpeeds:[13,14],dependency:SHAPE_GEOMETRY_PREFIX_DEPENDENCY};}
/** Fixed exact algebra only. Universal case coverage comes from the retained
 * written argument, not from the finite determinant controls. */
export function reconstructShapeGeometryBody():ShapeGeometryBody {
  const targets:ShapeGeometryTarget[]=[];
  for(const n of [13,14]) {
    const D=[1,-(n-2),n-1],P=[2,-(n-7),-2*(n-4),-(4*n-6),2*(n-1),n-1],cubic=[-1,n-5,2*n-5,(n-1)*(2*n-3)],qq=[1,2,-1],A=[1,2,2*n-3];
    // This recorded array is the coefficient of C in the scaled phi': -D,
    // NOT the whole derivative. The remaining term is +(n-1)u^2; thus
    // (n/2)u^(1+2/n)phi' = C*(-D)+(n-1)u^2 = -beta.
    const interiorDerivative=polyAdd(scale(polyMul([0,1],derivative(qq)),n/2),qq,-1);
    if(canonicalJson(interiorDerivative)!==canonicalJson(scale(D,-1)))throw new Error("Interior derivative identity");
    const N=polyMul(qq,D),V=[0,0,n,n],fDerivative=polyAdd(polyMul(derivative(N),V),polyMul(N,derivative(V)),-1),factoredF=scale([0,...P],-n);
    const k1Derivative=polyAdd(scale(polyMul([0,1],polyAdd(polyMul(derivative(A),qq),polyMul(A,derivative(qq)),n-2)),n),scale(polyMul(A,qq),-2*(n-1)));
    const factoredK1=scale(polyMul([1,-1],cubic),2*(n-1));
    if(canonicalJson(fDerivative)!==canonicalJson(factoredF)||canonicalJson(k1Derivative)!==canonicalJson(factoredK1))throw new Error("Polynomial derivative identity");
    const al=n===13?q(BigInt(102),BigInt(1000)):q(BigInt(92),BigInt(1000)),au=n===13?q(BigInt(103),BigInt(1000)):q(BigInt(93),BigInt(1000)),pu=n===13?au:q(BigInt(1),BigInt(10));
    const pMargin=positive(add(q(BigInt(2)),sum(P.map((v,i)=>v<0?mul(q(BigInt(v)),power(pu,i)):q(z)))));
    const dal=positive(evaluate(D,al)),dau=evaluate(D,au);if(dau.n>=z)throw new Error("D root bracket");
    const aLeft=div(power(evaluate(qq,al),n),power(au,2)),aRight=power(q(BigInt(8),BigInt(5)),n),aMargin=positive(sub(aLeft,aRight));
    const target=n===13?power(q(BigInt(2600),BigInt(101)),2):q(BigInt(784)),branches=[];
    for(let k=2;k<=n;k++){const bound=mul(mul(q(BigInt(k),BigInt(2)),q(BigInt(2)**BigInt(k))),power(q(BigInt(8),BigInt(5)),n-k));branches.push({k,lowerBound:wire(bound),target:wire(target),margin:wire(positive(sub(bound,target)))});}
    const cl=n===13?q(BigInt(849),BigInt(10000)):q(BigInt(782),BigInt(10000)),cu=n===13?q(BigInt(85),BigInt(1000)):q(BigInt(783),BigInt(10000));
    const cvl=evaluate(cubic,cl),cvu=positive(evaluate(cubic,cu));if(cvl.n>=z||cmp(cu,al)>=z)throw new Error("Critical root bracket");
    const exponent=n===13?13:7,denExponent=n===13?24:13,left=div(power(mul(evaluate(A,cl),power(evaluate(qq,cl),n-2)),exponent),power(cu,denExponent)),right=power(target,exponent),margin=positive(sub(left,right));
    const geometryControls=[buildShapeGeometryControl(Array(n).fill(1),`n${n}-ones`),buildShapeGeometryControl(Array.from({length:n},(_,i)=>i+1),`n${n}-sequential`)];if(geometryControls.some(v=>!v))throw new Error("Geometry control");
    const B=[q(z)];for(let r=1;r<n;r++)B.push(power(q(BigInt(2*r),BigInt((n+1)*(n+1-r))),2));const K=prod(B.slice(1).map((v,i)=>sub(v,B[i]))),rn=n===13?q(BigInt(101),BigInt(200)):q(o,BigInt(2));
    const betaControls=[q(o,BigInt(2)),q(o),q(BigInt(n-1),BigInt(2))].map(C=>{
      const beta=D.map((value,i)=>sub(mul(C,q(BigInt(value))),i===2?q(BigInt(n-1)):q(z)));
      const fullDerivative=interiorDerivative.map((value,i)=>add(mul(C,q(BigInt(value))),i===2?q(BigInt(n-1)):q(z)));
      if(beta.some((value,i)=>add(value,fullDerivative[i]).n!==z))throw new Error("Full beta derivative binding");
      return {C:wire(C),coefficients:beta.map(wire),atOne:wire(sub(mul(q(BigInt(2)),C),q(BigInt(n-1))))};
    });
    targets.push({movingSpeeds:n,totalRunners:n+1,shape:{status:"ACCEPTED_WITH_WRITTEN_UNIVERSAL_BRIDGE",D,P,cubic,identities:{interiorDerivative,fDerivativeNumerator:fDerivative,factoredFDerivative:factoredF,k1DerivativeNumerator:k1Derivative,factoredK1Derivative:factoredK1},betaControls,
      alphaBracket:{lower:wire(al),upper:wire(au),lowerValue:wire(dal),upperValue:wire(dau)},pPositiveMargin:wire(pMargin),aBound:{lower:wire(q(BigInt(8),BigInt(5))),poweredLeft:wire(aLeft),poweredRight:wire(aRight),margin:wire(aMargin),endpointValue:wire(q(BigInt(2)))},kBranches:branches,
      criticalBracket:{lower:wire(cl),upper:wire(cu),lowerValue:wire(cvl),upperValue:wire(cvu)},rootBelowAlpha:true,k1Comparison:{power:exponent,left:wire(left),right:wire(right),margin:wire(margin)},rBound:wire(rn)},geometryControls:geometryControls as ShapeGeometryControl[],flag:{status:"CONDITIONAL_ONLY",lowerPremise:"NOT_ESTABLISHED",kzPremise:"WRITTEN_BASIS_EXISTENCE",K:wire(K),squaredProductBound:wire(div(power(div(rn,q(BigInt(n))),2*n),power(K,n))),lowerLrcThrough:n-1}});
  }
  const negativeControls=targets.map(t=>({movingSpeeds:t.movingSpeeds,kind:"NONPRIMITIVE_SCALED_CONTROL" as const,speeds:Array.from({length:t.movingSpeeds},(_,i)=>2*(i+1)),gcd:2 as const,primitiveApplication:"REJECTED" as const,projectionUnchanged:true as const,wrongSourceScale:wire(q(o,BigInt(2)))}));
  for(const c of negativeControls)if(buildShapeGeometryControl(c.speeds)!==null)throw new Error("Nonprimitive application admitted");
  const supportTerms=new Map<string,number>();
  const term=(i:number,j:number,value:number)=>supportTerms.set(`${i},${j}`,(supportTerms.get(`${i},${j}`)??0)+value);
  term(2,0,1);term(1,1,2);term(0,2,1);
  [1,2,-1].forEach((value,i)=>{term(i,2,-value);term(2,i,-value);});
  const supportIdentity=[...supportTerms.entries()].filter(([,value])=>value!==0).map(([key,coefficient])=>({exponents:key.split(",").map(Number),coefficient})).sort((a,b)=>a.exponents[0]-b.exponents[0]||a.exponents[1]-b.exponents[1]);
  const factoredSupport=[{exponents:[1,1],coefficient:2},{exponents:[1,2],coefficient:-2},{exponents:[2,1],coefficient:-2},{exponents:[2,2],coefficient:2}];
  if(canonicalJson(supportIdentity)!==canonicalJson(factoredSupport))throw new Error("Bivariate support identity");
  return {version:1,status:"CHECKED_UNIVERSAL_SHAPE_GEOMETRY_SUBSTEPS",globalVerdict:"NOT_ESTABLISHED",formalProof:false,source:SHAPE_GEOMETRY_SOURCE,dependency:SHAPE_GEOMETRY_PREFIX_DEPENDENCY,
    shapeReview:{status:"REVIEWED_WRITTEN_UNIVERSAL_ARGUMENT",formalProof:false,minimizerCases:"ALL_K_1_THROUGH_N",gridSampling:false,rootClassificationCases:["0<C<1","C=1","1<C<(n-1)/2","C=(n-1)/2"],existenceArgument:"BOUNDARY_DIVERGENCE_A_GE_1_H_GE_A_I_OVER_2",injectivityArgument:"ALL_INTERIOR_COORDINATES_EQUAL_BY_F_STRICT_DECREASE"},
    geometryReview:{status:"REVIEWED_WRITTEN_UNIVERSAL_ARGUMENT",formalProof:false,controlsAreUniversalProof:false,sectionVerticesComplete:"HYPERPLANE_CROSSPOLYTOPE_SECTION_INTERSECTS_ALL_OPPOSITE_SIGN_EDGES",supportIdentity,covolumeArgument:"PRIMITIVE_PROJECTED_LATTICE_DUALITY_AND_SCHUR_COMPLEMENT"},targets,negativeControls};
}
export function shapeGeometryReplayBytes(body:ShapeGeometryBody):string{return `${canonicalJson(body)}\n`;}
export function shapeGeometryReportDigest(raw:Omit<ShapeGeometryReport,"reportDigest">|ShapeGeometryReport):string{const {reportDigest:_,...body}=raw as ShapeGeometryReport;void _;return sha256(canonicalJson(body));}
export function validateRetainedShapeGeometryReport(raw:unknown):ShapeGeometryReport|null {
  try {if(!raw||typeof raw!=="object"||Buffer.byteLength(JSON.stringify(raw))>SHAPE_GEOMETRY_LIMITS.bytes)return null;const r=raw as ShapeGeometryReport,{generatedAt,receipt,reportDigest,...body}=r;
    if(typeof generatedAt!=="string"||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(generatedAt)||!Number.isFinite(Date.parse(generatedAt))||!receipt)return null;
    if(Object.keys(receipt).sort().join(",")!=="elapsedMs,externalAttestation,method,sourceSha256,stdoutBytes,stdoutSha256"||receipt.method!=="LOCAL_UNSIGNED_FRESH_PYTHON_REPLAY"||receipt.sourceSha256!==SHAPE_GEOMETRY_PYTHON_SHA256||receipt.externalAttestation!==false||!Number.isSafeInteger(receipt.elapsedMs)||receipt.elapsedMs<1||receipt.elapsedMs>5000)return null;
    if(canonicalJson(body)!==canonicalJson(reconstructShapeGeometryBody()))return null;const output=shapeGeometryReplayBytes(body);
    return receipt.stdoutSha256===sha256(output)&&receipt.stdoutBytes===Buffer.byteLength(output)&&reportDigest===shapeGeometryReportDigest(r)?r:null;
  }catch{return null;}
}
