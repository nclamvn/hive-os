"""TIP-072R: unsigned bounded offline exact arithmetic, never admission.

The written theorem has no speed cap. This diagnostic is restricted to d5/e5,
13/14 actual moving speeds <=10^12. CLI has eight frozen cases, no input.
"""
from fractions import Fraction
from functools import reduce
from hashlib import sha256
from math import gcd, isfinite
import json
import os
import re
import sys
from time import monotonic

FLAGS = (
    "RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED",
    "LRC_CAMPAIGN_LOCAL_ENABLED", "RESEARCH_OPENAI_ENABLED",
    "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED",
)
MAX_MS, MAX_OPERATIONS, MAX_BYTES, MAX_SPEED = 5000, 2000000, 32768, 10**12
SCOPE = {
    "localUnsigned": True, "retainedAgentResult": False,
    "agentLoop": "NOT_RUN", "executionAuthority": False,
    "wholeAllikvereBranch": "NOT_ESTABLISHED", "global": "NOT_ESTABLISHED",
    "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
    "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
    "genericStrictSlack": False, "ratioConstantIsOptimal": False,
    "writtenTheoremHasSpeedCap": False, "complements072QNotSuperset": True,
    "targets": "13_MOVING_14_TOTAL_AND_14_MOVING_15_TOTAL_ONLY",
}


class Refused(ValueError):
    """A constant fail-closed refusal, no positive evidence."""


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
        self.deadline = self.start + limits["maxMs"] / 1000
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


def distance(q, work):
    q = work.q(q % 1)
    return work.q(min(q, 1-q))


def parse_input(raw, work):
    if type(raw) is not dict or len(raw) != 2 or any(type(k) is not str for k in raw) or set(raw) != {"label", "speeds"}:
        raise Refused("INPUT_REFUSED")
    label, speeds = raw["label"], raw["speeds"]
    if type(label) is not str or re.fullmatch(r"[A-Za-z0-9_-]{1,80}", label) is None:
        raise Refused("INPUT_REFUSED")
    if type(speeds) is not list or len(speeds) not in (13, 14):
        raise Refused("INPUT_REFUSED")
    if any(type(v) is not int or not 1 <= v <= MAX_SPEED for v in speeds) or len(set(speeds)) != len(speeds):
        raise Refused("INPUT_REFUSED")
    lower = [i for i, v in enumerate(speeds) if v % 5 == 0]
    exceptions = [i for i, v in enumerate(speeds) if v % 5 != 0]
    if len(lower) != len(speeds)-5 or len(exceptions) != 5:
        raise Refused("PREMISE_REFUSED")
    work.charge(len(speeds))
    return label, list(speeds), lower, exceptions


def right_safe(v, star, eta, work):
    """Orbit-safe right endpoint; center ties RIGHT, unlike 072Q."""
    if type(v) is not int or not 1 <= v <= MAX_SPEED or v % 5 == 0:
        raise Refused("PREMISE_REFUSED")
    star, eta = work.q(star), work.q(eta)
    if not 0 < 2*eta < Fraction(1, 5):
        raise Refused("PREMISE_REFUSED")
    phase = work.q(5*v*star)
    floor = phase.numerator // phase.denominator
    nearest = floor if phase-floor <= Fraction(1, 2) else floor+1
    beta = distance(phase, work)
    boundary, safe = None, star
    if beta < 5*eta:
        boundary = work.q((Fraction(nearest)+5*eta)/(5*v))
        safe = boundary
    move = work.q(safe-star)
    if not 0 <= move <= 2*eta/v or distance(work.q(5*v*safe), work) < 5*eta:
        raise Refused("INVARIANT_REFUSED")
    return phase, beta, nearest, boundary, safe, move


def grid(speeds, exceptions, selected, base, eta, work):
    times = [work.q(base+Fraction(j, 5)) for j in range(5)]
    matrix = [[distance(work.q(v*t), work) for v in speeds] for t in times]
    bad = [[j for j in range(5) if matrix[j][i] < eta] for i in exceptions]
    good = [j for j in range(5) if min(matrix[j]) >= eta]
    witness = None
    if good:
        j = good[0]
        witness = {"lowestPhysicalShift": j, "finalTime": wire(times[j]),
                   "coordinateDistances": [wire(q) for q in matrix[j]],
                   "minimumDistance": wire(min(matrix[j]))}
    work.charge(5*len(speeds)+25)
    return {"baseTime": wire(base), "distanceMatrix": [[wire(q) for q in row] for row in matrix],
            "exceptionBadIndices": bad, "exceptionBadUnion": sorted({j for row in bad for j in row}),
            "selectedAllShiftDistances": [wire(matrix[j][selected]) for j in range(5)],
            "goodShiftIndices": good, "observedWitness": witness}


