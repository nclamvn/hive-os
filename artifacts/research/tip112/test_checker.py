"""Focused bounded independent-checker controls, NOT whole K6 production."""
import argparse
import copy
from fractions import Fraction as F
import json
import signal
import time
import unittest

import checker as c

TEST_GUARD = None


def model(planes):
    return {"gauge": "p6=0;A_j=p_j+j", "range": "49/31", "target_G": "40/31",
            "terms": [list(t) for t in c.TERMS], "walls": [list(p) for p in planes],
            "words": [list(w) for w in c.words()]}


def accounting(data):
    kinds = [n["kind"] for n in data["nodes"]]
    pending = kinds.count("pending")
    processed = len(kinds) - pending
    data["stats"] = {"created_nodes": len(kinds), "processed_nodes": processed,
                     "pending_nodes": pending, "splits": kinds.count("split"),
                     "empty_leaves": kinds.count("empty"), "stationary_leaves": kinds.count("stationary"),
                     "processed_this_run": processed, "elapsed_seconds": "0",
                     "reason": None if data["status"] == "COMPLETE" else "CONTROL_ONLY"}
    data["run_history"] = ([{"elapsed_seconds": "0", "processed_this_run": processed,
                             "reason": data["stats"]["reason"], "status": data["status"],
                             "max_seconds": data["limits"]["max_seconds"],
                             "max_nodes": data["limits"]["max_nodes"]}] if processed else [])
    return data


def skeleton(planes):
    data = {"schema": "tip112-k6-v1", "status": "INCOMPLETE", "model": model(planes),
            "roots": [{"word": list(w), "node": i} for i, w in enumerate(c.words())],
            "nodes": [{"kind": "pending"} for _ in range(13)],
            "limits": {"max_nodes": 1000, "max_seconds": "8.0", "rss_bytes": 1024 ** 3,
                       "evidence_bytes": 64 * 1024 ** 2, "state_bytes": 512 * 1024 ** 2}}
    return accounting(data)


def safe_record(point, polynomial):
    hessian, linear = c.hessian_linear(polynomial)
    particular, nullspace, _ = c.eliminate(hessian, [-v for v in linear])
    return {"kind": "safe", "particular": list(map(str, particular)),
            "nullspace": [list(map(str, row)) for row in nullspace],
            "value": str(c.poly_value(polynomial, point))}


class CheckerControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.planes = c.wall_inventory(TEST_GUARD)
        cls.root = c.base_rows(c.words()[0])
        cls.star = tuple(F(v, 31) for v in (49, 43, 23, 26, 6))
        cls.sample = tuple(F(999, 1000) * value + F(1, 1009 ** i)
                           for i, value in enumerate(cls.star, 1))
        values = [c.evaluate(tuple(map(F, row)), cls.sample) for row in cls.planes]
        if any(not v for v in values):
            raise AssertionError("DECLARED_REAL_CONTROL_ON_COARSE_WALL")
        cls.path = tuple(tuple(F(x if value > 0 else -x) for x in row)
                         for row, value in zip(cls.planes, values))
        cls.polynomial = c.slab_polynomial(cls.sample, cls.root + cls.path, TEST_GUARD)
        cls.record = safe_record(cls.star, cls.polynomial)
        cls.forest = skeleton(cls.planes)
        identity = 0
        for index, value in enumerate(values):
            minus, plus = len(cls.forest["nodes"]), len(cls.forest["nodes"]) + 1
            cls.forest["nodes"][identity] = {"kind": "split", "wall": index,
                                           "minus": minus, "plus": plus}
            cls.forest["nodes"].extend(({"kind": "pending"}, {"kind": "pending"}))
            identity = plus if value > 0 else minus
        cls.leaf_id = identity
        cls.forest["nodes"][identity] = {"kind": "stationary", "sample": list(map(str, cls.sample)),
                                        "polynomial": list(map(str, cls.polynomial)),
                                        "stationary": cls.record}
        accounting(cls.forest)

    def setUp(self):
        TEST_GUARD()

    def refusal(self, message, function, *args):
        with self.assertRaisesRegex(c.Refusal, message):
            function(*args)

    def test_model_inventory(self):
        self.assertEqual(len(c.words()), 13)
        self.assertEqual(len(self.planes), 147)
        self.assertEqual(len(self.root), 35)
        self.assertEqual(len(c.TERMS), 21)
        c.check_model(model(self.planes), TEST_GUARD)

    def test_actual_21coefficients_rank5_value(self):
        # Retained hand regional/local Hessian in physical x; G(p)=6F(p/6)
        # therefore has Hessian H_x/6. This exact fixed control is not a fit.
        raw = ((7, -6, -1, 0, 0),
               (-6, F(33, 2), -9, -3, F(3, 2)),
               (-1, -9, 13, 0, -3),
               (0, -3, 0, 13, -9),
               (0, F(3, 2), -3, -9, F(33, 2)))
        expected_hessian = tuple(tuple(F(v) / 6 for v in row) for row in raw)
        forms = [tuple(F(int(i == j)) for i in range(5)) + (-self.star[j],) for j in range(5)]
        expected = c.times(c.multiply(c.ONE, c.ONE), c.TARGET)
        for i in range(5):
            for j in range(5):
                expected = c.add(expected, c.multiply(forms[i], forms[j]), expected_hessian[i][j] / 2)
        self.assertEqual(self.polynomial, expected)
        hessian, linear = c.hessian_linear(self.polynomial)
        self.assertEqual(hessian, expected_hessian)
        solution = c.eliminate(hessian, [-v for v in linear], guard=TEST_GUARD)
        self.assertEqual(solution, (self.star, (), 5))
        self.assertEqual(c.poly_value(self.polynomial, self.star), c.TARGET)
        self.assertEqual(c.check_stationary(self.record, self.polynomial, self.root, self.path, TEST_GUARD), "safe")

    def test_real_partial_forest_must_refuse(self):
        self.refusal("INCOMPLETE_FOREST_REFUSED", c.verify, self.forest, 8)

    def test_altered_real_polynomial(self):
        data = copy.deepcopy(self.forest)
        data["nodes"][self.leaf_id]["polynomial"][0] = str(self.polynomial[0] + 1)
        self.refusal("ALTERED_ACTUAL_UNION_POLYNOMIAL", c.verify, data, 8)

    def test_altered_real_stationary_value(self):
        data = copy.deepcopy(self.forest)
        data["nodes"][self.leaf_id]["stationary"]["value"] = "0"
        self.refusal("ALTERED_STATIONARY_VALUE", c.verify, data, 8)

    def test_missing_root(self):
        data = skeleton(self.planes)
        data["roots"].pop()
        self.refusal("MISSING_ROOTS", c.verify, data, 8)

    def test_missing_child_and_reused_child(self):
        data = skeleton(self.planes)
        data["nodes"][0] = {"kind": "split", "wall": 0, "minus": 13}
        data["nodes"].append({"kind": "pending"})
        self.refusal("MISSING_SPLIT_CHILD", c.verify, data, 8)
        data["nodes"][0]["plus"] = 13
        self.refusal("DUPLICATE_SPLIT_CHILD", c.verify, data, 8)

    def test_cycle_extra_node_and_wrong_wall(self):
        data = skeleton(self.planes)
        data["nodes"].append({"kind": "pending"})
        self.refusal("UNREACHABLE_NODE", c.verify, data, 8)
        data["nodes"][0] = {"kind": "split", "wall": 0, "minus": 0, "plus": 13}
        self.refusal("REUSED_NODE_OR_CYCLE", c.verify, data, 8)
        data["nodes"][0]["wall"] = 1
        self.refusal("WALL_SPLIT_ORDER", c.verify, data, 8)

    def test_fake_complete_pending(self):
        data = skeleton(self.planes)
        data["status"] = "COMPLETE"
        accounting(data)
        self.refusal("INCOMPLETE_FOREST_REFUSED", c.verify, data, 8)

    def test_metadata_and_inventory_tamper(self):
        data = skeleton(self.planes)
        data["model"]["walls"][0][0] = True
        self.refusal("NONINTEGER_MODEL", c.verify, data, 8)
        data = skeleton(self.planes)
        data["stats"]["pending_nodes"] = 0
        self.refusal("FOREST_ACCOUNTING", c.verify, data, 8)

    def test_exact_empty_epsilon_and_negative_dual(self):
        inequalities = c.lp_rows(self.root, (c.ZERO,))
        weights = ["0"] * len(inequalities)
        weights[35] = "1"  # zero strict row independently implies epsilon<=0
        dual = {"kind": "epsilon_bound", "multipliers": weights}
        self.assertEqual(c.check_dual(dual, inequalities), 0)
        dual["multipliers"][35] = "-1"
        self.refusal("NEGATIVE_DUAL", c.check_dual, dual, inequalities)

    def test_consistent_singular_safe_and_bad_basis(self):
        polynomial = c.times(c.multiply(c.ONE, c.ONE), c.TARGET)
        record = {"kind": "safe", "particular": ["0"] * 5,
                  "nullspace": [[str(int(i == j)) for i in range(5)] for j in range(5)],
                  "value": "40/31"}
        self.assertEqual(c.check_stationary(record, polynomial, self.root, (), TEST_GUARD), "safe")
        record["nullspace"].pop()
        self.refusal("INCOMPLETE_NULLSPACE", c.check_stationary, record, polynomial, self.root, (), TEST_GUARD)

    def test_entire_unsafe_singular_family_dual(self):
        polynomial = (F(0),) * 21
        record = {"kind": "unsafe_empty", "particular": ["0"] * 5,
                  "nullspace": [[str(int(i == j)) for i in range(5)] for j in range(5)], "value": "0"}
        contradictory = c.times(c.ONE, -1)
        hessian, linear = c.hessian_linear(polynomial)
        inequalities = c.lp_rows(self.root, (contradictory,), hessian, linear)
        weights = ["0"] * len(inequalities)
        weights[35] = "1"
        record["dual"] = {"kind": "farkas", "multipliers": weights}
        self.assertEqual(c.check_stationary(record, polynomial, self.root, (contradictory,), TEST_GUARD), "unsafe_empty")
        # An infeasible particular is NOT enough: full constant-Q family remains
        # feasible under the root when the contradictory cell row is absent.
        record["particular"] = ["100"] * 5
        record["dual"] = {"kind": "epsilon_bound", "multipliers": ["0"] * len(c.lp_rows(self.root, (), hessian, linear))}
        self.refusal("DUAL_COEFFICIENT", c.check_stationary, record, polynomial, self.root, (), TEST_GUARD)

    def test_inconsistent_full_gradient(self):
        polynomial = list((F(0),) * 21)
        polynomial[c.TERMS.index((0, 5))] = 1
        self.assertEqual(c.check_stationary({"kind": "inconsistent"}, tuple(polynomial), self.root, (), TEST_GUARD), "inconsistent")
        self.refusal("FALSE_INCONSISTENT_RECORD", c.check_stationary,
                     {"kind": "inconsistent", "value": "0"}, tuple(polynomial), self.root, (), TEST_GUARD)

    def test_false_farkas_and_inexact_scalar(self):
        self.refusal("BAD_RATIONAL", c.rational, 0.5)
        self.refusal("BAD_RATIONAL", c.rational, True)
        inequalities = c.lp_rows(self.root, ())
        self.refusal("DUAL_FARKAS_NOT_NEGATIVE", c.check_dual,
                     {"kind": "farkas", "multipliers": ["0"] * len(inequalities)}, inequalities)


def main():
    global TEST_GUARD
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seconds", type=int, default=8)
    args = parser.parse_args()
    if not 0 < args.seconds <= 8:
        raise SystemExit("test seconds must be in(0,8]")
    def expired(_signum, _frame):
        raise c.Refusal("OUTER_TEST_TIME_LIMIT")
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(args.seconds + 2)
    TEST_GUARD = c.Guard(args.seconds)
    start = time.monotonic()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(CheckerControls)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    report = {"schema": "TIP112_CHECKER_CONTROLS_V1", "scope": "CONTROL_ONLY_NOT_WHOLE_PRODUCTION",
              "tests": result.testsRun, "failures": len(result.failures), "errors": len(result.errors),
              "elapsed_seconds": time.monotonic() - start, "coverage": "NONE",
              "whole_cost_qualified": False}
    print(json.dumps(report, sort_keys=True))
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
