import type { RelicGrid } from "../../relics";

/** An hourglass the size of a tear. The sand has gathered at the top, and more rises. Painted, then traced. */
export const ELDRA_LOCKET: RelicGrid = {
  rows: [
    ".......a",
    ".......aa",
    "......aba",
    ".....abaa",
    "....agga",
    "....aaaa",
    "....aaa",
    ".....aa",
    "....aaaa",
    "aaaaaaaaaaa",
    "ccccccccccaa",
    "cccccccccaaa",
    ".aeeeeeedga",
    ".affffefdga",
    ".aeffeeeda",
    "..ceeeeecc",
    "...ceeecc",
    "....ceca",
    "...aaega",
    "...aafgaa",
    "..abffggaaa",
    ".abfffeggaa",
    ".aaffffegaa",
    ".affffeehga",
    "ccefeeedhga",
    "ccccccccccca",
    "ccccccccccca",
    "ccccccaaaaaa"
  ],
  legend: {
    a: { m: "glass", step: 0 },
    b: { m: "glass", step: 1 },
    c: { m: "gold", step: 0 },
    d: { m: "gold", step: 1 },
    e: { m: "gold", step: 2 },
    f: { m: "gold", step: 3 },
    g: { m: "rarity", step: 0 },
    h: { m: "rarity", step: 1 }
  }
};
