#!/usr/bin/env python3
"""Exact supported Poly19 construction replay, not an official benchmark verifier.

Input: <=16KiB JSON {coefficients: 20 ascending Z entries, claimed_value: Z}.
Integer witnesses are only a subset of the real-coefficient task. No eval/exec,
float arithmetic, numeric-answer table, candidate factorization or model vote.
"""
import argparse
import hashlib
import json
import os
import signal
import stat
import sys
import time

MAX_BYTES = 16384
MAX_OPS = 2000000
SECONDS = 30
ZERO = (0,) * 18
ONE = (1,) + (0,) * 17
SCOPE = 'Exact submitted integer Poly19 cyclotomic construction, not all real witnesses'
ASSUMPTIONS = [
    'Phi19 is irreducible; its quotient embeds injectively in C',
    'Nonzero (s^2-4)*(y^2-4) has simple zeros and is not a square in C(y)',
    'Quadratic discriminant criterion and Gauss lemma give affine irreducibility',
    'Distinct monic factors are nonassociate; projective closure is irreducible',
    'Bihomogenization has no boundary divisor and total bidegree (19,19)',
]


class Unsupported(ValueError):
    pass


class InputRefused(ValueError):
    pass


class ReplayBound(ValueError):
    pass


class Budget:
    def __init__(self):
        self.started = time.monotonic()
        self.operations = 0

    def tick(self, count=1):
        self.operations += count
        if self.operations > MAX_OPS or time.monotonic() - self.started > SECONDS:
            raise ReplayBound('Exact replay operation/time bound')


class Ring:
    """Z[z]/Phi19 in the fixed basis 1,z,...,z^17."""
    def __init__(self, budget):
        self.budget = budget

    def integer(self, n):
        return (n,) + (0,) * 17

    def power_z(self, n):
        n %= 19
        if n == 18:
            return (-1,) * 18
        return tuple(int(i == n) for i in range(18))

    def add(self, a, b):
        self.budget.tick(18)
        return tuple(x + y for x, y in zip(a, b))

    def neg(self, a):
        self.budget.tick(18)
        return tuple(-x for x in a)

    def mul(self, a, b):
        # z^19=1, followed by z^18=-(1+...+z^17), both exact Phi19 relations.
        residues = [0] * 19
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b):
                    if y:
                        self.budget.tick()
                        residues[(i+j) % 19] += x*y
        self.budget.tick(18)
        return tuple(residues[i]-residues[18] for i in range(18))


def poly_mul(a, b, ring):
    result = {}
    for (i, j), x in a.items():
        for (k, l), y in b.items():
            power = (i+k, j+l)
            coefficient = ring.add(result.get(power, ZERO), ring.mul(x, y))
            if coefficient == ZERO:
                result.pop(power, None)
            else:
                result[power] = coefficient
    return result


def factor_certificate(coefficients, budget):
    ring = Ring(budget)
    values = [ring.add(ring.power_z(k), ring.power_z(19-k)) for k in range(1, 10)]
    if len(set(values)) != 9:
        return False, False, False
    constants = [ring.add(ring.mul(s, s), ring.integer(-4)) for s in values]
    if any(c == ZERO for c in constants):
        return False, True, False
    product = {(1, 0): ONE, (0, 1): ring.integer(-1)}
    for s, c in zip(values, constants):
        q = {(2, 0): ONE, (0, 2): ONE, (1, 1): ring.neg(s), (0, 0): c}
        product = poly_mul(product, q, ring)
    difference = {}
    for degree, coefficient in enumerate(coefficients[1:], 1):
        if coefficient:
            difference[(degree, 0)] = ring.integer(coefficient)
            difference[(0, degree)] = ring.integer(-coefficient)
    # Dictionary equality checks EVERY monomial/basis coefficient, not samples.
    budget.tick(18 * len(set(product) | set(difference)))
    return product == difference, True, True


def result(status, reason, digest, budget, **details):
    return {'status': status, 'reason': reason, 'scope': SCOPE,
            'assumptions': ASSUMPTIONS, 'candidateSha256': digest,
            'measurements': {'elapsedSeconds': time.monotonic()-budget.started,
                             'exactArithmeticOperations': budget.operations},
            'officialScore': 'NOT_ESTABLISHED', 'formalProof': 'NOT_ESTABLISHED',
            **details}


