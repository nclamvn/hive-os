"""Exact coarse-cell quadratic/face certification, conditional on Main's theorem.

The symbolic sweep derives the quadratic on a generic fine subcell. Main's
geometric degree theorem and continuity extend it to the coarse-cell closure.
No partial cover can establish the global root. n3/n4 are validation only.
"""
import argparse
from fractions import Fraction as F
from itertools import combinations
import json
import resource
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tip098"))
from kakeya_exact import area_affine, area_trapezoid
from coarse_walls import walls
from overlap_bounds import component_cs_bound, graph_bound, possible_graph

MONOMIALS = tuple(combinations(range(5), 2)) + tuple((i, i) for i in range(5))


def dot(a, b):
    return sum((x * y for x, y in zip(a, b)), F(0))


def affine_at(a, x):
    return dot(a[:4], x) + a[4]


def product(a, b):
    return tuple(a[i] * b[j] + (a[j] * b[i] if i != j else 0)
                 for i, j in MONOMIALS)


def poly_at(p, x):
    z = tuple(x) + (F(1),)
    return sum((c * z[i] * z[j] for c, (i, j) in zip(p, MONOMIALS)), F(0))


def hessian_linear(p):
    h = [[F(0)] * 4 for _ in range(4)]
    linear = [F(0)] * 4
    constant = F(0)
    for c, (i, j) in zip(p, MONOMIALS):
        if j == 4:
            if i == 4:
                constant = c
            else:
                linear[i] = c
        elif i == j:
            h[i][i] = 2 * c
        else:
            h[i][j] = h[j][i] = c
    return h, linear, constant


def rref(matrix, rhs, width=None):
    """Return particular solution and a basis of the nullspace, or None."""
    n = width if width is not None else len(matrix[0]) if matrix else 0
    work = [[F(x) for x in row] + [F(y)] for row, y in zip(matrix, rhs)]
    pivots = []
    for col in range(n):
        pivot = next((i for i in range(len(pivots), len(work)) if work[i][col]), None)
        if pivot is None:
            continue
        row = len(pivots)
        work[row], work[pivot] = work[pivot], work[row]
        value = work[row][col]
        work[row] = [x / value for x in work[row]]
        for i in range(len(work)):
            if i != row and work[i][col]:
                factor = work[i][col]
                work[i] = [a - factor * b for a, b in zip(work[i], work[row])]
        pivots.append(col)
    if any(not any(row[:n]) and row[n] for row in work):
        return None
    particular = [F(0)] * n
    for i, col in enumerate(pivots):
        particular[col] = work[i][n]
    null = []
    for free in set(range(n)) - set(pivots):
        direction = [F(0)] * n
        direction[free] = F(1)
        for i, col in enumerate(pivots):
            direction[col] = -work[i][free]
        null.append(direction)
    return particular, null


def rank(rows, width):
    result = rref(rows, [F(0)] * len(rows), width)
    return width - len(result[1])


def determinant(matrix):
    if not matrix:
        return F(1)
    m = [row[:] for row in matrix]
    result = F(1)
    for col in range(len(m)):
        pivot = next((i for i in range(col, len(m)) if m[i][col]), None)
        if pivot is None:
            return F(0)
        if pivot != col:
            m[pivot], m[col] = m[col], m[pivot]
            result = -result
        value = m[col][col]
        result *= value
        for row in range(col + 1, len(m)):
            factor = m[row][col] / value
            for j in range(col + 1, len(m)):
                m[row][j] -= factor * m[col][j]
    return result


def psd(h):
    for size in range(1, len(h) + 1):
        for ids in combinations(range(len(h)), size):
            if determinant([[h[i][j] for j in ids] for i in ids]) < 0:
                return False
    return True


def endpoint_lines(n):
    pairs = []
    for j in range(1, n + 1):
        b = [F(0)] * 5
        if j < n:
            b[j - 1] = F(1)
        left = (F(j, n), tuple(b))
        b[4] = F(1, n)
        right = (F(j - 1, n), tuple(b))
        pairs.append((left, right))
    return pairs


