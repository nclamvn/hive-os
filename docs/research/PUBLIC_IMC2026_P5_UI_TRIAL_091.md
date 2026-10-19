# Public IMC 2026 P5 UI trial — 091

Owner explicitly requests E2E in the Codex browser after selection of IMC2026 P5.
Separate public capability trial, not blind benchmark, A/B, or novelty claim.
Target: an absolute C>0 such that every positive integers A,B admit a real p with
p(0)^2 > sum_{i=1}^A p(-i)^2 + sum_{i=1}^B p(i)^2 and deg p < C sqrt(AB).
Source: https://www.imc-math.org.uk/imc2026/imc2026-day1-questions.pdf
Official P5 solution not consulted before solver dispatch.

Existing authenticated manual UI; native prompt; fresh subscription Codex solver
<=240s, at most one critic <=120s and repair <=120s only for a concrete UI gap.
Total execution <=600s from dispatch. No paid API, tools/web/files inside math
roles, app transport activation, build, account/DB mutation, new infrastructure,
target substitution or mathematical retry. Retain raw prompts/events/outputs and
transport receipts separately from UI's unauthenticated upstream import claims.
Use NONE: installed exact adapters do not cover this theorem. Closure requires
actual browser path and mathematical assessment of all quantifiers, absolute
degree bound and strict inequality; prose is not formal verification. Consult
official solution only after candidates freeze, for assessment, not repair.

Status: CLOSED for the routed public UI trial (not formal mathematical closure).

## Completion — 2026-10-09, 10:40 UTC

Browser path observed: authenticated problem entry -> prepare prompt -> native
copy -> fresh subscription solver -> paste original JSON -> submit -> rendered
LaTeX argument -> native evidence copy. Existing tab remains open at
http://localhost:3000/w/mathematics-pilot-lab-156de0/research/lean.
UI disposition UNVERIFIED_ARGUMENT, 1 imported output, 0 exact checks, 0 app LLM
calls, unknown imported usage. This is a manual bridge, not autonomous transport.

One transport initialization attempt failed with EPERM before model dispatch;
PREFLIGHT artifacts preserve it. The same bounded read-only invocation ran after
platform permission review, without any sandbox bypass. Actual solver began
10:36:48.895 UTC, completed in 134.947s. Requested gpt-6.1-sol/high; effective
backend identity not established. Captured usage: input13486, cached9856,
output4145, reasoning2588. Exactly one completed turn; no tool events, malformed
events or transport failure. No critic/repair requested: solver gaps empty and
Main assessment found no concrete mathematical gap. No paid API or model retry.
All UI execution and assessment finished within600s of preflight start10:36:30.

### Mathematical assessment (Main, nonformal, not independent external grading)

Candidate supplies a complete explicit construction with C=20. For A<=B, q has
zeros at +/-1,...,+/-A and q(0)=1. Normalized Chebyshev factors at dyadic thresholds
t_j=2^j A<B have modulus <=1 on[0,B] and <=exp(-7A) beyond t_j: the arcosh estimate
and ceiling choice give denominator >=exp(8A)/2, and2<=exp(A) for A>=1.
In shell k, q's growth is outweighed by the first k+1 factors, yielding
|p(i)|<=exp(-3A(k+1)). Counting at most2^k A integers gives total squared tail
<=A exp(-6A)/(1-2exp(-6A))<=exp(-6)/(1-2exp(-6))<1. The denominator comparison
uses exp(-6A)<=exp(-6); all required other nonzero integer values vanish.
Finite degree <=2A+5sqrt(AB) sum_j2^(-j/2)<20sqrt(AB). This covers A=B with an empty
product and A>B by reflection. No finite sample stands in for these estimates.
No defect found in the quantifiers, denominator positivity, strict inequality,
shell coverage or degree bound. This is a reviewed proof candidate, not Lean
kernel verification, a community-accepted new theorem, or official contest score.

After the output was frozen and imported, official solution was inspected at
https://www.imc-math.org.uk/?item=prob5s&section=problems&year=2026.
It gives a different Chebyshev construction with C=8. The candidate's C=20 is
weaker but meets the exact task; originality and training contamination unknown.
Public one-case success does not establish methodology advantage or ROI. Here
the lean path avoided gratuitous critic/repair calls; the solver itself did the
mathematical work. No automatic vote was promoted into proof acceptance.

### Retained evidence and hygiene

artifacts/research/tip091/SOLVER.response.txt SHA256
76ef4b7686335420b4d9a8dd2a3ceab3b4ae0e2393bd86d0d47b8e7acf072e00;
SOLVER.raw.jsonl SHA25648905e74dd4aed34ff37fef672f082d3026241a677f85d2d2047f8f5df041365;
UI.evidence.json SHA2564424d9fb752c703d4743d20ef0636a3947a7bda1ddf22121932cb68bce6b32bd.
Evidence copy includes the exact original solver string; screenshot
artifacts/research/tip091/imc-p5-result.jpg visibly shows retained/unverified
status and rendered mathematics. Actual prompt includes UI text plus recorded
delivery-only JSON/length constraints; no mathematical hint was added.

Removed only the owned empty scratch directory
/private/tmp/codex-tmp-imcp5-20261009.bf1aYg after runner reaped its process.
No project copy, code edit, build, install, distDir, Docker, account/DB mutation,
Git, deployment, paid API or additional campaign. Existing dirty work preserved.
