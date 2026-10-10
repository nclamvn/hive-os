"""Small engineering controls only; no scientific shape enumeration."""
import ast
from copy import deepcopy
from fractions import Fraction as F
import json
from pathlib import Path
import subprocess
import unittest

import coverage_check as c
import stationary as s
from shape_walls import BOUNDARIES, SIMPLEX, walls

ROOT=Path(__file__).resolve().parent

def fixture():
    planes=BOUNDARIES+walls()[0]
    return {'status':'PARTIAL_COVER','processed_planes':0,'pending_planes':42,'cell_count':1,
            'planes':[[str(x) for x in p] for p in planes],
            'vertices':[{'h':[str(x) for x in h],'active':[i for i,p in enumerate(planes) if not c.dot(p,h)]} for h in SIMPLEX],
            'cells':[{'signs':'','vertices':list(range(4))}]}

class Controls(unittest.TestCase):
    def test_wall_inventory(self):
        planes,stats=walls()
        self.assertEqual((stats['raw_distinct'],len(planes)),(52,42))
        self.assertEqual(len(set(planes)),42)
        for p in planes:
            v=[c.dot(p,h) for h in SIMPLEX]
            self.assertLess(min(v),0);self.assertGreater(max(v),0)
    def test_actual_tetra_volume(self):
        self.assertEqual(c.hull_volume([tuple(F(x) for x in h[:3]) for h in SIMPLEX]),(F(1,6),4))
    def test_missing_hull_vertex_refused(self):
        with self.assertRaises(ValueError):c.hull_volume([tuple(F(x) for x in h[:3]) for h in SIMPLEX[:3]])
    def test_coplanar_hull_refused(self):
        with self.assertRaises(ValueError):c.hull_volume([(F(0),F(0),F(0)),(F(1),F(0),F(0)),(F(0),F(1),F(0)),(F(1),F(1),F(0))])
    def test_prefix_volume(self):
        self.assertEqual(c.verify(fixture(),require_complete=False)['volume'],'1/6')
    def test_partial_cover_refused(self):
        with self.assertRaisesRegex(ValueError,'INCOMPLETE'):c.verify(fixture())
        with self.assertRaisesRegex(ValueError,'INCOMPLETE'):s.Certifier(fixture()).run()
    def test_duplicate_signword_refused(self):
        g=fixture();g['cells']*=2;g['cell_count']=2
        with self.assertRaisesRegex(ValueError,'DUPLICATE'):c.verify(g,require_complete=False)
    def test_outside_simplex_refused(self):
        g=fixture();g['vertices'][0]['h']=['-1','0','0','1']
        h=tuple(map(int,g['vertices'][0]['h']))
        g['vertices'][0]['active']=[i for i,p in enumerate(g['planes']) if not c.dot(tuple(map(int,p)),h)]
        with self.assertRaisesRegex(ValueError,'OUTSIDE_SIMPLEX'):c.verify(g,require_complete=False)
    def test_active_label_refused(self):
        g=fixture();g['vertices'][0]['active']=[]
        with self.assertRaisesRegex(ValueError,'ACTIVE_LABEL'):c.verify(g,require_complete=False)
    def test_wrong_inventory_refused(self):
        g=fixture();g['planes'].pop()
        with self.assertRaisesRegex(ValueError,'INVENTORY'):c.verify(g,require_complete=False)
    def test_inconsistent_stationary(self):
        self.assertIsNone(s.rref([[F(0)]*4],[F(1)],4))
    def test_constant_stationary(self):
        solution=s.rref([[F(0)]*4 for i in range(4)],[F(0)]*4,4)
        self.assertEqual(len(solution[1]),4)
    def test_unique_outside_stationary(self):
        point=[F(-1),F(0),F(0),F(0)]
        result,count=s.stationary_feasible(point,[],[(F(1),F(0),F(0),F(0),F(0))],[])
        self.assertIsNone(result)
    def test_singular_feasible_mean(self):
        point=[F(-1),F(0),F(0),F(0)];directions=[[F(1),F(0),F(0),F(0)]]
        closed=[(F(1),F(0),F(0),F(0),F(0)),(F(-1),F(0),F(0),F(0),F(1))]
        strict=[(F(1),F(0),F(0),F(0),F(0))]
        p,count=s.stationary_feasible(point,directions,closed,strict)
        self.assertEqual(p[0],F(1,2));self.assertGreater(count,0)
    def test_singular_strict_empty(self):
        p,count=s.stationary_feasible([F(0)]*4,[[F(0),F(1),F(0),F(0)]],[],[(F(1),F(0),F(0),F(0),F(0))])
        self.assertIsNone(p)
    def test_singular_enumeration_limit(self):
        closed=[(F(1),F(0),F(0),F(0),F(0)),(F(-1),F(0),F(0),F(0),F(1))]
        with self.assertRaisesRegex(RuntimeError,'LIMIT'):s.stationary_feasible([F(-1)]*4,[[F(1),F(0),F(0),F(0)]],closed,[],vertex_cap=0)
    def test_source_adjacent_full_gradient(self):
        source=(F(29,61),F(93,61),F(116,61),F(165,61))
        shape=tuple(x/source[3] for x in source)
        polys=[]
        for delta in (-F(1,10000),F(1,10000)):
            center=(shape[0]+delta,)+shape[1:]
            planes=[]
            for w in BOUNDARIES+walls()[0]:
                value=s.dot(w,center)
                if value:planes.append(tuple(x*(1 if value>0 else -1) for x in w))
            q,sample=s.cone_energy(center,planes)
            upper,lower=s.envelope_chains(sample)
            p=s.area_polynomial(q,upper,lower,1,5);polys.append(p)
            self.assertEqual(s.poly_at(p,source),F(14,61))
            h,l,_=s.hessian_linear(p)
            self.assertEqual([s.dot(row,source)+v for row,v in zip(h,l)],[F(0)]*4)
        self.assertNotEqual(polys[0],polys[1])
    def test_source_reflected_stationary(self):
        source=(F(49,61),F(72,61),F(136,61),F(165,61))
        center=tuple(x/source[3] for x in source)
        planes=[]
        for w in BOUNDARIES+walls()[0]:
            value=s.dot(w,center)
            if value:planes.append(tuple(x*(1 if value>0 else -1) for x in w))
        q,sample=s.cone_energy(center,planes);upper,lower=s.envelope_chains(sample)
        p=s.area_polynomial(q,upper,lower,1,5)
        self.assertEqual(s.poly_at(p,source),F(14,61))
        h,l,_=s.hessian_linear(p)
        self.assertEqual([s.dot(row,source)+v for row,v in zip(h,l)],[F(0)]*4)
    def test_phase_tail_vs_both098(self):
        shapes=[(F(29,165),F(93,165),F(116,165),F(1)),(F(49,165),F(72,165),F(136,165),F(1)),(F(1,4),F(1,2),F(3,4),F(1))]
        pair_count=set()
        for center in shapes:
            planes=[]
            for w in BOUNDARIES+walls()[0]:
                value=s.dot(w,center)
                if value:planes.append(tuple(x*(1 if value>0 else -1) for x in w))
            q,sample=s.cone_energy(center,planes);upper,lower=s.envelope_chains(sample)
            # Fixed source/radial regression cases, not a shape/scale search.
            for scale in (F(1),F(165,61),F(4),F(9,2)):
                x=tuple(v*scale for v in sample)
                z=[-F(1)]+[v-j for j,v in enumerate(x,2)]
                a=max(range(1,6),key=lambda j:z[j-1]);b=min(range(1,6),key=lambda j:z[j-1])
                pair_count.add((a,b))
                p=s.area_polynomial(q,upper,lower,a,b)
                offsets=tuple((v-j)/5 for j,v in enumerate((F(0),)+x,1))
                self.assertEqual(s.poly_at(p,x),s.area_affine(offsets));self.assertEqual(s.area_affine(offsets),s.area_trapezoid(offsets))
        self.assertGreater(len(pair_count),1)
    def test_ast(self):
        for file in ('shape_walls.py','stationary.py','coverage_check.py','test_tip101.py'):
            ast.parse((ROOT/file).read_text())
    def test_native_degenerate_planes_and_exact_volume(self):
        out=ROOT/'CONTROL_NATIVE_DEGENERATE.json'
        proc=subprocess.run([str(ROOT/'coverage_native'),'--walls',str(ROOT/'control_degenerate_walls.txt'),'--out',str(out),'--seconds','1'],capture_output=True,text=True)
        self.assertEqual(proc.returncode,0,proc.stdout+proc.stderr)
        g=json.loads(out.read_text())
        self.assertEqual(g['status'],'COMPLETE_COVER');self.assertEqual(g['cell_count'],2)
        points=[tuple(F(int(x),int(v['h'][3])) for x in v['h'][:3]) for v in g['vertices']]
        self.assertEqual(sum((c.hull_volume([points[i] for i in cell['vertices']])[0] for cell in g['cells']),F(0)),F(1,6))
    def test_native_cell_cap_refusal(self):
        out=ROOT/'CONTROL_NATIVE_CELL_CAP.json'
        proc=subprocess.run([str(ROOT/'coverage_native'),'--walls',str(ROOT/'control_degenerate_walls.txt'),'--out',str(out),'--seconds','1','--cell-cap','1'],capture_output=True,text=True)
        self.assertEqual(proc.returncode,3)
        g=json.loads(out.read_text());self.assertEqual(g['reason'],'CELL_LIMIT');self.assertEqual(g['status'],'PARTIAL_COVER')
    def test_native_time_refusal(self):
        out=ROOT/'CONTROL_NATIVE_TIME_CAP.json'
        proc=subprocess.run([str(ROOT/'coverage_native'),'--walls',str(ROOT/'control_degenerate_walls.txt'),'--out',str(out),'--seconds','0.000000000001'],capture_output=True,text=True)
        self.assertEqual(proc.returncode,3)
        g=json.loads(out.read_text());self.assertEqual(g['reason'],'TIME_LIMIT');self.assertEqual(g['status'],'PARTIAL_COVER')
    def test_native_coefficient_refusal(self):
        out=ROOT/'CONTROL_NATIVE_COEFFICIENT_CAP.json'
        proc=subprocess.run([str(ROOT/'coverage_native'),'--walls',str(ROOT/'control_coefficient_walls.txt'),'--out',str(out),'--seconds','1'],capture_output=True,text=True)
        self.assertEqual(proc.returncode,3)
        self.assertEqual(json.loads(out.read_text())['reason'],'NORMAL_COEFFICIENT_LIMIT')

if __name__=='__main__':unittest.main()
