"""TIP045 isolated independent arithmetic; no repository imports or outcome input.

Structural generation enumerates only split-support norm divisors / ordered
coprime divisor pairs. Full six-row and abstract truth are separate, locally
checkpoint-authorized diagnostics. Counters are not CPU attestation.
"""
import hashlib
import itertools
import json
import math
import sys
import time

CONTROLS = [(13, 7), (61, 7), (157, 7), (401, 31), (2521, 31), (113, 31)]
LIMITS = {"seconds": 30, "maxRows": 6, "maxStateInsertions": 100000,
          "maxWork": 5000000, "maxOutputBytes": 1048576}
METHOD = "ERDOS_STRAUS_DUAL_TARGET_DIVISOR_REALIZATION_V1"
POLICY = "POSITIVE_NORM_DIRECTION_FIRST_AND_POSITIVE_RATIO_GREEDY_WITH_ACTUAL_POINT_CORRECTION"
INPUTS = {"controls": [{"id": "C" + str(i), "p": str(p), "h": str(h)}
                       for i, (p, h) in enumerate(CONTROLS)]}
SCOPE = ("Six exposed proof controls only; paired structural assertions concern this Type I norm "
         "branch and coprime-divisor Type II shift. UNKNOWN is not MISS; generated split subgroup "
         "is not paid coverage. Point corrections spend actual disjoint valuations. No all-shift "
         "or root impossibility, universal existence, novelty, benchmark or agent/UI authority.")


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode("utf-8")).hexdigest()


def limits(overrides=None, defaults=LIMITS, minimum=4096):
    result = dict(defaults)
    if overrides is None:
        return result
    if not isinstance(overrides, dict) or not set(overrides).issubset(defaults):
        raise ValueError("LIMIT_KEYS")
    for key, value in overrides.items():
        if (isinstance(value, bool) or not isinstance(value, (int, float))
                or not math.isfinite(value) or value <= 0 or value > defaults[key]
                or (key != "seconds" and int(value) != value)
                or (key == "maxOutputBytes" and value < minimum)):
            raise ValueError("INVALID_TIGHTER_LIMIT")
        result[key] = value if key == "seconds" else int(value)
    return result


class Stop(Exception):
    def __init__(self, reason, pending):
        super().__init__(reason)
        self.reason, self.pending = reason, dict(pending)


class Investigation(Exception):
    def __init__(self, row):
        super().__init__("POST_ROW_CONTRADICTION")
        self.row = row


class Budget:
    def __init__(self, tighter=None, clock=time.monotonic, defaults=LIMITS):
        self.limits = limits(tighter, defaults)
        self.clock, self.start = clock, clock()
        if isinstance(self.start, bool) or not isinstance(self.start, (int, float)) or not math.isfinite(self.start):
            raise ValueError("CLOCK_DOMAIN")
        self.last = self.start
        self.work, self.states = 0, 0
        self.pending = {"phase": "ROW", "index": "0", "p": "13", "h": "7"}

    def elapsed(self):
        value = float((self.observe() - self.start) * 1000)
        return int(value) if value.is_integer() else value

    def observe(self):
        observed = self.clock()
        if (isinstance(observed, bool) or not isinstance(observed, (int, float))
                or not math.isfinite(observed) or observed < self.last):
            raise ValueError("CLOCK_DOMAIN")
        self.last = observed
        return observed

    def check(self):
        if self.observe() - self.start >= self.limits["seconds"]:
            raise Stop("TIME_LIMIT", self.pending)

    def step(self, n=1):
        if isinstance(n, bool) or not isinstance(n, int) or n < 1:
            raise ValueError("WORK_COUNT")
        if n > self.limits["maxWork"] - self.work:
            raise Stop("WORK_LIMIT", self.pending)
        self.work += n
        self.check()

    def state(self, n=1):
        if isinstance(n, bool) or not isinstance(n, int) or n < 1:
            raise ValueError("STATE_COUNT")
        if n > self.limits["maxStateInsertions"] - self.states:
            raise Stop("STATE_LIMIT", self.pending)
        self.states += n
        self.check()


def factor(n, b):
    if isinstance(n, bool) or not isinstance(n, int) or n < 1:
        raise ValueError("FACTOR_DOMAIN")
    fs, q = [], 2
    while q * q <= n:
        b.step()
        e = 0
        while n % q == 0:
            b.step()
            e, n = e + 1, n // q
        if e:
            fs.append((q, e))
        q = 3 if q == 2 else q + 2
    if n > 1:
        fs.append((n, 1))
    return fs


