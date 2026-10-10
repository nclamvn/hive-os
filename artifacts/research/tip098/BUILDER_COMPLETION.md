# Completion report — TIP098 exact checker Builder

STATUS: DONE for the narrow R2 implementation package only. The mathematical
root C_T(5)=14/61 is not established by this engineering work.

## Files changed

- Created `kakeya_exact.py`: stdlib rational slice-area algorithms, exact JSON
  evaluation CLI, and optional bounded n=5 approximate pattern-search CLI.
- Created `test_kakeya_exact.py`: 22 named focused engineering controls.
- Created this report. No predecessor, product, database, configuration, runtime
  gate or Main-owned mathematical report was edited.

## Test results and preserved failures

First validation: `python3 -B artifacts/research/tip098/test_kakeya_exact.py`.
20 named controls ran in 0.318 seconds; 18 passed and 2 failed. Both failures
were test fixtures expecting the tentative n=2 offsets [1/3,0] to have area1/3.
The primary algorithm returned3/8; the fixture was corrected, not the algorithm.
Failed test names: `test_two_attaining_witness`, `test_rational_representation`.
The same wrong tentative witness had been sent to Main and was explicitly
corrected before acceptance. No failed scientific search occurred.

Final validation, same command: 22 named controls ran in 0.299 seconds;
22 passed, 0 failed. These include 64 seeded finite cross-comparisons across
n=1..8 as subchecks of ONE test, not 64 additional named controls; 16 malformed
input shapes against both algorithms as subchecks of ONE test; single/disjoint
triangles, known small witnesses, translation/reflection, event boundaries,
independent second-path call isolation, CLI success/refusal, and float-objective
reference checks. Two added controls test search parameter refusals and search
bookkeeping with a constant mocked objective. They do not conduct scientific
candidate search. Total own validation runtime observed: 0.617 seconds, below
the180-second ceiling. No installation or build.

Exact verified values in BOTH calculations:

| n | offsets | area |
|---|---|---|
| 1 | [-77/9] | 1/2 |
| 2 | [1/6,0] | 1/3 |
| 2 | [1/4,0] | 11/32 |
| 3 | [2/9,1/9,0] | 5/18 |
| 4 | [1/4,1/6,1/12,0] | 1/4 |
| 5 | [79/305,47/305,10/61,12/305,0] | 14/61 |
| 5 | [4/15,1/5,2/15,1/15,0] | 7/30 |

## Implementation and usage

`area_trapezoid` enumerates all rational endpoint crossings and integrates
the exact interval-union length at slab boundaries by the trapezoid rule.
`area_affine` independently constructs endpoints/crossings, sorts intervals
at slab midpoints, selects the affine component endpoint laws and integrates
their coefficient differences. It does not call the primary area, event or
slice-length functions; validation parsing is the only shared logic.

Exact CLI:

```sh
python3 -B artifacts/research/tip098/kakeya_exact.py eval --json '["79/305","47/305","10/61","12/305",0]'
```

Optional Main-owned search CLI (NOT run by Builder):

```sh
python3 -B artifacts/research/tip098/kakeya_exact.py search --seed 98001 --max-seconds 60 --max-iterations 100000 --restarts 200
```

Search confines n=5, fixes x5=0, clips x1..x4 to[-3,3], initializes from the two
known witnesses then seed-controlled random starts, and uses coordinate pattern
search with initial step0.2 and halving on no improvement. Actual start/evaluation/
iteration counts, domain, seed, ceilings and elapsed time are emitted. Time-based
stopping can change iteration count by machine. Seed+iteration stopping is
deterministic. max-seconds is refused outside(0,120]. Approximate candidates and
their bounded-denominator conversions are explicitly not exact certificates;
Main must separately invoke both rational area algorithms for any claimed result.

## Issues, deviations and suggestions

- Corrected the supplied n=2 witness [1/4,0]: it gives11/32, not1/3. The actual
  attaining fixture in this parametrization is[1/6,0]. No stronger general claim
  follows from this fixture correction.
- Optional search CLI added at Main's explicit request. Only mocked bookkeeping
  tested by Builder; its scientific exploration and adjudication remain Main's.
- No third-party dependencies, copied upstream checker, mathematical reviewer,
  further delegation, benchmark, novelty or method-superiority claim.
- No scratch copy, build directory, venv, dependency install or Docker artifact
  was created; nothing removed. `-B` avoids Python bytecode leftovers.
