import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hollow Page (BIBLE 8.5): a page boy's livery with no page boy, still carrying a
 * message. A crimson tabard gone thin, gold border and a crowned badge, slashed sleeves
 * and empty hose striding forward on pointed shoes; a velvet cap with a raked plume sits
 * on violet fire where the face should be, a shadowed hollow in it with two white points
 * and a grin. Its pale gloves thrust a letter sealed in red wax at the company like a blade.
 */
export const HOLLOW_PAGE: CreatureGrid = {
  rows: [
    "................................................lllllllll",
    ".........................F...........RR......llllllllllll22",
    ".................................RRRllRRRRRRlll111l222llllll",
    "...............................RllllRRRRRRRll22222l211l221llll",
    "..............................llRrRRRrRrRRlRrrr.2222.1l2212lll2",
    "..................F.......ff.RRRRrrRRrrrrRrrrrr..22...2221222222",
    "..........................fffRRRRrrrRRRrrrrrrrr.......22..222.22",
    "..........................fLLrrrrrrrrRRrrrrrrrr",
    "....................ff....LL2rrrrrrrrrrrrrrrrr",
    "....................ffl..fL22fffgggrrggrgggggg......f",
    ".....................fLf.fx22fLLLfg.ggggggff",
    ".....................ffffLxfffLLffffffF1Lfff2",
    ".....................Lfff2fff2LLfLffffF1ffLL2L",
    ".....................ffff2222222222fffLffLLffLf",
    ".............f.......22L222222222211fLfffLLfffff222f",
    "..................ff22222211111111111LffLLfLfff22Lf",
    "..................ff2222111111111111111ffffLff22ff",
    "..................fff11F11111111111FFF1fffLLffffL",
    "...................LfL1FFFFF1111FFFEFF1ffLLfffff",
    "..................Lfff1FFEEFF11FFFEFF1122LLfffff2",
    ".................LLLLf111FFF1111FFF111222fffffff2f",
    "................fLLLLf111111111111111111ffffffff2ff",
    "................fffLff1111111111111111fffffffffffff",
    ".....................fff1111111111FFffffffffffffff",
    "......................fff11111110FFffffffffffff",
    "......................2ff2FFFFFF001fffffffff",
    "..........PL........22222222llllllllll222222",
    "......PPPPPL.......2222222r222111222222rrRRr11",
    "..PPPPPPPPLL.......2222222r22RRRRR2RRRRrxRRrr1",
    "LPPPPPPLLLLPL......2222222r21RRRRRRRRRRRxRrrr11",
    "LPPLLLLLPPPPLl.....2222222rr1ggggggggRRRxrrrr11",
    ".PLLLLLLPPLLLll..222222222rr1ggggggggRRRxrrrr00",
    ".PLLLLRPPLLLLll.2222222212000gggrrrggrrrxrrrr00",
    ".LLLLLRRRRLLLl222222222111000grrrrrrgrrrxrxrr0",
    ".LPLLLRlllLLll22222222000000Rgrrrrrrgrrrxrxrrr",
    ".LPLLLLllllll22222211.rrrrrRRggggggggrxrxxrrrr",
    "..LLLlllll222222210...RRrrrrrgggggggrrxxxrrrrr",
    "..LLllll.....22111l...RRRRRRRrrggggrrrxxxxxrrr",
    "..LL........ll21llll.2RRRRRRrrrxggrRrrxrrrxxrr",
    "............llllllllllRRRRRRrrrxrrrRrxxrrrxrrr",
    ".............llllllllRRRRRRRrrrxrrxrrxrrrrxrrrr",
    ".............llllll22RRgggRgggrgrrxxrxrrrrrrrrr",
    ".............22222222Rggggggggggggggggggggggggr",
    ".................22..RRRRRRRrrrrrrrggggggggggrr",
    ".....................RRRRRRrrrrrrrrxrrrrrrrrrrrr",
    ".....................gRRrrrrrrrrrrrxrrrrrrrrrrrr",
    ".....................gRRrrrrrrrrrrrxrrrrrrrrrrrr",
    ".....................RRRrxxrrrrrrrrrrrrrrrxrrrrr",
    "....................xgrrrxxrrrrrrrrrrrrrrrxxrrrrr",
    "....................Rgrrrrrrrrrrrrrrrrrrrrxxrrxrr",
    "....................Rgrrrrxrrrrrrrrrrrrrrrxrrxxrr",
    "....................Rgxrrxxrrrrrrrrrrrrrrrxxrxxrr",
    "...................RRgxrrxxrrrrrrrrrrrrrrrxxrxxrrr",
    "...................RRggrrrrrrrrrrrrrrrrrrrxxrxxrrr",
    "...................R0ggrrr00rrrrrrrrrrr00rrxrxxrrr",
    "...................R0.rrr000rrxxx0rrrrr00rrxrxx.rr",
    ".......................rr000rrx000rrrr000rrrrx",
    ".......................rr000rrx000rrrr0011rx0x",
    ".......................rr0222rx00..rrr00111x0x",
    ".......................2222220xx....rr00111rrx",
    ".......................2222210xx....rr0111110",
    ".......................222211........r0111110",
    "......................2222211...........11111",
    "......................222220............111111",
    "......................222110.............11111",
    ".....................222220..............11111",
    ".....................222210...............11111",
    "....................2222222...............11111",
    "....................222000................112222",
    "....................20200..................11110",
    "...................220xxx..................11110",
    "...................222xx....................1111x",
    "..................2222222...................11000",
    "..................22211.....................11110",
    ".................22221.......................11111",
    ".................22221.......................11x11",
    "............2222222xx.........................1xx0",
    "......222222222222222.........................1122222",
    ".....22222222222222222.......................222121111222",
    "....222222222222222221.......................211111111111",
    "....111112211222222221.......................21111111111",
    "..............1xxx1111.......................000000000"
  ],
  legend: {
    "0": { m: "dark", step: 1 },
    "1": { m: "dark", step: 2 },
    "2": { m: "dark", step: 3 },
    E: { pal: C.moon, glow: true },
    F: { pal: C.violetFire },
    L: { pal: C.moon, glow: true, light: true },
    P: { m: "pale", step: 3 },
    R: { m: "cloth", step: 2 },
    f: { pal: C.essenceBright },
    g: { m: "trim", step: 2 },
    l: { m: "pale", step: 2 },
    r: { m: "cloth", step: 1 },
    x: { pal: C.ink }
  },
  idle: {
    // The empty livery rises and settles as the fire in it draws breath.
    waist: 56,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the fire flares up out of the collar.
    twitch: {
      frames: [6],
      patches: [
        { x: 13, y: 9, rows: ["..........f.........f........ff", ".........f.f_.ff...f.ffffF..f", "........_....f.._..._......f.__", "........f....___..._._..._f._.ff.f", "f.......____.........._._f......f.f...f", "_....ff................_..._.f_..._..f_", "........................._.ff...._.ff_", ".......f..F...........FFF...._...ff__", ".....__....FFFF....FFF_....._.f", "......f.f...__.F..F.._F._.__", "......__..__FF._.._..F__....ff......f", "...f........___....___.....f.........f", "....ff.f.................ff........f", "...___._.ff..........FFff............_", "........_..f........F.f...........___", "........._...FFFFFF.__.........___", "..........__.______..._________"] }
      ]
    }
  }
};
