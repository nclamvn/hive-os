# LRC prefix/KZ audit: real-domain reasoning and finite arithmetic

Primary source: https://arxiv.org/html/2609.02604v2 §§3.2–3.4, version dated
24 September2026. n denotes moving speeds, N=n+1 total runners, d=n-1.
This is reproduction/audit, not a new discovery. Source's whole theorem and
HIVE's independent reproduction are separate. Global LRC14/15 remains
NOT_ESTABLISHED. The following reasoning is mathematical review, not Lean or
external peer-review; exact replay certifies the arithmetic substeps only.

## Conditional separated-points and prefix argument

In a rational q-dimensional subspace V with nonzero coordinate functionals,
assuming LRC(m) for m<=n+1-q yields a vector with every coordinate at distance
at least 1/(n+2-q) from integers. For q=1 choose a primitive integral generator
with nonzero entries, collapse signs/repeats and apply the relevant lower case.
For q>=2 take two nonproportional coordinate vectors whose lines have minimum
positive angle. Orient their dot product nonnegative. Their sum h lies strictly
between them, with angle to each smaller than the chosen positive angle, so h
cannot be proportional to any coordinate functional. The rational hyperplane
V'=V intersect h-perp retains all coordinate functionals nonzero and has yi=-yj.
Deleting coordinate j injectively gives dimension q-1 in ambient dimension n-1.
The induction's upper lower-LRC index and separation denominator are unchanged.
Rationality follows from rational orthogonal projection onto rational V.

For a counterexample speed vector v and first r projected lattice basis vectors,
take integer lifts z_i and rational V=span(v,z_1,...,z_r), dimension r+1.
Positive speeds ensure no coordinate functional vanishes on V. The preceding
lemma needs lower cases only through n-r. It supplies s=a v+sum a_i z_i with
separation sigma_r=1/(n+1-r). Descending nearest-plane rounding chooses integer
k_i such that projected error e=sum theta_i b_i* has |theta_i|<=1/2. Thus
epsilon=||e||_E <=sqrt(sum_{i<=r} t_i)/2. The independently needed geometric
inclusion E subset D implies a lift y with |y_j|<=epsilon and Py=e.
Consequently s-sum k_i z_i-y=t v. Distance to integers is 1-Lipschitz, so each
||t v_j||>=sigma_r-epsilon. If epsilon<=delta_r=r/((n+1)(n+1-r)), this is at
least 1/(n+1), INCLUDING equality. A counterexample therefore has prefix sum
strictly larger than B_r=4delta_r^2. No computational witness for arbitrary v
has been produced; lower LRC and geometric construction are explicit premises.

## Complete continuous-to-finite product reduction

Let rho=3/4, B_0=0, c_i=B_i-B_{i-1}, w_i=rho^(i-1).
Assume positive real t_i, t_{i+1}>=rho t_i and every prefix sum>=B_r.
The abstract conclusion does not itself require LRC. Its APPLICATION requires
the conditional prefix argument and existence/properties of a KZ basis.
In z_i=t_i/w_i coordinates, constraints are z_{i+1}>=z_i and weighted prefixes
>=B_r. z_1>=B_1>0 gives positivity and a pointed closed polyhedron. Its recession
cone is exactly nonnegative nondecreasing vectors. By Minkowski–Weyl every
point is a convex combination of vertices plus a nonnegative recession vector.
The coordinate-increasing concave function sum log(w_i z_i) is at least its
minimum over those vertices. This standard real-analysis/polyhedral step is
written reasoning, not something proved merely by listing finite vertices.

Active adjacency equalities partition a vertex into maximal constant-z blocks.
If prefix r strictly inside (a,b] were active, feasibility at a gives
z_block<=sum_{a<i<=r} c_i/sum_{a<i<=r} w_i<=c_r/w_r.
Feasibility at r+1 gives z_block>=c_{r+1}/w_{r+1}, contradiction, since the latter
ratio strictly increases. With beta blocks there are d-beta independent active
adjacencies. A vertex needs beta independent prefix constraints, so ALL beta
block ends are active. This determines each block value uniquely as
z_block=(B_b-B_a)/sum_{a<i<=b} w_i.

Conversely every contiguous composition gives a feasible vertex: these weighted
averages strictly increase between consecutive blocks. Within a block the whole
weighted average is >=each initial partial weighted average, so internal prefix
constraints hold; block ends are equalities. Those beta prefix equalities and
d-beta adjacency equalities uniquely determine the point (independent rank d).
This proves that the 2^(d-1) cut masks give ALL vertices, not selected samples.

Exact arithmetic can therefore check all contiguous block product inequalities
and independently replay every vertex. All-singleton blocks give t_i=c_i and
K=product c_i. For n13/14 all nontrivial blocks have strictly larger products,
hence equality at just this vertex; concavity alone suffices for the lower bound
on arbitrary feasible real points. Strict counterexample prefixes make c_i
itself inapplicable as an actual counterexample, not a speed tuple to search.

## Main independent pre-implementation calculation

Stdlib Fraction calculation independently derived B,c,w, ALL contiguous blocks
and ALL cut masks; no author executable, source code reuse, floating arithmetic,
LLM/API or DB call. n13:78blocks,2048vertices; n14:91blocks,4096vertices.
Every block product >=its corresponding product c_i. Both vertex minima are
unique at all singleton blocks. Exact K values:

- n13:89348172069691/3616460531462492894939937597619200000000.
- n14:2289670297/97243124257250844122250000000000000000.

Controls: dropping KZ with B=[1,5], t=[5,2/5] leaves valid prefixes but product2
below K4; dropping growth with B=[1,2], t=[8/7,6/7] leaves KZ/prefix constraints
but product48/49 below K1. These are abstract examples, NOT LRC counterexamples.
Fresh pinned replay, storage admission, UI and independent review are recorded
separately in TIP053 verification. No old proof-plan obligation is auto-closed.

## Outstanding application gates

Lower LRC through12 / established LRC13; primitive/distinct reduction;
ellipsoid/covolume; KZ existence and association with actual projected lattice;
shape factor universal bound; prime-divisibility and every author terminal;
formal/external acceptance and novelty. Scalar arithmetic and software QA must
not promote these into complete reproduction or a live autonomous campaign.
