"""TIP-037 fixed independent stdlib positive-coprime-divisor replay.

No primary factors/images or signed-exponent DP are consumed.
"""
import hashlib
import json
import math
import sys
import time

TARGETS = [200023321, 200602081, 200656681, 131433121]
SHIFTS = [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107]
MAX_SECONDS, MAX_ROWS, MAX_PAIR_CHECKS, MAX_OUTPUT_BYTES = 60, 1000, 50000000, 2097152
INPUTS = {"targets": [str(p) for p in TARGETS], "shifts": [str(h) for h in SHIFTS], "preference": "LEGENDRE_P_OVER_H_NEGATIVE"}
LIMITS = {"seconds": 60, "maxRows": 1000, "maxStateInsertions": 2000000, "maxOutputBytes": 2097152}
SCOPE = "Four selected exposed development targets; every prime h=3 mod4 up to107, Type II only. Character preference is routing, never QR impossibility. Complete signed images, canonical partitions and miss defects are finite arithmetic evidence, not a universal shift bound, held-out benchmark, root proof or novelty certificate. No agent-cycle authority."


def compact(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(compact(value).encode()).hexdigest()


class LimitReached(Exception):
    pass


class Investigation(Exception):
    def __init__(self, row):
        self.row = row
        super().__init__("MISS_DEFECT_CONTRADICTION")


class Budget:
    def __init__(self, clock=time.monotonic, pair_limit=MAX_PAIR_CHECKS):
        self.clock, self.start, self.pair_limit = clock, clock(), pair_limit
        self.pairs = 0
        self.pending = {"phase": "ROW", "p": str(TARGETS[0]), "h": str(SHIFTS[0])}

    def check(self):
        if self.clock() - self.start >= MAX_SECONDS:
            raise LimitReached("REPLAY_TIME_LIMIT")

    def pair(self):
        self.check()
        if self.pairs >= self.pair_limit:
            raise LimitReached("REPLAY_PAIR_LIMIT")
        self.pairs += 1


def prime(n, budget=None):
    if n < 2 or (n % 2 == 0 and n != 2):
        return False
    for d in range(3, math.isqrt(n) + 1, 2):
        if budget and d % 1024 == 1:
            budget.check()
        if n % d == 0:
            return False
    return True


def divisors_and_factors(T, budget):
    ds = set()
    for d in range(1, math.isqrt(T) + 1):
        if d % 1024 == 0:
            budget.check()
        if T % d == 0:
            ds.add(d)
            ds.add(T // d)
    ds = sorted(ds)
    remaining, fs = T, []
    for d in ds[1:]:
        budget.check()
        if remaining % d:
            continue
        if not prime(d, budget):
            raise ValueError("NONPRIME_DIVISOR")
        e = 0
        while remaining % d == 0:
            remaining //= d
            e += 1
        fs.append((d, e))
    if remaining != 1 or math.prod(q**e for q, e in fs) != T:
        raise ValueError("FACTOR_PRODUCT")
    return ds, fs


def strict_witness(p, h, T, u, v):
    if not (0 < u <= v and math.gcd(u, v) == 1 and T % (u * v) == 0 and (u + v) % h == 0):
        raise ValueError("PARTITION_DOMAIN")
    k, A = T // (u * v), (u + v) // h
    x, y, z = sorted([T, A * p * u * k, A * p * v * k])
    if not (0 < x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z)
            and sum(d % p == 0 for d in [x, y, z]) == 2):
        raise ValueError("STRICT_TYPE_II")
    return dict(zip(["u", "v", "k", "A", "x", "y", "z"], map(str, [u, v, k, A, x, y, z])))


def defect(fs, image, h, budget=None):
    S = set(image)
    H = []
    for r in range(1, h):
        if budget:
            budget.check()
        if {r * s % h for s in S} == S:
            H.append(r)
    n = (h - 1) // len(H)
    visible = []
    for q, e in fs:
        r = q % h
        if r in H:
            continue
        # Quotient order is the first power in H, not full multiplicative order.
        order = next(d for d in range(1, h) if pow(r, d, h) in H)
        visible.append({"prime": str(q), "exponent": str(e), "residue": str(r), "quotientOrder": str(order)})
    V = sum(int(f["exponent"]) for f in visible)
    nonresidue = any(pow(q, (h - 1) // 2, h) == h - 1 for q, _ in fs)
    return {"stabilizer": list(map(str, H)), "size": str(len(H)), "index": str(n), "visibleMass": str(V),
            "nonresidue": nonresidue, "visibleFactors": visible,
            "conditions": {"indexEven": n % 2 == 0, "indexTwoModFour": n % 4 == 2,
                           "nonresidueIndexAtLeastSix": not nonresidue or n >= 6,
                           "visibleMassBound": 2 * V <= n - 2,
                           "ordersBeyondIntervals": all(int(f["quotientOrder"]) > 2 * int(f["exponent"]) + 1 for f in visible)}}


def row(p, h, budget):
    budget.check()
    if not (prime(p, budget) and p % 840 == 1 and prime(h, budget) and h % 4 == 3
            and p % h and (p + h) % 4 == 0):
        raise ValueError("INVALID_DOMAIN")
    T = (p + h) // 4
    ds, fs = divisors_and_factors(T, budget)
    image, best = set(), None
    for u in ds:
        for v in ds:
            budget.pair()
            if T % (u * v) or math.gcd(u, v) != 1:
                continue
            image.add(u * pow(v, -1, h) % h)
            if u <= v and (u + v) % h == 0 and (best is None or (u, v) < best):
                best = (u, v)
    budget.check()
    canonical = strict_witness(p, h, T, *best) if best else None
    miss = None if best else defect(fs, image, h, budget)
    legendre = "-1" if pow(p, (h - 1) // 2, h) == h - 1 else "+1"
    image = list(map(str, sorted(image)))
    r = {"p": str(p), "h": str(h), "T": str(T), "factors": [[str(q), str(e)] for q, e in fs],
         "image": image, "count": str(len(image)), "hit": best is not None, "canonical": canonical,
         "character": {"legendre": legendre, "preferred": legendre == "-1"}, "defect": miss,
         "imageDigest": digest(image), "witnessDigest": digest(canonical) if canonical else None,
         "defectDigest": digest(miss) if miss else None}
    r["rowDigest"] = digest(r)
    if miss and not all(miss["conditions"].values()):
        raise Investigation(r)
    return r


def routing(rows):
    result = []
    for p in TARGETS:
        rs = [r for r in rows if r["p"] == str(p)]
        hits = [r for r in rs if r["hit"]]
        preferred = [r for r in rs if r["character"]["preferred"]]
        preferred_hits = [r for r in hits if r["character"]["preferred"]]
        result.append({"p": str(p), "complete": len(rs) == len(SHIFTS), "preferredShifts": [r["h"] for r in preferred],
                       "smallestSuccessfulFull": hits[0]["h"] if hits else None,
                       "smallestSuccessfulPreferred": preferred_hits[0]["h"] if preferred_hits else None,
                       "hitRows": str(len(hits)), "preferredHitRows": str(len(preferred_hits))})
    return result


def seal_packet(result):
    result["shiftManifestDigest"] = digest(INPUTS["shifts"])
    result["rowsDigest"] = digest(result["rows"])
    result["routing"] = routing(result["rows"])
    result["routingDigest"] = digest(result["routing"])
    result["contentDigest"] = digest({k: result[k] for k in ("inputs", "shiftManifestDigest", "rows", "rowsDigest", "routing", "routingDigest")})
    for _ in range(16):
        result["packetDigest"] = digest({k: v for k, v in result.items() if k != "packetDigest"})
        actual = str(len(compact(result).encode()))
        if actual == result["runtime"]["outputBytes"]:
            return
        result["runtime"]["outputBytes"] = actual
    raise ValueError("OUTPUT_FIXED_POINT")


def packet(clock=time.monotonic, pair_limit=MAX_PAIR_CHECKS):
    b, rows = Budget(clock, pair_limit), []
    status, pending, reason = "COMPLETE", None, None
    try:
        if [h for h in range(3, 108, 4) if prime(h, b)] != SHIFTS:
            raise ValueError("SHIFT_POOL")
        for p in TARGETS:
            for h in SHIFTS:
                b.pending = {"phase": "ROW", "p": str(p), "h": str(h)}
                b.check()
                if len(rows) >= MAX_ROWS:
                    raise LimitReached("ROW_LIMIT")
                rows.append(row(p, h, b))
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except LimitReached as error:
        status, pending, reason = "PARTIAL", dict(b.pending), str(error)
    result = {"method": "ERDOS_STRAUS_CHARACTER_SHIFT_DEFECTS_V1", "status": status, "inputs": INPUTS,
              "limits": LIMITS, "rows": rows, "pending": pending, "reason": reason, "scope": SCOPE,
              "runtime": {"pairChecks": str(b.pairs), "elapsedMs": "0", "outputBytes": "0"}}

    def seal():
        result["runtime"]["elapsedMs"] = str(round((clock() - b.start) * 1000))
        seal_packet(result)

    seal()
    if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT_BYTES:
        complete = list(rows)
        low, high = 0, len(rows)
        result["status"], result["reason"] = "PARTIAL", "OUTPUT_LIMIT"
        while low < high:
            mid = (low + high + 1) // 2
            result["rows"] = complete[:mid]
            result["pending"] = {"phase": "ROW", "p": complete[mid]["p"], "h": complete[mid]["h"]} if mid < len(complete) else {"phase": "FINALIZE"}
            seal()
            if int(result["runtime"]["outputBytes"]) <= MAX_OUTPUT_BYTES:
                low = mid
            else:
                high = mid - 1
        result["rows"] = complete[:low]
        result["pending"] = {"phase": "ROW", "p": complete[low]["p"], "h": complete[low]["h"]} if low < len(complete) else {"phase": "FINALIZE"}
        seal()
        if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT_BYTES:
            raise ValueError("OUTPUT_HEAD_TOO_LARGE")
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result["status"], result["pending"], result["reason"] = "PARTIAL", {"phase": "FINALIZE"}, "REPLAY_TIME_LIMIT"
        seal()
    encoded = compact(result)
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result["status"], result["pending"], result["reason"] = "PARTIAL", {"phase": "FINALIZE"}, "REPLAY_TIME_LIMIT"
        seal()
        encoded = compact(result)
    if len(encoded.encode()) > MAX_OUTPUT_BYTES:
        raise ValueError("OUTPUT_FINAL_LIMIT")
    return result


def main():
    if len(sys.argv) != 1:
        raise ValueError("FIXED_NO_ARGUMENTS")
    try:
        start = time.monotonic()
        result = packet(clock=time.monotonic)
        payload = compact(result)
        elapsed = round((time.monotonic() - start) * 1000)
        # Include the actual final stdout serialization in the observed completion checkpoint.
        if result["status"] == "COMPLETE" and elapsed >= MAX_SECONDS * 1000:
            result["status"], result["pending"], result["reason"] = "PARTIAL", {"phase": "FINALIZE"}, "REPLAY_TIME_LIMIT"
            result["runtime"]["elapsedMs"] = str(elapsed)
            seal_packet(result)
            payload = compact(result)
        if len(payload.encode()) > MAX_OUTPUT_BYTES:
            raise ValueError("OUTPUT_STDOUT_LIMIT")
        print(payload, end="")
    except Investigation as error:
        output = compact({"method": "CHARACTER_SHIFT_INVESTIGATION_V1", "status": "INVESTIGATION",
                          "reason": str(error), "row": error.row,
                          "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"})
        if len(output.encode()) <= MAX_OUTPUT_BYTES:
            print(output, end="")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
