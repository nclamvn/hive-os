# TIP-044 independent finite replay completion report

STATUS: DONE within the independent finite-replay scope. Builder B, 2026-10-03.
Only this report is owned/changed. No product source or test files were added.
Contract SHA256: `2e7bd3aba80bcc5a9bc3e747f4cf8b85be25aad22c4cc42e71ec8036349896c7`.

The following exact source is independently written stdlib Python. It imports
no repository modules, primary producer, retained decisions or factor inputs.
The body includes its terminating LF. Extract and replay with:

```sh
awk '/^```python$/{inside=1;next} inside && /^```$/{exit} inside{print}' docs/verification/TIP-044_REPLAY_COMPLETION_REPORT.md | shasum -a 256
awk '/^```python$/{inside=1;next} inside && /^```$/{exit} inside{print}' docs/verification/TIP-044_REPLAY_COMPLETION_REPORT.md | env -i PATH=/usr/bin:/bin python3 -I -S -B
```

```python
import hashlib
import json
import math
import time

START = time.monotonic()
MAX_WORK = 5_000_000
MAX_SECONDS = 60
MAX_BYTES = 65_536
WORK = 0


def step(count=1):
    global WORK
    if not isinstance(count, int) or count <= 0:
        raise ValueError("invalid logical work")
    if time.monotonic() - START >= MAX_SECONDS:
        raise RuntimeError("TIME_LIMIT")
    if count > MAX_WORK - WORK:
        raise RuntimeError("WORK_LIMIT")
    WORK += count


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def digest(value):
    return hashlib.sha256(canonical(value).encode("ascii")).hexdigest()


def prime(n):
    step()
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    d = 3
    while d * d <= n:
        step()
        if n % d == 0:
            return False
        d += 2
    return True


def power(a, e, modulus):
    result = 1
    a %= modulus
    while e:
        step()
        if e & 1:
            result = result * a % modulus
        a = a * a % modulus
        e //= 2
    return result


def character(a, p):
    z = power(a, (p - 1) // 2, p)
    return -1 if z == p - 1 else (0 if z == 0 else 1)


def least_nonresidue(p):
    for n in range(1, p):
        step()
        if character(n, p) == -1:
            return n
    raise AssertionError("no nonresidue")


def factor(n):
    out = []
    q = 2
    while q * q <= n:
        step()
        e = 0
        while n % q == 0:
            step()
            n //= q
            e += 1
        if e:
            out.append([q, e])
        q = 3 if q == 2 else q + 2
    if n > 1:
        out.append([n, 1])
    return out


def valuation(n, q):
    result = 0
    while n % q == 0:
        step()
        result += 1
        n //= q
    return result


def divisors(n):
    out = [1]
    for q, e in factor(n):
        old = out[:]
        for j in range(1, e + 1):
            for d in old:
                step()
                out.append(d * q ** j)
    return sorted(out)


def order(a, modulus):
    x = 1
    for j in range(1, modulus):
        step()
        x = x * a % modulus
        if x == 1:
            return j
    raise AssertionError("order not found")


def signed_image(q, e, h):
    inverse = power(q, h - 2, h)
    values = set()
    for j in range(-e, e + 1):
        step()
        values.add(power(q if j >= 0 else inverse, abs(j), h))
    return sorted(values)


def strict_identity(p, triple, p_count):
    step(8)
    x, y, z = sorted(triple)
    assert 0 < x < y < z
    assert 4 * x * y * z == p * (x * y + x * z + y * z)
    assert sum(d % p == 0 for d in (x, y, z)) == p_count
    return [x, y, z]


def type_i(p, h, T):
    hits = []
    ds = divisors(T)
    for a in ds:
        for d in ds:
            step()
            if T % (a * d) or (4 * a * a * d + 1) % h:
                continue
            c = T // (a * d)
            v = (4 * a * a * d + 1) // h
            b = c * v - a
            assert b == (p * a + c) // h and (p * a + c) % h == 0
            assert b > 0 and a * b * d * p > b * c * d > T
            hits.append({"a": a, "d": d, "c": c, "v": v, "b": b,
                         "triple": strict_identity(p, [T, b * c * d, a * b * d * p], 1)})
    return hits


def type_ii(p, h, T):
    hits = []
    ds = divisors(T)
    for u in ds:
        for v in ds:
            step()
            if u > v or math.gcd(u, v) != 1 or T % (u * v) or (u + v) % h:
                continue
            k, A = T // (u * v), (u + v) // h
            hits.append({"u": u, "v": v, "k": k, "A": A,
                         "triple": strict_identity(p, [T, A * p * u * k, A * p * v * k], 2)})
    return hits


def run():
    progressions = []
    for start, modulus in [(2521, 9240), (41161, 101640)]:
        prime_rows = []
        for t in range(101):
            step()
            p = start + modulus * t
            if not prime(p):
                continue
            assert p % 840 == 1
            assert p % 11 == (2 if modulus == 9240 else 10)
            assert least_nonresidue(p) == 11
            row = {"t": t, "p": p, "leastNonresidue": 11}
            if modulus == 101640:
                h = (-p) % 44
                while not prime(h):
                    step()
                    h += 44
                T = (p + h) // 4
                assert h == 23 and valuation(T, 11) == 1
                image = signed_image(11, 1, h)
                assert image == [1, 11, 21] and h - 1 not in image
                row.update({"h": h, "T": T, "v11": 1, "image": image})
            prime_rows.append(row)
        progressions.append({"start": start, "modulus": modulus, "integerCount": 101,
                             "primeCount": len(prime_rows), "primeRows": prime_rows})

    order_rows = []
    for h in range(3, 128):
        step()
        if h == 11 or h % 4 != 3 or not prime(h):
            continue
        o = order(11, h)
        chi = character(11, h)
        compatible = h % 11 == 9
        if compatible:
            assert chi == -1 and o % 4 == 2
        for e in range(1, 5):
            image = signed_image(11, e, h)
            hit = h - 1 in image
            assert hit == (o % 2 == 0 and e >= o // 2)
            assert not (compatible and hit)
            order_rows.append({"h": h, "budget": e, "order": o, "character": chi,
                               "compatible": compatible, "image": image, "hit": hit})

    controls = []
    expected = {(13, 7): (True, False), (61, 7): (False, False),
                (157, 7): (False, True)}
    required = {(13, 7): [5, 10, 130], (157, 7): [41, 942, 38622],
                (401, 31): [108, 1604, 10827],
                (2521, 31): [638, 55462, 804199]}
    for p, h in [(13, 7), (61, 7), (157, 7), (401, 31), (2521, 31)]:
        assert prime(p) and prime(h) and h < p and (p + h) % 4 == 0
        T = (p + h) // 4
        one, two = type_i(p, h, T), type_ii(p, h, T)
        if (p, h) in expected:
            assert (bool(one), bool(two)) == expected[(p, h)]
        if (p, h) in required:
            assert required[(p, h)] in [hit["triple"] for hit in one + two]
        row = {"p": p, "h": h, "T": T, "factors": factor(T),
               "typeI": one, "typeII": two}
        if p == 401:
            assert order(3, 31) == 30
            image = signed_image(3, 3, 31)
            split = signed_image(2, 2, 31)
            assert image == sorted(image) and 30 not in image
            assert split == [1, 2, 4, 8, 16]
            d, x = 0, 1
            while True:
                step()
                d += 1
                x = x * 3 % 31
                if x in split:
                    break
            assert d == 6 and power(3, 3, 31) == 27
            assert power(4, 29, 31) == 8 and 8 * 27 % 31 == 30
            row["paidQuotient"] = {"single3Image": image, "full3Order": 30,
                                    "paidSplitImage": split, "quotientOrder": d,
                                    "u": 4, "v": 27}
        if p == 2521:
            assert any(w["u"] == 2 and w["v"] == 29 and w["k"] == 11 for w in two)
            row["allocated11Image"] = signed_image(11, 1, 31)
            assert 30 not in row["allocated11Image"]
        controls.append(row)

    return {"progressions": progressions, "orderRows": order_rows, "controls": controls,
            "analyticExponents": {"e1": "0.832", "e2": "1.664", "e3": "2.496", "e4": "3.328"}}


try:
    science = run()
    step()
    result = {"status": "COMPLETE", "scientific": science,
              "scientificDigest": digest(science),
              "limits": {"seconds": MAX_SECONDS, "work": MAX_WORK, "outputBytes": MAX_BYTES},
              "runtime": {"work": WORK, "elapsedMs": 0, "outputBytes": 0}}
    for unused in range(10):
        result["runtime"]["elapsedMs"] = int((time.monotonic() - START) * 1000)
        payload = canonical(result)
        size = len(payload.encode("ascii"))
        if size == result["runtime"]["outputBytes"]:
            break
        result["runtime"]["outputBytes"] = size
    else:
        raise RuntimeError("SERIALIZATION_FIXED_POINT")
    if time.monotonic() - START >= MAX_SECONDS or size > MAX_BYTES:
        raise RuntimeError("FINAL_ENVELOPE_LIMIT")
    print(payload, end="")
except (RuntimeError, AssertionError, ValueError) as error:
    print(canonical({"status": "INCOMPLETE", "error": str(error), "work": WORK}))
    raise SystemExit(1)
```

