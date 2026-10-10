"""TIP-072S bounded unsigned full-period replay; never scientific admission."""
from fractions import Fraction
from functools import reduce
from hashlib import sha256
from math import gcd, isfinite
import json
import os
import re
import sys
from time import monotonic

FLAGS = ("RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED")
MAX_MS, MAX_OPERATIONS, MAX_BYTES, MAX_SPEED = 5000, 2000000, 32768, 10**12
SCOPE = {"localUnsigned": True, "retainedAgentResult": False, "agentLoop": "NOT_RUN",
         "executionAuthority": False, "wholeAllikvereBranch": "NOT_ESTABLISHED",
         "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
         "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
         "genericStrictSlack": False, "writtenTheoremHasSpeedCap": False,
         "primitiveStrataAreAbsoluteFiniteReduction": False,
         "targets": "13_MOVING_14_TOTAL_AND_14_MOVING_15_TOTAL_ONLY"}
COLUMNS = ["label", "v", "h", "q", "alpha", "r", "gapCoordinate", "nearestInteger",
           "offset", "beta", "D", "delta", "primaryOnlyD", "actualSpeedThreshold",
           "automatic", "speedGate", "phaseGate", "primaryGate"]


class Refused(ValueError):
    """Constant fail-closed reason with no positive evidence."""


class Work:
    def __init__(self, limits=None):
        if limits is None:
            limits = {"maxMs": MAX_MS, "maxOperations": MAX_OPERATIONS}
        if type(limits) is not dict or len(limits) != 2 or any(type(k) is not str for k in limits) or set(limits) != {"maxMs", "maxOperations"}:
            raise Refused("INPUT_REFUSED")
        if any(type(v) is not int for v in limits.values()):
            raise Refused("INPUT_REFUSED")
        if not 1 <= limits["maxMs"] <= MAX_MS or not 1 <= limits["maxOperations"] <= MAX_OPERATIONS:
            raise Refused("INPUT_REFUSED")
        self.start = monotonic()
        self.deadline = self.start+limits["maxMs"]/1000
        self.limit, self.operations = limits["maxOperations"], 0

    def charge(self, amount=1):
        self.operations += amount
        if self.operations > self.limit or monotonic() >= self.deadline:
            raise Refused("RESOURCE_REFUSED")

    def q(self, value):
        self.charge()
        if type(value) not in (int, Fraction):
            raise Refused("INPUT_REFUSED")
        value = Fraction(value)
        if abs(value.numerator).bit_length() > 256 or value.denominator.bit_length() > 256:
            raise Refused("COMPONENT_REFUSED")
        return value


def wire(q):
    return [str(q.numerator), str(q.denominator)]


def distance(x, work):
    x = work.q(x % 1)
    return work.q(min(x, 1-x))


def parse_input(raw, work):
    if type(raw) is not dict or len(raw) != 3 or any(type(k) is not str for k in raw) or set(raw) != {"label", "speeds", "tau"}:
        raise Refused("INPUT_REFUSED")
    label, speeds, tau = (raw[k] for k in ("label", "speeds", "tau"))
    if type(label) is not str or re.fullmatch(r"[A-Za-z0-9_-]{1,80}", label) is None:
        raise Refused("INPUT_REFUSED")
    if type(speeds) is not list or len(speeds) not in (13, 14):
        raise Refused("INPUT_REFUSED")
    if any(type(v) is not int or not 1 <= v <= MAX_SPEED for v in speeds) or len(set(speeds)) != len(speeds):
        raise Refused("INPUT_REFUSED")
    if type(tau) is not list or len(tau) != 2 or any(type(s) is not str or len(s) > 79 for s in tau):
        raise Refused("INPUT_REFUSED")
    if re.fullmatch(r"0|-?[1-9][0-9]*", tau[0]) is None or re.fullmatch(r"[1-9][0-9]*", tau[1]) is None:
        raise Refused("INPUT_REFUSED")
    num, den = int(tau[0]), int(tau[1])
    work.charge(256**2)
    if abs(num).bit_length() > 256 or den.bit_length() > 256 or gcd(num, den) != 1:
        raise Refused("INPUT_REFUSED")
    lower = [i for i, v in enumerate(speeds) if v % 5 == 0]
    exceptions = [i for i, v in enumerate(speeds) if v % 5 != 0]
    if len(lower) != len(speeds)-5 or len(exceptions) != 5:
        raise Refused("PREMISE_REFUSED")
    work.charge(len(speeds))
    return label, list(speeds), work.q(Fraction(num, den)), lower, exceptions