def symbolic_quad(n, center, coarse_planes, guard=lambda: None):
    pairs = endpoint_lines(n)
    endpoints = [line for pair in pairs for line in pair]
    heights = {(F(0),) * 5, (F(0),) * 4 + (F(1),)}
    fine_walls = []
    for (s, b), (t, c) in combinations(endpoints, 2):
        if s != t:
            heights.add(tuple((y - x) / (s - t) for x, y in zip(b, c)))
        else:
            fine_walls.append(tuple(x - y for x, y in zip(b, c)))
    for a, b in combinations(heights, 2):
        fine_walls.append(tuple(x - y for x, y in zip(a, b)))
    fine_walls = [wall for wall in fine_walls if any(wall[:4])]
    all_walls = list(coarse_planes) + fine_walls
    zero_walls = [w for w in all_walls if affine_at(w, center) == 0]
    # A nonzero degree<=3 polynomial has <=3 integer roots. The finite set
    # of zero walls therefore cannot forbid all tested moment-curve directions.
    direction = None
    for t in range(1, 3 * len(zero_walls) + 2):
        trial = tuple(F(t ** j) for j in range(4))
        if all(dot(w[:4], trial) for w in zero_walls):
            direction = trial
            break
    if direction is None:
        raise ArithmeticError("NO_GENERIC_DIRECTION")
    step = F(1, 100)
    for wall in all_walls:
        value = affine_at(wall, center)
        derivative = dot(wall[:4], direction)
        if value and derivative:
            step = min(step, abs(value / derivative) / 2)
    sample = tuple(x + step * d for x, d in zip(center, direction))
    for wall in coarse_planes:
        if affine_at(wall, sample) * affine_at(wall, center) <= 0:
            raise ArithmeticError("SAMPLE_NOT_STRICT_COARSE_INTERIOR")
    selected = [h for h in heights if 0 <= affine_at(h, sample) <= 1]
    selected.sort(key=lambda h: affine_at(h, sample))
    if len({affine_at(h, sample) for h in selected}) != len(selected):
        raise ArithmeticError("NON_GENERIC_FINE_HEIGHTS")
    result = [F(0)] * 15
    for bottom, top in zip(selected, selected[1:]):
        guard()
        y = (affine_at(bottom, sample) + affine_at(top, sample)) / 2

        def at(line):
            return affine_at(line[1], sample) + line[0] * y

        ordered = sorted(pairs, key=lambda pair: at(pair[0]))
        left, right = ordered[0]
        slope = F(0)
        intercept = [F(0)] * 5

        def accumulate(a, b):
            nonlocal slope, intercept
            slope += b[0] - a[0]
            intercept = [v + br - al for v, br, al in zip(intercept, b[1], a[1])]

        for next_left, next_right in ordered[1:]:
            if at(next_left) > at(right):
                accumulate(left, right)
                left, right = next_left, next_right
            elif at(next_right) > at(right):
                right = next_right
        accumulate(left, right)
        height_diff = tuple(t - b for t, b in zip(top, bottom))
        affine_term = product(intercept, height_diff)
        top_square, bottom_square = product(top, top), product(bottom, bottom)
        result = [old + b + slope * (ts - bs) / 2
                  for old, b, ts, bs in zip(result, affine_term, top_square, bottom_square)]
    primary = area_trapezoid(list(sample[:n - 1]) + [0])
    secondary = area_affine(list(sample[:n - 1]) + [0])
    if primary != secondary or poly_at(result, sample) != primary:
        raise ArithmeticError("SYMBOLIC_QUADRATIC_AREA_MISMATCH")
    return tuple(result), sample, step


