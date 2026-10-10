#!/usr/bin/env python3
"""075E source/command-bound release host. Bare metadata never grants p139."""
import argparse
import copy
import fcntl
import hashlib
import itertools
import json
import math
import os
from pathlib import Path
import selectors
import stat
import struct
import subprocess
import sys
import time

P139_EXECUTION_ENABLED = False
FLAGS = ('RESEARCH_WORKER_ENABLED','MATH_PILOT_QUEUE_ENABLED','LRC_CAMPAIGN_LOCAL_ENABLED',
         'RESEARCH_OPENAI_ENABLED','RESEARCH_CODEX_LOCAL_ENABLED','SANDBOX_DOCKER_ENABLED')
SOURCE_BOUND = 131072
INPUT_MAGIC,OUTPUT_MAGIC = b'LRC139S3\n',b'LRC139O3\n'
ROOT = 'LRC_P139_REPRODUCTION_075'
HISTORY = dict(wholeAttempts=4,wholeGrant=0,predecessorSha256='1b9fe5424e499ac0dcb7c7f8b4d40240755a739379044027aab9f9e23a181e1f')
ENGINE = dict(nodes=100000,events=200000,extensions=50000,rows=10000,bytes=2097152,memory=67108864,seconds=10)
FULL_ENGINE = dict(nodes=20000000,events=40000000,extensions=1000000,rows=100000,bytes=268435456,memory=536870912,seconds=600)
DEFAULTS = dict(invocations=128,auditInvocations=32,producerInvocations=32,checkerInvocations=64,segments=32,
 producerNodes=3200000,producerEvents=6400000,producerExtensions=1600000,producerEngineSeconds=320,
 checkerNodes=6400000,checkerEvents=12800000,checkerExtensions=3200000,checkerEngineSeconds=640,
 totalReadBytes=2147483648,totalWrittenBytes=1073807360,totalStreamInBytes=1610612736,
 totalStreamOutBytes=402653184,totalSeconds=3776,reservedFiles=5889,auditReadBytes=16777216,
 auditWrittenBytes=8388608,auditSeconds=22,auditScanSeconds=10,childReadBytes=16777216,
 childWrittenBytes=8388608,childSeconds=32,processSeconds=20,streamInBytes=16777216,
 streamOutBytes=4194304,phaseFiles=46,liveBytes=134217728,files=8192,metadataBytes=65536,
 chunkBytes=65536,segmentBytes=65536,stderrBytes=8192,openDescriptors=16,memory=67108864)
FULL = dict(DEFAULTS,invocations=32,auditInvocations=8,producerInvocations=8,checkerInvocations=16,segments=8,
 producerNodes=160000000,producerEvents=320000000,producerExtensions=8000000,producerEngineSeconds=4800,
 checkerNodes=320000000,checkerEvents=640000000,checkerExtensions=16000000,checkerEngineSeconds=9600,
 totalReadBytes=34359738368,totalWrittenBytes=2684420096,totalStreamInBytes=12884901888,
 totalStreamOutBytes=905969664,totalSeconds=17184,reservedFiles=1473,auditReadBytes=1073741824,
 auditWrittenBytes=83886080,auditSeconds=132,auditScanSeconds=120,childReadBytes=1073741824,
 childWrittenBytes=83886080,childSeconds=672,processSeconds=660,streamInBytes=536870912,
 streamOutBytes=37748736,liveBytes=3221225472,files=4096,segmentBytes=33554432,memory=134217728)
NAMES = dict(producer='attempt-lrc-p139-generation-v5.py',checker='verify-lrc-p139-g-release.py',host=Path(__file__).name)
REPOSITORY=Path(__file__).absolute().parents[2]
GRANT_FILE=REPOSITORY/'artifacts/research/lrc-p139-attempt5-grant.json'
EVIDENCE_DIR=REPOSITORY/'artifacts/research/lrc-p139-attempt5'
REVIEW_FILE=REPOSITORY/'docs/verification/TIP-075E_R1_MAIN_COMPLETION.md'
RESOURCE_FILE=REPOSITORY/'docs/contractor/RESOURCE_TIP-075E_P139_RELEASE.md'
RESOURCE_SHA='3da8f104d04bbfecb4e2a62d034a3c48802b032d1a59e0b84f91fc0c2db3864a'
FULL_DOMAIN=dict(prime=139,divisor=14,target=13)
FULL_HISTORY=dict(HISTORY,wholeAttempts=5,wholeGrant=1)
_AUTH_MARKER=object()
_fault = lambda point: None

class Refused(ValueError):
    pass

def fail(reason):
    raise Refused(str(reason)[:200])

def integer(value,low=0,high=2**63-1):
    if type(value) is not int or not low<=value<=high:
        fail('integer type/range')
    return value

def keys(value,wanted):
    if type(value) is not dict or set(value)!=set(wanted):
        fail('exact keys')

def encoded(obj):
    try:
        return (json.dumps(obj,sort_keys=True,separators=(',',':'),ensure_ascii=True,allow_nan=False)+'\n').encode('ascii')
    except (TypeError,ValueError,RecursionError):
        fail('metadata encoding')

def sha(data):
    return hashlib.sha256(data).hexdigest()

def digest(value):
    if type(value) is not str or len(value)!=64 or any(c not in '0123456789abcdef' for c in value):
        fail('digest shape')

def pairs(items):
    obj = {}
    for key,val in items:
        if key in obj:
            fail('duplicate JSON key')
        obj[key]=val
    return obj

def decoded(raw,lim):
    if len(raw)>lim['metadataBytes'] or 128*len(raw)+4194304>lim['memory']:
        fail('metadata allocation bound')
    depth=tokens=0
    quoted=escaped=False
    for c in raw:
        if quoted:
            if escaped: escaped=False
            elif c==92: escaped=True
            elif c==34: quoted=False
        elif c==34: quoted=True;tokens+=1
        elif c in (123,91):
            depth+=1;tokens+=1
            if depth>24: fail('metadata depth')
        elif c in (125,93):
            depth-=1
            if depth<0: fail('metadata nesting')
        elif c in (44,58): tokens+=1
        if tokens>50000: fail('metadata tokens')
    if depth or quoted: fail('metadata incomplete')
    try:
        obj=json.loads(raw,object_pairs_hook=pairs,parse_constant=lambda _:fail('nonfinite'))
    except (ValueError,UnicodeError,RecursionError):
        fail('metadata parse')
    if encoded(obj)!=raw: fail('noncanonical metadata')
    return obj

def limits_checked(raw,authority=None):
    if authority is not None:
        _authority_alive(authority)
        if encoded(raw)!=encoded(FULL): fail('exact fixed full host caps')
        return FULL.copy()
    if raw is None: return DEFAULTS.copy()
    if type(raw) is not dict or not set(raw)<=set(DEFAULTS): fail('host limit keys')
    result=DEFAULTS.copy()
    for key,val in raw.items():
        if 'Seconds' in key or key in ('totalSeconds','auditSeconds','childSeconds'):
            if type(val) not in (int,float) or not 0<val<=DEFAULTS[key] or not math.isfinite(val): fail('host time limit')
        else: integer(val,1,DEFAULTS[key])
        result[key]=val
    if result['childSeconds']<result['processSeconds']+12 or result['auditSeconds']<result['auditScanSeconds']+12: fail('incoherent time allowance')
    if result['openDescriptors']<8 or result['chunkBytes']<1: fail('descriptor/chunk allowance')
    return result

def profile_spec(profile='BUILD_TINY'):
    if type(profile) is not str: fail('profile type')
    if profile=='BUILD_TINY':
        return dict(profile=profile,domain=dict(prime=[3,23],divisor=[2,24],target=[1,5]),bounds=ENGINE.copy(),executionEnabled=True,rootCounts=None,wholeAttempts=4,wholeGrant=0)
    if profile=='P139_RELEASE_DISABLED':
        return dict(profile=profile,domain=dict(prime=139,divisor=14,target=13),bounds=FULL_ENGINE.copy(),executionEnabled=False,rootCounts=[1,36,126,126,84,36],wholeAttempts=4,wholeGrant=0)
    fail('profile')

def proposed_contract():
    return dict(status='DRAFT_NOT_GRANTED',profile='P139_RELEASE_DISABLED',domain=dict(prime=139,divisor=14,target=13),root=ROOT,
                wholeAttempts=4,wholeGrant=0,campaigns=1,nextWholeAttempt=5,limits=FULL.copy(),engineLimits=FULL_ENGINE.copy(),concurrentWorkingMemory=671088640)

def transport_workspace(lim,inventory_bytes=0):
    integer(inventory_bytes)
    parent=inventory_bytes+128*lim['metadataBytes']+6*SOURCE_BOUND+2*lim['chunkBytes']+8388608
    worker=128*lim['metadataBytes']+6*SOURCE_BOUND+2*lim['segmentBytes']+2*lim['chunkBytes']+8388608
    if parent+worker>lim['memory']: fail('aggregate transport workspace')
    return parent,worker

class _Authority:
    def __init__(self,marker,grant,grant_sha):
        if marker is not _AUTH_MARKER: fail('private command authority')
        self._marker=marker;self.raw=encoded(grant);self.grant_sha=grant_sha
    def grant(self): return decoded(self.raw,FULL)

class _StartupAuthority:
    def __init__(self,marker,startup):
        if marker is not _AUTH_MARKER: fail('private startup authority')
        self._marker=marker;self.raw=encoded(startup)
    def startup(self): return decoded(self.raw,FULL)

