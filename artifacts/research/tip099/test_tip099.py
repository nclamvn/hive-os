"""Small deterministic development controls; never a full n5 scientific run."""
from fractions import Fraction as F
from itertools import combinations
import json
from pathlib import Path
import subprocess
import unittest

from coarse_walls import walls
from optimize import (Certifier, MONOMIALS, affine_at, endpoint_lines, json_ready,
                      poly_at, product, psd, rank, rref, symbolic_quad)
from overlap_bounds import component_cs_bound, graph_bound, possible_graph

ROOT = Path(__file__).resolve().parent
NATIVE = ROOT / "coverage_native"


def polynomial(h, linear, constant):
    values = []
    for i, j in MONOMIALS:
        if j == 4:
            values.append(F(constant) if i == 4 else F(linear[i]))
        elif i == j:
            values.append(F(h[i][i]) / 2)
        else:
            values.append(F(h[i][j]))
    return tuple(values)


class Controls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.native_runs = []

    def cover(self, name, wallset, cap=1000, seconds=3):
        # Test fixture/output data are normal generated computation artifacts,
        # not source files. All names are task-owned and retained for Main.
        source = ROOT / ("control_" + name + "_walls.txt")
        result = ROOT / ("control_" + name + ".json")
        source.write_text("\n".join(" ".join(map(str, w)) for w in wallset) + "\n")
        run = subprocess.run([str(NATIVE), "--walls", str(source), "--out", str(result),
                              "--max-planes", str(len(wallset)), "--cell-cap", str(cap),
                              "--seconds", str(seconds)], capture_output=True, text=True, timeout=5)
        self.native_runs.append({"control": name, "returncode": run.returncode,
                                 "stdout": run.stdout, "stderr": run.stderr})
        return json.loads(result.read_text())

    def oracle(self, geometry):
        planes = [tuple(F(x) for x in p) for p in geometry["planes"]]
        points = [tuple(F(int(x), int(v["h"][4])) for x in v["h"][:4])
                  for v in geometry["vertices"]]
        for cell in geometry["cells"]:
            inequalities = [tuple(-x for x in p) for p in planes[:8]]
            inequalities.extend(tuple(x if s == "+" else -x for x in p)
                                for s, p in zip(cell["signs"], planes[8:]))
            expected = set()
            for active in combinations(inequalities, 4):
                solved = rref([p[:4] for p in active], [-p[4] for p in active], 4)
                if solved is not None and not solved[1]:
                    candidate = tuple(solved[0])
                    if all(affine_at(p, candidate) >= 0 for p in inequalities):
                        expected.add(candidate)
            self.assertEqual(expected, {points[i] for i in cell["vertices"]})
            for id in cell["vertices"]:
                active = [j for j, p in enumerate(planes) if affine_at(p, points[id]) == 0]
                self.assertEqual(active, geometry["vertices"][id]["active"])

    def test_wall_counts(self):
        self.assertEqual([len(walls(n)) for n in (3, 4, 5)], [13, 35, 78])

    def test_pair_first_preserves_wall_sets(self):
        for n in (3, 4, 5):
            reordered = walls(n, True)
            self.assertEqual(set(reordered), set(walls(n)))
            self.assertEqual(len(reordered), len(walls(n)))

    def test_cube(self):
        g = self.cover("cube", [])
        self.assertEqual(g["status"], "COMPLETE_COVER")
        self.assertEqual(g["cell_count"], 1)
        self.oracle(g)

    def test_degenerate_rank_edges(self):
        g = self.cover("degenerate", [(1, 1, 1, 1, 0), (1, -1, 0, 0, 0)])
        self.assertEqual(g["cell_count"], 4)
        self.oracle(g)

    def test_repeated_parallel_boundary(self):
        g = self.cover("repeated", [(1, 0, 0, 0, 0), (1, 0, 0, 0, 0),
                                    (1, 0, 0, 0, -1), (1, 0, 0, 0, -3)])
        self.assertEqual(g["cell_count"], 3)
        self.oracle(g)

    def test_cell_guard_preserves_prefix(self):
        g = self.cover("cellcap", [(1, 0, 0, 0, 0)], cap=1)
        self.assertEqual((g["status"], g["reason"], g["processed_planes"], g["cell_count"]),
                         ("PARTIAL_COVER", "CELL_LIMIT", 0, 1))

    def test_time_guard(self):
        g = self.cover("timecap", [(1, 0, 0, 0, 0)], seconds=1e-9)
        self.assertEqual(g["reason"], "TIME_LIMIT")
        self.assertEqual(g["processed_planes"], 0)

    def test_coefficient_guard(self):
        g = self.cover("coefficientcap", [(1000001, 0, 0, 0, 1)])
        self.assertEqual(g["reason"], "NORMAL_COEFFICIENT_LIMIT")

    def test_checked_integer_overflow_refusal(self):
        g = self.cover("overflow", [
            (997123, 493817, -612931, 791237, 192831),
            (-391837, 923441, 813173, -473911, 331421),
            (791927, -833117, 523451, 917933, -219191),
            (319913, 821711, -981017, -617111, 131313)])
        self.assertEqual((g["status"], g["reason"]), ("PARTIAL_COVER", "INT128_OVERFLOW"))
        self.assertLess(g["processed_planes"], 4)

    def test_symbolic_interpolation_15(self):
        # The source witness lies on a coarse wall; test both adjacent sides.
        center = [F(79, 305), F(47, 305), F(10, 61), F(12, 305)]
        for side in (-1, 1):
            point = center[:]
            point[3] += F(side, 100000)
            p, sample, step = symbolic_quad(5, point, walls(5))
            radius = min(abs(affine_at(w, sample)) / sum(abs(c) for c in w[:4])
                         for w in walls(5)) / 10
            checks = [sample]
            for direction in (-1, 1):
                for j in range(4):
                    trial = list(sample)
                    trial[j] += direction * radius
                    checks.append(tuple(trial))
            for i, j in combinations(range(4), 2):
                trial = list(sample)
                trial[i] += radius
                trial[j] += radius
                checks.append(tuple(trial))
            self.assertEqual(len(checks), 15)
            from kakeya_exact import area_affine, area_trapezoid
            for trial in checks:
                self.assertEqual(poly_at(p, trial), area_trapezoid(list(trial) + [0]))
                self.assertEqual(poly_at(p, trial), area_affine(list(trial) + [0]))

    def test_psd_singular_indefinite(self):
        self.assertTrue(psd([[F(1), F(0)], [F(0), F(0)]]))
        self.assertFalse(psd([[F(0), F(1)], [F(1), F(0)]]))
        self.assertFalse(psd([[F(-1)]]))

    def test_stationary_singular_feasibility(self):
        geometry = json.loads((ROOT / "control_cube.json").read_text())
        c = Certifier(geometry)
        cube = [tuple(-F(x) for x in p) for p in geometry["planes"]]
        # An outside particular solution moves into the cube along a nullspace.
        self.assertIsNotNone(c.stationary_feasible((F(4), F(0), F(0), F(0)),
                            [(F(1), F(0), F(0), F(0))], cube))
        self.assertIsNone(c.stationary_feasible((F(4), F(0), F(0), F(0)),
                          [(F(0), F(1), F(0), F(0))], cube))

    def test_nonconvex_face_recursion(self):
        geometry = json.loads((ROOT / "control_cube.json").read_text())
        c = Certifier(geometry, target=F(-9))
        cube = [tuple(-F(x) for x in p) for p in geometry["planes"]]
        p = polynomial([[-2 if i == j == 0 else 0 for j in range(4)]
                        for i in range(4)], [0] * 4, 0)
        c.face(geometry["cells"][0]["vertices"], p, cube)
        self.assertGreater(c.faces_seen, 1)
        self.assertEqual(len(c.cache), c.faces_seen)

    def test_infeasible_psd_stationary_not_pruned(self):
        geometry = json.loads((ROOT / "control_cube.json").read_text())
        c = Certifier(geometry, target=F(1))
        cube = [tuple(-F(x) for x in p) for p in geometry["planes"]]
        p = polynomial([[2 if i == j == 0 else 0 for j in range(4)]
                        for i in range(4)], [-8, 0, 0, 0], 16)
        c.face(geometry["cells"][0]["vertices"], p, cube)
        self.assertGreater(c.stationary_infeasible, 0)
        self.assertEqual(len(c.cache), c.faces_seen)

    def test_incomplete_target_refused(self):
        geometry = json.loads((ROOT / "control_cellcap.json").read_text())
        result = Certifier(geometry).run()
        self.assertEqual((result["status"], result["reason"], result["cells_certified"]),
                         ("PARTIAL_BOUND", "COVER_INCOMPLETE", 0))

    def test_graph_bounds_and_monotonicity(self):
        self.assertEqual(graph_bound(0), F(1, 2))
        bounds = [graph_bound(mask) for mask in range(1024)]
        self.assertEqual(sum(component_cs_bound(mask) >= F(14, 61) for mask in range(1024)), 648)
        self.assertGreaterEqual(sum(v >= F(14, 61) for v in bounds), 648)
        for mask in range(1024):
            for bit in range(10):
                self.assertGreaterEqual(bounds[mask], bounds[mask | (1 << bit)])

    def test_terminal_graph_certificate(self):
        # A small exact 4-cube at well-separated offsets; no native n5 search.
        points = [tuple(F(j + 1) + F((mask >> j) & 1, 10) for j in range(4))
                  for mask in range(16)]
        self.assertEqual(possible_graph(points), 0)
        cubeplanes = []
        for j in range(4):
            for s in (-1, 1):
                wall = [0] * 5
                wall[j] = s
                wall[4] = -3
                cubeplanes.append(wall)
        # Keep the retired cell inside compact cube, then test its local
        # certificate. Synthetic COMPLETE_COVER exercises the consumer branch
        # only; this fixture is deliberately NOT a whole-cube coverage proof.
        points = [tuple(F(-3 * j, 5) + F((mask >> j) & 1, 100)
                        for j in range(4)) for mask in range(16)]
        graph = possible_graph(points)
        bound = graph_bound(graph)
        self.assertGreaterEqual(bound, F(14, 61))
        homogeneous = []
        for point in points:
            from math import lcm
            denominator = lcm(*(x.denominator for x in point))
            homogeneous.append([str(int(x * denominator)) for x in point] + [str(denominator)])
        geometry = {"status": "COMPLETE_COVER", "processed_planes": 0, "pending_planes": 78,
                    "planes": cubeplanes + walls(5),
                    "vertices": [{"h": v} for v in homogeneous], "cells": [],
                    "retired_cells": [{"vertices": list(range(16)), "signs": "",
                                       "graph_mask": graph, "bound_num": str(bound.numerator),
                                       "bound_den": str(bound.denominator)}]}
        result = Certifier(geometry).run()
        self.assertEqual(result["status"], "COMPLETE_BOUND")
        self.assertEqual(result["retired_graph_cells_verified"], 1)
        geometry["retired_cells"][0]["bound_num"] = str(bound.numerator + 1)
        self.assertEqual(Certifier(geometry).run()["reason"], "RETIRED_GRAPH_BOUND_INVALID")


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(Controls)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    (ROOT / "BUILDER_CONTROLS.json").write_text(json.dumps({
        "scope": "DEVELOPMENT_SMALL_CONTROLS_ONLY", "tests": result.testsRun,
        "failures": [(str(test), detail) for test, detail in result.failures],
        "errors": [(str(test), detail) for test, detail in result.errors],
        "native_runs": Controls.native_runs}, indent=2) + "\n")
    raise SystemExit(0 if result.wasSuccessful() else 1)
