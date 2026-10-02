"""TIP-042 independent occupied-half add-on to immutable TIP-041 replay.

The fixed dependency is hash-verified and executed from those same bytes in an
inert namespace. One shared Budget and outer clock cover dependency + add-on.
No primary decisions, truth images, model, provider or mutable outcome input.
"""
import hashlib
import json
import math
import sys
import time
from pathlib import Path

PINS = {
    "primary": "1ac9f30c699e52e7d3e2784ce20535758323f76cbbb206431ab585a222c1338d",
    "checker": "8b60055f1146212894e954e103723db4bc57e15fc55a7ed09ca544e55f80ff1a",
    "replay": "5dbe06e076f0a8b010b03c248305d2601a4688b9bbd4711f849a437bc32dd0d0"}
PATHS = {"primary": "scripts/operations/block-coverage.ts", "checker": "scripts/operations/block-coverage-check.ts",
         "replay": "scripts/operations/block-coverage-replay.py"}
BASE_CONTENT = "4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347"
BASE_ROWS = "e51794b81610642e49920bd9016835891f046d909de7a00ecdd0da61e52c5bee"
METHOD = "ERDOS_STRAUS_OCCUPIED_HALF_DENSITY_V1"
SCOPE = "FIXED_191_EXPOSED_ROWS_OCCUPIED_HALF_SUFFICIENT_ONLY_NOT_ROOT_EXCLUSION_OR_MINIMUM"
POLICY = "INHERIT_TIP041_THEN_ASCENDING_ORIGINAL_OCCUPIED_HALF_DENSITY_V1"
LIMITS = {"seconds": 60, "maxRows": 191, "maxStateInsertions": 2000000, "maxWorkSteps": 50000000,
          "maxPairChecks": 50000000, "maxOutputBytes": 8388608, "checkerWorkCeiling": 50000000}
TARGETS = [200023321, 200602081, 200656681, 131433121]
SHIFTS = [3, 7, 11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107]
NEW_TARGETS = [199000201, 199002721, 199003561, 199006921, 199014481, 199031281, 199035481, 199039681]
COMPOSITES = [("r0", 200023321, 1595931), ("r1", 200023321, 183), ("r2", 200023321, 3000351),
              ("r3", 200602081, 25075263), ("r4", 200602081, 2550027), ("r5", 200602081, 4227),
              ("r6", 200602081, 247047), ("r7", 200656681, 68127), ("r10", 131433121, 7179),
              ("r11", 131433121, 19714971), ("r13", 200656681, 206439)]
FIXED_ROWS = [{"id": f"P{i}_h{m}", "p": str(p), "m": str(m), "source": "TIP037", "sourceRowId": f"{p}:{m}", "cohort": "EXPOSED_71"}
              for i, p in enumerate(TARGETS) for m in SHIFTS]
FIXED_ROWS += [{"id": f"C_{rid}", "p": str(p), "m": str(m), "source": "TIP039", "sourceRowId": rid, "cohort": "EXPOSED_71"} for rid, p, m in COMPOSITES]
FIXED_ROWS += [{"id": f"N{i}_h{m}", "p": str(p), "m": str(m), "source": "TIP041", "sourceRowId": f"{p}:{m}", "cohort": "PRIMALITY_ONLY_120"}
               for i, p in enumerate(NEW_TARGETS) for m in SHIFTS]
BASE_INPUTS = {"rows": FIXED_ROWS, "sourceContentDigests": {
    "TIP037": "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c",
    "TIP039": "ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e",
    "TIP040": "48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72"},
    "newCohort": {"roots": list(map(str, NEW_TARGETS)), "shifts": list(map(str, SHIFTS)),
                  "selection": "FIRST_8_ASCENDING_PRIMES_P1MOD840_IN_199000000_TO_199100000_PRIMALITY_ONLY",
                  "identity": "0dce735540a95a5087c5d624b8f85faab6e20a009b3071bfdc4ba4b126f9806a"},
    "policy": "ASCENDING_INDIVIDUAL_THEN_CARDINALITY_MASK_BLOCK_THEN_ENERGY_V1"}
