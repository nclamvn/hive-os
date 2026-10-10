"""TIP-072Q independent whole-body Fraction expectations and isolated real CLI.

Run python3 -I -S -B tests/research/test_lrc_orbit_safe_speed.py.
No old math imports, no generated files, no cache writes.
"""
from fractions import Fraction as F
from functools import reduce
from hashlib import sha256
from math import gcd
from pathlib import Path
from unittest.mock import patch
import importlib.util
import json
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "scripts/research/lrc-orbit-safe-speed-replay.py"
SOURCE_SHA256 = "2759d8b9f000de85691b5d82fced54a0e2d435b97336feb045171666991e2633"
spec = importlib.util.spec_from_file_location("tip072q_known_product", SOURCE)
product = importlib.util.module_from_spec(spec)
spec.loader.exec_module(product)
FLAGS = (
    "RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
    "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED",
)
ROWS = [[1, 2, 3, 7, 91], [1001, 1011, 1021, 1031, 1041], [1, 2, 3, 7, 89],
        [1, 2, 3, 7, 104], [1, 2, 3, 7, 99], [1, 2, 3, 7, 11],
        [73, 78, 83, 88, 93], [1, 2, 3, 7, 11]]
LABELS = ["high_mixed", "hostile_same_residue_cluster", "below_dominance_phase_success",
          "already_orbit_safe", "negative_adjustment", "unknown15_observed_witness",
          "target14_same_residue_cluster", "unknown14_observations"]
SCOPE = {"localUnsigned": True, "retainedAgentResult": False, "agentLoop": "NOT_RUN",
         "executionAuthority": False, "wholeAllikvereBranch": "NOT_ESTABLISHED",
         "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
         "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
         "boundedRatioCoreIsFinite": False, "genericStrictSlack": False,
         "targets": "13_MOVING_14_TOTAL_AND_14_MOVING_15_TOTAL_ONLY"}


def wire(q):
    return [str(q.numerator), str(q.denominator)]


def norm(x):
    n = x.numerator // x.denominator
    return min(x-n, n+1-x)


def fixture(i=0):
    return {"label": LABELS[i], "speeds": list(range(5, 46 if i < 6 else 41, 5))+ROWS[i],
            "tau": ["1", "10" if i < 6 else "9"]}


def expected_grid(speeds, exceptions, selected, t, eta):
    matrix = [[norm(v*(t+F(j, 5))) for v in speeds] for j in range(5)]
    bad = [[j for j in range(5) if matrix[j][i] < eta] for i in exceptions]
    good = [j for j in range(5) if all(q >= eta for q in matrix[j])]
    witness = None
    if good:
        j = min(good)
        witness = {"lowestPhysicalShift": j, "finalTime": wire(t+F(j, 5)),
                   "coordinateDistances": [wire(q) for q in matrix[j]],
                   "minimumDistance": wire(min(matrix[j]))}
    return {"baseTime": wire(t), "distanceMatrix": [[wire(q) for q in row] for row in matrix],
            "exceptionBadIndices": bad, "exceptionBadUnion": sorted(set().union(*map(set, bad))),
            "selectedAllShiftDistances": [wire(matrix[j][selected]) for j in range(5)],
            "goodShiftIndices": good, "observedWitness": witness}


