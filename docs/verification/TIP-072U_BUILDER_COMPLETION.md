# TIP-072U Builder completion

2026-10-05. STATUS: DONE for assigned standalone source/tests/report; Main and
independent U5/U6 verification remain separate, not asserted by this report.
Vibecode Kit Builder boundary followed. AGENTS/handoff, installed Next Vitest
guide, skill and TIP/report reference read before implementation. No UI/Next
code changed. Build/type/lint SKIPPED: Python/docs-only additive diagnostic.

## Files created; freeze pins

Only these three new assigned files were written; no existing files modified:

- `scripts/research/lrc-band-transfer-replay.py`: bounded stdlib rational replay.
  SHA-256 `8b8d1d2e5c34290e5b43d0777908014edcd1300ba6280be8c7f40d21a3c03c8b`.
- `tests/research/test_lrc_band_transfer.py`: independent local closed-arc oracle,
  CRT realizations, input/resource/capability and inspected-byte child tests.
  SHA-256 `0840413dc35c11169c5ab5573fa9dac39ff156e1696142eb34680302f75a329c`.
- This report. Its final pin is communicated externally (no self-hash claim).

Final sealed TIP pin
`9ad82a14773987b0cfe26184483743438253297cef23b3b41bb1a35544593dfc`;
written proof pin
`5e2a056fa976fa58de1982e1d387178c07f4a2ddb16f494cd4502287dee673c2`.
These documents were read completely; ownership remains Main, not Builder.

## Results and resource evidence

Fresh command:
`python3 -B -m unittest discover -s tests/research -p test_lrc_band_transfer.py -v`.
32 actual unittest methods PASS, zero failures/errors, 1.010 s reported.
Loops over controls/signatures are not inflated into additional unit-test counts.

Fresh inspected-byte child: source bytes read and hash checked before launch,
compiled those exact bytes in `python -I -S -B -c`, `shell=False`, empty stdin,
only six named flags set to exact `false`, timeout 5 s, post-launch pin checked.
Exit 0, stderr 0 B, stdout 28,832 B including newline; 497,043 charged steps;
arithmetic 6.491834 ms, whole child 52.056875 ms. Measurements are unsigned
local observations, not signed runtime attestation or executable-closure admission.

Complete canonical body digest, excluding metrics and digest field:
`c76e10dcddc1574b52bf356e64dad62f69c1a2017997331864b0ab3fd410d2ba`.
Whole-body independent expected arithmetic matches every supplied input,
normalization/geometry/candidate/family/selector/mask/status/context/reference and
all matrices. Derived counts assert exactly 3 original and 2 adjusted matrices,
1,950 decoded distances, 24 lower distances/band rows, 15 candidate assessments,
26 final distances. No matrix omitted, no cap raised.

Fixed cases:

1. `analytic_transfer`, W=92850: original saturated/disjoint full cover;
   next K=1 band `[1/86660,9/433300]`; all width guarantees true. Selected
   original label 11, speed 19996, new base 1/86660. GOOD physical indices
   `[4,5,6,14,16,19,26,29]`, lowest 4; final T=34667/259980, minimum 1/14.
2. `no_complete_band`, W=7380: UNKNOWN_NO_COMPLETE_BAND; original full cover,
   no complete subsequent omitted band inside this seven-lower component.
   No selected candidate, adjusted matrix or final witness. This does not rule
   out partial intersections, another omitted coordinate or an old/global witness.
3. `phase_aware_transfer`, W=9285000: all five width guarantees false, but
   exact phase-fit labels 10 and 12 retained. Select label 10/speed 86656,
   base 61/6065920. GOOD `[6,21]`, lowest 6; T=242649/1213184, minimum 1/14.
   This is phase-specific success, not a phase-independent width guarantee.

Outside CLI counts, W=300000000 gives K=3000 and a fitting next band but all
five actual phase fits false: UNKNOWN_NO_PRIMARY_SAFE_BASE. It excludes only
the q2/q3 primary-orbit-safe construction in this selected band, NOT all joint
witnesses/components/global LRC. Scope is explicitly retained in the body digest.

## Coverage and mathematical controls

- U1/U2: actual eight lower containing bands, closed equality, protected C,
  old component, active bounds and exact ceil/floor range implemented. Proof is
  Main's separate universal argument, not inferred from finite tests.
