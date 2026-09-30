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
    "......l",
    "......h",
    "......h.....x",
    "......h....lx",
    "......hh..lal..............ha..........l",
    ".ll...hh..la...............ha........ha",
    ".h.....hhlla...............haa.......ha",
    ".hh....hhhh.................ha......hh",
    ".hh.....hha.................haa.....aa",
    "..h....lhaa.................hha....hh",
    "..hh...lla..................hhaa..hhh",
    "...hh..lhh..........h.......hhaa.haa",
    "....hhhhhh.........hEh......hhaahaa",
    "l....hhhhh..........h.......hhhhaa",
    "hh....lhha..................hhaaa",
    "hh....llha..................hhaa....aal",
    ".hh...llha.........E........hhaa....ha",
    "..h...hlha.xxxEExxxxxxxxExxxbhaa...aa",
    "..hhhhhhhaxxxxxxxxxxxxxxxxxxhha...ha",
    "...hhhlhhhbbbbbbcccLbLxLxLbbhha.hhh",
    ".....hllhhbaabbbbbbbbbbbbbbbhhahhaa",
    "......hlhhhaaabbbbbbbccgggghaaaaa",
    ".......lhhhaaaaaEaabbccEggghhaaa",
    ".......lhhhaaaaaa000aa00ffhhha",
    ".......hhhhhhh.........0bhhhaa",
    "........haahhbb........hhhaaa",
    "..h......hhhhbh........hhaaa",
    "..lhhh...lllllhh......hhhaa",
    "....hhhlllllllhhh....hhhaaa",
    "......hhhhhhhhhhhh..hhhhaa",
    "............hhhhhhhhhhhaa..ccx",
    ".............hhhhhhhhhaaabcbba",
    ".............hhhhhhbbccccbbbaa",
    ".............chhhaabbbabbbaax",
    "............ccchaaabbbaab000x",
    "..........cccccbbbbbbbbaaacccx",
    ".........ccxc0bbbbbbba00xxcccxb",
    ".........cc00xxbbbbba000bbbbccbb.......ggg..........................bb",
    "........cc0sAAsbbbbaa00bbbccbcbba...gggggggggg...................cccbgg",
    "........bcc0Asbbbbaa00bbbbxxxbcccc.ggggggggggggf..........gggf.cccbccgggg",
    ".......cbccs0sbbbaaa00bbbbbxbbxcccggggggggggggffcc....gggggggfgcbccbccffggg",
    ".......cccAbbsbbaaa00bbbbbxxbbxxcccggggggggggffbbbccbgggfggggggggccbbbfgggffb",
    "......cccbsbsbbaa000axxxbccxxbbbbbgggggggggggffbbcbbbbfggggggggffccbbbbggfgbbbb",
    "......cccbsbsbaa00xaaxxxabccxxbxbxxggggggggfff0xxcbbc0ffgfggggfffccbbbbgffgfbaba",
    ".....ccccsbbbaaxxxaaaaxxabccbbxxccxxffggggffff00bx0bc0ccfffgfgffbbccbbbbffffbaaa",
    "....ccccsbbbaaxxxxaaaaxabbxbbbbxxcccffffffbx0cc0bc00c0ccfffffffxxbxcbcbxxxxfbaa",
    "...cccbbsbaa000..xaaaaaabbxxccbbxxaafffff0bf0cc00c00cc0xbfffxxfxxaxacccbbxxxbaa",
    "..ccccbsaa000.....xaaaaaabbxccccaaa0xbbbf00ff0b00x00bb0xb00baxxxxxxccbbbbbxxaaa",
    "..cccbbsa000.......xaaaaabaaccccaa00xfbbf00ffxba0bb00a0xfx0baaaaxxcbbbbbbbb00aa",
    "..aaaasaa00.........aaaaaaaabaaaaa00bbbbf00ff0xa00b00gggfx0axxxxxacbbbbbbbbx",
    ".axaaaa00...........xxaaaaaabaaaaxxxbbaaf00fx0caggggggggfx0caxxaaabbbbbbbbbx",
    ".aaa00s0............xxxaaaaab00xx00xbaaaf00fx0cagggggggggg0caaxaaabbbbbbbbba",
    "..000xx.............xxxxaaaaa00xa00bbaaaa0xxx0aaggggfggggf0aaaxxxabbbbbbbbba",
    "...xx................xx.aaxxa..bbbbbbaxxa00xx00aggggfgggfff0000xxxxbbbbbbbba",
    "........................aax....cbbbbbaaax0000000gggggggfff.00xxxxxxbbbbxbbbb",
    "...............................cbbbbb00xx000x000ggffggfff...xxxxxxxbbbbxxbbb",
    "...............................bbbbb000xxxx0xxxxffffffff.....0xxxxxxbbbxxbbb",
    "..............................cbbbbaa00xxxxxxxxxf.f.ff.......000xxxxxbbbxbbb",
    "..............................cbbxba...xxxxxxx..f.f..f..f.....aaa0000bbbbbbbx",
    "..............................cbbxaa....xx000........f..f.....aaaaa00.bbbbbbx",
    "..............................cbbxaa.....a0aa.................aaaaa00..bbbbbx",
    "..............................cxbaa......aaaa..................aaaaa0..bbbbbx",
    "..............................cbcaa......aaaa..................aaaaa0...bbbba",
    ".............................cbbb0.......aaa0...................aaaa0...bbbbaa",
    ".............................cbbb........aaa0...................aaaa0....bbbba",
    ".............................bbba........aaa0....................aaa0x...bbbbc",
    "............................cbbbx........aaa0....................aaa0.....bbbx",
    "............................cbbba........aaa0....................aaa0.....cbbx",
    "............................cbbbc.........aa0...................aaa00.....cbax",
    "............................bbbc..........aa0...................aaa0......cba",
    "............................bbbc..........aa0...................aaa0.....cbba",
    "............................bbba..........aa0...................aa00.....bbxa",
    "............................bbb...........aa0...................aa0......bbx",
    "...........................cbbx...........aa0..................aaa0.....cbxx",
    "...........................cbxx...........aa0..................aa00.....cba",
    "...........................cxx............aa0..................aa00.....cxx",
    "...........................ccx............aa0..................aa00....ccxx",
    "...........................cc0............aa0..................aa0x....cbxx",
    "..........................cbb.............aa0..................aa0x....cbx",
    "..........................cxx.............aa0..................aa0x....cbb",
    ".........................cbx..............aa0..................aa0x....cba",
    ".........................cba..............aa0..................aa0x....bba",
    ".......................babba.............aa00..................aa0x....bba",
    ".......................a0aa0.............aaa0..................0a00...bbba",
    ".........................x..............000x0.................000x0...aaxaa",
    ".........................x..............000x0.................000x0...00x00"
  ],
  legend: {
    "0": { m: "shade", step: 0 },
    A: { pal: C.goldLight, glow: true },
    E: { pal: C.moon, glow: true, light: true },
    L: { pal: C.goldLight, glow: true, light: true },
    a: { m: "fur", step: 0 },
    b: { m: "fur", step: 1 },
    c: { m: "fur", step: 2 },
    f: { m: "moss", step: 1 },
    g: { m: "moss", step: 2 },
    h: { m: "antler", step: 1 },
    l: { m: "antler", step: 2 },
    s: { m: "sap", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // A long, slow breath: the ribs rise under the hide and the crown sways.
    waist: 48,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the stars in the nest flare.
    twitch: {
      frames: [9],
      patches: [
        { x: 19, y: 11, rows: [".L", "L.L", ".L"] }
      ]
    }
  }
};
