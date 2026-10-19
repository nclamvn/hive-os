#!/usr/bin/env python3
"""TIP-097: exact finite decomposition checks, not a universal theorem prover.

For e=e_u, a^T Q(e-a)>=0 iff (2a-e)^T Q(2a-e)<=Q[u,u].
For positive definite Q, Cauchy-Schwarz in the Q inner product gives
t_i^2 <= (t^T Q t)(Q^{-1})[i,i]. Thus the rational inverse gives a
complete finite coordinate box. No truncated box is called exhaustive.
"""

import argparse
from fractions import Fraction as F
from itertools import combinations, product
import json
from math import isqrt, prod
import signal
import time

MAX_POINTS = 1_000_000


class Refused(ValueError):
    pass


def matrix(weights, edges):
    if not 1 <= len(weights) <= 8:
        raise Refused("VERTEX_LIMIT")
    if any(type(w) is not int or not 1 <= w <= 8 for w in weights):
        raise Refused("WEIGHT_LIMIT")
    n = len(weights)
    seen = set()
    adjacency = [set() for _ in weights]
    q = [[weights[i] if i == j else 0 for j in range(n)] for i in range(n)]
    for edge in edges:
        if len(edge) != 2 or any(type(v) is not int for v in edge):
            raise Refused("INVALID_EDGE")
        i, j = edge
        if i == j or not (0 <= i < n and 0 <= j < n):
            raise Refused("INVALID_EDGE")
        key = tuple(sorted(edge))
        if key in seen:
            raise Refused("DUPLICATE_EDGE")
        seen.add(key)
        adjacency[i].add(j)
        adjacency[j].add(i)
        q[i][j] = q[j][i] = -1
    visited = {0}
    frontier = [0]
    while frontier:
        for j in adjacency[frontier.pop()]:
            if j not in visited:
                visited.add(j)
                frontier.append(j)
    if len(visited) != n:
        raise Refused("DISCONNECTED")
    if len(edges) != n - 1:
        raise Refused("NOT_ACYCLIC")
    bad = [i for i, w in enumerate(weights) if w < len(adjacency[i])]
    return q, bad


def determinant(q):
    """Exact Gaussian determinant, independent of LDL implementation."""
    a = [[F(x) for x in row] for row in q]
    result = F(1)
    for k in range(len(a)):
        pivot = next((i for i in range(k, len(a)) if a[i][k]), None)
        if pivot is None:
            return F(0)
        if pivot != k:
            a[pivot], a[k] = a[k], a[pivot]
            result = -result
        p = a[k][k]
        result *= p
        for i in range(k + 1, len(a)):
            factor = a[i][k] / p
            for j in range(k + 1, len(a)):
                a[i][j] -= factor * a[k][j]
    return result


def ldl_positive(q):
    n = len(q)
    lower = [[F(i == j) for j in range(n)] for i in range(n)]
    diagonal = []
    for i in range(n):
        d = F(q[i][i]) - sum(lower[i][k] ** 2 * diagonal[k] for k in range(i))
        if d <= 0:
            return False, diagonal + [d]
        diagonal.append(d)
        for j in range(i + 1, n):
            lower[j][i] = (F(q[j][i]) - sum(
                lower[j][k] * lower[i][k] * diagonal[k] for k in range(i))) / d
    # Reconstruct to guard an implementation error in this independent check.
    assert all(F(q[i][j]) == sum(lower[i][k] * diagonal[k] * lower[j][k]
                                for k in range(n)) for i in range(n) for j in range(n))
    return True, diagonal


def inverse(q):
    n = len(q)
    a = [[F(x) for x in q[i]] + [F(i == j) for j in range(n)] for i in range(n)]
    for k in range(n):
        p = a[k][k]
        assert p  # Positive definite leading principal minors imply no swaps needed.
        a[k] = [x / p for x in a[k]]
        for i in range(n):
            if i != k:
                factor = a[i][k]
                a[i] = [x - factor * y for x, y in zip(a[i], a[k])]
    inv = [row[n:] for row in a]
    assert all(sum(q[i][k] * inv[k][j] for k in range(n)) == (i == j)
               for i in range(n) for j in range(n))
    return inv


def bilinear(q, a, b):
    return sum(a[i] * q[i][j] * b[j] for i in range(len(q)) for j in range(len(q)))


