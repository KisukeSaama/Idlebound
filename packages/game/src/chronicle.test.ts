import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { chronicleEntries, firstUnread, markRead, unreadChronicle } from "./chronicle";
import { achievementText, chronicleText, gameText, hireLine, itemName } from "./content";
import { ACHIEVEMENTS } from "./data/achievements";
import { BIOMES } from "./data/biomes";
import { forgeCost } from "./data/items";
import {
  BESTIARY,
  BIOME_ECHOES,
  NOTCH_KILLS,
  RECOGNITION_HEROES,
  RECOGNITION_TIERS,
  SECRETS,
  WANDERERS,
  bestiaryGoldBonus,
  bestiaryKills,
  recognitionTier
} from "./data/lore";
import { NAMED_RELICS } from "./data/relics";
import { STORM_CRYSTALS } from "./data/events";
import { GameEngine } from "./engine";
import { derive, equipmentBonus, forgePrice, stageGold } from "./formulas";
import { LOCALES } from "./i18n";
import { generateItem } from "./loot";
import { seededRng, type Rng } from "./rng";
import { parseState } from "./save";
import { SAVE_VERSION, createInitialState, emptyTrail } from "./state";
import type { GameEvent, GameState } from "./types";
import { verifyState, verifyTransition } from "./validation";

const T0 = Date.UTC(2026, 2, 1);

/** An RNG that plays a script of rolls, then a fixed value. */
function scripted(rolls: number[], rest = 0.5): Rng {
  const queue = [...rolls];
  return () => (queue.length > 0 ? queue.shift()! : rest);
}

function engineWith(state: GameState, rng: Rng = seededRng(1), now = T0) {
  return new GameEngine(state, rng, now);
}

/** Kills whatever stands in the arena, with a click. */
function slay(engine: GameEngine, now: number) {
  engine.state.monster!.hp = 1e-9;
  engine.click(now);
}

/** Advances past the respawn delay so a new monster stands. */
function respawn(engine: GameEngine, now: number): number {
  let at = now;
  while (!engine.state.monster) {
    at += 100;
    engine.tick(at);
  }
  return at;
}

function events(engine: GameEngine, type: GameEvent["type"]) {
  return engine.drainEvents().filter((event) => event.type === type);
}

/** A save whose ledgers are consistent with the Chronicle counters we set by hand. */
function veteran(): GameState {
  const state = createInitialState(T0);
  state.lifetime.playTime = 400 * 3600;
  state.lifetime.kills = 2_000_000;
  state.lifetime.bosses = 100_000;
  state.lifetime.ascensions = 40;
  state.maxStageEver = 400;
  return state;
}

