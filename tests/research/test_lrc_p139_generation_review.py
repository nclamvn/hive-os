"""TIP-075 independent small-domain controls; never a full p139 attempt.

The set-valued brute force and tiny evidence reader are separate algorithms.
Neither constitutes the separately released WHOLE G semantic checker.
"""
import base64
import hashlib
import importlib.util
import itertools
import json
import pathlib
import struct
import sys
import unittest

PATH = pathlib.Path(__file__).resolve().parents[2] / "scripts/operations/attempt-lrc-p139-generation.py"
SPEC = importlib.util.spec_from_file_location("reviewed_p139_generator", PATH)
G = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(G)


def masks(p, d):
    return {v: {t for t in range(1, (p + 1) // 2)
                if d * min(v * t % p, (-v * t) % p) < p}
            for v in range(1, (p + 1) // 2)}


def representative(row, p):
    return min(tuple(sorted(min(v * u % p, (-v * u) % p) for v in row))
               for u in range(1, (p + 1) // 2))


def exhaustive(p, d, target):
    mm, universe = masks(p, d), set(range(1, (p + 1) // 2))
    def cover(row):
        return set().union(*(mm[v] for v in row)) == universe
    minimal = {}
    raw = []
    for s in range(1, target + 1):
        rows = [row for row in itertools.combinations(mm, s)
                if cover(row) and all(not cover(row[:j] + row[j + 1:]) for j in range(s))]
        raw.extend(rows)
        if rows:
            minimal[s] = {representative(row, p) for row in rows}
    full = {representative(row, p) for row in
            itertools.combinations_with_replacement(mm, target) if cover(row)}
    return minimal, full, raw


def tiny_evidence(body, divisor):
    """Strict independent SET replay of every tiny root, node and extension."""
    p, target = body["prime"], body["movingSpeeds"]
    mm, universe = masks(p, divisor), set(range(1, (p + 1) // 2))
    n, cardinality = len(mm), len(mm[1])
    trace = base64.b64decode(body["trace"], validate=True)
    assert trace.startswith(b"LRC139G1\n")
    cursor, root_index, nodes, extensions = 9, 0, 0, 0
    supports, final = {}, set()
    def take(count):
        nonlocal cursor
        value = trace[cursor:cursor + count]
        assert len(value) == count
        cursor += count
        return value
    def visit(selected, available, slots):
        nonlocal nodes
        nodes += 1
        covered = set().union(*(mm[v] for v in selected))
        private = [mm[v] - set().union(*(mm[w] for w in selected if w != v)) for v in selected]
        uncovered = universe - covered
        tag = take(1)[0]
        if any(not x for x in private):
            assert tag == 0
        elif slots == 0:
            assert tag == (2 if uncovered else 1)
            if not uncovered:
                supports[size].add(representative(selected, p))
        elif not uncovered or len(uncovered) > cardinality * slots or len(available) < slots:
            assert tag == 3
        elif uncovered - set().union(*(mm[v] for v in available)):
            assert tag == 4
        elif sum(sorted(len(mm[v] & uncovered) for v in available)[-slots:]) < len(uncovered):
            assert tag == 5
        else:
            assert tag == 6
            pivot = min(uncovered, key=lambda t: (sum(t in mm[v] for v in available), t))
            options = [v for v in available if pivot in mm[v]]
            assert take(2) == bytes([pivot, len(options)])
            assert take(len(options)) == bytes(options)
            remaining = available[:]
            for v in options:
                remaining.remove(v)
                visit(selected + [v], remaining[:], slots - 1)
    for size in range((n + cardinality - 1) // cardinality, target + 1):
        supports[size] = set()
        q = max(1, (2 * n - cardinality * size + size - 1) // size)
        for root in itertools.combinations(sorted(mm[1]), q):
            start, before = cursor, nodes
            assert take(3 + q) == bytes([244, size, q, *root])
            visit([1], [v for v in mm if v != 1 and not mm[v] & set(root)], size - 1)
            tree_bytes, count = cursor - start, nodes - before
            assert take(1) == bytes([245])
            assert struct.unpack("<II", take(8)) == (count, tree_bytes)
            assert body["roots"][root_index] == {"size": size, "private": list(root),
                                                  "nodes": count, "traceBytes": tree_bytes}
            root_index += 1
        assert body["minimalSupports"][str(size)] == [list(x) for x in sorted(supports[size])]
        for i, support in enumerate(sorted(supports[size])):
            length = target - size
            for extra in itertools.combinations_with_replacement(mm, length):
                image = representative(support + extra, p)
                assert take(7 + length + target) == (bytes([246, size, length])
                        + struct.pack("<I", i) + bytes(extra) + bytes(image))
                final.add(image)
                extensions += 1
    assert cursor == len(trace)
    assert root_index == len(body["roots"])
    assert extensions == body["extensions"]
    assert body["candidateRows"] == len(final)
    assert base64.b64decode(body["dataset"], validate=True) == b"".join(bytes(x) for x in sorted(final))
    assert body["traceSha256"] == hashlib.sha256(trace).hexdigest()
    return final


class IndependentControls(unittest.TestCase):
    def test_frozen_source_pin(self):
        self.assertEqual(hashlib.sha256(PATH.read_bytes()).hexdigest(),
                         "4d9931b0e5549567ac5c956f66272e04e949aedd9aa896b09690353855fc0ec7")

    def test_additional_exhaustive_domains(self):
        for p, d, target in [(13, 4, 4), (19, 5, 5), (23, 7, 5)]:
            with self.subTest(p=p):
                expected, full, _ = exhaustive(p, d, target)
                actual = G.Generator(p, d, target).run()
                self.assertEqual({s: r for s, r in actual.minimal.items() if r}, expected)
                self.assertEqual(actual.rows, full)

    def test_private_bound_and_normalization_on_every_tiny_minimal_cover(self):
        p, d, target = 19, 5, 5
        mm, universe = masks(p, d), set(range(1, 10))
        _, _, covers = exhaustive(p, d, target)
        self.assertTrue(covers)
        for row in covers:
            private = {v: mm[v] - set().union(*(mm[w] for w in row if w != v)) for v in row}
            self.assertGreaterEqual(sum(map(len, private.values())), 2 * len(universe) - len(mm[1]) * len(row))
            chosen = max(row, key=lambda v: len(private[v]))
            inverse = pow(chosen, -1, p)
            mapped = {min(t * chosen % p, (-t * chosen) % p) for t in private[chosen]}
            self.assertTrue(mapped <= mm[1])
            normalized = tuple(min(v * inverse % p, (-v * inverse) % p) for v in row)
            self.assertIn(1, normalized)
            self.assertEqual(set().union(*(mm[v] for v in normalized)), universe)

    def test_tiny_trace_semantics_complete_and_unaccepted(self):
        for p, d, target in [(13, 4, 4), (19, 5, 5)]:
            with self.subTest(p=p):
                gen = G.Generator(p, d, target).run()
                body = json.loads(gen.candidate())
                self.assertEqual(tiny_evidence(body, d), gen.rows)
                self.assertEqual(body["admittedRows"], 0)
                self.assertEqual(body["closure"]["G"], "UNACCEPTED_CANDIDATE")

    def test_hash_consistent_tiny_trace_truncation_and_orphan_refused(self):
        body = json.loads(G.Generator(13, 4, 4).run().candidate())
        original = base64.b64decode(body["trace"])
        for changed in [original[:-1], original + b"\x00", original[:9] + b"\xff" + original[10:]]:
            bad = {**body, "trace": base64.b64encode(changed).decode(),
                   "traceSha256": hashlib.sha256(changed).hexdigest()}
            with self.assertRaises(AssertionError):
                tiny_evidence(bad, 4)

    def test_canonicalization_consumes_same_global_budget(self):
        b = G.Budget()
        _, actions, _ = G.domain(139, 14, b)
        before = b.work
        b.caps["work"] = before + 10
        with self.assertRaises(G.Refused) as error:
            G.canonical(tuple(range(1, 14)), actions, b)
        self.assertEqual(error.exception.cap, "WORK")
        self.assertEqual(b.work, before + 10)

    def test_extension_cannot_reset_spent_budget(self):
        gen = G.Generator(7, 3, 3).run()
        before = gen.budget.work
        gen.budget.caps["work"] = before
        with self.assertRaises(G.Refused) as error:
            gen.extend(2)
        self.assertEqual(error.exception.cap, "WORK")
        self.assertEqual(gen.budget.work, before)

    def test_retained_trace_bytes_and_link_nodes_precharged(self):
        b = G.Budget()
        trace = G.TraceChunks(b)
        values = [b"x", b"yz", b"abc"]
        for value in values:
            trace.extend(value)
        self.assertEqual(b.trace, sum(sys.getsizeof(x) + sys.getsizeof((None, None)) for x in values))
        self.assertEqual(trace.encode(), b"xyzabc")
        b.caps["trace"] = b.trace + b.scratch
        before = (trace.head, len(trace), b.trace)
        with self.assertRaises(G.Refused):
            trace.extend(b"z")
        self.assertIs(trace.head, before[0])
        self.assertEqual((len(trace), b.trace), before[1:])

    def test_positive_serialization_cannot_escape_spent_work(self):
        gen = G.Generator(7, 3, 3).run()
        gen.budget.caps["work"] = gen.budget.work
        with self.assertRaises(G.Refused) as error:
            gen.candidate()
        value = json.loads(G.diagnostic(error.exception, gen.budget))
        self.assertFalse(value["complete"])
        self.assertNotIn("dataset", value)
        self.assertEqual(value["closure"], {x: "OPEN" for x in "GCTB"})

    def test_candidate_envelope_preflight_precedes_trace_materialization(self):
        gen = G.Generator(7, 3, 3).run()
        gen.budget.caps["envelope"] = 1
        def forbidden():
            raise AssertionError("materialized before cap check")
        gen.trace.encode = forbidden
        with self.assertRaises(G.Refused) as error:
            gen.candidate()
        self.assertEqual(error.exception.cap, "ENVELOPE")

    def test_deadline_shared_with_trace_encoding(self):
        now = [0.0]
        b = G.Budget(clock=lambda: now[0])
        trace = G.TraceChunks(b)
        trace.extend(b"sample")
        now[0] = 120.0
        before = b.work
        with self.assertRaises(G.Refused) as error:
            trace.encode()
        self.assertEqual(error.exception.cap, "TIME")
        self.assertEqual(b.work, before)

    def test_non_bytes_trace_refuses_without_link_or_charge(self):
        b = G.Budget()
        trace = G.TraceChunks(b)
        before = b.work
        with self.assertRaises(G.Refused):
            trace.extend(bytearray(b"x"))
        self.assertEqual((trace.head, len(trace), b.trace, b.work), (None, 0, 0, before))


if __name__ == "__main__":
    unittest.main()