- U3: exact plain input types; canonical reduced two-string tau; actual distinct
  positive speeds <=10^12; actual omitted lower label; g/H=6; every lower checked.
  Reject bool/subclasses/hooks, extra supplied certificate/verdict/path/witness.
  General q1/q2/q3/q6 retained; q1/q6 not eligible for new width theorem. Original
  complete GOOD grid has priority even if next complete band does not fit.
- U4: full body oracle uses local safe-arc endpoint enumeration rather than
  product ceil selector. CRT rigidity independently checks supports and parity/
  ternary occupancy. Negative floors, whole-H=7 physical period, reordered labels,
  closed starts/ends, width equalities, signed ceil/floor ties, family inequality
  equalities and direct original reuse PASS. Coherent rehash mutations are oracle
  inequality checks, NOT a nonexistent external certificate validator.
- Explicit family predicates are separate: lower inequalities, matching actual
  base, full family applicability and forced large q3 applicability. Actual narrow
  tuple at analytic family base passes forced >=2 large q3 checks. Seven varying
  valid a-controls test direct-or-transfer dichotomy, not a universal claim.
- All 20 CRT critical signatures realized independently at a=8 in the explicit
  lower family; all original full covers and forced large-q3 predicates checked,
  and all 15,600 original+adjusted coordinates agree with the oracle. These extra
  realization tests are outside frozen CLI counts and do not prove global closure.
- Resource/output/capability checks cover exact CLI flags/options, ignored stdin,
  plain limits, deadline/operations, 256-bit components, serialization preflight,
  whole output cap, allowed imports and constant-bound range calls. One Work budget
  spans validation, arithmetic, all evidence construction, preflight, digest and
  serialization. Gcd cost prepaid by operand-bit upper bounds; no loop scales with
  actual speed/H/g/K. Final serialization conservatively prepaid 36,864 steps.

## Decisions, preliminary failure, deviations and suggestions

L2 refinement recorded transparently: first TIP seal
`e9a6e9de86ee5537ec26afbd9d94d8041163ef0be49751f22da2a56b5fc0fe98`
deliberately returned UNKNOWN despite W9285000's computed valid phase fit.
Builder flagged this weakness during read-only scan. Main explicitly held work,
adopted actual-phase fallback and resealed TIP/proof before frozen verification.
Source changed to match the resealed contract: choose minimum safe time/original
label among fitting q2/q3 candidates, including failed-width candidates. Width
theorem and family proof unchanged; no execution authority added.

First selftest run: 29 PASS, one ERROR. The Builder mistakenly included a=8 in
the separate simple family E=[3,9,2,4,6a+2], which excludes a=3 mod5 because
6a+2 is then divisible5. Product correctly refused PREMISE_REFUSED. Corrected
test input to a=7 and added explicit excluded-case refusal test; no product fix
or mathematical contract change. The distinct all-20 realization family at a=8
has different exceptions and remains valid. Subsequent fresh 32/32 PASS.

Implementation detail decisions (L1): nested contexts keep dictionary limits;
lossless common-denominator integer matrices; fixed shared definitions with
explicit `body.bandColumns`, `body.candidateColumns`, `body.maskColumns`,
`body.matrixSchema`, `body.scope` refs, while standalone certificates retain full
definitions. Candidate columns are named once; all 15 rows retained, including
failed-width and failed-phase details. Counts derive actual evidence then assert
frozen values. Main's requested explicit noPrimarySafeScope was added before
freeze. No architecture/scope deviations beyond Main-approved L2 refinement.

Suggestion for later sealed work: the successful phase fallback demonstrates why
UNKNOWN must not be treated as mathematical failure; consider phase-aware partial
band/protected-component transitions for the remaining complement, with separate
complete coverage arguments. This report does not authorize that implementation.

## Preservation and limitations

U5 independent review and U6 Main fresh checks/regressions/manifest/preservation
are pending external acceptance, not Builder's own READY claim. Same seven
preexisting research-program-v2 inventory gaps remain outside ownership/deferred;
Builder did not reseal, exclude or delete them. No manifest/handoff/flags or old
file changed by Builder; no provider/API/DB/UI/native worker/M1/private capture/
Git write/commit/push/billing/deploy. Six execution flags remain OFF.

Full072 remains PARTIAL/NOT_READY_FOR_M1. This is an unsigned offline replay,
not browser E2E, native agent loop, scientific admission, global LRC14/15,
independent reproduction of all Allikvere branches, formal proof or established
novelty/breakthrough. The written family is unbounded, but the diagnostic cap
is unchanged execution policy, not a theorem premise.
