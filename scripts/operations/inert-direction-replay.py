"""TIP-043 independent stdlib replay. No previous producers or outcomes imported.

The method phase enumerates only split-support coprime divisor pairs. Full
shift-image truth is a separately requested retrospective phase, not routing.
Local resource counters are collector diagnostics, not CPU attestation.
"""

import hashlib
import json
import math
import sys
import time


ROOTS = [200023321, 200602081, 200656681, 131433121, 199000201,
         199002721, 199003561, 199006921, 199014481, 199031281,
         199035481, 199039681]
SHIFTS = [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107]
LIMITS = {"seconds": 60, "maxRows": 180, "maxStateInsertions": 2000000,
          "maxWork": 50000000, "maxOutputBytes": 8388608}
DECISIONS = ["NO_INERT_LOCAL_MISS", "COHERENT_SHORT_LOCAL_MISS",
             "COHERENT_PAID_SPLIT_HIT", "COHERENT_UNPAID_UNDETERMINED",
             "INCOHERENT_UNDETERMINED"]
METHOD = "ERDOS_STRAUS_ROOT_COUPLED_INERT_DIRECTION_V1"
POLICY = "ASCENDING_INERT_GREEDY_WITH_PAID_SPLIT_CORRECTION"
SCOPE = ("Exposed development roots and prime shifts only; inverse-direction diagnostics concern "
         "this coprime-divisor Type II shift, not Erdős–Straus impossibility, Type I, all shifts, "
         "novelty or agent authority. UNDETERMINED is not MISS; generated split subgroup is not "
         "paid coverage. Asymptotic inert supply has no finite cutoff or hit guarantee.")
INPUTS = {"roots": [str(p) for p in ROOTS], "shifts": [str(h) for h in SHIFTS]}


def validated_limits(overrides=None):
    result = dict(LIMITS)
    if overrides is None:
        return result
    if not isinstance(overrides, dict) or not set(overrides).issubset(LIMITS):
        raise ValueError("LIMIT_KEYS")
    for key, value in overrides.items():
        if (isinstance(value, bool) or not isinstance(value, (int, float))
                or not math.isfinite(value) or value > LIMITS[key]
                or value < (4096 if key == "maxOutputBytes" else 0.000000001)
                or (key != "seconds" and int(value) != value)):
            raise ValueError("INVALID_TIGHTER_LIMIT")
        result[key] = value if key == "seconds" else int(value)
    return result


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


class Stop(Exception):
    def __init__(self, reason, pending):
        super().__init__(reason)
        self.reason = reason
        self.pending = dict(pending)


class Investigation(Exception):
    def __init__(self, row):
        super().__init__("POST_ROW_CONTRADICTION")
        self.row = row


class Budget:
    def __init__(self, limits=None, clock=time.monotonic):
        self.limits = validated_limits(limits)
        self.clock = clock
        self.start = clock()
        self.states = 0
        self.work = 0
        self.pending = {"phase": "ROW", "id": "P0_h3"}

    def elapsed(self):
        return max(0, int((self.clock() - self.start) * 1000))

    def check(self):
        if (self.clock() - self.start) >= self.limits["seconds"]:
            raise Stop("TIME_LIMIT", self.pending)

    def step(self, count=1):
        if isinstance(count, bool) or not isinstance(count, int) or count < 1:
            raise ValueError("INVALID_WORK_COUNT")
        if self.work + count > self.limits["maxWork"]:
            raise Stop("WORK_LIMIT", self.pending)
        self.work += count
        self.check()

    def state(self, count=1):
        if isinstance(count, bool) or not isinstance(count, int) or count < 1:
            raise ValueError("INVALID_STATE_COUNT")
        if self.states + count > self.limits["maxStateInsertions"]:
            raise Stop("STATE_LIMIT", self.pending)
        self.states += count
        self.check()


