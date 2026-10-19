"""Fixed, bounded independent replay. No inputs, network, credentials or writes.

Python enumerates integer divisor pairs; TypeScript uses signed valuation boxes.
The all-single-core replay uses trial divisor/primality loops, not the TS sieve.
"""
import hashlib
import json
import math


def digest(value):
    return hashlib.sha256(json.dumps(value, separators=(",", ":")).encode()).hexdigest()


def factor(n):
    result = []
    q = 2
    while q*q <= n:
        e = 0
        while n % q == 0:
            n //= q
            e += 1
        if e:
            result.append(dict(prime=q, exponent=e))
        q += 1
    if n > 1:
        result.append(dict(prime=n, exponent=1))
    return result


def divisors(n):
    out = []
    for d in range(1, math.isqrt(n)+1):
        if n % d == 0:
            out.append(d)
            if d*d != n:
                out.append(n//d)
    return sorted(out)


def pairs(m):
    return [(a, u) for a in divisors(m) for u in divisors(m//a) if math.gcd(a, u) == 1]


def atlas(m):
    s, core = 4*m-1, factor(m)
    ps = pairs(m)
    residues = sorted({(-u*pow(a, -1, s)) % s for a, u in ps})
    a = next((f["exponent"] for f in core if f["prime"] == 2), 0)
    edges = ((a-1)*math.prod(f["exponent"]+1 for f in core if f["prime"] != 2)) if a >= 2 else 0
    bound = len(ps)-edges
    assert len(residues) <= bound
    return dict(m=m, s=s, core=core, pairCount=len(ps), knownEdges=edges,
                knownRelationBound=bound, residueCount=len(residues),
                extraCollisions=bound-len(residues), residuesDigest=digest(residues))


def single(p):
    max_m = (p+1)//2
    candidates = {}
    for n in [p+1, p+4, 4*p+1]:
        for s in divisors(n):
            q = (s+1)//4
            if s >= 7 and s % 4 == 3 and s <= 2*p+1 and factor(q) == [dict(prime=q, exponent=1)]:
                candidates[s] = (q, 1)
    for q in range(2, math.isqrt(max_m)+1):
        if factor(q) != [dict(prime=q, exponent=1)]:
            continue
        m, e = q*q, 2
        while m <= max_m:
            candidates[4*m-1] = (q, e)
            m *= q
            e += 1
    rows = []
    for s, (q, e) in sorted(candidates.items()):
        ps = {(1, q**j) for j in range(e+1)} | {(q**j, 1) for j in range(e+1)}
        hit = any((a*p+u) % s == 0 for a, u in ps)
        rows.append([s, q, e, p % s, hit])
    return dict(candidatesChecked=len(rows), tailFromS=2*p+2,
                hitS=[r[0] for r in rows if r[4]], rowsDigest=digest(rows))


def two(p):
    count = 0
    for s in range(3, 4096, 4):
        m = (s+1)//4
        core = factor(m)
        if len(core) != 2:
            continue
        count += 1
        for a, u in pairs(m):
            if (a*p+u) % s:
                continue
            v, k = (a*p+u)//s, m//(a*u)
            x, y, z = sorted((u*v*k, a*p*u*k, a*p*v*k))
            assert 0 < x < y < z and 4*x*y*z == p*(x*y+x*z+y*z)
            assert sum(d % p == 0 for d in [x, y, z]) == 2
            strict = hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()
            return dict(p=p, maxS=4095, coresChecked=count, status="WITNESS", firstS=s,
                        core=core, construction=dict(a=a, u=u, s=s, v=v, k=k),
                        witness=dict(n=str(p), x=str(x), y=str(y), z=str(z)), strictDigest=strict)
    return dict(p=p, maxS=4095, coresChecked=count, status="NOT_FOUND_IN_TWO_CORE_S_INTERVAL",
                firstS=None, core=None, construction=None, witness=None, strictDigest=None)


certificates = []
for p in [131433121, 159727681, 351121, 171348241]:
    assert p % 840 == 1 and factor(p) == [dict(prime=p, exponent=1)]
    lower, upper = single(p), two(p)
    minimum = 1 if lower["hitS"] else 2 if upper["witness"] else None
    certificates.append(dict(p=p, maxS=4095, minimumSupport=minimum,
                             status="UNRESOLVED" if minimum is None else "EXACT_FOR_THIS_NORMALIZED_FAMILY",
                             singleCore=lower, twoCore=upper))
rows = []
for m in range(1, 1025):
    a = atlas(m)
    rows.append([m, a["pairCount"], a["knownEdges"], a["knownRelationBound"], a["residueCount"], a["residuesDigest"]])
X, Y = 72, 17
a = atlas(X*Y)
r = (-Y*pow(X, -1, a["s"])) % a["s"]
assert (X-2*Y)**2-5*Y*Y == -1 and math.gcd(X, Y) == 1
assert r == (-X*pow(Y, -1, a["s"])) % a["s"] and a["extraCollisions"] > 0
print(json.dumps(dict(method="ERDOS_STRAUS_MIXED_CORE_PACKET_V1", certificates=certificates,
                      finiteCollisionAudit=dict(maxM=1024, rows=len(rows),
                                               extraCollisionRows=sum(r[3] != r[4] for r in rows), rowsDigest=digest(rows)),
                      pellCounterexample=dict(X=X, Y=Y, residue=r, atlas=a)), separators=(",", ":")))
