"""Independent, stdlib-only audit of a bounded Erdős–Straus A-family.

This intentionally does not import the product's TypeScript survey. It checks
each eligible prime and stops at the first admissible A. A finite interval
cannot establish the unbounded Erdős–Straus conjecture.

Example:
  python3 scripts/operations/verify-residual-interval-independent.py \
    --lower-exclusive=10000000 --upper-inclusive=20000000 --max-a=51
"""

import argparse
import hashlib
import json
from math import isqrt


def small_primes_through(limit: int) -> list[int]:
    sieve = bytearray(b"\x01") * (limit + 1)
    sieve[:2] = b"\x00\x00"
    for candidate in range(2, isqrt(limit) + 1):
        if sieve[candidate]:
            sieve[candidate * candidate :: candidate] = b"\x00" * (
                (limit - candidate * candidate) // candidate + 1
            )
    return [number for number, prime in enumerate(sieve) if prime]


def is_prime_by_trial(number: int, primes: list[int]) -> bool:
    for prime in primes:
        if prime * prime > number:
            return True
        if number % prime == 0:
            return False
    return True


def factor_by_prime_trial(number: int, primes: list[int]) -> dict[int, int]:
    factors: dict[int, int] = {}
    for prime in primes:
        if prime * prime > number:
            break
        while number % prime == 0:
            factors[prime] = factors.get(prime, 0) + 1
            number //= prime
    if number > 1:
        factors[number] = factors.get(number, 0) + 1
    return factors


def square_divisors(factors: dict[int, int]) -> list[int]:
    divisors = [1]
    for prime, exponent in factors.items():
        divisors = [
            divisor * prime**power
            for divisor in divisors
            for power in range(2 * exponent + 1)
        ]
    return sorted(divisors)


def first_admissible_result(number: int, max_a: int, primes: list[int]) -> tuple[int, int, int, int] | None:
    for a in range(3, max_a + 1, 4):
        x = (number + a) // 4
        b = number * x
        # number is prime and x < number for the supported input range.
        factors = factor_by_prime_trial(x, primes)
        factors[number] = 1
        for divisor in square_divisors(factors):
            if divisor > b:
                break
            partner = b * b // divisor
            if (b + divisor) % a == 0 and (b + partner) % a == 0:
                y = (b + divisor) // a
                z = (b + partner) // a
                assert 4 * x * y * z == number * (x * y + x * z + y * z)
                return a, x, y, z
    return None


def audit(lower_exclusive: int, upper_inclusive: int, max_a: int) -> dict:
    if not 840 <= lower_exclusive < upper_inclusive <= 200_000_000:
        raise ValueError("Require 840 <= lower < upper <= 200,000,000")
    if upper_inclusive - lower_exclusive > 100_000_000:
        raise ValueError("Limit each independent audit to at most 100,000,000 integers")
    if not 3 <= max_a <= 107 or max_a % 4 != 3:
        raise ValueError("max-a must be 3 (mod 4), from 3 through 107")

    primes = small_primes_through(isqrt(upper_inclusive))
    results: list[list[int | None]] = []
    product_manifest = hashlib.sha256(json.dumps({
        "method": "ERDOS_STRAUS_RESIDUAL_SURVEY_V3",
        "plan": {"kind": "ERDOS_STRAUS_RESIDUAL_A", "lowerExclusive": lower_exclusive,
                 "upperInclusive": upper_inclusive, "maxA": max_a},
    }, separators=(",", ":")).encode("ascii"))
    first_k = (lower_exclusive + 839) // 840
    for k in range(first_k, (upper_inclusive - 1) // 840 + 1):
        number = 840 * k + 1
        if number <= lower_exclusive or number > upper_inclusive:
            continue
        if is_prime_by_trial(number, primes):
            first = first_admissible_result(number, max_a, primes)
            first_a = first[0] if first else None
            results.append([number, first_a])
            product_manifest.update(json.dumps({
                "n": number, "maxA": max_a, "firstA": first_a,
                "witness": {"n": str(number), "x": str(first[1]), "y": str(first[2]),
                            "z": str(first[3])} if first else None,
            }, separators=(",", ":")).encode("ascii"))

    failures = [number for number, first_a in results if first_a is None]
    first_rescue = first_admissible_result(failures[0], 107, primes) if failures else None
    manifest = json.dumps(results, separators=(",", ":")).encode("ascii")
    return {
        "scope": {"lowerExclusive": lower_exclusive, "upperInclusive": upper_inclusive,
                  "residue": "prime n ≡ 1 (mod 840)", "maxA": max_a,
                  "firstDenominator": "x=(n+A)/4, A=3 (mod 4)"},
        "primeCount": len(results),
        "failureCount": len(failures),
        "failurePrimes": failures,
        "firstFailureRescueA": first_rescue[0] if first_rescue else None,
        "manifestSha256": hashlib.sha256(manifest).hexdigest(),
        "productManifestSha256V3": product_manifest.hexdigest(),
        "limitation": "Finite A-family interval only; not a theorem about all primes or Erdős–Straus.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lower-exclusive", type=int, required=True)
    parser.add_argument("--upper-inclusive", type=int, required=True)
    parser.add_argument("--max-a", type=int, default=51)
    args = parser.parse_args()
    print(json.dumps(audit(args.lower_exclusive, args.upper_inclusive, args.max_a), indent=2))


if __name__ == "__main__":
    main()
