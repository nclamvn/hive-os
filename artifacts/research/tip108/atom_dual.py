#!/usr/bin/env python3
"""Exact membership-atom dual PILOT, not a geometry cover or feasibility claim.

Scaled area G=6F. Intra-pair cap 1/(r+2); cross-pair cap
(r-1)/(r(r+1)) follows from bottom separation delta>1. Both
consecutive-five union lower bounds are 70/61. Nonnegative a,b,c give
1_union >= sum a_i 1_i - sum b_ij 1_ij + sum c_B 1_union(B).
The inequality is checked on every nonempty possible membership atom.
"""
import argparse
from fractions import Fraction as Q
import json
from pathlib import Path
import signal
import time

LEFT = frozenset((4, 5, 6))
RIGHT = frozenset((1, 2, 3))
BLOCKS = (frozenset(range(1, 6)), frozenset(range(2, 7)))


def model(signed_a=False, group_bound=False):
    pairs = []
    for i in range(1, 7):
        for j in range(i + 1, 7):
            r = j - i
            same = (i in LEFT) == (j in LEFT)
            cross_possible = j in LEFT and i in RIGHT and r >= 2
            if same or cross_possible:
                cap = Q(1, r + 2) if same else Q(r - 1, r * (r + 1))
                pairs.append((i, j, cap))
    possible = {(i, j) for i, j, _ in pairs}
    atoms = []
    for mask in range(1, 64):
        atom = frozenset(i for i in range(1, 7) if mask & (1 << (i - 1)))
        if all((i, j) in possible for i in atom for j in atom if i < j):
            atoms.append(atom)
    names = [f'a{i}' for i in range(1, 7)]
    names += [f'b{i}{j}' for i, j, _ in pairs] + ['c12345', 'c23456']
    rows = []
    for atom in atoms:
        rows.append([Q(i in atom) for i in range(1, 7)]
                    + [-Q(i in atom and j in atom) for i, j, _ in pairs]
                    + [Q(bool(atom & block)) for block in BLOCKS])
    objective = [Q(1, 2)] * 6 + [-cap for _, _, cap in pairs] + [Q(70, 61)] * 2
    if signed_a:
        names += [f'negative_a{i}' for i in range(1, 7)]
        rows = [row + [-row[i] for i in range(6)] for row in rows]
        objective += [-Q(1, 2)] * 6
    if group_bound:
        names += ['c_group_union_sum']
        rows = [row + [Q(bool(atom & LEFT)) + Q(bool(atom & RIGHT))]
                for row, atom in zip(rows, atoms)]
        objective += [Q(53, 31)]
    return names, pairs, atoms, rows, objective


def simplex(rows, objective, max_pivots=2000):
    """Bland primal simplex, rational tableaux; initial slack basis is feasible."""
    m, n = len(rows), len(objective)
    tab = [row[:] + [Q(k == i) for k in range(m)] + [Q(1)]
           for i, row in enumerate(rows)]
    tab.append([-c for c in objective] + [Q(0)] * m + [Q(0)])
    basis = [n + i for i in range(m)]
    pivots = 0
    while True:
        entering = next((j for j in range(n + m) if tab[m][j] < 0), None)
        if entering is None:
            break
        choices = [(tab[i][-1] / tab[i][entering], basis[i], i)
                   for i in range(m) if tab[i][entering] > 0]
        if not choices:
            raise ValueError('unbounded relaxation')
        _, _, leaving = min(choices)
        div = tab[leaving][entering]
        tab[leaving] = [v / div for v in tab[leaving]]
        for i in range(m + 1):
            if i != leaving and tab[i][entering]:
                factor = tab[i][entering]
                tab[i] = [u - factor * v for u, v in zip(tab[i], tab[leaving])]
        basis[leaving] = entering
        pivots += 1
        if pivots > max_pivots:
            raise ValueError('pivot cap reached')
    solution = [Q(0)] * n
    for i, variable in enumerate(basis):
        if variable < n:
            solution[variable] = tab[i][-1]
    multipliers = tab[m][n:n + m]
    return solution, multipliers, tab[m][-1], pivots


def check_certificate(rows, objective, solution, multipliers, value):
    """Independent algebraic lower/upper certificate, without tableau data."""
    if len(solution) != len(objective) or len(multipliers) != len(rows):
        raise ValueError('certificate dimensions')
    if any(v < 0 for v in solution + multipliers):
        raise ValueError('negative certificate coefficient')
    evaluations = [sum(a * b for a, b in zip(row, solution)) for row in rows]
    if any(v > 1 for v in evaluations):
        raise ValueError('pointwise atom inequality failed')
    attained = sum(c * x for c, x in zip(objective, solution))
    if attained != value:
        raise ValueError('objective mismatch')
    columns = [sum(multiplier * row[j] for multiplier, row in zip(multipliers, rows))
               for j in range(len(objective))]
    if any(bound < needed for bound, needed in zip(columns, objective)):
        raise ValueError('relaxation upper certificate failed')
    if sum(multipliers) != value:
        raise ValueError('upper objective mismatch')
    return evaluations