describe("the Hearthfields' creatures and the Bestiary", () => {
  it("meets six Remnants on the first stretch of road and records every kill", () => {
    expect(BIOMES[0].monsters.map((monster) => monster.id)).toEqual(["field-rat", "wild-boar", "carrion-crow", "hollow-scarecrow", "lantern-moth", "dusk-hare"]);
    const engine = engineWith(createInitialState(T0), seededRng(2));
    let now = respawn(engine, T0);
    const first = engine.state.monster!.id;
    slay(engine, now);
    expect(engine.state.bestiary[first]).toBe(1);
    expect(events(engine, "bestiary")).toEqual([{ type: "bestiary", id: first, tier: 1 }]);
    for (let kill = 0; kill < 40; kill += 1) {
      now = respawn(engine, now + 1000);
      slay(engine, now);
    }
    const total = Object.values(engine.state.bestiary).reduce((sum, count) => sum + count, 0);
    expect(total).toBe(engine.state.lifetime.kills);
    expect(verifyState(engine.state, now)).toEqual([]);
  });

  it("raises gold by 1% once every creature of the Hearthfields page is met", () => {
    const state = createInitialState(T0);
    for (const entry of BESTIARY) if (entry.page === "green-plains" && entry.id !== "lost-shepherd") state.bestiary[entry.id] = 1;
    expect(bestiaryGoldBonus(state)).toBe(0);
    const before = derive(state, T0).goldMultiplier;
    state.bestiary["lost-shepherd"] = 1;
    expect(bestiaryGoldBonus(state)).toBeCloseTo(0.01);
    expect(derive(state, T0).goldMultiplier).toBeCloseTo(before * 1.01);
  });

  it("spreads kills made in bulk over the stage's creatures, and keeps the ledger", () => {
    // A walker still on the Hearthfields, whose companions carry on alone for ten minutes.
    const state = createInitialState(T0);
    state.gold = 5_000;
    state.run.goldEarned = 5_000;
    state.lifetime.goldEarned = 5_000;
    state.lifetime.kills = 1_000;
    state.lifetime.playTime = 600;
    state.lastTickAt = T0 + 600_000;
    const engine = engineWith(state, seededRng(4), T0 + 600_000);
    engine.buyHero("maelle", 10, T0 + 600_000);
    let now = T0 + 600_000;
    const before = structuredClone(engine.state);
    now += 10 * 60_000;
    engine.tick(now);
    const sum = (state: GameState) => Object.values(state.bestiary).reduce((total, count) => total + count, 0);
    expect(sum(engine.state) - sum(before)).toBeGreaterThan(0);
    expect(sum(engine.state)).toBeLessThanOrEqual(engine.state.lifetime.kills);
    expect(verifyState(engine.state, now)).toEqual([]);
    expect(verifyTransition(before, engine.state, 10 * 60_000 + 1000)).toEqual([]);
  });
});

describe("the Lost Shepherd", () => {
  it("wanders into the Hearthfields once a run at most, pays ×5 and leaves a fragment", () => {
    // pick a creature, miss the golden rat, meet the wanderer.
    const engine = engineWith(createInitialState(T0), scripted([0, 0.9, 0.001]));
    let now = respawn(engine, T0);
    expect(engine.state.monster).toMatchObject({ id: "lost-shepherd", kind: "rare" });
    expect(engine.state.monster!.gold).toBeCloseTo(stageGold(1) * 5);
    slay(engine, now);
    const fragments = events(engine, "fragment");
    expect(fragments).toContainEqual({ type: "fragment", entry: { source: "wanderer", id: "lost-shepherd" } });
    // The same run never meets him again, even when every roll says so.
    engine.rng = () => 0.001;
    engine.state.lifetime.treasures = 0;
    now = respawn(engine, now + 1000);
    expect(engine.state.monster!.kind).not.toBe("rare");
    expect(chronicleEntries(engine.state)).toContainEqual({ source: "wanderer", id: "lost-shepherd" });
  });

  it("refuses a save that met him more often than it has runs", () => {
    const state = veteran();
    state.bestiary["lost-shepherd"] = state.lifetime.ascensions + 2;
    expect(verifyState(state, T0 + 500 * 3600_000).map((violation) => violation.code)).toContain("bestiary");
    const twice = veteran();
    twice.trail.wanderers = ["lost-shepherd", "lost-shepherd"];
    expect(verifyState(twice, T0 + 500 * 3600_000).map((violation) => violation.code)).toContain("trail");
  });
});

