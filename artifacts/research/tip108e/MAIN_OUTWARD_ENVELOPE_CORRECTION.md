# A coupled outward-envelope correction (hand proof)

This proves a stronger LOWER FUNCTION, not its target floor. R1/globalK6 OPEN.
No computations or sample-based inference are used. Only the consecutive
canonical groups in TIP108E are addressed.

Write l_K,u_K for the first/last label of groupK. Its fixed outer-member
base interval is

    B_K(y)=[p_l+l*y, p_u+1+(u-1)*y].

Its length is1+(p_u-p_l)+(u-l-1)*y>0, because offset range<1.
The actual horizontal slice hull K_K contains this interval. Define positive
envelope expansions

    e_K^-(y)=p_l+l*y-min_(i inK)(p_i+i*y),
    e_K^+(y)=max_(i inK)(p_i+1+(i-1)*y)-[p_u+1+(u-1)*y].

Both are nonnegative since the outer member belongs to its group. No assertion
is made that the expanded hull is covered by the actual union; the potential
gap wedges remain subtracted in Q.

## Coupled exclusion of the opposite hull

Put d=min_Rp-max_Lp>1, with0<=y<=1/2.

For LEFT56/RIGHT1234:

- min_Rleft >=min_Rp+y, whereas the base LEFT lower endpoint is p5+5y.
  Their difference is>=d-4y>0 whenever y<=1/4. Thus the LEFT lower
  expansion lies entirely outside the actual RIGHT hull in this band.
- max_Lright <=max_Lp+1+5y, whereas the base RIGHT upper endpoint is
  p4+1+3y. The latter exceeds the former by>=d-2y>0 when y<=1/2.
  Thus the RIGHT upper expansion lies entirely outside the actual LEFT hull.

For LEFT456/RIGHT123, both inequalities have label difference3, so both
outward expansions are outside the opposite actual hull for y<=1/3.
These bounds preserve the SAME actual d and offsets, not independent extrema
attained by different configurations. Equality of span endpoints is harmless;
d>1 makes the comparisons strict even at the stated height endpoints.

The two outward expansions cannot overlap each other in their common bands:
reverse separation of the two base intervals is impossible. Indeed
RIGHT base upper minus LEFT base lower is >=d+1-2y>0 for BOTH types,
using their stated outer labels. An outward expansion is also outside the
union of both base intervals, by the preceding opposite-hull bounds.
Consequently these portions add to the low-band base-hull-union LOWER bound
used in Q333/Q244. Subtracting all potential gap wedges still gives a valid
lower bound on the actual union; no group bridge is added as though it were
exclusive of the opposite union.

Above1/2, the actual hull width of groupK is the base width plus e_K^-+e_K^+.
The high-band cross-pair union bound is unchanged, so all these high-band
envelope energies can be retained without a low-band exclusivity claim.

## Stronger valid functions

Using the Q definitions retained in TIP108D, let

    E_high=sum_(K=L,R) integral_(1/2)^1(e_K^-+e_K^+)dy.

Then on the WHOLE corresponding TIP108E domains,

    G>=Q244+E_high
       +integral_0^(1/4)e_L^-dy+integral_0^(1/2)e_R^+dy,

    G>=Q333+E_high
       +integral_0^(1/3)(e_L^-+e_R^+)dy.

Reflection gives the corresponding four-plus-two lower function. Every added
term is oriented as a lower improvement; the remaining inward or middle-band
expansions are discarded, not assumed absent. The forward-gap cap and high-pair
terms in Q are still present. No proof that either strengthened function is
>(2+S)/2 has been obtained. The Q244 counterexample alone neither proves nor
refutes these strengthened predicates.

In particular, a tempting statement that both group hulls are disjoint up to
height1/5 is FALSE: a forward-hull gap may close at(d-1)/4, arbitrarily near0.
That draft shortcut was withdrawn BEFORE execution or acceptance. The bounds
above concern outward expansions only, not all expansions or full hull separation.

## Main ledger

ONE fresh replay of the reviewed fixed_q244_control.py, no output file:
exit0, internal0.005175166s, conservativecharge1s/Main45s. Both retained area
algorithms agree F85789/345960, actualD11389/28830>0; Q244 fails its target.
All envelope reasoning here is hand-only. No new generation or runtime change.
