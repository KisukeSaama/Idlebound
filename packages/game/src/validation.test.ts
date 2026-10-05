import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { GameEngine } from "./engine";
import { ALTAR_BY_ID, altarTotalCost, legacyHarvestCost, legacyHarvestPrice } from "./data/altars";
import { relicDensity } from "./data/items";
import { WAGER_MAX_GOLD, crystalEssenceReward, derive, essencesForStage, stageGold } from "./formulas";
import { generateItem } from "./loot";
import { seededRng } from "./rng";
import { parseState } from "./save";
import { HARVEST_NOTICE, SAVE_VERSION, createInitialState } from "./state";
import type { GameState } from "./types";
import { isoWeek } from "./data/caravan";
import { RECORD_GAP, verifyFirstSight, verifyNewLineage, verifyPace, verifySaveVersion, verifyState, verifyTransition, type Pace } from "./validation";

const T0 = Date.UTC(2026, 2, 1);
const LATER = T0 + 900 * 3600_000;

const codes = (violations: { code: string }[]) => violations.map((violation) => violation.code);

/** A walker of 150 nights: the history kept only the last hundred. */
function veteran(): GameState {
  const state = createInitialState(T0);
  state.lastTickAt = LATER;
  state.lifetime.playTime = 800 * 3600;
  state.lifetime.offlineSeconds = 50 * 3600;
  state.lifetime.kills = 5_000_000;
  state.lifetime.bosses = 200_000;
  state.lifetime.kings = 5_000;
  state.lifetime.ascensions = 150;
  state.lifetime.crystals = 2_000;
  state.lifetime.bestHired = 21;
  state.maxStageEver = 1_200;
  state.ascensions = Array.from({ length: 100 }, (_, index) => ({ at: T0 + index * 3600_000, maxStage: 1_000, essences: 1e6 }));
  state.lifetime.ascensionEssences = 1e9;
  state.lifetime.essencesEarned = 1e9 + state.lifetime.crystals * crystalEssenceReward(state.maxStageEver);
  state.essences = 1e9;
  state.lifetime.shardsEarned = 5_000;
  state.shards = 5_000;
  return state;
}

/** Ticks an engine for `seconds`, ten times a second; returns the time reached. */
function run(engine: GameEngine, from: number, seconds: number): number {
  let now = from;
  for (let step = 0; step < seconds * 10; step += 1) {
    now += 100;
    engine.tick(now);
  }
  return now;
}

/** Half an hour of honest play, from a fresh game. */
function honestGame(seed: number) {
  const engine = new GameEngine(createInitialState(T0), seededRng(seed), T0);
  const now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
  return { engine, now };
}

describe("essences past the ascension history", () => {
  it("accepts a veteran whose history kept only its last hundred ascensions", () => {
    expect(verifyState(veteran(), LATER)).toEqual([]);
  });

  it("rejects essences forged beyond the history, whatever the ascension count claims", () => {
    const forged = veteran();
    forged.lifetime.essencesEarned += 1e12;
    forged.essences += 1e12;
    expect(codes(verifyState(forged, LATER))).toContain("essence-source");

    // One more ascension than the history holds used to skip the check.
    const young = veteran();
    young.lifetime.ascensions = 101;
    young.lifetime.essencesEarned += 1e12;
    young.essences += 1e12;
    expect(codes(verifyState(young, LATER))).toContain("essence-source");

    // The ledger of all ascensions is itself bounded by what the deepest stage pays.
    const ledger = veteran();
    ledger.lifetime.ascensionEssences = 1e40;
    ledger.lifetime.essencesEarned = 1e40;
    expect(codes(verifyState(ledger, LATER))).toContain("essence-source");
  });

  it("bounds the essences gathered between two saves by the ascensions and crystals between them", () => {
    const previous = veteran();
    const honest = structuredClone(previous);
    honest.lifetime.ascensions += 1;
    honest.lifetime.ascensionEssences += 1e6;
    honest.lifetime.essencesEarned += 1e6;
    expect(verifyTransition(previous, honest, 60_000)).toEqual([]);

    const noAscension = structuredClone(previous);
    noAscension.lifetime.essencesEarned += 1e6;
    noAscension.lifetime.ascensionEssences += 1e6;
    expect(codes(verifyTransition(previous, noAscension, 60_000))).toContain("essence-source");

    const generous = structuredClone(previous);
    generous.lifetime.ascensions += 1;
    generous.lifetime.ascensionEssences += 1e40;
    generous.lifetime.essencesEarned += 1e40;
    expect(codes(verifyTransition(previous, generous, 60_000))).toContain("essence-source");
  });
});

