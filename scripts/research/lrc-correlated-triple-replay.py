"""Independent exact common-time/pair-correlation diagnostic, no authority.

Fixed public data only. All-real implications require the written proof; this
isolated stdlib process does not import product/old mathematical arithmetic.
"""
import hashlib
import json
import math
import sys
import time
from fractions import Fraction

VERSION = "LRC_CORRELATED_TRIPLE_V1"
REQUEST_VERSION = "LRC_CORRELATED_TRIPLE_REPLAY_V1"
MAX_BYTES = 32768
ETA = Fraction(1, 9)
MULTIPLIERS = (1, 2, 4)


class Refusal(Exception):
    pass


class Resources(Exception):
    pass


class Work:
    def __init__(self, request, started):
        self.started, self.operations = started, 0
        if type(request) is not dict or set(request) != {"version", "remainingMs", "remainingOperations"} or request["version"] != REQUEST_VERSION:
            raise Refusal()
        ms, ops = request["remainingMs"], request["remainingOperations"]
        if type(ms) is not int or not 0 < ms <= 5000 or type(ops) is not int or not 0 < ops <= 2000000:
            raise Resources()
        self.ms, self.maximum = ms, ops

    def tick(self, steps=1):
        if self.operations + steps > self.maximum or (time.perf_counter() - self.started) * 1000 > self.ms:
            raise Resources()
        self.operations += steps


def wire(value, work):
    work.tick()
    if abs(value.numerator).bit_length() > 256 or value.denominator.bit_length() > 256:
        raise Resources()
    return [str(value.numerator), str(value.denominator)]


def distance(value, work):
    work.tick(2)
    phase = value % 1
    return min(phase, 1 - phase)


def distance_rows(speeds, base, d, work):
    rows = []
    for j in range(d):
        work.tick()
        rows.append([distance(speed * (base + Fraction(j, d)), work) for speed in speeds])
    return rows


def wire_rows(rows, work):
    return [[wire(value, work) for value in row] for row in rows]


def proof_segments(work):
    result = []
    for left, right, h in ((Fraction(0), Fraction(1, 9), 1), (Fraction(1, 9), Fraction(2, 9), 2), (Fraction(2, 9), Fraction(1, 3), 1)):
        coordinates = []
        for c in MULTIPLIERS:
            work.tick(4)
            intercept = Fraction(c * h, 3)
            low, high = c * left + intercept, c * right + intercept
            floor = math.floor(low)
            if math.floor(high) != floor or low - floor < ETA or high - floor > 1 - ETA:
                raise Refusal()
            # Raw affine function c*x+b; subtract the separately retained floor
            # to recover the fractional-part range over the whole closed cell.
            coordinates.append({"multiplier": c, "slope": c, "intercept": wire(intercept, work), "floor": floor,
                                "fractionalRange": [wire(low - floor, work), wire(high - floor, work)]})
        result.append({"left": wire(left, work), "right": wire(right, work), "normalizedShift": h, "coordinates": coordinates})
    return result


def phase_partition(work):
    # Each bounded z range follows the actual affine value range of c*(x+j/3),
    # not a trusted list of expected boundaries or a numerical search grid.
    roots = {Fraction(0), Fraction(1, 3)}
    for c in MULTIPLIERS:
        for j in range(3):
            lower, upper = Fraction(c * j, 3), Fraction(c * (j + 1), 3)
            for sign in (-1, 1):
                first, last = math.ceil(lower - sign * ETA), math.floor(upper - sign * ETA)
                for integer in range(first, last + 1):
                    work.tick(4)
                    point = (Fraction(integer) + sign * ETA) / c - Fraction(j, 3)
                    if not 0 <= point <= Fraction(1, 3):
                        raise Refusal()
                    roots.add(point)
    boundaries = sorted(roots)
    cells = []
    for index, left in enumerate(boundaries):
        candidates = [("BOUNDARY", left, left)]
        if index + 1 < len(boundaries):
            right = boundaries[index + 1]
            candidates.append(("OPEN", right, (left + right) / 2))
        for kind, right, phase in candidates:
            rows = distance_rows(MULTIPLIERS, phase, 3, work)
            good = [j for j, row in enumerate(rows) if min(row) >= ETA]
            pair_bad = [j for j, row in enumerate(rows) if min(row[:2]) < ETA]
            h = 2 if Fraction(1, 9) <= phase <= Fraction(2, 9) else 1
            work.tick(10)
            if h not in good or len(pair_bad) > 1:
                raise Refusal()
            cells.append({"kind": kind, "left": wire(left, work), "right": wire(right, work), "representative": wire(phase, work),
                          "distances": wire_rows(rows, work), "goodShiftIndices": good,
                          "pairBadUnionIndices": pair_bad, "normalizedShift": h})
    if len(boundaries) != 10 or len(cells) != 19:
        raise Refusal()
    return {"boundaries": [wire(value, work) for value in boundaries], "cells": cells}


