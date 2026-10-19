"""Bounded independent TIP114 controls; no producer imports or whole production."""
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
    kinds = [node["kind"] for node in data["nodes"]]
    pending = kinds.count("pending")
    processed = len(kinds) - pending
    data["stats"] = {"created_nodes": len(kinds), "processed_nodes": processed,
                     "pending_nodes": pending, "splits": kinds.count("split"),
                     "empty_leaves": kinds.count("empty"),
                     "stationary_leaves": kinds.count("stationary") + kinds.count("early_stationary"),
                     "processed_this_run": processed, "elapsed_seconds": "0",
                     "reason": None if data["status"] == "COMPLETE" else "CONTROL_ONLY"}
    data["run_history"] = ([{"elapsed_seconds": "0", "processed_this_run": processed,
                             "reason": data["stats"]["reason"], "status": data["status"],
                             "max_seconds": data["limits"]["max_seconds"],
                             "max_nodes": data["limits"]["max_nodes"]}] if processed else [])
    return data


def skeleton(planes):
    data = {"schema": "tip114-k6-v2", "origin_sha256": "a" * 64,
            "status": "INCOMPLETE", "model": model(planes),
            "roots": [{"word": list(w), "node": i} for i, w in enumerate(c.words())],
            "nodes": [{"kind": "pending"} for _ in range(13)],
            "limits": {"max_nodes": 1000, "max_seconds": "8.0", "rss_bytes": 1024 ** 3,
                       "evidence_bytes": 64 * 1024 ** 2, "state_bytes": 512 * 1024 ** 2}}
    return accounting(data)


def direct_incidence(rows, root, path):
    """Test-only explicit one-row duals; not a producer or LP implementation."""
    inequalities = c.closed_lp_rows(root, path)
    certificates = []
    for row in rows:
        index = path.index(tuple(map(F, row)))
        weights = ["0"] * len(inequalities)
        weights[len(root) + index] = "1"
        certificates.append({"kind": "nonnegative", "multipliers": weights})
    return {"rows": [list(row) for row in rows], "duals": certificates}


def branch_forest(planes, path, leaf):
    data = skeleton(planes)
    identity = 0
    for row in path:
        wall = c.old.canonical(tuple(map(int, row)))
        index = planes.index(wall)
        minus, plus = len(data["nodes"]), len(data["nodes"]) + 1
        data["nodes"][identity] = {"kind": "split", "wall": index, "minus": minus, "plus": plus}
        data["nodes"].extend(({"kind": "pending"}, {"kind": "pending"}))
        identity = plus if tuple(map(F, wall)) == row else minus
    data["nodes"][identity] = leaf
    return accounting(data), identity


class CheckerControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.planes = c.wall_inventory(TEST_GUARD)
        cls.root = c.base_rows(c.words()[0])
        cls.star = tuple(F(v, 31) for v in (49, 43, 23, 26, 6))
        cls.sample = tuple(F(999, 1000) * value + F(1, 1009 ** i)
                           for i, value in enumerate(cls.star, 1))
        cls.rows = c.incidence_rows(cls.sample, cls.planes, TEST_GUARD)
        cls.path = tuple(tuple(map(F, row)) for row in cls.rows)
        cls.incidence = direct_incidence(cls.rows, cls.root, cls.path)
        cls.polynomial = c.slab_polynomial(cls.sample, cls.root + cls.path, TEST_GUARD)
        hessian, linear = c.hessian_linear(cls.polynomial)
        particular, nullspace, _ = c.eliminate(hessian, [-v for v in linear], guard=TEST_GUARD)
        cls.stationary = {"kind": "safe", "particular": list(map(str, particular)),
                          "nullspace": [list(map(str, row)) for row in nullspace],
                          "value": str(c.poly_value(cls.polynomial, particular))}
        cls.leaf = {"kind": "early_stationary", "sample": list(map(str, cls.sample)),
                    "polynomial": list(map(str, cls.polynomial)),
                    "stationary": cls.stationary, "incidence": cls.incidence}
        cls.forest, cls.leaf_id = branch_forest(cls.planes, cls.path, cls.leaf)
        full_path = tuple(tuple(F(v if c.evaluate(row, cls.sample) > 0 else -v) for v in row)
                          for row in cls.planes)
        legacy = {key: value for key, value in cls.leaf.items() if key != "incidence"}
        legacy["kind"] = "stationary"
        cls.legacy_forest, cls.legacy_leaf_id = branch_forest(cls.planes, full_path, legacy)

    def setUp(self):
        TEST_GUARD()

    def refusal(self, message, function, *args):
        with self.assertRaisesRegex(c.Refusal, message):
            function(*args)

    def test_signed_normalization_and_constants(self):
        self.assertEqual(c.signed_primitive((F(-2, 3), F(4, 3), 0, 0, 0, F(2, 3))),
                         (-1, 2, 0, 0, 0, 1))
        self.assertIsNone(c.signed_primitive(c.ZERO))
        self.assertIsNone(c.signed_primitive(c.ONE))
        self.refusal("NEGATIVE_CONSTANT", c.signed_primitive, c.times(c.ONE, -1))

    def test_closed_root_epsilon_and_direct_implication(self):
        inequalities = c.closed_lp_rows(self.root, self.path)
        self.assertEqual(len(inequalities), 35 + len(self.path) + 6)
        self.assertTrue(all(not row[5] for row, _ in inequalities[:-1]))
        for row, dual in zip(self.rows, self.incidence["duals"]):
            c.check_implication(dual, row, inequalities)

    def test_implication_negative_kind_coefficient_and_bound(self):
        inequalities = c.closed_lp_rows(self.root, self.path)
        dual = copy.deepcopy(self.incidence["duals"][0])
        index = dual["multipliers"].index("1")
        dual["multipliers"][index] = "-1"
        self.refusal("NEGATIVE_IMPLICATION", c.check_implication, dual, self.rows[0], inequalities)
        zero = {"kind": "nonnegative", "multipliers": ["0"] * len(inequalities)}
        self.refusal("IMPLICATION_COEFFICIENT", c.check_implication, zero, (-1, 0, 0, 0, 0, 1), inequalities)
        self.refusal("IMPLICATION_BOUND", c.check_implication, zero, (0, 0, 0, 0, 0, -1), inequalities)
        zero["kind"] = "epsilon_bound"
        self.refusal("BAD_IMPLICATION_KIND", c.check_implication, zero, self.rows[0], inequalities)

    def test_fixed_real_partial_cell_reduction(self):
        self.assertLess(len(self.path), 147)
        self.assertGreater(len(self.path), 0)
        self.assertEqual(c.check_incidence(self.incidence, self.sample, self.root, self.path,
                                           self.planes, TEST_GUARD), self.rows)
        self.assertEqual(c.check_stationary(self.stationary, self.polynomial, self.root,
                                            self.path, TEST_GUARD), "safe")
        self.assertEqual(c.poly_value(self.polynomial, self.star), c.TARGET)
        self.assertEqual(c.eliminate(*self._stationary_system(), guard=TEST_GUARD), (self.star, (), 5))

    def _stationary_system(self):
        hessian, linear = c.hessian_linear(self.polynomial)
        return hessian, [-v for v in linear]

    def test_actual_expected_21_coefficients(self):
        raw = ((7, -6, -1, 0, 0), (-6, F(33, 2), -9, -3, F(3, 2)),
               (-1, -9, 13, 0, -3), (0, -3, 0, 13, -9), (0, F(3, 2), -3, -9, F(33, 2)))
        forms = [tuple(F(int(i == j)) for i in range(5)) + (-self.star[j],) for j in range(5)]
        expected = c.times(c.multiply(c.ONE, c.ONE), c.TARGET)
        for i in range(5):
            for j in range(5):
                expected = c.add(expected, c.multiply(forms[i], forms[j]), F(raw[i][j]) / 12)
        self.assertEqual(self.polynomial, expected)

    def test_partial_early_forest_never_completes(self):
        self.refusal("INCOMPLETE_FOREST_REFUSED", c.verify, self.forest, 8)
        data = copy.deepcopy(self.forest)
        data["status"] = "COMPLETE"
        accounting(data)
        self.refusal("INCOMPLETE_FOREST_REFUSED", c.verify, data, 8)

    def test_missing_incidence_row_dual_and_flipped_sign(self):
        data = copy.deepcopy(self.forest)
        record = data["nodes"][self.leaf_id]["incidence"]
        record["rows"].pop()
        record["duals"].pop()
        self.refusal("INCOMPLETE_OR_ALTERED_INCIDENCE", c.verify, data, 8)
        data = copy.deepcopy(self.forest)
        data["nodes"][self.leaf_id]["incidence"]["duals"].pop()
        self.refusal("MISSING_INCIDENCE_DUALS", c.verify, data, 8)
        data = copy.deepcopy(self.forest)
        record = data["nodes"][self.leaf_id]["incidence"]
        record["rows"][0] = [-v for v in record["rows"][0]]
        self.refusal("INCOMPLETE_OR_ALTERED_INCIDENCE", c.verify, data, 8)

    def test_false_early_polynomial_and_stationary_value(self):
        data = copy.deepcopy(self.forest)
        data["nodes"][self.leaf_id]["polynomial"][0] = str(self.polynomial[0] + 1)
        self.refusal("ALTERED_ACTUAL_UNION_POLYNOMIAL", c.verify, data, 8)
        data = copy.deepcopy(self.forest)
        data["nodes"][self.leaf_id]["stationary"]["value"] = "0"
        self.refusal("ALTERED_STATIONARY_VALUE", c.verify, data, 8)

    def test_reordered_rows_noninteger_and_sample_on_wall(self):
        record = copy.deepcopy(self.incidence)
        record["rows"].reverse()
        record["duals"].reverse()
        self.refusal("INCOMPLETE_OR_ALTERED_INCIDENCE", c.check_incidence, record,
                     self.sample, self.root, self.path, self.planes, TEST_GUARD)
        record["rows"][0][0] = True
        self.refusal("NONINTEGER_INCIDENCE", c.check_incidence, record,
                     self.sample, self.root, self.path, self.planes, TEST_GUARD)
        # p*=49/31 is a root RANGE boundary, not an event-wall coincidence.
        # Zero offsets lie on the homogeneous wall p2-p1=0 (unitclip LL1/LL2).
        self.refusal("NONGENERIC_INCIDENCE_SAMPLE", c.incidence_rows, (F(0),) * 5, self.planes, TEST_GUARD)

    def test_any_order_splits_and_repeated_wall(self):
        data = skeleton(self.planes)
        data["nodes"][0] = {"kind": "split", "wall": 146, "minus": 13, "plus": 14}
        data["nodes"].extend(({"kind": "pending"}, {"kind": "pending"}))
        accounting(data)
        self.refusal("INCOMPLETE_FOREST_REFUSED", c.verify, data, 8)
        data["nodes"][14] = {"kind": "split", "wall": 146, "minus": 15, "plus": 16}
        data["nodes"].extend(({"kind": "pending"}, {"kind": "pending"}))
        accounting(data)
        self.refusal("REPEATED_WALL_ON_PATH", c.verify, data, 8)

    def test_missing_roots_children_cycle_and_unreachable(self):
        data = skeleton(self.planes)
        data["roots"].pop()
        self.refusal("MISSING_ROOTS", c.verify, data, 8)
        data = skeleton(self.planes)
        data["nodes"][0] = {"kind": "split", "wall": 146, "minus": 13}
        self.refusal("MISSING_SPLIT_CHILD", c.verify, data, 8)
        data["nodes"][0]["plus"] = 13
        self.refusal("DUPLICATE_SPLIT_CHILD", c.verify, data, 8)
        data["nodes"][0]["minus"] = 0
        data["nodes"].append({"kind": "pending"})
        self.refusal("REUSED_NODE_OR_CYCLE", c.verify, data, 8)
        data = skeleton(self.planes)
        data["nodes"].append({"kind": "pending"})
        self.refusal("UNREACHABLE_NODE", c.verify, data, 8)

    def test_model_origin_and_history_tamper(self):
        data = skeleton(self.planes)
        data["model"]["walls"][0][0] = True
        self.refusal("NONINTEGER_MODEL", c.verify, data, 8)
        data = skeleton(self.planes)
        data["origin_sha256"] = "A" * 64
        self.refusal("BAD_ORIGIN_SHA256", c.verify, data, 8)
        data = copy.deepcopy(self.forest)
        data["run_history"][0]["processed_this_run"] -= 1
        self.refusal("RUN_HISTORY_CUMULATIVE", c.verify, data, 8)
        data = copy.deepcopy(self.forest)
        data["stats"]["stationary_leaves"] = 0
        self.refusal("FOREST_ACCOUNTING", c.verify, data, 8)

    def test_legacy_full_leaf_still_checks_and_partial_full_refuses(self):
        self.refusal("INCOMPLETE_FOREST_REFUSED", c.verify, self.legacy_forest, 8)
        data = copy.deepcopy(self.forest)
        leaf = data["nodes"][self.leaf_id]
        leaf["kind"] = "stationary"
        del leaf["incidence"]
        self.refusal("UNPROCESSED_WALLS_AT_STATIONARY_LEAF", c.verify, data, 8)

    def test_singular_safe_requires_entire_basis(self):
        polynomial = c.times(c.multiply(c.ONE, c.ONE), c.TARGET)
        record = {"kind": "safe", "particular": ["0"] * 5,
                  "nullspace": [[str(int(i == j)) for i in range(5)] for j in range(5)], "value": "40/31"}
        self.assertEqual(c.check_stationary(record, polynomial, self.root, (), TEST_GUARD), "safe")
        record["nullspace"].pop()
        self.refusal("INCOMPLETE_NULLSPACE", c.check_stationary, record, polynomial, self.root, (), TEST_GUARD)

    def test_unsafe_singular_entire_family_not_only_particular(self):
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
        record["particular"] = ["100"] * 5
        record["dual"] = {"kind": "epsilon_bound", "multipliers": ["0"] * len(c.lp_rows(self.root, (), hessian, linear))}
        self.refusal("DUAL_COEFFICIENT", c.check_stationary, record, polynomial, self.root, (), TEST_GUARD)

    def test_inconsistent_full_gradient_and_exact_empty(self):
        polynomial = list((F(0),) * 21)
        polynomial[c.TERMS.index((0, 5))] = 1
        self.assertEqual(c.check_stationary({"kind": "inconsistent"}, tuple(polynomial), self.root, (), TEST_GUARD), "inconsistent")
        inequalities = c.lp_rows(self.root, (c.ZERO,))
        weights = ["0"] * len(inequalities)
        weights[35] = "1"
        self.assertEqual(c.check_dual({"kind": "epsilon_bound", "multipliers": weights}, inequalities), 0)


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
    report = {"schema": "TIP114_CHECKER_CONTROLS_V2", "scope": "CONTROL_ONLY_NOT_WHOLE_PRODUCTION",
              "tests": result.testsRun, "failures": len(result.failures), "errors": len(result.errors),
              "elapsed_seconds": time.monotonic() - start, "coverage": "NONE", "whole_cost_qualified": False,
              "fixed_real_incidence_wall_count": len(CheckerControls.rows) if hasattr(CheckerControls, "rows") else None,
              "legacy_wall_count": 147}
    print(json.dumps(report, sort_keys=True))
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
