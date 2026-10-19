"""Fixed bounded G03 replay. Stdlib only; integer-divisor pairs, not signed boxes."""
import hashlib
import json
import math
import time

TARGETS = [131433121, 159727681, 351121, 171348241]
CONTROL_PRIMES = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31]
SCOPE = "Four fixed residual-prime targets, full normalized m=2^a*ell^b with a>=1,b>=2,ell odd PRIME; all a,b,ell through written min-residue bounds, all s. Signed-box versus separate integer-pair replay. One canonical (A,U)-ordered strict representative per hit core; not all solutions, other core supports, root proof, formal/novelty or agent evidence. D/E/F remain unchanged."


def compact(value):
    return json.dumps(value, separators=(",", ":"))


def digest(value):
    return hashlib.sha256(compact(value).encode()).hexdigest()


def prime(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, math.isqrt(n) + 1))


def pairs(a, b, ell):
    # Enumerate A divisors and U divisors having no prime support shared with A.
    for i in range(a + 1):
        for j in range(b + 1):
            A = 2**i * ell**j
            for h in range(1 if i else a + 1):
                for k in range(1 if j else b + 1):
                    U = 2**h * ell**k
                    assert math.gcd(A, U) == 1
                    yield A, U, abs(k - j) in (0, b)


def lower(a, b, ell):
    B, q = 2**a, ell**b
    return max(3 * B - 1, (4 * B * q + B) // (B + 1) - 1)


def control(a, b, ell):
    m, s = 2**a * ell**b, 4 * 2**a * ell**b - 1
    residues = sorted({(-U * pow(A, -1, s)) % s for A, U, _ in pairs(a, b, ell)})
    image = {(-pow(2, t, s)) % s for t in range(-2 * a - 2, 2 * a + 3)}
    image.update((-ell**r * pow(2, t, s)) % s for r in range(1, b) for t in range(-a, 2 * a + 3))
    assert set(residues) == image and residues[0] >= lower(a, b, ell)
    return [a, b, ell, str(m), str(s), len(residues), str(residues[0]), str(lower(a, b, ell)), digest(list(map(str, residues)))]


def target(p):
    deadline = time.monotonic() + 30
    assert p in TARGETS and prime(p)
    max_a = (p + 1).bit_length() - 1
    while 3 * 2**max_a - 1 > p:
        max_a -= 1
    global_q = 3 * (p + 1) // 8
    prime_limit = math.isqrt(global_q)
    assert prime_limit <= 8015
    primes = [ell for ell in range(3, prime_limit + 1, 2) if prime(ell)]
    cores = []
    for a in range(1, max_a + 1):
        B = 2**a
        max_q = (p + 1) * (B + 1) // (4 * B)
        for ell in primes:
            b, q = 2, ell * ell
            while q <= max_q:
                cores.append((a, b, ell, q, B * q))
                b, q = b + 1, q * ell
    assert len(cores) <= 100000
    rows_hash, witnesses, slots = hashlib.sha256(), [], 0
    for checked, (a, b, ell, q, m) in enumerate(cores):
        if time.monotonic() >= deadline:
            return {"p": str(p), "status": "PARTIAL", "plannedCores": len(cores), "checkedCores": checked,
                    "pendingFirstCore": {"a": a, "b": b, "ell": ell}, "reason": "TARGET_30_SECOND_LIMIT",
                    "prefixRowsDigest": rows_hash.hexdigest()}
        s, chosen, aggregate_hit = 4 * m - 1, None, False
        for A, U, aggregate in pairs(a, b, ell):
            slots += 1
            if (A * p + U) % s == 0:
                chosen = min(chosen, (A, U)) if chosen else (A, U)
                aggregate_hit |= aggregate
        rows_hash.update((compact([str(p), a, b, ell, str(m), str(s), chosen is not None, aggregate_hit,
                                   str(chosen[0]) if chosen else None, str(chosen[1]) if chosen else None]) + "\n").encode())
        if chosen:
            A, U = chosen
            assert m % (A * U) == 0 and math.gcd(A, U) == 1
            v, k = (A * p + U) // s, m // (A * U)
            x, y, z = sorted([U * v * k, A * p * U * k, A * p * v * k])
            assert 0 < x < y < z and 4 * x * y * z == p * (x * y + y * z + z * x)
            assert sum(d % p == 0 for d in (x, y, z)) == 2
            witnesses.append({"a": a, "b": b, "ell": ell, "q": str(q), "m": str(m), "s": str(s),
                              "translatedOnly": not aggregate_hit,
                              "construction": {"A": str(A), "U": str(U), "v": str(v), "k": str(k)},
                              "witness": {"n": str(p), "x": str(x), "y": str(y), "z": str(z)},
                              "strictDigest": hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()})
    if time.monotonic() >= deadline:
        return {"p": str(p), "status": "PARTIAL", "plannedCores": len(cores), "checkedCores": len(cores),
                "pendingFirstCore": None, "reason": "TARGET_30_SECOND_LIMIT_FINALIZE", "prefixRowsDigest": rows_hash.hexdigest()}
    return {"p": str(p), "status": "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE", "maxA": max_a,
            "globalOddPowerBound": str(global_q), "primeBaseLimit": prime_limit, "primeBases": len(primes),
            "plannedCores": len(cores), "checkedCores": len(cores), "signedPairSlots": slots,
            "rowsDigest": rows_hash.hexdigest(), "coreWitnessCount": len(witnesses),
            "translatedOnlyCoreCount": sum(w["translatedOnly"] for w in witnesses),
            "distinctTupleCount": len({compact(w["witness"]) for w in witnesses}), "coreWitnesses": witnesses}


def packet():
    rows = [control(a, b, ell) for a in range(1, 9) for b in range(1, 7) for ell in CONTROL_PRIMES]
    targets = [target(p) for p in TARGETS]
    return {"method": "ERDOS_STRAUS_HIGHERPOWER_CORE_V1", "limits": {"secondsPerTarget": 30, "maxCoresPerTarget": 100000},
            "finiteBoundControls": {"maxA": 8, "maxB": 6, "primeBases": CONTROL_PRIMES, "rows": len(rows), "rowsDigest": digest(rows)},
            "rowManifestFormat": "SHA256_COMPACT_JSON_ROWS_WITH_LF_IN_A_ELL_B_ORDER",
            "status": "COMPLETE" if all(t["status"] == "COMPLETE_FOR_FULL_ODD_PRIME_POWER_CORE" for t in targets) else "PARTIAL",
            "targets": targets, "scope": SCOPE}


if __name__ == "__main__":
    print(compact(packet()))
