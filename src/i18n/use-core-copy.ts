"use client";

import { usePreferences } from "@/components/preferences/preferences-provider";

import { authCopy } from "./auth-copy";
import { executionCopy } from "./execution-copy";
import { truthCopy } from "./truth-copy";
import { verificationCopy } from "./verification-copy";

export function useTruthCopy() {
  const { locale } = usePreferences();
  return truthCopy[locale];
}

export function useAuthCopy() {
  const { locale } = usePreferences();
  return authCopy[locale];
}

export function useExecutionCopy() {
  const { locale } = usePreferences();
  return executionCopy[locale];
}

export function useVerificationCopy() {
  const { locale } = usePreferences();
  return verificationCopy[locale];
}
