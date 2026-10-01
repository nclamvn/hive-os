"""TIP-036 independent positive-divisor-pair replay, fixed stdlib-only inputs.

No signed-factor DP and no factorization or data imported from TypeScript.
The packet schema is shared; the arithmetic discovery implementation is not.
"""
import hashlib
import itertools
import json
import math
import sys
import time

LOWER = 200000000
UPPER = 201000000
SHIFTS = [7, 11, 23, 47, 59, 83, 107]
WARMUP = [131433121, 159727681, 351121, 171348241]
MAX_SECONDS = 60
MAX_ROWS = 10000
MAX_PAIR_CHECKS = 50000000
MAX_OUTPUT_BYTES = 2097152


def compact(value):
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False, sort_keys=True)


def digest(value):
    return hashlib.sha256(compact(value).encode("utf-8")).hexdigest()


class LimitReached(Exception):
    pass


class CandidateInvestigation(Exception):
    def __init__(self, row):
        self.row = row
        super().__init__("STRUCTURAL_PREDICTION_CONTRADICTION")


class ReplayBudget:
    def __init__(self, clock=time.monotonic, pair_limit=MAX_PAIR_CHECKS):
        self.clock = clock
        self.deadline = clock() + MAX_SECONDS
        self.pair_limit = pair_limit
        self.pair_checks = 0
        self.pending = {"phase": "INIT"}

    def check(self):
        if self.clock() >= self.deadline:
            raise LimitReached("REPLAY_TIME_LIMIT")

    def pair(self):
        self.check()
        if self.pair_checks >= self.pair_limit:
            raise LimitReached("REPLAY_PAIR_LIMIT")
        self.pair_checks += 1


def prime(n, budget=None):
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    for d in range(3, math.isqrt(n) + 1, 2):
        if budget and d % 1024 == 1:
            budget.check()
        if n % d == 0:
            return False
    return True


def divisor_scan(n, budget):
    result = set()
    for d in range(1, math.isqrt(n) + 1):
        if d % 1024 == 0:
            budget.check()
        if n % d == 0:
            result.add(d)
            result.add(n // d)
    return sorted(result)


def factors_from_divisors(n, divisors, budget):
    remaining = n
    fs = []
    for d in divisors[1:]:
        budget.check()
        if remaining % d:
            continue
        if not prime(d, budget):
            raise ValueError("Nonprime recovered divisor")
        exponent = 0
        while remaining % d == 0:
            remaining //= d
            exponent += 1
        fs.append([d, exponent])
    if remaining != 1 or math.prod(q**e for q, e in fs) != n:
        raise ValueError("Factor product mismatch")
    return fs


def strict_witness(p, h, T, u, v):
    if not (0 < u <= v and math.gcd(u, v) == 1 and T % (u * v) == 0 and (u + v) % h == 0):
        raise ValueError("Partition domain")
    k, A = T // (u * v), (u + v) // h
    ds = sorted([u * v * k, A * p * u * k, A * p * v * k])
    x, y, z = ds
    if not (p > 2 and 0 < x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z)
            and sum(d % p == 0 for d in ds) == 2):
        raise ValueError("Strict Type-II identity")
    return {"u": str(u), "v": str(v), "k": str(k), "A": str(A),
            "x": str(x), "y": str(y), "z": str(z)}


def primitive_inverse_pair(residues, h):
    if not residues:
        return False
    ell = (h - 1) // 2
    r = residues[0]
    inverse = pow(r, -1, h)
    return all(q != h - 1 and pow(q, ell, h) == h - 1 and q in (r, inverse) for q in residues)


def candidate(fs, h):
    ell = (h - 1) // 2
    nonidentity = [q % h for q, _ in fs if q % h != 1]
    weight = sum(e for q, e in fs if q % h != 1)
    nonresidue = any(pow(q, ell, h) == h - 1 for q in nonidentity)
    minus_one = h - 1 in nonidentity
    threshold = nonresidue and weight >= ell
    boundary = nonresidue and weight == ell - 1
    inverse_pair = primitive_inverse_pair(nonidentity, h) if boundary else None
    prediction = True if minus_one or threshold else False if not nonresidue else not inverse_pair if boundary else None
    return {"ell": str(ell), "weight": str(weight), "nonresidue": nonresidue,
            "minusOneFactor": minus_one, "thresholdApplicable": threshold,
            "boundaryApplicable": boundary, "inversePairPrimitive": inverse_pair, "predictedHit": prediction}


