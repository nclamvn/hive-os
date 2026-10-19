"""Exhaustive capped signed-box checks for the written Kneser packet lemma.

Fixed groups only: C10, C18, C22. This is a group check, not a prime survey
or proof of the Erdős-Straus conjecture. No third-party dependencies.
"""
import hashlib
import json
from collections import deque
from math import gcd


def check(m):
    modulus = 2 * m
    caps = tuple((modulus // gcd(j, modulus)) // 2 for j in range(1, m + 1))
    base = tuple(int(j == 2) for j in range(1, m + 1))

    def grow(rs, step):
        return frozenset((r + step * t) % modulus for r in rs for t in (-1, 0, 1))

    closed = {base: grow({0}, 2)}
    queue = deque([base])
    opened = set()
    while queue:
        w = queue.popleft()
        for i, cap in enumerate(caps):
            if w[i] == cap:
                continue
            v = tuple(w[j] + (j == i) for j in range(m))
            if v in closed or v in opened:
                continue
            rs = grow(closed[w], i + 1)
            if m in rs:
                opened.add(v)
            else:
                closed[v] = rs
                queue.append(v)
    mixed = 0
    maximum_mass = 0
    digest = hashlib.sha256()
    for w, rs in sorted(closed.items()):
        digest.update(json.dumps([w, sorted(rs)], separators=(",", ":")).encode())
        if any(e for j, e in enumerate(w, 1) if j % 2):
            assert m not in rs
            stabilizer = [h for h in range(modulus) if {(r + h) % modulus for r in rs} == set(rs)]
            assert stabilizer == [0], (m, w)
            assert len(rs) >= 2 * sum(w) + 3 and sum(w) <= m - 2, (m, w)
            mixed += 1
            maximum_mass = max(maximum_mass, sum(w))
    return {"groupOrder": modulus, "forcedEvenStep": 2, "caps": caps,
            "closedProfiles": len(closed), "mixedClosedProfiles": mixed,
            "maxMixedNonzeroLogValuation": maximum_mass,
            "predictedUpperBound": m - 2, "closedManifestDigest": digest.hexdigest()}


if __name__ == "__main__":
    print(json.dumps({"groups": [check(m) for m in (5, 9, 11)],
        "scope": "Exhaustive capped groups with forced primitive even step; unbounded reduction and Kneser proof are separate."}, indent=2))