def positive_fixture(k, q, v, harmonic, work):
    work.tick(12)
    if q <= 0 or v <= 0 or q * v % 3 == 0:
        raise Refusal()
    divisible = [3 * i for i in range(1, k - 2)]
    exceptions = [q, 2 * q, v]
    speeds = divisible + exceptions
    tau, base = Fraction(1, k - 2), Fraction(1, 3 * (k - 2))
    carry = math.floor(3 * q * base)
    phase = q * base - Fraction(carry, 3)
    inverse = pow(q % 3, -1, 3)
    rows = distance_rows(exceptions, base, 3, work)
    if harmonic:
        if v != 4 * q:
            raise Refusal()
        h = 2 if Fraction(1, 9) <= phase <= Fraction(2, 9) else 1
        j = inverse * (h - carry) % 3
    else:
        possible = [j for j, row in enumerate(rows) if min(row) >= ETA]
        if not possible:
            raise Refusal()
        j = min(possible)
        h = (q * j + carry) % 3
    time_value = base + Fraction(j, 3)
    coordinates = [distance(speed * time_value, work) for speed in speeds]
    lower_distances = [distance(Fraction(speed, 3) * tau, work) for speed in divisible]
    lower_margin, gamma = Fraction(1, k - 2), min(Fraction(1, k - 2), ETA)
    if len(speeds) != k or len(set(speeds)) != k or min(lower_distances) < lower_margin or min(rows[j]) < ETA or min(coordinates) < gamma:
        raise Refusal()
    return {"kind": 0 if harmonic else 1, "movingRunners": k, "totalRunners": k + 1,
            "q": q, "v": v, "divisibleSpeeds": divisible, "exceptionSpeeds": exceptions, "speeds": speeds,
            "tau": wire(tau, work), "baseTime": wire(base, work), "normalizedPhase": wire(phase, work), "carry": carry,
            "qInverse": inverse, "normalizedShift": h, "physicalShift": j, "time": wire(time_value, work),
            "selectionRule": 0 if harmonic else 1,
            "exceptionDistancesByShift": wire_rows(rows, work), "coordinateDistances": [wire(value, work) for value in coordinates],
            "minimumDistance": wire(min(coordinates), work), "gamma": wire(gamma, work), "lowerMargin": wire(lower_margin, work),
            "lowerLrcAssumption": 0 if k == 13 else 1, "lowerWitnessVerified": True}