describe("biome echoes", () => {
  it("brings the first echo back on the Moss Alpha's first clear, then by chance, never past the pool", () => {
    const state = createInitialState(T0);
    state.stage = 10;
    state.maxStage = 10;
    state.maxStageEver = 10;
    const engine = engineWith(state, () => 0.99);
    const now = respawn(engine, T0);
    expect(engine.state.monster!.id).toBe("moss-alpha");
    slay(engine, now);
    expect(engine.state.lore.echoes["green-plains"]).toBe(1);
    const entry = chronicleEntries(engine.state).find((item) => item.source === "echo")!;
    expect(chronicleText(entry, "en").by).toBe("Maëlle");
    expect(unreadChronicle(engine.state)).toBe(1);
    engine.state.lore.seen.echo = 1;
    expect(unreadChronicle(engine.state)).toBe(0);
  });

  it("hands over the oldest unread fragment of the first source asked, and marks it read without going back", () => {
    const state = createInitialState(T0);
    expect(firstUnread(state)).toBeNull();
    state.lore.echoes["green-plains"] = 3;
    state.lore.songs = 2;
    state.lore.seen.echo = 1;
    // The book's order: the echoes come before the songs, the oldest unread first.
    expect(firstUnread(state)).toEqual({ entry: { source: "echo", biome: "green-plains", index: 1 }, index: 1 });
    expect(firstUnread(state, ["song", "echo"])).toEqual({ entry: { source: "song", index: 0 }, index: 0 });
    expect(firstUnread(state, ["dream"])).toBeNull();
    markRead(state, "echo", 2);
    expect(state.lore.seen.echo).toBe(2);
    expect(unreadChronicle(state)).toBe(3);
    expect(firstUnread(state)!.index).toBe(2);
    // What was read stays read, and nothing is read that was not found.
    markRead(state, "echo", 1);
    expect(state.lore.seen.echo).toBe(2);
    markRead(state, "echo", 99);
    expect(state.lore.seen.echo).toBe(3);
    expect(firstUnread(state)!.entry.source).toBe("song");
  });

  it("refuses more echoes than the guardians allow", () => {
    const state = veteran();
    state.lore.echoes["green-plains"] = 10;
    expect(verifyState(state, T0 + 500 * 3600_000).map((violation) => violation.code)).toContain("lore");
    const unknown = veteran();
    unknown.lore.echoes["constructor"] = 1;
    expect(verifyState(unknown, T0 + 500 * 3600_000).map((violation) => violation.code)).toContain("lore");
  });
});

describe("Recognition", () => {
  it("remembers the companions who reached level 100 in a run, tier after tier", () => {
    const state = createInitialState(T0);
    state.maxStage = 60;
    state.maxStageEver = 60;
    state.heroLevels = { maelle: 120, brom: 40 };
    state.lifetime.bestLevelSum = 160;
    state.lifetime.bestHired = 2;
    const engine = engineWith(state);
    engine.ascend(T0);
    expect(engine.state.recognition).toEqual({ maelle: 1 });
    expect(recognitionTier(engine.state, "maelle")).toBe(1);
    const drained = engine.drainEvents();
    expect(drained).toContainEqual({ type: "recognition", heroId: "maelle", tier: 1 });
    expect(drained).toContainEqual({ type: "fragment", entry: { source: "memory", hero: "maelle", tier: 1 } });
    expect(hireLine("maelle", 0, "en")).toContain("bow and a friend");
    expect(hireLine("maelle", 1, "fr")).toContain("Encore toi");
    expect(hireLine("maelle", 3, "en")).toBe("There you are. I kept your seat.");
    expect(hireLine("aldric", 3, "en")).toBeNull();
  });

  it("makes a companion who fully remembers fight 10% harder, and never counts more runs than ascensions", () => {
    const state = veteran();
    state.heroLevels = { maelle: 10 };
    state.lifetime.bestLevelSum = 10;
    state.lifetime.bestHired = 1;
    const base = derive(state, T0).heroDps.maelle;
    // Runs alone stop at the third memory: the last two ask for a word kept, once each.
    state.recognition = { maelle: RECOGNITION_TIERS[4] };
    expect(recognitionTier(state, "maelle")).toBe(3);
    expect(derive(state, T0).heroDps.maelle).toBeCloseTo(base);
    state.promises = { maelle: 1 };
    expect(recognitionTier(state, "maelle")).toBe(4);
    state.promises = { maelle: 2 };
    expect(recognitionTier(state, "maelle")).toBe(5);
    expect(derive(state, T0).heroDps.maelle).toBeCloseTo(base * 1.1);
    expect(verifyState(state, T0 + 500 * 3600_000).map((violation) => violation.code)).not.toContain("recognition");
    // A night counts once, twice with a promise kept: never more.
    state.recognition = { maelle: state.lifetime.ascensions + 3 };
    expect(verifyState(state, T0 + 500 * 3600_000).map((violation) => violation.code)).toContain("recognition");
  });
});

