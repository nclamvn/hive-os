"""Independent TIP114 checker: whole-cell incidence and exact forest proofs.

Only the immutable, independent TIP112 checker is reused. No producer imports.
Pending trees never close K6; acceptance retains the universal/C1 dependencies.
"""
import argparse
from fractions import Fraction as F
from importlib.util import module_from_spec, spec_from_file_location
from itertools import combinations
import json
from math import gcd, lcm
from pathlib import Path
import re
import signal
import time

_spec = spec_from_file_location("tip112_independent_checker", Path(__file__).resolve().parents[1] / "tip112" / "checker.py")
old = module_from_spec(_spec)
_spec.loader.exec_module(old)

# These independently implemented exact helpers remain immutable predecessor code.
Refusal, Guard = old.Refusal, old.Guard
RANGE, TARGET, TERMS, ZERO, ONE = old.RANGE, old.TARGET, old.TERMS, old.ZERO, old.ONE
MAX_BYTES, MAX_NODES = old.MAX_BYTES, old.MAX_NODES
rational, vector, dot, add, times, evaluate = old.rational, old.vector, old.dot, old.add, old.times, old.evaluate
words, endpoints, wall_inventory, base_rows = old.words, old.endpoints, old.wall_inventory, old.base_rows
multiply, poly_value, hessian_linear, eliminate = old.multiply, old.poly_value, old.hessian_linear, old.eliminate
slab_polynomial, lp_rows, check_dual = old.slab_polynomial, old.lp_rows, old.check_dual
check_stationary, check_model = old.check_stationary, old.check_model
check_metadata, check_history, read_artifact = old.check_metadata, old.check_history, old.read_artifact