def factor(n, b):
    if not isinstance(n, int) or n < 1:
        raise ValueError("FACTOR_DOMAIN")
    answer = []
    q = 2
    while q * q <= n:
        b.step()
        e = 0
        while n % q == 0:
            b.step()
            n //= q
            e += 1
        if e:
            answer.append((q, e))
        q = 3 if q == 2 else q + 2
    if n > 1:
        answer.append((n, 1))
    return answer


def prime(n, b):
    return n >= 2 and factor(n, b) == [(n, 1)]


def modular_power(a, e, m, b):
    answer = 1
    a %= m
    while e:
        b.step()
        if e & 1:
            answer = answer * a % m
        a = a * a % m
        e //= 2
    return answer


def character(a, p, b):
    r = modular_power(a, (p - 1) // 2, p, b)
    if r not in (1, p - 1):
        raise ValueError("CHARACTER_DOMAIN")
    return 1 if r == 1 else -1


def generated_subgroup(residues, h, b):
    # Own closure, independent of TS signed-box and any retained image.
    found = {1}
    frontier = [1]
    b.state()
    while frontier:
        x = frontier.pop(0)
        for r in residues:
            b.step()
            y = x * r % h
            if y not in found:
                found.add(y)
                frontier.append(y)
                b.state()
    return sorted(found)


def relative_order(r, L, h, b):
    # Direct repeated quotient membership, not TS order-reduction output.
    x = 1
    for d in range(1, h):
        b.step()
        x = x * r % h
        if x in L:
            return d
    raise ValueError("NO_QUOTIENT_ORDER")


def divisors(fs, b):
    values = [(1, [0] * len(fs))]
    for i, (q, e) in enumerate(fs):
        out = []
        power = 1
        for t in range(e + 1):
            for n, vector in values:
                b.step()
                v = list(vector)
                v[i] = t
                out.append((n * power, v))
                b.state()
            power *= q
        values = out
    return sorted(values)


def split_pairs(fs, split_indices, h, b):
    """Positive coprime divisor pairs of the split part only, ordered (u,v).

    Shared-prime assignments are rejected; unused mass remains available for k.
    Each residue keeps the numeric-lex smallest legal ordered pair.
    """
    split_fs = [fs[i] for i in split_indices]
    ds = divisors(split_fs, b)
    found = {}
    split_product = 1
    for q, e in split_fs:
        b.step()
        split_product *= q ** e
    for u, uv in ds:
        for v, vv in ds:
            b.step()
            if math.gcd(u, v) != 1 or split_product % (u * v):
                continue
            r = u * pow(v, -1, h) % h
            b.step()
            if r not in found or (u, v) < found[r][0]:
                vector = [0] * len(fs)
                for j, i in enumerate(split_indices):
                    b.step()
                    vector[i] = uv[j] - vv[j]
                if r not in found:
                    b.state()
                found[r] = ((u, v), vector)
    return found


def strict_witness(p, h, T, fs, vector, b):
    if len(vector) != len(fs) or any(isinstance(z, bool) or not isinstance(z, int) for z in vector):
        raise ValueError("CONSTRUCTION_VECTOR_DOMAIN")
    u, v = 1, 1
    for (q, e), exponent in zip(fs, vector):
        b.step()
        if abs(exponent) > e:
            raise ValueError("VALUATION_REUSE")
        if exponent > 0:
            u *= q ** exponent
        elif exponent < 0:
            v *= q ** (-exponent)
    orientation = "UNCHANGED"
    if u > v:
        u, v = v, u
        inverted = []
        for z in vector:
            b.step()
            inverted.append(-z)
        vector = inverted
        orientation = "WHOLE_INVERTED"
    b.step(8)
    if math.gcd(u, v) != 1 or T % (u * v) or (u + v) % h:
        raise ValueError("ILLEGAL_CONSTRUCTION")
    k = T // (u * v)
    A = (u + v) // h
    x, y, z = sorted((T, A * p * u * k, A * p * v * k))
    if not (0 < x < y < z and sum(d % p == 0 for d in (x, y, z)) == 2
            and 4 * x * y * z == p * (x * y + x * z + y * z)):
        raise ValueError("STRICT_IDENTITY_FAILED")
    return vector, orientation, {"u": str(u), "v": str(v), "k": str(k),
                                 "A": str(A), "x": str(x), "y": str(y), "z": str(z)}


def analyze_group(h, fs, b):
    """Pure finite-group lemma seam, never a root/campaign admission function."""
    if (not isinstance(h, int) or isinstance(h, bool) or h > 107 or not prime(h, b)
            or h % 4 != 3 or len(fs) > 26):
        raise ValueError("ABSTRACT_DOMAIN")
    previous, product = 1, 1
    labels, splits, inerts = [], [], []
    for i, (q, e) in enumerate(fs):
        b.step()
        if (not isinstance(q, int) or isinstance(q, bool) or not isinstance(e, int)
                or isinstance(e, bool) or q <= previous or q > 100500000
                or e < 1 or e > 26 or q % h == 0 or not prime(q, b)):
            raise ValueError("ABSTRACT_FACTOR_DOMAIN")
        previous = q
        product *= q ** e
        if product > 100500000:
            raise ValueError("ABSTRACT_PRODUCT_LIMIT")
        label = character(q, h, b)
        labels.append(label)
        (splits if label == 1 else inerts).append(i)
    L = generated_subgroup([fs[i][0] % h for i in splits], h, b)
    split_image = split_pairs(fs, splits, h, b)
    paid = len(split_image) == len(L)
    if not set(split_image).issubset(L) or len(L) % 2 != 1:
        raise ValueError("SPLIT_SUBGROUP_FAILED")
    a = fs[inerts[0]][0] % h if inerts else None
    d = relative_order(a, set(L), h, b) if a is not None else None
    directions = []
    coherent = True  # Vacuous bookkeeping; no anchor/d asserted without inert factors.
    for i in inerts:
        b.step(2)
        r = fs[i][0] % h
        plus = r * pow(a, -1, h) % h in L
        minus = r * a % h in L
        direction = 1 if plus else (-1 if minus else None)
        directions.append((i, direction))
        coherent = coherent and direction is not None
    E = 0
    for i in inerts:
        b.step()
        E += fs[i][1]
    if not inerts:
        decision = "NO_INERT_LOCAL_MISS"
    elif not coherent:
        decision = "INCOHERENT_UNDETERMINED"
    elif E < d // 2:
        decision = "COHERENT_SHORT_LOCAL_MISS"
    elif not paid:
        decision = "COHERENT_UNPAID_UNDETERMINED"
    else:
        decision = "COHERENT_PAID_SPLIT_HIT"
    raw_vector = None
    correction = None
    if decision == "COHERENT_PAID_SPLIT_HIT":
        raw_vector = [0] * len(fs)
        remaining = d // 2
        residue = 1
        for i, direction in directions:
            b.step()
            e = fs[i][1]
            allocation = max(-e, min(e, remaining))
            raw_vector[i] = direction * allocation
            remaining -= allocation
            residue = residue * pow(fs[i][0] % h, raw_vector[i], h) % h
        if remaining:
            raise ValueError("INERT_ALLOCATION_FAILED")
        correction = (h - 1) * pow(residue, -1, h) % h
        if correction not in split_image:
            raise ValueError("UNPAID_CORRECTION")
        combined = []
        for x, y in zip(raw_vector, split_image[correction][1]):
            b.step()
            combined.append(x + y)
        raw_vector = combined
    return {"labels": labels, "splitIndices": splits, "inertIndices": inerts,
            "L": L, "splitImage": split_image, "a": a, "d": d, "E": E,
            "directions": directions, "coherent": coherent, "splitPaid": paid,
            "decision": decision, "rawVector": raw_vector, "correction": correction}


def root_row(p, h, index, b):
    if (p not in ROOTS or h not in SHIFTS or p % 840 != 1 or h >= p
            or not prime(p, b) or not prime(h, b) or h % 4 != 3):
        raise ValueError("FIXED_ROOT_DOMAIN")
    T = (p + h) // 4
    if 4 * T != p + h:
        raise ValueError("NONINTEGER_T")
    fs = factor(T, b)
    group = analyze_group(h, fs, b)
    characters = []
    for (q, _), shift_label in zip(fs, group["labels"]):
        b.step()
        root_label = (1 if p % 8 in (1, 7) else -1) if q == 2 else character(p, q, b)
        if root_label != shift_label or (q in (2, 3, 5, 7) and root_label != 1):
            raise ValueError("ROOT_COUPLING_CONTRADICTION")
        characters.append({"prime": str(q), "shiftCharacter": "+1" if shift_label == 1 else "-1",
                           "rootCharacter": "+1" if root_label == 1 else "-1",
                           "kind": "SPLIT" if shift_label == 1 else "INERT"})
    anchor = None
    if group["a"] is not None:
        coset = []
        for l in group["L"]:
            b.step()
            coset.append(group["a"] * l % h)
        anchor = {"prime": str(fs[group["inertIndices"][0]][0]),
                  "residue": str(group["a"]), "coset": str(min(coset))}
        if group["d"] % 4 != 2 or modular_power(group["a"], group["d"] // 2, h, b) not in {
                (h - 1) * l % h for l in group["L"]}:
            raise ValueError("QUOTIENT_TARGET_ORDER_FAILED")
    split_image = []
    for residue, ((u, v), vector) in sorted(group["splitImage"].items()):
        b.step()
        split_image.append({"residue": str(residue), "u": str(u), "v": str(v),
                            "exponents": [str(z) for z in vector]})
    witness = None
    if group["rawVector"] is not None:
        normalized, orientation, strict = strict_witness(p, h, T, fs, group["rawVector"], b)
        witness = {"rawExponents": [str(z) for z in group["rawVector"]],
                   "exponents": [str(z) for z in normalized], "orientation": orientation,
                   "correction": str(group["correction"]), **strict}
    row = {"id": "P%d_h%d" % (index // len(SHIFTS), h), "p": str(p), "h": str(h),
           "T": str(T), "factors": [[str(q), str(e)] for q, e in fs],
           "characters": characters, "L": [str(l) for l in group["L"]],
           "splitImage": split_image, "anchor": anchor,
           "d": None if group["d"] is None else str(group["d"]), "E": str(group["E"]),
           "ambientIndex": str((h - 1) // len(group["L"])), "coherent": group["coherent"],
           "directions": [{"prime": str(fs[i][0]), "direction": None if direction is None
                           else ("+1" if direction == 1 else "-1")}
                          for i, direction in group["directions"]],
           "splitPaid": group["splitPaid"], "decision": group["decision"], "witness": witness}
    row["rowDigest"] = digest(row)
    assert_candidate(row)
    return row


def assert_candidate(row):
    # This diagnostic retains a completed, hashed offending row only. Earlier
    # arithmetic/domain ValueErrors fail closed without claiming full-row data.
    if ((row["decision"] == "COHERENT_PAID_SPLIT_HIT") != (row["witness"] is not None)
            or (row["decision"] == "COHERENT_SHORT_LOCAL_MISS"
                and (not row["coherent"] or int(row["E"]) >= int(row["d"]) // 2))
            or (row["decision"] == "NO_INERT_LOCAL_MISS" and row["anchor"] is not None)):
        raise Investigation(row)


def summary(rows):
    counts = {key: "0" for key in DECISIONS}
    for row in rows:
        key = row["decision"]
        counts[key] = str(int(counts[key]) + 1)
    return {"total": str(len(rows)), "counts": counts}


def seal(result):
    result["summary"] = summary(result["rows"])
    result["rowsDigest"] = digest(result["rows"])
    result["contentDigest"] = digest({key: result[key] for key in
                                      ("method", "inputs", "policy", "scope", "rows", "summary")})
    for _ in range(10):
        size = len(canonical(result).encode("utf-8"))
        if result["runtime"]["outputBytes"] == str(size):
            return result
        result["runtime"]["outputBytes"] = str(size)
    raise ValueError("OUTPUT_FIXED_POINT_FAILED")


def set_partial(result, reason, pending):
    result["status"] = "PARTIAL"
    result["reason"] = reason
    result["pending"] = dict(pending)


def row_pending(index):
    return {"phase": "ROW", "index": str(index), "p": str(ROOTS[index // len(SHIFTS)]),
            "h": str(SHIFTS[index % len(SHIFTS)])}


def finalize(result, b):
    """Observed checks include hashing/serialization, never hard JS/CPU preemption."""
    for _ in range(182):
        result["runtime"] = {"elapsedMs": b.elapsed(), "stateInsertions": str(b.states),
                             "work": str(b.work), "outputBytes": "0"}
        seal(result)
        if int(result["runtime"]["outputBytes"]) > b.limits["maxOutputBytes"]:
            if not result["rows"]:
                raise ValueError("OUTPUT_ENVELOPE_UNAVAILABLE")
            result["rows"].pop()
            set_partial(result, "OUTPUT_LIMIT", row_pending(len(result["rows"])))
            continue
        elapsed = b.elapsed()
        if result["status"] == "COMPLETE" and elapsed >= b.limits["seconds"] * 1000:
            set_partial(result, "TIME_LIMIT", {"phase": "FINALIZE"})
            continue
        if result["runtime"]["elapsedMs"] != elapsed:
            result["runtime"]["elapsedMs"] = elapsed
            seal(result)
            # Second actual checkpoint after resealing, including output size.
            if (result["status"] == "COMPLETE"
                    and b.elapsed() >= b.limits["seconds"] * 1000):
                set_partial(result, "TIME_LIMIT", {"phase": "FINALIZE"})
                continue
            if int(result["runtime"]["outputBytes"]) > b.limits["maxOutputBytes"]:
                continue
        return result
    raise ValueError("FINALIZATION_DID_NOT_CONVERGE")


def packet(tighter=None, clock=time.monotonic, budget_factory=Budget):
    limits = validated_limits(tighter)
    b = budget_factory(limits, clock)
    result = {"method": METHOD, "inputs": INPUTS, "policy": POLICY, "scope": SCOPE,
              "status": "COMPLETE", "reason": None, "pending": None,
              "limits": limits, "rows": [], "summary": {}, "rowsDigest": "",
              "contentDigest": "", "runtime": {}}
    try:
        for index in range(len(ROOTS) * len(SHIFTS)):
            b.pending = row_pending(index)
            b.check()
            if len(result["rows"]) >= limits["maxRows"]:
                raise Stop("ROW_LIMIT", b.pending)
            row = root_row(ROOTS[index // len(SHIFTS)], SHIFTS[index % len(SHIFTS)], index, b)
            b.check()
            result["rows"].append(row)
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as stopped:
        set_partial(result, stopped.reason, stopped.pending)
    return finalize(result, b)


def reject_nonfinite(value):
    raise ValueError("NONFINITE_JSON_" + value)


def retrospective_truth(method_packet, after_main_checkpoint=False, clock=time.monotonic,
                        budget_factory=Budget, tighter=None):
    """Separate post-generation diagnostic, never called by method routing.

    The flag is a local chronology declaration, not cryptographic approval or
    agent admission. Main opened the actual all-row agreement gate separately.
    """
    if after_main_checkpoint is not True:
        raise ValueError("MAIN_CHRONOLOGY_CHECKPOINT_REQUIRED")
    if (method_packet.get("status") != "COMPLETE" or len(method_packet.get("rows", [])) != 180
            or method_packet.get("inputs") != INPUTS or method_packet.get("policy") != POLICY
            or method_packet.get("scope") != SCOPE or method_packet.get("method") != METHOD):
        raise ValueError("COMPLETE_FIXED_METHOD_REQUIRED")
    b = budget_factory(validated_limits(tighter), clock)
    rows, pending, reason = [], None, None
    counts = {key: {"hit": "0", "miss": "0"} for key in DECISIONS}
    try:
        for index, original in enumerate(method_packet["rows"]):
            b.pending = row_pending(index)
            b.check()
            if len(rows) >= b.limits["maxRows"]:
                raise Stop("ROW_LIMIT", b.pending)
            p, h = ROOTS[index // len(SHIFTS)], SHIFTS[index % len(SHIFTS)]
            if original["p"] != str(p) or original["h"] != str(h):
                raise ValueError("TRUTH_ROOT_BINDING")
            T = (p + h) // 4
            fs = factor(T, b)  # Independently derive, not retained producer factors.
            if original["factors"] != [[str(q), str(e)] for q, e in fs]:
                raise ValueError("TRUTH_FACTOR_BINDING")
            ds = divisors(fs, b)
            image, canonical_pair = set(), None
            for u, _ in ds:
                for v, _ in ds:
                    b.step()
                    if math.gcd(u, v) != 1 or T % (u * v):
                        continue
                    b.step(2)
                    r = u * pow(v, -1, h) % h
                    if r not in image:
                        image.add(r)
                        b.state()
                    if (u + v) % h == 0 and u <= v:
                        if canonical_pair is None or (u, v) < canonical_pair:
                            canonical_pair = (u, v)
            hit = h - 1 in image
            decision = original["decision"]
            if ((decision in ("NO_INERT_LOCAL_MISS", "COHERENT_SHORT_LOCAL_MISS") and hit)
                    or (decision == "COHERENT_PAID_SPLIT_HIT" and not hit)):
                raise Investigation(original)
            witness_checked = False
            if original["witness"] is not None:
                w = original["witness"]
                u, v, k, A, x, y, z = (int(w[key]) for key in ("u", "v", "k", "A", "x", "y", "z"))
                b.step(12)
                if (u > v or math.gcd(u, v) != 1 or u * v * k != T or u + v != A * h
                        or [x, y, z] != sorted((T, A * p * u * k, A * p * v * k))
                        or not 0 < x < y < z or sum(d % p == 0 for d in (x, y, z)) != 2
                        or 4 * x * y * z != p * (x * y + x * z + y * z)):
                    raise Investigation(original)
                witness_checked = True
            count_key = "hit" if hit else "miss"
            truth_row = {"id": original["id"], "p": str(p), "h": str(h),
                         "decision": decision, "hit": hit, "image": [str(r) for r in sorted(image)],
                         "canonicalPair": None if canonical_pair is None else
                         {"u": str(canonical_pair[0]), "v": str(canonical_pair[1])},
                         "witnessChecked": witness_checked}
            b.check()
            rows.append(truth_row)
            counts[decision][count_key] = str(int(counts[decision][count_key]) + 1)
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as stopped:
        reason, pending = stopped.reason, stopped.pending
    result = {"phase": "RETROSPECTIVE_AFTER_MAIN_AGREEMENT", "status": "PARTIAL" if reason else "COMPLETE",
              "methodContentDigest": method_packet["contentDigest"], "rows": rows, "counts": counts,
              "rowsDigest": digest(rows), "reason": reason, "pending": pending,
              "limits": dict(b.limits), "runtime": {"elapsedMs": b.elapsed(),
              "stateInsertions": str(b.states), "work": str(b.work), "outputBytes": "0"}}
    for _ in range(182):
        result["rowsDigest"] = digest(result["rows"])
        for _ in range(10):
            size = len(canonical(result).encode("utf-8"))
            if result["runtime"]["outputBytes"] == str(size):
                break
            result["runtime"]["outputBytes"] = str(size)
        elapsed = b.elapsed()
        result["runtime"]["elapsedMs"] = elapsed
        if result["status"] == "COMPLETE" and elapsed >= b.limits["seconds"] * 1000:
            result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
            continue
        if len(canonical(result).encode("utf-8")) > b.limits["maxOutputBytes"]:
            if not result["rows"]:
                raise ValueError("TRUTH_OUTPUT_ENVELOPE")
            last = result["rows"].pop()
            key = "hit" if last["hit"] else "miss"
            result["counts"][last["decision"]][key] = str(int(result["counts"][last["decision"]][key]) - 1)
            result.update(status="PARTIAL", reason="OUTPUT_LIMIT", pending=row_pending(len(result["rows"])))
            continue
        # Refresh fixed-point bytes after elapsed stamp; observe the actual
        # end of serialization before any successful retrospective return.
        for _ in range(10):
            size = len(canonical(result).encode("utf-8"))
            if result["runtime"]["outputBytes"] == str(size):
                break
            result["runtime"]["outputBytes"] = str(size)
        payload = canonical(result)
        if result["status"] == "COMPLETE" and b.elapsed() >= b.limits["seconds"] * 1000:
            result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
            continue
        if len(payload.encode("utf-8")) > b.limits["maxOutputBytes"]:
            continue
        return result
    raise ValueError("TRUTH_FINALIZATION_LIMIT")


def main():
    requested = {}
    origin = time.monotonic()
    try:
        raw = sys.stdin.read(32769)
        if len(raw.encode("utf-8")) > 32768:
            raise ValueError("INPUT_BYTE_LIMIT")
        requested = json.loads(raw, parse_constant=reject_nonfinite) if raw.strip() else {}
        if not isinstance(requested, dict) or not set(requested).issubset({"limits"}):
            raise ValueError("FIXED_METHOD_INPUT_ONLY")
        result = packet(requested.get("limits"))
        # CLI origin also includes argument parse and final stdout preparation.
        elapsed = max(int((time.monotonic() - origin) * 1000), int(result["runtime"]["elapsedMs"]))
        if result["status"] == "COMPLETE" and elapsed >= result["limits"]["seconds"] * 1000:
            set_partial(result, "TIME_LIMIT", {"phase": "FINALIZE"})
        result["runtime"]["elapsedMs"] = elapsed
        seal(result)
        payload = canonical(result)
        if len(payload.encode("utf-8")) > result["limits"]["maxOutputBytes"]:
            raise ValueError("FINAL_OUTPUT_LIMIT")
        if (result["status"] == "COMPLETE"
                and (time.monotonic() - origin) >= result["limits"]["seconds"]):
            set_partial(result, "TIME_LIMIT", {"phase": "FINALIZE"})
            result["runtime"]["elapsedMs"] = max(result["runtime"]["elapsedMs"],
                                                   int((time.monotonic() - origin) * 1000))
            seal(result)
            payload = canonical(result)
            if len(payload.encode("utf-8")) > result["limits"]["maxOutputBytes"]:
                raise ValueError("FINAL_OUTPUT_LIMIT")
        sys.stdout.write(payload)
    except Investigation as error:
        cap = validated_limits(requested.get("limits"))["maxOutputBytes"]
        payload = canonical({"status": "INVESTIGATION", "error": str(error), "row": error.row})
        if len(payload.encode("utf-8")) <= cap:
            sys.stdout.write(payload)
        raise SystemExit(1)
    except (ValueError, TypeError, KeyError, OverflowError) as error:
        # Inert, bounded diagnostic. No COMPLETE/PASS after malformed input.
        payload = canonical({"status": "UNAVAILABLE", "error": str(error)[:200]})
        cap = LIMITS["maxOutputBytes"]
        try:
            cap = validated_limits(requested.get("limits"))["maxOutputBytes"]
        except (ValueError, TypeError, AttributeError):
            pass
        if len(payload.encode("utf-8")) <= cap:
            sys.stdout.write(payload)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
