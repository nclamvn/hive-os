"""075C actual owned filesystem and child lifecycle controls; no whole p139."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest
from unittest import mock

PATH = Path(__file__).resolve().parents[2]/'scripts/operations/capture-lrc-p139-generation-v3.py'
spec = importlib.util.spec_from_file_location('host075c',PATH)
H = importlib.util.module_from_spec(spec)
spec.loader.exec_module(H)
DOMAIN = dict(prime=7,divisor=3,target=3)

class HostTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='hive-075c-host-')
        self.directory = Path(self.temp.name).resolve()
        H._fault = lambda point: None

    def tearDown(self):
        H._fault = lambda point: None
        self.temp.cleanup()

    def create(self,limits=None,domain=None):
        return H.create_session(self.directory,domain or DOMAIN,limits)

    def read(self,name):
        return json.loads((self.directory/name).read_bytes())

    def put(self,name,obj):
        (self.directory/name).write_bytes(H.encoded(obj))

    def complete(self):
        self.create()
        return H.advance(self.directory,1000)

    def rehash_descriptor(self,edit):
        prefix = 'segment-000000'
        desc = self.read(prefix+'-descriptor.json')
        edit(desc)
        self.put(prefix+'-descriptor.json',desc)
        commit = self.read(prefix+'-commit.json')
        commit['descriptorSha256'] = H.sha(H.encoded(desc))
        self.put(prefix+'-commit.json',commit)
        ch = H.sha(H.encoded(commit))
        receipt = self.read('receipt-000002.json')
        receipt['commitSha256'] = ch
        self.put('receipt-000002.json',receipt)
        if (self.directory/'reserve-000003.json').exists():
            reservation = self.read('reserve-000003.json')
            reservation['predecessor'] = ch
            self.put('reserve-000003.json',reservation)
            rh = H.sha(H.encoded(reservation))
            start = self.read('start-000003.json')
            start['reservationSha256'] = rh
            self.put('start-000003.json',start)
            receipt = self.read('receipt-000003.json')
            receipt.update(reservationSha256=rh,startSha256=H.sha(H.encoded(start)),commitSha256=ch)
            self.put('receipt-000003.json',receipt)

    def test_complete_real_three_children_and_permanent_total(self):
        result = self.complete()
        self.assertEqual(result['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual(result['chargedInvocations'],3)
        self.assertEqual(result['totalReservations']['nodes'],300000)
        self.assertEqual(result['totalReservations']['events'],600000)
        self.assertEqual(result['totalReservations']['seconds'],96)
        self.assertEqual(result['cursor']['eventCount'],23)
        self.assertEqual(result['wholeAttempts'],4)
        self.assertEqual(result['wholeGrant'],0)
        self.assertEqual(len(list(self.directory.glob('start-*.json'))),3)
        self.assertEqual(len(list(self.directory.glob('receipt-*.json'))),3)

    def test_every_advance_fresh_prefix_and_reconstruction(self):
        self.create()
        first = H.advance(self.directory,1)
        self.assertEqual(first['verdict'],'PREFIX_VERIFIED_G_OPEN')
        self.assertEqual(first['cursor']['eventCount'],1)
        last = H.advance(self.directory,1000)
        self.assertEqual(last['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual(last['chargedInvocations'],6)
        self.assertEqual(last['totalReservations']['nodes'],600000)
        self.assertEqual(last['totalReservations']['seconds'],192)

    def test_inspect_never_reuses_receipt_as_fresh_acceptance(self):
        self.complete()
        with mock.patch.object(H,'_run_child',side_effect=AssertionError('spawn')):
            result = H.inspect_session(self.directory)
        self.assertIs(result['semanticVerified'],False)
        self.assertEqual(result['lastRecordedVerdict'],'TINY_G_VERIFIED_CTB_OPEN')

    def test_terminal_no_automatic_new_start(self):
        self.complete()
        before = {p.name:p.read_bytes() for p in self.directory.iterdir()}
        with self.assertRaises(H.Refused):
            H.advance(self.directory)
        self.assertEqual(before,{p.name:p.read_bytes() for p in self.directory.iterdir()})

    def test_p139_refuses_before_pins_or_constructor(self):
        with mock.patch.object(H,'_pins',side_effect=AssertionError('source load')):
            with self.assertRaises(H.Refused):
                self.create(domain=dict(prime=139,divisor=14,target=13))
        self.assertEqual(list(self.directory.iterdir()),[])

    def test_default_cli_refuses_real_child(self):
        result = subprocess.run([sys.executable,'-I','-S','-B',str(PATH)],capture_output=True,timeout=3,
                                env={n:'false' for n in H.FLAGS})
        self.assertEqual(result.returncode,2)
        self.assertIn(b'default CLI/whole grant',result.stderr)
        self.assertFalse(result.stdout)

    def test_domain_and_limit_exact_types_and_no_raise(self):
        for domain in (dict(prime=True,divisor=3,target=3),dict(prime=9,divisor=3,target=3),dict(prime=7,divisor=24,target=3)):
            with self.assertRaises(H.Refused):
                self.create(domain=domain)
        for lim in ({'invocations':True},{'nodes':100.0},{'engineLimits':{}},{'stdoutBytes':2097153},{'seconds':float('nan')}):
            with self.assertRaises(H.Refused):
                self.create(lim)

    def crash(self,point,number=1):
        count = [0]
        def crash_at(where):
            if where == point:
                count[0] += 1
                if count[0] == number:
                    raise RuntimeError('owned test crash '+point)
        H._fault = crash_at
        with self.assertRaises(RuntimeError):
            H.advance(self.directory,1000)
        H._fault = lambda point: None

    def assert_blocked_without_new_start(self):
        before = {p.name:p.read_bytes() for p in self.directory.iterdir()}
        with self.assertRaises(H.Refused):
            H.advance(self.directory)
        self.assertEqual(before,{p.name:p.read_bytes() for p in self.directory.iterdir()})

    def test_crash_after_reservation_full_quota_no_start_or_refund(self):
        self.create()
        self.crash('after_reservation')
        r = self.read('reserve-000001.json')
        self.assertEqual(r['quota']['nodes'],100000)
        self.assertFalse((self.directory/'start-000001.json').exists())
        self.assert_blocked_without_new_start()

    def test_crash_after_start_missing_receipt_stops(self):
        self.create()
        self.crash('after_start')
        self.assertTrue((self.directory/'start-000001.json').exists())
        self.assertFalse((self.directory/'receipt-000001.json').exists())
        self.assert_blocked_without_new_start()

    def test_crash_after_staging_no_commit_and_no_rollback(self):
        self.create()
        self.crash('after_staging')
        self.assertTrue((self.directory/'segment-000000-events.bin').exists())
        self.assertFalse((self.directory/'segment-000000-commit.json').exists())
        self.assertEqual(self.read('receipt-000002.json')['status'],'ERROR')
        self.assert_blocked_without_new_start()

    def test_crash_after_commit_error_receipt_keeps_tail(self):
        self.create()
        self.crash('after_commit')
        self.assertTrue((self.directory/'segment-000000-commit.json').exists())
        self.assertEqual(self.read('receipt-000002.json')['status'],'ERROR')
        self.assert_blocked_without_new_start()

    def test_captured_successful_tail_gets_charged_verification_only(self):
        self.create()
        self.crash('after_receipt',2)
        self.assertEqual(H.inspect_session(self.directory)['lastRecordedVerdict'],'CAPTURED_UNACCEPTED')
        before = (self.directory/'segment-000000-commit.json').read_bytes()
        result = H.advance(self.directory)
        self.assertEqual(result['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual(result['chargedInvocations'],3)
        self.assertEqual(before,(self.directory/'segment-000000-commit.json').read_bytes())
        self.assertFalse((self.directory/'segment-000001-commit.json').exists())

    def test_crash_after_final_checker_receipt_is_not_new_work(self):
        self.create()
        self.crash('after_receipt',3)
        self.assertEqual(H.inspect_session(self.directory)['chargedInvocations'],3)
        self.assert_blocked_without_new_start()

    def test_total_exhaustion_prevents_next_reservation(self):
        self.create({'invocations':3})
        H.advance(self.directory,1)
        self.assert_blocked_without_new_start()

    def test_total_nodes_exhaustion_spends_prefix_only(self):
        self.create({'nodes':100000})
        with self.assertRaises(H.Refused):
            H.advance(self.directory,1)
        self.assertTrue((self.directory/'receipt-000001.json').exists())
        self.assertFalse((self.directory/'reserve-000002.json').exists())
        self.assert_blocked_without_new_start()

    def test_forged_reservation_quota_rejected(self):
        self.complete()
        r = self.read('reserve-000001.json')
        r['quota']['nodes'] = 1
        self.put('reserve-000001.json',r)
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_duplicate_header_key_and_bool_grant_refused(self):
        self.create()
        h = self.read('header.json')
        h['history']['wholeGrant'] = False
        self.put('header.json',h)
        with self.assertRaises(H.Refused):
            H.advance(self.directory)
        raw = H.encoded(h).replace(b'"format":',b'"format":"duplicate","format":',1)
        (self.directory/'header.json').write_bytes(raw)
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_coherently_rehashed_bool_index_rejected(self):
        self.create()
        H.advance(self.directory,1)
        self.rehash_descriptor(lambda d:d.update(index=False))
        self.assert_blocked_without_new_start()

    def test_coherently_rehashed_bool_cursor_counter_refused_before_child(self):
        self.create()
        H.advance(self.directory,1)
        self.rehash_descriptor(lambda d:d['endCursor'].update(rootNodes=False))
        self.assert_blocked_without_new_start()
        self.assertFalse((self.directory/'reserve-000004.json').exists())
        self.assertFalse((self.directory/'reserve-000005.json').exists())

    def test_coherently_rehashed_event_omission_rejected_by_real_checker(self):
        self.create()
        H.advance(self.directory,4)
        name = 'segment-000000-events.bin'
        raw = (self.directory/name).read_bytes()
        events = H.unpack_events(raw,65536)
        changed = b''.join(len(e).to_bytes(4,'little')+e for e in events[:-1])
        (self.directory/name).write_bytes(changed)
        self.rehash_descriptor(lambda d:d.update(payloadBytes=len(changed),payloadSha256=H.sha(changed),eventCount=len(events)-1))
        with self.assertRaises(H.Refused):
            H.advance(self.directory,1000)
        self.assertEqual(self.read('receipt-000004.json')['status'],'ERROR')
        self.assertEqual(len(list(self.directory.glob('segment-*-commit.json'))),1)

    def test_orphan_file_refused(self):
        self.create()
        H.advance(self.directory,1)
        (self.directory/'orphan.bin').write_bytes(b'x')
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_real_exclusive_directory_lock(self):
        self.create()
        fd = H.directory_fd(self.directory)
        try:
            with self.assertRaises(H.Refused):
                H.advance(self.directory)
        finally:
            os.close(fd)

    def test_real_symlink_directory_and_file_rejected(self):
        self.create()
        link = self.directory/'link'
        link.symlink_to(self.directory,target_is_directory=True)
        with self.assertRaises(H.Refused):
            H.inspect_session(link)
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_real_hardlink_rejected(self):
        self.create()
        os.link(self.directory/'header.json',self.directory/'hardlink')
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_source_pin_mismatch_refuses_before_any_start(self):
        self.create()
        h = self.read('header.json')
        h['pins']['checker'] = '0'*64
        self.put('header.json',h)
        self.assert_blocked_without_new_start()

    def pipes(self,script,limits=None):
        original = subprocess.Popen
        seen = []
        def factory(command,**kwargs):
            self.assertIs(kwargs['shell'],False)
            self.assertEqual(kwargs['env'],{n:'false' for n in H.FLAGS})
            child = original([sys.executable,'-I','-S','-B','-c',script],**kwargs)
            seen.append(child)
            return child
        h = dict(limits=H.limits_checked(limits),pins=H._pins())
        with mock.patch.object(H.subprocess,'Popen',side_effect=factory):
            try:
                result = H._run_child(b'{}\n',h)
            finally:
                self.assertEqual(len(seen),1)
                self.assertIsNotNone(seen[0].poll())
                self.assertTrue(all(s.closed for s in (seen[0].stdin,seen[0].stdout,seen[0].stderr)))
        return result

    def test_real_pipe_timeout_kill_wait_close(self):
        began = time.monotonic()
        with self.assertRaises(H.Refused):
            self.pipes('import time; time.sleep(5)',{'processSeconds':.05})
        self.assertLess(time.monotonic()-began,3)

    def test_real_pipe_stdout_overflow(self):
        with self.assertRaises(H.Refused):
            self.pipes('import sys; sys.stdout.write("x"*10000)',{'stdoutBytes':32})

    def test_real_pipe_stderr_overflow(self):
        with self.assertRaises(H.Refused):
            self.pipes('import sys; sys.stderr.write("x"*10000)',{'stderrBytes':16})

    def test_real_pipe_positive_json_nonzero_exit_never_admitted(self):
        with self.assertRaises(H.Refused):
            self.pipes('import sys; print("{\\\"verdict\\\":\\\"TINY_G_VERIFIED_CTB_OPEN\\\"}"); sys.exit(1)')

    def test_real_pipe_exact_six_false_environment(self):
        result = self.pipes('import json,os; print(json.dumps(dict(os.environ)))')
        for name in H.FLAGS:
            self.assertEqual(result[name],'false')

    def test_checker_failure_preserves_captured_tail_without_positive_receipt(self):
        self.create()
        original = H._run_child
        calls = [0]
        def failing(request,h):
            calls[0] += 1
            if calls[0] == 3:
                raise H.Refused('owned checker fault')
            return original(request,h)
        with mock.patch.object(H,'_run_child',side_effect=failing):
            with self.assertRaises(H.Refused):
                H.advance(self.directory,1000)
        self.assertEqual(self.read('receipt-000003.json')['status'],'ERROR')
        self.assertEqual(self.read('receipt-000002.json')['verdict'],'CAPTURED_UNACCEPTED')
        self.assert_blocked_without_new_start()

    def test_preparse_depth_refuses_before_json_loads(self):
        with mock.patch.object(H.json,'loads',side_effect=AssertionError('parser called')):
            with self.assertRaises(H.Refused):
                H.decoded(b'['*25+b']'*25,65536)

    def test_preparse_token_refuses_before_json_loads(self):
        raw = b'['+b'0,'*50001+b'0]'
        with mock.patch.object(H.json,'loads',side_effect=AssertionError('parser called')):
            with self.assertRaises(H.Refused):
                H.decoded(raw,2097152)

    def test_preparse_memory_refuses_before_json_loads(self):
        with mock.patch.object(H.json,'loads',side_effect=AssertionError('parser called')):
            with self.assertRaises(H.Refused):
                H.decoded(b'"'+b'a'*40000+b'"',65536,4500000)

    def test_too_small_memory_storage_or_files_refuses_before_child(self):
        with self.assertRaises(H.Refused):
            self.create({'memory':1})
        with self.assertRaises(H.Refused):
            self.create({'liveBytes':10})
        self.create({'files':4})
        with mock.patch.object(H,'_run_child',side_effect=AssertionError('spawn')):
            with self.assertRaises(H.Refused):
                H.advance(self.directory)
        self.assertFalse((self.directory/'reserve-000001.json').exists())

    def test_actual_fifo_rejected_without_blocking(self):
        self.create()
        os.mkfifo(self.directory/'fifo',0o600)
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_actual_file_symlink_rejected(self):
        self.create()
        data = (self.directory/'header.json').read_bytes()
        (self.directory/'saved-header').write_bytes(data)
        (self.directory/'header.json').unlink()
        (self.directory/'header.json').symlink_to(self.directory/'saved-header')
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_actual_truncated_payload_rejected(self):
        self.create()
        H.advance(self.directory,1)
        name = 'segment-000000-events.bin'
        raw = (self.directory/name).read_bytes()
        (self.directory/name).write_bytes(raw[:-1])
        self.assert_blocked_without_new_start()

    def test_actual_missing_receipt_refuses_before_new_start(self):
        self.complete()
        (self.directory/'receipt-000003.json').unlink()
        self.assert_blocked_without_new_start()

    def test_receipt_bool_id_and_blob_bool_width_rejected(self):
        self.create(domain=dict(prime=3,divisor=2,target=1))
        H.advance(self.directory,1000)
        receipt = self.read('receipt-000001.json')
        receipt['id'] = True
        self.put('receipt-000001.json',receipt)
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)
        receipt['id'] = 1
        self.put('receipt-000001.json',receipt)
        self.rehash_descriptor(lambda d:d['dataset'].update(width=True))
        with self.assertRaises(H.Refused):
            H.inspect_session(self.directory)

    def test_float_cursor_and_commit_index_refused(self):
        self.create()
        H.advance(self.directory,1)
        self.rehash_descriptor(lambda d:d.update(index=0.0))
        self.assert_blocked_without_new_start()

    def test_positive_checker_payload_wrong_phase_never_receipt_ok(self):
        self.create()
        with mock.patch.object(H,'_run_child',return_value=dict(cursor={'phase':'PROLOGUE'},verdict='TINY_G_VERIFIED_CTB_OPEN')):
            with self.assertRaises(H.Refused):
                H.advance(self.directory)
        self.assertEqual(self.read('receipt-000001.json')['status'],'ERROR')
        self.assertFalse((self.directory/'reserve-000002.json').exists())

    def test_giant_time_integer_refuses_without_overflow(self):
        for key in ('seconds','processSeconds'):
            with self.assertRaises(H.Refused):
                H.limits_checked({key:2**10000})

    def test_after_child_pin_drift_discards_positive_result(self):
        self.create()
        actual = H._pins()
        drift = dict(actual,checker='0'*64)
        with mock.patch.object(H,'_pins',side_effect=[actual,drift]):
            with self.assertRaises(H.Refused):
                H.advance(self.directory)
        self.assertEqual(self.read('receipt-000001.json')['status'],'ERROR')
        self.assertFalse((self.directory/'reserve-000002.json').exists())

    def test_generator_start_crash_spends_second_slot_without_commit(self):
        self.create()
        self.crash('after_start',2)
        self.assertEqual(len(list(self.directory.glob('reserve-*.json'))),2)
        self.assertFalse((self.directory/'receipt-000002.json').exists())
        self.assertFalse((self.directory/'segment-000000-commit.json').exists())
        self.assert_blocked_without_new_start()

    def test_checker_start_crash_keeps_capture_but_cannot_free_replay(self):
        self.create()
        self.crash('after_start',3)
        self.assertEqual(self.read('receipt-000002.json')['status'],'OK')
        self.assertTrue((self.directory/'segment-000000-commit.json').exists())
        self.assertTrue((self.directory/'reserve-000003.json').exists())
        self.assertFalse((self.directory/'receipt-000003.json').exists())
        self.assert_blocked_without_new_start()

    def test_typed_coherently_rehashed_wrong_cursor_replayed_rejected(self):
        self.create()
        H.advance(self.directory,1)
        self.rehash_descriptor(lambda d:d['endCursor'].update(rootNodes=1))
        with self.assertRaises(H.Refused):
            H.advance(self.directory,1000)
        self.assertEqual(self.read('receipt-000004.json')['status'],'ERROR')
        self.assertFalse((self.directory/'reserve-000005.json').exists())

    def test_unreaped_wait_refusal_still_closes_selector_and_real_pipes(self):
        original = subprocess.Popen
        real_select = H.selectors.DefaultSelector
        seen, selectors = [],[]
        class Proxy:
            def __init__(self,child):
                self.child = child
            def __getattr__(self,name):
                return getattr(self.child,name)
            def wait(self,timeout=None):
                raise subprocess.TimeoutExpired('owned wait fixture',timeout)
        def factory(command,**kwargs):
            child = original([sys.executable,'-I','-S','-B','-c','print("{}")'],**kwargs)
            seen.append(child)
            return Proxy(child)
        def selected():
            sel = real_select()
            selectors.append(sel)
            return sel
        header = dict(limits=H.DEFAULTS,pins=H._pins())
        with mock.patch.object(H.subprocess,'Popen',side_effect=factory),mock.patch.object(H.selectors,'DefaultSelector',side_effect=selected):
            with self.assertRaises(H.Refused):
                H._run_child(b'{}\n',header)
        self.assertEqual(len(selectors),1)
        self.assertIsNone(selectors[0].get_map())
        self.assertTrue(all(s.closed for s in (seen[0].stdin,seen[0].stdout,seen[0].stderr)))
        self.assertIsNotNone(seen[0].poll())

    def test_verified_host_bytes_not_path_exec_real_child(self):
        self.create()
        original = subprocess.Popen
        commands = []
        def factory(command,**kwargs):
            commands.append(command)
            self.assertEqual(command[4],'-c')
            self.assertIn('def _worker(request):',command[5])
            self.assertTrue(command[5].startswith('__file__='))
            return original(command,**kwargs)
        with mock.patch.object(H.subprocess,'Popen',side_effect=factory):
            result = H.advance(self.directory,1000)
        self.assertEqual(result['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual(len(commands),3)

if __name__ == '__main__':
    unittest.main()
