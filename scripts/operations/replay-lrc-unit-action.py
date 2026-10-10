"""TIP050 independent signed-endpoint union over pinned proof sources.

Only verified local048/049 literal sources are injected by the host. The input
cannot specify executable text, file paths, URLs, imports or a proof subset.
"""
import hashlib
import json
import math
import sys
import time
from collections import defaultdict

CONTRACT = "93acc34e6cd0ca009fc9e6a7ab65df0ec801b0cf956874c355ee861967a255e9"
BASE_REPORT = "97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac"
FRONTIER_REPORT = "e1f1825b817e21b1672e64e025a1c4790d4e1518b94a9e1ab866cb757604f420"
BASE_RAW = "40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1"
FRONTIER_RAW = "a609fcf1fdd6c7d225568d1d830b6a09d069a8657fec7f5bc422f4d588865268"
FRONTIER_CONTRACT = "04e2cb6a61cb254341e9bea42567f560018d51d39c9147c332f5795033e34def"
COVER_SOURCE = "8d7ebb7e05d0c2476700118c9119224bf8841df53d9513102820d292428146b4"
FRONTIER_SOURCE = "3dd6f02b2207e6a1e1d724a6403a55af932cae211b645f1243c1e2acdecdb3e2"
FRONTIER_PROGRAM = "16cd594ffa4f644dd3db251a8ece148b3f0959e57712db2ca0718669d2ebd2bf"
DEPENDENCY = "LOWER_LRC_12_DECLARED_NOT_REPLAYED"
GAPS = ["LEVEL1_ALL_ORBIT_COMPLETENESS_NOT_REPLAYED", "OTHER_PRIMES_NOT_REPLAYED",
        "FULL_TERMINAL_7_POWER_13_NOT_REPLAYED", "LOWER_LRC_12_NOT_REPLAYED",
        "ANALYTIC_PRODUCT_BOUND_NOT_REPLAYED"]
PLAN_METHOD = "LRC_KERNEL_UNIT_ACTION_PLAN_V1"
METHOD = "LRC_KERNEL_UNIT_UNION_V1"
REPLAY = "LRC_UNIT_ACTION_PYTHON_UNION_V1"
UNITS = [dict(t=t, s=1 + 398 * t) for t in (0, 2, 3, 4, 5, 6)]
TOTAL = 7 ** 13


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


def check_sources(base, frontier, checkpoint):
    fields(frontier, ("version", "method", "status", "generatedAt", "contractDigest", "baseReportRawSha256",
                      "baseReportDigest", "sourceManifestDigest", "loopKind", "phases", "archiveWholeVerified",
                      "globalVerdict", "lowerDependency", "uncoveredObligations", "evidence", "reportDigest"))
    require(frontier["reportDigest"] == FRONTIER_REPORT and digest(unsigned(frontier, "reportDigest")) == FRONTIER_REPORT,
            "IMMUTABLE_FRONTIER_PIN")
    require(type(frontier["version"]) is int and frontier["version"] == 1 and
            frontier["method"] == "ALLIKVERE_FRONTIER_CHECKPOINT_REPORT_V1" and
            frontier["contractDigest"] == FRONTIER_CONTRACT and frontier["baseReportRawSha256"] == BASE_RAW and
            frontier["baseReportDigest"] == BASE_REPORT and frontier["sourceManifestDigest"] == base["sourceManifestDigest"] and
            frontier["loopKind"] == "LOCAL_COMPUTATIONAL_TOOL_AGENT_LOOP" and
            frontier["phases"] == ["CHOOSE", "EXECUTE", "INDEPENDENT_REPLAY", "COMPOSE", "STOP"] and
            frontier["archiveWholeVerified"] is False and frontier["globalVerdict"] == "NOT_ESTABLISHED" and
            frontier["lowerDependency"] == DEPENDENCY and frontier["uncoveredObligations"] == GAPS, "FRONTIER_BOUNDARIES")
    evidence = frontier["evidence"]
    fields(evidence, ("version", "packet", "primary", "independent", "evidenceDigest"))
    require(type(evidence["version"]) is int and evidence["version"] == 1 and
            evidence["evidenceDigest"] == digest(unsigned(evidence, "evidenceDigest")), "FRONTIER_EVIDENCE_DIGEST")
    independent = evidence["independent"]
    fields(independent, ("method", "status", "coverScriptDigest", "scriptDigest", "programDigest", "outputDigest", "summary"))
    require(independent["method"] == "LRC_FRONTIER_PYTHON_COMPOSITION_V1" and
            independent["coverScriptDigest"] == COVER_SOURCE and independent["scriptDigest"] == FRONTIER_SOURCE and
            independent["programDigest"] == FRONTIER_PROGRAM, "FRONTIER_EXECUTION_PINS")
    require(globals().get("_LRC_COVER_SOURCE_SHA") == COVER_SOURCE and
            globals().get("_LRC_FRONTIER_SOURCE_SHA") == FRONTIER_SOURCE and
            callable(globals().get("_LRC_FRONTIER_CHECK")), "PINNED_CHECKERS_UNAVAILABLE")
    checkpoint()
    output = _LRC_FRONTIER_CHECK(dict(base=base, packet=evidence["packet"]), time.monotonic())
    checkpoint()
    output_bytes = canonical(output) + "\n"
    require(len(output_bytes.encode()) <= 1048576, "OLD_FRONTIER_OUTPUT_LIMIT")
    summary = output["summary"]
    require(canonical(summary) == canonical(evidence["primary"]) and
            canonical(summary) == canonical(independent["summary"]) and
            summary["status"] == independent["status"] == frontier["status"] and
            independent["outputDigest"] == sha(output_bytes), "FRONTIER_REPLAY_DISAGREEMENT")
    return summary


