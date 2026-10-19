# TIP-072P Builder completion

Date: 2026-10-05. Role: Builder, Vibecode Kit v6.2.
Status: DONE within the assigned offline Python diagnostic/test scope.
Independent review, mathematical acceptance and final P6/Main acceptance are
separate; this report does not grant production or scientific admission.

## Contract and ownership

Read fully before implementation: AGENTS.md, current CODEX_CHAT_HANDOFF.md,
Vibecode Kit skill/report protocol, installed Next.js Vitest guide, sealed TIP.
Read the complete final Main proof and mathematical-only addendum before freeze.

- TIP-072P SHA-256:
  `b3359a453810750e0a66f72b6f4201b301e3114ba3bc65abed40a7e13d764992`.
- Mathematical-only addendum SHA-256:
  `31e421eccbdb639298d2f912427543b4be97ef536def810b0177ef1c18505f10`.
- Main proof SHA-256:
  `7c33eed92c999d18e1acfcda8748c5f88d2cbb6316166f68422c797b49182be6`.

Created ONLY:

1. `scripts/research/lrc-adaptive-phase-lock-replay.py` — self-contained stdlib
   Fraction helper and fixed-case CLI. No old arithmetic imports or application
   integration, no child processes/file reads/writes/network in the product.
2. `tests/research/test_lrc_adaptive_phase_lock.py` — isolated unittest with its
   own Fraction arithmetic, full matrix expectations and actual CLI controls.
3. This new completion report.

No preexisting files modified by this Builder. All dirty prior work preserved.
No TS/Core/app/UI/process-source-guard/worker/registry lane added.

## Executable outcome and coverage

Six fixed cases are retained completely: five phase-lock successes and one
UNKNOWN_GATE_NOT_APPLICABLE. The UNKNOWN case separately retains valid full
observed witnesses at original shifts 1 and 3; it is not an LRC failure.
Every case retains its lower context, ordered pair labels, actual speeds,
delta/radius/beta/gate/rounding data, whole original 5x14 matrix and assurance
scope. Each success additionally retains its complete aligned 5x14 matrix,
pair BAD sets/union, all GOOD shifts and lowest physical witness/full minimum.

Retained arithmetic: 6 original matrices + 5 aligned matrices = 770 coordinates.
The six lower witnesses additionally retain all 54 reduced-speed distances.

| Case | Delta | Nearest integer | Final witness | Full minimum |
| --- | ---: | ---: | --- | --- |
| Exact pair | 0 | 0 | 11/50, shift 1 | 1/10 |
| Already aligned, below dominance | 50 | 1 | 11/50, shift 1 | 1/10 |
| Positive radius boundary/tie | 675 | 13 | 148/675, shift 1 | 13/135 |
| Negative radius boundary/tie | -675 | -14 | 149/675, shift 1 | 1/15 |
| Congruence subfamily z1 | 1245 | 25 | 274/1245, shift 1 | 8/83 |
| Sufficient gate unknown | 5 | 0 | Original 11/50, shift 1 | 1/10 |

The negative radius case reaches equality exactly at lower speed 45; equality
is GOOD. Both signed half-integer cases choose the LOWER integer, not round-to-
even or toward-zero. Only the largest LOWER speed determines the radius.
The already-aligned case demonstrates why dominance alone is too restrictive.

Builder executable portions of P4/P5: 2/2 implemented and self-tested.
P1/P2/P3 universal proofs are in Main's separately reviewed dossier; finite tests
do not replace them. P6/final whole-TIP acceptance remains Main/reviewer owned.

## Self-tests and actual replay

Final isolated selector: **36/36 unittest methods PASS**, 1.259 seconds.
Command: `python3 -I -S -B tests/research/test_lrc_adaptive_phase_lock.py`.
All commands ran with these exact flags set to `false`:
RESEARCH_WORKER_ENABLED, MATH_PILOT_QUEUE_ENABLED, LRC_CAMPAIGN_LOCAL_ENABLED,
RESEARCH_OPENAI_ENABLED, RESEARCH_CODEX_LOCAL_ENABLED, SANDBOX_DOCKER_ENABLED.

