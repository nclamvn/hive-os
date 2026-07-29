import "server-only";

import { cookies } from "next/headers";

import {
  LOCALE_COOKIE,
  normalizeLocale,
  translate,
  type MessageKey,
} from "./config";

export async function getLocale() {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}

export async function getTranslator() {
  const locale = await getLocale();
  return {
    locale,
    t: (key: MessageKey, values?: Record<string, string | number>) =>
      translate(locale, key, values),
  };
}
