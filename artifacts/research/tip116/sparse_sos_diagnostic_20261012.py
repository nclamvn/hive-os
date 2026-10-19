"""One exact small preflight: five-wire sorting and analytical dual arithmetic."""
from fractions import Fraction as F
from itertools import product

network = [(0,3),(1,4),(0,2),(1,3),(0,1),(2,4),(1,2),(3,4),(2,3)]
for bits in product((0,1), repeat=5):
    out = list(bits)
    for i, j in network:
        out[i], out[j] = min(out[i], out[j]), max(out[i], out[j])
    assert out == sorted(bits), (bits, out)
print('five-wire network: 9 comparators; 32 zero-one checks passed')

atoms = [(F(1), F(3,4)), (F(-3), F(1,4))]
expect = lambda fn: sum(weight * fn(z) for z, weight in atoms)
alphas = []
for i in range(6):
    for j in range(i + 1, 6):
        d = j - i
        for den in ([d, d + 1, d - 1] if d > 1 else [d, d + 1]):
            alpha = F(d, den)
            alphas.append(alpha)
            assert expect(lambda z: -alpha*z) == 0
            assert expect(lambda z: -(alpha*z)*(alpha*z+3*alpha)**2) == -12*alpha**3
assert len(alphas) == 40
b = lambda z: F(int(z > 0))
for z, weight in atoms:
    assert b(z)*z >= 0 and -(1-b(z))*z >= 0
boundary = lambda z: 3-5*b(z)*z
assert boundary(F(1)) == -2 and boundary(F(-3)) == 3
assert expect(boundary) == -F(3,4)
assert expect(lambda z: boundary(z)-F(40,31)) == -F(253,124)
print('boundary lifted dual: E[G]=-3/4; E[P]=-253/124; all 40 E[-c]=0')
print('clip degree4 multiplier diagnostic: E[-c*(c+3alpha)^2]=-12alpha^3')

def multiply(a, b):
    out = {}
    for (i,j), av in a.items():
        for (k,l), bv in b.items():
            key = i+k, j+l
            out[key] = out.get(key, 0) + av*bv
    return {key: value for key, value in out.items() if value}

plus = multiply({(1,1):1,(0,2):-1}, {(0,0):1,(0,1):-2,(0,2):1})
minus = multiply({(0,1):1,(1,0):-1,(0,2):-1,(1,1):1}, {(0,2):1})
assert plus[(0,4)] == minus[(0,4)] == -1
print('hybrid leading coefficients: gplus*(1-tau)^2 and gminus*tau^2 both tau^4=-1')
print('boundary model variables=578; equalities linear=216 quadratic=533; inequalities linear=498 quadratic=90')
