import type { RelicGrid } from "../../relics";

/** A long arrow, fletched in the rarity's color, a notch cut in its shaft for every night. Painted, then traced. */
export const THOUSANDTH_ARROW: RelicGrid = {
  rows: [
    "........................g",
    "......................bcb",
    "....................bccba",
    "..................gbccbb",
    ".................fbbcbbg",
    "..................fhgcb",
    "..................hhfba",
    ".................hhffb",
    "................gig.ff",
    "...............ggd",
    "..............gig",
    ".............gig",
    "............hihf",
    "...........hhhf",
    "..........hhhd",
    "..........hhd",
    ".........hid",
    "........gig",
    ".......hig",
    "......ghhg",
    "...eehhhf",
    "..ejjjhf",
    ".ejjjjj",
    "feejjjj",
    "hjiejje",
    "ejijje",
    "giiig",
    "...d"
  ],
  legend: {
    a: { m: "blade", step: 0 },
    b: { m: "blade", step: 3 },
    c: { m: "blade", step: 4 },
    d: { m: "gold", step: 0 },
    e: { m: "gold", step: 1 },
    f: { m: "grip", step: 0 },
    g: { m: "grip", step: 2 },
    h: { m: "grip", step: 3 },
    i: { m: "rarity", step: 2 },
    j: { m: "rarity", step: 3 }
  }
};
