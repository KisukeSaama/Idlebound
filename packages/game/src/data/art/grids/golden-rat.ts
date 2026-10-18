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
    "..........bc",
    ".........fcc.......cbffc",
    ".........fcbc..c..ccfffg",
    ".........bbbbbbbcbcffghcc",
    ".........fbbbbbbbccffgccc",
    ".........bbbbbccbbbeffcc",
    ".......bbbbbcccccbaeggcc",
    ".......bbbccaabcbbaaccc",
    ".......bbbcaabbccccgcc",
    "......bbcccxExccccbbbc",
    ".....bbcccbxxxccccbbacc",
    "....bbhcdccbbccddcbaaac",
    ".....ffgddcbbccccbbaaacc",
    ".....bbdddcbddcbbaaabbbcc",
    "......bbccbbccbbbaaccbbcc",
    "........bbbbbbbaabcccbbbcc",
    ".......bbbcbbbccbcdccbabbc",
    "......fbccccbcccbcddbbabbcc",
    ".....fgcccbghhcbbbcccbabbbc",
    ".....bfcccfhhhccccccbabcbbcb",
    ".....bacccbggggcccbbbabccbbc",
    "......abcbbaaaaaaaaaaacccbbc",
    ".......bccbbbbbaaaaaabbcbbbc",
    "......caabbbbbbbbaabbbbbbbbbb",
    ".....caabbbbbbccbaacccbbbbab",
    ".....baaacbbcdddbbddcccbbbabb",
    ".....baaabbcddddbcdddccbbbabb",
    ".....baaabbcdddcbcccccbbbaab",
    "......aaabcccddbbbcccbbbbaab",
    "......aaaaaccccbabbbbbbbbaaaccc",
    ".......aaaaacccbaababaaaaaaaaaccc",
    "...aabbbaaaabbbbbaaaaaaaaaaaaaabcd",
    ".ccaaffffeeebbbbbbaaaaaaaa...aaabdd",
    ".ccbaeee.......ffefeaaaaa......bcdb",
    "bbcb..........ggggggaee......ccccbb",
    ".bbccc........bffgff.....cccccbbbb",
    "..bbbccccccc..b.bbbbcccccccbbbbb",
    "....bbbbccdddddddddcccbbbbbbb",
    ".........bbbbbbbbbbbbaa"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    d: { m: "fur", step: 3 },
    e: { m: "skin", step: 0 },
    f: { m: "skin", step: 1 },
    g: { m: "skin", step: 2 },
    h: { m: "skin", step: 3 },
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
        { x: 2, y: 10, rows: ["..b.c._", ".b.hcd_", "..f.gd_", "..b.d._"] }
      ]
    }
  }
};