Coverage includes independent complete certificates/full matrices for all six
cases, final witness values, closed radius/equality, signed ties, beta versus
dominance, UNKNOWN versus observed witness, lower versus exceptional maximum,
detached inputs, reordered labels, signed tau, and valid nonprimitive scaling.
Seven z samples [0,1,2,3,10,100,1000] independently reconstruct full aligned
matrices. These are instance tests, NOT the basis of the infinite-family proof.
Independent lower growth within the same congruence class is also checked to
destroy the gate without being mislabeled an LRC failure.

Hostile controls refuse false pair/unit/divisibility/lower/count/distinctness,
speed/rational/label/metadata types and bounds, caller verdict fields, subclass
hooks, nonstring keys without hash-hook invocation, oversized metadata before
traversal, invalid budgets, whole-report shared operation exhaustion, deadline,
256-bit component overflow and whole-output overflow. Thirty actual isolated
flag-fault CLI processes (five invalid values per flag) produce exit 2, empty
stdout and constant CLI_REFUSED stderr. Custom CLI inputs/options are refused.

Actual final fresh CLI: Python `-I -S -B`, absolute known source, empty inherited
environment replaced by exactly the six OFF flags, shell false, stdin DEVNULL,
5-second subprocess timeout. Exit 0, stderr 0 bytes, full stdout **20,211 bytes**
including newline; canonical mathematical body 20,067 bytes. Complete JSON
parse and semantic hash recomputation PASS. No matrix/case/field omitted.

- Semantic SHA-256:
  `32f7111e4059850f48d09ea122a5d6cbc4f46ca3250ce426b95055672bef3a1b`.
- Frozen exact input list SHA-256 (sorted-key compact JSON):
  `7dd32cb1edf03805fe656aeb5d96edd4594de36188639a71f2b042b05d1eac69`.
- Recorded complete stdout SHA-256:
  `cff2617b6b01b033e1699172431df82cf4cec64b01e33b17ca2d02a29de66bfa`.
- Recorded arithmetic elapsed: 6.193375 ms; whole fresh process: 42.627625 ms.
- Charged operations: 88,553, including conservative final-encoding reservation.

Elapsed metrics are deliberately outside the deterministic semantic hash;
complete stdout hashes vary between runs because of those metrics.
All unchanged ceilings pass: 5 s / 2M charged steps / 32,768 complete output
bytes / 256-bit rational components. The shared budget is never reset per case.
Resource/flag/input failures emit no positive JSON. AST parsing of both new
Python modules: 2/2 PASS without cache writes. Repository typecheck/lint tools
are TypeScript/ESLint, not Python typing; no Python mypy/ruff executable found,
and no dependency installed. Whole-repository QA is Main owned/pending.

## Frozen source pins

- Product, 12,290 bytes:
  `de32c661d4d7c06fd4964c2e202f998de253ab4fe07bec50e053cd1e532ad622`.
- Tests, 19,496 bytes:
  `f3b7953503a22928a15f373536bfc202681a4fb87c5abc61779c77139ac49c39`.

The test pins and reads only the explicitly known product source; expected
arithmetic is independently written, not obtained from product helpers.
Local bytes/process consistency is NOT signed interpreter/host/source closure.

## Clarifications, limits and next work

Contractor confirmed gcd1 is NOT a necessary fixed-theorem premise; valid
nonprimitive tuples are accepted and gcd is recorded. This is a clarification,
not a relaxed unit/distinct/count/lower/pair gate. No representation/cap changes.
The approved addendum is mathematical-only: the specific infinite z subfamily
has prescribed-witness margin 8/83 (sharp for that construction), while the
generic adaptive theorem guarantees only 1/15. No executable claim is upgraded
to a generic strict-slack guarantee, tuple optimum or whole congruence branch.

No known P0/P1 in Builder's self-tested executable scope; independent review
may still identify issues. Global/formal/external/novelty/breakthrough remain
NOT_ESTABLISHED; this is not a proof of global LRC14/15 or an archived improper
branch admission. The next research task must address uncovered parameter
regions with a proved family predicate, rather than representative-only pruning.

No DB/session/API/provider/model/Codex child/private capture/scientific case/job/
M1/campaign/archive/Git write/commit/push/billing/deploy. No browser/UI E2E claim.
Old registry37/source ceiling42/ledger7/history/refutations/064 statuses and all
production gates untouched. Full072 remains PARTIAL/NOT_READY_FOR_M1;
agentLoop NOT_RUN and executionAuthority false.
