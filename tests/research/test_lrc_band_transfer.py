"""TIP-072U independent exact closed-interval oracle and pinned-child controls."""
from fractions import Fraction as F
from functools import reduce
from hashlib import sha256
from itertools import combinations, permutations
from math import gcd
from pathlib import Path
from unittest.mock import patch
import ast
import importlib.util
import json
import subprocess
import sys
import unittest

ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/"scripts/research/lrc-band-transfer-replay.py"
SOURCE_SHA256="8b8d1d2e5c34290e5b43d0777908014edcd1300ba6280be8c7f40d21a3c03c8b"
spec=importlib.util.spec_from_file_location("tip072u_product",SOURCE)
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
FLAGS=("RESEARCH_WORKER_ENABLED","MATH_PILOT_QUEUE_ENABLED","LRC_CAMPAIGN_LOCAL_ENABLED",
       "RESEARCH_OPENAI_ENABLED","RESEARCH_CODEX_LOCAL_ENABLED","SANDBOX_DOCKER_ENABLED")
ETA=F(1,14);E=[4989,54999,86656,19996,53326]
COLUMNS=["label","v","normalizedV","h","q","eligibleWidthType","alpha0","arcCeil","safeAlpha","safeTime","gap","widthGate","actualPhaseFits"]
BANDS=["label","floor","left","right","lowerDistance"]
MASKS=["label","q","badIndices","support","parityCounts","ternaryCounts"]
SCHEMA={"rows":30,"columns":13,"rowTime":"baseTime+ell/(30*H)",
        "distance":"nonnegative integer distanceNumerators[ell][label]/matrixDenominator",
        "denominator":"lcm(den(baseTime),30*H); canonical positive decimal string",
        "numerators":"NOT individually reduced; exact and <=denominator/2"}
SCOPE={"localUnsigned":True,"executionAuthority":False,"agentLoop":"NOT_RUN","retainedAgentResult":False,
       "global":"NOT_ESTABLISHED","formal":"NOT_ESTABLISHED","novelty":"NOT_ESTABLISHED","external":"NOT_ESTABLISHED",
       "nativeM1":"NOT_RUN","wholeAllikvereBranch":"NOT_ESTABLISHED","writtenTheoremHasSpeedCap":False,
       "familyClosure":"ONLY_EXPLICIT_LOWER_INEQUALITIES_WITH_ANALYTIC_BASE",
       "noFitScope":"NO_COMPLETE_SUBSEQUENT_OMITTED_BAND_IN_THIS_PROTECTED_COMPONENT",
       "noPrimarySafeScope":"NO_Q2_Q3_PRIMARY_ORBIT_SAFE_BASE_IN_THIS_SELECTED_BAND; NOT_ABSENCE_OF_JOINT_WITNESS",
       "noWidthScope":"SUFFICIENT_GUARANTEES_FAILED_NOT_ABSENCE_OF_WITNESS"}


def wire(x):return [str(x.numerator),str(x.denominator)]
def floor(x):return x.numerator//x.denominator
def norm(x):return min(x-floor(x),floor(x)+1-x)
def canonical(x):return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False).encode("ascii")
def fixture(i=0):
    return {"label":["analytic_transfer","no_complete_band","phase_aware_transfer"][i],
            "speeds":list(range(7170,7351,30))+[[92850,7380,9285000][i]]+E,"tau":["5","100003"],"omittedLabel":7}


def expected_matrix(speeds,H,base):
    D=base.denominator*(30*H)//gcd(base.denominator,30*H)
    fractions=[[norm(v*(base+F(ell,30*H))) for v in speeds] for ell in range(30)]
    return {"baseTime":wire(base),"matrixDenominator":str(D),"distanceNumerators":[[int(d*D) for d in row] for row in fractions],
            "goodIndices":[ell for ell,row in enumerate(fractions) if min(row)>=ETA]}


