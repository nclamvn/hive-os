#!/usr/bin/env python3
"""Independent BUILD_TINY scalar/SET semantic verifier; no whole-p139 grant."""
import hashlib
import itertools
import math
import time


class VerificationRefused(ValueError):
    pass


Refused = VerificationRefused
DEFAULTS = dict(nodes=100000, events=200000, extensions=50000, rows=10000,
                bytes=2097152, memory=67108864, seconds=10)
PROLOGUE = b'LRC139G2\n'


def _fail(reason):
    raise VerificationRefused(reason[:160])


def _limits(raw):
    if raw is None:
        return DEFAULTS.copy()
    if (type(raw) is not dict or len(raw) != len(DEFAULTS)
            or any(type(k) is not str for k in raw) or set(raw) != set(DEFAULTS)):
        _fail('LIMIT_KEYS')
    result = {}
    for key, maximum in DEFAULTS.items():
        value = raw[key]
        if key == 'seconds':
            if (type(value) not in (int, float) or value <= 0 or value > maximum
                    or not math.isfinite(value)):
                _fail('LIMIT_TYPE')
        elif type(value) is not int:
            _fail('LIMIT_TYPE')
        if value <= 0 or value > maximum:
            _fail('LIMIT_RANGE')
        result[key] = value
    return result


def _hash(raw):
    return hashlib.sha256(raw).hexdigest()


def _admission(method):
    def guarded(self, *args, **kwargs):
        try:
            return method(self, *args, **kwargs)
        except VerificationRefused:
            self.poisoned = True
            raise
        except (MemoryError, OverflowError, RecursionError):
            self.poisoned = True
            _fail('ALLOCATION_OR_OVERFLOW')
    return guarded


