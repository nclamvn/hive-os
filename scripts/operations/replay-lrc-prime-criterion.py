"""Independent fixed-source shift, complete toy domain, lift and unit controls.
This does not replay lower author archives or establish target prime coverage.
"""
import sys, json, hashlib, time, math, itertools
from fractions import Fraction as F
LIMIT=262144
started=time.monotonic()
def fail():
    raise ValueError('prime criterion replay failed closed')
def pairs(items):
    result={}
    for k,v in items:
        if k in result: fail()
        result[k]=v
    return result
def canonical(value):
    return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def wire(value):
    return dict(numerator=str(value.numerator),denominator=str(value.denominator))
def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()
def distance(value):
    value%=1
    return min(value,1-value)
def good(phase,k,h):
    return [j for j in range(h) if distance(phase+F(j,h))>=F(1,k+1)]
def shift_audit(k,h):
    points=sorted(set((F(sign,k+1)-F(j,h))%1 for j in range(h) for sign in (-1,1)))
    stream=hashlib.sha256(); minimum=h
    for i,left in enumerate(points):
        right=points[i+1] if i+1<len(points) else points[0]+1
        for kind,phase in [('BOUNDARY',left),('OPEN',((left+right)/2)%1)]:
            indices=good(phase,k,h)
            if not indices: fail()
            minimum=min(minimum,len(indices))
            row=dict(kind=kind,left=wire(left),right=wire(left if kind=='BOUNDARY' else right),phase=wire(phase),goodShiftIndices=indices,firstGoodShift=indices[0])
            stream.update((canonical(row)+'\n').encode())
    return dict(movingSpeeds=k,effectiveOrbit=h,boundaries=len(points),cells=2*len(points),minimumGoodShifts=minimum,allHaveGoodShift=True,streamSha256=stream.hexdigest())
def grid(v,M,k):
    return next((j for j in range(M) if all((k+1)*min((j*x)%M,M-(j*x)%M)>=M for x in v)),None)
def omit(v,level):
    # Definition properness allows g dividing the exceptional residue too.
    # Such a leaf can exclude primitive actual lifts without a shift witness.
    for i in range(len(v)):
        g=math.gcd(level,*(v[:i]+v[i+1:]))
        if g>1: return dict(index=i,divisor=g)
    return None
def toy(p):
    level=4; M=p*level; stream=hashlib.sha256(); counts=dict(GRID_GOOD=0,GCD_ONLY=0,IMPROPER=0); rows=0
    bases=list(itertools.product(range(1,p),repeat=3)); digits=list(itertools.product(range(4),repeat=3))
    for base in bases:
        for digit in digits:
            v=[r+p*a for r,a in zip(base,digit)]; j=grid(v,M,3); g=omit(v,level)
            classification='GRID_GOOD' if j is not None else 'GCD_ONLY' if g else 'IMPROPER'
            counts[classification]+=1; rows+=1
            row=dict(base=list(base),digits=list(digit),residues=v,firstGridWitness=j,omittedIndex=g['index'] if g else None,gcdDivisor=g['divisor'] if g else None,classification=classification)
            stream.update((canonical(row)+'\n').encode())
    if rows!=len(bases)*64 or rows!=sum(counts.values()): fail()
    return dict(movingSpeeds=3,prime=p,level=4,modulus=M,bases=len(bases),liftsPerBase=64,rows=rows,gridGood=counts['GRID_GOOD'],gcdOnly=counts['GCD_ONLY'],improper=counts['IMPROPER'],preservesRepeatedCoordinates=True,coverage='COMPLETE_TOY_DOMAIN_ONLY' if not counts['IMPROPER'] else 'INCOMPLETE',streamSha256=stream.hexdigest())
def transfers():
    result=[]
    for kind,parent in [('GRID_WITNESS',[1,3,7]),('GCD_MONOTONICITY',[2,4,1])]:
        j=grid(parent,10,3); g=omit(parent,2); stream=hashlib.sha256()
        for digits in itertools.product(range(2),repeat=3):
            v=[x+10*a for x,a in zip(parent,digits)]
            if kind=='GRID_WITNESS':
                if j!=5 or not all(4*min((10*x)%20,20-(10*x)%20)>=20 for x in v): fail()
            elif j is not None or g is None or g['divisor']!=2 or omit(v,4) is None: fail()
            row=dict(digits=list(digits),residues=v,childGridWitness=10 if kind=='GRID_WITNESS' else None,childOmittedGcd=omit(v,4))
            stream.update((canonical(row)+'\n').encode())
        result.append(dict(kind=kind,prime=5,parentLevel=2,childLevel=4,parentResidues=parent,rows=8,parentGridWitness=j,childGridNumerator=10 if kind=='GRID_WITNESS' else None,gcdDivisor=g['divisor'] if g else None,streamSha256=stream.hexdigest()))
    return result
