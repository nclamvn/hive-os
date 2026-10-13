"""Exact control of a hand-derived group-convexity counterexample, NOT K6 root."""
import argparse
from fractions import Fraction as F
import json
from pathlib import Path
import signal
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tip098"))
from kakeya_exact import area_trapezoid,area_affine


def formula(d):
    d=F(d)
    if not F(1,6)<d<F(1,4):
        raise ValueError("hand-derived formula restricted to1/6<d<1/4")
    return F(13,36)-F(7,6)*d+3*d*d


def exact(xs):
    primary=area_trapezoid(xs)
    secondary=area_affine(xs)
    if primary!=secondary:
        raise ArithmeticError("old exact algorithms disagree")
    return {"offsets":list(map(str,xs)),"area":str(primary),"area_affine":str(secondary),
            "agreement":True,"root_smaller_witness":primary<F(20,93)}


def controls():
    start=time.monotonic()
    center=F(7,36)
    step=F(1,360)
    values=[]
    for d in (center-step,center,center+step):
        record=exact((d,d,d,F(0),F(0),F(0)))
        if F(record["area"])!=formula(d):
            raise ArithmeticError("hand formula and exact sweeps disagree")
        values.append({"d":str(d),"formula":str(formula(d)),"exact":record})
    three_primary=area_trapezoid([0,0,0])
    three_secondary=area_affine([0,0,0])
    if three_primary!=F(1,3) or three_secondary!=three_primary:
        raise ArithmeticError("consecutive-three group rescaling disagreement")
    overlap=[F(1,3)-F(row["exact"]["area"]) for row in values]
    convexity_excess=overlap[1]-(overlap[0]+overlap[2])/2
    if convexity_excess!=3*step*step or convexity_excess<=0:
        raise ArithmeticError("strict group-convexity counterexample missing")
    apices=tuple(6*x+j for j,x in enumerate((center,center,center,F(0),F(0),F(0)),1))
    scale=F(999,1000)
    shifted=tuple((scale*a-j)/6 for j,a in enumerate(apices,1))
    gauge=shifted[-1]
    radial=exact(tuple(x-gauge for x in shifted))
    if F(radial["area"])>=F(107,432):
        raise ArithmeticError("known nonstationary radial decrease absent")
    return {"status":"EXACT_COUNTEREXAMPLE_TO_GROUP_OVERLAP_CONVEXITY",
            "groups":{"A":[4,5,6],"B":[1,2,3]},"A_offsets":"0","B_offsets":"d",
            "formula_domain":"1/6<d<1/4","union_formula":"13/36−7d/6+3d²",
            "group_overlap_formula":"−1/36+7d/6−3d²","group_overlap_second_derivative":"−6",
            "group_area_each":"1/6","rigid_block_stationary_d":str(center),
            "rigid_block_minimum":"107/432","positive_bottom_gap":"1/36",
            "sample_checks":values,"overlap_values":list(map(str,overlap)),
            "strict_midpoint_convexity_violation":str(convexity_excess),
            "radial_control_scale":str(scale),"radial_decrease_exact":radial,
            "full_space_radial_derivative_at_center":"35/216",
            "full_space_local_minimum":"FALSE: nonzero radial derivative/decrease",
            "root_global_status":"OPEN; not smaller than20/93",
            "elapsed_seconds":time.monotonic()-start,
            "scope":"handproved false group-convexity/rigid-merging lemma, exact controls only; does not settle two-bottom-component FULL local minima"}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("30 second mathematical process envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(29)
    result=controls()
    with Path(args.out).open("x",encoding="utf-8") as output:
        json.dump(result,output,sort_keys=True)
        output.write("\n")
    print(json.dumps(result,sort_keys=True))
