"""Independent ordered modular-fiber tree checker, not a universal LRC checker.

No primary imports, author executable, stored answers, network or model code.
COMPLETE means full arithmetic classification, possibly including survivors.
The declared lower-case LRC premise is never discharged by this program.
"""
import hashlib
import json
import math
import sys

DEPENDENCY = "LOWER_LRC_12_DECLARED_NOT_REPLAYED"


def require(condition, code):
    if not condition:
        raise ValueError(code)


def keys(value, names):
    require(type(value) is dict and set(value) == set(names), "OBJECT_FIELDS")


def integer(value, low, high):
    require(type(value) is int and low <= value <= high, "INTEGER_DOMAIN")
    return value


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def hex_digest(value):
    require(type(value) is str and len(value) == 64 and
            all(c in "0123456789abcdef" for c in value), "DIGEST_DOMAIN")


def check(request):
    keys(request, ("scope", "rootContractDigest", "certificate"))
    scope, root, cert = request["scope"], request["rootContractDigest"], request["certificate"]
    hex_digest(root)
    keys(scope, ("version", "totalRunners", "prime", "parentLevel", "targetLevel",
                 "parentResidues", "digitAxes", "sourceDigest", "lowerDependency"))
    require(type(scope["version"]) is int and scope["version"] == 1, "SCOPE_VERSION")
    require(type(scope["totalRunners"]) is int and scope["totalRunners"] == 14, "RUNNER_COUNT")
    p = integer(scope["prime"], 17, 257)
    require(all(p % d for d in range(2, math.isqrt(p) + 1)), "NOT_PRIME")
    parent_level = integer(scope["parentLevel"], 1, 14)
    level = integer(scope["targetLevel"], 2, 14)
    require(level % parent_level == 0 and level // parent_level >= 2, "LEVEL_RATIO")
    parent_modulus, modulus, radix = parent_level * p, level * p, level // parent_level
    hex_digest(scope["sourceDigest"])
    require(scope["lowerDependency"] == DEPENDENCY, "DEPENDENCY_NOT_DECLARED")
    base, axes = scope["parentResidues"], scope["digitAxes"]
    require(type(base) is list and len(base) == 13 and type(axes) is list and len(axes) == 13, "COORDINATE_COUNT")
    total = 1
    for residue, axis in zip(base, axes):
        integer(residue, 1, parent_modulus - 1)
        require(residue % p != 0, "ZERO_PRIME_RESIDUE")
        require(type(axis) is list and 0 < len(axis) <= radix, "DIGIT_AXIS")
        for digit in axis:
            integer(digit, 0, radix - 1)
        require(axis == sorted(set(axis)), "DIGIT_ORDER")
        total *= len(axis)
    require(total <= 20000, "TUPLE_LIMIT")
    keys(cert, ("version", "rootContractDigest", "scopeDigest", "rootNodeId", "nodes", "certificateDigest"))
    require(type(cert["version"]) is int and cert["version"] == 1, "CERT_VERSION")
    for name in ("scopeDigest", "certificateDigest", "rootContractDigest"):
        hex_digest(cert[name])
    require(cert["rootContractDigest"] == root and cert["scopeDigest"] == digest(scope), "SEALED_BINDING")
    require(cert["certificateDigest"] == digest({k: v for k, v in cert.items() if k != "certificateDigest"}), "CERT_DIGEST")
    require(len(canonical(cert).encode()) <= 8388608, "CERT_BYTE_LIMIT")
    nodes = cert["nodes"]
    require(type(nodes) is list and 0 < len(nodes) <= 40000, "NODE_LIMIT")
    extras = {"SPLIT": ("axis", "children"), "GRID": ("gridIndex",),
              "OMIT_GCD": ("omittedIndex", "divisor"), "SURVIVOR": (), "UNRESOLVED": ("reason",)}
    by_id = {}
    for node in nodes:
        require(type(node) is dict and node.get("kind") in extras, "NODE_KIND")
        keys(node, ("id", "box", "kind") + extras[node["kind"]])
        ident = node["id"]
        require(type(ident) is str and 0 < len(ident) <= 64 and ident.isascii() and
                all(c.isalnum() or c in "_-" for c in ident), "NODE_ID")
        require(ident not in by_id, "DUPLICATE_NODE")
        box = node["box"]
        keys(box, ("lower", "upper"))
        require(type(box["lower"]) is list and type(box["upper"]) is list and
                len(box["lower"]) == 13 and len(box["upper"]) == 13, "BOX_COORDINATES")
        for i, axis in enumerate(axes):
            integer(box["lower"][i], 0, len(axis) - 1)
            integer(box["upper"][i], box["lower"][i], len(axis) - 1)
        by_id[ident] = node
    require(type(cert["rootNodeId"]) is str and cert["rootNodeId"] in by_id, "ROOT_NODE")
    root_box = dict(lower=[0] * 13, upper=[len(axis) - 1 for axis in axes])
    require(by_id[cert["rootNodeId"]]["box"] == root_box, "ROOT_COVERAGE")
    summary = dict(status="COMPLETE", scopeDigest=cert["scopeDigest"], certificateDigest=cert["certificateDigest"],
                   totalTuples=total, classifiedTuples=0, witnessTuples=0, gcdTuples=0, survivorTuples=0,
                   unresolvedTuples=0, nodeCount=len(nodes), leafCount=0, gridLeaves=0, gcdLeaves=0,
                   survivorLeaves=0, unresolvedLeaves=0, survivors=[], lowerDependency=DEPENDENCY, errors=[])
    visited, pending = set(), [cert["rootNodeId"]]
    while pending:
        ident = pending.pop()
        require(ident in by_id and ident not in visited, "CYCLE_OR_MULTIPARENT")
        visited.add(ident)
        node = by_id[ident]
        box, kind = node["box"], node["kind"]
        count = math.prod(hi - lo + 1 for lo, hi in zip(box["lower"], box["upper"]))
        if kind == "SPLIT":
            axis = integer(node["axis"], 0, 12)
            children = node["children"]
            require(type(children) is list and 2 <= len(children) <= 14 and
                    all(type(child) is str for child in children) and len(set(children)) == len(children), "CHILD_IDS")
            expected_low = box["lower"][axis]
            for child_id in children:
                require(child_id in by_id, "MISSING_CHILD")
                child = by_id[child_id]["box"]
                for i in range(13):
                    if i != axis:
                        require(child["lower"][i] == box["lower"][i] and
                                child["upper"][i] == box["upper"][i], "NONPARTITION_COORDINATE")
                require(child["lower"][axis] == expected_low and child["upper"][axis] <= box["upper"][axis],
                        "PARTITION_GAP_OR_OVERLAP")
                expected_low = child["upper"][axis] + 1
            require(expected_low == box["upper"][axis] + 1, "PARTITION_INCOMPLETE")
            pending.extend(reversed(children))
            continue
        summary["leafCount"] += 1
        if kind == "UNRESOLVED":
            require(node["reason"] in ("WORK_LIMIT", "TIME_LIMIT", "NODE_LIMIT", "OUTPUT_LIMIT"), "UNRESOLVED_REASON")
            summary["unresolvedTuples"] += count
            summary["unresolvedLeaves"] += 1
            continue
        choices = [[(base[i] + axes[i][j] * parent_modulus) % modulus
                    for j in range(box["lower"][i], box["upper"][i] + 1)] for i in range(13)]
        def good(j, residue):
            remainder = j * residue % modulus
            return 14 * min(remainder, modulus - remainder) >= modulus
        def omission_gcd(omitted):
            result = level
            for i, options in enumerate(choices):
                if i != omitted:
                    for residue in options:
                        result = math.gcd(result, residue)
            return result
        if kind == "GRID":
            j = integer(node["gridIndex"], 0, modulus - 1)
            require(all(good(j, residue) for options in choices for residue in options), "FALSE_GRID_WITNESS")
            summary["witnessTuples"] += count
            summary["gridLeaves"] += 1
        elif kind == "OMIT_GCD":
            omitted = integer(node["omittedIndex"], 0, 12)
            divisor = integer(node["divisor"], 2, level)
            require(divisor == omission_gcd(omitted), "FALSE_OMIT_GCD")
            summary["gcdTuples"] += count
            summary["gcdLeaves"] += 1
        else:
            require(count == 1, "SURVIVOR_NOT_SINGLETON")
            require(all(not all(good(j, options[0]) for options in choices) for j in range(modulus)), "SURVIVOR_HAS_WITNESS")
            require(all(omission_gcd(i) == 1 for i in range(13)), "SURVIVOR_HAS_GCD")
            digits = [axes[i][box["lower"][i]] for i in range(13)]
            residues = [options[0] for options in choices]
            summary["survivors"].append(dict(digits=digits, residues=residues))
            summary["survivorTuples"] += 1
            summary["survivorLeaves"] += 1
        summary["classifiedTuples"] += count
    require(len(visited) == len(by_id), "UNREACHABLE_NODE")
    require(summary["classifiedTuples"] + summary["unresolvedTuples"] == total, "TOTAL_COVERAGE")
    summary["survivors"].sort(key=lambda row: row["digits"])
    if summary["unresolvedTuples"]:
        summary["status"] = "PARTIAL"
    return dict(method="LRC_MODULAR_PYTHON_TREE_REPLAY_V1", summary=summary)


if __name__ == "__main__":
    try:
        raw = sys.stdin.buffer.read(9000001)
        require(len(raw) <= 9000000, "INPUT_LIMIT")
        def unique(pairs):
            result = {}
            for key, value in pairs:
                require(key not in result, "DUPLICATE_JSON_KEY")
                result[key] = value
            return result
        result = check(json.loads(raw, object_pairs_hook=unique,
                                 parse_constant=lambda _: (_ for _ in ()).throw(ValueError("NONFINITE_JSON"))))
        output = json.dumps(result, separators=(",", ":"), ensure_ascii=False) + "\n"
        require(len(output.encode()) <= 262144, "OUTPUT_LIMIT")
        sys.stdout.write(output)
    except (ValueError, TypeError, KeyError, OverflowError, RecursionError):
        print('{"method":"LRC_MODULAR_PYTHON_TREE_REPLAY_V1","error":"INVALID_OR_INCOMPLETE_CERTIFICATE"}')
        sys.exit(1)
