"""Fixed H05 rays. Independent integer divisor-pair scan, stdlib only."""
import hashlib
import json
import math
import time

TARGETS = [19, 131433121, 159727681, 351121, 171348241]
PAIRS = [[6, 5], [3, 11], [4, 9], [2, 25], [3, 1], [162, 1], [1, 1]]
LIMITS = {"secondsPerRun": 30, "maxCoreRows": 100000, "maxSqrtDivisorIterationsPerRay": 166608}
SCOPE = "ALL k>=1 only on seven fixed coprime (A,U) rays at five fixed primes including p19 controls; exact divisor criteria, no arbitrary k ceiling. Fixing A,U preserves the ratio partition but varying k can add prime support. Not all mixed cores, root coverage, formal proof or novelty; no historical agent evidence. D/E/F/G unchanged."


def compact(value):
    return json.dumps(value, separators=(",", ":"))


def digest(value):
    return hashlib.sha256(compact(value).encode()).hexdigest()


def prime(n):
    return n >= 2 and all(n % d for d in range(2, math.isqrt(n) + 1))


def canonical(A, U, k):
    m, s = A * U * k, 4 * A * U * k - 1
    p0 = (-U * pow(A, -1, s)) % s
    Q0 = (A * p0 + U) // s
    h0 = (U + Q0) // A
    assert 0 < p0 < s and 1 <= Q0 <= A and A * p0 + U == s * Q0
    return p0, Q0, h0, s


class RunDeadline(Exception):
    pass


def packet():
    deadline = time.monotonic() + 30
    controls, rays, count = [], [], 0
    control_hash = hashlib.sha256()
    pending = {"phase": "CONTROLS"}

    def checkpoint():
        if time.monotonic() >= deadline:
            raise RunDeadline()

    try:
        for a in range(1, 17):
            for u in range(1, 17):
                if math.gcd(a, u) != 1:
                    continue
                for k in range(1, 17):
                    pending = {"phase": "CONTROLS", "a": a, "u": u, "k": k}
                    checkpoint()
                    p0, Q0, h0, s = canonical(a, u, k)
                    row = [a, u, k, str(Q0), str(h0), str(p0), str(s)]
                    controls.append(row)
                    control_hash.update((compact(row) + "\n").encode())
        for p in TARGETS:
            for A, U in PAIRS:
                N, modulus = A * p + U, 4 * A * U
                pending = {"phase": "FACTOR_RAY", "p": str(p), "A": A, "U": U, "value": str(N)}
                checkpoint()
                assert prime(p) and math.gcd(A, U) == 1
                root = math.isqrt(N)
                assert root <= LIMITS["maxSqrtDivisorIterationsPerRay"]
                divisors = set()
                # Exhaustive quotient-pair scan does not consume TS's factorization.
                for d in range(1, root + 1):
                    if d % 1024 == 0:
                        checkpoint()
                    if N % d == 0:
                        divisors.update((d, N // d))
                divisors = sorted(divisors)
                remaining, fs = N, []
                # Recover prime factors from the already exhaustive divisor list.
                for d in divisors[1:]:
                    if remaining % d == 0:
                        assert prime(d)
                        e = 0
                        while remaining % d == 0:
                            remaining //= d
                            e += 1
                        fs.append([str(d), e])
                assert remaining == 1 and math.prod(int(q)**e for q, e in fs) == N
                _, Q0, h0, _ = canonical(A, U, 1)
                k_max = (p + h0) // (4 * U * Q0)
                hits, rows_hash = [], hashlib.sha256()
                pending = {"phase": "DIVISOR_RAY", "p": str(p), "A": A, "U": U, "value": str(N)}
                for s in divisors:
                    checkpoint()
                    count += 1
                    assert count <= LIMITS["maxCoreRows"]
                    hit = (s + 1) % modulus == 0
                    k, Q = ((s + 1) // modulus, N // s) if hit else (None, None)
                    rows_hash.update((compact([str(s), hit, str(k) if hit else None, str(Q) if hit else None]) + "\n").encode())
                    if hit:
                        assert k >= 1 and k <= k_max and A * p + U == s * Q
                        p0, q0, _, modulus_s = canonical(A, U, k)
                        assert modulus_s == s and p % s == p0 and (Q - q0) % A == 0
                        x, y, z = sorted((U * Q * k, A * p * U * k, A * p * Q * k))
                        assert 4 * x * y * z == p * (x * y + y * z + z * x)
                        strict = 0 < x < y < z and sum(d % p == 0 for d in (x, y, z)) == 2
                        hits.append({"k": str(k), "m": str(A * U * k), "s": str(s), "Q": str(Q),
                                     "canonicalResidue": str(p0), "canonicalQuotient": str(q0), "wrapCount": str((Q - q0) // A),
                                     "classification": "STRICT_TYPE_II" if strict else "EXACT_IDENTITY_NOT_STRICT_TYPE_II",
                                     "witness": {"n": str(p), "x": str(x), "y": str(y), "z": str(z)},
                                     "strictDigest": hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest() if strict else None})
                rays.append({"p": str(p), "A": A, "U": U, "numerator": str(N), "numeratorFactors": fs,
                             "kMax": str(k_max), "divisorRows": len(divisors), "rowsDigest": rows_hash.hexdigest(), "hits": hits})
        pending = {"phase": "FINALIZE"}
        checkpoint()
        return {"method": "ERDOS_STRAUS_SPLIT_SUPPORT_RAYS_V1", "status": "COMPLETE_FOR_35_FIXED_RAYS", "limits": LIMITS,
                "targets": TARGETS, "pairs": PAIRS, "controls": {"maxA": 16, "maxU": 16, "maxK": 16,
                "rows": len(controls), "rowsDigest": control_hash.hexdigest()}, "checkedRays": len(rays), "checkedDivisorRows": count,
                "hitRows": sum(len(r["hits"]) for r in rays), "rays": rays, "rayManifestDigest": digest(rays), "scope": SCOPE}
    except RunDeadline:
        return {"method": "ERDOS_STRAUS_SPLIT_SUPPORT_RAYS_V1", "status": "PARTIAL", "reason": "RUN_30_SECOND_LIMIT", "limits": LIMITS,
                "checkedControlRows": len(controls), "controlPrefixDigest": control_hash.hexdigest(), "checkedRays": len(rays),
                "checkedDivisorRows": count, "pending": pending, "completedRays": rays, "scope": SCOPE}


if __name__ == "__main__":
    print(compact(packet()))
