#!/usr/bin/env python3
"""TIP077 external observational capture; one consumed request, never a retry.
Main supplies remaining cross-session deadlines/quotas. Observed CLI events are
not hidden-call telemetry, an OS-hard compute cap, or complete filesystem policy.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import selectors
import shutil
import signal
import subprocess
import threading
import time

ROOT = Path('/private/tmp/hiveos-tip077-pilot-NqivSV')
CAPS = {'stdout': 512 * 1024, 'stderr': 64 * 1024}
FORBIDDEN = {'web_search', 'web_search_call', 'mcp_tool_call', 'file_change'}
BAD_COMMAND = re.compile(r'\b(curl|wget|git|npm|npx|pip|ssh|scp|codex)\b|https?://|/(Users|Applications|private|tmp|etc|var|home|Volumes)/|\.\./|\b(open|Path|read_text|read_bytes|readFile|os\.listdir|glob|fileinput)\b|\b(rm|mv|cp|tee|touch|mkdir|chmod)\b|(?<![<>=])>(?![=])')


class Cancelled(BaseException):
    pass


def cancel(signum, frame):
    raise Cancelled(signal.Signals(signum).name)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def wall():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def dump(path, value):
    with path.open('x', encoding='utf8') as f:
        json.dump(value, f, ensure_ascii=False, indent=2)
        f.write('\n')


def bounded_prompt(path):
    if path.is_symlink() or not path.is_file():
        raise ValueError('Prompt must be an explicit regular file')
    with path.open('rb') as f:
        data = f.read(131073)
    if len(data) > 131072:
        raise ValueError('Prompt exceeds 128KiB controller intake')
    data.decode('utf8')
    return data


def arguments():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--prompt', required=True, type=Path)
    p.add_argument('--out', required=True, type=Path)
    p.add_argument('--ordinal', required=True, type=int)
    p.add_argument('--session', required=True)
    p.add_argument('--seconds', required=True, type=float)
    p.add_argument('--tool-limit', type=int, default=12)
    p.add_argument('--tool-seconds', type=float, default=120)
    p.add_argument('--trace-cap', type=int, required=True)
    p.add_argument('--codex', default='codex')
    a = p.parse_args()
    if not (1 <= a.ordinal <= 30 and 0 < a.seconds <= 600 and
            0 <= a.tool_limit <= 12 and 0 <= a.tool_seconds <= 120 and
            1 <= a.trace_cap <= CAPS['stdout']):
        p.error('Outside approved per-session remaining envelope')
    if not re.fullmatch(r'[A-Za-z0-9_-]{1,64}', a.session):
        p.error('Bounded session label required')
    if not a.out.is_absolute() or a.out.parent.resolve() != ROOT:
        p.error('New output directory must be an immediate child of task root')
    if a.prompt.resolve().parent != ROOT:
        p.error('Prompt must be a Main-prepared file in the task root')
    return a


def main():
    a = arguments()
    prompt = bounded_prompt(a.prompt)
    binary = shutil.which(a.codex)
    if not binary or not Path(binary).is_file():
        raise ValueError('Existing CLI binary unavailable')
    a.out.mkdir(mode=0o700)  # create-only, no existing output reuse
    cwd = a.out / 'task'
    cwd.mkdir(mode=0o700)  # unique EMPTY task-only cwd
    started, started_wall = time.monotonic(), wall()
    args = [binary, 'exec', '--json', '--ephemeral', '--ignore-user-config',
            '--sandbox', 'read-only', '--skip-git-repo-check', '-C', str(cwd),
            '-c', 'model="gpt-6.1-sol"', '-c', 'model_reasoning_effort="high"',
            '-c', 'service_tier="priority"', '-c', 'web_search="disabled"', '-']
    env = {k: v for k, v in os.environ.items() if k in {
        'PATH', 'HOME', 'USER', 'LOGNAME', 'SHELL', 'LANG', 'LC_ALL', 'TMPDIR',
        'CODEX_HOME'}}  # saved auth location unchanged; API-key env excluded
    reservation = {'requestOrdinal': a.ordinal, 'session': a.session,
                   'reservedBeforeSpawn': True, 'startedWall': started_wall,
                   'startedMonotonic': started, 'promptSha256': sha(prompt),
                   'promptBytes': len(prompt), 'argv': args,
                   'remainingSeconds': a.seconds, 'toolLimit': a.tool_limit,
                   'remainingToolSeconds': a.tool_seconds,
                   'remainingTraceBytes': a.trace_cap,
                   'configuredModel': 'gpt-6.1-sol', 'effort': 'high',
                   'serviceTier': 'priority', 'servedModelVersion': 'UNKNOWN',
                   'scope': 'EXTERNAL_CODEX_ASSISTED_OBSERVATIONAL'}
    dump(a.out / 'reservation.json', reservation)
    trace = (a.out / 'stdout.jsonl').open('xb')
    err = (a.out / 'stderr.bin').open('xb')
    ledger = (a.out / 'host-events.jsonl').open('xb')
    proc = None
    counts = {'stdout': 0, 'stderr': 0}
    active, completed = {}, set()
    tool_count, tool_elapsed, final, usage, thread = 0, 0.0, None, None, None
    pending = bytearray()
    turn_complete, outcome, last_progress = False, 'UNKNOWN_FAILURE', started

    def event(kind, **fields):
        record = {'kind': kind, 'wall': wall(),
                  'elapsed': time.monotonic() - started, **fields}
        raw = (json.dumps(record) + '\n').encode()
        if ledger.tell() + len(raw) > 131072:
            raise ValueError('HOST_LEDGER_CAP')
        ledger.write(raw)
        ledger.flush()

    def receive(line):
        nonlocal tool_count, tool_elapsed, final, usage, thread, turn_complete
        obj = json.loads(line)
        typ, item = obj.get('type'), obj.get('item', {})
        if typ == 'thread.started':
            thread = obj.get('thread_id')
        if typ in {'turn.failed', 'error'}:
            raise ValueError('CLI_REPORTED_FAILURE')
        if typ == 'turn.completed':
            turn_complete, usage = True, obj.get('usage')
        it = item.get('type')
        if it in FORBIDDEN or (it and ('mcp' in it or 'web' in it or 'file' in it)):
            raise ValueError('FORBIDDEN_OBSERVED_TOOL')
        if it == 'command_execution':
            ident = item.get('id')
            if not isinstance(ident, str) or BAD_COMMAND.search(item.get('command', '')):
                raise ValueError('FORBIDDEN_OR_UNBOUND_COMMAND')
            if typ == 'item.started':
                if ident in active or ident in completed:
                    raise ValueError('DUPLICATE_TOOL_ID')
                tool_count += 1
                if tool_count > a.tool_limit:
                    raise ValueError('TOOL_COUNT_CAP')
                active[ident] = time.monotonic()
                event('tool-start', toolId=ident, toolCount=tool_count)
            elif typ == 'item.completed':
                if ident not in active:
                    raise ValueError('UNOBSERVED_TOOL_START')
                elapsed = time.monotonic() - active.pop(ident)
                completed.add(ident)
                tool_elapsed += elapsed
                if elapsed > 60 or tool_elapsed > a.tool_seconds:
                    raise ValueError('OBSERVED_TOOL_TIME_CAP')
                event('tool-end', toolId=ident, observedSeconds=elapsed)
        elif it == 'agent_message' and typ == 'item.completed':
            text = item.get('text')
            if not isinstance(text, str):
                raise ValueError('UNSUPPORTED_AGENT_MESSAGE')
            raw = text.encode('utf8')
            if len(raw) > 32768:
                raise ValueError('ORIGINAL_MESSAGE_CAP')
            final = raw  # last original message; no proof editing/truncation
        elif it not in {None, 'reasoning', 'agent_message', 'todo_list'}:
            raise ValueError('UNKNOWN_ITEM_SCHEMA')

    previous = {s: signal.signal(s, cancel) for s in (signal.SIGINT, signal.SIGTERM)}
    try:
        event('request-reserved', ordinal=a.ordinal)
        old_mask = signal.pthread_sigmask(signal.SIG_BLOCK, set(previous))
        try:
            proc = subprocess.Popen(args, cwd=cwd, env=env, stdin=subprocess.PIPE,
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                    start_new_session=True,
                                    preexec_fn=lambda: signal.pthread_sigmask(signal.SIG_SETMASK, old_mask))
        finally:
            # Deliver pending cancellation only after the handle is assigned.
            signal.pthread_sigmask(signal.SIG_SETMASK, old_mask)
        event('spawned', pid=proc.pid)
        def feed():
            try:
                proc.stdin.write(prompt)
                proc.stdin.close()
            except (BrokenPipeError, OSError):
                pass
        threading.Thread(target=feed, daemon=True).start()
        sel = selectors.DefaultSelector()
        for name, pipe in [('stdout', proc.stdout), ('stderr', proc.stderr)]:
            os.set_blocking(pipe.fileno(), False)
            sel.register(pipe, selectors.EVENT_READ, name)
        while sel.get_map():
            now = time.monotonic()
            if now - started >= a.seconds:
                raise ValueError('OUTER_DEADLINE')
            spans = [now - t for t in active.values()]
            if any(t > 60 for t in spans) or tool_elapsed + sum(spans) > a.tool_seconds:
                raise ValueError('OBSERVED_TOOL_TIME_CAP')
            if now - last_progress >= 5:
                print(json.dumps({'session': a.session, 'elapsed': round(now-started, 1),
                                  'toolCount': tool_count, 'bytes': counts}), flush=True)
                last_progress = now
            for key, _ in sel.select(timeout=0.1):
                block = os.read(key.fileobj.fileno(), 4096)
                if not block:
                    sel.unregister(key.fileobj)
                    continue
                name = key.data
                if counts[name] + len(block) > (a.trace_cap if name == 'stdout' else CAPS[name]):
                    raise ValueError(name.upper() + '_CAP')
                counts[name] += len(block)
                (trace if name == 'stdout' else err).write(block)
                (trace if name == 'stdout' else err).flush()
                if name == 'stdout':
                    pending.extend(block)
                    while b'\n' in pending:
                        line, _, rest = pending.partition(b'\n')
                        pending = bytearray(rest)
                        if line.strip():
                            receive(line.decode('utf8'))
        if pending.strip():
            receive(pending.decode('utf8'))
        code = proc.wait(timeout=max(0.1, a.seconds-(time.monotonic()-started)))
        if code != 0 or active or not turn_complete or final is None:
            raise ValueError('NO_COMPLETE_ORIGINAL_SUBMISSION')
        with (a.out / 'original-final.txt').open('xb') as f:
            f.write(final)
        outcome = 'CAPTURED_ORIGINAL_UNGRADED'
    except BaseException as exc:
        for s in previous:
            signal.signal(s, signal.SIG_IGN)
        outcome = 'CANCELLED_' + str(exc) if isinstance(exc, Cancelled) else str(exc) if isinstance(exc, ValueError) else type(exc).__name__
        if proc:
            try:
                os.killpg(proc.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            try:
                proc.wait(timeout=1)
            except subprocess.TimeoutExpired:
                os.killpg(proc.pid, signal.SIGKILL)
                proc.wait(timeout=2)
            # Parent exit is not proof that its process-group descendants exited.
            try:
                os.killpg(proc.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
    finally:
        for f in (trace, err, ledger):
            f.close()
        receipt = {**reservation, 'endedWall': wall(), 'endedMonotonic': time.monotonic(),
                   'elapsedSeconds': time.monotonic()-started, 'outcome': outcome,
                   'exitCode': proc.returncode if proc else None, 'requestConsumed': True,
                   'cancellationEffect': 'UNKNOWN' if outcome != 'CAPTURED_ORIGINAL_UNGRADED' else None,
                   'threadId': thread, 'cliReportedUsage': usage, 'hiddenCalls': 'UNKNOWN',
                   'observedToolCount': tool_count, 'observedToolSeconds': tool_elapsed,
                   'activeToolCountAtStop': len(active), 'capturedBytes': counts,
                   'originalFinalBytes': len(final) if final is not None else None,
                   'originalFinalSha256': sha(final) if final is not None else None,
                   'traceSha256': sha((a.out/'stdout.jsonl').read_bytes()),
                   'stderrSha256': sha((a.out/'stderr.bin').read_bytes())}
        dump(a.out / 'receipt.json', receipt)
        print(json.dumps({'session': a.session, 'outcome': outcome,
                          'elapsedSeconds': receipt['elapsedSeconds']}), flush=True)
        for s, handler in previous.items():
            signal.signal(s, handler)
    return 0 if outcome == 'CAPTURED_ORIGINAL_UNGRADED' else 2


if __name__ == '__main__':
    raise SystemExit(main())
