import type { RelicGrid } from "../../relics";

/** A broad blade the color of morning, a small sun for its guard. Painted, then traced. */
export const DAWNBREAK: RelicGrid = {
  rows: [
    ".........................gg",
    ".......................fbci",
    ".....................gaeebg",
    "....................gjeejag",
    "...................gddejjg",
    "..................gddccjgh",
    ".................fddcccag",
    "................fdddccag",
    "...............geedccag",
    "..............gdeeccag",
    ".............gddejcbg",
    ".......fg...gdddjjbg",
    "......gihh.gdddjjjg",
    "......gghhgjedjjjg",
    ".......gghajjjjjg",
    ".......ggieeijag",
    "........gaeeahg",
    "........ggaahh",
    ".......ggggghhh",
    "......giggggghhg",
    ".....ggggg..gghh",
    "...gggggg....gg",
    "...gaggg",
    "..ggggg",
    ".ghhggg",
    "gahggg",
    "gggg",
    "ggg"
  ],
  legend: {
    a: { m: "dawn", step: 0 },
    b: { m: "dawn", step: 1 },
    c: { m: "dawn", step: 2 },
    d: { m: "dawn", step: 3 },
    e: { m: "dawn", step: 4 },
    f: { m: "gold", step: 0 },
    g: { m: "grip", step: 0 },
    h: { m: "grip", step: 1 },
    i: { m: "grip", step: 2 },
    j: { m: "grip", step: 4 }
  }
};
