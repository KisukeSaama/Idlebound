import type { RelicGrid } from "../../relics";

/** A wide band with two suns engraved: one shines, one is scratched out. Painted, then traced. */
export const SECOND_MORNING: RelicGrid = {
  rows: [
    "..........djjeeee",
    "........jjejeeeeeeee",
    "......jjjjeeeeeeeeeddd",
    ".....jjjeeedeeeeeeddddd",
    "....edeejeddfffffcdddddc",
    "...jeeeeddggfdddeffccddcc",
    "..eeeeecggd......ddccdcbbb",
    "..eeeecgf..........dgccbbb",
    ".eeeedfgh...........dgcbbbb",
    ".deeedhhhh..........dffbbbb",
    "ceeedghhhhhh.....eddddgbbbb",
    "cddefghhhhhh.....geffdgfbaaa",
    "cdddfghhihhhh...fgeeffffaaaa",
    "cdddfhhiiihhh...ggeegfdeaaaa",
    "cdddfghiiihhh...ggggffdeaaaa",
    "ccdcfghhhhhh.....gggfdgeaaaa",
    "cccccghhhhhhh....efffdjecca",
    ".bccccghhhh......eeddeeaaca",
    ".bcccccgh...........eedaaaa",
    "..ccbcccd..........eeebaaa",
    "..aabbbddee......eeedbbaaa",
    "...abbbddeeeeeeeeeebbddaa",
    "....aaddbbceeeeeddbbbada",
    ".....ddddbbbbbbbabbbaaa",
    "......dbbbaabbbbaaaaaa",
    "........baaabbbbaaaa",
    "...........abaabba"
  ],
  legend: {
    a: { m: "dark", step: 0 },
    b: { m: "dark", step: 1 },
    c: { m: "dark", step: 2 },
    d: { m: "dark", step: 3 },
    e: { m: "dark", step: 4 },
    f: { m: "ember", step: 0 },
    g: { m: "ember", step: 1 },
    h: { m: "ember", step: 3 },
    i: { m: "ember", step: 4 },
    j: { m: "string", step: 2 }
  }
};
