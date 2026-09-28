import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { achievementText, gameText, itemName, monsterName } from "./content";
import { ACHIEVEMENTS } from "./data/achievements";
import { ALTARS, ALTAR_BY_ID, altarCost, altarTotalCost } from "./data/altars";
import { BIOMES, TREASURE_MONSTER } from "./data/biomes";
import { HEROES } from "./data/heroes";
import { SLOTS, SLOT_BASE_COUNT } from "./data/items";
import { MARKET_OFFERS } from "./data/market";
import { SKILLS } from "./data/skills";
import { GameEngine } from "./engine";
import {
  ASCENSION_MIN_STAGE,
  MONSTERS_PER_STAGE,
  REUNION_DPS,
  REUNION_MIN_AWAY_SECONDS,
  ascensionPreview,
  wandererSkip,
  IDLE_FULL_MS,
  IDLE_GRACE_MS,
  altarValue,
  bossHp,
  derive,
  essencesForStage,
  heroCost,
  maxAffordableLevels,
  stageGold,
  stageHp
} from "./formulas";
import { generateItem } from "./loot";
import { validateUsername } from "./moderation";
import { LOCALES, negotiateLocale, resolveLocale } from "./i18n";
import { formatDuration, formatNumber, formatPercent } from "./numbers";
import { seededRng } from "./rng";
import { migrateState, parseState } from "./save";
import { ALTAR_REWORK_NOTICE, SAVE_VERSION, createInitialState } from "./state";
import { verifyState, verifyTransition } from "./validation";
import type { GameState } from "./types";

const T0 = Date.UTC(2026, 2, 1);

function newGame(seed = 1) {
  return new GameEngine(createInitialState(T0), seededRng(seed), T0);
}

/** Advances the simulation in small steps (like the real loop). */
function run(engine: GameEngine, from: number, seconds: number, clicksPerSecond = 0): number {
  let now = from;
  let debt = 0;
  for (let step = 0; step < seconds * 10; step += 1) {
    now += 100;
    debt += clicksPerSecond / 10;
    while (debt >= 1) {
      debt -= 1;
      engine.click(now);
    }
    engine.tick(now);
  }
  return now;
}

describe("numbers", () => {
  it("formats big numbers", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(1_500)).toBe("1.5K");
    expect(formatNumber(2_340_000)).toBe("2.34M");
    expect(formatNumber(1e15)).toBe("1Qa");
    expect(formatNumber(1.5e21, "scientific")).toBe("1.50e21");
    expect(formatNumber(1e60)).toMatch(/^1[a-z]{2}$/);
    expect(formatNumber(100_000)).toBe("100K");
    expect(formatNumber(20e6)).toBe("20M");
    expect(formatPercent(0.4, "letters", "fr")).toBe("40 %");
    expect(formatPercent(0.25, "letters", "en")).toBe("25%");
  });

  it("formats durations per locale", () => {
    expect(formatDuration(3_725, "fr")).toBe("1 h 02 min");
    expect(formatDuration(3_725, "en")).toBe("1h 02m");
    expect(formatDuration(90_000, "fr")).toBe("1 j 1 h");
    expect(formatDuration(42, "en")).toBe("42s");
  });
});

describe("formulas", () => {
  it("grows HP and gold with the stage", () => {
    expect(stageHp(1)).toBe(10);
    for (let stage = 2; stage < 1000; stage += 37) {
      expect(stageHp(stage)).toBeGreaterThan(stageHp(stage - 1));
      expect(stageGold(stage)).toBeGreaterThan(0);
    }
    expect(bossHp(10)).toBe(stageHp(10) * 10);
    expect(Number.isFinite(stageHp(3000))).toBe(true);
  });

  it("computes bulk purchases consistently", () => {
    const hero = HEROES[1];
    const one = heroCost(hero, 0, 1);
    const ten = heroCost(hero, 0, 10);
    expect(ten).toBeGreaterThan(one * 10);
    const affordable = maxAffordableLevels(hero, 0, ten);
    expect(affordable).toBe(10);
    expect(heroCost(hero, 0, affordable)).toBeLessThanOrEqual(ten);
  });

  it("only grants essences from the Fallen King on", () => {
    expect(essencesForStage(49)).toBe(0);
    expect(essencesForStage(50)).toBeGreaterThan(0);
    expect(essencesForStage(150)).toBeGreaterThan(essencesForStage(100));
  });
});