def _derive_certificate(raw, work):
    label, speeds, lower, exceptions = parse_input(raw, work)
    n = len(speeds)
    eta = work.q(Fraction(1, n+1))
    m, U = min(speeds[i] for i in lower), max(speeds[i] for i in lower)
    selected = max(exceptions, key=lambda i: speeds[i])
    V = speeds[selected]
    B = work.q(m*(1-5*eta)/(5*eta))
    C = work.q((1-5*eta)*(1-eta)/(eta*(1+5*eta)))
    ratio = work.q(Fraction(U, m))
    premise = ratio <= C
    left, right = work.q(eta/m), work.q((1-eta)/U)
    width = work.q(right-left)
    H = work.q(2*eta/width) if width > 0 else None
    overlap = H is not None and H <= B
    gap = [wire(B), wire(H)] if H is not None and H > B else None
    phase, beta, nearest, boundary, safe, move = right_safe(V, left, eta, work)
    original = grid(speeds, exceptions, selected, left, eta, work)
    branch, adjusted, final = "UNKNOWN", None, None
    adjustment, adjusted_base = None, None
    if premise:
        if not overlap or C >= (1-eta)/eta or width <= 0:
            raise Refused("INVARIANT_REFUSED")
        if V <= B:
            branch, adjustment = "LOW_ALL_NONZERO_SHIFTS", Fraction(0)
            if not all(j in original["goodShiftIndices"] for j in (1, 2, 3, 4)):
                raise Refused("INVARIANT_REFUSED")
            final = original["observedWitness"]
        else:
            branch, adjustment, adjusted_base = "HIGH_ORBIT_SAFE", move, safe
            if not left <= safe <= right or not 2*eta/V < width:
                raise Refused("INVARIANT_REFUSED")
            adjusted = grid(speeds, exceptions, selected, safe, eta, work)
            if adjusted["exceptionBadIndices"][exceptions.index(selected)] or any(len(row) > 1 for row in adjusted["exceptionBadIndices"]):
                raise Refused("INVARIANT_REFUSED")
            if any(distance(work.q(speeds[i]*safe), work) < eta for i in lower):
                raise Refused("INVARIANT_REFUSED")
            final = adjusted["observedWitness"]
        if final is None:
            raise Refused("INVARIANT_REFUSED")
    context = {"movingCount": n, "totalCount": n+1, "d": 5, "exceptionCount": 5,
               "speeds": speeds, "coordinateLabels": list(range(n)), "divisibleIndices": lower,
               "exceptionIndices": exceptions, "integerGcd": reduce(gcd, speeds),
               "eta": wire(eta), "m": m, "U": U, "V": V, "B": wire(B), "C": wire(C),
               "actualRatio": wire(ratio), "ratioPremise": premise, "t0": wire(left),
               "intervalLeft": wire(left), "intervalRight": wire(right), "intervalWidth": wire(width),
               "exactHighThreshold": wire(H) if H is not None else None, "tailOverlapsLow": overlap,
               "uncoveredGapOpen": gap, "selectedExceptionLabel": selected, "orbitPhase": wire(phase),
               "orbitBeta": wire(beta), "nearestInteger": nearest,
               "rightBoundary": wire(boundary) if boundary is not None else None,
               "branch": branch, "actualAdjustment": wire(adjustment) if adjustment is not None else None,
               "adjustedBase": wire(adjusted_base) if adjusted_base is not None else None}
    return {"label": label,
            "status": "CHECKED_CLUSTERED_LOWER_WITNESS" if premise else "UNKNOWN_RATIO_NOT_APPLICABLE",
            "context": context, "originalGrid": original, "adjustedGrid": adjusted,
            "finalWitness": final, "scope": dict(SCOPE)}


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
        elif type(item) is str and len(item) > 256:
            raise Refused("OUTPUT_REFUSED")
        elif type(item) is str:
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
    # Whole tree size and serialization work are reserved BEFORE serialization.
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
    lower14 = [10, 15, 20, 25, 30, 35, 40, 45, 70]
    lower13 = [95, 100, 105, 110, 115, 120, 125, 585]
    rows = (
        ("ratio_equality_low", lower14, [1, 2, 3, 4, 19]),
        ("ratio_equality_high_right", lower14, [1, 2, 3, 4, 21]),
        ("variable_lower_same_residue", list(range(45, 86, 5)), [1001, 1011, 1021, 1031, 1041]),
        ("high_already_orbit_safe", list(range(50, 91, 5)), [1, 2, 3, 7, 201]),
        ("target14_ratio_and_low_equality", lower13, [1, 2, 3, 4, 171]),
        ("target14_high_right", lower13, [1, 2, 3, 4, 172]),
        ("unknown_old_progression_ratio9", list(range(5, 46, 5)), [1, 2, 3, 7, 11]),
        ("unknown_target14_ratio8", list(range(5, 41, 5)), [1, 2, 3, 7, 11]),
    )
    return [{"label": label, "speeds": list(lower)+list(ex)} for label, lower, ex in rows]


def _build_fixed_payload(limits=None):
    work = Work(limits)
    cases = [_derive_certificate(raw, work) for raw in fixed_inputs()]
    accepted = sum(case["finalWitness"] is not None for case in cases)
    adjusted = sum(case["adjustedGrid"] is not None for case in cases)
    coordinates = sum(5*case["context"]["movingCount"]*(1+(case["adjustedGrid"] is not None)) for case in cases)
    if len(cases) != 8 or accepted != 6 or adjusted != 4 or coordinates != 820:
        raise Refused("INVARIANT_REFUSED")
    body = {"version": "LRC_CLUSTERED_LOWER_V1", "cases": cases, "scope": dict(SCOPE),
            "counts": {"cases": 8, "accepted": accepted, "lowBranch": 2, "highBranch": 4,
                       "unknownRatio": 2, "originalMatrices": 8, "adjustedMatrices": adjusted,
                       "retainedMatrixCoordinates": coordinates}}
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
