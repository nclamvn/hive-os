"""ENGINEERING_ONLY recurrence-derived controls; no AI solving evidence."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[2]/'scripts/research/frontiermath_poly19_verifier.py'
SPEC = importlib.util.spec_from_file_location('poly19_verifier', SOURCE)
v = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(v)


def recurrence_witness():
    # Dickson D0=2,D1=x,Dn=x*D(n-1)-D(n-2), independently generated fixture.
    a, b = [2], [0, 1]
    for _ in range(2, 20):
        c = [0] + b
        for i, value in enumerate(a):
            c[i] -= value
        a, b = b, c
    return b


def value(coefficients):
    total = 0
    for c in reversed(coefficients):
        total = total*19 + c
    return total


def payload(coefficients=None, claimed=None):
    coefficients = recurrence_witness() if coefficients is None else coefficients
    return json.dumps({'coefficients': coefficients,
                       'claimed_value': value(coefficients) if claimed is None else claimed}).encode()


class ExactReplay(unittest.TestCase):
    def test_recurrence_construction_supported_with_full_certificate(self):
        r = v.verify_bytes(payload())
        self.assertEqual(r['status'], 'VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION')
        self.assertTrue(r['factorIdentity'])
        self.assertTrue(r['distinctS'])
        self.assertTrue(r['nondegenerateQuadratics'])
        self.assertEqual(r['irreducibleComponentsUnderLemma'], 10)
        self.assertGreater(r['measurements']['exactArithmeticOperations'], 1000)
        self.assertEqual(r['officialScore'], 'NOT_ESTABLISHED')
        self.assertEqual(len(r['candidateSha256']), 64)

    def test_ring_relations(self):
        ring = v.Ring(v.Budget())
        self.assertEqual(ring.mul(ring.power_z(18), ring.power_z(1)), v.ONE)
        total = v.ZERO
        for i in range(19):
            total = ring.add(total, ring.power_z(i))
        self.assertEqual(total, v.ZERO)

    def test_wrong_scalar_rejected_even_with_supported_vector(self):
        self.assertEqual(v.verify_bytes(payload(claimed=value(recurrence_witness())+1))['status'], 'REJECTED')

    def test_normalization_rejected(self):
        for index, replacement in [(19, 2), (1, -18), (0, 1), (2, 1)]:
            with self.subTest(index=index):
                c = recurrence_witness(); c[index] = replacement
                self.assertEqual(v.verify_bytes(payload(c))['status'], 'REJECTED')

    def test_mutated_normalized_polynomial_is_inconclusive_not_global_false(self):
        c = recurrence_witness(); c[3] += 1
        r = v.verify_bytes(payload(c))
        self.assertEqual(r['status'], 'INCONCLUSIVE')
        self.assertFalse(r['factorIdentity'])

    def test_answer_only_shortcut_defeated_with_same_scalar(self):
        c = recurrence_witness(); c[3] += 19**2; c[5] -= 1
        self.assertEqual(value(c), value(recurrence_witness()))
        self.assertEqual(v.verify_bytes(payload(c))['status'], 'INCONCLUSIVE')

    def test_numeric_only_missing_and_extra_certificate_fields_unsupported(self):
        for x in [value(recurrence_witness()), {}, {'claimed_value': 1},
                  {'coefficients': recurrence_witness(), 'claimed_value': value(recurrence_witness()), 'code': 'raise'}]:
            with self.subTest(shape=type(x).__name__):
                self.assertEqual(v.verify_bytes(json.dumps(x).encode())['status'], 'INCONCLUSIVE')

    def test_wrong_length_noninteger_and_bool_domains_inconclusive(self):
        c = recurrence_witness()
        for bad in [c[:-1], c+[0], [False]+c[1:], [0.0]+c[1:], 'polynomial']:
            with self.subTest(domain=type(bad).__name__):
                data = json.dumps({'coefficients': bad, 'claimed_value': value(c)}).encode()
                self.assertEqual(v.verify_bytes(data)['status'], 'INCONCLUSIVE')
        self.assertEqual(v.verify_bytes(json.dumps({'coefficients': c, 'claimed_value': True}).encode())['status'], 'INCONCLUSIVE')

    def test_bit_bounds_and_nonfinite_domains(self):
        c = recurrence_witness(); c[3] = 1 << 256
        self.assertEqual(v.verify_bytes(payload(c))['status'], 'INCONCLUSIVE')
        self.assertEqual(v.verify_bytes(payload(claimed=1 << 512))['status'], 'INCONCLUSIVE')
        for text in [b'NaN', b'Infinity', b'-Infinity', b'1e9999', b'1.'+b'0'*1000]:
            self.assertEqual(v.verify_bytes(text)['status'], 'INCONCLUSIVE')

    def test_duplicate_keys_syntax_utf8_and_size_rejected(self):
        for data in [b'{"coefficients":[],"coefficients":[],"claimed_value":0}',
                     b'{bad}', b'\xff', b' '*16385, b'[] []']:
            with self.subTest(bytes=len(data)):
                self.assertEqual(v.verify_bytes(data)['status'], 'REJECTED')

    def test_huge_integer_unsupported_without_unbounded_int_parse(self):
        self.assertEqual(v.verify_bytes(b'9'*10000)['status'], 'INCONCLUSIVE')

    def test_explicit_replay_operation_bound(self):
        b = v.Budget(); b.operations = v.MAX_OPS
        self.assertEqual(v.verify_coefficients(recurrence_witness(), value(recurrence_witness()), budget=b)['status'], 'INCONCLUSIVE')

    def test_explicit_replay_time_bound_and_nonbytes_refusal(self):
        b = v.Budget(); b.started -= v.SECONDS+1
        self.assertEqual(v.verify_coefficients(recurrence_witness(), value(recurrence_witness()), budget=b)['status'], 'INCONCLUSIVE')
        self.assertEqual(v.verify_bytes('not bytes')['status'], 'REJECTED')


class IntakeAndCLI(unittest.TestCase):
    def test_regular_file_and_symlink_nonregular_refusal(self):
        with tempfile.TemporaryDirectory(prefix='poly19-engineering-') as d:
            p = Path(d)/'input.json'; p.write_bytes(payload())
            self.assertEqual(v.read_regular(p), payload())
            link = Path(d)/'link'; link.symlink_to(p)
            with self.assertRaises(OSError): v.read_regular(link)
            with self.assertRaises(v.InputRefused): v.read_regular(d)
            fifo = Path(d)/'fifo'; os.mkfifo(fifo)
            with self.assertRaises(v.InputRefused): v.read_regular(fifo)

    def test_file_size_refusal(self):
        with tempfile.TemporaryDirectory(prefix='poly19-engineering-') as d:
            p = Path(d)/'big'; p.write_bytes(b' '*16385)
            with self.assertRaises(v.InputRefused): v.read_regular(p)

    def test_bounded_cli_stdin_positive_and_negative(self):
        for data, expected in [(payload(), 0), (b'{"claimed_value":7}', 2), (b' '*16385, 2)]:
            with self.subTest(code=expected):
                r = subprocess.run([sys.executable, str(SOURCE)], input=data, capture_output=True, timeout=5)
                self.assertEqual(r.returncode, expected)
                self.assertIn('scope', json.loads(r.stdout))
                self.assertEqual(r.stderr, b'')

    def test_cli_fifo_does_not_block(self):
        with tempfile.TemporaryDirectory(prefix='poly19-engineering-') as d:
            fifo = Path(d)/'fifo'; os.mkfifo(fifo)
            r = subprocess.run([sys.executable, str(SOURCE), '--input', str(fifo)], capture_output=True, timeout=2)
            self.assertEqual(r.returncode, 2)
            self.assertEqual(json.loads(r.stdout)['status'], 'REJECTED')

    def test_cli_regular_file_and_symlink(self):
        with tempfile.TemporaryDirectory(prefix='poly19-engineering-') as d:
            p = Path(d)/'candidate.json'; p.write_bytes(payload())
            link = Path(d)/'link'; link.symlink_to(p)
            for target, expected in [(p, 0), (link, 2)]:
                with self.subTest(expected=expected):
                    r = subprocess.run([sys.executable, str(SOURCE), '--input', str(target)], capture_output=True, timeout=5)
                    self.assertEqual(r.returncode, expected)
                    self.assertEqual(r.stderr, b'')


if __name__ == '__main__':
    unittest.main()
