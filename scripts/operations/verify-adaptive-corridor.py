"""Stdlib replay: complete B^2 divisors vs TS group filters, independent pair search.

The 35-billion neutral examples are separate named prime tuples, not an interval
verification beyond the existing 200-million residual survey.
"""
import argparse
import hashlib
import json
from math import gcd, isqrt, lcm


def factors(n):
    out = {}
    q = 2
    while q * q <= n:
        while n % q == 0:
            out[q] = out.get(q, 0) + 1
            n //= q
        q += 1 if q == 2 else 2
    if n > 1:
        out[n] = out.get(n, 0) + 1
    return out


def divisors(fs):
    out = [1]
    for q, e in fs.items():
        out = [d * q**k for d in out for k in range(e + 1)]
    return sorted(out)


def prime(n):
    return n >= 2 and (n == 2 or n % 2 != 0 and all(n % q for q in range(3, isqrt(n) + 1, 2)))


def full_gate_closed(n, a, xf=None):
    x = (n + a) // 4
    fs = {q: 2 * e for q, e in (xf or factors(x)).items()}
    fs[n] = fs.get(n, 0) + 2
    b = n * x
    hits = []
    for d in divisors(fs):
        if d > b:
            break
        other = b * b // d
        if (d + b) % a == 0 and (other + b) % a == 0:
            y, z = (b + d) // a, (b + other) // a
            assert x < y < z
            assert 4 * x * y * z == n * (x * y + x * z + y * z)
            hits.append(d)
    return not hits


def search(n, bound=8, unit=False):
    pairs = 0
    for depth in range(1, bound + 1):
        for a in range(1, depth + 1):
            for u in range(1, depth + 1):
                if max(a, u) != depth or gcd(a, u) != 1 or unit and a != 1:
                    continue
                pairs += 1
                for s in divisors(factors(a * n + u)):
                    if (s + 1) % (4 * u * a):
                        continue
                    v = (a * n + u) // s
                    k = (s + 1) // (4 * u * a)
                    assert (u + v) % a == 0
                    shift = (u + v) // a
                    assert shift % 4 == 3 and n + shift == 4 * u * v * k
                    ds = sorted([u * v * k, a * n * u * k, a * n * v * k])
                    x, y, z = ds
                    if not x < y < z:
                        continue
                    assert 4 * x * y * z == n * (x * y + x * z + y * z)
                    assert sum(d % n == 0 for d in ds) == 2
                    return {"depth": depth, "pairs": pairs,
                            "construction": {"a": a, "u": u, "s": s, "v": v, "k": k, "shift": shift},
                            "witness": {"n": str(n), "x": str(x), "y": str(y), "z": str(z)}}
    return {"depth": None, "pairs": pairs, "construction": None, "witness": None}


def neutral_tuple(shifts, t):
    spacing = lcm(840, *(a * (a + 1) for a in shifts))
    n = spacing * t + 1
    if not prime(n):
        return None
    rows = []
    for a in shifts:
        core = (a + 1) // 4
        q = spacing // (a + 1) * t + 1
        if not prime(q):
            return None
        assert n % a == q % a == 1
        xf = factors(core)
        xf[q] = xf.get(q, 0) + 1
        assert full_gate_closed(n, a, xf)
        rows.append({"a": a, "x": core * q, "core": core, "cofactor": q})
    return {"n": n, "t": t, "rows": rows}


