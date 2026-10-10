"""Trusted local arithmetic only; no archive, author code, input or network.

Fraction derivation is independent of TypeScript. Range reduction and a
positive atanh tail enclose natural logs; all admission comparisons are exact.
This reproduces conditional numbers, not lattice/shape/properness premises.
"""
import json
import sys
from fractions import Fraction as F
from math import gcd

TERMS = 24
SOURCE = {"id": "arXiv:2609.02604v2", "url": "https://arxiv.org/html/2609.02604v2", "version": 2, "date": "2026-09-24"}


def rational(x):
    return {"numerator": str(x.numerator), "denominator": str(x.denominator)}


def encoded(interval):
    precision = 10 ** 12
    lo, hi = interval[0] * precision, interval[1] * precision
    return {"lower": rational(F(lo.numerator // lo.denominator, precision)),
            "upper": rational(F(-((-hi.numerator) // hi.denominator), precision))}


def plus(a, b):
    return (a[0] + b[0], a[1] + b[1])


def times(a, multiplier):
    values = (a[0] * multiplier, a[1] * multiplier)
    return (min(values), max(values))


def kernel(x):
    assert 1 <= x <= 2
    z = (x - 1) / (x + 1)
    lower = sum((2 * z ** (2 * j + 1) / (2 * j + 1) for j in range(TERMS)), F(0))
    remainder = 2 * z ** (2 * TERMS + 1) / ((2 * TERMS + 1) * (1 - z * z))
    return lower, lower + remainder


def logarithm(x):
    assert x > 0
    shift = 0
    while x >= 2:
        x /= 2
        shift += 1
    while x < 1:
        x *= 2
        shift -= 1
    precision = 2 ** 64
    scaled = x * precision
    integer = scaled.numerator // scaled.denominator
    lower_x = F(integer, precision)
    upper_x = F(integer + (scaled.denominator != 1), precision)
    return plus((kernel(lower_x)[0], kernel(upper_x)[1]), times(kernel(F(2)), shift))


def prime(n):
    if n < 2:
        return False
    divisor = 2
    while divisor * divisor <= n:
        if n % divisor == 0:
            return False
        divisor += 1
    return True


def decimal(x, up):
    # Integer-directed rounding, never floating point.
    x *= 1000000
    value = -((-x.numerator) // x.denominator) if up else x.numerator // x.denominator
    return ("-" if value < 0 else "") + str(abs(value) // 1000000) + "." + str(abs(value) % 1000000).zfill(6)


def display(a):
    return "[" + decimal(a[0], False) + ", " + decimal(a[1], True) + "]"


def target(n):
    shape = F(101, 200) if n == 13 else F(1, 2)
    prefix = [F(0)] + [F(2 * i, (n + 1) * (n + 1 - i)) ** 2 for i in range(1, n)]
    increments = [prefix[i] - prefix[i - 1] for i in range(1, n)]
    ratios = [increments[i + 1] / increments[i] for i in range(n - 2)]
    assert all(x > F(4, 3) for x in ratios)
    K = F(1)
    for x in increments:
        K *= x
    if n == 13:
        primes = [83, 139, 167, 181, 191] + [p for p in range(199, 480) if prime(p)] + [487, 491, 499, 503, 509, 521, 523, 541, 547]
    else:
        block = [89, 131, 149, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 241]
        primes = sorted(block + [p for p in range(239, 570) if prime(p) and p != 241])
    assert len(primes) == (61 if n == 13 else 71)
    assert len(set(primes)) == len(primes) and all(prime(p) for p in primes)
    product = 1
    for p in primes:
        product *= p
    lcm = 1
    for integer in range(2, 16):
        lcm = lcm * integer // gcd(lcm, integer)
    assert lcm == 360360 and gcd(lcm, product) == 1
    forced = lcm if n == 14 else 1
    bound = plus(times(logarithm(shape / n), n), times(logarithm(K), F(-n, 2)))
    log_primes = logarithm(F(product))
    log_forced = logarithm(F(forced))
    required = plus(log_primes, log_forced)
    margin = plus(required, times(bound, -1))
    published_upper = F(341032, 1000) if n == 13 else F(4147794, 10000)
    assert bound[1] < published_upper and margin[0] > 0
    return {"totalRunners": n + 1, "movingSpeeds": n, "status": "CONDITIONAL_ARITHMETIC_ONLY",
            "ci": [rational(x) for x in increments], "ratios": [rational(x) for x in ratios], "K": rational(K),
            "shapeConstant": rational(shape), "primes": primes, "primeProduct": str(product),
            "forcedDivisor": str(forced), "lcm2Through15": str(lcm), "coprime": True,
            "publishedUpperBound": rational(published_upper), "logBound": encoded(bound),
            "logPrimeProduct": encoded(log_primes), "logForcedDivisor": encoded(log_forced),
            "logRequiredProduct": encoded(required), "margin": encoded(margin),
            "display": {"logBound": display(bound), "logRequiredProduct": display(required), "margin": display(margin)}}


def main():
    result = {"version": 1, "source": SOURCE, "method": "RATIONAL_ATANH_RANGE_REDUCTION_24_DYADIC64_WIRE12",
              "status": "CONDITIONAL_ARITHMETIC_REPRODUCED", "globalVerdict": "NOT_ESTABLISHED",
              "assumptionsDischarged": False, "targets": [target(13), target(14)]}
    output = json.dumps(result, sort_keys=True, separators=(",", ":")) + "\n"
    assert len(output.encode("utf-8")) <= 262144
    sys.stdout.write(output)


if __name__ == "__main__":
    main()
