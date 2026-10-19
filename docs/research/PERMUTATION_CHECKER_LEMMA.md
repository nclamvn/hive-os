# TIP080 permutation checker — PRIVATE ENGINEERING REFERENCE

2026-10-06. PUBLIC_PERMUTATION_DEMO_080 preparation only. Main independently
reviewed the following written derivation before approving the fixed checker.
Do not project this reference/formula/golden answer into fresh solving prompts,
DRAFT results or imported originals. This is not evidence of fresh model ability,
an official FrontierMath score, novelty or formal proof.

## Exact task and structural lemma

Words have distinct integer labels. F(empty)=empty; for w=L m R with m the
MAXIMUM, F(w)=F(L)F(R)m. Sigma is uniform on permutations of1..n, n=10^12.
Count i in1..n-1 for which i+1 precedes i in F(sigma), not ordinary positional
descents and not inversions of every pair. Apply F once.

For a<b, b precedes a in F(w) iff b precedes a in w AND some label greater than
b lies between their input positions. Induction on word length proves this:
if both labels are on one side of the maximum, recurse there; if the maximum is
b, it is appended after a and no larger label can separate them; otherwise a
separating maximum exceeds b, and left/right concatenation preserves the input
order between the labels. These exhaust all cases and prove both directions.

For a=i,b=i+1, restrict the input to i,i+1,...,n, a uniformly ordered k-label
word with k=n-i+1. No greater label separates the pair exactly when they are
adjacent in that restricted word. Reversed input order has probability1/2;
the specifically oriented adjacent block(i+1,i) has probability(k-1)!/k!=1/k.
Thus the desired indicator has mean1/2-1/(n-i+1). Linearity, without assuming
indicator independence, gives X=(n+1)/2-H_n.

## Rigorous fixed rational bounds

Let r=9/11, S=2 sum(j=0..15) r^(2j+1)/(2j+1), and
R=2 r^33/[33(1-r^2)]. Integrating the finite geometric identity for1/(1-u^2)
over[0,r] proves S<log10<S+R; the positive residual integral is smaller than R.
Exact integer cross-products verify23/10<S and S+R<231/100. No floating-point
logarithm, Euler constant approximation or n-term harmonic computation is used.

S=6714579034858146244172921088148816422073728 /
2916383892936159917587477271740677008736775.
R=10301051460877537453973547267843 /
42227553490705105710912305084198420.

Integral comparison gives H_n>log(n+1)>12log10>138/5 and
H_n<H_10+log(n/10)<7381/2520+11(231/100)=357071/12600.
Therefore

6299999999649229/12600 < X < 4999999999729/10.

For K=499999999972, these bounds are K+2029/12600<X<K+9/10, so floorX=K.
The checker calculates these rational quantities afresh with bounded BigInt
arithmetic, verifies the inequalities, and derives the floor from the interval.
It does not merely compare against a stored golden-answer literal.

## Tempting errors and independent finite controls

Uniform-output assumption is false: at n=2 every F output is12 and X=0,
not(n-1)/2. Reversed input order alone is insufficient:213 maps123.
F does not always sort:231 maps213. Count a separating larger label as existence,
not multiplicity:2341 maps2314, with two separators but one inverse descent.
Ordinary descents differ:24513 maps24135, with one ordinary but two inverse
descents. Replacing H_n by logn can even give the wrong floor at n=4.

Independent exhaustive recursion/permutation generation for n=1..8 checks46233
permutations and every adjacent-label event; exact means are
0,0,1/6,5/12,43/60,21/20,197/140,499/280. Samples validate implementation only;
the general induction and counting proof justify the all-n formula.

## Intake, provenance and acceptance ceiling

Strict FINAL JSON is {proof:string,certificate:{version:1,
kind:"EXPECTED_INVERSE_DESCENT_FLOOR",n:"1000000000000",floor:canonicaldecimal}}.
The neutral format does not disclose the reference formula or floor. Exact UTF8
originals must be retained by the authenticated caller before parsing. Original
byte SHA and canonical parsed-certificate SHA are separately labelled. No fences,
BOM removal, duplicate-key selection, candidate code, eval or mathematical repair.

Matched value returns SUPPORTED_UNDER_LEMMA_ARITHMETIC, not VERIFIED proof.
Wrong canonical value returns ARITHMETIC_CLAIM_MISMATCH, not a refutation of the
proof text. Malformed/unsupported input or changed binding is INCONCLUSIVE.
Proof text is not mathematically validated by the checker and needs separate
NON_FORMAL postreview. The structural/probabilistic/integral/log lemmas and the
trusted installed runtime are written assumptions, not machine-formalized
foundations. Syntactically correct bindings do not authenticate upstream Codex
output, an operator, current authority or source freeze; the caller owns those
gates. Local cooperative counters/time checks are not hard process containment.

Keep DRAFT checker absent. Invoke/adopt only after sealed FINAL under the reviewed
source/current authority; grader-only evidence may then go to POSTREVIEW.
No scientific role was started to build or test this engineering checker.
