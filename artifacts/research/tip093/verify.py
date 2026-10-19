#!/usr/bin/env python3
"""TIP-093 fixed finite/rational replay, not a general proof verifier.

Written reference arguments own universal labels. In particular the PA-06
induction, not 65 sampled terms, refutes all-finite-index arrival. No Lean,
full Kakeya proof, model scoring, or file writes are performed here.
"""
import copy
import io
import json
from fractions import Fraction as F
from pathlib import Path
import sys
import unittest

sys.dont_write_bytecode = True
IDS = tuple("PA-%02d" % i for i in range(1, 9))
INVALID = {"PA-01", "PA-03", "PA-06", "PA-07"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def match_fields(given, expected, case):
    for key, value in expected.items():
        require(given.get(key) == value, "%s mismatch: %s" % (case, key))


def density(intervals):
    """Exact fixed-family supremum via all tight endpoint hulls.

    If a test interval contains any family members, their tight hull has
    endpoints among these endpoints, no larger length, and no smaller counted
    mass. Empty tests have zero density. Thus this is exhaustive for THIS
    finite family, including its repeated labels, not a geometric sampler.
    """
    endpoints = sorted({x for interval in intervals for x in interval})
    best, pairs = F(0), 0
    for i, left in enumerate(endpoints):
        for right in endpoints[i + 1:]:
            pairs += 1
            mass = sum((b - a for a, b in intervals
                        if left <= a and b <= right), F(0))
            best = max(best, mass / (right - left))
    return best, pairs


def replay(inputs, gold):
    require(isinstance(inputs, list) and len(inputs) == 8, "exactly eight inputs")
    require(all(isinstance(x, dict) and set(x) == {"id", "target", "proof"}
                for x in inputs), "input must contain id/target/proof only")
    require(tuple(x["id"] for x in inputs) == IDS, "input IDs/order mismatch")
    require(all(isinstance(x[k], str) and x[k].strip()
                for x in inputs for k in ("target", "proof")), "empty input prose")
    require(isinstance(gold, dict), "gold must be an object")
    cases = gold.get("cases", [])
    require(isinstance(cases, list) and all(isinstance(x, dict) for x in cases),
            "gold cases must be objects")
    require(len(cases) == 8 and tuple(x.get("id") for x in cases) == IDS,
            "matched gold IDs required")
    require(sum(x.get("verdict") == "VALID" for x in cases) == 4
            and sum(x.get("verdict") == "INVALID_PROOF" for x in cases) == 4,
            "gold verdict count must be 4/4")
    require(any(x.get("verdict") == "INVALID_PROOF" and x.get("targetTruth") == "TRUE"
                for x in cases), "invalid proof with true target required")
    for x in cases:
        case = x["id"]
        expected = "INVALID_PROOF" if case in INVALID else "VALID"
        require(x.get("verdict") == expected, case + " reference verdict mismatch")
        truth = "FALSE" if case in {"PA-03", "PA-06", "PA-07"} else "TRUE"
        require(x.get("targetTruth") == truth, case + " target truth mismatch")
        require(all(isinstance(x.get(k), str) and x[k].strip()
                    for k in ("referenceArgument", "minimalRepair", "executableScope")),
                case + " missing written reference/scope")
    by_id = {x["id"]: x for x in cases}
    checks = {}

    # PA-01: fixed disjoint unit intervals, independently prescribed shades.
    masses, classes, volume = [F(1)] + [F(1, 100)] * 7, [[0], list(range(1, 8))], F(1)
    chosen = max(classes, key=len)
    total = sum(masses, F(0))
    chosen_mass = sum((masses[i] for i in chosen), F(0))
    required_mass = total / len(classes)
    chosen_density = chosen_mass / (len(chosen) * volume)
    required_density = total / (len(masses) * volume * len(classes))
    require(chosen_mass < required_mass and chosen_density < required_density,
            "PA-01 fixed witness no longer refutes selected class")
    match_fields(by_id["PA-01"]["counterexample"], {
        "kind": "VARYING_SHADE_MASS", "setVolume": str(volume), "classes": classes,
        "shadedMasses": [str(x) for x in masses], "totalMass": str(total),
        "chosenClassMass": str(chosen_mass), "requiredClassMass": str(required_mass),
        "chosenDensity": str(chosen_density), "requiredDensity": str(required_density)
    }, "PA-01")
    checks["PA-01"] = {"totalMass": str(total), "chosenMass": str(chosen_mass),
                       "chosenDensity": str(chosen_density), "scope": "finite witness"}

    # PA-02: exponent coefficients from F_alpha's two affine exponents.
    delta_coefficient = (F(2) - 3 * F(1)) - (F(2) - 3 * F(0))
    n_coefficient = (F(1) - F(1, 2)) - F(1)
    output_error, h_ceiling = F(1, 2), F(1, 12)  # units of epsilon
    total_loss = output_error - delta_coefficient * h_ceiling
    require(delta_coefficient == -3 and n_coefficient == F(-1, 2)
            and total_loss == F(3, 4) and 1 - total_loss > 0,
            "PA-02 exponent/slack mismatch")
    checks["PA-02"] = {"deltaH": str(delta_coefficient), "NH": str(n_coefficient),
                       "epsilonLossCeiling": str(total_loss), "slack": str(1 - total_loss),
                       "scope": "coefficient arithmetic, not quantifier proof"}

    # PA-03: build the ACTUAL family from m,h; do not echo density constants.
    m, h = 16, F(1, 4 * 16)
    H = [(F(j - 1, m) + F(1, 2 * m), F(j - 1, m) + F(3, 4 * m))
         for j in range(1, m + 1)]
    G = [(F(0), h)] * m + H
    require(all(0 <= a < b <= 1 and b - a == h for a, b in G),
            "PA-03 interval premises")
    dg, pg = density(G)
    dh, ph = density(H)
    mg = sum((b - a for a, b in G), F(0))
    mh = sum((b - a for a, b in H), F(0))
    cfg, cfh = dg / mg, dh / mh
    require(mh / mg == F(1, 2) and cfh < cfg / 2, "PA-03 conclusion not refuted")
    match_fields(by_id["PA-03"]["counterexample"], {
        "kind": "INTERVAL_DENSITY", "m": m, "h": str(h), "D_G": str(dg),
        "D_H": str(dh), "CF_G": str(cfg), "CF_H": str(cfh),
        "requiredCF_H": str(cfg / 2), "retainedMassFraction": str(mh / mg)
    }, "PA-03")
    checks["PA-03"] = {"DG": str(dg), "DH": str(dh), "CFG": str(cfg),
                       "CFH": str(cfh), "endpointPairsG": pg, "endpointPairsH": ph,
                       "scope": "exhaustive supremum for fixed interval multisets only"}

    # PA-04: one deterministic deletion order on one exact weighted fixture.
    edges = [(0, 0, 0, F(8)), (1, 0, 0, F(1, 10)), (0, 1, 0, F(1, 10)),
             (0, 0, 1, F(1, 10)), (2, 2, 2, F(1, 10))]
    original = sum((e[3] for e in edges), F(0))
    threshold, remaining, deleted, charges = original / 24, list(edges), set(), [F(0)] * 3
    while True:
        eligible = next(((axis, node) for axis in range(3) for node in range(3)
                         if (axis, node) not in deleted and
                         sum((e[3] for e in remaining if e[axis] == node), F(0)) < threshold), None)
        if eligible is None:
            break
        axis, node = eligible
        removed = [e for e in remaining if e[axis] == node]
        charges[axis] += sum((e[3] for e in removed), F(0))
        remaining = [e for e in remaining if e[axis] != node]
        deleted.add(eligible)
    retained = sum((e[3] for e in remaining), F(0))
    require(len(deleted) <= 9 and retained + sum(charges) == original
            and all(x <= original / 8 for x in charges)
            and retained >= 5 * original / 8, "PA-04 accounting invariant")
    require(all(sum((e[3] for e in remaining if e[axis] == node), F(0)) >= threshold
                for axis in range(3) for node in {e[axis] for e in remaining}),
            "PA-04 stopping invariant")
    checks["PA-04"] = {"original": str(original), "retained": str(retained),
                       "charges": [str(x) for x in charges], "deletions": len(deleted),
                       "scope": "one fixture/order; written proof owns universal bound"}

    bound = 3 * F(1, 100) + 3 * F(1, 100) + 8 * F(1, 2048) + F(1, 4096)
    require(bound < F(1, 4), "PA-05 rational conclusion")
    match_fields(by_id["PA-05"]["certificate"], {
        "kind": "EXACT_RATIONAL_BOUND", "ratioBound": str(bound),
        "fourTimesRatio": str(4 * bound), "quarter": str(F(1, 4))
    }, "PA-05")
    checks["PA-05"] = {"bound": str(bound), "scope": "exact conditional arithmetic"}

    beta, initial, step_ratio = F(0), F(1), F(1, 2)
    value, terms = initial, []
    for n in range(65):
        require(value == F(1, 2 ** n) and value > beta, "PA-06 finite recurrence")
        terms.append(value)
        step = value * step_ratio
        require(0 < step <= value - beta, "PA-06 step admissibility")
        value -= step
    match_fields(by_id["PA-06"]["counterexample"], {
        "kind": "POSITIVE_HALVING", "beta": str(beta), "gamma_0": str(initial),
        "stepRatio": str(step_ratio), "formula": "gamma_n=2^(-n)>0 for every finite n"
    }, "PA-06")
    checks["PA-06"] = {"terms": len(terms), "first": str(terms[0]), "last": str(terms[-1]),
                       "scope": "CORROBORATION_ONLY; written induction owns all-n refutation"}

    g = gb = F(1)
    q = zeta = kappa = F(1, 10000)
    t = F(1, 10)
    H_loss = 2 * t + kappa
    L = 3 * q + 3 * zeta + 8 * H_loss + kappa
    require(0 < g <= gb and t > 0 and 0 < q <= g / 100
            and 0 < zeta <= gb / 100 and 0 < kappa <= g / 4096
            and L > gb / 4, "PA-07 admissibility/refutation")
    match_fields(by_id["PA-07"]["counterexample"], {
        "kind": "EXPONENT_LOSS", "G": str(g), "G_B": str(gb), "q": str(q),
        "zeta": str(zeta), "kappa": str(kappa), "t": str(t), "H": str(H_loss),
        "L": str(L), "quarterGain": str(gb / 4)
    }, "PA-07")
    checks["PA-07"] = {"H": str(H_loss), "L": str(L), "scope": "admissible rational counterexample"}

    # PA-08: p=1 cancellation fixture only, not arbitrary real powers.
    n, nj, v, k, dtotal, dj = 8, 1, F(1), F(8), F(2), F(1)
    cf_total, cf_j = dtotal * k / (n * v), dj * k / (nj * v)
    rescaled = F(n, nj) * cf_total
    require(dj <= dtotal and cf_j <= rescaled
            and rescaled * nj == cf_total * n, "PA-08 p=1 cancellation")
    checks["PA-08"] = {"p": 1, "N": n, "Nj": nj, "CFtotal": str(cf_total),
                       "CFj": str(cf_j), "cancelledUpper": str(rescaled * nj),
                       "scope": "coefficient cancellation fixture, not universal geometry"}
    return {"status": "PASS", "inputCases": 8, "valid": 4, "invalidProof": 4,
            "invalidProofTrueTarget": 1, "caseChecks": checks,
            "universalLabelsOwner": "complete written gold arguments; NOT this replay"}


def self_tests(inputs, gold):
    class NegativeControls(unittest.TestCase):
        def rejects(self, change, expected):
            a, b = copy.deepcopy(inputs), copy.deepcopy(gold)
            change(a, b)
            with self.assertRaisesRegex(ValueError, expected):
                replay(a, b)

        def test_verdict_count(self):
            self.rejects(lambda a, b: b["cases"][0].update(verdict="VALID"), "count")

        def test_balanced_label_swap(self):
            def mutate(a, b):
                b["cases"][0]["verdict"], b["cases"][1]["verdict"] = "VALID", "INVALID_PROOF"
            self.rejects(mutate, "reference verdict")

        def test_mass_witness_mutation(self):
            self.rejects(lambda a, b: b["cases"][0]["counterexample"]["shadedMasses"].__setitem__(1, "1/10"), "shadedMasses")

        def test_interval_density_mutation(self):
            self.rejects(lambda a, b: b["cases"][2]["counterexample"].update(D_H="2"), "D_H")

        def test_mismatched_gold_id(self):
            self.rejects(lambda a, b: b["cases"][0].update(id="PA-99"), "gold IDs")

        def test_input_label_leak(self):
            self.rejects(lambda a, b: a[0].update(verdict="INVALID_PROOF"), "target/proof only")

    suite = unittest.defaultTestLoader.loadTestsFromTestCase(NegativeControls)
    buffer = io.StringIO()
    result = unittest.TextTestRunner(stream=buffer, verbosity=2).run(suite)
    require(result.wasSuccessful(), "negative controls failed: " + buffer.getvalue())
    return {"run": result.testsRun, "failures": len(result.failures),
            "errors": len(result.errors), "status": "PASS"}


def main():
    try:
        require(sys.argv[1:] in ([], ["--self-test"]), "usage: verify.py [--self-test]")
        base = Path(__file__).resolve().parent
        inputs = json.loads((base / "reviewer-input.json").read_text())
        gold = json.loads((base / "gold.json").read_text())
        summary = replay(inputs, gold)
        if sys.argv[1:]:
            summary["negativeControls"] = self_tests(inputs, gold)
        output = json.dumps(summary, sort_keys=True)
        require(len(output.encode()) < 10000, "summary exceeds 10KB")
        print(output)
        return 0
    except (ValueError, KeyError, TypeError, OSError) as error:
        print(json.dumps({"status": "REFUSED", "error": str(error)[:1000]}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