def prime(n, b):
    return n >= 2 and factor(n, b) == [(n, 1)]


def power(a, e, h, b):
    if e < 0:
        a, e = pow(a, -1, h), -e
        b.step()
    value = 1
    a %= h
    while e:
        b.step()
        if e & 1:
            value = value * a % h
        a, e = a * a % h, e // 2
    return value


def character(a, h, b):
    r = power(a, (h - 1) // 2, h, b)
    if r not in (1, h - 1):
        raise ValueError("CHARACTER_DOMAIN")
    return 1 if r == 1 else -1


def closure(residues, h, b):
    found, queue = {1}, [1]
    b.state()
    for x in queue:
        for r in residues:
            b.step()
            y = x * r % h
            if y not in found:
                b.state()
                found.add(y)
                queue.append(y)
    return sorted(found)


def residue(vector, fs, h, b):
    out = 1
    for z, (q, _) in zip(vector, fs):
        b.step()
        out = out * power(q, z, h, b) % h
    return out


def positive_divisors(fs, multiplier, b):
    values = [(1, [0] * len(fs))]
    for i, (q, e) in enumerate(fs):
        out, qp = [], 1
        for n in range(multiplier * e + 1):
            for value, vector in values:
                b.step()
                b.state()
                new = vector[:]
                new[i] = n
                out.append((value * qp, new))
            qp *= q
        values = out
    return sorted(values, key=lambda pair: (pair[0], pair[1]))


def split_images(fs, indices, h, b):
    # Independent positive norm divisors, NOT primary signed-image DP.
    selected = [fs[i] for i in indices]
    norm = {}
    for m, vector in positive_divisors(selected, 2, b):
        b.step()
        r = m % h
        if r not in norm:
            b.state()
            full = [0] * len(fs)
            for i, n in zip(indices, vector):
                b.step()
                full[i] = n
            norm[r] = {"residue": str(r), "m": str(m), "exponents": list(map(str, full))}
    # Positive ordered divisor pairs with disjoint per-prime valuations.
    # On abstract labels, numerical gcd may overlap although labels are distinct;
    # this coordinate condition is precisely coprimality for real prime factors.
    ds, ratio = positive_divisors(selected, 1, b), {}
    for u, uv in ds:
        for v, vv in ds:
            b.step()
            if any(x and y for x, y in zip(uv, vv)):
                continue
            r = u * pow(v, -1, h) % h
            b.step()
            candidate = (u, v)
            if r not in ratio or candidate < (int(ratio[r]["u"]), int(ratio[r]["v"])):
                full = [0] * len(fs)
                for i, x, y in zip(indices, uv, vv):
                    b.step()
                    full[i] = x - y
                if r not in ratio:
                    b.state()
                ratio[r] = {"residue": str(r), "u": str(u), "v": str(v),
                            "exponents": list(map(str, full))}
    return norm, ratio


def pair_from_vector(vector, fs, b):
    u, v = 1, 1
    for z, (q, e) in zip(vector, fs):
        b.step()
        if abs(z) > e:
            raise ValueError("RATIO_ALLOCATION")
        if z > 0:
            u *= q ** z
        elif z < 0:
            v *= q ** (-z)
    return u, v


def strict(p, triple, expected, b):
    b.step(8)
    x, y, z = sorted(triple)
    if not (0 < x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z)
            and sum(t % p == 0 for t in (x, y, z)) == expected):
        raise ValueError("STRICT_IDENTITY")
    return [str(x), str(y), str(z)]


def norm_witness(p, h, T, fs, vector, b):
    a, d, m, alpha, delta, signed = 1, 1, 1, [], [], []
    for n, (q, e) in zip(vector, fs):
        b.step()
        if n < 0 or n > 2 * e:
            raise ValueError("NORM_ALLOCATION")
        al, de = n // 2, n % 2
        alpha.append(str(al))
        delta.append(str(de))
        signed.append(str(n - e))
        a, d, m = a * q ** al, d * q ** de, m * q ** n
    if T % (a * d) or (4 * m + 1) % h:
        raise ValueError("UNPAID_NORM")
    c, v = T // (a * d), (4 * m + 1) // h
    bb = c * v - a
    if bb != (p * a + c) // h or (p * a + c) % h:
        raise ValueError("NORM_INTEGRALITY")
    x, y, z = strict(p, [T, bb * c * d, a * bb * d * p], 1, b)
    return {"m": str(m), "normExponents": list(map(str, vector)), "signedExponents": signed,
            "alpha": alpha, "delta": delta, "a": str(a), "d": str(d),
            "c": str(c), "v": str(v), "b": str(bb), "x": x, "y": y, "z": z}


