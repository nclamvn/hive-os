"""TIP-072S exact reconstruction and fresh inspected-byte child tests."""
from fractions import Fraction as F
from functools import reduce
from hashlib import sha256
from math import gcd
from pathlib import Path
from unittest.mock import patch
import ast
import importlib.util
import json
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "scripts/research/lrc-full-period-replay.py"
SOURCE_SHA256 = "557181c0788421f9553cb8810b8debb1ec08372c9779aa28f87bb4ce8fb9dae7"
spec = importlib.util.spec_from_file_location("tip072s_product", SOURCE)
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)
FLAGS = ("RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED")
COLUMNS = ["label", "v", "h", "q", "alpha", "r", "gapCoordinate", "nearestInteger",
           "offset", "beta", "D", "delta", "primaryOnlyD", "actualSpeedThreshold",
           "automatic", "speedGate", "phaseGate", "primaryGate"]
SCOPE = {"localUnsigned": True, "retainedAgentResult": False, "agentLoop": "NOT_RUN",
         "executionAuthority": False, "wholeAllikvereBranch": "NOT_ESTABLISHED",
         "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
         "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
         "genericStrictSlack": False, "writtenTheoremHasSpeedCap": False,
         "primitiveStrataAreAbsoluteFiniteReduction": False,
         "targets": "13_MOVING_14_TOTAL_AND_14_MOVING_15_TOTAL_ONLY"}
G = 1000000007
CASES = [
    ("q2_actual_margin_improvement", [10*i for i in [1,3,5,6,7,8,9,10,11]], [1,3,4,8,37], F(5,21)),
    ("target14_q2_tight_lower", [10*i for i in range(1,9)], [2,3,4,6,21], F(1,18)),
    ("target14_q3_tight_lower", [15*i for i in [1,3,4,5,7,9,11,13]], [6,12,18,24,34], F(19,108)),
    ("q3_hostile_original_cover", [15*i for i in range(1,10)], [1,24,22,23,21], F(1,30)),
    ("target14_q4_hostile_cover", [20*i for i in range(1,9)], [1,29,27,28,26], F(1,36)),
    ("huge_q_max_speed_trap", [5*G*i for i in range(1,10)], [1,2,4,7,2*G], F(1,10*G)),
    ("unknown_primary_core", [5*i for i in range(1,10)], [1,2,3,7,11], F(1,10)),
]


def wire(x):
    return [str(x.numerator), str(x.denominator)]


def norm(x):
    a=x.numerator//x.denominator
    return min(x-a,a+1-x)


def fixture(i=0):
    label,lo,ex,tau=CASES[i]
    return {"label":label,"speeds":lo+ex,"tau":wire(tau)}


def expected_grid(speeds, ex, selected, base, eta):
    matrix=[[norm(v*(base+F(j,5))) for v in speeds] for j in range(5)]
    bad=[[j for j in range(5) if matrix[j][i]<eta] for i in ex]
    good=[j for j in range(5) if all(x>=eta for x in matrix[j])]
    witness=None
    if good:
        j=min(good)
        witness={"lowestPhysicalShift":j,"finalTime":wire(base+F(j,5)),
                 "coordinateDistances":[wire(x) for x in matrix[j]],"minimumDistance":wire(min(matrix[j]))}
    return {"baseTime":wire(base),"distanceMatrix":[[wire(x) for x in row] for row in matrix],
            "exceptionBadIndices":bad,"exceptionBadUnion":sorted(set().union(*map(set,bad))),
            "selectedAllShiftDistances":[wire(matrix[j][selected]) for j in range(5)],
            "goodShiftIndices":good,"observedWitness":witness}


