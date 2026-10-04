import { BESTIARY_BY_ID, BIOMES, KING_FORMS, WANDERER_BY_ID, gameText, intlLocale, type GameText, type Locale } from "@idlebound/game";
import { messages, type Messages } from "@/i18n/messages";

/** What every wiki page renders with: its locale, the UI words and the game's own words. */
export interface WikiContext {
  locale: Locale;
  t: Messages;
  g: GameText;
}

export function wikiContext(locale: Locale): WikiContext {
  return { locale, t: messages(locale), g: gameText(locale) };
}

/** A count written the walker's way (`1 000` in French, `1,000` in English). */
export function count(locale: Locale, value: number): string {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 2 }).format(value);
}

/** A share as a percentage (`5 %` in French, `5%` in English). */
export function percent(locale: Locale, share: number): string {
  return new Intl.NumberFormat(intlLocale(locale), { style: "percent", maximumFractionDigits: 2 }).format(share);
}

export type CreatureKind = "normal" | "elite" | "guardian" | "king" | "wanderer" | "special";

/** A creature's rank on the road, from where the game data places it. */
export function creatureKind(id: string): CreatureKind {
  if (KING_FORMS.includes(id)) return "king";
  if (Object.hasOwn(WANDERER_BY_ID, id)) return "wanderer";
  for (const biome of BIOMES) {
    if (biome.miniBoss.id === id) return "elite";
    if (biome.boss.id === id) return "guardian";
    if (biome.monsters.some((monster) => monster.id === id)) return "normal";
  }
  return BESTIARY_BY_ID[id] ? "special" : "normal";
}

/** The biome a creature belongs to, if it walks one. */
export function creatureBiome(id: string) {
  const entry = BESTIARY_BY_ID[id];
  return BIOMES.find((biome) => biome.id === entry?.page);
}
