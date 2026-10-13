#!/usr/bin/env python3
"""Independent TIP108C checker; no producer imports, no generation/search.

The mathematical assertion is scoped to the retained near two-group domain.
Midpoint-affine integration is independent of producer endpoint trapezoids.
"""
from __future__ import annotations

import argparse
from collections import Counter
from fractions import Fraction
import json
import math
from pathlib import Path
import signal
import time

MAX_NODES = 131072
MAX_DEPTH = 48
MAX_BYTES = 16 * 1024 * 1024
SCHEMA = "TIP108C_CORE_TREE_V1"


class Refusal(ValueError):
    """A malformed, incomplete, or mathematically invalid certificate."""


def demand(condition, message):
    if not condition:
        raise Refusal(message)


def integer(value):
    return type(value) is int


def signatures():
    """Reconstruct retained oriented label sets, without a producer list."""
    result = []
    for mask in range(1, 63):
        left = tuple(j for j in range(1, 7) if mask & (1 << (j - 1)))
        right = tuple(j for j in range(1, 7) if j not in left)
        if len(left) not in (2, 3, 4):
            continue
        if max(left) - min(right) < 2:
            continue
        if 1 in left and len(left) < 3:
            continue
        if 6 in right and len(right) < 3:
            continue
        if len(left) == 3 and left in ((1, 4, 6), (1, 5, 6)):
            continue
        if len(right) == 3 and right in ((1, 2, 6), (1, 3, 6)):
            continue
        result.append((mask, left, right))
    demand(Counter(len(l) for _, l, _ in result) == {2: 10, 3: 14, 4: 10},
           "independent signature count")
    return result


def charts():
    result = [(mask, a, b) for mask, left, right in signatures()
              for a in left for b in right]
    demand(len(result) == 286, "independent chart count")
    return tuple(result)


ROOT_BOX = ((31, 75, 0),) + ((0, 18, 0),) * 4


def midpoint_children(box, axis):
    demand(integer(axis) and 0 <= axis < 5, "bad split axis")
    lo, hi, exponent = box[axis]
    demand(lo < hi, "split of zero-width coordinate")
    children = []
    for bounds in ((2 * lo, lo + hi, exponent + 1),
                   (lo + hi, 2 * hi, exponent + 1)):
        child = list(box)
        child[axis] = bounds
        children.append(tuple(child))
    return tuple(children)


def chart_bounds(chart, box):
    """Return all coupled marginal bounds in denominator Q=31*2^maxe.

    Coordinate zero is q; other coordinates are nonanchor labels ascending.
    Anchors are identically zero internal offsets, including at ties.
    """
    mask, anchor_left, anchor_right = chart
    demand(len(box) == 5, "box dimension")
    for triple in box:
        demand(len(triple) == 3 and all(integer(v) for v in triple), "box type")
        demand(triple[0] <= triple[1] and 0 <= triple[2] <= MAX_DEPTH,
               "box bounds/exponent")
    maximum = max(e for _, _, e in box)
    denominator = 31 << maximum
    scaled = [(lo << (maximum - e), hi << (maximum - e))
              for lo, hi, e in box]
    offsets = {anchor_left: (0, 0), anchor_right: (0, 0)}
    remaining = [j for j in range(1, 7) if j not in offsets]
    offsets.update(zip(remaining, scaled[1:]))
    left = [j for j in range(1, 7) if mask & (1 << (j - 1))]
    right = [j for j in range(1, 7) if j not in left]
    return denominator, scaled[0], offsets, left, right


def excluded(chart, box):
    denominator, (qlo, qhi), offsets, left, right = chart_bounds(chart, box)
    llo = max(offsets[j][0] for j in left)
    lhi = max(offsets[j][1] for j in left)
    rlo = max(offsets[j][0] for j in right)
    rhi = max(offsets[j][1] for j in right)
    if 31 * (llo + rlo) > 18 * denominator:
        return "S_lower>18/31"
    if 61 * (lhi + rhi) <= 18 * denominator:
        return "S_upper<=18/61"
    if qhi - llo <= denominator:
        return "d_upper<=1"
    if len(left) == 3:
        if 4 * (qlo - lhi) >= 7 * denominator:
            return "d_lower>=7/4"
    elif 31 * (qlo - lhi) >= 57 * denominator:
        return "d_lower>=57/31"
    return None


