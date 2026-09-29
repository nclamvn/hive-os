# Math Pilot: exact two-gate structure (A = 3, 7)

Status: proved elementary conditional lemma; finite instances independently replayed. **Not** a proof of Erdős–Straus, and **not** a claim of novelty.

## Scope and theorem

Let `p` be any prime with `p ≡ 1 (mod 840)`, and put `u=(p+3)/4`, `v=(p+7)/4=u+1`. For `A=3` or `7`, call the gate open if positive integers `y,z` satisfy

`4/p = 1/x + 1/y + 1/z`, with the **fixed** first denominator `x=(p+A)/4`.

Then:

1. The `A=3` gate is open **if and only if** `u` has a prime factor congruent to `2 (mod 3)`.
2. The `A=7` gate is open **if and only if** `v` has a prime factor congruent to `3`, `5`, or `6 (mod 7)`.
3. Consequently, **both** gates are closed exactly when every prime factor of `u` is `1 (mod 3)` and every prime factor of `v` belongs to `{1,2,4} (mod 7)`. These are conditions on consecutive integers `u,v`; they do not imply any statement about all later `A`.

The quantifier is unbounded over primes in this residue class. The accompanying computer classifier is intentionally bounded to `p ≤ 200,000,000`; its bound does not limit the algebraic theorem.

## Proof and exact construction

For either gate write `B=px`. Rearranging the desired equation gives `(Ay-B)(Az-B)=B²`. Since `p ≡ 1 (mod A)` and `x<p`, a solution exists precisely when some `d | x²` satisfies `d ≡ -x (mod A)`. To see necessity, a factor of `B²=p²x²` has the form `p^j d` for `j∈{0,1,2}`, and `p^j ≡ 1 (mod A)`. Conversely choose such `d`: `d≤x²<px=B`, and both `d` and `B²/d` are `-B (mod A)` because `B` is invertible modulo `A`. Thus

`y=(B+d)/A`, `z=(B+B²/d)/A`

are positive integers and give the exact identity. This is a specialization of the established divisor-congruence characterization, not a new general criterion.

For `A=3`, `u≡1 (mod 3)` and `3∤u`. If all prime factors of `u` are `1 (mod 3)`, so are all divisors of `u²`; none equals `-u≡2`. If a prime factor `q≡2` exists, take `d=q`.

For `A=7`, `v` is even and `v≡2 (mod 7)`. The quadratic-residue subgroup is `{1,2,4}`. If all prime factors of `v` lie in it, all divisors of `v²` do too, whereas `-v≡5`; the gate closes. Conversely, for a prime factor `q` in a nonresidue class, choose

| `q mod 7` | `d` | `d mod 7` |
|---|---:|---:|
| 3 | `4q` | 5 |
| 5 | `q` | 5 |
| 6 | `2q` | 5 |

Because `2|v`, each `d` divides `v²`. The factor-pair construction above then opens the gate. This proves both directions. The tiny residue table and exact integer identities are independently machine-replayed; the universal reasoning still rests on the written proof.

## Replayed instances and limitations

| `p` | `(p+3)/4` | `(p+7)/4` | Result |
|---:|---:|---:|---|
| 2,521 | 631 | `2³·79` | Both closed |
| 10,051,441 | `13²·14,869` | `2·11·114,221` | Both closed; first recorded rescue at A=59 |
| 171,348,241 | 42,837,061 | `2·21,418,531` | Both closed; first recorded rescue at A=63 |

The prime factorizations and statuses above are checked by the independent script, not accepted as model output. The previous survey's exclusions for larger `A` and their independent replay remain separate evidence. A closed two-gate profile is a **filter**, never an Erdős–Straus counterexample. It also gives no density estimate or impossibility result for the intersection of the two factor restrictions.

## Prior art and next research target

- Bradford, *Elementary Patterns from the Erdős–Straus Conjecture*, **Integers 25** (2025), Proposition 1 and the divisor criterion: https://math.colgate.edu/~integers/z54/z54.pdf
- Bloom and Elsholtz, *Egyptian fractions* (2022), survey of the residual congruence classes and classical construction limits: https://www.math.tugraz.at/~elsholtz/WWW/papers/bloom-elsholtz-naw5-2022-23-4-237.pdf

The two-gate equivalence is an elementary specialization of the known divisor method. It should be used to identify the **next** honest question: among primes satisfying both factor restrictions, find a further structural relation that opens a later gate (or proves a genuinely new restriction), with a proof independent of finite searches and a source-scope comparison. No such later-gate theorem is claimed here.

## Reproduction

`python3 scripts/operations/verify-two-gate-structure.py`

`npx vitest run --project unit tests/unit/math-two-gate-structure.test.ts`

The Python program independently factors integers, enumerates divisors of `x²` for both gates, checks the theorem's status and reconstructs witnesses with exact integer arithmetic. The UI displays a derived, digest-bound profile only for a previously validated independent-replay failure; it does not alter that historical event ledger.