describe("crystals, hourglasses and shards", () => {
  it("rejects more crystals than the game's age allows", () => {
    const { engine, now } = honestGame(5);
    expect(verifyState(engine.state, now)).toEqual([]);
    const forged = structuredClone(engine.state);
    forged.lifetime.crystals = 100_000;
    expect(codes(verifyState(forged, now))).toContain("crystals");

    const next = structuredClone(engine.state);
    next.lifetime.crystals += 500;
    next.run.crystals += 500;
    expect(codes(verifyTransition(engine.state, next, 30_000))).toContain("crystals");
  });

  it("rejects hourglasses the shards earned could never have bought", () => {
    const forged = veteran();
    forged.lifetime.hourglasses = 1_000;
    expect(codes(verifyState(forged, LATER))).toContain("hourglasses");

    const previous = veteran();
    const next = structuredClone(previous);
    next.lifetime.hourglasses += 500;
    next.lifetime.kills += 500 * 3600 * 3;
    expect(codes(verifyTransition(previous, next, 60_000))).toContain("hourglasses");
  });

  it("bounds Pip's Wagers by the golden rats caught", () => {
    const previous = veteran();
    const kill = stageGold(previous.maxStageEver) * derive(previous, previous.lastTickAt, { ignoreTimed: true }).goldMultiplier;
    // Beyond what two kills can pay at best (a boss, every boon), a won wager at its best:
    // accepted when one of the kills was a golden rat, refused otherwise.
    const kills = 2 * 10 * 6 * kill;
    const honest = structuredClone(previous);
    honest.lifetime.kills += 1;
    honest.lifetime.treasures += 1;
    honest.lifetime.goldEarned += kills + kill * WAGER_MAX_GOLD * 6 * 0.99;
    expect(codes(verifyTransition(previous, honest, 1_000))).not.toContain("gold");
    const plain = structuredClone(previous);
    plain.lifetime.kills += 1;
    plain.lifetime.goldEarned += kills + kill * WAGER_MAX_GOLD * 0.1;
    expect(codes(verifyTransition(previous, plain, 1_000))).toContain("gold");
    // More golden rats than kills: refused.
    const rats = veteran();
    rats.lifetime.treasures = rats.lifetime.kills + 1;
    expect(codes(verifyState(rats, LATER))).toContain("kills");
  });

  it("rejects shards no guardian, crystal or salvage could have paid", () => {
    const { engine, now } = honestGame(6);
    const forged = structuredClone(engine.state);
    forged.lifetime.shardsEarned += 1e9;
    forged.shards += 1e9;
    expect(codes(verifyState(forged, now))).toContain("shards-earned");

    const next = structuredClone(engine.state);
    next.lifetime.shardsEarned += 100_000;
    next.shards += 100_000;
    expect(codes(verifyTransition(engine.state, next, 30_000))).toContain("shards-earned");
  });

  it("accepts a save right after an hourglass poured an hour of kills", () => {
    // A lucky walker: every crystal after the first half hour holds six shards.
    const base = seededRng(7);
    const forced: number[] = [];
    const engine = new GameEngine(createInitialState(T0), () => (forced.length > 0 ? forced.shift()! : base()), T0);
    let now = playBot(engine, T0, 30 * 60, { clicksPerSecond: 5 });
    for (let step = 0; step < 90 * 60 * 10 && engine.state.shards < 60; step += 1) {
      now += 100;
      if (step % 2 === 0) engine.click(now);
      if (engine.state.crystal) {
        forced.push(0.9, 0.99);
        engine.clickCrystal(now);
        forced.length = 0;
      }
      engine.tick(now);
    }
    expect(engine.state.shards).toBeGreaterThanOrEqual(60);
    const previous = structuredClone(engine.state);
    const killsBefore = engine.state.lifetime.kills;
    expect(engine.buyOffer("hourglass", now)).toBe(true);
    // More kills than a second of play could hold: the hour poured must be counted.
    expect(engine.state.lifetime.kills - killsBefore).toBeGreaterThan(100);
    now += 1_000;
    engine.tick(now);
    const snapshot = structuredClone(engine.state);
    expect(verifyState(snapshot, now)).toEqual([]);
    expect(verifyTransition(previous, snapshot, 1_000)).toEqual([]);
  }, 60_000);
});

