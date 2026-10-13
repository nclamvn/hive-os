"""Bounded coarse-chamber navigation with exact stationary/contact candidates.

No chamber-coverage claim; floating rays guide navigation only. Every proposed
counterexample is verified by both immutable exact TIP098 area routines.
"""
from collections import Counter,deque
from fractions import Fraction as F
import argparse
import json
from pathlib import Path
import signal
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tip105"))
from k6_local import arrangements,at,polynomial,WITNESS,ready
from k6_structured import area_float,exact_record,persist_result


def unique_solve(matrix,rhs):
    n=len(matrix)
    work=[list(row)+[value] for row,value in zip(matrix,rhs)]
    for column in range(n):
        pivot=next((p for p in range(column,n) if work[p][column]),None)
        if pivot is None:
            return None
        work[column],work[pivot]=work[pivot],work[column]
        divisor=work[column][column]
        work[column]=[v/divisor for v in work[column]]
        for p in range(n):
            if p!=column:
                divisor=work[p][column]
                work[p]=[a-divisor*b for a,b in zip(work[p],work[column])]
    return tuple(row[-1] for row in work)


def disconnected_arithmetic():
    bounds={1:F(1,12),2:F(1,9),3:F(9,80),4:F(10,81),5:F(125,936)}
    sums=[bounds[k]+bounds[6-k] for k in (1,2,3)]
    return {"subset_cardinality_lower_bounds":{str(k):str(v) for k,v in bounds.items()},
            "bipartition_sums":list(map(str,sums)),"minimum_disconnected_bound":str(min(sums)),
            "gap_over_target":str(min(sums)-F(20,93)),
            "connected_path_offset_radius":"25/6",
            "proof_scope":"arithmetic supporting Main's moment/graph proof; no apex-order reduction"}


