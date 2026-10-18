import type { RelicGrid } from "../../relics";

/** A mantle of green briars, woven across with thorned stems, a rose for its clasp. Painted, then traced. */
export const BRIAR_MANTLE: RelicGrid = {
  rows: [
    "...................f",
    ".....fdhhh......ffhff",
    ".....ffhhhhh..fhhhhhfd",
    "....fffdhhhhhhhhhhhfdd",
    "....ffffehhhhhhhhfffeef",
    "....fffcbbhhhhhhhfffch",
    "...fffcddbbhhhhffbdcbhhj",
    "...ffdcccbcchhhccccchjh",
    "...fdjeeccdgggggccddiif",
    "...ffdjjjcggggggiiiiihd",
    "....fddjjjggggggiiihhhd",
    "....fcdiiigggggggijhbhd",
    "...fdcicccgggggggiabbhh",
    "...ffcceccegggggccddbdhf",
    "...ffceffccdihhaccfdbbdd",
    "..fdhidfeeddhhhaddddhbhd",
    "..ffdjhjjhhcehddchjihjhhd",
    "..fddjjjhhecdddhcheiijhhd",
    ".fdddjjhbddcdfdeccehjihhhd",
    ".dddeeiheebbffdedchhhhhhhd",
    "..ddfhhfhbbhdffhhdbhhhhhh",
    "...dhhhfhbahdfddhfbbhhhh",
    "...dddfdecbddedddchhdd.h",
    "......fhfehbdeddhbhhe",
    ".......ffhhhhhhdhehhe",
    "........ahhdhhhdhee",
    "........a..ddhhdd.e",
    ".............h"
  ],
  legend: {
    a: { m: "briar", step: 0 },
    b: { m: "briar", step: 2 },
    c: { m: "briar", step: 3 },
    d: { m: "leaf", step: 0 },
    e: { m: "leaf", step: 1 },
    f: { m: "leaf", step: 2 },
    g: { m: "rarity", step: 1 },
    h: { m: "thorn", step: 0 },
    i: { m: "thorn", step: 2 },
    j: { m: "thorn", step: 3 }
  }
};
