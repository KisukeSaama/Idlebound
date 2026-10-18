import type { RelicGrid } from "../../relics";

/** The mother-tree's last seed, split by a green light, a leaf at its tip. Painted, then traced. */
export const GROVE_SEED: RelicGrid = {
  rows: [
    ".e",
    ".eeee...fffe",
    "..fff..ffffe",
    "..fffi.ffff",
    "...iiidffff",
    ".....dd",
    ".....ii",
    "....iiii",
    "...iifffb",
    "..jcfggfbb",
    ".jhdfggfcaa",
    ".bbddgggdaa",
    "jabdfgggdbaa",
    "habdfdggdbaa",
    "habifgggibaa",
    "haahfgggiaaa",
    "haaafgggiaaa",
    ".aaaeggfaaa",
    ".aaaafgeaaa",
    "..aaahhaaa",
    "...aaaaaa",
    "....aaaa",
    ".....aa",
    ".....ca",
    ".....cc",
    ".....dd",
    ".....bd",
    "......b"
  ],
  legend: {
    a: { m: "husk", step: 0 },
    b: { m: "husk", step: 1 },
    c: { m: "husk", step: 2 },
    d: { m: "husk", step: 3 },
    e: { m: "moss", step: 2 },
    f: { m: "moss", step: 3 },
    g: { m: "moss", step: 4 },
    h: { m: "sprout", step: 0 },
    i: { m: "sprout", step: 1 },
    j: { m: "sprout", step: 2 }
  }
};
