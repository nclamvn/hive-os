import Std

theorem hive_even_square (n : Int) (h : ∃ k : Int, n = 2 * k) :
    ∃ j : Int, n * n = 2 * j := by
  obtain ⟨k, hk⟩ := h
  refine ⟨2 * k * k, ?_⟩
  rw [hk]
  simp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]

#print axioms hive_even_square
