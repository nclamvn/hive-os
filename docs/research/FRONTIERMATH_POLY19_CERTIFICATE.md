# Exact local certificate for a polynomial equality curve

TIP-078. Public sample, not Epoch's official verifier or a Lean formalization.
Task source/credit: Epoch AI, Sample Problems (Tier2),
https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems ,2026-10-06,CC-BY.
This checker design was prepared after Main saw the public reference solution.
It is grader-only; future solving prompts must not include this document.

## What the executable checks

Let z denote a primitive19th root of unity. Exact ring arithmetic uses
Z[z]/(1+z+...+z^18). Primality of19 implies this cyclotomic polynomial is
irreducible; embedding its field of fractions into C is injective.

For k=1,...,9 define s_k=z^k+z^(-k), and
Q_k(x,y)=x²+y²-s_k*x*y+s_k²-4.
The program checks s_k²-4 !=0, distinct s_k, and the full exact identity

    p(x)-p(y) = (x-y) * product_{k=1}^9 Q_k(x,y).

It also checks the submitted normalization and computes p(19) from submitted
coefficients, not from the published answer or a memorized coefficient vector.

## Mathematical bridge — explicit trusted lemma, not model vote

Each Q_k is monic quadratic in x with discriminant
(s_k²-4)*(y²-4). Since s_k²-4 is nonzero, the discriminant has two simple
zeros at y=2 and y=-2. It is not a square in C(y): a rational square has even
order at every zero/pole. Thus Q_k is irreducible in C(y)[x]; Gauss's lemma
gives irreducibility in C[x,y]. Distinct s_k give nonassociate monic factors.
The diagonal x-y is a further distinct irreducible factor.

Bihomogenizing each Q_k to bidegree(2,2) introduces no component on x=infinity
or y=infinity: neither homogenizing coordinate divides it. Its projective
closure is irreducible. The diagonal has bidegree(1,1); the product has total
bidegree(19,19), exactly that of the cleared equality p(x)=p(y) for a monic
degree19 polynomial. The exact affine identity therefore lifts to the entire
projective equality, with no missing boundary divisor. Consequently the
submitted construction has ten distinct irreducible components, nine nonlinear.

Trusted mathematics: cyclotomic irreducibility, the quadratic discriminant
criterion, Gauss's lemma and projective closure/homogenization. Executable exact
arithmetic is independently replayable; these lemmas are a written proof bridge,
not machine-checked foundational logic. Report both layers, not formal acceptance.

## Evidence ceiling

A supported input proves a particular construction under the stated lemma.
It does not classify every real-coefficient polynomial satisfying the task,
prove uniqueness, demonstrate novelty, or yield an official FrontierMath score.
A different valid construction could be outside this verifier's certificate
family. Failure of the factor identity is therefore INCONCLUSIVE for the full
mathematical task, not proof of nonexistence/incorrectness of all other routes.
Scalar-only correctness is insufficient. Tests using reference-derived witnesses
are ENGINEERING_ONLY and cannot be counted as new AI solving results.
