#!/usr/bin/env python3
"""075C BUILD_TINY durable capture. No whole-prime execution authority."""
import argparse
import base64
import binascii
import fcntl
import hashlib
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

class Refused(ValueError):
    pass

FLAGS = ('RESEARCH_WORKER_ENABLED', 'MATH_PILOT_QUEUE_ENABLED',
         'LRC_CAMPAIGN_LOCAL_ENABLED', 'RESEARCH_OPENAI_ENABLED',
         'RESEARCH_CODEX_LOCAL_ENABLED', 'SANDBOX_DOCKER_ENABLED')
DEFAULTS = dict(invocations=256, nodes=25600000, events=51200000, seconds=5120,
                writtenBytes=134217728, liveBytes=67108864, files=4096,
                segmentBytes=65536, metadataBytes=65536, stdoutBytes=2097152,
                stderrBytes=8192, processSeconds=20, memory=67108864)
ENGINE = dict(nodes=100000, events=200000, extensions=50000, rows=10000,
              bytes=2097152, memory=67108864, seconds=10)
NAMES = dict(producer='attempt-lrc-p139-generation-v3.py',
             checker='verify-lrc-p139-g-segments.py', host=Path(__file__).name)
HISTORY = dict(wholeAttempts=4, wholeGrant=0,
               predecessorSha256='a1348524642b4fb77c046664b9df3d3ceaeba6029536397eed8ee0d24d422f32')
_fault = lambda point: None

def refuse(reason):
    raise Refused(str(reason)[:240])

def encoded(obj):
    try:
        return (json.dumps(obj, sort_keys=True, separators=(',', ':'),
                           ensure_ascii=True, allow_nan=False) + '\n').encode()
    except (TypeError, ValueError, RecursionError):
        refuse('JSON encoding')

def sha(data):
    return hashlib.sha256(data).hexdigest()

def integer(value, minimum=0, maximum=2**63-1):
    if type(value) is not int or not minimum <= value <= maximum:
        refuse('integer range/type')
    return value

def keys(value, wanted):
    if type(value) is not dict or set(value) != set(wanted):
        refuse('exact keys')

def _cursor_shape(cursor,domain):
    keys(cursor,('phase','size','rootIndex','private','frames','supportIndex','extraRank',
                 'rootNodes','rootBytes','searchNodes','eventCount','extensions','traceBytes','supportHashes','unionHash'))
    if cursor['phase'] not in ('PROLOGUE','ROOT_START','SEARCH','ROOT_END','SUPPORT_END','EXTEND','SIZE_END','FINAL_END','TERMINAL'):
        refuse('cursor phase')
    n,target = (domain['prime']-1)//2,domain['target']
    integer(cursor['size'],0,target)
    for key in ('rootIndex','supportIndex','extraRank','rootNodes','rootBytes','searchNodes','eventCount','extensions','traceBytes'):
        integer(cursor[key],0,2**32-1)
    def values(raw,ordered=True):
        if type(raw) is not list or len(raw)>n or any(type(v) is not int or not 1<=v<=n for v in raw) or len(set(raw)) != len(raw) or (ordered and raw != sorted(raw)):
            refuse('cursor class list')
    values(cursor['private'])
    if type(cursor['frames']) is not list or len(cursor['frames']) > target:
        refuse('cursor frames')
    for frame in cursor['frames']:
        keys(frame,('selected','available','slots','options','next'))
        values(frame['selected'],False)
        values(frame['available'])
        integer(frame['slots'],0,target)
        integer(frame['next'],0,n)
        if frame['options'] is not None:
            values(frame['options'])
    def digest(value):
        if type(value) is not str or len(value)!=64 or any(c not in '0123456789abcdef' for c in value):
            refuse('cursor digest')
    digest(cursor['unionHash'])
    if type(cursor['supportHashes']) is not dict or len(cursor['supportHashes']) > target:
        refuse('cursor support hashes')
    for size,info in cursor['supportHashes'].items():
        if type(size) is not str or not size.isdecimal() or str(int(size)) != size:
            refuse('cursor support size')
        integer(int(size),1,target)
        keys(info,('count','width','sha256'))
        integer(info['count'],0,ENGINE['rows'])
        if integer(info['width'],1,target) != int(size):
            refuse('cursor width')
        digest(info['sha256'])

def _pairs(pairs):
    obj = {}
    for key, value in pairs:
        if key in obj:
            refuse('duplicate JSON key')
        obj[key] = value
    return obj

