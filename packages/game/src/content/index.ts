import { ACHIEVEMENT_BY_ID, SECRET_SERIES } from "../data/achievements";
import { AGE_ECHOES, BIOME_ECHOES, DREAMS, ECLIPSE_WORDS, KING_WORDS, REGALIA_WORDS, SAYINGS, SECRETS, SONGS } from "../data/lore";
import { biomeForStage, eraForStage } from "../data/biomes";
import { ECLIPSE_EVERY } from "../data/events";
import { ageForEra } from "../data/strata";
import type { Locale } from "../i18n";
import type { ChronicleEntry, Item, MonsterState } from "../types";
import { en } from "./en";
import { fr } from "./fr";
import { grammarLine } from "./grammar";
import type { GameText, LoreLine } from "./types";

export type { Gender, GameText, HeroText, LoreLine, Memories, NameText } from "./types";
export { roman } from "./roman";

const TEXT: Record<Locale, GameText> = { fr, en };

/** All player-facing game content for a locale. */
export function gameText(locale: Locale): GameText {
  return TEXT[locale];
}

/** Own-property read: ids can come from a save, so `constructor` must not hit the prototype. */
function own<T>(table: Record<string, T>, key: string): T | undefined {
  return Object.hasOwn(table, key) ? table[key] : undefined;
}

export function eraLabel(stage: number, locale: Locale): string {
  return TEXT[locale].eraName(eraForStage(stage));
}

/** The tag of a stratum ("" for the present night). */
export function stratumTag(era: number, locale: Locale): string {
  return TEXT[locale].strata.tags[era] ?? "";
}

/** The name of the Age a stratum belongs to. */
export function ageName(era: number, locale: Locale): string {
  return TEXT[locale].strata.ages[ageForEra(era)] ?? "";
}

export function biomeName(stage: number, locale: Locale): string {
  return TEXT[locale].biomes[biomeForStage(stage).id].name;
}

/** Monster display name, with the tag of its stratum (Pip and the Dawn never get one). */
export function monsterName(monster: Pick<MonsterState, "id" | "kind">, stage: number, locale: Locale): string {
  const text = TEXT[locale];
  const name = own(text.monsters, monster.id) ?? monster.id;
  const era = eraForStage(stage);
  const tag = text.strata.tags[era];
  if (!tag || monster.kind === "treasure" || monster.id === "the-dawn") return name;
  return `${tag} · ${name}`;
}

export function talentName(upgradeId: string, locale: Locale): string {
  return own(TEXT[locale].talents, upgradeId) ?? upgradeId;
}

export function achievementText(id: string, locale: Locale): { name: string; description: string } {
  const def = ACHIEVEMENT_BY_ID[id];
  const text = TEXT[locale];
  const separator = id.lastIndexOf("-");
  const series = id.slice(0, separator);
  const tier = Number(id.slice(separator + 1)) - 1;
  if (series === SECRET_SERIES) {
    // A secret deed is named after its secret; its description is the riddle.
    const secret = SECRETS.find((entry) => entry.deed === tier + 1);
    const copy = secret ? own(text.secrets, secret.id) : undefined;
    return { name: copy?.name ?? id, description: copy?.riddle ?? "" };
  }
  const describe = own(text.achievementDescriptions, series);
  return {
    name: own(text.achievementNames, series)?.[tier] ?? id,
    description: def && describe ? describe(def.threshold) : ""
  };
}

/**
 * Item display name. Items store the index of their base noun, so the name follows the
 * player's language. Items created before that field existed keep their stored name.
 */
export function itemName(item: Pick<Item, "slot" | "rarity" | "level" | "base" | "name" | "named">, locale: Locale): string {
  const text = TEXT[locale];
  const named = item.named ? own(text.relics, item.named) : undefined;
  if (named) return named.name;
  const base = item.base === undefined ? undefined : text.itemBases[item.slot][item.base];
  if (!base) return item.name ?? text.slots[item.slot];
  return text.itemName({ ...base, rarity: item.rarity, biome: biomeForStage(item.level).index });
}

const NOBODY: LoreLine = { by: "", text: "" };

/**
 * The King's Word of the n-th night (1-based): the fifty written ones, then the grammar in
 * his voice; every seventh night, a word of his Eclipse.
 */
export function kingWord(night: number, locale: Locale): string {
  const text = TEXT[locale];
  if (night > 0 && night % ECLIPSE_EVERY === 0) return text.voices.eclipseWords[(night / ECLIPSE_EVERY - 1) % ECLIPSE_WORDS] ?? "";
  if (night <= KING_WORDS) return text.voices.kingWords[night - 1] ?? "";
  return grammarLine({ kind: "king", night }, locale).text;
}

/** What the King says to a walker in his Regalia, the n-th time (1-based), in turn. */
export function regaliaWord(count: number, locale: Locale): string {
  return TEXT[locale].voices.regaliaWords[(Math.max(1, count) - 1) % REGALIA_WORDS] ?? "";
}

/** Words of a Chronicle entry: who speaks, and what they say. */
export function chronicleText(entry: ChronicleEntry, locale: Locale): LoreLine {
  const text = TEXT[locale];
  switch (entry.source) {
    case "keystone":
      if (entry.reading) return grammarLine({ kind: "reading", era: entry.era, descent: entry.reading }, locale);
      return text.strata.keystones[entry.era] ?? NOBODY;
    case "milestone":
      return own(text.strata.milestones, entry.id) ?? NOBODY;
    case "king":
      return { by: text.speakers.king, text: kingWord(entry.night, locale) };
    case "echo":
      if (entry.index >= (own(BIOME_ECHOES, entry.biome) ?? 0)) return grammarLine({ kind: "echo", biome: entry.biome, index: entry.index }, locale);
      return own(text.echoes, entry.biome)?.[entry.index] ?? NOBODY;
    case "age":
      if (entry.index >= AGE_ECHOES) return grammarLine({ kind: "age", age: entry.age, index: entry.index }, locale);
      return text.ageEchoes[entry.age]?.[entry.index] ?? NOBODY;
    case "wanderer":
      return own(text.wanderers, entry.id) ?? NOBODY;
    case "memory":
      return own(text.memories, entry.hero)?.[entry.tier - 1] ?? NOBODY;
    case "lesson":
      return own(text.lessons, entry.id) ?? NOBODY;
    case "song":
      if (entry.index >= SONGS) return grammarLine({ kind: "song", index: entry.index }, locale);
      return { by: text.heroes.celestine.name, text: text.voices.songs[entry.index] ?? "" };
    case "dream":
      if (entry.index >= DREAMS) return grammarLine({ kind: "dream", index: entry.index }, locale);
      return { by: "", text: text.voices.dreams[entry.index] ?? "" };
    case "saying":
      return { by: text.speakers.stallkeeper, text: text.voices.sayings[entry.index % SAYINGS] ?? "" };
    case "relic": {
      const relic = own(text.relics, entry.id);
      return { by: relic?.name ?? "", text: relic?.legend ?? "" };
    }
    case "altar":
      return own(text.altarLegends, entry.id) ?? NOBODY;
    case "secret":
      return own(text.secrets, entry.id)?.line ?? NOBODY;
    case "event":
      return own(text.events, entry.id)?.line ?? NOBODY;
    case "crown":
      return text.crown.legend;
  }
}

/** What a companion says when hired, by how well they remember the walker (Recognition). */
export function hireLine(heroId: string, recognition: number, locale: Locale): string | null {
  const lines = own(TEXT[locale].hireLines, heroId);
  if (!lines) return null;
  return lines[recognition >= 3 ? 2 : recognition >= 1 ? 1 : 0];
}
