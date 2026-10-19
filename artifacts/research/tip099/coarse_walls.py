"""Generate geometric endpoint walls; n3/n4 are validation profiles only."""
from fractions import Fraction as F
from itertools import combinations
from functools import reduce
from math import gcd, lcm
import argparse
import json


def canonical(coefficients):
    if not any(coefficients[:4]):
        return None
    scale = lcm(*(x.denominator for x in coefficients))
    values = [int(x * scale) for x in coefficients]
    divisor = reduce(gcd, map(abs, values))
    values = [x // divisor for x in values]
    if next(x for x in values if x) < 0:
        values = [-x for x in values]
    return tuple(values)


def walls(n=5, pair_first=False):
    if n not in (3, 4, 5):
        raise ValueError("only n3/n4 validation and n5 target profiles")
    lines = []
    for j in range(1, n + 1):
        b = [F(0)] * 5
        if j < n:
            b[j - 1] = F(1)
        lines.append((F(j, n), tuple(b)))
        b[4] = F(1, n)
        lines.append((F(j - 1, n), tuple(b)))
    result = set()
    endpoint_walls = set()

    def admit(c):
        c = canonical(c)
        if c is not None:
            result.add(c)

    for (s, b), (t, c) in combinations(lines, 2):
        difference = tuple(x - y for x, y in zip(b, c))
        admit(difference)  # equal bottom intercepts, including parallel laws
        admit(difference[:4] + (difference[4] + s - t,))
    endpoint_walls.update(result)
    for (s, b), (t, c), (u, d) in combinations(lines, 3):
        admit(tuple((t - s) * (z - x) - (u - s) * (y - x)
                    for x, y, z in zip(b, c, d)))
    if not pair_first:
        return sorted(result)
    decisive = set()
    for j, k in combinations(range(n), 2):
        difference = [F(0)] * 5
        if k < n - 1:
            difference[k] = F(1)
        difference[j] -= F(1)
        for threshold in (F(1, n), -F(k - j, n)):
            difference[4] = -threshold
            wall = canonical(difference)
            if wall not in result:
                raise ArithmeticError("pair separation wall missing from geometric set")
            decisive.add(wall)
    return (sorted(decisive) + sorted(endpoint_walls - decisive)
            + sorted(result - endpoint_walls - decisive))


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--n", type=int, default=5)
    p.add_argument("--out", required=True)
    p.add_argument("--pair-first", action="store_true")
    args = p.parse_args()
    generated = walls(args.n, args.pair_first)
    with open(args.out, "x") as output:
        output.write("\n".join(" ".join(map(str, wall)) for wall in generated) + "\n")
    print(json.dumps({"n": args.n, "wall_count": len(generated),
                      "scope": "TARGET" if args.n == 5 else "VALIDATION_ONLY",
                      "ordering": "PAIR_SEPARATION_FIRST" if args.pair_first else "LEXICOGRAPHIC"}))
