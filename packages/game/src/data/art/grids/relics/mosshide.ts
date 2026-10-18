import type { RelicGrid } from "../../relics";

/** The Alpha's winter coat: a hide, moss growing along its back. Painted, then traced. */
export const MOSSHIDE: RelicGrid = {
  rows: [
    "............daa",
    "..........aacccaa",
    ".......ddaaaacccbddd",
    "......aacaaaaccccccbd",
    "......aaafafacccccccb",
    ".....aaaffffffccccccce",
    "....aaaffffafffcccccccd",
    "....aaafffaafffcccccccad",
    "...bbafccffafffcccccbbcbd",
    "...aaafccffcbfcccccbbbbbd",
    ".ddaaacccccccbccccbbbbbbb",
    ".ddaacccccccccccbbbbbbbbaa",
    "..daccccccccbbbbbbbbbbbba",
    ".aaabcccccccbbbbbbbbbbbbbd",
    ".aaabccccccbabaabbbbbbbbcaa",
    "aaaacccccccbaaabbbbbbbbbaa",
    ".dabccccccccbbbbbbbbbbbaadd",
    ".dgccccccccccbbbbbbbbbbaad",
    ".fcccbccccccbbbbbbbbbaaaaa",
    "dabbbbbccccbbbbbbbbbbaaaaad",
    "daabbbbbbbbbbbbbbbbbaaaaaad",
    "ddaaabbaabbbbbbbbbbaaaaaaad",
    ".daadaaaaaabbbbbbaaaaaaadd",
    "..dddddaaaaabbbbaaaaadda",
    "....dddddaaaabbbaaadd",
    ".........dddabbbaaa",
    "............dbba.d",
    ".............dd"
  ],
  legend: {
    a: { m: "fur", step: 1 },
    b: { m: "fur", step: 2 },
    c: { m: "fur", step: 3 },
    d: { m: "moss", step: 0 },
    e: { m: "moss", step: 1 },
    f: { m: "moss", step: 2 },
    g: { m: "rarity", step: 4 }
  }
};
