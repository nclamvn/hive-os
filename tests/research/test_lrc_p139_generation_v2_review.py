"""075A independent SMALL controls only; no default p139 execution.

Reuses the immutable prior review's separate scalar oracle/SET evidence reader;
adapts only v2's compact support-table representation. Synthetic host positives
are deliberately NOT mathematical certificates. Stream tests use real OS pipes.
"""
import base64
import copy
import hashlib
import importlib.util
import itertools
import json
import os
import pathlib
import struct
import tempfile
import unittest
from unittest import mock

REPO = pathlib.Path(__file__).resolve().parents[2]


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, REPO / path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


G = load("review075a_producer", "scripts/operations/attempt-lrc-p139-generation-v2.py")
H = load("review075a_host", "scripts/operations/capture-lrc-p139-generation-v2.py")
O = load("immutable075_oracle", "tests/research/test_lrc_p139_generation_review.py")


def compact_to_reader(body):
    value = copy.deepcopy(body)
    tables = {}
    for s, table in value["minimalSupports"].items():
        raw = base64.b64decode(table["data"], validate=True)
        width = int(s)
        assert table["width"] == width and len(raw) == width * table["count"]
        tables[s] = [list(raw[i:i + width]) for i in range(0, len(raw), width)]
    value["minimalSupports"] = tables
    return value


def tiny_body():
    return json.loads(G.Generator(19, 5, 5).run().candidate())


def replace_trace(body, raw):
    value = copy.deepcopy(body)
    value["trace"] = base64.b64encode(raw).decode()
    value["traceSha256"] = hashlib.sha256(raw).hexdigest()
    value["metrics"]["encodedTraceBytes"] = len(raw)
    return value


def records(body):
    """Independent framing walk, for targeted mutations (not mathematical replay)."""
    raw = base64.b64decode(body["trace"])
    cursor, roots, branches, extensions = 9, [], [], []
    def node():
        nonlocal cursor
        start = cursor
        tag = raw[cursor]
        cursor += 1
        children = []
        if tag == 6:
            count = raw[cursor + 1]
            cursor += 2 + count
            for _ in range(count):
                children.append(node())
            branches.append((start, cursor, children))
        else:
            assert 0 <= tag <= 5
        return start, cursor
    while cursor < len(raw):
        start = cursor
        if raw[cursor] == 244:
            cursor += 3 + raw[cursor + 2]
            node()
            assert raw[cursor] == 245
            footer = cursor
            cursor += 9
            roots.append((start, cursor, footer))
        else:
            assert raw[cursor] == 246
            cursor += 7 + raw[cursor + 2] + body["movingSpeeds"]
            extensions.append((start, cursor))
    assert cursor == len(raw)
    return raw, roots, branches, extensions


def negative():
    return json.loads(G.diagnostic(G.Refused("NODES", "SEARCH_NODE"), G.Budget()))


def transport_positive(zero=False):
    """Structurally coherent, semantically INVALID mock; retention is UNACCEPTED."""
    body = negative()
    del body["context"], body["failure"]
    trace, roots = bytearray(b"LRC139G1\n"), []
    for s, q in [(8, 9), (9, 7), (10, 5), (11, 4), (12, 3), (13, 2)]:
        for private in itertools.combinations(range(1, 10), q):
            chunk = bytes([244, s, q, *private, 2])
            trace.extend(chunk + bytes([245]) + struct.pack("<II", 1, len(chunk)))
            roots.append({"size": s, "private": list(private), "nodes": 1, "traceBytes": len(chunk)})
    data = b"" if zero else bytes(range(1, 14))
    if not zero:
        trace.extend(bytes([246, 13, 0]) + struct.pack("<I", 0) + data)
    body.update(status="COMPLETE_CANDIDATE_UNACCEPTED", complete=True, roots=roots,
                boundary="STRICT_OPEN_BAD", tauAssumption=False,
                encoding="LRC139G1_PREORDER_EXTENSIONS_U8", metricsBoundary="AFTER_BLOBS_BEFORE_FINAL_JSON",
                candidateRows=int(not zero), extensions=int(not zero),
                trace=base64.b64encode(trace).decode(), dataset=base64.b64encode(data).decode(),
                traceSha256=hashlib.sha256(trace).hexdigest(), datasetSha256=hashlib.sha256(data).hexdigest(),
                minimalSupports={str(s): {"width": s, "count": int(s == 13 and not zero),
                    "data": base64.b64encode(data if s == 13 else b"").decode()} for s in range(8, 14)},
                closure={"G": "UNACCEPTED_CANDIDATE", "C": "OPEN", "T": "OPEN", "B": "OPEN"})
    body["metrics"].update(searchNodes=409, completedRoots=409, extensions=int(not zero),
                           encodedTraceBytes=len(trace), encodedDatasetBytes=len(data))
    return body


