"""Read-only fixed replay, stdlib only; integer divisor pairs, not signed boxes.

Independence is implementation-level, not a second model/formal proof.
No inputs, network, environment credentials, writes, or application imports.
"""
import hashlib
import json
import math


def factor(n):
    out = []
    q = 2
    while q*q <= n:
        e = 0
        while n % q == 0:
            n //= q
            e += 1
        if e:
            out.append(dict(prime=q, exponent=e))
        q += 1
    if n > 1:
        out.append(dict(prime=n, exponent=1))
    return out


def divisors_from_core(core, scale):
    ds = [1]
    for f in core:
        ds = [d*f["prime"]**e for d in ds for e in range(scale*f["exponent"]+1)]
    return sorted(ds)


def atlas(m):
    s, core = 4*m-1, factor(m)
    ds, ds2 = divisors_from_core(core, 1), divisors_from_core(core, 2)
    fibers = {}
    for a in ds:
        for u in ds:
            if m % (a*u) or math.gcd(a, u) != 1:
                continue
            r = -u*pow(a, -1, s) % s
            fibers[r] = fibers.get(r, 0)+1
    kernel = []
    for A in ds2:
        for U in ds2:
            if U >= A:
                break
            if m*m % (A*U) or math.gcd(A, U) != 1 or (A-U) % s:
                continue
            h = []
            for f in core:
                q, x, y, t = f["prime"], A, U, 0
                while x % q == 0:
                    x //= q
                    t += 1
                while y % q == 0:
                    y //= q
                    t -= 1
                h.append(t)
            weight = math.prod(2*f["exponent"]+1-abs(t) for f, t in zip(core, h))
            kernel.append(dict(h=h, A=str(A), U=str(U), k=str((A-U)//s), weight=weight))
    P = sum(fibers.values())
    collision_pairs = sum(h["weight"] for h in kernel)
    energy = P+2*collision_pairs
    assert energy == sum(size*size for size in fibers.values())
    a = next((f["exponent"] for f in core if f["prime"] == 2), 0)
    E = (a-1)*math.prod(f["exponent"]+1 for f in core if f["prime"] != 2) if a >= 2 else 0
    lower = max(1, P-collision_pairs, (P*P+energy-1)//energy)
    R = len(fibers)
    assert lower <= R <= P-E
    max_fiber = max(fibers.values())
    assert max_fiber > 2 or R == P-collision_pairs
    digest = hashlib.sha256(json.dumps(sorted(fibers), separators=(",", ":")).encode()).hexdigest()
    return dict(m=m, s=s, sIsPrime=not any(s % q == 0 for q in range(2, math.isqrt(s)+1)),
                core=core, pairCount=P, knownEdges=E, knownRelationBound=P-E,
                positiveKernel=kernel, collisionPairs=collision_pairs, energy=energy,
                lowerBound=lower, residueCount=R, maxFiber=max_fiber,
                extraCollisions=P-E-R, residuesDigest=digest)


family = []
for d in range(1, 10):
    X, Y = 64*d+8, 16*d+1
    m, A, U = d*X*Y, d*X*X, Y*Y
    s = 4*m-1
    assert A-U == s and m*m % (A*U) == 0
    assert math.gcd(d*X, Y) == math.gcd(X, Y) == 1
    assert (-Y*pow(d*X, -1, s)) % s == (-X*pow(Y, -1, s)) % s
    family.append(dict(d=d, X=str(X), Y=str(Y), m=str(m), s=str(s),
                       A=str(A), U=str(U), extraMatchingEdges=len(divisors_from_core(factor(d), 1))))

print(json.dumps(dict(method="ERDOS_STRAUS_COLLISION_KERNEL_V1",
                     rows=[atlas(m) for m in [1, 4, 36, 1224, 132840, 360696]],
                     polynomialFamily=family,
                     scope="Exact fixed-core collision/energy certificates only; no uniform target hitting, root proof, formal verification or novelty certification; not retained in an agent cycle"),
                 separators=(",", ":")))
