"""075C producer tiny-only controls, independent scalar exhaustive oracle.
No p139 construction/search/replay; no checker or shared semantic imports.
"""
import hashlib
import importlib.util
import io
import itertools
import json
import math
import pathlib
import struct
import unittest
from unittest import mock

PATH = pathlib.Path(__file__).resolve().parents[2] / "scripts/operations/attempt-lrc-p139-generation-v3.py"
SPEC = importlib.util.spec_from_file_location("tiny_producer", PATH)
G = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(G)


def oracle(p, d, target):
    n = (p - 1) // 2
    universe = set(range(1, n + 1))
    masks = {v: {t for t in universe if d * min(v * t % p, -v * t % p) < p}
             for v in universe}
    def cover(row):
        return set().union(*(masks[v] for v in row)) == universe
    def canonical(row):
        return min(tuple(sorted(min(v * u % p, -v * u % p) for v in row)) for u in universe)
    tables = {}
    cardinality = len(masks[1])
    for size in range((n + cardinality - 1) // cardinality, target + 1):
        table = {canonical(row) for row in itertools.combinations(universe, size)
                 if cover(row) and all(not cover(row[:i] + row[i + 1:]) for i in range(size))}
        tables[str(size)] = b"".join(bytes(row) for row in sorted(table))
    rows = {canonical(row) for row in itertools.combinations_with_replacement(universe, target) if cover(row)}
    return tables, b"".join(bytes(row) for row in sorted(rows))


def complete(domain, limits=None):
    engine = G.Engine(*domain, limits)
    events = []
    while True:
        event = engine.next_event()
        if event is None:
            return engine, events
        events.append(event)


class ProducerControls(unittest.TestCase):
    def test_complete_exhaustive_multisets_and_all_tables(self):
        for domain in [(7, 3, 3), (11, 5, 4), (13, 4, 4), (19, 5, 5), (23, 7, 5)]:
            with self.subTest(domain=domain):
                tables, data = oracle(*domain)
                engine, events = complete(domain)
                self.assertEqual(engine.tables(), tables)
                self.assertEqual(engine.dataset(), data)
                self.assertEqual(engine.cursor()["phase"], "TERMINAL")
                self.assertEqual(engine.cursor()["eventCount"], len(events))
                self.assertEqual(engine.cursor()["traceBytes"], sum(map(len, events)))
                self.assertEqual(events[0], b"LRC139G2\n")
                self.assertEqual(events[-1], bytes([249]) + struct.pack("<Q", len(data) // domain[2]) + hashlib.sha256(data).digest())

    def test_every_event_cut_reconstructed_from_genesis(self):
        domain = (13, 4, 4)
        engine = G.Engine(*domain)
        events, snapshots = [], []
        snapshots.append((engine.cursor(), engine.tables(), engine.dataset()))
        while True:
            event = engine.next_event()
            if event is None:
                break
            events.append(event)
            snapshots.append((engine.cursor(), engine.tables(), engine.dataset()))
        phases = set()
        pending = False
        for cut in range(len(events) + 1):
            reconstructed = G.Engine(*domain)
            for event in events[:cut]:
                self.assertEqual(reconstructed.next_event(), event)
            cursor = reconstructed.cursor()
            self.assertEqual((cursor, reconstructed.tables(), reconstructed.dataset()), snapshots[cut])
            phases.add(cursor["phase"])
            pending |= any(f["options"] and f["next"] < len(f["options"]) for f in cursor["frames"])
            self.assertEqual(reconstructed.next_event(), events[cut] if cut < len(events) else None)
        self.assertTrue(pending)
        self.assertEqual(phases, {"PROLOGUE", "ROOT_START", "SEARCH", "ROOT_END", "SUPPORT_END", "EXTEND", "SIZE_END", "FINAL_END", "TERMINAL"})

    def test_current_table_and_cursor_are_defensive_snapshots(self):
        engine = G.Engine(13, 4, 4)
        engine.next_event()
        initial = engine.cursor()
        self.assertEqual(engine.tables(), {"2": b""})
        initial["private"].append(255)
        initial["supportHashes"].clear()
        self.assertNotEqual(engine.cursor(), initial)
        while engine.cursor()["phase"] != "SEARCH":
            engine.next_event()
        copy = engine.cursor()
        copy["frames"][0]["selected"].append(255)
        copy["frames"][0]["available"].clear()
        self.assertNotEqual(engine.cursor(), copy)

    def test_every_branch_child_uses_exact_cumulative_exclusion(self):
        engine = G.Engine(19, 5, 5)
        branches = 0
        while True:
            before = engine.cursor()
            event = engine.next_event()
            if event is None:
                break
            if event[0] == 6:
                branches += 1
                after = engine.cursor()
                parent, child = after["frames"][-2:]
                self.assertEqual(parent["options"], list(event[3:]))
                self.assertEqual(parent["next"], 1)
                self.assertEqual(child["selected"], parent["selected"] + [event[3]])
                self.assertEqual(child["available"], [v for v in before["frames"][-1]["available"] if v != event[3]])
            for parent, child in zip(engine.cursor()["frames"], engine.cursor()["frames"][1:]):
                self.assertEqual(child["selected"][:-1], parent["selected"])
                self.assertEqual(child["available"], [v for v in parent["available"] if v not in parent["options"][:parent["next"]]])
        self.assertGreater(branches, 0)

    def test_root_footer_counts_and_barrier_hashes(self):
        engine = G.Engine(13, 4, 4)
        root_nodes = root_bytes = 0
        while True:
            event = engine.next_event()
            if event is None:
                break
            tag = event[0]
            if tag == 244:
                root_nodes, root_bytes = 0, len(event)
            elif tag <= 6:
                root_nodes += 1
                root_bytes += len(event)
            elif tag == 245:
                self.assertEqual(struct.unpack("<II", event[1:]), (root_nodes, root_bytes))
            elif tag in (247, 248):
                self.assertEqual(event[-32:], hashlib.sha256(engine.tables()[str(event[1])]).digest())

    def test_empty_schedule_and_empty_tables(self):
        with self.assertRaises(G.Refused):
            complete((23, 24, 1))
        engine, events = complete((7, 2, 3))
        self.assertEqual(engine.tables()["2"], b"")
        self.assertEqual(engine.tables()["3"], b"")
        self.assertTrue(any(e[0] == 247 and struct.unpack("<Q", e[2:10])[0] == 0 for e in events))

    def test_empty_schedule_is_terminal_not_omitted_root(self):
        engine, events = complete((23, 12, 1))
        self.assertEqual(engine.tables(), {})
        self.assertEqual(engine.dataset(), b"")
        self.assertEqual(len(events), 2)
        self.assertEqual(engine.cursor()["rootIndex"], 0)

    def test_zero_extra_and_repetitions_emitted(self):
        engine, events = complete((7, 2, 3))
        extras = [e for e in events if e[0] == 246]
        self.assertTrue(any(e[2] and len(set(e[7:7+e[2]])) < e[2] for e in extras))
        zero, events = complete((7, 3, 2))
        self.assertTrue(any(e[0] == 246 and e[2] == 0 for e in events))

    def test_domain_whole_denial_before_budget_or_mask_allocation(self):
        for domain in [(139, 14, 13), (23, 24, 1), (9, 3, 3), (True, 3, 3), (7, True, 3), (7, 3, 6)]:
            with self.subTest(domain=domain), self.assertRaises(G.Refused):
                G.Engine(*domain)
        with mock.patch.object(G, "Budget") as allocate:
            with self.assertRaises(G.Refused):
                G.Engine(139, 14, 13)
            allocate.assert_not_called()

    def test_strict_limit_keys_types_and_lower_only(self):
        for limits in [{}, {**G.LIMITS, "nodes": 100001}, {**G.LIMITS, "seconds": float("nan")},
                       {**G.LIMITS, "seconds": 2**10000}, {**G.LIMITS, "nodes": 2**10000},
                       {**G.LIMITS, "nodes": True}, {**G.LIMITS, "memory": 0}]:
            with self.assertRaises(G.Refused):
                G.Engine(7, 3, 3, limits)

    def test_global_node_event_extension_row_and_byte_caps_poison(self):
        for field, value in [("nodes", 1), ("events", 1), ("extensions", 1), ("rows", 1), ("bytes", 9)]:
            engine = G.Engine(13, 4, 4, {**G.LIMITS, field: value})
            with self.subTest(field=field), self.assertRaises(G.Refused):
                while engine.next_event() is not None:
                    pass
            for method in (engine.next_event, engine.cursor, engine.tables, engine.dataset):
                with self.assertRaises(G.Refused):
                    method()

    def test_mid_leaf_and_extension_failures_poison(self):
        for phase in ("SEARCH", "EXTEND"):
            for error in (G.Refused("CANONICAL_MID_EVENT"), MemoryError(), OverflowError()):
                engine = G.Engine(13, 4, 4)
                with mock.patch.object(engine, "_canonical", wraps=engine._canonical) as canonical:
                    while engine.phase != phase:
                        engine.next_event()
                    canonical.side_effect = error
                    with self.subTest(phase=phase, error=type(error)), self.assertRaises(type(error)):
                        while engine.next_event() is not None:
                            pass
                self.assertTrue(engine.failed)
                for method in (engine.next_event, engine.cursor, engine.tables, engine.dataset):
                    with self.assertRaises(G.Refused):
                        method()

    def test_memory_constructor_and_snapshot_refusal(self):
        with self.assertRaises(G.Refused):
            G.Engine(7, 3, 3, {**G.LIMITS, "memory": 10})
        engine = G.Engine(7, 3, 3)
        engine.b.reserve(engine.b.limits["memory"] - engine.b.memory)
        with self.assertRaises(G.Refused):
            engine.cursor()
        with self.assertRaises(G.Refused):
            engine.next_event()

    def test_actual_snapshot_memory_and_overflow_errors_poison(self):
        for method in ("cursor", "tables", "dataset"):
            for error in (MemoryError, OverflowError):
                engine = G.Engine(7, 3, 3)
                with mock.patch.object(engine.b, "reserve", side_effect=error):
                    with self.subTest(method=method, error=error), self.assertRaises(error):
                        getattr(engine, method)()
                for blocked in (engine.next_event, engine.cursor, engine.tables, engine.dataset):
                    with self.assertRaises(G.Refused):
                        blocked()

    def test_deadline_covers_cursor_and_construction(self):
        engine = G.Engine(7, 3, 3)
        with mock.patch.object(G.time, "monotonic", return_value=engine.b.start + 10):
            with self.assertRaises(G.Refused):
                engine.cursor()
        with self.assertRaises(G.Refused):
            engine.dataset()
        with mock.patch.object(G.time, "monotonic", side_effect=[0, 0, 10]):
            with self.assertRaises(G.Refused):
                G.Engine(7, 3, 3)

    def test_after_sort_deadline_poison_before_snapshot_publish(self):
        engine = G.Engine(7, 3, 3)
        builtin_sort = sorted
        def delayed_sort(rows):
            value = builtin_sort(rows)
            engine.b.start -= 10
            return value
        with mock.patch.object(G, "sorted", delayed_sort, create=True):
            with self.assertRaises(G.Refused):
                engine.dataset()
        with self.assertRaises(G.Refused):
            engine.next_event()

    def test_fixed139_root_declaration_without_constructor(self):
        # Arithmetic declaration ONLY; no139 mask/search/replay construction.
        quotas = [max(1, (138 - 9 * s + s - 1) // s) for s in range(8, 14)]
        self.assertEqual(quotas, [9, 7, 5, 4, 3, 2])
        self.assertEqual(sum(math.comb(9, q) for q in quotas), 409)

    def test_legacy_diagnostic_and_forged_cursor_cannot_restore_state(self):
        for hint in [{"rootIndex": 298, "complete": False}, G.Engine(7, 3, 3).cursor()]:
            with self.assertRaises(G.Refused):
                G.Engine(7, 3, 3, hint)

    def test_default_cli_refuses_before_constructor(self):
        for args in [["producer"], ["producer", "--build-tiny", "--prime=139", "--divisor=14", "--target=13"]]:
            with mock.patch.object(G.sys, "argv", args), mock.patch.object(G.sys, "stdout", io.StringIO()) as out, \
                    mock.patch.dict(G.os.environ, dict.fromkeys(G.FLAGS, "false"), clear=True), \
                    mock.patch.object(G, "Engine", wraps=G.Engine) as engine:
                G.main()
                self.assertEqual(json.loads(out.getvalue())["status"], "REFUSED")
                engine.assert_not_called()


if __name__ == "__main__":
    unittest.main()
