"""TIP-072R independent exact expectations and inspected-byte child tests.

Run python3 -I -S -B tests/research/test_lrc_clustered_lower.py.
No old mathematics imports or generated artifacts. Matrix success is a local
diagnostic, not the written theorem's proof or agent/runtime attestation.
"""
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
SOURCE = ROOT / "scripts/research/lrc-clustered-lower-replay.py"
SOURCE_SHA256 = "6dbed2c2c18fbceba5436091809a3e1ae2dd372e29fe391072a72db8bdf56536"
spec = importlib.util.spec_from_file_location("tip072r_known_product", SOURCE)
product = importlib.util.module_from_spec(spec)
spec.loader.exec_module(product)
FLAGS = (
    "RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
    "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED",
)
SCOPE = {"localUnsigned": True, "retainedAgentResult": False, "agentLoop": "NOT_RUN",
         "executionAuthority": False, "wholeAllikvereBranch": "NOT_ESTABLISHED",
         "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
         "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
         "genericStrictSlack": False, "ratioConstantIsOptimal": False,
         "writtenTheoremHasSpeedCap": False, "complements072QNotSuperset": True,
         "targets": "13_MOVING_14_TOTAL_AND_14_MOVING_15_TOTAL_ONLY"}
LABELS = ["ratio_equality_low", "ratio_equality_high_right", "variable_lower_same_residue",
          "high_already_orbit_safe", "target14_ratio_and_low_equality", "target14_high_right",
          "unknown_old_progression_ratio9", "unknown_target14_ratio8"]
LOWER14 = [10, 15, 20, 25, 30, 35, 40, 45, 70]
LOWER13 = [95, 100, 105, 110, 115, 120, 125, 585]
LOWERS = [LOWER14, LOWER14, list(range(45, 86, 5)), list(range(50, 91, 5)),
          LOWER13, LOWER13, list(range(5, 46, 5)), list(range(5, 41, 5))]
EXCEPTIONS = [[1, 2, 3, 4, 19], [1, 2, 3, 4, 21], [1001, 1011, 1021, 1031, 1041],
              [1, 2, 3, 7, 201], [1, 2, 3, 4, 171], [1, 2, 3, 4, 172],
              [1, 2, 3, 7, 11], [1, 2, 3, 7, 11]]


def wire(q):
    return [str(q.numerator), str(q.denominator)]


def norm(x):
    floor = x.numerator // x.denominator
    return min(x-floor, floor+1-x)


def fixture(i=0):
    return {"label": LABELS[i], "speeds": list(LOWERS[i])+list(EXCEPTIONS[i])}


def expected_grid(speeds, ex, selected, base, eta):
    matrix = [[norm(v*(base+F(j, 5))) for v in speeds] for j in range(5)]
    bad = [[j for j in range(5) if matrix[j][i] < eta] for i in ex]
    good = [j for j in range(5) if all(q >= eta for q in matrix[j])]
    witness = None
    if good:
        j = min(good)
        witness = {"lowestPhysicalShift": j, "finalTime": wire(base+F(j, 5)),
                   "coordinateDistances": [wire(q) for q in matrix[j]],
                   "minimumDistance": wire(min(matrix[j]))}
    return {"baseTime": wire(base), "distanceMatrix": [[wire(q) for q in row] for row in matrix],
            "exceptionBadIndices": bad, "exceptionBadUnion": sorted(set().union(*map(set, bad))),
            "selectedAllShiftDistances": [wire(matrix[j][selected]) for j in range(5)],
            "goodShiftIndices": good, "observedWitness": witness}


