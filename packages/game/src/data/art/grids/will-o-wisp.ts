import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Will-o'-Wisp (BIBLE 8.4): a lantern with no one holding it, looking for someone to
 * follow it. A rusted iron lantern hanging from nothing, the last link of its chain broken
 * open; inside, a cold flame of mire light with a face in it, hollow eyes and a long open
 * mouth, turned to the company. Its light trails behind it in wisps, the way it came.
 */
export const WILL_O_WISP: CreatureGrid = {
  rows: [
    "..................iii",
    ".................hiiii",
    "................haa.iii",
    "................ha...if",
    "...............haa...ifb",
    "...............hha...iib",
    "................ha...ii",
    "................aaiiiii",
    "................gffiiaa",
    ".................gggga",
    ".................gggg",
    "................ffffff",
    "...............jafffffa",
    "...............ja....aa",
    "...............ja....ha",
    "...............aa.f..ha",
    "...............fffgggga",
    "................igggaa",
    "................iiiia",
    "...............jiiiiiga",
    "............jjjjkjihggaaaj",
    "............jjjjkjhhggaaabb",
    "...........jhhjjkhhhigaaabj...............e",
    "...........jhhhklhhhigaaaaj..............ed",
    "...........jhihkkhhhiaaaaaj............eed",
    "........fijjhihkkhhggaaaaaaa.fa.......dd",
    "........iiijhijhhgggggaaaaaaajb.ee...e",
    "........hkhhiijhkhhhgifaaaaaaff.e...ee",
    ".......hhhhiiijjjhhhgiffaaaaafaee...e",
    ".......hhhiiiiijjahhiiffaaaaafade...e",
    ".......hhhaiiaaaaaaaaaaaaaaaaaade...ee",
    ".......hhaaaaaaaaaabaaaaaaaaaaac....ee",
    "......hhib.....aaabbabjj....aaab....ee",
    "......hhib.....kbbbbbbj.....aaab....e",
    "......bhbb....kkjjjjjjjk...ebbaa...ee",
    "......bbbb....kkkjjjjjjk..eecbaa..ee.....ee",
    "......jjc....kkkkkjdjjjk.eeecbaa.ee.....ee",
    ".....jjjc....dddlkdcddkk..l..caajed....ee",
    ".....jhjc....ccdddcdcdkjj.ll.ccajed...ee",
    ".....hhcc....cEbdkkEdjccc....ccaaed..ee",
    "..iiigicc...kkcdlkkkkddcc....ccaad...ee",
    ".dc..gicc...kddddddddeddcl...ccbac...ee",
    ".d..ggic.....dddddddedcd.l..ddcba....eee",
    "....hhjc......ddddddddj.l..edccbaj....ee",
    "....bhjc......dcjbddddjklleeelccaa.....e",
    "....bhcc......daaaadddccldedeldcaa....ee",
    "....hhdc....d.laiiidddcddeede.dcaa....ee",
    "...jhhdc...edllacccdddddeeed..dcaa...e",
    "...jhhd....elldbcccddeeeeeed..cdaaa.e",
    "...hhcdj..eedddddddddeeeeeed..cdaaj.e",
    "..lhhdd..cdededdddedeeeeeeed...dcaaee",
    "...hhdc...ceedededeeeeeeeed....ddaae",
    "...hhcc...ddeeeeeeeeeeeeeed...cccaa",
    "...iiccc..edeeeEEEeeeeeeeed...ccaaa",
    "...iigccc..jdeeeEe..eeeeed...bbaaa",
    "....gaacccjjjddedd.klcddcaaaaaaaaa",
    ".....aaaaiaaggjjkkkccjaaaaaaaaaaa",
    "......aaaafagaaaaaaaacacajaaaaaa",
    "........aaffigggaaaaaaaaaaaaaaa",
    "........jiiiiiiiiiiibbbbbaaaaa",
    ".......jjiijjjjiijicccccccjbbb",
    ".......jjijjhhkkkjjijjjcaaaabbj",
    ".......jihjihhkkhjjiigggaaaaabj",
    "......jiihjihkkkhhjjigbaaaaabbbb",
    ".....jjiiiihhkkkhhhjigbggaaaajbb",
    ".....jhhiiihhkhhhhijigifafaaajjbb",
    ".....jhiiihhhhhhhhiiggifafaaaaabb",
    ".....jiiiiiigggihhgiggffaafffaaab",
    "........iiihhgiihhgiiiifaaffaaa",
    ".............iiihhaaaiaaaaa",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
  legend: {
    E: { pal: C.mireLight, glow: true, light: true },
    a: { m: "flame", step: 0 },
    b: { m: "flame", step: 1 },
    c: { m: "flame", step: 2 },
    d: { m: "flame", step: 3 },
    e: { m: "flame", step: 4 },
    f: { m: "iron", step: 0 },
    g: { m: "iron", step: 2 },
    h: { m: "iron", step: 3 },
    i: { m: "rust", step: 1 },
    j: { m: "rust", step: 2 },
    k: { m: "rust", step: 3 },
    l: { m: "rust", step: 4 }
  },
  idle: {
    // No breath: the lantern bobs on the air, up and down.
    waist: 40,
    breath: [0, 0, 1, 1, 2, 2, 1, 1, 0, 0],
    // Once in a cycle, the trailing wisps curl away, the way it came.
    twitch: {
      frames: [6],
      patches: [
        { x: 30, y: 14, rows: ["", "", "", "", "", "", "", ".............e", ".............d", "..........e", ".a.......dd_", "_b.ee...e_", "_f_.....e", "_a.e.._", "_ade.._e", "_ade.._ee", "_ac..._.e", "_ab..._.e", "_ab..._", "_aa....e", "_.a.........ee", "_.a", "_.aj.d", "_cajed", "_caaed", "_c.a..._.e", "_cbac.._.e", "_cba..._.ee", "_cbaj..__.e", "_ccaa...__e", "_dc.a.....e", "_dc.a..._.e", "_dc.a...._", "_.d.aa", "_cd..j_e", "__dcaa.e", "._dd.a", "._____"] }
      ]
    }
  }
};
