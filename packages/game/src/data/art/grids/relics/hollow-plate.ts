import type { RelicGrid } from "../../relics";

/** An empty breastplate: through its collar, only the dark it walked here with. Painted, then traced. */
export const HOLLOW_PLATE: RelicGrid = {
  rows: [
    ".....cc.........cc",
    "...ccgcccdddddcccgcc",
    ".dgaaggcccccccccggeecc",
    ".ggbbggcccccccccggeedd",
    ".ggbaggcccccccccggeedd",
    ".cgaffgcccccccccgeeedd",
    ".cgeffggcccccccggeeedd",
    ".cgefffggcccccggeeecgc",
    "..gdfffffgggggddeeeccc",
    "..gdfffffffgcceeeeeccc",
    ".cgdffffffffeeeeeeeccc",
    ".cgefffffffaeeeeeeecgc",
    ".ddefffffffaeeeeeeeecc",
    "cgccffffffffeeeeeeeecgc",
    "cccccffffffceeeeeeecccc",
    ".ccccccccccccccccccccc",
    ".cccccccddeeeccccccccc",
    "..ccccefffffeeeecccccc",
    "..ccccefffffeeeecccccc",
    "..ccccefffffeeeecccccc",
    "..dcccefffffeeeecccccc",
    "..dcccdfffffeeeecccccc",
    "..fcccdfffffeeeeccccgc",
    ".cfggfggffffeeeeffggcc",
    ".ccccfgffgffeefdggddcc",
    "....ccccggggfffdccc",
    "......cccdggcccc",
    "..........ccc"
  ],
  legend: {
    a: { m: "blade", step: 2 },
    b: { m: "blade", step: 3 },
    c: { m: "void", step: 0 },
    d: { m: "void", step: 1 },
    e: { m: "void", step: 2 },
    f: { m: "void", step: 3 },
    g: { m: "void", step: 4 }
  }
};
