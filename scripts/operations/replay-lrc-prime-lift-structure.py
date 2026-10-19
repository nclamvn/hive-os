import sys,json,time,math,itertools

started=time.monotonic()
def check():
    if time.monotonic()-started>=15: raise ValueError('deadline')
def pairs(items):
    result={}
    for key,value in items:
        if key in result: raise ValueError('duplicate key')
        result[key]=value
    return result
def canon(value): return json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False)
def dist(t,v,m):
    r=(t*v)%m
    return min(r,m-r)
def first(tuple_,m,N,omit=None):
    # Independently inspect FULL grid, not TS's reflection half-grid shortcut.
    for t in range(m):
        if t%64==0: check()
        if all(i==omit or N*dist(t,v,m)>=m for i,v in enumerate(tuple_)): return t
    return None
def input_ok(value):
    if type(value)!=dict or set(value)!={'n','M','q','parent','boundary'}: raise ValueError('input keys')
    n,M,q=value['n'],value['M'],value['q']
    if any(type(x)!=int for x in (n,M,q)) or not(3<=n<=14 and 2<=M<=4096 and 2<=q<=31 and M*q<=65536) or math.gcd(M,q)!=1 or any(q%d==0 for d in range(2,math.isqrt(q)+1)): raise ValueError('input bounds')
    if value['boundary']!='STRICT_OPEN_BAD' or type(value['parent'])!=list or len(value['parent'])!=n or any(type(x)!=int or not 0<=x<M for x in value['parent']): raise ValueError('parent/policy')
    return n,M,q,value['parent']
def verify(root):
    check()
    if type(root)!=dict: raise ValueError('root')
    n,M,q,u=input_ok(root['input']);N=n+1;Q=q*M
    if first(u,M,N)!=None: raise ValueError('parent premise')
    deletion=[]
    for e in range(n):
        t=first(u,M,N,e)
        if t==None: raise ValueError('deletion premise')
        deletion.append(t)
    # Enumerate UNION of omitted-coordinate divisible constraints, not producer's
    # all-base + single replacement construction. Labels and repeats survive.
    members=set()
    for omit in range(n):
        domains=[]
        for i in range(n):
            domains.append(list(range(q)) if i==omit else [a for a in range(q) if (u[i]+M*a)%q==0])
        for digits in itertools.product(*domains): members.add(tuple(u[i]+M*digits[i] for i in range(n)))
    rows=[]
    divisible=[next(a for a in range(q) if (v+M*a)%q==0) for v in u]
    for tuple_ in sorted(members):
        check();digits=[(tuple_[i]-u[i])//M for i in range(n)]
        exceptions=[i for i,v in enumerate(tuple_) if v%q]
        if len(exceptions)>1: raise ValueError('subset enumeration')
        e=exceptions[0] if exceptions else None
        raw=first(tuple_,Q,N);witness=None
        if e==None:
            if raw!=None: raise ValueError('all divisible grid')
        else:
            if raw==None: raise ValueError('exception no grid')
            s=deletion[e];j0=(q*s)%M
            for h in range(q):
                j=j0+M*h;ds=[dist(j,v,Q) for v in tuple_]
                if all(N*d>=Q for d in ds):
                    pd=[dist(s,v,M) for v in u]
                    for i in range(n):
                        if i!=e:
                            if ds[i]!=q*pd[i] or (j*tuple_[i]-q*s*u[i])%Q!=0: raise ValueError('phase preservation')
                    witness={'s':s,'j0':j0,'h':h,'j':j,'distances':ds,'preservedParentDistances':pd};break
            if witness==None: raise ValueError('constructive witness')
        proper=False;gcd_modulus=14 if q==7 and M==166 else q
        for omit in range(n):
            g=gcd_modulus
            for i,v in enumerate(tuple_):
                if i!=omit: g=math.gcd(g,v)
            if g>1: proper=True
        rows.append({'digits':digits,'tuple':list(tuple_),'exception':e,'classification':'NO_GRID' if e==None else 'GRID','gcdProper':proper,'witness':witness})
    expected={'input':root['input'],'Q':Q,'qInverse':pow(q,-1,M),'gcdModulus':14 if q==7 and M==166 else q,'divisibleDigits':divisible,'deletionWitnesses':deletion,'rows':rows,'counts':{'subset':len(rows),'grid':sum(r['classification']=='GRID' for r in rows),'noGrid':sum(r['classification']=='NO_GRID' for r in rows),'gcdProper':sum(r['gcdProper'] for r in rows)},'fullGcdSubset':q==7 and M==166 and sum(v%2 for v in u)>=2}
    # Canonical text comparison distinguishes bool from integer and rejects extras,
    # row order changes, omitted/duplicate rows, and all coherently changed facts.
    if canon(root)!=canon(expected): raise ValueError('complete tuple/witness disagreement')
    return expected
try:
    raw=sys.stdin.buffer.read(262145)
    if len(raw)>262144: raise ValueError('request cap')
    request=json.loads(raw,object_pairs_hook=pairs,parse_constant=lambda _: (_ for _ in ()).throw(ValueError('nonfinite')))
    if type(request)!=dict or set(request)!={'version','boundary','roots','control'} or type(request['version'])!=int or request['version']!=1 or request['boundary']!='STRICT_OPEN_BAD' or type(request['roots'])!=list or not 1<=len(request['roots'])<=8: raise ValueError('fixed request')
    roots=[verify(r) for r in request['roots']]
    ds=[dist(83,1+166*a,1162) for a in range(7)]
    control={'N':14,'Q':1162,'time':83,'speed':1,'digits':list(range(7)),'distances':ds,'strictBad':sum(14*d<1162 for d in ds),'closedBad':sum(14*d<=1162 for d in ds)}
    if canon(request['control'])!=canon(control): raise ValueError('boundary control')
    check();out=canon({'roots':roots,'control':control,'checkedEveryTupleAndWitness':True,'enumeration':'UNION_OMITTED_DIVISIBLE_CONSTRAINTS_FULL_RAW_GRID'})+'\n'
    if len(out.encode())>262144: raise ValueError('output cap')
    sys.stdout.write(out)
except Exception:
    sys.stderr.write('prime lift replay failed closed\n');sys.exit(1)