describe("a game closed and opened again", () => {
  it("accepts the night a closed game catches up when it opens, eight hours later", () => {
    const { engine, now } = honestGame(4);
    const saved = parseState(JSON.parse(JSON.stringify(engine.state)));
    // The tab is closed for eight hours; opened again, the save loads and catches up.
    const reopened = now + 8 * 3600_000;
    const next = new GameEngine(parseState(JSON.parse(JSON.stringify(saved))), seededRng(5), reopened);
    const summary = next.tick(reopened);
    expect(summary?.seconds).toBe(8 * 3600);
    const after = run(next, reopened, 60);
    expect(verifyState(next.state, after)).toEqual([]);
    expect(verifyTransition(saved, next.state, after - now)).toEqual([]);
  });

  it("refuses a closed game that claims more time away than the server saw pass", () => {
    const { engine, now } = honestGame(4);
    const saved = parseState(JSON.parse(JSON.stringify(engine.state)));
    // Eight hours caught up, but the server saw one hour pass since the save.
    const next = new GameEngine(parseState(JSON.parse(JSON.stringify(saved))), seededRng(5), now + 8 * 3600_000);
    next.tick(now + 8 * 3600_000);
    expect(codes(verifyTransition(saved, next.state, 3600_000))).toContain("time");
  });
});

describe("relic density", () => {
  it("refuses a relic from a stratum deeper than the walker ever went", () => {
    const { engine, now } = honestGame(6);
    const honest = structuredClone(engine.state);
    honest.equipment.weapon = generateItem(seededRng(2), honest.maxStageEver, { slot: "weapon" });
    honest.lifetime.itemsFound += 1;
    expect(verifyState(honest, now)).toEqual([]);
    // The same relic claimed from the last stratum would multiply damage by its density.
    const forged = structuredClone(honest);
    forged.equipment.weapon = { ...honest.equipment.weapon!, level: 3000 };
    expect(relicDensity(forged.equipment.weapon)).toBeGreaterThan(relicDensity(honest.equipment.weapon!) * 5);
    expect(codes(verifyState(forged, now))).toContain("item");
  });
});

describe("save versions and lineages", () => {
  it("refuses a save relabelled with an older version, so the version 4 refund never runs twice", () => {
    const { engine } = honestGame(8);
    const stored = structuredClone(engine.state);
    const relabelled = { ...structuredClone(stored), version: 3, altars: { fate: 3 } };
    // Parsed on its own, the older label would give the altar levels back as essences.
    expect(parseState(JSON.parse(JSON.stringify(relabelled))).essences).toBeGreaterThan(stored.essences);
    expect(codes(verifySaveVersion(stored, relabelled))).toEqual(["version"]);
    expect(verifySaveVersion(stored, stored)).toEqual([]);
    // A stored save written before version 4 may still be sent at its own version.
    expect(verifySaveVersion({ version: 3 }, { version: 3 })).toEqual([]);
  });

  it("refuses another game claiming more time than the account's game had lived", () => {
    const { engine } = honestGame(9);
    const previous = structuredClone(engine.state);
    const other = createInitialState(T0 - 90 * 86_400_000);
    other.lifetime.offlineSeconds = 60 * 86_400;
    expect(codes(verifyNewLineage(previous, other, 60_000))).toEqual(["lineage-time"]);
    const fresh = createInitialState(T0);
    fresh.lifetime.playTime = previous.lifetime.playTime;
    expect(verifyNewLineage(previous, fresh, 60_000)).toEqual([]);
    // Time the server saw pass counts.
    expect(verifyNewLineage(previous, other, 61 * 86_400_000)).toEqual([]);
  });
});

describe("the engine's generator", () => {
  it("lives in the save: a reload draws the same fates, and the next draws move on", () => {
    const state = createInitialState(T0);
    const first = new GameEngine(structuredClone(state), undefined, T0);
    const again = new GameEngine(structuredClone(state), undefined, T0);
    const draws = [first.rng(), first.rng(), first.rng()];
    expect([again.rng(), again.rng(), again.rng()]).toEqual(draws);
    expect(first.state.rngState).not.toBe(state.rngState);
    const reloaded = new GameEngine(structuredClone(first.state), undefined, T0);
    expect(reloaded.rng()).toBe(first.rng());
  });
});

