#!/usr/bin/env python3
"""Independent scalar/SET verifier; whole admission needs pinned HOST identity."""
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
P139_EXECUTION_ENABLED = False
FULL = dict(nodes=20000000, events=40000000, extensions=1000000,
            rows=100000, bytes=268435456, memory=536870912, seconds=600)
RESOURCE_SHA = '3da8f104d04bbfecb4e2a62d034a3c48802b032d1a59e0b84f91fc0c2db3864a'
_HOST_RELEASE_GATE = globals().pop('_PINNED_HOST_RELEASE_GATE', None)
_BINDING_KEYS = frozenset(('root', 'mode', 'obligation', 'domain', 'attempt',
                         'priorWholeAttempts', 'grantSha256', 'resourceContractSha256',
                         'releaseReviewSha256', 'sourcePins', 'headerSha256',
                         'reservationSha256', 'startSha256', 'phaseId', 'action'))


def profile_spec(profile='BUILD_TINY'):
    """Defensive declaration only: no masks, clock, streams or grant."""
    if type(profile) is not str:
        _fail('PROFILE_TYPE')
    common = dict(profile=profile, wholeAttempts=4, wholeGrant=0)
    if profile == 'BUILD_TINY':
        return dict(common, domain=dict(prime=[3, 23], divisor=[2, 24], target=[1, 5]),
                    bounds=DEFAULTS.copy(), executionEnabled=True, rootCounts=None)
    if profile in ('P139_RELEASE_DISABLED', 'P139_RELEASE'):
        return dict(common, domain=dict(prime=139, divisor=14, target=13),
                    bounds=FULL.copy(), executionEnabled=False,
                    rootCounts=[1, 36, 126, 126, 84, 36])
    _fail('PROFILE_UNKNOWN')


def _fail(reason):
    raise VerificationRefused(reason[:160])


def _limits(raw, maximums=None):
    maximums = DEFAULTS if maximums is None else maximums
    if raw is None:
        return maximums.copy()
    if (type(raw) is not dict or len(raw) != len(maximums)
            or any(type(k) is not str for k in raw) or set(raw) != set(maximums)):
        _fail('LIMIT_KEYS')
    result = {}
    for key, maximum in maximums.items():
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


def _digest(value):
    return (type(value) is str and len(value) == 64
            and all(c in '0123456789abcdef' for c in value))


def release_preflight(prime, divisor, target, limits=None,
                      profile='BUILD_TINY', release=None):
    """Pure admission, no clock/masks. It cannot mint HOST authority."""
    if type(profile) is not str:
        _fail('PROFILE_TYPE')
    if any(type(v) is not int for v in (prime, divisor, target)):
        _fail('DOMAIN_TYPE')
    if profile == 'BUILD_TINY':
        if release is not None:
            _fail('TINY_RELEASE_FORBIDDEN')
        if not 3 <= prime <= 23 or any(prime % d == 0 for d in range(2, prime)):
            _fail('BUILD_TINY_PRIME_ONLY')
        if not 2 <= divisor <= 24 or not 1 <= target <= 5:
            _fail('BUILD_TINY_DOMAIN_ONLY')
        return _limits(limits), None
    if (profile != 'P139_RELEASE' or (prime, divisor, target) != (139, 14, 13)
            or release is None or not callable(_HOST_RELEASE_GATE)):
        _fail('PROFILE_EXECUTION_DISABLED')
    selected = _limits(limits, FULL)
    request = dict(profile=profile, domain=dict(prime=prime, divisor=divisor,
                                               target=target), action='VERIFY',
                   limits=selected.copy())
    try:
        binding = _HOST_RELEASE_GATE(release, request)
    except Exception:
        _fail('HOST_RELEASE_REFUSED')
    if (type(binding) is not dict or len(binding) != len(_BINDING_KEYS)
            or any(type(k) is not str for k in binding) or set(binding) != _BINDING_KEYS):
        _fail('RELEASE_BINDING_KEYS')
    for key, expected in (('root', 'LRC_P139_REPRODUCTION_075'),
                          ('mode', 'REPRODUCTION'), ('obligation', 'G'),
                          ('action', 'VERIFY'), ('resourceContractSha256', RESOURCE_SHA)):
        if type(binding[key]) is not str or binding[key] != expected:
            _fail('RELEASE_BINDING_SCOPE')
    for key, expected in (('attempt', 5), ('priorWholeAttempts', 4)):
        if type(binding[key]) is not int or binding[key] != expected:
            _fail('RELEASE_BINDING_HISTORY')
    if (type(binding['phaseId']) is not int or not 1 <= binding['phaseId'] <= 32
            or binding['phaseId'] % 4 not in (0, 2)):
        _fail('RELEASE_BINDING_PHASE')
    domain = binding['domain']
    if (type(domain) is not dict or len(domain) != 3
            or any(type(k) is not str for k in domain)
            or set(domain) != {'prime', 'divisor', 'target'}
            or any(type(domain[k]) is not int for k in domain)
            or domain != {'prime': 139, 'divisor': 14, 'target': 13}):
        _fail('RELEASE_BINDING_DOMAIN')
    pins = binding['sourcePins']
    if (type(pins) is not dict or len(pins) != 3
            or any(type(k) is not str for k in pins)
            or set(pins) != {'producer', 'checker', 'host'}
            or any(not _digest(v) for v in pins.values())):
        _fail('RELEASE_BINDING_PINS')
    for key in ('grantSha256', 'resourceContractSha256', 'releaseReviewSha256',
                'headerSha256', 'reservationSha256', 'startSha256'):
        if not _digest(binding[key]):
            _fail('RELEASE_BINDING_DIGEST')
    # HOST authenticates digests; this scalar checker copies labels, not authority.
    frozen = tuple((key, tuple(sorted(value.items())) if type(value) is dict else value)
                   for key, value in sorted(binding.items()))
    return selected, frozen


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
        except Exception:
            self.poisoned = True
            _fail('UNEXPECTED_OPERATION')
    return guarded


