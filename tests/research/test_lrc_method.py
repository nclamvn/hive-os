"""Exact fixed-case controls; no producer helper is used by replay."""
import copy
from fractions import Fraction
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[2]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


producer = load("lrc_producer", ROOT / "scripts/research/lrc-method.py")
replay = load("lrc_replay", ROOT / "scripts/research/lrc_replay.py")


class LrcMethodTests(unittest.TestCase):
    def setUp(self):
        self.payload = producer.produce_cases()

    def test_both_fixed_cases_and_equality(self):
        self.assertEqual(replay.verify(self.payload), {"accepted": True, "purpose": producer.PURPOSE,
                         "cases": ["GW14", "SHIFT15"], "globalLrcProved": False})
        case = self.payload["cases"][0]
        distances = []
        for speed in case["speeds"]:
            phase = (int(speed) * Fraction(case["witness"])) % 1
            distances.append(min(phase, 1 - phase))
        self.assertEqual(min(distances), Fraction(1, 14))

    def test_wrong_shift(self):
        altered = copy.deepcopy(self.payload)
        case = altered["cases"][1]
        case["firstGoodShift"] = 3
        case["witness"] = producer.fraction_text(Fraction(case["baseTime"]) + Fraction(3, 5))
        with self.assertRaises(ValueError):
            replay.verify(altered)

    def test_deleted_essential_cover_arc(self):
        cover = self.payload["cases"][0]["cover"]
        del cover[len(cover) // 2]
        with self.assertRaises(ValueError):
            replay.verify(self.payload)

    def test_wrong_threshold(self):
        for index in (0, 1):
            with self.subTest(case=index):
                altered = copy.deepcopy(self.payload)
                altered["cases"][index]["threshold"] = "1/16"
                with self.assertRaises(ValueError):
                    replay.verify(altered)

    def test_changed_tuple(self):
        for index in (0, 1):
            with self.subTest(case=index):
                altered = copy.deepcopy(self.payload)
                altered["cases"][index]["speeds"][0] = "2"
                with self.assertRaises(ValueError):
                    replay.verify(altered)

    def test_global_claim_refused(self):
        self.payload["globalLrcProved"] = True
        with self.assertRaises(ValueError):
            replay.verify(self.payload)

    def test_closed_schema_and_no_forged_endpoints(self):
        self.payload["cases"][0]["cover"][0]["upper"] = "1/1"
        with self.assertRaises(ValueError):
            replay.verify(self.payload)

    def test_real_verifier_cli_refuses_whole_run_if_second_case_fails(self):
        self.payload["cases"][1]["firstGoodShift"] = 0
        result = subprocess.run([sys.executable, "-I", "-S", "-B", str(ROOT / "scripts/research/lrc_replay.py")],
                                input=json.dumps(self.payload).encode("ascii"), capture_output=True, timeout=10)
        self.assertNotEqual(result.returncode, 0)
        self.assertNotIn(b'"accepted":true', result.stdout)


if __name__ == "__main__":
    unittest.main()
