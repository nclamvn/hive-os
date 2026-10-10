# Main source audit (not a formal proof certificate)

Source: Guth–Wang–Zahl, arXiv2601.14411v1, §8, PDF printed pp.31–32.
PDF p.31 visually inspected; equations also extracted from the PDF, not only HTML.
This is source-assisted reproduction. Named analytic dependencies are assumed,
not independently reproduced. Observations below concern local statements in v1,
not counterexamples to Main Lemma1 or to the Kakeya theorem.

## Independently checked algebra

1. From the supplied definition C_F>=1. For 0<h<1 and eta>0, the printed
   C_F<=h^(+eta/epsilon) cannot hold. Lemma7.7A gives a negative exponent.
   Treat the positive sign as an apparent local v1 typo pending source review.
2. Set rho=theta*r in Lemma7.7A. Its interval rescales exactly to
   [h^(1-epsilon),h^epsilon], not [h^(1+epsilon),h^epsilon]. The printed
   lower endpoint also drops below the h-tube scale. Use the lemma's interval.
3. Let d=gamma-beta>0, q=gamma/2+beta-1, eta'=u, and
   h^u<=X<=h^(-4epsilon-u). For 0<=beta<=gamma<=1, |q|<=1, hence
   X^q<=h^(-4epsilon-u). Multiplying the preceding loss gives
   h^(-8epsilon-2u). Also b^(-2beta)=b^(-2gamma)b^(2d).
   Therefore b<=h^(1-epsilon) gives the valid exponent
   E=-8epsilon-2u+2(1-epsilon)d.
   The stronger printed E=-8epsilon-2u+2d does not follow from the b bound
   ALONE. This does not imply the aggregate inequality is false: retain
   the unused slack from X^q, as confirmed on reviewing the frozen solver output.
   Exact counterexample to this isolated power replacement: h=1/16,
   epsilon=1/4, b=1/8, beta=1/4, gamma=3/4. Then b^(2d)=1/8>1/16=h^(2d).
   This is NOT a geometric counterexample to Kakeya.
4. Sufficient local choices retaining gain: 0<epsilon<1/2,
   8epsilon+2u+2epsilon*d<=d, and 10u<d with positive slack for constants
   and refinement losses. These inequalities alone do not audit all named
   analytic lemmas or prove their hypotheses survive every refinement.
5. Using beta in u=10eta/(epsilon*beta) is a conservative relaxation of
   a gamma-based bound when 0<beta<gamma, not automatically an error.
   It is undefined at beta=0. One possible endpoint route is to apply the
   positive-beta argument to alpha>0 using K_KT(0)=>K_KT(alpha), then pass
   to K_F(0) through arbitrary epsilon slack. This remains conditional on
   the positive-exponent proof actually closing.
   A simpler local alternative is u=10eta/(epsilon*gamma), since gamma>beta
   implies gamma>0. Failure of the target plus Proposition6.6 gives
   a/b>h^(8eta/(epsilon*gamma)), hence the weaker a/b>=h^u and b/a<=h^(-u).
   Choose u<epsilon*eta_j with slack. On the corrected scale interval,
   b>h^(1-epsilon) would force C_F(Ttilde[T_b])>h^(-epsilon*eta_j),
   contradicting the upper bound h^(-u), after constants are absorbed.
   This removes division by beta from that local argument; it does not
   resolve the separate global refinement/parameter ledger.

## Correction after inspecting the frozen solver output

For q>=0 use X^q<=h^(-(4epsilon+u)*q); for q<0 use
X^q<=h^(u*q). The exact resulting exponent E exceeds the published aggregate
E_pub=2d-8epsilon-2u by (4epsilon+u)(1-q)-2epsilon*d when q>=0,
and by 4epsilon+u(1+q)-2epsilon*d when q<0. In the admitted range
0<=beta<gamma<=1 both differences are nonnegative. Thus the source's aggregate
power bound CAN be derived from the supplied X interval. Only the isolated
replacement b^(2d)<=h^(2d) is invalid; it is not a refutation of that aggregate
bound. Keep this distinction in all reports. No source erratum is claimed for
the aggregate exponent. The source sign and scale-interval observations remain
separate from this recovered estimate.

## Endpoint bootstrap (conditional)

Assume the full quantitative Lemma8.1, including its monotone positive nu.
If the infimum s of valid K_F exponents were >beta, monotonicity gives a
uniform positive improvement for exponents approaching s from above, contradicting
the infimum. Thus valid exponents approach beta. For t=gamma-beta>0,
F_gamma(delta,N)/F_beta(delta,N)=delta^(-2t)(delta^2*N)^(-t/2).
N>=1 gives a bound <=delta^(-3t), up to harmless tube-volume constants.
For any requested output loss epsilon_out, take t<epsilon_out/6 and invoke
K_F(gamma) with loss epsilon_out/2; choose its input tolerance/scale threshold.
This justifies the endpoint without claiming a finite iteration reaches beta.

## Still open in this bounded audit

An explicit full loss ledger for fine/middle/coarse refinements, shading mass,
thresholds in all black-box invocations, and monotone positive improvement nu.
No installed analytic proof checker or Lean formalization closes these obligations.
Do not label this file a certificate that Main Lemma1 or all Kakeya is verified.
