import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Briar Witch (BIBLE 8.2): a druid who stayed in the forest too long and became part
 * of its hedge. Bent at the company, a grey face snarling under a crown of branches set
 * with a violet stone, lank white hair down her back; the robe is moss, bark and thorn over
 * a violet skirt, a skull hung at her belt. Her near hand is a claw, and violet light
 * crackles around it.
 */
export const BRIAR_WITCH: CreatureGrid = {
  rows: [
    ".............................c....g",
    "....................g........c....c.......g",
    "....................c.........c..c........c....cc",
    ".....................c........c.c.......cc.....cc",
    "......................c........c......cc",
    "...................g..c........cd....cd.cc.....cb",
    "...................ccc.c.......cd....dcccccccccc",
    "......................cccdb....cd...cd.cccbbbx",
    "........................bcd....cd...d.cb.g",
    "........................bcd....cd..cd.cb",
    "..................bb...cb.cd...vd.sds.cb",
    "..................bb...cb.csd.vvvscssssSc",
    "..................bb...bbs.csssvSSSsssssS",
    "...................bb..bsbbSSSSsssssssssS..v",
    "....................b...sbsSSSSSSssssssssS.sb...bb",
    "....................bccs.bssssssssssssssssSbbb.bb",
    ".....................bcbgsSssssssssrrrssssSbbbbbb",
    ".....................bbbbsSssssssssxrrssssvSbbb",
    "......................bbsSbxxssssxxrrrssxsvSx",
    ".......................ssSbrEExsxErrrSxxgsxxSxx",
    ".......................scSbsEsrsrErrrcSggsxxSxxxx.cc",
    ".......................sSSSsssssssrrrcSxssxxSxxxxxx",
    ".......................ssSssssssssrrrxrxsxsxSgggxxgg",
    ".......................sSssssSSsssrrrxrxsxsggSgggxxgcb",
    ".......................sSssssssssrrrsxrxsgsgcScgxxxg.gg",
    "......................s.SbsssxxSxrrgsxrxsgsgdScxxxxxx",
    "..........L...........s.SgxSxSsssrrgsxSrsgsddxxxxxxxx",
    "..........vv..........s.Sgbrrrrrrrxdsxxrsgsxxxxxbbxxx",
    "....v...vv..x.........s.Sgbrssssrxrdsxxrsccsxxxbbbxxxgg",
    "...v...vsS...S........s.S.bbrrsxrrxdsxcrgsxscxxbbbccxxcccc",
    "...v..vxSRSS..S.......s.SbbbxxrrxggsgggScsxscxxxxbbccddddgggg",
    "..v.Lv....sSS..S......sS...bbx.xxxxscggScsggcxxxxxxcdddxxxxxg",
    "..v..vvRRRRRSSS.S.....sS...bbbbbbxxsbbcScscccxxxxxxxxcdxxdcc",
    ".v..v...SSSSrSSSScg..s.S......bbbxxsxxcScscccxxxxxxxxcxxbdcccxx",
    ".v..v.xSRRRRSSSSSggccs.S......bbbxgsxxcccsxxxxxxxxxxxgxxbbdccxx",
    ".v.v..vv.RR...SSSggccscS.....cbbb.gsxxxxxsxxxxxgxxxxxgggbbdccccc",
    ".v.v..v...RSSSS..ggggsgbbbbcbcba...ccg..xsxxccxggxxxxgg..gxccccg",
    "v..v.....SSRRR....gggbbbbbbcbbba...cg....sxxbxccgxxxxg....xxcccg",
    "v..v....S...........gxxbbbbbbbb....gg....xxxbxxcgxxxxxxx...ggccg",
    "vL.v...x.............xxbgbbbbxx.........xxxbbxxxxggxxxxx.....ccgg",
    "v...v................xxxgbbbaax........xxxxbbcccxxgggxggg....cccxx",
    ".v...v.vv.....v......xxxxxaaa.........gxxxxxccccxccgggggg.....cccb",
    ".v....vvv.....v.....xxxxxaaaa........ggxxxxxcccccccccxxxx.....ddcb",
    "..v......vv..v......xax.xaa........ggggggcccccxxccccccxxxg....dddccc",
    "........L.vvv.......aaaxxaxg.......gxxccxxxgggxbccxxxcxxgg....dddcccccc",
    "...................xxaaxaa..........ggccxxgggggbxxxxxccxgg...ddbbcdcccc",
    "................bbbg.aabaa........ggggcaxcgggggbbxxxxccxggg..cc...dcccccb",
    ".....................aabaa.......gggcccabcgggggbbxxxxcxcxxg..c....dc..c",
    ".....................bbba.......dccxxxbbbccxxggxxxxddcccxx...cb....c..c",
    "....................bbaaa....cccxxxxbbbbccxxxggxxxxdSSSxxgg..bb....c..b",
    "....................bbarr...cc..xxbbccbbccxxcccxxxxSSSSSxggg.......c",
    "...................bb.......c..gbbbcccbbbRbbbcxxxxxSxSxSxxggg......b",
    "..................rr.......bb.ggbbxxxxbbbRccbcxxxxxcSsSxxxggg......b",
    ".................sr........bb.ggbbxxxxbcccccbxxxxccxsxsxx.ggg",
    ".................br.........bgggssbbbbrrRRgggxxccccxxxxxxxxgg",
    "................bbb.........gxbbcccbbbbbRRgggxxccccxxxxxxxxggg",
    "................bb........ccgxbbddcxbbbbbddggxccccccxxxxxxxxggg",
    ".........................ggggbbcdxxxbbbbbdggxxcccccccxxxxxxxxgg...v",
    "..........................ggxbdccxxxbbbbbggxxxxccccxcxxxxxxxxxxx",
    "..........................gxxbdccxxxbbbssggxxxbbccbxccxxgxxxxxxbb",
    "..........................gcxbbbbxxxbbbssggxxxcccbbxccxxgxxxxgg.bbb",
    "...........................cxbbbbxxxxbbsgxxxxccccxxxcxxxxcxxxgg...bbb",
    "........................c.gcxbbbbbxxxrbbgxxxxccccxxcxxxxxcgxxgg....bb",
    ".......................ccxxcbbbbcbxxxrrrgxxgxcccccccxxxxxcgxxxgg....b",
    ".....................ccc.xxxccbbcxxxxbbrrgggxcccccccxxxxxxxxxxggg...b",
    "........................ccxbxxcccxxxxbbrrgggcccccxccxxxxxxvxxxxggg..b",
    ".......................ccxxbxxxxxxxxxbrrrgbgcbbbxxxccccxxvxvxxxgggggb",
    ".......................gcxxxxccxxxxxxxrrbgbgccbcccxxxxxxxxvvxxxxggggx",
    "...................c...gxxxxxcgxxxxxxxrrbbbcgcgcccxxxxxcggvvxxxxgggg",
    "...................cc.cxxxxxxcgxxxxxxxrrbrrcgcggcxxxxxxccxxxgxxxgggcc",
    "....................cccxxxxxxcgxxxxxxxrrrrrcvccgcxxxxxxxxxgggxxxxgggg..bx",
    ".....................cxxxx.xxcxxxxxxxxxrrrrvcccggcxbbbxxxxccggvvxxgxxggg",
    "....................ccx.xxxcccxxxxxxxxrxrbbbccccccxxbcxxxxcgggvvxxxxgggg",
    "..................ccc...xxxxxxxxxxxxxxrxrbbbcxxcggdxxcxxxxcxxxgggxxxgggggxccgg",
    "..................ccc....xxxcxxxxxxxxxbxxbbbrxxddgddxxcxxxcxxxgggggxxggggxx",
    ".................gcg......xxccxxxxxxxxbxxbbbrrxccgddxxccxxcxxxgggggggxxgggg",
    ".................ggg......xxcxxxxxxxxxxxxbbbbrrcccgxxxxcccxxxxxgxccgxxxxxggggg",
    "...............cggg......xxxxxxxxxxxxxxxxbbbrbbcxcggxxxxccxxxxxgxxxccxxxxxggggg",
    ".........................cccxxxxxxxxxxxxxxbbrrbxxcccxxxxccbxccxxxxxxccccxxxxggggx",
    ".........................ccbxxxxxxxxbbxxxxbbbbbRRxcccxxxxcbxxcccxxxxxxcccxxx.xxxxx",
    ".......................ccccbb...xxx.bbbxxxbbbbbRbxcccxxxxxxcccxxxxxxxxggccccggg",
    ".....................cccccbbb........bbxxxbbbbbbbbccccccbbbccccccccxbb....cc",
    ".....................cccbbb..............bbbbbbbbbb.ccccc..ccccccccc.bb",
    "........................................bb..bbbbbbb..cccc......ccccc",
    "........................................bb....cb.....cccc",
    "..............................................cb......ddc"
  ],
  legend: {
    E: { pal: C.essenceLight, glow: true },
    L: { pal: C.essenceLight, glow: true, light: true },
    R: { m: "robe", step: 1 },
    S: { m: "skin", step: 2 },
    a: { m: "bark", step: 0 },
    b: { m: "bark", step: 1 },
    c: { m: "bark", step: 2 },
    d: { m: "bark", step: 3 },
    g: { m: "moss", step: 1 },
    r: { m: "robe", step: 0 },
    s: { m: "skin", step: 1 },
    v: { m: "magic", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // A slow breath under the robes.
    waist: 49,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Twice in a cycle, the spell around her claw flares and turns.
    twitch: {
      frames: [4, 5],
      patches: [
        { x: -1, y: 26, rows: ["......vvL.._", "....vv.....__", "...v._v..__", "...v_v.._", "..v._v._", "..v_v__", ".v....__", ".v_v._", ".v_v._", ".v.L_..__", "v..._.._", "v_v._", "v_v._", "v__v_", "v_.v._", "L._.v._.__", ".v_.v..___", ".v._.vv...__", ".v.....v._.___", ".......Lvvvvv"] }
      ]
    }
  }
};
