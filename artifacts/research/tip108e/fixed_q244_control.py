"""ONE hand-prescribed Q244 implication check; no search or universal proof."""
from __future__ import annotations

import argparse
from fractions import Fraction as Q
import hashlib
import importlib.util
import json
from pathlib import Path
import time

PIN = "26c3b41b3bb731d67247ef1033e94ba4e0dbb0b58aa662858bafe0603596cf55"


def pair_high(i: int, j: int, p: tuple[Q, ...]) -> Q:
    """Exact four-endpoint intersection trapezoids, scaled unit bases."""
    lines = [(p[i-1], i), (p[i-1]+1, i-1),
             (p[j-1], j), (p[j-1]+1, j-1)]
    cuts = {Q(1, 2), Q(1)}
    for k, (c, m) in enumerate(lines):
        for d, n in lines[:k]:
            if m != n:
                y = (d-c)/(m-n)
                if Q(1, 2) < y < 1:
                    cuts.add(y)

    def length(y: Q) -> Q:
        return max(Q(0), min(p[i-1]+1+(i-1)*y,
                             p[j-1]+1+(j-1)*y)
                   - max(p[i-1]+i*y, p[j-1]+j*y))
    ordered = sorted(cuts)
    return sum(((v-u)*(length(u)+length(v))/2
                for u, v in zip(ordered, ordered[1:])), Q(0))


def evaluate() -> dict:
    started = time.monotonic()
    old_path = Path(__file__).resolve().parents[1]/"tip098"/"kakeya_exact.py"
    actual_hash = hashlib.sha256(old_path.read_bytes()).hexdigest()
    if actual_hash != PIN:
        raise ValueError("immutable exact-area source pin mismatch")
    spec = importlib.util.spec_from_file_location("immutable_tip098", old_path)
    if spec is None or spec.loader is None:
        raise ValueError("old exact-area loader unavailable")
    old = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(old)
    p = tuple(Q(n, 31) for n in (50, 32, 50, 32, 0, 0))
    offsets = tuple(z/6 for z in p)
    a = max(p[4:])-min(p[4:])
    b = max(p[:4])-min(p[:4])
    span = a+b
    d = min(p[:4])-max(p[4:])
    if not (a == 0 and span == Q(18, 31) and 1 < d < Q(57, 31)):
        raise ValueError("hand point outside declared critical domain")
    trapezoid = old.area_trapezoid(offsets)
    affine = old.area_affine(offsets)
    if trapezoid != affine:
        raise ValueError("independent immutable area algorithms disagree")
    wedge = sum(((1+p[j-1]-p[i-1])**2/4
                 for i, j in ((5, 6), (1, 2), (2, 3), (3, 4))), Q(0))
    D15, D16 = p[0]-p[4], p[0]-p[5]
    before = (2+(p[3]-p[4]+p[5]-p[4]+p[3]-p[0])/2
              +max(Q(0), 2-D15)**2/8-(D16-1)**2/8-wedge)
    independently_expanded = Q(11, 8)+Q(1, 4)*d-Q(1, 4)*b-Q(3, 4)*b*b
    if before != independently_expanded or before-Q(40, 31) != -Q(425, 7688):
        raise ValueError("hand Q244 expansion mismatch")
    pair_records = []
    for i in (5, 6):
        for j in (1, 2, 3, 4):
            if i-j >= 2:
                pair_records.append({"left_label": i, "right_label": j,
                                     "rank": i-j,
                                     "high_overlap": str(pair_high(i, j, p))})
    pair_sum = sum((Q(row["high_overlap"]) for row in pair_records), Q(0))
    lower = before-pair_sum
    actual_scaled = 6*trapezoid
    defect = 2*actual_scaled-(2+span)
    elapsed = time.monotonic()-started
    if elapsed > 3:
        raise ValueError("authorized 3-second diagnostic cap exceeded")
    if not lower <= actual_scaled:
        raise ValueError("lower-functional orientation failed at hand point")
    return {"mode": "ONE_HAND_POINT_Q244_IMPLICATION_CHECK",
            "scaled_offsets": list(map(str, p)),
            "original_offsets": list(map(str, offsets)),
            "left": "56", "right": "1234", "left_span": str(a),
            "right_span": str(b), "span_total": str(span),
            "minimum_cross_offset": str(d), "actual_bottom_gap": str(d-1),
            "required_scaled_area": "40/31",
            "area_trapezoid": str(trapezoid), "area_affine": str(affine),
            "area_agreement": True, "actual_scaled_area": str(actual_scaled),
            "actual_defect": str(defect),
            "actual_defect_counterexample": defect <= 0,
            "global_smaller_witness": trapezoid < Q(20, 93),
            "potential_wedge_total": str(wedge),
            "Q244_before_high_pairs": str(before),
            "Q244_before_margin": str(before-Q(40, 31)),
            "high_pair_records": pair_records, "high_pair_total": str(pair_sum),
            "Q244": str(lower), "Q244_margin": str(lower-Q(40, 31)),
            "functional_target": "REFUTED_AT_THIS_ADMISSIBLE_POINT",
            "root_R1": "OPEN", "geometry_coverage": "NONE",
            "search": False, "old_source_sha256": actual_hash,
            "elapsed_seconds": elapsed}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    result = evaluate()
    encoded = json.dumps(result, sort_keys=True, separators=(",", ":"))+"\n"
    if len(encoded.encode()) > 1024*1024:
        raise ValueError("compact diagnostic output cap exceeded")
    if args.out:
        with args.out.open("x", encoding="utf-8") as stream:
            stream.write(encoded)
    print(encoded, end="")


if __name__ == "__main__":
    main()