def core_integral(bounds, height_denominator):
    """Exact N/(7200 H^2), using affine unions at slab midpoints.

    Bounds are integer (lower, upper) shifted p intercepts in denominator H.
    In each open event slab the active intervals and endpoint order are fixed.
    An affine function's integral is slab width times its midpoint value.
    Doubled midpoint positions avoid all rational arithmetic in this routine.
    """
    demand(integer(height_denominator) and height_denominator > 0, "bad H")
    demand(len(bounds) == 6, "core count")
    ceiling = 60 * height_denominator
    pairs = []
    for j, (lower, upper) in enumerate(bounds, 1):
        demand(integer(lower) and integer(upper) and lower <= upper, "core bounds")
        pairs.append(((j, 60 * upper), (j - 1, 60 * (lower + height_denominator))))
    endpoints = [line for pair in pairs for line in pair]
    breaks = {0, ceiling}
    for index, (slope, intercept) in enumerate(endpoints):
        for other_slope, other_intercept in endpoints[:index]:
            difference = slope - other_slope
            if difference:
                numerator = other_intercept - intercept
                demand(numerator % difference == 0, "nonintegral event")
                crossing = numerator // difference
                if 0 < crossing < ceiling:
                    breaks.add(crossing)
    cuts = sorted(breaks)
    total = 0
    for a, b in zip(cuts, cuts[1:]):
        twice_midpoint = a + b
        intervals = []
        for left_law, right_law in pairs:
            left = left_law[0] * twice_midpoint + 2 * left_law[1]
            right = right_law[0] * twice_midpoint + 2 * right_law[1]
            if right > left:  # Death/inverted cores are genuinely absent.
                intervals.append((left, right))
        intervals.sort()
        twice_length = 0
        start = end = None
        for left, right in intervals:
            if start is None:
                start, end = left, right
            elif left > end:
                twice_length += end - start
                start, end = left, right
            elif right > end:
                end = right
        if start is not None:
            twice_length += end - start
        total += (b - a) * twice_length
    return total, height_denominator, len(cuts)


