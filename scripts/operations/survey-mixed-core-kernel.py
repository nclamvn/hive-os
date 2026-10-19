"""Fixed exploratory discovery survey, NOT independent replay or a coverage proof.

Predeclared 1 <= m <= 1,000,000; stdout only, stdlib, no application imports.
Full-row manifest hashes [m,P,E,R] followed by newline for every tested m.
"""
import hashlib
import json
import math

N = 1000000
spf = list(range(N+1))
for q in range(2, math.isqrt(N)+1):
    if spf[q] == q:
        for j in range(q*q, N+1, q):
            if spf[j] == j:
                spf[j] = q
manifest = hashlib.sha256()
extra_rows = []
for m in range(1, N+1):
    x, core = m, []
    while x > 1:
        q, e = spf[x], 0
        while x % q == 0:
            x //= q
            e += 1
        core.append((q, e))
    s, residues = 4*m-1, {1}
    for q, e in core:
        inverse = pow(q, -1, s)
        powers = [pow(inverse, -f, s) if f < 0 else pow(q, f, s) for f in range(-e, e+1)]
        residues = {r*c % s for r in residues for c in powers}
    a = next((e for q, e in core if q == 2), 0)
    P = math.prod(2*e+1 for q, e in core)
    E = (a-1)*math.prod(e+1 for q, e in core if q != 2) if a >= 2 else 0
    R = len(residues)
    assert R <= P-E
    manifest.update((json.dumps([m, P, E, R], separators=(",", ":"))+"\n").encode())
    if R < P-E:
        is_prime = not any(s % q == 0 for q in range(2, math.isqrt(s)+1))
        extra_rows.append([m, s, P, E, R, is_prime])
print(json.dumps(dict(method="ERDOS_STRAUS_KERNEL_DISCOVERY_SURVEY_V1", maxM=N,
                     rows=N, rowsDigest=manifest.hexdigest(), extraRows=extra_rows,
                     scope="Finite discovery counts; independent replay is only the fixed kernel packet, not this million-row survey"),
                 separators=(",", ":")))
