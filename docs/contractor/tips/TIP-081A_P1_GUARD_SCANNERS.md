# TIP-081A — P1 synthetic guard kernel / fixed-source scanners

2026-10-07 · SAME081D8 engineering · P0 · Owner “duyệt và triển khai”.
Approved scope: P1 of REAL_CONSUMER_IMPLEMENTATION_PLAN revision2 only.
Dependency: TEXT_INSPECTION_COMPLETE_ALLOCATION_ENFORCEMENT_OPEN; parser OFF.
Working directory /Users/os/hiveos; preserve dirty work. Main is Contractor,
Builder implements new modules/tests; independent readers review before execution.
No new product roadmap, research target, authority or resource ceiling.

## Exact output and ownership

Implement new synthetic-only private guard/scanner modules, allocation convention,
focused adversarial fixtures and Completion Report. Existing Acorn/v1 source store/
verifier/manifest/v2 codec/admission/tests/config/history are frozen. Do not import
or invoke Acorn, target payload or real source; no authentic-source bridge/issuer,
AST/extraction/replay/whole-graph claim. P2–P5 NOT GRANTED.

Public fixture APIs must have exact arity and reject nonprimitive metadata before
reflection/coercion. Use same-instance opaque handles; private text/state only.
Synthetic primitive strings are permitted input solely for fixture building blocks;
they never authenticate real source or existing leases. No source getter, public
AST, caller callback/plugin/options/clock, dynamic imports from caller, or eval.
No real-mode profile or accepted syntax receipt. Parser entry returns/refuses
ALLOCATION_COVERAGE_OPEN and cannot be enabled by a fixture flag or guard success.

## R1 — Allocation convention and guards

Document literal logical costs (NOT V8/RSS) for object headers/property schema,
array headers/slots/resize overlap, dictionaries/keys/rows, helper records/frames,
source/derived UTF16 strings and old/new concat overlap, fixed tool/state/error/
output scratch. Reserve before construction/growth; safe integers excluding -0,
NaN/infinity/fractions; subtraction-before-addition/multiplication overflow checks.
Each actual module allocation occurrence maps to guard/reserve ID and fixture.
Fixed init/WeakMap/module cost must be declared and bounded, not assumed zero.

Ledger counters/categories are private; monotone producer debit; pops/deletes/
failed tentative operations and overwritten aliases do not refund. Retiring
producer categories transfers to unreclaimedProducerBytes without double count;
replay reservation adds to retained producer charge (reservation only, no replay
implementation). Count/bytes/depth/entry caps conjunctive. Synthetic byte cap may
be lower than67108864, never higher; node200000/entry20000/depth128 upper limits,
stricter synthetic limits may be explicit. No allocation fit claim for real source.
Guard/refusal state and bounded output must be reserved before work; no source
excerpt/error-stack/large failure-formatting on over-budget paths.

## R2 — Time, authority and cleanup

Captured trusted monotonic clock, default/max120000ms; optional primitive shorter
TTL only. Original deadline is never renewed by reads/scans/reserve/retirement.
Bounded character/operation checkpoint interval, no recursive comment skipping.
Cooperative controls are not an OS sandbox: synchronous native work requires a
future supervised driver. Clean up after expiry/refusal without renewal. Forged,
foreign-module, retired handles and unexpected arity/options refuse. Bound owner
count/module-level retained state, and record isolation/common-mode assumptions.

## R3 — Scalar scanners and supported semantics

Implement index/span-based whitespace+comments (including script legacy HTML
comments iteratively, module exclusions), line-break/ASI lookahead, directive
prologue/strictDirective detection and escaped-identifier lookahead. No whole-tail
slice, split, regex exec/test/match/replace on target text, unbounded concat,
native target RegExp/BigInt conversion, or string-to-object coercion. Fixed
internally known grammar/profile semantics, not caller-chosen ECMAScript options.
Each loop checks clock and input positions; errors/EOF/comments/escapes refuse
honestly or return bounded spans/status; returned records are admitted before
allocation. Valid unsupported syntax yields UNSUPPORTED_BOUNDED_SYNTAX, not
false/no-match or invalid-JavaScript claim. No source-derived text escapes.