## Actual final replay and agreement

Final extracted source SHA256:
`c1d33f1fbed52bb8a33df3de4fd8322100bcc07b82b1a7dde51bfc9a2876e6e8`.
Actual isolated command above exited 0, `COMPLETE`, logical work 81,191,
observed internal elapsed 30ms and exactly 11,608 stdout bytes, without a
terminating newline. Frozen caps are 60 seconds, 5,000,000 logical work and
65,536 output bytes. Scientific SHA256, excluding runtime:
`96538c53b9584bfbc31b4353212074f8ae9d6b6baf3fb53d787a975469e01354`.
An earlier corrected execution observed 29ms with identical scientific content.
The environment emitted a macOS `confstr()` temporary-directory warning on
stderr; arithmetic and exit status were unaffected. No tool installation.

Trial division classified every one of the 202 registered integers: first
progression 36 primes / 65 composites, second 31 primes / 70 composites.
All 67 prime roots have least positive quadratic nonresidue exactly 11.
Only prime roots receive this assertion; composites are not silently admitted.
All 31 prime roots in the second progression have least progression prime
h=23, exact v11(T)=1, image [1,11,21], which omits 22.

Canonical ascending prime lists:

```json
{"start2521":[2521,21001,30241,76441,104161,141121,196561,252001,261241,298201,316681,325921,335161,353641,372121,409081,418321,436801,446041,464521,473761,547681,566161,575401,630841,649321,667801,677041,704761,741721,750961,778681,797161,843361,908041,917281],"start41161":[41161,1057561,1159201,1260841,1667401,1769041,2175601,2582161,2887081,2988721,3903481,4005121,4818241,5631361,5733001,6241201,6444481,6647761,6749401,7155961,7460881,7562521,7867441,8070721,8375641,8477281,8985481,9798601,10001881,10103521,10205161]}
```

