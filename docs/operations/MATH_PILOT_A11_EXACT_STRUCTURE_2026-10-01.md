# Exact A=11 obstruction theorem and Type I rescue

Date: 2026-10-01. This is a local structural research checkpoint. The full Erdős 242 statement is still open in this program. Literature novelty is not established.

## Unbounded theorem

Let $p$ be a prime with $p\equiv1\pmod{840}$, and fix $x=(p+11)/4$. Call the A=11 gate open when positive integers $y,z$ satisfy

$$\frac4p=\frac1x+\frac1y+\frac1z.$$

Write $v_q(x)$ for the exponent of a prime factor $q$ in $x$. The gate is **closed if and only if** one of these two factorization patterns holds:

1. Every prime factor of $x$ belongs to the quadratic-residue classes $\{1,3,4,5,9\}\pmod{11}$.
2. All of the following hold:
   - $v_3(x)=1$;
   - every other quadratic-residue prime factor of $x$ is $1\pmod{11}$;
   - every nonresidue prime factor is $2$ or $6\pmod{11}$;
   - their total exponent $E=\sum_{q\equiv2,6\ (11)}v_q(x)$ is either one, or two with $p\equiv1\pmod{11}$.

This theorem has no upper bound on $p$. The executable implementations are deliberately bounded to $p\le2\cdot10^8$. Closure concerns this fixed first denominator only.

## Proof: exact equation to a signed exponent box

Set $B=px$. Rearranging the two remaining fractions gives

$$(11y-B)(11z-B)=B^2.$$

Thus the gate opens exactly when a positive divisor $d\mid B^2$ satisfies $d\equiv-B\pmod{11}$. Both congruences follow from this one because $B$ is a unit modulo 11. Replacing $d$ by $B^2/d$ if necessary makes $d\le B$ and gives

$$y=\frac{B+d}{11},\qquad z=\frac{B+B^2/d}{11}.$$

For a factorization $B=\prod q^{e_q}$, write $d=\prod q^{e_q+t_q}$, with $-e_q\le t_q\le e_q$. Dividing the residue of $d$ by that of $B$ turns the criterion into

$$\prod q^{t_q}\equiv-1\pmod{11}.$$

Use primitive root 2, whose residues for logarithms 0 through 9 are $1,2,4,8,5,10,9,7,3,6$. The problem is now whether a signed sum of these logarithms reaches 5 modulo 10. Importantly, the complete gate includes the prime factor **p itself**, with exponent one. Leaving it out tests only the Type II corridor where both remaining denominators are divisible by p.

The inverse-paired residue groups are:

| Signed log | Prime residue classes mod 11 | Saturating exponent |
| --- | --- | ---: |
| $\pm1$ | 2, 6 | 5 |
| $\pm2$ | 3, 4 | 2 |
| $\pm3$ | 7, 8 | 5 |
| $\pm4$ | 5, 9 | 2 |
| 5 | 10 | 1 |

Residue 1 contributes zero. A factor in residue 10 immediately supplies the target. Two units of nontrivial quadratic-residue valuation supply the full even subgroup: one generator with exponent two gives $\{0,\pm2,\pm4\}$, and distinct log types also give all five even residues. Combining this subgroup with any nonresidue supplies the complete odd coset, including 5.

For residual primes, $3\mid x$ and $3$ has log $-2$. Therefore, unless all factors of x are quadratic residues, a Type II miss can occur only when $v_3(x)=1$ and all other nontrivial QR valuation is absent. A factor in residue 7 or 8 then supplies signed log 3 and combines with signed log 2 to reach 5. The remaining possible nonresidues are only 2 and 6. Their combined signed contribution is the interval $[-E,E]$ modulo 10. Adding $\{0,\pm2\}$ reaches 5 exactly when $E\ge3$. Consequently Type II misses are precisely the pure-QR case or this thin shape with $E\le2$.

It remains to include p. Since $p\equiv4x\pmod{11}$, pure-QR x implies QR p, so that case remains closed. In the thin shape, the log of x is $8+s$, where s is the signed sum of its nonresidue log orientations, and the log of p is s. If $E=1$, p adds another $\pm1$ unit; the box $[-2,2]+\{0,\pm2\}$ still misses 5. If $E=2$ and the two orientations cancel, then $s=0$ and $p\equiv1$; the same box misses. If the two orientations agree, then $s=\pm2$: p supplies a second nontrivial QR unit, so the gate opens. These alternatives exhaust the Type II misses, proving both directions of the theorem.

All constructed tuples can be ordered strictly: here $p>11$ and $x<p/2$, and the strict-witness lemma in `MATH_PILOT_ERDOS242_STRICT_2026-10-01.md` excludes equal remaining denominators.

## Explicit conditional Type I construction

The only thin Type II misses rescued by Type I have $E=2$ with both nonresidue valuation units in the same orientation. Choose any corresponding prime factor q of x:

