"""TIP114 exact early event-incidence producer; scientific production not released.

Reuses only immutable TIP112 algebra. Every early event decision carries an
exact implication on the whole closed root/path, not a sampled assumption.
"""
from fractions import Fraction as F
from itertools import combinations
from pathlib import Path
from functools import reduce
from math import ceil, gcd, lcm
import argparse
import hashlib
import importlib.util
import json
import resource
import signal
import sys
import time

BASE_PATH = Path(__file__).resolve().parents[1] / 'tip112' / 'producer.py'
BASE_SHA = '9f71612ddcd3aefb5ef7086d4eb3f501f597bdf8c6613f8b00d764b14efc1da1'
if hashlib.sha256(BASE_PATH.read_bytes()).hexdigest() != BASE_SHA:
    raise RuntimeError('IMMUTABLE_BASE_PIN_MISMATCH')
_spec = importlib.util.spec_from_file_location('tip112_immutable_producer', BASE_PATH)
base = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(base)
SCHEMA = 'tip114-k6-v2'
RANGE, TARGET = base.RANGE, base.TARGET


def signed_primitive(row):
    """Normalize by POSITIVE scale: the inequality direction must survive."""
    denominator = lcm(*(F(x).denominator for x in row))
    integers = tuple(int(F(x) * denominator) for x in row)
    divisor = reduce(gcd, (abs(x) for x in integers), 0)
    if not any(integers[:5]):
        if integers[5] < 0:
            raise ValueError('NEGATIVE_CONSTANT_INCIDENCE')
        return None
    return tuple(x // divisor for x in integers)


def incidence_rows(sample, guard=lambda: None):
    """All endpoint PAIRS, including equal-height LL/RR at different locations."""
    x = tuple(sample) + (F(1),)
    if len(sample) != 5 or any(base.dot(w, x) == 0 for w in base.wall_inventory()):
        raise ValueError('INCIDENCE_SAMPLE_NOT_GENERIC')
    lines, rows = base.endpoints(), set()
    def add(row):
        key = signed_primitive(row)
        if key is not None:
            rows.add(key)
    for (s, a, j, tag), (r, b, k, other) in combinations(lines, 2):
        guard()
        if s == r:
            continue
        h = tuple((bv - av) / (s - r) for av, bv in zip(a, b))
        t = base.dot(h, x)
        if t <= 0:
            add(tuple(-v for v in h))
            continue
        if t >= 1:
            add(h[:5] + (h[5] - 1,))
            continue
        position = tuple(av + s * hv for av, hv in zip(a, h))
        candidates = []
        for u, c, ell, kind in lines:
            if kind != 'L' or ell in (j, k):
                continue
            left = tuple(cv + u * hv for cv, hv in zip(c, h))
            right = tuple(cv + (u + 1) * hv for cv, hv in zip(c, h))
            pl = tuple(pv - lv for pv, lv in zip(position, left))
            rp = tuple(rv - pv for rv, pv in zip(right, position))
            candidates.append((ell, pl, rp))
        covering = [(ell, pl, rp) for ell, pl, rp in candidates
                    if base.dot(pl, x) > 0 and base.dot(rp, x) > 0]
        if covering:
            _, pl, rp = min(covering, key=lambda item: item[0])
            add(pl)
            add(rp)
        else:
            add(h)
            add(tuple(-v for v in h[:5]) + (1 - h[5],))
            for _, pl, rp in candidates:
                if base.dot(pl, x) < 0:
                    add(tuple(-v for v in pl))
                elif base.dot(rp, x) < 0:
                    add(tuple(-v for v in rp))
                else:
                    raise ValueError('NON_GENERIC_EVENT_LOCATION')
    inventory = set(base.wall_inventory())
    if any(base.canonical(row) not in inventory for row in rows):
        raise ArithmeticError('INCIDENCE_WALL_NOT_IN_MODEL')
    return tuple(sorted(rows))


def closed_rows(word, path, walls):
    a, b = base.lp_rows(word, path, walls, False)
    return tuple(row[:5] + (F(0),) if i < 35 else row
                 for i, row in enumerate(a)), b


def check_implication(a, b, row, certificate):
    if set(certificate) != {'kind', 'multipliers'} or certificate['kind'] != 'nonnegative':
        raise ValueError('BAD_IMPLICATION_KIND')
    multipliers = tuple(F(v) for v in certificate['multipliers'])
    if len(multipliers) != len(a) or any(v < 0 for v in multipliers):
        raise ValueError('BAD_IMPLICATION_MULTIPLIERS')
    objective = tuple(-F(v) for v in row[:5]) + (F(0),)
    columns = tuple(sum((mu * r[j] for mu, r in zip(multipliers, a)), F(0))
                    for j in range(6))
    bound = F(row[5]) - RANGE * sum(row[:5])
    if any(v < c for v, c in zip(columns, objective)) or base.dot(multipliers, b) > bound:
        raise ValueError('INVALID_IMPLICATION_BOUND')
    return True


def direct_implication(a, b, row):
    """Single exact row (or nonnegative-variable cone), no unproved cached bool."""
    objective = tuple(-F(v) for v in row[:5]) + (F(0),)
    bound = F(row[5]) - RANGE * sum(row[:5])
    if all(v <= 0 for v in objective) and bound >= 0:
        return {'kind': 'nonnegative', 'multipliers': ['0'] * len(a)}
    for i, source in enumerate(a):
        ratios = [c / v for c, v in zip(objective, source) if v and c]
        scale = ratios[0] if ratios else F(0)
        if scale >= 0 and all(scale * v >= c for v, c in zip(source, objective)) and scale * b[i] <= bound:
            multipliers = ['0'] * len(a)
            multipliers[i] = str(scale)
            certificate = {'kind': 'nonnegative', 'multipliers': multipliers}
            check_implication(a, b, row, certificate)
            return certificate
    return None


def implication(a, b, row, guard=lambda: None):
    certificate = direct_implication(a, b, row)
    if certificate:
        return certificate
    objective = tuple(-F(v) for v in row[:5]) + (F(0),)
    result = base.simplex(a, b, objective, guard)
    if result['status'] != 'optimal':
        raise ArithmeticError('NONEMPTY_PARENT_CLOSED_LP_INFEASIBLE')
    bound = F(row[5]) - RANGE * sum(row[:5])
    if result['value'] > bound:
        return None
    certificate = {'kind': 'nonnegative', 'multipliers': list(map(str, result['multipliers']))}
    check_implication(a, b, row, certificate)
    return certificate


def generic_sample(sample, word, path, walls, guard=lambda: None):
    """Deterministic interior refinement, not optimization or sampled evidence."""
    x = tuple(sample) + (F(1),)
    zero = [w for w in walls if base.dot(w, x) == 0]
    if not zero:
        return tuple(sample)
    direction = None
    for integer in range(1, 4 * len(zero) + 2):
        guard()
        candidate = tuple(F(integer ** j) for j in range(5))
        if all(base.dot(w[:5], candidate) for w in zero):
            direction = candidate
            break
    if direction is None:
        raise ArithmeticError('GENERIC_DIRECTION_FAILURE')
    epsilon = F(1)
    required = [row for row, _ in base.root_rows(word)]
    required += [tuple(sign * v for v in walls[index]) for index, sign in path]
    for row in required + list(walls):
        guard()
        value = base.dot(row, x)
        derivative = base.dot(row[:5], direction)
        if value and derivative:
            epsilon = min(epsilon, abs(value / derivative) / 2)
    result = tuple(v + epsilon * d for v, d in zip(sample, direction))
    y = result + (F(1),)
    if any(base.dot(row, y) <= 0 for row in required) or any(base.dot(row, y) == 0 for row in walls):
        raise ArithmeticError('GENERIC_REFINEMENT_FAILURE')
    return result


def inherited_child(proofs, path_length):
    """Insert zero at the new path row, BEFORE the six bounding rows."""
    out = {}
    for row, certificate in proofs.items():
        values = certificate['multipliers']
        cut = 35 + path_length
        out[row] = {'kind': 'nonnegative', 'multipliers': values[:cut] + ['0'] + values[cut:]}
    return out


def classify(sample, word, path, walls, guard=lambda: None, proofs=None):
    sample = generic_sample(sample, word, path, walls, guard)
    rows = incidence_rows(sample, guard)
    a, b = closed_rows(word, path, walls)
    proofs = dict(proofs or {})
    # First exhaust cheap direct implications. Do not launch LPs for rows that
    # could immediately direct the next genuine unresolved split.
    for row in rows:
        guard()
        if row not in proofs:
            certificate = direct_implication(a, b, row)
            if certificate:
                proofs[row] = certificate
    for row in rows:
        guard()
        if row not in proofs:
            certificate = implication(a, b, row, guard)
            if certificate is None:
                index = walls.index(base.canonical(row))
                if index in {i for i, _ in path}:
                    raise ArithmeticError('UNRESOLVED_USED_WALL')
                return {'kind': 'split', 'wall': index}, proofs
            proofs[row] = certificate
        check_implication(a, b, row, proofs[row])
    poly = base.polynomial(sample)
    record = base.stationary_record(poly, word, path, walls, guard)
    return {'kind': 'early_stationary', 'sample': list(map(str, sample)),
            'polynomial': list(map(str, poly)), 'stationary': record,
            'incidence': {'rows': [list(row) for row in rows],
                          'duals': [proofs[row] for row in rows]}}, proofs


def import_state(data):
    state = json.loads(data)
    if state.get('status') != 'INCOMPLETE':
        raise ValueError('ONLY_INCOMPLETE_RESUME')
    if state.get('schema') == base.SCHEMA:
        state['schema'] = SCHEMA
        state['origin_sha256'] = hashlib.sha256(data).hexdigest()
    elif state.get('schema') != SCHEMA:
        raise ValueError('RESUME_SCHEMA_MISMATCH')
    return state


def validate_stationary(node, sample, poly, word, path, walls):
    if base.polynomial(sample) != poly:
        raise ValueError('RESUME_POLYNOMIAL_MISMATCH')
    rows = [r for r, _ in base.root_rows(word)]
    rows += [tuple(sign * v for v in walls[i]) for i, sign in path]
    if any(base.dot(row, sample + (F(1),)) <= 0 for row in rows):
        raise ValueError('RESUME_SAMPLE_NOT_INTERIOR')
    h, linear = base.derivatives(poly)
    solution = base.eliminate(h, tuple(-v for v in linear))
    record = node['stationary']
    if solution is None:
        if record != {'kind': 'inconsistent'}:
            raise ValueError('RESUME_INCONSISTENT_FAILURE')
        return
    point, null = solution
    value = base.evaluate(poly, point)
    if (record.get('particular') != list(map(str, point))
            or record.get('nullspace') != [list(map(str, d)) for d in null]
            or record.get('value') != str(value)):
        raise ValueError('RESUME_STATIONARY_FAILURE')
    if value >= TARGET:
        if record['kind'] != 'safe':
            raise ValueError('RESUME_UNSAFE_STATUS')
    else:
        if record['kind'] != 'unsafe_empty':
            raise ValueError('RESUME_WITNESS_NOT_ALLOWED')
        equalities = tuple(row + (v,) for row, v in zip(h, linear))
        base.check_dual(*base.lp_rows(word, path, walls, False, equalities), record['dual'])


def pending_paths(state, guard=lambda: None):
    origin = state.get('origin_sha256')
    if (state.get('schema') != SCHEMA or state.get('model') != base.model()
            or not isinstance(origin, str) or len(origin) != 64
            or any(c not in '0123456789abcdef' for c in origin)):
        raise ValueError('RESUME_MODEL_OR_ORIGIN_MISMATCH')
    roots, nodes, seen, queue = state['roots'], state['nodes'], set(), []
    if [r['word'] for r in roots] != [list(w) for w in base.words()]:
        raise ValueError('RESUME_ROOT_MISMATCH')
    walls = base.wall_inventory()
    stack = [(r['node'], tuple(r['word']), ()) for r in reversed(roots)]
    while stack:
        guard()
        ident, word, path = stack.pop()
        if type(ident) is not int or not 0 <= ident < len(nodes) or ident in seen:
            raise ValueError('RESUME_INVALID_TREE')
        seen.add(ident)
        node = nodes[ident]
        kind = node['kind']
        if kind == 'pending':
            queue.append((ident, word, path, {}))
        elif kind == 'split':
            index = node['wall']
            if (type(index) is not int or not 0 <= index < len(walls)
                    or index in {i for i, _ in path} or node['minus'] == node['plus']):
                raise ValueError('RESUME_INVALID_SPLIT')
            stack.extend(((node['plus'], word, path + ((index, 1),)),
                          (node['minus'], word, path + ((index, -1),))))
        elif kind == 'empty':
            base.check_dual(*base.lp_rows(word, path, walls, True), node['dual'])
        elif kind in ('stationary', 'early_stationary'):
            if kind == 'stationary' and len(path) != len(walls):
                raise ValueError('RESUME_SHALLOW_LEGACY_STATIONARY')
            sample, poly = tuple(F(v) for v in node['sample']), tuple(F(v) for v in node['polynomial'])
            if kind == 'early_stationary':
                required = incidence_rows(sample, guard)
                incidence = node['incidence']
                if incidence['rows'] != [list(row) for row in required] or len(incidence['duals']) != len(required):
                    raise ValueError('RESUME_INCIDENCE_INVENTORY_MISMATCH')
                a, b = closed_rows(word, path, walls)
                for row, certificate in zip(required, incidence['duals']):
                    guard()
                    check_implication(a, b, row, certificate)
            validate_stationary(node, sample, poly, word, path, walls)
        else:
            raise ValueError('RESUME_UNKNOWN_NODE')
    if len(seen) != len(nodes):
        raise ValueError('RESUME_UNREACHABLE_NODES')
    return sorted(queue, key=lambda item: (len(item[2]), item[0]))


def produce(state, seconds=5, max_nodes=16):
    start = time.monotonic()
    def guard():
        if time.monotonic() - start >= seconds:
            raise TimeoutError('TIME_CAP')
        peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (peak if sys.platform == 'darwin' else peak * 1024) > 512 * 1024 ** 2:
            raise MemoryError('STATE_RSS_CAP')
        if len(state['nodes']) > 1000000:
            raise MemoryError('STATE_NODE_CAP')
    processed, reason = 0, None
    try:
        queue = pending_paths(state, guard)
        history = state['run_history']
        if (not isinstance(history, list) or any(type(e.get('processed_this_run')) is not int
                or e['processed_this_run'] < 0 for e in history)
                or sum(e['processed_this_run'] for e in history)
                   != sum(n['kind'] != 'pending' for n in state['nodes'])):
            raise ValueError('RESUME_HISTORY_COUNT_MISMATCH')
        walls = base.wall_inventory()
        wire_size = len(json.dumps(state['model'])) + len(json.dumps(state['roots']))
        for old in state['nodes']:
            guard()
            wire_size += len(json.dumps(old, separators=(',', ':'))) + 1
        position = 0
        while position < len(queue):
            guard()
            if processed >= max_nodes:
                raise TimeoutError('NODE_CAP')
            ident, word, path, proofs = queue[position]
            sample, certificate = base.strict_feasibility(*base.lp_rows(word, path, walls, True), guard)
            if certificate:
                node = {'kind': 'empty', 'dual': certificate}
            else:
                node, proofs = classify(sample, word, path, walls, guard, proofs)
                if node['kind'] == 'split':
                    child = len(state['nodes'])
                    node.update({'minus': child, 'plus': child + 1})
            guard()
            additional = len(json.dumps(node, separators=(',', ':'))) - len('{"kind":"pending"}')
            if node['kind'] == 'split':
                additional += 2 * (len('{"kind":"pending"}') + 1)
            if wire_size + additional > 64 * 1024 ** 2 - 128 * 1024:
                raise MemoryError('EVIDENCE_CAP')
            old_size, old_processed = len(state['nodes']), processed
            try:
                if node['kind'] == 'split':
                    state['nodes'].extend(({'kind': 'pending'}, {'kind': 'pending'}))
                state['nodes'][ident] = node
                processed += 1
            except BaseException:
                state['nodes'][ident] = {'kind': 'pending'}
                del state['nodes'][old_size:]
                processed = old_processed
                raise
            wire_size += additional
            if node['kind'] == 'split':
                index = node['wall']
                inherited = inherited_child(proofs, len(path))
                queue.extend(((child, word, path + ((index, -1),), inherited),
                              (child + 1, word, path + ((index, 1),), inherited)))
            position += 1
            if node['kind'] == 'early_stationary' and node['stationary']['kind'] == 'witness':
                state['status'], reason = 'WITNESS', 'EXACT_SMALLER_WITNESS'
                break
    except (TimeoutError, MemoryError) as exc:
        state['status'], reason = 'INCOMPLETE', str(exc)
    except (ArithmeticError, ValueError, KeyError, TypeError, IndexError, RuntimeError) as exc:
        state['status'], reason = 'REFUSED', str(exc)
    pending = sum(n['kind'] == 'pending' for n in state['nodes'])
    if state['status'] not in ('WITNESS', 'REFUSED'):
        state['status'] = 'COMPLETE' if pending == 0 and reason is None else 'INCOMPLETE'
    elapsed = time.monotonic() - start
    state['limits'] = {'max_nodes': max_nodes, 'max_seconds': format(seconds, '.9f'),
                       'rss_bytes': 1024 ** 3, 'evidence_bytes': 64 * 1024 ** 2,
                       'state_bytes': 512 * 1024 ** 2}
    state['stats'] = {'created_nodes': len(state['nodes']), 'processed_nodes': len(state['nodes']) - pending,
                      'pending_nodes': pending, 'splits': sum(n['kind'] == 'split' for n in state['nodes']),
                      'empty_leaves': sum(n['kind'] == 'empty' for n in state['nodes']),
                      'stationary_leaves': sum(n['kind'] in ('stationary', 'early_stationary') for n in state['nodes']),
                      'processed_this_run': processed, 'elapsed_seconds': format(elapsed, '.9f'), 'reason': reason}
    state.setdefault('run_history', []).append({'elapsed_seconds': format(elapsed, '.9f'),
        'processed_this_run': processed, 'reason': reason, 'status': state['status'],
        'max_seconds': format(seconds, '.9f'), 'max_nodes': max_nodes})
    return state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--seconds', type=float, required=True)
    parser.add_argument('--max-nodes', type=int, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--resume', type=Path, required=True)
    args = parser.parse_args()
    if not 0 < args.seconds <= 28 or not 1 <= args.max_nodes <= 1000000 or args.out.exists():
        parser.error('create-only output;seconds(0,28];nodes1..1000000')
    def expired(signum, frame):
        raise TimeoutError('OUTER_TIME_CAP')
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(ceil(args.seconds) + 2)
    if args.resume.stat().st_size > 64 * 1024 ** 2:
        parser.error('resume evidence cap')
    result = produce(import_state(args.resume.read_bytes()), args.seconds, args.max_nodes)
    encoded = json.dumps(result, sort_keys=True, separators=(',', ':')) + '\n'
    if len(encoded.encode()) > 64 * 1024 ** 2:
        raise SystemExit('EVIDENCE_CAP_REFUSED_NO_COMPLETE_OUTPUT')
    with args.out.open('x', encoding='utf-8') as stream:
        stream.write(encoded)
    signal.alarm(0)
    print(json.dumps({'status': result['status'], 'stats': result['stats']}, sort_keys=True))
    raise SystemExit(0 if result['status'] == 'COMPLETE' else 3)


if __name__ == '__main__':
    main()
