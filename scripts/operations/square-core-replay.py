"""Independent exact stdlib checker; direct divisor pairs, no discovery import."""
import hashlib
import json
import math
from pathlib import Path

ARTIFACT_HASH = "c20ab868ceceee139a7319c5d8ec3b11c953fc6136677565ef9b5184b537cff2"
TARGETS = ("131433121", "159727681", "351121", "171348241")
SCOPE = "Four fixed targets ONLY; b=2, a1..4, all divisor candidates without ell/s ceiling; original normalized congruence and finite bound checked. Higher a/b UNCOMPUTED; not whole b2/all-core exclusion, formal proof, novelty, root theorem or agent evidence."


def decimal(text):
    assert isinstance(text, str) and 1 <= len(text) <= 30 and text.isascii() and text.isdecimal() and text[0] != "0"
    return int(text)


def digest(value):
    return hashlib.sha256(json.dumps(value, separators=(",", ":")).encode()).hexdigest()


def divisors(fs):
    out = [1]
    for q, e in fs:
        assert len(out) * (e + 1) <= 100000
        out = [v * int(q) ** j for v in out for j in range(e + 1)]
    return out


def verify_artifact(artifact):
    assert set(artifact) == {"method", "scope", "discoveryLimits", "targets", "primes"}
    assert artifact["method"] == "ERDOS_STRAUS_CERTIFIED_SQUARE_CORE_SLICE_V1"
    assert artifact["scope"] == {"b": 2, "minA": 1, "maxA": 4, "ellOrModulusCeiling": None, "higherAorB": "UNCOMPUTED"}
    assert artifact["discoveryLimits"] == {"secondsPerTarget": 120, "rhoSeeds": 32, "rhoIterationsPerSeed": 2000000, "lucasBases": 4096}
    assert 1 <= len(artifact["primes"]) <= 10000 and len(artifact["targets"]) == 4
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
            assert type(e) is int and 1 <= e <= 128 and q > previous
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
            assert n > 2 and n % 2
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
    reports = []
    for index, target in enumerate(artifact["targets"]):
        assert set(target) == {"p", "maxCore", "status", "criterionFactors", "candidateEllFactors", "unresolved"}
        assert target["p"] == TARGETS[index] and int(target["p"]) in certified
        p = int(target["p"])
        t0 = p // 4 + 1
        max_core = t0 * (t0 + 1) // (4 * t0 - p)
        assert decimal(target["maxCore"]) == max_core
        required = [(kind, 0, j, p + 2 ** j if kind == "PURE_PLUS" else 2 ** j * p + 1)
                    for j in range(11) for kind in ("PURE_PLUS", "PURE_TIMES")]
        required += [("TRANSLATED", a, t, 2 ** (a + 2) * (2 ** (-t) * p) ** 2 - 1 if t < 0
                      else 2 ** (a + 2) * p ** 2 - 2 ** (2 * t))
                     for a in range(1, 5) for t in range(-a, 2 * a + 3)]
        entries = target["criterionFactors"]
        assert len(entries) <= len(required)
        for entry, expected in zip(entries, required):
            assert set(entry) == {"kind", "a", "t", "value", "factors"}
            assert type(entry["a"]) is int and type(entry["t"]) is int
            assert (entry["kind"], entry["a"], entry["t"], decimal(entry["value"])) == expected
            factors(expected[3], entry["factors"])
        ell_table, previous = {}, 1
        assert len(target["candidateEllFactors"]) <= 10000 and len(target["unresolved"]) <= 10000
        for entry in target["candidateEllFactors"]:
            assert set(entry) == {"value", "factors"}
            ell = decimal(entry["value"])
            assert ell > previous
            factors(ell, entry["factors"])
            previous, ell_table[ell] = ell, entry["factors"]
        for pending in target["unresolved"]:
            assert set(pending) == {"value", "purpose", "reason"}
            decimal(pending["value"])
            assert isinstance(pending["purpose"], str) and 1 <= len(pending["purpose"]) <= 64
            assert isinstance(pending["reason"], str) and 1 <= len(pending["reason"]) <= 128
        base = {"p": target["p"], "maxCore": target["maxCore"], "criterionEntries": len(entries), "candidateEllEntries": len(ell_table)}
        if target["status"] == "PARTIAL":
            assert target["unresolved"]
            reports.append({**base, "status": "PARTIAL", "unresolved": target["unresolved"], "manifest": [], "manifestDigest": digest([]), "witnesses": []})
            continue
        assert target["status"] == "COMPLETE" and not target["unresolved"] and len(entries) == len(required)
        used, manifest, witnesses = set(), [], []
        for a in range(1, 5):
            C, candidates = 2 ** (a + 2), {}
            for entry in entries:
                if (entry["kind"] == "TRANSLATED" and entry["a"] != a) or (entry["kind"] != "TRANSLATED" and entry["t"] > 2 * a + 2):
                    continue
                for s in divisors(entry["factors"]):
                    if (s + 1) % C:
                        continue
                    ell = math.isqrt((s + 1) // C)
                    if ell < 3 or ell % 2 == 0 or C * ell * ell != s + 1:
                        continue
                    assert ell in ell_table
                    used.add(ell)
                    candidates[s] = ell
            decisions = []
            for s, ell in sorted(candidates.items()):
                m = 2 ** a * ell * ell
                # Direct positive integer-divisor pairs, not TS signed boxes.
                ds = sorted(2 ** f * ell ** g for f in range(a + 1) for g in range(3))
                pairs = [(A, u) for A in ds for u in ds if m % (A * u) == 0 and math.gcd(A, u) == 1 and (A * p + u) % s == 0]
                prime = ell_table[ell] == [[str(ell), 1]]
                reason = "COMPOSITE_ELL" if not prime else "OUTSIDE_FINITE_BOUND" if m > max_core else "ORIGINAL_CONGRUENCE_MISS" if not pairs else "HIT"
                decisions.append({"s": str(s), "ell": str(ell), "reason": reason})
                if reason != "HIT":
                    continue
                A, u = pairs[0]
                v, k = (A * p + u) // s, m // (A * u)
                x, y, z = sorted((u * v * k, A * p * u * k, A * p * v * k))
                assert p > 2 and 0 < x < y < z and sum(d % p == 0 for d in (x, y, z)) == 2
                assert 4 * x * y * z == p * (x * y + x * z + y * z)
                strict_digest = hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()
                witnesses.append({"exponent": a, "ell": str(ell), "construction": {"a": str(A), "u": str(u), "s": str(s), "v": str(v), "k": str(k)},
                                  "witness": {"n": str(p), "x": str(x), "y": str(y), "z": str(z)}, "strictDigest": strict_digest})
            manifest.append([a, decisions])
        assert used == set(ell_table)
        reports.append({**base, "status": "COMPLETE_FOR_B2_A1_TO_A4_ONLY", "unresolved": [], "manifest": manifest, "manifestDigest": digest(manifest), "witnesses": witnesses})
    return {"method": "ERDOS_STRAUS_CERTIFIED_SQUARE_CORE_DECISION_V1", "primeCertificatesChecked": len(certified),
            "targets": reports, "higherAorB": "UNCOMPUTED", "scope": SCOPE}


if __name__ == "__main__":
    data = Path(__file__).with_name("square-core-artifact.json").read_bytes()
    assert len(data) <= 1048576 and hashlib.sha256(data).hexdigest() == ARTIFACT_HASH
    print(json.dumps(verify_artifact(json.loads(data)), separators=(",", ":")))
