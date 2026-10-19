"""Independent fixed-source rational shape algebra and matrix CONTROL replay.
Universal reduction is written mathematics, not a finite sample of speeds.
"""
import sys, json, hashlib, time, math
from fractions import Fraction as F
LIMIT=262144
started=time.monotonic()
def fail():
    raise ValueError('shape/geometry replay failed closed')
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
    for value in values: result*=value
    return result
def trim(p):
    while len(p)>1 and p[-1]==0: p.pop()
    return p
def add(a,b,factor=1):
    return trim([(a[i] if i<len(a) else 0)+factor*(b[i] if i<len(b) else 0) for i in range(max(len(a),len(b)))])
def times(a,b):
    result=[0]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b): result[i+j]+=x*y
    return trim(result)
def scale(a,value):
    return [x*value for x in a]
def derivative(a):
    return [i*a[i] for i in range(1,len(a))]
def evaluate(a,x):
    result=F(0)
    for v in reversed(a): result=result*x+v
    return result
def positive(x):
    if x<=0: fail()
    return x
def determinant(matrix):
    a=[list(row) for row in matrix]; value=F(1)
    for k in range(len(a)):
        pivot=next((i for i in range(k,len(a)) if a[i][k]),None)
        if pivot is None: return F(0)
        if pivot!=k: a[pivot],a[k]=a[k],a[pivot]; value=-value
        p=a[k][k]; value*=p
        for i in range(k+1,len(a)):
            ratio=a[i][k]/p
            for j in range(k,len(a)): a[i][j]-=ratio*a[k][j]
    return value
def geometry(v,name):
    n=len(v)
    if n not in (13,14) or any(type(x) is not int or not 1<=x<=128 for x in v) or math.gcd(*v)!=1: return None
    maximum=max(v); u=[F(x,maximum) for x in v]; qq=[1+2*x-x*x for x in u]; last=v[-1]**2
    gg=[[F(int(i==j))+F(v[i]*v[j],last) for j in range(n-1)] for i in range(n-1)]
    cc=[[(qq[i] if i==j else F(0))+qq[-1]*F(v[i]*v[j],last) for j in range(n-1)] for i in range(n-1)]
    det_g=determinant(gg); det_c=determinant(cc); weighted=sum(F(x*x)/qq[i] for i,x in enumerate(v)); pq=product(qq)
    expected_g=F(sum(x*x for x in v),last); expected_c=pq*weighted/last
    if det_g!=expected_g or det_c!=expected_c: fail()
    return dict(id=name,primitive=True,speeds=v,detG=wire(det_g),expectedDetG=wire(expected_g),detC=wire(det_c),expectedDetC=wire(expected_c),covolumeSquared=wire(1/(pq*weighted)))
