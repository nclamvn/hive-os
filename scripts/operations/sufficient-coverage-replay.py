"""TIP-040 independent constructive subgroup and quotient energy replay.

Stdlib only. No primary factors, allocations, signed-DP images or old outcomes.
"""
import hashlib
import json
import math
import sys
import time

TARGETS = [200023321, 200602081, 200656681, 131433121]
SHIFTS = [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107]
COMPOSITES = [("r0", 200023321, 1595931), ("r1", 200023321, 183), ("r2", 200023321, 3000351),
              ("r3", 200602081, 25075263), ("r4", 200602081, 2550027), ("r5", 200602081, 4227),
              ("r6", 200602081, 247047), ("r7", 200656681, 68127), ("r10", 131433121, 7179),
              ("r11", 131433121, 19714971), ("r13", 200656681, 206439)]
MAX_SECONDS, MAX_ROWS, MAX_STATES = 60, 71, 2000000
MAX_PAIRS, MAX_WORK, MAX_OUTPUT = 50000000, 50000000, 2097152
FIXED_ROWS = [{"id": f"P{i}_h{m}", "p": str(p), "m": str(m), "source": "TIP037", "sourceRowId": f"{p}:{m}"}
              for i, p in enumerate(TARGETS) for m in SHIFTS]
FIXED_ROWS += [{"id": f"C_{rid}", "p": str(p), "m": str(m), "source": "TIP039", "sourceRowId": rid} for rid, p, m in COMPOSITES]
INPUTS = {"rows": FIXED_ROWS, "sourceContentDigests": {
    "TIP037": "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",
    "TIP039": "ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e"},
    "policy": "ASCENDING_SINGLE_FACTOR_CHAIN_THEN_UNORDERED_SUPPORT_ENERGY_V1"}
LIMITS = {"seconds": 60, "maxRows": 71, "maxStateInsertions": 2000000, "maxWorkSteps": 50000000, "maxOutputBytes": 2097152}
SCOPE = "FIXED_71_EXPOSED_ROWS_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM"


