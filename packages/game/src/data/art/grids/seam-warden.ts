import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Seam Warden (BIBLE 8, events): it holds a crack in the night shut with both hands. A
 * tall figure of dark glass split into long facets, shards grown out of its back and a
 * crest of them over a bowed wedge of a skull; its legs braced wide, one arm raised with
 * the elbow over its head, the other hand low, both clamped on a vertical rift of pale
 * light that stands before it from its chest to the ground. The glass nearest the rift
 * catches its light; two cold points under the brow.
 */
export const SEAM_WARDEN: CreatureGrid = {
  rows: [
    "",
    "",
    "",
    "...................c",
    ".................ccc",
    ".................ccc..c",
    "..........ccc..ccccc.bc....a",
    "........aacaacccccccaac...aa",
    "........aaaaccccccccbccc..ac",
    ".......aaaaacccccccccccc.acc",
    "......aaaacccccccaccccccccc",
    "......ccaabbbccbaaccccccccc....c",
    "......cccbbbbaabbaccccccccc...ac.....a",
    "......ccbbbbbaabbaccccccccc..acc....ca",
    ".....accbbbbbcabaaccccccccc.aac...acc",
    ".....accbbbbbcaabbccccccccccccc..aacc",
    ".....accbbbbbaaaabccccccccccccccaacc",
    ".....acabbbbbEaaaEbcccccccccccccccc",
    "....aaaabbbbbaaaaabcacccccccccccccc",
    "....aaaabbbbbaaaabbbaaccccccaacccc...aa",
    "....aaaabbbbbacabbbbbbbccccccaccccccccc",
    "...aaaaabbbbbbcbbbLbbbbccbcccccccccccc",
    "...aacaabbbbbbbbbeLbbbbbccccccccccccc",
    "...cccbbbbbbaccbbbLebbbbacccccaaaccc",
    "...cccbbbcccaaabbbLLbbbbacbaacaaaccccccc",
    "...accbbcccbbbbbbbLLebbbbaccaaaccccccccc",
    "...accbccabbbbbbbbLLebbbbaaaaaaccccccc",
    "...ccccaaaaaaabbbbLLbbbbbbbaaaaaccccccc",
    "....cccaaaaaabbbbbLLbbbbbbbaacaacccccccc",
    ".........ccaaabbeeLLebbbbbbacccccccccccc",
    "................eLLLebbbbbbccccccccccc",
    "................eLLebbbbbbcccccccccccccc",
    "................eeLLbbbbbaccccccbaccccccc",
    "................eeLLebbbdaacccccbacccccccc",
    "................eeeLebbbdaccccccbbcccc",
    "................eeeLLbbbbacccccccbccccc",
    "................eeeLLbbbaaaccccccbccccc",
    "................eeeLLbbbaaacccccbbccccc",
    "................eeLLebbbbacccccccbcccccc",
    "................eeLLebbbbacccccccccccccc",
    "................eeeLLbbaaacccccccbbccccc",
    "................eeeLLebbaaacccccbbccccc",
    "................eeeeLLbbbabbcccccccccc",
    "................eeeLLebbbcaaccaaccccc",
    "................eeeLLbbbbcaccaaccccc",
    "................eeeLLbbbaaaaacccccccc",
    ".................eeLLbbbaaaacccccccccc",
    ".................eeLebbbaaaccccccccccc",
    ".................ebeebbbaaccccccccccccc",
    ".................bbLLbbaaccccccccccccc",
    ".................bbeebaaccccccccccccccc",
    "................bbbbbaacccccccccccc.cccc",
    "...............abbbbbbaacccccccccccc.ccc",
    "...............abbbbbbaac...cccacccc..ccc",
    "..............aabbbbbbbaa...caaaacccc..cc",
    "..............abbbbeLLbb....caaaacccc...cc",
    ".............aabbbbeLLbb....aaaaaaccc....c",
    ".............aabbbbbLLee....aaabaaccc",
    "............aabbbbbeLLee....a.abbccccc",
    "............aabbbbbeLLee......aabccccc",
    "...........aaaabbbbeLLee.......bbccccc",
    "...........aaaaabbeeLLee.......cbccccc",
    "...........ccaaaa.eeeLee........ccbccc",
    "...........ccaaaa.eeeLLe........abbaccc",
    "...........cccaaa.eeeLLe.........aaacccc",
    "...........ccccaaaeeeLLe.........cccccccc",
    "...........acccaaaeeeLLe..........cccccccc",
    "...........accaaaaeeeLLe...........cccccccc",
    "...........accaaaa.eeLLe...........accccccc",
    "...........accaaa..eeLee...........aaccccccc",
    "...........cccaaa..eeLee............bccccccc",
    "...........cccaa...eLLee............cccccccc",
    "...........ccca....eLLee.............cccccc",
    "...........cccc....eeLLe..............cccccc",
    "...........cccc....eeLLe...............ccccc",
    "...........cccc....eeLLe................cccc",
    "...........cccc....eeLLe.................ccc",
    "..........ccccc.....eLLe.................cccc",
    ".........cccccc.....eeLe.................cccc",
    "........ccccccc.....eeLe.................ccccc",
    ".......cccccccca....eeLe.................ccccc",
    "...cccccccccccaa....eeLe.................ccccc",
    ".cccccccccccccc.....eeLee.................aacc",
    ".cccccccc..........eeeLLee................aaccc",
    ".ccccccc...........eeeLeee................aaccc",
    "....................eeee..................aaccc",
    ".........................................ccccccc",
    ".........................................ccccccc",
    "........................................ccccccccc",
    "........................................ccccccccc",
    "........................................cc.cccc",
    ""
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    L: { pal: C.moon, glow: true, light: true },
    a: { m: "glass", step: 1 },
    b: { m: "glass", step: 2 },
    c: { m: "shadow", step: 0 },
    d: { m: "shadow", step: 3 },
    e: { m: "shadow", step: 4 }
  },
  idle: {
    // A strained breath: the shoulders heave against the crack and settle.
    waist: 58,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, the raised arm strains to hold the rift shut.
    twitch: {
      frames: [7],
      patches: [
        { x: 0, y: 0, rows: ["", "", "", "", "", "", "..........___", "........__.cc_", "..........c.a", "......._", "......_...aa", "......aa..ccc", "........aa...c", "........c", "....._.......a", "", ".............c", ".......c.....a", "...._.c......E", "", "", "..._.........a", ".....a", "...aa.aa....bb", ".........bbb.c", "...c....b..caa", ".......b.cc", "...a..bcc.bbbb", "...c.........a", "....cccaaaa..b", ".........ccaaa"] }
      ]
    }
  }
};
