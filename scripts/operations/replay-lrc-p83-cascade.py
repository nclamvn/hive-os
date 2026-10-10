"""Fixed isolated whole p83 cascade consumer. Stdlib only; no IO except stdin/out.
Independently regenerate every forest event and every row, then byte-compare.
All SAT assignments additionally check original full-grid and omitted-gcd.
"""
import base64
import hashlib
import json
import math
import struct
import sys
import time

START = time.monotonic()
KEYS = ["tree", "level2", "level4", "level8", "level16", "level32", "ancestors2"]
CAP_TREE = 32 * 1024 * 1024
CAP_DATA = 16 * 1024 * 1024
CAP_INPUT = 64 * 1024 * 1024


def fail():
    raise ValueError("p83 whole cascade rejected")


def deadline():
    if time.monotonic() - START >= 120:
        fail()


def unique(pairs):
    result = {}
    for k, v in pairs:
        if k in result:
            fail()
        result[k] = v
    return result


text = sys.stdin.buffer.read(CAP_INPUT + 1)
if len(text) > CAP_INPUT:
    fail()
request = json.loads(text, object_pairs_hook=unique)
fixed = {"version": 1, "prime": 83, "movingSpeeds": 13, "totalRunners": 14, "boundary": "STRICT_OPEN_BAD"}
if type(request) is not dict or set(request) != set(fixed) | {"predecessor", "blobs"}:
    fail()
for k, v in fixed.items():
    if type(request[k]) is not type(v) or request[k] != v:
        fail()
if type(request["blobs"]) is not dict or set(request["blobs"]) != set(KEYS):
    fail()