def expected(raw):
    speeds = list(raw["speeds"])
    n = len(speeds)
    lo = [i for i, v in enumerate(speeds) if not v % 5]
    ex = [i for i, v in enumerate(speeds) if v % 5]
    m, U = min(speeds[i] for i in lo), max(speeds[i] for i in lo)
    selected = max(ex, key=lambda i: speeds[i])
    V, eta = speeds[selected], F(1, n+1)
    B, C = F((n-4)*m, 5), F(n*(n-4), n+6)
    left, right = F(1, (n+1)*m), F(n, (n+1)*U)
    W = right-left
    H = F(2*m*U, n*m-U) if W > 0 else None
    premise = F(U, m) <= C
    phase, beta = 5*V*left, norm(5*V*left)
    floor = phase.numerator // phase.denominator
    nearest = min([floor, floor+1], key=lambda h: (abs(phase-h), h))
    boundary, safe = None, left
    if beta < 5*eta:
        # Independently enumerate neighboring right component edges. Do not
        # reuse product's nearest-center formula to choose the actual endpoint.
        edges = [(F(h)+5*eta)/(5*V) for h in range(floor-1, floor+3)]
        boundary = min(t for t in edges if t >= left)
        safe = boundary
    branch, adjustment, adjusted_base = "UNKNOWN", None, None
    if premise:
        if V <= B:
            branch, adjustment = "LOW_ALL_NONZERO_SHIFTS", F(0)
        else:
            branch, adjustment, adjusted_base = "HIGH_ORBIT_SAFE", safe-left, safe
    original = expected_grid(speeds, ex, selected, left, eta)
    adjusted = expected_grid(speeds, ex, selected, safe, eta) if branch == "HIGH_ORBIT_SAFE" else None
    final = (adjusted or original)["observedWitness"] if premise else None
    ctx = {"movingCount": n, "totalCount": n+1, "d": 5, "exceptionCount": 5,
           "speeds": speeds, "coordinateLabels": list(range(n)), "divisibleIndices": lo,
           "exceptionIndices": ex, "integerGcd": reduce(gcd, speeds), "eta": wire(eta),
           "m": m, "U": U, "V": V, "B": wire(B), "C": wire(C), "actualRatio": wire(F(U, m)),
           "ratioPremise": premise, "t0": wire(left), "intervalLeft": wire(left),
           "intervalRight": wire(right), "intervalWidth": wire(W),
           "exactHighThreshold": wire(H) if H is not None else None,
           "tailOverlapsLow": H is not None and H <= B,
           "uncoveredGapOpen": [wire(B), wire(H)] if H is not None and H > B else None,
           "selectedExceptionLabel": selected, "orbitPhase": wire(phase), "orbitBeta": wire(beta),
           "nearestInteger": nearest, "rightBoundary": wire(boundary) if boundary is not None else None,
           "branch": branch, "actualAdjustment": wire(adjustment) if adjustment is not None else None,
           "adjustedBase": wire(adjusted_base) if adjusted_base is not None else None}
    return {"label": raw["label"], "status": "CHECKED_CLUSTERED_LOWER_WITNESS" if premise else "UNKNOWN_RATIO_NOT_APPLICABLE",
            "context": ctx, "originalGrid": original, "adjustedGrid": adjusted,
            "finalWitness": final, "scope": dict(SCOPE)}


def expected_body():
    return {"version": "LRC_CLUSTERED_LOWER_V1", "cases": [expected(fixture(i)) for i in range(8)],
            "scope": dict(SCOPE), "counts": {"cases": 8, "accepted": 6, "lowBranch": 2,
            "highBranch": 4, "unknownRatio": 2, "originalMatrices": 8, "adjustedMatrices": 4,
            "retainedMatrixCoordinates": 820}}


def canonical(body):
    return json.dumps(body, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False).encode("ascii")


def launch(args=(), env=None, stdin=""):
    data = SOURCE.read_bytes()
    if sha256(data).hexdigest() != SOURCE_SHA256:
        raise AssertionError("Source pin changed before launch")
    code = "exec(compile("+repr(data)+", "+repr(str(SOURCE))+", 'exec'), {'__name__':'__main__'})"
    result = subprocess.run([sys.executable, "-I", "-S", "-B", "-c", code, *args],
                            input=stdin, capture_output=True, text=True, timeout=5,
                            env={flag: "false" for flag in FLAGS} if env is None else env,
                            shell=False)
    if SOURCE.read_bytes() != data:
        raise AssertionError("Source pin changed after launch")
    return result


