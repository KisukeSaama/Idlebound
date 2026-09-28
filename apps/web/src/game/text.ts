import { altarEffect, formatPercent, gameText, trimmed, type AffixStat, type AltarDef, type HeroEffect, type Locale } from "@idlebound/game";
import { messages } from "@/i18n/messages";

const pct = (value: number) => Math.round(value * 100);

/** Sentence describing a talent effect. */
export function describeEffect(effect: HeroEffect, heroName: string, locale: Locale): string {
  const t = messages(locale).hud.effects;
  switch (effect.kind) {
    case "heroDps": return t.heroDps(heroName, effect.mult);
    case "globalDps": return t.globalDps(pct(effect.pct));
    case "click": return t.click(effect.mult);
    case "clickDps": return t.clickDps(pct(effect.pct));
    case "critChance": return t.critChance(pct(effect.pct));
    case "critDamage": return t.critDamage(effect.add);
    case "gold": return t.gold(pct(effect.pct));
    case "bossTimer": return t.bossTimer(effect.seconds);
    case "treasure": return t.treasure(pct(effect.pct));
    case "idleDps": return t.idleDps(pct(effect.pct));
  }
}

/** "+12.5 % dps" style line for an item affix. */
export function formatAffix(stat: AffixStat, value: number, locale: Locale): string {
  const percent = value * 100;
  const text = trimmed(percent, percent >= 100 ? 0 : percent >= 10 ? 1 : 2);
  return messages(locale).hud.affix(text, gameText(locale).affixes[stat]);
}

/** Current total bonus of an altar at a given level, within this walker's cap (`maxLevel`). */
export function formatAltarValue(altar: AltarDef, level: number, locale: Locale, maxLevel = altar.maxLevel): string {
  const t = messages(locale).hud.altarValue;
  const value = altarEffect(altar, level, maxLevel);
  switch (altar.format) {
    case "pct": return t.pct(formatPercent(value, "letters", "en").replace("%", ""));
    case "seconds": return t.seconds(value);
    case "stages": return level === 0 ? t.none : t.stages(value);
    case "flat": return level === 0 ? t.none : t.stage(value);
  }
}
