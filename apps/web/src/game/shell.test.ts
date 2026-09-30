import { CHRONICLE_SOURCES, ageName, createInitialState, stratumTag } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { ANNOUNCED, ANNOUNCED_AT_LOAD, OWN_TOAST, REUNION_SOURCES, revealMark, reveals, stratumLabel } from "./shell";

describe("progressive interface", () => {
  it("shows nothing but the fight, the attack and the gold at minute one", () => {
    const shown = reveals(createInitialState());
    expect(Object.entries(shown).filter(([, visible]) => visible)).toEqual([]);
  });

  it("opens each element as it becomes usable", () => {
    const state = createInitialState();
    state.maxStageEver = 2;
    state.heroLevels = { aldric: 3, maelle: 1 };
    state.lifetime.bestHired = 2;
    state.lifetime.shardsEarned = 1;
    const shown = reveals(state);
    expect(shown.map && shown.stageBar && shown.dps && shown.click && shown.shards && shown.autoSpend).toBe(true);
    expect(shown.gear || shown.ascension || shown.essences).toBe(false);
  });

  it("spreads the first minutes: the stall at its first affordable ware, the Hall at the first guardian down", () => {
    const state = createInitialState();
    state.maxStageEver = 10;
    state.achievements = ["clicks-1"];
    state.lifetime.bosses = 1;
    state.lifetime.shardsEarned = 19;
    expect(reveals(state).market || reveals(state).hall).toBe(false);
    state.lifetime.shardsEarned = 20;
    state.maxStageEver = 11;
    expect(reveals(state).market && reveals(state).hall).toBe(true);
    // Shards spent since, a Descent later: both stay.
    state.shards = 0;
    expect(reveals(state).market).toBe(true);
  });

  it("never hides what a walker already used after a new night", () => {
    const state = createInitialState();
    state.lifetime.ascensions = 1;
    state.lifetime.bestHired = 6;
    state.lifetime.bestLevelSum = 400;
    state.maxStageEver = 80;
    const shown = reveals(state);
    expect(shown.dps && shown.click && shown.essences && shown.ascension && shown.buyModes && shown.autoToggle).toBe(true);
  });

  it("keeps an announced menu even when its reason is gone", () => {
    const state = createInitialState();
    state.tutorial.done.push(revealMark("gear"));
    expect(reveals(state).gear).toBe(true);
  });

  it("opens the Promise once a companion half remembers the walker, and tells a game loaded past it once", () => {
    const state = createInitialState();
    expect(reveals(state).promise).toBe(false);
    state.lifetime.ascensions = 3;
    state.recognition = { maelle: 2 };
    expect(reveals(state).promise).toBe(false);
    state.recognition = { maelle: 3 };
    expect(reveals(state).promise).toBe(true);
    expect(ANNOUNCED).toContain("promise");
    for (const id of ANNOUNCED_AT_LOAD) expect(ANNOUNCED).toContain(id);
  });

  it("keeps its marks short and few (the save holds 50 tutorial ids of 40 characters)", () => {
    for (const id of ANNOUNCED) expect(revealMark(id).length).toBeLessThanOrEqual(40);
    expect(ANNOUNCED.length).toBeLessThanOrEqual(10);
  });

  it("wakes the Sanctum's stones in three times, each told once", () => {
    const state = createInitialState();
    state.lifetime.ascensions = 1;
    expect(reveals(state).altars2 || reveals(state).altars3).toBe(false);
    state.lifetime.ascensions = 2;
    expect(reveals(state).altars2 && !reveals(state).altars3).toBe(true);
    state.lifetime.ascensions = 4;
    expect(reveals(state).altars3).toBe(true);
    expect(ANNOUNCED).toEqual(expect.arrayContaining(["altars2", "altars3"]));
  });
});

describe("the Reunion's fragment", () => {
  it("looks first where fragments wait untold, then where a toast told them, never at what the scene just said", () => {
    expect(REUNION_SOURCES).not.toContain("dream");
    expect([...REUNION_SOURCES].sort()).toEqual(CHRONICLE_SOURCES.filter((source) => source !== "dream").sort());
    const firstTold = REUNION_SOURCES.findIndex((source) => OWN_TOAST.has(source));
    expect(REUNION_SOURCES.slice(firstTold).every((source) => OWN_TOAST.has(source))).toBe(true);
    expect(REUNION_SOURCES[0]).toBe("keystone");
  });
});

describe("stratum label", () => {
  it("names the era, its tag, and the Age from the second one", () => {
    expect(stratumLabel(1, "en")).toBe("Era I");
    const titan = stratumLabel(301, "fr");
    expect(titan).toContain(stratumTag(6, "fr"));
    expect(titan).toContain(ageName(6, "fr"));
    expect(stratumLabel(60, "en")).not.toContain(ageName(1, "en"));
  });
});
