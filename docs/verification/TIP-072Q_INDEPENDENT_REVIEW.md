# TIP-072Q independent mathematical and product review

Date: 2026-10-05. Reviewer acted independently and edited only this NEW assigned
report. Status: mathematics/product PASS within bounded OFFLINE scope;
repository inventory remains FAIL / Q6 READY_WITH_DEFERRED.
No remaining P0/P1 finding in the reviewed 072Q mathematics/product scope.
This is not a whole-repository green gate, production readiness score or global
mathematical acceptance.

## Frozen objects actually inspected

The complete sealed TIP, proof, mathematical-only addendum, Python source,
Python tests and Builder completion were read. SHA256 pins matched:

| Object | SHA256 |
|---|---|
| Original TIP | `57bcc0d58509793b5dcac2d93e1f7242c41d3ea9d72f7703978775d697b1d40d` |
| Mathematical addendum | `8bafb777325f51e736b567835d99caf83ec7d3741d21c0e04220fa245a9c7bd6` |
| Research proof | `578f44a56d4e5f4b9a5c498e1488add081b6a6e5c23676623c42b4afd69108f8` |
| Replay source | `2759d8b9f000de85691b5d82fced54a0e2d435b97336feb045171666991e2633` |
| Python tests | `5a1c609093e6610e0ec000e51eb15b16f269b9818858c7699bd25a812ee43214` |
| Builder completion | `56341635b3a50b7e622e84bd6585c1fa9213f848c3f03d7c6d26d3d92008370b` |

Source was frozen before final execution/reconstruction. Preliminary source
reading was preparation only, not acceptance of mutable bytes. No product
source, test, TIP, addendum, old report or old admission predicate was edited.

## Universal mathematical review

For a positive unit v modulo d, multiplication permutes the physical shifts,
so their minimum distance is exactly `norm(d*v*t)/d`. Under `2*eta < 1/d`,
the times at which some shift is BAD form disjoint OPEN components centered
at `h/(d*v)`, each of radius `eta/v`. The complement is closed. The nearest
safe distance is exactly `max(0,d*eta-norm(d*v*tStar))/(d*v)`, not an upper
bound substituted for an exact calculation. In an unsafe component, the
nearest boundary is selected by the sign of the displacement from its center;
the center tie chooses the LOWER actual time. Equality is GOOD.

The lower coordinates are preserved on the CLOSED radius
`R=(L-eta)/U` by the 1-Lipschitz distance inequality, with U the largest ACTUAL
lower speed. Their divisibility by d then preserves them at EVERY subsequent
physical shift. One selected exception is GOOD at every shift; the remaining
d-1 unit exceptions each forbid at most one, because their strict BAD arc is
shorter than the grid spacing. This supplies a common GOOD shift without a
pair identity, residue diversity, common-offset restriction or finite sampling.

Both corollaries were independently recomputed:

| Moving / total | Lower count | L | eta | R | Worst-phase sufficient ratio |
|---|---:|---:|---:|---:|---:|
|14 /15|9|1/10|1/15|1/(30U)|V/U >= 2|
|13 /14|8|1/9|1/14|5/(126U)|V/U >= 9/5|

The targets are not interchangeable. Lower LRC9/LRC8 are existence premises,
not independently reproduced theorems; executable cases check their exhibited
lower witnesses directly. The sharpness assertion is ONLY nearest-safe orbit
geometry at a phase center. It does not prove optimal tuple thresholds or
maximum loneliness. Sufficient-gate failure remains UNKNOWN.

The uncovered normalized-ratio core remains an infinite integer domain as U
grows. Lower ratios can approach zero; generic strict slack and uniformly
bounded normalized witness times are not provided. No naive compactness or
finite absolute-speed conclusion is admitted.

The retained p83 campaign fixes thirteen moving speeds, target 1/14, prime83,
common level224, and retained-reference admission. It does not automatically
have the eight-plus-five divisibility pattern. Neither new corollary changes
its scope or closes a whole independent integer congruence branch.