def signed_primitive(row):
    """Scale positively only: a sign flip would change the proved halfspace."""
    row = tuple(map(F, row))
    if len(row) != 6:
        raise Refusal("BAD_INCIDENCE_ROW_WIDTH")
    if not any(row[:5]):
        if row[5] < 0:
            raise Refusal("NEGATIVE_CONSTANT_INCIDENCE_ROW")
        return None
    denominator = lcm(*(v.denominator for v in row))
    integers = tuple(int(v * denominator) for v in row)
    divisor = 0
    for value in integers:
        divisor = gcd(divisor, abs(value))
    return tuple(v // divisor for v in integers)


def incidence_rows(sample, planes=None, guard=lambda: None):
    """Regenerate ALL nonparallel endpoint PAIRS, not distinct event heights."""
    planes = wall_inventory(guard) if planes is None else planes
    if any(not evaluate(row, sample) for row in planes):
        raise Refusal("NONGENERIC_INCIDENCE_SAMPLE")
    canonical_planes = set(planes)
    lines = endpoints()
    intervals = {label: (left, right) for label in range(1, 7)
                 for left, right in [(lines[2 * (label - 1)], lines[2 * (label - 1) + 1])]}
    required = set()

    def put(row):
        normalized = signed_primitive(row)
        if normalized is None:
            return
        if old.canonical(normalized) not in canonical_planes:
            raise Refusal("INCIDENCE_ROW_OUTSIDE_147_WALLS")
        if evaluate(normalized, sample) <= 0:
            raise Refusal("NONSTRICT_INCIDENCE_DECISION")
        required.add(normalized)

    for first, second in combinations(lines, 2):
        guard()
        s, a, _, first_owner = first
        t, b, _, second_owner = second
        if s == t:
            continue
        height = times(add(b, a, -1), F(1, s - t))
        if height == ZERO:
            continue  # same-apex zero event, identically h=0
        h = evaluate(height, sample)
        if h <= 0:
            put(times(height, -1))
            continue
        if h >= 1:
            put(add(height, ONE, -1))
            continue
        position = add(a, height, s)
        third_rows = []
        for label in range(1, 7):
            if label in (first_owner, second_owner):
                continue
            left, right = intervals[label]
            lower = add(position, add(left[1], height, left[0]), -1)
            upper = add(add(right[1], height, right[0]), position, -1)
            third_rows.append((label, lower, upper))
        covering = next(((lower, upper) for _, lower, upper in third_rows
                         if evaluate(lower, sample) > 0 and evaluate(upper, sample) > 0), None)
        if covering is not None:
            # Lowest genuine third owner, BOTH inequalities. No clipping rows:
            # covered events have zero contribution even outside the unit slab.
            for row in covering:
                put(row)
            continue
        put(height)
        put(add(ONE, height, -1))
        for _, lower, upper in third_rows:
            if evaluate(lower, sample) < 0:
                put(times(lower, -1))  # position is to the left of the interval
            elif evaluate(upper, sample) < 0:
                put(times(upper, -1))  # position is to the right of the interval
            else:
                raise Refusal("UNRESOLVED_THIRD_INTERVAL_SIDE")
    return tuple(sorted(required))


def closed_lp_rows(root, path):
    """Exact larger CLOSED root/path region, with old nonnegative coordinates."""
    inequalities = []
    for row in tuple(root) + tuple(path):
        inequalities.append((tuple(-v for v in row[:5]) + (F(0),),
                             row[5] - RANGE * sum(row[:5], F(0))))
    for i in range(5):
        inequalities.append((tuple(F(int(i == j)) for j in range(6)), 2 * RANGE))
    inequalities.append(((F(0),) * 5 + (F(1),), F(1)))
    return tuple(inequalities)


def check_implication(certificate, row, inequalities):
    if type(certificate) is not dict or set(certificate) != {"kind", "multipliers"}:
        raise Refusal("BAD_IMPLICATION_FIELDS")
    if certificate["kind"] != "nonnegative":
        raise Refusal("BAD_IMPLICATION_KIND")
    weights = vector(certificate["multipliers"], len(inequalities))
    if any(weight < 0 for weight in weights):
        raise Refusal("NEGATIVE_IMPLICATION_MULTIPLIER")
    objective = tuple(-v for v in row[:5]) + (F(0),)
    combined = tuple(sum((weight * a[j] for weight, (a, _) in zip(weights, inequalities)), F(0))
                     for j in range(6))
    if any(value < target for value, target in zip(combined, objective)):
        raise Refusal("IMPLICATION_COEFFICIENT_FAIL")
    bound = sum((weight * b for weight, (_, b) in zip(weights, inequalities)), F(0))
    target = row[5] - RANGE * sum(row[:5], F(0))
    if bound > target:
        raise Refusal("IMPLICATION_BOUND_FAIL")
    return bound


def check_incidence(record, sample, root, path, planes=None, guard=lambda: None):
    if any(evaluate(row, sample) <= 0 for row in tuple(root) + tuple(path)):
        raise Refusal("NONINTERIOR_INCIDENCE_SAMPLE")
    if type(record) is not dict or set(record) != {"rows", "duals"}:
        raise Refusal("BAD_INCIDENCE_FIELDS")
    supplied = record["rows"]
    if type(supplied) is not list or any(type(row) is not list or len(row) != 6
                                       or any(type(v) is not int for v in row) for row in supplied):
        raise Refusal("NONINTEGER_INCIDENCE_ROWS")
    expected = incidence_rows(sample, planes, guard)
    if supplied != [list(row) for row in expected]:
        raise Refusal("INCOMPLETE_OR_ALTERED_INCIDENCE_ROWS")
    duals = record["duals"]
    if type(duals) is not list or len(duals) != len(expected):
        raise Refusal("MISSING_INCIDENCE_DUALS")
    inequalities = closed_lp_rows(root, path)
    for row, dual in zip(expected, duals):
        guard()
        check_implication(dual, row, inequalities)
    return expected


def verify(data, seconds=25):
    guard = Guard(seconds)
    if type(data) is not dict or data.get("schema") != "tip114-k6-v2":
        raise Refusal("BAD_SCHEMA")
    if set(data) != {"schema", "status", "model", "roots", "nodes", "stats", "limits", "run_history", "origin_sha256"}:
        raise Refusal("BAD_TOP_LEVEL_FIELDS")
    if type(data["origin_sha256"]) is not str or not re.fullmatch(r"[0-9a-f]{64}", data["origin_sha256"]):
        raise Refusal("BAD_ORIGIN_SHA256")
    if data["status"] not in ("COMPLETE", "INCOMPLETE", "WITNESS", "REFUSED"):
        raise Refusal("BAD_DECLARED_STATUS")
    planes, expected_words = check_model(data.get("model"), guard)
    roots, nodes = data.get("roots"), data.get("nodes")
    if type(roots) is not list or len(roots) != 13:
        raise Refusal("MISSING_ROOTS")
    if type(nodes) is not list or not 13 <= len(nodes) <= MAX_NODES:
        raise Refusal("BAD_NODE_COUNT")
    if [r.get("word") if type(r) is dict else None for r in roots] != [list(w) for w in expected_words]:
        raise Refusal("ROOT_WORDS_MISSING_DUPLICATE_OR_REORDERED")
    seen = set()
    counts = {"split": 0, "empty": 0, "stationary": 0, "pending": 0}
    early_count = 0
    dispositions = {"safe": 0, "unsafe_empty": 0, "inconsistent": 0}
    for root_record, word in zip(roots, expected_words):
        if set(root_record) != {"word", "node"}:
            raise Refusal("BAD_ROOT_FIELDS")
        if any(type(v) is not int for v in root_record["word"]):
            raise Refusal("NONINTEGER_ROOT_WORD")
        root = base_rows(word)
        stack = [(root_record["node"], (), frozenset())]
        while stack:
            guard()
            identity, path, used = stack.pop()
            if type(identity) is not int or not 0 <= identity < len(nodes):
                raise Refusal("INVALID_NODE_REFERENCE")
            if identity in seen:
                raise Refusal("REUSED_NODE_OR_CYCLE")
            seen.add(identity)
            node = nodes[identity]
            if type(node) is not dict:
                raise Refusal("BAD_NODE")
            kind = node.get("kind")
            if kind not in (*counts, "early_stationary"):
                raise Refusal("BAD_NODE_KIND")
            counts["stationary" if kind == "early_stationary" else kind] += 1
            if kind == "pending":
                if set(node) != {"kind"}:
                    raise Refusal("BAD_PENDING_FIELDS")
            elif kind == "split":
                if set(node) != {"kind", "wall", "minus", "plus"} or type(node["wall"]) is not int:
                    raise Refusal("MISSING_SPLIT_CHILD_OR_BAD_FIELDS")
                index = node["wall"]
                if not 0 <= index < len(planes):
                    raise Refusal("INVALID_SPLIT_WALL")
                if index in used:
                    raise Refusal("REPEATED_WALL_ON_PATH")
                if node["minus"] == node["plus"]:
                    raise Refusal("DUPLICATE_SPLIT_CHILD")
                plane = tuple(map(F, planes[index]))
                child_used = used | {index}
                stack.append((node["plus"], path + (plane,), child_used))
                stack.append((node["minus"], path + (times(plane, -1),), child_used))
            elif kind == "empty":
                if set(node) != {"kind", "dual"}:
                    raise Refusal("BAD_EMPTY_FIELDS")
                check_dual(node["dual"], lp_rows(root, path))
            else:
                fields = {"kind", "sample", "polynomial", "stationary"}
                if kind == "early_stationary":
                    fields.add("incidence")
                    early_count += 1
                elif len(used) != len(planes):
                    raise Refusal("UNPROCESSED_WALLS_AT_STATIONARY_LEAF")
                if set(node) != fields:
                    raise Refusal("BAD_STATIONARY_NODE_FIELDS")
                sample = vector(node["sample"], 5)
                if kind == "early_stationary":
                    check_incidence(node["incidence"], sample, root, path, planes, guard)
                polynomial = vector(node["polynomial"], len(TERMS))
                independent = slab_polynomial(sample, root + path, guard)
                if polynomial != independent:
                    raise Refusal("ALTERED_ACTUAL_UNION_POLYNOMIAL")
                disposition = check_stationary(node["stationary"], polynomial, root, path, guard)
                dispositions[disposition] += 1
    if len(seen) != len(nodes):
        raise Refusal("UNREACHABLE_NODE_RECORDS")
    check_metadata(data["stats"], data["limits"], counts, len(nodes), data["status"])
    check_history(data["run_history"], data["stats"], data["limits"], data["status"])
    if data["status"] != "COMPLETE" or counts["pending"]:
        raise Refusal("INCOMPLETE_FOREST_REFUSED")
    return {"status": "EXACT_COMPLETE_FOREST_CHECKED_CONDITIONAL", "node_counts": counts,
            "early_stationary_leaves": early_count, "stationary_dispositions": dispositions,
            "roots": 13, "walls": len(planes), "elapsed_seconds": time.monotonic() - guard.start,
            "scope": "independent finite certificate; retained universal/C1 reductions; no external/formal acceptance"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("certificate")
    parser.add_argument("--seconds", type=float, default=25)
    parser.add_argument("--out")
    args = parser.parse_args()
    if not 0 < args.seconds <= 28:
        raise SystemExit("seconds must be in(0,28]")
    def expired(_signum, _frame):
        raise Refusal("OUTER_CHECKER_TIME_LIMIT")
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(30)
    start = time.monotonic()
    try:
        result = verify(read_artifact(args.certificate), args.seconds)
    except (Refusal, KeyError, TypeError, IndexError, ArithmeticError, OSError, json.JSONDecodeError) as exc:
        result = {"status": "REFUSED", "reason": str(exc), "elapsed_seconds": time.monotonic() - start}
    encoded = json.dumps(result, sort_keys=True, separators=(",", ":")) + "\n"
    if args.out:
        with Path(args.out).open("x", encoding="utf-8") as stream:
            stream.write(encoded)
    print(encoded, end="")
    return 0 if result["status"] == "EXACT_COMPLETE_FOREST_CHECKED_CONDITIONAL" else 3


if __name__ == "__main__":
    raise SystemExit(main())