def candidate(v, label, g, star, eta, L, U, work):
    if type(v) is not int or not 1 <= v <= MAX_SPEED or v % 5 == 0 or type(g) is not int or not 1 <= g <= MAX_SPEED:
        raise Refused("PREMISE_REFUSED")
    star, eta, L = work.q(star), work.q(eta), work.q(L)
    if not 0 < 10*eta < 1 or L < eta or type(U) is not int or not 1 <= U <= MAX_SPEED:
        raise Refused("PREMISE_REFUSED")
    work.charge(max(v.bit_length(), g.bit_length())**2)
    h, rho = gcd(v, g), work.q(5*eta)
    q = g//h
    alpha = work.q(5*v*star)
    r = work.q(max(Fraction(0), rho-Fraction(q-1, 2*q)))
    z = work.q(q*alpha-Fraction(q+1, 2))
    floor = z.numerator//z.denominator
    nearest = floor if z-floor <= Fraction(1, 2) else floor+1
    offset, beta = work.q(z-nearest), work.q(distance(z, work)/q)
    D = work.q(max(Fraction(0), r-beta)/(5*v))
    delta = D if offset > 0 else -D
    if D == 0:
        delta = Fraction(0)
    radius = work.q((L-eta)/U)
    primary = work.q(max(Fraction(0), rho-distance(alpha, work))/(5*v))
    threshold = Fraction(0) if r == 0 else work.q(r*U/(5*(L-eta))) if L > eta else None
    automatic = q*(1-2*rho) >= 1
    speed_gate = r == 0 or (L > eta and v >= threshold)
    phase_gate = D <= radius
    if automatic != (r == 0) or speed_gate and not phase_gate:
        raise Refused("INVARIANT_REFUSED")
    row = [label, v, h, q, wire(alpha), wire(r), wire(z), nearest, wire(offset), wire(beta),
           wire(D), wire(delta), wire(primary), wire(threshold) if threshold is not None else None,
           automatic, speed_gate, phase_gate, primary <= radius]
    return D, delta, row


