"""Independent exact fixed five-exception doubled-pair diagnostic.

Only public fixed rational data; no product arithmetic, file writes, providers,
or authority. Universal claims require the separately reviewed written proof.
"""
import hashlib
import json
import math
import sys
import time
from fractions import Fraction

VERSION = "LRC_FIVE_EXCEPTION_PAIR_V1"
REQUEST_VERSION = "LRC_FIVE_EXCEPTION_REPLAY_V1"
MAX_BYTES = 32768
ETA = Fraction(1, 15)


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


def rows(speeds, base, work):
    result = []
    for j in range(5):
        work.tick()
        result.append([distance(speed * (base + Fraction(j, 5)), work) for speed in speeds])
    return result


def wires(values, work):
    return [wire(x, work) for x in values]


def wire_rows(values, work):
    return [wires(row, work) for row in values]


def partition(work):
    # Exhaust affine threshold equations c*(x+j/5)=integer +/- eta on
    # the entire closed domain. Midpoints are diagnostic cell representatives;
    # completeness follows from the independently generated roots, not sampling.
    roots = {Fraction(0), Fraction(1, 5)}
    for c in (1, 2):
        for j in range(5):
            low, high = Fraction(c * j, 5), Fraction(c * (j + 1), 5)
            for sign in (-1, 1):
                for n in range(math.ceil(low - sign * ETA), math.floor(high - sign * ETA) + 1):
                    work.tick(4)
                    point = (Fraction(n) + sign * ETA) / c - Fraction(j, 5)
                    if not 0 <= point <= Fraction(1, 5):
                        raise Refusal()
                    roots.add(point)
    boundaries = sorted(roots)
    cells = []
    for i, left in enumerate(boundaries):
        candidates = [("BOUNDARY", left, left)]
        if i + 1 < len(boundaries):
            right = boundaries[i + 1]
            candidates.append(("OPEN", right, (left + right) / 2))
        for kind, right, phase in candidates:
            matrix = rows((1, 2), phase, work)
            bad = [[j for j in range(5) if matrix[j][c] < ETA] for c in range(2)]
            union = sorted(set(bad[0] + bad[1]))
            work.tick(15)
            if len(union) > 1:
                raise Refusal()
            cells.append({"kind": kind, "left": wire(left, work), "right": wire(right, work),
                          "representative": wire(phase, work), "distances": wire_rows(matrix, work),
                          "badShiftIndicesByCoordinate": bad, "pairBadUnionIndices": union,
                          "pairGoodShiftIndices": [j for j in range(5) if j not in union]})
    if len(boundaries) != 6 or len(cells) != 11:
        raise Refusal()
    return {"boundaries": wires(boundaries, work), "cells": cells}


def fixture(q, extras, scaled, work):
    work.tick(20)
    divisible, exceptions = [5 * i for i in range(1, 10)], [q, 2 * q] + list(extras)
    speeds = divisible + exceptions
    if q <= 0 or any(v <= 0 or v % 5 == 0 for v in exceptions) or len(set(speeds)) != 14:
        raise Refusal()
    tau, base = Fraction(1, 10), Fraction(1, 50)
    matrix = rows(exceptions, base, work)
    possible = [j for j, row in enumerate(matrix) if min(row) >= ETA]
    if not possible:
        raise Refusal()
    j = min(possible)
    carry, inverse = math.floor(5 * q * base), pow(q % 5, -1, 5)
    phase = q * base - Fraction(carry, 5)
    h, time_value = (carry + q * j) % 5, base + Fraction(j, 5)
    coordinates = [distance(speed * time_value, work) for speed in speeds]
    lower = [distance(Fraction(speed, 5) * tau, work) for speed in divisible]
    if min(lower) < Fraction(1, 10) or min(coordinates) < ETA or inverse * (h - carry) % 5 != j:
        raise Refusal()
    return {"kind": "SCALED" if scaled else "ARBITRARY_EXTRAS", "movingRunners": 14, "totalRunners": 15,
            "q": q, "extraSpeeds": list(extras), "exceptionSpeeds": exceptions, "divisibleSpeeds": divisible, "speeds": speeds,
            "tau": wire(tau, work), "baseTime": wire(base, work), "normalizedPhase": wire(phase, work), "carry": carry,
            "qInverse": inverse, "physicalShift": j, "normalizedShift": h, "time": wire(time_value, work),
            "exceptionDistancesByShift": wire_rows(matrix, work), "coordinateDistances": wires(coordinates, work),
            "minimumDistance": wire(min(coordinates), work), "gamma": wire(ETA, work), "lowerMargin": wire(Fraction(1, 10), work),
            "lowerLrcAssumption": "LRC(9)", "lowerWitnessVerified": True, "selectionRule": "LOWEST_PHYSICAL_GOOD_SHIFT"}


