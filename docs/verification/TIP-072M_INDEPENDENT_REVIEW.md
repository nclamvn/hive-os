# TIP-072M — independent consequential review

Date: 2026-10-04. Reviewer: independent Store Builder/reviewer.
Status: **PASS for the bounded offline quantitative-method milestone**;
whole-project acceptance remains Main-owned. No remaining P0/P1 was identified
in the reviewed written argument and closed diagnostic implementation. This is
not a production authority, live agent/M1 acceptance, formal proof, global
LRC14/15 proof, or literature novelty certification.

## Scope and method

Read the sealed TIP, final mathematical dossier, frozen Core, Python checker,
CLI, both unit selectors, and both completion reports. Applied Vibecode Kit's
independent Builder review discipline: challenge the mathematics separately from
the executable, inspect final bytes, then execute positive and adversarial
checks. Product files and peer reports were not edited. This review created only
this new file. No DB, provider, model, worker, campaign, browser, private capture
root, environment file, Git, billing, or deployment was accessed for execution.
All six execution flags were OFF for executable checks.

The public source comparison used
[Allikvere, §4.4 Lemma 4.6](https://arxiv.org/html/2609.02604v2).
The small-prime shift/counting method is source-derived; a literature-priority
search or independent acceptance of the complete paper was not performed.

## Mathematical conclusion

For integers `d >= 3`, `2 <= e < d`, define
`r = floor((d-1)/e)` and `delta = r/(2d)`. For independently arbitrary real
phases `alpha_i` and unit residues `a_i` modulo `d`, the sharp uniform exception
shift margin is

`inf_(alpha,a) max_(0 <= j < d) min_i ||alpha_i + a_i*j/d|| = delta`.

This statement, including its attained upper witness, survives the independent
quantifier/endpoint/wrap/unit review:

1. A unit permutes the complete rotated `d`-grid. The BAD set is an **open** arc
   of length `r/d`. After lifting a wrapped arc to the line, `k` consecutive grid
   points have span at least `(k-1)/d` but strictly less than `r/d`; hence
   `k <= r`. This is valid for every real phase, not just rational samples.
2. The union of `e` bad sets has at most `er <= d-1` vertices. At least `d-er`
   common shifts attain distance **at least** `delta`. Equality is GOOD.
3. For the reverse bound take all units equal to one. For zero-indexed `i`, use
   cyclic block `{i(r+1), ..., i(r+1)+r}` and phase
   `-(i(r+1)+r/2)/d` modulo one. Each block's vertices have distance at most
   `delta`; the blocks cover all vertices because `e(r+1) >= d`. Thus on this
   single phase tuple no shift attains a margin strictly larger than `delta`.
   Overlap and duplicate phases do not invalidate the covering argument.

The sharpness concerns independently variable exception phases. It does **not**
prove sharpness of a complete speed tuple, whose phases share one time, and does
not produce a counterexample to any global LRC statement.

### Conditional lift and strict robustness

For 14 positive integer moving speeds, prime `d`, and exactly `e` speeds not
divisible by `d`, assume the required lower witness for LRC(`14-e`). Write the
divisible speeds `d*v_i`; if their witness is `tau`, use `t0 = tau/d`.
Every shift `t0+j/d` preserves their phases. The exception residues are units,
so the all-real result supplies a common shift with margin
`gamma = min(1/(15-e), delta)` on **all 14 moving coordinates**. The stationary
runner convention is therefore 15 total runners, not 14 total runners.

| d | e | r | sharp exception margin | conditional all-14 margin | slack above 1/15 |
|---|---|---|---|---|---|
| 3 | 2 | 1 | 1/6 | 1/13 | 2/195 |
| 5 | 2 | 2 | 1/5 | 1/13 | 2/195 |
| 5 | 3 | 1 | 1/10 | 1/12 | 1/60 |
| 5 | 4 | 1 | 1/10 | 1/11 | 4/165 |

With `U = max(u_i)` and `sigma = gamma-1/15`, the circle-distance function is
1-Lipschitz. Around the constructed witness, every coordinate remains at least
`1/15` for the closed interval `|h| <= sigma/U`. This is a conditional guaranteed
interval, not a maximal interval. It does not manufacture a missing lower
witness. Rational rounding is justified only after an actual witness is known.
The written all-real argument is essential: critical rational representative
checks alone would not discharge the real-phase alignment debt.

### Four explicit witnesses checked independently

An isolated reviewer scratch calculation used Python `Fraction`, not either
product's arithmetic, to check all **56 coordinates**. Each tuple consists of
`d, 2d, ..., (14-e)d` followed by `1, ..., e`.

| d/e | exact time | minimum over all 14 | exception distances |
|---|---|---|---|
| 3/2 | 14/39 | 1/13 | 14/39, 11/39 |
| 5/2 | 14/65 | 1/13 | 14/65, 28/65 |
| 5/3 | 13/60 | 1/12 | 13/60, 13/30, 7/20 |
| 5/4 | 12/55 | 1/11 | 12/55, 24/55, 19/55, 7/55 |

Two coordinates attain the stated minimum in each example. Their lower witness
is explicitly `tau=1/(15-e)`, so these four examples do not need an unconstructed
lower-LRC witness. They are concrete rational witnesses, not proof for every
speed tuple in a class and not synthetic agent receipts.

### Historical status and refutations preserved

The earlier all-real `1/15` BAD-arc/lower-lift reasoning is already present in
`docs/operations/LRC_PROPERNESS_BRIDGE_2026-10-03.md`,
`docs/verification/TIP-052_INDEPENDENT_REVIEW.md`,
`docs/contractor/research-program-v2/CORE_SCOPE_REVIEW_NOTES.md`, and
`src/modules/research-sandbox/math-lrc-method-unit-live.ts`. Repeating that
reasoning is not a discovery. The sharp minimax formulation and the stronger
four margins are new to the reviewed program artifacts: classify them as a
**source-derived quantitative corollary**, not a new theorem in the literature.

The historical false “at least two survivors” assertions remain false in the
3/2 and 5/4 classes. Unit-one phases `[1/30,1/3]` give only shift 1 surviving for
3/2, and `[1/75,1/5,2/5,3/5]` give only shift 1 for 5/4. These examples still
have only one survivor at the corresponding lifted margins. The exhaustive
minimum for 5/3 is two; that class-specific fact cannot be generalized.
Likewise `e*m < d` is the worst-case independent-phase union criterion, not a
necessary condition for a correlated speed tuple to have an LRC witness.

## Independent finite reconstruction and frozen-byte execution

The reviewer's separate Fraction scratch reconstruction enumerated all boundary
and adjacent open cells, including wrap, without importing peer arithmetic:

| d/e | cells | deduplicated aggregate masks | mask tuples | minimum good |
|---|---:|---:|---:|---:|
| 3/2 | 12 | 4 | 16 | 1 |
| 5/2 | 40 | 15 | 225 | 1 |
| 5/3 | 40 | 6 | 216 | 2 |
| 5/4 | 40 | 6 | 1296 | 1 |

Total **132 cells / 1753 tuples**; scratch used 636 distance evaluations.
Each unit has exactly `d` distinct boundaries and `2d` cells. Boundary masks have
size `r-1`; open-cell masks have size `r`. The four sharp phase tuples yield
maximum minimum distance exactly `delta`. In particular the 5/2 distance-sharp
witness has **three** good shifts, not the worst-case minimum count of one.

Final independently run selector:

`node node_modules/vitest/vitest.mjs run --project unit tests/unit/math-lrc-shift-margin.test.ts tests/unit/math-lrc-shift-margin-replay.test.ts --maxWorkers=1 --no-file-parallelism`

All six flags OFF. **156/156 PASS**, 2 files, 0 failures, exit 0; start
23:24:16 local, duration 1.60s. Earlier development runs are not added to this
count. Actual fresh Python processes are part of this selector; mocks are
negative fault injection, not its positive replay basis.

Separately invoked the final actual audit with the one 5000ms/2000000-operation
aggregate allowance. It returned MATCH, 54.215375ms / **80863** charged operations;
Core 8.666583ms / **30852**, Python 5.759458ms / **33867**, actual process wall
40.028167ms. Full audit JSON measured 19524 bytes, below 32768.

A further separate raw Python process executed the freshly read, exact pinned
public checker source using `/opt/homebrew/bin/python3 -I -S -B -c`, `shell:false`,
bounded IO/timeout, and environment `{NODE_ENV:"test"}`. It returned ACCEPTED,
5.952042ms / **33867** operations, 19050-byte stdout. Final Core's fresh full
reconstruction admitted that evidence. All three semantic evidence digests were
identical:

`bc5e0c35ca92175882b6056edf4ddbe13fa169a085cced57edf256fbf88c92ed`.

These measured times are observations, not performance guarantees, and scratch,
Core, Python, and outer charged-operation counters are different metrics.

## Consequential adversarial review

Independently applied nine semantically corrupted **coherently rehashed** reports
from the actual Python result: missing wrap cell, equality marked bad, nonunit,
wrong sharp distance, missing lower-witness assumption, promoted global claim,
false two-survivor minimum, promoted speed-tuple sharpness, and wrong conditional
margin. All refused with null evidence. A tenth inherited array-prototype
`toJSON` control refused before invoking user code: **zero invocations**.

The frozen selectors additionally exercise complete-cell/order/family corruption,
bounded JSON/component validation, source drift before/after child execution,
fixed request schema/duplicate keys, actual oversized stdin, bad child metrics,
process failure/timeout/signal/stderr/malformed output, shared-budget exhaustion,
and late completion. Final product review confirmed no provider, dynamic model
adapter, old arithmetic import, private-root access, report write option, or
execution grant. Core reconstructs the whole report rather than trusting hashes;
the CLI compares the whole canonical evidence and rechecks pinned source bytes.

A development test used an ES2020 BigInt literal under the repository's ES2017
target; the owner changed it to constructor syntax. Main's subsequent strict
typing findings required explicit Core narrowing and CLI `ProcessEnv` typing.
These owner fixes were refrozen before this review's final selector and pins.
Earlier successful tests alone were not treated as whole-project acceptance.

## Acceptance boundaries

| TIP criterion | Independent finding |
|---|---|
| M1 | PASS: all-real BAD-arc argument reviewed separately from finite sampling |
| M2 | PASS: sharp minimax upper/lower proof and exact four-class distance witnesses |
| M3 | PASS: conditional lower-witness lift, correct all-14 convention, positive robustness slack |
| M4 | PASS: all 132 cells/1753 tuples, independent Fraction reconstruction and actual fresh replay |
| M5 | PASS: final negative controls fail closed; no partial positive evidence |
| M6 | Independent frozen-byte review PASS; whole types/lint/build/regression/preservation and final acceptance remain Main-owned |

This closes a genuine local mathematical-method milestone: exact optimal
exception-shift margins, stronger conditional separation margins in four
classes, and a reproducible bounded diagnostic. It does not close authenticated
production replay, source/runtime dependency attestation, atomic operation
binding, actual M1 agent ingestion, a new campaign, all speed classes, or LRC14/15.
Local source-byte/process consistency is explicitly **not signed attestation**.
Cooperative resource checks do not attest a malicious host or Python runtime.
No UI/E2E observation was performed or claimed by this reviewer.

## Final reviewed pins

| File | SHA-256 |
|---|---|
| Sealed TIP-072M | `33c6bb0b6cb550fd68b38affbb8ee26fa88b4e5b52b1083d01eec0a3de096934` |
| Mathematical dossier | `d7bc027fface2193f135fdbb8ee4d94cecba1af25991c1c848d7a0cfe4721a60` |
| Core product | `86c23ecfd0fd68d28d093dfceebe92abf83929d5c06c17881349f674779d6132` |
| Core unit tests | `022a5f928b30f208b7b7084a544a6c694d820e99e994a0b37f36cb403dc1fc4f` |
| Python replay | `526ea120b5254fffd1ad1571db2ec351bd264f7ebf4f2febe6e5763e4d0ce353` |
| Audit CLI | `dd6bc2be517d1f26bbbadbc8fab83f2fe5cd819ab48981bef75ff7335e63cb07` |
| Replay unit tests | `f131de88af93b6955fec8042ffc1ec467b328e154e7ef0184a83b7357cc100bb` |
| Core completion report | `2f94510ae4eb3632c7b3c76a114242ef429fed3e0f7091bfde3348e4efb2a448` |
| Replay completion report | `58b57e15e7b39bc8d535003ff6136bf8fb5a9bfa5b51ba6b03f078d7868dc478` |

No peer file was changed. Broader acceptance must use Main's independently
recorded final QA and preservation results rather than infer them from this
focused review.
