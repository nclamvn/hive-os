"""Independently replay all positive witnesses in a --full residual survey.

Example:
  npm run math-pilot:residual-survey -- --limit=100000000 --max-a=59 --full \
    | python3 scripts/operations/verify-erdos242-strict.py

This checks finite coverage and the ordered Erdős 242 statement, not the
minimality of each A, completeness beyond the fixed-A search, or any theorem.
"""

import hashlib
import json
import sys
from math import isqrt


def primes_up_to(limit: int) -> bytearray:
    """Odd-only sieve independent of the TypeScript trial-division routine."""
    prime = bytearray(b"\x01") * (limit // 2 + 1)
    prime[0] = 0
    for odd in range(3, isqrt(limit) + 1, 2):
        if not prime[odd // 2]:
            continue
        start = odd * odd // 2
        step = odd
        count = (len(prime) - start - 1) // step + 1
        prime[start::step] = b"\x00" * count
    return prime


def fail(reason: str) -> None:
    raise ValueError(reason)


def main() -> None:
    document = json.load(sys.stdin)
    if document.get("methodVersion") != "ERDOS_STRAUS_RESIDUAL_SURVEY_V1":
        fail("Unexpected source method version")
    limit, max_a = document["limit"], document["maxA"]
    if not isinstance(limit, int) or not 841 <= limit <= 200_000_000:
        fail("Limit outside this auditor's declared domain")
    if not isinstance(max_a, int) or not 3 <= max_a <= 107 or max_a % 4 != 3:
        fail("Invalid A bound")
    records = document["records"]
    if not isinstance(records, list):
        fail("Full per-prime records are required")
    source_payload = {"methodVersion": document["methodVersion"], "limit": limit,
                      "maxA": max_a, "records": records}
    source_digest = hashlib.sha256(
        json.dumps(source_payload, separators=(",", ":"), ensure_ascii=False).encode()
    ).hexdigest()
    if source_digest != document.get("manifestDigest"):
        fail("Source manifest digest mismatch")

    sieve = primes_up_to(limit)
    expected = (n for n in range(841, limit + 1, 840) if sieve[n // 2])
    strict_count = 0
    unresolved = []
    distribution: dict[str, int] = {}
    witness_hash = hashlib.sha256()
    for record in records:
        p = next(expected, None)
        if p is None or record.get("n") != p:
            fail("Missing, out-of-order, composite, or extra residual-prime record")
        a, witness = record.get("firstA"), record.get("witness")
        if record.get("maxA") != max_a:
            fail("Record A-bound mismatch")
        if a is None:
            if witness is not None:
                fail("Unresolved record contains a witness")
            unresolved.append(p)
            distribution["UNRESOLVED_WITHIN_BOUND"] = distribution.get("UNRESOLVED_WITHIN_BOUND", 0) + 1
            continue
        if not isinstance(a, int) or not 3 <= a <= max_a or a % 4 != 3:
            fail("Invalid claimed first A")
        if not isinstance(witness, dict):
            fail("Successful record has no witness")
        values = [witness.get(name) for name in ("n", "x", "y", "z")]
        if not all(isinstance(value, str) and value.isascii() and value.isdecimal()
                   and str(int(value)) == value for value in values):
            fail("Witness integers are not canonical positive decimals")
        n, x, y, z = map(int, values)
        if n != p or not (2 < n and 1 <= x < y < z):
            fail("Witness violates the exact Erdős 242 quantifiers or order")
        if 4 * x * y * z != n * (x * y + x * z + y * z):
            fail("Witness fails exact rational identity")
        if 4 * x - n != a:
            fail("Witness does not use its declared first-denominator A")
        strict_count += 1
        distribution[str(a)] = distribution.get(str(a), 0) + 1
        witness_hash.update(f"{n}:{x}:{y}:{z}\n".encode())
    if next(expected, None) is not None or document.get("primeCount") != len(records):
        fail("Residual-prime coverage or count mismatch")
    if distribution != document.get("distribution"):
        fail("Distribution mismatch")
    print(json.dumps({
        "domain": f"prime p ≡ 1 (mod 840), 841 ≤ p ≤ {limit}",
        "primeCount": len(records), "strictWitnessCount": strict_count,
        "unresolvedWithinABound": len(unresolved), "firstUnresolved": unresolved[:10],
        "sourceManifestDigest": source_digest,
        "strictWitnessDigest": witness_hash.hexdigest(),
        "scope": "Independent finite positive-witness/primality replay; not a universal proof or A-minimality audit.",
    }, indent=2))


if __name__ == "__main__":
    main()
