import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { HERO_BY_ID } from "./data/heroes";
import { DROUGHT_DROPS, RARITIES, relicDensity } from "./data/items";
import { AWAKEN_SHARDS_PER_STRATUM, DENSITY_BY_RARITY, MEMORY_MULT, PLACE_BONUS, TRAIT_COUNT, TRAITS, awakenCost, awakenDepth, memoryPool, relicDepth, relicPlace, slotTraits, traitValue } from "./data/traits";
import { GameEngine } from "./engine";
import { SATCHEL_SIZE, affixValue, awakenPrice, derive, offlineCapSeconds, relicChance, relicCompanyGain, routSeconds, stormChance, woundCapAt } from "./formulas";
import { generateItem } from "./loot";
import { seededRng } from "./rng";
import { parseState } from "./save";
import { SAVE_VERSION, createInitialState } from "./state";
import type { GameState, Item, ItemSlot, Rarity } from "./types";
import { verifyState, verifyTransition } from "./validation";

const T0 = Date.UTC(2026, 2, 1);
const codes = (violations: { code: string }[]) => violations.map((violation) => violation.code);

/** A game played honestly by the bot for `minutes`, from `seed`. */
function honestGame(seed: number, minutes = 30) {
  const engine = new GameEngine(createInitialState(T0), seededRng(seed), T0);
  const now = playBot(engine, T0, minutes * 60, { clicksPerSecond: 5 });
  return { engine, now };
}

/** A relic of `rarity` for `slot`, with the traits named (the generator's draws aside). */
function relic(slot: ItemSlot, rarity: Rarity, extra: Partial<Item> = {}): Item {
  return { ...generateItem(seededRng(7), 100, { slot, rarity, bestHired: 21 }), ...extra };
}

describe("what a relic remembers", () => {
  it("remembers traits of its slot by rarity, and who carried it from legendary up", () => {
    for (const rarity of RARITIES) {
      for (let seed = 0; seed < 40; seed += 1) {
        const item = generateItem(seededRng(seed), 300, { rarity, bestHired: 8 });
        const traits = item.traits ?? [];
        expect(traits).toHaveLength(TRAIT_COUNT[rarity]);
        expect(new Set(traits).size).toBe(traits.length);
        expect(traits.every((id) => slotTraits(item.slot).some((trait) => trait.id === id))).toBe(true);
        if (rarity === "legendary" || rarity === "mythic") expect(memoryPool(8)).toContain(item.memory);
        else expect(item.memory).toBeUndefined();
      }
    }
    // Five traits a slot, values that grow with the rarity.
    for (const slot of ["weapon", "armor", "amulet", "ring"] as const) expect(slotTraits(slot).length).toBeGreaterThanOrEqual(4);
    for (const trait of TRAITS) expect([...trait.values].sort((a, b) => a - b)).toEqual([...trait.values]);
    // Aldric is the walker: a relic never remembers him, and the first companion is always known.
    expect(memoryPool(0)).toEqual(["maelle"]);
    expect(memoryPool(21)).not.toContain("aldric");
  });

  it("weighs more for a clearer memory, and grows with the depth it is awakened at", () => {
    const deep = (rarity: Rarity) => ({ ...relic("weapon", rarity), level: 1001, depth: undefined });
    expect(relicDensity(deep("common"))).toBeCloseTo((1 + DENSITY_BY_RARITY.common) ** 20);
    expect(relicDensity(deep("mythic"))).toBeCloseTo((1 + DENSITY_BY_RARITY.mythic) ** 20);
    expect(DENSITY_BY_RARITY.mythic).toBeGreaterThan(DENSITY_BY_RARITY.common);
    const blade = relic("weapon", "epic", { level: 120 });
    const awakened = { ...blade, depth: awakenDepth(blade, 1000) };
    expect(awakened.depth).toBe(970);
    expect(relicPlace(awakened)).toBe(relicPlace(blade));
    expect(relicDensity(awakened)).toBeCloseTo((1 + DENSITY_BY_RARITY.epic) ** 19);
    expect(affixValue(awakened, "dps")).toBeGreaterThan(affixValue(blade, "dps"));
    // Below the Dawn the night is drawn again: a relic weighs no more than the First Mark.
    const below = { ...relic("weapon", "mythic"), level: 4001 };
    expect(relicDensity(below)).toBeCloseTo((1 + DENSITY_BY_RARITY.mythic) ** 59);
    // Seventeen strata down, at the epic's price per stratum.
    expect(awakenCost(blade, 1000)).toBe(AWAKEN_SHARDS_PER_STRATUM.epic * 17);
  });

  it("lets the traits, the memory and the places worn change the night", () => {
    const state = createInitialState(T0);
    state.maxStageEver = 400;
    state.heroLevels = { maelle: 50, brom: 50 };
    const bare = derive(state, T0);
    const blade = relic("weapon", "mythic", { traits: ["vanguard", "rout"], memory: "brom", level: 1 });
    state.equipment = { weapon: blade };
    const armed = derive(state, T0);
    // The company strikes harder, Brom most of all.
    expect(armed.heroDps.maelle / bare.heroDps.maelle).toBeCloseTo(traitValue("vanguard", "mythic") * (1 + affixValue(blade, "dps")));
    expect(armed.heroDps.brom / bare.heroDps.brom).toBeCloseTo(traitValue("vanguard", "mythic") * (1 + affixValue(blade, "dps")) * MEMORY_MULT.mythic);
    expect(routSeconds(state)).toBe(traitValue("rout", "mythic"));
    expect(relicCompanyGain(state, blade, T0)).toBeCloseTo(armed.dps / bare.dps);
    // Armor that remembers scars keeps a deep guardian's wounds, never the King's.
    state.equipment.armor = relic("armor", "legendary", { traits: ["scars"], level: 1 });
    expect(woundCapAt(state, 330)).toBe(traitValue("scars", "legendary"));
    expect(woundCapAt(state, 350)).toBe(0);
    expect(woundCapAt(state, 30)).toBe(0.75);
    // Rings and amulets: storms, vigil.
    state.equipment.amulet = relic("amulet", "epic", { traits: ["storm"], level: 1 });
    state.equipment.ring = relic("ring", "legendary", { traits: ["vigil"], level: 1 });
    expect(stormChance(state)).toBeCloseTo(traitValue("storm", "epic"));
    expect(offlineCapSeconds(state)).toBe((8 + traitValue("vigil", "legendary")) * 3600);
    // Four relics of the Keep (stages 41 to 50 of a loop): the King feels it.
    const kingBefore = derive(state, T0).kingDamage;
    for (const item of Object.values(state.equipment)) item!.level = 345;
    expect(derive(state, T0).kingDamage / kingBefore).toBeCloseTo(PLACE_BONUS.keep[1]);
  });
});

