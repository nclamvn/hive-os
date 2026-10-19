"""Independent stdlib exact certificate checker; no factor-discovery code."""
import hashlib
import json
import math
from pathlib import Path

ARTIFACT_HASH = "ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040"
TARGETS = ("131433121", "159727681", "351121", "171348241")
data = Path(__file__).with_name("certified-two-core-artifact.json").read_bytes()
assert len(data) <= 1048576 and hashlib.sha256(data).hexdigest() == ARTIFACT_HASH
artifact = json.loads(data)
assert set(artifact) == {"method", "discoveryLimits", "targets", "primes"}
assert artifact["method"] == "ERDOS_STRAUS_CERTIFIED_TWO_CORE_TAIL_V1"
assert artifact["discoveryLimits"] == {"secondsPerTarget": 120, "rhoSeeds": 32, "rhoIterationsPerSeed": 2000000, "lucasBases": 4096}
assert 1 <= len(artifact["primes"]) <= 10000 and len(artifact["targets"]) == 4


def decimal(text):
    assert isinstance(text, str) and 1 <= len(text) <= 30 and text.isascii() and text.isdecimal() and text[0] != "0"
    return int(text)


def digest(value):
    return hashlib.sha256(json.dumps(value, separators=(",", ":")).encode()).hexdigest()


nodes, previous = {}, 1
for node in artifact["primes"]:
    assert set(node) == {"n", "minusOneFactors", "witnesses"}
    n = decimal(node["n"])
    assert n > previous
    previous, nodes[n] = n, node
certified, visiting = set(), set()


def factors(value, fs):
    assert isinstance(fs, list) and len(fs) <= 64
    product, previous = 1, 1
    for item in fs:
        assert isinstance(item, list) and len(item) == 2
        q, e = decimal(item[0]), item[1]
        assert isinstance(e, int) and not isinstance(e, bool) and 1 <= e <= 128 and q > previous
        certify(q)
        product, previous = product * q ** e, q
    assert product == value


def certify(n):
    if n in certified:
        return
    assert n in nodes and n not in visiting
    visiting.add(n)
    node = nodes[n]
    if n == 2:
        assert node["minusOneFactors"] == [] and node["witnesses"] == []
    else:
        assert n % 2 == 1 and n > 2
        fs, ws = node["minusOneFactors"], node["witnesses"]
        factors(n - 1, fs)
        assert fs and len(ws) == len(fs)
        for (q, _), item in zip(fs, ws):
            assert isinstance(item, list) and len(item) == 2 and item[0] == q
            a = decimal(item[1])
            assert 1 < a < n and pow(a, n - 1, n) == 1
            assert math.gcd(pow(a, (n - 1) // int(q), n) - 1, n) == 1
    visiting.remove(n)
    certified.add(n)


for n in nodes:
    certify(n)


def divisors(fs):
    out = [1]
    for q, e in fs:
        out = [v * int(q) ** j for v in out for j in range(e + 1)]
        assert len(out) <= 100000
    return out


reports = []
for i, target in enumerate(artifact["targets"]):
    assert set(target) == {"p", "maxA", "maxJ", "status", "criterionFactors", "candidateEllFactors", "unresolved"}
    assert target["p"] == TARGETS[i] and int(target["p"]) in certified
    p, max_a = int(target["p"]), 0
    while 3 * 2 ** (max_a + 1) - 1 <= p:
        max_a += 1
    assert target["maxA"] == max_a and target["maxJ"] == 2 * max_a + 2
    assert target["status"] == "COMPLETE" and target["unresolved"] == []
    entries = target["criterionFactors"]
    expected_count = 2 * (target["maxJ"] + 1)
    assert len(entries) == expected_count
    for index, entry in enumerate(entries):
        assert set(entry) == {"kind", "j", "value", "factors"}
        j, kind = index // 2, "TIMES_POWER" if index % 2 else "PLUS_POWER"
        value = 2 ** j * p + 1 if kind == "TIMES_POWER" else p + 2 ** j
        assert entry["kind"] == kind and entry["j"] == j and decimal(entry["value"]) == value
        factors(value, entry["factors"])
    ell_table, previous = {}, 1
    for entry in target["candidateEllFactors"]:
        assert set(entry) == {"value", "factors"}
        ell = decimal(entry["value"])
        assert ell > previous
        factors(ell, entry["factors"])
        previous, ell_table[ell] = ell, entry["factors"]
    used, manifest, witnesses = set(), [], []
    for exponent in range(1, max_a + 1):
        C, hits = 2 ** (exponent + 2), {}
        for entry in entries:
            if entry["j"] > 2 * exponent + 2:
                continue
            for s in divisors(entry["factors"]):
                if (s + 1) % C:
                    continue
                ell = (s + 1) // C
                if ell < 3 or ell % 2 == 0:
                    continue
                assert ell in ell_table
                used.add(ell)
                if ell_table[ell] == [[str(ell), 1]]:
                    hits[s] = ell
        manifest.append([exponent, [[str(s), str(ell)] for s, ell in sorted(hits.items())]])
        for s, ell in sorted(hits.items()):
            m = 2 ** exponent * ell
            ds = sorted([2 ** j * t for j in range(exponent + 1) for t in (1, ell)])
            # Independent direct integer-divisor pairs, not TS signed vectors.
            candidates = [(A, u) for A in ds for u in ds if m % (A * u) == 0 and math.gcd(A, u) == 1]
            A, u = next((A, u) for A, u in candidates if (A * p + u) % s == 0)
            v, k = (A * p + u) // s, m // (A * u)
            x, y, z = sorted((u * v * k, A * p * u * k, A * p * v * k))
            assert p > 2 and 0 < x < y < z
            assert 4 * x * y * z == p * (x * y + x * z + y * z)
            assert sum(d % p == 0 for d in (x, y, z)) == 2
            strict_digest = hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()
            witnesses.append({"exponent": exponent, "ell": str(ell),
                              "construction": {"a": str(A), "u": str(u), "s": str(s), "v": str(v), "k": str(k)},
                              "witness": {"n": str(p), "x": str(x), "y": str(y), "z": str(z)},
                              "strictDigest": strict_digest})
    assert used == set(ell_table)
    reports.append({"p": target["p"], "status": "COMPLETE_FOR_NORMALIZED_TWO_CORE_SUBCLASS", "maxA": max_a,
                    "tailFromA": max_a + 1, "tailMinimumResidue": str(3 * 2 ** (max_a + 1) - 1),
                    "criterionEntries": expected_count, "candidateEllEntries": len(ell_table),
                    "manifest": manifest, "manifestDigest": digest(manifest), "witnesses": witnesses})

output = {"method": "ERDOS_STRAUS_CERTIFIED_TWO_CORE_DECISION_V1", "primeCertificatesChecked": len(certified),
          "targets": reports,
          "scope": "Four fixed targets ONLY; all a permitted by the written tail and all s for m=2^a*ell, odd prime ell exponent ONE. Recursive Lucas/product verification, not Lean/formal, novelty, all-prime coverage, root theorem, agent event or new denominator optimum."}
print(json.dumps(output, separators=(",", ":")))
