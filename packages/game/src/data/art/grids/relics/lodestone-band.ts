import type { RelicGrid } from "../../relics";

/** An iron band set with the shard he buried; the eye in it has closed. Painted, then traced. */
export const LODESTONE_BAND: RelicGrid = {
  rows: [
    "............ee",
    "...........ecee",
    ".........cdcdjeee",
    ".......cecccdjcceee",
    "......ecccccdcccccce",
    ".....ccdccdaaaadcccccc",
    "....dddddaaa..aaadcccc",
    "...dddddda.......aadccc",
    "...dddda..........adcccc",
    "..dddda.....cj.....adccc",
    "..fddda...ddgjjc...aaccdd",
    ".ffdda...ddcdjjji...aacdd",
    ".dddda..ddaaajagcg..afddc",
    "ddccdd.dddaagiiagii.afejcc",
    "daaddd.gaichhghggaa.aadffd",
    ".daadd..aajiiihggaa..ddff",
    ".dafcd...gaiiiigaa..gdddd",
    ".dafdc....gaaaaaa...gcddd",
    "..daacd....haaaa...dcddd",
    "..daadcd....ga.....ddddd",
    "...daaccd.........cddddd",
    "...dddfccd......dccaabd",
    "....dddaacccddcccddfabd",
    ".....ddaaadccccddddff",
    "......ddaaaaaffddffd",
    "........fdaaaffddf",
    "...........ddddd",
    "............dd"
  ],
  legend: {
    a: { m: "dark", step: 0 },
    b: { m: "dark", step: 1 },
    c: { m: "dark", step: 4 },
    d: { m: "glass", step: 0 },
    e: { m: "glass", step: 2 },
    f: { m: "notch", step: 0 },
    g: { m: "rarity", step: 0 },
    h: { m: "rarity", step: 1 },
    i: { m: "rarity", step: 2 },
    j: { m: "rarity", step: 4 }
  }
};
