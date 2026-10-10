"""TIP-072P isolated unittest; independent Fraction expectations, no old arithmetic.

Run: python3 -I -S -B tests/research/test_lrc_adaptive_phase_lock.py
Only the explicit product source below is loaded. No cache files are written.
"""
from fractions import Fraction as F
from hashlib import sha256
from math import gcd
from functools import reduce
from pathlib import Path
from unittest.mock import patch
import importlib.util
import json
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "scripts/research/lrc-adaptive-phase-lock-replay.py"
SOURCE_SHA256 = "de32c661d4d7c06fd4964c2e202f998de253ab4fe07bec50e053cd1e532ad622"
spec = importlib.util.spec_from_file_location("tip072p_known_product", SOURCE)
product = importlib.util.module_from_spec(spec)
spec.loader.exec_module(product)
FLAGS = (
    "RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
    "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED",
)
EXCEPTIONS = [[1, 2, 3, 7, 11], [1, 52, 3, 7, 11], [1, 677, 3, 7, 11],
              [338, 1, 3, 7, 11], [1, 1247, 3, 7, 11], [1, 7, 3, 4, 11]]
LABELS = ["exact_pair", "already_aligned", "positive_radius_tie", "negative_radius_tie",
          "congruence_subfamily_z1", "unknown_gate_actual_witness"]
EXPECTED_SCOPE = {"localUnsigned": True, "retainedAgentResult": False, "agentLoop": "NOT_RUN",
                  "executionAuthority": False, "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED",
                  "external": "NOT_ESTABLISHED", "novelty": "NOT_ESTABLISHED",
                  "wholeAllikvereBranch": "NOT_ESTABLISHED", "target": "14_MOVING_15_TOTAL_ONLY",
                  "samplingIsUniversalProof": False}


def as_wire(q):
    return [str(q.numerator), str(q.denominator)]


def norm(q):
    floor = q.numerator // q.denominator
    return min(q-floor, floor+1-q)


def fixture(index=0):
    return {"label": LABELS[index], "speeds": list(range(5, 46, 5)) + list(EXCEPTIONS[index]),
            "pairLabels": [9, 10], "tau": ["1", "10"]}


def expected_grid(speeds, pair, base):
    # Independent full reconstruction: all five times and all fourteen speeds.
    matrix = [[norm(v*(base+F(j, 5))) for v in speeds] for j in range(5)]
    bad = [[j for j in range(5) if matrix[j][i] < F(1, 15)] for i in pair]
    good = [j for j in range(5) if all(x >= F(1, 15) for x in matrix[j])]
    witness = None
    if good:
        j = good[0]
        witness = {"lowestPhysicalShift": j, "finalTime": as_wire(base+F(j, 5)),
                   "coordinateDistances": [as_wire(x) for x in matrix[j]],
                   "minimumDistance": as_wire(min(matrix[j]))}
    return {"baseTime": as_wire(base), "distanceMatrix": [[as_wire(x) for x in row] for row in matrix],
            "pairBadIndices": bad, "pairBadUnion": sorted(set(bad[0]).union(bad[1])),
            "goodShiftIndices": good, "observedWitness": witness}


