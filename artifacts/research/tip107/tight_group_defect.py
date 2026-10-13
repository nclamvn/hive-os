"""Exact controls for ONE hand-derived tight3+3 family; no universal K6 claim."""
import argparse
from fractions import Fraction as F
import json
from pathlib import Path
import signal
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tip098"))
from kakeya_exact import area_trapezoid,area_affine


def area_formula(a):
    return F(107,432)-F(35,36)*a+F(179,12)*a*a


def controls():
    start=time.monotonic()
    maximum=F(3,124)
    stationary_root=F(35,1074)
    if not maximum<stationary_root<F(1,6):
        raise ArithmeticError("factor-sign endpoint comparison failed")
    rows=[]
    for a in (F(0),F(1,100),maximum):
        d=F(7,36)+F(11,6)*a
        xs=(d+2*a,d+a,d,2*a,a,F(0))
        first=area_trapezoid(xs)
        second=area_affine(xs)
        predicted=area_formula(a)
        bottom=F(1,3)+4*a
        defect=2*first-bottom
        factored=F(179,6)*(a-stationary_root)*(a-F(1,6))
        if first!=second or first!=predicted or defect!=factored or defect<=0:
            raise ArithmeticError("tight-family exact formula/defect disagreement")
        rows.append({"a":str(a),"d":str(d),"offsets":list(map(str,xs)),
                     "area":str(first),"area_affine":str(second),"agreement":True,
                     "bottom_width":str(bottom),"radial_defect":str(defect),
                     "positive_bottom_gap":str(d-(F(1,6)+2*a)),
                     "root_smaller_witness":first<F(20,93)})
    minimum=area_formula(maximum)
    return {"status":"EXACT_CONTROLS_PASS_FOR_HAND_DERIVED_RESTRICTED_TIGHT_FAMILY",
            "family":"x=(d+2a,d+a,d,2a,a,0); d=7/36+11a/6",
            "a_domain":"0<=a<=3/124","area_formula":"107/432−35a/36+179a²/12",
            "radial_defect_formula":"(179/6)(a−35/1074)(a−1/6)",
            "strict_positive_defect_handproof":True,"sample_checks":rows,
            "restricted_family_minimum":str(minimum),"restricted_margin_over_target":str(minimum-F(20,93)),
            "root_global_status":"OPEN","coverage":"NONE: only one3+3same-step family",
            "elapsed_seconds":time.monotonic()-start}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("30 second process envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(29)
    result=controls()
    with Path(args.out).open("x",encoding="utf-8") as output:
        json.dump(result,output,sort_keys=True)
        output.write("\n")
    print(json.dumps(result,sort_keys=True))
