import { ageName, createInitialState, stratumTag } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { ANNOUNCED, ANNOUNCED_AT_LOAD, revealMark, reveals, stratumLabel } from "./shell";

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
    expect(shown.map && shown.stageBar && shown.dps && shown.click && shown.shards && shown.market && shown.autoSpend).toBe(true);
    expect(shown.gear || shown.ascension || shown.essences).toBe(false);
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

  it("opens the Promise with the second night, and tells a game loaded past it once", () => {
    const state = createInitialState();
    expect(reveals(state).promise).toBe(false);
    state.lifetime.ascensions = 1;
    expect(reveals(state).promise).toBe(true);
    expect(ANNOUNCED).toContain("promise");
    for (const id of ANNOUNCED_AT_LOAD) expect(ANNOUNCED).toContain(id);
  });

  it("keeps its marks short and few (the save holds 50 tutorial ids of 40 characters)", () => {
    for (const id of ANNOUNCED) expect(revealMark(id).length).toBeLessThanOrEqual(40);
    expect(ANNOUNCED.length).toBeLessThanOrEqual(10);
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
