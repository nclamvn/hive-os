"""Independent TIP049 composition over immutable pinned TIP048 arithmetic.

The host loads verified literal checker bytes into a private non-main namespace.
No checker source, import path or executable is accepted in the JSON request.
"""
import hashlib
import json
import math
import sys
import time

CONTRACT = "04e2cb6a61cb254341e9bea42567f560018d51d39c9147c332f5795033e34def"
BASE_REPORT = "97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac"
BASE_RAW = "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1"
BASE_CONTRACT = "4712dc80fed2331ad8bc87627840205d0a31eaa97fa42f95f7d0bbde2f39ad2b"
COVER_SOURCE = "8d7ebb7e05d0c2476700118c9119224bf8841df53d9513102820d292428146b4"
METHOD = "LRC_FRONTIER_COMPOSITION_V1"
REPLAY = "LRC_FRONTIER_PYTHON_COMPOSITION_V1"
DEPENDENCY = "LOWER_LRC_12_DECLARED_NOT_REPLAYED"
GAPS = ["LEVEL1_ALL_ORBIT_COMPLETENESS_NOT_REPLAYED", "OTHER_PRIMES_NOT_REPLAYED",
        "FULL_TERMINAL_7_POWER_13_NOT_REPLAYED", "LOWER_LRC_12_NOT_REPLAYED",
        "ANALYTIC_PRODUCT_BOUND_NOT_REPLAYED"]
COUNTS = ("witnessTuples", "gcdTuples", "survivorTuples", "unresolvedTuples")


def require(ok, code):
    if not ok:
        raise ValueError(code)


def fields(value, names):
    require(type(value) is dict and set(value) == set(names), "OBJECT_FIELDS")


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()


def digest(value):
    return sha(canonical(value))


def unsigned(value, key):
    return {k: v for k, v in value.items() if k != key}


def check_cover(evidence, scope, root):
    fields(evidence, ("version", "rootContractDigest", "scopeDigest", "certificate", "primary", "independent", "evidenceDigest"))
    require(type(evidence["version"]) is int and evidence["version"] == 1 and
            evidence["rootContractDigest"] == root and evidence["scopeDigest"] == digest(scope), "EVIDENCE_BINDING")
    require(evidence["evidenceDigest"] == digest(unsigned(evidence, "evidenceDigest")), "EVIDENCE_DIGEST")
    independent = evidence["independent"]
    fields(independent, ("method", "status", "scriptDigest", "outputDigest", "summary"))
    require(independent["method"] == "LRC_COVER_PYTHON_TREE_REPLAY_V1" and
            independent["scriptDigest"] == COVER_SOURCE, "COVER_SOURCE_PIN")
    require(globals().get("_LRC_COVER_SOURCE_SHA") == COVER_SOURCE and
            callable(globals().get("_LRC_COVER_CHECK")), "PINNED_CHECKER_UNAVAILABLE")
    output = _LRC_COVER_CHECK(dict(scope=scope, rootContractDigest=root, certificate=evidence["certificate"]))
    summary = output["summary"]
    output_bytes = json.dumps(output, separators=(",", ":"), ensure_ascii=False) + "\n"
    require(len(output_bytes.encode()) <= 262144, "COVER_OUTPUT_LIMIT")
    require(canonical(summary) == canonical(evidence["primary"]) and canonical(summary) == canonical(independent["summary"]) and
            summary["status"] == independent["status"] and independent["outputDigest"] == sha(output_bytes), "COVER_REPLAY_DISAGREEMENT")
    return summary


def check_base(base, checkpoint):
    fields(base, ("version", "method", "status", "generatedAt", "contractDigest", "sourceManifestDigest",
                  "archiveWholeVerified", "globalVerdict", "lowerDependency", "uncoveredObligations", "rows", "reportDigest"))
    require(base["reportDigest"] == BASE_REPORT and digest(unsigned(base, "reportDigest")) == BASE_REPORT and
            base["contractDigest"] == BASE_CONTRACT, "IMMUTABLE_BASE_PIN")
    require(type(base["version"]) is int and base["version"] == 1 and
            base["method"] == "ALLIKVERE_COMPACT_COVER_REPORT_V1" and base["status"] == "PARTIAL" and
            base["archiveWholeVerified"] is False and base["globalVerdict"] == "NOT_ESTABLISHED" and
            base["lowerDependency"] == DEPENDENCY and base["uncoveredObligations"] == GAPS and
            type(base["rows"]) is list and len(base["rows"]) == 8, "BASE_BOUNDARIES")
    summaries = {}
    for row in base["rows"]:
        checkpoint()
        fields(row, ("id", "kind", "authorMember", "authorTerminalDigits", "sourceShardRootDigest", "scope", "rootContractDigest", "evidence"))
        summaries[row["id"]] = check_cover(row["evidence"], row["scope"], row["rootContractDigest"])
        checkpoint()
    return summaries


