"""TIP-072T independent CRT/closed-arc/Fraction oracle, pinned child controls."""
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
SOURCE=ROOT/"scripts/research/lrc-critical-component-replay.py"
SOURCE_SHA256="d13a709f5166a0d5d874967e4be28d20f296ef9d4b466ff203b03f3f23f15a13"
spec=importlib.util.spec_from_file_location("tip072t_product",SOURCE)
p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
FLAGS=("RESEARCH_WORKER_ENABLED","MATH_PILOT_QUEUE_ENABLED","LRC_CAMPAIGN_LOCAL_ENABLED",
       "RESEARCH_OPENAI_ENABLED","RESEARCH_CODEX_LOCAL_ENABLED","SANDBOX_DOCKER_ENABLED")
ETA=F(1,14)
E=[4989,54999,86656,19996,53326]
LOWER=list(range(7170,7381,30))
COLUMNS=["label","v","normalizedV","h","q","alpha","r","y","nearestInteger","offset","beta","D",
         "leftDelta","rightDelta","leftInComponent","rightInComponent","symmetricGate","alreadySafe"]
BANDS=["label","floor","left","right","lowerDistance"]
MASKS=["label","q","badIndices","support","parityCounts","ternaryCounts"]
SCHEMA={"rows":30,"columns":13,"rowTime":"baseTime+ell/(30*H)",
        "distance":"nonnegative integer distanceNumerators[ell][label]/matrixDenominator",
        "denominator":"lcm(den(baseTime),30*H); decimal canonical positive string",
        "numerators":"NOT individually reduced; exact and <=denominator/2"}
SCOPE={"localUnsigned":True,"retainedAgentResult":False,"agentLoop":"NOT_RUN","executionAuthority":False,
       "wholeAllikvereBranch":"NOT_ESTABLISHED","global":"NOT_ESTABLISHED","formal":"NOT_ESTABLISHED",
       "external":"NOT_ESTABLISHED","novelty":"NOT_ESTABLISHED","samplingIsUniversalProof":False,
       "genericStrictSlack":False,"writtenTheoremHasSpeedCap":False,"catalogueIsAbsoluteSpeedReduction":False,
       "exhaustionScope":"TRANSLATES_OF_ONE_CONNECTED_LOWER_GOOD_COMPONENT_ONLY"}


def wire(x):return [str(x.numerator),str(x.denominator)]
def norm(x):
    floor=x.numerator//x.denominator
    return min(x-floor,floor+1-x)
def canonical(x):return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False).encode("ascii")
def fixture(i=0):
    labels=["component_right_upgrade","direct_secondary_observation","component_exhausted"]
    lo=LOWER if i<2 else LOWER[:-1]+[92850]
    ex=E if i!=1 else E[:-1]+[53332]
    return {"label":labels[i],"speeds":lo+ex,"tau":["5","100003"]}


def expected_catalogue():
    # Independent universes from CRT assignments, not modular preimage loops.
    q2=[];q3=[]
    for A in combinations(range(5),2):
        for parity in (0,1):
            q2.append([ell for ell in range(30) if ell%5 in A and ell%2==(parity if ell%5==A[0] else 1-parity)])
    for B in combinations(range(5),3):
        for perm in permutations(range(3)):
            q3.append([ell for ell in range(30) if ell%5 in B and ell%3==perm[B.index(ell%5)]])
    q2.sort();q3.sort();covers=[]
    for A in combinations(range(5),2):
        ids2=[i for i,m in enumerate(q2) if {ell%5 for ell in m}==set(A)]
        B=sorted(set(range(5))-set(A))
        for parity in (0,1):
            ids3=[]
            for i,m in enumerate(q3):
                if {ell%5 for ell in m}!=set(B):continue
                perm=[next(ell%3 for ell in m if ell%5==a) for a in B]
                sign=sum(perm[a]>perm[b] for a,b in combinations(range(3),2))%2
                if sign==parity:ids3.append(i)
            covers.append(ids2+ids3)
    covers.sort()
    return {"q2Masks":q2,"q3Masks":q3,"signatureColumns":["q2Id0","q2Id1","q3Id0","q3Id1","q3Id2"],
            "signatures":covers,"idSemantics":"ZERO_BASED; each mask sorted physical ell; universes and signatures lex-sorted; ids within each type ascending",
            "absoluteSpeedReduction":False}


