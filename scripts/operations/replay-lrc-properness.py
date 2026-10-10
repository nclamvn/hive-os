"""Independent exact phase-partition / conditional congruence arithmetic.
No theorem verdict, files, external modules, archive execution or network.
Critical boundaries + connected open cells, not rational sampling.
"""
import sys, json, hashlib, math, time
from fractions import Fraction as F

LIMIT=262144
started=time.monotonic()
def fail():
    raise ValueError("properness replay failed closed")
def pairs(values):
    result={}
    for k,v in values:
        if k in result: fail()
        result[k]=v
    return result
def canonical(x):
    return json.dumps(x,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def digest(x):
    return hashlib.sha256(canonical(x).encode()).hexdigest()
def exact_keys(x,keys):
    if type(x) is not dict or set(x)!=set(keys): fail()
def integer(x,lo,hi):
    if type(x) is not int or not lo<=x<=hi: fail()
def wire(x):
    return {'numerator':str(x.numerator),'denominator':str(x.denominator)}
def frac1(x):
    return x-x.numerator//x.denominator
def mask(t,n,d):
    result=[]
    for q in range(d):
        value=frac1(t+F(q,d))
        if min(value,1-value)<F(1,n): result.append(q)
    return result
def phase(n,d):
    # Every predicate boundary is derived before any interval representative.
    points=sorted(set(frac1(F(sign,n)-F(q,d)) for q in range(d) for sign in (-1,1)))
    cells=[]
    for i,left in enumerate(points):
        right=points[i+1] if i+1<len(points) else points[0]+1
        cells.append({'kind':'BOUNDARY','left':wire(left),'right':wire(left),'representative':wire(left),'badShiftIndices':mask(left,n,d)})
        representative=frac1((left+right)/2)
        cells.append({'kind':'OPEN','left':wire(left),'right':wire(right),'representative':wire(representative),'badShiftIndices':mask(representative,n,d)})
    maximum=max(len(c['badShiftIndices']) for c in cells)
    bound=(2*d+n-1)//n
    if maximum>bound or len(cells)>128: fail()
    body={'totalRunners':n,'shiftModulus':d,'boundaries':[wire(p) for p in points],'cells':cells,'maximumBadShifts':maximum,'ceilBound':bound}
    return dict(body,certificateDigest=digest(body))
def prime(d):
    return d>=2 and all(d%q for q in range(2,math.isqrt(d)+1))
def check_class(c):
    exact_keys(c,['id','mechanism','totalRunners','modulus','divisor','residues','exceptionIndices','lowerPremise'])
    integer(c['totalRunners'],3,15); integer(c['modulus'],2,1000000); integer(c['divisor'],2,32)
    if type(c['id']) is not str or not 1<=len(c['id'])<=80 or any(not (s.isascii() and (s.isalnum() or s in '_-')) for s in c['id']): fail()
    if c['mechanism'] not in ['NONPRIMITIVE','OMIT_ONE','FEW_EXCEPTIONS'] or c['lowerPremise']!='NOT_ESTABLISHED': fail()
    if type(c['residues']) is not list or not 2<=len(c['residues'])<=14: fail()
    if type(c['exceptionIndices']) is not list or len(c['exceptionIndices'])>14: fail()
    for v in c['residues']: integer(v,0,1000000)
    for i in c['exceptionIndices']: integer(i,0,13)
def classify(c,p):
    check_class(c)
    n,m,g=c['totalRunners'],c['modulus'],c['divisor']; r=c['residues']; ex=c['exceptionIndices']
    def rejected(reason):
        return dict(c,status='NOT_APPLICABLE',reason=reason,premises=[],phaseCertificateDigest=None)
    if len(r)!=n-1 or any(v>=m for v in r) or sorted(set(ex))!=ex or any(i>=len(r) for i in ex): return rejected('CLASS_SHAPE')
    if m%g: return rejected('DIVISOR_DOES_NOT_DIVIDE_MODULUS')
    if any(v%g for i,v in enumerate(r) if i not in ex): return rejected('FIXED_COORDINATE_NOT_DIVISIBLE')
    if c['mechanism']=='NONPRIMITIVE':
        if ex or any(v%g for v in r): return rejected('NOT_UNIFORMLY_NONPRIMITIVE')
        return dict(c,status='NONPRIMITIVE_CLASS_EXCLUDED',reason='EVERY_INTEGER_LIFT_HAS_COMMON_DIVISOR',premises=['ONLY_THIS_INTEGER_CLASS','NO_FIXED_GRID_WITNESS_CLAIM'],phaseCertificateDigest=None)
    if any(math.gcd(r[i],g)!=1 for i in ex): return rejected('EXCEPTION_NOT_UNIT')
    if p is None or p['totalRunners']!=n or p['shiftModulus']!=g: return rejected('PHASE_CERTIFICATE_MISSING_OR_MISMATCHED')
    if c['mechanism']=='OMIT_ONE' and len(ex)!=1: return rejected('OMIT_ONE_REQUIRES_ONE_EXCEPTION')
    if c['mechanism']=='FEW_EXCEPTIONS' and (n!=15 or not prime(g) or len(ex)<2): return rejected('FEW_EXCEPTION_DOMAIN')
    if len(ex)*p['ceilBound']>=g: return rejected('STRICT_COMMON_SHIFT_BOUND_FAILED')
    return dict(c,status='CONDITIONAL_LOWER_WITNESS',reason='A_COMMON_SHIFT_EXISTS_IF_LOWER_WITNESS_EXISTS',premises=['POSITIVE_DISTINCT_PRIMITIVE_INTEGER_SPEEDS','LOWER_LRC_NOT_ESTABLISHED_LOCALLY','LOWER_CASE_CONTINUOUS_WITNESS_REQUIRED','COMMON_SHIFT_PRESERVES_FIXED_COORDINATES','NO_ACTUAL_WITNESS_OR_GLOBAL_TERMINAL_CERTIFIED'],phaseCertificateDigest=p['certificateDigest'])
def retained_classes():
    vectors=[
        [1792,798,2590,203,602,1001,1400,406,2198,1204,210,2002,1008],
        [1792,798,2590,203,602,1001,1400,1799,2198,1204,210,2002,1008],
        [399,798,1197,1596,1995,2394,7,406,805,1204,1603,2002,2401],
        [399,798,1197,1596,1995,2394,7,406,805,1204,1603,2401,1218]]
    result=[dict(id='tip048-fixed-'+str(i),mechanism='NONPRIMITIVE',totalRunners=14,modulus=2786,divisor=7,residues=r,exceptionIndices=[],lowerPremise='NOT_ESTABLISHED') for i,r in enumerate(vectors)]
    for d,e in [(3,2),(5,2),(5,3),(5,4)]:
        result.append(dict(id='conditional-control-d%d-e%d'%(d,e),mechanism='FEW_EXCEPTIONS',totalRunners=15,modulus=d*100,divisor=d,residues=[1+d*i if i<e else d*(i-e+1) for i in range(14)],exceptionIndices=list(range(e)),lowerPremise='NOT_ESTABLISHED'))
    result.append(dict(id='conditional-control-omit-one-d7',mechanism='OMIT_ONE',totalRunners=14,modulus=700,divisor=7,residues=[1]+[7*i for i in range(1,13)],exceptionIndices=[0],lowerPremise='NOT_ESTABLISHED'))
    return result
def host_classes(s):
    exact_keys(s,['version','totalRunners','modulus','axes']); integer(s['totalRunners'],2,15); integer(s['modulus'],2,128)
    if s['version']!=1 or type(s['version']) is not int or type(s['axes']) is not list or len(s['axes'])!=s['totalRunners']-1: fail()
    all_values=[]; tuples=1
    for axis in s['axes']:
        if type(axis) is not list or not 1<=len(axis)<=127 or sorted(set(axis))!=axis: fail()
        for v in axis: integer(v,1,s['modulus']-1)
        all_values+=axis; tuples*=len(axis)
    if len(all_values)!=len(set(all_values)) or tuples>10000: fail()
    if s['totalRunners']<3: return []
    result=[]
    for g in range(2,33):
        if s['modulus']%g or not all(all(v%g==axis[0]%g for v in axis) for axis in s['axes']): continue
        r=[axis[0]%g for axis in s['axes']]; ex=[i for i,v in enumerate(r) if v%g]
        mechanism='NONPRIMITIVE' if not ex else 'OMIT_ONE' if len(ex)==1 else 'FEW_EXCEPTIONS'
        result.append(dict(id='finite-uniform-d'+str(g),mechanism=mechanism,totalRunners=s['totalRunners'],modulus=g,divisor=g,residues=r,exceptionIndices=ex,lowerPremise='NOT_ESTABLISHED'))
    return result
def run():
    raw=sys.stdin.buffer.read(LIMIT+1)
    if len(raw)>LIMIT: fail()
    req=json.loads(raw,object_pairs_hook=pairs,parse_constant=lambda _:fail())
    exact_keys(req,['version','scopeBinding','finiteScope','classes'])
    if type(req['version']) is not int or req['version']!=1: fail()
    binding=req['scopeBinding']; exact_keys(binding,['kind','sourceReportSha256','sourceScopeDigest','rootContractDigest'])
    if binding['kind']=='TIP048_FIXED_CLASSES':
        if req['finiteScope'] is not None or binding!=dict(kind='TIP048_FIXED_CLASSES',sourceReportSha256='40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1',sourceScopeDigest='28ea85ade2aca637589ea615d7ac45cc2dd42f6f5e264be8c4415afff87421c1',rootContractDigest=None): fail()
        classes=retained_classes()
    elif binding['kind']=='FINITE_HOST_SCOPE':
        classes=host_classes(req['finiteScope'])
        if binding['sourceReportSha256'] is not None or binding['sourceScopeDigest']!=digest(req['finiteScope']) or type(binding['rootContractDigest']) is not str or len(binding['rootContractDigest'])!=64 or any(c not in '0123456789abcdef' for c in binding['rootContractDigest']): fail()
    else: fail()
    if req['classes']!=classes or len(classes)>32: fail()
    dimensions=sorted(set((c['totalRunners'],c['divisor']) for c in classes if c['mechanism']!='NONPRIMITIVE'))
    certs=[phase(n,d) for n,d in dimensions]
    applications=[classify(c,next((p for p in certs if (p['totalRunners'],p['shiftModulus'])==(c['totalRunners'],c['divisor'])),None)) for c in classes]
    body=dict(version=1,status='CHECKED_CONDITIONAL_MECHANISMS',globalVerdict='NOT_ESTABLISHED',source=dict(id='arXiv:2609.02604v2',url='https://arxiv.org/html/2609.02604v2',sections=['S2','S4.SS4','S6']),scopeBinding=binding,phaseCertificates=certs,applications=applications)
    output=(canonical(body)+'\n').encode()
    if len(output)>LIMIT or time.monotonic()-started>2: fail()
    sys.stdout.buffer.write(output)
try:
    run()
except Exception:
    sys.stderr.write('properness replay failed closed\n')
    sys.exit(1)
