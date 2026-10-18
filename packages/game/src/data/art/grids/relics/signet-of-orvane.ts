import type { RelicGrid } from "../../relics";

/** The King's seal ring: a crown, and under it a letter worn almost away. Painted, then traced. */
export const SIGNET_OF_ORVANE: RelicGrid = {
  rows: [
    "...........aabb",
    "......abbbbaaeec",
    "...gggbeeeeefeeeca",
    "..ggaeeeeebbefbeeba",
    "..egceeeeebdbeebeecb",
    "..eegceedeecdbebbeeda",
    "...eacceecgcddddbeeecb",
    "...eaadbeecdcbeeeeeeca",
    "...eeeedbeeeeeeeeeccb",
    "...eeeeadbeeeeeccbbaa",
    "..dcaeeaadddcceabbbaaa",
    "..ddaaaaaaaaababbaaaab",
    ".cccaaaaaaaaaaaaaaaaaae",
    ".bcaa.aaaaaaabbbaaaaaae",
    "abba...baaaabbabbaa.aaee",
    "aaaa..ddaaaaaaaaa...aaae",
    "aaaa.bdcaaaa........eaae",
    "aaaa.bbaa...........eaaa",
    "eaaaabba...........eeeaa",
    "eaaaaaaa...........eeaa",
    ".eaaaaaa..........eeaaa",
    ".eaaaae..........ggeaa",
    "..aaaae.........dddbaa",
    "...eeaea.......cdddba",
    "....eeaaaeeeeebcccba",
    ".....eaaaeeeeebbba",
    ".......aeeeeeeeaa",
    ".........eeaaa"
  ],
  legend: {
    a: { m: "gold", step: 0 },
    b: { m: "gold", step: 1 },
    c: { m: "gold", step: 2 },
    d: { m: "gold", step: 3 },
    e: { m: "rarity", step: 0 },
    f: { m: "rarity", step: 2 },
    g: { m: "rarity", step: 3 }
  }
};