def expected_candidate(v,i,g,t,eta,L,U):
    h=gcd(v,g);q=g//h;rho=5*eta;alpha=5*v*t
    automatic=q*(1-2*rho)>=1
    # Reconstruct nearest closed safe arcs by their endpoints for the small-q
    # branch, rather than calling or reusing product's gap-distance formula.
    if automatic:
        D=F(0);delta=F(0)
    else:
        anchor=(q*alpha).numerator//(q*alpha).denominator
        intervals=[(rho+F(k,q),1-rho+F(k,q)) for k in range(anchor-4,anchor+5)]
        if any(a<=alpha<=b for a,b in intervals):
            D=F(0);delta=F(0)
        else:
            points=[edge for pair in intervals for edge in pair]
            target=min(points,key=lambda x:(abs(x-alpha),x))
            delta=(target-alpha)/(5*v);D=abs(delta)
    r=max(F(0),rho-F(q-1,2*q));z=q*alpha-F(q+1,2)
    floor=z.numerator//z.denominator
    nearest=min((floor,floor+1),key=lambda a:(abs(z-a),a))
    R=(L-eta)/U;primary=max(F(0),rho-norm(alpha))/(5*v)
    threshold=F(0) if not r else r*U/(5*(L-eta)) if L>eta else None
    return D,delta,[i,v,h,q,wire(alpha),wire(r),wire(z),nearest,wire(z-nearest),wire(norm(z)/q),
                    wire(D),wire(delta),wire(primary),wire(threshold) if threshold is not None else None,
                    automatic,not r or (L>eta and v>=threshold),D<=R,primary<=R]