def independent_partition(p, h, budget):
    budget.pending = {"phase": "ROW_DOMAIN", "p": p, "h": h}
    budget.check()
    if not (3 <= p <= UPPER and prime(p, budget) and h in SHIFTS and prime(h, budget)
            and h % 4 == 3 and p % h != 0 and (p + h) % 4 == 0):
        raise ValueError("INVALID_DOMAIN")
    T = (p + h) // 4
    budget.pending = {"phase": "ROW_DIVISORS", "p": p, "h": h, "T": T}
    divisors = divisor_scan(T, budget)
    fs = factors_from_divisors(T, divisors, budget)
    residues = set()
    canonical = None
    budget.pending = {"phase": "ROW_PAIRS", "p": p, "h": h, "T": T}
    for u in divisors:
        for v in divisors:
            budget.pending = {"phase": "ROW_PAIRS", "p": p, "h": h, "T": T, "u": u, "v": v}
            budget.pair()
            if T % (u * v) or math.gcd(u, v) != 1:
                continue
            residues.add(u * pow(v, -1, h) % h)
            if u <= v and (u + v) % h == 0 and (canonical is None or (u, v) < canonical):
                canonical = (u, v)
    budget.pending = {"phase": "ROW_FINALIZE", "p": p, "h": h, "T": T}
    budget.check()
    image = [str(r) for r in sorted(residues)]
    construction = strict_witness(p, h, T, *canonical) if canonical else None
    row = {"p": str(p), "h": str(h), "T": str(T),
           "factors": [[str(q), str(e)] for q, e in fs], "image": image,
           "count": str(len(image)), "hit": canonical is not None, "canonical": construction,
           "candidate": candidate(fs, h), "imageDigest": digest(image),
           "witnessDigest": digest(construction) if construction else None}
    row["rowDigest"] = digest(row)
    if row["candidate"]["predictedHit"] is not None and row["candidate"]["predictedHit"] != row["hit"]:
        raise CandidateInvestigation(row)
    return row


