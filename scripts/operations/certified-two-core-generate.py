"""Bounded deterministic discovery; emitted claims require separate exact replay."""
import json
import math
import signal
import time
from pathlib import Path

TARGETS = (131433121, 159727681, 351121, 171348241)
CERTIFICATES = {2: {"n": "2", "minusOneFactors": [], "witnesses": []}}
FACTORS = {1: []}
DEADLINE = 0


def alarm(_signal, _frame):
    raise RuntimeError("TARGET_120_SECOND_DISCOVERY_LIMIT")


signal.signal(signal.SIGALRM, alarm)


def guard():
    if time.monotonic() >= DEADLINE:
        raise RuntimeError("TARGET_120_SECOND_DISCOVERY_LIMIT")


def probable(n):
    # Discovery filter ONLY; no MR conclusion is trusted by either checker.
    if n < 2:
        return False
    for q in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53):
        if n % q == 0:
            return n == q
    d, s = n - 1, 0
    while d % 2 == 0:
        d //= 2
        s += 1
    for base in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53):
        x = pow(base, d, n)
        if x in (1, n - 1):
            continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1:
                break
        else:
            return False
    return True


def rho(n):
    for seed in range(1, 33):
        guard()
        y, c, r, g, count = 2 + seed, 1 + 2 * seed, 1, 1, 0
        while g == 1 and count < 2000000:
            if count + r > 2000000:
                break
            x = y
            for step in range(r):
                if step % 4096 == 0:
                    guard()
                y = (y * y + c) % n
            count += r
            k = 0
            while k < r and g == 1 and count < 2000000:
                guard()
                ys, product = y, 1
                batch = min(64, r - k, 2000000 - count)
                for _ in range(batch):
                    y = (y * y + c) % n
                    product = product * abs(x - y) % n
                g = math.gcd(product, n)
                k += batch
                count += batch
            r *= 2
        if g == n:
            for _ in range(min(4096, 2000000 - count)):
                guard()
                count += 1
                ys = (ys * ys + c) % n
                g = math.gcd(abs(x - ys), n)
                if g > 1:
                    break
        if 1 < g < n:
            return g
    raise RuntimeError("DETERMINISTIC_RHO_ITERATION_LIMIT")


