import { readFileSync } from "node:fs";
import { describe,expect,it } from "vitest";
import { sha256 } from "@/modules/execution-fabric/contracts";
import { SHAPE_GEOMETRY_RETAINED_PATH,SHAPE_GEOMETRY_RETAINED_SHA256,reconstructShapeGeometryBody,validateRetainedShapeGeometryReport,shapeGeometryReportDigest,shapeGeometryReplayBytes,buildShapeGeometryControl,checkNormalizedSupportPair,type ShapeGeometryReport } from "@/modules/research-sandbox/math-lrc-shape-geometry";
const bytes=readFileSync(SHAPE_GEOMETRY_RETAINED_PATH,"utf8"),retained=JSON.parse(bytes) as ShapeGeometryReport;
function rehash(r:ShapeGeometryReport){const {generatedAt:_,receipt:__,reportDigest:___,...body}=r;void _;void __;void ___;const out=shapeGeometryReplayBytes(body);r.receipt.stdoutSha256=sha256(out);r.receipt.stdoutBytes=Buffer.byteLength(out);r.reportDigest=shapeGeometryReportDigest(r);return r;}
describe("universal shape written bridge and exact algebra",()=>{
  it("admits pinned retained exact substeps while keeping universal reasoning written and flag conditional",()=>{
    expect(sha256(bytes)).toBe(SHAPE_GEOMETRY_RETAINED_SHA256);expect(validateRetainedShapeGeometryReport(retained)).toEqual(retained);
    expect(retained.globalVerdict).toBe("NOT_ESTABLISHED");expect(retained.formalProof).toBe(false);expect(retained.shapeReview.gridSampling).toBe(false);expect(retained.shapeReview.minimizerCases).toBe("ALL_K_1_THROUGH_N");
    expect(retained.shapeReview.rootClassificationCases).toEqual(["0<C<1","C=1","1<C<(n-1)/2","C=(n-1)/2"]);
    expect(retained.geometryReview.controlsAreUniversalProof).toBe(false);expect(retained.dependency.receiptKind).toBe("IMMUTABLE_RETAINED_REFERENCE_NOT_FRESH_053_REPLAY");
    expect(retained.targets.map(t=>[t.movingSpeeds,t.shape.kBranches.length,t.geometryControls.length,t.shape.k1Comparison.power,t.flag.lowerLrcThrough])).toEqual([[13,12,2,13,12],[14,13,2,7,13]]);
    for(const t of retained.targets)expect(t.flag).toMatchObject({status:"CONDITIONAL_ONLY",lowerPremise:"NOT_ESTABLISHED",kzPremise:"WRITTEN_BASIS_EXISTENCE"});
  });
  it("checks derivative polynomial coefficient identities, including both C boundary cases",()=>{
    for(const t of retained.targets){const s=t.shape,n=t.movingSpeeds;expect(s.identities.interiorDerivative).toEqual(s.D.map(c=>-c));expect(s.identities.fDerivativeNumerator).toEqual(s.identities.factoredFDerivative);expect(s.identities.k1DerivativeNumerator).toEqual(s.identities.factoredK1Derivative);
      expect(s.P).toEqual([2,-(n-7),-2*(n-4),-(4*n-6),2*(n-1),n-1]);expect(s.cubic).toEqual([-1,n-5,2*n-5,(n-1)*(2*n-3)]);
      expect(s.betaControls[1].C).toEqual({numerator:"1",denominator:"1"});expect(s.betaControls[1].coefficients[2]).toEqual({numerator:"0",denominator:"1"});expect(s.betaControls[2].atOne).toEqual({numerator:"0",denominator:"1"});
      for(const control of s.betaControls)for(let i=0;i<3;i++){
        const cn=BigInt(control.C.numerator),cd=BigInt(control.C.denominator),bn=BigInt(control.coefficients[i].numerator),bd=BigInt(control.coefficients[i].denominator);
        // Full scaled derivative is C*(-D)+(n-1)u², not just the stored C coefficient.
        const fullNumerator=cn*BigInt(s.identities.interiorDerivative[i])+(i===2?BigInt(n-1)*cd:BigInt(0));
        expect(fullNumerator*bd+bn*cd).toBe(BigInt(0));
      }
      expect(BigInt(s.pPositiveMargin.numerator)).toBeGreaterThan(BigInt(0));expect(s.cubic.slice(1).every(c=>c>0)).toBe(true);
    }
  });
  it("checks all25 k>=2 branches and strict rational root/power enclosures, never rounded equality",()=>{
    let count=0;for(const t of retained.targets){const s=t.shape;expect(s.kBranches.map(k=>k.k)).toEqual(Array.from({length:t.movingSpeeds-1},(_,i)=>i+2));
      for(const b of s.kBranches){count++;expect(BigInt(b.margin.numerator)).toBeGreaterThan(BigInt(0));}
      expect(BigInt(s.alphaBracket.lowerValue.numerator)).toBeGreaterThan(BigInt(0));expect(BigInt(s.alphaBracket.upperValue.numerator)).toBeLessThan(BigInt(0));expect(BigInt(s.criticalBracket.lowerValue.numerator)).toBeLessThan(BigInt(0));expect(BigInt(s.criticalBracket.upperValue.numerator)).toBeGreaterThan(BigInt(0));
      expect(BigInt(s.aBound.margin.numerator)).toBeGreaterThan(BigInt(0));expect(BigInt(s.k1Comparison.margin.numerator)).toBeGreaterThan(BigInt(0));expect(s.rootBelowAlpha).toBe(true);expect(s.aBound.endpointValue).toEqual({numerator:"2",denominator:"1"});
    }expect(count).toBe(25);expect(retained.targets.map(t=>t.shape.rBound)).toEqual([{numerator:"101",denominator:"200"},{numerator:"1",denominator:"2"}]);
  });
  it("checks exact matrix controls without mistaking them for all primitive speed tuples",()=>{
    const body=reconstructShapeGeometryBody();expect(body.targets.flatMap(t=>t.geometryControls)).toHaveLength(4);
    for(const t of body.targets)for(const c of t.geometryControls){expect(c.detG).toEqual(c.expectedDetG);expect(c.detC).toEqual(c.expectedDetC);expect(c.primitive).toBe(true);expect(BigInt(c.covolumeSquared.numerator)).toBeGreaterThan(BigInt(0));}
    for(const n of [13,14]){
      const sequential=Array.from({length:n},(_,i)=>i+1);expect(buildShapeGeometryControl(sequential)).not.toBeNull();expect(buildShapeGeometryControl(sequential.map(v=>2*v))).toBeNull();
      for(const bad of [0,-1,0.5,Infinity,129]){const v=[...sequential];v[0]=bad;expect(buildShapeGeometryControl(v)).toBeNull();}
    }expect(buildShapeGeometryControl([1,2,3])).toBeNull();expect(retained.negativeControls.every(c=>c.primitiveApplication==="REJECTED"&&c.gcd===2&&c.wrongSourceScale.numerator==="1"&&c.wrongSourceScale.denominator==="2")).toBe(true);
  });
  it("derives bivariate support coefficients and rejects invalid or unnormalized boxes",()=>{
    expect(retained.geometryReview.supportIdentity).toEqual([{exponents:[1,1],coefficient:2},{exponents:[1,2],coefficient:-2},{exponents:[2,1],coefficient:-2},{exponents:[2,2],coefficient:2}]);
    const zero={numerator:"0",denominator:"1"},one={numerator:"1",denominator:"1"},half={numerator:"1",denominator:"2"};
    for(const a of [zero,half,one])for(const b of [zero,half,one])expect(checkNormalizedSupportPair(a,b)).toBe(true);
    for(const a of [{numerator:"2",denominator:"1"},{numerator:"-1",denominator:"2"},{numerator:"2",denominator:"4"},{numerator:"1",denominator:"0"}])expect(checkNormalizedSupportPair(a,half)).toBe(false);
  });
});
const attacks:[string,(r:ShapeGeometryReport)=>void][]=[
  ["derivative coefficient",r=>{r.targets[0].shape.identities.fDerivativeNumerator[1]++;}],
  ["forged P",r=>{r.targets[0].shape.P[1]++;}],
  ["wrong cubic",r=>{r.targets[0].shape.cubic[3]++;}],
  ["wrong root endpoint",r=>{r.targets[0].shape.criticalBracket.lower.numerator="850";}],
  ["rounded root sign",r=>{r.targets[0].shape.criticalBracket.upperValue.numerator="0";}],
  ["false equality threshold",r=>{r.targets[0].shape.k1Comparison.margin.numerator="0";}],
  ["forged powered comparison",r=>{r.targets[0].shape.k1Comparison.left.numerator="1";}],
  ["missing k branch",r=>{r.targets[0].shape.kBranches.pop();}],
  ["duplicate k branch",r=>{r.targets[0].shape.kBranches[1]=structuredClone(r.targets[0].shape.kBranches[0]);}],
  ["forged determinant",r=>{r.targets[0].geometryControls[1].detC.numerator="1";}],
  ["nonprimitive matrix control",r=>{r.targets[0].geometryControls[1].speeds=r.targets[0].geometryControls[1].speeds.map(v=>2*v);}],
  ["nonpositive speed",r=>{r.targets[0].geometryControls[0].speeds[0]=0;}],
  ["support coefficient",r=>{r.geometryReview.supportIdentity[0].coefficient=3;}],
  ["wrong squared flag",r=>{r.targets[0].flag.squaredProductBound.numerator="1";}],
  ["promoted lower premise",r=>{(r.targets[0].flag as unknown as {lowerPremise:string}).lowerPremise="PROVED";}],
  ["wrong dependency digest",r=>{(r.dependency as unknown as {reportSha256:string}).reportSha256="a".repeat(64);}],
  ["source revision",r=>{(r.source as unknown as {id:string}).id="arXiv:2609.02604v1";}],
  ["formal proof promotion",r=>{(r as unknown as {formalProof:boolean}).formalProof=true;}],
  ["global proof promotion",r=>{(r as unknown as {globalVerdict:string}).globalVerdict="PROVED";}],
  ["controls as universal proof",r=>{(r.geometryReview as unknown as {controlsAreUniversalProof:boolean}).controlsAreUniversalProof=true;}],
  ["noncanonical fraction",r=>{r.targets[1].shape.rBound={numerator:"2",denominator:"4"};}],
  ["unknown claim",r=>{Object.assign(r,{novelty:"PROVED"});}],
];
describe("exact consumer rejects coherently rehashed shape/geometry faults",()=>{
  it.each(attacks)("rejects %s",(_name,mutate)=>{const r=structuredClone(retained);mutate(r);expect(validateRetainedShapeGeometryReport(rehash(r))).toBeNull();});
  it("rejects malformed/oversized/cyclic input and forged local receipts",()=>{
    const cyclic:{self?:unknown}={};cyclic.self=cyclic;for(const r of [null,{},cyclic,{payload:"x".repeat(262145)}])expect(validateRetainedShapeGeometryReport(r)).toBeNull();
    for(const mutate of [(r:ShapeGeometryReport)=>{r.generatedAt="invalid";},(r:ShapeGeometryReport)=>{r.receipt.elapsedMs=0;},(r:ShapeGeometryReport)=>{r.receipt.elapsedMs=5001;},(r:ShapeGeometryReport)=>{r.receipt.sourceSha256="b".repeat(64);},(r:ShapeGeometryReport)=>{r.receipt.stdoutBytes++;},(r:ShapeGeometryReport)=>{(r.receipt as unknown as {externalAttestation:boolean}).externalAttestation=true;}]){const r=structuredClone(retained);mutate(r);r.reportDigest=shapeGeometryReportDigest(r);expect(validateRetainedShapeGeometryReport(r)).toBeNull();}
  });
});
