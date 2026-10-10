# Retained Main first attempt — before reading the published solution

2026-10-10, TIP097. This is an incomplete attempted proof, NOT a solved first pass.
The Main context has the public statement, not the published solution to prob-006.

Let r be the unique vertex with w(r)<d(r), D=d(r)-w(r)>0.
Write the quadratic form as

Q(x)=sum_edges (x_i-x_j)^2 + sum_i (w_i-d_i)x_i^2.

Every coefficient except the root's is nonnegative. For a decomposition e_r=a+b,
b=e_r-a, with k=a_r, the inner product is

a.b = D k(k-1) - sum_{i != r}(w_i-d_i)a_i^2
      - sum_{edges not incident to r}(a_i-a_j)^2
      - sum_{j adjacent r}(k-a_j)(k-a_j-1).

The integer products t(t-1) are nonnegative. This initially suggested the stronger
claim that the bad vertex itself is irreducible. That stronger claim is FALSE.

Exact counterexample: the three-leaf star with weights [2,1,3,3] (root first).
The leaf block is diag(1,3,3), and the root Schur complement is
2-(1+1/3+1/3)=1/3>0, so Q is positive definite. The root is the unique bad vertex.
Set a=e_r+e_1 and b=-e_1. Q(a)=Q(b)=1 and a.b=-1+1=0. The root is reducible.
This is NOT a counterexample to the requested theorem: e_1 has norm1, hence is
irreducible because nonzero integral vectors in a positive-definite integral
lattice have positive integer norms; a splitting with nonnegative product would
have total norm at least2.

Thus any vertex of weight1 proves the requested conclusion immediately. If none
exists, every vertex has weight>=2. A tentative remaining route is to prove that
the bad vertex is irreducible in this restricted case. This remains an UNPROVED
lemma, not discharged by finite searches.

Root-fixed branch attempt: for a branch matrix B at neighbor s, put
g=(B^{-1})_{ss}. Positive definiteness gives w(r)>sum_branch g.
To bound the displayed inner product for k outside{0,1}, a sufficient branch
inequality would be

x^T B x -(2k-1)x_s + g k(k-1) >=0 for all integer x,k.

For a one-vertex branch of weight M this follows from
(Mx-k)(Mx-k+1)>=0. A valid extension to arbitrary branches has NOT been proved.
Continuous Cauchy gives only x^TBx>=x_s^2/g and is insufficient when an integer
x_s lies strictly between g(k-1) and gk. It cannot be silently used to assert the
desired discrete inequality. The k=0,1 strictness also needs a separate argument.

Status: root theorem OPEN. Actual failure of the stronger bad-root claim retained;
weight1 subcase proved, no full solution or general advantage established.
An independent finite checker was asked to replay the negative control and test
the no-weight1 conjecture. Its output has not yet been used to revise this note.
