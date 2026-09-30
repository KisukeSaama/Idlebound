import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Singing Geode (BIBLE 8.3): a stone that hums Célestine's name before she is hired.
 * A great egg of rough, pitted violet-grey rock split open like a jaw, the upper shell
 * thrown back on its hinge; both lips are banded with agate and lined with crystal teeth,
 * and the violet light it sings with burns in the dark between them. Two cold points watch
 * from under a jut of the lifted shell; crystal has grown out through its back, light leaks
 * along its cracks, and it stands on three short stumps of rock.
 */
export const SINGING_GEODE: CreatureGrid = {
  rows: [
    "................................ddddx",
    "...........................ddddddddddddddddddd",
    "......................ddb00ddddddddddddddddddddddd",
    "....................ddddddxxdddddddddddddddddddddddd",
    "..................dddddddddxddddddddddddddddddddddddddc....hx",
    "...............ddddddddddddxxddddddddddddddddddddddddxccc..hx",
    ".............dddddddddddddddxdddddddddddddddddddddddxxcccchhx.......hh",
    "............ddddddddddddddddxdddddddddddddddddddddddxxcccchb........hx",
    "...........dddddbbdddddddddddxddddddddddddddddddddddxxccchhb.......hhx",
    ".........dddddddbddddddddddddxxddddddddddddddddddddxxcccchdbbc.....ha",
    "........dddddddddddddddbddddLxxdddddddddddddddddddcxxcccccccccb...hha",
    ".......ddddddddddddddddbddddLxdddddddddddddddddddccxcccbccccccbb.hhh",
    "......dddddddddddddddddddddbLxddddddbdddd0dddddddcxLLccbccccccbbhhha",
    ".....dddddddddddddddddddddddLddddddcbbddc0ddddddccxLLccbbcccccbhhhda",
    ".....dddddddxxxxxxxxxxxddddxLdddccccccbbcccccccccccxLccccccccchhhddb",
    "....dddddddxxxxxxxxxxxxddddxLccccccccccaccccbccccccxL00accccccccccda",
    "....dddddxxxxxxxEEExxxxcccxxccccccccccbaccccccccccbxL0bbbbccccccccca",
    "...ddddxxxxxxxxxEWExxxcccbxxccccccccccbcccccccccccccLxcbbcccccccccccc...hh",
    "..dddddxxEEExxxxxxxxxxbcccbxcccccccccbccccccccccccccxxccccccccccccccbbbhhh",
    "..dddxxxxWWxxxxxxxxbbbbbbcbxxccccccccbccccccccccaacccxxccccccccccccbbbhha",
    "..ddddxxxxxxxxxxbbbbbbbbbbbcxacccccccccccccccccccaccccccbccccccccccbbhhaa",
    "..ddddbx0000abbbbbbbbbbbbbccxxbcb0cbbbbccccccLccbbcccccbbcccccccbccbbhha",
    "..cccaaa0000abbbbbbbbbbbbbbbxxbcbbcbbbbcccccccbcbccbccccccbacccbbbcbbbba",
    "..ccccaa0aaabbbbbbbbbbbbabbbbxbbabbbbbbccccccbbccccbcccccbbacccbbbbbbbbaa",
    "..xvccccccaabaabbbaaabbbabbbbbxbbbbbbbbbbbccbcccaaccccccccbaccccbbbbbbbbb",
    "..xhdccvcccccccaaaaaaabaaaabbbbbabbbbbabbbbcccbbaaccccccccaaccccbbbbbbbaaa",
    "..hhddxxvvvvcccccaaaaaaaaaaabb00bbbbabbbbbbbbbbbaaccccccccccccccbbbbbbaaa0",
    "..hhhd0xxhhdccccccccaaaaaaaaaa0bbbbbbbbabbbbbbbbbcccccccccccccccbbbbbbaaaaa",
    "..0hhh000hhdddxvvvcccccaaaaaaaaaaabaaba0bbbbbbbbbbbbbcccccccccccbbbbaaaaaaa",
    ".00hhh000hhhdd00hhddbvvcccccaaaaaaaaaaaabbbbbbbbbbbbbbbbbccccbccbbaaaaaaaaa",
    ".00hh00000hhd000hhddx.xvvccccccaaaaaaaaabb0bbbbbbbbbbbbbbbbccaaccbbbaaa0aaa",
    ".000h00000hh00000hh000x.dddvvcccccaaaaaabb0bbbbbbbbbbbbbbbbbaaccccbaaaa0aaa",
    ".000h00000hh00000hh0000hhdd..vvvvccccccaaaaabbbbbbbbbbbbbbbbbacccabbaaaaaaa",
    ".0000000000h00000hh0000hhd0000hddcvvccccccaabbbbbbbbbbbbbbbbbbbbba0bbaaaaax",
    ".000000000000000a000000hh00000hhd...vvvvcccccaabbabaaaabbaabbbbbbbbaaaaaa0a",
    ".0000000000000000000000hh00000hh00....dcccccccccaaaaaaaabaabbbbbbbbaaaaaa0a",
    ".000000000000000000000vvhvvvvvhhvvvvhhddvbvavvvcccccaaaaaaaaabbbbbaaaaa0000",
    "00000000000000000000vvvvvvVVVVVVVVVVVhdVVvvvdddvvvvccccaaaaaaa0aaaaaaaa000",
    "000000000000000000vvvvvvVVVVVVVVVVVVVhdVVVVhdddbb.vvvccccccaaa0aaaaaaa0000",
    "00000000000000000vvvvvvVVVVLLLLLLLLLLLLVVVVhhdvvvvdddvvvcccccaaaaaaaa0000",
    "000000000000000vvvvvvVVVVVLLLLLLLLLLLLLLVVVVVVvvvvdhd0....vcccccccaa0000",
    "0000000000000vvvvvvVVVVVVLLLLLLLLLLLLLLLLVVVVVVVvvvvv0000xx00.vvccv0000",
    ".000000000000vvvvvvVVVVVLLLLLLLLLLLLLLLLLLVVVVVVvvvvvvh000a00xxxvvv0",
    ".00000000000000vvvvvVV0VVLL0LLLLLLLLLLLLLVhVVVvvvvvv0hh000a0a0LLLvv",
    ".0000000000000000vvvv00VVVV0LLLLLLLLLLL00hhV0vvvvvv..hhhd.LLLLLLLvvaa",
    "..0000000000000000vvv000VV00hVVV00LLLL000hhh0vvhhh....LLLLLLVVvvcbcbbb",
    "..000000000000000000v00vvV0hhVVV00hhVV00hhhh0vvhhLLLLLLLVVvvvddddbccbbb",
    "..00000000000000000000vvvvvhhdvvvvhhvvvvhhLLLLLLLLLVvvdvvvdddddddccccbba",
    "..000000000000a0000000hh000hhdv0vvhhhvvLLLLLLLLLvvbbddddadaddddddccccbba",
    "..0000000ha0000h000000hh000hhhh...hLLLLLLVVVvvvvddddddddaaadddddbbcccbba",
    "...00000hh0000hh00000hhh000hhhh..LLLLVVVVvvvddddddddddddddddddxbbbccbbb00",
    "...00000hhd000hhh0000hhhh..LLLLLLLvvVvvvxxdddddddddaddddbdddbxxccbbbbbbb0",
    "....0000hhd000hhh00...LLLLLLLLVvvvddbdddxxdddddddddddddddda00xccbbb0bbbbba",
    "....000hhhh000hhhhLLLLLVVVVVvvddddddbddaxxdddddddddddddddaaxxxcccb0ba00bbb",
    "....000hhhhLL..LLLLVVVVVvvdddddddddddddddxxdddddddddcdddcccxxcccbbabaabbbba",
    ".....00LLLLLLLLLVvvddvvddddddddbdddddddddbxdddcddccccccccxxxxbbbaaabaaaaaaa",
    ".....LLLVVVVVvvvvbddddddddddddddddddddddddxxdcccccccccbbbxxLbbbaaaaaaaaaaaa",
    ".....VVVVVvvvdddddddddddddddddddddddddbbdbccccccccccccbbbxLLbbaaaaa00aaaaax",
    ".....VvvvvdddddddddddbdddddddddddddccbbbcbbcccccccbcccbbxxLLbaaaa0aa0aaaaax",
    ".....cccbbddaddddddddxxcccccccccccccccaacbcccbccccccbcbbbxxLaaaa00aa0aaaaa0",
    ".....ccccccccbccdcccccxxcccccccccccccaaacccccbccaacccccbbxxLaaaa000a0aaaaa0",
    ".....cccbbbbcccccccccccxxccacbcccccccccccccccccbcccccccb00xLaa0000000aaaa00",
    ".....caabbabbbbcccccbcccxxbacbcccccccccccccbbcbbbcccccb000xLaaa000000000000",
    "......aabbbbbbbabbbbcccccxxcccccccbbbbbbbbbbbbbbbb0abbbaaaxaaaa000000000xx",
    ".......aabbbb0bbbbbbbbbbbbxxcccbbbbbbbbbbbbbbbbbbbbbbbbb000x0aaa000x0xxxxx",
    "........aabbb00bbbbbbbbbbbbxx000bbaabaababbbbbbccbbbbbbba00x0000000xxx0xx",
    ".........bbbbbaaabbbbbbbbbbbxaabbaaabbbbaaaabbbccbbbbbaaa00x0000000x0000",
    ".........bbaaaaaabbbbbbbbbaxxa0aaaaabbbaaaaabbbbbbbbaaaaaa0000000000000x",
    ".........baa0aaaabbbbbbbbaaxaaaaaaaaaaaaaaaabbbbbbbbaaaaaa00000000000xx",
    ".........dba0aaaaabbabbaaaaxaaaaaaaaaaaaaaaaabbbbbbaaaaaaa0000000000xx",
    "........ddbb0a00aaabaaaaaaxaaaaa0aaaaaaaaa0aaaaaaaaaaaaaaax0xx00xxxxxx",
    "........ddcccb000xxaaa0aaaxaa0aaaaaaaaaaaa0aaaaaa0aaaa00000000xxxxxx",
    ".......dddccccba0x0aa0000xxa000aaaaa0aaa00aaaaaaa0000000000xxxxxxxx",
    ".......dccccccaa0000a0000x00000aa000000000000000000000000xxxxxxxxxx",
    "......ddcccccbbb0000000000000000000000000000000000xx00xxxxxxxxxx0aa",
    "......dbbccccbbb00...xxx00000000000000x000x000000xxxxxxxxxxxxxx0aaa",
    ".....ddccccccba00.......xxxx0000000xxxxxxxx000000xxxxxxxxxx00000aaaa",
    ".....dccccbcbba0..........xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0x00aaaaaaa",
    "....cccbbbbaa00..............xxxxxxxxxxxxxxxxxxxxxxxx....axaaaaaaaaa0",
    "....ccbbbbaaa0................xa000xx0xxxxx..............aaaaaaaaaaa00",
    "...cccbbbb0aaa................baa00000000xx...............aaaaaaaaaa00",
    "...cabbbbb000.................bbaaaaaaaaa0x...............aa00a0aaaa000",
    "..ccaa000x00..................b00xx00000000...............a00000000000x",
    "..xxxxxxxx......................xxxx0xxxxx..................xxxxxxxxxxx"
  ],
  legend: {
    "0": { m: "rock", step: 0 },
    E: { pal: C.essenceLight, glow: true },
    L: { pal: C.essenceBright, glow: true, light: true },
    V: { m: "light", step: 1 },
    W: { pal: C.essenceBright, glow: true },
    a: { m: "rock", step: 1 },
    b: { m: "rock", step: 3 },
    c: { m: "rock", step: 4 },
    d: { m: "stone", step: 3 },
    h: { m: "glass", step: 2 },
    v: { m: "light", step: 0 },
    x: { pal: C.ink }
  },
  idle: {
    // The egg rises on its stumps and settles, humming.
    waist: 67,
    breath: [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the song swells and the light in the maw flares.
    twitch: {
      frames: [6],
      patches: [
        { x: 19, y: 37, rows: ["......LLLLLLLLLLLL..LL", "....LLLLLLLLLLLLLLLLLLLLL", "...LLLLL............LLLLL.L", "..LLLLL..............LLLLLL", "LLLLLL................LLLLL", "LLLLL..................LLLL", ".LL.LL................L.LLLV", "....LLLL.............LL.L", "....LLL...LLLL", "......L...LLLL...LL", "..........L.......L", "", "......................LLLL", "..................LLLL", "...............LLL..d", "...........LLLL", "....LLLLL"] }
      ]
    }
  }
};
