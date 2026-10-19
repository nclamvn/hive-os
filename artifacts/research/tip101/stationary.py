"""Exact full-gradient stationary certificate on a complete TIP101 shape cover.

Mathematical completeness is conditional on Main's coarse quadratic/C1 theorem.
No PSD shortcut, partial coverage, finite sampling or face recursion is used.
"""
import argparse
from collections import Counter
from fractions import Fraction as F
from itertools import combinations
import json
from pathlib import Path
import resource
import sys
import time

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tip099'))
from optimize import MONOMIALS, product, poly_at, hessian_linear, rref
from kakeya_exact import area_affine, area_trapezoid
from shape_walls import BOUNDARIES, walls

ZERO=(F(0),)*5
ONE=(F(0),)*4+(F(1),)
APICES=(ZERO,)+tuple(tuple(F(i==j) for i in range(4))+(F(0),) for j in range(4))

def dot(a,b): return sum((x*y for x,y in zip(a,b)),F(0))
def at(a,x): return dot(a[:4],x)+a[4]
def linadd(a,b,scale=F(1)): return tuple(x+scale*y for x,y in zip(a,b))
def polysum(a,b,scale=F(1)): return tuple(x+scale*y for x,y in zip(a,b))
def integrate(intercept,slope,lo,hi):
    return polysum(product(intercept,linadd(hi,lo,-1)),polysum(product(hi,hi),product(lo,lo),-1),slope/2)

def generic(center,planes,guard=lambda:None):
    lines=[(-j,APICES[j-1]) for j in range(1,6)]+[(1-j,APICES[j-1]) for j in range(1,6)]
    heights={ZERO,APICES[4]}
    for (s,b),(t,c) in combinations(lines,2):
        if s!=t: heights.add(tuple((y-x)/(s-t) for x,y in zip(b,c)))
    fine=[tuple(x-y for x,y in zip(a,b)) for a,b in combinations(heights,2)]
    fine=[p for p in fine if any(p[:3])]
    shapeplanes=[tuple(F(x) for x in p)+(F(0),) for p in planes]
    allplanes=shapeplanes+fine
    zero=[w for w in allplanes if not at(w,center)]
    direction=None
    for t in range(1,2*len(zero)+2):
        guard()
        trial=(F(1),F(t),F(t*t),F(0))
        if all(dot(w[:4],trial) for w in zero): direction=trial;break
    if direction is None: raise ArithmeticError('NO_GENERIC_DIRECTION')
    step=F(1,100)
    for wall in allplanes:
        value=at(wall,center); derivative=dot(wall[:4],direction)
        if value and derivative: step=min(step,abs(value/derivative)/2)
    sample=tuple(x+step*d for x,d in zip(center,direction))
    if any(at(w,sample)*at(w,center)<=0 for w in shapeplanes): raise ArithmeticError('SAMPLE_OUTSIDE_CELL')
    cuts=sorted((h for h in heights if 0<=at(h,sample)<=sample[3]),key=lambda h:at(h,sample))
    if len({at(h,sample) for h in cuts})!=len(cuts): raise ArithmeticError('NON_GENERIC_EVENT_HEIGHTS')
    return sample,cuts

def cone_energy(center,planes,guard=lambda:None):
    sample,cuts=generic(center,planes,guard)
    intervals=[((-j,APICES[j-1]),(1-j,APICES[j-1])) for j in range(1,6)]
    total=(F(0),)*15
    for lo,hi in zip(cuts,cuts[1:]):
        guard(); t=(at(lo,sample)+at(hi,sample))/2
        value=lambda line:line[0]*t+at(line[1],sample)
        ordered=sorted(intervals,key=lambda pair:value(pair[0]))
        left,right=ordered[0]; slope=F(0); intercept=ZERO
        for nl,nr in ordered[1:]:
            if value(nl)>value(right):
                slope+=right[0]-left[0];intercept=linadd(intercept,linadd(right[1],left[1],-1));left,right=nl,nr
            elif value(nr)>value(right): right=nr
        slope+=right[0]-left[0];intercept=linadd(intercept,linadd(right[1],left[1],-1))
        total=polysum(total,integrate(intercept,slope,lo,hi))
    q=polysum(total,product(APICES[4],APICES[4]),F(-3,2))
    offsets=tuple((a-j)/5 for j,a in enumerate((F(0),)+sample,1))
    first,second=area_trapezoid(offsets),area_affine(offsets)
    if first!=second or poly_at(q,sample)!=5*first-F(3,2): raise ArithmeticError('CONE_ENERGY_AREA_MISMATCH')
    return q,sample

