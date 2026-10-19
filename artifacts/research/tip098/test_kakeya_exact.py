"""Focused engineering controls, not tests of global optimality."""

from fractions import Fraction as F
import json
import random
import subprocess
import sys
import unittest
from unittest.mock import patch

import kakeya_exact as k
import local_certificate as certificate


WITNESS = [F(79, 305), F(47, 305), F(10, 61), F(12, 305), F(0)]


class ExactAreaTests(unittest.TestCase):
    def check_area(self, xs, expected):
        self.assertEqual(k.area_trapezoid(xs), expected)
        self.assertEqual(k.area_affine(xs), expected)

    def test_single_triangle(self):
        self.check_area([F(-77, 9)], F(1, 2))

    def test_two_attaining_witness(self):
        self.check_area([F(1, 6), 0], F(1, 3))

    def test_two_incorrect_reference_negative_control(self):
        self.check_area([F(1, 4), 0], F(11, 32))
        self.assertNotEqual(k.area_trapezoid([F(1, 4), 0]), F(1, 3))

    def test_three_reference(self):
        self.check_area([F(2, 9), F(1, 9), 0], F(5, 18))

    def test_four_reference(self):
        self.check_area([F(1, 4), F(1, 6), F(1, 12), 0], F(1, 4))

    def test_five_reference(self):
        self.check_area(WITNESS, F(14, 61))

    def test_five_symmetric_reference(self):
        self.check_area([F(4, 15), F(1, 5), F(2, 15), F(1, 15), 0], F(7, 30))

    def test_disjoint_triangles(self):
        for n in range(1, 9):
            with self.subTest(n=n):
                self.check_area([3 * j for j in range(n)], F(1, 2))

    def test_translation(self):
        for c in [F(-199, 7), F(0), F(43, 13)]:
            with self.subTest(c=c):
                self.check_area([x + c for x in WITNESS], F(14, 61))

    def test_reflection(self):
        for c in [F(-11, 9), F(0), F(23, 3)]:
            with self.subTest(c=c):
                self.check_area([c - x for x in reversed(WITNESS)], F(14, 61))

    def test_independent_second_path(self):
        with patch.object(k, "area_trapezoid", side_effect=AssertionError), \
             patch.object(k, "union_length", side_effect=AssertionError), \
             patch.object(k, "event_heights", side_effect=AssertionError):
            self.assertEqual(k.area_affine(WITNESS), F(14, 61))

    def test_slice_endpoints(self):
        self.assertEqual(k.union_length([0], 0), F(1))
        self.assertEqual(k.union_length([0], 1), F(0))
        self.assertEqual(k.union_length([0], F(3, 5)), F(2, 5))

    def test_events_interior_and_boundaries(self):
        events = k.event_heights(WITNESS)
        self.assertEqual(events[0], F(0))
        self.assertEqual(events[-1], F(1))
        self.assertEqual(events, tuple(sorted(set(events))))

    def test_seeded_validation_crosschecks(self):
        rng = random.Random(98001)
        for n in range(1, 9):
            for case in range(8):
                xs = [F(rng.randint(-30, 30), rng.randint(1, 17)) for _ in range(n)]
                with self.subTest(n=n, case=case):
                    first = k.area_trapezoid(xs)
                    self.assertEqual(first, k.area_affine(xs))
                    self.assertGreaterEqual(first, F(1, 2 * n))
                    self.assertLessEqual(first, F(1, 2))

    def test_malformed_input_refusals(self):
        invalid = [[], [0] * 9, None, "0", {"offsets": [0]}, [True], [0.5],
                   [float("nan")], ["1/0"], ["1.2"], ["NaN"], ["1/2/3"],
                   [" 1/2"], ["1e4"], [None], [complex(1)]]
        for xs in invalid:
            for algorithm in [k.area_trapezoid, k.area_affine]:
                with self.subTest(xs=repr(xs), algorithm=algorithm.__name__):
                    with self.assertRaises(ValueError):
                        algorithm(xs)

    def test_height_refusals(self):
        for y in [F(-1, 10), F(11, 10), 0.5, True]:
            with self.subTest(y=y), self.assertRaises(ValueError):
                k.union_length([0], y)

    def test_rational_representation(self):
        self.check_area(["1/6", "0"], F(1, 3))
        self.assertEqual(k.rational("-2/-6"), F(1, 3))

    def test_float_objective_reference_only(self):
        self.assertAlmostEqual(k.area_float5(WITNESS), float(F(14, 61)), places=13)
        self.assertAlmostEqual(k.area_float5([2, 4, 6, 8, 10]), .5, places=13)
        for xs in [[0] * 4, [True] * 5, [float("inf")] * 5, ["0"] * 5]:
            with self.subTest(xs=xs), self.assertRaises(ValueError):
                k.area_float5(xs)

    def test_cli_success(self):
        result = subprocess.run([sys.executable, "-B", k.__file__, "eval", "--json",
                                 '["79/305","47/305","10/61","12/305",0]'],
                                capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 0, result.stderr)
        payload = json.loads(result.stdout)
        self.assertEqual(payload["area"], "14/61")
        self.assertEqual(payload["area_affine"], "14/61")
        self.assertEqual(payload["global_optimality"], "NOT_ESTABLISHED")

    def test_cli_refusal(self):
        for value in ['[0.1]', '["1/0"]', '{}', 'not-json']:
            with self.subTest(value=value):
                result = subprocess.run([sys.executable, "-B", k.__file__, "eval",
                                         "--json", value], capture_output=True,
                                        text=True, timeout=10)
                self.assertEqual(result.returncode, 2)
                self.assertEqual(json.loads(result.stdout)["status"], "REFUSED")

    def test_search_parameter_refusals(self):
        for options in [{"max_seconds": 121}, {"max_seconds": 0},
                        {"max_seconds": float("nan")}, {"max_iterations": 0},
                        {"restarts": 0}, {"seed": True}, {"min_step": 0},
                        {"denominator": 0}]:
            with self.subTest(options=options), self.assertRaises(ValueError):
                k.search_float5(**options)

    def test_search_bookkeeping_mock_objective_only(self):
        # This is NOT a scientific candidate search: objective is a constant mock.
        with patch.object(k, "area_float5", return_value=.25):
            result = k.search_float5(max_seconds=1., max_iterations=2, restarts=3)
        self.assertEqual(result["iterations"], 2)
        self.assertEqual(result["objective_evaluations"], 17)
        self.assertEqual(result["starts_used"], 1)
        self.assertEqual(result["stop_reason"], "ITERATION_LIMIT")
        self.assertEqual(result["exact_validation"], "NOT_PERFORMED")
        self.assertEqual(result["status"], "APPROXIMATE_CANDIDATE_ONLY")

    def test_de_mock_coupled_proposals_and_counts(self):
        with patch.object(k, "area_float5", return_value=.25) as objective:
            result = k.search_de_float5(seed=98002, max_seconds=1., max_generations=1,
                                        population_size=8, crossover=1.)
        points = [call.args[0] for call in objective.call_args_list]
        self.assertEqual(len(points), 16)
        self.assertEqual(result["objective_evaluations"], 16)
        self.assertEqual(result["trial_evaluations"], 8)
        self.assertEqual(result["accepted_replacements"], 8)
        self.assertEqual(result["generations_completed"], 1)
        self.assertEqual(result["stop_reason"], "GENERATION_LIMIT")
        self.assertEqual(result["exact_validation"], "NOT_PERFORMED")
        for point in points:
            self.assertEqual(point[4], 0.)
            self.assertTrue(all(-3 <= x <= 3 for x in point[:4]))
        self.assertTrue(any(sum(a != b for a, b in zip(points[j], points[j + 8])) >= 2
                            for j in range(8)))

    def test_de_seed_reproducibility_mock_objective(self):
        sequences = []
        for _ in range(2):
            with patch.object(k, "area_float5", return_value=.25) as objective:
                k.search_de_float5(seed=98, max_seconds=1., max_generations=1,
                                   population_size=6)
            sequences.append([call.args[0] for call in objective.call_args_list])
        self.assertEqual(sequences[0], sequences[1])

    def test_de_parameter_refusals(self):
        for options in [{"max_seconds": 121}, {"max_seconds": 0},
                        {"max_seconds": float("nan")}, {"max_generations": 0},
                        {"population_size": 3}, {"seed": True}, {"mutation": 0},
                        {"mutation": 3}, {"crossover": -1}, {"crossover": 2},
                        {"crossover": float("nan")}, {"denominator": 0}]:
            with self.subTest(options=options), self.assertRaises(ValueError):
                k.search_de_float5(**options)

    def test_local_wall_canonicalization(self):
        self.assertEqual(certificate.canonical_wall([F(-3, 2), F(2), 0, F(-1, 2), F(1, 10)]),
                         (15, -20, 0, 5, -1))
        self.assertIsNone(certificate.canonical_wall([0, 0, 0, 0, F(1)]))
        self.assertIsNone(certificate.canonical_wall([0, 0, 0, 0, F(0)]))

    def test_local_independently_constructed_arrangement(self):
        heights, walls, missing_parallel = certificate.event_arrangement()
        self.assertEqual(len(heights), 27)
        self.assertEqual(len(walls), 184)
        self.assertEqual(missing_parallel, [])
        self.assertEqual([wall for wall in walls
                          if certificate.value_of(wall, certificate.REFERENCE) == 0],
                         [(15, -20, 0, 5, -1)])

    def test_local_polynomial_arithmetic(self):
        result = certificate.certificate()
        self.assertEqual(result["safe_linf_radius_strictly_less_than"], F(3, 1525))
        self.assertEqual(result["reference_area"], F(14, 61))
        self.assertTrue(result["reference_algorithms_agree"])
        self.assertTrue(result["zero_reference_gradients"])
        self.assertTrue(result["reference_polynomials_agree"])
        self.assertTrue(result["rank_one_relation_verified"])
        self.assertEqual(result["rank_one_scale"], F(1, 60))
        self.assertEqual(result["exact_area_calls"], 62)
        self.assertEqual(result["global_optimality"], "NOT_ESTABLISHED")
        for side in result["sides"]:
            self.assertEqual(len(side["samples"]), 15)
            self.assertTrue(side["positive_definite_sylvester"])
            self.assertTrue(side["nonzero_wall_signs_preserved_all_samples"])
            self.assertTrue(side["zero_wall_chosen_sign_all_samples"])
            self.assertTrue(all(side["polynomial_basis_checks"]))

    def test_local_exact_determinant_controls(self):
        self.assertEqual(certificate.determinant([[F(0), F(1)], [F(1), F(0)]]), F(-1))
        self.assertEqual(certificate.determinant([[F(1), F(2)], [F(2), F(4)]]), F(0))
        self.assertEqual(certificate.determinant([[F(1, 2), F(1, 3)],
                                                 [F(1, 4), F(1, 5)]]), F(1, 60))


if __name__ == "__main__":
    unittest.main(verbosity=2)
