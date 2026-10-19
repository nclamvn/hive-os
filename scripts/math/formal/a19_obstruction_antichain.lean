import Std

/- Formalized template sublemmas only. The full finiteCertificate definition
   is retained as a pending boundary obligation: its kernel check exceeded
   the fixed container resources. Coverage is independently checked in Python.
   The factorization bridge and unbounded theorem are written separately. -/
set_option maxRecDepth 100000
set_option maxHeartbeats 16000000

namespace HiveOSA19

def caps : List Nat := [9,4,3,4,9,1,9,4,1]
def maxima : List (List Nat) := [
  [0,1,0,0,2,0,0,1,0], [0,1,0,0,4,0,0,0,0],
  [0,1,1,0,1,0,0,0,0], [0,2,2,0,0,0,0,0,0],
  [0,4,0,4,0,1,0,4,0], [1,1,0,0,1,0,0,0,0],
  [1,2,1,0,0,0,0,0,0], [2,1,0,1,0,0,0,0,0],
  [2,3,0,0,0,0,0,0,0], [3,1,1,0,0,0,0,0,0],
  [4,2,0,0,0,0,0,0,0], [6,1,0,0,0,0,0,0,0]]

def boxProfiles : List Nat → List (List Nat)
  | [] => [[]]
  | m :: ms => (List.range (m+1)).bind fun v => (boxProfiles ms).map (v :: ·)

def closedProfiles : List (List Nat) :=
  (maxima.bind boxProfiles).filter fun w => decide (1 ≤ w[1]!)

/- Thirty minimal open profiles cover every boundary exit. Avoid checking
   the same residue DP thousands of times: monotonicity propagates these hits. -/
def minimalHits : List (List Nat) := [
  [0,1,0,0,0,0,0,0,1], [0,1,0,0,0,0,1,0,0],
  [0,1,0,0,1,0,0,2,0], [0,1,0,0,1,1,0,0,0],
  [0,1,0,0,3,0,0,1,0], [0,1,0,0,5,0,0,0,0],
  [0,1,0,1,1,0,0,0,0], [0,1,1,0,0,0,0,1,0],
  [0,1,1,0,0,1,0,0,0], [0,1,1,0,2,0,0,0,0],
  [0,1,1,1,0,0,0,0,0], [0,1,2,0,1,0,0,0,0],
  [0,1,3,0,0,0,0,0,0], [0,2,0,0,1,0,0,0,0],
  [0,3,1,0,0,0,0,0,0], [1,1,0,0,0,0,0,1,0],
  [1,1,0,0,0,1,0,0,0], [1,1,0,0,2,0,0,0,0],
  [1,1,0,2,0,0,0,0,0], [1,1,1,0,1,0,0,0,0],
  [1,1,2,0,0,0,0,0,0], [1,2,0,1,0,0,0,0,0],
  [1,4,0,0,0,0,0,0,0], [2,1,0,0,1,0,0,0,0],
  [2,2,1,0,0,0,0,0,0], [3,1,0,1,0,0,0,0,0],
  [3,3,0,0,0,0,0,0,0], [4,1,1,0,0,0,0,0,0],
  [5,2,0,0,0,0,0,0,0], [7,1,0,0,0,0,0,0,0]]

/- Bit r records membership of r in C18. Natural-number shifts, bitwise OR
   and truncation implement cyclic set translation and union, respectively. -/
def rotate (mask shift : Nat) : Nat :=
  let k := shift % 18
  ((mask <<< k) ||| (mask >>> (18-k))) % 262144

def grow (mask : Nat) (step bound : Nat) : Nat :=
  (List.range (2*bound+1)).foldl (fun result t =>
    result ||| rotate mask (step * ((t+18-bound)%18))) 0

def reachable (w : List Nat) : Nat :=
  (w.zip (List.range 9)).foldl (fun rs pair => grow rs (pair.2+1) pair.1) 1

def hitsTarget (mask : Nat) : Bool := (mask >>> 9) % 2 == 1

def bump (w : List Nat) (i : Nat) : List Nat :=
  (w.zip (List.range 9)).map fun pair =>
    min (pair.1 + if pair.2 == i then 1 else 0) caps[pair.2]!

def inDownset (w : List Nat) : Bool :=
  maxima.any fun box => (w.zip box).all fun pair => decide (pair.1 ≤ pair.2)

def aboveHit (w : List Nat) : Bool :=
  minimalHits.any fun h => (h.zip w).all fun pair => decide (pair.1 ≤ pair.2)

def finiteCertificate : Bool :=
  closedProfiles.length == 273 &&
  inDownset [0,1,0,0,0,0,0,0,0] &&
  (maxima.all fun w => !hitsTarget (reachable w)) &&
  minimalHits.length == 30 &&
  (minimalHits.all fun w => hitsTarget (reachable w)) &&
  (closedProfiles.all fun w => (List.range 9).all fun i =>
    inDownset (bump w i) || aboveHit (bump w i))

def capStability : Bool :=
  (caps.zip (List.range 9)).all fun pair =>
    grow 1 (pair.2+1) pair.1 == grow 1 (pair.2+1) (pair.1+1)

theorem maximal_profiles_miss :
    (maxima.all fun w => !hitsTarget (reachable w)) = true := by decide
theorem minimal_profiles_hit :
    (minimalHits.all fun w => hitsTarget (reachable w)) = true := by decide
theorem saturation_caps_stable : capStability = true := by decide

#print axioms maximal_profiles_miss
#print axioms minimal_profiles_hit
#print axioms saturation_caps_stable
end HiveOSA19
