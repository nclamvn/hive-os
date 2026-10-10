# TIP-081A — V2 codec/admission source review

2026-10-07 · SAME081D8 engineering. Review is scoped to C1–C6 synthetic codec and
admission, not live source, AST, whole runtime or mathematical acceptance.
Reviewer: /root/v2_codec_security_review; Main source inspection independently.

## Contract review

C1–C6/AppendixA consistent with bounded JSON-text-only input and fixed synthetic
domain-label pins. No contract blocker; do not trust codec seals as live authority.
The allocation-audit label hash is NOT a complete adapter allocation-audit hash.

## First source review — NOT CLEAR, before checks

Two blocking findings:

1. Mutable performance.now lookup could invoke a replacement callback or fake time.
   Capture bound trusted node:perf_hooks clock before admission. Expiry tests must
   not replace the production clock; only a shorter primitive synthetic TTL may
   narrow its deadline. Real profile stays120000ms.
2. Fixed524288 scratch envelope was asserted without quantitative allocation
   costs/multiplicities. Need numeric before-growth admission for scanner/native
   parse/tree/canonical/hash overlap; a constant declaration is not evidence.

Main also identified full backing ArrayBuffer accounting (not view-only), scalar
grammar preflight before JSON.parse and last-clock monotonicity. Builder corrected
these before reporting the first draft ready. UTF8 timing modulo boundaries could
be skipped by multibyte strides; Builder changed to >=nextCheck thresholds.

Additional fixture refinements: literal raw negative-zero request; genuine foreign
module-instance handles; bounded raw text whose canonical surrogate escaping grows
past16KiB. No checks run before these findings/repair routing; they are source-review
findings, NOT test failures or a preserved atomic whole-source snapshot.

## Boundaries confirmed by source inspection

Decoded duplicate keys rejected before whole parse; named seals preserve source
hash; descriptor/profile seals recomputed; fixed pins/options; scalar grammar
excludes escaped/duplicate names; source private copied via captured intrinsic;
no target FS/parser/receipt issuance. Runtime entry always refusal. Caller-held
decoded/metadata output survives retirement: per-call/per-owner logical scope,
not process-wide physical/RSS cap. V1 archives/modules/config untouched.

## Final repaired-cut review

Repaired clock/TTL, scalar source accounting and flat canonical output reviewed
sound. Numeric codec bound introduced executable monotone counters instead of an
asserted envelope. Additional allocation gaps found before checks:

- Three split-based path scans could create3072component slots (24576 logical
  bytes) plus substring headers, beyond the reserved reflection allowance.
  Replaced with allocation-free scalar separator scan; V233 adds maximal paths.
  Reviewer focused path verdict CLEAR.
- Scanner per-character RegExp literals and per-scalar true/false/null array
  literals still allocated repeated objects without corresponding charges.
  Contractor routed hoisting into finite shared tool constants (or scalar tests).

These remain source-review findings, not executable test failures. First-cut
NOT CLEAR and subsequent findings preserved. Final hoisting review CLEAR: regexes
are finite module constants; scalar literal table frozen/indexed, no per-value
array/iterator. Numeric pre-growth guards and inventory agree under the stated
logical convention. C1–C6 source/test-design review CLEAR; no parser/RSS claim.

## Measured checks and final typing repair

First bounded package: syntax2/2 PASS;33/33unitcontrols1file PASS; lint3files PASS;
focusedTSC2errors. Always-throw helper inferred owner|undefined; Builder added
truthful @returns{never} comments to both fail helpers, no runtime/test casts.
replaceAll failed because Main's focused command omitted repository esnext libs;
Main aligned checker libs only, no tsconfig/test/product change. Peer focused
annotation/driver review CLEAR; original full cut/driver/logs retained in
TIP-081A_V2_CODEC_FIRST_CHECK.json.

Final bounded package: syntax2/2 PASS,33/33unitcontrols1file PASS, lint3files PASS,
focusedTSC0errors. New4files stable during checks;41repositorypredecessorpins
before/afterMATCH. Five fixed-root predecessor pins intentionally NOT READ; no
fresh46pin/fullroot claim. Final fullsourcecut/driver/logs retained separately.
Main accepts C1–C6 scoped codec/synthetic admission only;62OPEN unchanged.

Final read-only document review: counts/status/budget/pin scope and retained errors
agree. One next-proposal JSON wording could imply implementation rather than an
implementation plan; Main narrowed that prose to audit + implementation plan,
requiring new Owner routing before implementation/parser/source integration.
No code/check/budget changes. This documentation refinement grants no effects.

Peer confirmed corrected next-proposal line matches completion/checkpoints:
final document consistency CLEAR; scoped STOP/budget unchanged. Text-only review.