def decode(value, cap):
    if type(value) is not str or len(value) > 4 * ((cap + 2) // 3):
        fail()
    data = base64.b64decode(value, validate=True)
    if len(data) > cap or base64.b64encode(data).decode("ascii") != value:
        fail()
    return data


predecessor = decode(request["predecessor"], 2 * 1024 * 1024)
if len(predecessor) != 1506739 or hashlib.sha256(predecessor).hexdigest() != "3c2c2286a6a79895c6ba2d688be483861b3d03621d318b98c4e79f951f90c41f":
    fail()
blobs = {k: decode(request["blobs"][k], CAP_TREE if k == "tree" else CAP_DATA) for k in KEYS}
if sum(len(blobs[k]) for k in KEYS[1:]) > CAP_DATA:
    fail()
del request, text
parents = [tuple(predecessor[o:o + 13]) for o in range(0, len(predecessor), 13)]
forest = bytearray(b"P83CAS1\n")
stages = []
total_nodes = total_roots = total_forces = data_bytes = 0
derived = {}


def emit(*values):
    if len(forest) + len(values) > CAP_TREE:
        fail()
    forest.extend(values)


for level in [1, 2, 4, 8, 16]:
    deadline()
    M = 83 * level
    times = list(range(1, M + 1, 2))
    bad = {}
    full_grid = {}
    all_grid = (1 << M) - 1
    for w in {x for row in parents for x in row}:
        bad[w] = ([i for i, t in enumerate(times) if 14 * min(t * w % (2 * M), 2 * M - t * w % (2 * M)) < 2 * M],
                  [i for i, t in enumerate(times) if 14 * min(t * (w + M) % (2 * M), 2 * M - t * (w + M) % (2 * M)) < 2 * M])
        for x in (w, M - w):
            if x not in full_grid:
                # Direct raw definition at EVERY folded time (including even),
                # independently of the odd CNF construction.
                full_grid[x] = sum(1 << (t - 1) for t in range(1, M + 1)
                                   if 14 * min(t * x % (2 * M), 2 * M - t * x % (2 * M)) < 2 * M)
    output = set()
    stage = {"fromLevel": level, "toLevel": 2 * level, "parentCount": len(parents), "nodes": 0,
             "forces": 0, "conflicts": 0, "splits": 0, "satCubes": 0, "satAssignments": 0,
             "gcdProper": 0, "improperRaw": 0, "survivors": 0, "partitionMassPerRoot": 8192}
    stage_header = len(forest)
    emit(*bytes(10))
    for root, row in enumerate(parents):
        if root % 512 == 0:
            deadline()
        total_roots += 1
        if total_roots > 600000:
            fail()
        pos = [0] * len(times)
        neg = [0] * len(times)
        for var, w in enumerate(row):
            for i in bad[w][0]:
                neg[i] |= 1 << var
            for i in bad[w][1]:
                pos[i] |= 1 << var
        seen = set()
        clauses = []
        for i, t in enumerate(times):
            key = (pos[i], neg[i])
            if key not in seen:
                seen.add(key)
                clauses.append((pos[i], neg[i], t))
        root_header = len(forest)
        emit(*bytes(8))
        before = stage["nodes"]
        mass = [0]

        def visit(assigned, ones):
            global total_nodes, total_forces
            stage["nodes"] += 1
            total_nodes += 1
            if total_nodes > 3000000:
                fail()
            while True:
                changed = False
                for p, n, t in clauses:
                    if p & ones or n & (assigned ^ ones):
                        continue
                    free = (p | n) & ~assigned
                    if free == 0:
                        stage["conflicts"] += 1
                        emit(0, t >> 8, t & 255)
                        mass[0] += 1 << (13 - assigned.bit_count())
                        return
                    if free & (free - 1) == 0:
                        stage["forces"] += 1
                        total_forces += 1
                        if total_forces > 8000000:
                            fail()
                        digit = 1 if p & free else 0
                        emit(1 + 2 * (free.bit_length() - 1) + digit, t >> 8, t & 255)
                        mass[0] += 1 << (12 - assigned.bit_count())
                        assigned |= free
                        if digit:
                            ones |= free
                        changed = True
                if not changed:
                    break
            chosen = 0
            width = 14
            for p, n, t in clauses:
                if p & ones or n & (assigned ^ ones):
                    continue
                free = (p | n) & ~assigned
                count = free.bit_count()
                if count < width:
                    chosen, width = free, count
            if chosen == 0:
                stage["satCubes"] += 1
                emit(255)
                free = 8191 ^ assigned
                mass[0] += 1 << free.bit_count()
                sub = free
                while True:
                    digits = ones | sub
                    child = tuple(M - w if digits & (1 << i) else w for i, w in enumerate(row))
                    grid = 0
                    prefix = [2 * level]
                    for x in child:
                        grid |= full_grid[x]
                        prefix.append(math.gcd(prefix[-1], x))
                    if grid != all_grid:
                        fail()
                    suffix = 2 * level
                    proper = False
                    for i in range(12, -1, -1):
                        if math.gcd(prefix[i], suffix) > 1:
                            proper = True
                        suffix = math.gcd(suffix, child[i])
                    stage["satAssignments"] += 1
                    if proper:
                        stage["gcdProper"] += 1
                    else:
                        stage["improperRaw"] += 1
                        output.add(tuple(sorted(child)))
                    if sub == 0:
                        break
                    sub = (sub - 1) & free
                return
            stage["splits"] += 1
            variable = chosen & -chosen
            emit(254, variable.bit_length() - 1)
            visit(assigned | variable, ones)
            visit(assigned | variable, ones | variable)

        visit(0, 0)
        if mass[0] != 8192:
            fail()
        forest[root_header:root_header + 8] = struct.pack(">II", stage["nodes"] - before, len(forest) - root_header - 8)
    rows = sorted(output)
    data = b"".join(struct.pack(">13H", *row) for row in rows)
    data_bytes += len(data)
    if data_bytes > CAP_DATA or data != blobs["level" + str(2 * level)]:
        fail()
    derived["level" + str(2 * level)] = data
    forest[stage_header:stage_header + 10] = struct.pack(">BBII", level, 2 * level, len(parents), len(forest) - stage_header - 10)
    stage["survivors"] = len(rows)
    stages.append(stage)
    parents = rows
ancestors = sorted({tuple(sorted(min(w % 166, 166 - w % 166) for w in row)) for row in parents})
data = b"".join(struct.pack(">13H", *row) for row in ancestors)
if data_bytes + len(data) > CAP_DATA or data != blobs["ancestors2"] or forest != blobs["tree"]:
    fail()
derived["ancestors2"] = data
derived["tree"] = forest
deadline()
metadata = {"stages": stages, "counts": {"roots": total_roots, "nodes": total_nodes, "forces": total_forces,
                                        "conflicts": sum(s["conflicts"] for s in stages), "splits": sum(s["splits"] for s in stages),
                                        "satCubes": sum(s["satCubes"] for s in stages)},
            "ancestors": {"level": 2, "rows": ancestors, "count": len(ancestors)},
            "encoding": {"tree": "P83CAS1_BE_STAGE10_ROOT8_PREORDER", "datasets": "ROW_MAJOR_U16BE_13_NUMERIC_LEX"}}
datasets = {k: {"bytes": len(derived[k]), "sha256": hashlib.sha256(derived[k]).hexdigest()} for k in KEYS}
print(json.dumps({"metadata": metadata, "datasets": datasets, "comparedEveryTreeByte": True, "comparedEveryRow": True,
                  "checkedEverySatOriginalGridAndGcd": True}, sort_keys=True, separators=(",", ":")))
