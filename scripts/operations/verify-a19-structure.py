"""Independent A19 antichain closure certificate and complete divisor replay.

This implementation regenerates all closed capped profiles by BFS, independently
of the hardcoded maxima, then exhausts B^2 divisors on the residual-prime scan.
"""
import argparse
import hashlib
import json
from collections import deque
from math import isqrt

CAPS = (9, 4, 3, 4, 9, 1, 9, 4, 1)
MAXIMA = (
    (0, 1, 0, 0, 2, 0, 0, 1, 0), (0, 1, 0, 0, 4, 0, 0, 0, 0),
    (0, 1, 1, 0, 1, 0, 0, 0, 0), (0, 2, 2, 0, 0, 0, 0, 0, 0),
    (0, 4, 0, 4, 0, 1, 0, 4, 0), (1, 1, 0, 0, 1, 0, 0, 0, 0),
    (1, 2, 1, 0, 0, 0, 0, 0, 0), (2, 1, 0, 1, 0, 0, 0, 0, 0),
    (2, 3, 0, 0, 0, 0, 0, 0, 0), (3, 1, 1, 0, 0, 0, 0, 0, 0),
    (4, 2, 0, 0, 0, 0, 0, 0, 0), (6, 1, 0, 0, 0, 0, 0, 0, 0),
)
LOGS = {pow(2, k, 19): k for k in range(18)}


def factors(n):
    result = {}
    q = 2
    while q * q <= n:
        while n % q == 0:
            result[q] = result.get(q, 0) + 1
            n //= q
        q += 1 if q == 2 else 2
    if n > 1:
        result[n] = result.get(n, 0) + 1
    return result


def grow(rs, step):
    return frozenset((r + step * t) % 18 for r in rs for t in (-1, 0, 1))


def group_certificate():
    base = (0, 1, 0, 0, 0, 0, 0, 0, 0)
    closed = {base: grow({0}, 2)}
    queue = deque([base])
    opened = set()
    while queue:
        w = queue.popleft()
        for i, cap in enumerate(CAPS):
            if w[i] == cap:
                continue
            v = tuple(w[j] + (j == i) for j in range(9))
            if v in closed or v in opened:
                continue
            rs = grow(closed[w], i + 1)
            if 9 in rs:
                opened.add(v)
            else:
                closed[v] = rs
                queue.append(v)
    maxima = sorted(w for w in closed if all(w[i] == cap or
        tuple(w[j] + (j == i) for j in range(9)) not in closed for i, cap in enumerate(CAPS)))
    assert tuple(maxima) == MAXIMA
    assert len(closed) == 230
    minimal_hits = sorted(v for v in opened if not any(u != v and all(a <= b for a, b in zip(u, v)) for u in opened))
    assert len(minimal_hits) == 30
    # Boundary check is the finite certificate for the induction in the note.
    boundary_checks = 0
    for w, rs in closed.items():
        assert 9 not in rs
        assert any(all(a <= b for a, b in zip(w, m)) for m in MAXIMA)
        if any(w[i] for i in (0, 2, 4, 6, 8)):
            stabilizer = [h for h in range(18) if {(r + h) % 18 for r in rs} == set(rs)]
            assert stabilizer == [0]
            assert sum(w) <= 7 and len(rs) >= 2 * sum(w) + 3
        for i, cap in enumerate(CAPS):
            v = tuple(min(w[j] + (j == i), CAPS[j]) for j in range(9))
            assert v in closed or 9 in grow(rs, i + 1)
            assert v in closed or any(all(a <= b for a, b in zip(h, v)) for h in minimal_hits)
            boundary_checks += 1
    return {"closedProfiles": len(closed), "maximalBoxes": len(maxima),
            "boundaryChecks": boundary_checks, "minimalOpenProfiles": len(minimal_hits),
            "caps": CAPS, "mixedAperiodicityAndKneserBound": True}


def weights(values):
    w = [0] * 9
    for q, e in values.items():
        k = LOGS[q % 19]
        k = min(k, 18 - k)
        if k:
            w[k - 1] += e
    return w


def obstruction_boxes(w):
    assert w[1] >= 1
    capped = [min(a, b) for a, b in zip(w, CAPS)]
    return [i + 1 for i, m in enumerate(MAXIMA) if all(a <= b for a, b in zip(capped, m))]