class _Rows:
    """Call-time fence and explicitly closeable charged sorted workspace."""

    def __init__(self, owner, rows, width):
        self.closed = True
        owner._alive()
        self.owner, self.fence, self.width = owner, owner.events, width
        self.index, self.closed = 0, True
        self.charge = 4096 + len(rows) * (256 + width)
        owner._workspace(self.charge)
        owner.snapshot_workspace += self.charge
        try:
            self.ordered = sorted(rows)
            owner._tick()
        except BaseException:
            owner.snapshot_workspace -= self.charge
            owner.poisoned = True
            raise
        self.closed = False

    def __iter__(self):
        return self

    def __next__(self):
        if self.closed:
            raise StopIteration
        owner = self.owner
        try:
            owner._alive()
            if owner.events != self.fence:
                _fail('SNAPSHOT_FENCE')
            if self.index == len(self.ordered):
                self.close()
                raise StopIteration
            row = bytes(self.ordered[self.index])
            self.index += 1
            owner._tick()
            return row
        except StopIteration:
            raise
        except VerificationRefused:
            owner.poisoned = True
            self.close()
            raise
        except (MemoryError, OverflowError, RecursionError):
            owner.poisoned = True
            self.close()
            _fail('ALLOCATION_OR_OVERFLOW')
        except Exception:
            owner.poisoned = True
            self.close()
            _fail('ROW_ITERATION_FAILURE')
        except BaseException:
            owner.poisoned = True
            self.close()
            raise

    def close(self):
        if not self.closed:
            self.closed = True
            self.owner.snapshot_workspace -= self.charge
            self.ordered = None

    def __del__(self):
        if hasattr(self, 'closed'):
            self.close()