class ExactTests(unittest.TestCase):
    def test_all_eight_contexts_matrices_and_witnesses(self):
        coords = 0
        for i in range(8):
            with self.subTest(case=i):
                actual = product.derive_certificate(fixture(i))
                self.assertEqual(actual, expected(fixture(i)))
                for name in ("originalGrid", "adjustedGrid"):
                    if actual[name] is not None:
                        coords += sum(map(len, actual[name]["distanceMatrix"]))
        self.assertEqual(coords, 820)

    def test_frozen_actual_inputs(self):
        self.assertEqual(product.fixed_inputs(), [fixture(i) for i in range(8)])

    def test_low_all_four_nonzero_shifts_with_target_equalities(self):
        for i, eta in ((0, F(1, 15)), (4, F(1, 14))):
            c = product.derive_certificate(fixture(i))
            self.assertEqual(c["originalGrid"]["goodShiftIndices"], [1, 2, 3, 4])
            self.assertIsNone(c["adjustedGrid"])
            self.assertEqual(c["context"]["actualAdjustment"], ["0", "1"])
            self.assertEqual(c["finalWitness"]["minimumDistance"], wire(eta))

    def test_ratio_width_and_threshold_equalities(self):
        for i in (0, 4):
            ctx = product.derive_certificate(fixture(i))["context"]
            self.assertEqual(ctx["actualRatio"], ctx["C"])
            self.assertEqual(ctx["exactHighThreshold"], ctx["B"])
        ctx = product.derive_certificate(fixture(4))["context"]
        self.assertEqual(ctx["B"], wire(F(171)))
        self.assertEqual(ctx["V"], 171)
        self.assertEqual(ctx["intervalWidth"], wire(F(1, 1197)))
        self.assertEqual(ctx["orbitBeta"], wire(F(5, 14)))
        self.assertIsNone(ctx["rightBoundary"])
        # n14 analytic equality V=B=2m is non-unit and not a real fixture.
        self.assertEqual(F(2, 15)/20, F(1, 150))
        self.assertEqual(20 % 5, 0)

    def test_two_targets_not_interchangeable(self):
        for i, moving, eta, C, B in [(0, 14, F(1, 15), F(7), F(20)),
                                     (4, 13, F(1, 14), F(117, 19), F(171))]:
            ctx = product.derive_certificate(fixture(i))["context"]
            self.assertEqual((ctx["movingCount"], ctx["totalCount"]), (moving, moving+1))
            for key, q in (("eta", eta), ("C", C), ("B", B)):
                self.assertEqual(ctx[key], wire(q))

    def test_high_right_endpoints_and_final_witnesses(self):
        rows = [(1, F(4, 315), F(67, 315), F(1, 9), 1),
                (2, F(5, 3123), F(5, 3123), F(25, 347), 0),
                (3, F(1, 750), F(151, 750), F(1, 15), 1),
                (5, F(19, 12040), F(2427, 12040), F(185, 2408), 1)]
        for i, base, time, minimum, j in rows:
            ctx = product.derive_certificate(fixture(i))
            self.assertEqual(ctx["context"]["adjustedBase"], wire(base))
            self.assertEqual(ctx["finalWitness"]["finalTime"], wire(time))
            self.assertEqual(ctx["finalWitness"]["minimumDistance"], wire(minimum))
            self.assertEqual(ctx["finalWitness"]["lowestPhysicalShift"], j)

    def test_already_safe_is_unchanged(self):
        c = product.derive_certificate(fixture(3))
        self.assertIsNone(c["context"]["rightBoundary"])
        self.assertEqual(c["context"]["actualAdjustment"], ["0", "1"])
        self.assertEqual(c["originalGrid"], c["adjustedGrid"])

    def test_same_exception_residue_does_not_require_pair(self):
        c = product.derive_certificate(fixture(2))
        self.assertEqual(set(v % 5 for v in EXCEPTIONS[2]), {1})
        self.assertFalse(any(a == 2*b for a in EXCEPTIONS[2] for b in EXCEPTIONS[2]))
        self.assertEqual(c["context"]["actualRatio"], wire(F(17, 9)))
        self.assertIsNotNone(c["finalWitness"])

    def test_every_selected_high_shift_and_preserved_lower(self):
        for i in (1, 2, 3, 5):
            c = product.derive_certificate(fixture(i))
            ctx, grid = c["context"], c["adjustedGrid"]
            eta = F(*map(int, ctx["eta"]))
            self.assertEqual(grid["exceptionBadIndices"][ctx["exceptionIndices"].index(ctx["selectedExceptionLabel"])], [])
            self.assertTrue(all(len(bad) <= 1 for bad in grid["exceptionBadIndices"]))
            self.assertTrue(all(F(*map(int, q)) >= eta for q in grid["selectedAllShiftDistances"]))
            for row in grid["distanceMatrix"]:
                self.assertTrue(all(F(*map(int, row[j])) >= eta for j in ctx["divisibleIndices"]))

    def test_unknown_keeps_original_observation_but_no_admission(self):
        for i in (6, 7):
            c = product.derive_certificate(fixture(i))
            self.assertEqual(c["status"], "UNKNOWN_RATIO_NOT_APPLICABLE")
            self.assertFalse(c["context"]["ratioPremise"])
            self.assertFalse(c["context"]["tailOverlapsLow"])
            self.assertIsNotNone(c["context"]["uncoveredGapOpen"])
            self.assertIsNotNone(c["originalGrid"]["observedWitness"])
            self.assertIsNone(c["finalWitness"])
            self.assertIsNone(c["adjustedGrid"])
            self.assertIsNone(c["context"]["actualAdjustment"])

    def test_above_constant_gap_is_not_counterexample(self):
        raw = {"label": "above_constant", "speeds": [10,15,20,25,30,35,40,45,75,1,2,3,4,21]}
        c = product.derive_certificate(raw)
        self.assertEqual(c, expected(raw))
        self.assertEqual(c["status"], "UNKNOWN_RATIO_NOT_APPLICABLE")
        self.assertEqual(c["context"]["uncoveredGapOpen"], [wire(F(20)), wire(F(300,13))])
        self.assertEqual(c["originalGrid"]["observedWitness"]["finalTime"], wire(F(31,150)))

    def test_zero_or_negative_interval_has_no_tail_threshold(self):
        for U in (140, 145):
            raw = fixture(0)
            raw["speeds"][8] = U
            c = product.derive_certificate(raw)
            self.assertEqual(c, expected(raw))
            self.assertIsNone(c["context"]["exactHighThreshold"])
            self.assertIsNone(c["context"]["uncoveredGapOpen"])

    def test_genuinely_hostile_original_five_shift_cover(self):
        raw = {"label": "hostile", "speeds": [500,550,700,900,1300,1700,2100,2500,3500,
                                               1501,3001,4501,6001,7501]}
        c = product.derive_certificate(raw)
        self.assertEqual(c, expected(raw))
        self.assertEqual(c["originalGrid"]["goodShiftIndices"], [])
        self.assertEqual(c["originalGrid"]["exceptionBadUnion"], [0,1,2,3,4])
        self.assertEqual(c["context"]["adjustedBase"], wire(F(16,112515)))
        self.assertEqual(c["adjustedGrid"]["goodShiftIndices"], [0])
        self.assertEqual(c["finalWitness"]["minimumDistance"], wire(F(1,15)))

    def test_nonprimitive_scaling_and_reordered_labels(self):
        raw = fixture(1)
        raw["speeds"] = [2*v for v in reversed(raw["speeds"])]
        c = product.derive_certificate(raw)
        self.assertEqual(c, expected(raw))
        self.assertEqual(c["context"]["integerGcd"], 2)
        self.assertEqual(c["context"]["coordinateLabels"], list(range(14)))

    def test_whole_body_digest_and_caps(self):
        report = product.build_fixed_report()
        body = {k:v for k,v in report.items() if k not in ("metrics", "semanticDigest")}
        self.assertEqual(body, expected_body())
        self.assertEqual(report["semanticDigest"], sha256(canonical(expected_body())).hexdigest())
        self.assertEqual(report["semanticDigest"], "36c4b1e6579e222abc4924a0cd243ef83d8530564345d1d160d6f69a4e07401f")
        self.assertLess(len(canonical(report))+1, 32768)
        self.assertLess(report["metrics"]["chargedOperations"], 2000000)


