"""TIP-075 bounded WHOLE generation candidate; no author code or tau premise.

Fixed no-input CLI. COMPLETE_CANDIDATE is UNACCEPTED pending a separate checker.
Tests may exercise tiny domains/lower limits, never increase production ceilings.
Charged work is deliberately more conservative than the old recursion-node cap.
Accounted storage is algorithmic storage, NOT a hard interpreter RSS guarantee.
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

FLAGS = (
    "RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED",
    "LRC_CAMPAIGN_LOCAL_ENABLED", "RESEARCH_OPENAI_ENABLED",
    "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED",
)
MAXIMA = {"work": 2500000, "trace": 8388608, "data": 2097152,
          "summary": 262144, "source": 30000, "envelope": 16777216,
          "seconds": 120}
ROOT = "LRC_P139_REPRODUCTION_075"
SCOPE = "ALL_13_ENTRY_MULTISET_UNIT_ORBITS_P139_LEVEL_ONE"


class Refused(Exception):
    def __init__(self, cap, phase):
        self.cap, self.phase = cap, phase
        super().__init__(cap + ":" + phase)


class Budget:
    def __init__(self, caps=None, clock=time.monotonic):
        caps = MAXIMA.copy() if caps is None else caps
        if type(caps) is not dict or set(caps) != set(MAXIMA):
            raise Refused("CONFIG", "CAP_KEYS")
        for key, value in caps.items():
            if (type(value) not in (int, float) or isinstance(value, bool)
                    or not math.isfinite(value) or value <= 0
                    or value > MAXIMA[key]
                    or (key != "seconds" and type(value) is not int)):
                raise Refused("CONFIG", "CAP_VALUE")
        self.caps, self.clock = caps.copy(), clock
        self.start = clock()
        self.work = self.nodes = self.trace = self.scratch = self.data = 0
        self.encoded_trace = 0
        self.completed_roots = 0
        self.peak_scratch = self.peak_data = self.peak_envelope = 0
        self.phase = "INITIAL"
        self.context = {"size": None, "rootIndex": None, "private": None}

    def tick(self, units=1, phase=None):
        if phase is not None:
            self.phase = phase
        if self.clock() - self.start >= self.caps["seconds"]:
            raise Refused("TIME", self.phase)
        if self.work + units > self.caps["work"]:
            raise Refused("WORK", self.phase)
        self.work += units

    def store(self, kind, count):
        self.tick(1, "ALLOCATE_" + kind.upper())
        if kind == "trace":
            if self.trace + self.scratch + count > self.caps["trace"]:
                raise Refused("TRACE_OR_SCRATCH", self.phase)
            self.trace += count
        elif kind == "scratch":
            if self.trace + self.scratch + count > self.caps["trace"]:
                raise Refused("TRACE_OR_SCRATCH", self.phase)
            self.scratch += count
            self.peak_scratch = max(self.peak_scratch, self.scratch)
        elif kind == "data":
            if self.data + count > self.caps["data"]:
                raise Refused("DATA_WITH_OVERHEAD", self.phase)
            self.data += count
            self.peak_data = max(self.peak_data, self.data)
        else:
            raise Refused("CONFIG", "STORAGE_KIND")

    def release(self, kind, count):
        if count > getattr(self, kind):
            raise Refused("INTERNAL", "STORAGE_UNDERFLOW")
        setattr(self, kind, getattr(self, kind) - count)

    def envelope(self, count):
        self.tick(1, "OUTPUT_PREFLIGHT")
        if count > self.caps["envelope"]:
            raise Refused("ENVELOPE", self.phase)
        self.peak_envelope = max(self.peak_envelope, count)

    def metrics(self):
        return {"work": self.work, "searchNodes": self.nodes,
                "completedRoots": self.completed_roots,
                "encodedTraceBytes": self.encoded_trace,
                "accountedTraceBytes": self.trace, "accountedScratchBytes": self.scratch,
                "accountedDataBytes": self.data,
                "peakScratchBytes": self.peak_scratch,
                "peakDataBytes": self.peak_data,
                "peakEnvelopeBytes": self.peak_envelope,
                "elapsedMs": round(1000 * (self.clock() - self.start), 3)}


def check_flags(values):
    # Read only these six flags; never enumerate/report environment values.
    if type(values) is not dict or set(values) != set(FLAGS):
        raise Refused("RUNTIME", "FLAG_KEYS")
    if any(type(values[k]) is not str or values[k] != "false" for k in FLAGS):
        raise Refused("RUNTIME", "FLAGS_NOT_EXACTLY_OFF")


def domain(prime, divisor, budget):
    """Exact masks/action table. Tiny test domains only; CLI fixes139/14."""
    n = (prime - 1) // 2
    if prime < 3 or prime % 2 == 0 or divisor < 2:
        raise Refused("DOMAIN", "BAD_PARAMETERS")
    for d in range(2, math.isqrt(prime) + 1):
        budget.tick(1, "PRIME_CHECK")
        if prime % d == 0:
            raise Refused("DOMAIN", "NONPRIME")
    storage = 128 + 32 * n + 32 * n * n
    budget.store("scratch", storage)
    masks, actions = [], []
    for v in range(1, n + 1):
        mask = 0
        for t in range(1, n + 1):
            budget.tick(1, "MASK_COORDINATE")
            residue = v * t % prime
            if divisor * min(residue, prime - residue) < prime:
                mask |= 1 << (t - 1)
        masks.append(mask)
    cardinality = masks[0].bit_count()
    for mask in masks:
        budget.tick(1, "MASK_CARDINALITY")
        if mask.bit_count() != cardinality:
            raise Refused("DOMAIN", "UNEQUAL_MASKS")
    for g in range(1, n + 1):
        row = []
        for v in range(1, n + 1):
            budget.tick(1, "UNIT_TABLE_COORDINATE")
            z = g * v % prime
            row.append(min(z, prime - z))
        actions.append(row)
    return masks, actions, storage


def root_schedule(n, cardinality, target):
    if cardinality < 1 or target < 1:
        raise Refused("DOMAIN", "EMPTY_COVER_MASK")
    lo = (n + cardinality - 1) // cardinality
    return [(s, max(1, (2 * n - cardinality * s + s - 1) // s))
            for s in range(lo, target + 1)]


def charged_sort(values, budget):
    """Insertion sort exposes comparisons/moves, up to69 gain entries."""
    out = []
    for value in values:
        budget.tick(1, "SORT_INSERT")
        pos = len(out)
        while pos:
            budget.tick(1, "SORT_COMPARISON")
            if out[pos - 1] <= value:
                break
            pos -= 1
        out.insert(pos, value)
    return tuple(out)


def canonical(row, actions, budget):
    # image list + sorting list + output tuple + retained best coexist.
    scratch = 768 + 96 * len(row)
    budget.store("scratch", scratch)
    try:
        best = None
        for action in actions:
            budget.tick(1, "UNIT_IMAGE")
            image = []
            for v in row:
                budget.tick(1, "UNIT_COORDINATE")
                image.append(action[v - 1])
            image = charged_sort(image, budget)
            budget.tick(len(row), "UNIT_LEX_COMPARISON")
            if best is None or image < best:
                best = image
        return best
    finally:
        budget.release("scratch", scratch)


class TraceChunks:
    """Exact-size linked tuple/bytes nodes; no growable bytearray capacity.

    Retained node and bytes sizes are reserved BEFORE each tuple allocation.
    Linked nodes avoid any hidden list-capacity growth during mathematical search.
    """
    LINK_BYTES = sys.getsizeof((None, None))

    def __init__(self, budget):
        budget.store("scratch", 256)
        self.budget, self.head, self.length, self.count = budget, None, 0, 0

    def __len__(self):
        return self.length

    def extend(self, value):
        if type(value) is not bytes:
            raise Refused("ENCODING", "TRACE_BYTES_ONLY")
        self.budget.store("trace", self.LINK_BYTES + sys.getsizeof(value))
        self.head = (value, self.head)
        self.length += len(value)
        self.count += 1
        self.budget.encoded_trace = self.length

    def encode(self):
        # Caller preflight includes this pointer list and final joined bytes.
        parts, node = [], self.head
        while node is not None:
            self.budget.tick(2, "TRACE_LINK_ENCODING")
            parts.append(node[0])
            node = node[1]
        self.budget.tick(max(1, self.count), "TRACE_REVERSE")
        parts.reverse()
        self.budget.tick(max(1, self.length // 64), "TRACE_JOIN")
        return b"".join(parts)


class Generator:
    def __init__(self, prime=139, divisor=14, target=13, caps=None, clock=time.monotonic, budget=None):
        if budget is not None and caps is not None:
            raise Refused("CONFIG", "MULTIPLE_BUDGETS")
        self.budget = Budget(caps, clock) if budget is None else budget
        self.prime, self.divisor, self.target = prime, divisor, target
        self.masks, self.actions, self.domain_bytes = domain(prime, divisor, self.budget)
        self.n, self.full = len(self.masks), (1 << len(self.masks)) - 1
        self.cardinality = self.masks[0].bit_count()
        self.trace = TraceChunks(self.budget)
        self.roots = []
        self.minimal = {}
        self.rows = set()
        self.extensions = 0
        self.emit(b"LRC139G1\n")

    def emit(self, values):
        self.trace.extend(values)

    def add_row(self, collection, row, final=False):
        b = self.budget
        b.tick(1, "UNION_DEDUP_LOOKUP")
        if row not in collection:
            # Conservative tuple/set/encoded-row reserve BEFORE insertion.
            reserve = 192 + 9 * len(row)
            b.store("data" if final else "scratch", reserve)
            collection.add(row)

    def search_root(self, size, private_times, root_index):
        b = self.budget
        # Bounded diagnostic context precedes possible entry/work/storage refusal.
        b.context = {"size": size, "rootIndex": root_index,
                     "private": private_times}
        b.tick(1, "ROOT_CONSTRUCTION")
        root_scratch = 512 + 32 * self.n
        b.store("scratch", root_scratch)
        root_start, before_nodes = len(self.trace), b.nodes
        self.emit(bytes([244, size, len(private_times), *private_times]))
        private_mask = 0
        for t in private_times:
            b.tick(1, "ROOT_PRIVATE_MASK")
            private_mask |= 1 << (t - 1)
        available = []
        for v in range(1, self.n):
            b.tick(1, "ROOT_AVAILABLE_SCAN")
            if not self.masks[v] & private_mask:
                available.append(v)
        collection = self.minimal[size]

        def visit(selected, covered, private, avail, slots):
            b.tick(1, "SEARCH_NODE")
            b.nodes += 1
            # selected/private/options/remaining/gains/sorted gains and children.
            scratch = 1024 + 256 * (len(selected) + len(avail))
            b.store("scratch", scratch)
            try:
                for mask in private:
                    b.tick(1, "PRIVATE_SCAN")
                    if not mask:
                        self.emit(bytes([0]))
                        return
                b.tick(1, "UNCOVERED_MASK")
                uncovered = self.full ^ covered
                if slots == 0:
                    if uncovered:
                        self.emit(bytes([2]))
                    else:
                        self.emit(bytes([1]))
                        row = charged_sort([v + 1 for v in selected], b)
                        self.add_row(collection, canonical(row, self.actions, b))
                    return
                b.tick(1, "CAPACITY_OR_EARLY_COVER")
                if (not uncovered or uncovered.bit_count() > self.cardinality * slots
                        or len(avail) < slots):
                    self.emit(bytes([3]))
                    return
                union, gains = 0, []
                for v in avail:
                    b.tick(1, "AVAILABLE_GAIN_SCAN")
                    union |= self.masks[v]
                    gains.append((self.masks[v] & uncovered).bit_count())
                b.tick(1, "AVAILABLE_UNION_CHECK")
                if uncovered & ~union:
                    self.emit(bytes([4]))
                    return
                gain_values = charged_sort(gains, b)
                b.tick(slots, "TOP_GAIN_SUM")
                if sum(gain_values[-slots:]) < uncovered.bit_count():
                    self.emit(bytes([5]))
                    return
                pivot, pivot_count = None, self.n + 1
                for t in range(self.n):
                    b.tick(1, "PIVOT_TIME_SCAN")
                    if uncovered & (1 << t):
                        count = 0
                        for v in avail:
                            b.tick(1, "PIVOT_CANDIDATE_SCAN")
                            count += bool(self.masks[v] & (1 << t))
                        if count < pivot_count:
                            pivot, pivot_count = t, count
                options = []
                for v in avail:
                    b.tick(1, "PIVOT_OPTION_SCAN")
                    if self.masks[v] & (1 << pivot):
                        options.append(v)
                self.emit(bytes([6, pivot + 1, len(options), *[v + 1 for v in options]]))
                remaining = avail[:]
                for v in options:
                    b.tick(len(remaining), "SIBLING_EXCLUSION_SCAN")
                    remaining.remove(v)
                    mask = self.masks[v]
                    child_private = []
                    for old in private:
                        b.tick(1, "PRIVATE_UPDATE")
                        child_private.append(old & ~mask)
                    b.tick(3, "CHILD_MASKS")
                    child_private.append(mask & ~covered)
                    visit(selected + [v], covered | mask,
                          child_private, remaining[:], slots - 1)
            finally:
                b.release("scratch", scratch)

        try:
            visit([0], self.masks[0], [self.masks[0]], available, size - 1)
            node_count, tree_bytes = b.nodes - before_nodes, len(self.trace) - root_start
            self.emit(bytes([245]) + struct.pack("<II", node_count, tree_bytes))
            b.store("scratch", 512)
            self.roots.append({"size": size, "private": list(private_times),
                               "nodes": node_count, "traceBytes": tree_bytes})
            b.completed_roots += 1
        finally:
            b.release("scratch", root_scratch)

    def extend(self, size):
        b = self.budget
        rows = self.minimal[size]
        b.store("scratch", 128 + 16 * len(rows))
        try:
            b.tick(max(1, len(rows) * max(1, len(rows).bit_length())), "SUPPORT_ROW_SORT")
            for support_index, support in enumerate(sorted(rows)):
                b.context = {"size": size, "rootIndex": "EXTENSIONS",
                             "private": None, "supportIndex": support_index}
                length = self.target - size
                b.store("scratch", 768 + 256 * self.target)
                try:
                    for extension in itertools.combinations_with_replacement(range(1, self.n + 1), length):
                        b.tick(1 + length, "GENERATE_EXTENSION")
                        self.extensions += 1
                        row = charged_sort(support + extension, b)
                        image = canonical(row, self.actions, b)
                        # Explicit extension and image; ordered support table supplies its base.
                        self.emit(bytes([246, size, length]) + struct.pack("<I", support_index)
                                  + bytes(extension) + bytes(image))
                        self.add_row(self.rows, image, final=True)
                finally:
                    b.release("scratch", 768 + 256 * self.target)
        finally:
            b.release("scratch", 128 + 16 * len(rows))

    def run(self):
        b = self.budget
        schedule = root_schedule(self.n, self.cardinality, self.target)
        b.store("scratch", 512 + 128 * len(schedule))
        root_index = 0
        for size, q in schedule:
            b.tick(1, "MINIMAL_SET_CONSTRUCTION")
            b.store("scratch", 256)
            self.minimal[size] = set()
            bad_times = []
            for t in range(self.n):
                b.tick(1, "ROOT_TIME_SCAN")
                if self.masks[0] & (1 << t):
                    bad_times.append(t + 1)
            for private_times in itertools.combinations(bad_times, q):
                self.search_root(size, private_times, root_index)
                root_index += 1
            self.extend(size)
        b.tick(1, "SCHEMA_COMPLETENESS")
        expected = sum(math.comb(self.cardinality, q) for _, q in schedule)
        if len(self.roots) != expected:
            raise Refused("INTERNAL", "ROOT_COUNT")
        return self

    def candidate(self):
        b = self.budget
        row_count = len(self.rows)
        # BEFORE sorted lists, joins, base64 and JSON: conservative simultaneous copies.
        payload_bound = (65536 + 6 * len(self.trace) + 16 * self.trace.count + 8 * self.target * row_count
                         + 1024 * len(self.roots) + 512 * sum(len(s) for s in self.minimal.values()))
        b.envelope(payload_bound)
        b.tick(max(1, row_count * max(1, row_count.bit_length())), "FINAL_ROW_SORT")
        rows = sorted(self.rows)
        b.tick(max(1, self.target * row_count), "FINAL_ROW_ENCODING")
        data = b"".join(bytes(row) for row in rows)
        trace_data = self.trace.encode()
        supports = {}
        for size, values in self.minimal.items():
            b.tick(max(1, len(values) * max(1, len(values).bit_length())), "FINAL_SUPPORT_SORT")
            supports[str(size)] = [list(row) for row in sorted(values)]
        body = {"status": "COMPLETE_CANDIDATE_UNACCEPTED", "complete": True,
                "admittedRows": 0, "scope": SCOPE, "root": ROOT,
                "prime": self.prime, "movingSpeeds": self.target,
                "boundary": "STRICT_OPEN_BAD", "tauAssumption": False,
                "encoding": "LRC139G1_PREORDER_EXTENSIONS_U8",
                "roots": self.roots, "minimalSupports": supports,
                "extensions": self.extensions, "candidateRows": row_count,
                "trace": base64.b64encode(trace_data).decode("ascii"),
                "dataset": base64.b64encode(data).decode("ascii"),
                "traceSha256": hashlib.sha256(trace_data).hexdigest(),
                "datasetSha256": hashlib.sha256(data).hexdigest(),
                "metrics": b.metrics(), "caps": b.caps,
                "closure": {"G": "UNACCEPTED_CANDIDATE", "C": "OPEN", "T": "OPEN", "B": "OPEN"}}
        return serialize(body, b, positive=True)


def serialize(body, budget, positive=False):
    budget.tick(1, "SCHEMA_SERIALIZATION")
    # Candidate arrays/base64 already preflighted; diagnostics have constant bounded fields.
    encoded = json.dumps(body, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    limit = budget.caps["envelope"] if positive else budget.caps["summary"]
    if len(encoded) + 1 > limit:
        raise Refused("ENVELOPE" if positive else "SUMMARY", "OUTPUT_ENCODING")
    budget.tick(max(1, len(encoded) // 64), "SERIALIZATION_BYTES")
    return encoded + "\n"


def diagnostic(error, budget=None):
    # Refusal must be emit-able after work/time cap. No further mathematical work.
    body = {"status": "NOT_ESTABLISHED", "complete": False, "admittedRows": 0,
            "scope": SCOPE, "root": ROOT, "prime": 139, "movingSpeeds": 13,
            "failure": {"cap": error.cap, "phase": error.phase},
            "context": budget.context if budget else None,
            "metrics": budget.metrics() if budget else {"work": 0},
            "caps": budget.caps if budget else MAXIMA,
            "closure": {"G": "OPEN", "C": "OPEN", "T": "OPEN", "B": "OPEN"}}
    encoded = json.dumps(body, sort_keys=True, separators=(",", ":")) + "\n"
    if len(encoded) > (budget.caps["summary"] if budget else MAXIMA["summary"]):
        # Emergency small refusal, never a positive dataset.
        return '{"status":"NOT_ESTABLISHED","complete":false,"admittedRows":0,"failure":{"cap":"SUMMARY","phase":"DIAGNOSTIC_ENCODING"}}\n'
    return encoded


def no_stdin_input():
    """No unbounded read: an open empty pipe refuses instead of waiting."""
    if sys.stdin.isatty():
        return
    try:
        fd = sys.stdin.fileno()
        readable, _, _ = select.select([fd], [], [], 0)
        if not readable:
            raise Refused("RUNTIME", "STDIN_NOT_READY")
        if os.read(fd, 1):
            raise Refused("RUNTIME", "NO_STDIN_INPUT")
    except (OSError, ValueError):
        raise Refused("RUNTIME", "STDIN_UNSUPPORTED") from None


def main():
    generator = None
    budget = Budget()
    try:
        if len(sys.argv) != 1:
            raise Refused("RUNTIME", "NO_INPUT_CLI")
        check_flags({key: os.environ.get(key) for key in FLAGS})
        no_stdin_input()
        # Inert self-read only; no external data/code loading or filesystem writes.
        with open(__file__, "rb") as source:
            if len(source.read(MAXIMA["source"] + 1)) > MAXIMA["source"]:
                raise Refused("SOURCE", "SOURCE_BYTES")
        generator = Generator(budget=budget)
        generator.run()
        output = generator.candidate()
    except Refused as error:
        output = diagnostic(error, budget)
    except (KeyboardInterrupt, MemoryError, OverflowError, RecursionError):
        output = diagnostic(Refused("RUNTIME", "INTERRUPTION_OR_MEMORY"), budget)
    except Exception:
        # No exception text/data leakage and no partial mathematical output.
        output = diagnostic(Refused("RUNTIME", "UNEXPECTED_FAILURE"), budget)
    sys.stdout.write(output)


if __name__ == "__main__":
    main()
