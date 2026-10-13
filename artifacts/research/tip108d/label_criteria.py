"""Exact finite LABEL arithmetic, not a geometry cover or root proof."""
from __future__ import annotations

import argparse
from fractions import Fraction as Q
from itertools import combinations
import json
from pathlib import Path
import time

S = Q(18, 31)
LABELS = frozenset(range(1, 7))


def necessary(left: frozenset[int]) -> bool:
    right = LABELS - left
    if max(left) - min(right) < 2:
        return False
    if len(left) == 2 and 1 in left:
        return False
    if len(right) == 2 and 6 in right:
        return False
    forbidden = {frozenset((3, 5)), frozenset((4, 5))}
    if len(left) == 3 and 1 in left:
        if frozenset(j - 1 for j in left if j != 1) in forbidden:
            return False
    if len(right) == 3 and 6 in right:
        if frozenset(6 - j for j in right if j != 6) in forbidden:
            return False
    return True


def mask(labels: frozenset[int]) -> str:
    return "".join(map(str, sorted(labels)))


def gap_sum(labels: frozenset[int]) -> Q:
    ordered = sorted(labels)
    return sum((Q(1, 2) - Q(1, j - i + 1)
                for i, j in zip(ordered, ordered[1:])), Q(0))


def classify() -> dict:
    started = time.monotonic()
    rows = []
    outer = {
        "45": ("E45", Q(47415, 234484)),
        "1456": ("E45_REFLECTED", Q(47415, 234484)),
        "46": ("E46", Q(824, 20181)),
        "2456": ("E46_REFLECTED", Q(824, 20181)),
        "256": ("E256", Q(1345, 26908)),
        "346": ("E256_REFLECTED", Q(1345, 26908)),
        "356": ("C356", Q(820, 181629)),
    }
    for k in (2, 3, 4):
        for labels in combinations(range(1, 7), k):
            left = frozenset(labels)
            if not necessary(left):
                continue
            right = LABELS - left
            name = mask(left)
            cross = sum((Q(i-j-1, (i-j)*(i-j+1))
                         for i in left for j in right if i-j >= 2), Q(0))
            candidates: list[tuple[str, Q]] = []
            if k == 3:
                basic = 2 - 2*S + Q(3, 8)*S*S - 2*cross
                candidates.append(("G3_BASIC", basic))
                candidates.append(("G3_GAP_RESIDUAL", basic +
                                   Q(169, 961)*(gap_sum(left)+gap_sum(right))))
            else:
                candidates.append(("WEAK_GROUP_BASIC", 2 - 2*S - 2*cross))
                pair = left if k == 2 else right
                four = right if k == 2 else left
                r = max(pair) - min(pair)
                baseline = Q(5, 2) - Q(1, r+1) - 2*S - 2*cross
                candidates.append(("EXACT_PAIR_LINEAR", baseline))
                # Exact pair already includes its label gap: NEVER add pair
                # gap-insertion residue. Only the OTHER four-member group.
                c = Q(r-1, r+1)
                energy = Q(r+2, r*(r+1))
                a_star = max(Q(0), (S-c)/(2*energy+1))
                if not a_star <= min(S, Q(r, r+2)):
                    raise ValueError("unqualified pair minimum branch")
                pair_four_min = (c*a_star + energy*a_star*a_star
                                 + (S-a_star)**2/2)
                candidates.append(("G4_QUADRATIC_EXACT_PAIR", baseline +
                                   pair_four_min + Q(169, 961)*gap_sum(four)))
            if name in outer:
                candidates.append(outer[name])
            best_id, best = max(candidates, key=lambda item: item[1])
            rows.append({"left": name, "right": mask(right),
                         "directed_pair_cap": str(cross),
                         "candidate_floors": {key: str(value)
                                              for key, value in candidates},
                         "largest_floor": str(best), "method": best_id,
                         "label_target_excluded_if_dependencies_accepted":
                             best >= 0})
    counts = {str(k): sum(len(row["left"]) == k for row in rows)
              for k in (2, 3, 4)}
    if counts != {"2": 10, "3": 14, "4": 10}:
        raise ValueError("retained necessary-label inventory mismatch")
    unresolved = [row["left"] for row in rows
                  if not row["label_target_excluded_if_dependencies_accepted"]]
    elapsed = time.monotonic()-started
    if elapsed > 3:
        raise ValueError("3-second predicate cap exceeded")
    return {"mode": "EXACT_FINITE_LABEL_CRITERIA",
            "root_R1": "OPEN", "geometry_coverage": "NONE",
            "offset_samples": 0, "optimization": False,
            "dependency_status": "NEW_HAND_LEMMAS_REQUIRE_INDEPENDENT_REVIEW",
            "dependencies": {
                "G3_BASIC": "retained TIP108B proper-three group theorem",
                "G3_GAP_RESIDUAL": "HAND_COUPLING_NOTES quantitative gap residual",
                "EXACT_PAIR_LINEAR": "HAND_COUPLING_NOTES exact pair formula",
                "G4_QUADRATIC_EXACT_PAIR": "PROPER_FOUR_GROUP_PROOF plus exactpair; residue ONLYother4",
                "E45": "ISOLATED_TRIANGLE_CLASSES plus retained consecutive K5 theorem",
                "E46": "ISOLATED_TRIANGLE_CLASSES plus retained inverse adjacent triple cap5/14",
                "E256": "ISOLATED_TRIANGLE_CLASSES plus retained inverse adjacent triple cap3/7",
                "C356": "L356_COUPLED_PAIR_PROOF retaining common offset differences"},
            "label_rows": len(rows), "size_counts": counts,
            "proposed_excluded_rows": len(rows)-len(unresolved),
            "unresolved_left_masks": unresolved,
            "negative_floor_is_counterexample": False,
            "elapsed_seconds": elapsed, "rows": rows}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    result = classify()
    encoded = json.dumps(result, sort_keys=True, separators=(",", ":"))+"\n"
    if len(encoded.encode()) > 1024*1024:
        raise ValueError("compact label-output cap exceeded")
    if args.out:
        with args.out.open("x", encoding="utf-8") as stream:
            stream.write(encoded)
    print(json.dumps({key: value for key, value in result.items()
                      if key != "rows"}, sort_keys=True))


if __name__ == "__main__":
    main()
