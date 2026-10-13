#!/usr/bin/env python3
"""Fixed exact/adversarial controls ONLY; never whole-domain generation."""
import ast
from collections import Counter
from fractions import Fraction as Q
import importlib.util
import json
from pathlib import Path
import signal
import time
import unittest
from unittest.mock import patch

import independent_checker as checker


class Controls(unittest.TestCase):
    def test_independent_roots(self):
        sets = checker.signatures()
        self.assertEqual(len(sets), 34)
        self.assertEqual(Counter(len(l) for _, l, _ in sets), {2: 10, 3: 14, 4: 10})
        roots = checker.charts()
        self.assertEqual(len(roots), len(set(roots)))
        self.assertEqual(len(roots), 286)

    def test_retained_exact_control(self):
        source = Path(__file__).resolve().parents[1] / "tip098" / "kakeya_exact.py"
        spec = importlib.util.spec_from_file_location("immutable_area_control", source)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        p = tuple(Q(n, 93) for n in (176, 176, 149, 27, 0, 0))
        old_a = module.area_trapezoid([x / 6 for x in p])
        old_b = module.area_affine([x / 6 for x in p])
        self.assertEqual(old_a, Q(50293, 207576))
        self.assertEqual(old_b, old_a)
        numerator, h, _ = checker.core_integral([(n, n) for n in
                                                 (176, 176, 149, 27, 0, 0)], 93)
        self.assertEqual(Q(numerator, 7200 * h * h), 6 * old_a)

    def test_inverted_cores_absent(self):
        numerator, h, _ = checker.core_integral([(0, 200)] * 6, 100)
        self.assertEqual(numerator, 0)
        self.assertEqual(h, 100)

    def test_core_death_exact(self):
        # Only label1 has a live core: [1/2+y,1], dying at y=1/2.
        bounds = [(0, 50)] + [(0, 200)] * 5
        n, h, _ = checker.core_integral(bounds, 100)
        self.assertEqual(Q(n, 7200 * h * h), Q(1, 8))

    def test_shift_bounds_and_positive_point(self):
        chart = (56, 5, 1)  # left456, anchored left5 and right1.
        # Rational dyadic chart point, exact zero-span separation 37/31.
        box = ((37, 37, 0),) + ((0, 0, 0),) * 4
        verdict, residual, _ = checker.positive(chart, box)
        self.assertTrue(verdict)
        self.assertGreater(residual, 0)
        self.assertEqual(checker.excluded(chart, box), "S_upper<=18/61")

    def test_boundary_exclusions(self):
        chart = (56, 5, 1)
        # Nonanchor labels2,3,4,6. S=18/31 exactly is NOT S-lower exclusion.
        box = ((41, 41, 0), (9, 9, 0), (0, 0, 0), (9, 9, 0), (0, 0, 0))
        self.assertIsNone(checker.excluded(chart, box))
        # Larger than maximum span is excluded.
        larger = list(box)
        larger[1] = (10, 10, 0)
        self.assertEqual(checker.excluded(chart, tuple(larger)), "S_lower>18/31")
        # d=1 upper edge is safe to exclude, never d-lower=1 alone.
        touching = ((40, 40, 0),) + box[1:]
        self.assertEqual(checker.excluded(chart, touching), "d_upper<=1")
        crossing = ((40, 41, 0),) + box[1:]
        self.assertIsNone(checker.excluded(chart, crossing))
        below = ((40, 40, 0), (0, 0, 0), (0, 0, 0), (9, 9, 0), (9, 9, 0))
        # S=9/31 falls in already proved small-S domain, regardless of d.
        self.assertEqual(checker.excluded(chart, below), "S_upper<=18/61")

    def test_dyadic_splits(self):
        first, second = checker.midpoint_children(checker.ROOT_BOX, 0)
        self.assertEqual(first[0], (62, 106, 1))
        self.assertEqual(second[0], (106, 150, 1))
        self.assertEqual(first[1:], checker.ROOT_BOX[1:])
        for axis in (False, -1, 5, "0"):
            with self.assertRaises(checker.Refusal):
                checker.midpoint_children(checker.ROOT_BOX, axis)

    def test_genuine_uniform_positive_toy_tree(self):
        # ENGINEERING CONTROL ONLY, not a near-domain theorem/certificate.
        # Fixed nonzero-width tiny box; wire whole roots cannot supply this box.
        chart = (56, 5, 1)
        box = ((37 << 10, (37 << 10) + 1, 10),) + ((0, 1, 10),) * 4
        self.assertTrue(checker.positive(chart, box)[0])
        counts = checker.fresh_counts()
        checker.verify_tree(chart, "0PP", counts, initial_box=box)
        self.assertEqual(counts["positive"], 2)
        self.assertEqual(counts["nodes"], 3)

    def test_count_claim_tampering(self):
        # Isolate the claimed-count validator; no full forest geometry replay.
        counts = {"nodes": 288, "splits": 1, "positive": 287, "excluded": 0,
                  "roots": 286, "max_depth": 1}
        limits = {"processed_nodes": 32768, "depth": 48, "seconds": 30,
                  "artifact_bytes": 16777216, "state_bytes": 134217728}
        stats = {"processed_nodes": 288, "created_nodes": 288, "positive_leaves": 287,
                 "domain_leaves": 0, "open_leaves": 0, "max_depth": 1,
                 "elapsed_seconds": 0.01, "stopped_by": "COMPLETE", "peak_state_bytes": 1000}
        checker.verify_claims(stats, counts, limits)
        for key in ("processed_nodes", "created_nodes", "positive_leaves", "domain_leaves",
                    "open_leaves", "max_depth"):
            forged = dict(stats)
            forged[key] += 1
            with self.subTest(key=key), self.assertRaises(checker.Refusal):
                checker.verify_claims(forged, counts, limits)

    def test_preorder_adversaries(self):
        root = checker.charts()[0]
        for tree in ("", "0", "0X", "P", "X", "O", "9", "P0", "0OO"):
            with self.subTest(tree=tree), self.assertRaises(checker.Refusal):
                checker.verify_tree(root, tree, checker.fresh_counts())
        # Independently reconstructed chart has no producer-supplied box escape.
        with self.assertRaises(checker.Refusal):
            checker.verify_tree(root, "0" * 49, checker.fresh_counts())
        # Isolate parser bookkeeping with synthetic predicates, explicitly not
        # mathematical acceptance. Real forged-P checks above remain unmocked.
        with patch.object(checker, "positive", return_value=(True, 1, 62)):
            good = checker.fresh_counts()
            checker.verify_tree(root, "0PP", good)
            self.assertEqual(good["nodes"], 3)
            self.assertEqual(good["splits"], 1)
            for tree in ("0P", "0PPP", "5PP", "00PPP0"):
                with self.subTest(tree=tree), self.assertRaises(checker.Refusal):
                    checker.verify_tree(root, tree, checker.fresh_counts())

    def test_document_refusals(self):
        for doc in ({}, {"schema": checker.SCHEMA, "scope": "CONTROL_ONLY"},
                    {"schema": checker.SCHEMA, "scope": "WHOLE_34_SIGNATURES_286_CHARTS",
                     "status": "INCOMPLETE_MUST_REFUSE"}):
            with self.assertRaises(checker.Refusal):
                checker.verify_document(doc)
        base = {"schema": checker.SCHEMA, "scope": "WHOLE_34_SIGNATURES_286_CHARTS",
                "status": "COMPLETE", "root_spec": "MIN_ANCHOR_MASK_ORDER_V1",
                "root_count": 286, "roots": [], "stats": {},
                "limits": {"processed_nodes": 32768, "depth": 48, "seconds": 30,
                           "artifact_bytes": 16777216, "state_bytes": 134217728},
                "resumption": "NOT_AUTHORIZED", "global_k6_status": "OPEN",
                "independent_verification": "PENDING"}
        with self.assertRaises(checker.Refusal):
            checker.verify_document(base)
        records = [{"left_mask": m, "left_anchor": a, "right_anchor": b, "tree": "O"}
                   for m, a, b in checker.charts()]
        base["roots"] = records
        records[0]["left_mask"] = 0
        with self.assertRaises(checker.Refusal):
            checker.verify_document(base)
        records[0]["left_mask"] = checker.charts()[0][0]
        with self.assertRaises(checker.Refusal):
            checker.verify_document(base)
        with self.assertRaises(checker.Refusal):
            json.loads('{"schema":"a","schema":"b"}', object_pairs_hook=checker.unique_object)


