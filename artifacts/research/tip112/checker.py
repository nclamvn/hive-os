"""Independent TIP112 exact forest checker; no producer imports.

Actual union polynomials are derived by endpoint coverage-count slab integration.
Completion is conditional on retained universal reductions and coarse-cell C1
theorem, not an external/formal mathematical acceptance. Pending forests refuse.
"""
import argparse
from fractions import Fraction
from functools import reduce
from itertools import combinations
import json
from math import gcd
from pathlib import Path
import re
import resource
import signal
import sys
import time

F = Fraction
RANGE = F(49, 31)
TARGET = F(40, 31)
TERMS = tuple((i, j) for i in range(6) for j in range(i, 6))
ZERO = (F(0),) * 6
ONE = (F(0),) * 5 + (F(1),)
MAX_BYTES = 64 * 1024 * 1024
MAX_NODES = 1000000
MAX_RATIONAL_LENGTH = 2048


class Refusal(ValueError):
    pass


class Guard:
    def __init__(self, seconds=25):
        if not 0 < seconds <= 30:
            raise Refusal("BAD_SECONDS")
        self.start = time.monotonic()
        self.seconds = seconds
        self.calls = 0

    def __call__(self):
        self.calls += 1
        if time.monotonic() - self.start >= self.seconds:
            raise Refusal("CHECKER_TIME_LIMIT")
        if self.calls % 64 == 1:
            native = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
            rss = native if sys.platform == "darwin" else native * 1024
            if rss > 1024 ** 3:
                raise Refusal("CHECKER_RSS_LIMIT")


def rational(value):
    if type(value) is int:
        if value.bit_length() > 6800:
            raise Refusal("RATIONAL_TOO_LARGE")
        return F(value)
    if type(value) is not str or len(value) > MAX_RATIONAL_LENGTH:
        raise Refusal("BAD_RATIONAL")
    if not re.fullmatch(r"-?\d+(?:/[1-9]\d*)?", value):
        raise Refusal("BAD_RATIONAL")
    return F(value)


def vector(values, width):
    if type(values) is not list or len(values) != width:
        raise Refusal("BAD_VECTOR_WIDTH")
    return tuple(rational(v) for v in values)


def dot(a, b):
    return sum((x * y for x, y in zip(a, b)), F(0))


def add(a, b, factor=F(1)):
    return tuple(x + factor * y for x, y in zip(a, b))


def times(a, scalar):
    return tuple(scalar * x for x in a)


def evaluate(row, point):
    return dot(row[:5], point) + row[5]


