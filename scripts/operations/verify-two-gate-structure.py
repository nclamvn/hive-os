#!/usr/bin/env python3
"""Independent, stdlib-only finite replay of the two-gate structural lemma."""

from __future__ import annotations


def factors(value: int) -> dict[int, int]:
    found: dict[int, int] = {}
    divisor = 2
    while divisor * divisor <= value:
        while value % divisor == 0:
            found[divisor] = found.get(divisor, 0) + 1
            value //= divisor
        divisor += 1 if divisor == 2 else 2
    if value > 1:
        found[value] = found.get(value, 0) + 1
    return found


def divisors_of_square(prime_factors: dict[int, int]) -> list[int]:
    divisors = [1]
    for prime, exponent in prime_factors.items():
        previous = divisors
        divisors = []
        power = 1
        for _ in range(2 * exponent + 1):
            divisors.extend(d * power for d in previous)
            power *= prime
    return divisors


def direct_gate(p: int, a: int) -> bool:
    x = (p + a) // 4
    b = p * x
    b_factors = factors(x)
    b_factors[p] = b_factors.get(p, 0) + 1
    for d in divisors_of_square(b_factors):
        if d <= b and (b + d) % a == 0 and (b + b * b // d) % a == 0:
            y, z = (b + d) // a, (b + b * b // d) // a
            assert 4 * x * y * z == p * (x * y + x * z + y * z)
            return True
    return False


def predicted_gate(p: int, a: int) -> tuple[bool, int | None]:
    x = (p + a) // 4
    x_factors = factors(x)
    if a == 3:
        for q in x_factors:
            if q % 3 == 2:
                return True, q
    else:
        multipliers = {3: 4, 5: 1, 6: 2}
        for q in x_factors:
            if q % 7 in multipliers:
                return True, multipliers[q % 7] * q
    return False, None


def main() -> None:
    samples = [p for p in range(841, 200_001, 840) if factors(p) == {p: 1}]
    samples.extend([10_051_441, 171_348_241])
    gate_counts = {3: 0, 7: 0}
    closed_both: list[int] = []
    for p in samples:
        assert factors(p) == {p: 1} and p % 840 == 1
        results: dict[int, bool] = {}
        for a in (3, 7):
            predicted, d = predicted_gate(p, a)
            actual = direct_gate(p, a)
            assert predicted == actual, (p, a, predicted, actual)
            if d is not None:
                x = (p + a) // 4
                b = p * x
                assert x * x % d == 0 and d <= b
                assert (b + d) % a == 0 and (b + b * b // d) % a == 0
                y, z = (b + d) // a, (b + b * b // d) // a
                assert 4 * x * y * z == p * (x * y + x * z + y * z)
                gate_counts[a] += 1
            results[a] = actual
        if not results[3] and not results[7]:
            closed_both.append(p)
    for p in (2521, 10_051_441, 171_348_241):
        assert p in closed_both, p
    assert {3: (4 * 3) % 7, 5: 5 % 7, 6: (2 * 6) % 7} == {3: 5, 5: 5, 6: 5}
    qr = {1, 2, 4}
    assert {a * b % 7 for a in qr for b in qr} == qr and 5 not in qr
    print(f"PASS: {len(samples)} primes, {2 * len(samples)} full B² factor-pair replays")
    print(f"Gate witnesses: A=3 {gate_counts[3]}, A=7 {gate_counts[7]}; both closed {len(closed_both)}")
    print(f"Anchor cases: {', '.join(str(p) for p in (2521, 10_051_441, 171_348_241))}")


if __name__ == "__main__":
    main()
