import type { RelicGrid } from "../../relics";

/** A plain wedding band, tilted to show the letters engraved inside. Painted, then traced. */
export const MIRELLE_RING: RelicGrid = {
  rows: [
    "............aaaaa",
    ".........abbbbbaaaa",
    "........bdgbbbbbaaaa",
    ".......eedggccbbaaaaaa",
    "........eeeggbbaaaaaaaa",
    ".....cd..eedbbbbaaaaaaaa",
    "....cddd..ccbbbbaaaaaaaaa",
    "...acgddddccfbaa..aaaaaaa",
    "..accggccdgcbaa...aaaaaaaa",
    "..ccccccccccaa....aaaaaaaa",
    ".abbcbbccccaa.....aaaaaaaa",
    ".bbbbbbbccaa......aaaaaaaa",
    ".bbbbbbbcba.......aaaaaaaa",
    "abbbbbbbba.......aaaaaaaaa",
    "abbbbbbbaa.......aaaaaaaaa",
    "aabbbbbba.......bcaaaaaaa",
    "aaaabbbaa......aeggbaaaaa",
    "aaaaabba.......eedddcaaa",
    "aaaaabba......eeecddgbaa",
    ".aaaaaaa.....eeeeeeeeba",
    ".aaaaaaa...abcceeceeea",
    "..aaaaaaaaaabbbbdddeaa",
    "...aaaaaaaaaaabbbdcaa",
    "....aaaaaaaaaaabbbaa",
    ".....aaaaaaaaabbbaa",
    "......aaaaaaaabaa",
    ".......aaaaaaaaa",
    ".........aaaaa"
  ],
  legend: {
    a: { m: "gold", step: 0 },
    b: { m: "gold", step: 1 },
    c: { m: "gold", step: 2 },
    d: { m: "gold", step: 3 },
    e: { m: "gold", step: 4 },
    f: { m: "rarity", step: 2 },
    g: { m: "rarity", step: 3 }
  }
};
