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
    "..............................................bb",
    ".......................................bb..bbbbbbb....bbb",
    "......................................bbbbbbbbbbbbbbbbbbbbb",
    ".....................................bbbbbbbbbbbbbbbbbbbbbbb",
    "....................................bbbbbbbbbbbbbbbbbbbbbbbbbb",
    "...................................bbbbbbbbccbbcbbbbbccbbbbbbbb",
    "................................bbbbbbbbbbccbbcccbbcccbbbbbbbbbb",
    "................................babbbbbbbcccccccccbbbcccbbbbbbbbbbb",
    "...............................bbabbbbbbbbbcccccbbbbbbcccbbbbbbbbbb",
    "..............................bbbbbbbbbbbbbccccccbbbbbbbcccbbbbbbbbb",
    "........................dd.bbbbbbbbbbbbbbbbbbbcccccbbbbbbbccbbbbbbbbb",
    "........................ddbbbbbbbbbbbbbbbbbbbccccccccccbbbcbbbbbbbbbbb",
    "........................cbbbbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbba",
    "........................cbbbbbbbbcbbccbbbbbcccccccccccbbbbbbbbbbbbbbbaa",
    "......................bbbbbbbbccccbcccccbbbbccccccbbccccbbbbbbbbbbbbbbbcc",
    "....................bbbbbbbbbcccbbcccccccbbbcccccbbccccccbbbbbbbbbbbbbbb",
    "..................bbbbbbbbbbbbbbbbccccddbbbccccbbbccccccbbbbbbbbbbbbbbbba",
    ".................bbbbbbbbbbbbbbbcccccccccccccccbcbbcccccbbbbbbbbbbbbbbaaabb",
    "..............bbbbbbbbbbbbbbbbbbbcccccccdcccccccccbbbbbbbbbbbbbbbbbbbaabaab",
    "..............bbbbbbbbbbbbbbbbbbppcccccddccdcccccccbbbbbbbbbbbbbbbbbbbbbbaa",
    ".........pb..bbbbbbbbbbbbbbbbbbppppbccccccddcccccccbbbbbbbbbbbbbbbbbbbbbbbbb",
    "........qpb..bbbbbbbbbbbbbbbbbbpppbbcccccdddddcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ".......qqpbbbbbbbbbcbbbbbbbbabbppqpbbcbcccdddddccbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ".......pqpbbbbbbbbccbbbbbbqaabppqqpbbbbccdddccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ".......pppbbbbbbbbcccbbbbqqabppqqqpbbbccccccccbccbbbbbbaabbbbbbbbbbbbbbbbbbbbb",
    "......0pbbbbbbbcbcccbbbbqqqabppqqqbbbbccccccccbbbbbbbbbaaababbbbbbbbdcccbbbbba",
    "......0bbbbbccccccccbbbbqqaabbpqqqbbbbbcccccccbbbbbbbbbaaaaabbbbbbbbdccccbbbbaa",
    ".......bbbccccccccccbbbbppaabppqqqabbbccccccccbbbbbbbbbbbbbaabbbbbbccdcccbbbaaa",
    ".......bbcccccccccccccbbbbaaappqqaabbccccccccbbbbbbbbbbbbbbabbbbbcccdddcccbbbbaa",
    "......bbccccccccddcccbbbbbaaapppqaabbccccccccbbbbbbbbbbbbbbbbbbbccddddcccbbbbbabb",
    ".....bbccbcccceeebcbbbbbbbaappppaabbbbccccccccbbbbbbbbbbbbbbbbbccddddccccbbbbbbabb",
    ".....bbbbbcccd00000bbbcbbbbppppaaabbbcccddccccbbbbbbbbbbbbbbbbccddddccccbbbbbbaabbppccc",
    ".....bbbbbbbbdbbERbbbcccbbbbb00aabbbbcccddccccbbbbbbbbbbbbbbbbccddddcccbbbbbbbbabbpccccc",
    "....bbccccbbbbbRRRbbcccccbbbb0aabbbbbccdddcbbcbbbbbaabbbaabbbbccddddcccbbbbbbbbabbppccqqpp",
    "...ccccccccbbbbbbbbcccccbbbbbbabbbbbcccdddccbbbbbbbbbbbbaabbbccdddccccbbbbbbbbaaabbbbbqqqqqc",
    "..ccccddccbbcbbbbbbddcccbbbbbbbbbbbbcccdddcccbbbbbbaabbbaabbbcdddccccbppbbbbbbaaabbbbbppqqqcc",
    ".cccdddccccccccccddcccbbbbbbccbbbbbbbcccddcbbbbbbb000bbbbbbbcddddccccbbbbbbbbbaabbbbbbbbbqqqqp",
    ".qqqqdccdddcccbcccbbbbbcccccccbabbbbbccccccpbbbbbbb00bbbbbabccdddccccbbbbbbbbbaa....bbbbbbqqqpp",
    "cqqqqccddddcccbbbcbbbbbccccbbbbabbbbbccccbbppbbbbbbbbbbbaaabcddddcccbbbbbbbbaaa.......bbbbqqqqp",
    "bqqqqpdddddcccbbbbbbbbbcccccbbbaabbbbcccccbbbbbbbb00bbbbaabbccddccdbbbbbbbbbaa...........bbqqqqc",
    "bpppppddddcccbbbbbbbbbccccbccb00aabbbbcbcccccbbbbbb0abbb00bbccddcddbbbbbbbbaaa............bbqqqc",
    "bbeeppdddccbbbb00bbbbbbcbcbbbbb00bbbbbbbbccccccbbbbbaaaa000bcccccccbbbbbbaa00a............bbppqc0",
    "bbeec000ccbbbb0000bbbbbbbbbbbaa0aabbbbbbbcccccccbbbb0000000bbcccccbbbbbbbba00a.............bbpqcp",
    ".beebb000000000000bbbbbbbbbbbaaaaabbbbbbbcccccbbbbbb0000000bbbbccbbbbbbbbba00bbb............bpqqp0",
    "..ebbbeppp00000aaabbbbbbbbbbbbaaaaabbbbbbbbccbbbbbbb0000000bbbbccbbbbbbbbaaaabbba...........bpqqcc",
    "...bbceddbppppbbabbbbbbbbbbbaabbbaa00bbbbbbbbbbbbbbb0000...bbbbbbbbbbbbbbabbbbbba............cqqcc",
    "...cccc.ddbaaappbbbbbbbbaaaaabbbbbaa00bbbbbbccccbbbb0000...bbbbbbbbbbbbbbbbbbbbba............cqqca",
    "...cc....cbbbppbccbbb000aaaabbbbbbaa000bbcccccccbbbb000.....aabbbbbbbbbbbbbaabbb0............pqqca",
    "..........bbpppbcbbb0000000bbbabbbbaa00ccqqcccccbbbb00aa.....bbaabbbbbbbaaaaabb..............pqqbb",
    "..........bpppbbcbb000000000bbaabbaaa00ccqqcccbbbbba0aaab.....bbabbbba0000aabbb.............ccqqbb",
    "..........bpppppcb00aa00000...aa.baaa00cqqccccbbbbbaaaaab...........aa..aaabbbb.............cqqqbb",
    ".........cbbddppba0aaaaaa00.........aqqqqcccbbbbbabaaaabb...............abbbbb..............qqqbbb",
    ".........ccddcccbaaaaaaaa............qqqqccbbbbaaabbbbab...............bbbbpbb.............pqqqbb",
    ".........bbbcccbbabaaaaa............qqqqccbbbbbbbbbbbb................bbbcbpp.............ccqqbb",
    "..........bbbbbbbbbbaa.............qqqqqcbbbbbbbbbb..................bbbcccpb............qqqccbb",
    "..........bbbbbbbaa...............qqqqqqbbb.....................bbbbbbbppccpb...........qqqqbbb",
    "..........bbbbbbbb...............qqqqqccbb.....................bbbbbbppppqcbb.........qqqqqbbb",
    "........bbbbbbbbb...............qqqqqccbb.....................bbbbbccpbbqqbb........qqqqqbbb",
    "...bbbbbbbbbbbbbb..............qqqqqqcbbb.....................bbbbcbbbabcbb.......qqqqppbbb",
    "..cbbbbbbbcbbbbb............bbbqqqqqqqbbb........................ccbbbabcbb.....qqqqqqbbbb",
    "..cbccbbcccbbcbb.........cccbqqqqqqpqqb................................cc....qqqqppbbbb",
    "...ccbbbcbbbbcb.........ccccqqqppqqpqqb....................................qqqqqbbbb",
    "...cc..bbb..............cbbcqqbpqqbbqpp...................................qqqqbbb",
    ".........................bbcbbbcccbbccb.................................cqqqbb",
    ".........................ccbbbbccbbbbcb................................pppb",
    ".........................cc....cbb....................................ppp",
    ".....................................................................ppp",
    ".....................................................................pp"
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
    waist: 44,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the tip of the tail flicks.
    twitch: {
      frames: [9],
      patches: [
        { x: 88, y: 45, rows: ["......c.q.a", "....._p.qca", "....._p.qbb", ".....cc.q.b", "...._...q.b", "...._.....b", "....p..q", "...cc", "..qq.cc.b", "....qb", "_", "_.b.._", "_", "_", "__"] }
      ]
    }
  }
};
