"""Focused deterministic TIP100 development controls, no sampling campaign."""
from fractions import Fraction as F
import json
from pathlib import Path
import time
import unittest
from triple_bounds import (certify, clip, feasible, hull, maximize, overlap,
                           pair_integral, pieces, quad_at, ready, rectangle, run)


class Controls(unittest.TestCase):
    def test_exact_piece_continuity(self):
        for r in range(1, 5):
            ps = pieces(r)
            for left, right in zip(ps, ps[1:]):
                self.assertEqual(overlap(r, left[2]), overlap(r, right[1]))
                self.assertEqual(sum((left[3][z] * left[2] ** (2-z) for z in range(3)), F(0)),
                                 sum((right[3][z] * right[1] ** (2-z) for z in range(3)), F(0)))
            self.assertEqual(overlap(r, -r), 0)
            self.assertEqual(overlap(r, 1), 0)

    def test_formula_against_independent_integral(self):
        for r in range(1, 5):
            ds = {F(-r-1), F(-r), F(-1), F(0), F(1), F(2), -F(r, r+2)}
            for _, lo, hi, _ in pieces(r):
                ds.add((lo+hi)/2)
            for d in ds:
                self.assertEqual(overlap(r, d), pair_integral(r, d), (r, d))

    def test_universal_scalar_maximum(self):
        for r in range(1, 5):
            self.assertEqual(overlap(r, -F(r, r+2)), F(1, r+2))
            values = []
            for _, lo, hi, (q, l, c) in pieces(r):
                values.extend([overlap(r, lo), overlap(r, hi)])
                if q and lo <= -l/(2*q) <= hi:
                    values.append(overlap(r, -l/(2*q)))
            self.assertEqual(max(values), F(1, r+2))

    def test_rectangle_halfspace_triangle(self):
        p = rectangle(F(0), F(1), F(0), F(1))
        self.assertEqual(set(clip(p, (F(1), F(1), F(1)))),
                         {(F(1), F(0)), (F(1), F(1)), (F(0), F(1))})

    def test_empty_clip(self):
        self.assertEqual(clip(rectangle(F(0), F(1), F(0), F(1)), (F(1), F(1), F(3))), [])

    def test_point_cut(self):
        p = clip(rectangle(F(0), F(1), F(0), F(1)), (F(1), F(1), F(2)))
        self.assertEqual(p, [(F(1), F(1))])
        self.assertEqual(maximize(p, (F(1), F(0), F(1), F(0), F(0)))["maximum"], 2)

    def test_line_cut(self):
        p = clip(rectangle(F(0), F(1), F(0), F(1)), (F(1), F(0), F(1)))
        self.assertEqual(set(p), {(F(1), F(0)), (F(1), F(1))})
        self.assertEqual(maximize(p, (F(0), F(0), F(-1), F(1), F(0)))["maximum"], F(1, 4))

    def test_nonconcave_vertex_max(self):
        p = rectangle(F(-1), F(1), F(-1), F(1))
        self.assertEqual(maximize(p, (F(1), F(0), F(1), F(0), F(0)))["maximum"], 2)

    def test_edge_stationary_max(self):
        p = rectangle(F(0), F(1), F(0), F(1))
        result = maximize(p, (F(0), F(1), F(-1), F(1), F(0)))
        self.assertEqual(result["maximum"], F(5, 4))
        self.assertIn((F(1), F(1, 2)), result["maximizers"])

    def test_full_stationary_max(self):
        p = rectangle(F(0), F(1), F(0), F(1))
        result = maximize(p, (F(-1), F(1), F(-1), F(1), F(0)))
        self.assertEqual(result["maximum"], F(1, 2))
        self.assertIn((F(1, 2), F(1, 2)), result["maximizers"])

    def test_singular_stationary_line(self):
        p = rectangle(F(0), F(1), F(0), F(1))
        result = maximize(p, (F(-1), F(1), F(0), F(0), F(0)))
        self.assertEqual(result["maximum"], F(1, 4))
        self.assertTrue(any(c["kind"] == "full_stationary" for c in result["candidates"]))

    def test_singular_inconsistent_stationary(self):
        p = rectangle(F(0), F(1), F(0), F(1))
        result = maximize(p, (F(-1), F(1), F(0), F(1), F(0)))
        self.assertEqual(result["maximum"], F(5, 4))
        self.assertFalse(any(c["kind"] == "full_stationary" for c in result["candidates"]))

    def test_constant_polygon(self):
        p = rectangle(F(0), F(1), F(0), F(1))
        self.assertEqual(maximize(p, (F(0), F(0), F(0), F(0), F(7)))["maximum"], 7)

    def test_hull_line_and_point(self):
        self.assertEqual(hull([(F(0), F(0)), (F(1), F(1)), (F(2), F(2))]),
                         [(F(0), F(0)), (F(2), F(2))])
        self.assertTrue(feasible((F(1), F(1)), [(F(0), F(0)), (F(2), F(2))]))
        self.assertFalse(feasible((F(3), F(3)), [(F(0), F(0)), (F(2), F(2))]))

    def test_n3_middle_disjoint_endpoints(self):
        bottom = certify(0, 2, 1, "bottom_separated")
        apex = certify(0, 2, 1, "apex_inverted")
        self.assertEqual(bottom["inside_support_exact_maximum"], F(1, 4))
        self.assertEqual(apex["inside_support_exact_maximum"], 0)
        self.assertEqual(bottom["triple_area_lower_bound"], F(7, 30))
        self.assertEqual(apex["triple_area_lower_bound"], F(7, 30))

    def test_all_60_certificates_candidates_feasible(self):
        result = run()
        self.assertEqual(len(result["certificates"]), 60)
        for cert in result["certificates"]:
            a, b, c = cert["halfspace_ge"]
            for cell in cert["cells"]:
                for candidate in cell["candidates"]:
                    p = candidate["point"]
                    self.assertTrue(feasible(p, cell["vertices"]))
                    self.assertGreaterEqual(a*p[0]+b*p[1], c)
                    self.assertEqual(candidate["value"], quad_at(cell["quadratic"], p))
                    self.assertEqual(candidate["value"],
                                     overlap(cert["canonical_gaps"][0], p[0])
                                     + overlap(cert["canonical_gaps"][1], p[1]))

    def test_invalid_inputs_refused(self):
        with self.assertRaises(ValueError):
            pieces(0)
        with self.assertRaises(ValueError):
            certify(0, 1, 1, "bottom_separated")
        with self.assertRaises(ValueError):
            run(4)


if __name__ == "__main__":
    started = time.monotonic()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Controls)
    names = [t.id() for t in suite]
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    payload = {"tests": len(names), "names": names, "failures": len(result.failures),
               "errors": len(result.errors), "runtime_seconds": time.monotonic()-started,
               "scope": "engineering controls, not full mathematical root closure"}
    out = Path(__file__).resolve().parent / "BUILDER_CONTROLS.json"
    with out.open("x") as stream:
        stream.write(json.dumps(ready(payload), indent=2)+"\n")
    raise SystemExit(not result.wasSuccessful())
