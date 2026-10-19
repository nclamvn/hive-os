"""Exact CS graph bounds supplied by Main's pair-overlap theorem."""
from fractions import Fraction as F
from functools import lru_cache
from itertools import combinations
import argparse
import json

PAIRS = tuple(combinations(range(5), 2))


@lru_cache(maxsize=32768)
def component_cs_bound(mask, subset=31):
    if not isinstance(mask, int) or not 0 <= mask < 1024:
        raise ValueError("graph mask outside 0..1023")
    if not isinstance(subset, int) or not 1 <= subset < 32:
        raise ValueError("vertex subset outside 1..31")
    vertices = {j for j in range(5) if subset & (1 << j)}
    edges = [pair for bit, pair in enumerate(PAIRS)
             if mask & (1 << bit) and set(pair) <= vertices]
    remaining = set(vertices)
    components = []
    while remaining:
        component = {remaining.pop()}
        growing = True
        while growing:
            growing = False
            for j, k in edges:
                if (j in component) != (k in component):
                    component.update((j, k))
                    growing = True
        remaining -= component
        components.append(component)
    result = F(0)
    for component in components:
        first_moment = F(len(component), 10)
        second_moment = first_moment + 2 * sum(
            (F(1, 5 * (k - j + 2)) for j, k in edges if j in component), F(0))
        result += first_moment * first_moment / second_moment
    return result


@lru_cache(maxsize=1024)
def graph_bound(mask):
    """Maximize the valid component-CS bound over all induced subsets.

    Each subset union is contained in the full union. Independent subsets yield
    cardinality/10 automatically. Main supplies the mathematical proof.
    """
    return max(component_cs_bound(mask, subset) for subset in range(1, 32))


def possible_graph(points):
    graph = 0
    for bit, (j, k) in enumerate(PAIRS):
        differences = [(point[k] if k < 4 else F(0)) - point[j] for point in points]
        if not (min(differences) >= F(1, 5) or max(differences) <= -F(k - j, 5)):
            graph |= 1 << bit
    return graph


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--out", required=True)
    args = p.parse_args()
    values = [graph_bound(mask) for mask in range(1024)]
    with open(args.out, "x") as output:
        output.write("\n".join(f"{v.numerator} {v.denominator}" for v in values) + "\n")
    print(json.dumps({"graph_count": len(values),
                      "certifying_graphs": sum(v >= F(14, 61) for v in values),
                      "full_graph_cs_certifying_graphs": sum(
                          component_cs_bound(mask) >= F(14, 61) for mask in range(1024)),
                      "strictly_improved_graphs": sum(
                          values[mask] > component_cs_bound(mask) for mask in range(1024)),
                      "premise": "Main pair-overlap theorem and induced-subset component CS bound"}))