describe("the road's spoils", () => {
  it("owes an epic or better after a drought of relics, and forgets the debt once paid", () => {
    const { engine } = honestGame(11, 10);
    const s = engine.state;
    const roadRelic = (engine as unknown as { roadRelic(rng: () => number, level: number, luck: number): Item }).roadRelic.bind(engine);
    s.drought = 0;
    let seed = 0;
    // Plain relics deepen the drought, one by one.
    while (s.drought < DROUGHT_DROPS) {
      const before = s.drought;
      const item = roadRelic(seededRng(seed++), 20, 1);
      expect(s.drought).toBe(RARITIES.indexOf(item.rarity) >= 2 ? 0 : before + 1);
    }
    const owed = roadRelic(seededRng(seed), 20, 1);
    expect(RARITIES.indexOf(owed.rarity)).toBeGreaterThanOrEqual(2);
    expect(s.drought).toBe(0);
  });

  it("salvages the lesser relics as they arrive when the walker asks, never into an empty slot", () => {
    const { engine, now } = honestGame(12, 20);
    const s = engine.state;
    engine.perform({ type: "settings", patch: { salvageOnArrival: "rare" } }, now);
    expect(s.settings.salvageOnArrival).toBe("rare");
    const shards = s.shards;
    const found = s.lifetime.itemsFound;
    const pack = s.inventory.length;
    for (let index = 0; index < 30; index += 1) {
      s.stage = s.maxStage;
      s.monster = null;
      (engine as unknown as { dropOnRoad(item: Item): void }).dropOnRoad(generateItem(seededRng(100 + index), s.maxStage, { rarity: index % 2 ? "common" : "rare" }));
    }
    expect(s.lifetime.itemsFound).toBe(found + 30);
    expect(s.inventory.length).toBe(pack);
    expect(s.shards).toBeGreaterThan(shards);
  });

  it("keeps what the guardians left while the walker was away in the satchel, to be opened", () => {
    const { engine, now } = honestGame(13, 40);
    const s = engine.state;
    const previous = structuredClone(s);
    const found = s.lifetime.itemsFound;
    expect(s.satchel).toEqual([]);
    const summary = engine.catchUp(8 * 3600, now + 8 * 3600_000);
    const later = now + 8 * 3600_000;
    expect(summary.stages).toBeGreaterThan(0);
    expect(s.lifetime.itemsFound).toBeGreaterThan(found);
    expect(s.satchel.length).toBeGreaterThan(0);
    expect(s.satchel.length).toBeLessThanOrEqual(SATCHEL_SIZE);
    expect(verifyState(structuredClone(s), later)).toEqual([]);
    expect(verifyTransition(previous, structuredClone(s), 8 * 3600_000)).toEqual([]);
    // Opened: each relic goes to its slot or the pack, the rarest last.
    const kept = s.satchel.length;
    const opened = engine.openSatchel(later);
    expect(opened.length).toBe(kept);
    expect(s.satchel).toEqual([]);
    const order = opened.map((item) => RARITIES.indexOf(item.rarity));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(verifyState(structuredClone(s), later)).toEqual([]);
  });

  it("keeps the rarest when the satchel is full, and the shards of the rest", () => {
    const { engine } = honestGame(14, 5);
    const s = engine.state;
    const stash = (engine as unknown as { stash(item: Item): void }).stash.bind(engine);
    const shards = s.shards;
    for (let index = 0; index < SATCHEL_SIZE; index += 1) stash(generateItem(seededRng(index), 10, { rarity: "rare" }));
    stash(generateItem(seededRng(50), 10, { rarity: "legendary" }));
    stash(generateItem(seededRng(51), 10, { rarity: "common" }));
    expect(s.satchel).toHaveLength(SATCHEL_SIZE);
    expect(s.satchel[0].rarity).toBe("legendary");
    expect(s.satchel.filter((item) => item.rarity === "common")).toEqual([]);
    expect(s.shards).toBe(shards + 3 + 1);
  });

  it("never salvages on arrival a relic whose slot is empty, and gives back what a smaller satchel cannot hold", () => {
    const { engine } = honestGame(19, 5);
    const s = engine.state;
    const stash = (engine as unknown as { stash(item: Item): void }).stash.bind(engine);
    s.settings.salvageOnArrival = "rare";
    delete s.equipment.ring;
    stash(generateItem(seededRng(60), 10, { slot: "ring", rarity: "rare" }));
    expect(s.satchel).toHaveLength(1);
    s.equipment.ring = generateItem(seededRng(61), 10, { slot: "ring", rarity: "common" });
    stash(generateItem(seededRng(62), 10, { slot: "ring", rarity: "rare" }));
    expect(s.satchel).toHaveLength(1);
    // Ten held while a ring of Deep Satchel was worn; taken off, the next arrival leaves six.
    s.satchel = Array.from({ length: 9 }, (_, index) => generateItem(seededRng(70 + index), 10, { slot: "weapon", rarity: "epic" }));
    stash(generateItem(seededRng(80), 10, { slot: "weapon", rarity: "epic" }));
    expect(s.satchel).toHaveLength(SATCHEL_SIZE);
  });

  it("raises a guardian's chance with armor that remembers spoils", () => {
    const state = createInitialState(T0);
    expect(relicChance(state, true)).toBe(0.4);
    expect(relicChance(state, false)).toBe(0.15);
    state.equipment.armor = relic("armor", "mythic", { traits: ["spoils", "bulwark"], level: 1 });
    expect(relicChance(state, true)).toBeCloseTo(0.4 + traitValue("spoils", "mythic"));
    expect(relicChance(state, false)).toBeCloseTo(0.15 + traitValue("spoils", "mythic") / 2);
  });
});