Pin differences/unsupported cases in docs and tests. ASCII+escaped ASCII keyword
lookahead may have a declared support boundary, but Unicode cases cannot silently
be accepted with incorrect ID_Start/ID_Continue; implement correct scalar/table
handling or explicitly refuse them. Raw exact “use strict” must be distinguished
from escaped spelling. Account continuations after quoted expression that mean
it is not a directive, and ASI linebreak/comment versus operators. This is only
building-block semantics, never full JavaScript syntax analysis.

## R4 — Exclusions and scope enforcement

Nonprimitive input/options/callback/clock values rejected before getters/proxy
traps. Scanners must not call native target RegExp/BigInt, load modules or execute
source. Regex/BigInt entry preflight cannot present token-only detection as full
context-sensitive syntax classification: if context is ambiguous, refuse OPEN.
Public public-source scanning results remain SYNTHETIC_ONLY / parserDisabled;
no synthetic seal/pin adoption into real lane. Fixed output/control state charged.

## R5 — Required focused fixtures (UNRUN until source review)

Unique control IDs covering: exact byte/+1 and integer overflow; resize old/new
overlap; keys/dictionary fanout; derived string/attempted allocation debit; no
refund/category transfer/replay overlap; node/site/depth boundary/+1; long scans
and EOF; comments/CRLF/LS/PS/nonASCII whitespace; script legacy HTML vs module;
unterminated comments/quotes; raw/escaped strict directive and ASI continuations;
escaped identifiers/digitstart/Unicode refusal; hostile getters/proxies/options/
arity; captured clock/global monkeypatch; real expiry/cleanup/no renew; foreign
brands; parser stays OFF; regex/BigInt unsupported before conversion. Check
classification invariance at fixture padding boundaries and spans. No Acorn
oracle execution. Independently reviewed literal expected results, not generator
and checker sharing scanner implementation.

Builder supplies new focused Vitest config with setupFiles empty and exactly the
new fixture include, no config modifications/broader tests. No checks run by
Builder/reviewers; Main runs bounded reviewed commands after code review.
Do not retest historical baseline; do not replace failed evidence with a passing
count. Retain first failures, source cuts, drivers, timings and final results.

## R6 — Acceptance, reporting and resources

Given approved P1 and reviewed new code, when Main runs focused synthetic checks,
then report R1–R6 implemented/total and named scenarios pass/fail. Build/E2E/real
parser/source integration are UNRUN, not PASS. Report missing semantics/guards
as PARTIAL; keep parser OFF. Technical syntax/lint/focused type checks may be
combined when bounded; no full application type/build run. Independently reviewed
before-growth inventory required before any executable check.

Aggregate starts782840.4011670001/900000ms;117159.59883299994ms left. All measured
helpers/checks plus conservative capture overhead counted; no reset/retry/new
grant. Main owns budget and dispatch, reserve safety margin for final reporting.
Stop at reviewed P1 completion or cap/refusal; implementation effort is not a new
execution allowance. No actual-root/.env/protected attempt5/failed-root payload
reads, tree/NFT/native scan, server/browser/DB/providerAPI/Git/math/publication.
Do not read/stat/follow artifacts/research/lrc-p139-attempt5-grant.json or
artifacts/research/lrc-p139-attempt5. No target eval/import/resolve.

Completion minimum: changed files, literal cost/occurrence inventory, source-review
findings/fixes, actual unique fixture counts/first-final evidence, elapsed budget,
remaining semantic/enforcement/real authority gaps and STOP. FullRuntimeClosure
NOT_ACCEPTED / caller graph OPEN /62 predecessor OPEN unchanged. P1 completion
is not full grammar allocation coverage and grants no P2 transition.
