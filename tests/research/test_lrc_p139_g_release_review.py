"""Independent tiny exhaustive oracle and hostile checker controls, not p139."""
import ast
import hashlib
import importlib.util
import itertools
import io
import gc
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/operations/verify-lrc-p139-g-release.py'
SPEC = importlib.util.spec_from_file_location('independent_g_checker', SOURCE)
CHECKER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECKER)


def certificate(p, d, target):
    """Inert complete fixture: independent finite arithmetic and explicit preorder."""
    n = (p-1)//2
    universe = set(range(1, n+1))
    masks = {v: {t for t in universe if d*(v*t % p) < p or d*(p-v*t % p) < p}
             for v in universe}
    m = len(masks[1])
    def canon(row):
        images = []
        for unit in universe:
            image = []
            for v in row:
                residue = unit*v % p
                image.append(residue if residue <= n else p-residue)
            images.append(tuple(sorted(image)))
        return min(images)
    def raw(rows):
        return bytes(v for row in sorted(rows) for v in row)
    events, tables, final = [b'LRC139G2\n'], {}, set()
    for size in range((n+m-1)//m, target+1):
        minimal = set()
        q = max(1, -(-(2*n-m*size)//size))
        for private in itertools.combinations(sorted(masks[1]), q):
            start = bytes([244, size, q] + list(private))
            nodes = []
            def visit(selected, available, slots):
                incidence = {t: sum(t in masks[v] for v in selected) for t in universe}
                covered = {t for t in universe if incidence[t]}
                if any(not any(incidence[t] == 1 for t in masks[v]) for v in selected):
                    nodes.append(b'\x00'); return
                if slots == 0:
                    if covered == universe:
                        nodes.append(b'\x01'); minimal.add(canon(selected))
                    else:
                        nodes.append(b'\x02')
                    return
                missing = universe - covered
                if not missing or len(missing) > m*slots or len(available) < slots:
                    nodes.append(b'\x03'); return
                if any(not any(t in masks[v] for v in available) for t in missing):
                    nodes.append(b'\x04'); return
                gains = [sum(t in masks[v] for t in missing) for v in available]
                gains.sort(reverse=True)
                if sum(gains[:slots]) < len(missing):
                    nodes.append(b'\x05'); return
                pivot = min(missing, key=lambda t: (sum(t in masks[v] for v in available), t))
                options = [v for v in available if pivot in masks[v]]
                nodes.append(bytes([6, pivot, len(options)] + options))
                for index, option in enumerate(options):
                    excluded = set(options[:index+1])
                    visit(selected+[option], [v for v in available if v not in excluded], slots-1)
            visit([1], [v for v in sorted(universe-{1}) if not set(private)&masks[v]], size-1)
            events.extend([start] + nodes + [b'\xf5' + len(nodes).to_bytes(4,'little') +
                                          (len(start)+sum(map(len,nodes))).to_bytes(4,'little')])
        table = raw(minimal)
        tables[str(size)] = table
        events.append(bytes([247,size]) + len(minimal).to_bytes(8,'little') + hashlib.sha256(table).digest())
        count = 0
        for index, support in enumerate(sorted(minimal)):
            for extras in itertools.combinations_with_replacement(sorted(universe), target-size):
                row = canon(support+extras)
                events.append(bytes([246,size,target-size]) + index.to_bytes(4,'little') + bytes(extras)+bytes(row))
                final.add(row); count += 1
        events.append(bytes([248,size]) + count.to_bytes(8,'little') + hashlib.sha256(table).digest())
    data = raw(final)
    events.append(b'\xf9'+len(final).to_bytes(8,'little')+hashlib.sha256(data).digest())
    # Second oracle: enumerate EVERY multiset directly, no minimal-support logic.
    brute = set()
    for row in itertools.combinations_with_replacement(sorted(universe), target):
        if all(any(t in masks[v] for v in row) for t in universe):
            brute.add(canon(row))
    if data != raw(brute):
        raise RuntimeError('Fixture differs from direct multiset oracle')
    return events, tables, data


DOMAIN = (13, 5, 4)


def replay(events, domain=DOMAIN, limits=None):
    verifier = CHECKER.Verifier(*domain, limits=limits)
    for event in events:
        verifier.feed(event)
    return verifier


def lowered(**changes):
    return dict(CHECKER.DEFAULTS, **changes)


class IndependentCheckerControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.events, cls.tables, cls.data = certificate(*DOMAIN)

    def test_direct_multiset_oracle_complete_domains(self):
        for domain in ((7,4,3), (11,4,3), DOMAIN, (19,7,4)):
            events, tables, data = certificate(*domain)
            result = replay(events, domain).finish(data,tables)
            self.assertEqual(result['status'], 'TINY_G_VERIFIED_CTB_OPEN')
            self.assertEqual(result['wholeGrant'], 0)
            self.assertEqual(result['wholeAttempts'], 4)

    def test_empty_size_schedule(self):
        events,tables,data = certificate(7,6,1)
        self.assertEqual(tables,{})
        self.assertEqual(data,b'')
        self.assertEqual(replay(events,(7,6,1)).finish(data,tables)['rows'],0)

    def test_every_cut_cursor_tables_and_final_equality(self):
        for domain in (DOMAIN,(13,3,4),(23,7,5)):
            events,tables,data=certificate(*domain)
            uninterrupted = CHECKER.Verifier(*domain)
            cursors = [uninterrupted.cursor()]
            snapshots = [(uninterrupted.tables(), uninterrupted.dataset())]
            for event in events:
                uninterrupted.feed(event)
                cursors.append(uninterrupted.cursor())
                snapshots.append((uninterrupted.tables(), uninterrupted.dataset()))
            for cut in range(len(events)+1):
                restarted = replay(events[:cut],domain)
                self.assertEqual(restarted.cursor(), cursors[cut])
                self.assertEqual((restarted.tables(),restarted.dataset()), snapshots[cut])
                for event in events[cut:]:
                    restarted.feed(event)
                restarted.finish(data,tables)

    def test_actual_producer_every_event_and_snapshot_alignment(self):
        source=ROOT/'scripts/operations/attempt-lrc-p139-generation-v5.py'
        spec=importlib.util.spec_from_file_location('tiny_producer_integration_only',source)
        producer=importlib.util.module_from_spec(spec);spec.loader.exec_module(producer)
        for domain in ((7,4,3),(11,4,3),DOMAIN,(13,3,4),(23,7,5)):
            e=producer.Engine(*domain);v=CHECKER.Verifier(*domain)
            self.assertEqual(e.cursor(),v.cursor())
            while True:
                event=e.next_event()
                if event is None:break
                v.feed(event)
                self.assertEqual(e.cursor(),v.cursor())
                self.assertEqual(e.tables(),v.tables())
                self.assertEqual(e.dataset(),v.dataset())
            v.finish(e.dataset(),e.tables())

    def test_pending_sibling_cut_is_present(self):
        v=CHECKER.Verifier(*DOMAIN); observed=False
        for event in self.events:
            v.feed(event)
            if event[0] == 6:
                frames=v.cursor()['frames']
                self.assertGreaterEqual(len(frames),2)
                self.assertEqual(frames[-2]['next'],1)
                self.assertIsNone(frames[-1]['options'])
                observed=True
        self.assertTrue(observed)

    def test_repeated_extras_and_duplicate_images_are_not_skipped(self):
        events,tables,data=certificate(13,3,4)
        replay(events,(13,3,4)).finish(data,tables)
        extensions=[e for e in events if e[0]==246]
        self.assertTrue(extensions)
        self.assertTrue(any(e[2]>=2 and len(set(e[7:7+e[2]]))<e[2] for e in extensions))
        self.assertGreater(len(extensions),len(data)//4)

    def rejected(self,events):
        with self.assertRaises(CHECKER.VerificationRefused):
            replay(events)

    def test_missing_root_start(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==244)
        self.rejected(self.events[:index]+self.events[index+1:])

    def test_missing_branch_sibling(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==6)
        self.rejected(self.events[:index+1]+self.events[index+2:])

    def test_false_prune(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==6)
        self.rejected(self.events[:index]+[b'\x04']+self.events[index+1:])

    def test_altered_pivot_and_options(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==6)
        event=self.events[index]
        self.rejected(self.events[:index]+[bytes([6,event[1]%6+1])+event[2:]]+self.events[index+1:])
        self.rejected(self.events[:index]+[event[:3]+bytes([event[3]%6+1])+event[4:]]+self.events[index+1:])

    def test_missing_extension(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==246)
        self.rejected(self.events[:index]+self.events[index+1:])

    def test_wrong_extension_support_index(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==246)
        event=self.events[index]; wrong=event[:3]+(999).to_bytes(4,'little')+event[7:]
        self.rejected(self.events[:index]+[wrong]+self.events[index+1:])

    def test_coherently_rehashed_support_omission(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==247 and int.from_bytes(e[2:10],'little'))
        event=self.events[index]; wrong=event[:2]+(0).to_bytes(8,'little')+hashlib.sha256(b'').digest()
        self.rejected(self.events[:index]+[wrong]+self.events[index+1:])

    def test_coherently_rehashed_final_union_omission(self):
        missing=self.data[:-DOMAIN[2]]
        wrong=b'\xf9'+(len(missing)//DOMAIN[2]).to_bytes(8,'little')+hashlib.sha256(missing).digest()
        self.rejected(self.events[:-1]+[wrong])

    def test_duplicate_overlap_reorder_and_extra_event(self):
        self.rejected([self.events[0]]+self.events)
        self.rejected(self.events[:3]+self.events[1:])
        self.rejected(self.events[:1]+self.events[2:3]+self.events[1:2]+self.events[3:])
        self.rejected(self.events+[b'\x00'])

    def test_distinct_complete_sibling_subtrees_swapped_same_root(self):
        domain=(19,4,5)
        events,tables,data=certificate(*domain)
        replay(events,domain).finish(data,tables)  # otherwise-valid baseline
        candidates=[]
        def subtree(index,root):
            event=events[index]
            if event[0] != 6:
                return index+1
            position=index+1; spans=[]
            for _ in range(event[2]):
                start=position;position=subtree(position,root)
                spans.append((start,position))
            for a,b in zip(spans,spans[1:]):
                if (a[1]-a[0]>1 and b[1]-b[0]>1
                        and events[a[0]:a[1]] != events[b[0]:b[1]]):
                    candidates.append((root,a,b))
            return position
        roots={}
        for index,event in enumerate(events):
            if event[0] == 244:
                roots[index]=subtree(index+1,index)
        self.assertTrue(candidates,'fixture must contain genuinely different sibling subtrees')
        root,a,b=candidates[0]
        changed=events[:a[0]]+events[b[0]:b[1]]+events[a[0]:a[1]]+events[b[1]:]
        self.assertEqual(a[1],b[0])
        self.assertNotEqual(events[a[0]:a[1]],events[b[0]:b[1]])
        self.assertEqual(len(changed),len(events))
        self.assertEqual(sum(map(len,changed)),sum(map(len,events)))
        end=roots[root]
        self.assertEqual(events[end][0],245)
        # Recompute the footer from the modified complete root, not stale counters.
        changed[end]=b'\xf5'+(end-root-1).to_bytes(4,'little')+sum(map(len,changed[root:end])).to_bytes(4,'little')
        self.assertEqual(changed[end],events[end])
        self.assertNotEqual(hashlib.sha256(b''.join(changed)).digest(),hashlib.sha256(b''.join(events)).digest())
        # Table/barrier payloads are retained byte-exact; transport hashes cannot
        # establish whether these complete, locally plausible blocks fit a path.
        with self.assertRaises(CHECKER.VerificationRefused):replay(changed,domain)

    def test_root_footer_nodes_bytes_and_overflow(self):
        index=next(i for i,e in enumerate(self.events) if e[0]==245)
        self.rejected(self.events[:index]+[b'\xf5'+b'\xff'*8]+self.events[index+1:])

    def test_prefix_never_finishes(self):
        v=replay(self.events[:-1])
        with self.assertRaises(CHECKER.VerificationRefused): v.finish(self.data,self.tables)

    def test_finish_table_missing_extra_duplicate_or_altered(self):
        for tables in ({},dict(self.tables,unexpected=b''),
                       {s:raw+raw[:int(s)] for s,raw in self.tables.items()}):
            v=replay(self.events)
            with self.assertRaises(CHECKER.VerificationRefused): v.finish(self.data,tables)

    def test_finish_dataset_missing_extra_and_wrong_type(self):
        for data in (self.data[:-DOMAIN[2]],self.data+self.data[:DOMAIN[2]],bytearray(self.data)):
            v=replay(self.events)
            with self.assertRaises(CHECKER.VerificationRefused): v.finish(data,self.tables)

    def test_event_unknown_truncated_extra_and_nonbytes(self):
        for event in (b'\xff',self.events[0][:-1],self.events[0]+b'\x00',bytearray(self.events[0]),b''):
            with self.assertRaises(CHECKER.VerificationRefused): CHECKER.Verifier(*DOMAIN).feed(event)

    def test_source_independence_and_no_assert_admission(self):
        tree=ast.parse(SOURCE.read_text())
        self.assertFalse(any(isinstance(node,ast.Assert) for node in ast.walk(tree)))
        names=[n.name for node in ast.walk(tree) if isinstance(node,ast.Import) for n in node.names]
        self.assertEqual(set(names),{'hashlib','itertools','math','time'})
        self.assertFalse(any(isinstance(node,ast.ImportFrom) for node in ast.walk(tree)))

    def test_whole139_refuses_before_clock_or_mask(self):
        with patch.object(CHECKER.time,'monotonic',side_effect=RuntimeError('clock called')):
            with self.assertRaises(CHECKER.VerificationRefused): CHECKER.Verifier(139,14,13)

    def test_nonprime_type_and_zero_masks(self):
        for domain in ((9,4,3),(True,4,3),(13,25,4),(13,5,6),(3,24,1)):
            with self.assertRaises(CHECKER.VerificationRefused): CHECKER.Verifier(*domain)

    def test_lower_only_limits_and_hostile_types(self):
        for limits in ({},lowered(nodes=True),lowered(seconds=float('nan')),
                       lowered(rows=10001),lowered(bytes=0),lowered(seconds=2**10000),
                       dict(lowered(),extra=1)):
            with self.assertRaises(CHECKER.VerificationRefused): CHECKER.Verifier(*DOMAIN,limits=limits)

    def test_constructor_and_snapshot_memory_preflight(self):
        with self.assertRaises(CHECKER.VerificationRefused): CHECKER.Verifier(*DOMAIN,limits=lowered(memory=1))
        v=CHECKER.Verifier(*DOMAIN,limits=lowered(memory=70000))
        with self.assertRaises(CHECKER.VerificationRefused): v.cursor()

    def test_events_nodes_extensions_rows_and_bytes_caps(self):
        for limits in (lowered(events=1),lowered(nodes=1),lowered(extensions=1),
                       lowered(rows=1),lowered(bytes=1)):
            with self.assertRaises(CHECKER.VerificationRefused): replay(self.events,limits=limits)

    def test_deadline_covers_cursor_feed_and_finish(self):
        for operation in ('cursor','tables','dataset','finish'):
            v=replay(self.events)
            with patch.object(CHECKER.time,'monotonic',return_value=v.deadline+1):
                call=lambda:getattr(v,operation)() if operation!='finish' else v.finish(self.data,self.tables)
                with self.assertRaisesRegex(CHECKER.VerificationRefused,'TIME'): call()

    def test_failed_semantics_poison_verifier(self):
        v=CHECKER.Verifier(*DOMAIN)
        with self.assertRaises(CHECKER.VerificationRefused): v.feed(b'WRONG')
        with self.assertRaises(CHECKER.VerificationRefused): v.feed(self.events[0])

    def test_bad_final_event_cannot_finish_after_catching(self):
        v=replay(self.events[:-1])
        with self.assertRaises(CHECKER.VerificationRefused): v.feed(self.events[-1][:-1])
        with self.assertRaises(CHECKER.VerificationRefused): v.finish(self.data,self.tables)

    def test_bad_finish_permanently_poisoned(self):
        v=replay(self.events)
        with self.assertRaises(CHECKER.VerificationRefused): v.finish(self.data+b'\x01',self.tables)
        with self.assertRaises(CHECKER.VerificationRefused): v.finish(self.data,self.tables)

    def test_nonbytes_admission_poisoned(self):
        v=CHECKER.Verifier(*DOMAIN)
        with self.assertRaises(CHECKER.VerificationRefused): v.feed(bytearray(self.events[0]))
        with self.assertRaises(CHECKER.VerificationRefused): v.feed(self.events[0])

    def test_snapshot_budget_refusal_poisoned(self):
        v=CHECKER.Verifier(*DOMAIN,limits=lowered(memory=70000))
        with self.assertRaises(CHECKER.VerificationRefused): v.cursor()
        with self.assertRaises(CHECKER.VerificationRefused): v.feed(self.events[0])

    def test_actual_snapshot_allocation_fault_poisoned(self):
        for fault in (MemoryError,OverflowError,RecursionError):
            v=replay(self.events)
            with patch.object(v,'_raw',side_effect=fault):
                with self.assertRaisesRegex(CHECKER.VerificationRefused,'ALLOCATION_OR_OVERFLOW'): v.dataset()
            with self.assertRaises(CHECKER.VerificationRefused): v.finish(self.data,self.tables)

    def test_cursor_snapshot_is_not_state_authority(self):
        v=CHECKER.Verifier(*DOMAIN); cursor=v.cursor()
        cursor['phase']='TERMINAL';cursor['private'].append(1)
        self.assertEqual(v.cursor()['phase'],'PROLOGUE')
        self.assertEqual(v.cursor()['private'],[])

    def test_default_cli_denied(self):
        child=subprocess.run([sys.executable,'-I','-S','-B',str(SOURCE)],stdin=subprocess.DEVNULL,
                             capture_output=True,timeout=3)
        self.assertNotEqual(child.returncode,0)
        self.assertIn(b'REFUSED',child.stderr)


def stream_rows(raw, width):
    return iter([raw[i:i+width] for i in range(0, len(raw), width)])


def stream_tables(tables):
    return {s: stream_rows(raw, int(s)) for s, raw in tables.items()}


class ChunkRows:
    """External inert binary fixture reader with mandatory bounded reads."""
    def __init__(self, raw, width, chunk=1):
        self.source, self.width, self.chunk = io.BytesIO(raw), width, chunk
        self.reads, self.eof = [], False

    def __iter__(self):
        return self

    def __next__(self):
        row = bytearray()
        while len(row) < self.width:
            size = min(self.chunk, self.width-len(row))
            if not 1 <= size <= 65536:
                raise RuntimeError('unbounded fixture read')
            self.reads.append(size)
            piece = self.source.read(size)
            if not piece:
                self.eof = True
                if not row:
                    raise StopIteration
                return bytes(row)
            row.extend(piece)
        return bytes(row)


class StreamingCheckerControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.events, cls.tables, cls.data = certificate(*DOMAIN)

    def terminal(self):
        return replay(self.events)

    def compare(self, v, tables=None, data=None):
        v.compare_snapshot(stream_tables(self.tables if tables is None else tables),
                           stream_rows(self.data if data is None else data, DOMAIN[2]))

    def test_streamed_tiny_chunks_and_both_eofs(self):
        v=self.terminal()
        tables={s:ChunkRows(raw,int(s)) for s,raw in self.tables.items()}
        dataset=ChunkRows(self.data,DOMAIN[2])
        v.compare_snapshot(tables,dataset)
        self.assertTrue(dataset.eof)
        self.assertTrue(all(reader.eof for reader in tables.values()))
        self.assertEqual(v.finish_verified()['rows'],len(self.data)//DOMAIN[2])

    def test_actual_producer_genuine_iterators_every_event(self):
        source=ROOT/'scripts/operations/attempt-lrc-p139-generation-v5.py'
        spec=importlib.util.spec_from_file_location('stream_producer_integration_only',source)
        producer=importlib.util.module_from_spec(spec);spec.loader.exec_module(producer)
        checked=0
        for domain in ((7,4,3),(11,4,3),DOMAIN,(13,3,4),(23,7,5)):
            e=producer.Engine(*domain);v=CHECKER.Verifier(*domain)
            with patch.object(e,'tables',side_effect=RuntimeError('no raw table')), \
                 patch.object(e,'dataset',side_effect=RuntimeError('no raw data')):
                while True:
                    event=e.next_event()
                    if event is None:break
                    v.feed(event)
                    cursor=e.cursor()
                    v.compare_snapshot({s:e.iter_table_rows(int(s)) for s in cursor['supportHashes']},
                                       e.iter_dataset_rows())
                    self.assertEqual(cursor,v.cursor());checked+=1
                self.assertEqual(v.finish_verified()['rows'],len(e.union))
        self.assertEqual(checked,207)

    def test_every_cut_stream_compare_reconstructs_independently(self):
        cuts=0
        for domain in (DOMAIN,(13,3,4),(23,7,5)):
            events,tables,data=certificate(*domain)
            uninterrupted=CHECKER.Verifier(*domain)
            for cut in range(len(events)+1):
                fresh=replay(events[:cut],domain)
                supplied={s:ChunkRows(raw,int(s),2) for s,raw in uninterrupted.tables().items()}
                fresh.compare_snapshot(supplied,ChunkRows(uninterrupted.dataset(),domain[2],2))
                self.assertEqual(fresh.cursor(),uninterrupted.cursor())
                self.assertEqual(fresh.verified_snapshot,cut)
                cuts+=1
                if cut<len(events):uninterrupted.feed(events[cut])
        self.assertEqual(cuts,190)

    def test_none_is_not_empty_dataset_eof(self):
        events,tables,data=certificate(7,6,1)
        v=replay(events,(7,6,1))
        with self.assertRaisesRegex(CHECKER.Refused,'ROW_TYPE_WIDTH'):
            v.compare_snapshot({},iter([None,b'\x01']))
        self.assertTrue(v.poisoned)

    def test_none_after_valid_dataset_cannot_hide_trailing_row(self):
        v=self.terminal()
        rows=list(stream_rows(self.data,DOMAIN[2]))
        with self.assertRaisesRegex(CHECKER.Refused,'ROW_TYPE_WIDTH'):
            v.compare_snapshot(stream_tables(self.tables),iter(rows+[None,b'\x01'*4]))
        with self.assertRaises(CHECKER.Refused):v.finish_verified()

    def test_none_in_empty_current_table_not_eof(self):
        v=replay(self.events[:1])
        tables={s:iter([None,b'\x01'*int(s)]) for s in v.tables()}
        with self.assertRaisesRegex(CHECKER.Refused,'ROW_TYPE_WIDTH'):
            v.compare_snapshot(tables,iter(()))

    def test_lazy_reader_construction_error_closes_owned_workspace(self):
        class Broken:
            def __iter__(self):
                raise OSError('fixture IO')
        v=self.terminal()
        key=next(iter(self.tables))
        tables=stream_tables(self.tables);tables[key]=Broken()
        with self.assertRaises(CHECKER.Refused):v.compare_snapshot(tables,stream_rows(self.data,4))
        self.assertEqual(v.snapshot_workspace,0)
        self.assertTrue(v.poisoned)

    def test_actual_reader_next_io_error_closes_owned_workspace(self):
        class Broken:
            def __iter__(self):return self
            def __next__(self):raise OSError('read fault')
        v=self.terminal()
        with self.assertRaises(CHECKER.Refused):
            v.compare_snapshot(stream_tables(self.tables),Broken())
        self.assertEqual(v.snapshot_workspace,0)
        with self.assertRaises(CHECKER.Refused):self.compare(v)

    def test_call_time_fence_before_first_next(self):
        v=CHECKER.Verifier(*DOMAIN)
        rows=v.iter_dataset_rows()
        self.assertGreater(v.snapshot_workspace,0)
        v.feed(self.events[0])
        with self.assertRaisesRegex(CHECKER.Refused,'SNAPSHOT_FENCE'):next(rows)
        self.assertEqual(v.snapshot_workspace,0)
        self.assertTrue(v.poisoned)

    def test_fence_after_partial_iteration(self):
        leaf=next(i for i,e in enumerate(self.events) if e[0]==1)
        v=replay(self.events[:leaf+1])
        rows=v.iter_table_rows(v.size)
        next(rows)
        v.feed(self.events[leaf+1])
        with self.assertRaisesRegex(CHECKER.Refused,'SNAPSHOT_FENCE'):next(rows)
        self.assertEqual(v.snapshot_workspace,v.support_workspace)

    def test_unstarted_iterator_close_releases_workspace(self):
        v=self.terminal();before=v.snapshot_workspace
        rows=v.iter_dataset_rows()
        self.assertGreater(v.snapshot_workspace,before)
        rows.close();rows.close()
        self.assertEqual(v.snapshot_workspace,before)

    def test_two_live_iterator_workspace_is_aggregate(self):
        v=self.terminal()
        rows=v.iter_dataset_rows()
        first=v.snapshot_workspace
        other=v.iter_dataset_rows()
        self.assertEqual(v.snapshot_workspace,2*first)
        other.close();rows.close()
        self.assertEqual(v.snapshot_workspace,0)

    def test_cursor_active_workspace_and_sort_are_aggregate(self):
        v=CHECKER.Verifier(*DOMAIN,limits=lowered(memory=100000))
        with self.assertRaisesRegex(CHECKER.Refused,'MEMORY_WORKSPACE'):v.cursor()
        self.assertEqual(v.snapshot_workspace,0)
        self.assertTrue(v.poisoned)

    def test_support_index_storage_is_charged_until_size_end(self):
        v=CHECKER.Verifier(*DOMAIN);seen=False
        for event in self.events:
            v.feed(event)
            if event[0]==247:
                self.assertGreater(v.support_workspace,0)
                self.assertGreaterEqual(v.snapshot_workspace,v.support_workspace)
                seen=True
            if event[0]==248:
                self.assertEqual(v.support_workspace,0)
                self.assertEqual(v.snapshot_workspace,0)
        self.assertTrue(seen)

    def test_sort_failure_releases_workspace_and_poison(self):
        v=self.terminal()
        with patch.object(CHECKER,'sorted',side_effect=MemoryError,create=True):
            with self.assertRaises(CHECKER.Refused):v.iter_dataset_rows()
        self.assertEqual(v.snapshot_workspace,0)
        with self.assertRaises(CHECKER.Refused):v.finish_verified()

    def test_row_conversion_allocation_fault_releases_and_poison(self):
        v=self.terminal();rows=v.iter_dataset_rows()
        with patch.object(CHECKER,'bytes',side_effect=MemoryError,create=True):
            with self.assertRaisesRegex(CHECKER.Refused,'ALLOCATION_OR_OVERFLOW'):next(rows)
        self.assertEqual(v.snapshot_workspace,0)
        with self.assertRaises(CHECKER.Refused):v.finish_verified()

    def test_time_failure_after_sort_releases_workspace_and_poison(self):
        v=self.terminal()
        with patch.object(CHECKER.time,'monotonic',side_effect=[v.deadline-1]*3+[v.deadline+1]):
            with self.assertRaisesRegex(CHECKER.Refused,'TIME'):v.iter_dataset_rows()
        self.assertEqual(v.snapshot_workspace,0)
        with self.assertRaises(CHECKER.Refused):v.finish_verified()

    def test_failure_before_iterator_initialization_no_unraisable(self):
        v=self.terminal();unraisable=[]
        with patch.object(sys,'unraisablehook',side_effect=unraisable.append):
            with patch.object(CHECKER.time,'monotonic',return_value=v.deadline+1):
                with self.assertRaises(CHECKER.Refused):v.iter_dataset_rows()
            gc.collect()
        self.assertEqual(unraisable,[])
        self.assertEqual(v.snapshot_workspace,0)

    def test_streamed_hashes_and_barriers_never_raw_compat(self):
        v=CHECKER.Verifier(*DOMAIN)
        with patch.object(v,'_raw',side_effect=RuntimeError('no raw copy')), \
             patch.object(v,'tables',side_effect=RuntimeError('no table copy')), \
             patch.object(v,'dataset',side_effect=RuntimeError('no data copy')):
            for event in self.events:
                v.feed(event);v.cursor()
            self.compare(v)
            self.assertEqual(v.finish_verified()['status'],'TINY_G_VERIFIED_CTB_OPEN')

    def test_terminal_requires_same_cut_verified_marker(self):
        v=self.terminal()
        with self.assertRaises(CHECKER.Refused):v.finish_verified()
        good=self.terminal();self.compare(good)
        self.assertEqual(good.finish_verified()['wholeGrant'],0)

    def test_feed_invalidates_verified_marker_even_failed_feed(self):
        v=replay(self.events[:1])
        v.compare_snapshot({s:iter(()) for s in v.tables()},iter(()))
        self.assertEqual(v.verified_snapshot,1)
        v.feed(self.events[1]);self.assertIsNone(v.verified_snapshot)
        bad=self.terminal();self.compare(bad)
        with self.assertRaises(CHECKER.Refused):bad.feed(b'bad')
        self.assertIsNone(bad.verified_snapshot)
        with self.assertRaises(CHECKER.Refused):bad.finish_verified()

    def test_external_iterator_reentrant_feed_invalidates_snapshot(self):
        v=replay(self.events[:1])
        class Reentrant:
            def __iter__(self):return self
            def __next__(self):
                v.feed(self.events[1])
                raise StopIteration
            events=self.events
        with self.assertRaisesRegex(CHECKER.Refused,'SNAPSHOT_FENCE'):
            v.compare_snapshot({s:Reentrant() for s in v.tables()},iter(()))

    def test_stream_row_type_width_range_order_and_duplicate(self):
        rows=list(stream_rows(self.data,4))
        variants=[rows[:-1],rows+[rows[-1]],list(reversed(rows)),
                  [bytearray(rows[0])]+rows[1:],[rows[0][:-1]]+rows[1:],
                  [b'\x00'*4]+rows[1:],[b'\x07'*4]+rows[1:],
                  [rows[0][::-1]]+rows[1:]]
        for variant in variants:
            v=self.terminal()
            with self.assertRaises(CHECKER.Refused):
                v.compare_snapshot(stream_tables(self.tables),iter(variant))
            self.assertTrue(v.poisoned)

    def test_stream_support_repeated_entries_and_missing_key(self):
        key=next(iter(self.tables));width=int(key)
        for supplied in ({},{**stream_tables(self.tables),key:iter([b'\x01'*width])}):
            v=self.terminal()
            with self.assertRaises(CHECKER.Refused):v.compare_snapshot(supplied,stream_rows(self.data,4))

    def test_reader_trailing_byte_and_incomplete_final_row(self):
        for raw in (self.data+b'\x01',self.data[:-1]):
            v=self.terminal()
            with self.assertRaises(CHECKER.Refused):
                v.compare_snapshot(stream_tables(self.tables),ChunkRows(raw,4))

    def test_stream_snapshot_error_permanently_poisoned(self):
        v=self.terminal()
        with self.assertRaises(CHECKER.Refused):
            v.compare_snapshot(stream_tables(self.tables),iter(()))
        with self.assertRaises(CHECKER.Refused):self.compare(v)
        with self.assertRaises(CHECKER.Refused):v.cursor()

    def test_static_disabled_declaration_defensive_and_409(self):
        spec=CHECKER.profile_spec('P139_RELEASE_DISABLED')
        self.assertFalse(spec['executionEnabled'])
        self.assertEqual(spec['wholeAttempts'],4);self.assertEqual(spec['wholeGrant'],0)
        self.assertEqual(spec['domain'],dict(prime=139,divisor=14,target=13))
        derived=[len(list(itertools.combinations(range(1,10),q))) for q in (9,7,5,4,3,2)]
        self.assertEqual(spec['rootCounts'],derived)
        self.assertEqual(sum(derived),409)
        spec['bounds']['nodes']=999;spec['rootCounts'][0]=999
        self.assertEqual(CHECKER.profile_spec('P139_RELEASE_DISABLED')['rootCounts'][0],1)
        tiny=CHECKER.profile_spec();tiny['domain']['prime'][0]=999
        self.assertEqual(CHECKER.profile_spec()['domain']['prime'][0],3)

    def test_forged_profile_cannot_construct139_before_effects(self):
        class Forged:
            def __eq__(self,other):raise RuntimeError('profile executed')
        with patch.object(CHECKER.time,'monotonic',side_effect=RuntimeError('clock')), \
             patch.object(CHECKER.Verifier,'_reserve',side_effect=RuntimeError('reserve')):
            for profile in ('BUILD_TINY','P139_RELEASE_DISABLED','approved',True,Forged()):
                with self.assertRaises(CHECKER.Refused):
                    CHECKER.Verifier(139,14,13,limits={'wholeGrant':1},profile=profile)
            for profile in ('P139_RELEASE_DISABLED','approved',False,Forged()):
                with self.assertRaises(CHECKER.Refused):CHECKER.Verifier(*DOMAIN,profile=profile)

    def test_profile_unknown_types_and_declared_caps_not_tiny_grant(self):
        for profile in (None,True,{},'approved'):
            with self.assertRaises(CHECKER.Refused):CHECKER.profile_spec(profile)
        with self.assertRaises(CHECKER.Refused):
            CHECKER.Verifier(*DOMAIN,limits=CHECKER.profile_spec('P139_RELEASE_DISABLED')['bounds'])

    def test_compat_finish_hostile_table_key_never_huge_int_parse(self):
        v=self.terminal()
        with self.assertRaises(CHECKER.Refused):v.finish(self.data,{'9'*10000:b''})



def release_binding():
    return dict(root='LRC_P139_REPRODUCTION_075', mode='REPRODUCTION', obligation='G',
                domain=dict(prime=139, divisor=14, target=13), attempt=5,
                priorWholeAttempts=4, grantSha256='1'*64,
                resourceContractSha256=CHECKER.RESOURCE_SHA, releaseReviewSha256='2'*64,
                sourcePins=dict(producer='3'*64, checker='4'*64, host='5'*64),
                headerSha256='6'*64, reservationSha256='7'*64, startSha256='8'*64,
                phaseId=2, action='VERIFY')


def admitted_module(binding=None):
    """Synthetic pinned namespace; no real operator grant or139 constructor."""
    identity, requests = object(), []
    held = release_binding() if binding is None else binding
    def gate(token, request):
        if token is not identity:
            raise ValueError('wrong identity')
        requests.append(request)
        return held
    spec=importlib.util.spec_from_file_location('synthetic_checker_release',SOURCE)
    module=importlib.util.module_from_spec(spec)
    module._PINNED_HOST_RELEASE_GATE=gate
    spec.loader.exec_module(module)
    return module, identity, requests, held


def synthetic_terminal(module, identity):
    """Control-flow fixture only. NEVER masks/root search or a scientific result."""
    limits, binding=module.release_preflight(139,14,13,profile='P139_RELEASE',release=identity)
    v=module.Verifier.__new__(module.Verifier)
    v.limits=limits;v.deadline=float('inf');v.memory=65536+2097152;v.snapshot_workspace=0
    v.poisoned=False;v.full=True;v._release_binding=binding
    v.p,v.d,v.target,v.n,v.m,v.lower=139,14,13,69,9,8
    v.root_index=409;v.expected_roots=dict(zip(range(8,14),(1,36,126,126,84,36)))
    v.completed_roots=v.expected_roots.copy();v.phase='TERMINAL';v.events=17
    v.verified_snapshot=None;v.finalized={str(s):set() for s in range(8,14)}
    v.size=0;v.current=set();v.final_rows=set()
    return v


class ReleaseAdmissionTests(unittest.TestCase):
    def test_normal_import_has_no_gate_or_bootstrap_key(self):
        self.assertIsNone(CHECKER._HOST_RELEASE_GATE)
        self.assertFalse(hasattr(CHECKER,'_PINNED_HOST_RELEASE_GATE'))
        with patch.object(CHECKER.time,'monotonic',side_effect=AssertionError('clock')):
            for token in (None,True,{},object(),release_binding()):
                with self.assertRaises(CHECKER.Refused):
                    CHECKER.Verifier(139,14,13,profile='P139_RELEASE',release=token)

    def test_host_namespace_key_captured_and_removed(self):
        m,token,requests,_=admitted_module()
        self.assertFalse(hasattr(m,'_PINNED_HOST_RELEASE_GATE'))
        with patch.object(m.time,'monotonic',side_effect=AssertionError('clock')):
            bounds,binding=m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)
        self.assertEqual(bounds,m.FULL);self.assertIsInstance(binding,tuple)
        self.assertEqual(requests,[dict(profile='P139_RELEASE',domain=dict(prime=139,divisor=14,target=13),
                                       action='VERIFY',limits=m.FULL)])

    def test_authorized_constructor_stops_at_fatal_first_clock_no_masks(self):
        m,token,_,_=admitted_module()
        with patch.object(m.time,'monotonic',side_effect=AssertionError('fatal pre-mask clock')):
            with self.assertRaisesRegex(AssertionError,'fatal pre-mask clock'):
                m.Verifier(139,14,13,profile='P139_RELEASE',release=token)

    def test_full_resident_precharge_inside_selected_cap_before_masks(self):
        m,token,_,_=admitted_module();charges=[]
        def reserve(v,amount):
            charges.append((amount,v.limits.copy()))
            if amount==2097152:raise AssertionError('fatal before masks')
        with patch.object(m.time,'monotonic',return_value=0),patch.object(m.Verifier,'_reserve',reserve):
            with self.assertRaisesRegex(AssertionError,'fatal before masks'):
                m.Verifier(139,14,13,profile='P139_RELEASE',release=token)
        self.assertEqual([c[0] for c in charges],[65536,2097152])
        self.assertTrue(all(c[1]['memory']==536870912 for c in charges))

    def test_wrong_and_copied_identities_refuse_before_clock(self):
        m,token,requests,_=admitted_module()
        with patch.object(m.time,'monotonic',side_effect=AssertionError('clock')):
            for fake in (object(),{},True,release_binding()):
                with self.assertRaises(m.Refused):m.Verifier(139,14,13,profile='P139_RELEASE',release=fake)
        self.assertEqual(requests,[])

    def test_cross_namespace_token_not_reusable(self):
        first,token,_,_=admitted_module();second,other,_,_=admitted_module()
        with self.assertRaises(second.Refused):second.release_preflight(139,14,13,profile='P139_RELEASE',release=token)
        self.assertEqual(first.release_preflight(139,14,13,profile='P139_RELEASE',release=token)[0],first.FULL)
        self.assertIsNot(token,other)

    def test_tiny_rejects_release_identity_without_gate_call(self):
        m,token,requests,_=admitted_module()
        with self.assertRaises(m.Refused):m.release_preflight(*DOMAIN,release=token)
        self.assertEqual(requests,[])

    def test_full_domain_aliases_rejected_before_gate(self):
        m,token,requests,_=admitted_module()
        for domain in ((True,14,13),(139,14.0,13),(139,14,True),(137,14,13),(139,15,13),(139,14,12)):
            with self.assertRaises(m.Refused):m.release_preflight(*domain,profile='P139_RELEASE',release=token)
        self.assertEqual(requests,[])

    def test_fixed_scope_history_action_contract_and_phase_mutations(self):
        changes={'root':'another','mode':'DISCOVERY','obligation':'C','action':'GENERATE',
                 'attempt':4,'priorWholeAttempts':5,'resourceContractSha256':'0'*64,
                 'phaseId':3}
        for key,value in changes.items():
            binding=release_binding();binding[key]=value;m,token,_,_=admitted_module(binding)
            with self.assertRaises(m.Refused):m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)

    def test_binding_exact_keys_mapping_and_scalar_types(self):
        variants=[]
        b=release_binding();b['extra']=0;variants.append(b)
        b=release_binding();del b['startSha256'];variants.append(b)
        for key,value in (('attempt',True),('priorWholeAttempts',4.0),('phaseId',False),('phaseId',33),
                          ('phaseId',1),('phaseId',0),('domain',dict(prime=139,divisor=14,target=13.0))):
            b=release_binding();b[key]=value;variants.append(b)
        class BindingSubclass(dict):pass
        variants.extend([BindingSubclass(release_binding()),None,True])
        for b in variants:
            m,token,_,_=admitted_module(b if b is not None else True)
            with self.assertRaises(m.Refused):m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)

    def test_digest_and_source_pin_structural_faults(self):
        for key in ('grantSha256','releaseReviewSha256','headerSha256','reservationSha256','startSha256'):
            for value in ('A'*64,'0'*63,True):
                b=release_binding();b[key]=value;m,token,_,_=admitted_module(b)
                with self.assertRaises(m.Refused):m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)
        for pins in ({},{'producer':'1'*64,'checker':'2'*64,'host':False},
                     {**release_binding()['sourcePins'],'extra':'0'*64}):
            b=release_binding();b['sourcePins']=pins;m,token,_,_=admitted_module(b)
            with self.assertRaises(m.Refused):m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)

    def test_binding_domain_cannot_follow_gate_request_mutation(self):
        m,token,_,_=admitted_module()
        def gate(identity,request):
            request['domain']['prime']=137
            b=release_binding();b['domain']['prime']=137;return b
        m._HOST_RELEASE_GATE=gate  # Hostile namespace is test-only, outside claimed threat profile.
        with self.assertRaises(m.Refused):m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)

    def test_returned_labels_are_nested_immutable_copies(self):
        m,token,_,held=admitted_module()
        bounds,frozen=m.release_preflight(139,14,13,profile='P139_RELEASE',release=token)
        before=repr(frozen);held['domain']['prime']=3;held['sourcePins']['checker']='0'*64;held['attempt']=1
        bounds['memory']=1
        self.assertEqual(repr(frozen),before);self.assertEqual(m.FULL['memory'],536870912)

    def test_full_lower_only_limits_and_aliases_before_gate(self):
        m,token,requests,_=admitted_module();small=m.FULL.copy();small['nodes']=1
        selected,_=m.release_preflight(139,14,13,limits=small,profile='P139_RELEASE',release=token)
        self.assertEqual(selected['nodes'],1)
        for key in m.FULL:
            for value in (True,10**400,-1):
                bad=m.FULL.copy();bad[key]=value
                with self.assertRaises(m.Refused):m.release_preflight(139,14,13,limits=bad,profile='P139_RELEASE',release=token)
        self.assertEqual(len(requests),1)

    def test_declared_full_profile_defensive_not_authority(self):
        spec=CHECKER.profile_spec('P139_RELEASE');self.assertFalse(spec['executionEnabled'])
        spec['bounds']['memory']=1;spec['rootCounts'][0]=0
        self.assertEqual(CHECKER.profile_spec('P139_RELEASE')['bounds']['memory'],536870912)
        self.assertEqual(CHECKER.profile_spec('P139_RELEASE')['rootCounts'][0],1)

    def test_tiny_real_roots_counted_only_at_completed_root_end(self):
        events,_,_=certificate(*DOMAIN);v=CHECKER.Verifier(*DOMAIN)
        seen={}
        for event in events:
            oldsize=v.size
            v.feed(event)
            if event[0]==245:seen[oldsize]=seen.get(oldsize,0)+1
            self.assertEqual(v.completed_roots,seen)
        self.assertEqual(v.completed_roots,v.expected_roots)
        self.assertEqual(v.root_index,sum(seen.values()))

    def test_synthetic_full_terminal_only_g_with_both_eofs(self):
        m,token,_,_=admitted_module();v=synthetic_terminal(m,token)
        v.compare_snapshot({str(s):iter(()) for s in range(8,14)},iter(()))
        verdict=v.finish_verified()
        self.assertEqual(verdict,dict(status='WHOLE_G_VERIFIED_CTB_OPEN',semanticVerified=True,
                                      wholeGrant=1,wholeAttempts=5,rows=0))
        self.assertNotIn('J',verdict);self.assertNotIn('proof',verdict)

    def test_synthetic_full_missing_derived_root_or_sum_cannot_finish(self):
        for mutate in (lambda v:v.completed_roots.__setitem__(8,0),
                       lambda v:v.expected_roots.__setitem__(13,35),
                       lambda v:setattr(v,'root_index',408),
                       lambda v:v.completed_roots.pop(12),
                       lambda v:setattr(v,'n',68)):
            m,token,_,_=admitted_module();v=synthetic_terminal(m,token)
            v.compare_snapshot({str(s):iter(()) for s in range(8,14)},iter(()));mutate(v)
            with self.assertRaises(m.Refused):v.finish_verified()
            with self.assertRaises(m.Refused):v.finish_verified()

    def test_synthetic_full_marker_prefix_missing_table_and_stream_errors(self):
        m,token,_,_=admitted_module()
        v=synthetic_terminal(m,token)
        with self.assertRaises(m.Refused):v.finish_verified()
        v=synthetic_terminal(m,token);v.phase='FINAL_END'
        v.compare_snapshot({str(s):iter(()) for s in range(8,14)},iter(()))
        with self.assertRaises(m.Refused):v.finish_verified()
        v=synthetic_terminal(m,token)
        with self.assertRaises(m.Refused):v.compare_snapshot({str(s):iter(()) for s in range(8,13)},iter(()))
        with self.assertRaises(m.Refused):v.finish_verified()
        v=synthetic_terminal(m,token)
        with self.assertRaises(m.Refused):v.compare_snapshot({str(s):iter(()) for s in range(8,14)},iter([None]))
        with self.assertRaises(m.Refused):v.finish_verified()

    def test_no_exported_mint_or_enable_method_and_no_semantic_imports(self):
        tree=ast.parse(SOURCE.read_text());names={n.name for n in ast.walk(tree) if isinstance(n,(ast.FunctionDef,ast.ClassDef))}
        self.assertFalse(names&{'enable','mint','create_grant','set_release_gate'})
        imports={a.name for n in tree.body if isinstance(n,ast.Import) for a in n.names}
        self.assertEqual(imports,{'hashlib','itertools','math','time'})


if __name__ == '__main__':
    unittest.main()
