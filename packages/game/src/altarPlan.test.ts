import { describe, expect, it } from "vitest";
import { altarNet, distributeEssences, walkerStrikesLead } from "./altarPlan";
import { ALTAR_BY_ID } from "./data/altars";
import { ESSENCE_DPS_BONUS, altarPrice } from "./formulas";
import { createInitialState } from "./state";

const T0 = Date.UTC(2026, 2, 1);

/** A walker at their first dusk: one ascension, the essences of the first King in hand. */
function firstDusk(essences = 70) {
  const state = createInitialState(T0);
  state.lifetime.ascensions = 1;
  state.lifetime.bestHired = 10;
  state.lifetime.playTime = 3 * 3600;
  state.lifetime.clicks = 2 * 3 * 3600;
  state.essences = essences;
  return state;
}

describe("the Sanctum's counsel", () => {
  it("never offers every essence, and only to altars that give more than keeping them", () => {
    const state = firstDusk();
    const plan = distributeEssences(state, false);
    expect(plan.length).toBeGreaterThan(0);
    const spent = plan.reduce(
      (acc, id) => {
        const cost = altarPrice(acc.probe, id);
        acc.probe.altars[id] = (acc.probe.altars[id] ?? 0) + 1;
        acc.probe.essences -= cost;
        return acc;
      },
      { probe: structuredClone(state) }
    ).probe;
    expect(spent.essences).toBeGreaterThan(state.essences / 4);
    // Only the stones that answer a walker of the second night.
    for (const id of new Set(plan)) expect(ALTAR_BY_ID[id].night).toBeLessThanOrEqual(state.lifetime.ascensions + 1);
  });

  it("offers nothing while the Nameless keeps the essences", () => {
    const state = firstDusk();
    state.trail.promise = { hero: "nameless" } as never;
    expect(distributeEssences(state, false)).toEqual([]);
  });

  it("says plainly what a level does once the essences it takes are counted", () => {
    const state = firstDusk(5);
    // Five essences for one level of Might: ×1.10 on the company, the essences' +10% each lost.
    const might = altarNet(state, "might", T0);
    expect(might.essences).toBeCloseTo((1 + ESSENCE_DPS_BONUS * (5 - altarPrice(state, "might"))) / (1 + ESSENCE_DPS_BONUS * 5));
    expect(might.net).toBeGreaterThan(might.essences);
    // An altar that gives no damage only costs the essences' share.
    const time = firstDusk(500);
    time.lifetime.ascensions = 3;
    const timeNet = altarNet(time, "time", T0);
    expect(timeNet.damage).toBe(1);
    expect(timeNet.net).toBeLessThan(1);
  });

  it("reads who led the night from the company, then the altars, then the walker's pace", () => {
    const state = firstDusk();
    expect(walkerStrikesLead(state, T0)).toBe(false);
    state.altars.blade = 2;
    expect(walkerStrikesLead(state, T0)).toBe(true);
    state.altars.patience = 3;
    expect(walkerStrikesLead(state, T0)).toBe(false);
  });
});
