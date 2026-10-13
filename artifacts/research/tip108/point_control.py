#!/usr/bin/env python3
"""One exact hand-chosen point; no navigation/search or universal inference."""
import argparse
from fractions import Fraction as Q
import importlib.util
import json
from pathlib import Path
import signal
import time

SOURCE = Path(__file__).resolve().parents[1] / 'tip098' / 'kakeya_exact.py'
spec = importlib.util.spec_from_file_location('immutable_tip098', SOURCE)
area = importlib.util.module_from_spec(spec)
spec.loader.exec_module(area)


def evaluate(xs):
    p = [6 * x for x in xs]
    order = sorted(range(6), key=lambda i: (p[i], i))
    components = []
    for i in order:
        if not components or p[i] > components[-1]['end']:
            components.append({'labels': [i + 1], 'start': p[i], 'end': p[i] + 1})
        else:
            components[-1]['labels'].append(i + 1)
            components[-1]['end'] = max(components[-1]['end'], p[i] + 1)
    span = sum(c['end'] - c['start'] - 1 for c in components)
    edges = []
    for i in range(6):
        for j in range(i + 1, 6):
            if -(j - i) < p[j] - p[i] < 1:
                edges.append([i + 1, j + 1])
    reached = {1}
    while True:
        new = reached | {j for i, j in edges if i in reached} | {i for i, j in edges if j in reached}
        if new == reached:
            break
        reached = new
    first, second = area.area_trapezoid(xs), area.area_affine(xs)
    if first != second:
        raise ValueError('independent exact areas disagree')
    result = {'status': 'EXACT_POINT_ONLY', 'coverage': 'NONE',
              'x': [str(x) for x in xs], 'scaled_p': [str(x) for x in p],
              'area_trapezoid': str(first), 'area_affine': str(second),
              'scaled_area': str(6 * first), 'component_count': len(components),
              'components': [{k: (str(v) if isinstance(v, Q) else sorted(v)) for k, v in c.items()}
                             for c in components],
              'span_sum': str(span), 'positive_overlap_edges': edges,
              'positive_overlap_graph_connected': len(reached) == 6,
              'endpoint_degrees': [sum(1 in edge for edge in edges), sum(6 in edge for edge in edges)],
              'below_global_target': first < Q(20, 93), 'global_root_closed': False}
    if len(components) == 2:
        gap = components[1]['start'] - components[0]['end']
        defect = 12 * first - (2 + span)
        result.update({'bottom_gap': str(gap), 'defect': str(defect),
                       'auxiliary_domain_basic_admissible': gap > 0 and span <= Q(18, 31),
                       'auxiliary_countercandidate': gap > 0 and span <= Q(18, 31) and defect <= 0,
                       'tangent_support_margin_3_plus_3': str(6 * first - (Q(107, 72) - Q(7, 24) * span))})
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--x', nargs=6, required=True)
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    if args.out and args.out.exists():
        parser.error('--out is create-only')
    start = time.monotonic()
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('29 second cap')))
    signal.alarm(29)
    try:
        result = evaluate([area.rational(value) for value in args.x])
    finally:
        signal.alarm(0)
    result['elapsed_seconds'] = time.monotonic() - start
    rendered = json.dumps(result, indent=2) + '\n'
    if args.out:
        with args.out.open('x') as stream:
            stream.write(rendered)
    print(rendered, end='')


if __name__ == '__main__':
    main()
