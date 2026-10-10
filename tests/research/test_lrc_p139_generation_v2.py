"""075A small engineering controls; no default whole attempt or live execution."""
import importlib.util
import base64
import hashlib
import io
import itertools
import json
import os
import pathlib
import tempfile
import struct
import types
import unittest
from unittest import mock

REPO = pathlib.Path(__file__).resolve().parents[2]


def load(name, relative):
    spec = importlib.util.spec_from_file_location(name, REPO / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


G = load("producer075a", "scripts/operations/attempt-lrc-p139-generation-v2.py")
H = load("capture075a", "scripts/operations/capture-lrc-p139-generation-v2.py")


def limits(**updates):
    result = G.LIMITS.copy()
    result.update(updates)
    return result


def oracle(p, divisor, target):
    n = (p - 1) // 2
    masks = {v: {t for t in range(1, n + 1) if divisor * min(v * t % p, (-v * t) % p) < p}
             for v in range(1, n + 1)}
    def full(row):
        return set().union(*(masks[v] for v in row)) == set(range(1, n + 1))
    def image(row):
        return min(tuple(sorted(min(v * g % p, (-v * g) % p) for v in row)) for g in range(1, n + 1))
    minima = {s: {image(row) for row in itertools.combinations(range(1, n + 1), s)
                  if full(row) and all(not full(row[:i] + row[i + 1:]) for i in range(s))}
              for s in range(1, target + 1)}
    rows = {image(row) for row in itertools.combinations_with_replacement(range(1, n + 1), target) if full(row)}
    return minima, rows


def negative():
    b = G.Budget()
    return json.loads(G.diagnostic(G.Refused("NODES", "SEARCH_NODE"), b))


def structural_positive():
    """Synthetic host-transport fixture, NOT a mathematical generation certificate."""
    value = negative()
    del value["failure"], value["context"]
    roots, trace = [], bytearray(b"LRC139G1\n")
    for size, q in G.schedule(69, 9, 13):
        for private in itertools.combinations(range(1, 10), q):
            row = bytes([244, size, q, *private, 2])
            trace.extend(row + bytes([245]) + struct.pack("<II", 1, len(row)))
            roots.append({"size": size, "private": list(private), "nodes": 1, "traceBytes": len(row)})
    data = bytes(range(1, 14))
    trace.extend(bytes([246, 13, 0]) + struct.pack("<I", 0) + data)
    tables = {str(s): {"width": s, "count": int(s == 13),
                      "data": base64.b64encode(data if s == 13 else b"").decode()} for s in range(8, 14)}
    value.update(status="COMPLETE_CANDIDATE_UNACCEPTED", complete=True,
                 tauAssumption=False, boundary="STRICT_OPEN_BAD", encoding="LRC139G1_PREORDER_EXTENSIONS_U8",
                 metricsBoundary="AFTER_BLOBS_BEFORE_FINAL_JSON", extensions=1, candidateRows=1,
                 roots=roots, minimalSupports=tables, trace=base64.b64encode(trace).decode(), dataset=base64.b64encode(data).decode(),
                 traceSha256=H.digest(trace), datasetSha256=H.digest(data),
                 closure={"G": "UNACCEPTED_CANDIDATE", "C": "OPEN", "T": "OPEN", "B": "OPEN"})
    value["metrics"].update(searchNodes=409, completedRoots=409, extensions=1,
                             encodedTraceBytes=len(trace), encodedDatasetBytes=13)
    return value


class ProducerTests(unittest.TestCase):
    def test_exact_masks_coverer_transpose_all_units(self):
        b = G.Budget()
        masks, coverers, actions = G.make_domain(139, 14, 13, b)
        for v in range(69):
            self.assertEqual(masks[v].bit_count(), 9)
            self.assertEqual(coverers[v].bit_count(), 9)
            for t in range(69):
                expected = 14 * min((v + 1) * (t + 1) % 139, (-(v + 1) * (t + 1)) % 139) < 139
                self.assertEqual(bool(masks[v] & (1 << t)), expected)
                self.assertEqual(bool(coverers[t] & (1 << v)), expected)
        self.assertEqual(len(actions), 69)
        self.assertEqual(G.schedule(69, 9, 13), [(8, 9), (9, 7), (10, 5), (11, 4), (12, 3), (13, 2)])
        self.assertEqual(sum(len(list(itertools.combinations(range(9), q))) for _, q in G.schedule(69, 9, 13)), 409)

    def test_complete_tiny_multisets_and_support_tables(self):
        for p, d, target in [(7, 3, 3), (11, 5, 4), (17, 6, 5), (19, 6, 5)]:
            with self.subTest(p=p):
                minima, rows = oracle(p, d, target)
                actual = G.Generator(p, d, target).run()
                self.assertEqual({tuple(x) for x in actual.rows}, rows)
                for size, table in actual.supports.items():
                    width = table["width"]
                    values = {tuple(table["raw"][i:i + width]) for i in range(0, len(table["raw"]), width)}
                    self.assertEqual(values, minima[width])
                self.assertTrue(any(len(set(row)) < target for row in rows))
                body = json.loads(actual.candidate())
                self.assertEqual(body["admittedRows"], 0)
                self.assertEqual(body["status"], "COMPLETE_CANDIDATE_UNACCEPTED")

    def test_histogram_exact_top_gain(self):
        for values in itertools.product(range(4), repeat=5):
            histogram = [values.count(i) for i in range(4)]
            for slots in range(1, 7):
                self.assertEqual(G.top_gain(histogram, slots), sum(sorted(values, reverse=True)[:slots]))

    def test_node_cap_only_visits_not_operations(self):
        b = G.Budget(limits(nodes=2))
        b.poll(10000000, "EXTENSIONS_UNITS")
        b.node()
        b.node()
        with self.assertRaises(G.Refused) as failure:
            b.node()
        self.assertEqual(failure.exception.cap, "NODES")
        self.assertEqual(b.nodes, 2)
        self.assertGreater(b.operations, 2500000)

    def test_global_node_refusal_no_partial_data(self):
        b = G.Budget(limits(nodes=2))
        gen = G.Generator(11, 5, 4, b)
        with self.assertRaises(G.Refused) as failure:
            gen.run()
        value = json.loads(G.diagnostic(failure.exception, b))
        self.assertEqual(value["admittedRows"], 0)
        self.assertNotIn("dataset", value)
        self.assertEqual(b.nodes, 2)

    def test_trace_preallocation_refuses_before_creation(self):
        b = G.Budget(limits(memory=100))
        with mock.patch.object(G, "bytearray", create=True) as allocate:
            with self.assertRaises(G.Refused):
                G.Trace(b)
            allocate.assert_not_called()

    def test_trace_never_grows_capacity(self):
        b = G.Budget(limits(trace=10))
        trace = G.Trace(b)
        original = trace.buffer.__alloc__()
        trace.emit(b"1234567890")
        with self.assertRaises(G.Refused):
            trace.emit(b"x")
        self.assertEqual(trace.length, 10)
        self.assertEqual(trace.buffer.__alloc__(), original)
        self.assertEqual(len(trace.buffer), 10)

    def test_encoded_data_precharge_separate_memory(self):
        b = G.Budget(limits(data=2))
        gen = G.Generator(7, 3, 3, b)
        with self.assertRaises(G.Refused) as failure:
            gen.add(gen.rows, b"123", final=True)
        self.assertEqual(failure.exception.cap, "DATA")
        self.assertFalse(gen.rows)

    def test_memory_preflight_before_sets_sort_and_encoding(self):
        for phase in ("set", "sort", "encoding"):
            with self.subTest(phase=phase):
                b = G.Budget()
                gen = G.Generator(7, 3, 3, b)
                b.reserve(b.limits["memory"] - b.memory, "TEST_FILL")
                with self.assertRaises(G.Refused) as failure:
                    if phase == "set":
                        gen.add(gen.rows, b"123", final=True)
                    elif phase == "sort":
                        gen.extend(2, {b"12"})
                    else:
                        gen.candidate()
                self.assertEqual(failure.exception.cap, "MEMORY")
                self.assertFalse(gen.rows)
                self.assertFalse(gen.supports)
                self.assertEqual(b.extensions, 0)

    def test_deadline_unit_and_extension(self):
        ticks = [0]
        b = G.Budget(clock=lambda: ticks[0])
        gen = G.Generator(7, 3, 3, b)
        ticks[0] = 120
        with self.assertRaises(G.Refused):
            G.canonical(b"123", gen.actions, b)
        with self.assertRaises(G.Refused):
            gen.extend(2, {b"12"})

    def test_stdout_exact_bound_not_six_trace(self):
        b = G.Budget(limits(stdout=10))
        gen = G.Generator(7, 3, 3, b).run()
        with self.assertRaises(G.Refused) as failure:
            gen.candidate()
        self.assertEqual(failure.exception.cap, "STDOUT")

    def test_malformed_limits_and_giant_domain(self):
        for value in [{}, limits(nodes=2500001), limits(nodes=True), limits(seconds=float("nan")), limits(memory=0)]:
            with self.assertRaises(G.Refused):
                G.Budget(value)
        with self.assertRaises(G.Refused):
            G.Generator(1000000007, 14, 13)

    def test_flags_and_cli_no_work(self):
        for flag in G.FLAGS:
            with self.assertRaises(G.Refused):
                G.flags_off({**dict.fromkeys(G.FLAGS, "false"), flag: "true"})
        with mock.patch.object(G.sys, "argv", ["producer", "--nodes=999999"]), mock.patch.object(G.sys, "stdout", io.StringIO()) as out:
            G.main()
        self.assertEqual(json.loads(out.getvalue())["metrics"]["searchNodes"], 0)


class HostTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.repo = pathlib.Path(self.temp.name).resolve()
        self.source = self.repo / "scripts/operations/attempt-lrc-p139-generation-v2.py"
        self.source.parent.mkdir(parents=True)
        self.source.write_bytes((REPO / "scripts/operations/attempt-lrc-p139-generation-v2.py").read_bytes())
        self.pin = H.digest(self.source.read_bytes())
        history = self.repo / "docs/verification/TIP-075_MAIN_COMPLETION.md"
        history.parent.mkdir(parents=True)
        history.write_bytes((REPO / "docs/verification/TIP-075_MAIN_COMPLETION.md").read_bytes())
        self.flags = mock.patch.dict(os.environ, dict.fromkeys(H.FLAGS, "false"), clear=True)
        self.flags.start()
        H.SOURCE_VALIDATOR = H.load_validator(self.source.read_bytes(), self.pin)

    def tearDown(self):
        self.flags.stop()
        self.temp.cleanup()

    def collect(self, attempt, value=None, child=None):
        if child is None:
            child = lambda _: H.json_bytes(negative() if value is None else value)
        return H.collect(attempt, self.repo, self.pin, child)

    def test_negative_create_only_history_3_then4(self):
        first = self.collect(3)
        second = self.collect(4)
        self.assertEqual((first["attempt"], second["attempt"]), (3, 4))
        self.assertFalse(second["semanticVerified"])
        with self.assertRaises(Exception):
            self.collect(3)

    def test_4_without_3_or_incomplete_start_refuses(self):
        with self.assertRaises(Exception):
            self.collect(4)
        directory = self.repo / "docs/research/lrc-p139-075a-evidence"
        (directory / "attempt-3-start.json").write_text("{}")
        with self.assertRaises(Exception):
            self.collect(4)

    def test_pin_drift_before_child(self):
        self.source.write_bytes(b"drift")
        child = mock.Mock()
        with self.assertRaises(H.CaptureRefused):
            self.collect(3, child=child)
        child.assert_not_called()

    def test_validator_load_refuses_bad_flags_and_pins(self):
        with mock.patch("builtins.compile") as compile_code:
            with self.assertRaises(H.CaptureRefused):
                H.load_validator(self.source.read_bytes(), "wrong")
            with mock.patch.dict(os.environ, {H.FLAGS[0]: "true"}):
                with self.assertRaises(H.CaptureRefused):
                    H.load_validator(self.source.read_bytes(), self.pin)
            compile_code.assert_not_called()

    def test_validator_load_definitions_not_trace_preallocation(self):
        with mock.patch("builtins.bytearray") as allocate:
            validator = H.load_validator(self.source.read_bytes(), self.pin)
        allocate.assert_not_called()
        self.assertTrue(callable(validator))

    def test_bad_status_root_epoch_and_bool_counts(self):
        for key, val in [("root", "other"), ("epoch", True), ("complete", True), ("admittedRows", False)]:
            with self.subTest(key=key), self.assertRaises(H.CaptureRefused):
                H.validate({**negative(), key: val})

    def test_duplicate_nonfinite_parse(self):
        for blob in [b'{"x":1,"x":2}', b'{"x":NaN}', b'[]']:
            with self.assertRaises(H.CaptureRefused):
                H.parse(blob)

    def test_partial_payload_never_retained(self):
        receipt = self.collect(3, {**negative(), "trace": "AAAA"})
        self.assertEqual(receipt["status"], "NOT_ESTABLISHED")
        self.assertIsNone(receipt["diagnostic"])
        self.assertIsNone(receipt["payloadSha256"])
        self.assertFalse((self.repo / "docs/research/lrc-p139-075a-evidence/attempt-3-candidate.json").exists())

    def test_oversized_child_summary(self):
        receipt = self.collect(3, child=lambda _: b"x" * (H.OUT + 1))
        self.assertEqual(receipt["hostFailure"], "STDOUT_BYTES")

    def test_symlink_directory_refuses_dispatch(self):
        directory = self.repo / "docs/research"
        directory.mkdir()
        (directory / "lrc-p139-075a-evidence").symlink_to(self.repo)
        child = mock.Mock()
        with mock.patch.object(H, "load_validator") as load_source:
            with self.assertRaises(H.CaptureRefused):
                self.collect(3, child=child)
            load_source.assert_not_called()
        child.assert_not_called()

    def test_preexisting_start_refuses_module_load(self):
        self.collect(3)
        with mock.patch.object(H, "load_validator") as load_source:
            with self.assertRaises(H.CaptureRefused):
                self.collect(3)
            load_source.assert_not_called()

    def test_child_failure_retains_exclusive_start(self):
        receipt = self.collect(3, child=mock.Mock(side_effect=H.CaptureRefused("CHILD_TIMEOUT")))
        self.assertEqual(receipt["hostFailure"], "CHILD_TIMEOUT")
        self.assertTrue((self.repo / "docs/research/lrc-p139-075a-evidence/attempt-3-start.json").exists())
        with self.assertRaises(Exception):
            self.collect(3)

    def test_positive_transport_retained_unaccepted_no4(self):
        value = structural_positive()
        receipt = self.collect(3, value)
        self.assertEqual(receipt["status"], "COMPLETE_CANDIDATE_UNACCEPTED", receipt["hostFailure"])
        self.assertFalse(receipt["semanticVerified"])
        self.assertEqual(receipt["admittedRows"], 0)
        path = self.repo / "docs/research/lrc-p139-075a-evidence/attempt-3-candidate.json"
        self.assertEqual(path.read_bytes(), H.json_bytes(value))
        with self.assertRaises(H.CaptureRefused):
            self.collect(4)

    def test_positive_schema_single_faults(self):
        for key in ["roots", "metrics", "limits", "encoding", "extensions", "minimalSupports"]:
            value = structural_positive()
            del value[key]
            with self.subTest(key=key), self.assertRaises(H.CaptureRefused):
                H.validate(value)
        value = structural_positive()
        value["roots"].pop()
        with self.assertRaises(H.CaptureRefused):
            H.validate(value)
        value = structural_positive()
        value["minimalSupports"]["13"]["data"] = base64.b64encode(bytes([1, 1, *range(3, 14)])).decode()
        with self.assertRaises(H.CaptureRefused):
            H.validate(value)

    def test_previous_receipt_truthy_bool_and_chain_mutations(self):
        self.collect(3)
        receipt_path = self.repo / "docs/research/lrc-p139-075a-evidence/attempt-3-receipt.json"
        original = receipt_path.read_bytes()
        for key, val in [("terminal", "true"), ("semanticVerified", 0), ("startSha256", "wrong"), ("payloadBytes", True)]:
            value = json.loads(original)
            value[key] = val
            receipt_path.write_bytes(H.json_bytes(value))
            with self.subTest(key=key), self.assertRaises(H.CaptureRefused):
                self.collect(4)
        receipt_path.write_bytes(original)

    def test_real_stream_function_timeout_excess_kill_wait(self):
        class FakeSelector:
            def __init__(self):
                self.mapping = {}
            def register(self, stream, _, data):
                self.mapping[stream] = types.SimpleNamespace(fileobj=stream, data=data)
            def unregister(self, stream):
                del self.mapping[stream]
            def get_map(self):
                return self.mapping
            def select(self, _):
                return [(key, 0) for key in list(self.mapping.values())]
            def close(self):
                pass
        for mode in ["timeout", "stdout", "stderr"]:
            child = mock.Mock()
            child.poll.return_value = None
            child.wait.return_value = 0
            ticks = iter([0, 121] if mode == "timeout" else [0, 0, 0, 0])
            blocks = [b"x" * 11] if mode == "stdout" else [b"", b"x" * 11]
            with mock.patch.object(H.selectors, "DefaultSelector", FakeSelector), \
                    mock.patch.object(H.os, "read", side_effect=blocks), \
                    mock.patch.object(H, "OUT", 10), mock.patch.object(H, "ERR", 10):
                with self.subTest(mode=mode), self.assertRaises(H.CaptureRefused):
                    H.stream_child(self.source, clock=lambda: next(ticks), popen=lambda *a, **kw: child)
            child.kill.assert_called_once()
            child.wait.assert_called_once()
            child.stdout.close.assert_called_once()
            child.stderr.close.assert_called_once()


if __name__ == "__main__":
    unittest.main()