describe("combat loop", () => {
  it("spawns a monster and kills it by clicking", () => {
    const engine = newGame();
    let now = run(engine, T0, 1);
    expect(engine.state.monster).not.toBeNull();
    for (let index = 0; index < 20; index += 1) engine.click((now += 50));
    expect(engine.state.run.kills).toBeGreaterThan(0);
    expect(engine.state.gold).toBeGreaterThan(0);
  });

  it("advances a stage after 10 kills", () => {
    const engine = newGame();
    run(engine, T0, 60, 10);
    expect(engine.state.maxStage).toBeGreaterThan(1);
  });

  it("goes back one stage when the boss timer runs out", () => {
    const engine = newGame();
    engine.state.maxStage = 5;
    engine.state.maxStageEver = 5;
    engine.state.stage = 5;
    run(engine, T0, 40);
    expect(engine.state.stage).toBe(4);
    expect(engine.state.autoAdvance).toBe(false);
    expect(engine.state.lifetime.bossFails).toBe(1);
  });

  it("gives no shards or items for a boss replayed below the furthest stage", () => {
    const game = new GameEngine(lateGame(), seededRng(1), T0);
    game.state.maxStage = 60;
    game.state.maxStageEver = 60;
    game.travel(50);
    run(game, T0, 60);
    expect(game.state.run.bosses).toBeGreaterThan(5);
    expect(game.state.lifetime.shardsEarned).toBe(0);
    expect(game.state.lifetime.itemsFound).toBe(0);
    expect(game.state.gold).toBeGreaterThan(0);
  });

  it("hires companions that deal DPS", () => {
    const engine = newGame();
    engine.state.gold = 1_000;
    expect(engine.buyHero("maelle", 1, T0)).toBe(true);
    expect(engine.derived.dps).toBeGreaterThan(0);
    expect(engine.state.gold).toBeLessThan(1_000);
    expect(engine.buyHero("maelle", 100, T0)).toBe(false);
  });

  it("unlocks and uses a power", () => {
    const engine = newGame();
    engine.state.gold = 1e6;
    engine.buyHero("aldric", 10, T0);
    expect(engine.useSkill("frenzy", T0)).toBe(true);
    expect(engine.useSkill("frenzy", T0 + 1000)).toBe(false);
    run(engine, T0, 5);
    expect(engine.state.run.clicks).toBe(0);
    expect(engine.state.run.kills).toBeGreaterThan(0);
  });

  it("rewards clicking a crystal", () => {
    const engine = newGame();
    engine.state.nextCrystalAt = T0;
    engine.tick(T0 + 100);
    expect(engine.state.crystal).not.toBeNull();
    expect(engine.clickCrystal(T0 + 200)).toBe(true);
    expect(engine.state.lifetime.crystals).toBe(1);
  });
});

/** A late run: every companion at level 200 with every talent, as a player around stage 110. */
function lateGame(): GameState {
  const state = createInitialState(T0);
  for (const hero of HEROES) {
    state.heroLevels[hero.id] = hero.id === "aldric" ? 400 : 200;
    for (const upgrade of hero.upgrades) state.heroUpgrades.push(upgrade.id);
  }
  return state;
}

/** Average damage per second of `clicksPerSecond` clicks (crits included) over the active DPS. */
function clickRatio(state: GameState, now: number, clicksPerSecond: number): number {
  const d = derive(state, now, { ignoreTimed: true });
  const activeDps = d.dps / (1 + d.idleBonus * d.idleRatio);
  return (clicksPerSecond * d.click * (1 + d.critChance * (d.critMultiplier - 1))) / activeDps;
}

