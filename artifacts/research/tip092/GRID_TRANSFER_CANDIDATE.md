# Two-level shading transfer: explicit candidate, not accepted certificate

2026-10-09, written near the16:01UTC audit stop. Same092 Main Lemma1.
This addresses LOSS_NORMALIZATION_AUDIT.md section3's imported O(eta) envelope.
Status: candidate derivation; final geometric/coloring compatibility unclosed.

Work with the ORIGINAL balanced partitioning tube covers at tau and rho and
their ORIGINAL fine/middle fiber counts n_f,n_m. Initial fine individual shade
density is comparable to sigma. Use nested axis-aligned dyadic cell grids with
side lengths comparable to tau and rho; rho/tau tends to infinity in branch B.
Cells intersecting a tube fit a fixed dilation of that tube. This last dilation
is a genuine geometric normalization debit, not an exact equality of families.

## First grid: preserve two measures, not just union volume

For each tau-parent i and tau-cell Q, record both
`a(i,Q)=|U_i intersect Q|/|Q|` and
`b(i,Q)=sum_{T in i}|Y(T) intersect Q|/|Q|`.
Discard negligible mass cells, then pigeonhole BOTH values by their fine shaded
mass. Retain a subpower fraction of total fine shaded mass, with common values
a1,b1 up to fixed factors. Restrict fine shadings to selected whole cells.
Define S_i to be the union of those full cells. Then:

- every retained incidence (i,Q) carries fine shaded mass comparable to b1|Q|;
- it carries fine union volume comparable to a1|Q|;
- total fine shaded mass is comparable to b1*sum_i|S_i|;
- global fine union has volume at least c*a1*|union_i S_i|.

The last bound holds cell by cell: each active cell contains a retained fine
union from at least one parent. It does not count overlapping parents twice.
Whole-cell refinements of S_i lift to fine shading with the SAME b1 mass ratio.
This is the crucial property absent from a bare coarse-density assertion.

The subpower bin bound needs a polynomial floor, not an arbitrary minimum of
measurable shade sizes. All tube/parent counts are polynomial in delta^(-1).
Cells whose mass/union density is below a sufficiently high fixed power of
delta have negligible total fine shaded mass (multiplicity<=N); discard them
before pigeonholing. Initial total shaded mass>=c*delta^(2+t). The remaining
number of dyadic bins is O(log(1/delta)) per recorded quantity.

## Second grid: compatible lifting and simultaneous pruning

Within each original rho-parent, local S_i incidence multiplicity is constant
on each tau-cell. Pigeonhole that multiplicity by shaded mass to a common
m2 up to a fixed factor. This is again a whole-cell cut and hence lifts to fine
shading through b1. For each pair (rho-parent, rho-cell R), pigeonhole:

- union occupancy a2=|union_{i in parent}S_i intersect R|/|R|;
- coarse shaded mass density b2=sum_{i in parent}|S_i intersect R|/|R|.

These have common values with b2 comparable to m2*a2. Each such cell-node has
fine incidence mass comparable to b1*b2|R|. Do not merely remove low-density
tau-fibers afterwards: that can invalidate the selected rho-cell occupancies.

Instead form a weighted incidence graph with an edge (i,R) of weight equal to
the fine shaded mass from tau-parent i in rho-cell R. The R node retains its
rho-parent label. Edges are also grouped by that original rho-parent.
Let M0 be the mass before pruning, A the ORIGINAL number of tau-parents,
B the ORIGINAL number of rho-parents, C the number of selected cell-nodes.
Iteratively remove:

1. a tau-node of remaining degree below M0/(8A);
2. a cell-node of remaining degree below M0/(8C);
3. all edges of a rho-parent group of remaining degree below M0/(8B).

Each node/group is removed once. The total weight removed is at most
M0/8+M0/8+M0/8, so at least5M0/8 survives. All remaining degrees meet their
thresholds. This is a finite weighted pruning argument, not an assumed
independent survival of three lower bounds.

Delete full edge incidences: for tau-parent i, retain all its previously selected
tau-cells lying in retained rho-cell R if edge(i,R) survives. The nested grids
make these whole-cell cuts. The b1 mass relation is preserved. Local coarse
multiplicity is still at most C*m2. Since each remaining cell-node has degree
at least c*b1*b2|R|, its coarse union occupies at least c*(b2/m2)|R|
>=c*a2|R|. Therefore global fine union has volume at least
`c*a1*a2*|union of remaining rho-cells|`.

## Counts and densities on original background fibers

M0 is a subpower fraction of initial sigma*N*tube-volume. Balanced original
counts give A comparable to N/n_f and B comparable to N/(n_f*n_m).
No tau-node can carry more than C*sigma*n_f*tube-volume fine mass, and no
rho-parent more than C*sigma*n_f*n_m*tube-volume. The thresholds imply:

- a surviving tau fiber has fine density at least sigma/P on its ORIGINAL n_f;
- each surviving rho-parent retains at least n_m/P active tau-children;
- at least B/P rho-parents survive;
- fine union in a tau-parent is at most C*a1*|tau-parent|;
- coarse union inside a rho-parent is at most C*a2*|rho-parent|.

Here P is the finite aggregate of subpower/fixed factors, not a zero debit.
The two union upper bounds follow because active cell-neighborhoods lie in a
fixed dilation of the corresponding parent. Combined with the global lower
bound they yield the desired normalized product-volume estimate.

Every surviving tau-parent has a fine tube with individual shade density
>=sigma/P. Its tau-cell neighborhood has volume>=c*(sigma/P)*tau^2, by
projection along that tube. The rho-cell neighborhood of the same fine shade
has volume>=c*(sigma/P)*rho^2. Thus coarse shades can remain sigma/P dense;
middle density on ORIGINAL n_m geometry loses at most another factor P from
the active-child fraction. Keep zero shading on inactive geometric siblings:
upper D and original fine C_F then remain available, and no arbitrary
retained lower-C_F assertion is used.

## Exact remaining acceptance obligation

The discrete mass/core argument above supplies a concrete replacement for the
opaque transfer coefficient. It does NOT by itself justify applying all analytic
lemmas to its fixed-dilated cell-neighborhood parents. Need to complete the
following SAME-family normalization:

- show fixed-dilated tau/rho parents form compatible nested unit-tube families
  after affine normalization, with the prescribed original ownership labels;
- account for their bounded comparable multiplicity when restoring essential
  distinctness, without destroying the active-child lower bound or lifting
  relation (a color subset of coarse shades does not automatically retain fine
  mass unless lifted by the cell incidences);
- debit any density/count factor from that color selection in the final L_B.

Direct facts available: an enlarged member contained in convex V implies its
original member is contained in V, so upper D changes by only the volume factor.
Comparable-tube multiplicity at fixed dilation is bounded in the source packing
convention. But the COMPLETE simultaneous color/lift/count selection has not
been written and checked within this window. STOP; root remains UNRESOLVED for
independent transfer. This is a missing step in OUR reconstruction, not an
asserted flaw in the authors' proof.