def envelope_chains(sample):
    cuts={F(0),sample[3]}
    for i,j in combinations(range(1,6),2):
        t=(at(APICES[j-1],sample)-at(APICES[i-1],sample))/(j-i)
        if 0<t<sample[3]: cuts.add(t)
    upper=[]; lower=[]
    ordered=sorted(cuts)
    for lo,hi in zip(ordered,ordered[1:]):
        t=(lo+hi)/2
        value=lambda j:at(APICES[j-1],sample)-j*t
        a=max(range(1,6),key=value);b=min(range(1,6),key=value)
        if not upper or upper[-1]!=a:upper.append(a)
        if not lower or lower[-1]!=b:lower.append(b)
    if upper[-1]!=1:upper.append(1)
    if lower[-1]!=5:lower.append(5)
    if upper[0]!=5 or lower[0]!=1 or any(a<=b for a,b in zip(upper,upper[1:])) or any(a>=b for a,b in zip(lower,lower[1:])): raise ArithmeticError('BAD_ENVELOPE_CHAINS')
    return upper,lower

def tail(chain,label,upper):
    result=(F(0),)*15;lo=ONE
    for a,b in zip(chain[chain.index(label):],chain[chain.index(label)+1:]):
        hi=tuple((y-x)/(b-a) for x,y in zip(APICES[a-1],APICES[b-1]))
        intercept=APICES[a-1] if upper else linadd(APICES[4],APICES[a-1],-1)
        slope=F(1-a if upper else a-5)
        result=polysum(result,integrate(intercept,slope,lo,hi));lo=hi
    return result

def area_polynomial(q,upper,lower,a,b):
    p=polysum(q,tail(upper,a,True),-1)
    p=polysum(p,tail(lower,b,False),-1)
    p=polysum(p,product(ONE,ONE),F(5,2))
    p=polysum(p,product(APICES[4],ONE),-1)
    return tuple(x/5 for x in p)

def constraints(planes,a,b):
    closed=[tuple(F(x) for x in p)+(F(0),) for p in planes]
    strict=[]
    for i,j in combinations(range(1,6),2):
        difference=linadd(APICES[j-1],APICES[i-1],-1)
        strict.append(difference)
        strict.append(linadd(tuple(F(j-i+1)*x for x in ONE),difference,-1))
    za=linadd(APICES[a-1],ONE,-a);zb=linadd(APICES[b-1],ONE,-b)
    for j in range(1,6):
        zj=linadd(APICES[j-1],ONE,-j)
        closed.append(linadd(za,zj,-1));closed.append(linadd(zj,zb,-1))
    return closed,strict

def stationary_feasible(point,directions,closed,strict,guard=lambda:None,vertex_cap=100000):
    def admissible(p):return all(at(w,p)>=0 for w in closed) and all(at(w,p)>0 for w in strict)
    if not directions:return point if admissible(point) else None,0
    if admissible(point):return point,0
    k=len(directions)
    reduced={}
    for w in closed+strict:
        row=tuple(dot(w[:4],d) for d in directions);constant=at(w,point)
        if not any(row):
            if constant<0 or (w in strict and constant==0):return None,0
            continue
        reduced[(row,constant)]=None
    constraints=list(reduced)
    vertices=set();checked=0
    for active in combinations(constraints,k):
        guard();checked+=1
        if checked>vertex_cap:raise RuntimeError('SINGULAR_VERTEX_ENUMERATION_LIMIT')
        solution=rref([r for r,c in active],[-c for r,c in active],k)
        if solution is None or solution[1]:continue
        u=solution[0]
        if all(dot(r,u)+c>=0 for r,c in constraints):vertices.add(tuple(u))
    if not vertices:return None,checked
    mean=tuple(sum((v[i] for v in vertices),F(0))/len(vertices) for i in range(k))
    p=tuple(x+sum((u*d[i] for u,d in zip(mean,directions)),F(0)) for i,x in enumerate(point))
    return (p if admissible(p) else None),checked

