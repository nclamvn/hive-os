"""Bounded fixed-path observations, never proof or provider authority."""
import hashlib
import json
import os
import stat
from pathlib import Path

ROOT = Path('/private/tmp/hiveos-tip078-poly19-9OftkW')
STUDY = 'FRONTIERMATH_POLY19_078'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def read(path, cap):
    path = Path(path)
    if path.parent.is_symlink():
        raise ValueError('Symlink input directory')
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    try:
        if not stat.S_ISREG(os.fstat(fd).st_mode):
            raise ValueError('Regular input required')
        data = bytearray()
        while len(data) <= cap:
            block = os.read(fd, min(4096, cap + 1 - len(data)))
            if not block:
                break
            data.extend(block)
        if len(data) > cap:
            raise ValueError('Input byte ceiling')
        return bytes(data)
    finally:
        os.close(fd)

def strict_json(data):
    def pairs(items):
        out = {}
        for key, value in items:
            if key in out:
                raise ValueError('Duplicate JSON key')
            out[key] = value
        return out
    return json.loads(data, object_pairs_hook=pairs,
                      parse_constant=lambda _: (_ for _ in ()).throw(ValueError('Nonfinite JSON')))

def registration(root, expected):
    raw = read(root / 'registration.json', 16384)
    if sha(raw) != expected:
        raise ValueError('Registration drift')
    reg = strict_json(raw)
    if reg.get('study') != STUDY or not isinstance(reg.get('pins'), dict):
        raise ValueError('Wrong study registration')
    return reg

def pinned(root, reg, name, cap=131072):
    if Path(name).name != name or name in {'.', '..'}:
        raise ValueError('Immediate-root pinned name required')
    raw = read(root / name, cap)
    if sha(raw) != reg['pins'].get(name):
        raise ValueError('Sealed input drift: ' + name)
    return raw

def finals(root):
    originals, seals = {}, {}
    for arm, ordinal in [('DIRECT', 3), ('METHOD', 6)]:
        directory = root / ('poly19-' + arm.lower() + '-final')
        raw = read(directory / 'receipt.json', 32768)
        receipt = strict_json(raw)
        if (receipt.get('session') != 'POLY19_' + arm + '_FINAL' or
                receipt.get('requestOrdinal') != ordinal or
                receipt.get('outcome') != 'CAPTURED_ORIGINAL_UNGRADED' or
                receipt.get('exitCode') != 0 or
                receipt.get('requestConsumed') is not True or
                receipt.get('reservedBeforeSpawn') is not True):
            raise ValueError('Both original finals must be sealed')
        original = read(directory / 'original-final.txt', 32768)
        if sha(original) != receipt.get('originalFinalSha256') or len(original) != receipt.get('originalFinalBytes'):
            raise ValueError('Original final seal drift')
        originals[arm] = original
        seals[arm] = {'ordinal': ordinal, 'originalSha256': sha(original),
                      'receiptSha256': sha(raw), 'bytes': len(original)}
    return originals, seals

def create(path, value):
    with Path(path).open('x', encoding='utf8') as stream:
        json.dump(value, stream, indent=2)
        stream.write('\n')