def _shape(obj, depth=0, count=None):
    count = [0] if count is None else count
    count[0] += 1
    if depth > 24 or count[0] > 50000:
        refuse('JSON shape bound')
    if isinstance(obj, (dict, list)):
        for val in (obj.values() if isinstance(obj, dict) else obj):
            _shape(val, depth+1, count)
    elif obj is not None and type(obj) not in (str, int, float, bool):
        refuse('JSON type')
    elif type(obj) is float and not math.isfinite(obj):
        refuse('nonfinite')

def _parse_preflight(data,memory):
    # Cooperative conservative CPython allocation allowance, not hard RSS.
    if 128*len(data)+4194304 > memory:
        refuse('JSON memory preflight')
    depth, tokens, quoted, escaped = 0,0,False,False
    for char in data:
        if quoted:
            if escaped:
                escaped = False
            elif char == 92:
                escaped = True
            elif char == 34:
                quoted = False
        elif char == 34:
            quoted = True
            tokens += 1
        elif char in (123,91):
            depth += 1
            tokens += 1
            if depth > 24:
                refuse('JSON preparsing depth')
        elif char in (125,93):
            depth -= 1
            if depth < 0:
                refuse('JSON preparsing nesting')
        elif char in (44,58):
            tokens += 1
        if tokens > 50000:
            refuse('JSON preparsing token bound')
    if depth or quoted:
        refuse('JSON preparsing incomplete')

def decoded(data, bound, memory=DEFAULTS['memory']):
    if len(data) > bound:
        refuse('JSON byte bound')
    _parse_preflight(data,memory)
    try:
        obj = json.loads(data, object_pairs_hook=_pairs,
                         parse_constant=lambda _: refuse('nonfinite'))
    except (ValueError, UnicodeError, RecursionError) as exc:
        if isinstance(exc, Refused):
            raise
        refuse('JSON parse')
    _shape(obj)
    return obj

def limits_checked(limits):
    if limits is None:
        return DEFAULTS.copy()
    if type(limits) is not dict or not set(limits) <= set(DEFAULTS):
        refuse('unknown host limit')
    result = DEFAULTS.copy()
    for name, value in limits.items():
        if name in ('seconds', 'processSeconds'):
            if type(value) not in (int, float) or not 0 < value <= DEFAULTS[name] or not math.isfinite(value):
                refuse('time limit')
        else:
            integer(value, 1, DEFAULTS[name])
        result[name] = value
    return result