def pilot(signed_a=False, group_bound=False):
    names, pairs, atoms, rows, objective = model(signed_a, group_bound)
    solution, multipliers, value, pivots = simplex(rows, objective)
    evaluations = check_certificate(rows, objective, solution, multipliers, value)
    target = Q(40, 31)
    return {
        'status': 'EXACT_DUAL_CERTIFICATE', 'coverage': 'ALL_ALLOWED_ATOMS_ONE_SIGNATURE_ONLY',
        'geometry_feasibility_claim': False, 'root_closed': False,
        'left_labels': sorted(LEFT), 'right_labels': sorted(RIGHT),
        'model': ('signed-a pointwise quadratic dual plus two consecutive-K5 union bounds'
                  if signed_a else 'nonnegative pointwise quadratic dual plus two consecutive-K5 union bounds'),
        'coefficient_class': 'SIGNED_A_SPLIT_NONNEGATIVE' if signed_a else 'NONNEGATIVE',
        'group_union_sum_lower_bound': '53/31' if group_bound else None,
        'pair_caps': [{'labels': [i, j], 'cap': str(cap)} for i, j, cap in pairs],
        'k5_scaled_bounds': ['70/61', '70/61'],
        'variables': names, 'dual_coefficients': [str(x) for x in solution],
        'atom_records': [{'labels': sorted(atom), 'evaluation': str(ev),
                          'upper_multiplier': str(mu)}
                         for atom, ev, mu in zip(atoms, evaluations, multipliers)],
        'atom_count': len(atoms), 'pivot_count': pivots,
        'scaled_area_lower_bound': str(value),
        'exact_relaxation_optimum': str(value),
        'target_scaled_area': str(target), 'margin_to_target': str(value - target),
        'whole_span_strict_defect_certified': value > target,
        'defect_lower_at_span_18_31': str(2 * value - Q(80, 31)),
        'decision': 'SUFFICIENT' if value > target else 'INSUFFICIENT_RELAXATION_DO_NOT_EXPAND_TO_42',
    }


def replay(path):
    saved = json.loads(path.read_text())
    if saved.get('coverage') != 'ALL_ALLOWED_ATOMS_ONE_SIGNATURE_ONLY' or saved.get('status') != 'EXACT_DUAL_CERTIFICATE':
        raise ValueError('saved status/scope mismatch')
    coefficient_class = saved.get('coefficient_class', 'NONNEGATIVE')
    if coefficient_class not in ('NONNEGATIVE', 'SIGNED_A_SPLIT_NONNEGATIVE'):
        raise ValueError('unknown coefficient class')
    group_bound = saved.get('group_union_sum_lower_bound')
    if group_bound not in (None, '53/31'):
        raise ValueError('unknown group-union bound')
    names, pairs, atoms, rows, objective = model(coefficient_class == 'SIGNED_A_SPLIT_NONNEGATIVE', group_bound is not None)
    if saved.get('variables') != names or saved.get('left_labels') != sorted(LEFT) or saved.get('right_labels') != sorted(RIGHT):
        raise ValueError('saved model identity mismatch')
    expected_caps = [{'labels': [i, j], 'cap': str(cap)} for i, j, cap in pairs]
    if saved.get('pair_caps') != expected_caps or saved.get('k5_scaled_bounds') != ['70/61', '70/61']:
        raise ValueError('saved input bounds mismatch')
    records = saved.get('atom_records', [])
    if len(records) != len(atoms) or saved.get('atom_count') != len(atoms):
        raise ValueError('saved atom count mismatch')
    if [r.get('labels') for r in records] != [sorted(atom) for atom in atoms]:
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
            'coefficient_class': coefficient_class, 'atom_count': len(atoms),
            'scaled_area_lower_bound': str(value), 'root_closed': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--replay', type=Path, help='check saved vectors without optimization')
    parser.add_argument('--signed-a', action='store_true', help='free a_i via positive/negative parts; 5 second pilot')
    parser.add_argument('--group-bound', action='store_true', help='add proved group-union sum53/31; 5 second pilot')
    args = parser.parse_args()
    if args.out and args.out.exists():
        parser.error('--out is create-only')
    start = time.monotonic()
    limit = 5 if args.signed_a or args.group_bound else 25
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError(f'{limit} second cap')))
    signal.alarm(limit)
    try:
        result = replay(args.replay) if args.replay else pilot(args.signed_a, args.group_bound)
    except (TimeoutError, ValueError) as exc:
        result = {'status': 'REFUSED_OR_PARTIAL', 'reason': str(exc), 'coverage': 'NONE', 'root_closed': False}
    finally:
        signal.alarm(0)
    result['elapsed_seconds'] = time.monotonic() - start
    rendered = json.dumps(result, indent=2) + '\n'
    if args.out:
        with args.out.open('x') as stream:
            stream.write(rendered)
    print(rendered, end='')
    if result['status'] not in ('EXACT_DUAL_CERTIFICATE', 'REPLAY_PASS_WITHOUT_SIMPLEX'):
        raise SystemExit(2)


if __name__ == '__main__':
    main()
