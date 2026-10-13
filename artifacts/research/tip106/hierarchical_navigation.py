"""Deterministic six-leaf tree-derived navigation, never a whole-space proof."""
from fractions import Fraction as F
from functools import lru_cache
import argparse
import json
from pathlib import Path
import signal
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tip105"))
from k6_structured import area_float,exact_record,persist_result


@lru_cache(None)
def trees(labels):
    if len(labels)==1:
        return (labels[0],)
    return tuple((left,right) for split in range(1,len(labels))
                 for left in trees(labels[:split]) for right in trees(labels[split:]))


def leaves(tree):
    if isinstance(tree,int):
        return [tree]
    return leaves(tree[0])+leaves(tree[1])


def hierarchical_seed(tree,height,mode):
    """Merge child slice centroids; depth schedule is fixed and public.

    This is an original topology-inspired seed recipe, NOT a reproduction of
    Schoenberg/Keich's construction or a restriction on subsequent navigation.
    """
    offsets=[F(0)]*6
    def merge(node,y):
        if isinstance(node,int):
            return
        child_y=y/2 if mode=="lower_deeper" else (1+y)/2
        merge(node[0],child_y)
        merge(node[1],child_y)
        left,right=leaves(node[0]),leaves(node[1])
        def centroid(ids):
            return sum((offsets[j-1]+F(1,12)+F(2*j-1,12)*y for j in ids),F(0))/len(ids)
        shift=centroid(left)-centroid(right)
        for j in right:
            offsets[j-1]+=shift
    merge(tree,F(height))
    gauge=offsets[-1]
    return tuple(x-gauge for x in offsets)


def schedules():
    rows=[]
    orders=((1,2,3,4,5,6),(1,3,5,2,4,6),(6,4,2,5,3,1))
    for order_index,order in enumerate(orders):
        if order_index==0:
            configurations=[(h,mode) for h in (F(1,3),F(1,2),F(2,3))
                            for mode in ("lower_deeper","upper_deeper")]
        else:
            configurations=[(h,"lower_deeper") for h in (F(1,3),F(2,3))]
        # Configuration outermost ensures all42trees appear early.
        for height,mode in configurations:
            for tree_index,tree in enumerate(trees(order)):
                rows.append({"order":order,"tree_index":tree_index,"tree":tree,
                             "height":height,"mode":mode,
                             "offsets":hierarchical_seed(tree,height,mode)})
    return rows


def navigate(seconds=55):
    start=time.monotonic()
    evaluations=0
    ledger=[]
    deduplicated=set()
    duplicate_count=0
    best=None
    incomplete=None
    target=F(20,93)
    negative=None
    def objective(xs):
        nonlocal evaluations
        if time.monotonic()-start>=seconds:
            raise TimeoutError("STRUCTURED_NAVIGATION_SECONDS_LIMIT")
        evaluations+=1
        return area_float(xs+[0.])
    planned=schedules()
    for schedule_index,schedule in enumerate(planned):
        seed=schedule["offsets"]
        if seed in deduplicated:
            duplicate_count+=1
            continue
        deduplicated.add(seed)
        point=list(map(float,seed[:5]))
        used=evaluations
        score=None
        step=.025
        iteration=0
        try:
            score=objective(point)
            for iteration in range(1200):
                changed=False
                for index in range(5):
                    best_trial,best_score=point,score
                    for direction in (-1,1):
                        trial=point[:]
                        trial[index]+=direction*step
                        value=objective(trial)
                        if value<best_score-1e-16:
                            best_trial,best_score=trial,value
                    if best_trial is not point:
                        point,score=best_trial,best_score
                        changed=True
                if not changed:
                    step/=2
                if step<1e-9:
                    break
        except TimeoutError:
            incomplete={"schedule_index":schedule_index,"tree":schedule["tree"],
                        "partial_float_offsets":point+[0.],"partial_float_area":score,
                        "objective_evaluations":evaluations-used,
                        "status":"PARTIAL_NAVIGATION_NOT_FINITE_REJECTION"}
            break
        record={"schedule_index":schedule_index,"order":schedule["order"],
                "tree_index":schedule["tree_index"],"tree":schedule["tree"],
                "root_height":str(schedule["height"]),"depth_mode":schedule["mode"],
                "seed":list(map(str,seed)),"float_offsets":point+[0.],
                "float_area":score,"evaluations":evaluations-used,"iterations":iteration+1,
                "navigation_step_threshold_met":step<1e-9}
        ledger.append(record)
        if best is None or score<best["float_area"]:
            best=record
        if score<float(target)-1e-10:
            for denominator in (1000,10000,100000,1000000):
                xs=[F(v).limit_denominator(denominator) for v in record["float_offsets"]]
                exact=exact_record(xs)
                if F(exact["area"])<target:
                    negative={"navigation":record,"denominator_limit":denominator,"exact":exact}
                    break
            if negative is not None:
                break
    if best is None:
        raise ArithmeticError("NO_FINISHED_HIERARCHICAL_SEED")
    exact_best=[{"denominator_limit":denominator,
                 **exact_record([F(v).limit_denominator(denominator) for v in best["float_offsets"]])}
                for denominator in (1000,10000,100000)]
    return {"status":"EXACT_SMALLER_WITNESS" if negative else "FINITE_NAVIGATION_NO_ROOT_CLOSURE",
            "random_search":False,"ordered_apex_assumption":False,
            "leaf_orders":3,"binary_tree_count_per_order":42,
            "planned_tree_configurations":len(planned),"duplicate_offset_seeds_skipped":duplicate_count,
            "completed_distinct_seeds":len(ledger),"objective_evaluations":evaluations,
            "max_seconds":seconds,"elapsed_seconds":time.monotonic()-start,
            "runs":ledger,"best":best,"exact_best":exact_best,
            "negative_witness":negative,"interrupted_seed":incomplete,
            "scope":"tree-derived starts followed by unrestricted five-variable navigation; not a cover, lower bound, or no-counterexample proof"}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("outer60s process envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(59)
    result=navigate()
    persist_result(args.out,result)
    print(json.dumps({k:v for k,v in result.items() if k not in ("runs",)},sort_keys=True))
