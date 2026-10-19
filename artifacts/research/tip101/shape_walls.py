"""Exact triple-concurrence arrangement on ordered normalized apex simplex."""
from itertools import combinations
from functools import reduce
from math import gcd
import argparse
import json
from pathlib import Path

SIMPLEX = ((0,0,0,1),(0,0,1,1),(0,1,1,1),(1,1,1,1))
BOUNDARIES = ((-1,0,0,0),(1,-1,0,0),(0,1,-1,0),(0,0,1,-1))

def canonical(p):
    g = reduce(gcd, p, 0)
    if not g:
        return None
    p = tuple(x//g for x in p)
    return p if next(x for x in p if x) > 0 else tuple(-x for x in p)

def endpoint_lines():
    apices = ((0,0,0,0),(1,0,0,0),(0,1,0,0),(0,0,1,0),(0,0,0,1))
    return tuple((s,b) for j,b in enumerate(apices,1) for s in (-j,1-j))

def walls():
    lines = endpoint_lines()
    raw = set()
    for (s,b),(t,c),(u,d) in combinations(lines,3):
        p = canonical(tuple((t-s)*(di-bi)-(u-s)*(ci-bi) for bi,ci,di in zip(b,c,d)))
        if p is not None:
            raw.add(p)
    for (s,b),(t,c) in combinations(lines,2):
        if s == t:
            p = canonical(tuple(x-y for x,y in zip(b,c)))
            if p is not None:
                raw.add(p)
    cutting = []
    for p in sorted(raw):
        signs = [sum(x*y for x,y in zip(p,v)) for v in SIMPLEX]
        if min(signs) < 0 < max(signs):
            cutting.append(p)
    return tuple(cutting), {"raw_distinct":len(raw),"cutting":len(cutting),"discarded_noncutting":len(raw)-len(cutting)}

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out',required=True)
    args=parser.parse_args()
    planes,stats=walls()
    with Path(args.out).open('x') as stream:
        stream.write(''.join(' '.join(map(str,p))+'\n' for p in planes))
    print(json.dumps(stats))
