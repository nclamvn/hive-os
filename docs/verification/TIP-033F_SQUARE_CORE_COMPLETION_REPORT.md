# COMPLETION REPORT — TIP-033F

2026-10-01. Builder under Vibecode Kit v6.2, delegated by Contractor.

## STATUS

DONE for F01–F04. All FOUR fixed targets, ONLY b=2 and a=1..4, odd prime
ell, m=2^a*ell^2. All declared criterion inputs factored and recursively
certified; no arbitrary ell/modulus ceiling. Higher a/b explicitly UNCOMPUTED.
This does not decide whole b2/all-core coverage, the root conjecture, minimum
denominators, novelty, formal correctness or an authoritative agent-cycle event.

## FILES CHANGED

Created only for this TIP:

- `src/modules/research-sandbox/math-normalized-core-bound.ts`: exact BigInt
  formula for p>=2 from the Contractor's written elementary derivation.
- `scripts/operations/square-core-generate.py`: fixed bounded discovery,
  explicit PARTIAL on interruption at any target phase.
- `scripts/operations/square-core-artifact.json`: separate 199204-byte artifact,
  1399 recursive Lucas nodes, 256 criterion entries, zero unresolved inputs.
- `scripts/operations/square-core-check.ts`: exact certificate/product, fixed
  scope, finite bound, all-divisor enumeration and original pair checks.
- `scripts/operations/square-core-replay.py`: independent stdlib exact checker;
  recursive dependency traversal and direct positive integer-divisor pairs.
- `scripts/operations/square-core-replay.ts`: fixed source/data-pinned isolated
  replay, 30-second timeout and 256-KiB output ceiling, sanitized failure.
- `scripts/operations/square-core-audit.ts`: fixed CLI; PARTIAL/non-PASS exits1.
- `tests/unit/math-normalized-core-bound.test.ts`: three BigInt/bound controls.
- `tests/unit/square-core.test.ts`: ten discovery/certification/replay controls.
- This report.

No D source/artifact bytes or pins, E files, application UI, data loader,
database, worker, API/provider, dependencies, Git, handoff, TIP or Contractor
manifest was changed in this TIP. Earlier UI follow-ups are separate work.

## REQUIREMENT / TEST RESULTS

Coverage: 4/4 F requirements implemented and locally tested.

- F01 PASS: exact T0=floor(p/4)+1 and
  floor(T0*(T0+1)/(4T0-p)), p>=2, including a 51-digit input. Four residual
  constants match the note. All p3mod4 controls below1000 attain the bound via
  A=t+1,u=t,Q=k=1. p2 boundary is checked without asserting strict discrete
  monotonicity. Independent finite positive divisor-pair/Q1..8 enumeration
  at m1..512 checks **34157** admissible controls, no violation. The written
  argument, not these finite tests, supplies the infinite bound.
- F02 PASS: 22 pure-two inputs (both signs j0..10) and42 translated inputs
  per target, with exact t=-a..2a+2 for a1..4. Each complete product is fully
  enumerated; shape s+1=2^(a+2)*ell^2 is checked by exact integer square root.
  Every candidate ell receives a full certified prime/product decision.
  The ORIGINAL gcd(A,u)=1, Au|m, Ap+u=s*v congruence is checked, not just the
  raised elimination. Twelve small exact image controls independently compare
  the pure/translated union with positive divisor pairs, including composite s.
  All final hit tuples satisfy strict positive ordering, exact identity and
  exactly two p-divisible denominators.
- F03 PASS: discovery completed both local runs in under1 second TOTAL using
  unchanged D arithmetic discovery and certified seeds; each target still has
  the full monotone120s guard and real SIGALRM. Deterministic limits:32 rho
  seeds,2000000 iterations/seed,4096 Lucas bases and100000 divisors/input.
  All five target phases (target prime, criterion factor, candidate enumeration,
  candidate factor, finalization) have actual SIGALRM fault injections; each
  retains PARTIAL with the exact interrupted declared input/purpose and clears
  the timer. PARTIAL reports no complete exclusion manifest, even when some
  factors are already certified. Fresh regeneration is byte-identical. TS and
  fixed isolated Python agree on the entire decision and both strict tuples.
- F04 PASS: corruption/product, missing criterion/ell, recursive dependency,
  Lucas witness, scope/criterion/bound drift, incomplete discovery, false
  raised roots and replay-output/unavailable-Python controls fail closed.
  Independent Python additionally rejects five certificate corruptions,
  retains PARTIAL and rejects the in-domain false-root control p109201,
  a1,ell3,m18,s71: s divides8p^2−1 but no original normalized pair exists.
  p109201 is trial-divided independently in the unit control, not inserted
  into the fixed four-target artifact.

Fresh typecheck PASS; targeted lint zero errors/warnings; diff-check PASS.
New F tests13/13 PASS; F+D combined **20/20 tests,3 files PASS**.
No full integration/browser suite or production build is claimed here.

