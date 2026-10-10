"""075A public collector, attempts3/4 only, NEVER semantic admission.
128MiB accounted host copies, NOT RSS/generic hostile JSON containment.
"""
import base64, hashlib, itertools, json, math, os, pathlib, selectors, stat, subprocess, sys, time

ROOT = "LRC_P139_REPRODUCTION_075"
SCOPE = "ALL_13_ENTRY_MULTISET_UNIT_ORBITS_P139_LEVEL_ONE"
FLAGS = ("RESEARCH_WORKER_ENABLED","MATH_PILOT_QUEUE_ENABLED","LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED","RESEARCH_CODEX_LOCAL_ENABLED","SANDBOX_DOCKER_ENABLED")
PRODUCER_SHA = "f9a43d77a498c0c0ed94d6df919c27a8d217fdfaae1e37556c41738eb5852bb8"
HISTORY_SHA = "45f873a6dbeb33f16467e86d1240bac4bcd540afe9ad615694e800209c8dce66"
LIMITS = {"nodes":2500000,"trace":8388608,"data":2097152,"memory":134217728,
          "stdout":16777216,"summary":262144,"source":30000,"seconds":120}
OUT, ERR, SUMMARY, MEMORY = 16777216,8192,262144,134217728
REPO = pathlib.Path(__file__).absolute().parents[2]

class CaptureRefused(Exception):
    pass

def require(ok,code):
    if not ok:
        raise CaptureRefused(code)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def json_bytes(value):
    return (json.dumps(value,sort_keys=True,separators=(",",":"))+"\n").encode("ascii")

def unique(pairs):
    out = {}
    for k,v in pairs:
        require(k not in out,"DUPLICATE_JSON_KEY")
        out[k] = v
    return out

def nonfinite(_):
    raise CaptureRefused("NONFINITE_JSON")

def parse(data):
    require(len(data)<=OUT and 7*len(data)+4194304<=MEMORY,"HOST_PARSE_BOUND")
    try:
        value = json.loads(data,object_pairs_hook=unique,parse_constant=nonfinite)
    except (ValueError,UnicodeError,RecursionError):
        raise CaptureRefused("MALFORMED_JSON") from None
    require(type(value) is dict,"OBJECT_REQUIRED")
    return value

def safe_dirs(path,create=False):
    current = pathlib.Path(path.anchor)
    for part in path.parts[1:]:
        current /= part
        if not current.exists() and create and not current.is_symlink():
            current.mkdir(mode=0o700)
        mode = current.lstat().st_mode
        require(stat.S_ISDIR(mode) and not stat.S_ISLNK(mode),"UNSAFE_DIRECTORY")

def read_regular(path,limit):
    safe_dirs(path.parent)
    fd = os.open(path,os.O_RDONLY|os.O_NOFOLLOW)
    try:
        require(stat.S_ISREG(os.fstat(fd).st_mode),"NONREGULAR_FILE")
        data = bytearray()
        while len(data)<=limit:
            block = os.read(fd,min(65536,limit+1-len(data)))
            if not block:
                break
            data.extend(block)
        require(len(data)<=limit,"FILE_BOUND")
        return bytes(data)
    finally:
        os.close(fd)

def create_only(directory,name,data):
    require(len(data)<=OUT,"WRITE_BOUND")
    parent = os.open(directory,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW)
    try:
        fd = os.open(name,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600,dir_fd=parent)
        try:
            view = memoryview(data)
            while view:
                n = os.write(fd,view)
                require(n>0,"SHORT_WRITE")
                view = view[n:]
            os.fsync(fd)
        finally:
            os.close(fd)
    finally:
        os.close(parent)