class GeometryTests(unittest.TestCase):
    def test_center_tie_right_both_signed_bases(self):
        for star in (F(2,35), F(-2,35), F(0)):
            out = product.right_safe(7, star, F(1,15), product.Work())
            self.assertEqual(out[4], star+F(1,105))
            self.assertEqual(out[5], F(1,105))

    def test_positive_and_negative_offsets_always_go_right(self):
        for delta in (F(1,10), F(-1,10)):
            star = (F(2)+delta)/35
            out = product.right_safe(7, star, F(1,15), product.Work())
            self.assertEqual(out[4], F(1,15))
            self.assertGreater(out[5], 0)
            self.assertEqual(out[5], (F(1,3)-delta)/35)

    def test_open_component_endpoints_equality_safe(self):
        for eta in (F(1,15), F(1,14)):
            for sign in (-1,1):
                star = (F(2)+sign*5*eta)/35
                out = product.right_safe(7, star, eta, product.Work())
                self.assertIsNone(out[3])
                self.assertEqual(out[4], star)
                self.assertEqual(out[5], 0)

    def test_generic_ratio_constants_and_overlap_identity(self):
        for n,d in ((14,5),(13,5),(9,3),(8,2)):
            eta=F(1,n+1); C=F(n*(n+1-d),n+1+d); m=F(10); U=C*m
            B=(F(1,d)-eta)*m/eta
            W=(1-eta)/U-eta/m
            self.assertGreater(W, 0)
            self.assertEqual(W, 2*eta/B)
            self.assertLess(C, (1-eta)/eta)


