# Public 101-gon sample: fixed interval certificate

Date: 2026-09-30. Local Math Pilot only. This note describes the fixed program
in [`scripts/math/interval_101gon.py`](../../scripts/math/interval_101gon.py),
whose SHA-256 is
`3a643dbfad464d45b0090c16cf5eefb6133617d0208bbcd71e634c26fadbe81c`.
The program contains neither the published answer nor model-authored source.
The sample problem and published answer are credited to
[Epoch AI](https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems). It is
public and cannot yield a blind FrontierMath score.

## Mathematical reduction being checked

Let `D` be the 4,949 diagonals of the regular 101-gon, `p=1/1000` and
`q=999/1000`. Because 101 is odd, no diagonal passes through the center, so
the center-containing region is unambiguous. Every selected diagonal cuts
off the half-plane away from the center. Their intersection with the polygon is the center-containing convex
region. Except at finitely many zero-length intersections, a side point `x`
lies on its boundary exactly when none of the `N(x)` diagonals separating it
from the center was drawn; this has probability `q^N(x)`. A point on diagonal
`d` also requires `d` to be drawn; its probability is `p q^N_d(x)`, where
`N_d` excludes `d`. Linearity of expectation and 101-fold rotational symmetry
give

```text
E = 101 [ I(0,1) + p sum_{k=2}^{50} I(0,k) ],
I(0,k) = length(0,k) integral_0^1 q^N_k(t) dt.
```

For a chord `(a,b)` with `a<b`, the center is left of its directed line
exactly when `b-a<=50`, since the sign is that of
`sin(2*pi*(b-a)/101)`. Just after vertex `0`, the point on `(0,k)` is left of
`(a,b)` when `a>0`, or when `a=0` and `b<k`. These exact cyclic-order rules
give the initial separation count without floating-point orientation tests.
An interior crossing with `(0,k)` occurs exactly when `0<a<k<b`; each such
crossing flips one separation bit. The program computes all 80,850 crossing
parameters with interval determinants.

## Outward-rounded arithmetic

Every computed real number is enclosed by an integer pair `(lo,hi)` meaning
`lo/10^80 <= real <= hi/10^80`. Addition, subtraction, multiplication,
division away from zero and square root round outward by integer floor/ceil;
no binary floating-point or `Decimal` operation is used. Pi is enclosed via
Machin's identity `pi=16 atan(1/5)-4 atan(1/239)` with exact rational
alternating-series remainders. Sine and cosine use 80 Taylor terms. The
program checks the integer inequalities showing both Lagrange remainders are
below `10^-80` for every angle used (`0<=theta<7`).

The program sorts midpoints of the enclosed crossing parameters. It does
**not** assume this midpoint order is the exact order or that concurrent
crossings can be separated. Outside the union of all crossing-position
intervals, the exact and midpoint separation counts agree. Inside that union,
both integrands are in `[0,1]`; hence the integral error is at most the sum
of the interval widths. This bound is accumulated before multiplying by the
enclosed chord length. It also handles coincident crossing points without an
unproved tie-breaking assumption.

On the fixed local program, the sum of crossing-position widths is
`363425322 / 10^80`. The resulting integer bounds for `10^9 E` have the same
floor, `4771880153`. Both full 80-digit bounds are retained in the version-2
AI review ledger and can be opened in the UI. The runner recomputes the floor
from the returned bounds, binds the exact program and output digests, and
executes the program in a digest-pinned Python container with no network,
read-only root, dropped capabilities, unprivileged UID and bounded resources.
The solver's separate `answer()` program is still replayed in its own
container; a matching answer alone does not validate this certificate.

## Evidence and limits

The fixed interval calculation closes the **numerical-error gap** of the
public sample under the displayed geometric reduction. It does not, by
itself, formalize the half-plane/perimeter argument in a proof assistant,
prove the solver's prose equivalent to the fixed program, constitute an
independent-model mathematical review, or authorize human sign-off. A new
exact-answer review may receive a favorable AI-supported classification only
when its own claimed answer matches the review-only reference, its own code
replay matches, this fixed certificate has a unique matching floor, and both
fresh AI roles support the derivation with no unresolved gap. Historical
version-1 review ledgers, including the earlier `INCONCLUSIVE` live case, are
not rewritten or reclassified.

The Docker smoke test executes the fixed program rather than mocking its
output. Unit tests reject a mismatched claim, altered bound, missing
certificate, reviewer disagreement and version/digest corruption. This is a
stronger local research procedure, not a production release or a benchmark
accuracy claim.

## Case-bound local E2E addendum

The initial browser-submitted fresh solver attempt hit the local Codex
adapter's 240-second deadline and was retained as `FAILED`, without an answer
or automatic retry. To validate the certificate path without spending another
solver call or changing old evidence, the operator can request a distinct
`math-pilot.exact-interval.verify` job for a completed, sealed exact-answer
case. The worker checks the original contract, attempt and research digests,
runs only the fixed Docker program, and writes one append-only
`MathPilotNumericVerification` row bound to the case and job. The migration
enforces uniqueness, tenant RLS and an update/delete rejection trigger. A
failed or ambiguous interval is not retained as a certificate and cannot be
silently retried.

On the authenticated local browser, the prior case with answer `4771880153`
successfully completed that job (`dispatched=1`, `claimed=1`, `succeeded=1`).
The UI shows the independently certified unique floor, source/image/output
digests and expandable full bounds. Its historical version-1 AI review still
reads `INCONCLUSIVE`; the addendum does not change it. This closes the local
numeric-verification workflow, not the geometric proof or blind benchmark
accuracy gate. Unit suite: 289 tests; Math Pilot integration: 7 tests;
typecheck, lint and production build passed.