describe("named relics", () => {
  it("gives the Thousandth Arrow on the Moss Alpha's thousandth kill, once", () => {
    const state = veteran();
    state.stage = 10;
    state.maxStage = 12;
    state.bestiary["moss-alpha"] = 999;
    const engine = engineWith(state);
    const now = respawn(engine, T0);
    slay(engine, now);
    expect(engine.state.named).toEqual(["thousandth-arrow"]);
    const arrow = engine.state.equipment.weapon!;
    expect(arrow).toMatchObject({ named: "thousandth-arrow", rarity: "legendary", slot: "weapon", locked: true });
    expect(itemName(arrow, "fr")).toBe("La Millième Flèche");
    // Its critical chance counts inside the relics' cap.
    expect(equipmentBonus(engine.state, "critChance")).toBeGreaterThanOrEqual(0.03);
    expect(verifyState(engine.state, T0 + 500 * 3600_000)).toEqual([]);
  });

  it("gives Brom's hammer at the last tier of his Recognition, which lowers the forge's price", () => {
    const state = veteran();
    state.maxStage = 60;
    state.recognition = { brom: RECOGNITION_TIERS[4] - 1 };
    state.promises = { brom: 2 };
    state.heroLevels = { brom: 100 };
    state.lifetime.bestLevelSum = 100;
    state.lifetime.bestHired = 1;
    const engine = engineWith(state);
    engine.ascend(T0);
    expect(engine.state.named).toContain("unfinished-hammer");
    const hammer = engine.state.equipment.weapon!;
    expect(hammer.named).toBe("unfinished-hammer");
    expect(forgePrice(engine.state, hammer)).toBe(Math.ceil(forgeCost("legendary", 0) * 0.85));
  });

  it("finds room for a named relic in a full pack, and Mosshide raises guardian gold", () => {
    const state = veteran();
    state.maxStageEver = 400;
    state.bestiary["moss-alpha"] = 5;
    state.equipment.armor = generateItem(seededRng(1), 10, { slot: "armor" });
    state.inventory = Array.from({ length: 48 }, (_, index) => generateItem(seededRng(index + 2), 10));
    state.lifetime.itemsFound = 60;
    state.stage = 60;
    state.maxStage = 60;
    const engine = engineWith(state, () => 0.001);
    const now = respawn(engine, T0);
    expect(engine.state.monster!.id).toBe("moss-alpha");
    slay(engine, now);
    expect(engine.state.named).toContain("mosshide");
    expect(engine.state.inventory.length).toBe(49);
    expect(verifyState(engine.state, T0 + 500 * 3600_000).map((violation) => violation.code)).not.toContain("inventory");
    const equipped = structuredClone(engine.state);
    equipped.equipment.armor = equipped.inventory.find((item) => item.named === "mosshide");
    expect(derive(equipped, T0).guardianGold).toBeCloseTo(1.1);
  });

  it("refuses a named relic that is unknown, forged, duplicated or from a source never reached", () => {
    const code = (state: GameState) => verifyState(state, T0 + 500 * 3600_000).map((violation) => violation.code);
    const unknown = veteran();
    unknown.named = ["excalibur"];
    expect(code(unknown)).toContain("named");
    const unreached = veteran();
    const arrow = { ...generateItem(seededRng(3), 100, { slot: "weapon", rarity: "legendary" }), named: "thousandth-arrow" };
    unreached.equipment.weapon = arrow;
    unreached.lifetime.itemsFound = 1;
    unreached.named = ["thousandth-arrow"];
    expect(code(unreached)).toContain("named");
    const smuggled = veteran();
    smuggled.bestiary["moss-alpha"] = 1000;
    smuggled.equipment.weapon = { ...arrow, rarity: "mythic" };
    smuggled.lifetime.itemsFound = 1;
    smuggled.named = ["thousandth-arrow"];
    expect(code(smuggled)).toContain("named");
  });
});

