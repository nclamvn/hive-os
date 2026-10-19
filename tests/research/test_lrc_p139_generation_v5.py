"""075E producer tiny oracle and host-bound full admission controls.
No p139 construction/search/replay; no checker or shared semantic imports.
"""
import ast
import copy
import hashlib
import importlib.util
import io
import itertools
import json
import math
import pathlib
import struct
import unittest
import types
from unittest import mock

PATH = pathlib.Path(__file__).resolve().parents[2] / "scripts/operations/attempt-lrc-p139-generation-v5.py"
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



def binding():
    return {"root": G.ROOT, "mode": "REPRODUCTION", "obligation": "G",
            "domain": {"prime": 139, "divisor": 14, "target": 13},
            "attempt": 5, "priorWholeAttempts": 4, "grantSha256": "1" * 64,
            "resourceContractSha256": G.RESOURCE_SHA256, "releaseReviewSha256": "2" * 64,
            "sourcePins": {"producer": "3" * 64, "checker": "4" * 64, "host": "5" * 64},
            "headerSha256": "6" * 64, "reservationSha256": "7" * 64,
            "startSha256": "8" * 64, "phaseId": 3, "action": "GENERATE"}


def injected(gate):
    # Test compiles ONLY this NEW own source; no139 constructor or math execution.
    module = types.ModuleType("test_pinned_producer075e")
    module.__dict__["_PINNED_HOST_RELEASE_GATE"] = gate
    exec(compile(PATH.read_bytes(), str(PATH), "exec"), module.__dict__)
    return module