def old_negative(d, e, work):
    divisible = [d * (2 * i + 1) for i in range(14 - e)]
    exceptions = [1, 4] if (d, e) == (5, 2) else list(range(1, e + 1))
    speeds, base, tau = divisible + exceptions, Fraction(1, 2), Fraction(d, 2)
    lower = [distance(Fraction(speed, d) * tau, work) for speed in divisible]
    rows = distance_rows(exceptions, base, d, work)
    full = [min([distance(speed * (base + Fraction(j, d)), work) for speed in speeds]) for j in range(d)]
    maxima = max(min(row) for row in rows)
    delta = Fraction((d - 1) // e, 2 * d)
    work.tick(14 + d)
    if len(set(speeds)) != 14 or min(lower) < Fraction(1, 15 - e) or maxima != delta or max(full) != delta:
        raise Refusal()
    return {"d": d, "e": e, "divisibleSpeeds": divisible, "exceptionSpeeds": exceptions, "speeds": speeds,
            "baseTime": wire(base, work), "reducedLowerTime": wire(tau, work), "lowerCoordinateDistances": [wire(x, work) for x in lower],
            "exceptionDistancesByShift": wire_rows(rows, work), "fullMinimumByShift": [wire(x, work) for x in full],
            "maximumExceptionMinimum": wire(maxima, work), "maximumFullMinimum": wire(max(full), work),
            "oldDelta": wire(delta, work), "lowerWitnessVerified": True}


def residue_alias(work):
    divisible = [3 * i for i in (1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13)]
    exceptions, base, tau = [1, 5, 4], Fraction(1, 15), Fraction(1, 5)
    speeds = divisible + exceptions
    lower = [distance(Fraction(speed, 3) * tau, work) for speed in divisible]
    rows = distance_rows(exceptions, base, 3, work)
    full = [min([distance(speed * (base + Fraction(j, 3)), work) for speed in speeds]) for j in range(3)]
    work.tick(17)
    if min(lower) != Fraction(1, 5) or max(full) != Fraction(1, 15):
        raise Refusal()
    return {"movingRunners": 14, "totalRunners": 15, "divisibleSpeeds": divisible, "exceptionSpeeds": exceptions, "speeds": speeds,
            "reducedLowerTime": wire(tau, work), "baseTime": wire(base, work), "lowerCoordinateDistances": [wire(x, work) for x in lower],
            "lowerMinimum": wire(min(lower), work), "exceptionDistancesByShift": wire_rows(rows, work),
            "fullMinimumByShift": [wire(x, work) for x in full], "maximumFullMinimum": wire(max(full), work),
            "requiredPairPresent": False, "residuePattern": [speed % 3 for speed in exceptions], "doesNotDisproveGlobalLrc": True}


def encoded(value, work):
    work.tick()
    text = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    size = len(text.encode("utf-8"))
    work.tick((size + 31) // 32)
    if size > MAX_BYTES:
        raise Resources()
    return text


def derive(work):
    phase = Fraction(1, 9)
    sharp_rows = distance_rows(MULTIPLIERS, phase, 3, work)
    minima = [min(row) for row in sharp_rows]
    residues, independent_phases = [1, 2, 1], [Fraction(0), Fraction(1, 3), Fraction(1, 3)]
    independent = [[distance(alpha + Fraction(a * j, 3), work) for a, alpha in zip(residues, independent_phases)] for j in range(3)]
    independent_minima = [min(row) for row in independent]
    fixtures = [positive_fixture(k, q, 4 * q, True, work) for k in (13, 14) for q in (1, 2, 4, 5, 7, 8, 10, 11, 13, 14)]
    fixtures += [positive_fixture(k, q, v, False, work) for k in (13, 14) for q, v in ((1, 5), (2, 7), (13, 17))]
    if max(minima) != ETA or max(independent_minima) != 0:
        raise Refusal()
    report = {"version": VERSION, "divisor": 3, "threshold": wire(ETA, work), "kernelMultipliers": list(MULTIPLIERS),
              "legend": {"fixtureKinds": ["HARMONIC", "ARBITRARY_THIRD"],
                         "selectionRules": ["HARMONIC_SEGMENT_WITH_CARRY", "LOWEST_PHYSICAL_GOOD_SHIFT"],
                         "lowerLrcAssumptions": ["LRC(10)", "LRC(11)"]},
              "proofSegments": proof_segments(work), "partition": phase_partition(work),
              "sharpness": {"phase": wire(phase, work), "distances": wire_rows(sharp_rows, work),
                            "minimumDistanceByShift": [wire(x, work) for x in minima], "maximumMinimumDistance": wire(max(minima), work)},
              "independentObstruction": {"unitResidues": residues, "phases": [wire(x, work) for x in independent_phases],
                                         "distances": wire_rows(independent, work), "minima": [wire(x, work) for x in independent_minima],
                                         "maximumMinimumDistance": wire(max(independent_minima), work)},
              "positiveFixtures": fixtures, "oldClassNegatives": [old_negative(d, e, work) for d, e in ((3, 2), (5, 2), (5, 3), (5, 4))],
              "residueAlias": residue_alias(work),
              "scope": {"mathematicalClaim": "SHARP_DOUBLED_PAIR_THIRD_SHIFT_MARGIN",
                        "phaseDomain": "ALL_REAL_COMMON_TIME_WRITTEN_PROOF_REQUIRED",
                        "family": "EXACT_Q_2Q_V_WITH_3_NOT_DIVIDING_QV",
                        "diagnosticKernel": "FIXED_MULTIPLIERS_1_2_4",
                        "conditionalLowerWitnessRequired": True,
                        "movingRunnerConvention": "K_MOVING_K_PLUS_ONE_TOTAL",
                        "globalLrc": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED",
                        "external": "NOT_ESTABLISHED", "novelty": "NOT_ESTABLISHED",
                        "agentLoop": "NOT_RUN", "executionAuthority": False,
                        "residueOnlySufficient": False, "genericSpeedSolver": False}}
    text = encoded(report, work)
    work.tick()
    evidence = {"report": report, "reportDigest": hashlib.sha256(text.encode("utf-8")).hexdigest()}
    encoded(evidence, work)
    return evidence


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise Refusal()
        result[key] = value
    return result


def reject_constant(_):
    raise Refusal()


def main():
    started, work = time.perf_counter(), None
    status, evidence = "REPORT_REFUSED", None
    try:
        raw = sys.stdin.buffer.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise Resources()
        request = json.loads(raw.decode("utf-8"), object_pairs_hook=unique_object, parse_constant=reject_constant)
        work = Work(request, started)
        work.tick((len(raw) + 31) // 32)
        evidence = derive(work)
        work.tick()
        status = "ACCEPTED"
    except Resources:
        status, evidence = "RESOURCE_REFUSED", None
    except (Refusal, ValueError, UnicodeError, RecursionError, OverflowError, TypeError):
        status, evidence = "REPORT_REFUSED", None
    result = {"status": status, "evidence": evidence, "elapsedMs": (time.perf_counter() - started) * 1000,
              "chargedOperations": work.operations if work else 0}
    text = json.dumps(result, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    if len(text.encode("utf-8")) > MAX_BYTES:
        text = '{"status":"RESOURCE_REFUSED","evidence":null,"elapsedMs":0,"chargedOperations":0}'
    sys.stdout.write(text + "\n")


if __name__ == "__main__":
    main()
