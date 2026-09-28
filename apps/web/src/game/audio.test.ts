import { DAWN_STAGE, STAGES_PER_BIOME } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { dronePlan } from "./audio";

describe("ambient drone", () => {
  it("is the same for the same place, and changes with the biome and the era", () => {
    expect(dronePlan(3)).toEqual(dronePlan(7));
    expect(dronePlan(3).key).not.toBe(dronePlan(3 + STAGES_PER_BIOME).key);
    expect(dronePlan(3).root).not.toBe(dronePlan(3 + STAGES_PER_BIOME).root);
    expect(dronePlan(3).key).not.toBe(dronePlan(53).key);
    expect(dronePlan(3).path).not.toEqual(dronePlan(53).path);
  });

  it("detunes a little further with every Age", () => {
    let previous = dronePlan(1);
    for (let age = 1; age < 12; age += 1) {
      const plan = dronePlan(1 + age * 250);
      expect(plan.beat).toBeGreaterThan(previous.beat);
      expect(plan.sour).toBeGreaterThan(previous.sour);
      previous = plan;
    }
  });

  it("is muffled in Age X only", () => {
    expect(dronePlan(2251).muffled).toBe(true);
    expect(dronePlan(2500).muffled).toBe(true);
    expect(dronePlan(2250).muffled).toBe(false);
    expect(dronePlan(2501).muffled).toBe(false);
    expect(dronePlan(2251).cutoff).toBeLessThan(dronePlan(2250).cutoff);
  });

  it("holds a single true note at the Dawn", () => {
    const dawn = dronePlan(DAWN_STAGE);
    expect(dawn.dawn).toBe(true);
    expect(dawn.beat).toBe(0);
    expect(dawn.sour).toBe(0);
    expect(dronePlan(DAWN_STAGE - 1).dawn).toBe(false);
  });
});