def verify_coefficients(coefficients, claimed_value, candidate_digest=None, budget=None):
    budget = budget or Budget()
    try:
        if (type(coefficients) is not list or len(coefficients) != 20 or
                any(type(c) is not int or c.bit_length() > 256 for c in coefficients) or
                type(claimed_value) is not int or claimed_value.bit_length() > 512):
            raise Unsupported('Only bounded integer coefficient/value witnesses supported')
        if (coefficients[19] != 1 or coefficients[1] != -19 or
                any(coefficients[i] != 0 for i in range(0, 20, 2))):
            return result('REJECTED', 'TASK_NORMALIZATION_FAILED', candidate_digest, budget)
        computed = 0
        for coefficient in reversed(coefficients):
            budget.tick(2)
            computed = computed*19 + coefficient
        if computed != claimed_value:
            return result('REJECTED', 'CLAIMED_VALUE_MISMATCH', candidate_digest, budget)
        identity, distinct, nondegenerate = factor_certificate(coefficients, budget)
        if not identity or not distinct or not nondegenerate:
            return result('INCONCLUSIVE', 'SUPPORTED_CERTIFICATE_NOT_ESTABLISHED', candidate_digest,
                          budget, factorIdentity=identity, distinctS=distinct,
                          nondegenerateQuadratics=nondegenerate)
        return result('VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION', 'EXACT_IDENTITY_UNDER_DOCUMENTED_LEMMA',
                      candidate_digest, budget, factorIdentity=True, distinctS=True,
                      nondegenerateQuadratics=True, irreducibleComponentsUnderLemma=10,
                      nonlinearComponentsUnderLemma=9, computedValue=computed)
    except (Unsupported, ReplayBound) as exc:
        return result('INCONCLUSIVE', str(exc), candidate_digest, budget)


def parse_integer(text):
    if len(text.lstrip('-')) > 155:
        raise Unsupported('JSON integer outside supported bit domain')
    return int(text)


def no_float(text):
    raise Unsupported('Noninteger JSON domain unsupported')


def unique_object(pairs):
    obj = {}
    for key, value in pairs:
        if key in obj:
            raise InputRefused('Duplicate JSON key')
        obj[key] = value
    return obj


def verify_bytes(raw):
    budget = Budget()
    digest = hashlib.sha256(raw).hexdigest() if type(raw) is bytes else None
    try:
        if type(raw) is not bytes or len(raw) > MAX_BYTES:
            raise InputRefused('Input byte ceiling')
        obj = json.loads(raw.decode('utf8'), object_pairs_hook=unique_object,
                         parse_int=parse_integer, parse_float=no_float, parse_constant=no_float)
        if type(obj) is not dict or set(obj) != {'coefficients', 'claimed_value'}:
            raise Unsupported('Exact coefficients and claimed_value certificate required')
        return verify_coefficients(obj['coefficients'], obj['claimed_value'], digest, budget)
    except (Unsupported, ReplayBound) as exc:
        return result('INCONCLUSIVE', str(exc), digest, budget)
    except (InputRefused, ValueError, UnicodeError, RecursionError):
        return result('REJECTED', 'STRICT_BOUNDED_JSON_REFUSED', digest, budget)


def read_regular(path):
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    try:
        initial = os.fstat(fd)
        if not stat.S_ISREG(initial.st_mode) or initial.st_size > MAX_BYTES:
            raise InputRefused('Bounded regular file required')
        chunks, total = [], 0
        while True:
            chunk = os.read(fd, min(4096, MAX_BYTES+1-total))
            if not chunk:
                break
            total += len(chunk)
            if total > MAX_BYTES:
                raise InputRefused('Input growth/byte ceiling')
            chunks.append(chunk)
        if os.fstat(fd).st_size != initial.st_size or total != initial.st_size:
            raise InputRefused('Input changed during bounded intake')
        return b''.join(chunks)
    finally:
        os.close(fd)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', help='Explicit regular non-symlink JSON file; default bounded stdin')
    args = parser.parse_args()
    budget = Budget()
    def timeout(signum, frame):
        raise ReplayBound('Process30second deadline')
    signal.signal(signal.SIGALRM, timeout)
    signal.alarm(SECONDS)
    try:
        raw = read_regular(args.input) if args.input else sys.stdin.buffer.read(MAX_BYTES+1)
        output = verify_bytes(raw)
    except ReplayBound as exc:
        output = result('INCONCLUSIVE', str(exc), None, budget)
    except (InputRefused, OSError):
        output = result('REJECTED', 'BOUNDED_REGULAR_INPUT_REFUSED', None, budget)
    finally:
        signal.alarm(0)
    print(json.dumps(output, sort_keys=True))
    return 0 if output['status'] == 'VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION' else 2


if __name__ == '__main__':
    raise SystemExit(main())
