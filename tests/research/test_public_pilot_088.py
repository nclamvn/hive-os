"""Focused stdlib tests: mock Codex and use only tiny local Python children."""

import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[2] / "scripts/research/public_pilot_088.py"
SPEC = importlib.util.spec_from_file_location("public_pilot_088", SOURCE)
pilot = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(pilot)


def scratch_test_dir():
    return tempfile.TemporaryDirectory(prefix="codex-tmp-pilot088-test-20261009-", dir="/private/tmp")


def events(usage=True, extra=None):
    rows = [{"type": "thread.started", "thread_id": "dummy"},
            {"type": "turn.started"},
            {"type": "item.completed", "item": {"type": "agent_message", "text": "sample proof"}},
            {"type": "turn.completed", **({"usage": {"input_tokens": 10, "output_tokens": 2}}
                                        if usage else {})}]
    if extra:
        rows.insert(2, extra)
    return ("\n".join(json.dumps(row) for row in rows) + "\n").encode()


class RunnerTests(unittest.TestCase):
    def test_actual_usage_and_response(self):
        result = pilot.parse_events(events())
        self.assertEqual(result["usage"], {"input_tokens": 10, "output_tokens": 2})
        self.assertEqual(result["response"], "sample proof")
        self.assertEqual(result["contamination_events"], [])

    def test_missing_usage_is_null_not_zero(self):
        self.assertIsNone(pilot.parse_events(events(False))["usage"])
        self.assertIsNone(pilot.parse_events(b"")["usage"])

    def test_bad_json_and_nonobject_flagged(self):
        self.assertEqual(pilot.parse_events(b"bad\n[]\n")["malformed_jsonl_lines"], [1, 2])

    def test_tool_and_nonmessage_are_contamination(self):
        for kind in ("command_execution", "web_search", "reasoning"):
            result = pilot.parse_events(events(extra={"type": "item.started", "item": {"type": kind}}))
            self.assertEqual(len(result["contamination_events"]), 1)
        self.assertTrue(pilot.parse_events(b'{"type":"unknown"}\n')["contamination_events"])

    def test_strict_solver_only_six_cases(self):
        with scratch_test_dir() as folder:
            path = Path(folder) / "cases.json"
            cases = [{"id": str(i), "problem": "sample statement"} for i in range(6)]
            path.write_text(json.dumps(cases))
            self.assertEqual(pilot.load_cases(path), cases)
            cases[0]["answer"] = "not allowed"
            path.write_text(json.dumps(cases))
            with self.assertRaises(ValueError):
                pilot.load_cases(path)

    def test_command_is_ephemeral_and_read_only(self):
        cmd = pilot.command("/private/tmp/scratch")
        for option in ("--ephemeral", "--ignore-user-config", "--json", "--skip-git-repo-check"):
            self.assertIn(option, cmd)
        self.assertEqual(cmd[cmd.index("--sandbox") + 1], "read-only")
        self.assertIn('web_search="disabled"', cmd)
        self.assertEqual(cmd[-1], "-")

    def test_prompts_keep_common_caps_and_fresh_critic(self):
        cases = [{"id": str(i), "problem": "sample"} for i in range(6)]
        first = pilot.make_prompt(cases, "B", 1, [])
        critic = pilot.make_prompt(cases, "B", 2, [(first, "first answer")])
        self.assertIn("fresh separate critic", critic)
        self.assertIn("first answer", critic)
        self.assertIn("6500 words", critic)
        self.assertNotIn("MathArena", critic)
        self.assertEqual(pilot.make_prompt(cases, "A", 1, []), first)

    def test_mock_six_calls_and_stage_order(self):
        with scratch_test_dir() as folder:
            seen = []

            def fake_capture(cmd, prompt, timeout):
                seen.append(prompt)
                return {"stdout": events(), "stderr": b"", "exit_code": 0,
                        "wall_seconds": 0.01, "stop_reason": None}

            with patch.object(pilot, "capture", side_effect=fake_capture):
                result = pilot.run_pilot([{"id": str(i), "problem": "sample"} for i in range(6)],
                                         Path(folder), Path(folder), 240)
            self.assertTrue(result["complete_six_calls"])
            self.assertEqual([c["label"] for c in result["calls"]], ["A1", "B1", "A2", "B2", "A3", "B3"])
            self.assertEqual(len(seen), 6)
            self.assertNotIn("REPLAYED RESPONSE", seen[0])
            self.assertNotIn("REPLAYED RESPONSE", seen[1])
            self.assertIn("REPLAYED RESPONSE 2", seen[4])
            self.assertEqual(len(list(Path(folder).glob("*.raw.jsonl"))), 6)

    def test_failure_stops_without_retry_or_unmetered_repair(self):
        with scratch_test_dir() as folder:
            failure = {"stdout": events(False), "stderr": b"", "exit_code": 0,
                       "wall_seconds": 0.01, "stop_reason": None}
            with patch.object(pilot, "capture", side_effect=lambda *args: dict(failure)) as mocked:
                result = pilot.run_pilot([{"id": str(i), "problem": "sample"} for i in range(6)],
                                         Path(folder), Path(folder), 240)
            self.assertFalse(result["complete_six_calls"])
            self.assertEqual(mocked.call_count, 2)

    def test_tiny_child_captures_and_filters_environment(self):
        script = "import os,sys; print(os.environ.get('OPENAI_API_KEY','absent')); print(sys.stdin.read())"
        with patch.dict(os.environ, {"OPENAI_API_KEY": "test-never-inherit"}):
            result = pilot.capture([sys.executable, "-c", script], "hello", 2)
        self.assertEqual(result["stdout"], b"absent\nhello\n")
        self.assertEqual(result["exit_code"], 0)

    def test_tiny_child_timeout_cleanup(self):
        result = pilot.capture([sys.executable, "-c", "import time; time.sleep(10)"], "", 0.05)
        self.assertEqual(result["stop_reason"], "timeout")
        self.assertNotEqual(result["exit_code"], 0)
        self.assertLess(result["wall_seconds"], 4)
        self.assertTrue(result["process_cleanup"]["leader_reaped"])
        self.assertTrue(result["process_cleanup"]["stdin_writer_finished"])

    def test_output_is_bounded_and_stops_child(self):
        result = pilot.capture([sys.executable, "-c", "import sys; sys.stdout.write('x'*100000)"],
                               "", 2, max_bytes=1024)
        self.assertEqual(result["stop_reason"], "output_limit")
        self.assertEqual(len(result["stdout"]) + len(result["stderr"]), 1024)

    def test_launch_failure_persists_receipt(self):
        with scratch_test_dir() as folder:
            with patch.object(pilot, "capture", side_effect=FileNotFoundError("missing")):
                _, _, receipt = pilot.run_call("A1", "sample", Path(folder), Path(folder), 240)
            self.assertEqual(receipt["stop_reason"], "launch_error")
            self.assertIsNone(receipt["usage"])
            self.assertFalse(receipt["valid_transport"])

    def test_receipt_absent_usage_fields_remain_null(self):
        with scratch_test_dir() as folder:
            result = {"stdout": events(), "stderr": b"", "exit_code": 0,
                      "wall_seconds": 0.01, "stop_reason": None}
            with patch.object(pilot, "capture", return_value=result):
                _, _, receipt = pilot.run_call("A1", "sample", Path(folder), Path(folder), 240)
            fields = receipt["observed_usage_fields"]
            self.assertEqual(fields["input_tokens"], 10)
            self.assertIsNone(fields["cached_input_tokens"])
            self.assertIsNone(fields["cache_write_input_tokens"])
            self.assertIsNone(fields["reasoning_output_tokens"])

    def test_group_cleanup_mock_timeout_then_kill(self):
        from unittest.mock import Mock
        process = Mock(pid=12345)
        process.wait.side_effect = [subprocess.TimeoutExpired("dummy", 1), 0]
        with patch.object(pilot.os, "killpg") as kill:
            cleanup = pilot.terminate_group(process)
        self.assertEqual([call.args[1] for call in kill.call_args_list],
                         [pilot.signal.SIGTERM, pilot.signal.SIGKILL])
        self.assertTrue(cleanup["leader_reaped"])


if __name__ == "__main__":
    unittest.main()
