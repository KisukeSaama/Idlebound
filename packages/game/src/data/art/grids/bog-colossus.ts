import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Mire Colossus (BIBLE 8.4): the whole east field, standing up. A hunched mountain of
 * peat and mud on arms like felled trunks, knuckles in the mire; reeds and roots bristle
 * from its shoulders, the fence posts of the field push out of its chest like ribs, still
 * strung with wire, and a rusted plough blade is driven into its side. Its head is a lump
 * sunk between the shoulders, a mouth of stones, and deep in the peat two points of sick
 * light.
 */
export const BOG_COLOSSUS: CreatureGrid = {
  rows: [
    "",
    "",
    "........................................g",
    "....................................g...ig",
    "....................................gg...g..........ee",
    ".....................................g.............eed",
    ".....................................gg..g.........edd",
    "......................................g.g.gf.......ffd....fd...i",
    ".........................e.............ggggfg......ffd....fd..ig....dd",
    "........................eee.....f...eeeggggggff....fje....fd..g....fdd",
    ".........................eee.....gg.eedhggggghhfff.fje....eg.......fdd",
    ".........................eee......ggffdhfggggfffffffbef.geee.g....ffd",
    "..........................eee....ggggfddfggggeffddeebdf.fed.gg.ee.fdd",
    "...........................eee..glgggffdffggeeffddeebdfffed.g..eefbd",
    ".......................g...eeehggggggffdfefgffffbdeeddeffeg.gg.e.fbd....eed",
    "...................ee..ggg..ehhggggggfeddefgffffbdddddeeeegeggeeffd.g...eed",
    "...................eee...gg.hhffeeeeggeedeefgggffddddddeegffg.eefdd.g..fed",
    "....................eee...hhhhefeheeggeeddefgggffjddddeeggfgeeeehd.g...fed",
    ".....................ee..fhhheehhheeeggdddeggggffjddddffgdfgdeehdd....eed....fdd",
    "......................eeglgghhehhhheeegdddefgggffaddddeffdffddehddf...edd...ffd",
    "......................eegggghehhhhheeddfffgffeeefadeeeeffeeeeedddef.eddd....ff",
    ".......................ggggggehheeeeeddfggggfddefadeeeeefgeeeehddeeeeddd...ggd",
    "......................ggggggggheedeeeedggggggddeeaddeeeeeedddcdddeeeddd...ged",
    "......................ggggiggghhedddeedggggggeedeaddffeeeefffcddddeeddd..gdd",
    ".....................ggggggghhheeddhdddddgffgeddddggggfffggffddddddddde..dd",
    "....................ggggggghhhedeeedddddddffgfdeeggggefgggeedddddddeeee.ffg",
    "...................hggegggghheeddeedddddddffffdeegggeeggggdddddddddeeeeeff....ed",
    "...................hgggeggghdedeeeddddddddefffdeeffeeggggggddddddddeeeeef....jddd",
    "...................eeggeghhddddeeddddeddddegfddeeeedfggggggddddgdddddeedd....jjd.gg",
    "....................efeeehhlEEdeedggeedddddgfdegggedfgggggeefdjjgdddddeddh..jje.gg",
    "....................kEheahhllhhhhffffdddddegfdeggddeegglgeefffjjefddddddee.jjeegg.....ee",
    "....................lhhhhhhklkhhhfddddddddeffddfeddeehhhhehgggjjfffddddde..ajelg......de",
    "....................gghhhhhkkkhffdddddddddeeedffeeeffeeeeehggggfeefddddddddad........bb",
    "....................gghhhhhhhdfffeeddffdddeeddggffefggeedgfggggfeeefddddddddd.......bb",
    "....................gfhhhhffgdddffefffedddeedggffgeeeeeddffggfffedefdddddddd.dfe...bbb",
    "....................gffhhddddddddfeefeeddddeegffggeeedeeffeefffffddfddddddddd..dd..bb",
    "....................eeeehddddddddgeefedddddddgfgggeeddeeegeddeedfddddddeeddd...ddddd",
    "....................geeddddddddddggeeddddddddffggeeddddeeeeddeddddddddfffeee....dddd",
    "....................geededjdeedffgeeddddddddfffffeegeeddaaaeedddddddddfffeee....ffddd",
    "....................geheejjfffggfdddddddddeffffffegggeeddddeddddddddddfffeeee...fddddd",
    "....................ffheffefffggdddddddddeefeeddfiggeedddddddddddddddeeffedde..eadd.ddd",
    "....................ffeeggggffffdddddddddddeeeggfgdddddddddddddddddddeedeedddddjdd...dd",
    "...................ffhegggggfeeeddddddddddddegggggddddddddddddhhdddddddddeedddjjdd",
    "...................hhheeeddeeeedddddddddddddeggggghhddddddddehhhhhhbdhdddddddbbdd",
    "..................hhhheffdddeeedddddddddddddeeggehhhddddddddeehhghhhahdddeeddaddd",
    "..................hfhdhhedddddeeeddddddddeffeeeehhdddddddddddeehghhjjeeegffddddd",
    ".................gffddhheedddddeeedddddddefffeeeeeeddddddddddeehhhhjjeegggggddddd",
    "...............kkgfddffeedddddddedddddddddddffeeedddddddddddddeehhhgfegggggggfddde",
    "..............kgggfddeeeeddddddddddddddddddddddgddddddddddddddddehhgffigeagggfffee",
    ".............kkggggddeddddddddd.eedddddddddddddedddddddddddddddddeefffgaaaeggggfeeee",
    ".............lggggddddddddddddd...ddddddddddffdedddddddddddddddddeedddeaaaggggggfddee",
    "............ggggggddddddddddd.....eeddddddddfgggeeedddddddddddddddddddeaaaffgggfffdee",
    "...........gggdgggadddddddddd........eeddddddddeeeddddddddddddddddddddddaahhegggffeee",
    "...........lhdhheaaddddddddd.........eeddddddddddddddddddddddddddddddddddhhheiggffeeee",
    "...........heghhhjaddddddddd..........dddddddddddddddddddddddddddddddddddhhheeggfffeee",
    "...........hgghhhjaddddddddd........eeeddddeedfggfedddddddddddddddddddddhhhhaaggfffeee",
    "..........ggghhhhhddddddddd........feeedddeffefggfeeddddeeddddddddddddddhhhhhaddgfeeeee",
    "..........ggfhhhhedddddddddd......ffddddddeeddeeeeeeddddeeddddddddddddeehhhhhdddgfeedde",
    "..........fdfggggeddddfdddd.....feddddddddddddddeeeddddeeedeeddaddddddejhhhhhdddddfede",
    ".........fffgggggddddffdddd....ffdddddddddddddddeeddddffddeeedjaddddddjjjhjhddjaddfeee",
    ".........ffggggddddaaffdddd..fffddeeeddddddddeddeedffffddeeeejjadddddeehhjjjadjaadddee",
    ".........fgggeeeddddeedddd...ffeeeeeeeeddddddeffffggffdddeeeeadddddddehahhjhaaaaaddddd",
    ".........fggeeehdddddddddd..ffeeeeedddddddddddffffffdddddeeeaddddddddehahgehaadddddddd",
    "........eeddadhhffdddddddd..feeeffedddddeeddddddeeeeddddddeeddddfddddeaahgeeafffdddddd",
    "........eeddadhhffddddddd..ffeeeffedddddeedddddddeedddddddffddfffdddddaahhhhhggedddddee",
    "........eeddjbhhfddddddd...feeffffedddaadeddddddddedddddddffeggfffdddddehdhhddeeddddd.e",
    ".........fddjbhjaaddddd....ddddffddddeeaddddddddddddddddddfeegggffdddddhhhhhajddddddd",
    ".........fdhhbhjaaddddd....ddddeeddddeddddddddddddddddddddfeegggffdddddehhhhajdddddd",
    "........efdhjjhggdddd......edddeedddddddddddddddddddddddddfffigfffedddggejhaaddddddd",
    "........eedhjeggdddd.......eedddddddddddddddddddddddddddddfffgggfeeddgggjjjajddddddd",
    "........eedhegggdddd.......eedddddddddddddddddd..dd..dddddfdfgggfddddddjjhjjjdddddde",
    "........eeehegggdddd........eeddddddddddddd..d......dddd.eeddfffdddddgejjhajjdddddde",
    "........eeehgggfjddd.........eddddddddddddd.........ddd...edddddddddggehhhaaffdddddd",
    "........ffffgggajffdd.........edddddddddddd........aadd....dddddddddgeahhhdggfddddd",
    ".......fffffgghadggfed........edddddddddddd........aadd....ddddddddgdfhhhhfgdddddddd",
    ".......gfefggdhdddgfed.......eddddddddddddd.......aaaddd.....dddddddddhhhffddddddddd",
    ".......ddeegddffddeeedd.....eeddddddddddddd.......aaaedd.....ddddddddjhhggddaadddddd",
    ".......fddeedddffdddffdddhdeeedddeeedddddddd......aaeed........dddddjjhhfddjjaddddd",
    "......ffddeeadddhdddeejaddddddeeeeeeddddddddd.....aa.e...........dddhdgifddjjdddddd",
    ".....eddddeeadddddddddjaddddddeeeeddddddddddd....................ddghggffddfhdddddd",
    ".....eddddeeddddddddddaddddddddedddddddddddddd...................dgggggffdefdddedddd",
    ".....eddddddddddddddddaaddddddddddddddddddddd...................jjggggffffeahadefddd",
    "....ddddddddddddddjddddadddddddddd..d..........................jjjggeeefffdahadefddddd.d",
    ".....dddd.ddddddddjddddddd....................................ejjjddddeffdddhdddfedddddddd",
    "..........ddd.....dd.........................................eejjdddddbjddddffddfeddddddddd",
    "..........................................................eggeeeddddddbjddddeeddddddddddddd",
    ".....................................................ee.eeggeeheddddddddddddddddddddddd",
    "...................................................gggggggggeeheddddddddddddddddddddddd",
    ".................................................fggggggfffgehdddddddddaddddddddddddddd",
    "................................................ffffffffffffedddddddddhadddddddddddd",
    ".............................................................d.......dddddddddd",
    "......................................................................dd"
  ],
  legend: {
    E: { pal: C.mireLight, glow: true },
    a: { m: "iron", step: 0 },
    b: { m: "iron", step: 2 },
    c: { m: "iron", step: 3 },
    d: { m: "peat", step: 0 },
    e: { m: "peat", step: 1 },
    f: { m: "peat", step: 2 },
    g: { m: "peat", step: 3 },
    h: { m: "peat", step: 4 },
    i: { m: "reed", step: 3 },
    j: { m: "wood", step: 1 },
    k: { m: "wood", step: 3 },
    l: { m: "wood", step: 4 }
  },
  idle: {
    // A breath like a field settling: slow, heavy, a long rest between.
    waist: 56,
    breath: [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    // Once in a cycle, the sunken head lurches toward the company.
    twitch: {
      frames: [8],
      patches: [
        { x: 9, y: 15, rows: ["..........__..___.._________________", ".........e.__ggg__e..ggggggfeddefg._", ".........ee.__.gg_..ffe.e.g.e.deefg_", "..........ee._..h....fe.e.ggee..ef._", "...........ee__fhhheeh..ee.ggd..egg_", "............e.gl..h......e..g.ddefg_", "............ee....heh..hh..d.f.f.ff_", "...................eh...e..ddf....f_", "............g....g..heedeee.dg....._", "................i..g...d..ee.ggg.gg_", "......................eddh.....gf.g_", "..........g..g...h...dee.d......f.g_", ".........hg.e.g..h.e..d.........ff._", ".........hgg.eg.g..e.e......d...eff_", ".........eegg.gh.dddde.d.dd.d...egf_", "..........efee.h.lEEdeedggee.....gf_", "..........kE.ea..llhh..f.ff.....eg._", "..........lhh....kl.h.h.........eff_", "..........g.h....kkkh..ddd..dd..e.._", "..........g.h....hhdfffeedd..d..e.d_", "..........gfhh..ffg...ffeff..d..eed_", "..........gffhhd.......fe.fe.....ee_", "..........ee..h........geef........_", "..........ge.d.d.d.dd.dg..........._", "..........ge.d.d.deedffgee.......d._", "..........gehe.jjf..g.f..........f._", "..........f.h.ffeff.ggd........eef._", "............e.....f.ffd..........ee_", ".........ff.egggggf...............e_", "............e.ed.ee..d............e_", "........h.h.effd..eeeddd........dde_", "........h.h.h.edd...ee.dd......ef.e_", "......_gf...hh.......ee........efff_", "......k.fd.ff..d......e...........f_", ".....g..fd.e.ee.......ddd.........._", "...kk......e..........eed"] }
      ]
    }
  }
};
