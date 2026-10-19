"""Independent fixed-source prefix/KZ exact arithmetic. No files or models.
Finite vertex arithmetic is not a substitute for the written real-domain bridge.
"""
import sys, json, hashlib, time
from fractions import Fraction as F
LIMIT=262144
started=time.monotonic()
def fail():
    raise ValueError('prefix/KZ replay failed closed')
def pairs(items):
    d={}
    for k,v in items:
        if k in d: fail()
        d[k]=v
    return d
def canonical(v):
    return json.dumps(v,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def wire(v):
    return dict(numerator=str(v.numerator),denominator=str(v.denominator))
def product(values):
    result=F(1)
    for v in values: result*=v
    return result
SOURCE=dict(id='arXiv:2609.02604v2',url='https://arxiv.org/html/2609.02604v2',sections=['S3.SS2','S3.SS3','S3.SS4'])
def run():
    raw=sys.stdin.buffer.read(LIMIT+1)
    if len(raw)>LIMIT: fail()
    request=json.loads(raw,object_pairs_hook=pairs,parse_constant=lambda _:fail())
    expected=dict(version=1,source=SOURCE,movingSpeeds=[13,14],rho=wire(F(3,4)))
    if canonical(request)!=canonical(expected): fail()
    rho=F(3,4); targets=[]
    for n in (13,14):
        d=n-1; B=[F(0)]; prefixes=[]
        for r in range(1,d+1):
            separation=F(1,n+1-r); capacity=F(r,(n+1)*(n+1-r)); threshold=separation-capacity
            if threshold!=F(1,n+1): fail()
            B.append(4*capacity*capacity)
            prefixes.append(dict(r=r,lowerLrcMax=n-r,separation=wire(separation),errorCapacity=wire(capacity),witnessThreshold=wire(threshold),B=wire(B[-1])))
        c=[B[i+1]-B[i] for i in range(d)]; w=[rho**i for i in range(d)]
        ratios=[c[i+1]/c[i] for i in range(d-1)]; K=product(c)
        if any(v<=0 for v in c) or any(v<=F(4,3) for v in ratios): fail()
        blocks=[]; cache={}
        for a in range(d):
            for b in range(a+1,d+1):
                scale=(B[b]-B[a])/sum(w[a:b]); t=[scale*v for v in w[a:b]]
                gp=product(t); cp=product(c[a:b]); partial=B[a]
                if gp<cp or (b>a+1 and gp==cp): fail()
                for i in range(a,b):
                    partial+=t[i-a]
                    if partial<B[i+1]: fail()
                if partial!=B[b]: fail()
                cache[a,b]=(t,gp,scale)
                blocks.append(dict(start=a+1,end=b,geometricProduct=wire(gp),incrementProduct=wire(cp),ratio=wire(gp/cp)))
        count=2**(d-1); stream=hashlib.sha256(); minimum=None; equality=0; equality_mask=-1
        for mask in range(count):
            ends=[i for i in range(1,d) if mask & (1<<(i-1))]+[d]
            a=0; p=F(1); t=[]
            for b in ends:
                block=cache[a,b]; t+=block[0]; p*=block[1]; a=b
            # Independently checks every vertex's full prefix and adjacent KZ
            # inequalities, not the JS precomputed-block admission shortcut.
            partial=F(0)
            for i,v in enumerate(t):
                partial+=v
                if partial<B[i+1] or (i and v<rho*t[i-1]): fail()
            if p<K: fail()
            if minimum is None or p<minimum: minimum=p
            if p==K: equality+=1; equality_mask=mask
            stream.update((canonical(dict(mask=mask,ends=ends,product=wire(p)))+'\n').encode())
        if minimum!=K or equality!=1 or equality_mask!=count-1: fail()
        targets.append(dict(movingSpeeds=n,totalRunners=n+1,dimension=d,prefixes=prefixes,increments=[wire(v) for v in c],incrementRatios=[wire(v) for v in ratios],blocks=blocks,
            vertexAudit=dict(maskCount=count,firstMask=0,lastMask=count-1,minimum=wire(minimum),equalityCount=equality,equalityMask=equality_mask,streamSha256=stream.hexdigest(),allFeasible=True)))
    controls=[]
    for name,bb,tt,growth in [('OMITTED_KZ',[F(1),F(5)],[F(5),F(2,5)],True),('OMITTED_GROWTH',[F(1),F(2)],[F(8,7),F(6,7)],False)]:
        cp=bb[0]*(bb[1]-bb[0]); actual=product(tt)
        if tt[0]<bb[0] or sum(tt)<bb[1] or actual>=cp: fail()
        controls.append(dict(id=name,B=[wire(v) for v in bb],t=[wire(v) for v in tt],actualProduct=wire(actual),claimedMinimum=wire(cp),prefixFeasible=True,kzFeasible=tt[1]>=rho*tt[0],growthPremise=growth,isLrcCounterexample=False))
    body=dict(version=1,status='CHECKED_ABSTRACT_KZ_MINIMUM',globalVerdict='NOT_ESTABLISHED',source=SOURCE,rho=wire(rho),
        writtenBridge=dict(status='REVIEWED_MATHEMATICAL_BRIDGE',formalProof=False,vertexCharacterization='ALL_CONTIGUOUS_CONSTANT_Z_BLOCK_COMPOSITIONS',recessionCone='0<=u_1<=...<=u_d',realDomainReduction='MINKOWSKI_WEYL_COORDINATE_MONOTONE_CONCAVE_LOG_PRODUCT',proofKind='WRITTEN_ARGUMENT_PLUS_EXACT_FINITE_ARITHMETIC'),
        prefixArgument=dict(status='REVIEWED_CONDITIONAL_ARGUMENT',formalProof=False,lowerPremise='NOT_ESTABLISHED',geometricPremise='NOT_ESTABLISHED',nearestPlaneBound='sqrt(sum(t_i))/2',equalityYieldsWitness=True),targets=targets,negativeControls=controls)
    output=(canonical(body)+'\n').encode()
    if len(output)>LIMIT or time.monotonic()-started>4.5: fail()
    sys.stdout.buffer.write(output)
try:
    run()
except Exception:
    sys.stderr.write('prefix/KZ replay failed closed\n')
    sys.exit(1)
