"""TIP-041 independent all-subgroup block and quotient energy replay.

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
NEW_TARGETS = [199000201, 199002721, 199003561, 199006921, 199014481, 199031281, 199035481, 199039681]
MAX_SECONDS, MAX_ROWS, MAX_STATES = 60, 191, 2000000
MAX_GROUP, MAX_SUBGROUPS = 53, 4096
MAX_PAIRS, MAX_WORK, MAX_OUTPUT = 50000000, 50000000, 8388608
FIXED_ROWS = [{"id": f"P{i}_h{m}", "p": str(p), "m": str(m), "source": "TIP037", "sourceRowId": f"{p}:{m}", "cohort": "EXPOSED_71"}
              for i, p in enumerate(TARGETS) for m in SHIFTS]
FIXED_ROWS += [{"id": f"C_{rid}", "p": str(p), "m": str(m), "source": "TIP039", "sourceRowId": rid, "cohort": "EXPOSED_71"} for rid, p, m in COMPOSITES]
FIXED_ROWS += [{"id": f"N{i}_h{m}", "p": str(p), "m": str(m), "source": "TIP041", "sourceRowId": f"{p}:{m}", "cohort": "PRIMALITY_ONLY_120"}
               for i, p in enumerate(NEW_TARGETS) for m in SHIFTS]
INPUTS = {"rows": FIXED_ROWS, "sourceContentDigests": {
    "TIP037": "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",
    "TIP039": "ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e",
    "TIP040": "48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72"},
    "newCohort": {"roots": list(map(str, NEW_TARGETS)), "shifts": list(map(str, SHIFTS)),
                  "selection": "FIRST_8_ASCENDING_PRIMES_P1MOD840_IN_199000000_TO_199100000_PRIMALITY_ONLY",
                  "identity": "0dce735540a95a5087c5d624b8f85faab6e20a009b3071bfdc4ba4b126f9806a"},
    "policy": "ASCENDING_INDIVIDUAL_THEN_CARDINALITY_MASK_BLOCK_THEN_ENERGY_V1"}
LIMITS = {"seconds": 60, "maxRows": 191, "maxStateInsertions": 2000000, "maxWorkSteps": 50000000, "maxOutputBytes": 8388608, "maxSmallGroupElements": 53, "maxSubgroupsPerAttempt": 4096}
SCOPE = "FIXED_191_ROWS_ALL_SUBGROUP_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM"


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
        if b:
            b.step()
        if n % d == 0:
            return False
    return True


def factor(n, b):
    fs, rest, d = [], n, 2
    while d * d <= rest:
        b.step()
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
        b.step()
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


def generated_small_group(generators, K, m, bound, b):
    # Canonical discovery framing is shared protocol, not primary outcomes.
    discovered, frontier = [1], {1}
    seen = {1}
    while frontier:
        current = min(frontier)
        frontier.remove(current)
        for generator in generators:
            b.step()
            value = coset(current * generator % m, K, m, b)
            if value in seen:
                continue
            b.insert()
            seen.add(value)
            discovered.append(value)
            frontier.add(value)
            if len(seen) > bound:
                return {"status": "LOWER_BOUND_ONLY", "elements": list(map(str, discovered)),
                        "lowerBound": str(len(seen))}
            if len(seen) > MAX_GROUP:
                raise Stop("SMALL_GROUP_LIMIT")
    return {"status": "EXACT", "elements": list(map(str, sorted(seen))), "lowerBound": None}


def all_subgroups_by_joins(D, K, m, b):
    # Independently form each cyclic subgroup, then all subgroup joins.
    # This enumerates only the already small D, never the ambient unit group.
    def multiply(a, c):
        b.step()
        return coset(a * c % m, K, m, b)
    cyclic = set()
    for g in D:
        C, value = {1}, g
        while value != 1:
            b.step()
            if value not in D or value in C:
                raise ValueError("CYCLIC_CLOSURE")
            C.add(value)
            value = multiply(value, g)
        cyclic.add(tuple(sorted(C)))
    lattice, queue = {(1,)}, [(1,)]
    for H in queue:
        for C in sorted(cyclic, key=lambda x: (len(x), x)):
            # For abelian groups H*C is the exact subgroup join.
            join = set()
            for h in H:
                for c in C:
                    b.step()
                    join.add(multiply(h, c))
            key = tuple(sorted(join))
            if key not in lattice:
                if len(lattice) >= MAX_SUBGROUPS:
                    raise Stop("SUBGROUP_LIMIT")
                b.insert()
                lattice.add(key)
                queue.append(key)
    expected = tuple(sorted(D))
    if expected not in lattice:
        raise ValueError("LATTICE_TOP_MISSING")
    return sorted((H for H in lattice if H != expected), key=lambda H: (len(H), H))


def block_attempt(fs, support, mask, unused, K, m, M, order_factors, b):
    W = sum(fs[i][1] for i in support)
    bound = 2 * W + 1
    result = {"previousCoveredDigest": digest(entries(K)), "unused": list(map(str, unused)),
              "support": list(map(str, support)), "mask": str(mask), "W": str(W), "bound": str(bound),
              "exactAtomOrders": [], "closure": {"status": "NOT_BUILT", "elements": [], "lowerBound": None},
              "subgroups": [], "decision": "ATOM_ORDER_TOO_LARGE", "construction": None}
    for i in support:
        d = relative_order(fs[i][0] % m, K, m, M, order_factors, b)
        result["exactAtomOrders"].append({"factorIndex": str(i), "order": str(d)})
        if d > bound:
            result["attemptDigest"] = digest(result)
            return result
    generators = [fs[i][0] % m for i in support]
    closure = generated_small_group(generators, K, m, bound, b)
    result["closure"] = closure
    if closure["status"] != "EXACT":
        result["decision"] = "GROUP_TOO_LARGE"
        result["attemptDigest"] = digest(result)
        return result
    D = list(map(int, closure["elements"]))
    if len(D) > MAX_GROUP:
        raise Stop("SMALL_GROUP_LIMIT")
    for H in all_subgroups_by_joins(D, K, m, b):
        orders, sizes = [], []
        for i in support:
            generator = fs[i][0] % m
            value = 1
            for d in range(1, len(D) + 1):
                b.step()
                value = coset(value * generator % m, K, m, b)
                if value in H:
                    break
            else:
                raise ValueError("SUBGROUP_ORDER")
            orders.append(str(d))
            sizes.append(str(min(d, 2 * fs[i][1] + 1)))
        lower = 1 + sum(int(size) - 1 for size in sizes)
        index = len(D) // len(H)
        if len(D) % len(H):
            raise ValueError("SUBGROUP_INDEX")
        result["subgroups"].append({"members": list(map(str, H)), "index": str(index),
                                   "orders": orders, "atomSizes": sizes, "lowerBound": str(lower),
                                   "passed": lower >= index})
    passed = all(H["passed"] for H in result["subgroups"])
    result["decision"] = "PASS" if passed else "INEQUALITY_FAILED"
    if passed:
        result["construction"] = half_histogram(fs, support, K, m, b)
        if [f["coset"] for f in result["construction"]["frequencies"]] != closure["elements"]:
            raise ValueError("BLOCK_PREDICTION_CONTRADICTION")
    result["attemptDigest"] = digest(result)
    return result


def covered_chain(fs, m, M, b):
    order_factors = factor(M, b)
    K, stages, consumed, block_attempts = {1: [0] * len(fs)}, [], [], []
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
        prior = entries(K)
        if choice is not None:
            i, r, e, d = choice
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
            stage = {"kind": "INDIVIDUAL", "factorIndex": str(i), "prime": str(r), "exponent": str(e), "relativeOrder": str(d),
                     "previousCoveredDigest": digest(prior), "covered": entries(K)}
            stage["stageDigest"] = digest(stage)
            stages.append(stage)
            consumed.append(i)
            unused.remove(i)
            continue
        selected = None
        for cardinality in range(2, len(unused) + 1):
            for mask in range(1, 2**len(unused)):
                if mask.bit_count() != cardinality:
                    continue
                b.check()
                support = [unused[j] for j in range(len(unused)) if mask & (1 << j)]
                attempt = block_attempt(fs, support, mask, unused, K, m, M, order_factors, b)
                block_attempts.append(attempt)
                if attempt["decision"] == "PASS":
                    selected = (support, attempt)
                    break
            if selected:
                break
        if selected is None:
            break
        support, attempt = selected
        new = {}
        for f in attempt["construction"]["frequencies"]:
            for k in sorted(K):
                b.step()
                residue = int(f["residue"]) * k % m
                if residue in new:
                    raise ValueError("BLOCK_LIFT_COLLISION")
                vector = [a + c for a, c in zip(map(int, f["exponents"]), K[k])]
                if any(abs(t) > e for t, (_, e) in zip(vector, fs)):
                    raise ValueError("BLOCK_SUPPORT_REUSE")
                b.insert()
                new[residue] = vector
        if len(new) != len(K) * len(attempt["closure"]["elements"]):
            raise ValueError("BLOCK_LIFT_CARDINALITY")
        K = new
        stage = {"kind": "BLOCK", "attemptIndex": str(len(block_attempts) - 1),
                 "previousCoveredDigest": digest(prior), "covered": entries(K)}
        stage["stageDigest"] = digest(stage)
        stages.append(stage)
        consumed.extend(support)
        unused = [i for i in unused if i not in support]
    return {"stages": stages, "blockAttempts": block_attempts, "hasBlock": any(s["kind"] == "BLOCK" for s in stages),
            "consumed": list(map(str, consumed)), "unused": list(map(str, unused)), "covered": entries(K)}, K, unused

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
        status = "BLOCK_CHAIN_CERTIFIED" if chain["hasBlock"] else "SINGLE_CHAIN_CERTIFIED"
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
    if input_row["source"] in ["TIP037", "TIP041"]:
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
    if row["status"] in ["SINGLE_CHAIN_CERTIFIED", "BLOCK_CHAIN_CERTIFIED"]:
        return row["certificate"] is not None and row["certificate"]["kind"] == "CHAIN" and not row["attempts"]
    if row["status"] == "ENERGY_CERTIFIED":
        return row["certificate"] is not None and row["certificate"]["kind"] == "ENERGY" and row["attempts"][-1]["sufficient"]
    return row["certificate"] is None and not any(a["sufficient"] for a in row["attempts"])


def summary(rows, complete):
    keys = ["SINGLE_CHAIN_CERTIFIED", "BLOCK_CHAIN_CERTIFIED", "ENERGY_CERTIFIED", "NOT_CERTIFIED"]
    counts = lambda rs: {key: str(sum(r["status"] == key for r in rs)) for key in keys}
    cohorts = {cohort: counts([row for row in rows if next(i for i in FIXED_ROWS if i["id"] == row["id"])["cohort"] == cohort])
               for cohort in ["EXPOSED_71", "PRIMALITY_ONLY_120"]}
    return {"complete": complete, "counts": counts(rows), "cohorts": cohorts}


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


def packet(clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK, state_limit=MAX_STATES, row_limit=MAX_ROWS):
    if not isinstance(row_limit, int) or not 1 <= row_limit <= MAX_ROWS:
        raise ValueError("ROW_LIMIT_DOMAIN")
    b, rows = Budget(clock, pair_limit, work_limit, state_limit), []
    status, reason = "COMPLETE", None
    b.pending = {"phase": "ROW", "id": FIXED_ROWS[0]["id"]}
    try:
        for input_row in FIXED_ROWS:
            b.pending = {"phase": "ROW", "id": input_row["id"]}
            b.check()
            if len(rows) >= row_limit:
                raise Stop("ROW_LIMIT")
            rows.append(compute_row(input_row, b))
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason = "PARTIAL", str(error)
    result = {"method": "ERDOS_STRAUS_BLOCK_COVERAGE_V1", "status": status, "inputs": INPUTS, "limits": {**LIMITS, "maxRows": row_limit},
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
        payload = compact({"method": "BLOCK_COVERAGE_INVESTIGATION_V1", "status": "INVESTIGATION", "reason": str(error), "row": error.row,
                           "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"})
        if len(payload.encode()) <= MAX_OUTPUT:
            print(payload, end="")
        raise SystemExit(1)


def new_cohort_truth(clock=time.monotonic):
    """Separately invoked AFTER method generation. Never consumed by routing."""
    b, rows = Budget(clock), []
    inputs = [r for r in FIXED_ROWS if r["cohort"] == "PRIMALITY_ONLY_120"]
    status, reason = "COMPLETE", None
    try:
        for item in inputs:
            b.pending = {"phase": "ROW", "id": item["id"]}
            b.check()
            p, m = int(item["p"]), int(item["m"])
            T = (p + m) // 4
            if not (prime(p, b) and prime(m, b) and p % 840 == 1 and m % 4 == 3
                    and p > m and (p + m) % 4 == 0 and math.gcd(T, m) == 1):
                raise ValueError("TRUTH_ROOT_DOMAIN")
            fs, image, canonical = factor(T, b), set(), None
            ds = divisors(T, b)
            for u in ds:
                for v in ds:
                    b.pair()
                    if T % (u * v) or math.gcd(u, v) != 1:
                        continue
                    b.step()  # Modular inverse, bounded-time primitive.
                    b.step()  # Modular product/reduction.
                    residue = u * pow(v, -1, m) % m
                    if residue not in image:
                        b.insert()
                        image.add(residue)
                    if u <= v and residue == m - 1 and (canonical is None or (u, v) < canonical):
                        canonical = (u, v)
            witness = None
            if canonical is not None:
                b.step()  # Cross-multiplied strict-identity construction/check.
                _, _, witness = normalize_witness(p, m, T, fs, vector_of_pair(*canonical, fs, list(range(len(fs)))))
            row = {"id": item["id"], "p": str(p), "m": str(m), "T": str(T),
                   "factors": [[str(q), str(e)] for q, e in fs], "image": list(map(str, sorted(image))),
                   "imageDigest": digest(list(map(str, sorted(image)))), "hit": canonical is not None,
                   "canonical": witness}
            row["rowDigest"] = digest(row)
            rows.append(row)
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason = "PARTIAL", str(error)
    result = {"method": "INDEPENDENT_POST_GENERATION_NEW_120_TRUTH_V1", "status": status,
              "inputs": inputs, "rows": rows, "pending": dict(b.pending) if reason else None, "reason": reason,
              "scope": "SEPARATE_EXHAUSTIVE_DIVISOR_TRUTH_NOT_METHOD_ELIGIBILITY_OR_MODEL_BENCHMARK",
              "limits": {"seconds": 60, "maxPairChecks": MAX_PAIRS, "maxWorkSteps": MAX_WORK, "maxOutputBytes": MAX_OUTPUT},
              "runtime": {"pairChecks": str(b.pairs), "workSteps": str(b.work), "stateInsertions": str(b.states), "elapsedMs": "0", "outputBytes": "0"}}
    def seal():
        result["rowsDigest"] = digest(result["rows"])
        result["contentDigest"] = digest({k: result[k] for k in ["inputs", "rows", "rowsDigest", "scope"]})
        result["runtime"]["elapsedMs"] = str(round((clock() - b.start) * 1000))
        for _ in range(16):
            result["packetDigest"] = digest({k: v for k, v in result.items() if k != "packetDigest"})
            actual = str(len(compact(result).encode()))
            if actual == result["runtime"]["outputBytes"]:
                return
            result["runtime"]["outputBytes"] = actual
        raise ValueError("TRUTH_OUTPUT_FIXED_POINT")
    seal()
    if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
        result.update(status="PARTIAL", reason="OUTPUT_LIMIT")
        while result["rows"] and int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
            result["rows"].pop()
            result["pending"] = {"phase": "ROW", "id": inputs[len(result["rows"])]["id"]}
            seal()
        if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
            raise ValueError("TRUTH_OUTPUT_HEAD_LIMIT")
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
        seal()
    payload = compact(result)
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
        seal()
        payload = compact(result)
    if len(payload.encode()) > MAX_OUTPUT:
        raise ValueError("TRUTH_FINAL_OUTPUT_LIMIT")
    return result


if __name__ == "__main__":
    main()
