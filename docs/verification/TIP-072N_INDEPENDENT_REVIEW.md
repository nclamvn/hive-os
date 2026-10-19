# TIP-072N — independent mathematical and consequential review

Date: 2026-10-05. Status: **PASS within the bounded offline structural-method
scope**. No remaining P0/P1 was found in the final written argument and frozen
diagnostics. Main owns whole-project QA, preservation and final acceptance.
This report does not certify formal proof, literature novelty, global LRC14/15,
production authority, or an actual agent/M1 run.

## Reviewed contract and independence

Read the complete original TIP, pair-correlation addendum, final dossier, Core,
Python, audit CLI, both test selectors and both completion reports. Vibecode Kit
guided separate mathematical challenge, frozen-byte inspection and executable
fault tests. Only this new reviewer report was created; no peer file was edited.
No DB/session, provider/model/API, browser, private capture, campaign, worker,
environment file, Git, billing or deployment operation was performed. All six
execution flags were OFF in executable checks.

The source-derived common-divisor mechanism is contextualized in the
[Allikvere source](https://arxiv.org/html/2609.02604v2#S4.SS4), not independently
accepted as a global theorem here. The new pair criterion is a structural
corollary new to the reviewed program artifacts, not a priority claim.

## Independent all-real proof review

The final theorem is sound: for positive integer speeds `q,2q,v` with
`3` not dividing `q*v`, every real base time admits a common `j/3` shift giving
all three distances at least `1/9`.

Normalize `x` to `[0,1/3]`. Intersect the three affine ranges with the **open**
BAD intervals around integers. The first coordinate's bad set is `{0}` when
`x<1/9`, empty on `[1/9,2/9]`, and `{2}` when `x>2/9`. The doubled coordinate
is bad at shift 0 for `x<1/18`, shift 1 for `1/9<x<2/9`, and shift 2 for
`x>5/18`. Thus the pair's BAD union is exactly:

| x in the normalized closed domain | pair BAD union |
|---|---|
| `[0,1/9)` | `{0}` |
| `1/9` | empty |
| `(1/9,2/9)` | `{1}` |
| `2/9` | empty |
| `(2/9,1/3]` | `{2}` |

These are interval identities for all real phases, not an inference from rational
samples. Equality is GOOD. For actual time, `m=floor(3*q*t0)` and
`x=q*t0-m/3`. The bijection `j -> m+q*j mod3` transports the pair's union to
physical shifts, including negative real base times. The arbitrary third unit
speed has a rotated three-point grid; an open BAD arc of length `2/9<1/3`
contains at most one point, including wrapping arcs. At most two physical shifts
are forbidden in total.

Sharpness is attained, not numerically inferred: with `q=1,v=4,t0=1/9`, each of
the three shift minima is exactly `1/9`. Multiplying the speeds by any unit q
and dividing that base time by q permutes the three shifts. This proves the
best **uniform discrete base-time** bound for the family, not a fixed speed
tuple's optimum over all real times.

Three independent phases with residues `[1,2,1]` and phases `[0,1/3,1/3]`
give zero minimum on every shift. They lack the exact doubled-phase relation.
The new result therefore genuinely covers the `e=d=3` structural family beyond
the earlier independent-phase `e<d` guarantee; it is not another old grid sweep.

## Conditional lift and constructive coordinates

For k moving speeds, exactly three exceptions `q,2q,v`, and divisible speeds
`3*w_i`, the required lower witness satisfies
`||tau*w_i|| >= 1/(k-2)`. Set `t0=tau/3`; every physical shift preserves those
coordinates. The pair theorem then gives margin
`min(1/(k-2),1/9)` on all k moving coordinates. Removing and reinstating repeated
lower speeds does not weaken this bound.

| moving / total runners | required lower witness | guaranteed margin | target |
|---|---|---|---|
| 13 / 14 | LRC(10), margin 1/11 | 1/11 | 1/14 |
| 14 / 15 | LRC(11), margin 1/12 | 1/12 | 1/15 |

The independent reviewer used isolated stdlib `Fraction` scratch arithmetic,
without importing peer arithmetic, to recompute **all 26 fixed positive tuples
and all 351 coordinates**. Every minimum is exactly its listed gamma. Twenty
harmonic fixtures retain the deterministic segment selector; the six arbitrary
third fixtures select the lowest actual physical good shift. Their explicit
`tau=1/(k-2)` needs no missing lower witness for these particular examples.
The general class conclusion remains conditional on its lower witness.

Carry is mathematically necessary: `j=qInverse*(h-m) mod3`. In k13/q14/v56,
`t0=1/33,x=1/11,m=1,inverse=2,h=1`, so correct j0 works. Omitting m gives j2,
time `23/33`, and speed56 distance `1/33<1/9`. During review the dossier's
earlier k14/q13 failure example was found incorrect: its omitted-carry choice
still passes. Main replaced it with the genuinely failing example before final
freeze. No claim remains that every carry omission fails every tuple.

## Negative controls checked independently

Four exact 14-speed tuples at base time `1/2`, using odd reduced divisible
speeds, attain the previous sharp exception thresholds despite common-time
correlation. Their lower coordinates are exactly `1/2`:

| d/e | exception speeds | all-14 minima across physical shifts |
|---|---|---|
| 3/2 | 1,2 | 0, 1/6, 1/6 |
| 5/2 | 1,4 | 0, 1/5, 1/10, 1/10, 1/5 |
| 5/3 | 1,2,3 | 0, 1/10, 1/10, 1/10, 1/10 |
| 5/4 | 1,2,3,4 | 0, 1/10, 1/10, 1/10, 1/10 |

Thus correlation alone does not promise a strict improvement of the old bound.
This does not prohibit changing the base time or improving global loneliness.

The residue alias `(1,5,4)` at `t0=1/15`, with the retained 11 divisible speeds,
has lower minimum `1/5` and full shift minima `[1/15,0,1/15]`. Its residue pattern
matches `(1,2,4)` but it has no exact doubled pair. A residue-only gate is false;
the fixture is not a global LRC counterexample. Historical false two-survivor
predicates and global conclusions were not revived.

## Final executable and adversarial evidence

Independently reviewed all three closed proof segments/all nine affine ranges;
raw intercept is `c*h/3`, and the separately retained floor must be subtracted.
Recomputed the complete fixed-kernel critical partition: ten distinct boundaries,
ten point cells and nine open cells, including both endpoints. All 19 cell pair
unions match the all-real interval formula. Continuity justifies predicate
constancy between roots; representative tests alone are not universal proof.

Final independently run selector, all six flags OFF:

`node node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-correlated-triple.test.ts tests/unit/math-lrc-correlated-triple-replay.test.ts --maxWorkers=1 --no-file-parallelism`

**227/227 PASS**, 2 files, 0 failures, exit 0; start 08:07:27 local,
duration 2.53s. Prior checks are not added to that count. Positive tests invoke
fresh actual Python; process/source mocks are negative fault injection only.

Separately ran the frozen actual audit: MATCH, **66.647542ms / 93807** outer
charged operations, Core **55426**, Python **6962**, process wall 44.700875ms.
Full audit JSON was **32052 bytes**, below 32768. A separate raw process executed
the inspected pinned Python source with `-I -S -B -c`, minimal environment,
`shell:false` and bounded IO/timeout: ACCEPTED, **7.759333ms / 6962** operations,
31580-byte stdout. Its complete evidence was admitted by fresh Core reconstruction.
Both processes and Core agreed on semantic digest:

`6190bc46a5d21e202acbdb4cce24cafc5ebba17434d648aa652f2514ac7e8312`.

Independently mutated twelve actual-Python reports and recomputed correct hashes:
legend meaning, pair union, endpoint, missing fixture, carry, arbitrary-third
selector, raw affine intercept, residue-alias promotion, total count, lower
assumption, global promotion and sharp threshold. All refused with null evidence.
A thirteenth inherited array `toJSON` control also refused with **zero invocations**.
The frozen selectors additionally cover resource/process/source drift, malformed
and oversized actual stdin, duplicate keys, late completion, shared operation
exhaustion, hostile passive data and coherent full-report corruption.

Initial verbose labels left an oversized outer audit; this was not accepted.
Main approved lossless fixed legends and numeric references for three repeated
label groups. Review verified every legend/reference and all 19 cells, 26 tuples,
351 coordinates, negatives, ranges and scope remained present. No cap was raised.
The earlier intercept mismatch was resolved to raw affine meaning before freeze.
Core imports no old arithmetic, Python independently derives Fraction content,
and the CLI compares complete canonical evidence, not merely hashes/verdicts.

## Coverage, remaining boundaries and exact pins

N1–N5: PASS in the reviewed mathematical/offline scope. N6: independent frozen
review PASS; whole types/lint/build/regression/preservation/final acceptance remain
Main-owned, not inferred from this focused run. No UI/browser E2E was claimed.

Local byte/process consistency is not signed runtime, host, agent or production
closure attestation. Timings are observations; Core/Python counters differ by
accounting model. Cooperative caps do not attest a malicious host. General lower
LRC proofs, literature priority, formal verification, global LRC14/15, production
072B atomic binding, authorized durable replay, exact G2 and actual M1 remain
unestablished here. No scientific case or retained agent result was minted.

| frozen artifact | SHA-256 |
|---|---|
| original TIP | `2b09ea0e182f18578190c30696cdb8ba9e860558acc1aef1f314b1709c9f3c70` |
| pair addendum | `aa4798b16bfa886a05138094278fdea9ec00a6e46c64f4de3156e0c9a1276ba1` |
| mathematical dossier | `65e0b48279de467567b396f5f0b4caac6d29fcaf7ed8d41b25179a9308a944df` |
| Core | `7bb711c11ad4c85ccb2c14521ac098669fe48f6ddc4a40ca5f6775108eed5b6e` |
| Core tests | `27b5e00179859ce841a5ee69a3feafab0a2e25f4e6cc4fed5fda5c1ad9b510a7` |
| Python | `8455b779eacea07de66e8af90b32e76b3f44368b5c5a62c25f7abb69795bb282` |
| audit CLI | `cfbcdeb12b90ba998496b66aa68ecd2d21f18e11696cac299088ef5e56973092` |
| replay tests | `471220bdf48c45363adb2ec9e87b894b283e601b37ce4410b80569d0a7400e08` |
| Core completion | `6f2d3b76bae31071abb567e0a3f5b5bed73c858c7f3334f5a42e91225f3b6fda` |
| Replay completion | `1b4adaf3eae40c6f137ecd2ac6e84980207938afc856d69cd2c4731cbc5857e6` |