def lift_prefix(node, target):
    p = node["prefix"]
    require(p[:min(len(p), len(target))] == target[:min(len(p), len(target))], "SOURCE_PREFIX_ESCAPE")
    return list(target if len(p) < len(target) else p)


def extract(base, frontier, checkpoint, charge):
    groups = []
    packet = frontier["evidence"]["packet"]
    parents = [row for row in base["rows"] if row["kind"] == "FULL"]
    require(len(parents) == 4, "FOUR_PARENTS")
    total_leaves = 0
    for parent in parents:
        scope = parent["scope"]
        require(scope["prime"] == 199 and scope["parentLevel"] == 2 and scope["targetLevel"] == 14 and
                scope["totalRunners"] == 14 and scope["digitAxes"] == [list(range(7)) for _ in range(13)], "FULL_PARENT_DOMAIN")
        certificate = parent["evidence"]["certificate"]
        charge(len(certificate["nodes"]))
        refs = [dict(origin="BASE", jobDigest=None, certificateDigest=certificate["certificateDigest"],
                     nodeId=n["id"], nodeDigest=digest(n), prefix=list(n["prefix"]))
                for n in certificate["nodes"] if n["kind"] == "COVER_BOUND"]
        child_jobs = []
        for index, job in enumerate(packet["plan"]["jobs"]):
            if job["parentId"] != parent["id"]:
                continue
            child_jobs.append(job["jobDigest"])
            child_certificate = packet["children"][index]["evidence"]["certificate"]
            for node in child_certificate["nodes"]:
                charge(1)
                if node["kind"] == "COVER_BOUND":
                    refs.append(dict(origin="CHILD", jobDigest=job["jobDigest"], certificateDigest=child_certificate["certificateDigest"],
                                     nodeId=node["id"], nodeDigest=digest(node), prefix=lift_prefix(node, job["prefix"])))
        require(len(child_jobs) == 2, "TWO_CHILDREN")
        total_leaves += len(refs)
        require(total_leaves <= 120000, "SOURCE_LEAF_LIMIT")
        descriptor = dict(parentId=parent["id"], parentRootContractDigest=parent["rootContractDigest"],
                          parentScopeDigest=digest(scope), parentCertificateDigest=certificate["certificateDigest"],
                          parentEvidenceDigest=parent["evidence"]["evidenceDigest"], childJobDigests=child_jobs,
                          sourceLeafCount=len(refs), sourceSelectionDigest=digest(refs))
        groups.append((parent, refs, descriptor))
        checkpoint()
    plan = dict(version=1, method=PLAN_METHOD, contractDigest=CONTRACT, baseReportDigest=BASE_REPORT,
                frontierReportDigest=FRONTIER_REPORT, sourceManifestDigest=base["sourceManifestDigest"],
                units=UNITS, rows=[group[2] for group in groups])
    plan["planDigest"] = digest(plan)
    return groups, plan


