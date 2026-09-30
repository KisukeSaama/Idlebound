import { ALTAR_REWORK_NOTICE, HARVEST_NOTICE, HARVEST_NOTICE_TOLD, HERO_BY_ID, createInitialState } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { currentHint, hintLearned, hintsAnsweredBy } from "./hints";

describe("tutorial hints", () => {
  it("shows nothing at minute one, then one hint at a time, in order", () => {
    const state = createInitialState();
    expect(currentHint(state)).toBeNull();
    state.gold = HERO_BY_ID.maelle.baseCost;
    expect(currentHint(state)?.id).toBe("hire");
    state.heroLevels.aldric = 1;
    expect(currentHint(state)?.id).toBe("companion");
    state.heroLevels.maelle = 1;
    expect(currentHint(state)).toBeNull();
  });

  it("stops asking to train Aldric once a companion has joined, as an idle walker never does", () => {
    const state = createInitialState();
    state.heroLevels = { aldric: 0, maelle: 120 };
    state.lifetime.bestHired = 2;
    state.maxStage = 54;
    state.gold = 1e9;
    expect(currentHint(state)?.id).not.toBe("hire");
    expect(hintLearned(state, "hire")).toBe(true);
  });

  it("drops a hint the moment the walker did what it says, marked or not", () => {
    const state = createInitialState();
    state.heroLevels.aldric = 10;
    state.gold = 0;
    expect(currentHint(state)?.id).toBe("skill");
    expect(hintLearned(state, "skill")).toBe(false);
    state.lifetime.skillsUsed = 1;
    expect(currentHint(state)).toBeNull();
    expect(hintLearned(state, "skill")).toBe(true);
  });

  it("tells a closed seam once: learned when the walker takes the road again, gone once marked", () => {
    const state = createInitialState();
    state.lifetime.bosses = 1;
    state.lifetime.bossFails = 1;
    state.autoAdvance = false;
    expect(currentHint(state)?.id).toBe("farm");
    expect(hintLearned(state, "farm")).toBe(false);
    state.autoAdvance = true;
    expect(currentHint(state)).toBeNull();
    expect(hintLearned(state, "farm")).toBe(true);
    // The next seam that closes: marked, the hint stays away.
    state.tutorial.done.push("farm");
    state.lifetime.bossFails = 2;
    state.autoAdvance = false;
    expect(currentHint(state)).toBeNull();
  });

  it("answers the ascension hint when the Sanctum is opened, and only there", () => {
    const state = createInitialState();
    state.lifetime.bosses = 9;
    state.maxStage = 51;
    expect(currentHint(state)?.id).toBe("ascend");
    expect(hintsAnsweredBy(state, "hall")).toEqual([]);
    expect(hintsAnsweredBy(state, "ascension")).toEqual(["ascend"]);
    state.tutorial.done.push("ascend");
    expect(currentHint(state)).toBeNull();
    expect(hintsAnsweredBy(state, "ascension")).toEqual([]);
  });

  it("teaches nothing after a first dusk, and keeps the notices until acknowledged", () => {
    const state = createInitialState();
    state.lifetime.ascensions = 1;
    state.gold = 1e6;
    expect(currentHint(state)).toBeNull();
    // An older save whose altars were given back, then whose Harvest was.
    state.tutorial.done = state.tutorial.done.filter((id) => id !== ALTAR_REWORK_NOTICE);
    expect(currentHint(state)).toMatchObject({ id: ALTAR_REWORK_NOTICE, notice: true });
    expect(hintLearned(state, ALTAR_REWORK_NOTICE)).toBe(false);
    expect(hintsAnsweredBy(state, "ascension")).toEqual([]);
    state.tutorial.done.push(ALTAR_REWORK_NOTICE, HARVEST_NOTICE);
    expect(currentHint(state)).toMatchObject({ id: HARVEST_NOTICE_TOLD, notice: true });
    state.tutorial.done.push(HARVEST_NOTICE_TOLD);
    expect(currentHint(state)).toBeNull();
  });
});
