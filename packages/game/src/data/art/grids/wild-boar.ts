import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Jumpy Boar (BIBLE 8.1): a boar of the Hearthfields that has been killed before and
 * remembers, a little. Head low and thrust at the company, the forelegs braced, the hump
 * of the shoulders bristling black; old scars across the flank, tusks up, a small hot eye.
 */
export const WILD_BOAR: CreatureGrid = {
  rows: [
    "...............................bb......a",
    "...............................bb.....aa....aa",
    ".............................bbbbbbb.aa0.abbaa",
    "........................bb.bbbabaaa0aa000aaaa",
    "........................baabbaaaaa00a0000aa0aa",
    "......................bbba0ba00ab000000000000aab",
    "......................bbba0aa00ab000000000000aaaaaa",
    "....................bbbbbbbaa0bb000000bbaa000aa0aaa",
    "...................bbaabbaaaabbb00bbabbbba0baa000aaaab",
    ".................abbbbabbaaabbbaabbbaabbbbbbba0aaa0aaaa",
    ".................aaaaaabbaaabbbabbbaaabbbbbaaaaaaa0000aa",
    ".................aaabbabbabbbbaabbaabbbbbbaaabbaaaa0000a",
    "...............0bbbaaaaabbbbaaaaababbbbbbbabbbbaaaaa0000aa",
    "...............0abbbaaaaabbaaaaabbbbbbbbbbbbbbbbaabaa000aa",
    ".............0aaaabbaaaabbba00abbbbbbcbccbbbbbbbbbbbaaa0aaaa",
    "..............aaaabba00bbba00bbbbbbbcccccbbcbccccbbbbbaaaaaaaaa",
    "..............aaaabbbabbbbaaabbbbbbcccccccbcccccccbbbbbaaaaaaaaaabbbb",
    "........ab...aaaaabbbabbbbaabbbbbbbccaaacccccccccccbbbbbbaaaaaaabbbbbaa............a",
    "........abb..aaaabbbbaabbbbbbbaaaabbbaaabccccccccccccbbbbbaaaaaabbbbbbbbb..........aaa",
    "........abbba00abbbbbaaabbbbbbbbaabbbaabbbcccccccccccccbbbbbaaabbbbbbbbbbb.........aaaa0",
    "........00bbaa0abbbbbaabbbbbbbbaaabb00aabbbcccccccccccccbbbbbabbbbbccbbbbbbb.......abbbb",
    ".........0bbbaaabbbbbbabbbbbbbbaabbb0aaabbbbccccccccccccbbbbbbbbbbccccccbbbbb......aabbba",
    ".........00bbaaabbbbbbbbbbccbbbbbbb00aaaabbbccccccccccccccbbbbbbbbccccccbbbbbb.....000baa0",
    ".........000baabbbbbbbbcbbccbbbbb000aabaaabbbcccbbcccccccccbbbbbbbccccccccbbbbb.....00aaa0",
    ".........000aaabbbbbabbcccccbbbbb000aabaabbbbccbbbbbbbbbccbbbbbbbbbbccccccbbbbba....0000000a",
    ".........0a0aabbbbbaabbcccccbbbbb000abbaaabbbbbccccbbbbbbbbbbbbbbbbbbccccbbbbbaa.....000000a",
    "..........aabbbbbbaaabccccccbbbbb000aabaaaabbbcccccccbbbbbbbbbbbbbbbbbcccccbbbaaa.....000000",
    "..........aabbbbbaaabbcccccccbbbb000abbaaaaabbcccccccbbbbbbbbbbbbbbbbbbcccccbbbaaa.....0000",
    ".........aaabbbbbaabbcccccccbbbba00aabbaaaaabbccccccbbbbbbbbbbbbbbbbbbbbccccbbbbaabb...ba00",
    ".........a00bbcbbbabbcccccccbbbbaaaaaaaaa0aabbcccccccbbbbbbbbbbbbbbbbbbbbcccbbbbaaabbbbba0",
    ".........a00bbccbbbbbccccccbbbbbbbba000aa0aabbccccccccbbbbbbbbbbbbbbbbbbbccccbbba.aaaaaaa",
    ".........a00bbccbbbbcccccccccbbbbbb0000aa0aabbccccccccbbbaaabbbbbbbbbabbcccccbbbaa",
    ".........a0abbccbbbbccccccccccbbbbba00abbaaabbccccccccbbbaaabbbbbbbbaabbcccccbbbbb",
    ".........aaabbcccbbbcccccccccbbbbbba00ab000aabccccbcccbbbaaaabbbbbaaaaabbcccccbbbb",
    ".........aabbccccbbbbccccccbb00abbbb00aa000abbccccbcccbbbaaabbbbbaaaaabbbcccccbbbb",
    ".........a00bcccbbbbbbccccbb000abbbbbbaa000abbcccbbcccbbbaaaabbbbaaaaabbbccccbbbbba",
    ".........000bbccbbbbbbcccbb000aabbbbbbbaaaaabbcccccccbbbbaaaabbbbaaaaaabbbcccbbbaaa",
    ".........0000bccbbbbbcccbbb00aabbbbbbbbbaaaabbbccccccbbbbaaaaaaaaaaa0aabbbbcccbbaaa",
    "........a000abbbbbbbbccbbbFEbabbbbbbbbbba00abbbccccccbbbbba0aaaaaaa00aabbbbccbbaaa",
    "........a000aabbbbbbbbbaaEEbbbbbbbbccbbbbaaabbbbccccbbbbbba00aaaaaaa0abbbbbbbbbaaa",
    "........a00aaa0abbbbbba00bbbbbbbbbbccbbbbbaaabbbbbcbbbbbbba00aaaaaaa0aabbbbbbbbaaa",
    ".dd.....a00aa00abbbbbbaaaabbbccbbbbcbbbaaaaaabbbbbbbbbbbbbb000aaaaaaaaabbbbbbbbaaa",
    ".dd.....a00aaaabbbcccbbabbbbbbbbbbbbbbaaa000aabbbbbbbbbbbbbb00aaaaaaaaabbbbbbbbaaa",
    "cdd.....aa00aabbcccccccbbbbbbbbabbbbbbaaaaa0aaaabbbbbcccbbbbb00aaaa000aabbbbbbbaaa",
    "cdd.....aa000abcccdccccbbbbbbbaabbbbbbaaaa00aaaabbbbbccccbbba00aaa0000aaabbbbbaaaa",
    "cdd......0000bbccddcccccbbbbbbaaabbbaaaaa000aaaabbbbbcccbbbbaaaa000aa00bbabbbbbaaaa",
    "advv......000bbcccccccccbbbbbbaaabbaaaaabb000aaaabbbbcccbbbbb00000.....bbaaabbbaaaabb",
    "bvvv......000bbcccccccccbbbaavvaaaaa00aabb00000aaabbccbbbbbbb00000.....aaaaaaaaaaaaaaa",
    "bcvv.......abbcccccccbbbbbbaavvaaaa000aa0000000aabccccbbbbbaa0000aa.....aabbaaaaaaaaaa",
    "bcvvv...ccbabbppppccbbbbbbbadvdaaa0000aa0000000abbccccbbbbaaa0000aaa......bbbaaaaaaaaa",
    "bbvvvvccccbabpppppbbbbbcbbbadvda00000aaa0000000bbccccbbbbaaa000aaaaa.......bbaaaaaaaaa",
    ".bcvvvdcbbbabppppbbbbbccbbbdddca00000a000000000bbccccbbbaaab00aaaaaa........aaa00aaaaa",
    ".bccdddcbbaabpqppbbbbbbccbddddca000000000000000bccccbbbbaaabaaaaaaa............000aaaaa",
    "..ccccdpbbaapqqppbbbbbbccddddcb00000000000aa00bbcccbbbbaaaa.aaaaaaa.............00aaaaa",
    "...ccccbbbbpppqppbbbbbbbcddddcb00aa00000aaaa0bbccccbbbbaba..aaaaaa..............aaaaaaa",
    "....ccbbbbbbbpppppbbbbbbbccccaaaaaaaa00.00a..bbcccbbbbabba..aaaaaa...............aaabaa",
    ".....bbbbabbbbbbpppbbaaabbccaaaaaa000.......bccccbbbaaaa...aaaaaa................aaabba",
    ".......bbaaabbbbaappaaaaabbaaaaaaa.........bbccccbbaaaa...aaaaaa.................0aabbaa",
    ".........aaabbbbaabbbaaaa00aaaaaaa.........bbccbbbbbaa...aaaaaaa.................0abbbba",
    ".........0abbbbbbbbbbaaaa00aaaaa...........bbbbbbbbba...aaaaaaaa.................0bbbbbba",
    "........00abbbbbbbbbaaaa00aabb............aabbbbbbbb....aaaaaaaa.................aaabbbba",
    "........aaa00000bbaaa0000aabb.............bbbbbbaaa....bbabbaa...................aaabbbaa",
    "......aaaaaa0000.a0000000bb...............bbbbaaaa....bbbbbbbb...................bbabbbaa",
    "......aaaaaa000...000000bbb..............bbbbbbaaa....bbbbbbbb...................bbbbbbbb",
    ".....aaaaaaa00a....00000.................bbbbbbbaa......bbb.....................bbbbbbbbb",
    "....baaaaaaa00a.........................bbbbcbbbab..............................bbbbbbbbb",
    "...bbaabbaa0...........................bbbbccbbbab..............................bbbbbbbb",
    "...baabbbba0..........................bbbbbbbbaaaa..................................bb",
    "..bbabbbbbaa..........................bbbbbbbbaaaa",
    "..baabbbbaa..........................bbbbbbbbaa",
    "....b0000...........................bbbabccbbbb",
    "....................................bbbabccbbbb",
    "....................................bbbbccbbbbb",
    "....................................bbbbcbbbbb",
    "......................................00bbb"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    E: { pal: C.amber, glow: true },
    F: { pal: C.goldLight, glow: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    d: { m: "fur", step: 3 },
    p: { m: "snout", step: 1 },
    q: { m: "snout", step: 2 },
    v: { m: "tusk", step: 3 }
  },
  idle: {
    // Quick shallow breaths: a nervous animal.
    waist: 45,
    breath: [0, 0, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the tail flicks up.
    twitch: {
      frames: [5],
      patches: [
        { x: 83, y: 16, rows: [".a", "_aaa", "_..aa0", "_.bbbb", "_aa..ba", "_000..a0", "__.0..a0", "._.000.00a", ".________"] }
      ]
    }
  }
};