def domain_checked(domain):
    keys(domain, ('prime', 'divisor', 'target'))
    p = integer(domain['prime'], 3, 23)
    d = integer(domain['divisor'], 2, 24)
    integer(domain['target'], 1, 5)
    if any(p % i == 0 for i in range(2, math.isqrt(p)+1)):
        refuse('nonprime')
    sizes = [sum(d*min(v*t % p, (-v*t) % p) < p
                 for t in range(1, (p-1)//2+1)) for v in range(1, (p-1)//2+1)]
    if not sizes or not sizes[0] or len(set(sizes)) != 1:
        refuse('mask cardinality')
    return domain.copy()

def directory_fd(directory):
    path = os.path.abspath(os.fspath(directory))
    if path == '/' or any(x in ('.', '..') for x in Path(path).parts[1:]):
        refuse('directory scope')
    fd = os.open('/', os.O_RDONLY | os.O_DIRECTORY)
    try:
        for part in Path(path).parts[1:]:
            nxt = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
            os.close(fd)
            fd = nxt
        info = os.fstat(fd)
        if info.st_uid != os.getuid() or info.st_mode & 0o022:
            refuse('unowned/writable directory')
        try:
            fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            refuse('locked')
        return fd
    except (OSError, Refused):
        os.close(fd)
        refuse('unsafe/locked directory')

def _read(fd, name, bound):
    if '/' in name or name in ('.', '..'):
        refuse('basename')
    handle = os.open(name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=fd)
    try:
        info = os.fstat(handle)
        if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1 or info.st_size > bound:
            refuse('nonregular/link/large file')
        data = bytearray()
        while len(data) <= bound:
            chunk = os.read(handle,min(65536,bound+1-len(data)))
            if not chunk:
                break
            data.extend(chunk)
        if len(data) != info.st_size or len(data) > bound or os.read(handle, 1):
            refuse('file changed/bound')
        return bytes(data)
    finally:
        os.close(handle)

def _write(fd, name, data, bound):
    if len(data) > bound or '/' in name:
        refuse('write bound')
    handle = os.open(name, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
                     0o600, dir_fd=fd)
    try:
        view = memoryview(data)
        while view:
            n = os.write(handle, view)
            if n <= 0:
                refuse('short write')
            view = view[n:]
        os.fsync(handle)
    finally:
        os.close(handle)
    os.fsync(fd)

def _sources():
    # Walk even source parents with O_NOFOLLOW. Fixed OWN filenames only.
    source_dir = Path(__file__).absolute().parent
    fd = directory_fd(source_dir)
    try:
        return {key: _read(fd, name, 131072) for key, name in NAMES.items()}
    finally:
        os.close(fd)

def _pins():
    return {key: sha(value) for key, value in _sources().items()}

def _header(fd):
    raw = _read(fd, 'header.json', DEFAULTS['metadataBytes'])
    h = decoded(raw, DEFAULTS['metadataBytes'])
    keys(h, ('format','profile','root','domain','history','limits','engineLimits','pins'))
    if h['format'] != 'WHOLE_G_P139_SEGMENTS_V1' or h['profile'] != 'BUILD_TINY' or h['root'] != 'LRC_P139_REPRODUCTION_075':
        refuse('profile/root')
    domain_checked(h['domain'])
    checked_limits = limits_checked(h['limits'])
    _parse_preflight(raw,checked_limits['memory'])
    if encoded(h['history']) != encoded(HISTORY) or encoded(h['engineLimits']) != encoded(ENGINE) or h['limits'] != checked_limits or h['pins'] != _pins() or raw != encoded(h):
        refuse('header/history/limits/source drift')
    return h, sha(raw)

def _inventory(fd, h):
    names = os.listdir(fd)
    lim = h['limits']
    if len(names) > lim['files']:
        refuse('file count')
    total = 0
    for name in names:
        info = os.stat(name, dir_fd=fd, follow_symlinks=False)
        if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
            refuse('foreign link/nonregular')
        total += info.st_size
    if total > lim['liveBytes'] or total*12 + len(names)*1024 > lim['memory']:
        refuse('live storage/memory preflight')
    return set(names), total

def _json(fd, name, lim):
    data = _read(fd, name, lim['metadataBytes'])
    value = decoded(data, lim['metadataBytes'],lim['memory'])
    if encoded(value) != data:
        refuse('noncanonical metadata')
    return value, sha(data)

def _blob(fd, obj, width, expected_name, lim, classes, distinct=False):
    keys(obj, ('width','count','sha256','file'))
    if type(obj['width']) is not int or obj['width'] != width or obj['file'] != expected_name:
        refuse('blob scope/name')
    count = integer(obj['count'], 0, ENGINE['rows'])
    data = _read(fd, expected_name, ENGINE['bytes'])
    if len(data) != count*width or sha(data) != obj['sha256']:
        refuse('blob hash/length')
    rows = [data[i:i+width] for i in range(0,len(data),width)]
    if any(tuple(row) != tuple(sorted(row)) or any(not 1 <= v <= classes for v in row) or (distinct and len(set(row)) != len(row)) for row in rows) or any(a >= b for a,b in zip(rows, rows[1:])):
        refuse('blob rows')
    return data

def _quota(h, kind):
    lim = h['limits']
    return dict(nodes=ENGINE['nodes'], events=ENGINE['events'],
                seconds=lim['processSeconds']+12, files=2*h['domain']['target']+12,
                writtenBytes=lim['stdoutBytes'] + 5*lim['metadataBytes'] + lim['segmentBytes'])

def _collect(fd, h, header_hash, partial=False):
    names, live = _inventory(fd, h)
    allowed = {'header.json'}
    reservations = sorted(n for n in names if n.startswith('reserve-') and n.endswith('.json'))
    if len(reservations) > h['limits']['invocations']:
        refuse('invocation count')
    totals = dict(nodes=0,events=0,seconds=0,writtenBytes=len(encoded(h)),files=1)
    segments, tail, phase = [], header_hash, 0
    last_verdict = None
    for number, name in enumerate(reservations, 1):
        stem = f'{number:06d}'
        if name != f'reserve-{stem}.json':
            refuse('reservation gap/order')
        r, rh = _json(fd,name,h['limits'])
        keys(r, ('id','type','predecessor','quota','headerSha256'))
        kind = 'GENERATE' if phase == 1 else 'VERIFY'
        if encoded(r) != encoded(dict(id=number,type=kind,predecessor=tail,quota=_quota(h,kind),headerSha256=header_hash)):
            refuse('reservation corruption/order')
        for key in totals:
            totals[key] += r['quota'][key]
            if totals[key] > h['limits'][key]:
                refuse('total quota')
        start_name, receipt_name = f'start-{stem}.json', f'receipt-{stem}.json'
        start, start_hash = _json(fd,start_name,h['limits'])
        keys(start, ('reservationSha256','id','type'))
        if encoded(start) != encoded(dict(reservationSha256=rh,id=number,type=kind)):
            refuse('start binding')
        receipt, _ = _json(fd,receipt_name,h['limits'])
        keys(receipt, ('reservationSha256','startSha256','id','status','commitSha256','verdict'))
        if receipt['reservationSha256'] != rh or receipt['startSha256'] != start_hash or integer(receipt['id'],1) != number or receipt['status'] != 'OK':
            refuse('missing/error terminal receipt')
        allowed.update((name,start_name,receipt_name))
        if kind == 'GENERATE':
            index = len(segments)
            prefix = f'segment-{index:06d}'
            c, ch = _json(fd,prefix+'-commit.json',h['limits'])
            keys(c, ('headerSha256','index','predecessor','descriptorSha256','reservation','start'))
            if c['headerSha256'] != header_hash or integer(c['index']) != index or c['predecessor'] != tail or c['reservation'] != rh or c['start'] != start_hash or receipt['commitSha256'] != ch or receipt['verdict'] != 'CAPTURED_UNACCEPTED':
                refuse('commit chain')
            desc, dh = _json(fd,prefix+'-descriptor.json',h['limits'])
            keys(desc, ('headerSha256','index','predecessor','payloadSha256','payloadBytes','eventCount','startCursor','endCursor','tables','dataset','invocation'))
            if dh != c['descriptorSha256'] or desc['headerSha256'] != header_hash or integer(desc['index']) != index or desc['predecessor'] != tail or integer(desc['invocation'],1) != number:
                refuse('descriptor chain')
            _cursor_shape(desc['startCursor'],h['domain'])
            _cursor_shape(desc['endCursor'],h['domain'])
            payload = _read(fd,prefix+'-events.bin',h['limits']['segmentBytes'])
            if len(payload) != integer(desc['payloadBytes'],1,h['limits']['segmentBytes']) or sha(payload) != desc['payloadSha256']:
                refuse('payload hash/length')
            events = unpack_events(payload,h['limits']['segmentBytes'])
            if not events or len(events) != integer(desc['eventCount'],1,ENGINE['events']):
                refuse('event count')
            if type(desc['tables']) is not dict or len(desc['tables']) > h['domain']['target']:
                refuse('tables shape')
            tables = {}
            for size, obj in desc['tables'].items():
                if type(size) is not str or not size.isdecimal() or str(int(size)) != size:
                    refuse('table key')
                width = integer(int(size),1,h['domain']['target'])
                bn = prefix+f'-table-{size}.bin'
                tables[size] = _blob(fd,obj,width,bn,h['limits'],(h['domain']['prime']-1)//2,True)
                allowed.add(bn)
            dn = prefix+'-dataset.bin'
            dataset = _blob(fd,desc['dataset'],h['domain']['target'],dn,h['limits'],(h['domain']['prime']-1)//2)
            allowed.update((prefix+'-commit.json',prefix+'-descriptor.json',prefix+'-events.bin',dn))
            segments.append(dict(descriptor=desc,events=payload,tables=tables,dataset=dataset))
            tail = ch
        else:
            if receipt['commitSha256'] != tail or receipt['verdict'] not in ('PREFIX_VERIFIED_G_OPEN','TINY_G_VERIFIED_CTB_OPEN'):
                refuse('checker receipt binding')
            last_verdict = receipt['verdict']
        phase = (phase+1)%3
    if names != allowed:
        refuse('orphan/unknown/staged/extra tail')
    if phase and not partial:
        refuse('unfinished phase; reconciliation required')
    return dict(segments=segments,tail=tail,totals=totals,phase=phase,
                count=len(reservations),lastVerdict=last_verdict,liveBytes=live)

def unpack_events(payload, bound):
    if len(payload) > bound:
        refuse('segment size')
    result, offset = [], 0
    while offset < len(payload):
        if len(payload)-offset < 4:
            refuse('event frame truncated')
        length = struct.unpack_from('<I',payload,offset)[0]
        offset += 4
        if not 0 < length <= 256 or length > len(payload)-offset or len(result) >= ENGINE['events']:
            refuse('event framing')
        result.append(payload[offset:offset+length])
        offset += length
    return result

def _b64(raw):
    return base64.b64encode(raw).decode('ascii')

def _unb64(value, bound):
    if type(value) is not str or len(value) > 4*((bound+2)//3):
        refuse('base64 bound')
    try:
        raw = base64.b64decode(value,validate=True)
    except (ValueError,binascii.Error):
        refuse('base64')
    if len(raw) > bound or _b64(raw) != value:
        refuse('base64 canonical')
    return raw

def _request(h, state, action, max_events=0, cursor=None):
    predicted = len(encoded(h))+4096+(0 if cursor is None else len(encoded(cursor)))
    for seg in state['segments']:
        predicted += len(encoded(seg['descriptor']))+4096+2*(len(seg['events'])+len(seg['dataset'])+sum(len(v) for v in seg['tables'].values()))
    if predicted > h['limits']['stdoutBytes'] or 128*predicted+4194304 > h['limits']['memory']:
        refuse('worker request allocation preflight')
    items = []
    for seg in state['segments']:
        items.append(dict(descriptor=seg['descriptor'],events=_b64(seg['events']),
                          tables={k:_b64(v) for k,v in seg['tables'].items()},dataset=_b64(seg['dataset'])))
    request = dict(header=h,action=action,segments=items,maxEvents=max_events,cursor=cursor)
    data = encoded(request)
    if len(data) > h['limits']['stdoutBytes'] or len(data)*12 > h['limits']['memory']:
        refuse('worker input/memory bound')
    return data

def _run_child(request, h):
    deadline = time.monotonic()+h['limits']['processSeconds']
    sources = _sources()
    if {key:sha(val) for key,val in sources.items()} != h['pins']:
        refuse('source drift before child')
    # Execute exactly the verified OWN host bytes, not a path reread by Python.
    body = '__file__='+repr(str(Path(__file__).absolute()))+'\n'+sources['host'].decode('utf8')
    process = subprocess.Popen([sys.executable,'-I','-S','-B','-c',body,'--build-tiny','--worker'],
                               stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,
                               shell=False,env={name:'false' for name in FLAGS},close_fds=True)
    streams = [process.stdin,process.stdout,process.stderr]
    selector = None
    out, err, offset = bytearray(),bytearray(),0
    try:
        selector = selectors.DefaultSelector()
        for stream in streams:
            os.set_blocking(stream.fileno(),False)
        selector.register(process.stdin,selectors.EVENT_WRITE,'in')
        selector.register(process.stdout,selectors.EVENT_READ,'out')
        selector.register(process.stderr,selectors.EVENT_READ,'err')
        while selector.get_map():
            if time.monotonic() >= deadline:
                refuse('child timeout')
            for item,_ in selector.select(min(.05,max(0,deadline-time.monotonic()))):
                stream, kind = item.fileobj,item.data
                if kind == 'in':
                    n = os.write(stream.fileno(),request[offset:offset+65536])
                    offset += n
                    if offset == len(request):
                        selector.unregister(stream)
                        stream.close()
                else:
                    chunk = os.read(stream.fileno(),65536)
                    if not chunk:
                        selector.unregister(stream)
                        stream.close()
                    else:
                        target = out if kind == 'out' else err
                        bound = h['limits']['stdoutBytes'] if kind == 'out' else h['limits']['stderrBytes']
                        if len(target)+len(chunk) > bound:
                            refuse('child pipe bound')
                        target.extend(chunk)
        process.wait(timeout=max(.001,deadline-time.monotonic()))
        if process.returncode != 0 or err:
            refuse('child exit/refusal')
        if h['pins'] != _pins():
            refuse('source drift after child')
        return decoded(bytes(out),h['limits']['stdoutBytes'],h['limits']['memory'])
    except (OSError,subprocess.TimeoutExpired):
        refuse('child I/O/timeout')
    finally:
        try:
            if process.poll() is None:
                process.kill()
            try:
                process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                refuse('unreaped child; STOP, no accepted verdict')
        finally:
            if selector is not None:
                selector.close()
            for stream in streams:
                if not stream.closed:
                    stream.close()

def _reserve(fd,h,hh,kind):
    state = _collect(fd,h,hh,partial=True)
    expected = 'GENERATE' if state['phase'] == 1 else 'VERIFY'
    if kind != expected or state['count'] >= h['limits']['invocations']:
        refuse('phase/invocations')
    quota = _quota(h,kind)
    for key in quota:
        if state['totals'][key]+quota[key] > h['limits'][key]:
            refuse('TOTAL '+key)
    if state['liveBytes'] + quota['writtenBytes'] > h['limits']['liveBytes']:
        refuse('reserved live storage')
    number = state['count']+1
    record = dict(id=number,type=kind,predecessor=state['tail'],quota=quota,headerSha256=hh)
    raw = encoded(record)
    _write(fd,f'reserve-{number:06d}.json',raw,h['limits']['metadataBytes'])
    _fault('after_reservation')
    start = encoded(dict(reservationSha256=sha(raw),id=number,type=kind))
    _write(fd,f'start-{number:06d}.json',start,h['limits']['metadataBytes'])
    _fault('after_start')
    return number,sha(raw),sha(start),state

def _receipt(fd,h,number,rh,sh,status,tail,verdict):
    _write(fd,f'receipt-{number:06d}.json',encoded(dict(reservationSha256=rh,
           startSha256=sh,id=number,status=status,commitSha256=tail,verdict=verdict)),h['limits']['metadataBytes'])
    _fault('after_receipt')

def _verify(fd,h,hh):
    deadline = time.monotonic()+h['limits']['processSeconds']+10
    number,rh,sh,state = _reserve(fd,h,hh,'VERIFY')
    try:
        result = _run_child(_request(h,state,'VERIFY'),h)
        keys(result,('cursor','verdict'))
        _cursor_shape(result['cursor'],h['domain'])
        if state['segments'] and encoded(result['cursor']) != encoded(state['segments'][-1]['descriptor']['endCursor']):
            refuse('checker tail cursor binding')
        if result['verdict'] not in ('PREFIX_VERIFIED_G_OPEN','TINY_G_VERIFIED_CTB_OPEN'):
            refuse('checker verdict')
        if type(result['cursor']) is not dict or (result['verdict'] == 'TINY_G_VERIFIED_CTB_OPEN') != (result['cursor'].get('phase') == 'TERMINAL'):
            refuse('checker verdict/phase mismatch')
        if time.monotonic() >= deadline:
            refuse('host cooperative deadline')
        _receipt(fd,h,number,rh,sh,'OK',state['tail'],result['verdict'])
        return result
    except Exception:
        receipt_name = f'receipt-{number:06d}.json'
        if receipt_name not in os.listdir(fd):
            _receipt(fd,h,number,rh,sh,'ERROR',state['tail'],'REFUSED')
        raise

def _generate(fd,h,hh,max_events,cursor):
    deadline = time.monotonic()+h['limits']['processSeconds']+10
    number,rh,sh,state = _reserve(fd,h,hh,'GENERATE')
    try:
        result = _run_child(_request(h,state,'GENERATE',max_events,cursor),h)
        keys(result,('events','startCursor','endCursor','tables','dataset'))
        _cursor_shape(result['startCursor'],h['domain'])
        _cursor_shape(result['endCursor'],h['domain'])
        payload = _unb64(result['events'],h['limits']['segmentBytes'])
        ev = unpack_events(payload,h['limits']['segmentBytes'])
        if not ev or len(ev) > max_events or encoded(result['startCursor']) != encoded(cursor):
            refuse('empty/bad generated segment')
        index = len(state['segments'])
        prefix = f'segment-{index:06d}'
        tables = {}
        if type(result['tables']) is not dict or len(result['tables']) > h['domain']['target']:
            refuse('generated tables')
        for size,val in sorted(result['tables'].items()):
            if not size.isdecimal() or str(int(size)) != size:
                refuse('table size')
            width = integer(int(size),1,h['domain']['target'])
            raw = _unb64(val,ENGINE['bytes'])
            if len(raw)%width:
                refuse('table width')
            name = prefix+f'-table-{size}.bin'
            _write(fd,name,raw,ENGINE['bytes'])
            tables[size] = dict(width=width,count=len(raw)//width,sha256=sha(raw),file=name)
        data = _unb64(result['dataset'],ENGINE['bytes'])
        if len(data)%h['domain']['target']:
            refuse('data width')
        dn = prefix+'-dataset.bin'
        _write(fd,dn,data,ENGINE['bytes'])
        _write(fd,prefix+'-events.bin',payload,h['limits']['segmentBytes'])
        desc = dict(headerSha256=hh,index=index,predecessor=state['tail'],payloadSha256=sha(payload),
                    payloadBytes=len(payload),eventCount=len(ev),startCursor=cursor,endCursor=result['endCursor'],
                    tables=tables,dataset=dict(width=h['domain']['target'],count=len(data)//h['domain']['target'],sha256=sha(data),file=dn),invocation=number)
        dr = encoded(desc)
        _write(fd,prefix+'-descriptor.json',dr,h['limits']['metadataBytes'])
        _fault('after_staging')
        if time.monotonic() >= deadline:
            refuse('host cooperative deadline')
        commit = encoded(dict(headerSha256=hh,index=index,predecessor=state['tail'],descriptorSha256=sha(dr),reservation=rh,start=sh))
        temp = prefix+'-commit.tmp'
        _write(fd,temp,commit,h['limits']['metadataBytes'])
        os.link(temp,prefix+'-commit.json',src_dir_fd=fd,dst_dir_fd=fd,follow_symlinks=False)
        os.unlink(temp,dir_fd=fd)
        os.fsync(fd)
        _fault('after_commit')
        if time.monotonic() >= deadline:
            refuse('host cooperative deadline')
        _receipt(fd,h,number,rh,sh,'OK',sha(commit),'CAPTURED_UNACCEPTED')
    except Exception:
        if f'receipt-{number:06d}.json' not in os.listdir(fd):
            _receipt(fd,h,number,rh,sh,'ERROR',state['tail'],'REFUSED')
        raise

def create_session(directory,domain,limits=None):
    domain = domain_checked(domain)  # refuses139 BEFORE any source engine load
    lim = limits_checked(limits)
    fd = directory_fd(directory)
    try:
        if os.listdir(fd):
            refuse('session directory not empty')
        h = dict(format='WHOLE_G_P139_SEGMENTS_V1',profile='BUILD_TINY',root='LRC_P139_REPRODUCTION_075',
                 domain=domain,history=HISTORY.copy(),limits=lim,engineLimits=ENGINE.copy(),pins=_pins())
        raw = encoded(h)
        _parse_preflight(raw,lim['memory'])
        if len(raw) > lim['liveBytes'] or len(raw) > lim['writtenBytes']:
            refuse('genesis storage')
        _write(fd,'header.json',raw,lim['metadataBytes'])
        return dict(headerSha256=sha(raw),profile='BUILD_TINY',wholeGrant=0)
    except OSError:
        refuse('session file I/O')
    finally:
        os.close(fd)

def advance(directory,max_events=32):
    integer(max_events,1,ENGINE['events'])
    fd = directory_fd(directory)
    try:
        h,hh = _header(fd)
        state = _collect(fd,h,hh,partial=True)
        if state['phase'] == 2:
            # Valid CAPTURED tail, no orphan invocation: verification only.
            # A missing/error receipt is rejected by _collect, not retried.
            verified = _verify(fd,h,hh)
            final = _collect(fd,h,hh)
            return dict(verdict=verified['verdict'],cursor=verified['cursor'],segments=len(final['segments']),
                        chargedInvocations=final['count'],totalReservations=final['totals'],wholeAttempts=4,wholeGrant=0)
        if state['phase']:
            refuse('unfinished phase; reconciliation required')
        if state['segments'] and state['segments'][-1]['descriptor']['endCursor'].get('phase') == 'TERMINAL':
            refuse('terminal; no automatic new invocation')
        verified = _verify(fd,h,hh)
        _generate(fd,h,hh,max_events,verified['cursor'])
        verified = _verify(fd,h,hh)
        final = _collect(fd,h,hh)
        return dict(verdict=verified['verdict'],cursor=verified['cursor'],segments=len(final['segments']),
                    chargedInvocations=final['count'],totalReservations=final['totals'],wholeAttempts=4,wholeGrant=0)
    except OSError:
        refuse('session file I/O; preserve evidence and STOP')
    finally:
        os.close(fd)

def inspect_session(directory):
    fd = directory_fd(directory)
    try:
        h,hh = _header(fd)
        state = _collect(fd,h,hh,partial=True)
        if state['phase'] == 1:
            refuse('unfinished phase; reconciliation required')
        return dict(profile='BUILD_TINY',segments=len(state['segments']),chargedInvocations=state['count'],
                    totalReservations=state['totals'],lastRecordedVerdict=('CAPTURED_UNACCEPTED' if state['phase'] == 2 else state['lastVerdict']),
                    semanticVerified=False,wholeAttempts=4,wholeGrant=0,tail=state['tail'])
    except OSError:
        refuse('session file I/O; preserve evidence and STOP')
    finally:
        os.close(fd)

def _worker(request):
    keys(request,('header','action','segments','maxEvents','cursor'))
    h = request['header']
    keys(h,('format','profile','root','domain','history','limits','engineLimits','pins'))
    if h['profile'] != 'BUILD_TINY' or h['format'] != 'WHOLE_G_P139_SEGMENTS_V1' or h['root'] != 'LRC_P139_REPRODUCTION_075' or encoded(h['history']) != encoded(HISTORY) or encoded(h['engineLimits']) != encoded(ENGINE):
        refuse('worker scope')
    domain_checked(h['domain'])
    if h['limits'] != limits_checked(h['limits']) or any(os.environ.get(k) != 'false' for k in FLAGS):
        refuse('worker flags/limits')
    sources = _sources()
    if {k:sha(v) for k,v in sources.items()} != h['pins']:
        refuse('worker pins')
    action = request['action']
    if action not in ('VERIFY','GENERATE'):
        refuse('worker action')
    if type(request['segments']) is not list or len(request['segments']) > h['limits']['invocations']:
        refuse('worker segments')
    if action == 'GENERATE':
        integer(request['maxEvents'],1,ENGINE['events'])
        _cursor_shape(request['cursor'],h['domain'])
    elif type(request['maxEvents']) is not int or request['maxEvents'] != 0 or request['cursor'] is not None:
        refuse('verify request fields')
    for segment in request['segments']:
        keys(segment,('descriptor','events','tables','dataset'))
        keys(segment['descriptor'],('headerSha256','index','predecessor','payloadSha256','payloadBytes','eventCount','startCursor','endCursor','tables','dataset','invocation'))
        _cursor_shape(segment['descriptor']['startCursor'],h['domain'])
        _cursor_shape(segment['descriptor']['endCursor'],h['domain'])
        if type(segment['tables']) is not dict or len(segment['tables']) > h['domain']['target']:
            refuse('worker table shape')
        for val in (segment['events'],segment['dataset'],*segment['tables'].values()):
            if type(val) is not str or len(val) > 4*((ENGINE['bytes']+2)//3):
                refuse('worker blob shape')
    kind = 'checker' if action == 'VERIFY' else 'producer'
    namespace = dict(__name__='pinned_075c_'+kind,__file__=str(Path(__file__).absolute().parent/NAMES[kind]))
    exec(compile(sources[kind],NAMES[kind],'exec'),namespace)
    klass = namespace['Verifier' if action == 'VERIFY' else 'Engine']
    engine = klass(**h['domain'],limits=ENGINE)
    for segment in request['segments']:
        keys(segment,('descriptor','events','tables','dataset'))
        d = segment['descriptor']
        if encoded(engine.cursor()) != encoded(d['startCursor']):
            refuse('prefix start cursor')
        for event in unpack_events(_unb64(segment['events'],h['limits']['segmentBytes']),h['limits']['segmentBytes']):
            if action == 'VERIFY':
                engine.feed(event)
            elif engine.next_event() != event:
                refuse('producer reconstruction mismatch')
        tables = {k:_unb64(v,ENGINE['bytes']) for k,v in segment['tables'].items()}
        dataset = _unb64(segment['dataset'],ENGINE['bytes'])
        if encoded(engine.cursor()) != encoded(d['endCursor']) or engine.tables() != tables or engine.dataset() != dataset:
            refuse('prefix effects/table/data mismatch')
    if action == 'VERIFY':
        verdict = 'PREFIX_VERIFIED_G_OPEN'
        if engine.cursor()['phase'] == 'TERMINAL':
            result = engine.finish(engine.dataset(),engine.tables())
            keys(result,('status','semanticVerified','wholeGrant','wholeAttempts','rows'))
            if result['status'] != 'TINY_G_VERIFIED_CTB_OPEN' or result['semanticVerified'] is not True or type(result['wholeGrant']) is not int or result['wholeGrant'] != 0 or type(result['wholeAttempts']) is not int or result['wholeAttempts'] != 4:
                refuse('finish verdict')
            verdict = result['status']
        result = dict(cursor=engine.cursor(),verdict=verdict)
    else:
        integer(request['maxEvents'],1,ENGINE['events'])
        if encoded(engine.cursor()) != encoded(request['cursor']):
            refuse('independent cursor mismatch')
        start, payload = engine.cursor(),bytearray()
        for _ in range(request['maxEvents']):
            event = engine.next_event()
            if event is None:
                break
            if len(payload)+4+len(event) > h['limits']['segmentBytes']:
                refuse('segment bound; no partial event admission')
            payload.extend(struct.pack('<I',len(event)))
            payload.extend(event)
        result = dict(events=_b64(payload),startCursor=start,endCursor=engine.cursor(),
                      tables={k:_b64(v) for k,v in engine.tables().items()},dataset=_b64(engine.dataset()))
    if {k:sha(v) for k,v in _sources().items()} != h['pins']:
        refuse('worker final source drift')
    raw = encoded(result)
    if len(raw) > h['limits']['stdoutBytes']:
        refuse('worker stdout bound')
    return raw

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--build-tiny',action='store_true')
    parser.add_argument('--worker',action='store_true')
    args = parser.parse_args()
    if not args.build_tiny or not args.worker:
        refuse('default CLI/whole grant REFUSED')
    raw = sys.stdin.buffer.read(DEFAULTS['stdoutBytes']+1)
    result = _worker(decoded(raw,DEFAULTS['stdoutBytes']))
    sys.stdout.buffer.write(result)

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        sys.stderr.write('REFUSED: '+str(exc)[:240]+'\n')
        sys.exit(2)
