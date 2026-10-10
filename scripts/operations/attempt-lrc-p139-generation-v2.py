"""075A epoch2: entire p139 generation candidate, NEVER an accepted proof.
Fixed no-input/offline CLI. Search nodes and encoded bytes are separate units.
Primitive operations are telemetry. All loops share one120s deadline.
128MiB accounted allocation allowance is not an interpreter/RSS sandbox.
"""
import base64
import hashlib
import itertools
import json
import math
import os
import select
import struct
import sys
import time

FLAGS = ("RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED")
LIMITS = {"nodes": 2500000, "trace": 8388608, "data": 2097152, "memory": 134217728,
          "stdout": 16777216, "summary": 262144, "source": 30000, "seconds": 120}
ROOT = "LRC_P139_REPRODUCTION_075"
SCOPE = "ALL_13_ENTRY_MULTISET_UNIT_ORBITS_P139_LEVEL_ONE"


class Refused(Exception):
    def __init__(self, cap, phase):
        self.cap, self.phase = cap, phase
        super().__init__(cap + ":" + phase)


class Budget:
    def __init__(self, limits=None, clock=time.monotonic):
        limits = LIMITS.copy() if limits is None else limits
        if type(limits) is not dict or set(limits) != set(LIMITS):
            raise Refused("CONFIG", "LIMIT_KEYS")
        for key, value in limits.items():
            if (type(value) not in (int, float) or not math.isfinite(value) or value <= 0
                    or value > LIMITS[key] or (key != "seconds" and type(value) is not int)):
                raise Refused("CONFIG", "LIMIT_VALUE")
        self.limits, self.clock, self.start = limits.copy(), clock, clock()
        self.nodes = self.operations = self.memory = self.peak = self.data = 0
        self.trace = self.completed = self.extensions = 0
        self.phase = "INITIAL"
        self.context = {"size": None, "rootIndex": None, "private": None}

    def poll(self, units=1, phase=None):
        if phase is not None:
            self.phase = phase
        if self.clock() - self.start >= self.limits["seconds"]:
            raise Refused("TIME", self.phase)
        self.operations += units  # telemetry, never an artificial work cap

    def node(self):
        self.poll(1, "SEARCH_NODE")
        if self.nodes >= self.limits["nodes"]:
            raise Refused("NODES", self.phase)
        self.nodes += 1

    def reserve(self, count, phase="ALLOCATE"):
        self.poll(1, phase)
        if self.memory + count > self.limits["memory"]:
            raise Refused("MEMORY", phase)
        self.memory += count
        self.peak = max(self.peak, self.memory)

    def release(self, count):
        if count < 0 or count > self.memory:
            raise Refused("INTERNAL", "MEMORY_UNDERFLOW")
        self.memory -= count

    def metrics(self):
        return {"searchNodes": self.nodes, "primitiveOperations": self.operations,
                "encodedTraceBytes": self.trace, "encodedDatasetBytes": self.data,
                "accountedMemoryBytes": self.memory, "peakAccountedMemoryBytes": self.peak,
                "completedRoots": self.completed, "extensions": self.extensions,
                "elapsedMs": round((self.clock() - self.start) * 1000, 3)}


def flags_off(values):
    if type(values) is not dict or set(values) != set(FLAGS) or any(
            type(values[k]) is not str or values[k] != "false" for k in FLAGS):
        raise Refused("RUNTIME", "FLAGS_NOT_EXACTLY_OFF")


class Trace:
    def __init__(self, budget):
        self.b = budget
        self.length = 0
        self.b.reserve(self.b.limits["trace"] + 128, "PREALLOCATE_TRACE")
        self.buffer = bytearray(self.b.limits["trace"])

    def emit(self, value):
        self.b.poll(1 + len(value), "TRACE_WRITE")
        end = self.length + len(value)
        if end > self.b.limits["trace"]:
            raise Refused("TRACE", "TRACE_WRITE")
        # Same-size replacement only. Never append/extend or grow capacity.
        self.buffer[self.length:end] = value
        self.length = end
        self.b.trace = end