describe("save version 9", () => {
  it("loads a version 8 save, verifies it and plays on", () => {
    const { engine, now } = honestGame(10);
    const legacy = JSON.parse(JSON.stringify(engine.state)) as Record<string, unknown>;
    legacy.version = 8;
    delete legacy.rngState;
    delete (legacy.lifetime as Record<string, unknown>).ascensionEssences;
    const migrated = parseState(legacy);
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(typeof migrated.rngState).toBe("number");
    expect(verifyState(migrated, now)).toEqual([]);
    const next = new GameEngine(migrated, undefined, now);
    const later = playBot(next, now, 5 * 60, { clicksPerSecond: 5 });
    expect(verifyState(next.state, later)).toEqual([]);
    expect(verifyTransition(parseState(legacy), next.state, later - now)).toEqual([]);
  }, 60_000);

  it("gives a version 8 veteran the ascension essences its data proves", () => {
    const legacy = JSON.parse(JSON.stringify(veteran())) as Record<string, unknown>;
    legacy.version = 8;
    delete (legacy.lifetime as Record<string, unknown>).ascensionEssences;
    const migrated = parseState(legacy);
    // Its crystals explain a few essences; its ascensions, the rest.
    expect(migrated.lifetime.ascensionEssences).toBe(1e9);
    expect(verifyState(migrated, LATER)).toEqual([]);
  });
});

describe("the Altar of the Harvest, capped and dearer at save version 11", () => {
  const cap = ALTAR_BY_ID.harvest.maxLevel;
  const capped = (1 + cap * ALTAR_BY_ID.harvest.valuePerLevel) * 2;

  /** A veteran of version 10 who raised the uncapped Harvest to level 40. */
  function harvester(): GameState {
    const state = veteran();
    state.version = 10;
    state.altars = { harvest: 40, might: 5 };
    // Its last nights were multiplied by that Harvest (×5), more than the cap allows today.
    state.ascensions = state.ascensions.map((record) => ({ ...record, maxStage: 140, essences: 100_000 }));
    state.essences = state.lifetime.essencesEarned - Math.ceil(legacyHarvestCost(40) + altarTotalCost("might", 5)) - 1_000;
    return state;
  }

  it("gives an older save every level back as essences, once, and the Ledger accepts it", () => {
    const legacy = harvester();
    expect(legacy.ascensions[0].essences).toBeGreaterThan(essencesForStage(139) * capped);
    let paid = 0;
    for (let level = 0; level < 40; level += 1) paid += legacyHarvestPrice(level);
    const migrated = parseState(JSON.parse(JSON.stringify(legacy)));
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.altars).toEqual({ might: 5 });
    expect(migrated.essences).toBe(legacy.essences + paid);
    expect(migrated.legacyHarvest).toBeGreaterThanOrEqual(40);
    expect(migrated.tutorial.done).toContain(HARVEST_NOTICE);
    expect(verifyState(migrated, LATER)).toEqual([]);
    // Loaded again, nothing more comes back; the walker raises it again at today's price, up to the cap, plays on and saves.
    const again = parseState(JSON.parse(JSON.stringify(migrated)));
    expect(again.essences).toBe(migrated.essences);
    const engine = new GameEngine(structuredClone(again), seededRng(5), LATER);
    for (let level = 0; level < cap; level += 1) expect(engine.buyAltar("harvest", LATER)).toBe(true);
    expect(engine.buyAltar("harvest", LATER)).toBe(false);
    expect(again.essences - engine.state.essences).toBeGreaterThanOrEqual(altarTotalCost("harvest", cap));
    const now = run(engine, LATER, 60);
    expect(verifyState(engine.state, now)).toEqual([]);
    expect(verifyTransition(again, engine.state, now - LATER)).toEqual([]);
  });

  it("refunds a few levels too, and tells nothing to a save that never raised it", () => {
    const modest = veteran();
    modest.version = 10;
    modest.altars = { harvest: 3 };
    modest.essences -= 5 + 7 + 9;
    const migrated = parseState(JSON.parse(JSON.stringify(modest)));
    expect(migrated.altars).toEqual({});
    expect(migrated.essences).toBe(modest.essences + 5 + 7 + 9);
    expect(migrated.tutorial.done).toContain(HARVEST_NOTICE);
    expect(verifyState(migrated, LATER)).toEqual([]);
    const never = veteran();
    never.version = 10;
    expect(parseState(JSON.parse(JSON.stringify(never))).tutorial.done).not.toContain(HARVEST_NOTICE);
    expect(createInitialState(T0).tutorial.done).not.toContain(HARVEST_NOTICE);
  });

  it("rejects a Harvest above its cap, a forged Harvest of old, and a night richer than the cap pays", () => {
    const above = veteran();
    above.altars = { harvest: cap + 1 };
    above.essences -= Math.ceil(altarTotalCost("harvest", cap + 1)) + 1;
    expect(codes(verifyState(above, LATER))).toContain("altar");

    // A Harvest of old higher than every essence gathered could have raised.
    const forged = veteran();
    forged.legacyHarvest = 500;
    expect(codes(verifyState(forged, LATER))).toContain("altar");

    // Without it, a night of the history cannot hold what only the uncapped Harvest paid.
    const rich = veteran();
    rich.ascensions = rich.ascensions.map((record) => ({ ...record, maxStage: 140, essences: 100_000 }));
    expect(codes(verifyState(rich, LATER))).toContain("ascension");

    // Between two saves, an older walker's new nights are paid under the cap, and the mark stays.
    const previous = parseState(JSON.parse(JSON.stringify(harvester())));
    const night = maxStageEssences(previous) * capped;
    const honest = structuredClone(previous);
    honest.lifetime.ascensions += 1;
    honest.lifetime.ascensionEssences += night;
    honest.lifetime.essencesEarned += night;
    expect(verifyTransition(previous, honest, 60_000)).toEqual([]);
    const generous = structuredClone(previous);
    generous.lifetime.ascensions += 1;
    generous.lifetime.ascensionEssences += night * 2;
    generous.lifetime.essencesEarned += night * 2;
    expect(codes(verifyTransition(previous, generous, 60_000))).toContain("essence-source");
    const remarked = structuredClone(previous);
    remarked.legacyHarvest = (previous.legacyHarvest ?? 0) + 1;
    expect(codes(verifyTransition(previous, remarked, 60_000))).toContain("altar");
  });
});

