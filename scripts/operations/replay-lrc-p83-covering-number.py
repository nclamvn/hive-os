"""Independent exact p83 covering decision certificate; stdlib sets, no IO.
This is a complete tau stage, not an all13 generator/cascade/global proof.
"""
import hashlib
import itertools
import json
import sys


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def blocked(distance, modulus):
    return 14 * distance < modulus


request = {"version": 1, "prime": 83, "totalRunners": 14, "targetCover": 11,
           "witness": [1, 6, 8, 10, 11, 13, 17, 19, 21, 23, 25, 38]}
data = sys.stdin.buffer.read(262145)
if len(data) > 262144 or json.loads(data) != request:
    raise ValueError("Fixed p83 request only")
if blocked(1, 14):
    raise ValueError("Strict boundary violated")
masks = {v: {t for t in range(1, 42)
             if blocked(min(t * v % 83, 83 - t * v % 83), 83)}
         for v in range(1, 42)}
if any(len(mask) != 5 for mask in masks.values()):
    raise ValueError("Mask cardinality")
roots = []
total = 0
for triple in itertools.combinations(range(1, 6), 3):
    available = [v for v in range(2, 42) if not masks[v].intersection(triple)]
    nodes = []

    def visit(uncovered, avail, slots):
        global total
        index = len(nodes)
        nodes.append([])
        total += 1
        if total > 20000:
            raise ValueError("Node limit")
        if not uncovered:
            raise ValueError("Forbidden <=11 cover")
        need = len(uncovered)
        if slots == 0 or need > 5 * slots:
            nodes[index] = [0]
            return index
        useful = [v for v in avail if masks[v].intersection(uncovered)]
        union = set().union(*(masks[v] for v in useful))
        if uncovered.difference(union):
            nodes[index] = [1]
            return index
        gains = sorted((len(masks[v].intersection(uncovered)) for v in useful), reverse=True)
        if sum(gains[:slots]) < need:
            nodes[index] = [2]
            return index
        pivot = min(uncovered, key=lambda t: (sum(t in masks[v] for v in useful), t))
        options = [v for v in useful if pivot in masks[v]]
        node = [3, pivot]
        remaining = useful[:]
        for v in options:
            remaining.remove(v)
            node.extend([v, visit(uncovered.difference(masks[v]), remaining[:], slots - 1)])
        nodes[index] = node
        return index

    visit(set(range(1, 42)).difference(masks[1]), available, 10)
    roots.append({"triple": list(triple), "available": available, "nodeCount": len(nodes),
                  "traceSha256": hashlib.sha256(canonical(nodes).encode()).hexdigest(), "nodes": nodes})
coverage = [[v for v in request["witness"] if t in masks[v]] for t in range(1, 42)]
if any(not row for row in coverage):
    raise ValueError("Invalid12cover")
certificate = {"encoding": "PREORDER_NODE_ARRAY_V1",
               "legend": ["SLOTS_ZERO_OR_5BOUND", "UNION_MISSING", "TOP_GAIN_BOUND", "SPLIT"],
               "boundaryPolicy": "STRICT_OPEN_BAD",
               "equalityControl": {"modulus": 14, "speed": 1, "time": 1, "blocked": False,
                                   "scope": "SYNTHETIC_BOUNDARY_CONTROL_NOT_P83"},
               "maskTable": [sorted(masks[v]) for v in range(1, 42)], "roots": roots,
               "totalNodes": total, "witnessCoverage": coverage}
stdout = canonical(certificate) + "\n"
if len(stdout.encode()) > 262144:
    raise ValueError("Output limit")
sys.stdout.write(stdout)
