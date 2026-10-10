"""TIP088 epoch2 focused checks; no Codex or mathematical dispatch."""

from contextlib import redirect_stdout
from datetime import datetime, timedelta, timezone
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

REPO = Path(__file__).resolve().parents[2]
SOURCE = REPO / "scripts/research/public_pilot_088_casewise.py"
SPEC = importlib.util.spec_from_file_location("pilot088_casewise_test", SOURCE)
driver = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(driver)
FROZEN_CASES = REPO / "docs/research/pilot088/solver-cases.json"
BEFORE = datetime(2026, 10, 9, 9, 0, tzinfo=timezone.utc)


def scratch_dir():
    return tempfile.TemporaryDirectory(prefix="codex-tmp-pilot088e2-test-20261009-",
                                       dir="/private/tmp")


def event_bytes(text="mock proof", usage=True):
    rows = [{"type": "item.completed", "item": {"type": "agent_message", "text": text}},
            {"type": "turn.completed", **({"usage": {"input_tokens": 10, "output_tokens": 2}}
                                         if usage else {})}]
    return ("\n".join(json.dumps(r) for r in rows) + "\n").encode()


def fake_result(text="mock proof", usage=True):
    return {"stdout": event_bytes(text, usage), "stderr": b"", "exit_code": 0,
            "wall_seconds": .01, "stop_reason": None, "process_cleanup": None}