def expected(raw):
    speeds = raw["speeds"]
    count = len(speeds)
    lower = [i for i, v in enumerate(speeds) if not v % 5]
    ex = [i for i, v in enumerate(speeds) if v % 5]
    reduced = [speeds[i]//5 for i in lower]
    tau = F(int(raw["tau"][0]), int(raw["tau"][1]))
    star, eta, L = tau/5, F(1, count+1), F(1, count-4)
    U = max(speeds[i] for i in lower)
    selected = max(ex, key=lambda i: speeds[i])
    V, radius = speeds[selected], (L-eta)/U
    phase, beta = 5*V*star, norm(5*V*star)
    lo = phase.numerator // phase.denominator
    nearest = min([lo, lo+1], key=lambda n: (abs(n-phase), n))
    # Independently enumerate neighboring component edges, choose by distance
    # then actual time. No product's offset/sign branch is reused.
    safe, boundary = star, None
    if beta < 5*eta:
        edges = [(F(n)+sign*5*eta)/(5*V) for n in range(lo-1, lo+3) for sign in (-1, 1)]
        boundary = min(edges, key=lambda t: (abs(t-star), t))
        safe = boundary
    adjustment, safe_distance = safe-star, abs(safe-star)
    phase_gate = safe_distance <= radius
    lower_d = [norm(tau*v) for v in reduced]
    ctx = {"movingCount": count, "totalCount": count+1, "d": 5, "exceptionCount": 5,
           "speeds": speeds, "coordinateLabels": list(range(count)), "divisibleIndices": lower,
           "exceptionIndices": ex, "reducedSpeeds": reduced, "integerGcd": reduce(gcd, speeds),
           "tau": wire(tau), "lowerDistances": [wire(q) for q in lower_d],
           "lowerWitnessMargin": wire(min(lower_d)), "L": wire(L), "eta": wire(eta),
           "U": U, "V": V, "selectedExceptionLabel": selected, "tStar": wire(star),
           "radius": wire(radius), "speedOnlyRatioThreshold": wire(eta/(L-eta)),
           "orbitPhase": wire(phase), "orbitBeta": wire(beta), "nearestInteger": nearest,
           "nearestBoundary": wire(boundary) if boundary is not None else None,
           "nearestSafeBase": wire(safe), "candidateAdjustment": wire(adjustment),
           "nearestSafeDistance": wire(safe_distance), "initiallyOrbitSafe": beta >= 5*eta,
           "speedGateHolds": V*radius >= eta, "phaseGateHolds": phase_gate,
           "adjustedBase": wire(safe) if phase_gate else None,
           "actualAdjustment": wire(adjustment) if phase_gate else None}
    return {"label": raw["label"], "status": "CHECKED_ORBIT_SAFE_WITNESS" if phase_gate else "UNKNOWN_GATE_NOT_APPLICABLE",
            "context": ctx, "originalGrid": expected_grid(speeds, ex, selected, star, eta),
            "adjustedGrid": expected_grid(speeds, ex, selected, safe, eta) if phase_gate else None,
            "scope": dict(SCOPE)}


def expected_body():
    return {"version": "LRC_ORBIT_SAFE_SPEED_V1", "cases": [expected(fixture(i)) for i in range(8)],
            "scope": dict(SCOPE), "counts": {"cases": 8, "phaseGateAccepted": 6, "unknownGate": 2,
            "originalMatrices": 8, "adjustedMatrices": 6, "retainedMatrixCoordinates": 965}}


def canonical(body):
    return json.dumps(body, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False).encode("ascii")


class ArithmeticTests(unittest.TestCase):
    def test_all_eight_complete_certificates_independently(self):
        coords = 0
        for i in range(8):
            with self.subTest(i=i):
                actual = product.derive_certificate(fixture(i))
                self.assertEqual(actual, expected(fixture(i)))
                for name in ("originalGrid", "adjustedGrid"):
                    if actual[name] is not None:
                        coords += sum(map(len, actual[name]["distanceMatrix"]))
        self.assertEqual(coords, 965)

    def test_actual_fixed_inputs_exactly_sealed(self):
        self.assertEqual(product.fixed_inputs(), [fixture(i) for i in range(8)])

    def test_targets_are_distinct(self):
        for i, moving, eta, L, radius, ratio in [(0, 14, F(1, 15), F(1, 10), F(1, 1350), F(2)),
                                                 (6, 13, F(1, 14), F(1, 9), F(1, 1008), F(9, 5))]:
            ctx = product.derive_certificate(fixture(i))["context"]
            self.assertEqual(ctx["movingCount"], moving)
            self.assertEqual(ctx["totalCount"], moving+1)
            for key, q in [("eta", eta), ("L", L), ("radius", radius), ("speedOnlyRatioThreshold", ratio)]:
                self.assertEqual(ctx[key], wire(q))

    def test_fixed_final_witnesses(self):
        cases = [(0, F(43, 195), F(1, 15)), (1, F(3436, 15615), F(1, 15)),
                 (2, F(293, 1335), F(26, 267)), (3, F(11, 50), F(1, 10)),
                 (4, F(326, 1485), F(29, 297)), (6, F(1447, 6510), F(71, 651))]
        for i, time, minimum in cases:
            w = product.derive_certificate(fixture(i))["adjustedGrid"]["observedWitness"]
            self.assertEqual(w["lowestPhysicalShift"], 1)
            self.assertEqual(w["finalTime"], wire(time))
            self.assertEqual(w["minimumDistance"], wire(minimum))

    def test_hostile_grid_no_witness_but_adjustment_succeeds(self):
        c = product.derive_certificate(fixture(1))
        self.assertEqual(c["originalGrid"]["goodShiftIndices"], [])
        self.assertIsNone(c["originalGrid"]["observedWitness"])
        self.assertTrue(c["adjustedGrid"]["goodShiftIndices"])
        self.assertEqual(c["context"]["nearestSafeBase"], wire(F(313, 15615)))

    def test_below_speed_dominance_success(self):
        ctx = product.derive_certificate(fixture(2))["context"]
        self.assertFalse(ctx["speedGateHolds"])
        self.assertTrue(ctx["phaseGateHolds"])
        self.assertEqual(ctx["V"], 89)

    def test_already_safe_no_adjustment(self):
        c = product.derive_certificate(fixture(3))
        self.assertTrue(c["context"]["initiallyOrbitSafe"])
        self.assertIsNone(c["context"]["nearestBoundary"])
        self.assertEqual(c["context"]["actualAdjustment"], ["0", "1"])
        self.assertEqual(c["originalGrid"], c["adjustedGrid"])

    def test_positive_negative_adjustments(self):
        for i, q in [(0, F(1, 1950)), (2, F(-7, 13350)), (4, F(-7, 14850)), (6, F(1, 19530))]:
            self.assertEqual(product.derive_certificate(fixture(i))["context"]["actualAdjustment"], wire(q))

    def test_unknown_retains_observed_original_witness_both_targets(self):
        for i in (5, 7):
            c = product.derive_certificate(fixture(i))
            self.assertEqual(c["status"], "UNKNOWN_GATE_NOT_APPLICABLE")
            self.assertIsNone(c["adjustedGrid"])
            self.assertIsNone(c["context"]["actualAdjustment"])
            self.assertGreater(F(*map(int, c["context"]["nearestSafeDistance"])), F(*map(int, c["context"]["radius"])))
            self.assertEqual(c["originalGrid"]["goodShiftIndices"], [1, 3])
            self.assertIsNotNone(c["originalGrid"]["observedWitness"])

    def test_selected_exception_safe_every_shift_and_other_bad_counts(self):
        for i in (0, 1, 2, 3, 4, 6):
            c = product.derive_certificate(fixture(i))
            g, ctx = c["adjustedGrid"], c["context"]
            eta = F(*map(int, ctx["eta"]))
            self.assertTrue(all(F(*map(int, q)) >= eta for q in g["selectedAllShiftDistances"]))
            self.assertTrue(all(len(row) <= 1 for row in g["exceptionBadIndices"]))
            self.assertEqual(g["exceptionBadIndices"][ctx["exceptionIndices"].index(ctx["selectedExceptionLabel"])], [])

    def test_all_lower_coordinates_preserved_at_every_shift(self):
        for i in (0, 1, 2, 3, 4, 6):
            c = product.derive_certificate(fixture(i))
            eta = F(*map(int, c["context"]["eta"]))
            for row in c["adjustedGrid"]["distanceMatrix"]:
                self.assertTrue(all(F(*map(int, row[k])) >= eta for k in c["context"]["divisibleIndices"]))

    def test_nonprimitive_actual_tuple(self):
        raw = fixture()
        raw["speeds"] = [2*v for v in raw["speeds"]]
        raw["tau"] = ["1", "20"]
        c = product.derive_certificate(raw)
        self.assertEqual(c, expected(raw))
        self.assertEqual(c["context"]["integerGcd"], 2)

    def test_reordered_coordinates_actual_labels(self):
        raw = fixture(1)
        raw["speeds"] = raw["speeds"][9:]+raw["speeds"][:9]
        self.assertEqual(product.derive_certificate(raw), expected(raw))

    def test_whole_body_and_digest_no_matrix_omission(self):
        report = product.build_fixed_report()
        body = {k: v for k, v in report.items() if k not in ("metrics", "semanticDigest")}
        self.assertEqual(body, expected_body())
        self.assertEqual(report["semanticDigest"], sha256(canonical(expected_body())).hexdigest())
        self.assertEqual(report["semanticDigest"], "83cd69ab1d18c09d51c47b93e947fe607ff05eba135436a27beedd1cf93340e3")
        self.assertLess(len(canonical(report))+1, 32768)
        self.assertLess(report["metrics"]["chargedOperations"], 2000000)


class GeometryTests(unittest.TestCase):
    def test_center_tie_lower_boundary_positive_and_negative(self):
        for star in (F(2, 35), F(-2, 35), F(0)):
            out = product.nearest_safe(7, star, F(1, 15), product.Work())
            self.assertEqual(out[4], star-F(1, 105))
            self.assertEqual(out[5], F(-1, 105))
            self.assertEqual(out[6], F(1, 105))

    def test_closed_endpoint_is_safe_no_adjustment(self):
        for eta in (F(1, 15), F(1, 14)):
            for sign in (-1, 1):
                star = sign*eta/7
                out = product.nearest_safe(7, star, eta, product.Work())
                self.assertEqual(out[4], star)
                self.assertEqual(out[5], 0)
                self.assertIsNone(out[3])
                self.assertEqual(min(norm(7*(star+F(j, 5))) for j in range(5)), eta)

    def test_exact_orbit_identity_finite_calibration_not_proof(self):
        count = 0
        for v in (1, 2, 3, 4, 7, 11, 1041):
            for n in range(-20, 21):
                t = F(n, 137)
                self.assertEqual(min(norm(v*(t+F(j, 5))) for j in range(5)), norm(5*v*t)/5)
                count += 1
        self.assertEqual(count, 287)

    def test_arbitrary_interval_radius_gate_sharp_not_global_failure(self):
        eta, v = F(1, 15), 7
        radius = eta/v
        out = product.nearest_safe(v, F(0), eta, product.Work())
        self.assertEqual(out[6], radius)
        self.assertEqual(norm(5*v*(-radius)), 5*eta)
        smaller = radius/2
        self.assertGreater(out[6], smaller)
        self.assertTrue(all(norm(5*v*t) < 5*eta for t in (-smaller, F(0), smaller)))

    def test_geometry_invalid_unit_or_target_refused(self):
        for v, eta in [(5, F(1, 15)), (0, F(1, 15)), (True, F(1, 15)), (7, F(0)), (7, F(1, 10))]:
            with self.assertRaises(product.Refused):
                product.nearest_safe(v, F(0), eta, product.Work())


class RefusalTests(unittest.TestCase):
    def reject(self, raw):
        with self.assertRaises(product.Refused):
            product.derive_certificate(raw)

    def test_dictionary_shape_and_label(self):
        for raw in (None, [], {**fixture(), "verdict": "PASS"}, {"speeds": fixture()["speeds"], "tau": ["1", "10"]},
                    {**fixture(), "label": "bad/path"}, {**fixture(), "label": "x"*81}):
            self.reject(raw)

    def test_actual_speed_types_bounds_duplicates(self):
        for value in (True, 1.0, "1", 0, -1, 10**12+1, None):
            raw = fixture(); raw["speeds"][9] = value; self.reject(raw)
        raw = fixture(); raw["speeds"][9] = raw["speeds"][10]; self.reject(raw)

    def test_moving_counts_and_divisibility_stratum(self):
        for n in (0, 12, 15):
            raw = fixture(); raw["speeds"] = list(range(1, n+1)); self.reject(raw)
        raw = fixture(); raw["speeds"][9] = 50; self.reject(raw)
        raw = fixture(); raw["speeds"][0] = 6; self.reject(raw)

    def test_canonical_rational_strings(self):
        for tau in (["2", "20"], ["01", "10"], ["+1", "10"], ["-0", "1"], ["1", "0"],
                    [1, "10"], ["1", "-10"], ["1", "10", "0"], "1/10"):
            self.reject({**fixture(), "tau": tau})

    def test_false_lower_witness_refused(self):
        for tau in (["0", "1"], ["1", "1000"], ["1", "9"]):
            self.reject({**fixture(), "tau": tau})

    def test_component_limit_input_and_intermediate(self):
        self.reject({**fixture(), "tau": [str(2**256), "1"]})
        self.reject({**fixture(), "tau": ["1", str(2**256)]})
        with self.assertRaisesRegex(product.Refused, "COMPONENT_REFUSED"):
            product.Work().q(F(2**256))
        # Canonical 256-bit numerator is admitted at parse, but /5 and selected
        # orbit multiplication still receive intermediate component checks.
        raw = {**fixture(), "tau": [str(2**255+1), "10"]}
        with self.assertRaises(product.Refused):
            product.derive_certificate(raw)

    def test_subclass_hooks_not_admitted(self):
        class BadList(list):
            def __iter__(self):
                raise AssertionError("hook ran")
        class BadDict(dict):
            def __iter__(self):
                raise AssertionError("hook ran")
        self.reject(BadDict(fixture()))
        self.reject({**fixture(), "speeds": BadList(fixture()["speeds"])})
        self.reject({**fixture(), "tau": BadList(["1", "10"])})
        class BadFraction(F):
            def __mod__(self, other):
                raise AssertionError("hook ran")
        with self.assertRaises(product.Refused):
            product.nearest_safe(7, BadFraction(1, 50), F(1, 15), product.Work())

    def test_limits_invalid_and_tiny_budget(self):
        for limits in ({}, {"maxMs": 5001, "maxOperations": 2000000}, {"maxMs": 5000, "maxOperations": 2000001},
                       {"maxMs": True, "maxOperations": 1}, {"maxMs": 5000, "maxOperations": 0}):
            with self.assertRaises(product.Refused):
                product.derive_certificate(fixture(), limits)
        with self.assertRaisesRegex(product.Refused, "RESOURCE_REFUSED"):
            product.build_fixed_report({"maxMs": 5000, "maxOperations": 100})

    def test_whole_run_budget_not_reset_between_cases(self):
        with self.assertRaisesRegex(product.Refused, "RESOURCE_REFUSED"):
            product.build_fixed_report({"maxMs": 5000, "maxOperations": 100000})

    def test_deadline_and_output_limit_refusals(self):
        w = product.Work()
        with patch.object(product, "monotonic", return_value=w.deadline):
            with self.assertRaisesRegex(product.Refused, "RESOURCE_REFUSED"):
                w.charge()
        with self.assertRaisesRegex(product.Refused, "OUTPUT_REFUSED"):
            product.bounded_json({"x": "x"*257}, product.Work())
        with self.assertRaisesRegex(product.Refused, "OUTPUT_REFUSED"):
            product.bounded_json([["x"*200]*40]*40, product.Work())
        with self.assertRaisesRegex(product.Refused, "OUTPUT_REFUSED"):
            product.bounded_json({"x": object()}, product.Work())

    def test_invariant_corruption_refuses_no_positive_certificate(self):
        original = product.grid
        def corrupt(*args):
            out = original(*args)
            out["goodShiftIndices"] = []
            return out
        with patch.object(product, "grid", side_effect=corrupt):
            with self.assertRaisesRegex(product.Refused, "INVARIANT_REFUSED"):
                product.derive_certificate(fixture())


class ProcessTests(unittest.TestCase):
    def run_cli(self, env=None, args=()):
        self.assertEqual(sha256(SOURCE.read_bytes()).hexdigest(), SOURCE_SHA256)
        result = subprocess.run([sys.executable, "-I", "-S", "-B", str(SOURCE), *args],
                                env={k: "false" for k in FLAGS} if env is None else env,
                                capture_output=True, timeout=5, shell=False)
        self.assertEqual(sha256(SOURCE.read_bytes()).hexdigest(), SOURCE_SHA256)
        return result

    def test_real_source_pinned_whole_cli_body(self):
        out = self.run_cli()
        self.assertEqual(out.returncode, 0)
        self.assertEqual(out.stderr, b"")
        self.assertLess(len(out.stdout), 32768)
        self.assertTrue(out.stdout.endswith(b"\n"))
        report = json.loads(out.stdout)
        self.assertEqual(set(report), {"version", "cases", "scope", "counts", "semanticDigest", "metrics"})
        body = {k: v for k, v in report.items() if k not in ("semanticDigest", "metrics")}
        self.assertEqual(body, expected_body())
        self.assertEqual(report["semanticDigest"], sha256(canonical(expected_body())).hexdigest())
        self.assertGreater(report["metrics"]["chargedOperations"], 100000)
        self.assertLess(report["metrics"]["chargedOperations"], 2000000)
        self.assertLess(report["metrics"]["elapsedMs"], 5000)

    def test_all_execution_flag_faults_refuse_empty_stdout(self):
        for flag in FLAGS:
            for value in (None, "true", "False", "0", ""):
                with self.subTest(flag=flag, value=value):
                    env = {k: "false" for k in FLAGS}
                    if value is None: del env[flag]
                    else: env[flag] = value
                    out = self.run_cli(env)
                    self.assertNotEqual(out.returncode, 0)
                    self.assertEqual(out.stdout, b"")
                    self.assertEqual(out.stderr, b"CLI_REFUSED\n")

    def test_cli_no_options_or_paths(self):
        for args in (("--help",), ("/tmp/untrusted",), ("--speed", "91")):
            out = self.run_cli(args=args)
            self.assertNotEqual(out.returncode, 0)
            self.assertEqual(out.stdout, b"")
            self.assertEqual(out.stderr, b"CLI_REFUSED\n")

    def test_source_pin_frozen(self):
        self.assertEqual(sha256(SOURCE.read_bytes()).hexdigest(), SOURCE_SHA256)


if __name__ == "__main__":
    unittest.main()