def make_domain(p, divisor, target, b):
    if (type(p) is not int or p < 3 or p > 139 or p % 2 == 0
            or type(divisor) is not int or not 2 <= divisor <= 140
            or type(target) is not int or not 1 <= target <= 13):
        raise Refused("DOMAIN", "BOUNDED_HELPER_DOMAIN")
    for d in range(2, math.isqrt(p) + 1):
        b.poll(1, "PRIME_CHECK")
        if p % d == 0:
            raise Refused("DOMAIN", "NONPRIME")
    n = (p - 1) // 2
    b.reserve(4096 + 256 * n + 4 * n * n, "DOMAIN_TABLES")
    masks, coverers, actions = [], [0] * n, []
    for v in range(1, n + 1):
        mask = 0
        for t in range(1, n + 1):
            b.poll(1, "MASK_COORDINATE")
            r = v * t % p
            if divisor * min(r, p - r) < p:
                mask |= 1 << (t - 1)
                coverers[t - 1] |= 1 << (v - 1)
        masks.append(mask)
    m = masks[0].bit_count()
    if not m or any(x.bit_count() != m for x in masks + coverers):
        raise Refused("DOMAIN", "MASK_CARDINALITY")
    for g in range(1, n + 1):
        b.poll(n, "UNIT_TABLE")
        actions.append(bytes(min(g * v % p, (-g * v) % p) for v in range(1, n + 1)))
    return masks, coverers, actions