def canonical(row):
    divisor = reduce(gcd, (abs(v) for v in row), 0)
    if not divisor or not any(row[:5]):
        return None
    result = tuple(v // divisor for v in row)
    return result if next(v for v in result if v) > 0 else tuple(-v for v in result)


def words():
    # Independently generate subsets of the five path edges with no neighbors.
    output = []
    def visit(label, prefix):
        if label > 6:
            output.append(tuple(prefix))
            return
        visit(label + 1, prefix + [label])
        if label < 6:
            visit(label + 2, prefix + [label + 1, label])
    visit(1, [])
    return tuple(output)


def endpoints():
    result = []
    for label in range(1, 7):
        intercept = tuple(F(int(i == label - 1)) for i in range(5)) + (F(label),)
        for slope, kind in ((-label, "L"), (1 - label, "R")):
            result.append((slope, intercept, kind, label))
    return tuple(result)


def wall_inventory(guard=lambda: None):
    lines = endpoints()
    planes = set()
    def put(row):
        p = canonical(tuple(int(v) for v in row))
        if p is not None:
            planes.add(p)
    for (s, a, _, _), (t, b, _, _) in combinations(lines, 2):
        guard()
        put(add(b, a, -1))  # top/parallel order
        if s != t:
            put(add(add(b, a, -1), ONE, t - s))  # physical bottom clip
    for (s, a, _, _), (t, b, _, _), (u, c, _, _) in combinations(lines, 3):
        guard()
        put(add(times(add(c, a, -1), t - s), times(add(b, a, -1), u - s), -1))
    answer = tuple(sorted(planes))
    if len(answer) != 147:
        raise Refusal("INDEPENDENT_WALL_COUNT_NOT_147")
    return answer


def base_rows(word):
    if tuple(word) not in words():
        raise Refusal("INVALID_WORD")
    coordinates = tuple(tuple(F(int(i == j)) for i in range(5)) + (F(0),)
                        for j in range(5)) + (ZERO,)
    rows = []
    for i in range(6):
        for j in range(6):
            if i != j:
                rows.append(add(add(coordinates[j], coordinates[i], -1), ONE, RANGE))
    apices = [add(coordinates[i], ONE, i + 1) for i in range(6)]
    for a, b in zip(word, word[1:]):
        rows.append(add(apices[b - 1], apices[a - 1], -1))
    return tuple(rows)


def multiply(a, b):
    coefficients = {(i, j): F(0) for i, j in TERMS}
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            coefficients[min(i, j), max(i, j)] += x * y
    return tuple(coefficients[t] for t in TERMS)


def poly_value(polynomial, point):
    x = tuple(point) + (F(1),)
    return sum((c * x[i] * x[j] for c, (i, j) in zip(polynomial, TERMS)), F(0))


def hessian_linear(polynomial):
    hessian = [[F(0)] * 5 for _ in range(5)]
    linear = [F(0)] * 5
    for value, (i, j) in zip(polynomial, TERMS):
        if i == j and i < 5:
            hessian[i][i] += 2 * value
        elif j < 5:
            hessian[i][j] += value
            hessian[j][i] += value
        elif i < 5:
            linear[i] += value
    return tuple(tuple(r) for r in hessian), tuple(linear)


def eliminate(matrix, rhs, width=5, guard=lambda: None):
    if len(matrix) != len(rhs) or any(len(r) != width for r in matrix):
        raise Refusal("BAD_LINEAR_SYSTEM")
    work = [list(map(F, row)) + [F(value)] for row, value in zip(matrix, rhs)]
    position = 0
    pivots = []
    for column in range(width):
        guard()
        pivot = next((r for r in range(position, len(work)) if work[r][column]), None)
        if pivot is None:
            continue
        work[position], work[pivot] = work[pivot], work[position]
        divisor = work[position][column]
        work[position] = [v / divisor for v in work[position]]
        for row in range(len(work)):
            if row != position and work[row][column]:
                multiplier = work[row][column]
                work[row] = [v - multiplier * w for v, w in zip(work[row], work[position])]
        pivots.append(column)
        position += 1
    if any(not any(row[:width]) and row[width] for row in work):
        return None
    particular = [F(0)] * width
    for row, column in enumerate(pivots):
        particular[column] = work[row][width]
    nullspace = []
    for free in range(width):
        if free in pivots:
            continue
        direction = [F(0)] * width
        direction[free] = F(1)
        for row, column in enumerate(pivots):
            direction[column] = -work[row][free]
        nullspace.append(tuple(direction))
    return tuple(particular), tuple(nullspace), len(pivots)


def fine_generic(point, closed_cell_rows, guard=lambda: None):
    lines = endpoints()
    cuts = {ZERO, ONE}
    for (s, a, _, _), (t, b, _, _) in combinations(lines, 2):
        if s != t:
            cuts.add(times(add(b, a, -1), F(1, s - t)))
    ordered_forms = sorted(cuts)
    differences = [add(a, b, -1) for a, b in combinations(ordered_forms, 2)]
    zeros = [row for row in differences if not evaluate(row, point)]
    direction = None
    for k in range(1, 4 * len(zeros) + 2):
        guard()
        trial = tuple(F(k ** power) for power in range(5))
        if all(dot(row[:5], trial) for row in zeros):
            direction = trial
            break
    if direction is None:
        raise Refusal("NO_FINE_GENERIC_DIRECTION")
    step = F(1, 1000)
    for row in tuple(closed_cell_rows) + tuple(differences):
        initial = evaluate(row, point)
        change = dot(row[:5], direction)
        if initial and change:
            step = min(step, abs(initial / change) / 3)
    sample = add(point, direction, step)
    if any(evaluate(row, sample) <= 0 for row in closed_cell_rows):
        raise Refusal("FINE_POINT_OUTSIDE_OPEN_CELL")
    active = sorted((h for h in cuts if 0 <= evaluate(h, sample) <= 1),
                    key=lambda h: evaluate(h, sample))
    if len({evaluate(h, sample) for h in active}) != len(active):
        raise Refusal("UNRESOLVED_FINE_HEIGHT_TIE")
    return sample, active


def slab_polynomial(point, open_rows, guard=lambda: None):
    """Independent actual-union integration, not the producer event spline."""
    if any(evaluate(row, point) <= 0 for row in open_rows):
        raise Refusal("NONINTERIOR_POLYNOMIAL_SAMPLE")
    sample, cuts = fine_generic(point, open_rows, guard)
    polynomial = (F(0),) * len(TERMS)
    lines = endpoints()
    for low, high in zip(cuts, cuts[1:]):
        guard()
        mid = (evaluate(low, sample) + evaluate(high, sample)) / 2
        events = sorted(lines, key=lambda line: evaluate(line[1], sample) + line[0] * mid)
        occupied = 0
        previous = None
        intercept = ZERO
        slope = F(0)
        for s, a, kind, _ in events:
            if previous is not None and occupied:
                intercept = add(intercept, add(a, previous[1], -1))
                slope += s - previous[0]
            occupied += 1 if kind == "L" else -1
            if occupied < 0:
                raise Refusal("NEGATIVE_ENDPOINT_COVERAGE")
            previous = s, a
        if occupied:
            raise Refusal("UNCLOSED_ENDPOINT_COVERAGE")
        band = multiply(intercept, add(high, low, -1))
        squares = add(multiply(high, high), multiply(low, low), -1)
        polynomial = add(polynomial, add(band, squares, slope / 2))
    return polynomial


def lp_rows(root, path, hessian=None, linear=None):
    rows = [(r, True) for r in root] + [(r, hessian is None) for r in path]
    if hessian is not None:
        for row, constant in zip(hessian, linear):
            affine = tuple(row) + (constant,)
            rows.append((affine, False))
            rows.append((times(affine, -1), False))
    inequalities = []
    for row, strict in rows:
        a = tuple(-v for v in row[:5]) + (F(int(strict)),)
        bound = row[5] - RANGE * sum(row[:5], F(0))
        inequalities.append((a, bound))
    for i in range(5):
        inequalities.append((tuple(F(int(i == j)) for j in range(6)), 2 * RANGE))
    inequalities.append(((F(0),) * 5 + (F(1),), F(1)))
    return tuple(inequalities)


def check_dual(certificate, inequalities):
    if type(certificate) is not dict or set(certificate) != {"kind", "multipliers"}:
        raise Refusal("BAD_DUAL_FIELDS")
    kind = certificate["kind"]
    if kind not in ("epsilon_bound", "farkas"):
        raise Refusal("BAD_DUAL_KIND")
    multipliers = vector(certificate["multipliers"], len(inequalities))
    if any(v < 0 for v in multipliers):
        raise Refusal("NEGATIVE_DUAL_MULTIPLIER")
    combined = tuple(sum((weight * row[j] for weight, (row, _) in zip(multipliers, inequalities)), F(0))
                     for j in range(6))
    bound = sum((weight * rhs for weight, (_, rhs) in zip(multipliers, inequalities)), F(0))
    objective = (F(0),) * 5 + (F(kind == "epsilon_bound"),)
    if any(a < b for a, b in zip(combined, objective)):
        raise Refusal("DUAL_COEFFICIENT_INEQUALITY_FAIL")
    if kind == "epsilon_bound" and bound > 0:
        raise Refusal("DUAL_EPSILON_BOUND_POSITIVE")
    if kind == "farkas" and bound >= 0:
        raise Refusal("DUAL_FARKAS_NOT_NEGATIVE")
    return bound


def check_stationary(record, polynomial, root, path, guard=lambda: None):
    if type(record) is not dict or "kind" not in record:
        raise Refusal("BAD_STATIONARY_RECORD")
    hessian, linear = hessian_linear(polynomial)
    solution = eliminate(hessian, [-v for v in linear], 5, guard)
    if solution is None:
        if record != {"kind": "inconsistent"}:
            raise Refusal("FALSE_INCONSISTENT_RECORD")
        return "inconsistent"
    kind = record["kind"]
    required = {"kind", "particular", "nullspace", "value"}
    if kind == "unsafe_empty":
        required.add("dual")
    if set(record) != required or kind not in ("safe", "unsafe_empty", "witness"):
        raise Refusal("BAD_CONSISTENT_STATIONARY_FIELDS")
    point = vector(record["particular"], 5)
    if any(dot(row, point) + value for row, value in zip(hessian, linear)):
        raise Refusal("INVALID_STATIONARY_PARTICULAR")
    if type(record["nullspace"]) is not list:
        raise Refusal("INVALID_NULLSPACE")
    supplied_null = tuple(vector(row, 5) for row in record["nullspace"])
    if any(any(dot(row, direction) for row in hessian) for direction in supplied_null):
        raise Refusal("INVALID_NULLSPACE_DIRECTION")
    basis = eliminate(supplied_null, [F(0)] * len(supplied_null), 5, guard)
    if len(supplied_null) != 5 - solution[2] or basis is None or basis[2] != len(supplied_null):
        raise Refusal("INCOMPLETE_NULLSPACE_BASIS")
    actual_value = poly_value(polynomial, solution[0])
    if actual_value != poly_value(polynomial, point) or actual_value != rational(record["value"]):
        raise Refusal("ALTERED_STATIONARY_VALUE")
    if kind == "safe":
        if actual_value < TARGET:
            raise Refusal("FALSE_SAFE_STATIONARY_VALUE")
    elif kind == "unsafe_empty":
        if actual_value >= TARGET:
            raise Refusal("FALSE_UNSAFE_VALUE")
        check_dual(record["dual"], lp_rows(root, path, hessian, linear))
    else:
        raise Refusal("WITNESS_REQUIRES_BOTH_IMMUTABLE_AREA_CHECKS")
    return kind


def check_model(model, guard=lambda: None):
    if type(model) is not dict or set(model) != {"gauge", "range", "target_G", "terms", "walls", "words"}:
        raise Refusal("BAD_MODEL_FIELDS")
    if model["gauge"] != "p6=0;A_j=p_j+j":
        raise Refusal("MODEL_GAUGE_MISMATCH")
    if rational(model["range"]) != RANGE or rational(model["target_G"]) != TARGET:
        raise Refusal("MODEL_TARGET_OR_RANGE_MISMATCH")
    expected_walls = wall_inventory(guard)
    expected_words = words()
    for name, width in (("terms", 2), ("walls", 6), ("words", 6)):
        if type(model[name]) is not list or any(type(row) is not list or len(row) != width
                                               or any(type(v) is not int for v in row)
                                               for row in model[name]):
            raise Refusal("NONINTEGER_MODEL_INVENTORY")
    if model["terms"] != [list(t) for t in TERMS]:
        raise Refusal("MONOMIAL_ORDER_MISMATCH")
    if model["walls"] != [list(w) for w in expected_walls]:
        raise Refusal("WALL_INVENTORY_MISMATCH")
    if model["words"] != [list(w) for w in expected_words]:
        raise Refusal("APEX_WORD_INVENTORY_MISMATCH")
    return expected_walls, expected_words


def verify(data, seconds=25):
    guard = Guard(seconds)
    if type(data) is not dict or data.get("schema") != "tip112-k6-v1":
        raise Refusal("BAD_SCHEMA")
    if set(data) != {"schema", "status", "model", "roots", "nodes", "stats", "limits", "run_history"}:
        raise Refusal("BAD_TOP_LEVEL_FIELDS")
    if data.get("status") not in ("COMPLETE", "INCOMPLETE", "WITNESS", "REFUSED"):
        raise Refusal("BAD_DECLARED_STATUS")
    planes, expected_words = check_model(data.get("model"), guard)
    roots = data.get("roots")
    nodes = data.get("nodes")
    if type(roots) is not list or len(roots) != 13:
        raise Refusal("MISSING_ROOTS")
    if type(nodes) is not list or not 13 <= len(nodes) <= MAX_NODES:
        raise Refusal("BAD_NODE_COUNT")
    if [r.get("word") if type(r) is dict else None for r in roots] != [list(w) for w in expected_words]:
        raise Refusal("ROOT_WORDS_MISSING_DUPLICATE_OR_REORDERED")
    seen = set()
    counts = {"split": 0, "empty": 0, "stationary": 0, "pending": 0}
    dispositions = {"safe": 0, "unsafe_empty": 0, "inconsistent": 0}
    for root_record, word in zip(roots, expected_words):
        if set(root_record) != {"word", "node"}:
            raise Refusal("BAD_ROOT_FIELDS")
        if any(type(v) is not int for v in root_record["word"]):
            raise Refusal("NONINTEGER_ROOT_WORD")
        root_constraints = base_rows(word)
        stack = [(root_record["node"], ())]
        while stack:
            guard()
            identity, path = stack.pop()
            if type(identity) is not int or not 0 <= identity < len(nodes):
                raise Refusal("INVALID_NODE_REFERENCE")
            if identity in seen:
                raise Refusal("REUSED_NODE_OR_CYCLE")
            seen.add(identity)
            node = nodes[identity]
            if type(node) is not dict:
                raise Refusal("BAD_NODE")
            kind = node.get("kind")
            if kind not in counts:
                raise Refusal("BAD_NODE_KIND")
            counts[kind] += 1
            if kind == "pending":
                if set(node) != {"kind"}:
                    raise Refusal("BAD_PENDING_FIELDS")
            elif kind == "split":
                if set(node) != {"kind", "wall", "minus", "plus"} or type(node["wall"]) is not int:
                    raise Refusal("MISSING_SPLIT_CHILD_OR_BAD_FIELDS")
                if len(path) >= len(planes) or node["wall"] != len(path):
                    raise Refusal("WALL_SPLIT_ORDER_MISMATCH")
                if node["minus"] == node["plus"]:
                    raise Refusal("DUPLICATE_SPLIT_CHILD")
                plane = tuple(map(F, planes[len(path)]))
                stack.append((node["plus"], path + (plane,)))
                stack.append((node["minus"], path + (times(plane, -1),)))
            elif kind == "empty":
                if set(node) != {"kind", "dual"}:
                    raise Refusal("BAD_EMPTY_FIELDS")
                check_dual(node["dual"], lp_rows(root_constraints, path))
            else:
                if set(node) != {"kind", "sample", "polynomial", "stationary"}:
                    raise Refusal("BAD_STATIONARY_NODE_FIELDS")
                if len(path) != len(planes):
                    raise Refusal("UNPROCESSED_WALLS_AT_STATIONARY_LEAF")
                sample = vector(node["sample"], 5)
                polynomial = vector(node["polynomial"], len(TERMS))
                independent = slab_polynomial(sample, root_constraints + path, guard)
                if polynomial != independent:
                    raise Refusal("ALTERED_ACTUAL_UNION_POLYNOMIAL")
                disposition = check_stationary(node["stationary"], polynomial, root_constraints, path, guard)
                dispositions[disposition] += 1
    if len(seen) != len(nodes):
        raise Refusal("UNREACHABLE_NODE_RECORDS")
    check_metadata(data["stats"], data["limits"], counts, len(nodes), data["status"])
    check_history(data["run_history"], data["stats"], data["limits"], data["status"])
    if data["status"] != "COMPLETE" or counts["pending"]:
        raise Refusal("INCOMPLETE_FOREST_REFUSED")
    return {"status": "EXACT_COMPLETE_FOREST_CHECKED_CONDITIONAL",
            "node_counts": counts, "stationary_dispositions": dispositions,
            "roots": 13, "walls": len(planes), "elapsed_seconds": time.monotonic() - guard.start,
            "scope": "independent finite certificate; retained universal reduction/C1 dependencies required; no external/formal acceptance"}


def check_metadata(stats, limits, counts, node_count, status):
    required_stats = {"created_nodes", "processed_nodes", "pending_nodes", "splits", "empty_leaves",
                      "stationary_leaves", "processed_this_run", "elapsed_seconds", "reason"}
    required_limits = {"max_nodes", "max_seconds", "rss_bytes", "evidence_bytes", "state_bytes"}
    if type(stats) is not dict or set(stats) != required_stats:
        raise Refusal("BAD_STATS_FIELDS")
    if type(limits) is not dict or set(limits) != required_limits:
        raise Refusal("BAD_LIMITS_FIELDS")
    integers = ("created_nodes", "processed_nodes", "pending_nodes", "splits", "empty_leaves",
                "stationary_leaves", "processed_this_run")
    if any(type(stats[k]) is not int or stats[k] < 0 for k in integers):
        raise Refusal("BAD_INTEGER_ACCOUNTING")
    expected = {"created_nodes": node_count, "processed_nodes": node_count - counts["pending"],
                "pending_nodes": counts["pending"], "splits": counts["split"],
                "empty_leaves": counts["empty"], "stationary_leaves": counts["stationary"]}
    if any(stats[k] != value for k, value in expected.items()):
        raise Refusal("FOREST_ACCOUNTING_MISMATCH")
    if any(type(limits[k]) is not int or limits[k] < 1 for k in
           ("max_nodes", "rss_bytes", "evidence_bytes", "state_bytes")):
        raise Refusal("BAD_INTEGER_LIMIT")
    if limits["rss_bytes"] != 1024 ** 3 or limits["evidence_bytes"] != MAX_BYTES or limits["state_bytes"] != 512 * 1024 ** 2:
        raise Refusal("RESOURCE_CEILING_MISMATCH")
    if stats["processed_this_run"] > stats["processed_nodes"] or stats["processed_this_run"] > limits["max_nodes"]:
        raise Refusal("PROCESSED_THIS_RUN_MISMATCH")
    seconds = limits["max_seconds"]
    if type(seconds) is not str or len(seconds) > 64 or not re.fullmatch(r"\d+(?:\.\d+)?", seconds):
        raise Refusal("BAD_PRODUCER_SECONDS_METADATA")
    if F(seconds) <= 0 or F(seconds) > 30:
        raise Refusal("BAD_PRODUCER_SECONDS_LIMIT")
    # Elapsed time is engineering metadata, never a proof coefficient.
    elapsed = stats["elapsed_seconds"]
    if type(elapsed) is not str or not re.fullmatch(r"\d+(?:\.\d+)?", elapsed):
        raise Refusal("BAD_ELAPSED_METADATA")
    if status == "COMPLETE" and stats["reason"] is not None:
        raise Refusal("COMPLETE_WITH_STOP_REASON")
    if stats["reason"] is not None and type(stats["reason"]) is not str:
        raise Refusal("BAD_STOP_REASON")


def check_history(history, stats, limits, status):
    fields = {"elapsed_seconds", "processed_this_run", "reason", "status", "max_seconds", "max_nodes"}
    if type(history) is not list or len(history) > MAX_NODES:
        raise Refusal("BAD_RUN_HISTORY")
    total = 0
    for item in history:
        if type(item) is not dict or set(item) != fields:
            raise Refusal("BAD_RUN_HISTORY_FIELDS")
        if type(item["processed_this_run"]) is not int or item["processed_this_run"] < 0:
            raise Refusal("BAD_RUN_HISTORY_COUNT")
        if type(item["max_nodes"]) is not int or not 1 <= item["max_nodes"]:
            raise Refusal("BAD_RUN_HISTORY_LIMIT")
        if item["processed_this_run"] > item["max_nodes"]:
            raise Refusal("RUN_HISTORY_NODE_LIMIT_EXCEEDED")
        for key in ("elapsed_seconds", "max_seconds"):
            value = item[key]
            if type(value) is not str or len(value) > 64 or not re.fullmatch(r"\d+(?:\.\d+)?", value):
                raise Refusal("BAD_RUN_HISTORY_DECIMAL")
        if not 0 < F(item["max_seconds"]) <= 30:
            raise Refusal("BAD_RUN_HISTORY_SECONDS_LIMIT")
        if item["status"] not in ("COMPLETE", "INCOMPLETE", "WITNESS", "REFUSED"):
            raise Refusal("BAD_RUN_HISTORY_STATUS")
        if item["reason"] is not None and type(item["reason"]) is not str:
            raise Refusal("BAD_RUN_HISTORY_REASON")
        total += item["processed_this_run"]
    if total != stats["processed_nodes"]:
        raise Refusal("RUN_HISTORY_CUMULATIVE_COUNT_MISMATCH")
    if history:
        latest = history[-1]
        if any(latest[key] != value for key, value in
               (("elapsed_seconds", stats["elapsed_seconds"]), ("processed_this_run", stats["processed_this_run"]),
                ("reason", stats["reason"]), ("status", status),
                ("max_seconds", limits["max_seconds"]), ("max_nodes", limits["max_nodes"]))):
            raise Refusal("LATEST_RUN_HISTORY_MISMATCH")
    elif stats["processed_this_run"]:
        raise Refusal("MISSING_CURRENT_RUN_HISTORY")


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise Refusal("DUPLICATE_JSON_KEY")
        result[key] = value
    return result


def read_artifact(path):
    source = Path(path)
    if source.stat().st_size > MAX_BYTES:
        raise Refusal("INPUT_ARTIFACT_LIMIT")
    return json.loads(source.read_text(), object_pairs_hook=unique_object,
                      parse_float=lambda _: (_ for _ in ()).throw(Refusal("FLOAT_NOT_EXACT")))


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