## EXACT RESULTS / REMAINDER

All four targets are `COMPLETE_FOR_B2_A1_TO_A4_ONLY`. There are11 distinct
target-ell factor decisions and25 distinct (a,s,ell) candidate decisions:
16 OUTSIDE_FINITE_BOUND,6 ORIGINAL_CONGRUENCE_MISS,1 COMPOSITE_ELL,2 HIT.
The bound exclusions are recorded, not silently discarded; no ell/s sampling
ceiling is introduced. Fixed residual bounds in target order:

```text
131433121: 359888887711080
159727681: 531519451560720
351121:      2568530580
171348241: 611671279318260
```

Positive normalized constructions:

```text
p131433121: a2, ell3, m36, s143, (A,u,v,k)=(4,9,3676451,1)
  (x,y,z)=(33088059,4731592356,1932829716534284)
p171348241: a1, ell5, m50, s199, (A,u,v,k)=(2,25,1722093,1)
  (x,y,z)=(43052325,8567412050,590155212776826)
```

The first recovers the previously known s143 construction; no new minimum or
novelty is asserted. The second is a fixed-slice positive certificate, not an
overall coverage improvement claim. p159727681 and p351121 have no hits in
EXACTLY this certified b2/a1..4 slice, not in whole b2 or all normalized cores.

Original-congruence misses:

```text
p159727681: a2/ell5/s399; a4/ell5/s1599
p351121:   a2/ell5/s399; a4/ell7/s3135
p171348241:a2/ell11/s1935; a4/ell5/s1599
```

p171348241/a1/ell9/s647 has an original pair but ell9 is composite and is
therefore outside the approved prime-ell subclass. The remaining16 entries
have ell=p and violate the universal normalized-core bound. Their raised-root
shape alone is never promoted to a hit.

Higher a>=5 and b>=3 are UNCOMPUTED. Other targets, multiple odd generators,
efficient all-core enumeration, formal alignment and literature/novelty
acceptance remain separate open tasks. A finite universal bound is not a
claim that those huge finite searches have been run or are practical.

## VERIFICATION / HASHES

```text
python3 -I -S -B scripts/operations/square-core-generate.py
node --import tsx scripts/operations/square-core-audit.ts
npm run test:unit -- tests/unit/square-core.test.ts tests/unit/math-normalized-core-bound.test.ts tests/unit/certified-two-core.test.ts --maxWorkers=1
npm run typecheck
```

```text
Generator 839baa5a35ed2bce89098fa1367474f2ec16e7ea0dd2c4e6ddf5d92b4308efb6
Artifact c20ab868ceceee139a7319c5d8ec3b11c953fc6136677565ef9b5184b537cff2
Python checker ca888f9de3a179d34c086113c1bae3b17fda3c21789ac22e9f842c8b83e20eae
Entire decision / trimmed stdout 68371829e82b7e8b00df4597be13721a56248d43abfc49e3388766bd1696a141
```

Target manifest digests:

```text
31bf52bf43e3d2d3cb404b645ebb2e8f8bca96a82a6f6ce90c57be3053a931a9
4ce7bfddabc25ec589e89019d7c09d5fd74918a291578578f26173f1db5758a4
d2f5cbc0fcfe39ef2bcd8e93ec01d42c105d1dc219562cad034f94e137d01b11
5de588363e77517c9032b750d7252c6eff75055bfe5bfc0ae9bb938fd772ef64
```

D unchanged checks: artifact
ae5abacaddd6027e5875ded6db0448899efeae6f1e977355330a7b26b767a040;
Python checker6c78cc56b61e9497f3610219cfb51ff6583f831c81c07ce3bdd2c8b8ba612c7b.

## ISSUES / DEVIATIONS / SUGGESTIONS

No blocking implementation issue; zero real unresolved inputs on this run.
Real interruptions are fault-tested rather than claiming a timeout occurred
during successful production discovery. Generator uses POSIX timers on local
macOS/Linux, no dependency installation/network/external factor service.

Shared arithmetic is disclosed: discovery imports the unchanged D generator
and seeds its cache from the byte-pinned D artifact, including unused prior
prime nodes. No checker trusts MR discovery or those seeds unverified: both
recheck all1399 recursive Lucas nodes and exact products. TS uses ascending
node validation/signed exponent pairs plus the existing strict identity
checker; Python uses recursive node validation/direct divisor pairs and its
own cross-multiplied strict identity. Both share the mathematical criterion
and SHA256, not independent formal foundations. The complete F checkers do
not execute D discovery or depend on E.

Deviation: PARTIAL retains verified factor-prefix counts but conservatively
emits no per-target hit/exclusion manifest; this prevents incomplete evidence
from being misread as a complete negative result. No scope expansion.
Recommendation: exploit the six verified original-congruence misses to study
the lost square-root sign/CRT condition before increasing a/b. Do not promote
raised congruences into a sufficient target criterion or call narrow finite
misses a mathematical breakthrough. Contractor review remains pending.
