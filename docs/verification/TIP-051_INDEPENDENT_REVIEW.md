# TIP-051 skeptical review: theorem-first reproduction

Date: 2026-10-03. Reviewer is a separate same-model context on the same local
host. This is not external scientific independence, expert certification,
formal verification, or a newly launched HIVE agent campaign. Review-only work
used Vibecode Kit Contractor verification; no product/core/evidence/manifest/
handoff was edited by this reviewer.

## Scope and current result

Conditional arithmetic and the primitive-class exclusion are sound in the
reviewed scope. Full LRC14/15 reproduction remains NOT_ESTABLISHED. At this
checkpoint, route hardening and a test-fixture repair remain pending; this is
not the final Main acceptance report.

Primary source inspected: [Allikvere arXiv:2609.02604v2](https://arxiv.org/html/2609.02604v2),
sections 2–5 and the reproducibility disclosure in section 6. The source uses
k moving speeds and k+1 runners. Its 61-prime route is a subset of the earlier
111-prime computation. The 71-prime route has 19 first-block primes and 52
second-block primes, with 241 excluded only from the second block. The
15-runner proof depends on the established 14-runner result. The source itself
does not report full independent reimplementation or formal verification.

The reviewed local plan correctly keeps analytic, lower-case, complete-orbit,
binary-lift and terminal/CRT/shift dependencies open. Local p199 coverage is
not a theorem premise. Auditing the primitive/properness bridge and analytic
reduction first is a justified pivot: exact numeric margins are useful only
after those hypotheses and exhaustive modular domains are justified.

## Independent checks

- Direct pinned Python execution and TS canonical output matched byte-for-byte:
  5606 stdout bytes, exit 0, no diagnostics. The later actual no-write CLI
  independently passed in 1351 ms, with 48 ms recorded for Python and 6147
  generated report bytes. No retained artifact was written by this reviewer.
- Exact Fraction reconstruction of increments and K agreed. Minimum adjacent
  ratios are 1175/688 for n=13 and 847/513 for n=14, both strictly above 4/3.
  K14 equals 2289670297/97243124257250844122250000000000000000.
- Separate 80-digit Decimal logarithms corroborated both analytic-bound
  enclosures. Twelve further controls tested log1, signed powers of two,
  fractions, and 100-digit scale; all lay inside the TS rational intervals.
  Decimal is only a corroborating oracle, not mathematical admission.
- Log range reduction, signed interval scaling, the positive atanh tail,
  outward dyadic argument enclosure and outward rational wire rounding were
  inspected. No floating-point logarithm is used for admission.
- Exact prime sets, count, uniqueness and trial primality match the pinned
  source lists. They are separate target sets, not an additive prime union.
  lcm(2,...,15)=360360 is coprime to both prime products; only n=14 adds its
  logarithm to the required product.
- The resulting strict positive margin enclosures are [12.740568,12.740569]
  for 14 runners and [6.838811,6.838812] for 15 runners. These are conditional
  numerical implications, not closure of the shape or reduction proofs.
- One unsigned synthetic local receipt was admitted, as expected for the
  stated local trust model. Ten independently rehashed mutations were rejected:
  version, source version, global verdict, discharged assumptions, missing
  prime, forced divisor, K, margin, stdout byte count, and unexpected field.
  A valid-looking receipt does not independently attest interpreter execution.
- All four residue vectors in the operations note were independently checked:
  gcd(2786,coordinates)=7 and zero witnesses on the 2786-point grid. Since every
  coordinate and the modulus are divisible by 7, every integer lift is
  nonprimitive. This excludes precisely those four congruence classes from
  primitive counterexamples, not the rest of any fiber. The omit-one gcd
  properness/shift argument is distinct and retains its lower-case premise.

## Findings and repair status

1. The in-progress UI initially displayed K as product i=1..n, while the
   source and core correctly use i=1..n-1. Reported immediately to Main;
   the corrected n-1 formula and regression assertion are now present.
2. Initial Vietnamese dependency labels fell back to untranslated identifiers.
   The explicit bilingual map and human-readable section numbers are now
   present. Technical IDs remain diagnostic rather than translated claims.
3. Repeated view parameters initially failed the scalar selector and fell
   through to default Erdős–Straus computation/replay. In particular,
   `?view=allikvere-proof&view=allikvere-proof` is a string array, not the
   recognized proof selector. This consequential zero-dispatch boundary was
   reported to Main; final repair/retest is pending at this checkpoint.
4. Initial independent focused tests: 38/39 passed, two files, 33.50 seconds.
   The sole failure was the unchanged 5000 ms timeout in the dependency-label
   test, which repeatedly rendered and readmitted the full panel inside its
   dependency loop. No mathematical assertion failed. Render each locale once
   in that fixture; do not weaken timeout or production admission.
5. A transient prefreeze Python source-pin mismatch was correctly exposed
   during initial direct replay. The later no-write CLI verifies the matching
   c7a28efd319ffd670b5f8b229aba40be6e933386e29f0edebdabb6cafb0a3d78 pin.

## Coverage and limitations

R1/R2/R3/R5 received source/code/executable checks in this review. R4 received
code/render tests and revealed the repeated-selector defect above. Main owns
final requirement counts, full health checks, browser responsiveness and
acceptance. This reviewer did not run build, DB integration, live browser QA,
old large coverage collectors, author code, downloads, model/provider calls,
or a fresh agent campaign. One earlier longer inline mutation call yielded
without its process handle being retained; its unobserved result is not counted.

Conditional arithmetic cannot close analytic/global dependencies. Trusted local
storage, hashes and unsigned replay receipts are not external execution
attestation. No novelty or published-theorem certification follows from these
checks. Historical report verdicts and coverage counts were not rewritten.

## Checkpoint closure after repairs

The repaired route marks repeated/unknown/empty selectors invalid before any
legacy scope parse or arithmetic dispatch. Six malformed-selector tests now
assert an alert and zero legacy/ES/subprocess calls; valid VI/EN proof selectors
retain zero dispatch and existing authorization/development gates. The
dependency fixture renders each locale once, with no timeout/cap weakening.
The formula and bilingual repairs remain present.

Fresh independent focused rerun: **45/45 tests passed in two files**, 19.62
seconds, start 18:07:47 local. Plan/arithmetic 27; panel/route 18. Fresh no-write
CLI passed again in 1354 ms, Python 52 ms, unchanged exact 5606-byte stdout
with SHA-256 4a7eccf7522d1aa4c493189ab0665145a3facb4d995e9aaa4f6dfeb4d3c0b790.
These observations supersede the pending defects and initial 38/39 result,
without erasing that test history.

Reviewed snapshot hashes:

| File | SHA-256 |
| --- | --- |
| math-lrc-proof-plan.ts | 650d55595ad689ce4726ca6c84f5772d543027c95df7121b1e6cc2747c335c9f |
| replay-lrc-proof-arithmetic.py | c7a28efd319ffd670b5f8b229aba40be6e933386e29f0edebdabb6cafb0a3d78 |
| allikvere-proof-audit.ts | dc4d43f6fb90b56a0730f9e43dd28425e9a56e61a49994be37145b132a1397e6 |
| math-lrc-proof-panel.tsx | f6294eee739b342d35dae36df5d82f41ca3bc1d41efedb919f849049b0835b8c |
| math-lrc-proof-plan.test.ts | 6b92dfa25818023268da56bb0fb0ada26976e26a326fc92cca140bb11dbda25e |
| math-lrc-proof-panel.test.ts | c11412a25be41dea1433b9a15c1fedad5e76e72f17919782be325aec1da68746 |
| retained-proof-arithmetic.json | 8f0d79ea33d484bcbd9e966096e91b0af4f7081fe46b4e3fb554f38bd2108962 |
| math-tools/page.tsx | 596ae445805445c79139ea9ee392ed00bf428b1d3e489415d463be50cbb4694a |

Reviewer result: **PASS_WITH_SCOPE_LIMITS** for R1–R5's reviewed local boundaries,
with no remaining consequential finding in this snapshot. Main separately
reports full lint/typecheck and live 1366/320 px browser checks; those are not
new runs by this reviewer and Main retains final acceptance responsibility.
Full analytic/properness/lower-case/global-domain dependencies remain OPEN,
full theorem reproduction NOT_ESTABLISHED, novelty paused. This is a tactic
pivot and conditional arithmetic reproduction, not another framework or a
fresh autonomous research campaign.

Main confirmed the UI freeze after this rerun; the frozen panel/test/route
hashes match the reviewed snapshot above. No further reviewer work is required
inside this bounded TIP; future full-proof dependency review is a separate
research obligation, not an assertion that the selected audit is completed.