describe("secrets", () => {
  it("finds the Thousandth Notch after a thousand kills on the first stretch in one run, a deed with no bonus", () => {
    const state = createInitialState(T0);
    state.trail.fieldKills = NOTCH_KILLS - 1;
    state.run.kills = NOTCH_KILLS - 1;
    state.lifetime.kills = NOTCH_KILLS - 1;
    state.lifetime.playTime = 3600;
    const engine = engineWith(state);
    const now = respawn(engine, T0);
    slay(engine, now);
    expect(engine.state.secrets).toEqual(["thousandth-notch"]);
    expect(engine.state.achievements).toContain("secret-6");
    expect(ACHIEVEMENTS.find((achievement) => achievement.id === "secret-6")!.bonus).toBe(0);
    expect(achievementText("secret-6", "en")).toEqual({ name: "The Thousandth Notch", description: "Count with the huntress." });
    expect(verifyState(engine.state, T0 + 2 * 3600_000)).toEqual([]);
  });

  it("finds the Night Owl after an hour played between midnight and four, by the local clock", () => {
    const night = new Date(2026, 2, 2, 1, 0, 0).getTime();
    const state = createInitialState(night - 1000);
    const engine = engineWith(state, seededRng(1), night);
    let now = night;
    for (let step = 0; step < 3700 * 2; step += 1) {
      now += 500;
      engine.tick(now);
    }
    expect(engine.state.secrets).toContain("night-owl");
    expect(engine.state.lore.nightSeconds).toBeLessThanOrEqual(engine.state.lifetime.playTime);
  });

  it("refuses a secret without its conditions, or an unknown one", () => {
    const code = (state: GameState) => verifyState(state, T0 + 3600_000).map((violation) => violation.code);
    const owl = createInitialState(T0);
    owl.secrets = ["night-owl"];
    expect(code(owl)).toContain("secret");
    const notch = createInitialState(T0);
    notch.secrets = ["thousandth-notch"];
    expect(code(notch)).toContain("secret");
    const unknown = createInitialState(T0);
    unknown.secrets = ["konami"];
    expect(code(unknown)).toContain("secret");
  });
});

describe("the Crystal Storm", () => {
  it("brings the Lantern Queen and five crystals in turn, while someone watches", () => {
    const state = createInitialState(T0);
    state.nextCrystalAt = T0;
    // The crystal's schedule, then the storm roll.
    const engine = engineWith(state, scripted([0.5, 0.01]));
    engine.tick(T0 + 100);
    const drained = engine.drainEvents();
    expect(drained).toContainEqual({ type: "storm" });
    expect(drained).toContainEqual({ type: "fragment", entry: { source: "event", id: "storm" } });
    expect(engine.state.bestiary["lantern-queen"]).toBe(1);
    let caught = 0;
    let now = T0 + 100;
    while (engine.state.crystal && caught < 10) {
      now += 500;
      if (engine.clickCrystal(now)) caught += 1;
    }
    expect(caught).toBe(STORM_CRYSTALS);
    expect(engine.state.crystal).toBeNull();
    expect(verifyState(engine.state, now)).toEqual([]);
  });
});

