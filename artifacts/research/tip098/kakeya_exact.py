"""Exact finite translated-triangle union areas; no global-optimality claim.

For j=1,...,n, the horizontal slice at y is
[x_j+j*y/n, x_j+1/n+(j-1)*y/n], 0<=y<=1.
Both algorithms use Fraction arithmetic and independently construct their slabs.
CLI: python3 kakeya_exact.py eval '79/305' '47/305' '10/61' '12/305' 0
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import json
import math
import random
import re
import sys
import time


_RATIONAL = re.compile(r"[+-]?\d+(?:/[+-]?\d+)?\Z")


def rational(value: object) -> Fraction:
    """Accept exact integers, Fractions, or integer/fraction strings only."""
    if isinstance(value, bool):
        raise ValueError("booleans are not rational offsets")
    if isinstance(value, Fraction):
        return value
    if isinstance(value, int):
        return Fraction(value)
    if isinstance(value, str) and _RATIONAL.fullmatch(value):
        try:
            numerator, *denominator = value.split("/")
            return Fraction(int(numerator), int(denominator[0]) if denominator else 1)
        except (ValueError, ZeroDivisionError) as exc:
            raise ValueError("invalid rational offset") from exc
    raise ValueError("offsets must be exact integers or fraction strings")


def validate_offsets(offsets: object) -> tuple[Fraction, ...]:
    if not isinstance(offsets, (list, tuple)):
        raise ValueError("offsets must be a list or tuple")
    if not 1 <= len(offsets) <= 8:
        raise ValueError("triangle count must be in 1..8")
    return tuple(rational(value) for value in offsets)


def event_heights(offsets: object) -> tuple[Fraction, ...]:
    """Every pairwise endpoint crossing, including the fixed boundary heights."""
    xs = validate_offsets(offsets)
    n = len(xs)
    lines = []
    for j, x in enumerate(xs, 1):
        lines.extend(((x, Fraction(j, n)), (x + Fraction(1, n), Fraction(j - 1, n))))
    heights = {Fraction(0), Fraction(1)}
    for i, (intercept, slope) in enumerate(lines):
        for other_intercept, other_slope in lines[i + 1:]:
            if slope != other_slope:
                crossing = (other_intercept - intercept) / (slope - other_slope)
                if 0 < crossing < 1:
                    heights.add(crossing)
    return tuple(sorted(heights))


def union_length(offsets: object, height: object) -> Fraction:
    xs = validate_offsets(offsets)
    y = rational(height)
    if not 0 <= y <= 1:
        raise ValueError("height must be in [0,1]")
    n = len(xs)
    intervals = sorted((x + Fraction(j, n) * y,
                        x + Fraction(1, n) + Fraction(j - 1, n) * y)
                       for j, x in enumerate(xs, 1))
    start, end = intervals[0]
    length = Fraction(0)
    for left, right in intervals[1:]:
        if left > end:
            length += end - start
            start, end = left, right
        else:
            end = max(end, right)
    return length + end - start


def area_trapezoid(offsets: object) -> Fraction:
    """Integrate continuous piecewise-affine slice length by endpoint trapezoids."""
    xs = validate_offsets(offsets)
    heights = event_heights(xs)
    lengths = [union_length(xs, y) for y in heights]
    return sum(((b - a) * (la + lb) / 2
                for a, b, la, lb in zip(heights, heights[1:], lengths, lengths[1:])),
               Fraction(0))


def area_affine(offsets: object) -> Fraction:
    """Independently select component endpoint laws at each midpoint and integrate.

    Does not call event_heights, union_length, or area_trapezoid. Endpoint laws
    are represented as (slope, intercept), intentionally unlike the first path.
    """
    xs = validate_offsets(offsets)
    n = len(xs)
    inv_n = Fraction(1, n)
    intervals = [((j * inv_n, x), ((j - 1) * inv_n, x + inv_n))
                 for j, x in enumerate(xs, 1)]
    endpoints = [line for interval in intervals for line in interval]
    cuts = {Fraction(0), Fraction(1)}
    for p in range(len(endpoints)):
        slope_p, intercept_p = endpoints[p]
        for q in range(p):
            slope_q, intercept_q = endpoints[q]
            if slope_p != slope_q:
                y = (intercept_q - intercept_p) / (slope_p - slope_q)
                if Fraction(0) < y < Fraction(1):
                    cuts.add(y)
    ordered_cuts = sorted(cuts)
    total = Fraction(0)
    for bottom, top in zip(ordered_cuts, ordered_cuts[1:]):
        midpoint = (bottom + top) / 2

        def at_midpoint(line: tuple[Fraction, Fraction]) -> Fraction:
            return line[0] * midpoint + line[1]

        ordered = sorted(intervals, key=lambda pair: at_midpoint(pair[0]))
        left_law, right_law = ordered[0]
        union_slope = Fraction(0)
        union_intercept = Fraction(0)
        for next_left, next_right in ordered[1:]:
            if at_midpoint(next_left) > at_midpoint(right_law):
                union_slope += right_law[0] - left_law[0]
                union_intercept += right_law[1] - left_law[1]
                left_law, right_law = next_left, next_right
            elif at_midpoint(next_right) > at_midpoint(right_law):
                right_law = next_right
        union_slope += right_law[0] - left_law[0]
        union_intercept += right_law[1] - left_law[1]
        total += union_slope * (top * top - bottom * bottom) / 2
        total += union_intercept * (top - bottom)
    return total


def area_float5(offsets: object) -> float:
    """Cheap approximate n=5 objective for Main-owned searches, never a certificate."""
    if not isinstance(offsets, (list, tuple)) or len(offsets) != 5:
        raise ValueError("approximate objective is confined to n=5")
    if any(isinstance(x, bool) or not isinstance(x, (int, float, Fraction))
           for x in offsets):
        raise ValueError("approximate offsets must be finite numbers")
    xs = [float(x) for x in offsets]
    if not all(math.isfinite(x) for x in xs):
        raise ValueError("approximate offsets must be finite numbers")
    lines = [(x, j / 5) for j, x in enumerate(xs, 1)]
    lines += [(x + .2, (j - 1) / 5) for j, x in enumerate(xs, 1)]
    heights = {0., 1.}
    for i, (intercept, slope) in enumerate(lines):
        for other_intercept, other_slope in lines[:i]:
            if slope != other_slope:
                y = (other_intercept - intercept) / (slope - other_slope)
                if 0. < y < 1.:
                    heights.add(y)
    ordered = sorted(heights)

    def length(y: float) -> float:
        slices = sorted((x + j * y / 5, x + .2 + (j - 1) * y / 5)
                        for j, x in enumerate(xs, 1))
        left, right = slices[0]
        result = 0.
        for a, b in slices[1:]:
            if a > right:
                result += right - left
                left, right = a, b
            else:
                right = max(right, b)
        return result + right - left

    lengths = [length(y) for y in ordered]
    return sum((b - a) * (la + lb) / 2
               for a, b, la, lb in zip(ordered, ordered[1:], lengths, lengths[1:]))


def evaluation(offsets: object) -> dict[str, object]:
    xs = validate_offsets(offsets)
    first = area_trapezoid(xs)
    second = area_affine(xs)
    if first != second:
        raise ArithmeticError("exact area algorithms disagree")
    return {"status": "EXACT_FINITE_AREA", "n": len(xs),
            "offsets": [str(x) for x in xs], "area": str(first),
            "area_affine": str(second), "agreement": True,
            "event_heights": [str(y) for y in event_heights(xs)],
            "global_optimality": "NOT_ESTABLISHED"}


def search_float5(*, seed: int = 98001, max_seconds: float = 30.,
                  max_iterations: int = 10000, restarts: int = 100,
                  min_step: float = 1e-7, denominator: int = 1000000) -> dict[str, object]:
    """Bounded deterministic-seed pattern search; approximate output ONLY.

    The elapsed-time stopping boundary can change the number of iterations across
    machines; seed+iteration stopping is deterministic. No exact validation occurs
    here. Main must pass a candidate separately to both rational computations.
    """
    if isinstance(seed, bool) or not isinstance(seed, int):
        raise ValueError("seed must be an integer")
    if (isinstance(max_seconds, bool) or not isinstance(max_seconds, (int, float))
            or not math.isfinite(max_seconds) or not 0 < max_seconds <= 120):
        raise ValueError("max-seconds must be finite and in (0,120]")
    for name, value in [("max-iterations", max_iterations), ("restarts", restarts),
                        ("denominator", denominator)]:
        if isinstance(value, bool) or not isinstance(value, int) or value < 1:
            raise ValueError(name + " must be a positive integer")
    if not isinstance(min_step, (int, float)) or isinstance(min_step, bool) \
            or not math.isfinite(min_step) or not 0 < min_step < .2:
        raise ValueError("min-step must be finite and in (0,0.2)")
    rng = random.Random(seed)
    initial = [[79 / 305, 47 / 305, 10 / 61, 12 / 305, 0.],
               [4 / 15, 1 / 5, 2 / 15, 1 / 15, 0.]]
    start_time = time.monotonic()
    evaluations = 0
    iterations = 0
    starts_used = 0
    best = None
    best_area = math.inf
    stopped = "RESTART_LIMIT"
    deadline = start_time + max_seconds
    exhausted = False

    def objective(xs):
        nonlocal evaluations
        evaluations += 1
        return area_float5(xs)

    for start_index in range(restarts):
        if time.monotonic() >= deadline:
            stopped = "TIME_LIMIT"
            break
        if iterations >= max_iterations:
            stopped = "ITERATION_LIMIT"
            break
        point = (initial[start_index][:] if start_index < len(initial)
                 else [rng.uniform(-3., 3.) for _ in range(4)] + [0.])
        value = objective(point)
        starts_used += 1
        if value < best_area:
            best, best_area = point[:], value
        step = .2
        while step >= min_step:
            if time.monotonic() >= deadline:
                stopped, exhausted = "TIME_LIMIT", True
                break
            if iterations >= max_iterations:
                stopped, exhausted = "ITERATION_LIMIT", True
                break
            iterations += 1
            neighbor, neighbor_value = point, value
            for coordinate in range(4):
                for direction in [-1, 1]:
                    if time.monotonic() >= deadline:
                        stopped, exhausted = "TIME_LIMIT", True
                        break
                    trial = point[:]
                    trial[coordinate] = min(3., max(-3., point[coordinate] + direction * step))
                    trial_value = objective(trial)
                    if trial_value < neighbor_value - 1e-15:
                        neighbor, neighbor_value = trial, trial_value
                    if trial_value < best_area:
                        best, best_area = trial[:], trial_value
                if exhausted:
                    break
            if exhausted:
                break
            if neighbor is point:
                step /= 2
            else:
                point, value = neighbor, neighbor_value
        if exhausted:
            break
    return {"status": "APPROXIMATE_CANDIDATE_ONLY", "n": 5, "seed": seed,
            "domain": "x1..x4 in [-3,3], x5=0", "initial_starts": initial,
            "initial_step": .2, "min_step": min_step,
            "requested_restarts": restarts, "starts_used": starts_used,
            "max_iterations": max_iterations, "iterations": iterations,
            "max_seconds": max_seconds, "elapsed_seconds": time.monotonic() - start_time,
            "objective_evaluations": evaluations, "stop_reason": stopped,
            "float_offsets": best, "float_area": best_area if best is not None else None,
            "rational_candidate_offsets": ([str(Fraction(x).limit_denominator(denominator))
                                              for x in best] if best is not None else None),
            "rational_denominator_limit": denominator,
            "exact_validation": "NOT_PERFORMED", "global_optimality": "NOT_ESTABLISHED"}


def search_de_float5(*, seed: int = 98002, max_seconds: float = 30.,
                     max_generations: int = 10000, population_size: int = 50,
                     mutation: float = .8, crossover: float = .9,
                     denominator: int = 1000000) -> dict[str, object]:
    """DE/rand/1/bin coupled proposals, bounded approximate n=5 search only.

    Each generation uses its frozen predecessor population. Three distinct donor
    indices exclude the target, and one randomly selected coordinate always uses
    the mutant. Out-of-domain mutant coordinates are clamped. Equal-score trials
    are accepted, so flat regions can move without making an improvement claim.
    """
    if isinstance(seed, bool) or not isinstance(seed, int):
        raise ValueError("seed must be an integer")
    if (isinstance(max_seconds, bool) or not isinstance(max_seconds, (int, float))
            or not math.isfinite(max_seconds) or not 0 < max_seconds <= 120):
        raise ValueError("max-seconds must be finite and in (0,120]")
    for name, value in [("max-generations", max_generations),
                        ("population", population_size), ("denominator", denominator)]:
        if isinstance(value, bool) or not isinstance(value, int) or value < 1:
            raise ValueError(name + " must be a positive integer")
    if population_size < 4:
        raise ValueError("population must have at least four members")
    for name, value, lower, upper in [("mutation", mutation, 0., 2.),
                                      ("crossover", crossover, 0., 1.)]:
        if (isinstance(value, bool) or not isinstance(value, (int, float))
                or not math.isfinite(value) or not lower <= value <= upper):
            raise ValueError(name + " is outside its finite admissible range")
    if mutation == 0:
        raise ValueError("mutation must be positive")
    rng = random.Random(seed)
    initial = [[79 / 305, 47 / 305, 10 / 61, 12 / 305, 0.],
               [4 / 15, 1 / 5, 2 / 15, 1 / 15, 0.]]
    start_time = time.monotonic()
    deadline = start_time + max_seconds
    population = []
    scores = []
    best = None
    best_area = math.inf
    evaluations = 0
    trials = 0
    replacements = 0
    generations_started = 0
    generations_completed = 0
    stop_reason = "GENERATION_LIMIT"

    def objective(point):
        nonlocal evaluations, best, best_area
        score = area_float5(point)
        evaluations += 1
        if score < best_area:
            best, best_area = point[:], score
        return score

    for index in range(population_size):
        if time.monotonic() >= deadline:
            stop_reason = "TIME_LIMIT"
            break
        point = (initial[index][:] if index < 2
                 else [rng.uniform(-3., 3.) for _ in range(4)] + [0.])
        population.append(point)
        scores.append(objective(point))
    initialized_population = len(population)
    if initialized_population == population_size:
        for _ in range(max_generations):
            if time.monotonic() >= deadline:
                stop_reason = "TIME_LIMIT"
                break
            generations_started += 1
            old_population = population
            old_scores = scores
            population = [point[:] for point in old_population]
            scores = old_scores[:]
            complete = True
            for target in range(population_size):
                if time.monotonic() >= deadline:
                    stop_reason, complete = "TIME_LIMIT", False
                    break
                a, b, c = rng.sample([i for i in range(population_size) if i != target], 3)
                mutant = [min(3., max(-3., old_population[a][coordinate]
                              + mutation * (old_population[b][coordinate]
                                            - old_population[c][coordinate])))
                          for coordinate in range(4)]
                required = rng.randrange(4)
                trial = [(mutant[coordinate]
                          if coordinate == required or rng.random() < crossover
                          else old_population[target][coordinate])
                         for coordinate in range(4)] + [0.]
                score = objective(trial)
                trials += 1
                if score <= old_scores[target]:
                    population[target], scores[target] = trial, score
                    replacements += 1
            if not complete:
                break
            generations_completed += 1
    return {"status": "APPROXIMATE_CANDIDATE_ONLY", "algorithm": "DE/rand/1/bin",
            "n": 5, "seed": seed, "domain": "x1..x4 in [-3,3], x5=0",
            "initial_starts": initial, "population_size": population_size,
            "initialized_population": initialized_population,
            "mutation": mutation, "crossover": crossover, "bounds_policy": "CLAMP",
            "selection": "TRIAL_LE_TARGET", "max_generations": max_generations,
            "generations_started": generations_started,
            "generations_completed": generations_completed, "trial_evaluations": trials,
            "accepted_replacements": replacements, "objective_evaluations": evaluations,
            "max_seconds": max_seconds, "elapsed_seconds": time.monotonic() - start_time,
            "stop_reason": stop_reason, "float_offsets": best,
            "float_area": best_area if best is not None else None,
            "rational_candidate_offsets": ([str(Fraction(x).limit_denominator(denominator))
                                              for x in best] if best is not None else None),
            "rational_denominator_limit": denominator,
            "exact_validation": "NOT_PERFORMED", "global_optimality": "NOT_ESTABLISHED"}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    evaluate = commands.add_parser("eval", help="two exact rational area calculations")
    evaluate.add_argument("offsets", nargs="*")
    evaluate.add_argument("--json", dest="json_offsets",
                          help="JSON array of integers or rational strings")
    search = commands.add_parser("search", help="bounded approximate n=5 candidates only")
    search.add_argument("--seed", type=int, default=98001)
    search.add_argument("--max-seconds", type=float, default=30.)
    search.add_argument("--max-iterations", type=int, default=10000)
    search.add_argument("--restarts", type=int, default=100)
    search.add_argument("--min-step", type=float, default=1e-7)
    search.add_argument("--denominator", type=int, default=1000000)
    de = commands.add_parser("search-de", help="bounded coupled differential-evolution proposals")
    de.add_argument("--seed", type=int, default=98002)
    de.add_argument("--max-seconds", type=float, default=30.)
    de.add_argument("--max-generations", type=int, default=10000)
    de.add_argument("--population", type=int, default=50)
    de.add_argument("--mutation", type=float, default=.8)
    de.add_argument("--crossover", type=float, default=.9)
    de.add_argument("--denominator", type=int, default=1000000)
    args = parser.parse_args(argv)
    try:
        if args.command == "search-de":
            result = search_de_float5(seed=args.seed, max_seconds=args.max_seconds,
                                      max_generations=args.max_generations,
                                      population_size=args.population, mutation=args.mutation,
                                      crossover=args.crossover, denominator=args.denominator)
        elif args.command == "search":
            result = search_float5(seed=args.seed, max_seconds=args.max_seconds,
                                   max_iterations=args.max_iterations, restarts=args.restarts,
                                   min_step=args.min_step, denominator=args.denominator)
        else:
            if args.json_offsets is not None:
                if args.offsets:
                    raise ValueError("use positional offsets OR --json, not both")
                offsets = json.loads(args.json_offsets)
            else:
                offsets = args.offsets
            result = evaluation(offsets)
    except (ValueError, ArithmeticError) as exc:
        print(json.dumps({"status": "REFUSED", "error": str(exc)}))
        return 2
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
