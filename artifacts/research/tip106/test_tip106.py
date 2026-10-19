"""Twelve focused controls, not twelve scientific closure obligations."""
from fractions import Fraction as F
import json
from pathlib import Path
import sys
from unittest import TestCase,main
from unittest.mock import mock_open,patch

from cost_pilot import inventory,pilot
from hierarchical_navigation import trees,leaves,hierarchical_seed,schedules
from proof_arithmetic import disconnected_bounds,endpoint_gap_sets,ledger,TARGET
from topology_walk import unique_solve,arrangements,polynomial,WITNESS,exact_record,persist_result

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tip101"))
from shape_walls import walls as k5_walls


class TIP106Controls(TestCase):
    def test_generic_inventory_reproduces_K5(self):
        data=inventory(5)
        expected,stats=k5_walls()
        self.assertEqual(tuple(data["cutting_walls"]),expected)
        self.assertEqual(data["cutting_count"],42)

    def test_K6_wall_inventory(self):
        data=inventory()
        self.assertEqual((data["raw_distinct"],data["cutting_count"],data["shape_dimension"]),(107,92,4))
        self.assertEqual(len(set(data["cutting_walls"])),92)
        self.assertEqual(len(data["boundaries"]),5)
        for w in data["cutting_walls"]:
            signs=[sum(x*y for x,y in zip(w,p)) for p in data["simplex_homogeneous_vertices"]]
            self.assertLess(min(signs),0)
            self.assertGreater(max(signs),0)

    def test_prefix_pilot_remains_partial(self):
        data=pilot(seconds=2,max_planes=2,cell_cap=20)
        self.assertEqual(data["status"],"PARTIAL_COST_PILOT_NOT_GLOBAL_COVER")
        self.assertEqual(data["processed_planes"],2)
        self.assertEqual(data["cell_count"],3)
        self.assertIn("NOT_FULL_COVER",data["reason"])

    def test_binary_tree_count_and_leaves(self):
        for order in ((1,2,3,4,5,6),(1,3,5,2,4,6),(6,4,2,5,3,1)):
            self.assertEqual(len(trees(order)),42)
            self.assertEqual(len(set(trees(order))),42)
            self.assertTrue(all(tuple(leaves(t))==order for t in trees(order)))

    def test_hierarchical_seed_determinism_and_gauge(self):
        tree=trees((1,2,3,4,5,6))[12]
        first=hierarchical_seed(tree,F(1,3),"lower_deeper")
        self.assertEqual(first,hierarchical_seed(tree,F(1,3),"lower_deeper"))
        self.assertEqual(first,(F(2,9),F(1,12),F(43,576),F(41,576),F(7,144),F(0)))
        self.assertEqual(len(schedules()),420)

    def test_exact_unique_and_singular_systems(self):
        identity=[[F(i==j) for j in range(5)] for i in range(5)]
        self.assertEqual(unique_solve(identity,list(map(F,range(5)))),tuple(map(F,range(5))))
        self.assertIsNone(unique_solve([[F(0)]*5 for _ in range(5)],[F(0)]*5))

    def test_exact_symbolic_stationary_recovery(self):
        endpoints,heights,coarse,fine=arrangements()
        center=tuple(x+F(2**i,10000000) for i,x in enumerate(WITNESS))
        self.assertTrue(all(sum(w[i]*center[i] for i in range(5))+w[5]!=0 for w in fine))
        Q=polynomial(center,endpoints,heights)
        H=[[2*Q[i][j] for j in range(5)] for i in range(5)]
        linear=[2*Q[i][5] for i in range(5)]
        self.assertEqual(unique_solve(H,[-v for v in linear]),WITNESS)
        self.assertEqual(exact_record(WITNESS+(F(0),))["area"],"20/93")

    def test_codimension1_KKT_solver(self):
        matrix=[[F(i==j) for j in range(5)]+[F(i==0)] for i in range(5)]
        matrix.append([F(1)]+[F(0)]*5)
        point=unique_solve(matrix,[F(0)]*5+[F(1,4)])
        self.assertEqual(point,(F(1,4),F(0),F(0),F(0),F(0),F(-1,4)))

    def test_disconnected_bound_arithmetic(self):
        data=disconnected_bounds()
        self.assertEqual(list(data["bipartition_lower_bounds"].values()),[F(203,936),F(19,81),F(9,40)])
        self.assertEqual(data["strict_margin"],F(53,29016))
        self.assertGreater(data["minimum_disconnected_bound"],TARGET)

    def test_endpoint_gap_exclusions(self):
        rows=endpoint_gap_sets()
        self.assertEqual(len(rows),32)
        exclusions=[r["gaps"] for r in rows if r["strictly_excludes_below_target"]]
        self.assertEqual(exclusions,[(),(1,),(2,),(3,),(4,),(5,),(3,5),(4,5)])
        data=ledger()
        self.assertEqual(data["endpoint_degree_at_most1_lower_bound"],F(481,2196))
        self.assertEqual(data["endpoint_degree_at_most1_margin"],F(271,68076))

    def test_actual_walk_output_has_open_frontier(self):
        data=json.loads((Path(__file__).parent/"BUILDER_TOPOLOGY_WALK.json").read_text())
        self.assertEqual(data["status"],"PARTIAL_TOPOLOGY_NAVIGATION_ROOT_OPEN")
        self.assertIsNone(data["negative_witness"])
        self.assertEqual(len(data["open_frontier"]),data["open_frontier_count"])
        self.assertGreater(data["open_frontier_count"],0)
        self.assertIn("NONE",data["coverage"])

    def test_create_only_output_contract(self):
        writer=mock_open()
        with patch("pathlib.Path.open",writer):
            persist_result("unused_evidence_path.json",{})
        writer.assert_called_once_with("x",encoding="utf-8")
        with patch("pathlib.Path.open",side_effect=FileExistsError):
            with self.assertRaises(FileExistsError):
                persist_result("unused_evidence_path.json",{})


if __name__=="__main__":
    main(verbosity=2)
