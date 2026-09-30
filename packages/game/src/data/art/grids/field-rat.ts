import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Field Rat (BIBLE 3.7, 8.1): every rat that ever stole grain from Orvane, come out of
 * the wheat at the company as one. Heavy and hunched, the head low and thrust forward, the
 * jaw open on long yellow teeth, one small red eye; matted brown fur, bare pink ears,
 * hands and a long ringed tail dragging behind.
 */
export const FIELD_RAT: CreatureGrid = {
  rows: [
    "...........................................bb",
    "....................................bb..bbbbbb....bbb",
    "...................................bbbbbbbbbbbbbbbbbbbb",
    "..................................bbbbbbbbbbbbbbbbbbbbbb",
    ".................................bbbbbbbbbbbbbbbbbbbbbbbbb",
    "................................bbbbbbbccbbccbbbcccbbbbbbbb",
    "..............................bbbbbbbbcccbccccbbcccbbbbbbbbbbb",
    ".............................baabbbbbbbbcccccbbbbbccbbbbbbbbbb",
    "............................bbbbbbbbbbbbcccccbbbbbbbcccbbbbbbbb",
    "......................dd.bbbbbbbbbbbbbbbbbbccccbbbbbbbccbbbbbbbb",
    "......................ddbbbbbbbbbbbbbbbbbbcccccccccbbbcbbbbbbbbbb",
    "......................cbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbba",
    "......................cbbbbbbbccbccbbbbbccccccccccbbbbbbbbbbbbbbaa",
    "....................bbbbbbbbcccccccccbbbbcccccbbccccbbbbbbbbbbbbbbcc",
    "..................bbbbbbbbbcccbbccccccbbbccccbbccccccbbbbbbbbbbbbbb",
    "................bbbbbbbbbbbbbbbccccddbbbcccbbbccccccbbbbbbbbbbbbbbba",
    "...............bbbbbbbbbbbbbbbccccccccccccccccbcccccbbbbbbbbbbbbbaaabb",
    ".............bbbbbbbbbbbbbbbbbpccccccdcccccccccbbbbbbbbbbbbbbbbbabbaab",
    ".........b..bbbbbbbbbbbbbbbbbpppccccddcddccccccbbbbbbbbbbbbbbbbbbbbbab",
    "........pb..bbbbbbbbbbbbbbbbbpppbcccccddddccccbbbbbbbbbbbbbbbbbbbbbbbbb",
    ".......qpbbbbbbbbbbbbbbbbbabbpppbbcbcccddddccbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "......pqpbbbbbbbbccbbbbbqaabppqqbbbbccdddcccccbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "......pppbbbbbbbbccbbbbqqabppqqqbbbccccccccbccbbbbbaabbbbbbbbbbbbbbbbbbb",
    "......0pbbbbbbcbcccbbbqqqabppqqqbbbccccccccbbbbbbbbaaababbbbbbbdcccbbbba",
    "......0bbbbcccccccbbbbqqaabbpqqqbbbbcccccccbbbbbbbbaaaaabbbbbbbdccccbbbaa",
    "......bbbccccccccccbbbppaabppqqabbbccccccccbbbbbbbbbbbbabbbbbbccdcccbbaaa",
    "......bbccccccccccccbbbbaaappqqabbccccccccbbbbbbbbbbbbbabbbbcccdddcccbbbaa",
    ".....bbccccccccddccbbbbbaaapppqabbccccccccbbbbbbbbbbbbbbbbbccddddcccbbbbabb",
    ".....bbcbcccceeebcbbbbbbaapppaaabbbccccccccbbbbbbbbbbbbbbbccddddccccbbbbbabb",
    ".....bbbbbccd00000bbccbbbppppaabbbcccddccccbbbbbbbbbbbbbbccddddcccbbbbbbbabbppccc",
    "....bbbbbbbbdbERRbbccccbbbb0aabbbbcccddcbccbbbbbabbbbbbbbccddddcccbbbbbbbabbpcccqc",
    "...cbcccccbbbbRRRbcccccbbbb0abbbbbccdddcbbbbbbbbabbbaabbbccddcdccbbbbbbbbaabpbbcqqpqc",
    "..ccccdccbbcbbbbbbdcccbbbbbbbbbbbcccdddcccbbbbbbabbbaabbbcdddcccbppbbbbbaaabbbbbqqqqcc",
    ".cccdddcccccccccddccbbbbbbccbbbbbbcccddcbbbbbb000bbbbbbbcdddccccbbbbbbbbaabbbbbbbbqqqqp",
    ".qqqddccddcccbcccbbbbbccccccbabbbbccccccpbbbbbb00bbbbbbbcdddccccbbbbbbbbaa....bbbbbqqqpp",
    "cqqqqccdddcccbbbcbbbbccccbbbbabbbbccccbbppbbbbbbbbbbaaabddddcccbbbbbbbbaa......bbbbqqqqp",
    "bqqqqpddddcccbbbbbbbbcccccbbbabbbbcccccbbbbbbb00bbbbaabbcddccdbbbbbbbbaa..........bbqqqqc",
    "bppppddddcccbbbbbbbbccccbccb00abbbbcbcccccbbbbb0abbb00bbcddcddbbbbbbbbaa...........bbqqqc",
    "bbeepdddccbbbb00bbbbbcbcbbbbb00bbbbbbbccccccbbbbaaaa000bccccccbbbbbba00a...........bbppqc0",
    "bbeec000cbbbb0000bbbbbbbbbbaa0aabbbbbbcccccccbbb0000000bbccccbbbbbbbb00a............bbpqcp",
    ".beebb00000000000bbbbbbbbbbaaaaabbbbbbccccbbbbbb0000000bbbccbbbbbbbba00bbb...........bpqqp0",
    "..ebbeepp00000aabbbbbbbbbbbbaaaaabbbbbbbcbbbbbbb0000000bbbccbbbbbbbbaaabbba..........bpqqcc",
    "...bccdddppppbbbbbbbbbbbbbabbbbaa00bbbbbbbbbbbbb0000...bbbbbbbbbbbbbbbbbbba...........cqqcc",
    "...ccc..dbbaapbcbbbbbbaaaabbbbbba000bbbbbcccbbbb0000...babbbbbbbbbbbbbbbbba...........cqqca",
    "...c.....bbbppbcbbb000000bbbbbbbaa00ccqqccccbbbb00aa....abbabbbbbbbbbaabbb0...........pqqbb",
    ".........bbppbbcbb00000000bbabbbaa00ccqqcccbbbbb00aab....bbabbbba000aaabb............ccqqbb",
    ".........bpppppcb00a00000..baabbaa00cqqccccbbbbaaaaab..........aa.0aaabbb............cqqqbb",
    "........cbbddppba0aaaaa00........aqqqqcccbbbbbbaaaabb..............abbbb.............qqqbbb",
    "........ccddcccbaaaaaaa...........qqqqccbbbbaabbbbab..............bbbpbb............pqqqbb",
    "........bbbcccbbabaaaa...........qqqqccbbbbbbbbbbb...............bbbcpp............ccqqbb",
    ".........bbbbbbbbbba............qqqqqcbbbbbbbbb.................bbbccpb...........qqqccbb",
    ".........bbbbbbbaa.............qqqqqqbbb...................bbbbbbbppccb..........qqqqbbb",
    ".........bbbbbbbb.............qqqqqccbb...................bbbbbbpppqqbb........qqqqqbbb",
    ".......bbbbbbbbb.............qqqqqccbb...................bbbbbccpbbqqb........qqqqbbb",
    "..cbbbbbbbbbbbbb............bqqqqqqbbb....................bbbcbbbabcbb......qqqqpbbb",
    "..cbcbbbbcbbbbb...........bbbqqqqqqbbb......................ccbbbaccb.....qqqqqbbbb",
    "..cccbbcccbbcb.........cccqqqpqqpqqb..............................c...qqqqqpbbbb",
    "...cc.bbbb............ccbcqqbpqqbqqp.................................qqqbbbb",
    ".......................bbcbbbccbbccb...............................cqqqbb",
    ".......................ccbbbbccbbbcb..............................pppb",
    ".......................cc....cbb.................................ppp",
    "................................................................ppp",
    "................................................................pp"
  ],
  legend: {
    "0": { m: "shadow", step: 0 },
    E: { pal: C.goldLight, glow: true },
    R: { pal: C.danger, glow: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    d: { m: "fur", step: 3 },
    e: { m: "fur", step: 4 },
    p: { m: "skin", step: 1 },
    q: { m: "skin", step: 2 }
  },
  idle: {
    // A slow, heavy breath through the open jaw: in for three beats, held, out.
    waist: 41,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the tip of the tail flicks.
    twitch: {
      frames: [9],
      patches: [
        { x: 81, y: 42, rows: ["......c.q.a", "....._p.qba", "....._c.q.b", "...._...q.b", "...._.....b", "....p..q", "...cc", "..qq.cc.b", "....qb", "_", "..b.._", "", "p_", "__"] }
      ]
    }
  }
};