def _authority_alive(authority):
    if type(authority) not in (_Authority,_StartupAuthority) or authority._marker is not _AUTH_MARKER: fail('missing command authority')

def _authority_authorization(authority):
    _authority_alive(authority)
    if type(authority) is _Authority:
        g=authority.grant();grant_sha=authority.grant_sha
    else:
        g=authority.startup()['binding'];grant_sha=g['grantSha256']
    return dict(grantSha256=grant_sha,resourceContractSha256=RESOURCE_SHA,releaseReviewSha256=g['releaseReviewSha256'],evidenceDirectory=str(EVIDENCE_DIR.absolute()),attempt=5)

def _core_caps(h): return FULL_ENGINE if h['profile']=='P139_RELEASE' else ENGINE
def _history(authority): return FULL_HISTORY.copy() if authority is not None else HISTORY.copy()
def event_guard(domain): return max(42,3+(domain['prime']-1)//2)+4

def _read_authority_file(path,io):
    if io.open+3>io.lim['openDescriptors']: fail('authority descriptor bound')
    io.open+=2;fd=None
    try:
        fd=directory_fd(path.parent)
        return read_meta(fd,path.name,io,65536)
    finally:
        if fd is not None: os.close(fd)
        io.open-=2

def _load_authority(expected_grant_sha256,io):
    digest(expected_grant_sha256)
    if any(os.environ.get(key)!='false' for key in FLAGS): fail('release parent flags must be false')
    raw=_read_authority_file(GRANT_FILE,io)
    if sha(raw)!=expected_grant_sha256: fail('trusted command grant digest')
    g=decoded(raw,FULL)
    keys(g,('format','status','root','mode','obligation','domain','priorWholeAttempts','attempt','maxWholeAttempts','grantId','approval','releaseReviewSha256','resourceContractSha256','sourcePins','engineLimits','limits','evidenceDirectory'))
    if g['format']!='LRC_P139_LOCAL_GRANT_V1' or g['status']!='EXECUTION_GRANTED' or g['root']!=ROOT or g['mode']!='REPRODUCTION' or g['obligation']!='G': fail('grant scope/status')
    if encoded(g['domain'])!=encoded(FULL_DOMAIN) or integer(g['priorWholeAttempts'])!=4 or integer(g['attempt'])!=5 or integer(g['maxWholeAttempts'])!=1: fail('one whole attempt5 scope')
    if type(g['grantId']) is not str or len(g['grantId'])!=32 or any(c not in '0123456789abcdef' for c in g['grantId']): fail('grant id')
    keys(g['approval'],('channel','reference'))
    if g['approval']['channel']!='human-user-message' or type(g['approval']['reference']) is not str or not 1<=len(g['approval']['reference'])<=256: fail('human provenance shape')
    digest(g['releaseReviewSha256']);digest(g['resourceContractSha256'])
    if g['resourceContractSha256']!=RESOURCE_SHA or encoded(g['limits'])!=encoded(FULL) or encoded(g['engineLimits'])!=encoded(FULL_ENGINE): fail('grant fixed resource contract')
    if type(g['evidenceDirectory']) is not str or g['evidenceDirectory']!=str(EVIDENCE_DIR.absolute()): fail('fixed evidence path')
    keys(g['sourcePins'],('producer','checker','host'))
    for value in g['sourcePins'].values(): digest(value)
    if sha(_read_authority_file(RESOURCE_FILE,io))!=RESOURCE_SHA or sha(_read_authority_file(REVIEW_FILE,io))!=g['releaseReviewSha256']: fail('resource/review pin drift')
    if pins(io)!=g['sourcePins']: fail('release source pin drift')
    return _Authority(_AUTH_MARKER,g,expected_grant_sha256)

def _validate_binding(binding):
    keys(binding,('root','mode','obligation','domain','attempt','priorWholeAttempts','grantSha256','resourceContractSha256','releaseReviewSha256','sourcePins','headerSha256','reservationSha256','startSha256','phaseId','action'))
    if binding['root']!=ROOT or binding['mode']!='REPRODUCTION' or binding['obligation']!='G' or encoded(binding['domain'])!=encoded(FULL_DOMAIN): fail('binding scientific scope')
    if integer(binding['attempt'])!=5 or integer(binding['priorWholeAttempts'])!=4 or binding['resourceContractSha256']!=RESOURCE_SHA: fail('binding history/resource')
    for k in ('grantSha256','resourceContractSha256','releaseReviewSha256','headerSha256','reservationSha256','startSha256'): digest(binding[k])
    keys(binding['sourcePins'],('producer','checker','host'))
    for value in binding['sourcePins'].values(): digest(value)
    phase=integer(binding['phaseId'],1,32)
    if binding['action'] not in ('VERIFY','GENERATE') or (binding['action']=='GENERATE' and phase%4!=3) or (binding['action']=='VERIFY' and phase%4 not in (0,2)): fail('binding role/phase')

def _validate_startup(raw):
    context=decoded(raw,FULL)
    keys(context,('binding','profile','headerSha256','reservationSha256','startSha256','phaseId','action','tail','maxEvents','cursor','sourcePins'))
    _validate_binding(context['binding'])
    if context['profile']!='P139_RELEASE': fail('startup profile')
    for k in ('headerSha256','reservationSha256','startSha256','phaseId','action','sourcePins'):
        if encoded(context[k])!=encoded(context['binding'][k]): fail('startup duplicate binding')
    digest(context['tail'])
    if context['action']=='VERIFY':
        if type(context['maxEvents']) is not int or context['maxEvents']!=0 or context['cursor'] is not None: fail('startup VERIFY fields')
    else:
        integer(context['maxEvents'],1,FULL_ENGINE['events']);cursor_shape(context['cursor'],FULL_DOMAIN,FULL_ENGINE)
    return context

def _make_bound_worker_entry(startup_bytes):
    if type(startup_bytes) is not bytes: fail('startup inert bytes required')
    context=_validate_startup(startup_bytes)
    authority=_StartupAuthority(_AUTH_MARKER,context)
    # Startup bytes are captured from trusted -c code, NEVER read from stdin.
    def entry(read,write): return worker(read,write,authority=authority)
    return entry

def _core_gate(authority,identity):
    captured=authority.startup()['binding'];raw=encoded(captured)
    def gate(release,request):
        if release is not identity: fail('core private identity')
        keys(request,('profile','domain','action','limits'))
        if request['profile']!='P139_RELEASE' or encoded(request['domain'])!=encoded(FULL_DOMAIN) or request['action']!=captured['action']: fail('core request role/domain')
        keys(request['limits'],FULL_ENGINE)
        for key,value in request['limits'].items():
            if key=='seconds':
                if type(value) not in (int,float) or not 0<value<=FULL_ENGINE[key] or not math.isfinite(value): fail('core time cap')
            else: integer(value,1,FULL_ENGINE[key])
        return decoded(raw,FULL)
    return gate

def domain_checked(domain,profile='BUILD_TINY',authority=None):
    if authority is not None:
        _authority_alive(authority)
        if type(profile) is not str or profile!='P139_RELEASE' or encoded(domain)!=encoded(FULL_DOMAIN): fail('fixed release domain')
        return FULL_DOMAIN.copy()
    # Static refusal independently precedes clocks, I/O, engines and masks.
    if type(profile) is not str or profile!='BUILD_TINY' or type(domain) is not dict or domain.get('prime')==139:
        fail('full profile statically disabled')
    keys(domain,('prime','divisor','target'))
    p=integer(domain['prime'],3,23);d=integer(domain['divisor'],2,24)
    integer(domain['target'],1,5)
    if any(p%i==0 for i in range(2,math.isqrt(p)+1)): fail('prime')
    cardinalities={sum(d*min(v*t%p,(-v*t)%p)<p for t in range(1,(p-1)//2+1)) for v in range(1,(p-1)//2+1)}
    if len(cardinalities)!=1 or 0 in cardinalities: fail('nonzero equal masks')
    return domain.copy()

def cursor_shape(cur,domain,engine_caps=None):
    engine_caps=ENGINE if engine_caps is None else engine_caps
    keys(cur,('phase','size','rootIndex','private','frames','supportIndex','extraRank','rootNodes','rootBytes','searchNodes','eventCount','extensions','traceBytes','supportHashes','unionHash'))
    if cur['phase'] not in ('PROLOGUE','ROOT_START','SEARCH','ROOT_END','SUPPORT_END','EXTEND','SIZE_END','FINAL_END','TERMINAL'): fail('cursor phase')
    n,target=(domain['prime']-1)//2,domain['target']
    integer(cur['size'],0,target)
    for key in ('rootIndex','supportIndex','extraRank','rootNodes','rootBytes','searchNodes','eventCount','extensions','traceBytes'): integer(cur[key],0,2**32-1)
    def values(raw,ordered=True):
        if type(raw) is not list or len(raw)>n or any(type(v) is not int or not 1<=v<=n for v in raw) or len(set(raw))!=len(raw) or (ordered and raw!=sorted(raw)): fail('cursor values')
    values(cur['private'])
    if type(cur['frames']) is not list or len(cur['frames'])>target: fail('cursor frames')
    for f in cur['frames']:
        keys(f,('selected','available','slots','options','next'))
        values(f['selected'],False);values(f['available']);integer(f['slots'],0,target);integer(f['next'],0,n)
        if f['options'] is not None: values(f['options'])
    digest(cur['unionHash'])
    if type(cur['supportHashes']) is not dict or len(cur['supportHashes'])>target: fail('support hash keys')
    for size,info in cur['supportHashes'].items():
        if type(size) is not str or not size.isdecimal() or str(int(size))!=size: fail('table size')
        integer(int(size),1,target);keys(info,('width','count','sha256'))
        if integer(info['width'],1,target)!=int(size): fail('table width')
        integer(info['count'],0,engine_caps['rows']);digest(info['sha256'])

class Io:
    def __init__(self,lim,kind='HOST_AUDIT'):
        self.lim=lim;self.kind=kind
        self.actual=dict(readBytes=0,writtenBytes=0,streamInBytes=0,streamOutBytes=0,files=0)
        self.caps=dict(readBytes=lim['auditReadBytes' if kind=='HOST_AUDIT' else 'childReadBytes'],writtenBytes=lim['auditWrittenBytes' if kind=='HOST_AUDIT' else 'childWrittenBytes'],
                       streamInBytes=0 if kind=='HOST_AUDIT' else lim['streamInBytes'],streamOutBytes=0 if kind=='HOST_AUDIT' else lim['streamOutBytes'],files=lim['phaseFiles'])
        # Standard streams plus retained session fd; traversal/child transients
        # are conservatively precharged separately.
        self.open=4
        self.started=time.monotonic()
        self.deadline=self.started+lim['auditScanSeconds' if kind=='HOST_AUDIT' else 'processSeconds']
        self.inventoryBytes=0
    def charge(self,key,count):
        integer(count)
        if self.actual[key]+count>self.caps[key]: fail('actual I/O '+key)
        self.actual[key]+=count
        self.tick()
    def tick(self):
        if self.deadline is not None and time.monotonic()>=self.deadline: fail('host deadline')
    def opened(self):
        if self.open>=self.lim['openDescriptors']: fail('open descriptor bound')
        self.open+=1
    def closed(self): self.open-=1

def directory_fd(directory):
    path=os.path.abspath(os.fspath(directory))
    if path=='/': fail('directory scope')
    fd=os.open('/',os.O_RDONLY|os.O_DIRECTORY)
    try:
        for part in Path(path).parts[1:]:
            nxt=os.open(part,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW,dir_fd=fd);os.close(fd);fd=nxt
        info=os.fstat(fd)
        if info.st_uid!=os.getuid() or info.st_mode&0o022: fail('owned directory')
        fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB)
        return fd
    except (OSError,Refused):
        os.close(fd);fail('unsafe/locked directory')

def regular(fd,name,bound,io):
    if type(name) is not str or '/' in name or name in ('.','..'): fail('basename')
    io.opened()
    try:
        handle=os.open(name,os.O_RDONLY|os.O_NOFOLLOW|os.O_NONBLOCK,dir_fd=fd)
    except Exception:
        io.closed();raise
    try:
        info=os.fstat(handle)
        if not stat.S_ISREG(info.st_mode) or info.st_nlink!=1 or info.st_size>bound or info.st_uid!=os.getuid() or info.st_mode&0o022: fail('nonregular/link/owner/mode/file bound')
    except Exception:
        os.close(handle);io.closed();raise
    return handle,info.st_size

def read_chunk(handle,count,io):
    count=min(count,io.lim['chunkBytes']);io.charge('readBytes',count)
    raw=os.read(handle,count)
    # Charge requested bytes conservatively, including EOF probes/short reads.
    return raw

def read_meta(fd,name,io,bound=None):
    bound=io.lim['metadataBytes'] if bound is None else bound
    handle,size=regular(fd,name,bound,io)
    try:
        if 128*size+4194304+io.inventoryBytes>io.lim['memory']: fail('metadata preallocation')
        raw=bytearray()
        while len(raw)<size:
            part=read_chunk(handle,size-len(raw),io)
            if not part: fail('short metadata')
            raw.extend(part)
        if read_chunk(handle,1,io): fail('metadata grew')
        return bytes(raw)
    finally:
        os.close(handle);io.closed()

def write_new(fd,name,raw,io,bound):
    if len(raw)>bound or '/' in name: fail('write bound')
    io.charge('files',1);io.opened()
    handle=None
    try:
        handle=os.open(name,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600,dir_fd=fd)
        io.charge('writtenBytes',len(raw))
        view=memoryview(raw)
        while view:
            amount=min(len(view),io.lim['chunkBytes'])
            n=os.write(handle,view[:amount])
            if n<=0: fail('short write')
            view=view[n:]
        os.fsync(handle)
    finally:
        if handle is not None: os.close(handle)
        io.closed()
    os.fsync(fd)

def json_file(fd,name,io):
    raw=read_meta(fd,name,io)
    return decoded(raw,io.lim),sha(raw)

def sources(io):
    if io.open+2>io.lim['openDescriptors']: fail('source traversal descriptor bound')
    io.open+=2
    fd=None
    try:
        fd=directory_fd(Path(__file__).absolute().parent)
        result={};total=0
        for key,name in NAMES.items():
            info=os.stat(name,dir_fd=fd,follow_symlinks=False)
            total+=info.st_size
            if 128*total+4194304+io.inventoryBytes>io.lim['memory']: fail('aggregate source allocation')
            result[key]=read_meta(fd,name,io,SOURCE_BOUND)
        return result
    finally:
        if fd is not None: os.close(fd)
        io.open-=2

def pins(io): return {key:sha(raw) for key,raw in sources(io).items()}

def header(fd,io,authority=None):
    raw=read_meta(fd,'header.json',io)
    h=decoded(raw,io.lim)
    keys(h,('format','profile','root','domain','history','limits','engineLimits','pins','authorization'))
    domain_checked(h['domain'],h['profile'],authority)
    if h['format']!='WHOLE_G_P139_RELEASE_STREAM_V3' or h['root']!=ROOT or encoded(h['history'])!=encoded(_history(authority)) or encoded(h['engineLimits'])!=encoded(FULL_ENGINE if authority is not None else ENGINE): fail('header authority')
    if encoded(h['authorization'])!=encoded(_authority_authorization(authority) if authority is not None else None): fail('header command binding')
    lim=limits_checked(h['limits'],authority)
    if lim!=h['limits'] or h['pins']!=pins(io): fail('header limits/pins')
    if 128*len(raw)+4194304>lim['memory']: fail('effective header memory')
    io.lim=lim
    io.caps.update(readBytes=lim['auditReadBytes' if io.kind=='HOST_AUDIT' else 'childReadBytes'],writtenBytes=lim['auditWrittenBytes' if io.kind=='HOST_AUDIT' else 'childWrittenBytes'],files=lim['phaseFiles'])
    if any(io.actual[k]>io.caps[k] for k in io.actual): fail('lowered bootstrap caps')
    io.deadline=min(io.deadline,io.started+lim['auditScanSeconds'])
    return h,sha(raw)

def inventory(fd,h,io):
    names=set();live=0
    with os.scandir(fd) as entries:
        for entry in entries:
            io.tick()
            if len(names)>=h['limits']['files'] or (len(names)+1)*2048+4194304>h['limits']['memory']: fail('inventory preallocation')
            info=entry.stat(follow_symlinks=False)
            if not stat.S_ISREG(info.st_mode) or info.st_nlink!=1 or info.st_uid!=os.getuid() or info.st_mode&0o022: fail('inventory link/owner/mode/nonregular')
            live+=info.st_size
            if live>h['limits']['liveBytes']: fail('live bytes')
            names.add(entry.name)
    io.inventoryBytes=len(names)*2048
    return names,live

def quota(h,kind):
    lim=h['limits'];audit=kind=='HOST_AUDIT'
    return dict(readBytes=lim['auditReadBytes' if audit else 'childReadBytes'],writtenBytes=lim['auditWrittenBytes' if audit else 'childWrittenBytes'],
                streamInBytes=0 if audit else lim['streamInBytes'],streamOutBytes=0 if audit else lim['streamOutBytes'],seconds=lim['auditSeconds' if audit else 'childSeconds'],files=lim['phaseFiles'],
                nodes=0 if audit else _core_caps(h)['nodes'],events=0 if audit else _core_caps(h)['events'],extensions=0 if audit else _core_caps(h)['extensions'],engineSeconds=0 if audit else _core_caps(h)['seconds'])

def blob_info(info,width,name,h):
    keys(info,('width','count','sha256','file'))
    if integer(info['width'],1,h['domain']['target'])!=width or info['file']!=name: fail('blob width/name')
    integer(info['count'],0,_core_caps(h)['rows']);digest(info['sha256'])

def desc_checked(d,index,tail,hh,h,inv):
    keys(d,('headerSha256','index','predecessor','payloadSha256','payloadBytes','eventCount','startCursor','endCursor','tables','dataset','invocation'))
    if d['headerSha256']!=hh or integer(d['index'])!=index or d['predecessor']!=tail or integer(d['invocation'],1)!=inv: fail('descriptor chain')
    integer(d['payloadBytes'],1,h['limits']['segmentBytes']);integer(d['eventCount'],1,_core_caps(h)['events']);digest(d['payloadSha256'])
    cursor_shape(d['startCursor'],h['domain'],_core_caps(h));cursor_shape(d['endCursor'],h['domain'],_core_caps(h))
    if type(d['tables']) is not dict or len(d['tables'])>h['domain']['target']: fail('tables keys')
    prefix=f'segment-{index:06d}'
    for size,info in d['tables'].items():
        if type(size) is not str or not size.isdecimal() or str(int(size))!=size: fail('table key')
        blob_info(info,integer(int(size),1,h['domain']['target']),prefix+f'-table-{size}.bin',h)
    blob_info(d['dataset'],h['domain']['target'],prefix+'-dataset.bin',h)

def metadata_state(fd,h,hh,io):
    names,live=inventory(fd,h,io);remaining=names.copy();remaining.discard('header.json')
    count=sum(name.startswith('reserve-') and name.endswith('.json') for name in names)
    if count>h['limits']['invocations']: fail('invocations')
    totals=dict(auditInvocations=0,producerInvocations=0,checkerInvocations=0,
                producerNodes=0,producerEvents=0,producerExtensions=0,producerEngineSeconds=0,
                checkerNodes=0,checkerEvents=0,checkerExtensions=0,checkerEngineSeconds=0,
                totalReadBytes=0,totalWrittenBytes=65536,totalStreamInBytes=0,totalStreamOutBytes=0,totalSeconds=0,reservedFiles=1)
    tail=hh;segments=0;last_cursor=None;last_verdict=None
    for num in range(1,count+1):
        stem=f'{num:06d}';kind=('HOST_AUDIT','VERIFY','GENERATE','VERIFY')[(num-1)%4]
        rn,sn,tn=f'reserve-{stem}.json',f'start-{stem}.json',f'receipt-{stem}.json'
        r,rh=json_file(fd,rn,io);keys(r,('id','type','predecessor','quota','headerSha256'))
        q=quota(h,kind)
        if encoded(r)!=encoded(dict(id=num,type=kind,predecessor=tail,quota=q,headerSha256=hh)): fail('reservation exact binding')
        pool='audit' if kind=='HOST_AUDIT' else 'producer' if kind=='GENERATE' else 'checker'
        totals[pool+'Invocations']+=1
        for k in ('nodes','events','extensions','engineSeconds'):
            if pool!='audit': totals[pool+k[0].upper()+k[1:]]+=q[k]
        for src,dst in (('readBytes','totalReadBytes'),('writtenBytes','totalWrittenBytes'),('streamInBytes','totalStreamInBytes'),('streamOutBytes','totalStreamOutBytes'),('seconds','totalSeconds'),('files','reservedFiles')): totals[dst]+=q[src]
        if any(totals[k]>h['limits'][k] for k in totals): fail('TOTAL ledger')
        start,sh=json_file(fd,sn,io)
        if encoded(start)!=encoded(dict(reservationSha256=rh,id=num,type=kind)): fail('start binding')
        rec,_=json_file(fd,tn,io)
        keys(rec,('reservationSha256','startSha256','id','status','commitSha256','verdict','chargedIo'))
        keys(rec['chargedIo'],('readBytes','writtenBytes','streamInBytes','streamOutBytes','files'))
        for k,v in rec['chargedIo'].items(): integer(v,0,q[k])
        if rec['reservationSha256']!=rh or rec['startSha256']!=sh or integer(rec['id'],1)!=num or rec['status']!='OK': fail('missing/error receipt')
        remaining.difference_update((rn,sn,tn))
        if kind!='HOST_AUDIT':
            if f'spool-{stem}.bin' not in names: fail('missing spool')
            remaining.discard(f'spool-{stem}.bin')
        if kind=='GENERATE':
            prefix=f'segment-{segments:06d}'
            c,ch=json_file(fd,prefix+'-commit.json',io)
            keys(c,('headerSha256','index','predecessor','descriptorSha256','reservation','start'))
            if c['headerSha256']!=hh or integer(c['index'])!=segments or c['predecessor']!=tail or c['reservation']!=rh or c['start']!=sh: fail('commit chain')
            d,dh=json_file(fd,prefix+'-descriptor.json',io)
            desc_checked(d,segments,tail,hh,h,num)
            if dh!=c['descriptorSha256'] or rec['commitSha256']!=ch or rec['verdict']!='CAPTURED_UNACCEPTED': fail('descriptor/receipt binding')
            required={prefix+'-commit.json',prefix+'-descriptor.json',prefix+'-events.bin',d['dataset']['file']}
            required.update(info['file'] for info in d['tables'].values())
            if not required<=names: fail('missing referenced blob')
            remaining.difference_update(required)
            tail=ch;segments+=1;last_cursor=d['endCursor']
            if segments>h['limits']['segments']: fail('segment count')
        else:
            expected=('AUDITED_CAPTURED_G_OPEN',) if kind=='HOST_AUDIT' else ('PREFIX_VERIFIED_G_OPEN','WHOLE_G_VERIFIED_CTB_OPEN' if h['profile']=='P139_RELEASE' else 'TINY_G_VERIFIED_CTB_OPEN')
            if rec['commitSha256']!=tail or rec['verdict'] not in expected: fail('phase receipt verdict')
            if kind=='VERIFY': last_verdict=rec['verdict']
    if remaining: fail('foreign/orphan/staged tail')
    return dict(count=count,phase=count%4,segments=segments,tail=tail,totals=totals,lastCursor=last_cursor,lastVerdict=last_verdict,liveBytes=live)

def descriptor_stream(fd,state,h,hh,io):
    tail=hh
    for index in range(state['segments']):
        prefix=f'segment-{index:06d}'
        c,ch=json_file(fd,prefix+'-commit.json',io)
        d,dh=json_file(fd,prefix+'-descriptor.json',io)
        desc_checked(d,index,tail,hh,h,4*index+3)
        if c['descriptorSha256']!=dh or c['predecessor']!=tail: fail('stream chain changed')
        yield c,d
        tail=ch
    if tail!=state['tail']: fail('tail changed')

def file_chunks(fd,name,length,io):
    handle,size=regular(fd,name,length,io)
    try:
        if size!=length: fail('blob length')
        left=length
        while left:
            raw=read_chunk(handle,left,io)
            if not raw: fail('blob short')
            left-=len(raw);yield raw
        if read_chunk(handle,1,io): fail('blob extra')
    finally:
        os.close(handle);io.closed()

def inspect_blob(fd,name,length,expected_hash,io,width=None,classes=None,distinct=False):
    hashed=hashlib.sha256();pending=b'';previous=None;count=0
    for raw in file_chunks(fd,name,length,io):
        hashed.update(raw)
        if width is not None:
            pending+=raw
            offset=0
            while len(pending)-offset>=width:
                row=pending[offset:offset+width];offset+=width;count+=1
                if any(not 1<=v<=classes for v in row) or row!=bytes(sorted(row)) or (distinct and len(set(row))!=width) or (previous is not None and previous>=row): fail('blob row order/range')
                previous=row
            pending=pending[offset:]
    if pending or hashed.hexdigest()!=expected_hash: fail('blob hash/partial row')
    return count

def audit(fd,state,h,hh,io):
    for _,d in descriptor_stream(fd,state,h,hh,io):
        index=d['index'];prefix=f'segment-{index:06d}'
        inspect_blob(fd,prefix+'-events.bin',d['payloadBytes'],d['payloadSha256'],io)
        for size,info in sorted(d['tables'].items(),key=lambda item:int(item[0])):
            inspect_blob(fd,info['file'],info['width']*info['count'],info['sha256'],io,info['width'],(h['domain']['prime']-1)//2,True)
        info=d['dataset'];inspect_blob(fd,info['file'],info['width']*info['count'],info['sha256'],io,info['width'],(h['domain']['prime']-1)//2)

def frame(tag,body): return bytes([tag])+struct.pack('<Q',len(body))+body
def frame_head(tag,length): return bytes([tag])+struct.pack('<Q',length)

class Reader:
    def __init__(self,read,lim): self.read=read;self.lim=lim;self.pending=None
    def exact(self,length):
        integer(length)
        if length>self.lim['metadataBytes']: fail('small read bound')
        result=bytearray()
        while len(result)<length:
            raw=self.read(min(self.lim['chunkBytes'],length-len(result)))
            if type(raw) is not bytes: fail('reader bytes type')
            if not raw: fail('stream truncated')
            if len(raw)>length-len(result): fail('reader overread')
            result.extend(raw)
        return bytes(result)
    def head(self,tag,max_length):
        actual,length=self.peek();self.pending=None
        if actual!=tag or length>max_length: fail('tag/frame length')
        return length
    def peek(self):
        if self.pending is None:
            raw=self.exact(9);self.pending=(raw[0],struct.unpack('<Q',raw[1:])[0])
        return self.pending
    def meta(self,tag): return decoded(self.exact(self.head(tag,self.lim['metadataBytes'])),self.lim)
    def zero(self,tag):
        if self.head(tag,0): fail('nonzero terminator')
    def eof(self):
        if self.pending is not None: fail('unconsumed frame')
        raw=self.read(1)
        if type(raw) is not bytes or raw: fail('trailing stream bytes')
    def segment(self,length):
        if length>self.lim['segmentBytes'] or 2*length+16777216>self.lim['memory']: fail('one segment preallocation')
        data=bytearray()
        while len(data)<length: data.extend(self.exact(min(self.lim['chunkBytes'],length-len(data))))
        return bytes(data)

class Rows:
    def __init__(self,reader,tag,info,domain,distinct=False,engine_caps=None):
        self.reader=reader;self.tag=tag;self.info=info;self.domain=domain;self.distinct=distinct;self.started=False;self.left=0;self.previous=None;self.hash=hashlib.sha256();self.done=False
        self.engine_caps=ENGINE if engine_caps is None else engine_caps
    def __iter__(self): return self
    def __next__(self):
        if self.done: raise StopIteration
        width=self.info['width']
        if not self.started:
            length=self.reader.head(self.tag,self.engine_caps['bytes'])
            if length!=width*self.info['count']: fail('stream row length/count')
            self.left=length;self.started=True
        if not self.left:
            if self.hash.hexdigest()!=self.info['sha256']: fail('stream row hash')
            self.done=True;raise StopIteration
        row=self.reader.exact(width);self.left-=width;self.hash.update(row)
        if row!=bytes(sorted(row)) or any(not 1<=v<=(self.domain['prime']-1)//2 for v in row) or (self.distinct and len(set(row))!=width) or (self.previous is not None and self.previous>=row): fail('stream row range/order')
        self.previous=row;return row

def input_stream(fd,state,h,hh,action,max_events,cursor,io):
    yield INPUT_MAGIC
    yield frame(1,encoded(dict(header=h,action=action,maxEvents=max_events,cursor=cursor)))
    for c,d in descriptor_stream(fd,state,h,hh,io):
        yield frame(2,encoded(c));yield frame(3,encoded(d))
        name=f"segment-{d['index']:06d}-events.bin"
        yield frame_head(4,d['payloadBytes']);yield from file_chunks(fd,name,d['payloadBytes'],io)
        for size,info in sorted(d['tables'].items(),key=lambda item:int(item[0])):
            length=info['width']*info['count'];yield frame_head(5,length);yield from file_chunks(fd,info['file'],length,io)
        info=d['dataset'];length=info['width']*info['count'];yield frame_head(6,length);yield from file_chunks(fd,info['file'],length,io)
        yield frame(7,b'')
    yield frame(8,encoded(dict(segments=state['segments'],tail=state['tail'],headerSha256=hh)))

def create_spool(fd,name,io):
    io.charge('files',1);io.opened()
    try:
        return os.open(name,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600,dir_fd=fd)
    except Exception:
        io.closed();raise

def run_child(fd,name,stream,h,io,startup=None):
    transport_workspace(h['limits'],io.inventoryBytes)
    own=sources(io)
    if {k:sha(v) for k,v in own.items()}!=h['pins']: fail('prechild source drift')
    # Child's two fixed source reads are charged conservatively even on failure.
    io.charge('readBytes',6*SOURCE_BOUND)
    if startup is None:
        if h['profile']!='BUILD_TINY': fail('release startup required')
        body='__file__='+repr(str(Path(__file__).absolute()))+'\n'+own['host'].decode('utf8')
    else:
        _validate_startup(startup)
        io.charge('readBytes',len(startup))
        body='__file__='+repr(str(Path(__file__).absolute()))+'\n__name__="pinned075e_bound_worker"\n'+own['host'].decode('utf8')+'\n_make_bound_worker_entry('+repr(startup)+')(sys.stdin.buffer.read,sys.stdout.buffer.write)\n'
    spool=create_spool(fd,name,io)
    process=None;select=None;streams=[];err_handle=None;generator=None
    if io.open+6>h['limits']['openDescriptors']:
        os.close(spool);io.closed();fail('child transient descriptor bound')
    io.open+=6  # pipes, selector and transient Popen exec-error pair
    deadline=time.monotonic()+h['limits']['processSeconds']
    total_out=total_err=0
    pending=memoryview(b'')
    try:
        generator=iter(stream)
        process=subprocess.Popen([sys.executable,'-I','-S','-B','-c',body,'--build-tiny','--worker'],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,
                                 shell=False,env={n:'false' for n in FLAGS},close_fds=True)
        streams=[process.stdin,process.stdout,process.stderr]
        select=selectors.DefaultSelector()
        for s in streams: os.set_blocking(s.fileno(),False)
        select.register(process.stdin,selectors.EVENT_WRITE,'in')
        select.register(process.stdout,selectors.EVENT_READ,'out');select.register(process.stderr,selectors.EVENT_READ,'err')
        while select.get_map():
            io.tick()
            if time.monotonic()>=deadline: fail('child timeout')
            for item,_ in select.select(min(.05,max(0,deadline-time.monotonic()))):
                s,kind=item.fileobj,item.data
                if kind=='in':
                    if not pending:
                        try:
                            raw=next(generator)
                            if type(raw) is not bytes or len(raw)>h['limits']['chunkBytes']+h['limits']['metadataBytes']+9: fail('input chunk type/bound')
                            pending=memoryview(raw)
                        except StopIteration:
                            select.unregister(s);s.close();continue
                    amount=min(len(pending),h['limits']['chunkBytes'])
                    io.charge('streamInBytes',amount);io.charge('readBytes',amount)
                    n=os.write(s.fileno(),pending[:amount]);pending=pending[n:]
                else:
                    amount=h['limits']['chunkBytes']
                    # Bound request before allocating, but successful EOF probes
                    # are conservatively charged as requested read capacity.
                    remaining=io.caps['streamOutBytes']-io.actual['streamOutBytes']
                    if kind=='err': remaining=min(remaining,h['limits']['stderrBytes']-total_err)
                    probe=remaining==0
                    amount=min(amount,max(1,remaining),io.caps['readBytes']-io.actual['readBytes'])
                    if amount<=0: fail('pipe read allowance')
                    io.charge('readBytes',amount)
                    raw=os.read(s.fileno(),amount)
                    if not raw: select.unregister(s);s.close();continue
                    if probe: fail('pipe over-cap EOF probe')
                    if kind=='err':
                        total_err+=len(raw)
                        if total_err>h['limits']['stderrBytes']: fail('stderr bound')
                        io.charge('streamOutBytes',len(raw))
                        if err_handle is None: err_handle=create_spool(fd,name.replace('spool-','stderr-'),io)
                        view=memoryview(raw)
                        while view:
                            io.charge('writtenBytes',len(view));n=os.write(err_handle,view)
                            if n<=0: fail('stderr short write')
                            view=view[n:]
                    else:
                        total_out+=len(raw);io.charge('streamOutBytes',len(raw))
                        if total_out>h['limits']['streamOutBytes']: fail('stdout bound')
                        view=memoryview(raw)
                        while view:
                            amount=min(len(view),h['limits']['chunkBytes']);io.charge('writtenBytes',amount)
                            n=os.write(spool,view[:amount])
                            if n<=0: fail('spool short write')
                            view=view[n:]
        process.wait(timeout=max(.001,deadline-time.monotonic()))
        if process.returncode!=0 or total_err: fail('child exit/stderr')
    except (OSError,subprocess.TimeoutExpired):
        fail('child I/O/timeout')
    finally:
        try:
            if process is not None:
                if process.poll() is None: process.kill()
                try: process.wait(timeout=2)
                except subprocess.TimeoutExpired: fail('unreaped child STOP')
        finally:
            cleanup_errors=[]
            if select is not None:
                try: select.close()
                except Exception as exc: cleanup_errors.append(exc)
            for s in streams:
                try:
                    if not s.closed: s.close()
                except Exception as exc: cleanup_errors.append(exc)
            try:
                if generator is not None and hasattr(generator,'close'): generator.close()
            except Exception as exc: cleanup_errors.append(exc)
            finally:
                try:
                    if err_handle is not None:
                        try: os.fsync(err_handle)
                        finally:
                            try: os.close(err_handle)
                            finally: io.closed()
                except Exception as exc: cleanup_errors.append(exc)
                finally:
                    try:
                        try: os.fsync(spool)
                        finally:
                            try: os.close(spool)
                            finally: io.closed();io.open-=6
                    except Exception as exc: cleanup_errors.append(exc)
            try: os.fsync(fd)
            except Exception as exc: cleanup_errors.append(exc)
            if cleanup_errors: raise cleanup_errors[0]
    if h['pins']!=pins(io): fail('postchild source drift')

def reserve(fd,h,hh,kind,bootstrap=None,known_state=None,authority=None):
    io=Io(h['limits'],kind) if bootstrap is None else bootstrap
    io.kind=kind
    q=quota(h,kind)
    io.caps.update({k:q[k] for k in io.actual})
    if any(io.actual[k]>io.caps[k] for k in io.actual): fail('bootstrap carry cap')
    # Cheap metadata-only bootstrap is carried into this phase's I/O quota.
    if known_state is None:
        if authority is not None:
            fresh_authority=_load_authority(authority.grant_sha,io)
            if fresh_authority.raw!=authority.raw: fail('grant changed')
        fresh,fh=header(fd,io,authority)
        if encoded(fresh)!=encoded(h) or fh!=hh: fail('header changed')
        state=metadata_state(fd,h,hh,io)
    else: state=known_state
    expected=('HOST_AUDIT','VERIFY','GENERATE','VERIFY')[state['phase']]
    if kind!=expected or state['count']>=h['limits']['invocations']: fail('phase/count admission')
    if kind=='GENERATE' and state['segments']>=h['limits']['segments']: fail('segment pre-admission')
    if state['count']==0 and kind=='HOST_AUDIT':
        # Covers the three bounded OWN-source reads used to create genesis;
        # initial header write has its separate permanent65536 allowance.
        io.charge('readBytes',(6*SOURCE_BOUND+6+3*65536+3) if authority is not None else (3*SOURCE_BOUND+3))
    pool='audit' if kind=='HOST_AUDIT' else 'producer' if kind=='GENERATE' else 'checker'
    additions={pool+'Invocations':1}
    if pool!='audit':
        for k in ('nodes','events','extensions','engineSeconds'): additions[pool+k[0].upper()+k[1:]]=q[k]
    for src,dst in (('readBytes','totalReadBytes'),('writtenBytes','totalWrittenBytes'),('streamInBytes','totalStreamInBytes'),('streamOutBytes','totalStreamOutBytes'),('seconds','totalSeconds'),('files','reservedFiles')): additions[dst]=q[src]
    if any(state['totals'][k]+v>h['limits'][k] for k,v in additions.items()): fail('TOTAL pre-reservation')
    if state['liveBytes']+q['writtenBytes']>h['limits']['liveBytes']: fail('reserved live storage')
    if io.inventoryBytes//2048+q['files']>h['limits']['files']: fail('reserved live files')
    number=state['count']+1
    r=encoded(dict(id=number,type=kind,predecessor=state['tail'],quota=q,headerSha256=hh))
    write_new(fd,f'reserve-{number:06d}.json',r,io,h['limits']['metadataBytes']);_fault('after_reservation')
    start=encoded(dict(reservationSha256=sha(r),id=number,type=kind))
    write_new(fd,f'start-{number:06d}.json',start,io,h['limits']['metadataBytes']);_fault('after_start')
    io.deadline=io.started+(h['limits']['auditScanSeconds'] if kind=='HOST_AUDIT' else h['limits']['processSeconds']+10)
    state['admittedTotals']=dict(state['totals'])
    for k,v in additions.items(): state['admittedTotals'][k]+=v
    return number,sha(r),sha(start),state,io

def receipt(fd,h,num,rh,sh,status,tail,verdict,io):
    # Enough terminal allowance remains separately reserved. Deadline refusal
    # may write a bounded ERROR but cannot publish a late positive verdict.
    if status=='OK': io.tick()
    old_deadline=io.deadline
    if status!='OK': io.deadline=None
    record=dict(reservationSha256=rh,startSha256=sh,id=num,status=status,commitSha256=tail,verdict=verdict,chargedIo=io.actual.copy())
    # Include receipt's own size/file charge using a bounded fixed-point encoding.
    record['chargedIo']['files']+=1
    for _ in range(4):
        raw=encoded(record)
        record['chargedIo']['writtenBytes']=io.actual['writtenBytes']+len(raw)
    raw=encoded(record)
    if record['chargedIo']['writtenBytes']!=io.actual['writtenBytes']+len(raw): fail('receipt accounting encoding')
    write_new(fd,f'receipt-{num:06d}.json',raw,io,h['limits']['metadataBytes'])
    io.deadline=old_deadline
    _fault('after_receipt')

def failed_receipt(fd,h,num,rh,sh,tail,io):
    try:
        os.stat(f'receipt-{num:06d}.json',dir_fd=fd,follow_symlinks=False)
    except FileNotFoundError:
        receipt(fd,h,num,rh,sh,'ERROR',tail,'REFUSED',io)

def audit_phase(fd,h,hh,bootstrap=None,known_state=None,authority=None):
    num,rh,sh,state,io=reserve(fd,h,hh,'HOST_AUDIT',bootstrap,known_state,authority)
    try:
        audit(fd,state,h,hh,io);receipt(fd,h,num,rh,sh,'OK',state['tail'],'AUDITED_CAPTURED_G_OPEN',io)
    except Exception:
        failed_receipt(fd,h,num,rh,sh,state['tail'],io);raise

def open_spool(fd,name,h,io):
    handle,_=regular(fd,name,h['limits']['streamOutBytes'],io)
    return handle,Reader(lambda n:read_chunk(handle,n,io),h['limits'])

def _startup_for(h,hh,num,rh,sh,state,action,max_events,cursor,authority):
    if authority is None: return None
    _authority_alive(authority);g=authority.grant()
    binding=dict(root=ROOT,mode='REPRODUCTION',obligation='G',domain=FULL_DOMAIN.copy(),attempt=5,priorWholeAttempts=4,
                 grantSha256=authority.grant_sha,resourceContractSha256=RESOURCE_SHA,releaseReviewSha256=g['releaseReviewSha256'],sourcePins=g['sourcePins'],
                 headerSha256=hh,reservationSha256=rh,startSha256=sh,phaseId=num,action=action)
    raw=encoded(dict(binding=binding,profile='P139_RELEASE',headerSha256=hh,reservationSha256=rh,startSha256=sh,phaseId=num,action=action,
                     tail=state['tail'],maxEvents=max_events,cursor=cursor,sourcePins=g['sourcePins']))
    _validate_startup(raw);return raw

def verify_phase(fd,h,hh,bootstrap=None,known_state=None,authority=None):
    num,rh,sh,state,io=reserve(fd,h,hh,'VERIFY',bootstrap,known_state,authority)
    try:
        spool=f'spool-{num:06d}.bin'
        run_child(fd,spool,input_stream(fd,state,h,hh,'VERIFY',0,None,io),h,io,_startup_for(h,hh,num,rh,sh,state,'VERIFY',0,None,authority))
        handle,reader=open_spool(fd,spool,h,io)
        try:
            if reader.exact(len(OUTPUT_MAGIC))!=OUTPUT_MAGIC: fail('output magic')
            result=reader.meta(1);keys(result,('cursor','verdict'));cursor_shape(result['cursor'],h['domain'],_core_caps(h))
            reader.zero(8);reader.eof()
        finally: os.close(handle);io.closed()
        if state['lastCursor'] is not None and encoded(state['lastCursor'])!=encoded(result['cursor']): fail('checker cursor binding')
        if state['segments']==0 and result['verdict']!='PREFIX_VERIFIED_G_OPEN': fail('empty prefix cannot be terminal')
        terminal='WHOLE_G_VERIFIED_CTB_OPEN' if authority is not None else 'TINY_G_VERIFIED_CTB_OPEN'
        if result['verdict'] not in ('PREFIX_VERIFIED_G_OPEN',terminal) or (result['verdict']==terminal)!=(result['cursor']['phase']=='TERMINAL'): fail('checker verdict phase')
        receipt(fd,h,num,rh,sh,'OK',state['tail'],result['verdict'],io)
        return result,dict(count=num,segments=state['segments'],totals=state['admittedTotals'])
    except Exception:
        failed_receipt(fd,h,num,rh,sh,state['tail'],io);raise

def spool_blob(fd,reader,tag,name,length,expected_hash,io,width=None,classes=None,distinct=False,engine_caps=None):
    engine_caps=ENGINE if engine_caps is None else engine_caps
    if reader.head(tag,engine_caps['bytes'] if tag!=4 else io.lim['segmentBytes'])!=length: fail('spool blob length')
    handle=create_spool(fd,name,io);hashed=hashlib.sha256();left=length;pending=b'';previous=None
    try:
        while left:
            raw=reader.exact(min(left,io.lim['chunkBytes']));left-=len(raw);hashed.update(raw)
            if width is not None:
                pending+=raw;offset=0
                while len(pending)-offset>=width:
                    row=pending[offset:offset+width];offset+=width
                    if row!=bytes(sorted(row)) or any(not 1<=v<=classes for v in row) or (distinct and len(set(row))!=width) or (previous is not None and previous>=row): fail('output row order/range')
                    previous=row
                pending=pending[offset:]
            view=memoryview(raw)
            while view:
                io.charge('writtenBytes',len(view));n=os.write(handle,view)
                if n<=0: fail('staging short write')
                view=view[n:]
        if pending or hashed.hexdigest()!=expected_hash: fail('spool blob hash')
        os.fsync(handle)
    finally: os.close(handle);io.closed()
    os.fsync(fd)

def generate_phase(fd,h,hh,max_events,cursor,authority=None):
    num,rh,sh,state,io=reserve(fd,h,hh,'GENERATE',authority=authority)
    try:
        spool=f'spool-{num:06d}.bin'
        run_child(fd,spool,input_stream(fd,state,h,hh,'GENERATE',max_events,cursor,io),h,io,_startup_for(h,hh,num,rh,sh,state,'GENERATE',max_events,cursor,authority))
        handle,reader=open_spool(fd,spool,h,io)
        try:
            if reader.exact(len(OUTPUT_MAGIC))!=OUTPUT_MAGIC: fail('output magic')
            control=reader.meta(1);keys(control,('startCursor','endCursor','tables','dataset'))
            cursor_shape(control['startCursor'],h['domain'],_core_caps(h));cursor_shape(control['endCursor'],h['domain'],_core_caps(h))
            if encoded(control['startCursor'])!=encoded(cursor): fail('generated cursor start')
            if type(control['tables']) is not dict or set(control['tables'])!=set(control['endCursor']['supportHashes']): fail('output table keys')
            index=state['segments'];prefix=f'segment-{index:06d}'
            payload_length=reader.peek()[1]
            payload_name=prefix+'-events.bin'
            # One bounded outgoing event segment is permitted, never the prefix.
            if reader.head(4,h['limits']['segmentBytes'])!=payload_length or payload_length<=0: fail('event output')
            raw=reader.segment(payload_length)
            count=validate_payload(raw,_core_caps(h)['events'])
            if count>max_events or control['endCursor']['eventCount']-cursor['eventCount']!=count or control['endCursor']['traceBytes']-cursor['traceBytes']!=len(raw)-4*count: fail('event count/trace progression')
            write_new(fd,payload_name,raw,io,h['limits']['segmentBytes'])
            tables={}
            for size,info in sorted(control['tables'].items(),key=lambda item:int(item[0])):
                keys(info,('width','count','sha256'))
                if encoded(info)!=encoded(control['endCursor']['supportHashes'][size]): fail('snapshot hash metadata')
                name=prefix+f'-table-{size}.bin';entry=dict(info,file=name)
                blob_info(entry,int(size),name,h)
                spool_blob(fd,reader,5,name,info['width']*info['count'],info['sha256'],io,info['width'],(h['domain']['prime']-1)//2,True,_core_caps(h))
                tables[size]=entry
            info=control['dataset'];keys(info,('width','count','sha256'))
            data_name=prefix+'-dataset.bin';data_entry=dict(info,file=data_name)
            blob_info(data_entry,h['domain']['target'],data_name,h)
            if info['sha256']!=control['endCursor']['unionHash']: fail('UNION hash')
            spool_blob(fd,reader,6,data_name,info['width']*info['count'],info['sha256'],io,info['width'],(h['domain']['prime']-1)//2,engine_caps=_core_caps(h))
            reader.zero(8);reader.eof()
        finally: os.close(handle);io.closed()
        desc=dict(headerSha256=hh,index=index,predecessor=state['tail'],payloadSha256=sha(raw),payloadBytes=len(raw),eventCount=count,
                  startCursor=cursor,endCursor=control['endCursor'],tables=tables,dataset=data_entry,invocation=num)
        dr=encoded(desc);write_new(fd,prefix+'-descriptor.json',dr,io,h['limits']['metadataBytes']);_fault('after_staging');io.tick()
        commit=encoded(dict(headerSha256=hh,index=index,predecessor=state['tail'],descriptorSha256=sha(dr),reservation=rh,start=sh))
        temp=prefix+'-commit.tmp';write_new(fd,temp,commit,io,h['limits']['metadataBytes'])
        io.charge('files',1);os.link(temp,prefix+'-commit.json',src_dir_fd=fd,dst_dir_fd=fd,follow_symlinks=False);os.unlink(temp,dir_fd=fd);os.fsync(fd)
        _fault('after_commit');io.tick();receipt(fd,h,num,rh,sh,'OK',sha(commit),'CAPTURED_UNACCEPTED',io)
    except Exception:
        failed_receipt(fd,h,num,rh,sh,state['tail'],io);raise

def validate_payload(raw,event_cap=ENGINE['events']):
    offset=count=0
    while offset<len(raw):
        if len(raw)-offset<4: fail('event framing truncated')
        size=struct.unpack_from('<I',raw,offset)[0];offset+=4
        if not 0<size<=256 or size>len(raw)-offset: fail('event frame length')
        offset+=size;count+=1
        if count>event_cap: fail('event count')
    if count==0: fail('empty segment')
    return count

def create_session(directory,domain,limits=None,profile='BUILD_TINY'):
    domain=domain_checked(domain,profile);lim=limits_checked(limits)
    io=Io(lim);fd=directory_fd(directory)
    try:
        # One iterator step detects nonempty; no directory-sized list.
        with os.scandir(fd) as entries:
            if next(entries,None) is not None: fail('new empty directory required')
        h=dict(format='WHOLE_G_P139_RELEASE_STREAM_V3',profile=profile,root=ROOT,domain=domain,history=HISTORY.copy(),limits=lim,engineLimits=ENGINE.copy(),pins=pins(io),authorization=None)
        raw=encoded(h);decoded(raw,lim)
        if len(raw)>lim['liveBytes'] or lim['totalWrittenBytes']<65536 or lim['files']<1: fail('genesis allowance')
        write_new(fd,'header.json',raw,io,lim['metadataBytes'])
        return dict(headerSha256=sha(raw),wholeAttempts=4,wholeGrant=0)
    except OSError: fail('session file I/O')
    finally: os.close(fd)

def _inspect(directory,authority=None,io=None):
    io=Io(DEFAULTS) if io is None else io;fd=directory_fd(directory)
    try:
        h,hh=header(fd,io,authority);state=metadata_state(fd,h,hh,io)
        if state['phase'] not in (0,3): fail('unfinished phase STOP')
        return dict(semanticVerified=False,metadataOnly=True,blobIntegrityVerified=False,lastRecordedVerdict='CAPTURED_UNACCEPTED' if state['phase']==3 else state['lastVerdict'],
                    wholeAttempts=h['history']['wholeAttempts'],wholeGrant=h['history']['wholeGrant'],chargedInvocations=state['count'],segments=state['segments'],totals=state['totals'],metadataReadBytes=io.actual['readBytes'],tail=state['tail'])
    except OSError: fail('metadata I/O STOP')
    finally: os.close(fd)

def inspect_session(directory): return _inspect(directory)

def _advance(directory,max_events=32,authority=None,boot=None):
    integer(max_events,1,(FULL_ENGINE if authority is not None else ENGINE)['events'])
    boot=Io(DEFAULTS) if boot is None else boot;fd=directory_fd(directory)
    try:
        h,hh=header(fd,boot,authority);state=metadata_state(fd,h,hh,boot)
        if state['phase']==3:
            # No orphan invocation: fresh permanently charged checker ONLY.
            result,final=verify_phase(fd,h,hh,boot,state,authority)
        else:
            if state['phase']!=0: fail('unfinished phase STOP')
            if state['lastCursor'] is not None and state['lastCursor']['phase']=='TERMINAL': fail('terminal no automatic invocation')
            audit_phase(fd,h,hh,boot,state,authority);result,_=verify_phase(fd,h,hh,authority=authority)
            generate_phase(fd,h,hh,max_events,result['cursor'],authority);result,final=verify_phase(fd,h,hh,authority=authority)
        # Return totals already validated and permanently reserved by final VERIFY;
        # no reset/free metadata rewalk after receipt.
        return dict(verdict=result['verdict'],cursor=result['cursor'],chargedInvocations=final['count'],segments=final['segments'],totals=final['totals'],wholeAttempts=h['history']['wholeAttempts'],wholeGrant=h['history']['wholeGrant'])
    except OSError: fail('host file I/O STOP; preserve evidence')
    finally: os.close(fd)

def advance(directory,max_events=32): return _advance(directory,max_events)

def create_release_session(expected_grant_sha256):
    digest(expected_grant_sha256);io=Io(FULL);fd=None;parent=None
    io.deadline=io.started+10
    try:
        authority=_load_authority(expected_grant_sha256,io);g=authority.grant();io.tick()
        # The one fixed create-only genesis is the permanent attempt5 slot.
        io.open+=2
        try:
            parent=directory_fd(EVIDENCE_DIR.parent)
            try: os.mkdir(EVIDENCE_DIR.name,0o700,dir_fd=parent);os.fsync(parent)
            except FileExistsError: pass
        finally:
            if parent is not None: os.close(parent);parent=None
            io.open-=2
        fd=directory_fd(EVIDENCE_DIR)
        with os.scandir(fd) as entries:
            if next(entries,None) is not None: fail('attempt5 already claimed/nonempty; no reset')
        if pins(io)!=g['sourcePins']: fail('preclaim source drift')
        h=dict(format='WHOLE_G_P139_RELEASE_STREAM_V3',profile='P139_RELEASE',root=ROOT,domain=FULL_DOMAIN.copy(),history=FULL_HISTORY.copy(),limits=FULL.copy(),engineLimits=FULL_ENGINE.copy(),pins=g['sourcePins'],authorization=_authority_authorization(authority))
        raw=encoded(h);decoded(raw,FULL)
        io.tick()
        write_new(fd,'header.json',raw,io,65536)
        io.tick()
        _fault('after_release_claim')
        return dict(headerSha256=sha(raw),priorWholeAttempts=4,wholeAttempts=5,wholeGrant=1,actualCoreStarts=0)
    except OSError: fail('release authority/claim I/O STOP')
    finally:
        if fd is not None: os.close(fd)

def advance_release(expected_grant_sha256,max_events=40000000):
    digest(expected_grant_sha256);integer(max_events,1,FULL_ENGINE['events']);io=Io(FULL)
    # Permanently reserved132s AUDIT includes a conservative10s genesis debit;
    # no reset/refund, timestamp authority, extra ledger fields or cap increase.
    io.started-=10;io.deadline=io.started+FULL['auditScanSeconds']
    try: authority=_load_authority(expected_grant_sha256,io)
    except OSError: fail('release authority I/O STOP')
    return _advance(EVIDENCE_DIR,max_events,authority,io)

def inspect_release_session(expected_grant_sha256):
    digest(expected_grant_sha256)
    # There is no independent free full-inspection budget or additional phase
    # grammar. Only an already permanently charged advance returns observation.
    fail('durable full inspection deferred; use charged advance result')

def _compare_rows(expected,actual):
    sentinel=object()
    try:
        for a,b in itertools.zip_longest(expected,actual,fillvalue=sentinel):
            if a is sentinel or b is sentinel or type(a) is not bytes or type(b) is not bytes or a!=b: fail('producer streamed snapshot mismatch')
    finally:
        if hasattr(expected,'close'): expected.close()
        if hasattr(actual,'close'): actual.close()

def _worker_input(reader,h,hh,engine,checker):
    index=0;tail=hh
    while reader.peek()[0]==2:
        if index>=h['limits']['segments']: fail('worker segment count before payload')
        c=reader.meta(2);keys(c,('headerSha256','index','predecessor','descriptorSha256','reservation','start'))
        d=reader.meta(3);desc_checked(d,index,tail,hh,h,4*index+3)
        if c['headerSha256']!=hh or integer(c['index'])!=index or c['predecessor']!=tail or c['descriptorSha256']!=sha(encoded(d)): fail('worker commit chain')
        digest(c['reservation']);digest(c['start'])
        if encoded(engine.cursor())!=encoded(d['startCursor']): fail('worker start cursor')
        length=reader.head(4,h['limits']['segmentBytes'])
        if length!=d['payloadBytes']: fail('worker payload length')
        left=length;hashed=hashlib.sha256();count=0
        while left:
            if left<4: fail('worker short event frame')
            raw=reader.exact(4);size=struct.unpack('<I',raw)[0];left-=4
            if not 0<size<=256 or size>left: fail('worker event length')
            event=reader.exact(size);left-=size;count+=1;hashed.update(raw);hashed.update(event)
            if checker: engine.feed(event)
            elif engine.next_event()!=event: fail('producer prefix event mismatch')
        if count!=d['eventCount'] or hashed.hexdigest()!=d['payloadSha256']: fail('worker event count/hash')
        cur=engine.cursor()
        if encoded(cur)!=encoded(d['endCursor']) or set(d['tables'])!=set(cur['supportHashes']): fail('worker end cursor/table keys')
        streams={}
        for size,info in sorted(d['tables'].items(),key=lambda item:int(item[0])):
            expected={k:info[k] for k in ('width','count','sha256')}
            if encoded(expected)!=encoded(cur['supportHashes'][size]): fail('worker snapshot metadata')
            streams[size]=Rows(reader,5,info,h['domain'],True,_core_caps(h))
        data=Rows(reader,6,d['dataset'],h['domain'],engine_caps=_core_caps(h))
        if checker:
            engine.compare_snapshot(streams,data)
        else:
            for size,rows in streams.items(): _compare_rows(engine.iter_table_rows(int(size)),rows)
            _compare_rows(engine.iter_dataset_rows(),data)
        if d['dataset']['sha256']!=cur['unionHash']: fail('worker UNION hash')
        reader.zero(7);tail=sha(encoded(c));index+=1
        if index>h['limits']['segments']: fail('worker segment count')
    ending=reader.meta(8);keys(ending,('segments','tail','headerSha256'))
    if encoded(ending)!=encoded(dict(segments=index,tail=tail,headerSha256=hh)): fail('stream end chain')
    reader.eof()
    return tail

def worker(read,write,profile='BUILD_TINY',authority=None):
    if authority is None:
        if type(profile) is not str or profile!='BUILD_TINY': fail('worker disabled profile')
        startup=None
    else:
        _authority_alive(authority)
        if type(authority) is not _StartupAuthority: fail('worker startup provenance')
        startup=authority.startup();profile='P139_RELEASE'
    # Mandatory small control can be read; no prefix/source/engine effect before
    # static domain/profile admission of that control.
    reader=Reader(read,DEFAULTS)
    if reader.exact(len(INPUT_MAGIC))!=INPUT_MAGIC: fail('input magic')
    control=reader.meta(1);keys(control,('header','action','maxEvents','cursor'))
    h=control['header'];keys(h,('format','profile','root','domain','history','limits','engineLimits','pins','authorization'))
    if startup is not None:
        if sha(encoded(h))!=startup['headerSha256'] or encoded(h['pins'])!=encoded(startup['sourcePins']): fail('startup header/source binding')
        for key in ('action','maxEvents','cursor'):
            if encoded(control[key])!=encoded(startup[key]): fail('startup CONTROL binding')
    domain_checked(h['domain'],h['profile'],authority)
    if h['format']!='WHOLE_G_P139_RELEASE_STREAM_V3' or h['root']!=ROOT or encoded(h['history'])!=encoded(_history(authority)) or encoded(h['engineLimits'])!=encoded(FULL_ENGINE if authority is not None else ENGINE): fail('worker header authority')
    if encoded(h['authorization'])!=encoded(_authority_authorization(authority) if authority is not None else None): fail('worker command authorization')
    lim=limits_checked(h['limits'],authority)
    if lim!=h['limits'] or any(os.environ.get(k)!='false' for k in FLAGS): fail('worker flags/limits')
    reader.lim=lim
    transport_workspace(lim)
    action=control['action']
    if action not in ('VERIFY','GENERATE'): fail('worker action')
    if action=='VERIFY':
        if type(control['maxEvents']) is not int or control['maxEvents']!=0 or control['cursor'] is not None: fail('worker VERIFY fields')
    else:
        integer(control['maxEvents'],1,_core_caps(h)['events']);cursor_shape(control['cursor'],h['domain'],_core_caps(h))
    io=Io(lim,'VERIFY');own=sources(io)
    if {k:sha(v) for k,v in own.items()}!=h['pins']: fail('worker source pins')
    kind='checker' if action=='VERIFY' else 'producer'
    namespace=dict(__name__='pinned075d_'+kind,__file__=str(Path(__file__).absolute().parent/NAMES[kind]))
    identity=None
    if authority is not None:
        identity=object();namespace['_PINNED_HOST_RELEASE_GATE']=_core_gate(authority,identity)
    exec(compile(own[kind],NAMES[kind],'exec'),namespace)
    args=dict(h['domain'],limits=_core_caps(h),profile=profile)
    if identity is not None: args['release']=identity
    engine=namespace['Verifier' if action=='VERIFY' else 'Engine'](**args)
    hh=sha(encoded(h));tail=_worker_input(reader,h,hh,engine,action=='VERIFY')
    if startup is not None and tail!=startup['tail']: fail('startup prefix tail mismatch')
    def output(raw):
        if type(raw) is not bytes: fail('worker output type')
        view=memoryview(raw)
        while view:
            part=bytes(view[:lim['chunkBytes']]);amount=write(part)
            if type(amount) is not int or amount!=len(part): fail('worker short write')
            view=view[amount:]
    if action=='VERIFY':
        cur=engine.cursor();verdict='PREFIX_VERIFIED_G_OPEN'
        if cur['phase']=='TERMINAL':
            result=engine.finish_verified();keys(result,('status','semanticVerified','wholeGrant','wholeAttempts','rows'))
            terminal='WHOLE_G_VERIFIED_CTB_OPEN' if authority is not None else 'TINY_G_VERIFIED_CTB_OPEN'
            if result['status']!=terminal or result['semanticVerified'] is not True or type(result['wholeGrant']) is not int or result['wholeGrant']!=(1 if authority is not None else 0) or type(result['wholeAttempts']) is not int or result['wholeAttempts']!=(5 if authority is not None else 4): fail('worker terminal verdict')
            integer(result['rows'],0,_core_caps(h)['rows'])
            verdict=result['status']
        if {k:sha(v) for k,v in sources(io).items()}!=h['pins']: fail('worker post source drift')
        output(OUTPUT_MAGIC);output(frame(1,encoded(dict(cursor=cur,verdict=verdict))));output(frame(8,b''))
    else:
        if encoded(engine.cursor())!=encoded(control['cursor']): fail('fresh checker cursor mismatch')
        if lim['segmentBytes']*2+4194304>lim['memory']: fail('worker one segment memory')
        start=engine.cursor();payload=bytearray();count=0
        guard=event_guard(h['domain'])
        while count<control['maxEvents'] and lim['segmentBytes']-len(payload)>=guard:
            event=engine.next_event()
            if event is None: break
            if len(event)>guard-4: fail('logical event maximum')
            payload.extend(struct.pack('<I',len(event)));payload.extend(event);count+=1
        if count==0: fail('empty GEN segment')
        cur=engine.cursor();tables=cur['supportHashes']
        rows=engine.iter_dataset_rows()
        try: data_count=sum(1 for _ in rows)
        finally:
            if hasattr(rows,'close'): rows.close()
        data=dict(width=h['domain']['target'],count=data_count,sha256=cur['unionHash'])
        output(OUTPUT_MAGIC);output(frame(1,encoded(dict(startCursor=start,endCursor=cur,tables=tables,dataset=data))))
        output(frame_head(4,len(payload)));output(bytes(payload))
        for size,info in sorted(tables.items(),key=lambda item:int(item[0])):
            output(frame_head(5,info['width']*info['count']))
            rows=engine.iter_table_rows(int(size))
            try:
                for row in rows: output(row)
            finally:
                if hasattr(rows,'close'): rows.close()
        output(frame_head(6,data_count*h['domain']['target']))
        rows=engine.iter_dataset_rows()
        try:
            for row in rows: output(row)
        finally:
            if hasattr(rows,'close'): rows.close()
        if {k:sha(v) for k,v in sources(io).items()}!=h['pins']: fail('worker final source drift')
        output(frame(8,b''))

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--build-tiny',action='store_true');parser.add_argument('--worker',action='store_true')
    commands=parser.add_mutually_exclusive_group()
    commands.add_argument('--create-release',action='store_true');commands.add_argument('--advance-release',action='store_true');commands.add_argument('--inspect-release',action='store_true')
    parser.add_argument('--grant-sha256');parser.add_argument('--max-events',type=int,default=40000000)
    args=parser.parse_args()
    if args.create_release or args.advance_release or args.inspect_release:
        if args.build_tiny or args.worker or args.grant_sha256 is None: fail('explicit release command/digest required')
        result=create_release_session(args.grant_sha256) if args.create_release else advance_release(args.grant_sha256,args.max_events) if args.advance_release else inspect_release_session(args.grant_sha256)
        sys.stdout.buffer.write(encoded(result));return
    if args.grant_sha256 is not None: fail('grant cannot enable default worker')
    if not args.build_tiny or not args.worker: fail('default CLI/full execution denied')
    worker(sys.stdin.buffer.read,sys.stdout.buffer.write)

if __name__=='__main__':
    try: main()
    except Exception as exc:
        sys.stderr.write('REFUSED: '+str(exc)[:200]+'\n');sys.exit(2)