describe("Awakening", () => {
  it("brings a relic down to the walker's deepest night for shards, and the Ledger accepts it", () => {
    const { engine, now } = honestGame(15, 60);
    const s = engine.state;
    const previous = structuredClone(s);
    s.maxStageEver = Math.max(s.maxStageEver, 160);
    const item = generateItem(seededRng(3), 12, { slot: "weapon", rarity: "epic", bestHired: s.lifetime.bestHired });
    s.inventory.push(item);
    s.lifetime.itemsFound += 1;
    s.shards = 0;
    expect(engine.awaken(item.uid, now)).toBe(false);
    s.shards = awakenPrice(s, item);
    s.lifetime.shardsEarned += s.shards;
    expect(engine.awaken(item.uid, now)).toBe(true);
    expect(s.shards).toBe(0);
    expect(item.depth).toBe(112);
    expect(relicDepth(item)).toBe(112);
    // Nothing deeper to reach: refused, and nothing paid.
    expect(engine.awaken(item.uid, now)).toBe(false);
    expect(codes(verifyState(structuredClone(s), now))).not.toContain("item");
    expect(codes(verifyTransition(previous, structuredClone(s), 60_000))).not.toContain("item");
  });
});

describe("the Ledger and remembered relics", () => {
  function honest(): { state: GameState; now: number } {
    const { engine, now } = honestGame(16, 30);
    const state = structuredClone(engine.state);
    state.inventory.push(generateItem(seededRng(9), state.maxStageEver, { slot: "ring", rarity: "legendary", bestHired: state.lifetime.bestHired }));
    state.lifetime.itemsFound += 1;
    state.lifetime.legendaries += 1;
    expect(verifyState(state, now)).toEqual([]);
    return { state, now };
  }
  const ring = (state: GameState) => state.inventory[state.inventory.length - 1];

  it("refuses traits a relic cannot hold", () => {
    const { state, now } = honest();
    ring(state).traits = ["vanguard"];
    expect(codes(verifyState(state, now))).toContain("item");
    ring(state).traits = ["fortune", "star"];
    expect(codes(verifyState(state, now))).toContain("item");
    ring(state).traits = ["nonsense"];
    expect(codes(verifyState(state, now))).toContain("item");
  });

  it("refuses a memory of a companion never met, or on a relic too blurred to hold one", () => {
    const { state, now } = honest();
    const last = Object.keys(HERO_BY_ID).at(-1)!;
    ring(state).memory = last;
    expect(codes(verifyState(state, now))).toContain("item");
    const plain = generateItem(seededRng(4), 5, { slot: "armor", rarity: "epic" });
    state.inventory.push({ ...plain, memory: "maelle" });
    expect(codes(verifyState(state, now))).toContain("item");
  });

  it("refuses a relic awakened deeper than the walker went, or out of its place, or never paid", () => {
    const { state, now } = honest();
    const item = ring(state);
    state.maxStageEver = Math.max(state.maxStageEver, item.level + 100);
    item.depth = item.level + 150;
    expect(codes(verifyState(state, now))).toContain("item");
    item.depth = item.level + 25;
    expect(codes(verifyState(state, now))).toContain("item");
    item.depth = item.level + 100;
    state.shards = state.lifetime.shardsEarned;
    expect(codes(verifyState(state, now))).toContain("forge");
  });

  it("refuses a satchel fuller than any ring allows, and a relic remade in it", () => {
    const { state, now } = honest();
    const previous = structuredClone(state);
    state.satchel = Array.from({ length: 20 }, (_, index) => generateItem(seededRng(200 + index), 5));
    expect(codes(verifyState(state, now))).toContain("inventory");
    const next = structuredClone(previous);
    ring(next).traits = [next.equipment.ring?.traits?.[0] === "star" ? "fortune" : "star"];
    if (ring(next).traits!.join() !== ring(previous).traits?.join()) expect(codes(verifyTransition(previous, next, 60_000))).toContain("item");
  });
});