def prime(p):
    return p>=2 and all(p%d for d in range(2,math.isqrt(p)+1))
def inverse(a,M):
    return next((b for b in range(1,M) if a*b%M==1),None)
def repair(p,level,a):
    m=level; pp=1
    while m%p==0: m//=p; pp*=p
    M=p*level; inv=inverse(a,p)
    b=next((b for b in range(1,M) if b%p==inv and b%m==1%m),None)
    if b is None or math.gcd(b,M)!=1: fail()
    if any(math.gcd(level,(b*x)%M)!=math.gcd(level,x) for x in range(M)): fail()
    return dict(prime=p,level=level,baseUnit=a,pPower=pp,coprimePart=m,modulus=M,scalingUnit=b,isUnit=True)
SOURCES=[dict(id='arXiv:2604.23906v2',url='https://arxiv.org/html/2604.23906v2',revisionDate='2026-09-01'),dict(id='arXiv:2609.02604v2',url='https://arxiv.org/html/2609.02604v2',revisionDate='2026-09-24')]
DEPENDENCIES=[dict(path='docs/research/lrc-allikvere-v2/retained-prefix-kz-audit.json',sha256='e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6'),dict(path='docs/research/lrc-allikvere-v2/retained-shape-geometry-audit.json',sha256='b29cd15b4520e74943e12c194765155a1238857ae39c2ab473119e9309c808fd')]
def run():
    raw=sys.stdin.buffer.read(LIMIT+1)
    if len(raw)>LIMIT: fail()
    request=json.loads(raw,object_pairs_hook=pairs,parse_constant=lambda _:fail())
    expected=dict(version=1,sources=SOURCES,dependencies=DEPENDENCIES,shiftMovingSpeeds=[3,13,14],orbitRange=[2,32],toyPrimes=[3,5],toyLevel=4)
    if canonical(request)!=canonical(expected): fail()
    shifts=[shift_audit(k,h) for k in (3,13,14) for h in range(2,33)]; cells=sum(row['cells'] for row in shifts)
    if cells!=5550: fail()
    negatives=[dict(movingSpeeds=2,effectiveOrbit=2,phase=wire(F(1,4)),goodShifts=good(F(1,4),2,2)),dict(movingSpeeds=3,effectiveOrbit=1,phase=wire(F(0)),goodShifts=good(F(0),3,1))]
    if any(row['goodShifts'] for row in negatives): fail()
    boundary=dict(movingSpeeds=3,effectiveOrbit=2,phase=wire(F(1,4)),goodShifts=good(F(1,4),3,2),equalityGood=True)
    if boundary['goodShifts']!=[0,1]: fail()
    phases=[F(2*j,6)%1 for j in range(6)]; selected=next((j for j,p in enumerate(phases) if distance(p)>=F(1,4)),None)
    if selected!=1 or 6//math.gcd(6,2)!=3: fail()
    v=[2,4,1]; initial=F(1,6); final=initial+F(1,2); initial_d=[distance(x*initial) for x in v]; final_d=[distance(x*final) for x in v]
    if grid(v,10,3) is not None or final_d!=[F(1,3)]*3: fail()
    domains=[toy(3),toy(5)]
    if [[d['rows'],d['gridGood'],d['gcdOnly'],d['improper']] for d in domains]!=[[512,512,0,0],[4096,3472,432,192]]: fail()
    original=[1,2,4]; scaled=[5*x%28 for x in original]; correct_d=[distance(F(10*x,28)) for x in original]; wrong_d=[distance(F(6*x,28)) for x in original]
    if inverse(5,28)!=17 or math.gcd(*scaled)!=5 or any(distance(F(2*x,28))<F(1,4) for x in scaled) or min(correct_d)<F(1,4) or min(wrong_d)>=F(1,4): fail()
    if any(b%3==2 and b%3==1 for b in range(9)): fail()
    body=dict(version=1,status='CHECKED_CONDITIONAL_PRIME_BRIDGE',globalVerdict='NOT_ESTABLISHED',formalProof=False,sources=SOURCES,dependencies=DEPENDENCIES,
        sourceLedger=[dict(sourceId='arXiv:2604.23906v2',theorem='1.3',movingSpeedRange=[1,12],totalRunnerRange=[2,13],status='SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED',sections=['S2','S4','S5','S6']),dict(sourceId='arXiv:2609.02604v2',theorem='1.1',movingSpeedRange=[13,14],totalRunnerRange=[14,15],status='SOURCE_REVIEWED_NOT_INDEPENDENTLY_REPRODUCED',sections=['S2','S5','S6'])],
        lowerReplaySource=dict(residualTuples=1092,primes=91,status='AUTHOR_REPORTED_ONLY',snapshotLinksRetrieved=False,localReplay=False),
        terminalConditions=dict(sourceId='arXiv:2604.23906v2',proposition='4.4',requiresRunnerCountOddPrime=True,requiresPrimeAboveKTimesKPlusOne=True,cases=[dict(movingSpeeds=k,totalRunners=k+1,testPrime=199,eligibleConditionsOnly=prime(k+1) and k+1!=2 and prime(199) and 199>k*(k+1),automaticAcceptance=False) for k in (12,13,14)]),
        criterionReview=dict(status='REVIEWED_WRITTEN_CONDITIONAL_ARGUMENT',formalProof=False,allBaseClassesRequired=True,fullLiftFiberRequired=True,thirdBranchDomain='EVERY_POSITIVE_DISTINCT_INTEGER_LIFT_NOT_PRIMITIVE_ONLY',primitiveOmittedGcdImpliesUnit=True,generalizedEffectiveOrbit='g/gcd(g,exception)>=2',openBadArcBoundaryGood=True,monotonicity='GRID_WITNESS_AND_LEVEL_GCD_PERSIST_AT_INTEGER_MULTIPLES',uniformLevel='LCM_OF_FINITE_PER_BASE_TERMINAL_LEVELS',genericThirdBranchSymmetry='SEPARATE_PROOF_REQUIRED'),
        applications=[dict(movingSpeeds=13,totalRunners=14,lowerThrough=12,lowerStatus='SOURCE_LOCATED_NOT_REPRODUCED',primeCriterion='CONDITIONAL_REVIEWED',authorCoverage='NOT_ESTABLISHED',divisibilityAccepted=False),dict(movingSpeeds=14,totalRunners=15,lowerThrough=13,lowerStatus='PRIOR_FULL_LRC13_NOT_ESTABLISHED',primeCriterion='CONDITIONAL_REVIEWED',authorCoverage='NOT_ESTABLISHED',divisibilityAccepted=False)],
        shiftAudits=shifts,shiftCellCount=cells,negativeShiftControls=negatives,boundaryControl=boundary,generalizedNonunitControl=dict(movingSpeeds=3,divisor=6,exceptionSpeed=2,effectiveOrbit=3,phases=[wire(p) for p in phases],firstGoodShift=selected,primitiveApplication=False),transferControls=transfers(),
        offGridControl=dict(parentResidues=v,parentGridWitness=None,initialTime=wire(initial),initialDistances=[wire(x) for x in initial_d],selectedShift=1,finalTime=wire(final),finalDistances=[wire(x) for x in final_d],sameOffGridTimeClaimedForLifts=False),toyDomains=domains,
        unitTransport=dict(modulus=28,scalingUnit=5,inverseUnit=17,originalResidues=original,scaledResidues=scaled,witnessNumerator=2,correctNumerator=10,wrongInverseNumerator=6,correctDistances=[wire(x) for x in correct_d],wrongDistances=[wire(x) for x in wrong_d],correctGood=True,wrongGood=False,scaledIntegerGcd=5,primitivePreserved=False),
        crtReview=dict(status='LOCALIZED_EXPOSITION_REPAIR_NOT_THEOREM_REFUTATION',restrictedNegative=dict(prime=3,level=3,baseUnit=2,solution=None),generalizedControls=[repair(3,3,2),repair(3,6,2),repair(5,4,2)],gcdPredicatesPreservedByUnit=True,thirdBranchPrimitiveOnlyUnsafe=True))
    output=(canonical(body)+'\n').encode()
    if len(output)>LIMIT or time.monotonic()-started>4.5: fail()
    sys.stdout.buffer.write(output)
try:
    run()
except Exception:
    sys.stderr.write('prime criterion replay failed closed\n')
    sys.exit(1)
