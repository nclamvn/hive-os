"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";

import { type Appearance, usePreferences } from "./preferences-provider";

export function PreferencesControls({
  compact = false,
  toolbar = false,
}: {
  compact?: boolean;
  toolbar?: boolean;
}) {
  const { locale, appearance, setLocale, setAppearance, t } = usePreferences();

  if (compact) {
    const nextLocale = locale === "vi" ? "en" : "vi";
    const localeLabel = locale === "vi" ? "VN" : "EN";
    const cycle: Record<Appearance, Appearance> = {
      system: "light",
      light: "dark",
      dark: "system",
    };
    const ThemeIcon =
      appearance === "dark" ? Moon : appearance === "light" ? Sun : MonitorCog;
    return (
      <div
        className="flex items-center gap-1"
        data-testid="preferences-compact"
      >
        <button
          type="button"
          onClick={() => setLocale(nextLocale)}
          className="text-ink-muted hover:bg-surface-subtle hover:text-ink flex size-9 items-center justify-center rounded-md transition-colors"
          aria-label={`${t("common.language")}: ${localeLabel}`}
          title={`${t("common.language")}: ${localeLabel}`}
        >
          <span
            className="font-mono text-[11px] font-semibold tracking-[0.04em]"
            aria-hidden="true"
          >
            {localeLabel}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setAppearance(cycle[appearance])}
          className="text-ink-muted hover:bg-surface-subtle hover:text-ink flex size-9 items-center justify-center rounded-md transition-colors"
          aria-label={`${t("common.appearance")}: ${t(`common.${appearance}`)}`}
          title={`${t("common.appearance")}: ${t(`common.${appearance}`)}`}
        >
          <ThemeIcon className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-2 ${
        toolbar ? "instrument-panel p-2" : "border-line border-t px-3 py-3"
      }`}
    >
      <label className="min-w-0">
        <span className="text-eyebrow text-ink-muted block">
          {t("common.language")}
        </span>
        <select
          value={locale}
          onChange={(event) =>
            setLocale(event.target.value === "en" ? "en" : "vi")
          }
          className="instrument-select mt-1 w-full"
          aria-label={t("common.language")}
        >
          <option value="vi">VI</option>
          <option value="en">EN</option>
        </select>
      </label>
      <label className="min-w-0">
        <span className="text-eyebrow text-ink-muted block">
          {t("common.appearance")}
        </span>
        <select
          value={appearance}
          onChange={(event) => setAppearance(event.target.value as Appearance)}
          className="instrument-select mt-1 w-full"
          aria-label={t("common.appearance")}
        >
          <option value="system">{t("common.system")}</option>
          <option value="light">{t("common.light")}</option>
          <option value="dark">{t("common.dark")}</option>
        </select>
      </label>
    </div>
  );
}
