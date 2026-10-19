# LRC research pivot: reproduce the theorem, not local cover mass

## Decision and scope

The Owner approved changing the inefficient tactic on 2026-10-03. This note
supersedes the default next-work recommendations in TIP048–050, without changing
their historical evidence, scopes, counts or conclusions. Further p199 cover
expansion is not the selected continuation. It is still available for explicit
diagnostic inspection. No background research job or model campaign is launched.

Use three separate labels: source claims a result; local independent reproduction
is incomplete; novelty is not established. A correct software checker is useful
infrastructure, not evidence that a model solved a new theorem. No tuple-count
percentage is a theorem-completion percentage.

## Version and proof map

Primary reference: [Allikvere v2](https://arxiv.org/html/2609.02604v2),
24 September 2026. Here k is the number of moving speeds: LRC(k) concerns
k+1 total runners. Sections 2–5 supply normalization, analytic bounds,
modular reduction, exhaustive generation/lifting and final contradiction.
The 14-runner v2 route uses 61 primes from a larger 111-prime archive.
The 15-runner route has 71 primes and separate level-15/shift obligations.
The source's claims are not a HIVE certification; §6 explicitly discloses that
the full computation has not been independently reimplemented or formalized.

Local next work must address proof dependencies, not arbitrary remaining boxes:

1. Review the primitive/distinct-speed normalization and Lemma2.2 properness
   bridge, with exact lower-case assumptions. A time-grid witness is only ONE
   closing mechanism. Review the few-exception shift separately for 15 runners.
2. Audit the analytic chain through Theorem3.8, including the universal shape
   bound and product minimization, not just its numerical constants.
3. Reconcile archive versions and audit Proposition4.2 complete two-branch
   generation before interpreting terminal certificates as global coverage.
4. Replay the required prime computations with complete binary/terminal trees;
   handle all conditional dependencies explicitly. Preserve partial status
   until every required domain is covered.
5. Compose these premises with the exact arithmetic contradiction. The
   15-runner route depends on the completed 14-runner result; a tiny control
   or finite local witness is not that premise.

The new plan is an operator-visible research direction, NOT an authoritative
agent-cycle event or a launched autonomous campaign. The current LRC agent
protocol remains bounded finite evidence; no new global evidence is injected.

## A mathematical reason to stop chasing every grid miss

This observation is Main's written reduction review, not a new discovery,
formal proof, or replacement of an immutable report. Let M be divisible by
g>1 and let every coordinate w_i of a residue vector be divisible by g.
Every integer lift v_i=w_i+M z_i is also divisible by g. Consequently
gcd(v_1,...,v_k)>=g, so the class contains no primitive integer vector.
It cannot contain the primitive counterexample used in the global proof.
No fixed-grid witness is needed to establish THIS exclusion.

Why this is legitimate normalization: dividing all integer speeds by their
positive common gcd preserves witness existence by rescaling real time.
This does not guarantee a witness on the original finite time grid. Thus
NO_GRID is compatible with the global statement and is not a refutation.

For the four fixed digit vectors in the retained FULL p199 parents,
d_i=r_i mod7 and w_i=r_i+398d_i. Since 398=-1 mod7 and M=2786=199*14,
every w_i and every integer lift is divisible by7. Main directly reconstructed
the following vectors from the immutable TIP048 scope (no author executable):

| Parent | Fixed residue vector modulo2786 |
| --- | --- |
| tight0 | 1792,798,2590,203,602,1001,1400,406,2198,1204,210,2002,1008 |
| tight1 | 1792,798,2590,203,602,1001,1400,1799,2198,1204,210,2002,1008 |
| tight2 | 399,798,1197,1596,1995,2394,7,406,805,1204,1603,2002,2401 |
| gw0 | 399,798,1197,1596,1995,2394,7,406,805,1204,1603,2401,1218 |

All52 entries are positive multiples of7, and M is a multiple of7. This
excludes these FOUR entire integer congruence classes from primitive targets.
It does not classify the rest of any 7^13 fiber, replace the conditional
omit-one gcd rule, or establish LRC14/15. Old reports are not relabeled.

For omit-one gcd, primitive normalization instead ensures that the exceptional
speed is not divisible by the full common gcd. Lower-case LRC supplies good
time for the other speeds; a common shift retains those coordinates and moves
the exception through a nontrivial cyclic grid. This is a different argument
and must not be silently marked replayed by the preceding easy exclusion.

### Written bridge audit, with acceptance limits

Main's direct argument for the omit-one case is as follows. Let k>=3 and
assume the lower LRC cases. For a positive primitive tuple, suppose g>1
divides every speed except v_i. Then gcd(g,v_i)=1: any common divisor would
divide the whole tuple. There are m<=k-1 distinct other speeds. The lower
case supplies t0 with their distances at least1/(m+1)>=1/k. At the g shifts
t0+q/g those distances do not change. The exceptional speed visits all g
equally spaced residues because multiplication by v_i permutes Z/gZ. They
cannot all lie in the bad OPEN arc of length2/(k+1)<=1/2: an arc containing
all those grid points has length at least1-1/g>=1/2, including the harmless
equality case. Some shift therefore witnesses every speed at threshold
1/(k+1). The assumptions g>1, primitivity, lower cases and a COMMON shift
are indispensable. This review does not provide the lower-case certificates.

For fourteen moving speeds, a separate prime divisor d can fix14-e speeds
and move e exceptions through complete d-point grids. If e>=2 and
e*ceil(2d/15)<d, the union of the exceptional bad-shift sets cannot consume
all d shifts. The fixed coordinates use lower LRC at14-e<=12 speeds.
This establishes the few-exception closing mechanism conditional on those
lower cases. Primality of d matters: d not dividing a speed only guarantees
an invertible residue for prime d. For d3 this admits e2; for d5 it admits
e2,3,4. Equality in the union bound does NOT establish a good shift.

These arguments were examined in a separate same-model skeptical context.
They are written proof reviews with explicit assumptions, not machine-kernel
proofs or independent mathematical expert certification. No report or agent
ledger is changed to a new accepted status. The missing global task is to
bind these legitimate mechanisms to EVERY required terminal residue class,
with reviewed lower-case dependencies and exhaustive generation certificates.

## First bounded deliverable

TIP051 independently reconstructs exact rational numerical constants and the
final prime-product comparison. The log enclosure uses range reduction to
x in[1,2) and z=(x-1)/(x+1), then

    log x = 2*sum(j>=0) z^(2j+1)/(2j+1).

After N terms the omitted positive tail is at most
2*z^(2N+1)/((2N+1)*(1-z^2)). Signed range-reduction multiples require outward
interval operations. Integer/rational arithmetic avoids floating-point log
admission. These computations check numerical implications UNDER the stated
analytic and modular premises; they do not prove those premises. Fresh Python
Fraction replay is a second implementation, on the same trusted local host.
Source/output hashes are byte-integrity evidence, not signed execution or
mathematical expert certification.

## Stop rule and research acceptance

Before a new computation, state the exact global obligation it addresses,
the dependency already accepted or explicitly assumed, the discriminating
outcome and why the proposed work can close that obligation. If it only
increases known local proof mass, defer it unless needed for that closure.
Prefer a reduction that removes a whole class over enumerating its members.

Acceptance has two distinct future endpoints: (a) every premise of a selected
published proof route is explicitly reviewed/replayed; (b) a NEW structural
claim has a complete proof and primary-literature comparison. Only(b) can
support a novelty claim. No automatic claim of publication readiness,
research breakthrough or 100% reproduction is made by completing TIP051.

## Delivered checkpoint

TIP051's conditional arithmetic is independently matched by fresh TS/Python
implementations:61 primes/14 total runners give margin[12.740568,12.740569];
71 primes/15 total runners with forced divisor360360 give
[6.838811,6.838812]. These positive differences are conditional on the OPEN
global premises. They are not an independent theorem proof or new result.

The selected proof dossier is now visible at
http://127.0.0.1:3001/w/mathematics-pilot-lab-156de0/research/math-tools?view=allikvere-proof#allikvere-proof
with23 OPEN dependencies, safe formula rendering, archived links and explicit
unsigned local replay provenance. Valid proof reads and malformed selectors
cannot launch the old arithmetic/model paths. Main127/127 scoped regression,
whole typecheck/lint/build and desktop/mobile browser checks passed.

See docs/verification/TIP-051_VERIFY_REPORT.md for the actual acceptance scope,
source/output hashes, reviewer findings and unrun global research gates.
Queue/worker remain OFF; no fresh autonomous campaign was launched.
