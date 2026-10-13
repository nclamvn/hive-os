"""Exact incident-cell K6 polynomial inspection; no all-space claim."""
import argparse
from fractions import Fraction as F
from functools import reduce
from itertools import combinations, product
import json
from math import gcd,lcm
import signal
import time

from k6_structured import exact_record,persist_result

WITNESS=tuple(F(v,186) for v in (49,43,23,26,6))
D=5


def dot(a,b):
    return sum((x*y for x,y in zip(a,b)), F(0))


def at(law,x):
    return dot(law[:D],x)+law[D]


def sub(a,b):
    return tuple(x-y for x,y in zip(a,b))


def canonical(a):
    if not any(a[:D]):
        return None
    denominator=lcm(*(v.denominator for v in a))
    integers=[int(v*denominator) for v in a]
    divisor=reduce(gcd,(abs(v) for v in integers),0)
    integers=[v//divisor for v in integers]
    if next(v for v in integers if v)<0:
        integers=[-v for v in integers]
    return tuple(integers)


def arrangements():
    endpoints=[]
    for j in range(1,7):
        a=[F(0)]*6
        if j<6:
            a[j-1]=F(1)
        endpoints.append((F(j,6),tuple(a)))
        a[-1]=F(1,6)
        endpoints.append((F(j-1,6),tuple(a)))
    heights=set()
    coarse=set()
    for (sa,a),(sb,b) in combinations(endpoints,2):
        for law in (sub(a,b), sub(a[:-1]+(a[-1]+sa,), b[:-1]+(b[-1]+sb,))):
            wall=canonical(law)
            if wall is not None:
                coarse.add(wall)
        if sa!=sb:
            heights.add(tuple(v/(sa-sb) for v in sub(b,a)))
    for (sa,a),(sb,b),(sc,c) in combinations(endpoints,3):
        law=tuple((sb-sa)*(vc-va)-(sc-sa)*(vb-va)
                  for va,vb,vc in zip(a,b,c))
        wall=canonical(law)
        if wall is not None:
            coarse.add(wall)
    fine=set(coarse)
    for a,b in combinations(heights,2):
        wall=canonical(sub(a,b))
        if wall is not None:
            fine.add(wall)
    return endpoints,heights,tuple(sorted(coarse)),tuple(sorted(fine))


def solve_rectangular(matrix,rhs):
    work=[list(map(F,row))+[F(value)] for row,value in zip(matrix,rhs)]
    pivot_columns=[]
    row=0
    for column in range(D):
        pivot=next((p for p in range(row,len(work)) if work[p][column]),None)
        if pivot is None:
            continue
        work[row],work[pivot]=work[pivot],work[row]
        scale=work[row][column]
        work[row]=[v/scale for v in work[row]]
        for p in range(len(work)):
            if p!=row:
                scale=work[p][column]
                work[p]=[a-scale*b for a,b in zip(work[p],work[row])]
        pivot_columns.append(column)
        row+=1
        if row==len(work):
            break
    if any(not any(line[:D]) and line[-1] for line in work):
        return None,row
    answer=[F(0)]*D
    for line,column in zip(work,pivot_columns):
        answer[column]=line[-1]
    return answer,row


def determinant(matrix):
    work=[list(row) for row in matrix]
    total=F(1)
    for column in range(len(work)):
        pivot=next((p for p in range(column,len(work)) if work[p][column]),None)
        if pivot is None:
            return F(0)
        if pivot!=column:
            work[column],work[pivot]=work[pivot],work[column]
            total=-total
        scale=work[column][column]
        total*=scale
        for p in range(column+1,len(work)):
            ratio=work[p][column]/scale
            for q in range(column+1,len(work)):
                work[p][q]-=ratio*work[column][q]
    return total


def polynomial(center,endpoints,heights):
    """Symbolically integrate each chosen rational slab, using degree2 matrices."""
    zero=(F(0),)*6
    one=zero[:-1]+(F(1),)
    cuts=sorted([zero,one]+[h for h in heights if 0<at(h,center)<1],
                key=lambda h:at(h,center))
    if len({at(h,center) for h in cuts})!=len(cuts):
        raise ArithmeticError("center must have generic fine-event order")
    result=[[F(0)]*6 for _ in range(6)]
    for bottom,top in zip(cuts,cuts[1:]):
        midpoint=(at(bottom,center)+at(top,center))/2
        def value(line):
            slope,intercept=line
            return at(intercept,center)+slope*midpoint
        intervals=sorted([(endpoints[k],endpoints[k+1]) for k in range(0,12,2)],
                         key=lambda pair:value(pair[0]))
        left,right=intervals[0]
        components=[]
        for a,b in intervals[1:]:
            if value(a)>value(right):
                components.append((left,right))
                left,right=a,b
            elif value(b)>value(right):
                right=b
        components.append((left,right))
        slope=sum((r[0]-l[0] for l,r in components),F(0))
        intercept=tuple(sum((r[1][i]-l[1][i] for l,r in components),F(0)) for i in range(6))
        height=sub(top,bottom)
        for i in range(6):
            for j in range(6):
                result[i][j]+=slope*(top[i]*top[j]-bottom[i]*bottom[j])/2
                result[i][j]+=(intercept[i]*height[j]+intercept[j]*height[i])/2
    return result


def inspect():
    start=time.monotonic()
    endpoints,heights,coarse,fine=arrangements()
    zeros=[w for w in coarse if at(w,WITNESS)==0]
    finezeros=[w for w in fine if at(w,WITNESS)==0]
    nonzeros=[w for w in coarse if at(w,WITNESS)!=0]
    radius=min(abs(at(w,WITNESS))/sum(abs(v) for v in w[:D]) for w in nonzeros)
    _,rank=solve_rectangular([w[:D] for w in zeros],[F(0)]*len(zeros))
    complete=len(zeros)==rank and len(zeros)<=5
    signs=list(product((-1,1),repeat=len(zeros))) if complete else [tuple(1 for _ in zeros)]
    incident=[]
    for sign in signs:
        direction,_=solve_rectangular([w[:D] for w in zeros],sign)
        if direction is None:
            continue
        if not zeros:
            direction=[F(1),F(2),F(4),F(8),F(16)]
        # Complete zero-wall sign pattern, then deterministic generic refinement.
        epsilon=radius/(100*(1+sum(abs(v) for v in direction)))
        center=tuple(x+epsilon*v for x,v in zip(WITNESS,direction))
        for power in range(1,100):
            tweak=epsilon/F(1000*power)
            trial=tuple(x+tweak*(F(power)**i) for i,x in enumerate(center))
            if (all(at(w,trial)*s>0 for w,s in zip(zeros,sign)) and
                all(at(w,trial)*at(w,WITNESS)>0 for w in nonzeros) and
                all(at(w,trial)!=0 for w in fine)):
                center=trial
                break
        else:
            raise ArithmeticError("no generic center in incident region")
        Q=polynomial(center,endpoints,heights)
        H=[[2*Q[i][j] for j in range(D)] for i in range(D)]
        gradient=[2*sum((Q[i][j]*v for j,v in enumerate(WITNESS+(F(1),))),F(0)) for i in range(D)]
        vector=WITNESS+(F(1),)
        value=sum((vector[i]*Q[i][j]*vector[j] for i in range(6) for j in range(6)),F(0))
        minors=[determinant([row[:size] for row in H[:size]]) for size in range(1,D+1)]
        actual=exact_record(center+(F(0),))
        cv=center+(F(1),)
        prediction=sum((cv[i]*Q[i][j]*cv[j] for i in range(6) for j in range(6)),F(0))
        if prediction!=F(actual["area"]):
            raise ArithmeticError("symbolic polynomial differs from both exact sweeps")
        incident.append({"zero_wall_signs":sign,"center":center,"quadratic_matrix":Q,
                         "Hessian":H,"gradient_at_witness":gradient,
                         "area_at_witness":value,"leading_minors":minors,
                         "positive_definite":all(v>0 for v in minors),
                         "center_exact_area":actual,"polynomial_center_agreement":True})
    strictlocal=complete and len(incident)==2**len(zeros) and all(
        item["positive_definite"] and not any(item["gradient_at_witness"]) and
        item["area_at_witness"]==F(20,93) for item in incident)
    return {"witness":exact_record(WITNESS+(F(0),)),
            "coarse_wall_count":len(coarse),"fine_wall_count":len(fine),
            "coarse_walls":coarse,
            "coarse_wall_signs_at_witness":[(at(w,WITNESS)>0)-(at(w,WITNESS)<0) for w in coarse],
            "zero_coarse_walls":zeros,"zero_fine_walls":finezeros,
            "zero_coarse_rank":rank,"all_incident_patterns_covered":complete,
            "coarse_safe_linf_radius_strictly_less_than":radius,
            "incident_polynomials":incident,"strict_local_minimum_certificate":strictlocal,
            "premise":"degree2 area on coarse endpoint-arrangement chambers; unrelated fine-event swaps do not change union polygons",
            "global_optimality":"NOT_ESTABLISHED","elapsed_seconds":time.monotonic()-start}


def ready(obj):
    if isinstance(obj,F):
        return str(obj)
    if isinstance(obj,dict):
        return {k:ready(v) for k,v in obj.items()}
    if isinstance(obj,(tuple,list)):
        return list(map(ready,obj))
    return obj


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",help="create-only JSON evidence path")
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("60 second process envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(59)
    result=ready(inspect())
    if args.out:
        persist_result(args.out,result)
    print(json.dumps(result,sort_keys=True))
