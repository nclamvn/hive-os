"""Independent full-cycle products, integer factor pairs, and Euler characters."""
import hashlib
import json
import math


def factor(n):
    out = []
    d = 2
    while d*d <= n:
        e = 0
        while n % d == 0:
            n //= d
            e += 1
        if e:
            out.append((d, e))
        d += 1
    if n > 1:
        out.append((n, 1))
    return out


def character(r, s):
    if math.gcd(r, s) != 1:
        return 0
    value = 1
    for q, e in factor(s):
        value *= (-1 if pow(r, (q-1)//2, q) == q-1 else 1)**e
    return value


def atlas(s):
    m = (s+1)//4
    core = factor(m)
    # A product of complete individual power cycles, not TS breadth-first closure.
    group = {1}
    for q, _ in core:
        cycle = [1]
        v = q % s
        while v != 1:
            cycle.append(v)
            v = v*q % s
        group = {a*b % s for a in group for b in cycle}
    coset = {(-v) % s for v in group}
    usable = {(-u*pow(a, -1, s)) % s
              for a in range(1, m+1) for u in range(1, m//a+1)
              if m % (a*u) == 0 and math.gcd(a, u) == 1}
    negative = {r for r in range(1, s) if character(r, s) == -1}
    assert usable <= coset <= negative
    assert s-1 not in group
    if factor(s) == [(s, 1)]:
        assert {r for r in range(1, s) if pow(-r, len(group), s) == 1} == coset
    if len(core) == 1:
        q, e = core[0]
        assert len(usable) == min(len(group), 2*e+1)
        assert len(group) == e+2 if q == 2 else len(group) > 2*e+1
    return core, group, usable, negative-coset, coset-usable


rows = []
checked = eligible = subgroup_misses = window_misses = 0
saturated = []
prime_power_rows = []
for s in range(3, 1024, 4):
    core, group, usable, sub, win = atlas(s)
    rows.append([s, sorted(group), sorted(usable), sorted(sub), sorted(win)])
    checked += s-1
    eligible += len(usable)
    subgroup_misses += len(sub)
    window_misses += len(win)
    if len(group) == len(usable):
        saturated.append(s)
    if len(core) == 1:
        q, e = core[0]
        prime_power_rows.append([s, q, e, len(group), min(len(group), 2*e+1), len(group) == len(usable)])
controls = []
for p, s in [(131433121, 11), (159727681, 31), (159727681, 127), (159727681, 791), (131433121, 143), (171348241, 51)]:
    core, group, usable, sub, win = atlas(s)
    r, c = p % s, character(p, s)
    classification = ("CHARACTER_OBSTRUCTION" if c != -1 else
                      "SUBGROUP_OBSTRUCTION" if r in sub else
                      "EXPONENT_WINDOW_OBSTRUCTION" if r in win else "ELIGIBLE")
    controls.append([p, s, r, c, classification, len(group), len(usable),
                     pow(-r, len(group), s) if factor(s) == [(s, 1)] else None])
dyadic_controls = []
for p in [351121, 131433121, 171348241, 159727681]:
    assert all(p % d for d in range(2, math.isqrt(p)+1)) and p % 840 == 1
    dyadic_rows = []
    t = 2
    while 2**(t-1)-1 <= p:
        s, e = 2**t-1, t-2
        # Independently enumerate all normalized dyadic pairs, via modular inverses.
        pair_residues = {(-2**j) % s for j in range(e+1)} | {(-pow(2**j, -1, s)) % s for j in range(e+1)}
        coset_powers = [0] if t == 2 else list(range(t))
        assert pair_residues == {s-2**j for j in coset_powers}
        j = next((j for j in coset_powers if p % s == s-2**j), None)
        dyadic_rows.append(dict(t=t, s=str(s), residue=str(p % s), matchingPower=j))
        t += 1
    hits = [r for r in dyadic_rows if r["matchingPower"] is not None]
    first = hits[0]["t"] if hits else None
    assert first is None or (first >= 5 and factor(first) == [(first, 1)])
    for hit in hits:
        assert all(dyadic_rows[d-2]["matchingPower"] is not None for d in range(3, hit["t"]) if hit["t"] % d == 0)
    dyadic_controls.append(dict(p=p, firstT=first, hits=hits, cutoffT=t, tailMinimumResidue=str(2**(t-1)-1),
                               status="DYADIC_ELIGIBILITY_EXISTS" if hits else "NO_DYADIC_ELIGIBILITY_FOR_THIS_P",
                               rowsDigest=hashlib.sha256(json.dumps(dyadic_rows, separators=(",", ":")).encode()).hexdigest()))
prime_power_controls = []
for p in [351121, 131433121, 171348241, 159727681]:
    max_m = (p+1)//2
    candidates = {}
    # Explicit divisor-pair trial enumeration rather than TS factorization products.
    for n in [p+1, p+4, 4*p+1]:
        for d in range(1, math.isqrt(n)+1):
            if n % d:
                continue
            for s in [d, n//d]:
                if s >= 7 and s % 4 == 3 and s <= 2*p+1 and factor((s+1)//4) == [((s+1)//4, 1)]:
                    candidates[s] = ((s+1)//4, 1)
    # Independent trial primality, not a sieve.
    for q in range(2, math.isqrt(max_m)+1):
        if factor(q) != [(q, 1)]:
            continue
        m, e = q*q, 2
        while m <= max_m:
            candidates[4*m-1] = (q, e)
            m *= q
            e += 1
    pp_rows, pp_hits = [], []
    for s, (q, e) in sorted(candidates.items()):
        pairs = sorted({(1, q**j) for j in range(e+1)} | {(q**j, 1) for j in range(e+1)})
        pair = next(((a, u) for a, u in pairs if p % s == (-u*pow(a, -1, s)) % s), None)
        pp_rows.append([s, q, e, p % s, pair is not None])
        if pair:
            a, u = pair
            v, k = (a*p+u)//s, ((s+1)//4)//(a*u)
            x, y, z = sorted((u*v*k, a*p*u*k, a*p*v*k))
            assert 0 < x < y < z and 4*x*y*z == p*(x*y+x*z+y*z)
            assert sum(d % p == 0 for d in [x, y, z]) == 2
            witness = dict(n=str(p), x=str(x), y=str(y), z=str(z))
            # Same canonical identity certificate schema as the established strict checker.
            strict_digest = hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()
            pp_hits.append(dict(s=s, prime=q, exponent=e, witness=witness, strictDigest=strict_digest))
    prime_power_controls.append(dict(p=p, maxM=max_m, tailFromS=2*p+2, candidatesChecked=len(pp_rows), hits=pp_hits,
                                    status="PRIME_POWER_CORE_WITNESS_EXISTS" if pp_hits else "NO_PRIME_POWER_CORE_ELIGIBILITY_FOR_THIS_P",
                                    rowsDigest=hashlib.sha256(json.dumps(pp_rows, separators=(",", ":")).encode()).hexdigest()))
print(json.dumps(dict(maxS=1023, checkedResidues=checked, eligibleResidues=eligible,
                     subgroupMisses=subgroup_misses, windowMisses=window_misses,
                     saturatedModuli=saturated, primePowerRows=prime_power_rows, controls=controls, dyadicControls=dyadic_controls,
                     primePowerControls=prime_power_controls,
                     manifest=hashlib.sha256(json.dumps(rows, separators=(",", ":")).encode()).hexdigest()), separators=(",", ":")))
