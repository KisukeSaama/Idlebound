/** A "reasonable" automatic player, shared by the balance simulation and the tests. */
import { ALTARS, altarCost } from "../src/data/altars";
import { HEROES } from "../src/data/heroes";
import { SKILLS } from "../src/data/skills";
import { GameEngine, isSkillUnlocked } from "../src/engine";
import { derive, heroCost, heroCostMultiplier } from "../src/formulas";

export interface BotOptions {
  clicksPerSecond: number;
  /** Ascend after this long without a new stage. */
  stagnationMs?: number;
  onMilestone?: (engine: GameEngine, now: number) => void;
  onAscend?: (engine: GameEngine, now: number, gain: number, from: number) => void;
}

const DT = 0.1;

function bestHeroPurchase(engine: GameEngine, now: number, clicksPerSecond: number) {
  const s = engine.state;
  const multiplier = heroCostMultiplier(s);
  let best: { id: string; ratio: number } | null = null;
  const base = derive(s, now, { ignoreTimed: true });
  for (const hero of HEROES) {
    const level = s.heroLevels[hero.id] ?? 0;
    if (hero.index > 1 && level === 0 && (s.heroLevels[HEROES[hero.index - 1].id] ?? 0) === 0) continue;
    const cost = heroCost(hero, level, 1, multiplier);
    if (cost > s.gold) continue;
    s.heroLevels[hero.id] = level + 1;
    const after = derive(s, now, { ignoreTimed: true });
    s.heroLevels[hero.id] = level;
    const gain = after.dps - base.dps + (after.click - base.click) * clicksPerSecond;
    const ratio = gain / cost;
    if (!best || ratio > best.ratio) best = { id: hero.id, ratio };
  }
  return best;
}

/** Plays `seconds` seconds from `start`; returns the new time. */
export function playBot(engine: GameEngine, start: number, seconds: number, options: BotOptions): number {
  const s = engine.state;
  const stagnation = options.stagnationMs ?? 15 * 60_000;
  let now = start;
  let lastProgressAt = now;
  let lastMaxStage = s.maxStage;
  let clickDebt = 0;
  let step = 0;
  const endAt = start + seconds * 1000;

  while (now < endAt) {
    now += DT * 1000;
    step += 1;
    clickDebt += options.clicksPerSecond * DT;
    while (clickDebt >= 1) {
      clickDebt -= 1;
      engine.click(now);
    }
    engine.tick(now);
    if (s.crystal) engine.clickCrystal(now);

    if (step % 5 === 0) {
      engine.buyAllUpgrades(now);
      for (let guard = 0; guard < 50; guard += 1) {
        const best = bestHeroPurchase(engine, now, options.clicksPerSecond);
        if (!best) break;
        engine.buyHero(best.id, 1, now);
      }
      for (const skill of SKILLS) if (isSkillUnlocked(s, skill.id) && skill.id !== "echo") engine.useSkill(skill.id, now);
      if (!s.autoAdvance && (now - lastProgressAt) % 120_000 < DT * 1000 * 5) engine.toggleAutoAdvance();
      if (s.shards >= 30 && s.inventory.length < 40) engine.buyOffer("chest", now);
      for (const item of [...s.inventory]) {
        const equipped = s.equipment[item.slot];
        if (!equipped || item.affixes[0].value > equipped.affixes[0].value) engine.equip(item.uid, now);
      }
      engine.salvageUpTo("rare");
    }

    if (s.maxStage > lastMaxStage) {
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
      options.onMilestone?.(engine, now);
    }

    if (engine.canAscend() && now - lastProgressAt > stagnation) {
      const from = s.maxStage;
      const gain = engine.ascend(now);
      options.onAscend?.(engine, now, gain, from);
      for (let guard = 0; guard < 500; guard += 1) {
        const choices = ALTARS.filter((altar) => ["might", "blade", "fortune", "time", "patience", "precision"].includes(altar.id))
          .map((altar) => ({ id: altar.id, cost: altarCost(altar.id, s.altars[altar.id] ?? 0) }))
          .filter((entry) => entry.cost <= s.essences * 0.7)
          .sort((a, b) => a.cost - b.cost);
        if (!choices.length) break;
        engine.buyAltar(choices[0].id, now);
      }
      lastMaxStage = s.maxStage;
      lastProgressAt = now;
    }
  }
  return now;
}
