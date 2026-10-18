import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Lantern Moth (BIBLE 8.1): drawn to the walker's light, like everything in the night.
 * Hanging in the air with its wings thrown wide in threat, four false eyes staring at the
 * company from dusty lilac wings veined in black; a thick ruff of fur, feathered antennae,
 * two burning points for eyes. Its abdomen is a lantern of segments lit from inside.
 */
export const LANTERN_MOTH: CreatureGrid = {
  rows: [
    "",
    "",
    "",
    "",
    "....iiiiiiiffjji...................................................................................iee",
    ".fiiiiiffiiiijiifffi.........................................................................eejeeiiiiiijjj",
    "jfffjjjjjjffkkjfffiiii...................................................................iiiiifjjkkkjffjjjkk",
    "jkjjjfjfjjjjkkkkkijiijjjj..........................e..................................jiffiijkkkkkkkjffjjkkj",
    ".kkkjfffjjkkkkkkllkkjjjjjjj.......................ae................................fiiiijkkkkkkkkkjffffjkkk",
    ".kkjfffjjjjjkkkkkllkkkjiijjjj.....................ae.......bbbb..................fjejiijkkkjkkkkkkkffffjjkk",
    "..jjjfjkkkkkkllkkkkkkkkkiijjjee...................ae.....aabbbb................ffeeeejkkkkkkjkkkkkjffiiijj",
    "...jkjjkkkkkllllllllkkkkkjjjjjjj...................a..a.jaaabbb..............jjifeejkklkkkkklllllkkkjjiikk",
    "....kkjkkkkkkklllkklllkkkkeeejjjj.....a............a.aaajffabb.............eejjeeekkkjklllklllkkkkkkkjjkk",
    ".....kkkkkkkkkkkkkllklkkkjfeeejjjj....aaaa.........eabbiiffbb............aaeieeeekkkkklllllkkkkkkjkkkkkk",
    "......kkkkkkjkkkkklljkjjeefffeejjjj....aaab........eaceiifbbk...........aaaieeeeekkkklllllkllllkkkkjjkk",
    ".......kkkkkkkkkkkkjiejjkkkkkjeeijaa....abb.....a..aaceiiaab...........aaaieeeeeeeklkllllkllllkkkkkkkjj",
    "........kkkkkkkkjfefkklkkkkkjjeeiiaaa...ebbb...aa.jacbeiaa.............aaeiieeejjfiejjklkkkllkkkkkkkkk",
    ".........kjjkkjeejkkkklllkllkjjeeeefaa...aeeiiieejjeebik..............aaeeeeejkkkkkjjjjfklkkkkkkkkkkkj",
    "..........jjjifkkkkkkllllklkiijkeeeaaaa..eeeifieeejeeeei.............aaeeeeejjkjkkkkllkjeejkkkkkkkkkk",
    "...........jjkkkkkklllllklkiikkkjjeeaaa...iijfieeiieeeee............aaeeeeeeejklklllllkkkjeejkkkkjkkk",
    "...........kkkkkkkkkklllfeijkklkjkeeeaaa.aiijfjjjieeeeeeee.........aaeeeeejjjieklkllllkkkkkjjjjkkjkkk",
    "............kkkkkkklllljjjkklllkkkeeeeaaeajjjjjjjjffeiieee........afeeeeeeekkkkfiifllkkkkkkkkjeejkkk",
    "............kkkkkkkkkkfiklklllllkkfeeeeaejjjjkjbjjiieiiieeiii....afeeeejjffkkkllkijikkkllkkkkkkjjj",
    ".............kjkkkkkkffklkkjfjlllkejjeeeejjjkacbcciiiiffiiiie..aaaeeeejjkkfflkklllkifkllkkkkkkkkj",
    ".............kkkkkkkifklllfccjkllkejkeeeebbjkacGHcciiifiiiee..eaaeeeejjjklkijlklllkkjiklkkkkkkkk",
    ".............klkkjkifkklllacedalljjkkkeeeccjjjeGHHcjjiiiiiiieeeeeeeeejjkkllkikkklllkkjikkkkkkjkk",
    "...............kkjjjkklllkjcdbklkjjkkkjeeHcjjjjbGGbjjiijjiiieeeeeeeejjklklllkikklllllkkijkkkkkk",
    ".................jjkkkkllkkjefkljjkkkkkjjaajjaabbbbjjiiiiiiiieeeeeejkkllllllkjfkklllllkkffkkkkk",
    "..................klkkkkklllkklkjkkkkkjjjkjkaaaaajjjiijjiiiieeeeeejjkkkkkklklljikllllllkkjjjkk",
    "..................klllkkllklkkkejkkkkkkffjjeabbajjjiijjjjiiieeeeeejjkkaccfklllkjfkkllllkkkjjjk",
    "...................kllkkkkkkkkkfkkkkabeiiiieaaafiiiijjjjjjeeeeeeejjjkfHebbkllllkfjkkkllkkkkkj",
    "....................lkkkkkkkkkekkkkkkbbjjjiiijfffffjjjjjeeeeeeeefffjkeHebbjkllllkijkkkkkkkklk",
    "....................kklkkkkkkjfklklkbbcjkjfffjjfjjjjjkjjeeeeeeiieffjkjeccjkklllllkikkjjkkklk",
    "......................kkkkkkkekllllkakajjjjjjjjjajkkbjjjbeeeeeeeeeejkkjefkjlkkkllljekkjkkkk",
    ".......................kkjkkfjkllllkkkkijjjkjjbbacbbbbaabeeeeeeeeffjkkkkklkkkkllllkffkjk",
    "...........................jikllllkkkkfifjkccccbabaabbaeeeeiiiiefffjjkkkkkkkkllllllkij",
    "............................klklllklkkkjfkaccccbbbbabbaeeeeiffieejjjjjkkkkkkjllllkkkk",
    "............................klklllllkkkjjjaacbbbbabaaaeeeeeieeffiijjkkkkkkkkkklklkkkk",
    "............................kkkllklllkljjjaacbbcbaaaaaeeeeeeeeiiiijjkkkkkkkkkkklkkkkk",
    ".............................kllkklllkljjaabbbbcbbacbbeeeeeeeeeeeeffjkkkkkkkklkllllk",
    "..............................klkkklkkkkeebbbbccebebbbbeeefeeeebejjjkkkkkkkkkkkklllk",
    "..............................kkkkklkkkk.ebebbcaaeeeebceebjjjeee.jjjjkkkkkkkkkkkklk",
    "...............................kkkllkkk..eeeeeaeeaeeeecbbbbjjjeee...kkkkkkkkkkjkk",
    "..................................lkkk...bbeeaaaaaeebebbbbbbjjieee...kkkkkkkkkkj",
    ".........................................bbbeeaaaacccbebbcccbjieeei....kkkkkkk",
    "..........................................bbbccbccdGddebeeccbbiiee......jkkk",
    "..........................................bbbcGbcGHHGGaaaebgbbaieee",
    "..........................................ggbdHHcHHHHGGabeeggbaieee",
    "..........................................ggcGHHcHHHHGGaeeeggcbieeb",
    "..........................................cccGHHcHHHHHbaeeeeccbeee",
    "............................................bGHHcHHHggGGeeeeccceeee",
    "............................................gbggggdHHHHGaaeebaaaeee",
    "...........................................gGGHHHddHHHHdaaeeeeaeeeee",
    "...........................................ggGHHHdHHHHGdaaeeee.eeieei",
    ".............................................gHHHcHHHHdcaeeee...iieeii",
    "..............................................GHHHGHGbbaaaeee....eeeiii",
    "..............................................gbccbbbbbcaaeee.....aaaii",
    "...............................................gHHbHHccdaeee......aaaaii",
    "................................................gHGbccccaeee......aaaaib",
    "................................................cccebbbbeee........aaeee",
    ".................................................bbeeaaeeee........eeeee",
    "..................................................beeeeeeee..........eee",
    "....................................................eeeeee............e",
    ".....................................................eeee",
    "......................................................eii",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
  legend: {
    A: { pal: C.amber, glow: true },
    E: { pal: C.goldLight, glow: true },
    G: { pal: C.amber, glow: true, light: true },
    H: { pal: C.goldLight, glow: true, light: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    d: { m: "fur", step: 3 },
    e: { m: "shadow", step: 0 },
    f: { m: "shadow", step: 2 },
    g: { m: "spot", step: 1 },
    h: { m: "spot", step: 2 },
    i: { m: "wing", step: 0 },
    j: { m: "wing", step: 1 },
    k: { m: "wing", step: 2 },
    l: { m: "wing", step: 3 }
  },
  idle: {
    // Hovering: the whole body rises and sinks on its wingbeat (the waist two rows short of the
    // last, so the highest beat lifts nothing from under the grid).
    waist: 72,
    breath: [0, 1, 1, 2, 2, 1, 1, 0, 0, 0],
    // Once in a cycle, the near wing beats.
    twitch: {
      frames: [5],
      patches: [
        { x: 0, y: -1, rows: ["", "", "", "", "....iiiiiiiffjji", ".fii...ff..ii.i.fffi", "j.ffjjjjjjffkkjf..i.ii", ".kjj.f.f..jj..kkkij..jjjj", "_.kk..f...kk....llkkj....jj", "...jf..j..jj....k.l.kk.ii..jj", "._j.j.jkkkkk.ll..kk...kk.i...ee", ".._.kj......l..lllll....kj...jjj", "..._.k......kk...kk.ll...keee...j.....a", "...._.k.......kkk.l.k....jf..e...j.....a", "....._......j.......jkjjee.ff.e...j..._", "......_.....k.....kjie..kkkkkj.ei.aa..._", "......._........jfefkklk....j....i..a", "........_.jj..jeejkk...ll.llk.j.eeef.a", "........._..jifkkk...l.....kii.k...a..a", ".........._..kk....ll...klki.kk.jj.e", "...........kk......kk...feijk.l..k..e..a", "..........._.......ll..jjjkkll..k....e", "...................kkkfikl.l...l..f...e", "............_.j......f.klk.jfj..l.ejj..e", "..............k.....i.kl.lfcc.k.....k", "..............l..j.ifk....a.eda..jjk.k", ".............__...jjk.l..kj.dbk.k.....j", "...............__..k..k...kjef..j.k...kj", "................._kl...kklllkklk.k....j", "....................ll..l.k...ke......kf", "..................______________________"] }
      ]
    }
  }
};
