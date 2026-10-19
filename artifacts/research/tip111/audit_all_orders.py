"""TIP111 feasibility inventory and fixed exact event-law controls, NOT a cover.

No geometry producer, stationary classifier, search, tail hull substitution or
cost qualification is implemented. Every crossing PAIR is retained: different
spatial events may have the same height and must both contribute.
"""
from fractions import Fraction as F
from functools import reduce
from itertools import combinations
from math import comb, gcd
from pathlib import Path
import argparse
import json
import resource
import signal
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tip098"))
from kakeya_exact import area_affine, area_trapezoid


def canonical(row):
    divisor = reduce(gcd, (abs(x) for x in row), 0)
    if not divisor:
        return None
    row = tuple(x // divisor for x in row)
    return row if next(x for x in row if x) > 0 else tuple(-x for x in row)


def apex_words(first=1):
    if first == 7:
        return [()]
    words = [(first,) + rest for rest in apex_words(first + 1)]
    if first < 6:
        words += [(first + 1, first) + rest for rest in apex_words(first + 2)]
    return words


def endpoint_inventory(guard):
    # Gauge A6=0; five coefficients followed by one affine constant.
    apex = [tuple(int(i == j) for i in range(5)) for j in range(5)] + [(0,) * 5]
    lines = [(s, a, j, kind) for j, a in enumerate(apex, 1)
             for s, kind in ((-j, "L"), (1 - j, "R"))]
    homogeneous = set()
    unit = set()
    top = set()
    for (s, a, _, _), (t, b, _, _) in combinations(lines, 2):
        guard()
        difference = tuple(y - x for x, y in zip(a, b))
        row = canonical(difference)
        if row:
            top.add(row)
            if s == t:
                homogeneous.add(row)
        if s != t:
            row = canonical(difference + (t - s,))
            if row and any(row[:5]):
                unit.add(row)
    for (s, a, _, _), (t, b, _, _), (u, c, _, _) in combinations(lines, 3):
        guard()
        row = canonical(tuple((t - s) * (z - x) - (u - s) * (y - x)
                              for x, y, z in zip(a, b, c)))
        if row:
            homogeneous.add(row)
    coarse = {p + (0,) for p in homogeneous | top} | unit
    return tuple(sorted(homogeneous)), tuple(sorted(top)), tuple(sorted(unit)), tuple(sorted(coarse))


def shape_inventory(word, homogeneous, guard):
    # A_word[0]=0, A_word[-1]=1; four internal ordered coordinates.
    vertices = ((0, 0, 0, 0), (0, 0, 0, 1), (0, 0, 1, 1),
                (0, 1, 1, 1), (1, 1, 1, 1))
    mapped = set()
    for old in homogeneous:
        guard()
        invariant = old + (-sum(old),)
        row = canonical(tuple(invariant[j - 1] for j in word[1:5])
                        + (invariant[word[5] - 1],))
        if row is None or not any(row[:4]):
            continue
        values = [sum(x * y for x, y in zip(row[:4], p)) + row[4] for p in vertices]
        if min(values) < 0 < max(values):
            mapped.add(row)
    walls = sorted(mapped)
    return {"word": list(word), "shape_dimension": 4, "cutting_wall_count": len(walls),
            "cutting_walls": [list(row) for row in walls], "simplex_boundaries": 5,
            "generic_cell_upper_bound_not_actual_count": sum(comb(len(walls), k) for k in range(5)),
            "coverage": "NONE"}


def event_area(p, guard):
    """Numeric exact evaluation of the hand event-spline identity on generic p.

    In depth t, I_j=[A_j-j*t,A_j-(j-1)*t]. Initial union length0 has slope6.
    An exposed LL/RR crossing adds abs(s1-s2) to the slope; exposed LR subtracts.
    Covering by any OTHER triangle makes the contribution0. Integrating slope
    jumps gives G=3+sum(delta*(1-te)^2)/2, valid only with no same-location
    triple concurrence or persistent equal-slope contact in these controls.
    """
    a = tuple(pj + j for j, pj in enumerate(p, 1))
    lines = [(a[j - 1], slope, j, kind) for j in range(1, 7)
             for slope, kind in ((-j, "L"), (1 - j, "R"))]
    result = F(3)
    events = []
    for left, right in combinations(lines, 2):
        guard()
        b, s, j, kind = left
        c, r, k, other = right
        if s == r:
            if b == c:
                raise ArithmeticError("PERSISTENT_CONTACT_CONTROL_NOT_GENERIC")
            continue
        height = (c - b) / (s - r)
        if not 0 < height < 1:
            continue
        position = b + s * height
        if any(position == av - ell * height or position == av - (ell - 1) * height
               for ell, av in enumerate(a, 1) if ell not in (j, k)):
            raise ArithmeticError("TRIPLE_LOCATION_CONTROL_NOT_GENERIC")
        covered = any(av - ell * height < position < av - (ell - 1) * height
                      for ell, av in enumerate(a, 1) if ell not in (j, k))
        jump = 0 if covered else (1 if kind == other else -1) * abs(s - r)
        result += F(jump, 2) * (1 - height) ** 2
        events.append({"pair": [j, kind, k, other], "height": str(height),
                       "covered": covered, "slope_jump": jump})
    return result, events


def fixed_control(name, p, coarse, guard):
    a = tuple(pj + j for j, pj in enumerate(p, 1))
    gauge = tuple(av - a[5] for av in a[:5]) + (F(1),)
    zero_walls = [list(row) for row in coarse if sum(x * y for x, y in zip(row, gauge)) == 0]
    if zero_walls:
        raise ArithmeticError("CONTROL_ON_COARSE_WALL:" + name)
    event, events = event_area(p, guard)
    x = tuple((pj - p[5]) / 6 for pj in p)
    first, second = area_trapezoid(x), area_affine(x)
    guard()
    if event != 6 * first or first != second:
        raise ArithmeticError("THREE_EXACT_PATHS_DISAGREE:" + name)
    return {"name": name, "p": list(map(str, p)), "offsets": list(map(str, x)),
            "apex_word": sorted(range(1, 7), key=lambda j: a[j - 1]),
            "G_event": str(event), "area_trapezoid": str(first), "area_affine": str(second),
            "events": events, "agreement": True, "coverage": "NONE"}


def run(seconds):
    start = time.monotonic()
    def guard():
        if time.monotonic() - start >= seconds:
            raise TimeoutError("INTERNAL_SECONDS_LIMIT")
        peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (peak if sys.platform == "darwin" else peak * 1024) > 1024 ** 3:
            raise MemoryError("RSS_LIMIT")
    result = {"status": "FEASIBILITY_AUDIT_NOT_COVER", "coverage": "NONE",
              "whole_cost_qualified": False, "max_seconds": seconds, "failures": 0,
              "inventories": [], "controls": []}
    try:
        homogeneous, top, unit, coarse = endpoint_inventory(guard)
        words = apex_words()
        if len(words) != 13 or len(set(words)) != 13:
            raise ArithmeticError("BAD_THIRTEEN_WORDS")
        result.update({"homogeneous_raw_count": len(homogeneous), "top_planes": len(top),
                       "unit_clip_planes": len(unit), "full_affine_coarse_count": len(coarse),
                       "full_affine_coarse_planes": [list(row) for row in coarse]})
        for word in words:
            result["inventories"].append(shape_inventory(word, homogeneous, guard))
            # Fixed moment-style ordered rank values; base101 prevents small
            # integer concurrence relations. No adaptive fitting/navigation.
            apices = [F(0)] * 6
            for rank, label in enumerate(word):
                apices[label - 1] = F(3 * (101 ** rank - 1), 2 * (101 ** 5 - 1))
            p = tuple(av - j for j, av in enumerate(apices, 1))
            result["controls"].append(fixed_control("word_" + "".join(map(str, word)), p, coarse, guard))
        base = tuple(map(F, ("7/5", "3/10", "1", "3/2", "3/5", "0")))
        # The unperturbed hand point has BOTH a clip contact L3(1)=R6(1)
        # and LL/RR triple concurrence for labels1,3,5 at t=4/5.
        # Keep it only as the nongeneric tail illustration. This single
        # declared perturbation is fixed in advance, not navigation/search.
        p = tuple(value + F(1, 101 ** j) if j < 6 else value
                  for j, value in enumerate(base, 1))
        record = fixed_control("fixed_perturbed_connected_bottom_inversion_gap", p, coarse, guard)
        inversion = p[0] - p[1] - 1
        record.update({"bottom_range": str(max(p) - min(p)),
                       "adjacent_1_2_apex_inversion": str(inversion),
                       "persistent_facing_gap": str(inversion), "stationary": "NOT_CLAIMED",
                       "nongeneric_original_hand_p": list(map(str, base)),
                       "fixed_perturbation": "p_i=base_i+101^(-i),i1..5;p6=0"})
        result["controls"].append(record)
        result["scope"] = "all13 inventories and14 fixed finite law controls only; no cells/stationary families/independent cover or total-cost qualification"
    except (ArithmeticError, ValueError, TimeoutError, MemoryError) as exc:
        result.update({"status": "REFUSED_FEASIBILITY_AUDIT", "reason": str(exc), "failures": 1})
    result["elapsed_seconds"] = time.monotonic() - start
    peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    result["peak_rss_bytes"] = peak if sys.platform == "darwin" else peak * 1024
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seconds", type=float, default=10)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    if not 0 < args.seconds <= 10:
        raise SystemExit("seconds must be in(0,10]")
    def outer_expired(signum, frame):
        raise TimeoutError("OUTER_TWELVE_SECONDS_LIMIT")
    signal.signal(signal.SIGALRM, outer_expired)
    signal.alarm(12)
    result = run(args.seconds)
    encoded = json.dumps(result, sort_keys=True, separators=(",", ":")) + "\n"
    if len(encoded.encode()) > 64 * 1024 * 1024:
        raise SystemExit("ARTIFACT_LIMIT")
    with Path(args.out).open("x", encoding="utf-8") as output:
        output.write(encoded)
    print(json.dumps({k: v for k, v in result.items() if k not in
                      ("inventories", "controls", "full_affine_coarse_planes")}, sort_keys=True))
    raise SystemExit(0 if result["status"] == "FEASIBILITY_AUDIT_NOT_COVER" else 3)


if __name__ == "__main__":
    main()
