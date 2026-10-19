"""Bounded TIP108C whole-chart core producer. No completeness promise or resume.

Coordinates are exact dyadic31 triples: [lo, hi, e] / (31*2**e).
Only the integer endpoint-trapezoid integration is implemented here.
The independent verifier must NOT import this integration.
"""
import argparse
from collections import deque
from dataclasses import dataclass
from fractions import Fraction
import importlib.util
import json
from pathlib import Path
import resource
import signal
import sys
import time

MAX_NODES = 131072
MAX_DEPTH = 48
MAX_BYTES = 16 * 1024 * 1024
MAX_STATE = 128 * 1024 * 1024
SCHEMA = 'TIP108C_CORE_TREE_V1'


def roots():
    result = []
    for mask in range(1, 63):
        left = [j for j in range(1, 7) if mask & (1 << (j - 1))]
        right = [j for j in range(1, 7) if j not in left]
        if len(left) not in (2, 3, 4) or max(left) - min(right) < 2:
            continue
        if (1 in left and len(left) == 2) or (6 in right and len(right) == 2):
            continue
        if set(left) in ({1, 4, 6}, {1, 5, 6}, {2, 4, 5}, {3, 4, 5}):
            continue
        for a in left:
            for b in right:
                result.append({'left_mask': mask, 'left_anchor': a, 'right_anchor': b})
    return result


def labels(root):
    left = tuple(j for j in range(1, 7) if root['left_mask'] & (1 << (j - 1)))
    right = tuple(j for j in range(1, 7) if j not in left)
    members = tuple(j for j in range(1, 7)
                    if j not in (root['left_anchor'], root['right_anchor']))
    return left, right, members


def initial_box():
    return ((31, 75, 0),) + ((0, 18, 0),) * 4


def split(box, axis):
    lo, hi, e = box[axis]
    if not lo < hi:
        raise ValueError('cannot split a degenerate coordinate')
    first, second = list(box), list(box)
    first[axis] = (2 * lo, lo + hi, e + 1)
    second[axis] = (lo + hi, 2 * hi, e + 1)
    return tuple(first), tuple(second)


def scale_box(root, box, precision=0):
    if len(box) != 5 or any(len(c) != 3 or any(type(n) is not int for n in c)
                            or not 0 <= c[2] <= MAX_DEPTH or c[0] > c[1] for c in box):
        raise ValueError('invalid dyadic31 coordinate box')
    m = max(precision, *(c[2] for c in box))
    if not 0 <= m <= MAX_DEPTH:
        raise ValueError('precision outside charter')
    den = 31 << m
    scaled = [(lo << (m - e), hi << (m - e)) for lo, hi, e in box]
    left, right, members = labels(root)
    local = {root['left_anchor']: (0, 0), root['right_anchor']: (0, 0)}
    local.update(zip(members, scaled[1:]))
    qlo, qhi = scaled[0]
    lower, upper = [], []
    for j in range(1, 7):
        lo, hi = local[j]
        if j in left:
            lower.append(2 * lo - qhi)
            upper.append(2 * hi - qlo)
        else:
            lower.append(2 * lo + qlo)
            upper.append(2 * hi + qhi)
    ulow = max(local[j][0] for j in left)
    uhigh = max(local[j][1] for j in left)
    vlow = max(local[j][0] for j in right)
    vhigh = max(local[j][1] for j in right)
    return {'den': den, 'H': 2 * den, 'lower': lower, 'upper': upper,
            'qlo': qlo, 'qhi': qhi, 'ulow': ulow, 'uhigh': uhigh,
            'slow': ulow + vlow, 'sraw_upper': uhigh + vhigh,
            'supper': min(18 << m, uhigh + vhigh), 'left_size': len(left),
            'scaled_coordinates': scaled}


def exclusion(s):
    den = s['den']
    if 31 * s['slow'] > 18 * den:
        return 'span_above_closed_cap'
    if 61 * s['sraw_upper'] <= 18 * den:
        return 'retained_small_span_theorem'
    if s['qhi'] - s['ulow'] <= den:
        return 'no_strict_positive_bottom_gap'
    distance_lower = s['qlo'] - s['uhigh']
    if s['left_size'] == 3:
        if 4 * distance_lower >= 7 * den:
            return 'retained_three_three_far_tail'
    elif 31 * distance_lower >= 57 * den:
        return 'retained_two_four_far_tail'
    return None