def ratio_witness(p, h, T, fs, raw, b):
    u, v = pair_from_vector(raw, fs, b)
    if math.gcd(u, v) != 1 or T % (u * v) or (u + v) % h:
        raise ValueError("UNPAID_RATIO")
    invert = u > v
    vector = [-z for z in raw] if invert else raw[:]
    if invert:
        u, v = v, u
    k, A = T // (u * v), (u + v) // h
    x, y, z = strict(p, [T, A * p * u * k, A * p * v * k], 2, b)
    return {"rawExponents": list(map(str, raw)), "exponents": list(map(str, vector)),
            "orientation": "WHOLE_INVERTED" if invert else "UNCHANGED", "u": str(u),
            "v": str(v), "k": str(k), "A": str(A), "x": x, "y": y, "z": z}


def analyze_group(h, fs, b, p=None):
    if (not isinstance(h, int) or h < 3 or h > 127 or h % 4 != 3 or not prime(h, b)
            or not isinstance(fs, list) or len(fs) > 16):
        raise ValueError("GROUP_DOMAIN")
    for q, e in fs:
        b.step()
        if (isinstance(q, bool) or not isinstance(q, int) or q < 1 or q > 201000000
                or q % h == 0 or isinstance(e, bool) or not isinstance(e, int)
                or e < 1 or e > 26):
            raise ValueError("FACTOR_LABEL_DOMAIN")
    T = 1
    for q, e in fs:
        b.step()
        T *= q ** e
    p_mod = (4 * T) % h if p is None else p % h
    split, inert, chis = [], [], []
    for i, (q, _) in enumerate(fs):
        chi = character(q, h, b)
        chis.append(chi)
        (split if chi == 1 else inert).append(i)
    L = closure([fs[i][0] % h for i in split], h, b)
    Lset = set(L)
    norm, ratio = split_images(fs, split, h, b)
    four_coset = min(4 * x % h for x in L)
    anchor_index = min(inert, key=lambda i: (fs[i][0], i)) if inert else None
    anchor, d, directions = None, None, []
    coherent, plus, minus = True, 0, 0
    if inert:
        q = fs[anchor_index][0]
        ar = q % h
        anchor = {"prime": str(q), "residue": str(ar),
                  "coset": str(min(ar * x % h for x in L))}
        x = 1
        for dd in range(1, h):
            b.step()
            x = x * ar % h
            if x in Lset:
                d = dd
                break
        if d is None or d % 4 != 2:
            raise ValueError("INERT_ORDER")
        inv = pow(ar, -1, h)
        for i in inert:
            b.step()
            r = fs[i][0] % h
            direction = 1 if r * inv % h in Lset else (-1 if r * ar % h in Lset else None)
            directions.append((i, direction))
            if direction is None:
                coherent = False
            elif direction == 1:
                plus += fs[i][1]
            else:
                minus += fs[i][1]
    base = {"verdict": "UNKNOWN", "reason": "INCOHERENT", "projected": None,
            "selectedExponent": None, "inertExponents": None, "inertResidue": None,
            "correction": None, "witness": None}
    one = dict(base, target=str((-pow(p_mod, -1, h)) % h), inverseTarget=str((-p_mod) % h),
               fourCoset=str(four_coset), beta=None, ell=None)
    two = dict(base, target=str(h - 1))
    if not inert:
        for branch in (one, two):
            branch.update(verdict="LOCAL_MISS", reason="NO_INERT")
    elif coherent:
        ar = int(anchor["residue"])
        beta, x = None, 1
        for j in range(d):
            b.step()
            if 4 * pow(x, -1, h) % h in Lset:
                beta = j
                break
            x = x * ar % h
        if beta is None:
            one.update(verdict="LOCAL_MISS", reason="FOUR_OUTSIDE", projected=False)
        else:
            ell = (d // 2 - beta) % d
            if ell == 0 or ell % 2 == 0:
                raise ValueError("NORM_TARGET_PARITY")
            one.update(beta=str(beta), ell=str(ell))
            possible = 2 * plus >= ell or 2 * minus >= d - ell
            one["projected"] = possible
            if not possible:
                one.update(verdict="LOCAL_MISS", reason="PROJECTION_MISS")
            else:
                selected = ell if 2 * plus >= ell else ell - d
                remaining, vector = abs(selected), [0] * len(fs)
                for i, direction in directions:
                    b.step()
                    if direction != (1 if selected > 0 else -1):
                        continue
                    take = min(remaining, 2 * fs[i][1])
                    vector[i], remaining = take, remaining - take
                if remaining:
                    raise ValueError("NORM_PROJECTION_ALLOCATION")
                w = residue(vector, fs, h, b)
                corr = (-pow(4, -1, h) * pow(w, -1, h)) % h
                entry = norm.get(corr)
                one.update(selectedExponent=str(selected), inertExponents=list(map(str, vector)),
                           inertResidue=str(w), correction={"coordinate": "UNSIGNED_NORM",
                                                          "residue": str(corr), "representation": entry},
                           reason="POINT_CORRECTION" if entry else "UNPAID_CORRECTION",
                           verdict="HIT" if entry else "UNKNOWN")
                if entry:
                    vector = [n + int(z) for n, z in zip(vector, entry["exponents"])]
                    if residue(vector, fs, h, b) != (-pow(4, -1, h)) % h:
                        raise ValueError("NORM_POINT_CORRECTION")
                    one["_vector"] = vector
                    if p is not None:
                        one["witness"] = norm_witness(p, h, T, fs, vector, b)
        possible = plus + minus >= d // 2
        two["projected"] = possible
        if not possible:
            two.update(verdict="LOCAL_MISS", reason="PROJECTION_MISS")
        else:
            remaining, vector = d // 2, [0] * len(fs)
            for i, direction in directions:
                b.step()
                take = min(remaining, fs[i][1])
                vector[i], remaining = direction * take, remaining - take
            if remaining:
                raise ValueError("RATIO_PROJECTION_ALLOCATION")
            w = residue(vector, fs, h, b)
            corr = (-pow(w, -1, h)) % h
            entry = ratio.get(corr)
            two.update(selectedExponent=str(d // 2), inertExponents=list(map(str, vector)),
                       inertResidue=str(w), correction={"coordinate": "SIGNED_RATIO",
                                                      "residue": str(corr), "representation": entry},
                       reason="POINT_CORRECTION" if entry else "UNPAID_CORRECTION",
                       verdict="HIT" if entry else "UNKNOWN")
            if entry:
                vector = [n + int(z) for n, z in zip(vector, entry["exponents"])]
                if residue(vector, fs, h, b) != h - 1:
                    raise ValueError("RATIO_POINT_CORRECTION")
                two["_vector"] = vector
                if p is not None:
                    two["witness"] = ratio_witness(p, h, T, fs, vector, b)
    if (len(norm) == len(L) and one["projected"] and one["verdict"] != "HIT"
            or len(ratio) == len(L) and two["projected"] and two["verdict"] != "HIT"):
        raise ValueError("FULL_PAID_CORRECTION_CONTRADICTION")
    return {"L": list(map(str, L)), "splitNormImage": [norm[r] for r in sorted(norm)],
            "splitRatioImage": [ratio[r] for r in sorted(ratio)],
            "normPaid": len(norm) == len(L), "ratioPaid": len(ratio) == len(L),
            "anchor": anchor, "d": str(d) if d else None,
            "ambientIndex": str((h - 1) // len(L)), "Eplus": str(plus), "Eminus": str(minus),
            "coherent": coherent,
            "directions": [{"prime": str(fs[i][0]), "direction": None if di is None else ("+1" if di == 1 else "-1")}
                           for i, di in directions], "typeI": one, "typeII": two}


def row(p, h, i, b):
    if (isinstance(p, bool) or not isinstance(p, int) or p < 5 or p > 201000000
            or p % 4 != 1 or not prime(p, b) or not isinstance(h, int) or h >= p
            or h > 127 or h < 3 or h % 4 != 3 or not prime(h, b)):
        raise ValueError("ROW_DOMAIN")
    T = (p + h) // 4
    fs = factor(T, b)
    chars = []
    for q, _ in fs:
        b.step()
        chi = character(q, h, b)
        root = (1 if p % 8 in (1, 7) else -1) if q == 2 else character(p, q, b)
        if chi != root:
            raise ValueError("ROOT_RECIPROCITY")
        chars.append({"prime": str(q), "shiftCharacter": "+1" if chi == 1 else "-1",
                      "rootCharacter": "+1" if root == 1 else "-1",
                      "kind": "SPLIT" if chi == 1 else "INERT"})
    result = {"id": "C" + str(i), "p": str(p), "h": str(h), "T": str(T),
              "factors": [[str(q), str(e)] for q, e in fs], "characters": chars,
              **analyze_group(h, fs, b, p)}
    for branch in ("typeI", "typeII"):
        result[branch].pop("_vector", None)
    b.step()
    result["rowDigest"] = digest(result)
    assert_candidate(result)
    return result


def assert_candidate(r):
    for branch in ("typeI", "typeII"):
        br = r[branch]
        if ((br["verdict"] == "HIT") != (br["witness"] is not None)
                or br["verdict"] == "HIT" and (not br["projected"]
                   or not br["correction"] or not br["correction"]["representation"])
                or br["verdict"] == "LOCAL_MISS" and br["projected"] is True):
            raise Investigation(r)


def summary(rows):
    counts = {k: {s: "0" for s in ("HIT", "LOCAL_MISS", "UNKNOWN")} for k in ("typeI", "typeII")}
    for r in rows:
        for k in counts:
            s = r[k]["verdict"]
            counts[k][s] = str(int(counts[k][s]) + 1)
    return {"total": str(len(rows)), **counts}


def science(p):
    return {k: p[k] for k in ("method", "inputs", "policy", "scope", "rows", "summary")}


def seal(result, b):
    result["summary"] = summary(result["rows"])
    result["rowsDigest"] = digest(result["rows"])
    result["contentDigest"] = digest(science(result))
    result["runtime"] = {"elapsedMs": b.elapsed(), "stateInsertions": str(b.states),
                         "work": str(b.work), "outputBytes": "0"}
    for _ in range(12):
        text = canonical(result)
        size = str(len(text.encode("utf-8")))
        if result["runtime"]["outputBytes"] == size:
            return text
        result["runtime"]["outputBytes"] = size
    raise ValueError("SERIALIZATION_FIXED_POINT")


def pending_at(i):
    return ({"phase": "ROW", "index": str(i), "p": str(CONTROLS[i][0]), "h": str(CONTROLS[i][1])}
            if i < len(CONTROLS) else {"phase": "FINALIZE"})


def finalize(result, b):
    b.pending = {"phase": "FINALIZE"}
    while True:
        text = seal(result, b)
        if len(text.encode("utf-8")) > b.limits["maxOutputBytes"]:
            if not result["rows"]:
                raise ValueError("MINIMUM_DIAGNOSTIC_ENVELOPE")
            result["rows"].pop()
            result.update(status="PARTIAL", reason="OUTPUT_LIMIT", pending=pending_at(len(result["rows"])))
            continue
        if b.observe() - b.start >= b.limits["seconds"] and result["status"] == "COMPLETE":
            result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
            continue
        return result


def packet(tighter=None, clock=time.monotonic, budget_factory=Budget):
    validated = limits(tighter)
    b = budget_factory(validated, clock=clock)
    rows, status, reason, pending = [], "COMPLETE", None, None
    try:
        for i, (p, h) in enumerate(CONTROLS):
            b.pending = pending_at(i)
            b.check()
            if len(rows) >= b.limits["maxRows"]:
                raise Stop("ROW_LIMIT", b.pending)
            completed = row(p, h, i, b)
            b.check()
            rows.append(completed)
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason, pending = "PARTIAL", error.reason, error.pending
    result = {"method": METHOD, "inputs": INPUTS, "policy": POLICY, "scope": SCOPE,
              "status": status, "reason": reason, "pending": pending, "limits": dict(b.limits), "rows": rows}
    return finalize(result, b)


def diagnostic_seal(result, b):
    """Observed serialization envelope, no synchronous hard preemption claim."""
    result["runtime"] = {"elapsedMs": b.elapsed(), "stateInsertions": str(b.states),
                         "work": str(b.work), "outputBytes": "0"}
    for _ in range(12):
        text = canonical(result)
        count = str(len(text.encode("utf-8")))
        if count == result["runtime"]["outputBytes"]:
            break
        result["runtime"]["outputBytes"] = count
    else:
        raise ValueError("DIAGNOSTIC_FIXED_POINT")
    if len(text.encode("utf-8")) > b.limits["maxOutputBytes"]:
        # A bounded nonadmitting summary, not silent truncated COMPLETE evidence.
        result.update(status="PARTIAL", reason="OUTPUT_LIMIT", pending={"phase": "FINALIZE"})
        result["runtime"]["elapsedMs"] = b.elapsed()
    elif b.observe() - b.start >= b.limits["seconds"] and result["status"] == "COMPLETE":
        result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
        result["runtime"]["elapsedMs"] = b.elapsed()
    result["runtime"]["outputBytes"] = "0"
    for _ in range(12):
        text = canonical(result)
        count = str(len(text.encode("utf-8")))
        if count == result["runtime"]["outputBytes"]:
            break
        result["runtime"]["outputBytes"] = count
    if len(text.encode("utf-8")) > b.limits["maxOutputBytes"]:
        raise ValueError("DIAGNOSTIC_OUTPUT_LIMIT")
    if b.observe() - b.start >= b.limits["seconds"] and result["status"] == "COMPLETE":
        result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
        return diagnostic_seal(result, b)
    return result


def retrospective_truth(raw, checkpoint=False, tighter=None, clock=time.monotonic, budget_factory=Budget):
    if checkpoint is not True:
        raise ValueError("MAIN_CHRONOLOGY_CHECKPOINT_REQUIRED")
    if (not isinstance(raw, dict) or raw.get("status") != "COMPLETE"
            or raw.get("inputs") != INPUTS or len(raw.get("rows", [])) != 6
            or raw.get("contentDigest") != digest(science(raw))):
        raise ValueError("COMPLETE_FIXED_METHOD_REQUIRED")
    b = budget_factory(limits(tighter), clock=clock)
    rows, status, reason, pending = [], "COMPLETE", None, None
    try:
        for i, (p, h) in enumerate(CONTROLS):
            b.pending = {"phase": "TRUTH_ROW", "index": str(i), "p": str(p), "h": str(h)}
            b.check()
            if len(rows) >= b.limits["maxRows"]:
                raise Stop("ROW_LIMIT", b.pending)
            fs, T = factor((p + h) // 4, b), (p + h) // 4
            norm_hits = []
            for m, vector in positive_divisors(fs, 2, b):
                b.step()
                if (4 * m + 1) % h == 0:
                    norm_hits.append({"m": str(m), "witness": norm_witness(p, h, T, fs, vector, b)})
            ds, ratio_hits = positive_divisors(fs, 1, b), []
            for u, _ in ds:
                for v, _ in ds:
                    b.step()
                    if u > v or math.gcd(u, v) != 1 or T % (u * v) or (u + v) % h:
                        continue
                    k, A = T // (u * v), (u + v) // h
                    x, y, z = strict(p, [T, A * p * u * k, A * p * v * k], 2, b)
                    ratio_hits.append({"u": str(u), "v": str(v), "k": str(k), "A": str(A), "x": x, "y": y, "z": z})
            observations = {}
            for branch, hits in (("typeI", norm_hits), ("typeII", ratio_hits)):
                b.step()
                verdict = raw["rows"][i][branch]["verdict"]
                if verdict == "HIT" and not hits or verdict == "LOCAL_MISS" and hits:
                    raise ValueError("RETROSPECTIVE_ASSERTION_CONTRADICTION")
                witness = raw["rows"][i][branch]["witness"]
                if witness:
                    if branch == "typeI":
                        vector = list(map(int, witness["normExponents"]))
                        if norm_witness(p, h, T, fs, vector, b) != witness:
                            raise ValueError("RETAINED_NORM_WITNESS")
                    else:
                        vector = list(map(int, witness["rawExponents"]))
                        if ratio_witness(p, h, T, fs, vector, b) != witness:
                            raise ValueError("RETAINED_RATIO_WITNESS")
                observations[branch] = {"verdict": verdict, "hit": bool(hits), "witnessChecked": bool(witness),
                                        "hits": hits}
            b.check()
            rows.append({"id": "C" + str(i), "p": str(p), "h": str(h), **observations})
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason, pending = "PARTIAL", error.reason, error.pending
    result = {"phase": "RETROSPECTIVE_AFTER_MAIN_AGREEMENT", "status": status, "reason": reason,
              "pending": pending, "limits": dict(b.limits), "methodContentDigest": raw["contentDigest"],
              "rows": rows, "rowsDigest": digest(rows)}
    return diagnostic_seal(result, b)


PROFILE_LIMITS = {"seconds": 60, "maxRows": 16896, "maxStateInsertions": 2000000,
                  "maxWork": 50000000, "maxOutputBytes": 65536}
PROFILE_SHIFTS = [3, 7, 11, 19, 23, 31]


def abstract_profiles(checkpoint=False, tighter=None, clock=time.monotonic, budget_factory=Budget):
    if checkpoint is not True:
        raise ValueError("MAIN_CHRONOLOGY_CHECKPOINT_REQUIRED")
    b = budget_factory(limits(tighter, PROFILE_LIMITS), clock=clock, defaults=PROFILE_LIMITS)
    profiles = 0
    counts = {k: {v: {"hit": 0, "miss": 0} for v in ("HIT", "LOCAL_MISS", "UNKNOWN")}
              for k in ("typeI", "typeII")}
    stream = hashlib.sha256()
    stream.update(b"[")
    status, reason, pending = "COMPLETE", None, None
    balanced_short, outside, unpaid = 0, 0, 0
    try:
        for h in PROFILE_SHIFTS:
            for size in (1, 2):
                for qs in itertools.product(range(1, h), repeat=size):
                    for es in itertools.product((1, 2, 3), repeat=size):
                        b.pending = {"phase": "PROFILE", "index": str(profiles), "h": str(h),
                                     "residues": list(map(str, qs)), "exponents": list(map(str, es))}
                        b.check()
                        if profiles >= b.limits["maxRows"]:
                            raise Stop("ROW_LIMIT", b.pending)
                        fs = list(zip(qs, es))
                        group = analyze_group(h, fs, b)
                        norm_set, signed_set = set(), set()
                        for vector in itertools.product(*(range(2 * e + 1) for e in es)):
                            b.state()
                            norm_set.add(residue(vector, fs, h, b))
                        for vector in itertools.product(*(range(-e, e + 1) for e in es)):
                            b.state()
                            signed_set.add(residue(vector, fs, h, b))
                        Tmod = residue(list(es), fs, h, b)
                        b.step(len(signed_set))
                        if norm_set != {Tmod * r % h for r in signed_set}:
                            raise ValueError("ABSTRACT_TRANSLATION")
                        truthI = (-pow(4, -1, h)) % h in norm_set
                        truthII = h - 1 in signed_set
                        if truthI != (int(group["typeI"]["target"]) in signed_set):
                            raise ValueError("ABSTRACT_PAIRED_TARGET")
                        staged_counts = []
                        for branch, hit in (("typeI", truthI), ("typeII", truthII)):
                            b.step()
                            verdict = group[branch]["verdict"]
                            if verdict == "HIT" and not hit or verdict == "LOCAL_MISS" and hit:
                                raise ValueError("ABSTRACT_ASSERTION")
                            staged_counts.append((branch, verdict, "hit" if hit else "miss"))
                        balanced_here = False
                        if group["coherent"] and group["d"] and group["typeI"]["beta"] == "0":
                            dd = int(group["d"])
                            pp, mm = int(group["Eplus"]), int(group["Eminus"])
                            if group["typeI"]["projected"] != (2 * max(pp, mm) >= dd // 2):
                                raise ValueError("ABSTRACT_DIRECTIONAL_THRESHOLD")
                            if pp and mm and pp + mm >= math.ceil(dd / 4) and not group["typeI"]["projected"]:
                                balanced_here = True
                        outside_here = int(group["typeI"]["reason"] == "FOUR_OUTSIDE")
                        unpaid_here = sum(group[k]["reason"] == "UNPAID_CORRECTION" for k in ("typeI", "typeII"))
                        record = {"h": str(h), "factors": [[str(q), str(e)] for q, e in fs],
                                  "normImage": list(map(str, sorted(norm_set))),
                                  "signedImage": list(map(str, sorted(signed_set))),
                                  "typeI": {"verdict": group["typeI"]["verdict"], "reason": group["typeI"]["reason"], "hit": truthI},
                                  "typeII": {"verdict": group["typeII"]["verdict"], "reason": group["typeII"]["reason"], "hit": truthII}}
                        b.step()
                        staged_stream = stream.copy()
                        if profiles:
                            staged_stream.update(b",")
                        staged_stream.update(canonical(record).encode("utf-8"))
                        b.check()
                        stream = staged_stream
                        for branch, verdict, observed in staged_counts:
                            counts[branch][verdict][observed] += 1
                        balanced_short += int(balanced_here)
                        outside += outside_here
                        unpaid += unpaid_here
                        profiles += 1
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason, pending = "PARTIAL", error.reason, error.pending
    stream.update(b"]")
    result = {"phase": "ABSTRACT_PROFILES_AFTER_MAIN_AGREEMENT", "status": status, "reason": reason,
              "pending": pending, "limits": dict(b.limits), "profiles": str(profiles), "expectedProfiles": "16896",
              "counts": counts, "profilesDigest": stream.hexdigest(),
              "controls": {"balancedTotalThresholdButProjectionMiss": str(balanced_short),
                           "fourOutside": str(outside), "unpaidBranches": str(unpaid)},
              "scope": "Ordered one/two labeled residue factors, not prime roots or performance benchmark."}
    return diagnostic_seal(result, b)


def main():
    requested = {}
    try:
        raw = sys.stdin.read(65537)
        if len(raw.encode("utf-8")) > 65536:
            raise ValueError("INPUT_LIMIT")
        if raw.strip():
            requested = json.loads(raw, parse_constant=lambda _: (_ for _ in ()).throw(ValueError("NONFINITE_JSON")))
        if not isinstance(requested, dict) or not set(requested).issubset({"limits"}):
            raise ValueError("FIXED_INPUT_ONLY")
        applied = limits(requested.get("limits"))
        start = time.monotonic()
        result = packet(applied)
        text = canonical(result)
        elapsed = (time.monotonic() - start) * 1000
        elapsed = int(elapsed) if elapsed.is_integer() else elapsed
        if elapsed >= applied["seconds"] * 1000 and result["status"] == "COMPLETE":
            result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
        # The CLI elapsed includes entry and final serialization, not only kernel.
        result["runtime"]["elapsedMs"] = elapsed
        for _ in range(12):
            text = canonical(result)
            size = str(len(text.encode("utf-8")))
            if result["runtime"]["outputBytes"] == size:
                break
            result["runtime"]["outputBytes"] = size
        else:
            raise ValueError("CLI_SERIALIZATION_FIXED_POINT")
        if len(text.encode("utf-8")) > applied["maxOutputBytes"]:
            raise ValueError("CLI_OUTPUT_LIMIT")
        if time.monotonic() - start >= applied["seconds"] and result["status"] == "COMPLETE":
            result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
            final_elapsed = (time.monotonic() - start) * 1000
            result["runtime"]["elapsedMs"] = int(final_elapsed) if final_elapsed.is_integer() else final_elapsed
            for _ in range(12):
                text = canonical(result)
                size = str(len(text.encode("utf-8")))
                if size == result["runtime"]["outputBytes"]:
                    break
                result["runtime"]["outputBytes"] = size
            if len(text.encode("utf-8")) > applied["maxOutputBytes"]:
                raise ValueError("CLI_OUTPUT_LIMIT")
        sys.stdout.write(text)
        if result["status"] != "COMPLETE":
            raise SystemExit(1)
    except Investigation as error:
        cap = limits(requested.get("limits"))["maxOutputBytes"] if isinstance(requested, dict) else 4096
        diagnostic = {"status": "INVESTIGATION", "error": str(error), "row": error.row}
        text = canonical(diagnostic)
        if len(text.encode("utf-8")) > cap:
            text = canonical({"status": "INVESTIGATION", "error": str(error), "rowOmitted": True})
        sys.stdout.write(text)
        raise SystemExit(1)
    except (ValueError, TypeError, OverflowError) as error:
        sys.stdout.write(canonical({"status": "UNAVAILABLE", "error": str(error)}))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
