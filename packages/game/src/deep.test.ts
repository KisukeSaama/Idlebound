import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { playBot } from "../scripts/bot";
import { DAWN_STAGE, guardianForStage } from "./data/biomes";
import { ageName, stratumTag } from "./content";
import { GameEngine } from "./engine";
import { derive } from "./formulas";
import { seededRng } from "./rng";
import { migrateState, parseState } from "./save";
import { lifeBits, runBits, scaleBits, SCALE_FROM } from "./scale";
import { createInitialState, SAVE_VERSION } from "./state";
import type { GameState } from "./types";
import { verifyPace, verifyState, verifyTransition, type Pace } from "./validation";

const T0 = Date.UTC(2026, 0, 1);
const codes = (violations: { code: string }[]) => violations.map((violation) => violation.code);

/** A save of version 14 kept by the deep road's bot (`scripts/deep.ts`), or by a walk to the Morning. */
function fixture(name: string): { state: GameState; now: number } {
  const kept = JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8")) as { state: GameState; now: number };
  return { state: migrateState(kept.state) as GameState, now: kept.now };
}

/** Plays `hours` in quarter hours, every save checked as the server would. */
function playChecked(engine: GameEngine, from: number, hours: number, until?: (state: GameState) => boolean, fastPurchases = false): number {
  let now = from;
  let previous = structuredClone(engine.state);
  let previousAt = now;
  let pace: Pace | undefined;
  for (let save = 0; save < hours * 4; save += 1) {
    now = playBot(engine, now, 15 * 60, { clicksPerSecond: 5, stagnationMs: 10 * 60_000, descent: { minThreads: 8, growth: 1 }, fastPurchases });
    const snapshot = structuredClone(engine.state);
    expect(verifyState(snapshot, now)).toEqual([]);
    expect(verifyTransition(previous, snapshot, now - previousAt)).toEqual([]);
    const paced = verifyPace(previous, snapshot, pace, now, now - previousAt);
    expect(paced.violations).toEqual([]);
    pace = paced.pace;
    previous = snapshot;
    previousAt = now;
    if (until?.(engine.state)) break;
  }
  return now;
}

