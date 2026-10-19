"""Fixed read-only two-core target replay; no arguments or third-party imports."""
import hashlib
import json
import math


def digest(value):
    return hashlib.sha256(json.dumps(value, separators=(",", ":")).encode()).hexdigest()


def prime(n):
    return n >= 2 and all(n % q for q in range(2, math.isqrt(n) + 1))


def divisors(n):
    out, q = [1], 2
    while q * q <= n:
        if n % q == 0:
            e = 0
            while n % q == 0:
                n //= q
                e += 1
            out = [v * q ** j for v in out for j in range(e + 1)]
        q = 3 if q == 2 else q + 2
    if n > 1:
        out = [v * power for v in out for power in (1, n)]
    return sorted(out)


def pairs(m):
    # Independent integer-divisor enumeration, not the TS signed-box generator.
    ds = divisors(m)
    return [(a, u) for a in ds for u in divisors(m // a) if math.gcd(a, u) == 1]


rows = []
for a in range(1, 9):
    for ell in range(3, 998, 2):
        if not prime(ell):
            continue
        m, s = 2 ** a * ell, 4 * 2 ** a * ell - 1
        residues = sorted({-u * pow(A, -1, s) % s for A, u in pairs(m)})
        interval = sorted({-pow(2, t, s) % s for t in range(-2 * a - 2, 2 * a + 3)})
        assert residues == interval and residues[0] >= 3 * 2 ** a - 1
        rows.append([a, ell, m, s, len(residues), residues[0], digest(residues)])

audits = []
for p in (131433121, 159727681, 351121, 171348241):
    assert prime(p) and p % 840 == 1
    manifest, witnesses = [], []
    for exponent in range(1, 5):
        C, hits = 2 ** (exponent + 2), {}
        for j in range(2 * exponent + 3):
            for value in (p + 2 ** j, 2 ** j * p + 1):
                assert value < 176000000000
                for s in divisors(value):
                    if (s + 1) % C == 0:
                        ell = (s + 1) // C
                        if ell >= 3 and ell % 2 and prime(ell):
                            hits[s] = ell
        manifest.append([exponent, [[s, ell] for s, ell in sorted(hits.items())]])
        for s, ell in sorted(hits.items()):
            m = 2 ** exponent * ell
            A, u = next((A, u) for A, u in pairs(m) if (A * p + u) % s == 0)
            v, k = (A * p + u) // s, m // (A * u)
            assert math.gcd(A, u) == 1 and m % (A * u) == 0
            x, y, z = sorted((u * v * k, A * p * u * k, A * p * v * k))
            assert p > 2 and 0 < x < y < z
            assert 4 * x * y * z == p * (x * y + x * z + y * z)
            assert sum(d % p == 0 for d in (x, y, z)) == 2
            strict_digest = hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()
            witnesses.append({"exponent": exponent, "ell": ell,
                              "construction": {"a": A, "u": u, "s": s, "v": str(v), "k": str(k)},
                              "witness": {"n": str(p), "x": str(x), "y": str(y), "z": str(z)},
                              "strictDigest": strict_digest})
    audits.append({"p": p, "auditedExponents": [1, 2, 3, 4], "sCeiling": None,
                   "manifest": manifest, "manifestDigest": digest(manifest), "witnesses": witnesses})

packet = {"method": "ERDOS_STRAUS_TWO_CORE_TARGET_PACKET_V1",
          "finiteAtlas": {"minA": 1, "maxA": 8, "maxOddPrime": 997, "rowCount": len(rows), "rowsDigest": digest(rows)},
          "targetAudits": audits,
          "scope": "Normalized m=2^a*ell with odd prime ell of exponent ONE only; exact set and tail are written theorems, not formal/novelty or root certificates. Finite target audit covers ONLY a=1..4 with no s ceiling; larger a remain uncomputed. Read-only diagnostic, not agent-cycle evidence."}
print(json.dumps(packet, separators=(",", ":")))
