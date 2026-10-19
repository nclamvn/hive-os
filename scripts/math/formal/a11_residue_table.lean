import Std

/-
Finite sublemma only: complete classification of saturation-capped signed
exponent boxes in C_10. The natural-language factorization-to-gate bridge is
proved separately in the research note and is not formalized here.
-/

set_option maxRecDepth 100000
set_option maxHeartbeats 8000000

namespace HiveOSA11

def grow (rs : List Nat) (step bound : Nat) : List Nat :=
  (List.range 10).filter fun r =>
    rs.any fun s =>
      (List.range (2 * bound + 1)).any fun t =>
        (s + step * ((t + 10 - bound) % 10)) % 10 == r

def hitsTarget (a b c d e : Nat) : Bool :=
  (grow (grow (grow (grow (grow [0] 1 a) 2 b) 3 c) 4 d) 5 e).contains 5

def obstruction (a b c d e : Nat) : Bool :=
  e == 0 &&
    ((a == 0 && c == 0) ||
      (b + d == 0 && ((c == 0 && decide (a ≤ 4)) || (a == 0 && decide (c ≤ 4)) || (a == 1 && c == 1))) ||
      (b + d == 1 && ((b == 1 && c == 0 && decide (a ≤ 2)) || (d == 1 && a == 0 && decide (c ≤ 2)))))

def cappedTableCorrect : Bool :=
  (List.range 6).all fun a =>
    (List.range 3).all fun b =>
      (List.range 6).all fun c =>
        (List.range 3).all fun d =>
          (List.range 2).all fun e =>
            obstruction a b c d e == !(hitsTarget a b c d e)

theorem capped_box_classification : cappedTableCorrect = true := by
  decide

#print axioms capped_box_classification

end HiveOSA11