def theorem_assisted_choice(weights, edges):
    """Source-assisted mathematical selector, not universal machine certification."""
    q, bad = matrix(weights, edges)
    if len(bad) != 1:
        raise Refused("UNIQUE_BAD_REQUIRED")
    pd, _ = ldl_positive(q)
    leading = [determinant([row[:k] for row in q[:k]]) for k in range(1, len(q) + 1)]
    assert pd == all(d > 0 for d in leading)
    if not pd:
        raise Refused("NOT_POSITIVE_DEFINITE")
    ones = [i for i, w in enumerate(weights) if w == 1]
    selected = ones[0] if ones else bad[0]
    return {"selected_vertex": selected,
            "reason": "NORM_ONE" if ones else "ONE_BAD_TREE_DUAL_LEMMA",
            "source_assisted_mathematical_selection": True,
            "machine_certified_universal_theorem": False}


def check(weights, edges, require_unique_bad=True, max_points=MAX_POINTS):
    q, bad = matrix(weights, edges)
    if require_unique_bad and len(bad) != 1:
        raise Refused("UNIQUE_BAD_REQUIRED")
    leading = [determinant([row[:k] for row in q[:k]]) for k in range(1, len(q) + 1)]
    pd, pivots = ldl_positive(q)
    assert pd == all(d > 0 for d in leading)
    if not pd:
        raise Refused("NOT_POSITIVE_DEFINITE")
    inv = inverse(q)
    n = len(q)
    boxes = []
    for u in range(n):
        # r=floor(sqrt(w_u inv_ii)); rational arithmetic, no floating point.
        radius = [isqrt((weights[u] * inv[i][i]).numerator //
                        (weights[u] * inv[i][i]).denominator) for i in range(n)]
        bounds = [(-((r - int(i == u)) // 2), (r + int(i == u)) // 2)
                  for i, r in enumerate(radius)]
        count = prod(hi - lo + 1 for lo, hi in bounds)
        boxes.append((bounds, count))
    total = sum(count for _, count in boxes)
    if total > min(max_points, MAX_POINTS):
        raise Refused(f"EXCESSIVE_COMPLETE_BOX:{total}")
    vertices = []
    for u, (bounds, count) in enumerate(boxes):
        e = tuple(int(i == u) for i in range(n))
        witnesses = []
        decompositions = outside_binary = tested = ellipsoid = 0
        for a in product(*(range(lo, hi + 1) for lo, hi in bounds)):
            tested += 1
            t = tuple(2 * a[i] - e[i] for i in range(n))
            value = bilinear(q, t, t)
            if value > weights[u]:
                continue
            ellipsoid += 1
            b = tuple(e[i] - a[i] for i in range(n))
            inner = bilinear(q, a, b)
            assert 4 * inner == weights[u] - value
            if not any(a) or not any(b):
                continue
            assert inner >= 0
            decompositions += 1
            outside_binary += any(x not in (0, 1) for x in a)
            if len(witnesses) < 4:
                witnesses.append({"a": a, "b": b, "inner": inner,
                                  "norm_a": bilinear(q, a, a),
                                  "norm_b": bilinear(q, b, b)})
        assert tested == count
        vertices.append({"vertex": u, "box": bounds, "box_points": count,
                         "tested": tested, "ellipsoid_points": ellipsoid,
                         "ordered_decompositions": decompositions,
                         "outside_binary": outside_binary,
                         "irreducible": decompositions == 0, "witnesses": witnesses})
    return {"weights": weights, "edges": edges, "bad_vertices": bad,
            "root_admissible": len(bad) == 1, "leading_minors": list(map(str, leading)),
            "ldl_pivots": list(map(str, pivots)),
            "inverse_diagonal": [str(inv[i][i]) for i in range(n)],
            "complete_box_points": total, "vertices": vertices,
            "irreducible_vertices": [v["vertex"] for v in vertices if v["irreducible"]]}


def self_test():
    results = []
    for name, weights, edges, required, expected in [
        ("reducible_control", [1, 2], [[0, 1]], False, [0]),
        ("norm1_control", [1], [], False, [0]),
        ("norm2_control", [2], [], False, [0]),
        ("A2_control", [2, 2], [[0, 1]], False, [0, 1]),
        ("chain_213", [2, 1, 3], [[0, 1], [1, 2]], True, None),
        ("star_2_222", [2, 2, 2, 2], [[0, 1], [0, 2], [0, 3]], True, None),
        ("star_2_234", [2, 2, 3, 4], [[0, 1], [0, 2], [0, 3]], True, None),
        ("star_3_3333", [3, 3, 3, 3, 3], [[0, 1], [0, 2], [0, 3], [0, 4]], True, None),
        ("chain_4122", [4, 1, 2, 2], [[0, 1], [1, 2], [2, 3]], True, None),
        ("bad_root_reducible_control", [2, 1, 3, 3],
         [[0, 1], [0, 2], [0, 3]], True, [1]),
    ]:
        r = check(weights, edges, required)
        if expected is not None:
            assert r["irreducible_vertices"] == expected, name
        if required:
            assert r["irreducible_vertices"], name
            choice = theorem_assisted_choice(weights, edges)
            assert r["vertices"][choice["selected_vertex"]]["irreducible"], (name, choice)
            r["final_proof_selection"] = choice
        results.append({"name": name, "result": r})
    refusals = []
    for name, weights, edges, required, limit, expected in [
        ("semidefinite", [1, 1], [[0, 1]], False, MAX_POINTS, "NOT_POSITIVE_DEFINITE"),
        ("indefinite", [1, 1, 1], [[0, 1], [1, 2]], True, MAX_POINTS, "NOT_POSITIVE_DEFINITE"),
        ("no_bad", [2, 2], [[0, 1]], True, MAX_POINTS, "UNIQUE_BAD_REQUIRED"),
        ("two_bad", [2, 1, 1, 2], [[0, 1], [1, 2], [2, 3]], True, MAX_POINTS, "UNIQUE_BAD_REQUIRED"),
        ("disconnected", [2, 2, 2], [[0, 1]], False, MAX_POINTS, "DISCONNECTED"),
        ("cycle", [3, 3, 3], [[0, 1], [1, 2], [2, 0]], False, MAX_POINTS, "NOT_ACYCLIC"),
        ("duplicate", [2, 2], [[0, 1], [1, 0]], False, MAX_POINTS, "DUPLICATE_EDGE"),
        ("weight_limit", [9], [], False, MAX_POINTS, "WEIGHT_LIMIT"),
        ("vertex_limit", [2] * 9, [], False, MAX_POINTS, "VERTEX_LIMIT"),
        ("work_limit", [2, 2, 2, 2], [[0, 1], [0, 2], [0, 3]], True, 1, "EXCESSIVE_COMPLETE_BOX"),
    ]:
        try:
            check(weights, edges, required, limit)
        except Refused as error:
            assert str(error).startswith(expected), (name, error)
            refusals.append({"name": name, "refusal": str(error)})
        else:
            raise AssertionError(f"Expected refusal: {name}")
    # Direct mechanics identity independent of enumerator filtering.
    q = [[1, -1], [-1, 2]]
    assert bilinear(q, [1, 1], [-1, 0]) == 0
    forests = forest_controls()
    return {"checks_passed": len(results) + len(refusals) + 1 + forests["checks_passed"],
            "complete_examples": results, "negative_controls": refusals,
            "forest_controls": forests}


def components(node_count, graph_edges, edge_ids, omitted_vertex=None):
    """Connected components with labeled parallel edges kept distinct."""
    adjacency = [set() for _ in range(node_count)]
    for k in edge_ids:
        i, j = graph_edges[k]
        if omitted_vertex not in (i, j):
            adjacency[i].add(j)
            adjacency[j].add(i)
    unseen = set(range(node_count)) - {omitted_vertex}
    result = []
    while unseen:
        first = min(unseen)
        unseen.remove(first)
        found, frontier = {first}, [first]
        while frontier:
            for j in adjacency[frontier.pop()]:
                if j in unseen:
                    unseen.remove(j)
                    found.add(j)
                    frontier.append(j)
        result.append(found)
    return result


def selected_cut(n, graph_edges, tree, s, z):
    """Delete the first labeled incident edge with nonzero component sum."""
    extended = tuple(z) + (-sum(z),)
    pieces = components(n + 1, graph_edges, tree, omitted_vertex=s)
    assert sum(sum(extended[i] for i in piece) for piece in pieces) == -z[s]
    for k in sorted(tree):
        i, j = graph_edges[k]
        if s not in (i, j):
            continue
        neighbor = j if i == s else i
        piece = next(piece for piece in pieces if neighbor in piece)
        value = sum(extended[i] for i in piece)
        if value:
            return frozenset(set(tree) - {k}), k, value
    raise AssertionError("Nonzero z_s requires a nonzero component sum")


def check_forest_graph(weights, edges, s):
    """Finite identity/injection control for a no-bad weighted source tree."""
    q, bad = matrix(weights, edges)
    n = len(q)
    if n > 4:
        raise Refused("FOREST_VERTEX_LIMIT")
    if bad:
        raise Refused("FOREST_NO_BAD_REQUIRED")
    degree = [sum(i in edge for edge in edges) for i in range(n)]
    delta = [weights[i] - degree[i] for i in range(n)]
    if not 0 <= s < n or delta[s] <= 0:
        raise Refused("FOREST_DISTINGUISHED_SURPLUS_REQUIRED")
    graph_edges = [tuple(edge) for edge in edges]
    distinguished = None
    for i, count in enumerate(delta):
        for _ in range(count):
            if i == s and distinguished is None:
                distinguished = len(graph_edges)
            graph_edges.append((i, n))
    m = len(graph_edges)
    if m > 10:
        raise Refused("FOREST_EDGE_LIMIT")
    # No more than 2^10 labeled edge subsets are available. Only two sizes
    # (n for spanning trees, n-1 for two-component forests) are enumerated.
    incidence = [[int(i == a) - int(i == b) for i in range(n)]
                 for a, b in graph_edges]
    gram = [[sum(row[i] * row[j] for row in incidence) for j in range(n)]
            for i in range(n)]
    assert gram == q
    pd, _ = ldl_positive(q)
    assert pd
    inv = inverse(q)
    trees = [frozenset(ids) for ids in combinations(range(m), n)
             if len(components(n + 1, graph_edges, ids)) == 1]
    forests = [frozenset(ids) for ids in combinations(range(m), n - 1)
               if len(components(n + 1, graph_edges, ids)) == 2]
    tau = len(trees)
    containing = [tree for tree in trees if distinguished in tree]
    tau_e = len(containing)
    assert tau == determinant(q)
    assert F(tau_e, tau) == inv[s][s]
    identity_tests = injection_tests = 0
    for z in product([-1, 0, 1], repeat=n):
        lhs = bilinear(inv, z, z)
        forest_sum = 0
        for forest in forests:
            pieces = components(n + 1, graph_edges, forest)
            nonground = next(piece for piece in pieces if n not in piece)
            forest_sum += sum(z[i] for i in nonground) ** 2
        assert lhs == F(forest_sum, tau), (weights, z, lhs, forest_sum, tau)
        identity_tests += 1
        if z[s] == 0:
            continue
        image = set()
        for tree in containing:
            forest, deleted, component_sum = selected_cut(n, graph_edges, tree, s, z)
            assert component_sum != 0
            assert forest in forests
            if distinguished not in forest:
                restored = distinguished
            else:
                pieces = components(n + 1, graph_edges, forest)
                ground_piece = next(piece for piece in pieces if n in piece)
                assert s in ground_piece
                other = next(piece for piece in pieces if n not in piece)
                possible = [k for k in range(len(edges))
                            if s in graph_edges[k]
                            and (graph_edges[k][1] if graph_edges[k][0] == s
                                 else graph_edges[k][0]) in other]
                assert len(possible) == 1
                restored = possible[0]
            assert restored == deleted
            assert frozenset(set(forest) | {restored}) == tree
            assert forest not in image, (weights, z, forest)
            image.add(forest)
            injection_tests += 1
    return {"weights": weights, "edges": edges, "s": s, "delta": delta,
            "labeled_apex_edges": graph_edges, "distinguished_edge": distinguished,
            "tau": tau, "tau_e": tau_e, "inverse_ss": str(inv[s][s]),
            "two_component_forests": len(forests),
            "scalar_identity_tests": identity_tests,
            "selected_cut_and_recovery_tests": injection_tests,
            "subset_ceiling": 2 ** m}


def forest_controls():
    positives = [check_forest_graph(weights, edges, s) for weights, edges, s in [
        ([2], [], 0),
        ([2, 2], [[0, 1]], 0),
        ([3, 2, 2], [[0, 1], [1, 2]], 0),
        ([3, 2, 2], [[0, 1], [0, 2]], 0),
    ]]
    # Removing the source-tree premise really can break injection. Source
    # triangle edges0=01,1=12,2=02; labeled apex edge3=0-ground. Two different
    # spanning trees cut to the same forest for z=(1,1,0). This does not refute
    # the general forest identity, only the source-tree-specific injection.
    triangle = [(0, 1), (1, 2), (0, 2), (0, 3)]
    z = (1, 1, 0)
    first, second = frozenset([0, 1, 3]), frozenset([1, 2, 3])
    assert len(components(4, triangle, first)) == 1
    assert len(components(4, triangle, second)) == 1
    image1, cut1, sum1 = selected_cut(3, triangle, first, 0, z)
    image2, cut2, sum2 = selected_cut(3, triangle, second, 0, z)
    assert first != second and image1 == image2 == frozenset([1, 3])
    assert cut1 == 0 and cut2 == 2 and sum1 == sum2 == 1
    return {"checks_passed": len(positives) + 1, "positive_graphs": positives,
            "source_cycle_negative_control": {
                "graph_edges": triangle, "z": z, "s": 0,
                "tree1": sorted(first), "tree2": sorted(second),
                "common_forest": sorted(image1), "deleted_edges": [cut1, cut2],
                "nonzero_component_sums": [sum1, sum2],
                "conclusion": "injection fails without source-tree premise"}}


def candidate_sample():
    """Fixed tiny families testing Main's candidate; this is not a proof."""
    cases = []
    # Star centers are bad; all other vertices automatically good.
    for n, centers, leaves in [(4, [2], [2, 3, 4]),
                               (5, [2, 3], [2, 3]),
                               (6, [2, 3, 4], [2, 3])]:
        for center in centers:
            for tail in product(leaves, repeat=n - 1):
                cases.append(([center, *tail], [[0, i] for i in range(1, n)]))
    # A branched tree with two length-two arms and one length-one arm.
    edges = [[0, 1], [1, 2], [0, 3], [3, 4], [0, 5]]
    for tail in product([2, 3], repeat=5):
        cases.append(([2, *tail], edges))
    complete = []
    refused = []
    counterexamples = []
    total_points = 0
    for weights, edges in cases:
        try:
            result = check(weights, edges)
        except Refused as error:
            refused.append({"weights": weights, "edges": edges, "reason": str(error)})
            continue
        total_points += result["complete_box_points"]
        bad = result["bad_vertices"][0]
        root_irreducible = result["vertices"][bad]["irreducible"]
        assert result["irreducible_vertices"], result
        choice = theorem_assisted_choice(weights, edges)
        assert result["vertices"][choice["selected_vertex"]]["irreducible"], choice
        summary = {"weights": weights, "edges": edges,
                   "complete_box_points": result["complete_box_points"],
                   "irreducible_vertices": result["irreducible_vertices"],
                   "bad_vertex_irreducible": root_irreducible,
                   "final_proof_selection": choice}
        complete.append(summary)
        if not root_irreducible:
            counterexamples.append(result)
    return {"claim_tested": "Main's source-assisted final proof candidate selector (finite checks only)",
            "generated_cases": len(cases), "complete_count": len(complete),
            "refused_count": len(refused), "complete_box_points": total_points,
            "counterexamples": counterexamples, "complete_cases": complete,
            "refused_cases": refused}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--candidate-sample", action="store_true")
    parser.add_argument("--weights", help="JSON integer list")
    parser.add_argument("--edges", help="JSON edge list")
    parser.add_argument("--allow-nonroot", action="store_true", help="mechanics controls only")
    args = parser.parse_args()
    started = time.monotonic()
    def timeout(_signum, _frame):
        raise Refused("INVOCATION_TIME_LIMIT")
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(55)
    try:
        if args.self_test:
            result = self_test()
        elif args.candidate_sample:
            result = candidate_sample()
        else:
            if args.weights is None or args.edges is None:
                parser.error("--weights and --edges required unless --self-test")
            result = check(json.loads(args.weights), json.loads(args.edges), not args.allow_nonroot)
        print(json.dumps({"status": "COMPLETE_FINITE", "seconds": time.monotonic() - started,
                          "result": result}, indent=2))
    except Refused as error:
        print(json.dumps({"status": "REFUSED_NO_COMPLETENESS_CLAIM", "reason": str(error),
                          "seconds": time.monotonic() - started}))
        return 2
    finally:
        signal.alarm(0)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