def walk(seconds=52,cell_cap=500,frontier_cap=5000,facet_cap=8):
    start=time.monotonic()
    endpoints,heights,coarse,fine=arrangements()
    float_walls=[tuple(map(float,w)) for w in coarse]
    visited=set()
    queued=set()
    pending=deque()
    stats=Counter()
    ledger=[]
    witness=None
    stopped_frontier=[]
    def guard():
        if time.monotonic()-start>seconds:
            raise TimeoutError("TOPOLOGY_SECONDS_LIMIT")
    def word(point):
        values=[at(w,point) for w in coarse]
        if any(v==0 for v in values):
            return None
        return tuple(1 if v>0 else -1 for v in values)
    def generic(point):
        zero=[w for w in fine if at(w,point)==0]
        direction=None
        for t in range(1,4*len(zero)+2):
            trial=tuple(F(t)**i for i in range(5))
            if all(sum(w[i]*trial[i] for i in range(5))!=0 for w in zero):
                direction=trial
                break
        if direction is None:
            raise ArithmeticError("NO_GENERIC_DIRECTION")
        step=F(1,1000000)
        for w in fine:
            value=at(w,point)
            derivative=sum(w[i]*direction[i] for i in range(5))
            if value and derivative:
                step=min(step,abs(value/derivative)/2)
        return tuple(x+step*v for x,v in zip(point,direction))
    def enqueue(point,source):
        guard()
        if any(abs(v)>=F(25,6) for v in point):
            stats["outside_connected_cube_navigation_skipped"]+=1
            return
        center=generic(point)
        signs=word(center)
        if signs in queued:
            return
        if len(pending)>=frontier_cap:
            stopped_frontier.append({"point":center,"source":source})
            stats["frontier_capacity_unenqueued"]+=1
            return
        queued.add(signs)
        pending.append((center,signs,source))
    def candidate(point,kind):
        nonlocal witness
        stats["exact_candidate_replays"]+=1
        result=exact_record(point+(F(0),))
        if F(result["area"])<F(20,93):
            witness={"kind":kind,"exact":result}
        return result
    enqueue(WITNESS,"TIP105 regional witness")
    navigation=json.loads((Path(__file__).parent/"BUILDER_HIERARCHICAL_NAVIGATION.json").read_text())
    for row in navigation["runs"]:
        point=tuple(F(v).limit_denominator(1000) for v in row["float_offsets"][:5])
        enqueue(point,"hierarchical_schedule_"+str(row["schedule_index"]))
    reason="CELL_LIMIT_WITH_OPEN_FRONTIER"
    current=None
    try:
        while pending and len(ledger)<cell_cap and witness is None:
            guard()
            current=pending.popleft()
            center,signs,source=current
            if signs in visited:
                continue
            visited.add(signs)
            Q=polynomial(center,endpoints,heights)
            H=[[2*Q[i][j] for j in range(5)] for i in range(5)]
            linear=[2*Q[i][5] for i in range(5)]
            stationary=unique_solve(H,[-v for v in linear])
            record={"center":center,"source":source,"coarse_signs":signs,"quadratic_matrix":Q,
                    "stationary":stationary,"facet_candidates":[],"status":"SINGULAR_FULL_GRADIENT_UNRESOLVED"}
            stats["polynomials"]+=1
            if stationary is not None:
                violations=[i for i,(w,s) in enumerate(zip(coarse,signs)) if at(w,stationary)*s<0]
                record["violated_stationary_chamber_constraints"]=violations
                record["status"]="STATIONARY_OUTSIDE_CHAMBER" if violations else "EXACT_FEASIBLE_STATIONARY"
                if not violations:
                    record["stationary_exact_area"]=candidate(stationary,"full_gradient_stationary")
            else:
                stats["singular_stationary_omitted"]+=1
            # Float normal rays propose first-contact faces/neighbors only.
            # No assertion that this finds every facet, cell or tie intersection.
            cf=list(map(float,center))
            values=[sum(w[i]*cf[i] for i in range(5))+w[5] for w in float_walls]
            neighbor_rows={}
            for wall_index,wall in enumerate(float_walls):
                guard()
                direction=[-signs[wall_index]*wall[i] for i in range(5)]
                events=[]
                for i,w in enumerate(float_walls):
                    derivative=sum(w[j]*direction[j] for j in range(5))
                    if derivative:
                        t=-values[i]/derivative
                        if t>1e-12:
                            events.append((t,i))
                if not events:
                    continue
                events.sort()
                first,face=events[0]
                second=next((t for t,i in events if t>first+max(1e-10,abs(first)*1e-8)),None)
                step=first+min(.001,max(first*1e-4,1e-8)) if second is None else (first+second)/2
                point=tuple(F(cf[i]+step*direction[i]).limit_denominator(1000000) for i in range(5))
                proposed=word(point)
                if proposed is not None and proposed!=signs:
                    neighbor_rows.setdefault(face,point)
            for face,point in neighbor_rows.items():
                enqueue(point,"ray_from_chamber_"+str(len(ledger))+"_first_wall_"+str(face))
            record["ray_proposed_neighbor_faces"]=list(neighbor_rows)
            # Exact codimension1 KKT stationary/contact candidates on selectedfaces.
            for face in list(neighbor_rows)[:facet_cap]:
                guard()
                wall=coarse[face]
                matrix=[row+[F(wall[i])] for i,row in enumerate(H)]
                matrix.append(list(map(F,wall[:5]))+[F(0)])
                solution=unique_solve(matrix,[-v for v in linear]+[F(-wall[5])])
                item={"wall_index":face,"solution":solution,"status":"SINGULAR_FACE_KKT_UNRESOLVED"}
                if solution is not None:
                    point=solution[:5]
                    violations=[i for i,(w,s) in enumerate(zip(coarse,signs)) if at(w,point)*s<0]
                    item["violations"]=violations
                    item["status"]="FACE_KKT_OUTSIDE_CHAMBER" if violations else "EXACT_FEASIBLE_FACE_KKT"
                    if not violations:
                        item["exact_area"]=candidate(point,"codimension1_face_stationary")
                record["facet_candidates"].append(item)
                stats[item["status"]]+=1
                if witness is not None:
                    break
            ledger.append(record)
            stats[record["status"]]+=1
            current=None
        if witness is not None:
            reason="EXACT_SMALLER_WITNESS"
        elif not pending:
            reason="NAVIGATION_FRONTIER_EMPTY_NOT_ALL_CHAMBER_COVER"
    except TimeoutError as exc:
        reason=str(exc)
    if current is not None:
        pending.appendleft(current)
    return {"status":"EXACT_SMALLER_WITNESS" if witness else "PARTIAL_TOPOLOGY_NAVIGATION_ROOT_OPEN",
            "reason":reason,"processed_chambers":len(ledger),"queued_signwords":len(queued),
            "open_frontier_count":len(pending),"open_frontier":[{"center":p,"signs":s,"source":v} for p,s,v in pending],
            "capacity_unenqueued_frontier":stopped_frontier,"stats":dict(stats),"chambers":ledger,
            "negative_witness":witness,"elapsed_seconds":time.monotonic()-start,"max_seconds":seconds,
            "cell_cap":cell_cap,"frontier_cap":frontier_cap,"facet_candidate_cap_per_chamber":facet_cap,
            "disconnected_arithmetic":disconnected_arithmetic(),
            "coverage":"NONE: floatnormal rays incomplete; singular loci and codimension>=2 stationary intersections unresolved",
            "scope":"exact replayed finite stationary/contact candidates; no global lower bound or complete chamber inventory"}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("outer60s process envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(59)
    result=ready(walk())
    persist_result(args.out,result)
    print(json.dumps({k:v for k,v in result.items() if k not in ("chambers","open_frontier","capacity_unenqueued_frontier")},sort_keys=True))
