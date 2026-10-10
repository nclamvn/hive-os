# TIP-080 — public permutation demonstration, recording preparation

Owner explicitly selected the public FrontierMath Tier 2 sample “A recursive
construction on large permutations” and requested implementation on 2026-10-06.
This is a new routing decision, not a continuation/relabel of TIP-079 or LRC.

## Commitment and acceptance

Root: PUBLIC_PERMUTATION_DEMO_080. Mode: CODEX_ASSISTED, human-operated local
bridge. Source: https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2.
For a word of distinct integers, recursively remove its maximum, process left
and right parts in that order and append the maximum; the empty word stays empty.
For a uniformly random permutation on n=10^12 letters, find the integer floor
of the expected number of adjacent values appearing in reversed order in the
result. Standard S_n means permutations on n letters; the source's “order n”
wording is not interpreted as the group cardinality. Main saw the public
statement and technique hint, not the selected Solution control. This is not a
blind benchmark, an official FrontierMath score or an open-problem discovery.

Preparation closure: an authenticated unstarted DRAFT page, immutable task,
honest provenance and sequential controls; independently reviewed source,
focused hostile tests, actual browser/read/export checks. No filled-in answer
or prerecorded model progress may be presented as live work. Engineering fixtures
are visibly ENGINEERING_ONLY, separate from the one scientific slot.

Scientific closure after the human is recording: exactly one authenticated
start, at most four fresh roles ATTEMPT, CRITIC, FINAL, POSTREVIEW, total wall time
900 seconds from Start, no paid API, no retries/replacements/task swap. Preserve
the exact imported originals and actual model/usage/trace evidence where observed;
unknown upstream telemetry stays UNKNOWN. Correctness requires mathematical
argument review plus the separately reviewed fixed arithmetic checker, not just
samples or hashes. Failure/inconclusive is admissible and must remain visible.

Do not start scientific roles during preparation. Tell Owner when DRAFT is ready;
Owner's recording-ready signal precedes Start. Recording is Owner's only necessary
operation; Main performs the normal browser workflow. No API key required.

## Implementation decision

Use existing durable CommandRecord/outbox and tenant/storage boundaries, zero new
tables. A successful root command is the immutable ledger anchor; serialize each
stage with a root row lock and expected-cut/hash-chain checks. Four irreversible
role reservations and bounded UTF8 .txt imports. Bind current actor, workspace,
mission, fixed task, source cut, deadline and provenance. Deterministic fixed
prompts include only the same-run predecessors; no caller prompt/provider/path
or executable endpoint. Revoke/expiry refuse new admissions; external Codex work
cannot be forcibly cancelled by this manual bridge. Late outputs never count.

Retain exact received import bytes before parsing, with immutable digests and
private export. Do not claim cryptographic authentication of upstream Codex
output. The reviewer is a separate fresh context, not a guarantee of independent
training or a formal proof. Checker runs reviewed fixed code, never candidate
code, and explicitly exposes its trusted mathematical lemma/nonformal ceiling.
Ledger immutability is enforced by the reviewed application/hash-linked cut, not
an assertion that a database administrator or host owner cannot rewrite history.
Host operator and database administrators remain trusted in this local pilot;
coordinated datastore rewriting is outside its threat model, not “tamper-proof”.

New module/routes are separate from079. Never enable079's blocked native lane,
reseal its bundle or overwrite old runs. New source admission is required for080.
No generic ManualBridge API weakening, migrations, production DB or user history
cleanup. Normal auth, Origin/CSRF, RLS, role and tenant gates remain.

## Design brief before implementation

Precision Instrument HIVE styling: existing Inter/IBM fonts, semantic navy/teal/
amber tokens, light/dark and VN/EN, no global CSS/font replacement. Clear formula
hero and n=10^12; real durable stage timeline; proof/critique reading panel and
checker/assumptions/export controls. Compact responsive layout, keyboard/focus
visibility, no fake animation/timers. DRAFT prominently has no model result.
Always show CODEX_ASSISTED/operator-import disclosure and public-sample ceiling.

## Builder authority and limits

Main is Contractor: docs, coordination, independent review, test/browser evidence;
Builder owns product code. Read relevant installed Next16.2.11 guides before
code. Implement smallest fixed bridge, tests and safe availability guards.
Main controls builds/DB/server/model effects. Builder may run focused pure unit
tests <=120s each and type/lint <=180s, aggregate preparation tests <=600s; no
model effects. Main may run one new isolated QA build <=600s with actual logs,
then bounded browser acceptance. New TIP080_QA profile may share the exact13 QA
trace exclusions and src-only PostCSS optimization, retaining ordinary/076/079
behavior. Preserve source changes/failure evidence; no automatic bound widening.

Never open/stat/follow artifacts/research/lrc-p139-attempt5-grant.json or
artifacts/research/lrc-p139-attempt5. Apply the existing restricted OS read profile
to actual build/server/checker/capture effects. It is not full no-tools containment.
No paid API, git/push/deploy/billing, new research campaign or079 native activation.

Independent QA must cover current auth/tenant/Origin, forged transitions,
concurrent/double start, duplicate/altered imports, deadline/revoke, immutable
exact export and restart recovery; UI checks include320px, both themes/languages,
KaTeX and keyboard. Do not claim full acceptance when evidence is incomplete.

Completion report separates PREPARATION_READY, scientific NOT_STARTED and actual
remaining gates. Owner's direct “chốt chọn… triển khai ngay” is the approval for
this consolidated fixed-task implementation; no paid transport or ceiling beyond
the stated envelope follows.
