import { ACHIEVEMENT_BY_ID } from "../data/achievements";
import { biomeForStage, eraForStage } from "../data/biomes";
import type { Locale } from "../i18n";
import type { Item, MonsterState } from "../types";
import { en } from "./en";
import { fr } from "./fr";
import type { GameText } from "./types";

export type { Gender, GameText, HeroText, NameText } from "./types";

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

export function biomeName(stage: number, locale: Locale): string {
  return TEXT[locale].biomes[biomeForStage(stage).id].name;
}

/** Monster display name, including the era prefix (the golden rat never gets one). */
export function monsterName(monster: Pick<MonsterState, "id" | "kind">, stage: number, locale: Locale): string {
  const text = TEXT[locale];
  const name = own(text.monsters, monster.id) ?? monster.id;
  const era = eraForStage(stage);
  if (era === 0 || monster.kind === "treasure") return name;
  const tag = text.eraTags[era % (text.eraTags.length) || 1];
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
export function itemName(item: Pick<Item, "slot" | "rarity" | "level" | "base" | "name">, locale: Locale): string {
  const text = TEXT[locale];
  const base = item.base === undefined ? undefined : text.itemBases[item.slot][item.base];
  if (!base) return item.name ?? text.slots[item.slot];
  return text.itemName({ ...base, rarity: item.rarity, biome: biomeForStage(item.level).index });
}
