"""TIP-039 independent fixed composite-shift CRT replay, stdlib only.

No primary factors, images, projected minima or historical outcomes imported.
"""
import hashlib
import json
import math
import sys
import time

BRANCHES = [("r0", 200023321, 31, 531977, 1),
            ("r1", 200023321, 71, 61, 1),
            ("r2", 200023321, 79, 1000117, 1),
            ("r3", 200602081, 23, 8358421, 1),
            ("r4", 200602081, 43, 850009, 1),
            ("r5", 200602081, 67, 1409, 1),
            ("r6", 200602081, 83, 82349, 1),
            ("r7", 200656681, 43, 22709, 1),
            ("r10", 131433121, 11, 2393, 1),
            ("r11", 131433121, 19, 6571657, 1),
            ("r13", 200656681, 2027, 68813, 1)]
MAX_SECONDS, MAX_PAIRS, MAX_WORK, MAX_OUTPUT = 60, 50000000, 50000000, 2097152
INPUTS = {"blockers": [dict(zip(["recordId", "p", "parentH", "q", "valuation"], map(str, b))) for b in BRANCHES],
          "sourceContentDigest": "952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4", "multiplier": "3"}
LIMITS = {"seconds": 60, "maxRows": 11, "maxStateInsertions": 2000000, "maxWorkSteps": 50000000, "maxOutputBytes": 2097152}
CLASSIFICATIONS = ["HIT", "LOCAL_3_OBSTRUCTION", "LOCAL_Q_OBSTRUCTION", "LOCAL_BOTH_OBSTRUCTION", "CRT_SYNCHRONIZATION_OBSTRUCTION"]
SCOPE = "FIXED_ELEVEN_TIP038_BLOCKERS_C_EQ_3Q_ONLY_NO_ROOT_OR_UNIVERSAL_EXCLUSION"


