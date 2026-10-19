"""Exact K6 certificate producer. COMPLETE-capable; no whole run authorized here.

All arithmetic is rational. Status is never mathematical acceptance: the
independent checker must rederive model, coverage, polynomials and duals.
"""
from fractions import Fraction as F
from functools import reduce
from itertools import combinations
from math import ceil, gcd, lcm
from pathlib import Path
import argparse
import json
import resource
import signal
import sys
import time

RANGE = F(49, 31)
TARGET = F(40, 31)
TERMS = tuple((i, j) for i in range(6) for j in range(i, 6))
SCHEMA = "tip112-k6-v1"


def dot(a, b):
    return sum((x * y for x, y in zip(a, b)), F(0))


def canonical(row):
    denominator = lcm(*(F(x).denominator for x in row))
    row = tuple(int(F(x) * denominator) for x in row)
    divisor = reduce(gcd, (abs(x) for x in row), 0)
    if not divisor or not any(row[:5]):
        return None
    row = tuple(x // divisor for x in row)
    return row if next(x for x in row if x) > 0 else tuple(-x for x in row)


def words(first=1):
    if first == 7:
        return [()]
    out = [(first,) + w for w in words(first + 1)]
    if first < 6:
        out += [(first + 1, first) + w for w in words(first + 2)]
    return out


def endpoints():
    result = []
    for j in range(1, 7):
        intercept = tuple(F(i == j - 1 and j < 6) for i in range(5)) + (F(j),)
        result.extend(((-j, intercept, j, "L"), (1 - j, intercept, j, "R")))
    return result


def wall_inventory():
    lines = endpoints()
    walls = set()
    for (s, a, _, _), (t, b, _, _) in combinations(lines, 2):
        for row in (tuple(y - x for x, y in zip(a, b)),
                    tuple(y - x for x, y in zip(a[:5], b[:5])) + (b[5] - a[5] + t - s,)):
            key = canonical(row)
            if key:
                walls.add(key)
    for (s, a, _, _), (t, b, _, _), (u, c, _, _) in combinations(lines, 3):
        key = canonical(tuple((t - s) * (z - x) - (u - s) * (y - x)
                              for x, y, z in zip(a, b, c)))
        if key:
            walls.add(key)
    result = tuple(sorted(walls))
    if len(result) != 147 or len(words()) != 13:
        raise ArithmeticError("MODEL_INVENTORY_FAILURE")
    return result


def model():
    return {"gauge": "p6=0;A_j=p_j+j", "range": str(RANGE), "target_G": str(TARGET),
            "terms": [list(t) for t in TERMS], "walls": [list(w) for w in wall_inventory()],
            "words": [list(w) for w in words()]}


def root_rows(word):
    result = []
    for i in range(1, 7):
        for j in range(1, 7):
            if i == j:
                continue
            a = tuple(F(k == j - 1 and j < 6) - F(k == i - 1 and i < 6)
                      for k in range(5))
            result.append((a + (RANGE,), True))
    for i, j in zip(word, word[1:]):
        a = tuple(F(k == j - 1 and j < 6) - F(k == i - 1 and i < 6)
                  for k in range(5))
        result.append((a + (F(j - i),), True))
    return result


def lp_rows(word, path, walls, interior, equalities=()):
    affine = root_rows(word)
    affine += [(tuple(F(sign) * x for x in walls[index]), interior) for index, sign in path]
    for row in equalities:
        affine.extend(((tuple(row), False), (tuple(-x for x in row), False)))
    a, b = [], []
    for row, strict in affine:
        a.append(tuple(-x for x in row[:5]) + (F(strict),))
        b.append(row[5] - RANGE * sum(row[:5]))
    for i in range(5):
        a.append(tuple(F(i == j) for j in range(6)))
        b.append(2 * RANGE)
    a.append((F(0),) * 5 + (F(1),))
    b.append(F(1))
    return tuple(a), tuple(b)


def check_dual(a, b, certificate):
    multipliers = tuple(F(x) for x in certificate["multipliers"])
    if len(multipliers) != len(a) or any(x < 0 for x in multipliers):
        raise ValueError("INVALID_DUAL_MULTIPLIERS")
    columns = tuple(sum((y * row[j] for y, row in zip(multipliers, a)), F(0))
                    for j in range(len(a[0])))
    bound = dot(multipliers, b)
    kind = certificate["kind"]
    if kind == "epsilon_bound":
        objective = (F(0),) * (len(columns) - 1) + (F(1),)
        good = all(x >= c for x, c in zip(columns, objective)) and bound <= 0
    elif kind == "farkas":
        good = all(x >= 0 for x in columns) and bound < 0
    else:
        good = False
    if not good:
        raise ValueError("INVALID_DUAL_BOUND")
    return bound


def simplex(a, b, objective, guard=lambda: None, pivot_cap=10000):
    """Exact two-phase Bland simplex for max c.x, A.x<=b,x>=0.

    Artificial variable has column -1 in every original equality. At optimum,
    an original slack's reduced-cost coefficient is its dual multiplier; if
    that slack is basic its multiplier is0. This avoids an m-dimensional inverse.
    All resulting primal/dual identities are checked independently of tableau.
    """
    m, n = len(a), len(objective)
    if not m or any(len(row) != n for row in a) or len(b) != m:
        raise ValueError("BAD_LP_DIMENSIONS")
    tab = [[F(x) for x in row] + [F(-1), F(rhs)] for row, rhs in zip(a, b)]
    tab += [[-F(x) for x in objective] + [F(0), F(0)],
            [F(0)] * n + [F(1), F(0)]]
    basic, nonbasic = [n + i for i in range(m)], list(range(n)) + [-1]
    pivots = 0
    def pivot(r, s):
        nonlocal pivots
        guard()
        denominator = tab[r][s]
        if not denominator:
            raise ArithmeticError("ZERO_PIVOT")
        for i in range(m + 2):
            if i == r:
                continue
            for j in range(n + 2):
                if j != s:
                    tab[i][j] -= tab[r][j] * tab[i][s] / denominator
        for j in range(n + 2):
            if j != s:
                tab[r][j] /= denominator
        for i in range(m + 2):
            if i != r:
                tab[i][s] /= -denominator
        tab[r][s] = 1 / denominator
        basic[r], nonbasic[s] = nonbasic[s], basic[r]
        pivots += 1
        if pivots > pivot_cap:
            raise RuntimeError("LP_PIVOT_CAP")
    def optimize(phase):
        row = m + 1 if phase == 1 else m
        while True:
            guard()
            candidates = [j for j in range(n + 1) if tab[row][j] < 0
                          and (phase == 1 or nonbasic[j] != -1)]
            if not candidates:
                return
            s = min(candidates, key=lambda j: nonbasic[j])
            choices = [(tab[i][-1] / tab[i][s], basic[i], i)
                       for i in range(m) if tab[i][s] > 0]
            if not choices:
                raise ArithmeticError("LP_UNBOUNDED")
            pivot(min(choices)[2], s)
    def dual(row):
        out = [F(0)] * m
        for j, variable in enumerate(nonbasic):
            if n <= variable < n + m:
                out[variable - n] = tab[row][j]
        return tuple(out)
    r = min(range(m), key=lambda i: (tab[i][-1], basic[i]))
    if tab[r][-1] < 0:
        pivot(r, n)
        optimize(1)
        if tab[m + 1][-1] < 0:
            y = dual(m + 1)
            cert = {"kind": "farkas", "multipliers": list(map(str, y))}
            check_dual(a, b, cert)
            return {"status": "infeasible", "dual": cert, "pivots": pivots}
        if tab[m + 1][-1] != 0:
            raise ArithmeticError("INVALID_PHASE_ONE_VALUE")
        if -1 in basic:
            r = basic.index(-1)
            choices = [j for j in range(n + 1) if nonbasic[j] != -1 and tab[r][j]]
            if choices:
                pivot(r, min(choices, key=lambda j: nonbasic[j]))
    optimize(2)
    point = [F(0)] * n
    for i, variable in enumerate(basic):
        if 0 <= variable < n:
            point[variable] = tab[i][-1]
    y = dual(m)
    value = dot(point, objective)
    columns = tuple(sum((mu * row[j] for mu, row in zip(y, a)), F(0)) for j in range(n))
    if (any(x < 0 for x in point) or any(dot(row, point) > rhs for row, rhs in zip(a, b))
            or any(mu < 0 for mu in y) or any(x < c for x, c in zip(columns, objective))
            or dot(y, b) != value or tab[m][-1] != value):
        raise ArithmeticError("LP_PRIMAL_DUAL_IDENTITY_FAILURE")
    return {"status": "optimal", "point": tuple(point), "value": value,
            "multipliers": y, "pivots": pivots}


def strict_feasibility(a, b, guard=lambda: None):
    result = simplex(a, b, (F(0),) * 5 + (F(1),), guard)
    if result["status"] == "infeasible":
        return None, result["dual"]
    if result["value"] <= 0:
        cert = {"kind": "epsilon_bound", "multipliers": list(map(str, result["multipliers"]))}
        check_dual(a, b, cert)
        return None, cert
    return tuple(z - RANGE for z in result["point"][:5]), None


def square(row):
    return tuple(row[i] * row[j] * (1 if i == j else 2) for i, j in TERMS)


def polynomial(sample):
    walls = wall_inventory()
    x = tuple(sample) + (F(1),)
    if any(dot(w, x) == 0 for w in walls):
        raise ValueError("POLYNOMIAL_SAMPLE_NOT_GENERIC")
    result = [F(3) if pair == (5, 5) else F(0) for pair in TERMS]
    lines = endpoints()
    for (s, a, j, kind), (r, b, k, other) in combinations(lines, 2):
        if s == r:
            continue
        height = tuple((bv - av) / (s - r) for av, bv in zip(a, b))
        t = dot(height, x)
        if not 0 < t < 1:
            continue
        position = dot(a, x) + s * t
        covered = any(dot(c, x) + u * t < position < dot(c, x) + (u + 1) * t
                      for u, c, ell, tag in lines if tag == "L" and ell not in (j, k))
        if covered:
            continue
        delta = (1 if kind == other else -1) * abs(s - r)
        one_minus_height = tuple(-v for v in height[:5]) + (1 - height[5],)
        result = [v + F(delta, 2) * q for v, q in zip(result, square(one_minus_height))]
    return tuple(result)


def derivatives(poly):
    h = [[F(0)] * 5 for _ in range(5)]
    linear = [F(0)] * 5
    for coefficient, (i, j) in zip(poly, TERMS):
        if i == j and i < 5:
            h[i][i] += 2 * coefficient
        elif j < 5:
            h[i][j] += coefficient
            h[j][i] += coefficient
        elif i < 5:
            linear[i] += coefficient
    return tuple(tuple(row) for row in h), tuple(linear)


def eliminate(matrix, rhs, width=5):
    work = [[F(x) for x in row] + [F(v)] for row, v in zip(matrix, rhs)]
    pivots, row = [], 0
    for col in range(width):
        pivot = next((i for i in range(row, len(work)) if work[i][col]), None)
        if pivot is None:
            continue
        work[row], work[pivot] = work[pivot], work[row]
        scale = work[row][col]
        work[row] = [x / scale for x in work[row]]
        for i in range(len(work)):
            if i != row and work[i][col]:
                multiplier = work[i][col]
                work[i] = [a - multiplier * b for a, b in zip(work[i], work[row])]
        pivots.append(col)
        row += 1
    if any(not any(r[:width]) and r[-1] for r in work):
        return None
    point = [F(0)] * width
    for r, col in enumerate(pivots):
        point[col] = work[r][-1]
    null = []
    for col in range(width):
        if col not in pivots:
            direction = [F(0)] * width
            direction[col] = F(1)
            for r, pivot in enumerate(pivots):
                direction[pivot] = -work[r][col]
            null.append(tuple(direction))
    return tuple(point), tuple(null)


def evaluate(poly, point):
    z = tuple(point) + (F(1),)
    return sum((c * z[i] * z[j] for c, (i, j) in zip(poly, TERMS)), F(0))


def stationary_record(poly, word, path, walls, guard):
    h, linear = derivatives(poly)
    solution = eliminate(h, tuple(-x for x in linear))
    if solution is None:
        return {"kind": "inconsistent"}
    point, null = solution
    value = evaluate(poly, point)
    result = {"kind": "safe" if value >= TARGET else "unsafe_empty",
              "particular": list(map(str, point)), "nullspace": [list(map(str, d)) for d in null],
              "value": str(value)}
    if value < TARGET:
        equalities = tuple(row + (v,) for row, v in zip(h, linear))
        a, b = lp_rows(word, path, walls, False, equalities)
        feasible, certificate = strict_feasibility(a, b, guard)
        if certificate:
            result["dual"] = certificate
        else:
            # Not inferred from polynomial or a particular point. Both immutable
            # exact physical-area algorithms must confirm this unexpected witness.
            sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tip098"))
            from kakeya_exact import area_affine, area_trapezoid
            offsets = tuple(p / 6 for p in feasible) + (F(0),)
            first, second = area_trapezoid(offsets), area_affine(offsets)
            guard()
            if first != second or 6 * first != value or first >= F(20, 93):
                raise ArithmeticError("UNSAFE_STATIONARY_WITNESS_AREA_MISMATCH")
            result.update({"kind": "witness", "witness_p": list(map(str, feasible)),
                           "area_trapezoid": str(first), "area_affine": str(second)})
    return result


def fresh_state():
    return {"schema": SCHEMA, "status": "INCOMPLETE", "model": model(),
            "roots": [{"word": list(w), "node": i} for i, w in enumerate(words())],
            "nodes": [{"kind": "pending"} for _ in words()], "run_history": []}


def pending_paths(state, verify_terminal=True, guard=lambda: None):
    if state.get("schema") != SCHEMA or state.get("model") != model():
        raise ValueError("RESUME_MODEL_MISMATCH")
    roots, nodes, seen, queue = state["roots"], state["nodes"], set(), []
    if [r["word"] for r in roots] != [list(w) for w in words()]:
        raise ValueError("RESUME_ROOT_INVENTORY_MISMATCH")
    walls = wall_inventory()
    stack = [(r["node"], tuple(r["word"]), ()) for r in reversed(roots)]
    while stack:
        guard()
        ident, word, path = stack.pop()
        if type(ident) is not int or not 0 <= ident < len(nodes) or ident in seen:
            raise ValueError("RESUME_INVALID_TREE")
        seen.add(ident)
        node = nodes[ident]
        kind = node["kind"]
        if kind == "pending":
            queue.append((ident, word, path))
        elif kind == "split":
            if node["wall"] != len(path) or len(path) >= len(walls) or node["minus"] == node["plus"]:
                raise ValueError("RESUME_INVALID_SPLIT")
            stack.extend(((node["plus"], word, path + ((len(path), 1),)),
                          (node["minus"], word, path + ((len(path), -1),))))
        elif kind == "empty":
            if verify_terminal:
                check_dual(*lp_rows(word, path, walls, True), node["dual"])
        elif kind == "stationary":
            if len(path) != len(walls):
                raise ValueError("RESUME_SHALLOW_STATIONARY")
            if verify_terminal:
                sample = tuple(F(x) for x in node["sample"])
                poly = tuple(F(x) for x in node["polynomial"])
                if polynomial(sample) != poly or any(dot(row, sample + (F(1),)) <= 0
                        for row, _ in root_rows(word) + [(tuple(sign * x for x in walls[i]), True) for i, sign in path]):
                    raise ValueError("RESUME_POLYNOMIAL_SAMPLE_FAILURE")
                h, linear = derivatives(poly)
                solution = eliminate(h, tuple(-x for x in linear))
                record = node["stationary"]
                if solution is None:
                    if record != {"kind": "inconsistent"}:
                        raise ValueError("RESUME_INCONSISTENT_FAILURE")
                else:
                    point, null = solution
                    value = evaluate(poly, point)
                    if (record.get("particular") != list(map(str, point))
                            or record.get("nullspace") != [list(map(str, d)) for d in null]
                            or record.get("value") != str(value)):
                        raise ValueError("RESUME_STATIONARY_FAILURE")
                    if value >= TARGET:
                        if record["kind"] != "safe":
                            raise ValueError("RESUME_UNSAFE_STATUS")
                    else:
                        if record["kind"] != "unsafe_empty":
                            raise ValueError("RESUME_WITNESS_NOT_ALLOWED")
                        equalities = tuple(row + (v,) for row, v in zip(h, linear))
                        check_dual(*lp_rows(word, path, walls, False, equalities), record["dual"])
        else:
            raise ValueError("RESUME_UNKNOWN_NODE")
    if len(seen) != len(nodes):
        raise ValueError("RESUME_UNREACHABLE_NODES")
    return sorted(queue, key=lambda item: (len(item[2]), item[0]))


def produce(state, seconds=5, max_nodes=16):
    start = time.monotonic()
    def guard():
        if time.monotonic() - start >= seconds:
            raise TimeoutError("TIME_CAP")
        peak = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        # Cooperative measured-peak refusal at512MiB, not hard OS containment.
        # It is stricter than the1GiB process ceiling; production peak behavior
        # remains to be qualified rather than guaranteed by this label.
        if (peak if sys.platform == "darwin" else peak * 1024) > 512 * 1024 ** 2:
            raise MemoryError("STATE_RSS_CAP")
        if len(state["nodes"]) > 1000000:
            raise MemoryError("STATE_NODE_CAP")
    processed, reason = 0, None
    try:
        queue = pending_paths(state, guard=guard)
        history = state["run_history"]
        if (not isinstance(history, list)
                or any(type(entry.get("processed_this_run")) is not int
                       or entry["processed_this_run"] < 0 for entry in history)
                or sum(entry["processed_this_run"] for entry in history)
                   != sum(node["kind"] != "pending" for node in state["nodes"])):
            raise ValueError("RESUME_HISTORY_COUNT_MISMATCH")
        walls = wall_inventory()
        wire_size = len(json.dumps(state["model"])) + len(json.dumps(state["roots"]))
        for old in state["nodes"]:
            guard()
            wire_size += len(json.dumps(old, separators=(",", ":"))) + 1
        position = 0
        while position < len(queue):
            guard()
            if processed >= max_nodes:
                raise TimeoutError("NODE_CAP")
            ident, word, path = queue[position]
            a, b = lp_rows(word, path, walls, True)
            sample, certificate = strict_feasibility(a, b, guard)
            if certificate:
                node = {"kind": "empty", "dual": certificate}
            elif len(path) < len(walls):
                child = len(state["nodes"])
                node = {"kind": "split", "wall": len(path), "minus": child, "plus": child + 1}
            else:
                poly = polynomial(sample)
                record = stationary_record(poly, word, path, walls, guard)
                node = {"kind": "stationary", "sample": list(map(str, sample)),
                        "polynomial": list(map(str, poly)), "stationary": record}
            guard()
            additional = len(json.dumps(node, separators=(",", ":"))) - len('{"kind":"pending"}')
            if node["kind"] == "split":
                additional += 2 * (len('{"kind":"pending"}') + 1)
            if wire_size + additional > 64 * 1024 ** 2 - 128 * 1024:
                raise MemoryError("EVIDENCE_CAP")
            # An outer signal between child allocation and parent replacement
            # must not strand unreachable children in the resumable state.
            old_size = len(state["nodes"])
            old_processed = processed
            try:
                if node["kind"] == "split":
                    state["nodes"].extend(({"kind": "pending"}, {"kind": "pending"}))
                state["nodes"][ident] = node
                processed += 1
            except BaseException:
                state["nodes"][ident] = {"kind": "pending"}
                del state["nodes"][old_size:]
                processed = old_processed
                raise
            wire_size += additional
            if node["kind"] == "split":
                queue.extend(((child, word, path + ((len(path), -1),)),
                              (child + 1, word, path + ((len(path), 1),))))
            position += 1
            if node["kind"] == "stationary" and node["stationary"]["kind"] == "witness":
                state["status"] = "WITNESS"
                reason = "EXACT_SMALLER_WITNESS"
                break
    except (TimeoutError, MemoryError) as exc:
        reason = str(exc)
        state["status"] = "INCOMPLETE"
    except (ArithmeticError, ValueError, KeyError, TypeError, IndexError, RuntimeError) as exc:
        reason = str(exc)
        state["status"] = "REFUSED"
    pending = sum(n["kind"] == "pending" for n in state["nodes"])
    if state["status"] not in ("WITNESS", "REFUSED"):
        state["status"] = "COMPLETE" if pending == 0 and reason is None else "INCOMPLETE"
    elapsed = time.monotonic() - start
    state["limits"] = {"max_nodes": max_nodes, "max_seconds": format(seconds, ".9f"),
                       "rss_bytes": 1024 ** 3, "evidence_bytes": 64 * 1024 ** 2,
                       "state_bytes": 512 * 1024 ** 2}
    state["stats"] = {"created_nodes": len(state["nodes"]), "processed_nodes": len(state["nodes"]) - pending,
                      "pending_nodes": pending, "splits": sum(n["kind"] == "split" for n in state["nodes"]),
                      "empty_leaves": sum(n["kind"] == "empty" for n in state["nodes"]),
                      "stationary_leaves": sum(n["kind"] == "stationary" for n in state["nodes"]),
                      "processed_this_run": processed, "elapsed_seconds": format(elapsed, ".9f"), "reason": reason}
    state.setdefault("run_history", []).append({
        "elapsed_seconds": format(elapsed, ".9f"), "processed_this_run": processed,
        "reason": reason, "status": state["status"], "max_seconds": format(seconds, ".9f"),
        "max_nodes": max_nodes})
    return state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seconds", type=float, required=True)
    parser.add_argument("--max-nodes", type=int, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--resume", type=Path)
    args = parser.parse_args()
    if not 0 < args.seconds <= 28 or not 1 <= args.max_nodes <= 1000000 or args.out.exists():
        parser.error("create-only output;seconds(0,28];nodes1..1000000")
    def expired(signum, frame):
        raise TimeoutError("OUTER_TIME_CAP")
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(ceil(args.seconds) + 2)
    if args.resume:
        if args.resume.stat().st_size > 64 * 1024 ** 2:
            parser.error("resume evidence cap")
        state = json.loads(args.resume.read_text())
        if state.get("status") != "INCOMPLETE":
            parser.error("only INCOMPLETE state can resume")
    else:
        state = fresh_state()
    result = produce(state, args.seconds, args.max_nodes)
    encoded = json.dumps(result, sort_keys=True, separators=(",", ":")) + "\n"
    if len(encoded.encode()) > 64 * 1024 ** 2:
        raise SystemExit("EVIDENCE_CAP_REFUSED_NO_COMPLETE_OUTPUT")
    with args.out.open("x", encoding="utf-8") as output:
        output.write(encoded)
    signal.alarm(0)
    print(json.dumps({"status": result["status"], "stats": result["stats"]}, sort_keys=True))
    raise SystemExit(0 if result["status"] == "COMPLETE" else 3)


if __name__ == "__main__":
    main()
