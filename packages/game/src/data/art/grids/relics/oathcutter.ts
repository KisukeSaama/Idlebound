import type { RelicGrid } from "../../relics";

/** Kaelen's sword, snapped on the throne steps: the stump, a splinter, and the point lying apart, still turned up the stairs. Painted, then traced. */
export const OATHCUTTER: RelicGrid = {
  rows: [
    "........................hhh",
    ".....................haddbh",
    ".fjf................cdddab",
    "ejge...............cdddaah",
    "efeee.............cddbbahh",
    ".eeee............addbbbhh",
    "..eeee...........ddaaahh",
    "...heee........addaaahh",
    "....hee.......addaaaa",
    "....heee.....ahcaaaa",
    ".....eefe.ege..aaaa",
    "......fjffjjfe..hh",
    ".....eefficeee",
    ".....gffidcie",
    ".....eeeiccce",
    ".......ehiefe........ah",
    ".......ehhffge.....hddh",
    "......eehhhefe...cddch",
    ".....eeehh.eee...adcah",
    ".....eehh.......edbhah",
    "....eehh........dchhhh",
    "...eeeh.........aah",
    "..eeehh",
    ".efghh",
    "ejgee",
    "fjjeh",
    "fefeh",
    "eeee"
  ],
  legend: {
    a: { m: "blade", step: 0 },
    b: { m: "blade", step: 1 },
    c: { m: "blade", step: 2 },
    d: { m: "blade", step: 3 },
    e: { m: "gold", step: 0 },
    f: { m: "gold", step: 1 },
    g: { m: "gold", step: 2 },
    h: { m: "grip", step: 0 },
    i: { m: "grip", step: 1 },
    j: { m: "rarity", step: 3 }
  }
};
