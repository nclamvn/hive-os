"""Focused TIP114 producer controls, not a scientific forest campaign."""
from fractions import Fraction as F
from pathlib import Path
from unittest import mock
import argparse
import copy
import hashlib
import importlib.util
import json
import signal
import time
import unittest

_spec = importlib.util.spec_from_file_location('tip114_producer_under_test', Path(__file__).with_name('producer.py'))
p = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(p)


def initial():
    return p.import_state(json.dumps(p.base.fresh_state(), sort_keys=True).encode())


def fixed_real():
    return tuple(F(999, 1000) * v + F(1, 1009 ** i)
                 for i, v in enumerate((F(49,31), F(43,31), F(23,31), F(26,31), F(6,31)), 1))


def real_early_forest():
    state, sample, walls = initial(), fixed_real(), p.base.wall_inventory()
    rows = p.incidence_rows(sample)
    path = []
    ident = 0
    for row in rows:
        index = walls.index(p.base.canonical(row))
        sign = 1 if tuple(row) == walls[index] else -1
        child = len(state['nodes'])
        state['nodes'].extend(({'kind':'pending'}, {'kind':'pending'}))
        state['nodes'][ident] = {'kind':'split','wall':index,'minus':child,'plus':child+1}
        ident = child if sign < 0 else child + 1
        path.append((index, sign))
    node, _ = p.classify(sample, p.base.words()[0], tuple(path), walls)
    if node['kind'] != 'early_stationary':
        raise AssertionError('fixed required-sign control did not terminate early')
    state['nodes'][ident] = node
    # This is an INCOMPLETE fixed test forest, not a complete certificate.
    count = len(path) + 1
    state['run_history'] = [{'elapsed_seconds':'0.000000000','processed_this_run':count,
                            'reason':'CONTROL_ONLY','status':'INCOMPLETE',
                            'max_seconds':'1.000000000','max_nodes':count}]
    return state, ident, tuple(path)


