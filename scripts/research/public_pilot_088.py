#!/usr/bin/env python3
"""One bounded six-call public pilot; not a persistent agent or proof checker."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import selectors
import signal
import subprocess
import threading
import time

CODEX = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
MAX_BYTES = 2 * 1024 * 1024
MAX_WORDS = 6500
ENV_KEYS = {"PATH", "HOME", "CODEX_HOME", "TMPDIR", "LANG", "LC_ALL", "SSL_CERT_FILE"}
RULES = (
    "Work only from the six problem statements below and the explicitly replayed text. "
    "Do not use tools, commands, web search, files, repositories, external sources, "
    "or published solutions. Provide rigorous proofs; state unresolved gaps honestly. "
    "Label your work by problem ID. Your entire response must be at most 6500 words.\n"
)


def load_cases(path):
    cases = json.loads(Path(path).read_text())
    if not isinstance(cases, list) or len(cases) != 6:
        raise ValueError("Exactly six cases are required")
    for case in cases:
        if (not isinstance(case, dict) or set(case) != {"id", "problem"}
                or any(not isinstance(case[k], str) or not case[k].strip()
                       for k in ("id", "problem"))):
            raise ValueError("Solver input must contain only nonempty id/problem strings")
    if len({case["id"] for case in cases}) != 6:
        raise ValueError("Case IDs must be unique")
    return cases


def make_prompt(cases, arm, stage, history):
    tasks = {
        ("A", 1): "Solve all six problems directly.",
        ("B", 1): "Solve all six problems directly.",
        ("A", 2): "Self-check your preceding solutions. Identify and correct errors or gaps.",
        ("A", 3): "Give your final corrected solutions to all six problems after your self-check.",
        ("B", 2): "Act as a fresh separate critic. Audit the solver's work on all six problems. "
                   "Identify specific errors and gaps, or explain why each proof is sound.",
        ("B", 3): "Repair the solver's solutions using the separate critic's audit. "
                   "Give your final solutions to all six problems.",
    }
    text = RULES + "\n" + tasks[(arm, stage)] + "\n\nPROBLEMS\n"
    text += "\n\n".join(f"{c['id']}\n{c['problem']}" for c in cases)
    for number, (_, response) in enumerate(history, 1):
        text += f"\n\nREPLAYED RESPONSE {number}\n{response}"
    return text


def command(scratch):
    return [CODEX, "exec", "--json", "--ephemeral", "--ignore-user-config",
            "--skip-git-repo-check", "--sandbox", "read-only", "--model", "gpt-6.1-sol",
            "-c", 'model_reasoning_effort="high"', "-c", 'web_search="disabled"',
            "-C", str(scratch), "-"]


def parse_events(raw):
    messages, malformed, contamination, usages, failures = [], [], [], [], []
    allowed = {"thread.started", "turn.started", "turn.completed", "turn.failed", "error"}
    for number, line in enumerate(raw.decode("utf-8", errors="replace").splitlines(), 1):
        if not line.strip():
            continue
        try:
            event = json.loads(line)
            if not isinstance(event, dict):
                raise ValueError("Non-object event")
        except (ValueError, json.JSONDecodeError):
            malformed.append(number)
            continue
        kind = event.get("type")
        if kind == "turn.completed":
            usages.append(event.get("usage") if isinstance(event.get("usage"), dict) else None)
        elif kind in {"error", "turn.failed"}:
            failures.append(event)
        elif kind in {"item.started", "item.updated", "item.completed"}:
            item = event.get("item", {})
            if not isinstance(item, dict) or item.get("type") != "agent_message":
                contamination.append(event)
            elif kind == "item.completed" and isinstance(item.get("text"), str):
                messages.append(item["text"])
        elif kind not in allowed:
            contamination.append(event)
    return {"response": "\n\n".join(messages), "usage": usages[-1] if usages else None,
            "turn_completed_count": len(usages), "malformed_jsonl_lines": malformed,
            "contamination_events": contamination, "failure_events": failures}


def terminate_group(process):
    """Terminate descendants too, even if the group leader has already exited."""
    cleanup = {"sigterm_sent": False, "sigkill_sent": False, "leader_reaped": False}
    try:
        os.killpg(process.pid, signal.SIGTERM)
        cleanup["sigterm_sent"] = True
    except ProcessLookupError:
        pass
    try:
        process.wait(timeout=1)
    except subprocess.TimeoutExpired:
        pass
    try:
        os.killpg(process.pid, signal.SIGKILL)
        cleanup["sigkill_sent"] = True
    except ProcessLookupError:
        pass
    process.wait(timeout=2)
    cleanup["leader_reaped"] = True
    return cleanup


def capture(cmd, prompt, timeout, max_bytes=MAX_BYTES):
    """Bound combined retained bytes and kill on deadline/cap; never retry."""
    start = time.monotonic()
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE, env={k: v for k, v in os.environ.items()
                                                            if k in ENV_KEYS},
                               start_new_session=True)
    buffers = {"stdout": bytearray(), "stderr": bytearray()}
    reason = None

    def write_prompt():
        try:
            process.stdin.write(prompt.encode())
            process.stdin.close()
        except (BrokenPipeError, OSError, ValueError):
            pass

    writer = threading.Thread(target=write_prompt, daemon=True)
    writer.start()
    try:
        with selectors.DefaultSelector() as selector:
            for name in buffers:
                stream = getattr(process, name)
                os.set_blocking(stream.fileno(), False)
                selector.register(stream, selectors.EVENT_READ, name)
            while selector.get_map():
                remaining = timeout - (time.monotonic() - start)
                if remaining <= 0:
                    reason = "timeout"
                    break
                for key, _ in selector.select(min(remaining, 0.1)):
                    chunk = os.read(key.fileobj.fileno(), 65536)
                    if not chunk:
                        selector.unregister(key.fileobj)
                        continue
                    available = max_bytes - sum(map(len, buffers.values()))
                    buffers[key.data].extend(chunk[:available])
                    if len(chunk) > available:
                        reason = "output_limit"
                        break
                if reason:
                    break
            if not reason:
                try:
                    process.wait(timeout=max(0.001, timeout - (time.monotonic() - start)))
                except subprocess.TimeoutExpired:
                    reason = "timeout"
    finally:
        cleanup = terminate_group(process)
        writer.join(timeout=2)
        # Nonblocking final drain: never wait for an escaped descendant's pipe.
        for name in buffers:
            stream = getattr(process, name)
            while True:
                try:
                    tail = os.read(stream.fileno(), 65536)
                except BlockingIOError:
                    break
                if not tail:
                    break
                available = max_bytes - sum(map(len, buffers.values()))
                buffers[name].extend(tail[:available])
                if len(tail) > available:
                    reason = reason or "output_limit"
                    break
            stream.close()
        if not writer.is_alive() and not process.stdin.closed:
            process.stdin.close()
        cleanup["stdin_writer_finished"] = not writer.is_alive()
    return {"stdout": bytes(buffers["stdout"]), "stderr": bytes(buffers["stderr"]),
            "exit_code": process.returncode, "wall_seconds": time.monotonic() - start,
            "stop_reason": reason, "process_cleanup": cleanup}


def run_call(label, prompt, output, scratch, timeout):
    (output / f"{label}.prompt.txt").write_text(prompt)
    started = datetime.now(timezone.utc).isoformat()
    cmd = command(scratch)
    try:
        result = capture(cmd, prompt, timeout)
    except OSError as error:
        result = {"stdout": b"", "stderr": str(error).encode(), "exit_code": None,
                  "wall_seconds": None, "stop_reason": "launch_error", "process_cleanup": None}
    (output / f"{label}.raw.jsonl").write_bytes(result.pop("stdout"))
    (output / f"{label}.stderr.txt").write_bytes(result.pop("stderr"))
    parsed = parse_events((output / f"{label}.raw.jsonl").read_bytes())
    response = parsed.pop("response")
    (output / f"{label}.response.txt").write_text(response)
    receipt = {"label": label, "started_utc": started, "command": cmd,
               "requested_model": "gpt-6.1-sol", "requested_reasoning_effort": "high",
               "effective_backend_model": None, "timeout_seconds": timeout,
               "raw_byte_cap": MAX_BYTES, "instructed_word_cap": MAX_WORDS,
               "response_words": len(response.split()), "context_mode": "explicit_replay_ephemeral",
               **result, **parsed}
    receipt["observed_usage_fields"] = {
        key: receipt["usage"].get(key) if receipt["usage"] is not None else None
        for key in ("input_tokens", "cached_input_tokens", "cache_write_input_tokens",
                    "output_tokens", "reasoning_output_tokens")}
    receipt["valid_transport"] = (
        receipt["exit_code"] == 0 and not receipt["stop_reason"]
        and receipt["turn_completed_count"] == 1 and receipt["usage"] is not None
        and not receipt["malformed_jsonl_lines"] and not receipt["contamination_events"]
        and not receipt["failure_events"] and bool(response)
        and receipt["response_words"] <= MAX_WORDS)
    (output / f"{label}.receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
    return prompt, response, receipt


def run_pilot(cases, output, scratch, timeout):
    histories = {"A": [], "B": []}
    receipts = []
    for stage in (1, 2, 3):
        with ThreadPoolExecutor(max_workers=2) as pool:
            futures = {arm: pool.submit(run_call, f"{arm}{stage}",
                                       make_prompt(cases, arm, stage, histories[arm]),
                                       output, scratch, timeout) for arm in ("A", "B")}
            for arm, future in futures.items():
                prompt, response, receipt = future.result()
                histories[arm].append((prompt, response))
                receipts.append(receipt)
        if not all(r["valid_transport"] for r in receipts[-2:]):
            break  # No repair call may hide a contaminated, incomplete or unmetered predecessor.
    summary = {"calls": receipts, "no_retries": True,
               "context_mode": "explicit_replay_ephemeral_not_persistent",
               "complete_six_calls": len(receipts) == 6 and all(r["valid_transport"] for r in receipts),
               "mathematical_correctness": "not_assessed"}
    (output / "measurement.json").write_text(json.dumps(summary, indent=2) + "\n")
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cases", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--scratch", required=True)
    parser.add_argument("--timeout", type=float, default=240)
    args = parser.parse_args()
    cases = load_cases(args.cases)
    scratch = Path(args.scratch)
    output = Path(args.output).resolve()
    repo = Path(__file__).resolve().parents[2]
    if (not scratch.is_absolute() or scratch.is_symlink() or not scratch.is_dir()
            or any(scratch.iterdir()) or repo == scratch.resolve()
            or repo in scratch.resolve().parents or scratch.resolve() in output.parents
            or output == scratch.resolve() or not 0 < args.timeout <= 240):
        parser.error("Use an absolute empty scratch outside the repository, separate output, timeout (0,240]")
    output.mkdir(parents=True, exist_ok=True)
    if any(output.iterdir()):
        parser.error("Evidence output must be empty; existing attempts cannot be overwritten")
    summary = run_pilot(cases, output, scratch.resolve(), args.timeout)
    print(json.dumps({"complete_six_calls": summary["complete_six_calls"], "output": str(output)}))
    return 0 if summary["complete_six_calls"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
