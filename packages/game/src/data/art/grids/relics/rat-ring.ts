import type { RelicGrid } from "../../relics";

/** A tiny gold ring, a bite taken out of it. Painted, then traced. */
export const RAT_RING: RelicGrid = {
  rows: [
    ".........aa.....aaa",
    ".......aaea.....acbaa",
    "......aeefb.....aeccba",
    ".....addddca....aefccba",
    "....adddddca....aefcacca",
    "...aeddeebaa....abffcccba",
    "..aecddeaaa....aaaacffcbaa",
    "..acdddaaaa.....aaaabfcbba",
    ".aecddbaaaa.....aaaaabfbbaa",
    ".aafdcaaa.........aaaacfbaa",
    ".acacaaa...........aaaacbaaa",
    "abcdbaa.............aaacbbaa",
    "abcfbaa..............aaccbaa",
    "abcfbaa..............aaccbaa",
    "abcfca................accbaa",
    "abaafa................adcbaa",
    "aabffa................bdcaaa",
    "abbbffa..............adcbaaa",
    ".abbffba............abccbaa",
    ".aaabcfba..........abdcbaaa",
    ".aaaacffba........abdfbaaaa",
    "..aaaabfcabaaa.aaacdfbaaaa",
    "...aabababfffccdddbbbaaba",
    "....aaaaabbffffffcbaaaaa",
    ".....aaaaaabbbbbaaaaaaa",
    "......aaaaaaabbaaaaaaa",
    "........aaaaaaaaaaaa",
    "..........aaaaaaaa"
  ],
  legend: {
    a: { m: "gold", step: 0 },
    b: { m: "gold", step: 1 },
    c: { m: "gold", step: 2 },
    d: { m: "gold", step: 3 },
    e: { m: "gold", step: 4 },
    f: { m: "rarity", step: 3 }
  }
};