def core_numerator(lower, upper, H):
    """Exact core-union area = returned numerator/(7200*H*H)."""
    if type(H) is not int or H < 1 or len(lower) != len(upper):
        raise ValueError('invalid core bounds')
    if any(type(v) is not int for v in (*lower, *upper)):
        raise ValueError('core intercepts must be integers')
    laws = [(60 * hi, j, 60 * (lo + H), j - 1)
            for j, (lo, hi) in enumerate(zip(lower, upper), 1)]
    endpoints = [(c, a) for l, j, r, k in laws for c, a in ((l, j), (r, k))]
    end = 60 * H
    events = {0, end}
    for index, (c, a) in enumerate(endpoints):
        for other_c, other_a in endpoints[:index]:
            divisor = a - other_a
            if divisor:
                difference = other_c - c
                if difference % divisor:
                    raise ArithmeticError('integer crossing divisibility failed')
                crossing = difference // divisor
                if 0 < crossing < end:
                    events.add(crossing)
    ordered = sorted(events)
    lengths = []
    for height in ordered:
        intervals = sorted((l + j * height, r + k * height) for l, j, r, k in laws
                           if l + j * height < r + k * height)
        total = 0
        if intervals:
            start, finish = intervals[0]
            for lo, hi in intervals[1:]:
                if lo > finish:
                    total += finish - start
                    start, finish = lo, hi
                elif hi > finish:
                    finish = hi
            total += finish - start
        lengths.append(total)
    numerator = sum((b - a) * (x + y)
                    for a, b, x, y in zip(ordered, ordered[1:], lengths, lengths[1:]))
    return numerator, len(ordered)


def positive(s):
    numerator, cuts = core_numerator(s['lower'], s['upper'], s['H'])
    threshold = 7200 * s['H'] * (s['H'] + s['supper'])
    return numerator > threshold, numerator, cuts


def structure(trees, expected):
    """Coverage syntax only; deliberately NOT a geometric proof verifier."""
    if len(trees) != expected:
        raise ValueError('missing or extra root')
    count = {'nodes': 0, 'positive': 0, 'excluded': 0, 'open': 0, 'max_depth': 0}
    for tree in trees:
        if type(tree) is not str:
            raise ValueError('tree must be a string')
        stack = [0]
        for symbol in tree:
            if not stack:
                raise ValueError('trailing subtree')
            depth = stack.pop()
            if depth > MAX_DEPTH:
                raise ValueError('tree depth exceeds charter')
            count['nodes'] += 1
            count['max_depth'] = max(count['max_depth'], depth)
            if symbol in '01234':
                if depth == MAX_DEPTH:
                    raise ValueError('split exceeds depth cap')
                stack.extend((depth + 1, depth + 1))
            elif symbol == 'P':
                count['positive'] += 1
            elif symbol == 'X':
                count['excluded'] += 1
            elif symbol == 'O':
                count['open'] += 1
            else:
                raise ValueError('invalid tree symbol')
        if stack:
            raise ValueError('missing child')
    return count


@dataclass(slots=True)
class Node:
    root: int
    box: object
    depth: int
    symbol: str = 'O'
    children: object = None


def peak_bytes():
    value = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    return value if sys.platform == 'darwin' else 1024 * value


def encode(nodes, index):
    result, stack = [], [index]
    while stack:
        node = nodes[stack.pop()]
        result.append(node.symbol)
        if node.children is not None:
            stack.extend(reversed(node.children))
    return ''.join(result)


