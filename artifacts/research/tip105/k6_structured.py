"""TIP105 deterministic K6 navigation and exact finite upper bounds only.

No random starts, whole-space cover, global minimum claim, or runtime grant.
All exact areas reuse both immutable TIP098 rational implementations.
"""
from __future__ import annotations

import argparse
from fractions import Fraction as F
import json
import math
from pathlib import Path
import signal
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tip098"))
from kakeya_exact import area_affine, area_trapezoid


def area_float(xs):
    """Generalized six-triangle floating event sweep: navigation, not proof."""
    if len(xs) != 6 or not all(math.isfinite(float(x)) for x in xs):
        raise ValueError("six finite offsets required")
    xs = list(map(float, xs))
    lines = [(x, j / 6) for j, x in enumerate(xs, 1)]
    lines += [(x + 1 / 6, (j - 1) / 6) for j, x in enumerate(xs, 1)]
    heights = {0., 1.}
    for i, (intercept, slope) in enumerate(lines):
        for other, rate in lines[:i]:
            if slope != rate:
                y = (other - intercept) / (slope - rate)
                if 0 < y < 1:
                    heights.add(y)
    heights = sorted(heights)
    lengths = []
    for y in heights:
        intervals = sorted((x + j*y/6, x + 1/6 + (j-1)*y/6)
                           for j, x in enumerate(xs, 1))
        left, right = intervals[0]
        total = 0.
        for a, b in intervals[1:]:
            if a > right:
                total += right-left
                left, right = a, b
            else:
                right = max(right, b)
        lengths.append(total+right-left)
    return sum((b-a)*(la+lb)/2 for a,b,la,lb in
               zip(heights, heights[1:], lengths, lengths[1:]))


def structured_seeds():
    # Known general public symmetric family x_j=(n-j)/(3n), n=6.
    result = [("symmetric", tuple(F(6-j,18) for j in range(1,7)))]
    # Both proved K5 equality points, scaled horizontally by5/6.
    # Sixth insertion uses zero, left extension, and adjacent base endpoints.
    for name, nums in [("K5", (79,47,50,12,0)),
                       ("K5_reflection", (79,67,29,32,0))]:
        first = tuple(F(v,366) for v in nums)
        insertions = sorted(set([F(0), F(-1,18), F(-1,6)] +
                                [x for x in first] + [x+F(1,6) for x in first]))
        for sixth in insertions:
            result.append((name+"_insert_"+str(sixth),
                           tuple(x-sixth for x in first)+(F(0),)))
    return result


def exact_record(xs):
    xs = tuple(F(x) for x in xs)
    if len(xs) != 6 or xs[-1] != 0:
        raise ValueError("K6 gauge x6=0 required")
    primary, secondary = area_trapezoid(xs), area_affine(xs)
    if primary != secondary:
        raise ArithmeticError("independent exact sweeps disagree")
    return {"offsets": list(map(str,xs)), "area": str(primary),
            "area_affine": str(secondary), "agreement": True,
            "status": "EXACT_FINITE_UPPER_BOUND",
            "global_optimality": "NOT_ESTABLISHED"}


def compatibility_ledger():
    """Exact finite arithmetic underlying Main's overlapping-block handproof."""
    points=[tuple(F(v,61) for v in row) for row in ((29,93,116,165),(49,72,136,165))]
    def left(u):
        return (u[1]-u[0],u[2]-u[1],u[3]-u[2])
    def right(u):
        return (u[0],u[1]-u[0],u[2]-u[1])
    mismatches=[[sum((a-b)**2 for a,b in zip(left(u),right(v))) for v in points] for u in points]
    return {"K5_apex_equality_points":[list(map(str,u)) for u in points],
            "squared_left_right_mismatches":[list(map(str,row)) for row in mismatches],
            "minimum_squared_mismatch":str(min(v for row in mismatches for v in row)),
            "max_squared_apex_distance_lower_bound":"9/7442",
            "conditional_K6_gap_coefficient_of_c":"15/14884",
            "c_status":"positive existential global K5 stability constant; NOT NUMERICALLY CERTIFIED",
            "scope":"finite arithmetic only; linear-map and all-real transfer proofs are Main's"}


def persist_result(path,result):
    """Create-only evidence; refuse any overwrite."""
    with Path(path).open("x",encoding="utf-8") as output:
        json.dump(result,output,sort_keys=True)
        output.write("\n")


def navigate(max_seconds=50):
    start = time.monotonic()
    evaluations = 0
    ledger = []
    best = None
    def objective(point):
        nonlocal evaluations
        if time.monotonic()-start >= max_seconds:
            raise TimeoutError("navigation ceiling")
        evaluations += 1
        return area_float(list(point)+[0.])
    for name, seed in structured_seeds():
        try:
            point = list(map(float,seed[:5]))
            score = objective(point)
            step = .05
            used = evaluations
            iterations = 0
            for iterations in range(1200):
                changed = False
                for index in range(5):
                    trial_best, score_best = point, score
                    for direction in (-1,1):
                        trial = point[:]
                        trial[index] += direction*step
                        value = objective(trial)
                        if value < score_best-1e-16:
                            trial_best, score_best = trial,value
                    if trial_best is not point:
                        changed=True
                        point,score=trial_best,score_best
                if not changed:
                    step /= 2
                if step < 1e-9:
                    break
        except TimeoutError:
            break
        point = point+[0.]
        record = {"name":name, "seed":list(map(str,seed)),
                  "float_offsets":point, "float_area":score,
                  "converged":step<1e-9, "iterations":iterations+1,
                  "final_step":step, "evaluations":evaluations-used}
        ledger.append(record)
        if best is None or record["float_area"] < best["float_area"]:
            best = record
    if best is None:
        raise ArithmeticError("no structured seed completed")
    rationalizations = []
    for denominator in (1000,10000,100000,1000000):
        xs = [F(x).limit_denominator(denominator) for x in best["float_offsets"]]
        rationalizations.append({"denominator_limit":denominator, **exact_record(xs)})
    return {"mode":"DETERMINISTIC_STRUCTURED_NAVIGATION", "random_search":False,
            "algorithm":"cyclic coordinate pattern navigation; structured seeds only",
            "planned_seeds":len(structured_seeds()), "completed_seeds":len(ledger),
            "objective_evaluations":evaluations, "runs":ledger, "best":best,
            "exact_rationalizations":rationalizations,
            "symmetric_exact":exact_record(structured_seeds()[0][1]),
            "max_seconds":max_seconds, "elapsed_seconds":time.monotonic()-start,
            "scope":"finite construction; no global or local optimality certificate"}


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("mode",choices=("navigate","eval"))
    parser.add_argument("offsets", nargs="*")
    parser.add_argument("--out", help="create-only JSON evidence path")
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("per-process 60 second envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(59)
    result=navigate() if args.mode=="navigate" else exact_record(args.offsets)
    if args.out:
        persist_result(args.out,result)
    print(json.dumps(result,sort_keys=True))


if __name__=="__main__":
    main()
