"""TIP100 exact closed radial minimum for ONE fixed normalized apex shape.

Main supplies the connected-envelope reduction. No shape search or root bound.
"""
from fractions import Fraction as F
from itertools import combinations
from pathlib import Path
import argparse
import json

from laminar_area import rational, ready


def validate_shape(values):
    if not isinstance(values, (list, tuple)) or len(values) != 5:
        raise ValueError("shape must have five exact entries")
    v = tuple(rational(x) for x in values)
    if v[0] != 0 or v[-1] != 1 or not all(a < b for a, b in zip(v, v[1:])):
        raise ValueError("normalized shape must strictly increase from0to1")
    return v


def scale_ceiling(v):
    return min(F(j-i+1)/(v[j]-v[i]) for i, j in combinations(range(5), 2))


def offsets(v, s):
    s = rational(s)
    return tuple((s*x-j)/5 for j, x in enumerate(v, 1))


def independent_integral_slabs(v):
    """Direct endpoint-union affine integration in r, independent of laminar code."""
    intervals = [((F(-j), x), (F(1-j), x)) for j, x in enumerate(v, 1)]
    lines = [line for pair in intervals for line in pair]
    cuts = {F(0), F(1)}
    for (a, b), (c, d) in combinations(lines, 2):
        if a != c:
            crossing = (d-b)/(a-c)
            if 0 < crossing < 1:
                cuts.add(crossing)
    cuts = sorted(cuts)
    slabs, integral = [], F(0)
    for lo, hi in zip(cuts, cuts[1:]):
        mid = (lo+hi)/2
        at = lambda law: law[0]*mid+law[1]
        ordered = sorted(intervals, key=lambda pair: at(pair[0]))
        left, right = ordered[0]
        alpha, beta = F(0), F(0)
        for nl, nr in ordered[1:]:
            if at(nl) > at(right):
                alpha += right[0]-left[0]
                beta += right[1]-left[1]
                left, right = nl, nr
            elif at(nr) > at(right):
                right = nr
        alpha += right[0]-left[0]
        beta += right[1]-left[1]
        slab_area = alpha*(hi*hi-lo*lo)/2+beta*(hi-lo)
        slabs.append({"lo": lo, "hi": hi, "length_slope": alpha,
                      "length_intercept": beta, "integral_at_lo": integral,
                      "slab_integral": slab_area})
        integral += slab_area
    return slabs, integral


def integral_at(slabs, integral_one, r):
    if r < 0:
        raise ValueError("negative integration height")
    if r >= 1:
        return integral_one+F(5, 2)*(r*r-1)-(r-1)
    for slab in slabs:
        if slab["lo"] <= r <= slab["hi"]:
            lo = slab["lo"]
            return slab["integral_at_lo"]+slab["length_slope"]*(r*r-lo*lo)/2+slab["length_intercept"]*(r-lo)
    raise ArithmeticError("uncovered direct integral height")


def hull_laws(v, m):
    """All possible left-line intersections; merge unchanged envelope laws."""
    cuts = {m, F(1)}
    for i, j in combinations(range(5), 2):
        crossing = (v[j]-v[i])/F(j-i)
        if m < crossing < 1:
            cuts.add(crossing)
    cuts = sorted(cuts)
    laws = []
    for lo, hi in zip(cuts, cuts[1:]):
        mid = (lo+hi)/2
        a = max(range(1, 6), key=lambda j: v[j-1]-j*mid)
        b = min(range(1, 6), key=lambda j: v[j-1]-j*mid)
        law = {"r_lo": lo, "r_hi": hi, "upper_label": a, "lower_label": b,
               "length_slope": F(b-a+1), "length_intercept": v[a-1]-v[b-1]}
        if laws and all(laws[-1][k] == law[k] for k in ("upper_label", "lower_label")):
            laws[-1]["r_hi"] = hi
        else:
            laws.append(law)
    tail = {"r_lo": F(1), "r_hi": None, "upper_label": 1, "lower_label": 5,
            "length_slope": F(5), "length_intercept": F(-1)}
    if laws and laws[-1]["upper_label"] == 1 and laws[-1]["lower_label"] == 5:
        laws[-1]["r_hi"] = None
    else:
        laws.append(tail)
    return laws


def polynomial_at(coefficients, s):
    q0, q1, q2 = coefficients
    return q0+q1*s+q2*s*s