/** Essences the deepest stage of a walker pays, before any multiplier. */
function maxStageEssences(state: GameState): number {
  return essencesForStage(state.maxStageEver - 1);
}

describe("the Sanctum wakes in three times", () => {
  it("rejects an altar first raised before its night, and accepts one raised before the rule", () => {
    const previous = veteran();
    previous.lifetime.ascensions = 1;
    previous.ascensions = previous.ascensions.slice(0, 1);
    previous.altars = { time: 2 };
    previous.essences -= 100;
    // The Altar of Time answers from the third night: raised on the second, it is refused.
    const early = structuredClone(previous);
    early.altars = { time: 2, harvest: 1 };
    early.essences -= 5;
    expect(codes(verifyTransition(previous, early, 60_000))).toContain("altar");
    // A stone raised before the rule stays open, and an open one may be raised.
    const honest = structuredClone(previous);
    honest.altars = { time: 3, might: 1 };
    honest.essences -= 6;
    expect(verifyTransition(previous, honest, 60_000)).toEqual([]);
    // On its night, the stone answers.
    const later = structuredClone(previous);
    later.lifetime.ascensions = ALTAR_BY_ID.harvest.night - 1;
    later.altars = { time: 2, harvest: 1 };
    later.essences -= 5;
    expect(codes(verifyTransition(previous, later, 3_600_000))).not.toContain("altar");
  });
});

/**
 * An honest game played for `seconds`, saved as the page saves it: at each new stage and each
 * dusk, at most once every `every` seconds. Checked as the server checks it, with the
 * network's jitter on the time the server measures between two saves.
 */
function savedEvery(seed: number, seconds: number, every: number) {
  const engine = new GameEngine(createInitialState(T0), seededRng(seed), T0);
  const jitter = seededRng(seed + 1);
  let previous: GameState | undefined;
  let previousAt = T0;
  let pace: Pace | undefined;
  const violations: string[] = [];
  const save = (_: GameEngine, now: number) => {
    if (previous && now - previousAt < every * 1000) return;
    const state = structuredClone(engine.state);
    // The request leaves a little late or early: the server's clock sees it so.
    const arrived = now + Math.round((jitter() - 0.5) * 4_000);
    violations.push(...codes(verifyState(state, arrived)), ...codes(previous ? verifyTransition(previous, state, arrived - previousAt) : verifyFirstSight(state)));
    const paced = verifyPace(previous, state, pace, arrived, arrived - previousAt);
    violations.push(...codes(paced.violations));
    pace = paced.pace;
    previous = state;
    previousAt = arrived;
  };
  const now = playBot(engine, T0, seconds, { clicksPerSecond: 5, stagnationMs: 10 * 60_000, onMilestone: save, onAscend: save });
  save(engine, now + every * 1000);
  return { engine, now, previous: previous!, previousAt, pace: pace!, violations };
}

