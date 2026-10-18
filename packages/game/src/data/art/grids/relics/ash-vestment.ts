import type { RelicGrid } from "../../relics";

/** An ash-grey robe, its hem and cuffs still burning. Painted, then traced. */
export const ASH_VESTMENT: RelicGrid = {
  rows: [
    "......daaaacc",
    ".....ddaaaabcc",
    "....dccaaaacccc",
    "....dcccaaacccc",
    "...cccccbadbcccb",
    "...dcbdcccbccccb",
    "...dbbdcbbcdbbcb",
    "..dcbacbbbccaaccc",
    ".dccaacccbccaabccc",
    ".dccaacbdcccaabccb",
    "dhhaaacbddccaaachfd",
    "aaheaacbccccaaaghee",
    ".aaeeaccccccaaeeee",
    "...eeaccccccba.e",
    ".....acccccbba",
    ".....acccccbba",
    "....bbcccccbbba",
    "....bbcacccbbba",
    "....bbcabccbbba",
    "....bbcabbccbba",
    "....bbcabbbbbbb",
    "....bbcbbbcbbbgg",
    "...eeegbbbcbbeef",
    "...ffecbbbcfbeeg",
    "...ggecgebcfeegg",
    "...gggggeecegghh",
    "....ggggfgggggf",
    "........eggg"
  ],
  legend: {
    a: { m: "ash", step: 0 },
    b: { m: "ash", step: 1 },
    c: { m: "ash", step: 3 },
    d: { m: "ash", step: 4 },
    e: { m: "rarity", step: 0 },
    f: { m: "rarity", step: 1 },
    g: { m: "rarity", step: 2 },
    h: { m: "rarity", step: 3 }
  }
};
