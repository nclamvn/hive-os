"""075C BUILD_TINY event producer. No whole139 grant, FS/network or checker import.

Cursor is an untrusted comparison witness; reconstruct only by genesis events.
Accounted working allocations are conservative, not hard interpreter RSS limits.
"""
import hashlib
import itertools
import json
import math
import os
import struct
import sys
import time

LIMITS = {"nodes": 100000, "events": 200000, "extensions": 50000, "rows": 10000,
          "bytes": 2097152, "memory": 67108864, "seconds": 10}
FLAGS = ("RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED")


class Refused(Exception):
    def __init__(self, reason):
        super().__init__(str(reason)[:128])


def indexes(mask):
    while mask:
        bit = mask & -mask
        yield bit.bit_length() - 1
        mask ^= bit


def protected_snapshot(method):
    def protected(self):
        try:
            return method(self)
        except (Refused, MemoryError, OverflowError, RecursionError):
            self.failed = True
            raise
    return protected


class Budget:
    def __init__(self, limits):
        limits = LIMITS.copy() if limits is None else limits
        if type(limits) is not dict or set(limits) != set(LIMITS):
            raise Refused("LIMIT_KEYS")
        for key, value in limits.items():
            if (type(value) not in (int, float) or value <= 0 or value > LIMITS[key]
                    or not math.isfinite(value) or (key != "seconds" and type(value) is not int)):
                raise Refused("LIMIT_VALUE")
        self.limits = limits.copy()
        self.start = time.monotonic()
        self.nodes = self.events = self.extensions = self.rows = self.bytes = 0
        self.memory = self.peak = 0
        self.refused = False

    def poll(self):
        if self.refused:
            raise Refused("POISONED_AFTER_REFUSAL")
        if time.monotonic() - self.start >= self.limits["seconds"]:
            self.refused = True
            raise Refused("TIME")

    def charge(self, key, value=1):
        self.poll()
        current = getattr(self, key)
        if current + value > self.limits[key]:
            self.refused = True
            raise Refused(key.upper())
        setattr(self, key, current + value)

    def reserve(self, size):
        self.charge("memory", size)
        self.peak = max(self.peak, self.memory)

    def release(self, size):
        if size < 0 or size > self.memory:
            raise Refused("MEMORY_ACCOUNTING")
        self.memory -= size


