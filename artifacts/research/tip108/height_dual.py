#!/usr/bin/env python3
"""Complete five-band moment relaxation for ONE label signature; no geometry cover.

Band overlap caps are exact maxima of a one-dimensional piecewise quadratic.
All breakpoints are endpoint/zero/absolute-value incidence equations, not a
sampled grid. Three evaluations recover each quadratic because those equations
certify a constant affine-event ordering throughout the open parameter cell.
"""
import argparse
from fractions import Fraction as Q
import json
from pathlib import Path
import signal
import time

from atom_dual import LEFT, RIGHT, BLOCKS, simplex, check_certificate

BANDS = tuple(zip((Q(0), Q(1, 3), Q(1, 2), Q(2, 3), Q(4, 5)),
                  (Q(1, 3), Q(1, 2), Q(2, 3), Q(4, 5), Q(1))))
SPAN = Q(18, 31)


def band_overlap(r, d, lo, hi):
    """Integral max(0,1-y-|d-r*y|) by exact affine event integration."""
    events = {lo, hi}
    for y in (d / r, (d + 1) / (r + 1)):
        if lo < y < hi:
            events.add(y)
    if r > 1:
        y = (d - 1) / (r - 1)
        if lo < y < hi:
            events.add(y)
    events = sorted(events)
    area = Q(0)
    for a, b in zip(events, events[1:]):
        middle = (a + b) / 2
        if 1 - middle - abs(d - r * middle) <= 0:
            continue
        if d - r * middle >= 0:
            constant, slope = 1 - d, r - 1
        else:
            constant, slope = 1 + d, -r - 1
        area += constant * (b - a) + slope * (b * b - a * a) / 2
    return area


def quadratic_from_three(xs, ys):
    x0, x1, x2 = xs
    y0, y1, y2 = ys
    first = (y1 - y0) / (x1 - x0)
    second = (y2 - y1) / (x2 - x1)
    c2 = (second - first) / (x2 - x0)
    c1 = first - c2 * (x0 + x1)
    c0 = y0 - c1 * x0 - c2 * x0 * x0
    return c0, c1, c2


def cap(r, lo, hi, domain):
    d0, d1 = domain
    points = {d0, d1}
    for y in (lo, hi):
        for d in (r * y, 1 + (r - 1) * y, -1 + (r + 1) * y):
            if d0 < d < d1:
                points.add(d)
    # r=1 has a horizontal zero branch 1-d; d=1 is already an incidence.
    points = sorted(points)
    candidates = [(band_overlap(r, d, lo, hi), d) for d in points]
    cells = []
    for a, b in zip(points, points[1:]):
        xs = tuple(a + (b - a) * f for f in (Q(1, 4), Q(1, 2), Q(3, 4)))
        poly = quadratic_from_three(xs, [band_overlap(r, d, lo, hi) for d in xs])
        c0, c1, c2 = poly
        # Endpoint equality verifies extension to the closed cell. The degree
        # assertion comes from affine event limits, not from these checks.
        for d in (a, b):
            if c0 + c1 * d + c2 * d * d != band_overlap(r, d, lo, hi):
                raise ValueError('quadratic endpoint mismatch')
        stationary = None
        if c2 < 0:
            d = -c1 / (2 * c2)
            if a < d < b:
                stationary = d
                candidates.append((c0 + c1 * d + c2 * d * d, d))
        cells.append({'domain': [str(a), str(b)], 'quadratic': [str(v) for v in poly],
                      'interior_maximizer': str(stationary) if stationary is not None else None})
    value, witness = max(candidates)
    fullcap = Q(1, r + 2) if d0 < 0 else Q(r - 1, r * (r + 1))
    if value < 0 or value > fullcap or value > (hi - lo) - (hi * hi - lo * lo) / 2:
        raise ValueError('invalid band cap sanity bound')
    return value, {'rank_gap': r, 'band': [str(lo), str(hi)],
                   'offset_domain': [str(d0), str(d1)], 'maximum': str(value),
                   'maximizing_offset': str(witness), 'cells': cells}


def build_model():
    names, objective, local_data, cap_records = [], [], [], []
    cap_cache = {}
    for band_index, (lo, hi) in enumerate(BANDS):
        pairs = []
        for i in range(1, 7):
            for j in range(i + 1, 7):
                r = j - i
                same = (i in LEFT) == (j in LEFT)
                if not same and not (j in LEFT and i in RIGHT and r >= 2):
                    continue
                key = (band_index, same, r)
                if key not in cap_cache:
                    domain = (-SPAN, SPAN) if same else (Q(1), Q(r))
                    value, record = cap(r, lo, hi, domain)
                    record['kind'] = 'intra' if same else 'separated_cross'
                    cap_cache[key] = value
                    cap_records.append(record)
                value = cap_cache[key]
                if value:
                    pairs.append((i, j, value))
        possible = {(i, j) for i, j, _ in pairs}
        atoms = []
        for mask in range(1, 64):
            atom = frozenset(i for i in range(1, 7) if mask & (1 << (i - 1)))
            if all((i, j) in possible for i in atom for j in atom if i < j):
                atoms.append(atom)
        offset = len(names)
        local_names = [f'band{band_index}_a{i}' for i in range(1, 7)]
        local_names += [f'band{band_index}_b{i}{j}' for i, j, _ in pairs]
        names.extend(local_names)
        mass = (hi - lo) - (hi * hi - lo * lo) / 2
        objective.extend([mass] * 6 + [-value for _, _, value in pairs])
        local_data.append((band_index, offset, pairs, atoms))
    names += ['c12345', 'c23456']
    objective += [Q(70, 61)] * 2
    rows, row_labels = [], []
    for band_index, offset, pairs, atoms in local_data:
        for atom in atoms:
            row = [Q(0)] * len(names)
            values = [Q(i in atom) for i in range(1, 7)]
            values += [-Q(i in atom and j in atom) for i, j, _ in pairs]
            row[offset:offset + len(values)] = values
            row[-2:] = [Q(bool(atom & block)) for block in BLOCKS]
            rows.append(row)
            row_labels.append({'band_index': band_index, 'labels': sorted(atom)})
    return names, objective, rows, row_labels, cap_records


