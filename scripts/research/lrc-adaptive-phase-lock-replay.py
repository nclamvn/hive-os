"""TIP-072P: bounded, unsigned offline Fraction diagnostic; no execution authority.

This is a fixed 14-speed/d5/e5/r2 research helper, not an LRC decision oracle.
UNKNOWN means the sufficient phase gate failed, never a mathematical failure.
The CLI has no input/path/speed options and reads only its six execution flags.
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
MAX_MS = 5000
MAX_OPERATIONS = 2000000
MAX_BYTES = 32768
MAX_SPEED = 10**12
SCOPE = {
    "localUnsigned": True, "retainedAgentResult": False,
    "agentLoop": "NOT_RUN", "executionAuthority": False,
    "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED",
    "external": "NOT_ESTABLISHED", "novelty": "NOT_ESTABLISHED",
    "wholeAllikvereBranch": "NOT_ESTABLISHED",
    "target": "14_MOVING_15_TOTAL_ONLY", "samplingIsUniversalProof": False,
}


class Refused(ValueError):
    """Constant, non-sensitive fail-closed reason; no positive evidence on failure."""


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
        self.limit = limits["maxOperations"]
        self.operations = 0

    def charge(self, amount=1):
        self.operations += amount
        if self.operations > self.limit or monotonic() >= self.deadline:
            raise Refused("RESOURCE_REFUSED")

    def q(self, value):
        self.charge()
        if not isinstance(value, Fraction):
            value = Fraction(value)
        if abs(value.numerator).bit_length() > 256 or value.denominator.bit_length() > 256:
            raise Refused("COMPONENT_REFUSED")
        return value


def wire(q):
    return [str(q.numerator), str(q.denominator)]


def distance(q, work):
    x = work.q(q % 1)
    return work.q(min(x, 1 - x))


def parse_input(raw, work):
    if type(raw) is not dict or len(raw) != 4 or any(type(k) is not str for k in raw) or set(raw) != {"label", "speeds", "pairLabels", "tau"}:
        raise Refused("INPUT_REFUSED")
    label, speeds, pair, tau = (raw[k] for k in ("label", "speeds", "pairLabels", "tau"))
    if type(label) is not str or re.fullmatch(r"[A-Za-z0-9_-]{1,80}", label) is None:
        raise Refused("INPUT_REFUSED")
    if type(speeds) is not list or len(speeds) != 14:
        raise Refused("INPUT_REFUSED")
    if any(type(v) is not int or not 1 <= v <= MAX_SPEED for v in speeds) or len(set(speeds)) != 14:
        raise Refused("INPUT_REFUSED")
    if type(pair) is not list or len(pair) != 2 or any(type(i) is not int or not 0 <= i < 14 for i in pair) or pair[0] == pair[1]:
        raise Refused("INPUT_REFUSED")
    if type(tau) is not list or len(tau) != 2 or any(type(v) is not str or len(v) > 79 for v in tau):
        raise Refused("INPUT_REFUSED")
    if re.fullmatch(r"0|-?[1-9][0-9]*", tau[0]) is None or re.fullmatch(r"[1-9][0-9]*", tau[1]) is None:
        raise Refused("INPUT_REFUSED")
    n, d = int(tau[0]), int(tau[1])
    if abs(n).bit_length() > 256 or d.bit_length() > 256 or gcd(n, d) != 1:
        raise Refused("INPUT_REFUSED")
    lower = [i for i, v in enumerate(speeds) if v % 5 == 0]
    exceptions = [i for i, v in enumerate(speeds) if v % 5 != 0]
    if len(lower) != 9 or len(exceptions) != 5 or any(i not in exceptions for i in pair):
        raise Refused("PREMISE_REFUSED")
    a, b = (speeds[i] for i in pair)
    if (b - 2*a) % 5:
        raise Refused("PREMISE_REFUSED")
    work.charge(14)
    return label, list(speeds), list(pair), work.q(Fraction(n, d)), lower, exceptions


def grid(speeds, pair, base, eta, work):
    times = [work.q(base + Fraction(j, 5)) for j in range(5)]
    matrix = [[distance(work.q(t*v), work) for v in speeds] for t in times]
    bad = [[j for j in range(5) if matrix[j][i] < eta] for i in pair]
    good = [j for j in range(5) if min(matrix[j]) >= eta]
    witness = None
    if good:
        j = good[0]
        witness = {"lowestPhysicalShift": j, "finalTime": wire(times[j]),
                   "coordinateDistances": [wire(v) for v in matrix[j]],
                   "minimumDistance": wire(min(matrix[j]))}
    work.charge(14*5 + 10)
    return {"baseTime": wire(base), "distanceMatrix": [[wire(v) for v in row] for row in matrix],
            "pairBadIndices": bad, "pairBadUnion": sorted(set(bad[0]) | set(bad[1])),
            "goodShiftIndices": good, "observedWitness": witness}


def derive_certificate(raw, limits=None):
    """Derive from bounded actual inputs only, never accept a supplied verdict.

    A shared internal Work charges the whole fixed CLI report without resets.
    No gcd1 restriction: the theorem also applies to nonprimitive valid speeds.
    """
    work = Work(limits)
    certificate = _derive_certificate(raw, work)
    bounded_json(certificate, work)
    return certificate


def _derive_certificate(raw, work):
    label, speeds, pair, tau, lower, exceptions = parse_input(raw, work)
    L, eta = work.q(Fraction(1, 10)), work.q(Fraction(1, 15))
    reduced = [speeds[i] // 5 for i in lower]
    lower_distances = [distance(work.q(tau*v), work) for v in reduced]
    if min(lower_distances) < L:
        raise Refused("LOWER_WITNESS_REFUSED")
    U = max(speeds[i] for i in lower)
    t_star, radius = work.q(tau/5), work.q(Fraction(1, 30*U))
    delta = speeds[pair[1]] - 2*speeds[pair[0]]
    phase = work.q(delta*t_star)
    beta = distance(phase, work)
    floor = phase.numerator // phase.denominator
    # Nearest ties use LOWER integer, including negative half-integers.
    nearest = floor if phase - floor <= Fraction(1, 2) else floor + 1
    dominance = delta != 0 and abs(delta) >= 15*U
    gate = delta == 0 or work.q(abs(delta)*radius) >= beta
    original = grid(speeds, pair, t_star, eta, work)
    aligned = t_star if delta == 0 else work.q(Fraction(nearest, delta))
    adjustment = work.q(aligned - t_star)
    aligned_grid = None
    if gate:
        if abs(adjustment) > radius or delta*aligned != nearest:
            raise Refused("INVARIANT_REFUSED")
        if any(distance(work.q(aligned*speeds[i]), work) < eta for i in lower):
            raise Refused("INVARIANT_REFUSED")
        aligned_grid = grid(speeds, pair, aligned, eta, work)
        if len(aligned_grid["pairBadUnion"]) > 1 or not aligned_grid["goodShiftIndices"]:
            raise Refused("INVARIANT_REFUSED")
    context = {"speeds": speeds, "divisibleIndices": lower, "exceptionIndices": exceptions,
               "reducedSpeeds": reduced, "pairLabels": pair, "pairSpeeds": [speeds[i] for i in pair],
               "integerGcd": reduce(gcd, speeds), "tau": wire(tau),
               "lowerDistances": [wire(v) for v in lower_distances], "lowerWitnessMargin": wire(min(lower_distances)),
               "U": U, "tStar": wire(t_star), "L": wire(L), "eta": wire(eta),
               "radius": wire(radius), "Delta": delta, "beta": wire(beta),
               "dominanceHolds": dominance, "phaseGateHolds": gate, "nearestInteger": nearest,
               "alignedBase": wire(aligned) if gate else None,
               "actualAdjustment": wire(adjustment) if gate else None}
    work.charge()
    return {"label": label, "status": "CHECKED_PHASE_LOCK_WITNESS" if gate else "UNKNOWN_GATE_NOT_APPLICABLE",
            "context": context, "originalGrid": original, "alignedGrid": aligned_grid,
            "scope": dict(SCOPE)}


def fixed_inputs():
    exceptions = ([1, 2, 3, 7, 11], [1, 52, 3, 7, 11], [1, 677, 3, 7, 11],
                  [338, 1, 3, 7, 11], [1, 1247, 3, 7, 11], [1, 7, 3, 4, 11])
    labels = ("exact_pair", "already_aligned", "positive_radius_tie", "negative_radius_tie",
              "congruence_subfamily_z1", "unknown_gate_actual_witness")
    return [{"label": label, "speeds": list(range(5, 46, 5)) + list(row),
             "pairLabels": [9, 10], "tau": ["1", "10"]} for label, row in zip(labels, exceptions)]


def bounded_json(value, work):
    # Only exact builtins are serialized; caller objects cannot run JSON hooks.
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
    if len(encoded.encode("ascii")) + 1 > MAX_BYTES:
        raise Refused("OUTPUT_REFUSED")
    return encoded


def build_fixed_report(limits=None):
    return _build_fixed_payload(limits)[0]


def _build_fixed_payload(limits=None):
    work = Work(limits)
    cases = [_derive_certificate(raw, work) for raw in fixed_inputs()]
    accepted = sum(case["status"] == "CHECKED_PHASE_LOCK_WITNESS" for case in cases)
    original_count = sum(case["originalGrid"] is not None for case in cases)
    aligned_count = sum(case["alignedGrid"] is not None for case in cases)
    if (len(cases), accepted, original_count, aligned_count) != (6, 5, 6, 5):
        raise Refused("INVARIANT_REFUSED")
    body = {"version": "LRC_ADAPTIVE_PHASE_LOCK_V1", "cases": cases, "scope": dict(SCOPE),
            "counts": {"cases": len(cases), "phaseGateAccepted": accepted, "unknownGate": len(cases)-accepted,
                       "originalMatrices": original_count, "alignedMatrices": aligned_count,
                       "retainedMatrixCoordinates": 70*(original_count+aligned_count)}}
    canonical = bounded_json(body, work)
    report = {**body, "semanticDigest": sha256(canonical.encode("ascii")).hexdigest(),
              "metrics": {"chargedOperations": work.operations, "elapsedMs": round((monotonic()-work.start)*1000, 6)}}
    # Charge complete serialization, then update metrics without a budget reset.
    bounded_json(report, work)
    # Conservatively reserve one whole maximum-size final encoding/inspection.
    work.charge(MAX_BYTES + 4096)
    report["metrics"] = {"chargedOperations": work.operations, "elapsedMs": round((monotonic()-work.start)*1000, 6)}
    encoded = json.dumps(report, sort_keys=True, separators=(",", ":"), ensure_ascii=True, allow_nan=False)
    if len(encoded.encode("ascii")) + 1 > MAX_BYTES or monotonic() >= work.deadline:
        raise Refused("RESOURCE_REFUSED")
    return report, encoded, work.deadline


def main():
    if len(sys.argv) != 1 or any(os.environ.get(flag) != "false" for flag in FLAGS):
        raise Refused("CLI_REFUSED")
    # No partial output: construct/check complete JSON before its single write.
    _, encoded, deadline = _build_fixed_payload()
    if monotonic() >= deadline:
        raise Refused("RESOURCE_REFUSED")
    sys.stdout.write(encoded + "\n")


if __name__ == "__main__":
    try:
        main()
    except Refused as error:
        sys.stderr.write(str(error) + "\n")
        sys.exit(2)