def stream_child(source,clock=time.monotonic,popen=subprocess.Popen):
    start = clock()
    child = popen([sys.executable,"-I","-S","-B",str(source)],stdin=subprocess.DEVNULL,
                  stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=dict.fromkeys(FLAGS,"false"),shell=False)
    selector,out,err = selectors.DefaultSelector(),bytearray(),bytearray()
    try:
        selector.register(child.stdout,selectors.EVENT_READ,True)
        selector.register(child.stderr,selectors.EVENT_READ,False)
        while selector.get_map():
            remain = 120-(clock()-start)
            require(remain>0,"CHILD_TIMEOUT")
            for key,_ in selector.select(min(remain,.1)):
                block = os.read(key.fileobj.fileno(),65536)
                if not block:
                    selector.unregister(key.fileobj)
                    continue
                target,cap = (out,OUT) if key.data else (err,ERR)
                require(len(target)+len(block)<=cap,"CHILD_STDOUT_EXCESS" if key.data else "CHILD_STDERR_EXCESS")
                target.extend(block)
        remain = 120-(clock()-start)
        require(remain>0,"CHILD_TIMEOUT")
        require(child.wait(timeout=remain)==0,"CHILD_EXIT")
        require(not err,"CHILD_STDERR_NONEMPTY")
        return bytes(out)
    except BaseException as error:
        if child.poll() is None:
            child.kill()
        child.wait(timeout=5)
        if isinstance(error,CaptureRefused):
            raise
        raise CaptureRefused("CHILD_TIMEOUT" if isinstance(error,subprocess.TimeoutExpired) else "CHILD_INTERRUPTED_OR_IO") from None
    finally:
        selector.close()
        child.stdout.close()
        child.stderr.close()

SOURCE_VALIDATOR = None

def load_validator(source, pin):
    require(all(os.environ.get(k)=="false" for k in FLAGS),"FLAGS_NOT_EXACTLY_OFF")
    require(len(source)<=30000 and digest(source)==pin,"VALIDATOR_SOURCE_PIN")
    namespace = {"__name__":"pinned_capture_schema"}
    # L2: only these already-verified OWN producer bytes. Definitions/imports only;
    # no author/path lookup, constructor/search or dynamic external source.
    # Fixed<=30k own AST/definitions startup budget4MiB is included in host
    # 7*stdout+4MiB preflight; not a generic code/JSON memory sandbox.
    exec(compile(source,"pinned-p139-v2","exec"),namespace)
    require(namespace.get("ROOT")==ROOT and namespace.get("SCOPE")==SCOPE
            and fixed(namespace.get("LIMITS",{}),LIMITS) and callable(namespace.get("capture_validate")),"VALIDATOR_EXPORTS")
    return namespace["capture_validate"]

def validate(value):
    require(SOURCE_VALIDATOR is not None,"PINNED_VALIDATOR_REQUIRED")
    try:
        return SOURCE_VALIDATOR(value)
    except (ValueError,TypeError,KeyError) as error:
        raise CaptureRefused(str(error)) from None

def fixed(value,expected):
    return all(type(value.get(k)) is type(v) and value.get(k)==v for k,v in expected.items())

def prior_receipt(directory,pin):
    r = parse(read_regular(directory/"attempt-3-receipt.json",SUMMARY))
    raw = read_regular(directory/"attempt-3-start.json",SUMMARY)
    s = parse(raw)
    identity = {"root":ROOT,"epoch":2,"attempt":3,"producerSha256":pin,"historySha256":HISTORY_SHA}
    require(fixed(s,identity) and set(s)==set(identity)|{"timeUnix"} and type(s["timeUnix"]) in (int,float)
            and math.isfinite(s["timeUnix"]) and s["timeUnix"]>0,"START_SCHEMA")
    require(fixed(r,{**identity,"terminal":True,"complete":False,"admittedRows":0,"semanticVerified":False,"status":"NOT_ESTABLISHED"})
            and r.get("startSha256")==digest(raw),"ATTEMPT3_TERMINAL_REQUIRED")
    require(set(r)==set(identity)|{"startSha256","terminal","status","complete","admittedRows","semanticVerified",
            "payloadSha256","payloadBytes","hostFailure","diagnostic","hostElapsedMs"},"RECEIPT_SCHEMA")
    require(type(r["hostElapsedMs"]) in (int,float) and math.isfinite(r["hostElapsedMs"]) and r["hostElapsedMs"]>=0,"RECEIPT_TIME")
    if r.get("hostFailure") is None:
        require(type(r.get("diagnostic")) is dict and not validate(r["diagnostic"]),"PRIOR_DIAGNOSTIC")
        payload = json_bytes(r["diagnostic"])
        require(r.get("payloadSha256")==digest(payload) and type(r.get("payloadBytes")) is int and r["payloadBytes"]==len(payload),"PRIOR_PAYLOAD_CHAIN")
    else:
        require(type(r["hostFailure"]) is str and len(r["hostFailure"])<=128 and r.get("diagnostic") is None
                and r.get("payloadSha256") is None and type(r.get("payloadBytes")) is int and r["payloadBytes"]==0,"PRIOR_HOST_FAILURE")

