import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Court Jester: laughs every time you arrive, as if he knew you would. He did. A lean
 * jester lunging on bandy legs, his motley of diamonds faded to greys, a dagged ruff and a
 * hood of three limp points, every tip hung with a gold bell; a pale lacquer mask grinning
 * ear to ear, violet fire deep in its eye holes. He thrusts a bauble sceptre at the
 * company, a tiny grinning head in a tiny crown on top; the other hand flung up behind.
 */
export const COURT_JESTER: CreatureGrid = {
  rows: [
    "......................................bbb",
    "...................................bbbbaaa",
    "................................bbaaaa1111aa",
    "...............................bbaaa000..1111",
    "..............................bbaa111......11GG",
    ".............................bbaaa1..........GG",
    ".............................baaa11..........x",
    "................ccc.........bbaaa1",
    "..............cddccdd.......baaaa1",
    "...........ccddcccccddcc...bbaaaaa",
    ".........cdddcccbccccccccccbbbbbbaa",
    ".........cbbaaab.cccccccccbbbbbbbaaacccxccccc",
    "........ccc.......ccccccccbbbbaaaaaacccccccccc",
    ".......caa..........ccccLcbbLLaaaaaaaaccccccccc",
    ".......ca............ccdddddLdaaaaaaa1cccbbcbcc",
    "....G.xc.............ddddddddddaaaaa11cbbbabbccc",
    "...GG.G.............11ddddddddddaaaaa11......bccc",
    "..GGGGG.............dddddddddddaaaaaa1........bcc....aa",
    ".GGGGGG............xxxdddddxxxdaaaaaa1.........ccx...aax",
    "..GGGGG............dxExxdxxFFxcaaaaaaa1........ccb...aaaa",
    "..ddddg...........dddEddddxExdcaaaaaa11.........cb..baaaaa",
    "..ddddc...........LLbbddddddddcaaaaa110.........cb..aaaaa",
    "..dddFc...........ddddddddddddcaaaaa11...........c.baaaaa",
    "..dddxc............xdddddddddbba111110...........cbaaaaaa",
    "..xxxx.............xxxdxxddxx000000000...........Gaa111a",
    "...bbb..............xxxxxxxxx00000000cb.........GGG11",
    ".bbbbbx.............ccxxxxccbcccccccccbcc......bbxg0",
    ".b111111.............ccccbbbcccccccccccccc....bbaa1",
    "GG....gG.............c11bb11ccaaccaacc1acb....aaa1",
    "......gg.............aa11daaaaaaabaaa1111...bbaa11",
    "......gg..............aadda11caaabbaabb....baaa11",
    ".......g..............abaaaaccxaadccbbbb.baaaa11",
    "........g.............baaaa1cbxGGccaGGbbbaaaa11",
    "........g............caacba1cbxGGccaGGbxaaaa11",
    "........gg..........dccccbbaaa0accaaaaaa1aa1",
    ".........gg........dcccccbbaaa0aaaaaaaaa111",
    ".........gg.......ccccaabbbcaa0accaaaaaa00",
    "..........gg.....bbaca11bxccc10accaaabbxx",
    "..........bbbbbbcaaaa11cbxccc111cccaabbxx",
    "..........bbbbbcccaaa.bcxxccccb1ccccbbb00",
    "...........bbbaccbaa..bcc1acccbaaccccab00",
    "...........aaaabbb....ccc1accc111bbba10aa",
    "............gg........ccaaaaccaaaabb1111x",
    ".............gg.......baaaaaaaaaaaaaa111",
    ".............xx.......bbaaaacaaaaxba1101",
    "......................xcaaaacbbaabbb1101",
    "......................0ccaa0c0ba0bbbb111",
    "......................000000000000000000",
    "......................bbbx11bbbbb1bbbb00",
    "......................bbbx111bbb11bbaa111",
    "......................aaax1111a0011aa0010",
    "......................a1a0011110011000000",
    ".......................10011xx1001111xx000",
    ".......................b0cc11100.11a1011.G",
    ".......................bcccba100.1aa0aa11G",
    "......................GGccccc00...1GGaaa1G",
    ".....................dGccccbbG0....GGaaaa1",
    "....................cccccbbbGG.....GGaaaa1",
    "....................cccccbbbbG......xaaaaa",
    "...................cccccbba..........aaaaa1",
    "..................cccbcbbaa..........aaaaa1",
    ".................ccccbbbb.............aaaa11",
    "................ccccbb11..............aa1aa1",
    "................ccccba1................11aaa1",
    "................ccbb11..................1aaa1",
    "................ccbbb....................aaa1x",
    "................ccbb.....................aa11x",
    "...............ccbba.....................aa11x",
    "...............cbbba.....................aa11",
    "....G..........cbbb1......................a11",
    "...xxx.........cbba1......................a11",
    "....1..........bbba1......................a11",
    "....b..........bba1.......................a11",
    "...xa..........bba1.......................a11........ba",
    "....aa.........bba1.......................aa0.......bbaa",
    ".....aa.......bbba........................aa0......bb1a",
    "......abbbbbbbbbaa........................bbbaaa..aaa1",
    ".......aaaaaaaaaaaa.......................aaaaaaaaaaa1",
    "..........aaaaaaaaa1.....................baaaaaaa111",
    "...........a11111111.....................10000000"
  ],
  legend: {
    "0": { m: "dark", step: 1 },
    "1": { m: "dark", step: 2 },
    E: { pal: C.moon, glow: true },
    F: { pal: C.violetFire },
    G: { m: "bells", step: 2 },
    L: { pal: C.moon, glow: true, light: true },
    a: { m: "motley", step: 1 },
    b: { m: "motley", step: 2 },
    c: { m: "motley", step: 3 },
    d: { m: "motley", step: 4 },
    g: { m: "bells", step: 1 },
    x: { pal: C.ink }
  },
  idle: {
    // A silent laugh: the shoulders shake up and down, the bells with them.
    waist: 49,
    breath: [0, 0, 1, 1, 2, 2, 1, 1, 0, 0],
    // Once in a cycle, the bauble sceptre gives a little shake.
    twitch: {
      frames: [5],
      patches: [
        { x: 0, y: 9, rows: ["..........dd", "..........bb", "........c.._", ".......caa_", "........._", "....G.c._", "...G_.G_", ".....G", ".G", "._", "..ggggg", "......c", ".....F", ".....d", "..xx.._", ".._", ".bb...x", "..11111", "GG____gG", "g_.....g", "", "......_", "........g", "", ".........g", "........_", "", ".........__"] }
      ]
    }
  }
};
