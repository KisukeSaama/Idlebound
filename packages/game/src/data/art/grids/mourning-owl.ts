import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Mourning Owl (BIBLE 8.2): it asks one question, over and over; the answer is always
 * a name. A great horned owl of the Wychwood, its feathers ragged and barred, the wings
 * mantled high in threat, talons clamped on a root. A veil of grey moss has fallen over its
 * head like a widow's veil and hangs in strands to the breast; under it, two huge pale
 * eyes.
 */
export const MOURNING_OWL: CreatureGrid = {
  rows: [
    "....................aa",
    "....................aaa",
    ".............aa.....ccaa",
    ".............aaaaaa.aaccx....a0.......................................................ccb",
    ".............aaaaaaaaaaacc..aa0.................................................cbccccccb",
    "..............aaxaaaaaaaaaccaa0x.............................................ccccbcccc00",
    ".........aaaaaaaxxaaaaaaaaaaca0x...........................................ccbcccbcc00xx",
    ".........aaaaaaaaaaaaaaaaaaxxa000.........................................ccbbccbbca00x....xx",
    ".........0000aaaaaaaaaaaaaaaaa000.......................................ccccccbbbbaaaxxxxxx",
    "..........00xxaaxaaaaxaaaaaaaaa000....................................cccccccbbbbbaaxxxccbcccc",
    "............aaaaxaaaaxxaaaaaaaa000...................................cccbccbbbbbxxxxbbbbbbbbx0",
    "...........aaaaaaaxxaaaaaaaaaaaa00...........aa....................xccbbbcbbbbxxbbbbbbbbax00x",
    "..........aaaaaaaaxxaaaaaaaaaaaax00.........baa...................xbbcbccbbbbbbbbbbbbbbaaxx0",
    ".........baaaaaaaaaaxaaaaaaxaaaaxx00.......cba...................ccbcbcbbbbbbbbbb00bbbaaxxx",
    ".........000000xxaaaxaaaaaxxaaaaaaxx......ccba..................bbcbcccbbbbbbbbbbb0000aaxx",
    "..........00000xxxaaaaaaaaaxaxxxaxxxx....cccaa.................cbbcbccbbbbbb00bbbbbbbbaaaabb",
    "..............0xxxxaaaaaaxaaaxaxxxxx00..cccbba................ccbcbcbcbbbbbbb00000bbbbaabbbbbb",
    ".........llhh..xxxx0xxaaaxxaaxaaxaax00.xbbbbaa...............cbbbcbccbbbbbbbb0xxxxxxxxxxxxxxxxxb",
    ".........kklhhh..xx00xxaaxxxxaaaaaaa000ccbbbaa..............ccbbbbccbbb00bbb0bbbbbbbbaabbbbbbbbb",
    ".........kkhllhhh.x000xxxxxaaaaaaaaaabbbbbbba...............bcccbcbcbbbbb0000bbbbbbb00aab0000000",
    ".........hkhhhllhh.0000xxaaaaxxaxxaaabbbbbbba..............bbccccbbbbbbbbbbbbbbbbbbb0000000000",
    "........hhkhhhhhllhh0000xaaaaxaaaaaabccbbbbba..............bccccbbb00b00bbbbbbbbbbbba0000000",
    "........hh.hhhhhhhllhhhhhllllhhaaaabbbbbbbbaa.............cbccccbbbb000bbbbbbbbbbbbbaaaa000",
    "........hh.kkkhhhhhhlhlll000hhhhhhhhbbbbbbbaa.............cbc0cbbbbbbbbbbbbbbbxx0000bbbaaax",
    "........h..kkkhhhhhhhhhhh000hhkhhhhhhhhbbbbaa............cccccc0000bbbbbbbbbbbbbxxxxbbbbaabb",
    "........k...kkhhhhkhhhhh0000hhkhhhkhhhhhaaba.............cccccb00bbbbbbbbbbbbb0bbaaaxxxbbbbbb",
    ".......xk...hhhhhhkhkkkh0000hhkkhhkkhhhhhaaa............ccccccbbbbbbbbbbbbb0000bbaaaaaaxxxxbbb",
    ".......hk...hhkhhkkhkkkkkkkkhhkkhhkkkkhhhh..............cc000cbbbbbbb0bbbbbbbbbbbaaaaa000b0xxax",
    "........k...hhkhhkkhkkkkhkkhkhkkhhkkkkhhhhh............bccccccbbbbbbb00bbbbbbbbbbaaaa0xx000000x",
    "........k...hhkhhkkhkkkkhhhhkkkkhhkkkkhhhhhh...........bccbbccbbbbbbbb000bbbxbbbb00aa00x0xxx",
    "...........hhhkhhhkkkkkkhhhhkkkkkkkkkkkhhhhh..........cbcccccbbb0bbbbbxxbbbbbxxbaa00000",
    "...........hhhkhhkkkkkkkhhhh0bbkkkkkkkk000hh..........cbcbccbbbb00000xxbbbbbbbbxbbb00aa",
    "...........hhhkkk00kkbbaakkk0bbkkkkkaaaaxxhhk........cbbbbcbbbbbbb0bbbbbbbbb00bbxxaaaaaa",
    "...........klhk0xx0bbbbbaaak0bbbaaaaaxxxxahhk........ccbbbc00bb0bbbbbbbbbbbbb00000xabbxa",
    "...........klk..h0xxxxbbaaakkbbbaaaxxaaakakkk........cccbbbb0000bbbbbbbbbbbbbaaaaaaxxxxxx",
    "...........klk..habbbbxxxabbkbbbbxxaaaaakakkkc......ccccbbbbbbbbbbbbbbbbx0b00aaaaaaaaxxaaa",
    "...........klk..habbWWWaaxahkaaaxWWWWaaak0kk0ccccbccccccbbbbbbbbbbbbbbbbbx000aaaxx0000xxaaa",
    "...........klk..kkbWEWWWaaxh0aaxWEEWWWaak00k0addcbcdccbcbbbbbbbbbb00bbbbbbxbaaaa00000000x0a",
    "...........hlk.hkkaWE0WWaaax0axaWEW0WWaa000kkkddcccddcbbbbbbbbbbbbb00000abbxaaaa00xxxx00xxx",
    "...........hlk.xh0aaWWWaaaahxaaaaWWWWaa0000kkkddbbcddcbbbbbbb0bbbbbb00bbabbbxbb000",
    "...........hlk.xh.aaaaaa00khxaaaaaaaa000h00kkkddbbddccbbbbbbb00bb00bbbbbbbbaaxba000",
    "...........hk..xh..aa00000khxkaaaaa00000hcckkkddcbccccbbbbxxbxx000bbxbbbaab0acxaaaa",
    "...........hk..xx...aa000aahxkaa00000000hcckkkcccbccccbbbbbbbbbbbbbbbxaaaaa0a00xaaaa",
    "...........hk..hh....aaaaaaaxkaaa0000000kcbbhkccbcbbccbbbbbbbbbbbbbbbxbaaaa000aaxxaa",
    "...........hk..hk......aaaaaxaaa000000bbkcbbhkccbcbbcbbbbxbbbbbbbbbbbbxbb00xxaaaaxaa",
    "...........hk...k.....bbba000000000bbbbckccchkccbbbbbxbbbxbbbbbbbbbbbbx0000000aaaaxaa",
    "...........hkx..k....dcccbbbbbbbbbbbbbbckccchkccbbbbbxbbbbbbbbbbbbbbbaaxxxx000000000a",
    "...........hkx..kx...dcccbbbbbbbbbbbbcccbcchhkcbbbbbxbbbbbbbxxab00b000axaaaa....00000",
    "............kx..xx...ccb00ccccbbbcccccbbb0bhhac00000xbbbbbxxxaabb000aaaaxaxx",
    "............kk..xx...ccbbcccccbcccccbbb000bhh0ccb0bbbbbbbbxxaaabba0xxaaaxaaxx",
    "............hk.......cbbcccccbccccccbbbbbbcc00bbbbbbbbbbbbaaaaabbaxxxxaaaxaaa",
    "............hk.......cbbcccccbc00ccc000b0bch00b0bc0000bbxxbbaaabbaaaxx0axxaaa",
    "............hk.......ccbc000ccc0ccccc00b00chh000ccc00bbbaaabaaaabaxa000axxxax",
    "............hk.......dbbcb0cccc0ccccccbbccch0ccbccbbbbbbbbabaaaaaax000..xxxxx",
    "............h........dcbbb00cc00cccb00000cch0ccbbbbbbbbbbbaaaaaabaaa00....a000",
    "............k........ccbbbb000000cbbbc00ccch0bb0b0bbbbbbbaaaaaaabaaa00......00",
    "...........hx........cbbbbbcccc000bbbcccccbhkcc000bbbbbbbbaaaaaaaaaa0",
    "...........h.........ccbbbbcbbccccbbbbbcccbkkbb0bbbbbbbbbbxaaaaaaaaxx",
    "...........k.........ccbb000bbbcccbb0bc000bbkk00bcbbbbbbbbxaaxaaaaaxx",
    ".....................ccbcbbbbbbbbbb00cccbbbbkkbbccbbbbbbbbxaaxa0.aa00",
    ".....................cbccbbbbbbbbbbbbbcbbcbbbkbbbbbbbbabbxaaax00..aax",
    ".....................cbccbbbbbx00bbbbbbbbcc00kbb0bbbbbaaaxaaax00",
    ".....................bb000bbbbxbbbbbbbbbbbbbbabb00bbbbaaaaxxxx0",
    "......................bbbbbbbbxbbbbbbbbbbbbbbabbbbbbbaaaaaxx0x0",
    "......................bbbbbbbaxbbbbbbbbbbbbbbbbbbbbbbaaaaxxx000",
    ".......................bb00bba0000bbbbbbbbbbbbbbbbaabaaaaxx000",
    ".......................bbbbbbbb000bbbbbbbbbbxxxbbbaaaaaaxxx000",
    "........................bbbbbbbbbbbbbbbbbbbaaaaaa0aaaaaax00000",
    ".........................00bb000000bbb000aaaaaaaa00aaaaax0x0x",
    ".........................ba0000000aabbb0aaaaaaaaaaax0a00x0x0xaa",
    "..........................abbbcccbaaa0aaaaxacccbaaax0000x00xxaaaa",
    "..........................bbbcccbba000aaaaxcccbbaaxx000xxxxxaaaxaaa",
    "...........................aaccbbbaa0aaaaaxccbbba000000xxxxaaxxxxaaaax",
    "............................accbbbaaaxxxa0xcbbbba0000xxxxxaaaaaxaaaaaxx",
    "............................ccbbbba0x00000xccbbba000xxxxxxaaaaaaaaaxxaaa....bb",
    "............................ccbbb000x000000ccbbba00xxxx.xxxaaaaaaaaaxaaaabbaa0",
    "............................ccbbb000xx000xxccbbbaxxxxx....00xaaaaaaaxaaaaaaa",
    "............................ccbbb00xxxxxxxxccbbbaxxx........xxaaaaaaaabbaa0",
    "............................cbbba...xxxxxxxccbbba.............xx0xx00bbaa00",
    "...........................hcbbbabbbbbbbxx.hcbbbh..............b0x.bbaaaa",
    ".............mmmmmmmmmmbbbbhbbhahbbbbbbbbahhbbhhhbbbbbbbbmmmmmmmbbbbaaaa",
    ".......bbbbbbbmmmmmmmmmaaahhahhahhaaaaabbahhahhhhhaaaaaaammmmmmabbbaaaabbbbbb",
    ".bbbbbbbbbbbaaaaaxxxaaaaaahaaahaahaaaaaaaahaahhahhaaaaaaaaaaaaaaaaaaaaabbbbbabbb",
    "bbbbbbbaaaaaaaaaaaaaaaaaaahaaahaahaaaaaaaahaaahaahaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbb",
    "bbaaaaaaaaaaaaa0aaxxxxxxaahaaahaahaaaa000ahaaahaahaaaaa00aaaaa00000000000aaaaaaaaaabbbb",
    "aaaa000a000000000000000000000000000000000000000000xxxxxxxx................xxx000000aaaa",
    ".000.......................l..l..l.........l..l..l.................................0000"
  ],
  legend: {
    "0": { m: "feather", step: 0 },
    E: { pal: C.moon, glow: true },
    W: { pal: C.wisp, glow: true },
    a: { m: "feather", step: 1 },
    b: { m: "feather", step: 2 },
    c: { m: "feather", step: 3 },
    d: { m: "feather", step: 4 },
    h: { m: "veil", step: 2 },
    k: { m: "shade", step: 1 },
    l: { m: "veil", step: 3 },
    m: { m: "moss", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // A slow, puffed breath: the breast swells and the veil lifts with it.
    waist: 57,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, the wings mantle higher and the eyes flare: the question, asked again.
    twitch: {
      frames: [8],
      patches: [
        { x: 21, y: 2, rows: [".................................................................ccb", "...........................................................cbcccc", "........................................................ccc......00_", ".......................................................cb......00xx", ".......................................................b...b..a..._...xx", ".......................................................ccbb..a.ax.xxxx__", "........................................................b......x..ccbcccc", ".......................................................b...xxxxbbbbb.bbx0", ".........................................................xxbbbb....ax00._", ".........................................................bb.......a..x._", "............................................................00...a.x.._", "............................................................b.000...._", ".......................................................00....bbbb..aabb", ".......................................................b.0000......bb..bb", ".........................................................xxxxxxxxxxxxxxxxxb", ".......................................................0bbbbbbbbaabbbbbbbb", "...............................................................00.a.0000000", ".......................................................b.........000.....__", "...............................................................a.......__", "................................................................aaa..._", ".........................................................xx0000bbb.aax", ".........................................................bbxxxx...b..bb", ".........................................................0.baaaxxx.bb..b", ".......................................................00......aaaxxxx..b", ".......................................................bbb.......000b0xxax", "................................................................0xx.0.000", ".......................................................x....00...0..xxx___", ".......................................................bxx.aa.00.._____", "........................................................bbxbbb..aa", ".......................................................00.bxxaaa..a", ".......................................................b.0000x.bbx", "........................................................aaaaaaxxx.xx", ".......................................................0......aa..aaa", "...........................................................xx0000.x..a", "E............E.........................................a...00....00x0", ".E.............E......................................._______________", "", "E............E"] }
      ]
    }
  }
};
