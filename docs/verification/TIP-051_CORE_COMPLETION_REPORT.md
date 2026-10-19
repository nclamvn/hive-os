# TIP-051 Core Builder completion

Status: DONE for assigned R1/R2/R3/R5 core seam (4/4). Contractor acceptance and
R4 UI verification remain Main's responsibility. Research/global theorem status
is NOT_ESTABLISHED. This is conditional arithmetic reproduction, not an
independent reproduction of the whole theorem or a novel result.

## Files created and final SHA-256

| File | SHA-256 |
| --- | --- |
| src/modules/research-sandbox/math-lrc-proof-plan.ts | 650d55595ad689ce4726ca6c84f5772d543027c95df7121b1e6cc2747c335c9f |
| scripts/operations/replay-lrc-proof-arithmetic.py | c7a28efd319ffd670b5f8b229aba40be6e933386e29f0edebdabb6cafb0a3d78 |
| scripts/operations/allikvere-proof-audit.ts | dc4d43f6fb90b56a0730f9e43dd28425e9a56e61a49994be37145b132a1397e6 |
| docs/research/lrc-allikvere-v2/retained-proof-arithmetic.json | 8f0d79ea33d484bcbd9e966096e91b0af4f7081fe46b4e3fb554f38bd2108962 |
| tests/unit/math-lrc-proof-plan.test.ts | 6b92dfa25818023268da56bb0fb0ada26976e26a326fc92cca140bb11dbda25e |

No product page, component, manifest, handoff or old report was changed by this
Builder. Existing dirty files were preserved. No build, whole test suite,
database, model campaign, author/archive code, install, commit, push or deploy.

## Implementation and requirement coverage

- R1: v2-specific typed source claim and separate 14/15 dependency ladders. All
  23 dependency entries are OPEN. Fifteen runners depend on established LRC(13),
  i.e. 14 total runners; lower LRC(12) means 12 moving speeds/13 total runners.
  No dangling graph edges. Level-one, binary-lift and terminal completeness are
  explicit separate obligations; local p199 evidence is not a global premise.
- R2: reconstructs every B increment c_i, K, ratio >4/3, shape constants,
  prime set, primality, uniqueness, product, lcm=360360, coprimality and both
  positive contradiction margins. Exact BigInt rationals only, no Math.log or
  floating-point admission. Shape/lattice/divisibility arguments remain assumed.
- R3: independently derived stdlib Fraction Python replay, executed from
  checked literal source bytes with -I -S -B -c, shell=false, minimal environment,
  no input. Source cap 16KiB; timeout 10s; stdout 256KiB; stderr 4KiB. Collector
  cap 20s, retained report 512KiB. --write is creation-only; no silent overwrite.
  Pure retained admission rederives the complete fixed arithmetic and checks
  source/output/plan/report pins. Receipt is unsigned local self-receipt, not
  external execution attestation. Code hashes in this report are local trust,
  not signatures or mathematical premises.
- R5: selected pending-full-review properness/primitive/GCD/few-exception shift
  audit first, analytic prefix/KZ/shape audit second, full dependency tracing
  third. Stop rule requires a named global obligation and closure mechanism;
  partial-coverage accumulation and novelty remain paused.

## Numerical outcomes

| Total runners / moving speeds | Primes | Conditional log bound enclosure | Conditional required-product log enclosure | Positive margin enclosure |
| --- | --- | --- | --- | --- |
| 14 / 13 | 61 | [341.031990, 341.031991] | [353.772559, 353.772560] | [12.740568, 12.740569] |
| 15 / 14 | 71 | [414.779364, 414.779365] | [421.618176, 421.618177] | [6.838811, 6.838812] |

Displayed six-place intervals are rounded outward. Authoritative wire intervals
are exact reduced rationals rounded outward to 10^-12. For 15 total runners,
the required product is prime product times 360360, exactly once; no factor is
shared. The 61-prime subset does not contradict the earlier 111-prime archive.

Method: reduce x by exact powers of two into [1,2), enclose its normalized value
in a 64-bit dyadic interval, then use monotonic log and the 24 positive atanh
terms. With z=(x-1)/(x+1), the remaining tail is bounded by
2*z^49/(49*(1-z²)). Signed scaling reverses interval endpoints where required,
especially for negative log K and the -n/2 multiplier. Python independently
implements the same mathematical enclosure using Fraction; no TS imports.

Retained raw size: 6147 bytes. Content digest:
9d1ab397ed9a61dd85e27428efd0601bebd86379118198683098030bda053cd0.
Plan digest: 3ac8e4f31be431c410d5535eeb308dee80f351baf575f1843245ba6a47925b3c.
Exact Python stdout: 5606 bytes, SHA-256
4a7eccf7522d1aa4c493189ab0665145a3facb4d995e9aaa4f6dfeb4d3c0b790.
Recorded Python replay 61ms; initial retained collector 1351ms. Final no-write
collector 1397ms with fresh Python 71ms matched exactly. Standalone pure TS
reconstruction observed 427ms (not a hard performance guarantee).

## Verification

- Focused new unit tests: 27/27 PASS, initial 10.89s; final concurrent typecheck
  run 21.91s. Includes a real isolated Python execution, exact log1/log2 and
  reciprocal controls, exact K/ratios/primes/coprime/margins, pure no-fetch/no-log,
  graph/source/stop-rule checks and 18 outer+output-rehashed tamper cases.
- Negative cases include changed source/version/Python source/plan pins,
  theorem/assumption promotion, runner mislabel, duplicate239, composites,
  missing prime, c_i/shape constant, signed-bound corruption, forced-divisor
  doublecount, fabricated margin, external attestation, unknown field, missing
  target, stale report digest, oversized/cyclic/null data.
- Whole tsc --noEmit: PASS (0 diagnostics). Targeted three-file ESLint: PASS
  (0 diagnostics). git diff --check: PASS.
- No whole unit suite/build/integration/E2E run by Builder.

## Issues and deviations

No open scoped implementation failure. Main must independently verify output
and UI. Analytic arguments, lower cases, whole modular computation completeness,
formal/external certification and novelty are explicitly not discharged.

Initial exact enormous rational log arguments took 8.8s/227KiB. Main and Builder
agreed to retain exact dyadic argument enclosure plus outward rational wire
rounding; final compact arithmetic is 5605 JSON bytes and ~0.43s. This changes
neither source primes/constants nor mathematical scope. Method is named in report.

Initial replay failed closed because /usr/bin Python lacked a nonessential
Python3.11 integer-display-limit API and emitted an isolated-env warning. Removed
that unnecessary API (all final integers are bounded small) and pinned minimal
PATH with standard Homebrew Python priority/TMPDIR. Final genuine replay succeeds.
The selected interpreter is trusted local storage, not cryptographically attested.

Final plan refinement split global obligations and selected pending-full-review
status; retained plan/report digests were mechanically resealed via apply_patch.
Fresh arithmetic/output receipt bytes were not changed or fabricated. BigInt
literals were mechanically converted to BigInt(decimal-string) for repository
ES2017 compatibility, preserving every exact value.

Vibecode Kit kept Builder implementation distinct from Contractor acceptance.
AGENTS/handoff/current TIP and installed Next Vitest guide were read; this seam
does not implement Next APIs. Relevant source was inspected directly at
https://arxiv.org/html/2609.02604v2 §§2,3.4–3.7,4,5,6.

Suggestion: Main should inspect the pinned Python/TS exact rounding argument and
remaining dependency graph, then complete R4 separately. No more local search
or cap increase is proposed.
