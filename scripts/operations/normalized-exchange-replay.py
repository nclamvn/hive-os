"""Independent stdlib finite controls; known TypeII symmetry, no discovery."""
import hashlib
import json
import math


def check(p, A, u, k, Q):
    assert p >= 2 and min(A, u, k, Q) >= 1 and math.gcd(A, u) == 1
    m, T = A * u * k, u * Q * k
    assert A * p + u == (4 * m - 1) * Q
    assert (u + Q) % A == 0 and math.gcd(A, Q) == 1
    chosen_u, chosen_Q = min(u, Q), max(u, Q)
    chosen_m = A * chosen_u * k
    assert A * p + chosen_u == (4 * chosen_m - 1) * chosen_Q
    old = sorted((T, A * p * u * k, A * p * Q * k))
    new = sorted((T, A * p * chosen_u * k, A * p * chosen_Q * k))
    assert old == new and sum(d % p == 0 for d in old) == 2
    x, y, z = new
    assert 4 * x * y * z == p * (x * y + x * z + y * z)
    t0, h = p // 4 + 1, 4 * T - p
    bound = 2 * t0 // (4 * t0 - p)
    assert t0 <= T <= (p + 1) // 3 and chosen_m <= bound
    if p % 840 == 1:
        if h == 3:
            assert k >= 11
        if h == 7:
            assert k >= 13
        assert m <= (p + 11) * (p + 15) // 176
    return chosen_m, bound, u > Q, p > 2 and x < y < z


def main():
    digest = hashlib.sha256()
    checked = swapped = strict = residual = 0
    for m in range(1, 4097):
        ds = [d for d in range(1, m + 1) if m % d == 0]
        for A in ds:
            for u in ds:
                if m % (A * u) or math.gcd(A, u) != 1:
                    continue
                for Q in range(1, 9):
                    numerator = (4 * m - 1) * Q - u
                    if numerator < 2 * A or numerator % A:
                        continue
                    p = numerator // A
                    if m > 512 and p % 840 != 1:
                        continue
                    k = m // (A * u)
                    chosen_m, bound, did_swap, is_strict = check(p, A, u, k, Q)
                    checked += 1
                    swapped += did_swap
                    strict += is_strict
                    residual += p % 840 == 1
                    record = [str(p), str(A), str(u), str(k), str(Q), str(m), str(chosen_m), str(bound), did_swap, is_strict]
                    digest.update((json.dumps(record, separators=(",", ":")) + "\n").encode())
    targets = ("131433121", "159727681", "351121", "171348241")
    output = {"method": "NORMALIZED_EXCHANGE_BOUNDED_RESEARCH_V1", "limits": {"allInputsMaxM": 512, "residualInputsMaxM": 4096, "maxQ": 8},
              "checked": checked, "swapped": swapped, "strict": strict, "residual": residual, "controlsDigest": digest.hexdigest(),
              "targetBounds": [{"p": p, "representativeCoreBound": str(2 * (int(p) // 4 + 1) // (4 * (int(p) // 4 + 1) - int(p))),
                                "allRepresentationResidualBound": str((int(p) + 11) * (int(p) + 15) // 176)} for p in targets],
              "conditionalGateExamples": [{"p": p, "assumedNextH": h, "representativeCoreBound": str((int(p) + int(h)) // (2 * int(h))),
                                            "gateExclusionsCertifiedHere": False} for p, h in zip(targets, ("27", "43", "3", "63"))],
              "scope": "Known Type II exchange symmetry; representative/existence bound only, not a restricted-core tail. Residual all-m bound is a written arithmetic corollary, novelty unestablished. Finite controls are not full target searches; conditional h floors are assumptions, not new gate certificates."}
    print(json.dumps(output, separators=(",", ":")))


if __name__ == "__main__":
    main()
