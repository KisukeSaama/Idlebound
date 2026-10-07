import { CUTSCENES, cutsceneSeconds, type CutsceneShot } from "@idlebound/game";
import { describe, expect, it } from "vitest";
import { PIECES, melodyNotes, noteHz, pieceSeconds } from "./music";

describe("the Dusk theme", () => {
  it("tunes its notes to A 440", () => {
    expect(noteHz("A4")).toBe(440);
    expect(noteHz("A5")).toBe(880);
    expect(noteHz("C#5")).toBeCloseTo(554.37, 1);
    expect(() => noteHz("H2")).toThrow();
  });

  it("writes four beats to every bar, and holds a note through its dashes", () => {
    for (const piece of Object.values(PIECES)) for (const bar of piece.bars) expect(bar.melody.split(" "), bar.melody).toHaveLength(4);
    expect(melodyNotes([{ chord: "Dm", melody: "E5 - D5 ." }])).toEqual([
      { note: "E5", from: 0, to: 2 },
      { note: "D5", from: 2, to: 3 }
    ]);
  });

  it("opens on its hook and comes home to D", () => {
    const notes = melodyNotes(PIECES.theme.bars);
    expect(notes.slice(0, 4).map((note) => note.note)).toEqual(["A4", "D5", "E5", "F5"]);
    expect(notes[notes.length - 1].note).toBe("D5");
    expect(melodyNotes(PIECES.reprise.bars).slice(0, 4).map((note) => note.note)).toEqual(["A4", "D5", "E5", "F5"]);
  });

  it("gives every scene its music from the first moment, and lasts as long as the longest", () => {
    const opens = (shot: CutsceneShot) => shot.beats?.some((beat) => "music" in beat && beat.music !== "hush" && beat.at === 0) ?? false;
    for (const cutscene of CUTSCENES) expect(opens(cutscene.shots[0]), cutscene.id).toBe(true);
    expect(pieceSeconds(PIECES.theme)).toBeGreaterThan(Math.max(...CUTSCENES.filter((cutscene) => cutscene.id !== "first-dusk").map(cutsceneSeconds)));
  });
});
