"""Independent fixed-case exact LRC replay; no producer or shared math imports.

Trusted offline developer tooling, not a hostile-code sandbox or global LRC
authority. Closed BAD intervals certify every real time, not a sample grid.
"""

from fractions import Fraction
import json
import sys


LIMIT = 65536
PURPOSE = "TIP084_FIXED_LRC_METHOD_DEMO"
GW_SPEEDS = tuple(range(1, 12)) + (13, 24)
FIXED_Q = 10 ** 30


def _record(value, fields):
    if type(value) is not dict or set(value) != set(fields):
        raise ValueError("wrong record fields")
    return value


def _decimal(value):
    if type(value) is not str or not 1 <= len(value) <= 100:
        raise ValueError("integer string length/type")
    if any(char < "0" or char > "9" for char in value):
        raise ValueError("integer string digits")
    if len(value) > 1 and value[0] == "0":
        raise ValueError("integer string must be canonical")
    return int(value)


def _fraction(value):
    if type(value) is not str or len(value) > 201 or value.count("/") != 1:
        raise ValueError("fraction syntax")
    numerator, denominator = value.split("/")
    top, bottom = _decimal(numerator), _decimal(denominator)
    if bottom == 0:
        raise ValueError("zero denominator")
    result = Fraction(top, bottom)
    if value != f"{result.numerator}/{result.denominator}":
        raise ValueError("fraction must be reduced")
    return result


def _index(value, maximum):
    if type(value) is not int or not 0 <= value <= maximum:
        raise ValueError("integer index/center range")
    return value


def _distance(speed, time):
    phase = speed * time
    residue = phase - phase.numerator // phase.denominator
    return min(residue, 1 - residue)


def _speeds(value, expected):
    if type(value) is not list or len(value) != len(expected):
        raise ValueError("speed tuple length/type")
    actual = tuple(_decimal(item) for item in value)
    if actual != expected:
        raise ValueError("altered fixed speed tuple")
    return actual


def _gw14(value):
    case = _record(value, ("id", "speeds", "threshold", "witness", "cover"))
    if case["id"] != "GW14":
        raise ValueError("fixed case/order")
    speeds = _speeds(case["speeds"], GW_SPEEDS)
    threshold = _fraction(case["threshold"])
    witness = _fraction(case["witness"])
    if threshold != Fraction(1, 14) or witness != Fraction(1, 14):
        raise ValueError("altered GW14 threshold/witness")
    if min(_distance(speed, witness) for speed in speeds) != threshold:
        raise ValueError("GW14 witness minimum mismatch")
    cover = case["cover"]
    if type(cover) is not list or not 1 <= len(cover) <= 512:
        raise ValueError("closed cover count")
    intervals, seen = [], set()
    for item in cover:
        arc = _record(item, ("speedIndex", "center"))
        index = _index(arc["speedIndex"], len(speeds) - 1)
        speed = speeds[index]
        center = _index(arc["center"], speed)
        identity = (index, center)
        if identity in seen:
            raise ValueError("duplicate closed arc")
        seen.add(identity)
        left = max(Fraction(0), (center - threshold) / speed)
        right = min(Fraction(1), (center + threshold) / speed)
        # For every t in [left,right], |speed*t-center| <= threshold.
        # This is a closed real interval, not an endpoint/grid approximation.
        if left > right or speed * left < center - threshold or speed * right > center + threshold:
            raise ValueError("invalid independently reconstructed BAD arc")
        intervals.append((left, right))
    intervals.sort()
    reached = Fraction(0)
    for left, right in intervals:
        if left > reached:
            raise ValueError("continuous cover has a gap")
        reached = max(reached, right)
    if reached != 1:
        raise ValueError("continuous cover does not reach one")


def _shift15(value):
    case = _record(value, ("id", "Q", "speeds", "threshold", "baseTime", "firstGoodShift", "witness"))
    if case["id"] != "SHIFT15" or _decimal(case["Q"]) != FIXED_Q:
        raise ValueError("altered fixed SHIFT15 case/Q")
    q = FIXED_Q
    expected = tuple(5 * q * odd for odd in range(1, 20, 2)) + tuple(coefficient * q + 1 for coefficient in (10, 8, 6, 4))
    speeds = _speeds(case["speeds"], expected)
    threshold = _fraction(case["threshold"])
    base = _fraction(case["baseTime"])
    if threshold != Fraction(1, 15) or base != Fraction(1, 10 * q):
        raise ValueError("altered SHIFT15 threshold/base")
    claimed = _index(case["firstGoodShift"], 4)
    witness = _fraction(case["witness"])
    good = []
    for shift in range(5):
        time = base + Fraction(shift, 5)
        # Recompute all original physical speed*time phases, without using
        # producer residues, a lowered problem or a producer helper.
        minimum = min(_distance(speed, time) for speed in speeds)
        if minimum >= threshold:  # Equality is GOOD.
            good.append(shift)
    if not good or good[0] != 4 or claimed != good[0] or witness != base + Fraction(claimed, 5):
        raise ValueError("wrong first common good shift/witness")
    if min(_distance(speed, witness) for speed in speeds) != Fraction(1, 5) - base:
        raise ValueError("SHIFT15 exact minimum mismatch")


def verify(payload):
    """Verify only the two frozen cases; reject scope promotion and extra fields."""
    root = _record(payload, ("version", "purpose", "globalLrcProved", "cases"))
    if type(root["version"]) is not int or root["version"] != 1 or root["purpose"] != PURPOSE:
        raise ValueError("wrong version/purpose")
    if root["globalLrcProved"] is not False:
        raise ValueError("unsupported global LRC claim")
    cases = root["cases"]
    if type(cases) is not list or len(cases) != 2:
        raise ValueError("exactly two fixed cases required")
    _gw14(cases[0])
    _shift15(cases[1])
    return {"accepted": True, "purpose": PURPOSE, "cases": ["GW14", "SHIFT15"], "globalLrcProved": False}


def _unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result


def _json_integer(text):
    return _decimal(text)


def _no_float(_text):
    raise ValueError("floating point/nonfinite JSON is excluded")


def main():
    try:
        if len(sys.argv) != 1:
            raise ValueError("stdin only; no arbitrary case/path")
        raw = sys.stdin.buffer.read(LIMIT + 1)
        if not raw or len(raw) > LIMIT:
            raise ValueError("JSON input byte bound")
        text = raw.decode("ascii")
        payload = json.loads(text, object_pairs_hook=_unique_object, parse_int=_json_integer,
                             parse_float=_no_float, parse_constant=_no_float)
        observation = verify(payload)
        output = json.dumps(observation, separators=(",", ":"), allow_nan=False)
        if len(output.encode("ascii")) > LIMIT:
            raise ValueError("JSON output byte bound")
        print(output)
        return 0
    except (ValueError, TypeError, UnicodeError, RecursionError):
        # Fixed bounded failure; no fallback case or unverifiable partial PASS.
        print('{"accepted":false,"purpose":"TIP084_FIXED_LRC_METHOD_DEMO","reason":"REPLAY_REJECTED"}')
        return 1


if __name__ == "__main__":
    sys.exit(main())
