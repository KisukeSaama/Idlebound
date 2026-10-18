import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Drip Leech (BIBLE 8.3): it hangs from the ceiling and drinks whatever falls, mostly
 * time. A fat ringed leech, wet and glistening, reared up like a cobra over the company;
 * its tail is still sealed to the broken stalactite it fell with, lying on the floor. The
 * round mouth gapes forward on a ring of hooked teeth, a crescent of cold eyespots in the
 * dark brow above it, slime hanging from the lip.
 */
export const DRIP_LEECH: CreatureGrid = {
  rows: [
    "...................................hjjjjjkk",
    ".................................jcjjjjkkkkkkk",
    "..............................hjcjjjjaaeaaaakkkk",
    ".............................iccjjjjjjjjjjjjaajkkk",
    "............................jcjjjkkkkkkkkjkkjjjjkcj",
    "...........................kcjjjjkkkkkccckjkkkkjjjjk",
    ".........................hkkaaaaajjkkccckkjjkkkkkjjkk",
    "......................hkjckjjjjjjkkkcckkkkkjkkkkkkjjkk",
    ".....................kcjjjjjkkjkkjjckkkkkkkjjkkkjkjjajk",
    "................jkkikkjjjjjjaaaiajjjjjkkkkjjajkkjkjjajj",
    "...............jcjaakaajjjjjkkkaaajjjjkkjjjjajjkjkjkjjkk",
    "..............jcjjjjjjjjjjkkkjjaaajajjjjakaaaajjjkjkjjjkk",
    ".............icjjjjjjjjjjckieeaaaajaaaajaaabeajajjakkjjjk",
    ".............cjjkjjjkkjjcbijjeeeaajjaajjjbabejbajaajjajjkk",
    "............ijjjjjjkkjjkkicdcbeaakkkkaaabbaeeaabbajjjajjjk",
    "............jiajjjkkcjjkacddcceakkkkkjaabbeeeeeaaaajjjjjakj",
    "............ijaajjjkkjjeEEddccejkkkkjjaaaaeeaaaeeaaejjjaajj",
    "...........jcjjkkkckkjeeekcccjjjckkbbbajaaeeaaaaeeejjjjaajj",
    "..........jcjjkkjjjjjjjjjjjjjjjcbbbfbcjjaaeejjaabaajkkjjeek",
    ".........jcjjkkkjbbjjjjjjjjjjjcjbbeeebbjaaeebaabbbajjjjaeekj",
    "........ijjjkkkcgbfgjkkkbbbbccbbbeeflcbjebebaabbbbeejjeaaakj",
    "........bbjkkkccgelgbbcgcccccbbbeeefccjjjeeeejbbbabeeikjjakj",
    "........bljkkkcgffccccgggbbcbbbeeeefcbjjaeeejjbbabcbackkjajj",
    "........bbbbbbgggcccccggfeeeeeeeeelcbbbabeeeaaabbbccakkkjajj",
    "........cbbbbgggggcgggfeeeeeejelefbbbbblleeeaabbcbbbakkkjakh",
    "........bbfbbgffffggffeebeeeeellegbbbbabeeaaaabbbabcikckjak",
    "........ieeeeefffeeejdbeeeeeeajlgcabbabeeaababbaebbdikkjjak",
    ".........blllfebcebebdceeeeeeajgcbbbabeeaabbaalbaccdikkjjaa",
    ".........cbhhleeeeeeedceeeeeeegcbbbbaeeeeeeabbbbjcccjkkkjjj",
    ".........bch.ceeeeeeebceeeeeecbbbaajeeeeejjbbbcjicjbjjeaaj",
    "..........ci.jb.ejeeeejeffllcbbbaaajaaaaabbbbbljcccjkkaaai",
    "..........ii.j...jaeeeefgffggbleeeejeeaaaaalbbbbcdckkkaaei",
    "...........i.....jaeeflggffgbbeaeaajjaaaaabbcccccdjkkjaae",
    ".................beefggbbfbbbeeaaaajjaabbbbcccccccjkkjajj............jjj",
    "................hbeegggccfbbeeeaajjabbbbbbccdcbjbjjkkaajj............cjjjj",
    "................baleggfbbcblaeaaaaaabbbbbccccbicdjjjaaajj............jjajji",
    "................bbjfffbfbbjhaeaakjaaeaaaljbbccbddkkaaaa..............jaaakkh",
    "................befffelcbjj.jeajjjbjbbbbccccdcbdckkaaaa..............jj.ajkjh",
    "................bbfffbcblej.jjejjbbjbbbbccdddcbdkkaaaj..................jjkjj",
    "................ibbbbbbll.j..keejbbabbcccdddcbhkjjaajj...................jaai",
    "..................lejkh......beeeababbccccccjekcjjaaj....................ikkjj",
    "....................jk.......bjebaaaabbccbbbcjkkjjaa.....................kkjjh",
    ".............cb......j.......bjabbjjjjbcccddcjkjeeee....................jjjjaa",
    ".............bb..............kkabbbbbccdddddcjkjaaah....................cjkjaa",
    ".............................ikebbbbbccddddccjkajakh...................kkjkaaa",
    "..............................keabbbccddddcbhkkajaj....................ckkkjai",
    "..............................kebaaabcccbbbcbkkajajhj.................jjajjjai",
    "..............................jebbbbbbcccddcbkkajajjjjih.............kkkkjaaa",
    "........icb..............bbbbbbebbbbcccdddccjkkjjajjjcckcbb.........cckkjjjaa",
    ".......ijjckkje......bbbbckkkkbeabbbccccccbbjkkjjaaakkkakkkckjj....ckikkjjjaa",
    ".....ibbjjjiijcccbjjckkaaaaaaakebbabbbbbbcccjkkjaaajkkakkkkkkjkkkhckkjaajjjaa",
    "...bbcjjjjbbbjjjbbcciaaaaaaaaakeabbbcccccccbjjkajjajaaekkkkkajjkkkjjjjjjajab",
    "..jcbbccbbbbccbcccjbiaaaaaaaaikebaabbccccbbccakkjjajaaeajjjjkkjjkkkjjjjjaaab",
    "..jbbcbccccccccbjjjbaaaaaaaaaikejbaabbbbcccccakkjjaaaeeaaaaajkjjkkkkjeajaaaa",
    "..iiijjbbcccbjcjjjjbaaaaaaaaaekeejbbbbcccccbbakkjjaajeeaaaeajajajkkkkjaaaaaa",
    "..ciiijbbcbbjibejhjbaaaaaaaaaekaaaaabbbcbbbccbakjjjjajeaaaeaaaeajjkkjjjaaae",
    ".hciijjbjcbeeebeeebbaaaaeaaaeakaebjjaaabbcccccaakkjjaaaaeeaaeeejkkkkjjjaaae",
    ".jjiijjjjcjeeebeeebbaaaaeaaaeajjeebabbbbcccccbaakkjjjaaaaeaeeaajkkkjjjjaabh",
    ".ciiiijjjceeeeeeiebeeeeaeaaeaaajeeaaabbbbbbbblbaakkjjaeaaaakjckjjjjjkkkaab",
    "bkiiiijbjceeeeeeihbeeeeaeaaeaaajjeaaaabbbbblbcbbaajjaaeeeakkkkkkkjakkkaaaa",
    "biiiiijbjbeeeeeeiheeeaeaaaaeaaaejaaaaaeeaabbbbbbaeekkjejaaakkkkkkjaakjaaje",
    "biiiiijbhheeeeeeiejeeaaaaaeeeeeeejabbaaaabbbbbbaaeeaccjaakkakckkkjjajjaaj",
    "iaiiijjbeeeeeeaeeeejjaeeeee....eeeeebbaaaaabaaaaajjakaaakkkkakkkkjjaajaah",
    "iaaaijjbeeehhaaebeaajjjjjhj......eeeeaaaaaajjjjkkjkkkkkckkkkaajkjjjjeaabh",
    "iaaiijbbeehhhaaebjjajjjjjjjjeejjjjjjjaajjkkkkjkkkkakkkkkkkjjjejkjjajeaaa",
    "ijhhhhbbeeejaaaaajjbbkkkkkkkebkkkkkkkkajkkkkkkkkkkkkckkkkjjjjejjjaajjaj",
    ".jeehijbeeeeaaaajjbbjkkkkckkebkkkkkkkkkakkkkkckkkkkakkkkjjjjjeaaaaajjj",
    ".ejeaijieeeeaaaaaabjjkkkkcckkckccccccckaccckkkkkkkkaakkjjjjjjeaaaabhh",
    "..jeaiiieeeeaaaaaabjjkkkkkckbbkcccckcckakkkkkkkkkkjaajjjjjjjjeajbbaa",
    "..jeaaiieeeeeaaaaajjjjkjkkkjbbkkkkkkkkkajkkkkjkkjjjaejjjbaajaejjje",
    ".ijeeehhejjeeaaeaabjjjjjkjkjbjjkkkkkkkkajjjjjjjjaaaaeaajbabbaaaeh",
    ".iiieeehehjjjaeeaabbbjjjjjjabjjjjjjjjjjaajjjjjjaaaaaeaabbabeeee",
    "...iehhhicjjaaeeaaabbbjjjjjaabjjjjjjjjjaajjjjbaaaabeaaacchhe",
    "......jjccjiihhebkihabbaacjaabbbjjjjjjbaajjjbbabbbeeaabccbi",
    "......jjccjj...bbiiiebeeacjaaaabbbbbbbbebbbbbbaaaeeeebbbcbcjj",
    "...................hbbjjcjjbjeeaaaaalleeeaeeeee..ejj.....jjjj",
    "......................hbbbhbh",
    "......................ibi"
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    a: { m: "bone", step: 0 },
    b: { m: "bone", step: 1 },
    c: { m: "bone", step: 2 },
    d: { m: "bone", step: 3 },
    e: { m: "maw", step: 0 },
    f: { m: "maw", step: 1 },
    g: { m: "maw", step: 3 },
    h: { m: "rock", step: 0 },
    i: { m: "rock", step: 1 },
    j: { m: "rock", step: 2 },
    k: { m: "rock", step: 3 },
    l: { m: "skin", step: 0 }
  },
  idle: {
    // The reared column swells and sinks as it drinks the air.
    waist: 70,
    breath: [0, 0, 1, 1, 2, 2, 2, 1, 1, 0],
    // Once in a cycle, the reared head sways toward the company.
    twitch: {
      frames: [7],
      patches: [
        { x: 4, y: 0, rows: ["..............................hj....k._", "............................jcj...k....._", ".........................hjcj...a.ea...k_", "........................ic.j...........a_", ".......................jcj..k.......jk.j_", "......................kcj...k....c..kjk._", "....................hk.a....j.k.c..k.j.k_", ".................hkjckj.....k..c.k....jk_", "................kcj....k.jk.j.ck......j._", "...........jk.ik.j.....a..iaj....k...j.a_", "..........jcja.ka.j....k..a..j...k.j...a_", ".........jcj.........k..j.a..jaj...aka.._", "........icj.........ckie.a...ja...ja..be_", "........cj.kj..k.j.cbij.e..a.j.a.j..babe_", ".......ij.....k.j.k.icdcbea.k...a..b.ae._", ".......jiaj..k.cj.kacd.c.eak....ja.b.e.._", ".......ija.j..k.j.eE.d.c.ejk...j.a...e.a_", "......jcj.k..ck.je..kc..j..ck.b..aja.e.a_", ".....jcj.k.j..............cb..fbcj.a.e.j_", "....jcj.k..jb.j..........cjb.e..b.ja.e.b_", "...ij..k..cgbfgjk..b...c.b..e.flcbjebeba_", "...b.jk..c.gelgb.cgc....b..e..fc.j..e..._", "...bljk..cgf.c...g..b.cb..e...fcbj.ae..j_", "...b.....g..c....g.fe........lcb..abe..a_", "...cb...g....cg..fe.....jelefb....l.e..a_", "...b.fb.gf...g.f.e.be....l.egb...abe.a.._", "...ie....f..e..jdbe.....ajlgcab.abe.a.ba_", "....bl..febcebebdce.....ajgcb..abe.a.b.a_", "....cbh.le......dce......gcb...ae.....ab_", "....bch_ce......bce.....cb..a.je....j.b._", ".....ci_jb_eje...jef.l.cb..a..ja....b..._", ".....i._j_..jae...fgf.g.ble...je.a....lb_", "......i_....jae.flg.f.gb.eaea.j.a....b.c_", "............be.fg.b.fb..e.a...j.a.b...c._", "...........hbe.g..c.fb.e..a.j.ab.....c.d_", "...........baleg.fb.cblaea.....b....c..._", "...........b.jf..bfb.jhaea.kja.ea..ljb.c_", "...........bef..elcbj._jeaj..bjb...c...d_", "...........b.f..bcblej_j.ej.b.jb...c.d.._", "...........ib.....l._j_.ke.jb.ab.c..d..c_"] }
      ]
    }
  }
};
