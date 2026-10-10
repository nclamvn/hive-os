"""Independent symbolic prefix-tree replay. No producer/author executable imports.

Strict union bound proves forall completion exists a grid witness, not a common
witness. COMPLETE and PARTIAL are arithmetic coverage, not theorem acceptance.
"""
import hashlib
import json
import math
import sys
import time

METHOD = "LRC_MODULAR_BOUND_TREE_V1"
REPLAY = "LRC_COVER_PYTHON_TREE_REPLAY_V1"
DEPENDENCY = "LOWER_LRC_12_DECLARED_NOT_REPLAYED"


def require(ok, code):
    if not ok:
        raise ValueError(code)


def fields(value, names):
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
    started, work = time.monotonic(), 0

    def charge(amount=1):
        nonlocal work
        work += amount
        require(work <= 20000000, "WORK_LIMIT")
        require(time.monotonic() - started < 10, "TIME_LIMIT")

    fields(request, ("scope", "rootContractDigest", "certificate"))
    scope, root, cert = request["scope"], request["rootContractDigest"], request["certificate"]
    hex_digest(root)
    fields(scope, ("version", "method", "totalRunners", "prime", "parentLevel", "targetLevel",
                   "parentResidues", "digitAxes", "sourceDigest", "lowerDependency"))
    require(type(scope["version"]) is int and scope["version"] == 1 and
            type(scope["totalRunners"]) is int and scope["totalRunners"] == 14 and
            scope["method"] == METHOD, "SCOPE_METHOD")
    p = integer(scope["prime"], 17, 257)
    require(all(p % d for d in range(2, math.isqrt(p) + 1)), "NOT_PRIME")
    parent = integer(scope["parentLevel"], 1, 14)
    level = integer(scope["targetLevel"], 2, 14)
    require(level % parent == 0 and level // parent >= 2, "LEVEL_RATIO")
    hex_digest(scope["sourceDigest"])
    require(scope["lowerDependency"] == DEPENDENCY, "DEPENDENCY")
    base, axes = scope["parentResidues"], scope["digitAxes"]
    require(type(base) is list and len(base) == 13 and type(axes) is list and len(axes) == 13, "COORDINATES")
    modulus, parent_modulus, radix = level * p, parent * p, level // parent
    for residue, axis in zip(base, axes):
        integer(residue, 1, parent_modulus - 1)
        require(residue % p != 0, "ZERO_PRIME_RESIDUE")
        require(type(axis) is list and 1 <= len(axis) <= 7, "DIGIT_AXIS")
        for digit in axis:
            integer(digit, 0, radix - 1)
        require(axis == sorted(set(axis)), "DIGIT_ORDER")
    total = math.prod(len(axis) for axis in axes)
    require(total <= 96889010407, "CARDINALITY")
    fields(cert, ("version", "method", "rootContractDigest", "scopeDigest", "rootNodeId", "nodes", "certificateDigest"))
    require(type(cert["version"]) is int and cert["version"] == 1 and cert["method"] == METHOD, "CERT_METHOD")
    for key in ("rootContractDigest", "scopeDigest", "certificateDigest"):
        hex_digest(cert[key])
    require(cert["rootContractDigest"] == root and cert["scopeDigest"] == digest(scope), "ROOT_SCOPE_BINDING")
    require(cert["certificateDigest"] == digest({k: v for k, v in cert.items() if k != "certificateDigest"}), "CERT_DIGEST")
    require(len(canonical(cert).encode()) <= 16777216, "CERT_BYTE_LIMIT")
    nodes = cert["nodes"]
    require(type(nodes) is list and 1 <= len(nodes) <= 20000, "NODE_LIMIT")
    extras = {"SPLIT": ("children",), "COVER_BOUND": ("uncoveredCount", "maxBad"),
              "OMIT_GCD": ("omittedIndex", "divisor"), "SURVIVOR": (), "UNRESOLVED": ("reason",)}
    by_id = {}
    for node in nodes:
        charge()
        require(type(node) is dict and node.get("kind") in extras, "NODE_KIND")
        fields(node, ("id", "prefix", "kind") + extras[node["kind"]])
        ident = node["id"]
        require(type(ident) is str and 1 <= len(ident) <= 64 and ident.isascii() and
                all(c.isalnum() or c in "_-" for c in ident), "NODE_ID")
        require(ident not in by_id, "DUPLICATE_NODE")
        prefix = node["prefix"]
        require(type(prefix) is list and len(prefix) <= 13, "PREFIX")
        for i, d in enumerate(prefix):
            integer(d, 0, radix - 1)
            require(d in axes[i], "PREFIX_DIGIT")
        by_id[ident] = node
    require(type(cert["rootNodeId"]) is str and cert["rootNodeId"] in by_id and
            by_id[cert["rootNodeId"]]["prefix"] == [], "ROOT_PREFIX")

    # Independently derive full-grid bad predicates and then fold j and M-j.
    # j=0 is always bad and cannot witness. For even M, M/2 is included once.
    half = modulus // 2
    universe = (1 << half) - 1
    bad = []
    for i, axis in enumerate(axes):
        choices = {}
        for d in axis:
            residue = (base[i] + parent_modulus * d) % modulus
            full = 0
            for j in range(modulus):
                charge()
                r = j * residue % modulus
                if 14 * min(r, modulus - r) < modulus:
                    full |= 1 << j
            choices[d] = (full >> 1) & universe
        bad.append(choices)
    summary = dict(status="COMPLETE", scopeDigest=cert["scopeDigest"], certificateDigest=cert["certificateDigest"],
                   totalTuples=str(total), classifiedTuples="0", witnessTuples="0", gcdTuples="0", survivorTuples="0",
                   unresolvedTuples="0", nodeCount=0, leafCount=0, coverLeaves=0, gcdLeaves=0, survivorLeaves=0,
                   unresolvedLeaves=0, survivors=[], lowerDependency=DEPENDENCY, errors=[])
    counts = dict(witnessTuples=0, gcdTuples=0, survivorTuples=0, unresolvedTuples=0)
    visited, pending = set(), [(cert["rootNodeId"], universe)]
    while pending:
        charge()
        ident, uncovered = pending.pop()
        require(ident in by_id and ident not in visited, "CYCLE_OR_MULTIPARENT")
        visited.add(ident)
        summary["nodeCount"] += 1
        node = by_id[ident]
        prefix, kind = node["prefix"], node["kind"]
        depth = len(prefix)
        count = math.prod(len(axis) for axis in axes[depth:])
        if kind == "SPLIT":
            require(depth < 13, "SPLIT_AT_SINGLETON")
            children = node["children"]
            require(type(children) is list and len(children) == len(axes[depth]) and
                    all(type(child) is str for child in children), "CHILDREN")
            for d, child_id in zip(axes[depth], children):
                require(child_id in by_id and by_id[child_id]["prefix"] == prefix + [d], "PREFIX_PARTITION")
                pending.append((child_id, uncovered & (universe ^ bad[depth][d])))
            continue
        summary["leafCount"] += 1
        if kind == "UNRESOLVED":
            require(node["reason"] in ("WORK_LIMIT", "TIME_LIMIT", "NODE_LIMIT", "OUTPUT_LIMIT"), "RESOURCE_REASON")
            counts["unresolvedTuples"] += count
            summary["unresolvedLeaves"] += 1
            continue
        if kind == "COVER_BOUND":
            uncovered_count = integer(node["uncoveredCount"], 0, 1799)
            maximum = node["maxBad"]
            require(type(maximum) is list and len(maximum) == 13 - depth, "BOUND_DIMENSIONS")
            actual = []
            for i in range(depth, 13):
                gains = []
                for mask in bad[i].values():
                    charge()
                    gains.append((uncovered & mask).bit_count())
                actual.append(max(gains))
            for gain in maximum:
                integer(gain, 0, 1799)
            require(uncovered_count == uncovered.bit_count() and maximum == actual and
                    uncovered_count > sum(actual), "FALSE_COVER_BOUND")
            counts["witnessTuples"] += count
            summary["coverLeaves"] += 1
            continue
        require(depth == 13 and count == 1, "SINGLETON_REQUIRED")
        require(uncovered == 0, "SINGLETON_HAS_GRID_WITNESS")
        residues = [(v + parent_modulus * d) % modulus for v, d in zip(base, prefix)]

        def omit_gcd(omitted):
            result = level
            for i, residue in enumerate(residues):
                if i != omitted:
                    charge()
                    result = math.gcd(result, residue)
            return result

        if kind == "OMIT_GCD":
            omitted = integer(node["omittedIndex"], 0, 12)
            divisor = integer(node["divisor"], 2, 14)
            require(divisor == omit_gcd(omitted), "FALSE_OMIT_GCD")
            counts["gcdTuples"] += 1
            summary["gcdLeaves"] += 1
        else:
            require(all(omit_gcd(i) == 1 for i in range(13)), "FALSE_SURVIVOR_GCD")
            counts["survivorTuples"] += 1
            summary["survivorLeaves"] += 1
            summary["survivors"].append(dict(digits=prefix, residues=residues))
    require(len(visited) == len(by_id), "UNREACHABLE_NODE")
    classified = counts["witnessTuples"] + counts["gcdTuples"] + counts["survivorTuples"]
    require(classified + counts["unresolvedTuples"] == total, "CARDINALITY_COVERAGE")
    for key, value in counts.items():
        summary[key] = str(value)
    summary["classifiedTuples"] = str(classified)
    summary["survivors"].sort(key=lambda row: row["digits"])
    if counts["unresolvedTuples"]:
        summary["status"] = "PARTIAL"
    output = dict(method=REPLAY, summary=summary)
    canonical(output)
    charge()
    return output


if __name__ == "__main__":
    try:
        outer_started = time.monotonic()
        raw = sys.stdin.buffer.read(17000001)
        require(len(raw) <= 17000000, "INPUT_LIMIT")

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
        # Includes input parsing and final output serialization/size observation.
        require(time.monotonic() - outer_started < 10, "FINAL_TIME_LIMIT")
        sys.stdout.write(output)
    except (ValueError, TypeError, KeyError, OverflowError, RecursionError):
        print('{"method":"LRC_COVER_PYTHON_TREE_REPLAY_V1","error":"INVALID_OR_RESOURCE_LIMIT"}')
        sys.exit(1)
