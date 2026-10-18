import type { RelicGrid } from "../../relics";

/** A blade cut from the Sky-Glass, stars in it, and deep inside a small warm lamp. Painted, then traced. */
export const SPLINTER_OF_SKY: RelicGrid = {
  rows: [
    ".......................c",
    ".....................dih",
    "...................diihh",
    "..................iiiehh",
    ".................iiiehhc",
    "................iiieehh",
    "...............iiiieeeh",
    "..............iiiiieeh",
    ".............diiiieee",
    "............diiieeie",
    "...........diiieeiid",
    "..........djjjdeeid",
    ".........djjffjeed",
    "........cdffffjjd",
    ".......chdffffjd",
    "......cccccfffd",
    "......ccccacfdd",
    "......ggccchhh",
    "......ggacchh",
    "......ggaacg",
    ".....agaggggg",
    "....baaaa",
    "...cgaaa",
    "..cggga",
    ".cccgg",
    "cccgg",
    "gggg",
    "gggg"
  ],
  legend: {
    a: { m: "dark", step: 0 },
    b: { m: "dark", step: 2 },
    c: { m: "dark", step: 3 },
    d: { m: "dark", step: 4 },
    e: { m: "glass", step: 1 },
    f: { m: "rarity", step: 3 },
    g: { m: "sky", step: 0 },
    h: { m: "sky", step: 3 },
    i: { m: "sky", step: 4 },
    j: { m: "star", step: 1 }
  }
};
