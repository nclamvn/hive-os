"""TIP100: exact arithmetic for Main's graph-conditioned triple inequality.

This is finite formula-branch optimization, not an offset sample or n5 cover.
The analytic pair formula and exhaustive-extrema justification belong to Main.
Coordinates a,b are canonical pair offsets scaled by five.
"""
from fractions import Fraction as F
from itertools import combinations, product
from pathlib import Path
import argparse
import json
import time


def pieces(r):
    if not isinstance(r, int) or r < 1:
        raise ValueError("canonical slope gap must be a positive integer")
    result = []
    if r > 1:
        q = F(1, r * (r * r - 1))
        result.append(("left", F(-r), F(-1), (q, 2 * r * q, r * r * q)))
    result.append(("middle", F(-1), F(0),
                   (-F(r + 2, 2 * r * (r + 1)), -F(1, r + 1), F(1, 2 * (r + 1)))))
    result.append(("right", F(0), F(1),
                   (F(1, 2 * (r + 1)), -F(1, r + 1), F(1, 2 * (r + 1)))))
    return result


def scalar_at(poly, x):
    q, l, c = poly
    return q * x * x + l * x + c


def overlap(r, d):
    d = F(d)
    for _, lo, hi, poly in pieces(r):
        if lo <= d <= hi:
            return scalar_at(poly, d)
    return F(0)


def pair_integral(r, d):
    """Independent exact integration of (1-y-|d+r*y|)_+ for controls."""
    d = F(d)
    cuts = {F(0), F(1)}
    roots = [-d / r, (1 - d) / (r + 1)]
    if r != 1:
        roots.append((-1 - d) / (r - 1))
    cuts.update(y for y in roots if 0 < y < 1)
    cuts = sorted(cuts)
    f = lambda y: max(F(0), 1 - y - abs(d + r * y))
    return sum(((v - u) * (f(u) + f(v)) / 2
                for u, v in zip(cuts, cuts[1:])), F(0))


def hull(points):
    """Rational convex hull; preserves point/line degeneracies."""
    points = sorted(set(points))
    if len(points) < 3:
        return points
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lower, upper = [], []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def edges(poly):
    if len(poly) < 2:
        return []
    if len(poly) == 2:
        return [(poly[0], poly[1])]
    return list(zip(poly, poly[1:] + poly[:1]))


def clip(poly, halfspace):
    """Intersect convex polygon with A*x+B*y >= C, including equality."""
    a, b, c = halfspace
    value = lambda p: a * p[0] + b * p[1] - c
    kept = [p for p in poly if value(p) >= 0]
    for u, v in edges(poly):
        fu, fv = value(u), value(v)
        if fu * fv < 0:
            t = fu / (fu - fv)
            kept.append(tuple(u[k] + t * (v[k] - u[k]) for k in range(2)))
    return hull(kept)


def rectangle(xlo, xhi, ylo, yhi):
    return hull([(xlo, ylo), (xhi, ylo), (xhi, yhi), (xlo, yhi)])


def feasible(p, poly):
    if not poly:
        return False
    if len(poly) == 1:
        return p == poly[0]
    for u, v in edges(poly):
        cross = (v[0] - u[0]) * (p[1] - u[1]) - (v[1] - u[1]) * (p[0] - u[0])
        if cross < 0:
            return False
    if len(poly) == 2:
        u, v = poly
        return ((v[0] - u[0]) * (p[1] - u[1]) == (v[1] - u[1]) * (p[0] - u[0])
                and all(min(u[k], v[k]) <= p[k] <= max(u[k], v[k]) for k in range(2)))
    return True


def quad_at(quad, p):
    qx, lx, qy, ly, c = quad
    x, y = p
    return qx * x * x + lx * x + qy * y * y + ly * y + c


def stationary(poly, quad):
    """Find any feasible point of the full gradient-zero affine set exactly."""
    qx, lx, qy, ly, _ = quad
    section = poly
    for axis, q, l in ((0, qx, lx), (1, qy, ly)):
        if q == 0:
            if l != 0:
                return None
            continue
        z = -l / (2 * q)
        h = (F(1), F(0), z) if axis == 0 else (F(0), F(1), z)
        section = clip(clip(section, h), tuple(-x for x in h))
        if not section:
            return None
    if not section:
        return None
    return tuple(sum((p[k] for p in section), F(0)) / len(section) for k in range(2))


