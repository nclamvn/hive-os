"""TIP100 supplied top-cap and abstract-set arithmetic, conditional on Main geometry.

No geometric discovery, offset sampling, new target, or root conclusion.
"""
from fractions import Fraction as F
from itertools import combinations, product
from pathlib import Path
import argparse
import json
import time
import unittest

from triple_bounds import certify, pieces, ready


def add(*polys):
    n = max(map(len, polys))
    return tuple(sum((p[k] if k < len(p) else F(0) for p in polys), F(0))
                 for k in range(n))


def scale(p, c):
    return tuple(c*x for x in p)


def shift_quadratic(piece, shift):
    """Coefficients in q, ascending order, for J(q+shift)."""
    c2, c1, c0 = piece
    return (c0+c1*shift+c2*shift*shift, c1+2*c2*shift, c2)


def derivative(poly):
    return tuple(k*poly[k] for k in range(1, len(poly)))


def at(poly, q):
    return sum((c*q**k for k, c in enumerate(poly)), F(0))


def algebra():
    p3 = {name: p for name, _, _, p in pieces(3)}
    p2 = {name: p for name, _, _, p in pieces(2)}
    j3left = shift_quadratic(p3["left"], F(-3))
    j3middle = shift_quadratic(p3["middle"], F(-3))
    j2middle = shift_quadratic(p2["middle"], F(-2))
    j2right = shift_quadratic(p2["right"], F(-2))
    s_remaining = add(j3left, j2middle)
    s_23 = add(j3middle, j2right)
    h_squared = (F(0), F(0), F(1, 36))
    extra_actual = scale(h_squared, F(1, 70))
    area = add((F(3, 10),), scale(s_remaining, F(-1, 5)), extra_actual)
    completed = add((F(17, 74),),
                    scale((F(63, 37)**2, -2*F(63, 37), F(1)), F(37, 630)))
    return {"j3_q_minus3_left": j3left, "j3_q_minus3_middle": j3middle,
            "j2_q_minus2_middle": j2middle, "j2_q_minus2_right": j2right,
            "sum_on_three_halves_to_two": s_remaining,
            "sum_on_two_to_three": s_23,
            "top_extra_actual_area": extra_actual,
            "four_triangle_lower_polynomial": area,
            "completed_square_polynomial": completed,
            "completed_square_center": F(63, 37),
            "completed_square_coefficient": F(37, 630),
            "lower_bound": F(17, 74), "margin_over14_61": F(17, 74)-F(14, 61),
            "other_branch_bounds_and_margins": [
                {"q_condition": "q<=0", "bound": F(1, 4), "margin": F(1, 4)-F(14, 61)},
                {"q_condition": "0<=q<=3/2", "bound": F(37, 160), "margin": F(37, 160)-F(14, 61)},
                {"q_condition": "q>=2", "bound": F(7, 30), "margin": F(7, 30)-F(14, 61)}],
            "j2_monotonicity_D_ge_minus_half": [
                {"interval": [F(-1, 2), F(0)], "derivative": (F(-1, 3), F(-2, 3)),
                 "derivative_endpoint_values": [F(0), F(-1, 3)]},
                {"interval": [F(0), F(1)], "derivative": (F(-1, 3), F(1, 3)),
                 "derivative_endpoint_values": [F(-1, 3), F(0)]},
                {"interval": "D>=1", "derivative": (F(0),)}],
            "top_projection_gap_minus_T4_width": (F(0),),
            "top_scaled_triangle_area_minus_overlap": F(1, 2)-F(3, 7),
            "scope": "arithmetic identities only; top geometry, reflection and union implication supplied by Main"}


def abstract_sets():
    atoms = []
    for s in product((-1, 1), repeat=5):
        w = F(1, 160)*(1-F(s[0]*s[3], 4)-F(s[1]*s[4], 4)-F(s[0]*s[4], 3))
        atoms.append({"signs": s, "set_membership": [j+1 for j in range(5) if s[j] == 1], "weight": w})
    singles = [sum((a["weight"] for a in atoms if a["signs"][j] == 1), F(0)) for j in range(5)]
    pairs = []
    for i, j in combinations(range(5), 2):
        actual = sum((a["weight"] for a in atoms if a["signs"][i] == a["signs"][j] == 1), F(0))
        ceiling = F(1, 5*(j-i+2))
        pairs.append({"pair_1based": [i+1, j+1], "intersection": actual,
                      "triangle_pair_ceiling": ceiling, "slack": ceiling-actual})
    union = sum((a["weight"] for a in atoms if 1 in a["signs"]), F(0))
    return {"atoms": atoms, "atom_count": len(atoms), "total_universe_weight": sum((a["weight"] for a in atoms), F(0)),
            "minimum_atom_weight": min(a["weight"] for a in atoms), "single_areas": singles,
            "pairs": pairs, "union": union, "gap_below14_61": F(14, 61)-union,
            "scope": "ABSTRACT weighted sets, NOT triangles or a Kakeya/root counterexample"}