def cardinality(scope, depth=0):
    return math.prod(len(axis) for axis in scope["digitAxes"][depth:])


def expected_plan(base):
    jobs = []
    for parent in [row for row in base["rows"] if row["kind"] == "FULL"]:
        evidence, scope = parent["evidence"], parent["scope"]
        leaves = [n for n in evidence["certificate"]["nodes"] if n["kind"] == "UNRESOLVED"]
        require(len(leaves) >= 2, "TWO_DISTINCT_TARGETS_REQUIRED")
        closure = min(leaves, key=lambda n: (-len(n["prefix"]), tuple(n["prefix"])))
        mass = min((n for n in leaves if n["id"] != closure["id"]),
                   key=lambda n: (-cardinality(scope, len(n["prefix"])), tuple(n["prefix"])))
        for role, node in (("closure-control", closure), ("strategic-mass", mass)):
            assigned = node["prefix"]
            child_scope = dict(scope)
            child_scope["digitAxes"] = [[assigned[i]] if i < len(assigned) else list(axis)
                                        for i, axis in enumerate(scope["digitAxes"])]
            binding = dict(parentId=parent["id"], role=role, nodeId=node["id"], prefix=list(assigned),
                           totalTuples=str(cardinality(scope, len(assigned))),
                           parentRootContractDigest=parent["rootContractDigest"],
                           parentScopeDigest=digest(scope), parentCertificateDigest=evidence["certificate"]["certificateDigest"],
                           parentEvidenceDigest=evidence["evidenceDigest"], targetNodeDigest=digest(node), childScope=child_scope)
            root_binding = dict(method="LRC_FRONTIER_CHILD_ROOT_V1", contractDigest=CONTRACT,
                                baseReportDigest=BASE_REPORT, baseRawSha256=BASE_RAW, **binding)
            job = dict(binding, childRootContractDigest=digest(root_binding))
            job["jobDigest"] = digest(job)
            jobs.append(job)
    require(len(jobs) == 8, "JOB_COUNT")
    plan = dict(version=1, method="LRC_FRONTIER_PLAN_V1", contractDigest=CONTRACT,
                baseReportDigest=BASE_REPORT, baseRawSha256=BASE_RAW,
                sourceManifestDigest=base["sourceManifestDigest"], jobs=jobs)
    plan["planDigest"] = digest(plan)
    return plan


def frontier(node, scope, certificate_digest, job=None):
    child_prefix = node["prefix"]
    if job is None:
        mapped = list(child_prefix)
    else:
        target = job["prefix"]
        require(child_prefix[:min(len(child_prefix), len(target))] == target[:min(len(child_prefix), len(target))],
                "CHILD_PREFIX_ESCAPED_TARGET")
        mapped = list(target if len(child_prefix) < len(target) else child_prefix)
    return dict(origin="CHILD" if job else "BASE", jobDigest=job["jobDigest"] if job else None,
                certificateDigest=certificate_digest, nodeId=node["id"], prefix=mapped,
                totalTuples=str(cardinality(scope, len(child_prefix))))


