"""Fixed-shape TIP100 radial arithmetic controls; no shape search."""
from fractions import Fraction as F
from pathlib import Path
import json
import sys
import time
import unittest

from radial_shape import (evaluate, fixed_shape_minimum, offsets, piece_candidates, polynomial_at,
                          validate_shape)
from laminar_area import laminar_area, ready

sys.path.insert(0, str(Path(__file__).resolve().parent.parent/"tip098"))
from kakeya_exact import area_affine, area_trapezoid

KNOWN = (F(0), F(29, 165), F(93, 165), F(116, 165), F(1))
SYMMETRIC = (F(0), F(1, 4), F(1, 2), F(3, 4), F(1))
FIXED_ONE = (F(0), F(1, 10), F(1, 3), F(4, 5), F(1))
FIXED_TWO = (F(0), F(1, 20), F(1, 10), F(9, 10), F(1))


class Controls(unittest.TestCase):
    records = []

    def crosscheck(self, name, shape):
        result = fixed_shape_minimum(shape)
        scales = {F(0), result["scale_ceiling"]}
        scales.update(c["scale"] for c in result["candidates"])
        scales.update((p["s_lo"]+p["s_hi"])/2 for p in result["radial_pieces"])
        comparisons = []
        for s in sorted(scales):
            xs = offsets(shape, s)
            value = evaluate(result, s)
            self.assertEqual(value, area_affine(xs))
            self.assertEqual(value, area_trapezoid(xs))
            laminar = None
            if 0 < s < result["scale_ceiling"]:
                laminar = laminar_area(xs)["area"]
                self.assertEqual(value, laminar)
            comparisons.append({"scale": s, "radial_area": value,
                                "area_098_affine": value, "area_098_trapezoid": value,
                                "laminar_area": laminar, "offsets": xs})
        self.records.append({"name": name, "radial_certificate": result, "comparisons": comparisons})
        return result

    def test_known_witness_shape(self):
        r = self.crosscheck("known_witness_shape", KNOWN)
        self.assertEqual(r["minimum"], F(14, 61))
        self.assertEqual(r["minimizing_scales"], [F(165, 61)])

    def test_symmetric_shape_not_assumed_minimum(self):
        r = self.crosscheck("symmetric_shape", SYMMETRIC)
        self.assertGreater(r["minimum"], 0)

    def test_fixed_nonendpoint_shape_one(self):
        r = self.crosscheck("fixed_nonendpoint_shape_one", FIXED_ONE)
        self.assertTrue(any(p["upper_label"] != 1 or p["lower_label"] != 5 for p in r["radial_pieces"]))

    def test_fixed_nonendpoint_shape_two(self):
        r = self.crosscheck("fixed_nonendpoint_shape_two", FIXED_TWO)
        self.assertTrue(any(p["upper_label"] != 1 or p["lower_label"] != 5 for p in r["radial_pieces"]))

    def test_derivative_and_value_continuity(self):
        for shape in (KNOWN, SYMMETRIC, FIXED_ONE, FIXED_TWO):
            r = fixed_shape_minimum(shape)
            for left, right in zip(r["radial_pieces"], r["radial_pieces"][1:]):
                s = left["s_hi"]
                self.assertEqual(s, right["s_lo"])
                self.assertEqual(polynomial_at(left["coefficients"], s), polynomial_at(right["coefficients"], s))
                self.assertEqual(left["coefficients"][1]+2*left["coefficients"][2]*s,
                                 right["coefficients"][1]+2*right["coefficients"][2]*s)

    def test_tail_constants_and_closed_endpoints(self):
        r = fixed_shape_minimum(KNOWN)
        tail = r["radial_pieces"][0]
        self.assertEqual(tail["s_lo"], 0)
        self.assertEqual(tail["coefficients"][:2], (F(1, 2), -F(1, 5)))
        self.assertEqual(evaluate(r, 0), F(1, 2))
        with self.assertRaises(ValueError):
            laminar_area(offsets(KNOWN, 0))
        with self.assertRaises(ValueError):
            laminar_area(offsets(KNOWN, r["scale_ceiling"]))

    def test_coefficients_hull_labels_and_monotonicity(self):
        for shape in (KNOWN, SYMMETRIC, FIXED_ONE, FIXED_TWO):
            r = fixed_shape_minimum(shape)
            self.assertLessEqual(len(r["radial_pieces"]), 9)
            for p in r["radial_pieces"]:
                a, b = p["upper_label"], p["lower_label"]
                self.assertEqual(p["coefficients"][0], F(b-a+1, 10))
                self.assertEqual(p["coefficients"][1], (shape[a-1]-shape[b-1])/5)
            reverse = list(reversed(r["radial_pieces"]))
            self.assertTrue(all(p["upper_label"] >= q["upper_label"] for p, q in zip(reverse, reverse[1:])))
            self.assertTrue(all(p["lower_label"] <= q["lower_label"] for p, q in zip(reverse, reverse[1:])))

    def test_tied_hull_switches(self):
        r = fixed_shape_minimum(SYMMETRIC)
        self.assertEqual(len(r["radial_pieces"]), 2)
        self.assertEqual(r["radial_pieces"][0]["upper_label"], 1)
        self.assertEqual(r["radial_pieces"][0]["lower_label"], 5)
        self.assertEqual(r["radial_pieces"][0]["s_hi"], 4)
        self.assertEqual(r["radial_pieces"][1]["upper_label"], 5)
        self.assertEqual(r["radial_pieces"][1]["lower_label"], 1)

    def test_refusals(self):
        invalid = [(0, F(1, 4), F(1, 4), F(3, 4), 1), (0, F(1, 2), F(1, 4), F(3, 4), 1),
                   (0, F(1, 4), F(1, 2), F(3, 4), 2), (True, F(1, 4), F(1, 2), F(3, 4), 1),
                   (0, 0.25, F(1, 2), F(3, 4), 1), (0, "1/0", F(1, 2), F(3, 4), 1),
                   [0]*4, None]
        for shape in invalid:
            with self.assertRaises(ValueError):
                fixed_shape_minimum(shape)
        r = fixed_shape_minimum(KNOWN)
        for s in (-1, r["scale_ceiling"]+1, 0.0, True):
            with self.assertRaises(ValueError):
                evaluate(r, s)

    def test_flat_linear_concave_piece_controls(self):
        flat = piece_candidates((F(7), F(0), F(0)), F(0), F(2))
        self.assertEqual({c["area"] for c in flat}, {F(7)})
        linear = piece_candidates((F(7), F(-1), F(0)), F(0), F(2))
        self.assertEqual(min(c["area"] for c in linear), F(5))
        concave = piece_candidates((F(0), F(0), F(-1)), F(-1), F(1))
        self.assertEqual(min(c["area"] for c in concave), F(-1))
        self.assertTrue(all(c["reason"].startswith("closed_piece") for c in concave))
        singleton = piece_candidates((F(0), F(0), F(1)), F(0), F(0))
        self.assertEqual({c["scale"] for c in singleton}, {F(0)})


