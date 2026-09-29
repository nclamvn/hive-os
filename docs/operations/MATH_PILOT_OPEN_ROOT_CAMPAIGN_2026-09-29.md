# Open-root structural campaign — 2026-09-29

## Scope and outcome

The authenticated local browser started one human-steered, one-round campaign on the
unrestricted prime-residual Erdős–Straus case, not the falsified auxiliary
`A≤47` case. Root contract digest:
`91e787f3b80a05313d3079b59948a92894114bd93aabf258d0731fbcf8ae8462`.
The steering note explicitly supplied the independently replayed finite result
at `p=10051441` and asked for a nontrivial A=11 condition on A=3/A=7 survivors.

Cycle `441df339-1c66-430c-a84b-aedd97d26aa6` stopped at `KNOWN_SCOPE` after
one planner call and 19,660 observed Codex-session tokens. No solver, task
verifier or peer reviewer ran. Final ledger digest:
`bcfb632c5970537400f4fb5f912390f5916360d9c2a46e7fef3fe060ec8f6e0c`.
Browser evidence: `artifacts/math-pilot-open-root-known-scope-2026-09-29.png`.
There is no new theorem, breakthrough or evidence of resolving the root claim.

## Mathematical assessment

The planner proposed `p≡10 (mod 11)` and, with `A=11`,
`x=(p+11)/4`, `y=x(p+1)/11`, `z=py`. For a prime `p≡1 (mod 840)`,
`x` is integral. The additional congruence makes `y` integral, and
`1/y+1/z=11/(px)=4/p-1/x`. Thus the identity is correct even without the
proposed A=3/A=7 obstruction premises. It is the elementary `d=x` instance
of the existing fixed-A divisor-residue criterion, not a new structural
relation among two-gate survivors. Whether there are primes satisfying *all*
the extra premises was not established by this stopped cycle.

## Procedure correction

The retained `KNOWN` reason incorrectly named the A=3 divisor theorem: its
matcher found that theorem in a *premise* and treated the whole A=11 task as
covered. The historical ledger is immutable and remains unchanged. The current
matcher now declines a single-gate `KNOWN` verdict when a task mentions other
gate targets, handing the whole claim to the frontier assessors. Planner and
task-verifier prompts explicitly exclude the elementary `p≡-1 (mod A)` family
as a purported structural milestone. Unit regression tests cover the premise
versus conclusion distinction; typecheck and focused lint pass.

The first campaign did not carry the machine-checked provenance event for
`p=10051441` across cases. The follow-up below closes that specific limitation.
Each further campaign still requires a reviewed direction; do not auto-retry
this known-scope result.

## Follow-up browser campaign and exact counterexample audit

A second authenticated, human-steered browser campaign on the same unrestricted
root produced cycle `79a347a3-572b-46fc-98d0-627b807555a0`. Its
`PRIOR_FINDINGS` event imported the finite `p=10051441` A≤47 exclusion from
source cycle `11735863-a80f-496e-b4b9-592d5ebed830`, after validating that
source's event chain, root domain, complete per-A audit and independent Python
replay. The event records source ledger digest
`50e95de0ddc128c02df979406db0e87b976bc877efb84d6cb1eef06a32421616`
and replay digest
`1ed15473539c727d56b077a04a96027165ead1b7d565b585735804859896fe91`.
This transfers a finite constraint, not the source case's false universal claim.

The planner proposed that, for a prime `p≡1 (mod 840)`, the conjunction
`u=(p+3)/4` is a square, `u` has no prime factor `2 (mod 3)`, and
`v=(p+7)/4` has no positive divisor `5 (mod 7)` forces the A=11 residual
`11/(p w)=1/y+1/z`, where `w=(p+11)/4`. The independent task verifier accepted
this as a *research task*, not as a theorem. Both source assessors warned that
the quoted A=7 divisor result is sufficient, not necessary. The proposed
success evidence also accidentally wrote `1/u` instead of the A=11 `1/w`.
The solver then returned `p=131041` as a counterexample to this *conditional
lemma*. The critic found the modular argument plausible but retained
`INCONCLUSIVE` pending executable primality checks. The cycle stopped at
`TOKEN_LIMIT` after 6/7 calls and 129,256 observed Codex-session tokens;
the adversary did not run. The append-only ledger is not retrospectively
upgraded by the check below. Browser evidence:
`artifacts/math-pilot-a11-counterexample-e2e-2026-09-29.png`.

Outside the cycle, the stdlib-only Python auditor independently checked
`p=131041` by exhaustive trial division, confirmed `p≡1 (mod 840)`, and
enumerated every factor pair for A=3,7,11,15,19,23 in the declared
`x=(p+A)/4` family. Admissible-pair counts were respectively
`0,0,0,0,0,5`; the first success is A=23. Reproduce with
`python3 scripts/operations/verify-residual-counterexample.py 131041 --max-a 23`.
The script SHA-256 at review was
`b5cd78ce93d8100621e164c0f05c2c1df64976bcd069d00b34dc670ca8c425d1`;
the command's JSON output SHA-256 was
`aef8906200bc58f8b9b8b2fbc49ed68f7bbe3ffbe6ace96f95d6c946dbae3f2c`.

The A=11 exclusion also has a short exact explanation. Here
`u=32761=181²`, `v=32762=2·16381`, and `w=32763=3·67·163`.
Trial division establishes `p` and `16381` prime. The four divisors of `v`
have residues `1,2,1,2 (mod 7)`. Put `P=pw`; if
`11/P=1/y+1/z`, then `(11y-P)(11z-P)=P²`, so some positive divisor of
`P²` must be `-P≡10 (mod 11)`. But the prime factors of `P` have residues
`9,3,1,9 (mod 11)` and generate only `{1,3,4,5,9}`; none is 10.
Thus the proposed conditional lemma is false. Conversely, at A=23 the
auditor gives `(x,y,z)=(32766,186684285,16308863593790)` and a separate
BigInt check verifies `4xyz=p(xy+xz+yz)` exactly. This is **not** a
counterexample to Erdős–Straus and is not a new general structural theorem.

## Method correction and remaining gate

New verifier calls now receive both source-assessor reports and must resolve
specific necessary-versus-sufficient and denominator warnings. New structural
proposals are rejected if their stated success identity uses a different
first denominator from the human-approved A gate. The same rule is *not*
reapplied to immutable old `PROPOSED` events during ledger reads: doing so
temporarily made this historical cycle appear corrupt in the browser. The
validator now checks the stable target binding while admission uses current
policy; a browser reload restored the valid dossier. Unit regression covers
this forward-policy/backward-read distinction.

The next research-method priority is a typed, bounded, independently replayed
counterexample certificate *inside* the agent loop before critic/adversary
classification. This outside-cycle audit must not silently become an in-cycle
review result or a literature novelty claim. After that gate, pursue a
precisely stated stronger relation among survivor classes; the square
condition above is already refuted and must not be recycled.