def check(request, started):
    def checkpoint():
        require(time.monotonic() - started < 40, "AGGREGATE_TIME_LIMIT")

    fields(request, ("base", "packet"))
    base, packet = request["base"], request["packet"]
    require(len(canonical(packet).encode()) <= 67108864, "PACKET_BYTE_LIMIT")
    checkpoint()
    base_summaries = check_base(base, checkpoint)
    checkpoint()
    plan = expected_plan(base)
    fields(packet, ("version", "method", "contractDigest", "baseReportDigest", "plan", "children", "packetDigest"))
    require(type(packet["version"]) is int and packet["version"] == 1 and packet["method"] == METHOD and
            packet["contractDigest"] == CONTRACT and packet["baseReportDigest"] == BASE_REPORT, "PACKET_BINDING")
    require(packet["packetDigest"] == digest(unsigned(packet, "packetDigest")), "PACKET_DIGEST")
    require(canonical(packet["plan"]) == canonical(plan), "DETERMINISTIC_PLAN_BINDING")
    children = packet["children"]
    require(type(children) is list and len(children) == 8, "CHILD_COUNT")
    rows = []
    parents = [row for row in base["rows"] if row["kind"] == "FULL"]
    require(len(parents) == 4, "PARENT_COUNT")
    for row_index, parent in enumerate(parents):
        original = base_summaries[parent["id"]]
        previous = {key: original[key] for key in COUNTS}
        current = {key: int(previous[key]) for key in COUNTS}
        selected = plan["jobs"][row_index * 2:row_index * 2 + 2]
        target_ids = {job["nodeId"] for job in selected}
        require(len(target_ids) == 2, "DUPLICATE_TARGET")
        remaining = [frontier(node, parent["scope"], parent["evidence"]["certificate"]["certificateDigest"])
                     for node in parent["evidence"]["certificate"]["nodes"]
                     if node["kind"] == "UNRESOLVED" and node["id"] not in target_ids]
        for offset, job in enumerate(selected):
            checkpoint()
            child = children[row_index * 2 + offset]
            fields(child, ("jobDigest", "evidence"))
            require(child["jobDigest"] == job["jobDigest"], "CHILD_JOB_BINDING")
            summary = check_cover(child["evidence"], job["childScope"], job["childRootContractDigest"])
            require(summary["totalTuples"] == job["totalTuples"] and
                    str(cardinality(job["childScope"])) == job["totalTuples"], "SUBDOMAIN_CARDINALITY")
            for key in COUNTS[:3]:
                current[key] += int(summary[key])
            current["unresolvedTuples"] += int(summary["unresolvedTuples"]) - int(job["totalTuples"])
            for node in child["evidence"]["certificate"]["nodes"]:
                if node["kind"] == "UNRESOLVED":
                    region = frontier(node, job["childScope"], child["evidence"]["certificate"]["certificateDigest"], job)
                    require(str(cardinality(parent["scope"], len(region["prefix"]))) == region["totalTuples"],
                            "MAPPED_FRONTIER_CARDINALITY")
                    remaining.append(region)
        remaining.sort(key=lambda leaf: (tuple(leaf["prefix"]), leaf["nodeId"]))
        for before, after in zip(remaining, remaining[1:]):
            left, right = before["prefix"], after["prefix"]
            require(not (len(left) <= len(right) and right[:len(left)] == left), "FRONTIER_NOT_ANTICHAIN")
        require(all(value >= 0 for value in current.values()) and sum(current.values()) == int(original["totalTuples"]) and
                sum(int(leaf["totalTuples"]) for leaf in remaining) == current["unresolvedTuples"], "COMPOSITION_CARDINALITY")
        delta = {key: current[key] - int(previous[key]) for key in COUNTS[:3]}
        require(all(value >= 0 for value in delta.values()), "NONMONOTONE_COUNTS")
        delta["classifiedTuples"] = sum(delta.values())
        rows.append(dict(parentId=parent["id"], status="COMPLETE" if current["unresolvedTuples"] == 0 else "PARTIAL",
                         totalTuples=original["totalTuples"], previous=previous,
                         current={key: str(value) for key, value in current.items()},
                         delta={key: str(value) for key, value in delta.items()}, remainingFrontier=remaining))
        checkpoint()
    summary = dict(version=1, method=METHOD, status="COMPLETE" if all(row["status"] == "COMPLETE" for row in rows) else "PARTIAL",
                   baseReportDigest=BASE_REPORT, planDigest=plan["planDigest"], packetDigest=packet["packetDigest"],
                   globalVerdict="NOT_ESTABLISHED", lowerDependency=DEPENDENCY, uncoveredObligations=GAPS, rows=rows)
    output = dict(method=REPLAY, summary=summary)
    canonical(output)
    checkpoint()
    return output


if __name__ == "__main__":
    try:
        started = time.monotonic()
        # Transport includes the separately supplied immutable~7MiB base plus
        # the64MiB packet. Each embedded048certificate still has its old16MiB cap.
        raw = sys.stdin.buffer.read(83886081)
        require(len(raw) <= 83886080, "TRANSPORT_BYTE_LIMIT")

        def unique(pairs):
            result = {}
            for key, value in pairs:
                require(key not in result, "DUPLICATE_JSON_KEY")
                result[key] = value
            return result

        request = json.loads(raw, object_pairs_hook=unique,
                             parse_constant=lambda _: (_ for _ in ()).throw(ValueError("NONFINITE_JSON")))
        result = check(request, started)
        output = canonical(result) + "\n"
        require(len(output.encode()) <= 1048576, "OUTPUT_BYTE_LIMIT")
        require(time.monotonic() - started < 40, "FINAL_TIME_LIMIT")
        sys.stdout.write(output)
    except (ValueError, TypeError, KeyError, OverflowError, RecursionError):
        print('{"method":"LRC_FRONTIER_PYTHON_COMPOSITION_V1","error":"INVALID_OR_RESOURCE_LIMIT"}')
        sys.exit(1)