describe("idle and active balance", () => {
  it("lets clicks carry the start of a run", () => {
    const engine = newGame();
    engine.state.gold = 500;
    engine.buyHero("aldric", 10, T0);
    engine.buyHero("maelle", 1, T0);
    expect(clickRatio(engine.state, T0, 5)).toBeGreaterThan(2);
  });

  it("keeps sustained clicking around companion DPS in the late game", () => {
    const state = lateGame();
    state.lastClickAt = T0;
    const ratio = clickRatio(state, T0, 5);
    expect(ratio).toBeGreaterThan(0.1);
    expect(ratio).toBeLessThan(1);
    // Mashing at 10 clicks/s beats an idle player by a modest margin at most.
    const idle = derive(state, T0 + IDLE_FULL_MS, { ignoreTimed: true });
    const active = derive(state, T0, { ignoreTimed: true });
    expect(active.dps * (1 + clickRatio(state, T0, 10))).toBeLessThan(idle.dps * 1.5);
  });

  it("gives the idle bonus to companions only, never to clicks", () => {
    const state = lateGame();
    state.altars.patience = 5;
    state.lastClickAt = T0;
    const active = derive(state, T0);
    const idle = derive(state, T0 + IDLE_FULL_MS);
    expect(active.idle).toBe(false);
    expect(idle.idle).toBe(true);
    // Sentinel's Vigil (+50%), Silent Legion (+100%), Altar of Patience at level 5.
    const bonus = 1.5 + altarValue(state, "patience");
    expect(altarValue(state, "patience")).toBeGreaterThan(0);
    expect(idle.idleBonus).toBeCloseTo(bonus);
    expect(active.idleBonus).toBeCloseTo(bonus);
    expect(idle.dps).toBeCloseTo(active.dps * (1 + bonus));
    expect(idle.heroDps.maelle).toBeCloseTo(active.heroDps.maelle * (1 + bonus));
    expect(idle.click).toBeCloseTo(active.click);
    expect(derive(state, T0, { forceIdle: true }).dps).toBeCloseTo(idle.dps);
  });

  it("applies sharpness to the whole click, DPS share included", () => {
    const state = lateGame();
    const plain = derive(state, T0);
    state.buffs.push({ id: "sharpness", until: T0 + 20_000 });
    expect(derive(state, T0).click).toBeCloseTo(plain.click * 10);
  });

  it("caps the critical damage of relics", () => {
    const state = lateGame();
    const base = derive(state, T0).critMultiplier;
    for (const slot of SLOTS) {
      state.equipment[slot] = { ...generateItem(seededRng(3), 100, { slot }), affixes: [{ stat: "critDamage", value: 5 }] };
    }
    expect(derive(state, T0).critMultiplier).toBeCloseTo(base * 1.5);
  });

  it("bounds a click build with every crit investment maxed", () => {
    const state = lateGame();
    state.lastClickAt = T0;
    Object.assign(state.altars, { precision: 25, fate: 5, blade: 10 });
    state.lifetime.essencesEarned = 1e6;
    for (const slot of SLOTS) {
      state.equipment[slot] = { ...generateItem(seededRng(3), 100, { slot }), affixes: [{ stat: "critChance", value: 0.08 }, { stat: "critDamage", value: 5 }] };
    }
    const ratio = clickRatio(state, T0, 5);
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(6);
  });

  it("grows the idle bonus from 3 s to 30 s after the last click", () => {
    const state = lateGame();
    state.lastClickAt = T0;
    const at = (ms: number) => derive(state, T0 + ms).idleRatio;
    expect(at(0)).toBe(0);
    expect(at(IDLE_GRACE_MS)).toBe(0);
    expect(at((IDLE_GRACE_MS + IDLE_FULL_MS) / 2)).toBeCloseTo(0.5);
    expect(at(IDLE_FULL_MS)).toBe(1);
    expect(derive(state, T0 + IDLE_FULL_MS).idle).toBe(true);
    expect(derive(state, T0 + IDLE_FULL_MS - 1).idle).toBe(false);
    const half = derive(state, T0 + (IDLE_GRACE_MS + IDLE_FULL_MS) / 2);
    const none = derive(state, T0);
    expect(half.dps).toBeCloseTo(none.dps * (1 + half.idleBonus / 2));
  });

  it("makes an isolated click cheap for an idle player", () => {
    const engine = new GameEngine(lateGame(), seededRng(1), T0);
    let now = run(engine, T0, 60);
    engine.click(now);
    expect(engine.derived.idleRatio).toBe(0);
    // Average idle bonus kept over the two minutes that follow one click.
    let kept = 0;
    for (let step = 0; step < 1200; step += 1) {
      now += 100;
      engine.tick(now);
      kept += engine.derived.idleRatio / 1200;
    }
    expect(kept).toBeGreaterThan(0.85);
  });

  it("lets the Altar of the Blade raise the DPS share of clicks, up to +50%", () => {
    const state = lateGame();
    const base = derive(state, T0);
    const share = (blade: number) => {
      state.altars.blade = blade;
      const d = derive(state, T0);
      const flat = (base.click - base.dps * base.clickDpsShare) * (1 + blade * 0.25);
      return (d.click - flat) / (d.dps * d.clickDpsShare);
    };
    expect(share(0)).toBeCloseTo(1);
    expect(share(4)).toBeCloseTo(1.2);
    expect(share(10)).toBeCloseTo(1.5);
    expect(share(40)).toBeCloseTo(1.5);
  });

  it("caps altars and prices their levels exponentially", () => {
    expect(altarCost("fate", 4)).toBe(48);
    expect(altarCost("fate", 5)).toBe(Number.POSITIVE_INFINITY);
    const engine = new GameEngine(lateGame(), seededRng(1), T0);
    engine.state.essences = 1_000;
    engine.state.lifetime.essencesEarned = 1_000;
    for (let level = 0; level < 5; level += 1) expect(engine.buyAltar("fate", T0)).toBe(true);
    expect(engine.buyAltar("fate", T0)).toBe(false);
    expect(engine.state.essences).toBe(1_000 - (3 + 6 + 12 + 24 + 48));
    expect(altarTotalCost("fate", 5)).toBeLessThanOrEqual(3 + 6 + 12 + 24 + 48);
    // Open-ended altars multiply their effect at each level.
    engine.state.altars.might = 3;
    expect(altarValue(engine.state, "might")).toBeCloseTo(Math.pow(1 + ALTAR_BY_ID.might.valuePerLevel, 3) - 1);
  });

  it("lets the Altar of the Wanderer skip the first stages of a run, never paying them twice", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    const s = engine.state;
    // A record of 80 and the essences of two levels, as after a few ascensions.
    s.maxStageEver = 80;
    s.altars.wanderer = 2;
    s.maxStage = 60;
    s.stage = 60;
    const before = structuredClone(s);
    const kills = s.lifetime.kills;
    engine.ascend(now);
    expect(wandererSkip(s)).toBe(20);
    expect(s.runStartStage).toBe(21);
    expect(s.maxStage).toBe(21);
    expect(s.stage).toBe(21);
    expect(s.lifetime.kills - kills).toBe(16 * MONSTERS_PER_STAGE + 4);
    expect(s.gold).toBeGreaterThan(0);
    // The skipped stages pay nothing on the next ascension, and the run cannot be cashed at once.
    expect(engine.canAscend()).toBe(false);
    s.maxStage = 60;
    expect(ascensionPreview(s, now)).toBe(Math.floor((essencesForStage(59) - essencesForStage(20)) * derive(s, now).essenceMultiplier));
    s.maxStage = 21;
    now += 60_000;
    expect(verifyTransition(before, s, 60_000).map((v) => v.code)).not.toContain("kills");
    expect(verifyState(s, now).map((v) => v.code)).not.toContain("power");
    expect(verifyState(s, now).map((v) => v.code)).not.toContain("stage-order");
    const cheated = structuredClone(s);
    cheated.runStartStage = 41;
    cheated.maxStage = 41;
    cheated.stage = 41;
    expect(verifyState(cheated, now).map((v) => v.code)).toContain("stage-order");
  });

  it("never pays fewer essences than before version 4, so older ascension records stay valid", () => {
    const legacy = (stage: number) => stage < ASCENSION_MIN_STAGE - 1
      ? 0
      : Math.floor(5 * Math.pow(1.075, Math.min(stage, 140) - 50) * Math.pow(1.02, Math.max(0, stage - 140)) + (stage - 50));
    for (let stage = 1; stage <= 3000; stage += 1) expect(essencesForStage(stage)).toBeGreaterThanOrEqual(legacy(stage));
  });

  it("refunds the altars of a version 3 save once, in essences", () => {
    const legacy = structuredClone(lateGame()) as GameState;
    legacy.version = 3;
    legacy.lifetime.essencesEarned = 10_000;
    // Old prices: might linear (1 + 2 + … + 10 = 55), fate linear by 2 (2 + … + 24 = 156,
    // bought before its cap), time 2 × 1.35^n.
    legacy.altars = { might: 10, fate: 12, time: 3 };
    legacy.essences = 10_000 - 55 - 156 - 9;
    const migrated = parseState(JSON.parse(JSON.stringify(legacy)));
    expect(migrated.altars).toEqual({});
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.essences).toBeGreaterThan(10_000 - 1);
    expect(migrated.essences).toBeLessThanOrEqual(10_000);
    expect(verifyState(migrated, T0).map((violation) => violation.code)).not.toContain("essence-ledger");
    // Idempotent: a version 4 save keeps its altars.
    migrated.altars = { might: 2 };
    expect(parseState(JSON.parse(JSON.stringify(migrated))).altars).toEqual({ might: 2 });
  });

  it("loads a version 4 save whose monster still carries its painted image, and plays it", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 10 * 60, { clicksPerSecond: 6, stagnationMs: 10 * 60_000 });
    // Between two monsters the state holds none: step until one stands.
    while (!engine.state.monster) now = run(engine, now, 0.1);
    const legacy = structuredClone(engine.state) as GameState & { monster: Record<string, unknown> };
    legacy.version = 4;
    legacy.monster = { ...legacy.monster, image: "/assets/enemies/field-rat.webp", filter: "hue-rotate(160deg)", scale: 1.12 };
    const migrated = parseState(JSON.parse(JSON.stringify(legacy)));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.monster).not.toHaveProperty("image");
    expect(migrated.monster).not.toHaveProperty("filter");
    expect(migrated.monster).not.toHaveProperty("scale");
    expect(verifyState(migrated, now)).toEqual([]);
    expect(verifyTransition(engine.state, migrated, 1000)).toEqual([]);
    const resumed = new GameEngine(migrated, seededRng(5), now);
    const kills = resumed.state.lifetime.kills;
    run(resumed, now, 120, 5);
    expect(resumed.state.lifetime.kills).toBeGreaterThan(kills);
  });

  it("reports companion damage once per second", () => {
    const engine = newGame();
    engine.state.gold = 1e6;
    engine.buyHero("maelle", 25, T0);
    const now = run(engine, T0, 3);
    const events = engine.drainEvents().filter((event) => event.type === "dps");
    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events.length).toBeLessThanOrEqual(3);
    for (const event of events) expect(event.type === "dps" && event.damage).toBeGreaterThan(0);
    expect(now).toBe(T0 + 3000);
  });

  it("does not reject a boss beaten while idle", () => {
    const state = lateGame();
    // Idle bonus (+40,000%) far above the margins of the power check (timed buffs, bursts
    // of crits, ×10 slack), so only the idle bonus itself can explain the boss.
    state.altars.patience = 100_000;
    state.lifetime.essencesEarned = 1e10;
    state.lastClickAt = T0;
    const idle = derive(state, T0 + IDLE_FULL_MS, { ignoreTimed: true });
    // The highest boss the idle companions alone beat in half the timer.
    let stage = 10;
    while (bossHp(stage + 5) < (idle.dps * idle.bossTimer) / 2) stage += 5;
    state.stage = state.maxStage = state.maxStageEver = stage + 1;
    const codes = verifyState(state, T0 + 1000).map((violation) => violation.code);
    expect(codes).not.toContain("power");
  });
});

