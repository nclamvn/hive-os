"""TIP115 focused controls; no complete scientific forest execution."""
import argparse
import copy
from fractions import Fraction as F
import hashlib
import importlib.util
import json
from pathlib import Path
import signal
import time
import unittest
from unittest import mock


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


p = load('tip115_under_test', Path(__file__).with_name('producer.py'))
c = load('tip114_independent_unchanged', p.BASE_PATH.with_name('checker.py'))


class Controls(unittest.TestCase):
    details = {}

    @classmethod
    def setUpClass(cls):
        cls.walls = p.base.wall_inventory()
        cls.word = p.base.words()[0]
        cls.sample = tuple(F(999, 1000) * F(v, 31) + F(1, 1009 ** i)
                           for i, v in enumerate((49, 43, 23, 26, 6), 1))
        cls.rows = p.old.incidence_rows(cls.sample)
        cls.path = tuple((cls.walls.index(p.base.canonical(row)),
                          1 if row == p.base.canonical(row) else -1) for row in cls.rows)
        cls.leaf, cache = p.classify(cls.sample, cls.word, cls.path, cls.walls)
        if cls.leaf['kind'] != 'early_stationary' or cache:
            raise AssertionError('FIXED_REAL_EARLY_LEAF_FAILURE')
        cls.root = c.base_rows(cls.word)
        cls.signed_path = tuple(tuple(F(sign * v) for v in cls.walls[index])
                                for index, sign in cls.path)

    def test_01_fixed_real_independent_incidence_slab_stationarity(self):
        self.assertLess(len(self.path), 147)
        self.assertEqual(c.check_incidence(self.leaf['incidence'], self.sample, self.root,
                                          self.signed_path, self.walls), self.rows)
        independent = c.slab_polynomial(self.sample, self.root + self.signed_path)
        self.assertEqual(list(map(str, independent)), self.leaf['polynomial'])
        self.assertEqual(c.check_stationary(self.leaf['stationary'], independent, self.root,
                                            self.signed_path), 'safe')
        self.assertEqual(self.leaf['stationary']['value'], '40/31')
        self.assertEqual(self.leaf['stationary']['nullspace'], [])
        self.details['fixed_real'] = {'incidence_signs': len(self.path), 'legacy_signs': 147,
                                     'value': '40/31', 'rank': 5, 'coverage': 'NONE'}

    def test_02_fallback_never_implication_lp_or_dense_materialization(self):
        with mock.patch.object(p.old, 'direct_implication', side_effect=AssertionError('DIRECT_SCAN')), \
             mock.patch.object(p.old, 'implication', side_effect=AssertionError('IMPLICATION_LP')), \
             mock.patch.object(p.base, 'simplex', side_effect=AssertionError('SIMPLEX')), \
             mock.patch.object(p.old, 'closed_rows', side_effect=AssertionError('DENSE_ROWS')), \
             mock.patch.object(p.old, 'check_implication', side_effect=AssertionError('DENSE_CHECK')):
            node, cache = p.classify(self.sample, self.word, (), self.walls, proofs={self.rows[0]: True})
        self.assertEqual(node['kind'], 'split')
        self.assertIn(node['wall'], [i for i, _ in self.path])
        self.assertEqual(cache, {})

    def test_03_positive_root_path_and_bound_scaling(self):
        available = p.available_rows(self.word, self.path, self.walls)
        a, b = p.old.closed_rows(self.word, self.path, self.walls)
        for row, (index, scale) in available.items():
            weights = ['0'] * len(a)
            weights[index] = str(scale)
            self.assertGreater(scale, 0)
            p.old.check_implication(a, b, row, {'kind': 'nonnegative', 'multipliers': weights})

    def test_04_missing_or_flipped_incidence_refused(self):
        for mutate in ('missing', 'sign'):
            record = copy.deepcopy(self.leaf['incidence'])
            if mutate == 'missing':
                record['rows'].pop()
                record['duals'].pop()
            else:
                record['rows'][0] = [-v for v in record['rows'][0]]
            with self.assertRaisesRegex(c.Refusal, 'INCOMPLETE_OR_ALTERED_INCIDENCE'):
                c.check_incidence(record, self.sample, self.root, self.signed_path, self.walls)

    def test_05_bad_dual_refused(self):
        record = copy.deepcopy(self.leaf['incidence'])
        record['duals'][0]['multipliers'] = ['-1'] * len(record['duals'][0]['multipliers'])
        with self.assertRaisesRegex(c.Refusal, 'NEGATIVE_IMPLICATION'):
            c.check_incidence(record, self.sample, self.root, self.signed_path, self.walls)

    def test_06_actual_polynomial_and_full_stationarity_tamper_refused(self):
        state, ident = self.forest()
        state['nodes'][ident]['polynomial'][0] = str(F(self.leaf['polynomial'][0]) + 1)
        with self.assertRaisesRegex(c.Refusal, 'ALTERED_ACTUAL_UNION_POLYNOMIAL'):
            c.verify(state, 8)
        altered = copy.deepcopy(self.leaf['stationary'])
        altered['value'] = '0'
        poly = tuple(map(F, self.leaf['polynomial']))
        with self.assertRaisesRegex(c.Refusal, 'ALTERED_STATIONARY_VALUE'):
            c.check_stationary(altered, poly, self.root, self.signed_path)

    def forest(self):
        state = p.import_state(json.dumps(p.base.fresh_state()).encode())
        ident = 0
        for index, sign in self.path:
            child = len(state['nodes'])
            state['nodes'].extend(({'kind': 'pending'}, {'kind': 'pending'}))
            state['nodes'][ident] = {'kind': 'split', 'wall': index, 'minus': child, 'plus': child + 1}
            ident = child if sign < 0 else child + 1
        state['nodes'][ident] = copy.deepcopy(self.leaf)
        processed, pending = len(self.path) + 1, len(self.path) + 12
        state['limits'] = {'max_nodes': 1000, 'max_seconds': '8', 'rss_bytes': 1024 ** 3,
                           'evidence_bytes': 64 * 1024 ** 2, 'state_bytes': 512 * 1024 ** 2}
        state['stats'] = {'created_nodes': len(state['nodes']), 'processed_nodes': processed,
                          'pending_nodes': pending, 'splits': len(self.path), 'empty_leaves': 0,
                          'stationary_leaves': 1, 'processed_this_run': processed,
                          'elapsed_seconds': '0', 'reason': 'CONTROL_ONLY'}
        state['run_history'] = [{'elapsed_seconds': '0', 'processed_this_run': processed,
                                 'reason': 'CONTROL_ONLY', 'status': 'INCOMPLETE',
                                 'max_seconds': '8', 'max_nodes': 1000}]
        return state, ident

    def test_07_partial_tree_and_false_complete_refused(self):
        state, _ = self.forest()
        p.pending_paths(state)
        with self.assertRaisesRegex(c.Refusal, 'INCOMPLETE_FOREST_REFUSED'):
            c.verify(state, 8)
        state['status'] = 'COMPLETE'
        state['stats']['reason'] = state['run_history'][0]['reason'] = None
        state['run_history'][0]['status'] = 'COMPLETE'
        with self.assertRaisesRegex(c.Refusal, 'INCOMPLETE_FOREST_REFUSED'):
            c.verify(state, 8)

    def test_08_both_children_and_unique_ownership_required(self):
        state, _ = self.forest()
        state['nodes'][0]['plus'] = state['nodes'][0]['minus']
        with self.assertRaisesRegex(c.Refusal, 'DUPLICATE_SPLIT_CHILD'):
            c.verify(state, 8)
        state, _ = self.forest()
        state['nodes'][0]['minus'] = 0
        with self.assertRaisesRegex(c.Refusal, 'REUSED_NODE_OR_CYCLE'):
            c.verify(state, 8)

    def test_09_saved_import_preserves_entire_forest_and_history(self):
        data = (p.BASE_PATH.parents[1] / 'tip113' / 'COST_PILOT_2.json').read_bytes()
        before, after = json.loads(data), p.import_state(data)
        for field in ('nodes', 'roots', 'run_history', 'model'):
            self.assertEqual(after[field], before[field])
        self.assertEqual(after['origin_sha256'], hashlib.sha256(data).hexdigest())
        self.assertEqual(p.import_state(json.dumps(after).encode()), after)

    def test_10_reused_execution_validation_and_cli_identity(self):
        for name in ('import_state', 'pending_paths', 'produce', 'main'):
            self.assertIs(getattr(p, name), getattr(p.old, name))
        self.assertIs(p.old.classify, p.classify)
        self.assertEqual(hashlib.sha256(p.BASE_PATH.read_bytes()).hexdigest(), p.BASE_SHA)
        self.assertEqual(p.SCHEMA, 'tip114-k6-v2')

    def test_11_entire_singular_family_exclusion_unchanged(self):
        # Synthetic contradictory-path helper control, NOT a geometric early
        # leaf or coverage result. It tests the entire-family exact contract.
        polynomial = (F(0),) * 21
        hessian, linear = c.hessian_linear(polynomial)
        contradictory = c.times(c.ONE, -1)
        inequalities = c.lp_rows(self.root, (contradictory,), hessian, linear)
        weights = ['0'] * len(inequalities)
        weights[35] = '1'
        record = {'kind': 'unsafe_empty', 'particular': ['0'] * 5, 'value': '0',
                  'nullspace': [[str(int(i == j)) for i in range(5)] for j in range(5)],
                  'dual': {'kind': 'farkas', 'multipliers': weights}}
        self.assertEqual(c.check_stationary(record, polynomial, self.root, (contradictory,)), 'unsafe_empty')
        record['nullspace'].pop()
        with self.assertRaisesRegex(c.Refusal, 'INCOMPLETE_NULLSPACE'):
            c.check_stationary(record, polynomial, self.root, (contradictory,))
        self.assertIs(p.base.stationary_record, p.old.base.stationary_record)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    if args.out.exists():
        parser.error('create-only output')
    def expired(_signum, _frame):
        raise TimeoutError('TEST_OUTER_10_SECONDS')
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(10)
    start = time.monotonic()
    result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(Controls))
    payload = {'status': 'PASS' if result.wasSuccessful() else 'FAIL', 'tests_run': result.testsRun,
               'failures': [(str(t), s) for t, s in result.failures],
               'errors': [(str(t), s) for t, s in result.errors], 'details': Controls.details,
               'elapsed_seconds': time.monotonic() - start, 'coverage': 'NONE',
               'source_sha256': hashlib.sha256(Path(__file__).with_name('producer.py').read_bytes()).hexdigest(),
               'test_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    with args.out.open('x') as stream:
        json.dump(payload, stream, sort_keys=True, indent=2)
        stream.write('\n')
    signal.alarm(0)
    print(json.dumps({'status': payload['status'], 'tests_run': result.testsRun}))
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    raise SystemExit(main())
