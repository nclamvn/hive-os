"use client";

import { useEffect } from "react";

const FORM_CONTROL_SELECTOR = "input, textarea, select";

/**
 * Keep pointer-focused form controls visually quiet while preserving the
 * locked focus ring for keyboard navigation.
 */
export function FocusModality() {
  useEffect(() => {
    const root = document.documentElement;

    function onPointerDown() {
      root.dataset.inputModality = "pointer";
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        event.key !== "Tab" &&
        target instanceof Element &&
        target.matches(FORM_CONTROL_SELECTOR)
      ) {
        return;
      }
      root.dataset.inputModality = "keyboard";
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      delete root.dataset.inputModality;
    };
  }, []);

  return null;
}