if __name__ == "__main__":
    started = time.monotonic()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Controls)
    names = [c.id() for c in suite]
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    payload = {"tests": len(names), "names": names, "failures": len(result.failures),
               "errors": len(result.errors), "fixed_shape_count": len(Controls.records),
               "cases": Controls.records, "runtime_seconds": time.monotonic()-started,
               "scope": "exact source-aware1D minima on fixed shapes, not shape optimization or universal root"}
    encoded = json.dumps(ready(payload), indent=2)+"\n"
    if len(encoded.encode()) > 16*1024*1024:
        raise RuntimeError("output ceiling exceeded")
    with (Path(__file__).resolve().parent/"RADIAL_CONTROLS.json").open("x") as stream:
        stream.write(encoded)
    print(json.dumps({"tests": len(names), "failures": len(result.failures), "errors": len(result.errors),
                      "bytes": len(encoded.encode()), "runtime_seconds": payload["runtime_seconds"],
                      "minima": [{"name": c["name"], "minimum": str(c["radial_certificate"]["minimum"]),
                                  "scales": ready(c["radial_certificate"]["minimizing_scales"]),
                                  "pieces": len(c["radial_certificate"]["radial_pieces"])} for c in Controls.records]}))
    raise SystemExit(not result.wasSuccessful())
