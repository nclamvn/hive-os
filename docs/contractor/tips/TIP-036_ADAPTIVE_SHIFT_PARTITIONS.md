# TIP-036 — Target-sensitive shifted-factor partitions

Date: 2026-10-01. Priority: bounded local research after TIP-035 checkpoint ca9c6e5.
Owner approved the proposed adaptive factor-partition direction with “Tốt, triển khai”.

## Scope and decisions

Study the existing Erdős242 prime-residual root, not a different root or claimed
universal Type-II theorem. Implement standalone, read-only local arithmetic and
independent replay first. No app/DB/queue/worker, historical evidence changes,
paid API, new live Codex campaign, Git push or deployment in this slice. Do not
change existing pinned tools or their 200-million domains. Skill roles: separate
Builders for primary/replay, separate skeptical context, Contractor acceptance.
No UI redesign is needed for the proof/experiment gate; retained research notes
must not masquerade as an authoritative agent-cycle event.

Background criterion (known Tao/Vaughan parametrization): for a prime p,
h>0,h=3 mod4,p not dividing h, T=(p+h)/4, seek coprime positive u,v,
uv dividing T and h dividing u+v. Then k=T/(uv), A=(u+v)/h produce the Type-II
identity. Check strict sorted denominators and exactly two p-divisible entries.
Misses on a selected shift/Type-II family do not refute Erdős242.

## Predeclared structural candidate, not accepted premise

For safe-prime h=2*ell+1 with ell an odd prime, factor T. Let W be the sum of
prime valuations whose prime residue is not 1 mod h, retaining repetitions.
Candidate: if T has a prime factor that is a quadratic nonresidue mod h and
W>=ell, then a coprime signed-factor partition with u+v=0 mod h exists.
Residue -1 factors can satisfy the target immediately. All-quadratic-residue
products cannot hit -1 for h=3 mod4. Analyze trivial/nontrivial stabilizers,
cyclic order and capped exponents before using any sumset theorem. Establish
the scope/tightness or exact refutation; do not assume a count of factor pairs
equals distinct group residues. No assertion about every residual p finding
such an h, bounded h universality or novelty is approved.

## Frozen experiment before execution

- Old warmup targets: 131433121,159727681,351121,171348241; p19 split control
  separate outside residual domain. Keep q15/q99 and unused/repeated mass.
- New public development interval: 200000000<p<=201000000, p=1 mod840;
  exact independent primality, every eligible prime in the interval, no cherry
  picking. This is not an uncontaminated/held-out benchmark.
- Shift menu for this finite experiment only: h in [7,11,23,47,59,83,107].
  It is not a universal menu or a claimed optimal/minimum shift.
- Run limits: <=60 monotonic seconds per implementation, <=10000 (p,h) rows,
  <=2000000 distinct group-state insertions for primary algorithm, <=50000000
  divisor-pair checks for replay, <=2MiB retained output. Stop PARTIAL with
  precise completed prefix/pending input; neither partial nor mismatch is PASS.
- Primary: TS prime-factor signed residue image and constructive partition.
  Independent: Python stdlib positive coprime divisor pairs, exact integer
  primality/factor arithmetic; no importing TS/consuming its factorization.
- Retain row identities/canonical manifests, candidate applicability, exact
  success/miss, construction and separate witness digests. Compare invariant
  full images/counts and deterministic lexicographic witness if practicable;
  differences in a noncanonical witness are not silently treated as agreement.

## Requirements / acceptance

R01: known criterion, full hypotheses/strict identity and unused valuations
remain explicit; written quantified candidate proof or exact scoped refutation.
R02: safe-prime/subgroup/threshold boundary controls and warmup regressions;
wrong domain, malformed/oversized and bad reconstruction fail closed.
R03: frozen interval/menu/resources used without silent expansion; complete
versus partial/pending/output-byte provenance distinguished.
R04: separate TS and Python source-bound full-row replay with mismatch rejection;
checker mutations, missing tool and deadline stops tested. No untrusted code.
R05: primary-source comparison credits known divisor/group framework; scientific
ceiling and missing root bridge explicit. No novelty claim from search alone.
R06: independent skeptical proof/arithmetic review and Contractor unit/type/lint,
reproduction/diff/current manifest checks; no fake live/browser closure.

## Pre-execution refinement decisions

D01: p19 plus any frozen h=3 mod4 gives noninteger T; retain it as explicit
wrong-domain control and separately keep its old h1 split witness, never as a
fabricated positive row in the frozen shift menu.
D02: the generic W>=ell candidate is an elementary Kneser corollary, not itself
a claimed new milestone. The previous A19 note already proves a stronger
mixed-even/odd-log obstruction bound W<=ell-2. Credit that existing work.
D03: investigate the inverse boundary classification at W=ell-1 and some QNR:
target avoidance iff all nonidentity factor residues lie in one inverse pair
{r,r^-1} of a primitive QNR. Analyze mixed even/odd sums, two distinct noninverse
odd directions, and ell3 separately. This is a candidate until independent
review; no mathematical novelty is assumed. Primary-source framework is known.
D04: finite group boundary controls may exhaust all nonidentity valuation
profiles of total W=ell-1 for h7/h11 only, within the existing resource caps.
This validates an implementation, not the unbounded classification proof.
The target interval, shift menu and run/resource limits remain unchanged.

Outputs: primary module/CLI/unit tests; isolated pinned replay/verification;
research note with proofs, frozen inputs and results; separate completion and
skeptical/Contractor verify reports. A failed candidate is retained, not erased.
