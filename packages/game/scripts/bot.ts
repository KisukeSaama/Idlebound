/** A "reasonable" automatic player, shared by the balance simulation and the tests. */
import { ALTARS, altarCost } from "../src/data/altars";
import { HEROES } from "../src/data/heroes";
import { SKILLS } from "../src/data/skills";
import { GameEngine, isSkillUnlocked } from "../src/engine";
import { BLADE_DPS_SHARE_MAX, BLADE_DPS_SHARE_PER_LEVEL, derive, heroCost, heroCostMultiplier } from "../src/formulas";

export interface BotOptions {
  clicksPerSecond: number;
  /** Stop attack clicks from this stage of each run on (idle player); powers and crystals stay. */
  idleFromStage?: number;
  /** Occasional player: clicks only `seconds` out of every `everySeconds`. */
  burst?: { everySeconds: number; seconds: number };
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
    const gain = after.dps - base.dps + (after.click - base.click) * clicksPerSecond * (1 + after.critChance * (after.critMultiplier - 1));
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
    const inBurst = !options.burst || ((now - start) / 1000) % options.burst.everySeconds < options.burst.seconds;
    const clicking = inBurst && (options.idleFromStage === undefined || s.maxStage < options.idleFromStage);
    const clicksPerSecond = clicking ? options.clicksPerSecond : 0;
    clickDebt += clicksPerSecond * DT;
    while (clickDebt >= 1) {
      clickDebt -= 1;
      engine.click(now);
    }
    engine.tick(now);
    if (s.crystal) engine.clickCrystal(now);

    if (step % 5 === 0) {
      engine.buyAllUpgrades(now);
      for (let guard = 0; guard < 50; guard += 1) {
        const best = bestHeroPurchase(engine, now, clicksPerSecond);
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
        // A clicking player never benefits from patience, an idle one from click altars.
        const wanted = options.idleFromStage === undefined && !options.burst
          ? ["might", "blade", "fortune", "time", "precision", "fate"]
          : ["might", "fortune", "time", "patience"];
        // Past the level that maxes its DPS share, the blade only helps the first stages.
        const bladeMaxed = (s.altars.blade ?? 0) >= BLADE_DPS_SHARE_MAX / BLADE_DPS_SHARE_PER_LEVEL;
        const choices = ALTARS.filter((altar) => wanted.includes(altar.id) && !(altar.id === "blade" && bladeMaxed))
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
