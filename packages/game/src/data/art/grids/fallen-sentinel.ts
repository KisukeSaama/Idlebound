import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Fallen Sentinel (BIBLE 8.5): one of Kaelen's brothers-in-arms, dead in his armor and
 * still at his post. A pointed helm with a beaked visor, violet light in the slit and
 * nothing in the gorget; a surcoat of the royal color torn below the knee, its crown gone
 * pale; a dented kite shield with a spear-hole through it, and the spear leveled over it
 * at the company.
 */
export const FALLEN_SENTINEL: CreatureGrid = {
  rows: [
    "",
    "............................................ee",
    "...........................................eee",
    ".........................................fdde",
    "........................................fldde",
    ".......................................fdddee",
    ".....................................lfdeede",
    "....................................ffddeede",
    "ll.................................ffeeeedee",
    "llffl.............................ffeeeeedee",
    ".lbelffl.........................ffllellede",
    ".llelllfff......................ffdllllleee",
    "..lellllccf.....................feeffffeeee",
    "..lleellcchhc..................ffjffffleeel",
    "...ceeelcchhhf.................fekffffleeel",
    "...cceeecchhhhfl..............febbfffllldde",
    "....ceeedlhhhhhl..............fgghfffflbddeeee",
    ".....eeelbhhhhhh...............hhhhhhhhcddeiie.....ee",
    ".....cccclbhhhhh...............hhhhhhEEckjeiieee.eeee",
    "......cchccbchhhb..............hhhhEEhhbdeeeijjeedjjeeee",
    ".......hhcccbbccb...........fllfhhhhhhbbeeddjjjeedddddee",
    "........hccccbblld.........ffleecfllllbbeedjeddfeeelldeel...ee",
    ".........cccccbjlee.......ffdddilfllldibleeeedfeellfffddll.eeee",
    ".........cc...bjjeele....ffjjddielllddiileeeedflllffffldelleeeee",
    "................eejlee..ffjjjidiellddiiilldddleelffffflljlleddeee",
    ".................ejjldd.fjjjjieiilliiiiildddjleellffflldflledddeee",
    "..................ejddllljjjjiiiiliiiiildddldleeeleelllffllddddeeee",
    "....................jdjlljjjjdiiiiiiiieeddlbllfeeeeeeefffljddddjjeel",
    "......................jjdlejjdiiiiiiiieiihhglllfeeeeeffffdeddddjjeel",
    ".......................ldjlljjjjibiaaljjghhllllielleefffeeeddddkkjeel",
    ".......................fljjbeejggbaacjjghglfediiiiiifffeeeeeedddjjjell",
    ".......................feiiiielggghghhghglffflijjjiffflllleeeddddjjiel",
    "......................ffjjjiiijlgghhhhhglffffliiiieffflllllleedddjjiell",
    ".......................liiiiiijjelghhhhgllllliiiiiffflfllllleeeddjjjjel",
    ".......................lliijiejjjklbhhhheeeeiiiiidfffefflllleeeddedjjell",
    "......................leeijjiejjgaablghheeejiijiidffflfflllleeeededjjjll",
    ".....................lliiijiiiejghhgklegggjjjjjiiffflffflfleeeeededjjjll",
    "....................fldiiiiiibeeaghhgaeegggjddjiiffflffffefeeeeeeeejjddll",
    "....................fjjleiiiid.eaagghggeeddaaaiifffeeffffelfleeeeeedddjel",
    "....................fjddeeiiid.caagggggjjddaaaifffllfffflldlfeeeeedddjjel",
    "....................fjeefiiiid.lbjggagggiiiiijffffdllflffldeefejddddedddll",
    "....................fdllejijj..lbjjaaaaaiiiiiefffdeelfllfleeeffeeeededdjll",
    "....................fddljjije..bbjjaadejjjjiiifffdellfllfllddeffeelddedjel",
    "...................flldjiiiee..fiiddidfljjiiiidfleellfflflldlllffelddeddel",
    "...................fedjjiibe...fiieiieiliiiiiddfffellffllllellffeeldeeeejle",
    "...................eddddjji....eiidiiiiiiiiiiidlffeeellllllelfljjeldeeeddle",
    "...................edddjjj....ljjidiiiiiiiiiiiiifffeellllleefdddjelkeeeeill",
    "...................fldddei...lljjjjiiiieijjjjiiilffeelelleeejdddedlbdeeejel",
    "...................fiiiiii...bjaajjjieeiijjjjiiiifffeeelleeejdddedeedeeedel",
    "...................iiiiiid..ejjjjjaaiiiiggaiiiiiilffeedeeeeeeeddedeeddeedel",
    "....................iiijjd.jbjjgjaagaagaggajaajjiiflldddeeeeeedddeeekkeedll",
    ".....................iijj..jgggggaagaggaggajgajjiieflldddeeeeeeddedekeeedll",
    "...........................lggggggaggggaggaaggjjjiilldddeeeeeeeeeddeeebedll",
    "..........................lgggghgggggggaggaggggjjjjdlllddeeeeeeeeddeebbedel",
    ".........................ccggghhggaggggaggaaggggjjjjllllddedeeeeeeddebbedel",
    ".........................cggghhgggaggggaggaagggggjjjjlllddddedeeeedddbbbdll",
    "........................ccgghhhgggagggggggagggggggjjjjllldddddeeeeeddbbbdll",
    "........................cgghhhhhhgagggggggagghhggggjjjllllddddeedeeddbbbell",
    ".......................ccgghgjjahgaghhgaghggghhhhgggjjjllledddddddeedbbkel",
    ".......................cbjjjjjgghgaghhgaghaggghhhhggajjaeeeedddddddedbbkel",
    ".......................bdddjjiigggaahhgaghagggghhgggajjaeeeeeddddddddbbdll",
    ".......................dddldiiigggaahhggghaagggghgjjiiiijeeeeeiddjdddbbdll",
    "........................djddiiihggaahhggghaagggghjjejiiiideeeeejjjdddddell",
    ".......................lejiiiiigggaaghggghaaggggiiijjjiiid.eeeeejjjddddel",
    "........................fjiiijjiggaaghggggajgggiiiiiijiiie..eeeeejjdjddee",
    "........................feiijjiiigaaghggggbjaggijjijiidde....eeeeeejjjdee",
    ".........................fijjjjijjaaghhgagbaaggijjjjjjdde......eeeeejdde",
    ".........................ljjjjiij.aaghgaag...b..ijjjjjjee.......eeeeedde",
    "..........................ejiiii....bbb..........ejjjjjje.........eeddde",
    "..........................ljiijd....bb.............jjjjje..........eddee",
    ".........................eejjjjd...................jjjjiie...........ee",
    ".........................fejjjjj...................jjiiiii",
    "........................fejjjjjje..................jjiijijj",
    ".......................fljjjjjjee..................ejiijijj",
    "....................eeeddjjjjijee..................jjjiiijjjj",
    "...................eejdddjijjiie....................jjjiiiijid",
    "..................eeiiddjjijj.......................jjjjiiijidd",
    "..................liiidiijii.........................jjjjdiiidi",
    ".....................edd.............................ddiidijj",
    ".........................................................d"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    a: { m: "cloth", step: 0 },
    b: { m: "cloth", step: 1 },
    c: { m: "cloth", step: 2 },
    d: { m: "edge", step: 0 },
    e: { m: "edge", step: 1 },
    f: { m: "edge", step: 3 },
    g: { m: "fire", step: 0 },
    h: { m: "fire", step: 1 },
    i: { m: "steel", step: 0 },
    j: { m: "steel", step: 1 },
    k: { m: "steel", step: 2 },
    l: { m: "steel", step: 4 }
  },
  idle: {
    // No breath in the armor: it settles, and creaks back up.
    waist: 54,
    breath: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the levelled spear thrusts at the company.
    twitch: {
      frames: [8],
      patches: [
        { x: -1, y: 0, rows: ["", "", "", "", "", "", "", "", "l._", "l.f.l_", ".lbelf.l_", ".l.el..f.._", "..lel...c.f_", "..l.e.l.c.h.c_", "...ce..lc.h..f_", "...c.e..c.h...fl_", "....ce..dlh....l_", ".....e..lbh....._", ".....c...lbh...._", "......c.hc.bch..b_", ".......h.c..b.c.b_..........fl_", "........hc...b.l.d_........f.l_", ".........c....bjle._......f.d._", ".........c._..bj.e.le_...f.j.d_", "................e.jle._.f.j..i_", ".................ej.ld._fj...i_", "..................ejd.l..j...i_", "....................jdjl.j...d_", "......................j.dlej.d_", ".......................ldjl.j._", ".......................flj.be._", ".......................fei...e_", "......................f.j..i.._", ".......................li....._", ".......................l.i.jie_", "......................le.ij.ie_", ".....................l.i..ji.._", "....................fldi.....b_", "....................fj.lei...d_", "....................fjd.e.i..d_"] }
      ]
    }
  }
};