def secondary(v, g, base, eta, work):
    work.charge(max(v.bit_length(), g.bit_length())**2)
    h, rho = gcd(v, g), work.q(5*eta)
    q = g//h
    fraction = work.q((5*v*base) % 1)
    raw = work.q(q*(rho-fraction))
    k = -(-raw.numerator//raw.denominator)
    kmod = k % q
    inverse = None
    ell = 0
    if q > 1:
        # Both operands have <=40 bits under the actual speed cap. Reserve
        # conservative Euclidean/inverse bit work BEFORE native pow, not q steps.
        work.charge(2*max((v//h).bit_length(), q.bit_length())**2)
        inverse = pow(v//h, -1, q)
        ell = (inverse*kmod) % q
    shift = work.q(Fraction(ell, 5*g))
    safe = work.q(base+shift)
    phase = work.q((5*v*safe) % 1)
    if not rho <= phase <= 1-rho or not 0 <= ell < q:
        raise Refused("INVARIANT_REFUSED")
    return safe, {"rawCeilK": k, "kModQ": kmod, "inverse": inverse, "ell": ell,
                  "secondaryTime": wire(shift), "adjustedBeforeSecondary": wire(base),
                  "orbitSafeBase": wire(safe), "orbitSafePhase": wire(phase)}


def grid(speeds, exceptions, selected, base, eta, work):
    times = [work.q(base+Fraction(j, 5)) for j in range(5)]
    matrix = [[distance(work.q(v*t), work) for v in speeds] for t in times]
    bad = [[j for j in range(5) if matrix[j][i] < eta] for i in exceptions]
    good = [j for j in range(5) if min(matrix[j]) >= eta]
    witness = None
    if good:
        j = good[0]
        witness = {"lowestPhysicalShift": j, "finalTime": wire(times[j]),
                   "coordinateDistances": [wire(q) for q in matrix[j]], "minimumDistance": wire(min(matrix[j]))}
    work.charge(5*len(speeds)+25)
    return {"baseTime": wire(base), "distanceMatrix": [[wire(q) for q in row] for row in matrix],
            "exceptionBadIndices": bad, "exceptionBadUnion": sorted({j for row in bad for j in row}),
            "selectedAllShiftDistances": [wire(matrix[j][selected]) for j in range(5)],
            "goodShiftIndices": good, "observedWitness": witness}


def _derive_certificate(raw, work):
    label, speeds, tau, lower, exceptions = parse_input(raw, work)
    n = len(speeds)
    eta, star = work.q(Fraction(1, n+1)), work.q(tau/5)
    reduced = [speeds[i]//5 for i in lower]
    lower_distances = [distance(work.q(v*tau), work) for v in reduced]
    L = min(lower_distances)
    if L < eta:
        raise Refused("LOWER_WITNESS_REFUSED")
    work.charge((n+len(lower))*40**2)
    g, H, U = reduce(gcd, reduced), reduce(gcd, speeds), max(speeds[i] for i in lower)
    if g % H or gcd(H, 5) != 1:
        raise Refused("INVARIANT_REFUSED")
    radius = work.q((L-eta)/U)
    candidates = [candidate(speeds[i], i, g, star, eta, L, U, work) for i in exceptions]
    D, delta, row = min(candidates, key=lambda item: (item[0], item[2][0]))
    selected, V = row[0], row[1]
    original = grid(speeds, exceptions, selected, star, eta, work)
    adjusted, step = None, None
    accepted = D <= radius
    if accepted:
        perturbed = work.q(star+delta)
        if abs(delta) > radius or any(distance(work.q(speeds[i]*perturbed), work) < eta for i in lower):
            raise Refused("INVARIANT_REFUSED")
        safe, step = secondary(V, g, perturbed, eta, work)
        adjusted = grid(speeds, exceptions, selected, safe, eta, work)
        if adjusted["exceptionBadIndices"][exceptions.index(selected)] or any(len(bad) > 1 for bad in adjusted["exceptionBadIndices"]) or not adjusted["goodShiftIndices"]:
            raise Refused("INVARIANT_REFUSED")
        if any(distance(work.q(speeds[i]*safe), work) < eta for i in lower):
            raise Refused("INVARIANT_REFUSED")
    context = {"movingCount": n, "totalCount": n+1, "d": 5, "exceptionCount": 5,
               "speeds": speeds, "coordinateLabels": list(range(n)), "divisibleIndices": lower,
               "exceptionIndices": exceptions, "reducedSpeeds": reduced, "tau": wire(tau),
               "lowerDistances": [wire(x) for x in lower_distances], "L": wire(L), "eta": wire(eta),
               "U": U, "g": g, "H": H, "gPrime": g//H, "tStar": wire(star), "radius": wire(radius),
               "candidateColumns": list(COLUMNS), "candidateRows": [item[2] for item in candidates],
               "selectedExceptionLabel": selected, "actualAdjustment": wire(delta) if accepted else None,
               "secondary": step, "phaseGateHolds": accepted}
    return {"label": label, "status": "CHECKED_FULL_PERIOD_WITNESS" if accepted else "UNKNOWN_PERIOD_GATE",
            "context": context, "originalGrid": original, "adjustedGrid": adjusted, "scope": dict(SCOPE)}


def bounded_json(value, work):
    size = 0

    def add(amount):
        nonlocal size
        size += amount
        if size+1 > MAX_BYTES:
            raise Refused("OUTPUT_REFUSED")

    def visit(item, depth=0):
        work.charge()
        if depth > 12:
            raise Refused("OUTPUT_REFUSED")
        if type(item) is dict:
            if len(item) > 40 or any(type(k) is not str for k in item):
                raise Refused("OUTPUT_REFUSED")
            add(2+max(0, len(item)-1)+len(item))
            for key, child in item.items():
                if len(key) > 256:
                    raise Refused("OUTPUT_REFUSED")
                add(len(json.dumps(key, ensure_ascii=True)))
                visit(child, depth+1)
        elif type(item) is list:
            if len(item) > 40:
                raise Refused("OUTPUT_REFUSED")
            add(2+max(0, len(item)-1))
            for child in item:
                visit(child, depth+1)
        elif type(item) is float:
            if not isfinite(item) or abs(item) > MAX_MS:
                raise Refused("OUTPUT_REFUSED")
            add(len(json.dumps(item, allow_nan=False)))
        elif type(item) not in (str, int, bool, type(None)):
            raise Refused("OUTPUT_REFUSED")
        elif type(item) is str:
            if len(item) > 256:
                raise Refused("OUTPUT_REFUSED")
            add(len(json.dumps(item, ensure_ascii=True)))
        elif type(item) is int:
            if abs(item).bit_length() > 256:
                raise Refused("OUTPUT_REFUSED")
            add(len(str(item)))
        elif type(item) is bool:
            add(4 if item else 5)
        else:
            add(4)
    visit(value)
    work.charge(size)
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False)
    if len(encoded.encode("ascii")) != size:
        raise Refused("OUTPUT_REFUSED")
    return encoded


def derive_certificate(raw, limits=None):
    work = Work(limits)
    result = _derive_certificate(raw, work)
    bounded_json(result, work)
    return result


def fixed_inputs():
    g = 1000000007
    cases = (
        ("q2_actual_margin_improvement", [10*i for i in [1,3,5,6,7,8,9,10,11]], [1,3,4,8,37], ["5","21"]),
        ("target14_q2_tight_lower", [10*i for i in range(1,9)], [2,3,4,6,21], ["1","18"]),
        ("target14_q3_tight_lower", [15*i for i in [1,3,4,5,7,9,11,13]], [6,12,18,24,34], ["19","108"]),
        ("q3_hostile_original_cover", [15*i for i in range(1,10)], [1,24,22,23,21], ["1","30"]),
        ("target14_q4_hostile_cover", [20*i for i in range(1,9)], [1,29,27,28,26], ["1","36"]),
        ("huge_q_max_speed_trap", [5*g*i for i in range(1,10)], [1,2,4,7,2*g], ["1",str(10*g)]),
        ("unknown_primary_core", [5*i for i in range(1,10)], [1,2,3,7,11], ["1","10"]),
    )
    return [{"label": label, "speeds": lo+ex, "tau": tau} for label, lo, ex, tau in cases]


def _build_fixed_payload(limits=None):
    work = Work(limits)
    cases = [_derive_certificate(raw, work) for raw in fixed_inputs()]
    accepted = sum(case["adjustedGrid"] is not None for case in cases)
    coords = sum(5*case["context"]["movingCount"]*(1+(case["adjustedGrid"] is not None)) for case in cases)
    if len(cases) != 7 or accepted != 6 or coords != 880 or any(cases[i]["originalGrid"]["goodShiftIndices"] for i in (3,4)):
        raise Refused("INVARIANT_REFUSED")
    # Deduplicate definitions, never arithmetic data. Standalone certificates
    # remain self-contained; fixed-report refs resolve to the two body fields.
    for case in cases:
        del case["scope"]
        case["scopeRef"] = "body.scope"
        del case["context"]["candidateColumns"]
        case["context"]["candidateColumnsRef"] = "body.candidateColumns"
    body = {"version": "LRC_FULL_PERIOD_V1", "cases": cases, "scope": dict(SCOPE), "candidateColumns": list(COLUMNS),
            "counts": {"cases": 7, "accepted": accepted, "unknown": 1, "originalMatrices": 7,
                       "adjustedMatrices": 6, "retainedMatrixCoordinates": coords, "lowerDistances": 60}}
    canonical = bounded_json(body, work)
    report = {**body, "semanticDigest": sha256(canonical.encode("ascii")).hexdigest(), "metrics": {}}
    bounded_json(report, work)
    work.charge(MAX_BYTES+4096)
    report["metrics"] = {"chargedOperations": work.operations, "elapsedMs": round((monotonic()-work.start)*1000, 6)}
    encoded = json.dumps(report, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False)
    if len(encoded.encode("ascii"))+1 > MAX_BYTES or monotonic() >= work.deadline:
        raise Refused("RESOURCE_REFUSED")
    return report, encoded, work.deadline


def build_fixed_report(limits=None):
    return _build_fixed_payload(limits)[0]


def main():
    if len(sys.argv) != 1 or any(os.environ.get(flag) != "false" for flag in FLAGS):
        raise Refused("CLI_REFUSED")
    _, encoded, deadline = _build_fixed_payload()
    if monotonic() >= deadline:
        raise Refused("RESOURCE_REFUSED")
    sys.stdout.write(encoded+"\n")


if __name__ == "__main__":
    try:
        main()
    except Refused as error:
        sys.stderr.write(str(error)+"\n")
        sys.exit(1)