def produce(max_nodes=MAX_NODES, max_seconds=30):
    if not 1 <= max_nodes <= MAX_NODES or not 1 < max_seconds <= 30:
        raise ValueError('attempt limits exceed charter')
    start = time.monotonic()
    charts = roots()
    nodes = [Node(i, initial_box(), 0) for i in range(len(charts))]
    pending = deque(range(len(charts)))
    processed = positive_count = excluded_count = 0
    reason = 'COMPLETE'
    while pending:
        if processed >= max_nodes:
            reason = 'NODE_CAP'
            break
        if time.monotonic() - start >= max_seconds - 1:
            reason = 'TIME_CAP'
            break
        if peak_bytes() >= MAX_STATE - 4 * 1024 * 1024:
            reason = 'STATE_CAP'
            break
        index = pending.popleft()
        node = nodes[index]
        processed += 1
        scaled = scale_box(charts[node.root], node.box)
        if exclusion(scaled) is not None:
            node.symbol, node.box = 'X', None
            excluded_count += 1
        elif positive(scaled)[0]:
            node.symbol, node.box = 'P', None
            positive_count += 1
        elif node.depth == MAX_DEPTH:
            reason = 'DEPTH_CAP'
            break
        else:
            widths = [(hi - lo) * (3 if i == 0 else 1)
                      for i, (lo, hi) in enumerate(scaled['scaled_coordinates'])]
            axis = max(range(5), key=widths.__getitem__)
            a, b = split(node.box, axis)
            first = len(nodes)
            nodes.extend((Node(node.root, a, node.depth + 1),
                          Node(node.root, b, node.depth + 1)))
            pending.extend((first, first + 1))
            node.symbol, node.children, node.box = str(axis), (first, first + 1), None
    encoded = [encode(nodes, i) for i in range(len(charts))]
    counts = structure(encoded, len(charts))
    complete = counts['open'] == 0
    return {'schema': SCHEMA, 'scope': 'WHOLE_34_SIGNATURES_286_CHARTS',
            'status': 'COMPLETE' if complete else 'INCOMPLETE_MUST_REFUSE',
            'root_spec': 'MIN_ANCHOR_MASK_ORDER_V1', 'root_count': len(charts),
            'roots': [dict(root, tree=tree) for root, tree in zip(charts, encoded)],
            'limits': {'processed_nodes': max_nodes, 'depth': MAX_DEPTH,
                       'seconds': max_seconds, 'artifact_bytes': MAX_BYTES, 'state_bytes': MAX_STATE},
            'stats': {'processed_nodes': processed, 'created_nodes': len(nodes),
                      'positive_leaves': positive_count, 'domain_leaves': excluded_count,
                      'open_leaves': counts['open'], 'max_depth': counts['max_depth'],
                      'elapsed_seconds': time.monotonic() - start, 'stopped_by': reason,
                      'peak_state_bytes': peak_bytes()},
            'resumption': 'FORBIDDEN_WITHOUT_NEW_OWNER_ROUTING',
            'global_k6_status': 'OPEN', 'independent_verification': 'REQUIRED_NOT_PERFORMED'}


