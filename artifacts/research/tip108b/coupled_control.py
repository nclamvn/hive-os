#!/usr/bin/env python3
"""ONE hand-derived exact coupled-functional diagnostic; no search/coverage."""
import argparse
from fractions import Fraction as Q
import importlib.util
import json
from pathlib import Path
import signal
import time

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('retained_tip098_area', ROOT / 'tip098' / 'kakeya_exact.py')
area = importlib.util.module_from_spec(spec)
spec.loader.exec_module(area)
P = tuple(Q(n, 93) for n in (176, 176, 149, 27, 0, 0))
LEFT = (3, 4, 5)  # zero-based labels4,5,6
RIGHT = (0, 1, 2)
HALF = Q(1, 2)
ANCHOR_CUT = Q(7, 18)


def line_value(line, y):
    constant, slope = line
    return constant + slope * y


def integral(line, lo, hi):
    constant, slope = line
    return constant * (hi - lo) + slope * (hi * hi - lo * lo) / 2


def subtract(first, second):
    return first[0] - second[0], first[1] - second[1]


def event_cuts(lines):
    cuts = {Q(0), HALF, ANCHOR_CUT, Q(1)}
    for index, first in enumerate(lines):
        for second in lines[index + 1:]:
            if first[1] != second[1]:
                y = (second[0] - first[0]) / (first[1] - second[1])
                if 0 < y < 1:
                    cuts.add(y)
    return sorted(cuts)