INPUTS = {"baselineInputs": BASE_INPUTS, "policy": POLICY, "exposure": "ALL_191_EXPOSED_DEVELOPMENT"}


def compact(v):
    return json.dumps(v, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(v):
    return hashlib.sha256(compact(v).encode()).hexdigest()


class Investigation(Exception):
    def __init__(self, row):
        self.row = row
        super().__init__("DENSITY_ARITHMETIC_CONTRADICTION")


def dependency(observed):
    source = None
    for name, path in PATHS.items():
        data = Path(path).read_bytes()
        observed[name] = hashlib.sha256(data).hexdigest()
        if observed[name] != PINS[name]:
            raise ValueError("DEPENDENCY_DRIFT")
        if name == "replay":
            source = data
    namespace = {"__name__": "tip041_verified_dependency"}
    exec(compile(source, PATHS["replay"], "exec"), namespace)
    if namespace["INPUTS"] != BASE_INPUTS:
        raise ValueError("BASELINE_INVALID")
    return namespace


def normalize(fs, p, m, T, vector, b):
    # Own whole-vector normalization and exact strict identity, not a call to
    # baseline normalize_witness. No intermediate half pair is reordered.
    if len(vector) != len(fs) or any(abs(t) > e for (_, e), t in zip(fs, vector)):
        raise ValueError("VECTOR_BOUND")
    u, v = 1, 1
    for (q, _), t in zip(fs, vector):
        b.step()
        u *= q ** max(t, 0)
        v *= q ** max(-t, 0)
    orientation = "AS_CONSTRUCTED"
    if u > v:
        vector, u, v, orientation = [-t for t in vector], v, u, "INVERTED"
    b.step()
    if not (u < v and math.gcd(u, v) == 1 and T % (u * v) == 0 and (u + v) % m == 0):
        raise ValueError("PAIR_IDENTITY")
    k, A = T // (u * v), (u + v) // m
    x, y, z = sorted([T, A * p * u * k, A * p * v * k])
    b.step()
    if not (0 < x < y < z and 4*x*y*z == p*(x*y+x*z+y*z) and sum(d % p == 0 for d in [x, y, z]) == 2):
        raise ValueError("STRICT_TYPE_II")
    return list(map(str, vector)), orientation, dict(zip(["u", "v", "k", "A", "x", "y", "z"], map(str, [u, v, k, A, x, y, z])))


def density_match(row, attempt, b):
    m, p, T = int(row["m"]), int(row["p"]), int(row["T"])
    K = {int(e["residue"]): list(map(int, e["exponents"])) for e in row["chain"]["covered"]}
    fs = [(int(q), int(e)) for q, e in row["factors"]]
    lookup = {int(f["coset"]): f for f in attempt["B"]["frequencies"]}
    for _ in range(len(K)+len(lookup)):
        b.insert()  # Newly retained lookup states; underlying maps were paid in base.
    for a in attempt["A"]["frequencies"]:
        b.step()
        product = (m - 1) * pow(int(a["coset"]), -1, m) % m
        cb = m
        for k in K:
            b.step()
            cb = min(cb, product*k % m)
        if cb not in lookup:
            continue
        other = lookup[cb]
        b.step()
        lift = (m - 1) * pow(int(a["residue"])*int(other["residue"]) % m, -1, m) % m
        if lift not in K:
            raise ValueError("MISSING_PAID_LIFT")
        vector = [int(x)+int(y)+z for x, y, z in zip(a["exponents"], other["exponents"], K[lift])]
        normalized, orientation, witness = normalize(fs, p, m, T, vector, b)
        return {"cosetA": a["coset"], "cosetB": str(cb), "exponentsA": a["exponents"], "exponentsB": other["exponents"],
                "liftResidue": str(lift), "liftExponents": list(map(str, K[lift]))}, normalized, orientation, witness
    raise ValueError("SUFFICIENT_WITHOUT_MATCH")


def density_row(base, b):
    decisions, cert = [], None
    status = "INHERITED_CERTIFIED" if base["status"] != "NOT_CERTIFIED" else "NOT_CERTIFIED"
    if status == "NOT_CERTIFIED":
        for i, attempt in enumerate(base["attempts"]):
            b.check()
            a, c = len(attempt["A"]["frequencies"]), len(attempt["B"]["frequencies"])
            b.step()
            sufficient = a + c > int(attempt["quotientOrder"])
            decision = {"attemptIndex": str(i), "baselineAttemptDigest": attempt["attemptDigest"],
                        "halfADigest": digest(attempt["A"]), "halfBDigest": digest(attempt["B"]), "mask": attempt["mask"],
                        "occupiedA": str(a), "occupiedB": str(c), "quotientOrder": attempt["quotientOrder"], "sufficient": sufficient}
            b.insert()
            decisions.append(decision)
            if sufficient:
                match, vector, orientation, witness = density_match(base, attempt, b)
                cert = {"kind": "OCCUPIED_DENSITY", "attemptIndex": str(i), "partitionMask": attempt["mask"],
                        "match": match, "exponents": vector, "orientation": orientation, "witness": witness}
                status = "DENSITY_CERTIFIED"
                break
    # Pre-outcome Contractor L2 clarification: inherited density search is N/A;
    # the unchanged embedded baseline alone retains its historical allocation.
    total = 0 if base["status"] != "NOT_CERTIFIED" else len(base["attempts"])
    row = {"id": base["id"], "baselineRowDigest": base["rowDigest"], "baselineStatus": base["status"], "status": status,
           "decisions": decisions, "allocation": {"totalPartitions": str(total), "evaluatedPartitions": str(len(decisions)),
                                                  "notEvaluatedPartitions": str(total-len(decisions))}, "certificate": cert}
    row["rowDigest"] = digest(row)
    if not assert_candidate(row):
        raise Investigation(row)
    return row


def assert_candidate(row):
    if row["status"] == "INHERITED_CERTIFIED":
        return row["baselineStatus"] != "NOT_CERTIFIED" and not row["decisions"] and row["certificate"] is None
    if row["status"] == "DENSITY_CERTIFIED":
        return row["certificate"] is not None and row["decisions"][-1]["sufficient"] and not any(d["sufficient"] for d in row["decisions"][:-1])
    return row["certificate"] is None and not any(d["sufficient"] for d in row["decisions"])


def summary(rows, complete):
    def counts(rs):
        return {key: str(sum(r["status"] == key for r in rs)) for key in ["INHERITED_CERTIFIED", "DENSITY_CERTIFIED", "NOT_CERTIFIED"]}
    return {"complete": complete, "counts": counts(rows), "cohorts": {
        cohort: counts([row for row in rows if next(i for i in FIXED_ROWS if i["id"] == row["id"])["cohort"] == cohort])
        for cohort in ["EXPOSED_71", "PRIMALITY_ONLY_120"]}}


def seal(result):
    result["rowsDigest"] = digest(result["rows"])
    result["summary"] = summary(result["rows"], result["status"] == "COMPLETE")
    result["contentDigest"] = digest({key: result[key] for key in ["inputs", "baselineContentDigest", "baselineRowsDigest", "rows", "rowsDigest", "summary"]})
    for _ in range(16):
        result["packetDigest"] = digest({k: v for k, v in result.items() if k != "packetDigest"})
        actual = str(len(compact(result).encode()))
        if actual == result["runtime"]["outputBytes"]:
            return
        result["runtime"]["outputBytes"] = actual
    raise ValueError("OUTPUT_FIXED_POINT")


def packet(clock=time.monotonic, _origin=None, **tightening):
    start = clock() if _origin is None else _origin  # Before dependency IO/hash/compile/load.
    limits = dict(LIMITS)
    for key, value in tightening.items():
        if key not in limits or key == "checkerWorkCeiling" or not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value) or value <= 0 or value > limits[key]:
            raise ValueError("LIMIT_DOMAIN")
        if key != "seconds" and (not isinstance(value, int) or key == "maxOutputBytes" and value < 32768):
            raise ValueError("LIMIT_DOMAIN")
        limits[key] = value
    observed = dict.fromkeys(PINS)
    base, rows, b, ns = None, [], None, None
    base_counts = (0, 0, 0)
    pending, status, reason = {"phase": "BASELINE"}, "COMPLETE", None
    try:
        ns = dependency(observed)
        if clock()-start >= limits["seconds"]:
            raise ns["Stop"]("REPLAY_TIME_LIMIT")
        original = ns["Budget"]
        b = original(clock, limits["maxPairChecks"], limits["maxWorkSteps"], limits["maxStateInsertions"])
        b.start = start
        b.phase = "BASELINE"
        # Trusted clock/counter adapter, no source or scientific algorithm edit.
        ns["Budget"] = lambda *args, **kwargs: b
        ns["MAX_SECONDS"] = limits["seconds"]
        ns["MAX_OUTPUT"] = limits["maxOutputBytes"]
        ns["LIMITS"] = {**ns["LIMITS"], "seconds": limits["seconds"], "maxStateInsertions": limits["maxStateInsertions"],
                        "maxWorkSteps": limits["maxWorkSteps"], "maxOutputBytes": limits["maxOutputBytes"]}
        base = ns["packet"](clock=clock, pair_limit=limits["maxPairChecks"], work_limit=limits["maxWorkSteps"], state_limit=limits["maxStateInsertions"])
        base_counts = (b.states, b.work, b.pairs)
        if base["status"] != "COMPLETE":
            status, reason = "PARTIAL", "BASELINE_PARTIAL"
        elif base["contentDigest"] != BASE_CONTENT or base["rowsDigest"] != BASE_ROWS:
            raise ValueError("BASELINE_INVALID")
        else:
            for item in base["rows"]:
                pending = {"phase": "ROW", "id": item["id"]}
                b.phase, b.pending = "ROW", pending
                b.check()
                if len(rows) >= limits["maxRows"]:
                    raise ns["Stop"]("ROW_LIMIT")
                next_row = density_row(item, b)
                b.insert()
                rows.append(next_row)
            pending = {"phase": "FINALIZE"}
            b.phase, b.pending = "FINALIZE", pending
            b.check()
    except OSError:
        status, reason = "PARTIAL", "DEPENDENCY_UNAVAILABLE"
    except ValueError as error:
        if str(error) in ["OUTPUT_HEAD_LIMIT", "OUTPUT_FINAL_LIMIT"]:
            status, reason = "PARTIAL", "OUTPUT_LIMIT"
        elif str(error) not in ["DEPENDENCY_DRIFT", "BASELINE_INVALID"]:
            raise
        else:
            status, reason = "PARTIAL", str(error)
    except Exception as error:
        if ns is None or not isinstance(error, ns["Stop"]):
            raise
        status = "PARTIAL"
        reason = {"REPLAY_TIME_LIMIT": "TIME_LIMIT", "REPLAY_PAIR_LIMIT": "PAIR_LIMIT"}.get(str(error), str(error))
    if b is not None and base is None:
        base_counts = (b.states, b.work, b.pairs)
    total = (b.states, b.work, b.pairs) if b else (0, 0, 0)
    result = {"method": METHOD, "status": status, "inputs": INPUTS, "baseline": {"packet": base, "expectedSourcePins": PINS,
              "observedSourcePins": observed, "omitted": base is None}, "baselineContentDigest": base["contentDigest"] if base else None,
              "baselineRowsDigest": base["rowsDigest"] if base else None, "rows": rows, "limits": limits,
              "pending": pending if reason else None, "reason": reason, "scope": SCOPE,
              "runtime": dict(zip(["baseStates", "baseWork", "basePairs", "additionalStates", "additionalWork", "additionalPairs", "stateInsertions", "workSteps", "pairChecks"],
                                  map(str, [*base_counts, *(v-c for v, c in zip(total, base_counts)), *total])))}
    result["runtime"].update(elapsedMs="0", outputBytes="0")
    def finish():
        result["runtime"]["elapsedMs"] = str(round((clock()-start)*1000))
        seal(result)
    finish()
    if int(result["runtime"]["outputBytes"]) > limits["maxOutputBytes"]:
        result.update(status="PARTIAL", reason="OUTPUT_LIMIT")
        full = list(rows)
        low, high = 0, len(full)
        while low < high:
            mid = (low+high+1)//2
            result.update(rows=full[:mid], pending={"phase": "ROW", "id": FIXED_ROWS[mid]["id"]} if mid < 191 else {"phase": "FINALIZE"})
            finish()
            if int(result["runtime"]["outputBytes"]) <= limits["maxOutputBytes"]:
                low = mid
            else:
                high = mid-1
        result.update(rows=full[:low], pending={"phase": "ROW", "id": FIXED_ROWS[low]["id"]} if low < 191 else {"phase": "FINALIZE"})
        finish()
        if int(result["runtime"]["outputBytes"]) > limits["maxOutputBytes"]:
            result.update(rows=[], baselineContentDigest=None, baselineRowsDigest=None, pending={"phase": "BASELINE"})
            result["baseline"].update(packet=None, omitted=True)
            finish()
        if int(result["runtime"]["outputBytes"]) > limits["maxOutputBytes"]:
            raise ValueError("OUTPUT_HEAD_LIMIT")
    encoded = compact(result)
    if result["status"] == "COMPLETE" and clock()-start >= limits["seconds"]:
        result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
        finish()
        encoded = compact(result)
    if len(encoded.encode()) > limits["maxOutputBytes"]:
        raise ValueError("OUTPUT_FINAL_LIMIT")
    return result


