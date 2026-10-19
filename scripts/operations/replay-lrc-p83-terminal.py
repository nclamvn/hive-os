"""Isolated fixed WHOLE terminal replay. Independent arbitrary-width bitsets
and carry-countplanes, not TS signed-literal scan. Exact complete bytes/masses.
"""
import base64
import hashlib
import itertools
import json
import math
import struct
import sys
import time

START = time.monotonic()
CAP = 16 * 1024 * 1024


def fail():
    raise ValueError("whole p83 terminal rejected")


def unique(pairs):
    result = {}
    for k, v in pairs:
        if k in result:
            fail()
        result[k] = v
    return result


def deadline():
    if time.monotonic() - START >= 90:
        fail()


text = sys.stdin.buffer.read(CAP + 1)
if len(text) > CAP:
    fail()
request = json.loads(text, object_pairs_hook=unique)
fixed = {"version": 1, "prime": 83, "movingSpeeds": 13, "totalRunners": 14, "terminalLevel": 14,
         "commonLevel": 224, "boundary": "STRICT_OPEN_BAD", "cascadeSummarySha256": "0872e1bd95533fea3cfbdd2eab2834607283739c5796ef4c82e5636a57affbb1"}
if type(request) is not dict or set(request) != set(fixed) | {"ancestors", "final32", "tree"}:
    fail()
for k, v in fixed.items():
    if type(request[k]) is not type(v) or request[k] != v:
        fail()