def expected_matrix(speeds,H,base):
    D=base.denominator*(30*H)//gcd(base.denominator,30*H)
    fractions=[[norm(v*(base+F(ell,30*H))) for v in speeds] for ell in range(30)]
    nums=[[int(x*D) for x in row] for row in fractions]
    return {"baseTime":wire(base),"matrixDenominator":str(D),"distanceNumerators":nums,
            "goodIndices":[ell for ell,row in enumerate(fractions) if all(x>=ETA for x in row)]}


def expected_shape(grid,speeds,ex,H,cat):
    D=int(grid["matrixDenominator"]);masks=[[ell for ell in range(30) if F(grid["distanceNumerators"][ell][i],D)<ETA] for i in ex]
    qs=[6//gcd(speeds[i]//H,6) for i in ex];rows=[]
    for i,q,m in zip(ex,qs,masks):
        parity=[[sum(e%5==a and e%2==b for e in m) for b in range(2)] for a in range(5)]
        ternary=[[sum(e%5==a and e%3==c for e in m) for c in range(3)] for a in range(5)]
        rows.append([i,q,m,sorted({e%5 for e in m}),parity,ternary])
    mult=[sum(e in m for m in masks) for e in range(30)];union=[e for e in range(30) if mult[e]]
    ids2=sorted(cat["q2Masks"].index(m) for q,m in zip(qs,masks) if q==2 and len(m)==6)
    ids3=sorted(cat["q3Masks"].index(m) for q,m in zip(qs,masks) if q==3 and len(m)==6)
    sig=ids2+ids3;index=cat["signatures"].index(sig) if len(ids2)==2 and len(ids3)==3 and sig in cat["signatures"] else None
    saturated=all(len(m)==6 for m in masks);disjoint=max(mult)<=1;counts=[qs.count(q) for q in (1,2,3,6)]
    # CRT occupancy necessity independently checked, not defined from catalogue.
    rigid=False
    if counts==[0,2,3,0] and saturated:
        two=[r for r in rows if r[1]==2];three=[r for r in rows if r[1]==3]
        A=set(two[0][3]);B=set(three[0][3])
        rigid=all(set(r[3])==A for r in two) and all(set(r[3])==B for r in three) and A.isdisjoint(B) and A|B==set(range(5))
        if rigid:
            rigid=all(sum(bool(r[4][a][b]) for r in two)==1 for a in A for b in range(2)) and all(sum(bool(r[5][a][c]) for r in three)==1 for a in B for c in range(3))
    return {"maskRows":rows,"badUnion":union,"badMultiplicity":mult,"typeCountOrder":[1,2,3,6],"typeCounts":counts,
            "saturated":saturated,"pairwiseDisjoint":disjoint,"fullCoverage":len(union)==30,"rigidShape":rigid,
            "q2MaskIds":ids2,"q3MaskIds":ids3,"coverSignatureId":index}


def expected_candidate(i,v,H,g,t,A,B,R):
    h=gcd(v,g);q=g//h;rho=5*ETA;alpha=5*v*t
    # Independent safe-arc endpoints rather than product's directional formula.
    anchor=(q*alpha).numerator//(q*alpha).denominator
    intervals=[(rho+F(k,q),1-rho+F(k,q)) for k in range(anchor-4,anchor+5)]
    already=any(a<=alpha<=b for a,b in intervals)
    left=right=F(0)
    if not already:
        edges=[edge for pair in intervals for edge in pair]
        left=(max(x for x in edges if x<alpha)-alpha)/(5*v)
        right=(min(x for x in edges if x>alpha)-alpha)/(5*v)
    D=min(abs(left),right);r=max(F(0),rho-F(q-1,2*q));y=q*alpha-F(q+1,2)
    floor=y.numerator//y.denominator;z=min((floor,floor+1),key=lambda n:(abs(y-n),n));s=y-z
    return [i,v,v//H,h,q,wire(alpha),wire(r),wire(y),z,wire(s),wire(abs(s)/q),wire(D),
            wire(left),wire(right),A<=t+left<=B,A<=t+right<=B,D<=R,already]


def expected_final(grid,H):
    ell=min(grid["goodIndices"]);D=int(grid["matrixDenominator"]);base=F(*map(int,grid["baseTime"]))
    distances=[F(n,D) for n in grid["distanceNumerators"][ell]]
    return {"lowestPhysicalEll":ell,"time":wire(base+F(ell,30*H)),"coordinateDistances":[wire(x) for x in distances],"minimumDistance":wire(min(distances))}


def expected(raw):
    speeds=raw["speeds"];tau=F(*map(int,raw["tau"]));t=tau/5;H=reduce(gcd,speeds);lo=[i for i,v in enumerate(speeds) if not v%5];ex=[i for i,v in enumerate(speeds) if v%5]
    g=reduce(gcd,[speeds[i]//5 for i in lo]);bands=[]
    for i in lo:
        x=speeds[i]*t;k=x.numerator//x.denominator
        bands.append((i,k,(k+ETA)/speeds[i],(k+1-ETA)/speeds[i],norm(x)))
    A=max(x[2] for x in bands);B=min(x[3] for x in bands);L=min(x[4] for x in bands);U=max(speeds[i] for i in lo);R=(L-ETA)/U
    rows=[expected_candidate(i,speeds[i],H,g,t,A,B,R) for i in ex];cat=expected_catalogue();original=expected_matrix(speeds,H,t)
    original["coverage"]=expected_shape(original,speeds,ex,H,cat);adjusted=final=chosen=delta=base=reference=None;status="UNKNOWN_COMPONENT_EXHAUSTED"
    if original["goodIndices"]:
        status="CHECKED_ORIGINAL_ORBIT";delta=F(0);base=t;reference="originalGrid";final=expected_final(original,H)
    else:
        options=[]
        for row in rows:
            for side,c,gate in (("LEFT",12,14),("RIGHT",13,15)):
                if row[gate]:
                    d=F(*map(int,row[c]));options.append((abs(d),d,row[0],0 if side=="LEFT" else 1,side))
        if options:
            _,delta,i,_,side=min(options);base=t+delta;chosen={"coordinateLabel":i,"side":side,"delta":wire(delta)}
            adjusted=expected_matrix(speeds,H,base);adjusted["coverage"]=expected_shape(adjusted,speeds,ex,H,cat)
            final=expected_final(adjusted,H);reference="adjustedGrid";status="CHECKED_COMPONENT_BOUNDARY"
    ctx={"movingCount":13,"totalCount":14,"eta":wire(ETA),"d":5,"speeds":speeds,"coordinateLabels":list(range(13)),
         "divisibleIndices":lo,"exceptionIndices":ex,"tau":wire(tau),"tStar":wire(t),"H":H,"g":g,"gPrime":6,"L":wire(L),"U":U,
         "oldRadius":wire(R),"bandColumns":BANDS,"bandRows":[[i,k,wire(a),wire(b),wire(d)] for i,k,a,b,d in bands],
         "componentLeft":wire(A),"componentRight":wire(B),"activeLeftLabel":min(x[0] for x in bands if x[2]==A),
         "activeRightLabel":min(x[0] for x in bands if x[3]==B),"candidateColumns":COLUMNS,"candidateRows":rows,"maskColumns":MASKS,
         "chosenBoundary":chosen,"chosenDelta":wire(delta) if delta is not None else None,"chosenBase":wire(base) if base is not None else None,
         "finalMatrixRef":reference}
    return {"label":raw["label"],"status":status,"context":ctx,"originalGrid":original,"adjustedGrid":adjusted,"finalWitness":final,
            "catalogue":cat,"matrixSchema":SCHEMA,"scope":SCOPE}


def expected_body():
    cases=[expected(fixture(i)) for i in range(3)]
    for c in cases:
        for k in ("catalogue","matrixSchema","scope"):del c[k];c[k+"Ref"]="body."+k
        for k in ("bandColumns","candidateColumns","maskColumns"):del c["context"][k];c["context"][k+"Ref"]="body."+k
    return {"version":"LRC_CRITICAL_COMPONENT_V1","cases":cases,"catalogue":expected_catalogue(),"matrixSchema":SCHEMA,"scope":SCOPE,
            "candidateColumns":COLUMNS,"bandColumns":BANDS,"maskColumns":MASKS,"counts":{"cases":3,"accepted":2,"positiveMoves":1,
            "originalMatrices":3,"adjustedMatrices":1,"matrixCoordinates":1560,"lowerDistances":24,"candidateRows":15,
            "finalDistances":26,"q2Masks":20,"q3Masks":60,"coverSignatures":20}}


def launch(args=(),env=None,stdin=""):
    data=SOURCE.read_bytes()
    if sha256(data).hexdigest()!=SOURCE_SHA256:raise AssertionError("Source changed before launch")
    code="exec(compile("+repr(data)+", "+repr(str(SOURCE))+", 'exec'), {'__name__':'__main__'})"
    r=subprocess.run([sys.executable,"-I","-S","-B","-c",code,*args],input=stdin,capture_output=True,text=True,timeout=5,
                     env={f:"false" for f in FLAGS} if env is None else env,shell=False)
    if SOURCE.read_bytes()!=data:raise AssertionError("Source changed after launch")
    return r


def realizations():
    cat=expected_catalogue();witnesses={}
    for q,modulus,table in ((2,10,cat["q2Masks"]),(3,15,cat["q3Masks"])):
        for coefficient in range(1,modulus):
            if gcd(coefficient,modulus)!=1:continue
            inv=pow(coefficient,-1,modulus)
            for b in range(modulus):
                core={(inv*(b+j))%modulus for j in range(q)}
                mask=tuple(e for e in range(30) if e%modulus in core)
                target=(-(F(b)+F(q-1,2))/modulus)%1
                residue=(6//q)*coefficient
                x=211*(target-F(residue,6330));floor=x.numerator//x.denominator
                k=min((floor,floor+1),key=lambda n:(abs(x-n),n))%211
                v=residue+30*k
                witnesses[(q,mask)]=v
    for i,signature in enumerate(cat["signatures"]):
        masks=[cat["q2Masks"][j] for j in signature[:2]]+[cat["q3Masks"][j] for j in signature[2:]]
        E=[witnesses[(2 if j<2 else 3,tuple(mask))]+6330*j for j,mask in enumerate(masks)]
        yield i,masks,{"label":"realization_"+str(i),"speeds":[30*k for k in range(100,108)]+E,"tau":["1","1266"]}


class ExactTests(unittest.TestCase):
    def test_complete_contexts_1560_decoded_24_lower_15_candidates_26_final(self):
        coords=lower=candidates=final=0
        for i in range(3):
            c=p.derive_certificate(fixture(i));self.assertEqual(c,expected(fixture(i)))
            lower+=len(c["context"]["bandRows"]);candidates+=len(c["context"]["candidateRows"])
            for key in ("originalGrid","adjustedGrid"):
                if c[key] is not None:coords+=sum(map(len,c[key]["distanceNumerators"]))
            if c["finalWitness"] is not None:final+=len(c["finalWitness"]["coordinateDistances"])
        self.assertEqual((coords,lower,candidates,final),(1560,24,15,26))

    def test_frozen_inputs_whole_body_and_digest(self):
        self.assertEqual(p.fixed_inputs(),[fixture(i) for i in range(3)])
        r=p.build_fixed_report();body={k:v for k,v in r.items() if k not in ("metrics","semanticDigest")}
        self.assertEqual(body,expected_body());self.assertEqual(r["semanticDigest"],sha256(canonical(body)).hexdigest())

    def test_independent20_60_20_CRT_catalogue(self):
        cat=p.catalogue(p.Work());self.assertEqual(cat,expected_catalogue())
        self.assertEqual((len(cat["q2Masks"]),len(cat["q3Masks"]),len(cat["signatures"])),(20,60,20))

    def test_all20_realizations_complete7800_coordinates(self):
        count=coords=0
        for index,masks,raw in realizations():
            c=p.derive_certificate(raw);grid=c["originalGrid"]
            self.assertEqual(grid["coverage"]["coverSignatureId"],index)
            self.assertEqual([row[2] for row in grid["coverage"]["maskRows"]],masks)
            self.assertEqual(grid,expected(raw)["originalGrid"])
            self.assertEqual(c["context"]["H"],1);self.assertIsNotNone(c["finalWitness"])
            count+=1;coords+=sum(map(len,grid["distanceNumerators"]))
        self.assertEqual((count,coords),(20,7800))

    def test_original_hostile_full_coverage_and_rigidity(self):
        for i in (0,2):
            shape=p.derive_certificate(fixture(i))["originalGrid"]["coverage"]
            self.assertEqual(shape["badUnion"],list(range(30)));self.assertEqual(shape["badMultiplicity"],[1]*30)
            self.assertTrue(shape["rigidShape"]);self.assertEqual(shape["typeCounts"],[0,2,3,0]);self.assertIsNotNone(shape["coverSignatureId"])

    def test_direct_type2_3_membership_not_fullcover(self):
        c=p.derive_certificate(fixture(1));shape=c["originalGrid"]["coverage"]
        self.assertEqual(shape["typeCounts"],[0,2,3,0]);self.assertFalse(shape["fullCoverage"]);self.assertFalse(shape["rigidShape"])
        self.assertIsNone(shape["coverSignatureId"]);self.assertEqual(c["originalGrid"]["goodIndices"],[1,12,14,16,27,29])

    def test_asymmetric_nearer_left_refused_right_passes(self):
        c=p.derive_certificate(fixture());ctx=c["context"];row=ctx["candidateRows"][2]
        self.assertEqual(row[12],wire(-F(97217,1819830593280)));self.assertEqual(row[13],wire(F(34263,606610197760)))
        self.assertFalse(row[14]);self.assertTrue(row[15]);self.assertFalse(row[16]);self.assertEqual(ctx["chosenBoundary"]["side"],"RIGHT")
        self.assertGreater(F(*map(int,ctx["chosenDelta"])),F(*map(int,ctx["oldRadius"])))

    def test_positive_final_lowest_fullEll_and_endpoint(self):
        c=p.derive_certificate(fixture());self.assertEqual(c["adjustedGrid"]["goodIndices"],[6,21])
        self.assertEqual(c["finalWitness"]["lowestPhysicalEll"],6);self.assertEqual(c["finalWitness"]["time"],wire(F(242649,1213184)))
        self.assertEqual(c["finalWitness"]["minimumDistance"],wire(ETA));self.assertEqual(c["context"]["chosenBase"],wire(F(61,6065920)))

    def test_direct_zero_reuses_original_complete_matrix(self):
        c=p.derive_certificate(fixture(1));self.assertEqual(c["context"]["chosenDelta"],wire(F(0)))
        self.assertIsNone(c["adjustedGrid"]);self.assertIsNone(c["context"]["chosenBoundary"])
        self.assertEqual(c["context"]["finalMatrixRef"],"originalGrid");self.assertEqual(c["finalWitness"]["time"],wire(F(100033,3000090)))

    def test_unknown_allten_boundaries_outside_exact_component(self):
        c=p.derive_certificate(fixture(2));ctx=c["context"]
        self.assertEqual(c["status"],"UNKNOWN_COMPONENT_EXHAUSTED");self.assertIsNone(c["finalWitness"]);self.assertIsNone(c["adjustedGrid"])
        self.assertEqual(ctx["componentLeft"],wire(F(1,100380)));self.assertEqual(ctx["componentRight"],wire(F(13,1299900)))
        self.assertTrue(all(not row[14] and not row[15] for row in ctx["candidateRows"]));self.assertIsNone(ctx["chosenDelta"])

    def test_zero_slack_positive_component_move(self):
        raw=fixture();raw["tau"]=["1","20076"]
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertEqual(c["context"]["oldRadius"],wire(F(0)))
        self.assertEqual(c["context"]["L"],wire(ETA));self.assertEqual(c["context"]["chosenDelta"],wire(F(409,4349264640)))
        self.assertEqual(c["finalWitness"]["time"],wire(F(242649,1213184)))

    def test_imprimitive_H_physical_index_scaling(self):
        raw=fixture();raw["speeds"]=[7*v for v in raw["speeds"]];raw["tau"]=["5","700021"]
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertEqual((c["context"]["H"],c["context"]["g"]),(7,42))
        self.assertEqual(c["finalWitness"]["lowestPhysicalEll"],6);self.assertEqual(c["finalWitness"]["time"],wire(F(242649,8492288)))

    def test_reordered_labels_preserve_actual_order(self):
        raw=fixture();raw["speeds"]=list(reversed(raw["speeds"]))
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertEqual(c["context"]["chosenBoundary"]["coordinateLabel"],2)

    def test_negative_times_floor_and_exact_component(self):
        raw=fixture();raw["tau"]=["-5","100003"]
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertTrue(all(row[1]==-1 for row in c["context"]["bandRows"]))

    def test_single_point_component_endpoint_equality(self):
        raw={"label":"single_point","speeds":[30*i for i in [1,2,3,4,5,6,7,13]]+E,"tau":["1","84"]}
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));ctx=c["context"]
        self.assertEqual(ctx["componentLeft"],ctx["componentRight"]);self.assertEqual(ctx["L"],wire(ETA));self.assertEqual(ctx["oldRadius"],wire(F(0)))

    def test_saturated_singleton_component_is_exhausted(self):
        raw={"label":"covered_singleton","speeds":[6330,6360,6390,6420,6450,6480,6510,82290]+[84183,39873,70892,41342,11822],"tau":["1","17724"]}
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));ctx=c["context"]
        self.assertEqual(ctx["componentLeft"],wire(F(1,88620)));self.assertEqual(ctx["componentRight"],wire(F(1,88620)))
        self.assertTrue(c["originalGrid"]["coverage"]["fullCoverage"]);self.assertEqual(c["status"],"UNKNOWN_COMPONENT_EXHAUSTED")
        self.assertIsNone(c["finalWitness"]);self.assertTrue(all(not row[14] and not row[15] for row in ctx["candidateRows"]))

    def test_q6_presence_prevents_fullcover_and_has_already_safe(self):
        raw=fixture();raw["speeds"][-1]=53327
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertFalse(c["originalGrid"]["coverage"]["fullCoverage"])
        row=c["context"]["candidateRows"][-1];self.assertEqual(row[4],6);self.assertTrue(row[17]);self.assertEqual(row[12],wire(F(0)))

    def test_q1_mixed_count_never_invented_fullcover(self):
        raw=fixture();raw["speeds"][-1]=53338*3
        c=p.derive_certificate(raw);self.assertEqual(c,expected(raw));self.assertIn(1,[row[4] for row in c["context"]["candidateRows"]])
        self.assertFalse(c["originalGrid"]["coverage"]["fullCoverage"])

    def test_candidate_center_equal_directions_negative_tie(self):
        row=p.candidate(8,3,1,6,F(1,20),F(0),F(1),F(0),p.Work())
        self.assertEqual(row,expected_candidate(8,3,1,6,F(1,20),F(0),F(1),F(0)))
        self.assertEqual(F(*map(int,row[12])),-F(*map(int,row[13])))
        options=[(abs(F(*map(int,row[c]))),F(*map(int,row[c])),row[0],rank,side) for side,c,rank in (("LEFT",12,0),("RIGHT",13,1))]
        self.assertEqual(min(options)[4],"LEFT")
        self.assertEqual(p.select_boundary([row],p.Work())[4],"LEFT")

    def test_equal_boundary_coordinate_tie_lowest_original_label(self):
        t=F(1,42)-F(1,1000000)
        rows=[p.candidate(9,3,1,6,t,F(0),F(1),F(0),p.Work()),p.candidate(8,87,1,6,t,F(0),F(1),F(0),p.Work())]
        self.assertEqual(rows[0][13],wire(F(1,1000000)));self.assertEqual(rows[1][13],rows[0][13])
        selected=p.select_boundary(rows,p.Work());self.assertEqual((selected[1],selected[2],selected[4]),(F(1,1000000),8,"RIGHT"))

    def test_candidate_already_safe_has_zero_not_fake_boundary(self):
        row=p.candidate(8,1,1,6,F(0),F(-1),F(1),F(0),p.Work())
        self.assertEqual(row[4],6);self.assertTrue(row[17]);self.assertEqual((row[12],row[13]),(wire(F(0)),wire(F(0))))

    def test_lossless_common_denominator_every_original_coordinate(self):
        for i in range(3):
            c=p.derive_certificate(fixture(i));D=int(c["originalGrid"]["matrixDenominator"]);t=F(1,100003)
            for ell,row in enumerate(c["originalGrid"]["distanceNumerators"]):
                for v,num in zip(c["context"]["speeds"],row):self.assertEqual(F(num,D),norm(v*(t+F(ell,30))));self.assertLessEqual(2*num,D)

    def test_scope_refs_columns_and_counts_are_complete(self):
        r=p.build_fixed_report();self.assertEqual(r["scope"],SCOPE);self.assertEqual(r["matrixSchema"],SCHEMA)
        for c in r["cases"]:
            for k in ("catalogue","matrixSchema","scope"):self.assertEqual(c[k+"Ref"],"body."+k)
            for k in ("bandColumns","candidateColumns","maskColumns"):self.assertEqual(c["context"][k+"Ref"],"body."+k)
        self.assertEqual(r["counts"],expected_body()["counts"])

    def test_plain_inputs_extra_fields_hooks_subclasses(self):
        class D(dict):pass
        class L(list):pass
        for raw in (D(fixture()),{"label":"bad","speeds":L(fixture()["speeds"]),"tau":["5","100003"]}):
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        for extra in ({"verdict":"PASS"},{"label":"../x"},{"tau":("5","100003")},{"certificate":{}}):
            raw=fixture();raw.update(extra)
            with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_speed_count_sign_bool_duplicate_cap_and_wrong_gPrime(self):
        class I(int):pass
        for value in (0,-1,True,I(7170),10**12+1):
            raw=fixture();raw["speeds"][0]=value
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        for change in (lambda a:a.pop(),lambda a:a.append(999),lambda a:a.__setitem__(1,a[0]),lambda a:a.__setitem__(0,7175)):
            raw=fixture();change(raw["speeds"])
            with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_canonical_rational_and_256bit_refusal(self):
        for tau in (["10","200006"],["+5","100003"],["05","100003"],["5","0"],["5","-1"],["5","0100003"],[str(2**256),"1"]):
            raw=fixture();raw["tau"]=tau
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        with self.assertRaises(p.Refused):p.Work().q(F(2**256))

    def test_lower_witness_refusal_not_inferred(self):
        raw=fixture();raw["tau"]=["1","10000000"]
        with self.assertRaisesRegex(p.Refused,"LOWER_WITNESS_REFUSED"):p.derive_certificate(raw)

    def test_caps_limits_deadline_and_shared_budget(self):
        with self.assertRaisesRegex(p.Refused,"RESOURCE_REFUSED"):p.build_fixed_report({"maxMs":5000,"maxOperations":1})
        with patch.object(p,"monotonic",side_effect=[0,6]):
            with self.assertRaises(p.Refused):p.Work().charge()
        for limits in ({"maxMs":5001,"maxOperations":1},{"maxMs":1,"maxOperations":2000001},{"maxMs":True,"maxOperations":1},{"maxMs":1}):
            with self.assertRaises(p.Refused):p.Work(limits)

    def test_complete_output_preflight_before_whole_tree_serialization(self):
        value=["x"*256 for _ in range(60)];real=p.json.dumps
        with patch.object(p.json,"dumps",wraps=real) as observed:
            with self.assertRaises(p.Refused):p.bounded_json([value]*3,p.Work())
            self.assertTrue(all(type(call.args[0]) not in (dict,list) for call in observed.call_args_list))
        for value in ([0]*61,"x"*257,float("nan"),{1:"x"},object(),[[[[[[[[[[[[[[0]]]]]]]]]]]]]]):
            with self.assertRaises(p.Refused):p.bounded_json(value,p.Work())

    def test_fresh_pinned_byte_child_full_canonical_match(self):
        child=launch();self.assertEqual((child.returncode,child.stderr),(0,""));self.assertLessEqual(len(child.stdout.encode()),32768)
        r=json.loads(child.stdout);body={k:v for k,v in r.items() if k not in ("metrics","semanticDigest")}
        self.assertEqual(body,expected_body());self.assertEqual(r["semanticDigest"],sha256(canonical(body)).hexdigest())
        self.assertLess(r["metrics"]["chargedOperations"],2000000);self.assertLess(r["metrics"]["elapsedMs"],5000)

    def test_six_flags_each_five_faults_no_positive_JSON(self):
        for flag in FLAGS:
            for value in (None,"true","False","0",""):
                env={f:"false" for f in FLAGS}
                if value is None:del env[flag]
                else:env[flag]=value
                child=launch(env=env);self.assertEqual((child.returncode,child.stdout,child.stderr),(1,"","CLI_REFUSED\n"))

    def test_cli_no_paths_options_or_custom_cases_and_no_stdin_read(self):
        for option in ("--help","/tmp/certificate","PASS"):
            child=launch((option,));self.assertEqual((child.returncode,child.stdout,child.stderr),(1,"","CLI_REFUSED\n"))
        self.assertEqual(json.loads(launch(stdin="caller verdict PASS").stdout)["semanticDigest"],sha256(canonical(expected_body())).hexdigest())

    def test_source_capabilities_and_bounded_catalogue_loops(self):
        tree=ast.parse(SOURCE.read_text());imports=[]
        for node in ast.walk(tree):
            if isinstance(node,ast.Import):imports.extend(a.name for a in node.names)
            elif isinstance(node,ast.ImportFrom):imports.append(node.module)
            if isinstance(node,ast.Call) and isinstance(node.func,ast.Name):
                self.assertNotIn(node.func.id,("open","eval","exec","compile","__import__"))
                if node.func.id=="range":self.assertTrue(all(isinstance(a,ast.Constant) or isinstance(a,ast.Name) and a.id in ("q","modulus") for a in node.args))
        self.assertEqual(set(imports),{"fractions","functools","hashlib","itertools","math","json","os","re","sys","time"})


if __name__=="__main__":unittest.main(verbosity=2)
