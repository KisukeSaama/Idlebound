import type { RelicGrid } from "../../relics";

/** A brass token with a hole in it, threaded on a plain band. Painted, then traced. */
export const STALLKEEPER_BAND: RelicGrid = {
  rows: [
    ".........dddcbb",
    ".......ddhhdddde",
    "......dhdaaaaaacab",
    ".....dhaaa....aacb",
    "....ddaa.......aaba",
    "....dda.........abaa",
    "...ddaa..........bba",
    "...dcaaggjjjjige.bca",
    "...eafjjgfeeefggfeea",
    "...ajjgeefggfeeeffea",
    "...jjfegjjjgfffeeefe",
    "..gjefjjjjggjfffeeefe",
    ".gjfejiijiiggffffeeffe",
    ".ggeffggjiiigfffffeefe",
    "egfffgggeeeeeeffffeeee",
    "fgefffgge.....fffffeeee",
    "fgeffffge.....fffffeeee",
    "fgeefffge.....ffffeeeee",
    "ffeeffffe.....feeeeeeee",
    "effeeffffffggffeeeeeeee",
    ".ffeefffffffffeeeeeeee",
    ".effeeeeeffffeeeeeegee",
    ".eefeeeeeeeeeeeeeegfe",
    "..effeeeeeeeeeeeegfee",
    "...eeffeeeeeeeeejfee",
    "....eeffeffeeeeeeee",
    "......eeeeffeeeee",
    "........eeeeeee"
  ],
  legend: {
    a: { m: "blade", step: 0 },
    b: { m: "blade", step: 1 },
    c: { m: "blade", step: 2 },
    d: { m: "blade", step: 3 },
    e: { m: "gold", step: 0 },
    f: { m: "gold", step: 1 },
    g: { m: "gold", step: 2 },
    h: { m: "gold", step: 4 },
    i: { m: "rarity", step: 2 },
    j: { m: "rarity", step: 3 }
  }
};