class Controls(unittest.TestCase):
    details = {}

    def test_01_positive_normalization(self):
        self.assertEqual(p.signed_primitive((F(-1,2),0,0,0,0,F(3,2))), (-1,0,0,0,0,3))
        self.assertIsNone(p.signed_primitive((0,0,0,0,0,2)))
        with self.assertRaisesRegex(ValueError, 'NEGATIVE_CONSTANT'):
            p.signed_primitive((0,0,0,0,0,-1))

    def test_02_closed_lp_and_direct_dual(self):
        walls = p.base.wall_inventory()
        a,b = p.closed_rows(p.base.words()[0], (), walls)
        self.assertEqual(len(a),41)
        self.assertTrue(all(row[5] == 0 for row in a[:35]))
        row = (-1,1,0,0,0,1)
        cert = p.direct_implication(a,b,row)
        self.assertIsNotNone(cert)
        self.assertTrue(p.check_implication(a,b,row,cert))
        tamper = copy.deepcopy(cert)
        tamper['multipliers'] = ['0'] * len(a)
        with self.assertRaises(ValueError):
            p.check_implication(a,b,row,tamper)

    def test_03_unresolved_exact_lp(self):
        a,b = p.closed_rows(p.base.words()[0], (), p.base.wall_inventory())
        self.assertIsNone(p.implication(a,b,(1,0,0,0,0,-1)))

    def test_04_generic_refinement(self):
        walls = p.base.wall_inventory()
        sample = p.generic_sample((F(0),)*5, p.base.words()[0], (), walls)
        self.assertTrue(all(p.base.dot(w,sample+(F(1),)) for w in walls))
        self.assertTrue(all(p.base.dot(w,sample+(F(1),)) > 0 for w,_ in p.base.root_rows(p.base.words()[0])))

    def test_05_real_inventory_and_early_stationarity(self):
        state, ident, path = real_early_forest()
        leaf = state['nodes'][ident]
        self.assertLess(len(path),147)
        self.assertEqual(leaf['stationary']['kind'],'safe')
        self.assertEqual(leaf['stationary']['value'],'40/31')
        self.assertEqual(len(leaf['polynomial']),21)
        self.assertEqual(leaf['stationary']['nullspace'],[])
        p.pending_paths(state)
        self.details['real_control'] = {'required_signs':len(path),'legacy_required_signs':147,
            'incidence_rows':len(leaf['incidence']['rows']),'stationary_value':leaf['stationary']['value'],
            'rank':5,'sample':leaf['sample'],'polynomial':leaf['polynomial'],
            'scope':'ONE_FIXED_PARTIAL_CELL_CONTROL_NOT_ROOT_COVERAGE'}

    def test_06_missing_incidence_refused(self):
        state, ident, _ = real_early_forest()
        state['nodes'][ident]['incidence']['rows'].pop()
        with self.assertRaisesRegex(ValueError,'INCIDENCE_INVENTORY'):
            p.pending_paths(state)

    def test_07_bad_incidence_dual_refused(self):
        state, ident, _ = real_early_forest()
        state['nodes'][ident]['incidence']['duals'][0]['multipliers'] = ['-1'] * len(state['nodes'][ident]['incidence']['duals'][0]['multipliers'])
        with self.assertRaisesRegex(ValueError,'IMPLICATION_MULTIPLIERS'):
            p.pending_paths(state)

    def test_08_inheritance_insert_position(self):
        walls = p.base.wall_inventory()
        a,b = p.closed_rows(p.base.words()[0], (), walls)
        row = (-1,1,0,0,0,1)
        cert = p.direct_implication(a,b,row)
        inherited = p.inherited_child({row:cert},0)[row]
        for sign in (-1,1):
            aa,bb = p.closed_rows(p.base.words()[0],((0,sign),),walls)
            self.assertTrue(p.check_implication(aa,bb,row,inherited))

    def test_09_import_preserves_history_roots_nodes(self):
        old = p.base.fresh_state()
        old['run_history'] = []
        data = json.dumps(old,sort_keys=True).encode()
        new = p.import_state(data)
        for name in ('nodes','roots','run_history','model'):
            self.assertEqual(new[name],old[name])
        self.assertEqual(new['origin_sha256'],hashlib.sha256(data).hexdigest())
        again = p.import_state(json.dumps(new).encode())
        self.assertEqual(again['origin_sha256'],new['origin_sha256'])

    def test_10_repeated_wall_and_missing_child(self):
        state = initial()
        state['nodes'].extend(({'kind':'pending'},{'kind':'split','wall':0,'minus':13,'plus':15},{'kind':'pending'}))
        state['nodes'][0] = {'kind':'split','wall':0,'minus':13,'plus':14}
        with self.assertRaisesRegex(ValueError,'INVALID_SPLIT'):
            p.pending_paths(state)
        state = initial()
        state['nodes'][0] = {'kind':'split','wall':1,'minus':13,'plus':14}
        with self.assertRaisesRegex(ValueError,'INVALID_TREE'):
            p.pending_paths(state)

    def test_11_timeout_never_complete(self):
        state = initial()
        with mock.patch.object(p,'pending_paths',side_effect=TimeoutError('MOCK_LIMIT')):
            result = p.produce(state,1,1)
        self.assertEqual(result['status'],'INCOMPLETE')
        self.assertEqual(result['stats']['processed_this_run'],0)
        self.assertEqual(result['run_history'][-1]['reason'],'MOCK_LIMIT')

    def test_12_whole_singular_family_exclusion(self):
        # Q=p1+constant has inconsistent full stationarity, not a face KKT.
        poly = tuple(F(1) if t == (0,5) else F(0) for t in p.base.TERMS)
        self.assertEqual(p.base.stationary_record(poly,p.base.words()[0],(),p.base.wall_inventory(),lambda:None), {'kind':'inconsistent'})
        # Flat unsafe Q=0 needs exclusion of its ENTIRE 5D family; roots contain
        # true feasible points, so it is not licensed as unsafe_empty. Instead
        # test the exact full-nullspace algebra without invoking a physical
        # witness on a deliberately nonphysical polynomial.
        solution = p.base.eliminate(((F(0),)*5,)*5,(F(0),)*5)
        self.assertEqual(len(solution[1]),5)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out',type=Path,required=True)
    args = parser.parse_args()
    if args.out.exists():
        parser.error('create-only output')
    def expired(signum,frame):
        raise TimeoutError('TEST_OUTER_20_SECONDS')
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(20)
    start = time.monotonic()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Controls)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    elapsed = time.monotonic()-start
    payload = {'scope':'FOCUSED_CONTROLS_ONLY_NOT_COMPLETE_COVERAGE','status':'PASS' if result.wasSuccessful() else 'FAIL',
        'tests_run':result.testsRun,'failures':[(str(t),s) for t,s in result.failures],
        'errors':[(str(t),s) for t,s in result.errors],'elapsed_seconds':format(elapsed,'.9f'),
        'source_sha256':hashlib.sha256(Path(__file__).with_name('producer.py').read_bytes()).hexdigest(),
        'test_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'details':Controls.details}
    with args.out.open('x') as stream:
        json.dump(payload,stream,sort_keys=True,indent=2)
        stream.write('\n')
    signal.alarm(0)
    print(json.dumps({'status':payload['status'],'tests_run':result.testsRun,'elapsed_seconds':payload['elapsed_seconds']}))
    raise SystemExit(0 if result.wasSuccessful() else 1)


if __name__ == '__main__':
    main()
