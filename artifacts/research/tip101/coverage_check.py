"""Independent exact inner-hull volume check, without producer edge assumptions."""
from fractions import Fraction as F
from itertools import combinations
from functools import reduce
from math import gcd, lcm
import argparse
import json
from pathlib import Path
import resource
import sys
import time
from shape_walls import BOUNDARIES, walls

def dot(a,b): return sum((x*y for x,y in zip(a,b)),F(0))
def sub(a,b): return tuple(x-y for x,y in zip(a,b))
def cross(a,b): return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def det3(a,b,c): return dot(a,cross(b,c))
def plane_key(normal,point):
    p=tuple(normal)+(-dot(normal,point),)
    scale=lcm(*(x.denominator for x in p))
    z=tuple(int(x*scale) for x in p)
    g=reduce(gcd,z,0)
    z=tuple(x//g for x in z)
    return z if next(x for x in z if x)>0 else tuple(-x for x in z)

def hull2(indices,points,drop):
    dims=[i for i in range(3) if i!=drop]
    ordered=sorted(indices,key=lambda i:(points[i][dims[0]],points[i][dims[1]]))
    def orient(i,j,k):
        a,b,c=points[i],points[j],points[k]
        return (b[dims[0]]-a[dims[0]])*(c[dims[1]]-a[dims[1]])-(b[dims[1]]-a[dims[1]])*(c[dims[0]]-a[dims[0]])
    lo=[]
    for i in ordered:
        while len(lo)>1 and orient(lo[-2],lo[-1],i)<=0: lo.pop()
        lo.append(i)
    hi=[]
    for i in reversed(ordered):
        while len(hi)>1 and orient(hi[-2],hi[-1],i)<=0: hi.pop()
        hi.append(i)
    return lo[:-1]+hi[:-1]

def hull_volume(points,guard=lambda:None):
    if len(points)<4 or len(set(points))!=len(points): raise ValueError('BAD_CELL_VERTICES')
    facets={}
    for i,j,k in combinations(range(len(points)),3):
        guard()
        normal=cross(sub(points[j],points[i]),sub(points[k],points[i]))
        if not any(normal): continue
        key=plane_key(normal,points[i])
        if key in facets: continue
        values=[dot(key[:3],p)+key[3] for p in points]
        if min(values)<0<max(values): continue
        if not any(values): raise ValueError('LOWER_DIMENSION_CELL')
        facets[key]=[q for q,v in enumerate(values) if not v]
    centroid=tuple(sum((p[j] for p in points),F(0))/len(points) for j in range(3))
    volume=F(0)
    for key,ids in facets.items():
        drop=next(i for i in range(3) if key[i])
        polygon=hull2(ids,points,drop)
        if len(polygon)<3: raise ValueError('BAD_FACET')
        a=sub(points[polygon[0]],centroid)
        for i in range(1,len(polygon)-1):
            volume+=abs(det3(a,sub(points[polygon[i]],centroid),sub(points[polygon[i+1]],centroid)))/6
    if volume<=0: raise ValueError('NONPOSITIVE_CELL_VOLUME')
    return volume,len(facets)

def verify(geometry,seconds=120,require_complete=True):
    start=time.monotonic()
    def guard():
        if time.monotonic()-start>seconds: raise RuntimeError('TIME_LIMIT')
        rss=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (rss if sys.platform=='darwin' else rss*1024)>1536*1024*1024: raise RuntimeError('RSS_LIMIT')
    expected,_=walls()
    processed=geometry.get('processed_planes')
    if not isinstance(processed,int) or not 0<=processed<=len(expected): raise ValueError('BAD_PREFIX')
    if require_complete and (geometry.get('status')!='COMPLETE_COVER' or processed!=len(expected) or geometry.get('pending_planes')!=0): raise ValueError('INCOMPLETE_COVER_REFUSED')
    planes=tuple(tuple(int(x) for x in p) for p in geometry['planes'])
    if planes!=BOUNDARIES+expected: raise ValueError('WALL_INVENTORY_MISMATCH')
    points=[]
    for record in geometry['vertices']:
        guard()
        h=tuple(int(x) for x in record['h'])
        if len(h)!=4 or h[3]<=0: raise ValueError('BAD_HOMOGENEOUS_VERTEX')
        active=[i for i,p in enumerate(planes) if not dot(p,h)]
        if record['active']!=active: raise ValueError('ACTIVE_LABEL_MISMATCH')
        points.append(tuple(F(x,h[3]) for x in h[:3]))
    cells=geometry['cells']
    if not 0<len(cells)<=50000 or len(cells)!=geometry['cell_count']: raise ValueError('BAD_CELL_COUNT')
    seen=set(); total=F(0); checked=[]; facets=0
    for index,cell in enumerate(cells):
        guard()
        word=cell['signs']
        if len(word)!=processed or any(x not in '+-' for x in word) or word in seen: raise ValueError('DUPLICATE_OR_BAD_SIGNWORD')
        seen.add(word)
        ids=cell['vertices']
        if any(type(i)!=int or i<0 or i>=len(points) for i in ids): raise ValueError('BAD_VERTEX_INDEX')
        local=[points[i] for i in ids]
        for p in local:
            h=p+(F(1),)
            if any(dot(w,h)>0 for w in BOUNDARIES): raise ValueError('VERTEX_OUTSIDE_SIMPLEX')
            if any(dot(w,h)*(1 if s=='+' else -1)<0 for w,s in zip(expected,word)): raise ValueError('VERTEX_OUTSIDE_SIGN_CELL')
        volume,count=hull_volume(local,guard)
        total+=volume; facets+=count
        checked.append(str(volume))
    if total!=F(1,6): raise ValueError('INCOMPLETE_VOLUME_SUM:'+str(total))
    return {'status':'EXACT_COMPLETE_SHAPE_COVER_VERIFIED' if require_complete else 'EXACT_PREFIX_VOLUME_VERIFIED','cells':len(cells),'facets':facets,'volume':str(total),'cell_volumes':checked,'elapsed_seconds':time.monotonic()-start,'scope':'independent actual convex hulls, signs, disjoint interiors and exact volume sum; not stationary/root closure'}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('cover');parser.add_argument('--out',required=True);parser.add_argument('--seconds',type=float,default=120);parser.add_argument('--prefix',action='store_true')
    args=parser.parse_args()
    if not 0<args.seconds<=180: raise SystemExit(2)
    try: result=verify(json.loads(Path(args.cover).read_text()),args.seconds,not args.prefix)
    except (ValueError,RuntimeError,KeyError,TypeError,ArithmeticError) as exc: result={'status':'REFUSED','reason':str(exc)}
    encoded=json.dumps(result,indent=2)+'\n'
    with Path(args.out).open('x') as stream: stream.write(encoded)
    print(json.dumps({k:v for k,v in result.items() if k!='cell_volumes'}))
    raise SystemExit(0 if result['status'].startswith('EXACT_') else 3)
