#!/usr/bin/env python3
"""Bounded trusted-verifier replay; both originals seal first, no model call."""
import argparse
import importlib.util
import subprocess
import sys
import time
from pathlib import Path

def module(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), Path(__file__).with_name(name+'.py'))
    obj = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(obj)
    return obj

io, extraction = module('study-io'), module('extract-candidate')

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--arm', choices=['DIRECT', 'METHOD'], required=True)
    p.add_argument('--registration-sha', required=True)
    p.add_argument('--seconds', type=float, required=True)
    a = p.parse_args()
    if not 0 < a.seconds <= 30:
        p.error('Replay at most30seconds')
    reg = io.registration(io.ROOT, a.registration_sha)
    io.pinned(io.ROOT, reg, 'frontiermath_poly19_verifier.py', 131072)
    originals, seals = io.finals(io.ROOT)
    candidate = io.ROOT/(a.arm.lower()+'-candidate.json')
    raw = io.read(candidate, 16384)
    if raw != extraction.extract(originals[a.arm]):
        raise ValueError('Extracted bytes drifted from original')
    start = time.monotonic()
    reservation = io.ROOT/(a.arm.lower()+'-replay-reserved.json')
    io.create(reservation, {'bothOriginalSeals': seals, 'candidateSha256': io.sha(raw),
              'seconds': a.seconds, 'startedMonotonic': start, 'scope': 'SEPARATE_POSTGRADE_EXACT_CERTIFICATE'})
    try:
        proc = subprocess.run([sys.executable, '-I', '-B', str(io.ROOT/'frontiermath_poly19_verifier.py'), '--input', str(candidate)],
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=a.seconds)
        stdout, stderr, code, outcome = proc.stdout, proc.stderr, proc.returncode, 'RETURNED'
    except subprocess.TimeoutExpired as exc:
        stdout, stderr, code, outcome = exc.stdout or b'', exc.stderr or b'', None, 'TIMEOUT_INCONCLUSIVE'
    if len(stdout) > 65536 or len(stderr) > 65536:
        raise ValueError('Trusted replay output ceiling')
    for suffix, data in [('stdout.json', stdout), ('stderr.bin', stderr)]:
        with (io.ROOT/(a.arm.lower()+'-replay-'+suffix)).open('xb') as stream:
            stream.write(data)
    io.create(io.ROOT/(a.arm.lower()+'-replay-receipt.json'), {'candidateSha256': io.sha(raw),
              'outcome': outcome, 'exitCode': code, 'elapsedSeconds': time.monotonic()-start,
              'stdoutSha256': io.sha(stdout), 'stderrSha256': io.sha(stderr),
              'mathematicalAcceptance': 'ONLY_VERIFIER_SCOPED_RESULT_NOT_MODEL_VOTE'})
    return 0  # rejected/inconclusive witness stays in denominator, not retried

if __name__ == '__main__':
    raise SystemExit(main())