class ProducerReview(unittest.TestCase):
    def test_all_frozen_pins_and_prior_oracle_immutable(self):
        pins = {
            "scripts/operations/attempt-lrc-p139-generation-v2.py": "f9a43d77a498c0c0ed94d6df919c27a8d217fdfaae1e37556c41738eb5852bb8",
            "scripts/operations/capture-lrc-p139-generation-v2.py": "298b1937c852c124be6cb2e29aa52c02d07d1bd2895688cf84537da139af070d",
            "tests/research/test_lrc_p139_generation_v2.py": "d3a3c89e221774546ac652c5aaffc178c3512d4db3f2a5eef6fc681559143cbb",
            "tests/research/test_lrc_p139_generation_review.py": "bc9b5410de8ea110337a2d98d89734d4ea498ab50b84f674f15a08fe44b2ed8c",
        }
        for path, sha in pins.items():
            self.assertEqual(hashlib.sha256((REPO / path).read_bytes()).hexdigest(), sha)

    def test_all_units_against_scalar_modular_action(self):
        _, _, actions = G.make_domain(139, 14, 13, G.Budget())
        for unit, action in enumerate(actions, 1):
            self.assertEqual(list(action), [min(unit * v % 139, (-unit * v) % 139) for v in range(1, 70)])

    def test_complete_additional_tiny_union_and_repeated_rows(self):
        for p, d, target in [(13, 4, 4), (19, 5, 5), (23, 7, 5)]:
            expected, full, _ = O.exhaustive(p, d, target)
            actual = G.Generator(p, d, target).run()
            body = compact_to_reader(json.loads(actual.candidate()))
            self.assertEqual({tuple(x) for x in actual.rows}, full)
            self.assertEqual({int(s): {tuple(x) for x in rows} for s, rows in body["minimalSupports"].items() if rows}, expected)

    def test_set_replay_of_every_tiny_node_and_extension(self):
        body = tiny_body()
        self.assertEqual(O.tiny_evidence(compact_to_reader(body), 5), O.exhaustive(19, 5, 5)[1])

    def test_rehashed_root_omission_not_a_complete_partition(self):
        body = tiny_body()
        raw, roots, _, _ = records(body)
        start, end, _ = roots[0]
        altered = replace_trace(body, raw[:start] + raw[end:])
        altered["roots"].pop(0)
        altered["metrics"]["completedRoots"] -= 1
        with self.assertRaises(AssertionError):
            O.tiny_evidence(compact_to_reader(altered), 5)

    def test_rehashed_sibling_omission_not_decision_search(self):
        body = tiny_body()
        raw, _, branches, _ = records(body)
        start, _, children = next(x for x in branches if len(x[2]) > 1)
        child_start, child_end = children[0]
        count = raw[start + 2]
        edited = bytearray(raw)
        edited[start + 2] = count - 1
        del edited[child_start:child_end]
        del edited[start + 3]  # remove precisely the omitted first pivot option
        altered = replace_trace(body, edited)
        with self.assertRaises(AssertionError):
            O.tiny_evidence(compact_to_reader(altered), 5)

    def test_rehashed_extension_omission_not_union_evidence(self):
        body = tiny_body()
        raw, _, _, extensions = records(body)
        start, end = extensions[0]
        altered = replace_trace(body, raw[:start] + raw[end:])
        altered["extensions"] -= 1
        with self.assertRaises(AssertionError):
            O.tiny_evidence(compact_to_reader(altered), 5)

    def test_rehashed_truncation_and_orphan_reject(self):
        body = tiny_body()
        raw = base64.b64decode(body["trace"])
        for value in [raw[:-1], raw + b"\0"]:
            with self.assertRaises(AssertionError):
                O.tiny_evidence(compact_to_reader(replace_trace(body, value)), 5)

    def test_support_join_workspace_reserved_before_sort(self):
        b = G.Budget()
        gen = G.Generator(budget=b)  # domain construction only, no full search
        minimal = {bytes(x) for x in itertools.islice(itertools.combinations(range(1, 70), 13), 20)}
        b.limits["memory"] = b.memory + 4096 + 16 * len(minimal)
        with mock.patch.object(G, "sorted", create=True) as sort_rows:
            with self.assertRaises(G.Refused) as failure:
                gen.extend(13, minimal)
            sort_rows.assert_not_called()
        self.assertEqual(failure.exception.cap, "MEMORY")
        self.assertFalse(gen.supports)

    def test_nodes_not_operations_and_no_root_reset(self):
        limits = dict(G.LIMITS, nodes=1)
        b = G.Budget(limits)
        gen = G.Generator(7, 3, 3, b)
        b.poll(10000000, "NO_ARTIFICIAL_OP_CAP")
        with self.assertRaises(G.Refused):
            gen.run()
        self.assertEqual(b.nodes, 1)
        before = b.nodes
        with self.assertRaises(G.Refused):
            gen.root(2, (1,), 7, set())
        self.assertEqual(b.nodes, before)
        self.assertEqual(b.context["rootIndex"], 7)

    def test_base64_deadline_after_preflight(self):
        now = [0.0]
        b = G.Budget(clock=lambda: now[0])
        gen = G.Generator(7, 3, 3, b).run()
        encode = G.base64.b64encode
        def advance(value):
            result = encode(value)
            now[0] = 120.0
            return result
        with mock.patch.object(G.base64, "b64encode", side_effect=advance):
            with self.assertRaises(G.Refused) as failure:
                gen.candidate()
        self.assertEqual(failure.exception.cap, "TIME")
        self.assertEqual(failure.exception.phase, "DATA_BASE64")

    def test_encoded_trace_bound_preserves_fixed_allocation(self):
        b = G.Budget(dict(G.LIMITS, trace=10))
        trace = G.Trace(b)
        capacity = trace.buffer.__alloc__()
        trace.emit(b"0123456789")
        with self.assertRaises(G.Refused):
            trace.emit(b"!")
        self.assertEqual((trace.length, len(trace.buffer), trace.buffer.__alloc__()), (10, 10, capacity))


