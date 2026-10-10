"""Independent complete generation. New trusted Python, never author code.
Arbitrary-width integer masks vs TS two-word arithmetic; all41 unit images.
Bounded input includes whole producer blobs; regenerate and compare EVERY byte.
"""
import base64
import hashlib
import itertools
import json
import struct
import sys
import time


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("Duplicate request key")
        result[key] = value
    return result


start = time.monotonic()
data = sys.stdin.buffer.read(16777217)
if len(data) > 16777216:
    raise ValueError("Input limit")
request = json.loads(data, object_pairs_hook=unique_object)
fixed = {"version": 1, "prime": 83, "movingSpeeds": 13, "totalRunners": 14,
         "boundaryPolicy": "STRICT_OPEN_BAD", "encoding": "P83GEN1_PREORDER_REASON_OPTIONS_V1"}
if set(request) != set(fixed) | {"tree", "cover12", "cover13"} or any(type(request[k]) is not type(v) or request[k] != v for k, v in fixed.items()):
    raise ValueError("Fixed full p83 domain only")
blobs = {}
for key, cap in [("tree", 8388608), ("cover12", 32768), ("cover13", 2097152)]:
    blob = base64.b64decode(request[key], validate=True)
    if not blob or len(blob) > cap or base64.b64encode(blob).decode() != request[key]:
        raise ValueError("Blob bounds/encoding")
    blobs[key] = blob
FULL = (1 << 41) - 1
masks = [sum(1 << (t - 1) for t in range(1, 42)
             if 14 * min(t * v % 83, 83 - t * v % 83) < 83) for v in range(1, 42)]
if any(m.bit_count() != 5 for m in masks):
    raise ValueError("Mask cardinality")
actions = [[min(g * v % 83, 83 - g * v % 83) for v in range(1, 42)] for g in range(1, 42)]
trace = bytearray(b"P83GEN1\n")
roots = []
total = 0


def deadline():
    if time.monotonic() - start >= 58:
        raise TimeoutError("Independent generation cooperative deadline")


def append(values):
    trace.extend(values)
    if len(trace) > 8388608:
        raise ValueError("Trace bound")


def generate(size):
    global total
    raw = set()
    for pair in itertools.combinations(range(1, 6), 2):
        deadline()
        header = len(trace)
        append(bytes(11))
        pairmask = sum(1 << (t - 1) for t in pair)
        available = [v for v in range(1, 41) if not masks[v] & pairmask]
        nodes = 0
        leaves = 0

        def visit(selected, covered, private, avail, slots):
            nonlocal nodes, leaves
            global total
            nodes += 1
            total += 1
            if total > 2500000:
                raise ValueError("Node bound")
            if total % 4096 == 0:
                deadline()
            if any(p == 0 for p in private):
                append([0])
                return
            uncovered = FULL ^ covered
            if slots == 0:
                if uncovered == 0:
                    leaves += 1
                    raw.add(tuple(sorted(v + 1 for v in selected)))
                    append([1])
                else:
                    append([2])
                return
            if uncovered == 0 or uncovered.bit_count() > 5 * slots or len(avail) < slots:
                append([2])
                return
            union = 0
            gains = []
            for v in avail:
                union |= masks[v]
                gains.append((masks[v] & uncovered).bit_count())
            if uncovered & ~union:
                append([3])
                return
            if sum(sorted(gains, reverse=True)[:slots]) < uncovered.bit_count():
                append([4])
                return
            times = [t for t in range(41) if uncovered & (1 << t)]
            pivot = min(times, key=lambda t: (sum(bool(masks[v] & (1 << t)) for v in avail), t))
            options = [v for v in avail if masks[v] & (1 << pivot)]
            append([5, pivot + 1, len(options)] + [v + 1 for v in options])
            remaining = avail[:]
            for v in options:
                remaining.remove(v)
                m = masks[v]
                visit(selected + [v], covered | m,
                      [p & ~m for p in private] + [m & ~covered], remaining[:], slots - 1)

        visit([0], masks[0], [masks[0]], available, size - 1)
        treebytes = len(trace) - header - 11
        trace[header:header + 11] = struct.pack("<BBBII", size, *pair, nodes, treebytes)
        roots.append({"targetSize": size, "pair": list(pair), "nodes": nodes,
                      "leafOccurrences": leaves, "traceBytes": treebytes})
    return raw


def canonical_orbits(rows):
    pending = set(rows)
    out = set()
    while pending:
        if len(out) % 256 == 0:
            deadline()
        row = pending.pop()
        orbit = {tuple(sorted(action[v - 1] for v in row)) for action in actions}
        out.add(min(orbit))
        pending.difference_update(orbit)
    return out


c12 = canonical_orbits(generate(12))
ir13 = canonical_orbits(generate(13))
extensions = set()
for row in c12:
    deadline()
    for v in range(1, 42):
        extensions.add(tuple(sorted(row + (v,))))
red13 = canonical_orbits(extensions)
union = ir13 | red13
if ir13 & red13:
    raise ValueError("Irredundant/reducible overlap")
cover12 = b"".join(bytes(row) for row in sorted(c12))
cover13 = b"".join(bytes(row) for row in sorted(union))
if len(cover12) > 32768 or len(cover13) > 2097152:
    raise ValueError("Dataset bound")
generated = {"tree": bytes(trace), "cover12": cover12, "cover13": cover13}
for key in generated:
    # Byte equality compares all preorder events and all fixed-width rows.
    if generated[key] != blobs[key]:
        raise ValueError("Independent complete tree/row disagreement: " + key)
deadline()
result = {"metadata": {"encoding": "P83GEN1_PREORDER_REASON_OPTIONS_V1", "roots": roots,
                       "counts": {"canonical12": len(c12), "irredundant13": len(ir13),
                                  "reducible13": len(red13), "canonical13": len(union),
                                  "repeated13": sum(len(set(row)) < 13 for row in union),
                                  "totalNodes": total}},
          "datasets": {key: {"bytes": len(blob), "sha256": hashlib.sha256(blob).hexdigest()}
                       for key, blob in generated.items()},
          "comparedEveryTreeByte": True, "comparedEveryRow": True}
stdout = canonical(result) + "\n"
if len(stdout.encode()) > 16777216:
    raise ValueError("Output limit")
sys.stdout.write(stdout)
