"""Tiny fixed-fixture controls for independent checker; not a full acceptance run."""
import ast
from copy import deepcopy
from fractions import Fraction as F
import json
from pathlib import Path
import unittest

import acceptance_check as a
import stationary as producer

ROOT=Path(__file__).resolve().parent

class AcceptanceControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Read saved Main evidence; use only one fixed cell in each control.
        cls.geometry=json.loads((ROOT/'MAIN_FULL_SHAPE_COVER.json').read_text())
        cls.certificate=json.loads((ROOT/'MAIN_FULL_STATIONARY_CERTIFICATE.json').read_text())
        cls.singular_cell=next(record['cell'] for record in cls.certificate['cell_results'] if any(case.get('stationary_nullspace') and case.get('value') is not None and F(case['value'])<F(14,61) for case in record['cases']))
    def fixture(self,index=0):
        g=deepcopy(self.geometry)
        g['cells']=[g['cells'][index]];g['cell_count']=1
        record=deepcopy(self.certificate['cell_results'][index]);record['cell']=0
        certificate={'status':'ALL_FULL_GRADIENT_STATIONARY_CASES_CERTIFIED','stats':{'cells':1,'pairs':len(record['cases'])},'distinct_polynomials':len({tuple(case['polynomial']) for case in record['cases']}),'cell_results':[record]}
        return g,certificate
    def test_ast_no_shared_solver_import(self):
        source=(ROOT/'acceptance_check.py').read_text();tree=ast.parse(source)
        for node in ast.walk(tree):
            if isinstance(node,ast.ImportFrom):self.assertNotIn(node.module,('optimize','stationary'))
    def test_independent_walls(self):
        self.assertEqual(len(a.expected_walls()),42)
        self.assertEqual(tuple(tuple(map(int,w)) for w in self.geometry['planes'][4:]),a.expected_walls())
    def test_independent_elimination_inconsistent(self):
        self.assertIsNone(a.exact_eliminate([[0,0]],[1],2))
    def test_independent_elimination_complete_nullspace(self):
        point,null,rank=a.exact_eliminate([[1,2,0],[2,4,0]],[3,6],3)
        self.assertEqual(rank,1);self.assertEqual(len(null),2)
        self.assertEqual(point,(F(3),F(0),F(0)))
        for d in null:self.assertEqual(a.inner((1,2,0),d),0)
    def test_independent_polynomial_derivatives(self):
        coeff={term:F(0) for term in a.TERMS};coeff[0,0]=F(3);coeff[0,1]=F(7);coeff[0,4]=F(-2);coeff[4,4]=F(5)
        h,l=a.derivatives(tuple(coeff[t] for t in a.TERMS))
        self.assertEqual(h[0][0],6);self.assertEqual(h[0][1],7);self.assertEqual(h[1][0],7);self.assertEqual(l[0],-2)
    def test_fixed_source_energy_independent_event_count(self):
        shape=(F(29,165),F(93,165),F(116,165),F(1))
        rows=[]
        for w in a.BOUNDARIES+a.expected_walls():
            sign=a.inner(w,shape)
            if sign:rows.append(tuple(x*(1 if sign>0 else -1) for x in w))
        q,sample=a.independent_energy(shape,rows,lambda:None)
        old,other=producer.cone_energy(shape,rows)
        self.assertEqual(q,old)
        upper,lower=a.independent_chains(sample)
        p=a.independent_area(q,upper,lower,1,5)
        point=(F(29,61),F(93,61),F(116,61),F(165,61))
        self.assertEqual(a.value(p,point),F(14,61))
        h,l=a.derivatives(p)
        self.assertTrue(all(a.inner(row,point)+v==0 for row,v in zip(h,l)))
    def test_one_fixed_saved_cell_all_cases(self):
        g,c=self.fixture()
        result=a.verify(g,c,seconds=1,expected_cells=1)
        self.assertEqual(result['status'],'INDEPENDENT_FINITE_STATIONARY_CERTIFICATE_VERIFIED')
        self.assertEqual(result['stats']['cells'],1)
    def test_one_fixed_singular_cell_constant_exclusion(self):
        g,c=self.fixture(self.singular_cell)
        result=a.verify(g,c,seconds=1,expected_cells=1)
        self.assertGreater(result['stats']['singular_below_infeasible_constant'],0)
        self.assertTrue(result['singular_constant_exclusions'])
    def test_missing_cartesian_pair_refused(self):
        g,c=self.fixture();c['cell_results'][0]['cases'].pop()
        with self.assertRaisesRegex(ValueError,'CARTESIAN'):a.verify(g,c,expected_cells=1)
    def test_duplicate_cartesian_pair_refused(self):
        g,c=self.fixture();c['cell_results'][0]['cases'].append(deepcopy(c['cell_results'][0]['cases'][0]))
        with self.assertRaisesRegex(ValueError,'CARTESIAN'):a.verify(g,c,expected_cells=1)
    def test_wrong_energy_derivation_refused(self):
        g,c=self.fixture();c['cell_results'][0]['energy'][0]=str(F(c['cell_results'][0]['energy'][0])+1)
        with self.assertRaisesRegex(ValueError,'ENERGY'):a.verify(g,c,expected_cells=1)
    def test_wrong_area_derivation_refused(self):
        g,c=self.fixture();case=c['cell_results'][0]['cases'][0];case['polynomial'][0]=str(F(case['polynomial'][0])+1)
        with self.assertRaisesRegex(ValueError,'AREA_POLYNOMIAL'):a.verify(g,c,expected_cells=1)
    def test_wrong_stationary_value_refused(self):
        g,c=self.fixture();case=next(case for case in c['cell_results'][0]['cases'] if case['value'] is not None);case['value']=str(F(case['value'])+1)
        with self.assertRaisesRegex(ValueError,'STATIONARY_VALUE'):a.verify(g,c,expected_cells=1)
    def test_dependent_nullspace_refused(self):
        g,c=self.fixture();case=next(case for case in c['cell_results'][0]['cases'] if case['value'] is not None);case['stationary_nullspace'].append(['0']*4)
        with self.assertRaisesRegex(ValueError,'NULLSPACE'):a.verify(g,c,expected_cells=1)
    def test_corrupt_feasibility_row_refused(self):
        g,c=self.fixture(self.singular_cell)
        case=next(case for case in c['cell_results'][0]['cases'] if case['status']=='BELOW_TARGET_STATIONARY_INFEASIBLE')
        case['closed_constraints'][0][0]=str(F(case['closed_constraints'][0][0])+1)
        with self.assertRaisesRegex(ValueError,'CONSTRAINT_INVENTORY'):a.verify(g,c,expected_cells=1)
    def test_arithmetic_only_not_full_derivation(self):
        g,c=self.fixture();result=a.verify(g,c,expected_cells=1,derive=False)
        self.assertEqual(result['status'],'STATIONARY_ARITHMETIC_VERIFIED_DERIVATION_UNVERIFIED')

if __name__=='__main__':unittest.main()