describe("ascension", () => {
  it("resets the run and grants essences", () => {
    const engine = newGame();
    const s = engine.state;
    s.maxStage = ASCENSION_MIN_STAGE + 9;
    s.maxStageEver = s.maxStage;
    s.gold = 1e30;
    engine.buyHero("maelle", 25, T0);
    engine.buyHero("maelle", 25, T0);
    const gain = engine.ascend(T0);
    expect(gain).toBeGreaterThan(0);
    expect(s.essences).toBe(gain);
    expect(s.gold).toBe(0);
    expect(s.heroLevels).toEqual({});
    expect(s.stage).toBe(1);
    expect(s.maxStageEver).toBe(ASCENSION_MIN_STAGE + 9);
    expect(engine.buyAltar("might", T0)).toBe(true);
    expect(s.altars.might).toBe(1);
  });

  it("refuses to ascend before the Fallen King", () => {
    const engine = newGame();
    expect(engine.canAscend()).toBe(false);
    expect(engine.ascend(T0)).toBe(0);
  });

  it("defines a finite cost for every altar", () => {
    for (const altar of ALTARS) expect(altar.costBase).toBeGreaterThan(0);
  });
});

describe("items", () => {
  it("generates valid items and equips them", () => {
    const rng = seededRng(7);
    for (let index = 0; index < 200; index += 1) {
      const item = generateItem(rng, 1 + index * 3);
      expect(item.affixes.length).toBeGreaterThan(0);
      expect(item.base).toBeLessThan(SLOT_BASE_COUNT[item.slot]);
      for (const locale of LOCALES) expect(itemName(item, locale).length).toBeGreaterThan(2);
    }
    const engine = newGame();
    const before = derive(engine.state, T0).dps;
    engine.state.inventory.push(generateItem(rng, 30, { slot: "weapon" }));
    expect(engine.equip(engine.state.inventory[0].uid, T0)).toBe(true);
    expect(engine.state.equipment.weapon).toBeDefined();
    expect(before).toBe(0);
  });
});

