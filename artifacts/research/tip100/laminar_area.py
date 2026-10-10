"""Exact TIP100 laminar integration on strict K5, conditional on Main's theorem.

No offset optimization or all-configuration/root lower-bound certification.
"""
from fractions import Fraction as F
from itertools import combinations
from math import comb
from pathlib import Path
import argparse
import json
import re


def rational(x):
    if isinstance(x, bool):
        raise ValueError("boolean offset refused")
    if isinstance(x, (F, int)):
        return F(x)
    if isinstance(x, str) and re.fullmatch(r"[+-]?\d+(?:/[+-]?\d+)?", x):
        try:
            a, *b = x.split("/")
            return F(int(a), int(b[0]) if b else 1)
        except (ValueError, ZeroDivisionError) as exc:
            raise ValueError("invalid exact offset") from exc
    raise ValueError("offset must be exact Fraction/integer/rational string")


def validate_k5(offsets):
    if not isinstance(offsets, (tuple, list)) or len(offsets) != 5:
        raise ValueError("only five-triangle strict K5 input admitted")
    xs = tuple(rational(x) for x in offsets)
    for i, j in combinations(range(5), 2):
        d = 5*(xs[j]-xs[i])
        if not -(j-i) < d < 1:
            raise ValueError("outside strict K5 domain at labels %d,%d" % (i+1, j+1))
    apices = tuple(5*x+j for j, x in enumerate(xs, 1))
    if not all(a < b for a, b in zip(apices, apices[1:])):
        raise ValueError("nonordered apices refused")
    return xs, apices


def split_tree(thresholds, first=1, last=5):
    """Multifurcation records every equal-time cut without dropping refinements."""
    if first == last:
        return {"labels": [first], "binary_refinement_count": 1}
    time = min(thresholds[k-1] for k in range(first, last))
    cuts = [k for k in range(first, last) if thresholds[k-1] == time]
    starts, ends = [first]+[k+1 for k in cuts], cuts+[last]
    children = [split_tree(thresholds, a, b) for a, b in zip(starts, ends)]
    # Ordered binary refinements of an m-way simultaneous split: Catalan(m-1).
    m = len(children)
    count = comb(2*(m-1), m-1)//m
    for child in children:
        count *= child["binary_refinement_count"]
    return {"labels": list(range(first, last+1)), "split_height": time,
            "simultaneous_cut_positions": cuts, "children": children,
            "binary_refinement_count": count}


def laminar_area(offsets):
    xs, apices = validate_k5(offsets)
    threshold_info = []
    for k in range(1, 5):
        values = [(F(1-5*(xs[j]-xs[i]), j-i+1), i+1, j+1)
                  for i in range(k) for j in range(k, 5)]
        tau = max(v[0] for v in values)
        if not 0 < tau < 1:
            raise ArithmeticError("strict K5 threshold must lie inside(0,1)")
        threshold_info.append({"cut_after_label": k, "threshold": tau,
                               "attaining_cross_pairs": [[i, j] for v, i, j in values if v == tau]})
    thresholds = tuple(info["threshold"] for info in threshold_info)
    crossing_info = []
    for i, j in combinations(range(5), 2):
        y = -5*(xs[j]-xs[i])/F(j-i)
        if 0 < y < 1:
            crossing_info.append({"labels": [i+1, j+1], "height": y})
    events = sorted({F(0), F(1), *thresholds, *(c["height"] for c in crossing_info)})
    slabs = []
    total_scaled = F(0)
    for bottom, top in zip(events, events[1:]):
        midpoint = (bottom+top)/2
        cuts = [k for k, tau in enumerate(thresholds, 1) if tau < midpoint]
        starts, ends = [1]+[k+1 for k in cuts], cuts+[5]
        blocks = []
        slope, intercept = F(0), F(0)
        for first, last in zip(starts, ends):
            labels = list(range(first, last+1))
            at = lambda j: 5*xs[j-1]+j*midpoint
            left = min(labels, key=at)
            right = max(labels, key=at)
            block_slope = F(right-left-1)
            block_intercept = 1+5*(xs[right-1]-xs[left-1])
            slope += block_slope
            intercept += block_intercept
            blocks.append({"labels": labels, "minimum_left_label": left,
                           "maximum_left_label": right,
                           "scaled_affine_slope": block_slope,
                           "scaled_affine_intercept": block_intercept})
        area = slope*(top*top-bottom*bottom)/2+intercept*(top-bottom)
        if area < 0:
            raise ArithmeticError("negative slab area")
        total_scaled += area
        slabs.append({"bottom": bottom, "top": top, "blocks": blocks,
                      "scaled_affine_slope": slope, "scaled_affine_intercept": intercept,
                      "scaled_area": area, "actual_area": area/5})
    for left, right in zip(slabs, slabs[1:]):
        y = left["top"]
        if left["scaled_affine_slope"]*y+left["scaled_affine_intercept"] != right["scaled_affine_slope"]*y+right["scaled_affine_intercept"]:
            raise ArithmeticError("laminar affine laws violate boundary continuity")
    return {"status": "EXACT_K5_AREA_CONDITIONAL_ON_MAIN_LAMINAR_THEOREM", "offsets": xs,
            "scaled_apices": apices, "cut_thresholds": threshold_info,
            "left_line_crossings": crossing_info, "event_heights": events, "slabs": slabs,
            "split_tree": split_tree(thresholds), "area": total_scaled/5,
            "scope": "strict K5 only; finite input evaluation, NOT universal lower bound or root closure"}


def ready(x):
    if isinstance(x, F):
        return str(x)
    if isinstance(x, dict):
        return {k: ready(v) for k, v in x.items()}
    if isinstance(x, (tuple, list)):
        return [ready(v) for v in x]
    return x


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("offsets", nargs=5)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    try:
        result = laminar_area(args.offsets)
    except ValueError as exc:
        print(json.dumps({"status": "REFUSED", "reason": str(exc)}))
        raise SystemExit(2)
    encoded = json.dumps(ready(result), indent=2)+"\n"
    if len(encoded.encode()) > 16*1024*1024:
        raise RuntimeError("output ceiling exceeded")
    with Path(args.out).open("x") as stream:
        stream.write(encoded)
    print(json.dumps({"status": result["status"], "area": str(result["area"]),
                      "slabs": len(result["slabs"]), "bytes": len(encoded.encode())}))
