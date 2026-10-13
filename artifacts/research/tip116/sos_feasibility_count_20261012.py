"""Fixed circuit counts and existing-package inspection; no K6 sampling/SDP."""

from importlib import metadata, util
from itertools import product
from fractions import Fraction as F


def bitonic_pruned_count(n):
    wires = [False] * n + [True] * (64 - n)  # True denotes constant 1.
    gates = 0
    stage = 2
    while stage <= 64:
        stride = stage // 2
        while stride:
            for i in range(64):
                j = i ^ stride
                if j <= i:
                    continue
                ascending = (i & stage) == 0
                a, b = wires[i], wires[j]
                if not a and not b:
                    gates += 1
                elif a != b:
                    wires[i], wires[j] = ((False, True) if ascending else (True, False))
            stride //= 2
        stage *= 2
    assert wires == [False] * n + [True] * (64 - n)
    return gates


sort6 = [(0,4),(1,5),(2,3),(0,2),(1,3),(4,5),
         (0,1),(2,4),(3,5),(1,2),(3,4),(2,3)]
for bits in product((0,1), repeat=6):
    out = list(bits)
    for i, j in sort6:
        out[i], out[j] = min(out[i], out[j]), max(out[i], out[j])
    assert out == sorted(bits), (bits, out)
print('sort6 comparators:', len(sort6), '; zero-one circuit checks: 64 passed')
time_gates = bitonic_pruned_count(40)
print('pruned bitonic64 sort40 variable comparators:', time_gates)
gates = 80 + time_gates + 41 * (12 + 5)
nvars = 5 + gates
print('scalar gates:', gates, '; lifted variables:', nvars)
print('quadratic equalities:', gates, '; linear inequalities:', 2 * gates)
print('SOS degree2 Gram order:', nvars + 1)
print('SOS degree4 Gram order:', (nvars + 1) * (nvars + 2) // 2)
optimized_vars = nvars - 40
optimized_eq = gates - 80
print('one-variable clip model variables:', optimized_vars)
print('quadratic equalities:', optimized_eq,
      '; linear inequalities:', 2 * optimized_eq + 80,
      '; quadratic inequalities:', 80)
gram2 = optimized_vars + 1
gram4 = (optimized_vars + 1) * (optimized_vars + 2) // 2
print('optimized Gram degree2/order, dense bytes:', gram2, 8 * gram2 * gram2)
print('optimized Gram degree4/order, dense bytes:', gram4, 8 * gram4 * gram4)
for name in ('cvxpy', 'scipy', 'sympy', 'numpy', 'clarabel', 'scs', 'mosek', 'cvxopt'):
    present = util.find_spec(name) is not None
    try:
        version = metadata.version(name) if present else None
    except metadata.PackageNotFoundError:
        version = 'version unavailable'
    print(name, 'present=' + str(present), 'version=' + str(version))
if util.find_spec('cvxpy') is not None:
    import cvxpy
    print('cvxpy installed solvers:', cvxpy.installed_solvers())

# Exact two-atom functional for the MINIMAL degree-2 quadratic module only.
# These lifted assignments are deliberately NOT feasible K6 configurations.
zero, one, X = (F(0), F(0)), (F(1), F(1)), (F(2), F(-2))
add = lambda a, b: tuple(x + y for x, y in zip(a, b))
sub = lambda a, b: tuple(x - y for x, y in zip(a, b))
mul = lambda a, b: tuple(x * y for x, y in zip(a, b))
scale = lambda a, k: tuple(k * x for x in a)
expect = lambda a: sum(a) / 2
eqs, margins = [], []


def min_gate(a, b, chosen):
    eqs.append(mul(sub(chosen, a), sub(chosen, b)))
    margins.extend((sub(a, chosen), sub(b, chosen)))
    return chosen


apices = [scale(X, -1)] * 5 + [zero]  # A6=0 gauge.
events = []
for i in range(6):
    for j in range(i + 1, 6):
        d = j - i
        for denominator in ([d, d + 1, d - 1] if d > 1 else [d, d + 1]):
            c = scale(sub(apices[j], apices[i]), F(1, denominator))
            tau = c
            margins.extend((tau, sub(one, tau),
                            mul(sub(c, tau), tau),
                            mul(sub(tau, c), sub(one, tau))))
            q = c[0] / 2
            events.append((-q, tau, False))  # Reverse coefficient rank.
assert len(events) == 40
events += [(float('inf'), one, True)] * 24
stage = 2
while stage <= 64:
    stride = stage // 2
    while stride:
        for i in range(64):
            j = i ^ stride
            if j <= i:
                continue
            a, b = events[i], events[j]
            low, high = (a, b) if a[0] <= b[0] else (b, a)
            if not a[2] and not b[2]:
                min_gate(a[1], b[1], low[1])
            events[i], events[j] = ((low, high) if (i & stage) == 0 else (high, low))
        stride //= 2
    stage *= 2
assert all(not event[2] for event in events[:40])
assert all(event[2] for event in events[40:])
times = [zero] + [event[1] for event in events[:40]] + [one]
assert times[1] == X and times[40] == zero
lengths = [zero]
for k, tau in enumerate(times[1:], start=1):
    nodes = [((j if k <= 40 else -j), sub(apices[j - 1], scale(tau, j)))
             for j in range(1, 7)]
    for i, j in sort6:
        a, b = nodes[i], nodes[j]
        low, high = (a, b) if a[0] <= b[0] else (b, a)
        min_gate(a[1], b[1], low[1])
        nodes[i], nodes[j] = low, high
    ell = tau
    for i in range(5):
        gap = sub(nodes[i + 1][1], nodes[i][1])
        ell = add(ell, min_gate(tau, gap, gap))
    assert ell == (sub(X, scale(tau, 4)) if k <= 40 else sub(scale(one, 6), X))
    lengths.append(ell)
area = zero
for k in range(41):
    area = add(area, scale(mul(sub(times[k + 1], times[k]),
                              add(lengths[k + 1], lengths[k])), F(1, 2)))
P = sub(area, scale(one, F(40, 31)))
assert len(eqs) == 1085 and len(margins) == 2330
assert all(value == zero for value in eqs)
assert all(expect(value) >= 0 for value in margins)
assert area == (F(1), F(1)) and expect(P) == -F(9, 31)
print('minimal degree2 QM exact diagnostic: h=0 for', len(eqs),
      '; E[g]>=0 for', len(margins), '; E[P]=', expect(P))
print('redundant/product tau_max*(1-tau_max) has expectation:',
      expect(mul(times[1], sub(one, times[1]))))