def schedule(n, m, target):
    return [(s, max(1, (2 * n - m * s + s - 1) // s))
            for s in range((n + m - 1) // m, target + 1)]


def bits(value):
    while value:
        bit = value & -value
        yield bit.bit_length() - 1
        value ^= bit


def top_gain(histogram, slots):
    total = 0
    for gain in range(len(histogram) - 1, -1, -1):
        take = min(slots, histogram[gain])
        total += gain * take
        slots -= take
        if not slots:
            break
    return total


def canonical(row, actions, b):
    b.reserve(4096, "CANONICAL_TEMP")
    try:
        best = None
        for action in actions:
            b.poll(1 + len(row), "UNIT_IMAGE")
            image = bytes(sorted(action[v - 1] for v in row))
            if best is None or image < best:
                best = image
        return best
    finally:
        b.release(4096)


class Generator:
    def __init__(self, p=139, divisor=14, target=13, budget=None):
        self.b = budget if budget is not None else Budget()
        self.p, self.divisor, self.target = p, divisor, target
        self.masks, self.coverers, self.actions = make_domain(p, divisor, target, self.b)
        self.n, self.m = len(self.masks), self.masks[0].bit_count()
        self.full = (1 << self.n) - 1
        self.trace = Trace(self.b)
        self.trace.emit(b"LRC139G1\n")
        self.b.reserve(4096, "SET_AND_ROOT_HEADERS")
        self.rows, self.supports, self.roots = set(), {}, []

    def add(self, collection, row, final=False):
        self.b.poll(1, "DEDUP")
        if row in collection:
            return
        if final and self.b.data + self.target > self.b.limits["data"]:
            raise Refused("DATA", "UNIQUE_ROW_INSERT")
        # Bytes header/key + hash table slack AND transient old/new tables.
        # No individual entry is removed while its set remains allocated.
        self.b.reserve(256 + len(row), "SET_INSERT_PRECHARGE")
        collection.add(row)
        if final:
            self.b.data += self.target

    def root(self, size, private_times, root_index, minimal):
        b = self.b
        b.context = {"size": size, "rootIndex": root_index, "private": private_times}
        b.reserve(4096, "ROOT_TEMP")
        start, first = self.trace.length, b.nodes
        self.trace.emit(bytes([244, size, len(private_times), *private_times]))
        excluded = 0
        for t in private_times:
            b.poll(1, "ROOT_PRIVATE")
            excluded |= self.coverers[t - 1]
        available = self.full & ~excluded

        def visit(selected, covered, private, avail, slots):
            b.node()
            b.reserve(4096, "SEARCH_FRAME")
            try:
                b.poll(len(private), "PRIVATE_SCAN")
                if any(not x for x in private):
                    self.trace.emit(b"\0")
                    return
                uncovered = self.full ^ covered
                if not slots:
                    if uncovered:
                        self.trace.emit(b"\2")
                    else:
                        self.trace.emit(b"\1")
                        self.add(minimal, canonical(bytes(v + 1 for v in sorted(selected)), self.actions, b))
                    return
                b.poll(1, "CAPACITY")
                if not uncovered or uncovered.bit_count() > self.m * slots or avail.bit_count() < slots:
                    self.trace.emit(b"\3")
                    return
                union, histogram = 0, [0] * (self.m + 1)
                for v in bits(avail):
                    b.poll(1, "GAIN_SCAN")
                    union |= self.masks[v]
                    histogram[(self.masks[v] & uncovered).bit_count()] += 1
                if uncovered & ~union:
                    self.trace.emit(b"\4")
                    return
                b.poll(self.m + 1, "TOP_GAIN_HISTOGRAM")
                if top_gain(histogram, slots) < uncovered.bit_count():
                    self.trace.emit(b"\5")
                    return
                pivot, count = None, self.n + 1
                for t in bits(uncovered):
                    b.poll(1, "PIVOT_TRANSPOSE_SCAN")
                    value = (avail & self.coverers[t]).bit_count()
                    if value < count:
                        pivot, count = t, value
                options = avail & self.coverers[pivot]
                self.trace.emit(bytes([6, pivot + 1, count, *[v + 1 for v in bits(options)]]))
                remaining = avail
                for v in bits(options):
                    b.poll(1 + len(private), "SIBLING_PRIVATE_UPDATE")
                    remaining &= ~(1 << v)
                    mask = self.masks[v]
                    visit(selected + [v], covered | mask,
                          [x & ~mask for x in private] + [mask & ~covered], remaining, slots - 1)
            finally:
                b.release(4096)
        try:
            visit([0], self.masks[0], [self.masks[0]], available, size - 1)
            length, nodes = self.trace.length - start, b.nodes - first
            self.trace.emit(bytes([245]) + struct.pack("<II", nodes, length))
            b.reserve(1024, "ROOT_METADATA")
            self.roots.append({"size": size, "private": list(private_times), "nodes": nodes, "traceBytes": length})
            b.completed += 1
        finally:
            b.release(4096)

    def extend(self, size, minimal):
        b = self.b
        # sorted pointer list plus bytes.join's temporary Py_buffer descriptors.
        temporary = 4096 + 128 * len(minimal)
        b.reserve(temporary, "SUPPORT_SORT")
        try:
            b.poll(len(minimal), "SUPPORT_SORT")
            ordered = sorted(minimal)
            support_bytes = size * len(ordered)
            b.reserve(support_bytes + 128, "RETAIN_SUPPORT_TABLE")
            table = b"".join(ordered)
            self.supports[str(size)] = {"count": len(ordered), "width": size, "raw": table}
            for index, support in enumerate(ordered):
                b.context = {"size": size, "rootIndex": "EXTENSIONS", "supportIndex": index, "private": None}
                b.reserve(4096, "EXTENSION_TEMP")
                try:
                    for extension in itertools.combinations_with_replacement(range(1, self.n + 1), self.target - size):
                        b.poll(1 + len(extension), "GENERATE_EXTENSION")
                        b.extensions += 1
                        image = canonical(bytes(sorted(support + bytes(extension))), self.actions, b)
                        self.trace.emit(bytes([246, size, len(extension)]) + struct.pack("<I", index)
                                        + bytes(extension) + image)
                        self.add(self.rows, image, final=True)
                finally:
                    b.release(4096)
            b.poll(1, "SUPPORT_FINISHED")
        finally:
            b.release(temporary)

    def run(self):
        root_index = 0
        for size, q in schedule(self.n, self.m, self.target):
            self.b.reserve(256, "MINIMAL_SET_HEADER")
            minimal = set()
            bad = tuple(t + 1 for t in bits(self.masks[0]))
            for private in itertools.combinations(bad, q):
                self.root(size, private, root_index, minimal)
                root_index += 1
            self.extend(size, minimal)
            charged = 256 + sum(256 + len(row) for row in minimal)
            minimal.clear()
            del minimal
            self.b.release(charged)
        self.b.poll(1, "ROOT_COMPLETENESS")
        if root_index != sum(math.comb(self.m, q) for _, q in schedule(self.n, self.m, self.target)):
            raise Refused("INTERNAL", "ROOT_COUNT")
        return self

    def candidate(self):
        b = self.b
        b.poll(1, "OUTPUT_START")
        support_total = sum(len(x["raw"]) for x in self.supports.values())
        raw_total = self.trace.length + b.data + support_total
        # This is WORKING memory, not encoded stdout. Covers sort arrays, joined
        # blobs, base64 bytes+strings, JSON fragment/join strings and UTF8 copy.
        reserve = 1048576 + 128 * len(self.rows) + 9 * raw_total
        b.reserve(reserve, "OUTPUT_WORKING_PREFLIGHT")
        try:
            b.poll(len(self.rows), "FINAL_ROW_SORT")
            data = b"".join(sorted(self.rows))
            trace = bytes(memoryview(self.trace.buffer)[:self.trace.length])
            metadata = {"status": "COMPLETE_CANDIDATE_UNACCEPTED", "complete": True,
                        "admittedRows": 0, "root": ROOT, "epoch": 2, "scope": SCOPE,
                        "prime": self.p, "movingSpeeds": self.target, "boundary": "STRICT_OPEN_BAD",
                        "tauAssumption": False, "encoding": "LRC139G1_PREORDER_EXTENSIONS_U8",
                        "roots": self.roots, "extensions": b.extensions, "candidateRows": len(self.rows),
                        "minimalSupports": {s: {"count": x["count"], "width": x["width"], "data": ""}
                                            for s, x in self.supports.items()},
                        "trace": "", "dataset": "", "traceSha256": hashlib.sha256(trace).hexdigest(),
                        "datasetSha256": hashlib.sha256(data).hexdigest(), "metrics": b.metrics(),
                        "metricsBoundary": "AFTER_BLOBS_BEFORE_FINAL_JSON",
                        "limits": b.limits, "closure": {"G": "UNACCEPTED_CANDIDATE", "C": "OPEN", "T": "OPEN", "B": "OPEN"}}
            b.poll(1, "OUTPUT_METADATA")
            empty = json.dumps(metadata, sort_keys=True, separators=(",", ":"))
            lengths = [len(trace), len(data)] + [len(x["raw"]) for x in self.supports.values()]
            blob_length = sum(4 * ((n + 2) // 3) for n in lengths)
            exact = len(empty) + blob_length + 1
            if len(empty) > b.limits["summary"]:
                raise Refused("SUMMARY", "METADATA_BYTES")
            if exact + 1024 > b.limits["stdout"]:
                raise Refused("STDOUT", "EXACT_BASE64_PREFLIGHT")
            b.poll(len(trace), "TRACE_BASE64")
            metadata["trace"] = base64.b64encode(trace).decode("ascii")
            b.poll(len(data), "DATA_BASE64")
            metadata["dataset"] = base64.b64encode(data).decode("ascii")
            for s, support in self.supports.items():
                b.poll(len(support["raw"]), "SUPPORT_BASE64")
                metadata["minimalSupports"][s]["data"] = base64.b64encode(support["raw"]).decode("ascii")
            b.poll(1, "JSON_ENCODING")
            metadata["metrics"] = b.metrics()
            plain = dict(metadata, trace="", dataset="")
            plain["minimalSupports"] = {s: dict(x, data="") for s, x in metadata["minimalSupports"].items()}
            exact = len(json.dumps(plain, sort_keys=True, separators=(",", ":"))) + blob_length + 1
            if exact > b.limits["stdout"]:
                raise Refused("STDOUT", "FINAL_EXACT_PREFLIGHT")
            result = json.dumps(metadata, sort_keys=True, separators=(",", ":")) + "\n"
            if len(result) != exact:
                raise Refused("ENCODING", "EXACT_SIZE_MISMATCH")
            b.poll(1, "OUTPUT_FINISHED")
            return result
        finally:
            b.release(reserve)


CAPTURE_MEMORY, CAPTURE_OUT = 134217728, 16777216


def capture_require(ok, code):
    if not ok:
        raise ValueError(code)


def capture_digest(data):
    return hashlib.sha256(data).hexdigest()


def capture_integer(v,maximum):
    return type(v) is int and 0<=v<=maximum

def capture_fixed(value,expected):
    return all(type(value.get(k)) is type(v) and value.get(k)==v for k,v in expected.items())

def capture_blob(text,maximum,expected=None):
    capture_require(type(text) is str and text.isascii() and len(text)%4==0,"BASE64_FORMAT")
    capture_require(len(text)<=4*((maximum+2)//3),"BASE64_BOUND")
    if expected is not None:
        capture_require(len(text)==4*((expected+2)//3),"BASE64_COUNT")
    try:
        raw = base64.b64decode(text,validate=True)
    except ValueError:
        raise ValueError("BASE64_FORMAT") from None
    capture_require(len(raw)<=maximum and (expected is None or len(raw)==expected),"BASE64_LENGTH")
    capture_require(base64.b64encode(raw).decode("ascii")==text,"BASE64_CANONICAL")
    return raw

def capture_ordered(raw,width,distinct=False):
    previous = None
    for i in range(0,len(raw),width):
        row = raw[i:i+width]
        capture_require(all(1<=v<=69 for v in row) and row==bytes(sorted(row)),"ROW_RANGE_ORDER")
        capture_require(not distinct or len(set(row))==width,"SUPPORT_DISTINCT")
        capture_require(previous is None or previous<row,"ROW_DUPLICATE_ORDER")
        previous = row

def capture_validate(value):
    capture_require(capture_fixed(value,{"root":ROOT,"epoch":2,"scope":SCOPE,"prime":139,"movingSpeeds":13,"admittedRows":0}),"DOMAIN_OR_ADMISSION_DRIFT")
    positive = value.get("status")=="COMPLETE_CANDIDATE_UNACCEPTED"
    capture_require(type(value.get("complete")) is bool and value["complete"]==positive and value.get("closure")==
            {"G":"UNACCEPTED_CANDIDATE" if positive else "OPEN","C":"OPEN","T":"OPEN","B":"OPEN"},"STATUS_CLOSURE_DRIFT")
    capture_require(type(value.get("limits")) is dict and capture_fixed(value["limits"],LIMITS) and set(value["limits"])==set(LIMITS),"LIMIT_SCHEMA")
    m = value.get("metrics")
    bounds = {"searchNodes":2500000,"primitiveOperations":2**63-1,"encodedTraceBytes":8388608,
              "encodedDatasetBytes":2097152,"accountedMemoryBytes":CAPTURE_MEMORY,"peakAccountedMemoryBytes":CAPTURE_MEMORY,
              "completedRoots":409,"extensions":419431}
    capture_require(type(m) is dict and set(m)==set(bounds)|{"elapsedMs"} and all(capture_integer(m[k],v) for k,v in bounds.items()),"METRICS_SCHEMA")
    capture_require(type(m["elapsedMs"]) in (int,float) and math.isfinite(m["elapsedMs"]) and m["elapsedMs"]>=0
            and m["accountedMemoryBytes"]<=m["peakAccountedMemoryBytes"],"METRICS_RANGE")
    if not positive:
        capture_require(set(value)=={"status","complete","admittedRows","root","epoch","scope","prime","movingSpeeds","failure","context","metrics","limits","closure"}
                and value["status"]=="NOT_ESTABLISHED","PARTIAL_PAYLOAD")
        f,c = value["failure"],value["context"]
        capture_require(type(f) is dict and set(f)=={"cap","phase"} and all(type(x) is str and len(x)<=128 for x in f.values()),"FAILURE_SCHEMA")
        capture_require(type(c) is dict and {"size","rootIndex","private"}<=set(c)<={"size","rootIndex","private","supportIndex"},"CONTEXT_SCHEMA")
        capture_require(c["size"] is None or (type(c["size"]) is int and 8<=c["size"]<=13),"CONTEXT_SIZE")
        capture_require(c["rootIndex"] is None or c["rootIndex"]=="EXTENSIONS" or capture_integer(c["rootIndex"],408),"CONTEXT_ROOT")
        private = c["private"]
        capture_require(private is None or (type(private) is list and len(private)<=9
                        and all(type(x) is int and 1<=x<=9 for x in private) and private==sorted(set(private))),"CONTEXT_PRIVATE")
        capture_require("supportIndex" not in c or capture_integer(c["supportIndex"],2500000),"CONTEXT_SUPPORT")
        return False
    capture_require(value.get("tauAssumption") is False and value.get("boundary")=="STRICT_OPEN_BAD"
            and value.get("encoding")=="LRC139G1_PREORDER_EXTENSIONS_U8"
            and value.get("metricsBoundary")=="AFTER_BLOBS_BEFORE_FINAL_JSON","PREMISE_ENCODING")
    capture_require(set(value)=={"status","complete","admittedRows","root","epoch","scope","prime","movingSpeeds",
                    "boundary","tauAssumption","encoding","roots","extensions","candidateRows","minimalSupports",
                    "trace","dataset","traceSha256","datasetSha256","metrics","metricsBoundary","limits","closure"},"POSITIVE_SCHEMA")
    capture_require(capture_integer(value.get("candidateRows"),2097152//13)
            and capture_integer(value.get("extensions"),419430) and value["extensions"]==m["extensions"],"ROW_EXTENSION_COUNTS")
    roots = value.get("roots")
    expected = [(s,list(p)) for s,q in [(8,9),(9,7),(10,5),(11,4),(12,3),(13,2)] for p in itertools.combinations(range(1,10),q)]
    capture_require(type(roots) is list and len(roots)==409 and m["completedRoots"]==409,"ROOTS_SCHEMA")
    for r,(s,p) in zip(roots,expected):
        capture_require(type(r) is dict and set(r)=={"size","private","nodes","traceBytes"} and type(r["size"]) is int and r["size"]==s
                and type(r["private"]) is list and r["private"]==p and all(type(x) is int for x in r["private"])
                and capture_integer(r["nodes"],2500000) and r["nodes"]>0 and capture_integer(r["traceBytes"],8388608) and r["traceBytes"]>0,"ROOT_DESCRIPTOR")
    capture_require(sum(r["nodes"] for r in roots)==m["searchNodes"],"ROOT_NODE_TOTAL")
    trace = capture_blob(value.get("trace"),8388608)
    data = capture_blob(value.get("dataset"),2097152,13*value["candidateRows"])
    capture_require(trace.startswith(b"LRC139G1\n") and len(trace)==m["encodedTraceBytes"] and len(data)==m["encodedDatasetBytes"],"BLOB_METRICS_HEADER")
    capture_require(capture_digest(trace)==value.get("traceSha256") and capture_digest(data)==value.get("datasetSha256"),"BLOB_HASH")
    capture_ordered(data,13)
    tables = value.get("minimalSupports")
    capture_require(type(tables) is dict and set(tables)==set(map(str,range(8,14))),"SUPPORT_SPECTRUM")
    total = extension_bytes = 0
    for k,t in tables.items():
        capture_require(type(t) is dict and set(t)=={"width","count","data"} and type(t["width"]) is int and t["width"]==int(k)
                and capture_integer(t["count"],2500000),"SUPPORT_COUNTS")
        capture_ordered(capture_blob(t["data"],CAPTURE_OUT,t["width"]*t["count"]),t["width"],True)
        extensions = t["count"] * math.comb(68 + 13 - t["width"],13 - t["width"])
        total += extensions
        extension_bytes += extensions * (33 - t["width"])
    capture_require(total==value["extensions"] and (total==0)==(value["candidateRows"]==0),"EXTENSION_COHERENCE")
    capture_require(len(trace)==9+sum(r["traceBytes"]+9 for r in roots)+extension_bytes,"TRACE_LENGTH_COHERENCE")
    return True


def diagnostic(error, b):
    # Constant bounded terminal reporting only, outside exhausted mathematical work.
    body = {"status": "NOT_ESTABLISHED", "complete": False, "admittedRows": 0,
            "root": ROOT, "epoch": 2, "scope": SCOPE, "prime": 139, "movingSpeeds": 13,
            "failure": {"cap": error.cap, "phase": error.phase}, "context": b.context,
            "metrics": b.metrics(), "limits": b.limits,
            "closure": {"G": "OPEN", "C": "OPEN", "T": "OPEN", "B": "OPEN"}}
    output = json.dumps(body, sort_keys=True, separators=(",", ":")) + "\n"
    if len(output) > LIMITS["summary"]:
        return '{"status":"NOT_ESTABLISHED","complete":false,"admittedRows":0}\n'
    return output


def main():
    b = Budget()
    try:
        if len(sys.argv) != 1:
            raise Refused("RUNTIME", "NO_INPUT_CLI")
        flags_off({key: os.environ.get(key) for key in FLAGS})
        if not sys.stdin.isatty():
            fd = sys.stdin.fileno()
            if not select.select([fd], [], [], 0)[0] or os.read(fd, 1):
                raise Refused("RUNTIME", "NO_STDIN_INPUT")
        with open(__file__, "rb") as source:
            if len(source.read(LIMITS["source"] + 1)) > LIMITS["source"]:
                raise Refused("SOURCE", "SOURCE_BYTES")
        output = Generator(budget=b).run().candidate()
    except Refused as error:
        output = diagnostic(error, b)
    except (KeyboardInterrupt, MemoryError, OverflowError, RecursionError):
        output = diagnostic(Refused("RUNTIME", "INTERRUPTION_OR_MEMORY"), b)
    except Exception:
        output = diagnostic(Refused("RUNTIME", "UNEXPECTED_FAILURE"), b)
    sys.stdout.write(output)


if __name__ == "__main__":
    main()
