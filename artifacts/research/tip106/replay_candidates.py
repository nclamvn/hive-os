"""Replay every SAVED feasible candidate area; no chamber/gradient cover check.

Reads the immutable partial walk artifact, independently recomputes every saved
candidate with BOTH retained TIP098 exact sweeps, and preserves open-frontier
scope. It does not generate candidates or certify stationarity/feasibility.
"""
import argparse
from collections import Counter
from fractions import Fraction as F
import hashlib
import json
from pathlib import Path
import signal
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tip098"))
from kakeya_exact import area_affine,area_trapezoid,rational,validate_offsets


def integer(value,label):
    if type(value) is not int or value<0:
        raise ValueError("BAD_NONNEGATIVE_INTEGER:"+label)
    return value


def no_duplicate_keys(pairs):
    result={}
    for key,value in pairs:
        if key in result:
            raise ValueError("DUPLICATE_JSON_KEY:"+key)
        result[key]=value
    return result


def replay(path,seconds=55):
    start=time.monotonic()
    raw=Path(path).read_bytes()
    if len(raw)>64*1024*1024:
        raise ValueError("INPUT_ARTIFACT_LIMIT")
    data=json.loads(raw,object_pairs_hook=no_duplicate_keys)
    if not isinstance(data,dict) or data.get("status")!="PARTIAL_TOPOLOGY_NAVIGATION_ROOT_OPEN":
        raise ValueError("NOT_SAVED_PARTIAL_WALK")
    chambers=data.get("chambers")
    frontier=data.get("open_frontier")
    if not isinstance(chambers,list) or not isinstance(frontier,list):
        raise ValueError("MISSING_CHAMBERS_OR_FRONTIER")
    if len(chambers)!=integer(data.get("processed_chambers"),"processed_chambers"):
        raise ValueError("CHAMBER_COUNT_MISMATCH")
    if len(frontier)!=integer(data.get("open_frontier_count"),"open_frontier_count"):
        raise ValueError("FRONTIER_COUNT_MISMATCH")
    if not isinstance(data.get("coverage"),str) or not data["coverage"].startswith("NONE:"):
        raise ValueError("UNSUPPORTED_COVERAGE_CLAIM")
    stats=data.get("stats")
    if not isinstance(stats,dict):
        raise ValueError("MISSING_REPLAY_STATS")
    counts=Counter()
    checks=[]
    def check(record,coordinates,kind,chamber_index,facet_index=None):
        if time.monotonic()-start>seconds:
            raise TimeoutError("FINITE_REPLAY_SECONDS_LIMIT")
        if not isinstance(record,dict) or record.get("agreement") is not True:
            raise ValueError("BAD_SAVED_EXACT_RECORD")
        if record.get("status")!="EXACT_FINITE_UPPER_BOUND" or record.get("global_optimality")!="NOT_ESTABLISHED":
            raise ValueError("BAD_FINITE_SCOPE")
        xs=validate_offsets(record.get("offsets"))
        if len(xs)!=6 or xs[-1]!=0:
            raise ValueError("BAD_K6_GAUGE")
        if not isinstance(coordinates,list) or len(coordinates)!=(5 if kind=="stationary" else 6):
            raise ValueError("BAD_SAVED_STATIONARY_COORDINATES")
        parsed=tuple(rational(v) for v in coordinates)
        if xs!=parsed[:5]+(F(0),):
            raise ValueError("SAVED_POINT_OFFSET_MISMATCH")
        stored=rational(record.get("area"))
        stored_second=rational(record.get("area_affine"))
        primary=area_trapezoid(xs)
        secondary=area_affine(xs)
        if primary!=secondary or primary!=stored or secondary!=stored_second:
            raise ArithmeticError("EXACT_REPLAY_MISMATCH")
        counts[kind]+=1
        item={"kind":kind,"chamber_index":chamber_index,"offsets":list(map(str,xs)),
              "area":str(primary),"area_affine":str(secondary),"stored_rationals_match":True}
        if facet_index is not None:
            item["facet_index"]=facet_index
        checks.append(item)
    for chamber_index,chamber in enumerate(chambers):
        if not isinstance(chamber,dict):
            raise ValueError("BAD_CHAMBER_RECORD")
        if chamber.get("status") not in ("EXACT_FEASIBLE_STATIONARY","STATIONARY_OUTSIDE_CHAMBER","SINGULAR_FULL_GRADIENT_UNRESOLVED"):
            raise ValueError("UNKNOWN_CHAMBER_DISPOSITION")
        feasible=chamber.get("status")=="EXACT_FEASIBLE_STATIONARY"
        if feasible!=("stationary_exact_area" in chamber):
            raise ValueError("STATIONARY_EXACT_RECORD_MISSING_OR_UNEXPECTED")
        if feasible:
            check(chamber["stationary_exact_area"],chamber.get("stationary"),"stationary",chamber_index)
        facets=chamber.get("facet_candidates")
        if not isinstance(facets,list):
            raise ValueError("BAD_FACET_CANDIDATE_LIST")
        for facet_index,facet in enumerate(facets):
            if not isinstance(facet,dict):
                raise ValueError("BAD_FACET_RECORD")
            if facet.get("status") not in ("EXACT_FEASIBLE_FACE_KKT","FACE_KKT_OUTSIDE_CHAMBER","SINGULAR_FACE_KKT_UNRESOLVED"):
                raise ValueError("UNKNOWN_FACET_DISPOSITION")
            feasible=facet.get("status")=="EXACT_FEASIBLE_FACE_KKT"
            if feasible!=("exact_area" in facet):
                raise ValueError("FACE_EXACT_RECORD_MISSING_OR_UNEXPECTED")
            if feasible:
                check(facet["exact_area"],facet.get("solution"),"facet",chamber_index,facet_index)
    total=sum(counts.values())
    if total==0:
        raise ValueError("NO_SAVED_FEASIBLE_CANDIDATES")
    expected={"stationary":integer(stats.get("EXACT_FEASIBLE_STATIONARY"),"EXACT_FEASIBLE_STATIONARY"),
              "facet":integer(stats.get("EXACT_FEASIBLE_FACE_KKT"),"EXACT_FEASIBLE_FACE_KKT")}
    if any(counts[k]!=v for k,v in expected.items()) or total!=integer(stats.get("exact_candidate_replays"),"exact_candidate_replays"):
        raise ValueError("SAVED_CANDIDATE_COUNT_MISMATCH")
    minimum=min(rational(row["area"]) for row in checks)
    below=[row for row in checks if rational(row["area"])<F(20,93)]
    return {"status":"ALL_SAVED_FINITE_CANDIDATE_AREAS_REPLAYED","input_sha256":hashlib.sha256(raw).hexdigest(),
            "counts":{"stationary":counts["stationary"],"facet":counts["facet"],"total":total},
            "stored_stats_match":True,"minimum_area":str(minimum),"target":"20/93",
            "no_smaller_saved_candidate":not below,"smaller_saved_candidates":below,"checks":checks,
            "open_frontier_count":len(frontier),"source_processed_chambers":len(chambers),
            "source_staged_polynomials":integer(stats.get("polynomials"),"polynomials"),
            "coverage":"NONE","global_lower_bound":"NOT_ESTABLISHED",
            "elapsed_seconds":time.monotonic()-start,"max_seconds":seconds,
            "scope":"all SAVED exact feasible candidate areas only; no stationary/feasibility proof, frontier verification, missing-record recovery or chamber coverage"}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("walk",nargs="?",default=str(Path(__file__).parent/"BUILDER_TOPOLOGY_WALK.json"))
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    if Path(args.out).exists():
        raise SystemExit("REFUSED:output already exists")
    def expired(signum,frame):
        raise TimeoutError("60_SECOND_PROCESS_LIMIT")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(59)
    try:
        result=replay(args.walk)
    except (ValueError,TypeError,KeyError,ArithmeticError,OSError,TimeoutError) as exc:
        result={"status":"REFUSED_FINITE_CANDIDATE_REPLAY","reason":str(exc),"coverage":"NONE", "global_lower_bound":"NOT_ESTABLISHED"}
    encoded=json.dumps(result,sort_keys=True)+"\n"
    if len(encoded.encode())>1024*1024:
        result={"status":"REFUSED_FINITE_CANDIDATE_REPLAY","reason":"OUTPUT_1MIB_LIMIT","coverage":"NONE"}
        encoded=json.dumps(result,sort_keys=True)+"\n"
    with Path(args.out).open("x",encoding="utf-8") as output:
        output.write(encoded)
    print(json.dumps({k:v for k,v in result.items() if k not in ("checks","smaller_saved_candidates")},sort_keys=True))
    raise SystemExit(0 if result["status"]=="ALL_SAVED_FINITE_CANDIDATE_AREAS_REPLAYED" else 3)
