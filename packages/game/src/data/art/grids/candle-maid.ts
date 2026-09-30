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
    ".........................AA",
    ".........................AA",
    "........................AALA",
    "........................ALLA",
    "........................AAAA.AA",
    ".......................xPWWWwAAA",
    ".......................PPPPPwLLA",
    ".......................PPPPPwALA",
    ".....................A.PPWPPwAWWx",
    "....................AALAPWPPwPPPw",
    "....................ALLAPWPPwPPPw",
    "....................AAAAPPPPwWPPwPPP",
    "....................PWWPPPPPwPPPwPWP",
    "........A...........PPPPPPPPwPPPwPPW",
    "........AA..........PPPPPPPPwPPPwPPw",
    ".AA....ALA..........PPPPPPPPwWPPwPPP",
    ".AA....ALA....AA....PPPPPPPPwPPPwPPllll",
    "ALL....ALA....AA....PPPPPPPPwPPPwlllllll",
    "ALL....AAA...AALA...PPPPPPPPwPPPwllllllll",
    "AAA....PwA...ALLA...PPPPPPPPwPPPlllllllll",
    ".Pw.....P....AAAA...PPPPPPPPwPPllllllllll",
    ".PP.....P.....Pw...PPPPPPPPPPPPPllllllllll",
    ".PP.....P.....PP...PPPPWWPPWPPWWllllllllll",
    ".PP.....P.....PP...PP0000PPP0000llllPlllll",
    ".PP.....P.....PP...PPPA00PPP00AAPPPPPPww",
    "APg.....P.....PPW..PPP0EAPPP0EL0PPPWPPWx",
    "AAg....PP....AAgW..PPP000PPPP00PPPPWWPWP",
    "..A....APW....Ag...PPPPPWWWWPPPPWWWWPPWP",
    "..g....Agg....Ag...PPWWxxWWxxxWWWWWWPPWP",
    "..A.....g.....g.....wwPxxxxxxxwwwwwwwPWW",
    "..AAAA..g...Agg.....wwPPxxxxxwwwwwwwlP.W",
    "....AAAAAAAAg.......PllPlllllllllllllP.W",
    "......AAAAA........2PlPPlllllllllllllP.P",
    "........A.........22PlPPlllllllll222PP2P",
    "........g.........2222P22l2222222222222",
    "........g........2222222222222222221110",
    "........g........2222222222222222221110",
    "........g........22222222222222222211001",
    "........g.......222222102222222222211001",
    "........g......2222221022222222222211101",
    "........g......2222210022222222222211101",
    "........g......2222210222222222222211101",
    ".......APPP...222221012111111222211111111",
    ".......PPPPP22222211011111111111111111111",
    ".......PPPPP22222210011111111111111111211....ll",
    ".......PPPPP222222000000000000000000002111lllll",
    ".......xWWWW222222llllllll00x222222112211llllll",
    ".......AA...002211lllllllWW2x222221111211llllllx",
    "........g....x2001WxllllllWlx2222211112111lll.lx",
    "........g......0llWxllllllWlx2222221111111lll",
    "........g.......PlWxxlllllWlx2222222111211.ll",
    "........g.......P1Wxl1llllWl22222222211210.lll",
    "........g......2l1Wxl1WWllWl2222222222xx10..ll",
    ".......AA......2l1Wxl1WWxlWll222222221xx11",
    "......AgggA....2llWxl1lWxlWll2212222111x1W",
    "......AgAAx....PllWxlllWllWll2222222211x1W",
    "..............2lllWxllllllWll222x22222x11WW",
    "..............2llll1llllllWll222x22222x111W",
    "..............2llll1lllllllll222x22222x1111",
    "..............2llll1lllllllll222x22222xx121",
    "..............2llWlllllllllllx22x22222x2221",
    ".............22llWlllllllllllx12x1222222211",
    ".............22llWlllllllllllx11x122221221x1",
    ".............22llWlllll1lllllx11x22222122xx1",
    ".............2PllWlllll1lllllx12x222222222x1",
    ".............22llWlllllllll0lx222222222222x11",
    ".............22llllllllllllll2220122222111x11",
    ".............2llllll1llllll222221122222111x10",
    ".............2llllll1llllll221121122221111x11",
    ".............22lllll1lllllll21111222221221x111",
    ".............22lllll1llllll221112222221222x111",
    ".............22lllll2llllll2222222222x222201100",
    ".............22lllll2lll0llx22222222xx222101100",
    ".............22lllll2lll0l2x2222x222xx222101100",
    "............222lll2lllll02202111x112xx111x11100",
    "............222xl1222ll21120211xx111xx111x111100",
    "............2221l111222211x1211x0111xx111x101111",
    "............2220001112211xx1111x0000x1110x0000110",
    "............222000x100000xx1x00x0000xx000x000x000",
    "............22000011000x0xx1100x0000x0000x000x000",
    "............2xxx000100xxx0x1000xxx00x00xxx000x.00",
    "...........22xxx00000xxxx00x0xxxxx00x0xxxx000x",
    "...........2xx...000xxx....x0xxx...0x0xx...00",
    "..................00xx......0xx.....xxx.....0"
  ],
  legend: {
    "0": { m: "dress", step: 1 },
    "1": { m: "dress", step: 2 },
    "2": { m: "dress", step: 3 },
    A: { pal: C.amber },
    E: { pal: C.moon, glow: true },
    L: { pal: C.goldLight },
    P: { m: "linen", step: 3 },
    W: { m: "wax", step: 3 },
    g: { m: "brass", step: 1 },
    l: { m: "linen", step: 2 },
    w: { m: "wax", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // A slow servant's breath, the candelabrum rising with it.
    waist: 39,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, a draught through the hall bends the flames.
    twitch: {
      frames: [7],
      patches: [
        { x: 7, y: 8, rows: [".............._A", "............._.A", "............._A.L", "............._", "", "._A", "...A", "_"] }
      ]
    }
  }
};