class Verifier:
    """Feed exact events; derive all expectations without a producer oracle."""

    def __init__(self, prime, divisor, target, limits=None):
        # Authority/domain refusal precedes any mask/search constructor effects.
        if any(type(v) is not int for v in (prime, divisor, target)):
            _fail('DOMAIN_TYPE')
        if not 3 <= prime <= 23 or any(prime % d == 0 for d in range(2, prime)):
            _fail('BUILD_TINY_PRIME_ONLY')
        if not 2 <= divisor <= 24 or not 1 <= target <= 5:
            _fail('BUILD_TINY_DOMAIN_ONLY')
        self.limits = _limits(limits)
        self.deadline = time.monotonic() + self.limits['seconds']
        self.memory = 0
        self._reserve(65536)
        self.p, self.d, self.target = prime, divisor, target
        self.n = (prime - 1) // 2
        self.times = set(range(1, self.n + 1))
        self.masks = {}
        for speed in range(1, self.n + 1):
            self._tick()
            self.masks[speed] = {t for t in self.times
                                 if divisor * min(speed*t % prime,
                                                  (-speed*t) % prime) < prime}
        cardinalities = {len(mask) for mask in self.masks.values()}
        if len(cardinalities) != 1 or 0 in cardinalities:
            _fail('NONZERO_EQUAL_MASKS_REQUIRED')
        self.m = cardinalities.pop()
        self.lower = (self.n + self.m - 1) // self.m
        self.phase, self.size, self.root_index = 'PROLOGUE', 0, 0
        self.private, self.frames = [], []
        self.root_nodes = self.root_bytes = self.search_nodes = 0
        self.events = self.extensions = self.trace_bytes = 0
        self.support_index = self.extra_rank = self.size_extensions = 0
        self.current = set()
        self.finalized = {}
        self.final_rows = set()
        self.row_charge = 0
        self.roots = None
        self.next_private = None
        self.support_rows = None
        self.extra_iterator = None
        self.next_extra = None
        self.poisoned = False

    def _tick(self):
        if time.monotonic() >= self.deadline:
            _fail('TIME')

    def _reserve(self, amount):
        if self.memory + amount > self.limits['memory']:
            _fail('MEMORY')
        self.memory += amount

    def _workspace(self, amount):
        self._tick()
        if self.memory + amount > self.limits['memory']:
            _fail('MEMORY_WORKSPACE')

    def _alive(self):
        self._tick()
        if self.poisoned:
            _fail('VERIFIER_POISONED')

    def _raw(self, rows, width):
        self._workspace(len(rows) * (256 + width) + 4096)
        ordered = sorted(rows)
        raw = b''.join(bytes(row) for row in ordered)
        self._tick()
        return raw

    def _retained_bytes(self):
        return sum(int(s)*len(rows) for s, rows in self.finalized.items()) + \
            self.size * len(self.current) + self.target * len(self.final_rows)

    def _byte_check(self, additional=0):
        if self.trace_bytes + additional + self._retained_bytes() > self.limits['bytes']:
            _fail('BYTES')

    def _canonical(self, values):
        best = None
        self._workspace(4096)
        for unit in range(1, self.n + 1):
            self._tick()
            image = tuple(sorted(min(unit*v % self.p, (-unit*v) % self.p)
                                 for v in values))
            if best is None or image < best:
                best = image
        return best

    def _insert(self, container, row):
        if row not in container:
            if self.row_charge >= self.limits['rows']:
                _fail('ROWS')
            # Conservative Python row/key/set resize accounting before insertion.
            self._reserve(1024)
            if self.trace_bytes + self._retained_bytes() + len(row) > self.limits['bytes']:
                _fail('BYTES')
            container.add(row)
            self.row_charge += 1

    def _begin_size(self, size):
        self.size = size
        self.current = set()
        self.size_extensions = self.support_index = self.extra_rank = 0
        q = max(1, (2*self.n - self.m*size + size - 1)//size)
        self.roots = itertools.combinations(sorted(self.masks[1]), q)
        self.next_private = next(self.roots, None)
        self.phase = 'ROOT_START' if self.next_private is not None else 'SUPPORT_END'

    def _frame(self, selected, available, slots):
        self._workspace(4096)
        return dict(selected=list(selected), available=sorted(available), slots=slots,
                    options=None, next=0)

    def _after_node(self):
        self.frames.pop()
        while self.frames:
            parent = self.frames[-1]
            if parent['next'] >= len(parent['options']):
                self.frames.pop()
                continue
            index = parent['next']
            option = parent['options'][index]
            available = set(parent['available']) - set(parent['options'][:index+1])
            parent['next'] += 1
            self.frames.append(self._frame(parent['selected'] + [option], available,
                                          parent['slots'] - 1))
            return
        self.phase = 'ROOT_END'

    def _node(self):
        self._workspace(16384)
        frame = self.frames[-1]
        chosen = frame['selected']
        available, slots = frame['available'], frame['slots']
        covered = set().union(*(self.masks[v] for v in chosen))
        for v in chosen:
            self._tick()
            others = set().union(*(self.masks[w] for w in chosen if w != v))
            if not self.masks[v] - others:
                return b'\x00'
        if slots == 0:
            return b'\x01' if covered == self.times else b'\x02'
        uncovered = self.times - covered
        if not uncovered or len(uncovered) > self.m*slots or len(available) < slots:
            return b'\x03'
        if not uncovered <= set().union(*(self.masks[v] for v in available)):
            return b'\x04'
        gains = sorted((len(self.masks[v] & uncovered) for v in available), reverse=True)
        if sum(gains[:slots]) < len(uncovered):
            return b'\x05'
        pivot = min(uncovered, key=lambda t: (sum(t in self.masks[v] for v in available), t))
        options = [v for v in available if pivot in self.masks[v]]
        return bytes([6, pivot, len(options)] + options)

    def _expected(self):
        self._alive()
        if self.phase == 'PROLOGUE':
            return PROLOGUE
        if self.phase == 'ROOT_START':
            return bytes([244, self.size, len(self.next_private)] + list(self.next_private))
        if self.phase == 'SEARCH':
            return self._node()
        if self.phase == 'ROOT_END':
            if max(self.root_nodes, self.root_bytes) >= 2**32:
                _fail('ROOT_OVERFLOW')
            return bytes([245]) + self.root_nodes.to_bytes(4, 'little') + self.root_bytes.to_bytes(4, 'little')
        if self.phase == 'SUPPORT_END':
            raw = self._raw(self.current, self.size)
            return bytes([247, self.size]) + len(self.current).to_bytes(8, 'little') + hashlib.sha256(raw).digest()
        if self.phase == 'EXTEND':
            support = self.support_rows[self.support_index]
            row = self._canonical(support + self.next_extra)
            return bytes([246, self.size, self.target-self.size]) + \
                self.support_index.to_bytes(4, 'little') + bytes(self.next_extra) + bytes(row)
        if self.phase == 'SIZE_END':
            raw = self._raw(self.finalized[str(self.size)], self.size)
            return bytes([248, self.size]) + self.size_extensions.to_bytes(8, 'little') + hashlib.sha256(raw).digest()
        if self.phase == 'FINAL_END':
            raw = self._raw(self.final_rows, self.target)
            return b'\xf9' + len(self.final_rows).to_bytes(8, 'little') + hashlib.sha256(raw).digest()
        _fail('EVENT_AFTER_TERMINAL')

    @_admission
    def feed(self, event):
        self._alive()
        if type(event) is not bytes or not event or len(event) > 128:
            _fail('EVENT_TYPE_LENGTH')
        try:
            if self.events >= self.limits['events']:
                _fail('EVENTS')
            self._byte_check(len(event))
            if self.phase == 'SEARCH' and self.search_nodes >= self.limits['nodes']:
                _fail('NODES')
            if self.phase == 'EXTEND' and self.extensions >= self.limits['extensions']:
                _fail('EXTENSIONS')
            expected = self._expected()
            if event != expected:
                _fail('EVENT_MISMATCH')
            phase = self.phase
            self.events += 1
            self.trace_bytes += len(event)
            if phase == 'PROLOGUE':
                if self.lower > self.target:
                    self.phase = 'FINAL_END'
                else:
                    self._begin_size(self.lower)
            elif phase == 'ROOT_START':
                self.private = list(self.next_private)
                self.root_nodes, self.root_bytes = 0, len(event)
                eligible = [v for v in range(2, self.n+1)
                            if not self.masks[v] & set(self.private)]
                self.frames = [self._frame([1], eligible, self.size-1)]
                self.phase = 'SEARCH'
            elif phase == 'SEARCH':
                self.search_nodes += 1
                self.root_nodes += 1
                self.root_bytes += len(event)
                if event[0] == 1:
                    self._insert(self.current, self._canonical(self.frames[-1]['selected']))
                if event[0] == 6:
                    self.frames[-1]['options'] = list(event[3:])
                    self.frames[-1]['next'] = 0
                    parent = self.frames[-1]
                    parent['next'] = 1
                    self.frames.append(self._frame(parent['selected'] + [parent['options'][0]],
                                                   set(parent['available']) - {parent['options'][0]},
                                                   parent['slots']-1))
                else:
                    self._after_node()
            elif phase == 'ROOT_END':
                self.root_index += 1
                self.private = []
                self.next_private = next(self.roots, None)
                self.phase = 'ROOT_START' if self.next_private is not None else 'SUPPORT_END'
            elif phase == 'SUPPORT_END':
                self.finalized[str(self.size)] = self.current
                self.current = set()
                self._workspace(len(self.finalized[str(self.size)])*256 + 4096)
                self.support_rows = sorted(self.finalized[str(self.size)])
                self.support_index = self.extra_rank = 0
                self._start_extras()
            elif phase == 'EXTEND':
                self._insert(self.final_rows, tuple(event[-self.target:]))
                self.extensions += 1
                self.size_extensions += 1
                self.extra_rank += 1
                self.next_extra = next(self.extra_iterator, None)
                if self.next_extra is None:
                    self.support_index += 1
                    self.extra_rank = 0
                    self._start_extras()
            elif phase == 'SIZE_END':
                self.support_index = self.extra_rank = 0
                self.support_rows = self.extra_iterator = self.next_extra = None
                if self.size < self.target:
                    self._begin_size(self.size+1)
                else:
                    self.phase = 'FINAL_END'
            elif phase == 'FINAL_END':
                self.phase, self.size, self.private, self.frames = 'TERMINAL', 0, [], []
            self._byte_check()
            self._tick()
        except VerificationRefused:
            self.poisoned = True
            raise

    def _start_extras(self):
        if self.support_index >= len(self.support_rows):
            self.phase = 'SIZE_END'
            return
        self.extra_iterator = itertools.combinations_with_replacement(range(1, self.n+1),
                                                                      self.target-self.size)
        self.next_extra = next(self.extra_iterator)
        self.phase = 'EXTEND'

    def _snapshot_space(self, include_dataset=False, include_cursor=False):
        rows = list(self.finalized.items())
        if self.size and str(self.size) not in self.finalized:
            rows.append((str(self.size), self.current))
        output = sum(len(values)*(int(size)+256) for size, values in rows)
        if include_dataset:
            output += len(self.final_rows)*(self.target+256)
        if include_cursor:
            output += 32768
        self._workspace(output+16384)

    @_admission
    def tables(self):
        self._alive()
        self._snapshot_space()
        rows = dict(self.finalized)
        if self.size and str(self.size) not in rows:
            rows[str(self.size)] = self.current
        result = {s: self._raw(values, int(s)) for s, values in rows.items()}
        self._tick()
        return result

    @_admission
    def dataset(self):
        self._alive()
        return self._raw(self.final_rows, self.target)

    @_admission
    def cursor(self):
        self._alive()
        self._snapshot_space(include_dataset=True, include_cursor=True)
        tables = self.tables()
        result = dict(phase=self.phase, size=self.size, rootIndex=self.root_index,
                    private=list(self.private),
                    frames=[dict(selected=list(f['selected']), available=list(f['available']),
                                 slots=f['slots'], options=None if f['options'] is None else list(f['options']),
                                 next=f['next']) for f in self.frames],
                    supportIndex=self.support_index, extraRank=self.extra_rank,
                    rootNodes=self.root_nodes, rootBytes=self.root_bytes,
                    searchNodes=self.search_nodes, eventCount=self.events,
                    extensions=self.extensions, traceBytes=self.trace_bytes,
                    supportHashes={s: dict(count=len(raw)//int(s), width=int(s), sha256=_hash(raw))
                                   for s, raw in tables.items()}, unionHash=_hash(self.dataset()))
        self._tick()
        return result

    @_admission
    def finish(self, dataset, tables):
        self._alive()
        if self.phase != 'TERMINAL':
            _fail('INCOMPLETE_PREFIX')
        if type(dataset) is not bytes or len(dataset) > self.limits['bytes']:
            _fail('DATA_TYPE_BYTES')
        if (type(tables) is not dict or len(tables) > self.target
                or any(type(key) is not str for key in tables)):
            _fail('TABLE_TYPE')
        self._snapshot_space(include_dataset=True)
        expected = self.tables()
        if set(tables) != set(expected):
            _fail('TABLE_KEYS')
        for key in expected:
            if type(tables[key]) is not bytes or tables[key] != expected[key]:
                _fail('TABLE_EQUALITY')
        if dataset != self.dataset():
            _fail('DATA_EQUALITY')
        self._tick()
        return dict(status='TINY_G_VERIFIED_CTB_OPEN', semanticVerified=True,
                    wholeGrant=0, wholeAttempts=4, rows=len(self.final_rows))


if __name__ == '__main__':
    # The API is used by the separately pinned host; CLI is never a whole grant.
    raise SystemExit('REFUSED: BUILD_TINY host/API only; no whole-p139 execution grant')
