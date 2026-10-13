"""Bounded TIP103 analysis of retained TIP101 stationary equality systems.

This does not regenerate the cover or certify TIP101's analytic premises. It
re-eliminates every distinct recorded quadratic and checks all equality cases,
then inventories every closed incident phase at the feasible equality points.
"""
from collections import Counter
import argparse
from fractions import Fraction as F
import hashlib
from itertools import combinations
import json
from pathlib import Path
import resource
import sys
import time

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'artifacts/research/tip101'))
sys.path.insert(0, str(ROOT / 'artifacts/research/tip098'))
from acceptance_check import (BOUNDARIES, affine, derivatives, exact_eliminate,
                              independent_constraints, value)
from kakeya_exact import area_affine, area_trapezoid


def determinant(matrix):
    a = [list(row) for row in matrix]
    result = F(1)
    for j in range(len(a)):
        k = next((k for k in range(j, len(a)) if a[k][j]), None)
        if k is None:
            return F(0)
        if k != j:
            a[j], a[k] = a[k], a[j]
            result = -result
        pivot = a[j][j]
        result *= pivot
        for k in range(j + 1, len(a)):
            scale = a[k][j] / pivot
            for l in range(j + 1, len(a)):
                a[k][l] -= scale * a[j][l]
    return result


def leading_minors(h, epsilon=F(0)):
    return [determinant([[h[i][j] - epsilon * (i == j)
                          for j in range(k)] for i in range(k)])
            for k in range(1, 5)]


def offsets(point):
    apices = (F(0),) + tuple(point)
    return tuple((a - apices[4] + 5 - j) / 5
                 for j, a in enumerate(apices, 1))


def reflection(x):
    return (x[0], x[0] - x[3], x[0] - x[2], x[0] - x[1], F(0))