class CasewiseTests(unittest.TestCase):
    def setUp(self):
        self.now = patch.object(driver, "now", return_value=BEFORE)
        self.now.start()
        self.addCleanup(self.now.stop)
        self.stdout = redirect_stdout(io.StringIO())
        self.stdout.__enter__()
        self.addCleanup(self.stdout.__exit__, None, None, None)
        self.cases = driver.load_cases(FROZEN_CASES)

    def test_mock_one_case_exact_six_calls_caps_and_replay(self):
        with scratch_dir() as folder:
            output = Path(folder) / "C05"
            with patch.object(driver.transport, "capture", side_effect=lambda *a: fake_result()) as calls:
                result = driver.run_case(self.cases[4], output, Path(folder))
            self.assertTrue(result["complete_six_calls"])
            self.assertEqual([r["label"] for r in result["calls"]],
                             ["A1", "B1", "A2", "B2", "A3", "B3"])
            self.assertEqual([r["timeout_seconds"] for r in result["calls"]],
                             [240, 240, 120, 120, 120, 120])
            self.assertEqual(calls.call_count, 6)
            prompts = {p.stem: p.read_text() for p in output.glob("*.prompt.txt")}
            self.assertEqual(prompts["A1.prompt"], prompts["B1.prompt"])
            self.assertNotIn("REPLAYED RESPONSE", prompts["A1.prompt"])
            self.assertIn("fresh separate critic", prompts["B2.prompt"])
            self.assertNotIn("REPLAYED RESPONSE 2", prompts["B2.prompt"])
            self.assertIn("REPLAYED RESPONSE 2", prompts["B3.prompt"])
            for receipt in result["calls"]:
                self.assertEqual(receipt["instructed_word_cap"], 1400)
                self.assertEqual(receipt["raw_byte_cap"], 2 * 1024 * 1024)
                self.assertEqual(receipt["observed_usage_fields"]["input_tokens"], 10)
                self.assertIsNone(receipt["observed_usage_fields"]["reasoning_output_tokens"])

    def test_one_failed_arm_stops_only_it_without_retry(self):
        with scratch_dir() as folder:
            def capture(cmd, prompt, timeout):
                return fake_result(usage="Self-check" not in prompt)
            with patch.object(driver.transport, "capture", side_effect=capture) as calls:
                result = driver.run_case(self.cases[4], Path(folder) / "C05", Path(folder))
            self.assertEqual(calls.call_count, 5)
            self.assertEqual([r["label"] for r in result["calls"]], ["A1", "B1", "A2", "B2", "B3"])
            self.assertEqual(result["arms"], {"A": "incomplete", "B": "complete"})
            self.assertIsNone(result["calls"][2]["usage"])

    def test_six_case_snapshot_and_extra_reference_fields_refused(self):
        with scratch_dir() as folder:
            path = Path(folder) / "cases.json"
            for modification in ("answer", "reference", "category", "false_count"):
                cases = [dict(c) for c in self.cases]
                cases[0][modification] = "forbidden"
                path.write_text(json.dumps(cases))
                with self.assertRaises(ValueError):
                    driver.load_cases(path)
            path.write_text(json.dumps(self.cases[:5]))
            with self.assertRaises(ValueError):
                driver.load_cases(path)
            path.write_text(json.dumps(self.cases))
            with self.assertRaisesRegex(ValueError, "snapshot changed"):
                driver.load_cases(path)

    def test_strict_selection_no_partial_reordered_duplicate_or_whitespace_ids(self):
        self.assertEqual(driver.select_ids("C05"), ("C05",))
        self.assertEqual(driver.select_ids(case_ids="C01,C02,C03,C04,C06"), driver.REMAINING)
        for value in ("C01", "C05", "C01,C02,C03,C04,C05,C06", "C01,C01",
                      "C06,C04,C03,C02,C01", "C01, C02,C03,C04,C06"):
            with self.assertRaises(ValueError):
                driver.select_ids(case_ids=value)
        with self.assertRaises(ValueError):
            driver.select_ids("C06")

    def test_prompt_has_no_reference_metadata_or_tools_and_same_initial(self):
        for case in self.cases:
            a = driver.make_prompt(case, "A", 1, [])
            self.assertEqual(a, driver.make_prompt(case, "B", 1, []))
            self.assertIn("at most 1400 words", a)
            self.assertIn("No introductory commentary", a)
            self.assertIn("honest unresolved gaps", a)
            self.assertIn("Do not use tools", a)
            for marker in ("MathArena", "source_category", "false_count", "reference-cases"):
                self.assertNotIn(marker, a)

    def test_expired_deadline_dispatches_zero_and_records_all_six(self):
        with scratch_dir() as folder:
            with patch.object(driver, "now", return_value=driver.DEADLINE), \
                    patch.object(driver.transport, "capture") as calls:
                result = driver.run_cases(self.cases, ("C05",), Path(folder) / "out",
                                          Path(folder), "c05-measurement.json")
            calls.assert_not_called()
            self.assertEqual(result["stop_reason"], "deadline")
            self.assertEqual(len(result["cases"]), 6)
            self.assertEqual(result["calls_observed_total"], 0)

    def test_deadline_clips_stage_timeout(self):
        with scratch_dir() as folder:
            with patch.object(driver, "now", return_value=driver.DEADLINE - timedelta(seconds=5)), \
                    patch.object(driver.transport, "capture", side_effect=lambda *a: fake_result()):
                result = driver.run_case(self.cases[4], Path(folder) / "C05", Path(folder))
            self.assertEqual([r["timeout_seconds"] for r in result["calls"]], [5] * 6)

    def test_create_only_case_and_summary_refuse_overwrite(self):
        with scratch_dir() as folder:
            scratch = Path(folder) / "scratch"
            scratch.mkdir()
            output = Path(folder) / "out"
            output.mkdir()
            (output / "C05").mkdir()
            with self.assertRaisesRegex(ValueError, "already exists"):
                driver.validate_paths(output, scratch, ("C05",))
            with self.assertRaises(FileExistsError):
                driver.run_case(self.cases[4], output / "C05", scratch)
            driver.write_json_new(output / "proof.json", {})
            with self.assertRaises(FileExistsError):
                driver.write_json_new(output / "proof.json", {})

    def test_bad_scratch_paths_and_remaining_before_c05_refused(self):
        with scratch_dir() as folder:
            scratch = Path(folder) / "scratch"
            scratch.mkdir()
            output = Path(folder) / "out"
            with self.assertRaises(ValueError):
                driver.validate_paths(output, Path("relative"), ("C05",))
            with self.assertRaises(ValueError):
                driver.validate_paths(output, REPO, ("C05",))
            with self.assertRaises(ValueError):
                driver.validate_paths(output, scratch, driver.REMAINING)
            (scratch / "not_empty").touch()
            with self.assertRaises(ValueError):
                driver.validate_paths(output, scratch, ("C05",))

    def test_word_cap_rejection_and_missing_usage_are_not_zero(self):
        with scratch_dir() as folder:
            with patch.object(driver.transport, "capture", side_effect=lambda *a: fake_result("w " * 1401)):
                _, _, receipt = driver.transport.run_call("A1", "mock", Path(folder), Path(folder), 240)
            self.assertFalse(receipt["valid_transport"])
            self.assertEqual(receipt["response_words"], 1401)
            self.assertEqual(receipt["instructed_word_cap"], 1400)
            with patch.object(driver.transport, "capture", side_effect=lambda *a: fake_result(usage=False)):
                _, _, receipt = driver.transport.run_call("B1", "mock", Path(folder), Path(folder), 240)
            self.assertIsNone(receipt["usage"])
            self.assertTrue(all(v is None for v in receipt["observed_usage_fields"].values()))

    def test_two_invocations_total36_no_c05_repeat(self):
        with scratch_dir() as folder:
            output = Path(folder) / "out"
            with patch.object(driver.transport, "capture", side_effect=lambda *a: fake_result()) as calls:
                driver.run_cases(self.cases, ("C05",), output, Path(folder), "c05-measurement.json")
                summary = driver.run_cases(self.cases, driver.REMAINING, output,
                                           Path(folder), "remaining-measurement.json")
            self.assertEqual(calls.call_count, 36)
            self.assertEqual(summary["calls_this_invocation"], 30)
            self.assertEqual(summary["calls_observed_total"], 36)
            self.assertTrue(all(c["complete_six_calls"] for c in summary["cases"]))

    def test_later_failure_continues_remaining_fixed_denominator(self):
        with scratch_dir() as folder:
            output = Path(folder) / "out"
            with patch.object(driver.transport, "capture", side_effect=lambda *a: fake_result()):
                driver.run_cases(self.cases, ("C05",), output, Path(folder), "c05-measurement.json")
            def capture(cmd, prompt, timeout):
                return fake_result(usage="\nC02\n" not in prompt)
            with patch.object(driver.transport, "capture", side_effect=capture) as calls:
                summary = driver.run_cases(self.cases, driver.REMAINING, output,
                                           Path(folder), "remaining-measurement.json")
            self.assertEqual(calls.call_count, 26)
            self.assertFalse(summary["cases"][1]["complete_six_calls"])
            self.assertTrue(summary["cases"][5]["complete_six_calls"])
            self.assertEqual(len(summary["cases"]), 6)

    def test_quota_refusal_stops_batch(self):
        with scratch_dir() as folder:
            def capture(*args):
                result = fake_result(usage=False)
                result["stderr"] = b"usage limit reached"
                return result
            with patch.object(driver.transport, "capture", side_effect=capture) as calls:
                summary = driver.run_cases(self.cases, ("C05",), Path(folder) / "out",
                                           Path(folder), "c05-measurement.json")
            self.assertEqual(calls.call_count, 2)
            self.assertEqual(summary["stop_reason"], "quota_or_auth_refusal")

    def test_old_source_and_snapshots_sha_preserved(self):
        self.assertEqual(hashlib.sha256(driver.OLD_SOURCE.read_bytes()).hexdigest(), driver.OLD_SHA)
        self.assertEqual(hashlib.sha256(FROZEN_CASES.read_bytes()).hexdigest(), driver.CASES_SHA)
        reference = REPO / "docs/research/pilot088/reference-cases.json"
        self.assertEqual(hashlib.sha256(reference.read_bytes()).hexdigest(),
                         "77709b6c024b8261db4822ad1504e960523b6cc0d5a603fa0307c5732aef4420")


if __name__ == "__main__":
    unittest.main()
