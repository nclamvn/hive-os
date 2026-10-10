"""Two exposed, fixed LRC demonstrations; no global LRC or blind-result claim."""
import argparse
from fractions import Fraction
import json
from pathlib import Path
import subprocess
import sys
from time import monotonic_ns

Q = 10**30
PURPOSE = "TIP084_FIXED_LRC_METHOD_DEMO"
MAX_BYTES = 65536


def fraction_text(value):
    return f"{value.numerator}/{value.denominator}"


def distance(value):
    residue = value % 1
    return min(residue, 1 - residue)


def cover_period(speeds, threshold):
    """Exact greedy closed cover; replay receives integer facts, not endpoints."""
    candidates = []
    for index, speed in enumerate(speeds):
        for center in range(speed + 1):
            lower = max(Fraction(0), (center - threshold) / speed)
            upper = min(Fraction(1), (center + threshold) / speed)
            candidates.append((lower, upper, index, center))
    reach = Fraction(0)
    chain = []
    while reach < 1:
        eligible = [arc for arc in candidates if arc[0] <= reach < arc[1]]
        if not eligible:
            raise ValueError(f"GW14 continuous cover gap after {fraction_text(reach)}")
        _, reach, index, center = max(eligible, key=lambda arc: (arc[1], -arc[2], -arc[3]))
        chain.append({"speedIndex": index, "center": center})
        if len(chain) > 512:
            raise ValueError("cover capacity")
    return chain


def produce_cases():
    speeds14 = list(range(1, 12)) + [13, 24]
    threshold14 = Fraction(1, 14)
    speeds15 = [5 * Q * odd for odd in range(1, 20, 2)] + [a * Q + 1 for a in (10, 8, 6, 4)]
    base = Fraction(1, 10 * Q)
    good = [j for j in range(5) if all(distance(speed * (base + Fraction(j, 5))) >= Fraction(1, 15) for speed in speeds15)]
    if not good or good[0] != 4:
        raise ValueError("fixed SHIFT15 method did not yield first good shift4")
    return {"version": 1, "purpose": PURPOSE, "globalLrcProved": False, "cases": [
        {"id": "GW14", "speeds": [str(v) for v in speeds14], "threshold": "1/14", "witness": "1/14",
         "cover": cover_period(speeds14, threshold14)},
        {"id": "SHIFT15", "Q": str(Q), "speeds": [str(v) for v in speeds15], "threshold": "1/15",
         "baseTime": fraction_text(base), "firstGoodShift": 4, "witness": fraction_text(base + Fraction(4, 5))},
    ]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--record", action="store_true", help="create the one fixed record once, only after independent acceptance")
    args = parser.parse_args()
    started = monotonic_ns()
    payload = produce_cases()
    encoded = json.dumps(payload, separators=(",", ":"), ensure_ascii=True).encode("ascii")
    if len(encoded) > MAX_BYTES:
        raise ValueError("certificate bytes")
    verifier = Path(__file__).with_name("lrc_replay.py")
    checked = subprocess.run([sys.executable, "-I", "-S", "-B", str(verifier)], input=encoded,
                             capture_output=True, timeout=120, check=False)
    if len(checked.stdout) > MAX_BYTES or len(checked.stderr) > MAX_BYTES:
        raise ValueError("verifier output bytes")
    if checked.returncode != 0:
        raise ValueError("independent replay refused whole demo: " + checked.stderr.decode("ascii", errors="replace"))
    receipt = json.loads(checked.stdout)
    expected = {"accepted": True, "purpose": PURPOSE, "cases": ["GW14", "SHIFT15"], "globalLrcProved": False}
    if receipt != expected:
        raise ValueError("independent replay did not accept BOTH fixed cases")
    output = {"certificate": payload, "independentReplay": receipt,
              "strategy": ["exact closed BAD-arc cover plus equality witness", "few-exception five physical shifts"],
              "limits": "Published hints exposed; scoped method validation, not global LRC, novelty, blind score or formal proof",
              "elapsedMilliseconds": (monotonic_ns() - started) // 1000000}
    text = json.dumps(output, separators=(",", ":"), ensure_ascii=True) + "\n"
    if len(text.encode("ascii")) > MAX_BYTES:
        raise ValueError("whole output bytes")
    if args.record:
        record = Path(__file__).resolve().parents[2] / "docs/research/LRC_METHOD_VALIDATION_084.json"
        with record.open("x", encoding="ascii") as handle:
            handle.write(text)
    sys.stdout.write(text)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.SubprocessError) as error:
        print(f"LRC method demo FAILED: {error}", file=sys.stderr)
        sys.exit(1)
