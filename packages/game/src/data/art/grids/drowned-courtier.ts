import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Drowned Courtier (BIBLE 8.4): still bowing to the Baron, still wet. A courtier of the
 * drowned estate caught in the deepest of court bows, in three-quarter view: the near leg
 * slid forward on a pointed, buckled shoe, the far knee bent under him, silk stockings gone
 * grey and muddy with the water. His back is bowed long and low under a short velvet cape
 * so heavy with water that it hangs in thick folds, the moon wet along their ridges, beads
 * of it under the tongues of the hem; weeds trail from his shoulders. The far hand is
 * flung up behind in the flourish, fingers spread; the near hand holds his plumed hat out
 * to the company, the ostrich plume drowned and hanging to the mud. Over a sodden, sagging
 * lace ruff the bloated green face is lifted to the company: swollen lids, a bulb of a
 * nose, the mouth hanging open on a few teeth, two pale eyes staring.
 */
export const DROWNED_COURTIER: CreatureGrid = {
  rows: [
    "....................................................................................o...n",
    "....................................................................................oo.ob...p",
    ".....................................................................................o.ob",
    ".....................................................................................ooo",
    ".....................................................................................ooooo",
    ".....................................................................................ooooo",
    "..................................................................................hhhhoooop",
    ".................................................................................lhhhhhoo",
    ".................................................................................lhhhhhh",
    "...............................................................................hhhhhhhhh",
    "..............................................................................hchhhhhhhh",
    "................................nnnnnoo.....................................hhcaahhhhhhh",
    "..............................ooonxnnooo..................................hhccaa0bhhhhh",
    "...........................ppoonnnxnnnooo................................hccaaaa0bbhh",
    "..........................oooooonnx00ooooo.............................hhcaaaaa00b",
    ".........................poooooonooo0ooxxo...........................hhccaaaa0000",
    ".........................poopooooooooooxnoo........................hhccaaaaa0000",
    "........................oooppooooooooooxnoo.......................hccaaaaaa0000",
    "........................ooppppoooooooooxnno......................hcbbaaaaaa00",
    "........................ppPPppooooppoooonnon...................hhccbbbaaaaaa",
    ".......................ppPpppoo0ooppooonnxonx.................hccccbbbb0baa",
    ".......................pppoo000000oo0ooonxonx.............hhhhccccccbbbbbbb",
    ".......................ppo0pppo0o0ppo0onnxnnn..........hhhccocccccccbbbbbb",
    ".......................po0xEEx0po0xEx0onnxnnn......oohhcccccoccccccccbbbbb",
    ".......................po00pp00pPo0pp0onnxnnn....hhoocccaccccpcccccccpbb0chhh",
    ".......................Ppo0nn0opPoo0nn0onxx0ah..hccccccbbbbbcocccccccobbacccch",
    ".......................PPpoooopPPpooooo0xx000chhcbaccccbbbbbbpcccccccobbacccoch",
    ".......................PpppopoPPPppopoo0xx000bccbbaccccbbbbbbobbccccccpbaaccpbchh",
    ".......................pPppoo0pPxxpooooo0x0onncbbbcaccbbbbbbbobbbccccbobbaccbobcch",
    ".......................ppppoon0000opppoo0xxoncccccccccbbbbbbpbbbbbcccbbbb0ccbobbbch",
    ".......................opppooooppppppooo00xnncccccbbbcbbbbbbobbbbbbccbbbbbcbboba0bch",
    ".......................opp00xxxxxxx00oo000xnnch0cccccccbbbbbpbbbbbbccbbbbbbbboaaaaach",
    "...................lll.op0xlxhlxxlxxx0on00hhhhh0hccccccbbba0bobbbbbcccbbbbbbbpaaaaaac",
    ".................llhhh.on0xhxxhxxxxxx0nn0x0000000xabbacbbbaa0pbbbbbbccbbbbbbobaaaaaa0h",
    "................lhhh00.on0xxx0000xxx0onn0hllhh0h0caba0bbbbaaaobbbbbbbbbba0bboaaaaaaa0ch",
    "................h000l...on0xx0nn00xx0nn0cccna0hh0x0babbbbbaaoabbbbbbbbbaa0bbaaaaaaa000c",
    "...............lllhhhl0.oop0xxxxxx0pon0x000000x00x0baa0bbbaapaabbbabbbbaa0bbaaaaaa0000aa",
    "...............hhh000lh.xooppPppppoonn0hllhh0hhh0x.aaaa0bbaaaaaaaaaabbaaaabaaaaaa0000aaa",
    "...............0000lhl00x.nooooooonn0x0hhhhh0hh0x.aaaaa0bbaaaaaaaaaaaaaaaaaaaaaaa0000aaa",
    "................lllh0lh00x0xnnnnn00x0x000000x00x..xaaaaa0baaaaaaaaaaaaaaaaaaaaaaa000aaa0",
    "....................lh0hlh000x00x000xlh0hlh0h0xh0xxhaaaaaaaaaaaaaaaaaaaaaaaaa00000000a00",
    ".......P..P.........lh0hlh0h0xh0xh00xlh0hlh0h0xh0xx0aaaaaaaaaaaaaaaaaaaaaaa0000000000000",
    ".....P.PP.PP.P......lh0hlh0lh0lh0hlh0lh0hlh0h0xh0xxxxaaaaaaaaa00aaaaaaaaa0a0000000000000",
    "....PPlPPPlPPP.P....hl0hlh0lh0lh0hlh0lh0hlh0h0x.h.xaaaa000aaa0000000aaa00aa000a0000000000",
    "...PPlPPlPPlPPlP.....h.hlh0hl0lh0hlh0hl0.hh..h....xa0aa000aa00000000aaa00aa00xaa0000000000",
    "..P.PlPPPPPPlPPl.......hlh0.h.hl0.hh..h............a0aa0000000000000aaa000a0xxa000000000000",
    ".PPlPPPlllPPPlPP........hh.....h....nxn0nh00nxxx0000aax0000000000x00aaa0000xx0a000000000000",
    ".PlPPl.hlhlPPlPPl...................haanaaa0xx00000aaxx0000000000x00aaa0000xxax000000000000",
    "PPlPl...h.h.lPPlP..llll.............aaaaaaa00..00000xxa000000000xxx0aaa00axx0a0000000000000x",
    ".PlPl.......hlPPlllhcbbhh..........ccaccaaa00...0000xxa00000000xx0xxaa00axxx0000000000000x00",
    "PlPll........hPllhcccbbbba........cccaccaa00.....00xxxxxx00x000xx00xxxxxxxxx0000000000aaxx0",
    ".PlPl.........lPlcccbbbbaa.......lccaaaaaa0.......hhxxxxx00xx0xxx0xxxxxxxa000000000000aaxx0",
    "PlPlh..........lhcccbbbbaaa......llllaaaa...........xxxxxxxxxxxxxxxxxxxxx00000000aa00xaaxx0",
    ".llPl..........lccccbbbaaaa......xlhhh00..............xxxxxxxxxxxxxxxxx0000000000aa0xxaaxxx",
    "Pl.lh..........lcccbbbbaaa0......0xhhhx................hhxxxx0xxxxxxxx000000aa000aa0xxa0x00",
    ".l.l.h.........000ll000xxxxaa.aa0Pppo0....................xxx0xxxxxxxxaaaaaaaaa00x000xxxaa0",
    "l..o.l......hhh000ll000xxxx0aa0Pooooo................................ccaaaaaaaa00x000xxaa00",
    "o..l..o...hhhaacccbbbbaaa000000Pooooo................................cccabbaaa0..xxaaaaaa0",
    "...o......hhbaaccbbbbaaaa00000nn0pooo................................cccabaaa00...aaaaaaa0",
    "l.........hhbbxxxbbbbaaa0xxx00000pooox..............................cccbabbaa0...aaaaaaa00",
    "..........lllbbbbbbaaaaaaaaa00000p00ox..............................ccbbbaaa0....aaaaaaa00",
    "............llllbbbaaaaaaaaalhxxxnxxx..............................cccbbaa000....aaaaaaa0",
    "...............llllllllllllll.....h................................cccbbaaa0.....aaaaaa00",
    "...................................................................cccaaaa00.....aaaaaa00",
    "..................................................................cccaaaa00......aaaaaa0",
    "..................................................................ccbaaa000.....aabaaaa0",
    ".................................................................ccbbbba00......aabaaaa0",
    ".................................................................cchhbaa0.......baaaaa0",
    ".................................................................hhhhhaa0.......baaaaa0",
    "................................................................llhhhha0........hhhha00",
    "...............................................................cccchhha0........hhhha00",
    "...............................................................ccccccccc.......hhhhaabb",
    "...............................................................hbbbbbbccb......bbaaaaaa",
    "...............................................................lhhhhaaccb......aaaaaaaa",
    "..............................................................llhhhhhaa.c.......hhhhhan",
    "..............................................................hhhhhhnna.c.......hhhhhan",
    ".............................................................hhhhhhhn...x.......hhhhhhn",
    ".............................................................hhhhhhhn............hhhhhn",
    ".............................................................hhhhhhh.............hhhhnn",
    "............................................................hhhhhhhn.............hhhnnn",
    "............................................................hhhhhnn..............hhhhnn",
    "............................................................hhhhhn................haann",
    "............................................................hhhhnn................haann",
    "...........................................................hhhhhn.................hhann",
    "...........................................................hhhnnn.................hhhan",
    "...........................................................hhnnn...................hhan",
    "..........................................................hhnnn....................hhnn",
    "..........................................................hnnnn....................hhnn",
    "..........................................................nnnn......................nnn",
    ".........................................................nnnn.......................nnn",
    "........................................................ccccn.......................nnna",
    ".......................................................hhhhbb......................bbhhh",
    "......................................................chhhhbba....................aaahhha",
    "...................................................cccchhhhbba...................baaahhhaa",
    ".................................................ccccbbbbbbbba..................bbaaaaaaaabbb",
    "...............................................ccaaabbbabbbbaa..................baaaaaaaaaaaaaa",
    "...............................................aaaaaaaaaaaaaaa..................a00000000000000"
  ],
  legend: {
    "0": { m: "velvet", step: 0 },
    E: { pal: C.moon, glow: true },
    P: { m: "ruff", step: 3 },
    a: { m: "velvet", step: 1 },
    b: { m: "velvet", step: 2 },
    c: { m: "velvet", step: 3 },
    h: { m: "ruff", step: 1 },
    l: { m: "ruff", step: 2 },
    n: { m: "skin", step: 1 },
    o: { m: "skin", step: 2 },
    p: { m: "skin", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // A drowned breath: water rattles in, the bowed back lifts, and slowly settles.
    waist: 56,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, water spills over his slack lip and runs down his chin.
    twitch: {
      frames: [10],
      patches: [
        { x: 31, y: 36, rows: ["l", "l", "h"] }
      ]
    }
  }
};
