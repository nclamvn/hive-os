"""Fixed public 101-gon sample: outward-rounded, integer-only enclosure.

The program deliberately has no published answer or model-authored source as
input. All real quantities are enclosed by integer pairs scaled by 10**80.
"""

import json
from fractions import Fraction
from math import factorial, isqrt


N = 101
DIGITS = 80
S = 10**DIGITS
P = Fraction(1, 1000)
Q = Fraction(999, 1000)
TAYLOR_TERMS = 80


def ceil_div(a, b):
    return -((-a) // b)


def rat(a, b=1):
    assert b > 0
    return (a * S // b, ceil_div(a * S, b))


def add(x, y):
    return (x[0] + y[0], x[1] + y[1])


def neg(x):
    return (-x[1], -x[0])


def sub(x, y):
    return add(x, neg(y))


def times(x, n):
    assert n >= 0
    return (x[0] * n, x[1] * n)


def mul(x, y):
    products = (x[0] * y[0], x[0] * y[1], x[1] * y[0], x[1] * y[1])
    return (min(products) // S, ceil_div(max(products), S))


def div_pos_int(x, n):
    assert n > 0
    return (x[0] // n, ceil_div(x[1], n))


def div(x, y):
    assert y[0] > 0 or y[1] < 0
    corners = tuple((a * S, b) for a in x for b in y)
    return (min(a // b for a, b in corners),
            max(ceil_div(a, b) for a, b in corners))


def sqrt(x):
    assert x[0] >= 0
    lo = isqrt(x[0] * S)
    hi = isqrt(x[1] * S)
    return (lo, hi if hi * hi == x[1] * S else hi + 1)


def atan_inverse(q, terms):
    partial = Fraction(0)
    for k in range(terms):
        term = Fraction(1, (2 * k + 1) * q ** (2 * k + 1))
        partial += term if k % 2 == 0 else -term
    next_term = Fraction(1, (2 * terms + 1) * q ** (2 * terms + 1))
    endpoint = partial + (next_term if terms % 2 == 0 else -next_term)
    low, high = sorted((partial, endpoint))
    return (rat(low.numerator, low.denominator)[0],
            rat(high.numerator, high.denominator)[1])


# Machin's exact identity and the alternating arctan remainder enclose pi.
PI = sub(times(atan_inverse(5, 90), 16), times(atan_inverse(239, 30), 4))
assert PI[0] > 3 * S and PI[1] < 4 * S
assert 7 ** (2 * TAYLOR_TERMS + 1) * S < factorial(2 * TAYLOR_TERMS + 1)
assert 7 ** (2 * TAYLOR_TERMS) * S < factorial(2 * TAYLOR_TERMS)


def sin_cos(angle):
    assert 0 <= angle[0] <= angle[1] < 7 * S
    angle2 = mul(angle, angle)
    sine_term = angle
    cosine_term = rat(1)
    sine = sine_term
    cosine = cosine_term
    for k in range(1, TAYLOR_TERMS):
        sine_term = div_pos_int(mul(sine_term, angle2), (2 * k) * (2 * k + 1))
        cosine_term = div_pos_int(mul(cosine_term, angle2), (2 * k - 1) * (2 * k))
        sine = add(sine, sine_term if k % 2 == 0 else neg(sine_term))
        cosine = add(cosine, cosine_term if k % 2 == 0 else neg(cosine_term))
    # Taylor's Lagrange remainder is < 1/S for both series on [0, 7].
    return (sine[0] - 1, sine[1] + 1), (cosine[0] - 1, cosine[1] + 1)


def point(j):
    if j == 0:
        return (rat(1), rat(0))
    angle = div_pos_int(times(PI, 2 * j), N)
    sine, cosine = sin_cos(angle)
    return (cosine, sine)


POINTS = tuple(point(j) for j in range(N))
DIAGONALS = tuple((a, b) for a in range(N) for b in range(a + 2, N)
                  if not (a == 0 and b == N - 1))
assert len(DIAGONALS) == N * (N - 3) // 2


def vsub(x, y):
    return (sub(x[0], y[0]), sub(x[1], y[1]))


def cross(x, y):
    return sub(mul(x[0], y[1]), mul(x[1], y[0]))


def length(x):
    return sqrt(add(mul(x[0], x[0]), mul(x[1], x[1])))


POWERS = [rat(1)]
q_interval = rat(Q.numerator, Q.denominator)
for _ in DIAGONALS:
    POWERS.append(mul(POWERS[-1], q_interval))


def representative(k):
    """Integral of q**N(x) on (0,k), excluding (0,k) when it is a diagonal.

    In a convex cyclic polygon, chords (0,k) and (a,b) cross in their open
    interiors exactly when 0<a<k<b. At 0+, the point is left of (a,b) for
    a>0, and left of (0,b) exactly when b<k. The center is left of (a,b)
    exactly when b-a<=50. These exact order tests determine the initial N
    and every sign change; floating-point orientation is never consulted.
    """
    initial = 0
    events = []
    direction = vsub(POINTS[k], POINTS[0])
    for a, b in DIAGONALS:
        if a == 0 and b == k:
            continue
        center_left = b - a <= 50
        start_left = (a > 0) or (b < k)
        separated = center_left != start_left
        initial += separated
        if 0 < a < k < b:
            other = vsub(POINTS[b], POINTS[a])
            numerator = cross(vsub(POINTS[a], POINTS[0]), other)
            denominator = cross(direction, other)
            t = div(numerator, denominator)
            assert 0 < t[0] <= t[1] < S
            events.append(((t[0] + t[1]) // 2, t[1] - t[0],
                           -1 if separated else 1))
    events.sort(key=lambda event: event[0])
    count = initial
    previous = 0
    midpoint_integral = rat(0)
    uncertain_width = 0
    for position, width, change in events:
        assert previous <= position <= S
        assert 0 <= count < len(POWERS)
        midpoint_integral = add(midpoint_integral,
                                mul((position - previous, position - previous), POWERS[count]))
        previous = position
        uncertain_width += width
        count += change
    assert 0 <= count < len(POWERS)
    midpoint_integral = add(midpoint_integral,
                            mul((S - previous, S - previous), POWERS[count]))

    # Outside the union of crossing-position intervals, the exact and
    # midpoint event sets have identical N. Inside, both q**N are in [0,1].
    # Union length is at most the sum of interval widths even at concurrence.
    integral = (max(0, midpoint_integral[0] - uncertain_width),
                min(S, midpoint_integral[1] + uncertain_width))
    return mul(length(direction), integral), len(events), uncertain_width


side, side_events, side_width = representative(1)
assert side_events == 0 and side_width == 0
diagonal_total = rat(0)
event_count = 0
uncertainty = 0
for k in range(2, 51):
    result, events, width = representative(k)
    diagonal_total = add(diagonal_total, result)
    event_count += events
    uncertainty += width

# Each representative diagonal length 2..50 has 101 rotational copies.
expectation = times(add(side, mul(rat(P.numerator, P.denominator), diagonal_total)), N)
scaled = times(expectation, 10**9)
lower_floor, upper_floor = scaled[0] // S, scaled[1] // S
print(json.dumps({
    "method": "INTERVAL_101GON_V1",
    "scaleDigits": DIGITS,
    "lowerScaled": str(scaled[0]),
    "upperScaled": str(scaled[1]),
    "floor": str(lower_floor) if lower_floor == upper_floor else None,
    "eventCount": event_count,
    "crossingWidthScaled": str(uncertainty),
}, separators=(",", ":")))
