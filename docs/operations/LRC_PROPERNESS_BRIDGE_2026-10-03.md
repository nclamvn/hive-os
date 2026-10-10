# LRC properness bridge: mechanism before interpretation

Date: 2026-10-03. Contract: TIP-052. This note records the mathematical
argument reviewed by Main, independently of the certificate producer. It is
not a complete reproduction of Allikvere's proof, a novelty claim, or a
formal proof-assistant certificate.

Primary reference: https://arxiv.org/html/2609.02604v2, Lemma 2.2, Lemma 4.6
and the computational limitations in section 6. Here N denotes the total
number of runners; there are N-1 moving coordinates relative to runner zero.

## 1. Open-arc occupancy

For an integer d>=2, the d points theta+q/d modulo 1 are equally spaced.
Call a point bad when its distance from an integer is STRICTLY below 1/N.
Lift the bad points into the open interval (-1/N,1/N). If there are b>=1
such points, their extreme points have distance at least (b-1)/d, but
strictly less than 2/N. Therefore b-1<2d/N and b<=ceil(2d/N). Equality at
distance 1/N is good, not bad. This argument covers arbitrary real theta;
it does not depend on a rational sample or a floating-point tolerance.

The only phases where membership can change are

    theta = +/-1/N - q/d (mod 1), q=0,...,d-1.

Remove the distinct critical phases from the circle. Each remaining connected
open interval contains no crossing of any bad-arc boundary, so every
membership predicate, and hence the complete bad-shift mask, is constant on
that whole interval. A finite certificate may thus inspect one exact rational
representative of EVERY such interval, including the cyclic wrap, and ALL
critical points themselves. The consumer must reconstruct the required
critical set, adjacency, representatives and masks. A missing interval or
boundary invalidates completeness even if every supplied hash is resealed.

This is the bridge from finite arithmetic to all real phases. It is a
mathematical constancy argument plus exact arithmetic replay; the replay is
not, by itself, a formalized proof of continuity.

## 2. Uniform integer congruence classes

If g>1 divides M and every labelled residue r_i, it divides every lift
r_i+Mz_i, for all integer z_i. That WHOLE CONGRUENCE CLASS cannot contain a
primitive integer tuple. This excludes the specified class only. It says
nothing about other classes or all of its parent fiber.

For shift mechanisms, g|M also makes fixed-coordinate divisibility and
exception-unit conditions invariant under every integer lift. Bounds on a
few representative positive tuples are not substitutes for this uniform
class argument. Positivity, distinct speeds and primitivity remain explicit
mathematical applicability premises when moving from classes to LRC tuples.

The four retained TIP-048 classes with all coordinates divisible by 7 are
instances of the first exclusion. They are NOT four exhausted 7^13 fibers.
The arithmetic predicate g|M used here is a sufficient congruence-class
mechanism; it is not an assertion that every such class satisfies the paper's
exact definition of properness with its specified level parameter.

## 3. Omit-one and common-shift arguments

Suppose all fixed speeds are divisible by g. Given a valid simultaneous
lower-runner witness t0 for those fixed coordinates, the times t0+q/g leave
their phases unchanged. If the exceptional speed is a unit modulo g,
multiplication by that speed permutes the complete g-grid. Section 1 bounds
the number of bad choices by ceil(2g/N). For N>=4 this is at most
ceil(g/2)<=g-1, so a good choice exists.

For a primitive integer tuple with g dividing all but one speed, the exception
is necessarily a unit modulo g: a common divisor of g and that speed would
divide the whole tuple. The source also permits a nontrivial smaller orbit
under more general hypotheses; this implementation uses the stronger,
explicit unit premise and does not silently certify nonunit orbits.

For e exceptions and modulus d, require each exception to be a unit modulo d.
Each bad-shift set has at most m=ceil(2d/N) elements, irrespective of its
starting phase. The union of e sets has at most e*m elements. If e*m<d,
ONE COMMON shift avoids every bad set while preserving all fixed coordinates.
No probabilistic independence of the starting phases is required. For the
source's N=15 prime-modulus mechanism the lower case has 14-e moving
coordinates; the d=3,e=2 and d=5,e=2,3,4 controls satisfy the strict bound.

These controls test a mechanism, not actual author terminals. Without the
lower-runner witness premise, the classification remains CONDITIONAL. The
stored status NOT_ESTABLISHED deliberately supplies neither a new witness
nor permission to close a full proof branch.

## 4. Necessary negative controls

- Boundary equality: N=4,d=2,theta=1/4 gives phases 1/4 and 3/4, both good.
  Treating the bad arc as closed would wrongly count both as bad.
- Equality in the union bound is insufficient. For N=15,d=3,e=3, phases
  0,1/3,2/3 can have bad-shift sets covering all three choices.
- Nondivisibility does not imply a full grid for composite d. At d=4 an
  exception of speed 2 visits only two phases. Its bad choices can repeat;
  the full four-point occupancy argument cannot be applied to that orbit.
- A valid finite-grid NO_GRID result is not a continuous-time counterexample.
- Exact local mechanism replay is not completeness of every required branch.
- A receipt digest is not a signed external execution attestation.

## 5. Product acceptance boundary

TIP-052 adds independently replayed, scoped supplemental evidence before the
normal finite-LRC preparation passes it to a model. Historical envelopes
without that optional supplement retain their old finite interpretation and
original digest; they must not be silently rewritten as freshly verified.

The proof view reads a retained report through pure admission. It must not
execute Python, invoke a model, fetch the paper, or mutate a research run on
GET. Solver/critic/adversary see compact admitted facts and outstanding
premises, not raw executable payloads. Mocked model transport tests measure
the handoff/gate, not a new live AI discovery campaign.

Still open: source-to-universal-domain binding, analytic prefix/KZ/shape
reduction, complete required terminal enumeration and application, accepted
lower-case premises, and global 14/15 reproduction. No local control closes
those gates. The next useful computation must name which of these obligations
it can actually discharge.