def full_witness(exceptions, reduced, base, tau, sharp, work):
    divisible = [5 * i for i in reduced]
    speeds = divisible + list(exceptions)
    lower = [distance(i * tau, work) for i in reduced]
    matrix, full = rows(exceptions, base, work), rows(speeds, base, work)
    minima = [min(row) for row in full]
    if len(set(speeds)) != 14 or min(lower) < Fraction(1, 10):
        raise Refusal()
    result = {"baseTime": wire(base, work), "exceptionSpeeds": list(exceptions),
              "exceptionDistancesByShift": wire_rows(matrix, work), "divisibleReducedSpeeds": list(reduced),
              "divisibleSpeeds": divisible, "speeds": speeds, "tau": wire(tau, work),
              "lowerCoordinateDistances": wires(lower, work), "lowerMinimum": wire(min(lower), work),
              "lowerMargin": wire(Fraction(1, 10), work), "lowerLrcAssumption": "LRC(9)",
              "fullDistancesByShift": wire_rows(full, work), "fullMinimumByShift": wires(minima, work),
              "maximumFullMinimum": wire(max(minima), work)}
    work.tick(20)
    if sharp:
        exception_minima = [min(row) for row in matrix]
        if max(exception_minima) != ETA or max(minima) != ETA:
            raise Refusal()
        result.update({"exceptionMinimumByShift": wires(exception_minima, work), "maximumExceptionMinimum": wire(max(exception_minima), work)})
    else:
        if max(minima) != Fraction(1, 30) or any(2 * a == b for a in exceptions for b in exceptions):
            raise Refusal()
        result.update({"residuePattern": [v % 5 for v in exceptions], "requiredPairPresent": False, "doesNotDisproveGlobalLrc": True})
    return result


def carry_failure(fixtures, work):
    # Derive the first genuinely consequential omitted-carry mapping. This is
    # not just a changed index: its actual exception distance must fail eta.
    for i, f in enumerate(fixtures):
        work.tick(3)
        wrong = f["qInverse"] * f["normalizedShift"] % 5
        wrong_time = Fraction(1, 50) + Fraction(wrong, 5)
        values = [distance(speed * wrong_time, work) for speed in f["exceptionSpeeds"]]
        if min(values) < ETA:
            if i != 8 or f["q"] != 11 or f["carry"] != 1 or wrong != 1 or min(values) != Fraction(3, 50):
                raise Refusal()
            return {"fixtureIndex": i, "carry": f["carry"], "qInverse": f["qInverse"],
                    "normalizedShift": f["normalizedShift"], "correctPhysicalShift": f["physicalShift"],
                    "wrongPhysicalShift": wrong, "wrongTime": wire(wrong_time, work),
                    "wrongExceptionDistances": wires(values, work), "wrongMinimum": wire(min(values), work),
                    "requiredThreshold": wire(ETA, work)}
    raise Refusal()


