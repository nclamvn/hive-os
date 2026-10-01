"""TIP-038 fixed independent factor transfer: exact coprime divisor pairs.

Standalone stdlib source. No primary graph, factors, images or previous tools imported.
"""
import hashlib
import json
import math
import sys
import time

SEEDS = [(200023321, 31), (200023321, 71), (200023321, 79),
         (200602081, 23), (200602081, 43), (200602081, 67), (200602081, 83),
         (200656681, 43), (200656681, 71), (200656681, 103),
         (131433121, 11), (131433121, 19), (131433121, 31)]
MAX_SECONDS, MAX_NODES, MAX_RECORDS = 60, 256, 1000
MAX_PAIRS, MAX_WORK, MAX_OUTPUT = 50000000, 50000000, 2097152


def compact(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(compact(value).encode()).hexdigest()


class Stop(Exception):
    pass


class Investigation(Exception):
    def __init__(self, node):
        self.node = node
        super().__init__("TRANSFER_ARITHMETIC_CONTRADICTION")


class Budget:
    def __init__(self, clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK):
        self.clock, self.start = clock, clock()
        self.pair_limit, self.work_limit = pair_limit, work_limit
        self.pairs, self.work = 0, 0
        self.pending = None

    def check(self):
        if self.clock() - self.start >= MAX_SECONDS:
            raise Stop("REPLAY_TIME_LIMIT")

    def pair(self):
        self.check()
        if self.pairs >= self.pair_limit:
            raise Stop("REPLAY_PAIR_LIMIT")
        self.pairs += 1

    def step(self):
        self.check()
        if self.work >= self.work_limit:
            raise Stop("MODULAR_LIMIT")
        self.work += 1


def prime(n, b=None):
    if n < 2 or n % 2 == 0 and n != 2:
        return False
    for d in range(3, math.isqrt(n) + 1, 2):
        if b and d % 1024 == 1:
            b.check()
        if n % d == 0:
            return False
    return True


def factor(n, b):
    fs, rest = [], n
    d = 2
    while d * d <= rest:
        b.check()
        if rest % d == 0:
            e = 0
            while rest % d == 0:
                rest //= d
                e += 1
            fs.append((d, e))
        d = 3 if d == 2 else d + 2
    if rest > 1:
        fs.append((rest, 1))
    if math.prod(q**e for q, e in fs) != n or any(not prime(q, b) for q, _ in fs):
        raise ValueError("FACTOR_PRODUCT")
    return fs


def divisors(n, b):
    ds = set()
    for d in range(1, math.isqrt(n) + 1):
        if d % 1024 == 0:
            b.check()
        if n % d == 0:
            ds.add(d)
            ds.add(n // d)
    return sorted(ds)


def power(r, e, h, b):
    v = 1
    while e:
        b.step()
        if e % 2:
            v = v * r % h
        r = r * r % h
        e //= 2
    return v


def character(r, h, b):
    v = power(r % h, (h - 1) // 2, h, b)
    if v not in (1, h - 1):
        raise ValueError("ZERO_CHARACTER")
    return "-1" if v == h - 1 else "+1"


def defect(fs, image, h, b):
    S, H = set(image), []
    # Since 1 belongs to S, H is a subset of S; no scan of all h residues.
    for r in sorted(S):
        okay = True
        for s in S:
            b.step()
            if r * s % h not in S:
                okay = False
                break
        if okay:
            H.append(r)
    HS = set(H)
    n = (h - 1) // len(H)
    order_factors = factor(h - 1, b)
    visible = []
    for q, e in fs:
        r = q % h
        if r in HS:
            continue
        order = h - 1
        # Factor/power reduction yields quotient order; no order-size linear loop.
        for d, _ in order_factors:
            while order % d == 0 and power(r, order // d, h, b) in HS:
                order //= d
        visible.append({"prime": str(q), "exponent": str(e), "residue": str(r), "quotientOrder": str(order)})
    V = sum(int(f["exponent"]) for f in visible)
    nr = any(character(q, h, b) == "-1" for q, _ in fs)
    return {"stabilizer": list(map(str, H)), "size": str(len(H)), "index": str(n), "visibleMass": str(V),
            "nonresidue": nr, "visibleFactors": visible,
            "conditions": {"indexEven": n % 2 == 0, "indexTwoModFour": n % 4 == 2,
                           "nonresidueIndexAtLeastSix": not nr or n >= 6,
                           "visibleMassBound": 2 * V <= n - 2,
                           "ordersBeyondIntervals": all(int(f["quotientOrder"]) > 2 * int(f["exponent"]) + 1 for f in visible)}}


def strict(p, h, T, u, v):
    if not (0 < u <= v and math.gcd(u, v) == 1 and T % (u * v) == 0 and (u + v) % h == 0):
        raise ValueError("PARTITION_DOMAIN")
    k, A = T // (u * v), (u + v) // h
    x, y, z = sorted([T, A * p * u * k, A * p * v * k])
    if not (0 < x < y < z and 4 * x * y * z == p * (x * y + x * z + y * z)
            and sum(d % p == 0 for d in [x, y, z]) == 2):
        raise ValueError("STRICT_TYPE_II")
    return dict(zip(["u", "v", "k", "A", "x", "y", "z"], map(str, [u, v, k, A, x, y, z])))


def compute_node(p, h, depth, b):
    if not (p in {p for p, _ in SEEDS} and prime(p, b) and 3 <= h < p <= 201000000 and prime(h, b)
            and h % 4 == 3 and p % h != 0 and (p + h) % 4 == 0):
        raise ValueError("INVALID_NODE_DOMAIN")
    T = (p + h) // 4
    fs, ds = factor(T, b), divisors(T, b)
    image, best = set(), None
    for u in ds:
        for v in ds:
            b.pair()
            if T % (u * v) or math.gcd(u, v) != 1:
                continue
            b.step()
            image.add(u * pow(v, -1, h) % h)
            if u <= v and (u + v) % h == 0 and (best is None or (u, v) < best):
                best = (u, v)
    b.check()
    canonical = strict(p, h, T, *best) if best else None
    miss = None if best else defect(fs, image, h, b)
    qnr = [{"q": str(q), "exponent": str(e), "residue": str(q % h), "legendre": "-1", "eligible": q % 4 == 3,
            "blocker": None if q % 4 == 3 else "NONINTEGRAL_SHIFT"} for q, e in fs if character(q, h, b) == "-1"]
    chi = character(p, h, b)
    image = list(map(str, sorted(image)))
    node = {"id": f"{p}:{h}", "depth": str(depth), "p": str(p), "h": str(h), "T": str(T),
            "factors": [[str(q), str(e)] for q, e in fs], "image": image, "count": str(len(image)),
            "hit": best is not None, "canonical": canonical, "character": {"legendre": chi, "preferred": chi == "-1"},
            "defect": miss, "qnrFactors": qnr, "imageDigest": digest(image), "witnessDigest": digest(canonical) if canonical else None,
            "defectDigest": digest(miss) if miss else None}
    node["nodeDigest"] = digest(node)
    if miss and not all(miss["conditions"].values()):
        raise Investigation(node)
    if chi != "-1":
        raise Investigation(node)
    return node


INPUTS = {"seeds": [{"p": str(p), "h": str(h)} for p, h in SEEDS], "maxDepth": "2",
          "seedContentDigest": "a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c"}
LIMITS = {"seconds": 60, "maxNodes": 256, "maxRecords": 1000, "maxStateInsertions": 2000000,
          "maxWorkSteps": 50000000, "maxOutputBytes": 2097152}
SCOPE = "Thirteen selected exposed negative-character miss seeds; all QNR factors, canonical first-discovery BFS through depth2. Exact finite node images, transfers, blockers, revisits, frontier and progress refutations are development evidence, not an unbounded termination proof, held-out benchmark, root solution or novelty certificate. No agent-cycle authority."


def graph_summary(nodes, raw_records, complete):
    lookup = {n["id"]: n for n in nodes}
    records = []
    for original in raw_records:
        r = dict(original)
        if r["kind"] == "EDGE":
            child = lookup.get(r["to"])
            r["targetComputed"], r["toDepth"] = child is not None, child["depth"] if child else None
        r.pop("recordDigest", None)
        r["recordDigest"] = digest(r)
        records.append(r)
    frontier = [{"recordId": r["id"], "from": r["from"], "to": r["to"], "reason": "DEPTH_LIMIT"}
                for r in records if r["kind"] == "EDGE" and r["disposition"] == "DEPTH_LIMIT"]
    adjacency = {n["id"]: [r for r in records if r["kind"] == "EDGE" and r["from"] == n["id"] and r["targetComputed"]] for n in nodes}
    reachability = []
    for p, h in SEEDS:
        seed = f"{p}:{h}"
        queue = [(seed, [seed])] if seed in lookup else []
        seen, hits, first = {seed}, [], None
        for node_id, path in queue:
            if lookup[node_id]["hit"]:
                hits.append(node_id)
                if first is None:
                    first = path
            if len(path) - 1 >= 2:
                continue
            for edge in adjacency[node_id]:
                if edge["to"] not in seen:
                    seen.add(edge["to"])
                    queue.append((edge["to"], path + [edge["to"]]))
        frontier_ids = [r["id"] for r in records if r["kind"] == "EDGE" and r["disposition"] == "DEPTH_LIMIT" and r["from"] in seen]
        reachability.append({"seed": seed, "complete": complete, "reachableHitIds": hits, "firstHitPath": first,
                             "frontierRecordIds": frontier_ids, "status": "HIT_REACHABLE" if hits else "NO_HIT_IN_COMPUTED_GRAPH"})
    colors, paths, edge_paths, cycles = {}, [], [], []

    def visit(node_id):
        colors[node_id] = 1
        paths.append(node_id)
        for edge in adjacency[node_id]:
            child = edge["to"]
            if colors.get(child) == 1:
                index = paths.index(child)
                c = {"nodeIds": paths[index:] + [child], "recordIds": edge_paths[index:] + [edge["id"]]}
                c["cycleDigest"] = digest(c)
                cycles.append(c)
            elif not colors.get(child):
                edge_paths.append(edge["id"])
                visit(child)
                edge_paths.pop()
        paths.pop()
        colors[node_id] = 2
    for n in nodes:
        if not colors.get(n["id"]):
            visit(n["id"])
    progress = {c: {"status": "NO_REFUTATION_IN_COMPUTED_EDGES", "firstRefutation": None} for c in ("C1", "C2", "C3")}
    for edge in records:
        if edge["kind"] != "EDGE" or not edge["targetComputed"]:
            continue
        parent, child = lookup[edge["from"]], lookup[edge["to"]]
        if child["hit"]:
            continue
        failures = {"C1": True, "C2": int(child["defect"]["visibleMass"]) <= int(parent["defect"]["visibleMass"]),
                    "C3": int(child["defect"]["size"]) > 1}
        for c, failed in failures.items():
            if failed and progress[c]["firstRefutation"] is None:
                progress[c] = {"status": "REFUTED", "firstRefutation": {"recordId": edge["id"], "from": edge["from"], "to": edge["to"],
                              "parentNodeDigest": parent["nodeDigest"], "childNodeDigest": child["nodeDigest"]}}
    return records, frontier, reachability, cycles, progress


def seal_packet(result):
    records, frontier, reachability, cycles, progress = graph_summary(result["nodes"], result["records"], result["status"] == "COMPLETE")
    result.update(records=records, frontier=frontier, reachability=reachability, cycles=cycles, progress=progress)
    graph = {k: result[k] for k in ("nodes", "records", "frontier", "reachability", "cycles", "progress")}
    result["graphDigest"] = digest(graph)
    result["contentDigest"] = digest({"inputs": INPUTS, **graph, "graphDigest": result["graphDigest"]})
    for _ in range(16):
        result["packetDigest"] = digest({k: v for k, v in result.items() if k != "packetDigest"})
        actual = str(len(compact(result).encode()))
        if actual == result["runtime"]["outputBytes"]:
            return
        result["runtime"]["outputBytes"] = actual
    raise ValueError("OUTPUT_FIXED_POINT")


def packet(clock=time.monotonic, pair_limit=MAX_PAIRS, work_limit=MAX_WORK):
    b = Budget(clock, pair_limit, work_limit)
    queue = [(p, h, 0) for p, h in SEEDS]
    known = {f"{p}:{h}": 0 for p, h in SEEDS}
    nodes, records, snapshots = [], [], []
    status, reason = "COMPLETE", None
    b.pending = {"phase": "NODE", "id": f"{SEEDS[0][0]}:{SEEDS[0][1]}"}
    snapshots.append((0, 0, dict(b.pending)))
    try:
        index = 0
        while index < len(queue):
            p, h, depth = queue[index]
            node_id = f"{p}:{h}"
            b.pending = {"phase": "NODE", "id": node_id}
            b.check()
            if len(nodes) >= MAX_NODES:
                raise Stop("NODE_LIMIT")
            n = compute_node(p, h, depth, b)
            if index < 13 and (n["hit"] or not n["character"]["preferred"]):
                raise Investigation(n)
            nodes.append(n)
            qnrs = [] if n["hit"] else n["qnrFactors"]
            def next_pending(factor_index):
                if factor_index < len(qnrs):
                    return {"phase": "FACTOR", "id": node_id, "q": qnrs[factor_index]["q"]}
                if index + 1 < len(queue):
                    next_p, next_h, _ = queue[index + 1]
                    return {"phase": "NODE", "id": f"{next_p}:{next_h}"}
                return {"phase": "FINALIZE"}
            snapshots.append((len(nodes), len(records), next_pending(0)))
            for j, f in enumerate(qnrs):
                b.pending = {"phase": "FACTOR", "id": node_id, "q": f["q"]}
                b.check()
                if len(records) >= MAX_RECORDS:
                    raise Stop("RECORD_LIMIT")
                r = {"id": f"r{len(records)}", "from": node_id, "q": f["q"], "exponent": f["exponent"]}
                if not f["eligible"]:
                    r.update(kind="BLOCKER", residue=f["residue"], reason="NONINTEGRAL_SHIFT")
                else:
                    q, child_id = int(f["q"]), f"{p}:{f['q']}"
                    if not (q <= int(n["T"]) < p and q != h and prime(q, b) and character(p, q, b) == "-1"):
                        raise Investigation(n)
                    if child_id in known:
                        disposition = "REVISIT"
                    elif depth == 2:
                        disposition = "DEPTH_LIMIT"
                    else:
                        disposition = "DISCOVERED"
                        known[child_id] = depth + 1
                        queue.append((p, q, depth + 1))
                    r.update(kind="EDGE", to=child_id, requestedDepth=str(depth + 1), disposition=disposition,
                             targetComputed=False, toDepth=None)
                records.append(r)
                snapshots.append((len(nodes), len(records), next_pending(j + 1)))
            index += 1
        b.pending = {"phase": "FINALIZE"}
        b.check()
    except Stop as error:
        status, reason = "PARTIAL", str(error)
    result = {"method": "ERDOS_STRAUS_FACTOR_DIRECTED_TRANSFER_V1", "status": status, "inputs": INPUTS, "limits": LIMITS,
              "nodes": nodes, "records": records, "pending": dict(b.pending) if reason else None, "reason": reason,
              "scope": SCOPE, "runtime": {"pairChecks": str(b.pairs), "workSteps": str(b.work), "elapsedMs": "0", "outputBytes": "0"}}
    def seal():
        result["runtime"]["elapsedMs"] = str(round((clock() - b.start) * 1000))
        seal_packet(result)
    seal()
    if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
        full_nodes, full_records = list(nodes), list(records)
        result["status"], result["reason"] = "PARTIAL", "OUTPUT_LIMIT"
        low, high = 0, len(snapshots) - 1
        while low < high:
            mid = (low + high + 1) // 2
            nc, rc, pending = snapshots[mid]
            result.update(nodes=full_nodes[:nc], records=full_records[:rc], pending=pending)
            seal()
            if int(result["runtime"]["outputBytes"]) <= MAX_OUTPUT:
                low = mid
            else:
                high = mid - 1
        nc, rc, pending = snapshots[low]
        result.update(nodes=full_nodes[:nc], records=full_records[:rc], pending=pending)
        seal()
        if int(result["runtime"]["outputBytes"]) > MAX_OUTPUT:
            raise ValueError("OUTPUT_HEAD_LIMIT")
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
        seal()
    encoded = compact(result)
    if result["status"] == "COMPLETE" and clock() - b.start >= MAX_SECONDS:
        result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
        seal()
        encoded = compact(result)
    if len(encoded.encode()) > MAX_OUTPUT:
        raise ValueError("OUTPUT_FINAL_LIMIT")
    return result


def main():
    if len(sys.argv) != 1:
        raise ValueError("FIXED_NO_ARGUMENTS")
    try:
        start = time.monotonic()
        result = packet(clock=time.monotonic)
        payload = compact(result)
        elapsed = round((time.monotonic() - start) * 1000)
        if result["status"] == "COMPLETE" and elapsed >= MAX_SECONDS * 1000:
            result.update(status="PARTIAL", reason="REPLAY_TIME_LIMIT", pending={"phase": "FINALIZE"})
            result["runtime"]["elapsedMs"] = str(elapsed)
            seal_packet(result)
            payload = compact(result)
        if len(payload.encode()) > MAX_OUTPUT:
            raise ValueError("OUTPUT_STDOUT_LIMIT")
        print(payload, end="")
    except Investigation as error:
        payload = compact({"method": "FACTOR_TRANSFER_INVESTIGATION_V1", "status": "INVESTIGATION", "reason": str(error),
                           "node": error.node, "authority": "ARITHMETIC_DIAGNOSTIC_NOT_AUTOMATIC_SCIENTIFIC_REFUTATION"})
        if len(payload.encode()) <= MAX_OUTPUT:
            print(payload, end="")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