class BeforeEffects(Exception):
    pass




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


    def test_profile_declarations_defensive_and_disabled_static(self):
        tiny = G.profile_spec()
        self.assertTrue(tiny["executionEnabled"])
        full = G.profile_spec("P139_RELEASE_DISABLED")
        self.assertEqual(full["domain"], {"prime":139,"divisor":14,"target":13})
        self.assertEqual(full["rootCounts"], [1,36,126,126,84,36])
        self.assertFalse(full["executionEnabled"])
        self.assertEqual(full["wholeGrant"],0)
        self.assertEqual(full["wholeAttempts"],4)
        self.assertEqual(full["bounds"],G.FULL_LIMITS)
        full["bounds"]["nodes"]=1; full["rootCounts"].clear()
        tiny["domain"]["prime"].clear()
        self.assertEqual(G.profile_spec("P139_RELEASE_DISABLED")["bounds"]["nodes"],20000000)
        self.assertEqual(sum(G.profile_spec("P139_RELEASE_DISABLED")["rootCounts"]),409)
        self.assertEqual(G.profile_spec()["domain"]["prime"],[3,23])
        for profile in (True,None,{},[],1,"P139_OTHER","approved"):
            with self.assertRaises(G.Refused): G.profile_spec(profile)

    def test_disabled_profile_and_fake_grants_before_clock_or_budget(self):
        for profile in ("BUILD_TINY","P139_RELEASE_DISABLED",True,{"approved":True},"P139_RELEASE"):
            for limits in (None,G.FULL_LIMITS,{"approved":True,"wholeGrant":1}):
                with mock.patch.object(G,"Budget") as budget, \
                        mock.patch.object(G.time,"monotonic",side_effect=AssertionError("clock")), \
                        self.assertRaises(G.Refused):
                    G.Engine(139,14,13,limits=limits,profile=profile)
                budget.assert_not_called()
        with mock.patch.object(G,"Budget") as budget:
            with self.assertRaises(G.Refused):
                G.Engine(7,3,3,profile="P139_RELEASE_DISABLED")
            budget.assert_not_called()
        self.assertIs(G.P139_EXECUTION_ENABLED,False)

    def test_streamed_rows_equal_oracle_not_materialized_compat_methods(self):
        for domain in ((7,3,3),(13,4,4),(23,7,5)):
            engine,_=complete(domain); tables,data=oracle(*domain)
            with mock.patch.object(engine,"tables",side_effect=AssertionError("tables copy")), \
                    mock.patch.object(engine,"dataset",side_effect=AssertionError("dataset copy")), \
                    mock.patch.object(engine,"_raw",side_effect=AssertionError("raw copy")):
                for size,table in tables.items():
                    self.assertEqual(b"".join(engine.iter_table_rows(int(size))),table)
                self.assertEqual(b"".join(engine.iter_dataset_rows()),data)
                cursor=engine.cursor()
                self.assertEqual(cursor["unionHash"],hashlib.sha256(data).hexdigest())
                for size,table in tables.items():
                    self.assertEqual(cursor["supportHashes"][size]["sha256"],hashlib.sha256(table).hexdigest())

    def test_fence_captured_on_call_before_first_next(self):
        for api in ("table","dataset"):
            engine=G.Engine(13,4,4);engine.next_event()
            iterator=engine.iter_table_rows(engine.size) if api=="table" else engine.iter_dataset_rows()
            engine.next_event()
            with self.assertRaisesRegex(G.Refused,"GENERATION"):next(iterator)
            self.assertTrue(engine.failed)
            for operation in (engine.next_event,engine.cursor,engine.tables,engine.dataset):
                with self.assertRaises(G.Refused):operation()

    def test_fence_after_yield_even_if_relevant_rows_unchanged(self):
        engine=G.Engine(13,4,4)
        while not engine.union or engine.phase=="TERMINAL":engine.next_event()
        iterator=engine.iter_dataset_rows();row=next(iterator)
        self.assertEqual(len(row),4)
        engine.next_event()
        with self.assertRaisesRegex(G.Refused,"GENERATION"):next(iterator)
        self.assertTrue(engine.failed)

    def test_iterator_close_unstarted_partial_and_exhaustion_releases(self):
        engine,_=complete((13,4,4));baseline=engine.b.memory
        for mode in ("unstarted","partial","exhausted"):
            iterator=engine.iter_dataset_rows()
            self.assertGreater(engine.b.memory,baseline)
            if mode=="partial":next(iterator)
            if mode=="exhausted":list(iterator)
            iterator.close();iterator.close()
            self.assertEqual(engine.b.memory,baseline)
            with self.assertRaises(StopIteration):next(iterator)

    def test_concurrent_iterator_workspace_is_aggregate_bounded(self):
        engine,_=complete((13,4,4));baseline=engine.b.memory
        first=engine.iter_dataset_rows()
        engine.b.limits["memory"]=engine.b.memory
        with self.assertRaises(G.Refused):engine.iter_dataset_rows()
        first.close()
        self.assertEqual(engine.b.memory,baseline)
        self.assertTrue(engine.failed)

    def test_iterator_call_sort_preflight_and_after_sort_deadline(self):
        engine=G.Engine(7,3,3)
        engine.b.reserve(engine.b.limits["memory"]-engine.b.memory)
        with mock.patch.object(G,"sorted",side_effect=AssertionError("sort before reserve"),create=True):
            with self.assertRaises(G.Refused):engine.iter_dataset_rows()
        engine=G.Engine(7,3,3);sort=sorted
        def delayed(rows):
            result=sort(rows);engine.b.start-=10;return result
        with mock.patch.object(G,"sorted",delayed,create=True):
            with self.assertRaises(G.Refused):engine.iter_dataset_rows()
        self.assertTrue(engine.failed)

    def test_iterator_time_and_actual_allocation_failure_poison(self):
        engine,_=complete((13,4,4));iterator=engine.iter_dataset_rows()
        with mock.patch.object(G.time,"monotonic",return_value=engine.b.start+10):
            with self.assertRaises(G.Refused):next(iterator)
        self.assertTrue(iterator.closed)
        for error in (MemoryError,OverflowError,RecursionError):
            engine=G.Engine(7,3,3)
            with mock.patch.object(G,"sorted",side_effect=error,create=True):
                with self.assertRaises(error):engine.iter_dataset_rows()
            self.assertTrue(engine.failed)

    def test_table_size_strict_unknown_and_empty_rows(self):
        for size in (True,"2",0,-1,2**10000,10**10000):
            engine=G.Engine(7,3,3);engine.next_event()
            with self.assertRaises(G.Refused):engine.iter_table_rows(size)
            self.assertTrue(engine.failed)
        engine,_=complete((7,2,3))
        self.assertEqual(list(engine.iter_table_rows(2)),[])
        self.assertEqual(list(engine.iter_table_rows(3)),[])
        empty,_=complete((23,12,1))
        self.assertEqual(list(empty.iter_dataset_rows()),[])

    def test_snapshots_do_not_change_event_counters(self):
        engine,_=complete((13,4,4));before=engine.cursor()
        for _ in range(3):
            list(engine.iter_dataset_rows())
            for size in engine._table_sizes():list(engine.iter_table_rows(int(size)))
            self.assertEqual(engine.cursor(),before)
        self.assertEqual(engine.b.events,before["eventCount"])

    def test_compat_copy_reservation_failure_closes_owned_iterator(self):
        engine,_=complete((13,4,4));baseline=engine.b.memory
        iterator=engine.iter_dataset_rows()
        engine.b.limits["memory"]=engine.b.memory
        with self.assertRaises(G.Refused):engine._row_copy(iterator,engine.target,len(engine.union))
        self.assertTrue(iterator.closed)
        self.assertEqual(engine.b.memory,baseline)

    def test_fenced_rows_at_every_cut_and_current_empty_table(self):
        engine=G.Engine(13,4,4)
        while True:
            tables=engine.tables();data=engine.dataset();before=engine.cursor()
            for size,raw in tables.items():
                self.assertEqual(b"".join(engine.iter_table_rows(int(size))),raw)
            self.assertEqual(b"".join(engine.iter_dataset_rows()),data)
            self.assertEqual(engine.cursor(),before)
            if engine.next_event() is None:break


    def test_normal_import_and_plain_release_never_install_gate(self):
        self.assertNotIn("_PINNED_HOST_RELEASE_GATE", vars(G))
        for identity in (None, True, False, {}, binding(), object(), {"approved": True}):
            with self.subTest(identity=type(identity)), \
                    mock.patch.object(G, "Budget") as budget, \
                    mock.patch.object(G.time, "monotonic", side_effect=AssertionError("clock")), \
                    self.assertRaises(G.Refused):
                G.Engine(139, 14, 13, profile="P139_RELEASE", release=identity)
            budget.assert_not_called()
        self.assertFalse(hasattr(G, "enable_release"))
        self.assertFalse(hasattr(G, "mint_release"))

    def test_pinned_gate_exact_request_positive_stops_at_budget(self):
        identity = object()
        expected = {"profile": "P139_RELEASE", "domain": {"prime": 139, "divisor": 14, "target": 13},
                    "action": "GENERATE", "limits": G.FULL_LIMITS.copy()}
        calls = []
        def gate(token, request):
            self.assertIs(token, identity)
            self.assertEqual(request, expected)
            self.assertEqual(set(request), {"profile", "domain", "action", "limits"})
            calls.append("gate")
            return binding()
        module = injected(gate)
        self.assertNotIn("_PINNED_HOST_RELEASE_GATE", vars(module))
        def fatal(limits, defaults):
            calls.append("budget")
            self.assertEqual(limits, G.FULL_LIMITS)
            self.assertEqual(defaults, G.FULL_LIMITS)
            raise BeforeEffects("NO139 CLOCK/MASKS/CONSTRUCTOR EFFECTS")
        with mock.patch.object(module, "Budget", side_effect=fatal), \
                mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                self.assertRaises(BeforeEffects):
            module.Engine(139, 14, 13, profile="P139_RELEASE", release=identity)
        self.assertEqual(calls, ["gate", "budget"])

    def test_identity_copy_wrong_identity_and_cross_role_request_refused(self):
        identity = object()
        calls = []
        module = None
        def gate(token, request):
            calls.append(request)
            if token is not identity or request["action"] != "GENERATE":
                raise module.Refused("PRIVATE_IDENTITY")
            return binding()
        module = injected(gate)
        for token in (None, True, {}, binding(), object(), copy.copy(identity)):
            with mock.patch.object(module, "Budget") as budget, \
                    mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                    self.assertRaises(module.Refused):
                module.Engine(139, 14, 13, profile="P139_RELEASE", release=token)
            budget.assert_not_called()
        self.assertGreater(len(calls), 0)

    def test_binding_scope_history_phase_types_and_digests_refused_before_budget(self):
        original = binding()
        changes = [
            ("root", "different"), ("mode", "DISCOVERY"), ("obligation", "C"),
            ("action", "VERIFY"), ("attempt", 4), ("attempt", True),
            ("priorWholeAttempts", 5), ("priorWholeAttempts", 4.0),
            ("phaseId", True), ("phaseId", 0), ("phaseId", 2),
            ("phaseId", 33), ("phaseId", 3.0),
            ("resourceContractSha256", "0" * 64), ("grantSha256", "A" * 64),
            ("releaseReviewSha256", "f" * 63), ("headerSha256", None),
            ("reservationSha256", {}), ("startSha256", True),
            ("sourcePins", {"producer": "0" * 64, "checker": "0" * 64}),
            ("sourcePins", {"producer": "X" * 64, "checker": "0" * 64, "host": "0" * 64}),
            ("domain", {"prime": 139, "divisor": 14, "target": True}),
            ("domain", {"prime": 139.0, "divisor": 14, "target": 13}),
            ("domain", {"prime": 139, "divisor": 14, "target": 13, "extra": 1}),
        ]
        for key, value in changes:
            raw = copy.deepcopy(original)
            raw[key] = value
            module = injected(lambda identity, request, raw=raw: raw)
            with self.subTest(field=key, value=type(value)), \
                    mock.patch.object(module, "Budget") as budget, \
                    mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                    self.assertRaises(module.Refused):
                module.Engine(139, 14, 13, profile="P139_RELEASE", release=object())
            budget.assert_not_called()
        for raw in ({}, dict(original, extra=1), None, True, [], 1):
            module = injected(lambda token, request, raw=raw: raw)
            with mock.patch.object(module, "Budget") as budget, self.assertRaises(module.Refused):
                module.Engine(139, 14, 13, profile="P139_RELEASE", release=object())
            budget.assert_not_called()

    def test_returned_binding_is_owned_deeply_immutable_before_any_core(self):
        raw = binding()
        module = injected(lambda token, request: raw)
        owned = module._release_binding(object(), raw["domain"].copy(), G.FULL_LIMITS.copy())
        raw["domain"]["prime"] = 23
        raw["sourcePins"]["producer"] = "9" * 64
        raw["phaseId"] = 7
        self.assertEqual(owned["domain"]["prime"], 139)
        self.assertEqual(owned["sourcePins"]["producer"], "3" * 64)
        self.assertEqual(owned["phaseId"], 3)
        for target, key, value in ((owned, "phaseId", 7), (owned["domain"], "target", 5),
                                   (owned["sourcePins"], "host", "f" * 64)):
            with self.assertRaises(TypeError):
                target[key] = value

    def test_bootstrap_gate_is_captured_once_not_replaced_by_public_key(self):
        identity = object()
        calls = []
        def first(token, request):
            self.assertIs(token, identity)
            calls.append("first")
            return binding()
        module = injected(first)
        module.__dict__["_PINNED_HOST_RELEASE_GATE"] = lambda *args: (_ for _ in ()).throw(AssertionError("replaced"))
        with mock.patch.object(module, "Budget", side_effect=BeforeEffects), \
                mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                self.assertRaises(BeforeEffects):
            module.Engine(139, 14, 13, profile="P139_RELEASE", release=identity)
        self.assertEqual(calls, ["first"])

    def test_full_limits_preflight_cannot_raise_or_use_aliases_before_gate(self):
        calls = []
        module = injected(lambda token, request: calls.append(request))
        bad = [{}, dict(G.FULL_LIMITS, nodes=20000001), dict(G.FULL_LIMITS, seconds=601),
               dict(G.FULL_LIMITS, rows=True), dict(G.FULL_LIMITS, seconds=float("nan")),
               dict(G.FULL_LIMITS, seconds=2**10000), dict(G.FULL_LIMITS, nodes=2**10000),
               dict(G.FULL_LIMITS, memory=0), dict(G.FULL_LIMITS, extra=1)]
        for limits in bad:
            with mock.patch.object(module, "Budget") as budget, \
                    mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                    self.assertRaises(module.Refused):
                module.Engine(139, 14, 13, limits=limits, profile="P139_RELEASE", release=object())
            budget.assert_not_called()
        self.assertEqual(calls, [])

    def test_lower_complete_full_caps_are_copied_bound_and_never_tiny_promoted(self):
        lowered = dict(G.FULL_LIMITS, nodes=100, seconds=1)
        expected = lowered.copy()
        requests = []
        module = injected(lambda token, request: (requests.append(copy.deepcopy(request)), binding())[1])
        with mock.patch.object(module, "Budget", side_effect=BeforeEffects) as budget, \
                mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                self.assertRaises(BeforeEffects):
            module.Engine(139, 14, 13, limits=lowered, profile="P139_RELEASE", release=object())
        self.assertEqual(requests[0]["limits"], expected)
        self.assertEqual(budget.call_args.args[0], expected)
        self.assertEqual(budget.call_args.args[1], G.FULL_LIMITS)
        lowered["nodes"] = 99999
        self.assertEqual(requests[0]["limits"]["nodes"], 100)
        for limits, release in ((G.FULL_LIMITS, None), (None, object()), (G.LIMITS, {})):
            with mock.patch.object(module, "Budget") as budget, self.assertRaises(module.Refused):
                module.Engine(7, 3, 3, limits=limits, release=release)
            budget.assert_not_called()

    def test_full_scope_wrong_domain_and_forged_profile_before_effects(self):
        calls = []
        module = injected(lambda token, request: calls.append(request))
        for domain in ((23, 14, 13), (139, 13, 13), (139, 14, 14), (True, 14, 13), (139, True, 13)):
            with mock.patch.object(module, "Budget") as budget, \
                    mock.patch.object(module.time, "monotonic", side_effect=AssertionError("clock")), \
                    self.assertRaises(module.Refused):
                module.Engine(*domain, profile="P139_RELEASE", release=object())
            budget.assert_not_called()
        class FakeProfile:
            def __eq__(self, other):
                raise AssertionError("CUSTOM PROFILE EXECUTED")
        with self.assertRaises(module.Refused):
            module.Engine(139, 14, 13, profile=FakeProfile(), release=object())
        self.assertEqual(calls, [])

    def test_full_resident_base_and_schedule_guards_static_no139_construction(self):
        tree = ast.parse(PATH.read_text())
        engine = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "Engine")
        constructor = next(node for node in engine.body if isinstance(node, ast.FunctionDef) and node.name == "__init__")
        text = ast.get_source_segment(PATH.read_text(), constructor)
        self.assertLess(text.index("self.b.reserve(2097152)"), text.index("self.masks"))
        self.assertIn('raise Refused("DERIVED_P139_SCHEDULE")', text)
        self.assertEqual(G.profile_spec("P139_RELEASE")["bounds"], G.FULL_LIMITS)
        self.assertFalse(G.profile_spec("P139_RELEASE")["executionEnabled"])
        self.assertEqual(G.profile_spec("P139_RELEASE")["wholeGrant"], 0)
        self.assertEqual(G.FULL_LIMITS["memory"], 536870912)
        self.assertEqual(G.FULL_LIMITS["bytes"], 268435456)
        self.assertEqual(G.profile_spec("P139_RELEASE")["rootCounts"], [1,36,126,126,84,36])

    def test_exact_key_aliases_refused_before_custom_comparison_or_budget(self):
        class Key(str):
            __hash__ = str.__hash__
            def __eq__(self, other):
                raise AssertionError("KEY COMPARISON EXECUTED")
        limits = G.FULL_LIMITS.copy()
        value = limits.pop("nodes")
        limits[Key("nodes")] = value
        module = injected(lambda *args: (_ for _ in ()).throw(AssertionError("gate")))
        with mock.patch.object(module, "Budget") as budget, self.assertRaises(module.Refused):
            module.Engine(139, 14, 13, limits=limits, profile="P139_RELEASE", release=object())
        budget.assert_not_called()
        for location, key in ((None, "root"), ("domain", "prime"), ("sourcePins", "host")):
            raw = binding()
            mapping = raw if location is None else raw[location]
            value = mapping.pop(key)
            mapping[Key(key)] = value
            module = injected(lambda token, request, raw=raw: raw)
            with mock.patch.object(module, "Budget") as budget, self.assertRaises(module.Refused):
                module.Engine(139, 14, 13, profile="P139_RELEASE", release=object())
            budget.assert_not_called()



if __name__ == "__main__":
    unittest.main()