def compact(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(compact(value).encode()).hexdigest()


class Stop(Exception):
    pass


class Investigation(Exception):
    def __init__(self, row):
        self.row = row
        super().__init__("COVERAGE_ARITHMETIC_CONTRADICTION")


class Budget:
    def __init__(self, clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK, state_limit=MAX_STATES):
        self.clock, self.start = clock, clock()
        self.pair_limit, self.work_limit, self.state_limit = pair_limit, work_limit, state_limit
        self.pairs, self.work, self.states, self.pending = 0, 0, 0, None

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
            raise Stop("WORK_LIMIT")
        self.work += 1

    def insert(self):
        self.check()
        if self.states >= self.state_limit:
            raise Stop("STATE_LIMIT")
        self.states += 1


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


def power(r, e, m, b):
    v = 1
    while e:
        b.step()
        if e % 2:
            v = v * r % m
        r = r * r % m
        e //= 2
    return v


def entries(K):
    return [{"residue": str(r), "exponents": list(map(str, K[r]))} for r in sorted(K)]


def relative_order(r, K, m, M, order_factors, b):
    d = M
    for q, _ in order_factors:
        while d % q == 0 and power(r, d // q, m, b) in K:
            d //= q
    return d


def covered_chain(fs, m, M, b):
    order_factors = factor(M, b)
    K, stages, consumed = {1: [0] * len(fs)}, [], []
    b.insert()
    unused = list(range(len(fs)))
    while m - 1 not in K:
        choice = None
        for i in unused:
            r, e = fs[i]
            d = relative_order(r % m, K, m, M, order_factors, b)
            if d <= 2 * e + 1:
                choice = (i, r, e, d)
                break
        if choice is None:
            break
        i, r, e, d = choice
        prior = entries(K)
        new = {}
        for t in range(-e, -e + d):
            multiplier = power(pow(r % m, -1, m) if t < 0 else r % m, abs(t), m, b)
            for k in sorted(K):
                b.step()
                residue = multiplier * k % m
                if residue in new:
                    raise ValueError("COSET_COLLISION")
                vector = list(K[k])
                vector[i] = t
                b.insert()
                new[residue] = vector
        if len(new) != d * len(K):
            raise ValueError("COVERED_CARDINALITY")
        K = new
        stage = {"factorIndex": str(i), "prime": str(r), "exponent": str(e), "relativeOrder": str(d),
                 "previousCoveredDigest": digest(prior), "covered": entries(K)}
        stage["stageDigest"] = digest(stage)
        stages.append(stage)
        consumed.append(i)
        unused.remove(i)
    return {"stages": stages, "consumed": list(map(str, consumed)), "unused": list(map(str, unused)), "covered": entries(K)}, K, unused


def coset(r, K, m, b):
    least = m
    for k in K:
        b.step()
        least = min(least, r * k % m)
    return least


def vector_of_pair(u, v, fs, indices):
    vector = [0] * len(fs)
    for i in indices:
        q, _ = fs[i]
        while u % q == 0:
            u //= q
            vector[i] += 1
        while v % q == 0:
            v //= q
            vector[i] -= 1
    if u != 1 or v != 1:
        raise ValueError("HALF_VECTOR_DOMAIN")
    return vector


def half_histogram(fs, indices, K, m, b):
    T = math.prod(fs[i][0]**fs[i][1] for i in indices)
    ds, frequencies = divisors(T, b), {}
    for u in ds:
        for v in ds:
            b.pair()
            if T % (u * v) or math.gcd(u, v) != 1:
                continue
            residue = u * pow(v, -1, m) % m
            key = coset(residue, K, m, b)
            if key not in frequencies:
                b.insert()
                frequencies[key] = {"mu": 0, "pair": (u, v), "residue": residue,
                                    "exponents": vector_of_pair(u, v, fs, indices)}
            f = frequencies[key]
            f["mu"] += 1
            if (u, v) < f["pair"]:
                f.update(pair=(u, v), residue=residue, exponents=vector_of_pair(u, v, fs, indices))
    N = math.prod(2 * fs[i][1] + 1 for i in indices)
    if sum(f["mu"] for f in frequencies.values()) != N:
        raise ValueError("HALF_MULTIPLICITY")
    E = sum(f["mu"]**2 for f in frequencies.values())
    L = (N * N + E - 1) // E
    return {"factorIndices": list(map(str, indices)), "N": str(N), "E": str(E), "L": str(L),
            "frequencies": [{"coset": str(key), "mu": str(f["mu"]), "u": str(f["pair"][0]), "v": str(f["pair"][1]),
                             "residue": str(f["residue"]), "exponents": list(map(str, f["exponents"]))} for key, f in sorted(frequencies.items())]}


def normalize_witness(p, m, T, fs, vector):
    u = math.prod(q**max(0, t) for (q, _), t in zip(fs, vector))
    v = math.prod(q**max(0, -t) for (q, _), t in zip(fs, vector))
    orientation = "AS_CONSTRUCTED"
    if u > v:
        vector, u, v, orientation = [-t for t in vector], v, u, "INVERTED"
    if not (len(vector) == len(fs) and all(abs(t) <= e for (_, e), t in zip(fs, vector))
            and u < v and math.gcd(u, v) == 1 and T % (u * v) == 0 and (u + v) % m == 0):
        raise ValueError("CONSTRUCTIVE_VECTOR")
    k, A = T // (u * v), (u + v) // m
    x, y, z = sorted([T, A * p * u * k, A * p * v * k])
    if not (0 < x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z) and sum(d % p == 0 for d in [x, y, z]) == 2):
        raise ValueError("STRICT_TYPE_II")
    witness = dict(zip(["u", "v", "k", "A", "x", "y", "z"], map(str, [u, v, k, A, x, y, z])))
    return list(map(str, vector)), orientation, witness


def coverage(fs, p, m, M, T, b):
    chain, K, unused = covered_chain(fs, m, M, b)
    total = 2**(len(unused) - 1) - 1 if len(unused) >= 2 else 0
    attempts, certificate, status = [], None, "NOT_CERTIFIED"
    if m - 1 in K:
        vector, orientation, witness = normalize_witness(p, m, T, fs, K[m - 1])
        certificate = {"kind": "CHAIN", "exponents": vector, "orientation": orientation, "witness": witness}
        status = "CHAIN_CERTIFIED"
    elif len(unused) >= 2:
        Q = M // len(K)
        for mask in range(1, 2**len(unused) - 1):
            if not mask & 1:
                continue
            b.check()
            ia, ib = [unused[j] for j in range(len(unused)) if mask & (1 << j)], [unused[j] for j in range(len(unused)) if not mask & (1 << j)]
            A, B = half_histogram(fs, ia, K, m, b), half_histogram(fs, ib, K, m, b)
            sufficient = int(A["L"]) + int(B["L"]) > Q
            attempt = {"mask": str(mask), "A": A, "B": B, "quotientOrder": str(Q), "sufficient": sufficient}
            attempt["attemptDigest"] = digest(attempt)
            attempts.append(attempt)
            if not sufficient:
                continue
            lookup = {int(f["coset"]): f for f in B["frequencies"]}
            match = None
            for a in A["frequencies"]:
                cb = coset((m - 1) * pow(int(a["coset"]), -1, m) % m, K, m, b)
                if cb not in lookup:
                    continue
                other = lookup[cb]
                lift = (m - 1) * pow(int(a["residue"]) * int(other["residue"]) % m, -1, m) % m
                if lift not in K:
                    raise ValueError("QUOTIENT_LIFT")
                va, vb = list(map(int, a["exponents"])), list(map(int, other["exponents"]))
                combined = [x + y + z for x, y, z in zip(va, vb, K[lift])]
                vector, orientation, witness = normalize_witness(p, m, T, fs, combined)
                match = {"cosetA": a["coset"], "cosetB": str(cb), "exponentsA": a["exponents"], "exponentsB": other["exponents"],
                         "liftResidue": str(lift), "liftExponents": list(map(str, K[lift]))}
                certificate = {"kind": "ENERGY", "partitionMask": str(mask), "match": match,
                               "exponents": vector, "orientation": orientation, "witness": witness}
                break
            if match is None:
                raise ValueError("SUFFICIENT_WITHOUT_MATCH")
            status = "ENERGY_CERTIFIED"
            break
    return {"chain": chain, "attempts": attempts, "allocation": {"totalPartitions": str(total), "evaluatedPartitions": str(len(attempts)),
            "notEvaluatedPartitions": str(total - len(attempts))}, "status": status, "certificate": certificate}


def compute_row(input_row, b):
    p, m = int(input_row["p"]), int(input_row["m"])
    if not (prime(p, b) and p % 840 == 1 and p > m and (p + m) % 4 == 0 and math.gcd((p + m) // 4, m) == 1):
        raise ValueError("ROOT_DOMAIN")
    if input_row["source"] == "TIP037":
        if m not in SHIFTS or not prime(m, b) or m % 4 != 3:
            raise ValueError("PRIME_SHIFT_DOMAIN")
        M = m - 1
    else:
        q = m // 3
        if m % 3 or not prime(q, b) or q % 4 != 1:
            raise ValueError("COMPOSITE_SHIFT_DOMAIN")
        M = 2 * (q - 1)
    T = (p + m) // 4
    fs = factor(T, b)
    result = coverage(fs, p, m, M, T, b)
    row = {"id": input_row["id"], "p": str(p), "m": str(m), "T": str(T), "groupOrder": str(M),
           "factors": [[str(q), str(e)] for q, e in fs], **result}
    row["rowDigest"] = digest(row)
    if not assert_candidate(row):
        raise Investigation(row)
    return row


def assert_candidate(row):
    if row["status"] == "CHAIN_CERTIFIED":
        return row["certificate"] is not None and row["certificate"]["kind"] == "CHAIN" and not row["attempts"]
    if row["status"] == "ENERGY_CERTIFIED":
        return row["certificate"] is not None and row["certificate"]["kind"] == "ENERGY" and row["attempts"][-1]["sufficient"]
    return row["certificate"] is None and not any(a["sufficient"] for a in row["attempts"])


def summary(rows, complete):
    return {"complete": complete, "counts": {key: str(sum(r["status"] == key for r in rows))
            for key in ["CHAIN_CERTIFIED", "ENERGY_CERTIFIED", "NOT_CERTIFIED"]}}


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


def packet(clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK, state_limit=MAX_STATES):
    b, rows = Budget(clock, pair_limit, work_limit, state_limit), []
    status, reason = "COMPLETE", None
    b.pending = {"phase": "ROW", "id": FIXED_ROWS[0]["id"]}
    try:
        for input_row in FIXED_ROWS:
            b.pending = {"phase": "ROW", "id": input_row["id"]}
            b.check()
            rows.append(compute_row(input_row, b))
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason = "PARTIAL", str(error)
    result = {"method": "ERDOS_STRAUS_SUFFICIENT_COVERAGE_V1", "status": status, "inputs": INPUTS, "limits": LIMITS,
              "rows": rows, "pending": dict(b.pending) if reason else None, "reason": reason, "scope": SCOPE,
              "runtime": {"pairChecks": str(b.pairs), "stateInsertions": str(b.states), "workSteps": str(b.work), "elapsedMs": "0", "outputBytes": "0"}}
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
            result.update(rows=full[:mid], pending={"phase": "ROW", "id": FIXED_ROWS[mid]["id"]} if mid < len(FIXED_ROWS) else {"phase": "FINALIZE"})
            seal()
            if int(result["runtime"]["outputBytes"]) <= MAX_OUTPUT:
                low = mid
            else:
                high = mid - 1
        result.update(rows=full[:low], pending={"phase": "ROW", "id": FIXED_ROWS[low]["id"]} if low < len(FIXED_ROWS) else {"phase": "FINALIZE"})
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
        payload = compact({"method": "SUFFICIENT_COVERAGE_INVESTIGATION_V1", "status": "INVESTIGATION", "reason": str(error), "row": error.row,
                           "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"})
        if len(payload.encode()) <= MAX_OUTPUT:
            print(payload, end="")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
