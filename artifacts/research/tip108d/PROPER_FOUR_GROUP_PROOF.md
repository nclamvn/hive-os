# A strengthened proper four-label bound (hand proof)

For four distinct integer labels, with arbitrary offsets of range
`0<=s<=18/31`, the scaled group union area satisfies

    G4 >= 5/4-s/2+s^2/4.

This is a proper-group statement, not the whole two-group defect theorem.
The retained quantitative integer-gap insertion residual may also be added.
No offset ordering, equal-step minimizer or actual-area monotonicity is assumed.

## Consecutive labels: the envelope inequality

For `s>0`, normalize the offsets to `s*(A,a,b,C)`, each entry in `[0,1]`,
with minimum0 and maximum1. Put

    E=(A-a)^2+(a-b)^2+(b-C)^2,   h=1+C-A.

Let B be the normalized negative-edge envelope energy: the lower convex and
upper concave hulls of `(i,v_i)`, `i=0,1,2,3`, contribute the square of each
vertical drop divided by twice its horizontal length, only for decreasing
edges. Equivalently B is the sum of integrated lower/upper endpoint-envelope
excesses. The retained slice-hull-minus-adjacent-wedge bound is

    G4 >= 5/4+s*(C-A)/2+s^2*(B-E/4).

We prove

    E <= 4B+2h-1.                                      (1)

Selecting attained extrema gives eight positional types modulo the
area-preserving reflected shear, which reverses the labels and sends
`v_i` to `1-v_(3-i)`. Every formula is closed, so ties are included.

### 1. `(1,0,b,C)`

The lower envelope contributes1/2. The upper contributes at least
`(b-C)_+^2/2`. Inequality(1) follows from

    2(b-C)_+^2 >= b^2+(b-C)^2-2C.

For `b>=C`, the difference is `2C(1-b)+C^2>=0`. For `b<=C`, the right-hand
side, convex in b on `[0,C]`, is at most `C^2-2C<=0`.

### 2. `(1,a,0,C)`

The lower energy is `( (1-a)^2+a^2 )/2` for `a<=1/2`, and1/4 for
`a>=1/2`. The upper energy is `(1-C)^2/6` for `a<=(2+C)/3`, and
`(1-a)^2/2+(a-C)^2/4` above that threshold.

For `a<=1/2`, use `E0=(1-a)^2+a^2>=1/2`: the lower contribution plus
`(1-C)^2/6` suffices since `E0>=(1-C)^2/3`.
For `1/2<=a<=(2+C)/3`, inequality(1) reduces to

    2a(1-a) >= (1-C)^2/3.

The concave left side is minimized at the two interval endpoints. At1/2 this
is immediate; at `(2+C)/3` it follows from `2(2+C)>=3(1-C)`.
Above that threshold the exact difference in(1) is
`(1-a)^2+2C(1-a)>=0`.

### 3. `(1,a,b,0)`

Put `d=(1-a,a-b,b)`, whose sum is1 and whose first/last entries are
nonnegative; the middle entry need not be. Let I and J be the squared norms
of the nondecreasing and nonincreasing pooled-adjacent-violators projections
of d. Their block averages are nonnegative, because all prefix/suffix drops
are nonnegative. The two hull energies give `B=(I+J)/2`.
We show `2(I+J)>=E+1`.

If one projection is the original three-block vector, the other is the
one-block vector: `I+J=E+1/3`, and `E>=1/3` suffices. If both have two
blocks, they pool opposite neighboring pairs; direct expansion gives

    2(I+J)-E-1=(d1-d3)^2>=0.

If one has one block and the other two, reflection permits writing the latter
as `(x,(1-x)/2,(1-x)/2)`, with `x=d1>=1/3`. The conditions for the former
projection to have one block imply `0<=d3<=1/3`; the two-block pooling implies
`d2<=d3`. Put `y=d3`, `d2=1-x-y`. Thus

    max(0,(1-x)/2)<=y<=1/3,    1/3<=x<=1.

Now

    2(I+J)-E-1=2x^2-2x+2/3-[(1-x-y)^2+y^2].

The subtracted convex quadratic is maximized at an endpoint of the y interval.
At `y=(1-x)/2` the displayed value is `3(x-1/3)^2/2`; at `y=1/3` it is
`(x-1/3)^2`. The endpoint y0 can occur only at x1 and is also nonnegative.
Both projections having one block forces d to be constant, giving equality.
These exhaust the three-entry projection block counts and establish(1).

### 4. `(A,1,0,C)`

The lower/upper envelopes contribute at least `A^2/4` and `(1-C)^2/4`.
Substitution gives exactly `4B+2h-1-E>=0`.

### 5. `(0,1,b,C)`

The upper envelope contributes at least `(1-C)^2/4`. The difference needed
for(1) is `2b(1-b+C)>=0`.

### 6. `(0,a,1,C)`

The upper envelope contributes at least `(1-C)^2/2`. The remaining difference
is `2+C^2-[a^2+(1-a)^2]>=0`.

### 7. `(0,a,b,1)`

Here h2 and `E<=3=2h-1`, so no envelope energy is needed.

### 8. `(A,0,1,C)`

The lower/upper envelopes contribute at least `A^2/2` and `(1-C)^2/2`.
The remaining difference is `(1-A)^2+C^2>=0`.

## Area consequence and label gaps

Substitute(1) into the retained group bound:

    G4 >= 5/4-s/2+s^2/4 + h*s*(1-s)/2
        >= 5/4-s/2+s^2/4.

The s0 common-offset case follows directly (or continuously).
The retained integer-gap insertion theorem increases the SAME hull-minus-wedge
functional for s<=18/31. Thus inserting any missing integer labels preserves
this bound; the quantitative residual in HAND_COUPLING_NOTES.md can be added.
This is not an assertion that the actual group union is convex or monotone
in its label gaps. Old proof/source bytes are unchanged.

## Status / Trạng thái

Hand proof proposed for independent challenge. No mathematical subprocess,
finite sample or optimization was used. A proper four-member group bound alone
does not establish the coupled two-group target D>0 over all remaining labels.
Chứng minh cho một nhóm bốn nhãn, không phải chứng minh toàn miền K6.