def piece_candidates(coefficients, lo, hi):
    if lo > hi:
        raise ValueError("reversed radial piece")
    q0, q1, q2 = coefficients
    result = [("closed_piece_lower_endpoint", lo), ("closed_piece_upper_endpoint", hi)]
    if q2 > 0:
        s = -q1/(2*q2)
        if lo <= s <= hi:
            result.append(("convex_stationary", s))
    return [{"reason": reason, "scale": s, "area": polynomial_at(coefficients, s)}
            for reason, s in result]


def evaluate(result, scale):
    s = rational(scale)
    if not 0 <= s <= result["scale_ceiling"]:
        raise ValueError("scale outside closed fixed-shape interval")
    values = [polynomial_at(piece["coefficients"], s) for piece in result["radial_pieces"]
              if piece["s_lo"] <= s <= piece["s_hi"]]
    if not values or any(value != values[0] for value in values):
        raise ArithmeticError("radial pieces uncovered/inconsistent at scale")
    return values[0]


def fixed_shape_minimum(values):
    v = validate_shape(values)
    ceiling = scale_ceiling(v)
    m = 1/ceiling
    slabs, integral_one = independent_integral_slabs(v)
    laws = hull_laws(v, m)
    pieces = []
    for law in laws:
        lo = law["r_lo"]
        alpha, beta = law["length_slope"], law["length_intercept"]
        c = integral_at(slabs, integral_one, lo)-alpha*lo*lo/2-beta*lo
        s_lo = 1/law["r_hi"] if law["r_hi"] is not None else F(0)
        s_hi = 1/lo
        pieces.append({**law, "s_lo": s_lo, "s_hi": s_hi,
                       "coefficients": (alpha/10, beta/5, c/5)})
        # Check the envelope law against direct interval-union laws on each
        # overlapping exact formula slab, not an offset/radial sample grid.
        for slab in slabs:
            overlap_lo = max(lo, slab["lo"])
            overlap_hi = min(law["r_hi"] if law["r_hi"] is not None else F(1), slab["hi"])
            if overlap_lo < overlap_hi and (slab["length_slope"], slab["length_intercept"]) != (alpha, beta):
                raise ArithmeticError("Main connected-envelope law disagrees with direct interval integration")
    pieces.sort(key=lambda p: p["s_lo"])
    if len(pieces) > 9:
        raise ArithmeticError("more than nine fixed-shape envelope pieces")
    for left, right in zip(pieces, pieces[1:]):
        s = left["s_hi"]
        if s != right["s_lo"] or polynomial_at(left["coefficients"], s) != polynomial_at(right["coefficients"], s):
            raise ArithmeticError("radial value discontinuity")
        _, ll, lq = left["coefficients"]
        _, rl, rq = right["coefficients"]
        if ll+2*lq*s != rl+2*rq*s:
            raise ArithmeticError("radial derivative discontinuity")
    candidates = []
    for index, piece in enumerate(pieces):
        q0, q1, q2 = piece["coefficients"]
        candidates.extend({"piece": index, **c} for c in
                          piece_candidates(piece["coefficients"], piece["s_lo"], piece["s_hi"]))
        piece["flat_constant"] = q1 == 0 and q2 == 0
    minimum = min(c["area"] for c in candidates)
    result = {"status": "EXACT_FIXED_SHAPE_CLOSED_RADIAL_MINIMUM", "shape": v,
              "scale_ceiling": ceiling, "m": m, "integral_at_one": integral_one,
              "independent_integral_slabs": slabs, "radial_pieces": pieces,
              "candidate_count": len(candidates), "candidates": candidates,
              "minimum": minimum, "minimizing_scales": sorted({c["scale"] for c in candidates if c["area"] == minimum}),
              "flat_minimum_intervals": [[p["s_lo"], p["s_hi"]] for p in pieces if p["flat_constant"] and p["coefficients"][0] == minimum],
              "scope": "source-aware exact 1D fixed-shape minimum; NOT shape optimization or universal K5/root lower bound"}
    if evaluate(result, F(0)) != F(1, 2):
        raise ArithmeticError("zero-scale limit must have area1/2")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("shape", nargs=5)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    try:
        result = fixed_shape_minimum(args.shape)
    except ValueError as exc:
        print(json.dumps({"status": "REFUSED", "reason": str(exc)}))
        raise SystemExit(2)
    encoded = json.dumps(ready(result), indent=2)+"\n"
    if len(encoded.encode()) > 16*1024*1024:
        raise RuntimeError("output ceiling exceeded")
    with Path(args.out).open("x") as stream:
        stream.write(encoded)
    print(json.dumps({"minimum": str(result["minimum"]), "scales": ready(result["minimizing_scales"]),
                      "pieces": len(result["radial_pieces"]), "bytes": len(encoded.encode())}))
