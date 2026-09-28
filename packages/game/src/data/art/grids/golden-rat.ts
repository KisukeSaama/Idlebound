import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * Pip, the Golden Rat (BIBLE 8.6): the same in every stratum, the only one. A small plump
 * rat sitting up on his haunches, gold from ears to tail, a coin held against his chest in
 * both pink hands, a black button eye with a point of moon in it, whiskers catching the
 * light; the long tail curled around his feet.
 */
export const GOLDEN_RAT: CreatureGrid = {
  rows: [
    ".............ddc",
    "...........dddccc..ccc",
    "...........ddqqqcbcccbb",
    "...........ccqqqqbcpppbb",
    "...........cqqqqqbbppppb",
    "...........ccqqqqabppppa",
    "...........cbqqqaabbppaa",
    ".........dddbbbaaaabbaa",
    "........ddddddbaaaaaa",
    "........dxxddcccccccb",
    ".......ddxxxcccccccbb",
    ".......ddExxccaaaabbbx",
    "dd.....ddxxxcbabbbbbaa",
    "..dd.dddcccccbbbaabbabccc",
    "...dddccbbbbcbaabbaaabbbaa",
    "..qqqaabbbbbbaaaaaaaacccaab",
    "..qdddaaabbbaaaaaaaaccccaccb",
    "dddxxxxxx...aaaaaaacccccccabb",
    "..............aaaaccccccccaabb",
    ".........qaaaaaacccccbbbccaabb",
    "........qqqddqqqccccaabaacaabb",
    ".......apqxxxdqqcccaaabaacabba",
    ".......adxddaxqaccbaaaxbababbax",
    "......aaxddddaxaabcbbaabbbabbax",
    "......aaxddcdaxaabbbaaabbbbbaax",
    "......aaxdcccaxaaaabbaaddccaaax",
    ".......acxaaaxaaabaapbadccccbb",
    "........ccxxxaaaabaaabbbccccac",
    ".........aaaaabbabbacccaccbbacb",
    "..............ababbaacaaccbbbbaa",
    "..............aaaaaaaaaabbbabaabbb",
    "...............aaaaaaaaabbaaaaabbbb",
    "...............aaxaaaaaaaaaaaaabbbb",
    "................axaaqaaaaaaaaa..bbb",
    "................qqqqqqaaxxaxx...bbbb",
    "..............qqqqqpppxxxxx....bbbbb",
    ".........cccccbqqqccc...ccccccbbbb",
    ".........bbbbbbbbbbbbbbbbbbbbbbb",
    "..............xaaaabbbaaabaaaa"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    d: { m: "fur", step: 3 },
    p: { m: "skin", step: 1 },
    q: { m: "skin", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // Quick small breaths: a rat that knows it is being looked at.
    waist: 24,
    breath: [0, 0, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the nose and whiskers twitch.
    twitch: {
      frames: [6],
      patches: [
        { x: 0, y: 13, rows: ["....d", "..qqq_", "...ddd", "ddd___", "___", ".........q", "........q", "........_", "........d_", "........_"] }
      ]
    }
  }
};