def pilot():
    names, objective, rows, row_labels, cap_records = build_model()
    solution, multipliers, value, pivots = simplex(rows, objective)
    evaluations = check_certificate(rows, objective, solution, multipliers, value)
    target = Q(40, 31)
    for record, ev, mu in zip(row_labels, evaluations, multipliers):
        record['evaluation'] = str(ev)
        record['upper_multiplier'] = str(mu)
    return {'status': 'EXACT_HEIGHT_DUAL_CERTIFICATE',
            'coverage': 'ALL_ALLOWED_ATOMS_ALL_FIVE_BANDS_ONE_SIGNATURE_ONLY',
            'geometry_feasibility_claim': False, 'root_closed': False,
            'left_labels': sorted(LEFT), 'right_labels': sorted(RIGHT),
            'span_bound': str(SPAN), 'bands': [[str(a), str(b)] for a, b in BANDS],
            'cap_certificates': cap_records, 'variables': names,
            'dual_coefficients': [str(x) for x in solution],
            'atom_records': row_labels, 'atom_count': len(rows), 'pivot_count': pivots,
            'objective_coefficients': [str(x) for x in objective],
            'scaled_area_lower_bound': str(value), 'exact_relaxation_optimum': str(value),
            'target_scaled_area': str(target), 'margin_to_target': str(value - target),
            'defect_lower_at_span_18_31': str(2 * value - Q(80, 31)),
            'whole_span_strict_defect_certified': value > target,
            'decision': 'SUFFICIENT' if value > target else 'INSUFFICIENT_DO_NOT_EXPAND_LP'}


def replay(path):
    saved = json.loads(path.read_text())
    if saved.get('coverage') != 'ALL_ALLOWED_ATOMS_ALL_FIVE_BANDS_ONE_SIGNATURE_ONLY' or saved.get('status') != 'EXACT_HEIGHT_DUAL_CERTIFICATE':
        raise ValueError('saved status/scope mismatch')
    names, objective, rows, row_labels, cap_records = build_model()
    if saved.get('variables') != names or saved.get('span_bound') != str(SPAN):
        raise ValueError('saved model identity mismatch')
    if saved.get('left_labels') != sorted(LEFT) or saved.get('right_labels') != sorted(RIGHT):
        raise ValueError('saved label signature mismatch')
    if saved.get('cap_certificates') != cap_records:
        raise ValueError('saved cap certificates mismatch')
    if saved.get('objective_coefficients') != [str(v) for v in objective]:
        raise ValueError('saved objective mismatch')
    records = saved.get('atom_records', [])
    if len(records) != len(rows) or saved.get('atom_count') != len(rows):
        raise ValueError('saved atom count mismatch')
    identities = [{'band_index': r.get('band_index'), 'labels': r.get('labels')} for r in records]
    if identities != row_labels:
        raise ValueError('saved atoms mismatch')
    solution = [Q(v) for v in saved['dual_coefficients']]
    multipliers = [Q(record['upper_multiplier']) for record in records]
    value = Q(saved['scaled_area_lower_bound'])
    if Q(saved['exact_relaxation_optimum']) != value:
        raise ValueError('saved optimum mismatch')
    evaluations = check_certificate(rows, objective, solution, multipliers, value)
    if [str(v) for v in evaluations] != [r.get('evaluation') for r in records]:
        raise ValueError('saved atom evaluations mismatch')
    return {'status': 'REPLAY_PASS_WITHOUT_SIMPLEX', 'coverage': saved['coverage'],
            'coefficient_class': 'NONNEGATIVE', 'atom_count': len(rows),
            'band_cap_count': len(cap_records), 'scaled_area_lower_bound': str(value),
            'root_closed': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--replay', type=Path, help='check saved vectors/caps without optimization')
    args = parser.parse_args()
    if args.out and args.out.exists():
        parser.error('--out is create-only')
    start = time.monotonic()
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('25 second cap')))
    signal.alarm(25)
    try:
        result = replay(args.replay) if args.replay else pilot()
    except (TimeoutError, ValueError) as exc:
        result = {'status': 'REFUSED_OR_PARTIAL', 'reason': str(exc), 'coverage': 'NONE', 'root_closed': False}
    finally:
        signal.alarm(0)
    result['elapsed_seconds'] = time.monotonic() - start
    rendered = json.dumps(result, indent=2) + '\n'
    if args.out:
        with args.out.open('x') as stream:
            stream.write(rendered)
    print(json.dumps({k: v for k, v in result.items()
                      if k not in ('cap_certificates', 'variables', 'dual_coefficients',
                                   'atom_records', 'objective_coefficients')}, indent=2))
    if result['status'] not in ('EXACT_HEIGHT_DUAL_CERTIFICATE', 'REPLAY_PASS_WITHOUT_SIMPLEX'):
        raise SystemExit(2)


if __name__ == '__main__':
    main()