def expected(raw):
    speeds=raw["speeds"];n=len(speeds);tau=F(*map(int,raw["tau"]));t=tau/5;eta=F(1,n+1)
    lo=[i for i,v in enumerate(speeds) if not v%5];ex=[i for i,v in enumerate(speeds) if v%5]
    reduced=[speeds[i]//5 for i in lo];dist=[norm(v*tau) for v in reduced]
    L=min(dist);g=reduce(gcd,reduced);H=reduce(gcd,speeds);U=max(speeds[i] for i in lo);R=(L-eta)/U
    candidates=[expected_candidate(speeds[i],i,g,t,eta,L,U) for i in ex]
    D,delta,row=min(candidates,key=lambda c:(c[0],c[2][0]));selected=row[0];v=row[1];accepted=D<=R
    original=expected_grid(speeds,ex,selected,t,eta);adjusted=None;step=None
    if accepted:
        a=t+delta;h=gcd(v,g);q=g//h;f=5*v*a%1;x=q*(5*eta-f)
        k=x.numerator//x.denominator+(x.denominator!=1);km=k%q
        inv=pow(v//h,-1,q) if q>1 else None;ell=inv*km%q if q>1 else 0
        shift=F(ell,5*g);safe=a+shift
        step={"rawCeilK":k,"kModQ":km,"inverse":inv,"ell":ell,"secondaryTime":wire(shift),
              "adjustedBeforeSecondary":wire(a),"orbitSafeBase":wire(safe),"orbitSafePhase":wire(5*v*safe%1)}
        adjusted=expected_grid(speeds,ex,selected,safe,eta)
    ctx={"movingCount":n,"totalCount":n+1,"d":5,"exceptionCount":5,"speeds":speeds,
         "coordinateLabels":list(range(n)),"divisibleIndices":lo,"exceptionIndices":ex,
         "reducedSpeeds":reduced,"tau":wire(tau),"lowerDistances":[wire(x) for x in dist],
         "L":wire(L),"eta":wire(eta),"U":U,"g":g,"H":H,"gPrime":g//H,"tStar":wire(t),
         "radius":wire(R),"candidateColumns":COLUMNS,"candidateRows":[x[2] for x in candidates],
         "selectedExceptionLabel":selected,"actualAdjustment":wire(delta) if accepted else None,
         "secondary":step,"phaseGateHolds":accepted}
    return {"label":raw["label"],"status":"CHECKED_FULL_PERIOD_WITNESS" if accepted else "UNKNOWN_PERIOD_GATE",
            "context":ctx,"originalGrid":original,"adjustedGrid":adjusted,"scope":SCOPE}


def expected_body():
    cases=[expected(fixture(i)) for i in range(7)]
    for c in cases:
        del c["scope"];c["scopeRef"]="body.scope"
        del c["context"]["candidateColumns"];c["context"]["candidateColumnsRef"]="body.candidateColumns"
    return {"version":"LRC_FULL_PERIOD_V1","cases":cases,"scope":SCOPE,"candidateColumns":COLUMNS,
            "counts":{"cases":7,"accepted":6,"unknown":1,"originalMatrices":7,"adjustedMatrices":6,
                      "retainedMatrixCoordinates":880,"lowerDistances":60}}


def canonical(x):
    return json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False).encode("ascii")


def launch(args=(),env=None,stdin=""):
    data=SOURCE.read_bytes()
    if sha256(data).hexdigest()!=SOURCE_SHA256:raise AssertionError("Source pin changed before launch")
    code="exec(compile("+repr(data)+", "+repr(str(SOURCE))+", 'exec'), {'__name__':'__main__'})"
    r=subprocess.run([sys.executable,"-I","-S","-B","-c",code,*args],input=stdin,capture_output=True,text=True,
                     timeout=5,env={f:"false" for f in FLAGS} if env is None else env,shell=False)
    if SOURCE.read_bytes()!=data:raise AssertionError("Source pin changed after launch")
    return r


class ExactTests(unittest.TestCase):
    def test_all_contexts_candidates_lower_and_880_coordinates(self):
        coords=lower=0
        for i in range(7):
            c=p.derive_certificate(fixture(i));self.assertEqual(c,expected(fixture(i)))
            lower+=len(c["context"]["lowerDistances"])
            for key in ("originalGrid","adjustedGrid"):
                if c[key] is not None:coords+=sum(map(len,c[key]["distanceMatrix"]))
        self.assertEqual((coords,lower),(880,60))

    def test_frozen_inputs_and_whole_body_digest(self):
        self.assertEqual(p.fixed_inputs(),[fixture(i) for i in range(7)])
        r=p.build_fixed_report();body={k:v for k,v in r.items() if k not in ("metrics","semanticDigest")}
        self.assertEqual(body,expected_body());self.assertEqual(r["semanticDigest"],sha256(canonical(body)).hexdigest())

    def test_actual_margin_not_weaker_fixed_margin(self):
        c=p.derive_certificate(fixture());self.assertEqual(c["context"]["L"],wire(F(1,7)))
        self.assertEqual(c["context"]["radius"],wire(F(4,5775)))

    def test_all_old_gates_fail_first_five_cases(self):
        for i in range(5):
            rows=p.derive_certificate(fixture(i))["context"]["candidateRows"]
            self.assertTrue(all(not row[17] for row in rows))

    def test_exact_new_perturbations(self):
        for i,D,delta in [(0,F(1,7770),F(1,7770)),(1,F(1,4410),-F(1,4410)),(2,F(1,32130),-F(1,32130))]:
            c=p.derive_certificate(fixture(i));ctx=c["context"];row=next(r for r in ctx["candidateRows"] if r[0]==ctx["selectedExceptionLabel"])
            self.assertEqual((row[10],ctx["actualAdjustment"]),(wire(D),wire(delta)))

    def test_final_witnesses_and_lowest_indices(self):
        for i,T,minimum,j in [(0,F(82,555),F(5,37),0),(1,F(163,1470),F(16,147),0),
                              (2,F(877,2380),F(13,119),1),(3,F(11,150),F(11,150),0),
                              (4,F(91,180),F(1,9),2),(5,F(3333333361,50000000350),F(3333333361,50000000350),0)]:
            w=p.derive_certificate(fixture(i))["adjustedGrid"]["observedWitness"]
            self.assertEqual((w["finalTime"],w["minimumDistance"],w["lowestPhysicalShift"]),(wire(T),wire(minimum),j))

    def test_original_hostile_masks_cover_all_five(self):
        for i in (3,4):
            c=p.derive_certificate(fixture(i));self.assertEqual(c["originalGrid"]["exceptionBadUnion"],list(range(5)))
            self.assertEqual(c["originalGrid"]["goodShiftIndices"],[])

    def test_huge_q_max_speed_is_not_selected(self):
        c=p.derive_certificate(fixture(5));ctx=c["context"]
        self.assertEqual(ctx["selectedExceptionLabel"],9);self.assertEqual(ctx["candidateRows"][0][3],G)
        self.assertEqual(ctx["secondary"]["ell"],333333336)
        self.assertFalse(ctx["candidateRows"][-1][16]);self.assertLess(p.build_fixed_report()["metrics"]["chargedOperations"],2000000)

    def test_unknown_does_not_promote_observed_witness(self):
        c=p.derive_certificate(fixture(6));self.assertEqual(c["status"],"UNKNOWN_PERIOD_GATE")
        self.assertIsNone(c["adjustedGrid"]);self.assertIsNotNone(c["originalGrid"]["observedWitness"])
        self.assertIsNone(c["context"]["secondary"])

    def test_two_targets_are_not_interchangeable(self):
        self.assertEqual(p.derive_certificate(fixture(0))["context"]["eta"],wire(F(1,15)))
        self.assertEqual(p.derive_certificate(fixture(1))["context"]["eta"],wire(F(1,14)))

    def test_q1_exact_primary_recovery(self):
        for v in (1,2,3,7,11,41):
            D,delta,row=p.candidate(v,0,1,F(1,50),F(1,15),F(1,10),45,p.Work())
            self.assertEqual(row[10],row[12]);self.assertEqual(row[13],wire(F(90)))

    def test_standard_speed_threshold_table(self):
        for n,g,v,target in [(14,1,1,F(2)),(14,2,1,F(1,2)),(13,1,1,F(9,5)),(13,2,1,F(27,50)),(13,3,1,F(3,25))]:
            row=p.candidate(v,0,g,F(0),F(1,n+1),F(1,n-4),100,p.Work())[2]
            self.assertEqual(row[13],wire(100*target))

    def test_even_odd_gap_center_ties_choose_lower(self):
        for n,g,t in [(14,2,F(1,20)),(13,3,F(2,15))]:
            D,delta,row=p.candidate(1,0,g,t,F(1,n+1),F(1,2),10,p.Work())
            self.assertGreater(D,0);self.assertEqual(delta,-D);self.assertEqual(row[8],wire(F(0)))

    def test_negative_offset_and_positive_offset(self):
        for t in (F(1,25),F(3,50)):
            D,delta,row=p.candidate(1,0,2,t,F(1,15),F(1,2),10,p.Work())
            self.assertGreater(D,0);self.assertEqual(delta>0,F(*map(int,row[8]))>0)

    def test_endpoint_equality_is_safe(self):
        for g,t in [(1,F(1,15)),(2,F(1,30))]:
            D,delta,row=p.candidate(1,0,g,t,F(1,15),F(1,15),10,p.Work())
            self.assertEqual(D,0);self.assertTrue(row[16]);self.assertEqual(delta,0)

    def test_automatic_equality_and_no_slack(self):
        D,_,row=p.candidate(1,0,3,F(0),F(1,15),F(1,15),10,p.Work())
        self.assertEqual((D,row[14],row[13]),(0,True,wire(F(0))))
        raw=fixture(3);raw["tau"]=["1","45"]
        c=p.derive_certificate(raw);self.assertEqual(c["context"]["radius"],wire(F(0)));self.assertIsNotNone(c["adjustedGrid"])

    def test_qsmall_no_slack_already_safe_or_unknown(self):
        raw=fixture(6);raw["tau"]=["1","15"]
        c=p.derive_certificate(raw);self.assertEqual(c["context"]["radius"],wire(F(0)));self.assertIsNotNone(c["adjustedGrid"])
        self.assertTrue(all(row[13] is None for row in c["context"]["candidateRows"]))
        raw["speeds"][-5:]=[1,2,3,4,11]
        self.assertEqual(p.derive_certificate(raw)["status"],"UNKNOWN_PERIOD_GATE")

    def test_negative_ceil_inverse_and_q1_specialcase(self):
        safe,step=p.secondary(1,2,F(9,50),F(1,15),p.Work())
        self.assertLess(step["rawCeilK"],0);self.assertEqual(step["kModQ"],1)
        safe,step=p.secondary(1,1,F(1,15),F(1,15),p.Work())
        self.assertIsNone(step["inverse"]);self.assertEqual(step["ell"],0)

    def test_selector_tie_is_original_label_order(self):
        c=p.derive_certificate(fixture(3));self.assertEqual(c["context"]["selectedExceptionLabel"],9)
        raw=fixture(3);raw["speeds"][-5:]=[22,24,1,23,21]
        c=p.derive_certificate(raw);self.assertEqual(c["context"]["selectedExceptionLabel"],9)

    def test_whole_scaling_normalized_gcd_is_explicit(self):
        raw=fixture(6);raw["speeds"]=[3*v for v in raw["speeds"]];raw["tau"]=["1","30"]
        ctx=p.derive_certificate(raw)["context"]
        self.assertEqual((ctx["g"],ctx["H"],ctx["gPrime"]),(3,3,1));self.assertTrue(all(row[3]==1 for row in ctx["candidateRows"]))

    def test_selected_and_lower_all_adjusted_shifts_safe(self):
        for i in range(6):
            c=p.derive_certificate(fixture(i));eta=F(*map(int,c["context"]["eta"]))
            self.assertTrue(all(len(b)<2 for b in c["adjustedGrid"]["exceptionBadIndices"]))
            self.assertTrue(all(F(*map(int,x))>=eta for x in c["adjustedGrid"]["selectedAllShiftDistances"]))
            for row in c["adjustedGrid"]["distanceMatrix"]:
                self.assertTrue(all(F(*map(int,row[j]))>=eta for j in c["context"]["divisibleIndices"]))

    def test_plain_input_no_extra_fields_or_authority(self):
        for change in ({"verdict":"PASS"},{"tau":("1","10")},{"label":"../x"},{"speeds":tuple(fixture()["speeds"])}):
            raw=fixture();raw.update(change)
            with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_speeds_counts_sign_bool_duplicate_subclasses(self):
        class I(int):pass
        for v in (0,-1,True,I(10),10**12+1):
            raw=fixture();raw["speeds"][0]=v
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        for change in (lambda a:a.pop(),lambda a:a.__setitem__(1,a[0]),lambda a:a.__setitem__(0,11)):
            raw=fixture();change(raw["speeds"])
            with self.assertRaises(p.Refused):p.derive_certificate(raw)

    def test_rational_canonical_and_component_refusals(self):
        for tau in (["2","42"],["+5","21"],["05","21"],["5","0"],["5","-21"],["5","021"],[str(2**256),"1"],["1",str(2**256)]):
            raw=fixture();raw["tau"]=tau
            with self.assertRaises(p.Refused):p.derive_certificate(raw)
        with self.assertRaises(p.Refused):p.Work().q(F(2**256,1))

    def test_lower_witness_is_computed_and_refused(self):
        raw=fixture();raw["tau"]=["1","1000"]
        with self.assertRaisesRegex(p.Refused,"LOWER_WITNESS_REFUSED"):p.derive_certificate(raw)

    def test_resource_caps_and_deadline(self):
        with self.assertRaisesRegex(p.Refused,"RESOURCE_REFUSED"):p.build_fixed_report({"maxMs":5000,"maxOperations":1})
        with patch.object(p,"monotonic",side_effect=[0,6]):
            with self.assertRaisesRegex(p.Refused,"RESOURCE_REFUSED"):p.Work().charge()
        for limits in ({"maxMs":5001,"maxOperations":1},{"maxMs":1,"maxOperations":2000001},{"maxMs":True,"maxOperations":1},{"maxMs":1}):
            with self.assertRaises(p.Refused):p.Work(limits)

    def test_output_preflight_prevents_whole_tree_serialization(self):
        value=["x"*256 for _ in range(40)]
        real_dumps=p.json.dumps
        with patch.object(p.json,"dumps",wraps=real_dumps) as observed:
            with self.assertRaises(p.Refused):p.bounded_json([value]*4,p.Work())
            self.assertTrue(all(type(call.args[0]) not in (dict,list) for call in observed.call_args_list))
        for v in ({1:"x"},float("nan"),"x"*257,[[[[[[[[[[[[[[1]]]]]]]]]]]]]],object()):
            with self.assertRaises(p.Refused):p.bounded_json(v,p.Work())

    def test_scope_and_named_columns_references_are_complete(self):
        r=p.build_fixed_report();self.assertEqual(r["scope"],SCOPE);self.assertEqual(r["candidateColumns"],COLUMNS)
        for c in r["cases"]:
            self.assertEqual(c["scopeRef"],"body.scope");self.assertEqual(c["context"]["candidateColumnsRef"],"body.candidateColumns")
            self.assertEqual(len(c["context"]["candidateRows"]),5)
            self.assertTrue(all(len(row)==len(COLUMNS) for row in c["context"]["candidateRows"]))

    def test_fresh_pinned_child_complete_body_and_caps(self):
        r=launch();self.assertEqual((r.returncode,r.stderr),(0,""));self.assertLessEqual(len(r.stdout.encode()),32768)
        value=json.loads(r.stdout);body={k:v for k,v in value.items() if k not in ("metrics","semanticDigest")}
        self.assertEqual(body,expected_body());self.assertEqual(value["semanticDigest"],sha256(canonical(body)).hexdigest())
        self.assertLess(value["metrics"]["elapsedMs"],5000);self.assertLess(value["metrics"]["chargedOperations"],2000000)

    def test_all_six_flag_faults_no_positive_stdout(self):
        for flag in FLAGS:
            for value in (None,"true","False","0",""):
                env={f:"false" for f in FLAGS}
                if value is None:del env[flag]
                else:env[flag]=value
                r=launch(env=env);self.assertEqual(r.returncode,1);self.assertEqual(r.stdout,"");self.assertEqual(r.stderr,"CLI_REFUSED\n")

    def test_cli_no_options_paths_or_custom_inputs(self):
        for arg in ("--help","/tmp/certificate","PASS"):
            r=launch((arg,));self.assertEqual((r.returncode,r.stdout,r.stderr),(1,"","CLI_REFUSED\n"))
        self.assertEqual(json.loads(launch(stdin="untrusted external verdict").stdout)["semanticDigest"],sha256(canonical(expected_body())).hexdigest())

    def test_source_capability_and_no_q_proportional_enumeration(self):
        tree=ast.parse(SOURCE.read_text());imports=[]
        for node in ast.walk(tree):
            if isinstance(node,ast.Import):imports.extend(a.name for a in node.names)
            elif isinstance(node,ast.ImportFrom):imports.append(node.module)
            if isinstance(node,ast.Call) and isinstance(node.func,ast.Name):
                self.assertNotIn(node.func.id,("open","eval","exec","compile","__import__"))
                if node.func.id=="range":self.assertTrue(all(isinstance(a,ast.Constant) or isinstance(a,ast.Name) and a.id=="n" for a in node.args))
        self.assertEqual(set(imports),{"fractions","functools","hashlib","math","json","os","re","sys","time"})

    def test_boundary_domain_refusals(self):
        for v,g,eta,L,U in [(5,1,F(1,15),F(1,10),45),(1,0,F(1,15),F(1,10),45),
                            (1,1,F(1,10),F(1,10),45),(1,1,F(1,15),F(0),45),(1,1,F(1,15),F(1,10),0)]:
            with self.assertRaises(p.Refused):p.candidate(v,0,g,F(0),eta,L,U,p.Work())


if __name__ == "__main__":
    unittest.main(verbosity=2)