class Certifier:
    def __init__(self, geometry, n=5, target=F(14, 61), seconds=120, cell_cap=50000):
        self.geometry = geometry
        self.n, self.target = n, target
        self.started, self.seconds = time.monotonic(), seconds
        self.cell_cap = cell_cap
        self.points = [tuple(F(x, h[4]) for x in h[:4])
                       for h in ([int(x) for x in v["h"]] for v in geometry["vertices"])]
        self.planes = [tuple(F(x) for x in plane) for plane in geometry["planes"]]
        self.cache = {}
        self.pending_faces = set()
        self.faces_seen = 0
        self.psd_pruned = 0
        self.singular_checked = 0
        self.stationary_infeasible = 0
        self.cells_done = 0
        self.witness = None
        self.cell_results = []
        self.retired_checked = 0

    def guard(self):
        if time.monotonic() - self.started > self.seconds:
            raise RuntimeError("TIME_LIMIT")
        native = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        byte_count = native if sys.platform == "darwin" else native * 1024
        if byte_count > 1536 * 1024 * 1024:
            raise RuntimeError("RSS_LIMIT")

    def certify_value(self, point, value):
        if value < self.target:
            offsets = list(point[:self.n - 1]) + [F(0)]
            first, second = area_trapezoid(offsets), area_affine(offsets)
            if first != second or first != value:
                raise ArithmeticError("NEGATIVE_WITNESS_AREA_MISMATCH")
            self.witness = {"offsets": offsets, "area": first, "both_algorithms_agree": True}
            raise RuntimeError("EXACT_SMALLER_WITNESS")

    def stationary_feasible(self, point, directions, inequalities):
        if not directions:
            return point if all(affine_at(w, point) >= 0 for w in inequalities) else None
        if all(affine_at(w, point) >= 0 for w in inequalities):
            return point
        k = len(directions)
        rows = [tuple(dot(w[:4], d) for d in directions) for w in inequalities]
        rhs = [-affine_at(w, point) for w in inequalities]
        reduced = list({(row, b) for row, b in zip(rows, rhs) if any(row)})
        if any(not any(row) and b > 0 for row, b in zip(rows, rhs)):
            return None
        for indices in combinations(range(len(reduced)), k):
            self.guard()
            solved = rref([reduced[i][0] for i in indices],
                          [reduced[i][1] for i in indices], k)
            if solved is None or solved[1]:
                continue
            candidate = tuple(x + sum((t * d[j] for t, d in zip(solved[0], directions)), F(0))
                              for j, x in enumerate(point))
            if all(affine_at(w, candidate) >= 0 for w in inequalities):
                return candidate
        return None

    def face(self, ids, polynomial, inequalities):
        self.guard()
        key = tuple(sorted(ids))
        if key in self.cache:
            return
        self.pending_faces.add(key)
        self.faces_seen += 1
        origin = self.points[key[0]]
        basis = []
        for id in key[1:]:
            difference = tuple(x - y for x, y in zip(self.points[id], origin))
            if rank(basis + [difference], 4) > len(basis):
                basis.append(difference)
        if not basis:
            self.certify_value(origin, poly_at(polynomial, origin))
            self.cache[key] = {"method": "VERTEX_CHECKED", "value": poly_at(polynomial, origin)}
            self.pending_faces.discard(key)
            return
        h, linear, _ = hessian_linear(polynomial)
        gradient = [dot(row, origin) + g for row, g in zip(h, linear)]
        restricted = [[dot(a, [dot(row, b) for row in h]) for b in basis] for a in basis]
        restricted_gradient = [dot(b, gradient) for b in basis]
        stationary = rref(restricted, [-g for g in restricted_gradient], len(basis))
        positive_semidefinite = psd(restricted)
        if stationary is not None:
            particular, null = stationary
            point = tuple(x + sum((t * b[j] for t, b in zip(particular, basis)), F(0))
                          for j, x in enumerate(origin))
            value = poly_at(polynomial, point)
            if positive_semidefinite and value >= self.target:
                self.psd_pruned += 1
                self.cache[key] = {"method": "PSD_UNCONSTRAINED_BOUND", "lower_bound": value,
                                   "dimension": len(basis)}
                self.pending_faces.discard(key)
                return
            directions = [tuple(sum((t * b[j] for t, b in zip(direction, basis)), F(0))
                                for j in range(4)) for direction in null]
            if directions:
                self.singular_checked += 1
            feasible = self.stationary_feasible(point, directions, inequalities)
            if feasible is not None:
                self.certify_value(feasible, poly_at(polynomial, feasible))
            else:
                self.stationary_infeasible += 1
        boundaries = set()
        for wall in inequalities:
            subset = tuple(id for id in key if affine_at(wall, self.points[id]) == 0)
            if subset and len(subset) < len(key):
                boundaries.add(subset)
        if not boundaries:
            raise ArithmeticError("POSITIVE_DIMENSION_FACE_WITHOUT_BOUNDARY")
        for boundary in sorted(boundaries, key=lambda x: (len(x), x)):
            self.face(boundary, polynomial, inequalities)
        self.cache[key] = {"method": "ALL_BOUNDARIES_AND_STATIONARY_CHECKED",
                           "dimension": len(basis), "boundary_vertex_sets": sorted(boundaries),
                           "stationary": ("INCONSISTENT" if stationary is None else
                                          "FEASIBLE" if feasible is not None else "INFEASIBLE"),
                           "stationary_value": (None if stationary is None else value)}
        self.pending_faces.discard(key)

    def run(self):
        reason = "ALL_CELLS_AND_FACES_CERTIFIED"
        complete = False
        try:
            if self.geometry["status"] != "COMPLETE_COVER":
                raise RuntimeError("COVER_INCOMPLETE")
            if self.n == 5:
                if len(self.planes[8:]) != 78 or set(self.planes[8:]) != {
                        tuple(F(x) for x in wall) for wall in walls(5)}:
                    raise RuntimeError("TARGET_WALL_LIST_MISMATCH")
                if self.geometry["cells"] and (self.geometry["processed_planes"] != 78 or
                                                self.geometry["pending_planes"] != 0):
                    raise RuntimeError("TARGET_WALLS_INCOMPLETE")
                for cell in self.geometry.get("retired_cells", []):
                    self.guard()
                    ids = tuple(sorted(cell["vertices"]))
                    if len(set(ids)) != len(ids) or not ids or rank([
                            tuple(x - y for x, y in zip(self.points[id], self.points[ids[0]]))
                            for id in ids[1:]], 4) != 4:
                        raise ArithmeticError("BAD_RETIRED_CELL_DIMENSION")
                    signs = cell["signs"]
                    if len(signs) > self.geometry["processed_planes"] or any(s not in "+-" for s in signs):
                        raise ArithmeticError("BAD_RETIRED_CELL_SIGNS")
                    inequalities = [tuple(-x for x in w) for w in self.planes[:8]]
                    inequalities.extend(tuple(x if s == "+" else -x for x in wall)
                                        for s, wall in zip(signs, self.planes[8:]))
                    if not all(affine_at(w, self.points[id]) >= 0 for w in inequalities for id in ids):
                        raise ArithmeticError("RETIRED_VERTEX_OUTSIDE_PREFIX")
                    graph = possible_graph([self.points[id] for id in ids])
                    bound = graph_bound(graph)
                    supplied = F(int(cell["bound_num"]), int(cell["bound_den"]))
                    if (graph != cell["graph_mask"] or
                            supplied not in (bound, component_cs_bound(graph)) or supplied < self.target):
                        raise ArithmeticError("RETIRED_GRAPH_BOUND_INVALID")
                    self.retired_checked += 1
            for cell in self.geometry["cells"]:
                self.guard()
                if self.cells_done >= self.cell_cap:
                    raise RuntimeError("CELL_LIMIT")
                ids = tuple(sorted(cell["vertices"]))
                if len(set(ids)) != len(ids) or rank([
                        tuple(x - y for x, y in zip(self.points[id], self.points[ids[0]]))
                        for id in ids[1:]], 4) != 4:
                    raise ArithmeticError("BAD_FULL_DIMENSION_CELL")
                signs = cell["signs"]
                if len(signs) != self.geometry["processed_planes"] or any(s not in "+-" for s in signs):
                    raise ArithmeticError("BAD_CELL_SIGNS")
                inequalities = [tuple(-x for x in w) for w in self.planes[:8]]
                for s, wall in zip(signs, self.planes[8:]):
                    inequalities.append(tuple(x if s == "+" else -x for x in wall))
                if not all(affine_at(w, self.points[id]) >= 0 for w in inequalities for id in ids):
                    raise ArithmeticError("CELL_VERTEX_OUTSIDE_HALFSPACES")
                center = tuple(sum((self.points[id][j] for id in ids), F(0)) / len(ids)
                               for j in range(4))
                polynomial, sample, step = symbolic_quad(self.n, center, inequalities, self.guard)
                self.face(ids, polynomial, inequalities)
                self.cells_done += 1
                self.cell_results.append({"cell": self.cells_done - 1, "polynomial": polynomial,
                                          "sample": sample, "step": step, "status": "CERTIFIED"})
            complete = self.geometry["status"] == "COMPLETE_COVER"
            if not complete:
                reason = "VALIDATION_PREFIX_ONLY"
        except (RuntimeError, ArithmeticError, ValueError) as exc:
            reason = str(exc)
        return {"status": "COMPLETE_BOUND" if complete else (
                "EXACT_SMALLER_WITNESS" if self.witness else "PARTIAL_BOUND"),
                "reason": reason, "n": self.n, "target": self.target,
                "scope": "TARGET" if self.n == 5 else "VALIDATION_ONLY",
                "cover_status": self.geometry["status"], "cells_certified": self.cells_done,
                "retired_graph_cells_verified": self.retired_checked,
                "retired_graph_cells_pending": len(self.geometry.get("retired_cells", [])) - self.retired_checked,
                "cells_pending": len(self.geometry["cells"]) - self.cells_done,
                "unique_faces_seen": self.faces_seen, "unique_faces_certified": len(self.cache),
                "unprocessed_face_vertex_sets": sorted(self.pending_faces),
                "psd_unconstrained_prunes": self.psd_pruned,
                "singular_stationary_feasibility_checks": self.singular_checked,
                "stationary_infeasible": self.stationary_infeasible,
                "elapsed_seconds": time.monotonic() - self.started, "witness": self.witness,
                "cell_certificates": self.cell_results,
                "face_certificates": [{"vertices": ids, **certificate}
                                      for ids, certificate in sorted(self.cache.items())],
                "analytic_premises": ["Main coarse chamber degree<=2 theorem",
                                      "area continuity on chamber closures",
                                      "native exact split-induction coverage correctness"],
                "shared_face_cache_basis": "identical global vertex set determines same convex face; area continuity agrees on its affine hull",
                "guards": {"seconds": self.seconds, "cell_cap": self.cell_cap,
                           "rss_bytes": 1536 * 1024 * 1024, "artifact_bytes": 64 * 1024 * 1024}}