class HostReview(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.repo = pathlib.Path(self.temp.name).resolve()
        self.source = self.repo / "scripts/operations/attempt-lrc-p139-generation-v2.py"
        self.source.parent.mkdir(parents=True)
        self.source.write_bytes((REPO / "scripts/operations/attempt-lrc-p139-generation-v2.py").read_bytes())
        self.pin = hashlib.sha256(self.source.read_bytes()).hexdigest()
        history = self.repo / "docs/verification/TIP-075_MAIN_COMPLETION.md"
        history.parent.mkdir(parents=True)
        history.write_bytes((REPO / "docs/verification/TIP-075_MAIN_COMPLETION.md").read_bytes())
        self.flags = mock.patch.dict(os.environ, dict.fromkeys(H.FLAGS, "false"), clear=True)
        self.flags.start()
        H.SOURCE_VALIDATOR = H.load_validator(self.source.read_bytes(), self.pin)

    def tearDown(self):
        self.flags.stop()
        self.temp.cleanup()

    def collect(self, attempt, body=None, child=None):
        return H.collect(attempt, self.repo, self.pin,
                         child if child is not None else lambda _: H.json_bytes(negative() if body is None else body))

    def test_positive_and_zero_output_transport_are_unaccepted(self):
        for zero in [False, True]:
            self.assertTrue(H.validate(transport_positive(zero)))
        receipt = self.collect(3, transport_positive())
        self.assertFalse(receipt["semanticVerified"])
        self.assertEqual(receipt["admittedRows"], 0)
        child = mock.Mock()
        with self.assertRaises(H.CaptureRefused):
            self.collect(4, child=child)
        child.assert_not_called()

    def test_otherwise_valid_positive_single_field_mutations(self):
        original = transport_positive()
        for change in [("roots", []), ("candidateRows", True), ("epoch", 3),
                       ("tauAssumption", True), ("encoding", "other"), ("admittedRows", 1)]:
            value = copy.deepcopy(original)
            value[change[0]] = change[1]
            with self.assertRaises(H.CaptureRefused):
                H.validate(value)
        value = copy.deepcopy(original)
        value["minimalSupports"]["13"]["data"] = base64.b64encode(bytes([1] * 13)).decode()
        with self.assertRaises(H.CaptureRefused):
            H.validate(value)

    def test_limits_and_blob_metrics_cannot_drift(self):
        for field, change in [("limits", {**G.LIMITS, "nodes": 2500001}),
                              ("metrics", {**transport_positive()["metrics"], "encodedDatasetBytes": 0})]:
            value = transport_positive()
            value[field] = change
            with self.assertRaises(H.CaptureRefused):
                H.validate(value)

    def test_duplicate_nonfinite_or_nonobject_parse(self):
        for raw in [b'{"x":1,"x":2}', b'{"x":Infinity}', b'[]']:
            with self.assertRaises(H.CaptureRefused):
                H.parse(raw)

    def test_start_only_history_and_existing_outputs_never_dispatch(self):
        with self.assertRaises(Exception):
            self.collect(4)
        directory = self.repo / "docs/research/lrc-p139-075a-evidence"
        (directory / "attempt-3-start.json").write_bytes(b"{}")
        child = mock.Mock()
        with self.assertRaises(Exception):
            self.collect(3, child=child)
        with self.assertRaises(Exception):
            self.collect(4, child=child)
        child.assert_not_called()

    def test_prior_terminal_receipt_one_fault_at_a_time(self):
        self.collect(3)
        path = self.repo / "docs/research/lrc-p139-075a-evidence/attempt-3-receipt.json"
        original = path.read_bytes()
        for key, value in [("terminal", 1), ("semanticVerified", True), ("startSha256", "wrong"),
                           ("payloadSha256", "wrong"), ("payloadBytes", True), ("producerSha256", "wrong")]:
            body = json.loads(original)
            body[key] = value
            path.write_bytes(H.json_bytes(body))
            child = mock.Mock()
            with self.assertRaises(Exception):
                self.collect(4, child=child)
            child.assert_not_called()
        path.write_bytes(original)
        self.assertEqual(self.collect(4)["status"], "NOT_ESTABLISHED")

    def test_guard_failures_precede_pinned_code_load(self):
        for mode in ["flag", "source", "history"]:
            child = mock.Mock()
            with mock.patch.object(H, "load_validator") as loader:
                if mode == "flag":
                    with mock.patch.dict(os.environ, {H.FLAGS[0]: "true"}):
                        with self.assertRaises(Exception):
                            self.collect(3, child=child)
                else:
                    path = self.source if mode == "source" else self.repo / "docs/verification/TIP-075_MAIN_COMPLETION.md"
                    old = path.read_bytes()
                    path.write_bytes(b"drift")
                    with self.assertRaises(Exception):
                        self.collect(3, child=child)
                    path.write_bytes(old)
                loader.assert_not_called()
                child.assert_not_called()

    def test_symlink_file_and_directory_cannot_dispatch(self):
        directory = self.repo / "docs/research"
        directory.mkdir()
        (directory / "lrc-p139-075a-evidence").symlink_to(self.repo)
        child = mock.Mock()
        with self.assertRaises(Exception):
            self.collect(3, child=child)
        child.assert_not_called()
        with self.assertRaises(Exception):
            H.create_only(directory, "lrc-p139-075a-evidence", b"x")

    def test_host_failure_keeps_start_and_forbids_same_attempt(self):
        receipt = self.collect(3, child=mock.Mock(side_effect=H.CaptureRefused("CHILD_TIMEOUT")))
        self.assertEqual(receipt["hostFailure"], "CHILD_TIMEOUT")
        with self.assertRaises(Exception):
            self.collect(3)

    def test_definitions_load_does_not_construct_or_allocate_trace(self):
        with mock.patch("builtins.bytearray") as allocate:
            self.assertTrue(callable(H.load_validator(self.source.read_bytes(), self.pin)))
        allocate.assert_not_called()

    def pipe_child(self, stdout=b"", stderr=b"", open_writers=False):
        class Child:
            def __init__(inner):
                inner.stdout_r, inner.stdout_w = os.pipe()
                inner.stderr_r, inner.stderr_w = os.pipe()
                inner.stdout = os.fdopen(inner.stdout_r, "rb", buffering=0)
                inner.stderr = os.fdopen(inner.stderr_r, "rb", buffering=0)
                inner.killed, inner.waits, inner.running = False, 0, True
                for fd, raw in [(inner.stdout_w, stdout), (inner.stderr_w, stderr)]:
                    if raw:
                        os.write(fd, raw)
                    if not open_writers:
                        os.close(fd)
                inner.open = open_writers
            def poll(inner):
                return None if inner.running else 0
            def kill(inner):
                inner.killed = True
                inner.running = False
                if inner.open:
                    os.close(inner.stdout_w)
                    os.close(inner.stderr_w)
                    inner.open = False
            def wait(inner, timeout):
                inner.waits += 1
                inner.running = False
                return 0
        return Child()

    def test_actual_os_pipe_stream_success(self):
        child = self.pipe_child(b"bounded", b"")
        result = H.stream_child(self.source, popen=lambda *a, **kw: child)
        self.assertEqual(result, b"bounded")
        self.assertFalse(child.killed)
        self.assertEqual(child.waits, 1)
        self.assertTrue(child.stdout.closed and child.stderr.closed)

    def test_actual_os_pipe_stream_stdout_and_stderr_excess(self):
        for out, err in [(b"01234567890", b""), (b"", b"01234567890")]:
            child = self.pipe_child(out, err)
            with mock.patch.object(H, "OUT", 10), mock.patch.object(H, "ERR", 10):
                with self.assertRaises(H.CaptureRefused):
                    H.stream_child(self.source, popen=lambda *a, **kw: child)
            self.assertTrue(child.killed)
            self.assertEqual(child.waits, 1)
            self.assertTrue(child.stdout.closed and child.stderr.closed)

    def test_actual_os_pipe_timeout_kills_waits_closes(self):
        child = self.pipe_child(open_writers=True)
        ticks = iter([0.0, 120.0])
        with self.assertRaises(H.CaptureRefused):
            H.stream_child(self.source, clock=lambda: next(ticks), popen=lambda *a, **kw: child)
        self.assertTrue(child.killed)
        self.assertEqual(child.waits, 1)
        self.assertTrue(child.stdout.closed and child.stderr.closed)


if __name__ == "__main__":
    unittest.main()
