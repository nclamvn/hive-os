#!/usr/bin/env python3
"""One external eight-request cohort. Create-only admission; no resume/retries."""
import argparse
import datetime as dt
import importlib.util
import math
import signal
import subprocess
import sys
import time
from pathlib import Path

def module(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), Path(__file__).with_name(name + '.py'))
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value

io = module('study-io')
ROOT = io.ROOT
SOURCES = ['run-session.py', 'prepare-prompt.py', 'prepare-review.py', 'study-io.py',
           'run-study.py', 'extract-candidate.py', 'replay-candidate.py', 'frontiermath_poly19_verifier.py']

class Stop(Exception):
    pass

class Budget:
    def __init__(self, deadline, commands):
        self.deadline, self.commands = deadline, commands
        self.tools, self.tool_seconds, self.trace = 0, 0.0, 0
    def allowance(self, now, cohort):
        seconds = min(self.deadline, cohort) - now
        if seconds <= 0 or self.trace >= 524288:
            raise Stop('Unchanged deadline/trace exhausted')
        return {'seconds': seconds, 'tool_limit': self.commands-self.tools,
                'tool_seconds': 120-self.tool_seconds, 'trace_cap': 524288-self.trace}
    def debit(self, receipt):
        if receipt.get('outcome') != 'CAPTURED_ORIGINAL_UNGRADED' or receipt.get('cancellationEffect') is not None:
            raise Stop('Failed/unknown capture stops cohort; no retry')
        n, seconds, trace = receipt.get('observedToolCount'), receipt.get('observedToolSeconds'), receipt.get('capturedBytes', {}).get('stdout')
        if type(n) is not int or n < 0 or type(trace) is not int or trace < 0 or type(seconds) not in (int, float) or not math.isfinite(seconds) or seconds < 0:
            raise Stop('Invalid observed accounting')
        self.tools += n
        self.tool_seconds += seconds
        self.trace += trace
        if self.tools > self.commands or self.tool_seconds > 120 or self.trace > 524288 or receipt.get('activeToolCountAtStop') != 0:
            raise Stop('Cumulative observed allowance exceeded')
        if receipt.get('endedMonotonic', math.inf) > self.deadline:
            raise Stop('Actual original beyond unchanged phase deadline')

def fixed_cohort_deadline(reg, utc_now, monotonic_now):
    if reg.get('cohortSeconds') != 2700:
        raise Stop('Exact45minute cohort required')
    admitted = dt.datetime.fromisoformat(reg['admissionUtc'].replace('Z', '+00:00'))
    if admitted.utcoffset() != dt.timedelta(0):
        raise Stop('UTC admission required')
    admitted = admitted.timestamp()
    if admitted > utc_now:
        raise Stop('Future admission refused')
    remaining = admitted + 2700 - utc_now
    if remaining <= 0:
        raise Stop('Cohort already expired')
    return monotonic_now + remaining

def supervise(argv, timeout):
    """Forward controller interruption to reviewed child capture cleanup."""
    proc = None
    def cancel(signum, frame):
        raise KeyboardInterrupt(signal.Signals(signum).name)
    previous = {s: signal.signal(s, cancel) for s in (signal.SIGINT, signal.SIGTERM)}
    try:
        mask = signal.pthread_sigmask(signal.SIG_BLOCK, set(previous))
        try:
            proc = subprocess.Popen(argv, preexec_fn=lambda: signal.pthread_sigmask(signal.SIG_SETMASK, mask))
        finally:
            signal.pthread_sigmask(signal.SIG_SETMASK, mask)
        return proc.wait(timeout=max(0.01, timeout))
    except BaseException:
        for s in previous:
            signal.signal(s, signal.SIG_IGN)
        if proc and proc.poll() is None:
            proc.send_signal(signal.SIGTERM)
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait(timeout=2)
        raise
    finally:
        for s, handler in previous.items():
            signal.signal(s, handler)

def helper(root, name, args, timeout=30):
    code = supervise([sys.executable, '-I', '-B', str(root/name), *args], timeout)
    if code != 0:
        raise Stop('Helper refused: ' + name)

def invoke(root, prompt, directory, identity, ordinal, remaining):
    args = ['--prompt', str(prompt), '--out', str(directory), '--session', identity,
            '--ordinal', str(ordinal), '--seconds', str(remaining['seconds']),
            '--tool-limit', str(remaining['tool_limit']), '--tool-seconds', str(remaining['tool_seconds']),
            '--trace-cap', str(remaining['trace_cap'])]
    # Capture controller owns cancellation/receipt. Outer grace only for cleanup,
    # never added to the submitted per-session or fixed phase deadline.
    code = supervise([sys.executable, '-I', '-B', str(root/'run-session.py'), *args], remaining['seconds']+5)
    receipt = io.strict_json(io.read(directory/'receipt.json', 32768))
    if code != 0:
        raise Stop('Capture refusal retained; STOP')
    return receipt

def consumed(root):
    count = 0
    identities = [f'POLY19_{arm}_{stage}' for arm in ['DIRECT','METHOD'] for stage in ['ATTEMPT','CRITIC','FINAL']]
    identities += ['POLY19_REVIEW_1', 'POLY19_REVIEW_2']
    for ordinal, identity in enumerate(identities, 1):
        directory = root/identity.lower().replace('_','-')
        path = directory/'reservation.json'
        if not path.exists():
            path = directory/'receipt.json'
        if not path.exists():
            continue
        record = io.strict_json(io.read(path,32768))
        if record.get('session') != identity or record.get('requestOrdinal') != ordinal or record.get('reservedBeforeSpawn') is not True:
            raise Stop('Consumed request identity drift')
        count += 1  # visible permanently consumed reservation, not actual/hidden provider calls
    return count