def expected_shape(grid,speeds,ex,H):
    D=int(grid["matrixDenominator"]);masks=[[ell for ell in range(30) if F(grid["distanceNumerators"][ell][i],D)<ETA] for i in ex]
    qs=[6//gcd(speeds[i]//H,6) for i in ex];rows=[]
    for i,q,mask in zip(ex,qs,masks):
        rows.append([i,q,mask,sorted({e%5 for e in mask}),
                     [[sum(e%5==a and e%2==b for e in mask) for b in range(2)] for a in range(5)],
                     [[sum(e%5==a and e%3==c for e in mask) for c in range(3)] for a in range(5)]])
    mult=[sum(e in mask for mask in masks) for e in range(30)];counts=[qs.count(q) for q in (1,2,3,6)]
    saturated=all(len(mask)==6 for mask in masks);disjoint=max(mult)<=1
    rigid=False
    if saturated and counts==[0,2,3,0]:
        two=[r for r in rows if r[1]==2];three=[r for r in rows if r[1]==3]
        A=set(two[0][3]);B=set(three[0][3]);rigid=A.isdisjoint(B) and A|B==set(range(5))
        rigid=rigid and all(set(r[3])==A for r in two) and all(set(r[3])==B for r in three)
        if rigid:rigid=all(sum(bool(r[4][a][b]) for r in two)==1 for a in A for b in range(2)) and all(sum(bool(r[5][a][b]) for r in three)==1 for a in B for b in range(3))
    return {"maskRows":rows,"badUnion":[e for e in range(30) if mult[e]],"badMultiplicity":mult,"goodComplement":[e for e in range(30) if not mult[e]],
            "typeCountOrder":[1,2,3,6],"typeCounts":counts,"saturated":saturated,"pairwiseDisjoint":disjoint,"fullCoverage":all(mult),"rigidShape":rigid}


def expected_candidate(i,v,H,g,jL,jR,W):
    h=gcd(v,g);q=g//h;alpha=5*v*jL;rho=5*ETA
    # Independent bounded local arc enumeration, not the product's ceil selector.
    center=floor(q*alpha)
    arcs=[(rho+F(k,q),1-rho+F(k,q),k) for k in range(center-8,center+9)]
    active=[(max(alpha,a),k) for a,b,k in arcs if b>=alpha]
    safe,z=min(active,key=lambda x:(x[0],x[1]));time=safe/(5*v)
    # For overlapping q6 arcs tie by smallest right-end interval index.
    z=min(k for a,b,k in arcs if b>=alpha)
    gap=F(3,70*v) if q==2 else F(1,105*v) if q==3 else None
    return [i,v,v//H,h,q,q in (2,3),wire(alpha),z,wire(safe),wire(time),wire(gap) if gap else None,
            q in (2,3) and jR-jL>=gap,time<=jR]


def expected_final(grid,H):
    ell=min(grid["goodIndices"]);base=F(*map(int,grid["baseTime"]));D=int(grid["matrixDenominator"])
    distances=[F(n,D) for n in grid["distanceNumerators"][ell]]
    return {"lowestPhysicalEll":ell,"time":wire(base+F(ell,30*H)),"coordinateDistances":[wire(x) for x in distances],"minimumDistance":wire(min(distances))}


def expected(raw):
    speeds=raw["speeds"];tau=F(*map(int,raw["tau"]));star=tau/5;omitted=raw["omittedLabel"]
    H=reduce(gcd,speeds);lo=[i for i,v in enumerate(speeds) if not v%5];ex=[i for i,v in enumerate(speeds) if v%5];g=reduce(gcd,[speeds[i]//5 for i in lo])
    bands=[(i,floor(speeds[i]*star),(floor(speeds[i]*star)+ETA)/speeds[i],(floor(speeds[i]*star)+1-ETA)/speeds[i],norm(speeds[i]*star)) for i in lo]
    protect=[row for row in bands if row[0]!=omitted];W=speeds[omitted]
    A0=max(r[2] for r in bands);B0=min(r[3] for r in bands);cL=max(r[2] for r in protect);cR=min(r[3] for r in protect)
    a=max(cL,B0);x=W*a-ETA;K=floor(x)+(x!=floor(x));Kmax=floor(W*cR-1+ETA)
    jL=(K+ETA)/W;jR=(K+1-ETA)/W;fit=K<=Kmax
    rows=[expected_candidate(i,speeds[i],H,g,jL,jR,W) for i in ex]
    original=expected_matrix(speeds,H,star);original["coverage"]=expected_shape(original,speeds,ex,H)
    m=min(speeds[r[0]] for r in protect);M=max(speeds[r[0]] for r in protect);inequality=27*M<=13*W and W<=13*m;matches=star==F(1,14*m)
    adjusted=final=chosen=base=delta=reference=None
    if original["goodIndices"]:
        status="CHECKED_ORIGINAL_ORBIT";base=star;delta=F(0);reference="originalGrid";final=expected_final(original,H)
    elif not fit:status="UNKNOWN_NO_COMPLETE_BAND"
    else:
        options=[(F(*map(int,r[9])),r[0]) for r in rows if r[5] and r[12]]
        if not options:status="UNKNOWN_NO_PRIMARY_SAFE_BASE"
        else:
            base,index=min(options);delta=base-star;chosen={"coordinateLabel":index,"safeTime":wire(base)}
            adjusted=expected_matrix(speeds,H,base);adjusted["coverage"]=expected_shape(adjusted,speeds,ex,H);final=expected_final(adjusted,H)
            reference="adjustedGrid";status="CHECKED_ANALYTIC_BAND_TRANSFER"
    ctx={"normalization":{"movingCount":13,"totalCount":14,"eta":wire(ETA),"d":5,"speeds":speeds,"coordinateLabels":list(range(13)),
         "divisibleIndices":lo,"exceptionIndices":ex,"tau":wire(tau),"tStar":wire(star),"H":H,"g":g,"gPrime":6},
         "lowerGeometry":{"bandColumns":BANDS,"bandRows":[[i,k,wire(l),wire(r),wire(d)] for i,k,l,r,d in bands],
         "oldComponent":[wire(A0),wire(B0)],"protectedComponent":[wire(cL),wire(cR)],"protectedLabels":[r[0] for r in protect],
         "activeOldLeftLabel":min(r[0] for r in bands if r[2]==A0),"activeOldRightLabel":min(r[0] for r in bands if r[3]==B0),
         "activeProtectedLeftLabel":min(r[0] for r in protect if r[2]==cL),"activeProtectedRightLabel":min(r[0] for r in protect if r[3]==cR)},
         "transfer":{"omittedLabel":omitted,"W":W,"omittedFloor":next(r[1] for r in bands if r[0]==omitted),"a":wire(a),"K":K,"Kmax":Kmax,
         "J":[wire(jL),wire(jR)],"completeBandFits":fit,"candidateColumns":COLUMNS,"candidateRows":rows},
         "family":{"m":m,"M":M,"familyLowerInequalities":inequality,"familyBaseMatches":matches,"fullFamilyApplicable":inequality and matches,
         "actualSmallExceptionLabels":[i for i in ex if speeds[i]<m],"largeQ3Labels":[r[0] for r in rows if r[4]==3 and r[1]>=m],
         "forcedLargeQ3Applicable":inequality and matches and original["coverage"]["fullCoverage"]},
         "selection":{"selector":"ORIGINAL_FIRST_ELSE_MIN_SAFE_TIME_ORIGINAL_LABEL_AMONG_Q2_Q3_PHASE_FITS; LOWEST_PHYSICAL_ELL",
         "chosenCandidate":chosen,"chosenBase":wire(base) if base is not None else None,"chosenDelta":wire(delta) if delta is not None else None,
         "finalMatrixRef":reference,"originalMatrixReused":reference=="originalGrid"},"maskColumns":MASKS}
    return {"label":raw["label"],"status":status,"context":ctx,"originalGrid":original,"adjustedGrid":adjusted,"finalWitness":final,"matrixSchema":SCHEMA,"scope":SCOPE}


def expected_body():
    cases=[expected(fixture(i)) for i in range(3)]
    for c in cases:
        for key in ("matrixSchema","scope"):del c[key];c[key+"Ref"]="body."+key
        for group,key in (("lowerGeometry","bandColumns"),("transfer","candidateColumns")):
            del c["context"][group][key];c["context"][group][key+"Ref"]="body."+key
        del c["context"]["maskColumns"];c["context"]["maskColumnsRef"]="body.maskColumns"
    return {"version":"LRC_ANALYTIC_BAND_TRANSFER_V1","cases":cases,"matrixSchema":SCHEMA,"scope":SCOPE,
            "bandColumns":BANDS,"candidateColumns":COLUMNS,"maskColumns":MASKS,"counts":{"cases":3,"accepted":2,"originalMatrices":3,
            "adjustedMatrices":2,"matrixCoordinates":1950,"lowerDistances":24,"candidateRows":15,"finalDistances":26}}


def launch(args=(),env=None,stdin=""):
    data=SOURCE.read_bytes()
    if sha256(data).hexdigest()!=SOURCE_SHA256:raise AssertionError("Source changed before launch")
    code="exec(compile("+repr(data)+", "+repr(str(SOURCE))+", 'exec'), {'__name__':'__main__'})"
    result=subprocess.run([sys.executable,"-I","-S","-B","-c",code,*args],input=stdin,capture_output=True,text=True,timeout=5,
                          env={f:"false" for f in FLAGS} if env is None else env,shell=False)
    if SOURCE.read_bytes()!=data:raise AssertionError("Source changed after launch")
    return result


def critical_realizations(a):
    q2=[];q3=[]
    for A in combinations(range(5),2):
        for parity in (0,1):q2.append([ell for ell in range(30) if ell%5 in A and ell%2==(parity if ell%5==A[0] else 1-parity)])
    for B in combinations(range(5),3):
        for perm in permutations(range(3)):q3.append([ell for ell in range(30) if ell%5 in B and ell%3==perm[B.index(ell%5)]])
    q2.sort();q3.sort();covers=[]
    for A in combinations(range(5),2):
        two=[m for m in q2 if {e%5 for e in m}==set(A)];B=sorted(set(range(5))-set(A))
        for parity in (0,1):
            three=[]
            for mask in q3:
                if {e%5 for e in mask}!=set(B):continue
                perm=[next(e%3 for e in mask if e%5==b) for b in B]
                if sum(perm[i]>perm[j] for i,j in combinations(range(3),2))%2==parity:three.append(mask)
            covers.append(two+three)
    mapping={};period=420*a;N=14*a
    for q,modulus in ((2,10),(3,15)):
        for coefficient in range(1,modulus):
            if gcd(coefficient,modulus)!=1:continue
            inv=pow(coefficient,-1,modulus)
            for b in range(modulus):
                mask=tuple(e for e in range(30) if e%modulus in {(inv*(b+j))%modulus for j in range(q)})
                target=(-F(2*b+q-1,2*modulus))%1;residue=(6//q)*coefficient
                x=N*(target-F(residue,period));k=min((floor(x),floor(x)+1),key=lambda n:(abs(x-n),n))%N
                mapping[(q,mask)]=residue+30*k
    for index,masks in enumerate(covers):
        ex=[mapping[(2 if j<2 else 3,tuple(mask))]+period*j for j,mask in enumerate(masks)]
        yield masks,{"label":"family_cover_"+str(index),"speeds":[30*(a+j) for j in range(7)]+[360*a]+ex,
                     "tau":wire(F(1,84*a)),"omittedLabel":7}


class ExactTests(unittest.TestCase):
    def test_full_context_1950_matrix_24_lower_15_candidate_26_final(self):
        for i in range(3):self.assertEqual(p.derive_certificate(fixture(i)),expected(fixture(i)))

    def test_fixed_whole_body_refs_digest(self):
        self.assertEqual(p.fixed_inputs(),[fixture(i) for i in range(3)])
        r=p.build_fixed_report();body={k:v for k,v in r.items() if k not in ("metrics","semanticDigest")}
        self.assertEqual(body,expected_body());self.assertEqual(r["semanticDigest"],sha256(canonical(body)).hexdigest())

    def test_old_full_cover_rigidity_all_three(self):
        for i in range(3):
            shape=p.derive_certificate(fixture(i))["originalGrid"]["coverage"]
            self.assertEqual(shape["badMultiplicity"],[1]*30);self.assertEqual(shape["typeCounts"],[0,2,3,0]);self.assertTrue(shape["rigidShape"])

    def test_width_guaranteed_transfer_closed_endpoint(self):
        c=p.derive_certificate(fixture());self.assertTrue(all(r[11] for r in c["context"]["transfer"]["candidateRows"]))
        self.assertEqual(c["context"]["selection"]["chosenCandidate"]["coordinateLabel"],11)
        self.assertEqual(c["adjustedGrid"]["goodIndices"],[4,5,6,14,16,19,26,29]);self.assertEqual(c["finalWitness"]["time"],wire(F(34667,259980)))
        self.assertEqual(c["finalWitness"]["minimumDistance"],wire(ETA))

    def test_phase_aware_success_all_width_guarantees_fail(self):
        c=p.derive_certificate(fixture(2));rows=c["context"]["transfer"]["candidateRows"]
        self.assertTrue(all(not r[11] for r in rows));self.assertEqual([r[0] for r in rows if r[12]],[10,12])
        self.assertEqual(c["context"]["selection"]["chosenCandidate"]["coordinateLabel"],10)
        self.assertEqual(c["adjustedGrid"]["goodIndices"],[6,21]);self.assertEqual(c["finalWitness"]["time"],wire(F(242649,1213184)))

    def test_no_complete_band_not_global_or_component_exhaustion(self):
        c=p.derive_certificate(fixture(1));self.assertEqual(c["status"],"UNKNOWN_NO_COMPLETE_BAND")
        self.assertIsNone(c["adjustedGrid"]);self.assertIsNone(c["finalWitness"]);self.assertIsNone(c["context"]["selection"]["chosenCandidate"])

    def test_no_primary_safe_base_honest_scoped_unknown(self):
        raw=fixture();raw["speeds"][7]=300000000;c=p.derive_certificate(raw);self.assertEqual(c,expected(raw))
        t=c["context"]["transfer"];self.assertEqual(t["K"],3000);self.assertTrue(t["completeBandFits"])
        self.assertTrue(all(not r[11] and not r[12] for r in t["candidateRows"]));self.assertEqual(c["status"],"UNKNOWN_NO_PRIMARY_SAFE_BASE")
        self.assertIsNone(c["adjustedGrid"]);self.assertIsNone(c["finalWitness"])

    def test_family_base_actual_narrow_tuple_forced_large_q3(self):
        raw=fixture();raw["tau"]=wire(F(1,20076));c=p.derive_certificate(raw);self.assertEqual(c,expected(raw))
        f=c["context"]["family"];self.assertTrue(f["fullFamilyApplicable"]);self.assertTrue(f["forcedLargeQ3Applicable"])
        self.assertLessEqual(len(f["actualSmallExceptionLabels"]),1);self.assertGreaterEqual(len(f["largeQ3Labels"]),2)

    def test_independently_varying_family_direct_dichotomy(self):
        for a in (2,4,7,9,11,101,1001):
            raw={"label":"varying","speeds":[30*(a+j) for j in range(7)]+[360*a]+[3,9,2,4,6*a+2],"tau":wire(F(1,84*a)),"omittedLabel":7}
            c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertTrue(c["context"]["family"]["fullFamilyApplicable"])
            self.assertIsNotNone(c["finalWitness"])

    def test_all20_full_critical_family_covers_and_automatic_transfer(self):
        count=coords=0
        for masks,raw in critical_realizations(8):
            c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertEqual([r[2] for r in c["originalGrid"]["coverage"]["maskRows"]],masks)
            self.assertTrue(c["context"]["family"]["forcedLargeQ3Applicable"]);self.assertGreaterEqual(len(c["context"]["family"]["largeQ3Labels"]),2)
            self.assertEqual(c["status"],"CHECKED_ANALYTIC_BAND_TRANSFER");count+=1
            coords+=sum(len(row) for key in ("originalGrid","adjustedGrid") for row in c[key]["distanceNumerators"])
        self.assertEqual((count,coords),(20,15600))

    def test_family_predicate_not_common_scaling_claim(self):
        c=p.derive_certificate(fixture());self.assertTrue(c["context"]["family"]["familyLowerInequalities"])
        self.assertFalse(c["context"]["family"]["familyBaseMatches"]);self.assertFalse(c["context"]["family"]["forcedLargeQ3Applicable"])

    def test_excluded_varying_family_a_three_mod_five_refused(self):
        a=8;raw={"label":"excluded","speeds":[30*(a+j) for j in range(7)]+[360*a]+[3,9,2,4,6*a+2],"tau":wire(F(1,84*a)),"omittedLabel":7}
        with self.assertRaisesRegex(p.Refused,"PREMISE_REFUSED"):p.derive_certificate(raw)

    def test_family_inequality_equalities_are_closed_good(self):
        for W in (810,2730):
            raw={"label":"closed_family","speeds":list(range(210,391,30))+[W]+[3,9,2,4,44],"tau":wire(F(1,588)),"omittedLabel":7}
            c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertTrue(c["context"]["family"]["fullFamilyApplicable"])
            self.assertIsNotNone(c["finalWitness"])
            t=c["context"]["transfer"];geometry=c["context"]["lowerGeometry"]
            if W==810:self.assertEqual(t["J"][1],geometry["protectedComponent"][1])
            else:self.assertEqual(c["context"]["normalization"]["tStar"],geometry["oldComponent"][1])

    def test_original_direct_priority_even_no_fit(self):
        raw=fixture(1);raw["speeds"][-1]=53332;c=p.derive_certificate(raw);self.assertEqual(c,expected(raw))
        self.assertFalse(c["context"]["transfer"]["completeBandFits"]);self.assertEqual(c["status"],"CHECKED_ORIGINAL_ORBIT")
        self.assertTrue(c["context"]["selection"]["originalMatrixReused"]);self.assertIsNone(c["adjustedGrid"])

    def test_whole_H_actual_physical_indices_scaling(self):
        raw=fixture();raw["speeds"]=[7*v for v in raw["speeds"]];raw["tau"]=wire(F(5,700021));c=p.derive_certificate(raw)
        self.assertEqual(c,expected(raw));self.assertEqual(c["context"]["normalization"]["H"],7)
        self.assertEqual(c["finalWitness"]["time"],wire(F(34667,1819860)));self.assertEqual(c["finalWitness"]["lowestPhysicalEll"],4)

    def test_negative_floor_transfer(self):
        raw=fixture();raw["tau"]=["-5","100003"];c=p.derive_certificate(raw);self.assertEqual(c,expected(raw))
        self.assertTrue(all(r[1]<0 for r in c["context"]["lowerGeometry"]["bandRows"]))

    def test_reordering_actual_labels_and_selector_tie(self):
        raw=fixture();raw["speeds"]=list(reversed(raw["speeds"]));raw["omittedLabel"]=5;c=p.derive_certificate(raw)
        self.assertEqual(c,expected(raw));self.assertEqual(c["context"]["selection"]["chosenCandidate"]["coordinateLabel"],0)

    def test_q1_q6_not_width_eligible_direct_controls(self):
        raw=fixture();raw["speeds"]=raw["speeds"][:8]+[6,12,18,7,11];c=p.derive_certificate(raw);self.assertEqual(c,expected(raw))
        self.assertEqual([r[4] for r in c["context"]["transfer"]["candidateRows"]],[1,1,1,6,6])
        self.assertTrue(all(r[10] is None and not r[11] for r in c["context"]["transfer"]["candidateRows"]))

    def test_closed_arc_start_end_and_width_equality(self):
        for q,v,g in ((2,3,6),(3,2,6)):
            gap=F(3,70*v) if q==2 else F(1,105*v);W=(20 if q==2 else 90)*v
            for left in (F(5,14)/(5*v),F(9,14)/(5*v)):
                row=p.assess_candidate(8,v,1,g,left,left+gap,W,p.Work())
                self.assertEqual(row,expected_candidate(8,v,1,g,left,left+gap,W));self.assertTrue(row[11]);self.assertEqual(row[9],wire(left))

    def test_exact_signed_ceil_floor_ties(self):
        for x in (F(-7,3),F(-2),F(-1,3),F(0),F(1,3),F(2),F(7,3)):
            self.assertEqual(p.floor(x),floor(x));self.assertEqual(p.ceil(x),-floor(-x))

    def test_labels_plain_types_no_extra_supplied_authority(self):
        for field,val in (("omittedLabel",True),("omittedLabel",8),("label",object()),("speeds",tuple(fixture()["speeds"]))):
            raw=fixture();raw[field]=val
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        for key in ("verdict","certificate","witness","path"):
            raw=fixture();raw[key]=True
            with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_speeds_reject_zero_bool_duplicate_overcap_wrong_gcd(self):
        for value in (0,True,7170,10**12+1):
            raw=fixture();raw["speeds"][1]=value
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        raw=fixture();raw["speeds"][0]=7175
        with self.assertRaisesRegex(p.Refused,"PREMISE_REFUSED"):p.derive_certificate(raw)

    def test_canonical_tau_and_lower_witness_refusals(self):
        for tau in (["10","200006"],["+5","100003"],["05","100003"],["5","0"],["0","1"],[True,"100003"]):
            raw=fixture();raw["tau"]=tau
            with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_subclasses_and_hooks_not_accepted(self):
        class Trap(dict):
            def __iter__(self):raise AssertionError("hook invoked")
        class IntTrap(int):pass
        with self.assertRaises(p.Refused):p.derive_certificate(Trap(fixture()))
        raw=fixture();raw["omittedLabel"]=IntTrap(7)
        with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_resource_budget_and_component_limits(self):
        with self.assertRaisesRegex(p.Refused,"RESOURCE_REFUSED"):p.build_fixed_report({"maxMs":5000,"maxOperations":1})
        for limits in ({"maxMs":5001,"maxOperations":2000000},{"maxMs":True,"maxOperations":2000000},{"maxMs":5000,"maxOperations":2000001}):
            with self.assertRaises(p.Refused):p.build_fixed_report(limits)
        with self.assertRaisesRegex(p.Refused,"COMPONENT_REFUSED"):p.Work().q(F(1,2**256))
        work=p.Work();work.deadline=0
        with self.assertRaisesRegex(p.Refused,"RESOURCE_REFUSED"):work.charge()

    def test_preflight_rejects_before_whole_tree_serialization(self):
        original=json.dumps;calls=[]
        def spy(value,*args,**kwargs):
            calls.append(type(value));return original(value,*args,**kwargs)
        with patch.object(p.json,"dumps",spy):
            with self.assertRaisesRegex(p.Refused,"OUTPUT_REFUSED"):p.bounded_json({"tooLong":"x"*257},p.Work())
        self.assertNotIn(dict,calls)
        with self.assertRaises(p.Refused):p.bounded_json({"bad":F(1,3)},p.Work())

    def test_output_cap_whole_body_no_matrix_drop(self):
        r=p.build_fixed_report();self.assertLessEqual(len(canonical(r))+1,32768);self.assertEqual(r["counts"]["matrixCoordinates"],1950)
        with patch.object(p,"MAX_BYTES",100):
            with self.assertRaisesRegex(p.Refused,"OUTPUT_REFUSED"):p.build_fixed_report()

    def test_semantic_mutations_even_coherently_rehashed_not_oracle_equal(self):
        body=expected_body()
        for group,key in (("transfer","K"),("family","fullFamilyApplicable"),("selection","finalMatrixRef")):
            mutated=json.loads(canonical(body));mutated["cases"][0]["context"][group][key]="corrupted"
            self.assertNotEqual(mutated,expected_body());self.assertNotEqual(sha256(canonical(mutated)).hexdigest(),sha256(canonical(body)).hexdigest())

    def test_ast_capability_and_bounded_ranges(self):
        tree=ast.parse(SOURCE.read_text());imports={n.module for n in ast.walk(tree) if isinstance(n,ast.ImportFrom)}|{a.name for n in ast.walk(tree) if isinstance(n,ast.Import) for a in n.names}
        self.assertEqual(imports,{"fractions","functools","hashlib","math","json","os","re","sys","time"})
        banned={"open","eval","exec","compile","input","__import__"}
        self.assertFalse(any(isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id in banned for n in ast.walk(tree)))
        ranges=[n for n in ast.walk(tree) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=="range"]
        self.assertTrue(all(all(isinstance(a,ast.Constant) for a in n.args) for n in ranges))

    def test_inspected_byte_child_minimal_environment_pins(self):
        result=launch();self.assertEqual((result.returncode,result.stderr),(0,""));r=json.loads(result.stdout)
        self.assertEqual({k:v for k,v in r.items() if k not in ("metrics","semanticDigest")},expected_body());self.assertLessEqual(len(result.stdout.encode()),32768)

    def test_cli_flags_exact_false_and_options_refused(self):
        for flag in FLAGS:
            env={f:"false" for f in FLAGS};env[flag]="true";r=launch(env=env)
            self.assertEqual((r.returncode,r.stdout,r.stderr),(1,"","CLI_REFUSED\n"))
        for val in ("False","0",""):
            env={f:"false" for f in FLAGS};env[FLAGS[0]]=val;self.assertEqual(launch(env=env).returncode,1)
        r=launch(args=("--input",));self.assertEqual((r.returncode,r.stdout),(1,""))
        self.assertEqual(launch(env={}).returncode,1)

    def test_stdin_not_read_and_irrelevant_environment_ignored(self):
        a=launch(stdin="not supplied scientific evidence");self.assertEqual(a.returncode,0)
        env={f:"false" for f in FLAGS};env["UNRELATED_SECRET"]="not read";b=launch(env=env)
        self.assertEqual(json.loads(a.stdout)["semanticDigest"],json.loads(b.stdout)["semanticDigest"])


if __name__=="__main__":unittest.main()
