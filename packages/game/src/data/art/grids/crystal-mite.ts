import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Crystal Mite (BIBLE 8.3): it eats sky-glass and excretes smaller sky-glass. A mite
 * the size of a hound, low on eight jointed, spiked legs under a wide dome of dark blue
 * plates; prisms of blue and violet sky-glass have grown through the shell and lean back
 * from its crown. The head is low under a lip of shell, a pair of hooked mandibles open,
 * a cluster of four cold eyes; its leavings glitter on the ground behind it.
 */
export const CRYSTAL_MITE: CreatureGrid = {
  rows: [
    "",
    "...........................................................bb",
    "..........................................................bbb",
    ".........................................................bbbga............ji",
    "........................................................bbbgga...........jji",
    "........................................................bbbgga.........jjjii",
    "........................bb.............................bbbbgga........jjjjii",
    ".......................abbb............bb..............bbbaaga.......kkjiiii",
    ".......................abbbb...........bbb.............bbbaaga.......ggkgiii",
    ".......................bbbbbb..........bbb............bbbbbagg......bgjjggii",
    ".......................bbbbbaa........bbbba...........bbbbbagg......bjjjgiii",
    ".......................bbbbaaa........bbbga...........bbbbbgg......bjjjjgii",
    ".......................bbbaaaba.......bbgga..........bbgbbbgg......bjjjgjii",
    ".......................aabbaaba.......bbaaa..j.......bgggaagg....ggjjjjgiii",
    "........................abbagaa.......bbaaa.gjj......bgggggg...bbggjjjjjii",
    "........................abbbggaa......bbggg.gjj.....bbjggggg..aaaggjaggjii",
    ".........................bbbgggg......bbggg.gjffaaaabbjggggg..gjjgggaggij",
    ".........................aabggggg.g...bkggjfffaffeffbgggggjj.ggjgkggaggij",
    ".........................aagkggggggj..agjgjdfffeeedfbagggggffgjjggggggijja",
    "..........................aaagabggjj.fagjjeddeffeedbbaaggggafafjggjggjijga",
    "..........................aaaaabggjfafafffeeeeeeeddbbgaaagggeeffjjjjjjijg",
    "..........................gaaaggggffffffgfffffffecebgggagggjccefiiijjijja",
    "..........................gajggfgieeeefkgfffffeeecfgggjjjgjjcdedhhiijijja",
    "..................bb......fajjgffeeeefbkggaffffffffiijjjijjccddcdhhhiijif",
    "..................bbb....fffffeeeeddefbaggaffffffffffiijiiicccccdddhhiidfa",
    "..................bbba..effafeeffeeedabaafffffffffffffiiihcccccccddddedddaa",
    "..................bbaa.eaafffffeefffdggggddff..fffffffffccddeeeeddddddfdddfa",
    "..................aagafbaffffffffffeefgjjddf....afffffeeeceeeffeeedddddfdddea",
    "...................ggaaffffffffffffffffiiceff..ffffffeeeeeceeeeeeedddddefdddfa",
    "..................ffaaafffffff...ffffffeeceff.ffeffffeeeeeeceeeeeeedddeefdddeaa",
    ".................ffaaafffffffa....fffffffeeffffeefffffeeeeeeceeeeeedddeeffddeeaa",
    "................ffaafffffffaa...fffffffffeeeffffffffeeeeeedeeeeeeddddddefffdddfaf",
    "..........effffeffaffffafffaaa.faafffffefeeecfffffeeeeeeedddecedddddddddeeffdddffaaa",
    "......faaaaaffeeefffffffffffffaaaffffffefeeeddfffeeeeeeeedddddcdddddddddeeffcddfffaaaaa",
    "......aaffffffedeeeeeffffffffffffffffffeeededdeeeedeeddeddddddccdddddddddeefcddffaaaaaae",
    "......eeaaafffeddeeeefffeedfffffffffeeeeeddddddeddddddddddddccccdddddddddeeffffffffafeee",
    "......eeeefffffeeeeeffffeecfffffffeeeeedddddddddddeeededeeeeeeceeeeeeeeeeeeeffffeeeeeff",
    ".......eeeeeeeeffeeeffefeeefeeeeeeeeeeeeffeeeffffeeeeeefeeefffffeefffeeeeeedddddcddeee",
    ".........eedddefeefffeeefffffffffeeeeeeefffffffffffeefffffefffffeedddddddddddddcccdd",
    "...........ddddfffffffeeedddddeeffffffffffffffffeeeeedddddddddddddcdddddcccccccccccc",
    "..............dcffffddccedcccdddddddddddddddddddddddcddddddddddddcccccccccccccccccce",
    "................ebcccccdbbccccccccddddddeedcddddddcccccccccccccccccccccccccddcccccd",
    "................dEcccccdbEEccccccccccccccccccccccccccccccccccccccccccccccccdcccddd",
    "...............cddddeeddddeedccccccccccccccccccccccccccccccccccccccccccccccccccdd",
    "..............cceeefffeeeeeeddccccccdddcccccccccccccccdccccccccccccccccccccccccd",
    "............eecceeeeeeffeeddddcccccdddddccccccccccccccdcccccddcccccccccccccccccc",
    "............ddceeeeeeeeceddddcccccccdddcccccccccccccccdddddddccccccccccccccccccce",
    "...........dccckeddddccceecdddcccccccdccccccccccccccccccddddccccccdeecccccdddcccce",
    "...........fdcckeddceccckecdcccccccccdcccccedcccccccccccdcccccccdcdefccccdddccccccf",
    "..........eedccfddecceefkecccccccccccccccceeddcccccdeccccccccccdddcdcdecc....ccccddf",
    ".........eeecccf..e...ekfccccdddcccccccdddeeddcccccdddcccccccccccccdcdfed.....dccdcd",
    ".........eddcc........ff....cddddddddcccdddeddccccccddccccccccccc..dcdeeee.....ddccdd",
    "........dddcc................ddddddddccccddcdccccddcdffcccdcccc......deeeed.....ddcc",
    "........cccc..................eef...ccccefecccccccccddfeffddee.......feeeed......dccd",
    "........eccc..................eee....b.fffedc.....aadeeeaafeeeffg....gddeeec......fddd",
    ".......fdc.....................eee....ffaeddfffffffffeeefffefffffffffffddecce....ggddda",
    ".......ddd................aafeeeeefff.efaeddfffffffffeeeeeeeeffffffffffddcccffffffaaddd..j",
    "......edd.................fffeeeeeffffeffddefffffeffeeeeeeeeeeeeeeeeffffdcdddfaaffffddcdfjj",
    "......edd.......gaa.....affffffeffffeeefeddeeeeeeeeeeeeeeeeeeeeeeeeefffffdddddfffffffecdddd",
    ".....ddd..aa..gggaafffffffefffeeeeeeeddeedeeeeddddeddddeeeeeeeeeeeeeeeffffddddfffffeeeeddde",
    "....dcdd..aa..fffffffeefgeefffeeeeeeecdccdeeeeeeeeeeeeeeeeeeeeeeeffeeefffffddddffffffgfff",
    "..dddcebffaffeefffffffeffeffeeeeeeeeeefdcdeeeeeeeeeeeeeeeeefeeeeeffeeefffffddddeffffjjgf",
    ".ddddeeeeeffgefffffffffeeeefeefeeeeeefddeeeeeeeeeeeeeefeeeeffeeeeeeeffffffffdddefgfgfffa",
    ".........ff..fffffefeeeeeeefefffgeeeefddeeeeeeeeeeeeeefeefffffeegfefaafeeeefdddddffff",
    "...............gbaeeaeeegeeffefeeeegeeddffffffeeeeeeeeeeeeeeeeejjfefgagfffeeeedddd",
    "..................eggafeeeeeeefeeeeeeddfffffeffffeeeggeeefjeaaffffffffffgf.eeeedddd",
    "...................jjgbejgfffffeeffddddjjjffeffffffggjffgfeeaaf.aaaf",
    ".....................gg...gbgg..fffddcffffffeefffffggjggff",
    "...........................gg.....dddceeeeeefffg...ggggg",
    "..................................dddeeeffff.a.....ggg",
    ".................................dddeff.jj",
    ".................................ddee",
    ".................................dd"
  ],
  legend: {
    E: { pal: C.shardLight, glow: true },
    a: { m: "glass", step: 1 },
    b: { m: "glass", step: 2 },
    c: { m: "shell", step: 0 },
    d: { m: "shell", step: 1 },
    e: { m: "shell", step: 2 },
    f: { m: "shell", step: 3 },
    g: { m: "shell", step: 4 },
    h: { m: "violet", step: 0 },
    i: { m: "violet", step: 1 },
    j: { m: "violet", step: 2 },
    k: { m: "violet", step: 3 }
  },
  idle: {
    // The shell lifts and settles on its legs.
    waist: 67,
    breath: [0, 0, 0, 1, 1, 1, 0, 0],
    // Once in a cycle, the mandibles snap shut.
    twitch: {
      frames: [6],
      patches: [
        { x: 9, y: 44, rows: ["....c.e..f..e.....d.c._", "..e.c.e.....f.e.d...c._", "..d.ce.......ced...c.._", ".dc..ked...c..e.cd..c._", ".fdc.ked.cec..kecdc..._", "e.dc.fd.ec.e.fkec....._", "..c..f_.e_..ekfc...d.._", "d.c._.......f._...cd.._", ".c._...............d.._", ".._.................e._", ".._.................e._", ".....................e_"] }
      ]
    }
  }
};
