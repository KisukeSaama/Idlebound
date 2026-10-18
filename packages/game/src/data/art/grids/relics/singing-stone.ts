import type { RelicGrid } from "../../relics";

/** A rough grey stone on a cord, humming: a vein of light, and the air rings around it. Painted, then traced. */
export const SINGING_STONE: RelicGrid = {
  rows: [
    "........aca...ca",
    "........aaa...aa",
    ".........ca...ca",
    ".........aa..ac",
    ".........aa..aa",
    "..........c..ca",
    "..........aaac",
    ".....g....aaaa",
    "....g.....acdca...g",
    "..........acdca....g",
    ".........aaacaa",
    "........acccccaa",
    ".......acccceccca",
    "......acggccedccba",
    ".....abcgcceedffbaa",
    ".....abcfcceedffcba...g",
    "g....acfcdeedcfffba...g",
    "g....acfcdeedcffbba...g",
    "g....acfcdeeddffbba..gg",
    "gg...acffddeedcffba..g",
    ".g...aaffcddeecffba",
    ".g...aacffddeecfcaa",
    ".gg..aabbffdeeccbaa",
    "..g..aabbcfdeccbbaa",
    "...gg.aabbfdeccbaa",
    "....g.aaabbcccaaa",
    ".....g.aaabbaaaa",
    "........aaaaaaa"
  ],
  legend: {
    a: { m: "grip", step: 0 },
    b: { m: "grip", step: 1 },
    c: { m: "grip", step: 2 },
    d: { m: "grip", step: 3 },
    e: { m: "rarity", step: 3 },
    f: { m: "stone", step: 3 },
    g: { m: "stone", step: 4 }
  }
};
