"""Fixed public diagnostic; isolated stdlib Fraction reconstruction, no authority.

All real-phase and lower-LRC implications require the separately reviewed written
proof. This process neither reads scientific files nor imports product arithmetic.
"""
import hashlib
import itertools
import json
import math
import sys
import time
from fractions import Fraction

VERSION = "LRC_SHARP_SHIFT_MARGIN_V1"
REQUEST_VERSION = "LRC_SHARP_SHIFT_MARGIN_REPLAY_V1"
MAX_BYTES = 32768
MAX_MS = 5000
MAX_OPS = 2000000
MAX_SAFE = 9007199254740991


class Refusal(Exception):
    pass


class Resources(Exception):
    pass


class Work:
    def __init__(self, request, started):
        self.started = started
        self.operations = 0
        if type(request) is not dict or set(request) != {
            "version", "remainingMs", "remainingOperations"
        } or request["version"] != REQUEST_VERSION:
            raise Refusal()
        ms, ops = request["remainingMs"], request["remainingOperations"]
        if type(ms) is not int or not 0 < ms <= MAX_MS or type(ops) is not int or not 0 < ops <= MAX_OPS:
            raise Resources()
        self.ms, self.maximum = ms, ops

    def tick(self, count=1):
        if self.operations + count > self.maximum or (time.perf_counter() - self.started) * 1000 > self.ms:
            raise Resources()
        self.operations += count


def fraction_wire(value, work):
    work.tick()
    if value.numerator < 0 or value.numerator.bit_length() > 256 or value.denominator.bit_length() > 256:
        raise Resources()
    return [str(value.numerator), str(value.denominator)]


def distance(phase, unit, shift, d, work):
    work.tick(3)
    value = (phase + Fraction(unit * shift, d)) % 1
    return min(value, 1 - value)


def mask_at(phase, unit, d, delta, work):
    return tuple(j for j in range(d) if distance(phase, unit, j, d, work) < delta)


def mask_number(mask, work):
    work.tick(len(mask) + 1)
    return sum(2 ** j for j in mask)


def family(masks, work):
    work.tick(len(masks))
    return [list(mask) for mask in sorted(masks, key=lambda item: mask_number(item, work))]


def derive_class(d, e, work):
    work.tick()
    r = (d - 1) // e
    delta = Fraction(r, 2 * d)
    partitions, aggregate = [], set()
    for unit in range(1, d):
        work.tick()
        if math.gcd(unit, d) != 1:
            continue
        roots = set()
        for shift in range(d):
            for signed_delta in (-delta, delta):
                work.tick(3)
                roots.add((signed_delta - Fraction(unit * shift, d)) % 1)
        boundaries = sorted(roots)
        cells, local = [], set()
        for index, left in enumerate(boundaries):
            right = boundaries[index + 1] if index + 1 < len(boundaries) else boundaries[0] + 1
            for kind, endpoint, representative in (
                ("BOUNDARY", left, left),
                ("OPEN", right, ((left + right) / 2) % 1),
            ):
                work.tick(3)
                mask = mask_at(representative, unit, d, delta, work)
                local.add(mask)
                aggregate.add(mask)
                cells.append({"kind": kind, "left": fraction_wire(left, work),
                              "right": fraction_wire(endpoint, work),
                              "representative": fraction_wire(representative, work),
                              "badShiftIndices": list(mask)})
        partitions.append({"unitResidue": unit,
                           "boundaries": [fraction_wire(x, work) for x in boundaries],
                           "cells": cells, "maskFamily": family(local, work)})
    masks = family(aggregate, work)
    minimum, tuple_count = d, 0
    # An exhaustive product of the independently derived deduplicated aggregate
    # family, not redundant cell/unit samples and not a sampled phase claim.
    for choice in itertools.product(masks, repeat=e):
        work.tick(e + 1)
        covered = set()
        for mask in choice:
            work.tick(len(mask) + 1)
            covered.update(mask)
        work.tick(d)
        minimum = min(minimum, d - len(covered))
        tuple_count += 1
    offsets = [(-Fraction(i * (r + 1), d) - Fraction(r, 2 * d)) % 1 for i in range(e)]
    work.tick(e * 3)
    exact_distances = [[distance(phase, 1, j, d, work) for j in range(d)] for phase in offsets]
    minima = [min(row[j] for row in exact_distances) for j in range(d)]
    work.tick(e * d + d)
    maximum = max(minima)
    if maximum != delta or minimum < d - e * r:
        raise Refusal()
    lower_margin = Fraction(1, 15 - e)
    return {"d": d, "e": e, "r": r, "delta": fraction_wire(delta, work),
            "partitions": partitions, "attainableMasks": masks, "tupleCount": tuple_count,
            "minimumGoodShifts": minimum, "guaranteedGoodShifts": d - e * r,
            "sharpness": {"unitResidues": [1] * e,
                          "offsets": [fraction_wire(x, work) for x in offsets],
                          "distances": [[fraction_wire(x, work) for x in row] for row in exact_distances],
                          "minimumDistanceByShift": [fraction_wire(x, work) for x in minima],
                          "maximumMinimumDistance": fraction_wire(maximum, work)},
            "conditional": {"lowerMovingRunners": 14 - e, "lowerLrcAssumption": "LRC(%d)" % (14 - e),
                            "lowerMargin": fraction_wire(lower_margin, work),
                            "guaranteedMargin": fraction_wire(min(lower_margin, delta), work),
                            "lowerWitnessAssumed": True, "analyticAlignmentAssumed": True}}


def encoded(value, work):
    work.tick()
    value = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    work.tick((len(value.encode("utf-8")) + 31) // 32)
    if len(value.encode("utf-8")) > MAX_BYTES:
        raise Resources()
    return value


def derive(work):
    report = {"version": VERSION,
              "classes": [derive_class(d, e, work) for d, e in ((3, 2), (5, 2), (5, 3), (5, 4))],
              "scope": {"mathematicalClaim": "SHARP_UNIFORM_EXCEPTION_SHIFT_MARGIN",
                        "phaseDomain": "ALL_REAL_PHASES_WRITTEN_PROOF_REQUIRED",
                        "diagnosticScope": "FOUR_FIXED_CLASSES", "lowerLrcAssumptionsRequired": True,
                        "lowerWitnessAssumed": True, "analyticAlignmentAssumed": True,
                        "globalLrc": "NOT_ESTABLISHED", "speedTupleSharpness": "NOT_ESTABLISHED",
                        "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
                        "novelty": "NOT_ESTABLISHED", "agentLoop": "NOT_RUN", "executionAuthority": False}}
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
    result = {"status": status, "evidence": evidence,
              "elapsedMs": (time.perf_counter() - started) * 1000,
              "chargedOperations": work.operations if work else 0}
    text = json.dumps(result, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    if len(text.encode("utf-8")) > MAX_BYTES:
        text = '{"status":"RESOURCE_REFUSED","evidence":null,"elapsedMs":0,"chargedOperations":0}'
    sys.stdout.write(text + "\n")


if __name__ == "__main__":
    main()
