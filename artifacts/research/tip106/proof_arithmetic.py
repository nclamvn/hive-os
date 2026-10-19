"""Exact arithmetic supporting Main's universal graph exclusions.

The geometric/moment/K5-transfer lemmas are Main's written proof obligations;
this finite arithmetic inventory is NOT a geometric cover or a global minimum.
"""
from fractions import Fraction as F
from itertools import combinations
import argparse
import json
from pathlib import Path


TARGET=F(20,93)
K5_TRANSFER=F(35,183)


def disconnected_bounds():
    subsets={1:F(1,12),2:F(1,9),3:F(9,80),4:F(10,81),5:F(125,936)}
    partitions={k:subsets[k]+subsets[6-k] for k in (1,2,3)}
    return {"subset_lower_bounds":subsets,"bipartition_lower_bounds":partitions,
            "minimum_disconnected_bound":min(partitions.values()),
            "strict_margin":min(partitions.values())-TARGET,
            "connected_path_offset_radius":F(25,6)}


def endpoint_gap_sets():
    rows=[]
    for size in range(6):
        for gaps in combinations(range(1,6),size):
            caps=tuple(F(1,6*(gap+2)) for gap in gaps)
            increment=max(F(0),F(1,12)-sum(caps,F(0)))
            lower=K5_TRANSFER+increment
            rows.append({"gaps":gaps,"pair_overlap_caps":caps,
                         "area_lower_bound":lower,"strictly_excludes_below_target":lower>TARGET,
                         "margin":lower-TARGET})
    return rows


def ledger():
    rows=endpoint_gap_sets()
    degree1=K5_TRANSFER+F(1,36)
    return {"disconnected":disconnected_bounds(),"endpoint_gap_masks":rows,
            "endpoint_degree_at_most1_lower_bound":degree1,
            "endpoint_degree_at_most1_margin":degree1-TARGET,
            "excluded_endpoint_gap_sets":[r["gaps"] for r in rows if r["strictly_excludes_below_target"]],
            "scope":"conditional exact arithmetic, not vertex/apex/cell coverage or F6>=20/93"}


def ready(value):
    if isinstance(value,F):
        return str(value)
    if isinstance(value,dict):
        return {str(k):ready(v) for k,v in value.items()}
    if isinstance(value,(tuple,list)):
        return list(map(ready,value))
    return value


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    result=ready(ledger())
    with Path(args.out).open("x",encoding="utf-8") as output:
        json.dump(result,output,sort_keys=True)
        output.write("\n")
    print(json.dumps(result,sort_keys=True))
