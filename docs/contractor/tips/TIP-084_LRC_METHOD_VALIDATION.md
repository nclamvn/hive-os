# TIP-084 — clean method, two exact LRC demonstrations

2026-10-09 · LRC_METHOD_VALIDATION_084 · METHOD_VALIDATION (not global reproduction).
Owner requests cleanup/strengthening against drift, then an impressive LRC test.
Predecessor TIP-083 closed. Old whole-p139 and private R3 remain unaccepted and
frozen; no attempts, time ceilings, source grants or live execution flags reset.

## Exact output / blueprint

Two preselected mathematical outputs, not more partial prime branches:

1. **14 total runners / 13 moving speeds:** v=(1,...,11,13,24). Produce t=1/14
   with minimum distance1/14 AND an exact closed-interval certificate covering
   the entire time period [0,1], proving for every real t some speed has distance
   <=1/14. Together these establish the exact max-min, not just sampled times.
2. **15 total runners / 14 moving speeds:** for Q=10^30, ten speeds
   5Q(1,3,...,19) and four exceptions (10Q+1,8Q+1,6Q+1,4Q+1).
   Start t0=1/(10Q), then consider five physical shifts t0+j/5. Derive and verify
   the first common good shift. Write and independently critique the argument
   for EVERY positive multiple-of5 Q; replay the declared Q, not arbitrary cases.

Primary source Allikvere arXiv:2609.02604v2 §4.2 (Goddyn–Wong tuple) and §4.4
(few-exception shifts). Published results/hints exposed, not blind/novel benchmark.
This tests strategy choice and certificate trust. It does NOT discharge p139
G/C/T/B, all61/71primes, lower-LRC assumptions or global14/15.

## Minimal implementation

Reuse standard Python integers/Fraction. One small trusted offline producer/CLI,
one independently implemented verifier that never imports producer, one focused
test file, one package alias research:lrc. No new framework/parser/manifest/DB/UI
or security mechanism. Verifier binds the two exact cases and their thresholds;
it recomputes all distances and interval endpoints from integer facts, checks
coverage without gaps, rejects unsupported/forged scope. No floats/eval/exec.
CLI displays strategy, witnesses, exact bounds and limits. Preserve one compact
actual output plus one proof/review/completion record. No metadata census.

## Acceptance / actual anti-drift checks

- A1: complete continuous-time tightness certificate for the EXACT14tuple.
- A2: actual15tuple witness checked independently; documented all-Q proof has
  concrete non-own critique and no hidden lower-LRC premise.
- A3: wrong shift, missing coverage, altered threshold/tuple and promoted global
  claim rejected; equality is GOOD for witnesses and legal in upper-bound cover.
- A4: early syntax/tests + actual CLI; any failed required case makes whole demo
  nonzero/PARTIAL, not replacement by an easier case. All outcomes retained.
- A5: default workflow/direction documents cleaned in place, no new gate stack;
  old protected evidence/runtime permissions unchanged.

Bound: scoped result or obstacle within40min of case activation; deadline
06:58:00UTC. Validation commands<=120s each, aggregate<=600s. Input/output
<=64KiB, cover<=512arcs, integer strings<=100digits; trusted fixed-case producer
only; standard child timeouts, not a hostile-code sandbox. No author code, API,
build/install/browser/DB/Git, old p139 attempt/grant/private/source/native tree
or R3 imports/effects. No destructive cleanup of existing files. Current checkout
only, no scratch copy/newdistDir. Ordinary repairs allowed within this scope,
not new cases or acceptance weakening. Stop at completion/deadline; no campaign.

Vibecode minimal: Builder implements, separate critic checks math/actual source,
Main verifies. This TIP and one completion are the only new process documents.
