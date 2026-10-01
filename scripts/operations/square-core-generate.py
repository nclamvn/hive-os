"""Fixed b2/a1..4 discovery; all assertions require separate exact checkers."""
import hashlib
import json
import math
import runpy
import signal
import time
from pathlib import Path

HERE = Path(__file__).parent
D_HASH = "ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040"
# Unchanged discovery arithmetic only; its MR filter is never checker evidence.
engine = runpy.run_path(str(HERE / "certified-two-core-generate.py"), run_name="square_core_engine")
state = engine["factor"].__globals__
seed_bytes = (HERE / "certified-two-core-artifact.json").read_bytes()
assert hashlib.sha256(seed_bytes).hexdigest() == D_HASH
seed = json.loads(seed_bytes)
for node in seed["primes"]:
    state["CERTIFICATES"][int(node["n"])] = node
    state["FACTORS"][int(node["n"]) - 1] = node["minusOneFactors"]
for target in seed["targets"]:
    for entry in target["criterionFactors"] + target["candidateEllFactors"]:
        state["FACTORS"][int(entry["value"])] = entry["factors"]
TARGETS = (131433121, 159727681, 351121, 171348241)


def bounded_divisors(fs):
    values = [1]
    for q, e in fs:
        state["guard"]()
        if len(values) * (e + 1) > 100000:
            raise RuntimeError("DETERMINISTIC_DIVISOR_ITERATION_LIMIT")
        values = [v * int(q) ** j for v in values for j in range(e + 1)]
    return values


def required_inputs(p):
    out = [{"kind": kind, "a": 0, "t": j,
            "value": str(p + 2 ** j if kind == "PURE_PLUS" else 2 ** j * p + 1)}
           for j in range(11) for kind in ("PURE_PLUS", "PURE_TIMES")]
    for a in range(1, 5):
        C = 2 ** (a + 2)
        for t in range(-a, 2 * a + 3):
            value = C * (2 ** (-t) * p) ** 2 - 1 if t < 0 else C * p ** 2 - 2 ** (2 * t)
            out.append({"kind": "TRANSLATED", "a": a, "t": t, "value": str(value)})
    return out


def generate_target(p, phase_hook=None):
    if p not in TARGETS:
        raise ValueError("Fixed targets only")
    state["DEADLINE"] = time.monotonic() + 120
    required = required_inputs(p)
    entries, ell_entries, unresolved, candidates, enumerated = [], [], [], set(), set()
    context = {"value": str(p), "purpose": "TARGET_PRIME"}

    def phase(name, value, purpose):
        nonlocal context
        context = {"value": str(value), "purpose": purpose}
        if phase_hook:
            phase_hook(name)
        state["guard"]()

    error_reason = None
    try:
        signal.setitimer(signal.ITIMER_REAL, max(0.001, state["DEADLINE"] - time.monotonic()))
        phase("TARGET_PRIME", p, "TARGET_PRIME")
        state["certify"](p)
        for entry in required:
            phase("CRITERION_FACTOR", entry["value"], f"{entry['kind']}:{entry['a']}:{entry['t']}")
            entries.append({**entry, "factors": state["factor"](int(entry["value"]))})
        for a in range(1, 5):
            C = 2 ** (a + 2)
            for index, entry in enumerate(entries):
                if entry["kind"] == "TRANSLATED" and entry["a"] != a:
                    continue
                if entry["kind"] != "TRANSLATED" and entry["t"] > 2 * a + 2:
                    continue
                phase("CANDIDATE_ENUMERATION", entry["value"], f"ENUMERATION:{a}:{index}")
                for s in bounded_divisors(entry["factors"]):
                    state["guard"]()
                    if (s + 1) % C:
                        continue
                    square = (s + 1) // C
                    ell = math.isqrt(square)
                    if ell >= 3 and ell % 2 and ell * ell == square:
                        candidates.add(ell)
                enumerated.add((a, index))
        for ell in sorted(candidates):
            phase("CANDIDATE_FACTOR", ell, "CANDIDATE_ELL")
            ell_entries.append({"value": str(ell), "factors": state["factor"](ell)})
        phase("FINALIZE_TARGET", p, "FINALIZE_TARGET")
    except RuntimeError as error:
        signal.setitimer(signal.ITIMER_REAL, 0)
        error_reason = str(error)
        unresolved.append({**context, "reason": error_reason})
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
    if error_reason:
        for entry in required[len(entries):]:
            unresolved.append({"value": entry["value"], "purpose": f"{entry['kind']}:{entry['a']}:{entry['t']}", "reason": error_reason})
        if len(entries) == len(required):
            for a in range(1, 5):
                for index, entry in enumerate(entries):
                    eligible = (entry["kind"] == "TRANSLATED" and entry["a"] == a) or (entry["kind"] != "TRANSLATED" and entry["t"] <= 2 * a + 2)
                    if eligible and (a, index) not in enumerated:
                        unresolved.append({"value": entry["value"], "purpose": f"ENUMERATION:{a}:{index}", "reason": error_reason})
            decided = {int(entry["value"]) for entry in ell_entries}
            for ell in sorted(candidates - decided):
                unresolved.append({"value": str(ell), "purpose": "CANDIDATE_ELL", "reason": error_reason})
    unresolved = list({(entry["purpose"], entry["value"]): entry for entry in unresolved}.values())
    t0 = p // 4 + 1
    return {"p": str(p), "maxCore": str(t0 * (t0 + 1) // (4 * t0 - p)),
            "status": "PARTIAL" if unresolved else "COMPLETE", "criterionFactors": entries,
            "candidateEllFactors": ell_entries, "unresolved": unresolved}


def main():
    records = []
    for p in TARGETS:
        record = generate_target(p)
        records.append(record)
        print(json.dumps({"p": p, "status": record["status"], "entries": len(record["criterionFactors"]),
                          "ellEntries": len(record["candidateEllFactors"]), "unresolved": record["unresolved"]}), flush=True)
    artifact = {"method": "ERDOS_STRAUS_CERTIFIED_SQUARE_CORE_SLICE_V1",
                "scope": {"b": 2, "minA": 1, "maxA": 4, "ellOrModulusCeiling": None, "higherAorB": "UNCOMPUTED"},
                "discoveryLimits": {"secondsPerTarget": 120, "rhoSeeds": 32, "rhoIterationsPerSeed": 2000000, "lucasBases": 4096},
                "targets": records, "primes": [state["CERTIFICATES"][n] for n in sorted(state["CERTIFICATES"])]}
    (HERE / "square-core-artifact.json").write_text(json.dumps(artifact, separators=(",", ":")) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
