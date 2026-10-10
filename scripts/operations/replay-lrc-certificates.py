"""Independent bounded finite-grid LRC certificate verifier.

Consumes an expected sealed scope/root and an untrusted flat tree. No producer
imports, stored outcomes, floating point, network, or model-written execution.
PASS is only full declared Cartesian/grid coverage, never unrestricted LRC.
"""
import hashlib
import json
import math
import sys
from fractions import Fraction


def require(condition, code):
    if not condition:
        raise ValueError(code)


def keys(value, expected):
    require(type(value) is dict and set(value) == set(expected), "OBJECT_FIELDS")


def integer(value, low, high):
    require(type(value) is int and low <= value <= high, "INTEGER_DOMAIN")
    return value


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"),
                                    ensure_ascii=False).encode()).hexdigest()


def hex_digest(value):
    require(type(value) is str and len(value) == 64 and
            all(c in "0123456789abcdef" for c in value), "DIGEST_DOMAIN")


def verifier(request):
    keys(request, ("scope", "rootContractDigest", "certificate"))
    scope, root, cert = request["scope"], request["rootContractDigest"], request["certificate"]
    hex_digest(root)
    keys(scope, ("version", "totalRunners", "modulus", "axes"))
    require(scope["version"] == 1 and type(scope["version"]) is int, "SCOPE_VERSION")
    n = integer(scope["totalRunners"], 2, 15)
    modulus = integer(scope["modulus"], 2, 128)
    axes = scope["axes"]
    require(type(axes) is list and len(axes) == n - 1, "AXIS_COUNT")
    used, total = set(), 1
    for axis in axes:
        require(type(axis) is list and 0 < len(axis) <= 127, "AXIS_DOMAIN")
        for speed in axis:
            integer(speed, 1, modulus - 1)
        require(axis == sorted(set(axis)) and not used.intersection(axis), "AXIS_ORDER_DISJOINT")
        used.update(axis)
        total *= len(axis)
    require(total <= 10000, "TUPLE_LIMIT")
    keys(cert, ("version", "rootContractDigest", "scopeDigest", "rootNodeId", "nodes", "certificateDigest"))
    require(cert["version"] == 1 and type(cert["version"]) is int, "CERT_VERSION")
    for name in ("scopeDigest", "certificateDigest", "rootContractDigest"):
        hex_digest(cert[name])
    require(cert["rootContractDigest"] == root and cert["scopeDigest"] == digest(scope), "SEALED_BINDING")
    body = {k: v for k, v in cert.items() if k != "certificateDigest"}
    require(cert["certificateDigest"] == digest(body), "CERT_DIGEST")
    require(len(json.dumps(cert, separators=(",", ":")).encode()) <= 2097152, "CERT_BYTE_LIMIT")
    nodes = cert["nodes"]
    require(type(nodes) is list and 0 < len(nodes) <= 20000, "NODE_LIMIT")
    index = {}
    kind_fields = {"SPLIT": ("axis", "children"), "GRID": ("gridIndex",),
                   "SHIFT": ("baseNumerator", "baseDenominator", "shiftModulus", "shiftIndex"),
                   "CRT": ("baseNumerator", "baseDenominator", "shiftModulus", "factors"),
                   "NO_GRID": (), "UNRESOLVED": ("reason",)}
    for node in nodes:
        require(type(node) is dict and node.get("kind") in kind_fields, "NODE_KIND")
        keys(node, ("id", "box", "kind") + kind_fields[node["kind"]])
        node_id = node["id"]
        require(type(node_id) is str and 0 < len(node_id) <= 64 and
                node_id.isascii() and all(c.isalnum() or c in "_-" for c in node_id), "NODE_ID")
        require(node_id not in index, "DUPLICATE_NODE")
        box = node["box"]
        keys(box, ("lower", "upper"))
        require(type(box["lower"]) is list and type(box["upper"]) is list and
                len(box["lower"]) == n - 1 and len(box["upper"]) == n - 1, "BOX_AXES")
        for i, axis in enumerate(axes):
            integer(box["lower"][i], 0, len(axis) - 1)
            integer(box["upper"][i], box["lower"][i], len(axis) - 1)
        index[node_id] = node
    require(type(cert["rootNodeId"]) is str and cert["rootNodeId"] in index, "ROOT_NODE")
    root_box = {"lower": [0] * (n - 1), "upper": [len(axis) - 1 for axis in axes]}
    require(index[cert["rootNodeId"]]["box"] == root_box, "ROOT_COVERAGE")
    summary = dict(status="PASS", scopeDigest=cert["scopeDigest"], certificateDigest=cert["certificateDigest"],
                   totalTuples=total, coveredTuples=0, witnessTuples=0, gridExcludedTuples=0,
                   unresolvedTuples=0, nodeCount=len(nodes), leafCount=0, gridLeaves=0,
                   shiftLeaves=0, crtLeaves=0, noGridLeaves=0, unresolvedLeaves=0, errors=[])
    seen, pending = set(), [cert["rootNodeId"]]
    while pending:
        node_id = pending.pop()
        require(node_id in index and node_id not in seen, "CYCLE_OR_MULTIPARENT")
        seen.add(node_id)
        node = index[node_id]
        box, kind = node["box"], node["kind"]
        size = math.prod(hi - lo + 1 for lo, hi in zip(box["lower"], box["upper"]))
        if kind == "SPLIT":
            axis = integer(node["axis"], 0, n - 2)
            children = node["children"]
            require(type(children) is list and 2 <= len(children) <= 127 and
                    all(type(child) is str for child in children) and len(set(children)) == len(children), "CHILD_IDS")
            next_low = box["lower"][axis]
            for child_id in children:
                require(child_id in index, "MISSING_CHILD")
                child = index[child_id]["box"]
                for i in range(n - 1):
                    if i != axis:
                        require(child["lower"][i] == box["lower"][i] and
                                child["upper"][i] == box["upper"][i], "NONPARTITION_AXIS")
                require(child["lower"][axis] == next_low and child["upper"][axis] <= box["upper"][axis],
                        "PARTITION_GAP_OR_OVERLAP")
                next_low = child["upper"][axis] + 1
            require(next_low == box["upper"][axis] + 1, "PARTITION_INCOMPLETE")
            pending.extend(reversed(children))
            continue
        summary["leafCount"] += 1
        if kind == "UNRESOLVED":
            require(node["reason"] in ("WORK_LIMIT", "TIME_LIMIT", "NODE_LIMIT", "OUTPUT_LIMIT"), "UNRESOLVED_REASON")
            summary["unresolvedLeaves"] += 1
            summary["unresolvedTuples"] += size
            continue
        speeds = [axis[box["lower"][i]:box["upper"][i] + 1] for i, axis in enumerate(axes)]
        def good(j, speed):
            remainder = j * speed % modulus
            return n * min(remainder, modulus - remainder) >= modulus
        if kind == "NO_GRID":
            require(size == 1, "EXCLUSION_NOT_SINGLETON")
            require(all(not all(good(j, axis[0]) for axis in speeds) for j in range(modulus)), "FALSE_GRID_EXCLUSION")
            summary["noGridLeaves"] += 1
            summary["gridExcludedTuples"] += 1
        else:
            if kind == "GRID":
                j = integer(node["gridIndex"], 0, modulus - 1)
                summary["gridLeaves"] += 1
            else:
                numerator = integer(node["baseNumerator"], 0, modulus - 1)
                denominator = integer(node["baseDenominator"], modulus, modulus)
                d = integer(node["shiftModulus"], 1, 128)
                require(modulus % d == 0, "SHIFT_NOT_GRID_ALIGNED")
                if kind == "SHIFT":
                    q = integer(node["shiftIndex"], 0, d - 1)
                    summary["shiftLeaves"] += 1
                else:
                    factors = node["factors"]
                    require(type(factors) is list and 2 <= len(factors) <= 7, "CRT_FACTORS")
                    mods, pairs = [], []
                    for factor in factors:
                        keys(factor, ("modulus", "residue"))
                        m = integer(factor["modulus"], 2, 128)
                        r = integer(factor["residue"], 0, m - 1)
                        require((not mods or m > mods[-1]) and all(math.gcd(m, prior) == 1 for prior in mods), "CRT_NOT_COPRIME")
                        mods.append(m)
                        pairs.append((m, r))
                    require(math.prod(mods) == d, "CRT_PRODUCT")
                    # Independent CRT reconstruction uses modular inverses, not primary search.
                    q = sum(r * (d // m) * pow(d // m, -1, m) for m, r in pairs) % d
                    summary["crtLeaves"] += 1
                grid = modulus * (Fraction(numerator, denominator) + Fraction(q, d))
                require(grid.denominator == 1, "RATIONAL_OFF_GRID")
                j = grid.numerator % modulus
            require(all(good(j, speed) for axis in speeds for speed in axis), "INVALID_WITNESS")
            summary["witnessTuples"] += size
        summary["coveredTuples"] += size
    require(len(seen) == len(index), "UNREACHABLE_NODE")
    require(summary["coveredTuples"] + summary["unresolvedTuples"] == total, "TOTAL_COVERAGE")
    if summary["unresolvedTuples"]:
        summary["status"] = "PARTIAL"
    return {"method": "LRC_PYTHON_TREE_REPLAY_V1", "summary": summary}


if __name__ == "__main__":
    try:
        payload = sys.stdin.buffer.read(2200001)
        require(len(payload) <= 2200000, "INPUT_BYTE_LIMIT")
        def unique_pairs(pairs):
            obj = {}
            for key, value in pairs:
                require(key not in obj, "DUPLICATE_JSON_KEY")
                obj[key] = value
            return obj
        request = json.loads(payload, object_pairs_hook=unique_pairs,
                             parse_constant=lambda _: (_ for _ in ()).throw(ValueError("NONFINITE_JSON")))
        result = verifier(request)
        print(json.dumps(result, separators=(",", ":"), ensure_ascii=False))
    except (ValueError, TypeError, KeyError, OverflowError, RecursionError):
        print('{"method":"LRC_PYTHON_TREE_REPLAY_V1","error":"INVALID_CERTIFICATE"}')
        sys.exit(1)