def run():
    def timeout(_signal, _frame):
        raise TimeoutError("initial checker controls exceeded 4 seconds")
    signal.signal(signal.SIGALRM, timeout)
    signal.setitimer(signal.ITIMER_REAL, 4)
    start = time.perf_counter()
    for name in ("independent_checker.py", "test_independent_checker.py"):
        ast.parse(Path(__file__).with_name(name).read_text())
    result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(Controls))
    chart = (56, 5, 1)
    box = ((37, 37, 0),) + ((0, 0, 0),) * 4
    profile_start = time.perf_counter()
    for _ in range(128):
        checker.positive(chart, box)
    profile = time.perf_counter() - profile_start
    # Fixed high-bit engineering fixture, never a candidate/search point.
    high_h = 62 << 48
    high_bounds = []
    for i, value in enumerate((176, 176, 149, 27, 0, 0)):
        lo = high_h * value // 93 + i * i + i
        high_bounds.append((lo, lo + high_h // 100 + (i + 1) * 17))
    high_start = time.perf_counter()
    max_call_seconds = 0
    cuts = None
    for _ in range(128):
        call_start = time.perf_counter()
        _, _, cuts = checker.core_integral(high_bounds, high_h)
        max_call_seconds = max(max_call_seconds, time.perf_counter() - call_start)
    high_profile = time.perf_counter() - high_start
    elapsed = time.perf_counter() - start
    signal.setitimer(signal.ITIMER_REAL, 0)
    print(json.dumps({"schema": "TIP108C_CHECKER_CONTROLS_V1", "scope": "CONTROL_ONLY",
                      "tests_run": result.testsRun, "passed": result.wasSuccessful(),
                      "profile_calls": 128, "profile_seconds": profile,
                      "high_bit_profile_calls": 128, "high_bit_profile_seconds": high_profile,
                      "high_bit_profile_H": high_h, "high_bit_profile_cuts": cuts,
                      "high_bit_profile_max_call_seconds": max_call_seconds,
                      "high_bit_linear_32768_calls_seconds_NOT_leaf_bound": high_profile * 256,
                      "elapsed_seconds": elapsed,
                      "linear_32768_core_calls_seconds_NOT_leaf_bound": profile * 256}, sort_keys=True))
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(run())