describe("the server's own ledger of a game", () => {
  it("accepts six hours of honest play saved every thirty seconds, through the network's jitter", () => {
    const { engine, violations, pace } = savedEvery(7, 6 * 3600, 30);
    expect(violations).toEqual([]);
    expect(engine.state.lifetime.ascensions).toBeGreaterThan(0);
    expect(engine.state.lifetime.skillsUsed).toBeGreaterThan(0);
    expect(pace.proven).toBe(engine.state.maxStageEver);
  }, 120_000);

  it("refuses a record set outside any night the server saw, and lets the road walked unseen before a dusk", () => {
    const { previous, previousAt, pace } = savedEvery(8, 30 * 60, 30);
    const now = previousAt + 60_000;
    const dusk = (record: number) => {
      const next = structuredClone(previous);
      next.lastTickAt = now;
      next.lifetime.playTime += 60;
      next.lifetime.ascensions += 1;
      next.maxStage = next.stage = next.runStartStage = 1;
      next.maxStageEver = record;
      return codes(verifyPace(previous, next, pace, now, 60_000).violations);
    };
    expect(dusk(pace.proven + RECORD_GAP)).not.toContain("record");
    expect(dusk(pace.proven + RECORD_GAP + 1)).toContain("record");
    // A game never seen claims no record beyond its own night.
    const forged = structuredClone(previous);
    forged.maxStageEver = forged.maxStage + 2_000;
    expect(codes(verifyPace(undefined, forged, undefined, now, 0).violations)).toContain("record");
  }, 60_000);

  it("refuses powers made ready again by reopening the game", () => {
    let { previous, previousAt, pace } = savedEvery(9, 20 * 60, 30);
    const found: string[] = [];
    // Each reopening brings every power back: used again every fifteen seconds.
    for (let save = 0; save < 6; save += 1) {
      const next = structuredClone(previous);
      next.lifetime.playTime += 15;
      next.run.playTime += 15;
      next.lifetime.skillsUsed += 8;
      next.run.skillsUsed += 8;
      const at = previousAt + 15_000;
      const paced = verifyPace(previous, next, pace, at, 15_000);
      found.push(...codes(paced.violations));
      ({ pace } = paced);
      previous = next;
      previousAt = at;
    }
    expect(found).toContain("powers");
  }, 60_000);

  it("accepts two hours of powers used as they come back, with no save in between", () => {
    const { engine, now, previous, previousAt, pace } = savedEvery(14, 10 * 60, 30);
    // The network drops for two hours; the open game plays on, then saves.
    const later = playBot(engine, now, 2 * 3600, { clicksPerSecond: 5, stagnationMs: 24 * 3600_000 });
    const next = structuredClone(engine.state);
    expect(next.lifetime.skillsUsed - previous.lifetime.skillsUsed).toBeGreaterThan(30);
    expect(codes(verifyPace(previous, next, pace, later, later - previousAt).violations)).not.toContain("powers");
  }, 60_000);

  it("refuses Rituals piled up beyond what the night allows", () => {
    const { previous, previousAt, pace } = savedEvery(10, 10 * 60, 30);
    const next = structuredClone(previous);
    next.ritualStacks = 40;
    next.run.skillsUsed += 40;
    next.lifetime.skillsUsed += 40;
    expect(codes(verifyPace(previous, next, { ...pace, powers: 1_000 }, previousAt + 15_000, 15_000).violations)).toContain("powers");
  }, 60_000);

  it("refuses play time claimed ahead of the server's clock, save after save", () => {
    let { previous, previousAt, pace } = savedEvery(11, 5 * 60, 30);
    const found: string[] = [];
    for (let save = 0; save < 3; save += 1) {
      // Fifteen seconds pass on the server; the game claims a hundred and fifteen.
      const next = structuredClone(previous);
      next.lifetime.playTime += 115;
      next.run.playTime += 115;
      const at = previousAt + 15_000;
      found.push(...codes(verifyTransition(previous, next, 15_000)));
      const paced = verifyPace(previous, next, pace, at, 15_000);
      found.push(...codes(paced.violations));
      ({ pace } = paced);
      previous = next;
      previousAt = at;
    }
    expect(found).toContain("time");
  }, 60_000);

  it("refuses the Caravan of a past or coming week, and accepts this week's", () => {
    const { previous, previousAt, pace } = savedEvery(12, 5 * 60, 30);
    const now = previousAt + 30_000;
    const caravan = (week: string) => {
      const next = structuredClone(previous);
      next.caravanWeek = week;
      return codes(verifyPace(previous, next, pace, now, 30_000).violations);
    };
    expect(caravan(isoWeek(now))).toEqual([]);
    expect(caravan(isoWeek(now - 14 * 86_400_000))).toContain("caravan");
    expect(caravan(isoWeek(now + 14 * 86_400_000))).toContain("caravan");
    const ahead = structuredClone(previous);
    ahead.caravanWeek = isoWeek(now + 14 * 86_400_000);
    expect(codes(verifyState(ahead, now))).toContain("caravan");
  }, 60_000);

  it("counts an Unweave as a stage walked, and nothing else", () => {
    const { previous } = savedEvery(13, 5 * 60, 30);
    const unwoven = structuredClone(previous);
    unwoven.maxStage += 1;
    unwoven.stage = unwoven.maxStage;
    unwoven.maxStageEver = Math.max(unwoven.maxStageEver, unwoven.maxStage);
    unwoven.kills = 0;
    unwoven.lifetime.skillsUsed += 1;
    unwoven.run.skillsUsed += 1;
    expect(codes(verifyTransition(previous, unwoven, 15_000))).not.toContain("stage");

    // Thirty stages crossed with thirty kills: three hundred were needed.
    const rushed = structuredClone(previous);
    rushed.maxStageEver = previous.maxStageEver + 30;
    rushed.lifetime.kills += 30;
    rushed.run.kills += 30;
    expect(codes(verifyTransition(previous, rushed, 600_000))).toContain("stage");

    const unseen = structuredClone(previous);
    unseen.maxStageEver = 300;
    unseen.lifetime.kills = 400;
    expect(codes(verifyFirstSight(unseen))).toContain("stage");
  }, 60_000);
});