describe("save", () => {
  it("accepts a JSON-serialized game", () => {
    const engine = newGame();
    run(engine, T0, 30, 5);
    const restored = parseState(JSON.parse(JSON.stringify(engine.state)));
    expect(restored.lifetime.kills).toBe(engine.state.lifetime.kills);
  });

  it("rejects an inconsistent save", () => {
    const state = createInitialState(T0);
    expect(() => parseState({ ...state, stage: 9, maxStage: 2 })).toThrow();
    expect(() => parseState({ ...state, gold: -5 })).toThrow();
  });

  it("fills in an older save", () => {
    const partial = { ...createInitialState(T0), version: 3 } as Record<string, unknown>;
    delete partial.tutorial;
    // An older save still has to see the notice of the altar rework; a new one never does.
    expect(parseState(partial).tutorial.done).toEqual([]);
    expect(createInitialState(T0).tutorial.done).toEqual([ALTAR_REWORK_NOTICE]);
  });
});

describe("anti-cheat", () => {
  it("accepts a real multi-hour game saved regularly", () => {
    const engine = newGame(3);
    let now = T0;
    let previous = structuredClone(engine.state);
    let previousAt = now;
    for (let save = 0; save < 24; save += 1) {
      now = playBot(engine, now, 15 * 60, { clicksPerSecond: 6, stagnationMs: 10 * 60_000 });
      const snapshot = structuredClone(engine.state);
      expect(verifyState(snapshot, now)).toEqual([]);
      expect(verifyTransition(previous, snapshot, now - previousAt)).toEqual([]);
      previous = snapshot;
      previousAt = now;
    }
    expect(engine.state.lifetime.ascensions).toBeGreaterThan(0);
  }, 60_000);

  it("accepts coming back after an absence", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    const before = structuredClone(engine.state);
    now += 6 * 3600_000;
    const summary = engine.tick(now);
    expect(summary?.gold).toBeGreaterThan(0);
    expect(verifyTransition(before, engine.state, 6 * 3600_000 + 1000)).toEqual([]);
    expect(verifyState(engine.state, now)).toEqual([]);
  });

  it("levels companions and pushes stages while away, up to a boss they cannot beat", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    engine.state.autoAdvance = true;
    engine.state.stage = engine.state.maxStage;
    const before = structuredClone(engine.state);
    now += 8 * 3600_000;
    const summary = engine.tick(now)!;
    const s = engine.state;
    expect(summary.levels).toBeGreaterThan(0);
    expect(summary.spent).toBeGreaterThan(0);
    expect(summary.stages).toBeGreaterThan(0);
    expect(s.maxStage).toBe(before.maxStage + summary.stages);
    expect(summary.blockedAt).toBe(s.maxStage);
    const d = derive(s, now, { ignoreTimed: true, forceIdle: true });
    expect(bossHp(s.maxStage)).toBeGreaterThan(d.dps * d.bossDamage * d.bossTimer);
    expect(s.stage).toBe(s.maxStage - 1);
    expect(s.autoAdvance).toBe(false);
    expect(verifyTransition(before, s, 8 * 3600_000 + 1000)).toEqual([]);
    expect(verifyState(s, now)).toEqual([]);
  });

  it("keeps the gold earned while away when offline spending is off", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    engine.state.settings.offlineSpending = false;
    const gold = engine.state.gold;
    const levels = structuredClone(engine.state.heroLevels);
    now += 8 * 3600_000;
    const summary = engine.tick(now)!;
    expect(summary.levels).toBe(0);
    expect(summary.spent).toBe(0);
    expect(engine.state.heroLevels).toEqual(levels);
    expect(engine.state.gold).toBeCloseTo(gold + summary.gold);
  });

  it("welcomes the walker back with the Reunion, a sixth of the time away, never during it", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    engine.markInput(now);
    const before = structuredClone(engine.state);
    now += 8 * 3600_000;
    engine.tick(now);
    // A background tab caught up: nothing while away, the Reunion when the player is back.
    expect(engine.state.buffs.some((buff) => buff.id === "reunion")).toBe(false);
    engine.drainEvents();
    engine.markInput(now);
    expect(engine.state.buffs.find((buff) => buff.id === "reunion")?.until).toBe(now + 3600_000);
    expect(engine.drainEvents()).toContainEqual({ type: "reunion", seconds: 3600 });
    const timed = derive(engine.state, now);
    const untimed = derive(engine.state, now, { ignoreTimed: true });
    expect(timed.dps / untimed.dps).toBeCloseTo(REUNION_DPS);
    expect(verifyTransition(before, engine.state, 8 * 3600_000 + 1000)).toEqual([]);
    expect(verifyState(engine.state, now)).toEqual([]);

    // An open tab left alone counts too; a short absence brings nothing.
    const open = newGame(4);
    let then = playBot(open, T0, 30 * 60, { clicksPerSecond: 5 });
    open.markInput(then);
    then = run(open, then, REUNION_MIN_AWAY_SECONDS - 60);
    open.markInput(then);
    expect(open.state.buffs.some((buff) => buff.id === "reunion")).toBe(false);
    then = run(open, then, 2 * 3600);
    open.markInput(then);
    expect(open.state.buffs.find((buff) => buff.id === "reunion")?.until).toBe(then + 1_200_000);
  }, 60_000);

  it("rejects boons that last too long", () => {
    const engine = newGame(4);
    const now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    const forged = structuredClone(engine.state);
    forged.buffs.push({ id: "reunion", until: forged.lastTickAt + 3 * 3600_000 });
    expect(verifyState(forged, now).map((violation) => violation.code)).toContain("buff");
    const endless = structuredClone(engine.state);
    endless.buffs.push({ id: "rage", until: endless.lastTickAt + 24 * 3600_000 });
    expect(verifyState(endless, now).map((violation) => violation.code)).toContain("buff");
  });

  it("pushes on while away even when auto-advance was paused by a failed boss", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    engine.state.autoAdvance = false;
    engine.state.stage = Math.max(1, engine.state.maxStage - 1);
    const { maxStage } = engine.state;
    now += 3600_000;
    const summary = engine.tick(now)!;
    expect(summary.gold).toBeGreaterThan(0);
    expect(engine.state.maxStage).toBe(maxStage + summary.stages);
    expect(engine.state.stage).toBeGreaterThanOrEqual(engine.state.maxStage - 1);
  });

  it("lets the autopilot of an open tab level companions and retry bosses, only once the player is away", () => {
    const engine = newGame(4);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    engine.afkAfterMs = 60_000;
    engine.markInput(now);
    const levels = () => Object.values(engine.state.heroLevels).reduce((total, level) => total + level, 0);
    const before = structuredClone(engine.state);
    now = run(engine, now, 50);
    expect(levels()).toBe(Object.values(before.heroLevels).reduce((total, level) => total + level, 0));

    now = run(engine, now, 2 * 3600);
    expect(levels()).toBeGreaterThan(Object.values(before.heroLevels).reduce((total, level) => total + level, 0));
    expect(engine.state.maxStage).toBeGreaterThan(before.maxStage);
    expect(verifyTransition(before, engine.state, 2 * 3600_000 + 50_000)).toEqual([]);
    expect(verifyState(engine.state, now)).toEqual([]);
  }, 60_000);

  it("detects edited gold", () => {
    const engine = newGame();
    const now = run(engine, T0, 60, 5);
    const cheated = structuredClone(engine.state);
    cheated.gold = 1e20;
    expect(verifyState(cheated, now).map((v) => v.code)).toContain("gold-ledger");
  });

  it("detects a stage too hard for the player's power", () => {
    const engine = newGame();
    const now = run(engine, T0, 60, 5);
    const cheated = structuredClone(engine.state);
    cheated.maxStage = 400;
    cheated.maxStageEver = 400;
    cheated.stage = 400;
    expect(verifyState(cheated, now).map((v) => v.code)).toContain("power");
  });

  it("detects companion levels bought without gold", () => {
    const engine = newGame();
    const now = run(engine, T0, 60, 5);
    const cheated = structuredClone(engine.state);
    cheated.heroLevels.awakened = 500;
    expect(verifyState(cheated, now).map((v) => v.code)).toContain("gold-ledger");
  });

  it("detects invented essences and a tampered item", () => {
    const engine = newGame();
    const now = run(engine, T0, 60, 5);
    const cheated = structuredClone(engine.state);
    cheated.essences = 1e6;
    cheated.equipment.weapon = { ...generateItem(seededRng(1), 1, { slot: "weapon" }), affixes: [{ stat: "dps", value: 500 }] };
    const codes = verifyState(cheated, now).map((v) => v.code);
    expect(codes).toContain("essence-ledger");
    expect(codes).toContain("item");
  });

  it("detects an autoclicker and tampered play time", () => {
    const engine = newGame();
    const now = run(engine, T0, 60, 5);
    const before = structuredClone(engine.state);
    const after = structuredClone(engine.state);
    after.lifetime.clicks += 100_000;
    after.lifetime.playTime += 10;
    expect(verifyTransition(before, after, 10_000).map((v) => v.code)).toContain("clicks");
    after.lifetime.playTime += 100_000;
    expect(verifyTransition(before, after, 10_000).map((v) => v.code)).toContain("time");
    expect(now).toBeGreaterThan(T0);
  });

  it("detects an unearned achievement", () => {
    const cheated = createInitialState(T0);
    cheated.achievements.push("stage-9");
    expect(verifyState(cheated, T0).map((v) => v.code)).toContain("achievement");
  });
});