class Verifier:
    """Feed exact events; derive all expectations without a producer oracle."""

    def __init__(self, prime, divisor, target, limits=None, profile='BUILD_TINY', release=None):
        self.limits, self._release_binding = release_preflight(
            prime, divisor, target, limits, profile, release)
        self.full = self._release_binding is not None
        self.deadline = time.monotonic() + self.limits['seconds']
        self.memory = self.snapshot_workspace = 0
        self._reserve(65536)
        if self.full:
            self._reserve(2097152)
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
        self.completed_roots = {}
        self.expected_roots = {size: math.comb(self.m, max(1, (2*self.n-self.m*size+size-1)//size))
                               for size in range(self.lower, self.target+1)}
        if self.full and (self.n, self.m, self.lower, self.target) != (69, 9, 8, 13):
            _fail('FULL_DERIVED_DOMAIN')
        if self.full and (tuple(self.expected_roots) != (8, 9, 10, 11, 12, 13)
                          or tuple(self.expected_roots.values()) != (1, 36, 126, 126, 84, 36)):
            _fail('FULL_DERIVED_ROOT_SCHEDULE')
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
        self.support_workspace = 0
        self.extra_iterator = None
        self.next_extra = None
        self.poisoned = False
        self.verified_snapshot = None

    def _tick(self):
        if time.monotonic() >= self.deadline:
            _fail('TIME')

    def _reserve(self, amount):
        if self.memory + self.snapshot_workspace + amount > self.limits['memory']:
            _fail('MEMORY')
        self.memory += amount

    def _workspace(self, amount):
        self._tick()
        if self.memory + self.snapshot_workspace + amount > self.limits['memory']:
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
            digest = self._stream_digest(self.iter_table_rows(self.size))
            return bytes([247, self.size]) + digest['count'].to_bytes(8, 'little') + bytes.fromhex(digest['sha256'])
        if self.phase == 'EXTEND':
            support = self.support_rows[self.support_index]
            row = self._canonical(support + self.next_extra)
            return bytes([246, self.size, self.target-self.size]) + \
                self.support_index.to_bytes(4, 'little') + bytes(self.next_extra) + bytes(row)
        if self.phase == 'SIZE_END':
            digest = self._stream_digest(self.iter_table_rows(self.size))
            return bytes([248, self.size]) + self.size_extensions.to_bytes(8, 'little') + bytes.fromhex(digest['sha256'])
        if self.phase == 'FINAL_END':
            digest = self._stream_digest(self.iter_dataset_rows())
            return b'\xf9' + digest['count'].to_bytes(8, 'little') + bytes.fromhex(digest['sha256'])
        _fail('EVENT_AFTER_TERMINAL')

    @_admission
    def feed(self, event):
        self.verified_snapshot = None
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
                self.completed_roots[self.size] = self.completed_roots.get(self.size, 0)+1
                self.private = []
                self.next_private = next(self.roots, None)
                self.phase = 'ROOT_START' if self.next_private is not None else 'SUPPORT_END'
            elif phase == 'SUPPORT_END':
                self.finalized[str(self.size)] = self.current
                self.current = set()
                self.support_workspace = len(self.finalized[str(self.size)])*256 + 4096
                self._workspace(self.support_workspace)
                self.snapshot_workspace += self.support_workspace
                try:
                    self.support_rows = sorted(self.finalized[str(self.size)])
                except BaseException:
                    self.snapshot_workspace -= self.support_workspace
                    self.support_workspace = 0
                    raise
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
                self.snapshot_workspace -= self.support_workspace
                self.support_workspace = 0
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

    def _table_containers(self):
        rows = dict(self.finalized)
        if self.size and str(self.size) not in rows:
            rows[str(self.size)] = self.current
        return rows

    @_admission
    def iter_table_rows(self, size):
        self._alive()
        if type(size) is not int or size not in range(1, self.target + 1):
            _fail('TABLE_SIZE')
        rows = self._table_containers()
        if str(size) not in rows:
            _fail('TABLE_NOT_PRESENT')
        return _Rows(self, rows[str(size)], size)

    @_admission
    def iter_dataset_rows(self):
        self._alive()
        return _Rows(self, self.final_rows, self.target)

    def _stream_digest(self, iterator):
        digest, count = hashlib.sha256(), 0
        try:
            for row in iterator:
                self._tick()
                digest.update(row)
                count += 1
            return dict(count=count, width=iterator.width, sha256=digest.hexdigest())
        finally:
            iterator.close()

    @_admission
    def cursor(self):
        self._alive()
        self._workspace(32768)
        self.snapshot_workspace += 32768
        try:
            return self._cursor_reserved()
        finally:
            self.snapshot_workspace -= 32768

    def _cursor_reserved(self):
        hashes = {s: self._stream_digest(self.iter_table_rows(int(s)))
                  for s in self._table_containers()}
        union = self._stream_digest(self.iter_dataset_rows())
        result = dict(phase=self.phase, size=self.size, rootIndex=self.root_index,
                    private=list(self.private),
                    frames=[dict(selected=list(f['selected']), available=list(f['available']),
                                 slots=f['slots'], options=None if f['options'] is None else list(f['options']),
                                 next=f['next']) for f in self.frames],
                    supportIndex=self.support_index, extraRank=self.extra_rank,
                    rootNodes=self.root_nodes, rootBytes=self.root_bytes,
                    searchNodes=self.search_nodes, eventCount=self.events,
                    extensions=self.extensions, traceBytes=self.trace_bytes,
                    supportHashes=hashes, unionHash=union['sha256'])
        self._tick()
        return result

    def _compare_rows(self, supplied, expected, width, distinct_entries, fence):
        # A reader never supplies semantic state; both EOFs must be observed.
        previous = None
        end = object()
        try:
            if isinstance(supplied, (bytes, bytearray, str, dict)):
                _fail('ROW_ITERATOR_REQUIRED')
            actual = iter(supplied)
            while True:
                self._alive()
                if self.events != fence:
                    _fail('SNAPSHOT_FENCE')
                want = next(expected, end)
                got = next(actual, end)
                self._alive()
                if self.events != fence:
                    _fail('SNAPSHOT_FENCE')
                if got is not end:
                    if type(got) is not bytes or len(got) != width:
                        _fail('ROW_TYPE_WIDTH')
                    if any(v < 1 or v > self.n for v in got):
                        _fail('ROW_RANGE')
                    if any(got[i] > got[i+1] for i in range(width-1)):
                        _fail('ROW_ENTRY_ORDER')
                    if distinct_entries and len(set(got)) != width:
                        _fail('SUPPORT_DISTINCT')
                    if previous is not None and got <= previous:
                        _fail('ROW_ORDER_DISTINCT')
                    previous = got
                if want is end or got is end:
                    if want is not end or got is not end:
                        _fail('STREAM_EOF_EQUALITY')
                    break
                if got != want:
                    _fail('ROW_EQUALITY')
        finally:
            expected.close()

    @_admission
    def compare_snapshot(self, tables, dataset):
        self.verified_snapshot = None
        self._alive()
        fence = self.events
        containers = self._table_containers()
        if (type(tables) is not dict or len(tables) > self.target
                or any(type(k) is not str for k in tables)
                or set(tables) != set(containers)):
            _fail('TABLE_KEYS')
        for key in sorted(containers, key=int):
            self._compare_rows(tables[key], self.iter_table_rows(int(key)),
                               int(key), True, fence)
        self._compare_rows(dataset, self.iter_dataset_rows(), self.target, False, fence)
        self._alive()
        if self.events != fence:
            _fail('SNAPSHOT_FENCE')
        self.verified_snapshot = fence

    @_admission
    def finish_verified(self):
        self._alive()
        if self.phase != 'TERMINAL' or self.verified_snapshot != self.events:
            _fail('TERMINAL_VERIFIED_SNAPSHOT_REQUIRED')
        if self.full:
            independently_expected = {size: math.comb(9, max(1, (138-9*size+size-1)//size))
                                      for size in range(8, 14)}
            if (self._release_binding is None or (self.p, self.d, self.target, self.n, self.m, self.lower)
                    != (139, 14, 13, 69, 9, 8) or self.root_index != 409
                    or self.completed_roots != independently_expected
                    or self.expected_roots != independently_expected
                    or set(self.finalized) != {str(size) for size in range(8, 14)}):
                _fail('WHOLE_COMPLETED_ROOT_SCHEDULE_REQUIRED')
            return dict(status='WHOLE_G_VERIFIED_CTB_OPEN', semanticVerified=True,
                        wholeGrant=1, wholeAttempts=5, rows=len(self.final_rows))
        return dict(status='TINY_G_VERIFIED_CTB_OPEN', semanticVerified=True,
                    wholeGrant=0, wholeAttempts=4, rows=len(self.final_rows))

    @_admission
    def finish(self, dataset, tables):
        self._alive()
        if self.phase != 'TERMINAL':
            _fail('INCOMPLETE_PREFIX')
        if type(dataset) is not bytes or len(dataset) > self.limits['bytes']:
            _fail('DATA_TYPE_BYTES')
        if (type(tables) is not dict or len(tables) > self.target
                or any(type(key) is not str for key in tables)
                or set(tables) != set(self._table_containers())
                or any(type(raw) is not bytes or len(raw) > self.limits['bytes']
                       or not key.isdecimal() or int(key) < 1
                       or len(raw) % int(key) for key, raw in tables.items())
                or len(dataset) % self.target):
            _fail('TABLE_TYPE_WIDTH')
        def rows(raw, width):
            return (raw[i:i+width] for i in range(0, len(raw), width))
        streamed = {key: rows(raw, int(key)) for key, raw in tables.items()}
        self.compare_snapshot(streamed, rows(dataset, self.target))
        return self.finish_verified()


if __name__ == '__main__':
    raise SystemExit('REFUSED: pinned HOST identity required; no standalone whole grant')