/** Half an hour of honest play, then half a minute more: two saves the server would keep. */
function twoSaves(seed: number) {
  const { engine, now } = honestGame(seed);
  const previous = structuredClone(engine.state);
  const later = playBot(engine, now, 30, { clicksPerSecond: 5 });
  return { previous, next: structuredClone(engine.state), now: later, elapsed: later - now };
}

describe("relics, shards and luck", () => {
  it("accepts half a minute of chests, forge and salvage", () => {
    const { engine, now } = honestGame(21);
    const previous = structuredClone(engine.state);
    engine.buyOffer("chest", now);
    for (const slot of ["weapon", "armor", "amulet", "ring"] as const) engine.forge(slot, now);
    for (const item of [...engine.state.inventory]) engine.salvage(item.uid);
    const later = playBot(engine, now, 30, { clicksPerSecond: 5 });
    expect(verifyState(engine.state, later)).toEqual([]);
    expect(verifyTransition(previous, engine.state, later - now)).toEqual([]);
  });

  it("refuses relics no guardian, Seam or chest gave, and the shards they would salvage for", () => {
    const { previous, next, now, elapsed } = twoSaves(22);
    next.lifetime.itemsFound += 1_000_000;
    next.lifetime.shardsEarned += 100_000;
    next.shards += 100_000;
    expect(codes(verifyState(next, now))).toContain("item");
    expect(codes(verifyTransition(previous, next, elapsed))).toContain("item");
  });

  it("refuses forge levels the shards earned never paid", () => {
    const { next, now } = twoSaves(23);
    const items = [...Object.values(next.equipment), ...next.inventory].filter((item) => item !== undefined);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) item.forge = 20;
    expect(codes(verifyState(next, now))).toContain("forge");
  });

  it("refuses a relic remade after it dropped, and a relic held that was never found", () => {
    const { previous, next, elapsed } = twoSaves(24);
    const remade = structuredClone(next);
    const item = Object.values(remade.equipment).find((entry) => entry && !entry.named)!;
    item.rarity = "mythic";
    remade.lifetime.mythics += 1;
    expect(codes(verifyTransition(previous, remade, elapsed))).toContain("item");

    const conjured = structuredClone(next);
    conjured.inventory.push({ ...structuredClone(item), uid: "never-found" });
    expect(codes(verifyTransition(previous, conjured, elapsed))).toContain("item");
    expect(verifyTransition(previous, next, elapsed)).toEqual([]);
  });

  it("refuses more legendaries and mythics than relics found or luck allows", () => {
    const { next, now } = twoSaves(25);
    const counted = structuredClone(next);
    counted.lifetime.legendaries = counted.lifetime.itemsFound + 1;
    expect(codes(verifyState(counted, now))).toContain("item");
    // A thousand relics from a thousand guardians: a fifth of them mythic is no luck.
    const lucky = veteran();
    lucky.lifetime.bosses = 1_000;
    lucky.lifetime.kings = 100;
    lucky.lifetime.itemsFound = 1_000;
    expect(codes(verifyState(lucky, LATER))).not.toContain("item");
    lucky.lifetime.mythics = 200;
    expect(codes(verifyState(lucky, LATER))).toContain("item");
  });

  it("pays shards for the guardian blocking the road only, not for one replayed", () => {
    const { previous, next, elapsed } = twoSaves(26);
    // Fifty guardians replayed from the stage selector, each claiming its shards.
    next.lifetime.bosses += 50;
    next.run.bosses += 50;
    next.lifetime.kills += 50;
    next.run.kills += 50;
    next.lifetime.shardsEarned += 50 * 3;
    next.shards += 50 * 3;
    expect(codes(verifyTransition(previous, next, elapsed))).toContain("shards-earned");
  });

  it("bounds golden rats, Seams and Kings by their odds and their guardians", () => {
    const { previous, next, now, elapsed } = twoSaves(27);
    const rats = structuredClone(next);
    rats.lifetime.treasures = Math.ceil(rats.lifetime.kills / 2) + 60;
    expect(codes(verifyState(rats, now))).toContain("kills");
    const seams = structuredClone(next);
    seams.lifetime.seams = Math.ceil(seams.lifetime.kills / 50) + 30;
    expect(codes(verifyState(seams, now))).toContain("lore");
    const kings = structuredClone(next);
    kings.lifetime.kings += next.lifetime.bosses - previous.lifetime.bosses + 1;
    expect(codes(verifyTransition(previous, kings, elapsed))).toContain("kills");
  });

  it("bounds the gold between two saves by the richer company, not a thousand times more", () => {
    const { previous, next, elapsed } = twoSaves(28);
    expect(codes(verifyTransition(previous, next, elapsed))).not.toContain("gold");
    const extra = (next.lifetime.goldEarned - previous.lifetime.goldEarned) * 999;
    next.lifetime.goldEarned += extra;
    next.run.goldEarned += extra;
    next.gold += extra;
    expect(codes(verifyTransition(previous, next, elapsed))).toContain("gold");
  });

  it("lets a night begin past the stages the Ring of the Second Morning skipped, worn at dusk then taken off", () => {
    const walker = veteran();
    walker.runStartStage = 6;
    walker.maxStage = 6;
    walker.stage = 6;
    expect(codes(verifyState(walker, LATER))).toContain("stage-order");
    walker.named = ["second-morning"];
    expect(codes(verifyState(walker, LATER))).not.toContain("stage-order");
  });

  it("accepts a crystal's essences added to a total so large it moves in steps", () => {
    const previous = veteran();
    previous.lifetime.ascensionEssences = 2.5e17;
    previous.lifetime.essencesEarned = 2.5e17;
    // Eighteen essences, past half a step of 32: the total moves by a whole step.
    previous.maxStageEver = 1_700;
    const next = structuredClone(previous);
    next.lifetime.crystals += 1;
    next.lifetime.essencesEarned += crystalEssenceReward(next.maxStageEver);
    expect(next.lifetime.essencesEarned - previous.lifetime.essencesEarned).toBeGreaterThan(crystalEssenceReward(next.maxStageEver) + 1);
    expect(codes(verifyTransition(previous, next, 60_000))).not.toContain("essence-source");
    next.lifetime.essencesEarned += 1e6;
    expect(codes(verifyTransition(previous, next, 60_000))).toContain("essence-source");
  });
});
