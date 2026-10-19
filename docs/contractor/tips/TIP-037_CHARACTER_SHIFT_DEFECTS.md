# TIP-037 — Character-guided shifts and general-prime defect certificates

2026-10-01. Depends on TIP-036; owner approved continuation with “tiếp tục”.
Bounded local mathematical research, no root change. Reuse the established
coprime divisor construction, not a new claimed universal parametrization.

## Decisions and frozen scope before execution

Study targets in this order: 200023321,200602081,200656681,131433121. First
three are retained TIP-036 menu misses; last is an exposed old control. This
is deliberately selected development data, not held-out benchmark evidence.
Use every prime h<=107,h=3 mod4, in increasing order, including nonsafe primes.
Do not enlarge the bound after seeing results. Compute all target–shift rows
as matched controls; rank the subset with Legendre(p/h)=-1 first. Record the
smallest successful h in that subset separately from the full pool's smallest
successful h. No implication from Legendre(p/h)=+1 to impossibility is allowed:
TIP-036 already contains successes in that class. A negative character ensures
T=(p+h)/4 has odd QNR valuation mass and avoids a pure-QR factorization, but
does not ensure a partition or a success at finite depth.

For a miss, compute the exact multiplicative stabilizer H of the full signed
image S(T;h), quotient index n=(h-1)/|H|, visible valuation mass V outside H,
and each visible factor's quotient order. Independently derive/check proposed
necessary conditions: n even; if h=3 mod4 then n=2 mod4; with some QNR factor,
n>=6; 2V<=n-2; every factor q^e outside H has quotient order>2e+1. Treat these
as candidates until skeptical proof review. Analyze arbitrary prime h=3 mod4,
not a silently imposed safe-prime hypothesis. Preserve any actual contradiction
as non-COMPLETE investigation data. No novelty is assumed; known Kneser machinery
and overlapping external N=pT notes must be credited, with T-only scope explicit.

Limits per implementation:60 monotonic seconds,1000 rows,2000000 primary
state insertions,50000000 independent pair checks,2MiB output. Partial retains
completed prefix/exact pending input; it cannot PASS. Serialization and final
receipt checkpoints count, not merely discovery. Fixed input/program paths;
no model-supplied executable/code, API, DB or environment credential inheritance.

Primary uses factor signed-image DP/canonical ordered pairs. Independent Python
uses positive coprime divisor pairs, independent primality/factors and direct
stabilizer/quotient calculations; no TS factors or generated images imported.
Compare full images, all canonical strict tuples, character decisions, exact
stabilizers, visible factors/orders, routing summaries and manifests, not just
hit counts. Source-pinned verified bytes, isolated Python and truthful separate
source/runtime provenance. Preserve TIP-036 tools/pins unchanged.

## Requirements

R01: fully quantified general-prime defect proof or scoped exact refutation,
known construction and unused/repeated valuations retained; root bridge open.
R02: frozen four-target/full-prime pool, exact character preference and matched
controls; QR preference exclusions never labeled mathematical misses.
R03: exact bounded miss certificates and strict hit witnesses; new/old fields
and scope tamper, malformed domain, subgroup/order and resource controls.
R04: source-bound independent fresh full-row replay, partial/deadline/output
and missing-tool paths fail closed. No fake authenticated/campaign receipts.
R05: separate Builder completions/skeptical/Contractor acceptance, quantified
tests/type/lint/manifests and honest literature/scientific limits.

Outputs: new standalone character-shift primary/audit, separate Python/checker/
replay and unit tests; mathematical note and three verification reports. No
Next/app/UI change, ledger write, tool admission, queue/worker/model campaign,
paid API, dependency/schema change, Git commit/push or deployment in this slice.
No new approval ceremony: continuation stays within the approved local root
research. A materially expanded root/resources/public claim requires routing.
