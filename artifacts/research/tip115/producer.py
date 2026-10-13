"""TIP115 selective exact incidence; unchanged TIP114 forest/CLI/validation.

Only already available signed inequalities (or the nonnegative coordinate cone)
license early leaves. Missing signs split; no implication LP search is used.
"""
from fractions import Fraction as F
from pathlib import Path
import hashlib
import importlib.util

BASE_PATH = Path(__file__).resolve().parents[1] / 'tip114' / 'producer.py'
BASE_SHA = '14c3a581d1a85ae0b29b98b41ec5ee29158ee65db66dc900c6617a8de2d2d2ea'
if hashlib.sha256(BASE_PATH.read_bytes()).hexdigest() != BASE_SHA:
    raise RuntimeError('IMMUTABLE_BASE_PIN_MISMATCH')
_spec = importlib.util.spec_from_file_location('tip114_selective_base', BASE_PATH)
old = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(old)
base, SCHEMA = old.base, old.SCHEMA


def available_rows(word, path, walls, guard=lambda: None):
    """Map positive-normalized affine inequalities to exact LP row/scale.

    If target = scale * source with scale > 0, their transformed LP coefficients
    and bounds have the same equality. Thus one multiplier proves the target on
    the WHOLE closed parent, not merely at the sample.
    """
    sources = [row for row, _ in base.root_rows(word)]
    sources += [tuple(sign * v for v in walls[index]) for index, sign in path]
    # Existing LP upper coordinate bounds q_i <= 2*RANGE, q=p+RANGE.
    sources += [tuple(F(-int(i == j)) for j in range(5)) + (base.RANGE,)
                for i in range(5)]
    result = {}
    for index, source in enumerate(sources):
        guard()
        key = old.signed_primitive(source)
        if key is not None:
            first = next(i for i, value in enumerate(source) if value)
            scale = F(key[first]) / source[first]
            if scale <= 0 or tuple(scale * v for v in source) != key:
                raise ArithmeticError('POSITIVE_NORMALIZATION_FAILURE')
            result.setdefault(key, (index, scale))
    return result


def classify(sample, word, path, walls, guard=lambda: None, proofs=None):
    sample = old.generic_sample(sample, word, path, walls, guard)
    rows = old.incidence_rows(sample, guard)
    available = available_rows(word, path, walls, guard)
    selected = []
    used = {index for index, _ in path}
    for row in rows:
        guard()
        source = available.get(row)
        if source is None:
            # q=p+RANGE >= 0: zero multipliers dominate -row[:5] iff
            # all row coefficients are >=0 and the transformed bound >=0.
            if all(v >= 0 for v in row[:5]) and row[5] >= base.RANGE * sum(row[:5]):
                selected.append(None)
                continue
            index = walls.index(base.canonical(row))
            if index in used:
                raise ArithmeticError('UNRESOLVED_USED_WALL')
            return {'kind': 'split', 'wall': index}, {}
        selected.append(source)
    # No dense multiplier allocation or checking until ALL required rows qualify.
    a, b = old.closed_rows(word, path, walls)
    certificates = []
    for row, source in zip(rows, selected):
        guard()
        values = ['0'] * len(a)
        if source is not None:
            index, scale = source
            values[index] = str(scale)
        certificate = {'kind': 'nonnegative', 'multipliers': values}
        old.check_implication(a, b, row, certificate)
        certificates.append(certificate)
    poly = base.polynomial(sample)
    record = base.stationary_record(poly, word, path, walls, guard)
    return {'kind': 'early_stationary', 'sample': list(map(str, sample)),
            'polynomial': list(map(str, poly)), 'stationary': record,
            'incidence': {'rows': [list(row) for row in rows],
                          'duals': certificates}}, {}


old.classify = classify
import_state, pending_paths, produce, main = old.import_state, old.pending_paths, old.produce, old.main

if __name__ == '__main__':
    main()