def decode(value, cap):
    if type(value) is not str or len(value) > 4 * ((cap + 2) // 3):
        fail()
    b = base64.b64decode(value, validate=True)
    if len(b) > cap or base64.b64encode(b).decode("ascii") != value:
        fail()
    return b


ancestor_data = decode(request["ancestors"], 256)
final32_data = decode(request["final32"], 832)
supplied = decode(request["tree"], 8 * 1024 * 1024)
if len(ancestor_data) != 52 or hashlib.sha256(ancestor_data).hexdigest() != "ece61da2bd3a3c447d919da64e6ece4d755a36bf14a0417c5cfe9f045d0b2998":
    fail()
if len(final32_data) != 832 or hashlib.sha256(final32_data).hexdigest() != "de0402bad5e8e7c142476583d49743c7584f37d77640246667fa3079b6037aca":
    fail()
ancestors = [list(struct.unpack(">13H", ancestor_data[o:o + 26])) for o in range(0, 52, 26)]
final32 = [struct.unpack(">13H", final32_data[o:o + 26]) for o in range(0, 832, 26)]
reduced = sorted({tuple(sorted(min(x % 166, 166 - x % 166) for x in row)) for row in final32})
if [list(r) for r in reduced] != ancestors:
    fail()
del request, text
times = [t for t in range(1, 582) if t % 7]
full = (1 << len(times)) - 1
forest = bytearray(b"P83TER1\n\x02")
roots = []
total_nodes = total_forces = 0


def emit(*v):
    if len(forest) + len(v) > 8 * 1024 * 1024:
        fail()
    forest.extend(v)


def mass(ds):
    return math.prod(d.bit_count() for d in ds)


def raw(v):
    grid = any(all(14 * min(t * x % 1162, 1162 - t * x % 1162) >= 1162 for x in v) for t in range(1, 582))
    proper = any(math.gcd(14, *(x for j, x in enumerate(v) if j != omit)) > 1 for omit in range(13))
    return grid, proper


for ancestor in ancestors:
    deadline()
    if sum(x % 2 for x in ancestor) < 2:
        fail()
    # Entire inherited folded F2 grid independently checked, not sampled.
    if any(all(14 * min(t * x % 166, 166 - t * x % 166) >= 166 for x in ancestor) for t in range(1, 84)):
        fail()
    masks = []
    for v in ancestor:
        row = []
        for a in range(7):
            w = v + 166 * a
            row.append(sum(1 << j for j, t in enumerate(times) if 14 * min(t * w % 1162, 1162 - t * w % 1162) < 1162))
        union = 0
        for m in row:
            if union & m:
                fail()
            union |= m
        masks.append(row)
    unions = []
    for row in masks:
        u = [0] * 128
        for d in range(1, 128):
            low = d & -d
            u[d] = u[d ^ low] | row[low.bit_length() - 1]
        unions.append(u)
    divisible = [(-3 * v) % 7 for v in ancestor]
    root = {"ancestor": ancestor, "nodes": 0, "forces": 0, "gainPrunes": 0, "conflicts": 0, "gcdLeaves": 0,
            "splits": 0, "noneRegions": 0, "maxDepth": 0, "gridCertifiedMass": 0, "gcdCertifiedMass": 0,
            "totalMass": 0, "domainMass": 96889010407, "originalGcdCompletionsChecked": 0, "gcdRegionGridWitnessOverlap": 0}
    header = len(forest)
    forest.extend(struct.pack(">13HII", *ancestor, 0, 0))

    def solve(ds, depth):
        global total_nodes, total_forces
        total_nodes += 1
        root["nodes"] += 1
        root["maxDepth"] = max(root["maxDepth"], depth)
        if total_nodes > 1000000 or depth > 13:
            fail()
        if total_nodes % 1024 == 0:
            deadline()
        original = mass(ds)
        accounted = 0
        if not original:
            fail()

        def finish():
            if original != accounted:
                fail()
            return accounted

        while True:
            if sum(d == (1 << divisible[i]) for i, d in enumerate(ds)) >= 12:
                root["gcdLeaves"] += 1
                emit(253)
                m = mass(ds)
                if m > 7:
                    fail()
                options = [[a for a in range(7) if d & (1 << a)] for d in ds]
                for digits in itertools.product(*options):
                    v = [ancestor[i] + 166 * a for i, a in enumerate(digits)]
                    grid, proper = raw(v)
                    if not proper:
                        fail()
                    root["originalGcdCompletionsChecked"] += 1
                    root["gcdRegionGridWitnessOverlap"] += int(grid)
                root["gcdCertifiedMass"] += m
                accounted += m
                return finish()
            covered = 0
            for i, d in enumerate(ds):
                if d & (d - 1) == 0:
                    covered |= masks[i][d.bit_length() - 1]
            U = full & ~covered
            if not U:
                digits = []
                for i, d in enumerate(ds):
                    nondiv = d & ~(1 << divisible[i])
                    low = (nondiv & -nondiv) if nondiv else (d & -d)
                    digits.append(low.bit_length() - 1)
                v = [ancestor[i] + 166 * a for i, a in enumerate(digits)]
                grid, proper = raw(v)
                if not grid and not proper:
                    raise ValueError("checked improper SAT completion " + str(v))
                fail()
            planes = [0] * 4
            for i, d in enumerate(ds):
                carry = unions[i][d] & U
                for j in range(4):
                    old = planes[j]
                    planes[j] ^= carry
                    carry &= old
            zero = U & ~(planes[0] | planes[1] | planes[2] | planes[3])
            one = U & planes[0] & ~(planes[1] | planes[2] | planes[3])
            special = zero | one
            if special:
                bit = special & -special
                t = times[bit.bit_length() - 1]
                if zero & bit:
                    root["conflicts"] += 1
                    emit(0, t >> 8, t & 255)
                    m = mass(ds)
                    root["gridCertifiedMass"] += m
                    accounted += m
                    return finish()
                literal = None
                for i, d in enumerate(ds):
                    for a in range(7):
                        if d & (1 << a) and masks[i][a] & bit:
                            if literal is not None:
                                fail()
                            literal = (i, a)
                i, a = literal
                total_forces += 1
                if total_forces > 1000000:
                    fail()
                root["forces"] += 1
                emit(1 + 7 * i + a, t >> 8, t & 255)
                before = mass(ds)
                ds = ds.copy()
                ds[i] = 1 << a
                rejected = before - mass(ds)
                root["gridCertifiedMass"] += rejected
                accounted += rejected
                continue
            gain = sum(max((masks[i][a] & U).bit_count() for a in range(7) if d & (1 << a)) for i, d in enumerate(ds))
            if gain < U.bit_count():
                root["gainPrunes"] += 1
                emit(252)
                m = mass(ds)
                root["gridCertifiedMass"] += m
                accounted += m
                return finish()
            chosen = 0
            for n in range(2, 14):
                cls = U
                for j in range(4):
                    cls &= planes[j] if n & (1 << j) else ~planes[j]
                if cls:
                    chosen = cls & -cls
                    break
            if not chosen:
                fail()
            t = times[chosen.bit_length() - 1]
            options = [(i, a) for i, d in enumerate(ds) for a in range(7) if d & (1 << a) and masks[i][a] & chosen]
            root["splits"] += 1
            emit(254, t >> 8, t & 255)
            ds = ds.copy()
            for i, a in options:
                if not ds[i] & (1 << a):
                    continue
                child = ds.copy()
                child[i] = 1 << a
                accounted += solve(child, depth + 1)
                ds[i] &= ~(1 << a)
                if not ds[i]:
                    return finish()
            none = mass(ds)
            root["noneRegions"] += int(none > 0)
            root["gridCertifiedMass"] += none
            accounted += none
            return finish()

    root["totalMass"] = solve([127] * 13, 0)
    if root["totalMass"] != 7 ** 13 or root["gridCertifiedMass"] + root["gcdCertifiedMass"] != root["totalMass"]:
        fail()
    forest[header + 26:header + 34] = struct.pack(">II", root["nodes"], len(forest) - header - 34)
    roots.append(root)
if forest != supplied:
    fail()
choices = []
for a in range(7):
    r = 83 * (1 + 166 * a) % 1162
    d = min(r, 1162 - r)
    choices.append({"digit": a, "residue": r, "distance": d, "bad": 14 * d < 1162})
closed = [c["digit"] for c in choices if 14 * c["distance"] <= 1162]
if any(c["bad"] for c in choices) or closed != [0, 1] or choices[0]["distance"] != 83 or choices[1]["distance"] != 83:
    fail()
common = math.lcm(14, 32)
if common != 224 or 32 % 14 == 0 or 14 % 32 == 0 or math.gcd(83, 224) != 1:
    fail()
crt = []
for a in range(1, 83):
    b = 1 + 224 * (((a - 1) * pow(224, -1, 83)) % 83)
    g = math.gcd(b, 83 * 224)
    if b % 83 != a or b % 224 != 1 or g != 1:
        fail()
    crt.append({"baseUnit": a, "multiplier": b, "gcd": g})
metadata = {"roots": roots, "counts": {"roots": 2, "nodes": total_nodes, "forces": total_forces},
            "boundary": {"modulus": 1162, "time": 83, "ancestorSpeed": 1, "choices": choices, "closedBadDigits": closed},
            "bridge": {"terminalLevel": 14, "cascadeLevel": 32, "commonLevel": 224, "nonComparable": True, "crtUnits": crt,
                       "level1WitnessBranchesIncluded": True, "writtenProofNotFormal": True},
            "finiteConclusion": {"I": "EMPTY_AT_224", "J": "EMPTY", "scope": "ONE_ACTUAL_PRIME_ONLY"},
            "encoding": "P83TER1_BE_ROOT34_LITERAL_PREORDER"}
deadline()
print(json.dumps({"metadata": metadata, "tree": {"bytes": len(forest), "sha256": hashlib.sha256(forest).hexdigest()},
                  "comparedEveryTreeByte": True, "checkedEveryNodeMass": True, "checkedOriginalGcdRegions": True}, sort_keys=True, separators=(",", ":")))
