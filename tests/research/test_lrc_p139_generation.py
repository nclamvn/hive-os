"""TIP-075 engineering controls only; NEVER a full p139 attempt/replay."""
import importlib.util
import io
import itertools
import json
import pathlib
import os
import subprocess
import sys
import unittest
from unittest import mock

SCRIPT = pathlib.Path(__file__).resolve().parents[2] / "scripts/operations/attempt-lrc-p139-generation.py"
SPEC = importlib.util.spec_from_file_location("p139_generation_producer", SCRIPT)
G = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(G)


def caps(**updates):
    value = G.MAXIMA.copy()
    value.update(updates)
    return value


def scalar_mask(p, divisor, v):
    return {t for t in range(1, (p + 1) // 2)
            if min(v * t % p, (-v * t) % p) * divisor < p}


def oracle(p, divisor, target):
    """Separate exhaustive scalar combinations, no producer mask/search helper."""
    n = (p - 1) // 2
    masks = {v: scalar_mask(p, divisor, v) for v in range(1, n + 1)}
    universe = set(range(1, n + 1))

    def covered(row):
        return set().union(*(masks[v] for v in row)) == universe

    def representative(row):
        return min(tuple(sorted(min(v * g % p, (-v * g) % p) for v in row))
                   for g in range(1, n + 1))

    minimal = {}
    for size in range(1, target + 1):
        values = set()
        for row in itertools.combinations(range(1, n + 1), size):
            if covered(row) and all(not covered(row[:i] + row[i + 1:]) for i in range(size)):
                values.add(representative(row))
        if values:
            minimal[size] = values
    full = {representative(row) for row in
            itertools.combinations_with_replacement(range(1, n + 1), target)
            if covered(row)}
    return minimal, full


class GenerationControls(unittest.TestCase):
    def test_exact_p139_masks_all_coordinates(self):
        b = G.Budget()
        masks, actions, _ = G.domain(139, 14, b)
        for v, mask in enumerate(masks, 1):
            expected = scalar_mask(139, 14, v)
            self.assertEqual({i + 1 for i in range(69) if mask & (1 << i)}, expected)
            self.assertEqual(mask.bit_count(), 9)
        self.assertEqual(len(actions), 69)
        for g, action in enumerate(actions, 1):
            self.assertEqual(action, [min(g * v % 139, (-g * v) % 139) for v in range(1, 70)])

    def test_409_root_schedule_without_tau(self):
        schedule = G.root_schedule(69, 9, 13)
        self.assertEqual(schedule, [(8, 9), (9, 7), (10, 5), (11, 4), (12, 3), (13, 2)])
        roots = [(s, row) for s, q in schedule for row in itertools.combinations(range(1, 10), q)]
        self.assertEqual(len(roots), 409)
        self.assertEqual(len(set(roots)), 409)

    def test_exhaustive_tiny_minimal_and_multiset_union(self):
        for p, divisor, target in [(7, 3, 3), (11, 5, 4), (17, 6, 5)]:
            with self.subTest(p=p):
                expected_minimal, expected_full = oracle(p, divisor, target)
                actual = G.Generator(p, divisor, target).run()
                self.assertEqual({s: r for s, r in actual.minimal.items() if r}, expected_minimal)
                self.assertEqual(actual.rows, expected_full)
                self.assertTrue(any(len(set(row)) < target for row in actual.rows))
                # All trees closed and all root schedules accounted, not one decision witness.
                self.assertEqual(len(actual.roots), sum(
                    len(list(itertools.combinations(range(1, actual.cardinality + 1), q)))
                    for _, q in G.root_schedule(actual.n, actual.cardinality, target)))

    def test_all_units_and_multiplicity(self):
        b = G.Budget()
        _, actions, _ = G.domain(11, 5, b)
        repeated = G.canonical((1, 1, 2, 3), actions, b)
        distinct = G.canonical((1, 2, 3, 4), actions, b)
        self.assertNotEqual(repeated, distinct)
        self.assertEqual(len(set(repeated)), 3)
        for g in range(1, 6):
            transformed = tuple(min(v * g % 11, (-v * g) % 11) for v in (1, 1, 2, 3))
            self.assertEqual(G.canonical(transformed, actions, b), repeated)

    def test_candidate_never_admitted(self):
        gen = G.Generator(7, 3, 3).run()
        value = json.loads(gen.candidate())
        self.assertEqual(value["status"], "COMPLETE_CANDIDATE_UNACCEPTED")
        self.assertEqual(value["admittedRows"], 0)
        self.assertEqual(value["candidateRows"], len(gen.rows))
        self.assertEqual(value["closure"], {"G": "UNACCEPTED_CANDIDATE", "C": "OPEN", "T": "OPEN", "B": "OPEN"})

    def test_work_before_charge_and_no_reset(self):
        b = G.Budget(caps(work=4))
        b.tick(3, "ROOT_ONE")
        with self.assertRaises(G.Refused) as failure:
            b.tick(2, "ROOT_TWO")
        self.assertEqual((failure.exception.cap, b.work), ("WORK", 3))
        self.assertEqual(failure.exception.phase, "ROOT_TWO")
        b.tick(1, "EXTENSION")
        with self.assertRaises(G.Refused):
            b.tick(1, "CANONICALIZATION")
        self.assertEqual(b.work, 4)

    def test_search_refusal_has_no_partial_rows(self):
        gen = G.Generator(11, 5, 4, caps(work=500))
        with self.assertRaises(G.Refused) as failure:
            gen.run()
        value = json.loads(G.diagnostic(failure.exception, gen.budget))
        self.assertEqual(value["status"], "NOT_ESTABLISHED")
        self.assertFalse(value["complete"])
        self.assertEqual(value["admittedRows"], 0)
        self.assertNotIn("dataset", value)
        self.assertNotIn("trace", value)
        self.assertNotIn("minimalSupports", value)
        self.assertLessEqual(value["metrics"]["work"], 500)

    def test_refused_root_entry_context_is_current(self):
        gen = G.Generator(7, 3, 3)
        gen.budget.caps["work"] = gen.budget.work
        with self.assertRaises(G.Refused) as failure:
            gen.search_root(2, (1,), 7)
        value = json.loads(G.diagnostic(failure.exception, gen.budget))
        self.assertEqual(value["context"], {"size": 2, "rootIndex": 7, "private": [1]})
        self.assertEqual(value["metrics"]["completedRoots"], 0)

    def test_all_storage_precharges(self):
        b = G.Budget(caps(trace=20, data=10, envelope=30))
        b.store("scratch", 12)
        with self.assertRaises(G.Refused):
            b.store("trace", 9)
        self.assertEqual((b.trace, b.scratch), (0, 12))
        b.store("trace", 8)
        with self.assertRaises(G.Refused):
            b.store("scratch", 1)
        b.release("scratch", 12)
        b.store("data", 10)
        with self.assertRaises(G.Refused):
            b.store("data", 1)
        self.assertEqual(b.data, 10)
        with self.assertRaises(G.Refused):
            b.envelope(31)
        self.assertEqual(b.peak_envelope, 0)

    def test_data_overhead_bound_before_final_insertion(self):
        gen = G.Generator(7, 3, 3, caps(data=200))
        with self.assertRaises(G.Refused) as failure:
            gen.run()
        self.assertEqual(failure.exception.cap, "DATA_WITH_OVERHEAD")
        self.assertEqual(gen.rows, set())

    def test_trace_node_capacity_before_extension(self):
        gen = G.Generator(7, 3, 3)
        b = gen.budget
        previous = (gen.trace.head, len(gen.trace), b.trace)
        needed = gen.trace.LINK_BYTES + sys.getsizeof(b"xyz")
        b.caps["trace"] = b.trace + b.scratch + needed - 1
        with self.assertRaises(G.Refused) as failure:
            gen.emit(b"xyz")
        self.assertEqual(failure.exception.cap, "TRACE_OR_SCRATCH")
        self.assertIs(gen.trace.head, previous[0])
        self.assertEqual((len(gen.trace), b.trace), previous[1:])
        metrics = b.metrics()
        self.assertEqual(metrics["encodedTraceBytes"], len(gen.trace))
        self.assertEqual(metrics["accountedTraceBytes"], b.trace)
        self.assertGreater(b.trace, len(gen.trace))

    def test_domain_allocation_bounded_before_build(self):
        with self.assertRaises(G.Refused) as failure:
            G.Generator(139, 14, 13, caps(trace=100))
        self.assertEqual(failure.exception.cap, "TRACE_OR_SCRATCH")

    def test_summary_and_serialization_caps(self):
        b = G.Budget(caps(summary=10))
        with self.assertRaises(G.Refused):
            G.serialize({"large": "x" * 30}, b)
        failed = json.loads(G.diagnostic(G.Refused("WORK", "TEST"), b))
        self.assertEqual(failed["failure"]["cap"], "SUMMARY")

    def test_deadline_before_work_or_allocation(self):
        ticks = iter([0, 120, 121])
        b = G.Budget(clock=lambda: next(ticks))
        with self.assertRaises(G.Refused) as failure:
            b.store("scratch", 1)
        self.assertEqual(failure.exception.cap, "TIME")
        self.assertEqual((b.work, b.scratch), (0, 0))

    def test_cap_increases_and_malformed_refused(self):
        bad = [{}, caps(work=2500001), caps(work=True), caps(seconds=float("nan")),
               caps(trace=0), caps(data=1.5), caps(seconds=float("inf")), caps(extra=1)]
        for value in bad:
            with self.subTest(value=value), self.assertRaises(G.Refused):
                G.Budget(value)

    def test_flag_boundary_every_missing_and_nonfalse(self):
        good = {key: "false" for key in G.FLAGS}
        G.check_flags(good)
        for key in G.FLAGS:
            for value in [None, False, "False", "0", "true", ""]:
                with self.subTest(key=key, value=value), self.assertRaises(G.Refused):
                    G.check_flags({**good, key: value})
        with self.assertRaises(G.Refused):
            G.check_flags({})

    def test_unsafe_cli_and_stdin_refuse_before_work(self):
        env = {key: "false" for key in G.FLAGS}
        for args, payload in [(["--work=999999999"], b""), ([], b"{}")] :
            result = subprocess.run([sys.executable, "-I", "-S", "-B", str(SCRIPT), *args],
                                    input=payload, env=env, stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE, timeout=5, check=True)
            value = json.loads(result.stdout)
            self.assertEqual(value["metrics"]["work"], 0)
            self.assertEqual(value["status"], "NOT_ESTABLISHED")

    def test_missing_flags_no_computation(self):
        result = subprocess.run([sys.executable, "-I", "-S", "-B", str(SCRIPT)],
                                input=b"", env={}, stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE, timeout=5, check=True)
        value = json.loads(result.stdout)
        self.assertEqual(value["failure"]["phase"], "FLAGS_NOT_EXACTLY_OFF")
        self.assertEqual(value["metrics"]["work"], 0)

    def test_source_cap_guard_before_generator(self):
        stdin = io.TextIOWrapper(io.BytesIO(b""))
        stdout = io.StringIO()
        with mock.patch.dict(G.os.environ, {key: "false" for key in G.FLAGS}, clear=True), \
                mock.patch.object(G.sys, "argv", [str(SCRIPT)]), \
                mock.patch.object(G.sys, "stdin", stdin), \
                mock.patch.object(G, "no_stdin_input", return_value=None), \
                mock.patch.object(G.sys, "stdout", stdout), \
                mock.patch("builtins.open", return_value=io.BytesIO(b"x" * 30001)):
            G.main()
        value = json.loads(stdout.getvalue())
        self.assertEqual(value["failure"]["cap"], "SOURCE")
        self.assertEqual(value["metrics"]["work"], 0)

    def test_open_pipe_refuses_without_waiting(self):
        read_fd, write_fd = os.pipe()
        try:
            with os.fdopen(read_fd, "r") as stream, mock.patch.object(G.sys, "stdin", stream):
                with self.assertRaises(G.Refused) as failure:
                    G.no_stdin_input()
                self.assertEqual(failure.exception.phase, "STDIN_NOT_READY")
        finally:
            os.close(write_fd)

    def test_constructor_refusal_preserves_budget(self):
        b = G.Budget(caps(work=10))
        with self.assertRaises(G.Refused) as failure:
            G.Generator(budget=b)
        value = json.loads(G.diagnostic(failure.exception, b))
        self.assertGreater(value["metrics"]["work"], 0)
        self.assertLessEqual(value["metrics"]["work"], 10)


if __name__ == "__main__":
    unittest.main()
