import type { RelicGrid } from "../../relics";

/** The Crown of Orvane, whose points outnumber the gems left in it. Painted, then traced. */
export const CROWN: RelicGrid = {
  rows: [
    ".............b",
    "............cce",
    "............cca",
    "...........cdcba",
    "...........ccbba",
    "ca.........abbaa.........ba",
    "cca........ebaee........aca",
    "ccbe..e....edbbe....ee..cca",
    "abaa..be...edbba....aa.aafa",
    ".aabaace...adbce...ebeebca",
    "..cbaecee.ebdacee.eeceeda",
    "..ccbbcceeeddccceeebbacca",
    "..ccccccbecddcbcaeebffbaa",
    "..accccggbddcgbcbbbefaaee",
    "...chfcggbddggfbbaffaage",
    "...cffcfgcddggfbbagffaae",
    "...ccbccadddbfabbbaeffae",
    "...acbbccdcddbbbbbbbfaae",
    "...bcbbbccccccbbbaaaaaae",
    "...abbbbccccccbbbaaaaaee",
    "...bbbbcccbbbbaaaaaaeeaa",
    "...aabcccddddccabbfffeea",
    ".......eaaaaaaaaaeeee"
  ],
  legend: {
    a: { m: "dim", step: 0 },
    b: { m: "dim", step: 1 },
    c: { m: "dim", step: 2 },
    d: { m: "dim", step: 3 },
    e: { m: "garnet", step: 0 },
    f: { m: "garnet", step: 1 },
    g: { m: "garnet", step: 2 },
    h: { m: "void", step: 4 }
  }
};
