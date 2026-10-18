import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Weeping Stag (BIBLE 8.2), a rare wanderer of the Wychwood: its tears are sap; its
 * antlers hold a nest of stars. A tall gaunt stag, ribs and hip bones showing under a thin
 * hide, moss grown over its withers and flanks and hanging from its belly; the long head
 * lowered at the company, the brow tines leveled, a forehoof pawing, amber sap running from
 * a burning eye down the face. The antlers spread wide and bend into a crown, and in their
 * crook a nest of twigs holds a few small cold stars.
 */
export const WEEPING_STAG: CreatureGrid = {
  rows: [
    "",
    "....................................g",
    "...............aa...................bb",
    "...............ba...................bc..bb",
    "..............bb.....................bc.bg....ba",
    "..............ba.....................acbbg....ca",
    ".............aca......................bccce..bc",
    "..........b..bca......................accce..cb",
    ".........ab..bba.......................bccbacc",
    ".........ab.aba........................accbcc",
    ".........ababba........................acccc",
    "..........aabba........................accbbd",
    ".aa.......abbb.........................accb",
    ".ag.......aabb....................c....bccb",
    ".ac........abbe...................ch...bccb",
    ".ac........abba...................cg..bccge",
    "..bg.g......bba...................bc..bccbe",
    "..acag......abb...................ac.bccca",
    "..abcc......abba..................aaacccaeaea",
    "...acc...bE..bba..................eaaccadddaeee",
    "...aacg..bb..abb................ada.ag.ddddddaaee",
    "....agg......abba..............adaa...daeedddddaaaa",
    ".....ac.......bba............aeelb...dhhaeeeddddddaaa",
    ".....abg.fgL..abb............eeebb..dhhhaeddddddddddaae",
    "......acf.....abb...........aeebb..dhhhhhhadiiiidddeeeeda",
    "......bab.....abba.........eeabca.dahhhhhhhadijjddddaaedd",
    "..f.dddbbbfe..abbb...g....aebcca.ddiehhhhhhaddlllldddaedd",
    "..feebbEbcff..abbb...gg...accgd.dddeehhihhaadddlllldddeedd",
    ".eeeibEEbacfb.abafaa.eg.bbccgddddddieehhiheeeddlllllddaeddd",
    "..eeebbbbifcg.abbfdlaeafccgadddiiiddfhhieiaaeddlaalddddddddd",
    "..eieeeeeeifcgaafffffadagfdddeeiddfdfihdfeededddeelddkdidddd",
    "...iiieeeiiifggefffffaddaiaddfiidfdddfhiffddedddaeellkiiddddd",
    "....iiiiiifeefgefeefddddiiidffiidfeaddihefedidddaadddliiddddld",
    ".....eidiieeiddeeefediiiiieffiiifeeefddhefedidddeadddliidaddld",
    ".......dddiiiiddeffeeeiiieediifeeeeefddheeeddddeeeldlljiddddjd",
    "........ddiiiiddefeefgeeeeddfffeeeefdddhffeddddeeelllljidddijii",
    ".........dddiiddefeefgfddddiilleeeedldjdffeddiidedllkkijjddiji",
    "..........ddiidfdeeffggfddiiiilllekddjjegfeddiddddkkjjiijdiiki",
    "............dffffffffgfiidiiiddldkkddjjegfeididkddjjjiillliik",
    "............fgffffffffAAdeijjddjddlldddfgfeikjjkjdjjjiilfliik",
    "............dfdffffddiffdeejjddjdjlljdeggfeikjjkjdjkliidfkjjj",
    ".............diffgffdgfddefjjddjjjljjiegffekkijjjjkklieefljji",
    ".............adffgffffddeefdjdkkkjjjjifgffdddiijjkkkiieeeljii",
    ".............affffffffdeeffdiiidjjjiiifffedkddijjkkiiifeljjji",
    "..............afggfffdffeeeiijidiijiiiiffekkddijllliiifdljjji",
    "..............afggffffffdeeiijjijiiiiiidddkdddiklldiikfddijji",
    "..............affffffffddjjiiijijiiiiiijjjkklliklldiidffiijji",
    ".............affffffffddijiidiiijiiiiiiijjjklliidiiiiifdijjj",
    ".............afffffffeeiiidddddjjiiiieeiijjiiiiiiiiiijjiiijd",
    "............eaeeefffeeiidd.dddddjiiijkdddiefjiiiiiiiijjjiild",
    "............aaaaifffiiia....diiddiiijkiiieffejiiiiiiiijdilld",
    "............ddkiifffiii.....aiiddiiiiiiiiigfejiiiiiiiijdlll",
    "............ddiiffffia......aeidddidiiiiiegfejiddidddijkklll",
    ".............eiiifdf.........eiididdiiiidegfdii..ddd..jkllld",
    "..............eifgdg.........iiididdddd.ddgedii...ed..ddllji",
    "................fg..........aiiiiiddd.d..efedii...ea...dklji",
    "................fg..........eiiiiiddd....efeeiii.......dkjji",
    "................gg.........ejijji.ad.....efejiii........jjjii",
    "................gg........eejijj...a.....efejdiii.......diiij",
    "................gg........edddd..........ffdddiiid.......djij",
    "................gg.......aeffdd..........ffdddiidd.......djji",
    "................gg.......aeeedd..........ffddddid........ejji",
    "................gg.......diikk..........ffgfddddd........edji",
    "................gg........diik..........afgfdddd.........edkd",
    ".................gg.......dii...........adfdiddd..........dkd",
    ".................g........dijk..........ddddidd..........dlj",
    "...........................djk...........ddjidd..........dlj",
    ".................g.........dij...........ejjidd..........dli",
    ".................gg........diji..........efiddd..........eki",
    ".................gg........adiii.........efidii..........ekd",
    ".................gg........adddd.........feidi...........dkd",
    "................gg..........dddd.........feiii..........ddk",
    "............................ddfdd........fdiii..........ddd",
    "............................dddii........fdiii..........ddkd",
    "............................diiii.......dfeiid.........dllkd",
    "............................diiii.......dfeiida........dllkd",
    "............................eiiii.....dddgfiida.......iiiddd",
    "...........................aeiiii..aeeddfffiidee.....iiiiddd",
    "..........................bddiii...eedddfffddeeeee..iiiiiddd",
    ".........................addllji...ddddddfdd.eeeee..iiiiidiid",
    ".......................baaddiiji......dddfdi....e...iiiiiii",
    ".......................aedddiii......iiiehhi",
    "........................iiiiiii.....iiiiihhddd",
    ".........................e..........diiilihddhhb",
    "....................................diidliiihhhh",
    ".....................................aiee"
  ],
  legend: {
    A: { pal: C.goldLight, glow: true },
    E: { pal: C.moon, glow: true, light: true },
    L: { pal: C.goldLight, glow: true, light: true },
    a: { m: "antler", step: 1 },
    b: { m: "antler", step: 2 },
    c: { m: "antler", step: 3 },
    d: { m: "fur", step: 0 },
    e: { m: "fur", step: 1 },
    f: { m: "fur", step: 2 },
    g: { m: "fur", step: 3 },
    h: { m: "moss", step: 2 },
    i: { m: "shade", step: 0 },
    j: { m: "shade", step: 1 },
    k: { m: "shade", step: 2 },
    l: { m: "shade", step: 3 }
  },
  idle: {
    // A long, slow breath: the ribs rise under the hide and the crown sways.
    waist: 48,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the head dips lower, the tines levelled at the company.
    twitch: {
      frames: [8],
      patches: [
        { x: 0, y: 0, rows: ["", "...................................._", "...............__...................g_", "...............a.....................b", ".............._.a...................bc_", "...............b.....................b._", "............._b......................acb", ".........._..a........................b", "........._....c.......................ac", "............_.ba.......................b", "..........._a", ".........ab", ".__........a..a", "..a........b......................_....a", "..g.......a..._...................._", "..............e....................h.._b", ".ac_._.....a......................cg", "..bg_.......b.a...................b.._b", "...cag........._...................c_b", "..ab.....__.a.....................a....c", "....c._...E..b.a................__ea.cca", "...a.c...bb....._.............._ad..ag_d", "....agg......a...............__adaa.._da", "......c_.___..b.a............a..l..._d", ".....abg_fgL................_..e.b._d", "......acf........_........._aeebb._d", ".._.__ba.___.....a..._...._.eabca_.ah", "..._dddb.b.e.........._....ebcca_..i...h", "._f.e.b..cf._...bb__.g..__a.cg._...e.h.i", ".e..i.EE.acfb...a.aa_.g_bbccg..ddd.iee.h", "...e.bbbbifcg_.bb.dlaeafccga.dd.iid..h.i", "..e.ee...e.fc.aa.......agfd..ee..df.fi.d", "...i..eee.iifg...ff.fa..a.a.d.....dd.fhi", "....ii.i..f.efg.f.ef.ddd..id.f..df.ad.i", ".....ei.iiee.d.e.e..di...i.ff.iif", ".......d..........f.eeiii.e.ii.....ef", "........d.ii..........eeee.dfff....fd.dh", ".........d.....def.e..fd..d..l.ee.e.ld.d", "..........ddiid.dee...gfd....il.le", "............df.......gfiid.ii..l.kkd.jje", "............fgf....fffAA..i......d..d.df", "............dfd..f.d.i.f..e.....d..l.d", ".............di.....dgf.d..j..djj.l...e", "..............d..g.....d.e..jdkkk..jj..g", ".............af.ff...fde.ffd.i..jj....f", ".....................d..e.....idi.j....f", "................gg.....f.ee..j.........d", "............._a.......f.d.j.i.j........j", ".....................fdd.jii.iii.....ii", "............_.fff...f.e.iid....j....ieei", "............e.eee...ee.idd.d.dd.j.....dd", "............aaaa.......a....d.......jk", "..............k.i....ii......i...i.i"] }
      ]
    }
  }
};