def factor(n):
    guard()
    if n in FACTORS:
        return FACTORS[n]
    original, leaves = n, []
    for q in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53):
        while n % q == 0:
            leaves.append(q)
            n //= q

    def split(v):
        guard()
        if v == 1:
            return
        if probable(v):
            certify(v)
            leaves.append(v)
            return
        d = rho(v)
        split(d)
        split(v // d)

    split(n)
    unique = sorted(set(leaves))
    for q in unique:
        certify(q)
    result = [[str(q), leaves.count(q)] for q in unique]
    assert math.prod(int(q) ** e for q, e in result) == original
    FACTORS[original] = result
    return result


def certify(n):
    guard()
    if n in CERTIFICATES:
        return
    fs = factor(n - 1)
    witnesses = []
    for q, _ in fs:
        for a in range(2, min(n, 4098)):
            guard()
            if pow(a, n - 1, n) == 1 and math.gcd(pow(a, (n - 1) // int(q), n) - 1, n) == 1:
                witnesses.append([q, str(a)])
                break
        else:
            raise RuntimeError("LUCAS_WITNESS_DISCOVERY_LIMIT")
    CERTIFICATES[n] = {"n": str(n), "minusOneFactors": fs, "witnesses": witnesses}


def divisors(fs):
    values = [1]
    for q, e in fs:
        values = [v * int(q) ** j for v in values for j in range(e + 1)]
    return values


def generate_target(p, phase_hook=None):
    """Whole-target timeout boundary; hook is for isolated fault-injection tests."""
    global DEADLINE
    if p not in TARGETS:
        raise ValueError("Fixed targets only")
    DEADLINE = time.monotonic() + 120
    max_a = 0
    while 3 * 2 ** (max_a + 1) - 1 <= p:
        max_a += 1
    max_j = 2 * max_a + 2
    required = [(kind, j, p + 2 ** j if kind == "PLUS_POWER" else 2 ** j * p + 1)
                for j in range(max_j + 1) for kind in ("PLUS_POWER", "TIMES_POWER")]
    entries, unresolved, ell_entries, candidates = [], [], [], set()
    enumerated = set()
    context = {"value": str(p), "purpose": "TARGET_PRIME"}
    error_reason = None

    def phase(name, value, purpose):
        nonlocal context
        context = {"value": str(value), "purpose": purpose}
        if phase_hook:
            phase_hook(name)
        guard()

    try:
        signal.setitimer(signal.ITIMER_REAL, max(0.001, DEADLINE - time.monotonic()))
        phase("TARGET_PRIME", p, "TARGET_PRIME")
        certify(p)
        for kind, j, n in required:
            phase("CRITERION_FACTOR", n, f"{kind}:{j}")
            entries.append({"kind": kind, "j": j, "value": str(n), "factors": factor(n)})
        for a in range(1, max_a + 1):
            C = 2 ** (a + 2)
            for entry in entries:
                if entry["j"] > 2 * a + 2:
                    continue
                key = (a, entry["kind"], entry["j"])
                purpose = f"CANDIDATE_ENUMERATION:{a}:{entry['kind']}:{entry['j']}"
                phase("CANDIDATE_ENUMERATION", entry["value"], purpose)
                for s in divisors(entry["factors"]):
                    guard()
                    if (s + 1) % C == 0:
                        ell = (s + 1) // C
                        if ell >= 3 and ell % 2:
                            candidates.add(ell)
                enumerated.add(key)
        for ell in sorted(candidates):
            phase("CANDIDATE_FACTOR", ell, "CANDIDATE_ELL")
            ell_entries.append({"value": str(ell), "factors": factor(ell)})
        phase("FINALIZE_TARGET", p, "FINALIZE_TARGET")
    except RuntimeError as error:
        # SIGALRM anywhere in the complete target phase reaches this boundary.
        # Disable it immediately before constructing explicit pending evidence.
        signal.setitimer(signal.ITIMER_REAL, 0)
        error_reason = str(error)
        unresolved.append({**context, "reason": error_reason})
    finally:
        # Appending/printing the returned record happens with the alarm disabled.
        signal.setitimer(signal.ITIMER_REAL, 0)

    if error_reason:
        known = {(entry["kind"], entry["j"]) for entry in entries}
        for kind, j, n in required:
            if (kind, j) not in known:
                unresolved.append({"value": str(n), "purpose": f"{kind}:{j}", "reason": error_reason})
        if len(entries) == len(required):
            for a in range(1, max_a + 1):
                for entry in entries:
                    key = (a, entry["kind"], entry["j"])
                    if entry["j"] <= 2 * a + 2 and key not in enumerated:
                        unresolved.append({"value": entry["value"],
                                           "purpose": f"CANDIDATE_ENUMERATION:{a}:{entry['kind']}:{entry['j']}",
                                           "reason": error_reason})
            factored_ell = {int(entry["value"]) for entry in ell_entries}
            for ell in sorted(candidates - factored_ell):
                unresolved.append({"value": str(ell), "purpose": "CANDIDATE_ELL", "reason": error_reason})
    # Preserve one exact unresolved entry per purpose/input; no invented miss.
    unresolved = list({(entry["purpose"], entry["value"]): entry for entry in unresolved}.values())
    return {"p": str(p), "maxA": max_a, "maxJ": max_j,
            "status": "PARTIAL" if unresolved else "COMPLETE",
            "criterionFactors": entries, "candidateEllFactors": ell_entries,
            "unresolved": unresolved}


def main():
    records = []
    for p in TARGETS:
        record = generate_target(p)
        records.append(record)
        print(json.dumps({"p": p, "status": record["status"],
                          "criterionEntries": len(record["criterionFactors"]),
                          "candidateEllEntries": len(record["candidateEllFactors"]),
                          "unresolved": len(record["unresolved"])}), flush=True)
    artifact = {"method": "ERDOS_STRAUS_CERTIFIED_TWO_CORE_TAIL_V1",
                "discoveryLimits": {"secondsPerTarget": 120, "rhoSeeds": 32, "rhoIterationsPerSeed": 2000000, "lucasBases": 4096},
                "targets": records, "primes": [CERTIFICATES[n] for n in sorted(CERTIFICATES)]}
    path = Path(__file__).with_name("certified-two-core-artifact.json")
    path.write_text(json.dumps(artifact, separators=(",", ":")) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
