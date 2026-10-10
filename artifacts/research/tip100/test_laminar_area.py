"""Fixed exact laminar controls against both preserved098 area paths."""
from fractions import Fraction as F
from pathlib import Path
import json
import sys
import time
import unittest

from laminar_area import laminar_area, ready, validate_k5

sys.path.insert(0, str(Path(__file__).resolve().parent.parent/"tip098"))
from kakeya_exact import area_affine, area_trapezoid

WITNESS = (F(79, 305), F(47, 305), F(10, 61), F(12, 305), F(0))
SYMMETRIC = (F(4, 15), F(1, 5), F(2, 15), F(1, 15), F(0))


class Controls(unittest.TestCase):
    records = []

    def compare(self, name, xs, expected=None):
        result = laminar_area(xs)
        trapezoid, affine = area_trapezoid(xs), area_affine(xs)
        self.assertEqual(result["area"], trapezoid)
        self.assertEqual(result["area"], affine)
        if expected is not None:
            self.assertEqual(result["area"], expected)
        self.records.append({"name": name, "laminar": result,
                             "area_098_trapezoid": trapezoid, "area_098_affine": affine})
        return result

    def test_source_witness(self):
        self.compare("source_witness", WITNESS, F(14, 61))

    def test_reflected_witness(self):
        self.compare("reflected_witness", tuple(-x for x in reversed(WITNESS)), F(14, 61))

    def test_source_symmetric(self):
        self.compare("source_symmetric", SYMMETRIC, F(7, 30))

    def test_source_symmetric_reflected_reversal(self):
        self.compare("source_symmetric_reflected_reversal", tuple(-x for x in reversed(SYMMETRIC)), F(7, 30))

    def test_all_offsets_zero_ties(self):
        r = self.compare("zero_ties", (0, 0, 0, 0, 0), F(3, 10))
        self.assertEqual([i["threshold"] for i in r["cut_thresholds"]], [F(1, 2)]*4)
        self.assertEqual(r["split_tree"]["binary_refinement_count"], 14)
        self.assertEqual(r["event_heights"], [F(0), F(1, 2), F(1)])

    def test_increasing_ray(self):
        g = F(1, 100)
        self.compare("increasing_ray_1_100", tuple(j*g for j in range(5)), F(3, 10)+2*g-5*g*g)

    def test_fixed_complete_rational_one(self):
        self.compare("complete_rational_one", (0, F(-1, 20), F(-1, 30), F(-1, 10), F(-1, 8)))

    def test_fixed_complete_rational_two(self):
        self.compare("complete_rational_two", (0, F(1, 50), F(-1, 50), F(1, 100), F(-1, 100)))

    def test_concurrent_left_lines_and_cuts(self):
        r = self.compare("concurrent_left_lines", tuple(-F(j, 20) for j in range(5)))
        self.assertEqual({c["height"] for c in r["left_line_crossings"]}, {F(1, 4)})
        self.assertEqual(len(r["left_line_crossings"]), 10)
        self.assertEqual([c["threshold"] for c in r["cut_thresholds"]], [F(5, 8)]*4)
        self.assertEqual(r["split_tree"]["binary_refinement_count"], 14)

    def test_translation_invariance(self):
        self.compare("translated_witness", tuple(x+F(7, 3) for x in WITNESS), F(14, 61))

    def test_thresholds_boundaries_and_never_merges(self):
        r = laminar_area(WITNESS)
        previous_cuts = set()
        for s in r["slabs"]:
            current = {b["labels"][-1] for b in s["blocks"][:-1]}
            self.assertTrue(previous_cuts <= current)
            previous_cuts = current
        self.assertEqual(len(r["slabs"][0]["blocks"]), 1)
        self.assertEqual(len(r["slabs"][-1]["blocks"]), 5)

    def test_refuses_nonstrict_and_malformed(self):
        invalid = [(0, F(1, 5), 0, 0, 0), tuple(-F(j, 5) for j in range(5)),
                   tuple(reversed(WITNESS)), [0]*4, [0]*6, [0, 0, False, 0, 0],
                   [0, 0, 0.0, 0, 0], [0, 0, "1/0", 0, 0], None]
        for xs in invalid:
            with self.assertRaises(ValueError):
                laminar_area(xs)


if __name__ == "__main__":
    started = time.monotonic()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Controls)
    names = [c.id() for c in suite]
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    payload = {"tests": len(names), "names": names, "failures": len(result.failures),
               "errors": len(result.errors), "fixed_case_count": len(Controls.records),
               "cases": Controls.records, "runtime_seconds": time.monotonic()-started,
               "scope": "fixed exact finite crosschecks, not all-K5 lower bound, no sampling/optimization"}
    encoded = json.dumps(ready(payload), indent=2)+"\n"
    if len(encoded.encode()) > 16*1024*1024:
        raise RuntimeError("output ceiling exceeded")
    with (Path(__file__).resolve().parent/"LAMINAR_CONTROLS.json").open("x") as stream:
        stream.write(encoded)
    print(json.dumps({"tests": len(names), "failures": len(result.failures), "errors": len(result.errors),
                      "fixed_cases": len(Controls.records), "bytes": len(encoded.encode()),
                      "runtime_seconds": payload["runtime_seconds"]}))
    raise SystemExit(not result.wasSuccessful())
