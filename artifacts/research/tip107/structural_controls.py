"""Finite combinatorial/arithmetic controls, NOT continuous K6 coverage."""
import argparse
from fractions import Fraction as F
from itertools import permutations
import json
from pathlib import Path
import signal
import time


def adjacent_swap_words(labels=(1,2,3,4,5,6)):
    if not labels:
        return [()]
    result=[(labels[0],)+tail for tail in adjacent_swap_words(labels[1:])]
    if len(labels)>=2:
        result.extend((labels[1],labels[0])+tail for tail in adjacent_swap_words(labels[2:]))
    return result


def preserves_nonadjacent_order(word):
    position={label:i for i,label in enumerate(word)}
    return all(position[i]<position[j] for i in range(1,7) for j in range(i+2,7))


def controls():
    start=time.monotonic()
    words=[word for word in permutations(range(1,7)) if preserves_nonadjacent_order(word)]
    recursively_generated=adjacent_swap_words()
    if len(words)!=13 or set(words)!=set(recursively_generated) or len(set(recursively_generated))!=13:
        raise ArithmeticError("one-component orderword classification mismatch")
    scaled_width=12*F(20,93)
    one_span=scaled_width-1
    two_spans=scaled_width-2
    one_nonadjacent_gap=2-one_span
    two_internal_gap=1-two_spans
    physical_two_spans=two_spans/6
    if (scaled_width,one_span,two_spans,one_nonadjacent_gap,two_internal_gap,physical_two_spans)!=(
            F(80,31),F(49,31),F(18,31),F(13,31),F(13,31),F(3,31)):
        raise ArithmeticError("structural boundary rational mismatch")
    if not physical_two_spans<F(1,6):
        raise ArithmeticError("two-component common-base clique bound missing")
    return {"status":"FINITE_ORDERWORD_AND_BOUNDARY_CONSTANTS_VERIFIED",
            "permutations_checked":720,"one_component_strict_apex_orderwords":words,
            "one_component_word_count":len(words),"independent_recursion_count":len(recursively_generated),
            "filter":"for every labelgap>=2, lowerlabel precedes higherlabel",
            "scaled_bottom_width_upper_bound":str(scaled_width),
            "one_component_scaled_span_upper_bound":str(one_span),
            "two_component_scaled_span_sum_upper_bound":str(two_spans),
            "two_component_physical_span_sum_upper_bound":str(physical_two_spans),
            "one_component_nonadjacent_scaled_apex_gap_lower_bound":str(one_nonadjacent_gap),
            "two_component_internal_scaled_apex_gap_lower_bound":str(two_internal_gap),
            "two_component_base_overlap_lower_bound":str(F(1,6)-physical_two_spans),
            "geometric_dependencies":"Main's radialstationarity2F=bottomwidth and no-adjacent-apex-tie local-minimum lemma",
            "coverage":"NONE: orderwords are not offset cells or polynomial cases",
            "root_global_status":"OPEN","elapsed_seconds":time.monotonic()-start}


if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--out",required=True)
    args=parser.parse_args()
    def expired(signum,frame):
        raise TimeoutError("30 second mathematical process envelope")
    signal.signal(signal.SIGALRM,expired)
    signal.alarm(29)
    result=controls()
    with Path(args.out).open("x",encoding="utf-8") as output:
        json.dump(result,output,sort_keys=True)
        output.write("\n")
    print(json.dumps(result,sort_keys=True))
