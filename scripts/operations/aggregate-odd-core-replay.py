"""Fixed independent aggregate-block replay, reusing immutable D certificates."""
import contextlib
import hashlib
import io
import json
import math
import runpy
from pathlib import Path

folder = Path(__file__).parent
baseline_script = folder / "certified-two-core-replay.py"
assert hashlib.sha256(baseline_script.read_bytes()).hexdigest() == "6c78cc56b61e9497f3610219cfb51ff6583f831c81c07ce3bdd2c8b8ba612c7b"
artifact_bytes = (folder / "certified-two-core-artifact.json").read_bytes()
artifact_hash = "ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040"
assert hashlib.sha256(artifact_bytes).hexdigest() == artifact_hash
captured = io.StringIO()
with contextlib.redirect_stdout(captured):
    checked = runpy.run_path(str(baseline_script))
baseline = json.loads(captured.getvalue())
artifact = checked["artifact"]  # All recursive Lucas/product/input checks ran.


def digest(value):
    return hashlib.sha256(json.dumps(value, separators=(",", ":")).encode()).hexdigest()


def divisors(fs):
    out = [1]
    for q, e in fs:
        out = [v * int(q) ** j for v in out for j in range(e + 1)]
        assert len(out) <= 100000
    return out


reports = []
for i, target in enumerate(artifact["targets"]):
    p, max_a = int(target["p"]), target["maxA"]
    q_table = {entry["value"]: entry["factors"] for entry in target["candidateEllFactors"]}
    used, manifest, witnesses = set(), [], []
    for exponent in range(1, max_a + 1):
        C, hits = 2 ** (exponent + 2), {}
        for entry in target["criterionFactors"]:
            if entry["j"] > 2 * exponent + 2:
                continue
            for s in divisors(entry["factors"]):
                if (s + 1) % C:
                    continue
                q = (s + 1) // C
                if q < 3 or q % 2 == 0:
                    continue
                assert str(q) in q_table
                used.add(str(q))
                classification = "PRIME" if q_table[str(q)] == [[str(q), 1]] else "COMPOSITE"
                hits[s] = (q, classification)
        row = [[str(s), str(q), classification] for s, (q, classification) in sorted(hits.items())]
        manifest.append([exponent, row])
        for s, (q, classification) in sorted(hits.items()):
            m = 2 ** exponent * q
            # Independent integer-factor-pair enumeration, aggregate odd part
            # may ONLY be1 or q. A proper prime divisor of q is not a block.
            ds = sorted([2 ** j * t for j in range(exponent + 1) for t in (1, q)])
            pairs = [(A, u) for A in ds for u in ds if m % (A * u) == 0 and math.gcd(A, u) == 1]
            A, u = next((A, u) for A, u in pairs if (A * p + u) % s == 0)
            v, k = (A * p + u) // s, m // (A * u)
            x, y, z = sorted((u * v * k, A * p * u * k, A * p * v * k))
            assert p > 2 and 0 < x < y < z
            assert 4 * x * y * z == p * (x * y + x * z + y * z)
            assert sum(d % p == 0 for d in (x, y, z)) == 2
            strict_digest = hashlib.sha256(f"ERDOS242_STRICT_EXACT_IDENTITY_V1:{p}:{x}:{y}:{z}".encode()).hexdigest()
            witnesses.append({"exponent": exponent, "q": str(q), "qClassification": classification,
                              "qFactors": q_table[str(q)],
                              "construction": {"a": str(A), "u": str(u), "s": str(s), "v": str(v), "k": str(k)},
                              "witness": {"n": str(p), "x": str(x), "y": str(y), "z": str(z)},
                              "strictDigest": strict_digest})
    assert used == set(q_table)
    prime_rows = [[a, [[s, q] for s, q, classification in row if classification == "PRIME"]] for a, row in manifest]
    assert prime_rows == baseline["targets"][i]["manifest"]
    tuples = {json.dumps(w["witness"], separators=(",", ":")) for w in witnesses}
    baseline_tuples = {json.dumps(w["witness"], separators=(",", ":")) for w in baseline["targets"][i]["witnesses"]}
    reports.append({"p": target["p"], "status": "COMPLETE_FOR_AGGREGATE_ODD_BLOCK_SUBFAMILY", "maxA": max_a,
                    "tailFromA": max_a + 1, "tailMinimumResidue": baseline["targets"][i]["tailMinimumResidue"],
                    "manifest": manifest, "manifestDigest": digest(manifest), "coreWitnessCount": len(witnesses),
                    "compositeCoreWitnessCount": sum(w["qClassification"] == "COMPOSITE" for w in witnesses),
                    "distinctTupleCount": len(tuples), "primeBaselineWitnessCount": len(baseline["targets"][i]["witnesses"]),
                    "primeBaselineDistinctTupleCount": len(baseline_tuples),
                    "additionalDistinctTupleCount": len(tuples - baseline_tuples), "coreWitnesses": witnesses})

all_witnesses = [w for t in reports for w in t["coreWitnesses"]]
all_tuples = {json.dumps(w["witness"], separators=(",", ":")) for w in all_witnesses}
all_baseline_tuples = {json.dumps(w["witness"], separators=(",", ":")) for t in baseline["targets"] for w in t["witnesses"]}
output = {"method": "ERDOS_STRAUS_AGGREGATE_ODD_BLOCK_DECISION_V1", "sourceArtifactDigest": artifact_hash,
          "expectedSourceArtifactDigest": artifact_hash,
          "primeCertificatesChecked": baseline["primeCertificatesChecked"], "coreWitnessCount": len(all_witnesses),
          "compositeCoreWitnessCount": sum(w["qClassification"] == "COMPOSITE" for w in all_witnesses),
          "distinctTupleCount": len(all_tuples), "primeBaselineDistinctTupleCount": len(all_baseline_tuples),
          "additionalDistinctTupleCount": len(all_tuples - all_baseline_tuples), "targets": reports,
          "scope": "Four fixed targets, m=2^a*q with odd q>=3 PRIME OR COMPOSITE; ratios ONLY 2^f*q^g, -a<=f<=a and g=-1,0,1 (whole q block, never its partial prime divisors). Exact image -2^t with |t|<=2a+2 and written cutoff3*2^a-1<=p; all allowed a/all s certified in this restricted block family. One canonical (A,U)-ordered strict representative per eligible (a,q,s); tuple counts refer to those representatives, not all solutions. Not all normalized composite-core divisors, formal/novelty, root coverage, agent evidence or denominator optimum."}
print(json.dumps(output, separators=(",", ":")))
