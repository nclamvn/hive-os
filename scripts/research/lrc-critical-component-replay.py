"""TIP-072T unsigned offline exact component/catalogue diagnostic, no authority."""
from fractions import Fraction
from functools import reduce
from hashlib import sha256
from itertools import combinations
from math import gcd, isfinite
import json
import os
import re
import sys
from time import monotonic

FLAGS = ("RESEARCH_WORKER_ENABLED", "MATH_PILOT_QUEUE_ENABLED", "LRC_CAMPAIGN_LOCAL_ENABLED",
         "RESEARCH_OPENAI_ENABLED", "RESEARCH_CODEX_LOCAL_ENABLED", "SANDBOX_DOCKER_ENABLED")
MAX_MS, MAX_OPERATIONS, MAX_BYTES, MAX_SPEED = 5000, 2000000, 32768, 10**12
ETA = Fraction(1, 14)
SCOPE = {"localUnsigned": True, "retainedAgentResult": False, "agentLoop": "NOT_RUN",
         "executionAuthority": False, "wholeAllikvereBranch": "NOT_ESTABLISHED",
         "global": "NOT_ESTABLISHED", "formal": "NOT_ESTABLISHED", "external": "NOT_ESTABLISHED",
         "novelty": "NOT_ESTABLISHED", "samplingIsUniversalProof": False,
         "genericStrictSlack": False, "writtenTheoremHasSpeedCap": False,
         "catalogueIsAbsoluteSpeedReduction": False,
         "exhaustionScope": "TRANSLATES_OF_ONE_CONNECTED_LOWER_GOOD_COMPONENT_ONLY"}
CANDIDATE_COLUMNS = ["label", "v", "normalizedV", "h", "q", "alpha", "r", "y", "nearestInteger",
                     "offset", "beta", "D", "leftDelta", "rightDelta", "leftInComponent",
                     "rightInComponent", "symmetricGate", "alreadySafe"]
BAND_COLUMNS = ["label", "floor", "left", "right", "lowerDistance"]
MASK_COLUMNS = ["label", "q", "badIndices", "support", "parityCounts", "ternaryCounts"]
MATRIX_SCHEMA = {"rows": 30, "columns": 13, "rowTime": "baseTime+ell/(30*H)",
                 "distance": "nonnegative integer distanceNumerators[ell][label]/matrixDenominator",
                 "denominator": "lcm(den(baseTime),30*H); decimal canonical positive string",
                 "numerators": "NOT individually reduced; exact and <=denominator/2"}


class Refused(ValueError):
    """Constant fail-closed reason, no positive JSON evidence."""


class Work:
    def __init__(self, limits=None):
        if limits is None:
            limits = {"maxMs": MAX_MS, "maxOperations": MAX_OPERATIONS}
        if type(limits) is not dict or len(limits) != 2 or any(type(k) is not str for k in limits) or set(limits) != {"maxMs", "maxOperations"}:
            raise Refused("INPUT_REFUSED")
        if any(type(v) is not int for v in limits.values()):
            raise Refused("INPUT_REFUSED")
        if not 1 <= limits["maxMs"] <= MAX_MS or not 1 <= limits["maxOperations"] <= MAX_OPERATIONS:
            raise Refused("INPUT_REFUSED")
        self.start = monotonic()
        self.deadline = self.start+limits["maxMs"]/1000
        self.limit, self.operations = limits["maxOperations"], 0

    def charge(self, amount=1):
        self.operations += amount
        if self.operations > self.limit or monotonic() >= self.deadline:
            raise Refused("RESOURCE_REFUSED")

    def q(self, value):
        self.charge()
        if type(value) not in (int, Fraction):
            raise Refused("INPUT_REFUSED")
        value = Fraction(value)
        if abs(value.numerator).bit_length() > 256 or value.denominator.bit_length() > 256:
            raise Refused("COMPONENT_REFUSED")
        return value


def wire(x):
    return [str(x.numerator), str(x.denominator)]


def norm(x, work):
    x = work.q(x % 1)
    return work.q(min(x, 1-x))


