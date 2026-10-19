"""Exact n6 wall inventory and bounded4D prefix cost pilot, NOT full cover."""
from fractions import Fraction as F
from functools import reduce
from itertools import combinations
import argparse
import json
from math import gcd,comb
from pathlib import Path
import signal
import time


def canonical(row):
    divisor=reduce(gcd,row,0)
    if divisor==0:
        return None
    row=tuple(v//divisor for v in row)
    return row if next(v for v in row if v)>0 else tuple(-v for v in row)


def inventory(n=6):
    dim=n-1
    apices=[(0,)*dim]+[tuple(int(i==j) for i in range(dim)) for j in range(dim)]
    lines=[(s,b) for j,b in enumerate(apices,1) for s in (-j,1-j)]
    raw=set()
    for (s,a),(t,b),(u,c) in combinations(lines,3):
        wall=canonical(tuple((t-s)*(vc-va)-(u-s)*(vb-va) for va,vb,vc in zip(a,b,c)))
        if wall is not None:
            raw.add(wall)
    for (s,a),(t,b) in combinations(lines,2):
        if s==t:
            wall=canonical(tuple(x-y for x,y in zip(a,b)))
            if wall is not None:
                raw.add(wall)
    simplex=[tuple([0]*j+[1]*(dim-j)) for j in reversed(range(dim))]
    cutting=[]
    for wall in sorted(raw):
        values=[sum(v*w for v,w in zip(wall,point)) for point in simplex]
        if min(values)<0<max(values):
            cutting.append(wall)
    boundaries=[]
    for i in range(dim):
        wall=[0]*dim
        wall[i]=-1
        if i>0:
            wall[i-1]=1
        boundaries.append(tuple(wall))
    return {"n":n,"shape_dimension":n-2,"raw_distinct":len(raw),
            "cutting_walls":cutting,"cutting_count":len(cutting),
            "boundaries":boundaries,"simplex_homogeneous_vertices":simplex,
            "ordered_apex_reduction":"UNPROVED_HERE; conditional geometry only",
            "generic_arrangement_cell_upper_bound":sum(comb(len(cutting),k) for k in range(n-1))}


def rank(rows):
    rows=[list(map(F,row)) for row in rows]
    position=0
    for column in range(4):
        pivot=next((p for p in range(position,len(rows)) if rows[p][column]),None)
        if pivot is None:
            continue
        rows[position],rows[pivot]=rows[pivot],rows[position]
        scale=rows[position][column]
        rows[position]=[v/scale for v in rows[position]]
        for p in range(position+1,len(rows)):
            scale=rows[p][column]
            rows[p]=[v-scale*w for v,w in zip(rows[p],rows[position])]
        position+=1
        if position==len(rows):
            break
    return position


def pilot(seconds=25,max_planes=18,cell_cap=2000):
    start=time.monotonic()
    data=inventory()
    # Deliberately prioritize balanced walls involving more shape coordinates.
    # This avoids measuring only a lexicographic low-dimensional boundary slice.
    def key(w):
        values=[sum(v*a for v,a in zip(w,p)) for p in data["simplex_homogeneous_vertices"]]
        return (-min(sum(v>0 for v in values),sum(v<0 for v in values)),
                -sum(v!=0 for v in w),w)
    walls=sorted(data["cutting_walls"],key=key)
    planes=list(data["boundaries"])+walls
    vertices=[]
    active=[]
    index={}
    pair_tests=0
    cache={}
    def guard():
        if time.monotonic()-start>seconds:
            raise TimeoutError("PILOT_SECONDS_LIMIT")
    def value(w,x):
        return sum((v*a for v,a in zip(w[:4],x)),F(w[4]))
    def vertex(point):
        if point in index:
            return index[point]
        ident=len(vertices)
        vertices.append(point)
        active.append(sum(1<<i for i,w in enumerate(planes) if value(w,point)==0))
        index[point]=ident
        return ident
    cells=[tuple(vertex(tuple(map(F,p[:4]))) for p in data["simplex_homogeneous_vertices"])]
    history=[]
    reason="PILOT_PLANE_LIMIT_NOT_FULL_COVER"
    try:
        for wall_index in range(5,min(len(planes),5+max_planes)):
            next_cells=[]
            for cell in cells:
                guard()
                values={i:value(planes[wall_index],vertices[i]) for i in cell}
                positive=[i for i in cell if values[i]>0]
                negative=[i for i in cell if values[i]<0]
                if not positive or not negative:
                    next_cells.append(cell)
                    continue
                shared_points=[i for i in cell if values[i]==0]
                for a in positive:
                    for b in negative:
                        guard()
                        pair_tests+=1
                        common=(active[a]&active[b])&((1<<wall_index)-1)
                        if common not in cache:
                            ids=[i for i in range(wall_index) if common&(1<<i)]
                            cache[common]=rank([planes[i][:4] for i in ids])>=3
                        if cache[common]:
                            ratio=values[a]/(values[a]-values[b])
                            point=tuple(x+ratio*(y-x) for x,y in zip(vertices[a],vertices[b]))
                            ident=vertex(point)
                            # Redundant sign check verifies no crossing outside parent.
                            if any(value(planes[i],point)*value(planes[i],vertices[a])<0 for i in range(wall_index)):
                                raise ArithmeticError("NEW_VERTEX_OUTSIDE_PARENT")
                            shared_points.append(ident)
                lo=tuple(sorted(set(negative+shared_points)))
                hi=tuple(sorted(set(positive+shared_points)))
                if min(len(lo),len(hi))<5:
                    raise ArithmeticError("BAD_4D_SPLIT")
                next_cells.extend((lo,hi))
                if len(next_cells)>cell_cap:
                    raise OverflowError("PILOT_CELL_LIMIT_NOT_FULL_COVER")
            cells=next_cells
            history.append({"processed_planes":wall_index-4,"cells":len(cells),
                            "vertices":len(vertices),"elapsed_seconds":time.monotonic()-start})
    except (TimeoutError,OverflowError,ArithmeticError) as exc:
        reason=str(exc)
    data.update({"status":"PARTIAL_COST_PILOT_NOT_GLOBAL_COVER","reason":reason,
                 "pilot_plane_order":walls,"processed_planes":len(history),
                 "cell_count":len(cells),"vertex_count":len(vertices),
                 "history":history,"edge_pair_tests":pair_tests,
                 "max_cell_vertices":max(map(len,cells)),
                 "mean_cell_vertices":sum(map(len,cells))/len(cells),
                 "elapsed_seconds":time.monotonic()-start,
                 "max_seconds":seconds,"max_planes":max_planes,"cell_cap":cell_cap,
                 "K5_baseline":{"shape_walls":42,"cells":2632,"stationary_seconds":52.582,
                                "independent_3D_hull_seconds":7.621},
                 "scope":"exact wall inventory and conditional prefix geometry cost, no independent prefix coverage or mathematical lower bound"})
    return data


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("outer 30s pilot envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(30)
    result=pilot()
    with Path(args.out).open("x") as output:
        json.dump(result,output,sort_keys=True)
        output.write("\n")
    print(json.dumps(result,sort_keys=True))
