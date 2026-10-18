import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Mire Heron (BIBLE 8.4): it waits on one leg for fish that are only memories; it has
 * never been hungry. A gaunt grey heron standing on one bare leg in a mound of mud, the
 * other folded under it with the claws hanging. Its neck is far too long, coiled in an S
 * to strike, shaggy plumes hanging from the breast; the feathers have rotted off one side
 * and the ribs show over darkness, the primaries hang in tatters. Its beak is a long
 * rusted blade, notched, the edge still bright, and one eye burns the mire's green in the
 * black mask of its face.
 */
export const MIRE_HERON: CreatureGrid = {
  rows: [
    "...........................c",
    "........................cccc",
    "...................ccccccccllcc",
    "..................cccddddccccbb",
    ".................ccddddddcccccll",
    ".................cdddddcccccccll",
    "................cddddcccbccccclbb",
    "...............ccdddfeebcddccccbcc",
    "...............bcdcfEEbdddccccclb",
    "...............kccefgfccdddclcclb",
    "...............ieeeeeecdddcblcclb",
    "..............iihkkecdddcbkbcdclb",
    ".............ihiiihcddcbakkldccbc",
    "............ihiiiiicccb.bblddccb",
    "...........iiiiiiihc...bbcdddclb.....c.bb",
    "..........iiiiiihh.....ccddddclc....bbbbbblbbb",
    ".........iiiiiih......ccddddcbb...bbbbccccllllbb",
    "........iiiiiii......ccddddccbb..abbccccccccccbbb",
    ".......iiihii........cddddcccb..aaacccddddcccccllbc",
    "......iiihhh........cdddddclb...aacccddcccdddcccccbb",
    ".....iihhhh.........cdddddclb..ajaccddccbjecdccccclll",
    "....iihhh...........cddddcclb..jjcccdbddccbbhcbcccllll",
    "...iihhh...........cccdddcclb..aacccccddcccbbiicdcclllb",
    "..iihh.............ccdddddccbbbkcccdccdcdcccbbhcccccllbb",
    ".iihh..............ccdcdddcccbbcccdcccddccccbbeecjcccllb",
    ".ih................ccccdddccccccdcccbcccccccccbajjcjclllb",
    ".h..................cccdddcccccccccchccdcdccccccbjjjkcllbb",
    "....................cccddccccccccccccbccdcccccccbbjjbclllb",
    "....................bccddcddccccdcclhbcdccccccbccbbjabcblbb",
    "....................kcccddcdccccccclhkcccccccccllcllajcbblb",
    "....................bccccdcdcccllcbbhjcccccccccchclllacbblbb",
    ".....................cccccccccccllbhiiccccccccccbcllcakcbbkk",
    ".....................cbbcccccccllbahhejcccccccccckllbbbcbbaak",
    ".....................cbbcbbccccllbahiihcccllcccccccbblbbbbaak",
    ".....................babbbbccccclbbhhiiacbllllclccclllbbbbkkab",
    ".....................babbkkccccclllhiihhllclllllclcllcllbbbajb",
    "......................bbbkaacclllllahhijjlcclblllllllclljjbajaa",
    "......................bbbaaallllllakjhhjjbbclbbbbbllllllhjaaaaa",
    "......................cbbbajlllllbakjjjjiabllbbbbbllllllhhaaaa",
    "........................cbbjlalllbajjjjhiijjlbbbbbbaabllhhbala",
    "........................cbbjljalaaajjjjhddljjjkbbbbblblbjhbbbbk",
    ".........................bbbljalaabbhjjhidijjjkabbbblblljbbaabk",
    "..........................c.baalbabbhajjcdiihjjajjbbbbblbbaaaabb",
    "............................bbabbcbb.aajjiiihhjejjabkbklbbblajbb",
    "............................b.cb.bbc.ahajiiihhjejeaakkkbbbblljaa",
    "...............................b.bc...hajhiihhcejeeaaaaababblaaa",
    ".......................................jeehhha..jjjeaaaaaabblajjb",
    "........................................jjhhh....eeeeaaaaabblaabb",
    "........................................jjhih.....eeeeaaajjbbbaa",
    "........................................ajjihh.....ffeeeajjaabba",
    ".........................................ajhhb........eeaajjabba",
    ".........................................ajjhb...........aajjbba",
    ".........................................jjiihh..........aajjjba",
    ".........................................ajhijh...........ajjjaa",
    ".........................................ajhja.............acja",
    ".........................................ajijj",
    ".........................................jajj",
    ".........................................hiba",
    ".........................................hha",
    ".........................................iaa",
    "........................................hia",
    "........................................iaa",
    "........................................ia",
    ".......................................hha",
    ".......................................ih",
    ".......................................aa....ff.ffe",
    "......................................ia...hheeefee",
    "..............................ggff....ij..ffeeeeejjeeee",
    ".........................hhhhhhfffeejhjjeeeeeejjjjeeeeeej",
    "........................hhhjjjaaaeeehiajeeeeeeeeefeeeeejjeee",
    "......................ffheeeefeeeeeehhaeeeeeeefffffffeeeeeejjjje",
    "....................fggeeeeeffffffaabaaaeeeeeggfefeeeeeeeeejjeeee",
    ".................fffefeeeeeeggggfaaabeeggggfefffeeeeeeeeeeeejjeejee",
    "...............ggffeeffffghhgffaaaaaeggggggfeeefggfeffeeeegeeejjjejjf",
    "................hffeffeefgggehfaaaafggfffffeeefgggfeeeeeeeeffeeeeefff",
    "................hggfffeeeeeeeeeeeefgggeeeefeefffgejjeeeefffeefffffff",
    "...............gggggfgffeeeeeeeeeffgeeeeeeeeefeeeeeeffffffffffff",
    "................gggggggggggeeefffffeeegffffggggffffffffffff",
    "......................ggggggggggggggggggghfgggggggfffffff",
    "...........................gg..ggggggg.gghh....gggff"
  ],
  legend: {
    E: { pal: C.mireLight, glow: true },
    a: { m: "feather", step: 0 },
    b: { m: "feather", step: 1 },
    c: { m: "feather", step: 2 },
    d: { m: "feather", step: 3 },
    e: { m: "mud", step: 0 },
    f: { m: "mud", step: 2 },
    g: { m: "mud", step: 3 },
    h: { m: "rust", step: 0 },
    i: { m: "rust", step: 1 },
    j: { m: "shadow", step: 0 },
    k: { m: "shadow", step: 2 },
    l: { m: "shadow", step: 4 }
  },
  idle: {
    // A still bird's breath: long unmoving beats, then the ragged body lifts once.
    waist: 49,
    breath: [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the coiled neck feints a strike.
    twitch: {
      frames: [7],
      patches: [
        { x: -1, y: 0, rows: ["...........................c_", "........................c..._", "...................c.......l.c._", "..................c..d...c...b._", ".................c.d.....c....l._", ".................cd....c......l._", "................cd...c..bc....lb._", "...............c.d..fe.bcd.c...bc._", "...............bcdcfE.bd..c....lb_", "...............kc.efgfc.d..clc.lb_", "...............ie.....cd..cblc.lb_", "..............i.hk.ecd..cbkbcdclb_", ".............ihi..hcd.cbak.ldc.bc_", "............ihi....c..b_b.ld.c.b_", "...........i......hc_..b.cd..clb_....c_b_", "..........i.....h._....c.d...clc_...b..._", ".........i.....h_.....c.d...cb._..b...c._", "........i......_.....c.d...c.b._.ab.c..._", ".......i..hi._.......cd...c..b_.a..c..d._", "......i..h.._.......cd....clb_..a.c..d.c_", ".....i.h..._........cd....clb_.ajac.d.c._", "....i.h.._..........cd...c.lb_.j.c..dbd._", "...i.h.._..........c..d..c.lb_.a.c....d._", "..i.h._............c.d....c.b..kc..dc.dc_", ".i.h._.............c.dcd..c..b.c..dc..d._", ".ih_...............c...d..c.....dc..bc.._", ".h_.................c..d..c.........hc.d_", "....................c..d.c...........bc._", "....................bc.d.cd.c...dc.lhbcd_", "....................kc..d.cdc......lhkc._"] }
      ]
    }
  }
};
