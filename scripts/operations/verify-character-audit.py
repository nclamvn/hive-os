"""Independent factor-pair enumeration and Euler-character replay (no TS input)."""
import hashlib
import json
import math
import pathlib
import runpy


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
    result = 1
    for q, e in factor(s):
        value = pow(r, (q-1)//2, q)
        result *= (-1 if value == q-1 else 1) ** e
    return result


rows = []
checked = eligible = misses = 0
for s in range(3, 1024, 4):
    m = (s+1)//4
    residues = set()
    count = 0
    for a in range(1, m+1):
        for u in range(1, m//a+1):
            if m % (a*u) or math.gcd(a, u) != 1:
                continue
            count += 1
            residues.add((-u * pow(a, -1, s)) % s)
    negative = [r for r in range(1, s) if character(r, s) == -1]
    assert residues <= set(negative)
    assert all(character(q, s) == 1 for q, e in factor(m))
    rows.append([s, count, sorted(residues), negative])
    checked += s-1
    eligible += len(residues)
    misses += len(set(negative)-residues)

barriers = []
for bound in [19, 63, 143, 255, 1023]:
    # Closed formula independent of the TS factor-incidence collection.
    ps = [q for q in range(3, bound+1, 2) if len(factor(q)) == 1 and factor(q)[0] == (q, 1)
          and q not in (3, 5, 7) and (q % 4 == 3 or 3*q <= bound)]
    barriers.append(dict(maxS=bound, rank=len(ps), denominator=str(2**len(ps)), externalPrimes=ps))
replay = runpy.run_path(str(pathlib.Path(__file__).with_name("replay-divisor-led.py")))["replay"]
controls = []
for p in [131433121, 351121, 171348241, 159727681]:
    assert all(p % d for d in range(2, math.isqrt(p)+1))
    first = next((s for s in range(3, 4096, 4) if character(p, s) == -1), None)
    nr = [q for q in range(3, 4096, 2) if factor(q) == [(q, 1)] and character(p, q) == -1]
    formula = min([q if q % 4 == 3 else 3*q for q in nr if q % 4 == 3 or 3*q <= 4095], default=None)
    assert first == formula
    actual = replay(p, 4095, "ALL")
    assert actual["firstS"] >= first
    checked_s = sum(character(p, s) == -1 for s in range(3, actual["firstS"]+1, 4))
    skipped_s = (actual["firstS"]+1)//4 - checked_s
    controls.append(dict(p=p, firstCharacterS=first, firstWitnessS=actual["firstS"],
                         primeCharacters=[[q, character(p, q)] for q in [3, 5, 7, 11, 13, 19]],
                         witness=actual["witness"], strictDigest=actual["strictDigest"],
                         checkedS=checked_s, skippedS=skipped_s))
print(json.dumps(dict(maxS=1023, checkedResidues=checked, eligibleResidues=eligible,
                     negativeMisses=misses, manifest=hashlib.sha256(json.dumps(rows, separators=(",", ":")).encode()).hexdigest(),
                     barriers=barriers, controls=controls), separators=(",", ":")))
