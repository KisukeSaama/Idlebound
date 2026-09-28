import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { GameEngine } from "./engine";
import { relicDensity } from "./data/items";
import { crystalEssenceReward } from "./formulas";
import { generateItem } from "./loot";
import { seededRng } from "./rng";
import { parseState } from "./save";
import { SAVE_VERSION, createInitialState } from "./state";
import type { GameState } from "./types";
import { verifyNewLineage, verifySaveVersion, verifyState, verifyTransition } from "./validation";

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
