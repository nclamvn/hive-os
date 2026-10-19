"""TIP101 independent exact arithmetic acceptance checker.

No imports from optimize/stationary. Independently regenerates walls, envelope
chains, cone energy and tail polynomials using endpoint coverage-count integration;
independently eliminates stationary equations and reconstructs feasibility rows.
Universal reduction/C1 and hull volume proofs remain Main's responsibility.
"""
from collections import Counter
from fractions import Fraction as F
from functools import reduce
from itertools import combinations
import argparse
import json
from math import gcd
from pathlib import Path
import resource
import sys
import time

TERMS=tuple(combinations(range(5),2))+tuple((i,i) for i in range(5))
ZERO=(F(0),)*5
UNIT=(F(0),)*4+(F(1),)
APEX=(ZERO,)+tuple(tuple(F(i==j) for i in range(4))+(F(0),) for j in range(4))
BOUNDARIES=((-1,0,0,0),(1,-1,0,0),(0,1,-1,0),(0,0,1,-1))
SIMPLEX=((0,0,0,1),(0,0,1,1),(0,1,1,1),(1,1,1,1))

def inner(a,b):return sum((x*y for x,y in zip(a,b)),F(0))
def affine(a,x):return inner(a[:4],x)+a[4]
def difference(a,b):return tuple(x-y for x,y in zip(a,b))
def scaled(a,s):return tuple(s*x for x in a)
def plus(a,b):return tuple(x+y for x,y in zip(a,b))
def canonical(p):
    divisor=reduce(gcd,p,0)
    if not divisor:return None
    p=tuple(x//divisor for x in p)
    return p if next(x for x in p if x)>0 else tuple(-x for x in p)
def expected_walls():
    lines=tuple((s,tuple(int(x) for x in a[:4])) for j,a in enumerate(APEX,1) for s in (-j,1-j))
    normals=set()
    for (s,b),(t,c),(u,d) in combinations(lines,3):
        p=canonical(tuple((t-s)*(dk-bk)-(u-s)*(ck-bk) for bk,ck,dk in zip(b,c,d)))
        if p:normals.add(p)
    for (s,b),(t,c) in combinations(lines,2):
        if s==t:
            p=canonical(difference(b,c))
            if p:normals.add(p)
    return tuple(sorted(p for p in normals if min(inner(p,v) for v in SIMPLEX)<0<max(inner(p,v) for v in SIMPLEX)))

def multiply_affine(a,b):
    result={term:F(0) for term in TERMS}
    for i,x in enumerate(a):
        for j,y in enumerate(b):result[tuple(sorted((i,j)))]+=x*y
    return tuple(result[term] for term in TERMS)
def add_poly(a,b,s=F(1)):return tuple(x+s*y for x,y in zip(a,b))
def integrated_line(intercept,slope,low,high):
    p=multiply_affine(intercept,difference(high,low))
    return add_poly(p,add_poly(multiply_affine(high,high),multiply_affine(low,low),-1),slope/2)
def value(p,x):
    z=tuple(x)+(F(1),)
    return sum((c*z[i]*z[j] for c,(i,j) in zip(p,TERMS)),F(0))

def exact_eliminate(matrix,rhs,width):
    a=[[F(v) for v in row]+[F(b)] for row,b in zip(matrix,rhs)]
    if any(len(row)!=width+1 for row in a):raise ValueError('BAD_SYSTEM_WIDTH')
    row=0;pivots=[]
    for column in range(width):
        pivot=next((r for r in range(row,len(a)) if a[r][column]),None)
        if pivot is None:continue
        a[row],a[pivot]=a[pivot],a[row]
        divisor=a[row][column];a[row]=[v/divisor for v in a[row]]
        for r in range(len(a)):
            if r==row:continue
            multiplier=a[r][column]
            if multiplier:a[r]=[v-multiplier*w for v,w in zip(a[r],a[row])]
        pivots.append(column);row+=1
    if any(not any(r[:width]) and r[-1] for r in a):return None
    point=[F(0)]*width
    for row,column in enumerate(pivots):point[column]=a[row][-1]
    null=[]
    for free in range(width):
        if free in pivots:continue
        d=[F(0)]*width;d[free]=F(1)
        for row,column in enumerate(pivots):d[column]=-a[row][free]
        null.append(tuple(d))
    return tuple(point),tuple(null),len(pivots)

def derivatives(p):
    h=[[F(0)]*4 for _ in range(4)];linear=[F(0)]*4
    for c,(i,j) in zip(p,TERMS):
        if i==j and i<4:h[i][i]+=2*c
        elif j<4:h[i][j]+=c;h[j][i]+=c
        elif i<4:linear[i]+=c
    return h,linear

def independent_generic(center,shape_rows,guard):
    endpoints=tuple((s,a,'L' if s==-j else 'R') for j,a in enumerate(APEX,1) for s in (-j,1-j))
    heights={ZERO,APEX[4]}
    for (s,a,_),(t,b,_) in combinations(endpoints,2):
        if s!=t:heights.add(scaled(difference(b,a),F(1,s-t)))
    height_rows=[difference(a,b) for a,b in combinations(heights,2)]
    height_rows=[a for a in height_rows if any(a[:3])]
    rows=[tuple(F(x) for x in p)+(F(0),) for p in shape_rows]+height_rows
    zeros=[p for p in rows if not affine(p,center)]
    direction=None
    for k in range(1,2*len(zeros)+2):
        guard();d=(F(k),F(k*k),F(1),F(0))
        if all(inner(p[:4],d) for p in zeros):direction=d;break
    if direction is None:raise ArithmeticError('NO_INDEPENDENT_GENERIC_DIRECTION')
    epsilon=F(1,1000)
    for p in rows:
        initial=affine(p,center);change=inner(p[:4],direction)
        if initial and change:epsilon=min(epsilon,abs(initial/change)/3)
    point=tuple(a+epsilon*b for a,b in zip(center,direction))
    if any(inner(row,point)<=0 for row in shape_rows):raise ArithmeticError('INDEPENDENT_SAMPLE_OUTSIDE_SHAPE')
    cuts=sorted((h for h in heights if 0<=affine(h,point)<=point[3]),key=lambda h:affine(h,point))
    if len({affine(h,point) for h in cuts})!=len(cuts):raise ArithmeticError('INDEPENDENT_GENERIC_EVENT_TIE')
    return point,cuts,endpoints

def independent_energy(center,shape_rows,guard):
    point,cuts,endpoints=independent_generic(center,shape_rows,guard)
    energy=(F(0),)*15
    for low,high in zip(cuts,cuts[1:]):
        guard();mid=(affine(low,point)+affine(high,point))/2
        events=sorted(endpoints,key=lambda line:affine(line[1],point)+line[0]*mid)
        occupied=0;previous=None;length_intercept=ZERO;length_slope=F(0)
        for slope,intercept,kind in events:
            if previous is not None and occupied>0:
                length_intercept=plus(length_intercept,difference(intercept,previous[1]))
                length_slope+=slope-previous[0]
            occupied+=1 if kind=='L' else -1
            if occupied<0:raise ArithmeticError('ENDPOINT_COVERAGE_COUNT_NEGATIVE')
            previous=(slope,intercept)
        if occupied:raise ArithmeticError('ENDPOINT_COVERAGE_COUNT_NOT_CLOSED')
        energy=add_poly(energy,integrated_line(length_intercept,length_slope,low,high))
    return add_poly(energy,multiply_affine(APEX[4],APEX[4]),F(-3,2)),point

def independent_chains(point):
    cuts={F(0),point[3]}
    for i,j in combinations(range(1,6),2):
        crossing=(affine(APEX[j-1],point)-affine(APEX[i-1],point))/(j-i)
        if 0<crossing<point[3]:cuts.add(crossing)
    cuts=sorted(cuts);upper=[];lower=[]
    for low,high in zip(cuts,cuts[1:]):
        t=(low+high)/2
        vals=[affine(a,point)-j*t for j,a in enumerate(APEX,1)]
        a=1+vals.index(max(vals));b=1+vals.index(min(vals))
        if not upper or upper[-1]!=a:upper.append(a)
        if not lower or lower[-1]!=b:lower.append(b)
    if upper[-1]!=1:upper.append(1)
    if lower[-1]!=5:lower.append(5)
    return upper,lower

def independent_tail(chain,label,upper):
    result=(F(0),)*15;low=UNIT
    position=chain.index(label)
    for i in range(position,len(chain)-1):
        j,k=chain[i:i+2]
        high=scaled(difference(APEX[k-1],APEX[j-1]),F(1,k-j))
        intercept=APEX[j-1] if upper else difference(APEX[4],APEX[j-1])
        slope=F(1-j if upper else j-5)
        result=add_poly(result,integrated_line(intercept,slope,low,high));low=high
    return result

def independent_area(q,upper,lower,a,b):
    p=add_poly(q,independent_tail(upper,a,True),-1)
    p=add_poly(p,independent_tail(lower,b,False),-1)
    p=add_poly(p,multiply_affine(UNIT,UNIT),F(5,2))
    p=add_poly(p,multiply_affine(APEX[4],UNIT),-1)
    return scaled(p,F(1,5))

def independent_constraints(shape_rows,a,b):
    closed=[tuple(F(x) for x in p)+(F(0),) for p in shape_rows]
    strict=[]
    for i,j in combinations(range(1,6),2):
        gap=difference(APEX[j-1],APEX[i-1])
        strict.extend((gap,difference(scaled(UNIT,F(j-i+1)),gap)))
    top=difference(APEX[a-1],scaled(UNIT,F(a)));bottom=difference(APEX[b-1],scaled(UNIT,F(b)))
    for j in range(1,6):
        z=difference(APEX[j-1],scaled(UNIT,F(j)))
        closed.extend((difference(top,z),difference(z,bottom)))
    return closed,strict

def verify(geometry,certificate,seconds=120,expected_cells=2632,derive=True):
    start=time.monotonic();stats=Counter();cache={};polynomials=set();singular_exclusions=[]
    def guard():
        if time.monotonic()-start>seconds:raise RuntimeError('TIME_LIMIT')
        rss=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        if (rss if sys.platform=='darwin' else rss*1024)>1536*1024*1024:raise RuntimeError('RSS_LIMIT')
    walls=expected_walls()
    if geometry.get('status')!='COMPLETE_COVER' or geometry.get('processed_planes')!=42 or geometry.get('pending_planes')!=0:raise ValueError('INCOMPLETE_COVER_REFUSED')
    if len(walls)!=42 or tuple(tuple(int(x) for x in p) for p in geometry['planes'])!=BOUNDARIES+walls:raise ValueError('INDEPENDENT_WALL_INVENTORY_MISMATCH')
    if geometry.get('cell_count')!=expected_cells or len(geometry['cells'])!=expected_cells:raise ValueError('MISSING_SHAPE_CELLS')
    if certificate.get('status')!='ALL_FULL_GRADIENT_STATIONARY_CASES_CERTIFIED' or certificate.get('stats',{}).get('cells')!=expected_cells:raise ValueError('INCOMPLETE_STATIONARY_CERTIFICATE_REFUSED')
    records=certificate['cell_results']
    if len(records)!=expected_cells or [r['cell'] for r in records]!=list(range(expected_cells)):raise ValueError('MISSING_OR_DUPLICATE_CELL_RECORDS')
    points=[tuple(F(int(x),int(v['h'][3])) for x in v['h'][:3]) for v in geometry['vertices']]
    signwords=set()
    for index,(cell,record) in enumerate(zip(geometry['cells'],records)):
        guard();word=cell['signs']
        if len(word)!=42 or word in signwords or any(s not in '+-' for s in word):raise ValueError('INVALID_SHAPE_SIGNWORDS')
        signwords.add(word)
        rows=[tuple(-x for x in p) for p in BOUNDARIES]+[tuple(x*(1 if s=='+' else -1) for x in p) for p,s in zip(walls,word)]
        local=[points[i] for i in cell['vertices']]
        if len(local)<4 or len(set(local))!=len(local):raise ValueError('INVALID_SHAPE_VERTEX_LIST')
        for point in local:
            if any(inner(row,point+(F(1),))<0 for row in rows):raise ValueError('INVALID_VERTEX_SIGN')
        center=tuple(sum((p[i] for p in local),F(0))/len(local) for i in range(3))+(F(1),)
        if any(inner(row,center)<=0 for row in rows):raise ValueError('NONINTERIOR_SHAPE_CENTER')
        if derive:
            q,sample=independent_energy(center,rows,guard)
            if tuple(map(F,record['energy']))!=q:raise ValueError('INDEPENDENT_ENERGY_POLYNOMIAL_MISMATCH:'+str(index))
            stats['energy_polynomials_rederived']+=1
        else:sample=center;q=tuple(map(F,record['energy']))
        upper,lower=independent_chains(sample)
        if record['upper_chain']!=upper or record['lower_chain']!=lower:raise ValueError('INDEPENDENT_ENVELOPE_CHAIN_MISMATCH:'+str(index))
        expected_pairs={(a,b) for a in upper for b in lower if a<b}
        cases=record['cases'];pairs=[tuple(case['pair']) for case in cases]
        if len(pairs)!=len(set(pairs)) or set(pairs)!=expected_pairs:raise ValueError('MISSING_OR_DUPLICATE_CARTESIAN_PAIRS:'+str(index))
        for case in cases:
            guard();a,b=case['pair'];p=tuple(map(F,case['polynomial']))
            if len(p)!=15:raise ValueError('BAD_POLYNOMIAL_COEFFICIENT_COUNT')
            polynomials.add(p)
            if derive and p!=independent_area(q,upper,lower,a,b):raise ValueError('INDEPENDENT_AREA_POLYNOMIAL_MISMATCH:'+str(index))
            if p not in cache:
                h,l=derivatives(p);cache[p]=(h,l,exact_eliminate(h,[-v for v in l],4))
            h,l,system=cache[p]
            if system is None:
                if case['status']!='INCONSISTENT_NO_STATIONARY' or case['value'] is not None:raise ValueError('FALSE_INCONSISTENT_STATIONARY_STATUS')
                stats['inconsistent']+=1;continue
            point,null,rank=system
            supplied=tuple(map(F,case['stationary_particular']));supplied_null=tuple(tuple(map(F,d)) for d in case['stationary_nullspace'])
            if len(supplied)!=4 or any(inner(row,supplied)+v for row,v in zip(h,l)):raise ValueError('INVALID_STATIONARY_PARTICULAR')
            if any(len(d)!=4 or any(inner(row,d) for row in h) for d in supplied_null):raise ValueError('INVALID_STATIONARY_NULLSPACE')
            basis=exact_eliminate(supplied_null,[F(0)]*len(supplied_null),4)
            if len(supplied_null)!=4-rank or basis[2]!=len(supplied_null):raise ValueError('INCOMPLETE_STATIONARY_NULLSPACE')
            actual_value=value(p,point)
            if actual_value!=value(p,supplied) or case['value']!=str(actual_value):raise ValueError('INVALID_STATIONARY_VALUE')
            if actual_value>=F(14,61):
                if case['status']!='STATIONARY_VALUE_SAFE':raise ValueError('INVALID_SAFE_STATIONARY_STATUS')
                stats['safe']+=1;stats['singular_safe']+=bool(null)
            else:
                closed,strict=independent_constraints(rows,a,b)
                if case['status']!='BELOW_TARGET_STATIONARY_INFEASIBLE':raise ValueError('FALSE_BELOW_TARGET_INFEASIBILITY_STATUS')
                if tuple(tuple(map(F,w)) for w in case['closed_constraints'])!=tuple(closed) or tuple(tuple(map(F,w)) for w in case['strict_constraints'])!=tuple(strict):raise ValueError('FEASIBILITY_CONSTRAINT_INVENTORY_MISMATCH')
                if null:
                    exclusion=None
                    for kind,inequalities in [('closed',closed),('strict',strict)]:
                        for inequality_index,w in enumerate(inequalities):
                            constant=affine(w,point)
                            if all(not inner(w[:4],d) for d in null) and (constant<0 or kind=='strict' and constant==0):
                                exclusion={'cell':index,'pair':[a,b],'kind':kind,'inequality_index':inequality_index,'constant':str(constant)}
                                break
                        if exclusion:break
                    if exclusion is None:raise RuntimeError('UNRESOLVED_SINGULAR_BELOW_TARGET:'+str(index)+':'+str(a)+','+str(b))
                    singular_exclusions.append(exclusion);stats['singular_below_infeasible_constant']+=1
                else:
                    closed_bad=[i for i,w in enumerate(closed) if affine(w,point)<0]
                    strict_bad=[i for i,w in enumerate(strict) if affine(w,point)<=0]
                    if not closed_bad and not strict_bad:raise ValueError('FEASIBLE_BELOW_TARGET_STATIONARY_POINT')
                    if case['violated_closed_constraints']!=closed_bad or case['violated_strict_constraints']!=strict_bad:raise ValueError('FALSE_RECORDED_FEASIBILITY_VIOLATIONS')
                    stats['unique_below_infeasible']+=1
            stats['pairs']+=1
        stats['cells']+=1
    # Include inconsistent cases in pair total; they bypass the consistent branch.
    stats['pairs']+=stats['inconsistent']
    if certificate['stats'].get('pairs')!=stats['pairs'] or certificate.get('distinct_polynomials')!=len(polynomials):raise ValueError('CERTIFICATE_ACCOUNTING_MISMATCH')
    return {'status':'INDEPENDENT_FINITE_STATIONARY_CERTIFICATE_VERIFIED' if derive else 'STATIONARY_ARITHMETIC_VERIFIED_DERIVATION_UNVERIFIED','stats':dict(stats),'singular_constant_exclusions':singular_exclusions,'distinct_polynomials':len(polynomials),'elapsed_seconds':time.monotonic()-start,'scope':'independent exact finite arithmetic/endpoint-count polynomial derivation; Main universal reduction/C1 and independent hull-volume proof still required; not a mathematical referee or formal proof'}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('cover');parser.add_argument('certificate');parser.add_argument('--out',required=True);parser.add_argument('--seconds',type=float,default=120);parser.add_argument('--arithmetic-only',action='store_true')
    args=parser.parse_args()
    if not 0<args.seconds<=180:raise SystemExit(2)
    try:result=verify(json.loads(Path(args.cover).read_text()),json.loads(Path(args.certificate).read_text()),args.seconds,derive=not args.arithmetic_only)
    except (RuntimeError,ValueError,ArithmeticError,KeyError,IndexError,TypeError) as exc:result={'status':'REFUSED_OR_UNRESOLVED','reason':str(exc)}
    with Path(args.out).open('x') as stream:stream.write(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result));raise SystemExit(0 if result['status']=='INDEPENDENT_FINITE_STATIONARY_CERTIFICATE_VERIFIED' else 3)