def main():
    if len(sys.argv) != 1:
        raise ValueError("FIXED_NO_ARGUMENTS")
    start = time.monotonic()
    diagnostic_cap = LIMITS["maxOutputBytes"]
    try:
        # Optional inert JSON of already allowlisted tighter resource values only.
        # No roots, code, factors, outcome or mode authority can enter stdin.
        request = "" if sys.stdin.isatty() else sys.stdin.read(32769)
        if len(request.encode()) > 32768:
            raise ValueError("LIMIT_REQUEST_BYTES")
        tighter = json.loads(request) if request.strip() else {}
        if not isinstance(tighter, dict):
            raise ValueError("LIMIT_REQUEST_OBJECT")
        if any(key not in LIMITS or key == "checkerWorkCeiling" for key in tighter):
            raise ValueError("FIXED_RESOURCE_KEYS_ONLY")
        requested_cap = tighter.get("maxOutputBytes", diagnostic_cap)
        if isinstance(requested_cap, int) and 32768 <= requested_cap <= diagnostic_cap:
            diagnostic_cap = requested_cap
        result = packet(_origin=start, **tighter)
        payload = compact(result)
        elapsed = round((time.monotonic()-start)*1000)
        if result["status"] == "COMPLETE" and elapsed >= result["limits"]["seconds"]*1000:
            result.update(status="PARTIAL", reason="TIME_LIMIT", pending={"phase": "FINALIZE"})
            result["runtime"]["elapsedMs"] = str(elapsed)
            seal(result)
            payload = compact(result)
        if len(payload.encode()) > result["limits"]["maxOutputBytes"]:
            raise ValueError("OUTPUT_STDOUT_LIMIT")
        print(payload, end="")
    except Investigation as error:
        payload = compact({"method": "OCCUPIED_DENSITY_INVESTIGATION_V1", "status": "INVESTIGATION", "reason": str(error), "row": error.row,
                           "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"})
        if len(payload.encode()) <= diagnostic_cap:
            print(payload, end="")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
