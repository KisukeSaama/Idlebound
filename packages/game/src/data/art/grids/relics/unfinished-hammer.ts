import type { RelicGrid } from "../../relics";

/** A smith's hammer, its head still glowing from the forge, a new mark on its cheek. Painted, then traced. */
export const UNFINISHED_HAMMER: RelicGrid = {
  rows: [
    "..............aaa",
    ".............aaaaff",
    "............faafffff",
    "...........ffffffffffe",
    "..........ffffffddffbcf",
    "..........fffffddddfddf",
    "..........fffffdddddffff",
    "...........fffffdddffffff",
    "............fffffffffffff",
    ".............ffffffffffff",
    "............feffffffffff",
    "...........deeedffffffff",
    "...........eeeddfffffff",
    "..........deeddd..ffff",
    ".........deeddd....ff",
    "........deeddd",
    ".......deeeddd",
    "......deeeddd",
    ".....deeeddd",
    "....deeeddd",
    "...deeeddd",
    "..feeedddd",
    ".deeeeddd",
    "feeeeddd",
    "fddeddd",
    "fddddd",
    ".ddddd",
    "..fff"
  ],
  legend: {
    a: { m: "blade", step: 0 },
    b: { m: "ember", step: 2 },
    c: { m: "ember", step: 3 },
    d: { m: "gold", step: 0 },
    e: { m: "gold", step: 1 },
    f: { m: "grip", step: 0 }
  }
};
