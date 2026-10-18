import type { RelicGrid } from "../../relics";

/** A spiral shell of pale stone on a cord, its mouth faintly lit. Painted, then traced. */
export const ORIANE_EAR: RelicGrid = {
  rows: [
    "........aaa",
    "........aaa",
    "........aaa",
    "........aaa",
    "........aaa",
    "........aaa",
    "........aaa",
    "........aba",
    "........bba",
    ".......abbba",
    ".....abbccbbaa",
    "....adffggddcba",
    "...bffffgggdcbba",
    "..bfffggddgggbbba",
    ".adfffdbbbbcgdbbba",
    ".bfggdbbccbabgdbba",
    "adffdbbddccbadgbbba",
    "aegfcbddceebbbgdbba",
    "beggcbfdeeeebbggbba",
    "acgdbbdeeeedbbgdbba",
    "abbgbabdffebabgbbba",
    ".bbdgcabccbbcgdbba",
    ".abbbgbaaaacgdbbba",
    "..abbbgdddggdbbba",
    "...abbccdddbbbba",
    "....aabbbbbbbaa",
    "......aabbbaa",
    "........aaa"
  ],
  legend: {
    a: { m: "grip", step: 0 },
    b: { m: "grip", step: 2 },
    c: { m: "grip", step: 3 },
    d: { m: "grip", step: 4 },
    e: { m: "rarity", step: 3 },
    f: { m: "rarity", step: 4 },
    g: { m: "shell", step: 3 }
  }
};