def modulator_family(bound):
    pairs = [(a, u) for a in range(1, bound + 1) for u in range(1, bound + 1) if gcd(a, u) == 1]
    spacing = lcm(840, *(4 * u * (a + u) for a, u in pairs))
    slopes = [spacing]
    for a, u in pairs:
        slope = a * spacing // (a + u)
        assert slope * (a + u) == a * spacing
        assert slope % (4 * a * u) == 0
        assert a + u < 4 * a * u - 1
        slopes.append(slope)
    assert len(set(slopes)) == len(slopes)
    return {"bound": bound, "spacing": str(spacing), "forms": len(slopes),
            "admissibility": "t=0 mod each prime", "primeInfinitude": "CONDITIONAL_ON_DICKSON_NOT_PROVED"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=1_000_000)
    args = parser.parse_args()
    if not 841 <= args.limit <= 200_000_000:
        parser.error("limit must be within 841..200000000")
    sieve = bytearray(b"\x01") * (args.limit // 2 + 1)
    sieve[0] = 0
    for q in range(3, isqrt(args.limit) + 1, 2):
        if sieve[q // 2]:
            start = q * q // 2
            sieve[start::q] = b"\x00" * ((len(sieve) - 1 - start) // q + 1)
    counts, depths, examples = {}, {}, {}
    digest = hashlib.sha256()
    prime_count = survivors = 0
    for n in range(841, args.limit + 1, 840):
        if not sieve[n // 2]:
            continue
        prime_count += 1
        # Exact early QR filters, then complete divisors at 11,15,19: different
        # from the TS antichain/primitive-log classifier for the later gates.
        if any(q % 3 != 1 for q in factors((n + 3) // 4)):
            continue
        if any(q % 7 not in {1, 2, 4} for q in factors((n + 7) // 4)):
            continue
        if not all(full_gate_closed(n, a) for a in (11, 15, 19)):
            continue
        survivors += 1
        unit, full = search(n, unit=True), search(n)
        category = ("BOX_MISS" if full["depth"] is None else "UNIT_SLICE_FOUND"
                    if unit["depth"] is not None else "FREE_MODULATOR_NEEDED_IN_BOX")
        assert unit["depth"] is None or full["depth"] is not None
        counts[category] = counts.get(category, 0) + 1
        key = "null" if full["depth"] is None else str(full["depth"])
        depths[key] = depths.get(key, 0) + 1
        examples.setdefault(category, {"n": n, "unit": unit, "full": full})
        row = {"n": n, "category": category, "unitDepth": unit["depth"], "depth": full["depth"],
               "construction": full["construction"], "witness": full["witness"]}
        digest.update(json.dumps(row, separators=(",", ":")).encode())
    neutral = []
    for t in range(1, (args.limit - 1) // 175560 + 1):
        result = neutral_tuple((11, 19), t)
        if result:
            neutral.append(result)
    # Exact named extended controls, separately scoped. No asymptotic assumption
    # is used for their primality, gate exclusion, or positive identity.
    extended = []
    for t in (21900, 42858, 52140, 99418):
        result = neutral_tuple((3, 7, 11, 15, 19), t)
        assert result is not None
        result["adaptiveWitness"] = search(result["n"])
        assert result["adaptiveWitness"]["witness"] is not None
        extended.append(result)
    controls = [{"n": n, **search(n)} for n in (2521, 131041, 4037881, 10051441, 171348241)]
    box_miss = search(131433121)
    assert prime(131433121) and box_miss["depth"] is None and box_miss["pairs"] == 43
    assert all(full_gate_closed(131433121, a) for a in range(3, 27, 4))
    assert not full_gate_closed(131433121, 27)
    # A separately named exploration, not a change to the bound=8 survey.
    beyond_box = search(131433121, 9)
    assert beyond_box["depth"] == 9
    print(json.dumps({"limit": args.limit, "bound": 8, "primeCount": prime_count,
        "survivorCount": survivors, "counts": counts, "depths": depths, "examples": examples,
        "controls": controls, "neutralTuples": neutral, "extendedNamedControls": extended,
        "conditionalBoxFamily": modulator_family(8),
        "boxMissControl": {"n": 131433121, "box8": box_miss, "firstFixedA": 27,
                           "separateDepth9Exploration": beyond_box},
        "manifestDigest": digest.hexdigest(),
        "scope": "Finite witnesses and named controls only. Infinite neutral tuples remain conditional on Dickson."}, indent=2))


if __name__ == "__main__":
    main()