def parse_input(raw, work):
    if type(raw) is not dict or len(raw) != 3 or any(type(k) is not str for k in raw) or set(raw) != {"label", "speeds", "tau"}:
        raise Refused("INPUT_REFUSED")
    label, speeds, tau = (raw[k] for k in ("label", "speeds", "tau"))
    if type(label) is not str or re.fullmatch(r"[A-Za-z0-9_-]{1,80}", label) is None:
        raise Refused("INPUT_REFUSED")
    if type(speeds) is not list or len(speeds) != 13:
        raise Refused("INPUT_REFUSED")
    if any(type(v) is not int or not 1 <= v <= MAX_SPEED for v in speeds) or len(set(speeds)) != 13:
        raise Refused("INPUT_REFUSED")
    if type(tau) is not list or len(tau) != 2 or any(type(x) is not str or len(x) > 79 for x in tau):
        raise Refused("INPUT_REFUSED")
    if re.fullmatch(r"0|-?[1-9][0-9]*", tau[0]) is None or re.fullmatch(r"[1-9][0-9]*", tau[1]) is None:
        raise Refused("INPUT_REFUSED")
    num, den = int(tau[0]), int(tau[1])
    work.charge(256**2)
    if abs(num).bit_length() > 256 or den.bit_length() > 256 or gcd(num, den) != 1:
        raise Refused("INPUT_REFUSED")
    lo = [i for i, v in enumerate(speeds) if v % 5 == 0]
    ex = [i for i, v in enumerate(speeds) if v % 5 != 0]
    if len(lo) != 8 or len(ex) != 5:
        raise Refused("PREMISE_REFUSED")
    return label, list(speeds), work.q(Fraction(num, den)), lo, ex


def catalogue(work):
    universes = []
    # q here is one of TWO sealed catalogue types, never caller q/g/speed.
    for q, modulus, units in ((2, 10, (1,3,7,9)), (3, 15, (1,2,4,7,8,11,13,14))):
        masks = set()
        for coefficient in units:
            work.charge(2*modulus.bit_length()**2)
            inverse = pow(coefficient, -1, modulus)
            for start in range(modulus):
                residues = {(inverse*(start+j)) % modulus for j in range(q)}
                work.charge(30+q)
                masks.add(tuple(ell for ell in range(30) if ell % modulus in residues))
        universes.append(sorted(masks))
    q2, q3 = universes
    covers = []
    for a in combinations(range(5), 2):
        support = set(a)
        ids2 = [i for i, mask in enumerate(q2) if {ell % 5 for ell in mask} == support]
        ids3 = [i for i, mask in enumerate(q3) if {ell % 5 for ell in mask} == set(range(5))-support]
        work.charge(80*6)
        if len(ids2) != 2 or len(ids3) != 6:
            raise Refused("INVARIANT_REFUSED")
        for triple in combinations(ids3, 3):
            rows = [q2[i] for i in ids2]+[q3[i] for i in triple]
            union = {ell for mask in rows for ell in mask}
            work.charge(60)
            if len(union) == 30:
                covers.append(ids2+list(triple))
    covers.sort()
    if (len(q2), len(q3), len(covers)) != (20,60,20):
        raise Refused("INVARIANT_REFUSED")
    return {"q2Masks": [list(x) for x in q2], "q3Masks": [list(x) for x in q3],
            "signatureColumns": ["q2Id0","q2Id1","q3Id0","q3Id1","q3Id2"], "signatures": covers,
            "idSemantics": "ZERO_BASED; each mask sorted physical ell; universes and signatures lex-sorted; ids within each type ascending",
            "absoluteSpeedReduction": False}


