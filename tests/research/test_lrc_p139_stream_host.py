"""075D bounded real files/children and inert adversarial stream controls."""
import copy
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import struct
import sys
import tempfile
import time
import unittest
from unittest import mock

PATH=Path(__file__).resolve().parents[2]/'scripts/operations/capture-lrc-p139-generation-v4.py'
SPEC=importlib.util.spec_from_file_location('host075d',PATH)
H=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(H)
DOMAIN=dict(prime=7,divisor=3,target=3)

class Crash(BaseException): pass

class StreamHostTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(prefix='hive-075d-host-')
        self.directory=Path(self.temp.name).resolve()
        H._fault=lambda point:None

    def tearDown(self):
        H._fault=lambda point:None
        self.temp.cleanup()

    def create(self,limits=None): return H.create_session(self.directory,DOMAIN,limits)
    def read(self,name): return json.loads((self.directory/name).read_bytes())
    def put(self,name,value): (self.directory/name).write_bytes(H.encoded(value))
    def complete(self): self.create();return H.advance(self.directory,1000)
    def header_packet(self,edit=None,ending=True):
        header=self.read('header.json')
        if edit: edit(header)
        control=H.encoded(dict(header=header,action='VERIFY',maxEvents=0,cursor=None))
        raw=H.INPUT_MAGIC+H.frame(1,control)
        if ending: raw+=H.frame(8,H.encoded(dict(segments=0,tail=H.sha(H.encoded(header)),headerSha256=H.sha(H.encoded(header)))))
        return raw
    def work(self,raw,write=None):
        source=io.BytesIO(raw);out=io.BytesIO()
        with mock.patch.dict(os.environ,{key:'false' for key in H.FLAGS}):
            H.worker(source.read,write or out.write)
        return out.getvalue()
    def crash(self,point):
        def hook(actual):
            if actual==point: raise Crash(point)
        H._fault=hook
    def capture(self):
        self.create()
        def hook(point):
            if point=='after_receipt' and (self.directory/'receipt-000003.json').exists(): raise Crash('captured')
        H._fault=hook
        with self.assertRaises(Crash): H.advance(self.directory,1000)
        H._fault=lambda point:None

    def injected_child(self,body):
        original=H.subprocess.Popen
        def start(args,**kwargs):
            # Fault fixture is bounded, non-mathematical child code, not a
            # configurable production source or trust bypass.
            return original([sys.executable,'-I','-S','-B','-c',body],**kwargs)
        return mock.patch.object(H.subprocess,'Popen',side_effect=start)

    def test_actual_audit_and_three_children_permanent_pools(self):
        result=self.complete()
        self.assertEqual(result['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual(result['cursor']['eventCount'],23)
        self.assertEqual(result['chargedInvocations'],4)
        self.assertEqual(result['totals']['auditInvocations'],1)
        self.assertEqual(result['totals']['producerInvocations'],1)
        self.assertEqual(result['totals']['checkerInvocations'],2)
        self.assertEqual(result['totals']['totalSeconds'],118)
        self.assertEqual(result['totals']['totalReadBytes'],4*16777216)
        self.assertEqual(result['totals']['totalWrittenBytes'],65536+4*8388608)
        self.assertEqual(result['totals']['reservedFiles'],185)
        self.assertEqual(result['wholeAttempts'],4);self.assertEqual(result['wholeGrant'],0)
        for n in range(1,5):
            receipt=self.read(f'receipt-{n:06d}.json')
            self.assertEqual(receipt['status'],'OK')
            self.assertEqual(set(receipt['chargedIo']),set(('readBytes','writtenBytes','streamInBytes','streamOutBytes','files')))
            q=self.read(f'reserve-{n:06d}.json')['quota']
            for key,amount in receipt['chargedIo'].items(): self.assertLessEqual(amount,q[key])

    def test_real_multisegment_full_prefix_replay(self):
        self.create();one=H.advance(self.directory,1);two=H.advance(self.directory,1000)
        self.assertEqual(one['cursor']['eventCount'],1)
        self.assertEqual(two['segments'],2);self.assertEqual(two['chargedInvocations'],8)
        self.assertEqual(two['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual(two['totals']['checkerInvocations'],4)

    def test_real_chunk_one_streaming(self):
        self.create(dict(chunkBytes=1));result=H.advance(self.directory,1000)
        self.assertEqual(result['verdict'],'TINY_G_VERIFIED_CTB_OPEN')

    def test_real_small_segment_cut_resumes_without_drop(self):
        self.create(dict(segmentBytes=128));last=None
        for _ in range(12):
            last=H.advance(self.directory,1000)
            if last['cursor']['phase']=='TERMINAL': break
        self.assertEqual(last['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertGreater(last['segments'],1)
        for p in self.directory.glob('*-descriptor.json'):
            d=json.loads(p.read_bytes());self.assertLessEqual(d['payloadBytes'],128)
            self.assertEqual(d['endCursor']['eventCount']-d['startCursor']['eventCount'],d['eventCount'])

    def test_inspection_is_metadata_only_no_blob_hash_or_spawn(self):
        self.complete();(self.directory/'segment-000000-events.bin').write_bytes(b'broken')
        with mock.patch.object(H,'run_child',side_effect=AssertionError('spawn')),mock.patch.object(H,'file_chunks',side_effect=AssertionError('blob')):
            result=H.inspect_session(self.directory)
        self.assertTrue(result['metadataOnly']);self.assertFalse(result['semanticVerified']);self.assertFalse(result['blobIntegrityVerified'])

    def test_real_audit_rejects_corrupted_prefix_before_checker(self):
        self.create();H.advance(self.directory,1)
        (self.directory/'segment-000000-events.bin').write_bytes(b'broken')
        with mock.patch.object(H,'run_child',side_effect=AssertionError('spawn')):
            with self.assertRaises(H.Refused): H.advance(self.directory,10)
        self.assertEqual(self.read('receipt-000005.json')['status'],'ERROR')

    def test_recovery_captured_tail_only_new_charged_verify(self):
        self.capture();before=(self.directory/'segment-000000-events.bin').read_bytes()
        result=H.advance(self.directory,1000)
        self.assertEqual(result['chargedInvocations'],4);self.assertEqual(result['verdict'],'TINY_G_VERIFIED_CTB_OPEN')
        self.assertEqual((self.directory/'segment-000000-events.bin').read_bytes(),before)
        self.assertEqual(self.read('reserve-000004.json')['type'],'VERIFY')

    def test_crash_reservation_no_start_stop_no_retry(self):
        self.create();self.crash('after_reservation')
        with self.assertRaises(Crash): H.advance(self.directory)
        self.assertTrue((self.directory/'reserve-000001.json').exists())
        self.assertFalse((self.directory/'start-000001.json').exists())
        H._fault=lambda _:None
        with self.assertRaises(H.Refused): H.advance(self.directory)
        self.assertFalse((self.directory/'reserve-000002.json').exists())

    def test_crash_start_no_receipt_stop(self):
        self.create();self.crash('after_start')
        with self.assertRaises(Crash): H.advance(self.directory)
        H._fault=lambda _:None
        with self.assertRaises(H.Refused): H.advance(self.directory)
        self.assertFalse((self.directory/'receipt-000001.json').exists())

    def test_crash_staging_no_commit_no_rollback(self):
        self.create();self.crash('after_staging')
        with self.assertRaises(Crash): H.advance(self.directory,1000)
        self.assertTrue((self.directory/'segment-000000-descriptor.json').exists())
        self.assertFalse((self.directory/'segment-000000-commit.json').exists())
        H._fault=lambda _:None
        with self.assertRaises(H.Refused): H.advance(self.directory)
        self.assertTrue((self.directory/'segment-000000-events.bin').exists())

    def test_crash_commit_without_terminal_receipt_stop(self):
        self.create();self.crash('after_commit')
        with self.assertRaises(Crash): H.advance(self.directory,1000)
        H._fault=lambda _:None
        with self.assertRaises(H.Refused): H.advance(self.directory)
        self.assertTrue((self.directory/'segment-000000-commit.json').exists())
        self.assertFalse((self.directory/'reserve-000004.json').exists())

    def test_terminal_no_automatic_start(self):
        self.complete();names={p.name:p.read_bytes() for p in self.directory.iterdir()}
        with self.assertRaises(H.Refused): H.advance(self.directory)
        self.assertEqual(names,{p.name:p.read_bytes() for p in self.directory.iterdir()})

    def test_total_admission_precedes_start(self):
        self.create(dict(totalReadBytes=16777216));self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertTrue((self.directory/'reserve-000001.json').exists())
        self.assertFalse((self.directory/'reserve-000002.json').exists())

    def test_global_file_reservation_before_creation(self):
        self.create(dict(files=2));self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertFalse((self.directory/'reserve-000001.json').exists())

    def test_live_byte_reservation_before_creation(self):
        self.create(dict(liveBytes=65536));self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertFalse((self.directory/'reserve-000001.json').exists())

    def test_bootstrap_io_carried_and_lower_cap_rejected(self):
        self.create();header=self.read('header.json');header['limits']['auditReadBytes']=128;self.put('header.json',header)
        self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertFalse((self.directory/'reserve-000001.json').exists())

    def test_bootstrap_finite_deadline_no_reservation(self):
        self.create()
        with mock.patch.object(H.time,'monotonic',side_effect=[0,100]): self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertFalse((self.directory/'reserve-000001.json').exists())

    def test_no_free_final_metadata_walk(self):
        self.create();original=H.metadata_state;calls=[]
        def count(*args): calls.append(args[-1].actual['readBytes']);return original(*args)
        with mock.patch.object(H,'metadata_state',side_effect=count): result=H.advance(self.directory,1000)
        self.assertEqual(len(calls),4);self.assertEqual(result['chargedInvocations'],4)
        self.assertGreater(self.read('receipt-000001.json')['chargedIo']['readBytes'],3*H.SOURCE_BOUND)

    def test_profile_139_denial_before_clock_directory_sources(self):
        with mock.patch.object(H,'directory_fd',side_effect=AssertionError('directory')),mock.patch.object(H.time,'monotonic',side_effect=AssertionError('clock')),mock.patch.object(H,'sources',side_effect=AssertionError('sources')):
            self.assertRaises(H.Refused,H.create_session,self.directory,dict(prime=139,divisor=14,target=13))
            self.assertRaises(H.Refused,H.create_session,self.directory,DOMAIN,profile='P139_RELEASE_DISABLED')

    def test_profile_custom_equality_never_runs(self):
        class Pretend:
            def __eq__(self,_): raise AssertionError('custom equality')
        self.assertRaises(H.Refused,H.profile_spec,Pretend())
        self.assertRaises(H.Refused,H.domain_checked,DOMAIN,Pretend())

    def test_inert_full_contract_defensive_copy(self):
        proposal=H.proposed_contract();self.assertEqual(proposal['status'],'DRAFT_NOT_GRANTED')
        self.assertEqual(proposal['wholeGrant'],0);self.assertEqual(proposal['wholeAttempts'],4)
        self.assertEqual(proposal['limits']['totalWrittenBytes'],2684420096)
        a,b=H.transport_workspace(proposal['limits'],4096*2048)
        self.assertLessEqual(a+b,proposal['limits']['memory'])
        proposal['limits']['invocations']=999
        self.assertEqual(H.proposed_contract()['limits']['invocations'],32)
        self.assertFalse(H.profile_spec('P139_RELEASE_DISABLED')['executionEnabled'])

    def test_default_cli_denies(self):
        result=subprocess.run([sys.executable,'-I','-S','-B',str(PATH)],capture_output=True,timeout=2)
        self.assertNotEqual(result.returncode,0);self.assertIn(b'default CLI',result.stderr)

    def test_memory_transport_lowering_denies_before_popen(self):
        self.create(dict(memory=24*1024*1024))
        with mock.patch.object(H.subprocess,'Popen',side_effect=AssertionError('spawn')): self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertEqual(self.read('receipt-000002.json')['status'],'ERROR')

    def test_exact_limits_bool_float_giant_and_incoherent(self):
        for key,value in [('invocations',True),('nodes',1),('processSeconds',2**10000),('processSeconds',float('nan')),('childSeconds',1),('files',1.0)]:
            with self.subTest(key=key): self.assertRaises(H.Refused,H.limits_checked,{key:value})

    def test_real_child_timeout_preserves_reservation_no_verdict(self):
        self.create(dict(processSeconds=.001));started=time.monotonic()
        self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertLess(time.monotonic()-started,3)
        self.assertEqual(self.read('receipt-000002.json')['status'],'ERROR')
        self.assertEqual(self.read('receipt-000002.json')['verdict'],'REFUSED')
        self.assertTrue((self.directory/'reserve-000002.json').exists())

    def test_source_pin_drift_prevents_spawn(self):
        self.create();header=self.read('header.json');header['pins']['producer']='0'*64;self.put('header.json',header)
        with mock.patch.object(H.subprocess,'Popen',side_effect=AssertionError('spawn')): self.assertRaises(H.Refused,H.advance,self.directory)

    def test_directory_and_file_symlinks_refused(self):
        self.create();link=self.directory/'link';link.symlink_to(self.directory,target_is_directory=True)
        self.assertRaises(H.Refused,H.inspect_session,link)
        link.unlink();(self.directory/'header.json').rename(self.directory/'saved.json');(self.directory/'header.json').symlink_to('saved.json')
        self.assertRaises(H.Refused,H.inspect_session,self.directory)

    def test_hardlinked_file_refused(self):
        self.create();os.link(self.directory/'header.json',self.directory/'linked.json')
        self.assertRaises(H.Refused,H.inspect_session,self.directory)

    def test_exclusive_directory_lock(self):
        self.create();fd=H.directory_fd(self.directory)
        try: self.assertRaises(H.Refused,H.inspect_session,self.directory)
        finally: os.close(fd)

    def test_foreign_orphan_is_stop(self):
        self.create();(self.directory/'foreign.bin').write_bytes(b'evidence')
        self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertEqual((self.directory/'foreign.bin').read_bytes(),b'evidence')

    def test_header_boolean_history_and_float_engine_denied(self):
        self.create();original=self.read('header.json')
        for field in ('history','engineLimits'):
            h=copy.deepcopy(original)
            if field=='history': h[field]['wholeGrant']=False
            else: h[field]['nodes']=100000.0
            self.put('header.json',h);self.assertRaises(H.Refused,H.inspect_session,self.directory)

    def test_receipt_boolean_id_and_unknown_telemetry_denied(self):
        self.complete();original=self.read('receipt-000001.json')
        for changed in (dict(original,id=True),dict(original,chargedIo=dict(original['chargedIo'],unknown=1))):
            self.put('receipt-000001.json',changed);self.assertRaises(H.Refused,H.inspect_session,self.directory)

    def test_json_preparse_rejects_before_parser(self):
        nested=b'['*25+b'0'+b']'*25+b'\n'
        with mock.patch.object(H.json,'loads',side_effect=AssertionError('parser')):
            self.assertRaises(H.Refused,H.decoded,nested,H.DEFAULTS)
            self.assertRaises(H.Refused,H.decoded,b' '*65537,H.DEFAULTS)

    def test_json_duplicate_noncanonical_and_nan(self):
        for raw in (b'{"a":1,"a":2}\n',b'{"a": 1}\n',b'{"a":NaN}\n'):
            self.assertRaises(H.Refused,H.decoded,raw,H.DEFAULTS)

    def test_reader_rejects_overread_nonbytes_truncation(self):
        for callback in (lambda n:b'x'*(n+1),lambda n:bytearray(n),lambda n:b''):
            self.assertRaises(H.Refused,H.Reader(callback,H.DEFAULTS).exact,1)

    def test_reader_huge_frame_denied_before_body(self):
        raw=io.BytesIO(H.frame_head(1,2**63))
        self.assertRaises(H.Refused,H.Reader(raw.read,H.DEFAULTS).meta,1)
        self.assertEqual(raw.tell(),9)

    def test_worker_empty_prefix_is_only_prefix(self):
        self.create();raw=self.work(self.header_packet());reader=H.Reader(io.BytesIO(raw).read,H.DEFAULTS)
        self.assertEqual(reader.exact(len(H.OUTPUT_MAGIC)),H.OUTPUT_MAGIC)
        result=reader.meta(1);self.assertEqual(result['verdict'],'PREFIX_VERIFIED_G_OPEN')
        reader.zero(8);reader.eof()

    def test_worker_default_false_environment(self):
        self.create()
        with mock.patch.dict(os.environ,{key:'false' for key in H.FLAGS}):
            with mock.patch.dict(os.environ,{H.FLAGS[0]:'true'}): self.assertRaises(H.Refused,H.worker,io.BytesIO(self.header_packet()).read,io.BytesIO().write)

    def test_worker_139_control_denied_before_sources(self):
        self.create();raw=self.header_packet(lambda h:h.update(domain=dict(prime=139,divisor=14,target=13)))
        with mock.patch.object(H,'sources',side_effect=AssertionError('source')): self.assertRaises(H.Refused,self.work,raw)

    def test_worker_missing_end_wrong_end_extra_eof(self):
        self.create();valid=self.header_packet()
        for raw in (self.header_packet(ending=False),valid+b'x',valid[:-1],H.INPUT_MAGIC+H.frame(1,H.encoded(dict(header=self.read('header.json'),action='VERIFY',maxEvents=0,cursor=None)))+H.frame(8,b'{}\n')):
            self.assertRaises(H.Refused,self.work,raw)

    def test_worker_short_write_and_boolean_write_count(self):
        self.create()
        for callback in (lambda raw:0,lambda raw:True,lambda raw:None): self.assertRaises(H.Refused,self.work,self.header_packet(),callback)

    def test_rows_mandatory_hash_eof_and_numeric_order(self):
        info=dict(width=2,count=1,sha256=H.sha(b'\x01\x02'))
        reader=H.Reader(io.BytesIO(H.frame(5,b'\x01\x02')).read,H.DEFAULTS)
        rows=H.Rows(reader,5,info,DOMAIN,True);self.assertEqual(next(rows),b'\x01\x02')
        self.assertRaises(StopIteration,next,rows)
        bad=dict(info,sha256='0'*64);rows=H.Rows(H.Reader(io.BytesIO(H.frame(5,b'\x01\x02')).read,H.DEFAULTS),5,bad,DOMAIN)
        next(rows);self.assertRaises(H.Refused,next,rows)

    def test_regular_fstat_failure_always_closes(self):
        self.create();fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS);before=budget.open
        try:
            with mock.patch.object(H.os,'fstat',side_effect=OSError('injected')): self.assertRaises(OSError,H.regular,fd,'header.json',65536,budget)
            self.assertEqual(budget.open,before)
        finally: os.close(fd)

    def test_real_children_exact_isolation_env_and_pinned_body(self):
        self.create();original=H.subprocess.Popen;calls=[]
        def start(args,**kwargs):
            calls.append((args,kwargs));return original(args,**kwargs)
        with mock.patch.object(H.subprocess,'Popen',side_effect=start): H.advance(self.directory,1000)
        self.assertEqual(len(calls),3)
        for args,kwargs in calls:
            self.assertEqual(args[1:5],['-I','-S','-B','-c'])
            self.assertTrue(args[5].startswith('__file__='))
            self.assertIn('WHOLE_G_P139_STREAM_V2',args[5])
            self.assertEqual(kwargs['env'],{key:'false' for key in H.FLAGS})
            self.assertFalse(kwargs['shell']);self.assertTrue(kwargs['close_fds'])

    def test_real_positive_output_bad_exit_never_adopted(self):
        self.create();positive=self.work(self.header_packet())
        body='import sys;sys.stdin.buffer.read();sys.stdout.buffer.write('+repr(positive)+');sys.stdout.buffer.flush();sys.exit(9)'
        with self.injected_child(body): self.assertRaises(H.Refused,H.advance,self.directory,1000)
        self.assertEqual(self.read('receipt-000002.json')['status'],'ERROR')
        self.assertFalse((self.directory/'reserve-000003.json').exists())
        self.assertEqual((self.directory/'spool-000002.bin').read_bytes(),positive)

    def test_real_stderr_retained_and_pre_read_bounded(self):
        self.create(dict(stderrBytes=64))
        body='import sys;sys.stdin.buffer.read();sys.stderr.buffer.write(b"x"*65536);sys.stderr.buffer.flush()'
        observed=[];original=H.os.read
        def read(fd,count): observed.append(count);return original(fd,count)
        with self.injected_child(body),mock.patch.object(H.os,'read',side_effect=read): self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertEqual((self.directory/'stderr-000002.bin').read_bytes(),b'x'*64)
        self.assertEqual(self.read('receipt-000002.json')['status'],'ERROR')
        self.assertIn(1,observed)  # exactly bounded over-cap EOF probe

    def test_real_stdout_overflow_spool_is_bounded(self):
        self.create(dict(streamOutBytes=64))
        body='import sys;sys.stdin.buffer.read();sys.stdout.buffer.write(b"x"*65536);sys.stdout.buffer.flush()'
        with self.injected_child(body): self.assertRaises(H.Refused,H.advance,self.directory)
        self.assertEqual((self.directory/'spool-000002.bin').stat().st_size,64)
        receipt=self.read('receipt-000002.json');self.assertEqual(receipt['status'],'ERROR')
        self.assertEqual(receipt['chargedIo']['streamOutBytes'],64)

    def test_real_timeout_closes_lazy_input_generator(self):
        self.create(dict(processSeconds=.02));fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS,'VERIFY')
        header=self.read('header.json');header['limits']['processSeconds']=.02
        closed=[]
        def inputs():
            try:
                for _ in range(100): yield b'x'*65536
            finally: closed.append(True)
        body='import sys,time;sys.stdin.buffer.read(1);time.sleep(2)'
        try:
            with self.injected_child(body): self.assertRaises(H.Refused,H.run_child,fd,'spool-fixture.bin',inputs(),header,budget)
            self.assertEqual(closed,[True]);self.assertEqual(budget.open,4)
        finally: os.close(fd)

    def test_coherently_rehashed_invalid_event_rejected_by_independent_child(self):
        self.create();H.advance(self.directory,1)
        payload=bytearray((self.directory/'segment-000000-events.bin').read_bytes());payload[4]^=1
        (self.directory/'segment-000000-events.bin').write_bytes(payload)
        d=self.read('segment-000000-descriptor.json');d['payloadSha256']=H.sha(payload);self.put('segment-000000-descriptor.json',d)
        c=self.read('segment-000000-commit.json');c['descriptorSha256']=H.sha(H.encoded(d));self.put('segment-000000-commit.json',c)
        tail=H.sha(H.encoded(c))
        r3=self.read('receipt-000003.json');r3['commitSha256']=tail;self.put('receipt-000003.json',r3)
        r=self.read('reserve-000004.json');r['predecessor']=tail;self.put('reserve-000004.json',r)
        rh=H.sha(H.encoded(r));s=self.read('start-000004.json');s['reservationSha256']=rh;self.put('start-000004.json',s)
        rec=self.read('receipt-000004.json');rec.update(reservationSha256=rh,startSha256=H.sha(H.encoded(s)),commitSha256=tail);self.put('receipt-000004.json',rec)
        self.assertRaises(H.Refused,H.advance,self.directory,1000)
        self.assertEqual(self.read('receipt-000005.json')['status'],'OK')
        self.assertEqual(self.read('receipt-000006.json')['status'],'ERROR')
        self.assertFalse((self.directory/'reserve-000007.json').exists())

    def test_worker_over_segment_cap_denies_before_next_payload(self):
        self.create();H.advance(self.directory,1)
        fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS,'VERIFY')
        try:
            header,hh=H.header(fd,budget);state=H.metadata_state(fd,header,hh,budget)
            header['limits']['segments']=1;hh=H.sha(H.encoded(header))
            # Deliberate framing fixture: repeated second COMMIT tag only; the
            # cap must reject before trying to parse its absent body.
            packet=b''.join(H.input_stream(fd,state,self.read('header.json'),H.sha(H.encoded(self.read('header.json'))),'VERIFY',0,None,budget))
            end=H.frame(8,H.encoded(dict(segments=state['segments'],tail=state['tail'],headerSha256=H.sha(H.encoded(self.read('header.json'))))))
            packet=packet[:-len(end)]+H.frame_head(2,999999)
            # Set active tiny cap via declared lowered CONTROL, while keeping
            # old hashes coherently rebuilt requires more than this fixture;
            # call replay seam on its own validated chain with explicit cap.
            original=self.read('header.json');engine_spec=importlib.util.spec_from_file_location('checker075dfixture',PATH.parent/H.NAMES['checker'])
            checker=importlib.util.module_from_spec(engine_spec);engine_spec.loader.exec_module(checker)
            replay=H.Reader(io.BytesIO(packet[len(H.INPUT_MAGIC)+len(H.frame(1,H.encoded(dict(header=original,action='VERIFY',maxEvents=0,cursor=None)))):]).read,H.DEFAULTS)
            with self.assertRaisesRegex(H.Refused,'before payload'):
                H._worker_input(replay,dict(original,limits=dict(original['limits'],segments=1)),H.sha(H.encoded(original)),checker.Verifier(**DOMAIN),True)
        finally: os.close(fd)

    def test_all_total_and_engine_pool_dimensions_lower_only(self):
        cases={
            'invocations':1,'auditInvocations':1,'producerInvocations':1,'checkerInvocations':1,
            'producerNodes':99999,'producerEvents':199999,'producerExtensions':49999,'producerEngineSeconds':9,
            'checkerNodes':99999,'checkerEvents':199999,'checkerExtensions':49999,'checkerEngineSeconds':9,
            'totalReadBytes':1,'totalWrittenBytes':65536,'totalStreamInBytes':1,'totalStreamOutBytes':1,
            'totalSeconds':1,'reservedFiles':1,'segments':1,'phaseFiles':1,'childReadBytes':200000,
            'streamInBytes':1,'streamOutBytes':1,'openDescriptors':8,
        }
        original=self.directory
        try:
            for key,value in cases.items():
                with self.subTest(dimension=key):
                    self.directory=original/key;self.directory.mkdir(mode=0o700)
                    self.create({key:value})
                    if key in ('auditInvocations','producerInvocations','segments'):
                        H.advance(self.directory,1)
                    self.assertRaises(H.Refused,H.advance,self.directory,1)
                    # All durable reservations, including denied terminal/error
                    # paths, are preserved; no automatic refund or cleanup.
                    for reservation in self.directory.glob('reserve-*.json'):
                        q=json.loads(reservation.read_bytes())['quota']
                        self.assertEqual(q['readBytes'],self.read('header.json')['limits']['auditReadBytes' if json.loads(reservation.read_bytes())['type']=='HOST_AUDIT' else 'childReadBytes'])
                    if key=='segments': self.assertFalse((self.directory/'reserve-000007.json').exists())
        finally: self.directory=original

    def test_actual_fifo_refused_without_opening_payload(self):
        self.create();os.mkfifo(self.directory/'inert.fifo',0o600)
        self.assertRaises(H.Refused,H.inspect_session,self.directory)

    def test_actual_parent_symlink_refused(self):
        self.create();nested=self.directory/'nested';nested.mkdir(mode=0o700)
        alias=self.directory/'parent-link';alias.symlink_to(self.directory,target_is_directory=True)
        self.assertRaises(H.Refused,H.inspect_session,alias/'nested')

    def test_postchild_source_drift_rejects_positive_spool(self):
        self.create();fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS,'VERIFY');header=self.read('header.json');original=H.sources;calls=[]
        def changed(b):
            result=original(b);calls.append(True)
            if len(calls)==2: result['producer']+=b'\n# controlled own-byte pin drift\n'
            return result
        try:
            with mock.patch.object(H,'sources',side_effect=changed):
                self.assertRaisesRegex(H.Refused,'postchild source drift',H.run_child,fd,'spool-fixture.bin',iter([self.header_packet()]),header,budget)
            self.assertTrue((self.directory/'spool-fixture.bin').read_bytes().startswith(H.OUTPUT_MAGIC))
            self.assertEqual(budget.open,4)
        finally: os.close(fd)

    def test_fsync_failure_closes_spool_selector_and_pipes(self):
        self.create();fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS,'VERIFY');header=self.read('header.json');original=H.os.fsync;calls=[]
        def broken(handle):
            calls.append(handle)
            if len(calls)==1: raise OSError('injected final spool fsync')
            return original(handle)
        try:
            with mock.patch.object(H.os,'fsync',side_effect=broken): self.assertRaises(OSError,H.run_child,fd,'spool-fixture.bin',iter([self.header_packet()]),header,budget)
            self.assertEqual(budget.open,4)
            self.assertTrue((self.directory/'spool-fixture.bin').exists())
        finally: os.close(fd)

    def test_receipt_partial_actual_write_preserves_exact_charged_snapshot(self):
        self.create();fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS);header,hh=H.header(fd,budget)
        try:
            num,rh,sh,state,budget=H.reserve(fd,header,hh,'HOST_AUDIT',budget)
            original=H.os.write
            def partial(handle,data): return original(handle,data[:7])
            with mock.patch.object(H.os,'write',side_effect=partial): H.receipt(fd,header,num,rh,sh,'OK',state['tail'],'AUDITED_CAPTURED_G_OPEN',budget)
            self.assertEqual(self.read('receipt-000001.json')['chargedIo'],budget.actual)
            self.assertEqual(self.read('reserve-000001.json')['quota']['writtenBytes'],8388608)
        finally: os.close(fd)

    def test_eof_requires_exact_bytes_not_false_like(self):
        for value in (None,bytearray(),False,0): self.assertRaises(H.Refused,H.Reader(lambda n:value,H.DEFAULTS).eof)

    def test_worker_reordered_and_unknown_frames(self):
        self.create();packet=self.header_packet();marker=packet.index(H.frame_head(8,len(H.encoded(dict(segments=0,tail=H.sha(H.encoded(self.read('header.json'))),headerSha256=H.sha(H.encoded(self.read('header.json'))))))))
        for tag in (4,5,6,7,99):
            with self.subTest(tag=tag): self.assertRaises(H.Refused,self.work,packet[:marker]+H.frame(tag,b'')+packet[marker:])

    def test_selector_close_failure_still_closes_all_real_resources(self):
        self.create();fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS,'VERIFY');header=self.read('header.json')
        original=H.selectors.DefaultSelector;pop=H.subprocess.Popen;processes=[];closed=[]
        def selector():
            value=original();close=value.close
            def broken(): close();raise OSError('injected selector cleanup')
            value.close=broken;return value
        def start(*args,**kwargs):
            value=pop(*args,**kwargs);processes.append(value);return value
        packet=self.header_packet()
        def inputs():
            try: yield packet
            finally: closed.append(True)
        try:
            with mock.patch.object(H.selectors,'DefaultSelector',side_effect=selector),mock.patch.object(H.subprocess,'Popen',side_effect=start):
                self.assertRaises(OSError,H.run_child,fd,'spool-fixture.bin',inputs(),header,budget)
            self.assertEqual(closed,[True]);self.assertEqual(budget.open,4)
            self.assertTrue(all(stream.closed for p in processes for stream in (p.stdin,p.stdout,p.stderr)))
            self.assertTrue(all(p.poll() is not None for p in processes))
        finally: os.close(fd)

    def test_real_prefix_cursor_snapshot_framing_mutations_both_actions(self):
        self.create();H.advance(self.directory,20)
        fd=H.directory_fd(self.directory);budget=H.Io(H.DEFAULTS,'VERIFY')
        try:
            header,hh=H.header(fd,budget);state=H.metadata_state(fd,header,hh,budget)
            for action in ('VERIFY','GENERATE'):
                packet=b''.join(H.input_stream(fd,state,header,hh,action,0 if action=='VERIFY' else 3,None if action=='VERIFY' else state['lastCursor'],budget))
                frames=[];offset=len(H.INPUT_MAGIC)
                while offset<len(packet):
                    tag=packet[offset];length=struct.unpack_from('<Q',packet,offset+1)[0];offset+=9
                    frames.append([tag,packet[offset:offset+length]]);offset+=length
                self.assertTrue(self.work(packet).startswith(H.OUTPUT_MAGIC))
                for alteration in ('cursor','table-extra','data-truncated','reordered'):
                    with self.subTest(action=action,mutation=alteration):
                        changed=copy.deepcopy(frames)
                        if alteration=='cursor':
                            d=json.loads(changed[2][1]);d['endCursor']['eventCount']+=1;changed[2][1]=H.encoded(d)
                            c=json.loads(changed[1][1]);c['descriptorSha256']=H.sha(changed[2][1]);changed[1][1]=H.encoded(c)
                            end=json.loads(changed[-1][1]);end['tail']=H.sha(changed[1][1]);changed[-1][1]=H.encoded(end)
                        elif alteration=='table-extra':
                            table=next(f for f in changed if f[0]==5);table[1]+=b'\x01'
                        elif alteration=='data-truncated':
                            data=next(f for f in changed if f[0]==6);self.assertTrue(data[1]);data[1]=data[1][:-1]
                        else:
                            indexes=[i for i,f in enumerate(changed) if f[0] in (5,6)];changed[indexes[0]],changed[indexes[-1]]=changed[indexes[-1]],changed[indexes[0]]
                        corrupt=H.INPUT_MAGIC+b''.join(H.frame(tag,body) for tag,body in changed)
                        # Independent checker translates foreign transport
                        # exceptions into its own poisoned VerificationRefused;
                        # both deliberately separate classes inherit ValueError.
                        self.assertRaises(ValueError,self.work,corrupt)
        finally: os.close(fd)

if __name__=='__main__': unittest.main(verbosity=2)
