"""Bounded independent replay. Enumerates factor pairs, not inverse residues.

No imports from the primary TypeScript implementation or its stored outputs.
This verifies normalized sufficient constructions only, never the open conjecture.
"""
import argparse
import hashlib
import json
import math


def prime(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, math.isqrt(n) + 1))


def replay(n, bound, mode):
    result = dict(n=n, maxS=bound, mode=mode,
                  status="NOT_FOUND_IN_S_INTERVAL", firstS=None,
                  construction=None, witness=None, strictDigest=None)
    for s in range(3, bound + 1, 4):
        if mode == "PRIME_ONLY_DIAGNOSTIC" and not prime(s):
            continue
        m = (s + 1) // 4
        for a in range(1, m + 1):
            if m % a:
                continue
            for u in range(1, m // a + 1):
                if m % (a * u) or math.gcd(a, u) != 1:
                    continue
                if (a * n + u) % s:
                    continue
                v = (a * n + u) // s
                k = m // (a * u)
                if (u + v) % a or ((u + v) // a) % 4 != 3:
                    raise ValueError("Construction invariant failed")
                x, y, z = sorted((u * v * k, a * n * u * k, a * n * v * k))
                if not 0 < x < y < z or 4 * x * y * z != n * (y*z + x*z + x*y):
                    continue
                if sum(d % n == 0 for d in (x, y, z)) != 2:
                    raise ValueError("Type II invariant failed")
                identity = f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{n}:{x}:{y}:{z}"
                result.update(status="WITNESS", firstS=s,
                              construction=dict(a=a, u=u, s=s, v=v, k=k, shift=(u+v)//a),
                              witness=dict(n=str(n), x=str(x), y=str(y), z=str(z)),
                              strictDigest=hashlib.sha256(identity.encode()).hexdigest())
                return result
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, required=True)
    parser.add_argument("--max-s", type=int, required=True)
    parser.add_argument("--mode", choices=("ALL", "PRIME_ONLY_DIAGNOSTIC"), required=True)
    args = parser.parse_args()
    if not (841 <= args.n <= 200000000 and args.n % 840 == 1 and prime(args.n)):
        parser.error("Residual prime required")
    if not 3 <= args.max_s <= 4095:
        parser.error("Bound must be 3..4095")
    print(json.dumps(replay(args.n, args.max_s, args.mode), separators=(",", ":")))
