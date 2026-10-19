"""Independent tiny exhaustive oracle and hostile checker controls, not p139."""
import ast
import hashlib
import importlib.util
import itertools
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/operations/verify-lrc-p139-g-segments.py'
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
        source=ROOT/'scripts/operations/attempt-lrc-p139-generation-v3.py'
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


if __name__ == '__main__':
    unittest.main()