describe("usernames", () => {
  it("accepts normal usernames", () => {
    for (const name of ["Aldric", "Maëlle_42", "ShadowBlade", "Constance", "Nicolas", "Sextant-9", "Analyste", "Violette", "Cassandre", "Chateaubriand", "Computer", "Bobby", "Unique", "Brotherhood", "Carrot", "Herot7x", "Annulaire"]) {
      expect(validateUsername(name), name).toMatchObject({ ok: true });
    }
  });

  it("refuses offensive usernames, even disguised", () => {
    for (const name of ["connard", "C0nn4rd", "SSaalllooppee", "Hitler88", "n1gg3r", "fdp_du_93", "con", "Big_Con", "admin", "Idlebound", "pUt3", "R00t", "rooooot", "Nuuull"]) {
      expect(validateUsername(name).ok, name).toBe(false);
    }
  });

  it("refuses invalid formats with a reason code", () => {
    expect(validateUsername("ab")).toEqual({ ok: false, reason: "too-short" });
    expect(validateUsername("a".repeat(17))).toEqual({ ok: false, reason: "too-long" });
    expect(validateUsername("hello world")).toEqual({ ok: false, reason: "charset" });
    expect(validateUsername("12345")).toEqual({ ok: false, reason: "no-letter" });
  });
});

