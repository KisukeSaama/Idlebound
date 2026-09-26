/**
 * Locales supported by the whole product (game content, web UI, API messages, e-mails).
 * French is the historical language of the game and the SEO target of the landing page.
 */
export type Locale = "fr" | "en";

export const LOCALES: readonly Locale[] = ["fr", "en"];

/** Used when the client sends no language preference at all (crawlers, curl…). */
export const DEFAULT_LOCALE: Locale = "fr";

/** Used when the client states preferences but none of them is supported. */
export const FALLBACK_LOCALE: Locale = "en";

/** Name of the cookie holding an explicit language choice; absent means "automatic". */
export const LOCALE_COOKIE = "ib_lang";

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}

/**
 * Picks the best supported locale from an `Accept-Language` header (or a list of
 * `navigator.languages`). Honours q-values; `fr-CA` matches `fr`.
 */
export function negotiateLocale(preferences: string | readonly string[] | null | undefined): Locale {
  const entries = typeof preferences === "string"
    ? preferences.split(",").map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((param) => param.trim()).find((param) => param.startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1, index };
    })
    : (preferences ?? []).map((tag, index) => ({ tag: tag.toLowerCase(), q: 1, index }));
  const ranked = entries
    .filter((entry) => entry.tag && entry.tag !== "*" && Number.isFinite(entry.q) && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  if (ranked.length === 0) return DEFAULT_LOCALE;
  for (const entry of ranked) {
    const primary = entry.tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return FALLBACK_LOCALE;
}

/** Explicit choice (cookie) wins; otherwise the browser preferences decide. */
export function resolveLocale(explicit: string | null | undefined, preferences: string | readonly string[] | null | undefined): Locale {
  return isLocale(explicit) ? explicit : negotiateLocale(preferences);
}

/** BCP 47 tag for `Intl` APIs. */
export function intlLocale(locale: Locale): string {
  return locale === "fr" ? "fr-FR" : "en-US";
}