def json_ready(value):
    if isinstance(value, F):
        return str(value)
    if isinstance(value, dict):
        return {k: json_ready(v) for k, v in value.items()}
    if isinstance(value, (tuple, list)):
        return [json_ready(v) for v in value]
    return value


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--coverage", required=True)
    p.add_argument("--out", required=True)
    p.add_argument("--n", type=int, default=5, choices=(3, 4, 5))
    p.add_argument("--target", default="14/61")
    p.add_argument("--seconds", type=float, default=120)
    p.add_argument("--cell-cap", type=int, default=50000)
    args = p.parse_args()
    if not 0 < args.seconds <= 120 or not 1 <= args.cell_cap <= 50000:
        p.error("time/cell caps exceed charter")
    with open(args.coverage) as source:
        geometry = json.load(source)
    result = Certifier(geometry, args.n, F(args.target), args.seconds, args.cell_cap).run()
    data = json.dumps(json_ready(result), sort_keys=True)
    if len(data.encode()) > 64 * 1024 * 1024:
        data = json.dumps({"status": "PARTIAL_BOUND", "reason": "ARTIFACT_LIMIT"})
    with open(args.out, "x") as output:
        output.write(data + "\n")
    print(json.dumps({k: v for k, v in json_ready(result).items()
                     if k not in ("cell_certificates", "face_certificates")}, sort_keys=True))
    sys.exit(0 if result["status"] in ("COMPLETE_BOUND", "EXACT_SMALLER_WITNESS") else 3)
