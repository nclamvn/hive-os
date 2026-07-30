"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  LOCALE_COOKIE,
  messages,
  translate,
  type Locale,
  type MessageKey,
} from "@/i18n/config";

export type Appearance = "system" | "light" | "dark";

interface PreferencesValue {
  locale: Locale;
  appearance: Appearance;
  setLocale: (locale: Locale) => void;
  setAppearance: (appearance: Appearance) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

function isAppearance(value: string | null): value is Appearance {
  return value === "system" || value === "light" || value === "dark";
}

function applyAppearance(appearance: Appearance) {
  const resolved =
    appearance === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : appearance;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function PreferencesProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [appearance, setAppearanceState] = useState<Appearance>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem("hive-appearance");
    const next = isAppearance(stored) ? stored : "system";
    applyAppearance(next);
    queueMicrotask(() => setAppearanceState(next));

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (
        (window.localStorage.getItem("hive-appearance") ?? "system") ===
        "system"
      ) {
        applyAppearance("system");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      document.documentElement.lang = next;
      router.refresh();
    },
    [router],
  );

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next);
    window.localStorage.setItem("hive-appearance", next);
    applyAppearance(next);
  }, []);

  const value = useMemo<PreferencesValue>(
    () => ({
      locale,
      appearance,
      setLocale,
      setAppearance,
      t: (key, values) => translate(locale, key, values),
    }),
    [appearance, locale, setAppearance, setLocale],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }
  return value;
}

export { messages };