class Controls(unittest.TestCase):
    def test_supplied_sum_polynomial_remaining(self):
        self.assertEqual(algebra()["sum_on_three_halves_to_two"], (F(-1, 2), F(1), F(-7, 24)))

    def test_supplied_sum_polynomial_two_to_three(self):
        self.assertEqual(algebra()["sum_on_two_to_three"], (F(1, 2), F(0), F(-1, 24)))
        d = derivative(algebra()["sum_on_two_to_three"])
        self.assertEqual(d, (F(0), -F(1, 12)))
        self.assertEqual(at(algebra()["sum_on_two_to_three"], F(2)), F(1, 3))

    def test_j3_initial_interval_maximum(self):
        p = algebra()["j3_q_minus3_left"]
        self.assertEqual(p, (F(0), F(0), F(1, 24)))
        self.assertEqual(derivative(p), (F(0), F(1, 12)))
        self.assertEqual(at(p, F(3, 2)), F(3, 32))
        self.assertEqual(F(3, 10)-(F(3, 32)+F(1, 4))/5, F(37, 160))

    def test_j2_piece_derivatives_nonpositive(self):
        middle = next(p for n, _, _, p in pieces(2) if n == "middle")
        right = next(p for n, _, _, p in pieces(2) if n == "right")
        for p, lo, hi in ((middle, F(-1, 2), F(0)), (right, F(0), F(1))):
            d = (p[1], 2*p[0])
            self.assertLessEqual(at(d, lo), 0)
            self.assertLessEqual(at(d, hi), 0)
        self.assertEqual(shift_quadratic(right, F(0)), (F(1, 6), F(-1, 3), F(1, 6)))

    def test_j3_q_ge_three_single_ceiling(self):
        right = next(p for n, _, _, p in pieces(3) if n == "right")
        d = (right[1], 2*right[0])
        self.assertLessEqual(at(d, F(0)), 0)
        self.assertLessEqual(at(d, F(1)), 0)
        self.assertEqual(right[2], F(1, 8))
        self.assertEqual(F(3, 10)-F(1, 3)/5, F(7, 30))

    def test_consecutive_apex_top_overlap_certificate(self):
        c = certify(1, 2, 3, "apex_inverted")
        self.assertEqual(c["canonical_gaps"], [2, 1])
        self.assertEqual(c["inside_support_exact_maximum"], F(3, 7))
        self.assertEqual(c["overlap_sum_upper_bound"], F(3, 7))
        self.assertEqual(c["outside_support_single_overlap_upper_bound"], F(1, 3))

    def test_top_cap_width_and_additional_area(self):
        # q-3h-h=2h at h=q/6: a length2h interval cannot positively bridge.
        self.assertEqual(F(1)-3*F(1, 6)-F(1, 6)-2*F(1, 6), 0)
        self.assertEqual(F(1, 2)-F(3, 7), F(1, 14))
        self.assertGreater(F(3, 7), F(1, 3))
        self.assertEqual(F(1, 14)/5/36, F(1, 2520))
        self.assertEqual(algebra()["top_extra_actual_area"], (F(0), F(0), F(1, 2520)))

    def test_completed_square_and_exact_margin(self):
        a = algebra()
        self.assertEqual(a["four_triangle_lower_polynomial"], (F(2, 5), -F(1, 5), F(37, 630)))
        self.assertEqual(a["four_triangle_lower_polynomial"], a["completed_square_polynomial"])
        self.assertTrue(F(3, 2) <= F(63, 37) <= F(2))
        self.assertEqual(a["margin_over14_61"], F(1, 4514))
        self.assertEqual([b["margin"] for b in a["other_branch_bounds_and_margins"]],
                         [F(5, 244), F(17, 9760), F(7, 1830)])

    def test_abstract_atom_positivity_and_marginals(self):
        a = abstract_sets()
        self.assertEqual(a["atom_count"], 32)
        self.assertEqual(a["minimum_atom_weight"], F(1, 960))
        self.assertEqual(a["total_universe_weight"], F(1, 5))
        self.assertEqual(a["single_areas"], [F(1, 10)]*5)
        for p in a["pairs"]:
            expected = F(3, 80) if p["pair_1based"] in ([1, 4], [2, 5]) else F(1, 30) if p["pair_1based"] == [1, 5] else F(1, 20)
            self.assertEqual(p["intersection"], expected)
            self.assertGreaterEqual(p["slack"], 0)

    def test_abstract_union_not_triangle_claim(self):
        a = abstract_sets()
        self.assertEqual(a["union"], F(191, 960))
        self.assertEqual(a["gap_below14_61"], F(1789, 58560))
        self.assertIn("NOT triangles", a["scope"])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    started = time.monotonic()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Controls)
    names = [c.id() for c in suite]
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    payload = {"tests": len(names), "names": names, "failures": len(result.failures), "errors": len(result.errors),
               "algebra": algebra(), "consecutive_apex_certificate": certify(1, 2, 3, "apex_inverted"),
               "abstract_sets": abstract_sets(), "runtime_seconds": time.monotonic()-started,
               "scope": "supplied identities/exact arithmetic; conditional on Main geometry, not a whole-root verdict"}
    encoded = json.dumps(ready(payload), indent=2)+"\n"
    if len(encoded.encode()) > 16*1024*1024:
        raise RuntimeError("output ceiling exceeded")
    with Path(args.out).open("x") as stream:
        stream.write(encoded)
    print(json.dumps({"tests": len(names), "failures": len(result.failures), "errors": len(result.errors),
                      "bytes": len(encoded.encode()), "runtime_seconds": payload["runtime_seconds"]}))
    raise SystemExit(not result.wasSuccessful())
