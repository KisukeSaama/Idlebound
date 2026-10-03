import { altarEffect, formatPercent, gameText, trimmed, type AffixStat, type AltarDef, type HeroEffect, type Locale, type Notation, type PromiseDef } from "@idlebound/game";
import { messages } from "@/i18n/messages";

const pct = (value: number) => Math.round(value * 100);

/** A ratio as a percentage number without its sign, in the walker's notation past 1000 ("10.3K"). */
export function percentValue(ratio: number, notation: Notation): string {
  return formatPercent(ratio, notation, "en").replace("%", "");
}

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

/**
 * What a promise asks, in plain words. `goal`: the stage Oriane's night must pass, once the
 * word is given (before, the night it is measured against is not over). `short`: without
 * the reminder that the King must fall (the companions' list, where room is scarce).
 */
export function describePromise(def: PromiseDef, locale: Locale, goal?: number, short = false): string {
  const t = messages(locale).sanctum.promise.rules;
  const g = gameText(locale);
  const name = (heroId: string) => g.heroes[heroId]?.name ?? heroId;
  const withKing = (rule: string) => (short ? rule : `${rule} ${t.king}`);
  switch (def.kind) {
    case "without": return withKing(def.other === def.hero ? t.withoutSelf : t.without(name(def.other)));
    case "head": return def.until === "king" ? t.headKing(name(def.hero)) : withKing(t.headGuardian(name(def.hero)));
    case "wait": return def.guardian === "king" ? withKing(t.waitKing(def.seconds)) : withKing(t.wait(g.monsters[def.guardian] ?? def.guardian, def.seconds));
    case "abstain": return withKing(t[def.from]);
    case "unfailing": return withKing(t.unfailing);
    case "seam": return withKing(t.seam(pct(def.share)));
    case "anvil": return withKing(t.anvil);
    case "further": return withKing(goal === undefined ? t.furtherNext : t.further(goal));
    case "strata": return t.strata(def.kings);
  }
}

/** "+12.5 % dps" style line for an item affix. */
export function formatAffix(stat: AffixStat, value: number, locale: Locale): string {
  const percent = value * 100;
  const text = trimmed(percent, percent >= 100 ? 0 : percent >= 10 ? 1 : 2);
  return messages(locale).hud.affix(text, gameText(locale).affixes[stat]);
}

/** Current total bonus of an altar at a given level, within this walker's cap (`maxLevel`). */
export function formatAltarValue(altar: AltarDef, level: number, locale: Locale, notation: Notation, maxLevel = altar.maxLevel): string {
  const t = messages(locale).hud.altarValue;
  const value = altarEffect(altar, level, maxLevel);
  switch (altar.format) {
    case "pct": return t.pct(percentValue(value, notation));
    case "seconds": return t.seconds(value);
    case "stages": return level === 0 ? t.none : t.stages(value);
    case "flat": return level === 0 ? t.none : t.stage(value);
  }
}