def notice_args(remaining):
    return ['--remaining-seconds', str(remaining['seconds']),
            '--remaining-tools', str(remaining['tool_limit']),
            '--remaining-tool-seconds', str(remaining['tool_seconds']),
            '--remaining-trace-bytes', str(remaining['trace_cap'])]

def run(root, expected, dispatch=invoke, prepare=helper, clock=time.monotonic, utc=time.time):
    reg = io.registration(root, expected)
    for name in SOURCES:
        io.pinned(root, reg, name, 131072)
    cohort = fixed_cohort_deadline(reg, utc(), clock())
    io.create(root/'study-start.json', {'registrationSha256': expected, 'study': io.STUDY,
              'cohortDeadlineMonotonic': cohort, 'admissionUtc': reg['admissionUtc'],
              'startedMonotonic': clock(), 'requests': 8, 'resume': 'FORBIDDEN'})
    sequence, ordinal, slots_reserved = 0, 0, 0
    def event(kind, **detail):
        nonlocal sequence
        sequence += 1
        io.create(root/f'controller-{sequence:03d}.json', {'kind': kind, 'atMonotonic': clock(), **detail})
        print(kind, flush=True)
    try:
        for arm in ['DIRECT', 'METHOD']:
            budget = Budget(min(cohort, clock()+600), 12)
            event('ARM_ADMITTED', arm=arm, deadlineMonotonic=budget.deadline)
            artifacts = []
            for stage in ['ATTEMPT', 'CRITIC', 'FINAL']:
                ordinal += 1
                identity = f'POLY19_{arm}_{stage}'
                prompt = root/(identity.lower()+'.prompt.txt')
                args = ['--task', 'POLY19', '--arm', arm, '--stage', stage,
                        '--registration-sha', expected, '--out', str(prompt)]
                args += notice_args(budget.allowance(clock(), cohort))
                for artifact in artifacts:
                    args += ['--artifact', str(artifact)]
                prepare(root, 'prepare-prompt.py', args)
                remaining = budget.allowance(clock(), cohort)
                directory = root/identity.lower().replace('_', '-')
                slots_reserved += 1
                event('REQUEST_RESERVED', ordinal=ordinal, identity=identity, remaining=remaining)
                receipt = dispatch(root, prompt, directory, identity, ordinal, remaining)
                if receipt.get('session') != identity or receipt.get('requestOrdinal') != ordinal:
                    raise Stop('Receipt slot identity drift')
                budget.debit(receipt)
                event('REQUEST_CAPTURED', ordinal=ordinal, tools=budget.tools, toolSeconds=budget.tool_seconds, traceBytes=budget.trace)
                artifacts.append(directory/'original-final.txt')
        io.finals(root)  # both lock BEFORE any postgrading or certificate extraction
        event('BOTH_FINALS_SEALED')
        for arm in ['DIRECT', 'METHOD']:
            if clock() >= cohort:
                raise Stop('Cohort expired before replay')
            # Extraction refusal is an unsupported submission, not a repaired one.
            try:
                prepare(root, 'extract-candidate.py', ['--arm', arm, '--registration-sha', expected])
            except Stop as exc:
                event('EXTRACTION_REFUSED', arm=arm, reason=str(exc))
                continue
            seconds = min(30, cohort-clock())
            if seconds <= 0:
                raise Stop('Cohort expired before exact replay')
            prepare(root, 'replay-candidate.py', ['--arm', arm, '--registration-sha', expected, '--seconds', str(seconds)], timeout=seconds+1)
            event('CERTIFICATE_REPLAY_RETAINED', arm=arm, candidate=str(root/(arm.lower()+'-candidate.json')))
        review = Budget(min(cohort, clock()+480), 4)
        event('POSTGRADE_ADMITTED', deadlineMonotonic=review.deadline)
        for reviewer in [1, 2]:
            ordinal += 1
            identity = f'POLY19_REVIEW_{reviewer}'
            prompt = root/(identity.lower()+'.prompt.txt')
            notice = notice_args(review.allowance(clock(), cohort))
            prepare(root, 'prepare-review.py', ['--reviewer', str(reviewer), '--registration-sha', expected, '--out', str(prompt), *notice])
            remaining = review.allowance(clock(), cohort)
            slots_reserved += 1
            event('REQUEST_RESERVED', ordinal=ordinal, identity=identity, remaining=remaining)
            receipt = dispatch(root, prompt, root/identity.lower().replace('_', '-'), identity, ordinal, remaining)
            if receipt.get('session') != identity or receipt.get('requestOrdinal') != ordinal:
                raise Stop('Reviewer slot identity drift')
            review.debit(receipt)
            event('REVIEW_CAPTURED', ordinal=ordinal, tools=review.tools, toolSeconds=review.tool_seconds, traceBytes=review.trace)
        event('COHORT_CLOSED', requestsConsumed=consumed(root), slotsReserved=slots_reserved, modelResultScope='PUBLIC_SAMPLE_EXTERNAL_OBSERVATIONAL')
        return 0
    except BaseException as exc:
        try:
            used = consumed(root)
        except Exception:
            used = 'UNKNOWN_IDENTITY_DRIFT'
        event('STOP', requestsConsumed=used, slotsReserved=slots_reserved, failedSlotOrdinal=ordinal,
              reason=type(exc).__name__+': '+str(exc), retry='FORBIDDEN')
        return 2

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--execute', action='store_true', required=True)
    p.add_argument('--registration-sha', required=True)
    a = p.parse_args()
    return run(ROOT, a.registration_sha)

if __name__ == '__main__':
    raise SystemExit(main())