def controls():
    start = time.monotonic()
    charts = roots()
    masks = {r['left_mask'] for r in charts}
    sizes = {k: sum(mask.bit_count() == k for mask in masks) for k in (2, 3, 4)}
    if len(charts) != 286 or len(masks) != 34 or sizes != {2: 10, 3: 14, 4: 10}:
        raise AssertionError('complete root enumeration mismatch')
    repo = Path(__file__).resolve().parents[1]
    spec = importlib.util.spec_from_file_location('retained_area_control', repo / 'tip098/kakeya_exact.py')
    retained = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(retained)
    p = [Fraction(n, 93) for n in (176, 176, 149, 27, 0, 0)]
    shifted = [2 * n - 149 for n in (176, 176, 149, 27, 0, 0)]
    number, cuts = core_numerator(shifted, shifted, 186)
    first = retained.area_trapezoid(tuple(x / 6 for x in p))
    second = retained.area_affine(tuple(x / 6 for x in p))
    if first != second or Fraction(number, 7200 * 186 ** 2) != 6 * first:
        raise AssertionError('constant-core/retained-area disagreement')
    dead, _ = core_numerator([0], [1], 2)
    if Fraction(dead, 7200 * 4) != Fraction(1, 8):
        raise AssertionError('core death integration wrong')
    empty, _ = core_numerator([0] * 6, [2] * 6, 1)
    if empty != 0:
        raise AssertionError('wide empty core retained')
    toyroot = {'left_mask': 56, 'left_anchor': 6, 'right_anchor': 3}
    toybox = ((93, 95, 1), (288, 289, 5), (288, 289, 5),
              (288, 289, 5), (0, 1, 5))
    # Members are labels1,2,4,5. A distinct small control, not a global root.
    toy_children = split(toybox, 0)
    if not all(positive(scale_box(toyroot, b))[0] for b in toy_children):
        raise AssertionError('small covered control tree not positive')
    toy_counts = structure(['0PP'], 1)
    negative_controls = []
    for name, trees, expected in (('missing_root', ['0PP'], 286),
                                  ('missing_child', ['0P'], 1),
                                  ('trailing_child', ['0PPP'], 1),
                                  ('invalid_symbol', ['Z'], 1)):
        try:
            structure(trees, expected)
        except ValueError:
            negative_controls.append(name)
        else:
            raise AssertionError(name + ' incorrectly accepted')
    if structure(['O'] * 286, 286)['open'] != 286:
        raise AssertionError('open frontier not preserved')
    # Exactly128 fixed arithmetic-profile cells, NOT candidate navigation.
    # Coordinate exponents32+4*4=48 correspond to allowed tree depth48.
    # Promotion to precision48 exercises the maximum integer bit-size.
    qindex = (31 << 32) // 88
    timings, cutcounts, checksum = [], [], 0
    for i in range(128):
        qlo = (31 << 32) + 44 * (qindex + i)
        box = ((qlo, qlo + 44, 32), (126, 144, 4), (108, 126, 4),
               (126, 144, 4), (18, 36, 4))
        scaled = scale_box(toyroot, box, 48)
        begin = time.monotonic()
        num, cutcount = core_numerator(scaled['lower'], scaled['upper'], scaled['H'])
        timings.append(time.monotonic() - begin)
        cutcounts.append(cutcount)
        checksum ^= num
    return {'schema': 'TIP108C_PRODUCER_CONTROLS_V1', 'scope': 'CONTROL_ONLY',
            'status': 'PASS', 'root_count': len(charts), 'signature_count': len(masks),
            'signature_sizes': sizes, 'retained_area_trapezoid': str(first),
            'retained_area_affine': str(second), 'constant_core_scaled_area': str(6 * first),
            'constant_core_event_count': cuts, 'core_death_area': '1/8', 'empty_core_area': 0,
            'toy': {'root': toyroot, 'box': toybox, 'tree': '0PP', 'counts': toy_counts},
            'negative_controls': negative_controls, 'open_frontier_control': 286,
            'profile': {'cells': 128, 'path_depth': 48, 'promoted_precision': 48,
                        'H': 62 << 48, 'seconds_sum': sum(timings),
                        'seconds_max': max(timings), 'seconds_mean': sum(timings) / len(timings),
                        'event_count_min': min(cutcounts), 'event_count_max': max(cutcounts),
                        'checksum': checksum, 'evidence': 'ARITHMETIC_COST_ONLY_NOT_COVERAGE'},
            'elapsed_seconds': time.monotonic() - start,
            'whole_attempt': 'NOT_RUN_NOT_RELEASED', 'R1': 'OPEN'}


def emit(result, output):
    rendered = json.dumps(result, separators=(',', ':')) + '\n'
    parent = Path(__file__).resolve().parent
    occupied = sum(p.stat().st_size for p in parent.iterdir() if p.is_file())
    if occupied + len(rendered.encode()) > MAX_BYTES:
        raise ValueError('artifact cap would be exceeded')
    if output:
        if output.resolve().parent != parent:
            raise ValueError('output must stay in tip108c artifact directory')
        with output.open('x') as stream:
            stream.write(rendered)
    print(json.dumps({k: v for k, v in result.items() if k != 'roots'}))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=('controls', 'produce'))
    parser.add_argument('--out', type=Path)
    parser.add_argument('--max-nodes', type=int, default=MAX_NODES)
    parser.add_argument('--max-seconds', type=float, default=30)
    args = parser.parse_args()
    if args.out and args.out.exists():
        parser.error('--out is create-only; no resume or overwrite')
    cap = 5 if args.mode == 'controls' else 30
    signal.signal(signal.SIGALRM, lambda *_: (_ for _ in ()).throw(TimeoutError('process cap')))
    signal.alarm(cap)
    try:
        result = controls() if args.mode == 'controls' else produce(args.max_nodes, args.max_seconds)
        emit(result, args.out)
    finally:
        signal.alarm(0)


if __name__ == '__main__':
    main()
