"""Independent fixed-A=11 replay: written classification vs full B² divisors.

Only the standard library is used. The residue test for Type II uses factors
of x alone; the complete gate enumerates factors of B=px, including p.
"""

import argparse
import hashlib
import json
from itertools import product
from math import isqrt


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


def signed_residues(values):
    residues = {1}
    for q, e in values.items():
        residues = {r * pow(q, t, 11) % 11 for r in residues for t in range(-e, e + 1)}
    return residues


def direct_gate(p, a, values):
    x = (p + a) // 4
    b = p * x
    ds = [1]
    for q, e in values.items():
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


def residual_obstruction(p, xf):
    # Independent, simplified theorem exploiting the forced factor 3 of x.
    if all(q % 11 in {1, 3, 4, 5, 9} for q in xf):
        return "QR_ONLY"
    if xf.get(3) != 1:
        return None
    if any(q != 3 and q % 11 in {3, 4, 5, 9} for q in xf):
        return None
    if any(q % 11 in {7, 8, 10} for q in xf):
        return None
    nr = sum(e for q, e in xf.items() if q % 11 in {2, 6})
    if nr == 1 or (nr == 2 and p % 11 == 1):
        return "THIN_PRIMITIVE"
    return None


def group_table():
    count = 0
    # Every arbitrary exponent profile reduces to these saturation caps.
    for a, b, c, d, e in product(range(6), range(3), range(6), range(3), range(2)):
        residues = {0}
        for step, bound in enumerate((a, b, c, d, e), 1):
            residues = {(r + step * t) % 10 for r in residues for t in range(-bound, bound + 1)}
        predicted_closed = e == 0 and (
            (a == c == 0)
            or (b + d == 0 and ((c == 0 and a <= 4) or (a == 0 and c <= 4) or (a == c == 1)))
            or (b + d == 1 and ((b == 1 and c == 0 and a <= 2) or (d == 1 and a == 0 and c <= 2)))
        )
        assert predicted_closed == (5 not in residues), (a, b, c, d, e)
        count += 1
    return count


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
    counts, survivors, examples, survivor_examples = {}, {}, {}, {}
    digest = hashlib.sha256()
    prime_count = 0
    classes = {2: 0, 6: 0, 3: 1, 4: 1, 7: 2, 8: 2, 5: 3, 9: 3, 10: 4}
    for p in range(841, args.limit + 1, 840):
        if not sieve[p // 2]:
            continue
        x = (p + 11) // 4
        xf = factors(x)
        bf = {**xf, p: 1}
        witness = direct_gate(p, 11, bf)
        obstruction = residual_obstruction(p, xf)
        assert (obstruction is None) == (witness is not None), p
        type_ii_open = 10 in signed_residues(xf)
        assert not type_ii_open or witness is not None, p
        closed_3 = all(q % 3 == 1 for q in factors((p + 3) // 4))
        closed_7 = all(q % 7 in {1, 2, 4} for q in factors((p + 7) // 4))
        key = obstruction or ("TYPE_II_OPEN" if type_ii_open else "TYPE_I_RESCUE")
        counts[key] = counts.get(key, 0) + 1
        if closed_3 and closed_7:
            survivors[key] = survivors.get(key, 0) + 1
        sample = {"p": p, "x": x, "factorX": xf, "pResidue11": p % 11, "witness": witness}
        examples.setdefault(key, sample)
        if closed_3 and closed_7:
            survivor_examples.setdefault(key, sample)
        weights = [0] * 5
        for q, e in bf.items():
            if q % 11 in classes:
                weights[classes[q % 11]] += e
        row = {"n": p, "status": "WITNESS" if witness else "OBSTRUCTED",
               "typeIIStatus": "WITNESS" if type_ii_open else "OBSTRUCTED",
               "obstruction": obstruction, "weights": weights, "twoGateClosed": closed_3 and closed_7}
        digest.update(json.dumps(row, separators=(",", ":")).encode())
        prime_count += 1
    print(json.dumps({"limit": args.limit, "primeCount": prime_count, "finiteGroupProfilesChecked": group_table(),
                      "counts": counts, "afterA3A7": survivors, "examples": examples,
                      "afterA3A7Examples": survivor_examples, "manifestDigest": digest.hexdigest(),
                      "scope": "Full finite A=11 gate replay; the classification is proved in the accompanying note, not inferred from the scan."}, indent=2))


if __name__ == "__main__":
    main()
