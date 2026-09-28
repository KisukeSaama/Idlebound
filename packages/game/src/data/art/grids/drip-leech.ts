import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Drip Leech (BIBLE 8.3): it hangs from the ceiling and drinks whatever falls, mostly
 * time. A fat ringed leech, wet and glistening, reared up like a cobra over the company;
 * its tail is still sealed to the broken stalactite it fell with, lying on the floor. The
 * round mouth gapes forward on a ring of hooked teeth, a crescent of cold eyespots in the
 * dark brow above it, slime hanging from the lip.
 */
export const DRIP_LEECH: CreatureGrid = {
  rows: [
    "..............aaaaaa",
    "..........aaa0000aaaaa",
    "........aaa0000EE000aaa",
    ".......ccc0EEaaaaa0E0abbb",
    "......ccc00caaaaaaaEaaabb0",
    ".....ccc0Eccbbaaaa0bbaabb0b",
    "....ccccabbbbbbbbb0bbaaabbbb",
    "...ccc0PaPPbbbbbbb0ba0aalbbba",
    "..cccP0PPPPPbbbbbbbba0aallbb00",
    "..cccPPPPrPPbbbabbbba0a0bb00baa",
    ".cccaPbbrrrPPbbabbaaa000b00bbaaa",
    ".ccaaabxxxrPrbbabaaaa0000bbbbaaa",
    ".ccaabxxxxrrrbbaaaaa0000bbbbbaaa0",
    "ccPPbbxxxxxrrbbaa0a0000bbbbb00000",
    "ccPPbxxxxxxrrbbaa00000abbbb00aaaaa",
    "cbaabxxxxxrrrba000000aaa00bbbaaaaa",
    "cbPPbxxxxxrrbba00000la00bbbbbbaaaaa",
    "cPabbxxxxrrrba000a00ll0bbbbbbbaaaaa",
    "ccaPPbbxrrrrba.0aa0PPaaaab000000aaaa",
    ".cPPPbbrPrrbb....00bPaa000b0bbbaaaaa",
    ".bbbPbbrPrbbb.....bbb00bbbbbbbbbaaaa",
    "..bbbbbrrbbb......l000laaabbbbaaaaa0",
    "..bbbbbaaabb......lbbllaa000b0aaaaa00",
    "....bbb00.........lbbll00000000000000",
    ".....b............bbbllaaabbbbbaaaa00",
    ".....b...........bbbbbb0000bbbaaaaa00",
    ".....b..........lbb000aaabbbsssssa000",
    ".....b.........t00cc0000aabbaassss000",
    ".....l........lbbb00aa0000bbaaasss00",
    ".....ll......xccbbbbaaaabbbbaaaaas00",
    ".....ll.....lbb00bbbbbaabbb00aaass00",
    "............cccbbbaaabb00bbaassss000",
    "...........tccllbbb00aabbbbaabb0000",
    "...........bbll0aaa000bbbb00abb0000",
    "..........ccccl000aabb00bbb00aa0000",
    ".........c000cclbb000bb00bba000000",
    "........cccbbbllaabb00bbbaaaa00000",
    "........ccccbbl0000bbb00aa00a0000",
    ".......bb00llaabb00bbbb00aa000000",
    "......ccccll00aaabb00bbbaaaa000x",
    "......cccclbbb00aabbb00baa00000x",
    ".....l00ccllaabb00bbbbaaaaa0000",
    "....ccc000llaaabbbbbbaabaaa0000",
    "....cccccllla0abbbb00abbb00000",
    "...ccccccaaaa000bbbbaabbb00000",
    "...ccccccaaaaabbbbbbaa0000000",
    "..bb000laaaaaabbb00bbb0000000",
    "..cccbbLa000abbbbbb00bba0000",
    "..ccbbbPabb0000bbbbbbaaa0000",
    ".ccbbbbPaaaabbb00bbaaa00000",
    ".ccccbbPaaaabbbbb00aaaa0000",
    ".bb0000Paaaabbbbbbb000a000",
    ".bbbbbbPbbbbb00000bbb00000",
    ".bbbbbaaaaabbbbbbb00000000",
    ".bbbllaaaaaabbbbbbbbbb0000",
    ".bbbb0a000a000000ssaa00000",
    ".b000000bbbbbbbaaaaaaaa000",
    ".bbbbbaaaabbbbbaaaaaaaaaa0",
    ".bbbbblaaaaabb0asssss00000",
    ".bbbbblaa000000baaaaaaaa000",
    ".bbbbbll00bbbbbbba00000a000",
    ".bb000bbbaaab00000bbbbba0000",
    ".00bbbbaaa000bbbbbbb00000000bb0",
    ".bbbbb0000bbbbbbb000b0000b0bbb0bbb",
    ".bbbb0000aaaab000bbbb0PPbb0bbbbbbbbbb",
    ".bb00bbaaaaa000bbbb000bbb0bbb0bbb0bbb0",
    ".bbbbbbaaa00bbbbbb000b0bb0bbb0bbb0bb00bx",
    "..bbbbbb00bbbbbb00b00b0b00PPPbbbbbbbbbb0b",
    "..bbbl000laaabb00bb0b0bb0bbb0bbbbbaaaaa0bbx.......ux",
    "..bbblbbblaaaabbbbbbb0bb0bbb0bb0baaaaaabbb0bbb..uuutt",
    "..b00bbbblaa00bbb0bb0bbb0bb0bbb0baasaaabbb0b0bbbuutttt.....uuu",
    "...bbbbbbaa000aaa0bb0bb0bbb0bbb0bbssttlbb0bb0bbbcccbbbx.uuuuuutt",
    "...bbbbbbb000aaaaabb0bb0bbb0bbbbbbbbbbllb0bllllbccbbbaauuuuuuuttuu",
    "....abbbbbbaaaa0aaa0bbb0bb00bb0bbb0bb0bbb0bbbbbbcbbbbaauuuuuuu0uutttt",
    "....abbbbbbaaaa0aaa0aa00bb0bbb0bbb0bb0bb00b0bbbbbbbbbaaauuuuuu0uuuuut0u",
    ".....abbbbbaaa0aaaa0aa0bbb0abb0bbb0bb0bb0bb0bbbbbbbbbaaauuuutt0uuuuuu0stt",
    ".....aabbbaaaa0aaa0aaa0aaa0aa0abbb0b00bb0bbabbb0bbbbbaa00uttss0tttutt0stttt",
    "......abbaaaa0aaaa0aaa0aaa0aa0aaa00b00aa0bbabbb0bbbbba000tttts0ttttttttutttttt",
    ".......aaaaaa0aaaa0aaa0aaa0aa0aaa0aaaaaa0bb0aaa0bbbbba000ttttt0ttttttttuttt000tt",
    "........aaaa0aaaaa0aaa0aa00aa0aaa0aaaaaa00000000bbbbaa00ttttttttttttttttttttt0tttt",
    ".........aaa0aaaaa0aaaaaa0aaa0aaa0aaa0a000000000bbbaa000ttttttttsstttt0tttttt0tttttt",
    "..........a0aaaaa0aaa00aa0aaa0aaa0aa0000000000000baa000ssstsss00sss0000sssstt0tsttttt",
    "...........00a0aa0aaa00aa0aa00aaa0aa0000000000000aa00sssssssss00ssssss0ssssss0ssttssttt",
    ".............0000000a00000aa00aaa000000000000000000000sssssssss0s00ss00ssssss00ssssssstt0",
    "................00000000000000000000000000xxx..0000000000000000000000000x0000000000000000",
    "....................0000000000000000000.........xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "............................00000000"
  ],
  legend: {
    "0": { m: "maw", step: 0 },
    E: { pal: C.shardLight, glow: true },
    L: { pal: C.shardLight, glow: true, light: true },
    P: { m: "bone", step: 3 },
    a: { m: "skin", step: 0 },
    b: { m: "skin", step: 1 },
    c: { m: "skin", step: 2 },
    l: { m: "bone", step: 2 },
    r: { m: "maw", step: 2 },
    s: { m: "rock", step: 1 },
    t: { m: "rock", step: 2 },
    u: { m: "rock", step: 3 },
    x: { pal: C.ink }
  },
  idle: {
    // The reared column swells and sinks as it drinks the air.
    waist: 78,
    breath: [0, 0, 1, 1, 2, 2, 2, 1, 1, 0],
    // Once in a cycle, the slime on the lip stretches toward the floor.
    twitch: {
      frames: [6],
      patches: [
        { x: 5, y: 30, rows: ["b", "l"] }
      ]
    }
  }
};
