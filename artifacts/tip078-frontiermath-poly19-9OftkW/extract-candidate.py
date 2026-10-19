#!/usr/bin/env python3
"""Lossless one-fenced-JSON extraction, only after BOTH original finals seal."""
import argparse
import importlib.util
import re
from pathlib import Path

spec = importlib.util.spec_from_file_location('study_io', Path(__file__).with_name('study-io.py'))
io = importlib.util.module_from_spec(spec)
spec.loader.exec_module(io)

def extract(original):
    text = original.decode('utf8')
    blocks = re.findall(r'^```json[ \t]*\r?\n(.*?)^```[ \t]*\r?$', text, flags=re.MULTILINE | re.DOTALL)
    if len(blocks) != 1 or len(re.findall(r'^```json\b', text, flags=re.MULTILINE)) != 1:
        raise ValueError('Exactly one complete fenced json block required')
    raw = blocks[0].encode('utf8')
    if len(raw) > 16384:
        raise ValueError('Candidate byte bound')
    io.strict_json(raw)  # no normalization, corrections, coercion or execution
    return raw

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--arm', choices=['DIRECT', 'METHOD'], required=True)
    p.add_argument('--registration-sha', required=True)
    a = p.parse_args()
    io.registration(io.ROOT, a.registration_sha)
    originals, seals = io.finals(io.ROOT)
    raw = extract(originals[a.arm])
    out = io.ROOT / (a.arm.lower() + '-candidate.json')
    io.create(out.with_name(out.name + '.meta.json'), {'bothOriginalSeals': seals,
              'arm': a.arm, 'candidateSha256': io.sha(raw), 'candidateBytes': len(raw),
              'extraction': 'ORIGINAL_FENCED_BYTES_NO_FIX'})
    with out.open('xb') as stream:
        stream.write(raw)
    print(io.sha(raw))

if __name__ == '__main__':
    main()
