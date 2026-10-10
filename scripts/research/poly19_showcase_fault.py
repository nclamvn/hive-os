"""Explicit ENGINEERING_ONLY same-scalar changed-coefficient artifact.

Never replaces the original certificate. Fixed transformation, no eval/exec.
"""
import json
import sys

raw = sys.stdin.buffer.read(16385)
if len(raw) > 16384:
    raise SystemExit(2)
def unique(pairs):
    value = {}
    for key, entry in pairs:
        if key in value:
            raise ValueError('duplicate key')
        value[key] = entry
    return value

certificate = json.loads(raw, object_pairs_hook=unique)
if (type(certificate) is not dict or set(certificate) != {'coefficients', 'claimed_value'}
        or type(certificate['coefficients']) is not list or len(certificate['coefficients']) != 20
        or any(type(c) is not int or c.bit_length() > 256 for c in certificate['coefficients'])
        or type(certificate['claimed_value']) is not int or certificate['claimed_value'].bit_length() > 512):
    raise SystemExit(2)
coefficients = certificate['coefficients'][:]
# 361*x^3 - x^5 vanishes at x=19, preserves oddness/monicity/linear coefficient.
coefficients[3] += 361
coefficients[5] -= 1
print(json.dumps({'coefficients': coefficients, 'claimed_value': certificate['claimed_value']}, separators=(',', ':')))