class HostileTests(unittest.TestCase):
    def assert_refused(self, raw):
        with self.assertRaises(product.Refused):
            product.derive_certificate(raw)

    def test_count_positive_duplicate_boolean_and_numeric_types(self):
        for value in (0,-1,True,1.0,"1",10**12+1):
            raw=fixture();raw["speeds"][0]=value
            self.assert_refused(raw)
        for speeds in ([],fixture()["speeds"][:-2],fixture()["speeds"]+[22]):
            self.assert_refused({"label":"bad", "speeds":speeds})
        raw=fixture();raw["speeds"][1]=raw["speeds"][0]
        self.assert_refused(raw)

    def test_plain_container_and_primitive_subclasses_no_hooks(self):
        class ExplosiveDict(dict):
            def __getitem__(self, k): raise AssertionError("Hook executed")
        class ExplosiveList(list):
            def __iter__(self): raise AssertionError("Hook executed")
        class IntSubclass(int): pass
        class StrSubclass(str): pass
        self.assert_refused(ExplosiveDict(fixture()))
        raw=fixture();raw["speeds"]=ExplosiveList(raw["speeds"]);self.assert_refused(raw)
        raw=fixture();raw["speeds"][0]=IntSubclass(10);self.assert_refused(raw)
        raw=fixture();raw["label"]=StrSubclass("fixture");self.assert_refused(raw)
        raw=fixture();raw["speeds"]=tuple(raw["speeds"]);self.assert_refused(raw)

    def test_input_keys_and_labels_and_forbidden_caller_evidence(self):
        for key in ("tau", "witness", "verdict", "certificate", "path"):
            raw=fixture();raw[key]=True;self.assert_refused(raw)
        for label in ("", "a"*81, "../path", "a b", 7, None):
            raw=fixture();raw["label"]=label;self.assert_refused(raw)
        self.assert_refused({"speeds":fixture()["speeds"]})

    def test_wrong_divisibility_counts_and_nonunit_selected(self):
        raw=fixture();raw["speeds"][0]=11;self.assert_refused(raw)
        raw=fixture();raw["speeds"][-1]=20;self.assert_refused(raw)
        for v in (0,5,True,7.0,10**12+1):
            with self.assertRaises(product.Refused):
                product.right_safe(v,F(1,150),F(1,15),product.Work())

    def test_invalid_limits_and_complete_shared_exhaustion(self):
        values=[{}, {"maxMs":5001,"maxOperations":2_000_000},
                {"maxMs":5000,"maxOperations":2_000_001},
                {"maxMs":True,"maxOperations":1}, {"maxMs":0,"maxOperations":1},
                {"maxMs":5.0,"maxOperations":1}]
        for limits in values:
            with self.assertRaises(product.Refused): product.build_fixed_report(limits)
        with self.assertRaisesRegex(product.Refused,"RESOURCE_REFUSED"):
            product.build_fixed_report({"maxMs":5000,"maxOperations":40_000})

    def test_clock_component_and_fraction_subclass_limits(self):
        work=product.Work();work.deadline=0
        with self.assertRaisesRegex(product.Refused,"RESOURCE_REFUSED"): work.charge()
        for value in (2**256,F(1,2**256),True,1.0):
            with self.assertRaises(product.Refused):product.Work().q(value)
        class FractionSubclass(F): pass
        with self.assertRaises(product.Refused):product.Work().q(FractionSubclass(1,2))

    def test_output_limits_and_reservation_before_tree_serialization(self):
        nested=0
        for _ in range(14):nested=[nested]
        for value in ([0]*41, {str(i):i for i in range(41)}, "x"*257, float("nan"),
                      float("inf"), 2**256, nested, object()):
            with self.assertRaises(product.Refused):product.bounded_json(value,product.Work())
        huge=[["x"*256 for _ in range(40)] for _ in range(4)]
        calls=[];dumps=json.dumps
        def spy(value,**kwargs):
            calls.append(type(value));return dumps(value,**kwargs)
        with patch.object(product.json,"dumps",spy):
            with self.assertRaisesRegex(product.Refused,"OUTPUT_REFUSED"):
                product.bounded_json(huge,product.Work())
        self.assertNotIn(list,calls)
        self.assertNotIn(dict,calls)
        for value in ({"a":[None,True,False,7,1.25,"é"]}, []):
            self.assertEqual(product.bounded_json(value,product.Work()),canonical(value).decode("ascii"))