describe("save version 6", () => {
  it("loads a version 5 save without the Chronicle, verifies it and plays on", () => {
    const engine = engineWith(createInitialState(T0), seededRng(6));
    let now = playBot(engine, T0, 15 * 60, { clicksPerSecond: 5 });
    const legacy = structuredClone(engine.state) as Partial<GameState>;
    legacy.version = 5;
    delete legacy.bestiary;
    delete legacy.lore;
    delete legacy.recognition;
    delete legacy.named;
    delete legacy.secrets;
    delete legacy.trail;
    // Deeds of the story did not exist in version 5.
    legacy.achievements = legacy.achievements!.filter((id) => !/^(bestiary|fragments|strata|kings|seams|recognition|descents|named|secret)-/.test(id));
    if (legacy.monster) legacy.monster.kind = "normal";
    const migrated = parseState(JSON.parse(JSON.stringify(legacy)));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.bestiary).toEqual({});
    expect(migrated.trail).toEqual(emptyTrail());
    expect(verifyState(migrated, now)).toEqual([]);
    expect(verifyTransition(migrated, migrated, 1000)).toEqual([]);
    const resumed = engineWith(migrated, seededRng(7), now);
    const kills = resumed.state.lifetime.kills;
    now = playBot(resumed, now, 5 * 60, { clicksPerSecond: 5 });
    expect(resumed.state.lifetime.kills).toBeGreaterThan(kills);
    expect(verifyState(resumed.state, now)).toEqual([]);
  });

  it("refuses a Bestiary that outnumbers the kills or names an unknown creature, and a Bestiary that goes back", () => {
    const code = (state: GameState) => verifyState(state, T0 + 3600_000).map((violation) => violation.code);
    const inflated = createInitialState(T0);
    inflated.bestiary["field-rat"] = 10;
    expect(code(inflated)).toContain("bestiary");
    const unknown = createInitialState(T0);
    unknown.bestiary["dragon"] = 0;
    expect(code(unknown)).toContain("bestiary");
    const previous = veteran();
    previous.bestiary["field-rat"] = 50;
    const next = structuredClone(previous);
    next.bestiary["field-rat"] = 10;
    expect(verifyTransition(previous, next, 60_000).map((violation) => violation.code)).toContain("rollback");
  });
});

describe("save version 7", () => {
  it("carries the kills of the creatures that became others, and the monster on the road, then verifies and plays", () => {
    const engine = engineWith(createInitialState(T0), seededRng(8));
    let now = playBot(engine, T0, 20 * 60, { clicksPerSecond: 5 });
    const legacy = structuredClone(engine.state) as GameState;
    legacy.version = 6;
    const crows = bestiaryKills(legacy, "carrion-crow");
    expect(crows).toBeGreaterThan(0);
    // The same save as version 6 wrote it: the Rabid Rat and Greattusk under their old ids.
    const old = legacy.bestiary as Record<string, number>;
    old["rabid-rat"] = crows;
    delete old["carrion-crow"];
    const reapers = bestiaryKills(legacy, "last-reaper");
    old["tusk-king"] = reapers;
    delete old["last-reaper"];
    legacy.monster = { id: "rabid-rat", hp: 5, maxHp: 10, kind: "normal", gold: 1 };
    const migrated = parseState(JSON.parse(JSON.stringify(legacy)));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.bestiary["carrion-crow"]).toBe(crows);
    expect(bestiaryKills(migrated, "last-reaper")).toBe(reapers);
    expect(Object.keys(migrated.bestiary)).not.toContain("rabid-rat");
    expect(migrated.monster?.id).toBe("carrion-crow");
    expect(verifyState(migrated, now)).toEqual([]);
    expect(verifyTransition(parseState(JSON.parse(JSON.stringify(legacy))), migrated, 1000)).toEqual([]);
    const resumed = engineWith(migrated, seededRng(9), now);
    const kills = resumed.state.lifetime.kills;
    now = playBot(resumed, now, 5 * 60, { clicksPerSecond: 5 });
    expect(resumed.state.lifetime.kills).toBeGreaterThan(kills);
    expect(verifyState(resumed.state, now)).toEqual([]);
  });
});