def expected_context(raw):
    speeds, pair = raw["speeds"], raw["pairLabels"]
    lower = [i for i, v in enumerate(speeds) if v % 5 == 0]
    reduced = [speeds[i]//5 for i in lower]
    tau = F(int(raw["tau"][0]), int(raw["tau"][1]))
    tstar = tau/5
    delta = speeds[pair[1]]-2*speeds[pair[0]]
    phase, U = delta*tstar, max(speeds[i] for i in lower)
    radius, beta = F(1, 30*U), norm(phase)
    # Compute both neighbor candidates and order by (distance, integer), not
    # product's half-integer branch. The second key enforces LOWER tie.
    lo = phase.numerator // phase.denominator
    nearest = min([lo, lo+1], key=lambda n: (abs(F(n)-phase), n))
    gate = delta == 0 or beta <= abs(delta)*radius
    base = tstar if delta == 0 else F(nearest, delta)
    distances = [norm(tau*v) for v in reduced]
    return {"speeds": speeds, "divisibleIndices": lower,
            "exceptionIndices": [i for i in range(14) if i not in lower],
            "reducedSpeeds": reduced, "pairLabels": pair, "pairSpeeds": [speeds[i] for i in pair],
            "integerGcd": reduce(gcd, speeds), "tau": as_wire(tau),
            "lowerDistances": [as_wire(x) for x in distances], "lowerWitnessMargin": as_wire(min(distances)),
            "U": U, "tStar": as_wire(tstar), "L": ["1", "10"], "eta": ["1", "15"],
            "radius": as_wire(radius), "Delta": delta, "beta": as_wire(beta),
            "dominanceHolds": delta != 0 and abs(delta) >= 15*U, "phaseGateHolds": gate,
            "nearestInteger": nearest, "alignedBase": as_wire(base) if gate else None,
            "actualAdjustment": as_wire(base-tstar) if gate else None}


class ArithmeticTests(unittest.TestCase):
    def test_all_six_full_certificates_independent(self):
        coordinate_count = 0
        for index in range(6):
            with self.subTest(case=index):
                raw = fixture(index)
                certificate = product.derive_certificate(raw)
                ctx = expected_context(raw)
                expected = {"label": LABELS[index],
                            "status": "CHECKED_PHASE_LOCK_WITNESS" if ctx["phaseGateHolds"] else "UNKNOWN_GATE_NOT_APPLICABLE",
                            "context": ctx, "originalGrid": expected_grid(raw["speeds"], [9, 10], F(1, 50)),
                            "alignedGrid": None, "scope": EXPECTED_SCOPE}
                if ctx["phaseGateHolds"]:
                    q = F(*map(int, ctx["alignedBase"]))
                    expected["alignedGrid"] = expected_grid(raw["speeds"], [9, 10], q)
                    coordinate_count += 70
                coordinate_count += 70
                self.assertEqual(certificate, expected)
        self.assertEqual(coordinate_count, 770)

    def test_fixed_final_witnesses(self):
        times = [F(11, 50), F(11, 50), F(148, 675), F(149, 675), F(274, 1245)]
        minima = [F(1, 10), F(1, 10), F(13, 135), F(1, 15), F(8, 83)]
        for index in range(5):
            with self.subTest(case=index):
                witness = product.derive_certificate(fixture(index))["alignedGrid"]["observedWitness"]
                self.assertEqual(witness["lowestPhysicalShift"], 1)
                self.assertEqual(witness["finalTime"], as_wire(times[index]))
                self.assertEqual(witness["minimumDistance"], as_wire(minima[index]))

    def test_positive_and_negative_lower_integer_ties(self):
        for index, nearest, aligned in [(2, 13, F(13, 675)), (3, -14, F(14, 675))]:
            with self.subTest(case=index):
                ctx = product.derive_certificate(fixture(index))["context"]
                self.assertEqual(ctx["nearestInteger"], nearest)
                self.assertEqual(ctx["alignedBase"], as_wire(aligned))
                self.assertEqual(abs(F(*map(int, ctx["actualAdjustment"]))), F(1, 1350))

    def test_negative_radius_threshold_equality_good(self):
        result = product.derive_certificate(fixture(3))
        self.assertEqual(result["alignedGrid"]["observedWitness"]["coordinateDistances"][8], ["1", "15"])
        self.assertEqual(result["alignedGrid"]["observedWitness"]["minimumDistance"], ["1", "15"])

    def test_phase_gate_not_only_dominance(self):
        ctx = product.derive_certificate(fixture(1))["context"]
        self.assertEqual(ctx["Delta"], 50)
        self.assertFalse(ctx["dominanceHolds"])
        self.assertTrue(ctx["phaseGateHolds"])
        self.assertEqual(ctx["beta"], ["0", "1"])
        self.assertEqual(ctx["actualAdjustment"], ["0", "1"])

    def test_unknown_does_not_mean_no_witness(self):
        result = product.derive_certificate(fixture(5))
        self.assertEqual(result["status"], "UNKNOWN_GATE_NOT_APPLICABLE")
        self.assertFalse(result["context"]["phaseGateHolds"])
        self.assertIsNone(result["alignedGrid"])
        self.assertEqual(result["originalGrid"]["goodShiftIndices"], [1, 3])
        self.assertEqual(result["originalGrid"]["observedWitness"]["lowestPhysicalShift"], 1)

    def test_finite_z_instances_not_universal_proof(self):
        for z in [0, 1, 2, 3, 10, 100, 1000]:
            with self.subTest(z=z):
                raw = fixture()
                raw["speeds"][10] = 2+1245*z
                actual = product.derive_certificate(raw)
                ctx = expected_context(raw)
                self.assertEqual(actual["context"], ctx)
                base = F(*map(int, ctx["alignedBase"]))
                self.assertEqual(actual["alignedGrid"], expected_grid(raw["speeds"], [9, 10], base))
                self.assertEqual(actual["scope"]["samplingIsUniversalProof"], False)

    def test_valid_nonprimitive_input(self):
        raw = fixture()
        raw["speeds"] = [2*v for v in raw["speeds"]]
        raw["tau"] = ["1", "20"]
        actual = product.derive_certificate(raw)
        self.assertEqual(actual["context"]["integerGcd"], 2)
        self.assertEqual(actual["context"], expected_context(raw))
        self.assertEqual(actual["alignedGrid"], expected_grid(raw["speeds"], [9, 10], F(1, 100)))

    def test_pair_labels_not_order_assumed(self):
        raw = fixture()
        raw["speeds"] = raw["speeds"][9:] + raw["speeds"][:9]
        raw["pairLabels"] = [0, 1]
        result = product.derive_certificate(raw)
        self.assertEqual(result["context"], expected_context(raw))
        self.assertEqual(result["alignedGrid"], expected_grid(raw["speeds"], [0, 1], F(1, 50)))

    def test_largest_lower_not_largest_exception(self):
        ctx = product.derive_certificate(fixture(4))["context"]
        self.assertEqual(ctx["U"], 45)
        self.assertEqual(ctx["radius"], ["1", "1350"])

    def test_independent_lower_growth_destroys_gate_not_lrc(self):
        raw = fixture(4)
        raw["speeds"][8] += 1245
        result = product.derive_certificate(raw)
        self.assertEqual(result["context"], expected_context(raw))
        self.assertEqual(result["context"]["U"], 1290)
        self.assertFalse(result["context"]["phaseGateHolds"])
        self.assertEqual(result["status"], "UNKNOWN_GATE_NOT_APPLICABLE")
        self.assertEqual(result["originalGrid"], expected_grid(raw["speeds"], [9, 10], F(1, 50)))

    def test_signed_tau(self):
        raw = fixture(4)
        raw["tau"] = ["-1", "10"]
        result = product.derive_certificate(raw)
        self.assertEqual(result["context"], expected_context(raw))
        base = F(*map(int, result["context"]["alignedBase"]))
        self.assertEqual(result["alignedGrid"], expected_grid(raw["speeds"], [9, 10], base))

    def test_input_detached(self):
        raw = fixture()
        actual = product.derive_certificate(raw)
        raw["speeds"][0] = 999
        raw["pairLabels"][0] = 0
        self.assertEqual(actual["context"]["speeds"][0], 5)
        self.assertEqual(actual["context"]["pairLabels"], [9, 10])

    def test_complete_report_counts_and_digest(self):
        result = product.build_fixed_report()
        self.assertEqual(result["counts"], {"cases": 6, "phaseGateAccepted": 5, "unknownGate": 1,
                                           "originalMatrices": 6, "alignedMatrices": 5, "retainedMatrixCoordinates": 770})
        self.assertEqual(result["scope"], EXPECTED_SCOPE)
        self.assertEqual([x["label"] for x in result["cases"]], LABELS)
        body = {k: v for k, v in result.items() if k not in ["metrics", "semanticDigest"]}
        canonical = json.dumps(body, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
        self.assertEqual(result["semanticDigest"], sha256(canonical.encode("ascii")).hexdigest())
        self.assertLessEqual(len(json.dumps(result).encode()), 32768)
        self.assertLessEqual(result["metrics"]["chargedOperations"], 2000000)
        self.assertLess(result["metrics"]["elapsedMs"], 5000)


class RefusalTests(unittest.TestCase):
    def assert_refused(self, raw):
        with self.assertRaises(product.Refused):
            product.derive_certificate(raw)

    def test_root_types_and_claimed_verdict(self):
        for value in [None, [], "a", 1, True, tuple(), {**fixture(), "claimedVerdict": "PASS"}]:
            with self.subTest(value=type(value).__name__):
                self.assert_refused(value)

    def test_wrong_count_and_duplicate(self):
        for speeds in [fixture()["speeds"][:-1], fixture()["speeds"]+[13], [5]*14]:
            with self.subTest(count=len(speeds)):
                self.assert_refused({**fixture(), "speeds": speeds})

    def test_speed_types_and_bounds(self):
        for value in [True, 1.0, "1", 0, -1, 10**12+1, 1 << 257]:
            with self.subTest(value=str(value)[:20]):
                raw = fixture()
                raw["speeds"][9] = value
                self.assert_refused(raw)

    def test_false_unit_divisor_domain(self):
        raw = fixture()
        raw["speeds"][9] = 50
        self.assert_refused(raw)

    def test_false_pair_residue(self):
        raw = fixture()
        raw["speeds"][10] = 13
        self.assert_refused(raw)

    def test_pair_label_types_and_domain(self):
        for pair in [[9, 9], [0, 10], [9, 14], [-1, 10], [True, 10], [9], (9, 10), [9, "10"]]:
            with self.subTest(pair=pair):
                self.assert_refused({**fixture(), "pairLabels": pair})

    def test_lower_witness_false(self):
        for tau in [["0", "1"], ["1", "100"], ["1", "1"]]:
            with self.subTest(tau=tau):
                self.assert_refused({**fixture(), "tau": tau})

    def test_rational_types_canonical_and_bits(self):
        for tau in [[1, 10], ["1", "0"], ["-0", "1"], ["01", "10"], ["2", "20"],
                    ["1", "-10"], [str(1 << 256), "1"], ["1", str(1 << 256)], ["1", "10", "0"], ("1", "10")]:
            with self.subTest(tau=str(tau)[:30]):
                self.assert_refused({**fixture(), "tau": tau})

    def test_label_bounds_and_types(self):
        for label in [None, True, "", "a"*81, "x/y", "λ", "test\n"]:
            with self.subTest(label=str(label)[:20]):
                self.assert_refused({**fixture(), "label": label})

    def test_plain_containers_only_without_hooks(self):
        calls = []

        class EvilDict(dict):
            def __iter__(self):
                calls.append("dict")
                raise AssertionError("hook")

        class EvilList(list):
            def __iter__(self):
                calls.append("list")
                raise AssertionError("hook")

        class EvilString(str):
            def __str__(self):
                calls.append("str")
                raise AssertionError("hook")

        for raw in [EvilDict(fixture()), {**fixture(), "speeds": EvilList(fixture()["speeds"])},
                    {**fixture(), "label": EvilString("test")}, {**fixture(), "tau": [EvilString("1"), "10"]}]:
            self.assert_refused(raw)
        self.assertEqual(calls, [])

    def test_nonstring_key_no_hash_hook_at_validation(self):
        calls = []

        class Key:
            def __hash__(self):
                calls.append("hash")
                return 123

        raw = fixture()
        raw.pop("label")
        raw[Key()] = 1
        calls.clear()
        self.assert_refused(raw)
        self.assertEqual(calls, [])

    def test_oversized_metadata_rejected_before_traversal(self):
        class HugeMetadata(dict):
            def __iter__(self):
                raise AssertionError("metadata hook must not run")

        self.assert_refused(HugeMetadata({str(i): i for i in range(10000)}))
        self.assert_refused({str(i): i for i in range(10000)})

    def test_budget_types_and_bounds(self):
        for limits in [{}, {"maxMs": 5001, "maxOperations": 1}, {"maxMs": 0, "maxOperations": 1},
                       {"maxMs": 5, "maxOperations": 2000001}, {"maxMs": True, "maxOperations": 1},
                       {"maxMs": 5, "maxOperations": 1.0}]:
            with self.subTest(limits=limits):
                with self.assertRaises(product.Refused):
                    product.build_fixed_report(limits)

    def test_whole_report_operation_budget_not_reset(self):
        with self.assertRaisesRegex(product.Refused, "RESOURCE_REFUSED"):
            product.build_fixed_report({"maxMs": 5000, "maxOperations": 50000})

    def test_small_operation_budget(self):
        with self.assertRaisesRegex(product.Refused, "RESOURCE_REFUSED"):
            product.derive_certificate(fixture(), {"maxMs": 5000, "maxOperations": 1})

    def test_deadline_exhaustion(self):
        with patch.object(product, "monotonic", side_effect=[0.0, 6.0]):
            with self.assertRaisesRegex(product.Refused, "RESOURCE_REFUSED"):
                product.derive_certificate(fixture())

    def test_component_guard(self):
        with self.assertRaisesRegex(product.Refused, "COMPONENT_REFUSED"):
            product.Work().q(F(1 << 256, 1))

    def test_complete_json_output_limit(self):
        with patch.object(product, "MAX_BYTES", 100):
            with self.assertRaisesRegex(product.Refused, "OUTPUT_REFUSED"):
                product.build_fixed_report()


class ActualCliTests(unittest.TestCase):
    def run_cli(self, env=None, args=()):
        return subprocess.run([sys.executable, "-I", "-S", "-B", str(SOURCE), *args],
                              env={flag: "false" for flag in FLAGS} if env is None else env,
                              stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                              timeout=5, check=False, shell=False)

    def test_frozen_source_pin(self):
        self.assertEqual(sha256(SOURCE.read_bytes()).hexdigest(), SOURCE_SHA256)

    def test_actual_fixed_cli_complete_json(self):
        result = self.run_cli()
        self.assertEqual(result.returncode, 0, result.stderr.decode())
        self.assertEqual(result.stderr, b"")
        self.assertLessEqual(len(result.stdout), 32768)
        parsed = json.loads(result.stdout)
        self.assertEqual(len(parsed["cases"]), 6)
        self.assertEqual(parsed["counts"]["retainedMatrixCoordinates"], 770)
        self.assertEqual(parsed["semanticDigest"], "32f7111e4059850f48d09ea122a5d6cbc4f46ca3250ce426b95055672bef3a1b")
        for index, certificate in enumerate(parsed["cases"]):
            self.assertEqual(certificate["context"], expected_context(fixture(index)))
            self.assertEqual(certificate["originalGrid"], expected_grid(fixture(index)["speeds"], [9, 10], F(1, 50)))
            if index < 5:
                base = F(*map(int, certificate["context"]["alignedBase"]))
                self.assertEqual(certificate["alignedGrid"], expected_grid(fixture(index)["speeds"], [9, 10], base))

    def test_every_flag_requires_exact_false(self):
        for flag in FLAGS:
            for bad in [None, "true", "FALSE", "0", ""]:
                with self.subTest(flag=flag, value=bad):
                    env = {name: "false" for name in FLAGS}
                    if bad is None:
                        env.pop(flag)
                    else:
                        env[flag] = bad
                    result = self.run_cli(env)
                    self.assertEqual(result.returncode, 2)
                    self.assertEqual(result.stdout, b"")
                    self.assertEqual(result.stderr, b"CLI_REFUSED\n")

    def test_no_cli_custom_inputs(self):
        result = self.run_cli(args=("--speeds", "1,2"))
        self.assertEqual(result.returncode, 2)
        self.assertEqual(result.stdout, b"")
        self.assertEqual(result.stderr, b"CLI_REFUSED\n")


if __name__ == "__main__":
    unittest.main(verbosity=2)