Primary sources were opened and checked independently:
[Allikvere v2, Lemma4.6](https://arxiv.org/html/2609.02604v2#S4.SS4) handles
at most four exceptions at d5. [Kravitz arXiv v1, Proposition8.1](https://arxiv.org/html/1912.06034v1#S8)
gives the established interval/fast-runner principle; the published
[2021 article, Proposition6.1](https://escholarship.org/content/qt3wx931fh/qt3wx931fh.pdf)
has the corresponding statement. The all-shift adaptation is useful program
progress, not established literature priority. [Tao, Theorem1.3](https://arxiv.org/html/1701.02048#S1)
uses a separate global finite-reduction argument; a ratio bound alone does not
instantiate it.

## Mathematical-only complete-family addendum

Independently accepted for the precise family with fixed lower speeds
5,10,...,45 and ANY five distinct positive unit speeds modulo5. No lower LRC
theorem is needed for these explicit lower speeds.

The component containing 1/50 is the intersection of the nine first GOOD bands:
`I=[1/75,14/675]`, width `1/135`. Its endpoints are exact: speed5 reaches
1/15 on the left and speed45 reaches 14/15 on the right. For V>=18, an
orbit-unsafe open component has length `2/(15V) <= |I|`; a closed connected I
cannot be contained in their disjoint open union. Starting at the left endpoint
and moving to the right boundary of its unsafe component gives a constructive
safe base inside I. The other four exceptions leave a common shift.

For V<18 the fourteen-value unit universe is exhaustive. The six prescribed
times have BAD sets `{14}`, `{13}`, `{12}`, `{11}`, `{9}`, `{1,2,3,4}`.
Any five-element subset other than `{9,11,12,13,14}` omits one of those five
singleton exclusions and therefore has a witness among the first five times.
The exceptional subset is handled by the sixth. These two cases are a complete
logical cover, not inference from a sweep.

Reviewer independently recomputed all 138 coordinates, then separately parsed
and compared EVERY distance numerator retained in the final written table.
All table values match. The first ad hoc table-parser attempt stopped with a
reviewer-local regex match-index typo before returning evidence; a corrected
read-only retry passed, without changing the proof or product. Lower minima are exactly
`1/15,1/15,4/51,1/12,2/21,1/15`. The speed17 entry `17/255=1/15` is GOOD,
not BAD. A separate exhaustive 2002-five-subset calibration had zero failures;
it is supporting calibration, not the proof basis. Common scaling of the WHOLE
tuple is valid, but does not allow independently varying lower coordinates.
No global, arbitrary-lower, archived-whole-branch, novelty or strict-slack claim.
This addendum did NOT change the sealed eight-case CLI or its acceptance counts.

## Actual Python verification and independent complete reconstruction

Command: `python3 -I -S -B tests/research/test_lrc_orbit_safe_speed.py`.
Reviewer result: 34/34 unittest methods PASS, 1.702s, exit0.
Thirty execution-flag faults and three CLI option/path faults remain subtests,
not added to the method count. The suite exercises actual isolated subprocesses,
not only AST parsing or a producer-returned digest.

Reviewer then wrote a separate read-only inline Fraction reconstruction under
`python3 -I -S -B -`. It did not import Builder's expected-body helpers or call
product derivation functions for its expected result. Independently computed
neighboring orbit boundaries, scalar contexts, lower distances, all grids,
BAD sets, GOOD complements, final witnesses, scopes and complete canonical body
were compared to a REAL CLI subprocess. The subprocess used `shell=False`,
timeout5s and a minimal environment containing only the six execution flags,
all exactly false. Source SHA was checked before and after execution.

Actual observation:

- Exit0; stderr0 bytes; full stdout30,652 bytes including newline.
- Eight sealed cases: six accepted phase gates, two UNKNOWN gates.
- Eight original plus six adjusted matrices, ALL965 coordinates matched.
- ALL70 reduced-lower distances matched, as did every context/scope field.
- Canonical output serialization and semantic digest matched completely.
- Shared charged operations113,833; reported arithmetic/encoding11.849583ms.
- Post-reconstruction subprocess/comparison wall observation0.104204s.
- Semantic digest `83cd69ab1d18c09d51c47b93e947fe607ff05eba135436a27beedd1cf93340e3`.

Accepted final times/minima independently matched:

| Case | Time | Full minimum |
|---|---:|---:|
|High mixed|43/195|1/15|
|Hostile same-residue cluster|3436/15615|1/15|
|Below dominance|293/1335|26/267|
|Initially safe, no adjustment|11/50|1/10|
|Negative adjustment|326/1485|29/297|
|Thirteen-moving target|1447/6510|71/651|

Both UNKNOWN cases retain original GOOD indices1 and3 and separately observed
witnesses; no unsafe candidate boundary is promoted to adjusted evidence.
The hostile cluster has no witness on its original FIVE exhibited shifts, not
an archived full-modulus NO_GRID verdict. Complete reconstruction includes the
physical lowest GOOD index, without normalized-selector/carry substitution.

Additional reviewer-owned controls:

- 22 direct hostile input/resource checks all refused, including integer/string
  subclasses with hostile hooks, malformed/noncanonical/oversized rationals,
  incorrect lower/exception counts, false lower witness, shared whole-run budget,
  Boolean limits, 257-bit component and oversized complete output.
- 112 independent neighboring-edge geometry comparisons PASS, with positive,
  negative and center bases, both targets and eight unit speeds. These finite
  checks supplement the written universal proof.
- 12 coherent rehash mutations of contexts, matrices, UNKNOWN status, scopes or
  omitted data fail the reviewer's whole-body comparison. This is NOT a product
  certificate validator or external verdict-admission API.
- AST parsing2/2 PASS for the new source/tests, supplementary only. No Python
  static typing/lint claim.

The inspected product has no file IO, stdin input, network, subprocess, DB,
provider, private-root or worker capability. CLI reads only the six named flags.
Caps remain5s/2M operations/32768B/256-bit components with one shared whole-run
budget. No output omission, cap expansion or case substitution was observed.
Local source pre/post consistency is NOT signed host/interpreter/runtime
attestation, source-closure assurance or external scientific admission.

## Repository inventory failure remains separate and visible

Main reported the contractor-manifest unit regression FAIL because seven
`docs/contractor/research-program-v2/` files already present in its pre-task
1688-file baseline were not listed in the inherited manifest. Main reported all
seven fingerprints unchanged. Reviewer does not claim an independent baseline
fingerprint audit; that historical preservation finding remains Main evidence.

A separate reviewer READ-ONLY current inventory check independently confirms:
120 listed entries,127 actual contractor files, all120 listed hashes match,
no listed missing file, and these seven unlisted files:

- `CORE_SCOPE.json`
- `CORE_SCOPE_REVIEW_NOTES.md`
- `INTEGRATION_SCOPE.json`
- `INTEGRATION_SCOPE_REVIEW_NOTES.md`
- `SEAL_ACCEPTANCE.md`
- `UI_BENCHMARK_SCOPE.json`
- `UI_BENCHMARK_SCOPE_REVIEW_NOTES.md`

All are under the directory above. Reviewer did not edit, reseal, readmit or add
them to the manifest. This existing inventory obligation is not hidden by the
new mathematics/product result. Whole-repository integrity is FAIL, not PASS.

## Six sealed requirements and boundary

| ID | Independent outcome |
|---|---|
|Q1|PASS exact orbit identity, geometry, boundary and tie proof/checks|
|Q2|PASS lower preservation, zero-BAD exception and physical common-shift proof|
|Q3|PASS distinct count corollaries; addendum complete precise-family proof separate|
|Q4|PASS source comparison and honest scope/core/campaign limitations|
|Q5|PASS frozen actual34-method suite, separate complete965+70 reconstruction and hostile controls|
|Q6|READY_WITH_DEFERRED: independent offline review complete; existing contractor inventory FAIL retained; final Main preservation/acceptance separate|

No request to widen authority or change old predicates was inferred. Next/TS/UI/
config/dependencies were unchanged: build/typecheck/lint SKIP is proportionate
and earlier passes remain historical; reviewer made no browser E2E claim.
No DB/session/provider/API/Codex-child/private capture/scientific-case/job/M1/
campaign/archive/schema/migration/envfile/install/Git write/commit/push/billing/
deploy action. Full072 remains PARTIAL/NOT_READY_FOR_M1; agentLoop NOT_RUN,
executionAuthority false. No retained autonomous-agent-result or global/formal/
external/novelty/breakthrough conclusion is established.