describe("i18n", () => {
  it("negotiates the locale from Accept-Language", () => {
    expect(negotiateLocale(null)).toBe("fr");
    expect(negotiateLocale("")).toBe("fr");
    expect(negotiateLocale("fr-CA,fr;q=0.9,en;q=0.8")).toBe("fr");
    expect(negotiateLocale("en-US,en;q=0.9")).toBe("en");
    expect(negotiateLocale("de-DE,en;q=0.5,fr;q=0.8")).toBe("fr");
    expect(negotiateLocale("de-DE,es;q=0.5")).toBe("en");
    expect(negotiateLocale(["en-GB", "fr"])).toBe("en");
    expect(resolveLocale("en", "fr-FR")).toBe("en");
    expect(resolveLocale("xx", "fr-FR")).toBe("fr");
  });

  it("has every piece of game content in every locale", () => {
    for (const locale of LOCALES) {
      const text = gameText(locale);
      for (const biome of BIOMES) {
        expect(text.biomes[biome.id]?.name, `${locale} biome ${biome.id}`).toBeTruthy();
        for (const monster of [...biome.monsters, biome.miniBoss, biome.boss]) expect(text.monsters[monster.id], `${locale} ${monster.id}`).toBeTruthy();
      }
      expect(text.monsters[TREASURE_MONSTER.id]).toBeTruthy();
      for (const hero of HEROES) {
        expect(text.heroes[hero.id]?.name, `${locale} hero ${hero.id}`).toBeTruthy();
        for (const upgrade of hero.upgrades) expect(text.talents[upgrade.id], `${locale} talent ${upgrade.id}`).toBeTruthy();
      }
      for (const skill of SKILLS) expect(text.skills[skill.id]?.name).toBeTruthy();
      for (const altar of ALTARS) expect(text.altars[altar.id]?.name).toBeTruthy();
      for (const offer of MARKET_OFFERS) expect(text.market[offer.id]?.name).toBeTruthy();
      for (const achievement of ACHIEVEMENTS) {
        const { name, description } = achievementText(achievement.id, locale);
        expect(name, `${locale} achievement ${achievement.id}`).not.toBe(achievement.id);
        expect(description.length).toBeGreaterThan(3);
      }
      for (const slot of SLOTS) expect(text.itemBases[slot]).toHaveLength(SLOT_BASE_COUNT[slot]);
    }
  });

  it("names monsters with their era and keeps legacy item names", () => {
    expect(monsterName({ id: "field-rat", kind: "normal" }, 1, "en")).toBe("Field Rat");
    expect(monsterName({ id: "field-rat", kind: "normal" }, 51, "fr")).toBe("Écho · Rat des champs");
    expect(monsterName({ id: "constructor", kind: "normal" }, 1, "en")).toBe("constructor");
    const legacy = { ...generateItem(seededRng(2), 10), base: undefined, name: "Lame fine des plaines" };
    expect(itemName(legacy, "en")).toBe("Lame fine des plaines");
    expect(itemName({ slot: "weapon", rarity: "epic", level: 1, base: 2 }, "en")).toBe("Enchanted Sword of the Plains");
    expect(itemName({ slot: "weapon", rarity: "epic", level: 1, base: 2 }, "fr")).toBe("Épée enchantée des plaines");
  });
});
