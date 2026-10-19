"""Small engineering controls, not an independent universal proof."""
from fractions import Fraction as F
import unittest

from equality_analysis import determinant, leading_minors, offsets, reflection


class Controls(unittest.TestCase):
    def test_determinant_pivot_swap(self):
        self.assertEqual(determinant([[F(0), F(2)], [F(3), F(4)]]), -6)

    def test_singular_determinant(self):
        self.assertEqual(determinant([[F(1), F(2)], [F(2), F(4)]]), 0)

    def test_pd_shift_threshold_is_strict(self):
        identity = [[F(i == j) for j in range(4)] for i in range(4)]
        self.assertEqual(leading_minors(identity, F(1)), [0] * 4)
        self.assertEqual(leading_minors(identity, F(1, 2)), [F(1, 2**k) for k in range(1, 5)])

    def test_indefinite_rejected(self):
        diagonal = [[F((1 if i != 2 else -1) * (i == j)) for j in range(4)] for i in range(4)]
        self.assertEqual(leading_minors(diagonal), [1, 1, -1, -1])

    def test_known_offset_gauge(self):
        point = tuple(F(v, 61) for v in (29, 93, 116, 165))
        self.assertEqual(offsets(point), tuple(F(v, 305) for v in (79, 47, 50, 12, 0)))

    def test_reflection_is_involution(self):
        point = tuple(F(v, 305) for v in (79, 47, 50, 12, 0))
        expected = tuple(F(v, 305) for v in (79, 67, 29, 32, 0))
        self.assertEqual(reflection(point), expected)
        self.assertEqual(reflection(expected), point)


if __name__ == '__main__':
    unittest.main(verbosity=2)
