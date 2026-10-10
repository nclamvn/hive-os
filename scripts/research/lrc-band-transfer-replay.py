"""TIP-072U unsigned offline analytic band transfer; no execution authority."""
from fractions import Fraction
from functools import reduce
from hashlib import sha256
from math import gcd, isfinite
import json
import os
import re
import sys
from time import monotonic

FLAGS = ("RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED")
MAX_MS, MAX_OPERATIONS, MAX_BYTES, MAX_SPEED = 5000, 2000000, 32768, 10**12
ETA = Fraction(1, 14)
BAND_COLUMNS = ["label", "floor", "left", "right", "lowerDistance"]
CANDIDATE_COLUMNS = ["label", "v", "normalizedV", "h", "q", "eligibleWidthType", "alpha0",
                     "arcCeil", "safeAlpha", "safeTime", "gap", "widthGate", "actualPhaseFits"]
MASK_COLUMNS = ["label", "q", "badIndices", "support", "parityCounts", "ternaryCounts"]
MATRIX_SCHEMA = {"rows":30,"columns":13,"rowTime":"baseTime+ell/(30*H)",
                 "distance":"nonnegative integer distanceNumerators[ell][label]/matrixDenominator",
                 "denominator":"lcm(den(baseTime),30*H); canonical positive decimal string",
                 "numerators":"NOT individually reduced; exact and <=denominator/2"}
SCOPE = {"localUnsigned":True,"executionAuthority":False,"agentLoop":"NOT_RUN",
         "retainedAgentResult":False,"global":"NOT_ESTABLISHED","formal":"NOT_ESTABLISHED",
         "novelty":"NOT_ESTABLISHED","external":"NOT_ESTABLISHED","nativeM1":"NOT_RUN",
         "wholeAllikvereBranch":"NOT_ESTABLISHED","writtenTheoremHasSpeedCap":False,
         "familyClosure":"ONLY_EXPLICIT_LOWER_INEQUALITIES_WITH_ANALYTIC_BASE",
         "noFitScope":"NO_COMPLETE_SUBSEQUENT_OMITTED_BAND_IN_THIS_PROTECTED_COMPONENT",
         "noPrimarySafeScope":"NO_Q2_Q3_PRIMARY_ORBIT_SAFE_BASE_IN_THIS_SELECTED_BAND; NOT_ABSENCE_OF_JOINT_WITNESS",
         "noWidthScope":"SUFFICIENT_GUARANTEES_FAILED_NOT_ABSENCE_OF_WITNESS"}


class Refused(ValueError):
    """Constant fail-closed reason; no positive evidence on refusal."""


class Work:
    def __init__(self, limits=None):
        if limits is None:limits={"maxMs":MAX_MS,"maxOperations":MAX_OPERATIONS}
        if type(limits) is not dict or len(limits)!=2 or any(type(k) is not str for k in limits) or set(limits)!={"maxMs","maxOperations"}:
            raise Refused("INPUT_REFUSED")
        if any(type(x) is not int for x in limits.values()) or not 1<=limits["maxMs"]<=MAX_MS or not 1<=limits["maxOperations"]<=MAX_OPERATIONS:
            raise Refused("INPUT_REFUSED")
        self.start=monotonic();self.deadline=self.start+limits["maxMs"]/1000
        self.limit=limits["maxOperations"];self.operations=0

    def charge(self, amount=1):
        self.operations+=amount
        if self.operations>self.limit or monotonic()>=self.deadline:raise Refused("RESOURCE_REFUSED")

    def q(self, x):
        self.charge()
        if type(x) not in (int,Fraction):raise Refused("INPUT_REFUSED")
        x=Fraction(x)
        if abs(x.numerator).bit_length()>256 or x.denominator.bit_length()>256:raise Refused("COMPONENT_REFUSED")
        return x


