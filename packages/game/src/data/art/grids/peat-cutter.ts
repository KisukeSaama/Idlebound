import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Peat Cutter (BIBLE 8.4): it cuts peat under the water now; the Baron's orders still
 * stand. A hulking worker made of one great mass of wet peat, hunched, the head sunk low
 * between the shoulders: the bog is laid down in him in layers that wrap his body, fibrous
 * and matted, and where a spade took a sod out of him the cut shows flat and pale, layered,
 * pierced by roots. Moss grows thick on the hump of his back, water runs down him in dark
 * streaks, roots hang from every seam, his jaw and his arms. He stands on two stumps rooted
 * into the mud and raises a heavy rusted spade high over his back in both fists, its blade
 * holed and its edge worn bright. A sodden cap slumps over his brow and under its dripping
 * peak two eyes burn like wet embers. A dead lantern hangs from the rope at his belt.
 */
export const PEAT_CUTTER: CreatureGrid = {
  rows: [
    "..................................cckk",
    ".................................jjjkckk",
    "................................jjjjcckkk",
    ".................k.............kjjjjjkkkk",
    "................llk..........kkkkkjjkkkkk",
    "...............kkllk........kkkkkkjjlkkkk",
    "..............kkllllk......kkkkkkkjjcckk",
    ".............cjjklllkk....lkjjkkkkjkkck",
    "............lllkkkllkkk...cckkkkccjclk",
    "...........lllllllllllcj..jckikkkkjck",
    "...........cclllllllccjjjccjiiklllkk",
    "............clllllllkjjjjljii..kllk",
    "............clllllllkkjjcjii.....l",
    "..............llllllkjjcjji",
    "...............lllkkkcllkd",
    "................llkjcljklj",
    ".................ljjcjddkkj",
    ".................kkkeeddiklj.....j",
    "................kkkii...ckjlk...gggge",
    "...............kkkii......kjiflgggggeeee",
    "..............kkiii.......ffffffffffjffeeee.e",
    ".............kkki.......gggkfffffkkfjgggeeeee",
    "............kkki.......ggggkkkkkkkkkjjffjeeeee",
    "........kkkkkij.....jfggfffkkkkkkkjjjffjjeeeeff",
    "......llkkikii......lggeekkggkkkkjjjgffjjeeeefffe",
    ".....cllkkkkj......lgjeeekkkkkkkkkggggfffggeeeffe",
    ".....lllkdkkj.....kkjjjjaakkkkkkkgggggfffjeeedeee",
    "....kllkddjjj...kkkeejeebadkkkkkggggggffjjjeddddee",
    "....kdkjdjljj..kkkbebbbbbddddkkkgggggfkjdjjjddddee",
    "....kkdddjjk...lkbbbccccdddddkkkkgggfjdkkjjjfdddee",
    "...kjjddjidd..kkcccccccbdddddekkkkkdjekklkkkffedeee",
    "..kkjddjjiie..kbccccccbddddddeekkeedjkklllkgjfeddeee",
    "ckkiijkiiije.kjbbccccbaadddddeefjjddiklggggkjjeedede",
    "jiii..jiiijiikjbbbcbbaadddddddefjkdjkklggggkkjedddde",
    ".ii...kjjjiieedaabbaaadddiidddefjddjklgggggkkjidddde",
    "......gjjjjiedddabaddddddiddiiejjeejkkkfffkkkkidddee",
    "......gkkljjeeedaaadddddjiiidiijeeeekkkkkjjkkiideedj",
    "......gkkljjjjbccbbbaadjjjjddiijeeejjkjjjjjjjddjjed",
    "......gkkljjjjccbcbbadjjkjjjddddffeddiiijiiddddjjee",
    "......kjkkjjjccbcbbbidkjkjkkdjjdfkedddddddieejjkkgee",
    "......kjkljdibbbbbdRRikkkkkddjjffeedddddjkkkkjjjggfe",
    ".......kklkdidbdddddikkkklkddjjkkkedddddjkklljjjjffee",
    ".......kkkkjddjiijjkkklklljddekkkkedddddjkklllkjjkfee",
    "........jjjjddclllllllkkljdddkkkkeeddddddjkkkkikkkfeii",
    "........kjjidiclkllllkkkkdddekkkffeeedddddddiiikkkfehj",
    ".........ciiiiclllllkklkdddeekkkkedeeeddddddddkllkkdjj",
    "..............jjjjjkkllkdddeekkkkeddeddddddddjkllkedj",
    "..............jjjcjeklkdddeeeekddddddddddddddgllkjedd",
    "...............j..clkeejdddeedddddddddddddddggglkjidj",
    "...................kkkeedddddddddddjddddddddfkkkkjijj",
    "....................lkeejdiijddjjdiiddddddddfkkkjjdj",
    "...................klkjiddddjjjjdjdddddffeeeekkkkjjj",
    "...................kkjjidjddddjjdddddfgffeeeekkkkdjd",
    "..................kkkddddjdddjdddddddggjjjeeekkkjjd",
    ".................jjkdddddjdddddfddddffjjjjdeekkjjjd",
    "................clgeeddddddddfffjjddjjkkkfeekkljjjd",
    "................fgedddddddeeeffejkddjkkggfeeklkkjjd",
    "................ffeedddidddeeefejkdejkgggfklllkjjdd",
    "................kjjjjjiiccddfffejjdejkgfgkllllkjjddd",
    "...............lkkjjkjjijcdddeeedddjjkjjjlkklkkjjdddd",
    "..............clkkkjkkeikcdddddddddfjjjkkldklkjjj.dddd",
    "..............ckkkkjjjeijeeddddddddfjjjkkkdklkjjj.eeddj",
    "...............kkffdjeeclckdddcdjcdjjjjkljdkkkcjj...ddd",
    "...............keeejjeeclllc.d.....djjjjjddkjjjjd....dd",
    "................fddjkfeeklliii.....ddjeejjjkiidjdd",
    "................fedjkfeiiiiii.......deedddjiiidded",
    "................eeedjeedikii........eeedddddddddedd",
    "..................edddedddi..........feeedddddddjee",
    "...................jdidddhe..........feeeedddddde.e",
    "....................iijddhej.........jceeeeedddde",
    "...................jjjjjihdj............eeiedddde",
    "...................cjjjjidddj.............iidddeee",
    "..................kjjjjjiddjd.............ddjjdihh",
    ".................cjjjjjdjddkd.............iijjjihee",
    "..............kkkjjjjiddjdddddj..kk..kk...jjkkeedje",
    "............jcjkiijjjidddjdddddjjkkkkkkkkjjjkjkeddij",
    "..........jjjjjddikiddddddddddjjjkkkkjkkkjjjjjkddddjjjll",
    ".........jjjjjjjjjjdddjjjjiijjkkkjjjjjjjjjjjjjkjdddiiiklll",
    ".............jjjdjjjjjjkkkkkkjjkkkjjjjjjjjjjdjkjddddddddjl",
    ".............jjc..............lkkljjeejjjjjdddjjddddddiiii",
    "...................................jjjjjjjddddijdddjjjjj",
    "....................................jjjjdddjjdijjdjjj",
    "....................................jiijj..j.kkjjj",
    "...............................................ljj"
  ],
  legend: {
    R: { pal: C.ember, glow: true },
    a: { m: "cap", step: 2 },
    b: { m: "cap", step: 3 },
    c: { m: "iron", step: 1 },
    d: { m: "moss", step: 0 },
    e: { m: "moss", step: 1 },
    f: { m: "moss", step: 2 },
    g: { m: "moss", step: 3 },
    h: { m: "peat", step: 0 },
    i: { m: "peat", step: 1 },
    j: { m: "peat", step: 2 },
    k: { m: "peat", step: 3 },
    l: { m: "peat", step: 4 }
  },
  idle: {
    // A heavy, wet breath: the whole mass of him heaves once and settles.
    waist: 53,
    breath: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the spade rises for the cut.
    twitch: {
      frames: [8],
      patches: [
        { x: 0, y: -1, rows: ["..................................cckk", ".................................jjj.ckk", "................................j...c...k", ".................k.............k....jk", "................llk..........kk.kk..k", "...............kk.lk........k.......l", "..............k.l..lk......k........cc.._", ".............cjjk....k....l.jj.....kk.._", "............lllk.k....k...cckk..cc.clk_", "...........l...lll..llcj..j..i..kk..k_", "...........cc.......ccj.jccji..lllkk_", "..........._........kj...lji.__k..._", ".....................k..cji._..__._", "............__.......j.cj.._....._", ".............._...kk.cllkd_", "..............._...jcljklj", "................_.j..jddkkj", ".................kkkee..i.lj.....j", "................k..ii___c.jlk...gggge", "...............k..i._...__kjiflg.....eee", "..............k.ii._......fff.ffffffjff.eee.e", ".............k...__.....gggk.....kk..ggg...e", ".............____......._____________________"] }
      ]
    }
  }
};
