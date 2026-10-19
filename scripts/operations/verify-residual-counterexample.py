"""Independent stdlib-only audit of a bounded Erdős–Straus first-denominator claim.

Usage: python3 scripts/operations/verify-residual-counterexample.py 10051441
This deliberately does not import the TypeScript survey or trust its factors.
"""

import argparse
import json
from math import isqrt, prod


def prime_by_trial(n: int) -> bool:
    if n < 2:
        return False
    for divisor in range(2, isqrt(n) + 1):
        if n % divisor == 0:
            return False
    return True


def factor_by_trial(n: int) -> dict[int, int]:
    factors: dict[int, int] = {}
    divisor = 2
    while divisor * divisor <= n:
        while n % divisor == 0:
            factors[divisor] = factors.get(divisor, 0) + 1
            n //= divisor
        divisor += 1
    if n > 1:
        factors[n] = factors.get(n, 0) + 1
    return factors


def divisors(factors: dict[int, int]) -> list[int]:
    result = [1]
    for prime, exponent in factors.items():
        result = [base * prime**power for base in result for power in range(exponent + 1)]
    return sorted(result)


def audit(n: int, max_a: int) -> dict:
    if not 841 <= n <= 200_000_000 or n % 840 != 1 or not prime_by_trial(n):
        raise ValueError("n must be a prime ≡ 1 (mod 840), between 841 and 200,000,000")
    if not 3 <= max_a <= 107 or max_a % 4 != 3:
        raise ValueError("max-a must be 3 (mod 4), from 3 through 107")
    rows = []
    for a in range(3, max_a + 1, 4):
        x = (n + a) // 4
        b = n * x
        factor_b = factor_by_trial(b)
        assert all(prime_by_trial(p) for p in factor_b)
        assert b == prod(p**e for p, e in factor_b.items())
        factor_square = {p: 2 * e for p, e in factor_b.items()}
        eligible = []
        examined = 0
        for d in divisors(factor_square):
            if d > b:
                break
            examined += 1
            other = b * b // d
            if (b + d) % a == 0 and (b + other) % a == 0:
                y, z = (b + d) // a, (b + other) // a
                assert 4 * x * y * z == n * (x * y + x * z + y * z)
                eligible.append({"d": d, "y": y, "z": z})
        rows.append({"A": a, "x": x, "factorB": factor_b, "divisorsChecked": examined,
                     "admissiblePairCount": len(eligible), "firstWitness": eligible[0] if eligible else None})
    return {"n": n, "primeByTrial": True, "residue840": n % 840, "maxA": max_a,
            "rows": rows, "firstSuccessfulA": next((row["A"] for row in rows if row["admissiblePairCount"]), None),
            "scope": "Exhaustive only for this n and the declared x=(n+A)/4 family."}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("n", type=int)
    parser.add_argument("--max-a", type=int, default=59)
    args = parser.parse_args()
    print(json.dumps(audit(args.n, args.max_a), indent=2))


if __name__ == "__main__":
    main()
