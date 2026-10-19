"""Focused mathematical controls; execute ONLY after Main's explicit release."""
from copy import deepcopy
from fractions import Fraction as F
from pathlib import Path
import argparse
import json
import resource
import signal
import sys
import time
import unittest
from unittest.mock import patch

import producer as p


class ProducerTests(unittest.TestCase):
    def guard(self):
        if time.monotonic() - TEST_START >= 18:
            raise TimeoutError("EIGHTEEN_SECOND_INTERNAL_TEST_CAP")
        peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (peak if sys.platform == "darwin" else peak * 1024) > 512 * 1024 ** 2:
            raise MemoryError("TEST_STATE_RSS_CAP")

    def setUp(self):
        self.guard()

    def tearDown(self):
        self.guard()

    def test_phase_two_primal_dual(self):
        result = p.simplex(((F(1),),), (F(2),), (F(1),), self.guard)
        self.assertEqual(result["point"], (F(2),))
        self.assertEqual(result["value"], 2)
        self.assertEqual(result["multipliers"], (F(1),))

    def test_phase_one_feasible(self):
        result = p.simplex(((F(-1),), (F(1),)), (F(-1), F(2)), (F(1),), self.guard)
        self.assertEqual(result["value"], 2)

    def test_phase_one_farkas(self):
        a, b = ((F(1),), (F(-1),)), (F(0), F(-1))
        result = p.simplex(a, b, (F(1),), self.guard)
        self.assertEqual(result["status"], "infeasible")
        self.assertLess(p.check_dual(a, b, result["dual"]), 0)

    def test_strict_empty_not_relaxed_empty(self):
        a, b = ((F(1),),), (F(0),)
        result = p.simplex(a, b, (F(1),), self.guard)
        cert = {"kind": "epsilon_bound", "multipliers": list(map(str, result["multipliers"]))}
        self.assertEqual(p.check_dual(a, b, cert), 0)

    def test_bad_duals_refused(self):
        a, b = ((F(1),),), (F(0),)
        for cert in ({"kind": "epsilon_bound", "multipliers": ["-1"]},
                     {"kind": "epsilon_bound", "multipliers": ["0"]},
                     {"kind": "farkas", "multipliers": ["1"]}):
            with self.assertRaises(ValueError):
                p.check_dual(a, b, cert)

    def test_full_model(self):
        self.assertEqual(len(p.wall_inventory()), 147)
        self.assertEqual(len(p.words()), 13)
        self.assertEqual(len(p.TERMS), 21)
        self.assertEqual(len(p.root_rows(p.words()[0])), 35)
        rows, rhs = p.lp_rows(p.words()[0], (), p.wall_inventory(), True)
        self.assertEqual(len(rows), 41)
        self.assertEqual(len(rhs), 41)

    def test_singular_complete_affine_solution(self):
        h = ((F(1), F(1), F(0), F(0), F(0)),) + ((F(0),) * 5,) * 4
        point, null = p.eliminate(h, (F(0),) * 5)
        self.assertEqual(len(null), 4)
        self.assertTrue(all(p.dot(h[0], d) == 0 for d in null))
        self.assertEqual(point, (F(0),) * 5)
        self.assertIsNone(p.eliminate(((F(0),) * 5,), (F(1),)))

    def test_entire_singular_family_feasibility(self):
        walls = p.wall_inventory()
        word = p.words()[0]
        # p1=0 leaves a four-dimensional family; the strict root has members.
        row = (F(1), F(0), F(0), F(0), F(0), F(0))
        a, b = p.lp_rows(word, (), walls, False, (row,))
        point, cert = p.strict_feasibility(a, b, self.guard)
        self.assertIsNone(cert)
        self.assertEqual(point[0], 0)
        # p1=100 leaves a family too, but ALL members violate strict range.
        row = row[:5] + (F(-100),)
        a, b = p.lp_rows(word, (), walls, False, (row,))
        point, cert = p.strict_feasibility(a, b, self.guard)
        self.assertIsNone(point)
        p.check_dual(a, b, cert)

    def test_actual_generic_witness_cell(self):
        sample = tuple(F(999, 1000) * F(v, 31) + F(1, 1009 ** i)
                       for i, v in enumerate((49, 43, 23, 26, 6), 1))
        walls = p.wall_inventory()
        path = tuple((i, 1 if p.dot(w, sample + (F(1),)) > 0 else -1)
                     for i, w in enumerate(walls))
        self.assertTrue(all(p.dot(w, sample + (F(1),)) != 0 for w in walls))
        poly = p.polynomial(sample)
        record = p.stationary_record(poly, p.words()[0], path, walls, self.guard)
        self.assertEqual(record["kind"], "safe")
        self.assertEqual(F(record["value"]), p.TARGET)
        point = tuple(F(x) for x in record["particular"])
        self.assertEqual(point, tuple(F(v, 31) for v in (49, 43, 23, 26, 6)))
        # Independent immutable rational sweeps are numeric finite controls,
        # not the independent symbolic certificate checker.
        import sys
        sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tip098"))
        from kakeya_exact import area_affine, area_trapezoid
        offsets = tuple(x / 6 for x in sample) + (F(0),)
        self.assertEqual(p.evaluate(poly, sample), 6 * area_affine(offsets))
        self.assertEqual(area_affine(offsets), area_trapezoid(offsets))
        self.actual_leaf = {"kind": "stationary", "sample": list(map(str, sample)),
                            "polynomial": list(map(str, poly)), "stationary": record}
        ACTUAL_LEAF.update(self.actual_leaf)

    def test_incomplete_and_resume(self):
        state = p.produce(p.fresh_state(), seconds=2, max_nodes=1)
        self.assertEqual(state["status"], "INCOMPLETE")
        self.assertEqual(len(state["roots"]), 13)
        self.assertGreater(state["stats"]["pending_nodes"], 0)
        old = state["stats"]["processed_nodes"]
        resumed = p.produce(deepcopy(state), seconds=2, max_nodes=1)
        self.assertEqual(resumed["status"], "INCOMPLETE")
        self.assertEqual(resumed["stats"]["processed_nodes"], old + 1)
        self.assertEqual(len(resumed["run_history"]), 2)
        self.assertEqual(sum(entry["processed_this_run"] for entry in resumed["run_history"]),
                         resumed["stats"]["processed_nodes"])
        SMOKE.update(state)

    def test_limit_never_promoted_to_complete(self):
        # This synthetic invalid no-pending input is NOT a coverage certificate.
        # Mock only the interrupted validation to exercise the status safeguard.
        state = p.fresh_state()
        state["nodes"] = []
        with patch.object(p, "pending_paths", side_effect=TimeoutError("INJECTED_TIME_CAP")):
            result = p.produce(state, seconds=2, max_nodes=1)
        self.assertEqual(result["stats"]["pending_nodes"], 0)
        self.assertEqual(result["status"], "INCOMPLETE")
        self.assertEqual(result["stats"]["reason"], "INJECTED_TIME_CAP")

    def test_invalid_resume_structure(self):
        state = p.fresh_state()
        state["roots"].pop()
        with self.assertRaises(ValueError):
            p.pending_paths(state)
        state = p.fresh_state()
        state["nodes"][0] = {"kind": "split", "wall": 0, "minus": 1, "plus": 1}
        with self.assertRaises(ValueError):
            p.pending_paths(state)


ACTUAL_LEAF = {}
SMOKE = {}
TEST_START = time.monotonic()


def main():
    global TEST_START
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    if args.out.exists():
        parser.error("create-only output")
    def expired(signum, frame):
        raise TimeoutError("TWENTY_SECOND_TEST_CAP")
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(20)
    start = time.monotonic()
    TEST_START = start
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(ProducerTests)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    payload = {"status": "FOCUSED_TESTS_PASS" if result.wasSuccessful() else "FOCUSED_TESTS_FAIL",
               "tests": result.testsRun, "failures": len(result.failures), "errors": len(result.errors),
               "elapsed_seconds": format(time.monotonic() - start, ".9f"),
               "actual_leaf_control": ACTUAL_LEAF, "incomplete_smoke": SMOKE,
               "scope": "finite engineering tests only; no whole production or K6 closure"}
    with args.out.open("x", encoding="utf-8") as out:
        json.dump(payload, out, sort_keys=True, separators=(",", ":"))
        out.write("\n")
    signal.alarm(0)
    raise SystemExit(0 if result.wasSuccessful() else 3)


if __name__ == "__main__":
    main()
