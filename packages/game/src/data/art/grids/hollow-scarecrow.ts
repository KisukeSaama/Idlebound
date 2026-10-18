import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hollow Scarecrow (BIBLE 8.1): stuffed with the last harvest, it guards fields no one
 * will reap. A sack head stuffed too full and lolling toward the company, eyes cut on a
 * slant and lit from inside, a grin cut ear to ear and sewn shut; a long violet coat torn
 * into points over the straw, a rusted sickle held out. A crow keeps watch on the far arm.
 */
export const HOLLOW_SCARECROW: CreatureGrid = {
  rows: [
    "............................ff",
    "...........................fff.l",
    "..........................gfffghh",
    "..........................eiffgg.h",
    "........................fgggfghhhgh",
    "......................fffghhhghhhggf",
    ".....................ggghgghhggffffa",
    "....................ghhhhhhghhgffffa",
    "...................ghhhhhhhhgggfeea",
    "..................fghhhhhhhhgfffea",
    ".................ffghhhhhhhhggeeea",
    ".................ggghhhhhgggggeeea..h",
    ".................fhgghhhhggggggfee.hhh",
    ".................fhhhhhfiggggggfaaggh",
    "................ffgghglEEhffffffaafllhh",
    "................figgffllhggEEffeeifgghg",
    "................ffhhggghggiefgfeeifgggh",
    "................gghhhhhhhggggggeeellllhh",
    "................fghhhhhhggggggfffllllggh",
    "................fhhhhhhghhghgfeellllllgg",
    "................fhhhhghhhhhhffelllfflegg.......aai",
    ".................fgghhhhgghffelllkggeiigh....aaiiii",
    ".................fgghhggggeeellgaddkkiiih.....iiaaii",
    "..................ffgghhffeelllgdddkkcib.......iiiaii",
    "..................ffghgeiielllfgdddddkkj.......iiaaiii",
    "..................faeeeeeellllcgddkddkkj.......iiaaaiii",
    "...................geeffffllllkkddkdddcjj......iiaaabiii",
    "....................eeffflllllkdkcdddddjj......iiaaibbii",
    "....................efffflllgghdkkddddddjj......iiaiiiiii",
    "....................eefiglllggddkbkkddddjjb.....iibbiiiii",
    "....................iifigliljdadkikkddddjjc......iiiiiiii",
    "....................iigfeligjdddkiikkddjkkbj......iiiiiiii",
    "....................iifjblfkddkdkbiikddjkkkjj......iiiiiii",
    "....................iibjjgfkddkdkbiiidjccddkc.......iiiiiii",
    "...................biibjcgfkddkkkkiiijbbdddkcc.....i.aiiiii",
    "......aaa..........biibjccdddddkkcbiibbkddddccc...iiaa.iii",
    ".....ggg...........bbibjcdddkddjkcbiibbkdddddcee...iia.iiib",
    "...ggff...........bbbbbjjdddkddkkcbiiibkkdddaggff......iibb",
    "...gfff...........bjjbbjjdddkddkbjbiibbbkkddhhgff.......iiba",
    "..fffff..........bbjjbbjjkkddkddbjbbib.bkkghhhhfff......iiia",
    ".aaffff........fgbkkkbbjkkkddkddbbjbib..bcghhhffiff......i",
    ".aaaffff.......gggkkbbjjkkkddkdddbjbibb.bfghhfghggh",
    "aa...ffff.....ffhhgbbijjkkkddkdddbbbibb..ffggghhhgg",
    "aa.....faf....ifhhhfiijkkkdddkdddkbbbbc..ffgihhhhggg",
    "a.......aff..fgffggfiijkkbddddkddkbbbbc...fffhgghfgggf",
    ".........ffffggheeeeeajkkiddddkdddbbbbc....ffhiiffgfff",
    "..........ffffhhiieeaajkcikdddkdddkbbbbj...efg.gggfff",
    "...........iffhfiiie.bbkcikkddkdddkbbbbb.........gfff",
    "..........ffiffifgie.bbkiikkkdkddddbbbbb.........f.ff",
    "..........egfffff....bjkbicckddddddkjbbjj",
    "...........eeffff....bjkbiikkddkdddkjbbbc",
    "............eeeeff...bkkiiikkddkddddjjbbc",
    "................ffe..bkkiiikkdkdjdddkjjbjj",
    ".................eeeibkdiiikkdkdedddkjjbbj",
    "..................eeibkdiiikkdddegeddkjjbj",
    "...................eijkdiiikkdddeggcdkjjbbb",
    "....................bjkkieikkddddghgkkkbbbj",
    "....................bjkkeeibkkddddgakkkbbbj",
    "....................bckbfeibkkddddeakkkbbbbb",
    "....................bckefeiikkddddcgkkkkbbbb",
    "...................bbckeeiiikkddddddikkkbbbbb",
    "...................bjckeeiiikkddddddiikkbbbbb",
    "...................bjkkiiiiikkddddddiiikkjbbb",
    "...................bjkiiieiiikddddddiiikkjbbbb",
    "..................bbjjiieeiiikkddcddkiiikjbbbb",
    "..................bbjkiieeiiikkddcbdkiiikcbbbb",
    "..................bbkkiieeeiikkkdkiddkiiccbbbbb",
    "..................ibkjiieeeijjkkkkicdkbbbkbbbbb",
    "..................ibkjiieeea.jjccdiidkc.bkbbbbb",
    "...................ccc..eeea...ccdbickcbbbj.bbbb",
    "....................c...eee....ccdceedbb..j.bb.b",
    "........................eee......cceeeib",
    "........................eeei......c.eeii",
    "........................eeei........ffia",
    ".......................eeeei........fffa",
    ".....................efffeeia.......fffaa",
    ".................ffeeefffeeea.......ffffa",
    "................fffeeffeeeeii.......ffgfa",
    "................fffffffe............fggfa",
    "..................fefe..............gggffi",
    "...................................fffgffi",
    "..................................efifgiff",
    "..................................eeiffife",
    "..................................ee....ee"
  ],
  legend: {
    E: { pal: C.goldLight, glow: true },
    a: { m: "blade", step: 0 },
    b: { m: "coat", step: 0 },
    c: { m: "coat", step: 1 },
    d: { m: "coat", step: 2 },
    e: { m: "sack", step: 0 },
    f: { m: "sack", step: 1 },
    g: { m: "sack", step: 2 },
    h: { m: "sack", step: 3 },
    i: { m: "shadow", step: 0 },
    j: { m: "shadow", step: 3 },
    k: { m: "shadow", step: 4 },
    l: { m: "straw", step: 1 }
  },
  idle: {
    // No breath: the wind, leaning the sack and the coat, then letting go.
    waist: 52,
    breath: [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the heavy sack head lolls a little further.
    twitch: {
      frames: [8],
      patches: [
        { x: 16, y: 0, rows: ["............__", "............._._", "..........f.._l__", ".........gff.ghh._", "........_eif..g_.__", "......_.g.gfgh..gh__", ".....fffghh.ghhhgg._", ".....gg.gg.hggf...a_", "..........g.h.f.ff", "..gh.......g.g.e", "..gh.......gfff.a_", "ff.h.....hh..e..a_.._", "ggghh...g....eeea_..__", "fhgg...hg.....fee_hh", ".hhh.hfigggggg.a.ggh___", ".g.hglEE.ffff..aafllh._", "iggffll...EE.fe.ifg.h._", "fh.ggg.ggief.fe.ifgggh__", "gh............eee....hh_", "g.......gg.g..ff....ggh_", "h....hg..g.g.e....ll.g._", "hhhhg...hh.......ffl.gg_", "fg.h..h..hff...lkggei.g"] }
      ]
    }
  }
};