- Final suggestion: exact-check each rationalized candidate separately and keep
  any negative finite search distinct from the all-real-offset lower-bound gap.

## Append-only optional DE extension — 2026-10-10

At Main's explicit request within the same brief, added `search_de_float5` and
the `search-de` CLI mode, preserving both exact algorithms and the original
pattern-search mode. This is stdlib DE/rand/1/bin with population50 by default,
two known initial witnesses and seed-controlled uniform random remaining members
in[-3,3]^4, x5=0. Each generation uses a frozen predecessor population; each target
uses three distinct donors excluding itself, mutation0.8 and binomial crossover0.9
by default, with one mandatory mutant coordinate. Mutants clamp to[-3,3]. Trials
replace targets on <= score; equality acceptance permits movement on flat regions
without claiming improvement. Best observed score is retained independently.

```sh
python3 -B artifacts/research/tip098/kakeya_exact.py search-de --seed 98002 --max-seconds 60 --max-generations 10000 --population 50
```

Emitted ledger includes initial/actual population, algorithm, seed, domain,
mutation/crossover/clamp/selection policy, objective/trial/replacement counts,
started/completed generations, time/generation ceilings, stop reason and elapsed
time. Every candidate/conversion remains APPROXIMATE_CANDIDATE_ONLY and exact
validation NOT_PERFORMED. Time stopping may change the actual generation count;
fixed-seed/fixed-generation operation is deterministic when the time cap does not
bind. max-seconds still refuses values outside(0,120].

Fresh final suite:25/25 named controls PASS,0failures,0.299seconds. Three added
controls use a constant MOCKED objective for one-generation mechanics and seed
reproducibility, plus malformed DE parameter refusals; no actual area objective
was used for a DE scientific search by Builder. Coupled proposals, gauge/bounds,
generation counts and evaluation/replacement counts were checked. Cumulative own
observed validation runtime0.916seconds, still below180seconds. Previous20-control
fixture failures and22-control pass remain preserved above. No further files,
dependencies, sources, agents, product changes or scratch artifacts.

## Append-only local arithmetic certificate extension — 2026-10-10

At Main's explicit implementation request, created `local_certificate.py` and
added four focused controls in the existing test file. No discovery search or
independent mathematical review was performed. The script derives the ten
endpoint laws from definitions, independently constructs27distinct rational
height affines, canonicalizes h=0/h=1/h_i=h_j walls and parallel endpoint equality
walls, and emits184parameter-space hyperplanes. Parallel equality walls were
already included by height-order walls. A preliminary diagnostic counted185 by
retaining the nonzero constant[0,0,0,0,1]; this was explicitly excluded as not a
hyperplane, preserving the diagnosis rather than changing mathematical inputs.

```sh
python3 -B artifacts/research/tip098/local_certificate.py
```

At the known witness, the only zero wall is[15,-20,0,5,-1]. The minimum nonzero
|wall(reference)|/l1(variable coefficients) is3/1525. On each side, center is
reference±e4/100000 and interpolation step1/10000000. Fifteen exact area samples
(center, four plus, four minus, six pair-plus) each use both area calculations.
Every sample retains the reference sign of each nonzero wall and the selected
side's zero-wall sign. Fifteen-point finite differences fit each Hessian and
center gradient; extrapolation gives reference area14/61 and gradient0 on both
sides. All leading Hessian minors are positive; the exact difference satisfies
Hplus-Hminus=(1/60)*v*v^T, v=[15,-20,0,5]. JSON includes all sample coordinates/
areas, canonical walls, fit coefficients, sign/basis checks, leading minors and
rank-one checks. Total area calls per script execution:62, including reference.

The interpretation as an exact polynomial on each adjacent event-order cell
is CONDITIONAL on Main's external written degree<=2 premise. Interpolation and
tests do not prove that premise, global coverage or global optimality. The script
loads neither Main's prior interpolation JSON nor wall-diagnostic JSON; arithmetic
is derived from definitions, with expectations only in the focused tests.

Fresh final suite:29/29 named controls PASS,0failures,0.387seconds. Four added
controls cover wall normalization/static exclusion, independently constructed
arrangement, local polynomial arithmetic, and small exact determinant controls.
Previous fixture failures/pass checkpoints remain above. New validation plus the
first compact arithmetic diagnostic was well below the extra60-second allowance;
cumulative own observed executable validation remains under2seconds and below
the180-second total. No dependency/build/scratch artifact or removal.