def wire(x):return [str(x.numerator),str(x.denominator)]
def floor(x):return x.numerator//x.denominator
def ceil(x):return -((-x.numerator)//x.denominator)
def norm(x, work):
    x=work.q(x%1)
    return work.q(min(x,1-x))


def parse_input(raw, work):
    keys={"label","speeds","tau","omittedLabel"}
    if type(raw) is not dict or len(raw)!=4 or any(type(k) is not str for k in raw) or set(raw)!=keys:raise Refused("INPUT_REFUSED")
    label,speeds,tau,omitted=(raw[k] for k in ("label","speeds","tau","omittedLabel"))
    if type(label) is not str or re.fullmatch(r"[A-Za-z0-9_-]{1,80}",label) is None:raise Refused("INPUT_REFUSED")
    if type(speeds) is not list or len(speeds)!=13 or any(type(v) is not int or not 1<=v<=MAX_SPEED for v in speeds):raise Refused("INPUT_REFUSED")
    if len(set(speeds))!=13 or type(omitted) is not int or not 0<=omitted<13:raise Refused("INPUT_REFUSED")
    if type(tau) is not list or len(tau)!=2 or any(type(x) is not str or len(x)>79 for x in tau):raise Refused("INPUT_REFUSED")
    if re.fullmatch(r"0|-?[1-9][0-9]*",tau[0]) is None or re.fullmatch(r"[1-9][0-9]*",tau[1]) is None:raise Refused("INPUT_REFUSED")
    num,den=int(tau[0]),int(tau[1]);work.charge(256**2)
    if abs(num).bit_length()>256 or den.bit_length()>256 or gcd(num,den)!=1:raise Refused("INPUT_REFUSED")
    lo=[i for i,v in enumerate(speeds) if v%5==0];ex=[i for i,v in enumerate(speeds) if v%5!=0]
    if len(lo)!=8 or len(ex)!=5 or omitted not in lo:raise Refused("PREMISE_REFUSED")
    return label,list(speeds),work.q(Fraction(num,den)),omitted,lo,ex


def matrix(speeds,H,base,work):
    base=work.q(base);period=30*H
    work.charge(max(base.denominator.bit_length(),period.bit_length())**2)
    D=base.denominator//gcd(base.denominator,period)*period
    if D.bit_length()>256:raise Refused("COMPONENT_REFUSED")
    rows=[]
    for ell in range(30):
        tnum=base.numerator*(D//base.denominator)+ell*(D//period);row=[]
        for v in speeds:
            residue=v*tnum%D;row.append(min(residue,D-residue));work.charge(4)
        rows.append(row)
    return {"baseTime":wire(base),"matrixDenominator":str(D),"distanceNumerators":rows,
            "goodIndices":[i for i,row in enumerate(rows) if all(14*n>=D for n in row)]}


def classify(grid,speeds,ex,H,work):
    D=int(grid["matrixDenominator"]);rows=[];masks=[];qs=[]
    for i in ex:
        v=speeds[i]//H;work.charge(40**2);q=6//gcd(v,6)
        mask=[ell for ell in range(30) if 14*grid["distanceNumerators"][ell][i]<D]
        parity=[[sum(ell%5==a and ell%2==b for ell in mask) for b in range(2)] for a in range(5)]
        ternary=[[sum(ell%5==a and ell%3==c for ell in mask) for c in range(3)] for a in range(5)]
        rows.append([i,q,mask,sorted({ell%5 for ell in mask}),parity,ternary]);masks.append(mask);qs.append(q)
    work.charge(5*30*26)
    multiplicity=[sum(ell in mask for mask in masks) for ell in range(30)]
    union=[ell for ell in range(30) if multiplicity[ell]]
    full=len(union)==30;saturated=all(len(mask)==6 for mask in masks);disjoint=all(n<=1 for n in multiplicity)
    counts=[qs.count(q) for q in (1,2,3,6)]
    rigid=saturated and disjoint and counts==[0,2,3,0]
    if full!=rigid or any(len(mask)>(5 if q==6 else 6) for q,mask in zip(qs,masks)):raise Refused("INVARIANT_REFUSED")
    return {"maskRows":rows,"badUnion":union,"badMultiplicity":multiplicity,
            "goodComplement":[ell for ell in range(30) if not multiplicity[ell]],
            "typeCountOrder":[1,2,3,6],"typeCounts":counts,"saturated":saturated,
            "pairwiseDisjoint":disjoint,"fullCoverage":full,"rigidShape":rigid}


def assess_candidate(i,v,H,g,left,right,W,work):
    work.charge(40**2);h=gcd(v,g);q=g//h;eligible=q in (2,3)
    rho=work.q(5*ETA);alpha=work.q(5*v*left)
    z=ceil(work.q(q*(alpha-(1-rho))))
    safealpha=work.q(max(alpha,rho+Fraction(z,q)));time=work.q(safealpha/(5*v))
    gap=work.q(Fraction(3,70*v) if q==2 else Fraction(1,105*v)) if eligible else None
    width=eligible and right-left>=gap
    if eligible and width!=(W<=(20 if q==2 else 90)*v):raise Refused("INVARIANT_REFUSED")
    if time<left or width and time>right:raise Refused("INVARIANT_REFUSED")
    return [i,v,v//H,h,q,eligible,wire(alpha),z,wire(safealpha),wire(time),wire(gap) if gap is not None else None,width,time<=right]


def final_witness(grid,speeds,H,work):
    if not grid["goodIndices"]:raise Refused("INVARIANT_REFUSED")
    ell=grid["goodIndices"][0];base=Fraction(*map(int,grid["baseTime"]));D=int(grid["matrixDenominator"])
    distances=[work.q(Fraction(n,D)) for n in grid["distanceNumerators"][ell]]
    if min(distances)<ETA:raise Refused("INVARIANT_REFUSED")
    return {"lowestPhysicalEll":ell,"time":wire(work.q(base+Fraction(ell,30*H))),
            "coordinateDistances":[wire(d) for d in distances],"minimumDistance":wire(min(distances))}


def _derive(raw,work):
    label,speeds,tau,omitted,lo,ex=parse_input(raw,work)
    work.charge(21*40**2);H=reduce(gcd,speeds);g=reduce(gcd,[speeds[i]//5 for i in lo])
    if g!=6*H or gcd(H,5)!=1:raise Refused("PREMISE_REFUSED")
    star=work.q(tau/5);bands=[]
    for i in lo:
        phase=work.q(speeds[i]*star);k=floor(phase);dist=norm(phase,work)
        if dist<ETA:raise Refused("LOWER_WITNESS_REFUSED")
        bands.append((i,k,work.q((k+ETA)/speeds[i]),work.q((k+1-ETA)/speeds[i]),dist))
    protect=[row for row in bands if row[0]!=omitted];W=speeds[omitted]
    A0=max(row[2] for row in bands);B0=min(row[3] for row in bands)
    cL=max(row[2] for row in protect);cR=min(row[3] for row in protect)
    a=work.q(max(cL,B0));K=ceil(work.q(W*a-ETA));Kmax=floor(work.q(W*cR-1+ETA))
    jL=work.q((K+ETA)/W);jR=work.q((K+1-ETA)/W);fit=K<=Kmax
    if not A0<=star<=B0 or fit!=(cL<=jL<=jR<=cR) or jR-jL!=Fraction(6,7*W):raise Refused("INVARIANT_REFUSED")
    rows=[assess_candidate(i,speeds[i],H,g,jL,jR,W,work) for i in ex]
    original=matrix(speeds,H,star,work);original["coverage"]=classify(original,speeds,ex,H,work)
    m=min(speeds[row[0]] for row in protect);M=max(speeds[row[0]] for row in protect)
    inequality=27*M<=13*W and W<=13*m;base_matches=star==Fraction(1,14*m)
    family=inequality and base_matches
    small=[i for i in ex if speeds[i]<m]
    largeq3=[row[0] for row in rows if row[4]==3 and row[1]>=m]
    forced=family and original["coverage"]["fullCoverage"]
    if family and (K!=1 or not fit or any(row[1]!=0 for row in bands)):raise Refused("INVARIANT_REFUSED")
    if forced and (len(small)>1 or len(largeq3)<2 or not all(rows[ex.index(i)][11] for i in largeq3)):raise Refused("INVARIANT_REFUSED")
    adjusted=final=chosen=base=delta=reference=None
    if original["goodIndices"]:
        status="CHECKED_ORIGINAL_ORBIT";base=star;delta=Fraction(0);reference="originalGrid";final=final_witness(original,speeds,H,work)
    elif not fit:status="UNKNOWN_NO_COMPLETE_BAND"
    else:
        options=[(Fraction(*map(int,row[9])),row[0]) for row in rows if row[5] and row[12]]
        if not options:status="UNKNOWN_NO_PRIMARY_SAFE_BASE"
        else:
            base,index=min(options);delta=work.q(base-star);chosen={"coordinateLabel":index,"safeTime":wire(base)}
            if not jL<=base<=jR or any(norm(work.q(speeds[i]*base),work)<ETA for i in lo):raise Refused("INVARIANT_REFUSED")
            adjusted=matrix(speeds,H,base,work);adjusted["coverage"]=classify(adjusted,speeds,ex,H,work)
            final=final_witness(adjusted,speeds,H,work);reference="adjustedGrid";status="CHECKED_ANALYTIC_BAND_TRANSFER"
    if family and final is None:raise Refused("INVARIANT_REFUSED")
    context={"normalization":{"movingCount":13,"totalCount":14,"eta":wire(ETA),"d":5,"speeds":speeds,
              "coordinateLabels":list(range(13)),"divisibleIndices":lo,"exceptionIndices":ex,"tau":wire(tau),"tStar":wire(star),"H":H,"g":g,"gPrime":6},
             "lowerGeometry":{"bandColumns":list(BAND_COLUMNS),"bandRows":[[i,k,wire(l),wire(r),wire(d)] for i,k,l,r,d in bands],
              "oldComponent":[wire(A0),wire(B0)],"protectedComponent":[wire(cL),wire(cR)],"protectedLabels":[r[0] for r in protect],
              "activeOldLeftLabel":min(r[0] for r in bands if r[2]==A0),"activeOldRightLabel":min(r[0] for r in bands if r[3]==B0),
              "activeProtectedLeftLabel":min(r[0] for r in protect if r[2]==cL),"activeProtectedRightLabel":min(r[0] for r in protect if r[3]==cR)},
             "transfer":{"omittedLabel":omitted,"W":W,"omittedFloor":next(r[1] for r in bands if r[0]==omitted),
              "a":wire(a),"K":K,"Kmax":Kmax,"J":[wire(jL),wire(jR)],"completeBandFits":fit,
              "candidateColumns":list(CANDIDATE_COLUMNS),"candidateRows":rows},
             "family":{"m":m,"M":M,"familyLowerInequalities":inequality,"familyBaseMatches":base_matches,
              "fullFamilyApplicable":family,"actualSmallExceptionLabels":small,"largeQ3Labels":largeq3,"forcedLargeQ3Applicable":forced},
             "selection":{"selector":"ORIGINAL_FIRST_ELSE_MIN_SAFE_TIME_ORIGINAL_LABEL_AMONG_Q2_Q3_PHASE_FITS; LOWEST_PHYSICAL_ELL",
              "chosenCandidate":chosen,"chosenBase":wire(base) if base is not None else None,"chosenDelta":wire(delta) if delta is not None else None,
              "finalMatrixRef":reference,"originalMatrixReused":reference=="originalGrid"},"maskColumns":list(MASK_COLUMNS)}
    return {"label":label,"status":status,"context":context,"originalGrid":original,"adjustedGrid":adjusted,
            "finalWitness":final,"matrixSchema":dict(MATRIX_SCHEMA),"scope":dict(SCOPE)}


def bounded_json(value,work):
    size=0
    def add(n):
        nonlocal size
        size+=n
        if size+1>MAX_BYTES:raise Refused("OUTPUT_REFUSED")
    def visit(item,depth=0):
        work.charge()
        if depth>12:raise Refused("OUTPUT_REFUSED")
        if type(item) is dict:
            if len(item)>40 or any(type(k) is not str for k in item):raise Refused("OUTPUT_REFUSED")
            add(2+max(0,len(item)-1)+len(item))
            for k,v in item.items():
                if len(k)>256:raise Refused("OUTPUT_REFUSED")
                add(len(json.dumps(k,ensure_ascii=True)));visit(v,depth+1)
        elif type(item) is list:
            if len(item)>60:raise Refused("OUTPUT_REFUSED")
            add(2+max(0,len(item)-1))
            for v in item:visit(v,depth+1)
        elif type(item) is float:
            if not isfinite(item) or abs(item)>MAX_MS:raise Refused("OUTPUT_REFUSED")
            add(len(json.dumps(item,allow_nan=False)))
        elif type(item) is str:
            if len(item)>256:raise Refused("OUTPUT_REFUSED")
            add(len(json.dumps(item,ensure_ascii=True)))
        elif type(item) is bool:add(4 if item else 5)
        elif type(item) is int:
            if abs(item).bit_length()>256:raise Refused("OUTPUT_REFUSED")
            add(len(str(item)))
        elif item is None:add(4)
        else:raise Refused("OUTPUT_REFUSED")
    visit(value);work.charge(size)
    encoded=json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False)
    if len(encoded.encode("ascii"))!=size:raise Refused("OUTPUT_REFUSED")
    return encoded


def derive_certificate(raw,limits=None):
    work=Work(limits);result=_derive(raw,work);bounded_json(result,work);return result


def fixed_inputs():
    p=[7170+30*i for i in range(7)];E=[4989,54999,86656,19996,53326]
    return [{"label":label,"speeds":p+[W]+E,"tau":["5","100003"],"omittedLabel":7}
            for label,W in (("analytic_transfer",92850),("no_complete_band",7380),("phase_aware_transfer",9285000))]


def _build_fixed_payload(limits=None):
    work=Work(limits);cases=[_derive(raw,work) for raw in fixed_inputs()]
    grids=[c[key] for c in cases for key in ("originalGrid","adjustedGrid") if c[key] is not None]
    counts={"cases":len(cases),"accepted":sum(c["finalWitness"] is not None for c in cases),
            "originalMatrices":sum(c["originalGrid"] is not None for c in cases),"adjustedMatrices":sum(c["adjustedGrid"] is not None for c in cases),
            "matrixCoordinates":sum(sum(map(len,g["distanceNumerators"])) for g in grids),
            "lowerDistances":sum(len(c["context"]["lowerGeometry"]["bandRows"]) for c in cases),
            "candidateRows":sum(len(c["context"]["transfer"]["candidateRows"]) for c in cases),
            "finalDistances":sum(len(c["finalWitness"]["coordinateDistances"]) for c in cases if c["finalWitness"] is not None)}
    work.charge(1950+24+15+26)
    if counts!={"cases":3,"accepted":2,"originalMatrices":3,"adjustedMatrices":2,"matrixCoordinates":1950,"lowerDistances":24,"candidateRows":15,"finalDistances":26}:raise Refused("INVARIANT_REFUSED")
    for c in cases:
        for key in ("matrixSchema","scope"):
            del c[key];c[key+"Ref"]="body."+key
        for group,key in (("lowerGeometry","bandColumns"),("transfer","candidateColumns")):
            del c["context"][group][key];c["context"][group][key+"Ref"]="body."+key
        del c["context"]["maskColumns"];c["context"]["maskColumnsRef"]="body.maskColumns"
    body={"version":"LRC_ANALYTIC_BAND_TRANSFER_V1","cases":cases,"matrixSchema":dict(MATRIX_SCHEMA),"scope":dict(SCOPE),
          "bandColumns":list(BAND_COLUMNS),"candidateColumns":list(CANDIDATE_COLUMNS),"maskColumns":list(MASK_COLUMNS),"counts":counts}
    canonical=bounded_json(body,work)
    report={**body,"semanticDigest":sha256(canonical.encode("ascii")).hexdigest(),"metrics":{}}
    bounded_json(report,work);work.charge(MAX_BYTES+4096)
    report["metrics"]={"chargedOperations":work.operations,"elapsedMs":round((monotonic()-work.start)*1000,6)}
    encoded=json.dumps(report,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False)
    if len(encoded.encode("ascii"))+1>MAX_BYTES or monotonic()>=work.deadline:raise Refused("RESOURCE_REFUSED")
    return report,encoded,work.deadline


def build_fixed_report(limits=None):return _build_fixed_payload(limits)[0]


def main():
    if len(sys.argv)!=1 or any(os.environ.get(f)!="false" for f in FLAGS):raise Refused("CLI_REFUSED")
    _,encoded,deadline=_build_fixed_payload()
    if monotonic()>=deadline:raise Refused("RESOURCE_REFUSED")
    sys.stdout.write(encoded+"\n")


if __name__=="__main__":
    try:main()
    except Refused as error:
        sys.stderr.write(str(error)+"\n");sys.exit(1)
