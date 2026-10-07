import { describe, expect, it } from "vitest";
import { gameText, hireLine, kingWord } from "./content";
import { CONFESSION_NIGHT, CUTSCENES, CUTSCENE_BY_ID, cutsceneSeconds, witnessedCutscenes, type CutsceneId } from "./data/cutscenes";
import { LOCALES } from "./i18n";
import { STRATA_TEXT } from "./content/story/strata";
import { createInitialState } from "./state";

/** A shot's line holds to a fragment's length (BIBLE 20). */
const LINE_MAX = 140;

/** The beats that speak a line, in the order of the scene. */
const spoken = (id: CutsceneId) => CUTSCENE_BY_ID[id].shots.flatMap((shot) => (shot.beats ?? []).flatMap((beat) => ("line" in beat ? [beat] : [])));
/** The line a voice says in a scene. */
const saidBy = (id: CutsceneId, voice: string) => spoken(id).find((beat) => beat.voice === voice)!.line;

describe("the Ledger's scenes", () => {
  it("names every scene and speaks each of its lines once, in order, in both languages", () => {
    for (const locale of LOCALES) {
      for (const cutscene of CUTSCENES) {
        const text = gameText(locale).cutscenes[cutscene.id];
        expect(text.name, `${locale} ${cutscene.id}`).not.toBe("");
        expect(spoken(cutscene.id).map((beat) => beat.line), `${locale} ${cutscene.id}`).toEqual(text.lines.map((_, index) => index));
        for (const line of text.lines) expect(line.length, line).toBeLessThanOrEqual(LINE_MAX);
      }
    }
  });

  it("shows only places of the road and of the story, every beat within its shot", () => {
    for (const cutscene of CUTSCENES) {
      for (const shot of cutscene.shots) {
        if (shot.set.kind === "road") expect(Number.isInteger(shot.set.stage) && shot.set.stage >= 1, cutscene.id).toBe(true);
        // Only a road has a guardian to stand on it; the walker walks the places too.
        if (shot.set.kind !== "road") for (const actor of shot.actors ?? []) expect(actor.who, cutscene.id).toBe("walker");
        if (shot.set.kind !== "road" && shot.set.kind !== "place") expect(shot.actors ?? [], cutscene.id).toEqual([]);
        expect(shot.seconds).toBeGreaterThan(1);
        for (const beat of shot.beats ?? []) expect(beat.at, cutscene.id).toBeLessThan(shot.seconds);
        for (const actor of shot.actors ?? []) for (const at of [actor.lunge, actor.fall]) if (at !== undefined) expect(at).toBeLessThan(shot.seconds);
      }
    }
  });

  it("keeps every scene short and the weightiest the longest (BIBLE 12.10)", () => {
    for (const cutscene of CUTSCENES) {
      expect(cutsceneSeconds(cutscene), cutscene.id).toBeGreaterThanOrEqual(10);
      expect(cutsceneSeconds(cutscene), cutscene.id).toBeLessThanOrEqual(60);
    }
    const first = cutsceneSeconds(CUTSCENE_BY_ID["first-dusk"]);
    for (const cutscene of CUTSCENES) expect(cutsceneSeconds(cutscene)).toBeLessThanOrEqual(first);
  });

  it("strikes the first King with a blow he falls from", () => {
    const blow = CUTSCENE_BY_ID["first-dusk"].shots.find((shot) => shot.beats?.some((beat) => "flash" in beat))!;
    const walker = blow.actors!.find((actor) => actor.who === "walker")!;
    const king = blow.actors!.find((actor) => actor.who === "guardian")!;
    expect(walker.lunge).toBeLessThan(king.fall!);
  });

  it("lets the King speak his first Word at the first dusk", () => {
    for (const locale of LOCALES) expect(gameText(locale).cutscenes["first-dusk"].lines[saidBy("first-dusk", "king")]).toBe(kingWord(1, locale));
  });

  it("lets the King begin his confession at the thirteenth dusk", () => {
    for (const locale of LOCALES) expect(gameText(locale).cutscenes["empty-throne"].lines[saidBy("empty-throne", "king")]).toBe(kingWord(CONFESSION_NIGHT, locale));
    const state = createInitialState();
    state.lifetime.ascensions = CONFESSION_NIGHT - 1;
    expect(witnessedCutscenes(state)).not.toContain("empty-throne");
    state.lifetime.ascensions = CONFESSION_NIGHT;
    expect(witnessedCutscenes(state)).toContain("empty-throne");
  });

  it("lets Maëlle half remember the walker in her own words", () => {
    for (const locale of LOCALES) expect(gameText(locale).cutscenes.almost.lines[saidBy("almost", "maelle")]).toBe(hireLine("maelle", 1, locale));
  });

  it("plays Almost once Maëlle, remembering a little, is hired again", () => {
    const state = createInitialState();
    state.lifetime.ascensions = 1;
    state.recognition.maelle = 1;
    expect(witnessedCutscenes(state)).toEqual(["prologue", "first-dusk"]);
    state.heroLevels.maelle = 1;
    expect(witnessedCutscenes(state)).toEqual(["prologue", "first-dusk", "almost"]);
    // Past that night, it stays lived whoever is hired.
    state.heroLevels = {};
    state.lifetime.ascensions = 2;
    expect(witnessedCutscenes(state)).toEqual(["prologue", "first-dusk", "almost"]);
  });

  it("opens every walk on the Long Night, and counts the first dusk from the first ascension on", () => {
    const state = createInitialState();
    expect(witnessedCutscenes(state)).toEqual(["prologue"]);
    state.lifetime.ascensions = 1;
    expect(witnessedCutscenes(state)).toEqual(["prologue", "first-dusk"]);
  });

  it("tells the deep road's turns once the walker is past them", () => {
    const state = createInitialState();
    const deep = () => witnessedCutscenes(state).filter((id) => ["rime-crown", "rehearsal", "threshold", "beneath"].includes(id));
    state.maxStageEver = 500;
    expect(deep()).toEqual([]);
    state.maxStageEver = 501;
    expect(deep()).toEqual(["rime-crown"]);
    state.maxStageEver = 2001;
    expect(deep()).toEqual(["rime-crown", "rehearsal", "threshold"]);
    state.maxStageEver = 3001;
    expect(deep()).toEqual(["rime-crown", "rehearsal", "threshold", "beneath"]);
    expect(witnessedCutscenes(state)).not.toContain("loom");
    state.descents = 1;
    expect(witnessedCutscenes(state)).toContain("loom");
  });

  it("lets a scene set where a keystone lies say that keystone, word for word", () => {
    for (const locale of LOCALES) {
      const keystones = STRATA_TEXT[locale].keystones.map((line) => line.text);
      expect(gameText(locale).cutscenes["rime-crown"].lines).toContain(keystones[9]);
      expect(gameText(locale).cutscenes.threshold.lines).toContain(keystones[39]);
      expect(gameText(locale).cutscenes.beneath.lines).toContain(keystones[59]);
    }
  });
});