describe("save version 17", () => {
  it("lets the relics of a version 16 save remember, the same on every device, then verifies and plays", () => {
    const { engine, now } = honestGame(17, 60);
    const legacy = structuredClone(engine.state) as unknown as Record<string, unknown>;
    legacy.version = 16;
    delete legacy.satchel;
    delete legacy.drought;
    delete (legacy.settings as Record<string, unknown>).salvageOnArrival;
    const strip = (item: Item | undefined) => {
      if (!item) return;
      delete item.traits;
      delete item.memory;
      delete item.depth;
    };
    for (const item of Object.values(legacy.equipment as Record<string, Item>)) strip(item);
    for (const item of legacy.inventory as Item[]) strip(item);
    const text = JSON.stringify(legacy);
    const migrated = parseState(JSON.parse(text));
    const again = parseState(JSON.parse(text));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated).toEqual(again);
    expect(migrated.satchel).toEqual([]);
    expect(migrated.settings.salvageOnArrival).toBe("none");
    for (const item of [...Object.values(migrated.equipment), ...migrated.inventory]) {
      expect(item!.traits?.length ?? 0).toBe(TRAIT_COUNT[item!.rarity]);
    }
    expect(verifyState(migrated, now)).toEqual([]);
    expect(verifyTransition(parseState(JSON.parse(text)), migrated, 1000)).toEqual([]);
    const resumed = new GameEngine(migrated, seededRng(18), now);
    const later = playBot(resumed, now, 10 * 60, { clicksPerSecond: 5 });
    expect(verifyState(resumed.state, later)).toEqual([]);
  }, 60_000);
});
