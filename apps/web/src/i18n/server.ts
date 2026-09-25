import "server-only";
import { LOCALE_COOKIE, gameText, isLocale, type Locale } from "@idlebound/game";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { LocalePreference } from "./client";
import { messages } from "./messages";

/** Validates the `[locale]` route segment; anything else is a 404. */
export function assertLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

/** Strings for a server component rendering under `/[locale]`. */
export async function getI18n(params: Promise<{ locale: string }>) {
  const locale = assertLocale((await params).locale);
  return { locale, t: messages(locale), g: gameText(locale) };
}

/** The explicit choice stored in the cookie, or "auto". */
export async function getPreference(): Promise<LocalePreference> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "auto";
}