The 15 allowed primes h are
[3,7,19,23,31,43,47,59,67,71,79,83,103,107,127]. Their exact respective
orders of 11 are [2,3,3,22,30,7,46,58,66,70,39,41,102,53,63].
All 60 h/budget rows checked the full signed image against the independent
order criterion. Four hits occur, all at h=3 with budgets 1,2,3,4. The only
registered h congruent to 9 mod11 is 31; all its four budgets miss. Thus the
finite checks agree with, but do not replace, the infinite arithmetic proof.

Named controls use exhaustive positive divisors of T for the two specified
branches. Counts are allocation counts, not distinct denominator triples.

| p,h,T | Type I allocations | Type II pairs | Required exact tuple |
|---|---:|---:|---|
| 13,7,5 | 1 | 0 | (5,10,130), Type I |
| 61,7,17 | 0 | 0 | Both named branches miss |
| 157,7,41 | 0 | 1 | (41,942,38622), Type II |
| 401,31,108 | 2 | 1 | (108,1604,10827), Type II |
| 2521,31,638 | 1 | 1 | (638,55462,804199), Type II |

Every enumerated tuple, not only the four required tuples, passed positivity,
strict ordering, exact cleared identity `4xyz=p(xy+xz+yz)` and exactly one
or two p-divisible denominators according to branch. At p401, two Type I
allocations give the same tuple (108,1404,281502); no double-solution claim.
At p2521, Type I also gives (638,51997,23833534). These are explicit controls,
not newly discovered open-problem milestones.

For p401, T=2²3³: full order of 3 modulo31 is 30 and the allocated three-copy
image is [1,3,7,9,21,23,27], omitting30. The ACTUAL paid two-copy split image
of 2 is [1,2,4,8,16], of size5; quotient order of3 modulo that paid subgroup
is6. The constructive pair u=4,v=27,k=1,A=1 verifies the tuple. For p2521,
T=2·11·29, the allocated single-11 image [1,11,17] misses30 while
u=2,v=29,k=11,A=1 supplies the exact Type II tuple. These positive controls
prevent incorrect full-shift impossibility or full-order pruning.

A's separate Node arithmetic and Main's independently written Node checks
agree on both exact prime lists, all 60 small-order checks, prime-T taxonomy,
required identities and paid quotient facts. Their differently schematized
whole-record hashes need not equal this Python hash. Counter totals and timing
definitions differ; no equal-work or performance superiority claim.

