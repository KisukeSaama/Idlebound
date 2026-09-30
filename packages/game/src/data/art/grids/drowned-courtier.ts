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
    ".....................................................................o..nn",
    ".....................................................................oo.o...p",
    "......................................................................ooo",
    "......................................................................oooo",
    "......................................................................oooo",
    "...................................................................hhhhooop",
    "...................................................................lhhhho",
    ".................................................................hhhhhhhh",
    "................................................................hchhhhhhh",
    "..........................nnnnno...............................hcaahhhhhh",
    "........................ooonxnnoo............................hhcaa0bhhhh",
    "......................ppoonnx0nooo.........................hhcaaaa0bhh",
    ".....................ooooonoo00oxxo......................hhcaaaa000",
    ".....................popooooooooxno....................hhccaaaa000",
    "....................ooppooooooooxnoo..................hccaaaaa000",
    "....................oppppoooooooxnno.................hcbbaaaaa0",
    "...................ppPppooooppooonxnx..............hcccbbbaaaa",
    "...................pppo00000ooooonxnx...........hhhcccccbbbbbb",
    "...................pp0ppp000pp0onnxnn........hhhcoccccccbbbbb",
    "...................po0EEx0o0xE0onnxnn.....oohccccocccccccbbbb",
    "...................po0pp00Po0pp0nnxnn...hhooccacccpccccccpb0chhh",
    "...................PpoooopPpoonooxx00chhcacccbbbbbpccccccobacccch",
    "...................PppopoPPppooo0xx00bccbacccbbbbbobbcccccpaaccpchh",
    "...................pPpoo0pxxpoooo0xonncbbcaccbbbbbobbbcccbobaccbbcch",
    "...................pppoon000oppoo0xonccccccccbbbbpbbbbbccbbb0ccbbbbch",
    "...................opp0xxoppppooo00xnccccbbbcbbbbbbbbbbccbbbbcbbba0ach",
    "................ll.op0lxhxxlxx0on00hhhh0cccccbbbabobbbbccbbbbbbbaaaaac",
    "..............llhh.onxhxxhxxxxxnn0x00000xabbcbbba0pbbbbbccbbbbboaaaaa0h",
    ".............lhh00.onxxx000xxxonn0hlhh0hcababbbbaaobbbbbbbba0bbaaaaaa0ch",
    ".............h00ll..o0xx0n00xxnn0ccna0hhx0babbbbaoabbbbbbbba0bbaaaaa000c",
    "............llh00l0.ooppPxppoon0xl0000h0x0aaa0bbaaaabbaabbaa0baaaaa0000aa",
    "............00000l00xnoooooonn00hhhh0hh0xaaaa0bbaaaaaaaaaaaaaaaaaaa000aaa",
    ".............lll0lh000xnnnn00x000000x00x.xaaaa0baaaaaaaaaaaaaaaaaaa00aaa0",
    "................lh0hl000x0x000lh0hl0h0xhxxhaaaaaaaaaaaaaaaaaaaa0000000a00",
    "......P.P.......lh0hl0h0xh0h00lh0hl0h0xhxx0aaaaaaaaaaaaaaaaaaa00000000000",
    "....PlPPlPPP....hl0hl0lh0l0hlh0h0hl0h0xhhxaaaa00aaa00000aaa0aa00000000000",
    "..PPlPPPPlPPP....h.hl0hl0l0hlh0l0.hh.h...xa0a000aa000000aaa0aa00aa00000000",
    "..PPlPPPPPlPl......hl0.h.h0.hh.h..........a0a00000000000aaa00a0xa0000000000",
    ".PlPPPllPPPlP.......h.........nn0nh0nxx0000ax00000000000aaa000xxa0000000000",
    "PPlPl.hhhPPPPl................aaaaa00x0000axx00000000xx0aaa000xax0000000000",
    "PPPl......lPPPlllllh.........caacaa00..0000xa0000000xxxxaa00axx0000000000000",
    "PlPl.......hPlhccbbbb.......ccaccaa00...00xxxxx00000xx0xxxxxxxx00000000aax0",
    ".PPl........Plccbbbbaa.....lccaaaaa......hhxxxx00x0xxxxxxxxxa0000000000aax0",
    "PlPh........lhccbbbbaa.....llllaaa.........xxxxxxxxxxxxxxxxx0000000aa0xaax0",
    "Plll........lcccbbbaaa.....xxhh00............xhxxxxxxxxxxx000000000a0xxaxxx",
    "Pllhh.......000lb00xxxaa.a0Pppox...............xxx0xxxxxxxaaaaaaa00x00xxxa0",
    "l.o.l.....hh000ll00xxx0aaPPoooo..........................ccaaaaaa00x00xxaa0",
    "o.l..o..hhhacccbbbaaa0000PPoooo..........................ccabbaa0..xaaaaa0",
    "........hhbaccbbbaaa00000n0pooo..........................ccabaa00..aaaaaa0",
    "l.......llbbbbbbaaaaaax0000p0oo.........................ccbbaaa0...aaaaaa0",
    "..........lllbbbaaaaaaalhxxnxxx........................cccbba000...aaaaaa0",
    "............llllllllllll....h..........................cccbaaa0....aaaaa0",
    ".......................................................cccaaa00....aaaaa0",
    "......................................................cccaaa00....aaaaaa0",
    "......................................................ccbba00.....aaaaaa0",
    "......................................................chhba0......baaaa0",
    "......................................................hhhha0......baaaa0",
    ".....................................................lhhhha.......hhha00",
    "....................................................cccchca.......hhha00",
    "....................................................hbbbbbcb.....bbaaaaa",
    "....................................................lhhhaacb.....aaaaaaa",
    "...................................................llhhhhaac......hhhhan",
    "...................................................hhhhhnn.c......hhhhan",
    "..................................................hhhhhhn.........hhhhhn",
    "..................................................hhhhhh...........hhhnn",
    "..................................................hhhhhn...........hhnnn",
    ".................................................hhhhnn............hhhnn",
    ".................................................hhhhn..............aann",
    ".................................................hhhhn..............hann",
    ".................................................hhnnn..............hhan",
    ".................................................hnnn...............hhan",
    "................................................hnnn................hhnn",
    "................................................nnnn.................hnn",
    "...............................................nnnn..................nnn",
    "..............................................cccn...................nnn",
    ".............................................hhhhb..................bbhhh",
    "............................................chhhhba................aaahhha",
    ".........................................ccccbhhbba...............bbaahhaabb",
    ".......................................ccaabbbbbbba...............baaaaaaaaaaa",
    ".......................................aaaaaaaaaaaa...............a00000000000"
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
    waist: 46,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, water spills over his slack lip and runs down his chin.
    twitch: {
      frames: [10],
      patches: [
        { x: 25, y: 30, rows: ["llx"] }
      ]
    }
  }
};