describe("the night has no bottom (BIBLE 24)", () => {
  it("reads back every kind of save, of this version and the last ones, and plays on", () => {
    const saves: [string, { state: GameState; now: number }][] = [
      ["a new game", { state: createInitialState(T0), now: T0 }],
      ["a game near stage 1000", fixture("walker-1000")],
      ["a game near stage 2800", fixture("walker-2800")],
      ["a game the King had counted", fixture("after-tally")],
      ["a game after a Morning", fixture("after-morning")]
    ];
    for (const [label, { state, now }] of saves) {
      const parsed = parseState(structuredClone(state));
      expect(parsed.version, label).toBe(SAVE_VERSION);
      expect(verifyState(parsed, now), label).toEqual([]);
      const engine = new GameEngine(parsed, seededRng(3), now);
      playChecked(engine, now, 0.5);
    }
  }, 600_000);

  it("gives a walk the Morning ended back its depth, its essences, its threads and its named relics", () => {
    const kept = JSON.parse(readFileSync(new URL("./fixtures/after-morning.json", import.meta.url), "utf8")) as { state: Record<string, unknown> & { essences: number; threads: number; dawn: { depth: number; legends: string[]; before: { essencesEarned: number; threads: number } } }; now: number };
    const { dawn } = kept.state;
    const state = parseState(structuredClone(kept.state));
    expect(state.maxStageEver).toBe(dawn.depth);
    expect(state.essences).toBe(kept.state.essences + dawn.before.essencesEarned);
    expect(state.threads).toBe(kept.state.threads + dawn.before.threads);
    expect(dawn.legends.length).toBeGreaterThan(0);
    const held = [...state.inventory, ...Object.values(state.equipment)].map((item) => item?.named);
    for (const id of dawn.legends) {
      expect(state.named).toContain(id);
      expect(held).toContain(id);
    }
    expect("dawn" in state).toBe(false);
    // Every device and the server draw the same relics.
    expect(parseState(structuredClone(kept.state))).toEqual(state);
    expect(verifyState(state, kept.now)).toEqual([]);
  });

  it("lets the walker through the Dawn, into the night drawn again", () => {
    // A night a few stages before the Dawn, the walker strong enough to beat it.
    const { state, now } = fixture("walker-2990");
    expect(state.maxStage).toBeLessThan(DAWN_STAGE);
    const engine = new GameEngine(state, seededRng(7), now);
    playChecked(engine, now, 24, (s) => s.maxStage > DAWN_STAGE + 1);
    expect(engine.state.maxStage).toBeGreaterThan(DAWN_STAGE + 1);
    // The Dawn stays a milestone, its keystone found; the Kings come round again below it.
    expect(guardianForStage(DAWN_STAGE).id).toBe("the-dawn");
    expect(guardianForStage(DAWN_STAGE + 50).id).toBe("ruined-king");
    expect(guardianForStage(3300).id).toBe("titan-king");
    expect(stratumTag(60, "en")).toBe("");
    expect(stratumTag(61, "en")).toBe(stratumTag(1, "en"));
    expect(ageName(60, "en")).toBe(`${ageName(0, "en")} II`);
    expect(ageName(185, "fr")).toBe(`${ageName(5, "fr")} IV`);
  }, 600_000);

  it("accepts an honest walk past stage 10,000, saved every quarter hour", () => {
    // Kept by the deep road's bot (`deep.ts`) a few stages short of 10,000, its numbers long
    // written in the larger unit: the walk on is checked as the server would check it.
    const { state, now } = fixture("walker-9950");
    expect(state.maxStageEver).toBeLessThan(10_000);
    const engine = new GameEngine(state, seededRng(10), now);
    playChecked(engine, now, 72, (s) => s.maxStageEver >= 10_000, true);
    expect(engine.state.maxStageEver).toBeGreaterThanOrEqual(10_000);
    expect(lifeBits(engine.state)).toBeGreaterThan(0);
  }, 1_800_000);

  it("writes the night's numbers in a larger unit past stage 3500, without losing a coin", () => {
    const { state, now } = fixture("walker-2990");
    const engine = new GameEngine(state, seededRng(7), now);
    const s = engine.state;
    // Brought to the edge of the first unit (only the numbers are checked here, not the walk).
    s.maxStage = SCALE_FROM - 1;
    s.maxStageEver = SCALE_FROM - 1;
    s.stage = s.maxStage;
    s.monster = null;
    engine.refresh(now);
    const gold = s.gold;
    const earned = s.run.goldEarned;
    const total = s.lifetime.goldEarned;
    const dps = derive(s, now).dps;
    (engine as unknown as { advance(): void }).advance();
    const bits = scaleBits(SCALE_FROM);
    expect(runBits(s)).toBe(bits);
    expect(lifeBits(s)).toBe(bits);
    expect(s.gold * 2 ** bits).toBe(gold);
    expect(s.run.goldEarned * 2 ** bits).toBe(earned);
    expect(s.lifetime.goldEarned * 2 ** bits).toBe(total);
    expect(Math.abs(derive(s, now).dps * 2 ** bits - dps) / dps).toBeLessThan(1e-12);
  });

  it("accepts the save right after a Descent, the Altar of Fortune fallen", () => {
    // Gold earned under a high Fortune, then the Sanctum unwoven: the gold stays honest.
    // A walker at the Dawn, the night's gold earned with the Altar of Fortune high (the save
    // that saw the refusal before the fix).
    const { state, now } = fixture("walker-descent");
    const engine = new GameEngine(state, seededRng(2), now);
    const descents = state.descents;
    expect(engine.canAscend()).toBe(true);
    engine.ascend(now);
    const fortune = engine.state.altars.fortune ?? 0;
    expect(engine.descend(now + 1000)).toBeGreaterThanOrEqual(0);
    expect(engine.state.descents).toBe(descents + 1);
    expect(engine.state.altars.fortune ?? 0).toBeLessThan(fortune);
    expect(verifyState(structuredClone(engine.state), now + 2000)).toEqual([]);
  });

  it("rejects gold and blows the deep road never gave", () => {
    const { state, now } = fixture("walker-2990");
    const deep = structuredClone(state);
    expect(verifyState(deep, now)).toEqual([]);
    // Gold written as if the unit were still the plain one: far more than the night earned.
    const forged = structuredClone(deep);
    forged.gold *= 2 ** 119;
    expect(codes(verifyState(forged, now))).toContain("gold-ledger");
    const total = structuredClone(deep);
    total.lifetime.goldEarned *= 1e40;
    expect(codes(verifyState(total, now))).toContain("gold");
    expect(codes(verifyTransition(deep, total, 60_000))).toContain("gold");
  });
});
