import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Peat Cutter (BIBLE 8.4): it cuts peat under the water now; the Baron's orders still
 * stand. A hulking worker made of one great mass of wet peat, hunched, the head sunk low
 * between the shoulders: the bog is laid down in him in layers that wrap his body, fibrous
 * and matted, and where a spade took a sod out of him the cut shows flat and pale, layered,
 * pierced by roots. Moss grows thick on the hump of his back, water runs down him in dark
 * streaks, roots hang from every seam, his jaw and his arms. He stands on two stumps rooted
 * into the mud and raises a heavy rusted spade high over his back in both fists, its blade
 * holed and its edge worn bright. A sodden cap slumps over his brow and under its dripping
 * peak two eyes burn like wet embers. A dead lantern hangs from the rope at his belt.
 */
export const PEAT_CUTTER: CreatureGrid = {
  rows: [
    "..................................................bb",
    ".................................................babh",
    "...............................................cbbaahhhh",
    "..............................................cbaabhhhhhh",
    "............................................ccbbahhhhhhhhh",
    "...........................................bbbabhhhccbccbh",
    ".........................................hbbbhhccchcccccbch",
    ".........................................cbbbhhhcccccccccch",
    "..........................................aahhcchcccxcccccch",
    "..........................................bccccccchcccccccch",
    "...........................................ccccccccccccccbch",
    "............................................chhccccccccccbh",
    "..........................................0000hccccccbba",
    ".........................................000000ccccbbbb",
    "........................................000000cccccbb",
    ".......................................00000.cccca0",
    ".....................................cbb0.....caa",
    "...................................ccbbb",
    "..................................bbaa",
    "...............................bbb0",
    "..............................bbb0",
    ".........................ddcccbbb",
    ".........................hbbccbbad",
    "........................cccbcbaaaaadh",
    "......................bbbcbbbaaaaaaccdh",
    "..............ddhdhc.bbbaa0aaaaaabbbbccddd",
    "..............dccccbbab....xaxaabbbbccbbbbd",
    ".............dccbdcbb........aabbbb0bbbbbbba",
    "...........hdccbbbbba.........bbbbbaabbbbbbbd",
    "..........dddccbbbbb0...........bbbaaabbbabbb",
    "..........dccbaaaa0a0..............aaa0aaaabbdd",
    ".........hdcbbbb0abb................aaa0aaabbaboooooo",
    "........ddbbabaaaabb................dbbbbaabbbboooooooox",
    "........dccbcmooaa...............ooooaabbbbbbbbbooooooox",
    ".......ddcooxmogoo0..............ooommaabbbbba0booooooooo",
    "......doooxh0momo00a............doooooabbbbaa000booooooooo",
    "......dooxhhbam00aaa00.........ddddommbbbbbaa0000xoooooooox",
    ".....dcbxhbbbaa0aaa00000x.....dddddxabbbbbaa00000xooooommbxx",
    "....ooobxbbb0aaaa0a000000x..ddddddddxbbbbaa0x0000xmmmmmmm0aaa",
    "...oooooxbaa00aaaa0000000axddcddddddddbbaa0xxxxxxxxaabbbooo00",
    "...dmxxxhba00aa000aa0000xxccccdddccdddxdccax0xxxxxxaaboooooox",
    "..ccbabxh00000000000000xxxabccdddddddddddaxxxxxxaabbbbomoooox",
    ".dbbbbbhhhhhbbbaaa000000xxabccdddddddddabbbaxxaabbbbbbmmooxxxx.dd",
    "ddcdbbhhxxxxaaaax0000xxxxxbccccccccccbccbbbbaabbbcccbbaamxxxxx.dd",
    "d..cbbbbxx000x00x000x0abcxccccccccccccccbbbbbbbbcccccba00xxxx...dd",
    "d...dbbbxbxxxx0cxxx0abcc0xcccccdacccccdacccccccccccccc0000xxx....dc",
    "....cbbbxbxRExcbRER0bcb0xccccccdaccccdacccccccccccccccba00xxxx",
    "....dddddcdxxadcaxbccbb0xbcaccccdacccdabcccccccccccbccbaa0xxxx",
    "...dddddxbcdcb0cx0bccbaxaaaxbcccdaccdbbbdaccccccccbbccbaa0xxxxx",
    "...dd.dccxbcbaxxabbcba0xxh00bccdaaabdbbbdabccccccbbbcca00xxxxxxd",
    "..dd...cccab0dxxxxxx0a0xdd0bbdddabbbdabbbdabcbbbbbbbbbcbaaxxxxx0",
    "..d....cccx0xcxdxxcx0a0aabddddcdabbbdabbbdabbbbbbbbbbbbbaaxxxxxxd",
    ".d......dcxbcb0x0bbcbaxbbbbbcccccdabdaabdabbbbbbaabbbbbbaa0xxxxxd",
    "........cbaxcccbbccba0xabbbbccccbbdadabbbabbbbba0aabbbbb000xxxxx.d",
    ".........ddxa0d0d0c00aaadddbcdddbccddabbbbbbbbbbaaaaaaa00xxxxxxxcd",
    ".........ddcdcdcdacdaaaadddddddddccda00bbbbbbbbaaaaaaa00xxxxxxx.ad",
    ".........ddcccbada0daaacdddddddddccdaab0abbbba0aaaaaa00xxxxxxxx..d",
    "..........dccbadc00xxaabccccccccccdabbbaaaaba0aaaaa000xxxxxxxxx",
    "...........bca0axdxxaa0bcddddddddccbbbbaa000d0aaaaa0xxxxxxxxxx",
    "............hxxxxcxaaaa0cdddddaddaabbbaxx00x0d0aaaa0xxxxxxxxxx",
    "..............xxxhxbbaaacccdcccccacbbaaa0xh00dxaaaa0xxxxxxcxx",
    ".................ccddccacbbbbccabdabbaa000000xxa0aa0xxxdccccd",
    "..................bbdbddccbbabbbbbbbaaa00000c0xxx0axxcdbbxx.d",
    "..................dbbbddcdcdcbbccbbbaaaa00000d0xxxccccxxxx..dd",
    "..................dbbbbbcdbdcdcda000ddaaaddxxdddcddccxxxx....d",
    "..................daabaaabbbbccddddcdddddddddccdxxxxxxxx.....d",
    "...................ddcaaaabbbcbb000ccbbbxxxxxxxxxxxxxxxxx....d",
    "...................ddddaccbb00xxx00xxxxxxxxxxxxxxxxxxx0xx",
    "...................ddddacbba00xxxxhxxxxxxxxxxxxxxxxxxxxxx",
    "..................ddddacbba00xxxxhhhhxxxxxxxxxxxxx00000xx",
    "..................dddddabba0xxxxxx00xxxxxx0a..xxxx000d00xx",
    ".................hdddddabb00xxxxxx0oox.....d..xxxxa00d0aaa",
    ".................dcddddcabbaa..xxomomx.....d...000aaaadaaa",
    ".................dcccccccbbaa..xxomomx.....d...000aaaadaaa",
    ".................dcccccccbba...xxomoxx.........d00aaadaaaa0",
    "................ddbcccccbbba....xoxxmx.........d00aaaaaaaa0",
    "................dbbbbbacbbba....x000xx.........aaaaaaaaaa00",
    "...............ddbbbbbbcbbba....xxxxxx..........daaaaabaaa0",
    ".............ddcccbbbbbccbbb....hhhhhh..........dbaaabbbaaa0",
    "...............bcccccccbaabb....................dbbbbcbbbbba",
    "..............ddccccccccbbb....................cdbbb0ccbbbbb",
    "............ddddcccccccbbbadd.................cccbbbba0ccbbbc",
    "..........xxddd.cbbbbbbbbbbddxx.............xbaabbbba00xccccccc",
    ".................bbbaxxaxx........................bbb0aaccc"
  ],
  legend: {
    "0": { m: "peat", step: 0 },
    E: { pal: C.amber, glow: true },
    R: { pal: C.ember, glow: true },
    a: { m: "peat", step: 1 },
    b: { m: "peat", step: 2 },
    c: { m: "peat", step: 3 },
    d: { m: "peat", step: 4 },
    g: { m: "moss", step: 3 },
    h: { m: "iron", step: 1 },
    m: { m: "moss", step: 1 },
    o: { m: "moss", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // A heavy, wet breath: the whole mass of him heaves once and settles.
    waist: 53,
    breath: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    // Once in a cycle, the wet embers of his eyes flare.
    twitch: {
      frames: [9],
      patches: [
        { x: 11, y: 46, rows: ["E....E.E"] }
      ]
    }
  }
};