- If both units are $2\pmod{11}$, then $x\equiv1$, $p\equiv4$ and $B\equiv4$. Set $d=9q$: $d\mid x^2$ and $d\equiv7=-B\pmod{11}$.
- If both are $6\pmod{11}$, then $x\equiv9$, $p\equiv3$ and $B\equiv5$. Set $d=q$: $d\mid x^2$ and $d\equiv6=-B\pmod{11}$.

The formula above gives strict integer denominators. Since $p\nmid d$, one remaining denominator is not divisible by p; the other is. This is an unbounded conditional construction, not a claim that every residual prime has this factorization.

The smallest observed such rescue after the A=3 and A=7 gates both close is

$$p=146161,\quad x=36543=3\cdot13\cdot937,$$

where $13\equiv937\equiv2\pmod{11}$ and $p\equiv4\pmod{11}$. With $d=117$ the strict tuple is

$$ (x,y,z)=(36543,485560140,22166282806106660). $$

In contrast, $p=2521$ gives $x=633=3\cdot211$, with one nonresidue unit, and the A=11 gate really closes. Merely having a nonresidue factor is insufficient. The harder $p=171348241$ has $x=3\cdot23\cdot620827$; all these factors are QR modulo 11, explaining its A=11 obstruction without a new guessed implication.

## Verification and reproducible finite measurements

The TypeScript classifier constructs a residue path, reconstructs an actual divisor and checks the strict BigInt identity. The separate Python implementation uses the simplified theorem above, independently sieves primes and factors x, then enumerates **all divisors of B²** to compare the complete fixed gate. It also checks the x-only signed criterion for Type II. Both programs agree on every prime through $2\cdot10^8$, with common per-prime manifest

`ec682c2652a0b82bd12c3ac41ff95cd16f7e0f3a60de2085fb189e5855d52cdc`.

| A=11 outcome | All 57,840 residual primes | After A=3,7 both close |
| --- | ---: | ---: |
| Pure QR obstruction | 15,762 | 4,865 |
| Thin obstruction | 3,850 | 1,226 |
| Type II open | 37,647 | 10,209 |
| Type II closed, Type I rescue | 581 | 195 |

Thus 16,495 observed two-gate survivors divide into 10,404 A=11 successes and 6,091 exact A=11 obstructions. The original HIVE OS full factor-pair survey already included Type I; these 195 are an explanatory refinement, not newly discovered missing solutions in that survey.

The finite group calculation has 648 canonical profiles after saturation caps. A Lean 4.10 source proves the Boolean statement enumerating **all 648** profiles by kernel reduction (`decide`, not `native_decide`). The compiler reports no axiom dependencies for `HiveOSA11.capped_box_classification`. The theorem checked here is the capped residue table; the factorization bridge, cap reduction, and prime theorem above still have a written proof and are not all formalized in Lean.

The separate checker execution completed `HIVEOS_A11_FRESH_REPLAY_OK`, using `lean4checker --fresh` at commit `0c3323271991c2dfe75f8be7d21bf93886419736` in immutable image `sha256:c542cece2ffa8b9c0dde9855e80fa8af5041504d888548e240b5dc65a838600a`. Both executions use the Lean kernel; this is a fresh execution, not an independent foundational system. Source SHA-256: `bca6c9971058b4b0676727865651f27ee91502d9e5bb361d28e500eb0690f78f`; replay-script SHA-256: `84d17ff50c8bbbc4f4199034174ae236a1ef08df78260ab2bfadffc65157be09`; independent Python SHA-256: `b1c1ce5213e4404c16e708c49c4aec4ace29ebe848282ba62359985b21226506`. Local validation completed 309 unit tests, typecheck, lint and shell syntax checking.

Reproduce:

```sh
node --import tsx scripts/operations/erdos-straus-a11-survey.ts --limit=200000000
python3 scripts/operations/verify-a11-structure.py --limit=200000000
bash scripts/math/check-a11-residue-table.sh
npx vitest run --project unit tests/unit/math-a11-structure.test.ts
```

The formal command uses the existing immutable local checker image, no network, a read-only source mount, one CPU, 1 GB RAM and a 180-second limit. It compiles the exact source then invokes `lean4checker --fresh`; no host Lean execution is needed.

## Literature comparison and remaining root obligation

Bradford's published [divisor parametrization](https://math.colgate.edu/~integers/z54/z54.pdf) supplies the established surrounding Type I/II framework. A [public research note on the Type II q=11 filter](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/STRONG-ES-Q11-EXACT-FILTER.md) overlaps the thin x-only classification; it is a repository note, not an independently certified publication. We derived and replayed the full B=px classification rather than treating that note as proof authority. The present Type I comparison is an elementary consequence of the established divisor criterion. No novelty or priority claim is made.

This checkpoint gives the agents exact alternatives for A=11 survivors and a concrete Type I construction. It does not force a later gate for either remaining obstruction class, estimate their infinite density, or resolve Erdős 242. The next mathematical obligation is to couple these two exact patterns with forced factors at a later shift, especially $x_{19}=x_{11}+2$ with $5\mid x_{19}$, while retaining the independently replayed hard examples. A proposed coupling must have its own proof and exact counterexample test; earlier fixed-A bounds are not reusable evidence for universal closure.
