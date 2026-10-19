#!/usr/bin/env python3
"""Thin TIP088 epoch2 transport driver; mathematical grading belongs to Main."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re

REPO = Path(__file__).resolve().parents[2]
OLD_SOURCE = REPO / "scripts/research/public_pilot_088.py"
OLD_SHA = "839d4ce3618daab71f227e71c9b7c83b68f38e3a2ede99d2a5c24323ad0e3817"
CASES_SHA = "147d952360c96a0a2ee8c67b68f9a3dd7704f18d7d247abd6563470a640cff20"
IDS = ("C01", "C02", "C03", "C04", "C05", "C06")
REMAINING = ("C01", "C02", "C03", "C04", "C06")
DEADLINE = datetime(2026, 10, 9, 10, 19, tzinfo=timezone.utc)
STAGES = ((1, 240), (2, 120), (3, 120))
SPEC = importlib.util.spec_from_file_location("pilot088_epoch2_frozen_transport", OLD_SOURCE)
transport = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(transport)
transport.MAX_WORDS = 1400
RULES = (
    "Work only from the problem statement and explicitly replayed responses below. "
    "Do not use tools, commands, web search, files, repositories, external sources, "
    "or published solutions. Return a final mathematical result promptly, with a "
    "rigorous proof or explicit honest unresolved gaps. No introductory commentary "
    "and no indefinite search. Label your result by problem ID. "
    "Your entire response must be at most 1400 words.\n"
)


def now():
    return datetime.now(timezone.utc)


def load_cases(path):
    if hashlib.sha256(OLD_SOURCE.read_bytes()).hexdigest() != OLD_SHA:
        raise ValueError("Frozen predecessor source changed")
    cases = transport.load_cases(path)
    if tuple(c["id"] for c in cases) != IDS:
        raise ValueError("Exact frozen six case IDs/order required")
    if hashlib.sha256(Path(path).read_bytes()).hexdigest() != CASES_SHA:
        raise ValueError("Frozen six-case snapshot changed")
    return cases


def select_ids(case_id=None, case_ids=None):
    if case_id == "C05" and case_ids is None:
        return ("C05",)
    if case_id is None and case_ids == ",".join(REMAINING):
        return REMAINING
    raise ValueError("Select only --case-id C05 or --case-ids C01,C02,C03,C04,C06")


def make_prompt(case, arm, stage, history):
    tasks = {
        ("A", 1): "Solve this problem directly.",
        ("B", 1): "Solve this problem directly.",
        ("A", 2): "Self-check your preceding solution. Identify and correct errors or gaps.",
        ("B", 2): "Act as a fresh separate critic. Audit the solver's draft. "
                   "Identify specific errors and gaps, or explain why the proof is sound.",
        ("A", 3): "Give your final corrected solution after your self-check.",
        ("B", 3): "Repair the solver's draft using the separate critic's audit. "
                   "Give your final solution.",
    }
    text = RULES + "\n" + tasks[(arm, stage)]
    text += f"\n\nPROBLEM\n{case['id']}\n{case['problem']}"
    for number, response in enumerate(history, 1):
        text += f"\n\nREPLAYED RESPONSE {number}\n{response}"
    return text


def write_json_new(path, value):
    with path.open("x") as handle:
        handle.write(json.dumps(value, indent=2) + "\n")


def validate_paths(output, scratch, selected):
    output, scratch = Path(output), Path(scratch)
    resolved = scratch.resolve()
    if (not scratch.is_absolute() or scratch.is_symlink() or not scratch.is_dir()
            or any(scratch.iterdir()) or resolved == REPO or REPO in resolved.parents
            or output.resolve() == resolved or resolved in output.resolve().parents
            or output.resolve() in resolved.parents):
        raise ValueError("Use an absolute empty scratch outside repo, separate from evidence")
    if output.is_symlink():
        raise ValueError("Evidence root cannot be a symlink")
    summary_name = "c05-measurement.json" if selected == ("C05",) else "remaining-measurement.json"
    if output.exists():
        if not output.is_dir() or (output / summary_name).exists():
            raise ValueError("Evidence summary already exists")
        if any((output / case_id).exists() for case_id in selected):
            raise ValueError("Case evidence already exists; no repeats or overwrites")
    if selected == REMAINING and not (output / "C05" / "measurement.json").is_file():
        raise ValueError("Run C05 first; Main must separately accept its mathematics")
    return output.resolve(), resolved, summary_name


def quota_or_auth_refusal(receipt, output):
    text = json.dumps(receipt.get("failure_events", []))
    stderr = output / f"{receipt['label']}.stderr.txt"
    if stderr.is_file():
        text += stderr.read_text(errors="replace")
    return bool(re.search(r"quota|usage limit|rate limit|not authenticated|authentication "
                          r"failed|unauthorized|login required", text, re.IGNORECASE))


def run_case(case, output, scratch):
    output.mkdir()  # Create-only reservation prevents replay of this case.
    histories = {"A": [], "B": []}
    active = {"A": True, "B": True}
    receipts = []
    stop = None
    for stage, allocation in STAGES:
        timeout = min(allocation, (DEADLINE - now()).total_seconds())
        if timeout <= 0:
            stop = "deadline"
            break
        arms = [arm for arm in ("A", "B") if active[arm]]
        if not arms:
            break
        with ThreadPoolExecutor(max_workers=2) as pool:
            futures = {arm: pool.submit(transport.run_call, f"{arm}{stage}",
                                       make_prompt(case, arm, stage, histories[arm]),
                                       output, scratch, timeout) for arm in arms}
            for arm, future in futures.items():
                _, response, receipt = future.result()
                receipts.append(receipt)
                histories[arm].append(response)
                active[arm] = receipt["valid_transport"]
                if quota_or_auth_refusal(receipt, output):
                    stop = "quota_or_auth_refusal"
        print(json.dumps({"event": "stage_pair_complete", "case_id": case["id"],
                          "stage": stage, "arms": arms,
                          "valid_transport": {a: active[a] for a in arms}}), flush=True)
        if stop:
            break
    complete = len(receipts) == 6 and all(r["valid_transport"] for r in receipts)
    result = {"case_id": case["id"], "calls": receipts, "complete_six_calls": complete,
              "arms": {a: "complete" if any(r["label"] == f"{a}3" and r["valid_transport"]
                                            for r in receipts) else "incomplete" for a in active},
              "stop_reason": stop, "mathematical_correctness": "not_assessed"}
    write_json_new(output / "measurement.json", result)
    print(json.dumps({"event": "case_complete", "case_id": case["id"],
                      "complete_six_calls": complete, "calls": len(receipts)}), flush=True)
    return result


def run_cases(cases, selected, output, scratch, summary_name):
    output.mkdir(parents=True, exist_ok=True)
    results = {}
    # Carry forward actual C05 receipts, without re-dispatching it.
    for case in cases:
        path = output / case["id"] / "measurement.json"
        if path.is_file():
            results[case["id"]] = json.loads(path.read_text())
    if selected == REMAINING and not results["C05"]["complete_six_calls"]:
        raise ValueError("C05 transport failed; remaining-case dispatch refused")
    stop = None
    calls_this_invocation = 0
    for case_id in selected:
        if now() >= DEADLINE:
            stop = "deadline"
            break
        case = next(c for c in cases if c["id"] == case_id)
        result = run_case(case, output / case_id, scratch)
        results[case_id] = result
        calls_this_invocation += len(result["calls"])
        if result["stop_reason"]:
            stop = result["stop_reason"]
            break
    summary = {
        "cases": [results.get(case_id, {"case_id": case_id, "calls": [],
                    "complete_six_calls": False, "status": "not_dispatched",
                    "mathematical_correctness": "not_assessed"}) for case_id in IDS],
        "selected_case_ids": list(selected), "calls_this_invocation": calls_this_invocation,
        "calls_observed_total": sum(len(r["calls"]) for r in results.values()),
        "maximum_math_calls_across_epoch2": 36, "stop_reason": stop,
        "deadline_utc": DEADLINE.isoformat(), "no_retries": True,
        "context_mode": "explicit_replay_ephemeral_not_persistent",
        "mathematical_correctness": "not_assessed",
        "remaining_math_acceptance_gate": "Main owns C05 and final mathematical acceptance",
        "execution_grant": "Main-owned; no new server grant infrastructure",
    }
    write_json_new(output / summary_name, summary)
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cases", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--scratch", required=True)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--case-id")
    group.add_argument("--case-ids")
    args = parser.parse_args()
    try:
        cases = load_cases(args.cases)
        selected = select_ids(args.case_id, args.case_ids)
        output, scratch, name = validate_paths(args.output, args.scratch, selected)
        summary = run_cases(cases, selected, output, scratch, name)
    except (ValueError, OSError) as error:
        parser.error(str(error))
    selected_results = [c for c in summary["cases"] if c["case_id"] in selected]
    return 0 if all(c["complete_six_calls"] for c in selected_results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