def evaluate():
    lefts = [(p, Q(i + 1)) for i, p in enumerate(P)]
    rights = [(p + 1, Q(i)) for i, p in enumerate(P)]
    cuts = event_cuts(lefts + rights)
    hull_integrals = {'left': Q(0), 'right': Q(0)}
    intersection_low = Q(0)
    intersection_full = Q(0)
    pair_high = {(i + 1, j + 1): Q(0) for i in LEFT for j in RIGHT}
    slab_records = []
    for lo, hi in zip(cuts, cuts[1:]):
        y = (lo + hi) / 2
        hulls = []
        for name, group in (('left', LEFT), ('right', RIGHT)):
            low = min((lefts[i] for i in group), key=lambda line: line_value(line, y))
            high = max((rights[i] for i in group), key=lambda line: line_value(line, y))
            hulls.append((low, high))
            hull_integrals[name] += integral(subtract(high, low), lo, hi)
        high = min((h[1] for h in hulls), key=lambda line: line_value(line, y))
        low = max((h[0] for h in hulls), key=lambda line: line_value(line, y))
        overlap = subtract(high, low)
        if line_value(overlap, y) > 0:
            intersection_full += integral(overlap, lo, hi)
        if hi <= HALF:
            if line_value(overlap, y) > 0:
                intersection_low += integral(overlap, lo, hi)
        else:
            for i in LEFT:
                for j in RIGHT:
                    high = min((rights[i], rights[j]), key=lambda line: line_value(line, y))
                    low = max((lefts[i], lefts[j]), key=lambda line: line_value(line, y))
                    overlap = subtract(high, low)
                    if line_value(overlap, y) > 0:
                        pair_high[(i + 1, j + 1)] += integral(overlap, lo, hi)
        slab_records.append([str(lo), str(hi)])
    wedges = []
    for group in (LEFT, RIGHT):
        for i, j in zip(group, group[1:]):
            r, delta = j - i, P[j] - P[i]
            wedges.append({'labels': [i + 1, j + 1], 'area': str((r + delta) ** 2 / (2 * (r + 1)))})
    wedge_sum = sum(Q(w['area']) for w in wedges)
    high_sum = sum(pair_high.values())
    true_hull_functional = sum(hull_integrals.values()) - wedge_sum - intersection_low - high_sum
    whole_hull_functional = sum(hull_integrals.values()) - wedge_sum - intersection_full

    # New fixed-support calibration at zero-span3+3,q7/6. Every selected
    # endpoint line is a valid LOWER support on its fixed height segment.
    low_calibration = integral(subtract(rights[2], lefts[3]), Q(0), ANCHOR_CUT)
    low_calibration += integral(subtract(rights[5], lefts[0]), ANCHOR_CUT, HALF)
    high_calibration = integral(subtract(rights[5], lefts[3]), HALF, Q(1))
    high_calibration += integral(subtract(rights[2], lefts[0]), HALF, Q(1))
    d = P[0] - P[5]
    forward_gap = (d - 1, Q(-4))
    gap_cuts = sorted({Q(0), HALF} | ({(d - 1) / 4} if 0 < (d - 1) / 4 < HALF else set()))
    gap_cap = sum(integral(forward_gap, lo, hi) for lo, hi in zip(gap_cuts, gap_cuts[1:])
                  if line_value(forward_gap, (lo + hi) / 2) > 0)
    calibrated = low_calibration + high_calibration - gap_cap - wedge_sum - high_sum

    xs = tuple(p / 6 for p in P)
    first, second = area.area_trapezoid(xs), area.area_affine(xs)
    if first != second:
        raise ValueError('retained exact areas disagree')
    span_left = max(P[i] for i in LEFT) - min(P[i] for i in LEFT)
    span_right = max(P[i] for i in RIGHT) - min(P[i] for i in RIGHT)
    span = span_left + span_right
    gap = min(P[i] for i in RIGHT) - max(P[i] for i in LEFT) - 1
    if span != Q(18, 31) or gap <= 0:
        raise ValueError('hand point outside declared basic two-group domain')
    edges = [[i + 1, j + 1] for i in range(6) for j in range(i + 1, 6)
             if -(j - i) < P[j] - P[i] < 1]
    reached = {1}
    while True:
        new = reached | {j for i, j in edges if i in reached} | {i for i, j in edges if j in reached}
        if new == reached:
            break
        reached = new
    actual = 6 * first
    if calibrated > true_hull_functional or true_hull_functional > actual or whole_hull_functional > actual:
        raise ValueError('lower-bound orientation failed at hand control')
    target = (2 + span) / 2
    return {'status': 'EXACT_ONE_POINT_FUNCTIONAL_DIAGNOSTIC', 'coverage': 'NONE',
            'point_source': 'hand tangent-corner a=b9/31,q=7/6+(5a+b)/4; no numerical navigation',
            'scaled_p': [str(p) for p in P], 'physical_x': [str(x) for x in xs],
            'left_labels': [4, 5, 6], 'right_labels': [1, 2, 3],
            'span_left': str(span_left), 'span_right': str(span_right), 'span_total': str(span),
            'positive_bottom_gap': str(gap), 'component_count': 2,
            'positive_overlap_edges': edges, 'graph_connected': len(reached) == 6,
            'endpoint_degrees': [sum(1 in edge for edge in edges), sum(6 in edge for edge in edges)],
            'hull_integrals': {k: str(v) for k, v in hull_integrals.items()},
            'adjacent_gap_wedges': wedges, 'wedge_sum': str(wedge_sum),
            'low_hull_intersection': str(intersection_low),
            'full_hull_intersection': str(intersection_full),
            'whole_hull_functional': str(whole_hull_functional),
            'high_pair_records': [{'labels': list(pair), 'area': str(value)} for pair, value in pair_high.items()],
            'high_pair_sum': str(high_sum), 'event_slabs': slab_records,
            'half_height_hull_functional': str(true_hull_functional),
            'fixed_low_calibration': str(low_calibration), 'fixed_high_calibration': str(high_calibration),
            'forward_gap_cap': str(gap_cap), 'fixed_support_functional': str(calibrated),
            'required_scaled_area': str(target),
            'fixed_support_margin': str(calibrated - target),
            'half_height_hull_margin': str(true_hull_functional - target),
            'whole_hull_margin': str(whole_hull_functional - target),
            'whole_hull_target_falsified': whole_hull_functional <= target,
            'fixed_support_target_falsified': calibrated <= target,
            'half_height_hull_target_falsified': true_hull_functional <= target,
            'area_trapezoid': str(first), 'area_affine': str(second), 'actual_scaled_area': str(actual),
            'actual_defect': str(2 * actual - (2 + span)),
            'auxiliary_countercertificate': 2 * actual <= 2 + span,
            'smaller_global_witness': first < Q(20, 93), 'global_root_closed': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    if args.out and args.out.exists():
        parser.error('--out is create-only')
    start = time.monotonic()
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('5 second cap')))
    signal.alarm(5)
    try:
        result = evaluate()
    finally:
        signal.alarm(0)
    result['elapsed_seconds'] = time.monotonic() - start
    rendered = json.dumps(result, indent=2) + '\n'
    if args.out:
        with args.out.open('x') as stream:
            stream.write(rendered)
    print(json.dumps({k: v for k, v in result.items() if k not in ('event_slabs', 'high_pair_records',
                       'positive_overlap_edges', 'adjacent_gap_wedges')}, indent=2))


if __name__ == '__main__':
    main()
