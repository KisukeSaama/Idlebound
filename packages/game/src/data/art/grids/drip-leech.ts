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
    "............aaaaaa",
    ".........aaa000aaaaa",
    ".......aaaE00EE000aaa",
    "......ccc0EEaaaa0E0abbb",
    ".....cc0EccaaaaaaEbaab00",
    "....cccaEbbbbbbb0bbaabbbb",
    "...cc0PaPPbbbbbb0ba0albbba",
    "..ccc0PPPPPbbbbbbba0allbb00",
    "..ccPPPPrPPbbabbbba0a0b00baa",
    ".ccaPbbrrrPPbabbaaa00000bbaaa",
    ".ccaabxxxrPrbabaaaa000bbbbaaa",
    ".ccabxxxxrrrbaaaaa000bbbbbaa00",
    "ccPPbxxxxxrrbba00000bbbbb0000a",
    "cbabxxxxxrrrba00000aab0bbbaaaaa",
    "cbPPxxxxxrrbb00000la00bbbbbaaaa",
    "cPabxxxxrrrba00a00ll0bbbbbbaaaa",
    "ccaPPbxrrrrba0aa0PPaaab000000aaa",
    ".cPPPbrPrrbb...00bPaa00b0bbbaaaa",
    ".bbbPbrPrbbb....bbb00bbbbbbbbaaa",
    "..bbbbrrbbb.....l000laabbbbaaaa00",
    "..bbbbaaabb.....lbblla000b0aaaa00",
    "....bb00........lbbll00bb00000000",
    "....b...........bbbbb000bbbaaaa00",
    "....b.........lbb000aabbbssssaa00",
    "....b.........00cc0000abbaasss000",
    "....l........bbb00aa000bbaaass00",
    "....ll......xcbbbbaaabbbbaaaaa00",
    ".....l.....lbb0bbbbbaabb00aaas00",
    "..........tcclbbbaabb0bbaasss000",
    "..........tcllabb00abbbbaabb000",
    ".........cccl000a0bb0bbb00aa000",
    "........c000cl0b000b00bba000000",
    ".......cccbblllabb00bbbaaa00000",
    ".......ccccbll000bbb00a00a0000",
    "......bb00llabb00bbbb0aa000000",
    ".....ccccll00aabb00bbbaaa000x",
    ".....cccclbbb0aabbb00ba00000x",
    "....c000cllaabb0bbbbaaaa0000",
    "....cc000llaabbbb00abbaa000",
    "...cccccalaa00bbb0aabb00000",
    "...cccccaaaaabbbbbaa000000",
    "..bb00laaaaabbb00bbb000000",
    "..cccbLa000abbbbb00bba000",
    "..ccbbPabb0000bbbbbaaa000",
    ".ccbbbPaaaabb00bbaaa0000",
    ".cccbbPaaaabbbb00aaaa000",
    ".bb000Paaabbbbbbb000a00",
    ".bbbbbPbabbb00000b00000",
    ".bbblaaaaabbbbbbbbbb000",
    ".bbbbaa00a00000ssaa0000",
    ".b00000bbbbbbaaaaaaa000",
    ".bbbbaaaabbbbbaaaaaaaa0",
    ".bbbblaaaaab0asssss0000",
    ".bbbblla00000baaaaaaaa00",
    ".bbbbbl00bbbbbba0000aa000",
    ".0000bbbaaa00000bbbbb0000b",
    ".0bbbb000bbbbbbb000000000bb0bb",
    ".bbbb0000aabb000bbb0PPb0bbbbbbbbb",
    ".bb00baaaaa000bbb000bb00bb0bbbbbb0",
    ".bbbbbaaa00bbbbb000b0b0bbb0bb00b00bx",
    "..bbbbb00bbbbb00b00b0b0PPPbbbbbbbbb0b",
    "..bbl000laaab00bb0b0b00bb0bbbbaaaaa0bbx......ux",
    "..bbbbbblaaabbbbbbb0b00bb0bb0baaaaabbb0bb..uuutt",
    "..b0bbbbla000bb0bb0bb0bb0bbb0basaaabb0b0bbbuctttt....uuu",
    "...bbbbba000aaaabb0bb0bb0bbbbbbsbtlbb0blllbcccbbauuuuuuutu",
    "...bbbbbb00aaaaab0bbb0bb0bb0bbbbb0bbb0blllbcbbbbauuuuuuutuuttt",
    "....abbbbbaaa0aaa0ab00b00bb0bb0bb0bb00bbbbbbbbbbaauuuuu00uuuut0",
    "....abbbbbaaa0aaa0aa0bb0abb0bb0bb0bb0b00bbbbbbbbaauuuutt0uuuuu0st",
    "....aabbbaaa00aa0aaa0aa0aa0abb0b00bb0bbbbb0bbbbba00uttss0ttutt0sttt",
    ".....abbaaaa0aaa0aaa0aa0aa0aaa0b00aa0bbbbb0bbbbb000tttts0tttttttuttttt",
    "......aaaaa00aaa0aaa0aa0aa0aa00aaaaa0b00aa0bbbbb000ttttt0tttttttutt000tt",
    ".......aaaa0aaaa0aaa0a00aa0aa00aaaaa0000000bbbba00ttttttttttttttttttt0tttt",
    "........aaaaaaaa0aaaaa0aaa0aa00aa0a00000000bbba000tttttttssttt00ttttt0tttttt",
    ".........a0aaaa0aaa00a0aa00aaaaa000000000000aa000ssstss00sss0000sssst0tstttttt",
    "...........0000000a00a0aa00aaa0a0000000000000000ssssssss0ss0ss00sssss00stsssttt0",
    "..............000000000000000000000000xx0.00000000000000000000000000000000000000",
    "..................00000000000000000........xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ".........................0000000"
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
    waist: 70,
    breath: [0, 0, 1, 1, 2, 2, 2, 1, 1, 0],
    // Once in a cycle, the slime on the lip stretches toward the floor.
    twitch: {
      frames: [6],
      patches: [
        { x: 4, y: 27, rows: ["b"] }
      ]
    }
  }
};
