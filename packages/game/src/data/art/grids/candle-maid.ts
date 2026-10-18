import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Candle Maid: she lights the great hall every night; nobody has come to dinner in a
 * very long time. A stooped maid in a long dark dress gone to rags at the hem, a grey
 * apron spattered with old wax and a limp mob cap; her head is a clot of candles melted
 * into one lump, the wax running over her shoulders, two holes in it lit from inside. She
 * thrusts a branched brass candelabrum at the company, three flames leaning back.
 */
export const CANDLE_MAID: CreatureGrid = {
  rows: [
    ".....................jjiff",
    "...................jjjiiiffd",
    "..................jjjiiiifjdd",
    "................jjjjjggggfjjdd",
    "...............kkkkkjgjijjjjjid",
    ".....lL........kkkkkjjjgjidddidd",
    ".....lL.......bbbkkkkjjjjiddddddd",
    ".....ll.......bbbbcccbcbbbdddddd",
    ".....ll.......bccccclllbbbjjdddd",
    ".....ll.......bbcclllkddbbjjjjd",
    ".l...lcc.......jcclllddEbljjjjj",
    ".Ll..lcc..lL....cdbllkdklkjdjjjk",
    ".Ll..cccL.lL....cEblklllkkkjjjjk",
    ".l...cbbl..l....cccljlllkkkadbhjj",
    "kkc..jjbl.ccc...ccccllllllkadbjj",
    ".kc...jll.ccj....bcclllkllbidjjj",
    ".kc...kkk.ccj....bllklklljiiijjjjk",
    ".kk...kjj.kjj....bhkbblljjkjijjbjkk",
    "jjkk..kjjjkjj....baabdkjiikjikjbdddj",
    ".aa...kjj..j....bbaabddiiikjjkjjdddkd",
    "..a..kkjj..j....jkjaddiijjkkkjjjdffdd",
    "....kkajjkk....jjkjjaajjlkkkhjjjffffd",
    "...kk.aj.......jjkkjjjgjjdkkdjggfffdid",
    "......aj.......jjkjjjjljjjkkiighddddif",
    "......jjj.....jjjjjdjjljjjjjiiihjddddd",
    ".......jjlk...jjjjiddjljjjigiiigjddddd",
    "......kljkk.jjjjjjiddjkljjigiigggddddd",
    "......ijjijjkkjjjddddklllhhgggghhddidd",
    ".....jjjjijjkkljdddddklllhhhkhhhhjdiid",
    "......jkkjdjklggdddddklllhhhkhhhhgddidd",
    "......jjkjijkkjgdddddkllhhkkkhkkgdddidd",
    ".......ijaijjkigdd.ddggggkkkgggjjdddddd",
    ".........aaiiiiddd.ddijggjjjjjiidddddddd",
    ".........ajdddfdd..ffiiiijdaafffdddddddd",
    ".........jjddffd..gffffiijfdddfddddddddd",
    "..........jj.f....jdfddiffggggdddgdddfdd",
    "...........j.....dddfddijgggffdddgdddffdd",
    "...........jj....ddfddiijjjjfffddddddghgj",
    "...........jj...dddfdfijgggggfffdddigghgjj",
    "...........jj..ddddffffggggggfjjdddighhgjj",
    "............jj.dddjfgfggghhgggjjjddijggij",
    ".............jddddjjgijggggggfhjgdddddiij",
    ".............jadddjjggjghhhgjggggddddhjkj",
    ".............aaddgggghjgggggghjggddddggkj",
    ".............djddhggghggjggghhjghdfdddkkj",
    "............ddaajgghgghgjjghhkgghdfdddkkjj",
    "............dddagghhgglhgghhhkgghdffddkkki",
    "............dddagghhggglghhhgjghhdfffdjdki",
    "...........dddddaghhhggghhhhgkkhhffffdidji",
    "...........dddddajhkhggghhhggjkhhdffediij",
    "...........ddddjjjhkhhgggggjgghhhdffefddd",
    "..........iddddggggkkkggggggghhhgdffffdddd",
    "..........idddggghgkkgggggggghhhhdfiifdddd",
    "..........ddddggghhkgggggjjghhhhhdjfffdddd",
    "..........ddfdggghhkgggggjghhhkkhdffffdddd",
    ".........dddfdgggghhhggggghhhhkkgdffffidddd",
    ".........ddeedddjghghhggghhlhkkjgdjfffidddd",
    ".........ddffddddddgghhhhhllhgjggdjjjfidddd",
    "........dddfffjjgdddighhhhhkhgjjgdjjggjddddd",
    "........iddffddggddddgghhhhhgggggdjjjfgddddd",
    "........iddiidddjdfddgggggkggggggdjjgjjddddd",
    "........dddiidddddfdddggggkggggggddggddddddd",
    "........idddiddddffddddggggggggggdddddddddddd",
    "........idddfdddffedfddddjgggjjjddddddddddddd",
    ".......iddddfdddffedffdddddddddddddfddddidddd",
    ".......iddddfdddffddfffddddddddfdddffdddidddd",
    ".......iddddfdddffddfffdddddffffdddffdddiddddd",
    ".......ii.ddfdddffddfffdedefffffddddfdddifdddd",
    "..........dffddfffddffededeffdffddddfddddfdddj",
    "...........fdddfffddffededfffdffddddiddddddjj",
    "...........jdd.ffdddffededfffddffdddifddddd",
    "............dd.jddddffedddfffddffdddifddddd",
    "...............jgdddffedddffdddffdddffdd",
    "................dddddjdddddddddffdiidddd",
    "................ddddd.dddddjdd.fff..dddd",
    "...............ddiidd.....j.d.......ddddd",
    ".............ddddiidd...............ddddd",
    "...........iddiiddddd................dijii",
    "..........iiijjidd...................dijid",
    "...........dddddd....................dddidd",
    "......................................dijjjj",
    "......................................iikjjj",
    ".......................................iikdid",
    "........................................iddd"
  ],
  legend: {
    E: { pal: C.moon, glow: true },
    L: { pal: C.goldLight, glow: true, light: true },
    a: { m: "brass", step: 0 },
    b: { m: "brass", step: 1 },
    c: { m: "brass", step: 2 },
    d: { m: "dress", step: 0 },
    e: { m: "dress", step: 1 },
    f: { m: "dress", step: 2 },
    g: { m: "dress", step: 4 },
    h: { m: "linen", step: 2 },
    i: { m: "wax", step: 0 },
    j: { m: "wax", step: 1 },
    k: { m: "wax", step: 2 },
    l: { m: "wax", step: 3 }
  },
  idle: {
    // A slow servant's breath, the candelabrum rising with it.
    waist: 39,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, the candelabrum is thrust at the company.
    twitch: {
      frames: [6],
      patches: [
        { x: -1, y: 0, rows: ["", "", "", "", "...............k_", ".....lL_.......k_", ".....lL_......b._", ".....l._......b._", ".....l._......bc_", ".....l._......b._", ".l_..lc._......j_", ".Ll_.lc._.lL_", ".Ll_.c..L_lL_", ".l_..cb.l_.l_", "k.c_.j.bl_c.._", ".kc_..jl._c.j_", ".kc_..k.._c.j_", ".k._..kj._kj._", "j.k._.kj..kj._", ".a._..kj._.j_", "..a_.k.j._.j_", "....k.aj.k._...j_", "...k._aj_......j_", "......aj_......j_", "......j.._....j._", ".......j.lk_..j._", "......kljk._j..._", "......ij.ij.k.j._", ".....j...ij.k.lj_", "......jk.jdjklg._", "......j.kjijk.jg_", ".......ijaij.kig_", ".........a.i...d_", ".........ajd..fd_", ".........j.d.f.d_", "..........j._f_", "...........j_", "...........j._", "...........j._", "...........j._.d_"] }
      ]
    }
  }
};