class Engine:
    def __init__(self, prime, divisor, target, limits=None):
        # Whole/domain refusal BEFORE budget/masks/root allocation.
        if (type(prime) is not int or not 3 <= prime <= 23 or prime % 2 == 0
                or type(divisor) is not int or not 2 <= divisor <= 24
                or type(target) is not int or not 1 <= target <= 5):
            raise Refused("BUILD_TINY_DOMAIN_NO_WHOLE_GRANT")
        if any(prime % d == 0 for d in range(2, math.isqrt(prime) + 1)):
            raise Refused("NONPRIME")
        self.b = Budget(limits)
        self.p, self.d, self.target = prime, divisor, target
        self.n = (prime - 1) // 2
        self.b.reserve(8192 + 256 * self.n + 4 * self.n * self.n)
        self.full = (1 << self.n) - 1
        self.masks, self.coverers, self.actions = [], [0] * self.n, []
        for v in range(1, self.n + 1):
            mask = 0
            for t in range(1, self.n + 1):
                self.b.poll()
                r = v * t % prime
                if divisor * min(r, prime - r) < prime:
                    mask |= 1 << (t - 1)
                    self.coverers[t - 1] |= 1 << (v - 1)
            self.masks.append(mask)
        self.m = self.masks[0].bit_count()
        if not self.m or any(x.bit_count() != self.m for x in self.masks + self.coverers):
            raise Refused("MASK_CARDINALITY")
        for u in range(1, self.n + 1):
            self.b.poll()
            self.actions.append(bytes(min(u * v % prime, (-u * v) % prime)
                                      for v in range(1, self.n + 1)))
        self.sizes = list(range((self.n + self.m - 1) // self.m, target + 1))
        self.root_counts = {s: math.comb(self.m, max(1, (2 * self.n - self.m * s + s - 1) // s))
                            for s in self.sizes}
        self.b.reserve(512 * sum(self.root_counts.values()) + 2048)
        self.roots = [(s, tuple(p)) for s in self.sizes
                      for p in itertools.combinations(tuple(x + 1 for x in indexes(self.masks[0])),
                                                     max(1, (2 * self.n - self.m * s + s - 1) // s))]
        self.phase, self.size, self.rootIndex = "PROLOGUE", 0, 0
        self.private, self.frames = [], []
        self.supportIndex = self.extraRank = self.rootNodes = self.rootBytes = 0
        self.finalized, self.minimal, self.union = {}, set(), set()
        self.extra = None
        self.sizeExtensions = 0
        self.failed = False

    def _check(self):
        if self.failed:
            raise Refused("POISONED_AFTER_REFUSAL")
        self.b.poll()

    def _raw(self, rows):
        self.b.poll()
        # sorted pointers + join Py_buffer array + comparison/copy workspace.
        amount = 4096 + 256 * len(rows) + sum(map(len, rows))
        self.b.reserve(amount)
        try:
            raw = b"".join(sorted(rows))
            self.b.poll()
            return raw
        finally:
            self.b.release(amount)

    def _canonical(self, row):
        self.b.reserve(2048)
        try:
            best = None
            for action in self.actions:
                self.b.poll()
                image = bytes(sorted(action[v - 1] for v in row))
                if best is None or image < best:
                    best = image
            self.b.poll()
            return best
        finally:
            self.b.release(2048)

    def _insert(self, rows, row):
        self.b.poll()
        if row not in rows:
            self.b.charge("rows")
            self.b.charge("bytes", len(row))
            self.b.reserve(256 + len(row))
            rows.add(row)

    def _push(self, selected, covered, private, available, slots):
        self.b.reserve(2048)
        self.frames.append({"selected": selected, "covered": covered, "private": private,
                            "available": available, "slots": slots, "options": None, "next": 0})

    def _pop(self):
        self.frames.pop()
        self.b.release(2048)

    def _next_child(self):
        while self.frames:
            self.b.poll()
            f = self.frames[-1]
            if f["next"] >= len(f["options"]):
                self._pop()
                continue
            v = f["options"][f["next"]]
            f["next"] += 1
            available = f["available"]
            for earlier in f["options"][:f["next"]]:
                available &= ~(1 << (earlier - 1))
            mask = self.masks[v - 1]
            self._push(f["selected"] + [v], f["covered"] | mask,
                       [p & ~mask for p in f["private"]] + [mask & ~f["covered"]],
                       available, f["slots"] - 1)
            return
        self.phase = "ROOT_END"

    def _node_event(self):
        self.b.charge("nodes")
        f = self.frames[-1]
        uncovered, slots = self.full ^ f["covered"], f["slots"]
        available = f["available"]
        if any(not p for p in f["private"]):
            tag = 0
        elif not slots:
            tag = 2 if uncovered else 1
        elif not uncovered or uncovered.bit_count() > self.m * slots or available.bit_count() < slots:
            tag = 3
        else:
            union, histogram = 0, [0] * (self.m + 1)
            for v in indexes(available):
                self.b.poll()
                union |= self.masks[v]
                histogram[(self.masks[v] & uncovered).bit_count()] += 1
            if uncovered & ~union:
                tag = 4
            else:
                total, left = 0, slots
                for gain in range(self.m, -1, -1):
                    take = min(left, histogram[gain])
                    total += take * gain
                    left -= take
                tag = 5 if total < uncovered.bit_count() else 6
        if tag == 6:
            pivot = min(indexes(uncovered), key=lambda t: ((available & self.coverers[t]).bit_count(), t))
            options = [v + 1 for v in indexes(available & self.coverers[pivot])]
            event = bytes([6, pivot + 1, len(options), *options])
            self.b.charge("bytes", len(event))
            f["options"] = options
            self._next_child()
        else:
            event = bytes([tag])
            self.b.charge("bytes", 1)
            if tag == 1:
                self._insert(self.minimal, self._canonical(f["selected"]))
            self._pop()
            self._next_child()
        self.rootNodes += 1
        self.rootBytes += len(event)
        self.b.poll()
        return event

    def _advance_extra(self):
        length = self.target - self.size
        extra = self.extra
        for i in range(length - 1, -1, -1):
            if extra[i] < self.n:
                self.extra = extra[:i] + [extra[i] + 1] * (length - i)
                return
        self.supportIndex += 1
        self.extraRank = 0
        if self.supportIndex == len(self.finalized[str(self.size)]) // self.size:
            self.extra = None
            self.phase = "SIZE_END"
        else:
            self.extra = [1] * length

    def next_event(self):
        self._check()
        if self.phase == "TERMINAL":
            return None
        try:
            self.b.charge("events")
            if self.phase == "PROLOGUE":
                event = b"LRC139G2\n"
                self.b.charge("bytes", len(event))
                if self.sizes:
                    self.size, self.phase = self.sizes[0], "ROOT_START"
                else:
                    self.phase = "FINAL_END"
            elif self.phase == "ROOT_START":
                size, private = self.roots[self.rootIndex]
                if size != self.size:
                    raise Refused("INTERNAL_ROOT_SCHEDULE")
                event = bytes([244, size, len(private), *private])
                self.b.charge("bytes", len(event))
                self.private = list(private)
                self.rootNodes, self.rootBytes = 0, len(event)
                excluded = 0
                for t in private:
                    excluded |= self.coverers[t - 1]
                self._push([1], self.masks[0], [self.masks[0]], self.full & ~excluded, size - 1)
                self.phase = "SEARCH"
            elif self.phase == "SEARCH":
                return self._node_event()
            elif self.phase == "ROOT_END":
                if self.rootNodes > 2**32 - 1 or self.rootBytes > 2**32 - 1:
                    raise Refused("ROOT_U32_OVERFLOW")
                event = bytes([245]) + struct.pack("<II", self.rootNodes, self.rootBytes)
                self.b.charge("bytes", len(event))
                self.private = []
                self.rootIndex += 1
                self.phase = ("ROOT_START" if self.rootIndex < len(self.roots)
                              and self.roots[self.rootIndex][0] == self.size else "SUPPORT_END")
            elif self.phase == "SUPPORT_END":
                self.b.reserve(self.size * len(self.minimal) + 128)
                table = self._raw(self.minimal)
                self.finalized[str(self.size)] = table
                event = bytes([247, self.size]) + struct.pack("<Q", len(table) // self.size) + hashlib.sha256(table).digest()
                self.b.charge("bytes", len(event))
                old = sum(256 + len(row) for row in self.minimal)
                self.minimal.clear()
                self.b.release(old)
                self.supportIndex = self.extraRank = self.sizeExtensions = 0
                self.extra = [1] * (self.target - self.size) if table else None
                self.phase = "EXTEND" if table else "SIZE_END"
            elif self.phase == "EXTEND":
                self.b.charge("extensions")
                table = self.finalized[str(self.size)]
                support = table[self.supportIndex * self.size:(self.supportIndex + 1) * self.size]
                image = self._canonical(list(support) + self.extra)
                event = bytes([246, self.size, len(self.extra)]) + struct.pack("<I", self.supportIndex) + bytes(self.extra) + image
                self.b.charge("bytes", len(event))
                self._insert(self.union, image)
                self.sizeExtensions += 1
                self.extraRank += 1
                self._advance_extra()
            elif self.phase == "SIZE_END":
                table = self.finalized[str(self.size)]
                event = bytes([248, self.size]) + struct.pack("<Q", self.sizeExtensions) + hashlib.sha256(table).digest()
                self.b.charge("bytes", len(event))
                self.supportIndex = self.extraRank = 0
                position = self.sizes.index(self.size) + 1
                if position < len(self.sizes):
                    self.size, self.phase = self.sizes[position], "ROOT_START"
                else:
                    self.phase = "FINAL_END"
            elif self.phase == "FINAL_END":
                raw = self._raw(self.union)
                event = bytes([249]) + struct.pack("<Q", len(self.union)) + hashlib.sha256(raw).digest()
                self.b.charge("bytes", len(event))
                self.size, self.private, self.frames, self.phase = 0, [], [], "TERMINAL"
            else:
                raise Refused("INTERNAL_PHASE")
            self.b.poll()
            return event
        except (Refused, MemoryError, OverflowError, RecursionError):
            self.failed = True
            raise

    @protected_snapshot
    def tables(self):
        self._check()
        self.b.reserve(8192 + sum(map(len, self.finalized.values())) + sum(map(len, self.minimal)))
        try:
            result = self.finalized.copy()
            if self.size and str(self.size) not in result:
                result[str(self.size)] = self._raw(self.minimal)
            return result
        finally:
            self.b.release(8192 + sum(map(len, self.finalized.values())) + sum(map(len, self.minimal)))

    @protected_snapshot
    def dataset(self):
        self._check()
        return self._raw(self.union)

    @protected_snapshot
    def cursor(self):
        self._check()
        self.b.reserve(16384)
        try:
            tables = self.tables()
            frames = [{"selected": list(f["selected"]),
                       "available": [v + 1 for v in indexes(f["available"])], "slots": f["slots"],
                       "options": None if f["options"] is None else list(f["options"]), "next": f["next"]}
                      for f in self.frames]
            result = {"phase": self.phase, "size": self.size, "rootIndex": self.rootIndex,
                    "private": list(self.private), "frames": frames, "supportIndex": self.supportIndex,
                    "extraRank": self.extraRank, "rootNodes": self.rootNodes, "rootBytes": self.rootBytes,
                    "searchNodes": self.b.nodes, "eventCount": self.b.events, "extensions": self.b.extensions,
                    "traceBytes": self.b.bytes - sum(map(len, tables.values())) - self.target * len(self.union),
                    "supportHashes": {s: {"count": len(raw) // int(s), "width": int(s),
                                          "sha256": hashlib.sha256(raw).hexdigest()} for s, raw in tables.items()},
                    "unionHash": hashlib.sha256(self.dataset()).hexdigest()}
            self.b.poll()
            return result
        finally:
            self.b.release(16384)


def main():
    try:
        if (len(sys.argv) != 5 or sys.argv[1] != "--build-tiny"
                or not all(os.environ.get(k) == "false" for k in FLAGS)):
            raise Refused("BUILD_ONLY_NO_WHOLE_GRANT")
        values = []
        for arg, name in zip(sys.argv[2:], ("prime", "divisor", "target")):
            prefix = "--" + name + "="
            if not arg.startswith(prefix) or not arg[len(prefix):].isascii() or not arg[len(prefix):].isdigit() or len(arg) > 20:
                raise Refused("FIXED_TINY_CLI")
            values.append(int(arg[len(prefix):]))
        if not 3 <= values[0] <= 23 or not 2 <= values[1] <= 24 or not 1 <= values[2] <= 5:
            raise Refused("BUILD_TINY_DOMAIN_NO_WHOLE_GRANT")
        engine = Engine(*values)
        while engine.next_event() is not None:
            pass
        result = {"status": "TINY_G_CANDIDATE_UNACCEPTED", "wholeGrant": 0,
                  "wholeAttempts": 4, "cursor": engine.cursor(), "admittedRows": 0}
    except (Refused, MemoryError, OverflowError, RecursionError) as error:
        result = {"status": "REFUSED", "reason": str(error)[:128], "wholeGrant": 0,
                  "wholeAttempts": 4, "admittedRows": 0}
    sys.stdout.write(json.dumps(result, sort_keys=True, separators=(",", ":"), allow_nan=False) + "\n")


if __name__ == "__main__":
    main()
