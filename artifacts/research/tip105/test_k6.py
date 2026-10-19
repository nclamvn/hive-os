"""Eight focused controls; one invocation includes local and finite arithmetic."""
from fractions import Fraction as F
import json
import math
from unittest import TestCase,main
from unittest.mock import mock_open,patch

from k6_structured import area_float,compatibility_ledger,exact_record,persist_result,structured_seeds
from k6_local import inspect,WITNESS


class K6Controls(TestCase):
    def test_structured_seed_inventory(self):
        seeds=structured_seeds()
        self.assertEqual(len(seeds),25)
        self.assertEqual(len(set(seed for _,seed in seeds)),25)
        self.assertTrue(all(len(seed)==6 and seed[-1]==0 for _,seed in seeds))

    def test_exact_witness_and_navigation_value(self):
        result=exact_record(WITNESS+(F(0),))
        self.assertEqual(result["area"],"20/93")
        self.assertEqual(result["area_affine"],"20/93")
        self.assertAlmostEqual(area_float(WITNESS+(F(0),)),20/93,places=14)
        self.assertEqual(result["global_optimality"],"NOT_ESTABLISHED")

    def test_symmetric_benchmark(self):
        result=exact_record(structured_seeds()[0][1])
        self.assertEqual(result["area"],"2/9")
        self.assertEqual(F(result["area"])-F(20,93),F(2,279))

    def test_reflection(self):
        xs=WITNESS+(F(0),)
        reflected=tuple(xs[0]-v for v in reversed(xs))
        self.assertEqual(exact_record(reflected)["area"],"20/93")
        self.assertEqual(reflected,xs)

    def test_bad_navigation_and_gauge_inputs(self):
        for values in ([0]*5,[0]*7,[0]*5+[math.nan],[0]*5+[math.inf]):
            with self.assertRaises(ValueError):
                area_float(values)
        for values in ([0]*5,[0]*5+[1]):
            with self.assertRaises(ValueError):
                exact_record(values)

    def test_compatibility_arithmetic(self):
        record=compatibility_ledger()
        self.assertEqual(record["squared_left_right_mismatches"],
                         [["3582/3721","450/3721"],["72/3721","3582/3721"]])
        self.assertEqual(F(record["minimum_squared_mismatch"])/16,F(9,7442))
        self.assertEqual(F(5,6)*F(9,7442),F(15,14884))

    def test_exact_local_symbolic_polynomial(self):
        record=inspect()
        self.assertEqual(record["zero_coarse_walls"],[])
        self.assertEqual(record["coarse_wall_count"],147)
        self.assertEqual(record["coarse_safe_linf_radius_strictly_less_than"],F(1,465))
        self.assertTrue(record["strict_local_minimum_certificate"])
        incident=record["incident_polynomials"][0]
        self.assertEqual(incident["gradient_at_witness"],[F(0)]*5)
        self.assertEqual(incident["leading_minors"],[F(7),F(159,2),F(342),F(3636),F(25110)])
        self.assertTrue(incident["polynomial_center_agreement"])

    def test_create_only_output_contract(self):
        writer=mock_open()
        with patch("pathlib.Path.open",writer):
            persist_result("unused_evidence_path.json",{"scope":"finite"})
        writer.assert_called_once_with("x",encoding="utf-8")
        with patch("pathlib.Path.open",side_effect=FileExistsError):
            with self.assertRaises(FileExistsError):
                persist_result("unused_evidence_path.json",{})


if __name__=="__main__":
    main(verbosity=2)
