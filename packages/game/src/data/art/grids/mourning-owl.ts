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
    "..................aa",
    "..................aaa",
    "............aa....ccaa",
    "............aaaaaaaaccc...a0.................................................ccb",
    "............aaaaaaaaaacccaa0.........................................ccccbcccc0",
    "........aaaaaaxxaaaaaaaaaca0x......................................ccbcccbc00xx",
    "........aaaaaaaaaaaaaaaaxxa00.....................................ccbbccbcc00x....x",
    "........0000aaaaaaaaaaaaaaa000...................................cccccbbbbaaxxxxxx",
    ".........00xxaxaaaaxaaaaaaaa00.................................ccccccbbbbbaxxxccbccc",
    "...........aaaxaaaaxxaaaaaaa000...............................ccbbcbbbbbxxxbbbbbbbx0",
    "..........aaaaaaxxaaaaaaaaaaa00.........aa..................xccbbcbbbbxxbbbbbbbax00",
    ".........aaaaaaaxxaaaaaaaaaaax00.......baa.................xbbcbcbbbbbbbbbbbbbaaxx",
    "........baaaaaaaaaxaaaaaxaaaaxx0......cca.................ccbcccbbbbbbbbb0000aaxx",
    ".........0000xxxaaaaaaaaxaxxaaxxx....ccca................bbcbccbbbbb00bbbbb00aaxab",
    "............0xxxxaaaaaaaaaxaxxxxx0..cccba...............cbbbcbcbbbbbb0000bbbbaabbbbb",
    "........llhh.xxxx0xxaaxxaaxaaxax00.xbbbba..............cbbcbccbbbbbbb0xxxxxxxxxxxxxxxb",
    "........kklhhh.xx00xxaxxxxaaaaaa000ccbbaa.............ccbbbccbbb00bb0bbbbbbbaabbbbbbbb",
    "........kkhllhh.x000xxxxaaaaaaaaabbbbbba..............bccbcbcbbbb0000bbbbbb00aab000000",
    "........hkhhhllh.0000xxaaaxxaxxaabbbbbba.............bbcccbbbbbbbbbbbbbbbbb000000000",
    ".......hhkhhhhllhh0000aaaaxaaaaabccbbbba.............bcccbbb00b00bbbbbbbbbba000000",
    ".......hh.hhhhhhllhhhhllllhhaaabbbbbbbba............cbcccbbbb000bbbbbbbbbbbbaaa000",
    ".......hh.kkkhhhhhlhll000hhhhhhhhbhbbbba............cbccc000bbbbbbbbbbxx000bbbaaax",
    ".......k..kkkhhhkhhhhh000hhkhhhhhhhhabba...........ccccc0000bbbbbbbbbbbbxaaxxxbbbbb",
    "......xk...hhhhhkhkkhh000hhkkhkkhhhhhaa...........ccccccbbbbbbbbbbb0000bbaaaaaxxxbbb",
    "......hk...hhhhkkhkkkkkkkhhkkhkkkkhhhh............cc000cbbbbbb0bbbbbbbbbbaaaa000b0xax",
    ".......k...hkkhkkhkkkhkkhkhkkhhkkkhhhhh..........bccccccbbbbbb00bbbbbbbbbaaa0xx00000x",
    ".......k...hkkhkkhkkkhhhhkkkkhhkkkhhhhh..........bccbbccbbbbbbb000bbxbbbb00a00x0xx",
    "..........hhkkhhkkkkkhhhhkkkkkkkkkkhhhh.........cbcccccbb00bbbbxxbbbbxxbaa0000",
    "..........hhkkhkkkkkkkhhh0bbkkkkkkk000hh........cbcbccbbb00000xxbbbbbbbxbba0aa",
    "..........hhkkk00kbbbaakk0bbkkkkaaaaxxhk.......ccbbbc0bbbbb0bbbbbbbb00bbxxaaaaa",
    "..........klk0hxxxxbbbaakkbbbaaaxxxxkahk.......cccbbb0000bbbbbbbbbbbb000aaxxxxx",
    "..........klk.habbbxxxaabkbbbaxxaaaakakkc......cccbbbbbbbbbbbbbbb0bb0aaaaaaaxxaa",
    "..........klk.habbWWWaxahkaaaxWWWaaak0kkccccbcccccbbbbbbbbbbbbbbbx000aaaxx000xxaa",
    "..........klk.kkbWEWWWaxh0aaxWEWWWaak0k0addcbcdcbcbbbbbbbbb00bbbbbxbaaaa0000000x0a",
    "..........hlkhkkaWEWWWaax0axaWEWWWaa000kkddcccddbbbbbbbbbbbb00000bbxaaaa00xxx00xxx",
    "..........hlkxh0aaWWWaaahxaaaWWWWaa0000kkddbbcddbbbbbbb0bbbbb00bbbbbxbb000",
    "..........hl.xh.aaaaa00khxaaaaaaa000h0kkkddbbddcbbbbbbb00b00bbbbbbbaaxba00",
    "..........hk.xx..aa0000khxkaaaa00000hcckkddcbcccbbbbxxbx000bbxbbaaa0acxaaaa",
    "..........hk.xx...aa00aaaxkaa0000000hcbkkccbbcccbbbbbbbbbbbbbbxaaaa0000xxaa",
    "..........hk.hh.....aaaaaxaaa00000b0kcbhkccbcbbcbbbxbbbbbbbbbbxbba00xaaaxxa",
    "..........hk..k.....bbaa00000000bbbckcchkccbbbbbbbbxbbbbbbbbbbbx000000aaaaaa",
    "..........hk..k....dccbbbbbbbbbbbbbckcchkccbbbbxxbbbbbbbbbbbbbaxxxx00000000a",
    "..........hkx.kx...dcccbbbbbbbbbbcccbcchkcbbbbbxbbbbbbxxb00b000axaaa....0000",
    "...........kx.xx...ccb0ccccbbbccccbbb0bhac00000xbbbbxxxabb000aaaaaxx",
    "...........kk.xx...ccbcccccbccccbbb000hh0ccb0bbbbbbbxxaabba0xxaaaxaxx",
    "...........hk......cbbccccbcccccbbbbbbc00bbbbbbbbbbbaaaabbaxxxxaaxaaa",
    "...........hk......cbcccccbc0ccc000b0bch000cc000bbxxbbaaabaaax00axxaa",
    "...........hk......cbcc00ccc0ccccc0b0cch0c0ccb0bbbbaabaaaaax0000axxxx",
    "...........h.......dbbb00cc00ccc00000cc0ccbcbbbbbbbbaaaaaaaaa00...a000",
    "...........k.......ccbbb00000ccbbc00ccc0bb0b0bbbbbbaaaaaabaaa00.....00",
    "..........hx.......cbbbbcccc00bbbccccchkcc000bbbbbbbaaaaaaaaa0",
    "..........h........ccbbbcbbccccbbbbccckkbb0bbbbbbbbbxaaaaaaaxx",
    "..........k........ccb000bbbcccb0bc000bkk00bcbbbbbbbxaaxaaaaxx",
    "...................cbccbbbbbbbb00cccbbbbkbbccbbbbbbbxaax0.aa00",
    "...................cbccbbbbbbbbbbbcbbcbbkbbbbbbbaabxaaax0..aax",
    "...................cbc0bbbbx0bbbbbbbbcb0kbb0bbbbaaaxaaxx0",
    "...................bb00bbbbxbbbbbbbbbbbbabb00bbbaaaaxxxx0",
    "....................bbbbbbaxbbbbbbbbbbbbbbbbbbbbaaaxxx000",
    "....................bb00bba000bbbbbbbbbbbbbbbabbaaaxx000",
    ".....................bbbbbbb000bbbbbbbbxxxbbbaaaaaxxx000",
    ".....................bbbbbbbbbbbbbbbbbbaaaaa0aaaaax00000",
    "......................00bb00000bbb000aaaaaaa00aaaax0x0x",
    ".......................a0000000abbb0aaaaaaaaaax000x0x0xaa",
    ".......................abbcccbbaa0aaaaxcccbaaxx000x00xaaaaa",
    "........................bbccbbaa00aaaaxccbba0x000xxxxaaaxxaaa",
    ".........................accbbaaaaxaa0xcbbba0000xxxxaaaxxxaaaax",
    ".........................ccbbbaax00000xcbbba000xxxxxaaaaaaaaxxaa....bb",
    ".........................ccbbb00x00000ccbbba00xxxxxxxaaaaaaaaxaaabbaa0",
    ".........................ccbbb00xx000xxcbbbaxxxxx...00xaaaaaaxaaaaaa",
    ".........................ccbbb0xxxxxxxxcbbbaxxx.......xxaaaaaaabba0",
    ".........................cbbba..xxxxxxxcbbba............x0xx00bba00",
    "........................hcbbbabbbbbbxxhhbbbh............b0x.bbaaa",
    "...........bmmmmmmmmmbbbhbhhahbbbbbbbahbbhhhbbbbbbbmmmmmmbbbbaaab",
    ".bbbbbbbbbbaammxxxmmaaahhahhahhaaaabaahahhahhaaaaaammmmmaabbaaaabbbbbbb",
    "bbbbbbbaaaaaaaaaxxaaaaahaaahahhaaaaaaahaahaahaaaaaaaaaaaaaaaaaaabaaaaabbbbbb",
    "bbaaaaaaaaaaaaaaxxxxxaahaaahahhaaa000ahaahaahaaaaa0aaaaa000000000aaaaaaaaabbbb",
    "aaaa00a00000000000000000000000000000000000000xxxxxxx..............xxx00000aaaa",
    ".000....................l..l.ll.......ll.l..l.............................0000"
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
    waist: 51,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    // Once in a cycle, the wings mantle higher and the eyes flare: the question, asked again.
    twitch: {
      frames: [8],
      patches: [
        { x: 19, y: 2, rows: ["..........................................................ccb", "....................................................ccbccc", "..................................................b......00x", ".................................................b...bc...._...x", ".................................................ccbb.baax.xxxx_", "..................................................b.....x..ccbccc", ".................................................b...xxxbbbbb.bx0", "...................................................xxbbb....ax00_", "...................................................bb......a..x_", "......................................................00..a.x._", ".................................................00...b", ".................................................b.000..bb..bb.bb", "...................................................xxxxxxxxxxxxxxxb", ".................................................0bbbbbbbaabbbbbbb", "........................................................00.a.000000", ".................................................b........000....__", "........................................................a......__", ".........................................................aaa", "...................................................xx000.bb.aax", "...................................................bbxxxxxxb.bbb", ".................................................000.b..a..xxx..b", ".................................................bbb......000bxxax", ".........................................................0xx.0.00", ".................................................x....0...0..xxx__", ".................................................bxx.a..0..____", "..................................................bbxbbb.aa", ".................................................00.bxx.a..a", ".................................................b.0000xxbx", ".................................................0aaa..aa..ax", ".....................................................x.000...a", "E..........E.....................................a...00...00x0a", ".E...........E...................................______________", "", "E..........E"] }
      ]
    }
  }
};
