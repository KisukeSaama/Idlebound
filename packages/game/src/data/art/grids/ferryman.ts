import { C } from "../palette";
import type { CreatureGrid } from "../types";

/**
 * The Ferryman (BIBLE 8.4): he asks for a coin to cross. There is nothing to cross; pay
 * him anyway. A tall hooded figure standing in the bow of a half-sunk punt, the stern going
 * under the black water, a long pole planted behind him and a will-o'-wisp caught in an
 * iron lantern on the bow post. His robe falls to a ragged, dripping hem; one bony hand
 * reaches out to the company, palm up, for the fare. The hood is empty: no face, only two
 * coins where the eyes should be.
 */
export const FERRYMAN: CreatureGrid = {
  rows: [
    "..........................................bb",
    "..........................................bb",
    "..........................................bb",
    "..........................................bb",
    "..........................................bb",
    "..........................................cb",
    "..........................................cb",
    "..........................................cb",
    "..........................................b3",
    "..........................................bb",
    "............................hh............bx",
    "..........................hhhh3...........bx",
    "........................hhhhh333..........bb",
    ".......................hhhhhh333..........bb",
    "......................hhhhhh3333...........b",
    ".....................hhhhhhh33333..........b",
    "....................hhhhhhh033333..........b",
    "....................hhhxxh3033333..........b",
    "...................hhxxxxx33333333.........b",
    "...................hxxxxxx33333333.........b",
    "...................xxxxxxxx33333333........b",
    "...................xxxxxxxx333333x0........b",
    "...................xEExxExx3333333x........b",
    "..................xxExgxEgg3333333x........hh",
    "..................xxgggxggg33333330.......hhh",
    "..................xxxxxxxxx33333330.....33hhh",
    "...................xxxxxxxx33333333x....33h3h",
    "...................xxxxxxxx33333333x...33300",
    "...................xxxxxxx3333333000...3330bb",
    "...................xxxxxxh3h3330000...33300b3",
    "....................hhhhhhhhhhhhh333333330.b3",
    "....................hhhhhh3hhhhhh33333330..b3",
    "....................hh3333333333333333300..bb",
    "....................h3333333333333333300...bb",
    "...................hh3333333333333333x.....bx",
    "...................hhh333333333333333.......x",
    "...................hhhhh3333333333333.......b",
    "..................hhh3333333333333330.......b",
    ".................hhh33303333033330330.......b",
    "................hh333300333xxx3330030.......b",
    "...............hh3333003333xxx330x300.......a",
    "..............hhh333303333xx3xx303330.......b",
    ".............hh3333000h333x33xx0033300......b",
    "............hh3330000hh333x33x3333333x......b",
    ".....hh..hhhh3333333hhh333xx333333333x......b",
    "......hhhhhh3333333333x333x3303333333x......b",
    ".....hhhhhh33333333333x333x333333x333x......b",
    "..............33333330x333x333333x333x0.....b",
    "...............3333300x3333x33333x333x0.....b",
    "...............333330333333x33333x333x0.....bb",
    "................30330333333x333333333x0.....bb",
    ".....b..........30h3x3x3333x333333333x0.....bb",
    "....cb..........3.h3x3x333xx33333x333x00....bb",
    "...cabb...........h3x3x3333333333x333x00....bb",
    "......bb..........h3x3x3333333333x333x00....bb",
    ".......bb.........hh3333333333333x333x00....b3",
    ".......bb.........hh0333333333xx33333000....b3",
    ".0A0A.bb.........h3h03x3333333xx33333300....bb",
    ".AL0LAbb.........h3333x3333333xxx3333330....bb",
    "0AL0LAbb.........h3333x33333333xx3333330x...bb",
    "00L0L00b.........33333x33333333xx3x33300x...bb",
    "0AL0LAb..........333x33333333330x33x3300x...ba",
    ".AL0LAb..........333xx3333333330x3xx30000...ba",
    ".AA0AAb..........333x03333333330x3xx33000...ba",
    "...A.bb.........h333x033330033xxx0xx33000x..bb",
    "...c.bbb........3333xx0x00000300x00x30x00x..bb",
    "..bbbbbb........3333xx0x00000000xxx03xxx0x..bb",
    "...bbbbb.........33xxx033xxx000xxxx03xxxxx..bb",
    "....bbbbbcbcccccc33xxxx33xxxx33xxxx03xx.....bb",
    "....bbbbaabbbbabb33xxxx33xxx000xxx.33xx.....bb",
    ".....bbba00bbbabb33xxbb33xxbb00xx...xx......bb3",
    ".....bbbb0000000c0xbbbb30xxbbb0xxbc.bxb.....bb3",
    ".....bbbbbbbbbbbb000000xxxbccbbbbbbbbbbbccc.cbb",
    ".....0000bbbbbbbbbbbbb0bxx0000bbbbbbbbbbbbbbcccc",
    "......00000000bbbbbbbbbbbbbb00000000bbbbbbbbbbbbbcccc",
    ".......aaaaa0bb0b00000000bbbbbbbbbbbb00000000bbbbbbbbbcaccccc",
    ".........aaaaaabbbbbbb00000000bbbbbbbbbbbb00000000bbbbbbbbbbbbccc",
    "..........0000aaaaaabbbbbba000000000bbbbnbbnnnn0xxnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
    "...........0000000naaaaaaannnnnnnnnnnnnxxnnnnnnnnnnxnnnnnnnnnnxxxxnnnnnxxxxxxxx",
    "..AAAnnnnnnnnnnnnnnnnnxxxnnxxnnxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0xx00x",
    ".nnnnnnxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx00x00000000000000xx",
    "..0x000000000000000000000000000000000000000000000000000000000000xxxxxxxxxxxxxx",
    "...............xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0000000000x",
    ".............................................xxxx00000xxxxxxxxxx0000000xxx"
  ],
  legend: {
    "0": { m: "robe", step: 0 },
    "3": { m: "robe", step: 1 },
    A: { pal: C.mireAccent, glow: true, light: true },
    E: { pal: C.goldLight, glow: true },
    L: { pal: C.mireLight, glow: true, light: true },
    a: { m: "wood", step: 1 },
    b: { m: "wood", step: 2 },
    c: { m: "wood", step: 3 },
    g: { m: "coin", step: 3 },
    h: { m: "bone", step: 1 },
    n: { m: "water", step: 2 },
    x: { pal: C.ink }
  },
  idle: {
    // He does not breathe; the hood lifts and settles, slow as the water.
    waist: 53,
    breath: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    // Once in a cycle, the wisp in the lantern gutters.
    twitch: {
      frames: [9],
      patches: [
        { x: 1, y: 58, rows: [".A.A", ".A.A", "AA.AA", ".A.A", ".A.A"] }
      ]
    }
  }
};