def full_scan(seconds=120):
    start = time.monotonic()

    def guard():
        if time.monotonic() - start > seconds:
            raise RuntimeError('TIME_LIMIT')
        rss = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (rss if sys.platform == 'darwin' else rss * 1024) > 1536 * 1024 * 1024:
            raise RuntimeError('RSS_LIMIT')

    paths = {name: ROOT / 'artifacts/research/tip101' / filename
             for name, filename in [('cover', 'MAIN_FULL_SHAPE_COVER.json'),
                                    ('stationary', 'MAIN_FULL_STATIONARY_CERTIFICATE.json')]}
    loaded = {name: json.loads(path.read_text()) for name, path in paths.items()}
    geometry, certificate = loaded['cover'], loaded['stationary']
    assert geometry['status'] == 'COMPLETE_COVER'
    assert geometry['cell_count'] == len(geometry['cells']) == 2632
    assert geometry['processed_planes'] == 42 and geometry['pending_planes'] == 0
    assert certificate['status'] == 'ALL_FULL_GRADIENT_STATIONARY_CASES_CERTIFIED'
    assert len(certificate['cell_results']) == 2632
    walls = tuple(tuple(map(F, p)) for p in geometry['planes'][4:])
    assert len(walls) == 42
    systems = {}
    counts = Counter()
    equalities, feasible = [], {}
    all_cases = []
    for index, (cell, record) in enumerate(zip(geometry['cells'], certificate['cell_results'])):
        guard()
        assert record['cell'] == index
        rows = [tuple(-F(x) for x in p) for p in BOUNDARIES]
        rows += [tuple(x * (1 if sign == '+' else -1) for x in p)
                 for p, sign in zip(walls, cell['signs'])]
        assert len(cell['signs']) == 42
        for case in record['cases']:
            counts['all_cases'] += 1
            p = tuple(map(F, case['polynomial']))
            if p not in systems:
                h, linear = derivatives(p)
                systems[p] = (h, linear, exact_eliminate(h, [-x for x in linear], 4))
            h, linear, system = systems[p]
            closed, strict = independent_constraints(rows, *case['pair'])
            all_cases.append((index, case['pair'], p, closed, strict))
            if system is None:
                assert case['value'] is None
                counts['inconsistent_cases'] += 1
                continue
            point, null, rank = system
            actual = value(p, point)
            assert str(actual) == case['value']
            saved_point = tuple(map(F, case['stationary_particular']))
            assert all(sum((v * x for v, x in zip(row, saved_point)), F(0)) + b == 0
                       for row, b in zip(h, linear))
            saved_null = tuple(tuple(map(F, d)) for d in case['stationary_nullspace'])
            assert len(saved_null) == 4 - rank
            assert all(all(sum((v * x for v, x in zip(row, d)), F(0)) == 0
                           for row in h) for d in saved_null)
            assert exact_eliminate(saved_null, [0] * len(saved_null), 4)[2] == len(saved_null)
            if actual != F(14, 61):
                continue
            counts['equality_cases'] += 1
            counts['equality_rank_' + str(rank)] += 1
            item = {'cell': index, 'pair': case['pair'], 'rank': rank,
                    'particular': list(map(str, point)),
                    'nullspace': [list(map(str, d)) for d in null]}
            if null:
                # An invariant violated row certifies the entire affine locus
                # infeasible. Otherwise disclose unresolved, never point-test it.
                exclusions = []
                for kind, constraints in [('closed', closed), ('strict', strict)]:
                    for j, row in enumerate(constraints):
                        c = affine(row, point)
                        invariant = all(sum((x * y for x, y in zip(row[:4], d)), F(0)) == 0 for d in null)
                        if invariant and (c < 0 or kind == 'strict' and c == 0):
                            exclusions.append({'kind': kind, 'index': j, 'constant': str(c)})
                item['affine_locus_exclusions'] = exclusions
                item['status'] = 'AFFINE_LOCUS_EXCLUDED' if exclusions else 'UNRESOLVED_AFFINE_LOCUS'
                counts[item['status']] += 1
            else:
                closed_bad = [j for j, row in enumerate(closed) if affine(row, point) < 0]
                strict_bad = [j for j, row in enumerate(strict) if affine(row, point) <= 0]
                item.update({'violated_closed': closed_bad, 'violated_strict': strict_bad})
                item['status'] = 'INFEASIBLE_POINT' if closed_bad or strict_bad else 'FEASIBLE_POINT'
                counts[item['status']] += 1
                if not closed_bad and not strict_bad:
                    feasible.setdefault(point, []).append({'cell': index, 'pair': case['pair']})
            equalities.append(item)
    assert counts['all_cases'] == 8658 and len(systems) == 667
    minimizers = []
    for point, equality_records in sorted(feasible.items()):
        guard()
        x = offsets(point)
        first, second = area_affine(x), area_trapezoid(x)
        assert first == second == F(14, 61)
        laws = {}
        incident_count = 0
        for index, pair, p, closed, strict in all_cases:
            if all(affine(row, point) >= 0 for row in closed) and all(affine(row, point) > 0 for row in strict):
                incident_count += 1
                h, linear, system = systems[p]
                assert value(p, point) == F(14, 61)
                assert all(sum((v * a for v, a in zip(row, point)), F(0)) + b == 0
                           for row, b in zip(h, linear))
                laws.setdefault(p, []).append({'cell': index, 'pair': pair})
        local_laws = []
        for p, records in laws.items():
            h, _, _ = systems[p]
            minors = leading_minors(h)
            assert all(m > 0 for m in minors)
            epsilon = F(1)
            while not all(m > 0 for m in leading_minors(h, epsilon)):
                epsilon /= 2
                assert epsilon >= F(1, 2**30)
            local_laws.append({'polynomial': list(map(str, p)), 'hessian': [list(map(str, row)) for row in h],
                               'leading_principal_minors': list(map(str, minors)),
                               'exact_lower_hessian_bound': str(epsilon),
                               'shifted_leading_principal_minors': list(map(str, leading_minors(h, epsilon))),
                               'records': records})
        # Every nonzero global shape-wall/bottom-order/strict-polytope sign is
        # fixed in this L-infinity ball. Zero walls are allowed; all their
        # incident phase laws have just been retained above.
        phase_rows = [tuple(p) + (F(0),) for p in walls]
        phase_rows += [tuple(-F(v) for v in p) + (F(0),) for p in BOUNDARIES]
        _, strict = independent_constraints([], 1, 5)
        phase_rows += strict
        apices = ((F(0),) * 5,) + tuple(tuple(F(i == j) for i in range(4)) + (F(0),) for j in range(4))
        for i, j in combinations(range(5), 2):
            phase_rows.append(tuple(b - a for a, b in zip(apices[i], apices[j]))[:4] + (F(i - j),))
        margins = [abs(affine(row, point)) / sum(map(abs, row[:4]))
                   for row in phase_rows if affine(row, point) and any(row[:4])]
        radius = min(margins) / 2
        minimizers.append({'apex_coordinates_A2_to_A5': list(map(str, point)), 'offsets_x5_zero': list(map(str, x)),
                           'area_affine': str(first), 'area_trapezoid': str(second),
                           'equality_records': equality_records, 'incident_case_count': incident_count,
                           'distinct_incident_polynomials': len(laws), 'incident_laws': local_laws,
                           'local_A_linf_radius': str(radius),
                           'local_A_euclidean_gap_coefficient': str(min(F(l['exact_lower_hessian_bound']) for l in local_laws) / 2)})
    offsets_set = {tuple(map(F, m['offsets_x5_zero'])) for m in minimizers}
    return {'status': 'UNRESOLVED_AFFINE_LOCUS' if counts['UNRESOLVED_AFFINE_LOCUS'] else 'ALL_RETAINED_EQUALITY_CASES_ACCOUNTED',
            'scope': 'Conditional on TIP101 complete-cover, C1 and stationary completeness premises; no fresh cover or global lower-bound replay.',
            'input_sha256': {name: hashlib.sha256(path.read_bytes()).hexdigest() for name, path in paths.items()},
            'counts': dict(counts), 'distinct_polynomials_reeliminated': len(systems),
            'incident_cases_inspected_per_minimizer': len(all_cases),
            'equality_cases': equalities, 'distinct_feasible_minimizers': len(minimizers), 'minimizers': minimizers,
            'reflection_closes_minimizer_set': all(reflection(x) in offsets_set for x in offsets_set),
            'elapsed_seconds': time.monotonic() - start}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path,
                        default=Path(__file__).with_name('EQUALITY_ANALYSIS_FINAL.json'))
    args = parser.parse_args()
    output = args.out.resolve()
    if output.parent != Path(__file__).resolve().parent:
        raise SystemExit('OUTPUT_MUST_REMAIN_WITHIN_TIP103')
    if output.exists():
        raise SystemExit('CREATE_ONLY_OUTPUT_ALREADY_EXISTS')
    result = full_scan()
    encoded = json.dumps(result, indent=2) + '\n'
    assert len(encoded.encode()) <= 8 * 1024 * 1024
    with output.open('x') as stream:
        stream.write(encoded)
    print(json.dumps({k: v for k, v in result.items() if k not in ('equality_cases', 'minimizers')}))