class Certifier:
    def __init__(self,geometry,seconds=120,pilot_cells=0):
        self.geometry=geometry;self.start=time.monotonic();self.seconds=seconds
        self.stats=Counter();self.cache={};self.results=[];self.witness=None;self.pilot_cells=pilot_cells
    def guard(self):
        if time.monotonic()-self.start>self.seconds:raise RuntimeError('TIME_LIMIT')
        rss=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (rss if sys.platform=='darwin' else rss*1024)>1536*1024*1024:raise RuntimeError('RSS_LIMIT')
    def run(self):
        g=self.geometry;expected,_=walls()
        if g.get('status')!='COMPLETE_COVER' or g.get('processed_planes')!=len(expected) or g.get('pending_planes')!=0:raise ValueError('INCOMPLETE_COVER_REFUSED')
        if tuple(tuple(int(x) for x in p) for p in g['planes'])!=BOUNDARIES+expected:raise ValueError('WALL_INVENTORY_MISMATCH')
        if len(g['cells'])!=g['cell_count'] or not 0<len(g['cells'])<=50000:raise ValueError('BAD_CELL_COUNT')
        points=[tuple(F(int(x),int(v['h'][3])) for x in v['h'][:3]) for v in g['vertices']]
        seen=set()
        for index,cell in enumerate(g['cells']):
            if self.pilot_cells and index>=self.pilot_cells:raise RuntimeError('PILOT_CELL_LIMIT_NOT_GLOBAL')
            self.guard();word=cell['signs']
            if word in seen or len(word)!=len(expected) or any(s not in '+-' for s in word):raise ValueError('BAD_OR_DUPLICATE_SIGNWORD')
            seen.add(word)
            planes=[tuple(-x for x in w) for w in BOUNDARIES]+[tuple(x*(1 if s=='+' else -1) for x in w) for w,s in zip(expected,word)]
            local=[points[i] for i in cell['vertices']]
            center=tuple(sum((p[j] for p in local),F(0))/len(local) for j in range(3))+(F(1),)
            if any(dot(p,center)<=0 for p in planes):raise ValueError('NONINTERIOR_CELL_CENTER')
            q,sample=cone_energy(center,planes,self.guard);upper,lower=envelope_chains(sample)
            cases=[]
            for a in upper:
                for b in lower:
                    if a>=b:continue
                    self.guard();self.stats['pairs']+=1
                    p=area_polynomial(q,upper,lower,a,b)
                    if p not in self.cache:
                        h,l,c=hessian_linear(p);solution=rref(h,[-x for x in l],4)
                        self.cache[p]=(solution,poly_at(p,solution[0]) if solution else None)
                    solution,value=self.cache[p]
                    record={'pair':[a,b],'polynomial':[str(x) for x in p],'value':None if value is None else str(value)}
                    if solution:
                        record['stationary_particular']=[str(x) for x in solution[0]]
                        record['stationary_nullspace']=[[str(x) for x in d] for d in solution[1]]
                    if solution is None:status='INCONSISTENT_NO_STATIONARY'
                    elif value>=F(14,61):status='STATIONARY_VALUE_SAFE'
                    else:
                        point,directions=solution
                        closed,strict=constraints(planes,a,b)
                        record['closed_constraints']=[[str(x) for x in w] for w in closed]
                        record['strict_constraints']=[[str(x) for x in w] for w in strict]
                        feasible,count=stationary_feasible(point,directions,closed,strict,self.guard)
                        record['feasibility_active_systems_checked']=count
                        if not directions:
                            record['violated_closed_constraints']=[i for i,w in enumerate(closed) if at(w,point)<0]
                            record['violated_strict_constraints']=[i for i,w in enumerate(strict) if at(w,point)<=0]
                        self.stats['singular_vertex_systems']+=count
                        self.stats['singular_below_target']+=bool(directions)
                        if feasible is None:status='BELOW_TARGET_STATIONARY_INFEASIBLE'
                        else:
                            offsets=tuple((apex-j)/5 for j,apex in enumerate((F(0),)+tuple(feasible),1))
                            first,second=area_trapezoid(offsets),area_affine(offsets)
                            if first!=second or first!=value:raise ArithmeticError('NEGATIVE_WITNESS_AREA_MISMATCH')
                            self.witness={'apices':[str(x) for x in (F(0),)+tuple(feasible)],'offsets':[str(x) for x in offsets],'area':str(value),'both098_algorithms_agree':True}
                            raise RuntimeError('EXACT_SMALLER_WITNESS')
                    record['status']=status;self.stats[status]+=1;cases.append(record)
            self.results.append({'cell':index,'upper_chain':upper,'lower_chain':lower,'energy':[str(x) for x in q],'cases':cases})
            self.stats['cells']+=1
        return {'status':'ALL_FULL_GRADIENT_STATIONARY_CASES_CERTIFIED','stats':dict(self.stats),'distinct_polynomials':len(self.cache),'cell_results':self.results,'elapsed_seconds':time.monotonic()-self.start,'scope':'conditional on independently verified complete shape cover and Main coarse quadratic/C1/bottom-extrema proof; no face minimization or source independence claim'}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('cover');parser.add_argument('--out',required=True);parser.add_argument('--seconds',type=float,default=120);parser.add_argument('--pilot-cells',type=int,default=0)
    args=parser.parse_args()
    if not 0<args.seconds<=120 or not 0<=args.pilot_cells<=50000:raise SystemExit(2)
    c=Certifier(json.loads(Path(args.cover).read_text()),args.seconds,args.pilot_cells)
    try:result=c.run()
    except (ValueError,RuntimeError,ArithmeticError,KeyError,TypeError,IndexError) as exc:result={'status':'PARTIAL_STATIONARY_CERTIFICATE','reason':str(exc),'stats':dict(c.stats),'cell_results':c.results,'witness':c.witness,'elapsed_seconds':time.monotonic()-c.start}
    encoded=json.dumps(result,separators=(',',':'))+'\n'
    if len(encoded.encode())>64*1024*1024:result={'status':'PARTIAL_STATIONARY_CERTIFICATE','reason':'ARTIFACT_LIMIT'};encoded=json.dumps(result)+'\n'
    with Path(args.out).open('x') as stream:stream.write(encoded)
    print(json.dumps({k:v for k,v in result.items() if k!='cell_results'}))
    raise SystemExit(0 if result['status']=='ALL_FULL_GRADIENT_STATIONARY_CASES_CERTIFIED' else 3)