def positive(chart, box):
    denominator, (qlo, qhi), offsets, left, right = chart_bounds(chart, box)
    shifted = []
    for j in range(1, 7):
        lo, hi = offsets[j]
        if j in left:
            shifted.append((2 * lo - qhi, 2 * hi - qlo))
        else:
            shifted.append((2 * lo + qlo, 2 * hi + qhi))
    h = 2 * denominator
    n, _, _ = core_integral(shifted, h)
    upper_s = min(18 * (denominator // 31),
                  max(offsets[j][1] for j in left) + max(offsets[j][1] for j in right))
    # S_upper=upper_s/Q=2 upper_s/H. Hence positive numerator below.
    residual = n - 7200 * h * (h + upper_s)
    return residual > 0, residual, h


def verify_tree(chart, tree, counts, node_limit=MAX_NODES, initial_box=ROOT_BOX):
    demand(type(tree) is str and len(tree) <= MAX_NODES, "tree type/size")
    # Explicit initial_box is for isolated controls only. The wire verifier
    # always invokes this with ROOT_BOX; no supplied root box is accepted.
    stack = [(initial_box, 0)]
    cursor = 0
    while stack:
        demand(cursor < len(tree), "missing child/frontier")
        box, depth = stack.pop()
        symbol = tree[cursor]
        cursor += 1
        counts["nodes"] += 1
        demand(counts["nodes"] <= node_limit, "node cap")
        demand(depth <= MAX_DEPTH, "depth cap")
        counts["max_depth"] = max(counts["max_depth"], depth)
        if symbol in "01234":
            demand(depth < MAX_DEPTH, "split beyond depth cap")
            first, second = midpoint_children(box, int(symbol))
            stack.append((second, depth + 1))
            stack.append((first, depth + 1))
            counts["splits"] += 1
        elif symbol == "P":
            demand(positive(chart, box)[0], "forged/nonpositive core leaf")
            counts["positive"] += 1
        elif symbol == "X":
            demand(excluded(chart, box) is not None, "unsound excluded leaf")
            counts["excluded"] += 1
        elif symbol == "O":
            raise Refusal("OPEN leaf is not proof")
        else:
            raise Refusal("corrupt preorder symbol")
    demand(cursor == len(tree), "extra subtree/trailing symbols")
    counts["roots"] += 1


def fresh_counts():
    return {key: 0 for key in ("nodes", "splits", "positive", "excluded", "roots", "max_depth")}


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        demand(key not in result, "duplicate JSON key")
        result[key] = value
    return result


def read_document(path):
    demand(Path(path).stat().st_size <= MAX_BYTES, "encoded-size cap")
    with open(path, "rb") as source:
        raw = source.read(MAX_BYTES + 1)
    demand(len(raw) <= MAX_BYTES, "encoded-size cap")
    # Bounded lexical preflight prevents a 16MiB hostile numeric-array/dict
    # payload from expanding into unbounded Python objects during JSON load.
    # Valid wire data has <4000 tokens and <=32768 preorder characters.
    index = tokens = depth = string_bytes = 0
    while index < len(raw):
        byte = raw[index]
        if byte in b" \t\r\n":
            index += 1
            continue
        tokens += 1
        demand(tokens <= 10000, "JSON token cap")
        if byte == 34:
            start = index
            index += 1
            while index < len(raw) and raw[index] != 34:
                if raw[index] == 92:
                    index += 1
                index += 1
            demand(index < len(raw), "unterminated JSON string")
            string_bytes += index - start
            demand(string_bytes <= 200000, "JSON string-state cap")
            index += 1
        elif byte in b"[{":
            depth += 1
            demand(depth <= 6, "JSON nesting cap")
            index += 1
        elif byte in b"]}":
            depth -= 1
            demand(depth >= 0, "JSON nesting")
            index += 1
        elif byte in b",:":
            index += 1
        else:
            start = index
            while index < len(raw) and raw[index] not in b" \t\r\n,]}:":
                index += 1
            demand(0 < index - start <= 64, "JSON atom-size cap")
    demand(depth == 0, "JSON nesting")
    def bad_constant(value):
        raise Refusal("nonfinite JSON constant: " + value)
    return json.loads(raw, object_pairs_hook=unique_object, parse_constant=bad_constant)


def verify_document(document):
    demand(type(document) is dict, "document type")
    demand(set(document) == {"schema", "scope", "status", "root_spec", "root_count",
                            "roots", "limits", "stats", "resumption",
                            "global_k6_status", "independent_verification"}, "top-level keys")
    demand(document.get("schema") == SCHEMA, "schema")
    demand(document.get("scope") == "WHOLE_34_SIGNATURES_286_CHARTS", "scope")
    demand(document.get("status") == "COMPLETE", "INCOMPLETE is not proof")
    demand(document.get("root_spec") == "MIN_ANCHOR_MASK_ORDER_V1", "root specification")
    demand(type(document.get("root_count")) is int and document["root_count"] == 286,
           "claimed root count")
    roots = document.get("roots")
    demand(type(roots) is list and len(roots) == 286, "missing/extra roots")
    limits = document.get("limits")
    demand(type(limits) is dict and set(limits) ==
           {"processed_nodes", "depth", "seconds", "artifact_bytes", "state_bytes"}, "limit keys")
    for key, maximum in (("processed_nodes", MAX_NODES), ("depth", MAX_DEPTH),
                         ("artifact_bytes", MAX_BYTES), ("state_bytes", 128 * 1024 * 1024)):
        demand(integer(limits[key]) and 0 < limits[key] <= maximum, "limit cap: " + key)
    demand(type(limits["seconds"]) in (int, float) and
           math.isfinite(limits["seconds"]) and 0 < limits["seconds"] <= 30, "producer time limit")
    counts = fresh_counts()
    for chart, record in zip(charts(), roots):
        demand(type(record) is dict and set(record) ==
               {"left_mask", "left_anchor", "right_anchor", "tree"}, "root keys")
        identity = tuple(record[key] for key in ("left_mask", "left_anchor", "right_anchor"))
        demand(all(integer(v) for v in identity) and identity == chart,
               "wrong/duplicate/noncanonical root")
        verify_tree(chart, record["tree"], counts, limits["processed_nodes"])
    verify_claims(document.get("stats"), counts, limits)
    return counts


def verify_claims(stats, counts, limits):
    demand(type(stats) is dict, "missing claimed counts")
    demand(set(stats) == {"processed_nodes", "created_nodes", "positive_leaves",
                          "domain_leaves", "open_leaves", "max_depth",
                          "elapsed_seconds", "stopped_by", "peak_state_bytes"}, "stat keys")
    expected = {"processed_nodes": counts["nodes"],
                "created_nodes": 286 + 2 * counts["splits"],
                "positive_leaves": counts["positive"],
                "domain_leaves": counts["excluded"],
                "open_leaves": 0, "max_depth": counts["max_depth"]}
    for key, value in expected.items():
        demand(integer(stats.get(key)) and stats[key] == value, "claimed count mismatch: " + key)
    elapsed = stats.get("elapsed_seconds")
    demand(type(elapsed) in (int, float) and math.isfinite(elapsed) and
           0 <= elapsed <= limits["seconds"],
           "invalid producer time claim")
    demand(stats.get("stopped_by") == "COMPLETE", "producer stopping claim")
    demand(integer(stats.get("peak_state_bytes")) and
           0 <= stats["peak_state_bytes"] <= limits["state_bytes"], "producer state claim")
    demand(counts["max_depth"] <= limits["depth"], "declared depth cap")
    demand(counts["nodes"] == 286 + 2 * counts["splits"], "full binary forest identity")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("certificate")
    parser.add_argument("--seconds", type=float, default=20.0)
    args = parser.parse_args()
    demand(0 < args.seconds <= 25, "checker time grant")
    def timed_out(_signum, _frame):
        raise Refusal("checker wall-time cap")
    signal.signal(signal.SIGALRM, timed_out)
    signal.setitimer(signal.ITIMER_REAL, args.seconds)
    started = time.perf_counter()
    try:
        document = read_document(args.certificate)
        demand(type(document) is dict and type(document.get("limits")) is dict,
               "missing declared limits")
        byte_limit = document["limits"].get("artifact_bytes")
        demand(integer(byte_limit) and Path(args.certificate).stat().st_size <= byte_limit,
               "declared encoded-size cap")
        counts = verify_document(document)
        output = {"status": "VERIFIED_COMPLETE", "counts": counts}
    except (Refusal, OSError, ValueError, TypeError, KeyError, RecursionError, MemoryError) as error:
        output = {"status": "REFUSED", "reason": str(error)}
    output["elapsed_seconds"] = time.perf_counter() - started
    signal.setitimer(signal.ITIMER_REAL, 0)
    print(json.dumps(output, sort_keys=True))
    return 0 if output["status"] == "VERIFIED_COMPLETE" else 1


if __name__ == "__main__":
    raise SystemExit(main())