## Analytic/algebraic scope checked

Exact exponent arithmetic is `(4/25)(26/5)=104/125=0.832`, yielding
0.832,1.664,2.496,3.328 for budgets1..4. Failure of that upper-bound guarantee
at e2 is not nonexistence of small h. The coherent quotient necessity
`q0^(d/2)<=T<p/2` concerns the quotient order, not the full order.

Type I uses disjoint valuation allocation `ad|T`, not independent unrestricted
copies of a and d. With c=T/(ad), the congruence implies
`b=cv-a=(pa+c)/h`, hence integrality; p>h gives b>a, and ap>c gives
`T<bcd<abdp`. Because T,c,d<p and h is prime distinct from p, p divides only
the final denominator. All instantiated identities are independently checked.
For prime T=r and h>3, allowed allocations are (a,d)=(1,1),(1,r),(r,1):
the first would require h|5, the last would require a square=-1 modulo a
prime3mod4. Thus this norm branch hits iff 4r=-1 modh. The coprime Type II
box hits iff r=-1 modh. Simultaneous occurrence would require h|3, excluded.
This is the contract's attributed classical specialization, not a novelty claim.
Actual divisor a still has to pay for an abstract square root.

The no-go concerns ONLY available single-11 signed budgets <=4. An imposed
divisibility `11^e|T` does not cap actual valuation; accidental larger valuation,
other factors, paid quotient correction and the full shift remain outside it.
The two progression classes are distinct: pmod11=2 versus pmod11=10.
No GRH extension, Type I campaign, new shifts, survivor tuning or 180-row
execution occurred here. Root existence, novelty, external/formal review,
agent/UI admission, uncontaminated live-model benchmarking and product E2E
remain deferred. Original Erdős242 is NOT_ESTABLISHED.

## Resource controls and failure history

Three in-memory tighter-envelope injections execute the same extracted source,
changing only one constant before `exec`:

```sh
awk '/^```python$/{inside=1;next} inside && /^```$/{exit} inside{print}' docs/verification/TIP-044_REPLAY_COMPLETION_REPORT.md | env -i PATH=/usr/bin:/bin python3 -I -S -B -c 'import sys; s=sys.stdin.read(); exec(compile(s.replace("MAX_WORK = 5_000_000","MAX_WORK = 1",1),"TIP044_tighter_control","exec"))'
```

For the other two controls, replace the respective string pair with
`"MAX_SECONDS = 60","MAX_SECONDS = 0"` and
`"MAX_BYTES = 65_536","MAX_BYTES = 100"`. Actual outcomes: WORK_LIMIT at
work1, TIME_LIMIT at work0, FINAL_ENVELOPE_LIMIT at work81,191; all exited1
with INCOMPLETE, never COMPLETE. These are fault injections, not new science.
No incomplete run claims an authoritative prefix or completed cohort.

Work charges explicit trial/divisor/image/order/power loop iterations and
bounded identity operations. Native integer arithmetic, gcd, hashing, JSON and
OS writes are not CPU/interpreter-attested operations. Deadline checks occur
in work loops and after final serialization; observed checkpoints are not hard
preemption of arbitrary synchronous work or an OS-write deadline guarantee.
Only successful summaries are retained within the 64KiB envelope; current
actual stdout is 11,608 bytes. Source authentication is a local fingerprint,
not independent-host/model authentication or a formal proof certificate.

Initial source SHA `96bd87ff32c572da3684ee9e4094770e87ddfb60c685c29dea09ed4fb590763b`
mistakenly asserted pmod11=2 for BOTH progression classes. The first execution
failed closed with INCOMPLETE/work23,427/exit1; a traceback pointed directly
to that assertion. Corrected only the second class to pmod11=10, preserving
all registered integers, predicates, caps and outcomes. Corrected intermediate
source SHA `894e77da0af254f191c64dc5006087d93365555367a0cab0c93df3a5c3e601de`
passed; final source additionally suppresses print's LF so the emitted byte count
equals the retained count. Final source/content hashes above reflect these fixes.

## Technical status / preservation

Finite replay requirements completed: both101-integer progressions, all60
h/budget rows, five named controls, exact identities and three fail-closed
resource injections. `git diff --check` on this new report passed. No fresh
typecheck, lint, unit suite, build or browser E2E is claimed by Builder B for
this documentation-only slice. Prior827-test pass is historical. All old
source/test files and unrelated changes were left untouched. Main/S retain
responsibility for whole-contract acceptance, prior-pin verification, primary
source matching and final research/verification/handoff documents.