def matrix(speeds, H, base, work):
    base = work.q(base)
    period = 30*H
    work.charge(max(base.denominator.bit_length(), period.bit_length())**2)
    D = base.denominator//gcd(base.denominator, period)*period
    if D.bit_length() > 256:
        raise Refused("COMPONENT_REFUSED")
    numerators = []
    for ell in range(30):
        time_num = base.numerator*(D//base.denominator)+ell*(D//period)
        row = []
        for v in speeds:
            residue = v*time_num % D
            row.append(min(residue, D-residue))
            work.charge(4)
        numerators.append(row)
    return {"baseTime": wire(base), "matrixDenominator": str(D), "distanceNumerators": numerators,
            "goodIndices": [ell for ell in range(30) if all(14*n >= D for n in numerators[ell])]}


def classify(grid, speeds, ex, H, cat, work):
    D = int(grid["matrixDenominator"])
    masks = [[ell for ell in range(30) if 14*grid["distanceNumerators"][ell][i] < D] for i in ex]
    q_values = [6//gcd(speeds[i]//H, 6) for i in ex]
    rows = []
    for i, q, mask in zip(ex, q_values, masks):
        parity = [[sum(ell % 5 == a and ell % 2 == b for ell in mask) for b in range(2)] for a in range(5)]
        ternary = [[sum(ell % 5 == a and ell % 3 == c for ell in mask) for c in range(3)] for a in range(5)]
        rows.append([i,q,mask,sorted({ell % 5 for ell in mask}),parity,ternary])
    multiplicity = [sum(ell in mask for mask in masks) for ell in range(30)]
    union = [ell for ell in range(30) if multiplicity[ell]]
    full = len(union) == 30
    saturated = all(len(mask) == 6 for mask in masks)
    disjoint = all(x <= 1 for x in multiplicity)
    counts = [q_values.count(q) for q in (1,2,3,6)]
    ids2, ids3 = [], []
    for q, mask in zip(q_values, masks):
        if q in (2,3) and len(mask) == 6:
            table = cat["q2Masks" if q == 2 else "q3Masks"]
            if mask not in table:
                raise Refused("INVARIANT_REFUSED")
            (ids2 if q == 2 else ids3).append(table.index(mask))
    signature = sorted(ids2)+sorted(ids3)
    signature_id = cat["signatures"].index(signature) if len(ids2) == 2 and len(ids3) == 3 and signature in cat["signatures"] else None
    rigid = saturated and disjoint and counts == [0,2,3,0] and signature_id is not None
    if full != rigid or any(len(mask) > (5 if q == 6 else 6) for q,mask in zip(q_values,masks)):
        raise Refused("INVARIANT_REFUSED")
    work.charge(5*30*26)
    return {"maskRows": rows, "badUnion": union, "badMultiplicity": multiplicity,
            "typeCountOrder": [1,2,3,6], "typeCounts": counts, "saturated": saturated,
            "pairwiseDisjoint": disjoint, "fullCoverage": full, "rigidShape": rigid,
            "q2MaskIds": sorted(ids2), "q3MaskIds": sorted(ids3), "coverSignatureId": signature_id}


def candidate(i, v, H, g, star, A, B, radius, work):
    work.charge(40**2)
    h, rho = gcd(v,g), work.q(5*ETA)
    q = g//h
    alpha = work.q(5*v*star)
    r = work.q(max(Fraction(0),rho-Fraction(q-1,2*q)))
    y = work.q(q*alpha-Fraction(q+1,2))
    floor = y.numerator//y.denominator
    z = floor if y-floor <= Fraction(1,2) else floor+1
    s = work.q(y-z)
    beta = work.q(abs(s)/q)
    D = work.q(max(Fraction(0),r-beta)/(5*v))
    already = D == 0
    left, right = Fraction(0), Fraction(0)
    if not already:
        if not r > 0 or abs(s) >= q*r:
            raise Refused("INVARIANT_REFUSED")
        left, right = work.q(-(r+s/q)/(5*v)), work.q((r-s/q)/(5*v))
        if not left < 0 < right or min(abs(left),right) != D:
            raise Refused("INVARIANT_REFUSED")
    return [i,v,v//H,h,q,wire(alpha),wire(r),wire(y),z,wire(s),wire(beta),wire(D),
            wire(left),wire(right),A <= star+left <= B,A <= star+right <= B,D <= radius,already]


def final_witness(grid, speeds, H, work):
    if not grid["goodIndices"]:
        raise Refused("INVARIANT_REFUSED")
    ell = grid["goodIndices"][0]
    base = Fraction(*map(int,grid["baseTime"]))
    D = int(grid["matrixDenominator"])
    distances = [work.q(Fraction(n,D)) for n in grid["distanceNumerators"][ell]]
    if min(distances) < ETA:
        raise Refused("INVARIANT_REFUSED")
    return {"lowestPhysicalEll": ell, "time": wire(work.q(base+Fraction(ell,30*H))),
            "coordinateDistances": [wire(x) for x in distances], "minimumDistance": wire(min(distances))}


def select_boundary(rows, work):
    options = []
    for row in rows:
        for side, column, gate in (("LEFT",12,14),("RIGHT",13,15)):
            if row[gate]:
                delta = work.q(Fraction(*map(int,row[column])))
                options.append((abs(delta),delta,row[0],0 if side == "LEFT" else 1,side))
    work.charge(10)
    return min(options) if options else None


def _derive_certificate(raw, work, cat):
    label, speeds, tau, lo, ex = parse_input(raw, work)
    work.charge(21*40**2)
    H, g = reduce(gcd,speeds), reduce(gcd,[speeds[i]//5 for i in lo])
    if g != 6*H or gcd(H,5) != 1:
        raise Refused("PREMISE_REFUSED")
    star = work.q(tau/5)
    bands = []
    for i in lo:
        phase = work.q(speeds[i]*star)
        k = phase.numerator//phase.denominator
        dist = norm(phase,work)
        if dist < ETA:
            raise Refused("LOWER_WITNESS_REFUSED")
        left, right = work.q((k+ETA)/speeds[i]), work.q((k+1-ETA)/speeds[i])
        bands.append((i,k,left,right,dist))
    A, B = max(x[2] for x in bands), min(x[3] for x in bands)
    active_left = min(x[0] for x in bands if x[2] == A)
    active_right = min(x[0] for x in bands if x[3] == B)
    L, U = min(x[4] for x in bands), max(speeds[i] for i in lo)
    radius = work.q((L-ETA)/U)
    if not A <= star-radius <= star <= star+radius <= B:
        raise Refused("INVARIANT_REFUSED")
    rows = [candidate(i,speeds[i],H,g,star,A,B,radius,work) for i in ex]
    original = matrix(speeds,H,star,work)
    original["coverage"] = classify(original,speeds,ex,H,cat,work)
    adjusted, final, chosen, delta, base, reference = None,None,None,None,None,None
    status = "UNKNOWN_COMPONENT_EXHAUSTED"
    if original["goodIndices"]:
        status, delta, base, reference = "CHECKED_ORIGINAL_ORBIT", Fraction(0), star, "originalGrid"
        final = final_witness(original,speeds,H,work)
    else:
        if any(row[17] for row in rows):
            raise Refused("INVARIANT_REFUSED")
        selected = select_boundary(rows,work)
        if selected is not None:
            _,delta,index,_,side = selected
            base = work.q(star+delta)
            if not A <= base <= B or any(norm(work.q(speeds[i]*base),work) < ETA for i in lo):
                raise Refused("INVARIANT_REFUSED")
            chosen = {"coordinateLabel": index, "side": side, "delta": wire(delta)}
            adjusted = matrix(speeds,H,base,work)
            adjusted["coverage"] = classify(adjusted,speeds,ex,H,cat,work)
            final = final_witness(adjusted,speeds,H,work)
            status, reference = "CHECKED_COMPONENT_BOUNDARY", "adjustedGrid"
    context = {"movingCount":13,"totalCount":14,"eta":wire(ETA),"d":5,"speeds":speeds,
               "coordinateLabels":list(range(13)),"divisibleIndices":lo,"exceptionIndices":ex,
               "tau":wire(tau),"tStar":wire(star),"H":H,"g":g,"gPrime":6,"L":wire(L),"U":U,
               "oldRadius":wire(radius),"bandColumns":list(BAND_COLUMNS),
               "bandRows":[[i,k,wire(a),wire(b),wire(d)] for i,k,a,b,d in bands],
               "componentLeft":wire(A),"componentRight":wire(B),"activeLeftLabel":active_left,
               "activeRightLabel":active_right,"candidateColumns":list(CANDIDATE_COLUMNS),"candidateRows":rows,
               "maskColumns":list(MASK_COLUMNS),"chosenBoundary":chosen,
               "chosenDelta":wire(delta) if delta is not None else None,
               "chosenBase":wire(base) if base is not None else None,"finalMatrixRef":reference}
    return {"label":label,"status":status,"context":context,"originalGrid":original,
            "adjustedGrid":adjusted,"finalWitness":final,"catalogue":cat,"matrixSchema":dict(MATRIX_SCHEMA),"scope":dict(SCOPE)}


def bounded_json(value, work):
    size = 0
    def add(amount):
        nonlocal size
        size += amount
        if size+1 > MAX_BYTES:
            raise Refused("OUTPUT_REFUSED")
    def visit(item, depth=0):
        work.charge()
        if depth > 12:
            raise Refused("OUTPUT_REFUSED")
        if type(item) is dict:
            if len(item) > 40 or any(type(k) is not str for k in item):
                raise Refused("OUTPUT_REFUSED")
            add(2+max(0,len(item)-1)+len(item))
            for k,v in item.items():
                if len(k)>256:raise Refused("OUTPUT_REFUSED")
                add(len(json.dumps(k,ensure_ascii=True)));visit(v,depth+1)
        elif type(item) is list:
            if len(item)>60:raise Refused("OUTPUT_REFUSED")
            add(2+max(0,len(item)-1))
            for v in item:visit(v,depth+1)
        elif type(item) is float:
            if not isfinite(item) or abs(item)>MAX_MS:raise Refused("OUTPUT_REFUSED")
            add(len(json.dumps(item,allow_nan=False)))
        elif type(item) not in (str,int,bool,type(None)):
            raise Refused("OUTPUT_REFUSED")
        elif type(item) is str:
            if len(item)>256:raise Refused("OUTPUT_REFUSED")
            add(len(json.dumps(item,ensure_ascii=True)))
        elif type(item) is int:
            if abs(item).bit_length()>256:raise Refused("OUTPUT_REFUSED")
            add(len(str(item)))
        elif type(item) is bool:add(4 if item else 5)
        else:add(4)
    visit(value);work.charge(size)
    encoded=json.dumps(value,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False)
    if len(encoded.encode("ascii"))!=size:raise Refused("OUTPUT_REFUSED")
    return encoded


def derive_certificate(raw, limits=None):
    work=Work(limits);cat=catalogue(work);result=_derive_certificate(raw,work,cat)
    bounded_json(result,work)
    return result


def fixed_inputs():
    lower=[7170+30*i for i in range(8)]
    E=[4989,54999,86656,19996,53326]
    return [
        {"label":"component_right_upgrade","speeds":lower+E,"tau":["5","100003"]},
        {"label":"direct_secondary_observation","speeds":lower+[4989,54999,86656,19996,53332],"tau":["5","100003"]},
        {"label":"component_exhausted","speeds":[7170,7200,7230,7260,7290,7320,7350,92850]+E,"tau":["5","100003"]},
    ]


def _build_fixed_payload(limits=None):
    work=Work(limits);cat=catalogue(work);cases=[_derive_certificate(raw,work,cat) for raw in fixed_inputs()]
    grids=[c[key] for c in cases for key in ("originalGrid","adjustedGrid") if c[key] is not None]
    counts={"cases":len(cases),"accepted":sum(c["finalWitness"] is not None for c in cases),
            "positiveMoves":sum(c["adjustedGrid"] is not None for c in cases),
            "originalMatrices":sum(c["originalGrid"] is not None for c in cases),
            "adjustedMatrices":sum(c["adjustedGrid"] is not None for c in cases),
            "matrixCoordinates":sum(sum(map(len,grid["distanceNumerators"])) for grid in grids),
            "lowerDistances":sum(len(c["context"]["bandRows"]) for c in cases),
            "candidateRows":sum(len(c["context"]["candidateRows"]) for c in cases),
            "finalDistances":sum(len(c["finalWitness"]["coordinateDistances"]) for c in cases if c["finalWitness"] is not None),
            "q2Masks":len(cat["q2Masks"]),"q3Masks":len(cat["q3Masks"]),"coverSignatures":len(cat["signatures"])}
    work.charge(1560+24+15+26)
    if counts!={"cases":3,"accepted":2,"positiveMoves":1,"originalMatrices":3,"adjustedMatrices":1,
                "matrixCoordinates":1560,"lowerDistances":24,"candidateRows":15,"finalDistances":26,
                "q2Masks":20,"q3Masks":60,"coverSignatures":20}:
        raise Refused("INVARIANT_REFUSED")
    # Fixed report deduplicates definitions only, with explicit exact refs.
    for c in cases:
        for key in ("catalogue","matrixSchema","scope"):
            del c[key];c[key+"Ref"]="body."+key
        for key in ("bandColumns","candidateColumns","maskColumns"):
            del c["context"][key];c["context"][key+"Ref"]="body."+key
    body={"version":"LRC_CRITICAL_COMPONENT_V1","cases":cases,"catalogue":cat,"matrixSchema":dict(MATRIX_SCHEMA),
          "scope":dict(SCOPE),"candidateColumns":list(CANDIDATE_COLUMNS),"bandColumns":list(BAND_COLUMNS),
          "maskColumns":list(MASK_COLUMNS),"counts":counts}
    canonical=bounded_json(body,work)
    report={**body,"semanticDigest":sha256(canonical.encode("ascii")).hexdigest(),"metrics":{}}
    bounded_json(report,work);work.charge(MAX_BYTES+4096)
    report["metrics"]={"chargedOperations":work.operations,"elapsedMs":round((monotonic()-work.start)*1000,6)}
    encoded=json.dumps(report,sort_keys=True,separators=(",",":"),ensure_ascii=True,allow_nan=False)
    if len(encoded.encode("ascii"))+1>MAX_BYTES or monotonic()>=work.deadline:raise Refused("RESOURCE_REFUSED")
    return report,encoded,work.deadline


def build_fixed_report(limits=None):
    return _build_fixed_payload(limits)[0]


def main():
    if len(sys.argv)!=1 or any(os.environ.get(f)!="false" for f in FLAGS):raise Refused("CLI_REFUSED")
    _,encoded,deadline=_build_fixed_payload()
    if monotonic()>=deadline:raise Refused("RESOURCE_REFUSED")
    sys.stdout.write(encoded+"\n")


if __name__=="__main__":
    try:main()
    except Refused as error:
        sys.stderr.write(str(error)+"\n");sys.exit(1)