def transformed_prefix(prefix, residues, t):
    return [((1 - t) * d + t * residues[i]) % 7 for i, d in enumerate(prefix)]


def prefix_interval(prefix, dimension=13):
    require(len(prefix) <= dimension and all(type(d) is int and 0 <= d < 7 for d in prefix), "PREFIX_ENCODING")
    code = 0
    for d in prefix:
        code = 7 * code + d
    size = 7 ** (dimension - len(prefix))
    return code * size, (code + 1) * size


def sweep_union(intervals, total, checkpoint, charge):
    """Independent signed endpoint multiplicity sweep, not a sorted merge."""
    events = defaultdict(int)
    for start, end in intervals:
        charge(2)
        require(type(start) is int and type(end) is int and 0 <= start < end <= total, "INTERVAL_DOMAIN")
        events[start] += 1
        events[end] -= 1
    charge(len(events) * max(1, (len(events) + 1).bit_length()))
    active, previous = 0, 0
    covered = []
    for point, delta in sorted(events.items()):
        charge(1)
        if active > 0 and previous < point:
            if covered and covered[-1][1] == previous:
                covered[-1] = (covered[-1][0], point)
            else:
                covered.append((previous, point))
        active += delta
        require(active >= 0, "NEGATIVE_SWEEP_MULTIPLICITY")
        previous = point
    require(active == 0 and len(covered) <= 1500000, "UNION_PARTITION_LIMIT")
    complement, cursor = [], 0
    for start, end in covered:
        charge(1)
        if cursor < start:
            complement.append((cursor, start))
        cursor = end
    if cursor < total:
        complement.append((cursor, total))
    checkpoint()
    return covered, complement


def interval_records(intervals):
    return [dict(start=str(start), end=str(end)) for start, end in intervals]


def check_actions(groups, checkpoint, charge):
    for unit in UNITS:
        s, t = unit["s"], unit["t"]
        require(math.gcd(s, 2786) == 1 and s % 398 == 1 and math.gcd(s, 14) == 1, "KERNEL_UNIT")
        permutation = [min(s * j % 2786, 2786 - (s * j % 2786)) for j in range(1, 1394)]
        charge(1393)
        require(len(set(permutation)) == 1393 and set(permutation) == set(range(1, 1394)), "FOLDED_TIME_BIJECTION")
        for parent, _, _ in groups:
            for r in parent["scope"]["parentResidues"]:
                images = []
                for d in range(7):
                    charge(1)
                    image = ((1 - t) * d + t * r) % 7
                    require((s * (r + 398 * d)) % 2786 == r + 398 * image, "COORDINATE_ACTION_IDENTITY")
                    images.append(image)
                require(sorted(images) == list(range(7)), "DIGIT_BIJECTION")
        checkpoint()
    # A common time multiplier preserves the grid-good predicate on EVERY
    # modular residue, including the exact14*distance==M boundary.
    for unit in UNITS:
        s = unit["s"]
        for remainder in range(2786):
            charge(1)
            require((14 * min(remainder, 2786 - remainder) >= 2786) ==
                    (14 * min(remainder % 2786, (-remainder) % 2786) >= 2786), "EXACT_GOOD_PREDICATE")
        # Associativity establishes bad(s*v,j)=bad(v,s*j) for all v,j;
        # independently verify every labelled speed and every grid time too.
        for parent, _, _ in groups:
            for r in parent["scope"]["parentResidues"]:
                for d in range(7):
                    v, transformed = r + 398 * d, s * (r + 398 * d) % 2786
                    for j in range(2786):
                        charge(1)
                        left, right = transformed * j % 2786, v * (s * j % 2786) % 2786
                        require((14 * min(left, 2786 - left) >= 2786) ==
                                (14 * min(right, 2786 - right) >= 2786), "COMMON_TIME_ACTION")
            checkpoint()