SOURCE=dict(id='arXiv:2609.02604v2',url='https://arxiv.org/html/2609.02604v2',sections=['S3.SS1','S3.SS5','S3.SS6'])
DEPENDENCY=dict(reportPath='docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json',reportSha256='e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6',receiptKind='IMMUTABLE_RETAINED_REFERENCE_NOT_FRESH_053_REPLAY')
def run():
    raw=sys.stdin.buffer.read(LIMIT+1)
    if len(raw)>LIMIT: fail()
    request=json.loads(raw,object_pairs_hook=pairs,parse_constant=lambda _:fail())
    if canonical(request)!=canonical(dict(version=1,source=SOURCE,movingSpeeds=[13,14],dependency=DEPENDENCY)): fail()
    targets=[]; negative=[]
    for n in (13,14):
        D=[1,-(n-2),n-1]; P=[2,-(n-7),-2*(n-4),-(4*n-6),2*(n-1),n-1]
        cubic=[-1,n-5,2*n-5,(n-1)*(2*n-3)]; qq=[1,2,-1]; A=[1,2,2*n-3]
        # Compute scaled derivative exactly without any floating coefficients.
        interior=add(scale(times([0,1],derivative(qq)),F(n,2)),qq,-1)
        if interior!=scale(D,-1) or any(x.denominator!=1 if isinstance(x,F) else False for x in interior): fail()
        interior=[int(x) for x in interior]
        numerator=times(qq,D); denominator=[0,0,n,n]
        fd=add(times(derivative(numerator),denominator),times(numerator,derivative(denominator)),-1)
        ff=scale([0]+P,-n)
        kd=add(scale(times([0,1],add(times(derivative(A),qq),times(A,derivative(qq)),n-2)),n),scale(times(A,qq),-2*(n-1)))
        kf=scale(times([1,-1],cubic),2*(n-1))
        if fd!=ff or kd!=kf: fail()
        al=F(102,1000) if n==13 else F(92,1000); au=F(103,1000) if n==13 else F(93,1000); pu=au if n==13 else F(1,10)
        pm=positive(2+sum(v*pu**i for i,v in enumerate(P) if v<0)); dal=positive(evaluate(D,al)); dau=evaluate(D,au)
        if dau>=0: fail()
        aleft=evaluate(qq,al)**n/au**2; aright=F(8,5)**n; amargin=positive(aleft-aright)
        target=F(2600,101)**2 if n==13 else F(784); branches=[]
        for k in range(2,n+1):
            bound=F(k,2)*2**k*F(8,5)**(n-k)
            branches.append(dict(k=k,lowerBound=wire(bound),target=wire(target),margin=wire(positive(bound-target))))
        cl=F(849,10000) if n==13 else F(782,10000); cu=F(85,1000) if n==13 else F(783,10000)
        cvl=evaluate(cubic,cl); cvu=positive(evaluate(cubic,cu))
        if cvl>=0 or cu>=al: fail()
        exponent=13 if n==13 else 7; de=24 if n==13 else 13
        left=(evaluate(A,cl)*evaluate(qq,cl)**(n-2))**exponent/cu**de; right=target**exponent; margin=positive(left-right)
        controls=[geometry([1]*n,'n%d-ones'%n),geometry(list(range(1,n+1)),'n%d-sequential'%n)]
        if any(c is None for c in controls): fail()
        B=[F(0)]+[F(2*r,(n+1)*(n+1-r))**2 for r in range(1,n)]
        K=product(B[i+1]-B[i] for i in range(n-1)); rn=F(101,200) if n==13 else F(1,2)
        beta=[]
        for C in (F(1,2),F(1),F(n-1,2)):
            beta.append(dict(C=wire(C),coefficients=[wire(C*x-(n-1 if i==2 else 0)) for i,x in enumerate(D)],atOne=wire(2*C-(n-1))))
        shape=dict(status='ACCEPTED_WITH_WRITTEN_UNIVERSAL_BRIDGE',D=D,P=P,cubic=cubic,identities=dict(interiorDerivative=interior,fDerivativeNumerator=fd,factoredFDerivative=ff,k1DerivativeNumerator=kd,factoredK1Derivative=kf),betaControls=beta,
            alphaBracket=dict(lower=wire(al),upper=wire(au),lowerValue=wire(dal),upperValue=wire(dau)),pPositiveMargin=wire(pm),aBound=dict(lower=wire(F(8,5)),poweredLeft=wire(aleft),poweredRight=wire(aright),margin=wire(amargin),endpointValue=wire(F(2))),kBranches=branches,
            criticalBracket=dict(lower=wire(cl),upper=wire(cu),lowerValue=wire(cvl),upperValue=wire(cvu)),rootBelowAlpha=True,k1Comparison=dict(power=exponent,left=wire(left),right=wire(right),margin=wire(margin)),rBound=wire(rn))
        flag=dict(status='CONDITIONAL_ONLY',lowerPremise='NOT_ESTABLISHED',kzPremise='WRITTEN_BASIS_EXISTENCE',K=wire(K),squaredProductBound=wire((rn/n)**(2*n)/K**n),lowerLrcThrough=n-1)
        targets.append(dict(movingSpeeds=n,totalRunners=n+1,shape=shape,geometryControls=controls,flag=flag))
        scaled=[2*x for x in range(1,n+1)]
        if geometry(scaled,'negative') is not None: fail()
        negative.append(dict(movingSpeeds=n,kind='NONPRIMITIVE_SCALED_CONTROL',speeds=scaled,gcd=2,primitiveApplication='REJECTED',projectionUnchanged=True,wrongSourceScale=wire(F(1,2))))
    # Independent bivariate coefficient expansion of both sides of support identity.
    terms={}
    def term(i,j,v): terms[i,j]=terms.get((i,j),0)+v
    term(2,0,1); term(1,1,2); term(0,2,1)
    for i,v in enumerate([1,2,-1]): term(i,2,-v); term(2,i,-v)
    support=[dict(exponents=list(k),coefficient=v) for k,v in sorted(terms.items()) if v]
    expected=[dict(exponents=[1,1],coefficient=2),dict(exponents=[1,2],coefficient=-2),dict(exponents=[2,1],coefficient=-2),dict(exponents=[2,2],coefficient=2)]
    if support!=expected: fail()
    body=dict(version=1,status='CHECKED_UNIVERSAL_SHAPE_GEOMETRY_SUBSTEPS',globalVerdict='NOT_ESTABLISHED',formalProof=False,source=SOURCE,dependency=DEPENDENCY,
        shapeReview=dict(status='REVIEWED_WRITTEN_UNIVERSAL_ARGUMENT',formalProof=False,minimizerCases='ALL_K_1_THROUGH_N',gridSampling=False,rootClassificationCases=['0<C<1','C=1','1<C<(n-1)/2','C=(n-1)/2'],existenceArgument='BOUNDARY_DIVERGENCE_A_GE_1_H_GE_A_I_OVER_2',injectivityArgument='ALL_INTERIOR_COORDINATES_EQUAL_BY_F_STRICT_DECREASE'),
        geometryReview=dict(status='REVIEWED_WRITTEN_UNIVERSAL_ARGUMENT',formalProof=False,controlsAreUniversalProof=False,sectionVerticesComplete='HYPERPLANE_CROSSPOLYTOPE_SECTION_INTERSECTS_ALL_OPPOSITE_SIGN_EDGES',supportIdentity=support,covolumeArgument='PRIMITIVE_PROJECTED_LATTICE_DUALITY_AND_SCHUR_COMPLEMENT'),targets=targets,negativeControls=negative)
    output=(canonical(body)+'\n').encode()
    if len(output)>LIMIT or time.monotonic()-started>4.5: fail()
    sys.stdout.buffer.write(output)
try:
    run()
except Exception:
    sys.stderr.write('shape/geometry replay failed closed\n')
    sys.exit(1)