def derive(work):
    positives = [fixture(q, (3 * q, 4 * q, 7 * q), True, work) for q in (1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14)]
    positives += [fixture(q, extras, False, work) for q, extras in ((1, (3, 7, 11)), (2, (1, 7, 11)), (3, (1, 2, 7)), (4, (1, 3, 7)), (11, (2, 3, 7)), (14, (1, 3, 11)))]
    residues = [1, 2, 3, 4, 2]
    phases = [Fraction(0), Fraction(3, 5), Fraction(4, 5), Fraction(3, 5), Fraction(2, 5)]
    independent = [[distance(alpha + Fraction(a * j, 5), work) for a, alpha in zip(residues, phases)] for j in range(5)]
    obstruction_minima = [min(row) for row in independent]
    third = rows((1, 2, 7), Fraction(1, 10), work)
    third_minima = [min(row) for row in third]
    if max(obstruction_minima) != 0 or max(third_minima) != Fraction(1, 10):
        raise Refusal()
    routes = []
    for d, e in ((3, 2), (3, 3), (5, 2), (5, 3), (5, 4), (5, 5)):
        independent_margin = Fraction((d - 1) // e, 2 * d) if e < d else Fraction(0)
        pair_margin = Fraction(1, 3 * d)
        work.tick(8)
        routes.append({"d": d, "e": e, "independentMargin": wire(independent_margin, work),
                       "independentStatus": "POSITIVE" if e < d else "NO_POSITIVE_GUARANTEE",
                       "pairMargin": wire(pair_margin, work), "selected": "INDEPENDENT" if independent_margin >= pair_margin else "PAIR",
                       "pairRequiresExactRelation": True, "pairRequiresUnitExceptions": True, "interpretation": "EXCEPTION_MARGIN_ONLY"})
    report = {"version": VERSION, "divisor": 5, "pairMultiplier": 2, "threshold": wire(ETA, work), "partition": partition(work),
              "sharpness": full_witness((1, 2, 3, 4, 7), (1, 2, 4, 5, 7, 8, 10, 11, 13), Fraction(1, 15), Fraction(1, 3), True, work),
              "independentObstruction": {"unitResidues": residues, "phases": wires(phases, work), "distances": wire_rows(independent, work),
                                         "minima": wires(obstruction_minima, work), "maximumMinimumDistance": wire(max(obstruction_minima), work)},
              "positiveFixtures": positives, "carryFailure": carry_failure(positives, work),
              "residueAlias": full_witness((6, 17, 11, 23, 29), (1, 2, 3, 4, 5, 7, 8, 9, 10), Fraction(1, 6), Fraction(5, 6), False, work),
              "failedThirdUpgrade": {"exceptionSpeeds": [1, 2, 7], "baseTime": wire(Fraction(1, 10), work), "distances": wire_rows(third, work),
                                     "minimumByShift": wires(third_minima, work), "maximumMinimumDistance": wire(max(third_minima), work),
                                     "invalidUpgradeMargin": wire(Fraction(1, 5), work), "doesNotDisproveGlobalLrc": True},
              "routes": routes,
              "scope": {"mathematicalClaim": "FIVE_EXCEPTION_PAIR_SHIFT_CRITERION", "phaseDomain": "ALL_REAL_WRITTEN_PROOF_REQUIRED",
                        "family": "EXACT_Q_2Q_PLUS_THREE_UNIT_EXTRAS_MOD5", "movingRunnerConvention": "14_MOVING_15_TOTAL",
                        "conditionalLowerWitnessRequired": True, "strictSlackGuaranteed": False, "target14TotalMet": False,
                        "target15TotalMet": True, "tupleOptimum": "NOT_ESTABLISHED", "globalLrc": "NOT_ESTABLISHED",
                        "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED", "novelty": "NOT_ESTABLISHED",
                        "agentLoop": "NOT_RUN", "executionAuthority": False, "residueOnlySufficient": False,
                        "genericSpeedSolver": False, "runtimeRoutingChanged": False, "sourceAttestation": "LOCAL_CONSISTENCY_NOT_SIGNED"}}
    report_text = encoded(report, work)
    work.tick()
    evidence = {"report": report, "reportDigest": hashlib.sha256(report_text.encode("utf-8")).hexdigest()}
    encoded(evidence, work)
    return evidence


def encoded(value, work):
    work.tick()
    text = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    size = len(text.encode("utf-8"))
    work.tick((size + 31) // 32)
    if size > MAX_BYTES:
        raise Resources()
    return text


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
