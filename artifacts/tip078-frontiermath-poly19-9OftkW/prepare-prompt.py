#!/usr/bin/env python3
"""Lossless deterministic same-arm prompt assembly; no model invocation."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path('/private/tmp/hiveos-tip078-poly19-9OftkW')
STAGES = {
    'ATTEMPT': 'Produce your original proof attempt under the policy and remaining allowance. No external artifacts are provided. State essential unresolved gaps honestly.',
    'CRITIC': 'Independently criticize the same-arm original attempt below. Check every essential implication and boundary case. Do not assume it is correct. Return specific justified objections or support; this criticism is not the final submission.',
    'FINAL': 'Use only the same-arm original attempt and criticism below. Produce your final complete proof or explicitly identify remaining essential gaps. This last completed revision is the immutable submission; no later repair is permitted.'}


def read(path, cap):
    if path.is_symlink() or not path.is_file():
        raise ValueError('Regular explicit input required')
    with path.open('rb') as f:
        data = f.read(cap + 1)
    if len(data) > cap:
        raise ValueError('Input byte ceiling')
    data.decode('utf8')
    return data


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--task', choices=['POLY19'], required=True)
    p.add_argument('--arm', choices=['DIRECT', 'METHOD'], required=True)
    p.add_argument('--stage', choices=list(STAGES), required=True)
    p.add_argument('--registration-sha', required=True)
    p.add_argument('--remaining-seconds', type=float, required=True)
    p.add_argument('--remaining-tools', type=int, required=True)
    p.add_argument('--remaining-tool-seconds', type=float, required=True)
    p.add_argument('--remaining-trace-bytes', type=int, required=True)
    p.add_argument('--out', type=Path, required=True)
    p.add_argument('--artifact', action='append', type=Path, default=[])
    a = p.parse_args()
    if not 0 < a.remaining_seconds <= 600:
        p.error('Remaining operator time must be positive and at most600seconds')
    if not (0 <= a.remaining_tools <= 12 and 0 <= a.remaining_tool_seconds <= 120 and 0 < a.remaining_trace_bytes <= 524288):
        p.error('Remaining cumulative tools/trace outside bound')
    reg_bytes = read(ROOT/'registration.json', 16384)
    if digest(reg_bytes) != a.registration_sha:
        raise ValueError('Registration drift')
    reg = json.loads(reg_bytes)
    if reg['study'] != 'FRONTIERMATH_POLY19_078':
        raise ValueError('Wrong study')
    expected = [] if a.stage == 'ATTEMPT' else ['ATTEMPT'] if a.stage == 'CRITIC' else ['ATTEMPT', 'CRITIC']
    paths = [ROOT/f'{a.task.lower()}-{a.arm.lower()}-{s.lower()}'/'original-final.txt' for s in expected]
    if a.artifact != paths:
        raise ValueError('Only exact same-arm preceding artifacts allowed, in stage order')
    if not a.out.is_absolute() or a.out.parent.resolve() != ROOT or a.out.exists() or a.out.is_symlink():
        raise ValueError('New task-root prompt file required')
    parts, pins = [], {}
    for name in ['common-policy.txt', f'{a.arm.lower()}-policy.txt', f'{a.task.lower()}.txt']:
        data = read(ROOT/name, 16384)
        if digest(data) != reg['pins'][name]:
            raise ValueError('Sealed input drift')
        parts.append(data)
        pins[name] = digest(data)
    parts.append(STAGES[a.stage].encode('utf8'))
    position = {'ATTEMPT': 1, 'CRITIC': 2, 'FINAL': 3}[a.stage]
    parts.append((f'OPERATOR RESOURCE NOTICE: This is request position {position} '
                  f'({a.stage}) in the fixed three-request pipeline. Remaining '
                  f'operator time ceiling for this request is {a.remaining_seconds:g} '
                  f'seconds. Remaining cumulative computational commands {a.remaining_tools}, '
                  f'command elapsed {a.remaining_tool_seconds:g} seconds (each<=30s), '
                  f'retained trace {a.remaining_trace_bytes} bytes. '
                  'This does not refresh the arm or cohort deadline. '
                  'Work only within the same sealed policy and remaining allowance.').encode())
    for stage, path in zip(expected, paths):
        receipt = json.loads(read(path.parent/'receipt.json', 32768))
        if receipt['session'] != f'{a.task}_{a.arm}_{stage}' or receipt['outcome'] != 'CAPTURED_ORIGINAL_UNGRADED':
            raise ValueError('Artifact session/outcome binding refused')
        data = read(path, 32768)
        if digest(data) != receipt['originalFinalSha256'] or len(data) != receipt['originalFinalBytes']:
            raise ValueError('Original artifact drift')
        pins[str(path)] = digest(data)
        parts.extend([f'SAME-ARM ORIGINAL {stage}:'.encode(), data])
    prompt = b'\n\n'.join(parts) + b'\n'
    if len(prompt) > 131072:
        raise ValueError('Prompt byte ceiling')
    meta = a.out.with_name(a.out.name+'.json')
    if meta.exists() or meta.is_symlink():
        raise ValueError('New metadata file required')
    with meta.open('x', encoding='utf8') as f:
        json.dump({'task': a.task, 'arm': a.arm, 'stage': a.stage,
                   'registrationSha256': a.registration_sha, 'inputPins': pins,
                   'literalStage': STAGES[a.stage], 'promptBytes': len(prompt),
                   'requestPosition': position, 'remainingSeconds': a.remaining_seconds,
                   'remainingTools': a.remaining_tools, 'remainingToolSeconds': a.remaining_tool_seconds,
                   'remainingTraceBytes': a.remaining_trace_bytes,
                   'promptSha256': digest(prompt)}, f, indent=2)
    with a.out.open('xb') as f:
        f.write(prompt)
    print(json.dumps({'promptBytes': len(prompt), 'promptSha256': digest(prompt)}))


if __name__ == '__main__':
    main()