def maximize(poly, quad):
    """All vertices, feasible edge-stationary points, full-stationary set point.

    No concavity assumption is used. Singular/constant directions reduce to a
    feasible affine stationary section; point/line cells remain admissible.
    """
    if not poly:
        return {"status": "EMPTY", "candidates": [], "maximum": None}
    candidates = []
    def add(kind, p):
        if not feasible(p, poly):
            raise ArithmeticError("infeasible extremum candidate")
        candidates.append({"kind": kind, "point": p, "value": quad_at(quad, p)})
    for p in poly:
        add("vertex", p)
    qx, lx, qy, ly, _ = quad
    for u, v in edges(poly):
        dx, dy = v[0] - u[0], v[1] - u[1]
        q = qx * dx * dx + qy * dy * dy
        l = (2 * qx * u[0] + lx) * dx + (2 * qy * u[1] + ly) * dy
        if q:
            t = -l / (2 * q)
            if 0 <= t <= 1:
                add("edge_stationary", (u[0] + t * dx, u[1] + t * dy))
        elif l == 0:
            add("constant_edge", ((u[0] + v[0]) / 2, (u[1] + v[1]) / 2))
    p = stationary(poly, quad)
    if p is not None:
        add("full_stationary", p)
    maximum = max(c["value"] for c in candidates)
    return {"status": "EXACT_MAXIMUM", "candidates": candidates, "maximum": maximum,
            "maximizers": [c["point"] for c in candidates if c["value"] == maximum]}


def sign(n):
    if n == 0:
        raise ValueError("distinct labels required")
    return 1 if n > 0 else -1


def certify(i, j, k, branch):
    if not i < j or k in (i, j):
        raise ValueError("require i<j and distinct third label")
    if branch not in ("bottom_separated", "apex_inverted"):
        raise ValueError("unknown disjoint branch")
    ra, rb = abs(k - i), abs(k - j)
    si, sj = sign(k - i), sign(k - j)
    halfspace = (F(si), F(-sj), F(1)) if branch == "bottom_separated" else (F(-si), F(sj), F(j - i))
    cells = []
    for pa, pb in product(pieces(ra), pieces(rb)):
        na, alo, ahi, (qa, la, ca) = pa
        nb, blo, bhi, (qb, lb, cb) = pb
        poly = clip(rectangle(alo, ahi, blo, bhi), halfspace)
        quad = (qa, la, qb, lb, ca + cb)
        cell = {"pieces": [na, nb], "ranges": [[alo, ahi], [blo, bhi]],
                "quadratic": quad, "vertices": poly, **maximize(poly, quad)}
        cells.append(cell)
    inside = max((cell["maximum"] for cell in cells if cell["maximum"] is not None), default=None)
    outside = max(F(1, ra + 2), F(1, rb + 2))
    upper = max(outside, inside) if inside is not None else outside
    return {"pair": [i, j], "third": k, "branch": branch,
            "canonical_gaps": [ra, rb], "halfspace_ge": halfspace,
            "inside_support_exact_maximum": inside,
            "outside_support_single_overlap_upper_bound": outside,
            "overlap_sum_upper_bound": upper,
            "triple_area_lower_bound": F(3, 10) - upper / 5,
            "cells": cells}


def run(n=5):
    if n not in (3, 5):
        raise ValueError("only approved n3 control/n5 label arithmetic")
    certs = [certify(i, j, k, branch) for i, j in combinations(range(n), 2)
             for k in range(n) if k not in (i, j)
             for branch in ("bottom_separated", "apex_inverted")]
    branches = []
    for i, j in combinations(range(n), 2):
        for branch in ("bottom_separated", "apex_inverted"):
            applicable = [c for c in certs if c["pair"] == [i, j] and c["branch"] == branch]
            best = max(c["triple_area_lower_bound"] for c in applicable)
            branches.append({"pair": [i, j], "branch": branch, "best_triple_lower_bound": best,
                             "best_third_labels": [c["third"] for c in applicable if c["triple_area_lower_bound"] == best]})
    return {"status": "EXACT_BRANCH_ARITHMETIC_CONDITIONAL_ON_MAIN_PROOF",
            "n": n, "certificate_count": len(certs), "certificates": certs,
            "best_by_disjoint_pair_branch": branches,
            "scope": "universal conditioned triple inequality; NOT whole n5/root closure"}


def ready(value):
    if isinstance(value, F):
        return str(value)
    if isinstance(value, dict):
        return {k: ready(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [ready(v) for v in value]
    return value


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True)
    parser.add_argument("--n", type=int, default=5, choices=(3, 5))
    args = parser.parse_args()
    started = time.monotonic()
    result = run(args.n)
    result["runtime_seconds"] = time.monotonic() - started
    encoded = json.dumps(ready(result), indent=2) + "\n"
    if len(encoded.encode()) > 16 * 1024 * 1024:
        raise RuntimeError("output ceiling exceeded")
    with Path(args.out).open("x") as stream:
        stream.write(encoded)
    print(json.dumps({"status": result["status"], "certificate_count": len(result["certificates"]),
                      "bytes": len(encoded.encode()), "runtime_seconds": result["runtime_seconds"],
                      "best_by_disjoint_pair_branch": ready(result["best_by_disjoint_pair_branch"])}))
