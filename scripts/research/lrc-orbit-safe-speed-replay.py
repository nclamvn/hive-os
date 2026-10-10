"""TIP-072Q: bounded unsigned offline Fraction diagnostic, no authority.

Fixed d5/e5, 13/14 actual moving speeds only. UNKNOWN is a failed sufficient
gate, never an LRC refutation. CLI accepts no input, options, or paths.
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
MAX_MS, MAX_OPERATIONS, MAX_BYTES = 5000, 2000000, 32768
MAX_SPEED = 10**12
SCOPE = {
    "localUnsigned": True, "retainedAgentResult": False,
    "agentLoop": "NOT_RUN", "executionAuthority": False,
    "wholeAllikvereBranch": "NOT_ESTABLISHED", "global": "NOT_ESTABLISHED",
    "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
    "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
    "boundedRatioCoreIsFinite": False, "genericStrictSlack": False,
    "targets": "13_MOVING_14_TOTAL_AND_14_MOVING_15_TOTAL_ONLY",
}


class Refused(ValueError):
    """Constant fail-closed reason; refusal carries no positive evidence."""


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
    if type(raw) is not dict or len(raw) != 3 or any(type(k) is not str for k in raw) or set(raw) != {"label", "speeds", "tau"}:
        raise Refused("INPUT_REFUSED")
    label, speeds, tau = (raw[k] for k in ("label", "speeds", "tau"))
    if type(label) is not str or re.fullmatch(r"[A-Za-z0-9_-]{1,80}", label) is None:
        raise Refused("INPUT_REFUSED")
    if type(speeds) is not list or len(speeds) not in (13, 14):
        raise Refused("INPUT_REFUSED")
    if any(type(v) is not int or not 1 <= v <= MAX_SPEED for v in speeds) or len(set(speeds)) != len(speeds):
        raise Refused("INPUT_REFUSED")
    if type(tau) is not list or len(tau) != 2 or any(type(v) is not str or len(v) > 79 for v in tau):
        raise Refused("INPUT_REFUSED")
    if re.fullmatch(r"0|-?[1-9][0-9]*", tau[0]) is None or re.fullmatch(r"[1-9][0-9]*", tau[1]) is None:
        raise Refused("INPUT_REFUSED")
    n, den = int(tau[0]), int(tau[1])
    if abs(n).bit_length() > 256 or den.bit_length() > 256 or gcd(n, den) != 1:
        raise Refused("INPUT_REFUSED")
    lower = [i for i, v in enumerate(speeds) if v % 5 == 0]
    exceptions = [i for i, v in enumerate(speeds) if v % 5 != 0]
    if len(lower) != len(speeds)-5 or len(exceptions) != 5:
        raise Refused("PREMISE_REFUSED")
    work.charge(len(speeds))
    return label, list(speeds), work.q(Fraction(n, den)), lower, exceptions


def nearest_safe(v, star, eta, work):
    """Exact d5 orbit geometry. Center ties go to the LOWER boundary."""
    if type(v) is not int or not 1 <= v <= MAX_SPEED or v % 5 == 0:
        raise Refused("PREMISE_REFUSED")
    star, eta = work.q(star), work.q(eta)
    if not 0 < 2*eta < Fraction(1, 5):
        raise Refused("PREMISE_REFUSED")
    phase = work.q(5*v*star)
    lo = phase.numerator // phase.denominator
    n = lo if phase-lo <= Fraction(1, 2) else lo+1
    offset, beta = work.q(phase-n), distance(phase, work)
    safe_distance = work.q(max(Fraction(0), 5*eta-beta)/(5*v))
    boundary = None
    safe = star
    if beta < 5*eta:
        # Positive offset chooses upper boundary; zero/negative chooses lower.
        boundary = work.q((Fraction(n)+ (5*eta if offset > 0 else -5*eta))/(5*v))
        safe = boundary
    adjustment = work.q(safe-star)
    if abs(adjustment) != safe_distance or distance(work.q(5*v*safe), work) < 5*eta:
        raise Refused("INVARIANT_REFUSED")
    return phase, beta, n, boundary, safe, adjustment, safe_distance


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
    label, speeds, tau, lower, exceptions = parse_input(raw, work)
    count = len(speeds)
    L, eta = work.q(Fraction(1, count-4)), work.q(Fraction(1, count+1))
    reduced = [speeds[i]//5 for i in lower]
    lower_distances = [distance(work.q(tau*v), work) for v in reduced]
    if min(lower_distances) < L:
        raise Refused("LOWER_WITNESS_REFUSED")
    U = max(speeds[i] for i in lower)
    selected = max(exceptions, key=lambda i: speeds[i])
    V, star = speeds[selected], work.q(tau/5)
    radius = work.q((L-eta)/U)
    phase, beta, nearest, boundary, safe, adjustment, safe_distance = nearest_safe(V, star, eta, work)
    speed_gate, phase_gate = V*radius >= eta, safe_distance <= radius
    original = grid(speeds, exceptions, selected, star, eta, work)
    adjusted = None
    if phase_gate:
        if abs(adjustment) > radius or any(distance(work.q(speeds[i]*safe), work) < eta for i in lower):
            raise Refused("INVARIANT_REFUSED")
        adjusted = grid(speeds, exceptions, selected, safe, eta, work)
        if any(distance(work.q(V*(safe+Fraction(j, 5))), work) < eta for j in range(5)):
            raise Refused("INVARIANT_REFUSED")
        if any(len(row) > 1 for row in adjusted["exceptionBadIndices"]) or not adjusted["goodShiftIndices"]:
            raise Refused("INVARIANT_REFUSED")
        if adjusted["exceptionBadIndices"][exceptions.index(selected)]:
            raise Refused("INVARIANT_REFUSED")
    if speed_gate and not phase_gate:
        raise Refused("INVARIANT_REFUSED")
    context = {"movingCount": count, "totalCount": count+1, "d": 5, "exceptionCount": 5,
               "speeds": speeds, "coordinateLabels": list(range(count)), "divisibleIndices": lower,
               "exceptionIndices": exceptions, "reducedSpeeds": reduced,
               "integerGcd": reduce(gcd, speeds), "tau": wire(tau),
               "lowerDistances": [wire(q) for q in lower_distances],
               "lowerWitnessMargin": wire(min(lower_distances)), "L": wire(L), "eta": wire(eta),
               "U": U, "V": V, "selectedExceptionLabel": selected, "tStar": wire(star),
               "radius": wire(radius), "speedOnlyRatioThreshold": wire(work.q(eta/(L-eta))),
               "orbitPhase": wire(phase), "orbitBeta": wire(beta), "nearestInteger": nearest,
               "nearestBoundary": wire(boundary) if boundary is not None else None,
               "nearestSafeBase": wire(safe), "candidateAdjustment": wire(adjustment),
               "nearestSafeDistance": wire(safe_distance), "initiallyOrbitSafe": beta >= 5*eta,
               "speedGateHolds": speed_gate, "phaseGateHolds": phase_gate,
               "adjustedBase": wire(safe) if phase_gate else None,
               "actualAdjustment": wire(adjustment) if phase_gate else None}
    return {"label": label, "status": "CHECKED_ORBIT_SAFE_WITNESS" if phase_gate else "UNKNOWN_GATE_NOT_APPLICABLE",
            "context": context, "originalGrid": original, "adjustedGrid": adjusted,
            "scope": dict(SCOPE)}


def bounded_json(value, work):
    def visit(item, depth=0):
        work.charge()
        if depth > 12:
            raise Refused("OUTPUT_REFUSED")
        if type(item) is dict:
            if len(item) > 40 or any(type(k) is not str for k in item):
                raise Refused("OUTPUT_REFUSED")
            for child in item.values():
                visit(child, depth+1)
        elif type(item) is list:
            if len(item) > 40:
                raise Refused("OUTPUT_REFUSED")
            for child in item:
                visit(child, depth+1)
        elif type(item) is float:
            if not isfinite(item) or abs(item) > MAX_MS:
                raise Refused("OUTPUT_REFUSED")
        elif type(item) not in (str, int, bool, type(None)):
            raise Refused("OUTPUT_REFUSED")
        elif type(item) is str and len(item) > 256:
            raise Refused("OUTPUT_REFUSED")
    visit(value)
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False)
    work.charge(len(encoded))
    if len(encoded.encode("ascii"))+1 > MAX_BYTES:
        raise Refused("OUTPUT_REFUSED")
    return encoded


def derive_certificate(raw, limits=None):
    work = Work(limits)
    result = _derive_certificate(raw, work)
    bounded_json(result, work)
    return result


def fixed_inputs():
    rows = ([1, 2, 3, 7, 91], [1001, 1011, 1021, 1031, 1041],
            [1, 2, 3, 7, 89], [1, 2, 3, 7, 104], [1, 2, 3, 7, 99],
            [1, 2, 3, 7, 11], [73, 78, 83, 88, 93], [1, 2, 3, 7, 11])
    labels = ("high_mixed", "hostile_same_residue_cluster", "below_dominance_phase_success",
              "already_orbit_safe", "negative_adjustment", "unknown15_observed_witness",
              "target14_same_residue_cluster", "unknown14_observations")
    return [{"label": label, "speeds": list(range(5, 46 if i < 6 else 41, 5))+list(row),
             "tau": ["1", "10" if i < 6 else "9"]} for i, (label, row) in enumerate(zip(labels, rows))]


def _build_fixed_payload(limits=None):
    work = Work(limits)
    cases = [_derive_certificate(raw, work) for raw in fixed_inputs()]
    accepted = sum(case["adjustedGrid"] is not None for case in cases)
    coordinates = sum(5*case["context"]["movingCount"]*(1+(case["adjustedGrid"] is not None)) for case in cases)
    if len(cases) != 8 or accepted != 6 or coordinates != 965 or cases[1]["originalGrid"]["goodShiftIndices"]:
        raise Refused("INVARIANT_REFUSED")
    body = {"version": "LRC_ORBIT_SAFE_SPEED_V1", "cases": cases, "scope": dict(SCOPE),
            "counts": {"cases": 8, "phaseGateAccepted": accepted, "unknownGate": 2,
                       "originalMatrices": 8, "adjustedMatrices": accepted,
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