def check(request, started):
    def checkpoint():
        require(time.monotonic() - started < 90, "AGGREGATE_TIME_LIMIT")

    work = 0

    def charge(count):
        nonlocal work
        work += count
        require(work <= 50000000, "METHOD_WORK_LIMIT")
        if work % 2048 < count:
            checkpoint()

    fields(request, ("base", "frontier", "plan"))
    checkpoint()
    base, frontier = request["base"], request["frontier"]
    prior = check_sources(base, frontier, checkpoint)
    groups, expected = extract(base, frontier, checkpoint, charge)
    require(canonical(request["plan"]) == canonical(expected), "SEALED_ACTION_PLAN")
    check_actions(groups, checkpoint, charge)
    rows, all_candidates = [], 0
    for index, (parent, refs, _) in enumerate(groups):
        intervals, raw_count = [], 0
        for ref in refs:
            for unit in UNITS:
                charge(len(ref["prefix"]) + 1)
                image = transformed_prefix(ref["prefix"], parent["scope"]["parentResidues"], unit["t"])
                interval = prefix_interval(image)
                intervals.append(interval)
                raw_count += interval[1] - interval[0]
        all_candidates += len(intervals)
        require(all_candidates <= 1500000, "CANDIDATE_INTERVAL_LIMIT")
        covered, complement = sweep_union(intervals, TOTAL, checkpoint, charge)
        union_count = sum(end - start for start, end in covered)
        remaining = sum(end - start for start, end in complement)
        original = int(prior["rows"][index]["current"]["witnessTuples"])
        # Identity source leaves are disjoint by the independently checked
        # source partition/composition; verify their symbolic cardinality.
        identity_count = sum(7 ** (13 - len(ref["prefix"])) for ref in refs)
        require(identity_count == original and 0 <= original <= union_count <= TOTAL and
                union_count + remaining == TOTAL and raw_count >= union_count, "EXACT_UNION_CARDINALITY")
        u, c = interval_records(covered), interval_records(complement)
        rows.append(dict(parentId=parent["id"], status="COMPLETE" if remaining == 0 else "PARTIAL",
                         totalTuples=str(TOTAL), originalWitnessTuples=str(original), unionWitnessTuples=str(union_count),
                         deltaWitnessTuples=str(union_count - original), remainingTuples=str(remaining),
                         rawTransportTuples=str(raw_count), overlapTuples=str(raw_count - union_count),
                         sourceLeafCount=len(refs), candidateIntervals=len(intervals), unionIntervals=len(u), complementIntervals=len(c),
                         unionDigest=digest(u), complementDigest=digest(c), unionExamples=u[:8], complementExamples=c[:8]))
        checkpoint()
    summary = dict(version=1, method=METHOD, status="COMPLETE" if all(r["status"] == "COMPLETE" for r in rows) else "PARTIAL",
                   planDigest=expected["planDigest"], baseReportDigest=BASE_REPORT, frontierReportDigest=FRONTIER_REPORT,
                   globalVerdict="NOT_ESTABLISHED", lowerDependency=DEPENDENCY, uncoveredObligations=GAPS, rows=rows)
    result = dict(method=REPLAY, summary=summary)
    canonical(result)
    checkpoint()
    return result


if __name__ == "__main__":
    try:
        started = time.monotonic()
        raw = sys.stdin.buffer.read(83886081)
        require(len(raw) <= 83886080, "TRANSPORT_BYTE_LIMIT")

        def unique(pairs):
            value = {}
            for key, item in pairs:
                require(key not in value, "DUPLICATE_JSON_KEY")
                value[key] = item
            return value

        request = json.loads(raw, object_pairs_hook=unique,
                             parse_constant=lambda _: (_ for _ in ()).throw(ValueError("NONFINITE_JSON")))
        output = canonical(check(request, started)) + "\n"
        require(len(output.encode()) <= 1048576, "OUTPUT_BYTE_LIMIT")
        require(time.monotonic() - started < 90, "FINAL_TIME_LIMIT")
        sys.stdout.write(output)
    except (ValueError, TypeError, KeyError, OverflowError, RecursionError):
        print('{"method":"LRC_UNIT_ACTION_PYTHON_UNION_V1","error":"INVALID_OR_RESOURCE_LIMIT"}')
        sys.exit(1)
