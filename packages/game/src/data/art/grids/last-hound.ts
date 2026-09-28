import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Hound of the Last Hunt: the King's hounds were loosed on the night of the Binding
 * and are still following the scent. A gaunt pale sighthound snarling low, hackles raised
 * in spikes, the ribs and the knuckled spine showing through a hide worn thin, the belly
 * tucked hollow; the King's gold collar with a violet stone and a broken chain swinging
 * from it, violet fire in the eye, the tail burning off into violet at the tip.
 */
export const LAST_HOUND: CreatureGrid = {
  rows: [
    "...................................dx",
    "...................................dx....................F",
    ".............................db...ddx............f......f",
    ".............................dbb..dda...dd.......f......f",
    "........................bb...dbb.ddca..ddb......f......f",
    ".......................xbb..ddcbdddcccddbbaddccccccc",
    ".......................ccdccccccddccccdbbbcccccccccccccccc",
    ".......................cddccbccdddcccbbaabcccccccccccccccccccccc",
    ".......................cdcccbaddddcccbaaaccccccccccccccccccccccc",
    "....................ddddccccbacddcccccbcccccccccccccccccccccccccbb",
    ".................ddddd00cccGGGccccccccbbcccccccccbbbccLccccccccbbbbcc",
    "...............ddddddcbbbccGGGcccccccbbbccc0ccb0ccb00ccc0cbccccbbbbbcccc",
    "..............ddddddccccbGGGGGGcccccbbbbcc00cbb0cbb00cc00cbccccccbbbbbbccc",
    ".............dd000000ccffGGGGGGGccccbbbacc00cb00cbb0cbb00cccccccccbbbbbbbbb",
    "............d000xxxxccfcGGGGxxGGccccbbbabc00bb00cb00cbb0cccccccccbbbaaabbbbb",
    "...........dddxxxxxFFFcccGGGGGGGbccbbbaab000bb00bb00cx00ccccccccbbbaa...bbbb",
    "..........ddddcxFEEExccccGGGGGGgbbbbbaaab00cb00cbb00cx00cccccccccbbba....bbbb",
    ".........ddddcccxFFFcccccGGGGGGgbbbaaa1bb00cb00cb00bbbxxcccccccccbbaa.....bbbb",
    ".......dddddccccccccccccbGGGxxGgddaa111bb00cc00cb00cb00xcccccccccbba1......bbb",
    "....dddddddccccccccccccbbGGGGGGgdcccccbb00cbb00bb00cb00xcccccccccba11.......bbb",
    "..ddddddddccccbbbcccccbb11GGGGGGcccccbbb00cb000b000aa00ccccccccccba11.......bbbb",
    "xddbddbccbbbbbbbbbbbbbb111GGGGgccccccbb000bb000000000001ccccccccbba1.........bbb",
    "xxdbabbbabbbbbaaaabbbaa111GGxxgccccccbb00bb0000000000aa1ccccccccba1...........bbb",
    "xaaaaaaaaaaaaaaxaaxxxbb00GGGGGgccccccba0cb00000000001110cccccccbba1...........bbb",
    "xaxxxxxxxxxxxxxxxxxxxbb0GGGGfGgccccccba0cb00000110000000cccbcccbaa.............bb",
    ".xdxxxdxxxxxdxxxxxxxxaaaGGGfffbbcbccba1bb000100000000011cccbccbbaa.............bb",
    ".xdxxxdxxxxxdaxxxxxbbaa.GGGffFbccbccba1bbaa01110..11111acccccbbaa..............bb",
    "..dxxxxxdaaaaacccbbaaa...GGgggbcccccbabbaaaaa10..xaaaaaacccccbbaa...............bb",
    "..xxdxxxdaaaabbbbaaa.....xggggbccccbaaaaaaaaa00..xaaaaaacccccbba................FF..FFF",
    "...cdcccbbbbbaaaaa.........gggcccccbaaaa11a000...xaaaaa1cccccbaa................FFFFFFf....f",
    "...baaaaaaa11x..............cgccccbbaaaa11000....aaaaaa1cccbbba.................FFFFFff",
    "............................cggcccbaaaa110000....aaaaa11ccbbbbbb.................FFFFf..F",
    "............................cggcccbaaa000000.....aaaaaa1bbbbbbbb.................FFFFFFF",
    "............................ccccccbaa0000000......aaaaaa1bbbbbbbb................ffFFFFFF",
    "............................cccggbb110000000......aaaaaa1.bbbbbbbb.................ffffff",
    "............................cccggba110000000.......aaaaa11.bbbbbbb",
    "............................cccbbba10000011x........aaaaa1.bbbbbbbb",
    "............................ccbggg1.0000111.........aaaaaa1.bbbbbbb",
    "............................ccbggg....11aa1..........aaaaa1..bbbbbbb",
    "...........................ccbbggg...xaaaa1...........aaaaa1..bbbbbaa",
    "...........................ccbbbgg...xaaa10...........aaaaa1...bbbbba",
    "...........................ccbbb1g...aaaa10............aaaa11..bbbbbba",
    "...........................cbbb11....aaaa1..............aaaa1...bbbbba",
    "..........................ccbbb1.....aaaa1..............aaaa1....bbbba1",
    "..........................ccbba1.....aaa10...............aaa1.....bbba1",
    "..........................cbbba1.....aaa10...............aaa1.....bbaax",
    "..........................cbba1......aaa1x...............aaa1.....bba1",
    ".........................ccbba1......aaa1................aa11.....bba1",
    ".........................cbba1.......aaa0...............aaa10.....bba1",
    ".........................cbba1......aaa10...............aaa10.....bba1",
    "........................ccba11......aaa10...............aaa1......bb11",
    "........................cbba1.......aaa1................aaa1......bb11",
    ".......................bbbba.......aaa11................aa11......bb11",
    ".......................bb011.......aaa1.................aa11......bb1x",
    "......................cbb00.......aaa11.................aa11.....bbb1x",
    "....................ddccc0........aaa1..................aa1......cccc",
    "..................cccccccb......bbaaa1.................aaaaa...cccccca",
    "................cccccccccb....bbaaaaa1...............bbaaaa1.ccccccccb",
    "...............ccccccccccb...baa111a11..............ab111111.cc0bb0bbb",
    "...............caaaaaaaaaa...100000000..............a00000001aa0aa0aaa"
  ],
  legend: {
    "0": { m: "dark", step: 1 },
    "1": { m: "dark", step: 2 },
    E: { pal: C.moon, glow: true },
    F: { pal: C.violetFire },
    G: { m: "collar", step: 2 },
    L: { pal: C.moon, glow: true, light: true },
    a: { m: "fur", step: 1 },
    b: { m: "fur", step: 2 },
    c: { m: "fur", step: 3 },
    d: { m: "fur", step: 4 },
    f: { pal: C.essenceBright },
    g: { m: "collar", step: 1 },
    x: { pal: C.ink }
  },
  idle: {
    // A hound's panting snarl: two quick heaves of the ribs, twice a cycle.
    waist: 37,
    breath: [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
    // Once in a cycle, the burning tip of the tail lashes.
    twitch: {
      frames: [8],
      patches: [
        { x: 81, y: 26, rows: [".b", "_F..FFF", "_FF...f....f", "_.....f..._", "_...F...F", "_...FFF", "_ff....FF", "___ffffff", "..______"] }
      ]
    }
  }
};
