import type { RelicGrid } from "../../relics";

/** A long scythe of bone, its dark blade clean along the edge: it has never been swung. Painted, then traced. */
export const QUIETUS: RelicGrid = {
  rows: [
    ".......geeeee",
    "....ggcggfffffee",
    "...gggefffffffffee",
    "..eeeeeeeffffffffff",
    ".ee.....efffffffffff",
    ".......eeeeeeffffffff",
    "......e......eefffffff",
    ".............egeefffffe",
    ".............ggeeeeeffe",
    ".............ceee...fffe",
    "............adge.....ffe",
    "............dce.......fe",
    "...........cde........ee",
    "..........adg.........ee",
    "..........dce..........e",
    ".........gce",
    "........adb",
    "........cc",
    ".......cce",
    "......edf",
    ".....edg",
    ".....cce",
    "....gdf",
    "...edg",
    "...cce",
    "..ddf",
    ".ecce",
    "..ee"
  ],
  legend: {
    a: { m: "blade", step: 0 },
    b: { m: "bone", step: 0 },
    c: { m: "bone", step: 1 },
    d: { m: "bone", step: 2 },
    e: { m: "dark", step: 0 },
    f: { m: "dark", step: 1 },
    g: { m: "dark", step: 3 }
  }
};
