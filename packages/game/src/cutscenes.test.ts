import { describe, expect, it } from "vitest";
import { gameText, hireLine, kingWord } from "./content";
import { BIOMES } from "./data/biomes";
import { CONFESSION_NIGHT, CUTSCENES, witnessedCutscenes } from "./data/cutscenes";
import { LOCALES } from "./i18n";
import { createInitialState } from "./state";

/** A shot's line holds to a fragment's length (BIBLE 20). */
const LINE_MAX = 140;

describe("the Ledger's scenes", () => {
  it("names every scene and gives each shot one line, in both languages", () => {
    for (const locale of LOCALES) {
      for (const cutscene of CUTSCENES) {
        const text = gameText(locale).cutscenes[cutscene.id];
        expect(text.name, `${locale} ${cutscene.id}`).not.toBe("");
        expect(text.lines, `${locale} ${cutscene.id}`).toHaveLength(cutscene.shots.length);
        for (const line of text.lines) expect(line.length, line).toBeLessThanOrEqual(LINE_MAX);
      }
    }
  });

  it("shows only places of the road and of the story", () => {
    const roads = new Set(BIOMES.map((biome) => biome.id));
    for (const cutscene of CUTSCENES) {
      for (const shot of cutscene.shots) {
        if (shot.view.kind === "road") expect(roads.has(shot.view.biome), shot.view.biome).toBe(true);
        expect(shot.seconds).toBeGreaterThan(2);
      }
    }
  });

  it("lets the King speak his first Word at the first dusk", () => {
    const shots = CUTSCENES.find((cutscene) => cutscene.id === "first-dusk")!.shots;
    const spoken = shots.findIndex((shot) => shot.voice === "king");
    for (const locale of LOCALES) expect(gameText(locale).cutscenes["first-dusk"].lines[spoken]).toBe(kingWord(1, locale));
  });

  it("lets the King begin his confession at the thirteenth dusk", () => {
    const shots = CUTSCENES.find((cutscene) => cutscene.id === "empty-throne")!.shots;
    const spoken = shots.findIndex((shot) => shot.voice === "king");
    for (const locale of LOCALES) expect(gameText(locale).cutscenes["empty-throne"].lines[spoken]).toBe(kingWord(CONFESSION_NIGHT, locale));
    const state = createInitialState();
    state.lifetime.ascensions = CONFESSION_NIGHT - 1;
    expect(witnessedCutscenes(state)).not.toContain("empty-throne");
    state.lifetime.ascensions = CONFESSION_NIGHT;
    expect(witnessedCutscenes(state)).toContain("empty-throne");
  });

  it("lets Maëlle half remember the walker in her own words", () => {
    const shots = CUTSCENES.find((cutscene) => cutscene.id === "almost")!.shots;
    const spoken = shots.findIndex((shot) => shot.voice === "maelle");
    for (const locale of LOCALES) expect(gameText(locale).cutscenes.almost.lines[spoken]).toBe(hireLine("maelle", 1, locale));
  });

  it("plays Almost once Maëlle, remembering a little, is hired again", () => {
    const state = createInitialState();
    state.lifetime.ascensions = 1;
    state.recognition.maelle = 1;
    expect(witnessedCutscenes(state)).toEqual(["first-dusk"]);
    state.heroLevels.maelle = 1;
    expect(witnessedCutscenes(state)).toEqual(["first-dusk", "almost"]);
    // Past that night, it stays lived whoever is hired.
    state.heroLevels = {};
    state.lifetime.ascensions = 2;
    expect(witnessedCutscenes(state)).toEqual(["first-dusk", "almost"]);
  });

  it("counts the first dusk as lived from the first ascension on, on every device", () => {
    const state = createInitialState();
    expect(witnessedCutscenes(state)).toEqual([]);
    state.lifetime.ascensions = 1;
    expect(witnessedCutscenes(state)).toEqual(["first-dusk"]);
  });
});