def compact(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(compact(value).encode()).hexdigest()


class Stop(Exception):
    pass


class Investigation(Exception):
    def __init__(self, row):
        self.row = row
        super().__init__("COMPOSITE_ARITHMETIC_CONTRADICTION")


class Budget:
    def __init__(self, clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK):
        self.clock, self.start = clock, clock()
        self.pair_limit, self.work_limit = pair_limit, work_limit
        self.pairs, self.work, self.pending = 0, 0, None

    def check(self):
        if self.clock() - self.start >= MAX_SECONDS:
            raise Stop("REPLAY_TIME_LIMIT")

    def pair(self):
        self.check()
        if self.pairs >= self.pair_limit:
            raise Stop("REPLAY_PAIR_LIMIT")
        self.pairs += 1

    def step(self):
        self.check()
        if self.work >= self.work_limit:
            raise Stop("MODULAR_LIMIT")
        self.work += 1


def prime(n, b=None):
    if n < 2 or n % 2 == 0 and n != 2:
        return False
    for d in range(3, math.isqrt(n) + 1, 2):
        if b and d % 1024 == 1:
            b.check()
        if n % d == 0:
            return False
    return True


def factor(n, b):
    fs, rest, d = [], n, 2
    while d * d <= rest:
        b.check()
        if rest % d == 0:
            e = 0
            while rest % d == 0:
                rest //= d
                e += 1
            fs.append((d, e))
        d = 3 if d == 2 else d + 2
    if rest > 1:
        fs.append((rest, 1))
    if math.prod(q**e for q, e in fs) != n or any(not prime(q, b) for q, _ in fs):
        raise ValueError("FACTOR_PRODUCT")
    return fs


def divisors(n, b):
    ds = set()
    for d in range(1, math.isqrt(n) + 1):
        if d % 1024 == 0:
            b.check()
        if n % d == 0:
            ds.add(d)
            ds.add(n // d)
    return sorted(ds)


def power(r, e, c, b):
    v = 1
    while e:
        b.step()
        if e % 2:
            v = v * r % c
        r = r * r % c
        e //= 2
    return v


def legendre(r, h, b):
    v = power(r % h, (h - 1) // 2, h, b)
    if v not in (1, h - 1):
        raise ValueError("ZERO_CHARACTER")
    return -1 if v == h - 1 else 1


def pair_record(T, u, v):
    return {"u": str(u), "v": str(v), "k": str(T // (u * v))}


def strict(p, c, T, pair):
    u, v, k = (int(pair[x]) for x in ["u", "v", "k"])
    if not (0 < u <= v and math.gcd(u, v) == 1 and u * v * k == T and (u + v) % c == 0):
        raise ValueError("PARTITION_DOMAIN")
    A = (u + v) // c
    x, y, z = sorted([T, A * p * u * k, A * p * v * k])
    if not (0 < x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z)
            and sum(d % p == 0 for d in [x, y, z]) == 2):
        raise ValueError("STRICT_TYPE_II")
    return dict(zip(["u", "v", "k", "A", "x", "y", "z"], map(str, [u, v, k, A, x, y, z])))


def image_pairs(T, c, q, b):
    ds = divisors(T, b)
    S, best = set(), {"joint": None, "local3": None, "localQ": None}
    for u in ds:
        for v in ds:
            b.pair()
            if T % (u * v) or math.gcd(u, v) != 1:
                continue
            b.step()
            S.add(u * pow(v, -1, c) % c)
            if u > v:
                continue
            for key, modulus in [("joint", c), ("local3", 3), ("localQ", q)]:
                if (u + v) % modulus == 0 and (best[key] is None or (u, v) < best[key]):
                    best[key] = (u, v)
    return sorted(S), {key: None if value is None else pair_record(T, *value) for key, value in best.items()}


def generic_defect(fs, image, c, q, b):
    S, H = set(image), []
    for r in image:
        okay = True
        for s in image:
            b.step()
            if r * s % c not in S:
                okay = False
                break
        if okay:
            H.append(r)
    HS, phi = set(H), 2 * (q - 1)
    if phi % len(H):
        raise ValueError("STABILIZER_SIZE")
    n = phi // len(H)
    phi_factors, visible = factor(phi, b), []
    for r, e in fs:
        residue = r % c
        if residue in HS:
            continue
        order = phi
        for d, _ in phi_factors:
            while order % d == 0 and power(residue, order // d, c, b) in HS:
                order //= d
        visible.append({"prime": str(r), "exponent": str(e), "residue": str(residue), "quotientOrder": str(order)})
    V = sum(int(f["exponent"]) for f in visible)
    # Solve the four CRT involutions, not a scan of all c residues.
    involutions = sorted({r + 3 * ((t - r) * pow(3, -1, q) % q) for r in [1, 2] for t in [1, q - 1]})
    return {"groupOrder": str(phi), "stabilizer": list(map(str, H)), "size": str(len(H)), "index": str(n), "visibleMass": str(V),
            "visibleFactors": visible, "involutionIntersection": [str(r) for r in involutions if r in HS],
            "conditions": {"targetCosetOrderTwo": c - 1 not in HS and power(c - 1, 2, c, b) in HS,
                           "indexEven": n % 2 == 0,
                           "visibleMassBound": 2 * V <= n - 2,
                           "ordersBeyondIntervals": all(int(f["quotientOrder"]) > 2 * int(f["exponent"]) + 1 for f in visible)}}


def compute_row(branch, b):
    record, p, parent_h, q, valuation = branch
    b.check()
    if not (prime(p, b) and prime(parent_h, b) and prime(q, b) and parent_h % 4 == 3 and q % 4 == 1
            and p % 840 == 1 and parent_h < p and (p + parent_h) % 4 == 0):
        raise ValueError("PARENT_DOMAIN")
    parent_t = (p + parent_h) // 4
    parent_fs = factor(parent_t, b)
    if (q, valuation) not in parent_fs or legendre(q, parent_h, b) != -1:
        raise ValueError("BLOCKER_PROVENANCE")
    c = 3 * q
    if not (c < p and (p + c) % 4 == 0 and math.gcd((p + c) // 4, c) == 1):
        raise ValueError("COMPOSITE_DOMAIN")
    T = (p + c) // 4
    if legendre(p, 3, b) * legendre(p, q, b) != -1:
        raise ValueError("BRANCH_JACOBI")
    fs = factor(T, b)
    image, best = image_pairs(T, c, q, b)
    s3, sq = sorted({r % 3 for r in image}), sorted({r % q for r in image})
    hit, h3, hq = c - 1 in image, 2 in s3, q - 1 in sq
    classification = ("HIT" if hit else "CRT_SYNCHRONIZATION_OBSTRUCTION" if h3 and hq else
                      "LOCAL_Q_OBSTRUCTION" if h3 else "LOCAL_3_OBSTRUCTION" if hq else "LOCAL_BOTH_OBSTRUCTION")
    canonical = strict(p, c, T, best["joint"]) if hit else None
    crt = {"mod3": {"modulus": "3", "image": list(map(str, s3)), "count": str(len(s3)), "hit": h3, "canonicalPair": best["local3"]},
           "modQ": {"modulus": str(q), "image": list(map(str, sq)), "count": str(len(sq)), "hit": hq, "canonicalPair": best["localQ"]},
           "productCount": str(len(s3) * len(sq))}
    involutions = sorted({r + 3 * ((t - r) * pow(3, -1, q) % q) for r in [1, 2] for t in [1, q - 1]})
    d = None if hit else generic_defect(fs, image, c, q, b)
    provenance = {"recordId": record, "p": str(p), "parentH": str(parent_h), "q": str(q), "valuation": str(valuation),
                  "parentT": str(parent_t), "parentFactors": [[str(r), str(e)] for r, e in parent_fs],
                  "sourceResidue": str(q % parent_h), "legendre": "-1"}
    row = {"id": record, "provenance": provenance, "p": str(p), "q": str(q), "c": str(c), "T": str(T),
           "factors": [[str(r), str(e)] for r, e in fs], "image": list(map(str, image)), "count": str(len(image)),
           "jacobi": "-1", "hit": hit, "canonical": canonical, "crt": crt, "classification": classification,
           "involutions": [{"residue": str(r), "mod3": str(r % 3), "modQ": str(r % q)} for r in involutions], "defect": d,
           "imageDigest": digest(list(map(str, image))), "crtDigest": digest(crt), "defectDigest": None if d is None else digest(d),
           "witnessDigest": None if canonical is None else digest(canonical)}
    row["rowDigest"] = digest(row)
    if (hit != (best["joint"] is not None) or h3 != (best["local3"] is not None) or hq != (best["localQ"] is not None)
            or d is not None and not all(d["conditions"].values())):
        raise Investigation(row)
    return row


def summary(rows, complete):
    counts = {key: str(sum(r["classification"] == key for r in rows)) for key in CLASSIFICATIONS}
    first = next((r for r in rows if not r["hit"]), None)
    return {"complete": complete, "classificationCounts": counts,
            "C4": {"status": "REFUTED" if first else "NO_REFUTATION_IN_COMPUTED_ROWS",
                   "firstRefutation": None if first is None else {"rowId": first["id"], "classification": first["classification"], "rowDigest": first["rowDigest"]}}}


def seal_packet(result):
    result["rowsDigest"] = digest(result["rows"])
    result["summary"] = summary(result["rows"], result["status"] == "COMPLETE")
    result["contentDigest"] = digest({k: result[k] for k in ["inputs", "rows", "rowsDigest", "summary"]})
    for _ in range(16):
        result["packetDigest"] = digest({k: v for k, v in result.items() if k != "packetDigest"})
        actual = str(len(compact(result).encode()))
        if actual == result["runtime"]["outputBytes"]:
            return
        result["runtime"]["outputBytes"] = actual
    raise ValueError("OUTPUT_FIXED_POINT")


def packet(clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK):
    b, rows = Budget(clock, pair_limit, work_limit), []
    status, reason = "COMPLETE", None
    b.pending = {"phase": "ROW", "recordId": BRANCHES[0][0]}
    try:
        for branch in BRANCHES:
            b.pending = {"phase": "ROW", "recordId": branch[0]}
            b.check()
            rows.append(compute_row(branch, b))
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason = "PARTIAL", str(error)
    result = {"method": "ERDOS_STRAUS_COMPOSITE_SHIFT_CRT_V1", "status": status, "inputs": INPUTS, "limits": LIMITS,
              "rows": rows, "pending": dict(b.pending) if reason else None, "reason": reason, "scope": SCOPE,
              "runtime": {"pairChecks": str(b.pairs), "workSteps": str(b.work), "elapsedMs": "0", "outputBytes": "0"}}
    def seal():
        result["runtime"]["elapsedMs"] = str(round((clock() - b.start) * 1000))
        seal_packet(result)
    seal()
    if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
        full = list(rows)
        result.update(status="PARTIAL", reason="OUTPUT_LIMIT")
        low, high = 0, len(full)
        while low < high:
            mid = (low + high + 1) // 2
            result.update(rows=full[:mid], pending={"phase": "ROW", "recordId": BRANCHES[mid][0]} if mid < 11 else {"phase": "FINALIZE"})
            seal()
            if int(result["runtime"]["outputBytes"]) <= MAX_OUTPUT:
                low = mid
            else:
                high = mid - 1
        result.update(rows=full[:low], pending={"phase": "ROW", "recordId": BRANCHES[low][0]} if low < 11 else {"phase": "FINALIZE"})
        seal()
        if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
            raise ValueError("OUTPUT_HEAD_LIMIT")
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
        seal()
    encoded = compact(result)
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
        seal()
        encoded = compact(result)
    if len(encoded.encode()) > MAX_OUTPUT:
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
        if result["status"] == "COMPLETE" and elapsed >= MAX_SECONDS * 1000:
            result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
            result["runtime"]["elapsedMs"] = str(elapsed)
            seal_packet(result)
            payload = compact(result)
        if len(payload.encode()) > MAX_OUTPUT:
            raise ValueError("OUTPUT_STDOUT_LIMIT")
        print(payload, end="")
    except Investigation as error:
        payload = compact({"method": "COMPOSITE_SHIFT_INVESTIGATION_V1", "status": "INVESTIGATION", "reason": str(error), "row": error.row,
                           "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"})
        if len(payload.encode()) <= MAX_OUTPUT:
            print(payload, end="")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
