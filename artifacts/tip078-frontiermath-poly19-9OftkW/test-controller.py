#!/usr/bin/env python3
"""ENGINEERING_ONLY deterministic fakes. Never invokes codex or real model."""
import argparse
import contextlib
import datetime as dt
import importlib.util
import io as textio
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import time
import unittest

BASE = Path(__file__).parent
def mod(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), BASE/(name+'.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

controller, review, extract = mod('run-study'), mod('prepare-review'), mod('extract-candidate')
io = controller.io

class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='tip078-ENGINEERING_ONLY-', dir='/private/tmp')
        self.root = Path(self.tmp.name)
        self.now = 1000.0
        self.utc = 1800000000.0
        self.calls, self.preparations = [], []
        self.duration, self.trace, self.tool = 10, 100, 0
        self.failure = None
        pins = {}
        for name in controller.SOURCES:
            raw = (BASE/name).read_bytes()
            (self.root/name).write_bytes(raw)
            pins[name] = io.sha(raw)
        for name in ['common-policy.txt', 'direct-policy.txt', 'method-policy.txt', 'poly19.txt', 'review-policy.txt', 'math-bridge.txt']:
            raw = ('ENGINEERING_ONLY '+name).encode()
            (self.root/name).write_bytes(raw)
            pins[name] = io.sha(raw)
        self.reg = {'study': io.STUDY, 'pins': pins, 'cohortSeconds': 2700,
                    'admissionUtc': dt.datetime.fromtimestamp(self.utc, dt.timezone.utc).isoformat()}
        self.register()
    def tearDown(self):
        self.tmp.cleanup()
    def register(self):
        raw = json.dumps(self.reg).encode()
        (self.root/'registration.json').write_bytes(raw)
        self.sha = io.sha(raw)
    def prepare(self, root, name, args, timeout=30):
        self.preparations.append((name, args))
        self.now += 1
        # No CLI/helper execution: deterministic operator-only stub.
    def dispatch(self, root, prompt, directory, identity, ordinal, remaining):
        self.calls.append((identity, ordinal, remaining))
        directory.mkdir()
        duration = self.duration(ordinal) if callable(self.duration) else self.duration
        self.now += duration
        raw = b'ENGINEERING_ONLY original\n```json\n{"coefficients":[],"claimed_value":0}\n```\n'
        (directory/'original-final.txt').write_bytes(raw)
        receipt = {'session': identity, 'requestOrdinal': ordinal, 'requestConsumed': True,
                   'reservedBeforeSpawn': True, 'outcome': self.failure or 'CAPTURED_ORIGINAL_UNGRADED',
                   'cancellationEffect': 'UNKNOWN' if self.failure else None, 'exitCode': 0,
                   'observedToolCount': self.tool, 'observedToolSeconds': 0, 'activeToolCountAtStop': 0,
                   'capturedBytes': {'stdout': self.trace}, 'endedMonotonic': self.now,
                   'originalFinalSha256': io.sha(raw), 'originalFinalBytes': len(raw)}
        io.create(directory/'receipt.json', receipt)
        return receipt
    def runfake(self):
        with contextlib.redirect_stdout(textio.StringIO()):
            return controller.run(self.root, self.sha, dispatch=self.dispatch, prepare=self.prepare,
                                  clock=lambda: self.now, utc=lambda: self.utc)
    def review_args(self, number):
        return argparse.Namespace(registration_sha=self.sha, reviewer=number,
                remaining_seconds=480, remaining_tools=4, remaining_tool_seconds=120, remaining_trace_bytes=524288)
    def test_all_eight_distinct_order(self):
        self.assertEqual(self.runfake(), 0)
        self.assertEqual([c[1] for c in self.calls], list(range(1,9)))
        self.assertEqual(self.calls[2][0], 'POLY19_DIRECT_FINAL')
        self.assertEqual(self.calls[5][0], 'POLY19_METHOD_FINAL')
        self.assertLess(self.calls[2][2]['seconds'], self.calls[0][2]['seconds'])
        self.assertLess(self.calls[7][2]['seconds'], self.calls[6][2]['seconds'])
    def test_no_restart(self):
        self.runfake()
        with self.assertRaises(FileExistsError):
            self.runfake()
        self.assertEqual(len(self.calls), 8)
    def test_future_admission(self):
        self.reg['admissionUtc'] = dt.datetime.fromtimestamp(self.utc+1,dt.timezone.utc).isoformat()
        self.register()
        with self.assertRaises(controller.Stop):
            self.runfake()
        self.assertEqual(self.calls, [])
    def test_expired_admission(self):
        self.reg['admissionUtc'] = dt.datetime.fromtimestamp(self.utc-2701,dt.timezone.utc).isoformat()
        self.register()
        with self.assertRaises(controller.Stop):
            self.runfake()
    def test_admission_remaining_not_refresh(self):
        self.reg['admissionUtc'] = dt.datetime.fromtimestamp(self.utc-2600,dt.timezone.utc).isoformat()
        self.register()
        self.assertEqual(self.runfake(), 0)
        self.assertLessEqual(self.calls[0][2]['seconds'], 100)
    def test_source_tamper_before_dispatch(self):
        (self.root/'run-session.py').write_bytes(b'TAMPER')
        with self.assertRaises(ValueError):
            self.runfake()
        self.assertEqual(self.calls, [])
    def test_unknown_capture_stops_no_retry(self):
        self.failure = 'OUTER_DEADLINE'
        self.assertEqual(self.runfake(), 2)
        self.assertEqual(len(self.calls), 1)
    def test_arm_deadline_never_refresh(self):
        self.duration = 200
        self.assertEqual(self.runfake(), 2)
        self.assertEqual(len(self.calls), 3)
    def test_review_shared_deadline(self):
        self.duration = lambda ordinal: 10 if ordinal <=6 else 240
        self.assertEqual(self.runfake(), 2)
        self.assertEqual(len(self.calls), 8)
    def test_cumulative_tools(self):
        self.tool = 5
        self.assertEqual(self.runfake(), 2)
        self.assertEqual(self.calls[2][2]['tool_limit'], 2)
    def test_cumulative_trace(self):
        self.trace = 200000
        self.assertEqual(self.runfake(), 2)
        self.assertEqual(self.calls[2][2]['trace_cap'], 124288)
    def test_both_finals_before_review(self):
        a = self.review_args(1)
        with self.assertRaises(FileNotFoundError):
            review.build(a, self.root)
    def test_blinded_projection_no_bridge_first(self):
        self.runfake()
        a = self.review_args(1)
        prompt, meta = review.build(a, self.root)
        self.assertNotIn(b'ENGINEERING_ONLY math-bridge.txt', prompt)
        self.assertEqual(meta['mapping'], {'X':'METHOD','Y':'DIRECT'})
        self.assertNotIn(b'POLY19_DIRECT_FINAL', prompt)
    def test_second_review_bridge_only_no_prior(self):
        self.runfake()
        a = self.review_args(2)
        prompt, meta = review.build(a, self.root)
        self.assertIn(b'ENGINEERING_ONLY math-bridge.txt', prompt)
        self.assertFalse(meta['priorGraderExposure'])
    def test_tampered_final_refused(self):
        self.runfake()
        (self.root/'poly19-method-final'/'original-final.txt').write_bytes(b'TAMPER')
        with self.assertRaises(ValueError):
            io.finals(self.root)
    def test_exact_extraction_preserves_bytes(self):
        self.assertEqual(extract.extract(b'A\n```json\n {"claimed_value": 0}\n```\n'),b' {"claimed_value": 0}\n')
    def test_duplicate_key_refused(self):
        with self.assertRaises(ValueError):
            extract.extract(b'```json\n{"a":1,"a":2}\n```\n')
    def test_multiple_blocks_refused(self):
        with self.assertRaises(ValueError):
            extract.extract(b'```json\n{}\n```\n```json\n{}\n```\n')
    def test_no_fence_no_candidate_guess(self):
        with self.assertRaises(ValueError):
            extract.extract(b'{"coefficients":[]}')
    def test_oversize_refused(self):
        with self.assertRaises(ValueError):
            extract.extract(b'```json\n"'+b'x'*16385+b'"\n```\n')
    def test_symlink_input_refused(self):
        path = self.root/'symlink'
        path.symlink_to(self.root/'registration.json')
        with self.assertRaises(OSError):
            io.read(path, 16384)
    def test_float_accounting_refused(self):
        budget=controller.Budget(100,12)
        with self.assertRaises(controller.Stop):
            budget.debit({'outcome':'CAPTURED_ORIGINAL_UNGRADED','observedToolCount':False,
                          'observedToolSeconds':0,'capturedBytes':{'stdout':0}})
    def test_helper_failure_not_consumed_request(self):
        def failprepare(root,name,args,timeout=30):
            if '--stage' in args and args[args.index('--stage')+1]=='CRITIC':
                raise controller.Stop('ENGINEERING helper refusal')
            self.prepare(root,name,args,timeout)
        with contextlib.redirect_stdout(textio.StringIO()):
            self.assertEqual(controller.run(self.root,self.sha,dispatch=self.dispatch,prepare=failprepare,
                              clock=lambda:self.now,utc=lambda:self.utc),2)
        last = sorted(self.root.glob('controller-*.json'))[-1]
        event = json.loads(last.read_text())
        self.assertEqual(event['requestsConsumed'],1)
        self.assertEqual(event['slotsReserved'],1)
        self.assertEqual(event['failedSlotOrdinal'],2)
    def test_actual_argparse_and_prompt_helper_across_fake_roles(self):
        shim = ('import importlib.util,sys; from pathlib import Path; '
                'spec=importlib.util.spec_from_file_location("helper",sys.argv[1]); '
                'm=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); '
                'm.ROOT=Path(sys.argv[2]); sys.argv=[sys.argv[1]]+sys.argv[3:]; m.main()')
        def prepare(root,name,args,timeout=30):
            if name=='prepare-prompt.py':
                proc=subprocess.run([sys.executable,'-I','-B','-c',shim,str(BASE/name),str(root),*args],
                                    capture_output=True,timeout=5)
                if proc.returncode:
                    raise AssertionError(proc.stderr.decode())
                out=Path(args[args.index('--out')+1])
                self.assertIn(b'Remaining cumulative computational commands',out.read_bytes())
            self.prepare(root,name,args,timeout)
        with contextlib.redirect_stdout(textio.StringIO()):
            self.assertEqual(controller.run(self.root,self.sha,dispatch=self.dispatch,prepare=prepare,
                              clock=lambda:self.now,utc=lambda:self.utc),0)
    def fake_capture(self, cancel=False):
        # Copy-under-test changes ONLY the exact fixture root, never old sources.
        source=(BASE/'run-session.py').read_text().replace(str(BASE),str(self.root))
        script=self.root/'fake-root-run-session.py'
        script.write_text(source)
        prompt=self.root/'ENGINEERING-prompt.txt'
        prompt.write_text('ENGINEERING_CANCEL' if cancel else 'ENGINEERING_ONLY')
        output=self.root/'ENGINEERING-output'
        argv=[sys.executable,'-I','-B',str(script),'--prompt',str(prompt),'--out',str(output),
              '--ordinal','1','--session','ENGINEERING_ONLY','--seconds','2','--tool-limit','0',
              '--tool-seconds','0','--trace-cap','524288','--codex',str(BASE/'ENGINEERING-fake-cli.py')]
        env={**os.environ,'OPENAI_API_KEY':'ENGINEERING_NOT_A_REAL_KEY'}
        proc=subprocess.Popen(argv,stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env)
        if cancel:
            end=time.monotonic()+1
            while time.monotonic()<end:
                trace=output/'stdout.jsonl'
                if trace.exists() and trace.stat().st_size>0:
                    break
                time.sleep(.01)
            proc.send_signal(signal.SIGTERM)
        stdout,stderr=proc.communicate(timeout=5)
        self.assertEqual(proc.returncode,2 if cancel else 0,stderr.decode())
        return json.loads((output/'receipt.json').read_text())
    def test_real_capture_fake_executable_original_usage_env(self):
        receipt=self.fake_capture()
        self.assertEqual(receipt['outcome'],'CAPTURED_ORIGINAL_UNGRADED')
        self.assertEqual(receipt['cliReportedUsage']['input_tokens'],1)
        self.assertEqual(receipt['servedModelVersion'],'UNKNOWN')
    def test_real_capture_fake_executable_sigterm_cleanup(self):
        receipt=self.fake_capture(True)
        self.assertEqual(receipt['outcome'],'CANCELLED_SIGTERM')
        self.assertEqual(receipt['cancellationEffect'],'UNKNOWN')
    def call_actual_helper(self, name, args):
        # Test-only process shim rebinds trusted helper root to isolated fixtures.
        shim = ('import importlib.util,sys; from pathlib import Path; '
                'spec=importlib.util.spec_from_file_location("helper",sys.argv[1]); '
                'm=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); '
                'root=Path(sys.argv[2]); m.ROOT=root; '
                'm.io.ROOT=root; '
                'old=getattr(m,"build",None); '
                'm.build=(lambda a: old(a,root)) if old else None; '
                'sys.argv=[sys.argv[1]]+sys.argv[3:]; result=m.main(); '
                'sys.exit(result if isinstance(result,int) else 0)')
        return subprocess.run([sys.executable,'-I','-B','-c',shim,str(BASE/name),str(self.root),*args],
                              capture_output=True,timeout=31)
    def test_actual_review_argparse_both_bridge_policies(self):
        self.runfake()
        for number in [1,2]:
            out=self.root/f'ENGINEERING-review{number}.txt'
            proc=self.call_actual_helper('prepare-review.py',['--reviewer',str(number),
                  '--registration-sha',self.sha,'--out',str(out),'--remaining-seconds','300',
                  '--remaining-tools','3','--remaining-tool-seconds','90','--remaining-trace-bytes','400000'])
            self.assertEqual(proc.returncode,0,proc.stderr.decode())
            content=out.read_bytes()
            self.assertEqual(b'ENGINEERING_ONLY math-bridge.txt' in content,number==2)
            self.assertIn(b'Remaining cumulative commands 3',content)
            self.assertNotIn(b'POLY19_REVIEW_1',content)
    def exact_engineering_finals(self, wrong_value=False):
        self.runfake()
        # Recurrence-generated ENGINEERING control, not a solver submission.
        a,b=[2],[0,1]
        for _ in range(2,20):
            c=[0]+b
            for i,value in enumerate(a):
                c[i]-=value
            a,b=b,c
        value=0
        for coefficient in reversed(b):
            value=value*19+coefficient
        if wrong_value:
            value+=1
        candidate=json.dumps({'coefficients':b,'claimed_value':value}).encode()
        original=b'ENGINEERING_ONLY\n```json\n'+candidate+b'\n```\n'
        for arm in ['direct','method']:
            directory=self.root/f'poly19-{arm}-final'
            (directory/'original-final.txt').write_bytes(original)
            receipt=json.loads((directory/'receipt.json').read_text())
            receipt['originalFinalSha256']=io.sha(original)
            receipt['originalFinalBytes']=len(original)
            (directory/'receipt.json').write_text(json.dumps(receipt))
    def test_actual_extract_and_exact_replay_subprocess(self):
        self.exact_engineering_finals()
        proc=self.call_actual_helper('extract-candidate.py',['--arm','DIRECT','--registration-sha',self.sha])
        self.assertEqual(proc.returncode,0,proc.stderr.decode())
        proc=self.call_actual_helper('replay-candidate.py',['--arm','DIRECT','--registration-sha',self.sha,'--seconds','30'])
        self.assertEqual(proc.returncode,0,proc.stderr.decode())
        result=json.loads((self.root/'direct-replay-stdout.json').read_text())
        self.assertEqual(result['status'],'VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION')
        receipt=json.loads((self.root/'direct-replay-receipt.json').read_text())
        self.assertEqual(receipt['exitCode'],0)
        self.assertLess(receipt['elapsedSeconds'],30)
    def test_actual_replay_exit2_is_retained_not_controller_failure(self):
        self.exact_engineering_finals(True)
        proc=self.call_actual_helper('extract-candidate.py',['--arm','METHOD','--registration-sha',self.sha])
        self.assertEqual(proc.returncode,0,proc.stderr.decode())
        proc=self.call_actual_helper('replay-candidate.py',['--arm','METHOD','--registration-sha',self.sha,'--seconds','30'])
        self.assertEqual(proc.returncode,0,proc.stderr.decode())
        result=json.loads((self.root/'method-replay-stdout.json').read_text())
        self.assertEqual(result['status'],'REJECTED')
        receipt=json.loads((self.root/'method-replay-receipt.json').read_text())
        self.assertEqual(receipt['exitCode'],2)

if __name__ == '__main__':
    unittest.main()