def group_controls(budget, controls=None):
    if controls is None:
        controls = []
    for h in (7, 11):
        weight = (h - 1) // 2 - 1
        records = []

        def profiles(prefix, remaining):
            if len(prefix) == h - 3:
                yield prefix + [remaining]
                return
            for e in range(remaining + 1):
                yield from profiles(prefix + [e], remaining - e)

        for profile in profiles([], weight):
            budget.pending = {"phase": "GROUP_CONTROLS", "h": str(h)}
            budget.check()
            active = [(r, e) for r, e in zip(range(2, h), profile) if e]
            residues = set()
            # Exhaustive Cartesian exponents, not the primary dynamic state insertion algorithm.
            for exponents in itertools.product(*(range(-e, e + 1) for _, e in active)):
                budget.check()
                residue = math.prod(pow(r, exponent, h) for (r, _), exponent in zip(active, exponents)) % h
                residues.add(residue)
            nonresidue = any(pow(r, (h - 1) // 2, h) == h - 1 for r, _ in active)
            inverse_pair = primitive_inverse_pair([r for r, _ in active], h)
            prediction = nonresidue and not inverse_pair
            records.append({"profile": [str(e) for e in profile], "image": [str(r) for r in sorted(residues)],
                            "nonresidue": nonresidue, "inversePairPrimitive": inverse_pair,
                            "predictedHit": prediction, "hit": h - 1 in residues})
        controls.append({"h": str(h), "weight": str(weight), "profiles": str(len(records)),
                         "applicableProfiles": str(sum(r["nonresidue"] for r in records)),
                         "misses": str(sum(not r["hit"] for r in records)),
                         "classificationMismatches": str(sum(r["predictedHit"] != r["hit"] for r in records)),
                         "profilesDigest": digest(records)})
    return controls


INPUTS = {"interval": {"lowerExclusive": str(LOWER), "upperInclusive": str(UPPER), "residue": "1", "modulus": "840"},
          "warmups": [str(p) for p in WARMUP], "shifts": [str(h) for h in SHIFTS], "separateControl": "19"}
LIMITS = {"seconds": 60, "maxRows": 10000, "maxStateInsertions": 2000000, "maxOutputBytes": 2097152}
SCOPE = "Frozen public development interval and four exposed warmups; seven fixed safe-prime shifts, Type II only. Complete images and canonical coprime partitions are finite arithmetic evidence, not an exhaustive shift menu, a root proof, held-out benchmark or novelty certificate. p19 is a separate wrong-domain and historical h1 control. No agent-cycle authority."
SEPARATE_CONTROL = {"p": "19", "menuDomain": "NONINTEGER_T", "menuRejected": True,
                    "oldH1Witness": {"h": "1", "T": "5", "u": "1", "v": "5", "k": "1", "A": "6",
                                     "x": "5", "y": "114", "z": "570"}, "scope": "OUTSIDE_RESIDUAL_DOMAIN"}


def packet(clock=time.monotonic, pair_limit=MAX_PAIR_CHECKS):
    budget = ReplayBudget(clock, pair_limit)
    start = clock()
    primes, rows, controls = [], [], []
    pending, reason, scanned = {"phase": "INIT"}, None, LOWER
    status = "COMPLETE"
    try:
        # Separate historical h1 witness remains a control, never a frozen-menu row.
        if strict_witness(19, 1, 5, 1, 5) != {k: v for k, v in SEPARATE_CONTROL["oldH1Witness"].items() if k not in ("h", "T")}:
            raise ValueError("Historical h1 control identity drift")
        group_controls(budget, controls)
        first = LOWER + (1 - LOWER) % 840
        if first <= LOWER:
            first += 840
        for p in range(first, UPPER + 1, 840):
            budget.pending = {"phase": "PRIME_SCAN", "p": str(p)}
            budget.check()
            if prime(p, budget):
                primes.append(str(p))
            scanned = p
        for p in WARMUP + [int(p) for p in primes]:
            for h in SHIFTS:
                budget.pending = {"phase": "ROW", "p": str(p), "h": str(h)}
                budget.check()
                if len(rows) >= MAX_ROWS:
                    raise LimitReached("ROW_LIMIT")
                rows.append(independent_partition(p, h, budget))
        budget.pending = {"phase": "FINALIZE"}
        budget.check()
    except LimitReached as error:
        status, reason = "PARTIAL", str(error)
        # Arithmetic-local phase is retained in replay metadata; common packet uses its exact row identity.
        current = budget.pending
        pending = {"phase": "ROW" if current["phase"].startswith("ROW_") else current["phase"]}
        for key in ("p", "h"):
            if key in current:
                pending[key] = str(current[key])
    else:
        pending = None
    result = {"method": "ERDOS_STRAUS_ADAPTIVE_SHIFT_PARTITIONS_V1", "status": status,
              "inputs": INPUTS, "limits": LIMITS, "primes": primes,
              "rows": rows, "separateControl": SEPARATE_CONTROL,
              "groupControls": controls, "pending": pending,
              "reason": reason, "scannedThrough": str(scanned),
              "scope": SCOPE,
              "runtime": {"pairChecks": str(budget.pair_checks), "elapsedMs": str(round((clock() - start) * 1000)), "outputBytes": "0"}}
    def seal():
        result["primeManifestDigest"], result["rowsDigest"] = digest(primes), digest(result["rows"])
        content = {k: result[k] for k in ("inputs", "primes", "primeManifestDigest", "rows", "rowsDigest", "separateControl", "groupControls")}
        result["contentDigest"] = digest(content)
        for _ in range(16):
            result["packetDigest"] = digest({k: v for k, v in result.items() if k != "packetDigest"})
            actual = str(len(compact(result).encode()))
            if result["runtime"]["outputBytes"] == actual:
                return
            result["runtime"]["outputBytes"] = actual
        raise ValueError("Output byte fixed point")

    seal()
    if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT_BYTES:
        # Preserve the largest exact retained row prefix, naming the first unretained row.
        complete_rows = list(rows)
        low, high = 0, len(complete_rows)
        result["status"], result["reason"] = "PARTIAL", "OUTPUT_LIMIT"
        while low < high:
            mid = (low + high + 1) // 2
            result["rows"] = complete_rows[:mid]
            result["pending"] = {"phase": "ROW", "p": complete_rows[mid]["p"], "h": complete_rows[mid]["h"]} if mid < len(complete_rows) else {"phase": "FINALIZE"}
            seal()
            if int(result["runtime"]["outputBytes"]) <= MAX_OUTPUT_BYTES:
                low = mid
            else:
                high = mid - 1
        result["rows"] = complete_rows[:low]
        result["pending"] = {"phase": "ROW", "p": complete_rows[low]["p"], "h": complete_rows[low]["h"]} if low < len(complete_rows) else {"phase": "FINALIZE"}
        seal()
        if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT_BYTES:
            raise ValueError("Replay metadata alone exceeds byte cap")
    # This checkpoint includes full serialization, not just arithmetic finalization.
    try:
        budget.check()
    except LimitReached:
        if result["status"] == "COMPLETE":
            result["status"], result["reason"], result["pending"] = "PARTIAL", "REPLAY_TIME_LIMIT", {"phase": "FINALIZE"}
    result["runtime"]["elapsedMs"] = str(round((clock() - start) * 1000))
    seal()
    if result["status"] == "COMPLETE" and clock() >= budget.deadline:
        result["status"], result["reason"], result["pending"] = "PARTIAL", "REPLAY_TIME_LIMIT", {"phase": "FINALIZE"}
        seal()
    if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT_BYTES:
        raise ValueError("Replay output exceeds final byte cap")
    return result


def main():
    if len(sys.argv) != 1:
        raise SystemExit("No supplied arguments are accepted")
    try:
        print(compact(packet()), end="")
    except CandidateInvestigation as error:
        diagnostic = {"method": "ADAPTIVE_SHIFT_REPLAY_INVESTIGATION_V1", "status": "INVESTIGATION",
                      "reason": "STRUCTURAL_PREDICTION_CONTRADICTION", "row": error.row,
                      "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"}
        payload = compact(diagnostic)
        if len(payload.encode()) > MAX_OUTPUT_BYTES:
            raise SystemExit("Investigation diagnostic exceeds byte cap")
        print(payload, end="")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
