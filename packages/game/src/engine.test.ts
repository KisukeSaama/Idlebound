import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { achievementText, gameText, itemName, monsterName } from "./content";
import { ACHIEVEMENTS } from "./data/achievements";
import { ALTARS } from "./data/altars";
import { BIOMES, TREASURE_MONSTER } from "./data/biomes";
import { HEROES } from "./data/heroes";
import { SLOTS, SLOT_BASE_COUNT } from "./data/items";
import { MARKET_OFFERS } from "./data/market";
import { SKILLS } from "./data/skills";
import { GameEngine } from "./engine";
import {
  ASCENSION_MIN_STAGE,
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
import { parseState } from "./save";
import { createInitialState } from "./state";
import { verifyState, verifyTransition } from "./validation";

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
    const partial = { ...createInitialState(T0) } as Record<string, unknown>;
    delete partial.tutorial;
    expect(parseState(partial).tutorial.done).toEqual([]);
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
    for (const name of ["Aldric", "Maëlle_42", "ShadowBlade", "Constance", "Nicolas", "Sextant-9", "Analyste", "Violette", "Cassandre", "Chateaubriand", "Computer", "Bobby", "Unique"]) {
      expect(validateUsername(name), name).toMatchObject({ ok: true });
    }
  });

  it("refuses offensive usernames, even disguised", () => {
    for (const name of ["connard", "C0nn4rd", "SSaalllooppee", "Hitler88", "n1gg3r", "fdp_du_93", "con", "Big_Con", "admin", "Idlebound", "pUt3"]) {
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