def direct_gate(p, a):
    x = (p + a) // 4
    b = p * x
    ds = [1]
    for q, e in {**factors(x), p: 1}.items():
        ds = [d * q**t for d in ds for t in range(2 * e + 1)]
    for d in sorted(ds):
        if d > b:
            break
        other = b * b // d
        if (b + d) % a == 0 and (b + other) % a == 0:
            y, z = (b + d) // a, (b + other) // a
            assert x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z)
            return {"x": x, "y": y, "z": z, "d": d}
    return None


def type_ii_open(xf):
    rs = {1}
    for q, e in xf.items():
        rs = {r * pow(q, t, 19) % 19 for r in rs for t in range(-e, e + 1)}
    return 18 in rs


def a11_obstruction(p, xf):
    if all(q % 11 in {1, 3, 4, 5, 9} for q in xf):
        return "QR_ONLY"
    if xf.get(3) != 1 or any(q != 3 and q % 11 in {3, 4, 5, 9} for q in xf):
        return None
    if any(q % 11 in {7, 8, 10} for q in xf):
        return None
    e = sum(e for q, e in xf.items() if q % 11 in {2, 6})
    return "THIN_PRIMITIVE" if e == 1 or (e == 2 and p % 11 == 1) else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=1_000_000)
    args = parser.parse_args()
    if not 841 <= args.limit <= 200_000_000:
        parser.error("limit must be within 841..200000000")
    certificate = group_certificate()
    sieve = bytearray(b"\x01") * (args.limit // 2 + 1)
    sieve[0] = 0
    for q in range(3, isqrt(args.limit) + 1, 2):
        if sieve[q // 2]:
            start = q * q // 2
            sieve[start::q] = b"\x00" * ((len(sieve) - 1 - start) // q + 1)
    counts, after_a11, after_a15, joint, examples = {}, {}, {}, {}, {}
    digest = hashlib.sha256()
    prime_count = 0
    for p in range(841, args.limit + 1, 840):
        if not sieve[p // 2]:
            continue
        x = (p + 19) // 4
        xf = factors(x)
        w = weights({**xf, p: 1})
        boxes = obstruction_boxes(w)
        witness = direct_gate(p, 19)
        assert bool(boxes) == (witness is None), p
        ii_open = type_ii_open(xf)
        assert not ii_open or witness is not None
        a11 = a11_obstruction(p, factors((p + 11) // 4))
        three_closed = a11 is not None and all(q % 3 == 1 for q in factors((p + 3) // 4)) and all(
            q % 7 in {1, 2, 4} for q in factors((p + 7) // 4))
        through_a15 = three_closed and direct_gate(p, 15) is None
        key = ("QR_ONLY" if 5 in boxes else "MIXED_OBSTRUCTION") if boxes else (
            "TYPE_II_OPEN" if ii_open else "TYPE_I_RESCUE")
        counts[key] = counts.get(key, 0) + 1
        sample = {"p": p, "x": x, "factorX": xf, "weights": w, "obstructionBoxes": boxes,
                  "pResidue19": p % 19, "witness": witness}
        examples.setdefault(key, sample)
        if three_closed:
            after_a11[key] = after_a11.get(key, 0) + 1
            pair = f"{a11}/{key}"
            joint[pair] = joint.get(pair, 0) + 1
            examples.setdefault(f"afterA11/{pair}", sample)
        if through_a15:
            after_a15[key] = after_a15.get(key, 0) + 1
            examples.setdefault(f"afterA15/{key}", sample)
        row = {"n": p, "status": "WITNESS" if witness else "OBSTRUCTED",
               "typeIIStatus": "WITNESS" if ii_open else "OBSTRUCTED", "weights": w,
               "obstructionBoxes": boxes, "a11Obstruction": a11,
               "threeGateClosed": three_closed, "throughA15Closed": through_a15}
        digest.update(json.dumps(row, separators=(",", ":")).encode())
        prime_count += 1
    print(json.dumps({"limit": args.limit, "primeCount": prime_count, "groupCertificate": certificate,
        "counts": counts, "afterA3A7A11": after_a11, "afterThroughA15": after_a15,
        "joint": joint, "examples": examples, "manifestDigest": digest.hexdigest(),
        "scope": "Full finite A19 replay, not universal cross-gate closure."}, indent=2))


if __name__ == "__main__":
    main()
