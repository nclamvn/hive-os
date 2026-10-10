"""Exact local arithmetic certificate, conditional on Main's cell-degree premise.

No global optimality, independent mathematical review, or discovery-search claim.
Run: python3 -B artifacts/research/tip098/local_certificate.py
"""

from fractions import Fraction as F
from functools import reduce
from itertools import combinations
import json
from math import gcd, lcm

from kakeya_exact import area_affine, area_trapezoid


REFERENCE = (F(79, 305), F(47, 305), F(10, 61), F(12, 305))


def canonical_wall(coefficients):
    """Primitive integer wall with the first nonzero coefficient positive."""
    if not any(coefficients[:4]):
        # An affine constant does not define a parameter-space hyperplane.
        return None
    denominator = lcm(*(value.denominator for value in coefficients))
    integers = [int(value * denominator) for value in coefficients]
    divisor = reduce(gcd, (abs(value) for value in integers), 0)
    if not divisor:
        return None
    integers = [value // divisor for value in integers]
    if next(value for value in integers if value) < 0:
        integers = [-value for value in integers]
    return tuple(integers)


def value_of(law, point):
    return sum((coefficient * value for coefficient, value in zip(law[:4], point)), law[4])


def event_arrangement():
    """Derive height affines from the ten endpoint definitions, independently."""
    endpoints = []
    for j in range(1, 6):
        variable = [F(0)] * 5
        if j < 5:
            variable[j - 1] = F(1)
        endpoints.append((F(j, 5), tuple(variable)))
        right = variable[:]
        right[4] = F(1, 5)
        endpoints.append((F(j - 1, 5), tuple(right)))
    heights = set()
    parallel_walls = set()
    for (slope_a, intercept_a), (slope_b, intercept_b) in combinations(endpoints, 2):
        difference = tuple(b - a for a, b in zip(intercept_a, intercept_b))
        if slope_a != slope_b:
            heights.add(tuple(value / (slope_a - slope_b) for value in difference))
        else:
            wall = canonical_wall(difference)
            if wall is not None:
                parallel_walls.add(wall)
    walls = set()
    for height in heights:
        at_zero = canonical_wall(height)
        at_one = canonical_wall(height[:4] + (height[4] - 1,))
        walls.update(wall for wall in (at_zero, at_one) if wall is not None)
    for first, second in combinations(heights, 2):
        wall = canonical_wall(tuple(a - b for a, b in zip(first, second)))
        if wall is not None:
            walls.add(wall)
    # Parallel endpoint equality is also an order wall, not a height event.
    missing_parallel_walls = sorted(parallel_walls - walls)
    walls.update(parallel_walls)
    return tuple(sorted(heights)), tuple(sorted(walls)), missing_parallel_walls


def determinant(matrix):
    work = [list(row) for row in matrix]
    result = F(1)
    for column in range(len(work)):
        pivot = next((row for row in range(column, len(work)) if work[row][column]), None)
        if pivot is None:
            return F(0)
        if pivot != column:
            work[pivot], work[column] = work[column], work[pivot]
            result *= -1
        value = work[column][column]
        result *= value
        for row in range(column + 1, len(work)):
            ratio = work[row][column] / value
            for index in range(column + 1, len(work)):
                work[row][index] -= ratio * work[column][index]
    return result


def dot(first, second):
    return sum((a * b for a, b in zip(first, second)), F(0))


def sign(value):
    return (value > 0) - (value < 0)


def local_side(side, walls, zero_walls):
    center = list(REFERENCE)
    center[3] += F(side, 100000)
    step = F(1, 10000000)
    points = [tuple(center)]
    labels = ["center"]
    for direction in [1, -1]:
        for index in range(4):
            point = center[:]
            point[index] += direction * step
            points.append(tuple(point))
            labels.append(("plus" if direction == 1 else "minus") + str(index + 1))
    pairs = list(combinations(range(4), 2))
    for first, second in pairs:
        point = center[:]
        point[first] += step
        point[second] += step
        points.append(tuple(point))
        labels.append("pair_plus" + str(first + 1) + str(second + 1))
    values = []
    for point in points:
        trapezoid = area_trapezoid(list(point) + [0])
        affine = area_affine(list(point) + [0])
        if trapezoid != affine:
            raise ArithmeticError("area calculations disagree at " + str(point))
        values.append(trapezoid)
    hessian = [[F(0) for _ in range(4)] for _ in range(4)]
    for index in range(4):
        hessian[index][index] = (values[1 + index] - 2 * values[0]
                                 + values[5 + index]) / (step * step)
    for value, (first, second) in zip(values[9:], pairs):
        entry = (value - values[1 + first] - values[1 + second] + values[0]) / (step * step)
        hessian[first][second] = hessian[second][first] = entry
    gradient = [(values[1 + index] - values[5 + index]) / (2 * step) for index in range(4)]
    delta = [reference - value for reference, value in zip(REFERENCE, center)]
    gradient_at_reference = [gradient[index] + dot(hessian[index], delta) for index in range(4)]
    area_at_reference = values[0] + dot(gradient, delta) \
        + dot(delta, [dot(row, delta) for row in hessian]) / 2
    minors = [determinant([row[:size] for row in hessian[:size]]) for size in range(1, 5)]
    nonzero_walls = [wall for wall in walls if wall not in zero_walls]
    reference_signs = [sign(value_of(wall, REFERENCE)) for wall in nonzero_walls]
    nonzero_region = all([sign(value_of(wall, point)) for wall in nonzero_walls] == reference_signs
                        for point in points)
    zero_region = all(sign(value_of(wall, point)) == side
                      for wall in zero_walls for point in points)
    basis_checks = []
    for point, actual in zip(points, values):
        displacement = [value - start for value, start in zip(point, center)]
        predicted = values[0] + dot(gradient, displacement) \
            + dot(displacement, [dot(row, displacement) for row in hessian]) / 2
        basis_checks.append(predicted == actual)
    if not nonzero_region or not zero_region or not all(basis_checks):
        raise ArithmeticError("region or polynomial basis checks failed")
    return {"side": side, "center": center, "interpolation_step": step,
            "samples": [{"label": label, "point": point, "area": area,
                         "both_algorithms_agree": True}
                        for label, point, area in zip(labels, points, values)],
            "Hessian": hessian, "gradient_at_center": gradient,
            "gradient_at_reference": gradient_at_reference,
            "area_at_center": values[0], "area_at_reference": area_at_reference,
            "leading_minors": minors, "positive_definite_sylvester": all(value > 0 for value in minors),
            "nonzero_wall_signs_preserved_all_samples": nonzero_region,
            "zero_wall_chosen_sign_all_samples": zero_region,
            "sample_wall_sign_comparisons": len(points) * len(walls),
            "polynomial_basis_checks": basis_checks}


def certificate():
    heights, walls, missing_parallel_walls = event_arrangement()
    zero_walls = [wall for wall in walls if value_of(wall, REFERENCE) == 0]
    margins = [abs(value_of(wall, REFERENCE)) / sum(abs(value) for value in wall[:4])
               for wall in walls if any(wall[:4]) and value_of(wall, REFERENCE) != 0]
    margin = min(margins)
    sides = [local_side(side, walls, zero_walls) for side in [-1, 1]]
    difference = [[b - a for a, b in zip(row_a, row_b)]
                  for row_a, row_b in zip(sides[0]["Hessian"], sides[1]["Hessian"])]
    normal = [F(value) for value in zero_walls[0][:4]] if len(zero_walls) == 1 else None
    rank_one_scale = None
    rank_one = False
    if normal is not None:
        index = next(index for index, value in enumerate(normal) if value)
        rank_one_scale = difference[index][index] / (normal[index] * normal[index])
        rank_one = all(difference[i][j] == rank_one_scale * normal[i] * normal[j]
                       for i in range(4) for j in range(4))
    reference_primary = area_trapezoid(list(REFERENCE) + [0])
    reference_secondary = area_affine(list(REFERENCE) + [0])
    return {"scope": "LOCAL_ARITHMETIC_CERTIFICATE_CONDITIONAL_ON_CELL_DEGREE_PREMISE",
            "premise": "Main's external written premise: area has degree<=2 on fixed endpoint-event order cells",
            "reference": REFERENCE, "reference_area": reference_primary,
            "reference_algorithms_agree": reference_primary == reference_secondary,
            "endpoint_count": 10, "distinct_height_affines": len(heights),
            "wall_count": len(walls), "walls": walls, "zero_walls_at_reference": zero_walls,
            "parallel_order_walls_not_already_generated": missing_parallel_walls,
            "safe_linf_radius_strictly_less_than": margin, "sides": sides,
            "Hplus_minus_Hminus": difference, "rank_one_normal": normal,
            "rank_one_scale": rank_one_scale, "rank_one_relation_verified": rank_one,
            "zero_reference_gradients": all(all(value == 0 for value in item["gradient_at_reference"])
                                             for item in sides),
            "reference_polynomials_agree": all(item["area_at_reference"] == reference_primary for item in sides),
            "exact_area_calls": 62, "global_optimality": "NOT_ESTABLISHED",
            "independent_mathematical_review": "NOT_CLAIMED"}


def json_ready(value):
    if isinstance(value, F):
        return str(value)
    if isinstance(value, dict):
        return {key: json_ready(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_ready(item) for item in value]
    return value


if __name__ == "__main__":
    print(json.dumps(json_ready(certificate()), sort_keys=True))