class ActualChildTests(unittest.TestCase):
    def test_fresh_inspected_bytes_child_complete_canonical_body(self):
        result=launch()
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual(result.stderr,"")
        self.assertLess(len(result.stdout.encode("ascii")),32768)
        report=json.loads(result.stdout)
        body={k:v for k,v in report.items() if k not in ("metrics","semanticDigest")}
        self.assertEqual(body,expected_body())
        self.assertEqual(report["semanticDigest"],sha256(canonical(body)).hexdigest())
        self.assertGreater(report["metrics"]["chargedOperations"],0)
        self.assertLess(report["metrics"]["chargedOperations"],2_000_000)

    def test_each_flag_absent_true_or_malformed_refuses_no_json(self):
        for flag in FLAGS:
            for bad in (None,"true","False","0",""):
                env={key:"false" for key in FLAGS}
                if bad is None:del env[flag]
                else:env[flag]=bad
                with self.subTest(flag=flag,value=bad):
                    result=launch(env=env)
                    self.assertNotEqual(result.returncode,0)
                    self.assertEqual(result.stdout,"")
                    self.assertEqual(result.stderr,"CLI_REFUSED\n")

    def test_cli_paths_options_custom_inputs_refused(self):
        for args in (("--help",),("/tmp/certificate.json",),("{}",)):
            result=launch(args=args)
            self.assertNotEqual(result.returncode,0)
            self.assertEqual(result.stdout,"")
            self.assertEqual(result.stderr,"CLI_REFUSED\n")

    def test_source_ast_capabilities_bounded_and_no_old_imports(self):
        tree=ast.parse(SOURCE.read_text())
        allowed={"fractions","functools","hashlib","math","json","os","re","sys","time"}
        for node in ast.walk(tree):
            if isinstance(node,(ast.Import,ast.ImportFrom)):
                names=[node.module] if isinstance(node,ast.ImportFrom) else [a.name for a in node.names]
                self.assertTrue(set(names)<=allowed)
            if isinstance(node,ast.Call) and isinstance(node.func,ast.Name):
                self.assertNotIn(node.func.id,{"open","eval","exec","compile","__import__"})
        envcalls=[node for node in ast.walk(tree) if isinstance(node,ast.Attribute)
                  and isinstance(node.value,ast.Name) and node.value.id=="os"]
        self.assertEqual([node.attr for node in envcalls],["environ"])
        self.assertEqual(SOURCE_SHA256,sha256(SOURCE.read_bytes()).hexdigest())


if __name__ == "__main__":
    unittest.main()