def collect(attempt,repo=REPO,producer_pin=PRODUCER_SHA,child=stream_child):
    require(type(attempt) is int and attempt in (3,4),"ATTEMPT_ID")
    require(all(os.environ.get(k)=="false" for k in FLAGS),"FLAGS_NOT_EXACTLY_OFF")
    safe_dirs(repo)
    source = repo/"scripts/operations/attempt-lrc-p139-generation-v2.py"
    source_bytes = read_regular(source,30000)
    require(len(producer_pin)==64 and digest(source_bytes)==producer_pin,"PRODUCER_PIN")
    require(digest(read_regular(repo/"docs/verification/TIP-075_MAIN_COMPLETION.md",SUMMARY))==HISTORY_SHA,"HISTORY_PIN")
    directory = repo/"docs/research/lrc-p139-075a-evidence"
    safe_dirs(directory,True)
    for suffix in ("start","receipt","candidate"):
        path = directory/f"attempt-{attempt}-{suffix}.json"
        require(not path.exists() and not path.is_symlink(),"PREEXISTING_OUTPUT")
    global SOURCE_VALIDATOR
    SOURCE_VALIDATOR = load_validator(source_bytes,producer_pin)
    if attempt==4:
        prior_receipt(directory,producer_pin)
    start = {"root":ROOT,"epoch":2,"attempt":attempt,"producerSha256":producer_pin,"historySha256":HISTORY_SHA,"timeUnix":time.time()}
    rawstart = json_bytes(start)
    create_only(directory,f"attempt-{attempt}-start.json",rawstart)
    value,payload,positive,failure = None,None,False,None
    begin = time.monotonic()
    try:
        payload = child(source)
        require(len(payload)<=OUT,"STDOUT_BYTES")
        require(digest(read_regular(source,30000))==producer_pin,"PRODUCER_POSTRUN_DRIFT")
        value = parse(payload)
        positive = validate(value)
        require(positive or len(payload)<=SUMMARY,"DIAGNOSTIC_BYTES")
    except Exception as error:
        failure = str(error) if isinstance(error,CaptureRefused) else "CAPTURE_OR_VALIDATION_FAILURE"
        value,payload,positive = None,None,False
    receipt = {"root":ROOT,"epoch":2,"attempt":attempt,"producerSha256":producer_pin,"historySha256":HISTORY_SHA,
               "startSha256":digest(rawstart),"terminal":True,"status":"COMPLETE_CANDIDATE_UNACCEPTED" if positive else "NOT_ESTABLISHED",
               "complete":positive,"admittedRows":0,"semanticVerified":False,"payloadSha256":digest(payload) if payload else None,
               "payloadBytes":len(payload) if payload else 0,"hostFailure":failure,"diagnostic":value if not positive else None,
               "hostElapsedMs":round(1000*(time.monotonic()-begin),3)}
    if positive:
        create_only(directory,f"attempt-{attempt}-candidate.json",payload)
    result = json_bytes(receipt)
    require(len(result)<=SUMMARY,"RECEIPT_BOUND")
    create_only(directory,f"attempt-{attempt}-receipt.json",result)
    return receipt

def main():
    try:
        require(len(sys.argv)==2 and sys.argv[1] in ("--attempt=3","--attempt=4"),"FIXED_ATTEMPT_CLI")
        read_regular(pathlib.Path(__file__).absolute(),12000)
        r = collect(int(sys.argv[1][-1]))
        output = {k:r[k] for k in ("root","epoch","attempt","status","complete","admittedRows","payloadSha256","payloadBytes","hostFailure")}
    except Exception as error:
        output = {"status":"NOT_ESTABLISHED","complete":False,"admittedRows":0,"hostFailure":str(error) if isinstance(error,CaptureRefused) else "HOST_REFUSED"}
    sys.stdout.buffer.write(json_bytes(output))

if __name__=="__main__":
    main()
